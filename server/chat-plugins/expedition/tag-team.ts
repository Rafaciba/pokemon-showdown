/**
 * pokemon-showdown-custom: batalha em dupla contra dois treinadores (Expedição).
 *
 * Decisão do usuário (2026-10-22): uma batalha dupla comum, em que o lado adversário tem
 * o time dos dois treinadores, e a IA joga cada posição só com os Pokémon do treinador
 * daquela posição. Quando um treinador fica sem Pokémon, o do outro pode entrar no lugar
 * vago (o PS obriga a troca se houver alguém no banco).
 *
 * O time vai intercalado (1º do treinador A, 1º do B, 2º do A...), e o dono de cada
 * Pokémon é guardado pelo nome (as espécies não se repetem entre os dois). A IA do nível
 * escolhe normalmente; este envoltório só corrige a escolha:
 *   - na prévia do time, a ordem intercalada (os titulares são o 1º de cada treinador);
 *   - uma troca para um Pokémon do outro treinador vira uma troca para um do próprio, se
 *     houver; senão, na troca obrigatória, fica (o lugar vago); na troca voluntária, vira
 *     o primeiro golpe.
 *
 * @license MIT
 */
import type { ChoiceRequest } from '../../../sim/side';
import type { BattleView, NpcAI } from '../gym-challenge/ai';

/** Intercala os dois times (os titulares são o 1º de cada treinador). */
export function interleave(a: string[], b: string[]): string[] {
	const result: string[] = [];
	for (let i = 0; i < Math.max(a.length, b.length); i++) {
		if (a[i]) result.push(a[i]);
		if (b[i]) result.push(b[i]);
	}
	return result;
}

function nameOf(ident: string) {
	return ident.slice(ident.indexOf(':') + 1).trim();
}

export class TagTeamAI implements NpcAI {
	readonly level;
	private readonly inner: NpcAI;
	private readonly owners: Record<string, number>;

	constructor(inner: NpcAI, owners: Record<string, number>) {
		this.inner = inner;
		this.owners = owners;
		this.level = inner.level;
	}

	choose(request: ChoiceRequest, view: BattleView): string | null | Promise<string | null> {
		if (request.teamPreview) {
			const count = request.side.pokemon.length;
			return `team ${Array.from({ length: count }, (_, i) => i + 1).join('')}`;
		}
		const result = this.inner.choose(request, view);
		if (result instanceof Promise) return result.then(choice => this.fix(request, choice));
		return this.fix(request, result);
	}

	/** Corrige as trocas para os Pokémon do treinador de cada posição. */
	fix(request: ChoiceRequest, choice: string | null): string | null {
		if (!choice || request.wait || request.teamPreview || !choice.includes('switch')) return choice;
		const side = request.side.pokemon;
		const owner = (index: number) => this.owners[nameOf(side[index]?.ident || '')];
		const parts = choice.split(',').map(part => part.trim());
		const chosen = new Set<number>();
		for (const part of parts) {
			const match = /^switch (\d+)$/.exec(part);
			if (match) chosen.add(Number(match[1]) - 1);
		}
		const forced = 'forceSwitch' in request && !!request.forceSwitch;
		return parts.map((part, position) => {
			const match = /^switch (\d+)$/.exec(part);
			if (!match) return part;
			const target = Number(match[1]) - 1;
			const mine = owner(position);
			if (mine === undefined || owner(target) === mine) return part;
			const alternative = side.findIndex((mon, i) => (
				!mon.active && !mon.condition.endsWith(' fnt') && owner(i) === mine && !chosen.has(i)
			));
			if (alternative >= 0) {
				chosen.delete(target);
				chosen.add(alternative);
				return `switch ${alternative + 1}`;
			}
			// Sem ninguém do próprio treinador: na troca obrigatória, o do outro entra no lugar vago
			return forced ? part : 'move 1';
		}).join(', ');
	}
}
