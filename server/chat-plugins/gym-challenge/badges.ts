/**
 * pokemon-showdown-custom: insígnias do Desafio de Ginásios.
 *
 * O catálogo (badge-catalog.ts) é gerado a partir da Bulbapedia; as imagens ficam
 * fora do git e são servidas pelo Caddy em /badges/ (docs/insignias.md). O admin
 * escolhe a insígnia de cada treinador ao montar o desafio; sem escolha, a
 * insígnia aparece como o ícone do tipo do ginásio.
 *
 * @license MIT
 */
import { Utils } from '../../../lib';
import { BADGES, type BadgeInfo } from './badge-catalog';

const byId = new Map(BADGES.map(badge => [badge.id, badge]));

/** Insígnias sem tipo fixo e os tipos de ginásio em que fazem sentido (decisão do usuário). */
const FLEXIBLE_TYPES: { [id: string]: string[] } = {
	'unova-trio': ['Grass', 'Fire', 'Water'],
};

export function getBadge(id: string | null | undefined): BadgeInfo | null {
	return (id && byId.get(id)) || null;
}

export function badgeMatchesType(badge: BadgeInfo, type: string | null) {
	if (!type) return false;
	return badge.type === type || !!FLEXIBLE_TYPES[badge.id]?.includes(type);
}

/** Nome para o admin escolher: "Boulder Badge (Kanto)". */
export function badgeLabel(badge: BadgeInfo) {
	return `${badge.name} (${badge.region})`;
}

/**
 * Opções do seletor: as insígnias do tipo do treinador primeiro, depois todas as
 * outras na ordem do catálogo (por região). Qualquer uma pode ser escolhida.
 */
export function badgeOptions(type: string | null): BadgeInfo[] {
	const matching = BADGES.filter(badge => badgeMatchesType(badge, type));
	return [...matching, ...BADGES.filter(badge => !matching.includes(badge))];
}

/** Endereço público da imagem (o cliente exige endereço absoluto). */
export function badgeImageUrl(image: string) {
	return `https://${Config.routes.client}/badges/${encodeURIComponent(image)}`;
}

/**
 * Imagem da insígnia, ou o ícone do tipo quando não há insígnia escolhida (reserva).
 * `name` e `image` vêm da cópia gravada na jornada ou do catálogo.
 */
export function badgeIcon(badge: { name: string | null, image: string | null }, type: string | null, size = 24) {
	if (badge.image && badge.name) {
		const name = Utils.escapeHTML(badge.name);
		return `<img src="${badgeImageUrl(badge.image)}" width="${size}" height="${size}" alt="${name}" title="${name}" ` +
			`style="vertical-align:middle" />`;
	}
	return type ? `<psicon type="${Utils.escapeHTML(type)}" />` : '';
}
