// pt-BR (pokemon-showdown-custom). Nomes de Pokémon, golpes, habilidades, itens, naturezas e
//   tipos ficam em inglês (nada de "name" aqui: cai no inglês). Tipos sempre depois de
//   "tipo/tipos", porque o cliente troca esse trecho pelo selo do tipo. Atributos por extenso
//   em português, abreviações em inglês. Vírgula decimal. Gerado por scripts/traducao/aplicar.cjs
//   (repositório raiz); ver docs/traducao-pt-br.md.

// Gênero gramatical dos atributos, para {INFLECT:STAT:...} nas mensagens de batalha
export const StatNames: { [id: string]: TranslationString } = {
	hp: "HP",
	"hp:grammar": "ms",
	atk: "Ataque",
	"atk:grammar": "ms",
	def: "Defesa",
	"def:grammar": "fs",
	spa: "Ataque Especial",
	"spa:grammar": "ms",
	spd: "Defesa Especial",
	"spd:grammar": "fs",
	spe: "Velocidade",
	"spe:grammar": "fs",
	accuracy: "precisão",
	"accuracy:grammar": "fs",
	evasion: "evasão",
	"evasion:grammar": "fs",
	spc: "Especial",
	"spc:grammar": "ms",
	stats: "atributos",
	"stats:grammar": "mp",
};

export const StatMediumNames: { [id: string]: TranslationString } = {
	hp: "HP",
	atk: "Ataque",
	def: "Defesa",
	spa: "Sp. Atk",
	spd: "Sp. Def",
	spe: "Velocidade",
	accuracy: "Precisão",
	evasion: "Evasão",
	spc: "Especial",
};

export const StatusNames: { [id: string]: TranslationString } = {
	brn: "Queimado",
	par: "Paralisado",
	slp: "Dormindo",
	frz: "Congelado",
	psn: "Envenenado",
	tox: "Gravemente envenenado",
	fnt: "Desmaiado",
	confusion: "Confuso",
};

export const TargetNames: { [id: string]: TranslationString } = {
	normal: "Pode atingir qualquer aliado ou oponente adjacente",
	normalDoubles: "Pode atingir o aliado ou qualquer oponente",
	normalSingles: "Atinge o oponente",
	normalFFA: "Pode atingir qualquer oponente",
	self: "Atinge o usuário",
	adjacentAlly: "Pode atingir qualquer aliado adjacente",
	adjacentAllyDoubles: "Atinge seu aliado",
	adjacentAllySingles: "Sempre falha em Simples",
	adjacentAllyOrSelf: "Pode atingir o usuário ou um aliado adjacente",
	adjacentAllyOrSelfDoubles: "Pode atingir o usuário ou o aliado",
	adjacentFoe: "Pode atingir qualquer oponente adjacente",
	allAdjacentFoes: "Atinge os oponentes adjacentes",
	allAdjacentFoesDoubles: "Atinge os dois oponentes",
	foeSide: "Atinge o lado adversário",
	allySide: "Atinge o lado do usuário",
	allyTeam: "Atinge o time do usuário",
	allAdjacent: "Atinge aliados e oponentes adjacentes",
	allAdjacentDoubles: "Atinge o aliado e os dois oponentes",
	allAdjacentFFA: "Atinge todos os oponentes",
	any: "Pode atingir Pokémon distantes em Triplas",
	all: "Atinge todos os Pokémon",
	scripted: "Alvo escolhido automaticamente",
	randomNormal: "Atinge um oponente adjacente aleatório",
	randomNormalDoubles: "Atinge um oponente aleatório",
	allies: "Atinge o usuário e os aliados",
};

export const GenderNames: { [id: string]: TranslationString } = {
	M: "Masculino",
	F: "Feminino",
	N: "Sem gênero",
};

export const ColorNames: { [id: string]: TranslationString } = {
	Black: "Preto",
	Blue: "Azul",
	Brown: "Marrom",
	Gray: "Cinza",
	Green: "Verde",
	Pink: "Rosa",
	Purple: "Roxo",
	Red: "Vermelho",
	White: "Branco",
	Yellow: "Amarelo",
};
