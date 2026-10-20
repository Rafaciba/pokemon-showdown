/**
 * pokemon-showdown-custom: pesos da IA Mestre do Desafio de Ginásios.
 *
 * A Mestre joga com as regras do Difícil (heuristic-ai.ts) e com os seus próprios
 * pesos (HeuristicWeights). Por enquanto, os pesos são os padrão, e a Mestre joga
 * igual ao Difícil; o treino em batalhas simuladas (etapa 2) e o aprendizado com as
 * batalhas do servidor (etapa 4) passam a ajustá-los. Plano e decisões em
 * docs/arquitetura-desafio-ginasios.md, seção "IA Mestre".
 *
 * @license MIT
 */
import { DEFAULT_WEIGHTS, type HeuristicWeights } from './heuristic-ai';

export function masterWeights(): Readonly<HeuristicWeights> {
	return DEFAULT_WEIGHTS;
}
