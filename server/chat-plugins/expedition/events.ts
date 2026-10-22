/**
 * pokemon-showdown-custom: eventos "?" da Expedição (etapa 3, parte 3).
 *
 * Decisão do usuário (2026-10-21): eventos no estilo do Slay the Spire, com escolhas
 * de resultados diferentes. Exemplo dele: numa árvore, chacoalhar para ganhar uma
 * berry, mas enfrentar Pokémon inseto, ou aproveitar a sombra para curar parte do HP.
 *
 * Como funciona:
 * - ao entrar no nó, o evento é sorteado (pela semente da run e pelo nó, entre os que
 *   valem para o time naquele momento) e os dados dele também (a berry, o Pokémon do
 *   presente, os golpes do tutor...). Tudo fica em `run.nodeState`: voltar à página
 *   mostra o mesmo evento;
 * - cada escolha dá um resultado direto (cura, item, dinheiro, evolução, golpe, um
 *   Pokémon) ou começa uma batalha com recompensa (`nodeState.battle` e
 *   `nodeState.reward`, aplicados por battles.ts na vitória). A derrota numa batalha de
 *   evento encerra a run, como qualquer batalha;
 * - depois do resultado, "Continuar" termina o nó.
 *
 * Primeira leva (decisão do usuário): evoluções especiais, risco e recompensa, tutor de
 * golpes, Pokémon de presente, árvore de berries, dinheiro e Pokémon selvagem. Os
 * números (chances, quantias, cura) são escolha nossa, documentados em
 * docs/arquitetura-expedicao.md.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { Translator } from '../../../sim/dex-text';
import type { TextLanguage } from '../../../sim/dex-data';
import type { ExpeditionRun } from './store';
import type { MapNode } from './map';
import { seededRandom, weightedPick } from './random';
import { basicSpecies, randomSpeciesForLevel, specialEvolutions } from './species';
import { curveLevel, evolveMon, nodeProgress, opponentTeamSize } from './progression';
import { createMon, type RunMon } from './team';
import { HELD_ITEMS } from './items';
import { moneyMultiplier, tmMovesFor } from './economy';

/** Batalha começada por um evento (o encontro é montado por encounters.ts → encounterFromSpec). */
export interface EventBattle {
	kind: 'wild' | 'trainer';
	species: string[];
	level: number;
	name: string;
	avatar: string;
	/** Nível de IA: o da variação para o tipo, ou um fixo. */
	ai: 'variant' | 'hard';
}

/** Recompensa de uma batalha de evento, entregue na vitória. */
export interface EventReward {
	money?: number;
	items?: string[];
}

export interface EventContext {
	run: ExpeditionRun;
	node: MapNode;
	TL: Translator;
	lang: TextLanguage;
	data: AnyObject;
}

export interface EventChoice {
	id: string;
	label: string;
	detail?: string;
	disabled?: boolean;
	/** Golpe da escolha (tooltip com os detalhes, como no tutor). */
	move?: string;
}

/** O que uma escolha fez: o resultado direto, ou uma batalha (com a recompensa da vitória). */
export type EventOutcome = { result: true } | { battle: EventBattle, reward?: EventReward };

export interface ExpeditionEvent {
	id: string;
	/** Chance relativa entre os eventos que valem. */
	weight: number;
	/** Dados sorteados ao entrar no nó; null = o evento não vale agora (ex.: ninguém evolui). */
	setup(run: ExpeditionRun, node: MapNode, prng: PRNG): AnyObject | null;
	title(TL: Translator): string;
	text(context: EventContext): string;
	choices(context: EventContext): EventChoice[];
	/** Aplica a escolha. Devolve o resultado, um problema (código) ou null (escolha inválida). */
	choose(context: EventContext, choice: string): EventOutcome | string | null;
	/** Texto do resultado de uma escolha direta. */
	result(context: EventContext, choice: string): string;
}

const registry: ExpeditionEvent[] = [];

export function registerEvent(event: ExpeditionEvent) {
	registry.push(event);
}

export function getEvent(id: string) {
	return registry.find(event => event.id === id) || null;
}

/** Sorteia o evento do nó (entre os que valem para a run agora) e os dados dele. */
export function pickEvent(run: ExpeditionRun, node: MapNode): { event: string, data: AnyObject } | null {
	const prng = seededRandom(run.seed, `event:${run.act}:${node.id}`);
	const candidates = new Map<string, AnyObject>();
	for (const event of registry) {
		const data = event.setup(run, node, seededRandom(run.seed, `event:${run.act}:${node.id}:${event.id}`));
		if (data) candidates.set(event.id, data);
	}
	const weights: Record<string, number> = {};
	for (const id of candidates.keys()) weights[id] = getEvent(id)!.weight;
	const id = weightedPick(prng, weights);
	return id ? { event: id, data: candidates.get(id)! } : null;
}

// --- Auxiliares ---------------------------------------------------------------------

function levelAt(run: ExpeditionRun, node: MapNode, offset = 0) {
	return Math.max(1, Math.round(curveLevel(run.settings, run.act, node.floor) + offset));
}

/** Quantia de dinheiro de evento: uma fração do prêmio de um treinador do andar. */
function eventMoney(run: ExpeditionRun, node: MapNode, factor: number) {
	return Math.round(30 * levelAt(run, node) * moneyMultiplier(run.settings) * factor / 10) * 10;
}

function monName(run: ExpeditionRun, uid: string) {
	return run.team.find(mon => mon.uid === uid)?.species || '';
}

const BERRIES = ['Oran Berry', 'Sitrus Berry', 'Lum Berry', 'Chesto Berry'];

/** HP recuperado à sombra da árvore de berries (fração do HP máximo; escolha nossa). */
export const SHADE_HEAL = 0.3;

// --- Eventos ------------------------------------------------------------------------

/** Evoluções especiais (troca, pedra, amizade...): o jogador escolhe quem evolui. */
registerEvent({
	id: 'evolution',
	weight: 20,
	setup(run, node, prng) {
		const offers: { uid: string, from: string, into: string }[] = [];
		for (const mon of run.team) {
			for (const evo of specialEvolutions(mon.species)) offers.push({ uid: mon.uid, from: mon.species, into: evo });
		}
		if (!offers.length) return null;
		prng.shuffle(offers);
		return { offers: offers.slice(0, 3) };
	},
	title: TL => TL`Mysterious stone`,
	text: ({ TL }) => (
		TL`An old researcher shows you a glowing stone. It can trigger evolutions that usually need a trade, an item or friendship.`
	),
	choices({ TL, run, data }) {
		return [
			...data.offers.map((offer: { uid: string, from?: string, into: string }, i: number) => {
				const species = monName(run, offer.uid);
				const into = offer.into;
				const changed = !!offer.from && species !== offer.from;
				return { id: `evolve:${i}`, label: TL`Evolve ${species} into ${into}`, disabled: !species || changed };
			}),
			{ id: 'leave', label: TL`Leave` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'leave') return { result: true };
		const offer = data.offers[Number(choice.split(':')[1])];
		const mon = choice.startsWith('evolve:') && offer && run.team.find(entry => entry.uid === offer.uid);
		if (!mon) return null;
		// O Pokémon pode ter evoluído por nível depois do sorteio (Rare Candy no nó)
		if (offer.from && mon.species !== offer.from) return 'badchoice';
		evolveMon(mon, offer.into);
		data.evolved = { species: offer.into };
		return { result: true };
	},
	result({ TL, data }, choice) {
		if (choice === 'leave') return TL`You thank the researcher and move on.`;
		const into = data.evolved?.species || '';
		return TL`The stone glows... Your Pokémon evolved into ${into}!`;
	},
});

/** Risco e recompensa: um treinador forte desafia, com prêmio dobrado e um item. */
registerEvent({
	id: 'challenge',
	weight: 15,
	setup(run, node, prng) {
		const progress = nodeProgress(run.settings, run.act, node.floor);
		const level = levelAt(run, node, 3);
		const size = Math.min(6, opponentTeamSize('trainer', progress, prng) + 1);
		const species: string[] = [];
		for (let guard = 0; species.length < size && guard < 40; guard++) {
			const pick = randomSpeciesForLevel(prng, level);
			if (!species.includes(pick)) species.push(pick);
		}
		const items = HELD_ITEMS.filter(name => Dex.items.get(name).exists);
		return {
			level, species, money: eventMoney(run, node, 2), item: items[prng.random(items.length)],
		};
	},
	title: TL => TL`Veteran trainer`,
	text({ TL, data }) {
		const count = data.species.length;
		const level = data.level;
		return TL`A veteran trainer offers a tough battle: ${count} Pokémon around level ${level}. The reward is generous, but losing ends your expedition.`;
	},
	choices({ TL, data }) {
		const money = data.money;
		const item = data.item;
		return [
			{ id: 'accept', label: TL`Accept the challenge`, detail: TL`Reward: ${money} ₽ and a ${item}.` },
			{ id: 'decline', label: TL`Decline` },
		];
	},
	choose({ data }, choice) {
		if (choice === 'decline') return { result: true };
		if (choice !== 'accept') return null;
		return {
			battle: {
				kind: 'trainer', species: data.species, level: data.level, name: 'Veteran', avatar: 'veteran', ai: 'hard',
			},
			reward: { money: data.money, items: [data.item] },
		};
	},
	result: ({ TL }) => TL`The veteran shrugs and lets you pass.`,
});

/** Tutor de golpes: ensina um golpe fora da lista de nível (de graça, um só). */
registerEvent({
	id: 'tutor',
	weight: 15,
	setup(run, node, prng) {
		const offers: { uid: string, move: string }[] = [];
		const team = [...run.team];
		prng.shuffle(team);
		for (const mon of team) {
			// Golpes de ataque com poder 60 ou mais (sem Hidden Power), de preferência do tipo
			// do Pokémon (escolha nossa: os de status e os fracos raramente ajudam)
			const types = Dex.species.get(mon.species).types;
			const strong = tmMovesFor(mon).filter(id => {
				const move = Dex.moves.get(id);
				return move.category !== 'Status' && move.basePower >= 60 && move.id !== 'hiddenpower';
			});
			const stab = strong.filter(id => types.includes(Dex.moves.get(id).type));
			const moves = stab.length && prng.random(10) < 7 ? stab : strong;
			if (!moves.length) continue;
			offers.push({ uid: mon.uid, move: moves[prng.random(moves.length)] });
			if (offers.length >= 3) break;
		}
		return offers.length ? { offers } : null;
	},
	title: TL => TL`Move tutor`,
	text: ({ TL }) => TL`A move tutor offers to teach one move for free.`,
	choices({ TL, run, data }) {
		return [
			...data.offers.map((offer: { uid: string, move: string }, i: number) => {
				const species = monName(run, offer.uid);
				const move = Dex.moves.get(offer.move).name;
				return { id: `teach:${i}`, label: TL`Teach ${move} to ${species}`, disabled: !species, move: offer.move };
			}),
			{ id: 'leave', label: TL`No, thanks` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'leave') return { result: true };
		const offer = data.offers[Number(choice.split(':')[1])];
		const mon = choice.startsWith('teach:') && offer && run.team.find(entry => entry.uid === offer.uid);
		if (!mon) return null;
		if (mon.moves.includes(offer.move)) return 'badchoice';
		if (mon.moves.length < 4) {
			mon.moves.push(offer.move);
			mon.ppUsed.push(0);
		} else {
			run.decisions.push({ kind: 'learn', uid: mon.uid, move: offer.move });
		}
		data.taught = offer;
		return { result: true };
	},
	result({ TL, run, data }, choice) {
		if (choice === 'leave') return TL`The tutor nods and goes back to their notes.`;
		const species = monName(run, data.taught?.uid || '');
		const move = Dex.moves.get(data.taught?.move || '').name;
		return TL`${species} learned ${move}!`;
	},
});

/** Pokémon de presente: aceitar (com a regra do time cheio) ou recusar. */
registerEvent({
	id: 'gift',
	weight: 10,
	setup(run, node, prng) {
		const level = levelAt(run, node, -2);
		const mon = createMon(prng, randomSpeciesForLevel(prng, level), level, `g${run.act}-${node.id}`);
		return { mon };
	},
	title: TL => TL`A gift`,
	text({ TL, data }) {
		const species = data.mon.species;
		const level = data.mon.level;
		return TL`A trainer who is moving away asks you to take care of their ${species} (Lv. ${level}).`;
	},
	choices: ({ TL }) => [
		{ id: 'accept', label: TL`Accept the gift` },
		{ id: 'decline', label: TL`Decline` },
	],
	choose({ run, data }, choice) {
		if (choice === 'decline') return { result: true };
		if (choice !== 'accept') return null;
		// Entra pela fila de decisões (a mesma da captura: com o time cheio, alguém sai)
		run.decisions.push({ kind: 'capture', uid: data.mon.uid, mon: data.mon });
		return { result: true };
	},
	result({ TL, data }, choice) {
		const species = data.mon.species;
		return choice === 'accept' ? TL`You promise to take good care of ${species}.` :
			TL`The trainer understands and wishes you luck.`;
	},
});

/** Árvore de berries (o exemplo do usuário): chacoalhar e enfrentar insetos, descansar à sombra ou seguir. */
registerEvent({
	id: 'berrytree',
	weight: 15,
	setup(run, node, prng) {
		const level = levelAt(run, node);
		const bugs = basicSpecies().filter(name => Dex.species.get(name).types.includes('Bug'));
		const count = 1 + prng.random(2);
		const species: string[] = [];
		for (let guard = 0; species.length < count && guard < 20; guard++) {
			const pick = randomSpeciesForLevel(prng, level, bugs);
			if (!species.includes(pick)) species.push(pick);
		}
		return { berry: BERRIES[prng.random(BERRIES.length)], species, level };
	},
	title: TL => TL`Berry tree`,
	text: ({ TL }) => TL`A big berry tree full of fruit. Something buzzes among the leaves...`,
	choices({ TL, data }) {
		const berry = data.berry;
		return [
			{ id: 'shake', label: TL`Shake the tree`, detail: TL`Get a ${berry}, but fight the Bug Pokémon that fall.` },
			{ id: 'rest', label: TL`Rest in the shade`, detail: TL`Your Pokémon recover 30% of their HP.` },
			{ id: 'leave', label: TL`Leave` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'leave') return { result: true };
		if (choice === 'rest') {
			for (const mon of run.team) {
				if (!mon.fainted) mon.hp = Math.min(1, mon.hp + SHADE_HEAL);
			}
			return { result: true };
		}
		if (choice !== 'shake') return null;
		const name = data.species.length > 1 ? 'Bug swarm' : `Wild ${data.species[0]}`;
		return {
			battle: { kind: 'wild', species: data.species, level: data.level, name, avatar: '', ai: 'variant' },
			reward: { items: [data.berry] },
		};
	},
	result: ({ TL }, choice) => (choice === 'rest' ? TL`Your Pokémon rest in the cool shade.` :
	TL`You leave the tree alone.`),
});

/** Dinheiro: uma carteira perdida (ficar com o dinheiro ou devolver e ganhar um item). */
registerEvent({
	id: 'wallet',
	weight: 15,
	setup(run, node, prng) {
		const items = HELD_ITEMS.filter(name => Dex.items.get(name).exists);
		return { money: eventMoney(run, node, 0.8), item: items[prng.random(items.length)] };
	},
	title: TL => TL`Lost wallet`,
	text: ({ TL }) => TL`You find a lost wallet on the path. There is a name and an address inside.`,
	choices({ TL, data }) {
		const money = data.money;
		return [
			{ id: 'keep', label: TL`Keep the money`, detail: TL`+${money} ₽.` },
			{ id: 'return', label: TL`Return it to the owner`, detail: TL`The owner may thank you with an item.` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'keep') run.money += data.money;
		else if (choice === 'return') run.items.push(data.item);
		else return null;
		return { result: true };
	},
	result({ TL, data }, choice) {
		const money = data.money;
		const item = data.item;
		return choice === 'keep' ? TL`You keep the ${money} ₽.` : TL`The grateful owner gives you a ${item}.`;
	},
});

/** Pokémon selvagem ferido: ajudar com uma poção (ele entra no time), batalhar ou seguir. */
registerEvent({
	id: 'injured',
	weight: 10,
	setup(run, node, prng) {
		const level = levelAt(run, node, -1);
		const mon = createMon(prng, randomSpeciesForLevel(prng, level), level, `i${run.act}-${node.id}`);
		return { mon };
	},
	title: TL => TL`Injured Pokémon`,
	text({ TL, data }) {
		const species = data.mon.species;
		return TL`A hurt ${species} is lying by the path.`;
	},
	choices({ TL, run }) {
		const potion = POTIONS.find(id => run.items.includes(id));
		return [
			{
				id: 'help', label: TL`Heal it with a potion`, disabled: !potion,
				detail: potion ? TL`Uses one potion from your bag; it may want to join you.` : TL`You need a potion in your bag.`,
			},
			{ id: 'battle', label: TL`Battle it`, detail: TL`A wild battle: you may catch it if you win.` },
			{ id: 'leave', label: TL`Leave` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'leave') return { result: true };
		if (choice === 'battle') {
			return {
				battle: {
					kind: 'wild', species: [data.mon.species], level: data.mon.level, name: `Wild ${data.mon.species}`,
					avatar: '', ai: 'variant',
				},
			};
		}
		if (choice !== 'help') return null;
		const potion = POTIONS.find(id => run.items.includes(id));
		if (!potion) return 'noitem';
		run.items.splice(run.items.indexOf(potion), 1);
		run.decisions.push({ kind: 'capture', uid: data.mon.uid, mon: data.mon as RunMon });
		return { result: true };
	},
	result({ TL, data }, choice) {
		const species = data.mon.species;
		return choice === 'help' ? TL`${species} feels better and looks at you with trust.` :
			TL`You leave the Pokémon to rest.`;
	},
});

/** Poções que servem para ajudar o Pokémon ferido (a mais barata é usada primeiro). */
const POTIONS = ['potion', 'superpotion', 'hyperpotion', 'maxpotion', 'fullrestore'];
