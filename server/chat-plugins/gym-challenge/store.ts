/**
 * pokemon-showdown-custom: persistência do Desafio de Ginásios.
 *
 * SQLite próprio (node:sqlite, nativo do Node 24) em databases/gym-challenge.db.
 * LGPD: só guarda IDs de usuário e resultados (tabelas de jornada entram na
 * fase 3); nenhum IP.
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
];

const now = () => Math.floor(Date.now() / 1000);
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

	transaction<T>(fn: () => T): T {
		this.db.exec('BEGIN IMMEDIATE');
		try {
			const result = fn();
			this.db.exec('COMMIT');
			return result;
		} catch (err) {
			this.db.exec('ROLLBACK');
			throw err;
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
		if (column) {
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
			ORDER BY CASE kind WHEN 'gym' THEN 0 WHEN 'elite4' THEN 1 ELSE 2 END, position
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
}
