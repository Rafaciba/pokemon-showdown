/**
 * pokemon-showdown-custom: treina o modelo de avaliação de posição da IA Mestre.
 *
 * Joga batalhas IA contra IA (Difícil, Mestre, Médio e Fácil em vários confrontos;
 * Random Battle e times dos pacotes), grava as características de cada posição dos
 * dois lados (position.ts) com o resultado de quem a viu e treina a regressão
 * logística (value-model.ts). 10% das batalhas ficam de fora do treino para medir o
 * modelo. Com --doubles, o modelo das batalhas em dupla (etapa 5): Random Doubles e
 * os times dos pacotes em dupla, com as características de dupla (position.ts).
 *
 * Uso (no container server-setup, depois de `node build`):
 *   node tools/gym-challenge/train-value.js [--battles 20000] [--workers 10] [--packs /pacotes]
 *     [--doubles] [--out tools/gym-challenge/master-value-model.json] [--seed texto]
 *
 * @license MIT
 */
'use strict';

const { Worker } = require('worker_threads');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const dist = path.resolve(__dirname, '../../dist');
require('./battle-runner');
const { FEATURES } = require(`${dist}/server/chat-plugins/gym-challenge/position`);
const { trainValueModel, scoreValueModel } = require(`${dist}/server/chat-plugins/gym-challenge/value-model`);

const args = process.argv.slice(2);
function option(name, fallback) {
	const index = args.indexOf(`--${name}`);
	return index >= 0 ? args[index + 1] : fallback;
}
const BATTLES = Number(option('battles', 20000));
const WORKERS = Number(option('workers', 10));
const PACKS = option('packs', '');
const DOUBLES = args.includes('--doubles');
const OUT = option('out', path.resolve(__dirname, DOUBLES ? 'master-value-model-doubles.json' : 'master-value-model.json'));
const SEED = option('seed', DOUBLES ? 'liga-de-desafios-valor-dupla' : 'liga-de-desafios-valor');

/** Confrontos das batalhas de coleta (variedade de jogo bom e ruim). */
const MATCHUPS = [
	['hard', 'hard'], ['master', 'hard'], ['master', 'master'], ['hard', 'medium'], ['master', 'medium'],
	['medium', 'medium'], ['hard', 'easy'],
];

function hash(...parts) {
	return crypto.createHash('sha256').update(parts.join('|')).digest();
}

function loadPackTeams() {
	if (!PACKS) return [];
	const teams = [];
	for (const file of fs.readdirSync(PACKS).filter(name => name.endsWith('.json')).sort()) {
		for (const trainer of JSON.parse(fs.readFileSync(path.join(PACKS, file), 'utf8')).trainers || []) {
			// Em dupla, os times de todos os treinadores (com pelo menos 2 Pokémon)
			if (trainer.doubles && !DOUBLES) continue;
			const sets = Teams.import(trainer.team);
			if (sets?.length >= (DOUBLES ? 2 : 1)) teams.push(Teams.pack(sets));
		}
	}
	return teams;
}

const packTeams = loadPackTeams();
const PACK_FORMAT = !packTeams.length ? '' : Dex.formats.validate(DOUBLES ?
	'gen9nationaldexdoubles@@@Terastal Clause, Z-Move Clause, Dynamax Clause' :
	'gen9nationaldexag@@@Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause');
const RANDOM_FORMAT = DOUBLES ? 'gen9randomdoublesbattle' : 'gen9randombattle';

function task(i) {
	const bytes = hash(SEED, i);
	const [a, b] = MATCHUPS[bytes.readUInt32BE(0) % MATCHUPS.length];
	const swap = i % 2 === 1;
	const seed = `sodium,${bytes.subarray(16, 32).toString('hex')}`;
	const base = { p1: swap ? b : a, p2: swap ? a : b, seed };
	if (packTeams.length && bytes.readUInt32BE(4) % 10 < 4) {
		const t1 = bytes.readUInt32BE(8) % packTeams.length;
		let t2 = bytes.readUInt32BE(12) % packTeams.length;
		if (t2 === t1) t2 = (t2 + 1) % packTeams.length;
		return { ...base, format: PACK_FORMAT, team1: packTeams[t1], team2: packTeams[t2] };
	}
	return { ...base, format: RANDOM_FORMAT };
}

function runAll() {
	return new Promise(resolve => {
		const train = [];
		const holdout = [];
		let next = 0;
		let done = 0;
		let battlesTrain = 0;
		const started = Date.now();
		const workers = Array.from({ length: WORKERS }, () => new Worker(path.join(__dirname, 'value-worker.js')));
		const feed = worker => {
			if (next >= BATTLES) return;
			const id = next++;
			worker.postMessage({ id, task: task(id) });
		};
		for (const worker of workers) {
			worker.on('message', ({ id, result, samples }) => {
				// Batalhas com número final 0 ficam para medir o modelo (10%)
				const target = id % 10 === 0 ? holdout : train;
				if (result !== 'tie') {
					if (target === train) battlesTrain++;
					for (const side of ['p1', 'p2']) {
						const won = result === side ? 1 : 0;
						for (const features of samples[side]) target.push([features, won]);
					}
				}
				done++;
				if (done % 1000 === 0) {
					console.log(`${done}/${BATTLES} batalhas, ${train.length} posições [${((Date.now() - started) / 1000).toFixed(0)}s]`);
				}
				if (done === BATTLES) {
					for (const w of workers) void w.terminate();
					resolve({ train, holdout, battlesTrain });
				} else {
					feed(worker);
				}
			});
			worker.on('error', err => {
				console.error('erro num processo de batalha:', err);
				process.exit(1);
			});
			feed(worker);
		}
	});
}

function toDataset(rows) {
	const width = FEATURES.length;
	const x = new Float32Array(rows.length * width);
	const y = new Float32Array(rows.length);
	rows.forEach(([features, won], r) => {
		for (let c = 0; c < width; c++) x[r * width + c] = features[c];
		y[r] = won;
	});
	return { x, y, rows: rows.length, width };
}

(async () => {
	console.log(`${BATTLES} batalhas, ${WORKERS} processos, ${packTeams.length} times de pacotes`);
	const { train, holdout, battlesTrain } = await runAll();
	const trainData = toDataset(train);
	const holdoutData = toDataset(holdout);
	let state = hash(SEED, 'shuffle').readUInt32BE(0);
	const random = () => {
		state = (state * 1664525 + 1013904223) >>> 0;
		return state / 4294967296;
	};
	const version = `sim-${DOUBLES ? 'dupla-' : ''}${new Date().toISOString().slice(0, 10)}`;
	const model = trainValueModel(trainData, FEATURES, { version, battles: battlesTrain }, { random });
	const trainScore = scoreValueModel(model, trainData);
	const holdoutScore = scoreValueModel(model, holdoutData);
	console.log(`\ntreino: ${train.length} posições; fora do treino: ${holdout.length} posições`);
	console.log(`perda logarítmica: treino ${trainScore.logLoss.toFixed(4)}, fora ${holdoutScore.logLoss.toFixed(4)}` +
		` (0,6931 = chute)`);
	console.log(`acerto: treino ${(trainScore.accuracy * 100).toFixed(1)}%, fora ${(holdoutScore.accuracy * 100).toFixed(1)}%`);
	console.log('\npesos (normalizados):');
	FEATURES.map((name, i) => [name, model.weights[i]]).sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
		.forEach(([name, weight]) => console.log(`  ${name.padEnd(14)} ${weight >= 0 ? ' ' : ''}${weight.toFixed(3)}`));
	fs.writeFileSync(OUT, JSON.stringify({ model, holdout: holdoutScore, train: trainScore }, null, '\t') + '\n');
	console.log(`\nmodelo gravado em ${OUT}`);
})();
