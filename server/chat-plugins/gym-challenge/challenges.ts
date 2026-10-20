/**
 * pokemon-showdown-custom: configuração dos desafios (painel admin).
 *
 * Junta as regras de rules.ts com a validação dos times (teams.ts) para dizer
 * se um desafio pode ser aberto. Sem HTML: as páginas ficam em admin.ts.
 *
 * @license MIT
 */
import { TLkey } from '../../../sim/dex-text';
import type { Challenge, ChallengeInput, PoolEntry, Stage, Trainer } from './store';
import { checkChallengeSettings, checkReadyToOpen, ELITE4_SIZE, RULES_MAX_LENGTH, type Problem } from './rules';
import { checkFormat, validateTeam } from './teams';
import { challengeFormatName, doublesFormatId } from './formats';

/**
 * Valores iniciais de um desafio novo. O formato padrão é o definido pelo
 * usuário: Pokédex completa (até a gen 9), Mega liberada, sem Tera, Z-Moves e
 * Dynamax. As regras equivalem às do formato da prova de conceito.
 */
export const DEFAULT_CHALLENGE: ChallengeInput = {
	name: '',
	baseFormat: 'gen9nationaldexag',
	customRules: 'Standard NatDex, Terastal Clause, Z-Move Clause, Dynamax Clause',
	typeMode: 'fixed',
	gymCount: 8,
	orderMode: 'free',
	hasElite4: false,
	teamLock: false,
	baseAILevel: 'random',
	timerMode: 'free',
	turnSeconds: null,
	lossLimit: null,
	eliminateOnElite4Loss: false,
	eliminateOnChampionLoss: false,
};

/**
 * Validação dos campos de um desafio a salvar (formulário ou importação): regras,
 * formato base, nome repetido e conflito com formatos existentes. `id` é o do
 * desafio editado (null = desafio novo); `existing`, os desafios já cadastrados.
 */
export function checkChallengeInput(input: ChallengeInput, existing: Challenge[], id: number | null): Problem[] {
	const problems = [...checkChallengeSettings(input)];
	if (input.baseFormat) {
		const formatProblem = checkFormat(input);
		if (formatProblem) problems.push(formatProblem);
		else if (Dex.formats.get(input.baseFormat).gymChallenge) {
			problems.push({ message: TLkey`A challenge format cannot be the base of another challenge.`, args: [] });
		}
	}
	if (input.customRules.length > RULES_MAX_LENGTH) {
		problems.push({ message: TLkey`The extra rules are too long.`, args: [] });
	}
	// O nome vira nome de formato: não pode repetir nem com outra grafia
	if (existing.some(c => c.id !== id && toID(c.name) === toID(input.name))) {
		problems.push({ message: TLkey`There is already a challenge with this name.`, args: [] });
	}
	const formatName = challengeFormatName(input.name, Dex.formats.get(input.baseFormat).mod);
	const existingFormat = Dex.formats.get(formatName);
	// A variante em dupla (treinadores em dupla) também não pode repetir
	const existingDoubles = Dex.formats.get(doublesFormatId(formatName));
	const taken = [existingFormat, existingDoubles].some(format => format.exists && format.gymChallenge !== String(id));
	if (input.name && taken) {
		problems.push({ message: TLkey`This name conflicts with an existing format.`, args: [] });
	}
	return problems;
}

/** Etapas que valem com a configuração atual (as demais ficam fora da validação). */
export function activeStages(challenge: ChallengeInput, stages: Stage[]): Stage[] {
	return stages.filter(stage => {
		if (stage.kind === 'gym') return challenge.typeMode === 'fixed' && stage.position <= challenge.gymCount;
		if (stage.kind === 'elite4') return challenge.hasElite4 && stage.position <= ELITE4_SIZE;
		return stage.position === 1;
	});
}

/**
 * Tudo que impede o desafio de ser aberto: configuração, etapas sem treinador
 * e times que não passam no formato do desafio (com `Force Monotype` para
 * líderes e Elite 4). Lista vazia = pode abrir.
 */
export function challengeProblems(
	challenge: Challenge, stages: Stage[], pool: PoolEntry[], trainers: Map<number, Trainer>
): Problem[] {
	const problems = checkReadyToOpen(challenge, stages, pool, trainers);
	const formatProblem = checkFormat(challenge);
	if (formatProblem) {
		problems.push(formatProblem);
		return problems;
	}
	// O mesmo treinador pode aparecer em mais de uma etapa: valida cada combinação uma vez
	const checked = new Set<string>();
	const checkTeam = (trainerId: number, role: 'typed' | 'champion') => {
		const trainer = trainers.get(trainerId);
		// Sem tipo num papel que exige tipo: checkReadyToOpen já apontou
		if (!trainer || (role === 'typed' && !trainer.type)) return;
		const type = role === 'typed' ? trainer.type : null;
		const key = `${trainerId}:${type || ''}`;
		if (checked.has(key)) return;
		checked.add(key);
		for (const message of validateTeam(trainer.team, challenge, type)) {
			problems.push({ message: TLkey`Team of {0}: {1}`, args: [trainer.name, message] });
		}
	};
	for (const stage of activeStages(challenge, stages)) {
		if (stage.trainerId) checkTeam(stage.trainerId, stage.kind === 'champion' ? 'champion' : 'typed');
	}
	if (challenge.typeMode === 'random') {
		for (const entry of pool) checkTeam(entry.trainerId, 'typed');
	}
	return problems;
}

/**
 * Nome de campo de formulário só com letras (1 → "b", 26 → "ba"). O cliente
 * clássico só limpa marcadores `{a-z}` não preenchidos no data-submitsend.
 */
export function fieldKey(n: number) {
	return n.toString(26).split('').map(digit => String.fromCharCode(97 + parseInt(digit, 26))).join('');
}
