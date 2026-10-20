/**
 * pokemon-showdown-custom: modelo de avaliação de posição da IA Mestre.
 *
 * Regressão logística (value-model.ts) sobre as características da posição
 * (position.ts), treinada em batalhas simuladas (tools/gym-challenge/train-value.js;
 * etapa 3). Com o modelo, a Mestre simula as jogadas no simulador do PS nas batalhas
 * individuais (sim-search.ts); sem ele, joga só com as regras e os pesos (master-weights.ts).
 *
 * @license MIT
 */
import type { ValueModel } from './value-model';
import { DEFAULT_SIM_SEARCH, type SimSearchOptions } from './sim-search';

/**
 * Modelo treinado (saída de train-value.js, campo "model"): 30 mil batalhas simuladas, 72.6% de acerto
 * do vencedor em posições fora do treino (2026-10-20).
 */
export const MASTER_MODEL: ValueModel | null = {
	version: 'sim-2026-10-20', samples: 1248194, battles: 27000,
	features: ['ourHp', 'theirHp', 'ourAlive', 'theirAlive', 'ourActiveHp', 'theirActiveHp', 'ourDamage',
		'theirDamage', 'faster', 'weKo', 'theyKo', 'koFirst', 'ourBench', 'theirBench', 'ourBoosts', 'theirBoosts',
		'ourStatus', 'theirStatus', 'ourHazards', 'theirHazards', 'ourScreens', 'theirScreens'],
	mean: [3.52642, 3.52772, 4.1414, 4.14077, 0.68268, 0.68612, 0.38419, 0.40011, 0.02757, 0.30323, 0.32788, -0.01098,
		0.05558, 0.02543, 0.02503, 0.02503, 0.1229, 0.12295, 0.04798, 0.04546, 0.01097, 0.01097],
	scale: [1.62887, 1.62882, 1.53807, 1.53843, 0.31302, 0.31129, 0.24696, 0.24836, 0.99601, 0.45966, 0.46944,
		0.71915, 0.32678, 0.25814, 0.26875, 0.26877, 0.28327, 0.2833, 0.17526, 0.16298, 0.12497, 0.12497],
	weights: [1.6103, -1.51704, 0.33783, -0.55144, 0.10992, -0.13185, 0.13636, -0.15191, 0.1335, -0.01155, 0.06084,
		0.21105, 0.10189, -0.00717, 0.0656, -0.04377, -0.1121, 0.05375, -0.1535, 0.15816, 0.04247, 0.00089],
	bias: -0.01008,
};

/**
 * Busca no simulador (sim-search.ts): 2 palpites do time do adversário, margem de 0,05 e
 * até 1 s por jogada. Com mais palpites não houve ganho mensurável (etapa 3).
 */
export const MASTER_SIM: SimSearchOptions = { ...DEFAULT_SIM_SEARCH, samples: 2 };

export function masterSearch(): { model: ValueModel, sim: SimSearchOptions } | null {
	return MASTER_MODEL ? { model: MASTER_MODEL, sim: MASTER_SIM } : null;
}
