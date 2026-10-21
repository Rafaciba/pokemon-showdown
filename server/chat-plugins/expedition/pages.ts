/**
 * pokemon-showdown-custom: páginas e comandos do jogador na Expedição.
 *
 * Páginas:
 *   view-expedicao                  variações disponíveis, com a run de cada uma
 *   view-expedicao-run-<variação>   a run: time inicial, mapa do ato, nó atual e time
 *
 * Comandos (/expedicao, ou /expedition):
 *   /expedicao                          abre a lista
 *   /expedicao iniciar <variação>       começa uma run
 *   /expedicao inicial <variação>,<n>   escolhe o time inicial n (0, 1 ou 2)
 *   /expedicao avancar <variação>,<nó>  vai para um nó ligado ao atual
 *   /expedicao escolha <variação>,<id>  escolha no nó atual ("battle" começa ou retoma a batalha)
 *   /expedicao aprender <variação>,<n>  golpe novo: esquece o golpe n (0 a 3) ou "nao"
 *   /expedicao evoluir <variação>,<espécie>  evolui para a espécie, ou "nao" (adia)
 *   /expedicao desistir <variação>      encerra a run (fica no histórico)
 *
 * Só contas registradas jogam.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import { getStore } from './state';
import { getVariant, listVariants } from './variant';
import { getNodeType } from './nodes';
import { BOSS_NODE, reachableNodes, type ActMap } from './map';
import {
	abandonRun, chooseInNode, chooseStarter, currentMap, currentNodeView, decideEvolve, decideLearn, enterNode, runPhase,
	startRun, variantAvailable, visitedNodes, type RunProblem,
} from './runs';
import { currentEncounter } from './battles';
import { trainerSpriteImg } from '../gym-challenge/trainer-sprites';
import type { ExpeditionRun } from './store';
import { expForLevel, MAX_LEVEL, type RunMon } from './team';

const PAGE = 'view-expedicao';

function isPlayer(user: User) {
	return user.named && user.registered;
}

function problemText(TL: Translator, problem: RunProblem) {
	switch (problem) {
	case 'novariant': return TL`Expedition not found.`;
	case 'disabled': return TL`This expedition is not available.`;
	case 'active': return TL`You already have an expedition in progress in this variant.`;
	case 'norun': return TL`You have no expedition in progress here.`;
	case 'nostarter': return TL`The starting team was already chosen.`;
	case 'badchoice': return TL`Invalid choice.`;
	case 'unreachable': return TL`You can only go to a node connected to where you are.`;
	case 'nodeopen': return TL`Finish the current node first.`;
	case 'decisions': return TL`Decide about your Pokémon first.`;
	case 'nodecision': return TL`There is nothing to decide right now.`;
	case 'nobattle': return TL`The battle could not be started. Try again in a moment.`;
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

function monLine(TL: Translator, mon: RunMon) {
	const species = Utils.escapeHTML(mon.species);
	const level = mon.level;
	const hp = Math.round(mon.hp * 100);
	const moves = mon.moves.map(id => Utils.escapeHTML(Dex.moves.get(id).name)).join(', ');
	const state = mon.fainted ? `<strong>${TL`Fainted`}</strong>` : `${hpBar(mon)} ${TL`HP ${hp}%`}`;
	return `<tr><td><psicon pokemon="${species}" title="${species}" /> <strong>${species}</strong></td>` +
		`<td>${TL`Lv. ${level}`}<br />${expBar(TL, mon)}</td><td>${state}</td><td><small>${moves}</small></td></tr>`;
}

function teamTable(TL: Translator, team: RunMon[]) {
	return `<div class="ladder"><table><tr><th>${TL`Pokémon`}</th><th>${TL`Level`}</th><th>${TL`State`}</th>` +
		`<th>${TL`Moves`}</th></tr>` + team.map(mon => monLine(TL, mon)).join('') + `</table></div>`;
}

const CELL = 'width: 44px; height: 30px; text-align: center; padding: 0';
const EDGE_ON = 'color: #4a7; font-weight: bold; font-size: 18px';
const EDGE_OFF = 'opacity: 0.5; font-size: 18px';

/**
 * Mapa do ato (do chefe, no alto, ao primeiro andar), no estilo Slay the Spire. Entre
 * dois andares, uma linha de ligações: "│" sobe reto, "╱" sobe para a direita e "╲"
 * para a esquerda; as do caminho percorrido ficam em destaque.
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
				`style="font-size: 16px; padding: 1px 5px">${icon}</button>`;
		}
		const current = id === run.node;
		const style = current ? 'border: 2px solid #4a7; border-radius: 4px; padding: 1px 4px' :
			visited.has(id) ? 'opacity: 1' : 'opacity: 0.45';
		return `<span title="${label}" style="font-size: 16px; ${style}">${icon}</span>`;
	};
	const pathEdge = (from: string, to: string) => visited.has(from) && visited.has(to);
	let rows = `<tr><td colspan="${width}" style="${CELL}">${nodeCell(BOSS_NODE)}</td></tr>`;
	// Ligações dos nós do último andar com o chefe
	let toBoss = '';
	for (let col = 0; col < width; col++) {
		const node = col % 2 === 0 ? byCell.get(`${map.floors - 1}-${col / 2}`) : undefined;
		const color = node && pathEdge(node.id, BOSS_NODE) ? EDGE_ON : EDGE_OFF;
		toBoss += `<td style="${CELL}"><span style="${color}">${node ? '│' : ''}</span></td>`;
	}
	rows += `<tr>${toBoss}</tr>`;
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
				const color = pathEdge(node.id, next) ? EDGE_ON : EDGE_OFF;
				links[index] = `<span style="${color}">${symbol}</span>`;
			}
		}
		rows += `<tr>${links.map(link => `<td style="${CELL}">${link}</td>`).join('')}</tr>`;
	}
	return `<table style="border-collapse: collapse; margin: 0 auto">${rows}</table>`;
}

function legend(TL: Translator, run: ExpeditionRun) {
	const types = [...Object.keys(run.settings.map.weights), ...Object.values(run.settings.map.fixedFloors),
		run.settings.map.bossType];
	return `<p><small>` + [...new Set(types)].map(id => {
		const type = getNodeType(id);
		return type ? `${type.icon} ${type.label(TL)}` : '';
	}).filter(Boolean).join(' &middot; ') + `</small></p>`;
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
	return `<div class="infobox"><h3 style="margin-top: 0">${TL`Victory against ${opponent}!`}</h3>` +
		(rows ? `<table>${rows}</table>` : '') + `</div>`;
}

/** Tipo, categoria, poder, precisão e PP de um golpe (para decidir qual aprender ou esquecer). */
function moveInfo(id: string) {
	const move = Dex.moves.get(id);
	const power = move.basePower ? `${move.basePower}` : '&mdash;';
	const accuracy = move.accuracy === true ? '&mdash;' : `${move.accuracy}%`;
	return `<psicon type="${move.type}" /> <psicon category="${move.category}" /> ` +
		`<small>${power} &middot; ${accuracy} &middot; ${move.pp} PP</small>`;
}

/** Primeira decisão pendente: golpe novo (qual esquecer) ou evolução (qual, ou adiar). */
function decisionSection(TL: Translator, run: ExpeditionRun, variantId: string) {
	const decision = run.decisions[0];
	const mon = run.team.find(entry => entry.uid === decision.uid);
	if (!mon) return '';
	const species = Utils.escapeHTML(mon.species);
	const icon = `<psicon pokemon="${species}" title="${species}" />`;
	// As evoluções de um mesmo Pokémon contam como uma decisão (são resolvidas juntas)
	const count = run.decisions.filter((entry, i) => (
		entry.kind === 'learn' || !run.decisions.slice(0, i).some(other => other.kind === 'evolve' && other.uid === entry.uid)
	)).length;
	const left = count > 1 ? `<p><small>${TL`Decisions left: ${count}`}</small></p>` : '';
	if (decision.kind === 'learn') {
		const move = Utils.escapeHTML(Dex.moves.get(decision.move).name);
		return `<div class="infobox"><h3 style="margin-top: 0">${TL`New move`}</h3>` +
			`<p>${icon} ${TL`${species} wants to learn ${move}, but already knows four moves. Forget which one?`}</p>` +
			`<p><strong>${move}</strong> ${moveInfo(decision.move)}</p><p>` +
			mon.moves.map((id, slot) => (
				`<button class="button" name="send" value="/expedicao aprender ${variantId},${slot}" style="margin: 2px">` +
				`${TL`Forget`} <strong>${Utils.escapeHTML(Dex.moves.get(id).name)}</strong><br />${moveInfo(id)}</button>`
			)).join(' ') +
			`</p><p><button class="button" name="send" value="/expedicao aprender ${variantId},nao">` +
			`${TL`Don't learn ${move}`}</button></p>${left}</div>`;
	}
	const options = run.decisions.filter(entry => entry.kind === 'evolve' && entry.uid === mon.uid);
	return `<div class="infobox"><h3 style="margin-top: 0">${TL`Evolution`}</h3>` +
		`<p>${icon} ${TL`${species} can evolve.`}</p><p>` +
		options.map(entry => {
			const into = Utils.escapeHTML(entry.kind === 'evolve' ? Dex.species.get(entry.into).name : '');
			return `<button class="button" name="send" value="/expedicao evoluir ${variantId},${toID(into)}">` +
				`<psicon pokemon="${into}" /> ${TL`Evolve into ${into}`}</button>`;
		}).join(' ') +
		` <button class="button" name="send" value="/expedicao evoluir ${variantId},nao">${TL`Not now`}</button></p>` +
		`<p><small>${TL`If you wait, the evolution is offered again when the Pokémon levels up.`}</small></p>${left}</div>`;
}

/** Adversário do nó atual: os selvagens aparecem; dos treinadores, o sprite (o time fica escondido). */
function encounterIcons(run: ExpeditionRun) {
	const encounter = currentEncounter(run);
	if (!encounter) return '';
	if (encounter.kind !== 'wild' && encounter.kind !== 'legendary') return trainerSpriteImg(encounter.avatar, 80);
	return encounter.team.map(mon => {
		const species = Utils.escapeHTML(mon.species);
		return `<psicon pokemon="${species}" title="${species}" />`;
	}).join('');
}

/** Resumo da última run encerrada: resultado, até onde chegou, quem venceu o time e o time no fim. */
function endedSummary(TL: Translator, run: ExpeditionRun) {
	let result = '';
	if (run.status === 'won') result = TL`Your last expedition: completed!`;
	if (run.status === 'lost') result = TL`Your last expedition: defeated.`;
	if (run.status === 'abandoned') result = TL`Your last expedition: given up.`;
	if (!result) return '';
	let buf = `<div class="infobox"><h3 style="margin-top: 0">${result}</h3>`;
	const opponent = Utils.escapeHTML(run.lastBattle?.opponent || '');
	if (run.status === 'lost' && opponent) buf += `<p>${TL`Defeated by ${opponent}.`}</p>`;
	if (run.status !== 'won' && run.node) {
		const act = run.act;
		const acts = run.settings.map.acts;
		const number = Number(run.node.split('-')[0]) + 1;
		const floor = run.node === BOSS_NODE ? TL`the boss` : TL`floor ${number}`;
		buf += `<p>${TL`You reached ${floor} of act ${act} of ${acts}.`}</p>`;
	}
	if (run.team.length) buf += `<h4>${TL`Your team at the end`}</h4>` + teamTable(TL, run.team);
	return buf + `</div>`;
}

function runSection(TL: Translator, run: ExpeditionRun, variantId: string) {
	const phase = runPhase(run);
	if (phase === 'starter' && run.pending?.kind === 'starter') {
		let buf = `<h3>${TL`Choose your starting team`}</h3>`;
		run.pending.options.forEach((team, index) => {
			const number = index + 1;
			buf += `<h4>${TL`Team ${number}`}</h4>` + teamTable(TL, team) +
				`<p><button class="button" name="send" value="/expedicao inicial ${variantId},${index}">` +
				`${TL`Choose this team`}</button></p>`;
		});
		return buf;
	}
	const map = currentMap(run);
	const act = run.act;
	const acts = run.settings.map.acts;
	let buf = '';
	const node = currentNodeView(run, TL);
	buf += lastBattleSection(TL, run);
	if (phase === 'decision') {
		buf += decisionSection(TL, run, variantId);
	} else if (node) {
		const type = getNodeType(node.type)!;
		buf += `<div class="infobox"><h3 style="margin-top: 0">${type.icon} ${type.label(TL)}</h3>` +
			`<p>${encounterIcons(run)} ${Utils.escapeHTML(node.view.text)}</p><p>` + node.view.choices.map(choice => (
			`<button class="button" name="send" value="/expedicao escolha ${variantId},${Utils.escapeHTML(choice.id)}">` +
			`${Utils.escapeHTML(choice.label)}</button>`
		)).join(' ') + `</p></div>`;
	} else {
		buf += `<p>${TL`Choose the next node on the map.`}</p>`;
	}
	buf += `<h3>${TL`Act ${act} of ${acts}`}</h3>` + mapHtml(TL, run, map, variantId) + legend(TL, run);
	buf += `<h3>${TL`Your team`}</h3>` + teamTable(TL, run.team);
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
				const testNote = variant.adminOnly ? `<br /><small>${this.TL`Test only: visible to administrators.`}</small>` : '';
				buf += `<tr><td><strong>${variant.name(this.TL)}</strong><br /><small>${variant.description(this.TL)}</small>` +
					`${testNote}</td><td>${status}</td>` +
					`<td><button class="button" name="gymGo" value="${PAGE}-run-${variant.id}">${this.TL`Open`}</button></td></tr>`;
			}
			return buf + `</table></div></div>`;
		},

		run(query, user) {
			const variant = getVariant(query[0] || '');
			if (!variant || !variantAvailable(variant, user)) this.pageDoesNotExist();
			this.title = `[${this.TL`Expedition`}] ${variant.name(this.TL)}`;
			const buf = `<div class="pad"><h2>${variant.name(this.TL)}</h2>` +
				`<p><button class="button" name="gymGo" value="${PAGE}">${this.TL`Back to expeditions`}</button></p>`;
			if (!isPlayer(user)) return buf + `<p>${this.TL`Log in to take part in the Expedition.`}</p></div>`;
			const run = getStore().getActiveRun(user.id, variant.id);
			if (!run) {
				// Resultado da última expedição desta variação
				const last = getStore().listRuns(user.id, 10).find(entry => entry.variant === variant.id);
				return buf + (last ? endedSummary(this.TL, last) : '') + `<p>${variant.description(this.TL)}</p>` +
					`<p><button class="button" name="send" value="/expedicao iniciar ${variant.id}">` +
					`<strong>${this.TL`Start expedition`}</strong></button></p></div>`;
			}
			return buf + runSection(this.TL, run, variant.id) + `</div>`;
		},
	},
};

function requireRun(context: Chat.CommandContext, user: User, variantId: string) {
	if (!isPlayer(user)) throw new Chat.ErrorMessage(context.TL`Log in to take part in the Expedition.`);
	const run = getStore().getActiveRun(user.id, toID(variantId));
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
			return refresh(this, variantId);
		},

		aprender(target, room, user) {
			const [variantId, choice] = target.split(',');
			const slot = toID(choice) === 'nao' ? null : Number(choice);
			const problem = decideLearn(requireRun(this, user, variantId), slot);
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
