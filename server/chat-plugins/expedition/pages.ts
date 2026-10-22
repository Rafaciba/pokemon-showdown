/**
 * pokemon-showdown-custom: páginas e comandos do jogador na Expedição.
 *
 * Páginas:
 *   view-expedicao                  variações disponíveis, com a run de cada uma
 *   view-expedicao-run-<variação>   a run: time inicial, mapa do ato, nó atual e time
 *   view-expedicao-admin            painel do admin (admin.ts)
 *
 * Comandos (/expedicao, ou /expedition):
 *   /expedicao                          abre a lista
 *   /expedicao iniciar <variação>       começa uma run
 *   /expedicao inicial <variação>,<n>   escolhe o time inicial n (0, 1 ou 2)
 *   /expedicao avancar <variação>,<nó>  vai para um nó ligado ao atual
 *   /expedicao escolha <variação>,<id>  escolha no nó atual ("battle" começa ou retoma a batalha)
 *   /expedicao aprender <variação>,<n>  golpe novo: esquece o golpe n (0 a 3) ou "nao"
 *   /expedicao evoluir <variação>,<espécie>  evolui para a espécie, ou "nao" (adia)
 *   /expedicao capturar <variação>,<keep | uid de quem sai | nao>  selvagem vencido
 *   /expedicao item <variação>,<uid>,<item>  dá um item da mochila (vazio: guarda o atual)
 *   /expedicao usar <variação>,<item>,<uid>  usa um item da mochila (poção, TM...) num Pokémon
 *   /expedicao desistir <variação>      encerra a run (fica no histórico)
 *
 * Só contas registradas jogam.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import type { TextLanguage } from '../../../sim/dex-data';
import { monTooltip, moveDescription, moveLine, moveTooltip, statsTable, withTip } from './tooltips';
import { getStore } from './state';
import { getVariant, listVariants } from './variant';
import { getNodeType, type NodeChoice } from './nodes';
import { BOSS_NODE, reachableNodes, type ActMap } from './map';
import {
	abandonRun, chooseInNode, chooseStarter, currentMap, currentNodeView, decideCapture, decideEvolve, decideLearn,
	enterNode, runPhase, setHeldItem, startRun, useBagItem, usesBalls, variantAvailable, visitedNodes, BOX_SIZE,
	type RunProblem,
} from './runs';
import { ballIdByName, ballsInBag, catchChance } from './capture';
import type { RunDecision } from './progression';
import { currentEncounter, hasOpenBattle } from './battles';
import { renderAdminPage } from './admin';
import { consumable, consumableDescription, isHeldItem, isKeyItem, itemApplies, itemDisplay, tmMove } from './economy';
import { trainerSpriteImg } from '../gym-challenge/trainer-sprites';
import type { ExpeditionRun } from './store';
import { expForLevel, MAX_LEVEL, type RunMon } from './team';

const PAGE = 'view-expedicao';
/** Caixa das páginas; sem cortar os tooltips (a .infobox do PS tem overflow-x: auto, que os cortaria). */
const BOX = '<div class="infobox" style="overflow: visible">';

function isPlayer(user: User) {
	return user.named && user.registered;
}

function problemText(TL: Translator, problem: RunProblem) {
	switch (problem) {
	case 'novariant': return TL`Expedition not found.`;
	case 'disabled': return TL`This expedition is not available.`;
	case 'active': return TL`You already have an expedition in progress in this variant.`;
	case 'toomany': return TL`You started too many expeditions in a short time. Wait a few minutes.`;
	case 'norun': return TL`You have no expedition in progress here.`;
	case 'nostarter': return TL`The starting team was already chosen.`;
	case 'badchoice': return TL`Invalid choice.`;
	case 'unreachable': return TL`You can only go to a node connected to where you are.`;
	case 'nodeopen': return TL`Finish the current node first.`;
	case 'decisions': return TL`Decide about your Pokémon first.`;
	case 'nodecision': return TL`There is nothing to decide right now.`;
	case 'nobattle': return TL`The battle could not be started. Try again in a moment.`;
	case 'teamfull': return TL`Your team is full: choose who leaves.`;
	case 'inbattle': return TL`Finish the battle first.`;
	case 'noitem': return TL`That item is not in your bag.`;
	case 'nomoney': return TL`You don't have enough money.`;
	case 'soldout': return TL`That item is sold out.`;
	case 'noeffect': return TL`It won't have any effect.`;
	case 'badtarget': return TL`That Pokémon can't learn this move.`;
	case 'boxfull': return TL`The Computer is full.`;
	case 'lastmon': return TL`Your team needs at least one Pokémon.`;
	default: return TL`You are not in a node.`;
	}
}

// --- Partes das páginas -----------------------------------------------------------------

/** Barra de progresso (fração de 0 a 1), com a cor dada. */
function bar(fraction: number, color: string, title = '') {
	const width = Math.round(Math.max(0, Math.min(1, fraction)) * 100);
	return `<div title="${title}" style="width: 90px; height: 7px; background: rgba(128,128,128,0.3); border-radius: 4px; ` +
		`overflow: hidden; display: inline-block; vertical-align: middle"><div style="width: ${width}%; height: 100%; ` +
		`background: ${color}"></div></div>`;
}

/** Experiência do nível atual até o próximo: barra, com o que falta no título. */
function expBar(TL: Translator, mon: RunMon) {
	if (mon.level >= MAX_LEVEL) return bar(1, '#3b8fd6', TL`Maximum level`);
	const start = expForLevel(mon.level);
	const toNext = expForLevel(mon.level + 1) - mon.exp;
	return bar((mon.exp - start) / (expForLevel(mon.level + 1) - start), '#3b8fd6', TL`${toNext} Exp. to the next level`);
}

function hpBar(mon: RunMon) {
	const color = mon.hp > 0.5 ? '#4a7' : mon.hp > 0.2 ? '#e8b221' : '#d33';
	return bar(mon.hp, color);
}

/** Ícone e nome de um item: do PS (psicon) ou do nosso catálogo (ícone oficial em sprites/itemicons). */
function itemLabel(item: string) {
	const display = itemDisplay(item);
	const name = Utils.escapeHTML(display.name);
	if (display.psItem) return `<psicon item="${Utils.escapeHTML(display.psItem)}" /> ${name}`;
	const src = `https://${Config.routes.client}/sprites/itemicons/${display.icon}.png`;
	return `<img src="${src}" width="24" height="24" alt="" style="vertical-align: middle" /> ${name}`;
}

/** Descrição de um item (tooltip): o nosso texto (itens de uso), o golpe (TM) ou o texto do PS. */
function itemDescription(TL: Translator, lang: TextLanguage, item: string) {
	const usable = consumable(toID(item));
	const move = tmMove(item);
	const name = Utils.escapeHTML(itemDisplay(item).name);
	if (move) return moveTooltip(move, lang);
	const text = usable ? consumableDescription(TL, usable) :
		Dex.text.get(Dex.items.get(item), lang).desc || Dex.text.get(Dex.items.get(item), lang).shortDesc || '';
	return `<strong>${name}</strong><br />${Utils.escapeHTML(text)}`;
}

/** Item com o tooltip da descrição. */
function itemWithTip(TL: Translator, lang: TextLanguage, item: string, suffix = '') {
	return withTip(`${itemLabel(item)}${suffix}`, itemDescription(TL, lang, item));
}

/** Dinheiro com separador de milhar no idioma do jogador. */
function formatMoney(value: number, lang: TextLanguage) {
	return `${value.toLocaleString((lang as string) === 'pt' ? 'pt-BR' : 'en-US')} \u20BD`;
}

/** Cores dos selos de status (fora da batalha, o CSS das batalhas do PS não vale). */
const STATUS_COLORS: { [status: string]: string } = {
	brn: '#e0602c', par: '#c9a400', psn: '#a050a0', tox: '#7a2f7a', slp: '#7a7a7a', frz: '#3a9ad9',
};

/** Selo do status. */
function statusBadge(mon: RunMon) {
	if (!mon.status || mon.fainted || !STATUS_COLORS[mon.status]) return '';
	return ` <span style="background: ${STATUS_COLORS[mon.status]}; color: #fff; font-size: 9px; font-weight: bold; ` +
		`padding: 1px 4px; border-radius: 3px">${mon.status.toUpperCase()}</span>`;
}

/** Item que o Pokémon segura; na run, com a troca pela mochila. */
function itemCell(
	TL: Translator, lang: TextLanguage, mon: RunMon, manage: { run: ExpeditionRun, variantId: string } | null
) {
	const current = mon.item ? itemWithTip(TL, lang, mon.item) : `<small>${TL`No item`}</small>`;
	if (!manage) return current;
	const bag = [...new Set(manage.run.items.filter(isHeldItem).map(item => toID(item)))]
		.filter(id => id !== toID(mon.item));
	if (!bag.length && !mon.item) return current;
	const options = (mon.item ? [`<option value="">${TL`Put it in the bag`}</option>`] : []).concat(bag.map(id => (
		`<option value="${id}">${Utils.escapeHTML(Dex.items.get(id).name)}</option>`
	)));
	return `${current}<br /><form data-submitsend="/expedicao item ${manage.variantId},${mon.uid},{item}">` +
		`<select name="item">${options.join('')}</select> ` +
		`<button class="button" type="submit">${TL`Change`}</button></form>`;
}

/** Pokémon com o tooltip dos atributos e golpes. */
/** Ícone pequeno da bola em que o Pokémon está (só visual). */
function ballIcon(mon: RunMon) {
	const id = ballIdByName(mon.ball);
	const icon = id ? consumable(id)?.icon : null;
	if (!icon) return '';
	const name = Utils.escapeHTML(mon.ball!);
	return `<img src="https://${Config.routes.client}/sprites/itemicons/${icon}.png" width="16" height="16" alt="${name}" ` +
		`title="${name}" style="vertical-align: middle" /> `;
}

/** Estrela dos shiny. */
function shinyMark(TL: Translator, mon: RunMon) {
	return mon.shiny ? ` <span title="${TL`Shiny`}" style="color: #d4a017">&#9733;</span>` : '';
}

function monName(TL: Translator, lang: TextLanguage, mon: RunMon) {
	const species = Utils.escapeHTML(mon.species);
	return ballIcon(mon) + withTip(`<psicon pokemon="${species}" /> <strong>${species}</strong>`, monTooltip(TL, lang, mon)) +
		shinyMark(TL, mon);
}

function monLine(
	TL: Translator, lang: TextLanguage, mon: RunMon, manage: { run: ExpeditionRun, variantId: string } | null
) {
	const level = mon.level;
	const hp = Math.round(mon.hp * 100);
	const moves = mon.moves.map(id => Utils.escapeHTML(Dex.moves.get(id).name)).join(', ');
	const state = mon.fainted ? `<strong>${TL`Fainted`}</strong>` : `${hpBar(mon)} ${TL`HP ${hp}%`}${statusBadge(mon)}`;
	return `<tr><td>${monName(TL, lang, mon)}</td>` +
		`<td>${TL`Lv. ${level}`}<br />${expBar(TL, mon)}</td><td>${state}</td><td>${itemCell(TL, lang, mon, manage)}</td>` +
		`<td><small>${moves}</small></td></tr>`;
}

/**
 * Tabela do time (o tooltip de cada Pokémon mostra atributos e golpes); com `manage`, o
 * item de cada um pode ser trocado pela mochila.
 */
function teamTable(
	TL: Translator, lang: TextLanguage, team: RunMon[], manage: { run: ExpeditionRun, variantId: string } | null = null
) {
	return `<div class="ladder"><table><tr><th>${TL`Pokémon`}</th><th>${TL`Level`}</th><th>${TL`State`}</th>` +
		`<th>${TL`Held item`}</th><th>${TL`Moves`}</th></tr>` + team.map(mon => monLine(TL, lang, mon, manage)).join('') +
		`</table></div>`;
}

/** Mochila da run: os itens guardados. */
/**
 * Mochila da run: os itens guardados. Os de uso (poções, Rare Candy, TMs) têm o "usar
 * em" (fora da batalha); os de segurar vão aos Pokémon pela coluna Item do time.
 */
function bagSection(TL: Translator, lang: TextLanguage, run: ExpeditionRun, variantId: string, canUse: boolean) {
	if (!run.items.length) return '';
	const counts = new Map<string, number>();
	for (const item of run.items) counts.set(item, (counts.get(item) || 0) + 1);
	const held: string[] = [];
	const usable: string[] = [];
	const keys: string[] = [];
	for (const [item, count] of counts) {
		const label = itemWithTip(TL, lang, item, count > 1 ? ` &times;${count}` : '');
		const usableItem = consumable(item);
		const move = tmMove(item);
		// Itens-chave (Bicicleta, Old Rod, fósseis): só ficam na mochila
		if (isKeyItem(item)) {
			keys.push(label);
			continue;
		}
		if (isHeldItem(item) || (!usableItem && !move) || usableItem?.effect.kind === 'ball') {
			held.push(label);
			continue;
		}
		// Só os Pokémon em quem o item faz efeito agora
		const targets = run.team.filter(mon => itemApplies(item, mon));
		const options = targets.map(mon => `<option value="${mon.uid}">${Utils.escapeHTML(mon.species)}</option>`).join('');
		let form = '';
		if (canUse && targets.length) {
			form = ` <form data-submitsend="/expedicao usar ${variantId},${Utils.escapeHTML(item)},{uid}" style="display: inline">` +
				`<select name="uid">${options}</select> <button class="button" type="submit">${TL`Use`}</button></form>`;
		} else if (canUse) {
			form = ` <small>${TL`No Pokémon can use it right now.`}</small>`;
		}
		usable.push(`<tr><td>${label}</td><td>${form}</td></tr>`);
	}
	let buf = `<h3>${TL`Bag`}</h3>`;
	if (keys.length) buf += `<p><strong>${TL`Key items:`}</strong> ${keys.join(' &middot; ')}</p>`;
	if (usable.length) buf += `<table>${usable.join('')}</table>`;
	if (held.length) {
		buf += `<p>${held.join(' &middot; ')}</p>` +
			`<p><small>${TL`Give items to your Pokémon in the Held item column of your team.`}</small></p>`;
	}
	return buf;
}

/** Loja: tabela por grupo (cura, itens de segurar, TMs e Rare Candy), com preço e compra. */
function shopTable(TL: Translator, lang: TextLanguage, choices: NodeChoice[], variantId: string) {
	const groups: [string, string][] = [
		['healing', TL`Healing`], ['held', TL`Items to hold`], ['special', TL`TMs and Rare Candy`],
	];
	let buf = '';
	for (const [group, title] of groups) {
		const rows = choices.filter(choice => choice.group === group).map(choice => {
			const price = choice.price!;
			const button = `<button class="button" name="send" value="/expedicao escolha ${variantId},` +
				`${Utils.escapeHTML(choice.id)}"${choice.disabled ? ' disabled' : ''}>${TL`Buy`}</button>`;
			return `<tr><td>${itemWithTip(TL, lang, choice.item!)}</td><td><small>${Utils.escapeHTML(choice.detail || '')}</small></td>` +
				`<td style="text-align: right; white-space: nowrap"><strong>${price}</strong> \u20BD</td><td>${button}</td></tr>`;
		}).join('');
		if (rows) buf += `<h4 style="margin: 8px 0 2px">${title}</h4><table>${rows}</table>`;
	}
	return buf;
}

const CELL = 'width: 56px; height: 44px; text-align: center; vertical-align: middle; padding: 0';
const LINK_ON = '#4a7';
const LINK_OFF = 'rgba(128,128,128,0.55)';
const EDGE_ON = `color: ${LINK_ON}; font-weight: bold; font-size: 30px; line-height: 44px`;
const EDGE_OFF = 'opacity: 0.5; font-size: 30px; line-height: 44px';
const ICON = 'font-size: 26px; line-height: 1';

/**
 * Célula de ligação desenhada com bordas, dividida em quatro quadrantes: linha
 * horizontal no meio (metade esquerda e/ou direita) e linha vertical no centro (de
 * cima até o meio e/ou do meio até embaixo). Cada trecho tem a sua cor (caminho
 * percorrido em destaque).
 */
function joinCell(parts: { left?: string, right?: string, up?: string, down?: string }) {
	const line = (color?: string) => (color ? `3px solid ${color}` : '0');
	const quadrant = (style: string) => `<td style="padding: 0; width: 50%; height: 50%; ${style}"></td>`;
	return `<td style="${CELL}"><table style="width: 100%; height: 44px; border-collapse: collapse"><tr>` +
		quadrant(`border-bottom: ${line(parts.left)}; border-right: ${line(parts.up)}`) +
		quadrant(`border-bottom: ${line(parts.right)}`) + `</tr><tr>` +
		quadrant(`border-right: ${line(parts.down)}`) + quadrant('') + `</tr></table></td>`;
}

/**
 * Mapa do ato (do chefe, no alto, ao primeiro andar), no estilo Slay the Spire. Entre
 * dois andares, uma linha de ligações: "│" sobe reto, "╱" sobe para a direita e "╲"
 * para a esquerda. Do último andar ao chefe, todos os caminhos sobem até uma barra que
 * converge no chefe. As ligações do caminho percorrido ficam em destaque.
 */
function mapHtml(TL: Translator, run: ExpeditionRun, map: ActMap, variantId: string) {
	const visited = new Set(visitedNodes(run));
	const choosable = new Set(runPhase(run) === 'map' ? reachableNodes(map, run.node).map(node => node.id) : []);
	const width = map.columns * 2 - 1;
	const byCell = new Map(map.nodes.map(node => [`${node.floor}-${node.col}`, node]));
	const nodeCell = (id: string) => {
		const node = map.nodes.find(entry => entry.id === id)!;
		const type = getNodeType(node.type);
		const icon = type?.icon || '?';
		const label = type ? type.label(TL) : node.type;
		if (choosable.has(id)) {
			return `<button class="button" name="send" value="/expedicao avancar ${variantId},${id}" title="${label}" ` +
				`style="${ICON}; padding: 3px 6px">${icon}</button>`;
		}
		const current = id === run.node;
		const style = current ? 'border: 3px solid #4a7; border-radius: 6px; padding: 2px 5px' :
			visited.has(id) ? 'opacity: 1' : 'opacity: 0.45';
		return `<span title="${label}" style="${ICON}; ${style}">${icon}</span>`;
	};
	const pathEdge = (from: string, to: string) => visited.has(from) && visited.has(to);
	const boss = map.nodes.find(node => node.id === BOSS_NODE)!;
	const bossIndex = boss.col * 2;
	let rows = '';
	// Chefe, na coluna dele
	rows += `<tr>${Array.from({ length: width }, (_, i) => (
		`<td style="${CELL}">${i === bossIndex ? nodeCell(BOSS_NODE) : ''}</td>`
	)).join('')}</tr>`;
	// Convergência no chefe: barra horizontal ligando as colunas do último andar à do chefe
	const last = map.nodes.filter(node => node.floor === map.floors - 1);
	const indexes = [...last.map(node => node.col * 2), bossIndex];
	const from = Math.min(...indexes);
	const to = Math.max(...indexes);
	const reached = last.find(node => pathEdge(node.id, BOSS_NODE));
	const reachedIndex = reached ? reached.col * 2 : -1;
	// Trecho da barra entre a coluna percorrida e a do chefe fica em destaque
	const onPath = (a: number, b: number) => reached && Math.min(a, b) >= Math.min(reachedIndex, bossIndex) &&
		Math.max(a, b) <= Math.max(reachedIndex, bossIndex);
	const color = (lit: boolean | undefined) => (lit ? LINK_ON : LINK_OFF);
	let join = '';
	for (let i = 0; i < width; i++) {
		if (i < from || i > to) {
			join += `<td style="${CELL}"></td>`;
			continue;
		}
		const node = i % 2 === 0 ? byCell.get(`${map.floors - 1}-${i / 2}`) : undefined;
		join += joinCell({
			left: i > from ? color(onPath(i - 1, i)) : undefined,
			right: i < to ? color(onPath(i, i + 1)) : undefined,
			up: i === bossIndex ? color(!!reached) : undefined,
			down: node ? color(node === reached) : undefined,
		});
	}
	rows += `<tr>${join}</tr>`;
	for (let floor = map.floors - 1; floor >= 0; floor--) {
		let cells = '';
		for (let col = 0; col < width; col++) {
			const node = col % 2 === 0 ? byCell.get(`${floor}-${col / 2}`) : undefined;
			cells += `<td style="${CELL}">${node ? nodeCell(node.id) : ''}</td>`;
		}
		rows += `<tr>${cells}</tr>`;
		if (floor === 0) break;
		// Ligações do andar de baixo (floor - 1) para este
		const links: string[] = Array.from({ length: width }, () => '');
		for (const node of map.nodes.filter(entry => entry.floor === floor - 1)) {
			for (const next of node.next) {
				const target = map.nodes.find(entry => entry.id === next)!;
				const index = node.col + target.col;
				const symbol = target.col === node.col ? '│' : target.col > node.col ? '╱' : '╲';
				links[index] = `<span style="${pathEdge(node.id, next) ? EDGE_ON : EDGE_OFF}">${symbol}</span>`;
			}
		}
		rows += `<tr>${links.map(link => `<td style="${CELL}">${link}</td>`).join('')}</tr>`;
	}
	return `<table style="border-collapse: collapse; margin: 0 auto">${rows}</table>`;
}

function legend(TL: Translator, run: ExpeditionRun) {
	const types = [...Object.keys(run.settings.map.weights), ...Object.values(run.settings.map.fixedFloors),
		...Object.keys(run.settings.map.rareNodes || {}), run.settings.map.bossType];
	return `<p style="text-align: center">` + [...new Set(types)].map(id => {
		const type = getNodeType(id);
		return type ? `<span style="font-size: 20px">${type.icon}</span> ${type.label(TL)}` : '';
	}).filter(Boolean).join(' &middot; ') + `</p>`;
}

/** Resumo da última vitória: experiência, níveis e golpes aprendidos de cada Pokémon. */
function lastBattleSection(TL: Translator, run: ExpeditionRun) {
	const last = run.lastBattle;
	if (last?.result !== 'win') return '';
	const opponent = Utils.escapeHTML(last.opponent);
	const rows = last.gains.map(gain => {
		const mon = run.team.find(entry => entry.uid === gain.uid);
		if (!mon) return '';
		const species = Utils.escapeHTML(mon.species);
		const exp = gain.exp;
		const { from, to } = gain;
		const level = to;
		const levelText = to > from ? `<strong>${TL`Lv. ${from} → ${to}`}</strong>` : TL`Lv. ${level}`;
		const moves = gain.learned.map(id => Utils.escapeHTML(Dex.moves.get(id).name)).join(', ');
		const learned = moves ? TL`Learned ${moves}` : '';
		// Quem desmaiou ganha metade (decisão do usuário)
		const fainted = mon.fainted ? `<br /><small>${TL`Fainted: half Exp.`}</small>` : '';
		return `<tr><td><psicon pokemon="${species}" title="${species}" /> ${species}</td>` +
			`<td>${TL`+${exp} Exp.`}${fainted}</td><td>${levelText}<br />${expBar(TL, mon)}</td>` +
			`<td><small>${learned}</small></td></tr>`;
	}).join('');
	const money = last.money || 0;
	const prize = (money ? `<p>${TL`You received ${money} \u20BD.`}</p>` : '') +
		(last.items?.length ? `<p>${TL`You received:`} ${last.items.map(item => itemLabel(item)).join(', ')}</p>` : '');
	return `${BOX}<h3 style="margin-top: 0">${TL`Victory against ${opponent}!`}</h3>` +
		(rows ? `<table>${rows}</table>` : '') + prize + `</div>`;
}

/** Captura do selvagem vencido: ficar com ele (com vaga, ou trocando por alguém do time) ou não. */
/**
 * Captura do selvagem vencido. Na captura por bola (etapa 8), primeiro o lançamento
 * (com a chance de cada bola, no modo com chance); depois, com o time cheio, quem sai
 * (para o Computador, se ligado) ou o capturado vai para o Computador.
 */
function captureSection(
	TL: Translator, lang: TextLanguage, run: ExpeditionRun, variantId: string,
	decision: Extract<RunDecision, { kind: 'capture' }>, left: string
) {
	const mon = decision.mon;
	const species = Utils.escapeHTML(mon.species);
	const level = mon.level;
	const moves = mon.moves.map(id => Utils.escapeHTML(Dex.moves.get(id).name)).join(', ');
	const command = (choice: string) => `/expedicao capturar ${variantId},${choice}`;
	let buf = `${BOX}<h3 style="margin-top: 0">${TL`Capture`}</h3>` +
		`<p>${monName(TL, lang, mon)} ${TL`${species} (Lv. ${level}) can join your team.`}` +
		`<br /><small>${Utils.escapeHTML(mon.ability)} &middot; ${moves}</small></p>`;
	const balls = usesBalls(run);
	if (balls && !decision.caught && !decision.gift) {
		if (decision.escaped) {
			const ball = Utils.escapeHTML(decision.escaped);
			buf += `<p><strong>${TL`Oh no! ${species} broke free from the ${ball}.`}</strong></p>`;
		}
		const bag = ballsInBag(run.items);
		if (!bag.length) {
			buf += `<p>${TL`You have no Poké Balls left.`}</p><p>`;
		} else {
			const chance = run.settings.rules.capture === 'chance';
			buf += `<p>${chance ? TL`Throw a ball (capture chance of each one):` : TL`Throw a ball: the capture is certain.`}</p><p>` +
				bag.map(({ ball, count }) => {
					const percent = chance ? ` (${Math.round(catchChance(mon.species, ball.id) * 100)}%)` : '';
					return withTip(`<button class="button" name="send" value="${command(`ball:${ball.id}`)}">` +
						`${itemLabel(ball.id)} &times;${count}${percent}</button>`, itemDescription(TL, lang, ball.id));
				}).join(' ') + `</p><p>`;
		}
		return buf + `<button class="button" name="send" value="${command('nao')}">${TL`Let it go`}</button></p>${left}</div>`;
	}
	if (decision.caught) buf += `<p><strong>${TL`Gotcha! ${species} was caught.`}</strong></p>`;
	const computer = !!run.settings.rules.computer;
	buf += `<p>`;
	if (run.team.length < run.settings.rules.teamSize) {
		buf += `<button class="button" name="send" value="${command('keep')}"><strong>${TL`Keep ${species}`}</strong></button> `;
	} else {
		buf += computer ? `${TL`Your team is full: choose who goes to the Computer to make room, or send ${species} there.`}</p><p>` :
			`${TL`Your team is full: choose who leaves to make room (their held item goes to the bag).`}</p><p>`;
		buf += run.team.map(member => {
			const name = Utils.escapeHTML(member.species);
			return withTip(`<button class="button" name="send" value="${command(member.uid)}">` +
				`<psicon pokemon="${name}" /> ${TL`Swap ${name}`}</button>`, monTooltip(TL, lang, member));
		}).join(' ') + `</p><p>`;
	}
	if (computer) {
		buf += `<button class="button" name="send" value="${command('pc')}">${TL`Send ${species} to the Computer`}</button> `;
	}
	return buf + `<button class="button" name="send" value="${command('nao')}">` +
		`${decision.caught ? TL`Release it` : TL`Let it go`}</button></p>${left}</div>`;
}

/** Computador no PokéCenter: guardar Pokémon do time e pegar os guardados. */
function pcSection(TL: Translator, lang: TextLanguage, run: ExpeditionRun, variantId: string) {
	const button = (choice: string, mon: RunMon, label: string) => withTip(
		`<button class="button" name="send" value="/expedicao escolha ${variantId},${choice}:${mon.uid}">` +
		`${ballIcon(mon)}<psicon pokemon="${Utils.escapeHTML(mon.species)}" /> ${label}${shinyMark(TL, mon)}</button>`,
		monTooltip(TL, lang, mon)
	);
	const count = run.box.length;
	let buf = `<p><strong>${TL`Your team`}</strong><br />` + run.team.map(mon => {
		const name = Utils.escapeHTML(mon.species);
		return button('deposit', mon, TL`Store ${name}`);
	}).join(' ') + `</p><p><strong>${TL`Computer`}</strong> (${count}/${BOX_SIZE})<br />`;
	buf += count ? run.box.map(mon => {
		const name = Utils.escapeHTML(mon.species);
		const level = mon.level;
		return button('withdraw', mon, TL`Take ${name} (Lv. ${level})`);
	}).join(' ') : `<em>${TL`The Computer is empty.`}</em>`;
	return buf + `</p>`;
}

/** Primeira decisão pendente: golpe novo (qual esquecer), evolução (qual, ou adiar) ou captura. */
function decisionSection(TL: Translator, lang: TextLanguage, run: ExpeditionRun, variantId: string) {
	const decision = run.decisions[0];
	const mon = decision.kind === 'capture' ? decision.mon : run.team.find(entry => entry.uid === decision.uid);
	if (!mon) return '';
	const species = Utils.escapeHTML(mon.species);
	const icon = withTip(`<psicon pokemon="${species}" />`, monTooltip(TL, lang, mon));
	// As evoluções de um mesmo Pokémon contam como uma decisão (são resolvidas juntas)
	const count = run.decisions.filter((entry, i) => (
		entry.kind === 'learn' || !run.decisions.slice(0, i).some(other => other.kind === 'evolve' && other.uid === entry.uid)
	)).length;
	const left = count > 1 ? `<p><small>${TL`Decisions left: ${count}`}</small></p>` : '';
	if (decision.kind === 'capture') return captureSection(TL, lang, run, variantId, decision, left);
	if (decision.kind === 'learn') {
		const move = Utils.escapeHTML(Dex.moves.get(decision.move).name);
		// O golpe novo com a descrição completa; os atributos do Pokémon (físico ou especial pesa
		// na escolha); cada golpe conhecido com tooltip
		// Duas colunas: à esquerda, o golpe novo e os quatro conhecidos (2 × 2, cada um com
		// tooltip); à direita, os atributos, sem quebrar
		const forget = (slot: number) => {
			const id = mon.moves[slot];
			if (!id) return '<td></td>';
			return `<td style="padding: 2px; width: 50%">` + withTip(
				`<button class="button" name="send" value="/expedicao aprender ${variantId},${slot}" ` +
				`style="width: 100%; text-align: left; white-space: nowrap">${TL`Forget`} ${moveLine(id)}</button>`,
				moveTooltip(id, lang), true
			) + `</td>`;
		};
		return `${BOX}<h3 style="margin-top: 0">${TL`New move`}</h3>` +
			`<p>${icon} ${TL`${species} wants to learn ${move}, but already knows four moves. Forget which one?`}</p>` +
			`<table style="border-collapse: collapse"><tr><td style="vertical-align: top; width: 600px; padding-right: 24px">` +
			`<p style="margin-top: 0">${moveLine(decision.move)}<br />${moveDescription(decision.move, lang, true)}</p>` +
			`<table style="border-collapse: collapse; width: 100%"><tr>${forget(0)}${forget(1)}</tr>` +
			`<tr>${forget(2)}${forget(3)}</tr></table>` +
			`<p><button class="button" name="send" value="/expedicao aprender ${variantId},nao">` +
			`${TL`Don't learn ${move}`}</button></p>${left}</td>` +
			`<td style="vertical-align: top; white-space: nowrap"><small><strong>${TL`Stats of ${species}`}</strong></small>` +
			`${statsTable(mon)}</td></tr></table></div>`;
	}
	const options = run.decisions.filter(entry => entry.kind === 'evolve' && entry.uid === mon.uid);
	return `${BOX}<h3 style="margin-top: 0">${TL`Evolution`}</h3>` +
		`<p>${icon} ${TL`${species} can evolve.`}</p><p>` +
		options.map(entry => {
			const into = Utils.escapeHTML(entry.kind === 'evolve' ? Dex.species.get(entry.into).name : '');
			// Tooltip com o Pokémon já evoluído (atributos novos)
			const evolved = { ...mon, species: Dex.species.get(into).name };
			return withTip(`<button class="button" name="send" value="/expedicao evoluir ${variantId},${toID(into)}">` +
				`<psicon pokemon="${into}" /> ${TL`Evolve into ${into}`}</button>`, monTooltip(TL, lang, evolved));
		}).join(' ') +
		` <button class="button" name="send" value="/expedicao evoluir ${variantId},nao">${TL`Not now`}</button></p>` +
		`<p><small>${TL`If you wait, the evolution is offered again when the Pokémon levels up.`}</small></p>${left}</div>`;
}

/** Adversário do nó atual: os selvagens aparecem; dos treinadores, o sprite (o time fica escondido). */
function encounterIcons(TL: Translator, run: ExpeditionRun) {
	const encounter = currentEncounter(run);
	if (!encounter) return '';
	if (encounter.kind !== 'wild' && encounter.kind !== 'legendary') return trainerSpriteImg(encounter.avatar, 80);
	return encounter.team.map(mon => {
		const species = Utils.escapeHTML(mon.species);
		return `<psicon pokemon="${species}" title="${species}" />` + (mon.shiny ? ` <strong>${TL`Shiny!`}</strong>` : '');
	}).join('');
}

/** Resumo da última run encerrada: resultado, até onde chegou, quem venceu o time e o time no fim. */
function endedSummary(TL: Translator, lang: TextLanguage, run: ExpeditionRun) {
	let result = '';
	if (run.status === 'won') result = TL`Your last expedition: completed!`;
	if (run.status === 'lost') result = TL`Your last expedition: defeated.`;
	if (run.status === 'abandoned') result = TL`Your last expedition: given up.`;
	if (run.status === 'closed') result = TL`Your last expedition: closed by an administrator.`;
	if (!result) return '';
	let buf = `${BOX}<h3 style="margin-top: 0">${result}</h3>`;
	const opponent = Utils.escapeHTML(run.lastBattle?.opponent || '');
	if (run.status === 'lost' && opponent) buf += `<p>${TL`Defeated by ${opponent}.`}</p>`;
	if (run.status !== 'won' && run.node) {
		const act = run.act;
		const acts = run.settings.map.acts;
		const number = Number(run.node.split('-')[0]) + 1;
		const floor = run.node === BOSS_NODE ? TL`the boss` : TL`floor ${number}`;
		buf += `<p>${TL`You reached ${floor} of act ${act} of ${acts}.`}</p>`;
	}
	// Desbloqueios que a vitória deu (valem nas próximas runs)
	const rules = getVariant(run.variant)?.unlocks || [];
	const unlocks = run.status === 'won' ? rules.filter(rule => rule.when === 'win') : [];
	if (unlocks.length) {
		const list = unlocks.map(rule => (rule.kind === 'starter' ? Dex.species.get(rule.ref).name : rule.ref)).join(', ');
		buf += `<p><strong>${TL`Unlocked for your next expeditions: ${list}.`}</strong></p>`;
	}
	if (run.team.length) buf += `<h4>${TL`Your team at the end`}</h4>` + teamTable(TL, lang, run.team);
	return buf + `</div>`;
}

function runSection(TL: Translator, lang: TextLanguage, run: ExpeditionRun, variantId: string) {
	const phase = runPhase(run);
	if (phase === 'starter' && run.pending?.kind === 'starter') {
		let buf = `<h3>${TL`Choose your starting team`}</h3>`;
		run.pending.options.forEach((team, index) => {
			const number = index + 1;
			buf += `<h4>${TL`Team ${number}`}</h4>` + teamTable(TL, lang, team) +
				`<p><button class="button" name="send" value="/expedicao inicial ${variantId},${index}">` +
				`${TL`Choose this team`}</button></p>`;
		});
		return buf;
	}
	const map = currentMap(run);
	const act = run.act;
	const acts = run.settings.map.acts;
	let buf = '';
	const node = currentNodeView(run, TL, lang);
	buf += `<p><strong>${TL`Money:`}</strong> ${formatMoney(run.money, lang)}</p>`;
	buf += lastBattleSection(TL, run);
	if (phase === 'decision') {
		buf += decisionSection(TL, lang, run, variantId);
	} else if (node) {
		const type = getNodeType(node.type)!;
		const priced = node.view.choices.filter(choice => choice.price !== undefined);
		const plain = node.view.choices.filter(choice => choice.price === undefined);
		const title = node.view.title ? Utils.escapeHTML(node.view.title) : type.label(TL);
		const button = (choice: NodeChoice) => {
			const html = `<button class="button" name="send" value="/expedicao escolha ${variantId},` +
				`${Utils.escapeHTML(choice.id)}"${choice.disabled ? ' disabled' : ''}>` +
				`${choice.item ? itemLabel(choice.item) : Utils.escapeHTML(choice.label)}</button>`;
			// Opções com item (nó de item) ou golpe (tutor): tooltip com a descrição
			if (choice.item) return withTip(html, itemDescription(TL, lang, choice.item));
			return choice.move ? withTip(html, moveTooltip(choice.move, lang)) : html;
		};
		// Escolhas com descrição (eventos "?"): uma por linha, com o que cada uma faz
		const choicesHtml = plain.some(choice => choice.detail) ?
			plain.map(choice => `<p>${button(choice)}${choice.detail ?
				` <small>${Utils.escapeHTML(choice.detail)}</small>` : ''}</p>`).join('') :
			`<p>${plain.map(button).join(' ')}</p>`;
		buf += `${BOX}<h3 style="margin-top: 0">${type.icon} ${title}</h3>` +
			`<p>${encounterIcons(TL, run)} ${Utils.escapeHTML(node.view.text)}</p>` +
			(node.type === 'rest' && run.nodeState.pc ? pcSection(TL, lang, run, variantId) : '') +
			(priced.length ? shopTable(TL, lang, priced, variantId) : '') + choicesHtml + `</div>`;
	} else {
		buf += `<p>${TL`Choose the next node on the map.`}</p>`;
	}
	buf += `<h3>${TL`Act ${act} of ${acts}`}</h3>` + mapHtml(TL, run, map, variantId) + legend(TL, run);
	// Itens só fora de batalha (com uma batalha aberta, o time já foi enviado)
	const manage = hasOpenBattle(run) ? null : { run, variantId };
	buf += `<h3>${TL`Your team`}</h3>` + teamTable(TL, lang, run.team, manage) +
		bagSection(TL, lang, run, variantId, !!manage && (phase === 'map' || phase === 'node'));
	buf += `<details><summary>${TL`Give up`}</summary>` +
		`<p>${TL`The expedition ends and stays in your history. You can start a new one.`}</p>` +
		`<p><button class="button" name="send" value="/expedicao desistir ${variantId}">${TL`Confirm`}</button></p></details>`;
	return buf;
}

export const pages: Chat.PageTable = {
	expedicao: {
		default(query, user) {
			this.title = this.TL`Expedition`;
			let buf = `<div class="pad"><h2>${this.TL`Expedition`}</h2>` +
				`<p>${this.TL`Build your team along the way: choose a starting team, cross a randomly generated map and face its encounters.`}</p>`;
			const variants = listVariants().filter(variant => variantAvailable(variant, user));
			if (!variants.length) return buf + `<p><em>${this.TL`No expeditions available right now.`}</em></p></div>`;
			buf += `<div class="ladder"><table><tr><th>${this.TL`Expedition`}</th><th>${this.TL`Your expedition`}</th><th></th></tr>`;
			const store = getStore();
			for (const variant of variants) {
				const run = isPlayer(user) ? store.getActiveRun(user.id, variant.id) : null;
				const act = run?.act;
				const status = run ? this.TL`In progress (act ${act})` : '-';
				const testNote = variant.status === 'draft' ?
					`<br /><small>${this.TL`Test only: visible to administrators.`}</small>` : '';
				buf += `<tr><td><strong>${variant.name(this.TL)}</strong><br /><small>${variant.description(this.TL)}</small>` +
					`${testNote}</td><td>${status}</td>` +
					`<td><button class="button" name="gymGo" value="${PAGE}-run-${variant.id}">${this.TL`Open`}</button></td></tr>`;
			}
			return buf + `</table></div></div>`;
		},

		admin(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			this.title = `[${this.TL`Expedition`}] ${this.TL`admin panel`}`;
			return renderAdminPage(this.TL, user, query);
		},

		run(query, user) {
			const variant = getVariant(query[0] || '');
			if (!variant || !variantAvailable(variant, user)) this.pageDoesNotExist();
			this.title = `[${this.TL`Expedition`}] ${variant.name(this.TL)}`;
			// Idioma dos textos do jogo (descrições de golpes e habilidades nos tooltips)
			const lang = Chat.getDexLanguage(this.language);
			const buf = `<div class="pad"><h2>${variant.name(this.TL)}</h2>` +
				`<p><button class="button" name="gymGo" value="${PAGE}">${this.TL`Back to expeditions`}</button></p>`;
			if (!isPlayer(user)) return buf + `<p>${this.TL`Log in to take part in the Expedition.`}</p></div>`;
			const run = getStore().getActiveRun(user.id, variant.id);
			if (!run) {
				// Resultado da última expedição desta variação
				const last = getStore().listRuns(user.id, 10).find(entry => entry.variant === variant.id);
				return buf + (last ? endedSummary(this.TL, lang, last) : '') + `<p>${variant.description(this.TL)}</p>` +
					`<p><button class="button" name="send" value="/expedicao iniciar ${variant.id}">` +
					`<strong>${this.TL`Start expedition`}</strong></button></p></div>`;
			}
			return buf + runSection(this.TL, lang, run, variant.id) + `</div>`;
		},
	},
};

function requireRun(context: Chat.CommandContext, user: User, variantId: string) {
	if (!isPlayer(user)) throw new Chat.ErrorMessage(context.TL`Log in to take part in the Expedition.`);
	const variant = getVariant(toID(variantId));
	if (!variant || !variantAvailable(variant, user)) throw new Chat.ErrorMessage(problemText(context.TL, 'disabled'));
	const run = getStore().getActiveRun(user.id, variant.id);
	if (!run) throw new Chat.ErrorMessage(problemText(context.TL, 'norun'));
	return run;
}

function refresh(context: Chat.CommandContext, variantId: string) {
	return context.parse(`/join ${PAGE}-run-${toID(variantId)}`);
}

export const commands: Chat.ChatCommands = {
	expedition: 'expedicao',
	expedicao: {
		''() {
			return this.parse(`/join ${PAGE}`);
		},

		iniciar(target, room, user) {
			if (!isPlayer(user)) throw new Chat.ErrorMessage(this.TL`Log in to take part in the Expedition.`);
			const result = startRun(user, toID(target));
			if (typeof result === 'string') throw new Chat.ErrorMessage(problemText(this.TL, result));
			return refresh(this, target);
		},

		inicial(target, room, user) {
			const [variantId, index] = target.split(',');
			const problem = chooseStarter(requireRun(this, user, variantId), Number(index));
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		avancar(target, room, user) {
			const [variantId, nodeId] = target.split(',');
			const problem = enterNode(requireRun(this, user, variantId), (nodeId || '').trim());
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		escolha(target, room, user) {
			const [variantId, choice] = target.split(',');
			const run = requireRun(this, user, variantId);
			const problem = chooseInNode(run, (choice || '').trim(), this.TL, user);
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			if (run.status === 'won') this.sendReply(this.TL`Expedition complete. Congratulations!`);
			// A batalha abriu e fechou a aba da run (battles.ts): não a reabre
			if ((choice || '').trim() === 'battle') return;
			return refresh(this, variantId);
		},

		aprender(target, room, user) {
			const [variantId, choice] = target.split(',');
			const slot = toID(choice) === 'nao' ? null : Number(choice);
			const problem = decideLearn(requireRun(this, user, variantId), slot);
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		capturar(target, room, user) {
			const [variantId, choice] = target.split(',');
			const id = (choice || '').trim();
			const problem = decideCapture(requireRun(this, user, variantId), toID(id) === 'nao' ? null : id);
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		usar(target, room, user) {
			const [variantId, item, uid] = target.split(',');
			const problem = useBagItem(requireRun(this, user, variantId), (item || '').trim(), (uid || '').trim());
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		item(target, room, user) {
			const [variantId, uid, item] = target.split(',');
			const problem = setHeldItem(requireRun(this, user, variantId), (uid || '').trim(), item || '');
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		evoluir(target, room, user) {
			const [variantId, choice] = target.split(',');
			const into = toID(choice) === 'nao' ? null : toID(choice);
			const problem = decideEvolve(requireRun(this, user, variantId), into);
			if (problem) throw new Chat.ErrorMessage(problemText(this.TL, problem));
			return refresh(this, variantId);
		},

		desistir(target, room, user) {
			abandonRun(user, requireRun(this, user, target));
			this.sendReply(this.TL`You gave up the expedition. It stays in your history.`);
			return refresh(this, target);
		},
	},
};
