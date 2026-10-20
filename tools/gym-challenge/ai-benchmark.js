/**
 * pokemon-showdown-custom: compara os níveis de IA do Desafio de Ginásios.
 *
 * Joga batalhas completas no simulador do PS, IA contra IA, com times aleatórios
 * (formato Random Battle: os dois lados recebem times sorteados do mesmo jeito) e
 * alternando os lados. Mostra a taxa de vitória de cada confronto.
 *
 * Uso (no container do servidor, depois de `node build`):
 *   node tools/gym-challenge/ai-benchmark.js [batalhas] [formato] [confrontos] [--workers N]
 *   (--workers joga as batalhas em N processos em paralelo; útil para a Mestre com busca no simulador)
 *   ex.: node tools/gym-challenge/ai-benchmark.js 100 gen9randombattle
 *        node tools/gym-challenge/ai-benchmark.js 300 gen9randombattle "hard-speedAware:medium,hard:medium"
 *        node tools/gym-challenge/ai-benchmark.js 100 gen9randomdoublesbattle   (batalhas em dupla)
 *
 * Variantes para calibrar: "hard-hazards" é o Difícil sem a regra hazards;
 * "medium+statusMoves" é o Médio com ela (regras em heuristic-ai.ts → LevelRules).
 *
 * @license MIT
 */
'use strict';

const { runBattle } = require('./battle-runner');
const { simSearchStats } = require('../../dist/server/chat-plugins/gym-challenge/sim-search');

const workersIndex = process.argv.indexOf('--workers');
const WORKERS = workersIndex >= 0 ? Number(process.argv[workersIndex + 1]) : 0;
const positional = process.argv.slice(2).filter((arg, i, all) => arg !== '--workers' && all[i - 1] !== '--workers');
const BATTLES = Number(positional[0]) || 60;
const FORMAT = positional[1] || 'gen9randombattle';
const MATCHUPS = positional[2] ? positional[2].split(',').map(pair => pair.split(':')) : [
	['easy', 'random'], ['medium', 'random'], ['hard', 'random'],
	['medium', 'easy'], ['hard', 'easy'], ['hard', 'medium'],
];
/** Escolhas recusadas pelo simulador, por nível (uma IA correta não erra). */
const stats = { invalid: {} };
const invalidChoices = stats.invalid;

/** Processos de batalha (com --workers); cada batalha volta com as escolhas recusadas e os contadores da busca. */
let pool = null;
if (WORKERS > 0) {
	const { Worker } = require('worker_threads');
	const path = require('path');
	const idle = [];
	const queue = [];
	const pending = new Map();
	let nextId = 0;
	const pump = () => {
		while (idle.length && queue.length) idle.pop().postMessage(queue.shift());
	};
	const workers = Array.from({ length: WORKERS }, () => {
		const worker = new Worker(path.join(__dirname, 'bench-worker.js'));
		worker.on('message', ({ id, result, invalid, search }) => {
			for (const [level, count] of Object.entries(invalid)) invalidChoices[level] = (invalidChoices[level] || 0) + count;
			for (const key of Object.keys(simSearchStats)) simSearchStats[key] += search[key];
			pending.get(id)(result);
			pending.delete(id);
			idle.push(worker);
			pump();
		});
		idle.push(worker);
		return worker;
	});
	pool = {
		run: task => new Promise(resolve => {
			const id = nextId++;
			pending.set(id, resolve);
			queue.push({ id, task });
			pump();
		}),
		close: () => workers.forEach(worker => void worker.terminate()),
	};
}

function battle(p1, p2) {
	return pool ? pool.run({ format: FORMAT, p1, p2 }) : runBattle({ format: FORMAT, p1, p2, stats });
}

(async () => {
	console.log(`${BATTLES} batalhas por confronto, formato ${FORMAT}`);
	for (const [a, b] of MATCHUPS) {
		let winsA = 0;
		let ties = 0;
		const started = Date.now();
		// Alterna os lados para não favorecer ninguém
		const play = async i => {
			const aIsP1 = i % 2 === 0;
			const result = await battle(aIsP1 ? a : b, aIsP1 ? b : a);
			if (result === 'tie') ties++;
			else if ((result === 'p1') === aIsP1) winsA++;
		};
		// Com processos, todas entram na fila; sem, uma de cada vez
		if (pool) await Promise.all(Array.from({ length: BATTLES }, (_, i) => play(i)));
		else for (let i = 0; i < BATTLES; i++) await play(i);
		const decided = BATTLES - ties;
		const rate = decided ? (winsA / decided * 100).toFixed(1) : '-';
		const errors = Object.entries(invalidChoices).map(([level, count]) => `${level} ${count}`).join(', ');
		console.log(`${a} x ${b}: ${a} venceu ${winsA}/${decided} (${rate}%), empates ${ties}` +
			` [${((Date.now() - started) / 1000).toFixed(0)}s]` + (errors ? ` escolhas recusadas: ${errors}` : ''));
		for (const level in invalidChoices) delete invalidChoices[level];
		if (simSearchStats.searches) {
			const s = simSearchStats;
			console.log(`  busca no simulador: ${s.searches} buscas, ${s.failed} sem resultado, ${s.changed} jogadas trocadas, ` +
				`${(s.samples / s.searches).toFixed(1)} palpites e ${(s.totalMs / s.searches).toFixed(0)} ms por busca`);
			Object.assign(s, { searches: 0, failed: 0, changed: 0, totalMs: 0, samples: 0 });
		}
	}
	pool?.close();
})();
