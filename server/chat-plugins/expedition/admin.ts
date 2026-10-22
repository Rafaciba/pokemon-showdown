/**
 * pokemon-showdown-custom: painel do admin da Expedição.
 *
 * Etapa 4: runs em andamento (com o encerramento pelo admin) e histórico.
 * Etapa 6 (decisão do usuário, 2026-10-22): as expedições são criadas pelo admin, como
 * os desafios do Desafio de Ginásios:
 *   - view-expedicao-admin: lista das expedições, runs em andamento e histórico;
 *   - view-expedicao-admin-<id> (ou -novo): editor por seções (geral, mecânica e tema,
 *     times iniciais, atos e níveis, chances dos nós, IA, chefes, insígnias), com a
 *     lista do que falta para abrir;
 *   - view-expedicao-admin-pacotes: importar e exportar expedições em JSON (os
 *     treinadores do banco vão pelo nome, porque os ids mudam entre servidores).
 * Ciclo de vida: rascunho (só administradores testam), aberta, encerrada (as runs em
 * andamento são encerradas junto; o histórico fica) e reaberta. Uma expedição aberta
 * só é salva se continuar pronta para jogar. As insígnias ficam travadas depois da
 * primeira run (decisão do usuário).
 *
 * Comandos (/expedicaoadmin), só para administradores, com registro no modlog:
 * salvar, abrir, encerrarexpedicao, reabrir, apagar, liga, sortearinsignias, importar,
 * encerrar (uma run).
 *
 * Formulários: o cliente troca cada {campo} do data-submitsend pelo valor digitado. Os
 * campos vão como "chave=valor" separados por vírgula; textos livres podem ter vírgula,
 * e a leitura só quebra antes de ",<chave>=" (chaves só com letras).
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { TLkey, type Translator } from '../../../sim/dex-text';
import { getStore, invalidateExpeditions, isAdmin } from './state';
import { getVariant, type ExpeditionStatus } from './variant';
import { closeRunByAdmin } from './runs';
import type { ExpeditionRun } from './store';
import {
	BADGE_COUNT, badgeLeagues, COMPLETE_ACTS, DEFAULT_DEFINITION, definitionProblems, drawBadges, GENERATIONS,
	MAX_ACTS, NAME_MAX_LENGTH, DESCRIPTION_MAX_LENGTH, NODE_WEIGHT_KEYS, normalizeDefinition, checkDefinitionFields,
	checkExpeditionName, checkExpeditionFormat, RULES_MAX_LENGTH, MAX_START_MONEY, MAX_SHINY_ODDS, type BankTrainer,
	type BossSlot,
	type ExpeditionDefinition, type NodeWeightKey,
} from './definition';
import { AI_LEVELS } from '../gym-challenge/levels';
import { getStore as getGymStore } from '../gym-challenge/state';
import { aiLevelLabel, formatLabel, renderProblem, selectBox } from '../gym-challenge/admin';
import { fieldKey } from '../gym-challenge/challenges';
import { BADGES } from '../gym-challenge/badge-catalog';
import { badgeIcon, badgeLabel } from '../gym-challenge/badges';
import { reloadFormats } from '../gym-challenge/reload';
import { seededRandom, newSeed } from './random';
import type { Problem } from '../gym-challenge/rules';

export const ADMIN_PAGE = 'view-expedicao-admin';

type FormValues = Record<string, string>;

// --- Rascunhos de formulário ------------------------------------------------------------
// Como no Desafio: o cliente troca o formulário enviado por "Submitted!". Se o
// salvamento falha na validação, o que foi enviado volta na página (só em memória,
// por usuário e formulário, e usado uma vez).

const drafts = new Map<string, FormValues>();

function saveDraft(user: User, key: string, values: FormValues) {
	drafts.set(`${user.id}|${key}`, values);
}

function takeDraft(user: User, key: string) {
	const full = `${user.id}|${key}`;
	const values = drafts.get(full);
	drafts.delete(full);
	return values;
}

/** Lê "chave=valor,chave=valor" (chaves só com letras; valores podem ter vírgula). */
export function parseFields(text: string): FormValues {
	const values: FormValues = {};
	for (const part of text.split(/,(?=[a-z]{1,16}=)/)) {
		const [key, value] = Utils.splitFirst(part, '=');
		if (/^[a-z]{1,16}$/.test(key)) values[key] = value ?? '';
	}
	return values;
}

/** Placeholders de um formulário: "chave={chave},...". */
function placeholders(keys: string[]) {
	return keys.map(key => `${key}={${key}}`).join(',');
}

// --- Rótulos -----------------------------------------------------------------------------

function formatDate(seconds: number | null) {
	return seconds ? new Date(seconds * 1000).toISOString().slice(0, 10) : '-';
}

export function runStatusLabel(TL: Translator, run: ExpeditionRun) {
	switch (run.status) {
	case 'won': return TL`Completed`;
	case 'lost': return TL`Defeated`;
	case 'abandoned': return TL`Given up`;
	case 'closed': return TL`Closed by an administrator`;
	default: return TL`In progress`;
	}
}

/** Até onde a run chegou: ato e andar (ou o chefe). */
export function runProgress(TL: Translator, run: ExpeditionRun) {
	const act = run.act;
	const acts = run.settings.map.acts;
	if (!run.node) return TL`Act ${act} of ${acts}`;
	if (run.node === 'boss') return TL`Act ${act} of ${acts}, at the boss`;
	const floor = Number(run.node.split('-')[0]) + 1;
	return TL`Act ${act} of ${acts}, floor ${floor}`;
}

export function teamIcons(run: ExpeditionRun) {
	return run.team.map(mon => {
		const species = Utils.escapeHTML(mon.species);
		return `<psicon pokemon="${species}" title="${species} (${mon.level})" />`;
	}).join('');
}

function statusLabel(TL: Translator, status: ExpeditionStatus) {
	if (status === 'open') return TL`Open`;
	if (status === 'closed') return TL`Closed`;
	return TL`Draft`;
}

function problemList(TL: Translator, problems: Problem[]) {
	return `<ul>` + problems.map(p => `<li>${Utils.escapeHTML(renderProblem(TL, p))}</li>`).join('') + `</ul>`;
}

const REGIONS = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'];

/** Treinadores do banco do Desafio, como a validação e os seletores precisam. */
function bankTrainers(): Map<number, BankTrainer & { avatar: string }> {
	let trainers: ReturnType<ReturnType<typeof getGymStore>['listTrainers']> = [];
	try {
		trainers = getGymStore().listTrainers();
	} catch {}
	return new Map(trainers.map(trainer => [trainer.id, {
		id: trainer.id, name: trainer.name, type: trainer.type, doubles: trainer.doubles, hasTeam: !!trainer.team,
		avatar: trainer.avatar,
	}]));
}

function trainerLabel(trainer: BankTrainer) {
	return Utils.escapeHTML(trainer.name) + (trainer.type ? ` (${Utils.escapeHTML(trainer.type)})` : '');
}

// --- Seções do editor --------------------------------------------------------------------

/** Seções do editor, na ordem da página. */
const SECTIONS = ['geral', 'formato', 'iniciais', 'atos', 'mapa', 'ia', 'chefes', 'insignias'] as const;
type Section = typeof SECTIONS[number];

function yesNo(TL: Translator): [string, string][] {
	return [['yes', TL`Yes`], ['no', TL`No`]];
}

function field(label: string, control: string, hint = '') {
	return `<p><label class="label">${label}:<br />${control}</label>` + (hint ? `<br /><small>${hint}</small>` : '') + `</p>`;
}

function textbox(name: string, value: string, maxlength: number, width = '') {
	return `<input name="${name}" class="textbox" maxlength="${maxlength}" value="${Utils.escapeHTML(value)}"` +
		(width ? ` style="width: ${width}"` : '') + ` />`;
}

/** Textarea com várias linhas: escape linha por linha (o escapeHTML do PS troca "\n" por <br />). */
function textarea(name: string, value: string, height = '80px') {
	const text = value.split('\n').map(line => Utils.escapeHTML(line)).join('&#13;');
	return `<textarea name="${name}" class="textbox" style="width: 100%; height: ${height}">${text}</textarea>`;
}

function speciesText(list: string[]) {
	return list.join(', ');
}

function parseSpeciesText(text: string) {
	return text.split(/[,\n]/).map(entry => entry.trim()).filter(Boolean);
}

const slotValue = (value: BossSlot) => String(value);
function parseSlot(text: string): BossSlot {
	if (text === 'pool' || text === 'generated') return text;
	const id = Number(text);
	return Number.isInteger(id) && id > 0 ? id : 'generated';
}

/** Valores de uma seção do formulário a partir da definição salva. */
function sectionValues(section: Section, name: string, def: ExpeditionDefinition): FormValues {
	switch (section) {
	case 'geral':
		return {
			name, desc: def.description, mode: def.mode, attrition: def.attrition, capture: def.capture,
			computer: def.computer ? 'yes' : 'no',
		};
	case 'formato': {
		const values: FormValues = { format: def.format.base, rules: def.format.rules, theme: speciesText(def.theme.species) };
		for (let gen = 1; gen <= GENERATIONS; gen++) values[`gen${fieldKey(gen)}`] = def.theme.gens.includes(gen) ? 'on' : '';
		return values;
	}
	case 'iniciais':
		return {
			size: String(def.starters.size), smode: def.starters.mode, teama: speciesText(def.starters.teams[0]),
			teamb: speciesText(def.starters.teams[1]), teamc: speciesText(def.starters.teams[2]),
			pool: speciesText(def.starters.pool),
		};
	case 'atos':
		return {
			actmode: def.acts.mode, acts: String(def.acts.count), start: String(def.startLevel), cap: String(def.levelCap),
			money: String(def.startMoney), legendary: String(def.legendaryChance), shiny: String(def.shinyOdds),
		};
	case 'mapa':
		return Object.fromEntries(NODE_WEIGHT_KEYS.map(key => [key, String(def.weights[key])]));
	case 'ia': {
		const values: FormValues = {};
		for (let act = 1; act <= MAX_ACTS; act++) {
			values[`wild${fieldKey(act)}`] = def.ai.wild[act - 1];
			values[`trainer${fieldKey(act)}`] = def.ai.trainer[act - 1];
			values[`boss${fieldKey(act)}`] = def.ai.boss[act - 1];
		}
		return values;
	}
	case 'chefes': {
		const values: FormValues = {
			elitea: slotValue(def.bosses.elite[0]), eliteb: slotValue(def.bosses.elite[1]),
			champ: slotValue(def.bosses.champion),
		};
		for (let act = 1; act <= MAX_ACTS; act++) values[`act${fieldKey(act)}`] = slotValue(def.bosses.acts[act - 1]);
		for (const id of def.bosses.pool) values[`pool${fieldKey(id)}`] = 'on';
		return values;
	}
	case 'insignias': {
		const values: FormValues = { bmode: def.badges.mode };
		for (let i = 0; i < BADGE_COUNT; i++) {
			values[`badge${fieldKey(i + 1)}`] = def.badges.ids[i] || '';
			values[`leader${fieldKey(i + 1)}`] = slotValue(def.badges.leaders[i]);
		}
		return values;
	}
	}
}

const number = (text: string | undefined, fallback: number) => {
	const value = Number((text || '').trim());
	return (text || '').trim() && Number.isFinite(value) ? Math.round(value) : fallback;
};

/** Aplica os valores enviados de uma seção na definição (os limites são conferidos por normalizeDefinition). */
function applySection(
	section: Section, values: FormValues, current: { name: string, def: ExpeditionDefinition }
): { name: string, def: ExpeditionDefinition } {
	const def: ExpeditionDefinition = JSON.parse(JSON.stringify(current.def));
	let name = current.name;
	switch (section) {
	case 'geral':
		name = (values.name || '').trim();
		def.description = (values.desc || '').trim();
		def.mode = values.mode === 'nuzlocke' ? 'nuzlocke' : 'standard';
		def.attrition = values.attrition === 'fullheal' ? 'fullheal' : 'persist';
		def.capture = values.capture === 'ball' || values.capture === 'chance' ? values.capture : 'choose';
		def.computer = values.computer === 'yes';
		break;
	case 'formato': {
		def.format = { base: toID(values.format || def.format.base), rules: (values.rules || '').trim() };
		def.theme.gens = [];
		for (let gen = 1; gen <= GENERATIONS; gen++) if (values[`gen${fieldKey(gen)}`] === 'on') def.theme.gens.push(gen);
		def.theme.species = parseSpeciesText(values.theme || '');
		break;
	}
	case 'iniciais':
		def.starters.size = number(values.size, def.starters.size);
		def.starters.mode = values.smode === 'fixed' ? 'fixed' : 'random';
		def.starters.teams = [values.teama, values.teamb, values.teamc].map(team => parseSpeciesText(team || ''));
		def.starters.pool = parseSpeciesText(values.pool || '');
		break;
	case 'atos':
		def.acts = { mode: values.actmode === 'custom' ? 'custom' : 'complete', count: number(values.acts, def.acts.count) };
		def.startLevel = number(values.start, def.startLevel);
		def.levelCap = number(values.cap, def.levelCap);
		def.startMoney = number(values.money, def.startMoney);
		def.legendaryChance = number(values.legendary, def.legendaryChance);
		def.shinyOdds = number(values.shiny, def.shinyOdds);
		break;
	case 'mapa':
		for (const key of NODE_WEIGHT_KEYS) def.weights[key] = number(values[key], def.weights[key]);
		break;
	case 'ia':
		for (let act = 1; act <= MAX_ACTS; act++) {
			def.ai.wild[act - 1] = values[`wild${fieldKey(act)}`] as any;
			def.ai.trainer[act - 1] = values[`trainer${fieldKey(act)}`] as any;
			def.ai.boss[act - 1] = values[`boss${fieldKey(act)}`] as any;
		}
		break;
	case 'chefes':
		for (let act = 1; act <= MAX_ACTS; act++) def.bosses.acts[act - 1] = parseSlot(values[`act${fieldKey(act)}`] || '');
		def.bosses.elite = [parseSlot(values.elitea || ''), parseSlot(values.eliteb || '')];
		def.bosses.champion = parseSlot(values.champ || '');
		def.bosses.pool = [...bankTrainers().keys()].filter(id => values[`pool${fieldKey(id)}`] === 'on');
		break;
	case 'insignias':
		def.badges.mode = values.bmode === 'chosen' ? 'chosen' : 'random';
		for (let i = 0; i < BADGE_COUNT; i++) {
			def.badges.leaders[i] = parseSlot(values[`leader${fieldKey(i + 1)}`] || '');
			if (def.badges.mode === 'chosen') def.badges.ids[i] = values[`badge${fieldKey(i + 1)}`] || '';
		}
		if (def.badges.mode === 'chosen') def.badges.ids = def.badges.ids.filter(Boolean);
		break;
	}
	// Valores errados (fora dos limites, de outro tipo) voltam ao que é aceito
	return { name, def: normalizeDefinition(def) };
}

function sectionTitle(TL: Translator, section: Section) {
	switch (section) {
	case 'geral': return TL`General`;
	case 'formato': return TL`Battle rules and theme`;
	case 'iniciais': return TL`Starting teams`;
	case 'atos': return TL`Acts, levels and money`;
	case 'mapa': return TL`Node chances`;
	case 'ia': return TL`Computer difficulty`;
	case 'chefes': return TL`Bosses`;
	case 'insignias': return TL`Badges (Complete mode)`;
	}
}

function slotOptions(TL: Translator, trainers: BankTrainer[]): [string, string][] {
	return [
		['generated', TL`Generated`],
		['pool', TL`Drawn from the selected trainers`],
		...trainers.map(trainer => [String(trainer.id), trainerLabel(trainer)] as [string, string]),
	];
}

function sectionForm(
	TL: Translator, section: Section, id: string, values: FormValues, def: ExpeditionDefinition, locked: boolean
) {
	const trainers = [...bankTrainers().values()].filter(trainer => trainer.hasTeam && !trainer.doubles);
	const fields: string[] = [];
	let keys: string[] = [];
	const levels = AI_LEVELS.map(level => [level, aiLevelLabel(TL, level)] as [string, string]);
	switch (section) {
	case 'geral':
		keys = ['name', 'desc', 'mode', 'attrition', 'capture', 'computer'];
		fields.push(
			field(TL`Name`, textbox('name', values.name || '', NAME_MAX_LENGTH)),
			field(TL`Description`, textbox('desc', values.desc || '', DESCRIPTION_MAX_LENGTH, '100%'),
				TL`Shown to the players on the expedition page.`),
			field(TL`Game mode`, selectBox('mode', [
				['standard', TL`Standard (fainted Pokémon stay in the team and can be revived)`],
				['nuzlocke', TL`Nuzlocke (fainted Pokémon leave the team)`],
			], values.mode)),
			field(TL`Wear`, selectBox('attrition', [
				['persist', TL`HP, PP and status carry over between battles`],
				['fullheal', TL`Full heal after each node`],
			], values.attrition)),
			field(TL`Capture`, selectBox('capture', [
				['choose', TL`Choose whether to keep the wild Pokémon after winning`],
				['ball', TL`Poké Ball from the bag: sure capture`],
				['chance', TL`Poké Ball from the bag: capture chance, as in the games`],
			], values.capture), TL`With Poké Balls, the player starts with 5 (with a chance) or 3 (sure capture), the PokéMart sells them and item nodes sometimes offer a Master Ball. With a chance, the wild Pokémon counts as weakened, and legendaries have at least 10% per ball.`),
			field(TL`Computer`, selectBox('computer', yesNo(TL), values.computer),
				TL`At the PokéCenter, the player chooses between healing and using the Computer to change the team. With a full team, the caught Pokémon or the one swapped out goes to the Computer. Held items always go to the bag.`),
		);
		break;
	case 'formato': {
		keys = ['format', 'rules', 'theme'];
		const gens: string[] = [];
		for (let gen = 1; gen <= GENERATIONS; gen++) {
			const key = `gen${fieldKey(gen)}`;
			keys.push(key);
			const region = REGIONS[gen - 1];
			gens.push(`<label style="white-space: nowrap"><input type="checkbox" name="${key}"${values[key] === 'on' ? ' checked' : ''} /> ` +
				`${TL`Gen ${gen}`} (${region})</label>`);
		}
		const formatControl = `<formatselect name="format" format="${Utils.escapeHTML(toID(values.format || ''))}">` +
			`${Utils.escapeHTML(formatLabel(values.format || ''))}</formatselect>`;
		fields.push(
			field(TL`Base format`, formatControl, TL`Generation 3 onwards (the bag needs items and abilities).`),
			field(TL`Extra rules`, textbox('rules', values.rules || '', RULES_MAX_LENGTH, '100%'),
				TL`Pokémon Showdown rules, separated by commas. The default allows the full Pokédex and Mega Evolution, without Tera, Z-Moves and Dynamax.`),
			`<p><strong>${TL`Theme: generations`}</strong><br />${gens.join(' &nbsp; ')}<br />` +
			`<small>${TL`None checked = the whole Pokédex. Wild Pokémon, trainers, starters and evolutions stay in the theme.`}</small></p>`,
			field(TL`Theme: Pokémon list`, textarea('theme', values.theme || ''),
				TL`Optional, separated by commas. Each Pokémon brings its whole evolution line. With a list, the generations do not count.`),
		);
		break;
	}
	case 'iniciais':
		keys = ['size', 'smode', 'teama', 'teamb', 'teamc', 'pool'];
		fields.push(
			field(TL`Pokémon per team`, selectBox('size', [['1', '1'], ['2', '2'], ['3', '3']], values.size)),
			field(TL`Teams`, selectBox('smode', [
				['random', TL`Drawn for each run`],
				['fixed', TL`Fixed`],
			], values.smode), TL`The player always chooses one of 3 teams. Each team has a regional starter, and they do not repeat between the teams.`),
			`<p><strong>${TL`Fixed teams`}</strong> <small>${TL`(Pokémon separated by commas)`}</small></p>`,
			field(TL`Team 1`, textbox('teama', values.teama || '', 120, '100%')),
			field(TL`Team 2`, textbox('teamb', values.teamb || '', 120, '100%')),
			field(TL`Team 3`, textbox('teamc', values.teamc || '', 120, '100%')),
			field(TL`Pool of the drawn teams`, textarea('pool', values.pool || ''),
				TL`Separated by commas. Empty = the regional starters of the theme. It needs at least 3 regional starters, and the Pokémon must fit the starting level.`),
		);
		break;
	case 'atos':
		keys = ['actmode', 'acts', 'start', 'cap', 'money', 'legendary', 'shiny'];
		fields.push(
			field(TL`Acts`, selectBox('actmode', [
				['complete', TL`Complete (3 acts and the special act)`],
				['custom', TL`Custom (1 to 4 acts, no special act)`],
			], values.actmode), TL`Complete: each run fights for one of the 8 badges, each badge adds a difficulty penalty, and with all 8 the special act opens (Elite Four in doubles and the Champion, at level 100).`),
			field(TL`Number of acts (Custom)`, selectBox('acts', [['1', '1'], ['2', '2'], ['3', '3'], ['4', '4']], values.acts)),
			field(TL`Starting level`, textbox('start', values.start || '', 2, '4em')),
			field(TL`Level of the final boss`, textbox('cap', values.cap || '', 3, '4em'),
				TL`The levels of each act follow from the starting level and this one.`),
			field(TL`Starting money`, textbox('money', values.money || '', 6, '6em'), TL`Up to ${MAX_START_MONEY}.`),
			field(TL`Chance of a legendary in each act (%)`, textbox('legendary', values.legendary || '', 3, '4em'),
				TL`From the second act on (with one act, in its second half).`),
			field(TL`Shiny wild Pokémon: 1 in`, textbox('shiny', values.shiny || '', 5, '6em'),
				TL`0 = never. Up to ${MAX_SHINY_ODDS}. A shiny Pokémon stays shiny when caught.`),
		);
		break;
	case 'mapa': {
		keys = [...NODE_WEIGHT_KEYS];
		const label = (key: NodeWeightKey) => {
			switch (key) {
			case 'wild': return TL`Tall grass (wild Pokémon)`;
			case 'event': return TL`Event "?"`;
			case 'trainer': return TL`Trainer`;
			case 'elite': return TL`Elite trainer`;
			case 'rest': return TL`PokéCenter`;
			case 'shop': return TL`PokéMart`;
			case 'item': return TL`Item`;
			}
		};
		fields.push(`<table>` + NODE_WEIGHT_KEYS.map(key => (
			`<tr><td>${label(key)}</td><td>${textbox(key, values[key] || '', 3, '4em')} %</td></tr>`
		)).join('') + `</table>`, `<p><small>${TL`Relative chances. The first floor is always tall grass, the middle floor an item and the floor before the boss a PokéCenter. No PokéCenter or elite before floor 6, and no PokéCenter on floor 13.`}</small></p>`);
		break;
	}
	case 'ia': {
		let table = `<table><tr><th></th><th>${TL`Wild Pokémon`}</th><th>${TL`Trainers`}</th><th>${TL`Bosses`}</th></tr>`;
		for (let act = 1; act <= MAX_ACTS; act++) {
			const k = fieldKey(act);
			keys.push(`wild${k}`, `trainer${k}`, `boss${k}`);
			table += `<tr><td>${TL`Act ${act}`}</td><td>${selectBox(`wild${k}`, levels, values[`wild${k}`])}</td>` +
				`<td>${selectBox(`trainer${k}`, levels, values[`trainer${k}`])}</td>` +
				`<td>${selectBox(`boss${k}`, levels, values[`boss${k}`])}</td></tr>`;
		}
		fields.push(table + `</table>`, `<p><small>${TL`Elite trainers play one level above the trainers. In the special act, the Elite Four play on Hard and the Champion on Master.`}</small></p>`);
		break;
	}
	case 'chefes': {
		const options = slotOptions(TL, trainers);
		let table = `<table>`;
		for (let act = 1; act <= MAX_ACTS; act++) {
			const key = `act${fieldKey(act)}`;
			keys.push(key);
			const note = def.acts.mode === 'complete' && act === COMPLETE_ACTS ?
				`<br /><small>${TL`In the Complete mode, the act 3 boss is the leader of the badge in play (Badges section).`}</small>` : '';
			table += `<tr><td>${TL`Act ${act} boss`}</td><td>${selectBox(key, options, values[key])}${note}</td></tr>`;
		}
		keys.push('elitea', 'eliteb', 'champ');
		table += `<tr><td>${TL`Special act: Elite Four 1`}</td><td>${selectBox('elitea', options, values.elitea)}</td></tr>` +
			`<tr><td>${TL`Special act: Elite Four 2`}</td><td>${selectBox('eliteb', options, values.eliteb)}</td></tr>` +
			`<tr><td>${TL`Special act: Champion`}</td><td>${selectBox('champ', options, values.champ)}</td></tr></table>`;
		let pool = `<p><strong>${TL`Trainers that can be drawn`}</strong></p>`;
		if (!trainers.length) {
			pool += `<p><em>${TL`The trainer bank of the Gym Challenge is empty.`}</em></p>`;
		} else {
			pool += `<div class="ladder"><table><tr><th></th><th>${TL`Trainer`}</th><th>${TL`Trainer type`}</th></tr>`;
			for (const trainer of trainers) {
				const key = `pool${fieldKey(trainer.id)}`;
				keys.push(key);
				pool += `<tr><td><input type="checkbox" name="${key}"${values[key] === 'on' ? ' checked' : ''} /></td>` +
					`<td>${Utils.escapeHTML(trainer.name)}</td>` +
					`<td>${trainer.type ? `<psicon type="${Utils.escapeHTML(trainer.type)}" />` : '-'}</td></tr>`;
			}
			pool += `</table></div>`;
		}
		fields.push(table, pool, `<p><small>${TL`Trainers from the bank of the Gym Challenge, adjusted to the power of the act: each Pokémon goes back to the stage of the level, keeps the moves that stage learns and stays in the theme; the team has 3 or 4 Pokémon in act 1, 5 in act 2 and 6 from act 3 on.`}</small></p>`);
		break;
	}
	case 'insignias': {
		const options: [string, string][] = [['', TL`(none)`], ...BADGES.filter(badge => badge.type).map(badge => (
			[badge.id, Utils.escapeHTML(`${badgeLabel(badge)} - ${badge.type}`)] as [string, string]
		))];
		const leaderOptions = slotOptions(TL, trainers);
		let table = `<table><tr><th></th><th>${TL`Badge`}</th><th>${TL`Leader`}</th></tr>`;
		for (let i = 0; i < BADGE_COUNT; i++) {
			const k = fieldKey(i + 1);
			const badge = BADGES.find(entry => entry.id === def.badges.ids[i]);
			const icon = badge ? badgeIcon({ name: badge.name, image: badge.image }, badge.type, 32) + ' ' : '';
			const type = badge?.type ? ` <psicon type="${Utils.escapeHTML(badge.type)}" />` : '';
			const position = i + 1;
			keys.push(`badge${k}`, `leader${k}`);
			const badgeControl = locked || values.bmode !== 'chosen' ?
				`${icon}${badge ? Utils.escapeHTML(badgeLabel(badge)) : '-'}${type}` :
				`${icon}${selectBox(`badge${k}`, options, values[`badge${k}`])}${type}`;
			table += `<tr><td>${position}</td><td>${badgeControl}</td>` +
				`<td>${selectBox(`leader${k}`, leaderOptions, values[`leader${k}`])}</td></tr>`;
		}
		table += `</table>`;
		keys.unshift('bmode');
		const mode = locked ? `<p>${values.bmode === 'chosen' ? TL`Chosen` : TL`Drawn`}</p>` +
			`<input type="hidden" name="bmode" value="${Utils.escapeHTML(values.bmode)}" />` :
			field(TL`Badges`, selectBox('bmode', [['random', TL`Drawn (8 different types)`], ['chosen', TL`Chosen`]], values.bmode));
		fields.push(mode, table,
			`<p><small>${TL`The leader is the act 3 boss when its badge is in play, with the badge type. Generated or drawn leaders get that type.`}</small></p>`);
		if (locked) fields.push(`<p><small>${TL`The badges are locked: the expedition already has runs.`}</small></p>`);
		break;
	}
	}
	return `<form data-submitsend="/expedicaoadmin salvar ${id},${section},${placeholders(keys)}">` +
		fields.join('') +
		`<p><button class="button" type="submit"><strong>${TL`Save`}</strong></button></p></form>`;
}

/** Botões das insígnias fora do formulário: sortear de novo e escolher o conjunto de uma liga. */
function badgeTools(TL: Translator, id: number) {
	const leagues = badgeLeagues().map(league => (
		`<button class="button" name="send" value="/expedicaoadmin liga ${id},${Utils.escapeHTML(league.region)}">` +
		`${Utils.escapeHTML(league.region)}</button>`
	)).join(' ');
	return `<p><button class="button" name="send" value="/expedicaoadmin sortearinsignias ${id}">${TL`Draw again`}</button></p>` +
		(leagues ? `<p>${TL`Choose the set of a league:`} ${leagues}</p>` : '');
}

// --- Exportar e importar ----------------------------------------------------------------

const PACKAGE_VERSION = 1;

type PackageSlot = 'generated' | 'pool' | { trainer: string };

/** Pacote de expedições: a definição, com os treinadores do banco pelo nome. */
function exportPackage(ids: number[]) {
	const trainers = bankTrainers();
	const toSlot = (slot: BossSlot): PackageSlot => (
		typeof slot === 'number' ? { trainer: trainers.get(slot)?.name || '' } : slot
	);
	const store = getStore();
	const expeditions = ids.map(id => store.getExpedition(id)).filter(Boolean).map(expedition => {
		const def = expedition!.definition;
		return {
			name: expedition!.name,
			definition: {
				...def,
				bosses: {
					acts: def.bosses.acts.map(toSlot), elite: def.bosses.elite.map(toSlot), champion: toSlot(def.bosses.champion),
					pool: def.bosses.pool.map(trainerId => trainers.get(trainerId)?.name).filter(Boolean),
				},
				badges: { ...def.badges, leaders: def.badges.leaders.map(toSlot) },
			},
		};
	});
	return JSON.stringify({ version: PACKAGE_VERSION, expeditions }, null, 2);
}

/** Lê um pacote: cada expedição vira um rascunho; treinadores que faltam no banco viram "gerado". */
function readPackage(text: string): { name: string, def: ExpeditionDefinition, missing: string[] }[] | null {
	let data: AnyObject;
	try {
		data = JSON.parse(text);
	} catch {
		return null;
	}
	if (!data || data.version !== PACKAGE_VERSION || !Array.isArray(data.expeditions)) return null;
	const byName = new Map([...bankTrainers().values()].map(trainer => [trainer.name.toLowerCase(), trainer.id]));
	return data.expeditions.slice(0, 20).map((entry: AnyObject) => {
		const missing: string[] = [];
		const fromSlot = (slot: unknown): BossSlot => {
			if (slot === 'pool' || slot === 'generated') return slot;
			const trainerName = typeof (slot as AnyObject)?.trainer === 'string' ? (slot as AnyObject).trainer : '';
			const found = byName.get(trainerName.toLowerCase());
			if (!found && trainerName) missing.push(trainerName);
			return found || 'generated';
		};
		const raw = (entry?.definition && typeof entry.definition === 'object' ? entry.definition : {}) as AnyObject;
		const bosses = raw.bosses || {};
		const badges = raw.badges || {};
		const pool = Array.isArray(bosses.pool) ? bosses.pool : [];
		const def = normalizeDefinition({
			...raw,
			bosses: {
				acts: (Array.isArray(bosses.acts) ? bosses.acts : []).map(fromSlot),
				elite: (Array.isArray(bosses.elite) ? bosses.elite : []).map(fromSlot),
				champion: fromSlot(bosses.champion),
				pool: pool.map((trainerName: unknown) => {
					const found = typeof trainerName === 'string' ? byName.get(trainerName.toLowerCase()) : undefined;
					if (!found && typeof trainerName === 'string') missing.push(trainerName);
					return found;
				}).filter(Boolean),
			},
			badges: { ...badges, leaders: (Array.isArray(badges.leaders) ? badges.leaders : []).map(fromSlot) },
		});
		return { name: typeof entry?.name === 'string' ? entry.name.trim() : '', def, missing: [...new Set(missing)] };
	});
}

// --- Páginas -----------------------------------------------------------------------------

function runsTable(TL: Translator, runs: ExpeditionRun[], active: boolean) {
	if (!runs.length) {
		return `<p><em>${active ? TL`No expeditions in progress.` : TL`No finished expeditions yet.`}</em></p>`;
	}
	return `<div class="ladder"><table><tr><th>${TL`Player`}</th><th>${TL`Expedition`}</th><th>${TL`Progress`}</th>` +
		`<th>${TL`Team`}</th><th>${active ? TL`Started` : TL`Result`}</th><th></th></tr>` + runs.map(run => {
		const variant = getVariant(run.variant);
		const name = variant ? variant.name(TL) : Utils.escapeHTML(run.variant);
		const last = active ? formatDate(run.startedAt) :
			`${runStatusLabel(TL, run)}<br /><small>${formatDate(run.endedAt)}</small>`;
		const close = active ? `<details><summary>${TL`Close`}</summary>` +
			`<button class="button" name="send" value="/expedicaoadmin encerrar ${run.id}">${TL`Confirm`}</button></details>` : '';
		return `<tr><td>${Utils.escapeHTML(run.userid)}</td><td>${name}</td><td>${runProgress(TL, run)}</td>` +
			`<td>${teamIcons(run)}</td><td>${last}</td><td>${close}</td></tr>`;
	}).join('') + `</table></div>`;
}

function navButtons(TL: Translator) {
	return `<p><button class="button" name="gymGo" value="view-ginasiosadmin">${TL`Admin panel`}</button> ` +
		`<button class="button" name="gymGo" value="${ADMIN_PAGE}">${TL`Expeditions`}</button> ` +
		`<button class="button" name="gymGo" value="${ADMIN_PAGE}-pacotes">${TL`Import and export`}</button></p>`;
}

function renderList(TL: Translator) {
	const store = getStore();
	let buf = `<h3>${TL`Expeditions`}</h3>` +
		`<p><button class="button" name="gymGo" value="${ADMIN_PAGE}-novo"><strong>${TL`New expedition`}</strong></button></p>`;
	const expeditions = store.listExpeditions();
	if (!expeditions.length) {
		buf += `<p><em>${TL`No expeditions yet.`}</em></p>`;
	} else {
		const rank = { open: 0, draft: 1, closed: 2 };
		expeditions.sort((a, b) => rank[a.status] - rank[b.status]);
		buf += `<div class="ladder"><table><tr><th>${TL`Expedition`}</th><th>${TL`Status`}</th><th>${TL`Runs`}</th>` +
			`<th></th></tr>` + expeditions.map(expedition => (
			`<tr><td>${Utils.escapeHTML(expedition.name)}</td><td>${statusLabel(TL, expedition.status)}</td>` +
			`<td>${store.countRuns(String(expedition.id))}</td>` +
			`<td><button class="button" name="gymGo" value="${ADMIN_PAGE}-${expedition.id}">` +
			`${expedition.status === 'closed' ? TL`View` : TL`Edit`}</button></td></tr>`
		)).join('') + `</table></div>`;
	}
	buf += `<h3>${TL`Expeditions in progress`}</h3>` + runsTable(TL, store.listAllRuns(true), true);
	buf += `<h3>${TL`History`}</h3>` + runsTable(TL, store.listAllRuns(false, 30), false);
	return buf;
}

function renderEditor(TL: Translator, user: User, rawId: string) {
	const store = getStore();
	if (rawId === 'novo') {
		const values = takeDraft(user, 'novo-geral') || sectionValues('geral', '', DEFAULT_DEFINITION);
		return `<h3>${TL`New expedition`}</h3>` +
			`<p><small>${TL`Start with the name and the general options; the other sections appear after saving.`}</small></p>` +
			sectionForm(TL, 'geral', 'novo', values, DEFAULT_DEFINITION, false);
	}
	const expedition = store.getExpedition(Number(rawId));
	if (!expedition) return `<p>${TL`Expedition not found.`}</p>`;
	const id = expedition.id;
	const def = expedition.definition;
	const status = statusLabel(TL, expedition.status);
	const runCount = store.countRuns(String(id));
	let buf = `<h3>${Utils.escapeHTML(expedition.name)}</h3><p>${TL`Status: ${status}`} &middot; ${TL`Runs: ${runCount}`}</p>`;
	if (expedition.status === 'closed') {
		const note = TL`Closed expeditions are kept as history and cannot be changed. Reopen it to edit.`;
		return buf + `<p><small>${note}</small></p>` +
			`<p><button class="button" name="send" value="/expedicaoadmin reabrir ${id}"><strong>${TL`Reopen expedition`}</strong>` +
			`</button></p>` + exportBox(TL, id);
	}
	if (expedition.status === 'open') {
		buf += `<p><small>${TL`The expedition is open: changes are only saved if it stays ready to play. Runs in progress keep the settings they started with, except the battle rules (base format and extra rules), which apply to every battle.`}</small></p>`;
	} else {
		buf += `<p><small>${TL`Drafts can be played by administrators, to test them.`}</small> ` +
			`<button class="button" name="gymGo" value="view-expedicao-run-${id}">${TL`Test`}</button></p>`;
	}
	const locked = runCount > 0;
	for (const section of SECTIONS) {
		const values = takeDraft(user, `${id}-${section}`) || sectionValues(section, expedition.name, def);
		buf += `<hr /><h3>${sectionTitle(TL, section)}</h3>` + sectionForm(TL, section, String(id), values, def, locked);
		if (section === 'insignias' && !locked) buf += badgeTools(TL, id);
	}

	const problems = definitionProblems(def, bankTrainers());
	buf += `<hr /><h3>${TL`Ready to open?`}</h3>`;
	buf += problems.length ? `<p>${TL`Fix these items before opening the expedition:`}</p>` + problemList(TL, problems) :
		`<p>${TL`Everything is ready.`}</p>`;
	if (expedition.status === 'draft') {
		buf += `<p><button class="button" name="send" value="/expedicaoadmin abrir ${id}"${problems.length ? ' disabled' : ''}>` +
			`<strong>${TL`Open expedition`}</strong></button></p>`;
		if (!runCount) {
			buf += `<details><summary>${TL`Delete draft`}</summary>` +
				`<p><button class="button" name="send" value="/expedicaoadmin apagar ${id}">${TL`Confirm deletion`}</button></p>` +
				`</details>`;
		}
	} else {
		buf += `<details><summary>${TL`Close expedition`}</summary>` +
			`<p>${TL`Nobody can play it until it is reopened. Runs in progress are closed; the history is kept.`}</p>` +
			`<p><button class="button" name="send" value="/expedicaoadmin encerrarexpedicao ${id}">${TL`Confirm closing`}</button>` +
			`</p></details>`;
	}
	return buf + exportBox(TL, id);
}

function exportBox(TL: Translator, id: number) {
	const text = exportPackage([id]).split('\n').map(line => Utils.escapeHTML(line)).join('&#13;');
	return `<hr /><details><summary>${TL`Export (JSON)`}</summary>` +
		`<p><small>${TL`Paste it in Import and export on another server. Bank trainers go by name.`}</small></p>` +
		`<textarea class="textbox" readonly style="width: 100%; height: 240px">${text}</textarea></details>`;
}

function renderPackages(TL: Translator) {
	const store = getStore();
	const all = store.listExpeditions().map(expedition => expedition.id);
	const text = exportPackage(all).split('\n').map(line => Utils.escapeHTML(line)).join('&#13;');
	return `<h3>${TL`Import`}</h3>` +
		`<form data-submitsend="/expedicaoadmin importar {pacote}">` +
		`<p><label class="label">${TL`Package (JSON)`}:<br />` +
		`<textarea name="pacote" class="textbox" style="width: 100%; height: 200px"></textarea></label></p>` +
		`<p><small>${TL`Each expedition comes in as a draft. Names that already exist are skipped. Bank trainers that do not exist here become generated bosses.`}</small></p>` +
		`<p><button class="button" type="submit"><strong>${TL`Import`}</strong></button></p></form>` +
		`<h3>${TL`Export all`}</h3>` +
		`<textarea class="textbox" readonly style="width: 100%; height: 240px">${text}</textarea>`;
}

export function renderAdminPage(TL: Translator, user: User, query: string[] = []) {
	let buf = `<div class="pad"><h2>${TL`Expedition`}: ${TL`admin panel`}</h2>`;
	if (!isAdmin(user)) return buf + `<p>${TL`Access denied.`}</p></div>`;
	buf += navButtons(TL);
	const target = query[0] || '';
	if (!target) return buf + renderList(TL) + `</div>`;
	if (target === 'pacotes') return buf + renderPackages(TL) + `</div>`;
	return buf + renderEditor(TL, user, target) + `</div>`;
}

// --- Comandos ----------------------------------------------------------------------------

function requireAdmin(context: Chat.CommandContext, user: User) {
	if (!isAdmin(user)) throw new Chat.ErrorMessage(context.TL`Access denied.`);
}

function requireExpedition(context: Chat.CommandContext, target: string) {
	const expedition = getStore().getExpedition(Number(target));
	if (!expedition) throw new Chat.ErrorMessage(context.TL`Expedition not found.`);
	return expedition;
}

/** Recarrega os formatos (o de cada expedição sai do banco); avisa o admin se falhar. */
function reloadExpeditionFormats(context: Chat.CommandContext, connection: Connection) {
	invalidateExpeditions();
	if (reloadFormats()) return;
	connection.popup(context.TL`The expedition formats could not be updated. The previous formats remain in use; see the crash log.`);
}

function nameTaken(name: string, exceptId: number | null) {
	const lower = name.toLowerCase();
	return getStore().listExpeditions().some(entry => entry.id !== exceptId && entry.name.toLowerCase() === lower);
}

function rejectWith(context: Chat.CommandContext, connection: Connection, problems: Problem[], page: string) {
	const list = problems.map(p => `- ${renderProblem(context.TL, p)}`).join('\n');
	connection.popup(`${context.TL`The expedition was not saved:`}\n\n${list}`);
	return context.parse(`/join ${page}`);
}

export const commands: Chat.ChatCommands = {
	expedicaoadmin: {
		''() {
			return this.parse(`/join ${ADMIN_PAGE}`);
		},

		salvar(target, room, user, connection) {
			requireAdmin(this, user);
			const [rawId, rawSection, rest] = Utils.splitFirst(target, ',', 2);
			const section = toID(rawSection) as Section;
			if (!SECTIONS.includes(section)) throw new Chat.ErrorMessage(this.TL`Expedition not found.`);
			const values = parseFields(rest || '');
			const store = getStore();
			const isNew = rawId.trim() === 'novo';
			const existing = isNew ? null : requireExpedition(this, rawId);
			if (existing?.status === 'closed') throw new Chat.ErrorMessage(this.TL`Closed expeditions cannot be changed.`);
			if (isNew && section !== 'geral') throw new Chat.ErrorMessage(this.TL`Expedition not found.`);
			const page = `${ADMIN_PAGE}-${isNew ? 'novo' : existing!.id}`;
			const draftKey = `${isNew ? 'novo' : existing!.id}-${section}`;
			const current = existing ? { name: existing.name, def: existing.definition } :
				{ name: '', def: normalizeDefinition(DEFAULT_DEFINITION) };
			// Insígnias travadas depois da primeira run: só os líderes mudam
			const locked = !!existing && store.countRuns(String(existing.id)) > 0;
			const next = applySection(section, values, current);
			if (locked) next.def.badges = { ...next.def.badges, mode: current.def.badges.mode, ids: current.def.badges.ids };

			const problems: Problem[] = [...checkExpeditionName(next.name), ...checkDefinitionFields(next.def)];
			// Regras de batalha conferidas já ao salvar (vão para o formato da expedição)
			if (section === 'formato') problems.push(...checkExpeditionFormat(next.def.format));
			if (next.name && nameTaken(next.name, existing?.id ?? null)) {
				problems.push({ message: TLkey`There is already an expedition with this name.`, args: [] });
			}
			// Insígnias sorteadas: o sorteio acontece ao escolher o modo (e fica até sortear de novo)
			if (!locked && next.def.badges.mode === 'random' && next.def.badges.ids.length !== BADGE_COUNT) {
				next.def.badges.ids = drawBadges(seededRandom(newSeed(), 'badges'));
			}
			// Aberta: só salva se continuar pronta para jogar
			if (existing?.status === 'open') problems.push(...definitionProblems(next.def, bankTrainers()));
			if (problems.length) {
				saveDraft(user, draftKey, values);
				return rejectWith(this, connection, problems, page);
			}
			let id: number;
			if (existing) {
				store.updateExpedition(existing.id, next.name.trim(), next.def);
				id = existing.id;
			} else {
				id = store.createExpedition(next.name.trim(), next.def);
			}
			this.globalModlog('EXPEDITION', null, `saved #${id} (${section})`);
			// O formato da expedição só muda na criação e na seção de regras
			if (isNew || section === 'formato') reloadExpeditionFormats(this, connection);
			else invalidateExpeditions();
			return this.parse(`/join ${ADMIN_PAGE}-${id}`);
		},

		abrir(target, room, user, connection) {
			requireAdmin(this, user);
			const expedition = requireExpedition(this, target);
			if (expedition.status !== 'draft') throw new Chat.ErrorMessage(this.TL`Only drafts can be opened.`);
			const problems = definitionProblems(expedition.definition, bankTrainers());
			if (problems.length) {
				const list = problems.map(p => `- ${renderProblem(this.TL, p)}`).join('\n');
				connection.popup(`${this.TL`The expedition was not opened:`}\n\n${list}`);
				return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
			}
			getStore().setExpeditionStatus(expedition.id, 'open');
			this.globalModlog('EXPEDITION', null, `opened #${expedition.id}`);
			invalidateExpeditions();
			return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
		},

		encerrarexpedicao(target, room, user, connection) {
			requireAdmin(this, user);
			const expedition = requireExpedition(this, target);
			if (expedition.status !== 'open') throw new Chat.ErrorMessage(this.TL`Only open expeditions can be closed.`);
			const store = getStore();
			store.setExpeditionStatus(expedition.id, 'closed');
			// As runs em andamento são encerradas junto (com a batalha aberta, se houver); o histórico fica
			for (const runId of store.listActiveRunIds(String(expedition.id))) closeRunByAdmin(runId);
			this.globalModlog('EXPEDITION', null, `closed #${expedition.id}`);
			reloadExpeditionFormats(this, connection);
			return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
		},

		reabrir(target, room, user, connection) {
			requireAdmin(this, user);
			const expedition = requireExpedition(this, target);
			if (expedition.status !== 'closed') throw new Chat.ErrorMessage(this.TL`Only closed expeditions can be reopened.`);
			// Treinadores e formatos podem ter mudado desde o encerramento: mesma validação de abrir
			const problems = definitionProblems(expedition.definition, bankTrainers());
			if (problems.length) {
				const list = problems.map(p => `- ${renderProblem(this.TL, p)}`).join('\n');
				connection.popup(`${this.TL`The expedition was not reopened:`}\n\n${list}`);
				return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
			}
			getStore().setExpeditionStatus(expedition.id, 'open');
			this.globalModlog('EXPEDITION', null, `reopened #${expedition.id}`);
			reloadExpeditionFormats(this, connection);
			return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
		},

		apagar(target, room, user, connection) {
			requireAdmin(this, user);
			const expedition = requireExpedition(this, target);
			if (!getStore().deleteDraftExpedition(expedition.id)) {
				throw new Chat.ErrorMessage(this.TL`Only drafts without runs can be deleted.`);
			}
			this.globalModlog('EXPEDITION', null, `deleted draft #${expedition.id}`);
			reloadExpeditionFormats(this, connection);
			return this.parse(`/join ${ADMIN_PAGE}`);
		},

		liga(target, room, user) {
			requireAdmin(this, user);
			const [rawId, region] = Utils.splitFirst(target, ',');
			const expedition = requireExpedition(this, rawId);
			if (expedition.status === 'closed') throw new Chat.ErrorMessage(this.TL`Closed expeditions cannot be changed.`);
			if (getStore().countRuns(String(expedition.id))) {
				throw new Chat.ErrorMessage(this.TL`The badges are locked: the expedition already has runs.`);
			}
			const league = badgeLeagues().find(entry => entry.region === (region || '').trim());
			if (!league) throw new Chat.ErrorMessage(this.TL`League not found.`);
			const badges = { ...expedition.definition.badges, mode: 'chosen' as const, ids: league.ids };
			const def = { ...expedition.definition, badges };
			getStore().updateExpedition(expedition.id, expedition.name, def);
			this.globalModlog('EXPEDITION', null, `badges of #${expedition.id}: ${league.region}`);
			invalidateExpeditions();
			return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
		},

		sortearinsignias(target, room, user) {
			requireAdmin(this, user);
			const expedition = requireExpedition(this, target);
			if (expedition.status === 'closed') throw new Chat.ErrorMessage(this.TL`Closed expeditions cannot be changed.`);
			if (getStore().countRuns(String(expedition.id))) {
				throw new Chat.ErrorMessage(this.TL`The badges are locked: the expedition already has runs.`);
			}
			const ids = drawBadges(seededRandom(newSeed(), 'badges'));
			const def = { ...expedition.definition, badges: { ...expedition.definition.badges, mode: 'random' as const, ids } };
			getStore().updateExpedition(expedition.id, expedition.name, def);
			this.globalModlog('EXPEDITION', null, `badges of #${expedition.id} drawn`);
			invalidateExpeditions();
			return this.parse(`/join ${ADMIN_PAGE}-${expedition.id}`);
		},

		importar(target, room, user, connection) {
			requireAdmin(this, user);
			const entries = readPackage(target);
			if (!entries) throw new Chat.ErrorMessage(this.TL`Invalid package: paste the JSON exported by this panel.`);
			const store = getStore();
			const lines: string[] = [];
			let created = 0;
			for (const entry of entries) {
				// Mesma validação de salvar: nome, campos e formato (o resto é conferido ao abrir)
				const problems = [
					...checkExpeditionName(entry.name), ...checkDefinitionFields(entry.def), ...checkExpeditionFormat(entry.def.format),
				];
				const label = entry.name || '?';
				if (nameTaken(entry.name, null)) {
					lines.push(`- ${label}: ${this.TL`skipped (invalid name or one that already exists).`}`);
					continue;
				}
				if (problems.length) {
					const list = problems.map(p => renderProblem(this.TL, p)).join(' ');
					lines.push(`- ${label}: ${this.TL`skipped:`} ${list}`);
					continue;
				}
				const id = store.createExpedition(entry.name, entry.def);
				created++;
				const missing = entry.missing.join(', ');
				lines.push(`- ${label}: ${this.TL`imported as a draft.`}` +
					(missing ? ` ${this.TL`Trainers not found in the bank (now generated): ${missing}.`}` : ''));
				this.globalModlog('EXPEDITION', null, `imported #${id}`);
			}
			if (created) reloadExpeditionFormats(this, connection);
			connection.popup(`${this.TL`Import:`}\n\n${lines.join('\n') || '-'}`);
			return this.parse(`/join ${ADMIN_PAGE}`);
		},

		encerrar(target, room, user) {
			requireAdmin(this, user);
			const run = closeRunByAdmin(Number(target));
			if (!run) throw new Chat.ErrorMessage(this.TL`This expedition is not in progress.`);
			this.globalModlog('EXPEDITION', run.userid as ID, `closed run #${run.id} (${run.variant})`);
			return this.parse(`/join ${ADMIN_PAGE}`);
		},
	},
};

export function start() {
	// Textareas (listas de Pokémon) e o pacote JSON chegam com várias linhas
	Chat.multiLinePattern.register('/(expedicaoadmin) (salvar|importar) ');
}
