/**
 * pokemon-showdown-custom: Desafio de Ginásios.
 *
 * Cada desafio aberto vira um formato (formats.ts + config/custom-formats.ts). O
 * botão "Battle!" num desses formatos não procura outro jogador: o plugin assume a
 * busca (handler onSearchOverride) e inicia a batalha da jornada contra o
 * treinador NPC da etapa atual (runs.ts).
 *
 * Desenho completo: docs/arquitetura-desafio-ginasios.md (repo pokemon-showdown-custom).
 *
 * @license MIT
 */
import { startStageBattle } from './runs';
import { getStore } from './state';
import { renderProblem } from './admin';

function gymChallengeId(formatid: string) {
	const format = Dex.formats.get(formatid);
	return format.exists && format.gymChallenge ? Number(format.gymChallenge) : null;
}

export const handlers: Chat.Handlers = {
	onSearchOverride(user, connection, formatid) {
		const challengeId = gymChallengeId(formatid);
		if (challengeId === null) return false;
		const TL = Chat.getTranslator(user.language);
		void startStageBattle(user, connection, formatid, challengeId).then(problem => {
			// O cliente fica em "buscando" até a busca ser cancelada
			Ladders.cancelSearches(user);
			if (problem) connection.popup(renderProblem(TL, problem));
		}, err => {
			Monitor.crashlog(err, 'A gym challenge battle start', { formatid, userid: user.id });
			Ladders.cancelSearches(user);
			connection.popup(TL`The challenge could not be started.`);
		});
		return true;
	},
	onAccountPurge(userid) {
		// Conta excluída: jornadas, batalhas e conquistas (que vêm das jornadas vencidas)
		getStore().deleteUserData(userid);
	},
};
