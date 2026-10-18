// pt-BR (pokemon-showdown-custom). Nomes de Pokémon, golpes, habilidades, itens, naturezas e
//   tipos ficam em inglês (nada de "name" aqui: cai no inglês). Tipos sempre depois de
//   "tipo/tipos", porque o cliente troca esse trecho pelo selo do tipo. Atributos por extenso
//   em português, abreviações em inglês. Vírgula decimal. Gerado por scripts/traducao/aplicar.cjs
//   (repositório raiz); ver docs/traducao-pt-br.md.

export const AbilitiesText: { [id: IDEntry]: Partial<AbilityText> } = {
	noability: {
		shortDesc: "Não faz nada.",
	},
	adaptability: {
		desc: "Os golpes deste Pokémon que correspondem a um de seus tipos têm bônus de ataque do mesmo tipo (STAB) de 2 em vez de 1,5.",
		shortDesc: "O bônus de ataque do mesmo tipo (STAB) deste Pokémon é 2 em vez de 1,5.",
	},
	aerilate: {
		desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Flying e têm o poder multiplicado por 1,2. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
		shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Flying e têm 1,2× de poder.",
		gen6: {
			desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Flying e têm o poder multiplicado por 1,3. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
			shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Flying e têm 1,3× de poder.",
		},
	},
	aftermath: {
		desc: "Se este Pokémon for nocauteado por um golpe de contato, o usuário desse golpe perde 1/4 do HP máximo, arredondado para baixo. Este efeito é impedido se o usuário do golpe tiver a habilidade Magic Guard ou se algum Pokémon ativo tiver a habilidade Damp.",
		shortDesc: "Se este Pokémon for nocauteado por golpe de contato, o atacante perde 1/4 do HP máximo.",
		damage: "  {POKEMON} foi ferido!",
	},
	airlock: {
		shortDesc: "Enquanto este Pokémon estiver ativo, os efeitos do clima são anulados.",
		start: "  Os efeitos do clima desapareceram.",
	},
	analytic: {
		desc: "O poder do golpe deste Pokémon é multiplicado por 1,3 se ele for o último a agir no turno. Não afeta Doom Desire e Future Sight.",
		shortDesc: "Os ataques deste Pokémon têm 1,3× de poder se ele for o último a agir no turno.",
	},
	angerpoint: {
		desc: "Se este Pokémon, mas não seu Substitute, sofrer um acerto crítico, seu Ataque aumenta em 12 estágios.",
		shortDesc: "Se este Pokémon (não seu Substitute) sofrer acerto crítico, seu Ataque aumenta 12 estágios.",
		gen4: {
			desc: "Se este Pokémon, ou seu Substitute, sofrer um acerto crítico, seu Ataque aumenta em 12 estágios.",
			shortDesc: "Se este Pokémon ou seu Substitute sofrer acerto crítico, seu Ataque aumenta 12 estágios.",
		},
		boost: "  {POKEMON} maximizou seu Ataque!",
	},
	angershell: {
		desc: "Quando este Pokémon tem mais de 1/2 do HP máximo e sofre dano de um ataque que o deixa com 1/2 ou menos do HP máximo, seu Ataque, Ataque Especial e Velocidade aumentam em 1 estágio, e sua Defesa e Defesa Especial diminuem em 1 estágio. Este efeito se aplica após todos os acertos de um golpe de múltiplos acertos. Este efeito é impedido se o golpe teve um efeito secundário removido pela habilidade Sheer Force.",
		shortDesc: "Com 1/2 ou menos do HP máximo: +1 Atk, Sp. Atk e Spe, e -1 Def e Sp. Def.",
	},
	anticipation: {
		desc: "Ao entrar em campo, este Pokémon é alertado se algum Pokémon adversário tiver um golpe de ataque de um tipo superefetivo contra ele, ou qualquer golpe OHKO. Este efeito considera Hidden Power como o tipo que foi determinado para ele, e todos os outros golpes como seu tipo original.",
		shortDesc: "Ao entrar em campo, estremece se algum oponente tiver golpe superefetivo ou OHKO.",
		gen5: {
			desc: "Ao entrar em campo, este Pokémon é alertado se algum Pokémon adversário tiver um golpe de ataque de um tipo superefetivo contra ele, ou qualquer golpe OHKO. Este efeito considera os golpes como seu tipo original.",
		},
		gen4: {
			desc: "Ao entrar em campo, este Pokémon é alertado se algum Pokémon adversário tiver um golpe de ataque de um tipo superefetivo contra ele, ou qualquer golpe OHKO se este Pokémon não for imune ao tipo e o Pokémon com o golpe não tiver nível menor que o deste Pokémon. Este efeito considera os golpes como seu tipo original. Este efeito não é ativado por Counter, Dragon Rage, Metal Burst, Mirror Coat, Night Shade, Psywave ou Seismic Toss. Este efeito verifica se este Pokémon está segurando Iron Ball, se está sob os efeitos de Foresight (Odor Sleuth), Gravity, Ingrain, Miracle Eye ou Roost, e se cada Pokémon adversário tem as habilidades Normalize ou Scrappy antes de determinar se os ataques deles atendem às condições.",
		},
		activate: "  {POKEMON} estremeceu!",
	},
	arenatrap: {
		desc: "Impede que Pokémon adversários escolham sair de campo, a menos que estejam no ar, estejam segurando Shed Shell ou sejam do tipo Ghost.",
		shortDesc: "Impede que Pokémon adversários escolham sair de campo, a menos que estejam no ar.",
		gen6: {
			desc: "Impede que Pokémon adversários adjacentes escolham sair de campo, a menos que estejam no ar, estejam segurando Shed Shell ou sejam do tipo Ghost.",
		},
		gen5: {
			desc: "Impede que Pokémon adversários adjacentes escolham sair de campo, a menos que estejam no ar ou segurando Shed Shell.",
		},
		gen4: {
			desc: "Impede que Pokémon adversários escolham sair de campo, a menos que estejam no ar ou segurando Shed Shell.",
		},
		gen3: {
			desc: "Impede que Pokémon adversários escolham sair de campo, a menos que estejam no ar.",
		},
	},
	armortail: {
		desc: "Golpes de prioridade usados por Pokémon adversários contra este Pokémon ou seus aliados não têm efeito.",
		shortDesc: "Este Pokémon e seus aliados ficam protegidos de golpes de prioridade dos adversários.",
	},
	aromaveil: {
		desc: "Este Pokémon e seus aliados não podem ser afetados por Attract, Disable, Encore, Heal Block, Taunt ou Torment.",
		shortDesc: "Protege usuário e aliados de Attract, Disable, Encore, Heal Block, Taunt e Torment.",
		block: "  {POKEMON} está protegido por um véu aromático!",
	},
	asone: {
		shortDesc: "Veja 'As One (Glastrier)' e 'As One (Spectrier)'.",
		start: "  {POKEMON} tem duas habilidades!",
	},
	asoneglastrier: {
		shortDesc: "Combinação das habilidades Unnerve e Chilling Neigh.",
	},
	asonespectrier: {
		shortDesc: "Combinação das habilidades Unnerve e Grim Neigh.",
	},
	aurabreak: {
		desc: "Enquanto este Pokémon estiver ativo, os efeitos das habilidades Dark Aura e Fairy Aura são invertidos, multiplicando o poder dos golpes do tipo Dark e do tipo Fairy, respectivamente, por 3/4 em vez de 1,33.",
		shortDesc: "Enquanto este Pokémon estiver ativo, o modificador de Dark Aura e Fairy Aura é 0,75×.",
		start: "  {POKEMON} inverteu as auras de todos os outros Pokémon!",
	},
	auraguard: {
		shortDesc: "Este Pokémon recebe 1/2 do dano de golpes de contato.",
	},
	baddreams: {
		desc: "Faz os Pokémon adversários perderem 1/8 do HP máximo, arredondado para baixo, no fim de cada turno se estiverem dormindo.",
		shortDesc: "Oponentes dormindo perdem 1/8 do HP máximo no fim de cada turno.",
		gen6: {
			desc: "Faz os Pokémon adversários adjacentes perderem 1/8 do HP máximo, arredondado para baixo, no fim de cada turno se estiverem dormindo.",
			shortDesc: "Oponentes adjacentes dormindo perdem 1/8 do HP máximo no fim de cada turno.",
		},
		gen4: {
			desc: "Faz os Pokémon adversários perderem 1/8 do HP máximo, arredondado para baixo, no fim de cada turno se estiverem dormindo.",
			shortDesc: "Oponentes dormindo perdem 1/8 do HP máximo no fim de cada turno.",
		},
		damage: "  {POKEMON} está sendo atormentado!",
	},
	ballfetch: {
		shortDesc: "Sem uso competitivo.",
	},
	battery: {
		shortDesc: "Os aliados deste Pokémon têm o poder de seus ataques especiais multiplicado por 1,3.",
	},
	battlearmor: {
		shortDesc: "Este Pokémon não pode sofrer acertos críticos.",
	},
	battlebond: {
		desc: "Se este Pokémon for um Greninja, seu Ataque, Ataque Especial e Velocidade aumentam em 1 estágio se ele atacar e nocautear outro Pokémon. Este efeito só pode ocorrer uma vez por batalha.",
		shortDesc: "Após nocautear um Pokémon: +1 Atk, Sp. Atk e Spe. Uma vez por batalha.",
		gen8: {
			desc: "Se este Pokémon for um Greninja, ele se transforma em Ash-Greninja se atacar e nocautear outro Pokémon. Se este Pokémon for um Ash-Greninja, seu Water Shuriken tem 20 de poder e sempre acerta três vezes.",
			shortDesc: "Após nocautear um Pokémon: vira Ash-Greninja; Water Shuriken: 20 de poder, acerta 3×.",
		},
		activate: "  {POKEMON} ficou totalmente carregado graças ao seu vínculo com seu Treinador!",
		transform: "{POKEMON} se tornou Ash-Greninja!",
	},
	beadsofruin: {
		shortDesc: "Pokémon ativos sem esta habilidade têm a Defesa Especial multiplicada por 0,75.",
		start: "  Beads of Ruin de {POKEMON} enfraqueceu a Sp. Def de todos os Pokémon ao redor!",
	},
	beastboost: {
		desc: "O maior atributo deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon. Mudanças de estágio de atributos não são consideradas. Em caso de empate entre atributos, a prioridade é Ataque, Defesa, Ataque Especial, Defesa Especial e Velocidade, nessa ordem.",
		shortDesc: "O maior atributo deste Pokémon aumenta em 1 se ele atacar e nocautear outro Pokémon.",
	},
	berserk: {
		desc: "Quando este Pokémon tem mais de 1/2 do HP máximo e sofre dano de um ataque que o deixa com 1/2 ou menos do HP máximo, seu Ataque Especial aumenta em 1 estágio. Este efeito se aplica após todos os acertos de um golpe de múltiplos acertos. Este efeito é impedido se o golpe teve um efeito secundário removido pela habilidade Sheer Force.",
		shortDesc: "O Sp. Atk deste Pokémon aumenta em 1 quando ele chega a 1/2 ou menos do HP máximo.",
	},
	bigpecks: {
		shortDesc: "Impede que outros Pokémon diminuam o estágio de Defesa deste Pokémon.",
	},
	blaze: {
		desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Fire.",
		shortDesc: "Com 1/3 ou menos do HP máximo, o atributo ofensivo é 1,5× com ataques do tipo Fire.",
		gen4: {
			desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seus ataques do tipo Fire têm o poder multiplicado por 1,5.",
			shortDesc: "Com 1/3 ou menos do HP máximo, seus ataques do tipo Fire têm 1,5× de poder.",
		},
	},
	bulletproof: {
		shortDesc: "Este Pokémon é imune a golpes de projétil.",
	},
	cheekpouch: {
		desc: "Se este Pokémon comer uma Berry que está segurando, ele recupera 1/3 do HP máximo, arredondado para baixo, além do efeito da Berry. Este efeito também pode ser ativado após os efeitos de Bug Bite, Fling, Pluck, Stuff Cheeks e Teatime se a Berry comida tiver tido efeito neste Pokémon.",
		shortDesc: "Se este Pokémon comer uma Berry, recupera 1/3 do HP máximo após o efeito da Berry.",
		gen7: {
			desc: "Se este Pokémon comer uma Berry que está segurando, ele recupera 1/3 do HP máximo, arredondado para baixo, além do efeito da Berry. Este efeito também pode ser ativado após os efeitos de Bug Bite, Fling e Pluck se a Berry comida tiver efeito neste Pokémon.",
		},
	},
	chillingneigh: {
		desc: "O Ataque deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon.",
		shortDesc: "O Ataque deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon.",
	},
	chlorophyll: {
		desc: "Se o sol estiver ativo, a Velocidade deste Pokémon é dobrada. Este efeito é impedido se este Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Se o sol estiver ativo, a Velocidade deste Pokémon é dobrada.",
		gen7: {
			desc: "Se o sol estiver ativo, a Velocidade deste Pokémon é dobrada.",
		},
	},
	clearbody: {
		shortDesc: "Impede que outros Pokémon diminuam os estágios de atributos deste Pokémon.",
	},
	cloudnine: {
		shortDesc: "Enquanto este Pokémon estiver ativo, os efeitos do clima são anulados.",
	},
	colorchange: {
		desc: "O tipo deste Pokémon muda para o tipo do último golpe que o atingiu, a menos que esse tipo já seja um dos seus tipos. Este efeito se aplica após todos os acertos de um golpe de múltiplos acertos. Este efeito é impedido se o golpe teve um efeito secundário removido pela habilidade Sheer Force.",
		shortDesc: "O tipo deste Pokémon muda para o tipo do golpe que o atinge, a menos que já o tenha.",
		gen4: {
			desc: "O tipo deste Pokémon muda para o tipo do último golpe que o atingiu, a menos que esse tipo já seja um dos seus tipos. Este efeito se aplica após cada acerto de um golpe de múltiplos acertos. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
	},
	comatose: {
		desc: "Este Pokémon é considerado dormindo e não pode ser afetado por condições de status não voláteis nem por Yawn.",
		shortDesc: "Este Pokémon não pode receber condição de status e é considerado dormindo.",
		start: "  {POKEMON} está sonolento!",
	},
	commander: {
		desc: "Se este Pokémon for um Tatsugiri e um Dondozo for um aliado ativo, este Pokémon entra na boca do Dondozo. O Dondozo tem Ataque, Ataque Especial, Velocidade, Defesa e Defesa Especial aumentados em 2 estágios. Durante o efeito, o Dondozo não pode sair de campo, este Pokémon não pode escolher uma ação, e ataques direcionados a este Pokémon serão evitados, mas ele ainda sofre dano indireto. Se este Pokémon desmaiar durante o efeito, outro Pokémon pode entrar em campo para substituí-lo, mas o Dondozo continua sem poder sair de campo. Se o Dondozo desmaiar durante o efeito, este Pokémon volta a poder escolher uma ação.",
		shortDesc: "Aliado Dondozo: este Pokémon não age nem é atingido; +2 em todos os atributos dele.",
		activate: "  {POKEMON} foi engolido por {TARGET} e se tornou o comandante de {TARGET}!",
	},
	competitive: {
		desc: "O Ataque Especial deste Pokémon aumenta em 2 estágios para cada um de seus estágios de atributos diminuído por um Pokémon adversário.",
		shortDesc: "O Sp. Atk deste Pokémon aumenta em 2 para cada atributo seu diminuído por um oponente.",
	},
	compoundeyes: {
		shortDesc: "Os golpes deste Pokémon têm a precisão multiplicada por 1,3.",
	},
	contrary: {
		shortDesc: "Se um estágio de atributo deste Pokémon for aumentado, ele diminui, e vice-versa.",
		gen7: {
			desc: "Se um estágio de atributo deste Pokémon for aumentado, ele diminui, e vice-versa. Esta habilidade não afeta aumentos de estágio recebidos de efeitos de Z-Power que ocorrem antes de um Z-Move ser usado.",
		},
		gen6: {
			desc: "Se um estágio de atributo deste Pokémon for aumentado, ele diminui, e vice-versa.",
		},
	},
	corrosion: {
		shortDesc: "Pode envenenar ou envenenar gravemente um Pokémon independentemente dos tipos dele.",
	},
	costar: {
		shortDesc: "Ao entrar em campo, copia todas as mudanças de estágio de atributos do aliado.",
	},
	cottondown: {
		desc: "Quando este Pokémon é atingido por um ataque, a Velocidade de todos os outros Pokémon em campo diminui em 1 estágio.",
		shortDesc: "Se for atingido, diminui em 1 estágio a Velocidade de todos os outros Pokémon em campo.",
	},
	cudchew: {
		shortDesc: "Se este Pokémon comer uma Berry, ele a comerá de novo no fim do turno seguinte.",
	},
	curiousmedicine: {
		shortDesc: "Ao entrar em campo, os estágios de atributos dos aliados deste Pokémon voltam a 0.",
	},
	cursedbody: {
		desc: "Se este Pokémon for atingido por um ataque, há 30% de chance de o golpe ser desabilitado, a menos que um dos golpes do atacante já esteja desabilitado.",
		shortDesc: "Se for atingido por um ataque, há 30% de chance de o golpe ser desabilitado.",
	},
	cutecharm: {
		desc: "Há 30% de chance de um Pokémon que faça contato com este Pokémon ficar apaixonado, se for do gênero oposto.",
		shortDesc: "30% de chance de apaixonar Pokémon do gênero oposto que façam contato.",
		gen4: {
			desc: "Há 30% de chance de um Pokémon que faça contato com este Pokémon ficar apaixonado, se for do gênero oposto. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "Há 1/3 de chance de um Pokémon que faça contato com este Pokémon ficar apaixonado, se for do gênero oposto. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
			shortDesc: "1/3 de chance de apaixonar Pokémon do gênero oposto que façam contato.",
		},
	},
	damp: {
		desc: "Enquanto este Pokémon estiver ativo, Explosion, Mind Blown, Misty Explosion, Self-Destruct e a habilidade Aftermath não têm efeito.",
		shortDesc: "Impede Explosion/Mind Blown/Misty Explosion/Self-Destruct/Aftermath enquanto ativo.",
		gen7: {
			desc: "Enquanto este Pokémon estiver ativo, Explosion, Mind Blown, Self-Destruct e a habilidade Aftermath não têm efeito.",
			shortDesc: "Impede Explosion/Mind Blown/Self-Destruct/Aftermath enquanto este Pokémon estiver ativo.",
		},
		gen6: {
			desc: "Enquanto este Pokémon estiver ativo, Explosion, Self-Destruct e a habilidade Aftermath não têm efeito.",
			shortDesc: "Impede Explosion/Self-Destruct/Aftermath enquanto este Pokémon estiver ativo.",
		},
		gen3: {
			desc: "Enquanto este Pokémon estiver ativo, Explosion e Self-Destruct não têm efeito.",
			shortDesc: "Impede Explosion e Self-Destruct enquanto este Pokémon estiver ativo.",
		},
		block: "  {SOURCE} não pode usar {MOVE}!",
	},
	dancer: {
		desc: "Depois que outro Pokémon usa um golpe de dança, este Pokémon usa o mesmo golpe. O golpe copiado está sujeito a todos os efeitos que podem impedir a execução de um golpe. Um golpe usado por meio desta habilidade não pode ser copiado de novo por outros Pokémon com esta habilidade.",
		shortDesc: "Depois que outro Pokémon usa um golpe de dança, este Pokémon usa o mesmo golpe.",
	},
	darkaura: {
		desc: "Enquanto este Pokémon estiver ativo, o poder dos golpes do tipo Dark usados por Pokémon ativos é multiplicado por 1,33.",
		shortDesc: "Com este Pokémon ativo, golpes do tipo Dark de qualquer Pokémon têm 1,33× de poder.",
		start: "  {POKEMON} está irradiando uma aura sombria!",
	},
	dauntlessshield: {
		shortDesc: "Ao entrar em campo, a Defesa deste Pokémon aumenta em 1 estágio. Uma vez por batalha.",
		gen8: {
			shortDesc: "Ao entrar em campo, a Defesa deste Pokémon aumenta em 1 estágio.",
		},
	},
	dazzling: {
		desc: "Golpes de prioridade usados por Pokémon adversários contra este Pokémon ou seus aliados não têm efeito.",
		shortDesc: "Este Pokémon e seus aliados ficam protegidos de golpes de prioridade dos adversários.",
	},
	defeatist: {
		desc: "Enquanto este Pokémon tiver 1/2 ou menos do HP máximo, seu Ataque e Ataque Especial são reduzidos à metade.",
		shortDesc: "Com 1/2 ou menos do HP máximo, o Ataque e o Sp. Atk deste Pokémon caem à metade.",
	},
	defiant: {
		desc: "O Ataque deste Pokémon aumenta em 2 estágios para cada um de seus estágios de atributos diminuído por um Pokémon adversário.",
		shortDesc: "O Ataque deste Pokémon aumenta em 2 para cada atributo seu diminuído por um oponente.",
	},
	deltastream: {
		desc: "Ao entrar em campo, o clima se torna ventos fortes, que removem as fraquezas do tipo Flying dos Pokémon do tipo Flying. Este clima continua em efeito até que esta habilidade não esteja mais ativa em nenhum Pokémon, ou até que o clima seja mudado pelas habilidades Desolate Land ou Primordial Sea.",
		shortDesc: "Ao entrar em campo, começam ventos fortes enquanto esta habilidade estiver ativa.",
	},
	desolateland: {
		desc: "Ao entrar em campo, o clima se torna sol extremamente intenso, que inclui todos os efeitos do sol e impede a execução de golpes do tipo Water que causam dano. Este clima continua em efeito até que esta habilidade não esteja mais ativa em nenhum Pokémon, ou até que o clima seja mudado pelas habilidades Delta Stream ou Primordial Sea.",
		shortDesc: "Ao entrar em campo, começa um sol extremamente intenso enquanto esta habilidade estiver ativa.",
	},
	disguise: {
		desc: "Se este Pokémon for um Mimikyu, o primeiro golpe que ele recebe na batalha causa 0 de dano neutro. Seu disfarce é então quebrado, ele muda para a Busted Form e perde 1/8 do HP máximo. Dano de confusão também quebra o disfarce.",
		shortDesc: "(Só Mimikyu) O primeiro golpe recebido é bloqueado; ele sofre 1/8 do HP de dano no lugar.",
		gen7: {
			desc: "Se este Pokémon for um Mimikyu, o primeiro golpe que ele recebe na batalha causa 0 de dano neutro. Seu disfarce é então quebrado e ele muda para a Busted Form. Dano de confusão também quebra o disfarce.",
			shortDesc: "(Só Mimikyu) O primeiro golpe causa 0 de dano e quebra o disfarce.",
		},
		block: "  O disfarce serviu de isca!",
		transform: "O disfarce de {POKEMON} foi desfeito!",
	},
	download: {
		desc: "Ao entrar em campo, o Ataque ou o Ataque Especial deste Pokémon aumenta em 1 estágio, com base no atributo defensivo combinado mais fraco de todos os Pokémon adversários. O Ataque aumenta se a Defesa deles for menor, e o Ataque Especial aumenta se a Defesa Especial deles for igual ou menor.",
		shortDesc: "Ao entrar em campo, +1 Atk ou Sp. Atk conforme a defesa mais fraca dos oponentes.",
	},
	dragonize: {
		desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Dragon e têm o poder multiplicado por 1,2. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
		shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Dragon e têm 1,2× de poder.",
	},
	dragonsmaw: {
		shortDesc: "Seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Dragon.",
	},
	drizzle: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca chuva.",
	},
	drought: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca sol.",
	},
	dryskin: {
		desc: "Este Pokémon é imune a golpes do tipo Water e recupera 1/4 do HP máximo, arredondado para baixo, quando atingido por um golpe do tipo Water. O poder dos golpes do tipo Fire é multiplicado por 1,25 quando usados contra este Pokémon. No fim de cada turno, este Pokémon recupera 1/8 do HP máximo, arredondado para baixo, se o clima for chuva, e perde 1/8 do HP máximo, arredondado para baixo, se o clima for sol. Os efeitos de clima são impedidos se este Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Cura 1/4 com o tipo Water e 1/8 na chuva; sofre 1,25× do tipo Fire e 1/8 no sol.",
		gen7: {
			desc: "Este Pokémon é imune a golpes do tipo Water e recupera 1/4 do HP máximo, arredondado para baixo, quando atingido por um golpe do tipo Water. O poder dos golpes do tipo Fire é multiplicado por 1,25 quando usados contra este Pokémon. No fim de cada turno, este Pokémon recupera 1/8 do HP máximo, arredondado para baixo, se o clima for chuva, e perde 1/8 do HP máximo, arredondado para baixo, se o clima for sol.",
		},
	},
	earlybird: {
		shortDesc: "O contador de sono deste Pokémon diminui 2 em vez de 1.",
	},
	eartheater: {
		desc: "Este Pokémon é imune a golpes do tipo Ground e recupera 1/4 do HP máximo, arredondado para baixo, quando atingido por um golpe do tipo Ground.",
		shortDesc: "Cura 1/4 do HP máximo se atingido por golpe do tipo Ground; imune ao tipo Ground.",
	},
	eelevate: {
		desc: "Este Pokémon é imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes, Sticky Web e da habilidade Arena Trap. Os efeitos de Gravity, Ingrain, Smack Down, Thousand Arrows e Iron Ball anulam a imunidade. Thousand Arrows pode atingir este Pokémon como se ele não tivesse esta habilidade. O maior atributo deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon. Mudanças de estágio de atributos não são consideradas. Em caso de empate entre atributos, a prioridade é Ataque, Defesa, Ataque Especial, Defesa Especial e Velocidade, nessa ordem.",
		shortDesc: "Imune ao tipo Ground; +1 no maior atributo se nocautear outro Pokémon.",
	},
	effectspore: {
		desc: "30% de chance de um Pokémon que faça contato com este Pokémon ser envenenado, paralisado ou adormecer.",
		shortDesc: "30% de chance de envenenar/paralisar/adormecer quem fizer contato com este Pokémon.",
		gen4: {
			desc: "30% de chance de um Pokémon que faça contato com este Pokémon ser envenenado, paralisado ou adormecer. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "10% de chance de um Pokémon que faça contato com este Pokémon ser envenenado, paralisado ou adormecer. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
			shortDesc: "10% de chance de envenenar/paralisar/adormecer quem fizer contato com este Pokémon.",
		},
	},
	electricsurge: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca Electric Terrain.",
	},
	electromorphosis: {
		shortDesc: "Este Pokémon recebe o efeito de Charge quando é atingido por um ataque.",
		start: "  Ser atingido por {MOVE} carregou {POKEMON} de energia!",
	},
	embodyaspectcornerstone: {
		shortDesc: "Ao entrar em campo, a Defesa deste Pokémon aumenta em 1 estágio.",
		boost: "  A Cornerstone Mask usada por {POKEMON} brilhou intensamente, e a Defesa de {POKEMON} aumentou!",
	},
	embodyaspecthearthflame: {
		shortDesc: "Ao entrar em campo, o Ataque deste Pokémon aumenta em 1 estágio.",
		boost: "  A Hearthflame Mask usada por {POKEMON} brilhou intensamente, e o Ataque de {POKEMON} aumentou!",
	},
	embodyaspectteal: {
		shortDesc: "Ao entrar em campo, a Velocidade deste Pokémon aumenta em 1 estágio.",
		boost: "  A Teal Mask usada por {POKEMON} brilhou intensamente, e a Velocidade de {POKEMON} aumentou!",
	},
	embodyaspectwellspring: {
		shortDesc: "Ao entrar em campo, a Defesa Especial deste Pokémon aumenta em 1 estágio.",
		boost: "  A Wellspring Mask usada por {POKEMON} brilhou intensamente, e a Sp. Def de {POKEMON} aumentou!",
	},
	emergencyexit: {
		desc: "Quando este Pokémon tem mais de 1/2 do HP máximo e sofre dano que o deixa com 1/2 ou menos do HP máximo, ele sai de campo imediatamente para um aliado escolhido. Este efeito se aplica após todos os acertos de um golpe de múltiplos acertos. Este efeito é impedido se o golpe teve um efeito secundário removido pela habilidade Sheer Force. Este efeito se aplica tanto a dano direto quanto indireto, exceto Curse e Substitute ao serem usados, Belly Drum, Pain Split e dano de confusão.",
		shortDesc: "Este Pokémon sai de campo quando chega a 1/2 ou menos do HP máximo.",
	},
	fairyaura: {
		desc: "Enquanto este Pokémon estiver ativo, o poder dos golpes do tipo Fairy usados por Pokémon ativos é multiplicado por 1,33.",
		shortDesc: "Com este Pokémon ativo, golpes do tipo Fairy de qualquer Pokémon têm 1,33× de poder.",
		start: "  {POKEMON} está irradiando uma aura feérica!",
	},
	filter: {
		shortDesc: "Este Pokémon recebe 3/4 do dano de ataques superefetivos.",
	},
	firemane: {
		shortDesc: "Seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Fire.",
	},
	flamebody: {
		shortDesc: "30% de chance de um Pokémon que faça contato com este Pokémon ser queimado.",
		gen4: {
			desc: "30% de chance de um Pokémon que faça contato com este Pokémon ser queimado. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "1/3 de chance de um Pokémon que faça contato com este Pokémon ser queimado. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
			shortDesc: "1/3 de chance de um Pokémon que faça contato com este Pokémon ser queimado.",
		},
	},
	flareboost: {
		desc: "Enquanto este Pokémon estiver queimado, o poder de seus ataques especiais é multiplicado por 1,5.",
		shortDesc: "Enquanto este Pokémon estiver queimado, seus ataques especiais têm 1,5× de poder.",
	},
	flashfire: {
		desc: "Este Pokémon é imune a golpes do tipo Fire. Na primeira vez que for atingido por um golpe do tipo Fire, seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Fire, enquanto ele continuar ativo e tiver esta habilidade. Se este Pokémon estiver congelado, ele não pode ser descongelado por ataques do tipo Fire.",
		shortDesc: "Ataques do tipo Fire têm 1,5× após receber golpe do tipo Fire; imune ao tipo Fire.",
		gen4: {
			desc: "Este Pokémon é imune a golpes do tipo Fire, desde que não esteja congelado. Na primeira vez que for atingido por um golpe do tipo Fire, o dano de seus ataques do tipo Fire é multiplicado por 1,5 enquanto ele continuar ativo e tiver esta habilidade.",
		},
		gen3: {
			desc: "Este Pokémon é imune a golpes do tipo Fire, desde que não esteja congelado. Na primeira vez que for atingido por um golpe do tipo Fire, o dano de seus ataques do tipo Fire é multiplicado por 1,5 enquanto ele continuar ativo e tiver esta habilidade. Se este Pokémon tiver uma condição de status não volátil, for do tipo Fire ou tiver um Substitute, Will-O-Wisp não ativa esta habilidade.",
		},
		start: "  O poder dos golpes do tipo Fire de {POKEMON} aumentou!",
	},
	flowergift: {
		desc: "Se este Pokémon for um Cherrim e o sol estiver ativo, ele muda para a Sunshine Form, e o Ataque e a Defesa Especial dele e de seus aliados são multiplicados por 1,5. Estes efeitos são impedidos se o Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Cherrim com sol ativo: Ataque e Sp. Def dele e dos aliados são 1,5×.",
		gen7: {
			desc: "Se este Pokémon for um Cherrim e o sol estiver ativo, ele muda para a Sunshine Form, e o Ataque e a Defesa Especial dele e de seus aliados são multiplicados por 1,5.",
		},
		gen4: {
			desc: "Se o sol estiver ativo, o Ataque e a Defesa Especial deste Pokémon e de seus aliados são multiplicados por 1,5.",
			shortDesc: "Se o sol estiver ativo, Ataque e Sp. Def deste Pokémon e dos aliados são 1,5×.",
		},
	},
	flowerveil: {
		desc: "Pokémon do tipo Grass do lado deste Pokémon não podem ter seus estágios de atributos diminuídos por outros Pokémon nem receber condições de status não voláteis de outros Pokémon.",
		shortDesc: "Pokémon do tipo Grass deste lado não têm atributos diminuídos nem recebem status de outros.",
		block: "  {POKEMON} se envolveu em um véu de pétalas!",
	},
	fluffy: {
		desc: "Este Pokémon recebe 1/2 do dano de golpes de contato, mas o dobro de dano de golpes do tipo Fire.",
		shortDesc: "Este Pokémon recebe 1/2 do dano de golpes de contato e 2× de golpes do tipo Fire.",
	},
	forecast: {
		desc: "Se este Pokémon for um Castform, seu tipo muda para o tipo do clima atual, exceto tempestade de areia. Este efeito é impedido se este Pokémon estiver segurando Utility Umbrella e o clima for chuva ou sol.",
		shortDesc: "O tipo de Castform muda para o tipo do clima atual, exceto tempestade de areia.",
		gen7: {
			desc: "Se este Pokémon for um Castform, seu tipo muda para o tipo do clima atual, exceto tempestade de areia.",
		},
	},
	forewarn: {
		desc: "Ao entrar em campo, este Pokémon é alertado sobre o golpe de maior poder, escolhido aleatoriamente em caso de empate, conhecido por um Pokémon adversário. Este efeito considera que golpes OHKO têm 150 de poder, Counter, Mirror Coat e Metal Burst têm 120 de poder, todos os outros golpes de ataque com poder não especificado têm 80 de poder, e golpes que não causam dano têm 1 de poder.",
		shortDesc: "Ao entrar em campo, é alertado sobre o golpe de maior poder dos oponentes.",
		gen4: {
			desc: "Ao entrar em campo, este Pokémon é alertado sobre o golpe de maior poder, escolhido aleatoriamente em caso de empate, conhecido por um Pokémon adversário. Este efeito considera que golpes OHKO têm 150 de poder, Counter, Mirror Coat e Metal Burst têm 120 de poder, e todos os outros golpes de ataque com poder não especificado têm 80 de poder.",
		},
		activate: "  {MOVE} de {TARGET} foi revelado!",
		activateNoTarget: "  Forewarn de {POKEMON} o alertou sobre {MOVE}!",
	},
	friendguard: {
		shortDesc: "Os aliados deste Pokémon recebem 3/4 do dano de ataques de outros Pokémon.",
	},
	frisk: {
		shortDesc: "Ao entrar em campo, identifica os itens segurados de todos os Pokémon adversários.",
		gen5: {
			shortDesc: "Ao entrar em campo, identifica o item segurado de um Pokémon adversário aleatório.",
		},
		activate: "  {POKEMON} revistou {TARGET} e encontrou {ITEM}!",
		activateNoTarget: "  {POKEMON} revistou seu alvo e encontrou {ITEM}!",
	},
	fullmetalbody: {
		shortDesc: "Impede que outros Pokémon diminuam os estágios de atributos deste Pokémon.",
	},
	furcoat: {
		shortDesc: "A Defesa deste Pokémon é dobrada.",
	},
	galewings: {
		shortDesc: "Com HP cheio, os golpes do tipo Flying deste Pokémon têm prioridade +1.",
		gen6: {
			shortDesc: "Os golpes do tipo Flying deste Pokémon têm prioridade +1.",
		},
	},
	galvanize: {
		desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Electric e têm o poder multiplicado por 1,2. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
		shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Electric e têm 1,2× de poder.",
	},
	gluttony: {
		desc: "Quando este Pokémon está segurando uma Berry que normalmente é ativada com 1/4 ou menos do HP máximo, ela é comida com 1/2 ou menos do HP máximo.",
		shortDesc: "Este Pokémon come Berries com 1/2 do HP máximo ou menos, em vez do normal de 1/4.",
	},
	goodasgold: {
		shortDesc: "Este Pokémon é imune a golpes de status.",
	},
	gooey: {
		shortDesc: "Pokémon que fazem contato com este Pokémon têm a Velocidade diminuída em 1 estágio.",
	},
	gorillatactics: {
		desc: "O Ataque deste Pokémon é multiplicado por 1,5, mas ele só pode escolher o primeiro golpe que executar. Estes efeitos são impedidos enquanto este Pokémon estiver em Dynamax.",
		shortDesc: "O Ataque deste Pokémon é 1,5×, mas ele só pode escolher o primeiro golpe que executar.",
	},
	grasspelt: {
		shortDesc: "Se Grassy Terrain estiver ativo, a Defesa deste Pokémon é multiplicada por 1,5.",
	},
	grassysurge: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca Grassy Terrain.",
	},
	grimneigh: {
		desc: "O Ataque Especial deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon.",
		shortDesc: "O Sp. Atk deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon.",
	},
	guarddog: {
		desc: "Este Pokémon é imune ao efeito da habilidade Intimidate e, em vez disso, aumenta seu Ataque em 1 estágio. Este Pokémon não pode ser forçado a sair de campo pelo ataque ou item de outro Pokémon.",
		shortDesc: "Imune a Intimidate; se intimidado, +1 Ataque. Não pode ser forçado a sair de campo.",
	},
	gulpmissile: {
		desc: "Se este Pokémon for um Cramorant, ele muda de forma quando atinge um alvo com Surf ou usa com sucesso o primeiro turno de Dive. Ele se torna a Gulping Form, com um Arrokuda na boca, se tiver mais de 1/2 do HP máximo restante, ou a Gorging Form, com um Pikachu na boca, se tiver 1/2 ou menos do HP máximo restante. Se Cramorant for atingido na Gulping Form ou na Gorging Form, ele cospe o Arrokuda ou o Pikachu no atacante, mesmo sem HP restante. O projétil causa dano igual a 1/4 do HP máximo do alvo, arredondado para baixo; esse dano é bloqueado pela habilidade Magic Guard, mas não por Substitute. Um Arrokuda também diminui a Defesa do alvo em 1 estágio, e um Pikachu paralisa o alvo. Cramorant volta ao normal se cuspir um projétil, sair de campo ou usar Dynamax.",
		shortDesc: "Atingido após Surf/Dive: atacante perde 1/4 do HP máximo e sofre -1 Def ou paralisia.",
	},
	guts: {
		desc: "Se este Pokémon tiver uma condição de status não volátil, seu Ataque é multiplicado por 1,5. Os ataques físicos deste Pokémon ignoram o efeito da queimadura que reduz o dano à metade.",
		shortDesc: "Com condição de status, seu Ataque é 1,5×; ignora a redução de dano físico da queimadura.",
	},
	hadronengine: {
		shortDesc: "Ao entrar em campo, invoca Electric Terrain. Durante Electric Terrain, Sp. Atk é 1,3333×.",
		start: "  {POKEMON} transformou o chão em Electric Terrain, energizando seu motor futurista!",
		activate: "  {POKEMON} usou Electric Terrain para energizar seu motor futurista!",
	},
	harvest: {
		desc: "Se o último item usado por este Pokémon for uma Berry, há 50% de chance de ela ser restaurada no fim de cada turno. Se o sol estiver ativo, essa chance é de 100%.",
		shortDesc: "Último item usado é Berry: 50% de chance de restaurá-la no fim do turno; 100% no sol.",
		addItem: "  {POKEMON} colheu {ITEM}!",
	},
	healer: {
		desc: "30% de chance de o aliado deste Pokémon ter sua condição de status não volátil curada no fim de cada turno.",
		shortDesc: "30% de chance de o aliado deste Pokémon ter seu status curado no fim de cada turno.",
		champions: {
			desc: "50% de chance de o aliado deste Pokémon ter sua condição de status não volátil curada no fim de cada turno.",
			shortDesc: "50% de chance de o aliado deste Pokémon ter seu status curado no fim de cada turno.",
		},
		gen6: {
			desc: "30% de chance de cada aliado adjacente deste Pokémon ter sua condição de status não volátil curada no fim de cada turno.",
			shortDesc: "30% de chance de cada aliado adjacente ter seu status curado no fim de cada turno.",
		},
	},
	heatproof: {
		desc: "Se um Pokémon usar um ataque do tipo Fire contra este Pokémon, o atributo ofensivo dele é reduzido à metade no cálculo do dano a este Pokémon. Este Pokémon sofre metade do dano normal de queimadura, arredondado para baixo.",
		shortDesc: "Dano do tipo Fire contra ele usa 1/2 do atributo ofensivo; 1/2 do dano de queimadura.",
		gen8: {
			desc: "O poder dos ataques do tipo Fire contra este Pokémon é reduzido à metade. Este Pokémon sofre metade do dano normal de queimadura, arredondado para baixo.",
			shortDesc: "Poder de ataques do tipo Fire contra ele cai à metade; dano de queimadura também.",
		},
	},
	heavymetal: {
		desc: "O peso deste Pokémon é dobrado. Este efeito é calculado após o efeito de Autotomize e antes do efeito de Float Stone.",
		shortDesc: "O peso deste Pokémon é dobrado.",
	},
	honeygather: {
		shortDesc: "Sem uso competitivo.",
	},
	hospitality: {
		shortDesc: "Ao entrar em campo, recupera 1/4 do HP máximo do aliado, arredondado para baixo.",
		heal: "  {POKEMON} bebeu todo o matcha que {SOURCE} preparou!",
	},
	hugepower: {
		shortDesc: "O Ataque deste Pokémon é dobrado.",
	},
	hungerswitch: {
		desc: "Se este Pokémon for um Morpeko, ele alterna entre Full Belly Mode e Hangry Mode no fim de cada turno.",
		shortDesc: "Se for Morpeko, alterna entre Full Belly Mode e Hangry Mode no fim de cada turno.",
	},
	hustle: {
		desc: "O Ataque deste Pokémon é multiplicado por 1,5 e a precisão de seus ataques físicos é multiplicada por 0,8.",
		shortDesc: "O Ataque deste Pokémon é 1,5× e a precisão de seus ataques físicos é 0,8×.",
	},
	hydration: {
		desc: "Este Pokémon tem sua condição de status não volátil curada no fim de cada turno se a chuva estiver ativa. Este efeito é impedido se este Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Este Pokémon tem seu status curado no fim de cada turno se a chuva estiver ativa.",
		gen7: {
			desc: "Este Pokémon tem sua condição de status não volátil curada no fim de cada turno se a chuva estiver ativa.",
		},
	},
	hypercutter: {
		shortDesc: "Impede que outros Pokémon diminuam o estágio de Ataque deste Pokémon.",
	},
	icebody: {
		desc: "Se a neve estiver ativa, este Pokémon recupera 1/16 do HP máximo, arredondado para baixo, no fim de cada turno.",
		shortDesc: "Se a neve estiver ativa, este Pokémon recupera 1/16 do HP máximo a cada turno.",
		gen8: {
			desc: "Se o granizo estiver ativo, este Pokémon recupera 1/16 do HP máximo, arredondado para baixo, no fim de cada turno. Este Pokémon não sofre dano do granizo.",
			shortDesc: "Se o granizo estiver ativo, recupera 1/16 do HP máximo a cada turno; imune ao granizo.",
		},
	},
	iceface: {
		desc: "Se este Pokémon for um Eiscue, o primeiro golpe físico que ele recebe na batalha causa 0 de dano neutro. Sua face de gelo é então quebrada e ele muda para a forma Noice Face. Eiscue recupera a forma Ice Face quando a neve começa ou quando entra em campo com a neve ativa. Dano de confusão também quebra a face de gelo.",
		shortDesc: "Se for Eiscue, o primeiro golpe físico recebido causa 0 de dano. O efeito volta na neve.",
		gen8: {
			desc: "Se este Pokémon for um Eiscue, o primeiro golpe físico que ele recebe na batalha causa 0 de dano neutro. Sua face de gelo é então quebrada e ele muda para a forma Noice Face. Eiscue recupera a forma Ice Face quando o granizo começa ou quando entra em campo com o granizo ativo. Dano de confusão também quebra a face de gelo.",
			shortDesc: "Se for Eiscue, o primeiro golpe físico recebido causa 0 de dano. O efeito volta no granizo.",
		},
	},
	icescales: {
		shortDesc: "Este Pokémon recebe 1/2 do dano de ataques especiais.",
	},
	illuminate: {
		desc: "Impede que outros Pokémon diminuam o estágio de precisão deste Pokémon. Este Pokémon ignora o estágio de evasão do alvo.",
		shortDesc: "A precisão deste Pokémon não pode ser diminuída por outros; ignora a evasão deles.",
		gen8: {
			desc: "Sem uso competitivo.",
			shortDesc: "Sem uso competitivo.",
		},
	},
	illusion: {
		desc: "Quando este Pokémon entra em campo, ele aparece como o último Pokémon não desmaiado de sua equipe até sofrer dano direto do ataque de outro Pokémon. O nível e o HP reais deste Pokémon são exibidos em vez dos do Pokémon imitado.",
		shortDesc: "Este Pokémon aparece como o último Pokémon da equipe até sofrer dano direto.",
		end: "  A ilusão de {POKEMON} se desfez!",
	},
	immunity: {
		shortDesc: "Não pode ser envenenado. Obter esta habilidade enquanto envenenado o cura.",
	},
	imposter: {
		desc: "Ao entrar em campo, este Pokémon se transforma (Transform) no Pokémon adversário à sua frente. Se não houver Pokémon nessa posição, este Pokémon não se transforma.",
		shortDesc: "Ao entrar em campo, este Pokémon se transforma (Transform) no adversário à sua frente.",
	},
	infiltrator: {
		desc: "Os golpes deste Pokémon ignoram Substitute e os efeitos de Reflect, Light Screen, Safeguard, Mist e Aurora Veil do lado adversário.",
		shortDesc: "Golpes ignoram Substitute e Reflect/Light Screen/Safeguard/Mist/Aurora Veil do oponente.",
		gen6: {
			desc: "Os golpes deste Pokémon ignoram Substitute e os efeitos de Reflect, Light Screen, Safeguard e Mist do lado adversário.",
			shortDesc: "Golpes ignoram Substitute e Reflect, Light Screen, Safeguard e Mist do oponente.",
		},
		gen5: {
			desc: "Os golpes deste Pokémon ignoram os efeitos de Reflect, Light Screen, Safeguard e Mist do lado adversário.",
			shortDesc: "Os golpes deste Pokémon ignoram Reflect, Light Screen, Safeguard e Mist do oponente.",
		},
	},
	innardsout: {
		desc: "Se este Pokémon for nocauteado por um golpe, o usuário desse golpe perde HP igual ao dano causado a este Pokémon.",
		shortDesc: "Se for nocauteado por um golpe, o usuário do golpe perde a mesma quantidade de HP.",
	},
	innerfocus: {
		desc: "Este Pokémon não pode ser levado a recuar. Este Pokémon é imune ao efeito da habilidade Intimidate.",
		shortDesc: "Este Pokémon não pode ser levado a recuar. Imune a Intimidate.",
		gen7: {
			desc: "Este Pokémon não pode ser levado a recuar.",
			shortDesc: "Este Pokémon não pode ser levado a recuar.",
		},
	},
	insomnia: {
		shortDesc: "Não pode adormecer. Obter esta habilidade enquanto dorme o acorda.",
	},
	intimidate: {
		desc: "Ao entrar em campo, este Pokémon diminui em 1 estágio o Ataque dos Pokémon adversários. Pokémon com as habilidades Inner Focus, Oblivious, Own Tempo ou Scrappy e Pokémon protegidos por Substitute são imunes.",
		shortDesc: "Ao entrar em campo, diminui em 1 estágio o Ataque dos oponentes.",
		gen7: {
			desc: "Ao entrar em campo, este Pokémon diminui em 1 estágio o Ataque dos Pokémon adversários. Pokémon protegidos por Substitute são imunes.",
		},
		gen6: {
			desc: "Ao entrar em campo, este Pokémon diminui em 1 estágio o Ataque dos Pokémon adversários adjacentes. Pokémon protegidos por Substitute são imunes.",
			shortDesc: "Ao entrar em campo, diminui em 1 estágio o Ataque dos oponentes adjacentes.",
		},
		gen4: {
			desc: "Ao entrar em campo, este Pokémon diminui em 1 estágio o Ataque dos Pokémon adversários. Pokémon protegidos por Substitute são imunes. Se U-turn quebrar um Substitute adversário e este Pokémon entrar em campo como substituto, o Pokémon que tinha o Substitute continua imune a esta habilidade.",
			shortDesc: "Ao entrar em campo, diminui em 1 estágio o Ataque dos oponentes.",
		},
		gen3: {
			desc: "Ao entrar em campo, este Pokémon diminui em 1 estágio o Ataque dos Pokémon adversários. Pokémon protegidos por Substitute são imunes.",
		},
	},
	intrepidsword: {
		shortDesc: "Ao entrar em campo, o Ataque deste Pokémon aumenta em 1 estágio. Uma vez por batalha.",
		gen8: {
			shortDesc: "Ao entrar em campo, o Ataque deste Pokémon aumenta em 1 estágio.",
		},
	},
	ironbarbs: {
		desc: "Pokémon que fazem contato com este Pokémon perdem 1/8 do HP máximo, arredondado para baixo.",
		shortDesc: "Pokémon que fazem contato com este Pokémon perdem 1/8 do HP máximo.",
	},
	ironfist: {
		desc: "Os golpes de soco deste Pokémon têm o poder multiplicado por 1,2.",
		shortDesc: "Os golpes de soco deste Pokémon têm 1,2× de poder. Sucker Punch não é fortalecido.",
	},
	justified: {
		shortDesc: "O Ataque deste Pokémon aumenta em 1 estágio após sofrer dano de um golpe do tipo Dark.",
	},
	keeneye: {
		desc: "Impede que outros Pokémon diminuam o estágio de precisão deste Pokémon. Este Pokémon ignora o estágio de evasão do alvo.",
		shortDesc: "A precisão deste Pokémon não pode ser diminuída por outros; ignora a evasão deles.",
		gen5: {
			desc: "Impede que outros Pokémon diminuam o estágio de precisão deste Pokémon.",
			shortDesc: "Impede que outros Pokémon diminuam o estágio de precisão deste Pokémon.",
		},
	},
	klutz: {
		desc: "O item segurado por este Pokémon não tem efeito. Este Pokémon não consegue usar Fling com sucesso. Macho Brace, Power Anklet, Power Band, Power Belt, Power Bracer, Power Lens e Power Weight continuam tendo efeito.",
		shortDesc: "O item segurado não tem efeito, exceto Macho Brace. Não pode usar Fling.",
	},
	leafguard: {
		desc: "Se o sol estiver ativo, este Pokémon não pode ser afetado por condições de status não voláteis nem por Yawn, e Rest falha para ele. Este efeito é impedido se este Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Com sol ativo, este Pokémon não recebe condição de status e Rest falha para ele.",
		gen7: {
			desc: "Se o sol estiver ativo, este Pokémon não pode ser afetado por condições de status não voláteis nem por Yawn, e Rest falha para ele.",
		},
		gen4: {
			desc: "Se o sol estiver ativo, este Pokémon não pode ser afetado por condições de status não voláteis nem por Yawn, mas pode usar Rest normalmente.",
			shortDesc: "Com sol ativo, este Pokémon não recebe condição de status, mas Rest funciona.",
		},
	},
	levitate: {
		desc: "Este Pokémon é imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes, Sticky Web e da habilidade Arena Trap. Os efeitos de Gravity, Ingrain, Smack Down, Thousand Arrows e Iron Ball anulam a imunidade. Thousand Arrows pode atingir este Pokémon como se ele não tivesse esta habilidade.",
		shortDesc: "Imune ao tipo Ground; Gravity/Ingrain/Smack Down/Iron Ball anulam a imunidade.",
		gen5: {
			desc: "Este Pokémon é imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes e da habilidade Arena Trap. Os efeitos de Gravity, Ingrain, Smack Down e Iron Ball anulam a imunidade.",
		},
		gen4: {
			desc: "Este Pokémon é imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes e da habilidade Arena Trap. Os efeitos de Gravity, Ingrain e Iron Ball anulam a imunidade.",
			shortDesc: "Imune ao tipo Ground; Gravity/Ingrain/Iron Ball anulam a imunidade.",
		},
		gen3: {
			desc: "Este Pokémon é imune a ataques do tipo Ground e aos efeitos de Spikes e da habilidade Arena Trap.",
			shortDesc: "Este Pokémon é imune ao tipo Ground.",
		},
	},
	libero: {
		desc: "O tipo deste Pokémon muda para o tipo do golpe que ele está prestes a usar. Este efeito ocorre depois de todos os efeitos que mudam o tipo de um golpe. Este efeito só pode ocorrer uma vez por entrada em campo, e somente se este Pokémon não estiver Terastalizado.",
		shortDesc: "O tipo deste Pokémon muda para o tipo do golpe que usa. Uma vez por entrada em campo.",
		gen8: {
			desc: "O tipo deste Pokémon muda para o tipo do golpe que ele está prestes a usar. Este efeito ocorre depois de todos os efeitos que mudam o tipo de um golpe.",
			shortDesc: "O tipo deste Pokémon muda para o tipo do golpe que ele está prestes a usar.",
		},
	},
	lightmetal: {
		desc: "O peso deste Pokémon é reduzido à metade, arredondado para baixo até o décimo de quilograma. Este efeito é calculado após o efeito de Autotomize e antes do efeito de Float Stone. O peso de um Pokémon não cai abaixo de 0,1 kg.",
		shortDesc: "O peso deste Pokémon é reduzido à metade.",
	},
	lightningrod: {
		desc: "Este Pokémon é imune a golpes do tipo Electric e aumenta seu Ataque Especial em 1 estágio quando atingido por um golpe do tipo Electric. Se este Pokémon não for o alvo de um golpe do tipo Electric de alvo único usado por outro Pokémon, ele redireciona esse golpe para si mesmo, se estiver dentro do alcance do golpe. Se vários Pokémon puderem redirecionar com esta habilidade, o golpe vai para o de maior Velocidade ou, em caso de empate, para o que está com esta habilidade ativa há mais tempo.",
		shortDesc: "Atrai golpes do tipo Electric para si e aumenta o Sp. Atk em 1; imune ao tipo Electric.",
		gen4: {
			desc: "Se este Pokémon não for o alvo de um golpe do tipo Electric de alvo único usado por outro Pokémon, ele redireciona esse golpe para si mesmo.",
			shortDesc: "Este Pokémon atrai para si golpes do tipo Electric de alvo único.",
		},
		gen3: {
			desc: "Se este Pokémon não for o alvo de um golpe do tipo Electric de alvo único usado por um Pokémon adversário, ele redireciona esse golpe para si mesmo. Este efeito considera Hidden Power um golpe do tipo Normal.",
			shortDesc: "Atrai para si golpes do tipo Electric de alvo único usados por oponentes.",
		},
		activate: "  {POKEMON} atraiu o ataque!",
	},
	limber: {
		shortDesc: "Não pode ser paralisado. Obter esta habilidade enquanto paralisado o cura.",
	},
	lingeringaroma: {
		desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Lingering Aroma. Não afeta Pokémon com as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Lingering Aroma, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode ou Zero to Hero.",
		shortDesc: "Fazer contato com este Pokémon troca a habilidade do atacante para Lingering Aroma.",
		gen8: {
			desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Lingering Aroma. Não afeta Pokémon com as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Lingering Aroma, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode.",
		},
		changeAbility: "  Um aroma persistente se impregna em {TARGET}!",
	},
	liquidooze: {
		shortDesc: "Quem drenar HP deste Pokémon sofre dano igual ao que recuperaria.",
		gen4: {
			desc: "Quem drenar HP deste Pokémon sofre dano igual ao que recuperaria. Este efeito não considera Dream Eater.",
		},
		damage: "  {POKEMON} sugou o lodo líquido!",
	},
	liquidvoice: {
		desc: "Os golpes sonoros deste Pokémon se tornam golpes do tipo Water. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
		shortDesc: "Os golpes sonoros deste Pokémon se tornam do tipo Water.",
	},
	longreach: {
		shortDesc: "Os ataques deste Pokémon não fazem contato com o alvo.",
	},
	magicbounce: {
		desc: "Este Pokémon não é afetado por certos golpes que não causam dano direcionados a ele e, em vez disso, usa esses golpes contra o usuário original. Golpes refletidos dessa forma não podem ser refletidos de novo por este efeito nem pelo de Magic Coat. Spikes, Stealth Rock, Sticky Web e Toxic Spikes só podem ser refletidos uma vez por lado, pelo Pokémon mais à esquerda sob este efeito ou o de Magic Coat. As habilidades Lightning Rod e Storm Drain redirecionam seus respectivos golpes antes que esta habilidade tenha efeito.",
		shortDesc: "Este Pokémon bloqueia certos golpes de status e os devolve ao usuário.",
		gen5: {
			desc: "Este Pokémon não é afetado por certos golpes que não causam dano direcionados a ele e, em vez disso, usa esses golpes contra o usuário original. Golpes refletidos dessa forma não podem ser refletidos de novo por este efeito nem pelo de Magic Coat. Spikes, Stealth Rock e Toxic Spikes só podem ser refletidos uma vez por lado, pelo Pokémon mais à esquerda sob este efeito ou o de Magic Coat. As habilidades Lightning Rod e Storm Drain redirecionam seus respectivos golpes antes que esta habilidade tenha efeito.",
		},
	},
	magicguard: {
		desc: "Este Pokémon só pode sofrer dano de ataques diretos. Curse e Substitute ao serem usados, Belly Drum, Pain Split, dano de recuo de Struggle e dano de confusão são considerados dano direto.",
		shortDesc: "Este Pokémon só pode sofrer dano de ataques diretos.",
		gen4: {
			desc: "Este Pokémon só pode sofrer dano de ataques diretos. Curse e Substitute ao serem usados, Belly Drum, Pain Split, dano de recuo de Struggle e dano de confusão são considerados dano direto. A paralisia não pode impedir este Pokémon de agir, e ele não é afetado por Toxic Spikes ao entrar em campo.",
			shortDesc: "Só sofre dano de ataques diretos e não pode ficar totalmente paralisado.",
		},
	},
	magician: {
		desc: "Se este Pokémon não tiver item, ele rouba o item de um Pokémon que atingir com um ataque. Não afeta Doom Desire e Future Sight. Se vários alvos forem atingidos por um ataque, o item é roubado do Pokémon mais rápido, considerando o efeito de Trick Room e priorizando Pokémon adversários sobre aliados.",
		shortDesc: "Se este Pokémon não tiver item, rouba o item de um Pokémon que atingir com um ataque.",
	},
	magmaarmor: {
		shortDesc: "Não pode ser congelado. Obter esta habilidade enquanto congelado o cura.",
	},
	magnetpull: {
		desc: "Impede que Pokémon adversários do tipo Steel escolham sair de campo, a menos que estejam segurando Shed Shell ou sejam do tipo Ghost.",
		shortDesc: "Impede que Pokémon adversários do tipo Steel escolham sair de campo.",
		gen6: {
			desc: "Impede que Pokémon adversários adjacentes do tipo Steel escolham sair de campo, a menos que estejam segurando Shed Shell ou sejam do tipo Ghost.",
			shortDesc: "Impede que Pokémon adversários adjacentes do tipo Steel escolham sair de campo.",
		},
		gen5: {
			desc: "Impede que Pokémon adversários adjacentes do tipo Steel escolham sair de campo, a menos que estejam segurando Shed Shell.",
			shortDesc: "Impede que Pokémon adversários adjacentes do tipo Steel escolham sair de campo.",
		},
		gen4: {
			desc: "Impede que Pokémon adversários do tipo Steel escolham sair de campo, a menos que estejam segurando Shed Shell.",
			shortDesc: "Impede que Pokémon adversários do tipo Steel escolham sair de campo.",
		},
		gen3: {
			desc: "Impede que Pokémon do tipo Steel, exceto este Pokémon, escolham sair de campo.",
			shortDesc: "Impede que Pokémon do tipo Steel, exceto este Pokémon, escolham sair de campo.",
		},
	},
	marvelscale: {
		shortDesc: "Se tiver condição de status não volátil, sua Defesa é multiplicada por 1,5.",
	},
	megalauncher: {
		desc: "Os golpes de pulso deste Pokémon têm o poder multiplicado por 1,5. Heal Pulse recupera 3/4 do HP máximo do alvo, arredondado para o inteiro mais próximo (a metade é arredondada para baixo).",
		shortDesc: "Golpes de pulso têm 1,5× de poder. Heal Pulse cura 3/4 do HP máximo do alvo.",
	},
	megasol: {
		shortDesc: "Os golpes deste Pokémon são usados como se os efeitos do sol estivessem ativos.",
	},
	merciless: {
		shortDesc: "Os ataques deste Pokémon são acertos críticos se o alvo estiver envenenado.",
	},
	mimicry: {
		desc: "Os tipos deste Pokémon mudam de acordo com o terreno ativo quando ele obtém esta habilidade ou sempre que um terreno começa: tipo Electric durante Electric Terrain, tipo Grass durante Grassy Terrain, tipo Fairy durante Misty Terrain e tipo Psychic durante Psychic Terrain. Se esta habilidade for obtida sem um terreno ativo, ou se um terreno terminar, os tipos deste Pokémon voltam a ser os tipos originais de sua espécie.",
		shortDesc: "Os tipos deste Pokémon mudam conforme o terreno e voltam ao original quando ele acaba.",
		activate: "  {POKEMON} voltou ao seu tipo original!",
	},
	mindseye: {
		desc: "Este Pokémon pode atingir Pokémon do tipo Ghost com golpes dos tipos Normal e Fighting. Impede que outros Pokémon diminuam o estágio de precisão deste Pokémon. Este Pokémon ignora o estágio de evasão do alvo.",
		shortDesc: "Golpes de tipo Fighting/Normal atingem o tipo Ghost. Precisão não cai; ignora evasão.",
	},
	minus: {
		desc: "Se um aliado ativo tiver esta habilidade ou a habilidade Plus, o Ataque Especial deste Pokémon é multiplicado por 1,5.",
		shortDesc: "Se um aliado ativo tiver esta habilidade ou Plus, o Sp. Atk deste Pokémon é 1,5×.",
		gen4: {
			desc: "Se um aliado ativo tiver a habilidade Plus, o Ataque Especial deste Pokémon é multiplicado por 1,5.",
			shortDesc: "Se um aliado ativo tiver a habilidade Plus, o Sp. Atk deste Pokémon é 1,5×.",
		},
		gen3: {
			desc: "Se um Pokémon ativo tiver a habilidade Plus, o Ataque Especial deste Pokémon é multiplicado por 1,5.",
			shortDesc: "Se um Pokémon ativo tiver a habilidade Plus, o Sp. Atk deste Pokémon é 1,5×.",
		},
	},
	mirrorarmor: {
		desc: "Quando um dos estágios de atributos deste Pokémon seria diminuído por outro Pokémon, o estágio desse outro Pokémon é diminuído no lugar. Este efeito não ocorre se o estágio de atributo deste Pokémon já estiver em -6. Se o outro Pokémon tiver um Substitute, nenhum dos dois tem o estágio de atributo diminuído.",
		shortDesc: "Se seus estágios de atributos forem diminuídos, os do atacante caem no lugar.",
	},
	mistysurge: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca Misty Terrain.",
	},
	moldbreaker: {
		desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Armor Tail, Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Earth Eater, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Good as Gold, Grass Pelt, Guard Dog, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Illuminate, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mind's Eye, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Purifying Salt, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Tera Shell, Thermal Exchange, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, Well-Baked Body, White Smoke, Wind Rider, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam ou não alvos do golpe deste Pokémon, e a habilidade deles sendo ou não benéfica para este Pokémon.",
		shortDesc: "Os golpes deste Pokémon e seus efeitos ignoram as habilidades de outros Pokémon.",
		gen8: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam ou não alvos do golpe deste Pokémon, e a habilidade deles sendo ou não benéfica para este Pokémon.",
		},
		gen7: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam ou não alvos do golpe deste Pokémon, e a habilidade deles sendo ou não benéfica para este Pokémon.",
		},
		gen6: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam ou não alvos do golpe deste Pokémon, e a habilidade deles sendo ou não benéfica para este Pokémon.",
		},
		gen5: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Battle Armor, Big Pecks, Clear Body, Contrary, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Friend Guard, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam ou não alvos do golpe deste Pokémon, e a habilidade deles sendo ou não benéfica para este Pokémon.",
		},
		gen4: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightning Rod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke e Wonder Guard. Isso afeta todos os outros Pokémon em campo, sejam ou não alvos do golpe deste Pokémon. O modificador de Ataque da habilidade Flower Gift de um aliado não é anulado.",
		},
		start: "  {POKEMON} quebra o molde!",
	},
	moody: {
		desc: "No fim de cada turno, um atributo aleatório deste Pokémon, exceto precisão e evasão, aumenta em 2 estágios e outro atributo diminui em 1 estágio.",
		shortDesc: "+2 em um atributo aleatório (exceto precisão/evasão) e -1 em outro a cada turno.",
		gen7: {
			desc: "No fim de cada turno, um atributo aleatório deste Pokémon aumenta em 2 estágios e outro atributo diminui em 1 estágio.",
			shortDesc: "Aumenta um atributo aleatório em 2 e diminui outro em 1 no fim de cada turno.",
		},
	},
	motordrive: {
		desc: "Este Pokémon é imune a golpes do tipo Electric e aumenta sua Velocidade em 1 estágio quando atingido por um golpe do tipo Electric.",
		shortDesc: "Velocidade +1 estágio se atingido por golpe do tipo Electric; imune ao tipo Electric.",
	},
	moxie: {
		desc: "O Ataque deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon.",
		shortDesc: "O Ataque deste Pokémon aumenta em 1 estágio se ele atacar e nocautear outro Pokémon.",
	},
	multiscale: {
		shortDesc: "Se este Pokémon estiver com HP cheio, o dano recebido de ataques é reduzido à metade.",
	},
	multitype: {
		shortDesc: "Se este Pokémon for um Arceus, seu tipo muda conforme a Plate que estiver segurando.",
		gen7: {
			shortDesc: "Se este Pokémon for um Arceus, seu tipo muda conforme a Plate ou Z-Crystal que segura.",
		},
		gen6: {
			shortDesc: "Se este Pokémon for um Arceus, seu tipo muda conforme a Plate que estiver segurando.",
		},
		gen4: {
			desc: "Se este Pokémon for um Arceus, seu tipo muda conforme a Plate que estiver segurando. Este Pokémon não pode perder o item segurado por causa do ataque de outro Pokémon.",
		},
	},
	mummy: {
		desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Mummy. Não afeta Pokémon com as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Mummy, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode ou Zero to Hero.",
		shortDesc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Mummy.",
		gen8: {
			desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Mummy. Não afeta Pokémon com as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Mummy, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode.",
		},
		gen7: {
			desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Mummy. Não afeta Pokémon com as habilidades Battle Bond, Comatose, Disguise, Multitype, Mummy, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode.",
		},
		gen6: {
			desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Mummy. Não afeta Pokémon com as habilidades Multitype, Mummy ou Stance Change.",
		},
		gen5: {
			desc: "Pokémon que fazem contato com este Pokémon têm a habilidade trocada para Mummy. Não afeta Pokémon com as habilidades Multitype ou Mummy.",
		},
		changeAbility: "  A habilidade de {TARGET} se tornou Mummy!",
	},
	myceliummight: {
		desc: "Os golpes de status deste Pokémon ignoram certas habilidades de outros Pokémon e agem por último entre os Pokémon que usam golpes de prioridade igual ou maior.",
		shortDesc: "Golpes de status agem por último em sua faixa de prioridade e ignoram habilidades.",
	},
	naturalcure: {
		shortDesc: "Este Pokémon tem sua condição de status não volátil curada quando sai de campo.",
		activate: "  ({POKEMON} foi curado por Natural Cure!)",
	},
	neuroforce: {
		desc: "Os ataques deste Pokémon que são superefetivos contra o alvo têm o dano multiplicado por 1,25.",
		shortDesc: "Os ataques deste Pokémon superefetivos contra o alvo causam 1,25× de dano.",
	},
	neutralizinggas: {
		desc: "Enquanto este Pokémon estiver ativo, as habilidades não têm efeito. Esta habilidade é ativada antes das armadilhas de campo e de outras habilidades. Não afeta as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Neutralizing Gas, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode ou Zero to Hero.",
		shortDesc: "Enquanto este Pokémon estiver ativo, as habilidades não têm efeito.",
		gen8: {
			desc: "Enquanto este Pokémon estiver ativo, as habilidades não têm efeito. Esta habilidade é ativada antes das armadilhas de campo e de outras habilidades. Não afeta as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Neutralizing Gas, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode.",
		},
		start: "  Um gás neutralizante tomou conta da área!",
		end: "  Os efeitos do gás neutralizante passaram!",
	},
	noguard: {
		shortDesc: "Todo golpe usado por ou contra este Pokémon sempre acerta.",
	},
	normalize: {
		desc: "Os golpes deste Pokémon passam a ser do tipo Normal e têm o poder multiplicado por 1,2. Este efeito ocorre antes de outros efeitos que mudam o tipo de um golpe.",
		shortDesc: "Os golpes deste Pokémon passam a ser do tipo Normal e têm 1,2× de poder.",
		gen6: {
			desc: "Os golpes deste Pokémon passam a ser do tipo Normal. Este efeito ocorre antes de outros efeitos que mudam o tipo de um golpe.",
			shortDesc: "Os golpes deste Pokémon passam a ser do tipo Normal.",
		},
		gen4: {
			desc: "Os golpes deste Pokémon passam a ser do tipo Normal. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, exceto Struggle.",
		},
	},
	oblivious: {
		desc: "Este Pokémon não pode ficar apaixonado nem sob Taunt. Obter esta habilidade enquanto apaixonado ou sob Taunt o cura. Este Pokémon é imune ao efeito da habilidade Intimidate.",
		shortDesc: "Este Pokémon não pode ficar apaixonado nem sob Taunt. Imune a Intimidate.",
		gen7: {
			desc: "Este Pokémon não pode ficar apaixonado nem sob Taunt. Obter esta habilidade enquanto apaixonado ou sob Taunt o cura.",
			shortDesc: "Este Pokémon não pode ficar apaixonado nem sob Taunt.",
		},
		gen5: {
			desc: "Este Pokémon não pode ficar apaixonado. Obter esta habilidade enquanto apaixonado o cura.",
			shortDesc: "Não pode ficar apaixonado. Obter esta habilidade enquanto apaixonado o cura.",
		},
	},
	opportunist: {
		shortDesc: "Quando um adversário tem um estágio de atributo aumentado, este Pokémon o copia.",
	},
	orichalcumpulse: {
		shortDesc: "Ao entrar em campo, invoca sol. Durante o sol, o Ataque é 1,3333×.",
		start: "  {POKEMON} intensificou a luz do sol, levando seu pulso ancestral ao frenesi!",
		activate: "  {POKEMON} se aqueceu à luz do sol, levando seu pulso ancestral ao frenesi!",
	},
	overcoat: {
		desc: "Este Pokémon é imune a golpes de pó, ao dano da tempestade de areia e aos efeitos de Rage Powder e da habilidade Effect Spore.",
		shortDesc: "Este Pokémon é imune a golpes de pó, ao dano da tempestade de areia e a Effect Spore.",
		gen8: {
			desc: "Este Pokémon é imune a golpes de pó, ao dano da tempestade de areia ou do granizo e aos efeitos de Rage Powder e da habilidade Effect Spore.",
			shortDesc: "Imune a golpes de pó, ao dano da tempestade de areia ou do granizo e a Effect Spore.",
		},
		gen5: {
			desc: "Este Pokémon é imune ao dano da tempestade de areia ou do granizo.",
			shortDesc: "Este Pokémon é imune ao dano da tempestade de areia ou do granizo.",
		},
	},
	overgrow: {
		desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Grass.",
		shortDesc: "Com 1/3 ou menos do HP máximo, o atributo ofensivo é 1,5× com ataques do tipo Grass.",
		gen4: {
			desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seus ataques do tipo Grass têm o poder multiplicado por 1,5.",
			shortDesc: "Com 1/3 ou menos do HP máximo, seus ataques do tipo Grass têm 1,5× de poder.",
		},
	},
	owntempo: {
		desc: "Este Pokémon não pode ficar confuso. Obter esta habilidade enquanto confuso o cura. Este Pokémon é imune ao efeito da habilidade Intimidate.",
		shortDesc: "Este Pokémon não pode ficar confuso. Imune a Intimidate.",
		gen7: {
			desc: "Este Pokémon não pode ficar confuso. Obter esta habilidade enquanto confuso o cura.",
			shortDesc: "Este Pokémon não pode ficar confuso.",
		},
	},
	parentalbond: {
		desc: "Os golpes de dano deste Pokémon se tornam golpes de múltiplos acertos que acertam duas vezes. O segundo acerto tem o dano reduzido a 1/4. Não afeta Doom Desire, Dragon Darts, Dynamax Cannon, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, nenhum golpe de múltiplos acertos, nenhum golpe com vários alvos nem nenhum golpe de dois turnos.",
		shortDesc: "Golpes de dano deste Pokémon acertam duas vezes; o segundo acerto causa 1/4 do dano.",
		gen8: {
			desc: "Os golpes de dano deste Pokémon se tornam golpes de múltiplos acertos que acertam duas vezes. O segundo acerto tem o dano reduzido a 1/4. Não afeta Doom Desire, Dragon Darts, Dynamax Cannon, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, nenhum golpe de múltiplos acertos, nenhum golpe com vários alvos, nenhum golpe de dois turnos nem nenhum Max Move.",
		},
		gen7: {
			desc: "Os golpes de dano deste Pokémon se tornam golpes de múltiplos acertos que acertam duas vezes. O segundo acerto tem o dano reduzido a 1/4. Não afeta Doom Desire, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, nenhum golpe de múltiplos acertos, nenhum golpe com vários alvos, nenhum golpe de dois turnos nem nenhum Z-Move.",
		},
		gen6: {
			desc: "Os golpes de dano deste Pokémon se tornam golpes de múltiplos acertos que acertam duas vezes. O segundo acerto tem o dano reduzido à metade. Não afeta Doom Desire, Endeavor, Explosion, Final Gambit, Fling, Future Sight, Ice Ball, Rollout, Self-Destruct, nenhum golpe de múltiplos acertos, nenhum golpe com vários alvos nem nenhum golpe de dois turnos.",
			shortDesc: "Golpes de dano deste Pokémon acertam duas vezes; o segundo causa metade do dano.",
		},
	},
	pastelveil: {
		desc: "Este Pokémon e seus aliados não podem ser envenenados. Obter esta habilidade enquanto este Pokémon ou seu aliado está envenenado cura ambos. Se esta habilidade estiver sendo ignorada durante um efeito que causa envenenamento, este Pokémon é curado imediatamente, mas seu aliado não.",
		shortDesc: "Ele e aliados não podem ser envenenados. Ao entrar em campo, cura aliados envenenados.",
	},
	perishbody: {
		desc: "Fazer contato com este Pokémon inicia o efeito de Perish Song para ele e para o atacante. Este efeito não ocorre para este Pokémon se o atacante já tiver uma contagem de Perish Song.",
		shortDesc: "Fazer contato com este Pokémon inicia o efeito de Perish Song para ele e para o atacante.",
		start: "  Os dois Pokémon desmaiarão em três turnos!",
	},
	pickpocket: {
		desc: "Se este Pokémon não tiver item e for atingido por um golpe de contato, ele rouba o item do atacante. Este efeito se aplica após todos os acertos de um golpe de múltiplos acertos. Este efeito é impedido se o golpe teve um efeito secundário removido pela habilidade Sheer Force.",
		shortDesc: "Se não tiver item e for atingido por golpe de contato, este Pokémon rouba o item do atacante.",
	},
	pickup: {
		desc: "No fim de cada turno, se este Pokémon não estiver segurando um item e pelo menos um Pokémon adjacente tiver usado um item neste turno, um desses Pokémon é escolhido aleatoriamente e este Pokémon obtém o último item usado por ele. Um item não é considerado o último usado se for um Air Balloon estourado, se tiver sido pego por outro Pokémon com esta habilidade, ou se tiver sido perdido para Bug Bite, Corrosive Gas, Covet, Incinerate, Knock Off, Pluck ou Thief. Itens arremessados com Fling podem ser pegos.",
		shortDesc: "Se este Pokémon não tiver item, pega um usado por um Pokémon adjacente neste turno.",
		gen7: {
			desc: "No fim de cada turno, se este Pokémon não estiver segurando um item e pelo menos um Pokémon adjacente tiver usado um item neste turno, um desses Pokémon é escolhido aleatoriamente e este Pokémon obtém o último item usado por ele. Um item não é considerado o último usado se for um Air Balloon estourado, se tiver sido pego por outro Pokémon com esta habilidade, ou se tiver sido perdido para Bug Bite, Covet, Incinerate, Knock Off, Pluck ou Thief. Itens arremessados com Fling podem ser pegos.",
		},
		gen4: {
			desc: "Sem uso competitivo.",
			shortDesc: "Sem uso competitivo.",
		},
	},
	piercingdrill: {
		shortDesc: "Golpes de contato deste Pokémon ignoram a proteção do alvo e causam 1/4 do dano normal.",
	},
	pixilate: {
		desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Fairy e têm o poder multiplicado por 1,2. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
		shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Fairy e têm 1,2× de poder.",
		gen6: {
			desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Fairy e têm o poder multiplicado por 1,3. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
			shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Fairy e têm 1,3× de poder.",
		},
	},
	plus: {
		desc: "Se um aliado ativo tiver esta habilidade ou a habilidade Minus, o Ataque Especial deste Pokémon é multiplicado por 1,5.",
		shortDesc: "Se um aliado ativo tiver esta habilidade ou Minus, o Sp. Atk deste Pokémon é 1,5×.",
		gen4: {
			desc: "Se um aliado ativo tiver a habilidade Minus, o Ataque Especial deste Pokémon é multiplicado por 1,5.",
			shortDesc: "Se um aliado ativo tiver a habilidade Minus, o Sp. Atk deste Pokémon é 1,5×.",
		},
		gen3: {
			desc: "Se um Pokémon ativo tiver a habilidade Minus, o Ataque Especial deste Pokémon é multiplicado por 1,5.",
			shortDesc: "Se um Pokémon ativo tiver a habilidade Minus, o Sp. Atk deste Pokémon é 1,5×.",
		},
	},
	poisonheal: {
		desc: "Se este Pokémon estiver envenenado, ele recupera 1/8 do HP máximo, arredondado para baixo, no fim de cada turno, em vez de perder HP.",
		shortDesc: "Envenenado, este Pokémon recupera 1/8 do HP máximo a cada turno; não perde HP.",
	},
	poisonpoint: {
		shortDesc: "30% de chance de um Pokémon que faça contato com este Pokémon ser envenenado.",
		gen4: {
			desc: "30% de chance de um Pokémon que faça contato com este Pokémon ser envenenado. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "1/3 de chance de um Pokémon que faça contato com este Pokémon ser envenenado. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
			shortDesc: "1/3 de chance de um Pokémon que faça contato com este Pokémon ser envenenado.",
		},
	},
	poisonpuppeteer: {
		desc: "Se este Pokémon for um Pecharunt e envenenar ou envenenar gravemente um alvo, o alvo também fica confuso.",
		shortDesc: "Pecharunt: se este Pokémon envenenar um alvo, o alvo também fica confuso.",
	},
	poisontouch: {
		desc: "Os golpes de contato deste Pokémon têm 30% de chance de envenenar. Este efeito ocorre após a chance de efeito secundário próprio do golpe.",
		shortDesc: "Os golpes de contato deste Pokémon têm 30% de chance de envenenar.",
	},
	powerconstruct: {
		desc: "Se este Pokémon for um Zygarde na forma 10% ou 50%, ele muda para a Complete Forme quando tiver 1/2 ou menos do HP máximo no fim do turno.",
		shortDesc: "Zygarde 10%/50%: vira Complete com 1/2 do HP máximo ou menos no fim do turno.",
		activate: "  Você sente a presença de muitos!",
		transform: "{POKEMON} se transformou em sua Complete Forme!",
	},
	powerofalchemy: {
		desc: "Este Pokémon copia a habilidade de um aliado que desmaia. As habilidades que não podem ser copiadas são As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Flower Gift, Forecast, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Trace, Wonder Guard, Zen Mode e Zero to Hero.",
		shortDesc: "Este Pokémon copia a habilidade de um aliado que desmaia.",
		gen8: {
			desc: "Este Pokémon copia a habilidade de um aliado que desmaia. As habilidades que não podem ser copiadas são As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard e Zen Mode.",
		},
		gen7: {
			desc: "Este Pokémon copia a habilidade de um aliado que desmaia. As habilidades que não podem ser copiadas são Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard e Zen Mode.",
		},
	},
	powerspot: {
		desc: "Os aliados deste Pokémon têm o poder de seus golpes multiplicado por 1,3. Isso afeta Doom Desire e Future Sight, mesmo que o usuário não esteja em campo.",
		shortDesc: "Os aliados deste Pokémon têm o poder de seus golpes multiplicado por 1,3.",
	},
	prankster: {
		desc: "Os golpes que não causam dano deste Pokémon têm a prioridade aumentada em 1. Pokémon adversários do tipo Dark são imunes a esses golpes, e a qualquer golpe chamado por esses golpes, se o usuário resultante do golpe tiver esta habilidade.",
		shortDesc: "Golpes de status deste Pokémon têm prioridade +1, mas Pokémon do tipo Dark são imunes.",
		gen6: {
			desc: "Os golpes que não causam dano deste Pokémon têm a prioridade aumentada em 1.",
			shortDesc: "Os golpes que não causam dano deste Pokémon têm a prioridade aumentada em 1.",
		},
	},
	pressure: {
		desc: "Se este Pokémon for o alvo do golpe de um Pokémon adversário, esse golpe perde 1 PP adicional. Imprison, Snatch e Tera Blast também perdem 1 PP adicional quando usados por um Pokémon adversário, mas Sticky Web não.",
		shortDesc: "Se este Pokémon for o alvo do golpe de um oponente, esse golpe perde 1 PP adicional.",
		gen8: {
			desc: "Se este Pokémon for o alvo do golpe de um Pokémon adversário, esse golpe perde 1 PP adicional. Imprison e Snatch também perdem 1 PP adicional quando usados por um Pokémon adversário, mas Sticky Web não.",
		},
		gen5: {
			desc: "Se este Pokémon for o alvo do golpe de um Pokémon adversário, esse golpe perde 1 PP adicional. Imprison e Snatch também perdem 1 PP adicional quando usados por um Pokémon adversário.",
		},
		gen4: {
			desc: "Se este Pokémon for o alvo do golpe de outro Pokémon, esse golpe perde 1 PP adicional.",
			shortDesc: "Se este Pokémon for o alvo de um golpe, esse golpe perde 1 PP adicional.",
		},
		start: "  {POKEMON} está exercendo sua pressão!",
	},
	primordialsea: {
		desc: "Ao entrar em campo, o clima se torna chuva forte, que inclui todos os efeitos da chuva e impede a execução de golpes do tipo Fire que causam dano. Este clima continua em efeito até que esta habilidade não esteja mais ativa em nenhum Pokémon, ou até que o clima seja mudado pelas habilidades Delta Stream ou Desolate Land.",
		shortDesc: "Ao entrar em campo, começa uma chuva forte enquanto esta habilidade estiver ativa.",
	},
	prismarmor: {
		shortDesc: "Este Pokémon recebe 3/4 do dano de ataques superefetivos.",
	},
	propellertail: {
		shortDesc: "Seus golpes não podem ser redirecionados para outro alvo por nenhum efeito.",
	},
	protean: {
		desc: "O tipo deste Pokémon muda para o tipo do golpe que ele está prestes a usar. Este efeito ocorre depois de todos os efeitos que mudam o tipo de um golpe. Este efeito só pode ocorrer uma vez por entrada em campo, e somente se este Pokémon não estiver Terastalizado.",
		shortDesc: "O tipo deste Pokémon muda para o tipo do golpe que usa. Uma vez por entrada em campo.",
		gen8: {
			desc: "O tipo deste Pokémon muda para o tipo do golpe que ele está prestes a usar. Este efeito ocorre depois de todos os efeitos que mudam o tipo de um golpe.",
			shortDesc: "O tipo deste Pokémon muda para o tipo do golpe que ele está prestes a usar.",
		},
	},
	protosynthesis: {
		desc: "Se o sol estiver ativo ou este Pokémon usar Booster Energy que está segurando, o maior atributo deste Pokémon é multiplicado por 1,3, ou por 1,5 se o maior atributo for a Velocidade. Mudanças de estágio de atributos são consideradas no momento em que esta habilidade é ativada. Em caso de empate entre atributos, a prioridade é Ataque, Defesa, Ataque Especial, Defesa Especial e Velocidade, nessa ordem. Se este efeito foi iniciado pelo sol, Booster Energy segurado não é ativado e o efeito termina quando o sol deixa de estar ativo. Se este efeito foi iniciado por Booster Energy segurado, ele termina quando este Pokémon deixa de estar ativo.",
		shortDesc: "Sol ativo ou Booster Energy usado: maior atributo 1,3×, ou 1,5× se for Velocidade.",
		activate: "  O sol intenso ativou Protosynthesis de {POKEMON}!",
		activateFromItem: "  {POKEMON} usou Booster Energy para ativar Protosynthesis!",
		start: "  O atributo {STAT} de {POKEMON} foi intensificado!",
		end: "  Os efeitos de Protosynthesis de {POKEMON} passaram!",
	},
	psychicsurge: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca Psychic Terrain.",
	},
	punkrock: {
		desc: "Os golpes sonoros deste Pokémon têm o poder multiplicado por 1,3. Este Pokémon recebe metade do dano de golpes sonoros.",
		shortDesc: "Este Pokémon recebe 1/2 do dano de golpes sonoros. Os seus têm 1,3× de poder.",
	},
	purepower: {
		shortDesc: "O Ataque deste Pokémon é dobrado.",
	},
	purifyingsalt: {
		desc: "Este Pokémon não pode ser afetado por condições de status não voláteis nem por Yawn. Se um Pokémon usar um ataque do tipo Ghost contra este Pokémon, o atributo ofensivo dele é reduzido à metade no cálculo do dano a este Pokémon.",
		shortDesc: "Dano do tipo Ghost contra ele usa metade do atributo ofensivo; não recebe status.",
	},
	quarkdrive: {
		desc: "Se Electric Terrain estiver ativo ou este Pokémon usar Booster Energy que está segurando, o maior atributo deste Pokémon é multiplicado por 1,3, ou por 1,5 se o maior atributo for a Velocidade. Mudanças de estágio de atributos são consideradas no momento em que esta habilidade é ativada. Em caso de empate entre atributos, a prioridade é Ataque, Defesa, Ataque Especial, Defesa Especial e Velocidade, nessa ordem. Se este efeito foi iniciado por Electric Terrain, Booster Energy segurado não é ativado e o efeito termina quando Electric Terrain deixa de estar ativo. Se este efeito foi iniciado por Booster Energy segurado, ele termina quando este Pokémon deixa de estar ativo.",
		shortDesc: "Electric Terrain ou Booster Energy usado: maior atributo 1,3×, ou 1,5× se Velocidade.",
		activate: "  Electric Terrain ativou Quark Drive de {POKEMON}!",
		activateFromItem: "  {POKEMON} usou Booster Energy para ativar Quark Drive!",
		start: "  O atributo {STAT} de {POKEMON} foi intensificado!",
		end: "  Os efeitos de Quark Drive de {POKEMON} passaram!",
	},
	queenlymajesty: {
		desc: "Golpes de prioridade usados por Pokémon adversários contra este Pokémon ou seus aliados não têm efeito.",
		shortDesc: "Este Pokémon e seus aliados ficam protegidos de golpes de prioridade dos adversários.",
	},
	quickdraw: {
		shortDesc: "30% de chance de agir primeiro em sua faixa de prioridade com golpes de ataque.",
		activate: "  Quick Draw fez {POKEMON} agir mais rápido!",
	},
	quickfeet: {
		desc: "Se este Pokémon tiver uma condição de status não volátil, sua Velocidade é multiplicada por 1,5. Este Pokémon ignora o efeito da paralisia que reduz a Velocidade à metade.",
		shortDesc: "Com condição de status, Velocidade 1,5×; ignora a queda de Velocidade da paralisia.",
		gen6: {
			desc: "Se este Pokémon tiver uma condição de status não volátil, sua Velocidade é multiplicada por 1,5. Este Pokémon ignora o efeito da paralisia que reduz a Velocidade a 1/4.",
		},
	},
	raindish: {
		desc: "Se a chuva estiver ativa, este Pokémon recupera 1/16 do HP máximo, arredondado para baixo, no fim de cada turno. Este efeito é impedido se este Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Se a chuva estiver ativa, este Pokémon recupera 1/16 do HP máximo a cada turno.",
		gen7: {
			desc: "Se a chuva estiver ativa, este Pokémon recupera 1/16 do HP máximo, arredondado para baixo, no fim de cada turno.",
		},
	},
	rattled: {
		desc: "A Velocidade deste Pokémon aumenta em 1 estágio se ele for atingido por um ataque dos tipos Bug, Dark ou Ghost, ou se um Pokémon adversário o afetar com a habilidade Intimidate.",
		shortDesc: "Velocidade +1 se atingido por ataque dos tipos Bug, Dark ou Ghost, ou por Intimidate.",
		gen7: {
			desc: "A Velocidade deste Pokémon aumenta em 1 estágio se ele for atingido por um ataque dos tipos Bug, Dark ou Ghost.",
			shortDesc: "Velocidade +1 estágio se atingido por ataque dos tipos Bug, Dark ou Ghost.",
		},
	},
	receiver: {
		desc: "Este Pokémon copia a habilidade de um aliado que desmaia. As habilidades que não podem ser copiadas são As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Flower Gift, Forecast, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Trace, Wonder Guard, Zen Mode e Zero to Hero.",
		shortDesc: "Este Pokémon copia a habilidade de um aliado que desmaia.",
		gen8: {
			desc: "Este Pokémon copia a habilidade de um aliado que desmaia. As habilidades que não podem ser copiadas são As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard e Zen Mode.",
		},
		gen7: {
			desc: "Este Pokémon copia a habilidade de um aliado que desmaia. As habilidades que não podem ser copiadas são Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard e Zen Mode.",
		},
		changeAbility: "  {ABILITY} de {SOURCE} foi assumida!",
	},
	reckless: {
		desc: "Os ataques deste Pokémon com dano de recuo ou dano de queda têm o poder multiplicado por 1,2. Não afeta Struggle.",
		shortDesc: "Ataques com dano de recuo ou de queda têm 1,2× de poder; exceto Struggle.",
	},
	refrigerate: {
		desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Ice e têm o poder multiplicado por 1,2. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
		shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Ice e têm 1,2× de poder.",
		gen6: {
			desc: "Os golpes do tipo Normal deste Pokémon se tornam golpes do tipo Ice e têm o poder multiplicado por 1,3. Este efeito ocorre depois de outros efeitos que mudam o tipo de um golpe, mas antes dos efeitos de Ion Deluge e Electrify.",
			shortDesc: "Golpes do tipo Normal deste Pokémon viram do tipo Ice e têm 1,3× de poder.",
		},
	},
	regenerator: {
		shortDesc: "Este Pokémon recupera 1/3 do HP máximo, arredondado para baixo, quando sai de campo.",
	},
	ripen: {
		desc: "Quando este Pokémon come certas Berries, os efeitos são dobrados. Berries que recuperam HP ou PP têm a quantidade dobrada, Berries que aumentam estágios de atributos têm a quantidade dobrada, Berries que reduzem o dano recebido à metade o reduzem a 1/4, e Jaboca Berry ou Rowap Berry faz o atacante perder 1/4 do HP máximo, arredondado para baixo.",
		shortDesc: "Quando este Pokémon come certas Berries, os efeitos são dobrados.",
	},
	rivalry: {
		desc: "Os ataques deste Pokémon têm o poder multiplicado por 1,25 contra alvos do mesmo gênero ou por 0,75 contra alvos do gênero oposto. Não há modificador se este Pokémon ou o alvo não tiver gênero.",
		shortDesc: "Ataques deste Pokémon causam 1,25× em alvos do mesmo gênero e 0,75× no gênero oposto.",
	},
	rkssystem: {
		shortDesc: "Se for um Silvally, seu tipo muda conforme a Memory que estiver segurando.",
	},
	rockhead: {
		desc: "Este Pokémon não sofre dano de recuo, exceto o de Struggle. Não afeta o dano de Life Orb nem o dano de queda.",
		shortDesc: "Este Pokémon não sofre dano de recuo, exceto de Struggle/Life Orb/dano de queda.",
		gen3: {
			desc: "Este Pokémon não sofre dano de recuo, exceto o de Struggle. Não afeta o dano de queda.",
			shortDesc: "Este Pokémon não sofre dano de recuo, exceto de Struggle e dano de queda.",
		},
	},
	rockypayload: {
		shortDesc: "Seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Rock.",
	},
	roughskin: {
		desc: "Pokémon que fazem contato com este Pokémon perdem 1/8 do HP máximo, arredondado para baixo.",
		shortDesc: "Pokémon que fazem contato com este Pokémon perdem 1/8 do HP máximo.",
		gen4: {
			desc: "Pokémon que fazem contato com este Pokémon perdem 1/8 do HP máximo, arredondado para baixo. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "Pokémon que fazem contato com este Pokémon perdem 1/16 do HP máximo, arredondado para baixo. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
			shortDesc: "Pokémon que fazem contato com este Pokémon perdem 1/16 do HP máximo.",
		},
		damage: "  {POKEMON} foi ferido!",
	},
	runaway: {
		shortDesc: "Sem uso competitivo.",
	},
	sandforce: {
		desc: "Se houver tempestade de areia, os ataques dos tipos Ground, Rock e Steel deste Pokémon têm o poder multiplicado por 1,3. Este Pokémon não sofre dano da tempestade de areia.",
		shortDesc: "Ataques dos tipos Ground/Rock/Steel têm 1,3× na tempestade de areia; imune a ela.",
	},
	sandrush: {
		desc: "Se houver tempestade de areia, a Velocidade deste Pokémon dobra. Este Pokémon não sofre dano da tempestade de areia.",
		shortDesc: "Se houver tempestade de areia, a Velocidade deste Pokémon dobra; imune a ela.",
	},
	sandspit: {
		shortDesc: "Quando este Pokémon é atingido por um ataque, começa uma tempestade de areia.",
		gen8: {
			desc: "Quando este Pokémon é atingido por um ataque, começa uma tempestade de areia. Este efeito ocorre depois dos efeitos de Max Moves e G-Max Moves.",
		},
	},
	sandstream: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca uma tempestade de areia.",
	},
	sandveil: {
		desc: "Se houver tempestade de areia, a precisão dos golpes usados contra este Pokémon é multiplicada por 0,8. Este Pokémon não sofre dano da tempestade de areia.",
		shortDesc: "Se houver tempestade de areia, a evasão deste Pokémon é 1,25×; imune a ela.",
	},
	sapsipper: {
		desc: "Este Pokémon é imune a golpes do tipo Grass e aumenta seu Ataque em 1 estágio quando atingido por um golpe do tipo Grass.",
		shortDesc: "Atk sobe 1 estágio se atingido por golpe do tipo Grass; imune ao tipo Grass.",
	},
	schooling: {
		desc: "Ao entrar em campo, se este Pokémon for Wishiwashi de nível 20 ou mais e tiver mais de 1/4 do HP máximo restante, ele muda para School Form. Se estiver em School Form e seu HP cair para 1/4 do HP máximo ou menos, muda para Solo Form no fim do turno. Se estiver em Solo Form e seu HP for maior que 1/4 do HP máximo no fim do turno, muda para School Form.",
		shortDesc: "Se for Wishiwashi, muda para School Form com > 1/4 do HP máx.; senão, Solo Form.",
		transform: "{POKEMON} formou um cardume!",
		transformEnd: "{POKEMON} desfez o cardume!",
	},
	scrappy: {
		desc: "Este Pokémon pode atingir Pokémon do tipo Ghost com golpes dos tipos Normal e Fighting. Este Pokémon é imune ao efeito da habilidade Intimidate.",
		shortDesc: "Golpes dos tipos Fighting e Normal atingem o tipo Ghost. Imune a Intimidate.",
		gen7: {
			desc: "Este Pokémon pode atingir Pokémon do tipo Ghost com golpes dos tipos Normal e Fighting.",
			shortDesc: "Golpes dos tipos Normal e Fighting deste Pokémon atingem Pokémon do tipo Ghost.",
		},
	},
	screencleaner: {
		shortDesc: "Ao entrar em campo, encerra Aurora Veil, Light Screen e Reflect dos dois lados.",
	},
	seedsower: {
		shortDesc: "Quando este Pokémon é atingido por um ataque, começa o efeito de Grassy Terrain.",
	},
	serenegrace: {
		desc: "Os golpes deste Pokémon têm a chance de efeito secundário dobrada. Este efeito se acumula com o efeito Rainbow, exceto em efeitos secundários que fazem o alvo recuar.",
		shortDesc: "Os golpes deste Pokémon têm a chance de efeito secundário dobrada.",
		gen4: {
			desc: "Os golpes deste Pokémon têm a chance de efeito secundário dobrada.",
		},
	},
	shadowshield: {
		shortDesc: "Se este Pokémon estiver com HP cheio, o dano recebido de ataques é reduzido à metade.",
	},
	shadowtag: {
		desc: "Impede que Pokémon adversários escolham sair de campo, a menos que estejam segurando Shed Shell, sejam do tipo Ghost ou também tenham esta habilidade.",
		shortDesc: "Impede oponentes de escolher trocar, a menos que também tenham esta habilidade.",
		gen6: {
			desc: "Impede que Pokémon adversários adjacentes escolham sair de campo, a menos que estejam segurando Shed Shell, sejam do tipo Ghost ou também tenham esta habilidade.",
			shortDesc: "Impede oponentes adjacentes de trocar, a menos que também tenham esta habilidade.",
		},
		gen5: {
			desc: "Impede que Pokémon adversários adjacentes escolham sair de campo, a menos que estejam segurando Shed Shell ou também tenham esta habilidade.",
		},
		gen4: {
			desc: "Impede que Pokémon adversários escolham sair de campo, a menos que estejam segurando Shed Shell ou também tenham esta habilidade.",
			shortDesc: "Impede oponentes de escolher trocar, a menos que também tenham esta habilidade.",
		},
		gen3: {
			desc: "Impede que Pokémon adversários escolham sair de campo.",
			shortDesc: "Impede que Pokémon adversários escolham sair de campo.",
		},
	},
	sharpness: {
		shortDesc: "Os golpes cortantes deste Pokémon têm o poder multiplicado por 1,5.",
	},
	shedskin: {
		desc: "Este Pokémon tem 33% de chance de ter sua condição de status não volátil curada no fim de cada turno.",
		shortDesc: "Este Pokémon tem 33% de chance de ter seu status curado no fim de cada turno.",
	},
	sheerforce: {
		desc: "Os ataques deste Pokémon com efeitos secundários têm o poder multiplicado por 1,3, mas os efeitos secundários são removidos. Se um efeito secundário foi removido, também são removidos o dano de recuo de Life Orb e a recuperação de Shell Bell do usuário, e é impedida a ativação de Anger Shell, Berserk, Color Change, Emergency Exit, Pickpocket, Wimp Out, Red Card, Eject Button, Kee Berry e Maranga Berry do alvo.",
		shortDesc: "Ataques deste Pokémon com efeitos secundários têm 1,3× de poder; anula os efeitos.",
		gen8: {
			desc: "Os ataques deste Pokémon com efeitos secundários têm o poder multiplicado por 1,3, mas os efeitos secundários são removidos. Se um efeito secundário foi removido, também são removidos o dano de recuo de Life Orb e a recuperação de Shell Bell do usuário, e é impedida a ativação de Berserk, Color Change, Emergency Exit, Pickpocket, Wimp Out, Red Card, Eject Button, Kee Berry e Maranga Berry do alvo.",
		},
		gen6: {
			desc: "Os ataques deste Pokémon com efeitos secundários têm o poder multiplicado por 1,3, mas os efeitos secundários são removidos. Se um efeito secundário foi removido, também são removidos o dano de recuo de Life Orb e a recuperação de Shell Bell do usuário, e é impedida a ativação de Color Change, Pickpocket, Red Card, Eject Button, Kee Berry e Maranga Berry do alvo.",
		},
		gen5: {
			desc: "Os ataques deste Pokémon com efeitos secundários têm o poder multiplicado por 1,3, mas os efeitos secundários são removidos. Se um efeito secundário foi removido, também são removidos o dano de recuo de Life Orb e a recuperação de Shell Bell do usuário, e é impedida a ativação de Color Change, Pickpocket, Red Card e Eject Button do alvo.",
		},
	},
	shellarmor: {
		shortDesc: "Este Pokémon não pode sofrer acertos críticos.",
	},
	shielddust: {
		desc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer este Pokémon recuar ou diminuir os estágios de atributos deste Pokémon, além de Anchor Shot, Eerie Spell, Fling, Psychic Noise, Salt Cure, Spirit Shackle, Syrup Bomb e Throat Chop. O efeito de Sparkling Aria é impedido se este Pokémon for o único alvo. Os efeitos secundários adicionados por King's Rock, Razor Fang e pelas habilidades Poison Touch, Stench e Toxic Chain também são impedidos contra este Pokémon.",
		shortDesc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon.",
		gen8: {
			desc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer este Pokémon recuar ou diminuir os estágios de atributos deste Pokémon, além de Anchor Shot, Eerie Spell, Fling, Spirit Shackle e Throat Chop. O efeito de Sparkling Aria é impedido se este Pokémon for o único alvo. Os efeitos secundários adicionados por King's Rock, Razor Fang e pelas habilidades Poison Touch e Stench também são impedidos contra este Pokémon.",
		},
		gen7: {
			desc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer este Pokémon recuar ou diminuir os estágios de atributos deste Pokémon, além de Anchor Shot, Fling, Spirit Shackle e Throat Chop. O efeito de Sparkling Aria é impedido se este Pokémon for o único alvo. Os efeitos secundários adicionados por King's Rock, Razor Fang e pelas habilidades Poison Touch e Stench também são impedidos contra este Pokémon.",
		},
		gen6: {
			desc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer este Pokémon recuar ou diminuir os estágios de atributos deste Pokémon, além de Fling. Os efeitos secundários adicionados por King's Rock, Razor Fang e pelas habilidades Poison Touch e Stench também são impedidos contra este Pokémon.",
		},
		gen4: {
			desc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer este Pokémon recuar ou diminuir os estágios de atributos deste Pokémon, além de Fling. Os efeitos secundários adicionados por King's Rock e Razor Fang também são impedidos contra este Pokémon.",
		},
		gen3: {
			desc: "Este Pokémon não é afetado pelo efeito secundário do ataque de outro Pokémon. Os ataques com efeitos secundários impedidos incluem os que têm chance (mesmo de 100%) de paralisar, fazer dormir, congelar, queimar, envenenar, confundir, fazer este Pokémon recuar ou diminuir os estágios de atributos deste Pokémon. O efeito secundário adicionado por King's Rock também é impedido contra este Pokémon.",
		},
	},
	shieldsdown: {
		desc: "Se este Pokémon for Minior, ele muda para sua forma Core se tiver 1/2 ou menos do HP máximo, e muda para Meteor Form se tiver mais de 1/2 do HP máximo. Essa verificação é feita ao entrar em campo e no fim de cada turno. Enquanto estiver em Meteor Form, não pode ser afetado por condição de status não volátil nem por Yawn.",
		shortDesc: "Se Minior, ao entrar/fim do turno vira Core com 1/2 do HP máx. ou menos; senão, Meteor.",
		transform: "Shields Down desativou!\n({POKEMON} se protegeu com a carapaça.)",
		transformEnd: "Shields Down ativou!\n({POKEMON} deixou de se proteger com a carapaça.)",
	},
	simple: {
		shortDesc: "Quando um estágio de atributo deste Pokémon é aumentado ou diminuído, o valor dobra.",
		gen7: {
			desc: "Quando um estágio de atributo deste Pokémon é aumentado ou diminuído, o valor dobra. Esta habilidade não afeta aumentos de estágio recebidos de efeitos de Z-Power que ocorrem antes do uso de um Z-Move de status.",
		},
		gen6: {
			desc: "Quando um estágio de atributo deste Pokémon é aumentado ou diminuído, o valor dobra.",
		},
		gen4: {
			desc: "Os estágios de atributos deste Pokémon são considerados dobrados nos cálculos de atributos. Um estágio não pode ser considerado maior que 6 nem menor que -6.",
			shortDesc: "Os estágios de atributos deste Pokémon contam em dobro nos cálculos de atributos.",
		},
	},
	skilllink: {
		desc: "Os ataques de múltiplos acertos deste Pokémon sempre acertam o número máximo de vezes. Triple Kick e Triple Axel não verificam a precisão no segundo e no terceiro acertos.",
		shortDesc: "Ataques de múltiplos acertos deste Pokémon sempre acertam o número máximo de vezes.",
		gen7: {
			desc: "Os ataques de múltiplos acertos deste Pokémon sempre acertam o número máximo de vezes. Triple Kick não verifica a precisão no segundo e no terceiro acertos.",
		},
		gen4: {
			desc: "Os ataques de múltiplos acertos deste Pokémon sempre acertam o número máximo de vezes. Não afeta Triple Kick.",
		},
	},
	slowstart: {
		shortDesc: "Ao entrar em campo, o Ataque e a Velocidade deste Pokémon caem à metade por 5 turnos.",
		gen7: {
			desc: "Ao entrar em campo, o Ataque e a Velocidade deste Pokémon caem à metade por 5 turnos. Durante o efeito, se este Pokémon usar um Z-Move genérico baseado em um golpe especial, seu Ataque Especial cai à metade durante o cálculo de dano.",
		},
		gen6: {
			desc: "Ao entrar em campo, o Ataque e a Velocidade deste Pokémon caem à metade por 5 turnos.",
		},
		start: "  {POKEMON} não consegue engrenar!",
		end: "  {POKEMON} finalmente engrenou!",
	},
	slushrush: {
		shortDesc: "Se houver neve, a Velocidade deste Pokémon dobra.",
		gen8: {
			shortDesc: "Se houver granizo, a Velocidade deste Pokémon dobra.",
		},
	},
	sniper: {
		shortDesc: "Se este Pokémon causar um acerto crítico, o dano é multiplicado por 1,5.",
	},
	snowcloak: {
		desc: "Se houver neve, a precisão dos golpes usados contra este Pokémon é multiplicada por 0,8.",
		shortDesc: "Se houver neve, a evasão deste Pokémon é 1,25×.",
		gen8: {
			desc: "Se houver granizo, a precisão dos golpes usados contra este Pokémon é multiplicada por 0,8. Este Pokémon não sofre dano do granizo.",
			shortDesc: "Se houver granizo, a evasão deste Pokémon é 1,25×; imune ao granizo.",
		},
	},
	snowwarning: {
		shortDesc: "Ao entrar em campo, este Pokémon invoca neve.",
		gen8: {
			shortDesc: "Ao entrar em campo, este Pokémon invoca granizo.",
		},
	},
	solarpower: {
		desc: "Se houver sol, o Ataque Especial deste Pokémon é multiplicado por 1,5 e ele perde 1/8 do HP máximo, arredondado para baixo, no fim de cada turno. Esses efeitos são impedidos se o Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Se houver sol, o Sp. Atk deste Pokémon é 1,5×; perde 1/8 do HP máx. por turno.",
		gen7: {
			desc: "Se houver sol, o Ataque Especial deste Pokémon é multiplicado por 1,5 e ele perde 1/8 do HP máximo, arredondado para baixo, no fim de cada turno.",
		},
	},
	solidrock: {
		shortDesc: "Este Pokémon recebe 3/4 do dano de ataques superefetivos.",
	},
	soulheart: {
		shortDesc: "O Ataque Especial deste Pokémon sobe 1 estágio quando outro Pokémon desmaia.",
	},
	soundproof: {
		shortDesc: "Este Pokémon é imune a golpes sonoros, exceto os que ele mesmo usar.",
		gen7: {
			shortDesc: "Este Pokémon é imune a golpes sonoros, incluindo Heal Bell.",
		},
		gen5: {
			shortDesc: "Este Pokémon é imune a golpes sonoros, exceto Heal Bell.",
		},
		gen4: {
			shortDesc: "Este Pokémon é imune a golpes sonoros, incluindo Heal Bell.",
		},
	},
	speedboost: {
		desc: "A Velocidade deste Pokémon sobe 1 estágio no fim de cada turno completo em que ele esteve em campo.",
		shortDesc: "A Velocidade deste Pokémon sobe 1 estágio no fim de cada turno completo em campo.",
	},
	spicyspray: {
		shortDesc: "Se este Pokémon for atingido por um ataque, o atacante fica queimado.",
	},
	stakeout: {
		shortDesc: "O atributo ofensivo deste Pokémon dobra contra um alvo que entrou em campo neste turno.",
	},
	stall: {
		shortDesc: "Age por último entre os Pokémon que usam golpes de prioridade igual ou maior.",
	},
	stalwart: {
		shortDesc: "Os golpes deste Pokémon não podem ser redirecionados a outro alvo por nenhum efeito.",
	},
	stamina: {
		shortDesc: "A Defesa deste Pokémon sobe 1 estágio depois que ele sofre dano de um golpe.",
	},
	stancechange: {
		desc: "Se este Pokémon for Aegislash, ele muda para Blade Forme antes de usar um golpe de ataque e muda para Shield Forme antes de usar King's Shield.",
		shortDesc: "Se Aegislash, muda para Blade Forme antes de atacar e para Shield antes de King's Shield.",
		gen6: {
			desc: "Se este Pokémon for Aegislash, ele muda para Blade Forme antes de tentar usar um golpe de ataque e muda para Shield Forme antes de tentar usar King's Shield.",
		},
		transform: "Mudou para Blade Forme!",
		transformEnd: "Mudou para Shield Forme!",
	},
	static: {
		shortDesc: "30% de chance de um Pokémon que fizer contato com este Pokémon ficar paralisado.",
		gen4: {
			desc: "30% de chance de um Pokémon que fizer contato com este Pokémon ficar paralisado. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "1/3 de chance de um Pokémon que fizer contato com este Pokémon ficar paralisado. Este efeito não ocorre se este Pokémon não perdeu HP com o ataque.",
			shortDesc: "1/3 de chance de um Pokémon que fizer contato com este Pokémon ficar paralisado.",
		},
	},
	steadfast: {
		shortDesc: "Se este Pokémon recuar, sua Velocidade sobe 1 estágio.",
	},
	steamengine: {
		desc: "A Velocidade deste Pokémon sobe 6 estágios depois que ele sofre dano de um golpe dos tipos Fire ou Water.",
		shortDesc: "Velocidade deste Pokémon sobe 6 estágios ao sofrer dano de golpes dos tipos Fire/Water.",
	},
	steelworker: {
		shortDesc: "O atributo ofensivo deste Pokémon é 1,5× ao usar um ataque do tipo Steel.",
	},
	steelyspirit: {
		desc: "Os golpes do tipo Steel deste Pokémon e de seus aliados têm o poder multiplicado por 1,5. Isso afeta Doom Desire mesmo que o usuário não esteja em campo.",
		shortDesc: "Golpes do tipo Steel deste Pokémon e de seus aliados têm o poder multiplicado por 1,5.",
	},
	stench: {
		desc: "Os ataques deste Pokémon sem chance de fazer o alvo recuar ganham 10% de chance de fazer o alvo recuar.",
		shortDesc: "Ataques deste Pokémon sem chance de fazer recuar ganham 10% de chance de recuo.",
		gen4: {
			desc: "Sem uso competitivo.",
			shortDesc: "Sem uso competitivo.",
		},
	},
	stickyhold: {
		desc: "Este Pokémon não pode perder o item segurado por causa da habilidade ou do ataque de outro Pokémon, a menos que o ataque nocauteie este Pokémon. Sticky Barb é transferido para outros Pokémon independentemente desta habilidade.",
		shortDesc: "Este Pokémon não perde o item segurado pela habilidade ou ataque de outro Pokémon.",
		gen4: {
			desc: "Este Pokémon não pode perder o item segurado por causa do ataque de outro Pokémon, mesmo que o ataque nocauteie este Pokémon. Sticky Barb é transferido para outros Pokémon independentemente desta habilidade.",
		},
		block: "  O item de {POKEMON} não pode ser removido!",
	},
	stormdrain: {
		desc: "Este Pokémon é imune a golpes do tipo Water e aumenta seu Ataque Especial em 1 estágio quando atingido por um golpe do tipo Water. Se este Pokémon não for o alvo de um golpe do tipo Water de alvo único usado por outro Pokémon, ele redireciona esse golpe para si, se estiver dentro do alcance do golpe. Se vários Pokémon puderem redirecionar com esta habilidade, o golpe vai para o de maior Velocidade ou, em caso de empate, para o que está com esta habilidade ativa há mais tempo.",
		shortDesc: "Atrai golpes do tipo Water para si e aumenta o Sp. Atk em 1; imune ao tipo Water.",
		gen4: {
			desc: "Se este Pokémon não for o alvo de um golpe do tipo Water de alvo único usado por outro Pokémon, ele redireciona esse golpe para si.",
			shortDesc: "Este Pokémon atrai para si golpes do tipo Water de alvo único.",
		},
	},
	strongjaw: {
		desc: "Os ataques de mordida deste Pokémon têm o poder multiplicado por 1,5.",
		shortDesc: "Ataques de mordida deste Pokémon têm 1,5× de poder. Bug Bite não é fortalecido.",
	},
	sturdy: {
		desc: "Se este Pokémon estiver com HP cheio, sobrevive a um golpe com pelo menos 1 HP. Golpes OHKO falham quando usados contra este Pokémon.",
		shortDesc: "Com HP cheio, este Pokémon sobrevive a um golpe com pelo menos 1 HP. Imune a OHKO.",
		gen4: {
			desc: "Golpes OHKO falham quando usados contra este Pokémon.",
			shortDesc: "Golpes OHKO falham quando usados contra este Pokémon.",
		},
		activate: "  {POKEMON} aguentou o golpe!",
	},
	suctioncups: {
		shortDesc: "Este Pokémon não pode ser forçado a sair por ataque ou item de outro Pokémon.",
		block: "  {POKEMON} está ancorado no lugar com suas ventosas!",
	},
	superluck: {
		shortDesc: "A taxa de acerto crítico deste Pokémon sobe 1 estágio.",
	},
	supersweetsyrup: {
		shortDesc: "Ao entrar em campo, diminui a evasão dos oponentes em 1 estágio. Uma vez por batalha.",
		start: "  Um aroma superdoce exala da calda que cobre {POKEMON}!",
	},
	supremeoverlord: {
		desc: "Os golpes deste Pokémon têm o poder multiplicado por 1+(X × 0,1), em que X é o número total de vezes que qualquer Pokémon desmaiou no lado do usuário até o momento em que esta habilidade foi ativada, e X não pode ser maior que 5.",
		shortDesc: "Golpes deste Pokémon têm 10% a mais de poder por aliado desmaiado, até 5 aliados.",
		activate: "  {POKEMON} ganhou força com os companheiros caídos!",
	},
	surgesurfer: {
		shortDesc: "Sob Electric Terrain, a Velocidade deste Pokémon dobra.",
	},
	swarm: {
		desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Bug.",
		shortDesc: "Com 1/3 do HP máx. ou menos, o atributo ofensivo é 1,5× com ataques do tipo Bug.",
		gen4: {
			desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seus ataques do tipo Bug têm o poder multiplicado por 1,5.",
			shortDesc: "Com 1/3 do HP máx. ou menos, ataques do tipo Bug deste Pokémon têm 1,5× de poder.",
		},
	},
	sweetveil: {
		desc: "Este Pokémon e seus aliados não podem adormecer, mas os que já estão dormindo não acordam imediatamente. Este Pokémon e seus aliados não conseguem usar Rest com sucesso nem ser afetados por Yawn, e os que já estavam afetados não adormecem.",
		shortDesc: "Este Pokémon e seus aliados não podem adormecer; os que já dormem não acordam.",
		block: "  {POKEMON} não pode adormecer por causa de um véu de doçura!",
	},
	swiftswim: {
		desc: "Se houver chuva, a Velocidade deste Pokémon dobra. Este efeito é impedido se este Pokémon estiver segurando Utility Umbrella.",
		shortDesc: "Se houver chuva, a Velocidade deste Pokémon dobra.",
		gen7: {
			desc: "Se houver chuva, a Velocidade deste Pokémon dobra.",
		},
	},
	swordofruin: {
		shortDesc: "Pokémon ativos sem esta habilidade têm a Defesa multiplicada por 0,75.",
		start: "  Sword of Ruin de {POKEMON} enfraqueceu a Defesa de todos os Pokémon ao redor!",
	},
	symbiosis: {
		desc: "Se um aliado usar seu item, este Pokémon dá imediatamente o próprio item a esse aliado. Não ativa se o item do aliado foi roubado ou derrubado, ou se o aliado usou Eject Button ou Eject Pack.",
		shortDesc: "Se um aliado usar seu item, este Pokémon dá imediatamente o próprio item a ele.",
		gen7: {
			desc: "Se um aliado usar seu item, este Pokémon dá imediatamente o próprio item a esse aliado. Não ativa se o item do aliado foi roubado ou derrubado, ou se o aliado usou Eject Button.",
		},
		gen6: {
			desc: "Se um aliado usar seu item, este Pokémon dá imediatamente o próprio item a esse aliado. Não ativa se o item do aliado foi roubado ou derrubado.",
		},
		activate: "  {POKEMON} compartilhou {ITEM} com {TARGET}!",
	},
	synchronize: {
		desc: "Se outro Pokémon queimar, paralisar, envenenar ou envenenar gravemente este Pokémon, esse Pokémon recebe a mesma condição de status não volátil.",
		shortDesc: "Se outro Pokémon queimar/envenenar/paralisar este Pokémon, ele recebe o mesmo status.",
		gen4: {
			desc: "Se outro Pokémon queimar, paralisar ou envenenar este Pokémon, esse Pokémon recebe a mesma condição de status não volátil. Se outro Pokémon envenenar gravemente este Pokémon, esse Pokémon fica envenenado.",
		},
	},
	tabletsofruin: {
		shortDesc: "Pokémon ativos sem esta habilidade têm o Ataque multiplicado por 0,75.",
		start: "  Tablets of Ruin de {POKEMON} enfraqueceu o Ataque de todos os Pokémon ao redor!",
	},
	tangledfeet: {
		shortDesc: "A evasão deste Pokémon dobra enquanto ele estiver confuso.",
	},
	tanglinghair: {
		shortDesc: "Pokémon que fazem contato com este Pokémon têm a Velocidade diminuída em 1 estágio.",
	},
	technician: {
		desc: "Os golpes deste Pokémon com 60 de poder ou menos têm o poder multiplicado por 1,5, incluindo Struggle. Este efeito é aplicado depois que o efeito de um golpe altera o próprio poder.",
		shortDesc: "Golpes deste Pokémon com 60 de poder ou menos têm 1,5× de poder, incluindo Struggle.",
		gen4: {
			desc: "Os golpes deste Pokémon com 60 de poder ou menos têm o poder multiplicado por 1,5, exceto Struggle. Este efeito é aplicado depois que o efeito de um golpe altera o próprio poder, e também depois dos efeitos de Charge e Helping Hand.",
			shortDesc: "Golpes deste Pokémon com 60 de poder ou menos têm 1,5× de poder, exceto Struggle.",
		},
	},
	telepathy: {
		shortDesc: "Este Pokémon não sofre dano de ataques feitos por seus aliados.",
		block: "  {POKEMON} não pode ser atingido por ataques de Pokémon aliados!",
	},
	teraformzero: {
		shortDesc: "Terapagos: Terastalizar encerra os efeitos de clima e terreno. Uma vez por batalha.",
	},
	terashell: {
		desc: "Se este Pokémon for Terapagos com HP cheio, a efetividade dos ataques contra ele passa a ser 0,5, a menos que este Pokémon seja imune ao golpe. Golpes de múltiplos acertos mantêm a mesma efetividade durante todo o ataque.",
		shortDesc: "Terapagos: com HP cheio, ataques recebidos têm efetividade 0,5×, salvo imunidade natural.",
		activate: "  {POKEMON} fez seu casco brilhar! Está distorcendo as relações de tipos!",
	},
	terashift: {
		shortDesc: "Se este Pokémon for Terapagos, vira sua Terastal Form ao entrar em campo.",
		transform: "{POKEMON} se transformou!",
	},
	teravolt: {
		desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Armor Tail, Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Earth Eater, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Good as Gold, Grass Pelt, Guard Dog, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Illuminate, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mind's Eye, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Purifying Salt, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Tera Shell, Thermal Exchange, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, Well-Baked Body, White Smoke, Wind Rider, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		shortDesc: "Os golpes deste Pokémon e seus efeitos ignoram as habilidades de outros Pokémon.",
		gen8: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen7: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen6: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen5: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Battle Armor, Big Pecks, Clear Body, Contrary, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Friend Guard, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen4: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightning Rod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke e Wonder Guard. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon. O modificador de Ataque da habilidade Flower Gift de um aliado não é anulado.",
		},
		start: "  {POKEMON} está irradiando uma aura explosiva!",
	},
	thermalexchange: {
		desc: "O Ataque deste Pokémon sobe 1 estágio depois que ele sofre dano de um golpe do tipo Fire. Este Pokémon não pode ser queimado. Ganhar esta habilidade enquanto queimado cura a queimadura.",
		shortDesc: "O Ataque sobe 1 ao sofrer dano de golpes do tipo Fire; não pode ser queimado.",
	},
	thickfat: {
		desc: "Se um Pokémon usar um ataque do tipo Fire ou Ice contra este Pokémon, o atributo ofensivo desse Pokémon é reduzido à metade no cálculo do dano a este Pokémon.",
		shortDesc: "Golpes dos tipos Fire/Ice contra este Pokémon usam o atributo ofensivo pela metade.",
		gen4: {
			desc: "O poder dos ataques dos tipos Fire e Ice contra este Pokémon é reduzido à metade.",
			shortDesc: "O poder dos ataques dos tipos Fire e Ice contra este Pokémon é reduzido à metade.",
		},
		gen3: {
			desc: "Se um Pokémon usar um ataque do tipo Fire ou Ice contra este Pokémon, o Ataque Especial desse Pokémon é reduzido à metade no cálculo do dano a este Pokémon.",
			shortDesc: "Golpes dos tipos Fire/Ice contra este Pokémon usam o Sp. Atk pela metade.",
		},
	},
	tintedlens: {
		shortDesc: "Ataques deste Pokémon pouco efetivos contra o alvo causam o dobro de dano.",
	},
	torrent: {
		desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seu atributo ofensivo é multiplicado por 1,5 ao usar um ataque do tipo Water.",
		shortDesc: "Com 1/3 do HP máx. ou menos, o atributo ofensivo é 1,5× com ataques do tipo Water.",
		gen4: {
			desc: "Quando este Pokémon tem 1/3 ou menos do HP máximo, arredondado para baixo, seus ataques do tipo Water têm o poder multiplicado por 1,5.",
			shortDesc: "Com 1/3 do HP máx. ou menos, ataques do tipo Water deste Pokémon têm 1,5× de poder.",
		},
	},
	toughclaws: {
		shortDesc: "Os golpes de contato deste Pokémon têm o poder multiplicado por 1,3.",
	},
	toxicboost: {
		desc: "Enquanto este Pokémon estiver envenenado, o poder de seus ataques físicos é multiplicado por 1,5.",
		shortDesc: "Enquanto este Pokémon estiver envenenado, seus ataques físicos têm 1,5× de poder.",
	},
	toxicchain: {
		desc: "Os ataques deste Pokémon têm 30% de chance de envenenar gravemente. Este efeito é verificado antes da chance de efeito secundário próprio do golpe.",
		shortDesc: "Os ataques deste Pokémon têm 30% de chance de envenenar gravemente.",
	},
	toxicdebris: {
		shortDesc: "Se atingido por um ataque físico, coloca Toxic Spikes no lado adversário.",
	},
	trace: {
		desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário aleatório. As habilidades que não podem ser copiadas são As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Flower Gift, Forecast, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Teraform Zero, Tera Shell, Tera Shift, Trace, Zen Mode e Zero to Hero. Se nenhum Pokémon adversário tiver uma habilidade que possa ser copiada, esta habilidade é ativada assim que algum tiver.",
		shortDesc: "Ao entrar em campo, ou quando puder, copia a habilidade de um oponente adjacente.",
		gen8: {
			desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário aleatório. As habilidades que não podem ser copiadas são As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace e Zen Mode. Se nenhum Pokémon adversário tiver uma habilidade que possa ser copiada, esta habilidade é ativada assim que algum tiver.",
		},
		gen7: {
			desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário aleatório. As habilidades que não podem ser copiadas são Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace e Zen Mode. Se nenhum Pokémon adversário tiver uma habilidade que possa ser copiada, esta habilidade é ativada assim que algum tiver.",
		},
		gen6: {
			desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário adjacente aleatório. As habilidades que não podem ser copiadas são Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace e Zen Mode. Se nenhum Pokémon adversário tiver uma habilidade que possa ser copiada, esta habilidade é ativada assim que algum tiver.",
		},
		gen5: {
			desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário adjacente aleatório. As habilidades que não podem ser copiadas são Flower Gift, Forecast, Illusion, Imposter, Multitype, Trace e Zen Mode. Se nenhum Pokémon adversário tiver uma habilidade que possa ser copiada, esta habilidade é ativada assim que algum tiver.",
		},
		gen4: {
			desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário aleatório. As habilidades que não podem ser copiadas são Forecast, Multitype e Trace. Se nenhum Pokémon adversário tiver uma habilidade que possa ser copiada, esta habilidade é ativada assim que algum tiver.",
		},
		gen3: {
			desc: "Ao entrar em campo, este Pokémon copia a habilidade de um Pokémon adversário aleatório.",
		},
		changeAbility: "  {POKEMON} copiou {ABILITY} de {SOURCE}!",
	},
	transistor: {
		shortDesc: "O atributo ofensivo deste Pokémon é multiplicado por 1,3 ao usar um ataque do tipo Electric.",
		gen8: {
			shortDesc: "O atributo ofensivo deste Pokémon é multiplicado por 1,5 ao usar um ataque do tipo Electric.",
		},
	},
	triage: {
		shortDesc: "Os golpes de cura deste Pokémon têm a prioridade aumentada em 3.",
	},
	truant: {
		shortDesc: "Este Pokémon perde um turno a cada dois em vez de usar um golpe.",
		gen3: {
			desc: "Este Pokémon perde um turno a cada dois em vez de usar um golpe. Se este Pokémon substituir um Pokémon que desmaiou durante os efeitos de fim de turno, seu primeiro turno é perdido.",
		},
		cant: "{POKEMON} está de preguiça!",
	},
	turboblaze: {
		desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Armor Tail, Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Earth Eater, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Good as Gold, Grass Pelt, Guard Dog, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Illuminate, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mind's Eye, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Purifying Salt, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Tera Shell, Thermal Exchange, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, Well-Baked Body, White Smoke, Wind Rider, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		shortDesc: "Os golpes deste Pokémon e seus efeitos ignoram as habilidades de outros Pokémon.",
		gen8: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dazzling, Disguise, Dry Skin, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Ice Face, Ice Scales, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Mirror Armor, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Pastel Veil, Punk Rock, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen7: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dazzling, Disguise, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Fluffy, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Queenly Majesty, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Bubble, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen6: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Aroma Veil, Aura Break, Battle Armor, Big Pecks, Bulletproof, Clear Body, Contrary, Damp, Dark Aura, Dry Skin, Fairy Aura, Filter, Flash Fire, Flower Gift, Flower Veil, Friend Guard, Fur Coat, Grass Pelt, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Overcoat, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Sweet Veil, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen5: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Battle Armor, Big Pecks, Clear Body, Contrary, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Friend Guard, Heatproof, Heavy Metal, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Light Metal, Lightning Rod, Limber, Magic Bounce, Magma Armor, Marvel Scale, Motor Drive, Multiscale, Oblivious, Own Tempo, Sand Veil, Sap Sipper, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Telepathy, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke, Wonder Guard e Wonder Skin. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon, e sejam suas habilidades benéficas ou não para este Pokémon.",
		},
		gen4: {
			desc: "Os golpes deste Pokémon e seus efeitos ignoram certas habilidades de outros Pokémon. As habilidades que podem ser anuladas são Battle Armor, Clear Body, Damp, Dry Skin, Filter, Flash Fire, Flower Gift, Heatproof, Hyper Cutter, Immunity, Inner Focus, Insomnia, Keen Eye, Leaf Guard, Levitate, Lightning Rod, Limber, Magma Armor, Marvel Scale, Motor Drive, Oblivious, Own Tempo, Sand Veil, Shell Armor, Shield Dust, Simple, Snow Cloak, Solid Rock, Soundproof, Sticky Hold, Storm Drain, Sturdy, Suction Cups, Tangled Feet, Thick Fat, Unaware, Vital Spirit, Volt Absorb, Water Absorb, Water Veil, White Smoke e Wonder Guard. Isso afeta todos os outros Pokémon em campo, sejam eles alvos ou não do golpe deste Pokémon. O modificador de Ataque da habilidade Flower Gift de um aliado não é anulado.",
		},
		start: "  {POKEMON} está irradiando uma aura flamejante!",
	},
	unaware: {
		desc: "Este Pokémon ignora os estágios de Ataque, Ataque Especial e precisão de outros Pokémon ao sofrer dano, e ignora os estágios de Defesa, Defesa Especial e evasão de outros Pokémon ao causar dano.",
		shortDesc: "Ignora os estágios de atributos de outros Pokémon ao sofrer ou causar dano.",
	},
	unburden: {
		desc: "Se este Pokémon perder o item segurado por qualquer motivo, sua Velocidade dobra enquanto ele permanecer ativo, tiver esta habilidade e não estiver segurando um item.",
		shortDesc: "Velocidade dobra ao perder o item; perde o bônus se sair, ou ganhar novo item/habilidade.",
	},
	unnerve: {
		desc: "Enquanto este Pokémon estiver ativo, impede que Pokémon adversários usem suas Berries. Esta habilidade é ativada antes que as armadilhas de campo e outras habilidades façam efeito.",
		shortDesc: "Enquanto este Pokémon estiver ativo, impede que Pokémon adversários usem suas Berries.",
		start: "  {TEAM} está nervoso demais para comer Berries!",
	},
	unseenfist: {
		shortDesc: "Os golpes de contato deste Pokémon ignoram a proteção do alvo, exceto Max Guard.",
		champions: {
			shortDesc: "Golpes de contato deste Pokémon ignoram a proteção do alvo e causam 1/4 do dano normal.",
		},
	},
	vesselofruin: {
		shortDesc: "Pokémon ativos sem esta habilidade têm o Ataque Especial multiplicado por 0,75.",
		start: "  Vessel of Ruin de {POKEMON} enfraqueceu o Sp. Atk de todos os Pokémon ao redor!",
	},
	victorystar: {
		shortDesc: "Os golpes deste Pokémon e de seus aliados têm a precisão multiplicada por 1,1.",
	},
	vitalspirit: {
		shortDesc: "Este Pokémon não pode adormecer. Ganhar esta habilidade enquanto dorme o acorda.",
	},
	voltabsorb: {
		desc: "Este Pokémon é imune a golpes do tipo Electric e recupera 1/4 do HP máximo, arredondado para baixo, quando atingido por um golpe do tipo Electric.",
		shortDesc: "Cura 1/4 do HP máx. quando atingido por golpes do tipo Electric; imune ao tipo Electric.",
		gen3: {
			desc: "Este Pokémon é imune a golpes de dano do tipo Electric e recupera 1/4 do HP máximo, arredondado para baixo, quando atingido por um deles.",
			shortDesc: "Cura 1/4 do HP máx. ao ser atingido por golpe de dano do tipo Electric; imune a ele.",
		},
	},
	wanderingspirit: {
		desc: "Pokémon que fazem contato com este Pokémon trocam de habilidade com ele. Não afeta Pokémon com as habilidades As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Hunger Switch, Ice Face, Illusion, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Protosynthesis, Quark Drive, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Wonder Guard, Zen Mode ou Zero to Hero.",
		shortDesc: "Pokémon que fazem contato com este Pokémon trocam de habilidade com ele.",
		gen8: {
			desc: "Pokémon que fazem contato com este Pokémon trocam de habilidade com ele. Não afeta Pokémon com as habilidades As One, Battle Bond, Comatose, Disguise, Gulp Missile, Hunger Switch, Ice Face, Illusion, Multitype, Neutralizing Gas, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Wonder Guard ou Zen Mode.",
		},
	},
	waterabsorb: {
		desc: "Este Pokémon é imune a golpes do tipo Water e recupera 1/4 do HP máximo, arredondado para baixo, quando atingido por um golpe do tipo Water.",
		shortDesc: "Cura 1/4 do HP máx. quando atingido por golpes do tipo Water; imune ao tipo Water.",
	},
	waterbubble: {
		desc: "O atributo ofensivo deste Pokémon dobra ao usar um ataque do tipo Water. Se um Pokémon usar um ataque do tipo Fire contra este Pokémon, o atributo ofensivo desse Pokémon é reduzido à metade no cálculo do dano a este Pokémon. Este Pokémon não pode ser queimado. Ganhar esta habilidade enquanto queimado cura a queimadura.",
		shortDesc: "Poder do tipo Water 2×; não pode ser queimado; poder do tipo Fire contra ele pela metade.",
	},
	watercompaction: {
		shortDesc: "A Defesa deste Pokémon sobe 2 estágios ao sofrer dano de um golpe do tipo Water.",
	},
	waterveil: {
		shortDesc: "Não pode ser queimado. Ganhar esta habilidade enquanto queimado cura a queimadura.",
	},
	weakarmor: {
		desc: "Se um ataque físico atingir este Pokémon, sua Defesa diminui 1 estágio e sua Velocidade sobe 2 estágios.",
		shortDesc: "Se um ataque físico atingir este Pokémon, Defesa diminui 1 e Velocidade sobe 2.",
		gen6: {
			desc: "Se um ataque físico atingir este Pokémon, sua Defesa diminui 1 estágio e sua Velocidade sobe 1 estágio.",
			shortDesc: "Se um ataque físico atingir este Pokémon, Defesa diminui 1 e Velocidade sobe 1.",
		},
	},
	wellbakedbody: {
		desc: "Este Pokémon é imune a golpes do tipo Fire e aumenta sua Defesa em 2 estágios quando atingido por um golpe do tipo Fire.",
		shortDesc: "Def sobe 2 estágios se atingido por golpe do tipo Fire; imune ao tipo Fire.",
	},
	whitesmoke: {
		shortDesc: "Impede que outros Pokémon diminuam os estágios de atributos deste Pokémon.",
	},
	wimpout: {
		desc: "Quando este Pokémon tem mais de 1/2 do HP máximo e sofre dano que o deixa com 1/2 ou menos do HP máximo, ele sai de campo imediatamente para um aliado escolhido. Este efeito é aplicado depois de todos os acertos de um golpe de múltiplos acertos. Este efeito é impedido se o golpe teve um efeito secundário removido pela habilidade Sheer Force. Este efeito vale para dano direto e indireto, exceto Curse e Substitute ao serem usados, Belly Drum, Pain Split e dano de confusão.",
		shortDesc: "Este Pokémon sai de campo quando chega a 1/2 ou menos do HP máximo.",
	},
	windpower: {
		desc: "Este Pokémon ganha o efeito de Charge quando é atingido por um golpe de vento ou quando Tailwind começa no lado deste Pokémon.",
		shortDesc: "Ganha o efeito de Charge se atingido por golpe de vento ou se Tailwind começar.",
	},
	windrider: {
		desc: "Este Pokémon é imune a golpes de vento e aumenta seu Ataque em 1 estágio quando atingido por um golpe de vento ou quando Tailwind começa no lado deste Pokémon.",
		shortDesc: "Ataque sobe 1 se atingido por golpe de vento ou se Tailwind começar. Imune a vento.",
	},
	wonderguard: {
		shortDesc: "Este Pokémon só sofre dano de golpes superefetivos e de dano indireto.",
		gen4: {
			shortDesc: "Este Pokémon só sofre dano de Fire Fang, golpes superefetivos e dano indireto.",
		},
		gen3: {
			shortDesc: "Este Pokémon só sofre dano de golpes superefetivos e de dano indireto.",
		},
	},
	wonderskin: {
		desc: "Golpes que não causam dano e verificam a precisão têm a precisão alterada para 50% quando usados contra este Pokémon. Este efeito é aplicado antes de outros efeitos que modificam a precisão.",
		shortDesc: "Golpes de status que verificam precisão têm 50% de precisão contra este Pokémon.",
	},
	zenmode: {
		desc: "Se este Pokémon for Darmanitan ou Galarian Darmanitan, ele muda para Zen Mode se tiver 1/2 ou menos do HP máximo no fim de um turno. Se o HP de Darmanitan estiver acima de 1/2 do HP máximo no fim de um turno, ele volta para Standard Mode.",
		shortDesc: "Se Darmanitan, no fim do turno vira Standard Mode com > 1/2 do HP máx.; senão, Zen.",
		gen7: {
			desc: "Se este Pokémon for Darmanitan, ele muda para Zen Mode se tiver 1/2 ou menos do HP máximo no fim de um turno. Se o HP de Darmanitan estiver acima de 1/2 do HP máximo no fim de um turno, ele volta para Standard Mode.",
		},
		gen6: {
			desc: "Se este Pokémon for Darmanitan, ele muda para Zen Mode se tiver 1/2 ou menos do HP máximo no fim de um turno. Se o HP de Darmanitan estiver acima de 1/2 do HP máximo no fim de um turno, ele volta para Standard Mode. Se Darmanitan perder esta habilidade enquanto estiver em Zen Mode, volta imediatamente para Standard Mode.",
		},
		transform: "Zen Mode ativou!",
		transformEnd: "Zen Mode terminou!",
	},
	zerotohero: {
		shortDesc: "Se este Pokémon for Palafin em Zero Form, ao sair de campo ele muda para Hero Form.",
		activate: "  {POKEMON} passou por uma transformação heroica!",
	},
	mountaineer: {
		shortDesc: "Ao entrar em campo, este Pokémon evita todos os ataques do tipo Rock e Stealth Rock.",
	},
	rebound: {
		desc: "Ao entrar em campo, este Pokémon bloqueia certos golpes de status e, em vez disso, usa o golpe contra o usuário original.",
		shortDesc: "Ao entrar em campo, bloqueia certos golpes de status e os devolve ao usuário.",
	},
	persistent: {
		desc: "A duração de Gravity, Heal Block, Magic Room, Safeguard, Tailwind, Trick Room e Wonder Room aumenta em 2 turnos se o efeito for iniciado por este Pokémon.",
		shortDesc: "Se usados por ele, Gravity/Heal Block/Safeguard/Tailwind/Rooms duram 2 turnos a mais.",
		activate: "  {POKEMON} prolonga {MOVE} por 2 turnos!",
	},
};
