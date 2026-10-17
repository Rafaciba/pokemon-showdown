/**
 * pokemon-showdown-custom: níveis de dificuldade da IA dos treinadores NPC.
 *
 * A dificuldade é a qualidade das escolhas da IA. Em ordem crescente; o mais
 * fácil é o bot aleatório padrão do PS. Os demais níveis serão definidos depois
 * (fase 5) e entram aqui, na posição certa da ordem.
 *
 * @license MIT
 */

export const AI_LEVELS = ['random'] as const;
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
