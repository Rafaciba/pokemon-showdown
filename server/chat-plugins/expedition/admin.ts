/**
 * pokemon-showdown-custom: painel do admin da Expedição (etapa 4).
 *
 * Página view-expedicao-admin (decisão do usuário: dentro do painel admin que já
 * existe, que tem o botão para ela), só para administradores:
 *   - variações: ligar e desligar, e ajustar os números marcados em `tunables`, dentro
 *     dos limites (valem para as runs novas; as em andamento guardam as configurações
 *     com que começaram);
 *   - runs em andamento, com o encerramento pelo admin (decisão do usuário, como no
 *     Desafio: a run fica no histórico como "encerrada");
 *   - histórico das runs encerradas.
 *
 * Comandos (/expedicaoadmin): ligar <variação>, desligar <variação>,
 * ajustar <variação>,<valor 1>,<valor 2>... (na ordem de `tunables`; vazio = padrão),
 * encerrar <run>. Toda ação vai para o modlog.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import { getStore, isAdmin } from './state';
import { getVariant, listVariants, tunableValue, type ExpeditionVariant, type Tunable } from './variant';
import { getNodeType } from './nodes';
import { closeRunByAdmin } from './runs';
import type { ExpeditionRun } from './store';

export const ADMIN_PAGE = 'view-expedicao-admin';

/** Nome de um número ajustável, para o painel. */
function tunableLabel(TL: Translator, key: string) {
	const [kind, ref] = key.split(':');
	const node = ref ? getNodeType(ref)?.label(TL) || ref : '';
	switch (kind) {
	case 'acts': return TL`Acts`;
	case 'floors': return TL`Floors per act`;
	case 'columns': return TL`Map columns`;
	case 'paths': return TL`Paths on the map`;
	case 'teamSize': return TL`Team size`;
	case 'weight': return TL`Chance of node: ${node}`;
	case 'rare': return TL`Chance per act (%): ${node}`;
	}
	switch (ref) {
	case 'levelsPerAct': return TL`Levels per act`;
	case 'bossLegendaryChance': return TL`Chance of a legendary in the boss team (%)`;
	case 'startMoney': return TL`Starting money`;
	case 'startLevel': return TL`Starting level`;
	}
	return Utils.escapeHTML(key);
}

/** Nome do campo do formulário de cada número: só letras (o cliente só troca marcadores {a-z}). */
function fieldName(index: number) {
	return `t${String.fromCharCode(97 + Math.floor(index / 26))}${String.fromCharCode(97 + index % 26)}`;
}

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

function variantSection(TL: Translator, variant: ExpeditionVariant) {
	const settings = getStore().getVariantSettings(variant.id);
	const status = settings.enabled ? `<strong style="color: #4a7">${TL`On`}</strong>` :
		`<strong style="color: #d33">${TL`Off`}</strong>`;
	const toggle = settings.enabled ?
		`<button class="button" name="send" value="/expedicaoadmin desligar ${variant.id}">${TL`Turn off`}</button>` :
		`<button class="button" name="send" value="/expedicaoadmin ligar ${variant.id}">${TL`Turn on`}</button>`;
	const testNote = variant.adminOnly ? ` <small>(${TL`test only: visible to administrators`})</small>` : '';
	let buf = `<h3>${variant.name(TL)} <small>(${variant.id})</small>${testNote}</h3>` +
		`<p>${variant.description(TL)}</p><p>${status} ${toggle}</p>`;
	if (!variant.tunables.length) return buf;
	const fields = variant.tunables.map((tunable: Tunable, i) => {
		const current = settings.overrides[tunable.key];
		const standard = tunableValue(variant, tunable.key);
		const min = tunable.min;
		const max = tunable.max;
		return `<tr><td>${tunableLabel(TL, tunable.key)}</td>` +
			`<td><input type="number" name="${fieldName(i)}" min="${min}" max="${max}" step="1" style="width: 80px" ` +
			`value="${current ?? ''}" placeholder="${standard ?? ''}" /></td>` +
			`<td><small>${TL`default ${standard}, from ${min} to ${max}`}</small></td></tr>`;
	}).join('');
	const values = variant.tunables.map((tunable, i) => `{${fieldName(i)}}`).join(',');
	buf += `<form data-submitsend="/expedicaoadmin ajustar ${variant.id},${values}">` +
		`<table>${fields}</table><p><small>${TL`Empty fields use the default. Changes apply to new runs only.`}</small></p>` +
		`<p><button class="button" type="submit">${TL`Save`}</button></p></form>`;
	return buf;
}

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

export function renderAdminPage(TL: Translator, user: User) {
	let buf = `<div class="pad"><h2>${TL`Expedition`}: ${TL`admin panel`}</h2>` +
		`<p><button class="button" name="gymGo" value="view-ginasiosadmin">${TL`Admin panel`}</button></p>`;
	if (!isAdmin(user)) return buf + `<p>${TL`Access denied.`}</p></div>`;
	buf += `<h2>${TL`Variants`}</h2>` + listVariants().map(variant => variantSection(TL, variant)).join('');
	const store = getStore();
	buf += `<h2>${TL`Expeditions in progress`}</h2>` + runsTable(TL, store.listAllRuns(true), true);
	buf += `<h2>${TL`History`}</h2>` + runsTable(TL, store.listAllRuns(false, 30), false);
	return buf + `</div>`;
}

function requireAdmin(context: Chat.CommandContext, user: User) {
	if (!isAdmin(user)) throw new Chat.ErrorMessage(context.TL`Access denied.`);
}

function requireVariant(context: Chat.CommandContext, id: string) {
	const variant = getVariant(toID(id));
	if (!variant) throw new Chat.ErrorMessage(context.TL`Expedition not found.`);
	return variant;
}

export const commands: Chat.ChatCommands = {
	expedicaoadmin: {
		''() {
			return this.parse(`/join ${ADMIN_PAGE}`);
		},

		ligar(target, room, user) {
			requireAdmin(this, user);
			const variant = requireVariant(this, target);
			const store = getStore();
			store.setVariantSettings(variant.id, true, store.getVariantSettings(variant.id).overrides);
			this.globalModlog('EXPEDITION', null, `variant ${variant.id} on`);
			return this.parse(`/join ${ADMIN_PAGE}`);
		},

		desligar(target, room, user) {
			requireAdmin(this, user);
			const variant = requireVariant(this, target);
			const store = getStore();
			store.setVariantSettings(variant.id, false, store.getVariantSettings(variant.id).overrides);
			this.globalModlog('EXPEDITION', null, `variant ${variant.id} off`);
			return this.parse(`/join ${ADMIN_PAGE}`);
		},

		ajustar(target, room, user) {
			requireAdmin(this, user);
			const [id, ...values] = target.split(',');
			const variant = requireVariant(this, id);
			const overrides: Record<string, number> = {};
			const problems: string[] = [];
			variant.tunables.forEach((tunable, i) => {
				const raw = (values[i] || '').trim();
				if (!raw) return;
				const value = Number(raw);
				if (!Number.isInteger(value) || value < tunable.min || value > tunable.max) {
					problems.push(tunable.key);
					return;
				}
				overrides[tunable.key] = value;
			});
			if (problems.length) {
				const keys = problems.join(', ');
				throw new Chat.ErrorMessage(this.TL`Values out of range: ${keys}.`);
			}
			const store = getStore();
			store.setVariantSettings(variant.id, store.getVariantSettings(variant.id).enabled, overrides);
			this.globalModlog('EXPEDITION', null, `variant ${variant.id} settings ${JSON.stringify(overrides)}`);
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
