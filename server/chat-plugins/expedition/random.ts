/**
 * pokemon-showdown-custom: sorteios determinísticos da Expedição.
 *
 * A run guarda só uma semente. O mapa, as opções de time inicial e os encontros são
 * gerados a partir dela (e de um rótulo, como "act1" ou "starters"), sempre com o
 * mesmo resultado: retomar a run e testar não dependem de guardar tudo o que foi
 * sorteado. Usa o gerador do próprio simulador do PS (sim/prng.ts).
 *
 * @license MIT
 */
import * as crypto from 'node:crypto';
import { PRNG } from '../../../sim/prng';

/** Semente nova para uma run (hexadecimal, sem dado nenhum do jogador). */
export function newSeed() {
	return crypto.randomBytes(16).toString('hex');
}

/** Gerador para uma parte da run: a mesma semente e o mesmo rótulo dão os mesmos sorteios. */
export function seededRandom(seed: string, label: string) {
	const hex = crypto.createHash('sha256').update(`${seed}|${label}`).digest('hex').slice(0, 32);
	return new PRNG(`sodium,${hex}`);
}

/** Sorteio ponderado: devolve uma chave de `weights` (pesos zero ou negativos não saem), ou null. */
export function weightedPick<T extends string>(prng: PRNG, weights: Partial<Record<T, number>>): T | null {
	const entries = (Object.entries(weights) as [T, number][]).filter(([, weight]) => weight > 0);
	const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
	if (!total) return null;
	let roll = prng.random() * total;
	for (const [key, weight] of entries) {
		roll -= weight;
		if (roll < 0) return key;
	}
	return entries[entries.length - 1][0];
}
