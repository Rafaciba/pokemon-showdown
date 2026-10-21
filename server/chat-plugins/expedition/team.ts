/**
 * pokemon-showdown-custom: o time da run na Expedição.
 *
 * Cada Pokémon guarda o que vale de uma batalha para a outra: espécie, nível, golpes,
 * habilidade, natureza, IVs e item, além do estado (HP, PP e desmaio), que as
 * variações com desgaste mantêm entre as batalhas (etapa 2).
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
 * Golpes que a espécie conhece no nível: os últimos (até 4) aprendidos por nível,
 * como nos jogos, pelo learnset da geração mais recente que tem dados de nível.
 */
export function levelUpMoves(speciesName: string, level: number): string[] {
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
	const latest = byGen.get(Math.max(...byGen.keys()))!;
	const known = latest.filter(entry => entry.level <= level).sort((a, b) => a.level - b.level);
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
		uid, species: species.name, level, moves, ability: abilities[prng.random(abilities.length)] || '',
		nature: NATURES[prng.random(NATURES.length)], gender,
		ivs: { hp: iv(), atk: iv(), def: iv(), spa: iv(), spd: iv(), spe: iv() },
		item: '', hp: 1, ppUsed: moves.map(() => 0), fainted: false,
	};
}

/** Cura completa: HP e PP cheios, e quem estava desmaiado volta. */
export function healMon(mon: RunMon) {
	mon.hp = 1;
	mon.fainted = false;
	mon.ppUsed = mon.moves.map(() => 0);
}
