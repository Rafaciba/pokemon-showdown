/**
 * pokemon-showdown-custom: busca da IA Mestre no simulador do PS (batalhas individuais).
 *
 * Para decidir uma jogada, a Mestre monta batalhas no próprio simulador do PS com o
 * estado atual: o nosso time exato (pedido do simulador) e um PALPITE do time do
 * adversário. O palpite usa só o que é público: os Pokémon já vistos, os golpes já
 * revelados, completados com golpes sorteados do repertório da espécie no Random
 * Battle (position.ts → likelyMoves), e uma das habilidades possíveis. A Mestre não
 * vê o time do jogador. Cada combinação de jogada nossa e resposta do adversário é
 * jogada por um turno, e a posição resultante é avaliada pelo modelo (value-model.ts).
 * Vários palpites (com sementes diferentes) são testados até o limite de tempo.
 *
 * @license MIT
 */
import type { MoveRequest, PokemonSwitchRequestData } from '../../../sim/side';
import type { Pokemon } from '../../../sim/pokemon';
import type { PokemonSet } from '../../../sim/teams';
import { Battle } from '../../../sim/battle';
import type { BattleState, SeenPokemon } from './battle-view';
import { getMove } from './battle-math';
import { likelyMoves, positionFeatures, type MonState, type Position, type SidePosition } from './position';
import { winProbability, type ValueModel } from './value-model';

/** Contadores da busca (banco de testes e, depois, o painel): buscas, sem resultado, jogadas trocadas e tempo. */
export const simSearchStats = { searches: 0, failed: 0, changed: 0, totalMs: 0, samples: 0 };

export interface SimSearchOptions {
	/** 0 = média das respostas do adversário; 1 = só a pior. */
	pessimism: number;
	/** Vantagem mínima (chance estimada) para trocar a jogada das regras. */
	margin: number;
	/** Tempo máximo da busca, em ms (pelo menos um palpite é sempre avaliado). */
	budgetMs: number;
	/** Máximo de palpites do time do adversário. */
	samples: number;
	/** Semente fixa dos palpites (testes); sem ela, sorteios a cada busca. */
	seed?: number;
}

/** Formato das batalhas simuladas: aceita tudo (Pokédex completa, Megaevolução). */
const SIM_FORMAT = 'gen9nationaldexag';
/** Trocas do adversário consideradas (as primeiras do banco já visto). */
const THEIR_SWITCHES = 2;
/** Golpe genérico de cada tipo, para espécies sem repertório conhecido: [físico, especial]. */
const TYPE_MOVES: { [type: string]: [string, string] } = {
	Normal: ['bodyslam', 'hypervoice'], Fire: ['flareblitz', 'flamethrower'], Water: ['waterfall', 'surf'],
	Electric: ['wildcharge', 'thunderbolt'], Grass: ['woodhammer', 'energyball'], Ice: ['iciclecrash', 'icebeam'],
	Fighting: ['closecombat', 'aurasphere'], Poison: ['poisonjab', 'sludgebomb'], Ground: ['earthquake', 'earthpower'],
	Flying: ['bravebird', 'airslash'], Psychic: ['zenheadbutt', 'psychic'], Bug: ['xscissor', 'bugbuzz'],
	Rock: ['stoneedge', 'powergem'], Ghost: ['shadowclaw', 'shadowball'], Dragon: ['dragonclaw', 'dragonpulse'],
	Dark: ['crunch', 'darkpulse'], Steel: ['ironhead', 'flashcannon'], Fairy: ['playrough', 'moonblast'],
};
const HAZARDS = new Set(['stealthrock', 'spikes', 'toxicspikes', 'stickyweb']);
const SCREENS = new Set(['reflect', 'lightscreen', 'auroraveil']);

/** Gerador simples e determinístico (para os palpites). */
function makeRandom(seed: number) {
	let state = seed >>> 0 || 1;
	return () => {
		state = (state * 1664525 + 1013904223) >>> 0;
		return state / 4294967296;
	};
}

function nameOf(ident: string) {
	return ident.slice(ident.indexOf(':') + 1).trim();
}

function parseDetails(details: string) {
	const parts = details.split(',').map(part => part.trim());
	const level = parts.find(part => /^L\d+$/.test(part));
	const gender = parts.find(part => part === 'M' || part === 'F');
	return { species: parts[0], level: level ? Number(level.slice(1)) : 100, gender: gender || '' };
}

/** Set do nosso Pokémon a partir do pedido (os atributos exatos entram depois, no estado). */
function ourSet(mon: PokemonSwitchRequestData): PokemonSet {
	const { species, level, gender } = parseDetails(mon.details);
	return {
		name: nameOf(mon.ident), species, level, gender, item: mon.item || '', ability: mon.ability || mon.baseAbility,
		moves: mon.moves.map(id => getMove(id).name || id), nature: 'Serious',
		evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
	} as PokemonSet;
}

/** Palpite do set de um Pokémon do adversário (só informação pública). */
function guessSet(seen: SeenPokemon, random: () => number): PokemonSet {
	const species = Dex.species.get(seen.species);
	const revealed = [...seen.moves].map(getMove).filter(move => move.exists).map(move => move.name);
	const pool = likelyMoves(seen.species).map(move => move.name).filter(name => !revealed.includes(name));
	const moves = revealed.slice(0, 4);
	while (moves.length < 4 && pool.length) moves.push(pool.splice(Math.floor(random() * pool.length), 1)[0]);
	if (!moves.length) {
		const physical = species.baseStats.atk >= species.baseStats.spa;
		for (const type of species.types) moves.push(getMove(TYPE_MOVES[type]?.[physical ? 0 : 1] || 'tackle').name);
	}
	const abilities = Object.values(species.abilities).filter(Boolean) as string[];
	return {
		name: seen.name, species: species.name, level: seen.level, gender: '',
		item: species.requiredItem || '', ability: abilities[Math.floor(random() * abilities.length)] || '',
		moves, nature: 'Serious',
		evs: { hp: 84, atk: 84, def: 84, spa: 84, spd: 84, spe: 84 },
		ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
	} as PokemonSet;
}

/** Estado da busca: os dois times, na ordem das escolhas, e o que aplicar depois de montar a batalha. */
interface Snapshot {
	ourSide: 'p1' | 'p2';
	ours: PokemonSwitchRequestData[];
	/** Pokémon do adversário já vistos, o ativo primeiro. */
	theirs: SeenPokemon[];
	theirUnseen: number;
	state: BattleState;
}

function snapshot(request: MoveRequest | { side: MoveRequest['side'] }, state: BattleState): Snapshot | null {
	const ourSide = request.side.id as 'p1' | 'p2';
	const theirSide = ourSide === 'p1' ? 'p2' : 'p1';
	const view = state.sides[theirSide];
	if (!view) return null;
	const activeName = view.activeSlots[0] ?? view.active;
	const seen = [...view.pokemon.values()];
	const active = seen.find(mon => mon.name === activeName && !mon.fainted);
	if (!active) return null;
	const total = Math.max(view.teamSize || 0, view.preview.length, seen.length);
	return {
		ourSide, ours: request.side.pokemon, theirs: [active, ...seen.filter(mon => mon !== active)],
		theirUnseen: Math.max(0, total - seen.length), state,
	};
}

function applyCondition(
	pokemon: Pokemon, hpPercent: number | null, hp: number | null, status: string, fainted: boolean
) {
	if (fainted || hp === 0 || hpPercent === 0) {
		pokemon.hp = 0;
		pokemon.fainted = true;
		pokemon.status = 'fnt' as ID;
		return;
	}
	pokemon.hp = hp ?? Math.max(1, Math.round(pokemon.maxhp * hpPercent! / 100));
	if (status && status !== pokemon.status) pokemon.setStatus(status, pokemon, null, true);
}

/**
 * Monta a batalha do palpite com o estado atual. `activeIndex` troca o nosso ativo
 * (trocas obrigatórias). Devolve null se a batalha não puder ser montada.
 */
function buildBattle(snap: Snapshot, random: () => number, seed: string, activeIndex?: number): Battle | null {
	const ourTeam = snap.ours.map(ourSet);
	const theirTeam = snap.theirs.map(seen => guessSet(seen, random));
	// Na troca obrigatória, quem vai entrar fica na frente (as escolhas são sempre pelos slots do pedido)
	const order = snap.ours.map((_, i) => i);
	if (activeIndex !== undefined) {
		order.splice(order.indexOf(activeIndex), 1);
		order.unshift(activeIndex);
	}
	const theirSide = snap.ourSide === 'p1' ? 'p2' : 'p1';
	let battle: Battle;
	try {
		battle = new Battle({ formatid: SIM_FORMAT as ID, seed: seed as `sodium,${string}` });
		const ourPlayer = { name: 'us', team: order.map(i => ourTeam[i]) };
		const theirPlayer = { name: 'them', team: theirTeam };
		battle.setPlayer(snap.ourSide, ourPlayer);
		battle.setPlayer(theirSide, theirPlayer);
		if (battle.requestState === 'teampreview') {
			battle.makeChoices(...battle.sides.map(side => `team ${side.pokemon.map((_, i) => i + 1).join('')}`));
		}
	} catch {
		return null;
	}
	const us = battle.getSide(snap.ourSide);
	const them = battle.getSide(theirSide);
	us.pokemon.forEach((pokemon, i) => {
		const mon = snap.ours[order[i]];
		const [hpText, status] = mon.condition.split(' ');
		const [current, max] = hpText.split('/').map(Number);
		pokemon.storedStats = { ...mon.stats };
		if (max) {
			pokemon.maxhp = max;
			pokemon.baseMaxhp = max;
		}
		applyCondition(pokemon, null, current || 0, status && status !== 'fnt' ? status : '', status === 'fnt');
	});
	them.pokemon.forEach((pokemon, i) => {
		const seen = snap.theirs[i];
		applyCondition(pokemon, seen.hp, null, seen.status, seen.fainted);
	});
	const ourActive = us.active[0];
	const theirActive = them.active[0];
	// Boosts dos ativos (o nosso só se não houve troca obrigatória)
	const ourView = snap.state.sides[snap.ourSide];
	const ourSeen = ourView?.pokemon.get(nameOf(snap.ours[order[0]].ident));
	if (activeIndex === undefined && ourSeen) Object.assign(ourActive.boosts, ourSeen.boosts);
	Object.assign(theirActive.boosts, snap.theirs[0].boosts);
	const sides = [[us, ourView, theirActive], [them, snap.state.sides[theirSide], ourActive]] as const;
	for (const [side, view, source] of sides) {
		for (const [id, layers] of view?.conditions || []) {
			if (!HAZARDS.has(id) && !SCREENS.has(id)) continue;
			for (let n = 0; n < layers; n++) side.addSideCondition(id, source);
		}
	}
	if (snap.state.weather) {
		try {
			battle.field.setWeather(snap.state.weather, ourActive);
		} catch {}
	}
	us.pokemonLeft = us.pokemon.filter(pokemon => !pokemon.fainted).length;
	them.pokemonLeft = them.pokemon.filter(pokemon => !pokemon.fainted).length + snap.theirUnseen;
	if (ourActive.fainted || theirActive.fainted) return null;
	// Só a partir daqui o log interessa (o simulador limita o tamanho do log de um turno)
	battle.log.length = 0;
	return battle;
}

/** Posição (para o modelo) a partir de uma batalha simulada. */
function positionOf(battle: Battle, ourSide: string, theirUnseen: number): Position {
	const sideOf = (sideId: string, unseen: number): SidePosition => {
		const side = battle.getSide(sideId as 'p1');
		return {
			mons: side.pokemon.map(pokemon => ({
				name: pokemon.name, species: pokemon.species.name, level: pokemon.level, types: pokemon.getTypes(),
				stats: { hp: pokemon.maxhp, ...pokemon.storedStats },
				hp: pokemon.fainted ? 0 : pokemon.hp / pokemon.maxhp * 100,
				status: pokemon.fainted ? '' : pokemon.status,
				boosts: pokemon.isActive ? { ...pokemon.boosts } : {},
				abilities: [pokemon.ability], moves: pokemon.moveSlots.map(slot => getMove(slot.id)).filter(move => move.exists),
				active: pokemon.isActive, substitute: !!pokemon.volatiles['substitute'],
			} as MonState)),
			unseen,
			conditions: new Map(Object.entries(side.sideConditions).map(([id, cond]) => [id, cond.layers || 1])),
		};
	};
	const theirSide = ourSide === 'p1' ? 'p2' : 'p1';
	return { us: sideOf(ourSide, 0), them: sideOf(theirSide, theirUnseen), weather: battle.field.weather };
}

/** Joga um turno (e as trocas obrigatórias que vierem) e devolve a chance estimada, ou null se a escolha for inválida. */
function playTurn(
	snap: Snapshot, model: ValueModel, random: () => number, seed: string, ours: string, theirs: string,
	activeIndex?: number
): number | null {
	const battle = buildBattle(snap, random, seed, activeIndex);
	if (!battle) return null;
	const theirSide = snap.ourSide === 'p1' ? 'p2' : 'p1';
	try {
		if (!battle.choose(snap.ourSide, ours)) return null;
		if (!battle.choose(theirSide, theirs)) {
			battle.undoChoice(snap.ourSide);
			return null;
		}
		// Trocas no meio ou no fim do turno (nocautes, U-turn): escolha padrão do simulador
		for (let guard = 0; guard < 4 && !battle.ended && battle.requestState === 'switch'; guard++) battle.makeChoices();
	} catch {
		return null;
	}
	if (battle.ended) return battle.winner === battle.getSide(snap.ourSide).name ? 1 : 0;
	return winProbability(model, positionFeatures(positionOf(battle, snap.ourSide, snap.theirUnseen)));
}

/** Respostas do adversário no palpite: os golpes do ativo e as primeiras trocas do banco visto. */
function theirChoices(snap: Snapshot) {
	const choices = ['move 1', 'move 2', 'move 3', 'move 4'];
	let switches = 0;
	snap.theirs.forEach((mon, i) => {
		if (i > 0 && !mon.fainted && switches < THEIR_SWITCHES) {
			choices.push(`switch ${i + 1}`);
			switches++;
		}
	});
	return choices;
}

/**
 * Valor de cada escolha nossa (no formato do protocolo), pela média dos palpites; null
 * se não deu para montar nenhuma batalha. `activeIndex`: troca obrigatória (avalia a
 * entrada desse Pokémon com a melhor jogada seguinte).
 */
function searchValues(
	snap: Snapshot, model: ValueModel, options: SimSearchOptions, ourChoices: string[], activeIndex?: number
): Map<string, number> | null {
	const started = Date.now();
	const totals = new Map<string, { sum: number, count: number }>();
	const responses = theirChoices(snap);
	for (let sample = 0; sample < options.samples; sample++) {
		if (sample > 0 && Date.now() - started > options.budgetMs) break;
		simSearchStats.samples++;
		const seedNumber = options.seed !== undefined ? (options.seed + sample * 7919) >>> 0 :
			Math.floor(Math.random() * 4294967296);
		const seed = `sodium,${seedNumber.toString(16).padStart(8, '0')}${'0'.repeat(24)}`;
		for (const ours of ourChoices) {
			let worst = Infinity;
			let sum = 0;
			let count = 0;
			for (const theirs of responses) {
				// O mesmo palpite (mesma sequência de sorteios) para todas as combinações deste turno
				const value = playTurn(snap, model, makeRandom(seedNumber), seed, ours, theirs, activeIndex);
				if (value === null) continue;
				worst = Math.min(worst, value);
				sum += value;
				count++;
			}
			if (!count) continue;
			const value = options.pessimism * worst + (1 - options.pessimism) * sum / count;
			const total = totals.get(ours) || { sum: 0, count: 0 };
			total.sum += value;
			total.count++;
			totals.set(ours, total);
		}
	}
	if (!totals.size) return null;
	return new Map([...totals].map(([choice, { sum, count }]) => [choice, sum / count]));
}

function bestOf(values: Map<string, number>) {
	let best = '';
	let bestValue = -Infinity;
	for (const [choice, value] of values) {
		if (value > bestValue) {
			best = choice;
			bestValue = value;
		}
	}
	return { best, bestValue };
}

/**
 * Escolha num pedido de jogada (individual): a das regras (`ruleChoice`), a não ser que
 * a busca estime uma jogada melhor por mais que `options.margin`.
 */
export function simSearchMove(
	request: MoveRequest, state: BattleState, model: ValueModel, options: SimSearchOptions, ruleChoice: string | null
): string | null {
	const started = Date.now();
	const values = moveValues(request, state, model, options);
	simSearchStats.searches++;
	simSearchStats.totalMs += Date.now() - started;
	if (!values) {
		simSearchStats.failed++;
		return ruleChoice;
	}
	const { best, bestValue } = bestOf(values);
	const ruleValue = ruleChoice ? values.get(ruleChoice) : undefined;
	if (ruleChoice && (ruleValue === undefined || bestValue - ruleValue <= options.margin)) return ruleChoice;
	simSearchStats.changed++;
	return best;
}

/** Valor estimado de cada jogada possível num pedido de jogada (individual), ou null. */
export function moveValues(
	request: MoveRequest, state: BattleState, model: ValueModel, options: SimSearchOptions
): Map<string, number> | null {
	const snap = snapshot(request, state);
	if (!snap) return null;
	const active = request.active[0];
	const mega = active.canMegaEvo ? ' mega' : '';
	const choices: string[] = [];
	active.moves.forEach((slot, index) => {
		if (!slot.disabled && (slot.pp === undefined || slot.pp > 0)) choices.push(`move ${index + 1}${mega}`);
	});
	if (!active.trapped && !active.maybeTrapped) {
		request.side.pokemon.forEach((mon, index) => {
			if (!mon.active && !mon.condition.endsWith(' fnt')) choices.push(`switch ${index + 1}`);
		});
	}
	return searchValues(snap, model, options, choices);
}

/** Troca obrigatória (individual): o Pokémon cuja entrada deixa a melhor posição. */
export function simSearchForcedSwitch(
	request: { side: MoveRequest['side'] }, state: BattleState, model: ValueModel, options: SimSearchOptions
): string | null {
	const snap = snapshot(request, state);
	if (!snap) return null;
	let best: { slot: number, value: number } | null = null;
	const perCandidate = { ...options, budgetMs: options.budgetMs / Math.max(1, request.side.pokemon.length - 1) };
	request.side.pokemon.forEach((mon, index) => {
		if (mon.active || mon.condition.endsWith(' fnt')) return;
		const moves = mon.moves.map((_, i) => `move ${i + 1}`);
		const values = searchValues(snap, model, perCandidate, moves, index);
		if (!values) return;
		const { bestValue } = bestOf(values);
		if (!best || bestValue > best.value) best = { slot: index + 1, value: bestValue };
	});
	return best ? `switch ${(best as { slot: number }).slot}` : null;
}

export const DEFAULT_SIM_SEARCH: SimSearchOptions = { pessimism: 0.5, margin: 0.05, budgetMs: 1000, samples: 8 };
