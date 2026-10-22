/**
 * pokemon-showdown-custom: segunda leva de eventos "?" da Expedição (parte 2): a Equipe
 * Rocket (decisões do usuário, 2026-10-22; ver docs/arquitetura-expedicao.md).
 *
 * - Rocket atacando crianças: intervir (batalha em dupla contra dois Rocket, com a IA de
 *   cada posição limitada ao seu treinador, tag-team.ts; a vitória dá um item da sacola,
 *   Master Ball com 15% de chance, e uma berry da criança), furtar a sacola (Master Ball com
 *   5%) ou, com a Bicicleta, chamar a polícia (o dinheiro da carteira perdida).
 * - Covil da Equipe Rocket (só no ato 3): entrar e escolher esquerda ou direita 4 vezes
 *   (cada sala: 60% batalha contra um Rocket, 30% item de segurar ou de uso, 10% vazia),
 *   e então o fim (40% sala vazia, 35% maleta com a Master Ball, 25% o Giovanni, com a
 *   Master Ball de recompensa). Dá para voltar a qualquer momento, com o que já ganhou. O
 *   evento continua depois de cada batalha (`resume`); a derrota encerra a run, como
 *   sempre.
 * Sem captura por bola, a Master Ball vira uma Mega Stone (de preferência uma que o time
 * usa). As salas e os finais são sorteados com a semente da run, o nó e o passo.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { ExpeditionRun } from './store';
import { BERRIES, eventMoney, levelAt, registerEvent, type EventBattle } from './events';
import { inTheme, randomSpeciesForLevel } from './species';
import { bossTeamSize, nodeProgress, opponentTeamSize } from './progression';
import { HELD_ITEMS, pickMegaStone } from './items';
import { rocketTeam } from './events-world';
import { seededRandom } from './random';
import { interleave } from './tag-team';

function usesBalls(run: ExpeditionRun) {
	return run.settings.rules.capture === 'ball' || run.settings.rules.capture === 'chance';
}

function randomHeldItem(prng: PRNG) {
	const items = HELD_ITEMS.filter(name => Dex.items.get(name).exists);
	return items[prng.random(items.length)];
}

/** Master Ball com a chance dada; sem captura por bola, Mega Stone no lugar. Senão, um item de segurar. */
function rareItem(run: ExpeditionRun, prng: PRNG, chance: number) {
	if (prng.random(100) < chance) {
		if (usesBalls(run)) return 'masterball';
		const stone = pickMegaStone(prng, run.team);
		if (stone) return stone;
	}
	return randomHeldItem(prng);
}

function hasItem(run: ExpeditionRun, id: string) {
	return run.items.some(item => toID(item) === id);
}

function rocketBattle(species: string[], level: number, female: boolean, resume = false): EventBattle {
	return {
		kind: 'trainer', species, level, name: 'Team Rocket Grunt', avatar: female ? 'rocketgruntf' : 'rocketgrunt',
		ai: 'variant', ...(resume ? { resume } : {}),
	};
}

// --- Rocket atacando crianças --------------------------------------------------------------

/** Chances (%) de Master Ball (decisões do usuário: maior defendendo a criança). */
export const KIDS_MASTER_BALL_WIN = 15;
export const KIDS_MASTER_BALL_STEAL = 5;

registerEvent({
	id: 'rocketkids',
	weight: 15,
	setup(run, node, prng) {
		const level = levelAt(run, node);
		// Os dois times sem repetir espécies (o dono de cada Pokémon vai pelo nome)
		const a = [...new Set(rocketTeam(run, node, prng, 2 + prng.random(2), level))];
		const size = 2 + prng.random(2);
		const b: string[] = [];
		for (let guard = 0; b.length < size && guard < 40; guard++) {
			const pool = guard < 20 ? rocketTeam(run, node, prng, 1, level) :
				[randomSpeciesForLevel(prng, level, null, undefined, run.settings.theme)];
			if (!a.includes(pool[0]) && !b.includes(pool[0])) b.push(pool[0]);
		}
		if (!b.length) return null;
		return {
			level, a, b, bag: rareItem(run, prng, KIDS_MASTER_BALL_WIN), berry: BERRIES[prng.random(BERRIES.length)],
			loot: rareItem(run, seededRandom(run.seed, `rocketkids:${run.act}:${node.id}:loot`), KIDS_MASTER_BALL_STEAL),
			money: eventMoney(run, node, 0.8),
		};
	},
	title: TL => TL`Team Rocket and the kid`,
	text: ({ TL }) => TL`Two Team Rocket grunts have cornered a young trainer and are trying to steal their Pokémon. Their bag lies on the ground nearby.`,
	choices({ TL, run, data }) {
		const money = data.money;
		const choices = [
			{ id: 'help', label: TL`Step in and fight`, detail: TL`A doubles battle against both grunts. They may drop their bag, and the kid will thank you.` },
			{ id: 'steal', label: TL`Grab their bag`, detail: TL`No battle: take whatever is in the bag while they are busy.` },
		];
		if (hasItem(run, 'bicycle')) {
			choices.push({ id: 'police', label: TL`Ride to call the police`, detail: TL`The police reward you with ${money} ₽.` });
		}
		return choices;
	},
	choose({ run, data }, choice) {
		if (choice === 'help') {
			const owners: Record<string, number> = {};
			for (const name of data.a) owners[name] = 0;
			for (const name of data.b) owners[name] = 1;
			return {
				battle: {
					kind: 'trainer', species: interleave(data.a, data.b), level: data.level, name: 'Team Rocket Grunts',
					avatar: 'rocketgrunt', ai: 'variant', owners,
				},
				reward: { items: [data.bag, data.berry] },
			};
		}
		if (choice === 'steal') {
			run.items.push(data.loot);
			return { result: true };
		}
		if (choice !== 'police') return null;
		if (!hasItem(run, 'bicycle')) return 'noitem';
		run.money += data.money;
		return { result: true };
	},
	result({ TL, data }, choice) {
		if (choice === 'police') {
			const money = data.money;
			return TL`The police arrive in time, and the grunts flee. You get ${money} ₽ as a reward.`;
		}
		const item = Dex.items.get(data.loot).name || data.loot;
		return TL`You slip away with the bag. Inside, you find: ${item}.`;
	},
});

// --- Covil da Equipe Rocket ----------------------------------------------------------------

/** Salas até o fim do covil (decisão do usuário). */
export const LAIR_ROOMS = 4;
/** Pokémon do Giovanni (no estágio do nível, só os do tema). */
export const GIOVANNI_SPECIES = ['Persian', 'Nidoking', 'Nidoqueen', 'Rhyhorn', 'Dugtrio', 'Kangaskhan', 'Marowak', 'Golem'];
/** Itens de uso das salas de item (além dos de segurar). */
const LAIR_CONSUMABLES = ['hyperpotion', 'maxpotion', 'fullrestore', 'fullheal', 'revive', 'rarecandy'];

interface LairState {
	inside: boolean;
	step: number;
	gained: string[];
	/** O que aconteceu na última sala. */
	last: null | { kind: 'battle' | 'item' | 'empty' | 'briefcase' | 'giovanni' | 'end', item?: string };
	done: boolean;
}

function lairItem(run: ExpeditionRun, prng: PRNG) {
	if (prng.random(2) === 0) return randomHeldItem(prng);
	const options = LAIR_CONSUMABLES.filter(id => run.settings.rules.faint !== 'nuzlocke' || !id.includes('revive'));
	return options[prng.random(options.length)];
}

function itemName(entry: string) {
	return Dex.items.get(entry).exists ? Dex.items.get(entry).name : entry;
}

registerEvent({
	id: 'rocketlair',
	weight: 5,
	setup(run, node) {
		// Só no ato 3 (decisão do usuário)
		if (run.act !== 3) return null;
		const lair: LairState = { inside: false, step: 0, gained: [], last: null, done: false };
		return { lair, level: levelAt(run, node) };
	},
	title: TL => TL`Team Rocket hideout`,
	text({ TL, data }) {
		const lair: LairState = data.lair;
		if (!lair.inside) return TL`You find a hidden entrance to a Team Rocket hideout. Who knows what is inside...`;
		const step = lair.step;
		const total = LAIR_ROOMS;
		const last = lair.last;
		let text = '';
		if (last?.kind === 'battle') text = TL`You defeated the grunt guarding the room.`;
		if (last?.kind === 'item') {
			const item = itemName(last.item!);
			text = TL`The room had a ${item}, now in your bag.`;
		}
		if (last?.kind === 'empty') text = TL`The room is empty.`;
		if (last?.kind === 'end') text = TL`The last room is empty. Nothing left to find here.`;
		if (last?.kind === 'briefcase') {
			const item = itemName(last.item!);
			text = TL`In the last room you find a briefcase with a ${item}!`;
		}
		if (last?.kind === 'giovanni') {
			const item = itemName(last.item!);
			text = TL`You defeated Giovanni! He leaves a ${item} behind as he escapes.`;
		}
		if (lair.done) return text;
		const progress = TL`Rooms crossed: ${step} of ${total}.`;
		return `${text} ${progress}`.trim();
	},
	choices({ TL, data }) {
		const lair: LairState = data.lair;
		if (!lair.inside) {
			return [
				{ id: 'enter', label: TL`Sneak in`, detail: TL`Each room may hold a grunt, an item or nothing. You can go back at any time with what you found.` },
				{ id: 'leave', label: TL`Keep going` },
			];
		}
		if (lair.done) return [{ id: 'exit', label: TL`Leave the hideout` }];
		if (lair.step >= LAIR_ROOMS) {
			return [
				{ id: 'end', label: TL`Open the last door` },
				{ id: 'exit', label: TL`Go back the way you came` },
			];
		}
		return [
			{ id: 'left', label: TL`Go left` },
			{ id: 'right', label: TL`Go right` },
			{ id: 'exit', label: TL`Go back the way you came` },
		];
	},
	choose({ run, node, data }, choice) {
		const lair: LairState = data.lair;
		if (choice === 'leave' && !lair.inside) return { result: true };
		if (choice === 'exit' && lair.inside) return { result: true };
		if (choice === 'enter' && !lair.inside) {
			lair.inside = true;
			return { stay: true };
		}
		if (!lair.inside || lair.done) return null;
		const prng = seededRandom(run.seed, `rocketlair:${run.act}:${node.id}:${lair.step}:${choice}`);
		if (choice === 'end' && lair.step >= LAIR_ROOMS) {
			lair.done = true;
			const roll = prng.random(100);
			const prize = rareItem(run, prng, 100);
			if (roll < 40) {
				lair.last = { kind: 'end' };
				return { stay: true };
			}
			if (roll < 75) {
				lair.last = { kind: 'briefcase', item: prize };
				lair.gained.push(prize);
				run.items.push(prize);
				return { stay: true };
			}
			// Giovanni: time de chefe do ato (tamanho e nível do chefe, IA dos chefes)
			lair.last = { kind: 'giovanni', item: prize };
			lair.gained.push(prize);
			const level = data.level + 2;
			const list = GIOVANNI_SPECIES.filter(name => inTheme(name, run.settings.theme));
			const species: string[] = [];
			const size = bossTeamSize(run.act, prng);
			for (let guard = 0; species.length < size && guard < size * 20; guard++) {
				const pick = randomSpeciesForLevel(prng, level, list.length ? list : null, null, run.settings.theme);
				if (!species.includes(pick) || list.length < size) species.push(pick);
			}
			return {
				battle: { kind: 'trainer', species, level, name: 'Boss Giovanni', avatar: 'giovanni', ai: 'boss', resume: true },
				reward: { items: [prize] },
			};
		}
		if (choice !== 'left' && choice !== 'right') return null;
		lair.step++;
		const roll = prng.random(100);
		if (roll < 60) {
			lair.last = { kind: 'battle' };
			const size = opponentTeamSize('trainer', nodeProgress(run.settings, run.act, node.floor), prng);
			return { battle: rocketBattle(rocketTeam(run, node, prng, size, data.level), data.level, prng.random(2) === 1, true) };
		}
		if (roll < 90) {
			const item = lairItem(run, prng);
			lair.last = { kind: 'item', item };
			lair.gained.push(item);
			run.items.push(item);
			return { stay: true };
		}
		lair.last = { kind: 'empty' };
		return { stay: true };
	},
	result({ TL, data }, choice) {
		const lair: LairState = data.lair;
		if (!lair.inside) return TL`You decide not to risk it.`;
		const count = lair.gained.length;
		return count ? TL`You leave the hideout with ${count} item(s) found inside.` : TL`You leave the hideout empty-handed.`;
	},
});
