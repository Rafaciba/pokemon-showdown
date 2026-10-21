/**
 * pokemon-showdown-custom: estado compartilhado do plugin Expedição.
 *
 * O banco é aberto sob demanda (só no processo principal) e reaproveitado entre
 * hotpatches. Os administradores são os mesmos do Desafio de Ginásios.
 *
 * @license MIT
 */
import { ExpeditionStore } from './store';

export { isAdmin } from '../gym-challenge/state';

let store: ExpeditionStore | null = null;

export function getStore(): ExpeditionStore {
	store ||= new ExpeditionStore();
	return store;
}

/** Testes: troca o banco (ex.: um em memória). */
export function setStore(next: ExpeditionStore | null) {
	store = next;
}
