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
import './events-world';
import './events-rocket';
import { seededRandom } from './random';
import { FEWER_ITEMS, hasPenalty } from './difficulty';

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
// Elite (etapa 7): treinador forte, com recompensa melhor (battles.ts → eliteReward)
registerNodeType({ id: 'elite', icon: '\u{2694}\u{FE0F}', label: TL => TL`Elite trainer`, encounter: true });
// Ato especial do modo Completo (etapa 9): a Elite 4 em dupla e o Campeão
registerNodeType({ id: 'elitefour', icon: '\u{1F396}\u{FE0F}', label: TL => TL`Elite Four`, encounter: true });
registerNodeType({ id: 'champion', icon: '\u{1F3C6}', label: TL => TL`Champion`, encounter: true });
registerNodeType({ id: 'boss', icon: '\u{1F451}', label: TL => TL`Boss`, encounter: true });
registerNodeType({ id: 'legendary', icon: '\u{2728}', label: TL => TL`Legendary Pokémon`, encounter: true });
/** Chance (%) de uma Master Ball no nó de item, nas expedições com captura por bola (decisão do usuário). */
export const MASTER_BALL_CHANCE = 5;

/**
 * Itens do nó de item: 3 sorteados pela semente da run e pelo nó (os mesmos ao voltar à
 * página); às vezes, o último é uma Mega Stone (item raro, items.ts) e, nas expedições
 * com captura por bola, o primeiro é uma Master Ball (sorteio próprio, que não muda os
 * outros itens).
 */
function nodeItems({ run, node }: NodeContext) {
	const prng = seededRandom(run.seed, `item:${run.act}:${node.id}`);
	// Agravante 2 do modo Completo: 2 opções em vez de 3
	const items = pickItems(prng, hasPenalty(run.settings, FEWER_ITEMS) ? 2 : 3);
	if (prng.random(100) < MEGA_STONE_CHANCE) {
		const stone = pickMegaStone(prng, run.team);
		if (stone) items[items.length - 1] = stone;
	}
	const capture = run.settings.rules.capture;
	if ((capture === 'ball' || capture === 'chance') &&
		seededRandom(run.seed, `masterball:${run.act}:${node.id}`).random(100) < MASTER_BALL_CHANCE) {
		items[0] = 'masterball';
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
		// O evento continua (novas escolhas), sem resultado ainda
		if ('stay' in outcome) return false;
		if ('battle' in outcome) {
			// A batalha fica no estado do nó; a vitória termina o nó (battles.ts)
			run.nodeState = { ...run.nodeState, battle: outcome.battle, reward: outcome.reward || null };
		} else {
			run.nodeState = { ...run.nodeState, outcome: choice };
		}
		return false;
	},
});

/** Vagas do Computador (escolha nossa; o mesmo número de runs.ts). */
const PC_SIZE = 30;

/**
 * PokéCenter: cura o time. Com o Computador ligado (etapa 8, decisão do usuário), o
 * jogador escolhe entre curar e usar o Computador para mexer no time (guardar e pegar
 * Pokémon). Quem está no Computador só é curado quando o jogador sai do PokéCenter:
 * quem é guardado agora volta curado só numa visita seguinte. O item de quem é guardado
 * vai para a mochila (nenhum item fica no Computador).
 */
registerNodeType({
	id: 'rest',
	icon: '\u{1F3E5}',
	// Nome pedido pelo usuário (antes "Descanso"); o id continua "rest"
	label: TL => TL`PokéCenter`,
	view({ run, TL }) {
		if (run.nodeState.pc) {
			return {
				text: TL`Computer: store Pokémon from your team or take them back. Those stored are healed when you leave the PokéCenter.`,
				choices: [{ id: 'leave', label: TL`Leave the PokéCenter` }],
			};
		}
		const choices: NodeChoice[] = [{ id: 'rest', label: TL`Heal your team` }];
		if (run.settings.rules.computer) choices.push({ id: 'pc', label: TL`Use the Computer` });
		return {
			text: run.settings.rules.computer ?
				TL`Heal your whole team (HP, PP, status and fainted Pokémon), or use the Computer to change your team.` :
				TL`At the PokéCenter, your whole team recovers HP, PP and status, and fainted Pokémon come back.`,
			choices,
		};
	},
	choose({ run }, choice) {
		if (choice === 'rest' && !run.nodeState.pc) {
			for (const mon of run.team) healMon(mon);
			return true;
		}
		if (!run.settings.rules.computer) return null;
		if (choice === 'pc') {
			run.nodeState.pc = true;
			return false;
		}
		if (!run.nodeState.pc) return null;
		if (choice === 'leave') {
			for (const mon of run.box) healMon(mon);
			return true;
		}
		if (choice.startsWith('deposit:')) {
			const index = run.team.findIndex(mon => mon.uid === choice.slice(8));
			if (index < 0) return null;
			if (run.team.length <= 1) return 'lastmon';
			if (run.box.length >= PC_SIZE) return 'boxfull';
			const [stored] = run.team.splice(index, 1);
			if (stored.item) run.items.push(stored.item);
			run.box.push({ ...stored, item: '' });
			return false;
		}
		if (choice.startsWith('withdraw:')) {
			const index = run.box.findIndex(mon => mon.uid === choice.slice(9));
			if (index < 0) return null;
			if (run.team.length >= run.settings.rules.teamSize) return 'teamfull';
			run.team.push(...run.box.splice(index, 1));
			return false;
		}
		return null;
	},
});
