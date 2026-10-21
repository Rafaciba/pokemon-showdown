/**
 * pokemon-showdown-custom: tipos de nó do mapa da Expedição.
 *
 * Um tipo de nó diz o que o jogador vê ao entrar, as escolhas oferecidas e o que cada
 * escolha faz com a run. Os tipos ficam numa lista, e cada variação escolhe quais usa
 * (pelos pesos do mapa); variações podem registrar os seus.
 *
 * Os genéricos da base são batalha selvagem, treinador, chefe, lendário (raro),
 * descanso e item. Os de batalha (`encounter`) mostram o adversário e começam a batalha
 * (encounters.ts, battles.ts). O de item oferece 3 itens de segurar sorteados, e o
 * escolhido vai para a mochila (items.ts).
 *
 * @license MIT
 */
import type { Translator } from '../../../sim/dex-text';
import type { MapNode } from './map';
import type { ExpeditionRun } from './store';
import { healMon } from './team';
import { MEGA_STONE_CHANCE, pickItems, pickMegaStone } from './items';
import { seededRandom } from './random';

export interface NodeChoice {
	id: string;
	label: string;
	/** Item mostrado no botão (ícone). */
	item?: string;
}

export interface NodeView {
	/** Texto do nó (sem HTML). */
	text: string;
	choices: NodeChoice[];
}

export interface NodeContext {
	run: ExpeditionRun;
	node: MapNode;
	TL: Translator;
}

export interface NodeType {
	id: string;
	/** Símbolo do nó no mapa. */
	icon: string;
	label(TL: Translator): string;
	/** Nó de batalha: a run mostra o encontro e a escolha começa a batalha (o nó termina com a vitória). */
	encounter?: boolean;
	view?(context: NodeContext): NodeView;
	/**
	 * Aplica a escolha à run (que é gravada depois). Devolve true se o nó terminou,
	 * false se continua aberto, ou null se a escolha não existe.
	 */
	choose?(context: NodeContext, choice: string): boolean | null;
}

const registry = new Map<string, NodeType>();

export function registerNodeType(type: NodeType) {
	registry.set(type.id, type);
}

export function getNodeType(id: string): NodeType | null {
	return registry.get(id) || null;
}

/** Nó ainda sem efeito (a loja e os eventos chegam nas próximas partes da etapa 3): só segue em frente. */
function placeholder(id: string, icon: string, label: (TL: Translator) => string): NodeType {
	return {
		id, icon, label,
		view: ({ TL }) => ({
			text: TL`This kind of node is not playable yet: it arrives in a later development stage.`,
			choices: [{ id: 'continue', label: TL`Continue` }],
		}),
		choose: (context, choice) => (choice === 'continue' ? true : null),
	};
}

registerNodeType({ id: 'wild', icon: '\u{1F33F}', label: TL => TL`Wild Pokémon`, encounter: true });
registerNodeType({ id: 'trainer', icon: '\u{1F9E2}', label: TL => TL`Trainer`, encounter: true });
registerNodeType({ id: 'boss', icon: '\u{1F451}', label: TL => TL`Boss`, encounter: true });
registerNodeType({ id: 'legendary', icon: '\u{2728}', label: TL => TL`Legendary Pokémon`, encounter: true });
/**
 * Itens do nó de item: 3 sorteados pela semente da run e pelo nó (os mesmos ao voltar à
 * página); às vezes, o último é uma Mega Stone (item raro, items.ts).
 */
function nodeItems({ run, node }: NodeContext) {
	const prng = seededRandom(run.seed, `item:${run.act}:${node.id}`);
	const items = pickItems(prng, 3);
	if (prng.random(100) < MEGA_STONE_CHANCE) {
		const stone = pickMegaStone(prng, run.team);
		if (stone) items[items.length - 1] = stone;
	}
	return items;
}

registerNodeType({
	id: 'item',
	icon: '\u{1F381}',
	label: TL => TL`Item`,
	view: context => ({
		text: context.TL`Choose one item. It goes to your bag, and you can give it to any Pokémon in your team.`,
		choices: nodeItems(context).map(item => ({ id: `pick:${toID(item)}`, label: item, item })),
	}),
	choose(context, choice) {
		const item = nodeItems(context).find(name => `pick:${toID(name)}` === choice);
		if (!item) return null;
		context.run.items.push(item);
		return true;
	},
});

registerNodeType(placeholder('shop', '\u{1F6D2}', TL => TL`Shop`));
registerNodeType(placeholder('event', '\u{2753}', TL => TL`Event`));

registerNodeType({
	id: 'rest',
	icon: '\u{1F525}',
	label: TL => TL`Rest`,
	view: ({ TL }) => ({
		text: TL`A safe place to rest: your whole team recovers HP and PP, and fainted Pokémon come back.`,
		choices: [{ id: 'rest', label: TL`Rest` }],
	}),
	choose({ run }, choice) {
		if (choice !== 'rest') return null;
		for (const mon of run.team) healMon(mon);
		return true;
	},
});
