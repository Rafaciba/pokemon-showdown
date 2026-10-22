/**
 * pokemon-showdown-custom: painel do admin do Desafio de Ginásios.
 *
 * Páginas dentro do cliente (só rank ~; para os demais a página "não existe"):
 *   view-ginasiosadmin                    início do painel (desafios)
 *   view-ginasiosadmin-treinadores        banco de treinadores NPC
 *   view-ginasiosadmin-treinador-<id>     criar ("novo") / editar treinador
 *   view-ginasiosadmin-sprites-<id>-<página>-<por página>[-<busca>]  galeria de sprites do treinador
 *   view-ginasiosadmin-desafio-<id>       criar ("novo") / editar / abrir / encerrar desafio
 *   view-ginasiosadmin-jornadas-<id>      jornadas do desafio (encerrar a de um jogador)
 *   view-ginasiosadmin-convites           convites (gerar, listar, revogar) e redefinição de senha
 *   view-ginasiosadmin-seguranca[-<tipo>-<conta>-<antes de>]  trilha de segurança do login (30 dias)
 *   view-ginasiosadmin-pacotes            importar e exportar pacotes de treinadores e desafios (transfer.ts)
 *   view-ginasiosadmin-importar           prévia e resultado da importação
 *   view-ginasiosadmin-exportar-<desafios>-<treinadores>  pacote gerado (ids separados por "x"; 0 = nenhum)
 *   view-ginasiosadmin-mestre             IA Mestre: modelo em uso, dados, retreinos e reversão (master-learning.ts)
 *
 * Visual: apenas elementos que o cliente oficial já estiliza (pad, ladder,
 * button, textbox, psicon, formatselect), como nas páginas oficiais do PS.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { TLkey, type Translator } from '../../../sim/dex-text';
import { getStore, isAdmin } from './state';
import { ELITE4_SIZE, NAME_MAX_LENGTH, RULES_MAX_LENGTH, TITLE_MAX_LENGTH, type Problem } from './rules';
import { normalizeTeamText, trainerTypes } from './teams';
import { activeStages, challengeProblems, checkChallengeInput, DEFAULT_CHALLENGE, fieldKey } from './challenges';
import { AI_LEVELS, isAILevel } from './levels';
import { LEVEL_STRENGTH, strengthRate } from './level-strength';
import {
	applyImport, canImport, checkTrainer, exportPack, planHasProblems, planImport, type ImportPlan,
} from './transfer';
import { reloadFormats } from './reload';
import { badgeIcon, badgeLabel, badgeOptions, getBadge } from './badges';
import { isTrainerSprite, searchTrainerSprites, spriteQuery, trainerSpriteImg } from './trainer-sprites';
import { closeRun, runState } from './runs';
import { formatDate, profileButton, runStatusLabel } from './player';
import { callLoginServer, formatExpiry, inviteBox, loginLang, resetBox } from '../custom-accounts';
import { activeMasterModel, BATTLE_KINDS, MIN_NEW_BATTLES, VERIFICATION_MIN_SCORE } from './master-learning';
import { isTrainingRunning, requestTraining } from './master-training-process';
import type {
	Challenge, ChallengeInput, ChallengeStatus, GymStore, StageKind, Trainer, TrainerInput,
} from './store';

const PAGE = 'view-ginasiosadmin';
/** Sprites por página da galeria. */
/** Sprites por página na galeria (escolha na própria galeria; padrão 48). */
const SPRITE_PAGE_SIZES = [24, 48, 96, 192];
const SPRITES_PER_PAGE = 48;

function spritePageSize(value: unknown) {
	const size = Number(value);
	return SPRITE_PAGE_SIZES.includes(size) ? size : SPRITES_PER_PAGE;
}

/**
 * Abre uma página da galeria de sprites no lugar da que estava aberta: o número da
 * página faz parte do id, e sem isso cada página (ou busca) abriria uma aba nova.
 */
function openSpriteGallery(
	context: Chat.CommandContext, user: User, target: number | 'novo', page: number, size: number, q: string
) {
	const prefix = `${PAGE.slice('view-'.length)}-sprites-${target}-`;
	for (const conn of user.connections) {
		for (const open of [...conn.openPages || []]) {
			if (!open.startsWith(prefix)) continue;
			conn.send(`>view-${open}\n|deinit`);
			conn.openPages!.delete(open);
		}
	}
	return context.parse(`/join ${PAGE}-sprites-${target}-${page}-${size}${q ? `-${q}` : ''}`);
}
/**
 * Tamanho máximo de um pacote colado: o PS descarta mensagens acima de 100 KB
 * (sockets.ts), e o comando também vai na mensagem.
 */
const PACK_MAX_LENGTH = 95 * 1024;

/** Traduz uma mensagem marcada com TLkey e substitui {0}, {1}... */
export function renderProblem(TL: Translator, problem: Problem) {
	return TL(problem.message).replace(/\{(\d+)\}/g, (match, index) => {
		const value = problem.args[Number(index)];
		return value === undefined ? match : String(value);
	});
}

// --- Rascunhos de formulário ---------------------------------------------
// O cliente clássico troca o formulário enviado por "Submitted!". Se o
// salvamento falha na validação, guardamos o que foi enviado para a página
// voltar preenchida (só em memória, por usuário e página, e usado uma vez).

type FormValues = Record<string, string>;
const drafts = new Map<string, FormValues>();

function saveDraft(user: User, page: string, values: FormValues) {
	drafts.set(`${user.id}|${page}`, values);
}

function takeDraft(user: User, page: string) {
	const key = `${user.id}|${page}`;
	const values = drafts.get(key);
	drafts.delete(key);
	return values;
}

// --- Códigos gerados na página de convites --------------------------------
// O código (convite ou redefinição) só existe em claro no momento em que é gerado:
// o login guarda só o hash. Ele aparece uma única vez, na próxima vez que a página
// de convites é desenhada, e sai da memória. Se a página não for aberta, some em 10 min.

const ISSUED_TTL = 10 * 60 * 1000;
const issuedCodes = new Map<ID, { html: string, at: number }>();

function keepIssued(user: User, html: string) {
	const now = Date.now();
	for (const [id, entry] of issuedCodes) {
		if (now - entry.at > ISSUED_TTL) issuedCodes.delete(id);
	}
	issuedCodes.set(user.id, { html, at: now });
}

function takeIssued(user: User) {
	const entry = issuedCodes.get(user.id);
	issuedCodes.delete(user.id);
	return entry && Date.now() - entry.at <= ISSUED_TTL ? entry.html : '';
}

// --- Importação de pacotes --------------------------------------------------
// O pacote colado fica na memória (por usuário, 30 min) entre a prévia e a
// confirmação, e é validado de novo ao confirmar. O resultado aparece uma vez.

const IMPORT_TTL = 30 * 60 * 1000;

class UserMemo<T> {
	private readonly entries = new Map<ID, { value: T, at: number }>();

	set(user: User, value: T) {
		const now = Date.now();
		for (const [id, entry] of this.entries) {
			if (now - entry.at > IMPORT_TTL) this.entries.delete(id);
		}
		this.entries.set(user.id, { value, at: now });
	}

	get(user: User) {
		const entry = this.entries.get(user.id);
		return entry && Date.now() - entry.at <= IMPORT_TTL ? entry.value : undefined;
	}

	take(user: User) {
		const value = this.get(user);
		this.entries.delete(user.id);
		return value;
	}
}

const pendingImports = new UserMemo<string>();
const importResults = new UserMemo<string>();

/**
 * Abre a página em foco: um /join numa aba já aberta só atualiza o conteúdo,
 * então a aba é fechada antes (em todas as conexões do usuário).
 */
function reopenPage(context: Chat.CommandContext, user: User, page: string) {
	for (const conn of user.connections) {
		if (!conn.openPages?.has(page)) continue;
		conn.send(`>view-${page}\n|deinit`);
		conn.openPages.delete(page);
	}
	return context.parse(`/join view-${page}`);
}

// --- Trilha de segurança --------------------------------------------------

/** Tipos de evento do login (login/src/security-events.ts), com o nome mostrado. */
function securityEventTypes(TL: Translator): [string, string][] {
	return [
		['loginfailed', TL`Wrong password`],
		['loginblocked', TL`Blocked: too many password attempts`],
		['codefailed', TL`Invalid invite or reset code`],
		['accountcreated', TL`Account created`],
		['passwordchanged', TL`Password changed`],
		['resetissued', TL`Reset code issued`],
		['resetused', TL`Password reset with a code`],
		['accountdeleted', TL`Account deleted`],
		['accountrenamed', TL`Account renamed`],
		['inviteissued', TL`Invite issued`],
		['inviterevoked', TL`Invite revoked`],
		['csrfrejected', TL`Form from another site refused`],
		['ratelimited', TL`Too many requests`],
		['internalunauthorized', TL`Internal API without a valid token`],
	];
}

/** Onde o evento aconteceu (gravado pelo login) ou o caminho pedido. */
function securityDetail(TL: Translator, type: string, detail: string | null) {
	if (type === 'accountrenamed' && detail) {
		const previous = Utils.escapeHTML(detail);
		return TL`previous name: ${previous}`;
	}
	switch (detail) {
	case null: return '';
	case 'login': return TL`login`;
	case 'senha': return TL`password change`;
	case 'excluir': return TL`account deletion`;
	case 'convite': return TL`sign-up`;
	case 'redefinicao': return TL`password reset`;
	default: return Utils.escapeHTML(detail);
	}
}

// --- Elementos de página --------------------------------------------------

function teamIcons(team: string) {
	const sets = Teams.unpack(team) || [];
	return sets.map(set => `<psicon pokemon="${Utils.escapeHTML(set.species)}" />`).join('');
}

function typeIcon(type: string | null) {
	return type ? `<psicon type="${Utils.escapeHTML(type)}" />` : '';
}

/** <select> com a opção atual primeiro (o cliente clássico não preserva "selected"). */
export function selectBox(name: string, options: [string, string][], current: string) {
	const sorted = [
		...options.filter(([value]) => value === current),
		...options.filter(([value]) => value !== current),
	];
	return `<select name="${name}">` + sorted.map(([value, label]) => (
		`<option value="${Utils.escapeHTML(value)}">${label}</option>`
	)).join('') + `</select>`;
}

function navButtons(TL: Translator) {
	return `<p>` +
		`<button class="button" name="gymGo" value="${PAGE}">${TL`Admin panel`}</button> ` +
		`<button class="button" name="gymGo" value="${PAGE}-treinadores">${TL`Trainers`}</button> ` +
		`<button class="button" name="gymGo" value="${PAGE}-convites">${TL`Invites`}</button> ` +
		`<button class="button" name="gymGo" value="${PAGE}-seguranca">${TL`Security`}</button> ` +
		`<button class="button" name="gymGo" value="${PAGE}-pacotes">${TL`Import and export`}</button> ` +
		`<button class="button" name="gymGo" value="${PAGE}-mestre">${TL`Master AI`}</button> ` +
		// Painel da Expedição (decisão do usuário: dentro deste painel; a página é do plugin da Expedição)
		`<button class="button" name="gymGo" value="view-expedicao-admin">${TL`Expedition`}</button>` +
		`</p>`;
}

function problemList(TL: Translator, problems: Problem[]) {
	return `<ul>` + problems.map(p => `<li>${Utils.escapeHTML(renderProblem(TL, p))}</li>`).join('') + `</ul>`;
}

function statusLabel(TL: Translator, status: ChallengeStatus) {
	if (status === 'open') return TL`Open`;
	if (status === 'closed') return TL`Closed`;
	return TL`Draft`;
}

export function aiLevelLabel(TL: Translator, level: string) {
	if (level === 'random') return TL`Random (default bot)`;
	if (level === 'easy') return TL`Easy`;
	if (level === 'medium') return TL`Medium`;
	if (level === 'hard') return TL`Hard`;
	if (level === 'master') return TL`Master`;
	return Utils.escapeHTML(level);
}

function levelOptions(TL: Translator): [string, string][] {
	return [['', TL`(challenge base)`], ...AI_LEVELS.map(level => [level, aiLevelLabel(TL, level)] as [string, string])];
}

/**
 * Nome do formato como o cliente mostra (BattleLog.formatName): sem o prefixo
 * da geração atual. O seletor oficial usa esse texto quando o admin troca o formato.
 */
export function formatLabel(formatid: string) {
	const format = Dex.formats.get(formatid);
	const name = format.exists ? format.name : formatid;
	const prefix = `[Gen ${Dex.gen}`;
	if (name.startsWith(`${prefix}] `)) return name.slice(prefix.length + 2);
	if (name.startsWith(`${prefix} `)) return `[${name.slice(prefix.length + 1)}`;
	return name;
}

/** Seletor de insígnia: as do tipo do treinador primeiro; vazio = ícone do tipo. */
function badgeSelect(TL: Translator, name: string, type: string | null, current: string | null) {
	const options: [string, string][] = badgeOptions(type).map(badge => [
		badge.id, Utils.escapeHTML(badgeLabel(badge) + (badge.type ? ` - ${badge.type}` : '')),
	]);
	return selectBox(name, [['', TL`(type icon)`], ...options], current || '');
}

/** Imagem da insígnia escolhida (catálogo), ou o ícone do tipo. */
function chosenBadgeIcon(badgeId: string | null, type: string | null) {
	const badge = getBadge(badgeId);
	return badgeIcon({ name: badge?.name ?? null, image: badge?.image ?? null }, type, 32);
}

function trainerLabel(trainer: Trainer) {
	return Utils.escapeHTML(trainer.name) + (trainer.type ? ` (${trainer.type})` : '');
}

/** Prévia da importação: o que entra, o que é pulado (nome já existe) e os erros. */
function importPreview(TL: Translator, plan: ImportPlan) {
	if (plan.problems.length) return problemList(TL, plan.problems);
	let buf = '';
	if (plan.trainers.length) {
		buf += `<h3>${TL`Trainers`}</h3><div class="ladder"><table><tr><th>${TL`Name`}</th>` +
			`<th>${TL`Trainer type`}</th><th>${TL`Team`}</th><th>${TL`Result`}</th></tr>`;
		for (const trainer of plan.trainers) {
			// Pulado: mostra o treinador do banco, que é o que os desafios vão usar
			const input = trainer.input || (trainer.existing.length === 1 ? trainer.existing[0] : null);
			let result = TL`New`;
			if (trainer.action === 'skip') result = TL`Already in the bank: skipped`;
			else if (trainer.problems.length) result = `<strong>${TL`Error`}</strong>` + problemList(TL, trainer.problems);
			buf += `<tr><td>${input ? `${trainerSpriteImg(input.avatar, 40)} ` : ''}${Utils.escapeHTML(trainer.name)}` +
				(input?.doubles ? `<br /><small>${TL`Doubles`}</small>` : '') + `</td>` +
				`<td>${typeIcon(input?.type || null)}</td><td>${input ? teamIcons(input.team) : ''}</td><td>${result}</td></tr>`;
		}
		buf += `</table></div>`;
	}
	if (plan.challenges.length) {
		buf += `<h3>${TL`Challenges`}</h3><div class="ladder"><table><tr><th>${TL`Name`}</th><th>${TL`Result`}</th></tr>`;
		for (const challenge of plan.challenges) {
			let result: string;
			if (challenge.action === 'skip') {
				result = TL`A challenge with this name already exists: skipped`;
			} else if (challenge.problems.length) {
				result = `<strong>${TL`Error`}</strong>` + problemList(TL, challenge.problems);
			} else if (challenge.notReady.length) {
				const count = challenge.notReady.length;
				result = TL`New (draft)` + `<details><summary>${TL`Before opening (${count})`}</summary>` +
					problemList(TL, challenge.notReady) + `</details>`;
			} else {
				result = TL`New (draft)` + `<br /><small>${TL`Ready to open.`}</small>`;
			}
			buf += `<tr><td>${Utils.escapeHTML(challenge.name)}</td><td>${result}</td></tr>`;
		}
		buf += `</table></div>`;
	}
	return buf;
}

/** Resultado de um retreino da IA Mestre. */
function trainingOutcome(TL: Translator, outcome: string | null) {
	if (outcome === 'accepted') return TL`New model in use`;
	if (outcome === 'rejected') return TL`Rejected`;
	if (outcome === 'skipped') return TL`Skipped`;
	if (outcome === 'failed') return TL`Failed`;
	return TL`In progress`;
}

/** Nome do tipo de batalha dos dados e modelos da Mestre. */
function battleKindLabel(TL: Translator, kind: string) {
	return kind === 'doubles' ? TL`Doubles` : TL`Singles`;
}

/** Tabela da força dos níveis (level-strength.ts): vitórias do nível da linha contra o da coluna. */
function levelStrengthTable(TL: Translator, kind: 'singles' | 'doubles') {
	let buf = `<div class="ladder"><table><tr><th></th>`;
	for (const opponent of AI_LEVELS) buf += `<th>${aiLevelLabel(TL, opponent)}</th>`;
	buf += `</tr>`;
	for (const level of AI_LEVELS) {
		buf += `<tr><th>${aiLevelLabel(TL, level)}</th>`;
		for (const opponent of AI_LEVELS) {
			const rate = strengthRate(kind, level, opponent);
			buf += `<td>${rate === null ? '-' : `${Math.round(rate * 100)}%`}</td>`;
		}
		buf += `</tr>`;
	}
	return buf + `</table></div>`;
}

/** Detalhes de um retreino: motivo e números da verificação. */
function trainingDetails(TL: Translator, report: AnyObject | null) {
	if (!report) return '';
	const parts: string[] = [];
	if (report.reason === 'fewbattles') {
		const fresh = Number(report.fresh) || 0;
		const minimum = Number(report.minimum) || 0;
		parts.push(TL`only ${fresh} new battles (minimum ${minimum})`);
	} else if (report.reason === 'noholdout') {
		parts.push(TL`not enough battles to test the model`);
	} else if (report.reason === 'error' || report.reason === 'nomodel') {
		parts.push(TL`error during the retraining (see the crash log)`);
	}
	if (typeof report.newLoss === 'number' && typeof report.currentLoss === 'number') {
		const trainBattles = Number(report.trainBattles) || 0;
		const holdoutBattles = Number(report.holdoutBattles) || 0;
		const newLoss = report.newLoss.toFixed(4);
		const currentLoss = report.currentLoss.toFixed(4);
		parts.push(TL`${trainBattles} battles for training, ${holdoutBattles} for testing`);
		parts.push(TL`prediction error: new ${newLoss}, current ${currentLoss} (lower is better)`);
	}
	if (typeof report.verificationScore === 'number') {
		const score = Math.round(report.verificationScore * 100);
		const battles = Number(report.verificationBattles) || 0;
		parts.push(TL`${score}% against the current model in ${battles} simulated battles`);
	}
	return parts.map(part => Utils.escapeHTML(part)).join('<br />');
}

function trainerMap(store: GymStore) {
	return new Map(store.listTrainers().map(trainer => [trainer.id, trainer]));
}

// --- Formulário do desafio --------------------------------------------------

/** Campos do formulário do desafio, na ordem do comando (as regras vão por último: podem ter vírgulas). */
const CHALLENGE_FIELDS = [
	'name', 'format', 'typemode', 'gyms', 'order', 'elite', 'lock', 'level', 'timer', 'seconds', 'losses',
	'elimelite', 'elimchamp', 'rules',
] as const;

function challengeValues(challenge: ChallengeInput): FormValues {
	const yesNo = (value: boolean) => (value ? 'yes' : 'no');
	return {
		name: challenge.name,
		format: challenge.baseFormat,
		typemode: challenge.typeMode,
		gyms: String(challenge.gymCount),
		order: challenge.orderMode,
		elite: yesNo(challenge.hasElite4),
		lock: yesNo(challenge.teamLock),
		level: challenge.baseAILevel,
		timer: challenge.timerMode,
		seconds: challenge.turnSeconds === null ? '' : String(challenge.turnSeconds),
		losses: challenge.lossLimit === null ? '' : String(challenge.lossLimit),
		elimelite: yesNo(challenge.eliminateOnElite4Loss),
		elimchamp: yesNo(challenge.eliminateOnChampionLoss),
		rules: challenge.customRules,
	};
}

/** Converte os valores enviados. Números inválidos viram NaN e são apontados por checkChallengeSettings. */
function challengeInput(values: FormValues): ChallengeInput {
	const number = (text: string) => (/^\d+$/.test(text.trim()) ? Number(text.trim()) : NaN);
	const timerMode = values.timer === 'turn' ? 'turn' : 'free';
	return {
		name: values.name.trim(),
		baseFormat: toID(values.format),
		customRules: values.rules.split(',').map(rule => rule.trim()).filter(Boolean).join(', '),
		typeMode: values.typemode === 'random' ? 'random' : 'fixed',
		gymCount: number(values.gyms),
		orderMode: values.order === 'fixed' ? 'fixed' : 'free',
		hasElite4: values.elite === 'yes',
		teamLock: values.lock === 'yes',
		baseAILevel: values.level,
		timerMode,
		turnSeconds: timerMode === 'turn' ? number(values.seconds) : null,
		lossLimit: values.losses.trim() ? number(values.losses) : null,
		eliminateOnElite4Loss: values.elimelite === 'yes',
		eliminateOnChampionLoss: values.elimchamp === 'yes',
	};
}

function challengeForm(TL: Translator, id: number | 'novo', values: FormValues) {
	const yesNo: [string, string][] = [['yes', TL`Yes`], ['no', TL`No`]];
	const placeholders = CHALLENGE_FIELDS.map(field => `{${field}}`).join(',');
	const field = (label: string, control: string, hint = '') => (
		`<p><label class="label">${label}:<br />${control}</label>` + (hint ? `<br /><small>${hint}</small>` : '') + `</p>`
	);
	const textbox = (name: string, maxlength: number, width = '') => (
		`<input name="${name}" class="textbox" maxlength="${maxlength}" value="${Utils.escapeHTML(values[name])}"` +
		(width ? ` style="width: ${width}"` : '') + ` />`
	);
	const formatControl = `<formatselect name="format" format="${Utils.escapeHTML(toID(values.format))}">` +
		`${Utils.escapeHTML(formatLabel(values.format))}</formatselect>`;
	const rulesHint = TL`Pokémon Showdown rules, separated by commas. E.g.: - Mega, Min Source Gen = 3. ` +
		TL`The default allows the full Pokédex and Mega Evolution, without Tera, Z-Moves and Dynamax.`;
	const levels = AI_LEVELS.map(level => [level, aiLevelLabel(TL, level)] as [string, string]);
	return [
		`<form data-submitsend="/ginasioadmin salvardesafio ${id},${placeholders}">`,
		field(TL`Name`, textbox('name', NAME_MAX_LENGTH)),
		`<h3>${TL`Battle rules`}</h3>`,
		// Seletor de formato oficial do cliente (o mesmo da tela principal)
		field(TL`Base format`, formatControl, TL`For the free format, choose [Gen 9] Custom Game.`),
		field(TL`Extra rules`, textbox('rules', RULES_MAX_LENGTH, '100%'), rulesHint),
		`<h3>${TL`Gyms`}</h3>`,
		field(TL`Gym types`, selectBox('typemode', [
			['fixed', TL`Fixed (one trainer per gym)`],
			['random', TL`Random (drawn for each journey)`],
		], values.typemode)),
		field(TL`Number of gyms`, textbox('gyms', 2, '4em')),
		field(TL`Gym order`, selectBox('order', [
			['free', TL`Free`],
			['fixed', TL`Fixed (in the order of the gyms)`],
		], values.order)),
		field(TL`Elite Four`, selectBox('elite', yesNo, values.elite),
			TL`The Elite Four and the Champion are fought in a row; a loss at any point goes back to the first member.`),
		`<h3>${TL`Journey`}</h3>`,
		field(TL`Team lock`, selectBox('lock', yesNo, values.lock),
			TL`With the lock, the challenger uses the same team for the whole journey (nicknames and order may change).`),
		field(TL`Base difficulty`, selectBox('level', levels, values.level),
			TL`Minimum difficulty for every trainer in this challenge.`),
		field(TL`Timer`, selectBox('timer', [
			['free', TL`Free time (no limit)`],
			['turn', TL`Time limit per turn`],
		], values.timer), TL`The total battle time is never limited.`),
		field(TL`Seconds per turn`, textbox('seconds', 3, '4em'), TL`Only with a time limit per turn.`),
		field(TL`Loss limit`, textbox('losses', 3, '4em'), TL`Total losses in the journey. Empty = unlimited.`),
		field(TL`Eliminated on an Elite Four loss`, selectBox('elimelite', yesNo, values.elimelite)),
		field(TL`Eliminated on a Champion loss`, selectBox('elimchamp', yesNo, values.elimchamp)),
		`<p><button class="button" type="submit"><strong>${TL`Save challenge`}</strong></button></p>`,
		`</form>`,
	].join('');
}

/** Resumo só de leitura (desafios encerrados). */
function challengeSummary(TL: Translator, challenge: Challenge) {
	const yesNo = (value: boolean) => (value ? TL`Yes` : TL`No`);
	const typeMode = challenge.typeMode === 'random' ?
		TL`Random (drawn for each journey)` : TL`Fixed (one trainer per gym)`;
	const order = challenge.orderMode === 'fixed' ? TL`Fixed (in the order of the gyms)` : TL`Free`;
	const timer = challenge.timerMode === 'turn' ? TL`Time limit per turn` : TL`Free time (no limit)`;
	const rows: [string, string][] = [
		[TL`Base format`, Utils.escapeHTML(formatLabel(challenge.baseFormat))],
		[TL`Extra rules`, Utils.escapeHTML(challenge.customRules) || '-'],
		[TL`Gym types`, typeMode],
		[TL`Number of gyms`, String(challenge.gymCount)],
		[TL`Gym order`, order],
		[TL`Elite Four`, yesNo(challenge.hasElite4)],
		[TL`Team lock`, yesNo(challenge.teamLock)],
		[TL`Base difficulty`, aiLevelLabel(TL, challenge.baseAILevel)],
		[TL`Timer`, timer + (challenge.turnSeconds ? ` (${challenge.turnSeconds}s)` : '')],
		[TL`Loss limit`, challenge.lossLimit === null ? TL`unlimited` : String(challenge.lossLimit)],
		[TL`Eliminated on an Elite Four loss`, yesNo(challenge.eliminateOnElite4Loss)],
		[TL`Eliminated on a Champion loss`, yesNo(challenge.eliminateOnChampionLoss)],
	];
	return `<div class="ladder"><table>` +
		rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('') +
		`</table></div>`;
}

// --- Treinadores do desafio ---------------------------------------------------
// Busca, filtros e ordenação dos treinadores rodam no navegador (client-custom.js),
// sem recarregar a página, para não perder o que ainda não foi salvo. O servidor só
// marca os elementos com classes: "gym-pool" (tabela do sorteio), "gym-pool-name",
// "gym-pool-type" e "gym-pool-level" (células), "gym-filter-text", "gym-filter-type" e
// "gym-filter-checked" (filtros), botões "gymSort" (títulos das colunas) e
// "gym-select-filter" (busca por nome ao lado de uma lista de treinadores).

/** Botão de ordenação no título de uma coluna da tabela do sorteio. */
function sortButton(key: string, label: string, title = '') {
	return `<button type="button" name="gymSort" value="${key}" class="gym-sort"${title ? ` title="${title}"` : ''} ` +
		`style="background: none; border: 0; padding: 0; font-weight: bold; cursor: pointer">${label}</button>`;
}

/** Campo de busca por nome que filtra a lista de treinadores logo depois dele. */
function selectFilter(TL: Translator) {
	return `<input type="text" class="textbox gym-select-filter" size="12" placeholder="${TL`Search by name`}" ` +
		`aria-label="${TL`Search by name`}" />`;
}

/** Ícones do time com o nome de cada Pokémon (dica ao passar o mouse e busca por Pokémon). */
function teamIconsWithNames(team: string) {
	const sets = Teams.unpack(team) || [];
	return sets.map(set => {
		const species = Utils.escapeHTML(set.species);
		return `<psicon pokemon="${species}" title="${species}" />`;
	}).join('');
}

function stageName(TL: Translator, kind: StageKind, position: number) {
	if (kind === 'gym') return TL`Gym ${position}`;
	if (kind === 'elite4') return TL`Elite Four ${position}`;
	return TL`Champion`;
}

/** Formulário de atribuição: etapas (tipos fixos) ou banco de sorteio, mais Elite 4 e Campeão. */
function stagesForm(TL: Translator, store: GymStore, challenge: Challenge) {
	const trainers = store.listTrainers();
	const typed = trainers.filter(trainer => trainer.type);
	const stages = store.getStages(challenge.id);
	const stageAt = (kind: StageKind, position: number) =>
		stages.find(stage => stage.kind === kind && stage.position === position);
	const fields: string[] = [];

	const stageRow = (kind: StageKind, position: number, candidates: Trainer[]) => {
		const stage = stageAt(kind, position);
		const key = `${kind}${fieldKey(position)}`;
		fields.push(`${key}={${key}}`, `${key}level={${key}level}`);
		const trainer = stage?.trainerId ? trainers.find(t => t.id === stage.trainerId) : undefined;
		let badge = '';
		if (kind === 'gym') {
			fields.push(`${key}badge={${key}badge}`);
			const type = trainer?.type || null;
			badge = `<td>${badgeSelect(TL, `${key}badge`, type, stage?.badgeId || null)} ` +
				`${chosenBadgeIcon(stage?.badgeId || null, type)}</td>`;
		}
		return `<tr><td>${stageName(TL, kind, position)}</td>` +
			`<td>${trainerSpriteImg(trainer?.avatar, 40)} ${selectFilter(TL)} ` +
			`${selectBox(key, [['', TL`(none)`], ...candidates.map(t => [String(t.id), trainerLabel(t)] as [string, string])],
				String(stage?.trainerId || ''))}</td>` +
				`<td>${selectBox(`${key}level`, levelOptions(TL), stage?.aiLevel || '')}</td>` + badge +
				`<td>${trainer ? teamIcons(trainer.team) : ''}</td></tr>`;
	};
	const header = `<tr><th></th><th>${TL`Trainer`}</th><th>${TL`Difficulty`}</th><th>${TL`Team`}</th></tr>`;
	const gymHeader = `<tr><th></th><th>${TL`Trainer`}</th><th>${TL`Difficulty`}</th><th>${TL`Badge`}</th>` +
		`<th>${TL`Team`}</th></tr>`;

	let gyms: string;
	if (challenge.typeMode === 'fixed') {
		gyms = `<div class="ladder"><table>${gymHeader}`;
		for (let position = 1; position <= challenge.gymCount; position++) gyms += stageRow('gym', position, typed);
		gyms += `</table></div>`;
	} else {
		const pool = new Map(store.getPool(challenge.id).map(entry => [entry.trainerId, entry]));
		const gymCount = challenge.gymCount;
		const types = [...new Set(typed.map(trainer => trainer.type!))].sort();
		const filterLabel = TL`Search by name or Pokémon`;
		gyms = `<p><small>${TL`Select the leaders that can be drawn. Each journey draws one leader for each of ${gymCount} different types.`}</small></p>` +
			`<p><input type="text" class="textbox gym-filter-text" size="28" placeholder="${filterLabel}" aria-label="${filterLabel}" /> ` +
			`<select class="gym-filter-type" aria-label="${TL`Trainer type`}"><option value="">${TL`All types`}</option>` +
			types.map(type => `<option value="${Utils.escapeHTML(type)}">${Utils.escapeHTML(type)}</option>`).join('') +
			`</select> <select class="gym-filter-checked" aria-label="${TL`Selection`}">` +
			`<option value="">${TL`All trainers`}</option><option value="checked">${TL`Selected only`}</option>` +
			`<option value="unchecked">${TL`Not selected only`}</option></select></p>` +
			`<p><small>${TL`Click a column title to sort.`}</small></p>` +
			`<div class="ladder"><table class="gym-pool"><tr><th>${sortButton('checked', '&#10003;', TL`Selected first`)}</th>` +
			`<th>${sortButton('name', TL`Trainer`)}</th><th>${sortButton('type', TL`Trainer type`)}</th>` +
			`<th>${sortButton('level', TL`Difficulty`)}</th><th>${TL`Badge`}</th><th>${TL`Team`}</th></tr>`;
		const byType = [...typed].sort((a, b) => a.type!.localeCompare(b.type!) || a.name.localeCompare(b.name));
		for (const trainer of byType) {
			const key = `pool${fieldKey(trainer.id)}`;
			fields.push(`${key}={${key}}`, `${key}level={${key}level}`, `${key}badge={${key}badge}`);
			const entry = pool.get(trainer.id);
			const type = Utils.escapeHTML(trainer.type!);
			gyms += `<tr><td><input type="checkbox" name="${key}"${entry ? ' checked' : ''} /></td>` +
				`<td>${trainerSpriteImg(trainer.avatar, 40)} <span class="gym-pool-name">${Utils.escapeHTML(trainer.name)}</span></td>` +
				`<td class="gym-pool-type" title="${type}">${typeIcon(trainer.type)}</td>` +
				`<td class="gym-pool-level">${selectBox(`${key}level`, levelOptions(TL), entry?.aiLevel || '')}</td>` +
				`<td>${badgeSelect(TL, `${key}badge`, trainer.type, entry?.badgeId || null)} ` +
				`${chosenBadgeIcon(entry?.badgeId || null, trainer.type)}</td>` +
				`<td>${teamIconsWithNames(trainer.team)}</td></tr>`;
		}
		gyms += `</table></div>`;
	}

	let league = `<div class="ladder"><table>${header}`;
	if (challenge.hasElite4) {
		for (let position = 1; position <= ELITE4_SIZE; position++) league += stageRow('elite4', position, typed);
	}
	league += stageRow('champion', 1, trainers) + `</table></div>`;

	return `<form data-submitsend="/ginasioadmin salvaretapas ${challenge.id},${fields.join(',')}">` +
		`<h3>${TL`Gym leaders`}</h3>` + gyms +
		`<h3>${challenge.hasElite4 ? TL`Elite Four and Champion` : TL`Champion`}</h3>` + league +
		`<p><small>${TL`Gym leaders and Elite Four members need a trainer type. The difficulty is never below the challenge base.`}</small></p>` +
		`<p><small>${TL`Badges of the trainer's type come first in the list, but any badge can be chosen. Without a badge, the type icon is used.`}</small></p>` +
		`<p><button class="button" type="submit"><strong>${TL`Save trainers`}</strong></button></p>` +
		`</form>`;
}

/** Lista só de leitura das etapas (desafios encerrados). */
function stagesSummary(TL: Translator, store: GymStore, challenge: Challenge) {
	const trainers = trainerMap(store);
	const rows: string[] = [];
	const levelText = (level: string | null) => (level ? aiLevelLabel(TL, level) : TL`(challenge base)`);
	const badgeText = (badgeId: string | null, type: string | null) => {
		const badge = getBadge(badgeId);
		return chosenBadgeIcon(badgeId, type) + (badge ? ` ${Utils.escapeHTML(badgeLabel(badge))}` : '');
	};
	if (challenge.typeMode === 'random') {
		for (const entry of store.getPool(challenge.id)) {
			const trainer = trainers.get(entry.trainerId);
			if (!trainer) continue;
			rows.push(`<tr><td>${TL`Random pool`}</td><td>${trainerSpriteImg(trainer.avatar, 40)} ${trainerLabel(trainer)}</td>` +
				`<td>${levelText(entry.aiLevel)}</td>` +
				`<td>${badgeText(entry.badgeId, trainer.type)}</td></tr>`);
		}
	}
	for (const stage of activeStages(challenge, store.getStages(challenge.id))) {
		const trainer = stage.trainerId ? trainers.get(stage.trainerId) : undefined;
		rows.push(`<tr><td>${stageName(TL, stage.kind, stage.position)}</td>` +
			`<td>${trainer ? `${trainerSpriteImg(trainer.avatar, 40)} ${trainerLabel(trainer)}` : '-'}</td>` +
			`<td>${levelText(stage.aiLevel)}</td>` +
			`<td>${stage.kind === 'gym' ? badgeText(stage.badgeId, trainer?.type || null) : ''}</td></tr>`);
	}
	return `<div class="ladder"><table><tr><th></th><th>${TL`Trainer`}</th><th>${TL`Difficulty`}</th>` +
		`<th>${TL`Badge`}</th></tr>` +
		rows.join('') + `</table></div>`;
}

function problemsOf(store: GymStore, challenge: Challenge) {
	return challengeProblems(challenge, store.getStages(challenge.id), store.getPool(challenge.id), trainerMap(store));
}

/** Atualiza os formatos de desafio para todos; avisa o admin se a recarga falhar. */
function reloadChallengeFormats(context: Chat.CommandContext, connection: Connection) {
	if (reloadFormats()) return;
	connection.popup(context.TL`The challenge formats could not be updated. The previous formats remain in use; see the crash log.`);
}

/** Erro de validação: desfaz a transação em andamento sem tratar como falha do servidor. */
class Rejected extends Error {
	readonly problems: Problem[];
	constructor(problems: Problem[]) {
		super('rejected');
		this.problems = problems;
	}
}

export const pages: Chat.PageTable = {
	ginasiosadmin: {
		default(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Gym Challenge: admin`;
			const store = getStore();
			const trainerCount = store.listTrainers().length;
			const challenges = store.listChallenges();
			let buf = `<div class="pad">` +
				`<h2>${this.TL`Gym Challenge: admin panel`}</h2>` +
				navButtons(this.TL) +
				`<hr />` +
				`<h3>${this.TL`Challenges`}</h3>` +
				`<p><button class="button" name="gymGo" value="${PAGE}-desafio-novo">` +
				`<strong>${this.TL`New challenge`}</strong></button></p>`;
			if (!challenges.length) {
				buf += `<p><em>${this.TL`No challenges yet.`}</em></p>`;
			} else {
				// Abertos primeiro, depois rascunhos, encerrados por último
				const rank = { open: 0, draft: 1, closed: 2 };
				challenges.sort((a, b) => rank[a.status] - rank[b.status]);
				buf += `<div class="ladder"><table>` +
					`<tr><th>${this.TL`Name`}</th><th>${this.TL`Status`}</th><th>${this.TL`Gyms`}</th><th></th></tr>`;
				for (const challenge of challenges) {
					buf += `<tr><td><strong>${Utils.escapeHTML(challenge.name)}</strong></td>` +
						`<td>${statusLabel(this.TL, challenge.status)}</td>` +
						`<td>${challenge.gymCount}</td>` +
						`<td><button class="button" name="gymGo" value="${PAGE}-desafio-${challenge.id}">` +
						`${challenge.status === 'closed' ? this.TL`View` : this.TL`Edit`}</button></td></tr>`;
				}
				buf += `</table></div>`;
			}
			buf += `<hr /><h3>${this.TL`Trainers`}</h3>` +
				`<p>${this.TL`Registered trainers: ${trainerCount}`}</p>` +
				`<p><button class="button" name="gymGo" value="${PAGE}-treinadores">` +
				`${this.TL`Manage trainers`}</button></p>`;
			return buf + `</div>`;
		},

		treinadores(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Gym Challenge: trainers`;
			const store = getStore();
			const trainers = store.listTrainers();
			let buf = `<div class="pad">` +
				`<h2>${this.TL`Trainer bank`}</h2>` +
				navButtons(this.TL) +
				`<p><button class="button" name="gymGo" value="${PAGE}-treinador-novo">` +
				`<strong>${this.TL`New trainer`}</strong></button></p>`;
			if (!trainers.length) {
				buf += `<p><em>${this.TL`No trainers yet.`}</em></p>`;
				return buf + `</div>`;
			}
			buf += `<div class="ladder"><table>` +
				`<tr><th></th><th>${this.TL`Name`}</th><th>${this.TL`Trainer type`}</th><th>${this.TL`Team`}</th>` +
				`<th>${this.TL`Challenges`}</th><th></th></tr>`;
			for (const trainer of trainers) {
				const used = store.challengesUsingTrainer(trainer.id).length;
				buf += `<tr>` +
					`<td>${trainerSpriteImg(trainer.avatar, 48)}</td>` +
					`<td><strong>${Utils.escapeHTML(trainer.name)}</strong>` +
					(trainer.title ? `<br /><small>${Utils.escapeHTML(trainer.title)}</small>` : '') + `</td>` +
					`<td>${typeIcon(trainer.type) || `<em>${this.TL`none`}</em>`}` +
					(trainer.doubles ? `<br /><small>${this.TL`Doubles`}</small>` : '') + `</td>` +
					`<td>${teamIcons(trainer.team)}</td>` +
					`<td>${used}</td>` +
					`<td><button class="button" name="gymGo" value="${PAGE}-treinador-${trainer.id}">` +
					`${this.TL`Edit`}</button></td>` +
					`</tr>`;
			}
			return buf + `</table></div></div>`;
		},

		treinador(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			const store = getStore();
			const isNew = query[0] === 'novo';
			const trainer = isNew ? null : store.getTrainer(Number(query[0]));
			if (!isNew && !trainer) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			this.title = trainer ? `[${this.TL`Trainer`}] ${trainer.name}` : this.TL`New trainer`;

			const id = trainer ? trainer.id : 'novo';
			// Depois de um salvamento recusado, a página volta com o que foi enviado
			const draft = takeDraft(user, `treinador-${id}`);
			const values: FormValues = draft || {
				name: trainer?.name || '',
				title: trainer?.title || '',
				type: trainer?.type || '',
				team: trainer ? Teams.export(Teams.unpack(trainer.team) || []) : '',
				avatar: '',
				doubles: trainer?.doubles ? 'yes' : 'no',
			};
			const types = trainerTypes();
			const typeOptions = ['', ...types].map(type => [type, type || this.TL`(no type: Champion only)`] as [string, string]);
			// Quebras de linha como &#13; para sobreviver ao envio do formulário (como no plugin
			// oficial de times). Escapa linha por linha: o Utils.escapeHTML do PS troca "\n" por
			// <br />, que apareceria como texto dentro da textarea
			const teamText = values.team.split(/\r?\n/).map(line => Utils.escapeHTML(line)).join('&#13;');
			// Na criação, o sprite vai junto no formulário: a galeria (outra aba) preenche o
			// campo oculto e a prévia pelo cliente (client-custom.js, gymPickSprite), sem
			// recarregar esta página. Treinadores salvos trocam o sprite pela galeria.
			const preview = trainerSpriteImg(values.avatar, 80) || `<em>${this.TL`No sprite`}</em>`;
			const newSprite = trainer ? '' :
				`<p><label class="label">${this.TL`Trainer sprite`}:</label><br />` +
				`<input type="hidden" name="avatar" value="${Utils.escapeHTML(values.avatar || '')}" />` +
				`<span class="gym-sprite-preview" data-empty="${this.TL`No sprite`}">${preview}</span> ` +
				`<button class="button" type="button" name="gymGo" value="${PAGE}-sprites-novo-1-${SPRITES_PER_PAGE}">` +
				`${this.TL`Choose sprite`}</button></p>`;

			let buf = `<div class="pad">` +
				`<h2>${trainer ? Utils.escapeHTML(trainer.name) : this.TL`New trainer`}</h2>` +
				navButtons(this.TL) +
				`<form data-submitsend="/ginasioadmin salvartreinador ${id},{name},{title},{type},{doubles},{avatar},{team}">` +
				`<p><label class="label">${this.TL`Name`}:<br />` +
				`<input name="name" class="textbox" maxlength="${NAME_MAX_LENGTH}" value="${Utils.escapeHTML(values.name)}" />` +
				`</label></p>` +
				`<p><label class="label">${this.TL`Title (e.g. Gym Leader, Elite Four, Champion)`}:<br />` +
				`<input name="title" class="textbox" maxlength="${TITLE_MAX_LENGTH}" value="${Utils.escapeHTML(values.title)}" />` +
				`</label></p>` +
				`<p><label class="label">${this.TL`Trainer type`}:<br />${selectBox('type', typeOptions, values.type)}</label>` +
				`<br /><small>${this.TL`Gym leaders and Elite Four members need a type; every Pokémon in the team must have it.`}` +
				`</small></p>` +
				`<p><label class="label">${this.TL`Doubles battle`}:<br />` +
				selectBox('doubles', [['no', this.TL`No`], ['yes', this.TL`Yes`]], values.doubles || 'no') + `</label>` +
				`<br /><small>${this.TL`Battles against this trainer are in doubles, with the challenge rules. The team needs at least 2 Pokémon.`}` +
				`</small></p>` +
				newSprite +
				// Botões tratados pelo nosso fork do cliente (client-custom.js): montar no
				// teambuilder ao lado e trazer um dos times salvos para a textarea abaixo
				`<p><button class="button" type="button" name="gymOpenTeambuilder">` +
				`${this.TL`Build in the teambuilder`}</button> ` +
				`<button class="button" type="button" name="gymImportTeam">` +
				`${this.TL`Import from my teams`}</button></p>` +
				`<p><label class="label">${this.TL`Team (paste the teambuilder export)`}:<br />` +
				`<textarea name="team" class="textbox" style="width: 100%; height: 320px">${teamText}</textarea>` +
				`</label></p>` +
				`<p><button class="button" type="submit"><strong>${this.TL`Save trainer`}</strong></button></p>` +
				`</form>`;

			if (trainer) {
				buf += `<hr /><h3>${this.TL`Trainer sprite`}</h3>` +
					`<p>${trainerSpriteImg(trainer.avatar, 80) || `<em>${this.TL`No sprite`}</em>`}</p>` +
					`<p><button class="button" name="gymGo" value="${PAGE}-sprites-${trainer.id}-1-${SPRITES_PER_PAGE}">` +
					`${this.TL`Choose sprite`}</button></p>` +
					`<hr /><h3>${this.TL`Team`}</h3><p>${teamIcons(trainer.team)} ${typeIcon(trainer.type)}` +
					(trainer.doubles ? ` <small>${this.TL`Doubles`}</small>` : '') + `</p>`;
			}
			if (trainer) {
				const challengeIds = store.challengesUsingTrainer(trainer.id);
				if (challengeIds.length) {
					const names = challengeIds.map(cid => Utils.escapeHTML(store.getChallenge(cid)?.name || `#${cid}`));
					const list = names.join(', ');
					buf += `<p>${this.TL`Used in the challenges: ${list}`}</p>` +
						`<p><small>${this.TL`Trainers used in challenges cannot be deleted.`}</small></p>`;
				} else {
					buf += `<p><button class="button" name="send" value="/ginasioadmin apagartreinador ${trainer.id}">` +
						`${this.TL`Delete trainer`}</button></p>`;
				}
			}
			return buf + `</div>`;
		},

		sprites(query, user) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			// "novo": treinador ainda não salvo; a escolha vai para o formulário de criação
			const isNew = query[0] === 'novo';
			const trainer = isNew ? null : getStore().getTrainer(Number(query[0]));
			if (!isNew && !trainer) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			const target = trainer ? String(trainer.id) : 'novo';
			const size = spritePageSize(query[2]);
			const q = spriteQuery(query[3] || '');
			const found = searchTrainerSprites(q);
			const pageCount = Math.max(1, Math.ceil(found.length / size));
			const pageNumber = Math.min(Math.max(1, Number(query[1]) || 1), pageCount);
			const trainerName = trainer ? trainer.name : this.TL`New trainer`;
			this.title = `[${this.TL`Sprite`}] ${trainerName}`;

			const link = (n: number, perPage = size) => `/ginasioadmin paginasprite ${target},${n},${perPage},${q}`;
			// Treinador salvo: o servidor grava; novo: o cliente preenche o formulário de criação
			const pick = (sprite: string) => (trainer ?
				`name="send" value="/ginasioadmin definirsprite ${trainer.id},${sprite}"` :
				`name="gymPickSprite" value="${sprite}"`);
			const count = found.length;
			const current = trainer?.avatar || '';
			let buf = `<div class="pad"><h2>${this.TL`Sprite of ${trainerName}`}</h2>` + navButtons(this.TL) +
				`<p><button class="button" name="gymGo" value="${PAGE}-treinador-${target}">` +
				`${this.TL`Back to the trainer`}</button></p>`;
			if (trainer) {
				buf += `<p>${this.TL`Current`}: ${trainerSpriteImg(current, 80) || `<em>${this.TL`No sprite`}</em>`} ` +
					(current ? `<button class="button" ${pick('')}>${this.TL`Remove sprite`}</button>` : '') + `</p>`;
			} else {
				buf += `<p><button class="button" ${pick('')}>${this.TL`No sprite`}</button></p>`;
			}
			buf += `<form data-submitsend="/ginasioadmin buscarsprite ${target},${size},{q}"><p>` +
				`<input name="q" class="textbox" maxlength="30" value="${q}" placeholder="${this.TL`Name (e.g. brock)`}" /> ` +
				`<button class="button" type="submit">${this.TL`Search`}</button></p></form>` +
				`<p><small>${this.TL`${count} sprites`}</small></p>`;
			if (!count) return buf + `<p><em>${this.TL`No sprites found.`}</em></p></div>`;
			// Quantos por página: volta para a página 1, com a mesma busca
			buf += `<p><small>${this.TL`Sprites per page`}:</small> ` + SPRITE_PAGE_SIZES.map(n => (n === size ?
				`<button class="button disabled" disabled><strong>${n}</strong></button>` :
				`<button class="button" name="send" value="${link(1, n)}">${n}</button>`)).join(' ') + `</p>`;
			buf += `<p>`;
			for (const id of found.slice((pageNumber - 1) * size, pageNumber * size)) {
				const mark = id === current ? ' style="border: 2px solid #4a7"' : '';
				buf += `<button class="button" ${pick(id)}${mark}>` +
					`${trainerSpriteImg(id, 80)}<br /><small>${id}</small></button> `;
			}
			buf += `</p>`;
			if (pageCount > 1) {
				buf += `<p>` +
					(pageNumber > 1 ? `<button class="button" name="send" value="${link(pageNumber - 1)}">&laquo;</button> ` : '') +
					`${this.TL`Page ${pageNumber} of ${pageCount}`}` +
					(pageNumber < pageCount ? ` <button class="button" name="send" value="${link(pageNumber + 1)}">&raquo;</button>` : '') +
					`</p>`;
			}
			return buf + `</div>`;
		},

		desafio(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			const store = getStore();
			const isNew = query[0] === 'novo';
			const challenge = isNew ? null : store.getChallenge(Number(query[0]));
			if (!isNew && !challenge) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			this.title = challenge ? `[${this.TL`Challenge`}] ${challenge.name}` : this.TL`New challenge`;

			const id = challenge ? challenge.id : 'novo';
			let buf = `<div class="pad">` +
				`<h2>${challenge ? Utils.escapeHTML(challenge.name) : this.TL`New challenge`}</h2>` +
				navButtons(this.TL);
			if (!challenge) {
				const values = takeDraft(user, `desafio-${id}`) || challengeValues(DEFAULT_CHALLENGE);
				return buf + challengeForm(this.TL, id, values) + `</div>`;
			}

			const status = statusLabel(this.TL, challenge.status);
			const runCount = store.listRuns(challenge.id).length;
			buf += `<p>${this.TL`Status: ${status}`}</p>` +
				`<p><button class="button" name="gymGo" value="${PAGE}-jornadas-${challenge.id}">` +
				`${this.TL`Journeys (${runCount})`}</button></p>`;
			if (challenge.status === 'closed') {
				const note = this.TL`Closed challenges are kept as history and cannot be changed. Reopen it to edit.`;
				return buf + `<p><small>${note}</small></p>` +
					`<p><button class="button" name="send" value="/ginasioadmin reabrirdesafio ${challenge.id}">` +
					`<strong>${this.TL`Reopen challenge`}</strong></button></p>` +
					challengeSummary(this.TL, challenge) + `<h3>${this.TL`Trainers`}</h3>` +
					stagesSummary(this.TL, store, challenge) + `</div>`;
			}
			if (challenge.status === 'open') {
				buf += `<p><small>${this.TL`The challenge is open: changes are only saved if it stays ready to play.`}</small></p>`;
			}
			const values = takeDraft(user, `desafio-${id}`) || challengeValues(challenge);
			buf += challengeForm(this.TL, id, values) + `<hr />` + stagesForm(this.TL, store, challenge) + `<hr />`;

			const problems = problemsOf(store, challenge);
			buf += `<h3>${this.TL`Ready to open?`}</h3>`;
			if (problems.length) {
				buf += `<p>${this.TL`Fix these items before opening the challenge:`}</p>` + problemList(this.TL, problems);
			} else {
				buf += `<p>${this.TL`Everything is ready.`}</p>`;
			}
			if (challenge.status === 'draft') {
				buf += `<p><button class="button" name="send" value="/ginasioadmin abrirdesafio ${challenge.id}"` +
					`${problems.length ? ' disabled' : ''}><strong>${this.TL`Open challenge`}</strong></button></p>` +
					`<details><summary>${this.TL`Delete draft`}</summary>` +
					`<p>${this.TL`The draft and its trainer selection are deleted. The trainers stay in the bank.`}</p>` +
					`<p><button class="button" name="send" value="/ginasioadmin apagardesafio ${challenge.id}">` +
					`${this.TL`Confirm deletion`}</button></p></details>`;
			} else {
				buf += `<details><summary>${this.TL`Close challenge`}</summary>` +
					`<p>${this.TL`Nobody can play it until it is reopened. The history is kept and the challenge is marked as closed.`}</p>` +
					`<p><button class="button" name="send" value="/ginasioadmin encerrardesafio ${challenge.id}">` +
					`${this.TL`Confirm closing`}</button></p></details>`;
			}
			return buf + `</div>`;
		},

		async convites(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Invites`;
			const issued = takeIssued(user);
			const reply = await callLoginServer('/internal/invites', {});
			let buf = `<div class="pad">` +
				`<h2>${this.TL`Invites and passwords`}</h2>` +
				navButtons(this.TL) +
				(issued ? `<div class="infobox">${issued}</div>` : '') +
				`<hr />` +
				`<h3>${this.TL`New invite`}</h3>` +
				`<p>${this.TL`Single-use code, valid for 3 days. With a username, only that name can sign up with it.`}</p>` +
				`<form data-submitsend="/ginasioadmin gerarconvite {username}"><p>` +
				`<input name="username" class="textbox" maxlength="18" placeholder="${this.TL`Username (optional)`}" /> ` +
				`<button class="button" type="submit"><strong>${this.TL`Generate invite`}</strong></button></p></form>` +
				`<h3>${this.TL`Pending invites`}</h3>`;
			const invites = reply.ok ? reply.invites || [] : null;
			if (!invites) {
				buf += `<p><em>${this.TL`Could not load the pending invites.`}</em></p>`;
			} else if (!invites.length) {
				buf += `<p><em>${this.TL`No pending invites.`}</em></p>`;
			} else {
				buf += `<p><small>${this.TL`The codes are not shown: they are only stored as a hash.`}</small></p>` +
					`<div class="ladder"><table>` +
					`<tr><th>${this.TL`Created`}</th><th>${this.TL`Valid until`}</th>` +
					`<th>${this.TL`Reserved for`}</th><th></th></tr>`;
				for (const invite of invites) {
					buf += `<tr><td>${formatExpiry(invite.createdAt)}</td><td>${formatExpiry(invite.expiresAt)}</td>` +
						`<td>${invite.userid ? Utils.escapeHTML(invite.userid) : `<em>${this.TL`anyone`}</em>`}</td>` +
						`<td><button class="button" name="send" value="/ginasioadmin revogarconvite ${Number(invite.id)}">` +
						`${this.TL`Revoke`}</button></td></tr>`;
				}
				buf += `</table></div>`;
			}
			buf += `<hr /><h3>${this.TL`Password reset`}</h3>` +
				`<p>${this.TL`Single-use code, valid for 24 hours, for a player who forgot the password. The player uses it on the reset page.`}</p>` +
				`<form data-submitsend="/ginasioadmin redefinirsenha {username}"><p>` +
				`<input name="username" class="textbox" maxlength="18" placeholder="${this.TL`Player username`}" /> ` +
				`<button class="button" type="submit"><strong>${this.TL`Generate reset code`}</strong></button></p></form>`;
			return buf + `</div>`;
		},

		async seguranca(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Security`;
			const types = securityEventTypes(this.TL);
			const labels = new Map(types);
			// Filtros na própria página: tipo, conta e "antes de" (paginação), "todos" = sem filtro
			const type = labels.has(query[0]) ? query[0] : '';
			const userid = query[1] && query[1] !== 'todos' ? toID(query[1]) : '';
			const before = /^[1-9][0-9]*$/.test(query[2] || '') ? query[2] : '';
			const reply = await callLoginServer('/internal/security-events', {
				...(type ? { type } : {}), ...(userid ? { userid } : {}), ...(before ? { before } : {}),
			});
			const pageOf = (t: string, u: string, b = '0') => `${PAGE}-seguranca-${t || 'todos'}-${u || 'todos'}-${b}`;

			let buf = `<div class="pad"><h2>${this.TL`Security`}</h2>` + navButtons(this.TL) +
				`<p>${this.TL`Login security events: wrong passwords and blocks, account changes, invites and refused requests. Kept for 30 days, also after the account is deleted.`}</p>`;
			if (!reply.ok || !reply.events) {
				return buf + `<p><em>${this.TL`Could not load the security events.`}</em></p></div>`;
			}

			buf += `<h3>${this.TL`Last 24 hours`}</h3>`;
			if (!reply.summary?.length) {
				buf += `<p><em>${this.TL`No events.`}</em></p>`;
			} else {
				buf += `<div class="ladder"><table><tr><th>${this.TL`Event`}</th><th>${this.TL`Count`}</th></tr>` +
					reply.summary.map(row => (
						`<tr><td>${labels.get(row.type) || Utils.escapeHTML(row.type)}</td><td>${Number(row.count)}</td></tr>`
					)).join('') + `</table></div>`;
			}

			const clearFilter = type || userid || before ?
				` <button class="button" type="button" name="gymGo" value="${PAGE}-seguranca">${this.TL`Clear filter`}</button>` : '';
			buf += `<h3>${this.TL`Events`}</h3>` +
				`<form data-submitsend="/ginasioadmin filtrarseguranca {tipo},{conta}"><p>` +
				selectBox('tipo', [['', this.TL`(all events)`], ...types], type) + ` ` +
				`<input name="conta" class="textbox" maxlength="18" value="${Utils.escapeHTML(userid)}" ` +
				`placeholder="${this.TL`Account (optional)`}" /> ` +
				`<button class="button" type="submit">${this.TL`Filter`}</button>${clearFilter}</p></form>`;
			const events = reply.events;
			if (!events.length) return buf + `<p><em>${this.TL`No events.`}</em></p></div>`;
			buf += `<div class="ladder"><table><tr><th>${this.TL`When`}</th><th>${this.TL`Event`}</th>` +
				`<th>${this.TL`Account`}</th><th>IP</th><th>${this.TL`By`}</th><th>${this.TL`Where`}</th></tr>`;
			for (const event of events) {
				const account = event.userid ? toID(event.userid) : '';
				buf += `<tr><td>${formatExpiry(event.at)}</td>` +
					`<td>${labels.get(event.type) || Utils.escapeHTML(event.type)}</td>` +
					`<td>${account ? `<button class="button" name="gymGo" value="${pageOf(type, account)}">${account}</button>` : ''}</td>` +
					`<td>${Utils.escapeHTML(event.ip || '')}</td>` +
					`<td>${Utils.escapeHTML(event.actor || '')}</td>` +
					`<td>${securityDetail(this.TL, event.type, event.detail)}</td></tr>`;
			}
			buf += `</table></div>`;
			// O login devolve até 100 por vez: "mais antigos" continua do último id
			if (events.length >= 100) {
				buf += `<p><button class="button" name="gymGo" value="${pageOf(type, userid, String(events[events.length - 1].id))}">` +
					`${this.TL`Older events`}</button></p>`;
			}
			return buf + `</div>`;
		},

		pacotes(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Import and export`;
			const store = getStore();
			const maxKB = Math.floor(PACK_MAX_LENGTH / 1024);
			const buf = `<div class="pad"><h2>${this.TL`Import and export`}</h2>` + navButtons(this.TL) +
				`<p>${this.TL`A pack is a JSON file with trainers and challenges, to take them from one server to another (for example, from the local environment to production). Players, journeys and achievements never go in a pack.`}</p>` +
				`<hr /><h3>${this.TL`Import`}</h3>` +
				`<ul><li>${this.TL`Nothing is saved before you confirm on the next screen.`}</li>` +
				`<li>${this.TL`Trainers and challenges whose names already exist are skipped and stay as they are; the imported challenges use the trainer already in the bank.`}</li>` +
				`<li>${this.TL`Challenges come in as drafts, to be reviewed and opened in the panel.`}</li>` +
				`<li>${this.TL`Up to ${maxKB} KB at a time: split bigger packs.`}</li></ul>` +
				`<form data-submitsend="/ginasioadmin previaimportacao {pacote}">` +
				`<p><label class="label">${this.TL`Pack (JSON)`}:<br />` +
				`<textarea name="pacote" class="textbox" style="width: 100%; height: 240px"></textarea></label></p>` +
				`<p><button class="button" type="submit"><strong>${this.TL`Preview import`}</strong></button></p></form>` +
				`<hr /><h3>${this.TL`Export`}</h3>`;
			const challenges = store.listChallenges();
			const trainers = store.listTrainers();
			if (!challenges.length && !trainers.length) {
				return buf + `<p><em>${this.TL`Nothing to export yet.`}</em></p></div>`;
			}
			const fields: string[] = [];
			const checkbox = (key: string) => {
				fields.push(`${key}={${key}}`);
				return `<input type="checkbox" name="${key}" />`;
			};
			let tables = '';
			if (challenges.length) {
				tables += `<div class="ladder"><table><tr><th></th><th>${this.TL`Challenge`}</th><th>${this.TL`Status`}</th></tr>` +
					challenges.map(challenge => (
						`<tr><td>${checkbox(`c${fieldKey(challenge.id)}`)}</td>` +
						`<td>${Utils.escapeHTML(challenge.name)}</td><td>${statusLabel(this.TL, challenge.status)}</td></tr>`
					)).join('') + `</table></div>`;
			}
			if (trainers.length) {
				tables += `<div class="ladder"><table><tr><th></th><th>${this.TL`Trainer`}</th><th>${this.TL`Team`}</th></tr>` +
					trainers.map(trainer => (
						`<tr><td>${checkbox(`t${fieldKey(trainer.id)}`)}</td>` +
						`<td>${trainerSpriteImg(trainer.avatar, 40)} ${trainerLabel(trainer)}</td>` +
						`<td>${teamIcons(trainer.team)}</td></tr>`
					)).join('') + `</table></div>`;
			}
			return buf + `<form data-submitsend="/ginasioadmin exportarpacote ${fields.join(',')}">` +
				`<p>${this.TL`Choose the challenges (the trainers they use go along) and other trainers to include.`}</p>` +
				tables + `<p><button class="button" type="submit"><strong>${this.TL`Export`}</strong></button></p></form></div>`;
		},

		exportar(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Export`;
			const ids = (part: string | undefined) => (part || '').split('x').map(Number).filter(n => Number.isInteger(n) && n > 0);
			const result = exportPack(getStore(), ids(query[0]), ids(query[1]));
			let buf = `<div class="pad"><h2>${this.TL`Export`}</h2>` + navButtons(this.TL) +
				`<p><button class="button" name="gymGo" value="${PAGE}-pacotes">${this.TL`Back to import and export`}</button></p>`;
			if ('error' in result) return buf + `<p>${Utils.escapeHTML(renderProblem(this.TL, result.error))}</p></div>`;
			const { pack } = result;
			if (!pack.trainers.length && !pack.challenges.length) {
				return buf + `<p><em>${this.TL`Choose at least one challenge or trainer.`}</em></p></div>`;
			}
			const json = JSON.stringify(pack, null, '\t');
			const challengeCount = pack.challenges.length;
			const trainerCount = pack.trainers.length;
			const sizeKB = Math.ceil(json.length / 1024);
			const maxKB = Math.floor(PACK_MAX_LENGTH / 1024);
			buf += `<p>${this.TL`Pack with ${challengeCount} challenge(s) and ${trainerCount} trainer(s), ${sizeKB} KB.`}</p>`;
			if (json.length > PACK_MAX_LENGTH) {
				buf += `<p><strong>${this.TL`The pack is larger than ${maxKB} KB and cannot be imported at once: export fewer challenges or trainers at a time.`}</strong></p>`;
			}
			// Linha por linha, como na textarea do time (o escapeHTML do PS troca "\n" por <br />)
			const text = json.split('\n').map(line => Utils.escapeHTML(line)).join('&#13;');
			const copyHint = this.TL`Copy the text below (Ctrl+A, Ctrl+C inside the box) and save it as a .json file, or paste it directly into the import of the other server.`;
			return buf + `<p>${copyHint}</p>` +
				`<textarea class="textbox" readonly style="width: 100%; height: 400px">${text}</textarea></div>`;
		},

		importar(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Import`;
			let buf = `<div class="pad"><h2>${this.TL`Import`}</h2>` + navButtons(this.TL);
			const done = importResults.take(user);
			if (done) return buf + `<div class="infobox">${done}</div></div>`;
			const text = pendingImports.get(user);
			const back = `<p><button class="button" name="gymGo" value="${PAGE}-pacotes">${this.TL`Back to import and export`}</button></p>`;
			if (!text) return buf + `<p><em>${this.TL`No import in progress.`}</em></p>${back}</div>`;
			const plan = planImport(getStore(), text);
			buf += importPreview(this.TL, plan);
			const cancel = `<button class="button" name="send" value="/ginasioadmin cancelarimportacao">${this.TL`Cancel`}</button>`;
			if (planHasProblems(plan)) {
				const note = this.TL`The pack has errors and cannot be imported. Fix them and paste it again.`;
				return buf + `<p><strong>${note}</strong></p>` +
					`<p>${cancel}</p></div>`;
			}
			if (!canImport(plan)) {
				return buf + `<p><strong>${this.TL`Everything in the pack already exists. Nothing to import.`}</strong></p>` +
					`<p>${cancel}</p></div>`;
			}
			return buf + `<p><button class="button" name="send" value="/ginasioadmin confirmarimportacao">` +
				`<strong>${this.TL`Confirm import`}</strong></button> ${cancel}</p></div>`;
		},

		mestre(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Master AI`;
			const store = getStore();
			for (const kind of BATTLE_KINDS) activeMasterModel(store, kind);
			const minimum = MIN_NEW_BATTLES;
			const minScore = Math.round(VERIFICATION_MIN_SCORE * 100);
			let buf = `<div class="pad"><h2>${this.TL`Master AI`}</h2>` + navButtons(this.TL) +
				`<p>${this.TL`The Master AI learns from the Gym Challenge battles: it keeps anonymous positions (no player, challenge or time) and who won.`} ` +
				`${this.TL`Every Monday at 4:00 (Brasília time), with at least ${minimum} new battles, it retrains. The new model is only used if it predicts the real results better and scores at least ${minScore}% against the current model in simulated battles.`} ` +
				`${this.TL`Singles and doubles battles have separate data, models and retraining.`}</p>`;

			for (const kind of BATTLE_KINDS) {
				const active = store.getActiveModel(kind);
				buf += `<h3>${battleKindLabel(this.TL, kind)}</h3><p><strong>${this.TL`Model in use`}</strong></p>`;
				if (!active) {
					buf += `<p><em>${this.TL`No model: the Master AI plays with its rules only.`}</em></p>`;
				} else {
					const source = active.source === 'sim' ? this.TL`Simulated battles` : this.TL`Real battles`;
					buf += `<div class="ladder"><table>` +
						`<tr><th>${this.TL`Version`}</th><td>${Utils.escapeHTML(active.version)}</td></tr>` +
						`<tr><th>${this.TL`Source`}</th><td>${source}</td></tr>` +
						`<tr><th>${this.TL`Trained`}</th><td>${formatExpiry(active.trainedAt)}</td></tr>` +
						`</table></div>`;
				}
				const stats = store.positionStats(kind);
				const battles = stats.battles;
				const positions = stats.positions;
				const fresh = stats.freshBattles;
				buf += `<p><strong>${this.TL`Collected data`}</strong></p>` +
					`<p>${this.TL`${battles} battles and ${positions} positions; ${fresh} new battles since the last retraining (minimum ${minimum}).`}</p>`;
			}

			const results = store.masterResults();
			const wins = results.wins;
			const losses = results.losses;
			if (wins + losses) {
				const rate = Math.round(wins / (wins + losses) * 100);
				buf += `<p>${this.TL`Master AI in the journeys: ${wins} wins and ${losses} losses (${rate}%).`}</p>`;
			}
			if (LEVEL_STRENGTH) {
				const date = LEVEL_STRENGTH.measuredAt;
				const battles = LEVEL_STRENGTH.battles;
				buf += `<h3>${this.TL`Strength of the levels`}</h3>` +
					`<p>${this.TL`Wins of the row level against the column level, in battles between AIs with random teams (measured on ${date}, at least ${battles} battles per matchup).`}</p>` +
					`<p><strong>${this.TL`Singles`}</strong></p>${levelStrengthTable(this.TL, 'singles')}` +
					`<p><strong>${this.TL`Doubles`}</strong></p>${levelStrengthTable(this.TL, 'doubles')}`;
			}
			if (isTrainingRunning()) {
				buf += `<p><strong>${this.TL`Retraining in progress. It can take up to an hour; meanwhile the Master AI may play with its rules only.`}</strong></p>`;
			} else {
				buf += `<details><summary>${this.TL`Retrain now`}</summary>` +
					`<p>${this.TL`Same steps as the automatic retraining, including the minimum of new battles and the verification. It can take up to an hour.`}</p>` +
					`<p><button class="button" name="send" value="/ginasioadmin retreinarmestre">` +
					`${this.TL`Start retraining`}</button></p></details>`;
			}

			const trainings = store.listTrainings(20);
			buf += `<h3>${this.TL`Retraining history`}</h3>`;
			if (!trainings.length) {
				buf += `<p><em>${this.TL`No retraining yet.`}</em></p>`;
			} else {
				buf += `<div class="ladder"><table><tr><th>${this.TL`Started`}</th><th>${this.TL`Battle type`}</th>` +
					`<th>${this.TL`Trigger`}</th><th>${this.TL`Result`}</th><th>${this.TL`Details`}</th></tr>`;
				for (const training of trainings) {
					const trigger = training.trigger === 'manual' ? this.TL`Admin panel` : this.TL`Schedule`;
					buf += `<tr><td>${formatExpiry(training.startedAt)}</td><td>${battleKindLabel(this.TL, training.kind)}</td>` +
						`<td>${trigger}</td>` +
						`<td>${trainingOutcome(this.TL, training.outcome)}</td><td>${trainingDetails(this.TL, training.report)}</td></tr>`;
				}
				buf += `</table></div>`;
			}

			const models = store.listModels();
			if (models.length) {
				buf += `<h3>${this.TL`Models`}</h3><div class="ladder"><table><tr><th>${this.TL`Version`}</th>` +
					`<th>${this.TL`Battle type`}</th><th>${this.TL`Source`}</th><th>${this.TL`Status`}</th><th>${this.TL`Trained`}</th><th></th></tr>`;
				for (const model of models) {
					const source = model.source === 'sim' ? this.TL`Simulated battles` : this.TL`Real battles`;
					const status = model.status === 'active' ? this.TL`In use` :
						model.status === 'rejected' ? this.TL`Rejected` : this.TL`Previous`;
					const action = model.status === 'active' ? '' :
						`<details><summary>${this.TL`Use this version`}</summary>` +
						`<button class="button" name="send" value="/ginasioadmin usarmodelomestre ${Utils.escapeHTML(model.version)}">` +
						`${this.TL`Confirm`}</button></details>`;
					buf += `<tr><td>${Utils.escapeHTML(model.version)}</td><td>${battleKindLabel(this.TL, model.kind)}</td>` +
						`<td>${source}</td><td>${status}</td>` +
						`<td>${formatExpiry(model.trainedAt)}</td><td>${action}</td></tr>`;
				}
				buf += `</table></div>`;
			}
			return buf + `</div>`;
		},

		jornadas(query, user) {
			// Página aberta antes do login terminar (link direto, recarga): o cliente pede de novo após logar
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isAdmin(user)) this.pageDoesNotExist();
			const store = getStore();
			const challenge = store.getChallenge(Number(query[0]));
			if (!challenge) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			this.title = `[${this.TL`Journeys`}] ${challenge.name}`;
			const runs = store.listRuns(challenge.id);
			let buf = `<div class="pad"><h2>${this.TL`Journeys`}: ${Utils.escapeHTML(challenge.name)}</h2>` +
				navButtons(this.TL) +
				`<p><button class="button" name="gymGo" value="${PAGE}-desafio-${challenge.id}">` +
				`${this.TL`Back to the challenge`}</button></p>`;
			if (!runs.length) return buf + `<p><em>${this.TL`No journeys yet.`}</em></p></div>`;
			buf += `<div class="ladder"><table><tr><th>${this.TL`Player`}</th><th>${this.TL`Result`}</th>` +
				`<th>${this.TL`Badges`}</th><th>${this.TL`Losses`}</th><th>${this.TL`Started`}</th>` +
				`<th>${this.TL`Ended`}</th><th></th></tr>`;
			for (const run of runs) {
				const { progress } = runState(run);
				let action = '';
				if (run.status === 'active') {
					action = `<details><summary>${this.TL`Close journey`}</summary>` +
						`<p><small>${this.TL`The journey ends and stays in the history. A battle in progress continues, and its result still counts.`}</small></p>` +
						`<button class="button" name="send" value="/ginasioadmin encerrarjornada ${run.id}">` +
						`${this.TL`Confirm closing`}</button></details>`;
				}
				buf += `<tr><td>${profileButton(this.TL, run.userid)}</td><td>${runStatusLabel(this.TL, run.status)}</td>` +
					`<td>${progress.badges.length}/${progress.gymCount}</td><td>${progress.losses}</td>` +
					`<td>${formatDate(run.startedAt)}</td><td>${formatDate(run.endedAt)}</td><td>${action}</td></tr>`;
			}
			return buf + `</table></div></div>`;
		},
	},
};

export const commands: Chat.ChatCommands = {
	gymadmin: 'ginasioadmin',
	ginasioadmin: {
		''(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			return this.parse(`/join ${PAGE}`);
		},

		salvartreinador(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawId, rawName, rawTitle, rawType, rawDoubles, rawAvatar, rawTeam] = Utils.splitFirst(target, ',', 6);
			const isNew = rawId.trim() === 'novo';
			const id = Number(rawId);
			const store = getStore();
			if (!isNew && !store.getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);

			const name = (rawName || '').trim();
			const title = (rawTitle || '').trim();
			const type = (rawType || '').trim() || null;
			const doubles = (rawDoubles || '').trim() === 'yes';
			// Sprite: só na criação (treinadores salvos trocam pela galeria)
			const avatar = isNew ? (rawAvatar || '').trim() : '';
			const checked = checkTrainer({ name, title, type, doubles, avatar }, rawTeam || '');
			const problems = checked.problems.map(p => renderProblem(this.TL, p));
			const team = checked.team;
			if (team) {
				// Desafios abertos precisam continuar válidos com o time novo
				if (!isNew) {
					for (const cid of store.challengesUsingTrainer(id)) {
						const challenge = store.getChallenge(cid);
						if (challenge?.status !== 'open') continue;
						const trainers = trainerMap(store);
						trainers.set(id, { ...trainers.get(id)!, type, team });
						const issues = challengeProblems(challenge, store.getStages(cid), store.getPool(cid), trainers);
						for (const issue of issues) {
							const challengeName = challenge.name;
							const issueText = renderProblem(this.TL, issue);
							problems.push(this.TL`Open challenge ${challengeName}: ${issueText}`);
						}
					}
				}
			}
			const page = `treinador-${isNew ? 'novo' : id}`;
			if (problems.length || !team) {
				saveDraft(user, page, {
					name, title, type: type || '', doubles: doubles ? 'yes' : 'no', avatar, team: normalizeTeamText(rawTeam || ''),
				});
				const list = problems.map(p => `- ${p}`).join('\n');
				connection.popup(`${this.TL`The trainer was not saved:`}\n\n${list}`);
				return this.parse(`/join ${PAGE}-${page}`);
			}

			const input: TrainerInput = { name, title, type, team, avatar, doubles };
			let trainer: Trainer | null;
			if (isNew) {
				trainer = store.createTrainer(input);
			} else {
				const previous = store.getTrainer(id)!;
				trainer = store.updateTrainer(id, { ...input, avatar: previous.avatar });
			}
			this.globalModlog('GYMTRAINER', null, `${isNew ? 'created' : 'updated'} #${trainer!.id}`);
			this.sendReply(this.TL`Trainer saved.`);
			// O formulário "novo" deixa de servir: fecha a aba e abre a do treinador salvo
			if (isNew) connection.send(`>${PAGE}-treinador-novo\n|deinit`);
			return this.parse(`/join ${PAGE}-treinador-${trainer!.id}`);
		},

		buscarsprite(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawId, rawSize, rawQuery] = Utils.splitFirst(target, ',', 2);
			const id = rawId.trim() === 'novo' ? 'novo' : Number(rawId);
			if (id !== 'novo' && !getStore().getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			return openSpriteGallery(this, user, id, 1, spritePageSize(rawSize), spriteQuery(rawQuery || ''));
		},

		paginasprite(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawId, rawPage, rawSize, rawQuery] = target.split(',');
			const id = rawId.trim() === 'novo' ? 'novo' : Number(rawId);
			if (id !== 'novo' && !getStore().getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			// A página é conferida (e limitada ao total) ao desenhar a galeria
			const page = Math.max(1, Math.floor(Number(rawPage)) || 1);
			return openSpriteGallery(this, user, id, page, spritePageSize(rawSize), spriteQuery(rawQuery || ''));
		},

		definirsprite(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawId, rawSprite] = Utils.splitFirst(target, ',');
			const id = Number(rawId);
			const store = getStore();
			if (!store.getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			const sprite = (rawSprite || '').trim();
			// Só sprites oficiais do PS (vazio = sem sprite)
			if (sprite && !isTrainerSprite(sprite)) throw new Chat.ErrorMessage(this.TL`Invalid sprite.`);
			store.setTrainerAvatar(id, sprite);
			this.globalModlog('GYMTRAINER', null, `sprite #${id}: ${sprite || '(none)'}`);
			this.sendReply(sprite ? this.TL`Sprite saved.` : this.TL`Sprite removed.`);
			// A escolha terminou: fecha as abas da galeria deste treinador (qualquer página ou
			// busca) e volta para a edição, que já mostra o sprite novo
			// (a edição também é fechada e reaberta: um /join numa aba aberta não a põe em foco)
			const gallery = `${PAGE.slice('view-'.length)}-sprites-${id}-`;
			const edit = `${PAGE.slice('view-'.length)}-treinador-${id}`;
			for (const conn of user.connections) {
				for (const page of [...conn.openPages || []]) {
					if (!page.startsWith(gallery) && page !== edit) continue;
					conn.send(`>view-${page}\n|deinit`);
					conn.openPages!.delete(page);
				}
			}
			return this.parse(`/join ${PAGE}-treinador-${id}`);
		},

		apagartreinador(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const id = Number(target);
			const store = getStore();
			const trainer = store.getTrainer(id);
			if (!trainer) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			if (!store.deleteTrainer(id)) {
				connection.popup(this.TL`Trainers used in challenges cannot be deleted.`);
				return;
			}
			this.globalModlog('GYMTRAINER', null, `deleted #${id}`);
			this.sendReply(this.TL`Trainer deleted.`);
			return this.parse(`/join ${PAGE}-treinadores`);
		},

		salvardesafio(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawId, ...rest] = Utils.splitFirst(target, ',', CHALLENGE_FIELDS.length);
			const isNew = rawId.trim() === 'novo';
			const id = Number(rawId);
			const store = getStore();
			const previous = isNew ? null : store.getChallenge(id);
			if (!isNew && !previous) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			if (previous?.status === 'closed') throw new Chat.ErrorMessage(this.TL`Closed challenges cannot be changed.`);

			const values: FormValues = {};
			CHALLENGE_FIELDS.forEach((field, index) => {
				values[field] = rest[index] || '';
			});
			const input = challengeInput(values);
			const problems = checkChallengeInput(input, store.listChallenges(), isNew ? null : id);

			let saved: Challenge | null = null;
			if (!problems.length) {
				try {
					saved = store.transaction(() => {
						const challenge = isNew ? store.createChallenge(input) : store.updateChallenge(id, input)!;
						// Etapas que deixaram de existir com a nova configuração
						store.pruneStages(challenge.id, input.typeMode === 'fixed' ? input.gymCount : 0, input.hasElite4);
						if (input.typeMode === 'fixed') store.clearPool(challenge.id);
						if (challenge.status === 'open') {
							const issues = problemsOf(store, challenge);
							if (issues.length) throw new Rejected(issues);
						}
						return challenge;
					});
				} catch (err) {
					if (!(err instanceof Rejected)) throw err;
					problems.push(...err.problems);
				}
			}
			const page = `desafio-${isNew ? 'novo' : id}`;
			if (!saved) {
				saveDraft(user, page, values);
				const list = problems.map(p => `- ${renderProblem(this.TL, p)}`).join('\n');
				connection.popup(`${this.TL`The challenge was not saved:`}\n\n${list}`);
				return this.parse(`/join ${PAGE}-${page}`);
			}
			this.globalModlog('GYMCHALLENGE', null, `${isNew ? 'created' : 'updated'} #${saved.id}`);
			this.sendReply(this.TL`Challenge saved.`);
			// Nome, formato base e regras de um desafio aberto definem o formato dele
			if (saved.status === 'open') reloadChallengeFormats(this, connection);
			if (isNew) connection.send(`>${PAGE}-desafio-novo\n|deinit`);
			return this.parse(`/join ${PAGE}-desafio-${saved.id}`);
		},

		salvaretapas(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawId, ...pairs] = target.split(',');
			const id = Number(rawId);
			const store = getStore();
			const challenge = store.getChallenge(id);
			if (!challenge) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			if (challenge.status === 'closed') throw new Chat.ErrorMessage(this.TL`Closed challenges cannot be changed.`);

			const values = new Map<string, string>();
			for (const pair of pairs) {
				const [key, value] = Utils.splitFirst(pair, '=');
				values.set(key.trim(), value.trim());
			}
			const trainers = trainerMap(store);
			const problems: Problem[] = [];
			const level = (key: string) => {
				const value = values.get(`${key}level`) || '';
				if (value && !isAILevel(value)) {
					problems.push({ message: TLkey`Invalid difficulty.`, args: [] });
					return null;
				}
				return value || null;
			};
			const badgeOf = (key: string, label: string) => {
				const value = values.get(`${key}badge`) || '';
				if (value && !getBadge(value)) {
					problems.push({ message: TLkey`{0}: invalid badge.`, args: [label] });
					return null;
				}
				return value || null;
			};
			const stage = (kind: StageKind, position: number, needsType: boolean) => {
				const key = `${kind}${fieldKey(position)}`;
				if (!values.has(key)) return;
				const trainerId = Number(values.get(key)) || null;
				const trainer = trainerId ? trainers.get(trainerId) : undefined;
				if (trainerId && (!trainer || (needsType && !trainer.type))) {
					problems.push({ message: TLkey`{0}: invalid trainer.`, args: [stageName(this.TL, kind, position)] });
					return;
				}
				const badgeId = kind === 'gym' ? badgeOf(key, stageName(this.TL, kind, position)) : null;
				store.setStage(id, { kind, position, trainerId, aiLevel: level(key), badgeId });
			};

			try {
				store.transaction(() => {
					if (challenge.typeMode === 'fixed') {
						for (let position = 1; position <= challenge.gymCount; position++) stage('gym', position, true);
					} else {
						for (const trainer of trainers.values()) {
							const key = `pool${fieldKey(trainer.id)}`;
							// Treinadores criados depois de a página abrir não estão no formulário: ficam como estão
							if (!values.has(key) || !trainer.type) continue;
							if (values.get(key) === 'on') {
								store.setPoolEntry(id, {
									trainerId: trainer.id, aiLevel: level(key), badgeId: badgeOf(key, trainer.name),
								});
							} else {
								store.removePoolEntry(id, trainer.id);
							}
						}
					}
					if (challenge.hasElite4) {
						for (let position = 1; position <= ELITE4_SIZE; position++) stage('elite4', position, true);
					}
					stage('champion', 1, false);
					if (problems.length) throw new Rejected(problems);
					if (challenge.status === 'open') {
						const issues = problemsOf(store, challenge);
						if (issues.length) throw new Rejected(issues);
					}
				});
			} catch (err) {
				if (!(err instanceof Rejected)) throw err;
				const list = err.problems.map(p => `- ${renderProblem(this.TL, p)}`).join('\n');
				connection.popup(`${this.TL`The trainers were not saved:`}\n\n${list}`);
				return this.parse(`/join ${PAGE}-desafio-${id}`);
			}
			this.globalModlog('GYMCHALLENGE', null, `stages #${id}`);
			this.sendReply(this.TL`Trainers saved.`);
			return this.parse(`/join ${PAGE}-desafio-${id}`);
		},

		abrirdesafio(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const id = Number(target);
			const store = getStore();
			const challenge = store.getChallenge(id);
			if (!challenge) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			if (challenge.status !== 'draft') throw new Chat.ErrorMessage(this.TL`Only drafts can be opened.`);
			const problems = problemsOf(store, challenge);
			if (problems.length) {
				const list = problems.map(p => `- ${renderProblem(this.TL, p)}`).join('\n');
				connection.popup(`${this.TL`The challenge was not opened:`}\n\n${list}`);
				return this.parse(`/join ${PAGE}-desafio-${id}`);
			}
			store.setChallengeStatus(id, 'open');
			this.globalModlog('GYMCHALLENGE', null, `opened #${id}`);
			this.sendReply(this.TL`Challenge opened.`);
			reloadChallengeFormats(this, connection);
			return this.parse(`/join ${PAGE}-desafio-${id}`);
		},

		encerrardesafio(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const id = Number(target);
			const store = getStore();
			const challenge = store.getChallenge(id);
			if (!challenge) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			if (challenge.status !== 'open') throw new Chat.ErrorMessage(this.TL`Only open challenges can be closed.`);
			// As jornadas ativas são encerradas junto (o histórico fica)
			store.transaction(() => {
				store.setChallengeStatus(id, 'closed');
				store.closeActiveRuns(id);
			});
			this.globalModlog('GYMCHALLENGE', null, `closed #${id}`);
			this.sendReply(this.TL`Challenge closed.`);
			reloadChallengeFormats(this, connection);
			return this.parse(`/join ${PAGE}-desafio-${id}`);
		},

		reabrirdesafio(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const id = Number(target);
			const store = getStore();
			const challenge = store.getChallenge(id);
			if (!challenge) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			if (challenge.status !== 'closed') throw new Chat.ErrorMessage(this.TL`Only closed challenges can be reopened.`);
			// Treinadores e formatos podem ter mudado desde o encerramento: mesma validação de abrir
			const problems = problemsOf(store, challenge);
			if (problems.length) {
				const list = problems.map(p => `- ${renderProblem(this.TL, p)}`).join('\n');
				connection.popup(`${this.TL`The challenge was not reopened:`}\n\n${list}`);
				return this.parse(`/join ${PAGE}-desafio-${id}`);
			}
			store.setChallengeStatus(id, 'open');
			this.globalModlog('GYMCHALLENGE', null, `reopened #${id}`);
			this.sendReply(this.TL`Challenge reopened.`);
			reloadChallengeFormats(this, connection);
			return this.parse(`/join ${PAGE}-desafio-${id}`);
		},

		encerrarjornada(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const run = getStore().getRun(Number(target));
			if (!run) throw new Chat.ErrorMessage(this.TL`Journey not found.`);
			if (run.status !== 'active') throw new Chat.ErrorMessage(this.TL`This journey has already ended.`);
			closeRun(run);
			// LGPD: o modlog fica depois da exclusão da conta; registra a jornada, não o jogador
			this.globalModlog('GYMRUN', null, `closed run #${run.id} (challenge #${run.challengeId})`);
			this.sendReply(this.TL`Journey closed.`);
			return this.parse(`/join ${PAGE}-jornadas-${run.challengeId}`);
		},

		async gerarconvite(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can create invites.`);
			const username = target.trim();
			const reply = await callLoginServer('/internal/invite', {
				lang: loginLang(user), actor: user.id, ...(username ? { username } : {}),
			});
			if (!reply.ok || !reply.code || !reply.url || !reply.expiresAt) {
				connection.popup(reply.error || this.TL`Could not create the invite.`);
			} else {
				keepIssued(user, inviteBox(this.TL, reply));
				// LGPD: o modlog fica depois da exclusão da conta; não guarda o nome de jogadores
				this.globalModlog('INVITE', null, username ? 'reserved name' : 'open');
			}
			return this.parse(`/join ${PAGE}-convites`);
		},

		async revogarconvite(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can create invites.`);
			const id = target.trim();
			if (!/^[1-9][0-9]*$/.test(id)) throw new Chat.ErrorMessage(this.TL`Invite not found.`);
			const reply = await callLoginServer('/internal/invites/revoke', { id, actor: user.id });
			if (!reply.ok) {
				connection.popup(this.TL`Invite not found: it was already used, expired or revoked.`);
			} else {
				this.globalModlog('INVITEREVOKE', null, `#${id}`);
				this.sendReply(this.TL`Invite revoked.`);
			}
			return this.parse(`/join ${PAGE}-convites`);
		},

		async redefinirsenha(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can reset passwords.`);
			const username = target.trim();
			if (!toID(username)) {
				connection.popup(this.TL`Enter the username.`);
				return this.parse(`/join ${PAGE}-convites`);
			}
			const reply = await callLoginServer('/internal/reset', { username, lang: loginLang(user), actor: user.id });
			if (!reply.ok || !reply.code || !reply.url || !reply.expiresAt) {
				connection.popup(reply.error || this.TL`Could not create the reset code.`);
			} else {
				keepIssued(user, resetBox(this.TL, reply, username));
				this.globalModlog('PASSWORDRESET', null, 'reset code issued');
			}
			return this.parse(`/join ${PAGE}-convites`);
		},

		filtrarseguranca(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const [rawType, rawAccount] = Utils.splitFirst(target, ',');
			const type = toID(rawType);
			const account = toID(rawAccount);
			return this.parse(`/join ${PAGE}-seguranca-${type || 'todos'}-${account || 'todos'}-0`);
		},

		exportarpacote(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const values = new Map<string, string>();
			for (const pair of target.split(',')) {
				const [key, value] = Utils.splitFirst(pair, '=');
				values.set(key.trim(), value.trim());
			}
			const store = getStore();
			const chosen = (prefix: string, ids: number[]) => (
				ids.filter(id => values.get(`${prefix}${fieldKey(id)}`) === 'on').join('x') || '0'
			);
			const challenges = chosen('c', store.listChallenges().map(c => c.id));
			const trainers = chosen('t', store.listTrainers().map(t => t.id));
			return reopenPage(this, user, `${PAGE.slice('view-'.length)}-exportar-${challenges}-${trainers}`);
		},

		previaimportacao(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const text = target.trim();
			if (!text) {
				connection.popup(this.TL`Paste the pack to import.`);
				return this.parse(`/join ${PAGE}-pacotes`);
			}
			// Só na memória até a confirmação (validado de novo ao confirmar)
			pendingImports.set(user, text);
			return reopenPage(this, user, `${PAGE.slice('view-'.length)}-importar`);
		},

		confirmarimportacao(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const text = pendingImports.get(user);
			if (!text) throw new Chat.ErrorMessage(this.TL`No import in progress.`);
			const store = getStore();
			// O banco pode ter mudado desde a prévia: valida de novo
			const plan = planImport(store, text);
			if (!canImport(plan)) {
				connection.popup(this.TL`The pack can no longer be imported as it was previewed. Review the preview.`);
				return this.parse(`/join ${PAGE}-importar`);
			}
			const result = applyImport(store, plan);
			pendingImports.take(user);
			const trainerCount = result.trainers.length;
			const challengeCount = result.challenges.length;
			this.globalModlog('GYMIMPORT', null, `${trainerCount} trainers, ${challengeCount} challenges`);
			let html = `<p><strong>${this.TL`Pack imported: ${trainerCount} trainer(s) and ${challengeCount} challenge(s).`}</strong></p>`;
			if (result.challenges.length) {
				html += `<p>${this.TL`The challenges are drafts: review them and open them in the panel.`}</p><p>` +
					result.challenges.map(challenge => (
						`<button class="button" name="gymGo" value="${PAGE}-desafio-${challenge.id}">` +
						`${Utils.escapeHTML(challenge.name)}</button>`
					)).join(' ') + `</p>`;
			}
			html += `<p><button class="button" name="gymGo" value="${PAGE}-treinadores">${this.TL`Trainers`}</button></p>`;
			importResults.set(user, html);
			this.sendReply(this.TL`Pack imported.`);
			return this.parse(`/join ${PAGE}-importar`);
		},

		cancelarimportacao(target, room, user) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			pendingImports.take(user);
			return reopenPage(this, user, `${PAGE.slice('view-'.length)}-pacotes`);
		},

		retreinarmestre(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			if (!requestTraining('manual')) {
				connection.popup(this.TL`The retraining could not start: another one is running, or subprocesses are disabled on this server.`);
			} else {
				this.globalModlog('GYMMASTER', null, 'retraining started');
				this.sendReply(this.TL`Retraining started.`);
			}
			return this.parse(`/join ${PAGE}-mestre`);
		},

		usarmodelomestre(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const version = target.trim();
			if (!/^[a-z0-9-]{1,40}$/.test(version) || !getStore().activateModel(version)) {
				throw new Chat.ErrorMessage(this.TL`Model not found.`);
			}
			this.globalModlog('GYMMASTER', null, `model in use: ${version}`);
			this.sendReply(this.TL`Model in use changed. New battles against the Master AI use it.`);
			return this.parse(`/join ${PAGE}-mestre`);
		},

		apagardesafio(target, room, user, connection) {
			if (!isAdmin(user)) throw new Chat.ErrorMessage(this.TL`Only administrators can manage the Gym Challenge.`);
			const id = Number(target);
			const store = getStore();
			if (!store.getChallenge(id)) throw new Chat.ErrorMessage(this.TL`Challenge not found.`);
			if (!store.deleteDraftChallenge(id)) throw new Chat.ErrorMessage(this.TL`Only drafts can be deleted.`);
			this.globalModlog('GYMCHALLENGE', null, `deleted #${id}`);
			this.sendReply(this.TL`Challenge deleted.`);
			connection.send(`>${PAGE}-desafio-${id}\n|deinit`);
			return this.parse(`/join ${PAGE}`);
		},
	},
	ginasioadminhelp: [
		`/ginasioadmin - Abre o painel do Desafio de Ginásios. Requer: ~`,
	],
};

export function start() {
	// O time chega numa textarea (várias linhas) no último parâmetro
	Chat.multiLinePattern.register('/(ginasioadmin|gymadmin) salvartreinador ');
	// O pacote JSON também (importação)
	Chat.multiLinePattern.register('/(ginasioadmin|gymadmin) previaimportacao ');
}
