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
import { createNpcBattle, NpcBattle, type NpcBattleHooks, type NpcBattleResult } from './npc-battle';
import { createAI } from './ai';
import { isAILevel } from './levels';
import { badgeIcon } from './badges';
import { doublesFormatId } from './formats';
import type { Problem } from './rules';
import type { Challenge, Run, RunBattle, RunStage, RunStatus } from './store';

const problem = (message: string, ...args: (string | number)[]): Problem => ({ message, args });

/** No máximo RUN_START_LIMIT jornadas novas por jogador a cada RUN_START_WINDOW segundos. */
const RUN_START_LIMIT = 5;
const RUN_START_WINDOW = 10 * 60;

function trainerMap() {
	return new Map(getStore().listTrainers().map(trainer => [trainer.id, trainer]));
}

/** Começa uma jornada: copia as etapas (ou sorteia os ginásios) e grava. */
export function startRun(userid: string, challengeId: number): Run | Problem {
	const store = getStore();
	const challenge = store.getChallenge(challengeId);
	if (challenge?.status !== 'open') return problem(TLkey`This challenge is not open.`);
	if (store.getActiveRun(challengeId, userid)) return problem(TLkey`You already have a journey in this challenge.`);
	// Evita criar jornadas sem fim (desistir e recomeçar em loop)
	if (store.countRunsSince(userid, Math.floor(Date.now() / 1000) - RUN_START_WINDOW) >= RUN_START_LIMIT) {
		return problem(TLkey`You started too many journeys in a short time. Wait a few minutes.`);
	}
	const stages = drawRunStages(challenge, store.getStages(challengeId), store.getPool(challengeId), trainerMap());
	if (!stages) return problem(TLkey`This challenge is not ready. Tell an administrator.`);
	return store.createRun(challengeId, userid, stages);
}

export interface RunState {
	run: Run;
	challenge: Challenge;
	stages: RunStage[];
	progress: Progress;
	/** A batalha em andamento não tem sala (servidor reiniciado, sala expirada), mas tem estado salvo. */
	suspended: boolean;
}

/**
 * Estado atual da jornada. Uma batalha "em andamento" cuja sala não existe mais
 * fica suspensa se tiver estado salvo (save state; não dá para fugir de uma derrota
 * fechando a página ou derrubando a conexão). Sem estado salvo, ela não chegou a
 * ter jogadas e é descartada: vira 'void' e não conta.
 */
export function runState(run: Run): RunState {
	const store = getStore();
	const challenge = store.getChallenge(run.challengeId)!;
	const stages = store.getRunStages(run.id);
	let progress = computeProgress(challenge, stages, store.getRunBattles(run.id), run.targetPosition);
	let suspended = false;
	const ongoing = progress.ongoing;
	if (ongoing) {
		const game = Rooms.get(ongoing.roomid)?.game;
		if (!game && ongoing.savedAt) {
			suspended = true;
		} else if (!(game instanceof NpcBattle) || game.ended) {
			store.finishBattle(ongoing.id, 'void');
			progress = computeProgress(challenge, stages, store.getRunBattles(run.id), run.targetPosition);
		}
	}
	return { run, challenge, stages, progress, suspended };
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
	return [stage.trainerTitle, stage.trainerName].filter(Boolean).join(' ') + (stage.type ? ` (${stage.type})` : '') +
		(stage.doubles ? ' - Doubles' : '');
}

/**
 * "Battle!" num formato de desafio: confere a jornada e o time e inicia a batalha
 * contra a etapa atual. Devolve um problema para mostrar ao jogador, ou null.
 */
export async function startStageBattle(
	user: User, connection: Connection, formatid: string, challengeId: number
): Promise<Problem | null> {
	const store = getStore();
	// Batalha suspensa (save state): o "Battle!" a retoma, em vez de começar outra
	const activeRun = store.getActiveRun(challengeId, user.id);
	if (activeRun) {
		const { progress, suspended } = runState(activeRun);
		if (suspended) return resumeBattle(user, progress.ongoing!);
	}
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

	// Treinador em dupla: a variante em dupla do formato (as mesmas regras)
	let battleFormat = ready.formatid;
	if (stage.doubles) {
		const base = Dex.formats.get(ready.formatid);
		const doubles = Dex.formats.get(doublesFormatId(base.name));
		if (base.gameType !== 'doubles') {
			if (!doubles.exists || !doubles.gymDoubles) {
				return problem(TLkey`The doubles battles of this challenge are unavailable. Tell an administrator.`);
			}
			battleFormat = doubles.id;
		}
		if ((Teams.unpack(ready.settings.team) || []).length < 2) {
			return problem(TLkey`This trainer battles in doubles: your team needs at least 2 Pokémon.`);
		}
	}

	const hash = teamHash(ready.settings.team);
	if (challenge.teamLock && run.teamHash && run.teamHash !== hash) {
		return problem(TLkey`This journey has a team lock: use the same team as in the first battle (only nicknames and order may change). To use another team, give up and start a new journey.`);
	}

	const ref = { id: 0 };
	const room = createNpcBattle(user, {
		format: battleFormat,
		team: ready.settings.team,
		npc: npcFor(stage),
		title: `${user.name} vs. ${stage.trainerName}`,
		turnSeconds: challenge.timerMode === 'turn' ? challenge.turnSeconds : null,
		hooks: battleHooks(ref),
	});
	if (!room) return null;
	const species = (Teams.unpack(ready.settings.team) || []).map(set => set.species);
	ref.id = store.startBattle(run.id, stage.kind, stage.position, room.roomid, species).id;
	if (challenge.teamLock && !run.teamHash) store.setTeamHash(run.id, hash);
	refreshChallengePage(user.id, challengeId);
	room.add(`|raw|<div class="broadcast-blue"><strong>${Utils.escapeHTML(challenge.name)}</strong> &ndash; ` +
		`${stageLabel(stage, progress.gymCount)}: ${Utils.escapeHTML(trainerLabel(stage))}</div>`).update();
	return null;
}

function npcFor(stage: RunStage) {
	return {
		name: stage.trainerName,
		team: stage.team,
		avatar: stage.trainerAvatar || undefined,
		ai: createAI(isAILevel(stage.aiLevel) ? stage.aiLevel : 'random'),
	};
}

/** Ganchos de uma batalha da jornada. `ref.id` é o id da batalha no banco (0 até ser gravada). */
function battleHooks(ref: { id: number }): NpcBattleHooks {
	const store = getStore();
	return {
		onEnd: result => recordResult(ref.id, result),
		// Com estado salvo, a batalha fica suspensa (ver runState) e pode ser retomada
		onInterrupted: () => {
			if (ref.id && !store.getRunBattle(ref.id)?.savedAt) store.finishBattle(ref.id, 'void');
		},
		onVoid: () => {
			if (ref.id) store.finishBattle(ref.id, 'void');
		},
		onSave: inputLog => {
			if (ref.id) store.saveBattleState(ref.id, inputLog);
		},
	};
}

/** Formato gravado na primeira linha do estado salvo (">start {...}"). */
function savedFormat(inputLog: string): ID {
	const first = inputLog.split('\n', 1)[0];
	if (!first.startsWith('>start ')) return '';
	try {
		return toID(JSON.parse(first.slice(7)).formatid);
	} catch {
		return '';
	}
}

/**
 * Retoma uma batalha suspensa (save state) do ponto em que parou: o simulador
 * reproduz o estado salvo numa sala nova. Se a sala ainda existe, só leva o jogador
 * até ela. Vale também para jornadas encerradas pelo admin durante a batalha, cujo
 * resultado conta (ver recordResult).
 */
export function resumeBattle(user: User, battle: RunBattle): Problem | null {
	const store = getStore();
	const run = store.getRun(battle.runId);
	if (!run || run.userid !== user.id || (run.status !== 'active' && run.status !== 'closed')) return null;
	const game = Rooms.get(battle.roomid)?.game;
	if (game instanceof NpcBattle && !game.ended) {
		user.joinRoom(game.room);
		return null;
	}
	const inputLog = store.getBattleState(battle.id);
	if (!inputLog) return null; // já terminou
	const challenge = store.getChallenge(run.challengeId)!;
	const stages = store.getRunStages(run.id);
	const stage = stages.find(s => s.kind === battle.kind && s.position === battle.position);
	const formatid = savedFormat(inputLog);
	if (!stage || !Dex.formats.get(formatid).exists) {
		// O formato de um desafio encerrado sai da lista: não há como remontar a batalha
		store.finishBattle(battle.id, 'void');
		refreshChallengePage(user.id, run.challengeId);
		return problem(TLkey`Your interrupted battle could not be resumed because the challenge format is no longer available. It does not count.`);
	}

	const ref = { id: battle.id };
	const room = createNpcBattle(user, {
		format: formatid,
		team: '',
		inputLog,
		npc: npcFor(stage),
		title: `${user.name} vs. ${stage.trainerName}`,
		turnSeconds: challenge.timerMode === 'turn' ? challenge.turnSeconds : null,
		hooks: battleHooks(ref),
	});
	if (!room) return null; // servidor reiniciando: createNpcBattle já avisou
	store.setBattleRoom(battle.id, room.roomid);
	const gymCount = stages.filter(s => s.kind === 'gym').length;
	room.add(`|raw|<div class="broadcast-blue"><strong>${Utils.escapeHTML(challenge.name)}</strong> &ndash; ` +
		`${stageLabel(stage, gymCount)}: ${Utils.escapeHTML(trainerLabel(stage))}<br />` +
		`The battle was resumed from where it stopped.</div>`).update();
	refreshChallengePage(user.id, run.challengeId);
	return null;
}

/**
 * Ao entrar com a conta: retoma as batalhas suspensas do jogador. Batalhas com sala
 * viva ficam de fora, porque o próprio PS recoloca o jogador nelas.
 */
export function resumeSavedBattles(user: User): Problem[] {
	const problems: Problem[] = [];
	for (const battle of getStore().listSavedBattles(user.id)) {
		if (Rooms.get(battle.roomid)?.game) continue;
		const result = resumeBattle(user, battle);
		if (result) problems.push(result);
	}
	return problems;
}

/** Batalha suspensa ou em andamento de um desafio, para o botão "Continuar". */
export function savedBattleIn(userid: string, challengeId: number): RunBattle | null {
	const store = getStore();
	return store.listSavedBattles(userid).find(battle => store.getRun(battle.runId)?.challengeId === challengeId) ||
		null;
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
	// Com insígnia escolhida, o aviso traz o nome e a imagem; sem ela, o tipo do ginásio
	const earned = result === 'win' && stage.kind === 'gym';
	const badge = earned && stage.badgeName ? Utils.escapeHTML(stage.badgeName) : '';
	const badgeImage = badge ? badgeIcon({ name: stage.badgeName, image: stage.badgeImage }, stage.type, 32) + ' ' : '';
	let message = '';
	if (status === 'won') {
		message = `Congratulations! ${player} won the challenge ${Utils.escapeHTML(challenge.name)}!`;
	} else if (status === 'eliminated') {
		message = `${player} was eliminated from this journey.`;
	} else if (status === 'closed') {
		if (!earned) {
			message = `This journey was closed by an administrator.`;
		} else if (badge) {
			message = `${player} earned the ${badge}! This journey was closed by an administrator.`;
		} else {
			message = `${player} earned the ${Utils.escapeHTML(stage.type || '')} badge. This journey was closed by an administrator.`;
		}
	} else if (earned) {
		const count = `(${progress.badges.length}/${progress.gymCount})`;
		message = badge ? `${player} earned the ${badge}! ${count}` :
			`${player} earned the ${Utils.escapeHTML(stage.type || '')} badge ${count}.`;
	} else if (result === 'loss' && stage.kind !== 'gym' && challenge.hasElite4) {
		message = `The Elite Four starts over from the first member.`;
	}
	// A imagem fica fora do <strong>: o texto continua num nó só (tradução na interface)
	if (message && room) {
		room.add(`|raw|<div class="broadcast-blue">${earned ? badgeImage : ''}<strong>${message}</strong></div>`).update();
	}
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
	const { progress, suspended } = runState(run);
	store.setRunStatus(run.id, 'abandoned');
	if (suspended) {
		// Sem sala para dar forfeit: o efeito é o mesmo, a batalha conta como derrota
		store.finishBattle(progress.ongoing!.id, 'loss');
	} else if (progress.ongoing) {
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
