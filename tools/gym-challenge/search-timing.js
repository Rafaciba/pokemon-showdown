/**
 * pokemon-showdown-custom: mede o tempo da busca da IA Mestre por jogada (calibração da etapa 5).
 *
 * Joga batalhas Mestre x Difícil e cronometra cada escolha da Mestre (regras + busca no
 * simulador, como no processo da busca do servidor). Com --parallel N, N batalhas rodam
 * ao mesmo tempo em processos separados, como N jogadores enfrentando a Mestre com N
 * processos de busca. Para simular a VPS, rode num container com o limite de CPU dela
 * (ex.: docker run --cpus 2).
 *
 * Uso (depois de `node build`):
 *   node tools/gym-challenge/search-timing.js [batalhas] [formato] [mestre] [--parallel N]
 *   ex.: node tools/gym-challenge/search-timing.js 6 gen9randomdoublesbattle "master%4" --parallel 2
 *
 * @license MIT
 */
'use strict';

const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');

if (isMainThread) {
	const args = process.argv.slice(2);
	const parallelIndex = args.indexOf('--parallel');
	const PARALLEL = parallelIndex >= 0 ? Number(args[parallelIndex + 1]) : 1;
	const positional = args.filter((arg, i) => !arg.startsWith('--') && !args[i - 1]?.startsWith('--'));
	const BATTLES = Number(positional[0]) || 4;
	const FORMAT = positional[1] || 'gen9randombattle';
	const MASTER = positional[2] || 'master';
	const times = [];
	let done = 0;
	console.log(`${BATTLES} batalhas por processo, ${PARALLEL} processo(s) ao mesmo tempo, ${FORMAT}, ${MASTER}`);
	for (let i = 0; i < PARALLEL; i++) {
		const worker = new Worker(__filename, { workerData: { battles: BATTLES, format: FORMAT, master: MASTER } });
		worker.on('message', list => {
			times.push(...list);
			if (++done < PARALLEL) return;
			times.sort((a, b) => a - b);
			const at = q => times[Math.min(times.length - 1, Math.floor(q * times.length))];
			const mean = times.reduce((a, b) => a + b, 0) / times.length;
			console.log(`${times.length} jogadas da Mestre: média ${mean.toFixed(0)} ms, mediana ${at(0.5).toFixed(0)} ms, ` +
				`95% até ${at(0.95).toFixed(0)} ms, máximo ${times[times.length - 1].toFixed(0)} ms, ` +
				`acima de 1 s: ${(times.filter(t => t > 1000).length / times.length * 100).toFixed(1)}%`);
			process.exit(0);
		});
	}
} else {
	const { runBattle } = require('./battle-runner');
	const { HeuristicAI } = require('../../dist/server/chat-plugins/gym-challenge/heuristic-ai');
	const times = [];
	const original = HeuristicAI.prototype.choose;
	HeuristicAI.prototype.choose = function (request, view) {
		if (this.level !== 'master') return original.call(this, request, view);
		const started = process.hrtime.bigint();
		const choice = original.call(this, request, view);
		// Só pedidos de jogada (prévia de times e trocas obrigatórias em dupla não fazem busca)
		if (request.active) times.push(Number(process.hrtime.bigint() - started) / 1e6);
		return choice;
	};
	(async () => {
		for (let i = 0; i < workerData.battles; i++) {
			const masterIsP1 = i % 2 === 0;
			await runBattle({
				format: workerData.format, p1: masterIsP1 ? workerData.master : 'hard', p2: masterIsP1 ? 'hard' : workerData.master,
			});
		}
		parentPort.postMessage(times);
	})();
}
