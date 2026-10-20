/**
 * pokemon-showdown-custom: pacotes de treinadores e desafios (importar e exportar).
 *
 * Um pacote é um JSON que leva treinadores e desafios de um servidor para outro
 * (do ambiente local para a VPS, por exemplo) pelo painel admin. Os treinadores são
 * referenciados pelo nome; os times vão no formato de exportação do teambuilder.
 *
 * A importação passa pelas mesmas validações dos formulários do painel e nunca
 * altera o que já existe: treinadores e desafios com nome já cadastrado são
 * pulados (o desafio importado usa o treinador que já está no banco), e os
 * desafios entram como rascunho. Qualquer erro no pacote impede a importação
 * inteira. Sem HTML: as páginas ficam em admin.ts. Formato do arquivo em
 * docs/pacotes-ginasios.md (repo pokemon-showdown-custom).
 *
 * @license MIT
 */
import { TLkey } from '../../../sim/dex-text';
import type { Challenge, ChallengeInput, GymStore, PoolEntry, Stage, StageKind, Trainer, TrainerInput } from './store';
import { checkName, ELITE4_SIZE, hasForbiddenChars, TITLE_MAX_LENGTH, type Problem } from './rules';
import { checkTeamType, importTeam, trainerTypes } from './teams';
import { activeStages, challengeProblems, checkChallengeInput, DEFAULT_CHALLENGE } from './challenges';
import { isAILevel } from './levels';
import { getBadge } from './badges';
import { isTrainerSprite } from './trainer-sprites';

export const PACK_TYPE = 'liga-desafios/ginasios';
export const PACK_VERSION = 1;
export const MAX_PACK_TRAINERS = 200;
export const MAX_PACK_CHALLENGES = 20;

export interface PackTrainer {
	name: string;
	title: string;
	type: string | null;
	doubles: boolean;
	sprite: string;
	/** Time no formato de exportação do teambuilder. */
	team: string;
}

export interface PackStage {
	kind: StageKind;
	position: number;
	/** Nome do treinador (no pacote ou já no banco). */
	trainer: string;
	aiLevel: string | null;
	badge: string | null;
}

export interface PackPoolEntry {
	trainer: string;
	aiLevel: string | null;
	badge: string | null;
}

export type PackChallenge = ChallengeInput & { stages: PackStage[], pool: PackPoolEntry[] };

export interface Pack {
	type: typeof PACK_TYPE;
	version: typeof PACK_VERSION;
	trainers: PackTrainer[];
	challenges: PackChallenge[];
}

const problem = (message: string, ...args: (string | number)[]): Problem => ({ message, args });

// --- Validação de treinador (formulário e importação) ------------------------

export interface TrainerFields {
	name: string;
	title: string;
	type: string | null;
	doubles: boolean;
	avatar: string;
}

/**
 * Valida os campos e o time de um treinador. O time sempre passa pelo validador
 * (Pokémon, itens, habilidades e golpes existentes) e, com tipo, pelo tipo.
 * Devolve o time empacotado quando ele pôde ser lido.
 */
export function checkTrainer(fields: TrainerFields, teamText: string): { team: string | null, problems: Problem[] } {
	const problems = [...checkName(fields.name)];
	if (fields.title.length > TITLE_MAX_LENGTH || /[|,]/.test(fields.title) || hasForbiddenChars(fields.title)) {
		problems.push(problem(
			TLkey`The title can be at most {0} characters long and cannot contain | or ,.`, TITLE_MAX_LENGTH
		));
	}
	if (fields.type && !trainerTypes().includes(fields.type)) problems.push(problem(TLkey`Invalid type.`));
	if (fields.avatar && !isTrainerSprite(fields.avatar)) problems.push(problem(TLkey`Invalid sprite.`));
	const imported = importTeam(teamText);
	if ('error' in imported) return { team: null, problems: [...problems, imported.error] };
	for (const message of checkTeamType(imported.team, fields.type)) {
		problems.push(problem(TLkey`Team of {0}: {1}`, fields.name, message));
	}
	if (fields.doubles && (Teams.unpack(imported.team) || []).length < 2) {
		problems.push(problem(TLkey`A doubles trainer needs at least 2 Pokémon in the team.`));
	}
	return { team: imported.team, problems };
}

// --- Exportação ----------------------------------------------------------------

/** Campos configuráveis do desafio (sem id, situação e datas). */
function challengeInputOf(challenge: Challenge): ChallengeInput {
	return {
		name: challenge.name, baseFormat: challenge.baseFormat, customRules: challenge.customRules,
		typeMode: challenge.typeMode, gymCount: challenge.gymCount, orderMode: challenge.orderMode,
		hasElite4: challenge.hasElite4, teamLock: challenge.teamLock, baseAILevel: challenge.baseAILevel,
		timerMode: challenge.timerMode, turnSeconds: challenge.turnSeconds, lossLimit: challenge.lossLimit,
		eliminateOnElite4Loss: challenge.eliminateOnElite4Loss, eliminateOnChampionLoss: challenge.eliminateOnChampionLoss,
	};
}

/**
 * Pacote com os desafios escolhidos (mais os treinadores que eles usam) e os
 * treinadores avulsos escolhidos. Jornadas, jogadores e conquistas nunca entram.
 */
export function exportPack(
	store: GymStore, challengeIds: number[], trainerIds: number[]
): { pack: Pack } | { error: Problem } {
	const trainers = new Map(store.listTrainers().map(trainer => [trainer.id, trainer]));
	const challenges = challengeIds.map(id => store.getChallenge(id)).filter((c): c is Challenge => !!c);
	const exported = new Set(trainerIds.filter(id => trainers.has(id)));
	const packChallenges: PackChallenge[] = [];
	for (const challenge of challenges) {
		const stages = activeStages(challenge, store.getStages(challenge.id)).filter(stage => stage.trainerId);
		const pool = challenge.typeMode === 'random' ? store.getPool(challenge.id) : [];
		for (const { trainerId } of [...stages, ...pool]) {
			if (trainerId && trainers.has(trainerId)) exported.add(trainerId);
		}
		const nameOf = (id: number | null) => trainers.get(id!)?.name || '';
		packChallenges.push({
			...challengeInputOf(challenge),
			stages: stages.filter(stage => trainers.has(stage.trainerId!)).map(stage => ({
				kind: stage.kind, position: stage.position, trainer: nameOf(stage.trainerId),
				aiLevel: stage.aiLevel, badge: stage.badgeId,
			})),
			pool: pool.filter(entry => trainers.has(entry.trainerId)).map(entry => ({
				trainer: nameOf(entry.trainerId), aiLevel: entry.aiLevel, badge: entry.badgeId,
			})),
		});
	}
	// Os treinadores são referenciados pelo nome: dois com o mesmo nome seriam ambíguos
	const seen = new Set<ID>();
	for (const id of exported) {
		const trainer = trainers.get(id)!;
		if (seen.has(toID(trainer.name))) {
			const message = TLkey`Two exported trainers are named {0}. Rename one of them before exporting.`;
			return { error: problem(message, trainer.name) };
		}
		seen.add(toID(trainer.name));
	}
	const packTrainers = [...exported].map(id => trainers.get(id)!)
		.sort((a, b) => a.name.localeCompare(b.name))
		.map(trainer => ({
			name: trainer.name, title: trainer.title, type: trainer.type, doubles: trainer.doubles, sprite: trainer.avatar,
			team: Teams.export(Teams.unpack(trainer.team) || []).trim(),
		}));
	return { pack: { type: PACK_TYPE, version: PACK_VERSION, trainers: packTrainers, challenges: packChallenges } };
}

// --- Importação ----------------------------------------------------------------

export interface TrainerPlan {
	name: string;
	/** create = entra no banco; skip = já existe um treinador com esse nome. */
	action: 'create' | 'skip';
	problems: Problem[];
	/** Pronto para gravar (só com action = create e sem problemas). */
	input: TrainerInput | null;
	/** Com action = skip: os treinadores do banco com esse nome (os desafios usam o do banco). */
	existing: Trainer[];
}

export interface ChallengePlan {
	name: string;
	action: 'create' | 'skip';
	problems: Problem[];
	/** O que falta para o desafio poder ser aberto (ele entra como rascunho mesmo assim). */
	notReady: Problem[];
	input: ChallengeInput | null;
	stages: PackStage[];
	pool: PackPoolEntry[];
}

export interface ImportPlan {
	/** Problemas do pacote como um todo (JSON inválido, tipo ou versão). */
	problems: Problem[];
	trainers: TrainerPlan[];
	challenges: ChallengePlan[];
}

type JsonObject = { [key: string]: unknown };

const isObject = (value: unknown): value is JsonObject =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const has = (object: JsonObject, key: string) => Object.prototype.hasOwnProperty.call(object, key);

/**
 * Leitura de campos de um objeto do pacote, com o valor padrão quando o campo
 * não vem. Valor de tipo errado vira problema ("Invalid value in ...").
 */
class FieldReader {
	readonly problems: Problem[] = [];
	private readonly object: JsonObject;
	private readonly where: string;
	constructor(object: JsonObject, where: string) {
		this.object = object;
		this.where = where;
	}

	private invalid(key: string) {
		this.problems.push(problem(TLkey`Invalid value in "{0}".`, `${this.where}.${key}`));
	}

	string(key: string, fallback: string) {
		if (!has(this.object, key)) return fallback;
		const value = this.object[key];
		if (typeof value === 'string') return value;
		this.invalid(key);
		return fallback;
	}

	/** Texto opcional: ausente ou null = null. */
	nullableString(key: string) {
		if (!has(this.object, key) || this.object[key] === null) return null;
		return this.string(key, '');
	}

	boolean(key: string, fallback: boolean) {
		if (!has(this.object, key)) return fallback;
		const value = this.object[key];
		if (typeof value === 'boolean') return value;
		this.invalid(key);
		return fallback;
	}

	integer(key: string, fallback: number) {
		if (!has(this.object, key)) return fallback;
		const value = this.object[key];
		if (Number.isInteger(value)) return value as number;
		this.invalid(key);
		return fallback;
	}

	nullableInteger(key: string, fallback: number | null) {
		if (has(this.object, key) && this.object[key] === null) return null;
		return has(this.object, key) ? this.integer(key, 0) : fallback;
	}

	oneOf<T extends string>(key: string, values: readonly T[], fallback: T): T {
		const value = this.string(key, fallback);
		if ((values as readonly string[]).includes(value)) return value as T;
		this.invalid(key);
		return fallback;
	}

	array(key: string): unknown[] {
		if (!has(this.object, key)) return [];
		const value = this.object[key];
		if (Array.isArray(value)) return value;
		this.invalid(key);
		return [];
	}
}

/** Nome do treinador como chave de comparação (mesma regra dos nomes de desafio). */
const nameKey = (name: string) => toID(name);

/** Lê o JSON do pacote. Erros de estrutura vão para plan.problems. */
function readPack(text: string): { trainers: unknown[], challenges: unknown[], problems: Problem[] } {
	const empty = { trainers: [], challenges: [] };
	let data: unknown;
	try {
		data = JSON.parse(text);
	} catch (err: any) {
		return { ...empty, problems: [problem(TLkey`The pack is not valid JSON: {0}`, String(err.message))] };
	}
	if (!isObject(data) || data.type !== PACK_TYPE) {
		return { ...empty, problems: [problem(TLkey`This is not a Gym Challenge pack.`)] };
	}
	if (data.version !== PACK_VERSION) {
		return { ...empty, problems: [problem(TLkey`Unsupported pack version: {0}.`, String(data.version))] };
	}
	const fields = new FieldReader(data, 'pack');
	const trainers = fields.array('trainers');
	const challenges = fields.array('challenges');
	const problems = fields.problems;
	if (trainers.length > MAX_PACK_TRAINERS) {
		problems.push(problem(TLkey`A pack can have at most {0} trainers.`, MAX_PACK_TRAINERS));
	}
	if (challenges.length > MAX_PACK_CHALLENGES) {
		problems.push(problem(TLkey`A pack can have at most {0} challenges.`, MAX_PACK_CHALLENGES));
	}
	if (problems.length) return { ...empty, problems };
	if (!trainers.length && !challenges.length) problems.push(problem(TLkey`The pack is empty.`));
	return { trainers, challenges, problems };
}

function planTrainer(raw: unknown, index: number, bank: Map<ID, Trainer[]>, seen: Set<ID>): TrainerPlan {
	const where = `trainers[${index}]`;
	if (!isObject(raw)) {
		return {
			name: where, action: 'create', problems: [problem(TLkey`Invalid value in "{0}".`, where)], input: null, existing: [],
		};
	}
	const fields = new FieldReader(raw, where);
	const name = fields.string('name', '').trim();
	const plan: TrainerPlan = {
		name: name || where, action: 'create', problems: fields.problems, input: null, existing: [],
	};
	if (name && seen.has(nameKey(name))) {
		plan.problems.push(problem(TLkey`The pack has more than one trainer named {0}.`, name));
		return plan;
	}
	if (name) seen.add(nameKey(name));
	// Já existe no banco: fica como está (o pacote não altera treinadores)
	if (name && bank.get(nameKey(name))?.length) {
		plan.action = 'skip';
		plan.existing = bank.get(nameKey(name))!;
		return plan;
	}
	const trainerFields: TrainerFields = {
		name,
		title: fields.string('title', '').trim(),
		type: fields.nullableString('type')?.trim() || null,
		doubles: fields.boolean('doubles', false),
		avatar: fields.string('sprite', '').trim(),
	};
	const teamText = fields.string('team', '');
	if (fields.problems.length) return plan;
	const { team, problems } = checkTrainer(trainerFields, teamText);
	plan.problems.push(...problems);
	if (!plan.problems.length && team) plan.input = { ...trainerFields, team };
	return plan;
}

const STAGE_KINDS = ['gym', 'elite4', 'champion'] as const;

/** Treinador de uma etapa: do pacote (com id provisório negativo) ou do banco; ou o motivo de não achar. */
type ResolvedTrainer = { trainer: Trainer } | Problem;

function planChallenge(
	raw: unknown, index: number, existing: Challenge[], seen: Set<ID>,
	resolve: (name: string) => ResolvedTrainer, trainerMap: Map<number, Trainer>
): ChallengePlan {
	const where = `challenges[${index}]`;
	const plan: ChallengePlan = {
		name: where, action: 'create', problems: [], notReady: [], input: null, stages: [], pool: [],
	};
	if (!isObject(raw)) {
		plan.problems.push(problem(TLkey`Invalid value in "{0}".`, where));
		return plan;
	}
	const fields = new FieldReader(raw, where);
	const d = DEFAULT_CHALLENGE;
	const timerMode = fields.oneOf('timerMode', ['free', 'turn'] as const, d.timerMode);
	const input: ChallengeInput = {
		name: fields.string('name', '').trim(),
		baseFormat: toID(fields.string('baseFormat', d.baseFormat)),
		customRules: fields.string('customRules', d.customRules)
			.split(',').map(rule => rule.trim()).filter(Boolean).join(', '),
		typeMode: fields.oneOf('typeMode', ['fixed', 'random'] as const, d.typeMode),
		gymCount: fields.integer('gymCount', d.gymCount),
		orderMode: fields.oneOf('orderMode', ['free', 'fixed'] as const, d.orderMode),
		hasElite4: fields.boolean('hasElite4', d.hasElite4),
		teamLock: fields.boolean('teamLock', d.teamLock),
		baseAILevel: fields.string('baseAILevel', d.baseAILevel),
		timerMode,
		turnSeconds: timerMode === 'turn' ? fields.nullableInteger('turnSeconds', null) : null,
		lossLimit: fields.nullableInteger('lossLimit', d.lossLimit),
		eliminateOnElite4Loss: fields.boolean('eliminateOnElite4Loss', d.eliminateOnElite4Loss),
		eliminateOnChampionLoss: fields.boolean('eliminateOnChampionLoss', d.eliminateOnChampionLoss),
	};
	plan.name = input.name || where;
	const rawStages = fields.array('stages');
	const rawPool = fields.array('pool');
	plan.problems.push(...fields.problems);
	if (input.name && seen.has(nameKey(input.name))) {
		plan.problems.push(problem(TLkey`The pack has more than one challenge named {0}.`, input.name));
		return plan;
	}
	if (input.name) seen.add(nameKey(input.name));
	// Já existe um desafio com esse nome: fica como está
	if (input.name && existing.some(c => nameKey(c.name) === nameKey(input.name))) {
		plan.action = 'skip';
		plan.problems = [];
		return plan;
	}
	if (plan.problems.length) return plan;
	plan.problems.push(...checkChallengeInput(input, existing, null));

	// Etapas: as que existem com a configuração do desafio, cada uma uma vez
	const stages: Stage[] = [];
	const levelOf = (reader: FieldReader, label: string) => {
		const level = reader.nullableString('aiLevel');
		if (level && !isAILevel(level)) plan.problems.push(problem(TLkey`{0}: invalid difficulty.`, label));
		return level || null;
	};
	const badgeOf = (reader: FieldReader, label: string) => {
		const badge = reader.nullableString('badge');
		if (badge && !getBadge(badge)) plan.problems.push(problem(TLkey`{0}: invalid badge.`, label));
		return badge || null;
	};
	/** Treinador da etapa, conferindo o tipo exigido por ginásios e Elite 4. */
	const trainerOf = (name: string, label: string, needsType: boolean) => {
		const resolved = resolve(name);
		if (!('trainer' in resolved)) {
			plan.problems.push({ ...resolved, args: [label, ...resolved.args] });
			return null;
		}
		if (needsType && !resolved.trainer.type) {
			plan.problems.push(problem(TLkey`{0}: trainer {1} has no type (gym leaders and the Elite Four need one).`,
				label, resolved.trainer.name));
			return null;
		}
		return resolved.trainer;
	};
	rawStages.forEach((rawStage, i) => {
		const stageWhere = `${where}.stages[${i}]`;
		if (!isObject(rawStage)) {
			plan.problems.push(problem(TLkey`Invalid value in "{0}".`, stageWhere));
			return;
		}
		const reader = new FieldReader(rawStage, stageWhere);
		const kind = reader.oneOf('kind', STAGE_KINDS, 'champion');
		const position = reader.integer('position', 1);
		const trainerName = reader.string('trainer', '').trim();
		const label = `${kind} ${position}`;
		const aiLevel = levelOf(reader, label);
		const badge = badgeOf(reader, label);
		plan.problems.push(...reader.problems);
		if (reader.problems.length) return;
		const exists = kind === 'gym' ? input.typeMode === 'fixed' && position >= 1 && position <= input.gymCount :
			kind === 'elite4' ? input.hasElite4 && position >= 1 && position <= ELITE4_SIZE :
			position === 1;
		if (!exists) {
			plan.problems.push(problem(TLkey`Stage {0} does not exist with this challenge configuration.`, label));
			return;
		}
		if (stages.some(stage => stage.kind === kind && stage.position === position)) {
			plan.problems.push(problem(TLkey`Stage {0} appears more than once.`, label));
			return;
		}
		if (badge && kind !== 'gym') {
			plan.problems.push(problem(TLkey`{0}: only gyms give badges.`, label));
			return;
		}
		const trainer = trainerOf(trainerName, label, kind !== 'champion');
		if (!trainer) return;
		stages.push({ kind, position, trainerId: trainer.id, aiLevel, badgeId: badge });
		plan.stages.push({ kind, position, trainer: trainerName, aiLevel, badge });
	});

	const pool: PoolEntry[] = [];
	if (rawPool.length && input.typeMode !== 'random') {
		plan.problems.push(problem(TLkey`The random pool is only used with random gym types.`));
	} else {
		rawPool.forEach((rawEntry, i) => {
			const entryWhere = `${where}.pool[${i}]`;
			if (!isObject(rawEntry)) {
				plan.problems.push(problem(TLkey`Invalid value in "{0}".`, entryWhere));
				return;
			}
			const reader = new FieldReader(rawEntry, entryWhere);
			const trainerName = reader.string('trainer', '').trim();
			const label = `pool ${trainerName}`;
			const aiLevel = levelOf(reader, label);
			const badge = badgeOf(reader, label);
			plan.problems.push(...reader.problems);
			if (reader.problems.length) return;
			const trainer = trainerOf(trainerName, label, true);
			if (!trainer) return;
			if (pool.some(entry => entry.trainerId === trainer.id)) {
				plan.problems.push(problem(TLkey`Stage {0} appears more than once.`, label));
				return;
			}
			pool.push({ trainerId: trainer.id, aiLevel, badgeId: badge });
			plan.pool.push({ trainer: trainerName, aiLevel, badge });
		});
	}
	if (plan.problems.length) return plan;
	plan.input = input;
	// Rascunho: pode entrar incompleto, mas o admin vê o que falta para abrir
	const draft: Challenge = { ...input, id: -1, status: 'draft', createdAt: 0, openedAt: null, closedAt: null };
	plan.notReady = challengeProblems(draft, stages, pool, trainerMap);
	return plan;
}

/** Lê e valida o pacote contra o estado atual do banco. Não grava nada. */
export function planImport(store: GymStore, text: string): ImportPlan {
	const { trainers: rawTrainers, challenges: rawChallenges, problems } = readPack(text);
	const plan: ImportPlan = { problems, trainers: [], challenges: [] };
	if (problems.length) return plan;

	const bankTrainers = store.listTrainers();
	const bank = new Map<ID, Trainer[]>();
	for (const trainer of bankTrainers) {
		const key = nameKey(trainer.name);
		bank.set(key, [...bank.get(key) || [], trainer]);
	}
	const seenTrainers = new Set<ID>();
	plan.trainers = rawTrainers.map((raw, i) => planTrainer(raw, i, bank, seenTrainers));

	// Treinadores novos ganham ids provisórios negativos para a validação dos desafios
	const trainerMap = new Map(bankTrainers.map(trainer => [trainer.id, trainer]));
	const fromPack = new Map<ID, ResolvedTrainer>();
	plan.trainers.forEach((trainerPlan, i) => {
		if (trainerPlan.action !== 'create') return;
		const key = nameKey(trainerPlan.name);
		if (!trainerPlan.input) {
			fromPack.set(key, problem(TLkey`{0}: trainer {1} has errors in the pack.`, trainerPlan.name));
			return;
		}
		const trainer: Trainer = {
			...trainerPlan.input, doubles: !!trainerPlan.input.doubles, id: -1 - i, createdAt: 0, updatedAt: 0,
		};
		trainerMap.set(trainer.id, trainer);
		fromPack.set(key, { trainer });
	});
	const resolve = (name: string): ResolvedTrainer => {
		const key = nameKey(name);
		const inPack = fromPack.get(key);
		if (inPack) return inPack;
		const matches = bank.get(key) || [];
		if (matches.length === 1) return { trainer: matches[0] };
		if (matches.length > 1) return problem(TLkey`{0}: more than one trainer in the bank is named {1}.`, name);
		return problem(TLkey`{0}: trainer {1} is not in the pack or in the bank.`, name);
	};

	const existingChallenges = store.listChallenges();
	const seenChallenges = new Set<ID>();
	plan.challenges = rawChallenges.map((raw, i) => (
		planChallenge(raw, i, existingChallenges, seenChallenges, resolve, trainerMap)
	));
	return plan;
}

/** Algum erro impede a importação? */
export function planHasProblems(plan: ImportPlan) {
	return plan.problems.length > 0 ||
		plan.trainers.some(t => t.problems.length) || plan.challenges.some(c => c.problems.length);
}

/** O pacote tem algo a criar (e nenhum erro)? */
export function canImport(plan: ImportPlan) {
	return !planHasProblems(plan) &&
		(plan.trainers.some(t => t.action === 'create') || plan.challenges.some(c => c.action === 'create'));
}

/** Grava o plano (tudo numa transação). Só chamar com canImport(plan). */
export function applyImport(store: GymStore, plan: ImportPlan): { trainers: Trainer[], challenges: Challenge[] } {
	return store.transaction(() => {
		const created = new Map<ID, Trainer>();
		for (const trainerPlan of plan.trainers) {
			if (trainerPlan.action !== 'create' || !trainerPlan.input) continue;
			created.set(nameKey(trainerPlan.name), store.createTrainer(trainerPlan.input));
		}
		const bank = new Map<ID, Trainer>();
		for (const trainer of store.listTrainers()) {
			if (!bank.has(nameKey(trainer.name))) bank.set(nameKey(trainer.name), trainer);
		}
		const idOf = (name: string) => (created.get(nameKey(name)) || bank.get(nameKey(name)))!.id;
		const challenges: Challenge[] = [];
		for (const challengePlan of plan.challenges) {
			if (challengePlan.action !== 'create' || !challengePlan.input) continue;
			const challenge = store.createChallenge(challengePlan.input);
			for (const stage of challengePlan.stages) {
				store.setStage(challenge.id, {
					kind: stage.kind, position: stage.position, trainerId: idOf(stage.trainer),
					aiLevel: stage.aiLevel, badgeId: stage.badge,
				});
			}
			for (const entry of challengePlan.pool) {
				store.setPoolEntry(challenge.id, { trainerId: idOf(entry.trainer), aiLevel: entry.aiLevel, badgeId: entry.badge });
			}
			challenges.push(challenge);
		}
		return { trainers: [...created.values()], challenges };
	});
}
