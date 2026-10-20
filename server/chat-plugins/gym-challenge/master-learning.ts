/**
 * pokemon-showdown-custom: aprendizado da IA Mestre com as batalhas reais (etapa 4).
 *
 * Coleta: cada batalha individual do Desafio de Ginásios (qualquer nível de NPC) grava
 * as características das posições (position.ts) dos dois lados, com quem venceu. É
 * anônimo: um código aleatório da batalha e só os números da posição (ver store.ts).
 *
 * Retreino (master-training-process.ts, toda segunda às 4h de Brasília ou pelo
 * painel), com pelo menos MIN_NEW_BATTLES batalhas novas:
 *   1. o modelo novo parte do modelo das simulações e é ajustado com as posições reais
 *      (80% das batalhas; regularização para o modelo de partida);
 *   2. verificação, em duas partes: prever melhor que o modelo em uso os resultados das
 *      batalhas reais que ficaram fora do treino (20%), E não perder da Mestre em uso
 *      em batalhas simuladas com os times do banco de treinadores (pelo menos 47%);
 *   3. passou: o modelo novo entra em uso; não passou: fica registrado como recusado.
 *
 * @license MIT
 */
import * as crypto from 'node:crypto';
import { BattleStream, getPlayerStreams } from '../../../sim/battle-stream';
import type { ChoiceRequest } from '../../../sim/side';
import type { GymStore, StoredModel } from './store';
import { FEATURES } from './position';
import { scoreValueModel, trainValueModel, type Dataset, type ValueModel } from './value-model';
import { MASTER_MODEL, MASTER_SIM } from './master-model';
import { masterWeights } from './master-weights';
import { HeuristicAI } from './heuristic-ai';
import type { SimSearchOptions } from './sim-search';

/** Batalhas reais novas exigidas para um retreino (decisão do usuário). */
export const MIN_NEW_BATTLES = 30;
/** Batalhas simuladas da verificação e a pontuação mínima do modelo novo (decisão do usuário). */
export const VERIFICATION_BATTLES = 200;
export const VERIFICATION_MIN_SCORE = 0.47;
/** O modelo novo precisa prever melhor por pelo menos isto (perda logarítmica). */
const MIN_LOSS_GAIN = 0.0005;
/** Busca mais leve nas batalhas da verificação (as duas Mestres jogam igual). */
const VERIFICATION_SEARCH: SimSearchOptions = { ...MASTER_SIM, samples: 1, budgetMs: 400 };
const VERIFICATION_FORMAT = 'gen9nationaldexag@@@Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause';

// --- Modelo em uso ------------------------------------------------------------------

function parseModel(stored: StoredModel): ValueModel | null {
	try {
		const model = JSON.parse(stored.model) as ValueModel;
		return model.features?.length === FEATURES.length ? model : null;
	} catch {
		return null;
	}
}

/**
 * Modelo de avaliação em uso: o ativo no banco ou, na primeira vez, o das simulações
 * (master-model.ts), que é gravado como o primeiro da lista.
 */
export function activeMasterModel(store: GymStore): ValueModel | null {
	if (!MASTER_MODEL) return null;
	const active = store.getActiveModel();
	const model = active && parseModel(active);
	if (model) return model;
	if (!store.getModel(MASTER_MODEL.version)) {
		store.addModel({
			version: MASTER_MODEL.version, source: 'sim', status: 'active', model: JSON.stringify(MASTER_MODEL),
			trainedAt: Math.floor(Date.now() / 1000), report: { samples: MASTER_MODEL.samples, battles: MASTER_MODEL.battles },
		});
	}
	return MASTER_MODEL;
}

// --- Coleta ------------------------------------------------------------------------

export interface RecordedPosition {
	perspective: 'npc' | 'player';
	features: number[];
}

/** Grava as posições de uma batalha terminada; `npcWon` diz quem venceu. */
export function recordBattlePositions(store: GymStore, positions: RecordedPosition[], npcWon: boolean) {
	if (!positions.length) return;
	const battle = crypto.randomBytes(12).toString('hex');
	store.addPositions(battle, positions.map(position => ({
		...position, won: position.perspective === 'npc' ? npcWon : !npcWon,
	})));
}

// --- Dados -------------------------------------------------------------------------------

/** 1 em cada 5 batalhas fica fora do treino (o código é aleatório; o primeiro byte decide). */
export function isHoldout(battle: string) {
	return parseInt(battle.slice(0, 2), 16) % 5 === 0;
}

function toDataset(rows: { features: number[], won: boolean }[]): Dataset {
	const width = FEATURES.length;
	const x = new Float32Array(rows.length * width);
	const y = new Float32Array(rows.length);
	rows.forEach((row, r) => {
		for (let c = 0; c < width; c++) x[r * width + c] = row.features[c] ?? 0;
		y[r] = row.won ? 1 : 0;
	});
	return { x, y, rows: rows.length, width };
}

// --- Batalhas da verificação -------------------------------------------------------

/** Joga uma batalha entre duas IAs (síncronas) e devolve 'p1', 'p2' ou 'tie'. */
async function playBattle(format: string, seed: string, team1: string | undefined, team2: string | undefined,
	ai1: HeuristicAI, ai2: HeuristicAI): Promise<'p1' | 'p2' | 'tie'> {
	const streams = getPlayerStreams(new BattleStream());
	const drive = (stream: typeof streams.p1, ai: HeuristicAI) => {
		const log: string[] = [];
		let invalid = 0;
		let request: ChoiceRequest | null = null;
		const decide = (forced?: string) => {
			if (!request || request.wait) return;
			let choice: string | null = forced || null;
			if (!choice) {
				try {
					choice = ai.choose(request, { log }) as string | null;
				} catch {
					choice = 'default';
				}
			}
			if (choice) void stream.write(choice);
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
						decide(invalid >= 3 ? 'default' : undefined);
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
	};
	drive(streams.p1, ai1);
	drive(streams.p2, ai2);
	const player = (name: string, team?: string) => JSON.stringify({ name, ...(team ? { team } : {}) });
	void streams.omniscient.write(`>start ${JSON.stringify({ formatid: format, seed })}\n` +
		`>player p1 ${player('P1', team1)}\n>player p2 ${player('P2', team2)}`);
	for await (const chunk of streams.omniscient) {
		for (const line of chunk.split('\n')) {
			if (line === '|win|P1') return 'p1';
			if (line === '|win|P2') return 'p2';
			if (line === '|tie' || line.startsWith('|tie|')) return 'tie';
			if (line.startsWith('|turn|') && Number(line.slice(6)) > 300) {
				void streams.omniscient.writeEnd();
				return 'tie';
			}
		}
	}
	return 'tie';
}

/**
 * Mestre com o modelo `candidate` contra a Mestre com o modelo `current`, alternando
 * os lados, com times do banco de treinadores (individuais) ou, sem pelo menos dois,
 * no Random Battle. Devolve a pontuação do candidato (empate vale meio).
 */
export async function verifyModel(
	store: GymStore, candidate: ValueModel, current: ValueModel, battles: number
): Promise<number> {
	const teams = store.listTrainers().filter(trainer => !trainer.doubles && trainer.team).map(trainer => trainer.team);
	const format = teams.length >= 2 ? Dex.formats.validate(VERIFICATION_FORMAT) : 'gen9randombattle';
	let score = 0;
	for (let i = 0; i < battles; i++) {
		const bytes = crypto.randomBytes(24);
		const seed = `sodium,${bytes.subarray(0, 16).toString('hex')}`;
		let team1: string | undefined;
		let team2: string | undefined;
		if (teams.length >= 2) {
			const a = bytes.readUInt32BE(16) % teams.length;
			team1 = teams[a];
			team2 = teams[(a + 1 + bytes.readUInt32BE(20) % (teams.length - 1)) % teams.length];
		}
		const ai = (model: ValueModel) => new HeuristicAI('master', Math.random, {}, masterWeights(), {
			model, sim: VERIFICATION_SEARCH,
		});
		const candidateIsP1 = i % 2 === 0;
		const result = await playBattle(format, seed, team1, team2,
			ai(candidateIsP1 ? candidate : current), ai(candidateIsP1 ? current : candidate));
		if (result === 'tie') score += 0.5;
		else if ((result === 'p1') === candidateIsP1) score++;
	}
	return battles ? score / battles : 0;
}

// --- Retreino ----------------------------------------------------------------------------

export interface TrainingOptions {
	trigger: 'schedule' | 'manual';
	/** Batalhas novas exigidas (padrão MIN_NEW_BATTLES). */
	minNewBattles?: number;
	/** Batalhas da verificação (padrão VERIFICATION_BATTLES). */
	verificationBattles?: number;
}

export interface TrainingSummary {
	outcome: 'accepted' | 'rejected' | 'skipped' | 'failed';
	version: string | null;
	report: AnyObject;
}

/** Faz um retreino completo e registra o resultado (no processo de treino). */
export async function runTraining(store: GymStore, options: TrainingOptions): Promise<TrainingSummary> {
	const id = store.startTraining(options.trigger);
	const finish = (summary: TrainingSummary) => {
		store.finishTraining(id, summary.outcome, summary.version, summary.report);
		return summary;
	};
	try {
		const current = activeMasterModel(store);
		if (!current || !MASTER_MODEL) return finish({ outcome: 'failed', version: null, report: { reason: 'nomodel' } });
		const stats = store.positionStats();
		const minimum = options.minNewBattles ?? MIN_NEW_BATTLES;
		if (stats.freshBattles < minimum) {
			const report = { reason: 'fewbattles', fresh: stats.freshBattles, minimum };
			return finish({ outcome: 'skipped', version: null, report });
		}
		const positions = store.listPositions();
		const train = positions.filter(p => !isHoldout(p.battle));
		const holdout = positions.filter(p => isHoldout(p.battle));
		const battlesOf = (rows: typeof positions) => new Set(rows.map(p => p.battle)).size;
		if (!train.length || !holdout.length) {
			store.markPositionsUsed();
			return finish({ outcome: 'skipped', version: null, report: { reason: 'noholdout', fresh: stats.freshBattles } });
		}
		const version = `real-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, '')}`;
		// Sempre a partir do modelo das simulações: os modelos não se acumulam uns sobre os outros
		const candidate = trainValueModel(toDataset(train), FEATURES, { version, battles: battlesOf(train) }, {
			prior: MASTER_MODEL, priorStrength: 0.01, epochs: 30, learningRate: 0.003,
		});
		const holdoutData = toDataset(holdout);
		const newLoss = scoreValueModel(candidate, holdoutData).logLoss;
		const currentLoss = scoreValueModel(current, holdoutData).logLoss;
		const report: AnyObject = {
			trainBattles: battlesOf(train), trainPositions: train.length,
			holdoutBattles: battlesOf(holdout), holdoutPositions: holdout.length,
			newLoss, currentLoss, currentVersion: current.version,
		};
		store.markPositionsUsed();
		let accepted = newLoss < currentLoss - MIN_LOSS_GAIN;
		if (accepted) {
			report.verificationBattles = options.verificationBattles ?? VERIFICATION_BATTLES;
			report.verificationScore = await verifyModel(store, candidate, current, report.verificationBattles);
			accepted = report.verificationScore >= VERIFICATION_MIN_SCORE;
		} else {
			report.reason = 'prediction';
		}
		if (accepted) {
			store.addModel({
				version, source: 'retrain', status: 'active', model: JSON.stringify(candidate),
				trainedAt: Math.floor(Date.now() / 1000), report,
			});
			return finish({ outcome: 'accepted', version, report });
		}
		report.reason ||= 'verification';
		store.addModel({
			version, source: 'retrain', status: 'rejected', model: JSON.stringify(candidate),
			trainedAt: Math.floor(Date.now() / 1000), report,
		});
		return finish({ outcome: 'rejected', version, report });
	} catch (err: any) {
		return finish({ outcome: 'failed', version: null, report: { reason: 'error', message: String(err?.message || err) } });
	}
}

// --- Agenda --------------------------------------------------------------------------

const SAO_PAULO = new Intl.DateTimeFormat('en-US', {
	timeZone: 'America/Sao_Paulo', weekday: 'short', hour: 'numeric', hourCycle: 'h23',
});

/** Segunda-feira entre 4h e 5h no horário de Brasília (retreino automático; decisão do usuário). */
export function isTrainingWindow(date: Date) {
	const parts = Object.fromEntries(SAO_PAULO.formatToParts(date).map(part => [part.type, part.value]));
	return parts.weekday === 'Mon' && Number(parts.hour) === 4;
}
