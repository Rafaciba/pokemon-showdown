/**
 * pokemon-showdown-custom: Expedição, o modo roguelike da Liga de Desafios.
 *
 * O jogador monta o time ao longo da run, num mapa no estilo Slay the Spire gerado a
 * partir de uma semente, com eventos e encontros. A base serve a várias variações do
 * modo: cada variação (variant.ts, variants.ts) define as regras, o mapa, os tipos de
 * nó (nodes.ts) e os times iniciais.
 *
 * Desenho completo: docs/arquitetura-expedicao.md (repo pokemon-showdown-custom).
 *
 * @license MIT
 */
import { getStore } from './state';
import { resumeBattlesOnLogin } from './battles';
import { expRates } from './progression';
import { listVariants, resolveSettings } from './variant';
import { accountRenameBlockers } from '../custom-accounts';
import './runs';
import './profile';

// Batalha interrompida guarda o nome do jogador no registro de entrada: a troca de nome
// espera ela acabar, como no Desafio
accountRenameBlockers.push(userid => getStore().listUnfinishedBattles(userid).length > 0);

// A calibração da experiência leva até 1 s por variação: feita logo depois da carga,
// e não na primeira vitória de um jogador (fica guardada enquanto o servidor roda).
// Com os números padrão; um ajuste no painel calcula de novo na primeira vitória.
setTimeout(() => {
	for (const variant of listVariants()) {
		try {
			expRates(resolveSettings(variant));
		} catch (err: any) {
			Monitor.crashlog(err, 'An expedition experience calibration', { variant: variant.id });
		}
	}
}, 1000).unref();

export const handlers: Chat.Handlers = {
	onRename(user, oldid, newid) {
		// Batalhas interrompidas voltam quando o jogador entra com a conta (como no Desafio)
		setImmediate(() => {
			const current = Users.getExact(newid);
			if (!current?.named || !current.registered || !current.connected) return;
			try {
				resumeBattlesOnLogin(current);
			} catch (err: any) {
				Monitor.crashlog(err, 'An expedition battle resume', { userid: newid });
			}
		});
	},
	onAccountPurge(userid) {
		// Conta excluída: runs e desbloqueios
		getStore().deleteUserData(userid);
	},
	onAccountRename(oldid, newid) {
		getStore().renameUser(oldid, newid);
	},
};
