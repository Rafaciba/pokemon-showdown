/**
 * pokemon-showdown-custom: comandos de conta integrados ao login server próprio.
 *
 * - /convite [nome]      (admin) gera um código de convite de uso único
 * - /redefinirsenha nome (admin) gera um código para o jogador redefinir a senha
 * - /conta               link para a página da conta (trocar senha, excluir conta)
 * - exclusão dos dados de jogo de contas excluídas no login (ladder, ranks, forfeit nas
 *   batalhas em andamento e o handler onAccountPurge para os outros plugins),
 *   consultada a cada minuto
 * - prazos diários: logs de batalha (30 dias) e modlog (6 meses; IP, 30 dias)
 *
 * Os códigos são gerados pelo login server (API interna, rede do Docker) e
 * mostrados só para quem executou o comando; nunca vão para logs ou modlog.
 *
 * Configuração (docker/server/config.js): Config.customlogin = {internalUrl, tokenPath}.
 *
 * @license MIT
 */
import * as fs from 'node:fs/promises';
import { FS, Utils } from '../../lib';
import { LadderStore } from '../ladders-local';
import { database as PrivateMessagesDatabase } from '../private-messages';

interface InternalReply {
	ok: boolean;
	error?: string;
	code?: string;
	expiresAt?: number;
	url?: string;
	userid?: string | null;
	username?: string;
	/** /internal/purges: contas excluídas cujos dados de jogo ainda precisam ser apagados */
	userids?: string[];
}

function isAdmin(user: User) {
	return user.registered && Users.globalAuth.get(user.id) === '~';
}

async function callLoginServer(path: string, body: Record<string, string>): Promise<InternalReply> {
	const settings = Config.customlogin;
	if (!settings?.internalUrl || !settings?.tokenPath) {
		throw new Chat.ErrorMessage(`Login server integration is not configured (Config.customlogin).`);
	}
	const token = FS(settings.tokenPath).readIfExistsSync().trim();
	if (!token) throw new Chat.ErrorMessage(`Login server internal token not found.`);

	let response: Response;
	try {
		response = await fetch(`${settings.internalUrl}${path}`, {
			method: 'POST',
			headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
			body: JSON.stringify(body),
			signal: AbortSignal.timeout(10_000),
		});
	} catch {
		throw new Chat.ErrorMessage(`Could not reach the login server.`);
	}
	const reply = await response.json().catch(() => null) as InternalReply | null;
	if (!reply) throw new Chat.ErrorMessage(`Invalid response from the login server.`);
	return reply;
}

// --- Exclusão dos dados de jogo de contas excluídas -------------------------
// O login server guarda o userid de cada conta excluída numa fila. Aqui, a cada
// minuto, apagamos os dados de jogo dessas contas e confirmamos para o login, que
// tira o userid da fila (e libera o nome para um novo cadastro).

const PURGE_INTERVAL = 60 * 1000;
const PURGE_FIRST_DELAY = 10 * 1000;

/**
 * Tira o usuário de todas as ladders locais (config/ladders/*.tsv). O projeto usa a
 * ladder local (sem Config.remoteladder); o LadderStore local divide o cache com ela.
 */
async function removeFromLadders(userid: ID) {
	const files = await FS('config/ladders').readdirIfExists();
	for (const file of files) {
		if (!file.endsWith('.tsv')) continue;
		const formatid = file.slice(0, -4);
		const ladder = new LadderStore(formatid);
		const rows = await ladder.getLadder();
		const index = ladder.indexOfUser(userid);
		if (index < 0) continue;
		rows.splice(index, 1);
		// O save() da ladder não grava uma ladder vazia: o arquivo antigo (com o usuário) ficaria
		if (rows.length) await ladder.save();
		else await FS(`config/ladders/${file}`).unlinkIfExists();
	}
}

// --- Logs de batalha: retenção de 30 dias e exclusão com a conta -------------
// O PS grava as batalhas da ladder em logs/AAAA-MM/<formato>/AAAA-MM-DD/*.log.json,
// com os nomes e os times dos jogadores. Retenção definida pelo usuário (2026-10-18):
// 30 dias, e os logs de quem exclui a conta saem junto.

export const BATTLE_LOG_RETENTION_DAYS = 30;
const MONTH_DIR = /^\d{4}-\d{2}$/;
const DAY_DIR = /^\d{4}-\d{2}-\d{2}$/;

// Aqui usamos o fs do Node, e não o FS do PS: o FS ignora gravações e remoções com
// Config.nofswriting (ligado nos testes), e estas funções agem numa pasta explícita.
const listDir = (dir: string) => fs.readdir(dir).catch(() => [] as string[]);

/** Pastas de cada dia de logs de batalha. */
async function battleLogDays(logsDir: string) {
	const days: { path: string, date: string }[] = [];
	for (const month of await listDir(logsDir)) {
		if (!MONTH_DIR.test(month)) continue;
		for (const format of await listDir(`${logsDir}/${month}`)) {
			for (const day of await listDir(`${logsDir}/${month}/${format}`)) {
				if (DAY_DIR.test(day)) days.push({ path: `${logsDir}/${month}/${format}/${day}`, date: day });
			}
		}
	}
	return days;
}

/** Apaga os dias de logs de batalha mais antigos que a retenção. Devolve quantos dias saíram. */
export async function cleanupBattleLogs(logsDir = Monitor.logPath('').path, now = new Date()) {
	const limit = new Date(now.getTime() - BATTLE_LOG_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
	let removed = 0;
	for (const day of await battleLogDays(logsDir)) {
		if (day.date >= limit) continue;
		await fs.rm(day.path, { recursive: true, force: true });
		removed++;
	}
	return removed;
}

// --- Modlog: 6 meses, e o IP só 30 dias ---------------------------------------
// O modlog (databases/modlog.db) registra as ações de moderação, com o nome, as alts
// conhecidas e o IP de quem foi punido. Prazos definidos pelo usuário (2026-10-19), por
// legítimo interesse em segurança: o registro fica 6 meses (também depois da exclusão
// da conta), e o IP sai depois de 30 dias.

export const MODLOG_RETENTION_DAYS = 180;
export const MODLOG_IP_RETENTION_DAYS = 30;

type RunQuery = (statement: string, data: (string | number)[]) => Promise<{ changes: number } | null>;

/** Aplica os prazos do modlog. Devolve quantos registros saíram e de quantos saiu o IP. */
export async function cleanupModlog(
	run: RunQuery = (statement, data) => Rooms.Modlog.database.run(statement, data),
	now = Date.now()
) {
	const day = 24 * 60 * 60 * 1000;
	const expired = now - MODLOG_RETENTION_DAYS * day;
	// As alts ficam numa tabela ligada ao registro: saem antes dele
	await run('DELETE FROM alts WHERE modlog_id IN (SELECT modlog_id FROM modlog WHERE timestamp < ?)', [expired]);
	const removed = await run('DELETE FROM modlog WHERE timestamp < ?', [expired]);
	const anonymized = await run(
		'UPDATE modlog SET ip = NULL WHERE ip IS NOT NULL AND timestamp < ?', [now - MODLOG_IP_RETENTION_DAYS * day]
	);
	return { removed: removed?.changes || 0, anonymized: anonymized?.changes || 0 };
}

async function runModlogCleanup() {
	if (!Config.usesqlite || !Config.usesqlitemodlog) return;
	try {
		const { removed, anonymized } = await cleanupModlog();
		if (removed || anonymized) {
			Monitor.notice(`[contas] modlog: ${removed} registro(s) apagado(s), IP removido de ${anonymized}`);
		}
	} catch (err: any) {
		Monitor.crashlog(err, 'The modlog cleanup');
	}
}

/** Apaga os logs de batalha em que o usuário jogou. Devolve quantos arquivos saíram. */
export async function removeBattleLogsOf(userid: ID, logsDir = Monitor.logPath('').path) {
	let removed = 0;
	for (const day of await battleLogDays(logsDir)) {
		for (const file of await listDir(day.path)) {
			if (!file.endsWith('.log.json')) continue;
			const path = `${day.path}/${file}`;
			let data: { [key: string]: unknown };
			try {
				data = JSON.parse(await fs.readFile(path, 'utf8'));
			} catch {
				continue;
			}
			if (['p1', 'p2', 'p3', 'p4'].some(slot => typeof data[slot] === 'string' && toID(data[slot]) === userid)) {
				await fs.rm(path, { force: true });
				removed++;
			}
		}
	}
	return removed;
}

/**
 * Batalhas em andamento da conta excluída terminam com forfeit. O nome volta a ficar
 * livre depois da exclusão dos dados, e uma conta nova com o mesmo nome assumiria o
 * lugar do jogador nessas batalhas. Devolve quantas batalhas foram encerradas.
 */
export function forfeitBattlesOf(userid: ID) {
	let count = 0;
	for (const room of Rooms.rooms.values()) {
		const battle = room.battle;
		if (battle && !battle.ended && battle.playerTable[userid] && battle.forfeit(userid, ' forfeited.')) count++;
	}
	return count;
}

/**
 * Dados do jogador nos bancos SQLite do PS (ligados para o modlog): pontuações de
 * trivia, preferências de mensagens privadas e a autoria de perguntas de trivia. O
 * modlog fica até o prazo dele (legítimo interesse em segurança; decisão do usuário).
 */
async function removeSQLiteDataOf(userid: ID) {
	if (!Config.usesqlite) return;
	await Chat.database.run('DELETE FROM trivia_leaderboard WHERE userid = ?', [userid]);
	await Chat.database.run('DELETE FROM trivia_game_scores WHERE userid = ?', [userid]);
	await Chat.database.run(`UPDATE trivia_questions SET userid = '' WHERE userid = ?`, [userid]);
	await Chat.database.run('DELETE FROM alts_log WHERE to_id = ? OR from_id = ?', [userid, userid]);
	await PrivateMessagesDatabase.run('DELETE FROM pm_settings WHERE userid = ?', [userid]);
	await PrivateMessagesDatabase.run('DELETE FROM offline_pms WHERE sender = ? OR receiver = ?', [userid, userid]);
}

async function purgeAccountData(userid: ID) {
	// Sessão ainda aberta com o nome da conta excluída: volta a ser visitante
	const user = Users.getExact(userid);
	if (user?.named) user.resetName();
	if (Users.globalAuth.has(userid)) Users.globalAuth.delete(userid);
	for (const room of Rooms.rooms.values()) {
		if (room.auth.has(userid)) room.auth.delete(userid);
	}
	forfeitBattlesOf(userid);
	await removeFromLadders(userid);
	await removeBattleLogsOf(userid);
	await removeSQLiteDataOf(userid);
	// Dados dos outros plugins (ex.: jornadas e conquistas do Desafio de Ginásios)
	Chat.runHandlers('onAccountPurge', userid);
}

export async function purgeDeletedAccounts() {
	let reply: InternalReply;
	try {
		reply = await callLoginServer('/internal/purges', {});
	} catch {
		return; // login server fora do ar: tenta de novo no próximo ciclo
	}
	let purged = 0;
	for (const rawUserid of reply.userids || []) {
		const userid = toID(rawUserid);
		try {
			await purgeAccountData(userid);
			await callLoginServer('/internal/purges/done', { userid });
			purged++;
		} catch (err: any) {
			Monitor.crashlog(err, 'An account data purge');
		}
	}
	// LGPD: o log não registra quais contas foram apagadas
	if (purged) Monitor.notice(`[contas] dados de jogo de ${purged} conta(s) excluída(s) apagados`);
}

async function runBattleLogCleanup() {
	try {
		const removed = await cleanupBattleLogs();
		const days = BATTLE_LOG_RETENTION_DAYS;
		if (removed) Monitor.notice(`[privacidade] ${removed} dia(s) de logs de batalha com mais de ${days} dias apagados`);
	} catch (err: any) {
		Monitor.crashlog(err, 'A battle log cleanup');
	}
}

const DAY = 24 * 60 * 60 * 1000;

/** Os timers ficam num global para um hotpatch do chat não criar outros. */
const PURGE_TIMER = Symbol.for('pokemon-showdown-custom.accountPurgeTimer');
const timers = global as unknown as { [PURGE_TIMER]?: NodeJS.Timeout[] };

export function start() {
	for (const timer of timers[PURGE_TIMER] || []) clearTimeout(timer);
	if (!Config.customlogin?.internalUrl) return; // sem login próprio (ex.: testes)
	const list = [
		setTimeout(() => void purgeDeletedAccounts(), PURGE_FIRST_DELAY),
		setInterval(() => void purgeDeletedAccounts(), PURGE_INTERVAL),
		setTimeout(() => void runBattleLogCleanup(), PURGE_FIRST_DELAY),
		setInterval(() => void runBattleLogCleanup(), DAY),
		setTimeout(() => void runModlogCleanup(), PURGE_FIRST_DELAY),
		setInterval(() => void runModlogCleanup(), DAY),
	];
	for (const timer of list) timer.unref();
	timers[PURGE_TIMER] = list;
}

function formatExpiry(expiresAt: number) {
	return new Date(expiresAt * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
}

export const commands: Chat.ChatCommands = {
	invite: 'convite',
	async convite(target, room, user) {
		if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can create invites.`);
		const username = target.trim();
		const reply = await callLoginServer('/internal/invite', username ? { username } : {});
		if (!reply.ok || !reply.code || !reply.url || !reply.expiresAt) {
			throw new Chat.ErrorMessage(reply.error || this.TL`Could not create the invite.`);
		}
		const expiry = formatExpiry(reply.expiresAt);
		const reserved = reply.userid ?
			`${this.TL`Reserved for the username`}: <strong>${Utils.escapeHTML(reply.userid)}</strong><br />` : '';
		this.sendReplyBox(
			`<strong>${this.TL`Invite code`}:</strong> <code>${Utils.escapeHTML(reply.code)}</code><br />` +
			reserved +
			`${this.TL`Valid until ${expiry} (single use).`}<br />` +
			`${this.TL`Sign-up link`}: <a href="${Utils.escapeHTML(reply.url)}">${Utils.escapeHTML(reply.url)}</a><br />` +
			`<small>${this.TL`Only you can see this message. Send the code privately.`}</small>`
		);
		// LGPD: o modlog fica depois da exclusão da conta; não guarda o nome de jogadores
		this.globalModlog('INVITE', null, username ? 'reserved name' : 'open');
	},
	convitehelp: [
		`/convite - Gera um código de convite de uso único (válido por 3 dias). Requer: ~`,
		`/convite [nome] - Gera um convite que só pode ser usado com esse nome de usuário. Requer: ~`,
	],

	resetpassword: 'redefinirsenha',
	async redefinirsenha(target, room, user) {
		if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can reset passwords.`);
		const username = target.trim();
		if (!toID(username)) return this.parse('/help redefinirsenha');
		const reply = await callLoginServer('/internal/reset', { username });
		if (!reply.ok || !reply.code || !reply.url || !reply.expiresAt) {
			throw new Chat.ErrorMessage(reply.error || this.TL`Could not create the reset code.`);
		}
		const expiry = formatExpiry(reply.expiresAt);
		const player = Utils.escapeHTML(reply.username || username);
		this.sendReplyBox(
			`<strong>${this.TL`Password reset code for ${player}`}:</strong> ` +
			`<code>${Utils.escapeHTML(reply.code)}</code><br />` +
			`${this.TL`Valid until ${expiry} (single use).`}<br />` +
			`${this.TL`The player must use it at`} <a href="${Utils.escapeHTML(reply.url)}">${Utils.escapeHTML(reply.url)}</a><br />` +
			`<small>${this.TL`Only you can see this message. Send the code privately.`}</small>`
		);
		this.globalModlog('PASSWORDRESET', null, 'reset code issued');
	},
	redefinirsenhahelp: [
		`/redefinirsenha [nome] - Gera um código de uso único (válido por 24h) para o jogador redefinir a senha. Requer: ~`,
	],

	account: 'conta',
	conta() {
		this.runBroadcast();
		const host = Config.routes?.client || 'localhost';
		this.sendReplyBox(
			`${this.TL`Manage your account (change password, delete account)`}: ` +
			`<a href="https://${host}/conta">https://${host}/conta</a>`
		);
	},
	contahelp: [`/conta - Mostra o link da página da conta (trocar senha, excluir conta).`],
};
