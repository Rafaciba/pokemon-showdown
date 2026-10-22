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

export type RunProblem =
	'novariant' | 'disabled' | 'active' | 'norun' | 'nostarter' | 'badchoice' | 'unreachable' | 'nodeopen' | 'nonode' |
	'decisions' | 'nodecision' | 'nobattle' | 'teamfull' | 'inbattle' | 'noitem' | EconomyProblem;

export type RunPhase = 'starter' | 'decision' | 'map' | 'node' | 'ended';

/** A variação está disponível para o usuário (administradores veem as de teste e as desligadas). */
export function variantAvailable(variant: ExpeditionVariant, user: User) {
	if (isAdmin(user)) return true;
	return !variant.adminOnly && getStore().getVariantSettings(variant.id).enabled;
}

export function runPhase(run: ExpeditionRun): RunPhase {
	if (run.status !== 'active') return 'ended';
	if (run.pending?.kind === 'starter') return 'starter';
	if (run.decisions.length) return 'decision';
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

export function startRun(user: User, variantId: string): ExpeditionRun | RunProblem {
	const variant = getVariant(variantId);
	if (!variant) return 'novariant';
	if (!variantAvailable(variant, user)) return 'disabled';
	const store = getStore();
	if (store.getActiveRun(user.id, variant.id)) return 'active';
	const settings = resolveSettings(variant, store.getVariantSettings(variant.id).overrides);
	const seed = newSeed();
	const options = variant.starterOptions(seededRandom(seed, 'starters'), settings);
	return store.createRun({ userid: user.id, variant: variant.id, seed, settings, pending: { kind: 'starter', options } });
}

export function chooseStarter(run: ExpeditionRun, index: number): RunProblem | null {
	if (runPhase(run) !== 'starter' || run.pending?.kind !== 'starter') return 'nostarter';
	const team = run.pending.options[index];
	if (!team) return 'badchoice';
	run.team = team.slice(0, run.settings.rules.teamSize);
	run.pending = null;
	run.money = run.settings.extra.startMoney || 0;
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

/** Nó atual terminado: no chefe, passa para o próximo ato ou vence a run (a run é gravada por quem chama). */
export function completeNode(run: ExpeditionRun) {
	run.nodeDone = true;
	if (run.node !== currentMap(run).boss) return;
	if (run.act < run.settings.map.acts) {
		run.act++;
		run.node = null;
		run.nodeDone = false;
	} else {
		// Run vencida: golpes e evoluções pendentes não têm mais efeito
		run.status = 'won';
		run.endedAt = Math.floor(Date.now() / 1000);
		run.decisions = [];
	}
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

/** Golpe novo com quatro já conhecidos: `slot` (0 a 3) é o esquecido; null = não aprende. */
export function decideLearn(run: ExpeditionRun, slot: number | null): RunProblem | null {
	const decision = run.decisions[0];
	if (runPhase(run) !== 'decision' || decision?.kind !== 'learn') return 'nodecision';
	const mon = run.team.find(entry => entry.uid === decision.uid);
	if (slot !== null) {
		if (!mon || !(slot >= 0 && slot < mon.moves.length)) return 'badchoice';
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
		const mon = run.team.find(entry => entry.uid === uid);
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
export function decideCapture(run: ExpeditionRun, choice: string | null): RunProblem | null {
	const decision = run.decisions[0];
	if (runPhase(run) !== 'decision' || decision?.kind !== 'capture') return 'nodecision';
	if (choice !== null) {
		const full = run.team.length >= run.settings.rules.teamSize;
		if (choice === 'keep') {
			if (full) return 'teamfull';
		} else {
			const index = run.team.findIndex(mon => mon.uid === choice);
			if (index < 0 || !full) return 'badchoice';
			const [released] = run.team.splice(index, 1);
			if (released.item) run.items.push(released.item);
		}
		run.team.push(decision.mon);
	}
	run.decisions.shift();
	getStore().saveRun(run);
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
