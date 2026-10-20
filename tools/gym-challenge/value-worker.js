/**
 * pokemon-showdown-custom: processo de batalha da coleta de posições (train-value.js).
 *
 * Joga uma batalha IA contra IA gravando as características das posições de cada lado
 * e devolve as posições com o resultado do ponto de vista de quem as viu.
 *
 * @license MIT
 */
'use strict';

const { parentPort } = require('worker_threads');
const { runBattle } = require('./battle-runner');

parentPort.on('message', async ({ id, task }) => {
	const samples = { p1: [], p2: [] };
	const result = await runBattle({ ...task, samples });
	parentPort.postMessage({ id, result, samples });
});
