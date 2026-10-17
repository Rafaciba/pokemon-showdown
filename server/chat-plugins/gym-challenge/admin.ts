/**
 * pokemon-showdown-custom: painel do admin do Desafio de Ginásios.
 *
 * Páginas dentro do cliente (só rank ~; para os demais a página "não existe"):
 *   view-ginasiosadmin                    início do painel
 *   view-ginasiosadmin-treinadores        banco de treinadores NPC
 *   view-ginasiosadmin-treinador-<id>     criar ("novo") / editar treinador
 *
 * Visual: apenas elementos que o cliente oficial já estiliza (pad, ladder,
 * button, textbox, psicon), como nas páginas oficiais do PS.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import type { Translator } from '../../../sim/dex-text';
import { getStore, isAdmin } from './state';
import { checkName, NAME_MAX_LENGTH, type Problem } from './rules';
import { importTeam, checkTeamType, trainerTypes } from './teams';
import type { Trainer, TrainerInput } from './store';

const PAGE = 'view-ginasiosadmin';
const TITLE_MAX_LENGTH = 40;

/** Traduz uma mensagem marcada com TLkey e substitui {0}, {1}... */
export function renderProblem(TL: Translator, problem: Problem) {
	return TL(problem.message).replace(/\{(\d+)\}/g, (match, index) => {
		const value = problem.args[Number(index)];
		return value === undefined ? match : String(value);
	});
}

function teamIcons(team: string) {
	const sets = Teams.unpack(team) || [];
	return sets.map(set => `<psicon pokemon="${Utils.escapeHTML(set.species)}" />`).join('');
}

function typeIcon(type: string | null) {
	return type ? `<psicon type="${Utils.escapeHTML(type)}" />` : '';
}

function navButtons(TL: Translator) {
	return `<p>` +
		`<button class="button" name="send" value="/join ${PAGE}">${TL`Admin panel`}</button> ` +
		`<button class="button" name="send" value="/join ${PAGE}-treinadores">${TL`Trainers`}</button>` +
		`</p>`;
}

export const pages: Chat.PageTable = {
	ginasiosadmin: {
		default(query, user) {
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Gym Challenge: admin`;
			const trainerCount = getStore().listTrainers().length;
			return `<div class="pad">` +
				`<h2>${this.TL`Gym Challenge: admin panel`}</h2>` +
				navButtons(this.TL) +
				`<hr />` +
				`<p>${this.TL`Registered trainers: ${trainerCount}`}</p>` +
				`<p><button class="button" name="send" value="/join ${PAGE}-treinadores">` +
				`${this.TL`Manage trainers`}</button></p>` +
				`</div>`;
		},

		treinadores(query, user) {
			if (!isAdmin(user)) this.pageDoesNotExist();
			this.title = this.TL`Gym Challenge: trainers`;
			const store = getStore();
			const trainers = store.listTrainers();
			let buf = `<div class="pad">` +
				`<h2>${this.TL`Trainer bank`}</h2>` +
				navButtons(this.TL) +
				`<p><button class="button" name="send" value="/join ${PAGE}-treinador-novo">` +
				`<strong>${this.TL`New trainer`}</strong></button></p>`;
			if (!trainers.length) {
				buf += `<p><em>${this.TL`No trainers yet.`}</em></p>`;
				return buf + `</div>`;
			}
			buf += `<div class="ladder"><table>` +
				`<tr><th>${this.TL`Name`}</th><th>${this.TL`Trainer type`}</th><th>${this.TL`Team`}</th>` +
				`<th>${this.TL`Challenges`}</th><th></th></tr>`;
			for (const trainer of trainers) {
				const used = store.challengesUsingTrainer(trainer.id).length;
				buf += `<tr>` +
					`<td><strong>${Utils.escapeHTML(trainer.name)}</strong>` +
					(trainer.title ? `<br /><small>${Utils.escapeHTML(trainer.title)}</small>` : '') + `</td>` +
					`<td>${typeIcon(trainer.type) || `<em>${this.TL`none`}</em>`}</td>` +
					`<td>${teamIcons(trainer.team)}</td>` +
					`<td>${used}</td>` +
					`<td><button class="button" name="send" value="/join ${PAGE}-treinador-${trainer.id}">` +
					`${this.TL`Edit`}</button></td>` +
					`</tr>`;
			}
			return buf + `</table></div></div>`;
		},

		treinador(query, user) {
			if (!isAdmin(user)) this.pageDoesNotExist();
			const store = getStore();
			const isNew = query[0] === 'novo';
			const trainer = isNew ? null : store.getTrainer(Number(query[0]));
			if (!isNew && !trainer) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);
			this.title = trainer ? `[${this.TL`Trainer`}] ${trainer.name}` : this.TL`New trainer`;

			const id = trainer ? trainer.id : 'novo';
			const value = (text: string | undefined) => Utils.escapeHTML(text || '');
			// O cliente clássico não preserva "selected": a opção atual precisa vir primeiro
			const types = trainerTypes();
			const current = trainer?.type || '';
			const typeOptions = [current, ...['', ...types].filter(type => type !== current)].map(type => (
				`<option value="${type}">${type || this.TL`(no type: Champion only)`}</option>`
			)).join('');
			// Quebras de linha como &#13; para sobreviver ao envio do formulário (como no plugin oficial de times)
			const teamText = trainer ? Teams.export(Teams.unpack(trainer.team) || []).replace(/\n/g, '&#13;') : '';

			let buf = `<div class="pad">` +
				`<h2>${trainer ? Utils.escapeHTML(trainer.name) : this.TL`New trainer`}</h2>` +
				navButtons(this.TL) +
				`<form data-submitsend="/ginasioadmin salvartreinador ${id},{name},{title},{type},{team}">` +
				`<p><label class="label">${this.TL`Name`}:<br />` +
				`<input name="name" class="textbox" maxlength="${NAME_MAX_LENGTH}" value="${value(trainer?.name)}" />` +
				`</label></p>` +
				`<p><label class="label">${this.TL`Title (e.g. Gym Leader, Elite Four, Champion)`}:<br />` +
				`<input name="title" class="textbox" maxlength="${TITLE_MAX_LENGTH}" value="${value(trainer?.title)}" />` +
				`</label></p>` +
				`<p><label class="label">${this.TL`Trainer type`}:<br /><select name="type">${typeOptions}</select></label>` +
				`<br /><small>${this.TL`Gym leaders and Elite Four members need a type; every Pokémon in the team must have it.`}` +
				`</small></p>` +
				`<p><label class="label">${this.TL`Team (paste the teambuilder export)`}:<br />` +
				`<textarea name="team" class="textbox" style="width: 100%; height: 320px">${teamText}</textarea>` +
				`</label></p>` +
				`<p><button class="button" type="submit"><strong>${this.TL`Save trainer`}</strong></button></p>` +
				`</form>`;

			if (trainer) {
				const challengeIds = store.challengesUsingTrainer(trainer.id);
				buf += `<hr /><p>${teamIcons(trainer.team)} ${typeIcon(trainer.type)}</p>`;
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
			const [rawId, rawName, rawTitle, rawType, rawTeam] = Utils.splitFirst(target, ',', 4);
			const isNew = rawId.trim() === 'novo';
			const id = Number(rawId);
			const store = getStore();
			if (!isNew && !store.getTrainer(id)) throw new Chat.ErrorMessage(this.TL`Trainer not found.`);

			const problems: string[] = [];
			const name = (rawName || '').trim();
			const title = (rawTitle || '').trim();
			const type = (rawType || '').trim() || null;
			problems.push(...checkName(name).map(p => renderProblem(this.TL, p)));
			if (title.length > TITLE_MAX_LENGTH || /[|,]/.test(title)) {
				problems.push(this.TL`The title can be at most ${TITLE_MAX_LENGTH} characters long and cannot contain | or ,.`);
			}
			if (type && !trainerTypes().includes(type)) problems.push(this.TL`Invalid type.`);

			const imported = importTeam(rawTeam || '');
			if ('error' in imported) {
				problems.push(renderProblem(this.TL, imported.error));
			} else if (type) {
				problems.push(...checkTeamType(imported.team, type));
			}
			if (problems.length || 'error' in imported) {
				const list = problems.map(p => `- ${p}`).join('\n');
				connection.popup(`${this.TL`The trainer was not saved:`}\n\n${list}`);
				return;
			}

			const input: TrainerInput = { name, title, type, team: imported.team, avatar: '', badgeImage: null };
			let trainer: Trainer | null;
			if (isNew) {
				trainer = store.createTrainer(input);
			} else {
				const previous = store.getTrainer(id)!;
				trainer = store.updateTrainer(id, { ...input, avatar: previous.avatar, badgeImage: previous.badgeImage });
			}
			this.globalModlog('GYMTRAINER', null, `${isNew ? 'created' : 'updated'} #${trainer!.id}`);
			this.sendReply(this.TL`Trainer saved.`);
			return this.parse(`/join ${PAGE}-treinador-${trainer!.id}`);
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
	},
	ginasioadminhelp: [
		`/ginasioadmin - Abre o painel do Desafio de Ginásios. Requer: ~`,
	],
};

export function start() {
	// O time chega numa textarea (várias linhas) no último parâmetro
	Chat.multiLinePattern.register('/(ginasioadmin|gymadmin) salvartreinador ');
}
