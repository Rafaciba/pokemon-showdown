/**
 * pokemon-showdown-custom: espécies da Expedição (sorteios e evolução).
 *
 * - Espécies que podem ser sorteadas: as da Pokédex completa da gen 9 (inclusive as
 *   formas regionais), sem formas de batalha (Mega, Gigantamax...), formas cosméticas
 *   e espécies inventadas (CAP).
 * - Lendários: lendários, sub-lendários, míticos e Ultra Beasts. Treinadores nunca
 *   os usam; eles aparecem no nó de lendário e, às vezes, no chefe (decisão do usuário).
 * - Estágio pelo nível (decisão do usuário): o sorteio parte de uma espécie básica e
 *   evolui enquanto o nível permite. Para os NPCs, as evoluções que nos jogos dependem
 *   de troca, amizade, item ou outra mecânica que não temos acontecem num nível
 *   próprio: o nível em que a espécie anterior apareceu mais 16, no mínimo 30 e no
 *   máximo 50 (Kadabra → Alakazam no 32, Eevee → evoluções no 30).
 * - O jogador só evolui por nível (e escolhe); as evoluções especiais dele vêm de nós
 *   de evento (etapa 3).
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import type { Species } from '../../../sim/dex-species';

const LEGENDARY_TAGS = ['Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast'];
/** Formas que não são espécies próprias para sorteio. */
const SKIPPED_FORMES = /^(Totem|Gmax|Starter|Eternamax|Mega|Primal|Busted|Crowned|Stellar|Terastal)/;

export function isLegendary(species: Species) {
	return LEGENDARY_TAGS.some(tag => (species.tags as string[]).includes(tag));
}

function eligible(species: Species) {
	if (!species.exists || species.num <= 0 || species.battleOnly) return false;
	if (species.isNonstandard && species.isNonstandard !== 'Past') return false;
	if (species.forme && SKIPPED_FORMES.test(species.forme)) return false;
	// Pikachu de boné e afins: formas cosméticas de evento
	const regional = /^(Alola|Galar|Hisui|Paldea)/.test(species.forme);
	if (species.baseSpecies === 'Pikachu' && species.forme && !regional) return false;
	// Formas que mudam só por item ou em batalha (Arceus-Fire, Silvally-Water...)
	if (species.requiredItem || species.requiredItems?.length || species.requiredAbility) return false;
	if (species.changesFrom && !['Alola', 'Galar', 'Hisui', 'Paldea'].some(region => species.forme.startsWith(region))) {
		return false;
	}
	return true;
}

let cache: { basic: string[], legendary: string[] } | null = null;

function pools() {
	if (cache) return cache;
	const basic: string[] = [];
	const legendary: string[] = [];
	for (const species of Dex.species.all()) {
		if (!eligible(species)) continue;
		if (isLegendary(species)) {
			legendary.push(species.name);
		} else if (!species.prevo) {
			basic.push(species.name);
		}
	}
	cache = { basic: basic.sort(), legendary: legendary.sort() };
	return cache;
}

/** Espécies básicas (sem pré-evolução) que podem ser sorteadas, sem lendários. */
export function basicSpecies(): readonly string[] {
	return pools().basic;
}

/** Lendários, míticos e Ultra Beasts que podem ser sorteados. */
export function legendarySpecies(): readonly string[] {
	return pools().legendary;
}

/** Evolução por nível (a que o jogador pode fazer): tem nível de evolução. */
export function levelEvolutions(speciesName: string): Species[] {
	const species = Dex.species.get(speciesName);
	return species.evos.map(name => Dex.species.get(name))
		.filter(evo => eligible(evo) && typeof evo.evoLevel === 'number');
}

/** Nível em que um NPC chega a `evo`, tendo chegado à espécie anterior em `previousLevel`. */
export function npcEvolutionLevel(evo: Species, previousLevel: number) {
	if (typeof evo.evoLevel === 'number') return evo.evoLevel;
	return Math.min(50, Math.max(30, previousLevel + 16));
}

/**
 * Estágio de um NPC no nível: parte da espécie e evolui enquanto o nível permite
 * (com várias evoluções possíveis, sorteia uma).
 */
export function evolveForLevel(prng: PRNG, speciesName: string, level: number): string {
	let species = Dex.species.get(speciesName);
	let reachedAt = 0;
	for (let guard = 0; guard < 4; guard++) {
		const options = species.evos.map(name => Dex.species.get(name)).filter(eligible)
			.map(evo => ({ evo, at: npcEvolutionLevel(evo, reachedAt) })).filter(({ at }) => at <= level);
		if (!options.length) break;
		const pick = options[prng.random(options.length)];
		species = pick.evo;
		reachedAt = pick.at;
	}
	return species.name;
}

/** Sorteia uma espécie básica e a leva ao estágio do nível. */
export function randomSpeciesForLevel(prng: PRNG, level: number, pool: readonly string[] = basicSpecies()) {
	return evolveForLevel(prng, pool[prng.random(pool.length)], level);
}
