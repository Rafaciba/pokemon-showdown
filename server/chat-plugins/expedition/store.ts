/**
 * pokemon-showdown-custom: persistência da Expedição.
 *
 * SQLite próprio (node:sqlite) em databases/expedition.db, como o Desafio de Ginásios.
 * LGPD: guarda o id do jogador nas runs e nos desbloqueios, e nenhum IP. Tudo do
 * jogador é apagado junto com a conta (deleteUserData) e passa para o nome novo numa
 * troca de nome (renameUser).
 *
 * @license MIT
 */
import { DatabaseSync } from 'node:sqlite';
import * as fs from 'node:fs';
import * as path from 'node:path';
import type { RunMon } from './team';
import type { MonGain, RunDecision } from './progression';
import type { RunSettings } from './variant';

export const DEFAULT_DB_PATH = 'databases/expedition.db';

export type RunStatus = 'active' | 'won' | 'lost' | 'abandoned' | 'closed';
export type UnlockKind = 'starter' | 'item' | 'variant';

/** Escolha que a run espera antes de seguir (por enquanto, o time inicial). */
export type RunPending = { kind: 'starter', options: RunMon[][] };

export interface ExpeditionRun {
	id: number;
	userid: string;
	variant: string;
	seed: string;
	status: RunStatus;
	/** Ato atual (a partir de 1). */
	act: number;
	/** Nó atual do ato (null = ainda no início do ato). */
	node: string | null;
	/** O nó atual já terminou (o próximo passo é escolher outro no mapa). */
	nodeDone: boolean;
	/** Nós percorridos, como "<ato>:<nó>". */
	path: string[];
	team: RunMon[];
	/** Itens da run (etapa 3). */
	items: string[];
	pending: RunPending | null;
	/** Golpes novos e evoluções esperando a decisão do jogador (resolvidas antes de seguir no mapa). */
	decisions: RunDecision[];
	/**
	 * Última batalha (adversário, resultado e experiência ganha): na vitória, mostrada até
	 * o próximo nó; na derrota, no resumo da run encerrada.
	 */
	lastBattle: { opponent: string, result: BattleResult, gains: MonGain[], money?: number, items?: string[] } | null;
	/** Dinheiro da run (ganho contra treinadores, gasto na loja). */
	money: number;
	/** Estado do nó atual (ex.: o que já foi comprado na loja); limpo ao entrar noutro nó. */
	nodeState: AnyObject;
	/** Configurações em vigor quando a run começou. */
	settings: RunSettings;
	startedAt: number;
	endedAt: number | null;
}

export type BattleResult = 'win' | 'loss' | 'tie';

/** Batalha de um nó (com o save state enquanto não termina). */
export interface ExpeditionBattle {
	id: number;
	runId: number;
	act: number;
	node: string;
	roomid: string | null;
	/** Uids dos Pokémon do jogador na batalha, na ordem do time enviado. */
	teamUids: string[];
	inputLog: string | null;
	result: BattleResult | null;
	startedAt: number;
	endedAt: number | null;
}

export interface Unlock {
	kind: UnlockKind;
	ref: string;
	unlockedAt: number;
}

const MIGRATIONS: string[] = [
	// 1: runs, desbloqueios e ajustes das variações (painel)
	`
	CREATE TABLE runs (
		id           INTEGER PRIMARY KEY,
		userid       TEXT NOT NULL,
		variant      TEXT NOT NULL,
		seed         TEXT NOT NULL,
		status       TEXT NOT NULL CHECK (status IN ('active', 'won', 'lost', 'abandoned', 'closed')),
		act          INTEGER NOT NULL DEFAULT 1,
		node         TEXT,
		node_done    INTEGER NOT NULL DEFAULT 0,
		path         TEXT NOT NULL DEFAULT '[]',
		team         TEXT NOT NULL DEFAULT '[]',
		items        TEXT NOT NULL DEFAULT '[]',
		pending      TEXT,
		settings     TEXT NOT NULL,
		started_at   INTEGER NOT NULL,
		ended_at     INTEGER
	) STRICT;
	-- Uma run em andamento por jogador em cada variação (decisão do usuário)
	CREATE UNIQUE INDEX runs_active ON runs (userid, variant) WHERE status = 'active';
	CREATE INDEX runs_user ON runs (userid, started_at);

	CREATE TABLE unlocks (
		userid       TEXT NOT NULL,
		kind         TEXT NOT NULL CHECK (kind IN ('starter', 'item', 'variant')),
		ref          TEXT NOT NULL,
		unlocked_at  INTEGER NOT NULL,
		PRIMARY KEY (userid, kind, ref)
	) STRICT, WITHOUT ROWID;

	CREATE TABLE variant_settings (
		variant      TEXT PRIMARY KEY,
		enabled      INTEGER NOT NULL DEFAULT 1,
		overrides    TEXT NOT NULL DEFAULT '{}',
		updated_at   INTEGER NOT NULL
	) STRICT;
	`,
	// 2: batalhas (etapa 2) e a fila de decisões da run
	`
	ALTER TABLE runs ADD COLUMN decisions TEXT NOT NULL DEFAULT '[]';
	CREATE TABLE battles (
		id           INTEGER PRIMARY KEY,
		run_id       INTEGER NOT NULL REFERENCES runs (id) ON DELETE CASCADE,
		act          INTEGER NOT NULL,
		node         TEXT NOT NULL,
		roomid       TEXT,
		team_uids    TEXT NOT NULL,
		input_log    TEXT,
		result       TEXT CHECK (result IN ('win', 'loss', 'tie')),
		started_at   INTEGER NOT NULL,
		ended_at     INTEGER
	) STRICT;
	CREATE INDEX battles_run ON battles (run_id);
	`,
	// 3: resumo da última vitória (experiência ganha)
	`
	ALTER TABLE runs ADD COLUMN last_battle TEXT;
	`,
	// 4: dinheiro da run e estado do nó atual (etapa 3, loja e eventos)
	`
	ALTER TABLE runs ADD COLUMN money INTEGER NOT NULL DEFAULT 0;
	ALTER TABLE runs ADD COLUMN node_state TEXT NOT NULL DEFAULT '{}';
	`,
];

type Row = Record<string, any>;
const now = () => Math.floor(Date.now() / 1000);

function toRun(row: Row): ExpeditionRun {
	return {
		id: row.id, userid: row.userid, variant: row.variant, seed: row.seed, status: row.status, act: row.act,
		node: row.node, nodeDone: row.node_done === 1, path: JSON.parse(row.path), team: JSON.parse(row.team),
		items: JSON.parse(row.items), pending: row.pending ? JSON.parse(row.pending) : null,
		decisions: JSON.parse(row.decisions || '[]'), lastBattle: row.last_battle ? JSON.parse(row.last_battle) : null,
		money: row.money || 0, nodeState: JSON.parse(row.node_state || '{}'),
		settings: JSON.parse(row.settings), startedAt: row.started_at, endedAt: row.ended_at,
	};
}

export class ExpeditionStore {
	readonly db: DatabaseSync;

	constructor(file = DEFAULT_DB_PATH) {
		if (file !== ':memory:') fs.mkdirSync(path.dirname(file), { recursive: true });
		this.db = new DatabaseSync(file);
		this.db.exec('PRAGMA journal_mode = WAL');
		this.db.exec('PRAGMA busy_timeout = 5000');
		this.db.exec('PRAGMA foreign_keys = ON');
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

	// --- Runs ---------------------------------------------------------------------------

	createRun(input: Pick<ExpeditionRun, 'userid' | 'variant' | 'seed' | 'settings' | 'pending'>): ExpeditionRun {
		const result = this.db.prepare(`
			INSERT INTO runs (userid, variant, seed, status, settings, pending, started_at) VALUES (?, ?, ?, 'active', ?, ?, ?)
		`).run(input.userid, input.variant, input.seed, JSON.stringify(input.settings),
			input.pending ? JSON.stringify(input.pending) : null, now());
		return this.getRun(Number(result.lastInsertRowid))!;
	}

	getRun(id: number): ExpeditionRun | null {
		const row = this.db.prepare('SELECT * FROM runs WHERE id = ?').get(id) as Row | undefined;
		return row ? toRun(row) : null;
	}

	getActiveRun(userid: string, variant: string): ExpeditionRun | null {
		const row = this.db.prepare(`SELECT * FROM runs WHERE userid = ? AND variant = ? AND status = 'active'`)
			.get(userid, variant) as Row | undefined;
		return row ? toRun(row) : null;
	}

	listRuns(userid: string, limit = 50): ExpeditionRun[] {
		return (this.db.prepare('SELECT * FROM runs WHERE userid = ? ORDER BY started_at DESC, id DESC LIMIT ?')
			.all(userid, limit) as Row[]).map(toRun);
	}

	/** Runs de todos os jogadores (painel): em andamento ou encerradas, das mais recentes. */
	listAllRuns(active: boolean, limit = 50): ExpeditionRun[] {
		const where = active ? `status = 'active'` : `status <> 'active'`;
		const sql = `SELECT * FROM runs WHERE ${where} ORDER BY COALESCE(ended_at, started_at) DESC, id DESC LIMIT ?`;
		return (this.db.prepare(sql).all(limit) as Row[]).map(toRun);
	}

	/** Grava o estado da run (o que muda durante o jogo). */
	saveRun(run: ExpeditionRun) {
		this.db.prepare(`
			UPDATE runs SET status = ?, act = ?, node = ?, node_done = ?, path = ?, team = ?, items = ?, pending = ?,
				decisions = ?, last_battle = ?, money = ?, node_state = ?, ended_at = ?
			WHERE id = ?
		`).run(run.status, run.act, run.node, run.nodeDone ? 1 : 0, JSON.stringify(run.path), JSON.stringify(run.team),
			JSON.stringify(run.items), run.pending ? JSON.stringify(run.pending) : null, JSON.stringify(run.decisions),
			run.lastBattle ? JSON.stringify(run.lastBattle) : null, run.money, JSON.stringify(run.nodeState || {}), run.endedAt,
			run.id);
	}

	/** Runs em andamento de um jogador com batalha sem resultado (para retomar). */
	listUnfinishedBattles(userid: string): { run: ExpeditionRun, battle: ExpeditionBattle }[] {
		const rows = this.db.prepare(`
			SELECT b.id AS battle_id FROM battles b JOIN runs r ON r.id = b.run_id
			WHERE r.userid = ? AND r.status = 'active' AND b.result IS NULL ORDER BY b.id
		`).all(userid) as Row[];
		return rows.map(row => {
			const battle = this.getBattle(row.battle_id)!;
			return { run: this.getRun(battle.runId)!, battle };
		});
	}

	// --- Batalhas ----------------------------------------------------------------------

	createBattle(runId: number, act: number, node: string, teamUids: string[]): ExpeditionBattle {
		const result = this.db.prepare(`
			INSERT INTO battles (run_id, act, node, team_uids, started_at) VALUES (?, ?, ?, ?, ?)
		`).run(runId, act, node, JSON.stringify(teamUids), now());
		return this.getBattle(Number(result.lastInsertRowid))!;
	}

	getBattle(id: number): ExpeditionBattle | null {
		const row = this.db.prepare('SELECT * FROM battles WHERE id = ?').get(id) as Row | undefined;
		return row ? {
			id: row.id, runId: row.run_id, act: row.act, node: row.node, roomid: row.roomid,
			teamUids: JSON.parse(row.team_uids), inputLog: row.input_log, result: row.result,
			startedAt: row.started_at, endedAt: row.ended_at,
		} : null;
	}

	/** Batalha sem resultado do nó atual da run, se houver. */
	getOpenBattle(run: ExpeditionRun): ExpeditionBattle | null {
		const row = this.db.prepare(`
			SELECT id FROM battles WHERE run_id = ? AND act = ? AND node = ? AND result IS NULL ORDER BY id DESC LIMIT 1
		`).get(run.id, run.act, run.node) as Row | undefined;
		return row ? this.getBattle(row.id) : null;
	}

	setBattleRoom(id: number, roomid: string | null) {
		this.db.prepare('UPDATE battles SET roomid = ? WHERE id = ?').run(roomid, id);
	}

	saveBattleState(id: number, inputLog: string) {
		this.db.prepare('UPDATE battles SET input_log = ? WHERE id = ? AND result IS NULL').run(inputLog, id);
	}

	/** Resultado da batalha; o save state deixa de ser necessário e é apagado. */
	finishBattle(id: number, result: BattleResult) {
		this.db.prepare(`
			UPDATE battles SET result = ?, ended_at = ?, input_log = NULL, roomid = NULL WHERE id = ? AND result IS NULL
		`).run(result, now(), id);
	}

	// --- Desbloqueios ------------------------------------------------------------------

	addUnlock(userid: string, kind: UnlockKind, ref: string) {
		this.db.prepare('INSERT OR IGNORE INTO unlocks (userid, kind, ref, unlocked_at) VALUES (?, ?, ?, ?)')
			.run(userid, kind, ref, now());
	}

	listUnlocks(userid: string, kind?: UnlockKind): Unlock[] {
		const rows = (kind ?
			this.db.prepare('SELECT * FROM unlocks WHERE userid = ? AND kind = ? ORDER BY unlocked_at').all(userid, kind) :
			this.db.prepare('SELECT * FROM unlocks WHERE userid = ? ORDER BY unlocked_at').all(userid)) as Row[];
		return rows.map(row => ({ kind: row.kind, ref: row.ref, unlockedAt: row.unlocked_at }));
	}

	hasUnlock(userid: string, kind: UnlockKind, ref: string) {
		return !!this.db.prepare('SELECT 1 FROM unlocks WHERE userid = ? AND kind = ? AND ref = ?').get(userid, kind, ref);
	}

	// --- Ajustes das variações (painel; etapa 4) -----------------------------------------

	getVariantSettings(variant: string): { enabled: boolean, overrides: Record<string, number> } {
		const row = this.db.prepare('SELECT * FROM variant_settings WHERE variant = ?').get(variant) as Row | undefined;
		return row ? { enabled: row.enabled === 1, overrides: JSON.parse(row.overrides) } : { enabled: true, overrides: {} };
	}

	setVariantSettings(variant: string, enabled: boolean, overrides: Record<string, number>) {
		this.db.prepare(`
			INSERT INTO variant_settings (variant, enabled, overrides, updated_at) VALUES (?, ?, ?, ?)
			ON CONFLICT (variant) DO UPDATE SET enabled = excluded.enabled, overrides = excluded.overrides,
				updated_at = excluded.updated_at
		`).run(variant, enabled ? 1 : 0, JSON.stringify(overrides), now());
	}

	// --- Conta -------------------------------------------------------------------------

	/** Conta excluída: runs e desbloqueios do jogador. */
	deleteUserData(userid: string) {
		this.transaction(() => {
			this.db.prepare('DELETE FROM battles WHERE run_id IN (SELECT id FROM runs WHERE userid = ?)').run(userid);
			this.db.prepare('DELETE FROM runs WHERE userid = ?').run(userid);
			this.db.prepare('DELETE FROM unlocks WHERE userid = ?').run(userid);
		});
	}

	/** Troca de nome da conta: tudo passa para o nome novo. */
	renameUser(oldid: string, newid: string) {
		this.transaction(() => {
			this.db.prepare('UPDATE runs SET userid = ? WHERE userid = ?').run(newid, oldid);
			// Um desbloqueio que o nome novo já tenha fica só uma vez
			this.db.prepare('UPDATE OR IGNORE unlocks SET userid = ? WHERE userid = ?').run(newid, oldid);
			this.db.prepare('DELETE FROM unlocks WHERE userid = ?').run(oldid);
		});
	}
}
