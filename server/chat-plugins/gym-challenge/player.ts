/**
 * pokemon-showdown-custom: comandos e páginas do jogador no Desafio de Ginásios.
 *
 * Páginas (visitantes veem só para leitura):
 *   view-ginasios                   desafios abertos e encerrados, com a jornada de cada um
 *   view-ginasios-desafio-<id>      regras, jornada atual (insígnias, próxima batalha) e jornadas anteriores
 *   view-ginasios-perfil-<usuário>  conquistas, jornadas em andamento e placar por desafio (só logados)
 *   view-ginasios-historico-<desafio>-<usuário>  jornadas do jogador no desafio, com placar (só logados)
 *
 * Comandos:
 *   /ginasio                               abre a lista
 *   /ginasio perfil [usuário]              perfil do jogador (sem nome: o próprio)
 *   /ginasio iniciar <desafio>             começa uma jornada
 *   /ginasio escolher <desafio>,<ginásio>  ordem livre: o ginásio do próximo "Battle!"
 *   /ginasio desistir <desafio>            encerra a jornada (dá forfeit na batalha em andamento)
 *   /ginasio continuar <desafio>           retoma a batalha suspensa (save state) ou vai até ela
 *
 * Só contas registradas jogam (o login do projeto não tem visitantes com nome).
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import type { TextLanguage } from '../../../sim/dex-data';
import { getStore } from './state';
import { abandonRun, chooseGym, resumeBattle, runState, savedBattleIn, startRun, type RunState } from './runs';
import { formatLabel, renderProblem } from './admin';
import { challengeFormatName } from './formats';
import { badgeIcon } from './badges';
import { trainerSpriteImg } from './trainer-sprites';
import type { Challenge, Run, RunBattle, RunStage, RunStatus } from './store';

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

/** Imagem da insígnia gravada na jornada; sem insígnia, o ícone do tipo. */
function stageBadge(stage: RunStage, size = 24) {
	return badgeIcon({ name: stage.badgeName, image: stage.badgeImage }, stage.type, size);
}

/** Nome da insígnia; sem insígnia escolhida, "insígnia {tipo}". */
function badgeName(TL: Translator, stage: RunStage) {
	if (stage.badgeName) return Utils.escapeHTML(stage.badgeName);
	const type = stage.type || '';
	return TL`${type} badge`;
}

function trainerName(stage: RunStage) {
	return Utils.escapeHTML([stage.trainerTitle, stage.trainerName].filter(Boolean).join(' '));
}

/** Sprite (cópia gravada na jornada) e nome do treinador, com o aviso de batalha em dupla. */
function trainerCell(TL: Translator, stage: RunStage) {
	const sprite = trainerSpriteImg(stage.trainerAvatar, 40);
	const doubles = stage.doubles ? ` <small>(${TL`doubles battle`})</small>` : '';
	return (sprite ? `${sprite} ${trainerName(stage)}` : trainerName(stage)) + doubles;
}

function navButtons(TL: Translator) {
	return `<p><button class="button" name="gymGo" value="${PAGE}">${TL`All challenges`}</button></p>`;
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
		buf += `<tr><td>${stage.position}</td><td>${trainerCell(TL, stage)}</td><td>${typeIcon(stage.type)}</td>` +
			`<td>${badge ? stageBadge(stage) : ''}</td><td>${action}</td></tr>`;
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
		buf += `<tr><td>${label}</td><td>${trainerCell(TL, stage)}</td><td>${typeIcon(stage.type)}</td><td>${status}</td></tr>`;
	});
	return buf + `</table></div>`;
}

interface EarnedBadge {
	stage: RunStage;
	/** Data da vitória no ginásio. */
	earnedAt: number;
	/** Espécies do time que venceu (null = não registrado). */
	species: string[] | null;
}

interface RunSummary {
	run: Run;
	/** Insígnias da jornada (ginásios vencidos), na ordem dos ginásios. */
	badges: EarnedBadge[];
	gymCount: number;
	/** Vitória sobre o Campeão (só nas jornadas vencidas), com o time que venceu. */
	champion: { stage: RunStage, species: string[] | null } | null;
	/** Placar da jornada: vitórias e derrotas nas batalhas (empates e interrompidas não contam). */
	wins: number;
	losses: number;
}

function summarizeRun(run: Run): RunSummary {
	const store = getStore();
	const stages = store.getRunStages(run.id);
	const battles = store.getRunBattles(run.id);
	// Vitória em cada ginásio (a primeira, se houver mais de uma)
	const wonAt = new Map<number, RunBattle>();
	for (const battle of battles) {
		if (battle.kind !== 'gym' || battle.result !== 'win' || wonAt.has(battle.position)) continue;
		wonAt.set(battle.position, battle);
	}
	const gyms = stages.filter(stage => stage.kind === 'gym');
	const championStage = stages.find(stage => stage.kind === 'champion');
	const championWin = battles.find(battle => battle.kind === 'champion' && battle.result === 'win');
	return {
		run,
		badges: gyms.filter(stage => wonAt.has(stage.position)).map(stage => {
			const battle = wonAt.get(stage.position)!;
			return { stage, earnedAt: battle.endedAt || battle.startedAt, species: battle.playerSpecies };
		}),
		gymCount: gyms.length,
		champion: championStage && championWin ? { stage: championStage, species: championWin.playerSpecies } : null,
		wins: battles.filter(b => b.result === 'win').length,
		losses: battles.filter(b => b.result === 'loss').length,
	};
}

/** Ícones do time que venceu a batalha; sem registro (vitórias antigas), um aviso. */
function speciesIcons(TL: Translator, species: string[] | null) {
	if (!species?.length) return `<em>${TL`Not recorded`}</em>`;
	return species.map(name => `<psicon pokemon="${Utils.escapeHTML(name)}" />`).join('');
}

/** Detalhe de uma conquista: o time que venceu cada insígnia e o Campeão. */
function winningTeams(TL: Translator, summary: RunSummary) {
	let buf = `<details><summary>${TL`Winning teams`}</summary><div class="ladder"><table>` +
		`<tr><th></th><th>${TL`Trainer`}</th><th>${TL`Team`}</th></tr>`;
	for (const badge of summary.badges) {
		buf += `<tr><td>${stageBadge(badge.stage)} ${badgeName(TL, badge.stage)}</td>` +
			`<td>${trainerName(badge.stage)}</td><td>${speciesIcons(TL, badge.species)}</td></tr>`;
	}
	if (summary.champion) {
		buf += `<tr><td>${TL`Champion`}</td><td>${trainerName(summary.champion.stage)}</td>` +
			`<td>${speciesIcons(TL, summary.champion.species)}</td></tr>`;
	}
	return buf + `</table></div></details>`;
}

function badgeIcons(summary: RunSummary) {
	return summary.badges.map(badge => stageBadge(badge.stage)).join(' ');
}

/** Jornadas com o placar de cada uma e o total (histórico de um jogador num desafio). */
function runsTable(TL: Translator, runs: Run[]) {
	const summaries = runs.map(summarizeRun);
	let buf = `<div class="ladder"><table><tr><th>${TL`Started`}</th><th>${TL`Ended`}</th><th>${TL`Result`}</th>` +
		`<th>${TL`Badges`}</th><th>${TL`Battles won`}</th><th>${TL`Battles lost`}</th></tr>`;
	for (const summary of summaries) {
		const { run } = summary;
		buf += `<tr><td>${formatDate(run.startedAt)}</td><td>${formatDate(run.endedAt)}</td>` +
			`<td>${runStatusLabel(TL, run.status)}</td>` +
			`<td>${summary.badges.length}/${summary.gymCount} ${badgeIcons(summary)}</td>` +
			`<td>${summary.wins}</td><td>${summary.losses}</td></tr>`;
	}
	const wins = summaries.reduce((sum, summary) => sum + summary.wins, 0);
	const losses = summaries.reduce((sum, summary) => sum + summary.losses, 0);
	const won = summaries.filter(summary => summary.run.status === 'won').length;
	const journeys = summaries.length;
	buf += `<tr><th colspan="3">${TL`Total: ${journeys} journeys, ${won} won`}</th><th></th>` +
		`<th>${wins}</th><th>${losses}</th></tr>`;
	return buf + `</table></div>`;
}

function previousRuns(TL: Translator, runs: Run[]) {
	if (!runs.length) return '';
	return `<h3>${TL`Previous journeys`}</h3>` + runsTable(TL, runs);
}

/** Nome para exibir: o atual, se o jogador estiver conectado; senão, o userid (não guardamos nomes). */
function displayName(userid: string) {
	return Users.getExact(userid)?.name || userid;
}

export function profileButton(TL: Translator, userid: string, label?: string) {
	return `<button class="button" name="gymGo" value="${PAGE}-perfil-${userid}">` +
		`${label || Utils.escapeHTML(displayName(userid))}</button>`;
}

/**
 * Seções do perfil do jogador vindas de outros modos (decisão do usuário, 2026-10-21:
 * o histórico da Expedição fica no mesmo perfil). Cada uma devolve o HTML da seção.
 */
export const profileSections: ((TL: Translator, userid: ID, lang: TextLanguage) => string)[] = [];

export const pages: Chat.PageTable = {
	ginasios: {
		default(query, user) {
			this.title = this.TL`Gym Challenge`;
			const store = getStore();
			const open = store.listChallenges('open');
			const closed = store.listChallenges('closed');
			let buf = `<div class="pad"><h2>${this.TL`Gym Challenge`}</h2>` +
				`<p>${this.TL`Battle gym leaders controlled by the computer, collect badges and face the Champion. Choose a challenge to see its rules and start a journey.`}</p>` +
				(isPlayer(user) ? `<p>${profileButton(this.TL, user.id, this.TL`My profile`)}</p>` : '') +
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
						`<td><button class="button" name="gymGo" value="${PAGE}-desafio-${challenge.id}">` +
						`${this.TL`View`}</button></td></tr>`;
				}
				buf += `</table></div>`;
			}
			if (closed.length) {
				buf += `<h3>${this.TL`Closed challenges`}</h3><div class="ladder"><table>`;
				for (const challenge of closed) {
					buf += `<tr><td>${Utils.escapeHTML(challenge.name)}</td>` +
						`<td><button class="button" name="gymGo" value="${PAGE}-desafio-${challenge.id}">` +
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
				const { progress, suspended } = state;
				const badges = progress.badges.length;
				const gymCount = progress.gymCount;
				const losses = progress.losses;
				const lossLimit = challenge.lossLimit;
				buf += `<p>${this.TL`Badges: ${badges}/${gymCount}`} &middot; ` +
					(lossLimit === null ? this.TL`Losses: ${losses}` : this.TL`Losses: ${losses} of ${lossLimit}`) + `</p>`;
				if (suspended) {
					buf += `<p>${this.TL`Your battle was interrupted (for example, by a server restart) and was saved. It continues from where it stopped.`}</p>` +
						`<p><button class="button" name="send" value="/ginasio continuar ${challenge.id}">` +
						`<strong>${this.TL`Continue your battle`}</strong></button></p>`;
				} else if (progress.ongoing) {
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

		perfil(query, user) {
			// Perfis e históricos só para usuários logados (decisão do usuário); a página
			// carrega sozinha quando o login termina
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isPlayer(user)) return `<div class="pad"><p>${this.TL`Log in to see player profiles.`}</p></div>`;
			const userid = toID(query[0]) || user.id;
			const store = getStore();
			const name = displayName(userid);
			this.title = `[${this.TL`Player profile`}] ${name}`;
			const summaries = store.listUserRuns(userid).map(summarizeRun);
			// Seções dos outros modos (ex.: Expedição), depois da do Desafio
			const others = profileSections.map(section => section(this.TL, userid, Chat.getDexLanguage(this.language)))
				.join('');
			let buf = `<div class="pad"><h2>${this.TL`Player profile`}: ${Utils.escapeHTML(name)}</h2>` +
				navButtons(this.TL) + `<h2>${this.TL`Gym Challenge`}</h2>`;
			if (!summaries.length) return buf + `<p><em>${this.TL`No journeys yet.`}</em></p>${others}</div>`;
			const challengeName = (id: number) => Utils.escapeHTML(store.getChallenge(id)?.name || `#${id}`);

			// Conquistas: cada desafio vencido (vencer de novo acumula)
			const wins = summaries.filter(summary => summary.run.status === 'won');
			buf += `<h3>${this.TL`Achievements`}</h3>`;
			if (!wins.length) {
				buf += `<p><em>${this.TL`No challenges won yet.`}</em></p>`;
			} else {
				buf += `<div class="ladder"><table><tr><th>${this.TL`Challenge`}</th><th>${this.TL`Won on`}</th>` +
					`<th>${this.TL`Badges`}</th></tr>`;
				for (const summary of wins) {
					buf += `<tr><td><strong>${challengeName(summary.run.challengeId)}</strong></td>` +
						`<td>${formatDate(summary.run.endedAt)}</td><td>${badgeIcons(summary)}</td></tr>` +
						`<tr><td colspan="3">${winningTeams(this.TL, summary)}</td></tr>`;
				}
				buf += `</table></div>`;
			}

			// Insígnias permanentes: as das jornadas vencidas (as insígnias são da jornada e
			// passam ao perfil quando o desafio é vencido), da mais recente para a mais antiga
			const permanent = wins.flatMap(summary => summary.badges.map(badge => ({ ...badge, run: summary.run })))
				.sort((a, b) => b.earnedAt - a.earnedAt);
			if (permanent.length) {
				buf += `<h3>${this.TL`Permanent badges`}</h3>` +
					`<p><small>${this.TL`Badges from won challenges.`}</small></p>` +
					`<div class="ladder"><table><tr><th></th><th>${this.TL`Badge`}</th><th>${this.TL`Gym leader`}</th>` +
					`<th>${this.TL`Challenge`}</th><th>${this.TL`Earned on`}</th></tr>`;
				for (const badge of permanent) {
					buf += `<tr><td>${stageBadge(badge.stage, 32)}</td><td>${badgeName(this.TL, badge.stage)}</td>` +
						`<td>${trainerName(badge.stage)}</td><td>${challengeName(badge.run.challengeId)}</td>` +
						`<td>${formatDate(badge.earnedAt)}</td></tr>`;
				}
				buf += `</table></div>`;
			}

			const active = summaries.filter(summary => summary.run.status === 'active');
			if (active.length) {
				buf += `<h3>${this.TL`Journeys in progress`}</h3><div class="ladder"><table>` +
					`<tr><th>${this.TL`Challenge`}</th><th>${this.TL`Badges`}</th><th>${this.TL`Started`}</th></tr>`;
				for (const summary of active) {
					buf += `<tr><td>${challengeName(summary.run.challengeId)}</td>` +
						`<td>${summary.badges.length}/${summary.gymCount} ${badgeIcons(summary)}</td>` +
						`<td>${formatDate(summary.run.startedAt)}</td></tr>`;
				}
				buf += `</table></div>`;
			}

			// Placar por desafio, com o histórico completo de cada um
			const byChallenge = new Map<number, RunSummary[]>();
			for (const summary of summaries) {
				const list = byChallenge.get(summary.run.challengeId) || [];
				list.push(summary);
				byChallenge.set(summary.run.challengeId, list);
			}
			buf += `<h3>${this.TL`Score by challenge`}</h3><div class="ladder"><table>` +
				`<tr><th>${this.TL`Challenge`}</th><th>${this.TL`Journeys`}</th><th>${this.TL`Won`}</th>` +
				`<th>${this.TL`Battles won`}</th><th>${this.TL`Battles lost`}</th><th></th></tr>`;
			for (const [challengeId, list] of byChallenge) {
				buf += `<tr><td>${challengeName(challengeId)}</td><td>${list.length}</td>` +
					`<td>${list.filter(summary => summary.run.status === 'won').length}</td>` +
					`<td>${list.reduce((sum, summary) => sum + summary.wins, 0)}</td>` +
					`<td>${list.reduce((sum, summary) => sum + summary.losses, 0)}</td>` +
					`<td><button class="button" name="gymGo" value="${PAGE}-historico-${challengeId}-${userid}">` +
					`${this.TL`History`}</button></td></tr>`;
			}
			return buf + `</table></div>${others}</div>`;
		},

		historico(query, user) {
			if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
			if (!isPlayer(user)) return `<div class="pad"><p>${this.TL`Log in to see player profiles.`}</p></div>`;
			const store = getStore();
			const challenge = store.getChallenge(Number(query[0]));
			if (!challenge || challenge.status === 'draft') this.pageDoesNotExist();
			const userid = toID(query[1]) || user.id;
			const name = displayName(userid);
			this.title = `[${this.TL`History`}] ${name} - ${challenge.name}`;
			const runs = store.listRuns(challenge.id, userid);
			const buf = `<div class="pad"><h2>${this.TL`History`}: ${Utils.escapeHTML(name)}</h2>` +
				`<p><strong>${Utils.escapeHTML(challenge.name)}</strong></p>` +
				`<p>${profileButton(this.TL, userid, this.TL`Player profile`)} ` +
				`<button class="button" name="gymGo" value="${PAGE}-desafio-${challenge.id}">` +
				`${this.TL`Challenge page`}</button></p>`;
			if (!runs.length) return buf + `<p><em>${this.TL`No journeys yet.`}</em></p></div>`;
			return buf + runsTable(this.TL, runs) + `</div>`;
		},
	},
};

export const commands: Chat.ChatCommands = {
	gym: 'ginasio',
	ginasio: {
		''(target, room, user) {
			return this.parse(`/join ${PAGE}`);
		},

		perfil(target, room, user) {
			const userid = toID(target) || user.id;
			return this.parse(`/join ${PAGE}-perfil-${userid}`);
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

		continuar(target, room, user) {
			requirePlayer(this, user);
			const battle = savedBattleIn(user.id, Number(target));
			if (!battle) throw new Chat.ErrorMessage(this.TL`You have no interrupted battle in this challenge.`);
			const problem = resumeBattle(user, battle);
			if (problem) throw new Chat.ErrorMessage(renderProblem(this.TL, problem));
		},
	},
	ginasiohelp: [
		`/ginasio - Abre a lista de desafios do Desafio de Ginásios.`,
		`/ginasio perfil [usuário] - Mostra o perfil do jogador no Desafio de Ginásios (sem nome: o seu).`,
		`/ginasio iniciar [desafio] - Começa uma jornada no desafio.`,
		`/ginasio escolher [desafio], [ginásio] - Na ordem livre, escolhe o ginásio do próximo "Battle!".`,
		`/ginasio desistir [desafio] - Encerra a jornada (uma batalha em andamento conta como derrota).`,
		`/ginasio continuar [desafio] - Retoma a batalha interrompida (por exemplo, por um reinício do servidor) do ponto em que parou.`,
	],
};
