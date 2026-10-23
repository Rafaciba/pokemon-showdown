/**
 * pokemon-showdown-custom: regras da run da Expedição.
 *
 * Fases da run:
 *   1. escolha do time inicial (`pending.kind = 'starter'`);
 *   2. decisões pendentes: golpes novos e evoluções da última vitória (o mapa espera);
 *   3. mapa: o jogador escolhe o próximo nó, entre os do primeiro andar no começo do
 *      ato ou os ligados ao nó atual;
 *   4. nó: o tipo do nó mostra as escolhas, e uma delas termina o nó. Nos nós de
 *      batalha, a escolha começa a batalha, e a vitória termina o nó (battles.ts);
 *   5. terminar o nó do chefe passa para o próximo ato ou, no último, vence a run.
 *
 * O mapa não é guardado: ele é gerado de novo a partir da semente e das configurações
 * da run (map.ts).
 *
 * @license MIT
 */
import { getStore, isAdmin } from './state';
import { getVariant, resolveSettings, type ExpeditionVariant } from './variant';
import { findNode, generateAct, reachableNodes, type ActMap } from './map';
import { getNodeType, type NodeView } from './nodes';
import './variants';
import { newSeed, seededRandom } from './random';
import { battleCallbacks, currentEncounter, forfeitOpenBattle, hasOpenBattle, startOrResumeBattle } from './battles';
import { evolveMon } from './progression';
import type { ExpeditionRun } from './store';
import type { Translator } from '../../../sim/dex-text';
import type { TextLanguage } from '../../../sim/dex-data';
import { isHeldItem, useItem, type EconomyProblem } from './economy';
import { DEFAULT_BALL, getBall, rollCapture, withBall } from './capture';
import { FEWER_CENTERS, hasPenalty, LESS_ACT_HEAL } from './difficulty';
import { maxPP } from './tooltips';
import { healMon } from './team';
import { drawProtagonists } from './protagonists';

export type RunProblem =
	'novariant' | 'disabled' | 'active' | 'norun' | 'nostarter' | 'badchoice' | 'unreachable' | 'nodeopen' | 'nonode' |
	'decisions' | 'nodecision' | 'nobattle' | 'teamfull' | 'inbattle' | 'noitem' | 'toomany' | 'boxfull' | 'lastmon' |
	EconomyProblem;

/** Vagas do Computador (escolha nossa). */
export const BOX_SIZE = 30;
/**
 * Poké Bolas no começo, nas expedições com captura por bola (decisão do usuário): 5 com
 * chance, 3 com captura certa.
 */
export const STARTING_BALLS = { chance: 5, ball: 3 } as const;

/** Captura por bola (etapa 8): "ball" (certa) ou "chance". */
export function usesBalls(run: ExpeditionRun) {
	return run.settings.rules.capture === 'ball' || run.settings.rules.capture === 'chance';
}

/** No máximo RUN_START_LIMIT runs novas por jogador a cada RUN_START_WINDOW segundos (como as jornadas do Desafio). */
export const RUN_START_LIMIT = 5;
const RUN_START_WINDOW = 10 * 60;

export type RunPhase = 'starter' | 'decision' | 'special' | 'map' | 'node' | 'ended';

/** Insígnias do modo Completo (decisão do usuário: sempre 8). */
export const ALL_BADGES = 8;

/**
 * A expedição está disponível para o usuário: as abertas para todos; os rascunhos só
 * para administradores, que os testam. Encerradas e variações escondidas do código,
 * para ninguém.
 */
export function variantAvailable(variant: ExpeditionVariant, user: User) {
	if (variant.hidden || !variant.status || variant.status === 'closed') return false;
	return variant.status === 'open' || isAdmin(user);
}

export function runPhase(run: ExpeditionRun): RunPhase {
	if (run.status !== 'active') return 'ended';
	if (run.pending?.kind === 'starter') return 'starter';
	if (run.decisions.length) return 'decision';
	if (run.pending?.kind === 'special') return 'special';
	return run.node && !run.nodeDone ? 'node' : 'map';
}

/** Mapa do ato atual da run. */
export function currentMap(run: ExpeditionRun): ActMap {
	return generateAct(run.seed, run.act, run.settings.map);
}

/** Nós do ato atual já percorridos. */
export function visitedNodes(run: ExpeditionRun): string[] {
	const prefix = `${run.act}:`;
	return run.path.filter(step => step.startsWith(prefix)).map(step => step.slice(prefix.length));
}

/** Escolhas do começo da run no modo Completo. */
export interface StartOptions {
	/** Nível de dificuldade (padrão: o máximo, o número de insígnias). */
	level?: number;
	/** Iniciais shiny, se liberados (padrão: sim). */
	shiny?: boolean;
}

/**
 * Modo Completo (etapa 9, decisões do usuário): o nível escolhido (até o número de
 * insígnias), a insígnia em disputa (sorteada entre as que faltam, só no nível máximo) e
 * se o jogador começou com as 8 (o que abre o ato especial).
 */
function completeSettings(variant: ExpeditionVariant, userid: string, seed: string, options: StartOptions) {
	const config = variant.completeConfig;
	if (!config) return undefined;
	const earned = getStore().getBadges(userid, variant.id);
	const max = Math.min(ALL_BADGES, earned.length);
	const level = Number.isInteger(options.level) ? Math.max(0, Math.min(max, options.level!)) : max;
	const allBadges = earned.length >= ALL_BADGES;
	const missing = config.badges.filter(badge => !earned.includes(badge.id));
	const prng = seededRandom(seed, 'badge');
	const badge = !allBadges && level === max && missing.length ? missing[prng.random(missing.length)] : null;
	return { ...config, level, badge, allBadges };
}

export function startRun(user: User, variantId: string, startOptions: StartOptions = {}): ExpeditionRun | RunProblem {
	const variant = getVariant(variantId);
	if (!variant) return 'novariant';
	if (!variantAvailable(variant, user)) return 'disabled';
	const store = getStore();
	if (store.getActiveRun(user.id, variant.id)) return 'active';
	// Evita runs sem fim (desistir e recomeçar em loop), como no Desafio
	const since = Math.floor(Date.now() / 1000) - RUN_START_WINDOW;
	if (store.countRunsSince(user.id, since) >= RUN_START_LIMIT) return 'toomany';
	const settings = resolveSettings(variant);
	const seed = newSeed();
	const complete = completeSettings(variant, user.id, seed, startOptions);
	if (complete) {
		settings.complete = complete;
		// Agravante 3: menos PokéCenter no meio do ato
		if (hasPenalty(settings, FEWER_CENTERS) && settings.map.weights.rest) {
			settings.map.weights.rest = Math.max(1, Math.round(settings.map.weights.rest / 2));
		}
	}
	let options = variant.starterOptions(seededRandom(seed, 'starters'), settings, store.listUnlocks(user.id));
	// Iniciais shiny: liberados ao vencer o Campeão daquela expedição (decisão do usuário)
	if (startOptions.shiny !== false && store.hasUnlock(user.id, 'shiny', 'starters', variant.id)) {
		options = options.map(team => team.map(mon => ({ ...mon, shiny: true })));
	}
	// Sprite do jogador: um protagonista sorteado por time, ou o fixado pelo admin (protagonists.ts)
	const avatars = drawProtagonists(seededRandom(seed, 'avatars'), options.length, variant.starterSprites);
	return store.createRun({
		userid: user.id, variant: variant.id, seed, settings, pending: { kind: 'starter', options, avatars },
	});
}

export function chooseStarter(run: ExpeditionRun, index: number): RunProblem | null {
	if (runPhase(run) !== 'starter' || run.pending?.kind !== 'starter') return 'nostarter';
	const team = run.pending.options[index];
	if (!team) return 'badchoice';
	run.team = team.slice(0, run.settings.rules.teamSize).map(mon => withBall(mon, DEFAULT_BALL));
	run.avatar = run.pending.avatars?.[index] || '';
	run.pending = null;
	run.money = run.settings.extra.startMoney || 0;
	const capture = run.settings.rules.capture;
	const balls = capture === 'chance' || capture === 'ball' ? STARTING_BALLS[capture] : 0;
	for (let i = 0; i < balls; i++) run.items.push('pokeball');
	getStore().saveRun(run);
	return null;
}

export function enterNode(run: ExpeditionRun, nodeId: string): RunProblem | null {
	const phase = runPhase(run);
	if (phase === 'decision') return 'decisions';
	if (phase === 'node') return 'nodeopen';
	if (phase !== 'map') return 'norun';
	const map = currentMap(run);
	if (!reachableNodes(map, run.node).some(node => node.id === nodeId)) return 'unreachable';
	run.node = nodeId;
	run.nodeDone = false;
	run.lastBattle = null;
	run.nodeState = {};
	run.path.push(`${run.act}:${nodeId}`);
	const entered = findNode(map, nodeId);
	const type = entered && getNodeType(entered.type);
	if (entered && type?.onEnter) type.onEnter(run, entered);
	getStore().saveRun(run);
	return null;
}

/** Run vencida: golpes e evoluções pendentes não têm mais efeito; desbloqueios da variação. */
function winRun(run: ExpeditionRun) {
	run.status = 'won';
	run.endedAt = Math.floor(Date.now() / 1000);
	run.decisions = [];
	run.pending = null;
	for (const rule of getVariant(run.variant)?.unlocks || []) {
		if (rule.when === 'win') getStore().addUnlock(run.userid, rule.kind, rule.ref, run.variant);
	}
}

/**
 * Nó atual terminado: no chefe, passa para o próximo ato ou vence a run (a run é gravada
 * por quem chama). Modo Completo: o chefe do último ato dá a insígnia em disputa; quem
 * começou com as 8 escolhe entre encerrar como vencedor e seguir ao ato especial; vencer o
 * Campeão (ato especial) libera os iniciais shiny da expedição.
 */
export function completeNode(run: ExpeditionRun) {
	run.nodeDone = true;
	if (run.node !== currentMap(run).boss) return;
	const acts = run.settings.map.acts;
	const complete = run.settings.complete;
	if (run.act === acts && complete?.badge) getStore().addBadge(run.userid, run.variant, complete.badge.id);
	if (run.act < acts) {
		run.act++;
		run.node = null;
		run.nodeDone = false;
		healBetweenActs(run);
	} else if (run.act === acts && complete?.allBadges && run.settings.map.special) {
		run.pending = { kind: 'special' };
	} else {
		if (run.act > acts) getStore().addUnlock(run.userid, 'shiny', 'starters', run.variant);
		winRun(run);
	}
}

/**
 * Cura entre os atos (decisão do usuário): o time inteiro volta 100%, como no PokéCenter.
 * Com o agravante 4 do modo Completo, metade: cada Pokémon recupera 50% do HP e do PP,
 * o status é curado, e quem desmaiou volta com metade do HP.
 */
export function healBetweenActs(run: ExpeditionRun) {
	const half = hasPenalty(run.settings, LESS_ACT_HEAL);
	for (const mon of run.team) {
		if (!half) {
			healMon(mon);
			continue;
		}
		mon.hp = mon.fainted ? 0.5 : Math.min(1, mon.hp + 0.5);
		mon.fainted = false;
		mon.status = '';
		mon.ppUsed = mon.moves.map((move, i) => Math.max(0, (mon.ppUsed[i] || 0) - Math.ceil(maxPP(move) / 2)));
	}
}

/** Depois do último ato, com as 8 insígnias: `go` = seguir ao ato especial; senão, encerrar como vencedor. */
export function decideSpecial(run: ExpeditionRun, go: boolean): RunProblem | null {
	if (runPhase(run) !== 'special') return 'nodecision';
	if (go) {
		run.pending = null;
		run.act++;
		run.node = null;
		run.nodeDone = false;
		healBetweenActs(run);
	} else {
		winRun(run);
	}
	getStore().saveRun(run);
	return null;
}

/** O que o nó atual mostra (null fora de um nó). */
export function currentNodeView(
	run: ExpeditionRun, TL: Translator, lang: TextLanguage = 'en'
): { type: string, view: NodeView } | null {
	if (runPhase(run) !== 'node') return null;
	const node = findNode(currentMap(run), run.node!);
	const type = node && getNodeType(node.type);
	if (!node || !type) return null;
	// Nós de batalha, e eventos que levaram a uma batalha
	if (type.encounter || run.nodeState.battle) {
		const encounter = currentEncounter(run);
		if (!encounter) return null;
		const name = encounter.name;
		const count = encounter.team.length;
		const level = encounter.team[0]?.level || 1;
		let text: string;
		if (encounter.kind === 'wild' || encounter.kind === 'legendary') {
			text = TL`${name} (Lv. ${level}) appeared!`;
		} else if (encounter.kind === 'boss') {
			text = TL`The boss ${name} challenges you, with ${count} Pokémon around level ${level}.`;
		} else {
			text = TL`${name} wants to battle, with ${count} Pokémon around level ${level}.`;
		}
		const open = hasOpenBattle(run);
		const label = open ? TL`Continue the battle` : TL`Battle!`;
		const view = type.view && !type.encounter ? type.view({ run, node, TL, lang }) : null;
		return { type: type.id, view: { title: view?.title, text, choices: [{ id: 'battle', label }] } };
	}
	if (!type.view) return null;
	return { type: type.id, view: type.view({ run, node, TL, lang }) };
}

export function chooseInNode(run: ExpeditionRun, choice: string, TL: Translator, user: User): RunProblem | null {
	if (runPhase(run) !== 'node') return 'nonode';
	const map = currentMap(run);
	const node = findNode(map, run.node!);
	const type = node && getNodeType(node.type);
	if (!node || !type) return 'nonode';
	if (type.encounter || run.nodeState.battle) {
		if (choice !== 'battle') return 'badchoice';
		return startOrResumeBattle(user, run) ? null : 'nobattle';
	}
	const done = type.choose?.({ run, node, TL, lang: 'en' }, choice) ?? null;
	if (done === null) return 'badchoice';
	if (typeof done === 'string') return done as RunProblem;
	if (done) completeNode(run);
	getStore().saveRun(run);
	return null;
}

/** Pokémon da run pelo uid: no time ou no Computador (que também ganha experiência e decide golpes e evoluções). */
export function findRunMon(run: ExpeditionRun, uid: string) {
	return run.team.find(entry => entry.uid === uid) || run.box.find(entry => entry.uid === uid);
}

/** Golpe novo com quatro já conhecidos: `slot` (0 a 3) é o esquecido; null = não aprende. */
export function decideLearn(run: ExpeditionRun, slot: number | null): RunProblem | null {
	const decision = run.decisions[0];
	if (runPhase(run) !== 'decision' || decision?.kind !== 'learn') return 'nodecision';
	const mon = findRunMon(run, decision.uid);
	if (slot !== null) {
		if (!mon || !Number.isInteger(slot) || !(slot >= 0 && slot < mon.moves.length)) return 'badchoice';
		mon.moves[slot] = decision.move;
		mon.ppUsed[slot] = 0;
	}
	run.decisions.shift();
	getStore().saveRun(run);
	return null;
}

/** Evolução por nível: `into` é a espécie escolhida; null = agora não. */
export function decideEvolve(run: ExpeditionRun, into: string | null): RunProblem | null {
	const decision = run.decisions[0];
	if (runPhase(run) !== 'decision' || decision?.kind !== 'evolve') return 'nodecision';
	const uid = decision.uid;
	// Várias evoluções possíveis do mesmo Pokémon ficam juntas: a escolha resolve todas
	const options = run.decisions.filter(entry => entry.kind === 'evolve' && entry.uid === uid);
	if (into !== null) {
		const option = options.find(entry => entry.kind === 'evolve' && toID(entry.into) === toID(into));
		const mon = findRunMon(run, uid);
		if (!option || option.kind !== 'evolve' || !mon) return 'badchoice';
		evolveMon(mon, option.into);
	}
	run.decisions = run.decisions.filter(entry => !(entry.kind === 'evolve' && entry.uid === uid));
	getStore().saveRun(run);
	return null;
}

/**
 * Captura do selvagem vencido: "keep" (com vaga no time), o uid de quem sai do time
 * para dar a vaga (o item de quem sai vai para a mochila) ou null (não fica com ele).
 */
/**
 * Captura do selvagem vencido. `choice`:
 *   - null: deixa ir (com a bola já gasta, se houve lançamento);
 *   - "ball:<id>" (captura por bola): lança uma bola da mochila. Na "ball", captura
 *     certa; na "chance", pela chance da espécie e da bola (capture.ts), e o jogador pode
 *     tentar de novo. Capturado e com espaço no time, entra direto;
 *   - "keep": entra no time (com espaço);
 *   - "pc": vai para o Computador (com o Computador ligado);
 *   - uid de um Pokémon do time (time cheio): ele sai para o capturado entrar (com o
 *     Computador, vai para lá; sem ele, é solto). O item vai sempre para a mochila
 *     (decisão do usuário: nenhum item fica no Computador).
 */
export function decideCapture(run: ExpeditionRun, choice: string | null): RunProblem | null {
	const decision = run.decisions[0];
	if (runPhase(run) !== 'decision' || decision?.kind !== 'capture') return 'nodecision';
	const rules = run.settings.rules;
	const store = getStore();
	if (choice === null) {
		run.decisions.shift();
		store.saveRun(run);
		return null;
	}
	if (choice.startsWith('ball:')) {
		if (!usesBalls(run) || decision.caught || decision.gift) return 'badchoice';
		const ball = getBall(choice.slice(5));
		const index = ball ? run.items.findIndex(item => toID(item) === ball.id) : -1;
		if (!ball || index < 0) return 'noitem';
		run.items.splice(index, 1);
		const tries = (decision.tries || 0) + 1;
		decision.tries = tries;
		const prng = seededRandom(run.seed, `capture:${run.act}:${run.node}:${tries}`);
		if (rules.capture === 'ball' || rollCapture(prng, decision.mon.species, ball.id)) {
			decision.caught = true;
			decision.mon = withBall(decision.mon, ball.name);
			delete decision.escaped;
			if (run.team.length < rules.teamSize) {
				run.team.push(decision.mon);
				run.decisions.shift();
			}
		} else {
			decision.escaped = ball.name;
		}
		store.saveRun(run);
		return null;
	}
	if (usesBalls(run) && !decision.caught && !decision.gift) return 'badchoice';
	const mon = decision.mon.ball ? decision.mon : withBall(decision.mon, DEFAULT_BALL);
	const full = run.team.length >= rules.teamSize;
	if (choice === 'keep') {
		if (full) return 'teamfull';
		run.team.push(mon);
	} else if (choice === 'pc') {
		if (!rules.computer) return 'badchoice';
		if (run.box.length >= BOX_SIZE) return 'boxfull';
		run.box.push(mon);
	} else {
		const index = run.team.findIndex(entry => entry.uid === choice);
		if (index < 0 || !full) return 'badchoice';
		if (rules.computer && run.box.length >= BOX_SIZE) return 'boxfull';
		const [out] = run.team.splice(index, 1);
		if (out.item) run.items.push(out.item);
		if (rules.computer) run.box.push({ ...out, item: '' });
		run.team.push(mon);
	}
	run.decisions.shift();
	store.saveRun(run);
	return null;
}

/**
 * Troca o item que um Pokémon segura (decisão do usuário: os itens vão e voltam da
 * mochila, e o jogador alterna como quiser). `item` vazio só guarda o atual na mochila.
 * Fora de batalha: com uma batalha aberta, o time já foi enviado.
 */
export function setHeldItem(run: ExpeditionRun, uid: string, item: string): RunProblem | null {
	const phase = runPhase(run);
	if (phase === 'starter' || phase === 'ended') return 'norun';
	if (hasOpenBattle(run)) return 'inbattle';
	const mon = run.team.find(entry => entry.uid === uid);
	if (!mon) return 'badchoice';
	const id = toID(item);
	if (id === toID(mon.item)) return null;
	// Só itens de segurar (os de uso e as TMs são usados pela mochila)
	const index = id ? run.items.findIndex(entry => toID(entry) === id && isHeldItem(entry)) : -1;
	if (id && index < 0) return 'noitem';
	if (index >= 0) run.items.splice(index, 1);
	if (mon.item) run.items.push(mon.item);
	mon.item = id ? Dex.items.get(id).name : '';
	getStore().saveRun(run);
	return null;
}

/**
 * Usa um item da mochila num Pokémon (decisão do usuário: só fora da batalha). Rare
 * Candy e TM com quatro golpes já conhecidos põem decisões na fila.
 */
export function useBagItem(run: ExpeditionRun, item: string, uid: string): RunProblem | null {
	const phase = runPhase(run);
	if (phase !== 'map' && phase !== 'node') return phase === 'decision' ? 'decisions' : 'norun';
	if (hasOpenBattle(run)) return 'inbattle';
	const mon = run.team.find(entry => entry.uid === uid);
	if (!mon) return 'badchoice';
	const result = useItem(run, item, mon);
	if (typeof result === 'string') return result;
	run.decisions.push(...result);
	getStore().saveRun(run);
	return null;
}

/**
 * Encerramento pelo admin (decisão do usuário, como no Desafio): a run fica no
 * histórico como "encerrada", e a batalha aberta, se houver, termina com forfeit.
 */
export function closeRunByAdmin(runId: number): ExpeditionRun | null {
	const run = getStore().getRun(runId);
	if (!run || run.status !== 'active') return null;
	run.status = 'closed';
	run.endedAt = Math.floor(Date.now() / 1000);
	getStore().saveRun(run);
	forfeitOpenBattle(toID(run.userid), run, ' - the expedition was closed by an administrator.');
	refreshRunPage(run.userid, run.variant);
	return run;
}

export function abandonRun(user: User, run: ExpeditionRun) {
	if (run.status !== 'active') return;
	run.status = 'abandoned';
	run.endedAt = Math.floor(Date.now() / 1000);
	getStore().saveRun(run);
	forfeitOpenBattle(user, run);
}

/** Redesenha a página da run para o jogador, se ele estiver com ela aberta. */
export function refreshRunPage(userid: string, variantId: string) {
	const user = Users.getExact(userid);
	if (!user) return;
	const page = `expedicao-run-${variantId}`;
	for (const connection of user.connections) {
		if (connection.openPages?.has(page)) void Chat.parse(`/join view-${page}`, null, user, connection);
	}
}

battleCallbacks.completeNode = completeNode;
battleCallbacks.refresh = refreshRunPage;
