/**
 * pokemon-showdown-custom: Desafio de Ginásios.
 *
 * Cada desafio aberto vira um formato (formats.ts + config/custom-formats.ts). O
 * botão "Battle!" num desses formatos não procura outro jogador: o plugin assume a
 * busca (handler onSearchOverride). Por enquanto (fase 2) ele só valida o time; as
 * jornadas e as batalhas contra os treinadores NPC entram na fase 3.
 *
 * Desenho completo: docs/arquitetura-desafio-ginasios.md (repo pokemon-showdown-custom).
 *
 * @license MIT
 */
import { getStore } from './state';

function gymChallengeId(formatid: string) {
	const format = Dex.formats.get(formatid);
	return format.exists && format.gymChallenge ? Number(format.gymChallenge) : null;
}

async function checkChallengeTeam(user: User, connection: Connection, formatid: string, challengeId: number) {
	const TL = Chat.getTranslator(user.language);
	// Mesma validação de uma busca normal: formato, time, punições, limites de batalhas
	const ready = await Ladders(formatid).prepBattle(connection, 'challenge');
	// O cliente fica em "buscando" até a busca ser cancelada
	Ladders.cancelSearches(user);
	if (!ready || !user.connected) return; // prepBattle já mostrou o motivo
	const challenge = getStore().getChallenge(challengeId);
	if (challenge?.status !== 'open') {
		connection.popup(TL`This challenge is not open.`);
		return;
	}
	const name = challenge.name;
	connection.popup(TL`Your team is valid for the challenge ${name}. Journeys and battles against the trainers are coming soon.`);
}

export const handlers: Chat.Handlers = {
	onSearchOverride(user, connection, formatid) {
		const challengeId = gymChallengeId(formatid);
		if (challengeId === null) return false;
		void checkChallengeTeam(user, connection, formatid, challengeId).catch(err => {
			Monitor.crashlog(err, 'A gym challenge search', { formatid, userid: user.id });
			Ladders.cancelSearches(user);
			const TL = Chat.getTranslator(user.language);
			connection.popup(TL`The challenge could not be started.`);
		});
		return true;
	},
};
