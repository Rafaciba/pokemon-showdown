/**
 * pokemon-showdown-custom: persistência do Desafio de Ginásios.
 *
 * SQLite próprio (node:sqlite, nativo do Node 24) em databases/gym-challenge.db.
 * LGPD: só guarda IDs de usuário (das jornadas) e resultados; nenhum IP.
 *
 * Esta camada só lê e grava; as regras ficam em rules.ts.
 *
 * @license MIT
 */
import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';

export const DEFAULT_DB_PATH = 'databases/gym-challenge.db';

export type ChallengeStatus = 'draft' | 'open' | 'closed';
export type TypeMode = 'fixed' | 'random';
export type OrderMode = 'free' | 'fixed';
export type TimerMode = 'turn' | 'free';
export type StageKind = 'gym' | 'elite4' | 'champion';

export interface Trainer {
	id: number;
	name: string;
	title: string;
	/** Tipo do treinador (obrigatório para atuar como líder ou Elite 4). */
	type: string | null;
	/** Time empacotado (Teams.pack). */
	team: string;
	avatar: string;
	/** Imagem da insígnia; null = ícone de tipo do PS (placeholder). */
	badgeImage: string | null;
	createdAt: number;
	updatedAt: number;
}

export type TrainerInput = Pick<Trainer, 'name' | 'title' | 'type' | 'team' | 'avatar' | 'badgeImage'>;

export interface Challenge {
	id: number;
	name: string;
	status: ChallengeStatus;
	baseFormat: string;
	/** Regras extras na sintaxe do PS (ex.: "Min Source Gen = 3, - Mega"). */
	customRules: string;
	typeMode: TypeMode;
	gymCount: number;
	orderMode: OrderMode;
	hasElite4: boolean;
	teamLock: boolean;
	baseAILevel: string;
	timerMode: TimerMode;
	/** Segundos por turno quando timerMode = 'turn'. */
	turnSeconds: number | null;
	/** null = derrotas ilimitadas. */
	lossLimit: number | null;
	eliminateOnElite4Loss: boolean;
	eliminateOnChampionLoss: boolean;
	createdAt: number;
	openedAt: number | null;
	closedAt: number | null;
}

export type ChallengeInput = Omit<Challenge, 'id' | 'status' | 'createdAt' | 'openedAt' | 'closedAt'>;

export interface Stage {
	kind: StageKind;
	/** Ordem dentro do tipo de etapa: ginásio 1..N, Elite 4 1..4, Campeão 1. */
	position: number;
	trainerId: number | null;
	/** null = usa a dificuldade base do desafio. */
	aiLevel: string | null;
}

export interface PoolEntry {
	trainerId: number;
	aiLevel: string | null;
}

export type RunStatus = 'active' | 'won' | 'abandoned' | 'eliminated' | 'closed';
export type BattleResult = 'win' | 'loss' | 'tie' | 'void';

export interface Run {
	id: number;
	challengeId: number;
	userid: string;
	status: RunStatus;
	/** Hash do time da primeira batalha (trava de time); null até a primeira batalha. */
	teamHash: string | null;
	/** Ginásio escolhido pelo jogador (ordem livre); null = o primeiro ainda não vencido. */
	targetPosition: number | null;
	startedAt: number;
	endedAt: number | null;
}

/**
 * Etapa da jornada: cópia da etapa do desafio (ou do sorteio) feita quando a
 * jornada começa, com nome e time do treinador. Mudanças posteriores no desafio
 * ou no treinador não alteram jornadas em andamento.
 */
export interface RunStage {
	kind: StageKind;
	position: number;
	trainerId: number | null;
	trainerName: string;
	trainerTitle: string;
	type: string | null;
	team: string;
	/** Nível efetivo (já com a dificuldade base do desafio aplicada). */
	aiLevel: string;
}

export interface RunBattle {
	id: number;
	runId: number;
	kind: StageKind;
	position: number;
	roomid: string;
	/** null = batalha em andamento. */
	result: BattleResult | null;
	startedAt: number;
	endedAt: number | null;
}

const MIGRATIONS: string[] = [
	// 1: treinadores e desafios (fase 2). Jornadas entram na fase 3.
	`
	CREATE TABLE trainers (
		id           INTEGER PRIMARY KEY,
		name         TEXT NOT NULL,
		title        TEXT NOT NULL DEFAULT '',
		type         TEXT,
		team         TEXT NOT NULL,
		avatar       TEXT NOT NULL DEFAULT '',
		badge_image  TEXT,
		created_at   INTEGER NOT NULL,
		updated_at   INTEGER NOT NULL
	) STRICT;

	CREATE TABLE challenges (
		id                          INTEGER PRIMARY KEY,
		name                        TEXT NOT NULL UNIQUE,
		status                      TEXT NOT NULL CHECK (status IN ('draft', 'open', 'closed')),
		base_format                 TEXT NOT NULL,
		custom_rules                TEXT NOT NULL DEFAULT '',
		type_mode                   TEXT NOT NULL CHECK (type_mode IN ('fixed', 'random')),
		gym_count                   INTEGER NOT NULL,
		order_mode                  TEXT NOT NULL CHECK (order_mode IN ('free', 'fixed')),
		has_elite4                  INTEGER NOT NULL,
		team_lock                   INTEGER NOT NULL,
		base_ai_level               TEXT NOT NULL,
		timer_mode                  TEXT NOT NULL CHECK (timer_mode IN ('turn', 'free')),
		turn_seconds                INTEGER,
		loss_limit                  INTEGER,
		eliminate_on_elite4_loss    INTEGER NOT NULL,
		eliminate_on_champion_loss  INTEGER NOT NULL,
		created_at                  INTEGER NOT NULL,
		opened_at                   INTEGER,
		closed_at                   INTEGER
	) STRICT;

	CREATE TABLE challenge_stages (
		challenge_id  INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
		kind          TEXT NOT NULL CHECK (kind IN ('gym', 'elite4', 'champion')),
		position      INTEGER NOT NULL,
		trainer_id    INTEGER REFERENCES trainers(id),
		ai_level      TEXT,
		PRIMARY KEY (challenge_id, kind, position)
	) STRICT;

	CREATE TABLE challenge_pool (
		challenge_id  INTEGER NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
		trainer_id    INTEGER NOT NULL REFERENCES trainers(id),
		ai_level      TEXT,
		PRIMARY KEY (challenge_id, trainer_id)
	) STRICT;
	CREATE INDEX challenge_pool_trainer ON challenge_pool(trainer_id);
	CREATE INDEX challenge_stages_trainer ON challenge_stages(trainer_id);
	`,
	// 2: jornadas (fase 3)
	`
	CREATE TABLE runs (
		id               INTEGER PRIMARY KEY,
		challenge_id     INTEGER NOT NULL REFERENCES challenges(id),
		userid           TEXT NOT NULL,
		status           TEXT NOT NULL CHECK (status IN ('active', 'won', 'abandoned', 'eliminated', 'closed')),
		team_hash        TEXT,
		target_position  INTEGER,
		started_at       INTEGER NOT NULL,
		ended_at         INTEGER
	) STRICT;
	CREATE UNIQUE INDEX runs_active ON runs(challenge_id, userid) WHERE status = 'active';
	CREATE INDEX runs_user ON runs(userid);

	CREATE TABLE run_stages (
		run_id         INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
		kind           TEXT NOT NULL CHECK (kind IN ('gym', 'elite4', 'champion')),
		position       INTEGER NOT NULL,
		trainer_id     INTEGER,
		trainer_name   TEXT NOT NULL,
		trainer_title  TEXT NOT NULL,
		type           TEXT,
		team           TEXT NOT NULL,
		ai_level       TEXT NOT NULL,
		PRIMARY KEY (run_id, kind, position)
	) STRICT;

	CREATE TABLE run_battles (
		id          INTEGER PRIMARY KEY,
		run_id      INTEGER NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
		kind        TEXT NOT NULL CHECK (kind IN ('gym', 'elite4', 'champion')),
		position    INTEGER NOT NULL,
		roomid      TEXT NOT NULL,
		result      TEXT CHECK (result IN ('win', 'loss', 'tie', 'void')),
		started_at  INTEGER NOT NULL,
		ended_at    INTEGER
	) STRICT;
	CREATE INDEX run_battles_run ON run_battles(run_id);
	`,
];

const now = () => Math.floor(Date.now() / 1000);
const STAGE_ORDER = `CASE kind WHEN 'gym' THEN 0 WHEN 'elite4' THEN 1 ELSE 2 END, position`;
const bool = (value: unknown) => value === 1 || value === true;

type Row = Record<string, any>;

function toTrainer(row: Row): Trainer {
	return {
		id: row.id, name: row.name, title: row.title, type: row.type, team: row.team, avatar: row.avatar,
		badgeImage: row.badge_image, createdAt: row.created_at, updatedAt: row.updated_at,
	};
}

function toChallenge(row: Row): Challenge {
	return {
		id: row.id,
		name: row.name,
		status: row.status,
		baseFormat: row.base_format,
		customRules: row.custom_rules,
		typeMode: row.type_mode,
		gymCount: row.gym_count,
		orderMode: row.order_mode,
		hasElite4: bool(row.has_elite4),
		teamLock: bool(row.team_lock),
		baseAILevel: row.base_ai_level,
		timerMode: row.timer_mode,
		turnSeconds: row.turn_seconds,
		lossLimit: row.loss_limit,
		eliminateOnElite4Loss: bool(row.eliminate_on_elite4_loss),
		eliminateOnChampionLoss: bool(row.eliminate_on_champion_loss),
		createdAt: row.created_at,
		openedAt: row.opened_at,
		closedAt: row.closed_at,
	};
}

function toRun(row: Row): Run {
	return {
		id: row.id, challengeId: row.challenge_id, userid: row.userid, status: row.status, teamHash: row.team_hash,
		targetPosition: row.target_position, startedAt: row.started_at, endedAt: row.ended_at,
	};
}

function toRunStage(row: Row): RunStage {
	return {
		kind: row.kind, position: row.position, trainerId: row.trainer_id, trainerName: row.trainer_name,
		trainerTitle: row.trainer_title, type: row.type, team: row.team, aiLevel: row.ai_level,
	};
}

function toRunBattle(row: Row): RunBattle {
	return {
		id: row.id, runId: row.run_id, kind: row.kind, position: row.position, roomid: row.roomid, result: row.result,
		startedAt: row.started_at, endedAt: row.ended_at,
	};
}

export class GymStore {
	readonly db: DatabaseSync;

	constructor(file = DEFAULT_DB_PATH) {
		if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
		this.db = new DatabaseSync(file);
		this.db.exec('PRAGMA journal_mode = WAL');
		this.db.exec('PRAGMA foreign_keys = ON');
		this.db.exec('PRAGMA busy_timeout = 5000');
		this.migrate();
	}

	private migrate() {
		const { user_version: current } = this.db.prepare('PRAGMA user_version').get() as { user_version: number };
		for (let version = current; version < MIGRATIONS.length; version++) {
			this.transaction(() => {
				this.db.exec(MIGRATIONS[version]);
				this.db.exec(`PRAGMA user_version = ${version + 1}`);
			});
		}
	}

	private transactionDepth = 0;

	/** Reentrante: dentro de uma transação já aberta, só executa `fn` (tudo vira uma transação). */
	transaction<T>(fn: () => T): T {
		if (this.transactionDepth) return fn();
		this.db.exec('BEGIN IMMEDIATE');
		this.transactionDepth++;
		try {
			const result = fn();
			this.db.exec('COMMIT');
			return result;
		} catch (err) {
			this.db.exec('ROLLBACK');
			throw err;
		} finally {
			this.transactionDepth--;
		}
	}

	close() {
		this.db.close();
	}

	// --- Treinadores --------------------------------------------------------

	listTrainers(): Trainer[] {
		return (this.db.prepare('SELECT * FROM trainers ORDER BY name COLLATE NOCASE').all() as Row[]).map(toTrainer);
	}

	getTrainer(id: number): Trainer | null {
		const row = this.db.prepare('SELECT * FROM trainers WHERE id = ?').get(id) as Row | undefined;
		return row ? toTrainer(row) : null;
	}

	createTrainer(input: TrainerInput): Trainer {
		const time = now();
		const result = this.db.prepare(`
			INSERT INTO trainers (name, title, type, team, avatar, badge_image, created_at, updated_at)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?)
		`).run(input.name, input.title, input.type, input.team, input.avatar, input.badgeImage, time, time);
		return this.getTrainer(Number(result.lastInsertRowid))!;
	}

	updateTrainer(id: number, input: TrainerInput): Trainer | null {
		this.db.prepare(`
			UPDATE trainers SET name = ?, title = ?, type = ?, team = ?, avatar = ?, badge_image = ?, updated_at = ?
			WHERE id = ?
		`).run(input.name, input.title, input.type, input.team, input.avatar, input.badgeImage, now(), id);
		return this.getTrainer(id);
	}

	/** IDs dos desafios que usam o treinador (em etapas ou no banco de sorteio). */
	challengesUsingTrainer(trainerId: number): number[] {
		const rows = this.db.prepare(`
			SELECT challenge_id FROM challenge_stages WHERE trainer_id = ?
			UNION SELECT challenge_id FROM challenge_pool WHERE trainer_id = ?
		`).all(trainerId, trainerId) as Row[];
		return rows.map(row => row.challenge_id);
	}

	/** Só apaga treinadores que nenhum desafio usa; devolve false caso contrário. */
	deleteTrainer(id: number): boolean {
		if (this.challengesUsingTrainer(id).length) return false;
		return this.db.prepare('DELETE FROM trainers WHERE id = ?').run(id).changes === 1;
	}

	// --- Desafios -----------------------------------------------------------

	listChallenges(status?: ChallengeStatus): Challenge[] {
		const rows = (status ?
			this.db.prepare('SELECT * FROM challenges WHERE status = ? ORDER BY name COLLATE NOCASE').all(status) :
			this.db.prepare('SELECT * FROM challenges ORDER BY name COLLATE NOCASE').all()) as Row[];
		return rows.map(toChallenge);
	}

	getChallenge(id: number): Challenge | null {
		const row = this.db.prepare('SELECT * FROM challenges WHERE id = ?').get(id) as Row | undefined;
		return row ? toChallenge(row) : null;
	}

	createChallenge(input: ChallengeInput): Challenge {
		const result = this.db.prepare(`
			INSERT INTO challenges (
				name, status, base_format, custom_rules, type_mode, gym_count, order_mode, has_elite4, team_lock,
				base_ai_level, timer_mode, turn_seconds, loss_limit, eliminate_on_elite4_loss,
				eliminate_on_champion_loss, created_at
			) VALUES (?, 'draft', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`).run(
			input.name, input.baseFormat, input.customRules, input.typeMode, input.gymCount, input.orderMode,
			Number(input.hasElite4), Number(input.teamLock), input.baseAILevel, input.timerMode, input.turnSeconds,
			input.lossLimit, Number(input.eliminateOnElite4Loss), Number(input.eliminateOnChampionLoss), now()
		);
		return this.getChallenge(Number(result.lastInsertRowid))!;
	}

	updateChallenge(id: number, input: ChallengeInput): Challenge | null {
		this.db.prepare(`
			UPDATE challenges SET
				name = ?, base_format = ?, custom_rules = ?, type_mode = ?, gym_count = ?, order_mode = ?,
				has_elite4 = ?, team_lock = ?, base_ai_level = ?, timer_mode = ?, turn_seconds = ?, loss_limit = ?,
				eliminate_on_elite4_loss = ?, eliminate_on_champion_loss = ?
			WHERE id = ?
		`).run(
			input.name, input.baseFormat, input.customRules, input.typeMode, input.gymCount, input.orderMode,
			Number(input.hasElite4), Number(input.teamLock), input.baseAILevel, input.timerMode, input.turnSeconds,
			input.lossLimit, Number(input.eliminateOnElite4Loss), Number(input.eliminateOnChampionLoss), id
		);
		return this.getChallenge(id);
	}

	setChallengeStatus(id: number, status: ChallengeStatus) {
		const column = status === 'open' ? 'opened_at' : status === 'closed' ? 'closed_at' : null;
		if (status === 'open') {
			// Abrir (ou reabrir um encerrado): opened_at passa a ser a abertura mais recente
			this.db.prepare(`UPDATE challenges SET status = 'open', opened_at = ?, closed_at = NULL WHERE id = ?`).run(now(), id);
		} else if (column) {
			this.db.prepare(`UPDATE challenges SET status = ?, ${column} = ? WHERE id = ?`).run(status, now(), id);
		} else {
			this.db.prepare('UPDATE challenges SET status = ? WHERE id = ?').run(status, id);
		}
	}

	/** Só rascunhos podem ser apagados; desafios abertos/encerrados mantêm o histórico. */
	deleteDraftChallenge(id: number): boolean {
		return this.db.prepare(`DELETE FROM challenges WHERE id = ? AND status = 'draft'`).run(id).changes === 1;
	}

	// --- Etapas e banco de sorteio -----------------------------------------

	getStages(challengeId: number): Stage[] {
		const rows = this.db.prepare(`
			SELECT kind, position, trainer_id, ai_level FROM challenge_stages WHERE challenge_id = ?
			ORDER BY ${STAGE_ORDER}
		`).all(challengeId) as Row[];
		return rows.map(row => ({ kind: row.kind, position: row.position, trainerId: row.trainer_id, aiLevel: row.ai_level }));
	}

	setStage(challengeId: number, stage: Stage) {
		this.db.prepare(`
			INSERT INTO challenge_stages (challenge_id, kind, position, trainer_id, ai_level) VALUES (?, ?, ?, ?, ?)
			ON CONFLICT (challenge_id, kind, position) DO UPDATE SET trainer_id = excluded.trainer_id, ai_level = excluded.ai_level
		`).run(challengeId, stage.kind, stage.position, stage.trainerId, stage.aiLevel);
	}

	/** Remove etapas que deixaram de existir (ex.: diminuiu a quantidade de ginásios). */
	pruneStages(challengeId: number, gymCount: number, hasElite4: boolean) {
		this.db.prepare(`DELETE FROM challenge_stages WHERE challenge_id = ? AND kind = 'gym' AND position > ?`)
			.run(challengeId, gymCount);
		if (!hasElite4) {
			this.db.prepare(`DELETE FROM challenge_stages WHERE challenge_id = ? AND kind = 'elite4'`).run(challengeId);
		}
	}

	getPool(challengeId: number): PoolEntry[] {
		const rows = this.db.prepare('SELECT trainer_id, ai_level FROM challenge_pool WHERE challenge_id = ?')
			.all(challengeId) as Row[];
		return rows.map(row => ({ trainerId: row.trainer_id, aiLevel: row.ai_level }));
	}

	setPoolEntry(challengeId: number, entry: PoolEntry) {
		this.db.prepare(`
			INSERT INTO challenge_pool (challenge_id, trainer_id, ai_level) VALUES (?, ?, ?)
			ON CONFLICT (challenge_id, trainer_id) DO UPDATE SET ai_level = excluded.ai_level
		`).run(challengeId, entry.trainerId, entry.aiLevel);
	}

	removePoolEntry(challengeId: number, trainerId: number) {
		this.db.prepare('DELETE FROM challenge_pool WHERE challenge_id = ? AND trainer_id = ?').run(challengeId, trainerId);
	}

	/** Esvazia o banco de sorteio (ex.: o desafio passou para tipos fixos). */
	clearPool(challengeId: number) {
		this.db.prepare('DELETE FROM challenge_pool WHERE challenge_id = ?').run(challengeId);
	}

	// --- Jornadas ------------------------------------------------------------

	/** Cria a jornada com a cópia das etapas. Falha se o jogador já tiver uma ativa no desafio. */
	createRun(challengeId: number, userid: string, stages: RunStage[]): Run {
		return this.transaction(() => {
			const result = this.db.prepare(`
				INSERT INTO runs (challenge_id, userid, status, started_at) VALUES (?, ?, 'active', ?)
			`).run(challengeId, userid, now());
			const runId = Number(result.lastInsertRowid);
			const insert = this.db.prepare(`
				INSERT INTO run_stages (run_id, kind, position, trainer_id, trainer_name, trainer_title, type, team, ai_level)
				VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
			`);
			for (const stage of stages) {
				insert.run(
					runId, stage.kind, stage.position, stage.trainerId, stage.trainerName, stage.trainerTitle,
					stage.type, stage.team, stage.aiLevel
				);
			}
			return this.getRun(runId)!;
		});
	}

	getRun(id: number): Run | null {
		const row = this.db.prepare('SELECT * FROM runs WHERE id = ?').get(id) as Row | undefined;
		return row ? toRun(row) : null;
	}

	getActiveRun(challengeId: number, userid: string): Run | null {
		const row = this.db.prepare(`SELECT * FROM runs WHERE challenge_id = ? AND userid = ? AND status = 'active'`)
			.get(challengeId, userid) as Row | undefined;
		return row ? toRun(row) : null;
	}

	/** Jornadas do desafio (todas, ou só de um jogador), da mais recente para a mais antiga. */
	listRuns(challengeId: number, userid?: string): Run[] {
		const rows = (userid ?
			this.db.prepare('SELECT * FROM runs WHERE challenge_id = ? AND userid = ? ORDER BY id DESC').all(challengeId, userid) :
			this.db.prepare('SELECT * FROM runs WHERE challenge_id = ? ORDER BY id DESC').all(challengeId)) as Row[];
		return rows.map(toRun);
	}

	/** Todas as jornadas do jogador, em todos os desafios, da mais recente para a mais antiga. */
	listUserRuns(userid: string): Run[] {
		return (this.db.prepare('SELECT * FROM runs WHERE userid = ? ORDER BY id DESC').all(userid) as Row[]).map(toRun);
	}

	/**
	 * Apaga os dados de jogo do usuário (conta excluída): jornadas e, em cascata,
	 * as etapas e batalhas delas. As conquistas vêm das jornadas, então somem junto.
	 */
	deleteUserData(userid: string): number {
		return Number(this.db.prepare('DELETE FROM runs WHERE userid = ?').run(userid).changes);
	}

	setRunStatus(id: number, status: RunStatus) {
		this.db.prepare(`UPDATE runs SET status = ?, ended_at = ? WHERE id = ?`)
			.run(status, status === 'active' ? null : now(), id);
	}

	setTeamHash(id: number, hash: string) {
		this.db.prepare('UPDATE runs SET team_hash = ? WHERE id = ?').run(hash, id);
	}

	setTargetPosition(id: number, position: number | null) {
		this.db.prepare('UPDATE runs SET target_position = ? WHERE id = ?').run(position, id);
	}

	/** Encerra as jornadas ativas do desafio (desafio encerrado pelo admin). Devolve os ids. */
	closeActiveRuns(challengeId: number): number[] {
		return this.transaction(() => {
			const ids = (this.db.prepare(`SELECT id FROM runs WHERE challenge_id = ? AND status = 'active'`)
				.all(challengeId) as Row[]).map(row => row.id as number);
			for (const id of ids) this.setRunStatus(id, 'closed');
			return ids;
		});
	}

	getRunStages(runId: number): RunStage[] {
		return (this.db.prepare(`SELECT * FROM run_stages WHERE run_id = ? ORDER BY ${STAGE_ORDER}`).all(runId) as Row[])
			.map(toRunStage);
	}

	getRunBattles(runId: number): RunBattle[] {
		return (this.db.prepare('SELECT * FROM run_battles WHERE run_id = ? ORDER BY id').all(runId) as Row[])
			.map(toRunBattle);
	}

	getRunBattle(id: number): RunBattle | null {
		const row = this.db.prepare('SELECT * FROM run_battles WHERE id = ?').get(id) as Row | undefined;
		return row ? toRunBattle(row) : null;
	}

	startBattle(runId: number, kind: StageKind, position: number, roomid: string): RunBattle {
		const result = this.db.prepare(`
			INSERT INTO run_battles (run_id, kind, position, roomid, started_at) VALUES (?, ?, ?, ?, ?)
		`).run(runId, kind, position, roomid, now());
		return this.getRunBattle(Number(result.lastInsertRowid))!;
	}

	/** Registra o resultado; só vale para batalhas em andamento. Devolve false se já havia resultado. */
	finishBattle(id: number, result: BattleResult): boolean {
		return this.db.prepare(`UPDATE run_battles SET result = ?, ended_at = ? WHERE id = ? AND result IS NULL`)
			.run(result, now(), id).changes === 1;
	}
}
