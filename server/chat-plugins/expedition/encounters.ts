/**
 * pokemon-showdown-custom: encontros com batalha da Expedição.
 *
 * O encontro de um nó (selvagem, treinador, elite, chefe ou lendário) é sorteado com a
 * semente da run e o nó: é o mesmo depois de uma interrupção. O chefe de cada ato segue
 * a configuração da expedição (etapa 7): gerado, sorteado da seleção do banco do
 * Desafio ou um treinador escolhido, ajustado ao poder do ato (bank.ts). A elite é um
 * treinador forte: um Pokémon a mais, um nível acima e a IA um nível acima. Nos
 * demais, a fonte dos adversários sai das chances da variação:
 *   - "pokedex": espécies sorteadas, no estágio do nível (species.ts);
 *   - "gym": treinadores do banco do Desafio de Ginásios, no nível do andar;
 *   - "pool": as listas próprias da variação.
 * Treinadores nunca usam lendários; o chefe às vezes tem um (bossLegendaryChance);
 * o nó de lendário é uma batalha contra um lendário.
 *
 * @license MIT
 */
import { Teams } from '../../../sim/teams';
import type { PRNG } from '../../../sim/prng';
import type { AILevel } from '../gym-challenge/levels';
import { getStore as getGymStore } from '../gym-challenge/state';
import { isTrainerSprite } from '../gym-challenge/trainer-sprites';
import { seededRandom, weightedPick } from './random';
import { createMon, type RunMon } from './team';
import {
	baseStatTotal, evolveForLevel, inTheme, isLegendary, legendarySpecies, maxBstForLevel, randomSpeciesForLevel,
	type Theme,
} from './species';
import { nodeProgress, opponentLevel, opponentTeamSize } from './progression';
import type { EncounterKind, ExpeditionVariant, OpponentSource } from './variant';
import type { ExpeditionRun } from './store';
import type { MapNode } from './map';
import type { EventBattle } from './events';
import { bankBoss } from './bank';

export interface Encounter {
	kind: EncounterKind;
	source: OpponentSource;
	/** Nome do adversário na batalha. */
	name: string;
	avatar: string;
	/** Adversários (para a página e a experiência). */
	team: RunMon[];
	/** Time compactado para a batalha. */
	packed: string;
	aiLevel: AILevel;
	doubles: boolean;
	/** Bônus de experiência de treinador (1,5 vez). */
	trainer: boolean;
}

/** Classes de treinador dos encontros sorteados (nome na batalha e sprite oficial). */
const TRAINER_CLASSES: [string, string][] = [
	['Youngster', 'youngster'], ['Lass', 'lass'], ['Hiker', 'hiker'], ['Bug Catcher', 'bugcatcher'],
	['Picnicker', 'picnicker'], ['Camper', 'camper'], ['Fisherman', 'fisherman'], ['Black Belt', 'blackbelt'],
	['Beauty', 'beauty'], ['Gentleman', 'gentleman'], ['Psychic', 'psychic'], ['Scientist', 'scientist'],
	['Bird Keeper', 'birdkeeper'], ['Swimmer', 'swimmer'], ['Sailor', 'sailor'], ['Backpacker', 'backpacker'],
	['Pokémon Ranger', 'pokemonranger'], ['Battle Girl', 'battlegirl'], ['Juggler', 'juggler'], ['Ninja Boy', 'ninjaboy'],
];
const BOSS_CLASSES: [string, string][] = [
	['Ace Trainer', 'acetrainer'], ['Ace Trainer', 'acetrainerf'], ['Veteran', 'veteran'], ['Veteran', 'veteranf'],
	['Dragon Tamer', 'dragontamer'], ['Ruin Maniac', 'ruinmaniac'],
];

/**
 * "Avatar" do lado dos selvagens e lendários: o mato alto (sprite próprio, em
 * assets/sprites/trainers-custom do repo raiz, servido pelo Caddy), no lugar de um
 * sprite de treinador.
 */
export const WILD_AVATAR = '#expeditiongrass';

function packTeam(team: RunMon[], evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }) {
	return Teams.pack(team.map(mon => ({
		name: mon.species, species: mon.species, item: mon.item, ability: mon.ability,
		moves: mon.moves.map(id => Dex.moves.get(id).name), nature: mon.nature, gender: mon.gender,
		evs: { ...evs }, ivs: { ...mon.ivs }, level: mon.level, shiny: mon.shiny || undefined,
	}) as any));
}

/**
 * Selvagem shiny (etapa 8): 1 em `shinyOdds` (decisão do usuário: configurável, padrão
 * 1/4096, como nos jogos). Sorteio próprio, para não mudar o resto do encontro.
 */
function rollShiny(run: ExpeditionRun, node: MapNode, team: RunMon[]) {
	const odds = run.settings.rules.shinyOdds || 0;
	if (odds <= 0 || !team[0]) return team;
	const prng = seededRandom(run.seed, `shiny:${run.act}:${node.id}`);
	if (prng.random(odds) === 0) team[0] = { ...team[0], shiny: true };
	return team;
}

function pickClass(prng: PRNG, classes: [string, string][]) {
	const [name, avatar] = classes[prng.random(classes.length)];
	return { name, avatar: isTrainerSprite(avatar) ? avatar : '' };
}

/** Time sorteado: espécies diferentes (do tema), no estágio do nível, com golpes do nível. */
function randomTeam(prng: PRNG, size: number, level: number, pool?: readonly string[], theme?: Theme): RunMon[] {
	const team: RunMon[] = [];
	const used = new Set<string>();
	for (let guard = 0; team.length < size && guard < size * 20; guard++) {
		const species = randomSpeciesForLevel(prng, level, pool, undefined, theme);
		if (used.has(species)) continue;
		used.add(species);
		team.push(createMon(prng, species, level, `o${team.length}`));
	}
	return team;
}

/** Treinador do banco do Desafio: o time dele (ou parte, só os do tema), no nível do andar. Null se não houver. */
function gymTrainer(prng: PRNG, size: number, level: number, allowLegendary: boolean, theme?: Theme) {
	let trainers;
	try {
		trainers = getGymStore().listTrainers().filter(trainer => !trainer.doubles && trainer.team);
	} catch {
		return null;
	}
	// Só os Pokémon dentro do teto de força do nível (species.ts); sem nenhum, o treinador fica de fora
	const cap = maxBstForLevel(level);
	const fitting = (team: string) => (Teams.unpack(team) || [])
		.filter(set => baseStatTotal(set.species) <= cap && inTheme(set.species, theme));
	const candidates = trainers.filter(trainer => {
		const sets = Teams.unpack(trainer.team) || [];
		return fitting(trainer.team).length &&
			(allowLegendary || !sets.some(set => isLegendary(Dex.species.get(set.species))));
	});
	if (!candidates.length) return null;
	const trainer = candidates[prng.random(candidates.length)];
	const sets = fitting(trainer.team).slice(0, size).map(set => ({ ...set, level }));
	const team = sets.map((set, i) => ({
		...createMon(prng, set.species, level, `o${i}`), moves: set.moves.map(move => Dex.moves.get(move).id),
	}));
	return {
		name: [trainer.title, trainer.name].filter(Boolean).join(' '),
		avatar: trainer.avatar, team, packed: Teams.pack(sets),
	};
}

/**
 * Encontro de uma batalha começada por um evento "?" (events.ts): as espécies e o nível
 * vêm do evento; o resto (golpes, IVs, natureza) sai da semente da run e do nó.
 */
export function encounterFromSpec(run: ExpeditionRun, variant: ExpeditionVariant, node: MapNode, spec: EventBattle) {
	const prng = seededRandom(run.seed, `eventbattle:${run.act}:${node.id}`);
	const team = spec.species.map((species, i) => createMon(prng, species, spec.level, `o${i}`));
	const progress = nodeProgress(run.settings, run.act, node.floor);
	const aiLevel = spec.ai === 'hard' ? 'hard' : variant.aiLevel(spec.kind, progress, run.act);
	const avatar = spec.kind === 'wild' ? WILD_AVATAR : isTrainerSprite(spec.avatar) ? spec.avatar : '';
	return {
		kind: spec.kind, source: 'pokedex', name: spec.name, avatar, team, packed: packTeam(team), aiLevel,
		doubles: false, trainer: spec.kind === 'trainer',
	} as Encounter;
}

/** Treinador do banco escolhido para o chefe do ato (ou sorteado da seleção); null = gerado. */
function bossTrainerId(run: ExpeditionRun, prng: PRNG): number | null {
	const bosses = run.settings.bosses;
	const slot = bosses?.acts[run.act - 1];
	if (typeof slot === 'number') return slot;
	if (slot === 'pool' && bosses!.pool.length) return bosses!.pool[prng.random(bosses!.pool.length)];
	return null;
}

export function generateEncounter(run: ExpeditionRun, variant: ExpeditionVariant, node: MapNode): Encounter | null {
	const kind = node.type as EncounterKind;
	if (!['wild', 'trainer', 'elite', 'boss', 'legendary'].includes(kind)) return null;
	const prng = seededRandom(run.seed, `encounter:${run.act}:${node.id}`);
	const settings = run.settings;
	const progress = nodeProgress(settings, run.act, node.floor);
	const level = opponentLevel(settings, run.act, node.floor, prng, kind);
	const size = opponentTeamSize(kind, progress, prng, run.act);
	const aiLevel = variant.aiLevel(kind, progress, run.act);
	const pool = variant.pool;
	const theme = settings.theme;
	let source: OpponentSource = weightedPick(prng, settings.encounters[kind] || {}) || 'pokedex';
	if (source === 'pool' && !pool) source = 'pokedex';
	const base = { kind, aiLevel, doubles: false, trainer: kind === 'trainer' || kind === 'elite' || kind === 'boss' };

	// Chefe do banco (escolhido ou sorteado); se o treinador não existe mais, o chefe é gerado
	if (kind === 'boss') {
		const trainerId = bossTrainerId(run, prng);
		let trainer = null;
		try {
			trainer = trainerId ? getGymStore().getTrainer(trainerId) : null;
		} catch {}
		const boss = trainer ? bankBoss(prng, trainer, size, level, theme) : null;
		if (boss) return { ...base, source: 'gym', ...boss, avatar: isTrainerSprite(boss.avatar) ? boss.avatar : '' };
	}

	const legends = legendarySpecies(theme);
	if (kind === 'legendary' && legends.length) {
		const species = evolveForLevel(prng, legends[prng.random(legends.length)], level, theme);
		const team = rollShiny(run, node, [createMon(prng, species, level, 'o0')]);
		return { ...base, source: 'pokedex', name: `Wild ${species}`, avatar: WILD_AVATAR, team, packed: packTeam(team) };
	}
	// Tema sem lendários (o painel não deixa abrir assim): o nó vira um selvagem comum
	if (kind === 'wild' || kind === 'legendary') {
		const team = rollShiny(run, node, randomTeam(prng, 1, level, source === 'pool' ? pool!.species : undefined, theme));
		const species = team[0].species;
		return { ...base, source: source === 'gym' ? 'pokedex' : source, name: `Wild ${species}`, avatar: WILD_AVATAR, team,
			packed: packTeam(team) };
	}
	if (source === 'gym') {
		const trainer = gymTrainer(prng, size, level, kind === 'boss', theme);
		if (trainer) return { ...base, source, ...trainer };
		source = 'pokedex';
	}
	if (source === 'pool' && pool!.trainers.length) {
		const entry = pool!.trainers[prng.random(pool!.trainers.length)];
		const team = randomTeam(prng, Math.min(size, entry.species.length), level, entry.species, theme);
		return { ...base, source, name: entry.name, avatar: isTrainerSprite(entry.avatar) ? entry.avatar : '', team,
			packed: packTeam(team) };
	}
	const team = randomTeam(prng, size, level, source === 'pool' ? pool!.species : undefined, theme);
	// O chefe às vezes tem um lendário (decisão do usuário: pode ter, mas não é comum)
	if (kind === 'boss' && legends.length && prng.random(100) < (settings.extra.bossLegendaryChance || 0)) {
		const species = evolveForLevel(prng, legends[prng.random(legends.length)], level, theme);
		team[team.length - 1] = createMon(prng, species, level, `o${team.length - 1}`);
	}
	const who = pickClass(prng, kind === 'boss' || kind === 'elite' ? BOSS_CLASSES : TRAINER_CLASSES);
	return { ...base, source, ...who, team, packed: packTeam(team) };
}
