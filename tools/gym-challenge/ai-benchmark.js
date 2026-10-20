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

const { runBattle } = require('./battle-runner');

const BATTLES = Number(process.argv[2]) || 60;
const FORMAT = process.argv[3] || 'gen9randombattle';
const MATCHUPS = process.argv[4] ? process.argv[4].split(',').map(pair => pair.split(':')) : [
	['easy', 'random'], ['medium', 'random'], ['hard', 'random'],
	['medium', 'easy'], ['hard', 'easy'], ['hard', 'medium'],
];
/** Escolhas recusadas pelo simulador, por nível (uma IA correta não erra). */
const stats = { invalid: {} };
const invalidChoices = stats.invalid;

function battle(p1, p2) {
	return runBattle({ format: FORMAT, p1, p2, stats });
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
