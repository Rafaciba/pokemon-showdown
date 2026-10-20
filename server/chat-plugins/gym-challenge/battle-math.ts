/**
 * pokemon-showdown-custom: cálculos de batalha das IAs do Desafio de Ginásios.
 *
 * Estimativas usadas pelas IAs heurísticas (heuristic-ai.ts) e pela IA Mestre
 * (position.ts): atributos estimados do adversário, velocidade, tipo,
 * poder efetivo e dano esperado de um golpe, em % do HP.
 *
 * @license MIT
 */
import type { Move } from '../../../sim/dex-moves';
import { toID } from '../../../sim/dex-data';
import type { LevelRules } from './heuristic-ai';

/** Habilidades que anulam um tipo de golpe (para estimar o risco de imunidade). */
export const IMMUNITY_ABILITIES: { [ability: string]: string } = {
	levitate: 'Ground', eartheater: 'Ground', flashfire: 'Fire', wellbakedbody: 'Fire', waterabsorb: 'Water',
	stormdrain: 'Water', dryskin: 'Water', voltabsorb: 'Electric', lightningrod: 'Electric', motordrive: 'Electric',
	sapsipper: 'Grass',
};
/** Status → tipos imunes a ele. */
export const STATUS_IMMUNE_TYPES: { [status: string]: string[] } = {
	brn: ['Fire'], par: ['Electric'], psn: ['Poison', 'Steel'], tox: ['Poison', 'Steel'], frz: ['Ice'], slp: [],
};

export type Stats = { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };

/** Um lado do confronto, com o que se sabe dele. */
export interface Fighter {
	species: string;
	level: number;
	types: string[];
	stats: Stats;
	/** HP em porcentagem. */
	hp: number;
	status: string;
	boosts: { [stat: string]: number };
	/** Habilidades possíveis (a nossa é conhecida; a do adversário, só as da espécie). */
	abilities: string[];
	/** Golpes conhecidos (todos os nossos; os revelados do adversário). */
	moves: Move[];
}

/** Atributo estimado de um Pokémon do adversário (IVs máximos, EVs medianos, natureza neutra). */
export function estimateStat(base: number, level: number, isHP: boolean) {
	const core = Math.floor((2 * base + 31 + 21) * level / 100);
	return isHP ? core + level + 10 : core + 5;
}

export function speciesStats(species: string, level: number): Stats {
	const base = Dex.species.get(species).baseStats;
	return {
		hp: estimateStat(base.hp, level, true), atk: estimateStat(base.atk, level, false),
		def: estimateStat(base.def, level, false), spa: estimateStat(base.spa, level, false),
		spd: estimateStat(base.spd, level, false), spe: estimateStat(base.spe, level, false),
	};
}

export function boostFactor(stage = 0) {
	return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

/** Velocidade efetiva (boosts e paralisia). */
export function speedOf(fighter: Fighter) {
	return fighter.stats.spe * boostFactor(fighter.boosts.spe) * (fighter.status === 'par' ? 0.5 : 1);
}

/** Soma dos buffs ofensivos (ataque, ataque especial, velocidade). */
export function offensiveBoosts(fighter: Fighter) {
	return ['atk', 'spa', 'spe'].reduce((sum, stat) => sum + Math.max(0, fighter.boosts[stat] || 0), 0);
}

export function getMove(id: string): Move {
	let move = Dex.moves.get(id);
	// Return/Frustration chegam com o poder no id (ex.: return102)
	if (!move.exists) move = Dex.moves.get(id.replace(/\d+$/, ''));
	return move;
}

/** Multiplicador de tipo; 1 quando o nível não considera tipos. */
export function typeFactor(moveType: string, defender: Fighter, typeAware: boolean) {
	if (!typeAware) return 1;
	if (!Dex.getImmunity(moveType, defender.types)) return 0;
	let factor = 2 ** Dex.getEffectiveness(moveType, defender.types);
	// Habilidade que anula o tipo: certa se for a única possível, provável se for uma das possíveis
	const immune = defender.abilities.filter(ability => IMMUNITY_ABILITIES[toID(ability)] === moveType).length;
	if (immune && immune === defender.abilities.length) factor = 0;
	else if (immune) factor *= 0.5;
	return factor;
}

/** Poder efetivo de um golpe de dano (golpes de dois turnos, recarga e autodestruição valem menos). */
export function effectivePower(move: Move, careful: boolean) {
	if (move.category === 'Status') return 0;
	let power = move.basePower || 60; // golpes de poder variável (Low Kick, Gyro Ball...)
	if (move.multihit) power *= Array.isArray(move.multihit) ? 3 : move.multihit;
	if (move.flags.charge) power *= 0.5;
	if (move.flags.recharge) power *= 0.6;
	if (careful && move.selfdestruct) power *= 0.3;
	return power;
}

/** Dano estimado de `move` em porcentagem do HP máximo do defensor. */
export function estimateDamage(
	attacker: Fighter, move: Move, defender: Fighter, rules: Pick<LevelRules, 'typeAware'>
): number {
	if (move.category === 'Status') return 0;
	const accuracy = move.accuracy === true ? 1 : move.accuracy / 100;
	if (move.damage === 'level') return attacker.level / defender.stats.hp * 100 * accuracy;
	if (typeof move.damage === 'number') return move.damage / defender.stats.hp * 100 * accuracy;
	const physical = move.category === 'Physical';
	const [attackStat, defenseStat] = physical ? ['atk', 'def'] as const : ['spa', 'spd'] as const;
	const attack = attacker.stats[attackStat] * boostFactor(attacker.boosts[attackStat]);
	const defense = defender.stats[defenseStat] * boostFactor(defender.boosts[defenseStat]);
	const base = Math.floor(2 * attacker.level / 5 + 2) * effectivePower(move, rules.typeAware) * attack / defense;
	let damage = Math.floor(Math.floor(base) / 50) + 2;
	if (attacker.types.includes(move.type)) damage *= 1.5;
	if (physical && attacker.status === 'brn') damage *= 0.5;
	damage *= typeFactor(move.type, defender, rules.typeAware);
	return damage * 0.925 * accuracy / defender.stats.hp * 100;
}

/** Golpes "virtuais" de mesmo tipo do adversário (80 de poder), quando não se sabe os golpes dele. */
export function stabMoves(fighter: Fighter): Move[] {
	const physical = fighter.stats.atk >= fighter.stats.spa;
	return fighter.types.map(type => ({
		...Dex.moves.get(physical ? 'tackle' : 'swift'), type, basePower: 80, accuracy: true, flags: {}, multihit: undefined,
	} as unknown as Move));
}
