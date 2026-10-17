/**
 * pokemon-showdown-custom: times dos treinadores NPC.
 *
 * O admin cola o time no formato de exportação do teambuilder; aqui ele é
 * importado, empacotado e validado com o validador do próprio PS, no formato
 * do desafio e, para líderes e Elite 4, com a regra `Force Monotype = <Tipo>`.
 *
 * @license MIT
 */
import { TLkey } from '../../../sim/dex-text';
import type { Challenge } from './store';
import type { Problem } from './rules';

export type ImportResult = { team: string } | { error: Problem };

/** Importa um time em texto (exportação do teambuilder, JSON ou empacotado). */
export function importTeam(text: string): ImportResult {
	const sets = Teams.import(text.trim());
	if (!sets?.length) {
		return { error: { message: TLkey`The team could not be read. Paste it in the teambuilder export format.`, args: [] } };
	}
	return { team: Teams.pack(sets) };
}

/** Formato completo do desafio: formato base + regras extras, na sintaxe do PS. */
export function challengeFormat(challenge: Pick<Challenge, 'baseFormat' | 'customRules'>, extraRules: string[] = []) {
	const rules = [
		...challenge.customRules.split(',').map(rule => rule.trim()).filter(Boolean),
		...extraRules,
	];
	return rules.length ? `${challenge.baseFormat}@@@${rules.join(',')}` : challenge.baseFormat;
}

/**
 * Valida um time empacotado no formato do desafio. `requiredType` aplica
 * `Force Monotype` (líderes e Elite 4); o Campeão não tem restrição de tipo.
 * Devolve a lista de problemas (vazia = válido).
 */
export function validateTeam(
	team: string, challenge: Pick<Challenge, 'baseFormat' | 'customRules'>, requiredType: string | null
): string[] {
	let format: string;
	try {
		format = Dex.formats.validate(challengeFormat(challenge, requiredType ? [`Force Monotype = ${requiredType}`] : []));
	} catch (err: any) {
		return [`Invalid format or rules: ${err.message}`];
	}
	const sets = Teams.unpack(team);
	if (!sets) return [`The team could not be read.`];
	return TeamValidator.get(format).validateTeam(sets) || [];
}

/** Formato livre do PS: aplica só as regras pedidas (usado para checar o tipo sem depender de desafio). */
const TYPE_CHECK_FORMAT = 'gen9customgame';

/**
 * Confere só o tipo do time (todos os Pokémon com o tipo do treinador), sem
 * depender do formato de um desafio. A validação completa no formato de cada
 * desafio acontece ao montar/abrir o desafio.
 */
export function checkTeamType(team: string, type: string): string[] {
	return validateTeam(team, { baseFormat: TYPE_CHECK_FORMAT, customRules: '' }, type);
}

/** Tipos que podem ser tipo de treinador (os 18 tipos jogáveis). */
export function trainerTypes(): string[] {
	return Dex.types.names().filter(name => !['???', 'Stellar'].includes(name));
}

/** Valida só o formato base + regras (sem time), para o formulário do desafio. */
export function checkFormat(challenge: Pick<Challenge, 'baseFormat' | 'customRules'>): Problem | null {
	const base = Dex.formats.get(challenge.baseFormat);
	if (!base.exists || base.effectType !== 'Format') {
		return { message: TLkey`Base format "{0}" not found.`, args: [challenge.baseFormat] };
	}
	if (base.team) {
		return { message: TLkey`Base format "{0}" uses generated teams and cannot be used in a challenge.`, args: [base.name] };
	}
	try {
		Dex.formats.validate(challengeFormat(challenge));
	} catch (err: any) {
		return { message: TLkey`Invalid rules: {0}`, args: [err.message] };
	}
	return null;
}
