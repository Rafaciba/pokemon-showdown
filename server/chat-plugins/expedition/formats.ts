/**
 * pokemon-showdown-custom: formatos das batalhas da Expedição.
 *
 * Cada expedição tem um formato escondido ("[Gen 9] Expedition (<id>)") e uma variante
 * em dupla, gerados a partir do formato base e das regras da expedição e somados aos
 * nossos em config/custom-formats.ts. As expedições do banco (rascunhos e abertas) são
 * lidas direto do arquivo, só para leitura, como os desafios do Desafio de Ginásios
 * (gym-challenge/formats.ts): a lista é montada também nos processos do simulador, sem
 * o servidor. O painel recarrega os formatos quando cria, edita, abre ou encerra uma
 * expedição. As variações do código (a de teste dos testes automáticos) entram junto.
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
import * as fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { toID } from '../../../sim/dex-data';
import { DEFAULT_FORMAT, listCodeVariants, type FormatSpec } from './variant';
import './variants';

export const DEFAULT_DB_PATH = 'databases/expedition.db';

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

/** Formato de cada expedição do banco que pode ter batalhas (rascunhos, para o teste do admin, e abertas). */
function readExpeditionFormats(dbPath: string): { id: string, format: FormatSpec }[] {
	if (dbPath !== ':memory:' && !fs.existsSync(dbPath)) return [];
	const db = new DatabaseSync(dbPath, { readOnly: true });
	try {
		const table = db.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'expeditions'`).get();
		if (!table) return [];
		const rows = db.prepare(`SELECT id, definition FROM expeditions WHERE status IN ('draft', 'open') ORDER BY id`)
			.all() as { id: number, definition: string }[];
		return rows.map(row => {
			let format: FormatSpec = DEFAULT_FORMAT;
			try {
				const parsed = JSON.parse(row.definition).format;
				if (typeof parsed?.base === 'string' && typeof parsed?.rules === 'string') format = parsed;
			} catch {}
			return { id: String(row.id), format };
		});
	} finally {
		db.close();
	}
}

/** Formatos das expedições, prontos para config/custom-formats.ts. Nunca lança erro. */
export function buildExpeditionFormats(knownFormats: BaseFormatData[], dbPath = DEFAULT_DB_PATH) {
	const known = new Map(knownFormats.filter(f => f.name).map(f => [toID(f.name), f]));
	let stored: { id: string, format: FormatSpec }[] = [];
	try {
		stored = readExpeditionFormats(dbPath);
	} catch (err) {
		console.error(`[expedition] não foi possível ler as expedições para gerar formatos:`, err);
	}
	const entries = [
		...listCodeVariants().map(variant => ({ id: variant.id, format: variant.format || DEFAULT_FORMAT })),
		...stored,
	];
	const formats = [];
	const used = new Set<string>();
	for (const { id, format: spec } of entries) {
		if (used.has(id)) continue;
		used.add(id);
		const base = known.get(toID(spec.base));
		if (!base || base.team) {
			console.error(`[expedition] expedição ${id} sem formato: formato base "${spec.base}" indisponível`);
			continue;
		}
		const variant = { id };
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
