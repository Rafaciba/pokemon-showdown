/**
 * pokemon-showdown-custom: IAs heurísticas dos treinadores NPC (níveis Fácil, Médio
 * e Difícil). O nível Aleatório é o bot padrão do PS (ai.ts).
 *
 * Regras de cada nível (definidas pelo usuário em 2026-10-18):
 *   - Fácil: foca só em dar dano (poder do golpe e bônus de mesmo tipo, sem olhar
 *     a efetividade de tipo) e troca quando achar adequado (sem golpe de dano útil,
 *     ou com pouco HP e um Pokémon mais saudável no banco).
 *   - Médio: estima o dano com a efetividade de tipo (prefere nocautear), troca
 *     quando o adversário tem vantagem de tipo e existe um confronto melhor, e usa
 *     golpes defensivos (Protect e similares, cura, telas).
 *   - Difícil: o Médio, mais golpes de status (respeitando imunidades e a Sleep
 *     Clause) e hazards; trocas avaliam se valem a pena (HP de quem entra, dano dos
 *     hazards do próprio lado, golpes já revelados pelo adversário). Usa buffs e
 *     debuffs quando valem a pena (pedido do usuário em 2026-10-18) e responde aos
 *     buffs do adversário com Haze, Clear Smog ou golpes que forçam a troca.
 *
 * A IA vê só o que um espectador vê (battle-view.ts) mais o próprio time (pedido do
 * simulador).
 *
 * Batalhas em dupla (treinadores em dupla, 2026-10-19): as mesmas regras de cada nível,
 * para cada um dos dois Pokémon ativos. Golpes de um alvo vão no adversário com a melhor
 * pontuação (de preferência o que dá para nocautear); golpes em área somam o dano nos
 * dois adversários (com a redução de 25% das batalhas em dupla) e descontam o dano no
 * próprio aliado (Earthquake, Surf); a Megaevolução é de um por turno; as trocas nunca
 * escolhem o mesmo Pokémon do banco para as duas posições; a prévia de times põe os dois
 * melhores confrontos na frente. O caminho das batalhas individuais não mudou.
 *
 * @license MIT
 */
import type { ChoiceRequest, MoveRequest, PokemonSwitchRequestData } from '../../../sim/side';
import type { Move } from '../../../sim/dex-moves';
import { toID } from '../../../sim/dex-data';
import { readBattleState, remainingCount, type BattleState, type SeenPokemon } from './battle-view';
import type { BattleView, NpcAI } from './ai';

export type HeuristicLevel = 'easy' | 'medium' | 'hard';

export interface LevelRules {
	/** Considera efetividade e imunidade de tipo no dano. */
	typeAware: boolean;
	/** Protect e similares, cura e telas. */
	defensiveMoves: boolean;
	/** Golpes que causam status (veneno, paralisia, queimadura, sono). */
	statusMoves: boolean;
	/** Hazards (Stealth Rock, Spikes, Toxic Spikes, Sticky Web). */
	hazards: boolean;
	/** Troca por vantagem de tipo. */
	typeSwitching: boolean;
	/** Trocas avaliam HP de quem entra, hazards e golpes revelados. */
	carefulSwitching: boolean;
	/** Considera velocidade e risco de nocaute neste turno. */
	speedAware: boolean;
	/** Buffs (Swords Dance...), debuffs (Screech...) e resposta aos buffs do adversário. */
	statBoosts: boolean;
	/** Escolhe o Pokémon inicial pelo confronto com o time do adversário. */
	chooseLead: boolean;
}

const RULES: { [level in HeuristicLevel]: LevelRules } = {
	easy: {
		typeAware: false, defensiveMoves: false, statusMoves: false, hazards: false,
		typeSwitching: false, carefulSwitching: false, speedAware: false, statBoosts: false, chooseLead: false,
	},
	medium: {
		typeAware: true, defensiveMoves: true, statusMoves: false, hazards: false,
		typeSwitching: true, carefulSwitching: false, speedAware: false, statBoosts: false, chooseLead: true,
	},
	hard: {
		typeAware: true, defensiveMoves: true, statusMoves: true, hazards: true,
		typeSwitching: true, carefulSwitching: true, speedAware: true, statBoosts: true, chooseLead: true,
	},
};

/** Hazards: id → camadas máximas. */
const HAZARDS: { [id: string]: number } = { stealthrock: 1, spikes: 3, toxicspikes: 2, stickyweb: 1 };
/** Valor de colocar cada hazard (contra um adversário com 3 ou mais Pokémon). */
const HAZARD_VALUES: { [id: string]: number } = { stealthrock: 70, stickyweb: 60, spikes: 55, toxicspikes: 45 };
const SCREENS = new Set(['reflect', 'lightscreen', 'auroraveil']);
/** Habilidades que anulam um tipo de golpe (para estimar o risco de imunidade). */
const IMMUNITY_ABILITIES: { [ability: string]: string } = {
	levitate: 'Ground', eartheater: 'Ground', flashfire: 'Fire', wellbakedbody: 'Fire', waterabsorb: 'Water',
	stormdrain: 'Water', dryskin: 'Water', voltabsorb: 'Electric', lightningrod: 'Electric', motordrive: 'Electric',
	sapsipper: 'Grass',
};
/** Status → tipos imunes a ele. */
const STATUS_IMMUNE_TYPES: { [status: string]: string[] } = {
	brn: ['Fire'], par: ['Electric'], psn: ['Poison', 'Steel'], tox: ['Poison', 'Steel'], frz: ['Ice'], slp: [],
};

type Stats = { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };

/** Um lado do confronto, com o que se sabe dele. */
interface Fighter {
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
function estimateStat(base: number, level: number, isHP: boolean) {
	const core = Math.floor((2 * base + 31 + 21) * level / 100);
	return isHP ? core + level + 10 : core + 5;
}

function speciesStats(species: string, level: number): Stats {
	const base = Dex.species.get(species).baseStats;
	return {
		hp: estimateStat(base.hp, level, true), atk: estimateStat(base.atk, level, false),
		def: estimateStat(base.def, level, false), spa: estimateStat(base.spa, level, false),
		spd: estimateStat(base.spd, level, false), spe: estimateStat(base.spe, level, false),
	};
}

function boostFactor(stage = 0) {
	return stage >= 0 ? (2 + stage) / 2 : 2 / (2 - stage);
}

/** Velocidade efetiva (boosts e paralisia). */
function speedOf(fighter: Fighter) {
	return fighter.stats.spe * boostFactor(fighter.boosts.spe) * (fighter.status === 'par' ? 0.5 : 1);
}

/** Soma dos buffs ofensivos (ataque, ataque especial, velocidade). */
function offensiveBoosts(fighter: Fighter) {
	return ['atk', 'spa', 'spe'].reduce((sum, stat) => sum + Math.max(0, fighter.boosts[stat] || 0), 0);
}

/** Golpes que atingem os dois adversários (e, com allAdjacent, também o aliado). */
const SPREAD_TARGETS = new Set(['allAdjacentFoes', 'allAdjacent']);
/** Golpes de um alvo que, em dupla, precisam do número do alvo na escolha. */
const SINGLE_TARGETS = new Set(['normal', 'any', 'adjacentFoe']);
/** Golpes em área causam 75% do dano em dupla. */
const SPREAD_FACTOR = 0.75;

/** Revival Blessing: o primeiro Pokémon desmaiado do banco (slot da escolha), ou null. */
function revivalSlot(team: PokemonSwitchRequestData[], exclude: ReadonlySet<number> = new Set()): number | null {
	const index = team.findIndex((mon, i) => !mon.active && !exclude.has(i + 1) && mon.condition.endsWith(' fnt'));
	return index < 0 ? null : index + 1;
}

/** Adversário ativo numa posição, com o número de alvo dele na escolha ("move 1 2"). */
interface Foe {
	seen: SeenPokemon;
	fighter: Fighter;
	target: number;
}

/** Perigo imediato (só o Difícil avalia): o adversário nocauteia neste turno, e antes de nós? */
interface Danger {
	koThisTurn: boolean;
	outsped: boolean;
}

function getMove(id: string): Move {
	let move = Dex.moves.get(id);
	// Return/Frustration chegam com o poder no id (ex.: return102)
	if (!move.exists) move = Dex.moves.get(id.replace(/\d+$/, ''));
	return move;
}

/** Multiplicador de tipo; 1 quando o nível não considera tipos. */
function typeFactor(moveType: string, defender: Fighter, typeAware: boolean) {
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
function effectivePower(move: Move, careful: boolean) {
	if (move.category === 'Status') return 0;
	let power = move.basePower || 60; // golpes de poder variável (Low Kick, Gyro Ball...)
	if (move.multihit) power *= Array.isArray(move.multihit) ? 3 : move.multihit;
	if (move.flags.charge) power *= 0.5;
	if (move.flags.recharge) power *= 0.6;
	if (careful && move.selfdestruct) power *= 0.3;
	return power;
}

/** Dano estimado de `move` em porcentagem do HP máximo do defensor. */
function estimateDamage(attacker: Fighter, move: Move, defender: Fighter, rules: LevelRules): number {
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
function stabMoves(fighter: Fighter): Move[] {
	const physical = fighter.stats.atk >= fighter.stats.spa;
	return fighter.types.map(type => ({
		...Dex.moves.get(physical ? 'tackle' : 'swift'), type, basePower: 80, accuracy: true, flags: {}, multihit: undefined,
	} as unknown as Move));
}

export class HeuristicAI implements NpcAI {
	readonly level: HeuristicLevel;
	private readonly rules: LevelRules;
	private readonly random: () => number;
	private lastRequest = '';
	private lastAction: 'move' | 'switch' | '' = '';
	private lastMoveId = '';
	/** Em dupla, o último golpe de cada posição (Protect repetido falha). */
	private lastMoveIds: string[] = [];

	/** `overrides` liga ou desliga regras do nível (para calibrar no banco de testes). */
	constructor(level: HeuristicLevel, random: () => number = Math.random, overrides: Partial<LevelRules> = {}) {
		this.level = level;
		this.rules = { ...RULES[level], ...overrides };
		this.random = random;
	}

	choose(request: ChoiceRequest, view: BattleView): string | null {
		if (request.wait) return null;
		// O mesmo pedido de novo = a escolha anterior foi recusada: escolhe sem trocar
		const key = JSON.stringify(request);
		const retry = key === this.lastRequest;
		this.lastRequest = key;
		const state = readBattleState(view.log);
		const ourSide = request.side.id;
		const theirSide = ourSide === 'p1' ? 'p2' : 'p1';

		if (request.teamPreview) return this.chooseTeam(request.side.pokemon, state, theirSide, request.maxChosenTeamSize);
		if (request.forceSwitch) {
			if (request.forceSwitch.length > 1) {
				if (retry) return 'default';
				return this.doublesForceSwitch(request.forceSwitch, request.side.pokemon, state, ourSide, theirSide);
			}
			// Revival Blessing: o simulador pede um Pokémon desmaiado para reviver
			const slot = request.side.pokemon.some(mon => mon.reviving) ? revivalSlot(request.side.pokemon) :
				this.bestSwitch(request.side.pokemon, state, ourSide, theirSide, null);
			this.lastAction = 'switch';
			return slot ? `switch ${slot}` : 'default';
		}
		// Em dupla, uma escolha recusada não se repete: o simulador escolhe
		if (request.active.length > 1) return retry ? 'default' : this.chooseDoubles(request, state, ourSide, theirSide);
		return this.chooseMove(request, state, ourSide, theirSide, retry);
	}

	// --- Quem somos e quem enfrentamos --------------------------------------

	private ourFighter(mon: PokemonSwitchRequestData, state: BattleState, ourSide: string, active: boolean): Fighter {
		const [species, levelText] = mon.details.split(',').map(part => part.trim());
		const level = /^L\d+$/.test(levelText || '') ? Number(levelText.slice(1)) : 100;
		const data = Dex.species.get(species);
		const [hpText, status] = mon.condition.split(' ');
		const [current, max] = hpText.split('/').map(Number);
		const seen = active ? state.sides[ourSide]?.pokemon.get(mon.ident.slice(mon.ident.indexOf(':') + 1).trim()) : undefined;
		return {
			species, level, types: data.types,
			stats: { hp: max || 1, ...mon.stats },
			hp: status === 'fnt' || !max ? 0 : current / max * 100,
			status: status && status !== 'fnt' ? status : '',
			boosts: seen?.boosts || {},
			abilities: [mon.ability || mon.baseAbility],
			moves: mon.moves.map(getMove).filter(move => move.exists),
		};
	}

	private theirFighter(seen: SeenPokemon): Fighter {
		const data = Dex.species.get(seen.species);
		const fighter: Fighter = {
			species: seen.species, level: seen.level, types: data.types, stats: speciesStats(seen.species, seen.level),
			hp: seen.hp, status: seen.status, boosts: seen.boosts,
			abilities: Object.values(data.abilities).filter(Boolean),
			moves: [],
		};
		const revealed = this.rules.carefulSwitching ?
			[...seen.moves].map(getMove).filter(m => m.exists && m.category !== 'Status') : [];
		fighter.moves = revealed.length ? [...revealed, ...stabMoves(fighter)] : stabMoves(fighter);
		return fighter;
	}

	private opponent(state: BattleState, theirSide: string): SeenPokemon | null {
		const view = state.sides[theirSide];
		const active = view?.active ? view.pokemon.get(view.active) : undefined;
		return active && !active.fainted ? active : null;
	}

	/** Adversários ativos (em dupla, as duas posições), com o número de alvo de cada um. */
	private opponents(state: BattleState, theirSide: string): Foe[] {
		const view = state.sides[theirSide];
		if (!view) return [];
		const slots = view.activeSlots.length ? view.activeSlots : [view.active];
		const foes: Foe[] = [];
		slots.forEach((name, index) => {
			const seen = name ? view.pokemon.get(name) : undefined;
			if (seen && !seen.fainted) foes.push({ seen, fighter: this.theirFighter(seen), target: index + 1 });
		});
		return foes;
	}

	/** Maior dano estimado de um lado no outro. */
	private bestDamage(attacker: Fighter, defender: Fighter) {
		let best = 0;
		for (const move of attacker.moves) best = Math.max(best, estimateDamage(attacker, move, defender, this.rules));
		return best;
	}

	/** Dano dos hazards ao entrar (só no Difícil). */
	private hazardCost(fighter: Fighter, state: BattleState, ourSide: string) {
		if (!this.rules.carefulSwitching) return 0;
		const conditions = state.sides[ourSide]?.conditions;
		if (!conditions) return 0;
		let cost = 0;
		if (conditions.has('stealthrock')) cost += 12.5 * 2 ** Dex.getEffectiveness('Rock', fighter.types);
		const grounded = !fighter.types.includes('Flying') && toID(fighter.abilities[0]) !== 'levitate';
		const spikes = conditions.get('spikes') || 0;
		if (grounded && spikes) cost += [0, 12.5, 16.7, 25][Math.min(spikes, 3)];
		return cost;
	}

	/** Quão bom é o confronto: o que causamos menos o que sofremos (e, no Difícil, o custo de entrar). */
	private matchup(ours: Fighter, theirs: Fighter, state: BattleState, ourSide: string, entering: boolean) {
		const dealt = Math.min(this.bestDamage(ours, theirs), theirs.hp);
		const taken = this.bestDamage(theirs, ours);
		let score = dealt - taken;
		if (this.rules.speedAware) {
			// Quem age primeiro e nocauteia leva o confronto
			const faster = speedOf(ours) > speedOf(theirs);
			if (faster && dealt >= theirs.hp) score += 40;
			if (!faster && taken >= ours.hp) score -= 40;
		}
		if (entering && this.rules.carefulSwitching) {
			const left = ours.hp - this.hazardCost(ours, state, ourSide) - taken;
			if (left <= 0) score -= 100; // entraria para ser nocauteado
			score -= this.hazardCost(ours, state, ourSide);
		}
		return score;
	}

	// --- Prévia de times -----------------------------------------------------

	private chooseTeam(team: PokemonSwitchRequestData[], state: BattleState, theirSide: string, maxSize?: number) {
		const order = team.map((_, index) => index + 1);
		const preview = state.sides[theirSide]?.preview || [];
		if (this.rules.chooseLead && preview.length) {
			const theirs = preview.map(species => this.theirFighter({
				name: species, species, level: 100, hp: 100, status: '', fainted: false,
				moves: new Set(), boosts: {}, substitute: false,
			}));
			const scores = team.map((mon, index) => {
				const ours = this.ourFighter(mon, state, '', false);
				const score = theirs.reduce((sum, foe) => sum + this.matchup(ours, foe, state, '', false), 0) / theirs.length;
				return { slot: index + 1, score };
			});
			// Em dupla começam dois: os melhores confrontos vão na frente
			const leads = state.gameType === 'doubles' ? 2 : 1;
			const best = [...scores].sort((a, b) => b.score - a.score).slice(0, leads).map(entry => entry.slot);
			for (const slot of [...best].reverse()) {
				order.splice(order.indexOf(slot), 1);
				order.unshift(slot);
			}
		}
		return `team ${order.slice(0, maxSize || order.length).join('')}`;
	}

	// --- Trocas ----------------------------------------------------------------

	/** Melhor Pokémon do banco para entrar (null se não houver). */
	private bestSwitch(
		team: PokemonSwitchRequestData[], state: BattleState, ourSide: string, theirSide: string, minScore: number | null,
		exclude: ReadonlySet<number> = new Set()
	): number | null {
		// Em dupla, o confronto é a média contra os dois adversários ativos
		const foes = this.opponents(state, theirSide);
		let best: number | null = null;
		let bestScore = -Infinity;
		team.forEach((mon, index) => {
			if (mon.active || exclude.has(index + 1) || mon.condition.endsWith(' fnt') || mon.condition.startsWith('0')) return;
			const ours = this.ourFighter(mon, state, ourSide, false);
			let score: number;
			if (!foes.length || !this.rules.typeSwitching) {
				score = ours.hp; // Fácil, ou sem adversário à vista: o mais saudável
			} else {
				score = foes.reduce((sum, foe) => sum + this.matchup(ours, foe.fighter, state, ourSide, true), 0) / foes.length;
			}
			if (score > bestScore) {
				bestScore = score;
				best = index + 1;
			}
		});
		if (minScore !== null && bestScore < minScore) return null;
		return best;
	}

	// --- Golpes ----------------------------------------------------------------

	private chooseMove(request: MoveRequest, state: BattleState, ourSide: string, theirSide: string, retry: boolean) {
		const active = request.active[0];
		const team = request.side.pokemon;
		const meIndex = team.findIndex(mon => mon.active);
		const me = this.ourFighter(team[meIndex], state, ourSide, true);
		const opponentSeen = this.opponent(state, theirSide);
		const opponent = opponentSeen ? this.theirFighter(opponentSeen) : null;
		const mega = active.canMegaEvo ? ' mega' : '';

		const options = active.moves
			.map((slot, index) => ({ slot, index, move: getMove(slot.id) }))
			.filter(({ slot, move }) => !slot.disabled && (slot.pp === undefined || slot.pp > 0) && move.exists);
		if (!options.length) return 'default';

		const danger: Danger = { koThisTurn: false, outsped: false };
		if (this.rules.speedAware && opponent) {
			danger.koThisTurn = this.bestDamage(opponent, me) >= me.hp;
			danger.outsped = speedOf(opponent) > speedOf(me);
		}
		const scored = options.map(option => ({
			...option, score: this.scoreMove(option.move, me, opponent, opponentSeen, state, ourSide, theirSide, danger),
		}));
		scored.sort((a, b) => b.score - a.score);
		const best = scored[0];

		const canSwitch = !retry && !active.trapped && !active.maybeTrapped && this.lastAction !== 'switch';
		if (canSwitch) {
			const slot = this.voluntarySwitch(team, me, opponent, best.score, state, ourSide, theirSide, danger);
			if (slot) {
				this.lastAction = 'switch';
				return `switch ${slot}`;
			}
		}
		this.lastAction = 'move';
		this.lastMoveId = best.move.id;
		return `move ${best.index + 1}${mega}`;
	}

	private scoreMove(
		move: Move, me: Fighter, opponent: Fighter | null, opponentSeen: SeenPokemon | null,
		state: BattleState, ourSide: string, theirSide: string, danger: Danger
	): number {
		if (move.category !== 'Status') {
			if (!opponent) return effectivePower(move, false) / 10;
			const damage = estimateDamage(me, move, opponent, this.rules);
			let score = Math.min(damage, opponent.hp);
			if (this.rules.typeAware && damage >= opponent.hp) score += 25 + (move.priority > 0 ? 10 : 0);
			// Difícil: se o adversário é mais rápido e nos nocauteia, só um golpe de prioridade chega antes
			if (danger.koThisTurn && danger.outsped && move.priority <= 0) score *= 0.5;
			// Difícil: adversário com buffs acumulados → golpes que forçam a troca ou zeram os buffs
			if (this.rules.statBoosts && offensiveBoosts(opponent) >= 2 && (move.forceSwitch || move.id === 'clearsmog')) {
				score += 30;
			}
			return score;
		}
		const statusScore = this.scoreStatusMove(move, me, opponent, opponentSeen, state, ourSide, theirSide);
		// Difícil: status, hazards e telas não valem a pena se vamos ser nocauteados neste turno
		return danger.koThisTurn ? statusScore * 0.3 : statusScore;
	}

	private scoreStatusMove(
		move: Move, me: Fighter, opponent: Fighter | null, opponentSeen: SeenPokemon | null,
		state: BattleState, ourSide: string, theirSide: string
	): number {
		const ours = state.sides[ourSide];
		let score = 0;
		if (this.rules.defensiveMoves) {
			if (move.heal || move.flags.heal || move.id === 'wish') {
				if (me.hp <= 45) score = Math.max(score, 55);
				else if (me.hp <= 65) score = Math.max(score, 25);
			}
			if (move.stallingMove && this.lastMoveId !== move.id && opponent &&
				(['psn', 'tox', 'brn'].includes(opponent.status) || me.hp <= 30)) {
				score = Math.max(score, 30);
			}
			if (move.sideCondition && SCREENS.has(toID(move.sideCondition)) && !ours?.conditions.has(toID(move.sideCondition)) &&
				me.hp >= 60 && (move.id !== 'auroraveil' || ['snow', 'snowscape', 'hail'].includes(state.weather))) {
				score = Math.max(score, 40);
			}
		}
		if (this.rules.statBoosts && opponentSeen && opponent) {
			if (move.boosts) score = Math.max(score, this.boostValue(move, me, opponent, opponentSeen));
			if ((move.id === 'haze' || move.forceSwitch) && offensiveBoosts(opponent) >= 2) score = Math.max(score, 65);
		}
		if ((this.rules.statusMoves || this.rules.hazards) && opponentSeen && opponent) {
			const theirs = state.sides[theirSide];
			const hazard = move.sideCondition ? toID(move.sideCondition) : '';
			if (this.rules.hazards && hazard && HAZARDS[hazard] && me.hp >= 40) {
				const layers = theirs?.conditions.get(hazard) || 0;
				const remaining = remainingCount(theirs);
				if (layers < HAZARDS[hazard] && remaining >= 2) {
					const value = HAZARD_VALUES[hazard] || 0;
					score = Math.max(score, remaining >= 3 ? value : value / 2);
				}
			}
			if (this.rules.statusMoves && move.status && !opponent.status && !opponentSeen.substitute && opponent.hp >= 40) {
				score = Math.max(score, this.statusValue(move, opponent, theirs));
			}
		}
		return score;
	}

	/** Categoria do nosso melhor golpe de dano contra o adversário. */
	private mainCategory(attacker: Fighter, defender: Fighter): 'Physical' | 'Special' | null {
		let best = 0;
		let category: 'Physical' | 'Special' | null = null;
		for (const move of attacker.moves) {
			if (move.category === 'Status') continue;
			const damage = estimateDamage(attacker, move, defender, this.rules);
			if (damage > best) {
				best = damage;
				category = move.category;
			}
		}
		return category;
	}

	/**
	 * Valor de um buff próprio ou de um debuff no adversário. Buff só com HP alto e o
	 * adversário causando pouco dano por turno; só conta o atributo que ajuda (o do
	 * nosso golpe principal, velocidade se formos mais lentos, defesa contra o tipo de
	 * golpe do adversário) e vale menos (até parar) com o atributo já alto.
	 */
	private boostValue(move: Move, me: Fighter, opponent: Fighter, opponentSeen: SeenPokemon) {
		// Dá para nocautear agora: atacar vale mais que qualquer buff ou debuff
		if (this.bestDamage(me, opponent) >= opponent.hp) return 0;
		const boosts = move.boosts!;
		const ours = this.mainCategory(me, opponent);
		const theirs = this.mainCategory(opponent, me);
		const slower = speedOf(opponent) >= speedOf(me);
		let value = 0;
		if (move.target === 'self') {
			if (me.hp < 60 || this.bestDamage(opponent, me) >= 40) return 0;
			for (const [stat, amount] of Object.entries(boosts)) {
				if (amount < 0) {
					value += 5 * amount; // ex.: as defesas que o Shell Smash reduz
					continue;
				}
				const stage = me.boosts[stat] || 0;
				if (stage >= 4) continue;
				const factor = stage >= 2 ? 0.5 : 1;
				const offense = (stat === 'atk' && ours === 'Physical') || (stat === 'spa' && ours === 'Special');
				const defense = (stat === 'def' && theirs === 'Physical') || (stat === 'spd' && theirs === 'Special');
				if (offense) value += 25 * amount * factor;
				else if (stat === 'spe' && slower) value += 15 * amount * factor;
				else if (defense) value += 12 * amount * factor;
			}
			return Math.max(0, Math.min(value, 70));
		}
		// Debuff no adversário
		if (me.hp < 50 || opponentSeen.substitute) return 0;
		for (const [stat, amount] of Object.entries(boosts)) {
			if (amount >= 0 || (opponent.boosts[stat] || 0) <= -2) continue;
			const drop = -amount;
			if ((stat === 'atk' && theirs === 'Physical') || (stat === 'spa' && theirs === 'Special')) value += 15 * drop;
			else if ((stat === 'def' && ours === 'Physical') || (stat === 'spd' && ours === 'Special')) value += 12 * drop;
			else if (stat === 'spe' && slower) value += 12 * drop;
		}
		return Math.min(value, 45);
	}

	/** Valor de um golpe de status no adversário (0 se ele for imune ou não valer a pena). */
	private statusValue(move: Move, opponent: Fighter, theirs: BattleState['sides'][string]) {
		const status = move.status!;
		if (STATUS_IMMUNE_TYPES[status]?.some(type => opponent.types.includes(type))) return 0;
		if (!Dex.getImmunity(move.type, opponent.types)) return 0; // ex.: Thunder Wave em tipo Terra
		if (move.flags.powder && opponent.types.includes('Grass')) return 0;
		if (status === 'slp') {
			// Sleep Clause: só um Pokémon do adversário dormindo por vez
			if ([...theirs.pokemon.values()].some(mon => mon.status === 'slp' && !mon.fainted)) return 0;
			return 65;
		}
		if (status === 'tox') return 60;
		if (status === 'par') return 55;
		if (status === 'brn') return opponent.stats.atk > opponent.stats.spa ? 60 : 35;
		return 45;
	}

	/** Troca voluntária, conforme o nível; devolve o slot ou null. */
	private voluntarySwitch(
		team: PokemonSwitchRequestData[], me: Fighter, opponent: Fighter | null, bestScore: number,
		state: BattleState, ourSide: string, theirSide: string, danger: Danger, exclude: ReadonlySet<number> = new Set()
	): number | null {
		if (!this.rules.typeSwitching) {
			// Fácil: sem golpe de dano útil, ou com pouco HP (às vezes) e alguém saudável no banco
			const noDamage = bestScore <= 0;
			const weak = me.hp <= 25 && this.random() < 0.5;
			if (!noDamage && !weak) return null;
			const slot = this.bestSwitch(team, state, ourSide, theirSide, null, exclude);
			const candidate = slot ? team[slot - 1] : null;
			if (!candidate) return null;
			const [current, max] = candidate.condition.split(' ')[0].split('/').map(Number);
			return max && current / max >= 0.5 ? slot : null;
		}
		if (!opponent) return null;
		// Médio: só quando o adversário tem vantagem de tipo e não dá para nocauteá-lo agora
		const disadvantaged = opponent.types.some(type => typeFactor(type, me, true) >= 2);
		// Difícil: também troca diante de um adversário com boosts, ou mais rápido e que nos nocauteia
		const boosted = this.rules.carefulSwitching && Math.max(opponent.boosts.atk || 0, opponent.boosts.spa || 0) >= 2;
		const threatened = boosted || (this.rules.speedAware && danger.koThisTurn && danger.outsped);
		if (!disadvantaged && !threatened) return null;
		// Difícil: com buffs acumulados, trocar perde os aumentos; só sai se for nocauteado antes de agir
		if (this.rules.statBoosts && offensiveBoosts(me) >= 2 && !(danger.koThisTurn && danger.outsped)) return null;
		if (bestScore >= opponent.hp + 25) return null; // dá para nocautear: fica
		const current = this.matchup(me, opponent, state, ourSide, false);
		const margin = this.rules.carefulSwitching ? 15 : 20;
		const slot = this.bestSwitch(team, state, ourSide, theirSide, current + margin, exclude);
		if (!slot) return null;
		if (!this.rules.carefulSwitching) {
			// Médio: quem entra precisa resistir ou ser neutro aos tipos do adversário e ter HP razoável
			const candidate = this.ourFighter(team[slot - 1], state, ourSide, false);
			if (candidate.hp < 40 || opponent.types.some(type => typeFactor(type, candidate, true) >= 2)) return null;
		}
		return slot;
	}

	// --- Batalhas em dupla -------------------------------------------------------

	/** Trocas obrigatórias em dupla: cada posição recebe um Pokémon diferente do banco. */
	private doublesForceSwitch(
		forced: boolean[], team: PokemonSwitchRequestData[], state: BattleState, ourSide: string, theirSide: string
	) {
		const taken = new Set<number>();
		const choices = forced.map((mustSwitch, index) => {
			if (!mustSwitch) return 'pass';
			const slot = team[index]?.reviving ? revivalSlot(team, taken) :
				this.bestSwitch(team, state, ourSide, theirSide, null, taken);
			if (!slot) return 'pass';
			taken.add(slot);
			return `switch ${slot}`;
		});
		this.lastAction = 'switch';
		return choices.join(', ');
	}

	/** Uma escolha para cada Pokémon ativo, separadas por vírgula ("move 1 2, switch 3"). */
	private chooseDoubles(request: MoveRequest, state: BattleState, ourSide: string, theirSide: string) {
		const team = request.side.pokemon;
		const foes = this.opponents(state, theirSide);
		const switching = new Set<number>();
		const canSwitchNow = this.lastAction !== 'switch';
		let megaUsed = false;
		const choices = request.active.map((active, index) => {
			const mon = team[index];
			if (!mon || mon.condition.endsWith(' fnt') || mon.condition.startsWith('0')) return 'pass';
			const me = this.ourFighter(mon, state, ourSide, true);
			const allyMon = team[1 - index];
			const ally = allyMon?.active && !allyMon.condition.endsWith(' fnt') ?
				this.ourFighter(allyMon, state, ourSide, true) : null;
			const options = active.moves
				.map((slot, moveIndex) => ({ slot, moveIndex, move: getMove(slot.id) }))
				.filter(({ slot, move }) => !slot.disabled && (slot.pp === undefined || slot.pp > 0) && move.exists);
			if (!options.length) return 'move 1';

			// O adversário que mais ameaça este Pokémon guia o perigo e as trocas
			let threat: Foe | null = null;
			let threatDamage = -1;
			for (const foe of foes) {
				const damage = this.bestDamage(foe.fighter, me);
				if (damage > threatDamage) {
					threatDamage = damage;
					threat = foe;
				}
			}
			const danger: Danger = { koThisTurn: false, outsped: false };
			if (this.rules.speedAware && threat) {
				danger.koThisTurn = threatDamage >= me.hp;
				danger.outsped = speedOf(threat.fighter) > speedOf(me);
			}

			this.lastMoveId = this.lastMoveIds[index] || '';
			const scored = options.map(option => ({
				...option, ...this.scoreDoublesMove(option.move, index, me, ally, foes, state, ourSide, theirSide, danger),
			}));
			scored.sort((a, b) => b.score - a.score);
			const best = scored[0];

			if (canSwitchNow && !active.trapped && !active.maybeTrapped) {
				const slot = this.voluntarySwitch(
					team, me, threat?.fighter || null, best.score, state, ourSide, theirSide, danger, switching
				);
				if (slot) {
					switching.add(slot);
					return `switch ${slot}`;
				}
			}
			this.lastMoveIds[index] = best.move.id;
			const mega = active.canMegaEvo && !megaUsed ? ' mega' : '';
			if (mega) megaUsed = true;
			// Golpe preso (segundo turno de Electro Shot, Outrage...) chega sem "target" e não aceita alvo
			// Sem adversário à vista, um golpe de um alvo vai no da primeira posição
			const needsTarget = !!best.slot.target && SINGLE_TARGETS.has(best.slot.target);
			const target = best.slot.target ? (best.target || (needsTarget ? 1 : 0)) : 0;
			const targetText = target ? ` ${target}` : '';
			return `move ${best.moveIndex + 1}${targetText}${mega}`;
		});
		this.lastAction = switching.size ? 'switch' : 'move';
		return choices.join(', ');
	}

	/** Pontuação de um golpe em dupla e o alvo (0 = o golpe não precisa de alvo). */
	private scoreDoublesMove(
		move: Move, index: number, me: Fighter, ally: Fighter | null, foes: Foe[],
		state: BattleState, ourSide: string, theirSide: string, danger: Danger
	): { score: number, target: number } {
		const allyTarget = -(2 - index); // posição 1 → aliado em -2; posição 2 → aliado em -1
		if (move.category !== 'Status') {
			if (!foes.length) return { score: effectivePower(move, false) / 10, target: 0 };
			if (SPREAD_TARGETS.has(move.target)) {
				let score = 0;
				for (const foe of foes) {
					const damage = estimateDamage(me, move, foe.fighter, this.rules) * SPREAD_FACTOR;
					score += Math.min(damage, foe.fighter.hp);
					if (this.rules.typeAware && damage >= foe.fighter.hp) score += 25;
				}
				// Earthquake, Surf e afins atingem o aliado também
				if (move.target === 'allAdjacent' && ally) {
					const hit = estimateDamage(me, move, ally, this.rules) * SPREAD_FACTOR;
					score -= this.rules.typeAware ? Math.min(hit, ally.hp) * 1.5 + (hit >= ally.hp ? 60 : 0) : Math.min(hit, ally.hp);
				}
				if (danger.koThisTurn && danger.outsped && move.priority <= 0) score *= 0.5;
				return { score, target: 0 };
			}
			let best = { score: -Infinity, target: foes[0].target };
			for (const foe of foes) {
				const score = this.scoreMove(move, me, foe.fighter, foe.seen, state, ourSide, theirSide, danger);
				if (score > best.score) best = { score, target: foe.target };
			}
			return { score: best.score, target: SINGLE_TARGETS.has(move.target) ? best.target : 0 };
		}
		// Golpes no aliado (Helping Hand e afins): pouco valor, só com aliado em campo
		// Sem aliado o golpe falha, mas o simulador ainda exige o alvo
		if (move.target === 'adjacentAlly') return { score: ally ? 8 : -5, target: allyTarget };
		if (move.target === 'adjacentAllyOrSelf') return { score: 5, target: -(index + 1) };
		const factor = danger.koThisTurn ? 0.3 : 1;
		if (SINGLE_TARGETS.has(move.target) && foes.length) {
			let best = { score: -Infinity, target: foes[0].target };
			for (const foe of foes) {
				const score = this.scoreStatusMove(move, me, foe.fighter, foe.seen, state, ourSide, theirSide) * factor;
				if (score > best.score) best = { score, target: foe.target };
			}
			return best;
		}
		const primary = foes[0] || null;
		const score = this.scoreStatusMove(
			move, me, primary?.fighter || null, primary?.seen || null, state, ourSide, theirSide
		);
		return { score: score * factor, target: 0 };
	}
}
