/**
 * pokemon-showdown-custom: painel do admin do Desafio de Ginásios.
 *
 * Páginas dentro do cliente (só rank ~; para os demais a página "não existe"):
 *   view-ginasiosadmin                    início do painel (desafios)
 *   view-ginasiosadmin-treinadores        banco de treinadores NPC
 *   view-ginasiosadmin-treinador-<id>     criar ("novo") / editar treinador
 *   view-ginasiosadmin-sprites-<id>-<página>[-<busca>]  galeria de sprites do treinador
 *   view-ginasiosadmin-desafio-<id>       criar ("novo") / editar / abrir / encerrar desafio
 *   view-ginasiosadmin-jornadas-<id>      jornadas do desafio (encerrar a de um jogador)
 *   view-ginasiosadmin-convites           convites (gerar, listar, revogar) e redefinição de senha
 *
 * Visual: apenas elementos que o cliente oficial já estiliza (pad, ladder,
 * button, textbox, psicon, formatselect), como nas páginas oficiais do PS.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { TLkey, type Translator } from '../../../sim/dex-text';
import { getStore, isAdmin } from './state';
import {
	checkChallengeSettings, checkName, ELITE4_SIZE, hasForbiddenChars, NAME_MAX_LENGTH, type Problem,
} from './rules';
import { checkFormat, importTeam, checkTeamType, normalizeTeamText, trainerTypes } from './teams';
import { activeStages, challengeProblems, DEFAULT_CHALLENGE, fieldKey } from './challenges';
import { AI_LEVELS, isAILevel } from './levels';
import { challengeFormatName } from './formats';
import { reloadFormats } from './reload';
import { badgeIcon, badgeLabel, badgeOptions, getBadge } from './badges';
import { isTrainerSprite, searchTrainerSprites, spriteQuery, trainerSpriteImg } from './trainer-sprites';
import { closeRun, runState } from './runs';
import { formatDate, profileButton, runStatusLabel } from './player';
import { callLoginServer, formatExpiry, inviteBox, loginLang, resetBox } from '../custom-accounts';
import type {
	Challenge, ChallengeInput, ChallengeStatus, GymStore, StageKind, Trainer, TrainerInput,
} from './store';

const PAGE = 'view-ginasiosadmin';
/** Sprites por página da galeria. */
const SPRITES_PER_PAGE = 48;
const TITLE_MAX_LENGTH = 40;
const RULES_MAX_LENGTH = 500;

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

// --- Elementos de página --------------------------------------------------

function teamIcons(team: string) {
	const sets = Teams.unpack(team) || [];
	return sets.map(set => `<psicon pokemon="${Utils.escapeHTML(set.species)}" />`).join('');
}

function typeIcon(type: string | null) {
	return type ? `<psicon type="${Utils.escapeHTML(type)}" />` : '';
}

/** <select> com a opção atual primeiro (o cliente clássico não preserva "selected"). */
function selectBox(name: string, options: [string, string][], current: string) {
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
		`<button class="button" name="gymGo" value="${PAGE}-convites">${TL`Invites`}</button>` +
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

function aiLevelLabel(TL: Translator, level: string) {
	if (level === 'random') return TL`Random (default bot)`;
	if (level === 'easy') return TL`Easy`;
	if (level === 'medium') return TL`Medium`;
	if (level === 'hard') return TL`Hard`;
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
			`<td>${trainerSpriteImg(trainer?.avatar, 40)} ` +
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
		gyms = `<p><small>${TL`Select the leaders that can be drawn. Each journey draws one leader for each of ${gymCount} different types.`}</small></p>` +
			`<div class="ladder"><table><tr><th></th><th>${TL`Trainer`}</th><th>${TL`Trainer type`}</th>` +
			`<th>${TL`Difficulty`}</th><th>${TL`Badge`}</th><th>${TL`Team`}</th></tr>`;
		const byType = [...typed].sort((a, b) => a.type!.localeCompare(b.type!) || a.name.localeCompare(b.name));
		for (const trainer of byType) {
			const key = `pool${fieldKey(trainer.id)}`;
			fields.push(`${key}={${key}}`, `${key}level={${key}level}`, `${key}badge={${key}badge}`);
			const entry = pool.get(trainer.id);
			gyms += `<tr><td><input type="checkbox" name="${key}"${entry ? ' checked' : ''} /></td>` +
				`<td>${trainerSpriteImg(trainer.avatar, 40)} ${Utils.escapeHTML(trainer.name)}</td><td>${typeIcon(trainer.type)}</td>` +
				`<td>${selectBox(`${key}level`, levelOptions(TL), entry?.aiLevel || '')}</td>` +
				`<td>${badgeSelect(TL, `${key}badge`, trainer.type, entry?.badgeId || null)} ` +
				`${chosenBadgeIcon(entry?.badgeId || null, trainer.type)}</td>` +
				`<td>${teamIcons(trainer.team)}</td></tr>`;
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
					`<td>${typeIcon(trainer.type) || `<em>${this.TL`none`}</em>`}</td>` +
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
				`<button class="button" type="button" name="gymGo" value="${PAGE}-sprites-novo-1">` +
				`${this.TL`Choose sprite`}</button></p>`;

			let buf = `<div class="pad">` +
				`<h2>${trainer ? Utils.escapeHTML(trainer.name) : this.TL`New trainer`}</h2>` +
				navButtons(this.TL) +
				`<form data-submitsend="/ginasioadmin salvartreinador ${id},{name},{title},{type},{avatar},{team}">` +
				`<p><label class="label">${this.TL`Name`}:<br />` +
				`<input name="name" class="textbox" maxlength="${NAME_MAX_LENGTH}" value="${Utils.escapeHTML(values.name)}" />` +
				`</label></p>` +
				`<p><label class="label">${this.TL`Title (e.g. Gym Leader, Elite Four, Champion)`}:<br />` +
				`<input name="title" class="textbox" maxlength="${TITLE_MAX_LENGTH}" value="${Utils.escapeHTML(values.title)}" />` +
				`</label></p>` +
				`<p><label class="label">${this.TL`Trainer type`}:<br />${selectBox('type', typeOptions, values.type)}</label>` +
				`<br /><small>${this.TL`Gym leaders and Elite Four members need a type; every Pokémon in the team must have it.`}` +
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
					`<p><button class="button" name="gymGo" value="${PAGE}-sprites-${trainer.id}-1">` +
					`${this.TL`Choose sprite`}</button></p>` +
					`<hr /><h3>${this.TL`Team`}</h3><p>${teamIcons(trainer.team)} ${typeIcon(trainer.type)}</p>`;
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
			const q = spriteQuery(query[2] || '');
			const found = searchTrainerSprites(q);
			const pageCount = Math.max(1, Math.ceil(found.length / SPRITES_PER_PAGE));
			const pageNumber = Math.min(Math.max(1, Number(query[1]) || 1), pageCount);
			const trainerName = trainer ? trainer.name : this.TL`New trainer`;
			this.title = `[${this.TL`Sprite`}] ${trainerName}`;

			const link = (n: number) => `/join ${PAGE}-sprites-${target}-${n}${q ? `-${q}` : ''}`;
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
			buf += `<form data-submitsend="/ginasioadmin buscarsprite ${target},{q}"><p>` +
				`<input name="q" class="textbox" maxlength="30" value="${q}" placeholder="${this.TL`Name (e.g. brock)`}" /> ` +
				`<button class="button" type="submit">${this.TL`Search`}</button></p></form>` +
				`<p><small>${this.TL`${count} sprites`}</small></p>`;
			if (!count) return buf + `<p><em>${this.TL`No sprites found.`}</em></p></div>`;
			buf += `<p>`;
			for (const id of found.slice((pageNumber - 1) * SPRITES_PER_PAGE, pageNumber * SPRITES_PER_PAGE)) {
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
			const [rawId, rawName, rawTitle, rawType, rawAvatar, rawTeam] = Utils.splitFirst(target, ',', 5);
			const isNew = rawId.trim() === 'novo';
			const id = Number(rawId);
			const store = getStore();
			if (!isNew && !store.getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);

			const problems: string[] = [];
			const name = (rawName || '').trim();
			const title = (rawTitle || '').trim();
			const type = (rawType || '').trim() || null;
			problems.push(...checkName(name).map(p => renderProblem(this.TL, p)));
			if (title.length > TITLE_MAX_LENGTH || /[|,]/.test(title) || hasForbiddenChars(title)) {
				problems.push(this.TL`The title can be at most ${TITLE_MAX_LENGTH} characters long and cannot contain | or ,.`);
			}
			if (type && !trainerTypes().includes(type)) problems.push(this.TL`Invalid type.`);
			// Sprite: só na criação (treinadores salvos trocam pela galeria); só ids oficiais
			const avatar = isNew ? (rawAvatar || '').trim() : '';
			if (avatar && !isTrainerSprite(avatar)) problems.push(this.TL`Invalid sprite.`);

			const imported = importTeam(rawTeam || '');
			if ('error' in imported) {
				problems.push(renderProblem(this.TL, imported.error));
			} else {
				// Sempre valida (Pokémon, itens, habilidades e golpes existentes); com tipo, também o tipo
				problems.push(...checkTeamType(imported.team, type));
				// Desafios abertos precisam continuar válidos com o time novo
				if (!isNew) {
					for (const cid of store.challengesUsingTrainer(id)) {
						const challenge = store.getChallenge(cid);
						if (challenge?.status !== 'open') continue;
						const trainers = trainerMap(store);
						trainers.set(id, { ...trainers.get(id)!, type, team: imported.team });
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
			if (problems.length || 'error' in imported) {
				saveDraft(user, page, { name, title, type: type || '', avatar, team: normalizeTeamText(rawTeam || '') });
				const list = problems.map(p => `- ${p}`).join('\n');
				connection.popup(`${this.TL`The trainer was not saved:`}\n\n${list}`);
				return this.parse(`/join ${PAGE}-${page}`);
			}

			const input: TrainerInput = { name, title, type, team: imported.team, avatar };
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
			const [rawId, rawQuery] = Utils.splitFirst(target, ',');
			const id = rawId.trim() === 'novo' ? 'novo' : Number(rawId);
			if (id !== 'novo' && !getStore().getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			const q = spriteQuery(rawQuery || '');
			return this.parse(`/join ${PAGE}-sprites-${id}-1${q ? `-${q}` : ''}`);
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
			// O nome vira nome de formato na etapa 4: não pode repetir nem com outra grafia
			if (store.listChallenges().some(c => c.id !== id && toID(c.name) === toID(input.name))) {
				problems.push({ message: TLkey`There is already a challenge with this name.`, args: [] });
			}
			const existing = Dex.formats.get(challengeFormatName(input.name, Dex.formats.get(input.baseFormat).mod));
			if (input.name && existing.exists && existing.gymChallenge !== String(id)) {
				problems.push({ message: TLkey`This name conflicts with an existing format.`, args: [] });
			}

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
			const reply = await callLoginServer('/internal/invite', { lang: loginLang(user), ...(username ? { username } : {}) });
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
			const reply = await callLoginServer('/internal/invites/revoke', { id });
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
			const reply = await callLoginServer('/internal/reset', { username, lang: loginLang(user) });
			if (!reply.ok || !reply.code || !reply.url || !reply.expiresAt) {
				connection.popup(reply.error || this.TL`Could not create the reset code.`);
			} else {
				keepIssued(user, resetBox(this.TL, reply, username));
				this.globalModlog('PASSWORDRESET', null, 'reset code issued');
			}
			return this.parse(`/join ${PAGE}-convites`);
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
}
