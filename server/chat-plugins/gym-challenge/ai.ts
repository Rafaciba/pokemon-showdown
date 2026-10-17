/**
 * pokemon-showdown-custom: IA dos treinadores NPC do Desafio de Ginásios.
 *
 * `NpcAI` é a interface comum a todos os níveis de dificuldade. Cada nível só
 * precisa transformar um pedido do simulador (`ChoiceRequest`) numa escolha
 * no formato do protocolo ("move 1", "switch 3", "team 123456"...).
 *
 * Nível atual: `random`, o bot aleatório padrão do PS (sim/tools/random-player-ai.ts),
 * que não avalia a batalha. Os demais níveis serão definidos depois e podem
 * usar o `BattleView` (o que o NPC já viu da batalha).
 *
 * @license MIT
 */
import { RandomPlayerAI } from '../../../sim/tools/random-player-ai';
import type { ChoiceRequest } from '../../../sim/side';
import type { ObjectReadWriteStream } from '../../../lib/streams';

/** Informação pública da batalha vista pelo NPC (linhas do protocolo, sem dados ocultos). */
export interface BattleView {
	readonly log: readonly string[];
}

export interface NpcAI {
	readonly level: AILevel;
	/** Devolve a escolha para o pedido, ou null se não houver nada a escolher. */
	choose(request: ChoiceRequest, view: BattleView): string | null;
}

export const AI_LEVELS = ['random'] as const;
export type AILevel = typeof AI_LEVELS[number];

/**
 * O RandomPlayerAI do PS foi feito para ler e escrever num stream de batalha.
 * Aqui ele só decide: a escolha é capturada em vez de ir para o stream.
 */
class CapturingRandomPlayerAI extends RandomPlayerAI {
	lastChoice: string | null = null;
	constructor() {
		// O stream nunca é usado: receiveRequest() é chamado diretamente e choose() é sobrescrito
		super(null as unknown as ObjectReadWriteStream<string>);
	}
	override choose(choice: string) {
		this.lastChoice = choice;
	}
}

export class RandomAI implements NpcAI {
	readonly level = 'random';
	private readonly engine = new CapturingRandomPlayerAI();

	choose(request: ChoiceRequest): string | null {
		if (request.wait) return null;
		this.engine.lastChoice = null;
		this.engine.receiveRequest(request);
		return this.engine.lastChoice;
	}
}

export function createAI(level: AILevel): NpcAI {
	switch (level) {
	case 'random':
	default:
		return new RandomAI();
	}
}
