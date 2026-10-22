/**
 * pokemon-showdown-custom: batalhas dos nós da Expedição.
 *
 * - Batalha jogada: a mesma do Desafio de Ginásios (NpcBattle), pública e com save
 *   state. Batalha automática: a mesma, com uma IA jogando pelo jogador, que assiste.
 * - O time do jogador entra com o estado da run (HP e PP; desmaiados ficam de fora),
 *   que vai nas opções do lado do NPC e é aplicado pelo formato (formats.ts). No fim,
 *   o formato devolve o estado final do time, que volta para a run.
 * - Vitória: experiência para quem não desmaiou, golpes novos e evoluções na fila de
 *   decisões, e o nó termina. Derrota (ou empate): a run acaba (decisão do usuário).
 * - Uma aba só (pedido do usuário; também evita mexer na run pela página durante a
 *   batalha): ao abrir a batalha, a aba da página da run fecha; no fim, o botão de
 *   volta fecha a aba da batalha e abre a da run (client-custom.js → expeditionReturn).
 * - Interrupção (servidor reiniciado, sala fechada): a batalha fica aberta. Com save
 *   state, é retomada do ponto em que parou; sem ele, começa de novo, com o mesmo
 *   encontro e o mesmo estado do time.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { Teams } from '../../../sim/teams';
import { createNpcBattle, NpcBattle, type NpcBattleHooks, type NpcBattleResult } from '../gym-challenge/npc-battle';
import { createAI } from '../gym-challenge/ai';
import { getStore } from './state';
import { getVariant } from './variant';
import { findNode, generateAct } from './map';
import { encounterFromSpec, generateEncounter, type Encounter } from './encounters';
import { EXPEDITION_STATE_LINE, expeditionFormatId, PERSISTENT_STATUSES, type MonFinalState } from './formats';
import { expRates, gainExperience, nuzlockeBonus } from './progression';
import { healMon, type RunMon } from './team';
import { battlePrize } from './economy';
import type { ExpeditionBattle, ExpeditionRun } from './store';

/** Estado final de cada batalha, recebido do simulador logo antes do fim. */
const finalStates = new Map<number, MonFinalState[]>();

/** Liga as batalhas ao resto das regras da run (runs.ts), sem importação circular. */
export const battleCallbacks: {
	completeNode: (run: ExpeditionRun) => void,
	refresh: (userid: string, variantId: string) => void,
} = { completeNode: () => {}, refresh: () => {} };

/** Testes: troca o encontro do nó atual (null volta ao normal). */
let encounterOverride: ((run: ExpeditionRun) => Encounter | null) | null = null;
export function setEncounterOverride(override: typeof encounterOverride) {
	encounterOverride = override;
}

/** Encontro do nó atual da run (null se o nó não tem batalha). */
export function currentEncounter(run: ExpeditionRun): Encounter | null {
	if (encounterOverride) return encounterOverride(run);
	const variant = getVariant(run.variant);
	if (!variant || !run.node) return null;
	const node = findNode(generateAct(run.seed, run.act, run.settings.map), run.node);
	if (!node) return null;
	// Batalha começada por um evento "?" (events.ts)
	if (run.nodeState?.battle) return encounterFromSpec(run, variant, node, run.nodeState.battle);
	return generateEncounter(run, variant, node);
}

/** Pokémon do jogador que entram na batalha (os que não estão desmaiados). */
function battleTeam(run: ExpeditionRun): RunMon[] {
	return run.team.filter(mon => !mon.fainted && mon.hp > 0);
}

function packPlayerTeam(team: RunMon[]) {
	return Teams.pack(team.map(mon => ({
		name: mon.species, species: mon.species, item: mon.item, ability: mon.ability,
		moves: mon.moves.map(id => Dex.moves.get(id).name), nature: mon.nature, gender: mon.gender,
		evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }, ivs: { ...mon.ivs }, level: mon.level,
	}) as any));
}

function hooksFor(battleId: number): NpcBattleHooks {
	const store = getStore();
	return {
		onEnd: result => finishExpeditionBattle(battleId, result),
		onSave: inputLog => store.saveBattleState(battleId, inputLog),
		onPrivateLine: line => {
			if (!line.startsWith(EXPEDITION_STATE_LINE)) return false;
			finalStates.set(battleId, JSON.parse(line.slice(EXPEDITION_STATE_LINE.length)));
			return true;
		},
	};
}

/** Cria a sala da batalha (nova ou retomada pelo save state). */
function openBattleRoom(user: User, run: ExpeditionRun, encounter: Encounter, battle: ExpeditionBattle,
	team: RunMon[] | null) {
	const variant = getVariant(run.variant)!;
	const auto = run.settings.rules.battles === 'auto';
	const playerTeam = team || [];
	const room = createNpcBattle(user, {
		format: expeditionFormatId(run.variant, encounter.doubles),
		team: team ? packPlayerTeam(playerTeam) : '',
		inputLog: team ? undefined : battle.inputLog!,
		npc: {
			name: encounter.name, team: encounter.packed, avatar: encounter.avatar || undefined,
			ai: createAI(encounter.aiLevel),
			// Estado do time do jogador (HP e PP), aplicado pelo formato no começo da batalha
			playerData: team ? {
				expedition: { p1: playerTeam.map(mon => ({ hp: mon.hp, ppUsed: mon.ppUsed, status: mon.status || '' })) },
			} : {},
		},
		title: `${user.name} vs. ${encounter.name}`,
		hooks: hooksFor(battle.id),
		autoPlayer: auto ? createAI(variant.autoAILevel || 'hard') : undefined,
	});
	if (!room) return null;
	getStore().setBattleRoom(battle.id, room.roomid);
	room.add(`|raw|<div class="broadcast-blue"><strong>Expedition</strong> &ndash; ${Utils.escapeHTML(encounter.name)}` +
		`${team ? '' : '<br />The battle was resumed from where it stopped.'}</div>`).update();
	return room;
}

/** Fecha a aba da página da run nas conexões do jogador (a batalha fica como a única aba da expedição). */
function closeRunPage(user: User, variantId: string) {
	const page = `expedicao-run-${variantId}`;
	for (const connection of user.connections) {
		if (!connection.openPages?.has(page)) continue;
		connection.openPages.delete(page);
		connection.send(`>view-${page}\n|deinit`);
	}
}

/**
 * Batalha do nó atual: vai para a sala se ela está aberta, retoma a interrompida ou
 * começa uma nova (e fecha a aba da página da run). Devolve false se não foi possível
 * (ex.: servidor reiniciando).
 */
export function startOrResumeBattle(user: User, run: ExpeditionRun): boolean {
	const started = openOrResume(user, run);
	if (started) closeRunPage(user, run.variant);
	return started;
}

function openOrResume(user: User, run: ExpeditionRun): boolean {
	const store = getStore();
	const encounter = currentEncounter(run);
	if (!encounter) return false;
	const open = store.getOpenBattle(run);
	if (open) {
		const game = open.roomid ? Rooms.get(open.roomid)?.game : null;
		if (game instanceof NpcBattle && !game.ended) {
			user.joinRoom(game.room);
			return true;
		}
		// Retomada: com save state, do ponto em que parou; sem ele, de novo do começo
		if (open.inputLog) return !!openBattleRoom(user, run, encounter, open, null);
		const team = open.teamUids.map(uid => run.team.find(mon => mon.uid === uid)).filter((mon): mon is RunMon => !!mon);
		return !!openBattleRoom(user, run, encounter, open, team);
	}
	const team = battleTeam(run);
	if (!team.length) return false;
	const battle = store.createBattle(run.id, run.act, run.node!, team.map(mon => mon.uid));
	return !!openBattleRoom(user, run, encounter, battle, team);
}

/** A batalha do nó atual está em andamento ou interrompida. */
export function hasOpenBattle(run: ExpeditionRun) {
	return !!getStore().getOpenBattle(run);
}

/** Ao entrar com a conta: retoma as batalhas interrompidas (as com sala viva o próprio PS recoloca). */
export function resumeBattlesOnLogin(user: User) {
	for (const { run, battle } of getStore().listUnfinishedBattles(user.id)) {
		if (battle.roomid && Rooms.get(battle.roomid)?.game) continue;
		if (run.act !== battle.act || run.node !== battle.node) continue;
		startOrResumeBattle(user, run);
	}
}

/** Desistência com batalha aberta: forfeit na sala viva, ou derrota direta se interrompida. */
export function forfeitOpenBattle(user: User | ID, run: ExpeditionRun, message = ' gave up the expedition.') {
	const open = getStore().getOpenBattle(run);
	if (!open) return;
	const game = open.roomid ? Rooms.get(open.roomid)?.game : null;
	if (game instanceof NpcBattle && !game.ended) {
		game.forfeit(user, message);
	} else {
		getStore().finishBattle(open.id, 'loss');
	}
}

/** Estado final da batalha de volta para o time da run. */
function applyFinalState(run: ExpeditionRun, battle: ExpeditionBattle, states: MonFinalState[] | undefined) {
	for (const state of states || []) {
		const mon = run.team.find(entry => entry.uid === battle.teamUids[state.index]);
		if (!mon) continue;
		mon.fainted = state.fainted || state.hp <= 0;
		mon.hp = mon.fainted ? 0 : Math.max(0.01, Math.min(1, state.hp));
		mon.ppUsed = mon.moves.map((_, i) => Math.max(0, Number(state.ppUsed[i]) || 0));
		mon.status = !mon.fainted && PERSISTENT_STATUSES.includes(state.status || '') ? state.status : '';
		// Item gasto (berry comida, Focus Sash) se perde, como nos jogos
		if (state.itemUsed) mon.item = '';
	}
}

/** Selvagem ou lendário vencido, pronto para entrar no time: HP cheio, sem status e sem item. */
function capturedMon(run: ExpeditionRun, encounter: Encounter): RunMon | null {
	const foe = encounter.team[0];
	if (!foe) return null;
	return {
		...foe, uid: `c${run.act}-${run.node}`, hp: 1, fainted: false, status: '', item: '',
		ppUsed: foe.moves.map(() => 0),
	};
}

/**
 * Aviso no fim da batalha, na sala: o resultado e o botão de volta para a página da
 * run (que já foi atualizada). Em inglês, como os avisos do Desafio: a interface
 * traduz (client-i18n-pt.js).
 */
function announceResult(roomid: string | null, run: ExpeditionRun) {
	const room = roomid ? Rooms.get(roomid) : null;
	if (!room) return;
	let message = 'Victory! The expedition continues.';
	if (run.status === 'won') message = 'Expedition complete. Congratulations!';
	if (run.status === 'lost') message = 'Defeat. The expedition is over.';
	room.add(`|raw|<div class="broadcast-blue"><strong>${message}</strong><br />` +
		`<button class="button" name="expeditionReturn" value="view-expedicao-run-${run.variant}">` +
		`Back to the expedition</button></div>`
	).update();
}

/** Resultado de uma batalha de nó: aplicado à run. */
export function finishExpeditionBattle(battleId: number, result: NpcBattleResult, states?: MonFinalState[]) {
	const store = getStore();
	const battle = store.getBattle(battleId);
	if (!battle || battle.result) return;
	const finalState = states || finalStates.get(battleId);
	finalStates.delete(battleId);
	store.finishBattle(battleId, result);
	const run = store.getRun(battle.runId);
	// Run encerrada durante a batalha (desistência): nada muda
	if (!run || run.status !== 'active' || run.act !== battle.act || run.node !== battle.node) return;
	applyFinalState(run, battle, finalState);
	const encounter = currentEncounter(run);
	if (result !== 'win') {
		run.lastBattle = { opponent: encounter?.name || '', result, gains: [] };
		run.status = 'lost';
		run.endedAt = Math.floor(Date.now() / 1000);
		store.saveRun(run);
		battleCallbacks.refresh(run.userid, run.variant);
		announceResult(battle.roomid, run);
		return;
	}
	if (encounter) {
		const defeated = encounter.team.map(mon => ({ species: mon.species, level: mon.level }));
		// Nuzlocke: quem desmaiou sai do time antes da experiência; o time que sobra,
		// se menor, ganha um pouco mais
		const nuzlocke = run.settings.rules.faint === 'nuzlocke';
		if (nuzlocke) run.team = run.team.filter(mon => !mon.fainted);
		const rates = expRates(run.settings);
		let multiplier = rates.multiplier * (encounter.kind === 'boss' ? rates.boss : 1);
		if (nuzlocke) multiplier *= nuzlockeBonus(run.team.length, run.settings.rules.teamSize);
		const { decisions, gains } = gainExperience(run.team, defeated, encounter.trainer, multiplier, run.settings.theme);
		run.decisions.push(...decisions);
		// Dinheiro: só contra treinadores e o chefe, como nos jogos (economy.ts)
		// Recompensa de um evento (desafio do veterano, árvore de berries): na vitória
		const reward = run.nodeState?.reward || {};
		const money = battlePrize(encounter, run.settings) + (reward.money || 0);
		run.money += money;
		const items: string[] = reward.items || [];
		run.items.push(...items);
		run.lastBattle = { opponent: encounter.name, result, gains, money, items };
		// Captura: depois das decisões do time, o jogador escolhe se fica com o selvagem
		const wild = encounter.kind === 'wild' || encounter.kind === 'legendary';
		const mon = wild && run.settings.rules.capture === 'choose' ? capturedMon(run, encounter) : null;
		if (mon) run.decisions.push({ kind: 'capture', uid: mon.uid, mon });
	}
	// Nuzlocke: quem desmaiou sai do time; cura total: os demais voltam inteiros
	if (run.settings.rules.faint === 'nuzlocke') run.team = run.team.filter(mon => !mon.fainted);
	if (run.settings.rules.attrition === 'fullheal') {
		for (const mon of run.team) healMon(mon);
	}
	battleCallbacks.completeNode(run);
	store.saveRun(run);
	battleCallbacks.refresh(run.userid, run.variant);
	announceResult(battle.roomid, run);
}
