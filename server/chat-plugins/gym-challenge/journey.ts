/**
 * pokemon-showdown-custom: regras das jornadas do Desafio de Ginásios.
 *
 * Funções puras (sem banco nem estado do servidor). Regras definidas pelo usuário
 * (docs/arquitetura-desafio-ginasios.md, seções 3 e 8):
 *   - as insígnias são da jornada: vencer um ginásio dá a insígnia dele;
 *   - ordem fixa: só o próximo ginásio; ordem livre: qualquer um ainda não vencido
 *     (o escolhido na página, ou o primeiro ainda não vencido);
 *   - com todas as insígnias, a Elite 4 e o Campeão são enfrentados em sequência
 *     direta, e uma derrota em qualquer ponto volta ao primeiro membro;
 *   - empate não conta (nem vitória nem derrota); batalha interrompida também não;
 *   - o limite de derrotas conta a jornada inteira: ao atingi-lo, o jogador é
 *     eliminado; as eliminações por derrota para a Elite 4 / o Campeão são opcionais.
 *
 * @license MIT
 */
import * as crypto from 'node:crypto';
import { Teams } from '../../../sim/teams';
import type { BattleResult, Challenge, PoolEntry, RunBattle, RunStage, RunStatus, Stage, Trainer } from './store';
import { effectiveAILevel, type AILevel } from './levels';
import { activeStages } from './challenges';

export type RandomInt = (max: number) => number;

const defaultRandom: RandomInt = max => crypto.randomInt(max);

function stageFrom(stage: Pick<Stage, 'kind' | 'position' | 'aiLevel'>, trainer: Trainer, baseLevel: string): RunStage {
	return {
		kind: stage.kind,
		position: stage.position,
		trainerId: trainer.id,
		trainerName: trainer.name,
		trainerTitle: trainer.title,
		type: stage.kind === 'champion' ? null : trainer.type,
		team: trainer.team,
		aiLevel: effectiveAILevel(baseLevel as AILevel, stage.aiLevel as AILevel | null),
	};
}

/**
 * Etapas de uma jornada nova: cópia das etapas fixas ou, nos tipos sorteados,
 * `gymCount` tipos distintos sorteados entre os líderes do banco (um líder por
 * tipo). A Elite 4 e o Campeão são sempre fixos. Devolve null se faltar treinador
 * (o desafio não deveria estar aberto).
 */
export function drawRunStages(
	challenge: Challenge, stages: Stage[], pool: PoolEntry[], trainers: Map<number, Trainer>,
	random: RandomInt = defaultRandom
): RunStage[] | null {
	const result: RunStage[] = [];
	if (challenge.typeMode === 'random') {
		const byType = new Map<string, PoolEntry[]>();
		for (const entry of pool) {
			const type = trainers.get(entry.trainerId)?.type;
			if (!type) continue;
			if (!byType.has(type)) byType.set(type, []);
			byType.get(type)!.push(entry);
		}
		const types = [...byType.keys()].sort();
		if (types.length < challenge.gymCount) return null;
		for (let position = 1; position <= challenge.gymCount; position++) {
			const [type] = types.splice(random(types.length), 1);
			const candidates = byType.get(type)!;
			const entry = candidates[random(candidates.length)];
			result.push(stageFrom({ kind: 'gym', position, aiLevel: entry.aiLevel }, trainers.get(entry.trainerId)!,
				challenge.baseAILevel));
		}
	}
	for (const stage of activeStages(challenge, stages)) {
		const trainer = stage.trainerId ? trainers.get(stage.trainerId) : undefined;
		if (!trainer) return null;
		result.push(stageFrom(stage, trainer, challenge.baseAILevel));
	}
	const gyms = result.filter(stage => stage.kind === 'gym').length;
	const elite4 = result.filter(stage => stage.kind === 'elite4').length;
	if (gyms !== challenge.gymCount || (challenge.hasElite4 && elite4 !== 4)) return null;
	if (!result.some(stage => stage.kind === 'champion')) return null;
	return result;
}

export interface Progress {
	/** Posições dos ginásios vencidos (insígnias). */
	badges: number[];
	gymCount: number;
	/** Derrotas na jornada (empates e batalhas interrompidas não contam). */
	losses: number;
	/** Elite 4 (em ordem) e Campeão. */
	league: RunStage[];
	/** Quantos membros da sequência já foram vencidos desde a última derrota nela. */
	leagueWins: number;
	/** Batalha em andamento, se houver. */
	ongoing: RunBattle | null;
	/** Etapa que o "Battle!" enfrenta agora; null se a jornada já foi vencida. */
	next: RunStage | null;
	/** Ginásios que podem ser escolhidos agora (ordem livre); vazio na ordem fixa ou na liga. */
	choices: RunStage[];
}

/** Estado da jornada a partir das etapas e das batalhas já registradas. */
export function computeProgress(
	challenge: Pick<Challenge, 'orderMode'>, stages: RunStage[], battles: RunBattle[], targetPosition: number | null
): Progress {
	const gyms = stages.filter(stage => stage.kind === 'gym');
	const league = stages.filter(stage => stage.kind !== 'gym');
	const won = new Set<number>();
	let losses = 0;
	let leagueWins = 0;
	let ongoing: RunBattle | null = null;
	for (const battle of battles) {
		if (battle.result === null) {
			ongoing = battle;
			continue;
		}
		if (battle.result === 'loss') losses++;
		if (battle.kind === 'gym') {
			if (battle.result === 'win') won.add(battle.position);
		} else if (battle.result === 'win') {
			leagueWins++;
		} else if (battle.result === 'loss') {
			leagueWins = 0;
		}
	}
	const badges = gyms.filter(stage => won.has(stage.position)).map(stage => stage.position);
	const remaining = gyms.filter(stage => !won.has(stage.position));
	let next: RunStage | null = null;
	let choices: RunStage[] = [];
	if (remaining.length) {
		if (challenge.orderMode === 'free') {
			choices = remaining;
			next = remaining.find(stage => stage.position === targetPosition) || remaining[0];
		} else {
			next = remaining[0];
		}
	} else {
		next = league[leagueWins] || null;
	}
	return { badges, gymCount: gyms.length, losses, league, leagueWins, ongoing, next, choices };
}

/**
 * Situação da jornada depois de registrar o resultado de uma batalha contra
 * `stage`. `progress` já inclui essa batalha.
 */
export function statusAfterBattle(
	challenge: Pick<Challenge, 'lossLimit' | 'eliminateOnElite4Loss' | 'eliminateOnChampionLoss'>,
	stage: Pick<RunStage, 'kind'>, result: BattleResult, progress: Progress
): RunStatus {
	if (result === 'win') return stage.kind === 'champion' ? 'won' : 'active';
	if (result !== 'loss') return 'active';
	if (challenge.lossLimit !== null && progress.losses >= challenge.lossLimit) return 'eliminated';
	if (stage.kind === 'elite4' && challenge.eliminateOnElite4Loss) return 'eliminated';
	if (stage.kind === 'champion' && challenge.eliminateOnChampionLoss) return 'eliminated';
	return 'active';
}

/**
 * Hash da trava de time: sets idênticos, mas apelidos e ordem podem mudar. O time
 * empacotado é o validado pelo PS; tiramos os apelidos e ordenamos os Pokémon.
 */
export function teamHash(packedTeam: string): string {
	const sets = Teams.unpack(packedTeam) || [];
	const normalized = sets.map(set => Teams.pack([{ ...set, name: '' }])).sort();
	return crypto.createHash('sha256').update(normalized.join('\n')).digest('hex');
}
