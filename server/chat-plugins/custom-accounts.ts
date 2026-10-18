/**
 * pokemon-showdown-custom: comandos de conta integrados ao login server próprio.
 *
 * - /convite [nome]      (admin) gera um código de convite de uso único
 * - /redefinirsenha nome (admin) gera um código para o jogador redefinir a senha
 * - /conta               link para a página da conta (trocar senha, excluir conta)
 * - exclusão dos dados de jogo de contas excluídas no login (ladder, ranks e o
 *   handler onAccountPurge para os outros plugins), consultada a cada minuto
 *
 * Os códigos são gerados pelo login server (API interna, rede do Docker) e
 * mostrados só para quem executou o comando; nunca vão para logs ou modlog.
 *
 * Configuração (docker/server/config.js): Config.customlogin = {internalUrl, tokenPath}.
 *
 * @license MIT
 */
import { FS, Utils } from '../../lib';
import { LadderStore } from '../ladders-local';

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

async function purgeAccountData(userid: ID) {
	// Sessão ainda aberta com o nome da conta excluída: volta a ser visitante
	const user = Users.getExact(userid);
	if (user?.named) user.resetName();
	if (Users.globalAuth.has(userid)) Users.globalAuth.delete(userid);
	for (const room of Rooms.rooms.values()) {
		if (room.auth.has(userid)) room.auth.delete(userid);
	}
	await removeFromLadders(userid);
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

/** O timer fica num global para um hotpatch do chat não criar um segundo. */
const PURGE_TIMER = Symbol.for('pokemon-showdown-custom.accountPurgeTimer');
const timers = global as unknown as { [PURGE_TIMER]?: { first: NodeJS.Timeout, every: NodeJS.Timeout } };

export function start() {
	const previous = timers[PURGE_TIMER];
	if (previous) {
		clearTimeout(previous.first);
		clearInterval(previous.every);
	}
	if (!Config.customlogin?.internalUrl) return; // sem login próprio (ex.: testes)
	const first = setTimeout(() => void purgeDeletedAccounts(), PURGE_FIRST_DELAY);
	const every = setInterval(() => void purgeDeletedAccounts(), PURGE_INTERVAL);
	first.unref();
	every.unref();
	timers[PURGE_TIMER] = { first, every };
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
		this.globalModlog('INVITE', null, username ? `reserved for ${toID(username)}` : 'open');
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
		this.globalModlog('PASSWORDRESET', toID(username), 'reset code issued');
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
