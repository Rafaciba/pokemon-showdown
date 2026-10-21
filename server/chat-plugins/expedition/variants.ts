/**
 * pokemon-showdown-custom: variações programadas da Expedição.
 *
 * Variação de teste (decisões do usuário, 2026-10-21), só para provar a base e só
 * para administradores:
 *   - um ato curto: batalha selvagem, treinador, descanso, item e chefe;
 *   - batalhas jogadas pelo jogador, níveis que sobem;
 *   - HP e PP continuam entre as batalhas, e o desmaiado fica no time até um descanso;
 *   - o jogador escolhe um entre três times de três iniciais dos jogos, no nível 5,
 *     com os golpes do nível;
 *   - adversários das três fontes (Pokédex, banco do Desafio e a lista abaixo), um nó
 *     raro de lendário (10% das runs, na metade final do ato) e, às vezes, um
 *     lendário no chefe;
 *   - IA: selvagem Aleatório e depois Fácil; treinador do Fácil ao Difícil; chefe
 *     Difícil e Mestre nos três quartos finais da run (o lendário usa a Difícil);
 *   - 30 níveis por ato: com um ato só, o time chega ao chefe por volta do nível 35.
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
	rules: {
		battles: 'manual', progression: 'levels', attrition: 'persist', faint: 'revive', capture: 'choose', teamSize: 6,
	},
	map: {
		acts: 1, floors: 6, columns: 5, paths: 4,
		weights: { wild: 35, trainer: 25, event: 15, item: 10, rest: 8, shop: 7 },
		// O primeiro andar é sempre selvagem, e o último antes do chefe, sempre descanso
		fixedFloors: { 0: 'wild', [-1]: 'rest' },
		minFloor: { rest: 2, item: 1, shop: 2 },
		noRepeat: ['rest', 'item', 'shop', 'legendary'],
		// Lendário raro (decisão do usuário): não aparece em toda run; no máximo um por ato,
		// a partir do segundo ato ou, com um ato só, na metade final dele
		lateTypes: ['legendary'],
		rareNodes: { legendary: 10 },
		bossType: 'boss',
	},
	tunables: [
		{ key: 'floors', min: 3, max: 15 },
		{ key: 'columns', min: 3, max: 7 },
		{ key: 'paths', min: 2, max: 6 },
		{ key: 'weight:wild', min: 0, max: 100 },
		{ key: 'weight:trainer', min: 0, max: 100 },
		{ key: 'weight:item', min: 0, max: 100 },
		{ key: 'weight:event', min: 0, max: 100 },
		{ key: 'weight:shop', min: 0, max: 100 },
		{ key: 'weight:rest', min: 0, max: 100 },
		{ key: 'rare:legendary', min: 0, max: 100 },
		{ key: 'extra:levelsPerAct', min: 10, max: 50 },
		{ key: 'extra:bossLegendaryChance', min: 0, max: 100 },
	],
	extra: { startLevel: STARTER_LEVEL, levelsPerAct: 30, bossLegendaryChance: 20 },
	encounters: {
		wild: { pokedex: 70, pool: 30 },
		trainer: { pokedex: 50, gym: 25, pool: 25 },
		boss: { pokedex: 40, gym: 40, pool: 20 },
		legendary: { pokedex: 100 },
	},
	pool: {
		species: [
			'Pidgey', 'Rattata', 'Caterpie', 'Weedle', 'Zubat', 'Geodude', 'Oddish', 'Poliwag', 'Machop', 'Abra',
			'Magikarp', 'Eevee', 'Growlithe', 'Ponyta', 'Gastly', 'Dratini',
		],
		trainers: [
			{ name: 'Bug Catcher Rick', avatar: 'bugcatcher', species: ['Caterpie', 'Weedle', 'Venonat', 'Paras', 'Scyther'] },
			{ name: 'Hiker Anthony', avatar: 'hiker', species: ['Geodude', 'Onix', 'Machop', 'Diglett', 'Rhyhorn'] },
			{ name: 'Swimmer Luis', avatar: 'swimmer', species: ['Magikarp', 'Tentacool', 'Staryu', 'Goldeen', 'Horsea'] },
		],
	},
	aiLevel(kind, progress) {
		if (kind === 'wild') return progress < 0.5 ? 'random' : 'easy';
		if (kind === 'trainer') return progress < 1 / 3 ? 'easy' : progress < 2 / 3 ? 'medium' : 'hard';
		if (kind === 'boss') return progress < 0.75 ? 'hard' : 'master';
		return 'hard';
	},
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
