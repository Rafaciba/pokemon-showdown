/**
 * pokemon-showdown-custom: Desafio de Ginásios.
 *
 * Fase 1 (prova de conceito): o botão "Battle!" num formato de desafio
 * (formatos com `gymChallenge` em config/custom-formats.ts) inicia uma batalha
 * contra um treinador NPC fixo, controlado pelo bot aleatório.
 *
 * Desenho completo: docs/arquitetura-desafio-ginasios.md (repo pokemon-showdown-custom).
 *
 * @license MIT
 */
import { createNpcBattle, NpcBattle } from './npc-battle';
import { createAI } from './ai';

/** Treinador fixo da prova de conceito (na fase 2 vem do banco de treinadores). */
const POC_TRAINER = {
	name: 'Líder Blaine (POC)',
	teamExport: `
Charizard @ Charizardite Y
Ability: Blaze
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Flamethrower
- Solar Beam
- Focus Blast
- Roost

Arcanine @ Leftovers
Ability: Intimidate
EVs: 252 HP / 252 Atk / 4 Spe
Adamant Nature
- Flare Blitz
- Extreme Speed
- Wild Charge
- Morning Sun

Ninetales @ Heat Rock
Ability: Drought
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Fire Blast
- Solar Beam
- Will-O-Wisp
- Nasty Plot
`,
};

function isGymFormat(formatid: string) {
	const format = Dex.formats.get(formatid);
	return format.exists && !!format.gymChallenge;
}

async function startPocBattle(user: User, connection: Connection, formatid: string) {
	// Mesma validação de uma busca normal: formato, time, punições, limites de batalhas
	const ready = await Ladders(formatid).prepBattle(connection, 'challenge');
	if (!ready) {
		// prepBattle já mostrou o motivo; garante que o cliente saia do estado "buscando"
		Ladders.cancelSearches(user);
		return;
	}
	if (!user.connected) return;
	const npcTeam = Teams.pack(Teams.import(POC_TRAINER.teamExport));
	if (!npcTeam) throw new Error(`Time inválido no treinador ${POC_TRAINER.name}`);
	createNpcBattle(user, {
		format: ready.formatid,
		team: ready.settings.team,
		npc: { name: POC_TRAINER.name, team: npcTeam, ai: createAI('random') },
	});
}

export const handlers: Chat.Handlers = {
	onSearchOverride(user, connection, formatid) {
		if (!isGymFormat(formatid)) return false;
		void startPocBattle(user, connection, formatid).catch(err => {
			Monitor.crashlog(err, 'A gym challenge battle start', { formatid, userid: user.id });
			Ladders.cancelSearches(user);
			connection.popup(`Não foi possível iniciar a batalha do desafio.`);
		});
		return true;
	},
	onBattleEnd(battle, winner, players) {
		if (!(battle instanceof NpcBattle)) return;
		// Fase 1: só mostra o resultado; na fase 3 isso atualiza a jornada do jogador
		const challenger = players[0];
		const result = !winner ? 'empate' : winner === challenger ? 'vitória do desafiante' : 'vitória do NPC';
		battle.room.add(`|html|<div class="broadcast-blue"><strong>[POC] Resultado registrado:</strong> ${result}</div>`).update();
	},
};
