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
const { masterWeights, masterDoublesWeights } = require(`${dist}/server/chat-plugins/gym-challenge/master-weights`);
const {
	MASTER_MODEL, MASTER_DOUBLES_MODEL, MASTER_SIM,
} = require(`${dist}/server/chat-plugins/gym-challenge/master-model`);
const { readBattleState } = require(`${dist}/server/chat-plugins/gym-challenge/battle-view`);
const { buildPosition, positionFeatures } = require(`${dist}/server/chat-plugins/gym-challenge/position`);

/** Depois de tantas escolhas recusadas seguidas, a escolha padrão do simulador. */
const MAX_INVALID = 3;
/** Batalhas que passam disto terminam empatadas (proteção contra batalhas sem fim). */
const MAX_TURNS = 300;

/**
 * IA a partir de uma especificação: "hard", uma variante como "hard-speedAware" ou
 * "medium+hazards+statusMoves" (liga/desliga regras de LevelRules), ou um objeto
 * { level, weights, model?, doublesModel? } (pesos próprios, como os candidatos do treino
 * da Mestre, que valem em individual e em dupla; com model, busca no simulador). Para a
 * Mestre: "master" é a do servidor (busca no simulador, aqui no próprio processo),
 * "master-search" é sem a busca (a da etapa 2), "master!sim4" usa 4 palpites,
 * "master^0.1" outra margem, "master~0.7" outro pessimismo, "master@500" outro tempo
 * máximo (ms), "master%4" avalia 4 respostas dos adversários em dupla e "master-dw" usa
 * em dupla os pesos das batalhas individuais.
 */
function makeAI(spec) {
	if (typeof spec === 'object') {
		const search = spec.model || spec.doublesModel ? {
			model: spec.model, doublesModel: spec.doublesModel, sim: { ...MASTER_SIM, ...spec.sim },
		} : null;
		const weights = { ...DEFAULT_WEIGHTS, ...spec.weights };
		return new HeuristicAI(spec.level || 'master', Math.random, {}, weights, search);
	}
	if (spec.startsWith('master')) {
		const pessimism = /~([\d.]+)/.exec(spec);
		const margin = /\^([\d.]+)/.exec(spec);
		const samples = /!sim(\d+)/.exec(spec);
		const budget = /@(\d+)/.exec(spec);
		const responses = /%(\d+)/.exec(spec);
		const model = spec.includes('-search') ? null : MASTER_MODEL;
		const sim = {
			...MASTER_SIM, ...(pessimism ? { pessimism: Number(pessimism[1]) } : {}),
			...(margin ? { margin: Number(margin[1]) } : {}), ...(samples ? { samples: Number(samples[1]) } : {}),
			...(budget ? { budgetMs: Number(budget[1]) } : {}),
			...(responses ? { doublesResponses: Number(responses[1]) } : {}),
		};
		const doublesWeights = spec.includes('-dw') ? masterWeights() : masterDoublesWeights();
		const search = model ? { model, doublesModel: MASTER_DOUBLES_MODEL, sim } : null;
		return new HeuristicAI('master', Math.random, {}, masterWeights(), search, doublesWeights);
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
function drive(stream, spec, stats, side, samples) {
	const ai = makeAI(spec);
	const name = specName(spec);
	const log = [];
	let request = null;
	let invalid = 0;
	let lastChoice = null;
	const send = choice => {
		if (choice) void stream.write(choice);
		lastChoice = choice;
	};
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
		// A Mestre do servidor responde com uma Promise
		if (choice && typeof choice.then === 'function') {
			const asked = request;
			void choice.then(result => {
				if (request === asked) send(result);
			});
			return;
		}
		send(choice);
	};
	void (async () => {
		for await (const chunk of stream) {
			let skipSecret = false;
			for (const line of chunk.split('\n')) {
				if (line.startsWith('|request|')) {
					request = JSON.parse(line.slice(9));
					invalid = 0;
					// Posições para o modelo de avaliação: pedidos de jogada (individual ou dupla)
					if (samples && request.active?.length && !request.wait && !request.forceSwitch) {
						samples[side].push(positionFeatures(buildPosition(request, readBattleState(log))));
					}
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
 * options: { format, p1, p2, seed?, team1?, team2?, stats?, samples? } — p1/p2 são
 * especificações de IA (ver makeAI), team1/team2 são times empacotados (formatos sem
 * times gerados) e seed é uma semente do PS ("sodium,<32 hex>"), para repetir a mesma
 * batalha. Com samples ({ p1: [], p2: [] }), cada lado grava as características das
 * posições em que joga (position.ts), para treinar o modelo de avaliação.
 */
async function runBattle(options) {
	const stats = options.stats || { invalid: {} };
	const streams = getPlayerStreams(new BattleStream());
	drive(streams.p1, options.p1, stats, 'p1', options.samples);
	drive(streams.p2, options.p2, stats, 'p2', options.samples);
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
