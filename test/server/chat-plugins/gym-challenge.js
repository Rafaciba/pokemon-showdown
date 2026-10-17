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
	return { name, title: '', type, team, avatar: '', badgeImage: null };
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

		it('marks our formats as custom', () => {
			assert.equal(Dex.formats.get('desafiotestepoc').customFormat, true);
			assert.equal(Dex.formats.get('gen9ou').customFormat, undefined);
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
});
