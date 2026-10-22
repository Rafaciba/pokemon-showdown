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
 * - Força pelo nível (pedido do usuário depois de um Gyarados nível 20 no andar 4 de
 *   um ato 1): o sorteio não olha só o nível, mas também a força da espécie no estágio
 *   sorteado, pela soma dos atributos base. Acima do teto do nível (`maxBstForLevel`),
 *   sorteia de novo. Não vale para o nó de lendário.
 * - Tema da expedição (decisão do usuário, 2026-10-22): a Pokédex de selvagens,
 *   treinadores e iniciais, por gerações ou por uma lista. As evoluções ficam no tema
 *   (num tema de Kanto, Golbat não vira Crobat). Na lista, cada espécie traz a linha
 *   evolutiva inteira, para o admin não precisar listar cada estágio.
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

/**
 * Tema da expedição: gerações (vazio = todas) ou uma lista de espécies (com a linha
 * evolutiva de cada uma). Com lista, as gerações não contam.
 */
export interface Theme {
	gens: number[];
	species: string[];
}

/** Linha evolutiva inteira de uma espécie (da básica às últimas evoluções). */
export function evolutionLine(speciesName: string): Species[] {
	let base = Dex.species.get(speciesName);
	for (let guard = 0; base.prevo && guard < 4; guard++) base = Dex.species.get(base.prevo);
	const line: Species[] = [];
	const visit = (species: Species, depth: number) => {
		if (!species.exists || depth > 4 || line.includes(species)) return;
		line.push(species);
		for (const evo of species.evos) visit(Dex.species.get(evo), depth + 1);
	};
	visit(base, 0);
	return line;
}

const themeCache = new Map<string, Set<string> | null>();

/** Espécies do tema (ids), ou null quando o tema é a Pokédex inteira. */
export function themeSpecies(theme?: Theme | null): Set<string> | null {
	if (!theme || (!theme.species.length && (!theme.gens.length || theme.gens.length >= 9))) return null;
	const key = JSON.stringify(theme);
	if (themeCache.has(key)) return themeCache.get(key)!;
	const allowed = new Set<string>();
	if (theme.species.length) {
		for (const name of theme.species) {
			for (const species of evolutionLine(name)) allowed.add(species.id);
		}
	} else {
		for (const species of Dex.species.all()) {
			if (theme.gens.includes(species.gen)) allowed.add(species.id);
		}
	}
	themeCache.set(key, allowed);
	return allowed;
}

/** A espécie está no tema. */
export function inTheme(speciesName: string, theme?: Theme | null) {
	const allowed = themeSpecies(theme);
	return !allowed || allowed.has(Dex.species.get(speciesName).id);
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

const themedCache = new Map<string, { basic: string[], legendary: string[] }>();

/**
 * Básicas e lendários de um tema. Num tema, a primeira espécie do tema em cada linha
 * conta como básica (num tema da gen 2, Pichu é a básica do Pikachu; numa lista de
 * linhas, a básica de cada uma).
 */
function themedPools(theme?: Theme | null) {
	const allowed = themeSpecies(theme);
	if (!allowed) return pools();
	const key = JSON.stringify(theme);
	let entry = themedCache.get(key);
	if (entry) return entry;
	const basic: string[] = [];
	const legendary: string[] = [];
	for (const species of Dex.species.all()) {
		if (!eligible(species) || !allowed.has(species.id)) continue;
		if (isLegendary(species)) {
			legendary.push(species.name);
			continue;
		}
		const prevo = species.prevo ? Dex.species.get(species.prevo) : null;
		if (prevo && allowed.has(prevo.id) && eligible(prevo)) continue;
		basic.push(species.name);
	}
	entry = { basic: basic.sort(), legendary: legendary.sort() };
	themedCache.set(key, entry);
	return entry;
}

/** Espécies básicas que podem ser sorteadas, sem lendários (as do tema). */
export function basicSpecies(theme?: Theme | null): readonly string[] {
	return themedPools(theme).basic;
}

/** Lendários, míticos e Ultra Beasts que podem ser sorteados (os do tema). */
export function legendarySpecies(theme?: Theme | null): readonly string[] {
	return themedPools(theme).legendary;
}

/** Evolução por nível (a que o jogador pode fazer): tem nível de evolução e está no tema. */
export function levelEvolutions(speciesName: string, theme?: Theme | null): Species[] {
	const species = Dex.species.get(speciesName);
	return species.evos.map(name => Dex.species.get(name))
		.filter(evo => eligible(evo) && typeof evo.evoLevel === 'number' && inTheme(evo.name, theme));
}

/**
 * Evoluções especiais (troca, pedra, amizade e outras sem nível): as que o jogador faz
 * nos eventos "?" (decisão do usuário), e não por nível. Só as do tema.
 */
export function specialEvolutions(speciesName: string, theme?: Theme | null): string[] {
	const species = Dex.species.get(speciesName);
	return species.evos.map(name => Dex.species.get(name))
		.filter(evo => eligible(evo) && typeof evo.evoLevel !== 'number' && inTheme(evo.name, theme))
		.map(evo => evo.name);
}

/** Nível em que um NPC chega a `evo`, tendo chegado à espécie anterior em `previousLevel`. */
export function npcEvolutionLevel(evo: Species, previousLevel: number) {
	if (typeof evo.evoLevel === 'number') return evo.evoLevel;
	return Math.min(50, Math.max(30, previousLevel + 16));
}

/**
 * Estágio de um NPC no nível: parte da espécie e evolui enquanto o nível permite
 * (com várias evoluções possíveis, sorteia uma; só as do tema).
 */
export function evolveForLevel(prng: PRNG, speciesName: string, level: number, theme?: Theme | null): string {
	let species = Dex.species.get(speciesName);
	let reachedAt = 0;
	for (let guard = 0; guard < 4; guard++) {
		const options = species.evos.map(name => Dex.species.get(name))
			.filter(evo => eligible(evo) && inTheme(evo.name, theme))
			.map(evo => ({ evo, at: npcEvolutionLevel(evo, reachedAt) })).filter(({ at }) => at <= level);
		if (!options.length) break;
		const pick = options[prng.random(options.length)];
		species = pick.evo;
		reachedAt = pick.at;
	}
	return species.name;
}

/** Soma dos atributos base. */
export function baseStatTotal(speciesName: string) {
	const stats = Dex.species.get(speciesName).baseStats;
	return stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
}

/**
 * Teto de força (soma dos atributos base) dos adversários sorteados num nível: 330 até
 * o nível 12 (as espécies básicas comuns), depois 9 pontos por nível. Exemplos: nível
 * 20, 400 (Ivysaur, Monferno; sem Gyarados, 540); nível 30, 490; nível 37, 553;
 * pseudo-lendários (600) a partir do 42. Escolha nossa, ajustável aqui.
 */
export function maxBstForLevel(level: number) {
	return Math.max(330, 220 + 9 * level);
}

const STRENGTH_TRIES = 12;

/**
 * Sorteia uma espécie básica e a leva ao estágio do nível, dentro do teto de força do
 * nível (`cap` null = sem teto). Se nenhuma das tentativas couber, fica a mais fraca.
 * Sem `pool`, sorteia entre as básicas do tema.
 */
export function randomSpeciesForLevel(
	prng: PRNG, level: number, pool?: readonly string[] | null, cap: number | null = maxBstForLevel(level),
	theme?: Theme | null
) {
	const options = pool?.length ? pool : basicSpecies(theme);
	let weakest = '';
	for (let i = 0; i < STRENGTH_TRIES; i++) {
		const species = evolveForLevel(prng, options[prng.random(options.length)], level, theme);
		if (cap === null || baseStatTotal(species) <= cap) return species;
		if (!weakest || baseStatTotal(species) < baseStatTotal(weakest)) weakest = species;
	}
	return weakest;
}
