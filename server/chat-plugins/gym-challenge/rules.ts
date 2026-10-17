/**
 * pokemon-showdown-custom: regras de configuração do Desafio de Ginásios.
 *
 * Funções puras (sem banco nem estado do servidor), fáceis de testar. Os
 * problemas são mensagens em inglês marcadas com TLkey (para a ferramenta de
 * traduções do PS) com {0}, {1}... nos valores; quem exibe traduz e substitui
 * (ver renderProblem em admin.ts).
 *
 * @license MIT
 */
import { TLkey } from '../../../sim/dex-text';
import type { Challenge, ChallengeInput, PoolEntry, Stage, Trainer } from './store';
import { isAILevel } from './levels';

export const ELITE4_SIZE = 4;
export const MAX_GYMS = 18;
export const NAME_MAX_LENGTH = 40;
export const TURN_SECONDS_MIN = 10;
export const TURN_SECONDS_MAX = 600;
export const LOSS_LIMIT_MAX = 999;

export interface Problem {
	message: string;
	args: (string | number)[];
}

const problem = (message: string, ...args: (string | number)[]): Problem => ({ message, args });

/** Nome exibido do treinador ou do desafio (vira nome de formato no caso do desafio). */
export function checkName(name: string): Problem[] {
	const trimmed = name.trim();
	if (!trimmed) return [problem(TLkey`The name cannot be empty.`)];
	if (trimmed.length > NAME_MAX_LENGTH) {
		return [problem(TLkey`The name can be at most {0} characters long.`, NAME_MAX_LENGTH)];
	}
	// | , ; e [ ] têm significado no protocolo/nome de formato do PS
	if (/[|,;[\]]/.test(trimmed)) return [problem(TLkey`The name cannot contain | , ; [ or ].`)];
	return [];
}

/** Validação dos campos do desafio, independente de treinadores. */
export function checkChallengeSettings(input: ChallengeInput): Problem[] {
	const problems = [...checkName(input.name)];
	if (!input.baseFormat) problems.push(problem(TLkey`Choose a base format.`));
	if (!Number.isInteger(input.gymCount) || input.gymCount < 1 || input.gymCount > MAX_GYMS) {
		problems.push(problem(TLkey`The number of gyms must be between 1 and {0}.`, MAX_GYMS));
	}
	if (!isAILevel(input.baseAILevel)) problems.push(problem(TLkey`Invalid base difficulty.`));
	if (input.timerMode === 'turn') {
		const seconds = input.turnSeconds;
		if (seconds === null || !Number.isInteger(seconds) || seconds < TURN_SECONDS_MIN || seconds > TURN_SECONDS_MAX) {
			problems.push(problem(
				TLkey`The turn time limit must be between {0} and {1} seconds.`, TURN_SECONDS_MIN, TURN_SECONDS_MAX
			));
		}
	}
	if (input.lossLimit !== null &&
		(!Number.isInteger(input.lossLimit) || input.lossLimit < 1 || input.lossLimit > LOSS_LIMIT_MAX)) {
		problems.push(problem(TLkey`The loss limit must be between 1 and {0}, or empty for unlimited.`, LOSS_LIMIT_MAX));
	}
	if (input.eliminateOnElite4Loss && !input.hasElite4) {
		problems.push(problem(TLkey`Elimination on an Elite Four loss requires the challenge to have an Elite Four.`));
	}
	return problems;
}

/** Tipos distintos disponíveis no banco de sorteio. */
export function poolTypes(pool: PoolEntry[], trainers: Map<number, Trainer>): string[] {
	const types = new Set<string>();
	for (const entry of pool) {
		const type = trainers.get(entry.trainerId)?.type;
		if (type) types.add(type);
	}
	return [...types].sort();
}

/**
 * O desafio pode ser aberto? Confere se todas as etapas têm treinador e se os
 * treinadores com papel de tipo (ginásio, Elite 4) têm tipo. A validação dos
 * times no formato fica em teams.ts.
 */
export function checkReadyToOpen(
	challenge: Challenge, stages: Stage[], pool: PoolEntry[], trainers: Map<number, Trainer>
): Problem[] {
	const problems = [...checkChallengeSettings(challenge)];
	const stageAt = (kind: Stage['kind'], position: number) =>
		stages.find(s => s.kind === kind && s.position === position);
	const trainerOf = (stage: Stage | undefined) => (stage?.trainerId ? trainers.get(stage.trainerId) : undefined);
	const checkLevel = (stage: Stage | undefined) => {
		if (stage?.aiLevel && !isAILevel(stage.aiLevel)) problems.push(problem(TLkey`A stage has an invalid difficulty.`));
	};

	if (challenge.typeMode === 'fixed') {
		for (let position = 1; position <= challenge.gymCount; position++) {
			const stage = stageAt('gym', position);
			const trainer = trainerOf(stage);
			if (!trainer) problems.push(problem(TLkey`Gym {0} has no trainer.`, position));
			else if (!trainer.type) problems.push(problem(TLkey`Gym {0}: trainer {1} has no type.`, position, trainer.name));
			checkLevel(stage);
		}
	} else {
		for (const entry of pool) {
			const trainer = trainers.get(entry.trainerId);
			if (!trainer) problems.push(problem(TLkey`The random pool has a trainer that no longer exists.`));
			else if (!trainer.type) problems.push(problem(TLkey`Random pool: trainer {0} has no type.`, trainer.name));
			if (entry.aiLevel && !isAILevel(entry.aiLevel)) problems.push(problem(TLkey`A stage has an invalid difficulty.`));
		}
		const types = poolTypes(pool, trainers).length;
		if (types < challenge.gymCount) {
			problems.push(problem(
				TLkey`The random pool covers {0} types, but the challenge has {1} gyms. Select leaders of more types.`,
				types, challenge.gymCount
			));
		}
	}
	if (challenge.hasElite4) {
		for (let position = 1; position <= ELITE4_SIZE; position++) {
			const stage = stageAt('elite4', position);
			const trainer = trainerOf(stage);
			if (!trainer) problems.push(problem(TLkey`Elite Four member {0} has no trainer.`, position));
			else if (!trainer.type) {
				problems.push(problem(TLkey`Elite Four member {0}: trainer {1} has no type.`, position, trainer.name));
			}
			checkLevel(stage);
		}
	}
	const championStage = stageAt('champion', 1);
	if (!trainerOf(championStage)) problems.push(problem(TLkey`The Champion has no trainer.`));
	checkLevel(championStage);
	return problems;
}
