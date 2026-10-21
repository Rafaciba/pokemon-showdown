/**
 * pokemon-showdown-custom: regras da run da Expedição.
 *
 * Fases da run:
 *   1. escolha do time inicial (`pending.kind = 'starter'`);
 *   2. mapa: o jogador escolhe o próximo nó, entre os do primeiro andar no começo do
 *      ato ou os ligados ao nó atual;
 *   3. nó: o tipo do nó mostra as escolhas, e uma delas termina o nó;
 *   4. terminar o nó do chefe passa para o próximo ato ou, no último, vence a run.
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
import type { ExpeditionRun } from './store';
import type { Translator } from '../../../sim/dex-text';

export type RunProblem =
	'novariant' | 'disabled' | 'active' | 'norun' | 'nostarter' | 'badchoice' | 'unreachable' | 'nodeopen' | 'nonode';

export type RunPhase = 'starter' | 'map' | 'node' | 'ended';

/** A variação está disponível para o usuário (administradores veem as de teste e as desligadas). */
export function variantAvailable(variant: ExpeditionVariant, user: User) {
	if (isAdmin(user)) return true;
	return !variant.adminOnly && getStore().getVariantSettings(variant.id).enabled;
}

export function runPhase(run: ExpeditionRun): RunPhase {
	if (run.status !== 'active') return 'ended';
	if (run.pending?.kind === 'starter') return 'starter';
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
	getStore().saveRun(run);
	return null;
}

export function enterNode(run: ExpeditionRun, nodeId: string): RunProblem | null {
	const phase = runPhase(run);
	if (phase === 'node') return 'nodeopen';
	if (phase !== 'map') return 'norun';
	const map = currentMap(run);
	if (!reachableNodes(map, run.node).some(node => node.id === nodeId)) return 'unreachable';
	run.node = nodeId;
	run.nodeDone = false;
	run.path.push(`${run.act}:${nodeId}`);
	getStore().saveRun(run);
	return null;
}

/** O que o nó atual mostra (null fora de um nó). */
export function currentNodeView(run: ExpeditionRun, TL: Translator): { type: string, view: NodeView } | null {
	if (runPhase(run) !== 'node') return null;
	const node = findNode(currentMap(run), run.node!);
	const type = node && getNodeType(node.type);
	if (!node || !type) return null;
	return { type: type.id, view: type.view({ run, node, TL }) };
}

export function chooseInNode(run: ExpeditionRun, choice: string, TL: Translator): RunProblem | null {
	if (runPhase(run) !== 'node') return 'nonode';
	const map = currentMap(run);
	const node = findNode(map, run.node!);
	const type = node && getNodeType(node.type);
	if (!node || !type) return 'nonode';
	const done = type.choose({ run, node, TL }, choice);
	if (done === null) return 'badchoice';
	if (done) {
		run.nodeDone = true;
		if (node.id === map.boss) {
			// Fim do ato: o próximo começa do primeiro andar; no último, a run está vencida
			if (run.act < run.settings.map.acts) {
				run.act++;
				run.node = null;
				run.nodeDone = false;
			} else {
				run.status = 'won';
				run.endedAt = Math.floor(Date.now() / 1000);
			}
		}
	}
	getStore().saveRun(run);
	return null;
}

export function abandonRun(run: ExpeditionRun) {
	if (run.status !== 'active') return;
	run.status = 'abandoned';
	run.endedAt = Math.floor(Date.now() / 1000);
	getStore().saveRun(run);
}
