/**
 * pokemon-showdown-custom: níveis de dificuldade da IA dos treinadores NPC.
 *
 * A dificuldade é a qualidade das escolhas da IA. Em ordem crescente: o bot
 * aleatório padrão do PS e as IAs heurísticas Fácil, Médio e Difícil
 * (heuristic-ai.ts). Um nível acima, que aprende com as batalhas, fica para depois.
 *
 * @license MIT
 */

export const AI_LEVELS = ['random', 'easy', 'medium', 'hard'] as const;
export type AILevel = typeof AI_LEVELS[number];

export function isAILevel(level: unknown): level is AILevel {
	return typeof level === 'string' && (AI_LEVELS as readonly string[]).includes(level);
}

/**
 * Nível efetivo de um treinador num desafio: o do treinador naquele desafio,
 * mas nunca abaixo da dificuldade base do desafio (que é o mínimo).
 */
export function effectiveAILevel(base: AILevel, trainerLevel: AILevel | null): AILevel {
	if (!trainerLevel) return base;
	return AI_LEVELS.indexOf(trainerLevel) > AI_LEVELS.indexOf(base) ? trainerLevel : base;
}
