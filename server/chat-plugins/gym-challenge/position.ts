/**
 * pokemon-showdown-custom: retrato numérico de uma posição da batalha (IA Mestre).
 *
 * A posição é vista por um lado: o próprio time vem completo no pedido do simulador,
 * e do adversário só se sabe o que o log já mostrou (battle-view.ts). Pokémon do
 * adversário ainda não vistos contam como saudáveis. Daqui saem as características
 * (`positionFeatures`) que o modelo de avaliação (value-model.ts) usa para estimar a
 * chance de vitória. Não há dado de jogador: só espécies, HP, status, boosts e campo.
 *
 * @license MIT
 */
import type { ChoiceRequest, PokemonSwitchRequestData } from '../../../sim/side';
import type { Move } from '../../../sim/dex-moves';
import { toID } from '../../../sim/dex-data';
import type { BattleState, SeenPokemon } from './battle-view';
import { estimateDamage, getMove, speciesStats, speedOf, stabMoves, type Fighter } from './battle-math';

/** Estimativas de dano da posição consideram tipos e imunidades (como o Difícil). */
const ESTIMATE_RULES = { typeAware: true };

export interface MonState extends Fighter {
	name: string;
	active: boolean;
	substitute: boolean;
}

export interface SidePosition {
	/** Pokémon conhecidos (nossos: todos; do adversário: os já vistos). */
	mons: MonState[];
	/** Pokémon do adversário ainda não vistos (contam como saudáveis). */
	unseen: number;
	/** Hazards e telas do lado, por id: camadas. */
	conditions: Map<string, number>;
}

export interface Position {
	us: SidePosition;
	them: SidePosition;
	weather: string;
}

function ourMon(mon: PokemonSwitchRequestData, seen: SeenPokemon | undefined): MonState {
	const [species, levelText] = mon.details.split(',').map(part => part.trim());
	const level = /^L\d+$/.test(levelText || '') ? Number(levelText.slice(1)) : 100;
	const [hpText, status] = mon.condition.split(' ');
	const [current, max] = hpText.split('/').map(Number);
	return {
		name: mon.ident.slice(mon.ident.indexOf(':') + 1).trim(),
		species, level, types: Dex.species.get(species).types,
		stats: { hp: max || 1, ...mon.stats },
		hp: status === 'fnt' || !max ? 0 : current / max * 100,
		status: status && status !== 'fnt' ? status : '',
		boosts: mon.active ? seen?.boosts || {} : {},
		abilities: [mon.ability || mon.baseAbility],
		moves: mon.moves.map(getMove).filter(move => move.exists),
		active: !!mon.active,
		substitute: !!(mon.active && seen?.substitute),
	};
}

/** Repertório de golpes de cada espécie no Random Battle (gen 9), carregado sob demanda. */
let randomSets: { [species: string]: { sets: { movepool: string[] }[] } } | null = null;
const likelyCache = new Map<string, Move[]>();

/**
 * Golpes prováveis de uma espécie do adversário: o repertório dela nos sets do Random
 * Battle do PS (todos os papéis). Vazio quando a espécie não está lá.
 */
export function likelyMoves(species: string): Move[] {
	const id = toID(species);
	const cached = likelyCache.get(id);
	if (cached) return cached;
	randomSets ||= require('../../../data/random-battles/gen9/sets.json');
	const data = randomSets![id] || randomSets![toID(Dex.species.get(species).baseSpecies)];
	const names = new Set<string>();
	for (const set of data?.sets || []) for (const move of set.movepool) names.add(move);
	const moves = [...names].map(getMove).filter(move => move.exists);
	likelyCache.set(id, moves);
	return moves;
}

function theirMon(seen: SeenPokemon, active: boolean): MonState {
	const data = Dex.species.get(seen.species);
	const mon: MonState = {
		name: seen.name, species: seen.species, level: seen.level, types: data.types,
		stats: speciesStats(seen.species, seen.level),
		hp: seen.fainted ? 0 : seen.hp, status: seen.status, boosts: active ? seen.boosts : {},
		abilities: Object.values(data.abilities).filter(Boolean),
		moves: [], active, substitute: active && seen.substitute,
	};
	// Golpes revelados (todos, inclusive de status) e os prováveis da espécie; sem repertório
	// conhecido, golpes "virtuais" do tipo dele
	const revealed = [...seen.moves].map(getMove).filter(move => move.exists);
	const likely = likelyMoves(seen.species).filter(move => !seen.moves.has(move.id));
	mon.moves = [...revealed, ...(likely.length ? likely : stabMoves(mon))];
	return mon;
}

/** Monta a posição vista pelo lado do pedido. */
export function buildPosition(request: ChoiceRequest, state: BattleState): Position {
	const ourSide = request.side.id;
	const theirSide = ourSide === 'p1' ? 'p2' : 'p1';
	const ourView = state.sides[ourSide];
	const theirView = state.sides[theirSide];
	const us: SidePosition = {
		mons: request.side.pokemon.map(mon => (
			ourMon(mon, ourView?.pokemon.get(mon.ident.slice(mon.ident.indexOf(':') + 1).trim()))
		)),
		unseen: 0,
		conditions: new Map(ourView?.conditions || []),
	};
	const activeName = theirView?.activeSlots[0] ?? theirView?.active ?? null;
	const seenMons = theirView ? [...theirView.pokemon.values()] : [];
	const total = Math.max(theirView?.teamSize || 0, theirView?.preview.length || 0, seenMons.length);
	const them: SidePosition = {
		mons: seenMons.map(seen => theirMon(seen, seen.name === activeName && !seen.fainted)),
		unseen: Math.max(0, total - seenMons.length),
		conditions: new Map(theirView?.conditions || []),
	};
	return { us, them, weather: state.weather };
}

// --- Características -------------------------------------------------------------------

export const FEATURES = [
	'ourHp', 'theirHp', 'ourAlive', 'theirAlive', 'ourActiveHp', 'theirActiveHp',
	'ourDamage', 'theirDamage', 'faster', 'weKo', 'theyKo', 'koFirst',
	'ourBench', 'theirBench', 'ourBoosts', 'theirBoosts', 'ourStatus', 'theirStatus',
	'ourHazards', 'theirHazards', 'ourScreens', 'theirScreens',
] as const;

/** Peso de cada status como desvantagem (sono e congelamento tiram o Pokémon do jogo). */
const STATUS_BURDEN: { [status: string]: number } = { slp: 1, frz: 1, par: 0.6, tox: 0.6, psn: 0.4, brn: 0.5 };

export function activeOf(side: SidePosition): MonState | null {
	return side.mons.find(mon => mon.active && mon.hp > 0) || null;
}

export function bestDamage(attacker: MonState, defender: MonState) {
	let best = 0;
	for (const move of attacker.moves) best = Math.max(best, estimateDamage(attacker, move, defender, ESTIMATE_RULES));
	return best;
}

/** Dano dos hazards ao entrar, em % do HP. */
export function entryDamage(mon: Fighter, conditions: Map<string, number>) {
	let damage = 0;
	if (conditions.has('stealthrock')) damage += 12.5 * 2 ** Dex.getEffectiveness('Rock', mon.types);
	const grounded = !mon.types.includes('Flying') && toID(mon.abilities[0]) !== 'levitate';
	const spikes = Math.min(conditions.get('spikes') || 0, 3);
	if (grounded && spikes) damage += [0, 12.5, 16.7, 25][spikes];
	return damage;
}

/** Melhor confronto de um Pokémon do banco contra o ativo adversário (dano causado menos sofrido), em %. */
function benchMatchup(side: SidePosition, foe: MonState | null) {
	if (!foe) return 0;
	let best = -Infinity;
	for (const mon of side.mons) {
		if (mon.active || mon.hp <= 0) continue;
		const left = mon.hp - entryDamage(mon, side.conditions);
		if (left <= 0) continue;
		best = Math.max(best, Math.min(bestDamage(mon, foe), foe.hp) - Math.min(bestDamage(foe, mon), left));
	}
	return best === -Infinity ? 0 : best;
}

function sideTotals(side: SidePosition) {
	let hp = side.unseen * 100;
	let alive = side.unseen;
	let status = 0;
	let hazards = side.unseen * entryDamage({ types: ['Normal'], abilities: [''] } as unknown as Fighter, side.conditions);
	for (const mon of side.mons) {
		if (mon.hp <= 0) continue;
		hp += mon.hp;
		alive++;
		status += STATUS_BURDEN[mon.status] || 0;
		if (!mon.active) hazards += entryDamage(mon, side.conditions);
	}
	const screens = ['reflect', 'lightscreen', 'auroraveil'].filter(id => side.conditions.has(id)).length;
	return { hp, alive, status, hazards, screens };
}

function boostSum(mon: MonState | null) {
	if (!mon) return 0;
	return Object.values(mon.boosts).reduce((sum, stage) => sum + (stage || 0), 0);
}

/** Características da posição, na ordem de FEATURES (escalas próximas de 0 a 1 ou de -1 a 1). */
export function positionFeatures(position: Position): number[] {
	const ours = sideTotals(position.us);
	const theirs = sideTotals(position.them);
	const me = activeOf(position.us);
	const foe = activeOf(position.them);
	const ourDamage = me && foe ? Math.min(bestDamage(me, foe), foe.hp) : 0;
	const theirDamage = me && foe ? Math.min(bestDamage(foe, me), me.hp) : 0;
	const faster = me && foe ? Math.sign(speedOf(me) - speedOf(foe)) : 0;
	const weKo = me && foe && ourDamage >= foe.hp ? 1 : 0;
	const theyKo = me && foe && theirDamage >= me.hp ? 1 : 0;
	const koFirst = weKo && (faster > 0 || !theyKo) ? 1 : theyKo && (faster < 0 || !weKo) ? -1 : 0;
	return [
		ours.hp / 100, theirs.hp / 100, ours.alive, theirs.alive, (me?.hp || 0) / 100, (foe?.hp || 0) / 100,
		ourDamage / 100, theirDamage / 100, faster, weKo, theyKo, koFirst,
		benchMatchup(position.us, foe) / 100, benchMatchup(position.them, me) / 100,
		boostSum(me) / 6, boostSum(foe) / 6, ours.status, theirs.status,
		ours.hazards / 100, theirs.hazards / 100, ours.screens, theirs.screens,
	];
}
