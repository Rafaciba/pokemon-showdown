/**
 * pokemon-showdown-custom: sprite do jogador na run da Expedição.
 *
 * Pedido do usuário (2026-10-23): cada time inicial vem com um protagonista sorteado
 * dos jogos principais, e escolher o time escolhe também o sprite, usado nas batalhas
 * da expedição e mostrado na página da run. Nos times fixos, o admin pode fixar o
 * sprite de cada time (qualquer sprite oficial); sem escolha, é sorteado. Runs de antes
 * disso (sem sprite) usam o avatar do jogador.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import { isTrainerSprite } from '../gym-challenge/trainer-sprites';

/** Protagonistas dos jogos principais (sprites oficiais do PS, os da versão principal de cada um). */
export const PROTAGONISTS: readonly string[] = [
	'red', 'leaf-gen3', 'ethan', 'kris', 'lyra', 'brendan', 'may', 'lucas', 'dawn', 'hilbert', 'hilda', 'nate', 'rosa',
	'calem', 'serena', 'elio', 'selene', 'chase', 'elaine', 'victor', 'gloria', 'rei', 'akari', 'florian-s', 'juliana-s',
].filter(isTrainerSprite);

/**
 * Sprites dos times iniciais: o fixado pelo admin (se for um sprite oficial) ou um
 * protagonista sorteado, sem repetir entre os times.
 */
export function drawProtagonists(prng: PRNG, count: number, fixed: readonly string[] = []): string[] {
	const pool = PROTAGONISTS.filter(id => !fixed.includes(id));
	prng.shuffle(pool);
	return Array.from({ length: count }, (_, i) => (
		fixed[i] && isTrainerSprite(fixed[i]) ? fixed[i] : pool.pop() || PROTAGONISTS[0] || ''
	));
}
