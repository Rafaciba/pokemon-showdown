/**
 * pokemon-showdown-custom: comandos e páginas do jogador no Desafio de Ginásios.
 *
 * Páginas (visitantes veem só para leitura):
 *   view-ginasios                   desafios abertos e encerrados, com a jornada de cada um
 *   view-ginasios-desafio-<id>      regras, jornada atual (insígnias, próxima batalha) e jornadas anteriores
 *
 * Comandos:
 *   /ginasio                               abre a lista
 *   /ginasio iniciar <desafio>             começa uma jornada
 *   /ginasio escolher <desafio>,<ginásio>  ordem livre: o ginásio do próximo "Battle!"
 *   /ginasio desistir <desafio>            encerra a jornada (dá forfeit na batalha em andamento)
 *
 * Só contas registradas jogam (o login do projeto não tem visitantes com nome).
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import { getStore } from './state';
import { abandonRun, chooseGym, runState, startRun, type RunState } from './runs';
import { formatLabel, renderProblem } from './admin';
import { challengeFormatName } from './formats';
import type { Challenge, Run, RunStage, RunStatus } from './store';

const PAGE = 'view-ginasios';

function isPlayer(user: User) {
	return user.named && user.registered;
}

function requirePlayer(context: Chat.CommandContext, user: User) {
	if (!isPlayer(user)) throw new Chat.ErrorMessage(context.TL`Log in to take part in the Gym Challenge.`);
}

export function runStatusLabel(TL: Translator, status: RunStatus) {
	switch (status) {
	case 'active': return TL`In progress`;
	case 'won': return TL`Won`;
	case 'abandoned': return TL`Gave up`;
	case 'eliminated': return TL`Eliminated`;
	default: return TL`Closed by an administrator`;
	}
}

export function formatDate(timestamp: number | null) {
	return timestamp ? Chat.toTimestamp(new Date(timestamp * 1000)).split(' ')[0] : '';
}

function typeIcon(type: string | null) {
	return type ? `<psicon type="${Utils.escapeHTML(type)}" />` : '';
}

function trainerName(stage: RunStage) {
	return Utils.escapeHTML([stage.trainerTitle, stage.trainerName].filter(Boolean).join(' '));
}

function navButtons(TL: Translator) {
	return `<p><button class="button" name="send" value="/join ${PAGE}">${TL`All challenges`}</button></p>`;
}

/** Regras do desafio, resumidas para o jogador. */
function rulesTable(TL: Translator, challenge: Challenge) {
	const yesNo = (value: boolean) => (value ? TL`Yes` : TL`No`);
	const gymCount = challenge.gymCount;
	const types = challenge.typeMode === 'random' ?
		TL`${gymCount} gyms, types drawn for each journey` : TL`${gymCount} gyms`;
	const order = challenge.orderMode === 'free' ? TL`Free` : TL`Fixed (in the order of the gyms)`;
	const seconds = challenge.turnSeconds;
	const timer = challenge.timerMode === 'turn' ? TL`${seconds} seconds per turn` : TL`Free time (no limit)`;
	const lossLimit = challenge.lossLimit;
	const losses = lossLimit === null ? TL`unlimited` : String(lossLimit);
	const rules = challenge.customRules ? `<br /><small>${Utils.escapeHTML(challenge.customRules)}</small>` : '';
	const rows: [string, string][] = [
		[TL`Format`, Utils.escapeHTML(formatLabel(challenge.baseFormat)) + rules],
		[TL`Gyms`, types],
		[TL`Gym order`, order],
		[TL`Elite Four`, yesNo(challenge.hasElite4)],
		[TL`Team lock`, yesNo(challenge.teamLock)],
		[TL`Loss limit`, losses],
		[TL`Eliminated on an Elite Four loss`, yesNo(challenge.eliminateOnElite4Loss)],
		[TL`Eliminated on a Champion loss`, yesNo(challenge.eliminateOnChampionLoss)],
		[TL`Timer`, timer],
	];
	return `<div class="ladder"><table>` +
		rows.map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`).join('') +
		`</table></div>`;
}

/** Ginásios e liga da jornada, com o que já foi vencido e a próxima batalha. */
function journeyTables(TL: Translator, state: RunState) {
	const { challenge, progress } = state;
	const next = progress.next;
	const isNext = (stage: RunStage) => !progress.ongoing && next?.kind === stage.kind && next.position === stage.position;
	const choosable = new Set(progress.choices.map(stage => stage.position));
	const gyms = state.stages.filter(stage => stage.kind === 'gym');

	let buf = `<div class="ladder"><table><tr><th></th><th>${TL`Gym leader`}</th><th>${TL`Trainer type`}</th>` +
		`<th>${TL`Badge`}</th><th></th></tr>`;
	for (const stage of gyms) {
		const badge = progress.badges.includes(stage.position);
		let action = '';
		if (badge) {
			action = TL`Badge earned`;
		} else if (isNext(stage)) {
			action = `<strong>${TL`Next battle`}</strong>`;
		} else if (choosable.has(stage.position)) {
			action = `<button class="button" name="send" value="/ginasio escolher ${challenge.id},${stage.position}">` +
				`${TL`Battle this gym next`}</button>`;
		}
		buf += `<tr><td>${stage.position}</td><td>${trainerName(stage)}</td><td>${typeIcon(stage.type)}</td>` +
			`<td>${badge ? typeIcon(stage.type) : ''}</td><td>${action}</td></tr>`;
	}
	buf += `</table></div>`;

	const allBadges = progress.badges.length === progress.gymCount;
	buf += `<h3>${challenge.hasElite4 ? TL`Elite Four and Champion` : TL`Champion`}</h3>`;
	if (!allBadges) {
		buf += `<p><small>${challenge.hasElite4 ?
			TL`The Elite Four unlocks with all badges. It is fought in a row with the Champion; a loss at any point goes back to the first member.` :
			TL`The Champion unlocks with all badges.`}</small></p>`;
	}
	buf += `<div class="ladder"><table><tr><th></th><th>${TL`Trainer`}</th><th>${TL`Trainer type`}</th><th></th></tr>`;
	progress.league.forEach((stage, index) => {
		let status = '';
		if (allBadges && index < progress.leagueWins) status = TL`Defeated in this attempt`;
		else if (allBadges && isNext(stage)) status = `<strong>${TL`Next battle`}</strong>`;
		const label = stage.kind === 'elite4' ? `${TL`Elite Four`} ${stage.position}` : TL`Champion`;
		buf += `<tr><td>${label}</td><td>${trainerName(stage)}</td><td>${typeIcon(stage.type)}</td><td>${status}</td></tr>`;
	});
	return buf + `</table></div>`;
}

function previousRuns(TL: Translator, runs: Run[]) {
	if (!runs.length) return '';
	const store = getStore();
	let buf = `<h3>${TL`Previous journeys`}</h3><div class="ladder"><table>` +
		`<tr><th>${TL`Started`}</th><th>${TL`Ended`}</th><th>${TL`Result`}</th><th>${TL`Badges`}</th></tr>`;
	for (const run of runs) {
		const badges = store.getRunBattles(run.id).filter(b => b.kind === 'gym' && b.result === 'win').length;
		const gyms = store.getRunStages(run.id).filter(s => s.kind === 'gym').length;
		buf += `<tr><td>${formatDate(run.startedAt)}</td><td>${formatDate(run.endedAt)}</td>` +
			`<td>${runStatusLabel(TL, run.status)}</td><td>${badges}/${gyms}</td></tr>`;
	}
	return buf + `</table></div>`;
}

export const pages: Chat.PageTable = {
	ginasios: {
		default(query, user) {
			this.title = this.TL`Gym Challenge`;
			const store = getStore();
			const open = store.listChallenges('open');
			const closed = store.listChallenges('closed');
			let buf = `<div class="pad"><h2>${this.TL`Gym Challenge`}</h2>` +
				`<p>${this.TL`Battle gym leaders controlled by the computer, collect badges and face the Champion. Choose a challenge to see its rules and start a journey.`}</p>` +
				`<h3>${this.TL`Open challenges`}</h3>`;
			if (!open.length) {
				buf += `<p><em>${this.TL`No open challenges right now.`}</em></p>`;
			} else {
				buf += `<div class="ladder"><table><tr><th>${this.TL`Challenge`}</th><th>${this.TL`Gyms`}</th>` +
					`<th>${this.TL`Your journey`}</th><th></th></tr>`;
				for (const challenge of open) {
					const run = isPlayer(user) ? store.getActiveRun(challenge.id, user.id) : null;
					let journey = '-';
					if (run) {
						const { progress } = runState(run);
						const badges = progress.badges.length;
						const gymCount = progress.gymCount;
						journey = this.TL`${badges}/${gymCount} badges`;
					}
					buf += `<tr><td><strong>${Utils.escapeHTML(challenge.name)}</strong></td>` +
						`<td>${challenge.gymCount}${challenge.hasElite4 ? ` + ${this.TL`Elite Four`}` : ''}</td>` +
						`<td>${journey}</td>` +
						`<td><button class="button" name="send" value="/join ${PAGE}-desafio-${challenge.id}">` +
						`${this.TL`View`}</button></td></tr>`;
				}
				buf += `</table></div>`;
			}
			if (closed.length) {
				buf += `<h3>${this.TL`Closed challenges`}</h3><div class="ladder"><table>`;
				for (const challenge of closed) {
					buf += `<tr><td>${Utils.escapeHTML(challenge.name)}</td>` +
						`<td><button class="button" name="send" value="/join ${PAGE}-desafio-${challenge.id}">` +
						`${this.TL`View`}</button></td></tr>`;
				}
				buf += `</table></div>`;
			}
			return buf + `</div>`;
		},

		desafio(query, user) {
			const store = getStore();
			const challenge = store.getChallenge(Number(query[0]));
			// Rascunhos não existem para os jogadores
			if (!challenge || challenge.status === 'draft') this.pageDoesNotExist();
			this.title = `[${this.TL`Gym Challenge`}] ${challenge.name}`;
			const baseMod = Dex.formats.get(challenge.baseFormat).mod;
			const formatName = Utils.escapeHTML(formatLabel(challengeFormatName(challenge.name, baseMod)));

			let buf = `<div class="pad"><h2>${Utils.escapeHTML(challenge.name)}</h2>` + navButtons(this.TL);
			if (challenge.status === 'closed') buf += `<p><strong>${this.TL`This challenge is closed.`}</strong></p>`;
			buf += `<h3>${this.TL`Rules`}</h3>` + rulesTable(this.TL, challenge);

			const player = isPlayer(user);
			const run = player ? store.getActiveRun(challenge.id, user.id) : null;
			buf += `<h3>${this.TL`Your journey`}</h3>`;
			if (!player) {
				buf += `<p>${this.TL`Log in to take part in the Gym Challenge.`}</p>`;
			} else if (run) {
				const state = runState(run);
				const { progress } = state;
				const badges = progress.badges.length;
				const gymCount = progress.gymCount;
				const losses = progress.losses;
				const lossLimit = challenge.lossLimit;
				buf += `<p>${this.TL`Badges: ${badges}/${gymCount}`} &middot; ` +
					(lossLimit === null ? this.TL`Losses: ${losses}` : this.TL`Losses: ${losses} of ${lossLimit}`) + `</p>`;
				if (progress.ongoing) {
					buf += `<p><button class="button" name="send" value="/join ${progress.ongoing.roomid}">` +
						`<strong>${this.TL`Go to your battle in progress`}</strong></button></p>`;
				} else if (progress.next) {
					buf += `<p>${this.TL`To battle, choose the format ${formatName} and a team on the main screen and click Battle!`}</p>`;
				}
				if (challenge.teamLock) {
					buf += `<p><small>${run.teamHash ?
						this.TL`Team lock: use the same team as in your first battle (nicknames and order may change).` :
						this.TL`Team lock: the team of your first battle will be used for the whole journey.`}</small></p>`;
				}
				buf += journeyTables(this.TL, state) +
					`<details><summary>${this.TL`Give up the journey`}</summary>` +
					`<p>${this.TL`The journey ends now and stays in your history; a battle in progress counts as a loss. You can start a new journey afterwards.`}</p>` +
					`<p><button class="button" name="send" value="/ginasio desistir ${challenge.id}">` +
					`${this.TL`Confirm and give up`}</button></p></details>`;
			} else if (challenge.status === 'open') {
				buf += `<p>${this.TL`You have no journey in this challenge.`}</p>`;
				if (challenge.typeMode === 'random') {
					buf += `<p><small>${this.TL`The gym types are drawn when the journey starts.`}</small></p>`;
				}
				buf += `<p><button class="button" name="send" value="/ginasio iniciar ${challenge.id}">` +
					`<strong>${this.TL`Start journey`}</strong></button></p>`;
			}
			if (player) buf += previousRuns(this.TL, store.listRuns(challenge.id, user.id).filter(r => r.status !== 'active'));
			return buf + `</div>`;
		},
	},
};

export const commands: Chat.ChatCommands = {
	gym: 'ginasio',
	ginasio: {
		''(target, room, user) {
			return this.parse(`/join ${PAGE}`);
		},

		iniciar(target, room, user) {
			requirePlayer(this, user);
			const challengeId = Number(target);
			const result = startRun(user.id, challengeId);
			if ('message' in result) throw new Chat.ErrorMessage(renderProblem(this.TL, result));
			this.sendReply(this.TL`Journey started. Good luck!`);
			return this.parse(`/join ${PAGE}-desafio-${challengeId}`);
		},

		escolher(target, room, user) {
			requirePlayer(this, user);
			const [rawChallenge, rawPosition] = target.split(',');
			const challengeId = Number(rawChallenge);
			const run = getStore().getActiveRun(challengeId, user.id);
			if (!run) throw new Chat.ErrorMessage(this.TL`You have no journey in this challenge.`);
			const problem = chooseGym(run, Number(rawPosition));
			if (problem) throw new Chat.ErrorMessage(renderProblem(this.TL, problem));
			return this.parse(`/join ${PAGE}-desafio-${challengeId}`);
		},

		desistir(target, room, user) {
			requirePlayer(this, user);
			const challengeId = Number(target);
			const run = getStore().getActiveRun(challengeId, user.id);
			if (!run) throw new Chat.ErrorMessage(this.TL`You have no journey in this challenge.`);
			abandonRun(user, run);
			this.sendReply(this.TL`You gave up the journey. It stays in your history, and you can start a new one.`);
			return this.parse(`/join ${PAGE}-desafio-${challengeId}`);
		},
	},
	ginasiohelp: [
		`/ginasio - Abre a lista de desafios do Desafio de Ginásios.`,
		`/ginasio iniciar [desafio] - Começa uma jornada no desafio.`,
		`/ginasio escolher [desafio], [ginásio] - Na ordem livre, escolhe o ginásio do próximo "Battle!".`,
		`/ginasio desistir [desafio] - Encerra a jornada (uma batalha em andamento conta como derrota).`,
	],
};
