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
import type { TextLanguage } from '../../../sim/dex-data';
import type { MapNode } from './map';
import type { ExpeditionRun } from './store';
import { healMon } from './team';
import { MEGA_STONE_CHANCE, pickItems, pickMegaStone } from './items';
import { buyItem, consumable, consumableDescription, itemDisplay, shopStock, tmMove } from './economy';
import { moveDescription } from './tooltips';
import { getEvent, pickEvent } from './events';
import { seededRandom } from './random';

export interface NodeChoice {
	id: string;
	label: string;
	/** Item mostrado no botão (ícone). */
	item?: string;
	/** Golpe da escolha (tooltip com os detalhes). */
	move?: string;
	/** Loja: preço, grupo, descrição e se a compra está indisponível (sem dinheiro ou esgotado). */
	price?: number;
	group?: string;
	detail?: string;
	disabled?: boolean;
}

export interface NodeView {
	/** Título no lugar do nome do tipo de nó (ex.: o nome do evento). */
	title?: string;
	/** Texto do nó (sem HTML). */
	text: string;
	choices: NodeChoice[];
}

export interface NodeContext {
	run: ExpeditionRun;
	node: MapNode;
	TL: Translator;
	/** Idioma dos textos do jogo (descrições de itens e golpes). */
	lang: TextLanguage;
}

export interface NodeType {
	id: string;
	/** Símbolo do nó no mapa. */
	icon: string;
	label(TL: Translator): string;
	/** Nó de batalha: a run mostra o encontro e a escolha começa a batalha (o nó termina com a vitória). */
	encounter?: boolean;
	view?(context: NodeContext): NodeView;
	/** Ao entrar no nó (ex.: o evento "?" sorteia o evento e guarda em run.nodeState). */
	onEnter?(run: ExpeditionRun, node: MapNode): void;
	/**
	 * Aplica a escolha à run (que é gravada depois). Devolve true se o nó terminou,
	 * false se continua aberto, null se a escolha não existe, ou o código de um problema
	 * (ex.: "nomoney" na loja), que a página mostra.
	 */
	choose?(context: NodeContext, choice: string): boolean | null | string;
}

const registry = new Map<string, NodeType>();

export function registerNodeType(type: NodeType) {
	registry.set(type.id, type);
}

export function getNodeType(id: string): NodeType | null {
	return registry.get(id) || null;
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

/** Descrição de um item da loja: item de uso (nosso texto), TM (o golpe) ou item de segurar (texto do PS). */
function shopDetail(context: NodeContext, entry: string) {
	const usable = consumable(toID(entry));
	if (usable) return consumableDescription(context.TL, usable);
	const move = tmMove(entry);
	if (move) return moveDescription(move, context.lang);
	return Dex.text.get(Dex.items.get(entry), context.lang).shortDesc || '';
}

registerNodeType({
	id: 'shop',
	icon: '\u{1F6D2}',
	// Nome pedido pelo usuário (antes "Loja"); o id continua "shop"
	label: TL => TL`PokéMart`,
	view(context) {
		const { run, node, TL } = context;
		const bought: string[] = run.nodeState.bought || [];
		const choices = shopStock(run, node.id).map(entry => {
			const soldOut = entry.single && bought.includes(entry.item);
			return {
				id: `buy:${toID(entry.item)}`, label: itemDisplay(entry.item).name, item: entry.item, price: entry.price,
				group: entry.group, detail: shopDetail(context, entry.item), disabled: soldOut || run.money < entry.price,
			};
		});
		return {
			text: TL`Buy what you need: the items go to your bag.`,
			choices: [...choices, { id: 'leave', label: TL`Leave the PokéMart` }],
		};
	},
	choose(context, choice) {
		if (choice === 'leave') return true;
		if (!choice.startsWith('buy:')) return null;
		// A compra não termina o nó: o jogador continua na loja
		return buyItem(context.run, context.node.id, choice.slice(4)) || false;
	},
});
/** Evento "?" (events.ts): sorteado ao entrar; as escolhas levam a um resultado ou a uma batalha. */
registerNodeType({
	id: 'event',
	icon: '\u{2753}',
	label: TL => TL`Event`,
	onEnter(run, node) {
		run.nodeState = pickEvent(run, node) || {};
	},
	view(context) {
		const { run, TL } = context;
		const event = getEvent(run.nodeState.event);
		if (!event) {
			return { text: TL`Nothing happens here.`, choices: [{ id: 'continue', label: TL`Continue` }] };
		}
		const eventContext = { ...context, data: run.nodeState.data };
		if (run.nodeState.outcome) {
			return {
				title: event.title(TL), text: event.result(eventContext, run.nodeState.outcome),
				choices: [{ id: 'continue', label: TL`Continue` }],
			};
		}
		return { title: event.title(TL), text: event.text(eventContext), choices: event.choices(eventContext) };
	},
	choose(context, choice) {
		const { run } = context;
		const event = getEvent(run.nodeState.event);
		if (!event || run.nodeState.outcome) return choice === 'continue' ? true : null;
		const offered = event.choices({ ...context, data: run.nodeState.data }).find(entry => entry.id === choice);
		if (!offered || offered.disabled) return null;
		const outcome = event.choose({ ...context, data: run.nodeState.data }, choice);
		if (outcome === null || typeof outcome === 'string') return outcome;
		if ('battle' in outcome) {
			// A batalha fica no estado do nó; a vitória termina o nó (battles.ts)
			run.nodeState = { ...run.nodeState, battle: outcome.battle, reward: outcome.reward || null };
		} else {
			run.nodeState = { ...run.nodeState, outcome: choice };
		}
		return false;
	},
});

registerNodeType({
	id: 'rest',
	icon: '\u{1F3E5}',
	// Nome pedido pelo usuário (antes "Descanso"); o id continua "rest"
	label: TL => TL`PokéCenter`,
	view: ({ TL }) => ({
		text: TL`At the PokéCenter, your whole team recovers HP, PP and status, and fainted Pokémon come back.`,
		choices: [{ id: 'rest', label: TL`Heal your team` }],
	}),
	choose({ run }, choice) {
		if (choice !== 'rest') return null;
		for (const mon of run.team) healMon(mon);
		return true;
	},
});
