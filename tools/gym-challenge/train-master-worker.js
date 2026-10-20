/**
 * pokemon-showdown-custom: processo de batalha do treino da IA Mestre (train-master.js).
 *
 * Recebe uma batalha (formato, semente, times, adversário, lado e pesos da Mestre),
 * joga e devolve o resultado do ponto de vista da Mestre: 1 vitória, 0 derrota, 0,5 empate.
 *
 * @license MIT
 */
'use strict';

const { parentPort } = require('worker_threads');
const { runBattle } = require('./battle-runner');

parentPort.on('message', async ({ id, task }) => {
	const master = { level: 'master', name: 'master', weights: task.weights };
	const masterIsP1 = task.masterSide === 'p1';
	const result = await runBattle({
		format: task.format, seed: task.seed, team1: task.team1, team2: task.team2,
		p1: masterIsP1 ? master : task.opponent, p2: masterIsP1 ? task.opponent : master,
	});
	const score = result === 'tie' ? 0.5 : (result === 'p1') === masterIsP1 ? 1 : 0;
	parentPort.postMessage({ id, score });
});
