/**
 * pokemon-showdown-custom: gerador do mapa da Expedição, no estilo Slay the Spire.
 *
 * O ato é uma grade de andares e colunas. Alguns caminhos partem do primeiro andar;
 * a cada andar, cada um sobe para a mesma coluna ou uma vizinha, sem cruzar outro
 * caminho, e todos terminam no chefe. Os nós do mapa são a união desses caminhos, e o
 * tipo de cada nó é sorteado com as chances da variação (com andares de tipo fixo, o
 * primeiro andar de cada tipo, andares proibidos para um tipo, tipos que não se repetem
 * em seguida, tipos que só aparecem tarde na run, um máximo de nós de um tipo por ato
 * e, como no Slay the Spire, tipos diferentes nos nós que saem do mesmo ponto). Depois,
 * os nós raros: com a chance da variação, um nó elegível do ato vira de um tipo raro.
 *
 * A mesma semente gera sempre o mesmo mapa.
 *
 * @license MIT
 */
import { seededRandom, weightedPick } from './random';
import type { MapSettings } from './variant';

export interface MapNode {
	/** "<andar>-<coluna>" ou "boss". */
	id: string;
	floor: number;
	col: number;
	type: string;
	/** Nós do andar de cima ligados a este. */
	next: string[];
}

export interface ActMap {
	act: number;
	floors: number;
	columns: number;
	nodes: MapNode[];
	/** Id do nó do chefe (andar `floors`). */
	boss: string;
}

export const BOSS_NODE = 'boss';

function nodeId(floor: number, col: number) {
	return `${floor}-${col}`;
}

/** Tipo fixo de um andar (negativos contam do topo), ou undefined. */
function fixedType(map: MapSettings, floor: number) {
	return map.fixedFloors[floor] ?? map.fixedFloors[floor - map.floors];
}

/** O tipo não pode aparecer no andar (negativos contam do topo). */
function forbiddenOn(map: MapSettings, type: string, floor: number) {
	return (map.forbiddenFloors?.[type] || []).some(entry => entry === floor || entry === floor - map.floors);
}

export function generateAct(seed: string, act: number, map: MapSettings): ActMap {
	const prng = seededRandom(seed, `act${act}`);
	const floors = Math.max(1, map.floors);
	const columns = Math.max(1, map.columns);
	// Arestas por andar: "c1>c2" (do andar f para o f + 1)
	const edges: Set<string>[] = Array.from({ length: floors }, () => new Set());
	const cells = new Set<string>();

	const starts: number[] = [];
	for (let path = 0; path < Math.max(1, map.paths); path++) {
		// Os dois primeiros caminhos começam em colunas diferentes (como no Slay the Spire)
		const avoid = path === 1 && columns > 1 ? starts[0] : -1;
		let col = prng.random(avoid < 0 ? columns : columns - 1);
		if (avoid >= 0 && col >= avoid) col++;
		starts.push(col);
		cells.add(nodeId(0, col));
		for (let floor = 0; floor < floors - 1; floor++) {
			const options = [col - 1, col, col + 1].filter(next => {
				if (next < 0 || next >= columns) return false;
				// Não cruza: subir para a direita com alguém subindo da direita para cá (e vice-versa)
				if (next !== col && edges[floor].has(`${next}>${col}`)) return false;
				return true;
			});
			const next = options[prng.random(options.length)];
			edges[floor].add(`${col}>${next}`);
			col = next;
			cells.add(nodeId(floor + 1, col));
		}
	}

	const nodes = new Map<string, MapNode>();
	for (let floor = 0; floor < floors; floor++) {
		for (let col = 0; col < columns; col++) {
			const id = nodeId(floor, col);
			if (cells.has(id)) nodes.set(id, { id, floor, col, type: '', next: [] });
		}
	}
	for (let floor = 0; floor < floors - 1; floor++) {
		for (const edge of [...edges[floor]].sort()) {
			const [from, to] = edge.split('>').map(Number);
			nodes.get(nodeId(floor, from))!.next.push(nodeId(floor + 1, to));
		}
	}
	const boss: MapNode = {
		id: BOSS_NODE, floor: floors, col: Math.floor((columns - 1) / 2), type: map.bossType, next: [],
	};
	for (const node of nodes.values()) {
		node.next.sort();
		if (node.floor === floors - 1) node.next.push(BOSS_NODE);
	}

	// Tipos, de baixo para cima (os de baixo já estão decididos quando chega a vez de um nó)
	const parents = new Map<string, MapNode[]>();
	for (const node of nodes.values()) {
		for (const next of node.next) parents.set(next, [...parents.get(next) || [], node]);
	}
	const ordered = [...nodes.values()].sort((a, b) => a.floor - b.floor || a.col - b.col);
	const counts: Record<string, number> = {};
	// Tipos tardios: a partir do segundo ato; com um ato só, na metade final dele
	const lateAllowed = (floor: number) => act >= 2 || (map.acts <= 1 && floor >= floors / 2);
	for (const node of ordered) {
		const fixed = fixedType(map, node.floor);
		if (fixed) {
			node.type = fixed;
			continue;
		}
		const weights: Record<string, number> = {};
		for (const [type, weight] of Object.entries(map.weights)) {
			if (node.floor < (map.minFloor[type] ?? 0)) continue;
			if (forbiddenOn(map, type, node.floor)) continue;
			if (map.lateTypes?.includes(type) && !lateAllowed(node.floor)) continue;
			if ((counts[type] || 0) >= (map.maxPerAct?.[type] ?? Infinity)) continue;
			if (map.noRepeat.includes(type)) {
				if ((parents.get(node.id) || []).some(parent => parent.type === type)) continue;
				if (fixedType(map, node.floor + 1) === type) continue;
			}
			weights[type] = weight;
		}
		// Bifurcação: os irmãos já decididos (outros nós que saem dos mesmos pais) ficam de fora, se sobrar opção
		if (map.distinctSiblings) {
			const siblings = new Set((parents.get(node.id) || []).flatMap(parent => parent.next)
				.map(id => nodes.get(id)?.type).filter(Boolean));
			const distinct = Object.fromEntries(Object.entries(weights).filter(([type]) => !siblings.has(type)));
			if (Object.values(distinct).some(weight => weight > 0)) {
				for (const type of Object.keys(weights)) if (!(type in distinct)) delete weights[type];
			}
		}
		node.type = weightedPick(prng, weights) || Object.keys(map.weights)[0] || map.bossType;
		counts[node.type] = (counts[node.type] || 0) + 1;
	}
	// Nós raros: o sorteio sempre consome o gerador, para o resto do mapa não depender dele
	for (const [type, chance] of Object.entries(map.rareNodes || {}).sort()) {
		const roll = prng.random(100);
		const candidates = ordered.filter(node => (
			!fixedType(map, node.floor) && node.floor >= (map.minFloor[type] ?? 0) && !forbiddenOn(map, type, node.floor) &&
			(!map.lateTypes?.includes(type) || lateAllowed(node.floor)) &&
			// Sem outro nó raro (ou do mesmo tipo) logo antes ou logo depois
			![...parents.get(node.id) || [], ...node.next.map(id => nodes.get(id)).filter(Boolean) as MapNode[]]
				.some(other => other.type === type)
		));
		const pick = candidates.length ? candidates[prng.random(candidates.length)] : null;
		if (pick && roll < chance) pick.type = type;
	}
	return { act, floors, columns, nodes: [...ordered, boss], boss: BOSS_NODE };
}

export function findNode(map: ActMap, id: string) {
	return map.nodes.find(node => node.id === id) || null;
}

/** Nós que o jogador pode escolher: os do primeiro andar no início do ato, depois os ligados ao atual. */
export function reachableNodes(map: ActMap, current: string | null): MapNode[] {
	if (current === null) return map.nodes.filter(node => node.floor === 0);
	const node = findNode(map, current);
	return node ? node.next.map(id => findNode(map, id)!).filter(Boolean) : [];
}
