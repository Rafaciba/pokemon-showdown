/**
 * pokemon-showdown-custom: processo do retreino da IA Mestre (master-learning.ts).
 *
 * O retreino (sobretudo as batalhas simuladas da verificação) pode levar perto de
 * uma hora de CPU. Ele roda num processo filho criado só para isso e encerrado no
 * fim, para não travar o servidor nem ocupar memória fora do treino. Sem
 * subprocessos (Config.subprocesses = 0), o retreino é recusado: rodar no processo
 * principal travaria o servidor.
 *
 * Agenda: toda segunda-feira às 4h (Brasília), conferida a cada 10 minutos. O painel
 * também pode pedir um retreino (view-ginasiosadmin-mestre).
 *
 * @license MIT
 */
import * as ConfigLoader from '../../config-loader';
import { ProcessManager } from '../../../lib';
import { getStore } from './state';
import { isTrainingWindow, runTraining, type TrainingSummary } from './master-learning';

interface TrainingQuery {
	trigger: 'schedule' | 'manual';
}

export const PM = new ProcessManager.QueryProcessManager<TrainingQuery, TrainingSummary>(
	'gymmastertrain', module, query => runTraining(getStore(), { trigger: query.trigger }), 3 * 60 * 60 * 1000
);

if (!PM.isParentProcess) {
	ConfigLoader.ensureLoaded();
	global.Monitor = {
		crashlog(error: Error, source = 'A gym master training process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	} as any;
	global.Dex = require('../../../sim/dex').Dex;
	global.toID = Dex.toID;
	global.Teams = require('../../../sim/teams').Teams;
	Dex.includeData();
}

let running: Promise<TrainingSummary | null> | null = null;

export function isTrainingRunning() {
	return !!running;
}

/**
 * Pede um retreino no processo filho. Devolve false se já há um em andamento ou se
 * não é possível criar o processo; a Promise do resultado fica em `running`.
 */
export function requestTraining(trigger: 'schedule' | 'manual', onDone?: (summary: TrainingSummary | null) => void) {
	if (running) return false;
	const process = PM.processes.length ? PM.acquire() : PM.spawnOne();
	if (!process) return false;
	running = PM.query({ trigger }, process).then(summary => summary, (err: any) => {
		Monitor.crashlog(err, 'A gym master training');
		return null;
	}).finally(() => {
		running = null;
		void PM.unspawn();
	});
	void running.then(summary => onDone?.(summary));
	return true;
}

let timer: NodeJS.Timeout | null = null;

export function start() {
	if (!PM.isParentProcess || timer) return;
	timer = setInterval(() => {
		try {
			if (!isTrainingWindow(new Date()) || running) return;
			// Uma vez por janela: nada iniciado nas últimas 20 horas
			const last = getStore().listTrainings(1)[0];
			if (last && Date.now() / 1000 - last.startedAt < 20 * 60 * 60) return;
			requestTraining('schedule');
		} catch (err: any) {
			Monitor.crashlog(err, 'The gym master training schedule');
		}
	}, 10 * 60 * 1000);
	timer.unref();
}

export function destroy() {
	if (timer) clearInterval(timer);
	timer = null;
	void PM.destroy();
}
