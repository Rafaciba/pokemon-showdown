/**
 * pokemon-showdown-custom: IA dos treinadores NPC do Desafio de Ginásios.
 *
 * `NpcAI` é a interface comum a todos os níveis de dificuldade. Cada nível só
 * precisa transformar um pedido do simulador (`ChoiceRequest`) numa escolha
 * no formato do protocolo ("move 1", "switch 3", "team 123456"...).
 *
 * Níveis: `random`, o bot aleatório padrão do PS (sim/tools/random-player-ai.ts),
 * que não avalia a batalha; `easy`, `medium` e `hard`, as IAs heurísticas
 * (heuristic-ai.ts), que usam o `BattleView` (o que o NPC já viu da batalha); e
 * `master`, as regras do `hard` com pesos aprendidos (master-weights.ts; próprios em dupla) e
 * busca no simulador do PS com um modelo de avaliação para cada tipo de batalha (master-model.ts,
 * sim-search.ts).
 *
 * @license MIT
 */
import { RandomPlayerAI } from '../../../sim/tools/random-player-ai';
import type { ChoiceRequest } from '../../../sim/side';
import type { ObjectReadWriteStream } from '../../../lib/streams';
import type { AILevel } from './levels';
import { HeuristicAI } from './heuristic-ai';
import { masterDoublesWeights, masterWeights } from './master-weights';
import { MASTER_SIM } from './master-model';
import { queryMasterSearch } from './master-search-process';
import { activeMasterModel } from './master-learning';
import { getStore } from './state';

/** Informação pública da batalha vista pelo NPC (linhas do protocolo, sem dados ocultos). */
export interface BattleView {
	readonly log: readonly string[];
}

export interface NpcAI {
	readonly level: AILevel;
	/**
	 * Devolve a escolha para o pedido, ou null se não houver nada a escolher. A Mestre
	 * pode responder com uma Promise (busca no simulador num processo separado).
	 */
	choose(request: ChoiceRequest, view: BattleView): string | null | Promise<string | null>;
}

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
	case 'easy':
	case 'medium':
	case 'hard':
		return new HeuristicAI(level);
	case 'master': {
		// No servidor, a busca no simulador roda num processo separado (master-search-process.ts),
		// com os modelos de avaliação em uso (os das simulações ou retreinados; master-learning.ts)
		const store = getStore();
		const model = activeMasterModel(store, 'singles');
		const doublesModel = activeMasterModel(store, 'doubles');
		const search = model || doublesModel ? { model, doublesModel, sim: MASTER_SIM, remote: queryMasterSearch } : null;
		return new HeuristicAI('master', Math.random, {}, masterWeights(), search, masterDoublesWeights());
	}
	case 'random':
	default:
		return new RandomAI();
	}
}
