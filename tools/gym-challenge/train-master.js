/**
 * pokemon-showdown-custom: treino dos pesos da IA Mestre em batalhas simuladas.
 *
 * Estratégia evolutiva sobre os pesos de HeuristicWeights (heuristic-ai.ts), em escala
 * logarítmica em torno dos pesos padrão (os do Difícil). A cada geração:
 *   1. sorteia variações da média atual (aos pares espelhados, +z e -z);
 *   2. joga cada variação, e a própria média, nas MESMAS batalhas (mesmas sementes e
 *      times; cada semente nos dois lados), contra o Difícil e o Médio, em Random Battle,
 *      Random Doubles e confrontos com os times dos pacotes;
 *   3. a nova média é a média ponderada das melhores variações.
 * No fim, os pesos treinados e os padrão jogam contra o Difícil em batalhas novas
 * (validação), e os pesos treinados vão para o arquivo de saída.
 *
 * Uso (no container server-setup, depois de `node build`):
 *   node tools/gym-challenge/train-master.js [opções]
 *     --generations 40   gerações
 *     --population 12    variações por geração (par)
 *     --battles 320      batalhas por candidato em cada geração (par)
 *     --sigma 0.3        tamanho inicial das variações (em log)
 *     --workers 8        processos de batalha em paralelo
 *     --packs /pacotes   pasta com os pacotes JSON (times dos treinadores)
 *     --validate 2000    batalhas da validação final
 *     --out <arquivo>    pesos e histórico (gravado a cada geração; com --resume, continua)
 *     --seed <texto>     semente do treino (as batalhas se repetem com a mesma semente)
 *
 * @license MIT
 */
'use strict';

const { Worker } = require('worker_threads');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { DEFAULT_WEIGHTS } = require('./battle-runner');

// --- Opções -----------------------------------------------------------------------

const args = process.argv.slice(2);
function option(name, fallback) {
	const index = args.indexOf(`--${name}`);
	return index >= 0 ? args[index + 1] : fallback;
}
const GENERATIONS = Number(option('generations', 40));
const POPULATION = Math.max(2, Number(option('population', 12)) & ~1);
const BATTLES = Math.max(2, Number(option('battles', 320)) & ~1);
const SIGMA0 = Number(option('sigma', 0.3));
const WORKERS = Number(option('workers', 8));
const PACKS = option('packs', '');
const VALIDATE = Math.max(2, Number(option('validate', 2000)) & ~1);
const OUT = option('out', path.resolve(__dirname, 'master-training.json'));
const SEED = option('seed', 'liga-de-desafios');
const RESUME = args.includes('--resume');

// --- Pesos ---------------------------------------------------------------------------

const KEYS = Object.keys(DEFAULT_WEIGHTS);
/** Limites (HP em %; fatores entre 0 e 1); os demais, de 0 a 300. */
const HP_KEYS = new Set([
	'healLowHp', 'healMidHp', 'stallHp', 'screensHp', 'hazardHp', 'statusHp', 'boostHp', 'boostDamageTaken', 'debuffHp',
]);
const FACTOR_KEYS = new Set(['outspedFactor', 'doomedStatusFactor']);

function clamp(key, value) {
	if (HP_KEYS.has(key)) return Math.min(100, Math.max(5, value));
	if (FACTOR_KEYS.has(key)) return Math.min(1, Math.max(0.05, value));
	return Math.min(300, Math.max(0, value));
}

/** Vetor em log (θ) → pesos. */
function toWeights(theta) {
	const weights = {};
	KEYS.forEach((key, i) => {
		weights[key] = Math.round(clamp(key, DEFAULT_WEIGHTS[key] * Math.exp(theta[i])) * 1000) / 1000;
	});
	return weights;
}

/** Pesos → vetor em log (θ). */
function toTheta(weights) {
	return KEYS.map(key => Math.log(Math.max(1e-6, weights[key]) / DEFAULT_WEIGHTS[key]));
}

// --- Aleatoriedade determinística ------------------------------------------------------

function hash(...parts) {
	return crypto.createHash('sha256').update(parts.join('|')).digest();
}

/** Semente de batalha do PS a partir de um texto. */
function battleSeed(...parts) {
	return `sodium,${hash(...parts).subarray(0, 16).toString('hex')}`;
}

/** Normal padrão (Box-Muller) a partir de um texto. */
function gaussian(...parts) {
	const bytes = hash(...parts);
	const u1 = (bytes.readUInt32BE(0) + 1) / 4294967297;
	const u2 = bytes.readUInt32BE(4) / 4294967296;
	return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

// --- Cenários ------------------------------------------------------------------------

/** Times dos treinadores dos pacotes (individuais, já empacotados). */
function loadPackTeams() {
	if (!PACKS) return [];
	const teams = [];
	for (const file of fs.readdirSync(PACKS).filter(name => name.endsWith('.json')).sort()) {
		const pack = JSON.parse(fs.readFileSync(path.join(PACKS, file), 'utf8'));
		for (const trainer of pack.trainers || []) {
			if (trainer.doubles) continue;
			const sets = Teams.import(trainer.team);
			if (sets?.length) teams.push({ name: trainer.name, team: Teams.pack(sets) });
		}
	}
	return teams;
}

const packTeams = loadPackTeams();
const PACK_FORMAT = packTeams.length ?
	Dex.formats.validate('gen9nationaldexag@@@Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause') : '';

/**
 * Batalhas de um lote: cada semente vira duas batalhas (a Mestre de cada lado).
 * Em 10 sementes: 4 de Random Battle, 2 de Random Doubles e 4 com times dos pacotes
 * (Random Battle no lugar, sem pacotes). Uma em cada três contra o Médio, as demais
 * contra o Difícil.
 */
function scenarios(namespace, count) {
	const list = [];
	for (let j = 0; j < count / 2; j++) {
		const slot = j % 10;
		const opponent = j % 3 === 2 ? 'medium' : 'hard';
		const seed = battleSeed(SEED, namespace, j);
		let base;
		if (slot >= 6 && packTeams.length) {
			const bytes = hash(SEED, namespace, j, 'teams');
			const a = bytes.readUInt32BE(0) % packTeams.length;
			let b = bytes.readUInt32BE(4) % packTeams.length;
			if (b === a) b = (b + 1) % packTeams.length;
			base = { kind: 'packs', format: PACK_FORMAT, seed, team1: packTeams[a].team, team2: packTeams[b].team };
		} else if (slot >= 4) {
			base = { kind: 'doubles', format: 'gen9randomdoublesbattle', seed };
		} else {
			base = { kind: 'singles', format: 'gen9randombattle', seed };
		}
		list.push({ ...base, opponent, masterSide: 'p1' }, { ...base, opponent, masterSide: 'p2' });
	}
	return list;
}

// --- Processos de batalha ---------------------------------------------------------------

class Pool {
	constructor(size) {
		this.workers = [];
		this.idle = [];
		this.queue = [];
		this.pending = new Map();
		this.nextId = 0;
		for (let i = 0; i < size; i++) {
			const worker = new Worker(path.join(__dirname, 'train-master-worker.js'));
			worker.on('message', ({ id, score }) => {
				const resolve = this.pending.get(id);
				this.pending.delete(id);
				this.idle.push(worker);
				this.pump();
				resolve(score);
			});
			worker.on('error', err => {
				console.error('erro num processo de batalha:', err);
				process.exit(1);
			});
			this.workers.push(worker);
			this.idle.push(worker);
		}
	}

	run(task) {
		return new Promise(resolve => {
			const id = this.nextId++;
			this.pending.set(id, resolve);
			this.queue.push({ id, task });
			this.pump();
		});
	}

	pump() {
		while (this.idle.length && this.queue.length) this.idle.pop().postMessage(this.queue.shift());
	}

	close() {
		for (const worker of this.workers) void worker.terminate();
	}
}

/** Taxa de vitória (empate vale meio) de cada conjunto de pesos no mesmo lote de batalhas. */
async function evaluate(pool, candidates, battles) {
	const totals = candidates.map(() => 0);
	const byKind = candidates.map(() => ({}));
	await Promise.all(candidates.flatMap((weights, c) => battles.map(async battle => {
		const score = await pool.run({ ...battle, weights });
		totals[c] += score;
		const kind = byKind[c][`${battle.kind}/${battle.opponent}`] ||= { score: 0, count: 0 };
		kind.score += score;
		kind.count++;
	})));
	return totals.map((total, c) => ({ rate: total / battles.length, byKind: byKind[c] }));
}

function percent(rate) {
	return `${(rate * 100).toFixed(1)}%`;
}

// --- Treino ------------------------------------------------------------------------------

(async () => {
	let state = { generation: 0, sigma: SIGMA0, theta: KEYS.map(() => 0), history: [] };
	if (RESUME && fs.existsSync(OUT)) {
		const saved = JSON.parse(fs.readFileSync(OUT, 'utf8'));
		state = { generation: saved.generation, sigma: saved.sigma, theta: toTheta(saved.weights), history: saved.history };
		console.log(`continuando da geração ${state.generation}`);
	}
	const save = extra => fs.writeFileSync(OUT, JSON.stringify({
		seed: SEED, generation: state.generation, sigma: state.sigma, weights: toWeights(state.theta),
		history: state.history, ...extra,
	}, null, '\t') + '\n');

	console.log(`${GENERATIONS} gerações, ${POPULATION} variações, ${BATTLES} batalhas por candidato, ` +
		`${WORKERS} processos, ${packTeams.length} times de pacotes`);
	const pool = new Pool(WORKERS);
	const mu = POPULATION / 2;
	// Pesos da recombinação: as melhores variações pesam mais (log-decrescente)
	const rankWeights = Array.from({ length: mu }, (_, i) => Math.log(mu + 0.5) - Math.log(i + 1));
	const rankSum = rankWeights.reduce((a, b) => a + b, 0);

	while (state.generation < GENERATIONS) {
		const g = state.generation;
		const started = Date.now();
		// Variações espelhadas: θ + σz e θ − σz
		const offspring = [];
		for (let k = 0; k < POPULATION / 2; k++) {
			const z = KEYS.map((_, i) => gaussian(SEED, 'z', g, k, i));
			offspring.push(state.theta.map((t, i) => t + state.sigma * z[i]));
			offspring.push(state.theta.map((t, i) => t - state.sigma * z[i]));
		}
		const battles = scenarios(`gen${g}`, BATTLES);
		const results = await evaluate(pool, [toWeights(state.theta), ...offspring.map(toWeights)], battles);
		const [meanResult, ...offspringResults] = results;
		const ranked = offspring.map((theta, k) => ({ theta, rate: offspringResults[k].rate }))
			.sort((a, b) => b.rate - a.rate);
		// eslint-disable-next-line require-atomic-updates -- só este laço altera o estado, uma geração por vez
		state.theta = KEYS.map((_, i) => ranked.slice(0, mu).reduce(
			(sum, entry, rank) => sum + rankWeights[rank] / rankSum * entry.theta[i], 0
		));
		state.sigma = Math.max(0.05, state.sigma * 0.97);
		state.generation++;
		state.history.push({ generation: g, mean: meanResult.rate, best: ranked[0].rate, sigma: state.sigma });
		save();
		console.log(`geração ${g + 1}/${GENERATIONS}: média ${percent(meanResult.rate)}, melhor variação ` +
			`${percent(ranked[0].rate)}, σ ${state.sigma.toFixed(3)} [${((Date.now() - started) / 1000).toFixed(0)}s]`);
	}

	// Validação: pesos treinados x pesos padrão (Difícil), nas mesmas batalhas novas
	console.log(`\nvalidação: ${VALIDATE} batalhas novas`);
	const validation = scenarios('validation', VALIDATE);
	const [trained, baseline] = await evaluate(pool, [toWeights(state.theta), { ...DEFAULT_WEIGHTS }], validation);
	pool.close();
	const kinds = Object.keys(trained.byKind).sort();
	console.log(`pesos treinados: ${percent(trained.rate)}   pesos padrão: ${percent(baseline.rate)}`);
	for (const kind of kinds) {
		const t = trained.byKind[kind];
		const b = baseline.byKind[kind];
		console.log(`  ${kind}: treinados ${percent(t.score / t.count)}, padrão ${percent(b.score / b.count)} (${t.count} batalhas)`);
	}
	save({ validation: { battles: VALIDATE, trained: trained.rate, baseline: baseline.rate, trainedByKind: trained.byKind,
		baselineByKind: baseline.byKind } });
	console.log(`\npesos gravados em ${OUT}`);
})();
