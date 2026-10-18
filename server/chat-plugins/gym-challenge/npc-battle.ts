/**
 * pokemon-showdown-custom: batalha de um jogador contra um treinador NPC.
 *
 * O servidor do PS não tem bots próprios: todo lado de batalha pertence a um
 * usuário conectado. Aqui o lado p2 é um jogador sem usuário (o `RoomBattle`
 * aceita jogadores só com nome), cujo time vai direto para o simulador e cujos
 * pedidos de jogada (`sideupdate` → `|request|`) são respondidos por uma `NpcAI`.
 *
 * Todo o acoplamento com o código interno de `RoomBattle` fica neste arquivo,
 * para que mudanças do upstream sejam corrigidas num lugar só.
 *
 * @license MIT
 */
import { RoomBattle, type RoomBattleOptions } from '../../room-battle';
import type { ChoiceRequest } from '../../../sim/side';
import type { BattleView, NpcAI } from './ai';

/** Resultado do ponto de vista do desafiante (o jogador 1). */
export type NpcBattleResult = 'win' | 'loss' | 'tie';

export interface NpcSpec {
	/** Nome exibido na batalha (ex.: "Líder Brock"). */
	name: string;
	/** Time empacotado (Teams.pack), já validado pelo admin. */
	team: string;
	avatar?: string;
	ai: NpcAI;
}

export interface NpcBattleHooks {
	/** A batalha terminou (inclusive por forfeit ou timer). */
	onEnd?: (result: NpcBattleResult) => void;
	/** A sala foi fechada sem a batalha terminar (ex.: expirou ou o servidor encerrou). */
	onInterrupted?: () => void;
}

interface NpcBattleOptions extends RoomBattleOptions {
	npc: NpcSpec;
	hooks: NpcBattleHooks;
}

/** O NPC é sempre o jogador 2; o desafiante, o jogador 1. */
const NPC_SLOT = 'p2';
/** Jogadas inválidas seguidas antes de cair na jogada padrão do simulador. */
const MAX_INVALID_CHOICES = 3;

export class NpcBattle extends RoomBattle {
	declare options: NpcBattleOptions;
	private npcLog: string[] = [];
	private invalidChoices = 0;

	get npc(): NpcSpec {
		return this.options.npc;
	}

	/**
	 * Chamado pelo construtor do RoomBattle. Com `delayedStart`, o start original
	 * não exige usuário em todos os lados e não dispara os eventos de início;
	 * aqui completamos o início considerando só o desafiante como usuário.
	 */
	override start() {
		super.start();
		// Sem isso, o lado do NPC contaria como desconectado (timer de inatividade/W.O.)
		const npcPlayer = this[NPC_SLOT];
		npcPlayer.active = true;
		npcPlayer.knownActive = true;

		const human = this.p1.getUser();
		// O aviso de batalha no lobby (Config.reportbattles) lista a identidade de cada
		// jogador; o NPC não tem usuário, então só o nome dele entra. A função só usa
		// mais dados do jogador em batalhas com ranking, e estas nunca têm.
		const npcIdentity = { getIdentity: () => ` ${this.npc.name}` } as unknown as User;
		Rooms.global.onCreateBattleRoom(human ? [human, npcIdentity] : [], this.room, { rated: this.rated });
		this.started = true;
		this.checkActive();
	}

	/**
	 * Limite de tempo por turno, sem limite total (opção do desafio): o saldo começa
	 * em `seconds` e volta a `seconds` a cada turno. Ligado pelo servidor, o timer
	 * não pode ser desligado pelo jogador. Feito aqui, e não com as regras de timer
	 * do formato, porque elas limitam o acréscimo por turno a 30 s.
	 */
	useTurnTimer(seconds: number) {
		Object.assign(this.timer.settings, {
			starting: seconds, addPerTurn: seconds, maxPerTurn: seconds, maxFirstTurn: seconds, accelerate: false,
		});
		for (const player of this.players) {
			player.secondsLeft = seconds + this.timer.settings.grace;
			player.turnSecondsLeft = player.secondsLeft;
		}
		this.timer.start();
	}

	override async end(winnerName: unknown) {
		if (this.ended) return;
		const challenger = this.p1.id;
		await super.end(winnerName);
		const winnerid = toID(winnerName);
		const result: NpcBattleResult = !winnerid ? 'tie' : winnerid === challenger ? 'win' : 'loss';
		try {
			this.options.hooks.onEnd?.(result);
		} catch (err: any) {
			Monitor.crashlog(err, 'A gym challenge battle end', { roomid: this.roomid });
		}
	}

	override destroy() {
		if (!this.ended) {
			try {
				this.options.hooks.onInterrupted?.();
			} catch (err: any) {
				Monitor.crashlog(err, 'A gym challenge battle interruption', { roomid: this.roomid });
			}
		}
		super.destroy();
	}

	override receive(lines: string[]) {
		super.receive(lines);
		if (lines[0] === 'update') {
			// Log público (o que um espectador vê): base para IAs que avaliam a batalha
			for (const line of lines.slice(1)) {
				if (line.startsWith('|') && !line.startsWith('|split|')) this.npcLog.push(line);
			}
		} else if (lines[0] === 'sideupdate' && lines[1] === NPC_SLOT) {
			if (lines[2].startsWith('|request|')) {
				this.invalidChoices = 0;
				this.scheduleNpcChoice();
			} else if (lines[2].startsWith('|error|[Invalid choice]')) {
				this.invalidChoices++;
				this.scheduleNpcChoice(this.invalidChoices >= MAX_INVALID_CHOICES ? 'default' : undefined);
			}
		}
	}

	/** Responde fora da pilha do receive(), para não reentrar no processamento do stream. */
	private scheduleNpcChoice(forced?: string) {
		setImmediate(() => {
			if (this.ended || !this.room) return;
			const player = this[NPC_SLOT];
			const pending = player.request;
			if (!pending.request || pending.isWait) return;

			let choice: string | null = forced ?? null;
			if (!choice) {
				try {
					const request = JSON.parse(pending.request) as ChoiceRequest;
					const view: BattleView = { log: this.npcLog };
					choice = this.npc.ai.choose(request, view);
				} catch (err: any) {
					Monitor.crashlog(err, 'A gym challenge NPC AI', { roomid: this.roomid });
					choice = 'default';
				}
			}
			if (!choice) return;
			// Mesmo efeito do RoomBattle.choose(), que exige um usuário
			pending.isWait = true;
			pending.choice = choice;
			void this.stream.write(`>${NPC_SLOT} ${choice}`);
		});
	}
}

export interface NpcBattleSettings {
	format: string;
	/** Time empacotado do desafiante, já validado (Ladders.prepBattle). */
	team: string;
	npc: NpcSpec;
	title?: string;
	hooks?: NpcBattleHooks;
	/** Limite de tempo por turno em segundos; sem valor = tempo livre (timer desligado). */
	turnSeconds?: number | null;
}

/**
 * Cria a sala e a batalha. Segue os mesmos passos de Rooms.createBattle, que não
 * pode ser usado aqui porque exige um usuário real em cada lado.
 */
export function createNpcBattle(human: User, settings: NpcBattleSettings): GameRoom | null {
	if (Rooms.global.lockdown === true) {
		human.popup("The server is restarting. Battles will be available again in a few minutes.");
		return null;
	}
	Ladders.cancelSearches(human);

	const options: NpcBattleOptions = {
		format: settings.format,
		players: [
			{ user: human, team: settings.team },
			// Jogador sem usuário: o RoomBattle aceita só o nome (ver RoomBattle.addPlayer)
			{ user: settings.npc.name as unknown as User, team: settings.npc.team },
		],
		delayedStart: true,
		rated: 0,
		challengeType: 'challenge',
		npc: settings.npc,
		hooks: settings.hooks || {},
	};
	const title = settings.title || `${human.name} vs. ${settings.npc.name}`;
	const roomid = Rooms.global.prepBattleRoom(settings.format);
	const room = Rooms.createGameRoom(roomid, title, { ...options, title, isPersonal: true });
	const battle = new NpcBattle(room, options);
	room.game = battle;
	// Batalhas contra NPC são sempre públicas (requisito do Desafio de Ginásios): as
	// preferências de privacidade do jogador não são aplicadas aqui

	human.joinRoom(room);
	if (settings.turnSeconds) battle.useTurnTimer(settings.turnSeconds);
	Monitor.countBattle(human.latestIp, human.name);
	return room;
}
