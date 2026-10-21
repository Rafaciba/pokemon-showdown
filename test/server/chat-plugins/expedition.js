/**
 * Testes da Expedição (modo roguelike): sorteios com semente, gerador do mapa, time e
 * fluxo da run.
 */
'use strict';

const assert = require('assert').strict;

describe('Expedition', () => {
	let random, mapModule, team, variant, store, state, runs;
	before(() => {
		random = require('../../../dist/server/chat-plugins/expedition/random');
		mapModule = require('../../../dist/server/chat-plugins/expedition/map');
		team = require('../../../dist/server/chat-plugins/expedition/team');
		variant = require('../../../dist/server/chat-plugins/expedition/variant');
		store = require('../../../dist/server/chat-plugins/expedition/store');
		state = require('../../../dist/server/chat-plugins/expedition/state');
		runs = require('../../../dist/server/chat-plugins/expedition/runs');
	});

	const MAP = {
		acts: 2, floors: 8, columns: 6, paths: 5,
		weights: { wild: 45, trainer: 30, item: 15, rest: 10 },
		fixedFloors: { 0: 'wild', [-1]: 'rest' },
		minFloor: { rest: 2, item: 1 },
		noRepeat: ['rest', 'item'],
		bossType: 'boss',
	};

	describe('map generator', () => {
		it('is deterministic for a seed and changes with the seed and the act', () => {
			const a = mapModule.generateAct('abc', 1, MAP);
			assert.deepEqual(mapModule.generateAct('abc', 1, MAP), a);
			assert.notDeepEqual(mapModule.generateAct('abd', 1, MAP), a);
			assert.notDeepEqual(mapModule.generateAct('abc', 2, MAP), a);
		});

		it('builds connected paths without crossings that end at the boss, following the node rules', () => {
			for (let i = 0; i < 40; i++) {
				const map = mapModule.generateAct(`seed${i}`, 1, MAP);
				const byId = new Map(map.nodes.map(node => [node.id, node]));
				const boss = byId.get(map.boss);
				assert.equal(boss.type, 'boss');
				assert.equal(boss.floor, MAP.floors);
				const parents = new Map();
				for (const node of map.nodes) {
					for (const next of node.next) {
						const target = byId.get(next);
						assert(target, `${node.id} -> ${next}`);
						assert.equal(target.floor, node.floor + 1, 'sobe um andar');
						if (next !== map.boss) assert(Math.abs(target.col - node.col) <= 1, 'coluna vizinha');
						parents.set(next, [...parents.get(next) || [], node]);
					}
				}
				for (const node of map.nodes) {
					if (node.id === map.boss) continue;
					assert(node.next.length > 0, `${node.id} leva a algum lugar`);
					if (node.floor > 0) assert(parents.get(node.id)?.length, `${node.id} tem como chegar`);
					if (node.floor === 0) assert.equal(node.type, 'wild');
					if (node.floor === MAP.floors - 1) assert.equal(node.type, 'rest');
					if (node.type === 'rest') assert(node.floor >= 2);
					if (node.type === 'item') assert(node.floor >= 1);
					// Descanso e item não se repetem em seguida
					for (const parent of parents.get(node.id) || []) {
						if (MAP.noRepeat.includes(node.type)) assert.notEqual(parent.type, node.type, `${parent.id} -> ${node.id}`);
					}
				}
				// Sem cruzamentos: entre dois andares, nada sobe para a direita enquanto o vizinho desce para cá
				const edges = new Set();
				for (const node of map.nodes) {
					for (const next of node.next) if (next !== map.boss) edges.add(`${node.floor}:${node.col}>${byId.get(next).col}`);
				}
				for (const edge of edges) {
					const [floor, cols] = edge.split(':');
					const [from, to] = cols.split('>').map(Number);
					if (to !== from) assert(!edges.has(`${floor}:${to}>${from}`), `cruzamento em ${edge}`);
				}
				assert(map.nodes.filter(node => node.floor === 0).length >= 2, 'pelo menos dois começos');
			}
		});

		it('lists the reachable nodes: the first floor at the start, then the connected ones', () => {
			const map = mapModule.generateAct('reach', 1, MAP);
			const first = mapModule.reachableNodes(map, null);
			assert(first.length && first.every(node => node.floor === 0));
			const next = mapModule.reachableNodes(map, first[0].id);
			assert.deepEqual(next.map(node => node.id), first[0].next);
		});
	});

	describe('team', () => {
		it('knows the last moves learned by level, like the games', () => {
			const moves = team.levelUpMoves('Bulbasaur', 5);
			assert(moves.length >= 1 && moves.length <= 4);
			assert(moves.includes('tackle'));
			assert(team.levelUpMoves('Bulbasaur', 1).every(move => moves.includes(move) || moves.length === 4));
			assert(team.levelUpMoves('Charmander', 100).length === 4);
		});

		it('creates game-like Pokémon with full HP', () => {
			const mon = team.createMon(random.seededRandom('x', 'y'), 'Chespin', 5, 'a');
			assert.equal(mon.level, 5);
			assert.equal(mon.hp, 1);
			assert.equal(mon.fainted, false);
			assert(mon.moves.length >= 1);
			assert.equal(mon.ppUsed.length, mon.moves.length);
			assert(['Overgrow'].includes(mon.ability), mon.ability);
		});
	});

	describe('variants', () => {
		it('applies only declared panel adjustments, within the limits', () => {
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const settings = variant.resolveSettings(TEST_VARIANT, { 'floors': 99, 'weight:rest': 0, 'acts': 5, 'columns': 4.4 });
			assert.equal(settings.map.floors, 15, 'limitado ao máximo');
			assert.equal(settings.map.weights.rest, 0);
			assert.equal(settings.map.columns, 4);
			assert.equal(settings.map.acts, TEST_VARIANT.map.acts, 'acts não é ajustável nesta variação');
			assert.equal(TEST_VARIANT.map.floors, 6, 'a variação não muda');
		});

		it('offers three teams of three different game starters at level 5', () => {
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const options = TEST_VARIANT.starterOptions(random.seededRandom('s', 'starters'));
			assert.equal(options.length, 3);
			const species = options.flat().map(mon => mon.species);
			assert.equal(species.length, 9);
			assert.equal(new Set(species).size, 9);
			for (const mon of options.flat()) {
				assert(team.GAME_STARTERS.includes(toID(mon.species)));
				assert.equal(mon.level, 5);
				assert.deepEqual(mon.moves, team.levelUpMoves(mon.species, 5));
			}
		});
	});

	describe('runs', () => {
		const { makeUser } = require('../../users-utils');
		let db, user;
		before(() => {
			variant.registerVariant({
				id: 'unitteste', name: () => 'Unit', description: () => 'Unit',
				rules: { battles: 'manual', progression: 'levels', attrition: 'persist', faint: 'revive', teamSize: 6 },
				map: { ...MAP, acts: 2, floors: 3 }, tunables: [],
				starterOptions: prng => [0, 1, 2].map(i => [team.createMon(prng, 'Bulbasaur', 5, `u${i}`)]),
			});
		});
		beforeEach(() => {
			db = new store.ExpeditionStore(':memory:');
			state.setStore(db);
			user = makeUser('Expedition Tester');
			user.registered = true;
		});
		afterEach(() => {
			user.destroy();
			state.setStore(null);
			db.close();
		});

		const TL = text => text.join('');

		it('plays a run: starter, map moves, rest, bosses and the win', () => {
			const run = runs.startRun(user, 'unitteste');
			assert.equal(typeof run, 'object');
			assert.equal(runs.startRun(user, 'unitteste'), 'active', 'uma run por variação');
			assert.equal(runs.runPhase(run), 'starter');
			assert.equal(runs.enterNode(run, '0-0'), 'norun', 'primeiro o time inicial');
			assert.equal(runs.chooseStarter(run, 5), 'badchoice');
			assert.equal(runs.chooseStarter(run, 1), null);
			assert.equal(run.team[0].uid, 'u1');

			for (let act = 1; act <= 2; act++) {
				const map = runs.currentMap(run);
				assert.equal(runs.enterNode(run, 'boss'), 'unreachable');
				let current = null;
				while (true) {
					const options = mapModule.reachableNodes(map, current);
					const node = options[0];
					assert.equal(runs.enterNode(run, node.id), null);
					assert.equal(runs.enterNode(run, node.id), 'nodeopen');
					const view = runs.currentNodeView(run, TL);
					if (node.type === 'rest') {
						run.team[0].hp = 0.2;
						run.team[0].fainted = true;
					}
					assert.equal(runs.chooseInNode(run, 'nope', TL), 'badchoice');
					assert.equal(runs.chooseInNode(run, view.view.choices[0].id, TL), null);
					if (node.type === 'rest') assert.deepEqual([run.team[0].hp, run.team[0].fainted], [1, false], 'o descanso cura');
					current = node.id;
					if (node.id === map.boss) break;
				}
				if (act === 1) assert.deepEqual([run.act, run.node, run.status], [2, null, 'active'], 'próximo ato');
			}
			assert.equal(run.status, 'won');
			const saved = db.getRun(run.id);
			assert.equal(saved.status, 'won');
			assert(saved.path.length > 4 && saved.path[0].startsWith('1:'));
			assert.equal(db.getActiveRun(user.id, 'unitteste'), null);
			assert.equal(typeof runs.startRun(user, 'unitteste'), 'object', 'depois de terminar, pode começar outra');
		});

		it('hides test variants from players and gives up runs', () => {
			assert.equal(runs.startRun(user, 'teste'), 'disabled', 'a variação de teste é só para administradores');
			assert.equal(runs.startRun(user, 'nope'), 'novariant');
			const run = runs.startRun(user, 'unitteste');
			runs.abandonRun(run);
			assert.equal(db.getRun(run.id).status, 'abandoned');
		});

		it('deletes and renames the player data with the account', () => {
			runs.startRun(user, 'unitteste');
			db.addUnlock(user.id, 'starter', 'pikachu');
			db.renameUser(user.id, 'newname');
			assert(db.getActiveRun('newname', 'unitteste'));
			assert(db.hasUnlock('newname', 'starter', 'pikachu'));
			db.deleteUserData('newname');
			assert.equal(db.listRuns('newname').length, 0);
			assert.equal(db.listUnlocks('newname').length, 0);
		});
	});
});
