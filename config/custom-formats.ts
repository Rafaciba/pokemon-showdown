// pokemon-showdown-custom: formatos próprios, somados aos oficiais de config/formats.ts
// (ver o comentário no topo de config/formats.ts e sim/dex-formats.ts → mergeFormatLists).
//
// Formatos com o campo `gymChallenge` são assumidos pelo plugin
// server/chat-plugins/gym-challenge: o botão "Battle!" não procura outro jogador
// (na fase 3, inicia a batalha da jornada contra um treinador NPC).

import { Formats as OfficialFormats } from './formats';
import { buildChallengeFormats, FORMAT_SECTION } from '../server/chat-plugins/gym-challenge/formats';
import { buildExpeditionFormats } from '../server/chat-plugins/expedition/formats';

declare module '../sim/dex-formats' {
	interface Format {
		/** pokemon-showdown-custom: id do desafio de ginásio deste formato (ver plugin gym-challenge) */
		gymChallenge?: string;
		/**
		 * pokemon-showdown-custom: formato nosso (não oficial). O servidor sinaliza isso ao
		 * cliente (bit 512 do código de exibição em server/rooms.ts → formatListText), e o
		 * menu de formatos do nosso cliente mostra esses formatos antes dos oficiais.
		 */
		customFormat?: boolean;
		/**
		 * pokemon-showdown-custom: id do formato que o teambuilder do nosso cliente usa
		 * para geração, Pokédex e busca (o formato base de um desafio). Enviado ao
		 * cliente em `|customformats|` (server/rooms.ts → customFormatsText).
		 */
		teambuilderBase?: string;
		/**
		 * pokemon-showdown-custom: variante em dupla do formato de um desafio (treinadores
		 * em dupla). Fica fora do menu; só as batalhas da jornada a usam.
		 */
		gymDoubles?: boolean;
		/**
		 * pokemon-showdown-custom: variação da Expedição (modo roguelike) deste formato.
		 * Formatos escondidos, usados só pelas batalhas das runs.
		 */
		expedition?: string;
	}
}

type FormatList = import('../sim/dex-formats').FormatList;
type FormatData = import('../sim/dex-formats').FormatData;

/** Marca como nossos todos os formatos da lista (as seções passam como estão). */
function markCustom(list: FormatList): FormatList {
	return list.map(entry => ('name' in entry ? { ...entry, customFormat: true } : entry));
}

/**
 * Desafio de Ginásios: um formato por desafio aberto, gerado a partir do banco do
 * plugin (server/chat-plugins/gym-challenge/formats.ts). O plugin recarrega os
 * formatos quando o admin abre, encerra, reabre ou altera um desafio aberto.
 */
const officialFormats = OfficialFormats.filter((entry): entry is FormatData => 'name' in entry);

export const Formats: FormatList = markCustom([
	{
		section: FORMAT_SECTION,
		column: 4,
	},
	// Simulações fora do servidor (banco de testes e treino da IA Mestre) não precisam
	// dos formatos de desafio nem do banco do plugin
	...(process.env.GYM_CHALLENGE_FORMATS === 'off' ? [] : buildChallengeFormats(officialFormats)),
	// Expedição: um formato escondido por variação (e a variante em dupla), sem banco: vêm do código
	...buildExpeditionFormats(officialFormats),
]);
