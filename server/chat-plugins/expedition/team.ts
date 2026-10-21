/**
 * pokemon-showdown-custom: o time da run na Expedição.
 *
 * Cada Pokémon guarda o que vale de uma batalha para a outra: espécie, nível,
 * experiência, golpes, habilidade, natureza, IVs e item, além do estado (HP, PP e
 * desmaio), que as variações com desgaste mantêm entre as batalhas.
 *
 * Experiência (decisão do usuário: a dos jogos, recalibrada): fórmula da geração 5 em
 * diante. Os dados do PS não têm a experiência base nem a curva de crescimento das
 * espécies, então a experiência base é estimada pela soma dos atributos base, e todas
 * as espécies usam a curva "média rápida" (nível³). A variação multiplica o resultado
 * (progression.ts) para o time chegar ao nível-alvo no último andar.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import { toID } from '../../../sim/dex-data';

export interface RunMon {
	/** Identificador do Pokémon dentro da run. */
	uid: string;
	species: string;
	level: number;
	/** Experiência total (curva nível³). */
	exp: number;
	/** Ids dos golpes (até 4). */
	moves: string[];
	ability: string;
	nature: string;
	gender: '' | 'M' | 'F';
	ivs: { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };
	item: string;
	/** HP atual, em fração do máximo (0 a 1). */
	hp: number;
	/** PP gastos de cada golpe (na ordem de `moves`). */
	ppUsed: number[];
	fainted: boolean;
}

/** Iniciais oficiais das gerações 1 a 9 (os das variações que sorteiam iniciais dos jogos). */
export const GAME_STARTERS = [
	'bulbasaur', 'charmander', 'squirtle', 'chikorita', 'cyndaquil', 'totodile', 'treecko', 'torchic', 'mudkip',
	'turtwig', 'chimchar', 'piplup', 'snivy', 'tepig', 'oshawott', 'chespin', 'fennekin', 'froakie',
	'rowlet', 'litten', 'popplio', 'grookey', 'scorbunny', 'sobble', 'sprigatito', 'fuecoco', 'quaxly',
] as const;

/**
 * Golpes aprendidos por nível, pelo learnset da geração mais recente que tem dados de
 * nível (formas sem learnset próprio usam o da espécie base), em ordem de nível.
 */
export function levelUpTable(speciesName: string): { move: string, level: number }[] {
	const species = Dex.species.get(speciesName);
	let learnset = Dex.species.getLearnsetData(species.id).learnset;
	if (!learnset && species.baseSpecies !== species.name) {
		learnset = Dex.species.getLearnsetData(toID(species.baseSpecies)).learnset;
	}
	if (!learnset) return [];
	const byGen = new Map<number, { move: string, level: number }[]>();
	for (const [move, sources] of Object.entries(learnset)) {
		for (const source of sources) {
			const match = /^(\d+)L(\d+)$/.exec(source);
			if (!match) continue;
			const gen = Number(match[1]);
			if (!byGen.has(gen)) byGen.set(gen, []);
			byGen.get(gen)!.push({ move, level: Number(match[2]) });
		}
	}
	if (!byGen.size) return [];
	return byGen.get(Math.max(...byGen.keys()))!.sort((a, b) => a.level - b.level);
}

/** Golpes aprendidos ao subir do nível `from` (exclusive) ao `to` (inclusive), em ordem. */
export function movesLearnedBetween(speciesName: string, from: number, to: number): string[] {
	const moves: string[] = [];
	for (const entry of levelUpTable(speciesName)) {
		if (entry.level > from && entry.level <= to && !moves.includes(entry.move)) moves.push(entry.move);
	}
	return moves;
}

/**
 * Golpes que a espécie conhece no nível: os últimos (até 4) aprendidos por nível,
 * como nos jogos.
 */
export function levelUpMoves(speciesName: string, level: number): string[] {
	const known = levelUpTable(speciesName).filter(entry => entry.level <= level);
	const moves: string[] = [];
	for (const { move } of known) {
		const index = moves.indexOf(move);
		if (index >= 0) moves.splice(index, 1);
		moves.push(move);
	}
	return moves.slice(-4);
}

const NATURES = [
	'Hardy', 'Lonely', 'Brave', 'Adamant', 'Naughty', 'Bold', 'Docile', 'Relaxed', 'Impish', 'Lax', 'Timid', 'Hasty',
	'Serious', 'Jolly', 'Naive', 'Modest', 'Mild', 'Quiet', 'Bashful', 'Rash', 'Calm', 'Gentle', 'Sassy', 'Careful', 'Quirky',
];

/**
 * Pokémon novo, como encontrado nos jogos: golpes do nível, uma das habilidades comuns
 * (sem a oculta), natureza, gênero e IVs sorteados, sem item e com o HP cheio.
 */
export function createMon(prng: PRNG, speciesName: string, level: number, uid: string): RunMon {
	const species = Dex.species.get(speciesName);
	const abilities = [species.abilities[0], species.abilities[1]].filter(Boolean) as string[];
	let gender: RunMon['gender'] = '';
	if (species.gender) {
		gender = species.gender === 'N' ? '' : species.gender;
	} else {
		gender = prng.random() < species.genderRatio.M ? 'M' : 'F';
	}
	const iv = () => prng.random(32);
	const moves = levelUpMoves(species.name, level);
	return {
		uid, species: species.name, level, exp: expForLevel(level), moves,
		ability: abilities[prng.random(abilities.length)] || '',
		nature: NATURES[prng.random(NATURES.length)], gender,
		ivs: { hp: iv(), atk: iv(), def: iv(), spa: iv(), spd: iv(), spe: iv() },
		item: '', hp: 1, ppUsed: moves.map(() => 0), fainted: false,
	};
}

// --- Experiência ---------------------------------------------------------------------

export const MAX_LEVEL = 100;

/**
 * Curva de experiência: nível elevado a 2,5, na escala da curva "média rápida" dos jogos
 * (1.000.000 no nível 100). Com a cúbica dos jogos, a primeira vitória da run (nível
 * 5) valia 8 níveis; com 2,5 o ganho de nível por batalha fica parecido do começo ao
 * fim (simulação de 2026-10-21, documentada em docs/arquitetura-expedicao.md).
 */
const CURVE_POWER = 2.5;
const CURVE_SCALE = MAX_LEVEL ** (3 - CURVE_POWER);

/** Experiência total para estar no nível. */
export function expForLevel(level: number) {
	return Math.round(Math.max(1, Math.min(MAX_LEVEL, level)) ** CURVE_POWER * CURVE_SCALE);
}

export function levelForExp(exp: number) {
	let level = Math.max(1, Math.min(MAX_LEVEL, Math.floor((exp / CURVE_SCALE) ** (1 / CURVE_POWER))));
	while (level < MAX_LEVEL && expForLevel(level + 1) <= exp) level++;
	while (level > 1 && expForLevel(level) > exp) level--;
	return level;
}

/** Experiência base estimada pela soma dos atributos base (os dados do PS não a têm). */
export function baseExpYield(speciesName: string) {
	const stats = Dex.species.get(speciesName).baseStats;
	const total = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
	return Math.max(36, Math.round(total * total / 1500));
}

/**
 * Experiência por derrotar um Pokémon (fórmula da geração 5 em diante): mais para
 * quem tem nível menor que o derrotado, menos para quem tem nível maior; 1,5 vez
 * contra treinadores; vezes o multiplicador da variação.
 */
export function expReward(defeated: { species: string, level: number }, winnerLevel: number, trainer: boolean,
	multiplier = 1) {
	const level = defeated.level;
	const ratio = ((2 * level + 10) / (level + winnerLevel + 10)) ** 2.5;
	const base = baseExpYield(defeated.species) * level / 5 * ratio + 1;
	return Math.floor(base * (trainer ? 1.5 : 1) * multiplier);
}

/** Cura completa: HP e PP cheios, e quem estava desmaiado volta. */
export function healMon(mon: RunMon) {
	mon.hp = 1;
	mon.fainted = false;
	mon.ppUsed = mon.moves.map(() => 0);
}
