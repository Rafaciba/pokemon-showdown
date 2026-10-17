/**
 * pokemon-showdown-custom: comandos de conta integrados ao login server próprio.
 *
 * - /convite [nome]      (admin) gera um código de convite de uso único
 * - /redefinirsenha nome (admin) gera um código para o jogador redefinir a senha
 * - /conta               link para a página da conta (trocar senha, excluir conta)
 *
 * Os códigos são gerados pelo login server (API interna, rede do Docker) e
 * mostrados só para quem executou o comando; nunca vão para logs ou modlog.
 *
 * Configuração (docker/server/config.js): Config.customlogin = {internalUrl, tokenPath}.
 *
 * @license MIT
 */
import { FS, Utils } from '../../lib';

interface InternalReply {
	ok: boolean;
	error?: string;
	code?: string;
	expiresAt?: number;
	url?: string;
	userid?: string | null;
	username?: string;
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
