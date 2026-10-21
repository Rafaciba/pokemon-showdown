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

export const handlers: Chat.Handlers = {
	onAccountPurge(userid) {
		// Conta excluída: runs e desbloqueios
		getStore().deleteUserData(userid);
	},
	onAccountRename(oldid, newid) {
		getStore().renameUser(oldid, newid);
	},
};
