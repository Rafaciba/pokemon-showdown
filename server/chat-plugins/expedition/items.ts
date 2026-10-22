/**
 * pokemon-showdown-custom: itens da Expedição.
 *
 * Itens de segurar oferecidos nos nós de item (decisão do usuário: o jogador escolhe 1
 * entre 3) e, depois, na loja. A lista é escolha nossa: itens úteis em batalhas
 * individuais, sem Z-Crystals e itens de uma espécie só. Os itens ficam na mochila da
 * run (`run.items`, pelo nome) e vão e voltam dos Pokémon (runs.ts → setHeldItem).
 *
 * Mega Stones (decisão do usuário): item raro. No nó de item, uma das três opções vira
 * Mega Stone com `MEGA_STONE_CHANCE`% de chance, de preferência uma que algum Pokémon do
 * time (ou a evolução dele) usa. Se entra na loja e em eventos fica para depois.
 *
 * Recompensa da elite (etapa 7, como as relíquias das elites do Slay the Spire): um item
 * que vai direto para a mochila, Mega Stone com `ELITE_MEGA_STONE_CHANCE`% de chance
 * (decisão do usuário: 25%) e, senão, um item de segurar sorteado.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { RunMon } from './team';

export const HELD_ITEMS: readonly string[] = [
	// Fortes e gerais
	'Leftovers', 'Life Orb', 'Choice Band', 'Choice Specs', 'Choice Scarf', 'Focus Sash', 'Assault Vest',
	'Rocky Helmet', 'Expert Belt', 'Muscle Band', 'Wise Glasses', 'Scope Lens', 'Quick Claw', "King's Rock",
	'Shell Bell', 'Eviolite', 'Light Clay', 'Weakness Policy', 'Heavy-Duty Boots', 'Air Balloon', 'Metronome',
	// Berries
	'Sitrus Berry', 'Lum Berry', 'Oran Berry', 'Chesto Berry',
	// Reforço de um tipo
	'Charcoal', 'Mystic Water', 'Miracle Seed', 'Magnet', 'Never-Melt Ice', 'Black Belt', 'Poison Barb', 'Soft Sand',
	'Sharp Beak', 'Twisted Spoon', 'Silver Powder', 'Hard Stone', 'Spell Tag', 'Dragon Fang', 'Black Glasses',
	'Metal Coat', 'Silk Scarf', 'Fairy Feather',
];

/** Chance (%) de o nó de item oferecer uma Mega Stone (escolha nossa para "item raro"). */
export const MEGA_STONE_CHANCE = 10;

let megaStoneCache: { name: string, users: string[] }[] | null = null;

/** Mega Stones dos dados do PS (as da gen 9 e as antigas da Pokédex completa) e quem as usa. */
export function megaStones() {
	if (!megaStoneCache) {
		megaStoneCache = Dex.items.all()
			.filter(item => item.megaStone && (!item.isNonstandard || item.isNonstandard === 'Past'))
			.map(item => ({ name: item.name, users: Object.keys(item.megaStone!) }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}
	return megaStoneCache;
}

/** Linha evolutiva inteira de uma espécie (pré-evoluções e evoluções). */
function evolutionLine(speciesName: string) {
	let root = Dex.species.get(speciesName);
	for (let guard = 0; root.prevo && guard < 4; guard++) root = Dex.species.get(root.prevo);
	const line = new Set<string>();
	const visit = (name: string) => {
		const species = Dex.species.get(name);
		if (!species.exists || line.has(species.name)) return;
		line.add(species.name);
		line.add(species.baseSpecies);
		species.evos.forEach(visit);
	};
	visit(root.name);
	return line;
}

/** Mega Stone sorteada: de preferência uma que algum Pokémon do time (ou a evolução dele) usa. */
export function pickMegaStone(prng: PRNG, team: RunMon[]): string | null {
	const stones = megaStones();
	if (!stones.length) return null;
	const lines = new Set(team.flatMap(mon => [...evolutionLine(mon.species)]));
	const useful = stones.filter(stone => stone.users.some(user => lines.has(user)));
	const pool = useful.length ? useful : stones;
	return pool[prng.random(pool.length)].name;
}

/** Chance (%) de a recompensa da elite ser uma Mega Stone. */
export const ELITE_MEGA_STONE_CHANCE = 25;

/** Item que a vitória contra a elite dá (sorteado com a semente da run e o nó). */
export function eliteReward(prng: PRNG, team: RunMon[]): string {
	if (prng.random(100) < ELITE_MEGA_STONE_CHANCE) {
		const stone = pickMegaStone(prng, team);
		if (stone) return stone;
	}
	return pickItems(prng, 1)[0];
}

/** Itens diferentes sorteados da lista. */
export function pickItems(prng: PRNG, count: number, pool: readonly string[] = HELD_ITEMS): string[] {
	const options = pool.filter(name => Dex.items.get(name).exists);
	prng.shuffle(options);
	return options.slice(0, count);
}
