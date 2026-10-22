/**
 * pokemon-showdown-custom: expedição de teste.
 *
 * Desde a etapa 6, as expedições são criadas pelo admin (definition.ts). A expedição de
 * teste das etapas anteriores virou uma definição:
 *   - a migração 5 do banco (store.ts) a grava como o rascunho "Expedição de teste",
 *     que os administradores testam e editam no painel;
 *   - a mesma definição fica registrada aqui como a variação escondida "teste", que
 *     nenhum jogador vê: serve aos testes automáticos, que precisam de uma variação com
 *     formato carregado junto com o servidor, sem depender do banco.
 *
 * Um ato curto (Personalizado, 1 ato), com as escolhas padrão da etapa 6.
 *
 * @license MIT
 */
import { registerVariant, type ExpeditionVariant } from './variant';
import { normalizeDefinition, variantFromDefinition } from './definition';

export const TEST_DEFINITION = normalizeDefinition({
	description: 'Uma expedição curta para testar o modo: um ato com selvagens, treinadores, eventos, itens, ' +
		'PokéCenters, PokéMarts e um chefe.',
	acts: { mode: 'custom', count: 1 },
	levelCap: 35,
});

export const TEST_VARIANT: ExpeditionVariant = {
	...variantFromDefinition({ id: 0, name: 'Test expedition', status: 'draft', definition: TEST_DEFINITION }),
	id: 'teste',
	status: undefined,
	hidden: true,
};

registerVariant(TEST_VARIANT);
