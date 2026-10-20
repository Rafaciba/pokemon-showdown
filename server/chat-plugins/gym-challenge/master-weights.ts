/**
 * pokemon-showdown-custom: pesos da IA Mestre do Desafio de Ginásios.
 *
 * A Mestre joga com as regras do Difícil (heuristic-ai.ts) e com os seus próprios
 * pesos (HeuristicWeights). Os pesos abaixo vêm do treino em batalhas simuladas
 * contra o Difícil e o Médio (tools/gym-challenge/train-master.js; etapa 2). O
 * aprendizado com as batalhas do servidor (etapa 4) passará a ajustá-los. Plano,
 * decisões e resultados em docs/arquitetura-desafio-ginasios.md, seção "IA Mestre".
 *
 * @license MIT
 */
import type { HeuristicWeights } from './heuristic-ai';

/**
 * Pesos treinados (saída de train-master.js, campo "weights"): 50 gerações, 12 variações e
 * 480 batalhas por candidato em cada geração (2026-10-20).
 */
export const TRAINED_WEIGHTS: Readonly<HeuristicWeights> = Object.freeze({
	koBonus: 10.179, priorityKoBonus: 19.021, outspedFactor: 0.392, phazeVsBoosts: 37.82, doomedStatusFactor: 0.515,
	healLowHp: 66.27, healLow: 64.625, healMidHp: 39.194, healMid: 23.405, stall: 21.969, stallHp: 30.375,
	screens: 78.829, screensHp: 36.623, hazeVsBoosts: 42.195, hazardHp: 22.832, stealthRock: 29.165, stickyWeb: 56.892,
	spikes: 22.545, toxicSpikes: 35.378, statusHp: 30.849, sleep: 141.196, toxic: 50.092, paralysis: 31.981,
	burnPhysical: 88.321, burnSpecial: 33.064, otherStatus: 45.995, boostHp: 58.287, boostDamageTaken: 55.888,
	boostOffense: 29.77, boostSpeed: 9.497, boostDefense: 22.63, boostDrop: 11.211, boostMax: 103.183, debuffHp: 96.689,
	debuffOffense: 18.999, debuffDefense: 10.131, debuffSpeed: 13.824, debuffMax: 47.006, speedKo: 16.992,
	enterKo: 187.947, switchMargin: 40.562, stayIfKo: 22.428, allyHitFactor: 0.595, allyKo: 55.184, allySupport: 9.6,
});

export function masterWeights(): Readonly<HeuristicWeights> {
	return TRAINED_WEIGHTS;
}
