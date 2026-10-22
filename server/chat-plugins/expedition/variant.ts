/**
 * pokemon-showdown-custom: variações da Expedição.
 *
 * Uma variação é programada (decisão do usuário, 2026-10-21): ela define as regras
 * (batalhas jogadas ou automáticas, progressão, desgaste e desmaio), o mapa, os tipos
 * de nó que usa e os times iniciais. Os números marcados em `tunables` podem ser
 * ajustados no painel do admin, dentro dos limites; o código continua dono da
 * variação. Cada run guarda as configurações em vigor quando começou (`RunSettings`),
 * para que um ajuste no painel não mude uma run em andamento.
 *
 * @license MIT
 */
import type { Translator } from '../../../sim/dex-text';
import type { PRNG } from '../../../sim/prng';
import type { RunMon } from './team';
import type { AILevel } from '../gym-challenge/levels';

/** Batalhas jogadas pelo jogador ou automáticas (IA contra IA). */
export type BattleMode = 'manual' | 'auto';
/** Níveis que sobem durante a run, ou nível fixo. */
export type Progression = 'levels' | 'fixed';
/** HP e PP continuam entre as batalhas, ou cura total depois de cada uma. */
export type Attrition = 'persist' | 'fullheal';
/** Pokémon desmaiado continua no time, ou sai dele (Nuzlocke). */
export type FaintRule = 'revive' | 'nuzlocke';
/**
 * Captura de selvagens (decisão do usuário): "choose" = ao vencer, o jogador escolhe
 * se fica com o Pokémon (o padrão); "none" = sem captura. Guardadas para variações
 * futuras: com Poké Bola da mochila, e com chance de captura como nos jogos.
 */
export type CaptureRule = 'choose' | 'none';

export interface VariantRules {
	battles: BattleMode;
	progression: Progression;
	attrition: Attrition;
	faint: FaintRule;
	/** Captura de selvagens e lendários depois da vitória (padrão: sem captura). */
	capture?: CaptureRule;
	/** Tamanho máximo do time. */
	teamSize: number;
}

export interface MapSettings {
	/** Atos da run; cada um tem o seu mapa e termina num chefe. */
	acts: number;
	/** Andares de cada ato, sem contar o do chefe. */
	floors: number;
	/** Colunas do mapa. */
	columns: number;
	/** Caminhos traçados do primeiro andar até o chefe (os nós são a união deles). */
	paths: number;
	/** Chance de cada tipo de nó (pesos relativos). */
	weights: Record<string, number>;
	/** Andares com tipo fixo (0 = o primeiro; negativos contam do topo: -1 = o último antes do chefe). */
	fixedFloors: Record<number, string>;
	/** Primeiro andar em que cada tipo pode aparecer. */
	minFloor: Record<string, number>;
	/** Tipos que não se repetem em seguida no mesmo caminho. */
	noRepeat: string[];
	/**
	 * Tipos que só aparecem a partir do segundo ato; numa expedição de um ato só, na
	 * metade final do ato (decisão do usuário para o nó de lendário).
	 */
	lateTypes?: string[];
	/** Máximo de nós de um tipo em cada ato. */
	maxPerAct?: Record<string, number>;
	/**
	 * Nós raros: chance (%) de o ato ter um nó do tipo (no máximo um). Não entram nos
	 * pesos; quando o sorteio acontece, um nó elegível vira desse tipo (decisão do
	 * usuário: o lendário é raro e não aparece em toda run).
	 */
	rareNodes?: Record<string, number>;
	/** Tipo do nó do chefe, no fim de cada ato. */
	bossType: string;
}

/**
 * Formato das batalhas: formato base e regras na sintaxe do PS. Padrão (decisão do
 * usuário): o do Desafio de Ginásios, individual, Pokédex completa da gen 9, com
 * Megaevolução e sem Tera, Z-moves e Dynamax. Variações futuras podem usar formatos
 * temáticos de uma geração ou liberar Tera e Dynamax.
 */
export interface FormatSpec {
	base: string;
	rules: string;
}

export const DEFAULT_FORMAT: FormatSpec = {
	base: 'gen9nationaldexag', rules: 'Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause',
};

/** Tipos de encontro com batalha. */
export type EncounterKind = 'wild' | 'trainer' | 'boss' | 'legendary';
/**
 * De onde vêm os adversários (decisão do usuário: as três coexistem, e cada variação
 * escolhe): sorteados da Pokédex, treinadores do banco do Desafio de Ginásios
 * (ajustados ao nível do andar) ou listas próprias da variação.
 */
export type OpponentSource = 'pokedex' | 'gym' | 'pool';

/** Listas próprias de uma variação (fonte "pool"). */
export interface VariantPool {
	/** Espécies básicas para selvagens e treinadores (evoluem pelo nível). */
	species: string[];
	/** Treinadores: nome, sprite e espécies básicas do time. */
	trainers: { name: string, avatar: string, species: string[] }[];
}

/**
 * Regra de desbloqueio (decisão do usuário: só a estrutura nesta etapa; o que libera
 * cada coisa fica para as variações de verdade): ao vencer a run, o jogador ganha o
 * desbloqueio, que fica na conta e vale nas próximas runs.
 */
export interface UnlockRule {
	when: 'win';
	kind: 'starter' | 'item' | 'variant';
	/** Id do que é liberado (espécie, item ou variação). */
	ref: string;
}

/** Configurações em vigor numa run (as da variação com os ajustes do painel). */
export interface RunSettings {
	rules: VariantRules;
	map: MapSettings;
	/**
	 * Números próprios da variação. A base usa: startLevel (nível inicial), levelsPerAct
	 * (níveis da curva por ato, progression.ts), bossLegendaryChance (% de o chefe ter
	 * um lendário) e startMoney (dinheiro inicial, economy.ts).
	 */
	extra: Record<string, number>;
	format: FormatSpec;
	/** Chance de cada fonte, por tipo de encontro. */
	encounters: Partial<Record<EncounterKind, Partial<Record<OpponentSource, number>>>>;
}

/**
 * Número ajustável no painel. A chave aponta para o campo: "acts", "floors",
 * "columns", "paths", "teamSize", "weight:<tipo de nó>", "rare:<tipo de nó>" ou
 * "extra:<nome>".
 */
export interface Tunable {
	key: string;
	min: number;
	max: number;
}

export interface ExpeditionVariant {
	/** Identificador (letras minúsculas e números): vai no id das páginas. */
	id: string;
	name(TL: Translator): string;
	description(TL: Translator): string;
	/** Só administradores veem e jogam (variações de teste). */
	adminOnly?: boolean;
	rules: VariantRules;
	map: MapSettings;
	extra?: Record<string, number>;
	tunables: Tunable[];
	format?: FormatSpec;
	encounters: Partial<Record<EncounterKind, Partial<Record<OpponentSource, number>>>>;
	pool?: VariantPool;
	/** Nível de IA dos adversários por tipo de encontro e progresso da run (0 = início, 1 = fim). */
	aiLevel(kind: EncounterKind, progress: number): AILevel;
	/** Batalhas automáticas: IA que joga pelo jogador. */
	autoAILevel?: AILevel;
	/** Desbloqueios que a variação dá (ver UnlockRule). */
	unlocks?: UnlockRule[];
	/**
	 * Opções de time inicial de uma run (sorteadas com o gerador da run). `unlocked`:
	 * os desbloqueios do jogador (ex.: iniciais liberados).
	 */
	starterOptions(prng: PRNG, settings: RunSettings, unlocked?: { kind: string, ref: string }[]): RunMon[][];
}

const registry = new Map<string, ExpeditionVariant>();

export function registerVariant(variant: ExpeditionVariant) {
	if (!/^[a-z0-9]+$/.test(variant.id)) throw new Error(`Expedition variant id inválido: ${variant.id}`);
	registry.set(variant.id, variant);
}

export function getVariant(id: string): ExpeditionVariant | null {
	return registry.get(id) || null;
}

export function listVariants(): ExpeditionVariant[] {
	return [...registry.values()];
}

function clamp(value: number, min: number, max: number) {
	return Math.min(max, Math.max(min, value));
}

/** Valor atual de um número ajustável (sem ajuste: o da variação). */
export function tunableValue(variant: ExpeditionVariant, key: string): number | null {
	if (key.startsWith('weight:')) return variant.map.weights[key.slice(7)] ?? 0;
	if (key.startsWith('rare:')) return variant.map.rareNodes?.[key.slice(5)] ?? 0;
	if (key.startsWith('extra:')) return variant.extra?.[key.slice(6)] ?? null;
	if (key === 'teamSize') return variant.rules.teamSize;
	if (key === 'acts' || key === 'floors' || key === 'columns' || key === 'paths') return variant.map[key];
	return null;
}

/**
 * Configurações em vigor: as da variação com os ajustes do painel. Só valem chaves
 * declaradas em `tunables`, arredondadas e limitadas ao mínimo e ao máximo.
 */
export function resolveSettings(variant: ExpeditionVariant, overrides: Record<string, number> = {}): RunSettings {
	const settings: RunSettings = {
		rules: { ...variant.rules },
		map: {
			...variant.map, weights: { ...variant.map.weights }, fixedFloors: { ...variant.map.fixedFloors },
			minFloor: { ...variant.map.minFloor }, noRepeat: [...variant.map.noRepeat],
			lateTypes: [...variant.map.lateTypes || []], maxPerAct: { ...variant.map.maxPerAct },
			rareNodes: { ...variant.map.rareNodes },
		},
		extra: { startLevel: 5, levelsPerAct: 30, bossLegendaryChance: 0, startMoney: 0, ...variant.extra },
		format: { ...(variant.format || DEFAULT_FORMAT) },
		encounters: JSON.parse(JSON.stringify(variant.encounters)),
	};
	for (const tunable of variant.tunables) {
		const raw = overrides[tunable.key];
		if (typeof raw !== 'number' || !Number.isFinite(raw)) continue;
		const value = clamp(Math.round(raw), tunable.min, tunable.max);
		const { key } = tunable;
		if (key.startsWith('weight:')) {
			settings.map.weights[key.slice(7)] = value;
		} else if (key.startsWith('rare:')) {
			settings.map.rareNodes = { ...settings.map.rareNodes, [key.slice(5)]: value };
		} else if (key.startsWith('extra:')) {
			settings.extra[key.slice(6)] = value;
		} else if (key === 'teamSize') {
			settings.rules.teamSize = value;
		} else if (key === 'acts' || key === 'floors' || key === 'columns' || key === 'paths') {
			settings.map[key] = value;
		}
	}
	return settings;
}
