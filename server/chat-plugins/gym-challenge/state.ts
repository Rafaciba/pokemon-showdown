/**
 * pokemon-showdown-custom: estado compartilhado do plugin Desafio de Ginásios.
 *
 * O banco é aberto sob demanda (só no processo principal, que é onde os
 * comandos e páginas rodam) e reaproveitado entre hotpatches.
 *
 * @license MIT
 */
import { GymStore } from './store';

let store: GymStore | null = null;

export function getStore(): GymStore {
	store ||= new GymStore();
	return store;
}

/** Só administradores (rank ~, conta registrada) gerenciam o Desafio de Ginásios. */
export function isAdmin(user: User) {
	return user.registered && Users.globalAuth.get(user.id) === '~';
}
