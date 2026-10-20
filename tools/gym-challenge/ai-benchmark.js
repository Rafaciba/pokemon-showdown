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
 *   Com --packs <pasta>, o formato "packs" (ou "packsdoubles", em dupla) usa os times dos treinadores dos
 *   pacotes: cada par de batalhas tem os mesmos times, com as IAs trocando de lado.
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

function option(name) {
	const index = process.argv.indexOf(`--${name}`);
	return index >= 0 ? process.argv[index + 1] : '';
}
const WORKERS = Number(option('workers')) || 0;
const PACKS = option('packs');
const positional = process.argv.slice(2).filter((arg, i, all) => !arg.startsWith('--') && !all[i - 1]?.startsWith('--'));
const BATTLES = Number(positional[0]) || 60;
const FORMAT = positional[1] || 'gen9randombattle';
const MATCHUPS = positional[2] ? positional[2].split(',').map(pair => pair.split(':')) : [
	['easy', 'random'], ['medium', 'random'], ['hard', 'random'],
	['medium', 'easy'], ['hard', 'easy'], ['hard', 'medium'],
];
/** Times dos pacotes (formatos "packs" e "packsdoubles"). */
const PACK_DOUBLES = FORMAT === 'packsdoubles';
const packTeams = [];
if (FORMAT.startsWith('packs')) {
	const fs = require('fs');
	const path = require('path');
	if (!PACKS) throw new Error('o formato packs precisa de --packs <pasta>');
	for (const file of fs.readdirSync(PACKS).filter(name => name.endsWith('.json')).sort()) {
		for (const trainer of JSON.parse(fs.readFileSync(path.join(PACKS, file), 'utf8')).trainers || []) {
			if (trainer.doubles && !PACK_DOUBLES) continue;
			const sets = Teams.import(trainer.team);
			if (sets?.length >= (PACK_DOUBLES ? 2 : 1)) packTeams.push(Teams.pack(sets));
		}
	}
}
const BATTLE_FORMAT = !FORMAT.startsWith('packs') ? FORMAT : Dex.formats.validate(PACK_DOUBLES ?
	'gen9nationaldexdoubles@@@Terastal Clause, Z-Move Clause, Dynamax Clause' :
	'gen9nationaldexag@@@Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause');

/** Times da batalha `i` (o mesmo par de times em duas batalhas seguidas, uma com cada IA em cada lado). */
function teamsFor(i) {
	if (!packTeams.length) return {};
	const pair = Math.floor(i / 2);
	const a = (pair * 7919 + 13) % packTeams.length;
	let b = (pair * 104729 + 7) % packTeams.length;
	if (b === a) b = (b + 1) % packTeams.length;
	return { team1: packTeams[a], team2: packTeams[b] };
}

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

function battle(p1, p2, teams) {
	const task = { format: BATTLE_FORMAT, p1, p2, ...teams };
	return pool ? pool.run(task) : runBattle({ ...task, stats });
}

(async () => {
	console.log(`${BATTLES} batalhas por confronto, formato ${FORMAT}` +
		(packTeams.length ? ` (${packTeams.length} times de pacotes)` : ''));
	for (const [a, b] of MATCHUPS) {
		let winsA = 0;
		let ties = 0;
		const started = Date.now();
		// Alterna os lados para não favorecer ninguém
		const play = async i => {
			const aIsP1 = i % 2 === 0;
			// Os times ficam com o lado (p1/p2), e as IAs trocam: cada IA joga com os dois times
			const result = await battle(aIsP1 ? a : b, aIsP1 ? b : a, teamsFor(i));
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
