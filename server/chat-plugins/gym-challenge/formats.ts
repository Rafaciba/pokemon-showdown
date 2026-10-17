/**
 * pokemon-showdown-custom: um formato por desafio aberto.
 *
 * Chamado por config/custom-formats.ts sempre que o Dex carrega a lista de
 * formatos (no processo principal e nos processos de batalha e validação), e de
 * novo a cada recarga (reloadFormats). Por isso:
 *   - não depende dos globais do servidor (Dex, Chat, Config...), que não existem
 *     durante a carga do Dex nem nos processos filhos;
 *   - abre o banco só para leitura, numa conexão curta;
 *   - nunca lança erro: um desafio problemático fica sem formato, mas o servidor
 *     continua carregando os demais (um ID repetido derrubaria a carga inteira).
 *
 * @license MIT
 */
import * as fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';
import { toID } from '../../../sim/dex-data';
import { DEFAULT_DB_PATH } from './store';

export const FORMAT_PREFIX = '[Desafio] ';
export const FORMAT_SECTION = 'Desafio de Ginásios';

/** Dados mínimos de um formato base, como aparecem em config/formats.ts. */
export interface BaseFormatData {
	name: string;
	mod?: string;
	gameType?: string;
	team?: string;
	gymChallenge?: string;
}

interface OpenChallengeRow {
	id: number;
	name: string;
	base_format: string;
	custom_rules: string;
}

/**
 * Nome do formato de um desafio (o id é toID deste nome), começando pela geração
 * do formato base: "[Gen 9] [Desafio] Liga Kanto" → gen9desafioligakanto.
 *
 * O id precisa começar com "gen": ao carregar os times salvos no navegador, o
 * cliente põe "gen6" na frente de formatos sem geração (storage.js), e o time
 * deixaria de pertencer ao formato. Na tela, o cliente omite o prefixo da geração
 * atual, então aparece só "[Desafio] Liga Kanto".
 */
export function challengeFormatName(challengeName: string, baseMod = 'gen9') {
	const gen = /^gen(\d+)/.exec(baseMod)?.[1] || '9';
	return `[Gen ${gen}] ${FORMAT_PREFIX}${challengeName}`;
}

function readOpenChallenges(dbPath: string): OpenChallengeRow[] {
	if (dbPath !== ':memory:' && !fs.existsSync(dbPath)) return [];
	const db = new DatabaseSync(dbPath, { readOnly: true });
	try {
		// Banco ainda sem tabelas (nunca aberto pelo plugin): nada a gerar
		const table = db.prepare(`SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'challenges'`).get();
		if (!table) return [];
		return db.prepare(`
			SELECT id, name, base_format, custom_rules FROM challenges WHERE status = 'open' ORDER BY name COLLATE NOCASE
		`).all() as unknown as OpenChallengeRow[];
	} finally {
		db.close();
	}
}

/**
 * Formatos dos desafios abertos, prontos para entrar em config/custom-formats.ts.
 * `knownFormats` são os demais formatos (oficiais e nossos fixos): servem para
 * achar o formato base e para evitar IDs repetidos.
 */
export function buildChallengeFormats(knownFormats: BaseFormatData[], dbPath = DEFAULT_DB_PATH) {
	let rows: OpenChallengeRow[];
	try {
		rows = readOpenChallenges(dbPath);
	} catch (err) {
		console.error(`[gym-challenge] não foi possível ler os desafios para gerar formatos:`, err);
		return [];
	}
	const known = new Map(knownFormats.filter(f => f.name).map(f => [toID(f.name), f]));
	const used = new Set(known.keys());
	const formats = [];
	for (const row of rows) {
		const base = known.get(toID(row.base_format));
		const name = challengeFormatName(row.name, base?.mod);
		const id = toID(name);
		if (used.has(id)) {
			console.error(`[gym-challenge] desafio #${row.id} sem formato: o id "${id}" já existe`);
			continue;
		}
		// O admin só abre desafios com formato base válido; isto cobre um formato removido depois
		if (!base || base.team || base.gymChallenge) {
			console.error(`[gym-challenge] desafio #${row.id} sem formato: formato base "${row.base_format}" indisponível`);
			continue;
		}
		used.add(id);
		const rules = row.custom_rules.split(',').map(rule => rule.trim()).filter(Boolean);
		formats.push({
			name,
			desc: `Desafio de Ginásios: ${row.name}. Batalhas contra treinadores controlados pelo computador.`,
			mod: base.mod || 'gen9',
			...(base.gameType ? { gameType: base.gameType as any } : {}),
			// O formato base como regra traz o ruleset e as proibições dele
			ruleset: [base.name, ...rules],
			searchShow: true,
			challengeShow: false,
			tournamentShow: false,
			rated: false,
			gymChallenge: String(row.id),
			// O teambuilder do cliente decide geração e Pokédex pelo id do formato
			teambuilderBase: toID(base.name),
		});
	}
	return formats;
}
