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
import { RoomBattle, type RoomBattleOptions, type RoomBattlePlayerOptions } from '../../room-battle';
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
	/**
	 * A sala foi fechada sem a batalha terminar (ex.: expirou com o jogador fora).
	 * Com estado salvo, a batalha pode ser retomada; sem ele, não conta.
	 */
	onInterrupted?: () => void;
	/** A batalha não vale (ex.: quem jogou não era o dono da jornada). */
	onVoid?: () => void;
	/**
	 * Save state: input log do simulador a cada ponto de decisão do desafiante, sem
	 * as linhas de chat da sala (minimização de dados). Reproduzir o log no simulador
	 * remonta a batalha no mesmo ponto, inclusive a sorte (a semente está no log).
	 */
	onSave?: (inputLog: string) => void;
}

interface NpcBattleOptions extends RoomBattleOptions {
	npc: NpcSpec;
	hooks: NpcBattleHooks;
	/** Desafiante dono da batalha (o resultado só vale para ele). */
	ownerid: ID;
}

/** O NPC é sempre o jogador 2; o desafiante, o jogador 1. */
const NPC_SLOT = 'p2';
/**
 * Batalhas contra NPC são sempre públicas (requisito do Desafio de Ginásios). O PS
 * já tem o mecanismo: com forcedSettings.privacy, /private, /hidden e /modjoin são
 * recusados na batalha.
 */
const FORCED_PUBLIC = 'Gym Challenge';
/** Jogadas inválidas seguidas antes de cair na jogada padrão do simulador. */
const MAX_INVALID_CHOICES = 3;

/** Remove do input log as mensagens de chat da sala (não fazem parte da batalha). */
export function battleStateFromInputLog(inputLog: readonly string[]): string {
	return inputLog.filter(line => !line.startsWith('>chat ')).join('\n');
}

export class NpcBattle extends RoomBattle {
	declare options: NpcBattleOptions;
	private npcLog: string[] = [];
	private invalidChoices = 0;
	private saving = false;
	private saveAgain = false;
	/**
	 * Batalha retomada: o simulador reproduz o log salvo e manda os pedidos de jogada
	 * de cada ponto antigo. O NPC só responde depois da reprodução (ver finishReplay).
	 */
	private replaying = !!this.options.inputLog;

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
		this.forcedSettings.privacy = FORCED_PUBLIC;
	}

	/**
	 * O lado do NPC (jogador só com nome) entra com o sprite já na primeira linha
	 * "|player|": o RoomBattle só conhece o avatar de quem tem usuário, e sem isso o
	 * cliente desenha um avatar qualquer até chegar uma edição. Chamado pelo
	 * construtor do RoomBattle, que já guardou as opções (os campos desta classe
	 * ainda não existem aqui).
	 */
	override addPlayer(user: User | string | null, playerOpts?: RoomBattlePlayerOptions | null) {
		if (typeof user !== 'string' || !playerOpts) return super.addPlayer(user, playerOpts);
		const player = super.addPlayer(user, null);
		if (!player) return null;
		const options = {
			name: player.name,
			avatar: this.options.npc?.avatar || '',
			team: playerOpts.team || undefined,
			rating: 0,
		};
		void this.stream.write(`>player ${player.slot} ${JSON.stringify(options)}`);
		player.hasTeam = true;
		return player;
	}

	override checkForcedUserSettings(user: User) {
		super.checkForcedUserSettings(user);
		// O PS só força a privacidade em batalhas com ranking; aqui ela é sempre forçada
		this.forcedSettings.privacy = FORCED_PUBLIC;
	}

	/**
	 * Ninguém entra na batalha. O lado do NPC não tem usuário, e o PS o trataria como
	 * vaga livre: o desafiante (rank ☆, que tem joinbattle) poderia colocar um amigo
	 * no lugar do NPC com /addplayer, e o amigo daria forfeit. /addplayer,
	 * /acceptbattle, /joingame e /restoreplayers passam todos por aqui.
	 */
	override joinGame(user: User) {
		user.popup(`Battles against gym trainers can't be joined.`);
		return false;
	}

	/** O desafiante não sai da batalha (passar o lado 1 para outra pessoa); para desistir, /forfeit. */
	override leaveGame(user: User) {
		user.popup(`You can't leave a battle against a gym trainer. Use /forfeit to give up.`);
		return false;
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
			// Defesa extra: o resultado só conta se quem jogou foi o dono da jornada
			if (challenger !== this.options.ownerid) {
				this.options.hooks.onVoid?.();
				return;
			}
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
			// Log público (o que um espectador vê): base para IAs que avaliam a batalha.
			// Cada "|split|<lado>" vem seguido da linha privada daquele lado (ex.: HP exato
			// do jogador) e depois da pública: a privada fica de fora.
			let skipSecret = false;
			for (const line of lines.slice(1)) {
				if (line.startsWith('|split|')) {
					skipSecret = true;
					continue;
				}
				if (skipSecret) {
					skipSecret = false;
					continue;
				}
				if (line.startsWith('|')) this.npcLog.push(line);
			}
		} else if (lines[0] === 'sideupdate' && lines[1] === 'p1') {
			// Novo ponto de decisão do desafiante: tudo o que já foi jogado está no log
			if (lines[2].startsWith('|request|')) void this.saveState();
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

	/**
	 * Pede o input log ao simulador e entrega ao gancho onSave. Pedidos que chegam
	 * durante um salvamento viram um só salvamento extra, com o log mais novo.
	 */
	private async saveState() {
		if (!this.options.hooks.onSave) return;
		if (this.saving) {
			this.saveAgain = true;
			return;
		}
		this.saving = true;
		try {
			do {
				this.saveAgain = false;
				const inputLog = await this.getInputLog();
				if (this.ended || !this.room || !inputLog?.length) break;
				this.options.hooks.onSave(battleStateFromInputLog(inputLog));
			} while (this.saveAgain);
		} catch (err: any) {
			// getInputLog é rejeitado quando a sala fecha no meio do pedido: nada a salvar
			if (this.room) Monitor.crashlog(err, 'A gym challenge battle save', { roomid: this.roomid });
		} finally {
			this.saving = false;
		}
	}

	/**
	 * Fim da reprodução do log salvo. O simulador responde aos comandos em ordem: quando
	 * chega a resposta deste pedido de log, todos os pedidos antigos já passaram, e o
	 * pedido pendente do NPC é o atual.
	 */
	async finishReplay() {
		try {
			await this.getInputLog();
		} catch {
			return; // sala fechada durante a reprodução
		}
		this.replaying = false;
		this.scheduleNpcChoice();
	}

	/** Responde fora da pilha do receive(), para não reentrar no processamento do stream. */
	private scheduleNpcChoice(forced?: string) {
		if (this.replaying) return;
		setImmediate(() => {
			if (this.ended || !this.room || this.replaying) return;
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
	/** Time empacotado do desafiante, já validado (Ladders.prepBattle). Ignorado com inputLog. */
	team: string;
	/** Retomar a batalha a partir do estado salvo (onSave), em vez de começar do zero. */
	inputLog?: string;
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

	const resuming = !!settings.inputLog;
	const options: NpcBattleOptions = {
		format: settings.format,
		// Na retomada, os times já estão no log: sem time, o simulador só confirma nome e avatar
		players: resuming ? [
			{ user: human },
			{ user: settings.npc.name as unknown as User },
		] : [
			{ user: human, team: settings.team },
			// Jogador sem usuário: o RoomBattle aceita só o nome (ver RoomBattle.addPlayer)
			{ user: settings.npc.name as unknown as User, team: settings.npc.team },
		],
		inputLog: settings.inputLog,
		delayedStart: true,
		rated: 0,
		challengeType: 'challenge',
		npc: settings.npc,
		hooks: settings.hooks || {},
		ownerid: human.id,
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
	if (resuming) {
		void battle.finishReplay();
	} else {
		Monitor.countBattle(human.latestIp, human.name);
	}
	return room;
}
