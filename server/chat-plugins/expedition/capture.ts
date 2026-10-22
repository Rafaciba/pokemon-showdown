/**
 * pokemon-showdown-custom: captura com Poké Bola da Expedição (etapa 8).
 *
 * Decisões do usuário (2026-10-22), por expedição:
 *   - "choose" (padrão): ao vencer o selvagem, o jogador escolhe se fica com ele;
 *   - "ball": captura certa, gastando uma bola da mochila; as bolas diferem só no visual;
 *   - "chance": como nos jogos, pela taxa de captura da espécie (catch-rates.ts, do
 *     PokéAPI) e pelo multiplicador da bola. A captura acontece depois da vitória, então
 *     o selvagem conta como enfraquecido: a fórmula da geração 3/4 com o HP em 20% (a
 *     barra vermelha), sem status. O jogador pode tentar de novo com outras bolas.
 *     Lendários têm chance mínima por bola (escolha nossa: 10%).
 *
 * Bolas: Poké 1×, Great 1,5×, Ultra 2×, Net Ball 3,5× contra Water e Bug (como nos jogos,
 * 1× nos outros), Premier e Luxury só visuais (1×), Master Ball 100% (rara, só por
 * evento). Cada tentativa é sorteada com a semente da run, o nó e o número da tentativa:
 * recarregar a página não muda o resultado.
 *
 * @license MIT
 */
import type { PRNG } from '../../../sim/prng';
import { CATCH_RATES } from './catch-rates';
import { isLegendary } from './species';
import type { RunMon } from './team';

export interface Ball {
	id: string;
	name: string;
	/** Multiplicador da bola (Infinity = captura certa). */
	multiplier(species: string): number;
}

const flat = (value: number) => () => value;

export const BALLS: readonly Ball[] = [
	{ id: 'pokeball', name: 'Poké Ball', multiplier: flat(1) },
	{ id: 'greatball', name: 'Great Ball', multiplier: flat(1.5) },
	{ id: 'ultraball', name: 'Ultra Ball', multiplier: flat(2) },
	{
		id: 'netball', name: 'Net Ball',
		multiplier: species => (Dex.species.get(species).types.some(type => type === 'Water' || type === 'Bug') ? 3.5 : 1),
	},
	{ id: 'premierball', name: 'Premier Ball', multiplier: flat(1) },
	{ id: 'luxuryball', name: 'Luxury Ball', multiplier: flat(1) },
	{ id: 'masterball', name: 'Master Ball', multiplier: flat(Infinity) },
];

/** Bola padrão de quem entra no time sem lançamento (modo "choose", iniciais, presentes). */
export const DEFAULT_BALL = 'Poké Ball';

/** HP do selvagem na fórmula: 20% (enfraquecido pela batalha que acabou de vencer). */
const WEAKENED_HP = 0.2;
/** Chance mínima por bola contra lendários (escolha nossa). */
export const LEGENDARY_MIN_CHANCE = 0.1;
/** Taxa de quem não tem dado na tabela (a dos iniciais). */
const DEFAULT_RATE = 45;

export function getBall(id: string): Ball | null {
	return BALLS.find(ball => ball.id === toID(id)) || null;
}

/**
 * Id da bola pelo nome guardado no Pokémon ("Poké Ball" → "pokeball"). O toID do PS
 * apagaria o "é" ("pokball"); o nome é procurado na lista.
 */
export function ballIdByName(name: string | undefined): string | null {
	if (!name) return null;
	return BALLS.find(ball => ball.name === name || ball.id === toID(name))?.id || null;
}

/** Taxa de captura da espécie (formas usam a da espécie, pelo número da Pokédex). */
export function catchRate(speciesName: string) {
	return CATCH_RATES[Dex.species.get(speciesName).num] || DEFAULT_RATE;
}

/**
 * Chance de captura (0 a 1) de uma bola contra a espécie: a fórmula das gerações 3 e 4
 * (a = (3·HPmáx − 2·HP) · taxa · bola / (3·HPmáx); quatro balanços de (b/65536)), com o
 * HP enfraquecido, e a chance mínima dos lendários.
 */
export function catchChance(speciesName: string, ballId: string): number {
	const ball = getBall(ballId);
	if (!ball) return 0;
	const multiplier = ball.multiplier(speciesName);
	if (multiplier === Infinity) return 1;
	const a = (3 - 2 * WEAKENED_HP) / 3 * catchRate(speciesName) * multiplier;
	let chance = 1;
	if (a < 255) {
		const b = 1048560 / Math.sqrt(Math.sqrt(16711680 / a));
		chance = (b / 65536) ** 4;
	}
	if (isLegendary(Dex.species.get(speciesName))) chance = Math.max(chance, LEGENDARY_MIN_CHANCE);
	return Math.min(1, chance);
}

/** Bolas na mochila, com a quantidade, na ordem da lista. */
export function ballsInBag(items: string[]): { ball: Ball, count: number }[] {
	return BALLS.map(ball => ({ ball, count: items.filter(item => toID(item) === ball.id).length }))
		.filter(entry => entry.count > 0);
}

/** Lançamento de uma tentativa: captura ou não (o gerador vem da semente da run, do nó e da tentativa). */
export function rollCapture(prng: PRNG, speciesName: string, ballId: string) {
	return prng.random() < catchChance(speciesName, ballId);
}

/** Marca a bola de quem entra no time. */
export function withBall(mon: RunMon, ball: string): RunMon {
	return { ...mon, ball };
}
