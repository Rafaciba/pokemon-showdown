/**
 * pokemon-showdown-custom: força medida de cada nível de IA do Desafio de Ginásios.
 *
 * Taxa de vitória de cada nível contra cada outro, em batalhas IA contra IA com times
 * aleatórios (Random Battle e Random Doubles), alternando os lados. Medida com o banco
 * de testes (tools/gym-challenge/ai-benchmark.js) na calibração da IA Mestre (etapa 5)
 * e mostrada no painel (página IA Mestre). Detalhes em
 * docs/arquitetura-desafio-ginasios.md, seção "IA Mestre".
 *
 * @license MIT
 */
import type { AILevel } from './levels';

export interface LevelStrength {
	/** Data da medição (AAAA-MM-DD). */
	measuredAt: string;
	/** Batalhas por confronto, no mínimo (os confrontos sem a Mestre, mais rápidos, tiveram mais). */
	battles: number;
	/**
	 * Vitórias do primeiro nível contra o segundo, em fração (empates fora), por tipo
	 * de batalha; a chave é "nível:adversário".
	 */
	rates: { [kind in 'singles' | 'doubles']: { [pair: string]: number } };
}

/**
 * Medição de 2026-10-20: 1000 batalhas por confronto entre Aleatório, Fácil, Médio e Difícil, e 400 nos
 * confrontos da Mestre (com a busca no simulador; em dupla, 4 respostas dos adversários).
 */
export const LEVEL_STRENGTH: LevelStrength | null = {
	measuredAt: '2026-10-20',
	battles: 400,
	rates: {
		singles: {
			'easy:random': 0.595, 'medium:random': 0.927, 'hard:random': 0.923, 'master:random': 0.958,
			'medium:easy': 0.914, 'hard:easy': 0.898, 'master:easy': 0.948,
			'hard:medium': 0.571, 'master:medium': 0.693, 'master:hard': 0.653,
		},
		doubles: {
			'easy:random': 0.72, 'medium:random': 0.938, 'hard:random': 0.944, 'master:random': 0.95,
			'medium:easy': 0.815, 'hard:easy': 0.785, 'master:easy': 0.895,
			'hard:medium': 0.533, 'master:medium': 0.635, 'master:hard': 0.565,
		},
	},
};

/** Vitórias de `level` contra `opponent` (a medição de um lado vale para o outro), ou null. */
export function strengthRate(kind: 'singles' | 'doubles', level: AILevel, opponent: AILevel): number | null {
	if (!LEVEL_STRENGTH || level === opponent) return null;
	const rates = LEVEL_STRENGTH.rates[kind];
	const direct = rates[`${level}:${opponent}`];
	if (direct !== undefined) return direct;
	const reverse = rates[`${opponent}:${level}`];
	return reverse === undefined ? null : 1 - reverse;
}
