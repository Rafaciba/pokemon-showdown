/**
 * pokemon-showdown-custom: dinheiro, loja e itens de uso da Expedição (etapa 3, parte 2).
 *
 * Decisões do usuário (2026-10-21):
 * - o dinheiro vem das batalhas contra treinadores, como nos jogos: pagamento pela
 *   classe do treinador vezes o nível do último Pokémon dele;
 * - preços dos jogos, com um multiplicador do pagamento para que um ato típico renda
 *   umas 3 ou 4 compras médias. Rare Candy e os itens fortes ficam caros;
 * - a loja vende cura (poções, Revive), itens de segurar, Rare Candy, TMs, berries e
 *   cura de status. As Poké Bolas ficam no catálogo, para as variações que capturam
 *   com bola, e fora da loja da variação de teste (captura livre);
 * - itens de uso só fora da batalha, pela página (o simulador não tem mochila).
 *
 * Escolhas nossas (documentadas em docs/arquitetura-expedicao.md): o dinheiro inicial
 * (`extra.startMoney`), o pagamento base de cada fonte de treinador, os preços que os
 * jogos não têm (Max Revive, Rare Candy, TMs, itens de batalha) e o estoque da loja.
 *
 * Os itens de uso não existem nos dados do PS (não são itens de batalha): são um
 * catálogo nosso, com nome em inglês (como os outros itens) e o ícone oficial do PS
 * (sprites/itemicons). Na mochila, ficam pelo id do catálogo ("potion", "tm:thunderbolt");
 * os itens de segurar, pelo nome do PS.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { Translator } from '../../../sim/dex-text';
import type { Encounter } from './encounters';
import type { ExpeditionRun } from './store';
import type { RunSettings } from './variant';
import { calibrationPaths, levelUpEffects, type RunDecision } from './progression';
import { HELD_ITEMS } from './items';
import { expForLevel, MAX_LEVEL, type RunMon } from './team';
import { monStats } from './tooltips';
import { seededRandom } from './random';

export type ConsumableEffect =
	{ kind: 'heal', hp: number | 'full', status?: boolean } |
	{ kind: 'revive', hp: number } |
	{ kind: 'status', cures: string[] } |
	{ kind: 'candy' } |
	{ kind: 'ball' };

export interface Consumable {
	id: string;
	name: string;
	/** Arquivo do ícone em sprites/itemicons. */
	icon: string;
	price: number;
	effect: ConsumableEffect;
}

const ALL_STATUSES = ['brn', 'par', 'psn', 'tox', 'slp', 'frz'];

/** Itens de uso (preços dos jogos; Max Revive e Rare Candy, escolha nossa: caros). */
export const CONSUMABLES: readonly Consumable[] = [
	{ id: 'potion', name: 'Potion', icon: 'potion', price: 200, effect: { kind: 'heal', hp: 20 } },
	{ id: 'superpotion', name: 'Super Potion', icon: 'super-potion', price: 700, effect: { kind: 'heal', hp: 60 } },
	{ id: 'hyperpotion', name: 'Hyper Potion', icon: 'hyper-potion', price: 1500, effect: { kind: 'heal', hp: 120 } },
	{ id: 'maxpotion', name: 'Max Potion', icon: 'max-potion', price: 2500, effect: { kind: 'heal', hp: 'full' } },
	{
		id: 'fullrestore', name: 'Full Restore', icon: 'full-restore', price: 3000,
		effect: { kind: 'heal', hp: 'full', status: true },
	},
	{ id: 'revive', name: 'Revive', icon: 'revive', price: 2000, effect: { kind: 'revive', hp: 0.5 } },
	{ id: 'maxrevive', name: 'Max Revive', icon: 'max-revive', price: 4000, effect: { kind: 'revive', hp: 1 } },
	{ id: 'antidote', name: 'Antidote', icon: 'antidote', price: 200, effect: { kind: 'status', cures: ['psn', 'tox'] } },
	{
		id: 'paralyzeheal', name: 'Paralyze Heal', icon: 'parlyz-heal', price: 300,
		effect: { kind: 'status', cures: ['par'] },
	},
	{ id: 'burnheal', name: 'Burn Heal', icon: 'burn-heal', price: 300, effect: { kind: 'status', cures: ['brn'] } },
	{ id: 'awakening', name: 'Awakening', icon: 'awakening', price: 300, effect: { kind: 'status', cures: ['slp'] } },
	{ id: 'iceheal', name: 'Ice Heal', icon: 'ice-heal', price: 300, effect: { kind: 'status', cures: ['frz'] } },
	{ id: 'fullheal', name: 'Full Heal', icon: 'full-heal', price: 400, effect: { kind: 'status', cures: ALL_STATUSES } },
	{ id: 'rarecandy', name: 'Rare Candy', icon: 'rare-candy', price: 5000, effect: { kind: 'candy' } },
	// Só no catálogo: para variações com captura por Poké Bola
	{ id: 'pokeball', name: 'Poké Ball', icon: 'poke-ball', price: 200, effect: { kind: 'ball' } },
];

export const TM_PRICE = 3000;
const TM_PREFIX = 'tm:';

/** Itens de segurar caros (escolha nossa: os mais fortes custam 4000, como nos jogos com BP). */
const STRONG_HELD_ITEMS = [
	'Leftovers', 'Life Orb', 'Choice Band', 'Choice Specs', 'Choice Scarf', 'Focus Sash', 'Assault Vest', 'Rocky Helmet',
	'Weakness Policy', 'Heavy-Duty Boots', 'Eviolite', 'Expert Belt', 'Light Clay',
];
/** Reforços de tipo: 1000, como nos jogos. */
const TYPE_BOOSTERS = [
	'Charcoal', 'Mystic Water', 'Miracle Seed', 'Magnet', 'Never-Melt Ice', 'Black Belt', 'Poison Barb', 'Soft Sand',
	'Sharp Beak', 'Twisted Spoon', 'Silver Powder', 'Hard Stone', 'Spell Tag', 'Dragon Fang', 'Black Glasses',
	'Metal Coat', 'Silk Scarf', 'Fairy Feather',
];
const BERRY_PRICES: { [name: string]: number } = {
	'Oran Berry': 200, 'Chesto Berry': 300, 'Sitrus Berry': 600, 'Lum Berry': 800,
};

export function consumable(id: string): Consumable | null {
	return CONSUMABLES.find(entry => entry.id === id) || null;
}

/** TM na mochila ("tm:<golpe>"): o golpe, ou null. */
export function tmMove(entry: string): string | null {
	if (!entry.startsWith(TM_PREFIX)) return null;
	const move = Dex.moves.get(entry.slice(TM_PREFIX.length));
	return move.exists ? move.id : null;
}

/** Item de segurar do PS (vai para um Pokémon), e não item de uso nem TM. */
export function isHeldItem(entry: string) {
	return !consumable(toID(entry)) && !tmMove(entry) && Dex.items.get(entry).exists;
}

/** Preço de um item da loja (item de segurar, item de uso ou TM). */
export function itemPrice(entry: string): number {
	const usable = consumable(toID(entry));
	if (usable) return usable.price;
	if (tmMove(entry)) return TM_PRICE;
	const name = Dex.items.get(entry).name;
	if (BERRY_PRICES[name]) return BERRY_PRICES[name];
	// Reforços de tipo (1000, como nos jogos) e os demais
	return STRONG_HELD_ITEMS.includes(name) ? 4000 : TYPE_BOOSTERS.includes(name) ? 1000 : 2000;
}

// --- Dinheiro -----------------------------------------------------------------------

/**
 * Pagamento base por fonte do treinador (escolha nossa; o multiplicador da variação
 * ajusta o total). O chefe paga 1,5 vez um treinador comum: o prêmio dele só serve no
 * ato seguinte.
 */
const PAYOUT_BASE = { trainer: 30, gym: 45, elite: 45, boss: 45 };

/** Preço de uma "compra média" (escolha nossa: uma Hyper Potion). */
const REFERENCE_PRICE = 1500;
/** Compras médias por ato (decisão do usuário: umas 3 ou 4). */
const PURCHASES_PER_ACT = 3.5;

const moneyCache = new Map<string, number>();

/**
 * Multiplicador do pagamento: nos caminhos da calibração (o "jogador médio"), os
 * treinadores de um ato antes do chefe rendem em média PURCHASES_PER_ACT compras de
 * REFERENCE_PRICE. O chefe fica de fora da conta: o dinheiro dele só pode ser gasto nas
 * lojas do ato seguinte (e, no último ato, em nenhuma).
 */
export function moneyMultiplier(settings: RunSettings) {
	const key = JSON.stringify([settings.map, settings.extra.startLevel, settings.extra.levelsPerAct]);
	const cached = moneyCache.get(key);
	if (cached) return cached;
	const paths = calibrationPaths(settings);
	let total = 0;
	for (const steps of paths) {
		for (const step of steps) {
			if (!step.trainer || step.boss) continue;
			total += (step.elite ? PAYOUT_BASE.elite : PAYOUT_BASE.trainer) * step.level;
		}
	}
	const perAct = total / Math.max(1, paths.length * settings.map.acts);
	const multiplier = perAct ? PURCHASES_PER_ACT * REFERENCE_PRICE / perAct : 1;
	moneyCache.set(key, multiplier);
	return multiplier;
}

/** Dinheiro de uma vitória: só contra treinadores (e o chefe), pelo nível do último Pokémon. */
export function battlePrize(encounter: Encounter, settings: RunSettings) {
	if (!encounter.trainer) return 0;
	const last = encounter.team[encounter.team.length - 1];
	if (!last) return 0;
	const base = encounter.kind === 'boss' ? PAYOUT_BASE.boss : encounter.kind === 'elite' ? PAYOUT_BASE.elite :
		encounter.source === 'gym' ? PAYOUT_BASE.gym : PAYOUT_BASE.trainer;
	return Math.round(base * last.level * moneyMultiplier(settings) / 10) * 10;
}

// --- Loja ----------------------------------------------------------------------------

/** O que a loja da variação de teste sempre tem (quantidade livre). */
const SHOP_STAPLES = [
	'potion', 'superpotion', 'hyperpotion', 'revive', 'antidote', 'paralyzeheal', 'burnheal', 'awakening', 'iceheal',
	'fullheal',
];

export interface ShopEntry {
	/** Id na mochila: o do catálogo, "tm:<golpe>" ou o nome do item de segurar. */
	item: string;
	price: number;
	/** Uma unidade só (itens de segurar, TMs e Rare Candy). */
	single: boolean;
	group: 'healing' | 'held' | 'special';
}

/** Golpes de TM que um Pokémon pode aprender (em qualquer geração) e ainda não conhece. */
export function tmMovesFor(mon: RunMon): string[] {
	const species = Dex.species.get(mon.species);
	let learnset = Dex.species.getLearnsetData(species.id).learnset;
	if (!learnset && species.baseSpecies !== species.name) {
		learnset = Dex.species.getLearnsetData(toID(species.baseSpecies)).learnset;
	}
	if (!learnset) return [];
	return Object.entries(learnset)
		.filter(([move, sources]) => sources.some(source => /^\d+M$/.test(source)) && !mon.moves.includes(move))
		.map(([move]) => move)
		.filter(move => Dex.moves.get(move).exists)
		.sort();
}

/**
 * Estoque de uma loja: os itens de sempre, 3 itens de segurar, 2 TMs que alguém do
 * time pode aprender e um Rare Candy. Sorteado pela semente da run e pelo nó (o mesmo
 * ao voltar à página).
 */
export function shopStock(run: ExpeditionRun, nodeId: string): ShopEntry[] {
	const prng = seededRandom(run.seed, `shop:${run.act}:${nodeId}`);
	const stock: ShopEntry[] = SHOP_STAPLES.map(id => ({
		item: id, price: itemPrice(id), single: false, group: 'healing',
	}));
	const held = HELD_ITEMS.filter(name => Dex.items.get(name).exists);
	prng.shuffle(held);
	for (const name of held.slice(0, 3)) stock.push({ item: name, price: itemPrice(name), single: true, group: 'held' });
	for (const move of pickTMs(prng, run.team, 2)) {
		stock.push({ item: `${TM_PREFIX}${move}`, price: TM_PRICE, single: true, group: 'special' });
	}
	stock.push({ item: 'rarecandy', price: itemPrice('rarecandy'), single: true, group: 'special' });
	return stock;
}

function pickTMs(prng: PRNG, team: RunMon[], count: number) {
	const picked: string[] = [];
	for (let guard = 0; picked.length < count && guard < 20 && team.length; guard++) {
		const options = tmMovesFor(team[prng.random(team.length)]).filter(move => !picked.includes(move));
		if (options.length) picked.push(options[prng.random(options.length)]);
	}
	return picked;
}

export type EconomyProblem = 'nomoney' | 'soldout' | 'badchoice' | 'noitem' | 'noeffect' | 'badtarget';

/** Compra um item do estoque: o dinheiro sai, o item vai para a mochila. */
export function buyItem(run: ExpeditionRun, nodeId: string, item: string): EconomyProblem | null {
	const entry = shopStock(run, nodeId).find(stock => toID(stock.item) === toID(item) || stock.item === item);
	if (!entry) return 'badchoice';
	const bought: string[] = run.nodeState.bought || [];
	if (entry.single && bought.includes(entry.item)) return 'soldout';
	if (run.money < entry.price) return 'nomoney';
	run.money -= entry.price;
	run.items.push(entry.item);
	if (entry.single) run.nodeState = { ...run.nodeState, bought: [...bought, entry.item] };
	return null;
}

/**
 * Usa um item da mochila num Pokémon (fora da batalha). Devolve o problema, ou as
 * decisões novas (Rare Candy e TM com quatro golpes já conhecidos).
 */
export function useItem(run: ExpeditionRun, item: string, mon: RunMon): EconomyProblem | RunDecision[] {
	const index = run.items.findIndex(entry => entry === item);
	if (index < 0) return 'noitem';
	const move = tmMove(item);
	const usable = consumable(item);
	let decisions: RunDecision[] = [];
	if (move) {
		if (!tmMovesFor(mon).includes(move)) return 'badtarget';
		if (mon.moves.length < 4) {
			mon.moves.push(move);
			mon.ppUsed.push(0);
		} else {
			decisions = [{ kind: 'learn', uid: mon.uid, move }];
		}
	} else if (usable) {
		const effect = usable.effect;
		if (effect.kind === 'heal') {
			if (mon.fainted || (mon.hp >= 1 && !(effect.status && mon.status))) return 'noeffect';
			const max = monStats(mon).hp;
			mon.hp = effect.hp === 'full' ? 1 : Math.min(1, mon.hp + effect.hp / max);
			if (effect.status) mon.status = '';
		} else if (effect.kind === 'revive') {
			if (!mon.fainted) return 'noeffect';
			mon.fainted = false;
			mon.hp = effect.hp;
			mon.status = '';
		} else if (effect.kind === 'status') {
			if (mon.fainted || !mon.status || !effect.cures.includes(mon.status)) return 'noeffect';
			mon.status = '';
		} else if (effect.kind === 'candy') {
			if (mon.level >= MAX_LEVEL) return 'noeffect';
			const before = mon.level;
			mon.level++;
			mon.exp = Math.max(mon.exp, expForLevel(mon.level));
			decisions = levelUpEffects(mon, before, run.settings.theme).decisions;
		} else {
			return 'noeffect';
		}
	} else {
		return 'badchoice';
	}
	run.items.splice(index, 1);
	return decisions;
}

/** O item de uso (ou TM) faria efeito no Pokémon agora (para a página listar só esses). */
export function itemApplies(item: string, mon: RunMon) {
	const move = tmMove(item);
	if (move) return tmMovesFor(mon).includes(move);
	const effect = consumable(item)?.effect;
	if (!effect) return false;
	switch (effect.kind) {
	case 'heal': return !mon.fainted && (mon.hp < 1 || !!(effect.status && mon.status));
	case 'revive': return mon.fainted;
	case 'status': return !mon.fainted && !!mon.status && effect.cures.includes(mon.status);
	case 'candy': return mon.level < MAX_LEVEL;
	default: return false;
	}
}

/** Nome e ícone de um item da mochila ou da loja, para as páginas. */
export function itemDisplay(entry: string): { name: string, icon: string | null, psItem: string | null } {
	const usable = consumable(toID(entry));
	if (usable) return { name: usable.name, icon: usable.icon, psItem: null };
	const move = tmMove(entry);
	if (move) {
		const data = Dex.moves.get(move);
		return { name: `TM ${data.name}`, icon: `tm-${toID(data.type)}`, psItem: null };
	}
	return { name: Dex.items.get(entry).name || entry, icon: null, psItem: Dex.items.get(entry).name || entry };
}

/** Descrição curta de um item de uso (TL), para a loja e a mochila. */
export function consumableDescription(TL: Translator, usable: Consumable) {
	const effect = usable.effect;
	if (effect.kind === 'heal') {
		if (effect.hp === 'full') return effect.status ? TL`Fully restores HP and cures status.` : TL`Fully restores HP.`;
		const hp = effect.hp;
		return TL`Restores ${hp} HP.`;
	}
	if (effect.kind === 'revive') return effect.hp >= 1 ? TL`Revives a fainted Pokémon with full HP.` :
		TL`Revives a fainted Pokémon with half its HP.`;
	if (effect.kind === 'status') {
		if (effect.cures.length > 2) return TL`Cures any status condition.`;
		if (effect.cures.includes('psn')) return TL`Cures poison.`;
		if (effect.cures.includes('par')) return TL`Cures paralysis.`;
		if (effect.cures.includes('brn')) return TL`Heals a burn.`;
		if (effect.cures.includes('slp')) return TL`Wakes up a sleeping Pokémon.`;
		return TL`Thaws out a frozen Pokémon.`;
	}
	if (effect.kind === 'candy') return TL`Raises a Pokémon's level by one.`;
	return TL`Used to catch Pokémon.`;
}
