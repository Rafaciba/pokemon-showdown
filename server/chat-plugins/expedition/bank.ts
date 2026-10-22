/**
 * pokemon-showdown-custom: chefes do banco de treinadores do Desafio de Ginásios, ajustados
 * ao poder do ato (etapa 7; decisão do usuário, 2026-10-22).
 *
 * O treinador cadastrado tem um time pensado para o nível 100. Na Expedição, cada
 * Pokémon dele vai para o nível do chefe e:
 *   - volta ao estágio que um NPC teria nesse nível (Dragonite no 35 vira Dragonair; as
 *     evoluções sem nível seguem a regra dos NPCs de species.ts);
 *   - fica com os golpes do set que esse estágio aprende (por qualquer meio, nele ou
 *     numa pré-evolução); os que faltam são completados com os golpes do nível;
 *   - fica com a habilidade, se o estágio a tiver (senão, a do mesmo espaço);
 *   - perde a Mega Stone que não serve ao estágio;
 *   - mantém natureza, EVs, IVs e item do set (escolhas do admin).
 * Fica no tema da expedição: o Pokémon fora do tema sai, e o time é completado com
 * espécies sorteadas do tema (do tipo do treinador, se ele tiver um). O time é cortado
 * no tamanho do chefe do ato, na ordem do cadastro.
 *
 * @license MIT
 */
import { Teams, type PokemonSet } from '../../../sim/teams';
import type { PRNG } from '../../../sim/prng';
import type { Trainer } from '../gym-challenge/store';
import { createMon, levelUpMoves, type RunMon } from './team';
import { basicSpecies, inTheme, npcEvolutionLevel, randomSpeciesForLevel, type Theme } from './species';

/** Nível em que um NPC chega à espécie (a básica, no 1). */
export function npcStageLevel(speciesName: string): number {
	const species = Dex.species.get(speciesName);
	if (!species.prevo) return 1;
	return npcEvolutionLevel(species, npcStageLevel(species.prevo));
}

/** Estágio da linha evolutiva que um NPC teria no nível (volta às pré-evoluções). */
export function stageForLevel(speciesName: string, level: number): string {
	let species = Dex.species.get(speciesName);
	for (let guard = 0; species.prevo && npcStageLevel(species.name) > level && guard < 4; guard++) {
		species = Dex.species.get(species.prevo);
	}
	return species.name;
}

/** A espécie aprende o golpe por algum meio (nela ou numa pré-evolução; formas sem learnset usam o da base). */
export function canLearn(speciesName: string, moveId: string): boolean {
	let species = Dex.species.get(speciesName);
	for (let guard = 0; species.exists && guard < 5; guard++) {
		let learnset = Dex.species.getLearnsetData(species.id).learnset;
		if (!learnset && species.baseSpecies !== species.name) {
			learnset = Dex.species.getLearnsetData(toID(species.baseSpecies)).learnset;
		}
		if (learnset?.[moveId]) return true;
		if (!species.prevo) break;
		species = Dex.species.get(species.prevo);
	}
	return false;
}

/** Set do banco levado ao nível (ver o topo do arquivo); null se a espécie sai do tema. */
export function adjustSet(set: PokemonSet, level: number, theme?: Theme | null): PokemonSet | null {
	const original = Dex.species.get(set.species);
	if (!original.exists) return null;
	const stage = Dex.species.get(stageForLevel(original.name, level));
	if (!inTheme(stage.name, theme)) return null;
	const moves = set.moves.map(move => Dex.moves.get(move)).filter(move => move.exists && canLearn(stage.name, move.id))
		.map(move => move.name);
	for (const move of levelUpMoves(stage.name, level).reverse()) {
		if (moves.length >= Math.max(1, Math.min(4, set.moves.length || 4))) break;
		const name = Dex.moves.get(move).name;
		if (!moves.includes(name)) moves.push(name);
	}
	const abilities = Object.values(stage.abilities) as string[];
	let ability = set.ability;
	if (!abilities.includes(ability)) {
		const slot = (Object.keys(original.abilities) as (keyof typeof original.abilities)[])
			.find(key => original.abilities[key] === set.ability);
		ability = (slot && stage.abilities[slot]) || stage.abilities[0];
	}
	const item = Dex.items.get(set.item);
	const keepItem = !item.megaStone || Object.keys(item.megaStone).includes(stage.name);
	return {
		...set, name: stage.name, species: stage.name, ability, moves, level,
		item: keepItem ? set.item : '',
	};
}

/** RunMon que corresponde a um set (para a página e a experiência). */
function monFromSet(prng: PRNG, set: PokemonSet, uid: string): RunMon {
	const mon = createMon(prng, set.species, set.level, uid);
	return {
		...mon, moves: set.moves.map(move => Dex.moves.get(move).id), ability: set.ability || mon.ability,
		item: set.item || '', nature: set.nature || mon.nature, ivs: { ...mon.ivs, ...set.ivs },
	};
}

export interface BankBoss {
	name: string;
	avatar: string;
	team: RunMon[];
	packed: string;
}

/**
 * Chefe a partir de um treinador do banco: o time ajustado ao nível, no tema e no
 * tamanho do ato. Null se o treinador está sem time.
 */
export function bankBoss(
	prng: PRNG, trainer: Pick<Trainer, 'name' | 'title' | 'type' | 'team' | 'avatar'>, size: number, level: number,
	theme?: Theme | null
): BankBoss | null {
	if (!trainer.team) return null;
	const sets: PokemonSet[] = [];
	for (const set of Teams.unpack(trainer.team) || []) {
		if (sets.length >= size) break;
		const adjusted = adjustSet(set, level, theme);
		if (adjusted && !sets.some(entry => entry.species === adjusted.species)) sets.push(adjusted);
	}
	// Completa com espécies do tema (do tipo do treinador, se houver)
	const type = trainer.type;
	const typed = type ? basicSpecies(theme).filter(name => Dex.species.get(name).types.includes(type)) : [];
	for (let guard = 0; sets.length < size && guard < size * 20; guard++) {
		const species = randomSpeciesForLevel(prng, level, typed.length ? typed : null, undefined, theme);
		if (sets.some(entry => entry.species === species)) continue;
		const mon = createMon(prng, species, level, 'fill');
		sets.push({
			name: species, species, item: '', ability: mon.ability, moves: mon.moves.map(move => Dex.moves.get(move).name),
			nature: mon.nature, gender: mon.gender, evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
			ivs: { ...mon.ivs }, level,
		});
	}
	if (!sets.length) return null;
	return {
		name: [trainer.title, trainer.name].filter(Boolean).join(' '),
		avatar: trainer.avatar,
		team: sets.map((set, i) => monFromSet(prng, set, `o${i}`)),
		packed: Teams.pack(sets),
	};
}
