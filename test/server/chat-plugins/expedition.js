/**
 * Testes da Expedição (modo roguelike): sorteios com semente, gerador do mapa, time e
 * fluxo da run.
 */
'use strict';

const assert = require('assert').strict;

describe('Expedition', () => {
	let random, mapModule, team, variant, store, state, runs, battles, progression, species;
	before(() => {
		random = require('../../../dist/server/chat-plugins/expedition/random');
		mapModule = require('../../../dist/server/chat-plugins/expedition/map');
		team = require('../../../dist/server/chat-plugins/expedition/team');
		variant = require('../../../dist/server/chat-plugins/expedition/variant');
		store = require('../../../dist/server/chat-plugins/expedition/store');
		state = require('../../../dist/server/chat-plugins/expedition/state');
		runs = require('../../../dist/server/chat-plugins/expedition/runs');
		battles = require('../../../dist/server/chat-plugins/expedition/battles');
		progression = require('../../../dist/server/chat-plugins/expedition/progression');
		species = require('../../../dist/server/chat-plugins/expedition/species');
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

		it('keeps late types for the second act on, or the second half of a single act, at most once per act', () => {
			const late = { ...MAP, weights: { ...MAP.weights, legendary: 60 }, lateTypes: ['legendary'], maxPerAct: { legendary: 1 } };
			for (let i = 0; i < 30; i++) {
				assert(!mapModule.generateAct(`late${i}`, 1, late).nodes.some(node => node.type === 'legendary'), 'ato 1 de 2');
				assert(mapModule.generateAct(`late${i}`, 2, late).nodes.filter(node => node.type === 'legendary').length <= 1);
				const single = mapModule.generateAct(`late${i}`, 1, { ...late, acts: 1 });
				const legendaries = single.nodes.filter(node => node.type === 'legendary');
				assert(legendaries.length <= 1);
				assert(legendaries.every(node => node.floor >= MAP.floors / 2), 'metade final do ato');
			}
		});

		it('places a rare node only in some acts, at most one, in the allowed floors', () => {
			const single = { ...MAP, acts: 1, lateTypes: ['legendary'], rareNodes: { legendary: 25 } };
			let acts = 0;
			for (let i = 0; i < 400; i++) {
				const legendaries = mapModule.generateAct(`rare${i}`, 1, single).nodes.filter(node => node.type === 'legendary');
				assert(legendaries.length <= 1);
				assert(legendaries.every(node => node.floor >= MAP.floors / 2 && node.floor < MAP.floors - 1));
				if (legendaries.length) acts++;
			}
			assert(acts > 60 && acts < 140, `${acts} de 400 com lendário (25%)`);
			const always = mapModule.generateAct('rare', 1, { ...single, rareNodes: { legendary: 100 } });
			assert.equal(always.nodes.filter(node => node.type === 'legendary').length, 1);
			const never = mapModule.generateAct('rare', 1, { ...single, rareNodes: { legendary: 0 } });
			assert.equal(never.nodes.filter(node => node.type === 'legendary').length, 0);
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

	describe('expeditions created by the admin', () => {
		let definition;
		before(() => {
			definition = require('../../../dist/server/chat-plugins/expedition/definition');
		});

		it('normalizes any definition to valid values', () => {
			const def = definition.normalizeDefinition({
				mode: 'hack', startLevel: 999, weights: { wild: -5, trainer: 'x' }, starters: { size: 7, teams: 'no' },
				ai: { boss: ['master', 'nope'] }, bosses: { acts: [3, 'pool', -1, {}] }, theme: { gens: [1, 1, 12, '3'] },
			});
			assert.equal(def.mode, 'standard');
			assert.equal(def.startLevel, 90);
			assert.equal(def.weights.wild, 0);
			assert.equal(def.weights.trainer, definition.DEFAULT_DEFINITION.weights.trainer);
			assert.equal(def.starters.size, 3);
			assert.deepEqual(def.starters.teams, [[], [], []]);
			assert.deepEqual(def.ai.boss.slice(0, 2), ['master', 'hard']);
			assert.deepEqual(def.bosses.acts, [3, 'pool', 'generated', 'generated']);
			assert.deepEqual(def.theme.gens, [1]);
			assert.deepEqual(definition.normalizeDefinition(null), definition.DEFAULT_DEFINITION);
		});

		it('turns a definition into a variant with the decided map and levels', () => {
			const def = definition.normalizeDefinition({});
			const built = definition.variantFromDefinition({ id: 7, name: 'A <b>', status: 'open', definition: def });
			assert.equal(built.id, '7');
			assert.equal(built.name(), 'A &lt;b&gt;', 'nome escapado');
			assert.equal(built.map.acts, 3, 'Completo: 3 atos com mapa');
			assert.equal(built.map.floors, 14, '15 andares com o chefe');
			assert.equal(built.map.fixedFloors[-1], 'rest');
			assert.equal(built.map.weights.trainer, 15);
			assert.equal(built.map.weights.elite, 5);
			assert.equal(built.aiLevel('elite', 0.5, 2), 'hard', 'a elite joga um nível acima dos treinadores');
			assert.equal(built.aiLevel('elite', 1, 4), 'master');
			const settings = variant.resolveSettings(built);
			assert.equal(progression.curveLevel(settings, 3, settings.map.floors), 95, 'o chefe final no teto');
			assert.equal(built.aiLevel('trainer', 0.5, 2), 'medium');
			assert.equal(built.aiLevel('boss', 1, 4), 'hard');
			const custom = definition.variantFromDefinition({
				id: 8, name: 'B', status: 'draft', definition: definition.normalizeDefinition({ acts: { mode: 'custom', count: 2 }, levelCap: 45 }),
			});
			assert.equal(custom.map.acts, 2);
			assert.equal(progression.curveLevel(variant.resolveSettings(custom), 2, 14), 45);
		});

		it('draws starting teams with a different regional starter in each', () => {
			for (let i = 0; i < 20; i++) {
				const def = definition.normalizeDefinition({ starters: { size: 2, pool: [] }, theme: { gens: [1, 2] } });
				const teams = definition.drawStarterTeams(random.seededRandom(`st${i}`, 'x'), def);
				assert.equal(teams.length, 3);
				const leads = teams.map(entry => toID(entry[0]));
				assert.equal(new Set(leads).size, 3);
				for (const entry of teams) {
					assert.equal(entry.length, 2);
					assert(entry.some(name => team.GAME_STARTERS.includes(toID(name))));
					for (const name of entry) assert(Dex.species.get(name).gen <= 2, 'iniciais do tema');
				}
				assert.equal(new Set(teams.flat()).size, 6, 'sem repetir espécie');
			}
			const fixed = definition.normalizeDefinition({
				starters: { mode: 'fixed', size: 2, teams: [['Charmander', 'Rattata'], ['Squirtle', 'Pidgey'], ['Bulbasaur', 'Zubat']] },
			});
			const built = definition.variantFromDefinition({ id: 9, name: 'C', status: 'open', definition: fixed });
			const options = built.starterOptions(random.seededRandom('f', 'x'), variant.resolveSettings(built));
			assert.deepEqual(options.map(entry => entry.map(mon => mon.species)), fixed.starters.teams);
			assert(options.flat().every(mon => mon.level === 5));
		});

		it('keeps encounters and evolutions inside the theme', () => {
			const kanto = { gens: [1], species: [] };
			assert(species.basicSpecies(kanto).every(name => Dex.species.get(name).gen === 1));
			assert(species.basicSpecies(kanto).includes('Pikachu'), 'sem Pichu, o Pikachu é a básica');
			assert(!species.levelEvolutions('Golbat', kanto).length, 'Crobat é da gen 2');
			assert.equal(species.evolveForLevel(random.seededRandom('t', 'x'), 'Zubat', 60, kanto), 'Golbat');
			assert(species.legendarySpecies(kanto).every(name => Dex.species.get(name).gen === 1));
			const list = { gens: [], species: ['Charmeleon', 'Eevee'] };
			const allowed = species.themeSpecies(list);
			assert(allowed.has('charmander') && allowed.has('charizard'), 'a linha evolutiva inteira');
			assert(allowed.has('sylveon') && !allowed.has('pikachu'));
			assert.equal(species.themeSpecies({ gens: [], species: [] }), null, 'sem tema = a Pokédex inteira');
		});

		it('lists what blocks opening an expedition', () => {
			const trainers = new Map([[5, { id: 5, name: 'Brock', type: 'Rock', doubles: false, hasTeam: true }]]);
			const messages = def => definition.definitionProblems(def, trainers).map(p => p.message);
			const ready = definition.normalizeDefinition({ badges: { mode: 'random', ids: definition.drawBadges(random.seededRandom('b', 'x')) } });
			assert.deepEqual(messages(ready), []);
			assert(messages(definition.normalizeDefinition({})).some(m => m.includes('badges')), 'Completo sem insígnias');
			const custom = { acts: { mode: 'custom', count: 1 } };
			assert(messages(definition.normalizeDefinition({ ...custom, starters: { pool: ['Charizard', 'Bulbasaur'] } }))
				.some(m => m.includes('regional starters')));
			assert(messages(definition.normalizeDefinition({
				...custom, starters: { size: 1, pool: ['Charmander', 'Squirtle', 'Bulbasaur', 'Dragonite'] },
			})).some(m => m.includes('Too strong')));
			assert(messages(definition.normalizeDefinition({ ...custom, bosses: { acts: [99] } })).some(m => m.includes('Trainer #')));
			assert(messages(definition.normalizeDefinition({ ...custom, bosses: { acts: ['pool'] } })).some(m => m.includes('drawn')));
			assert(messages(definition.normalizeDefinition({ ...custom, format: { base: 'gen1ou', rules: '' } }))
				.some(m => m.includes('generation 3')));
			assert(messages(definition.normalizeDefinition({ ...custom, theme: { gens: [], species: ['Bulbasaur'] } }))
				.some(m => m.includes('too few')));
			assert(messages(definition.normalizeDefinition({ ...custom, starters: { mode: 'fixed', size: 1, teams: [['Charmander'], ['Charmander'], ['Pidgey']] } }))
				.some(m => m.includes('regional starter')));
		});

		it('follows the map rules of the Slay the Spire', () => {
			const built = definition.variantFromDefinition({ id: 1, name: 'M', status: 'open', definition: definition.normalizeDefinition({}) });
			let forks = 0;
			let distinct = 0;
			for (let i = 0; i < 60; i++) {
				const map = mapModule.generateAct(`sts${i}`, 1, built.map);
				const byId = new Map(map.nodes.map(node => [node.id, node]));
				for (const node of map.nodes) {
					if (node.id === map.boss) continue;
					if (node.floor === 0) assert.equal(node.type, 'wild');
					if (node.floor === 7) assert.equal(node.type, 'item');
					if (node.floor === 13) assert.equal(node.type, 'rest');
					if (node.floor === 12) assert.notEqual(node.type, 'rest', 'sem PokéCenter no andar 13');
					if (node.floor < 5) assert(!['rest', 'elite'].includes(node.type), 'nada de PokéCenter e elite antes do andar 6');
					const kids = node.next.filter(id => id !== map.boss).map(id => byId.get(id));
					for (const kid of kids) {
						if (['rest', 'elite', 'shop'].includes(kid.type)) assert.notEqual(kid.type, node.type, 'sem repetir em seguida');
					}
					// Bifurcações fora dos andares fixos: tipos diferentes
					if (kids.length > 1 && ![0, 7, 13].includes(kids[0].floor)) {
						forks++;
						if (new Set(kids.map(kid => kid.type)).size === kids.length) distinct++;
					}
				}
			}
			assert(distinct / forks > 0.95, `bifurcações com tipos diferentes: ${distinct}/${forks}`);
		});

		it('sizes the teams of bosses by act and of elites above the trainers', () => {
			const prng = random.seededRandom('size', 'x');
			for (let i = 0; i < 20; i++) assert([3, 4].includes(progression.opponentTeamSize('boss', 0.3, prng, 1)));
			assert.equal(progression.opponentTeamSize('boss', 0.6, prng, 2), 5);
			assert.equal(progression.opponentTeamSize('boss', 1, prng, 3), 6);
			assert.equal(progression.opponentTeamSize('boss', 1, prng, 4), 6);
			const trainer = progression.opponentTeamSize('trainer', 0.5, random.seededRandom('t', 'x'));
			assert.equal(progression.opponentTeamSize('elite', 0.5, random.seededRandom('t', 'x')), trainer + 1);
		});

		it('adjusts bank trainers to the level of the act', () => {
			const bank = require('../../../dist/server/chat-plugins/expedition/bank');
			assert.equal(bank.stageForLevel('Dragonite', 35), 'Dragonair');
			assert.equal(bank.stageForLevel('Dragonite', 20), 'Dratini');
			assert.equal(bank.stageForLevel('Dragonite', 60), 'Dragonite');
			assert.equal(bank.stageForLevel('Alakazam', 20), 'Kadabra', 'troca: 16 + 16 = 32');
			assert(bank.canLearn('Charmander', 'flamethrower'));
			assert(!bank.canLearn('Charmander', 'surf'));
			const set = {
				name: 'Charizard', species: 'Charizard', item: 'Charizardite X', ability: 'Solar Power',
				moves: ['Flare Blitz', 'Dragon Dance', 'Air Slash', 'Roost'], nature: 'Jolly', evs: { atk: 252 }, ivs: {}, level: 100,
			};
			const adjusted = bank.adjustSet(set, 20);
			assert.equal(adjusted.species, 'Charmeleon');
			assert.equal(adjusted.level, 20);
			assert.equal(adjusted.item, '', 'a Mega Stone não serve à pré-evolução');
			assert.equal(adjusted.ability, 'Solar Power');
			assert(adjusted.moves.includes('Flare Blitz') && adjusted.moves.includes('Dragon Dance'));
			assert(!adjusted.moves.includes('Air Slash') && !adjusted.moves.includes('Roost'), 'golpes que o Charmeleon não aprende saem');
			assert.equal(adjusted.moves.length, 4, 'completado com os golpes do nível');
			assert.equal(adjusted.nature, 'Jolly');
			assert.equal(bank.adjustSet(set, 20, { gens: [2], species: [] }), null, 'fora do tema');
			const { Teams } = require('../../../dist/sim/teams');
			const trainer = {
				name: 'Lance', title: 'Champion', type: 'Dragon', avatar: 'lance',
				team: Teams.pack([set, { ...set, name: 'Dragonite', species: 'Dragonite', item: 'Leftovers', ability: 'Multiscale',
					moves: ['Dragon Dance', 'Outrage', 'Extreme Speed', 'Roost'] }]),
			};
			const boss = bank.bankBoss(random.seededRandom('boss', 'x'), trainer, 4, 35, null);
			assert.equal(boss.name, 'Champion Lance');
			assert.equal(boss.team.length, 4, 'completado no tamanho do ato');
			assert.equal(boss.team[0].species, 'Charmeleon', 'o Charizard evolui no 36');
			assert.equal(boss.team[1].species, 'Dragonair');
			assert(boss.team.slice(2).every(mon => Dex.species.get(mon.species).types.includes('Dragon')), 'do tipo do treinador');
			assert.equal(Teams.unpack(boss.packed).length, 4);
		});

		it('draws 8 badges of different types and knows the league sets', () => {
			const ids = definition.drawBadges(random.seededRandom('badges', 'x'));
			assert.equal(ids.length, 8);
			const { BADGES } = require('../../../dist/server/chat-plugins/gym-challenge/badge-catalog');
			assert.equal(new Set(ids.map(id => BADGES.find(badge => badge.id === id).type)).size, 8);
			assert(definition.badgeLeagues().some(league => league.region === 'Kanto'));
		});

		it('stores expeditions, with the test expedition as a draft, and reads the admin forms', () => {
			const db = new store.ExpeditionStore(':memory:');
			state.setStore(db);
			try {
				const [test] = db.listExpeditions();
				assert.equal(test.name, 'Expedição de teste');
				assert.equal(test.status, 'draft');
				const id = db.createExpedition('Kanto', definition.normalizeDefinition({}));
				const built = variant.getVariant(String(id));
				assert.equal(built.status, 'draft');
				const { makeUser } = require('../../users-utils');
				const player = makeUser('Expedition Player');
				assert.equal(runs.variantAvailable(built, player), false, 'rascunho: só administradores');
				db.setExpeditionStatus(id, 'open');
				state.invalidateExpeditions();
				assert.equal(runs.variantAvailable(variant.getVariant(String(id)), player), true);
				db.setExpeditionStatus(id, 'closed');
				state.invalidateExpeditions();
				assert.equal(runs.variantAvailable(variant.getVariant(String(id)), player), false);
				player.destroy();
				assert.equal(db.deleteDraftExpedition(id), false, 'só rascunhos');
				assert.equal(db.deleteDraftExpedition(test.id), true);
				const admin = require('../../../dist/server/chat-plugins/expedition/admin');
				assert.deepEqual(admin.parseFields('name=A, b,desc=x=y,gena=on,genb='), { name: 'A, b', desc: 'x=y', gena: 'on', genb: '' });
			} finally {
				state.setStore(null);
				db.close();
			}
		});
	});

	describe('variants', () => {
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

	describe('progression', () => {
		it('picks the stage by level, with special evolutions at their own level for NPCs', () => {
			const prng = random.seededRandom('stage', 'test');
			assert.equal(species.evolveForLevel(prng, 'Abra', 15), 'Abra');
			assert.equal(species.evolveForLevel(prng, 'Abra', 16), 'Kadabra');
			assert.equal(species.evolveForLevel(prng, 'Abra', 31), 'Kadabra', 'troca: 16 + 16 = 32');
			assert.equal(species.evolveForLevel(prng, 'Abra', 32), 'Alakazam');
			assert.equal(species.evolveForLevel(prng, 'Eevee', 29), 'Eevee', 'mínimo de 30');
			assert.notEqual(species.evolveForLevel(prng, 'Eevee', 30), 'Eevee');
			assert.equal(species.evolveForLevel(prng, 'Pichu', 45), 'Pikachu', 'amizade no 30, pedra no 30 + 16');
			assert.equal(species.evolveForLevel(prng, 'Pichu', 46).startsWith('Raichu'), true);
		});

		it('draws opponents within the strength cap of their level', () => {
			const prng = random.seededRandom('cap', 'test');
			assert.equal(species.maxBstForLevel(5), 330);
			assert.equal(species.maxBstForLevel(20), 400);
			for (let i = 0; i < 200; i++) {
				const name = species.randomSpeciesForLevel(prng, 20);
				assert(species.baseStatTotal(name) <= 400, `${name} no nível 20`);
			}
			// Gyarados (540) no nível 20 fica de fora; sem teto, a linha do Magikarp chega a ele
			assert(species.baseStatTotal('Gyarados') > species.maxBstForLevel(20));
			assert.equal(species.randomSpeciesForLevel(prng, 20, ['Magikarp'], null), 'Gyarados');
		});

		it('builds tooltips with the stats at the level and the move descriptions in the player language', () => {
			const tooltips = require('../../../dist/server/chat-plugins/expedition/tooltips');
			const prng = random.seededRandom('tip', 'test');
			const mon = { ...team.createMon(prng, 'Bulbasaur', 5, 'a'), nature: 'Adamant' };
			mon.ivs = { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 };
			const stats = tooltips.monStats(mon);
			assert.equal(stats.hp, 21);
			assert.equal(stats.atk, Math.floor((Math.floor((2 * 49 + 31) * 5 / 100) + 5) * 1.1), 'natureza Adamant: +Atk');
			assert.equal(stats.spa, Math.floor((Math.floor((2 * 65 + 31) * 5 / 100) + 5) * 0.9), 'natureza Adamant: -SpA');
			assert.equal(tooltips.maxPP('tackle'), 56);
			assert.notEqual(tooltips.moveDescription('absorb', 'pt'), tooltips.moveDescription('absorb', 'en'));
			const html = tooltips.withTip('X', tooltips.monTooltip((strings, ...values) => String.raw({ raw: strings }, ...values), 'en', mon));
			assert(html.startsWith('<span class="exp-tip">X<span class="exp-tip-body">'));
			assert(html.includes('Adamant') && html.includes('Tackle'));
		});

		it('offers Mega Stones the team can use when there are any', () => {
			const items = require('../../../dist/server/chat-plugins/expedition/items');
			assert(items.megaStones().length > 40);
			const prng = random.seededRandom('mega', 'test');
			const charmander = team.createMon(prng, 'Charmander', 5, 'a');
			for (let i = 0; i < 10; i++) {
				assert(['Charizardite X', 'Charizardite Y'].includes(items.pickMegaStone(prng, [charmander])));
			}
		});

		it('keeps legendaries apart from the regular pool', () => {
			assert(species.legendarySpecies().includes('Mewtwo'));
			assert(!species.basicSpecies().includes('Mewtwo'));
			assert(species.basicSpecies().includes('Bulbasaur'));
			assert(!species.basicSpecies().includes('Ivysaur'), 'só espécies básicas');
			assert(!species.basicSpecies().some(name => name.includes('-Mega') || name.includes('-Gmax')));
		});

		it('levels the team with experience, learns moves with room and queues the decisions', () => {
			const prng = random.seededRandom('xp', 'test');
			const bulba = team.createMon(prng, 'Bulbasaur', 5, 'a');
			const fainted = { ...team.createMon(prng, 'Squirtle', 5, 'b'), fainted: true, hp: 0 };
			const { decisions, gains } = progression.gainExperience([bulba, fainted], [{ species: 'Onix', level: 20 }], true, 10);
			assert.equal(gains.length, 2);
			assert.equal(gains[0].to, bulba.level);
			assert(bulba.level > 5, `${bulba.level}`);
			// Modo padrão: quem desmaiou ganha metade
			assert.equal(gains[1].exp, Math.floor(gains[0].exp * progression.FAINTED_EXP_SHARE), 'desmaiado ganha metade');
			assert(fainted.level > 5 && fainted.level < bulba.level, `${fainted.level}`);
			assert(bulba.moves.length === 4);
			assert(decisions.every(decision => decision.uid === 'a' || decision.uid === 'b'));
			if (bulba.level >= 16) assert(decisions.some(decision => decision.kind === 'evolve' && decision.into === 'Ivysaur'));
			progression.evolveMon(bulba, 'Ivysaur');
			assert.equal(bulba.species, 'Ivysaur');
			assert.equal(bulba.ability, 'Overgrow');
		});

		it('gives a smaller Nuzlocke team a little more experience', () => {
			assert.equal(progression.nuzlockeBonus(6, 6), 1);
			assert.equal(progression.nuzlockeBonus(1, 6), 1.5);
			assert(progression.nuzlockeBonus(3, 6) > 1 && progression.nuzlockeBonus(3, 6) < progression.nuzlockeBonus(2, 6));
		});

		it('follows the level curve per act and calibrates the experience to it', () => {
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const settings = variant.resolveSettings(TEST_VARIANT);
			const { multiplier, boss } = progression.expRates(settings);
			assert(multiplier > 0);
			assert.equal(boss, 1, 'um ato só: o chefe não tem saída');
			assert.equal(progression.nodeProgress(settings, 1, 0), 0);
			assert.equal(progression.nodeProgress(settings, 1, settings.map.floors), 1);
			// 30 níveis por ato: um ato só termina por volta do 35; o terceiro ato, do 95
			assert.equal(progression.curveLevel(settings, 1, 0), 5);
			assert.equal(progression.curveLevel(settings, 1, settings.map.floors), 35);
			assert.equal(progression.curveLevel({ ...settings, map: { ...settings.map, acts: 3 } }, 3, settings.map.floors), 95);
			assert.equal(progression.curveLevel(settings, 5, settings.map.floors), 100, 'até o 100');
			const longer = { ...settings, map: { ...settings.map, floors: 20 } };
			assert(progression.expRates(longer).multiplier < multiplier, 'mais andares, menos experiência por batalha');
			const threeActs = { ...settings, map: { ...settings.map, acts: 3 } };
			const rates = progression.expRates(threeActs);
			assert(rates.boss > 0 && rates.boss < 1, `peso do chefe ${rates.boss}`);
		});
	});

	describe('runs', () => {
		const { makeUser } = require('../../users-utils');
		let db, user;
		before(() => {
			variant.registerVariant({
				id: 'unitteste', name: () => 'Unit', description: () => 'Unit', status: 'open',
				rules: { battles: 'manual', progression: 'levels', attrition: 'persist', faint: 'revive', teamSize: 6 },
				map: { ...MAP, acts: 2, floors: 3, weights: { rest: 50, item: 50 }, fixedFloors: {} },
				encounters: { wild: { pokedex: 100 }, trainer: { pokedex: 100 }, boss: { pokedex: 100 } },
				aiLevel: () => 'random',
				unlocks: [{ when: 'win', kind: 'starter', ref: 'pikachu' }],
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
					assert.equal(runs.chooseInNode(run, 'nope', TL, user), 'badchoice');
					if (node.id === map.boss) {
						// Batalha: a vitória termina o nó (sem sala: o resultado é aplicado direto)
						const battle = db.createBattle(run.id, run.act, node.id, run.team.map(mon => mon.uid));
						battles.finishExpeditionBattle(battle.id, 'win', [{ index: 0, hp: 0.5, ppUsed: [1], fainted: false }]);
						Object.assign(run, db.getRun(run.id));
						for (let guard = 0; guard < 200 && run.decisions.length; guard++) {
							if (run.decisions[0].kind === 'learn') runs.decideLearn(run, null);
							else runs.decideEvolve(run, null);
						}
						current = node.id;
						break;
					}
					assert.equal(runs.chooseInNode(run, view.view.choices[0].id, TL, user), null);
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
			assert(db.hasUnlock(user.id, 'starter', 'pikachu', 'unitteste'), 'vencer dá o desbloqueio da variação');
			assert.equal(typeof runs.startRun(user, 'unitteste'), 'object', 'depois de terminar, pode começar outra');
		});

		it('keeps one active run per variant when renaming, and blocks renames with interrupted battles', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			// O nome novo já tem uma run ativa na mesma variação (dados ainda não limpos)
			const other = db.createRun({ userid: 'novonome', variant: 'unitteste', seed: 'x', settings: run.settings, pending: null });
			db.renameUser(user.id, 'novonome');
			assert.equal(db.getRun(run.id).status, 'closed');
			assert.equal(db.getRun(run.id).userid, 'novonome');
			assert.equal(db.getActiveRun('novonome', 'unitteste').id, other.id);
			// Batalha interrompida bloqueia a troca de nome
			const { accountRenameBlockers } = require('../../../dist/server/chat-plugins/custom-accounts');
			const live = db.createRun({ userid: 'bloqueado', variant: 'unitteste', seed: 'y', settings: run.settings, pending: null });
			assert(!accountRenameBlockers.some(blocked => blocked('bloqueado')));
			db.createBattle(live.id, 1, '0-0', []);
			assert(accountRenameBlockers.some(blocked => blocked('bloqueado')));
		});

		it('never gives the NPC the same id as the player (the result comes from the winner id)', async function () {
			this.timeout(30000);
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.node = '0-0';
			run.variant = 'teste';
			db.saveRun(run);
			const encounter = require('../../../dist/server/chat-plugins/expedition/encounters');
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const original = encounter.generateEncounter;
			battles.setEncounterOverride(() => ({
				...original(run, TEST_VARIANT, { id: '0-0', floor: 0, col: 0, type: 'wild', next: [] }), name: user.name,
			}));
			let room = null;
			try {
				assert(battles.startOrResumeBattle(user, run));
				const battleId = db.getOpenBattle(run).id;
				room = Rooms.get(db.getBattle(battleId).roomid);
				assert.equal(room.battle.p2.name, `${user.name} (NPC)`);
				room.battle.forfeit(user);
				for (let i = 0; i < 800 && !db.getBattle(battleId).result; i++) {
					await new Promise(resolve => { setTimeout(resolve, 10); });
				}
				assert.equal(db.getBattle(battleId).result, 'loss', 'a derrota não vira vitória');
			} finally {
				battles.setEncounterOverride(null);
				room?.destroy();
			}
		});

		it('limits how many expeditions a player starts in a short time', () => {
			for (let i = 0; i < runs.RUN_START_LIMIT; i++) {
				const run = runs.startRun(user, 'unitteste');
				assert.equal(typeof run, 'object', `run ${i + 1}`);
				runs.abandonRun(user, run);
			}
			assert.equal(runs.startRun(user, 'unitteste'), 'toomany');
		});

		it('closes runs from the panel and shows them in the profile', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			assert.deepEqual(db.listAllRuns(true).map(entry => entry.id), [run.id]);
			assert.equal(runs.closeRunByAdmin(run.id).status, 'closed');
			assert.equal(runs.closeRunByAdmin(run.id), null, 'só runs em andamento');
			assert.deepEqual(db.listAllRuns(true), []);
			assert.equal(db.listAllRuns(false)[0].status, 'closed');

			db.addUnlock(user.id, 'starter', 'pikachu');
			const { expeditionProfile } = require('../../../dist/server/chat-plugins/expedition/profile');
			const html = expeditionProfile(text => text.join(''), user.id);
			assert(html.includes('Pikachu'), 'desbloqueios no perfil');
			assert(/<td>1<\/td>/.test(html), 'placar por variação');
		});

		it('generates the same encounter for a node, following the variant rules', () => {
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const encounters = require('../../../dist/server/chat-plugins/expedition/encounters');
			const run = { seed: 'enc', act: 1, settings: variant.resolveSettings(TEST_VARIANT) };
			const at = (type, floor) => ({ id: `${floor}-0`, floor, col: 0, type, next: [] });
			const wild = encounters.generateEncounter(run, TEST_VARIANT, at('wild', 0));
			assert.deepEqual(encounters.generateEncounter(run, TEST_VARIANT, at('wild', 0)), wild);
			assert.equal(wild.team.length, 1);
			assert.equal(wild.aiLevel, 'random');
			assert(wild.team[0].level <= 6);
			const boss = encounters.generateEncounter(run, TEST_VARIANT, { ...at('boss', 14), id: 'boss' });
			assert.equal(boss.team.length >= 1, true);
			assert.equal(boss.aiLevel, 'medium', 'IA do chefe do ato 1');
			assert(boss.trainer);
			for (let i = 0; i < 30; i++) {
				const trainer = encounters.generateEncounter({ ...run, seed: `t${i}` }, TEST_VARIANT, at('trainer', 3));
				assert(trainer.team.length >= 1 && trainer.team.length <= 5);
				assert(!trainer.team.some(mon => species.isLegendary(Dex.species.get(mon.species))), 'treinador sem lendários');
			}
			const legendary = encounters.generateEncounter(run, TEST_VARIANT, at('legendary', 3));
			assert(species.isLegendary(Dex.species.get(legendary.team[0].species)) ||
				species.legendarySpecies().includes(Dex.species.get(legendary.team[0].species).baseSpecies));
			assert(Teams.unpack(boss.packed).length === boss.team.length);
		});

		it('ends the run on a defeat, and applies the battle state on a win', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.node = '0-0';
			db.saveRun(run);
			const battle = db.createBattle(run.id, run.act, '0-0', [run.team[0].uid]);
			battles.finishExpeditionBattle(battle.id, 'loss', [{ index: 0, hp: 0, ppUsed: [3], fainted: true }]);
			const lost = db.getRun(run.id);
			assert.equal(lost.status, 'lost');
			assert.equal(lost.team[0].fainted, true);
			assert.equal(lost.lastBattle.result, 'loss', 'resumo da derrota');
			assert.equal(db.getBattle(battle.id).result, 'loss');
			battles.finishExpeditionBattle(battle.id, 'win');
			assert.equal(db.getRun(run.id).status, 'lost', 'o resultado só conta uma vez');
		});

		it('resolves move and evolution decisions', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			const mon = run.team[0];
			mon.moves = ['tackle', 'growl', 'vinewhip', 'leechseed'];
			run.decisions = [{ kind: 'learn', uid: mon.uid, move: 'razorleaf' }, { kind: 'evolve', uid: mon.uid, into: 'Ivysaur' }];
			db.saveRun(run);
			assert.equal(runs.runPhase(run), 'decision');
			assert.equal(runs.enterNode(run, '0-0'), 'decisions', 'o mapa espera as decisões');
			assert.equal(runs.decideEvolve(run, 'ivysaur'), 'nodecision', 'uma de cada vez');
			assert.equal(runs.decideLearn(run, 7), 'badchoice');
			assert.equal(runs.decideLearn(run, 1), null);
			assert.deepEqual(mon.moves, ['tackle', 'razorleaf', 'vinewhip', 'leechseed']);
			assert.equal(runs.decideEvolve(run, 'venusaur'), 'badchoice');
			assert.equal(runs.decideEvolve(run, 'ivysaur'), null);
			assert.equal(mon.species, 'Ivysaur');
			assert.equal(runs.runPhase(run), 'map');
		});

		it('starts a real battle with the team state, and a forfeit ends the run', async function () {
			this.timeout(30000);
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.team[0].hp = 0.5;
			run.team[0].ppUsed = run.team[0].moves.map(() => 2);
			run.team[0].status = 'par';
			run.team[0].item = 'Leftovers';
			run.node = '0-0';
			db.saveRun(run);
			// Os formatos saem das variações carregadas com o servidor: a batalha usa o da variação de teste
			run.variant = 'teste';
			// O nó do teste não é de batalha: o encontro vem de um selvagem forçado
			const encounter = require('../../../dist/server/chat-plugins/expedition/encounters');
			const original = encounter.generateEncounter;
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			battles.setEncounterOverride(() => original(run, TEST_VARIANT, { id: '0-0', floor: 0, col: 0, type: 'wild', next: [] }));
			const room = (() => {
				assert(battles.startOrResumeBattle(user, run));
				return Rooms.get(db.getOpenBattle(run).roomid);
			})();
			try {
				const waitFor = async check => {
					for (let i = 0; i < 800 && !check(); i++) await new Promise(resolve => { setTimeout(resolve, 10); });
					assert(check(), 'tempo esgotado');
				};
				await waitFor(() => room.battle.p1.request.request);
				const request = JSON.parse(room.battle.p1.request.request);
				const [current, max] = request.side.pokemon[0].condition.split(' ')[0].split('/').map(Number);
				assert(Math.abs(current - max * 0.5) <= 1, `HP aplicado: ${current}/${max}`);
				assert(request.side.pokemon[0].condition.endsWith(' par'), `status aplicado: ${request.side.pokemon[0].condition}`);
				room.battle.forfeit(user);
				await waitFor(() => db.getRun(run.id).status !== 'active');
				const ended = db.getRun(run.id);
				assert.equal(ended.status, 'lost');
				// O estado final voltou do simulador (linha privada do formato): HP e PP como entraram
				assert(Math.abs(ended.team[0].hp - current / max) < 0.001, `HP de volta: ${ended.team[0].hp}`);
				assert.deepEqual(ended.team[0].ppUsed, run.team[0].moves.map(() => 2));
				assert.equal(ended.team[0].status, 'par', 'o status continua');
				assert.equal(ended.team[0].item, 'Leftovers', 'item não gasto continua');
			} finally {
				battles.setEncounterOverride(null);
				room?.destroy();
			}
		});

		it('plays automatic battles to the end, with the computer playing for the player', async function () {
			this.timeout(60000);
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.node = '0-0';
			db.saveRun(run);
			run.variant = 'teste';
			run.settings.rules.battles = 'auto';
			const encounter = require('../../../dist/server/chat-plugins/expedition/encounters');
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const original = encounter.generateEncounter;
			battles.setEncounterOverride(() => original(run, TEST_VARIANT, { id: '0-0', floor: 0, col: 0, type: 'wild', next: [] }));
			let room = null;
			try {
				assert(battles.startOrResumeBattle(user, run));
				const battleId = db.getOpenBattle(run).id;
				room = Rooms.get(db.getBattle(battleId).roomid);
				// Nenhuma jogada do usuário: só as IAs
				for (let i = 0; i < 5000 && !db.getBattle(battleId).result; i++) {
					await new Promise(resolve => { setTimeout(resolve, 10); });
				}
				assert(db.getBattle(battleId).result, 'a batalha automática terminou');
			} finally {
				battles.setEncounterOverride(null);
				room?.destroy();
			}
		});

		it('offers the defeated wild Pokémon, keeps the status and loses used items', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.settings.rules.capture = 'choose';
			run.team[0].item = 'Sitrus Berry';
			run.node = '0-0';
			db.saveRun(run);
			// As configurações da run só são gravadas na criação
			db.db.prepare('UPDATE runs SET settings = ? WHERE id = ?').run(JSON.stringify(run.settings), run.id);
			const encounter = require('../../../dist/server/chat-plugins/expedition/encounters');
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const original = encounter.generateEncounter;
			battles.setEncounterOverride(() => original(run, TEST_VARIANT, { id: '0-0', floor: 0, col: 0, type: 'wild', next: [] }));
			try {
				const battle = db.createBattle(run.id, run.act, '0-0', [run.team[0].uid]);
				battles.finishExpeditionBattle(battle.id, 'win', [
					{ index: 0, hp: 0.4, ppUsed: [1], fainted: false, status: 'brn', itemUsed: true },
				]);
			} finally {
				battles.setEncounterOverride(null);
			}
			const after = db.getRun(run.id);
			assert.equal(after.team[0].status, 'brn');
			assert.equal(after.team[0].item, '', 'berry comida se perde');
			const capture = after.decisions[after.decisions.length - 1];
			assert.equal(capture.kind, 'capture');
			while (after.decisions[0].kind !== 'capture') {
				if (after.decisions[0].kind === 'learn') runs.decideLearn(after, null);
				else runs.decideEvolve(after, null);
			}
			assert.equal(runs.decideCapture(after, 'keep'), null);
			assert.equal(after.team.length, 2);
			assert.equal(after.team[1].species, capture.mon.species);
			assert.equal(after.team[1].hp, 1);

			// Time cheio: alguém sai (o item dele vai para a mochila)
			after.team = [0, 1, 2, 3, 4, 5].map(i => ({ ...after.team[0], uid: `f${i}`, item: i === 2 ? 'Leftovers' : '' }));
			after.decisions = [{ ...capture }];
			assert.equal(runs.decideCapture(after, 'keep'), 'teamfull');
			assert.equal(runs.decideCapture(after, 'f2'), null);
			assert.equal(after.team.length, 6);
			assert(!after.team.some(mon => mon.uid === 'f2'));
			assert.deepEqual(after.items, ['Leftovers']);
		});

		it('runs the second batch of "?" events', () => {
			const events = require('../../../dist/server/chat-plugins/expedition/events');
			const world = require('../../../dist/server/chat-plugins/expedition/events-world');
			const economy = require('../../../dist/server/chat-plugins/expedition/economy');
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			const node = { id: '4-0', floor: 4, col: 0, type: 'event', next: [] };
			const start = (id, setupRun = run, at = node) => {
				const event = events.getEvent(id);
				const data = event.setup(setupRun, at, random.seededRandom(`ev-${id}`, 'x'));
				return { event, data, context: { run: setupRun, node: at, TL, lang: 'en', data } };
			};
			const ids = choices => choices.map(choice => choice.id);

			// Itens-chave: na mochila, sem ir para os Pokémon
			assert(economy.isKeyItem('Helix Fossil') && economy.isKeyItem('bicycle') && economy.isKeyItem('oldrod'));
			assert(!economy.isHeldItem('Helix Fossil'));
			assert(economy.isHeldItem('Leftovers'));

			// Ataque da Equipe Rocket: entregar qualquer um (nunca o último), fugir só com a Bicicleta
			const base = run.team[0];
			run.team = [base, { ...base, uid: 'r2', species: 'Pidgey', item: 'Leftovers' }];
			const rocket = start('rocketattack');
			assert(rocket.data.species.length >= 1);
			assert(!ids(rocket.event.choices(rocket.context)).includes('flee'));
			const battle = rocket.event.choose(rocket.context, 'battle');
			assert.equal(battle.battle.kind, 'trainer');
			assert.equal(rocket.event.choose(rocket.context, 'give:r2').result, true);
			assert.deepEqual(run.team.map(mon => mon.uid), [base.uid]);
			assert(run.items.includes('Leftovers'), 'o item vai para a mochila');
			assert(rocket.event.choices(rocket.context).find(choice => choice.id === `give:${base.uid}`).disabled, 'o único fica');
			run.team.push({ ...base, uid: 'r3', fainted: true, hp: 0 });
			assert(rocket.event.choices(rocket.context).find(choice => choice.id === `give:${base.uid}`).disabled,
				'o único em condição de batalhar fica');
			assert(!rocket.event.choices(rocket.context).find(choice => choice.id === 'give:r3').disabled, 'o desmaiado pode ir');
			run.team.pop();
			run.items.push('bicycle');
			assert(ids(rocket.event.choices(rocket.context)).includes('flee'));

			// Caverna: grupo de 3 ou 4 selvagens, sem captura, com um fóssil de recompensa
			const cave = start('cave');
			assert([3, 4].includes(cave.data.species.length));
			const caveBattle = cave.event.choose(cave.context, 'enter');
			assert.equal(caveBattle.battle.noCapture, true);
			assert(economy.FOSSILS.some(fossil => fossil.item === caveBattle.reward.items[0]));
			const noCaveTheme = { ...run, settings: { ...run.settings, theme: { gens: [9], species: [] } } };
			assert.equal(start('cave', noCaveTheme).data, null, 'sem espécies de caverna no tema');

			// Cientista: reviver gasta o fóssil; trocar dá um Porygon no nível; ou uma Hyper Potion
			run.items.push('Helix Fossil');
			const sci = start('scientist');
			assert.equal(sci.data.revives.length, 1);
			assert.equal(sci.event.choose(sci.context, 'revive:0').result, true);
			assert(!run.items.includes('Helix Fossil'));
			assert.equal(run.decisions[run.decisions.length - 1].gift, true);
			run.decisions = [];
			run.team[0].item = 'Choice Band';
			run.team[0].level = 40;
			const uid = run.team[0].uid;
			assert.equal(sci.event.choose(sci.context, `trade:${uid}`).result, true);
			assert(['Porygon', 'Porygon2', 'Porygon-Z'].includes(run.team[0].species));
			assert.equal(run.team[0].level, 40);
			assert(run.items.includes('Choice Band'));
			sci.event.choose(sci.context, 'potion');
			assert(run.items.includes('hyperpotion'));

			// Move Reminder: um golpe de nível já passado
			run.team[0] = { ...base, species: 'Bulbasaur', level: 30, moves: ['tackle'], ppUsed: [0] };
			const reminder = start('reminder');
			assert(reminder.data.offers.length >= 1);
			assert.equal(reminder.event.choose(reminder.context, 'remind:0').result, true);
			assert.equal(run.team[0].moves.length, 2);

			// Obstáculos: só quem aprende por TM/HM abre o caminho
			assert(world.learnsByMachine('Bulbasaur', 'cut'));
			assert(!world.learnsByMachine('Magikarp', 'cut'));
			const tree = start('tree');
			assert.deepEqual(ids(tree.event.choices(tree.context)), ['use', 'detour']);
			run.team[0] = { ...run.team[0], species: 'Magikarp' };
			assert.deepEqual(ids(tree.event.choices(tree.context)), ['detour']);
			assert.equal(tree.event.choose(tree.context, 'use'), null);
			assert.equal(tree.event.choose(tree.context, 'detour').battle.kind, 'wild');

			// Lago: só no ato 2; refrescar recupera 30% do HP e do PP de quem não desmaiou; pescar exige a vara
			run.team[0] = { ...run.team[0], hp: 0.5, fainted: false, moves: ['tackle'], ppUsed: [20] };
			assert.equal(start('lake').data, null, 'só no ato 2');
			run.act = 2;
			const lake = start('lake');
			assert(lake.event.choices(lake.context).find(choice => choice.id === 'fish').disabled);
			lake.event.choose(lake.context, 'rest');
			assert.equal(run.team[0].hp, 0.8);
			assert(run.team[0].ppUsed[0] < 20);
			run.items.push('oldrod');
			assert.equal(lake.event.choose(lake.context, 'fish').battle.kind, 'wild');
			run.act = 1;

			// Pescador e Bicicleta: não aparecem para quem já tem o item; a Bicicleta custa 10000
			assert.equal(start('fisherman').data, null);
			run.items = run.items.filter(item => item !== 'bicycle');
			const bike = start('bikeshop');
			run.money = 100;
			assert.equal(bike.event.choose(bike.context, 'buy'), 'nomoney');
			run.money = world.BICYCLE_PRICE;
			assert.equal(bike.event.choose(bike.context, 'buy').result, true);
			assert.equal(run.money, 0);
			assert.equal(start('bikeshop').data, null);

			// Idoso envenenado: só no ato 1; o Antidote é gasto
			const oldman = start('oldman');
			assert(oldman.data.weedle);
			assert(oldman.event.choices(oldman.context).find(choice => choice.id === 'cure').disabled);
			run.items.push('antidote');
			assert.equal(oldman.event.choose(oldman.context, 'cure').result, true);
			assert(!run.items.includes('antidote'));
			assert.equal(start('oldman', { ...run, act: 2 }).data, null);
		});

		it('plays doubles against two trainers, each position with its own Pokémon', () => {
			const tag = require('../../../dist/server/chat-plugins/expedition/tag-team');
			assert.deepEqual(tag.interleave(['A1', 'A2', 'A3'], ['B1']), ['A1', 'B1', 'A2', 'A3']);
			const mon = (name, active, fainted = false) => ({ ident: `p2: ${name}`, active, condition: fainted ? '0 fnt' : '100/100' });
			const side = pokemon => ({ name: 'NPC', id: 'p2', pokemon });
			let answer = '';
			const ai = new tag.TagTeamAI({ level: 'easy', choose: () => answer }, { Rattata: 0, Zubat: 1, Ekans: 0, Koffing: 1 });
			const team = [mon('Rattata', true), mon('Zubat', true), mon('Ekans', false), mon('Koffing', false)];
			assert.equal(ai.choose({ teamPreview: true, side: side(team) }, { log: [] }), 'team 1234');
			answer = 'switch 4, move 1';
			assert.equal(ai.choose({ active: [{}, {}], side: side(team) }, { log: [] }), 'switch 3, move 1', 'troca para o do próprio treinador');
			answer = 'move 1, switch 3';
			assert.equal(ai.choose({ active: [{}, {}], side: side(team) }, { log: [] }), 'move 1, switch 4');
			const noBench = [mon('Rattata', true, true), mon('Zubat', true), mon('Koffing', false)];
			answer = 'switch 3, pass';
			assert.equal(ai.choose({ forceSwitch: [true, false], side: side(noBench) }, { log: [] }), 'switch 3, pass',
				'sem ninguém do próprio treinador, o do outro entra no lugar vago');
			assert.equal(ai.choose({ active: [{}, {}], side: side([mon('Rattata', true), mon('Zubat', true), mon('Koffing', false)]) },
				{ log: [] }), 'move 1, pass'.replace(', pass', ', pass'), 'troca voluntária para o do outro vira golpe');
		});

		it('runs the Team Rocket events: the kid in doubles and the hideout that goes on after battles', () => {
			const events = require('../../../dist/server/chat-plugins/expedition/events');
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.settings.rules.capture = 'chance';
			const node = { id: '4-0', floor: 4, col: 0, type: 'event', next: [] };
			const start = (id, setupRun = run) => {
				const event = events.getEvent(id);
				const data = event.setup(setupRun, node, random.seededRandom(`ev2-${id}`, 'x'));
				return { event, data, context: { run: setupRun, node, TL, lang: 'en', data } };
			};
			const kids = start('rocketkids');
			assert(kids.data.a.length >= 2 && kids.data.b.length >= 1);
			assert(!kids.data.a.some(name => kids.data.b.includes(name)), 'espécies diferentes nos dois times');
			const help = kids.event.choose(kids.context, 'help');
			assert.deepEqual(Object.values(help.battle.owners).sort(), [...kids.data.a.map(() => 0), ...kids.data.b.map(() => 1)].sort());
			assert.equal(help.reward.items.length, 2, 'item da sacola e a berry');
			assert(!kids.event.choices(kids.context).some(choice => choice.id === 'police'));
			kids.event.choose(kids.context, 'steal');
			assert(run.items.includes(kids.data.loot));
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const encounters = require('../../../dist/server/chat-plugins/expedition/encounters');
			const encounter = encounters.encounterFromSpec(run, TEST_VARIANT, node, help.battle);
			assert.equal(encounter.doubles, true, 'batalha em dupla');
			assert.deepEqual(encounter.owners, help.battle.owners);

			// Covil: só no ato 3
			assert.equal(start('rocketlair').data, null);
			run.act = 3;
			const lair = start('rocketlair');
			assert.deepEqual(lair.event.choices(lair.context).map(choice => choice.id), ['enter', 'leave']);
			assert.deepEqual(lair.event.choose(lair.context, 'enter'), { stay: true });
			let battles = 0;
			for (let i = 0; i < 4; i++) {
				const outcome = lair.event.choose(lair.context, i % 2 ? 'left' : 'right');
				if (outcome.battle) {
					battles++;
					assert.equal(outcome.battle.resume, true, 'o evento continua depois da batalha');
				}
			}
			assert.equal(lair.data.lair.step, 4);
			assert.deepEqual(lair.event.choices(lair.context).map(choice => choice.id), ['end', 'exit']);
			lair.event.choose(lair.context, 'end');
			assert.equal(lair.data.lair.done, true);
			assert.deepEqual(lair.event.choices(lair.context).map(choice => choice.id), ['exit']);
			assert.deepEqual(lair.event.choose(lair.context, 'exit'), { result: true });

			// Vitória numa batalha que continua o evento: o nó segue aberto, sem a batalha
			run.node = '4-0';
			run.nodeDone = false;
			run.decisions = [];
			run.nodeState = { event: 'rocketlair', data: lair.data, battle: { ...help.battle, owners: undefined, resume: true } };
			db.saveRun(run);
			db.db.prepare('UPDATE runs SET settings = ? WHERE id = ?').run(JSON.stringify(run.settings), run.id);
			battles.toString();
			const battleModule = require('../../../dist/server/chat-plugins/expedition/battles');
			battleModule.setEncounterOverride(saved => encounters.encounterFromSpec(saved, TEST_VARIANT, node, saved.nodeState.battle));
			try {
				const battle = db.createBattle(run.id, run.act, '4-0', [run.team[0].uid]);
				battleModule.finishExpeditionBattle(battle.id, 'win', [{ index: 0, hp: 0.9, ppUsed: [1], fainted: false }]);
			} finally {
				battleModule.setEncounterOverride(null);
			}
			const after = db.getRun(run.id);
			assert.equal(after.nodeDone, false, 'o nó não termina');
			assert.equal(after.nodeState.battle, undefined);
			assert.equal(after.nodeState.event, 'rocketlair');
		});

		it('plays the Complete mode: badges, difficulty, the special act and shiny starters', () => {
			const definition = require('../../../dist/server/chat-plugins/expedition/definition');
			const encounters = require('../../../dist/server/chat-plugins/expedition/encounters');
			const economy = require('../../../dist/server/chat-plugins/expedition/economy');
			const { BADGES } = require('../../../dist/server/chat-plugins/gym-challenge/badge-catalog');
			const ids = definition.drawBadges(random.seededRandom('complete', 'x'));
			const badges = ids.map(id => {
				const badge = BADGES.find(entry => entry.id === id);
				return { id, type: badge.type, leaderName: badge.leaders[0], leader: 'generated' };
			});
			if (!variant.getVariant('unitcomplete')) {
				variant.registerVariant({
					id: 'unitcomplete', name: () => 'Complete', description: () => 'Complete', status: 'open',
					rules: { battles: 'manual', progression: 'levels', attrition: 'persist', faint: 'revive', teamSize: 6, complete: true },
					map: { ...MAP, acts: 1, floors: 3, weights: { rest: 50, item: 50 }, fixedFloors: {}, special: true },
					encounters: { wild: { pokedex: 100 }, trainer: { pokedex: 100 }, boss: { pokedex: 100 } },
					completeConfig: { badges, elite: ['generated', 'generated'], champion: 'generated' },
					aiLevel: () => 'easy',
					starterOptions: prng => [0, 1, 2].map(i => [team.createMon(prng, 'Bulbasaur', 5, `c${i}`)]),
				});
			}
			const all = variant.getVariant('unitcomplete');
			// O teste começa várias runs seguidas: o limite de runs novas não conta as anteriores
			const fresh = () => db.db.prepare('UPDATE runs SET started_at = 0').run();

			// Sem insígnias: nível 0, disputa uma insígnia
			let run = (fresh(), runs.startRun(user, 'unitcomplete'));
			assert.equal(run.settings.complete.level, 0);
			assert(ids.includes(run.settings.complete.badge.id));
			assert.equal(run.settings.complete.allBadges, false);
			runs.chooseStarter(run, 0);
			// O chefe do último ato é o líder da insígnia, só com Pokémon do tipo dela
			const boss = encounters.generateEncounter(run, all, { id: 'boss', floor: 3, col: 0, type: 'boss', next: [] });
			assert(boss.team.every(mon => Dex.species.get(mon.species).types.includes(run.settings.complete.badge.type)),
				'time do tipo da insígnia');
			assert(/^Leader /.test(boss.name));
			// Vencer o chefe do último ato dá a insígnia e vence a run (sem as 8, sem ato especial)
			run.node = 'boss';
			runs.completeNode(run);
			db.saveRun(run);
			assert.equal(run.status, 'won');
			assert.deepEqual(db.getBadges(user.id, 'unitcomplete'), [run.settings.complete.badge.id]);

			// Abaixo do nível máximo, sem insígnia em disputa
			for (const id of ids.slice(0, 3)) db.addBadge(user.id, 'unitcomplete', id);
			run = (fresh(), runs.startRun(user, 'unitcomplete', { level: 1 }));
			assert.equal(run.settings.complete.level, 1);
			assert.equal(run.settings.complete.badge, null);
			runs.abandonRun(user, run);
			run = (fresh(), runs.startRun(user, 'unitcomplete', { level: 99 }));
			assert.equal(run.settings.complete.level, db.getBadges(user.id, 'unitcomplete').length, 'no máximo o número de insígnias');
			assert(!db.getBadges(user.id, 'unitcomplete').includes(run.settings.complete.badge.id), 'só as que faltam');
			runs.abandonRun(user, run);

			// Agravantes
			const settingsAt = level => ({ ...run.settings, complete: { ...run.settings.complete, level } });
			const trainer = { kind: 'trainer', source: 'pokedex', trainer: true, team: [{ species: 'Rattata', level: 20 }] };
			assert.equal(economy.battlePrize(trainer, settingsAt(1)), Math.round(economy.battlePrize(trainer, settingsAt(0)) * 0.75 / 10) * 10);
			const shop = level => economy.shopStock({ seed: 's', act: 1, team: [], settings: settingsAt(level) }, '3-0')
				.find(entry => entry.item === 'potion').price;
			assert.equal(shop(6), 250, 'PokéMart 25% mais caro');
			assert.equal(shop(5), 200);
			const nodes = require('../../../dist/server/chat-plugins/expedition/nodes');
			const itemCount = level => nodes.getNodeType('item').view({
				run: { seed: 'i', act: 1, team: [], settings: settingsAt(level) }, node: { id: '2-0' }, TL,
			}).choices.length;
			assert.equal(itemCount(1), 3);
			assert.equal(itemCount(2), 2, 'uma opção a menos no nó de item');
			const strong = { ...run, settings: settingsAt(8) };
			const weak = { ...run, settings: settingsAt(0) };
			const at = { id: '1-0', floor: 1, col: 0, type: 'trainer', next: [] };
			const strongTrainer = encounters.generateEncounter(strong, all, at);
			const weakTrainer = encounters.generateEncounter(weak, all, at);
			assert.equal(strongTrainer.team[0].level, weakTrainer.team[0].level + 2, '+2 níveis');
			assert.equal(strongTrainer.aiLevel, 'medium', 'IA um nível acima');
			assert.equal(strongTrainer.team.length, Math.min(6, weakTrainer.team.length + 1), 'um Pokémon a mais');
			const strongBoss = encounters.generateEncounter({ ...strong, settings: { ...strong.settings, complete: { ...strong.settings.complete, badge: null } } },
				all, { id: 'boss', floor: 3, col: 0, type: 'boss', next: [] });
			assert.equal(strongBoss.team.length, 6);
			assert.equal(strongBoss.aiLevel, 'master');

			// Com as 8: sem insígnia em disputa; vencer o último ato abre o ato especial
			for (const id of ids) db.addBadge(user.id, 'unitcomplete', id);
			run = (fresh(), runs.startRun(user, 'unitcomplete'));
			assert.equal(run.settings.complete.allBadges, true);
			assert.equal(run.settings.complete.badge, null);
			runs.chooseStarter(run, 0);
			run.node = 'boss';
			runs.completeNode(run);
			db.saveRun(run);
			assert.equal(runs.runPhase(run), 'special');
			assert.equal(runs.decideSpecial(run, true), null);
			assert.equal(run.act, 2);
			const special = runs.currentMap(run);
			assert.deepEqual(special.nodes.map(node => node.type), ['rest', 'shop', 'elitefour', 'champion']);
			const elite = encounters.generateEncounter(run, all, special.nodes[2]);
			assert.equal(elite.doubles, true);
			assert.equal(elite.team.length, 6);
			assert(elite.team.every(mon => mon.level === 100));
			// Difícil; no nível 8 (o padrão de quem tem as 8), o agravante 4 sobe para a Mestre
			assert.equal(elite.aiLevel, 'master');
			assert.equal(encounters.generateEncounter({ ...run, settings: settingsAt(0) }, all, special.nodes[2]).aiLevel, 'hard');
			assert.deepEqual(Object.values(elite.owners).sort(), [0, 0, 0, 1, 1, 1]);
			const champion = encounters.generateEncounter(run, all, special.nodes[3]);
			assert.equal(champion.team.length, 6);
			assert.equal(champion.aiLevel, 'master');
			// Vencer o Campeão vence a run e libera os iniciais shiny daquela expedição
			run.node = 'boss';
			runs.completeNode(run);
			db.saveRun(run);
			assert.equal(run.status, 'won');
			assert(db.hasUnlock(user.id, 'shiny', 'starters', 'unitcomplete'));
			assert(!db.hasUnlock(user.id, 'shiny', 'starters', 'unitteste'), 'só naquela expedição');
			run = (fresh(), runs.startRun(user, 'unitcomplete'));
			assert(run.pending.options.flat().every(mon => mon.shiny), 'iniciais shiny');
			runs.abandonRun(user, run);
			run = (fresh(), runs.startRun(user, 'unitcomplete', { shiny: false }));
			assert(!run.pending.options.flat().some(mon => mon.shiny));
			runs.abandonRun(user, run);

			// Quem prefere encerrar como vencedor
			const other = runs.startRun(makeUser('Expedition Other'), 'unitcomplete');
			assert.equal(other.settings.complete.allBadges, false);

			// Troca de nome e exclusão levam as insígnias
			db.renameUser(user.id, 'badgename');
			assert.equal(db.getBadges('badgename', 'unitcomplete').length, 8);
			db.deleteUserData('badgename');
			assert.equal(db.getBadges('badgename', 'unitcomplete').length, 0);

			// O líder escolhido precisa ter o tipo da insígnia
			const trainers = new Map([[5, { id: 5, name: 'Brock', type: 'Rock', doubles: false, hasTeam: true }]]);
			const nonRock = ids.findIndex(id => BADGES.find(entry => entry.id === id).type !== 'Rock');
			const leaders = Array(8).fill('generated');
			leaders[nonRock] = 5;
			const problems = definition.definitionProblems(definition.normalizeDefinition({ badges: { mode: 'chosen', ids, leaders } }), trainers);
			assert(problems.some(p => p.message.startsWith('The leader of the')));
		});

		it('computes the capture chance of each ball', () => {
			const capture = require('../../../dist/server/chat-plugins/expedition/capture');
			assert.equal(capture.catchChance('Bulbasaur', 'masterball'), 1);
			assert.equal(capture.ballIdByName('Poké Ball'), 'pokeball', 'o toID do PS apagaria o acento');
			assert.equal(capture.ballIdByName('Net Ball'), 'netball');
			assert(capture.catchChance('Rattata', 'pokeball') > capture.catchChance('Bulbasaur', 'pokeball'), 'taxa 255 contra 45');
			assert(capture.catchChance('Bulbasaur', 'ultraball') > capture.catchChance('Bulbasaur', 'greatball'));
			assert(capture.catchChance('Bulbasaur', 'greatball') > capture.catchChance('Bulbasaur', 'pokeball'));
			assert(capture.catchChance('Magikarp', 'netball') > capture.catchChance('Magikarp', 'pokeball'), 'Net Ball contra Water');
			assert.equal(capture.catchChance('Bulbasaur', 'netball'), capture.catchChance('Bulbasaur', 'pokeball'));
			assert.equal(capture.catchChance('Mewtwo', 'pokeball'), capture.LEGENDARY_MIN_CHANCE, 'lendário: chance mínima');
			assert.equal(capture.catchRate('Pikachu-Alola'), capture.catchRate('Pikachu'), 'formas usam a taxa da espécie');
			assert.deepEqual(capture.ballsInBag(['ultraball', 'Leftovers', 'pokeball', 'ultraball'])
				.map(entry => [entry.ball.id, entry.count]), [['pokeball', 1], ['ultraball', 2]]);
		});

		it('captures with Poké Balls: sure or by chance, and gifts need no ball', () => {
			const run = runs.startRun(user, 'unitteste');
			run.settings.rules.capture = 'ball';
			runs.chooseStarter(run, 0);
			assert.deepEqual(run.items, Array(3).fill('pokeball'), 'captura certa: começa com 3 Poké Bolas');
			const other = makeUser('Expedition Chance');
			other.registered = true;
			const withChance = runs.startRun(other, 'unitteste');
			withChance.settings.rules.capture = 'chance';
			runs.chooseStarter(withChance, 0);
			assert.deepEqual(withChance.items, Array(5).fill('pokeball'), 'com chance: 5');
			other.destroy();
			assert.equal(run.team[0].ball, 'Poké Ball');
			const wild = { ...run.team[0], uid: 'w1', species: 'Mewtwo', ball: undefined };
			run.decisions = [{ kind: 'capture', uid: 'w1', mon: wild }];
			assert.equal(runs.decideCapture(run, 'keep'), 'badchoice', 'primeiro a bola');
			assert.equal(runs.decideCapture(run, 'ball:greatball'), 'noitem');
			assert.equal(runs.decideCapture(run, 'ball:pokeball'), null);
			assert.equal(run.team.length, 2, 'captura certa e entra no time');
			assert.equal(run.team[1].ball, 'Poké Ball');
			assert.equal(run.items.length, 2);

			// Com chance: Mewtwo (taxa 3, chance mínima de 10%) escapa quase sempre; cada tentativa gasta uma
			// bola. Semente fixa: o resultado de cada tentativa sai dela
			run.settings.rules.capture = 'chance';
			run.seed = 'capture-test';
			run.items = Array(40).fill('pokeball');
			run.decisions = [{ kind: 'capture', uid: 'w2', mon: { ...wild, uid: 'w2' } }];
			let tries = 0;
			while (run.decisions.length && !run.decisions[0].caught && tries < 40) {
				assert.equal(runs.decideCapture(run, 'ball:pokeball'), null);
				tries++;
				if (run.decisions.length && !run.decisions[0].caught) assert.equal(run.decisions[0].escaped, 'Poké Ball');
			}
			assert.equal(run.items.length, 40 - tries);
			assert(tries >= 1 && tries < 40, `tentativas: ${tries}`);
			// O resultado de cada tentativa sai da semente: o mesmo ao repetir
			const again = { ...run, decisions: [{ kind: 'capture', uid: 'w2', mon: { ...wild, uid: 'w2' } }], items: Array(40).fill('pokeball') };
			let triesAgain = 0;
			while (again.decisions.length && !again.decisions[0].caught && triesAgain < 40) {
				runs.decideCapture(again, 'ball:pokeball');
				triesAgain++;
			}
			assert.equal(triesAgain, tries);

			// Presente de evento: entra sem bola
			run.decisions = [{ kind: 'capture', uid: 'g1', mon: { ...wild, uid: 'g1' }, gift: true }];
			assert.equal(runs.decideCapture(run, 'ball:pokeball'), 'badchoice');
			run.team = run.team.slice(0, 1);
			assert.equal(runs.decideCapture(run, 'keep'), null);
			assert.equal(run.team[1].ball, 'Poké Ball', 'bola padrão');
		});

		it('uses the Computer: captures and swaps go there, and the PokéCenter stores and heals', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			run.settings.rules.computer = true;
			const base = run.team[0];
			run.team = [0, 1, 2, 3, 4, 5].map(i => ({ ...base, uid: `t${i}`, item: i === 1 ? 'Leftovers' : '' }));
			const wild = { ...base, uid: 'w1', species: 'Pidgey' };
			run.decisions = [{ kind: 'capture', uid: 'w1', mon: wild }];
			assert.equal(runs.decideCapture(run, 'pc'), null);
			assert.deepEqual(run.box.map(mon => mon.uid), ['w1']);
			run.decisions = [{ kind: 'capture', uid: 'w2', mon: { ...wild, uid: 'w2' } }];
			assert.equal(runs.decideCapture(run, 't1'), null);
			assert.equal(run.box[1].uid, 't1', 'quem sai vai para o Computador');
			assert.equal(run.box[1].item, '', 'sem o item');
			assert.deepEqual(run.items, ['Leftovers'], 'o item vai para a mochila');
			run.items = [];

			const nodes = require('../../../dist/server/chat-plugins/expedition/nodes');
			const rest = nodes.getNodeType('rest');
			const context = { run, node: { id: '5-0', floor: 5, col: 0, type: 'rest', next: [] }, TL };
			assert.deepEqual(rest.view(context).choices.map(choice => choice.id), ['rest', 'pc']);
			assert.equal(rest.choose(context, 'pc'), false);
			assert.deepEqual(rest.view(context).choices.map(choice => choice.id), ['leave']);
			assert.equal(rest.choose(context, 'rest'), null, 'curar ou usar o Computador, não os dois');
			run.team[0].hp = 0.3;
			run.team[0].item = 'Choice Band';
			assert.equal(rest.choose(context, 'deposit:t0'), false);
			assert.deepEqual(run.items, ['Choice Band'], 'o item de quem é guardado vai para a mochila');
			assert.equal(rest.choose(context, 'withdraw:t0'), false);
			assert.equal(run.team.find(mon => mon.uid === 't0').item, '');
			assert.equal(run.team.find(mon => mon.uid === 't0').hp, 0.3, 'guardado agora volta como estava');
			assert.equal(rest.choose(context, 'withdraw:w1'), 'teamfull');
			run.team = run.team.slice(0, 1);
			assert.equal(rest.choose(context, 'deposit:' + run.team[0].uid), 'lastmon');
			run.box[0].hp = 0.1;
			assert.equal(rest.choose(context, 'leave'), true);
			assert.equal(run.box[0].hp, 1, 'quem está no Computador é curado ao sair');
			run.settings.rules.computer = false;
			run.nodeState = {};
			assert.deepEqual(rest.view(context).choices.map(choice => choice.id), ['rest']);
			assert.equal(rest.choose(context, 'pc'), null);
		});

		it('rolls shiny wild Pokémon, sells balls with Poké Ball capture and no revives in Nuzlocke', () => {
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const encounters = require('../../../dist/server/chat-plugins/expedition/encounters');
			const settings = variant.resolveSettings(TEST_VARIANT);
			const at = { id: '0-0', floor: 0, col: 0, type: 'wild', next: [] };
			settings.rules.shinyOdds = 1;
			const shiny = encounters.generateEncounter({ seed: 'sh', act: 1, settings }, TEST_VARIANT, at);
			assert.equal(shiny.team[0].shiny, true);
			assert.equal(Teams.unpack(shiny.packed)[0].shiny, true);
			settings.rules.shinyOdds = 0;
			assert(!encounters.generateEncounter({ seed: 'sh', act: 1, settings }, TEST_VARIANT, at).team[0].shiny);

			const economy = require('../../../dist/server/chat-plugins/expedition/economy');
			const stock = rules => economy.shopStock({ seed: 's', act: 1, team: [], settings: { ...settings, rules } }, '3-0')
				.map(entry => entry.item);
			assert(stock({ ...settings.rules, capture: 'choose' }).includes('revive'));
			assert(!stock({ ...settings.rules, capture: 'choose' }).includes('greatball'));
			assert(stock({ ...settings.rules, capture: 'chance' }).includes('greatball'));
			assert(!stock({ ...settings.rules, faint: 'nuzlocke' }).some(item => /revive/.test(item)), 'Nuzlocke sem reviver');

			// Master Ball: 5% dos nós de item, só com captura por bola
			const nodes = require('../../../dist/server/chat-plugins/expedition/nodes');
			const itemsAt = (seed, capture) => nodes.getNodeType('item').view({
				run: { seed, act: 1, team: [], settings: { ...settings, rules: { ...settings.rules, capture } } },
				node: { id: '7-0', floor: 7, col: 0, type: 'item', next: [] }, TL: text => text.join(''),
			}).choices.map(choice => choice.item);
			let masters = 0;
			for (let i = 0; i < 400; i++) {
				if (itemsAt(`mb${i}`, 'chance').includes('masterball')) masters++;
				assert(!itemsAt(`mb${i}`, 'choose').includes('masterball'));
			}
			assert(masters >= 8 && masters <= 35, `Master Balls em 400 nós: ${masters}`);
		});

		it('moves held items between the bag and the team, and the item node fills the bag', () => {
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			const uid = run.team[0].uid;
			run.items = ['Leftovers'];
			assert.equal(runs.setHeldItem(run, uid, 'leftovers'), null);
			assert.equal(run.team[0].item, 'Leftovers');
			assert.deepEqual(run.items, []);
			assert.equal(runs.setHeldItem(run, uid, 'choiceband'), 'noitem');
			assert.equal(runs.setHeldItem(run, uid, ''), null);
			assert.equal(run.team[0].item, '');
			assert.deepEqual(run.items, ['Leftovers']);

			const nodes = require('../../../dist/server/chat-plugins/expedition/nodes');
			const context = { run, node: { id: '1-0', floor: 1, col: 0, type: 'item', next: [] }, TL };
			const view = nodes.getNodeType('item').view(context);
			assert.equal(view.choices.length, 3);
			assert.equal(new Set(view.choices.map(choice => choice.item)).size, 3);
			assert.deepEqual(nodes.getNodeType('item').view(context), view, 'os mesmos itens ao voltar');
			assert.equal(nodes.getNodeType('item').choose(context, 'pick:nada'), null);
			assert.equal(nodes.getNodeType('item').choose(context, view.choices[1].id), true);
			assert.deepEqual(run.items, ['Leftovers', view.choices[1].item]);
		});

		it('pays for trainer battles and sells items in the shop', () => {
			const economy = require('../../../dist/server/chat-plugins/expedition/economy');
			const { TEST_VARIANT } = require('../../../dist/server/chat-plugins/expedition/variants');
			const settings = variant.resolveSettings(TEST_VARIANT);
			assert.equal(settings.extra.startMoney, 500);
			const mon = lvl => ({ species: 'Rattata', level: lvl });
			const trainer = { kind: 'trainer', source: 'pokedex', trainer: true, team: [mon(10), mon(12)] };
			const wild = { kind: 'wild', source: 'pokedex', trainer: false, team: [mon(12)] };
			const boss = { kind: 'boss', source: 'pokedex', trainer: true, team: [mon(12)] };
			assert.equal(economy.battlePrize(wild, settings), 0, 'selvagem não paga');
			assert(economy.battlePrize(trainer, settings) > 0);
			assert(economy.battlePrize(boss, settings) > economy.battlePrize(trainer, settings));

			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			const stock = economy.shopStock(run, '2-1');
			assert.deepEqual(economy.shopStock(run, '2-1'), stock, 'o mesmo estoque ao voltar');
			assert(stock.some(entry => entry.item === 'potion' && !entry.single));
			assert.equal(stock.filter(entry => entry.group === 'held').length, 3);
			assert(stock.some(entry => entry.item === 'rarecandy' && entry.single));
			run.money = 300;
			assert.equal(economy.buyItem(run, '2-1', 'superpotion'), 'nomoney');
			assert.equal(economy.buyItem(run, '2-1', 'potion'), null);
			assert.equal(run.money, 100);
			assert.deepEqual(run.items, ['potion']);
			run.money = 20000;
			assert.equal(economy.buyItem(run, '2-1', 'rarecandy'), null);
			assert.equal(economy.buyItem(run, '2-1', 'rarecandy'), 'soldout', 'uma unidade só');
			assert.equal(economy.buyItem(run, '2-1', 'nada'), 'badchoice');
		});

		it('uses bag items outside battles: potions, revive, status, Rare Candy and TMs', () => {
			const economy = require('../../../dist/server/chat-plugins/expedition/economy');
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			const mon = run.team[0];
			run.items = ['potion', 'revive', 'antidote', 'rarecandy'];
			assert.equal(runs.useBagItem(run, 'potion', mon.uid), 'noeffect', 'HP cheio');
			assert.equal(economy.itemApplies('potion', mon), false);
			assert.equal(economy.itemApplies('rarecandy', mon), true);
			mon.hp = 0.2;
			assert.equal(runs.useBagItem(run, 'potion', mon.uid), null);
			assert(mon.hp > 0.2);
			assert.equal(runs.useBagItem(run, 'revive', mon.uid), 'noeffect', 'não desmaiou');
			mon.fainted = true;
			mon.hp = 0;
			assert.equal(runs.useBagItem(run, 'revive', mon.uid), null);
			assert.deepEqual([mon.fainted, mon.hp], [false, 0.5]);
			mon.status = 'brn';
			assert.equal(runs.useBagItem(run, 'antidote', mon.uid), 'noeffect', 'antídoto não cura queimadura');
			mon.status = 'tox';
			assert.equal(runs.useBagItem(run, 'antidote', mon.uid), null);
			assert.equal(mon.status, '');
			const level = mon.level;
			assert.equal(runs.useBagItem(run, 'rarecandy', mon.uid), null);
			assert.equal(mon.level, level + 1);
			assert.deepEqual(run.items, []);
			assert.equal(runs.useBagItem(run, 'potion', mon.uid), 'noitem');

			// TM: só quem aprende; com quatro golpes, a decisão vai para a fila
			const tm = economy.tmMovesFor(mon).find(move => !mon.moves.includes(move));
			mon.moves = ['tackle', 'growl', 'vinewhip', 'leechseed'];
			run.items = [`tm:${tm}`, 'tm:surf'];
			assert.equal(runs.useBagItem(run, 'tm:surf', mon.uid), 'badtarget', 'Bulbasaur não aprende Surf');
			assert.equal(runs.useBagItem(run, `tm:${tm}`, mon.uid), null);
			assert.deepEqual(run.decisions[run.decisions.length - 1], { kind: 'learn', uid: mon.uid, move: tm });
			assert.equal(runs.useBagItem(run, 'tm:surf', mon.uid), 'decisions', 'decida primeiro');
		});

		it('runs "?" events: direct results, decisions and battles with rewards', () => {
			const events = require('../../../dist/server/chat-plugins/expedition/events');
			const nodes = require('../../../dist/server/chat-plugins/expedition/nodes');
			const run = runs.startRun(user, 'unitteste');
			runs.chooseStarter(run, 0);
			const map = runs.currentMap(run);
			const node = { ...map.nodes[0], type: 'event' };
			run.node = node.id;
			const eventNode = nodes.getNodeType('event');
			const context = { run, node, TL, lang: 'en' };
			const start = (id, prepare) => {
				if (prepare) prepare();
				const event = events.getEvent(id);
				const data = event.setup(run, node, random.seededRandom(run.seed, `test:${id}`));
				run.nodeState = { event: id, data };
				return data;
			};
			// Sorteio determinístico
			assert.deepEqual(events.pickEvent(run, node), events.pickEvent(run, node));

			// Carteira: ficar com o dinheiro
			const wallet = start('wallet');
			const money = run.money;
			assert.equal(eventNode.choose(context, 'nada'), null);
			assert.equal(eventNode.choose(context, 'keep'), false);
			assert.equal(run.money, money + wallet.money);
			assert.equal(eventNode.view(context).choices[0].id, 'continue', 'resultado e "Continuar"');
			assert.equal(eventNode.choose(context, 'continue'), true);

			// Evolução especial: Kadabra evolui (troca) para Alakazam
			const evolution = start('evolution', () => { run.team[0].species = 'Kadabra'; });
			assert.deepEqual(evolution.offers, [{ uid: run.team[0].uid, from: 'Kadabra', into: 'Alakazam' }], 'oferece Alakazam');
			// Se o Pokémon mudou depois do sorteio, a oferta não vale mais
			run.team[0].species = 'Abra';
			assert.equal(eventNode.choose(context, 'evolve:0'), null, 'oferta indisponível');
			run.team[0].species = 'Kadabra';
			assert.equal(eventNode.choose(context, 'evolve:0'), false);
			assert.equal(run.team[0].species, 'Alakazam');
			assert.equal(events.getEvent('evolution').setup(run, node, random.seededRandom('x', 'y')), null,
				'sem evolução especial, o evento não vale');

			// Pokémon ferido: sem poção, a ajuda fica indisponível; com poção, ele entra pela captura
			start('injured', () => { run.items = []; });
			assert(eventNode.view(context).choices.find(choice => choice.id === 'help').disabled);
			assert.equal(eventNode.choose(context, 'help'), null);
			run.items = ['potion'];
			assert.equal(eventNode.choose(context, 'help'), false);
			assert.deepEqual(run.items, []);
			assert.equal(run.decisions[run.decisions.length - 1].kind, 'capture');
			run.decisions = [];

			// Árvore de berries: chacoalhar começa uma batalha; a vitória dá a berry
			const tree = start('berrytree');
			assert.equal(eventNode.choose(context, 'shake'), false);
			assert.deepEqual(run.nodeState.battle.species, tree.species);
			const encounter = battles.currentEncounter(run);
			assert.equal(encounter.kind, 'wild');
			assert.equal(encounter.team.length, tree.species.length);
			db.saveRun(run);
			const battle = db.createBattle(run.id, run.act, run.node, [run.team[0].uid]);
			battles.finishExpeditionBattle(battle.id, 'win', [{ index: 0, hp: 1, ppUsed: [0], fainted: false }]);
			const after = db.getRun(run.id);
			assert(after.items.includes(tree.berry), 'a berry da vitória');
			assert.deepEqual(after.lastBattle.items, [tree.berry]);
			assert.equal(after.nodeDone, true);

			// Sombra: cura 30% do HP de quem não desmaiou
			start('berrytree', () => {
				run.team[0].hp = 0.5;
				run.team[0].fainted = false;
			});
			assert.equal(eventNode.choose(context, 'rest'), false);
			assert.equal(run.team[0].hp, 0.5 + events.SHADE_HEAL);
		});

		it('hides test variants from players and gives up runs', () => {
			assert.equal(runs.startRun(user, 'teste'), 'disabled', 'a variação de teste é só para administradores');
			assert.equal(runs.startRun(user, 'nope'), 'novariant');
			const run = runs.startRun(user, 'unitteste');
			runs.abandonRun(user, run);
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
