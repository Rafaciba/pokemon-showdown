// pokemon-showdown-custom: formatos próprios, somados aos oficiais de config/formats.ts
// (ver o comentário no topo de config/formats.ts e sim/dex-formats.ts → mergeFormatLists).
//
// Formatos com o campo `gymChallenge` são assumidos pelo plugin
// server/chat-plugins/gym-challenge: o botão "Battle!" inicia uma batalha contra
// um treinador NPC em vez de procurar outro jogador.

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
	}
}

type FormatList = import('../sim/dex-formats').FormatList;

/** Marca como nossos todos os formatos da lista (as seções passam como estão). */
function markCustom(list: FormatList): FormatList {
	return list.map(entry => ('name' in entry ? { ...entry, customFormat: true } : entry));
}

export const Formats: FormatList = markCustom([
	{
		section: "Desafio de Ginásios",
		column: 4,
	},
	{
		// Fase 1 (prova de conceito): formato fixo de teste. Na fase 2, cada desafio
		// criado pelo admin vira um formato gerado a partir do banco do plugin.
		name: "[Desafio] Teste POC",
		desc: `Prova de conceito do Desafio de Ginásios: batalha contra um treinador NPC.`,
		mod: 'gen9',
		// Padrão do projeto: Pokédex completa (National Dex), Mega liberada, sem Z-Moves, Dynamax e Tera
		ruleset: ['Standard NatDex', 'Terastal Clause', 'Z-Move Clause', 'Dynamax Clause'],
		searchShow: true,
		challengeShow: false,
		tournamentShow: false,
		rated: false,
		gymChallenge: 'poc',
	},
]);
