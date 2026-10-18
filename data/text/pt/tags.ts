// pt-BR (pokemon-showdown-custom). Nomes de Pokémon, golpes, habilidades, itens, naturezas e
//   tipos ficam em inglês (nada de "name" aqui: cai no inglês). Tipos sempre depois de
//   "tipo/tipos", porque o cliente troca esse trecho pelo selo do tipo. Atributos por extenso
//   em português, abreviações em inglês. Vírgula decimal. Gerado por scripts/traducao/aplicar.cjs
//   (repositório raiz); ver docs/traducao-pt-br.md.

export const TagsText: { [id: string]: TagText } = {
	physical: {
		name: "Físico",
		desc: "O golpe causa dano com os atributos Ataque e Defesa.",
	},
	special: {
		name: "Especial",
		desc: "O golpe causa dano com os atributos Ataque Especial e Defesa Especial.",
	},
	status: {
		name: "Status",
		desc: "O golpe não causa dano.",
	},
	mega: {
		name: "Mega",
	},
	gigantamax: {
		name: "Gigantamax",
	},
	mythical: {
		name: "Mítico",
		desc: "Lendários geralmente obtidos só em eventos. Geralmente BST 600",
	},
	sublegendary: {
		name: "Sublendário",
		desc: "Lendários que não são Restritos nem Míticos. Geralmente BST de 570 a 580.",
	},
	restrictedlegendary: {
		name: "Lendário Restrito",
		desc: "Oficialmente chamados de Pokémon Especiais. Lendários proibidos na maioria dos formatos dos jogos. Geralmente BST de pelo menos 660.",
	},
	ultrabeast: {
		name: "Ultra Beast",
	},
	paradox: {
		name: "Paradox",
	},
	pokestar: {
		name: "Pokestar",
	},
	zmove: {
		name: "Z-Move",
	},
	maxmove: {
		name: "Max Move",
	},
	contact: {
		name: "Contato",
		hint: "ativa Iron Barbs, Spiky Shield etc.",
		desc: "Afetado por diversos golpes, habilidades e itens. Golpes afetados por golpes de contato: Spiky Shield, King's Shield. Habilidades afetadas por golpes de contato: Iron Barbs, Rough Skin, Gooey, Flame Body, Static, Tough Claws. Itens afetados por golpes de contato: Rocky Helmet, Sticky Barb.",
	},
	sound: {
		name: "Som",
		hint: "não afeta Pokémon com Soundproof",
		desc: "Não afeta Pokémon com Soundproof. (Todos os golpes sonoros também ignoram Substitute.)",
	},
	powder: {
		name: "Pó",
		hint: "não afeta o tipo Grass, Overcoat, Safety Goggles",
		desc: "Não afeta Pokémon do tipo Grass, Pokémon com Overcoat nem portadores de Safety Goggles.",
	},
	fist: {
		name: "Soco",
		hint: "fortalecido por Iron Fist",
		desc: "Fortalecido em 1,2× por Iron Fist.",
	},
	pulse: {
		name: "Pulso",
		hint: "fortalecido por Mega Launcher",
		desc: "Fortalecido em 1,5× por Mega Launcher.",
	},
	bite: {
		name: "Mordida",
		hint: "fortalecido por Strong Jaw",
		desc: "Fortalecido em 1,5× por Strong Jaw.",
	},
	bullet: {
		name: "Projétil",
		hint: "não afeta Pokémon com Bulletproof",
		desc: "Não afeta Pokémon com Bulletproof.",
	},
	dance: {
		name: "Dança",
		desc: "Copiado por Dancer.",
	},
	slicing: {
		name: "Corte",
		hint: "fortalecido por Sharpness",
		desc: "Fortalecido em 1,5× por Sharpness.",
	},
	wind: {
		name: "Vento",
		hint: "ativa Wind Power e Wind Rider",
		desc: "Ativa Wind Power e Wind Rider.",
	},
	defrost: {
		name: "Descongela",
		hint: "o usuário descongela se estiver congelado",
	},
	recoil: {
		name: "Recuo",
		hint: "fortalecido por Reckless",
	},
	twoturnmove: {
		name: "Golpe de dois turnos",
	},
	recharge: {
		name: "Tem turno de recarga",
	},
	suppressedbygravity: {
		name: "Bloqueado por Gravity",
	},
	boostedbysheerforce: {
		name: "Fortalecido por Sheer Force",
	},
	bypassprotect: {
		name: "Ignora Protect",
		hint: "e Detect, King's Shield, Spiky Shield",
		desc: "Ignora Protect, Detect, King's Shield e Spiky Shield.",
	},
	nonreflectable: {
		name: "Ignora Magic Bounce",
		hint: "e Magic Coat",
		desc: "Não pode ser refletido por Magic Coat nem Magic Bounce.",
	},
	nonmirror: {
		name: "Não espelhável",
		desc: "Não pode ser copiado por Mirror Move.",
	},
	nonsnatchable: {
		name: "Não roubável",
		desc: "Não pode ser copiado por Snatch.",
	},
	bypasssubstitute: {
		name: "Ignora Substitute",
		hint: "mas não o quebra",
		desc: "Ignora Substitute, mas não o quebra.",
	},
	gmaxmove: {
		name: "G-Max Move",
	},
	past: {
		name: "Passado",
		desc: "Obtível em um jogo anterior, mas não neste jogo.",
	},
	truepast: {
		name: "Passado de fato",
		desc: "Obtível em um jogo anterior, mas não existe nos dados deste jogo, nem mesmo como espaço reservado do Dexit.",
	},
	pastunobtainable: {
		name: "Inobtível no passado",
		desc: "Existia nos dados de um jogo anterior, mas nunca pôde ser obtido.",
	},
	future: {
		name: "Futuro",
		desc: "Obtível em um jogo futuro, mas não existe nos dados deste jogo.",
	},
	lgpe: {
		name: "LGPE",
		desc: "Obtível em Pokémon: Let's Go, Pikachu! ou Let's Go, Eevee!, mas não neste jogo.",
	},
	unobtainable: {
		name: "Inobtível",
		desc: "Existe nos dados do jogo, mas não pode ser obtido sem hacks.",
	},
	cap: {
		name: "CAP",
		desc: "Criado para o projeto Create-A-Pokemon da Smogon.",
	},
	custom: {
		name: "Personalizado",
		desc: "Criado para... alguma coisa. Não recomendo usar isto, não está marcado de forma muito consistente.",
	},
	nonexistent: {
		name: "Inexistente",
		desc: "Não existe nos dados do jogo. Inclui Passado, Futuro, LGPE, CAP e Personalizado.",
	},
	uber: {
		name: "Uber",
	},
	ou: {
		name: "OU",
	},
	uubl: {
		name: "UUBL",
	},
	uu: {
		name: "UU",
	},
	rubl: {
		name: "RUBL",
	},
	ru: {
		name: "RU",
	},
	nubl: {
		name: "NUBL",
	},
	nu: {
		name: "NU",
	},
	publ: {
		name: "PUBL",
	},
	pu: {
		name: "PU",
	},
	zubl: {
		name: "ZUBL",
	},
	zu: {
		name: "ZU",
	},
	nfe: {
		name: "NFE",
	},
	lc: {
		name: "LC",
	},
	captier: {
		name: "CAP Tier",
	},
	caplc: {
		name: "CAP LC",
	},
	capnfe: {
		name: "CAP NFE",
	},
	ag: {
		name: "AG",
	},
	duber: {
		name: "DUber",
	},
	dou: {
		name: "DOU",
	},
	dbl: {
		name: "DBL",
	},
	duu: {
		name: "DUU",
	},
	dnu: {
		name: "DNU",
	},
	ndag: {
		name: "ND AG",
	},
	nduber: {
		name: "ND Uber",
	},
	ndou: {
		name: "ND OU",
	},
	nduubl: {
		name: "ND UUBL",
	},
	nduu: {
		name: "ND UU",
	},
	ndrubl: {
		name: "ND RUBL",
	},
	ndru: {
		name: "ND RU",
	},
	ndnfe: {
		name: "ND NFE",
	},
	ndlc: {
		name: "ND LC",
	},
	introducedgen: {
		name: "Introduzido na Gen",
	},
	height: {
		name: "Altura",
	},
	weight: {
		name: "Peso",
	},
	hp: {
		name: "HP",
		desc: "Pontos de vida",
	},
	atk: {
		name: "Atk",
		desc: "Ataque",
	},
	def: {
		name: "Def",
		desc: "Defesa",
	},
	spa: {
		name: "SpA",
		desc: "Ataque Especial",
	},
	spd: {
		name: "SpD",
		desc: "Defesa Especial",
	},
	spe: {
		name: "Spe",
		desc: "Velocidade",
	},
	bst: {
		name: "BST",
		desc: "Total de atributos base",
	},
	basepower: {
		name: "Poder base",
	},
	priority: {
		name: "Prioridade",
	},
	accuracy: {
		name: "Precisão",
	},
	maxpp: {
		name: "PP máx.",
	},
};
