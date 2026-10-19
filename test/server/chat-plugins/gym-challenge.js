/**
 * Testes do plugin Desafio de Ginásios (pokemon-showdown-custom).
 * Rodar: npx mocha test/main.js test/server/chat-plugins/gym-challenge.js
 */
'use strict';

const assert = require('../../assert');

const { GymStore } = require('../../../dist/server/chat-plugins/gym-challenge/store');
const rules = require('../../../dist/server/chat-plugins/gym-challenge/rules');
const { effectiveAILevel, isAILevel } = require('../../../dist/server/chat-plugins/gym-challenge/levels');
const teams = require('../../../dist/server/chat-plugins/gym-challenge/teams');
const challenges = require('../../../dist/server/chat-plugins/gym-challenge/challenges');
const formats = require('../../../dist/server/chat-plugins/gym-challenge/formats');

const FIRE_TEAM = `
Charizard @ Charizardite Y
Ability: Blaze
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Flamethrower
- Solar Beam

Arcanine @ Leftovers
Ability: Intimidate
EVs: 252 HP / 252 Atk / 4 Spe
Adamant Nature
- Flare Blitz
- Extreme Speed
`;

function challengeInput(overrides = {}) {
	return {
		name: 'Liga Teste', baseFormat: 'gen9nationaldex', customRules: '', typeMode: 'fixed', gymCount: 2,
		orderMode: 'free', hasElite4: true, teamLock: false, baseAILevel: 'random', timerMode: 'free',
		turnSeconds: null, lossLimit: null, eliminateOnElite4Loss: false, eliminateOnChampionLoss: false,
		...overrides,
	};
}

function trainerInput(name, type, team = 'packed') {
	return { name, title: '', type, team, avatar: '' };
}

describe('Gym Challenge', () => {
	describe('store', () => {
		let store;
		beforeEach(() => {
			store = new GymStore(':memory:');
		});
		afterEach(() => store.close());

		it('creates, updates and lists trainers', () => {
			const brock = store.createTrainer(trainerInput('Brock', 'Rock'));
			assert.equal(store.getTrainer(brock.id).name, 'Brock');
			store.updateTrainer(brock.id, trainerInput('Brock', 'Ground'));
			assert.equal(store.getTrainer(brock.id).type, 'Ground');
			store.createTrainer(trainerInput('Agatha', 'Ghost'));
			assert.deepEqual(store.listTrainers().map(t => t.name), ['Agatha', 'Brock']);
		});

		it('creates challenges as drafts and records status changes', () => {
			const challenge = store.createChallenge(challengeInput());
			assert.equal(challenge.status, 'draft');
			assert.equal(challenge.hasElite4, true);
			assert.equal(challenge.openedAt, null);
			store.setChallengeStatus(challenge.id, 'open');
			const opened = store.getChallenge(challenge.id);
			assert.equal(opened.status, 'open');
			assert(opened.openedAt > 0);
			assert.equal(store.listChallenges('open').length, 1);
			assert.equal(store.listChallenges('draft').length, 0);
		});

		it('reopens closed challenges', () => {
			const challenge = store.createChallenge(challengeInput());
			store.setChallengeStatus(challenge.id, 'open');
			store.setChallengeStatus(challenge.id, 'closed');
			assert(store.getChallenge(challenge.id).closedAt > 0);
			store.setChallengeStatus(challenge.id, 'open');
			const reopened = store.getChallenge(challenge.id);
			assert.equal(reopened.status, 'open');
			assert.equal(reopened.closedAt, null);
		});

		it('only deletes draft challenges', () => {
			const draft = store.createChallenge(challengeInput({ name: 'Rascunho' }));
			const open = store.createChallenge(challengeInput({ name: 'Aberto' }));
			store.setChallengeStatus(open.id, 'open');
			assert.equal(store.deleteDraftChallenge(open.id), false);
			assert.equal(store.deleteDraftChallenge(draft.id), true);
			assert.equal(store.getChallenge(draft.id), null);
		});

		it('does not delete trainers used by a challenge', () => {
			const brock = store.createTrainer(trainerInput('Brock', 'Rock'));
			const misty = store.createTrainer(trainerInput('Misty', 'Water'));
			const challenge = store.createChallenge(challengeInput());
			store.setStage(challenge.id, { kind: 'gym', position: 1, trainerId: brock.id, aiLevel: null });
			store.setPoolEntry(challenge.id, { trainerId: misty.id, aiLevel: null });
			assert.deepEqual(store.challengesUsingTrainer(brock.id), [challenge.id]);
			assert.equal(store.deleteTrainer(brock.id), false);
			assert.equal(store.deleteTrainer(misty.id), false);
			store.removePoolEntry(challenge.id, misty.id);
			assert.equal(store.deleteTrainer(misty.id), true);
		});

		it('upserts and prunes stages', () => {
			const t = store.createTrainer(trainerInput('Lorelei', 'Ice'));
			const challenge = store.createChallenge(challengeInput({ gymCount: 3 }));
			for (const position of [1, 2, 3]) {
				store.setStage(challenge.id, { kind: 'gym', position, trainerId: t.id, aiLevel: null });
			}
			store.setStage(challenge.id, { kind: 'elite4', position: 1, trainerId: t.id, aiLevel: null });
			store.setStage(challenge.id, { kind: 'gym', position: 1, trainerId: t.id, aiLevel: 'random' });
			assert.equal(store.getStages(challenge.id).find(s => s.kind === 'gym' && s.position === 1).aiLevel, 'random');
			store.pruneStages(challenge.id, 2, false);
			assert.deepEqual(store.getStages(challenge.id).map(s => `${s.kind}${s.position}`), ['gym1', 'gym2']);
		});

		it('clears the random pool', () => {
			const misty = store.createTrainer(trainerInput('Misty', 'Water'));
			const challenge = store.createChallenge(challengeInput());
			store.setPoolEntry(challenge.id, { trainerId: misty.id, aiLevel: null });
			store.clearPool(challenge.id);
			assert.deepEqual(store.getPool(challenge.id), []);
		});

		it('rejects duplicate challenge names', () => {
			store.createChallenge(challengeInput());
			assert.throws(() => store.createChallenge(challengeInput()));
		});
	});

	describe('rules', () => {
		it('validates challenge settings', () => {
			assert.deepEqual(rules.checkChallengeSettings(challengeInput()), []);
			const messages = input => rules.checkChallengeSettings(challengeInput(input)).map(p => p.message);
			assert(messages({ name: '' }).some(m => m.includes('empty')));
			assert(messages({ name: 'a|b' }).some(m => m.includes('cannot contain')));
			// Texto que iria para o protocolo, HTML ou nome de formato
			for (const name of ['Liga\nNova', 'Liga <b>', 'Liga & Cia', 'Liga "X"', 'Liga@@@Mega', 'Liga\\X', 'Liga\u0000']) {
				assert(messages({ name }).some(m => m.includes('cannot contain')), JSON.stringify(name));
			}
			assert.deepEqual(messages({ name: "Liga Kanto (Fácil) - Lt. Surge's" }), [], 'acentos, parênteses, hífen e apóstrofo valem');
			assert(messages({ gymCount: 0 }).some(m => m.includes('number of gyms')));
			assert(messages({ gymCount: 19 }).some(m => m.includes('number of gyms')));
			assert(messages({ timerMode: 'turn', turnSeconds: null }).some(m => m.includes('turn time')));
			assert.deepEqual(messages({ timerMode: 'turn', turnSeconds: 60 }), []);
			assert(messages({ lossLimit: 0 }).some(m => m.includes('loss limit')));
			assert(messages({ hasElite4: false, eliminateOnElite4Loss: true }).some(m => m.includes('Elite Four')));
			assert(messages({ baseAILevel: 'genius' }).some(m => m.includes('difficulty')));
		});

		it('checks a fixed-type challenge is ready to open', () => {
			const trainers = new Map([
				[1, { id: 1, name: 'Brock', type: 'Rock' }],
				[2, { id: 2, name: 'Misty', type: 'Water' }],
				[3, { id: 3, name: 'Red', type: null }],
			]);
			const challenge = { ...challengeInput({ hasElite4: false }), id: 1, status: 'draft' };
			const stages = [
				{ kind: 'gym', position: 1, trainerId: 1, aiLevel: null },
			];
			let problems = rules.checkReadyToOpen(challenge, stages, [], trainers).map(p => p.message);
			assert.deepEqual(problems, ['Gym {0} has no trainer.', 'The Champion has no trainer.']);

			stages.push({ kind: 'gym', position: 2, trainerId: 3, aiLevel: null });
			stages.push({ kind: 'champion', position: 1, trainerId: 3, aiLevel: null });
			problems = rules.checkReadyToOpen(challenge, stages, [], trainers).map(p => p.message);
			assert(problems.some(m => m.includes('has no type')), 'líder sem tipo');

			stages[1].trainerId = 2;
			assert.deepEqual(rules.checkReadyToOpen(challenge, stages, [], trainers), [], 'Campeão pode não ter tipo');
		});

		it('requires the Elite Four when enabled', () => {
			const trainers = new Map([[1, { id: 1, name: 'Lance', type: 'Dragon' }]]);
			const challenge = { ...challengeInput({ gymCount: 1 }), id: 1, status: 'draft' };
			const stages = [
				{ kind: 'gym', position: 1, trainerId: 1, aiLevel: null },
				{ kind: 'champion', position: 1, trainerId: 1, aiLevel: null },
			];
			const positions = rules.checkReadyToOpen(challenge, stages, [], trainers).map(p => p.args[0]);
			assert.deepEqual(positions, [1, 2, 3, 4]);
		});

		it('requires the random pool to cover the number of gyms', () => {
			const trainers = new Map([
				[1, { id: 1, name: 'Brock', type: 'Rock' }],
				[2, { id: 2, name: 'Olivine', type: 'Rock' }],
				[3, { id: 3, name: 'Misty', type: 'Water' }],
				[4, { id: 4, name: 'Red', type: null }],
			]);
			const challenge = { ...challengeInput({ typeMode: 'random', gymCount: 3, hasElite4: false }), id: 1, status: 'draft' };
			const stages = [{ kind: 'champion', position: 1, trainerId: 4, aiLevel: null }];
			const pool = [1, 2, 3].map(trainerId => ({ trainerId, aiLevel: null }));
			assert.deepEqual(rules.poolTypes(pool, trainers), ['Rock', 'Water']);
			const problems = rules.checkReadyToOpen(challenge, stages, pool, trainers);
			assert.equal(problems.length, 1);
			assert.deepEqual(problems[0].args, [2, 3]);
			challenge.gymCount = 2;
			assert.deepEqual(rules.checkReadyToOpen(challenge, stages, pool, trainers), []);
		});

		it('uses the base difficulty as the minimum', () => {
			assert.equal(effectiveAILevel('random', null), 'random');
			assert.equal(effectiveAILevel('random', 'random'), 'random');
			assert(isAILevel('random'));
			assert(!isAILevel('genius'));
		});
	});

	describe('teams', () => {
		const challenge = { baseFormat: 'gen9nationaldex', customRules: '' };

		it('imports teambuilder exports', () => {
			const result = teams.importTeam(FIRE_TEAM);
			assert(result.team);
			assert.equal(teams.importTeam('').error !== undefined, true);
		});

		it('imports teams pasted with <br /> or other line breaks', () => {
			const expected = teams.importTeam(FIRE_TEAM).team;
			const lines = FIRE_TEAM.trim().split('\n');
			assert.equal(teams.importTeam(lines.join('  <br />')).team, expected, '<br />');
			assert.equal(teams.importTeam(lines.join('<br>')).team, expected, '<br>');
			assert.equal(teams.importTeam(lines.join('&#13;')).team, expected, '&#13;');
			assert.equal(teams.importTeam(lines.join('\r\n')).team, expected, 'Windows');
		});

		it('rejects broken teams even without a trainer type', () => {
			// Uma linha só (sem quebras): vira um Pokémon com item inexistente e sem golpes
			const broken = teams.importTeam('Tyranitar @ Leftovers Ability: Sand Stream - Crunch').team;
			assert(teams.checkTeamType(broken, null).length > 0, 'sem tipo também valida');
			assert.deepEqual(teams.checkTeamType(teams.importTeam(FIRE_TEAM).team, null), []);
		});

		it('validates the leader type with Force Monotype', () => {
			const { team } = teams.importTeam(FIRE_TEAM);
			assert.deepEqual(teams.validateTeam(team, challenge, 'Fire'), []);
			const problems = teams.validateTeam(team, challenge, 'Water');
			assert(problems.some(p => p.includes('Charizard must have Water type')));
			// Campeão: sem restrição de tipo
			assert.deepEqual(teams.validateTeam(team, challenge, null), []);
		});

		it('applies the challenge custom rules', () => {
			const { team } = teams.importTeam(FIRE_TEAM);
			const problems = teams.validateTeam(team, { ...challenge, customRules: '- Mega' }, 'Fire');
			assert(problems.length > 0, 'Mega banida pelas regras do desafio');
		});

		it('checks the base format', () => {
			assert.equal(teams.checkFormat(challenge), null);
			assert(teams.checkFormat({ baseFormat: 'formatoquenaoexiste', customRules: '' }).message.includes('not found'));
			assert(teams.checkFormat({ baseFormat: 'gen9randombattle', customRules: '' }).message.includes('generated teams'));
			assert(teams.checkFormat({ ...challenge, customRules: 'Regra Inventada' }).message.includes('Invalid rules'));
		});
	});

	describe('challenges', () => {
		let trainers;
		before(() => {
			const { team } = teams.importTeam(FIRE_TEAM);
			trainers = new Map([
				[1, { id: 1, name: 'Blaine', type: 'Fire', team }],
				[2, { id: 2, name: 'Misty', type: 'Water', team }],
				[3, { id: 3, name: 'Red', type: null, team }],
			]);
		});
		const ready = (overrides = {}) => ({
			...challenges.DEFAULT_CHALLENGE, gymCount: 1, hasElite4: false, ...overrides,
			name: 'Liga', id: 1, status: 'draft',
		});

		it('starts new challenges without an Elite Four', () => {
			assert.equal(challenges.DEFAULT_CHALLENGE.hasElite4, false);
		});

		it('uses a valid default format', () => {
			assert.equal(teams.checkFormat(challenges.DEFAULT_CHALLENGE), null);
			assert.deepEqual(rules.checkChallengeSettings({ ...challenges.DEFAULT_CHALLENGE, name: 'Liga' }), []);
		});

		it('validates the trainers teams in the challenge format', () => {
			const challenge = ready({ gymCount: 1, hasElite4: false });
			const stages = [
				{ kind: 'gym', position: 1, trainerId: 1, aiLevel: null },
				{ kind: 'champion', position: 1, trainerId: 3, aiLevel: null },
			];
			assert.deepEqual(challenges.challengeProblems(challenge, stages, [], trainers), []);
			// Time de Fogo num ginásio de Água
			stages[0].trainerId = 2;
			const problems = challenges.challengeProblems(challenge, stages, [], trainers);
			assert(problems.length > 0);
			assert(problems.every(p => p.message === 'Team of {0}: {1}' && p.args[0] === 'Misty'));
			// Regras do desafio valem para todos, inclusive o Campeão
			stages[0].trainerId = 1;
			const noMega = challenges.challengeProblems(ready({ customRules: '- Mega' }), stages, [], trainers);
			assert.deepEqual([...new Set(noMega.map(p => p.args[0]))].sort(), ['Blaine', 'Red']);
		});

		it('validates the random pool teams with each trainer type', () => {
			const challenge = ready({ typeMode: 'random', gymCount: 2 });
			const stages = [{ kind: 'champion', position: 1, trainerId: 3, aiLevel: null }];
			const pool = [{ trainerId: 1, aiLevel: null }, { trainerId: 2, aiLevel: null }];
			const problems = challenges.challengeProblems(challenge, stages, pool, trainers);
			assert(problems.length > 0 && problems.every(p => p.args[0] === 'Misty'));
		});

		it('ignores stages outside the current settings', () => {
			const stages = [
				{ kind: 'gym', position: 1, trainerId: 1, aiLevel: null },
				{ kind: 'gym', position: 2, trainerId: 2, aiLevel: null },
				{ kind: 'elite4', position: 1, trainerId: 1, aiLevel: null },
				{ kind: 'champion', position: 1, trainerId: 3, aiLevel: null },
			];
			const active = challenges.activeStages(ready({ gymCount: 1, hasElite4: false }), stages);
			assert.deepEqual(active.map(s => `${s.kind}${s.position}`), ['gym1', 'champion1']);
			const random = challenges.activeStages(ready({ typeMode: 'random', hasElite4: true }), stages);
			assert.deepEqual(random.map(s => `${s.kind}${s.position}`), ['elite41', 'champion1']);
		});

		it('builds letter-only form keys', () => {
			assert.equal(challenges.fieldKey(1), 'b');
			assert.equal(challenges.fieldKey(26), 'ba');
			const keys = Array.from({ length: 500 }, (_, i) => challenges.fieldKey(i + 1));
			assert(keys.every(key => /^[a-z]+$/.test(key)));
			assert.equal(new Set(keys).size, keys.length);
		});
	});

	describe('formats', function () {
		// Bancos em arquivo (o gerador abre o arquivo só para leitura): criar um pode levar segundos no container
		this.timeout(20000);
		const os = require('os');
		const path = require('path');
		const fs = require('fs');
		const known = [
			{ name: '[Gen 9] National Dex AG', mod: 'gen9' },
			{ name: '[Gen 9] National Dex Doubles', mod: 'gen9', gameType: 'doubles' },
			{ name: '[Gen 9] Random Battle', mod: 'gen9', team: 'random' },
			{ name: '[Gen 9] [Desafio] Liga Repetida', mod: 'gen9' },
			{ name: '[Gen 7] Ubers', mod: 'gen7' },
		];
		let dir, dbPath, store;
		beforeEach(() => {
			dir = fs.mkdtempSync(path.join(os.tmpdir(), 'gym-formats-'));
			dbPath = path.join(dir, 'gym.db');
			store = new GymStore(dbPath);
		});
		afterEach(() => {
			store.close();
			fs.rmSync(dir, { recursive: true, force: true });
		});
		const open = input => {
			const challenge = store.createChallenge(challengeInput(input));
			store.setChallengeStatus(challenge.id, 'open');
			return challenge;
		};

		it('generates one format per open challenge', () => {
			const kanto = open({ name: 'Kanto', baseFormat: 'gen9nationaldexag', customRules: 'Terastal Clause, - Mega' });
			store.createChallenge(challengeInput({ name: 'Rascunho' }));
			const closed = open({ name: 'Encerrado' });
			store.setChallengeStatus(closed.id, 'closed');
			const list = formats.buildChallengeFormats(known, dbPath);
			assert.equal(list.length, 1);
			assert.equal(list[0].name, '[Gen 9] [Desafio] Kanto');
			assert.equal(list[0].teambuilderBase, 'gen9nationaldexag');
			assert.deepEqual(list[0].ruleset, ['[Gen 9] National Dex AG', 'Terastal Clause', '- Mega']);
			assert.equal(list[0].gymChallenge, String(kanto.id));
			assert.equal(list[0].mod, 'gen9');
			assert.equal(list[0].searchShow, true);
			assert.equal(list[0].challengeShow, false);
		});

		it('keeps the base game type', () => {
			open({ name: 'Duplas', baseFormat: 'gen9nationaldexdoubles' });
			assert.equal(formats.buildChallengeFormats(known, dbPath)[0].gameType, 'doubles');
		});

		it('skips challenges that would break the format list', () => {
			open({ name: 'Liga Repetida', baseFormat: 'gen9nationaldexag' });
			open({ name: 'Sem Base', baseFormat: 'formatoremovido' });
			open({ name: 'Aleatoria', baseFormat: 'gen9randombattle' });
			open({ name: 'Valida', baseFormat: 'gen9nationaldexag' });
			const errors = [];
			const consoleError = console.error;
			console.error = (...args) => errors.push(args.join(' '));
			try {
				assert.deepEqual(formats.buildChallengeFormats(known, dbPath).map(f => f.name), ['[Gen 9] [Desafio] Valida']);
			} finally {
				console.error = consoleError;
			}
			assert.equal(errors.length, 3);
		});

		it('names the format with the base generation', () => {
			open({ name: 'Johto', baseFormat: 'gen7ubers' });
			const [format] = formats.buildChallengeFormats(known, dbPath);
			assert.equal(format.name, '[Gen 7] [Desafio] Johto');
			assert.equal(format.mod, 'gen7');
			assert.equal(format.teambuilderBase, 'gen7ubers');
		});

		it('returns nothing without a database', () => {
			assert.deepEqual(formats.buildChallengeFormats(known, path.join(dir, 'nao-existe.db')), []);
		});

		it('marks the generated formats as custom', () => {
			assert.equal(Dex.formats.get('gen9ou').customFormat, undefined);
			assert(Dex.formats.all().filter(f => f.section === formats.FORMAT_SECTION).every(f => f.customFormat));
		});
	});

	describe('journeys', () => {
		const journey = require('../../../dist/server/chat-plugins/gym-challenge/journey');
		const trainer = (id, name, type) => ({ id, name, title: 'Leader', type, team: `team-${name}` });
		const trainers = new Map([
			[1, trainer(1, 'Brock', 'Rock')], [2, trainer(2, 'Misty', 'Water')], [3, trainer(3, 'Surge', 'Electric')],
			[4, trainer(4, 'Erika', 'Grass')], [5, trainer(5, 'Olivine', 'Rock')], [6, trainer(6, 'Lance', 'Dragon')],
			[7, trainer(7, 'Red', null)],
		]);
		const challenge = (overrides = {}) => ({
			...challengeInput({ hasElite4: false, gymCount: 2 }), id: 1, status: 'open', ...overrides,
		});
		const stage = (kind, position, trainerId, aiLevel = null) => ({ kind, position, trainerId, aiLevel });
		const runStage = (kind, position) => ({
			kind, position, trainerId: null, trainerName: `${kind}${position}`, trainerTitle: '', type: null, team: '',
			aiLevel: 'random',
		});
		let nextId = 1;
		const battle = (kind, position, result) => ({
			id: nextId++, runId: 1, kind, position, roomid: 'r', result, startedAt: 0, endedAt: 0,
		});

		it('copies the fixed stages', () => {
			const stages = [stage('gym', 1, 1), stage('gym', 2, 2), stage('champion', 1, 7)];
			const run = journey.drawRunStages(challenge(), stages, [], trainers);
			assert.deepEqual(run.map(s => `${s.kind}${s.position}:${s.trainerName}`), ['gym1:Brock', 'gym2:Misty', 'champion1:Red']);
			assert.equal(run[0].team, 'team-Brock');
			assert.equal(run[0].type, 'Rock');
			assert.equal(run[2].type, null, 'Campeão sem tipo');
			assert.equal(run[0].aiLevel, 'random');
		});

		it('copies the chosen badge of each gym into the journey', () => {
			const stages = [
				{ ...stage('gym', 1, 1), badgeId: 'kanto-boulder' },
				{ ...stage('gym', 2, 2), badgeId: 'nao-existe' },
				{ ...stage('champion', 1, 7), badgeId: 'kanto-earth' },
			];
			const run = journey.drawRunStages(challenge(), stages, [], trainers);
			assert.deepEqual([run[0].badgeId, run[0].badgeName, run[0].badgeImage], ['kanto-boulder', 'Boulder Badge', 'kanto-boulder.png']);
			assert.deepEqual([run[1].badgeId, run[1].badgeName], [null, null], 'id fora do catálogo vira "sem insígnia"');
			assert.equal(run[2].badgeId, null, 'Campeão não dá insígnia');
			assert.equal(run[0].trainerAvatar, null, 'sem sprite');
			const withSprite = new Map(trainers);
			withSprite.set(1, { ...trainers.get(1), avatar: 'brock' });
			assert.equal(journey.drawRunStages(challenge(), stages, [], withSprite)[0].trainerAvatar, 'brock');

			const pool = [{ trainerId: 1, aiLevel: null, badgeId: 'hoenn-stone' }, { trainerId: 2, aiLevel: null, badgeId: null }];
			const drawn = journey.drawRunStages(challenge({ typeMode: 'random', gymCount: 2 }), [stage('champion', 1, 7)], pool, trainers);
			const brock = drawn.find(s => s.trainerName === 'Brock');
			const misty = drawn.find(s => s.trainerName === 'Misty');
			assert.equal(brock.badgeName, 'Stone Badge');
			assert.equal(misty.badgeId, null);
		});

		it('draws distinct types for random challenges', () => {
			const pool = [1, 2, 3, 4, 5].map(trainerId => ({ trainerId, aiLevel: null }));
			const stages = [stage('champion', 1, 7)];
			for (let seed = 0; seed < 20; seed++) {
				let n = seed;
				const random = max => (n++ * 7) % max;
				const run = journey.drawRunStages(challenge({ typeMode: 'random', gymCount: 3 }), stages, pool, trainers, random);
				const gyms = run.filter(s => s.kind === 'gym');
				assert.equal(gyms.length, 3);
				assert.equal(new Set(gyms.map(s => s.type)).size, 3, 'tipos distintos');
				assert.deepEqual(gyms.map(s => s.position), [1, 2, 3]);
			}
			const tooMany = journey.drawRunStages(challenge({ typeMode: 'random', gymCount: 5 }), stages, pool, trainers);
			assert.equal(tooMany, null, 'só 4 tipos no banco');
		});

		it('refuses incomplete challenges', () => {
			assert.equal(journey.drawRunStages(challenge(), [stage('gym', 1, 1), stage('champion', 1, 7)], [], trainers), null);
			const withElite4 = challenge({ gymCount: 1, hasElite4: true });
			assert.equal(journey.drawRunStages(withElite4, [stage('gym', 1, 1), stage('champion', 1, 7)], [], trainers), null);
		});

		const leagueRun = [
			runStage('gym', 1), runStage('gym', 2), runStage('elite4', 1), runStage('elite4', 2), runStage('champion', 1),
		];

		it('follows the fixed gym order', () => {
			const progress = journey.computeProgress({ orderMode: 'fixed' }, leagueRun, [battle('gym', 1, 'loss')], 2);
			assert.equal(progress.next.position, 1, 'ignora a escolha na ordem fixa');
			assert.deepEqual(progress.choices, []);
			assert.equal(progress.losses, 1);
		});

		it('lets the player choose in the free order', () => {
			let progress = journey.computeProgress({ orderMode: 'free' }, leagueRun, [], 2);
			assert.equal(progress.next.position, 2);
			assert.equal(progress.choices.length, 2);
			progress = journey.computeProgress({ orderMode: 'free' }, leagueRun, [battle('gym', 2, 'win')], 2);
			assert.deepEqual(progress.badges, [2]);
			assert.equal(progress.next.position, 1, 'escolhido já vencido: primeiro que falta');
		});

		it('runs the Elite Four and Champion in sequence', () => {
			const gyms = [battle('gym', 1, 'win'), battle('gym', 2, 'win')];
			let progress = journey.computeProgress({ orderMode: 'free' }, leagueRun, gyms, null);
			assert.equal(`${progress.next.kind}${progress.next.position}`, 'elite41');
			progress = journey.computeProgress({ orderMode: 'free' }, leagueRun,
				[...gyms, battle('elite4', 1, 'win'), battle('elite4', 2, 'tie'), battle('elite4', 2, 'win')], null);
			assert.equal(progress.next.kind, 'champion', 'empate não conta');
			progress = journey.computeProgress({ orderMode: 'free' }, leagueRun,
				[...gyms, battle('elite4', 1, 'win'), battle('elite4', 2, 'win'), battle('champion', 1, 'loss')], null);
			assert.equal(`${progress.next.kind}${progress.next.position}`, 'elite41', 'derrota volta ao primeiro membro');
			assert.equal(progress.losses, 1);
		});

		it('reports the ongoing battle', () => {
			const progress = journey.computeProgress({ orderMode: 'free' }, leagueRun, [battle('gym', 1, null)], null);
			assert.equal(progress.ongoing.position, 1);
			assert.deepEqual(progress.badges, []);
		});

		it('decides the journey status after a battle', () => {
			const base = { lossLimit: null, eliminateOnElite4Loss: false, eliminateOnChampionLoss: false };
			const status = (rules, kind, result, losses) => journey.statusAfterBattle({ ...base, ...rules }, { kind }, result, { losses });
			assert.equal(status({}, 'champion', 'win', 0), 'won');
			assert.equal(status({}, 'gym', 'win', 0), 'active');
			assert.equal(status({}, 'champion', 'loss', 5), 'active', 'ilimitado');
			assert.equal(status({ lossLimit: 3 }, 'gym', 'loss', 2), 'active');
			assert.equal(status({ lossLimit: 3 }, 'gym', 'loss', 3), 'eliminated');
			assert.equal(status({ eliminateOnElite4Loss: true }, 'elite4', 'loss', 1), 'eliminated');
			assert.equal(status({ eliminateOnElite4Loss: true }, 'champion', 'loss', 1), 'active');
			assert.equal(status({ eliminateOnChampionLoss: true }, 'champion', 'loss', 1), 'eliminated');
			assert.equal(status({ lossLimit: 1 }, 'gym', 'tie', 1), 'active', 'empate não conta');
		});

		it('ignores nicknames and order in the team lock', () => {
			const { team } = teams.importTeam(FIRE_TEAM);
			const sets = Teams.unpack(team);
			const renamed = Teams.pack([{ ...sets[1], name: 'Cachorro' }, sets[0]]);
			assert.equal(journey.teamHash(renamed), journey.teamHash(team));
			const changed = Teams.pack([{ ...sets[0], item: 'Leftovers' }, sets[1]]);
			assert.notEqual(journey.teamHash(changed), journey.teamHash(team));
		});

		describe('store', () => {
			let store;
			beforeEach(() => {
				store = new GymStore(':memory:');
			});
			afterEach(() => store.close());

			it('keeps one active journey per player in each challenge', () => {
				const a = store.createChallenge(challengeInput({ name: 'A' }));
				const b = store.createChallenge(challengeInput({ name: 'B' }));
				const run = store.createRun(a.id, 'ash', [runStage('gym', 1), runStage('champion', 1)]);
				assert.throws(() => store.createRun(a.id, 'ash', []));
				store.createRun(b.id, 'ash', []);
				store.createRun(a.id, 'gary', []);
				assert.equal(store.getActiveRun(a.id, 'ash').id, run.id);
				assert.deepEqual(store.getRunStages(run.id).map(s => s.kind), ['gym', 'champion']);
				store.setRunStatus(run.id, 'abandoned');
				assert(store.getRun(run.id).endedAt > 0);
				assert.equal(store.getActiveRun(a.id, 'ash'), null);
				store.createRun(a.id, 'ash', []);
				assert.equal(store.listRuns(a.id, 'ash').length, 2);
			});

			it('keeps the badge of each stage, pool entry and journey stage', () => {
				const c = store.createChallenge(challengeInput());
				const brock = store.createTrainer(trainerInput('Brock', 'Rock'));
				store.setStage(c.id, { kind: 'gym', position: 1, trainerId: brock.id, aiLevel: null, badgeId: 'kanto-boulder' });
				store.setStage(c.id, { kind: 'gym', position: 2, trainerId: brock.id, aiLevel: null });
				assert.deepEqual(store.getStages(c.id).map(st => st.badgeId), ['kanto-boulder', null]);
				store.setPoolEntry(c.id, { trainerId: brock.id, aiLevel: null, badgeId: 'johto-zephyr' });
				store.setPoolEntry(c.id, { trainerId: brock.id, aiLevel: 'easy', badgeId: 'hoenn-stone' });
				assert.deepEqual(store.getPool(c.id).map(e => [e.aiLevel, e.badgeId]), [['easy', 'hoenn-stone']]);
				const run = store.createRun(c.id, 'ash', [
					{ ...runStage('gym', 1), badgeId: 'kanto-boulder', badgeName: 'Boulder Badge', badgeImage: 'kanto-boulder.png' },
					runStage('champion', 1),
				]);
				const stages = store.getRunStages(run.id);
				assert.deepEqual([stages[0].badgeId, stages[0].badgeName, stages[0].badgeImage],
					['kanto-boulder', 'Boulder Badge', 'kanto-boulder.png']);
				assert.equal(stages[1].badgeName, null);
				assert(store.setTrainerAvatar(brock.id, 'brock'));
				assert.equal(store.getTrainer(brock.id).avatar, 'brock');
				const run2 = store.createRun(c.id, 'gary', [{ ...runStage('gym', 1), trainerAvatar: 'brock' }]);
				assert.equal(store.getRunStages(run2.id)[0].trainerAvatar, 'brock');
			});

			it('records battles', () => {
				const c = store.createChallenge(challengeInput());
				const run = store.createRun(c.id, 'ash', []);
				const first = store.startBattle(run.id, 'gym', 1, 'battle-1');
				assert.equal(first.result, null);
				assert(store.finishBattle(first.id, 'win'));
				assert(!store.finishBattle(first.id, 'loss'), 'resultado não muda');
				store.startBattle(run.id, 'gym', 2, 'battle-2');
				assert.deepEqual(store.getRunBattles(run.id).map(b => b.result), ['win', null]);
			});

			it('saves the state of battles in progress only', () => {
				const c = store.createChallenge(challengeInput());
				const run = store.createRun(c.id, 'ash', []);
				const battle = store.startBattle(run.id, 'gym', 1, 'battle-1');
				assert.equal(battle.savedAt, null);
				assert.equal(store.getBattleState(battle.id), null);
				assert(store.saveBattleState(battle.id, '>start {}'));
				assert(store.getRunBattle(battle.id).savedAt > 0);
				assert.equal(store.getBattleState(battle.id), '>start {}');
				assert(store.finishBattle(battle.id, 'loss'));
				// Minimização: o estado só existe enquanto a batalha está em andamento
				assert.equal(store.getBattleState(battle.id), null);
				assert.equal(store.getRunBattle(battle.id).savedAt, null);
				const row = store.db.prepare('SELECT input_log FROM run_battles WHERE id = ?').get(battle.id);
				assert.equal(row.input_log, null);
				assert(!store.saveBattleState(battle.id, '>start {}'), 'batalha terminada não é salva');
			});

			it('lists the saved battles that still count', () => {
				const c = store.createChallenge(challengeInput());
				const active = store.createRun(c.id, 'ash', []);
				const saved = store.startBattle(active.id, 'gym', 1, 'battle-1');
				store.startBattle(active.id, 'gym', 2, 'battle-2'); // sem estado salvo
				store.saveBattleState(saved.id, '>start {}');
				store.setBattleRoom(saved.id, 'battle-3');
				assert.deepEqual(store.listSavedBattles('ash').map(b => [b.id, b.roomid]), [[saved.id, 'battle-3']]);
				// Encerrada pelo admin: o resultado ainda conta
				store.setRunStatus(active.id, 'closed');
				assert.equal(store.listSavedBattles('ash').length, 1);
				// Desistência: não conta mais
				store.setRunStatus(active.id, 'abandoned');
				assert.deepEqual(store.listSavedBattles('ash'), []);
				assert.deepEqual(store.listSavedBattles('gary'), []);
			});

			it('closes the active journeys of a challenge', () => {
				const c = store.createChallenge(challengeInput());
				const ash = store.createRun(c.id, 'ash', []);
				const gary = store.createRun(c.id, 'gary', []);
				store.setRunStatus(gary.id, 'won');
				// Como no encerramento do desafio pelo admin: dentro de outra transação
				const closed = store.transaction(() => {
					store.setChallengeStatus(c.id, 'closed');
					return store.closeActiveRuns(c.id);
				});
				assert.deepEqual(closed, [ash.id]);
				assert.equal(store.getRun(ash.id).status, 'closed');
				assert.equal(store.getRun(gary.id).status, 'won');
			});

			it('lists and deletes the data of a player', () => {
				const a = store.createChallenge(challengeInput({ name: 'A' }));
				const b = store.createChallenge(challengeInput({ name: 'B' }));
				const first = store.createRun(a.id, 'ash', [runStage('gym', 1), runStage('champion', 1)]);
				store.startBattle(first.id, 'gym', 1, 'battle-1');
				store.setRunStatus(first.id, 'won');
				const second = store.createRun(b.id, 'ash', [runStage('gym', 1)]);
				const gary = store.createRun(a.id, 'gary', [runStage('gym', 1)]);
				assert.deepEqual(store.listUserRuns('ash').map(r => r.id), [second.id, first.id]);

				assert.equal(store.deleteUserData('ash'), 2);
				assert.deepEqual(store.listUserRuns('ash'), []);
				const orphans = store.db.prepare(
					'SELECT (SELECT count(*) FROM run_stages WHERE run_id IN (?, ?)) + (SELECT count(*) FROM run_battles WHERE run_id IN (?, ?)) AS n'
				).get(first.id, second.id, first.id, second.id);
				assert.equal(orphans.n, 0, 'etapas e batalhas apagadas em cascata');
				assert.equal(store.getRun(gary.id).userid, 'gary', 'outros jogadores não são afetados');
			});

			it('rolls back nested transactions together', () => {
				const c = store.createChallenge(challengeInput());
				assert.throws(() => store.transaction(() => {
					store.createRun(c.id, 'ash', []);
					store.transaction(() => store.setChallengeStatus(c.id, 'open'));
					throw new Error('falha');
				}));
				assert.equal(store.getChallenge(c.id).status, 'draft');
				assert.equal(store.listRuns(c.id).length, 0);
			});
		});
	});

	describe('AI', () => {
		const { readBattleState, remainingCount } = require('../../../dist/server/chat-plugins/gym-challenge/battle-view');
		const { HeuristicAI } = require('../../../dist/server/chat-plugins/gym-challenge/heuristic-ai');
		const { createAI } = require('../../../dist/server/chat-plugins/gym-challenge/ai');

		/** Pokémon do nosso lado (p2) num pedido do simulador. */
		const mon = (species, moves, options = {}) => {
			const level = options.level || 100;
			const base = Dex.species.get(species).baseStats;
			const stat = b => Math.floor((2 * b + 31 + 21) * level / 100) + 5;
			const maxHP = Math.floor((2 * base.hp + 31 + 21) * level / 100) + level + 10;
			const hp = options.hp === undefined ? maxHP : Math.floor(maxHP * options.hp / 100);
			return {
				ident: `p2: ${species}`, details: `${species}, L${level}`, condition: hp ? `${hp}/${maxHP}${options.status ? ` ${options.status}` : ''}` : '0 fnt',
				active: !!options.active, moves: moves.map(toID), baseAbility: toID(options.ability || Dex.species.get(species).abilities[0]),
				ability: toID(options.ability || Dex.species.get(species).abilities[0]), item: '', pokeball: 'pokeball',
				stats: { atk: stat(base.atk), def: stat(base.def), spa: stat(base.spa), spd: stat(base.spd), spe: stat(base.spe) },
			};
		};
		const moveRequest = (team, extra = {}) => {
			const active = team.find(m => m.active);
			return {
				active: [{ moves: active.moves.map(id => ({ move: id, id, pp: 10, maxpp: 10, target: 'normal', disabled: false })), ...extra }],
				side: { name: 'NPC', id: 'p2', pokemon: team },
			};
		};
		/** Log com o adversário (p1) em campo. */
		const logWith = (species, condition = '100/100', more = []) => [
			'|teamsize|p1|6', `|switch|p1a: ${species}|${species}, L100|${condition}`, '|turn|1', ...more,
		];
		const choose = (level, request, log) => new HeuristicAI(level, () => 0.99).choose(request, { log });

		it('reads the public battle log', () => {
			const state = readBattleState([
				'|teamsize|p1|3', '|switch|p1a: Chomp|Garchomp, L80, M|100/100', '|move|p1a: Chomp|Earthquake|p2a: X',
				'|-damage|p1a: Chomp|45/100', '|-status|p1a: Chomp|brn', '|-boost|p1a: Chomp|atk|2',
				'|-sidestart|p1: Ash|move: Stealth Rock', '|-sidestart|p1: Ash|Spikes', '|-sidestart|p1: Ash|Spikes',
				'|switch|p1a: Bird|Skarmory, L80|100/100', '|faint|p1a: Bird', '|turn|3',
			]);
			const chomp = state.sides.p1.pokemon.get('Chomp');
			assert.equal(chomp.species, 'Garchomp');
			assert.equal(chomp.level, 80);
			assert.equal(chomp.hp, 45);
			assert.equal(chomp.status, 'brn');
			assert.deepEqual(chomp.boosts, {}, 'boosts zeram ao sair');
			assert(chomp.moves.has('earthquake'));
			assert.equal(state.sides.p1.conditions.get('stealthrock'), 1);
			assert.equal(state.sides.p1.conditions.get('spikes'), 2);
			assert.equal(remainingCount(state.sides.p1), 2);
			assert.equal(state.turn, 3);
		});

		it('easy goes for raw damage, medium checks types', () => {
			const team = [mon('Garchomp', ['earthquake', 'dragonclaw'], { active: true }), mon('Starmie', ['surf'])];
			const log = logWith('Skarmory');
			assert.equal(choose('easy', moveRequest(team), log), 'move 1', 'Fácil ignora a imunidade de Skarmory a Terra');
			assert.equal(choose('medium', moveRequest(team), log), 'move 2');
		});

		it('medium switches out of a bad type matchup', () => {
			const team = [mon('Charizard', ['flamethrower', 'airslash'], { active: true }), mon('Starmie', ['surf', 'psychic'])];
			assert.equal(choose('medium', moveRequest(team), logWith('Golem')), 'switch 2');
			assert.equal(choose('easy', moveRequest(team), logWith('Golem')), 'move 1', 'Fácil não troca por tipo');
			const trapped = moveRequest(team, { trapped: true });
			assert(choose('medium', trapped, logWith('Golem')).startsWith('move'), 'preso não troca');
		});

		it('picks the best matchup on forced switches and team preview', () => {
			const team = [
				mon('Charizard', ['flamethrower'], { hp: 0 }), mon('Venusaur', ['tackle']), mon('Starmie', ['surf', 'psychic']),
			];
			const request = { forceSwitch: [true], side: { name: 'NPC', id: 'p2', pokemon: team } };
			assert.equal(choose('medium', request, logWith('Golem')), 'switch 3');
			assert.equal(choose('easy', request, logWith('Golem')), 'switch 2', 'Fácil: o primeiro mais saudável');

			const preview = { teamPreview: true, side: { name: 'NPC', id: 'p2', pokemon: team.map(m => ({ ...m, condition: '300/300' })) } };
			const previewLog = ['|poke|p1|Golem, L100|', '|poke|p1|Rhydon, L100|', '|teampreview'];
			assert.equal(choose('easy', preview, previewLog), 'team 123');
			assert.equal(choose('medium', preview, previewLog), 'team 312', 'Médio abre com quem vai bem contra Pedra/Terra');
		});

		it('hard sets hazards and inflicts status, respecting immunities', () => {
			const team = [mon('Skarmory', ['stealthrock', 'toxic', 'bravebird'], { active: true }), mon('Starmie', ['surf'])];
			assert.equal(choose('hard', moveRequest(team), logWith('Snorlax')), 'move 1', 'Stealth Rock com o adversário inteiro');
			assert.equal(choose('medium', moveRequest(team), logWith('Snorlax')), 'move 3', 'Médio não usa hazards nem status');
			const rocksUp = logWith('Snorlax', '100/100', ['|-sidestart|p1: Ash|move: Stealth Rock']);
			assert.equal(choose('hard', moveRequest(team), rocksUp), 'move 2', 'Toxic depois do Stealth Rock');
			assert.notEqual(choose('hard', moveRequest(team), [...rocksUp.slice(0, 1), '|switch|p1a: Muk|Muk, L100|100/100']), 'move 2',
				'Muk (Veneno) é imune a Toxic');
		});

		it('hard respects the Sleep Clause and Ground immunity to Thunder Wave', () => {
			const team = [mon('Breloom', ['spore', 'machpunch'], { active: true }), mon('Jolteon', ['thunderwave', 'thunderbolt'])];
			const asleep = ['|teamsize|p1|6', '|switch|p1a: Lapras|Lapras, L100|100/100', '|-status|p1a: Lapras|slp',
				'|switch|p1a: Snorlax|Snorlax, L100|100/100', '|turn|2'];
			assert.equal(choose('hard', moveRequest(team), logWith('Snorlax')), 'move 1', 'Spore sem ninguém dormindo');
			assert.equal(choose('hard', moveRequest(team), asleep), 'move 2', 'Sleep Clause');
			const jolteon = [mon('Breloom', ['spore']), mon('Jolteon', ['thunderwave', 'shadowball'], { active: true })];
			const stuck = moveRequest(jolteon, { trapped: true });
			assert.equal(choose('hard', stuck, logWith('Golem')), 'move 2', 'Golem (Terra) é imune a Thunder Wave');
		});

		it('hard skips status moves when about to be knocked out', () => {
			const team = [mon('Skarmory', ['toxic', 'bravebird'], { active: true, hp: 10 }), mon('Starmie', ['surf'])];
			assert.equal(choose('hard', moveRequest(team, { trapped: true }), logWith('Magnezone')), 'move 2');
		});

		it('hard sets up with stat boosts when it is safe', () => {
			// Garchomp contra Ferrothorn (aguenta golpes físicos e quase não causa dano): Swords Dance antes de atacar
			const team = [mon('Garchomp', ['swordsdance', 'earthquake'], { active: true }), mon('Starmie', ['surf'])];
			assert.equal(choose('hard', moveRequest(team), logWith('Ferrothorn')), 'move 1');
			assert.equal(choose('medium', moveRequest(team), logWith('Ferrothorn')), 'move 2', 'Médio não usa buffs');
			// Já com +4 de ataque: ataca
			const boosted = logWith('Ferrothorn', '100/100', [
				'|switch|p2a: Garchomp|Garchomp, L100|100/100', '|-boost|p2a: Garchomp|atk|4',
			]);
			assert.equal(choose('hard', moveRequest(team), boosted), 'move 2', 'atributo já alto');
			// Com o adversário quase derrotado: nocauteia em vez de se fortalecer
			assert.equal(choose('hard', moveRequest(team), logWith('Ferrothorn', '10/100')), 'move 2');
			// Com pouco HP: não é seguro
			const hurt = [mon('Garchomp', ['swordsdance', 'earthquake'], { active: true, hp: 40 }), mon('Starmie', ['surf'])];
			assert.equal(choose('hard', moveRequest(hurt), logWith('Ferrothorn')), 'move 2');
		});

		it('hard answers the opponent boosts and uses debuffs', () => {
			const team = [mon('Skarmory', ['haze', 'bravebird'], { active: true, ability: 'Sturdy' }), mon('Starmie', ['surf'])];
			const boostedFoe = logWith('Dragonite', '100/100', ['|-boost|p1a: Dragonite|atk|2']);
			assert.equal(choose('hard', moveRequest(team, { trapped: true }), boostedFoe), 'move 1', 'Haze contra +2');
			assert.equal(choose('hard', moveRequest(team, { trapped: true }), logWith('Dragonite')), 'move 2', 'sem buffs: ataca');
			// Debuff: Charm corta o ataque de um atacante físico que ameaça
			const charm = [mon('Clefable', ['charm', 'moonblast'], { active: true }), mon('Starmie', ['surf'])];
			assert.equal(choose('hard', moveRequest(charm, { trapped: true }), logWith('Snorlax')), 'move 1');
		});

		it('mega evolves and defers doubles to the default choice', () => {
			const team = [mon('Charizard', ['flamethrower'], { active: true })];
			assert.equal(choose('medium', moveRequest(team, { canMegaEvo: true }), logWith('Snorlax')), 'move 1 mega');
			const doubles = moveRequest(team);
			doubles.active.push(doubles.active[0]);
			assert.equal(choose('hard', doubles, logWith('Snorlax')), 'default');
		});

		it('creates the AI for each level', () => {
			assert.equal(createAI('random').level, 'random');
			for (const level of ['easy', 'medium', 'hard']) assert.equal(createAI(level).level, level);
		});
	});

	describe('badge catalog', () => {
		const { BADGES } = require('../../../dist/server/chat-plugins/gym-challenge/badge-catalog');

		it('has unique ids, valid types and one image per badge', () => {
			assert(BADGES.length >= 60);
			assert.equal(new Set(BADGES.map(b => b.id)).size, BADGES.length);
			for (const badge of BADGES) {
				assert.match(badge.id, /^[a-z]+-[a-z0-9-]+$/);
				assert.equal(badge.image, `${badge.id}.png`);
				assert(badge.name.endsWith(' Badge'), badge.name);
				assert(badge.leaders.length >= 1, badge.id);
				if (badge.type !== null) assert(Dex.types.get(badge.type).exists, `${badge.id}: ${badge.type}`);
			}
			assert.equal(BADGES.find(b => b.id === 'unova-trio').type, null, 'Trio Badge sem tipo fixo');
		});

		it('lists the badges of the trainer type first', () => {
			const { badgeOptions, badgeMatchesType } = require('../../../dist/server/chat-plugins/gym-challenge/badges');
			const rock = badgeOptions('Rock');
			assert.equal(rock.length, BADGES.length, 'todas continuam disponíveis');
			const firstOther = rock.findIndex(b => b.type !== 'Rock');
			assert(firstOther > 0 && rock.slice(firstOther).every(b => b.type !== 'Rock'));
			const trio = BADGES.find(b => b.id === 'unova-trio');
			assert(badgeMatchesType(trio, 'Fire') && badgeMatchesType(trio, 'Grass') && !badgeMatchesType(trio, 'Rock'));
			assert.equal(badgeOptions(null)[0].id, BADGES[0].id, 'sem tipo: ordem do catálogo');
		});

		it('shows the badge image, or the type icon without a badge', () => {
			const { badgeIcon } = require('../../../dist/server/chat-plugins/gym-challenge/badges');
			const img = badgeIcon({ name: 'Boulder Badge', image: 'kanto-boulder.png' }, 'Rock');
			assert(img.includes(`src="https://${Config.routes.client}/badges/kanto-boulder.png"`));
			assert(img.includes('alt="Boulder Badge"'));
			assert.equal(badgeIcon({ name: null, image: null }, 'Rock'), '<psicon type="Rock" />');
			assert(!badgeIcon({ name: '<b>x</b>', image: 'a.png' }, null).includes('<b>'), 'nome escapado');
		});
	});

	describe('trainer sprites', () => {
		// Carregado depois do ambiente de teste (o módulo de avatares do PS usa Users)
		let sprites;
		before(() => {
			sprites = require('../../../dist/server/chat-plugins/gym-challenge/trainer-sprites');
		});

		it('accepts only official trainer sprites', () => {
			assert(sprites.isTrainerSprite('brock'));
			assert(!sprites.isTrainerSprite('nao-existe'));
			assert(!sprites.isTrainerSprite('#custom'), 'avatares personalizados ficam de fora');
			assert(!sprites.isTrainerSprite('../brock'));
		});

		it('searches sprites by name', () => {
			assert.equal(sprites.spriteQuery(' Brock-Gen3 <b>!'), 'brockgen3b');
			assert(sprites.searchTrainerSprites('brockgen3').includes('brock-gen3'), 'busca ignora hífens');
			const found = sprites.searchTrainerSprites('BROCK');
			assert(found.includes('brock') && found.every(id => id.includes('brock')));
			assert(sprites.searchTrainerSprites('').length > 1000, 'busca vazia lista todos');
		});

		it('renders the sprite image only for official ids', () => {
			assert(sprites.trainerSpriteImg('brock').includes(`src="https://${Config.routes.client}/sprites/trainers/brock.png"`));
			assert.equal(sprites.trainerSpriteImg('nao-existe'), '');
			assert.equal(sprites.trainerSpriteImg(null), '');
		});
	});

	describe('battle save state', () => {
		const { makeUser } = require('../../users-utils');
		const { createNpcBattle, battleStateFromInputLog } = require('../../../dist/server/chat-plugins/gym-challenge/npc-battle');
		const { createAI } = require('../../../dist/server/chat-plugins/gym-challenge/ai');
		const TEAM = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
		let user, room;
		afterEach(() => {
			if (room) room.destroy();
			if (user) {
				user.disconnectAll();
				user.destroy();
			}
			room = user = null;
		});

		/** Espera até `check` ser verdadeiro (a batalha roda de forma assíncrona). */
		const waitFor = async check => {
			for (let i = 0; i < 800 && !check(); i++) {
				await new Promise(resolve => {
					setTimeout(resolve, 10);
				});
			}
			assert(check(), 'tempo esgotado');
		};

		it('removes chat lines from the input log', () => {
			assert.equal(battleStateFromInputLog(['>start {}', '>chat Ash|oi', '>p1 move 1']), '>start {}\n>p1 move 1');
		});

		it('saves the battle at each decision of the challenger', async function () {
			this.timeout(10000);
			const saves = [];
			let interrupted = 0;
			user = makeUser('Save Tester');
			room = createNpcBattle(user, {
				format: 'gen9customgame', team: TEAM,
				npc: { name: 'Gym Bot', team: TEAM, ai: createAI('random') },
				hooks: { onSave: log => saves.push(log), onInterrupted: () => interrupted++ },
			});
			assert(room);
			await waitFor(() => saves.length >= 1);
			assert(saves[0].startsWith('>start '));
			assert(saves[0].includes('>player p1 '));
			assert(saves[0].includes('>player p2 '));

			room.battle.onChatMessage('dado pessoal', user);
			const before = saves.length;
			room.battle.choose(user, 'default');
			// O simulador só grava as escolhas quando o turno fecha, já resolvidas ("team 1")
			await waitFor(() => saves.length > before && saves[saves.length - 1].includes('\n>p1 '));
			const last = saves[saves.length - 1];
			assert(last.includes('\n>p2 '), 'a escolha do NPC também está no log');
			assert(!last.includes('dado pessoal'), 'o chat da sala não é salvo');

			// Sala fechada sem a batalha terminar: avisa (a jornada decide se fica suspensa)
			room.destroy();
			room = null;
			assert.equal(interrupted, 1);
		});

		it('resumes a battle from the saved state', async function () {
			this.timeout(20000);
			const TEAM3 = [
				'Snorlax||leftovers||bodyslam,rest,sleeptalk,curse|Careful|252,,4,,252,|||||',
				'Blissey||leftovers||seismictoss,softboiled,toxic,protect|Bold|252,,252,,4,|||||',
				'Skarmory||leftovers||spikes,roost,bravebird,whirlwind|Impish|252,,252,,4,|||||',
			].join(']');
			const saves = [];
			const hooks = { onSave: log => saves.push(log) };
			const npc = () => ({ name: 'Gym Bot', team: TEAM3, ai: createAI('random') });
			user = makeUser('Resume Tester');
			room = createNpcBattle(user, { format: 'gen9customgame', team: TEAM3, npc: { ...npc(), avatar: 'brock' }, hooks });
			await waitFor(() => room.log.log.includes('|player|p2|Gym Bot|brock|'));
			assert(!room.log.log.includes('|player|p2|Gym Bot||'), 'o NPC já entra com o sprite (sem avatar provisório)');
			const turnOf = battleRoom => battleRoom.battle.turn;
			// Prévia de time e dois turnos
			for (let turn = 1; turn <= 3; turn++) {
				await waitFor(() => !room.battle.p1.request.isWait && room.battle.p1.request.request);
				const count = saves.length;
				room.battle.choose(user, 'default');
				await waitFor(() => turnOf(room) >= turn && saves.length > count && room.battle.p1.request.request);
			}
			await waitFor(() => !room.battle.p1.request.isWait);
			const saved = saves[saves.length - 1];
			const turn = turnOf(room);
			assert(turn >= 2);
			room.destroy();

			// Retomada: o simulador reproduz o log e a batalha continua do mesmo turno
			const resumedSaves = [];
			room = createNpcBattle(user, {
				format: 'gen9customgame', team: '', inputLog: saved, npc: npc(),
				hooks: { onSave: log => resumedSaves.push(log) },
			});
			assert(room);
			const npcErrors = [];
			const receive = room.battle.receive.bind(room.battle);
			room.battle.receive = lines => {
				if (lines[0] === 'sideupdate' && lines[1] === 'p2' && lines[2].startsWith('|error|')) npcErrors.push(lines[2]);
				receive(lines);
			};
			await waitFor(() => turnOf(room) === turn && !room.battle.p1.request.isWait && room.battle.p1.request.request);
			assert.equal(room.battle.p1.name, 'Resume Tester');
			assert(room.log.log.includes('|player|p2|Gym Bot|brock|'), 'sprite do NPC volta na retomada');
			assert(room.log.log.some(line => line.startsWith('|move|')), 'o histórico da batalha volta para a sala');
			// O NPC responde ao pedido atual, e o turno seguinte acontece normalmente
			room.battle.choose(user, 'default');
			await waitFor(() => turnOf(room) === turn + 1);
			const last = resumedSaves[resumedSaves.length - 1];
			assert(last.startsWith(saved), 'o estado novo continua o salvo');
			assert.deepEqual(npcErrors, [], 'o NPC não responde aos pedidos antigos da reprodução');
		});
	});
});
