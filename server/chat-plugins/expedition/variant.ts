/**
 * pokemon-showdown-custom: variações da Expedição (a forma que o resto do plugin usa).
 *
 * Desde a etapa 6 (decisão do usuário, 2026-10-22), as expedições são criadas pelo
 * admin no painel e guardadas no banco (definition.ts transforma a definição numa
 * variação). O código ainda pode registrar variações (`registerVariant`), escondidas
 * dos jogadores: a de teste dos testes automáticos (variants.ts).
 *
 * Uma variação define as regras (batalhas, progressão, desgaste, desmaio, captura), o
 * mapa, o tema, o formato e os times iniciais. Cada run guarda as configurações em
 * vigor quando começou (`RunSettings`), para que uma edição no painel não mude uma
 * run em andamento.
 *
 * Este arquivo roda também no processo do simulador (formats.ts): não pode depender
 * do banco nem do servidor. As expedições do banco chegam pela fonte registrada em
 * `setVariantSource` (index.ts, só no processo principal).
 *
 * @license MIT
 */
import type { Translator } from '../../../sim/dex-text';
import type { PRNG } from '../../../sim/prng';
import type { RunMon } from './team';
import type { AILevel } from '../gym-challenge/levels';
import type { Theme } from './species';

/** Batalhas jogadas pelo jogador ou automáticas (IA contra IA). */
export type BattleMode = 'manual' | 'auto';
/** Níveis que sobem durante a run, ou nível fixo. */
export type Progression = 'levels' | 'fixed';
/** HP e PP continuam entre as batalhas, ou cura total depois de cada uma. */
export type Attrition = 'persist' | 'fullheal';
/** Pokémon desmaiado continua no time, ou sai dele (Nuzlocke). */
export type FaintRule = 'revive' | 'nuzlocke';
/**
 * Captura de selvagens (decisões do usuário): "choose" = ao vencer, o jogador escolhe
 * se fica com o Pokémon (o padrão); "ball" = captura certa, gastando uma Poké Bola da
 * mochila; "chance" = com chance, pela taxa de captura da espécie e a bola (etapa 8);
 * "none" = sem captura.
 */
export type CaptureRule = 'choose' | 'ball' | 'chance' | 'none';

export interface VariantRules {
	battles: BattleMode;
	progression: Progression;
	attrition: Attrition;
	faint: FaintRule;
	/** Captura de selvagens e lendários depois da vitória (padrão: sem captura). */
	capture?: CaptureRule;
	/** Tamanho máximo do time. */
	teamSize: number;
	/** Computador no PokéCenter (etapa 8). */
	computer?: boolean;
	/** Chance de um selvagem ser shiny: 1 em `shinyOdds` (etapa 8; 0 = nunca). */
	shinyOdds?: number;
	/** Modo Completo: insígnias, agravantes e ato especial (etapa 9). */
	complete?: boolean;
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
	/** Andares em que um tipo não pode aparecer (contando do 0; negativos contam do topo). */
	forbiddenFloors?: Record<string, number[]>;
	/**
	 * Nós que saem do mesmo ponto têm tipos diferentes, quando houver opção (regra do
	 * Slay the Spire: uma bifurcação sempre oferece uma escolha de verdade).
	 */
	distinctSiblings?: boolean;
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
 * Megaevolução e sem Tera, Z-moves e Dynamax.
 */
export interface FormatSpec {
	base: string;
	rules: string;
}

export const DEFAULT_FORMAT: FormatSpec = {
	base: 'gen9nationaldexag', rules: 'Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause',
};

/** Tipos de encontro com batalha (elite: treinador forte, com recompensa melhor). */
export type EncounterKind = 'wild' | 'trainer' | 'elite' | 'boss' | 'legendary';

/** Chefe de um ato: gerado, sorteado da seleção do banco do Desafio ou um treinador escolhido (id). */
export type BossSlot = 'generated' | 'pool' | number;

/** Chefes de uma run: o de cada ato e a seleção do banco para os sorteios. */
export interface BossSettings {
	acts: BossSlot[];
	pool: number[];
}
/**
 * De onde vêm os adversários: sorteados da Pokédex (do tema), treinadores do banco do
 * Desafio de Ginásios (ajustados ao nível do andar) ou listas próprias da variação.
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
 * Regra de desbloqueio: ao vencer a run, o jogador ganha o desbloqueio, que fica na
 * conta e vale nas próximas runs. O que cada expedição libera vem na etapa 9 (iniciais
 * shiny do modo Completo).
 */
export interface UnlockRule {
	when: 'win';
	kind: 'starter' | 'item' | 'variant';
	/** Id do que é liberado (espécie, item ou variação). */
	ref: string;
}

/** Configurações em vigor numa run. */
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
	/** Tema: a Pokédex dos sorteios e das evoluções (sem tema = a Pokédex inteira). */
	theme?: Theme;
	/** Chefes (sem isso, todos gerados). */
	bosses?: BossSettings;
}

/** Situação de uma expedição do banco: rascunho (só administradores testam), aberta ou encerrada. */
export type ExpeditionStatus = 'draft' | 'open' | 'closed';

export interface ExpeditionVariant {
	/** Identificador (letras minúsculas e números): vai no id das páginas e do formato. */
	id: string;
	name(TL: Translator): string;
	description(TL: Translator): string;
	/** Expedição do banco: rascunho, aberta ou encerrada. Sem isso, é uma variação do código. */
	status?: ExpeditionStatus;
	/** Variação do código escondida: nunca listada nem jogável (fixture dos testes). */
	hidden?: boolean;
	rules: VariantRules;
	map: MapSettings;
	extra?: Record<string, number>;
	format?: FormatSpec;
	encounters: Partial<Record<EncounterKind, Partial<Record<OpponentSource, number>>>>;
	pool?: VariantPool;
	theme?: Theme;
	bosses?: BossSettings;
	/**
	 * Nível de IA dos adversários por tipo de encontro, progresso da run (0 = início,
	 * 1 = fim) e ato.
	 */
	aiLevel(kind: EncounterKind, progress: number, act: number): AILevel;
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

/** De onde vêm as expedições do banco (registrada pelo index.ts, no processo principal). */
export interface VariantSource {
	get(id: string): ExpeditionVariant | null;
	list(): ExpeditionVariant[];
}

const registry = new Map<string, ExpeditionVariant>();
let source: VariantSource | null = null;

export function registerVariant(variant: ExpeditionVariant) {
	if (!/^[a-z0-9]+$/.test(variant.id)) throw new Error(`Expedition variant id inválido: ${variant.id}`);
	registry.set(variant.id, variant);
}

export function setVariantSource(next: VariantSource | null) {
	source = next;
}

/** Variação pelo id: as do código primeiro, depois as do banco. */
export function getVariant(id: string): ExpeditionVariant | null {
	return registry.get(id) || source?.get(id) || null;
}

/** Variações registradas pelo código (com as escondidas). */
export function listCodeVariants(): ExpeditionVariant[] {
	return [...registry.values()];
}

/** Variações do código (com as escondidas) e expedições do banco. */
export function listVariants(): ExpeditionVariant[] {
	return [...registry.values(), ...source?.list() || []];
}

/** Configurações em vigor numa run nova (cópia, para a run guardar). */
export function resolveSettings(variant: ExpeditionVariant): RunSettings {
	return {
		rules: { ...variant.rules },
		map: {
			...variant.map, weights: { ...variant.map.weights }, fixedFloors: { ...variant.map.fixedFloors },
			minFloor: { ...variant.map.minFloor }, noRepeat: [...variant.map.noRepeat],
			lateTypes: [...variant.map.lateTypes || []], maxPerAct: { ...variant.map.maxPerAct },
			rareNodes: { ...variant.map.rareNodes },
			...(variant.map.forbiddenFloors ? { forbiddenFloors: JSON.parse(JSON.stringify(variant.map.forbiddenFloors)) } : {}),
		},
		extra: { startLevel: 5, levelsPerAct: 30, bossLegendaryChance: 0, startMoney: 0, ...variant.extra },
		format: { ...(variant.format || DEFAULT_FORMAT) },
		encounters: JSON.parse(JSON.stringify(variant.encounters)),
		...(variant.theme ? { theme: { gens: [...variant.theme.gens], species: [...variant.theme.species] } } : {}),
		...(variant.bosses ? { bosses: { acts: [...variant.bosses.acts], pool: [...variant.bosses.pool] } } : {}),
	};
}
