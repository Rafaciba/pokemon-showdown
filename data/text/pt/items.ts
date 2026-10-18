// pt-BR (pokemon-showdown-custom). Nomes de Pokémon, golpes, habilidades, itens, naturezas e
//   tipos ficam em inglês (nada de "name" aqui: cai no inglês). Tipos sempre depois de
//   "tipo/tipos", porque o cliente troca esse trecho pelo selo do tipo. Atributos por extenso
//   em português, abreviações em inglês. Vírgula decimal. Gerado por scripts/traducao/aplicar.cjs
//   (repositório raiz); ver docs/traducao-pt-br.md.

export const ItemsText: { [id: IDEntry]: Partial<ItemText> } = {
	abilityshield: {
		shortDesc: "A habilidade do portador não pode ser alterada, suprimida nem ignorada por nada.",
		block: "  A habilidade de {POKEMON} está protegida pelos efeitos de Ability Shield!",
	},
	abomasite: {
		shortDesc: "Se segurado por Abomasnow, este item permite que ele Megaevolua em batalha.",
	},
	absolite: {
		shortDesc: "Se segurado por Absol, este item permite que ele Megaevolua em Mega Absol em batalha.",
	},
	absolitez: {
		shortDesc: "Se segurado por Absol, este item permite que ele Megaevolua em Mega Absol Z em batalha.",
	},
	absorbbulb: {
		shortDesc: "Aumenta o Sp. Atk do portador em 1 se atingido por ataque do tipo Water. Uso único.",
	},
	adamantcrystal: {
		shortDesc: "Se segurado por Dialga, seus ataques dos tipos Steel e Dragon têm 1,2× de poder.",
	},
	adamantorb: {
		shortDesc: "Se segurado por Dialga, seus ataques dos tipos Steel e Dragon têm 1,2× de poder.",
	},
	adrenalineorb: {
		shortDesc: "Aumenta a Velocidade do portador em 1 se ele for afetado por Intimidate. Uso único.",
	},
	aerodactylite: {
		shortDesc: "Se segurado por Aerodactyl, este item permite que ele Megaevolua em batalha.",
	},
	aggronite: {
		shortDesc: "Se segurado por Aggron, este item permite que ele Megaevolua em batalha.",
	},
	aguavberry: {
		shortDesc: "Cura 1/3 do HP máx. com 1/4 do HP ou menos; confunde se natureza -SpD. Uso único.",
		gen7: {
			shortDesc: "Cura 1/2 do HP máx. com 1/4 do HP ou menos; confunde se natureza -SpD. Uso único.",
		},
		gen6: {
			shortDesc: "Cura 1/8 do HP máx. com 1/2 do HP ou menos; confunde se natureza -SpD. Uso único.",
		},
	},
	airballoon: {
		shortDesc: "O portador é imune a ataques do tipo Ground. Estoura quando o portador é atingido.",
		start: "  {POKEMON} flutua no ar com Air Balloon!",
		end: "  Air Balloon de {POKEMON} estourou!",
	},
	alakazite: {
		shortDesc: "Se segurado por Alakazam, este item permite que ele Megaevolua em batalha.",
	},
	aloraichiumz: {
		shortDesc: "Se segurado por Alolan Raichu com Thunderbolt, pode usar Stoked Sparksurfer.",
	},
	altarianite: {
		shortDesc: "Se segurado por Altaria, este item permite que ele Megaevolua em batalha.",
	},
	ampharosite: {
		shortDesc: "Se segurado por Ampharos, este item permite que ele Megaevolua em batalha.",
	},
	apicotberry: {
		shortDesc: "Aumenta a Sp. Def do portador em 1 estágio com 1/4 do HP máx. ou menos. Uso único.",
	},
	armorfossil: {
		shortDesc: "Pode ser revivido como Shieldon.",
	},
	aspearberry: {
		shortDesc: "O portador é curado se estiver congelado. Uso único.",
	},
	assaultvest: {
		shortDesc: "A Sp. Def do portador é 1,5×, mas ele só pode escolher golpes de dano.",
	},
	audinite: {
		shortDesc: "Se segurado por Audino, este item permite que ele Megaevolua em batalha.",
	},
	auspiciousarmor: {
		shortDesc: "Evolui Charcadet em Armarouge quando usado.",
	},
	babiriberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Steel. Uso único.",
	},
	banettite: {
		shortDesc: "Se segurado por Banette, este item permite que ele Megaevolua em batalha.",
	},
	barbaracite: {
		shortDesc: "Se segurado por Barbaracle, este item permite que ele Megaevolua em batalha.",
	},
	baxcalibrite: {
		shortDesc: "Se segurado por Baxcalibur, este item permite que ele Megaevolua em batalha.",
	},
	beastball: {
		shortDesc: "Uma Poke Ball especial feita para capturar Ultra Beasts.",
	},
	beedrillite: {
		shortDesc: "Se segurado por Beedrill, este item permite que ele Megaevolua em batalha.",
	},
	belueberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	berryjuice: {
		shortDesc: "Recupera 20 HP com 1/2 do HP máx. ou menos. Uso único.",
	},
	berrysweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	bignugget: {
		shortDesc: "Uma grande pepita de ouro puro que emite um brilho lustroso.",
	},
	bigroot: {
		shortDesc: "O portador ganha 1,3× de HP com drenagem/Aqua Ring/Ingrain/Leech Seed/Strength Sap.",
		gen6: {
			shortDesc: "O portador ganha 1,3× de HP com golpes de drenagem, Aqua Ring, Ingrain e Leech Seed.",
		},
	},
	bindingband: {
		shortDesc: "Golpes de aprisionamento parcial do portador tiram 1/6 do HP máx. por turno, não 1/8.",
	},
	blackaugurite: {
		shortDesc: "Evolui Scyther em Kleavor quando usado.",
	},
	blackbelt: {
		shortDesc: "Os ataques do tipo Fighting do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Fighting do portador têm 1,1× de poder.",
		},
	},
	blacksludge: {
		shortDesc: "A cada turno, se do tipo Poison, o portador cura 1/16 do HP máx.; senão, perde 1/8.",
		heal: "  {POKEMON} recuperou um pouco de HP com Black Sludge!",
	},
	blackglasses: {
		shortDesc: "Os ataques do tipo Dark do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Dark do portador têm 1,1× de poder.",
		},
	},
	blankplate: {
		shortDesc: "Muda Arceus para o tipo Normal quando usado em Legends: Arceus.",
	},
	blastoisinite: {
		shortDesc: "Se segurado por Blastoise, este item permite que ele Megaevolua em batalha.",
	},
	blazikenite: {
		shortDesc: "Se segurado por Blaziken, este item permite que ele Megaevolua em batalha.",
	},
	blueorb: {
		shortDesc: "Se segurado por Kyogre, este item ativa sua Primal Reversion em batalha.",
	},
	blukberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	blunderpolicy: {
		shortDesc: "Se o portador errar por causa da precisão, sua Velocidade sobe 2 estágios. Uso único.",
	},
	boosterenergy: {
		shortDesc: "Ativa as habilidades Protosynthesis ou Quark Drive. Uso único.",
	},
	bottlecap: {
		shortDesc: "Usado no Hyper Training. Um dos atributos de um Pokémon é calculado com IV 31.",
	},
	brightpowder: {
		shortDesc: "A precisão dos ataques contra o portador é 0,9×.",
		gen2: {
			shortDesc: "Um ataque contra o portador tem a precisão (numa escala de 255) reduzida em 20.",
		},
	},
	buggem: {
		shortDesc: "1º ataque do tipo Bug bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Bug bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	buginiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Bug, pode usar um Z-Move do tipo Bug.",
	},
	bugmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Bug.",
	},
	burndrive: {
		shortDesc: "Techno Blast do portador é do tipo Fire.",
	},
	cameruptite: {
		shortDesc: "Se segurado por Camerupt, este item permite que ele Megaevolua em batalha.",
	},
	cellbattery: {
		shortDesc: "Aumenta o Ataque do portador em 1 se atingido por ataque do tipo Electric. Uso único.",
	},
	chandelurite: {
		shortDesc: "Se segurado por Chandelure, este item permite que ele Megaevolua em batalha.",
	},
	charcoal: {
		shortDesc: "Os ataques do tipo Fire do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Fire do portador têm 1,1× de poder.",
		},
	},
	charizarditex: {
		shortDesc: "Se segurado por Charizard, este item permite que ele Megaevolua em Mega Charizard X.",
	},
	charizarditey: {
		shortDesc: "Se segurado por Charizard, este item permite que ele Megaevolua em Mega Charizard Y.",
	},
	chartiberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Rock. Uso único.",
	},
	cheriberry: {
		shortDesc: "O portador se cura se estiver paralisado. Uso único.",
	},
	cherishball: {
		shortDesc: "Uma Poke Ball rara, criada para comemorar uma ocasião.",
	},
	chesnaughtite: {
		shortDesc: "Se segurado por Chesnaught, este item permite que ele Megaevolua em batalha.",
	},
	chestoberry: {
		shortDesc: "O portador acorda se estiver dormindo. Uso único.",
	},
	chilanberry: {
		shortDesc: "Reduz à metade o dano de um ataque do tipo Normal. Uso único.",
	},
	chilldrive: {
		shortDesc: "Techno Blast do portador é do tipo Ice.",
	},
	chimechite: {
		shortDesc: "Se segurado por Chimecho, este item permite que ele Megaevolua em batalha.",
	},
	chippedpot: {
		shortDesc: "Evolui Sinistea-Antique em Polteageist-Antique quando usado.",
	},
	choiceband: {
		shortDesc: "O Ataque do portador é 1,5×, mas ele só pode escolher o primeiro golpe que executar.",
	},
	choicescarf: {
		shortDesc: "A Velocidade do portador é 1,5×, mas ele só pode escolher o primeiro golpe que usar.",
	},
	choicespecs: {
		shortDesc: "O Sp. Atk do portador é 1,5×, mas ele só pode escolher o primeiro golpe que executar.",
	},
	chopleberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Fighting. Uso único.",
	},
	clawfossil: {
		shortDesc: "Pode ser revivido como Anorith.",
	},
	clearamulet: {
		shortDesc: "Impede que outros Pokémon diminuam os estágios de atributos do portador.",
		block: "  Os efeitos de Clear Amulet de {POKEMON} impedem que seus atributos sejam diminuídos!",
	},
	clefablite: {
		shortDesc: "Se segurado por Clefable, este item permite que ele Megaevolua em batalha.",
	},
	cloversweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	cobaberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Flying. Uso único.",
	},
	colburberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Dark. Uso único.",
	},
	cornerstonemask: {
		shortDesc: "Ogerpon-Cornerstone: ataques com 1,2× de poder; Terastalizar dá Embody Aspect.",
	},
	cornnberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	coverfossil: {
		shortDesc: "Pode ser revivido como Tirtouga.",
	},
	covertcloak: {
		desc: "O portador não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer o portador recuar ou diminuir os estágios de atributos do portador, além de Anchor Shot, Eerie Spell, Fling, Psychic Noise, Salt Cure, Spirit Shackle, Syrup Bomb e Throat Chop. O efeito de Sparkling Aria é impedido se o portador for o único alvo. Os efeitos secundários adicionados por King's Rock, Razor Fang e pelas habilidades Poison Touch, Stench e Toxic Chain também são impedidos contra o portador.",
		shortDesc: "O portador não é afetado pelo efeito secundário do ataque de outro Pokémon.",
	},
	crabominite: {
		shortDesc: "Se segurado por Crabominable, este item permite que ele Megaevolua em batalha.",
	},
	crackedpot: {
		shortDesc: "Evolui Sinistea em Polteageist quando usado.",
	},
	custapberry: {
		shortDesc: "Com 1/4 do HP máx. ou menos, age primeiro na sua faixa de prioridade. Uso único.",
		activate: "  {POKEMON} pode agir mais rápido que o normal graças a Custap Berry!",
	},
	damprock: {
		shortDesc: "Rain Dance usado pelo portador dura 8 turnos em vez de 5.",
	},
	darkgem: {
		shortDesc: "1º ataque do tipo Dark bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Dark bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	darkiniumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Dark, pode usar um Z-Move do tipo Dark.",
	},
	darkmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Dark.",
	},
	darkranite: {
		shortDesc: "Se segurado por Darkrai, este item permite que ele Megaevolua em batalha.",
	},
	dawnstone: {
		desc: "Evolui Kirlia macho em Gallade e Snorunt fêmea em Froslass quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	decidiumz: {
		shortDesc: "Se segurado por Decidueye com Spirit Shackle, pode usar Sinister Arrow Raid.",
	},
	deepseascale: {
		desc: "Se segurado por Clamperl, sua Sp. Def dobra. Evolui Clamperl em Gorebyss quando trocado.",
		shortDesc: "Se segurado por Clamperl, sua Sp. Def dobra.",
	},
	deepseatooth: {
		desc: "Se segurado por Clamperl, seu Sp. Atk dobra. Evolui Clamperl em Huntail quando trocado.",
		shortDesc: "Se segurado por Clamperl, seu Sp. Atk dobra.",
	},
	delphoxite: {
		shortDesc: "Se segurado por Delphox, este item permite que ele Megaevolua em batalha.",
	},
	destinyknot: {
		shortDesc: "Se o portador ficar apaixonado, o outro Pokémon também fica apaixonado.",
	},
	diancite: {
		shortDesc: "Se segurado por Diancie, este item permite que ele Megaevolua em batalha.",
	},
	diveball: {
		shortDesc: "Uma Poke Ball que funciona especialmente bem em Pokémon que vivem debaixo d'água.",
	},
	domefossil: {
		shortDesc: "Pode ser revivido como Kabuto.",
	},
	dousedrive: {
		shortDesc: "Techno Blast do portador é do tipo Water.",
	},
	dracoplate: {
		shortDesc: "Os ataques do tipo Dragon do portador têm 1,2× de poder. Judgment é do tipo Dragon.",
	},
	dragalgite: {
		shortDesc: "Se segurado por Dragalge, este item permite que ele Megaevolua em batalha.",
	},
	dragonfang: {
		shortDesc: "Os ataques do tipo Dragon do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Dragon do portador têm 1,1× de poder.",
		},
		gen2: {
			shortDesc: "Sem uso competitivo.",
		},
	},
	dragongem: {
		shortDesc: "1º ataque do tipo Dragon bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Dragon bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	dragoninite: {
		shortDesc: "Se segurado por Dragonite, este item permite que ele Megaevolua em batalha.",
	},
	dragoniumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Dragon, pode usar um Z-Move do tipo Dragon.",
	},
	dragonmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Dragon.",
	},
	dragonscale: {
		shortDesc: "Evolui Seadra em Kingdra quando trocado.",
		gen2: {
			shortDesc: "Os ataques do tipo Dragon do portador têm 1,1× de poder. Evolui Seadra (troca).",
		},
	},
	drampanite: {
		shortDesc: "Se segurado por Drampa, este item permite que ele Megaevolua em batalha.",
	},
	dreadplate: {
		shortDesc: "Os ataques do tipo Dark do portador têm 1,2× de poder. Judgment é do tipo Dark.",
	},
	dreamball: {
		shortDesc: "Uma Poke Ball que facilita capturar Pokémon selvagens enquanto estão dormindo.",
		gen7: {
			shortDesc: "Uma Poke Ball especial que aparece do nada na mochila na Entree Forest.",
		},
	},
	dubiousdisc: {
		shortDesc: "Evolui Porygon2 em Porygon-Z quando trocado.",
	},
	durinberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	duskball: {
		shortDesc: "Uma Poke Ball que facilita capturar Pokémon selvagens à noite ou em cavernas.",
	},
	duskstone: {
		desc: "Evolui Murkrow em Honchkrow, Misdreavus em Mismagius, Lampent em Chandelure e Doublade em Aegislash quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	earthplate: {
		shortDesc: "Os ataques do tipo Ground do portador têm 1,2× de poder. Judgment é do tipo Ground.",
	},
	eelektrossite: {
		shortDesc: "Se segurado por Eelektross, este item permite que ele Megaevolua em batalha.",
	},
	eeviumz: {
		shortDesc: "Se segurado por Eevee com Last Resort, pode usar Extreme Evoboost.",
	},
	ejectbutton: {
		shortDesc: "Se sobreviver a um golpe, o portador é trocado por um aliado escolhido. Uso único.",
		end: "  {POKEMON} sai de campo por causa de Eject Button!",
	},
	ejectpack: {
		shortDesc: "Se um estágio de atributo do portador cair, ele troca por aliado escolhido. Uso único.",
		end: "  {POKEMON} sai de campo por causa de Eject Pack!",
	},
	electirizer: {
		shortDesc: "Evolui Electabuzz em Electivire quando trocado.",
	},
	electricgem: {
		shortDesc: "1º ataque do tipo Electric bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Electric bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	electricmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Electric.",
	},
	electricseed: {
		shortDesc: "Sob Electric Terrain, aumenta a Defesa do portador em 1 estágio. Uso único.",
	},
	electriumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Electric, pode usar um Z-Move do tipo Electric.",
	},
	emboarite: {
		shortDesc: "Se segurado por Emboar, este item permite que ele Megaevolua em batalha.",
	},
	enigmaberry: {
		shortDesc: "Cura 1/4 do HP máx. depois que o portador sofre um golpe superefetivo. Uso único.",
		gen3: {
			shortDesc: "Sem uso competitivo.",
		},
	},
	eviolite: {
		shortDesc: "Se a espécie do portador pode evoluir, sua Defesa e sua Sp. Def são 1,5×.",
	},
	excadrite: {
		shortDesc: "Se segurado por Excadrill, este item permite que ele Megaevolua em batalha.",
	},
	expertbelt: {
		shortDesc: "Os ataques do portador superefetivos contra o alvo causam 1,2× de dano.",
	},
	fairiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Fairy, pode usar um Z-Move do tipo Fairy.",
	},
	fairyfeather: {
		shortDesc: "Os ataques do tipo Fairy do portador têm 1,2× de poder.",
	},
	fairygem: {
		shortDesc: "1º ataque do tipo Fairy bem-sucedido do portador tem 1,3× de poder. Uso único.",
	},
	fairymemory: {
		shortDesc: "Multi-Attack do portador é do tipo Fairy.",
	},
	falinksite: {
		shortDesc: "Se segurado por Falinks, este item permite que ele Megaevolua em batalha.",
	},
	fastball: {
		shortDesc: "Uma Poke Ball que facilita capturar Pokémon que costumam fugir rapidamente.",
	},
	feraligite: {
		shortDesc: "Se segurado por Feraligatr, este item permite que ele Megaevolua em batalha.",
	},
	fightinggem: {
		shortDesc: "1º ataque do tipo Fighting bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Fighting bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	fightingmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Fighting.",
	},
	fightiniumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Fighting, pode usar um Z-Move do tipo Fighting.",
	},
	figyberry: {
		shortDesc: "Cura 1/3 do HP máx. com 1/4 do HP ou menos; confunde se natureza -Atk. Uso único.",
		gen7: {
			shortDesc: "Cura 1/2 do HP máx. com 1/4 do HP ou menos; confunde se natureza -Atk. Uso único.",
		},
		gen6: {
			shortDesc: "Cura 1/8 do HP máx. com 1/2 do HP ou menos; confunde se natureza -Atk. Uso único.",
		},
	},
	firegem: {
		shortDesc: "1º ataque do tipo Fire bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Fire bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	firememory: {
		shortDesc: "Multi-Attack do portador é do tipo Fire.",
	},
	firestone: {
		desc: "Evolui Vulpix em Ninetales, Growlithe em Arcanine, Eevee em Flareon e Pansear em Simisear quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	firiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Fire, pode usar um Z-Move do tipo Fire.",
	},
	fistplate: {
		shortDesc: "Ataques do tipo Fighting do portador têm 1,2× de poder. Judgment é do tipo Fighting.",
	},
	flameorb: {
		shortDesc: "No fim de cada turno, este item tenta queimar o portador.",
	},
	flameplate: {
		shortDesc: "Os ataques do tipo Fire do portador têm 1,2× de poder. Judgment é do tipo Fire.",
	},
	floatstone: {
		shortDesc: "O peso do portador cai à metade.",
	},
	floettite: {
		shortDesc: "Se segurado por Eternal Flower Floette, este item permite que ele Megaevolua em batalha.",
	},
	flowersweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	flyinggem: {
		shortDesc: "1º ataque do tipo Flying bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Flying bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	flyingmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Flying.",
	},
	flyiniumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Flying, pode usar um Z-Move do tipo Flying.",
	},
	focusband: {
		shortDesc: "O portador tem 10% de chance de sobreviver com 1 HP a um ataque que o nocautearia.",
		gen2: {
			shortDesc: "O portador tem ~11,7% de chance de sobreviver com 1 HP a um ataque que o nocautearia.",
		},
		activate: "  {POKEMON} aguentou firme com Focus Band!",
	},
	focussash: {
		shortDesc: "Com HP cheio, o portador sobrevive com 1 HP a um ataque que o nocautearia. Uso único.",
		gen4: {
			shortDesc: "Com HP cheio, sobrevive a todos os acertos de um ataque com ao menos 1 HP. Uso único.",
		},
		end: "  {POKEMON} aguentou firme com Focus Sash!",
	},
	fossilizedbird: {
		shortDesc: "Pode reviver como Dracozolt com Fossilized Drake ou Arctozolt com Fossilized Dino.",
	},
	fossilizeddino: {
		shortDesc: "Pode reviver como Arctovish com Fossilized Fish ou Arctozolt com Fossilized Bird.",
	},
	fossilizeddrake: {
		shortDesc: "Pode reviver como Dracozolt com Fossilized Bird ou Dracovish com Fossilized Fish.",
	},
	fossilizedfish: {
		shortDesc: "Pode reviver como Dracovish com Fossilized Drake ou Arctovish com Fossilized Dino.",
	},
	friendball: {
		shortDesc: "Uma Poke Ball que deixa os Pokémon capturados mais amigáveis.",
	},
	froslassite: {
		shortDesc: "Se segurado por Froslass, este item permite que ele Megaevolua em batalha.",
	},
	fullincense: {
		shortDesc: "O portador age por último na sua faixa de prioridade.",
	},
	galaricacuff: {
		shortDesc: "Evolui Galarian Slowpoke em Galarian Slowbro quando usado.",
	},
	galaricawreath: {
		shortDesc: "Evolui Galarian Slowpoke em Galarian Slowking quando usado.",
	},
	galladite: {
		shortDesc: "Se segurado por Gallade, este item permite que ele Megaevolua em batalha.",
	},
	ganlonberry: {
		shortDesc: "Aumenta a Defesa do portador em 1 estágio com 1/4 do HP máx. ou menos. Uso único.",
	},
	garchompite: {
		shortDesc: "Se segurado por Garchomp, este item permite que ele Megaevolua em Mega Garchomp.",
	},
	garchompitez: {
		shortDesc: "Se segurado por Garchomp, este item permite que ele Megaevolua em Mega Garchomp Z.",
	},
	gardevoirite: {
		shortDesc: "Se segurado por Gardevoir, este item permite que ele Megaevolua em batalha.",
	},
	gengarite: {
		shortDesc: "Se segurado por Gengar, este item permite que ele Megaevolua em batalha.",
	},
	ghostgem: {
		shortDesc: "1º ataque do tipo Ghost bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Ghost bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	ghostiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Ghost, pode usar um Z-Move do tipo Ghost.",
	},
	ghostmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Ghost.",
	},
	glalitite: {
		shortDesc: "Se segurado por Glalie, este item permite que ele Megaevolua em batalha.",
	},
	glimmoranite: {
		shortDesc: "Se segurado por Glimmora, este item permite que ele Megaevolua em batalha.",
	},
	goldbottlecap: {
		shortDesc: "Usado no Hyper Training. Todos os atributos de um Pokémon são calculados com IV 31.",
	},
	golisopite: {
		shortDesc: "Se segurado por Golisopod, este item permite que ele Megaevolua em batalha.",
	},
	golurkite: {
		shortDesc: "Se segurado por Golurk, este item permite que ele Megaevolua em batalha.",
	},
	grassgem: {
		shortDesc: "1º ataque do tipo Grass bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Grass bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	grassiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Grass, pode usar um Z-Move do tipo Grass.",
	},
	grassmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Grass.",
	},
	grassyseed: {
		shortDesc: "Sob Grassy Terrain, aumenta a Defesa do portador em 1 estágio. Uso único.",
	},
	greatball: {
		shortDesc: "Uma bola de alto desempenho, com taxa de captura maior que a de uma Poke Ball.",
	},
	greninjite: {
		shortDesc: "Se segurado por Greninja, este item permite que ele Megaevolua em batalha.",
	},
	grepaberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	gripclaw: {
		shortDesc: "Os golpes de aprisionamento parcial do portador sempre duram 7 turnos.",
	},
	griseouscore: {
		shortDesc: "Se segurado por Giratina, seus ataques dos tipos Ghost e Dragon têm 1,2× de poder.",
	},
	griseousorb: {
		shortDesc: "Se segurado por Giratina, seus ataques dos tipos Ghost e Dragon têm 1,2× de poder.",
		gen4: {
			shortDesc: "Só Giratina pode segurá-lo. Seus ataques dos tipos Ghost e Dragon têm 1,2× de poder.",
		},
	},
	groundgem: {
		shortDesc: "1º ataque do tipo Ground bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Ground bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	groundiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Ground, pode usar um Z-Move do tipo Ground.",
	},
	groundmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Ground.",
	},
	gyaradosite: {
		shortDesc: "Se segurado por Gyarados, este item permite que ele Megaevolua em batalha.",
	},
	habanberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Dragon. Uso único.",
	},
	hardstone: {
		shortDesc: "Os ataques do tipo Rock do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Rock do portador têm 1,1× de poder.",
		},
	},
	hawluchanite: {
		shortDesc: "Se segurado por Hawlucha, este item permite que ele Megaevolua em batalha.",
	},
	healball: {
		shortDesc: "Uma Poke Ball curativa que restaura o HP e o status do Pokémon capturado.",
	},
	hearthflamemask: {
		shortDesc: "Ogerpon-Hearthflame: ataques com 1,2× de poder; Terastalizar dá Embody Aspect.",
	},
	heatranite: {
		shortDesc: "Se segurado por Heatran, este item permite que ele Megaevolua em batalha.",
	},
	heatrock: {
		shortDesc: "Sunny Day usado pelo portador dura 8 turnos em vez de 5.",
	},
	heavyball: {
		shortDesc: "Uma Poke Ball para capturar Pokémon muito pesados.",
	},
	heavydutyboots: {
		shortDesc: "Ao entrar em campo, o portador não é afetado pelas armadilhas de campo do seu lado.",
	},
	helixfossil: {
		shortDesc: "Pode ser revivido como Omanyte.",
	},
	heracronite: {
		shortDesc: "Se segurado por Heracross, este item permite que ele Megaevolua em batalha.",
	},
	hondewberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	houndoominite: {
		shortDesc: "Se segurado por Houndoom, este item permite que ele Megaevolua em batalha.",
	},
	iapapaberry: {
		shortDesc: "Cura 1/3 do HP máx. com 1/4 do HP ou menos; confunde se natureza -Def. Uso único.",
		gen7: {
			shortDesc: "Cura 1/2 do HP máx. com 1/4 do HP ou menos; confunde se natureza -Def. Uso único.",
		},
		gen6: {
			shortDesc: "Cura 1/8 do HP máx. com 1/2 do HP ou menos; confunde se natureza -Def. Uso único.",
		},
	},
	icegem: {
		shortDesc: "1º ataque do tipo Ice bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Ice bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	icememory: {
		shortDesc: "Multi-Attack do portador é do tipo Ice.",
	},
	icestone: {
		desc: "Evolui Alolan Sandshrew em Alolan Sandslash, Alolan Vulpix em Alolan Ninetales, Eevee em Glaceon e Galarian Darumaka em Galarian Darmanitan quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
		gen7: {
			desc: "Evolui Alolan Sandshrew em Alolan Sandslash e Alolan Vulpix em Alolan Ninetales quando usado.",
		},
	},
	icicleplate: {
		shortDesc: "Os ataques do tipo Ice do portador têm 1,2× de poder. Judgment é do tipo Ice.",
	},
	iciumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Ice, pode usar um Z-Move do tipo Ice.",
	},
	icyrock: {
		shortDesc: "Snowscape usado pelo portador dura 8 turnos em vez de 5.",
		gen8: {
			shortDesc: "Hail usado pelo portador dura 8 turnos em vez de 5.",
		},
	},
	inciniumz: {
		shortDesc: "Se segurado por Incineroar com Darkest Lariat, pode usar Malicious Moonsault.",
	},
	insectplate: {
		shortDesc: "Os ataques do tipo Bug do portador têm 1,2× de poder. Judgment é do tipo Bug.",
	},
	ironball: {
		shortDesc: "Portador fica no chão, Spe à metade. Se do tipo Flying, dano do tipo Ground é neutro.",
		gen4: {
			shortDesc: "A Velocidade do portador cai à metade e ele fica no chão.",
		},
	},
	ironplate: {
		shortDesc: "Os ataques do tipo Steel do portador têm 1,2× de poder. Judgment é do tipo Steel.",
	},
	jabocaberry: {
		shortDesc: "Se o portador sofrer golpe físico, o atacante perde 1/8 do HP máx. dele. Uso único.",
	},
	jawfossil: {
		shortDesc: "Pode ser revivido como Tyrunt.",
	},
	kangaskhanite: {
		shortDesc: "Se segurado por Kangaskhan, este item permite que ele Megaevolua em batalha.",
	},
	kasibberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Ghost. Uso único.",
	},
	kebiaberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Poison. Uso único.",
	},
	keeberry: {
		shortDesc: "Aumenta a Defesa do portador em 1 estágio após sofrer um ataque físico. Uso único.",
	},
	kelpsyberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	kingsrock: {
		desc: "Os ataques do portador sem chance de fazer o alvo recuar ganham 10% de chance de fazer o alvo recuar. Evolui Poliwhirl em Politoed e Slowpoke em Slowking quando trocado.",
		shortDesc: "Ataques do portador sem chance de fazer recuar ganham 10% de chance de recuo.",
	},
	kommoniumz: {
		shortDesc: "Se segurado por Kommo-o com Clanging Scales, pode usar Clangorous Soulblaze.",
	},
	laggingtail: {
		shortDesc: "O portador age por último na sua faixa de prioridade.",
	},
	lansatberry: {
		shortDesc: "O portador ganha o efeito de Focus Energy com 1/4 do HP máx. ou menos. Uso único.",
	},
	latiasite: {
		shortDesc: "Se segurado por Latias, este item permite que ele Megaevolua em batalha.",
	},
	latiosite: {
		shortDesc: "Se segurado por Latios, este item permite que ele Megaevolua em batalha.",
	},
	laxincense: {
		shortDesc: "A precisão dos ataques contra o portador é 0,9×.",
		gen3: {
			shortDesc: "A precisão dos ataques contra o portador é 0,95×.",
		},
	},
	leafstone: {
		desc: "Evolui Gloom em Vileplume, Weepinbell em Victreebel, Exeggcute em Exeggutor ou Alolan Exeggutor, Eevee em Leafeon, Nuzleaf em Shiftry e Pansage em Simisage quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
		gen7: {
			desc: "Evolui Gloom em Vileplume, Weepinbell em Victreebel, Exeggcute em Exeggutor ou Alolan Exeggutor, Nuzleaf em Shiftry e Pansage em Simisage quando usado.",
		},
	},
	leek: {
		shortDesc: "Se segurado por Farfetch’d ou Sirfetch’d, sua taxa de acerto crítico sobe 2 estágios.",
	},
	leftovers: {
		shortDesc: "No fim de cada turno, o portador recupera 1/16 do HP máx.",
		heal: "  {POKEMON} recuperou um pouco de HP com Leftovers!",
	},
	legendplate: {
		desc: "Quando usado em Arceus em Legends: Arceus, muda-o para o tipo Normal. Quando Arceus usa Judgment, Arceus e o golpe mudam para o tipo mais efetivo contra o alvo.",
		shortDesc: "Em Legends: Arceus, Judgment de Arceus muda de tipo para ser superefetivo.",
	},
	leppaberry: {
		shortDesc: "Recupera 10 PP do primeiro golpe do portador a chegar a 0 PP. Uso único.",
		activate: "  {POKEMON} recuperou PP do golpe {MOVE} com Leppa Berry!",
	},
	levelball: {
		shortDesc: "Uma Poke Ball para capturar Pokémon de nível menor que o do seu.",
	},
	liechiberry: {
		shortDesc: "Aumenta o Ataque do portador em 1 estágio com 1/4 do HP máx. ou menos. Uso único.",
	},
	lifeorb: {
		shortDesc: "Ataques do portador causam 1,3× de dano, e ele perde 1/10 do HP máx. após o ataque.",
		damage: "  {POKEMON} perdeu um pouco de HP!",
	},
	lightball: {
		shortDesc: "Se segurado por Pikachu, seu Ataque e seu Sp. Atk dobram.",
		gen4: {
			shortDesc: "Se segurado por Pikachu, seus ataques têm o poder dobrado.",
		},
		gen3: {
			shortDesc: "Se segurado por Pikachu, seu Ataque Especial dobra.",
		},
	},
	lightclay: {
		shortDesc: "Aurora Veil, Light Screen ou Reflect usados pelo portador duram 8 turnos em vez de 5.",
		gen6: {
			shortDesc: "Light Screen ou Reflect usados pelo portador duram 8 turnos em vez de 5.",
		},
	},
	loadeddice: {
		desc: "Os golpes do portador que normalmente acertam de 2 a 5 vezes passam a acertar 4 ou 5 vezes. Se o primeiro acerto for bem-sucedido, Triple Kick ou Triple Axel usados pelo portador acertam 3 vezes, e Population Bomb acerta de 4 a 10 vezes, aleatoriamente.",
		shortDesc: "Golpes do portador de 2-5 acertos acertam 4-5 vezes; Population Bomb, 4-10 vezes.",
	},
	lopunnite: {
		shortDesc: "Se segurado por Lopunny, este item permite que ele Megaevolua em batalha.",
	},
	loveball: {
		shortDesc: "Poke Ball para capturar Pokémon do gênero oposto ao do seu Pokémon.",
	},
	lovesweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	lucarionite: {
		shortDesc: "Se segurado por Lucario, este item permite que ele Megaevolua em Mega Lucario em batalha.",
	},
	lucarionitez: {
		shortDesc: "Se segurado por Lucario, este item permite que ele Megaevolua em Mega Lucario Z em batalha.",
	},
	luckypunch: {
		shortDesc: "Se segurado por Chansey, sua taxa de acerto crítico sobe 2 estágios.",
		gen2: {
			shortDesc: "Se segurado por Chansey, sua taxa de crítico fica sempre no estágio 2. (25% de crítico)",
		},
	},
	lumberry: {
		shortDesc: "O portador se cura se tiver um status não volátil ou estiver confuso. Uso único.",
	},
	luminousmoss: {
		shortDesc: "Aumenta a Sp. Def do portador em 1 se atingido por ataque do tipo Water. Uso único.",
	},
	lunaliumz: {
		shortDesc: "Lunala ou Dawn Wings Necrozma com Moongeist Beam pode usar um Z-Move especial.",
	},
	lureball: {
		shortDesc: "Uma Poke Ball para capturar Pokémon fisgados com vara durante a pesca.",
	},
	lustrousglobe: {
		shortDesc: "Se segurado por Palkia, seus ataques dos tipos Water e Dragon têm 1,2× de poder.",
	},
	lustrousorb: {
		shortDesc: "Se segurado por Palkia, seus ataques dos tipos Water e Dragon têm 1,2× de poder.",
	},
	luxuryball: {
		shortDesc: "Poke Ball confortável que deixa o Pokémon selvagem capturado amigável depressa.",
	},
	lycaniumz: {
		shortDesc: "Lycanroc (qualquer forma) com Stone Edge pode usar Splintered Stormshards.",
	},
	machobrace: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	magearnite: {
		shortDesc: "Se segurado por Magearna, este item permite que ele Megaevolua em batalha.",
	},
	magmarizer: {
		shortDesc: "Evolui Magmar em Magmortar quando trocado.",
	},
	magnet: {
		shortDesc: "Os ataques do tipo Electric do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Electric do portador têm 1,1× de poder.",
		},
	},
	magoberry: {
		shortDesc: "Cura 1/3 do HP máx. com 1/4 do HP ou menos; confunde se natureza -Spe. Uso único.",
		gen7: {
			shortDesc: "Cura 1/2 do HP máx. com 1/4 do HP ou menos; confunde se natureza -Spe. Uso único.",
		},
		gen6: {
			shortDesc: "Cura 1/8 do HP máx. com 1/2 do HP ou menos; confunde se natureza -Spe. Uso único.",
		},
	},
	magostberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	mail: {
		shortDesc: "Não pode ser dado nem tirado de um Pokémon, exceto por Covet/Knock Off/Thief.",
	},
	malamarite: {
		shortDesc: "Se segurado por Malamar, este item permite que ele Megaevolua em batalha.",
	},
	maliciousarmor: {
		shortDesc: "Evolui Charcadet em Ceruledge quando usado.",
	},
	manectite: {
		shortDesc: "Se segurado por Manectric, este item permite que ele Megaevolua em batalha.",
	},
	marangaberry: {
		shortDesc: "Aumenta a Sp. Def do portador em 1 estágio após sofrer um ataque especial. Uso único.",
	},
	marshadiumz: {
		shortDesc: "Se segurado por Marshadow com Spectral Thief, pode usar Soul-Stealing 7-Star Strike.",
	},
	masterball: {
		shortDesc: "A melhor bola, com desempenho máximo. Captura qualquer Pokémon selvagem.",
	},
	masterpieceteacup: {
		shortDesc: "Evolui Poltchageist-Artisan em Sinistcha-Masterpiece quando usado.",
	},
	mawilite: {
		shortDesc: "Se segurado por Mawile, este item permite que ele Megaevolua em batalha.",
	},
	meadowplate: {
		shortDesc: "Os ataques do tipo Grass do portador têm 1,2× de poder. Judgment é do tipo Grass.",
	},
	medichamite: {
		shortDesc: "Se segurado por Medicham, este item permite que ele Megaevolua em batalha.",
	},
	meganiumite: {
		shortDesc: "Se segurado por Meganium, este item permite que ele Megaevolua em batalha.",
	},
	mentalherb: {
		shortDesc: "Cura o portador de Attract, Disable, Encore, Heal Block, Taunt e Torment. Uso único.",
		gen4: {
			shortDesc: "O portador é curado se estiver apaixonado. Uso único.",
		},
	},
	meowsticite: {
		shortDesc: "Se segurado por Meowstic, este item permite que ele Megaevolua em batalha.",
	},
	metagrossite: {
		shortDesc: "Se segurado por Metagross, este item permite que ele Megaevolua em batalha.",
	},
	metalalloy: {
		shortDesc: "Evolui Duraludon em Archaludon quando usado.",
	},
	metalcoat: {
		desc: "Os ataques do tipo Steel do portador têm 1,2× de poder. Evolui Onix em Steelix e Scyther em Scizor quando trocado.",
		shortDesc: "Os ataques do tipo Steel do portador têm 1,2× de poder.",
		gen3: {
			desc: "Os ataques do tipo Steel do portador têm 1,1× de poder. Evolui Onix em Steelix e Scyther em Scizor quando trocado.",
			shortDesc: "Os ataques do tipo Steel do portador têm 1,1× de poder.",
		},
	},
	metalpowder: {
		shortDesc: "Se segurado por Ditto que não usou Transform, sua Defesa dobra.",
		gen2: {
			shortDesc: "Se segurado por Ditto, sua Defesa e sua Sp. Def são 1,5×, mesmo transformado.",
		},
	},
	metronome: {
		shortDesc: "O dano de golpes usados em turnos seguidos aumenta. Máximo de 2× após 5 turnos.",
		gen4: {
			shortDesc: "O dano de golpes usados em turnos seguidos aumenta. Máximo de 2× após 10 turnos.",
		},
	},
	mewniumz: {
		shortDesc: "Se segurado por Mew com Psychic, pode usar Genesis Supernova.",
	},
	mewtwonitex: {
		shortDesc: "Se segurado por Mewtwo, este item permite que ele Megaevolua em Mega Mewtwo X em batalha.",
	},
	mewtwonitey: {
		shortDesc: "Se segurado por Mewtwo, este item permite que ele Megaevolua em Mega Mewtwo Y em batalha.",
	},
	micleberry: {
		shortDesc: "Com 1/4 do HP máx. ou menos, o próximo golpe tem 1,2× de precisão. Uso único.",
	},
	mimikiumz: {
		shortDesc: "Se segurado por Mimikyu com Play Rough, pode usar Let's Snuggle Forever.",
	},
	mindplate: {
		shortDesc: "Os ataques do tipo Psychic do portador têm 1,2× de poder. Judgment é do tipo Psychic.",
	},
	miracleseed: {
		shortDesc: "Os ataques do tipo Grass do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Grass do portador têm 1,1× de poder.",
		},
	},
	mirrorherb: {
		shortDesc: "Quando um oponente aumenta um estágio de atributo, o portador o copia. Uso único.",
		activate: "  {POKEMON} usou Mirror Herb para copiar as mudanças de atributos do oponente!",
	},
	mistyseed: {
		shortDesc: "Sob Misty Terrain, aumenta a Sp. Def do portador em 1 estágio. Uso único.",
	},
	moonball: {
		shortDesc: "Uma Poke Ball para capturar Pokémon que evoluem com Moon Stone.",
	},
	moonstone: {
		desc: "Evolui Nidorina em Nidoqueen, Nidorino em Nidoking, Clefairy em Clefable, Jigglypuff em Wigglytuff, Skitty em Delcatty e Munna em Musharna quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	muscleband: {
		shortDesc: "Os ataques físicos do portador têm 1,1× de poder.",
	},
	mysticwater: {
		shortDesc: "Os ataques do tipo Water do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Water do portador têm 1,1× de poder.",
		},
	},
	nanabberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	nestball: {
		shortDesc: "Uma Poke Ball que funciona especialmente bem em Pokémon selvagens mais fracos.",
	},
	netball: {
		shortDesc: "Uma Poke Ball que funciona especialmente bem em Pokémon dos tipos Water e Bug.",
	},
	nevermeltice: {
		shortDesc: "Os ataques do tipo Ice do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Ice do portador têm 1,1× de poder.",
		},
	},
	nomelberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	normalgem: {
		shortDesc: "1º ataque do tipo Normal bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Normal bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	normaliumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Normal, pode usar um Z-Move do tipo Normal.",
	},
	occaberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Fire. Uso único.",
	},
	oddincense: {
		shortDesc: "Os ataques do tipo Psychic do portador têm 1,2× de poder.",
	},
	oldamber: {
		shortDesc: "Pode ser revivido como Aerodactyl.",
	},
	oranberry: {
		shortDesc: "Recupera 10 HP com 1/2 do HP máx. ou menos. Uso único.",
	},
	ovalstone: {
		shortDesc: "Evolui Happiny em Chansey quando segurado ao subir de nível durante o dia.",
	},
	pamtreberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	parkball: {
		shortDesc: "Uma Poke Ball especial para o Pal Park.",
	},
	passhoberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Water. Uso único.",
	},
	payapaberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Psychic. Uso único.",
	},
	peatblock: {
		shortDesc: "Evolui Ursaring em Ursaluna quando usado durante a lua cheia.",
	},
	pechaberry: {
		shortDesc: "O portador é curado se estiver envenenado. Uso único.",
	},
	persimberry: {
		shortDesc: "O portador é curado se estiver confuso. Uso único.",
	},
	petayaberry: {
		shortDesc: "Aumenta o Sp. Atk do portador em 1 estágio com 1/4 do HP máx. ou menos. Uso único.",
	},
	pidgeotite: {
		shortDesc: "Se segurado por Pidgeot, este item permite que ele Megaevolua em batalha.",
	},
	pikaniumz: {
		shortDesc: "Se segurado por Pikachu com Volt Tackle, pode usar Catastropika.",
	},
	pikashuniumz: {
		shortDesc: "Pikachu de boné com Thunderbolt pode usar 10,000,000 Volt Thunderbolt.",
	},
	pinapberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	pinsirite: {
		shortDesc: "Se segurado por Pinsir, este item permite que ele Megaevolua em batalha.",
	},
	pixieplate: {
		shortDesc: "Os ataques do tipo Fairy do portador têm 1,2× de poder. Judgment é do tipo Fairy.",
	},
	plumefossil: {
		shortDesc: "Pode ser revivido como Archen.",
	},
	poisonbarb: {
		shortDesc: "Os ataques do tipo Poison do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Poison do portador têm 1,1× de poder.",
		},
	},
	poisongem: {
		shortDesc: "1º ataque do tipo Poison bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Poison bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	poisoniumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Poison, pode usar um Z-Move do tipo Poison.",
	},
	poisonmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Poison.",
	},
	pokeball: {
		shortDesc: "Um dispositivo para capturar Pokémon selvagens, projetado como um sistema de cápsula.",
	},
	pomegberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	poweranklet: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	powerband: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	powerbelt: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	powerbracer: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	powerherb: {
		shortDesc: "Golpes de dois turnos do portador levam um turno (exceto Sky Drop). Uso único.",
		end: "  {POKEMON} ficou totalmente carregado graças a Power Herb!",
	},
	powerlens: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	powerweight: {
		shortDesc: "A Velocidade do portador cai à metade. A habilidade Klutz não ignora este efeito.",
	},
	premierball: {
		shortDesc: "Uma Poke Ball rara, criada para comemorar um evento.",
	},
	prettyfeather: {
		shortDesc: "Embora seja bonita, esta pena é comum e não tem nenhum efeito.",
	},
	primariumz: {
		shortDesc: "Se segurado por Primarina com Sparkling Aria, pode usar Oceanic Operetta.",
	},
	prismscale: {
		shortDesc: "Evolui Feebas em Milotic quando trocado.",
	},
	protectivepads: {
		shortDesc: "Golpes do portador são protegidos de efeitos adversos de contato, exceto Pickpocket.",
		block: "  {POKEMON} se protegeu com Protective Pads!",
	},
	protector: {
		shortDesc: "Evolui Rhydon em Rhyperior quando trocado.",
	},
	psychicgem: {
		shortDesc: "1º ataque do tipo Psychic bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Psychic bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	psychicmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Psychic.",
	},
	psychicseed: {
		shortDesc: "Sob Psychic Terrain, aumenta a Sp. Def do portador em 1 estágio. Uso único.",
	},
	psychiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Psychic, pode usar um Z-Move do tipo Psychic.",
	},
	punchingglove: {
		shortDesc: "Os ataques de soco do portador têm 1,1× de poder e não fazem contato.",
	},
	pyroarite: {
		shortDesc: "Se segurado por Pyroar, este item permite que ele Megaevolua em batalha.",
	},
	qualotberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	quickball: {
		shortDesc: "Uma Poke Ball com taxa de captura melhor no início de um encontro selvagem.",
	},
	quickclaw: {
		shortDesc: "A cada turno, tem 20% de chance de agir primeiro na sua faixa de prioridade.",
		gen2: {
			shortDesc: "A cada turno, tem ~23,4% de chance de agir primeiro na sua faixa de prioridade.",
		},
		activate: "  {POKEMON} pode agir mais rápido que o normal graças a Quick Claw!",
	},
	quickpowder: {
		shortDesc: "Se segurado por Ditto que não usou Transform, sua Velocidade dobra.",
	},
	rabutaberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	raichunitex: {
		shortDesc: "Se segurado por Raichu, este item permite que ele Megaevolua em Mega Raichu X em batalha.",
	},
	raichunitey: {
		shortDesc: "Se segurado por Raichu, este item permite que ele Megaevolua em Mega Raichu Y em batalha.",
	},
	rarebone: {
		shortDesc: "Sem uso competitivo, exceto quando usado com Fling.",
	},
	rawstberry: {
		shortDesc: "O portador é curado se estiver queimado. Uso único.",
	},
	razorclaw: {
		desc: "A taxa de acerto crítico do portador sobe 1 estágio. Evolui Sneasel em Weavile quando segurado ao subir de nível durante a noite.",
		shortDesc: "A taxa de acerto crítico do portador sobe 1 estágio.",
	},
	razorfang: {
		desc: "Os ataques do portador sem chance de fazer o alvo recuar ganham 10% de chance de fazer o alvo recuar. Evolui Gligar em Gliscor quando segurado ao subir de nível durante a noite.",
		shortDesc: "Ataques do portador sem chance de fazer recuar ganham 10% de chance de recuo.",
	},
	razzberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	reapercloth: {
		shortDesc: "Evolui Dusclops em Dusknoir quando trocado.",
	},
	redcard: {
		shortDesc: "Se sobreviver a um golpe, força o atacante a trocar por um aliado aleatório. Uso único.",
		end: "  {POKEMON} mostrou Red Card para {TARGET}!",
	},
	redorb: {
		shortDesc: "Se segurado por Groudon, este item ativa sua Primal Reversion em batalha.",
	},
	repeatball: {
		shortDesc: "Uma Poke Ball que funciona bem em espécies de Pokémon já capturadas antes.",
	},
	ribbonsweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	rindoberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Grass. Uso único.",
	},
	ringtarget: {
		shortDesc: "As imunidades de tipo do portador concedidas apenas pelos seus tipos são anuladas.",
	},
	rockgem: {
		shortDesc: "1º ataque do tipo Rock bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Rock bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	rockincense: {
		shortDesc: "Os ataques do tipo Rock do portador têm 1,2× de poder.",
	},
	rockiumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Rock, pode usar um Z-Move do tipo Rock.",
	},
	rockmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Rock.",
	},
	rockyhelmet: {
		shortDesc: "Se o portador sofrer golpe de contato, o atacante perde 1/6 do HP máx. dele.",
		damage: "  {POKEMON} foi ferido por Rocky Helmet!",
	},
	roomservice: {
		shortDesc: "Sob Trick Room, a Velocidade do portador diminui 1 estágio. Uso único.",
	},
	rootfossil: {
		shortDesc: "Pode ser revivido como Lileep.",
	},
	roseincense: {
		shortDesc: "Os ataques do tipo Grass do portador têm 1,2× de poder.",
	},
	roseliberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Fairy. Uso único.",
	},
	rowapberry: {
		shortDesc: "Se o portador sofrer golpe especial, o atacante perde 1/8 do HP máx. dele. Uso único.",
	},
	rustedshield: {
		shortDesc: "Se segurado por Zamazenta, este item muda sua forma para Crowned Shield.",
	},
	rustedsword: {
		shortDesc: "Se segurado por Zacian, este item muda sua forma para Crowned Sword.",
	},
	sablenite: {
		shortDesc: "Se segurado por Sableye, este item permite que ele Megaevolua em batalha.",
	},
	sachet: {
		shortDesc: "Evolui Spritzee em Aromatisse quando trocado.",
	},
	safariball: {
		shortDesc: "Uma Poke Ball especial usada apenas na Safari Zone e no Great Marsh.",
	},
	safetygoggles: {
		shortDesc: "O portador é imune a golpes de pó e ao dano de tempestade de areia ou granizo.",
		block: "  {POKEMON} não é afetado por {MOVE} graças a Safety Goggles!",
	},
	sailfossil: {
		shortDesc: "Pode ser revivido como Amaura.",
	},
	salacberry: {
		shortDesc: "Aumenta a Velocidade do portador em 1 estágio com 1/4 do HP máx. ou menos. Uso único.",
	},
	salamencite: {
		shortDesc: "Se segurado por Salamence, este item permite que ele Megaevolua em batalha.",
	},
	sceptilite: {
		shortDesc: "Se segurado por Sceptile, este item permite que ele Megaevolua em batalha.",
	},
	scizorite: {
		shortDesc: "Se segurado por Scizor, este item permite que ele Megaevolua em batalha.",
	},
	scolipite: {
		shortDesc: "Se segurado por Scolipede, este item permite que ele Megaevolua em batalha.",
	},
	scopelens: {
		shortDesc: "A taxa de acerto crítico do portador sobe 1 estágio.",
	},
	scovillainite: {
		shortDesc: "Se segurado por Scovillain, este item permite que ele Megaevolua em batalha.",
	},
	scraftinite: {
		shortDesc: "Se segurado por Scrafty, este item permite que ele Megaevolua em batalha.",
	},
	seaincense: {
		shortDesc: "Os ataques do tipo Water do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Water do portador têm 1,05× de poder.",
		},
	},
	sharpbeak: {
		shortDesc: "Os ataques do tipo Flying do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Flying do portador têm 1,1× de poder.",
		},
	},
	sharpedonite: {
		shortDesc: "Se segurado por Sharpedo, este item permite que ele Megaevolua em batalha.",
	},
	shedshell: {
		shortDesc: "O portador não pode ser impedido de escolher sair de campo por nenhum efeito.",
	},
	shellbell: {
		shortDesc: "Após um ataque, o portador recupera em HP 1/8 do dano causado a outros Pokémon.",
		heal: "  {POKEMON} recuperou um pouco de HP com Shell Bell!",
	},
	shinystone: {
		desc: "Evolui Togetic em Togekiss, Roselia em Roserade, Minccino em Cinccino e Floette em Florges quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	shockdrive: {
		shortDesc: "Techno Blast do portador é do tipo Electric.",
	},
	shucaberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Ground. Uso único.",
	},
	silkscarf: {
		shortDesc: "Os ataques do tipo Normal do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Normal do portador têm 1,1× de poder.",
		},
	},
	silverpowder: {
		shortDesc: "Os ataques do tipo Bug do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Bug do portador têm 1,1× de poder.",
		},
	},
	sitrusberry: {
		shortDesc: "Recupera 1/4 do HP máx. com 1/2 do HP máx. ou menos. Uso único.",
		gen3: {
			shortDesc: "Recupera 30 HP com 1/2 do HP máx. ou menos. Uso único.",
		},
	},
	skarmorite: {
		shortDesc: "Se segurado por Skarmory, este item permite que ele Megaevolua em batalha.",
	},
	skullfossil: {
		shortDesc: "Pode ser revivido como Cranidos.",
	},
	skyplate: {
		shortDesc: "Os ataques do tipo Flying do portador têm 1,2× de poder. Judgment é do tipo Flying.",
	},
	slowbronite: {
		shortDesc: "Se segurado por Slowbro, este item permite que ele Megaevolua em batalha.",
		champions: {
			shortDesc: "Se segurado por Slowbro (exceto Galarian Slowbro), permite que ele Megaevolua.",
		},
	},
	smoothrock: {
		shortDesc: "Sandstorm usado pelo portador dura 8 turnos em vez de 5.",
	},
	snorliumz: {
		shortDesc: "Se segurado por Snorlax com Giga Impact, pode usar Pulverizing Pancake.",
	},
	snowball: {
		shortDesc: "Aumenta o Ataque do portador em 1 se atingido por ataque do tipo Ice. Uso único.",
	},
	softsand: {
		shortDesc: "Os ataques do tipo Ground do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Ground do portador têm 1,1× de poder.",
		},
	},
	solganiumz: {
		shortDesc: "Solgaleo ou Dusk Mane Necrozma com Sunsteel Strike pode usar um Z-Move especial.",
	},
	souldew: {
		shortDesc: "Se segurado por Latias/Latios, golpes dos tipos Dragon/Psychic têm 1,2× de poder.",
		gen6: {
			shortDesc: "Se segurado por Latias ou Latios, seu Sp. Atk e sua Sp. Def são 1,5×.",
		},
	},
	spelltag: {
		shortDesc: "Os ataques do tipo Ghost do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Os ataques do tipo Ghost do portador têm 1,1× de poder.",
		},
	},
	spelonberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	splashplate: {
		shortDesc: "Os ataques do tipo Water do portador têm 1,2× de poder. Judgment é do tipo Water.",
	},
	spookyplate: {
		shortDesc: "Os ataques do tipo Ghost do portador têm 1,2× de poder. Judgment é do tipo Ghost.",
	},
	sportball: {
		shortDesc: "Uma Poke Ball especial para o Bug-Catching Contest.",
	},
	staraptite: {
		shortDesc: "Se segurado por Staraptor, este item permite que ele Megaevolua em batalha.",
	},
	starfberry: {
		shortDesc: "Sobe um atributo aleatório em 2 com 1/4 do HP máx. ou menos (não acc/eva). Uso único.",
	},
	starminite: {
		shortDesc: "Se segurado por Starmie, este item permite que ele Megaevolua em batalha.",
	},
	starsweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	steelgem: {
		shortDesc: "1º ataque do tipo Steel bem-sucedido do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "1º ataque do tipo Steel bem-sucedido do portador tem 1,5× de poder. Uso único.",
		},
	},
	steeliumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Steel, pode usar um Z-Move do tipo Steel.",
	},
	steelixite: {
		shortDesc: "Se segurado por Steelix, este item permite que ele Megaevolua em batalha.",
	},
	steelmemory: {
		shortDesc: "Multi-Attack do portador é do tipo Steel.",
	},
	stick: {
		shortDesc: "Se segurado por Farfetch’d, sua taxa de acerto crítico sobe 2 estágios.",
		gen2: {
			shortDesc: "Se segurado por Farfetch’d, sua taxa de crítico fica sempre no estágio 2. (25% de crítico)",
		},
	},
	stickybarb: {
		shortDesc: "A cada turno, o portador perde 1/8 do HP máx. Quem fizer contato pode recebê-lo.",
	},
	stoneplate: {
		shortDesc: "Os ataques do tipo Rock do portador têm 1,2× de poder. Judgment é do tipo Rock.",
	},
	strangeball: {
		shortDesc: "Substituta para Pokémon capturado em Poke Ball inexistente no jogo atual.",
	},
	strawberrysweet: {
		shortDesc: "Evolui Milcery em Alcremie quando ele o segura e gira.",
	},
	sunstone: {
		desc: "Evolui Gloom em Bellossom, Sunkern em Sunflora, Cottonee em Whimsicott, Petilil em Lilligant e Helioptile em Heliolisk quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	swampertite: {
		shortDesc: "Se segurado por Swampert, este item permite que ele Megaevolua em batalha.",
	},
	sweetapple: {
		shortDesc: "Evolui Applin em Appletun quando usado.",
	},
	syrupyapple: {
		shortDesc: "Evolui Applin em Dipplin quando usado.",
	},
	tamatoberry: {
		shortDesc: "Não pode ser comida pelo portador. Sem efeito quando comida via Bug Bite ou Pluck.",
	},
	tangaberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Bug. Uso único.",
	},
	tapuniumz: {
		shortDesc: "Se segurado por um Tapu com Nature's Madness, pode usar Guardian of Alola.",
	},
	tartapple: {
		shortDesc: "Evolui Applin em Flapple quando usado.",
	},
	tatsugirinite: {
		shortDesc: "Se segurado por Tatsugiri, este item permite que ele Megaevolua em batalha.",
	},
	terrainextender: {
		shortDesc: "Electric/Grassy/Misty/Psychic Terrain usado pelo portador dura 8 turnos em vez de 5.",
	},
	thickclub: {
		shortDesc: "Se segurado por Cubone ou Marowak, seu Ataque dobra.",
	},
	throatspray: {
		shortDesc: "Aumenta o Sp. Atk do portador em 1 estágio após usar um golpe sonoro. Uso único.",
	},
	thunderstone: {
		desc: "Evolui Pikachu em Raichu ou Alolan Raichu, Eevee em Jolteon, Eelektrik em Eelektross e Charjabug em Vikavolt quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
		gen7: {
			desc: "Evolui Pikachu em Raichu ou Alolan Raichu, Eevee em Jolteon e Eelektrik em Eelektross quando usado.",
		},
	},
	timerball: {
		shortDesc: "Uma Poke Ball que fica melhor quanto mais turnos a batalha tiver.",
	},
	toxicorb: {
		shortDesc: "No fim de cada turno, este item tenta envenenar gravemente o portador.",
	},
	toxicplate: {
		shortDesc: "Os ataques do tipo Poison do portador têm 1,2× de poder. Judgment é do tipo Poison.",
	},
	tr00: {
		shortDesc: "Ensina o golpe Swords Dance a certos Pokémon. Uso único.",
	},
	tr01: {
		shortDesc: "Ensina o golpe Body Slam a certos Pokémon. Uso único.",
	},
	tr02: {
		shortDesc: "Ensina o golpe Flamethrower a certos Pokémon. Uso único.",
	},
	tr03: {
		shortDesc: "Ensina o golpe Hydro Pump a certos Pokémon. Uso único.",
	},
	tr04: {
		shortDesc: "Ensina o golpe Surf a certos Pokémon. Uso único.",
	},
	tr05: {
		shortDesc: "Ensina o golpe Ice Beam a certos Pokémon. Uso único.",
	},
	tr06: {
		shortDesc: "Ensina o golpe Blizzard a certos Pokémon. Uso único.",
	},
	tr07: {
		shortDesc: "Ensina o golpe Low Kick a certos Pokémon. Uso único.",
	},
	tr08: {
		shortDesc: "Ensina o golpe Thunderbolt a certos Pokémon. Uso único.",
	},
	tr09: {
		shortDesc: "Ensina o golpe Thunder a certos Pokémon. Uso único.",
	},
	tr10: {
		shortDesc: "Ensina o golpe Earthquake a certos Pokémon. Uso único.",
	},
	tr11: {
		shortDesc: "Ensina o golpe Psychic a certos Pokémon. Uso único.",
	},
	tr12: {
		shortDesc: "Ensina o golpe Agility a certos Pokémon. Uso único.",
	},
	tr13: {
		shortDesc: "Ensina o golpe Focus Energy a certos Pokémon. Uso único.",
	},
	tr14: {
		shortDesc: "Ensina o golpe Metronome a certos Pokémon. Uso único.",
	},
	tr15: {
		shortDesc: "Ensina o golpe Fire Blast a certos Pokémon. Uso único.",
	},
	tr16: {
		shortDesc: "Ensina o golpe Waterfall a certos Pokémon. Uso único.",
	},
	tr17: {
		shortDesc: "Ensina o golpe Amnesia a certos Pokémon. Uso único.",
	},
	tr18: {
		shortDesc: "Ensina o golpe Leech Life a certos Pokémon. Uso único.",
	},
	tr19: {
		shortDesc: "Ensina o golpe Tri Attack a certos Pokémon. Uso único.",
	},
	tr20: {
		shortDesc: "Ensina o golpe Substitute a certos Pokémon. Uso único.",
	},
	tr21: {
		shortDesc: "Ensina o golpe Reversal a certos Pokémon. Uso único.",
	},
	tr22: {
		shortDesc: "Ensina o golpe Sludge Bomb a certos Pokémon. Uso único.",
	},
	tr23: {
		shortDesc: "Ensina o golpe Spikes a certos Pokémon. Uso único.",
	},
	tr24: {
		shortDesc: "Ensina o golpe Outrage a certos Pokémon. Uso único.",
	},
	tr25: {
		shortDesc: "Ensina o golpe Psyshock a certos Pokémon. Uso único.",
	},
	tr26: {
		shortDesc: "Ensina o golpe Endure a certos Pokémon. Uso único.",
	},
	tr27: {
		shortDesc: "Ensina o golpe Sleep Talk a certos Pokémon. Uso único.",
	},
	tr28: {
		shortDesc: "Ensina o golpe Megahorn a certos Pokémon. Uso único.",
	},
	tr29: {
		shortDesc: "Ensina o golpe Baton Pass a certos Pokémon. Uso único.",
	},
	tr30: {
		shortDesc: "Ensina o golpe Encore a certos Pokémon. Uso único.",
	},
	tr31: {
		shortDesc: "Ensina o golpe Iron Tail a certos Pokémon. Uso único.",
	},
	tr32: {
		shortDesc: "Ensina o golpe Crunch a certos Pokémon. Uso único.",
	},
	tr33: {
		shortDesc: "Ensina o golpe Shadow Ball a certos Pokémon. Uso único.",
	},
	tr34: {
		shortDesc: "Ensina o golpe Future Sight a certos Pokémon. Uso único.",
	},
	tr35: {
		shortDesc: "Ensina o golpe Uproar a certos Pokémon. Uso único.",
	},
	tr36: {
		shortDesc: "Ensina o golpe Heat Wave a certos Pokémon. Uso único.",
	},
	tr37: {
		shortDesc: "Ensina o golpe Taunt a certos Pokémon. Uso único.",
	},
	tr38: {
		shortDesc: "Ensina o golpe Trick a certos Pokémon. Uso único.",
	},
	tr39: {
		shortDesc: "Ensina o golpe Superpower a certos Pokémon. Uso único.",
	},
	tr40: {
		shortDesc: "Ensina o golpe Skill Swap a certos Pokémon. Uso único.",
	},
	tr41: {
		shortDesc: "Ensina o golpe Blaze Kick a certos Pokémon. Uso único.",
	},
	tr42: {
		shortDesc: "Ensina o golpe Hyper Voice a certos Pokémon. Uso único.",
	},
	tr43: {
		shortDesc: "Ensina o golpe Overheat a certos Pokémon. Uso único.",
	},
	tr44: {
		shortDesc: "Ensina o golpe Cosmic Power a certos Pokémon. Uso único.",
	},
	tr45: {
		shortDesc: "Ensina o golpe Muddy Water a certos Pokémon. Uso único.",
	},
	tr46: {
		shortDesc: "Ensina o golpe Iron Defense a certos Pokémon. Uso único.",
	},
	tr47: {
		shortDesc: "Ensina o golpe Dragon Claw a certos Pokémon. Uso único.",
	},
	tr48: {
		shortDesc: "Ensina o golpe Bulk Up a certos Pokémon. Uso único.",
	},
	tr49: {
		shortDesc: "Ensina o golpe Calm Mind a certos Pokémon. Uso único.",
	},
	tr50: {
		shortDesc: "Ensina o golpe Leaf Blade a certos Pokémon. Uso único.",
	},
	tr51: {
		shortDesc: "Ensina o golpe Dragon Dance a certos Pokémon. Uso único.",
	},
	tr52: {
		shortDesc: "Ensina o golpe Gyro Ball a certos Pokémon. Uso único.",
	},
	tr53: {
		shortDesc: "Ensina o golpe Close Combat a certos Pokémon. Uso único.",
	},
	tr54: {
		shortDesc: "Ensina o golpe Toxic Spikes a certos Pokémon. Uso único.",
	},
	tr55: {
		shortDesc: "Ensina o golpe Flare Blitz a certos Pokémon. Uso único.",
	},
	tr56: {
		shortDesc: "Ensina o golpe Aura Sphere a certos Pokémon. Uso único.",
	},
	tr57: {
		shortDesc: "Ensina o golpe Poison Jab a certos Pokémon. Uso único.",
	},
	tr58: {
		shortDesc: "Ensina o golpe Dark Pulse a certos Pokémon. Uso único.",
	},
	tr59: {
		shortDesc: "Ensina o golpe Seed Bomb a certos Pokémon. Uso único.",
	},
	tr60: {
		shortDesc: "Ensina o golpe X-Scissor a certos Pokémon. Uso único.",
	},
	tr61: {
		shortDesc: "Ensina o golpe Bug Buzz a certos Pokémon. Uso único.",
	},
	tr62: {
		shortDesc: "Ensina o golpe Dragon Pulse a certos Pokémon. Uso único.",
	},
	tr63: {
		shortDesc: "Ensina o golpe Power Gem a certos Pokémon. Uso único.",
	},
	tr64: {
		shortDesc: "Ensina o golpe Focus Blast a certos Pokémon. Uso único.",
	},
	tr65: {
		shortDesc: "Ensina o golpe Energy Ball a certos Pokémon. Uso único.",
	},
	tr66: {
		shortDesc: "Ensina o golpe Brave Bird a certos Pokémon. Uso único.",
	},
	tr67: {
		shortDesc: "Ensina o golpe Earth Power a certos Pokémon. Uso único.",
	},
	tr68: {
		shortDesc: "Ensina o golpe Nasty Plot a certos Pokémon. Uso único.",
	},
	tr69: {
		shortDesc: "Ensina o golpe Zen Headbutt a certos Pokémon. Uso único.",
	},
	tr70: {
		shortDesc: "Ensina o golpe Flash Cannon a certos Pokémon. Uso único.",
	},
	tr71: {
		shortDesc: "Ensina o golpe Leaf Storm a certos Pokémon. Uso único.",
	},
	tr72: {
		shortDesc: "Ensina o golpe Power Whip a certos Pokémon. Uso único.",
	},
	tr73: {
		shortDesc: "Ensina o golpe Gunk Shot a certos Pokémon. Uso único.",
	},
	tr74: {
		shortDesc: "Ensina o golpe Iron Head a certos Pokémon. Uso único.",
	},
	tr75: {
		shortDesc: "Ensina o golpe Stone Edge a certos Pokémon. Uso único.",
	},
	tr76: {
		shortDesc: "Ensina o golpe Stealth Rock a certos Pokémon. Uso único.",
	},
	tr77: {
		shortDesc: "Ensina o golpe Grass Knot a certos Pokémon. Uso único.",
	},
	tr78: {
		shortDesc: "Ensina o golpe Sludge Wave a certos Pokémon. Uso único.",
	},
	tr79: {
		shortDesc: "Ensina o golpe Heavy Slam a certos Pokémon. Uso único.",
	},
	tr80: {
		shortDesc: "Ensina o golpe Electro Ball a certos Pokémon. Uso único.",
	},
	tr81: {
		shortDesc: "Ensina o golpe Foul Play a certos Pokémon. Uso único.",
	},
	tr82: {
		shortDesc: "Ensina o golpe Stored Power a certos Pokémon. Uso único.",
	},
	tr83: {
		shortDesc: "Ensina o golpe Ally Switch a certos Pokémon. Uso único.",
	},
	tr84: {
		shortDesc: "Ensina o golpe Scald a certos Pokémon. Uso único.",
	},
	tr85: {
		shortDesc: "Ensina o golpe Work Up a certos Pokémon. Uso único.",
	},
	tr86: {
		shortDesc: "Ensina o golpe Wild Charge a certos Pokémon. Uso único.",
	},
	tr87: {
		shortDesc: "Ensina o golpe Drill Run a certos Pokémon. Uso único.",
	},
	tr88: {
		shortDesc: "Ensina o golpe Heat Crash a certos Pokémon. Uso único.",
	},
	tr89: {
		shortDesc: "Ensina o golpe Hurricane a certos Pokémon. Uso único.",
	},
	tr90: {
		shortDesc: "Ensina o golpe Play Rough a certos Pokémon. Uso único.",
	},
	tr91: {
		shortDesc: "Ensina o golpe Venom Drench a certos Pokémon. Uso único.",
	},
	tr92: {
		shortDesc: "Ensina o golpe Dazzling Gleam a certos Pokémon. Uso único.",
	},
	tr93: {
		shortDesc: "Ensina o golpe Darkest Lariat a certos Pokémon. Uso único.",
	},
	tr94: {
		shortDesc: "Ensina o golpe High Horsepower a certos Pokémon. Uso único.",
	},
	tr95: {
		shortDesc: "Ensina o golpe Throat Chop a certos Pokémon. Uso único.",
	},
	tr96: {
		shortDesc: "Ensina o golpe Pollen Puff a certos Pokémon. Uso único.",
	},
	tr97: {
		shortDesc: "Ensina o golpe Psychic Fangs a certos Pokémon. Uso único.",
	},
	tr98: {
		shortDesc: "Ensina o golpe Liquidation a certos Pokémon. Uso único.",
	},
	tr99: {
		shortDesc: "Ensina o golpe Body Press a certos Pokémon. Uso único.",
	},
	twistedspoon: {
		shortDesc: "Ataques do tipo Psychic do portador têm 1,2× de poder.",
		gen3: {
			shortDesc: "Ataques do tipo Psychic do portador têm 1,1× de poder.",
		},
	},
	tyranitarite: {
		shortDesc: "Se segurado por Tyranitar, este item permite que ele Megaevolua em batalha.",
	},
	ultraball: {
		shortDesc: "Uma Ball de altíssimo desempenho, com taxa de captura maior que a da Great Ball.",
	},
	ultranecroziumz: {
		shortDesc: "Necrozma Dusk Mane/Dawn Wings: Ultra Burst e depois Z-Move com Photon Geyser.",
		transform: "  Uma luz intensa está prestes a irromper de {POKEMON}!",
		activate: "{POKEMON} recuperou seu verdadeiro poder com o Ultra Burst!",
	},
	unremarkableteacup: {
		shortDesc: "Evolui Poltchageist em Sinistcha quando usado.",
	},
	upgrade: {
		shortDesc: "Evolui Porygon em Porygon2 quando trocado.",
	},
	utilityumbrella: {
		desc: "O portador ignora efeitos baseados em chuva e sol, inclusive os da sua habilidade, a menos que ela seja Orichalcum Pulse ou Protosynthesis. Os cálculos de dano e precisão dos ataques usados pelo portador são afetados por chuva e sol, mas os dos ataques usados contra o portador não.",
		shortDesc: "O portador ignora efeitos baseados em chuva e sol.",
		gen8: {
			desc: "O portador ignora efeitos baseados em chuva e sol, inclusive os da sua habilidade. Os cálculos de dano e precisão dos ataques usados pelo portador são afetados por chuva e sol, mas os dos ataques usados contra o portador não.",
		},
	},
	venusaurite: {
		shortDesc: "Se segurado por Venusaur, este item permite que ele Megaevolua em batalha.",
	},
	victreebelite: {
		shortDesc: "Se segurado por Victreebel, este item permite que ele Megaevolua em batalha.",
	},
	wacanberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Electric. Uso único.",
	},
	watergem: {
		shortDesc: "O 1º ataque bem-sucedido do tipo Water do portador tem 1,3× de poder. Uso único.",
		gen5: {
			shortDesc: "O 1º ataque bem-sucedido do tipo Water do portador tem 1,5× de poder. Uso único.",
		},
	},
	wateriumz: {
		shortDesc: "Se o portador tiver um golpe do tipo Water, pode usar um Z-Move do tipo Water.",
	},
	watermemory: {
		shortDesc: "O Multi-Attack do portador é do tipo Water.",
	},
	waterstone: {
		desc: "Evolui Poliwhirl em Poliwrath, Shellder em Cloyster, Staryu em Starmie, Eevee em Vaporeon, Lombre em Ludicolo e Panpour em Simipour quando usado.",
		shortDesc: "Evolui certas espécies de Pokémon quando usado.",
	},
	watmelberry: {
		shortDesc: "O portador não pode comê-lo. Sem efeito se comido com Bug Bite ou Pluck.",
	},
	waveincense: {
		shortDesc: "Ataques do tipo Water do portador têm 1,2× de poder.",
	},
	weaknesspolicy: {
		shortDesc: "Se o portador sofrer golpe superefetivo, Ataque e Sp. Atk +2. Uso único.",
	},
	wellspringmask: {
		shortDesc: "Ogerpon-Wellspring: ataques com 1,2× de poder; Terastalizar ativa Embody Aspect.",
	},
	wepearberry: {
		shortDesc: "O portador não pode comê-lo. Sem efeito se comido com Bug Bite ou Pluck.",
	},
	whippeddream: {
		shortDesc: "Evolui Swirlix em Slurpuff quando trocado.",
	},
	whiteherb: {
		shortDesc: "Volta a 0 os estágios de atributo reduzidos quando algum for menor que 0. Uso único.",
		end: "  {POKEMON} voltou seus atributos ao normal com White Herb!",
	},
	widelens: {
		shortDesc: "A precisão dos ataques do portador é multiplicada por 1,1.",
	},
	wikiberry: {
		shortDesc: "Recupera 1/3 do HP máx. com 1/4 ou menos; confunde se natureza -SpA. Uso único.",
		gen7: {
			shortDesc: "Recupera 1/2 do HP máx. com 1/4 ou menos; confunde se natureza -SpA. Uso único.",
		},
		gen6: {
			shortDesc: "Recupera 1/8 do HP máx. com 1/2 ou menos; confunde se natureza -SpA. Uso único.",
		},
	},
	wiseglasses: {
		shortDesc: "Ataques especiais do portador têm 1,1× de poder.",
	},
	yacheberry: {
		shortDesc: "Reduz à metade o dano de um ataque superefetivo do tipo Ice. Uso único.",
	},
	zapplate: {
		shortDesc: "Ataques do tipo Electric do portador têm 1,2× de poder. Judgment é do tipo Electric.",
	},
	zeraorite: {
		shortDesc: "Se segurado por Zeraora, este item permite que ele Megaevolua em batalha.",
	},
	zoomlens: {
		shortDesc: "A precisão dos ataques do portador é 1,2× se ele agir depois do alvo.",
	},
	zygardite: {
		shortDesc: "Se segurado por Zygarde Complete Forme, este item permite que ele Megaevolua em batalha.",
	},
	berserkgene: {
		shortDesc: "(Gen 2) Ao entrar, aumenta o Ataque do portador em 2 e o confunde. Uso único.",
	},
	berry: {
		shortDesc: "(Gen 2) Recupera 10 HP quando estiver com 1/2 do HP máx. ou menos. Uso único.",
	},
	bitterberry: {
		shortDesc: "(Gen 2) O portador é curado se estiver confuso. Uso único.",
	},
	burntberry: {
		shortDesc: "(Gen 2) O portador é curado se estiver congelado. Uso único.",
	},
	goldberry: {
		shortDesc: "(Gen 2) Recupera 30 HP quando estiver com 1/2 do HP máx. ou menos. Uso único.",
	},
	iceberry: {
		shortDesc: "(Gen 2) O portador é curado se estiver queimado. Uso único.",
	},
	mintberry: {
		shortDesc: "(Gen 2) O portador acorda se estiver dormindo. Uso único.",
	},
	miracleberry: {
		shortDesc: "(Gen 2) O portador se cura se estiver confuso ou com condição de status. Uso único.",
	},
	mysteryberry: {
		shortDesc: "(Gen 2) Restaura 5 PP do primeiro golpe do portador a chegar a 0 PP. Uso único.",
		activate: "  {POKEMON} restaurou o PP do golpe {MOVE} com Mystery Berry!",
	},
	pinkbow: {
		shortDesc: "(Gen 2) Ataques do tipo Normal do portador têm 1,1× de poder.",
	},
	polkadotbow: {
		shortDesc: "(Gen 2) Ataques do tipo Normal do portador têm 1,1× de poder.",
	},
	przcureberry: {
		shortDesc: "(Gen 2) O portador se cura se estiver paralisado. Uso único.",
	},
	psncureberry: {
		shortDesc: "(Gen 2) O portador é curado se estiver envenenado. Uso único.",
	},
	crucibellite: {
		shortDesc: "Se segurado por Crucibelle, este item permite que ele Megaevolua em batalha.",
	},
	vilevial: {
		shortDesc: "Se segurado por Venomicon, seus ataques dos tipos Poison e Flying têm 1,2× de poder.",
	},
};
