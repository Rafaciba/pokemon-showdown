/**
 * Testes do plugin de contas (pokemon-showdown-custom): retenção e exclusão dos
 * logs de batalha.
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
