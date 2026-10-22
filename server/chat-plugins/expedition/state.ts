/**
 * pokemon-showdown-custom: estado compartilhado do plugin Expedição.
 *
 * O banco é aberto sob demanda (só no processo principal) e reaproveitado entre
 * hotpatches. Os administradores são os mesmos do Desafio de Ginásios.
 *
 * As expedições do banco viram variações (definition.ts) e ficam guardadas até a
 * próxima mudança no painel (`invalidateExpeditions`).
 *
 * @license MIT
 */
import { ExpeditionStore } from './store';
import { setVariantSource, type ExpeditionVariant } from './variant';
import { variantFromDefinition } from './definition';

export { isAdmin } from '../gym-challenge/state';

let store: ExpeditionStore | null = null;
let expeditions: Map<string, ExpeditionVariant> | null = null;

export function getStore(): ExpeditionStore {
	store ||= new ExpeditionStore();
	return store;
}

/** Testes: troca o banco (ex.: um em memória). */
export function setStore(next: ExpeditionStore | null) {
	store = next;
	expeditions = null;
}

/** Expedição criada, editada, aberta ou encerrada: as variações são montadas de novo. */
export function invalidateExpeditions() {
	expeditions = null;
}

function loadExpeditions() {
	expeditions ||= new Map(getStore().listExpeditions().map(expedition => (
		[String(expedition.id), variantFromDefinition(expedition)]
	)));
	return expeditions;
}

setVariantSource({
	get: id => loadExpeditions().get(id) || null,
	list: () => [...loadExpeditions().values()],
});
