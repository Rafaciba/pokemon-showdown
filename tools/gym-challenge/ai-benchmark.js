/**
 * pokemon-showdown-custom: compara os níveis de IA do Desafio de Ginásios.
 *
 * Joga batalhas completas no simulador do PS, IA contra IA, com times aleatórios
 * (formato Random Battle: os dois lados recebem times sorteados do mesmo jeito) e
 * alternando os lados. Mostra a taxa de vitória de cada confronto.
 *
 * Uso (no container do servidor, depois de `node build`):
 *   node tools/gym-challenge/ai-benchmark.js [batalhas] [formato] [confrontos]
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

const path = require('path');
const dist = path.resolve(__dirname, '../../dist');
global.Config = require(`${dist}/server/config-loader`).Config;
const { Dex } = require(`${dist}/sim/dex`);
global.Dex = Dex;
global.toID = Dex.toID;
const { BattleStream, getPlayerStreams } = require(`${dist}/sim/battle-stream`);
const { createAI } = require(`${dist}/server/chat-plugins/gym-challenge/ai`);
const { HeuristicAI } = require(`${dist}/server/chat-plugins/gym-challenge/heuristic-ai`);

const BATTLES = Number(process.argv[2]) || 60;
const FORMAT = process.argv[3] || 'gen9randombattle';
const MATCHUPS = process.argv[4] ? process.argv[4].split(',').map(pair => pair.split(':')) : [
	['easy', 'random'], ['medium', 'random'], ['hard', 'random'],
	['medium', 'easy'], ['hard', 'easy'], ['hard', 'medium'],
];

/** "hard", ou uma variante como "hard-speedAware" / "medium+hazards+statusMoves". */
function makeAI(spec) {
	const [level, ...changes] = spec.split(/(?=[+-])/);
	if (!changes.length) return createAI(level);
	const overrides = {};
	for (const change of changes) overrides[change.slice(1)] = change[0] === '+';
	return new HeuristicAI(level, Math.random, overrides);
}
const MAX_INVALID = 3;
/** Escolhas recusadas pelo simulador, por nível (uma IA correta não erra). */
const invalidChoices = {};

/** Lado de uma batalha controlado por uma NpcAI, como no NpcBattle (log público + pedidos). */
function drive(stream, level) {
	const ai = makeAI(level);
	const log = [];
	let request = null;
	let invalid = 0;
	let lastChoice = null;
	const decide = forced => {
		if (!request || request.wait) return;
		let choice = forced;
		if (!choice) {
			try {
				choice = ai.choose(request, { log });
			} catch (err) {
				console.error(`[${level}] erro na IA:`, err);
				choice = 'default';
			}
		}
		if (choice) void stream.write(choice);
		lastChoice = choice;
	};
	void (async () => {
		for await (const chunk of stream) {
			let skipSecret = false;
			for (const line of chunk.split('\n')) {
				if (line.startsWith('|request|')) {
					request = JSON.parse(line.slice(9));
					invalid = 0;
					decide();
				} else if (line.startsWith('|error|[Invalid choice]')) {
					invalid++;
					invalidChoices[level] = (invalidChoices[level] || 0) + 1;
					// BENCH_DEBUG=1 mostra cada escolha recusada e o motivo
					if (process.env.BENCH_DEBUG) console.log(`[${level}] "${lastChoice}" → ${line}`);
					decide(invalid >= MAX_INVALID ? 'default' : undefined);
				} else if (line.startsWith('|split|')) {
					skipSecret = true;
				} else if (skipSecret) {
					skipSecret = false;
				} else if (line.startsWith('|')) {
					log.push(line);
				}
			}
		}
	})();
}

async function battle(p1Level, p2Level) {
	const streams = getPlayerStreams(new BattleStream());
	drive(streams.p1, p1Level);
	drive(streams.p2, p2Level);
	void streams.omniscient.write(`>start ${JSON.stringify({ formatid: FORMAT })}\n` +
		`>player p1 ${JSON.stringify({ name: 'P1' })}\n>player p2 ${JSON.stringify({ name: 'P2' })}`);
	for await (const chunk of streams.omniscient) {
		for (const line of chunk.split('\n')) {
			if (line === '|win|P1') return 'p1';
			if (line === '|win|P2') return 'p2';
			if (line === '|tie' || line.startsWith('|tie|')) return 'tie';
		}
	}
	return 'tie';
}

(async () => {
	console.log(`${BATTLES} batalhas por confronto, formato ${FORMAT}`);
	for (const [a, b] of MATCHUPS) {
		let winsA = 0;
		let ties = 0;
		const started = Date.now();
		for (let i = 0; i < BATTLES; i++) {
			// Alterna os lados para não favorecer ninguém
			const aIsP1 = i % 2 === 0;
			const result = await battle(aIsP1 ? a : b, aIsP1 ? b : a);
			if (result === 'tie') ties++;
			else if ((result === 'p1') === aIsP1) winsA++;
		}
		const decided = BATTLES - ties;
		const rate = decided ? (winsA / decided * 100).toFixed(1) : '-';
		const errors = Object.entries(invalidChoices).map(([level, count]) => `${level} ${count}`).join(', ');
		console.log(`${a} x ${b}: ${a} venceu ${winsA}/${decided} (${rate}%), empates ${ties}` +
			` [${((Date.now() - started) / 1000).toFixed(0)}s]` + (errors ? ` escolhas recusadas: ${errors}` : ''));
		for (const level in invalidChoices) delete invalidChoices[level];
	}
})();
