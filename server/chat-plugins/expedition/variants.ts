/**
 * pokemon-showdown-custom: variações programadas da Expedição.
 *
 * Variação de teste (decisões do usuário, 2026-10-21), só para provar a base e só
 * para administradores:
 *   - um ato curto: batalha selvagem, treinador, descanso, item e chefe;
 *   - batalhas jogadas pelo jogador, níveis que sobem;
 *   - HP e PP continuam entre as batalhas, e o desmaiado fica no time até um descanso;
 *   - o jogador escolhe um entre três times de três iniciais dos jogos, no nível 5,
 *     com os golpes do nível.
 *
 * @license MIT
 */
import { registerVariant, type ExpeditionVariant } from './variant';
import { createMon, GAME_STARTERS } from './team';

const STARTER_LEVEL = 5;

export const TEST_VARIANT: ExpeditionVariant = {
	id: 'teste',
	name: TL => TL`Test expedition`,
	description: TL => (
		TL`A short expedition to test the mode: one act with wild Pokémon, trainers, a rest, an item and a boss.`
	),
	adminOnly: true,
	rules: { battles: 'manual', progression: 'levels', attrition: 'persist', faint: 'revive', teamSize: 6 },
	map: {
		acts: 1, floors: 6, columns: 5, paths: 4,
		weights: { wild: 45, trainer: 30, item: 15, rest: 10 },
		// O primeiro andar é sempre selvagem, e o último antes do chefe, sempre descanso
		fixedFloors: { 0: 'wild', [-1]: 'rest' },
		minFloor: { rest: 2, item: 1 },
		noRepeat: ['rest', 'item'],
		bossType: 'boss',
	},
	tunables: [
		{ key: 'floors', min: 3, max: 15 },
		{ key: 'columns', min: 3, max: 7 },
		{ key: 'paths', min: 2, max: 6 },
		{ key: 'weight:wild', min: 0, max: 100 },
		{ key: 'weight:trainer', min: 0, max: 100 },
		{ key: 'weight:item', min: 0, max: 100 },
		{ key: 'weight:rest', min: 0, max: 100 },
	],
	starterOptions(prng) {
		// 9 iniciais diferentes, em três times de três
		const pool = [...GAME_STARTERS];
		prng.shuffle(pool);
		return [0, 1, 2].map(team => pool.slice(team * 3, team * 3 + 3).map((species, i) => (
			createMon(prng, species, STARTER_LEVEL, `s${team}${i}`)
		)));
	},
};

registerVariant(TEST_VARIANT);
