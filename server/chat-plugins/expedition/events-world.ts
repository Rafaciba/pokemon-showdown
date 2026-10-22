/**
 * pokemon-showdown-custom: segunda leva de eventos "?" da Expedição (parte 1).
 *
 * Eventos descritos pelo usuário em 2026-10-22 (decisões em docs/arquitetura-expedicao.md,
 * seção "Eventos "?", segunda leva"):
 *   - Ataque da Equipe Rocket: batalhar, entregar um Pokémon (qualquer um do time) ou, com
 *     a Bicicleta, fugir;
 *   - Entrada de caverna: um grupo de selvagens de caverna (sem captura); a vitória dá um
 *     fóssil;
 *   - Cientista: reviver um fóssil, trocar um Pokémon por um Porygon ou receber uma Potion;
 *   - Move Reminder: relembrar um golpe de nível já passado;
 *   - Árvore, rocha e grande rocha no caminho: com um Pokémon que aprende Cut, Rock Smash
 *     ou Strength por TM/HM, abre o caminho e acha um item (às vezes com uma batalha
 *     antes: Sudowoodo na árvore, Geodude/Graveler na rocha); senão, dá a volta e enfrenta
 *     um selvagem;
 *   - Pescador (dá a Old Rod), Lago (pescar com a vara ou se refrescar) e Vendedor de
 *     Bicicleta (10000 ₽);
 *   - Idoso envenenado (só no ato 1): curar com um Antidote (ganha um item) ou enfrentar o
 *     Weedle.
 * As espécies das listas fixas ficam no tema da expedição; sem nenhuma no tema, o evento
 * não aparece (os Rocket, sem a lista, sorteiam do tema). Limites por ato (decisão do
 * usuário): o Idoso só no ato 1 e o Lago só no ato 2; os demais, em qualquer ato.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { ExpeditionRun } from './store';
import type { MapNode } from './map';
import { levelAt, monName, registerEvent, SHADE_HEAL } from './events';
import { basicSpecies, evolveForLevel, inTheme, randomSpeciesForLevel } from './species';
import { opponentTeamSize, nodeProgress } from './progression';
import { createMon, levelUpTable, type RunMon } from './team';
import { HELD_ITEMS } from './items';
import { FOSSILS } from './economy';
import { maxPP } from './tooltips';
import { seededRandom } from './random';

// --- Auxiliares ---------------------------------------------------------------------

function hasItem(run: ExpeditionRun, id: string) {
	return run.items.some(item => toID(item) === id);
}

function takeItem(run: ExpeditionRun, id: string) {
	const index = run.items.findIndex(item => toID(item) === id);
	if (index >= 0) run.items.splice(index, 1);
	return index >= 0;
}

function randomHeldItem(prng: PRNG) {
	const items = HELD_ITEMS.filter(name => Dex.items.get(name).exists);
	return items[prng.random(items.length)];
}

/** Espécies de uma lista que estão no tema. */
function inThemeList(run: ExpeditionRun, list: string[]) {
	return list.filter(name => inTheme(name, run.settings.theme));
}

/**
 * O Pokémon pode ser entregue: não é o único do time em condição de batalhar (decisão do
 * usuário: sem ele, a run ficaria sem ninguém para lutar).
 */
function canHandOver(run: ExpeditionRun, uid: string) {
	return run.team.some(mon => mon.uid !== uid && !mon.fainted && mon.hp > 0);
}

/** A espécie aprende o golpe por TM ou HM, em alguma geração que tem a mecânica (decisão do usuário). */
export function learnsByMachine(speciesName: string, moveId: string) {
	const species = Dex.species.get(speciesName);
	let learnset = Dex.species.getLearnsetData(species.id).learnset;
	if (!learnset && species.baseSpecies !== species.name) {
		learnset = Dex.species.getLearnsetData(toID(species.baseSpecies)).learnset;
	}
	return !!learnset?.[moveId]?.some(source => /^\d+M$/.test(source));
}

function teamLearns(run: ExpeditionRun, moveId: string) {
	return run.team.find(mon => learnsByMachine(mon.species, moveId)) || null;
}

/** Selvagem comum do andar (do tema), para os desvios. */
function floorWild(run: ExpeditionRun, node: MapNode, prng: PRNG) {
	const level = levelAt(run, node);
	return { species: randomSpeciesForLevel(prng, level, null, undefined, run.settings.theme), level };
}

// --- Ataque da Equipe Rocket -----------------------------------------------------------

/** Pokémon clássicos dos Rocket (no estágio do nível). */
export const ROCKET_SPECIES = [
	'Rattata', 'Zubat', 'Ekans', 'Koffing', 'Grimer', 'Meowth', 'Drowzee', 'Sandshrew', 'Machop', 'Cubone',
];

/** Time de um membro da Equipe Rocket: da lista clássica no tema ou, sem nenhuma, do tema. */
export function rocketTeam(run: ExpeditionRun, node: MapNode, prng: PRNG, size: number, level: number) {
	const list = inThemeList(run, ROCKET_SPECIES);
	const species: string[] = [];
	for (let guard = 0; species.length < size && guard < size * 20; guard++) {
		const pick = randomSpeciesForLevel(prng, level, list.length ? list : null, undefined, run.settings.theme);
		// Com a lista menor que o time, as espécies se repetem
		if (!species.includes(pick) || list.length < size) species.push(pick);
	}
	return species;
}

registerEvent({
	id: 'rocketattack',
	weight: 15,
	setup(run, node, prng) {
		const level = levelAt(run, node);
		const size = opponentTeamSize('trainer', nodeProgress(run.settings, run.act, node.floor), prng);
		return { level, species: rocketTeam(run, node, prng, size, level), female: prng.random(2) === 1 };
	},
	title: TL => TL`Team Rocket attack`,
	text: ({ TL }) => TL`A Team Rocket grunt jumps out and demands one of your Pokémon!`,
	choices({ TL, run }) {
		const choices = [
			{ id: 'battle', label: TL`Fight back`, detail: TL`A trainer battle, with the usual prize money.` },
			...run.team.map(mon => {
				const species = mon.species;
				return {
					id: `give:${mon.uid}`, label: TL`Hand over ${species}`,
					disabled: !canHandOver(run, mon.uid),
					detail: TL`Avoids the battle; its held item stays in your bag.`,
				};
			}),
		];
		if (hasItem(run, 'bicycle')) {
			choices.push({ id: 'flee', label: TL`Get away on your Bicycle`, detail: TL`No battle and no loss.` });
		}
		return choices;
	},
	choose({ run, data }, choice) {
		if (choice === 'battle') {
			return {
				battle: {
					kind: 'trainer', species: data.species, level: data.level, name: 'Team Rocket Grunt',
					avatar: data.female ? 'rocketgruntf' : 'rocketgrunt', ai: 'variant',
				},
			};
		}
		if (choice === 'flee') return hasItem(run, 'bicycle') ? { result: true } : 'noitem';
		if (!choice.startsWith('give:')) return null;
		const index = run.team.findIndex(mon => mon.uid === choice.slice(5));
		if (index < 0 || !canHandOver(run, choice.slice(5))) return 'badchoice';
		const [given] = run.team.splice(index, 1);
		if (given.item) run.items.push(given.item);
		data.given = given.species;
		return { result: true };
	},
	result({ TL, data }, choice) {
		if (choice === 'flee') return TL`You pedal away before the grunt can react.`;
		const species = data.given || '';
		return TL`The grunt runs off with ${species}.`;
	},
});

// --- Entrada de caverna ------------------------------------------------------------------

export const CAVE_SPECIES = ['Zubat', 'Golbat', 'Geodude', 'Graveler', 'Paras', 'Parasect'];

registerEvent({
	id: 'cave',
	weight: 10,
	setup(run, node, prng) {
		const cave = inThemeList(run, CAVE_SPECIES);
		const fossils = FOSSILS.filter(fossil => inTheme(fossil.species, run.settings.theme));
		if (!cave.length || !fossils.length) return null;
		const count = 3 + prng.random(2);
		const species = Array.from({ length: count }, () => cave[prng.random(cave.length)]);
		return { species, level: levelAt(run, node), fossil: fossils[prng.random(fossils.length)].item };
	},
	title: TL => TL`Cave entrance`,
	text: ({ TL }) => TL`A dark cave opens beside the path. Something glints deep inside, but you hear wings and rocks moving.`,
	choices({ TL, data }) {
		const count = data.species.length;
		return [
			{ id: 'enter', label: TL`Go in`, detail: TL`A wild battle against ${count} cave Pokémon in a row (no capture). Something valuable may be inside.` },
			{ id: 'leave', label: TL`Keep going` },
		];
	},
	choose({ data }, choice) {
		if (choice === 'leave') return { result: true };
		if (choice !== 'enter') return null;
		return {
			battle: {
				kind: 'wild', species: data.species, level: data.level, name: 'Wild cave Pokémon', avatar: '', ai: 'variant',
				noCapture: true,
			},
			reward: { items: [data.fossil] },
		};
	},
	result: ({ TL }) => TL`You leave the cave behind.`,
});

// --- Cientista -----------------------------------------------------------------------------

registerEvent({
	id: 'scientist',
	weight: 10,
	setup(run, node, prng) {
		const level = levelAt(run, node, -2);
		// Fósseis da mochila (até 3 tipos), já com o Pokémon revivido sorteado
		const revives = FOSSILS.filter(fossil => hasItem(run, toID(fossil.item)) && inTheme(fossil.species, run.settings.theme))
			.slice(0, 3).map(fossil => ({
				item: fossil.item,
				mon: createMon(prng, evolveForLevel(prng, fossil.species, level, run.settings.theme), level,
					`f${run.act}-${node.id}-${toID(fossil.item)}`),
			}));
		const porygon = inTheme('Porygon', run.settings.theme);
		return { revives, porygon };
	},
	title: TL => TL`Scientist`,
	text: ({ TL }) => TL`A scientist waves at you from a portable lab. "Fossils, trades, potions... how can I help?"`,
	choices({ TL, run, data }) {
		const choices = data.revives.map((entry: { item: string, mon: RunMon }, i: number) => {
			const item = entry.item;
			const species = entry.mon.species;
			const level = entry.mon.level;
			return { id: `revive:${i}`, label: TL`Revive the ${item}`, detail: TL`${species} (Lv. ${level}) joins you.`,
				disabled: !hasItem(run, toID(item)) };
		});
		if (data.porygon) {
			for (const mon of run.team) {
				const species = mon.species;
				choices.push({ id: `trade:${mon.uid}`, label: TL`Trade ${species} for a Porygon`,
					detail: TL`At the same level; the held item stays in your bag.` });
			}
		}
		choices.push({ id: 'potion', label: TL`Just take a Hyper Potion` });
		return choices;
	},
	choose({ run, node, data }, choice) {
		if (choice === 'potion') {
			run.items.push('hyperpotion');
			return { result: true };
		}
		if (choice.startsWith('revive:')) {
			const entry = data.revives[Number(choice.slice(7))];
			if (!entry || !takeItem(run, toID(entry.item))) return 'noitem';
			run.decisions.push({ kind: 'capture', uid: entry.mon.uid, mon: entry.mon, gift: true });
			data.done = entry.mon.species;
			return { result: true };
		}
		if (!choice.startsWith('trade:') || !data.porygon) return null;
		const index = run.team.findIndex(mon => mon.uid === choice.slice(6));
		if (index < 0) return 'badchoice';
		const old = run.team[index];
		const prng = seededRandom(run.seed, `porygon:${run.act}:${node.id}:${old.uid}`);
		const species = evolveForLevel(prng, 'Porygon', old.level, run.settings.theme);
		const porygon = createMon(prng, species, old.level, `p${run.act}-${node.id}`);
		if (old.item) run.items.push(old.item);
		run.team[index] = { ...porygon, ball: old.ball };
		data.done = species;
		data.traded = old.species;
		return { result: true };
	},
	result({ TL, data }, choice) {
		const species = data.done || '';
		if (choice.startsWith('revive:')) return TL`The machine whirs... ${species} is back to life!`;
		if (choice.startsWith('trade:')) {
			const traded = data.traded;
			return TL`The scientist takes ${traded} and hands you ${species}.`;
		}
		return TL`"Take this, it may help." You get a Hyper Potion.`;
	},
});

// --- Move Reminder ------------------------------------------------------------------------

registerEvent({
	id: 'reminder',
	weight: 10,
	setup(run, node, prng) {
		// Até 3 Pokémon, com até 3 golpes cada
		const offers: { uid: string, move: string }[] = [];
		const team = [...run.team];
		prng.shuffle(team);
		let mons = 0;
		for (const mon of team) {
			// Golpes de nível já passados que ele não conhece (sem os de ovo e de troca)
			const past = [...new Set(levelUpTable(mon.species).filter(entry => entry.level <= mon.level && entry.level > 1)
				.map(entry => entry.move))].filter(move => !mon.moves.includes(move));
			if (!past.length) continue;
			prng.shuffle(past);
			for (const move of past.slice(0, 3)) offers.push({ uid: mon.uid, move });
			if (++mons >= 3) break;
		}
		return offers.length ? { offers } : null;
	},
	title: TL => TL`Move Reminder`,
	text: ({ TL }) => TL`An old man offers to help one of your Pokémon remember a move it once could learn.`,
	choices({ TL, run, data }) {
		return [
			...data.offers.map((offer: { uid: string, move: string }, i: number) => {
				const species = monName(run, offer.uid);
				const move = Dex.moves.get(offer.move).name;
				return { id: `remind:${i}`, label: TL`${species} remembers ${move}`, disabled: !species, move: offer.move };
			}),
			{ id: 'leave', label: TL`No, thanks` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'leave') return { result: true };
		const offer = data.offers[Number(choice.split(':')[1])];
		const mon = choice.startsWith('remind:') && offer && run.team.find(entry => entry.uid === offer.uid);
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
		if (choice === 'leave') return TL`The old man smiles and waves goodbye.`;
		const species = monName(run, data.taught?.uid || '');
		const move = Dex.moves.get(data.taught?.move || '').name;
		return TL`${species} remembered ${move}!`;
	},
});

// --- Obstáculos no caminho ----------------------------------------------------------------

/**
 * Obstáculo: com um Pokémon que aprende o golpe por TM/HM, abre o caminho e acha um item
 * (às vezes com uma batalha antes, e o item vem na vitória); sem ele, dá a volta e
 * enfrenta um selvagem do andar. Dar a volta também é uma escolha de quem pode abrir.
 */
function registerObstacle(options: {
	id: string, move: string, weight: number,
	/** Pokémon que às vezes estava no obstáculo (10%), no estágio do nível. */
	ambush?: string,
	title: (TL: import('../../../sim/dex-text').Translator) => string,
	text: (TL: import('../../../sim/dex-text').Translator) => string,
	use: (TL: import('../../../sim/dex-text').Translator, species: string) => string,
	found: (TL: import('../../../sim/dex-text').Translator, item: string) => string,
}) {
	registerEvent({
		id: options.id,
		weight: options.weight,
		setup(run, node, prng) {
			const item = randomHeldItem(prng);
			const wild = floorWild(run, node, prng);
			const ambushRoll = prng.random(100) < 10;
			const ambush = options.ambush && ambushRoll && inTheme(options.ambush, run.settings.theme) ?
				evolveForLevel(prng, options.ambush, wild.level, run.settings.theme) : null;
			return { item, wild, ambush };
		},
		title: options.title,
		text: ({ TL }) => options.text(TL),
		choices({ TL, run }) {
			const user = teamLearns(run, options.move);
			const move = Dex.moves.get(options.move).name;
			const choices = [];
			if (user) choices.push({ id: 'use', label: options.use(TL, user.species) });
			choices.push({
				id: 'detour', label: TL`Go around`,
				detail: user ? TL`A wild battle on the way.` : TL`No Pokémon in your team can learn ${move}: a wild battle on the way.`,
			});
			return choices;
		},
		choose({ run, data }, choice) {
			if (choice === 'detour') {
				return {
					battle: {
						kind: 'wild', species: [data.wild.species], level: data.wild.level, name: `Wild ${data.wild.species}`,
						avatar: '', ai: 'variant',
					},
				};
			}
			if (choice !== 'use' || !teamLearns(run, options.move)) return null;
			if (data.ambush) {
				return {
					battle: {
						kind: 'wild', species: [data.ambush], level: data.wild.level, name: `Wild ${data.ambush}`, avatar: '',
						ai: 'variant',
					},
					reward: { items: [data.item] },
				};
			}
			run.items.push(data.item);
			return { result: true };
		},
		result: ({ TL, data }) => options.found(TL, data.item),
	});
}

registerObstacle({
	id: 'tree', move: 'cut', weight: 15, ambush: 'Sudowoodo',
	title: TL => TL`A tree in the way`,
	text: TL => TL`A small tree blocks the path. It looks like it could be cut down.`,
	use: (TL, species) => TL`${species} uses Cut`,
	found: (TL, item) => TL`The way is open. Behind the tree you find a ${item}.`,
});

registerObstacle({
	id: 'rock', move: 'rocksmash', weight: 15, ambush: 'Geodude',
	title: TL => TL`A rock in the way`,
	text: TL => TL`A cracked rock blocks the path. It looks like it could be smashed.`,
	use: (TL, species) => TL`${species} uses Rock Smash`,
	found: (TL, item) => TL`The rock crumbles. Among the pieces you find a ${item}.`,
});

registerObstacle({
	id: 'boulder', move: 'strength', weight: 15,
	title: TL => TL`A boulder in the way`,
	text: TL => TL`A huge boulder blocks the path. A strong Pokémon could push it.`,
	use: (TL, species) => TL`${species} uses Strength`,
	found: (TL, item) => TL`The boulder rolls aside. Under it you find a ${item}.`,
});

// --- Pescador, lago e bicicleta -----------------------------------------------------------

registerEvent({
	id: 'fisherman',
	weight: 15,
	setup(run) {
		if (hasItem(run, 'oldrod')) return null;
		return {};
	},
	title: TL => TL`Fisherman`,
	text: ({ TL }) => TL`A fisherman by the path offers you his spare fishing rod. "Every trainer should fish!"`,
	choices: ({ TL }) => [
		{ id: 'accept', label: TL`Accept the Old Rod`, detail: TL`A key item: lets you fish at lakes.` },
		{ id: 'decline', label: TL`Decline` },
	],
	choose({ run }, choice) {
		if (choice === 'decline') return { result: true };
		if (choice !== 'accept') return null;
		if (!hasItem(run, 'oldrod')) run.items.push('oldrod');
		return { result: true };
	},
	result: ({ TL }, choice) => (choice === 'accept' ? TL`You got an Old Rod!` : TL`The fisherman goes back to his line.`),
});

registerEvent({
	id: 'lake',
	weight: 10,
	setup(run, node, prng) {
		// Só no ato 2 (decisão do usuário)
		if (run.act !== 2) return null;
		const level = levelAt(run, node);
		const water = basicSpecies(run.settings.theme).filter(name => Dex.species.get(name).types.includes('Water'));
		const species = water.length ? randomSpeciesForLevel(prng, level, water, undefined, run.settings.theme) : null;
		return { level, species };
	},
	title: TL => TL`Lake`,
	text: ({ TL }) => TL`A calm lake glitters beside the path.`,
	choices({ TL, run, data }) {
		const choices = [];
		if (data.species) {
			choices.push({
				id: 'fish', label: TL`Fish`, disabled: !hasItem(run, 'oldrod'),
				detail: hasItem(run, 'oldrod') ?
					TL`A wild battle against a Water Pokémon; you may catch it.` : TL`You need a fishing rod.`,
			});
		}
		const heal = Math.round(SHADE_HEAL * 100);
		const detail = TL`Your Pokémon recover ${heal}% of their HP and PP.`;
		choices.push({ id: 'rest', label: TL`Cool off in the lake`, detail });
		return choices;
	},
	choose({ run, data }, choice) {
		if (choice === 'fish') {
			if (!data.species || !hasItem(run, 'oldrod')) return 'noitem';
			return {
				battle: {
					kind: 'wild', species: [data.species], level: data.level, name: `Wild ${data.species}`, avatar: '',
					ai: 'variant',
				},
			};
		}
		if (choice !== 'rest') return null;
		// Como a sombra da árvore: quem não desmaiou recupera HP e, aqui, também PP
		for (const mon of run.team) {
			if (mon.fainted) continue;
			mon.hp = Math.min(1, mon.hp + SHADE_HEAL);
			mon.ppUsed = mon.moves.map((move, i) => Math.max(0, (mon.ppUsed[i] || 0) - Math.round(maxPP(move) * SHADE_HEAL)));
		}
		return { result: true };
	},
	result: ({ TL }) => TL`The cool water refreshes your team.`,
});

/** Preço da Bicicleta (decisão do usuário). */
export const BICYCLE_PRICE = 10000;

registerEvent({
	id: 'bikeshop',
	weight: 10,
	setup(run) {
		if (hasItem(run, 'bicycle')) return null;
		return {};
	},
	title: TL => TL`Bicycle seller`,
	text: ({ TL }) => TL`A cheerful salesman shows off a shiny Bicycle. "Fast, light and perfect for escaping trouble!"`,
	choices({ TL, run }) {
		const price = BICYCLE_PRICE;
		return [
			{ id: 'buy', label: TL`Buy the Bicycle (${price} ₽)`, disabled: run.money < BICYCLE_PRICE,
				detail: TL`A key item: lets you get away in some events.` },
			{ id: 'decline', label: TL`No, thanks` },
		];
	},
	choose({ run }, choice) {
		if (choice === 'decline') return { result: true };
		if (choice !== 'buy') return null;
		if (run.money < BICYCLE_PRICE) return 'nomoney';
		run.money -= BICYCLE_PRICE;
		run.items.push('bicycle');
		return { result: true };
	},
	result: ({ TL }, choice) => (choice === 'buy' ? TL`You got a Bicycle!` : TL`The salesman sighs and polishes the bike.`),
});

// --- Idoso envenenado ---------------------------------------------------------------------

registerEvent({
	id: 'oldman',
	weight: 10,
	setup(run, node, prng) {
		// Só no ato 1 (decisão do usuário)
		if (run.act !== 1 || !inTheme('Weedle', run.settings.theme)) return null;
		const level = levelAt(run, node);
		return { item: randomHeldItem(prng), weedle: evolveForLevel(prng, 'Weedle', level, run.settings.theme), level };
	},
	title: TL => TL`Poisoned old man`,
	text: ({ TL, data }) => {
		const species = data.weedle;
		return TL`An old man lies by the path, poisoned. A wild ${species} is still buzzing around him.`;
	},
	choices({ TL, run, data }) {
		const species = data.weedle;
		const antidote = hasItem(run, 'antidote');
		return [
			{ id: 'cure', label: TL`Cure him with an Antidote`, disabled: !antidote,
				detail: antidote ? TL`Uses one Antidote from your bag; he may reward you.` : TL`You need an Antidote in your bag.` },
			{ id: 'battle', label: TL`Fight the ${species}`, detail: TL`A wild battle; you may catch it if you win.` },
		];
	},
	choose({ run, data }, choice) {
		if (choice === 'battle') {
			return {
				battle: {
					kind: 'wild', species: [data.weedle], level: data.level, name: `Wild ${data.weedle}`, avatar: '', ai: 'variant',
				},
			};
		}
		if (choice !== 'cure') return null;
		if (!takeItem(run, 'antidote')) return 'noitem';
		run.items.push(data.item);
		return { result: true };
	},
	result: ({ TL, data }) => {
		const item = data.item;
		return TL`The old man recovers and thanks you with a ${item}.`;
	},
});
