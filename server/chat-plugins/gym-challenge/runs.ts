/**
 * pokemon-showdown-custom: jornadas em andamento (iniciar, batalhar, registrar
 * resultados, desistir, encerrar).
 *
 * Junta o banco (store.ts), as regras puras (journey.ts) e as batalhas contra NPC
 * (npc-battle.ts). As mensagens ao jogador são Problem com TLkey (traduzidas por
 * quem exibe); os avisos na sala da batalha ficam em inglês, como os do PS, porque
 * a sala é pública e cada espectador tem seu idioma.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { TLkey } from '../../../sim/dex-text';
import { getStore } from './state';
import { computeProgress, drawRunStages, statusAfterBattle, teamHash, type Progress } from './journey';
import { createNpcBattle, NpcBattle, type NpcBattleResult } from './npc-battle';
import { createAI } from './ai';
import { isAILevel } from './levels';
import type { Problem } from './rules';
import type { Challenge, Run, RunStage, RunStatus } from './store';

const problem = (message: string, ...args: (string | number)[]): Problem => ({ message, args });

function trainerMap() {
	return new Map(getStore().listTrainers().map(trainer => [trainer.id, trainer]));
}

/** Começa uma jornada: copia as etapas (ou sorteia os ginásios) e grava. */
export function startRun(userid: string, challengeId: number): Run | Problem {
	const store = getStore();
	const challenge = store.getChallenge(challengeId);
	if (challenge?.status !== 'open') return problem(TLkey`This challenge is not open.`);
	if (store.getActiveRun(challengeId, userid)) return problem(TLkey`You already have a journey in this challenge.`);
	const stages = drawRunStages(challenge, store.getStages(challengeId), store.getPool(challengeId), trainerMap());
	if (!stages) return problem(TLkey`This challenge is not ready. Tell an administrator.`);
	return store.createRun(challengeId, userid, stages);
}

export interface RunState {
	run: Run;
	challenge: Challenge;
	stages: RunStage[];
	progress: Progress;
}

/**
 * Estado atual da jornada. Uma batalha "em andamento" cuja sala não existe mais
 * (ex.: fechou sem aviso) é descartada: vira 'void' e não conta.
 */
export function runState(run: Run): RunState {
	const store = getStore();
	const challenge = store.getChallenge(run.challengeId)!;
	const stages = store.getRunStages(run.id);
	let progress = computeProgress(challenge, stages, store.getRunBattles(run.id), run.targetPosition);
	const ongoing = progress.ongoing;
	if (ongoing) {
		const game = Rooms.get(ongoing.roomid)?.game;
		if (!(game instanceof NpcBattle) || game.ended) {
			store.finishBattle(ongoing.id, 'void');
			progress = computeProgress(challenge, stages, store.getRunBattles(run.id), run.targetPosition);
		}
	}
	return { run, challenge, stages, progress };
}

/** Ordem livre: o ginásio que o "Battle!" vai enfrentar. */
export function chooseGym(run: Run, position: number): Problem | null {
	const { challenge, progress } = runState(run);
	if (challenge.orderMode !== 'free') return problem(TLkey`The gym order of this challenge is fixed.`);
	if (!progress.choices.some(stage => stage.position === position)) return problem(TLkey`This gym cannot be chosen.`);
	getStore().setTargetPosition(run.id, position);
	return null;
}

/** Nome da etapa nos avisos da sala (em inglês, como as mensagens do PS). */
function stageLabel(stage: RunStage, gymCount: number) {
	if (stage.kind === 'gym') return `Gym ${stage.position}/${gymCount}`;
	if (stage.kind === 'elite4') return `Elite Four ${stage.position}/4`;
	return `Champion`;
}

function trainerLabel(stage: RunStage) {
	return [stage.trainerTitle, stage.trainerName].filter(Boolean).join(' ') + (stage.type ? ` (${stage.type})` : '');
}

/**
 * "Battle!" num formato de desafio: confere a jornada e o time e inicia a batalha
 * contra a etapa atual. Devolve um problema para mostrar ao jogador, ou null.
 */
export async function startStageBattle(
	user: User, connection: Connection, formatid: string, challengeId: number
): Promise<Problem | null> {
	const store = getStore();
	const check = () => {
		const challenge = store.getChallenge(challengeId);
		if (challenge?.status !== 'open') return problem(TLkey`This challenge is not open.`);
		const run = store.getActiveRun(challengeId, user.id);
		if (!run) return problem(TLkey`Start a journey on the challenge page first (command: /ginasio).`);
		const state = runState(run);
		if (state.progress.ongoing) return problem(TLkey`You already have a battle in progress in this journey.`);
		if (!state.progress.next) return problem(TLkey`This journey has no battles left.`);
		return state;
	};
	const before = check();
	if ('message' in before) return before;

	// Mesma validação de uma busca normal: formato, time, punições, limites de batalhas
	const ready = await Ladders(formatid).prepBattle(connection, 'challenge');
	if (!ready) return null; // prepBattle já mostrou o motivo
	if (!user.connected) return null;
	// O jogador pode ter clicado duas vezes ou desistido durante a validação
	const state = check();
	if ('message' in state) return state;
	const { run, challenge, progress } = state;
	const stage = progress.next!;

	const hash = teamHash(ready.settings.team);
	if (challenge.teamLock && run.teamHash && run.teamHash !== hash) {
		return problem(TLkey`This journey has a team lock: use the same team as in the first battle (only nicknames and order may change). To use another team, give up and start a new journey.`);
	}

	let battleId = 0;
	const room = createNpcBattle(user, {
		format: ready.formatid,
		team: ready.settings.team,
		npc: {
			name: stage.trainerName,
			team: stage.team,
			ai: createAI(isAILevel(stage.aiLevel) ? stage.aiLevel : 'random'),
		},
		title: `${user.name} vs. ${stage.trainerName}`,
		turnSeconds: challenge.timerMode === 'turn' ? challenge.turnSeconds : null,
		hooks: {
			onEnd: result => recordResult(battleId, result),
			onInterrupted: () => store.finishBattle(battleId, 'void'),
		},
	});
	if (!room) return null;
	battleId = store.startBattle(run.id, stage.kind, stage.position, room.roomid).id;
	if (challenge.teamLock && !run.teamHash) store.setTeamHash(run.id, hash);
	refreshChallengePage(user.id, challengeId);
	room.add(`|raw|<div class="broadcast-blue"><strong>${Utils.escapeHTML(challenge.name)}</strong> &ndash; ` +
		`${stageLabel(stage, progress.gymCount)}: ${Utils.escapeHTML(trainerLabel(stage))}</div>`).update();
	return null;
}

/** Resultado de uma batalha da jornada: insígnia, vitória no desafio ou eliminação. */
export function recordResult(battleId: number, result: NpcBattleResult): RunStatus | null {
	const store = getStore();
	if (!battleId || !store.finishBattle(battleId, result)) return null;
	const battle = store.getRunBattle(battleId)!;
	const run = store.getRun(battle.runId)!;
	// Desistência: o forfeit conta como derrota no histórico, e a jornada continua "desistiu"
	if (run.status !== 'active' && run.status !== 'closed') return run.status;
	const { challenge, stages, progress } = runState(run);
	const stage = stages.find(s => s.kind === battle.kind && s.position === battle.position)!;
	let status = statusAfterBattle(challenge, stage, result, progress);
	if (run.status === 'closed') {
		// Encerrada pelo admin durante esta batalha (decisão do usuário): o resultado conta.
		// A insígnia já entra no histórico (vem das batalhas); vitória no desafio ou eliminação
		// substituem o "encerrada". Uma jornada encerrada não inicia batalhas novas, então
		// esta batalha estava em andamento quando o admin encerrou.
		if (status === 'active') status = 'closed';
		else store.setRunStatus(run.id, status);
	} else if (status !== 'active') {
		store.setRunStatus(run.id, status);
	}

	const room = Rooms.get(battle.roomid);
	const player = Utils.escapeHTML(Users.getExact(run.userid)?.name || run.userid);
	let message = '';
	if (status === 'won') {
		message = `Congratulations! ${player} won the challenge ${Utils.escapeHTML(challenge.name)}!`;
	} else if (status === 'eliminated') {
		message = `${player} was eliminated from this journey.`;
	} else if (status === 'closed') {
		message = result === 'win' && stage.kind === 'gym' ?
			`${player} earned the ${Utils.escapeHTML(stage.type || '')} badge. This journey was closed by an administrator.` :
			`This journey was closed by an administrator.`;
	} else if (result === 'win' && stage.kind === 'gym') {
		message = `${player} earned the ${Utils.escapeHTML(stage.type || '')} badge ` +
			`(${progress.badges.length}/${progress.gymCount}).`;
	} else if (result === 'loss' && stage.kind !== 'gym' && challenge.hasElite4) {
		message = `The Elite Four starts over from the first member.`;
	}
	if (message && room) room.add(`|raw|<div class="broadcast-blue"><strong>${message}</strong></div>`).update();
	refreshChallengePage(run.userid, run.challengeId);
	return status;
}

/** Redesenha a página do desafio para o jogador, se ele estiver com ela aberta. */
export function refreshChallengePage(userid: string, challengeId: number) {
	const user = Users.getExact(userid);
	if (!user) return;
	const page = `ginasios-desafio-${challengeId}`;
	for (const connection of user.connections) {
		if (connection.openPages?.has(page)) void Chat.parse(`/join view-${page}`, null, user, connection);
	}
}

/**
 * Desistência: encerra a jornada na hora. Uma batalha em andamento recebe forfeit
 * (conta como derrota, mas a jornada já está encerrada).
 */
export function abandonRun(user: User, run: Run) {
	const store = getStore();
	const { progress } = runState(run);
	store.setRunStatus(run.id, 'abandoned');
	if (progress.ongoing) {
		const game = Rooms.get(progress.ongoing.roomid)?.game;
		if (game instanceof NpcBattle && !game.ended) game.forfeit(user, ' gave up the journey.');
	}
}

/**
 * Encerramento pelo admin: a batalha em andamento continua, e o resultado dela conta
 * (ver recordResult).
 */
export function closeRun(run: Run) {
	getStore().setRunStatus(run.id, 'closed');
}
