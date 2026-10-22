/**
 * pokemon-showdown-custom: níveis de dificuldade do modo Completo (etapa 9).
 *
 * Decisão do usuário (2026-10-22): cada insígnia soma um agravante, nesta ordem; o
 * jogador escolhe no começo da run um nível de 0 até o número de insígnias que tem (os
 * agravantes de 1 até o nível valem juntos):
 *   1. treinadores, elite e chefes pagam 25% a menos;
 *   2. o nó de item oferece 2 itens em vez de 3;
 *   3. a chance de PokéCenter no meio do ato cai pela metade (o fixo antes do chefe fica);
 *   4. entre os atos, o time recupera só metade do HP e do PP (sem o agravante, tudo);
 *   5. IA um nível acima em todos os adversários (até a Mestre);
 *   6. um Pokémon a mais nos treinadores e na elite (até 6);
 *   7. PokéMart 25% mais caro;
 *   8. chefes com 6 Pokémon em todos os atos, +2 níveis e IA Mestre.
 * O "+2 níveis em todos os adversários" da primeira versão saiu (decisão do usuário):
 * a cura reduzida entre atos entrou no lugar, em 4º.
 *
 * @license MIT
 */
import { AI_LEVELS, type AILevel } from '../gym-challenge/levels';
import type { RunSettings } from './variant';

export const LESS_MONEY = 1;
export const FEWER_ITEMS = 2;
export const FEWER_CENTERS = 3;
export const LESS_ACT_HEAL = 4;
export const SMARTER_AI = 5;
export const STRONGER_TRAINERS = 6;
export const PRICIER_MART = 7;
export const STRONGER_BOSSES = 8;

/** Nível de dificuldade da run (0 fora do modo Completo). */
export function difficultyLevel(settings: RunSettings) {
	return settings.complete?.level || 0;
}

/** O agravante vale na run. */
export function hasPenalty(settings: RunSettings, penalty: number) {
	return difficultyLevel(settings) >= penalty;
}

/** Nível de IA alguns degraus acima (até a Mestre). */
export function raiseAI(level: AILevel, steps = 1): AILevel {
	return AI_LEVELS[Math.min(AI_LEVELS.length - 1, AI_LEVELS.indexOf(level) + steps)];
}

/** Arredonda um valor de dinheiro para a dezena. */
export function roundMoney(value: number) {
	return Math.round(value / 10) * 10;
}
