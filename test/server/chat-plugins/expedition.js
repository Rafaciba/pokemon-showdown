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
			assert.equal(built.map.weights.trainer, 20, 'a elite conta como treinador até a etapa 7');
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
			assert(db.hasUnlock(user.id, 'starter', 'pikachu'), 'vencer dá o desbloqueio da variação');
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
