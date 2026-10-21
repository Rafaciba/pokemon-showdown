/**
 * pokemon-showdown-custom: formatos das batalhas da Expedição.
 *
 * Cada variação tem um formato escondido ("[Gen 9] Expedition (<variação>)") e uma
 * variante em dupla, gerados a partir do formato da variação (variant.ts → format) e
 * somados aos nossos em config/custom-formats.ts.
 *
 * Estado do time: o PS monta a batalha pelo time compactado, que não tem HP nem PP
 * atuais, e o simulador roda noutro processo. Por isso o estado vai nas opções do lado
 * do NPC (o campo `expedition` do ">player p2", escrito pelo NpcBattle), que ficam no
 * registro de entrada da batalha. No começo da batalha, o `onBegin` do formato lê esse
 * registro e aplica HP, PP e status. Retomar a batalha pelo save state reproduz o
 * registro e aplica o mesmo estado.
 *
 * No fim, o formato manda o estado final do time do jogador (p1) numa linha privada
 * "|expeditionstate|", que o NpcBattle entrega ao plugin sem passar ao cliente: HP, PP,
 * desmaio, status e se o item foi gasto (berry comida, Focus Sash usada). Como nos
 * jogos, item gasto se perde; item tirado (Knock Off, Trick) volta depois da batalha.
 *
 * Este arquivo roda também no processo do simulador: não pode depender do banco nem
 * do servidor.
 *
 * @license MIT
 */
import { toID } from '../../../sim/dex-data';
import { DEFAULT_FORMAT, listVariants } from './variant';
import './variants';

export const EXPEDITION_STATE_LINE = '|expeditionstate|';

/** Estado de um Pokémon na entrada da batalha: HP (fração), PP gastos de cada golpe e status. */
export interface MonBattleState {
	hp: number;
	ppUsed: number[];
	status?: string;
}

/** Estado final de um Pokémon do jogador: posição no time enviado, HP (fração), PP gastos, desmaio, status e item gasto. */
export interface MonFinalState {
	index: number;
	hp: number;
	ppUsed: number[];
	fainted: boolean;
	status?: string;
	itemUsed?: boolean;
}

/** Status que continuam entre as batalhas. */
export const PERSISTENT_STATUSES = ['brn', 'par', 'psn', 'tox', 'slp', 'frz'];

export function expeditionFormatName(variantId: string, doubles = false) {
	return `[Gen 9] Expedition (${variantId}${doubles ? ', Doubles' : ''})`;
}

export function expeditionFormatId(variantId: string, doubles = false) {
	return toID(expeditionFormatName(variantId, doubles));
}

type BattleLike = import('../../../sim/battle').Battle;

/** Aplica o estado que veio nas opções do lado do NPC (registro de entrada). */
function applyState(battle: BattleLike) {
	const line = battle.inputLog.find(entry => entry.startsWith('>player p2 '));
	if (!line) return;
	let state: { [side: string]: MonBattleState[] } | undefined;
	try {
		state = JSON.parse(line.slice('>player p2 '.length)).expedition;
	} catch {
		return;
	}
	if (!state) return;
	for (const side of battle.sides) {
		const list = state[side.id];
		if (!Array.isArray(list)) continue;
		side.pokemon.forEach((pokemon, i) => {
			const entry = list[i];
			if (!entry) return;
			if (typeof entry.hp === 'number') {
				pokemon.hp = Math.max(1, Math.min(pokemon.maxhp, Math.round(pokemon.maxhp * entry.hp)));
			}
			pokemon.baseMoveSlots.forEach((slot, j) => {
				const used = Number(entry.ppUsed?.[j]) || 0;
				slot.pp = Math.max(0, Math.min(slot.maxpp, slot.maxpp - used));
			});
			// Status sem mensagem (o cliente vê na condição do Pokémon); o sono recomeça a contagem
			if (entry.status && PERSISTENT_STATUSES.includes(entry.status)) {
				pokemon.status = entry.status as ID;
				pokemon.statusState = battle.initEffectState({ id: entry.status, target: pokemon });
				if (entry.status === 'slp') {
					pokemon.statusState.startTime = battle.random(2, 5);
					pokemon.statusState.time = pokemon.statusState.startTime;
				}
				if (entry.status === 'tox') pokemon.statusState.stage = 0;
			}
		});
	}
}

/** Manda o estado final do time do jogador (p1) numa linha privada, antes do fim da batalha. */
function sendFinalState(battle: BattleLike) {
	const side = battle.sides[0];
	if (!side) return;
	const states: MonFinalState[] = side.pokemon.map(pokemon => ({
		index: side.team.indexOf(pokemon.set),
		hp: pokemon.fainted ? 0 : pokemon.hp / pokemon.maxhp,
		ppUsed: pokemon.baseMoveSlots.map(slot => Math.max(0, slot.maxpp - slot.pp)),
		fainted: !!pokemon.fainted,
		status: pokemon.fainted ? '' : PERSISTENT_STATUSES.includes(pokemon.status) ? pokemon.status : '',
		// Gasto: sem item e o último usado foi o dele (tirado por Knock Off ou Trick não conta)
		itemUsed: !!pokemon.set.item && !pokemon.item && toID(pokemon.lastItem) === toID(pokemon.set.item),
	}));
	battle.send('sideupdate', `p1\n${EXPEDITION_STATE_LINE}${JSON.stringify(states)}`);
}

function onBegin(this: BattleLike) {
	applyState(this);
	const win = this.win;
	this.win = function (side) {
		if (!this.ended) sendFinalState(this);
		return win.call(this, side);
	};
}

type BaseFormatData = import('../../../sim/dex-formats').FormatData;

/** Formatos das variações, prontos para config/custom-formats.ts. */
export function buildExpeditionFormats(knownFormats: BaseFormatData[]) {
	const known = new Map(knownFormats.filter(f => f.name).map(f => [toID(f.name), f]));
	const formats = [];
	for (const variant of listVariants()) {
		const spec = variant.format || DEFAULT_FORMAT;
		const base = known.get(toID(spec.base));
		if (!base) {
			console.error(`[expedition] variação ${variant.id} sem formato: formato base "${spec.base}" indisponível`);
			continue;
		}
		const rules = spec.rules.split(',').map(rule => rule.trim()).filter(Boolean);
		const common = {
			mod: base.mod || 'gen9',
			ruleset: [base.name, ...rules],
			searchShow: false,
			challengeShow: false,
			tournamentShow: false,
			rated: false,
			expedition: variant.id,
			onBegin,
		};
		formats.push({
			...common, name: expeditionFormatName(variant.id), desc: `Expedition: ${variant.id}.`,
			...(base.gameType ? { gameType: base.gameType as any } : {}),
		});
		if (!base.gameType || base.gameType === 'singles') {
			formats.push({
				...common, name: expeditionFormatName(variant.id, true), desc: `Expedition: ${variant.id}, doubles.`,
				gameType: 'doubles' as any,
			});
		}
	}
	return formats;
}
