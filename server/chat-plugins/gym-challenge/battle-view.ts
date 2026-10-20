/**
 * pokemon-showdown-custom: o que a IA sabe da batalha a partir do log público.
 *
 * A IA vê a batalha como um espectador: o próprio time vem completo no pedido do
 * simulador (ChoiceRequest), mas do adversário ela só conhece o que já apareceu no
 * log (espécies, HP em %, status, golpes usados, hazards). Este módulo lê o log e
 * monta esse retrato. Sem dados ocultos: o NpcBattle já retira as linhas privadas.
 *
 * @license MIT
 */
import { toID } from '../../../sim/dex-data';

export interface SeenPokemon {
	/** Apelido, como aparece no log ("p1a: Apelido"). */
	name: string;
	species: string;
	level: number;
	/** HP em porcentagem (0 a 100). */
	hp: number;
	/** '', 'brn', 'par', 'slp', 'frz', 'psn', 'tox'. */
	status: string;
	fainted: boolean;
	/** Golpes já usados (ids). */
	moves: Set<string>;
	boosts: { [stat: string]: number };
	substitute: boolean;
}

export interface SideView {
	/** Pokémon já vistos, por apelido. */
	pokemon: Map<string, SeenPokemon>;
	/** Apelido do Pokémon ativo (em dupla, o da primeira posição). */
	active: string | null;
	/** Apelidos dos Pokémon ativos por posição (a, b...); em dupla, duas posições. */
	activeSlots: (string | null)[];
	/** Tamanho do time, quando o log informa (prévia de times ou |teamsize|). */
	teamSize: number | null;
	/** Espécies mostradas na prévia de times. */
	preview: string[];
	/** Condições do lado (hazards e telas), por id: camadas. */
	conditions: Map<string, number>;
}

export interface BattleState {
	sides: { [side: string]: SideView };
	turn: number;
	weather: string;
	/** 'singles', 'doubles'... (linha |gametype| do início da batalha). */
	gameType: string;
}

function emptySide(): SideView {
	return { pokemon: new Map(), active: null, activeSlots: [], teamSize: null, preview: [], conditions: new Map() };
}

/** "p1a: Apelido" → ['p1', 'Apelido'] */
function parseIdent(ident: string): [string, string] {
	const colon = ident.indexOf(':');
	return [ident.slice(0, 2), ident.slice(colon + 1).trim()];
}

/** "p1b: Apelido" → 1 (posição: a = 0, b = 1, c = 2) */
function parsePosition(ident: string): number {
	const letter = ident.charAt(2);
	return /[a-c]/.test(letter) ? letter.charCodeAt(0) - 97 : 0;
}

/** "Garchomp, L80, M" → ['Garchomp', 80] */
function parseDetails(details: string): [string, number] {
	const parts = details.split(',').map(part => part.trim());
	const levelPart = parts.find(part => /^L\d+$/.test(part));
	return [parts[0], levelPart ? Number(levelPart.slice(1)) : 100];
}

/** "45/100", "0 fnt", "45/100 par" → [hp%, status, fainted] */
function parseCondition(condition: string): [number, string | null, boolean] {
	if (!condition) return [100, null, false];
	const [hpPart, status] = condition.split(' ');
	if (status === 'fnt' || hpPart === '0') return [0, null, true];
	const [current, max] = hpPart.split('/').map(Number);
	const hp = max ? Math.round(current / max * 100) : current;
	return [hp, status || '', false];
}

/** "move: Stealth Rock" ou "Spikes" → "stealthrock" / "spikes" */
function conditionId(text: string) {
	return toID(text.replace(/^move: /, ''));
}

export function readBattleState(log: readonly string[]): BattleState {
	const state: BattleState = { sides: { p1: emptySide(), p2: emptySide() }, turn: 0, weather: '', gameType: 'singles' };
	const side = (id: string) => (state.sides[id] ||= emptySide());
	const pokemonOf = (ident: string) => {
		const [sideId, name] = parseIdent(ident);
		return side(sideId).pokemon.get(name);
	};

	for (const line of log) {
		const parts = line.split('|');
		const type = parts[1];
		switch (type) {
		case 'turn':
			state.turn = Number(parts[2]) || state.turn;
			break;
		case 'gametype':
			state.gameType = parts[2] || 'singles';
			break;
		case 'teamsize':
			side(parts[2]).teamSize = Number(parts[3]) || null;
			break;
		case 'poke': {
			const [species] = parseDetails(parts[3] || '');
			side(parts[2]).preview.push(species);
			break;
		}
		case 'switch': case 'drag': case 'replace': {
			const [sideId, name] = parseIdent(parts[2]);
			const [species, level] = parseDetails(parts[3]);
			const view = side(sideId);
			const position = parsePosition(parts[2]);
			// Quem sai daquela posição perde os boosts e o Substitute
			const leaving = view.activeSlots[position];
			const previous = leaving ? view.pokemon.get(leaving) : undefined;
			if (previous) {
				previous.boosts = {};
				previous.substitute = false;
			}
			let mon = view.pokemon.get(name);
			if (!mon) {
				mon = { name, species, level, hp: 100, status: '', fainted: false, moves: new Set(), boosts: {}, substitute: false };
				view.pokemon.set(name, mon);
			}
			mon.species = species;
			mon.level = level;
			const [hp, status, fainted] = parseCondition(parts[4]);
			mon.hp = hp;
			if (status !== null) mon.status = status;
			mon.fainted = fainted;
			view.activeSlots[position] = name;
			if (position === 0) view.active = name;
			break;
		}
		case 'swap': {
			// Ally Switch e similares: "|swap|p1a: Apelido|1" leva o Pokémon à posição 1 (b)
			const [sideId, name] = parseIdent(parts[2]);
			const view = side(sideId);
			const from = view.activeSlots.indexOf(name);
			const to = Number(parts[3]);
			if (from < 0 || !Number.isInteger(to)) break;
			[view.activeSlots[from], view.activeSlots[to]] = [view.activeSlots[to] ?? null, name];
			view.active = view.activeSlots[0] ?? null;
			break;
		}
		case 'detailschange': case '-formechange': {
			const mon = pokemonOf(parts[2]);
			if (mon && parts[3]) mon.species = parseDetails(parts[3])[0];
			break;
		}
		case '-damage': case '-heal': case '-sethp': {
			const mon = pokemonOf(parts[2]);
			if (!mon) break;
			const [hp, status, fainted] = parseCondition(parts[3]);
			mon.hp = hp;
			if (status !== null && status !== '') mon.status = status;
			if (fainted) mon.fainted = true;
			break;
		}
		case 'faint': {
			const mon = pokemonOf(parts[2]);
			if (mon) {
				mon.fainted = true;
				mon.hp = 0;
			}
			break;
		}
		case '-status': {
			const mon = pokemonOf(parts[2]);
			if (mon) mon.status = parts[3];
			break;
		}
		case '-curestatus': {
			const mon = pokemonOf(parts[2]);
			if (mon) mon.status = '';
			break;
		}
		case '-cureteam': {
			const [sideId] = parseIdent(parts[2]);
			for (const mon of side(sideId).pokemon.values()) mon.status = '';
			break;
		}
		case 'move': {
			const mon = pokemonOf(parts[2]);
			if (mon) mon.moves.add(toID(parts[3]));
			break;
		}
		case '-boost': case '-unboost': {
			const mon = pokemonOf(parts[2]);
			if (!mon) break;
			const amount = Number(parts[4]) * (type === '-boost' ? 1 : -1);
			mon.boosts[parts[3]] = Math.max(-6, Math.min(6, (mon.boosts[parts[3]] || 0) + amount));
			break;
		}
		case '-clearboost': case '-clearallboost': {
			if (type === '-clearallboost') {
				for (const view of Object.values(state.sides)) for (const mon of view.pokemon.values()) mon.boosts = {};
			} else {
				const mon = pokemonOf(parts[2]);
				if (mon) mon.boosts = {};
			}
			break;
		}
		case '-start': case '-end': {
			const mon = pokemonOf(parts[2]);
			if (mon && toID(parts[3]).endsWith('substitute')) mon.substitute = type === '-start';
			break;
		}
		case '-sidestart': {
			const [sideId] = parseIdent(parts[2]);
			const id = conditionId(parts[3]);
			const conditions = side(sideId).conditions;
			conditions.set(id, (conditions.get(id) || 0) + 1);
			break;
		}
		case '-sideend': {
			const [sideId] = parseIdent(parts[2]);
			side(sideId).conditions.delete(conditionId(parts[3]));
			break;
		}
		case '-weather':
			state.weather = parts[2] === 'none' ? '' : toID(parts[2]);
			break;
		}
	}
	return state;
}

/** Pokémon do lado ainda não derrotados (vistos ou, pela prévia/teamsize, ainda não vistos). */
export function remainingCount(view: SideView): number {
	const seen = [...view.pokemon.values()];
	const total = Math.max(view.teamSize || 0, view.preview.length, seen.length);
	return total - seen.filter(mon => mon.fainted).length;
}
