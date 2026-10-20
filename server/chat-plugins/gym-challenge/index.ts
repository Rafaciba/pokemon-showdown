/**
 * pokemon-showdown-custom: Desafio de Ginásios.
 *
 * Cada desafio aberto vira um formato (formats.ts + config/custom-formats.ts). O
 * botão "Battle!" num desses formatos não procura outro jogador: o plugin assume a
 * busca (handler onSearchOverride) e inicia a batalha da jornada contra o
 * treinador NPC da etapa atual (runs.ts).
 *
 * Save state: as batalhas da jornada são salvas a cada jogada. Uma batalha que perde
 * a sala (servidor reiniciado, sala expirada) fica suspensa e é retomada quando o
 * jogador entra com a conta (handler onRename), pelo "Battle!" ou pela página.
 *
 * Desenho completo: docs/arquitetura-desafio-ginasios.md (repo pokemon-showdown-custom).
 *
 * @license MIT
 */
import { resumeSavedBattles, startStageBattle } from './runs';
import { getStore } from './state';
import { renderProblem } from './admin';
import { accountRenameBlockers } from '../custom-accounts';

// Batalha salva (suspensa) guarda o nome do jogador: a troca de nome espera ela acabar
accountRenameBlockers.push(userid => getStore().listSavedBattles(userid).length > 0);

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
			Monitor.crashlog(err, 'A gym challenge battle start', { formatid });
			Ladders.cancelSearches(user);
			connection.popup(TL`The challenge could not be started.`);
		});
		return true;
	},
	onRename(user, oldid, newid) {
		// O PS chama antes de juntar a conexão nova ao usuário já conectado: espera terminar
		setImmediate(() => {
			const current = Users.getExact(newid);
			if (!current?.named || !current.registered || !current.connected) return;
			try {
				const TL = Chat.getTranslator(current.language);
				for (const problem of resumeSavedBattles(current)) current.popup(renderProblem(TL, problem));
			} catch (err: any) {
				Monitor.crashlog(err, 'A gym challenge battle resume', { userid: newid });
			}
		});
	},
	onAccountPurge(userid) {
		// Conta excluída: jornadas, batalhas e conquistas (que vêm das jornadas vencidas)
		getStore().deleteUserData(userid);
	},
	onAccountRename(oldid, newid) {
		getStore().renameUser(oldid, newid);
	},
};
