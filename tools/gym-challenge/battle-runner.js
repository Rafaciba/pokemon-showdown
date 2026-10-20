/**
 * pokemon-showdown-custom: joga uma batalha completa no simulador do PS, IA contra IA.
 *
 * Usado pelo banco de testes (ai-benchmark.js) e pelo treino da IA Mestre
 * (train-master.js). Cada lado é controlado por uma NpcAI, como no NpcBattle: a IA
 * só vê o log público e os pedidos do seu lado. Precisa do `node build` antes.
 *
 * @license MIT
 */
'use strict';

const path = require('path');
// Sem os formatos de desafio (config/custom-formats.ts): as simulações não usam o banco do plugin
process.env.GYM_CHALLENGE_FORMATS ||= 'off';
const dist = path.resolve(__dirname, '../../dist');
global.Config = require(`${dist}/server/config-loader`).Config;
const { Dex } = require(`${dist}/sim/dex`);
global.Dex = Dex;
global.toID = Dex.toID;
const { Teams } = require(`${dist}/sim/teams`);
global.Teams = Teams;
const { BattleStream, getPlayerStreams } = require(`${dist}/sim/battle-stream`);
const { createAI } = require(`${dist}/server/chat-plugins/gym-challenge/ai`);
const { HeuristicAI, DEFAULT_WEIGHTS } = require(`${dist}/server/chat-plugins/gym-challenge/heuristic-ai`);

/** Depois de tantas escolhas recusadas seguidas, a escolha padrão do simulador. */
const MAX_INVALID = 3;
/** Batalhas que passam disto terminam empatadas (proteção contra batalhas sem fim). */
const MAX_TURNS = 300;

/**
 * IA a partir de uma especificação: "hard", uma variante como "hard-speedAware" ou
 * "medium+hazards+statusMoves" (liga/desliga regras de LevelRules), ou um objeto
 * { level, weights } (pesos próprios, como os candidatos do treino da Mestre).
 */
function makeAI(spec) {
	if (typeof spec === 'object') {
		return new HeuristicAI(spec.level || 'master', Math.random, {}, { ...DEFAULT_WEIGHTS, ...spec.weights });
	}
	const [level, ...changes] = spec.split(/(?=[+-])/);
	if (!changes.length) return createAI(level);
	const overrides = {};
	for (const change of changes) overrides[change.slice(1)] = change[0] === '+';
	return new HeuristicAI(level, Math.random, overrides);
}

function specName(spec) {
	return typeof spec === 'object' ? (spec.name || spec.level || 'master') : spec;
}

/** Lado de uma batalha controlado por uma NpcAI (log público + pedidos). */
function drive(stream, spec, stats) {
	const ai = makeAI(spec);
	const name = specName(spec);
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
				console.error(`[${name}] erro na IA:`, err);
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
					stats.invalid[name] = (stats.invalid[name] || 0) + 1;
					// BENCH_DEBUG=1 mostra cada escolha recusada e o motivo
					if (process.env.BENCH_DEBUG) console.log(`[${name}] "${lastChoice}" → ${line}`);
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

/**
 * Joga uma batalha e devolve 'p1', 'p2' ou 'tie'.
 * options: { format, p1, p2, seed?, team1?, team2?, stats? } — p1/p2 são especificações
 * de IA (ver makeAI), team1/team2 são times empacotados (formatos sem times gerados) e
 * seed é uma semente do PS ("sodium,<32 hex>"), para repetir a mesma batalha.
 */
async function runBattle(options) {
	const stats = options.stats || { invalid: {} };
	const streams = getPlayerStreams(new BattleStream());
	drive(streams.p1, options.p1, stats);
	drive(streams.p2, options.p2, stats);
	const start = { formatid: options.format, ...(options.seed ? { seed: options.seed } : {}) };
	const player = (name, team) => JSON.stringify({ name, ...(team ? { team } : {}) });
	void streams.omniscient.write(`>start ${JSON.stringify(start)}\n` +
		`>player p1 ${player('P1', options.team1)}\n>player p2 ${player('P2', options.team2)}`);
	for await (const chunk of streams.omniscient) {
		for (const line of chunk.split('\n')) {
			if (line === '|win|P1') return 'p1';
			if (line === '|win|P2') return 'p2';
			if (line === '|tie' || line.startsWith('|tie|')) return 'tie';
			if (line.startsWith('|turn|') && Number(line.slice(6)) > MAX_TURNS) {
				void streams.omniscient.writeEnd();
				return 'tie';
			}
		}
	}
	return 'tie';
}

module.exports = { runBattle, makeAI, specName, DEFAULT_WEIGHTS };
