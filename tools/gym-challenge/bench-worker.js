/**
 * pokemon-showdown-custom: processo de batalha do banco de testes em paralelo (ai-benchmark.js --workers).
 *
 * @license MIT
 */
'use strict';

const { parentPort } = require('worker_threads');
const { runBattle } = require('./battle-runner');
const { simSearchStats } = require('../../dist/server/chat-plugins/gym-challenge/sim-search');

parentPort.on('message', async ({ id, task }) => {
	const stats = { invalid: {} };
	const result = await runBattle({ ...task, stats });
	const search = { ...simSearchStats };
	Object.assign(simSearchStats, { searches: 0, failed: 0, changed: 0, totalMs: 0, samples: 0 });
	parentPort.postMessage({ id, result, invalid: stats.invalid, search });
});
