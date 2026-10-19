/**
 * pokemon-showdown-custom: sprites dos treinadores NPC do Desafio de Ginásios.
 *
 * São os sprites oficiais de treinador do PS (os mesmos de /avatar), servidos do
 * nosso disco em /sprites/trainers/ (docs/recursos-ps.md). O admin escolhe numa
 * galeria com busca; o id escolhido vai para a tela de batalha e para as páginas.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { OFFICIAL_AVATARS } from '../../chat-commands/avatars';

/** Ids oficiais, em ordem alfabética (só os que viram arquivo em /sprites/trainers/). */
const SPRITES: readonly string[] = [...OFFICIAL_AVATARS].filter(id => /^[a-z0-9-]+$/.test(id)).sort();
const SPRITE_SET = new Set(SPRITES);

export function isTrainerSprite(id: string) {
	return SPRITE_SET.has(id);
}

/**
 * Termo de busca normalizado: só letras e números (vai no id da página, cujos
 * parâmetros o PS separa por hífen). É comparado com o id sem hífens, então
 * "brockgen3" encontra "brock-gen3".
 */
export function spriteQuery(text: string) {
	return text.toLowerCase().replace(/[^a-z0-9]+/g, '').slice(0, 30);
}

export function searchTrainerSprites(query: string): string[] {
	const q = spriteQuery(query);
	return q ? SPRITES.filter(id => id.replace(/-/g, '').includes(q)) : [...SPRITES];
}

export function trainerSpriteUrl(id: string) {
	return `https://${Config.routes.client}/sprites/trainers/${encodeURIComponent(id)}.png`;
}

/** Imagem do sprite (80x80 no original); vazio quando o treinador não tem sprite. */
export function trainerSpriteImg(id: string | null | undefined, size = 40) {
	if (!id || !isTrainerSprite(id)) return '';
	const alt = Utils.escapeHTML(id);
	return `<img src="${trainerSpriteUrl(id)}" width="${size}" height="${size}" alt="${alt}" title="${alt}" ` +
		`style="vertical-align:middle" />`;
}
