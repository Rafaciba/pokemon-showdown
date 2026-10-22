/**
 * pokemon-showdown-custom: definição de uma expedição criada pelo admin (etapa 6).
 *
 * Decisões do usuário (2026-10-22), descritas em docs/arquitetura-expedicao.md, seção
 * "Expedições criadas pelo admin":
 *   - modo Padrão (desmaiados ficam e podem ser revividos) ou Nuzlocke;
 *   - mecânica (formato base e regras, como no Desafio) separada do tema (a Pokédex de
 *     selvagens, treinadores e iniciais: gerações ou uma lista);
 *   - 3 times iniciais de 1 a 3 Pokémon, fixos ou sorteados de um pool; todo time tem
 *     um inicial regional das gerações do tema, sem repetir entre os times;
 *   - atos: Completo (3 atos e o ato especial) ou Personalizado (de 1 a 4 atos);
 *   - 15 andares por ato (o 14º é PokéCenter e o 15º, o chefe), com um andar de item no
 *     meio do ato;
 *   - nível inicial e teto do chefe final (os níveis por ato saem dos dois), dinheiro
 *     inicial, desgaste, chances dos nós, chance do lendário, chance de shiny;
 *   - IA por ato (selvagens, treinadores e chefes);
 *   - captura (escolha, Poké Bola garantida ou com chance) e Computador;
 *   - chefes gerados, sorteados de uma seleção do banco do Desafio ou escolhidos;
 *   - insígnias do modo Completo: 8 de tipos diferentes, escolhidas ou sorteadas,
 *     travadas depois da primeira run.
 *
 * O modo Completo (insígnias, agravantes, ato especial) é aplicado na run por runs.ts,
 * difficulty.ts e encounters.ts (etapa 9).
 *
 * Funções puras (sem banco nem estado do servidor), que rodam também no processo do
 * simulador. Os problemas são mensagens em inglês marcadas com TLkey, com {0}, {1}...
 * nos valores, como no Desafio (rules.ts).
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { TLkey } from '../../../sim/dex-text';
import type { PRNG } from '../../../sim/prng';
import { AI_LEVELS, isAILevel, type AILevel } from '../gym-challenge/levels';
import { hasForbiddenChars, type Problem } from '../gym-challenge/rules';
import { BADGES } from '../gym-challenge/badge-catalog';
import { createMon, GAME_STARTERS, type RunMon } from './team';
import { baseStatTotal, inTheme, legendarySpecies, basicSpecies, maxBstForLevel, type Theme } from './species';
import {
	DEFAULT_FORMAT, type Attrition, type BossSlot, type ExpeditionStatus, type ExpeditionVariant, type FormatSpec,
} from './variant';

export type { BossSlot };

/** Tipos de nó com chance no mapa (o andar de item e o lendário ficam por fora). */
export const NODE_WEIGHT_KEYS = ['wild', 'event', 'trainer', 'elite', 'rest', 'shop', 'item'] as const;
export type NodeWeightKey = typeof NODE_WEIGHT_KEYS[number];

export interface ExpeditionDefinition {
	description: string;
	mode: 'standard' | 'nuzlocke';
	format: FormatSpec;
	theme: Theme;
	starters: {
		/** Pokémon por time (1 a 3). */
		size: number,
		mode: 'fixed' | 'random',
		/** Times fixos: 3 times de `size` espécies. */
		teams: string[][],
		/** Pool dos sorteados (vazio = os iniciais regionais do tema). */
		pool: string[],
	};
	acts: { mode: 'complete' | 'custom', count: number };
	startLevel: number;
	/** Nível do chefe final. */
	levelCap: number;
	startMoney: number;
	attrition: Attrition;
	weights: Record<NodeWeightKey, number>;
	/** Chance (%) de cada ato ter um nó de lendário. */
	legendaryChance: number;
	/** Selvagem shiny: 1 em `shinyOdds` (0 = nunca). */
	shinyOdds: number;
	/** Nível da IA por ato (índice 0 = ato 1). */
	ai: { wild: AILevel[], trainer: AILevel[], boss: AILevel[] };
	capture: 'choose' | 'ball' | 'chance';
	computer: boolean;
	bosses: {
		/** Chefe de cada ato (no modo Completo, o do ato 3 é o líder do tipo da insígnia). */
		acts: BossSlot[],
		/** Os dois treinadores da batalha em dupla do ato especial. */
		elite: BossSlot[],
		champion: BossSlot,
		/** Treinadores do banco que podem ser sorteados. */
		pool: number[],
	};
	badges: {
		mode: 'chosen' | 'random',
		/** As 8 insígnias (ids do catálogo do Desafio). */
		ids: string[],
		/** Líder de cada insígnia (chefe do ato 3 quando ela está em disputa). */
		leaders: BossSlot[],
	};
}

export const NAME_MAX_LENGTH = 40;
export const DESCRIPTION_MAX_LENGTH = 300;
export const RULES_MAX_LENGTH = 500;
export const SPECIES_LIST_MAX = 400;
export const COMPLETE_ACTS = 3;
export const MAX_ACTS = 4;
export const BADGE_COUNT = 8;
export const STARTER_TEAMS = 3;
/** Andares de cada ato sem o chefe (decisão do usuário: 15 andares, o último é o chefe). */
export const ACT_FLOORS = 14;
export const MAP_COLUMNS = 7;
export const MAP_PATHS = 6;
/** Andar de item no meio do ato (o "baú" do Slay the Spire), contando do 0. */
export const ITEM_FLOOR = 7;
export const MAX_START_MONEY = 100000;
export const MAX_SHINY_ODDS = 65536;
export const GENERATIONS = 9;

/** Valores padrão (decisões do usuário, 2026-10-22). */
export const DEFAULT_DEFINITION: ExpeditionDefinition = {
	description: '',
	mode: 'standard',
	format: { ...DEFAULT_FORMAT },
	theme: { gens: [], species: [] },
	starters: { size: 3, mode: 'random', teams: [[], [], []], pool: [] },
	acts: { mode: 'complete', count: COMPLETE_ACTS },
	startLevel: 5,
	levelCap: 95,
	startMoney: 500,
	attrition: 'persist',
	weights: { wild: 40, event: 20, trainer: 15, elite: 5, rest: 10, shop: 5, item: 5 },
	legendaryChance: 10,
	shinyOdds: 4096,
	ai: {
		wild: ['random', 'easy', 'easy', 'medium'],
		trainer: ['easy', 'medium', 'hard', 'hard'],
		boss: ['medium', 'hard', 'hard', 'hard'],
	},
	capture: 'choose',
	computer: false,
	bosses: { acts: ['generated', 'generated', 'generated', 'generated'], elite: ['generated', 'generated'],
		champion: 'generated', pool: [] },
	badges: { mode: 'random', ids: [], leaders: Array(BADGE_COUNT).fill('generated') },
};

// --- Leitura segura ------------------------------------------------------------------
// A definição vem do banco, do formulário ou de um pacote importado (JSON colado pelo
// admin): cada campo é conferido e cai no padrão se vier errado.

function integer(value: unknown, fallback: number, min: number, max: number) {
	const number = typeof value === 'number' ? value : Number(value);
	return Number.isInteger(number) ? Math.min(max, Math.max(min, number)) : fallback;
}

function oneOf<T extends string>(value: unknown, options: readonly T[], fallback: T): T {
	return options.includes(value as T) ? value as T : fallback;
}

function text(value: unknown, max: number) {
	return typeof value === 'string' ? value.slice(0, max) : '';
}

function speciesList(value: unknown, max = SPECIES_LIST_MAX): string[] {
	if (!Array.isArray(value)) return [];
	return value.filter((entry): entry is string => typeof entry === 'string').map(entry => entry.trim().slice(0, 40))
		.filter(Boolean).slice(0, max);
}

function slot(value: unknown): BossSlot {
	if (value === 'pool' || value === 'generated') return value;
	return Number.isInteger(value) && (value as number) > 0 ? value as number : 'generated';
}

function aiList(value: unknown, fallback: AILevel[]): AILevel[] {
	const list = Array.isArray(value) ? value : [];
	return fallback.map((level, i) => (isAILevel(list[i]) ? list[i] : level));
}

/** Definição completa e com tipos certos, a partir de qualquer valor (campos errados viram o padrão). */
export function normalizeDefinition(raw: unknown): ExpeditionDefinition {
	const input = (raw && typeof raw === 'object' ? raw : {}) as AnyObject;
	const d = DEFAULT_DEFINITION;
	const starters = input.starters || {};
	const acts = input.acts || {};
	const weights = input.weights || {};
	const ai = input.ai || {};
	const bosses = input.bosses || {};
	const badges = input.badges || {};
	const format = input.format || {};
	const theme = input.theme || {};
	const teams = Array.isArray(starters.teams) ? starters.teams : [];
	return {
		description: text(input.description, DESCRIPTION_MAX_LENGTH),
		mode: oneOf(input.mode, ['standard', 'nuzlocke'], d.mode),
		format: {
			base: typeof format.base === 'string' ? toID(format.base) : d.format.base,
			rules: typeof format.rules === 'string' ? format.rules.slice(0, RULES_MAX_LENGTH) : d.format.rules,
		},
		theme: {
			gens: Array.isArray(theme.gens) ?
				[...new Set(theme.gens.filter((gen: any) => Number.isInteger(gen) && gen >= 1 && gen <= GENERATIONS))]
					.sort() as number[] : [],
			species: speciesList(theme.species),
		},
		starters: {
			size: integer(starters.size, d.starters.size, 1, 3),
			mode: oneOf(starters.mode, ['fixed', 'random'], d.starters.mode),
			teams: [0, 1, 2].map(i => speciesList(teams[i], 3)),
			pool: speciesList(starters.pool),
		},
		acts: {
			mode: oneOf(acts.mode, ['complete', 'custom'], d.acts.mode),
			count: integer(acts.count, d.acts.count, 1, MAX_ACTS),
		},
		startLevel: integer(input.startLevel, d.startLevel, 1, 90),
		levelCap: integer(input.levelCap, d.levelCap, 2, 100),
		startMoney: integer(input.startMoney, d.startMoney, 0, MAX_START_MONEY),
		attrition: oneOf(input.attrition, ['persist', 'fullheal'], d.attrition),
		weights: Object.fromEntries(NODE_WEIGHT_KEYS.map(key => [key, integer(weights[key], d.weights[key], 0, 100)])) as
			Record<NodeWeightKey, number>,
		legendaryChance: integer(input.legendaryChance, d.legendaryChance, 0, 100),
		shinyOdds: integer(input.shinyOdds, d.shinyOdds, 0, MAX_SHINY_ODDS),
		ai: { wild: aiList(ai.wild, d.ai.wild), trainer: aiList(ai.trainer, d.ai.trainer), boss: aiList(ai.boss, d.ai.boss) },
		capture: oneOf(input.capture, ['choose', 'ball', 'chance'], d.capture),
		computer: input.computer === true,
		bosses: {
			acts: [0, 1, 2, 3].map(i => slot(Array.isArray(bosses.acts) ? bosses.acts[i] : undefined)),
			elite: [0, 1].map(i => slot(Array.isArray(bosses.elite) ? bosses.elite[i] : undefined)),
			champion: slot(bosses.champion),
			pool: Array.isArray(bosses.pool) ?
				[...new Set(bosses.pool.filter((id: unknown) => Number.isInteger(id) && (id as number) > 0))] as number[] : [],
		},
		badges: {
			mode: oneOf(badges.mode, ['chosen', 'random'], d.badges.mode),
			ids: Array.isArray(badges.ids) ?
				badges.ids.filter((id: unknown) => typeof id === 'string').map((id: string) => id.slice(0, 40)).slice(0, BADGE_COUNT) :
				[],
			leaders: Array.from({ length: BADGE_COUNT }, (_, i) => (
				slot(Array.isArray(badges.leaders) ? badges.leaders[i] : undefined)
			)),
		},
	};
}

// --- Regras derivadas ----------------------------------------------------------------

/** Atos com mapa (no modo Completo, o ato especial vem à parte, na etapa 9). */
export function mapActs(def: ExpeditionDefinition) {
	return def.acts.mode === 'complete' ? COMPLETE_ACTS : def.acts.count;
}

/** Iniciais regionais (os 3 de cada geração, na forma básica) das gerações do tema. */
export function regionalStarters(theme: Theme): string[] {
	return GAME_STARTERS.map(id => Dex.species.get(id).name).filter(name => inTheme(name, theme));
}

function isRegionalStarter(speciesName: string) {
	return (GAME_STARTERS as readonly string[]).includes(Dex.species.get(speciesName).id);
}

/** Pool dos times sorteados: o do admin ou, vazio, os iniciais regionais do tema. */
export function starterPool(def: ExpeditionDefinition): string[] {
	return def.starters.pool.length ? def.starters.pool.map(name => Dex.species.get(name).name) :
		regionalStarters(def.theme);
}

/**
 * Times iniciais sorteados: um inicial regional diferente em cada time e o resto do
 * pool, sem repetir espécie entre os times.
 */
export function drawStarterTeams(prng: PRNG, def: ExpeditionDefinition): string[][] {
	const pool = [...new Set(starterPool(def))];
	const starters = pool.filter(isRegionalStarter);
	prng.shuffle(starters);
	const leads = starters.slice(0, STARTER_TEAMS);
	const rest = pool.filter(name => !leads.includes(name));
	prng.shuffle(rest);
	return leads.map((lead, t) => [lead, ...rest.slice(t * (def.starters.size - 1), (t + 1) * (def.starters.size - 1))]);
}

/** Insígnias do catálogo com tipo (as de tipo variável ficam de fora). */
function typedBadges() {
	return BADGES.filter(badge => badge.type);
}

/** Sorteia 8 insígnias de tipos diferentes. */
export function drawBadges(prng: PRNG): string[] {
	const badges = [...typedBadges()];
	prng.shuffle(badges);
	const picked: string[] = [];
	const types = new Set<string>();
	for (const badge of badges) {
		if (picked.length >= BADGE_COUNT) break;
		if (types.has(badge.type!)) continue;
		types.add(badge.type!);
		picked.push(badge.id);
	}
	return picked;
}

/** Ligas do catálogo com 8 insígnias de tipos diferentes (para escolher o conjunto de uma vez). */
export function badgeLeagues(): { region: string, ids: string[] }[] {
	const byRegion = new Map<string, string[]>();
	for (const badge of typedBadges()) byRegion.set(badge.region, [...byRegion.get(badge.region) || [], badge.id]);
	const leagues: { region: string, ids: string[] }[] = [];
	for (const [region, ids] of byRegion) {
		const types = new Set(ids.map(id => BADGES.find(badge => badge.id === id)!.type));
		if (ids.length === BADGE_COUNT && types.size === BADGE_COUNT) leagues.push({ region, ids });
	}
	return leagues;
}

// --- Validação -----------------------------------------------------------------------

const problem = (message: string, ...args: (string | number)[]): Problem => ({ message, args });

/** Nome da expedição (vai no título das páginas e no histórico). */
export function checkExpeditionName(name: string): Problem[] {
	const trimmed = name.trim();
	if (!trimmed) return [problem(TLkey`The name cannot be empty.`)];
	if (trimmed.length > NAME_MAX_LENGTH) {
		return [problem(TLkey`The name can be at most {0} characters long.`, NAME_MAX_LENGTH)];
	}
	if (/[|,;[\]]/.test(trimmed) || hasForbiddenChars(name)) {
		return [problem(TLkey`The name cannot contain line breaks or the characters | , ; [ ] < > & " @ or a backslash.`)];
	}
	return [];
}

/** Formato base e regras: precisam montar um formato válido, com itens e habilidades (gen 3 em diante). */
export function checkExpeditionFormat(format: FormatSpec): Problem[] {
	const base = Dex.formats.get(format.base);
	if (!base.exists || base.effectType !== 'Format') return [problem(TLkey`Base format "{0}" not found.`, format.base)];
	if (base.team) {
		return [problem(TLkey`Base format "{0}" uses generated teams and cannot be used in an expedition.`, base.name)];
	}
	if (base.gymChallenge || base.expedition) {
		return [problem(TLkey`Base format "{0}" belongs to a mode and cannot be used in an expedition.`, base.name)];
	}
	// A mochila e as Mega Stones precisam de itens e habilidades (gen 3 em diante)
	if (Dex.forFormat(base).gen < 3) {
		return [problem(TLkey`The base format needs to be from generation 3 onwards (items and abilities).`)];
	}
	if (format.rules.length > RULES_MAX_LENGTH) return [problem(TLkey`The extra rules are too long.`)];
	if (hasForbiddenChars(format.rules) || format.rules.includes('|')) {
		return [problem(TLkey`The extra rules cannot contain line breaks or the characters | < > & " @ or a backslash.`)];
	}
	const rules = format.rules.split(',').map(rule => rule.trim()).filter(Boolean);
	try {
		Dex.formats.validate(`${base.id}${rules.length ? `@@@${rules.join(',')}` : ''}`);
	} catch (err: any) {
		return [problem(TLkey`Invalid rules: {0}`, err.message)];
	}
	return [];
}

function unknownSpecies(list: string[]) {
	return list.filter(name => !Dex.species.get(name).exists);
}

/**
 * Campos da definição (o que impede salvar): espécies que não existem, nível inicial
 * acima do teto, chances todas zeradas e texto proibido na descrição.
 */
export function checkDefinitionFields(def: ExpeditionDefinition): Problem[] {
	const problems: Problem[] = [];
	// A descrição é escapada nas páginas; só as quebras de linha e os caracteres de controle ficam de fora
	// eslint-disable-next-line no-control-regex -- os caracteres de controle são justamente o que é recusado
	if (/[\x00-\x1f\x7f]/.test(def.description)) {
		problems.push(problem(TLkey`The description cannot contain line breaks.`));
	}
	const lists = [...def.theme.species, ...def.starters.pool, ...def.starters.teams.flat()];
	const missing = unknownSpecies(lists);
	if (missing.length) problems.push(problem(TLkey`Unknown Pokémon: {0}.`, [...new Set(missing)].join(', ')));
	if (def.levelCap <= def.startLevel) {
		problems.push(problem(TLkey`The level of the final boss must be above the starting level.`));
	}
	if (!NODE_WEIGHT_KEYS.some(key => def.weights[key] > 0)) {
		problems.push(problem(TLkey`At least one node type needs a chance above zero.`));
	}
	return problems;
}

/** Treinador do banco do Desafio, como a validação precisa dele. */
export interface BankTrainer {
	id: number;
	name: string;
	type: string | null;
	doubles: boolean;
	hasTeam: boolean;
}

/**
 * Tudo que impede abrir a expedição (lista vazia = pode abrir): campos, formato,
 * tema, times iniciais, chefes que apontam para treinadores que não existem mais e,
 * no modo Completo, as 8 insígnias.
 */
export function definitionProblems(def: ExpeditionDefinition, trainers: Map<number, BankTrainer>): Problem[] {
	const problems = [...checkDefinitionFields(def), ...checkExpeditionFormat(def.format)];
	if (problems.some(p => p.message.startsWith('Unknown Pokémon'))) return problems;

	// Tema: precisa de espécies para os selvagens e de lendários se o nó de lendário pode aparecer
	const wild = basicSpecies(def.theme);
	if (wild.length < 10) {
		problems.push(problem(TLkey`The theme has too few Pokémon for the encounters ({0}; at least 10).`, wild.length));
	}
	if (def.legendaryChance > 0 && !legendarySpecies(def.theme).length) {
		problems.push(problem(TLkey`The theme has no legendary Pokémon: set the legendary chance to zero.`));
	}
	const outside = [...def.starters.pool, ...def.starters.teams.flat()].filter(name => !inTheme(name, def.theme));
	if (outside.length) {
		problems.push(problem(TLkey`Starting Pokémon outside the theme: {0}.`, [...new Set(outside)].join(', ')));
	}

	// Times iniciais: 3 times, cada um com um inicial regional diferente
	const size = def.starters.size;
	if (def.starters.mode === 'fixed') {
		const leads: string[] = [];
		def.starters.teams.forEach((team, i) => {
			const number = i + 1;
			if (team.length !== size) {
				problems.push(problem(TLkey`Starting team {0} needs {1} Pokémon.`, number, size));
				return;
			}
			const starters = team.filter(isRegionalStarter).map(name => Dex.species.get(name).id);
			if (!starters.length) problems.push(problem(TLkey`Starting team {0} needs a regional starter.`, number));
			leads.push(...starters);
		});
		if (new Set(leads).size !== leads.length) {
			problems.push(problem(TLkey`The regional starters cannot repeat between the starting teams.`));
		}
	} else {
		const pool = [...new Set(starterPool(def).map(name => Dex.species.get(name).id))];
		const starters = pool.filter(isRegionalStarter);
		if (starters.length < STARTER_TEAMS) {
			problems.push(problem(TLkey`The pool needs at least {0} regional starters from the theme.`, STARTER_TEAMS));
		}
		const needed = STARTER_TEAMS * size;
		if (pool.length < needed) {
			problems.push(problem(TLkey`The pool needs at least {0} different Pokémon for teams of {1}.`, needed, size));
		}
		const cap = maxBstForLevel(def.startLevel);
		const strong = pool.filter(id => baseStatTotal(id) > cap).map(id => Dex.species.get(id).name);
		if (strong.length) {
			problems.push(problem(TLkey`Too strong for the starting level: {0}.`, strong.join(', ')));
		}
	}

	// Chefes escolhidos: o treinador precisa existir e ter time
	const slots: BossSlot[] = [...def.bosses.acts.slice(0, mapActs(def))];
	if (def.acts.mode === 'complete') slots.push(...def.bosses.elite, def.bosses.champion, ...def.badges.leaders);
	const usesPool = slots.includes('pool');
	for (const entry of [...slots, ...def.bosses.pool]) {
		if (typeof entry !== 'number') continue;
		const trainer = trainers.get(entry);
		if (!trainer?.hasTeam) {
			problems.push(problem(TLkey`Trainer #{0} is no longer in the bank (or has no team).`, entry));
		}
	}
	if (usesPool && !def.bosses.pool.length) {
		problems.push(problem(TLkey`Select the trainers that can be drawn, or stop using the draw.`));
	}

	// Modo Completo: as 8 insígnias, de tipos diferentes
	if (def.acts.mode === 'complete') {
		const badges = def.badges.ids.map(id => BADGES.find(badge => badge.id === id));
		if (badges.length !== BADGE_COUNT || badges.some(badge => !badge?.type)) {
			problems.push(problem(TLkey`The Complete mode needs {0} badges.`, BADGE_COUNT));
		} else if (new Set(badges.map(badge => badge!.type)).size !== BADGE_COUNT) {
			problems.push(problem(TLkey`The badges need to be of different types.`));
		}
		// Líder escolhido a dedo: precisa ter o tipo da insígnia (decisão do usuário)
		def.badges.leaders.forEach((leader, i) => {
			const badge = badges[i];
			const trainer = typeof leader === 'number' ? trainers.get(leader) : null;
			if (badge?.type && trainer && trainer.type !== badge.type) {
				problems.push(problem(TLkey`The leader of the {0} needs to be of the {1} type.`, badge.name, badge.type));
			}
		});
	}
	return problems;
}

// --- Variação a partir da definição ----------------------------------------------------

/** Expedição do banco, como o plugin a lê. */
export interface StoredExpedition {
	id: number;
	name: string;
	status: ExpeditionStatus;
	definition: ExpeditionDefinition;
}

/** Andares em que não há PokéCenter: o anterior ao andar fixo de PokéCenter (o 13º; como no Slay the Spire). */
const NO_REST_FLOORS = [-2];

/** Variação que o resto do plugin usa. */
export function variantFromDefinition(expedition: StoredExpedition): ExpeditionVariant {
	const def = expedition.definition;
	const acts = mapActs(def);
	const name = Utils.escapeHTML(expedition.name);
	const description = Utils.escapeHTML(def.description);
	const index = (act: number) => Math.min(MAX_ACTS, Math.max(1, act)) - 1;
	return {
		id: String(expedition.id),
		name: () => name,
		description: () => description,
		status: expedition.status,
		rules: {
			battles: 'manual', progression: 'levels', attrition: def.attrition,
			faint: def.mode === 'nuzlocke' ? 'nuzlocke' : 'revive', capture: def.capture, teamSize: 6,
			computer: def.computer, shinyOdds: def.shinyOdds, complete: def.acts.mode === 'complete',
		},
		map: {
			acts, floors: ACT_FLOORS, columns: MAP_COLUMNS, paths: MAP_PATHS,
			weights: {
				wild: def.weights.wild, event: def.weights.event, trainer: def.weights.trainer, elite: def.weights.elite,
				rest: def.weights.rest, shop: def.weights.shop, item: def.weights.item,
			},
			// O primeiro andar é de selvagens, o do meio é de item, e o último antes do chefe, PokéCenter
			fixedFloors: { 0: 'wild', [ITEM_FLOOR]: 'item', [-1]: 'rest' },
			// Sem PokéCenter e sem elite antes do andar 6 (como as fogueiras e as elites do Slay the Spire)
			minFloor: { rest: 5, elite: 5, shop: 1, item: 1 },
			forbiddenFloors: { rest: NO_REST_FLOORS },
			distinctSiblings: true,
			noRepeat: ['rest', 'shop', 'item', 'elite', 'legendary'],
			lateTypes: ['legendary'],
			rareNodes: { legendary: def.legendaryChance },
			bossType: 'boss',
			special: def.acts.mode === 'complete',
		},
		extra: {
			startLevel: def.startLevel, levelsPerAct: (def.levelCap - def.startLevel) / acts, bossLegendaryChance: 0,
			startMoney: def.startMoney,
		},
		format: { ...def.format },
		encounters: { wild: { pokedex: 100 }, trainer: { pokedex: 100 }, boss: { pokedex: 100 }, legendary: { pokedex: 100 } },
		theme: { gens: [...def.theme.gens], species: [...def.theme.species] },
		bosses: { acts: [...def.bosses.acts], pool: [...def.bosses.pool] },
		...(def.acts.mode === 'complete' ? {
			completeConfig: {
				badges: def.badges.ids.map((id, i) => {
					const badge = BADGES.find(entry => entry.id === id);
					return { id, type: badge?.type || '', leaderName: badge?.leaders[0] || '', leader: def.badges.leaders[i] };
				}).filter(badge => badge.type),
				elite: [...def.bosses.elite],
				champion: def.bosses.champion,
			},
		} : {}),
		aiLevel(kind, progress, act) {
			const i = index(act);
			if (kind === 'wild') return def.ai.wild[i];
			if (kind === 'trainer') return def.ai.trainer[i];
			// A elite joga um nível acima dos treinadores do ato (até a Mestre)
			if (kind === 'elite') return AI_LEVELS[Math.min(AI_LEVELS.length - 1, AI_LEVELS.indexOf(def.ai.trainer[i]) + 1)];
			return def.ai.boss[i];
		},
		starterOptions(prng) {
			const teams = def.starters.mode === 'fixed' ?
				def.starters.teams.map(team => team.map(entry => Dex.species.get(entry).name)) : drawStarterTeams(prng, def);
			return teams.map((team, t) => team.map((species, i): RunMon => (
				createMon(prng, species, def.startLevel, `s${t}${i}`)
			)));
		},
	};
}
