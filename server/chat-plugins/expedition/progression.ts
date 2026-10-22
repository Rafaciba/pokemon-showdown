/**
 * pokemon-showdown-custom: ritmo da Expedição (progresso, níveis e experiência).
 *
 * - Progresso de um nó: de 0 (começo da run) a 1 (chefe do último ato). Escolhe a IA e
 *   o tamanho dos times adversários.
 * - Curva de níveis (decisão do usuário): `levelsPerAct` níveis por ato (30 por padrão),
 *   a partir do nível inicial e até o 100. O nível dos adversários segue a curva, com
 *   pequena variação; o chefe fica um pouco acima. Uma expedição de um ato termina por
 *   volta do nível 35, e só as mais longas chegam aos níveis altos.
 * - Experiência (decisão do usuário): a dos jogos, sem nível fixo. O multiplicador da
 *   variação é calibrado para que o jogador médio (caminho ao acaso no mapa, vencendo
 *   todas as batalhas) chegue a cada chefe perto do nível da curva. Quem escolhe mais
 *   batalhas, ou batalhas que valem mais, passa um pouco do nível; quem pega só
 *   selvagens ou nós sem batalha fica abaixo. A vitória contra o chefe tem peso
 *   próprio, calibrado para o time sair dele pouco acima do nível do chefe: sem isso,
 *   o chefe (dois andares acima da última batalha, com 6 Pokémon evoluídos) jogaria o
 *   time muito acima dos adversários do começo do ato seguinte. A fórmula dos jogos dá mais experiência
 *   a quem está abaixo do adversário, e isso mantém a variação baixa.
 * - Batalhas com vários adversários: a vitória vale a média deles vezes a raiz da
 *   quantidade (`battleExp`). Somar todos faria um treinador com 5 Pokémon valer 5
 *   selvagens.
 * - Ganho de experiência (decisão do usuário): no modo padrão, quem desmaiou ganha
 *   metade, para não ficar para trás; no Nuzlocke, os desmaiados saem do time, e um
 *   time menor ganha um pouco mais (`nuzlockeBonus`).
 *   Golpes novos com espaço são aprendidos na hora; com quatro golpes, e nas evoluções
 *   por nível, o jogador decide (fila de decisões da run).
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { EncounterKind, RunSettings } from './variant';
import { expForLevel, expReward, levelForExp, movesLearnedBetween, MAX_LEVEL, type RunMon } from './team';
import { legendarySpecies, levelEvolutions, randomSpeciesForLevel } from './species';
import { seededRandom } from './random';
import { generateAct, reachableNodes } from './map';

/** Decisão que o jogador precisa tomar antes de seguir no mapa. */
export type RunDecision =
	{ kind: 'learn', uid: string, move: string } |
	{ kind: 'evolve', uid: string, into: string } |
	/** Selvagem vencido: ficar com ele (`mon`, já pronto para entrar no time) ou não. */
	{ kind: 'capture', uid: string, mon: RunMon };

/** Experiência ganha numa vitória, para o resumo da página. */
export interface MonGain {
	uid: string;
	exp: number;
	from: number;
	to: number;
	/** Golpes aprendidos na hora (com espaço livre). */
	learned: string[];
}

export const DEFAULT_LEVELS_PER_ACT = 30;

export function nodeProgress(settings: RunSettings, act: number, floor: number) {
	const acts = Math.max(1, settings.map.acts);
	const floors = Math.max(1, settings.map.floors);
	// Primeiro andar do primeiro ato: 0; o chefe fica no andar `floors`: 1 no último ato
	return Math.min(1, (act - 1 + floor / floors) / acts);
}

/** Nível da curva num andar: o nível inicial mais `levelsPerAct` por ato (o chefe do ato fecha o ato). */
export function curveLevel(settings: RunSettings, act: number, floor: number) {
	const floors = Math.max(1, settings.map.floors);
	const perAct = settings.extra.levelsPerAct ?? DEFAULT_LEVELS_PER_ACT;
	const level = settings.extra.startLevel + perAct * (act - 1 + Math.min(floor, floors) / floors);
	return Math.max(1, Math.min(MAX_LEVEL, level));
}

export function opponentLevel(settings: RunSettings, act: number, floor: number, prng: PRNG, kind: EncounterKind) {
	const level = curveLevel(settings, act, floor) + (prng.random(3) - 1) + (kind === 'boss' ? 2 : 0);
	return Math.max(1, Math.min(MAX_LEVEL, Math.round(level)));
}

/** Tamanho do time adversário: selvagem e lendário 1; treinador de 1-2 a 4-5; chefe 6. */
export function opponentTeamSize(kind: EncounterKind, progress: number, prng: PRNG) {
	if (kind === 'wild' || kind === 'legendary') return 1;
	if (kind === 'boss') return 6;
	return Math.min(5, 1 + Math.floor(progress * 3.5) + prng.random(2));
}

const sampleCache = new Map<string, string[]>();

/** Espécies típicas de um nível (amostra fixa do sorteio da Pokédex, ou dos lendários, no estágio do nível). */
function typicalSpecies(level: number, legendary = false) {
	const key = `${legendary ? 'L' : ''}${level}`;
	let sample = sampleCache.get(key);
	if (!sample) {
		const prng = seededRandom('expedition', `typical:${key}`);
		// Lendários sem teto de força (o nó de lendário não usa o teto)
		sample = Array.from({ length: 40 }, () => (
			legendary ? randomSpeciesForLevel(prng, level, legendarySpecies(), null) : randomSpeciesForLevel(prng, level)
		));
		sampleCache.set(key, sample);
	}
	return sample;
}

/** Nó de um caminho da calibração: o que a vitória vale para um Pokémon do nível dado. */
export interface CalibrationStep {
	level: number;
	/** Adversários esperados (média) e se são de treinador. */
	count: number;
	trainer: boolean;
	legendary: boolean;
	/** Chefe do ato: o nível na chegada é comparado com a curva. */
	boss: boolean;
	act: number;
}

const CALIBRATION_PATHS = 24;

/** Caminhos ao acaso em mapas gerados com a configuração da variação (o "jogador médio"). */
export function calibrationPaths(settings: RunSettings): CalibrationStep[][] {
	const paths: CalibrationStep[][] = [];
	for (let i = 0; i < CALIBRATION_PATHS; i++) {
		const seed = `calibration:${i}`;
		const prng = seededRandom(seed, 'path');
		const steps: CalibrationStep[] = [];
		for (let act = 1; act <= settings.map.acts; act++) {
			const map = generateAct(seed, act, settings.map);
			let current: string | null = null;
			for (let guard = 0; guard <= settings.map.floors + 1; guard++) {
				const options = reachableNodes(map, current);
				if (!options.length) break;
				const node = options[prng.random(options.length)];
				current = node.id;
				const progress = nodeProgress(settings, act, node.floor);
				const kind = node.id === map.boss ? 'boss' : node.type;
				const level = Math.round(curveLevel(settings, act, node.floor) + (kind === 'boss' ? 2 : 0));
				const step = { level, act, boss: kind === 'boss', trainer: false, legendary: false, count: 0 };
				if (kind === 'wild') step.count = 1;
				if (kind === 'legendary') Object.assign(step, { count: 1, legendary: true });
				// Treinador: 1 + floor(progresso * 3,5) + 0 ou 1, até 5
				if (kind === 'trainer') Object.assign(step, { count: Math.min(5, 1.5 + Math.floor(progress * 3.5)), trainer: true });
				if (kind === 'boss') Object.assign(step, { count: 6, trainer: true });
				steps.push(step);
				if (kind === 'boss') break;
			}
		}
		paths.push(steps);
	}
	return paths;
}

/** Taxas de experiência de uma variação (calibradas). */
export interface ExpRates {
	/** Multiplicador de todas as vitórias. */
	multiplier: number;
	/** Peso extra da vitória contra o chefe (menor que 1: o chefe não joga o time muito acima do ato seguinte). */
	boss: number;
}

/** Nível médio a mais na saída do chefe, em relação ao nível dele (os atos seguintes começam equilibrados). */
const BOSS_EXIT_MARGIN = 1;

/**
 * Diferença média, nos caminhos da calibração, entre o nível do time e a meta: na
 * chegada a cada chefe (meta = curva no andar do chefe) e na saída dos chefes que não
 * são o último (meta = nível do chefe + BOSS_EXIT_MARGIN). Positiva = acima.
 */
function calibrationError(settings: RunSettings, paths: CalibrationStep[][], rates: ExpRates) {
	let arrival = 0;
	let arrivals = 0;
	let exit = 0;
	let exits = 0;
	for (const steps of paths) {
		let exp = expForLevel(settings.extra.startLevel);
		for (const step of steps) {
			const winner = levelForExp(exp);
			if (step.boss) {
				arrival += winner - curveLevel(settings, step.act, settings.map.floors);
				arrivals++;
			}
			if (!step.count) continue;
			const sample = typicalSpecies(step.level, step.legendary);
			const average = sample.reduce((sum, species) => (
				sum + expReward({ species, level: step.level }, winner, step.trainer, rates.multiplier)
			), 0) / sample.length;
			exp = Math.min(expForLevel(MAX_LEVEL), exp + Math.sqrt(step.count) * average * (step.boss ? rates.boss : 1));
			if (step.boss && step.act < settings.map.acts) {
				exit += levelForExp(exp) - (step.level + BOSS_EXIT_MARGIN);
				exits++;
			}
		}
	}
	return { arrival: arrivals ? arrival / arrivals : 0, exit: exits ? exit / exits : 0 };
}

function bisect(low: number, high: number, tooHigh: (value: number) => boolean) {
	for (let i = 0; i < 30; i++) {
		const mid = (low + high) / 2;
		if (tooHigh(mid)) high = mid;
		else low = mid;
	}
	return high;
}

const ratesCache = new Map<string, ExpRates>();

/**
 * Taxas de experiência da variação. O multiplicador acerta a chegada aos chefes; o
 * peso do chefe acerta a saída (com um ato só, não há saída, e o peso fica 1). As
 * duas buscas se alternam algumas vezes, porque uma mexe na outra.
 */
export function expRates(settings: RunSettings): ExpRates {
	const key = JSON.stringify([settings.map, settings.extra.startLevel, settings.extra.levelsPerAct]);
	const cached = ratesCache.get(key);
	if (cached) return cached;
	const paths = calibrationPaths(settings);
	const rates: ExpRates = { multiplier: 1, boss: 1 };
	for (let round = 0; round < (settings.map.acts > 1 ? 4 : 1); round++) {
		rates.multiplier = bisect(0.05, 1000, value => (
			calibrationError(settings, paths, { ...rates, multiplier: value }).arrival >= 0
		));
		if (settings.map.acts > 1) {
			rates.boss = bisect(0.01, 1, value => calibrationError(settings, paths, { ...rates, boss: value }).exit >= 0);
		}
	}
	ratesCache.set(key, rates);
	return rates;
}

/** Experiência de uma vitória para um Pokémon do nível dado: a média dos derrotados vezes a raiz da quantidade. */
export function battleExp(defeated: { species: string, level: number }[], level: number, trainer: boolean,
	multiplier: number) {
	if (!defeated.length) return 0;
	const total = defeated.reduce((sum, foe) => sum + expReward(foe, level, trainer, multiplier), 0);
	return Math.floor(total / Math.sqrt(defeated.length));
}

/**
 * Nuzlocke: um time com menos Pokémon que o máximo da variação ganha mais experiência
 * por vitória, até 50% a mais com um Pokémon só (decisão do usuário: "um pouco a mais
 * para equilibrar"; o tamanho da escala é escolha nossa, ajustável aqui).
 */
export function nuzlockeBonus(teamCount: number, teamSize: number) {
	if (teamSize <= 1 || teamCount >= teamSize) return 1;
	return 1 + 0.5 * (teamSize - Math.max(1, teamCount)) / (teamSize - 1);
}

/** Fração da experiência para quem desmaiou na batalha (modo padrão). */
export const FAINTED_EXP_SHARE = 0.5;

/**
 * Experiência de uma vitória para o time: cada Pokémon ganha a experiência da batalha
 * (`battleExp`); quem desmaiou ganha `FAINTED_EXP_SHARE` dela. Devolve as decisões
 * novas (golpes e evoluções) e o ganho de cada Pokémon.
 */
export function gainExperience(
	team: RunMon[], defeated: { species: string, level: number }[], trainer: boolean, multiplier: number
): { decisions: RunDecision[], gains: MonGain[] } {
	const decisions: RunDecision[] = [];
	const gains: MonGain[] = [];
	for (const mon of team) {
		if (mon.level >= MAX_LEVEL) continue;
		const before = mon.level;
		const expBefore = mon.exp;
		const share = mon.fainted ? FAINTED_EXP_SHARE : 1;
		mon.exp += Math.floor(battleExp(defeated, mon.level, trainer, multiplier) * share);
		mon.exp = Math.min(mon.exp, expForLevel(MAX_LEVEL));
		mon.level = levelForExp(mon.exp);
		const gain: MonGain = { uid: mon.uid, exp: mon.exp - expBefore, from: before, to: mon.level, learned: [] };
		gains.push(gain);
		if (mon.level === before) continue;
		const result = levelUpEffects(mon, before);
		gain.learned = result.learned;
		decisions.push(...result.decisions);
	}
	return { decisions, gains };
}

/**
 * Efeitos de uma subida de nível (de `before` ao nível atual): golpes novos com espaço
 * entram na hora; com quatro golpes, e nas evoluções por nível, a decisão vai para a
 * fila. Usado pela experiência e pelo Rare Candy.
 */
export function levelUpEffects(mon: RunMon, before: number): { decisions: RunDecision[], learned: string[] } {
	const decisions: RunDecision[] = [];
	const learned: string[] = [];
	for (const move of movesLearnedBetween(mon.species, before, mon.level)) {
		if (mon.moves.includes(move)) continue;
		if (mon.moves.length < 4) {
			mon.moves.push(move);
			mon.ppUsed.push(0);
			learned.push(move);
		} else {
			decisions.push({ kind: 'learn', uid: mon.uid, move });
		}
	}
	// Evolução por nível: oferecida a cada subida de nível em que for possível (como nos jogos)
	for (const evo of levelEvolutions(mon.species)) {
		if (evo.evoLevel! <= mon.level) decisions.push({ kind: 'evolve', uid: mon.uid, into: evo.name });
	}
	return { decisions, learned };
}

/** Evolui um Pokémon: espécie nova, a habilidade do mesmo espaço e o HP proporcional mantido. */
export function evolveMon(mon: RunMon, into: string) {
	const from = Dex.species.get(mon.species);
	const to = Dex.species.get(into);
	const slot = (['0', '1', 'H'] as const).find(key => from.abilities[key] === mon.ability) || '0';
	mon.species = to.name;
	mon.ability = to.abilities[slot] || to.abilities[0];
}
