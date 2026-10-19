/**
 * Testes do plugin de contas (pokemon-showdown-custom): retenção e exclusão dos
 * logs de batalha e as batalhas em andamento de uma conta excluída.
 */
'use strict';

const assert = require('../../assert');
const fs = require('fs');
const os = require('os');
const path = require('path');

const accounts = require('../../../dist/server/chat-plugins/custom-accounts');

describe('Custom accounts: battle logs', () => {
	let logsDir;
	const write = (day, file, data) => {
		const dir = path.join(logsDir, day.slice(0, 7), 'gen9randombattle', day);
		fs.mkdirSync(dir, { recursive: true });
		fs.writeFileSync(path.join(dir, file), JSON.stringify(data));
		return path.join(dir, file);
	};
	beforeEach(() => {
		logsDir = fs.mkdtempSync(path.join(os.tmpdir(), 'battle-logs-'));
		// Outras pastas de logs do PS não podem ser tocadas
		fs.mkdirSync(path.join(logsDir, 'modlog'), { recursive: true });
		fs.writeFileSync(path.join(logsDir, 'errors.txt'), 'x');
	});
	afterEach(() => fs.rmSync(logsDir, { recursive: true, force: true }));

	it('removes battle logs older than the retention', async () => {
		const old = write('2026-08-01', 'a.log.json', { p1: 'Ash', p2: 'Gary' });
		const recent = write('2026-10-10', 'b.log.json', { p1: 'Ash', p2: 'Gary' });
		const removed = await accounts.cleanupBattleLogs(logsDir, new Date('2026-10-18T12:00:00Z'));
		assert.equal(removed, 1);
		assert(!fs.existsSync(old));
		assert(fs.existsSync(recent));
		assert(fs.existsSync(path.join(logsDir, 'errors.txt')));
		assert(fs.existsSync(path.join(logsDir, 'modlog')));
	});

	it('removes the battle logs of a deleted account', async () => {
		const mine = write('2026-10-10', 'a.log.json', { p1: 'Ash Ketchum', p2: 'Gary' });
		const theirs = write('2026-10-11', 'b.log.json', { p1: 'Misty', p2: 'Brock' });
		const broken = write('2026-10-11', 'c.log.json', 'não é JSON');
		fs.writeFileSync(broken, '{quebrado');
		assert.equal(await accounts.removeBattleLogsOf('ashketchum', logsDir), 1);
		assert(!fs.existsSync(mine));
		assert(fs.existsSync(theirs));
		assert(fs.existsSync(broken), 'arquivo ilegível fica (não dá para saber de quem é)');
	});
});

describe('Custom accounts: modlog retention', () => {
	const { DatabaseSync } = require('node:sqlite');
	let db;
	const run = (statement, data) => Promise.resolve(db.prepare(statement).run(...data));
	const DAY = 24 * 60 * 60 * 1000;
	const now = Date.UTC(2026, 9, 19);
	const insert = (daysAgo, ip, alts = []) => {
		const { lastInsertRowid } = db.prepare(
			`INSERT INTO modlog (timestamp, roomid, is_global, action, visual_roomid, note, action_taker_userid, userid, ip) ` +
			`VALUES (?, 'global', 1, 'LOCK', '', 'motivo', 'admin', 'punido', ?)`
		).run(now - daysAgo * DAY, ip);
		for (const alt of alts) db.prepare('INSERT INTO alts (modlog_id, userid) VALUES (?, ?)').run(lastInsertRowid, alt);
		return Number(lastInsertRowid);
	};
	beforeEach(() => {
		db = new DatabaseSync(':memory:');
		db.exec(fs.readFileSync(path.join(__dirname, '../../../databases/schemas/modlog.sql'), 'utf8'));
	});
	afterEach(() => db.close());

	it('removes the IP after 30 days and the entry after 6 months', async () => {
		const recent = insert(10, '1.2.3.4', ['alt1']);
		const month = insert(31, '5.6.7.8', ['alt2']);
		const old = insert(181, '9.9.9.9', ['alt3']);
		const result = await accounts.cleanupModlog(run, now);
		assert.deepEqual(result, { removed: 1, anonymized: 1 });
		const ipOf = id => db.prepare('SELECT ip FROM modlog WHERE modlog_id = ?').get(id);
		assert.equal(ipOf(recent).ip, '1.2.3.4', 'menos de 30 dias: IP fica');
		assert.equal(ipOf(month).ip, null, 'mais de 30 dias: IP sai, registro fica');
		assert.equal(ipOf(old), undefined, 'mais de 6 meses: registro sai');
		const alts = db.prepare('SELECT userid FROM alts ORDER BY userid').all().map(r => r.userid);
		assert.deepEqual(alts, ['alt1', 'alt2'], 'alts do registro apagado saem junto');
		assert.deepEqual(await accounts.cleanupModlog(run, now), { removed: 0, anonymized: 0 }, 'idempotente');
	});
});

describe('Custom accounts: battles of a deleted account', () => {
	const { makeUser } = require('../../users-utils');
	const TEAM = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
	let users, rooms;
	beforeEach(() => {
		users = [makeUser('Deleted Player'), makeUser('Other Player'), makeUser('Third Player')];
		rooms = [];
	});
	afterEach(() => {
		for (const room of rooms) room.destroy();
		for (const user of users) {
			user.disconnectAll();
			user.destroy();
		}
	});
	const battle = (p1, p2) => {
		const room = Rooms.createBattle({ format: 'gen9customgame', players: [{ user: p1, team: TEAM }, { user: p2, team: TEAM }] });
		rooms.push(room);
		return room;
	};

	it('forfeits only the battles in progress of the deleted account', () => {
		const [deleted, other, third] = users;
		const mine = battle(deleted, other);
		const theirs = battle(other, third);
		assert.equal(accounts.forfeitBattlesOf(deleted.id), 1);
		assert(mine.battle.p1.eliminated, 'o jogador excluído perdeu por forfeit');
		assert(mine.log.log.some(line => line === '|-message|Deleted Player forfeited.'));
		assert(!theirs.battle.p1.eliminated && !theirs.battle.p2.eliminated, 'outras batalhas continuam');
		assert.equal(accounts.forfeitBattlesOf(deleted.id), 0, 'não dá forfeit duas vezes');
	});
});
