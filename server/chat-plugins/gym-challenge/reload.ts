/**
 * pokemon-showdown-custom: recarga dos formatos depois de mudanças nos desafios.
 *
 * Os formatos de desafio são gerados quando o Dex carrega (config/custom-formats.ts
 * → formats.ts). Para a lista mudar sem reiniciar o servidor, fazemos os mesmos
 * passos do `/hotpatch formats` oficial (server/chat-commands/admin.ts), só para o
 * Dex e sem o `/rebuild`: o código não mudou, só os dados.
 *
 * O Dex novo só substitui o atual se a lista de formatos carregar inteira. Se algo
 * falhar, o servidor continua com os formatos de antes e o erro vai para o crashlog.
 *
 * @license MIT
 */
import { createRequire } from 'node:module';

/**
 * Módulos relidos: o simulador e os dados (como no hotpatch, que limpa o cache
 * inteiro) e as listas de formatos. Os mods de data/ precisam vir junto: alguns
 * alteram os próprios dados ao inicializar e falham se forem reaproveitados.
 */
function isReloadedModule(file: string) {
	const normalized = file.replace(/\\/g, '/');
	return /\/dist\/(sim|data)\//.test(normalized) || /\/dist\/config\/(custom-)?formats\.js$/.test(normalized);
}

export function reloadFormats(): boolean {
	const saved = new Map<string, NodeJS.Module>();
	for (const file in require.cache) {
		if (!isReloadedModule(file)) continue;
		saved.set(file, require.cache[file]!);
		delete require.cache[file];
	}
	// createRequire, como no hotpatch, para os módulos antigos poderem ser descartados
	const reRequire = createRequire(__filename);
	let dex: typeof Dex;
	try {
		dex = reRequire('../../../sim/dex').Dex;
		// Confere tudo antes de trocar: a lista enviada aos clientes monta a tabela de
		// regras de todos os formatos (e com isso carrega todos os mods)
		for (const format of dex.formats.all()) dex.formats.getRuleTable(format);
	} catch (err: any) {
		// Volta o cache como estava: quem fizer require depois recebe os módulos em uso
		for (const file in require.cache) {
			if (isReloadedModule(file)) delete require.cache[file];
		}
		for (const [file, mod] of saved) require.cache[file] = mod;
		Monitor.crashlog(err, 'A gym challenge formats reload');
		return false;
	}

	global.Dex = dex;
	global.TeamValidator = reRequire('../../../sim/team-validator').TeamValidator;
	global.Teams = reRequire('../../../sim/teams').Teams;
	// Lista de formatos refeita e enviada a quem está conectado
	Rooms.global.formatList = '';
	// Processos de validação e de batalha novos carregam os formatos novos
	// (as batalhas em andamento continuam nos processos antigos até terminarem)
	void TeamValidatorAsync.PM.respawn();
	void Rooms.PM.respawn();
	void Chat.plugins.datasearch?.PM?.respawn();
	Rooms.global.sendAll(Rooms.global.formatListText);
	return true;
}
