/**
 * pokemon-showdown-custom: a Expedição no perfil do jogador (etapa 4).
 *
 * Decisão do usuário: o histórico fica no perfil que já existe (o do Desafio de
 * Ginásios, aberto pelo botão do popup do usuário), numa seção própria. Visível para
 * os usuários logados, como no Desafio:
 *   - placar por variação (runs, vencidas, derrotas, desistências, encerradas);
 *   - runs em andamento;
 *   - as últimas runs encerradas, com até onde chegaram e o time no fim;
 *   - os desbloqueios do jogador.
 *
 * @license MIT
 */
import type { Translator } from '../../../sim/dex-text';
import { profileSections } from '../gym-challenge/player';
import { getStore } from './state';
import { getVariant } from './variant';
import { runProgress, runStatusLabel, teamIcons } from './admin';
import { badgeRow } from './pages';
import type { ExpeditionRun } from './store';

const RECENT_RUNS = 10;

function variantName(TL: Translator, id: string) {
	return getVariant(id)?.name(TL) || id;
}

/** Nome de um desbloqueio, para o perfil. */
function unlockLabel(TL: Translator, kind: string, ref: string) {
	if (kind === 'starter') {
		const species = Dex.species.get(ref).name || ref;
		return `<psicon pokemon="${species}" /> ${TL`Starter: ${species}`}`;
	}
	if (kind === 'item') {
		const item = Dex.items.get(ref).name || ref;
		return TL`Item: ${item}`;
	}
	if (kind === 'shiny') return TL`Shiny starters`;
	const variant = variantName(TL, ref);
	return TL`Expedition: ${variant}`;
}

export function expeditionProfile(TL: Translator, userid: ID) {
	const store = getStore();
	const runs = store.listRuns(userid, 500);
	let buf = `<h2>${TL`Expedition`}</h2>`;
	if (!runs.length) return buf + `<p><em>${TL`No expeditions yet.`}</em></p>`;

	const byVariant = new Map<string, ExpeditionRun[]>();
	for (const run of runs) byVariant.set(run.variant, [...byVariant.get(run.variant) || [], run]);
	const count = (list: ExpeditionRun[], status: string) => list.filter(run => run.status === status).length;
	buf += `<div class="ladder"><table><tr><th>${TL`Expedition`}</th><th>${TL`Runs`}</th><th>${TL`Completed`}</th>` +
		`<th>${TL`Defeated`}</th><th>${TL`Given up`}</th><th>${TL`Closed`}</th></tr>`;
	for (const [id, list] of byVariant) {
		buf += `<tr><td>${variantName(TL, id)}</td><td>${list.length}</td><td>${count(list, 'won')}</td>` +
			`<td>${count(list, 'lost')}</td><td>${count(list, 'abandoned')}</td><td>${count(list, 'closed')}</td></tr>`;
	}
	buf += `</table></div>`;

	// Conquistas (decisão do usuário): as expedições vencidas e quantas vezes
	const wins = [...byVariant].map(([id, list]) => [id, count(list, 'won')] as [string, number]).filter(([, n]) => n > 0);
	buf += `<h3>${TL`Achievements`}</h3>`;
	buf += wins.length ? `<p>${wins.map(([id, n]) => `&#127942; ${variantName(TL, id)} &times;${n}`).join(' &middot; ')}</p>` :
		`<p><em>${TL`No expeditions completed yet.`}</em></p>`;

	// Insígnias do modo Completo, por expedição
	const progress = store.listProgress(userid).filter(entry => entry.badges.length);
	if (progress.length) {
		buf += `<h3>${TL`Badges`}</h3>` + progress.map(entry => {
			const config = getVariant(entry.variant)?.completeConfig;
			const badges = config?.badges || entry.badges.map(id => ({ id, type: '' }));
			const total = entry.badges.length;
			return `<p>${variantName(TL, entry.variant)} (${total}/8)<br />${badgeRow(entry.badges, badges, 28)}</p>`;
		}).join('');
	}

	const active = runs.filter(run => run.status === 'active');
	if (active.length) {
		buf += `<h3>${TL`Expeditions in progress`}</h3><div class="ladder"><table>` +
			`<tr><th>${TL`Expedition`}</th><th>${TL`Progress`}</th><th>${TL`Team`}</th></tr>` +
			active.map(run => `<tr><td>${variantName(TL, run.variant)}</td><td>${runProgress(TL, run)}</td>` +
				`<td>${teamIcons(run)}</td></tr>`).join('') + `</table></div>`;
	}

	const ended = runs.filter(run => run.status !== 'active').slice(0, RECENT_RUNS);
	if (ended.length) {
		buf += `<h3>${TL`Latest expeditions`}</h3><div class="ladder"><table>` +
			`<tr><th>${TL`Expedition`}</th><th>${TL`Result`}</th><th>${TL`Progress`}</th><th>${TL`Team at the end`}</th>` +
			`<th>${TL`Date`}</th></tr>` + ended.map(run => (
			`<tr><td>${variantName(TL, run.variant)}</td><td>${runStatusLabel(TL, run)}</td>` +
			`<td>${run.status === 'won' ? '-' : runProgress(TL, run)}</td><td>${teamIcons(run)}</td>` +
			`<td>${run.endedAt ? new Date(run.endedAt * 1000).toISOString().slice(0, 10) : '-'}</td></tr>`
		)).join('') + `</table></div>`;
	}

	const unlocks = store.listUnlocks(userid);
	buf += `<h3>${TL`Unlocks`}</h3>`;
	buf += unlocks.length ? `<p>${unlocks.map(entry => {
		const label = unlockLabel(TL, entry.kind, entry.ref);
		return entry.variant ? `${label} (${variantName(TL, entry.variant)})` : label;
	}).join(' &middot; ')}</p>` :
		`<p><em>${TL`Nothing unlocked yet.`}</em></p>`;
	return buf;
}

profileSections.push(expeditionProfile);
