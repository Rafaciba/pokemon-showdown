/**
 * pokemon-showdown-custom: modelo de avaliação de posição da IA Mestre.
 *
 * Regressão logística (value-model.ts) sobre as características da posição
 * (position.ts), treinada em batalhas simuladas (tools/gym-challenge/train-value.js;
 * etapa 3). É o modelo de partida: o servidor guarda os modelos no banco e pode pôr em
 * uso um modelo retreinado com as batalhas reais (master-learning.ts, etapa 4).
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
 * Modelo das batalhas em dupla (saída de train-value.js --doubles, campo "model"): 20 mil batalhas simuladas,
 * 75.0% de acerto do vencedor em posições fora do treino (2026-10-20). Usa as características de dupla
 * (position.ts).
 */
export const MASTER_DOUBLES_MODEL: ValueModel | null = {
	version: 'sim-dupla-2026-10-20', samples: 333774, battles: 18000,
	features: ['ourHp', 'theirHp', 'ourAlive', 'theirAlive', 'ourActiveHp', 'theirActiveHp', 'ourDamage', 'theirDamage',
		'faster', 'weKo', 'theyKo', 'koFirst', 'ourBench', 'theirBench', 'ourBoosts', 'theirBoosts', 'ourStatus',
		'theirStatus', 'ourHazards', 'theirHazards', 'ourScreens', 'theirScreens'],
	mean: [3.28601, 3.29034, 3.94876, 3.94813, 1.3398, 1.34479, 0.89857, 0.95335, 0.00767, 0.64249, 0.70106, -0.02164,
		0.01221, 0.00968, -0.032, -0.03204, 0.12558, 0.12552, 0.01335, 0.01223, 0.01864, 0.01864],
	scale: [1.80625, 1.80537, 1.71559, 1.71587, 0.54299, 0.54117, 0.46507, 0.47025, 0.70952, 0.68873, 0.70093, 0.46459,
		0.25952, 0.17034, 0.2638, 0.26381, 0.29838, 0.29836, 0.08486, 0.07692, 0.16276, 0.16276],
	weights: [1.55292, -1.59592, 0.99515, -1.00511, 0.27572, -0.32794, 0.33506, -0.29468, 0.20941, -0.0565, 0.1004,
		0.29523, 0.10174, -0.03592, 0.07519, -0.10791, -0.10241, 0.11267, -0.09008, 0.10236, 0.0443, -0.03171],
	bias: 0.00961,
};

/**
 * Busca no simulador (sim-search.ts): 2 palpites do time do adversário, margem de 0,05 e
 * até 1 s por jogada. Com mais palpites não houve ganho mensurável (etapa 3).
 */
export const MASTER_SIM: SimSearchOptions = { ...DEFAULT_SIM_SEARCH, samples: 2 };
