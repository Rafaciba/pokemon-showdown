/**
 * pokemon-showdown-custom: processo da busca da IA Mestre no simulador.
 *
 * A busca no simulador (sim-search.ts) usa até ~1 s de CPU por jogada. No processo
 * principal, isso travaria o servidor para todos; por isso ela roda num processo
 * filho (QueryProcessManager do PS, o mesmo mecanismo do /dexsearch). A Mestre
 * calcula a jogada das regras na hora e pede a busca aqui; se a resposta não vier
 * no prazo, ou der erro, vale a jogada das regras.
 *
 * Processos: Config.subprocesses.gymmaster (padrão 1). Sem processos (testes,
 * ferramentas), a busca roda no próprio processo.
 *
 * @license MIT
 */
import * as ConfigLoader from '../../config-loader';
import { ProcessManager } from '../../../lib';
import type { ChoiceRequest, MoveRequest } from '../../../sim/side';
import { readBattleState } from './battle-view';
import { simSearchDoubles, simSearchForcedSwitch, simSearchMove, type SimSearchOptions } from './sim-search';
import type { ValueModel } from './value-model';

export interface MasterSearchQuery {
	/** move/switch: batalhas individuais; doubles: pedido de jogada em dupla. */
	kind: 'move' | 'switch' | 'doubles';
	request: ChoiceRequest;
	log: readonly string[];
	ruleChoice: string | null;
	options: SimSearchOptions;
	/** Modelo de avaliação em uso (vai em cada consulta: o processo não lê o banco). */
	model: ValueModel;
}

/** Folga além do tempo da busca antes de desistir e usar a jogada das regras. */
const GRACE_MS = 1500;

export const PM = new ProcessManager.QueryProcessManager<MasterSearchQuery, { choice: string | null }>(
	'gymmastersearch', module, query => {
		try {
			const state = readBattleState(query.log);
			const request = query.request as MoveRequest;
			let choice: string | null;
			if (query.kind === 'doubles') {
				choice = query.ruleChoice && simSearchDoubles(request, state, query.model, query.options, query.ruleChoice);
			} else if (query.kind === 'switch') {
				choice = simSearchForcedSwitch(request, state, query.model, query.options);
			} else {
				choice = simSearchMove(request, state, query.model, query.options, query.ruleChoice);
			}
			return { choice };
		} catch (err: any) {
			Monitor.crashlog(err, 'A gym challenge master search', { kind: query.kind });
			return { choice: query.ruleChoice };
		}
	}, 30 * 1000
);

if (!PM.isParentProcess) {
	// Processo filho: o mínimo para o simulador e o Dex
	ConfigLoader.ensureLoaded();
	global.Monitor = {
		crashlog(error: Error, source = 'A gym master search process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	} as any;
	global.Dex = require('../../../sim/dex').Dex;
	global.toID = Dex.toID;
	global.Teams = require('../../../sim/teams').Teams;
	Dex.includeData();
}

/**
 * Pede a busca ao processo. Resolve com a escolha da busca ou, sem resposta no prazo
 * ou com erro, com a jogada das regras.
 */
export function queryMasterSearch(query: MasterSearchQuery): Promise<string | null> {
	return new Promise(resolve => {
		const timer = setTimeout(() => resolve(query.ruleChoice), query.options.budgetMs + GRACE_MS);
		PM.query(query).then(result => {
			clearTimeout(timer);
			resolve(result?.choice ?? query.ruleChoice);
		}, () => {
			clearTimeout(timer);
			resolve(query.ruleChoice);
		});
	});
}

export function start(processCount: ConfigLoader.SubProcessesConfig) {
	// "gymmaster" é nosso: fora da lista de tipos de processo da Smogon (config-loader.ts)
	PM.spawn((processCount as { [type: string]: number | undefined })['gymmaster'] ?? 1);
}

export function destroy() {
	void PM.destroy();
}
