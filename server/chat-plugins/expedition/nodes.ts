/**
 * pokemon-showdown-custom: tipos de nó do mapa da Expedição.
 *
 * Um tipo de nó diz o que o jogador vê ao entrar, as escolhas oferecidas e o que cada
 * escolha faz com a run. Os tipos ficam numa lista, e cada variação escolhe quais usa
 * (pelos pesos do mapa); variações podem registrar os seus.
 *
 * Os genéricos da base são batalha selvagem, treinador, chefe, descanso e item. Na
 * etapa 1, só o descanso tem efeito: as batalhas chegam na etapa 2, e os itens na 3.
 * Até lá, esses nós só mostram o tipo e seguem em frente.
 *
 * @license MIT
 */
import type { Translator } from '../../../sim/dex-text';
import type { MapNode } from './map';
import type { ExpeditionRun } from './store';
import { healMon } from './team';

export interface NodeChoice {
	id: string;
	label: string;
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
	view(context: NodeContext): NodeView;
	/**
	 * Aplica a escolha à run (que é gravada depois). Devolve true se o nó terminou,
	 * false se continua aberto, ou null se a escolha não existe.
	 */
	choose(context: NodeContext, choice: string): boolean | null;
}

const registry = new Map<string, NodeType>();

export function registerNodeType(type: NodeType) {
	registry.set(type.id, type);
}

export function getNodeType(id: string): NodeType | null {
	return registry.get(id) || null;
}

/** Nó ainda sem efeito (as batalhas chegam na etapa 2, os itens na 3): só segue em frente. */
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

registerNodeType(placeholder('wild', '\u{1F33F}', TL => TL`Wild Pokémon`));
registerNodeType(placeholder('trainer', '\u{1F9E2}', TL => TL`Trainer`));
registerNodeType(placeholder('boss', '\u{1F451}', TL => TL`Boss`));
registerNodeType(placeholder('item', '\u{1F381}', TL => TL`Item`));

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
