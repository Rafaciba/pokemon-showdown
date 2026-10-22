/**
 * pokemon-showdown-custom: tooltips das páginas da Expedição (pedido do usuário).
 *
 * O cliente não tem tooltips para as páginas do servidor, e o filtro de HTML não deixa
 * passar scripts. Então o conteúdo vai escondido dentro do próprio elemento
 * (`<span class="exp-tip">…<span class="exp-tip-body">…</span></span>`), e uma regra de
 * CSS do nosso cliente (client-custom.js) mostra o conteúdo no hover.
 *
 * - Pokémon: tipos, habilidade, natureza, item, atributos e golpes.
 * - Golpe: tipo, categoria, poder, precisão, PP e a descrição, no idioma do jogador
 *   (catálogo de textos do PS, data/text/pt).
 *
 * Os atributos são os do Pokémon no nível dele: atributos base, IVs e natureza, sem EVs
 * (os Pokémon da Expedição não têm EVs).
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import type { TextLanguage } from '../../../sim/dex-data';
import type { RunMon } from './team';

const STATS = [['hp', 'HP'], ['atk', 'Atk'], ['def', 'Def'], ['spa', 'SpA'], ['spd', 'SpD'], ['spe', 'Spe']] as const;
type StatID = typeof STATS[number][0];

/** Elemento com tooltip: o conteúdo fica escondido e aparece no hover (`block`: ocupa a largura toda). */
export function withTip(trigger: string, body: string, block = false) {
	const style = block ? ' style="display: block"' : '';
	return `<span class="exp-tip"${style}>${trigger}<span class="exp-tip-body">${body}</span></span>`;
}

/** Atributos no nível, com IVs e natureza (sem EVs), pelas fórmulas dos jogos. */
export function monStats(mon: RunMon): Record<StatID, number> {
	const species = Dex.species.get(mon.species);
	const nature = Dex.natures.get(mon.nature);
	const stats = {} as Record<StatID, number>;
	for (const [id] of STATS) {
		const base = species.baseStats[id];
		const iv = mon.ivs[id] ?? 31;
		if (id === 'hp') {
			stats.hp = species.maxHP === 1 ? 1 : Math.floor((2 * base + iv) * mon.level / 100) + mon.level + 10;
			continue;
		}
		let value = Math.floor((2 * base + iv) * mon.level / 100) + 5;
		if (nature.plus === id) value = Math.floor(value * 1.1);
		if (nature.minus === id) value = Math.floor(value * 0.9);
		stats[id] = value;
	}
	return stats;
}

/** PP máximo de um golpe (com os PP Ups, como no simulador). */
export function maxPP(id: string) {
	const move = Dex.moves.get(id);
	return move.noPPBoosts ? move.pp : Math.floor(move.pp * 8 / 5);
}

/**
 * Atributos: o valor no nível e uma barra pelo atributo base (como no teambuilder do
 * PS). A natureza marca o atributo que sobe (+) e o que desce (−). Só elementos de
 * linha (span), para valer dentro de parágrafos e botões: um <table> ou <div> ali faz
 * o navegador fechar o parágrafo e desmontar o tooltip.
 */
export function statsTable(mon: RunMon) {
	const species = Dex.species.get(mon.species);
	const nature = Dex.natures.get(mon.nature);
	const stats = monStats(mon);
	const cell = (width: number, text: string, align = 'left') => (
		`<span style="display: inline-block; width: ${width}px; text-align: ${align}">${text}</span>`
	);
	return `<span style="display: block">` + STATS.map(([id, label]) => {
		const base = species.baseStats[id];
		const width = Math.round(Math.min(1, base / 180) * 80);
		const hue = Math.floor(Math.min(base, 180) * 180 / 255);
		const mark = nature.plus === id ? ' <span style="color: #d33">+</span>' :
			nature.minus === id ? ' <span style="color: #36c">&minus;</span>' : '';
		return cell(38, `<small>${label}${mark}</small>`) + cell(28, `<strong>${stats[id]}</strong>`, 'right') + ' ' +
			`<span style="display: inline-block; width: ${width}px; height: 6px; border-radius: 3px; ` +
			`background: hsl(${hue}, 80%, 45%)"></span> <small>${base}</small>`;
	}).join('<br />') + `</span>`;
}

/** Linha de um golpe: nome, tipo, categoria, poder, precisão e PP (e os PP restantes, se dados). */
export function moveLine(id: string, ppLeft?: number) {
	const move = Dex.moves.get(id);
	const power = move.basePower ? `${move.basePower}` : '&mdash;';
	const accuracy = move.accuracy === true ? '&mdash;' : `${move.accuracy}%`;
	const pp = ppLeft === undefined ? `${maxPP(id)} PP` : `${ppLeft}/${maxPP(id)} PP`;
	return `<strong>${Utils.escapeHTML(move.name)}</strong> <psicon type="${move.type}" /> ` +
		`<psicon category="${move.category}" /> <small>${power} &middot; ${accuracy} &middot; ${pp}</small>`;
}

/** Descrição de um golpe no idioma do jogador (`full`: a longa, senão a curta). */
export function moveDescription(id: string, lang: TextLanguage, full = false) {
	const text = Dex.text.get(Dex.moves.get(id), lang);
	return Utils.escapeHTML((full ? text.desc || text.shortDesc : text.shortDesc || text.desc) || '');
}

/** Conteúdo do tooltip de um golpe: a linha do golpe e a descrição completa. */
export function moveTooltip(id: string, lang: TextLanguage, ppLeft?: number) {
	return `${moveLine(id, ppLeft)}<br />${moveDescription(id, lang, true)}`;
}

/** Conteúdo do tooltip de um Pokémon: tipos, habilidade, natureza, item, atributos e golpes. */
export function monTooltip(TL: Translator, lang: TextLanguage, mon: RunMon) {
	const species = Dex.species.get(mon.species);
	const name = Utils.escapeHTML(species.name);
	const level = mon.level;
	const types = species.types.map(type => `<psicon type="${type}" />`).join(' ');
	const ability = Dex.abilities.get(mon.ability);
	const abilityName = Utils.escapeHTML(ability.name || mon.ability);
	const abilityDesc = Utils.escapeHTML(Dex.text.get(ability, lang).shortDesc || '');
	const nature = Dex.natures.get(mon.nature);
	const natureName = Utils.escapeHTML(nature.name);
	const effect = nature.plus ? ` (+${STATS.find(([id]) => id === nature.plus)![1]} ` +
		`&minus;${STATS.find(([id]) => id === nature.minus)![1]})` : '';
	const item = mon.item ? Utils.escapeHTML(Dex.items.get(mon.item).name || mon.item) : '';
	let buf = `<strong>${name}</strong> ${TL`Lv. ${level}`} ${types}<br />` +
		`${TL`Ability: ${abilityName}`}${abilityDesc ? ` &ndash; <small>${abilityDesc}</small>` : ''}<br />` +
		`${TL`Nature: ${natureName}`}${effect}` + (item ? `<br />${TL`Item: ${item}`}` : '') +
		`<br />${statsTable(mon)}`;
	buf += mon.moves.map((id, slot) => {
		const left = Math.max(0, maxPP(id) - (mon.ppUsed[slot] || 0));
		return `<span style="display: block; margin-top: 4px">${moveLine(id, left)}<br />` +
			`<small>${moveDescription(id, lang)}</small></span>`;
	}).join('');
	return buf;
}
