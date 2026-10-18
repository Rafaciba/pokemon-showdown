// pt-BR (pokemon-showdown-custom). Nomes de Pokémon, golpes, habilidades, itens, naturezas e
//   tipos ficam em inglês (nada de "name" aqui: cai no inglês). Tipos sempre depois de
//   "tipo/tipos", porque o cliente troca esse trecho pelo selo do tipo. Atributos por extenso
//   em português, abreviações em inglês. Vírgula decimal. Gerado por scripts/traducao/aplicar.cjs
//   (repositório raiz); ver docs/traducao-pt-br.md.

export const MovesText: { [id: IDEntry]: MoveText } = {
	"10000000voltthunderbolt": {
		desc: "Tem uma chance muito alta de acerto crítico.",
		shortDesc: "Taxa de acerto crítico muito alta.",
	},
	absorb: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "O usuário recupera 50% do dano causado.",
		gen4: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo.",
		},
		gen3: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo.",
		},
		gen2: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se o alvo tiver um substituto, este golpe erra.",
		},
		gen1: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se este golpe quebrar o substituto do alvo, o usuário não recupera HP.",
		},
	},
	accelerock: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	acid: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de reduzir a Sp. Def do(s) oponente(s) em 1.",
		gen3: {
			desc: "Tem 10% de chance de diminuir a Defesa do alvo em 1 estágio.",
			shortDesc: "10% de reduzir a Defesa do(s) oponente(s) em 1.",
		},
		gen1: {
			desc: "Tem 33% de chance de diminuir a Defesa do alvo em 1 estágio.",
			shortDesc: "33% de chance de diminuir a Defesa do alvo em 1.",
		},
		gen2: {
			shortDesc: "10% de chance de diminuir a Defesa do alvo em 1.",
		},
	},
	acidarmor: {
		desc: "Aumenta a Defesa do usuário em 2 estágios.",
		shortDesc: "Aumenta a Defesa do usuário em 2.",
	},
	aciddownpour: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	acidspray: {
		desc: "Tem 100% de chance de diminuir a Defesa Especial do alvo em 2 estágios.",
		shortDesc: "100% de chance de diminuir a Sp. Def do alvo em 2.",
	},
	acrobatics: {
		shortDesc: "O poder dobra se o usuário não tiver item segurado.",
	},
	acupressure: {
		desc: "Aumenta um atributo aleatório em 2 estágios, desde que o atributo ainda não esteja no estágio 6. O usuário pode escolher usar este golpe em si mesmo ou em um aliado adjacente. Falha se nenhum estágio de atributo puder ser aumentado ou se for usado em um aliado com substituto.",
		shortDesc: "Aumenta em 2 um atributo aleatório do usuário/aliado.",
		gen4: {
			desc: "Aumenta um atributo aleatório em 2 estágios, desde que o atributo ainda não esteja no estágio 6. O usuário pode escolher usar este golpe em si mesmo ou em um aliado. Falha se nenhum estágio de atributo puder ser aumentado ou se o usuário ou o aliado tiver um substituto.",
		},
	},
	aerialace: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	aeroblast: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	afteryou: {
		desc: "O alvo executa seu golpe imediatamente após o usuário neste turno, independentemente da prioridade do golpe escolhido. Falha se o alvo já fosse agir em seguida de qualquer forma, ou se o alvo já agiu neste turno.",
		shortDesc: "O alvo executa seu golpe logo após o usuário.",
		activate: "  {TARGET} aceitou a gentil oferta!",
	},
	agility: {
		desc: "Aumenta a Velocidade do usuário em 2 estágios.",
		shortDesc: "Aumenta a Velocidade do usuário em 2.",
	},
	aircutter: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de crítico. Atinge oponentes adjacentes.",
	},
	airslash: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	alloutpummeling: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	alluringvoice: {
		desc: "Tem 100% de chance de confundir o alvo se algum estágio de atributo dele tiver sido aumentado neste turno.",
		shortDesc: "100%: confunde alvo que aumentou atributo no turno.",
	},
	allyswitch: {
		desc: "O usuário troca de posição com seu aliado. Falha se o usuário for o único Pokémon do seu lado. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Ally Switch.",
		shortDesc: "Usuário e aliado trocam de posição; repetir pode falhar.",
		gen8: {
			desc: "O usuário troca de posição com seu aliado. Falha se o usuário for o único Pokémon do seu lado.",
			shortDesc: "O usuário troca de posição com seu aliado.",
		},
		gen6: {
			desc: "O usuário troca de posição com o aliado do lado oposto do campo. Falha se não houver Pokémon nessa posição, se o usuário for o único Pokémon do seu lado ou se o usuário estiver no meio.",
			shortDesc: "Troca de posição com o aliado da outra ponta.",
		},
	},
	amnesia: {
		desc: "Aumenta a Defesa Especial do usuário em 2 estágios.",
		shortDesc: "Aumenta a Sp. Def do usuário em 2.",
		gen1: {
			desc: "Aumenta o Especial do usuário em 2 estágios.",
			shortDesc: "Aumenta o Especial do usuário em 2.",
		},
	},
	anchorshot: {
		desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Impede o alvo de sair de campo.",
		gen7: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
	},
	ancientpower: {
		desc: "Tem 10% de chance de aumentar o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio.",
		shortDesc: "10% de chance: +1 em todos os atributos (não acc/eva).",
	},
	appleacid: {
		desc: "Tem 100% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	aquacutter: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	aquajet: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	aquaring: {
		desc: "O usuário recupera 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno enquanto permanecer em campo. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata. Se o usuário usar Baton Pass, o Pokémon que entrar no lugar receberá o efeito de cura.",
		shortDesc: "O usuário recupera 1/16 do HP máximo por turno.",
		start: "  {POKEMON} se cercou com um véu de água!",
		heal: "  Um véu de água restaurou o HP de {POKEMON}!",
	},
	aquastep: {
		desc: "Tem 100% de chance de aumentar a Velocidade do usuário em 1 estágio.",
		shortDesc: "100% de chance de aumentar a Spe do usuário em 1.",
	},
	aquatail: {
		shortDesc: "Sem efeito adicional.",
	},
	armorcannon: {
		desc: "Diminui a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Diminui a Defesa e a Sp. Def do usuário em 1.",
	},
	armthrust: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
	},
	aromatherapy: {
		desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil. Pokémon em campo com a habilidade Sap Sipper não são curados, a menos que sejam o usuário.",
		shortDesc: "Cura todas as condições de status da equipe do usuário.",
		gen5: {
			desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil.",
		},
		activate: "  Um aroma calmante se espalhou pela área!",
	},
	aromaticmist: {
		desc: "Aumenta a Defesa Especial do alvo em 1 estágio. Falha se não houver aliado adjacente ao usuário.",
		shortDesc: "Aumenta a Sp. Def de um aliado em 1.",
	},
	assist: {
		desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Baneful Bunker, Beak Blast, Belch, Bestow, Blazing Torque, Bounce, Celebrate, Chatter, Circle Throw, Combat Torque, Copycat, Counter, Covet, Destiny Bond, Detect, Dig, Dive, Dragon Tail, Endure, Feint, Fly, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Magical Torque, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Noxious Torque, Phantom Force, Protect, Rage Powder, Roar, Shadow Force, Shell Trap, Sketch, Sky Drop, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Tera Starstorm, Thief, Transform, Trick, Whirlwind nem Wicked Torque.",
		shortDesc: "Usa um golpe aleatório de um membro da equipe.",
		gen8: {
			desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Baneful Bunker, Beak Blast, Belch, Bestow, Bounce, Celebrate, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dig, Dive, Dragon Tail, Endure, Feint, Fly, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Phantom Force, Protect, Rage Powder, Roar, Shadow Force, Shell Trap, Sketch, Sky Drop, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Thief, Transform, Trick nem Whirlwind.",
		},
		gen7: {
			desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Baneful Bunker, Beak Blast, Belch, Bestow, Bounce, Celebrate, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dig, Dive, Dragon Tail, Endure, Feint, Fly, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Phantom Force, Protect, Rage Powder, Roar, Shadow Force, Shell Trap, Sketch, Sky Drop, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Thief, Transform, Trick, Whirlwind nem qualquer Z-Move.",
		},
		gen6: {
			desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Belch, Bestow, Bounce, Celebrate, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dig, Dive, Dragon Tail, Endure, Feint, Fly, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Phantom Force, Protect, Rage Powder, Roar, Shadow Force, Sketch, Sky Drop, Sleep Talk, Snatch, Spiky Shield, Struggle, Switcheroo, Thief, Transform, Trick nem Whirlwind.",
		},
		gen5: {
			desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform nem Trick.",
		},
		gen4: {
			desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief nem Trick.",
		},
		gen3: {
			desc: "Um golpe aleatório entre os conhecidos pelos membros da equipe do usuário é escolhido para ser usado. Não escolhe Assist, Counter, Covet, Destiny Bond, Detect, Endure, Focus Punch, Follow Me, Helping Hand, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Thief nem Trick.",
		},
	},
	assurance: {
		desc: "O poder dobra se o alvo já tiver sofrido dano neste turno, exceto dano direto de Belly Drum, confusão, Curse ou Pain Split.",
		shortDesc: "O poder dobra se o alvo sofreu dano neste turno.",
		gen4: {
			desc: "O poder dobra se o alvo já tiver sofrido dano neste turno.",
		},
	},
	astonish: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
		gen3: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra se o alvo tiver usado Minimize enquanto estava em campo.",
		},
	},
	astralbarrage: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge oponentes adjacentes.",
	},
	attackorder: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	attract: {
		desc: "Faz o alvo ficar apaixonado, impedindo-o de atacar 50% das vezes. Falha se o usuário e o alvo forem do mesmo gênero, se algum deles não tiver gênero ou se o alvo já estiver apaixonado. O efeito termina quando o usuário ou o alvo não estiver mais em campo. Pokémon com a habilidade Oblivious ou protegidos pela habilidade Aroma Veil são imunes.",
		shortDesc: "Um alvo do gênero oposto fica apaixonado.",
		gen5: {
			desc: "Faz o alvo ficar apaixonado, impedindo-o de atacar 50% das vezes. Falha se o usuário e o alvo forem do mesmo gênero, se algum deles não tiver gênero ou se o alvo já estiver apaixonado. O efeito termina quando o usuário ou o alvo não estiver mais em campo. Pokémon com a habilidade Oblivious são imunes.",
		},
		gen2: {
			desc: "Faz o alvo ficar apaixonado, impedindo-o de atacar 50% das vezes. Falha se o usuário e o alvo forem do mesmo gênero, se algum deles não tiver gênero ou se o alvo já estiver apaixonado. O efeito termina quando o usuário ou o alvo não estiver mais em campo.",
		},
		start: "  {POKEMON} se apaixonou!",
		startFromItem: "  {POKEMON} se apaixonou por causa de {ITEM}!",
		end: "  {POKEMON} superou a paixão!",
		endFromItem: "  {POKEMON} curou a paixão usando {ITEM}!",
		activate: "  {POKEMON} está apaixonado por {TARGET}!",
		cant: "{POKEMON} está imobilizado pelo amor!",
	},
	aurasphere: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	aurawheel: {
		desc: "Tem 100% de chance de aumentar a Velocidade do usuário em 1 estágio. Se o usuário for um Morpeko na forma Full Belly, este golpe é do tipo Electric. Se o usuário for um Morpeko na forma Hangry, este golpe é do tipo Dark. Este golpe só pode ser usado com sucesso se a forma atual do usuário, considerando Transform, for Morpeko na forma Full Belly ou Hangry.",
		shortDesc: "Morpeko: tipo Electric; Hangry: tipo Dark; 100% +1 Spe.",
	},
	aurorabeam: {
		desc: "Tem 10% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir o Ataque do alvo em 1.",
		gen1: {
			desc: "Tem 33% de chance de diminuir o Ataque do alvo em 1 estágio.",
			shortDesc: "33% de chance de diminuir o Ataque do alvo em 1.",
		},
	},
	auroraveil: {
		desc: "Por 5 turnos, o usuário e os membros da sua equipe sofrem 0,5× de dano de ataques físicos e especiais, ou 0,66× em batalhas Duplas; não reduz mais o dano em conjunto com Reflect ou Light Screen. Acertos críticos ignoram esta proteção. Ela é removida do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break, Psychic Fangs ou Defog. Brick Break e Psychic Fangs removem o efeito antes de o dano ser calculado. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha a menos que o clima seja neve.",
		shortDesc: "5 turnos: dano aos aliados cai à metade. Só na neve.",
		gen8: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe sofrem 0,5× de dano de ataques físicos e especiais, ou 0,66× em batalhas Duplas; não reduz mais o dano em conjunto com Reflect ou Light Screen. Acertos críticos ignoram esta proteção. Ela é removida do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break, Psychic Fangs ou Defog. Brick Break e Psychic Fangs removem o efeito antes de o dano ser calculado. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha a menos que o clima seja granizo.",
			shortDesc: "5 turnos: dano aos aliados cai à metade. Só no granizo.",
		},
		start: "  Aurora Veil deixou {TEAM} mais resistente contra golpes físicos e especiais!",
		end: "  O efeito de Aurora Veil de {TEAM} acabou!",
	},
	autotomize: {
		desc: "Aumenta a Velocidade do usuário em 2 estágios. Se a Velocidade do usuário tiver sido alterada, o peso do usuário é reduzido em 100 kg enquanto ele permanecer em campo. Este efeito é cumulativo, mas não pode reduzir o peso do usuário a menos de 0,1 kg.",
		shortDesc: "Aumenta a Velocidade em 2; o usuário perde 100 kg.",
		start: "  {POKEMON} ficou mais ágil!",
	},
	avalanche: {
		desc: "O poder dobra se o usuário tiver sido atingido pelo alvo neste turno.",
		shortDesc: "O poder dobra se o usuário sofreu dano do alvo.",
		gen4: {
			desc: "O poder dobra se o usuário tiver sido atingido por um Pokémon na posição do alvo neste turno.",
		},
	},
	axekick: {
		desc: "Tem 30% de chance de confundir o alvo. Se este ataque não for bem-sucedido, o usuário perde metade do seu HP máximo, arredondado para baixo, como dano de queda. Pokémon com a habilidade Magic Guard não são afetados por dano de queda.",
		shortDesc: "30% de confusão. Se errar, usuário perde 50% do HP máx.",
	},
	babydolleyes: {
		desc: "Diminui o Ataque do alvo em 1 estágio.",
		shortDesc: "Diminui o Ataque do alvo em 1.",
	},
	baddybad: {
		desc: "Este golpe ativa Reflect por 5 turnos ao ser usado.",
		shortDesc: "Ativa Reflect.",
	},
	banefulbunker: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário ficam envenenados. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		shortDesc: "Protege contra golpes. Contato: envenena.",
		gen8: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário ficam envenenados. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen7: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário ficam envenenados. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
	},
	barbbarrage: {
		desc: "Tem 50% de chance de envenenar o alvo. O poder dobra se o alvo já estiver envenenado.",
		shortDesc: "50% de envenenar. 2× poder se alvo já envenenado.",
	},
	barrage: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	barrier: {
		desc: "Aumenta a Defesa do usuário em 2 estágios.",
		shortDesc: "Aumenta a Defesa do usuário em 2.",
	},
	batonpass: {
		desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Aqua Ring, Curse, Dragon Cheer, Embargo, Focus Energy, Gastro Acid, Heal Block, Ingrain, Leech Seed, Lock-On (Mind Reader), Magnet Rise, Perish Song, Power Trick, Telekinesis e um substituto com o HP restante dele. O efeito de Gastro Acid não é transferido se quem recebe tiver uma habilidade que não pode ser afetada.",
		shortDesc: "O usuário troca, passando mudanças de atributos e mais.",
		gen8: {
			desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Aqua Ring, Curse, Embargo, Focus Energy, Gastro Acid, Heal Block, Ingrain, Leech Seed, Lock-On (Mind Reader), Magnet Rise, Perish Song, Power Trick, Telekinesis e um substituto com o HP restante dele. O efeito de Gastro Acid não é transferido se quem recebe tiver uma habilidade que não pode ser afetada.",
		},
		gen7: {
			desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Aqua Ring, Curse, Embargo, Focus Energy, Gastro Acid, Heal Block, Ingrain, Leech Seed, Lock-On (Mind Reader), Magnet Rise, Perish Song, Power Trick, Telekinesis, o efeito de aprisionamento de Mean Look (Block, Spider Web) e um substituto com o HP restante dele. O efeito de Gastro Acid não é transferido se quem recebe tiver uma habilidade que não pode ser afetada. O efeito de Telekinesis não é transferido se quem recebe for Mega Gengar.",
		},
		gen5: {
			desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Aqua Ring, Curse, Embargo, Focus Energy, Gastro Acid, Heal Block, Ingrain, Leech Seed, Lock-On (Mind Reader), Magnet Rise, Perish Song, Power Trick, Telekinesis, o efeito de aprisionamento de Mean Look (Block, Spider Web) e um substituto com o HP restante dele.",
		},
		gen4: {
			desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Aqua Ring, Curse, Embargo, Focus Energy, Gastro Acid, Heal Block, Ingrain, Leech Seed, Lock-On (Mind Reader), Magnet Rise, Mud Sport, Perish Song, Power Trick, Water Sport, os efeitos de aprisionador ou aprisionado de Mean Look (Block, Spider Web) e um substituto com o HP restante dele.",
		},
		gen3: {
			desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Curse, Focus Energy, Ingrain, Leech Seed, Lock-On (Mind Reader), Mud Sport, Perish Song, Water Sport, os efeitos de aprisionador ou aprisionado de Mean Look (Block, Spider Web) e um substituto com o HP restante dele.",
		},
		gen2: {
			desc: "O usuário é substituído por outro Pokémon da sua equipe. O Pokémon escolhido recebe as mudanças nos estágios de atributos do usuário, assim como os efeitos de confusão, Curse, Defense Curl, Focus Energy, Foresight, Leech Seed, Lock-On (Mind Reader), Minimize, Mist, Perish Song, os efeitos de aprisionador ou aprisionado de Mean Look (Spider Web) e um substituto com o HP restante dele.",
		},
	},
	beakblast: {
		desc: "Se o usuário for atingido por um golpe de contato neste turno antes de conseguir executar este golpe, o atacante fica queimado.",
		shortDesc: "Queima quem fizer contato com o usuário antes de agir.",
		start: "  {POKEMON} começou a aquecer o bico!",
	},
	beatup: {
		desc: "Acerta uma vez pelo usuário e uma vez por cada Pokémon não desmaiado e sem condição de status não volátil da equipe do usuário. O poder de cada acerto é igual a 5+(X/10), onde X é o Ataque base de cada Pokémon participante; cada acerto é considerado como vindo do usuário.",
		shortDesc: "Aliados saudáveis ajudam a causar dano ao alvo.",
		gen4: {
			desc: "Causa dano sem tipo. Acerta uma vez pelo usuário e uma vez por cada Pokémon não desmaiado e sem condição de status não volátil da equipe do usuário. Em cada acerto, a fórmula de dano usa o Ataque base do Pokémon participante como atributo de Ataque e a Defesa base do alvo como atributo de Defesa, e ignora estágios de atributos e outros efeitos que modificam Ataque ou Defesa; cada acerto é considerado como vindo do usuário.",
		},
		gen3: {
			desc: "Causa dano sem tipo. Acerta uma vez por cada Pokémon não desmaiado e sem condição de status não volátil da equipe do usuário, ou falha se nenhum Pokémon atender aos critérios. Em cada acerto, a fórmula de dano usa o Ataque base do Pokémon participante como atributo de Ataque e a Defesa base do alvo como atributo de Defesa, e ignora estágios de atributos e outros efeitos que modificam Ataque ou Defesa; cada acerto é considerado como vindo do usuário.",
		},
		gen2: {
			desc: "Causa dano sem tipo. Acerta uma vez por cada Pokémon não desmaiado e sem condição de status não volátil da equipe do usuário. Em cada acerto, a fórmula de dano usa o nível do Pokémon participante, seu Ataque base como atributo de Ataque e a Defesa base do alvo como atributo de Defesa, e ignora estágios de atributos e outros efeitos que modificam Ataque ou Defesa. Falha se nenhum membro da equipe puder participar.",
		},
		activate: "  Ataque de {NAME}!",
	},
	behemothbash: {
		shortDesc: "Sem efeito adicional.",
		gen8: {
			shortDesc: "O dano dobra se o alvo estiver Dynamaxado.",
		},
	},
	behemothblade: {
		shortDesc: "Sem efeito adicional.",
		gen8: {
			shortDesc: "O dano dobra se o alvo estiver Dynamaxado.",
		},
	},
	belch: {
		desc: "Este golpe não pode ser escolhido até que o usuário coma uma Berry, seja comendo uma que estava segurando, roubando e comendo a de outro Pokémon com Bug Bite ou Pluck, ou comendo uma que foi arremessada nele com Fling. Depois que a condição é cumprida, este golpe pode ser escolhido e usado pelo resto da batalha, mesmo que o usuário ganhe ou use outro item ou saia de campo. Consumir uma Berry com Natural Gift não conta como comê-la.",
		shortDesc: "Não pode ser escolhido até o usuário comer uma Berry.",
		champions: {
			desc: "Falha a menos que o usuário tenha comido uma Berry, seja comendo uma que estava segurando, roubando e comendo a de outro Pokémon com Bug Bite ou Pluck, ou comendo uma que foi arremessada nele com Fling. Consumir uma Berry com Natural Gift não conta como comê-la.",
			shortDesc: "Falha a menos que o usuário tenha comido uma Berry.",
		},
	},
	bellydrum: {
		desc: "Aumenta o Ataque do usuário em 12 estágios em troca de o usuário perder 1/2 do seu HP máximo, arredondado para baixo. Falha se o usuário fosse desmaiar ou se o estágio do seu Ataque for 6.",
		shortDesc: "O usuário perde 50% do HP máx. Maximiza o Ataque.",
		gen2: {
			desc: "O usuário perde 1/2 do seu HP máximo, arredondado para baixo, a menos que o usuário fosse desmaiar ou o estágio do seu Ataque seja 6. Se o usuário não tiver HP suficiente, seu Ataque é aumentado em 2 estágios. Caso contrário, enquanto o estágio do Ataque do usuário for menor que 6, ele é aumentado em 2, e se o atributo de Ataque antes desta etapa era 999, o estágio é diminuído em 1 e o ciclo termina.",
		},
		boost: "  {POKEMON} cortou o próprio HP e maximizou o Ataque!",
	},
	bestow: {
		desc: "O alvo recebe o item segurado pelo usuário. Falha se o usuário não tiver item ou estiver segurando um Z-Crystal, se o alvo já estiver segurando um item, se o item for uma Mega Stone e o usuário ou o alvo for a espécie que pode Megaevoluir com ela, ou se o item for Blue Orb, Red Orb, Griseous Orb, Plate, Drive ou Memory e o usuário ou o alvo for Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvally, respectivamente.",
		shortDesc: "O usuário passa seu item segurado para o alvo.",
		gen6: {
			desc: "O alvo recebe o item segurado pelo usuário. Falha se o usuário não tiver item, se o alvo já estiver segurando um item, se o item for uma Mega Stone e o usuário ou o alvo for a espécie que pode Megaevoluir com ela, ou se o item for Blue Orb, Red Orb, Griseous Orb, Plate ou Drive e o usuário ou o alvo for Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivamente.",
		},
		gen5: {
			desc: "O alvo recebe o item segurado pelo usuário. Falha se o usuário não tiver item ou estiver segurando um Mail, se o alvo já estiver segurando um item, ou se o item for Griseous Orb, Plate ou Drive e o usuário ou o alvo for Giratina, Arceus ou Genesect, respectivamente.",
		},
		takeItem: "  {SOURCE} deu {ITEM} para {POKEMON}!",
	},
	bide: {
		desc: "O usuário passa dois turnos preso a este golpe e então, no segundo turno após usá-lo, ataca o último Pokémon que o atingiu, causando o dobro do dano em HP que perdeu para ataques durante os dois turnos. Se o último Pokémon que o atingiu não estiver mais em campo, o usuário ataca um Pokémon adversário aleatório. Se o usuário for impedido de agir durante o uso deste golpe, o efeito termina. Este golpe não verifica a precisão e não ignora imunidade de tipo.",
		shortDesc: "Espera 2 turnos; causa o dobro do dano sofrido.",
		gen4: {
			desc: "O usuário passa dois turnos preso a este golpe e então, no segundo turno após usá-lo, ataca o último Pokémon que o atingiu, causando o dobro do dano em HP que perdeu para ataques durante os dois turnos. Se o último Pokémon que o atingiu não estiver mais em campo, o usuário ataca um Pokémon adversário aleatório. Se o usuário for impedido de agir durante o uso deste golpe, o efeito termina. Este golpe não verifica a precisão e ignora imunidade de tipo.",
		},
		gen3: {
			desc: "O usuário passa dois turnos preso a este golpe e então, no segundo turno após usá-lo, ataca o último Pokémon que o atingiu, causando o dobro do dano em HP que perdeu durante os dois turnos. Se o último Pokémon que o atingiu não estiver mais em campo, o usuário ataca um Pokémon adversário aleatório. Se o usuário for impedido de agir durante o uso deste golpe, o efeito termina. Este golpe não ignora imunidade de tipo.",
		},
		gen2: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e então, no segundo ou terceiro turno após usá-lo, ataca o oponente, causando o dobro do dano em HP que perdeu durante esses turnos. Se o usuário for impedido de agir durante o uso deste golpe, o efeito termina. Este golpe não ignora imunidade de tipo.",
			shortDesc: "Espera 2-3 turnos; causa o dobro do dano sofrido.",
		},
		gen1: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e então, no segundo ou terceiro turno após usá-lo, ataca o oponente, causando o dobro do dano em HP que perdeu durante esses turnos. Este golpe ignora imunidade de tipo e não pode ser evitado mesmo que o alvo esteja usando Dig ou Fly. O usuário pode escolher sair de campo durante o efeito. Se o usuário sair de campo ou for impedido de agir durante o uso deste golpe, o efeito termina. Durante o efeito, se o Pokémon adversário sair de campo ou usar Confuse Ray, Conversion, Focus Energy, Glare, Haze, Leech Seed, Light Screen, Mimic, Mist, Poison Gas, Poison Powder, Recover, Reflect, Rest, Soft-Boiled, Splash, Stun Spore, Substitute, Supersonic, Teleport, Thunder Wave, Toxic ou Transform, o dano anterior causado ao usuário será somado ao total.",
		},
		start: "  {POKEMON} está acumulando energia!",
		end: "  {POKEMON} liberou sua energia!",
		activate: "  {POKEMON} está acumulando energia!",
	},
	bind: {
		desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		gen3: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos. Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se usar Baton Pass. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen1: {
			desc: "O usuário passa de dois a cinco turnos usando este golpe. Tem 3/8 de chance de durar dois ou três turnos e 1/8 de chance de durar quatro ou cinco turnos. O dano calculado no primeiro turno é usado em todos os outros turnos. O usuário não pode escolher um golpe e o alvo não pode executar um golpe durante o efeito, mas ambos podem sair de campo. Se o usuário sair de campo, o alvo continua sem poder executar um golpe naquele turno. Se o alvo sair de campo, o usuário usa este golpe novamente de forma automática e, se ele tinha 0 PP no momento, o PP passa a ser 63. Se o usuário ou o alvo sair de campo, ou se o usuário for impedido de agir, o efeito termina. Este golpe pode impedir o alvo de agir mesmo que ele tenha imunidade de tipo, mas não causará dano.",
			shortDesc: "Impede o alvo de agir por 2-5 turnos.",
		},
		start: "  {POKEMON} foi apertado por {SOURCE}!",
	},
	bite: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
		gen1: {
			desc: "Tem 10% de chance de fazer o alvo recuar.",
			shortDesc: "10% de chance de fazer o alvo recuar.",
		},
	},
	bitterblade: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "O usuário recupera 50% do dano causado.",
	},
	bittermalice: {
		desc: "Tem 100% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Ataque do alvo em 1.",
	},
	blackholeeclipse: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	blastburn: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "O usuário não pode agir no próximo turno.",
	},
	blazekick: {
		desc: "Tem 10% de chance de queimar o alvo e maior chance de acerto crítico.",
		shortDesc: "Alta taxa de crítico. 10% de chance de queimar.",
	},
	blazingtorque: {
		desc: "Tem 30% de chance de queimar o alvo.",
		shortDesc: "30% de chance de queimar o alvo.",
	},
	bleakwindstorm: {
		desc: "Tem 30% de chance de diminuir a Velocidade do alvo em 1 estágio. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se este golpe for usado contra um Pokémon segurando Utility Umbrella, a precisão dele continua em 80%.",
		shortDesc: "30% de -1 Spe no(s) oponente(s). Chuva: não erra.",
	},
	blizzard: {
		desc: "Tem 10% de chance de congelar o alvo. Se o clima for neve, este golpe não verifica a precisão.",
		shortDesc: "10% de congelar oponente(s). Não erra na neve.",
		gen8: {
			desc: "Tem 10% de chance de congelar o alvo. Se o clima for granizo, este golpe não verifica a precisão.",
			shortDesc: "10% de congelar oponente(s). Não erra no granizo.",
		},
		gen3: {
			desc: "Tem 10% de chance de congelar o alvo.",
			shortDesc: "10% de chance de congelar o(s) oponente(s).",
		},
		gen2: {
			shortDesc: "10% de chance de congelar o alvo.",
		},
	},
	block: {
		desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Impede o alvo de sair de campo.",
		gen7: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo, a menos que use Baton Pass, caso em que o alvo continuará preso.",
		},
		gen3: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se usar Baton Pass. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo, a menos que use Baton Pass, caso em que o alvo continuará preso.",
		},
	},
	bloodmoon: {
		shortDesc: "Não pode ser escolhido no turno seguinte ao seu uso.",
	},
	bloomdoom: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	blueflare: {
		desc: "Tem 20% de chance de queimar o alvo.",
		shortDesc: "20% de chance de queimar o alvo.",
	},
	bodypress: {
		desc: "O dano é calculado usando o atributo de Defesa do usuário como Ataque, incluindo mudanças nos estágios de atributos. Outros efeitos que modificam o atributo de Ataque são aplicados normalmente.",
		shortDesc: "Usa a Def do usuário como Atk no cálculo de dano.",
	},
	bodyslam: {
		desc: "Tem 30% de chance de paralisar o alvo. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "30% de chance de paralisar o alvo.",
		gen5: {
			desc: "Tem 30% de chance de paralisar o alvo.",
		},
	},
	boltbeak: {
		desc: "O poder dobra se o usuário agir antes do alvo.",
		shortDesc: "O poder dobra se o usuário agir antes do alvo.",
	},
	boltstrike: {
		desc: "Tem 20% de chance de paralisar o alvo.",
		shortDesc: "20% de chance de paralisar o alvo.",
	},
	boneclub: {
		desc: "Tem 10% de chance de fazer o alvo recuar.",
		shortDesc: "10% de chance de fazer o alvo recuar.",
	},
	bonemerang: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
		gen4: {
			desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		},
		gen1: {
			desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o golpe termina.",
		},
	},
	bonerush: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
	},
	boomburst: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge Pokémon adjacentes.",
	},
	bounce: {
		desc: "Tem 30% de chance de paralisar o alvo. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Salta no turno 1. Ataca no turno 2. 30% de paralisar.",
		gen5: {
			desc: "Tem 30% de chance de paralisar o alvo. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Gust, Hurricane, Sky Uppercut, Smack Down, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		gen4: {
			desc: "Tem 30% de chance de paralisar o alvo. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Gust, Sky Uppercut, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		gen3: {
			desc: "Tem 30% de chance de paralisar o alvo. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Gust, Sky Uppercut, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele.",
		},
		prepare: "{POKEMON} saltou alto!",
	},
	bouncybubble: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "O usuário recupera 50% do dano causado.",
	},
	branchpoke: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional.",
	},
	bravebird: {
		desc: "Se o alvo perdeu HP, o usuário sofre dano de recuo igual a 33% do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 33% de dano de recuo.",
		gen4: {
			desc: "Se o alvo perdeu HP, o usuário sofre dano de recuo igual a 1/3 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Tem 1/3 de dano de recuo.",
		},
	},
	breakingswipe: {
		desc: "Tem 100% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "100% de reduzir o Ataque do(s) oponente(s) em 1.",
	},
	breakneckblitz: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	brickbreak: {
		desc: "Se este ataque não errar, os efeitos de Reflect, Light Screen e Aurora Veil terminam no lado do campo do alvo antes de o dano ser calculado.",
		shortDesc: "Destrói barreiras, a menos que o alvo seja imune.",
		gen6: {
			desc: "Se este ataque não errar, os efeitos de Reflect e Light Screen terminam no lado do campo do alvo antes de o dano ser calculado.",
		},
		gen4: {
			desc: "Se este ataque não errar, e mesmo que o alvo seja imune, os efeitos de Reflect e Light Screen terminam no lado do campo do alvo antes de o dano ser calculado.",
			shortDesc: "Destrói barreiras, mesmo que o alvo seja imune.",
		},
		gen3: {
			desc: "Se este ataque não errar, e mesmo que o alvo seja imune, os efeitos de Reflect e Light Screen terminam no lado do campo do oponente antes de o dano ser calculado.",
		},
		activate: "  {POKEMON} destruiu as proteções de {TEAM}!",
	},
	brine: {
		desc: "O poder dobra se o alvo tiver metade ou menos do seu HP máximo restante.",
		shortDesc: "O poder dobra se o HP do alvo for 50% ou menos.",
	},
	brutalswing: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge Pokémon adjacentes.",
	},
	bubble: {
		desc: "Tem 10% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "10% de reduzir a Velocidade do(s) oponente(s) em 1.",
		gen1: {
			desc: "Tem 33% de chance de diminuir a Velocidade do alvo em 1 estágio.",
			shortDesc: "33% de chance de diminuir a Velocidade do alvo em 1.",
		},
		gen2: {
			shortDesc: "10% de chance de diminuir a Velocidade do alvo em 1.",
		},
	},
	bubblebeam: {
		desc: "Tem 10% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Velocidade do alvo em 1.",
		gen1: {
			desc: "Tem 33% de chance de diminuir a Velocidade do alvo em 1 estágio.",
			shortDesc: "33% de chance de diminuir a Velocidade do alvo em 1.",
		},
	},
	bugbite: {
		desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, ele rouba a Berry segurada pelo alvo, se houver, e a come imediatamente, recebendo seus efeitos mesmo que o item do usuário esteja sendo ignorado. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		shortDesc: "O usuário rouba e come a Berry do alvo.",
		gen4: {
			desc: "O usuário rouba a Berry segurada pelo alvo, se houver, e a come imediatamente, recebendo seus efeitos, a menos que o item do usuário esteja sendo ignorado. Itens perdidos por este golpe podem ser recuperados com Recycle.",
		},
		removeItem: "  {SOURCE} roubou e comeu {ITEM} do alvo!",
	},
	bugbuzz: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	bulkup: {
		desc: "Aumenta o Ataque e a Defesa do usuário em 1 estágio.",
		shortDesc: "Aumenta o Ataque e a Defesa do usuário em 1.",
	},
	bulldoze: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de reduzir a Velocidade dos adjacentes em 1.",
	},
	bulletpunch: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	bulletseed: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
	},
	burningbulwark: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário ficam queimados. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		shortDesc: "Protege de ataques que causam dano. Contato: queima.",
	},
	burningjealousy: {
		desc: "Tem 100% de chance de queimar o alvo se algum estágio de atributo dele tiver sido aumentado neste turno.",
		shortDesc: "100%: queima alvo que aumentou atributo no turno.",
	},
	burnup: {
		desc: "Falha a menos que o usuário seja do tipo Fire. Se este golpe for bem-sucedido e o usuário não estiver Terastalizado, o tipo Fire do usuário deixa de existir (fica sem tipo) enquanto ele permanecer em campo.",
		shortDesc: "Usuário perde o tipo Fire; precisa ser do tipo Fire.",
		gen8: {
			desc: "Falha a menos que o usuário seja do tipo Fire. Se este golpe for bem-sucedido, o tipo Fire do usuário deixa de existir (fica sem tipo) enquanto ele permanecer em campo.",
		},
		typeChange: "  {POKEMON} se consumiu no próprio fogo!",
	},
	buzzybuzz: {
		desc: "Tem 100% de chance de paralisar o oponente.",
		shortDesc: "100% de chance de paralisar o oponente.",
	},
	calmmind: {
		desc: "Aumenta o Ataque Especial e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Aumenta o Sp. Atk e a Sp. Def do usuário em 1.",
	},
	camouflage: {
		desc: "O tipo do usuário muda de acordo com o terreno de batalha. Fica do tipo Normal no terreno normal de Wi-Fi, do tipo Electric durante Electric Terrain, do tipo Fairy durante Misty Terrain, do tipo Grass durante Grassy Terrain e do tipo Psychic durante Psychic Terrain. Falha se o tipo do usuário não puder ser alterado ou se o usuário já for apenas desse tipo.",
		shortDesc: "Muda tipo do usuário pelo terreno (padrão tipo Normal).",
		gen6: {
			desc: "O tipo do usuário muda de acordo com o terreno de batalha. Fica do tipo Normal no terreno normal de Wi-Fi, do tipo Electric durante Electric Terrain, do tipo Fairy durante Misty Terrain e do tipo Grass durante Grassy Terrain. Falha se o tipo do usuário não puder ser alterado ou se o usuário já for apenas desse tipo.",
		},
		gen5: {
			desc: "O tipo do usuário muda de acordo com o terreno de batalha. Fica do tipo Ground no terreno normal de Wi-Fi. Falha se o tipo do usuário não puder ser alterado ou se o usuário já for apenas desse tipo.",
			shortDesc: "Muda o tipo do usuário pelo terreno. (tipo Ground)",
		},
		gen4: {
			desc: "O tipo do usuário muda de acordo com o terreno de batalha. Fica do tipo Normal no terreno normal de Wi-Fi. Falha se o usuário tiver a habilidade Multitype ou se o tipo for um dos tipos atuais do usuário.",
			shortDesc: "Muda o tipo do usuário pelo terreno. (tipo Normal)",
		},
		gen3: {
			desc: "O tipo do usuário muda de acordo com o terreno de batalha. Fica do tipo Normal no terreno normal de Wi-Fi. Falha se o tipo for um dos tipos atuais do usuário.",
		},
	},
	captivate: {
		desc: "Diminui o Ataque Especial do alvo em 2 estágios. O alvo não é afetado se o usuário e o alvo forem do mesmo gênero, ou se algum deles não tiver gênero. Pokémon com a habilidade Oblivious são imunes.",
		shortDesc: "-2 Sp. Atk no(s) oponente(s) se de gênero oposto.",
	},
	catastropika: {
		shortDesc: "Sem efeito adicional.",
	},
	ceaselessedge: {
		desc: "Se este golpe for bem-sucedido, ele coloca uma armadilha no lado adversário do campo, que causa dano a cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Podem ser colocadas no máximo três camadas, e os oponentes perdem 1/8 do HP máximo com uma camada, 1/6 do HP máximo com duas camadas e 1/4 do HP máximo com três camadas, tudo arredondado para baixo. Pode ser removida do lado adversário se qualquer Pokémon usar Tidy Up, ou se qualquer Pokémon adversário usar Mortal Spin, Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Coloca uma camada de Spikes no lado adversário.",
	},
	celebrate: {
		shortDesc: "Sem uso competitivo.",
		activate: "  Parabéns, {TRAINER}!",
	},
	charge: {
		desc: "Aumenta a Defesa Especial do usuário em 1 estágio. O próximo ataque do tipo Electric do usuário terá o poder dobrado; o efeito termina quando o usuário não estiver mais em campo, ou depois que o usuário tentar usar qualquer golpe do tipo Electric além de Charge, mesmo que não seja bem-sucedido.",
		shortDesc: "+1 SpD; próximo golpe do tipo Electric com 2× poder.",
		gen8: {
			desc: "Aumenta a Defesa Especial do usuário em 1 estágio. Se o usuário usar um ataque do tipo Electric no próximo turno, o poder dele será dobrado.",
			shortDesc: "+1 SpD; golpe do tipo Electric no próx. turno: 2×.",
		},
		gen3: {
			desc: "Se o usuário usar um ataque do tipo Electric no próximo turno, o poder dele será dobrado.",
			shortDesc: "Ataque do tipo Electric no próximo turno tem 2× poder.",
		},
		start: "  {POKEMON} começou a carregar energia!",
	},
	chargebeam: {
		desc: "Tem 70% de chance de aumentar o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "70% de chance de aumentar o Sp. Atk do usuário em 1.",
	},
	charm: {
		desc: "Diminui o Ataque do alvo em 2 estágios.",
		shortDesc: "Diminui o Ataque do alvo em 2.",
	},
	chatter: {
		desc: "Tem 100% de chance de confundir o alvo.",
		shortDesc: "100% de chance de confundir o alvo.",
		gen5: {
			desc: "Tem X% de chance de confundir o alvo, onde X é 0, a menos que o usuário seja um Chatot que não usou Transform. Se o usuário for um Chatot, X é 0 ou 10, dependendo do volume do grito gravado de Chatot, se houver; 0 para volume baixo ou nenhuma gravação, 10 para gravação de volume médio a alto.",
			shortDesc: "Para Chatot, 10% de chance de confundir o alvo.",
		},
		gen4: {
			desc: "Tem X% de chance de confundir o alvo, onde X é 0, a menos que o usuário seja um Chatot que não usou Transform. Se o usuário for um Chatot, X é 1, 11 ou 31, dependendo do volume do grito gravado de Chatot, se houver; 1 para nenhuma gravação ou volume baixo, 11 para volume médio e 31 para volume alto.",
			shortDesc: "Para Chatot, 31% de chance de confundir o alvo.",
		},
	},
	chillingwater: {
		desc: "Tem 100% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Ataque do alvo em 1.",
	},
	chillyreception: {
		desc: "Por 5 turnos, o clima se torna neve. O usuário sai de campo mesmo que esteja preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe não desmaiados.",
		shortDesc: "Inicia neve. O usuário sai de campo.",
		prepare: "  {POKEMON} está se preparando para contar uma piada gelada de tão ruim!",
	},
	chipaway: {
		desc: "Ignora as mudanças nos estágios de atributos do alvo, incluindo a evasão.",
		shortDesc: "Ignora as mudanças nos estágios de atributos do alvo.",
	},
	chloroblast: {
		desc: "Se este golpe for bem-sucedido, o usuário perde 1/2 do seu HP máximo, arredondado para cima, a menos que o usuário tenha a habilidade Magic Guard ou Rock Head.",
		shortDesc: "O usuário perde 50% do HP máximo.",
	},
	circlethrow: {
		desc: "Se nem o usuário nem o alvo tiverem desmaiado, o alvo é forçado a sair de campo e é substituído por um aliado aleatório não desmaiado. Este efeito falha se o alvo estiver sob o efeito de Ingrain, tiver a habilidade Suction Cups ou se este golpe atingir um substituto.",
		shortDesc: "Força o alvo a trocar por um aliado aleatório.",
	},
	clamp: {
		desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		gen3: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos. Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se usar Baton Pass. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen1: {
			desc: "O usuário passa de dois a cinco turnos usando este golpe. Tem 3/8 de chance de durar dois ou três turnos e 1/8 de chance de durar quatro ou cinco turnos. O dano calculado no primeiro turno é usado em todos os outros turnos. O usuário não pode escolher um golpe e o alvo não pode executar um golpe durante o efeito, mas ambos podem sair de campo. Se o usuário sair de campo, o alvo continua sem poder executar um golpe naquele turno. Se o alvo sair de campo, o usuário usa este golpe novamente de forma automática e, se ele tinha 0 PP no momento, o PP passa a ser 63. Se o usuário ou o alvo sair de campo, ou se o usuário for impedido de agir, o efeito termina. Este golpe pode impedir o alvo de agir mesmo que ele tenha imunidade de tipo, mas não causará dano.",
			shortDesc: "Impede o alvo de agir por 2-5 turnos.",
		},
		start: "  {SOURCE} prendeu {POKEMON} com força!",
	},
	clangingscales: {
		desc: "Diminui a Defesa do usuário em 1 estágio.",
		shortDesc: "Diminui a Defesa do usuário em 1.",
	},
	clangoroussoul: {
		desc: "Aumenta o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio em troca de o usuário perder 33% do seu HP máximo, arredondado para baixo. Falha se o usuário fosse desmaiar ou se os estágios de Ataque, Defesa, Ataque Especial, Defesa Especial e Velocidade não fossem mudar.",
		shortDesc: "Usuário perde 33% do HP máx. +1 em todos os atributos.",
	},
	clangoroussoulblaze: {
		desc: "Aumenta o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio.",
		shortDesc: "Aumenta Atk/Def/SpAtk/SpDef/Spe do usuário em 1.",
	},
	clearsmog: {
		shortDesc: "Zera todos os estágios de atributos do alvo.",
	},
	closecombat: {
		desc: "Diminui a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Diminui a Defesa e a Sp. Def do usuário em 1.",
	},
	coaching: {
		desc: "Aumenta o Ataque e a Defesa do alvo em 1 estágio. Falha se não houver aliado adjacente ao usuário.",
		shortDesc: "Aumenta o Ataque e a Defesa de um aliado em 1.",
	},
	coil: {
		desc: "Aumenta o Ataque, a Defesa e a precisão do usuário em 1 estágio.",
		shortDesc: "Aumenta Ataque, Defesa e precisão do usuário em 1.",
	},
	collisioncourse: {
		desc: "O dano é multiplicado por 1,3333 se este golpe for superefetivo contra o alvo.",
		shortDesc: "Causa 1,3333× de dano com acertos superefetivos.",
	},
	combattorque: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar o alvo.",
	},
	cometpunch: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	comeuppance: {
		desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico ou especial neste turno, igual a 1,5 vez o HP perdido pelo usuário com esse ataque, arredondado para baixo. Se o usuário não perdeu HP com esse ataque, este golpe causa 1 HP de dano. Se a posição desse Pokémon adversário não estiver mais ocupada e houver outro Pokémon adversário em campo, o dano é causado a ele. Apenas o último acerto de um ataque de múltiplos acertos é considerado. Falha se o usuário não tiver sido atingido por um ataque físico ou especial de um Pokémon adversário neste turno.",
		shortDesc: "Se atingido por um ataque, devolve 1,5× o dano.",
	},
	confide: {
		desc: "Diminui o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "Diminui o Sp. Atk do alvo em 1.",
	},
	confuseray: {
		desc: "Deixa o alvo confuso.",
		shortDesc: "Confunde o alvo.",
	},
	confusion: {
		desc: "Tem 10% de chance de confundir o alvo.",
		shortDesc: "10% de chance de confundir o alvo.",
	},
	constrict: {
		desc: "Tem 10% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Velocidade do alvo em 1.",
		gen1: {
			desc: "Tem 33% de chance de diminuir a Velocidade do alvo em 1 estágio.",
			shortDesc: "33% de chance de diminuir a Velocidade do alvo em 1.",
		},
	},
	continentalcrush: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	conversion: {
		desc: "O tipo do usuário muda para o tipo original do golpe em seu primeiro espaço de golpe. Falha se o usuário não puder mudar de tipo, ou se o tipo for um dos tipos atuais do usuário.",
		shortDesc: "Muda o tipo do usuário para o do seu primeiro golpe.",
		gen5: {
			desc: "O tipo do usuário muda para o tipo original de um dos golpes que ele conhece, exceto este, escolhido aleatoriamente, mas não para nenhum dos seus tipos atuais. Falha se o usuário não puder mudar de tipo, ou se este golpe só puder escolher um dos tipos atuais do usuário.",
			shortDesc: "Muda o tipo do usuário para o de um golpe conhecido.",
		},
		gen4: {
			desc: "O tipo do usuário muda para o tipo original de um dos golpes que ele conhece, exceto este e Curse, escolhido aleatoriamente, mas não para nenhum dos seus tipos atuais. Falha se o usuário não puder mudar de tipo, ou se este golpe só puder escolher um dos tipos atuais do usuário.",
		},
		gen3: {
			desc: "O tipo do usuário muda para o tipo original de um dos golpes que ele conhece, exceto Curse, escolhido aleatoriamente, mas não para nenhum dos seus tipos atuais. Falha se o usuário não puder mudar de tipo, ou se este golpe só puder escolher um dos tipos atuais do usuário.",
		},
		gen1: {
			desc: "Faz os tipos do usuário se tornarem iguais aos tipos atuais do alvo.",
			shortDesc: "O usuário passa a ter o mesmo tipo do alvo.",
		},
		typeChange: "  Tipo convertido para o de {SOURCE}!",
	},
	conversion2: {
		desc: "O tipo do usuário muda para um tipo que resiste ou é imune ao tipo do último golpe usado pelo alvo, mas não para nenhum dos seus tipos atuais. É usado o tipo efetivo do golpe, e não o tipo original. Falha se o alvo ainda não usou um golpe, se o usuário não puder mudar de tipo, ou se este golpe só puder escolher um dos tipos atuais do usuário.",
		shortDesc: "Muda o tipo para resistir ao último golpe do alvo.",
		gen4: {
			desc: "O tipo do usuário muda para um tipo que resiste ou é imune ao tipo do último golpe usado contra o usuário, se ele foi bem-sucedido contra o usuário, mas não para nenhum dos seus tipos atuais. É usado o tipo efetivo do golpe, e não o tipo original. Falha se o último golpe usado contra o usuário não foi bem-sucedido, se o usuário tiver a habilidade Multitype, ou se este golpe só puder escolher um dos tipos atuais do usuário.",
			shortDesc: "Muda o tipo para resistir ao último golpe sofrido.",
		},
		gen3: {
			desc: "O tipo do usuário muda para um tipo que resiste ou é imune ao tipo do último golpe usado contra o usuário, se ele foi bem-sucedido contra o usuário, mas não para nenhum dos seus tipos atuais. É usado o tipo efetivo do golpe, e não o tipo original, mas Struggle é considerado do tipo Normal. Falha se o último golpe usado contra o usuário não foi bem-sucedido, ou se este golpe só puder escolher um dos tipos atuais do usuário.",
		},
		gen2: {
			desc: "O tipo do usuário muda para um tipo que resiste ou é imune ao tipo do último golpe usado pelo Pokémon adversário, mesmo que seja um dos tipos atuais do usuário. É usado o tipo original do golpe, e não o tipo efetivo. Falha se o Pokémon adversário ainda não usou um golpe.",
			shortDesc: "Muda o tipo para resistir ao último golpe do oponente.",
		},
	},
	copycat: {
		desc: "O usuário usa o último golpe usado por qualquer Pokémon, incluindo ele mesmo. Falha se nenhum golpe tiver sido usado, ou se o último golpe usado foi Assist, Baneful Bunker, Beak Blast, Behemoth Bash, Behemoth Blade, Belch, Bestow, Blazing Torque, Celebrate, Chatter, Circle Throw, Combat Torque, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Dynamax Cannon, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Magical Torque, Mat Block, Me First, Metronome, Mimic, Mirror Move, Nature Power, Noxious Torque, Protect, Rage Powder, Roar, Shell Trap, Sketch, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Tera Starstorm, Thief, Transform, Trick, Whirlwind ou Wicked Torque.",
		shortDesc: "Usa o último golpe usado na batalha.",
		gen8: {
			desc: "O usuário usa o último golpe usado por qualquer Pokémon, incluindo ele mesmo. Para isso, é considerado o golpe base de Max Moves e G-Max Moves. Falha se nenhum golpe tiver sido usado, ou se o último golpe usado foi Assist, Baneful Bunker, Beak Blast, Behemoth Bash, Behemoth Blade, Belch, Bestow, Celebrate, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Dynamax Cannon, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Roar, Shell Trap, Sketch, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Thief, Transform, Trick ou Whirlwind.",
		},
		gen7: {
			desc: "O usuário usa o último golpe usado por qualquer Pokémon, incluindo ele mesmo. Falha se nenhum golpe tiver sido usado, ou se o último golpe usado foi Assist, Baneful Bunker, Beak Blast, Belch, Bestow, Celebrate, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Roar, Shell Trap, Sketch, Sleep Talk, Snatch, Spiky Shield, Spotlight, Struggle, Switcheroo, Thief, Transform, Trick, Whirlwind ou qualquer Z-Move.",
		},
		gen6: {
			desc: "O usuário usa o último golpe usado por qualquer Pokémon, incluindo ele mesmo. Falha se nenhum golpe tiver sido usado, ou se o último golpe usado foi Assist, Belch, Bestow, Celebrate, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Hold Hands, King's Shield, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Roar, Sketch, Sleep Talk, Snatch, Spiky Shield, Struggle, Switcheroo, Thief, Transform, Trick ou Whirlwind.",
		},
		gen5: {
			desc: "O usuário usa o último golpe usado por qualquer Pokémon, incluindo ele mesmo. Falha se nenhum golpe tiver sido usado, ou se o último golpe usado foi Assist, Bestow, Chatter, Circle Throw, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Tail, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Rage Powder, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Transform ou Trick.",
		},
		gen4: {
			desc: "O usuário usa o último golpe usado por qualquer Pokémon, incluindo ele mesmo. Falha se nenhum golpe tiver sido usado, ou se o último golpe usado foi Assist, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief ou Trick.",
		},
	},
	coreenforcer: {
		desc: "Se o usuário agir depois do alvo, a habilidade do alvo fica sem efeito enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode ou Zero to Hero, este efeito não acontece, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		shortDesc: "Anula a habilidade do(s) oponente(s) que agiu(ram) antes.",
		gen8: {
			desc: "Se o usuário agir depois do alvo, a habilidade do alvo fica sem efeito enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode, este efeito não acontece, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		},
		gen7: {
			desc: "Se o usuário agir depois do alvo, a habilidade do alvo fica sem efeito enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode, este efeito não acontece, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		},
	},
	corkscrewcrash: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	corrosivegas: {
		desc: "O alvo perde seu item segurado. Este golpe não faz Pokémon com a habilidade Sticky Hold perderem o item segurado, nem faz Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, Pokémon Paradox ou Ogerpon perderem Blue Orb, Red Orb, Adamant Crystal, Lustrous Globe, Griseous Core, Plate, Drive, Memory, Rusted Sword, Rusted Shield, Booster Energy ou Mask, respectivamente. Neste caso, Pokémon Paradox incluem todas as espécies com as habilidades Protosynthesis e Quark Drive, exceto Gouging Fire, Raging Bolt, Iron Boulder e Iron Crown. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		shortDesc: "Remove os itens segurados dos Pokémon adjacentes.",
		gen8: {
			desc: "O alvo perde seu item segurado. Este golpe não faz Pokémon com a habilidade Sticky Hold perderem o item segurado, nem faz Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian ou Zamazenta perderem Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword ou Rusted Shield, respectivamente. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		removeItem: "  {SOURCE} corroeu {ITEM} de {POKEMON}!",
	},
	cosmicpower: {
		desc: "Aumenta a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Aumenta a Defesa e a Sp. Def do usuário em 1.",
	},
	cottonguard: {
		desc: "Aumenta a Defesa do usuário em 3 estágios.",
		shortDesc: "Aumenta a Defesa do usuário em 3.",
	},
	cottonspore: {
		desc: "Diminui a Velocidade do alvo em 2 estágios.",
		shortDesc: "Diminui a Velocidade do alvo em 2.",
	},
	counter: {
		desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se o usuário não perdeu HP com o ataque, este golpe causa 1 HP de dano. Se a posição desse Pokémon adversário não estiver mais ocupada e houver outro Pokémon adversário em campo, o dano é causado a ele. Apenas o último acerto de um ataque de múltiplos acertos é considerado. Falha se o usuário não tiver sido atingido por um ataque físico de um Pokémon adversário neste turno.",
		shortDesc: "Se atingido por ataque físico, devolve o dobro do dano.",
		gen6: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se o usuário não perdeu HP com o ataque, este golpe causa dano com poder 1. Se a posição desse Pokémon adversário não estiver mais ocupada, o dano é causado a um Pokémon adversário aleatório ao alcance. Apenas o último acerto de um ataque de múltiplos acertos é considerado. Falha se o usuário não tiver sido atingido por um ataque físico de um Pokémon adversário neste turno.",
		},
		gen4: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se a posição desse Pokémon adversário não estiver mais ocupada e houver outro Pokémon adversário em campo, o dano é causado a ele. Apenas o último acerto de um ataque de múltiplos acertos é considerado. Falha se o usuário não tiver sido atingido por um ataque físico de um Pokémon adversário neste turno, ou se o usuário não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se a posição desse Pokémon adversário não estiver mais ocupada e houver outro Pokémon adversário em campo, o dano é causado a ele. Este golpe considera Hidden Power como do tipo Normal, e apenas o último acerto de um ataque de múltiplos acertos é considerado. Falha se o usuário não tiver sido atingido por um ataque físico de um Pokémon adversário neste turno, ou se o usuário não perdeu HP com o ataque.",
		},
		gen2: {
			desc: "Causa dano ao Pokémon adversário igual ao dobro do HP perdido pelo usuário com um ataque físico neste turno. Este golpe considera Hidden Power como do tipo Normal, e apenas o último acerto de um ataque de múltiplos acertos é considerado. Falha se o usuário agir primeiro, se o usuário não tiver sido atingido por um ataque físico neste turno, ou se o usuário não perdeu HP com o ataque. Se o Pokémon adversário usou Fissure ou Horn Drill e errou, este golpe causa 65535 de dano.",
		},
		gen1: {
			desc: "Causa dano ao Pokémon adversário igual ao dobro do dano causado pelo último golpe usado na batalha. Este golpe ignora imunidade de tipo. Falha se o usuário agir primeiro, ou se o último golpe do lado adversário foi Counter, tinha poder 0 ou não era dos tipos Normal ou Fighting. Falha se o último golpe usado por qualquer um dos lados causou 0 de dano e não foi Confuse Ray, Conversion, Focus Energy, Glare, Haze, Leech Seed, Light Screen, Mimic, Mist, Poison Gas, Poison Powder, Recover, Reflect, Rest, Soft-Boiled, Splash, Stun Spore, Substitute, Supersonic, Teleport, Thunder Wave, Toxic ou Transform.",
			shortDesc: "Atingido por golpe dos tipos Normal/Fighting: 2× dano.",
		},
	},
	courtchange: {
		desc: "Troca os efeitos de Mist, Light Screen, Reflect, Spikes, Safeguard, Tailwind, Toxic Spikes, Stealth Rock, Water Pledge, Fire Pledge, Grass Pledge, Sticky Web, Aurora Veil, G-Max Steelsurge, G-Max Cannonade, G-Max Vine Lash e G-Max Wildfire do lado do usuário para o lado adversário e vice-versa.",
		shortDesc: "Troca os efeitos de campo entre os dois lados.",
		activate: "  {POKEMON} trocou os efeitos de batalha que afetavam cada lado do campo!",
	},
	covet: {
		desc: "Se este ataque for bem-sucedido e o usuário não tiver desmaiado, ele rouba o item segurado pelo alvo, caso o usuário não esteja segurando nenhum. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. O item do alvo não é roubado se for Blue Orb, Red Orb, Adamant Crystal, Lustrous Globe, Griseous Core, Plate, Drive, Memory, Rusted Sword, Rusted Shield, Booster Energy ou Mask segurado por Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, Pokémon Paradox ou Ogerpon, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Neste caso, Pokémon Paradox incluem todas as espécies com as habilidades Protosynthesis e Quark Drive, exceto Gouging Fire, Raging Bolt, Iron Boulder e Iron Crown. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		shortDesc: "Se o usuário não tiver item, rouba o do alvo.",
		champions: {
			desc: "Se este ataque for bem-sucedido e o usuário não estiver segurando um item, ele rouba o item segurado pelo alvo. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. O item do alvo não é roubado se for uma Mega Stone e o usuário ou o alvo for a espécie que pode Megaevoluir com ela. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen8: {
			desc: "Se este ataque for bem-sucedido e o usuário não tiver desmaiado, ele rouba o item segurado pelo alvo, caso o usuário não esteja segurando nenhum. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. O item do alvo não é roubado se for Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword ou Rusted Shield segurado por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian ou Zamazenta, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen7: {
			desc: "Se este ataque for bem-sucedido e o usuário não tiver desmaiado, ele rouba o item segurado pelo alvo, caso o usuário não esteja segurando nenhum. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. O item do alvo não é roubado se for um Z-Crystal, uma Mega Stone segurada pela espécie que pode Megaevoluir com ela, ou Blue Orb, Red Orb, Griseous Orb, Plate, Drive ou Memory segurado por Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvally, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen6: {
			desc: "Se este ataque for bem-sucedido e o usuário não tiver desmaiado, ele rouba o item segurado pelo alvo, caso o usuário não esteja segurando nenhum. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. O item do alvo não é roubado se for uma Mega Stone segurada pela espécie que pode Megaevoluir com ela, ou Blue Orb, Red Orb, Griseous Orb, Plate ou Drive segurado por Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen5: {
			desc: "Se este ataque for bem-sucedido e o usuário não tiver desmaiado, ele rouba o item segurado pelo alvo, caso o usuário não esteja segurando nenhum. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. O item do alvo não é roubado se for um Mail, ou se for Griseous Orb, Plate ou Drive segurado por Giratina, Arceus ou Genesect, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen4: {
			desc: "Se este ataque for bem-sucedido e o usuário não estiver segurando um item, ele rouba o item segurado pelo alvo. O item do alvo não é roubado se for um Mail ou Griseous Orb, ou se o alvo tiver a habilidade Multitype ou Sticky Hold. Itens perdidos por este golpe não podem ser recuperados com Recycle.",
		},
		gen3: {
			desc: "Se este ataque for bem-sucedido e o usuário não estiver segurando um item, ele rouba o item segurado pelo alvo. O item do alvo não é roubado se for um Mail ou Enigma Berry, ou se o alvo tiver a habilidade Sticky Hold. Itens perdidos por este golpe não podem ser recuperados com Recycle.",
		},
	},
	crabhammer: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	craftyshield: {
		desc: "O usuário e os membros da sua equipe ficam protegidos de ataques que não causam dano feitos por outros Pokémon, incluindo aliados, neste turno. Falha se o usuário for o último a agir neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		shortDesc: "Protege aliados de golpes de status neste turno.",
		start: "  Crafty Shield protegeu {TEAM}!",
		block: "  Crafty Shield protegeu {POKEMON}!",
	},
	crosschop: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	crosspoison: {
		desc: "Tem 10% de chance de envenenar o alvo e maior chance de acerto crítico.",
		shortDesc: "Alta taxa de crítico. 10% de chance de envenenar.",
	},
	crunch: {
		desc: "Tem 20% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "20% de chance de diminuir a Defesa do alvo em 1.",
		gen3: {
			desc: "Tem 20% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
			shortDesc: "20% de chance de diminuir a Sp. Def do alvo em 1.",
		},
	},
	crushclaw: {
		desc: "Tem 50% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a Defesa do alvo em 1.",
	},
	crushgrip: {
		desc: "O poder é igual a 120 × (HP atual do alvo / HP máximo do alvo), arredondado para baixo na metade exata, mas não menos que 1.",
		shortDesc: "Mais poder quanto mais HP restar ao alvo.",
		gen4: {
			desc: "O poder é igual a 120 × (HP atual do alvo / HP máximo do alvo) + 1, arredondado para baixo.",
		},
	},
	curse: {
		desc: "Se o usuário não for do tipo Ghost, diminui a Velocidade do usuário em 1 estágio e aumenta o Ataque e a Defesa do usuário em 1 estágio. Se o usuário for do tipo Ghost, o usuário perde 1/2 do seu HP máximo, arredondado para baixo e mesmo que isso o faça desmaiar, em troca de o alvo perder 1/4 do seu HP máximo, arredondado para baixo, ao final de cada turno enquanto estiver em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará afetado. Falha se não houver alvo ou se o alvo já estiver afetado.",
		shortDesc: "Se do tipo Ghost, amaldiçoa; senão -1 Spe, +1 Atk/Def.",
		gen4: {
			desc: "Se o usuário não for do tipo Ghost, diminui a Velocidade do usuário em 1 estágio e aumenta o Ataque e a Defesa do usuário em 1 estágio. Se o usuário for do tipo Ghost, o usuário perde 1/2 do seu HP máximo, arredondado para baixo e mesmo que isso o faça desmaiar, em troca de o alvo perder 1/4 do seu HP máximo, arredondado para baixo, ao final de cada turno enquanto estiver em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará afetado. Falha se não houver alvo ou se o alvo já estiver afetado ou tiver um substituto.",
		},
		gen2: {
			desc: "Se o usuário não for do tipo Ghost, diminui a Velocidade do usuário em 1 estágio e aumenta o Ataque e a Defesa do usuário em 1 estágio, a menos que os atributos de Ataque e Defesa do usuário estejam ambos no estágio 6. Se o usuário for do tipo Ghost, o usuário perde 1/2 do seu HP máximo, arredondado para baixo e mesmo que isso o faça desmaiar, em troca de o alvo perder 1/4 do seu HP máximo, arredondado para baixo, ao final de cada turno enquanto estiver em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará afetado. Falha se o alvo já estiver afetado ou tiver um substituto.",
		},
		start: "  {SOURCE} cortou o próprio HP e lançou uma maldição em {POKEMON}!",
		damage: "  {POKEMON} está sofrendo com a maldição!",
	},
	cut: {
		shortDesc: "Sem efeito adicional.",
	},
	darkestlariat: {
		desc: "Ignora as mudanças nos estágios de atributos do alvo, incluindo a evasão.",
		shortDesc: "Ignora as mudanças nos estágios de atributos do alvo.",
	},
	darkpulse: {
		desc: "Tem 20% de chance de fazer o alvo recuar.",
		shortDesc: "20% de chance de fazer o alvo recuar.",
	},
	darkvoid: {
		desc: "Faz o alvo adormecer. Este golpe só pode ser usado com sucesso se a forma atual do usuário, considerando Transform, for Darkrai.",
		shortDesc: "Darkrai: faz o(s) oponente(s) adormecer(em).",
		gen6: {
			desc: "Faz o alvo adormecer.",
			shortDesc: "Faz o(s) oponente(s) adormecer(em).",
		},
		fail: "Mas {POKEMON} não pode usar o golpe!",
		failWrongForme: "Mas {POKEMON} não pode usá-lo na forma atual!",
	},
	dazzlinggleam: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge oponentes adjacentes.",
	},
	decorate: {
		desc: "Aumenta o Ataque e o Ataque Especial do alvo em 2 estágios.",
		shortDesc: "Aumenta o Ataque e o Sp. Atk do alvo em 2.",
	},
	defendorder: {
		desc: "Aumenta a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Aumenta a Defesa e a Sp. Def do usuário em 1.",
	},
	defensecurl: {
		desc: "Aumenta a Defesa do usuário em 1 estágio. Enquanto o usuário permanecer em campo, o poder de Ice Ball e Rollout do usuário será dobrado (este efeito não é cumulativo).",
		shortDesc: "Aumenta a Defesa do usuário em 1.",
		gen2: {
			desc: "Aumenta a Defesa do usuário em 1 estágio. Enquanto o usuário permanecer em campo, o poder de Rollout do usuário será dobrado (este efeito não é cumulativo). Baton Pass pode ser usado para transferir este efeito a um aliado.",
		},
		gen1: {
			desc: "Aumenta a Defesa do usuário em 1 estágio.",
		},
	},
	defog: {
		desc: "Diminui a evasão do alvo em 1 estágio. Se este golpe for bem-sucedido, tendo ou não afetado a evasão do alvo, os efeitos de Reflect, Light Screen, Aurora Veil, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do alvo, e os efeitos de Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do usuário. Ignora o substituto do alvo, embora o substituto ainda bloqueie a diminuição da evasão. Se houver um terreno ativo e este golpe for bem-sucedido, o terreno será removido.",
		shortDesc: "-1 evasão; remove armadilhas e terreno dos dois lados.",
		gen7: {
			desc: "Diminui a evasão do alvo em 1 estágio. Se este golpe for bem-sucedido, tendo ou não afetado a evasão do alvo, os efeitos de Reflect, Light Screen, Aurora Veil, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do alvo, e os efeitos de Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do usuário. Ignora o substituto do alvo, embora o substituto ainda bloqueie a diminuição da evasão.",
			shortDesc: "-1 evasão; remove armadilhas dos dois lados.",
		},
		gen6: {
			desc: "Diminui a evasão do alvo em 1 estágio. Se este golpe for bem-sucedido, tendo ou não afetado a evasão do alvo, os efeitos de Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do alvo, e os efeitos de Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do usuário. Ignora o substituto do alvo, embora o substituto ainda bloqueie a diminuição da evasão.",
		},
		gen5: {
			desc: "Diminui a evasão do alvo em 1 estágio. Se este golpe for bem-sucedido, tendo ou não afetado a evasão do alvo, os efeitos de Reflect, Light Screen, Safeguard, Mist, Spikes, Toxic Spikes e Stealth Rock terminam no lado do alvo. Ignora o substituto do alvo, embora o substituto ainda bloqueie a diminuição da evasão.",
			shortDesc: "-1 evasão; remove armadilhas/barreiras do lado do alvo.",
		},
	},
	destinybond: {
		desc: "Até o próximo golpe do usuário, se o ataque de um Pokémon adversário nocautear o usuário, esse Pokémon também desmaia, a menos que o ataque tenha sido Doom Desire ou Future Sight. Falha se o usuário tiver usado este golpe com sucesso como seu último golpe, desconsiderando golpes usados pela habilidade Dancer.",
		shortDesc: "Se um oponente nocautear o usuário, ele também desmaia.",
		gen6: {
			desc: "Até o próximo turno do usuário, se o ataque de um Pokémon adversário nocautear o usuário, esse Pokémon também desmaia, a menos que o ataque tenha sido Doom Desire ou Future Sight.",
		},
		gen2: {
			desc: "Até o próximo turno do usuário, se o ataque de um Pokémon adversário nocautear o usuário, esse Pokémon também desmaia.",
		},
		start: "  {POKEMON} espera levar seu atacante junto!",
		activate: "{POKEMON} levou seu atacante junto!",
	},
	detect: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		shortDesc: "Impede que golpes afetem o usuário neste turno.",
		gen8: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen7: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen6: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen5: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure, Protect, Quick Guard ou Wide Guard. Falha se o usuário for o último a agir neste turno.",
		},
		gen4: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada uso bem-sucedido deste golpe, até um máximo de 8. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário for o último a agir neste turno.",
		},
		gen3: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem X/65536 de chance de ser bem-sucedido, onde X começa em 65535 e é dividido pela metade, arredondado para baixo, a cada uso bem-sucedido deste golpe. Após o quarto uso bem-sucedido seguido, X cai para 118 e continua com valores aparentemente aleatórios de 0-65535 nos usos bem-sucedidos seguintes. X volta a 65535 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário for o último a agir neste turno.",
		},
		gen2: {
			desc: "O usuário fica protegido dos ataques feitos pelo oponente neste turno. Este golpe tem X/255 de chance de ser bem-sucedido, onde X começa em 255 e é dividido pela metade, arredondado para baixo, a cada uso bem-sucedido deste golpe. X volta a 255 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário tiver um substituto ou for o último a agir neste turno.",
		},
	},
	devastatingdrake: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	diamondstorm: {
		desc: "Tem 50% de chance de aumentar a Defesa do usuário em 2 estágios.",
		shortDesc: "50% de chance de aumentar a Defesa do usuário em 2.",
		gen6: {
			desc: "Tem 50% de chance de aumentar a Defesa do usuário em 1 estágio a cada acerto.",
			shortDesc: "50% de chance de +1 Def no usuário a cada acerto.",
		},
	},
	dig: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Earthquake e Magnitude, mas sofre o dobro de dano deles, e também não é afetado pelo clima. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Cava no turno 1, ataca no turno 2.",
		gen4: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Earthquake e Magnitude, que têm o poder dobrado quando usados contra ele, e também não é afetado pelo clima. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		gen3: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Earthquake e Magnitude, que têm o poder dobrado quando usados contra ele, e também não é afetado pelo clima.",
		},
		gen2: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Earthquake, Fissure e Magnitude, o usuário não é afetado pelo clima, e Earthquake e Magnitude têm o poder dobrado quando usados contra o usuário.",
		},
		gen1: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Bide, Swift e Transform. Se o usuário estiver totalmente paralisado no segundo turno, ele continua evitando ataques até sair de campo ou executar com sucesso o segundo turno deste golpe ou de Fly.",
		},
		prepare: "{POKEMON} se enterrou no chão!",
	},
	direclaw: {
		desc: "Tem 50% de chance de fazer o alvo adormecer, ficar envenenado ou ficar paralisado.",
		shortDesc: "50% de adormecer, envenenar ou paralisar o alvo.",
		champions: {
			desc: "Tem 30% de chance de fazer o alvo adormecer, ficar envenenado ou ficar paralisado.",
			shortDesc: "30% de adormecer, envenenar ou paralisar o alvo.",
		},
	},
	disable: {
		desc: "Por 4 turnos, o último golpe usado pelo alvo fica desativado. Falha se um dos golpes do alvo já estiver desativado, se o alvo ainda não tiver usado um golpe, se o alvo não conhecer mais o golpe ou se o golpe for um Max Move ou G-Max Move.",
		shortDesc: "Por 4 turnos, desativa o último golpe usado pelo alvo.",
		gen7: {
			desc: "Por 4 turnos, o último golpe usado pelo alvo fica desativado. Falha se um dos golpes do alvo já estiver desativado, se o alvo ainda não tiver usado um golpe, se o alvo não conhecer mais o golpe ou se o golpe for um Z-Move. Golpes com Z-Power ainda podem ser escolhidos e executados durante este efeito.",
		},
		gen6: {
			desc: "Por 4 turnos, o último golpe usado pelo alvo fica desativado. Falha se um dos golpes do alvo já estiver desativado, se o alvo ainda não tiver usado um golpe ou se o alvo não conhecer mais o golpe.",
		},
		gen4: {
			desc: "Por 4 a 7 turnos, o último golpe usado pelo alvo fica desativado. Falha se um dos golpes do alvo já estiver desativado, se o alvo ainda não tiver usado um golpe, se o alvo não conhecer mais o golpe ou se o golpe tiver 0 PP.",
			shortDesc: "Por 4-7 turnos, desativa o último golpe do alvo.",
		},
		gen3: {
			desc: "Por 2 a 5 turnos, o último golpe usado pelo alvo fica desativado. Falha se um dos golpes do alvo já estiver desativado, se o alvo ainda não tiver usado um golpe, se o alvo não conhecer mais o golpe ou se o golpe tiver 0 PP.",
			shortDesc: "Por 2-5 turnos, desativa o último golpe do alvo.",
		},
		gen2: {
			desc: "Por 1 a 7 turnos, o último golpe usado pelo alvo fica desativado. Falha se um dos golpes do alvo já estiver desativado, se o alvo ainda não tiver usado um golpe, se o alvo não conhecer mais o golpe ou se o golpe tiver 0 PP.",
			shortDesc: "Por 1-7 turnos, desativa o último golpe do alvo.",
		},
		gen1: {
			desc: "Por 0 a 7 turnos, um dos golpes conhecidos do alvo que tenha pelo menos 1 PP restante fica desativado, escolhido aleatoriamente. Falha se um dos golpes do alvo já estiver desativado ou se nenhum dos golpes do alvo tiver PP restante. Se qualquer Pokémon usar Haze, este efeito termina. Sendo ou não bem-sucedido, este golpe conta como um acerto para fins do uso de Rage pelo oponente.",
			shortDesc: "Por 0-7 turnos, desativa um dos golpes do alvo.",
		},
		start: "  {MOVE} de {POKEMON} foi desativado!",
		end: "  O golpe de {POKEMON} não está mais desativado!",
		cant: "{MOVE} de {POKEMON} está desativado!",
	},
	disarmingvoice: {
		desc: "Este golpe não verifica a precisão.",
		shortDesc: "Este golpe não verifica a precisão. Atinge oponentes.",
	},
	discharge: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar Pokémon adjacentes.",
	},
	dive: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Surf e Whirlpool, mas sofre o dobro de dano deles, e também não é afetado pelo clima. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Mergulha no turno 1, ataca no turno 2.",
		gen4: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Surf e Whirlpool, que têm o poder dobrado quando usados contra ele, e também não é afetado pelo clima. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		gen3: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques, exceto Surf e Whirlpool, que têm o poder dobrado quando usados contra ele, e também não é afetado pelo clima.",
		},
		prepare: "{POKEMON} se escondeu debaixo d'água!",
	},
	dizzypunch: {
		desc: "Tem 20% de chance de confundir o alvo.",
		shortDesc: "20% de chance de confundir o alvo.",
		gen1: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
	},
	doodle: {
		desc: "As habilidades do usuário e do aliado mudam para a habilidade do alvo. A habilidade do usuário ou do aliado não muda se for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode, Zero to Hero, ou se já for igual à do alvo. Falha se as habilidades do usuário e do aliado já forem iguais à do alvo, ou se a habilidade do alvo for As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Flower Gift, Forecast, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Trace, Wonder Guard, Zen Mode ou Zero to Hero.",
		shortDesc: "Usuário e aliado passam a ter a habilidade do alvo.",
	},
	doomdesire: {
		desc: "Causa dano dois turnos depois de este golpe ser usado. Ao final desse turno, o dano é calculado naquele momento e causado ao Pokémon na posição que o alvo ocupava quando o golpe foi usado. Se o usuário não estiver mais em campo nesse momento, o dano é calculado com base no atributo de Ataque Especial natural, nos tipos e no nível do usuário, sem bônus do item segurado ou da habilidade dele. Falha se este golpe ou Future Sight já estiver em efeito na posição do alvo.",
		shortDesc: "Atinge dois turnos depois de ser usado.",
		gen4: {
			desc: "Causa dano sem tipo, que não pode ser acerto crítico, dois turnos depois de este golpe ser usado. O dano é calculado contra o alvo no momento do uso e, ao final do último turno, esse dano é causado ao Pokémon na posição que o alvo original ocupava naquele momento. Falha se este golpe ou Future Sight já estiver em efeito na posição do alvo.",
		},
		start: "  {POKEMON} escolheu Doom Desire como seu destino!",
		activate: "  {TARGET} recebeu o ataque de Doom Desire!",
	},
	doubleedge: {
		desc: "Se o alvo perdeu HP, o usuário sofre dano de recuo igual a 33% do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 33% de dano de recuo.",
		gen4: {
			desc: "Se o alvo perdeu HP, o usuário sofre dano de recuo igual a 1/3 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Tem 1/3 de dano de recuo.",
		},
		gen2: {
			desc: "Se o alvo perdeu HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Se este golpe atingir um substituto, o dano de recuo é sempre 1 HP.",
			shortDesc: "Tem 1/4 de dano de recuo.",
		},
		gen1: {
			desc: "Se o alvo perdeu HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Se este golpe quebrar o substituto do alvo, o usuário não sofre dano de recuo.",
		},
	},
	doublehit: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
		gen4: {
			desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
	},
	doubleironbash: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto. Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "Acerta 2 vezes. 30% de chance de fazer o alvo recuar.",
	},
	doublekick: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
		gen4: {
			desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		},
		gen1: {
			desc: "Acerta duas vezes. O dano é calculado uma vez no primeiro acerto e usado nos dois acertos. Se o primeiro acerto quebrar o substituto do alvo, o golpe termina.",
		},
	},
	doubleshock: {
		desc: "Falha a menos que o usuário seja do tipo Electric. Se este golpe for bem-sucedido e o usuário não estiver Terastalizado, o tipo Electric do usuário deixa de existir (fica sem tipo) enquanto ele permanecer em campo.",
		shortDesc: "Usuário perde o tipo Electric; precisa ser desse tipo.",
		typeChange: "  {POKEMON} gastou toda a sua eletricidade!",
	},
	doubleslap: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começar, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	doubleteam: {
		desc: "Aumenta a evasão do usuário em 1 estágio.",
		shortDesc: "Aumenta a evasão do usuário em 1.",
	},
	dracometeor: {
		desc: "Diminui o Ataque Especial do usuário em 2 estágios.",
		shortDesc: "Diminui o Sp. Atk do usuário em 2.",
	},
	dragonascent: {
		desc: "Diminui a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Diminui a Defesa e a Sp. Def do usuário em 1.",
		megaNoItem: "  O desejo fervoroso de {TRAINER} chegou até {POKEMON}!",
	},
	dragonbreath: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar o alvo.",
	},
	dragoncheer: {
		desc: "Aumenta a chance de acerto crítico do alvo em 1 estágio, ou em 2 estágios se o alvo for do tipo Dragon. Falha se não houver aliado adjacente ao usuário, ou se o alvo já tiver este efeito ou o efeito de Focus Energy. Baton Pass pode ser usado para transferir este efeito a um aliado.",
		shortDesc: "Aliado: crítico +1, ou +2 se for do tipo Dragon.",
	},
	dragonclaw: {
		shortDesc: "Sem efeito adicional.",
	},
	dragondance: {
		desc: "Aumenta o Ataque e a Velocidade do usuário em 1 estágio.",
		shortDesc: "Aumenta o Ataque e a Velocidade do usuário em 1.",
	},
	dragondarts: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto. Em batalhas Duplas, este golpe tenta atingir o Pokémon alvo e o aliado dele uma vez cada. Se atingir um desses Pokémon for impedido por imunidade, proteção, semi-invulnerabilidade, uma habilidade ou precisão, ele tenta atingir o outro Pokémon duas vezes. Se este golpe for redirecionado, ele atinge esse alvo duas vezes.",
		shortDesc: "2 acertos. Duplas: tenta atingir cada oponente 1 vez.",
	},
	dragonenergy: {
		desc: "O poder é igual a (HP atual do usuário × 150 / HP máximo do usuário), arredondado para baixo, mas não menos que 1.",
		shortDesc: "Poder cai com o HP do usuário. Atinge oponente(s).",
	},
	dragonhammer: {
		shortDesc: "Sem efeito adicional.",
	},
	dragonpulse: {
		shortDesc: "Sem efeito adicional.",
	},
	dragonrage: {
		shortDesc: "Causa 40 HP de dano ao alvo.",
	},
	dragonrush: {
		desc: "Tem 20% de chance de fazer o alvo recuar. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "20% de chance de fazer o alvo recuar.",
		gen5: {
			desc: "Tem 20% de chance de fazer o alvo recuar.",
		},
	},
	dragontail: {
		desc: "Se nem o usuário nem o alvo tiverem desmaiado, o alvo é forçado a sair de campo e é substituído por um aliado aleatório não desmaiado. Este efeito falha se o alvo tiver usado Ingrain anteriormente, tiver a habilidade Suction Cups ou se este golpe atingir um substituto.",
		shortDesc: "Força o alvo a trocar por um aliado aleatório.",
	},
	drainingkiss: {
		desc: "O usuário recupera 3/4 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "O usuário recupera 75% do dano causado.",
	},
	drainpunch: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "O usuário recupera 50% do dano causado.",
		gen4: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo.",
		},
	},
	dreameater: {
		desc: "O alvo não é afetado por este golpe a menos que esteja dormindo. O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "Recupera 1/2 do dano causado. Só em alvo dormindo.",
		gen4: {
			desc: "O alvo não é afetado por este golpe a menos que esteja dormindo e não tenha um substituto. O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo.",
		},
		gen3: {
			desc: "O alvo não é afetado por este golpe a menos que esteja dormindo e não tenha um substituto. O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
		},
		gen1: {
			desc: "O alvo não é afetado por este golpe a menos que esteja dormindo. O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Se este golpe quebrar o substituto do alvo, o usuário não recupera HP.",
		},
	},
	drillpeck: {
		shortDesc: "Sem efeito adicional.",
	},
	drillrun: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	drumbeating: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Velocidade do alvo em 1.",
	},
	dualchop: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
	},
	dualwingbeat: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
	},
	dynamaxcannon: {
		shortDesc: "Sem efeito adicional.",
		gen8: {
			shortDesc: "O dano dobra se o alvo estiver Dynamaxado.",
		},
	},
	dynamicpunch: {
		desc: "Tem 100% de chance de confundir o alvo.",
		shortDesc: "100% de chance de confundir o alvo.",
	},
	earthpower: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	earthquake: {
		desc: "O dano dobra se o alvo estiver usando Dig.",
		shortDesc: "Atinge Pokémon adjacentes. Dano dobrado contra Dig.",
		gen4: {
			desc: "O poder dobra se o alvo estiver usando Dig.",
			shortDesc: "Atinge Pokémon adjacentes. Poder dobra contra Dig.",
		},
		gen1: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
		gen2: {
			shortDesc: "O poder dobra contra Dig.",
		},
	},
	echoedvoice: {
		desc: "A cada turno consecutivo em que este golpe é usado por pelo menos um Pokémon, o poder dele é multiplicado pelo número de turnos decorridos, mas não mais que 5.",
		shortDesc: "O poder aumenta quando usado em turnos consecutivos.",
	},
	eerieimpulse: {
		desc: "Diminui o Ataque Especial do alvo em 2 estágios.",
		shortDesc: "Diminui o Sp. Atk do alvo em 2.",
	},
	eeriespell: {
		desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, o alvo perde 3 PP do seu último golpe.",
		shortDesc: "Remove 3 PP do último golpe do alvo.",
	},
	eggbomb: {
		shortDesc: "Sem efeito adicional.",
	},
	electricterrain: {
		desc: "Por 5 turnos, o terreno se torna Electric Terrain. Durante o efeito, o poder de ataques do tipo Electric feitos por Pokémon no chão é multiplicado por 1,3, e Pokémon no chão não podem adormecer; Pokémon que já estão dormindo não acordam. Pokémon no chão não podem ser afetados por Yawn nem adormecer pelo efeito dele. Camouflage transforma o usuário em tipo Electric, Nature Power se torna Thunderbolt e Secret Power tem 30% de chance de causar paralisia. Falha se o terreno atual for Electric Terrain.",
		shortDesc: "5 turnos. No chão: +poder do tipo Electric, sem sono.",
		gen7: {
			desc: "Por 5 turnos, o terreno se torna Electric Terrain. Durante o efeito, o poder de ataques do tipo Electric feitos por Pokémon no chão é multiplicado por 1,5, e Pokémon no chão não podem adormecer; Pokémon que já estão dormindo não acordam. Pokémon no chão não podem ser afetados por Yawn nem adormecer pelo efeito dele. Camouflage transforma o usuário em tipo Electric, Nature Power se torna Thunderbolt e Secret Power tem 30% de chance de causar paralisia. Falha se o terreno atual for Electric Terrain.",
		},
	},
	electrify: {
		desc: "Faz o golpe do alvo se tornar do tipo Electric neste turno. Entre os efeitos que podem mudar o tipo de um golpe, este efeito acontece por último. Falha se o alvo já tiver agido neste turno.",
		shortDesc: "Muda o golpe do alvo para o tipo Electric neste turno.",
		start: "  Os golpes de {POKEMON} foram eletrificados!",
	},
	electroball: {
		desc: "O poder deste golpe depende de (Velocidade atual do usuário / Velocidade atual do alvo), arredondado para baixo. O poder é 150 se o resultado for 4 ou mais, 120 se for 3, 80 se for 2, 60 se for 1 e 40 se for menor que 1. Se a Velocidade atual do alvo for 0, o poder deste golpe é 40.",
		shortDesc: "Mais poder quanto mais rápido o usuário for que o alvo.",
		gen5: {
			desc: "O poder deste golpe depende de (Velocidade atual do usuário / Velocidade atual do alvo), arredondado para baixo. O poder é 150 se o resultado for 4 ou mais, 120 se for 3, 80 se for 2, 60 se for 1 e 40 se for menor que 1. Se a Velocidade atual do alvo for 0, ela é tratada como 1.",
		},
	},
	electrodrift: {
		desc: "O dano é multiplicado por 1,3333 se este golpe for superefetivo contra o alvo.",
		shortDesc: "Causa 1,3333× de dano com acertos superefetivos.",
	},
	electroshot: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. Aumenta o Ataque Especial do usuário em 1 estágio no primeiro turno. Se o usuário estiver segurando Power Herb ou o clima for chuva forte ou chuva, o golpe é concluído em um turno. Se o usuário estiver segurando Utility Umbrella e o clima for chuva forte ou chuva, o golpe ainda precisa de um turno para carregar.",
		shortDesc: "+1 Sp. Atk, ataca no turno 2. Chuva: sem carga.",
		prepare: "{POKEMON} absorveu eletricidade!",
	},
	electroweb: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de reduzir a Velocidade do(s) oponente(s) em 1.",
	},
	embargo: {
		desc: "Por 5 turnos, o item segurado pelo alvo não tem efeito. O efeito de um item de causar mudança de forma não é afetado, mas quaisquer outros efeitos desses itens são anulados. Durante o efeito, o alvo fica impedido de usar Fling e Natural Gift. Itens arremessados no alvo com Fling ainda serão ativados para ele. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sem poder usar itens.",
		shortDesc: "Por 5 turnos, o item do alvo não tem efeito.",
		start: "  {POKEMON} não pode mais usar itens!",
		end: "  {POKEMON} pode usar itens novamente!",
	},
	ember: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o alvo.",
	},
	encore: {
		desc: "Pelos próximos 3 turnos dele, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP ou se o golpe for Assist, Blazing Torque, Combat Torque, Copycat, Dynamax Cannon, Encore, Magical Torque, Me First, Metronome, Mimic, Mirror Move, Nature Power, Noxious Torque, Sketch, Sleep Talk, Struggle, Transform ou Wicked Torque.",
		shortDesc: "O alvo repete o último golpe nos próximos 3 turnos.",
		gen8: {
			desc: "Pelos próximos 3 turnos dele, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP, se o alvo estiver Dynamaxado ou se o golpe for Assist, Copycat, Dynamax Cannon, Encore, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle ou Transform.",
		},
		gen7: {
			desc: "Pelos próximos 3 turnos dele, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP ou se o golpe for Assist, Copycat, Encore, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Transform ou qualquer Z-Move. Golpes com Z-Power ainda podem ser escolhidos e executados durante este efeito.",
		},
		gen6: {
			desc: "Por 3 turnos, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP ou se o golpe for Encore, Mimic, Mirror Move, Sketch, Struggle ou Transform.",
		},
		gen4: {
			desc: "Por 4 a 8 turnos, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP ou se o golpe for Encore, Mimic, Mirror Move, Sketch, Struggle ou Transform.",
			shortDesc: "O alvo repete o último golpe por 4-8 turnos.",
		},
		gen3: {
			desc: "Por 3 a 6 turnos, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP ou se o golpe for Encore, Mimic, Mirror Move, Sketch, Struggle ou Transform.",
			shortDesc: "O alvo repete o último golpe por 3-6 turnos.",
		},
		gen2: {
			desc: "Por 3 a 6 turnos, o alvo é forçado a repetir o último golpe usado. Se o golpe afetado ficar sem PP, o efeito termina. Falha se o alvo já estiver sob este efeito, se ainda não tiver usado um golpe, se o golpe tiver 0 PP ou se o golpe for Encore, Metronome, Mimic, Mirror Move, Sketch, Sleep Talk, Struggle ou Transform.",
		},
		start: "  {POKEMON} precisa fazer um bis!",
		end: "  O bis de {POKEMON} terminou!",
	},
	endeavor: {
		desc: "Causa ao alvo dano igual a (HP atual do alvo - HP atual do usuário). O alvo não é afetado se seu HP atual for menor ou igual ao HP atual do usuário.",
		shortDesc: "Reduz o HP do alvo ao HP do usuário.",
	},
	endure: {
		desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		shortDesc: "O usuário sobrevive aos ataques do turno com 1+ HP.",
		gen8: {
			desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen7: {
			desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen6: {
			desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen5: {
			desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure, Protect, Quick Guard ou Wide Guard. Falha se o usuário for o último a agir neste turno.",
		},
		gen4: {
			desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada uso bem-sucedido deste golpe, até um máximo de 8. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário for o último a agir neste turno.",
		},
		gen3: {
			desc: "O usuário sobreviverá aos ataques feitos por outros Pokémon neste turno com pelo menos 1 HP. Este golpe tem X/65536 de chance de ser bem-sucedido, onde X começa em 65535 e é dividido pela metade, arredondado para baixo, a cada uso bem-sucedido deste golpe. Após o quarto uso bem-sucedido seguido, X cai para 118 e continua com valores aparentemente aleatórios de 0-65535 nos usos bem-sucedidos seguintes. X volta a 65535 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário for o último a agir neste turno.",
		},
		gen2: {
			desc: "O usuário sobreviverá aos ataques feitos pelo oponente neste turno com pelo menos 1 HP. Este golpe tem X/255 de chance de ser bem-sucedido, onde X começa em 255 e é dividido pela metade, arredondado para baixo, a cada uso bem-sucedido deste golpe. X volta a 255 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário tiver um substituto ou for o último a agir neste turno.",
		},
		start: "  {POKEMON} se preparou para aguentar!",
		activate: "  {POKEMON} aguentou o golpe!",
	},
	energyball: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	entrainment: {
		desc: "Faz a habilidade do alvo se tornar igual à do usuário. Falha se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Truant, Zen Mode ou Zero to Hero, ou a mesma habilidade do usuário, ou se a habilidade do usuário for As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Flower Gift, Forecast, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Trace, Wonder Guard, Zen Mode ou Zero to Hero.",
		shortDesc: "A habilidade do alvo passa a ser igual à do usuário.",
		gen8: {
			desc: "Faz a habilidade do alvo se tornar igual à do usuário. Falha se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Truant, Zen Mode ou a mesma habilidade do usuário, ou se a habilidade do usuário for As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace ou Zen Mode.",
		},
		gen7: {
			desc: "Faz a habilidade do alvo se tornar igual à do usuário. Falha se a habilidade do alvo for Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Truant, Zen Mode ou a mesma habilidade do usuário, ou se a habilidade do usuário for Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace ou Zen Mode.",
		},
		gen6: {
			desc: "Faz a habilidade do alvo se tornar igual à do usuário. Falha se a habilidade do alvo for Multitype, Stance Change, Truant ou a mesma habilidade do usuário, ou se a habilidade do usuário for Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace ou Zen Mode.",
		},
		gen5: {
			desc: "Faz a habilidade do alvo se tornar igual à do usuário. Falha se a habilidade do alvo for Multitype, Truant ou a mesma habilidade do usuário, ou se a habilidade do usuário for Flower Gift, Forecast, Illusion, Imposter, Multitype, Trace ou Zen Mode.",
		},
	},
	eruption: {
		desc: "O poder é igual a (HP atual do usuário × 150 / HP máximo do usuário), arredondado para baixo, mas não menos que 1.",
		shortDesc: "Poder cai com o HP do usuário. Atinge oponente(s).",
	},
	esperwing: {
		desc: "Tem 100% de chance de aumentar a Velocidade do usuário em 1 estágio e maior chance de acerto crítico.",
		shortDesc: "100% de +1 Spe no usuário. Alta taxa de crítico.",
	},
	eternabeam: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "O usuário não pode agir no próximo turno.",
	},
	expandingforce: {
		desc: "Se o terreno atual for Psychic Terrain e o usuário estiver no chão, este golpe atinge todos os Pokémon adversários e tem o poder multiplicado por 1,5.",
		shortDesc: "Em Psychic Terrain: poder 1,5× e atinge oponentes.",
	},
	explosion: {
		desc: "O usuário desmaia após usar este golpe, mesmo que ele falhe por não ter alvo. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
		shortDesc: "Atinge Pokémon adjacentes. O usuário desmaia.",
		gen4: {
			desc: "O usuário desmaia após usar este golpe, a menos que este golpe não tenha alvo. A Defesa do alvo é reduzida à metade durante o cálculo de dano. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
			shortDesc: "Def do alvo pela metade no cálculo. O usuário desmaia.",
		},
		gen3: {
			desc: "O usuário desmaia após usar este golpe. A Defesa do alvo é reduzida à metade durante o cálculo de dano. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
		},
		gen2: {
			desc: "O usuário desmaia após usar este golpe. A Defesa do alvo é reduzida à metade durante o cálculo de dano.",
		},
		gen1: {
			desc: "O usuário desmaia após usar este golpe, a menos que este golpe tenha quebrado o substituto do alvo. A Defesa do alvo é reduzida à metade durante o cálculo de dano.",
		},
	},
	extrasensory: {
		desc: "Tem 10% de chance de fazer o alvo recuar.",
		shortDesc: "10% de chance de fazer o alvo recuar.",
		gen3: {
			desc: "Tem 10% de chance de fazer o alvo recuar. O dano dobra se o alvo tiver usado Minimize enquanto estava em campo.",
		},
	},
	extremeevoboost: {
		desc: "Aumenta o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 2 estágios.",
		shortDesc: "Aumenta Atk, Def, SpA, SpD e Spe do usuário em 2.",
	},
	extremespeed: {
		desc: "Sem efeito adicional.",
		shortDesc: "Quase sempre age primeiro.",
		gen4: {
			shortDesc: "Geralmente age primeiro.",
		},
	},
	facade: {
		desc: "O poder dobra se o usuário estiver queimado, paralisado ou envenenado. O efeito da queimadura do usuário que reduz o dano físico à metade é ignorado.",
		shortDesc: "Poder dobra se usuário queimado/envenenado/paralisado.",
		gen5: {
			desc: "O poder dobra se o usuário estiver queimado, paralisado ou envenenado.",
		},
	},
	fairylock: {
		desc: "Impede todos os Pokémon em campo de trocar no próximo turno. Um Pokémon ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. Falha se o efeito já estiver ativo.",
		shortDesc: "Impede todos os Pokémon de trocar no próximo turno.",
		gen7: {
			desc: "Impede todos os Pokémon em campo de trocar no próximo turno. Um Pokémon ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Falha se o efeito já estiver ativo.",
		},
		activate: "  Ninguém conseguirá fugir durante o próximo turno!",
	},
	fairywind: {
		shortDesc: "Sem efeito adicional.",
	},
	fakeout: {
		desc: "Tem 100% de chance de fazer o alvo recuar. Falha a menos que seja o primeiro turno do usuário em campo.",
		shortDesc: "Age primeiro. Só no 1º turno em campo. Faz recuar (100%).",
		champions: {
			desc: "Tem 100% de chance de fazer o alvo recuar. Este golpe não pode ser escolhido a menos que seja o primeiro turno do usuário em campo.",
		},
	},
	faketears: {
		desc: "Diminui a Defesa Especial do alvo em 2 estágios.",
		shortDesc: "Diminui a Sp. Def do alvo em 2.",
	},
	falsesurrender: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	falseswipe: {
		desc: "Deixa o alvo com pelo menos 1 HP.",
		shortDesc: "Sempre deixa o alvo com pelo menos 1 HP.",
	},
	featherdance: {
		desc: "Diminui o Ataque do alvo em 2 estágios.",
		shortDesc: "Diminui o Ataque do alvo em 2.",
	},
	feint: {
		desc: "Se este golpe for bem-sucedido, ele rompe Baneful Bunker, Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do alvo normalmente.",
		shortDesc: "Anula Detect, Protect e Quick/Wide Guard.",
		gen6: {
			desc: "Se este golpe for bem-sucedido, ele rompe Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do alvo normalmente.",
		},
		gen5: {
			desc: "Se este golpe for bem-sucedido, ele rompe Detect ou Protect do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o alvo for um oponente e seu lado estiver protegido por Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do oponente normalmente.",
		},
		gen4: {
			desc: "Falha a menos que o alvo esteja usando Detect ou Protect. Se este golpe for bem-sucedido, ele rompe Detect ou Protect do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente.",
			shortDesc: "Rompe proteção. Falha se o alvo não se proteger.",
		},
		activate: "  {TARGET} caiu na finta!",
	},
	feintattack: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	fellstinger: {
		desc: "Aumenta o Ataque do usuário em 3 estágios se este golpe nocautear o alvo.",
		shortDesc: "Aumenta o Ataque do usuário em 3 se nocautear o alvo.",
		gen6: {
			desc: "Aumenta o Ataque do usuário em 2 estágios se este golpe nocautear o alvo.",
			shortDesc: "Aumenta o Ataque do usuário em 2 se nocautear o alvo.",
		},
	},
	ficklebeam: {
		shortDesc: "30% de chance de o poder deste golpe dobrar.",
		activate: "  {POKEMON} está dando tudo de si neste ataque!",
	},
	fierydance: {
		desc: "Tem 50% de chance de aumentar o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "50% de chance de aumentar o Sp. Atk do usuário em 1.",
	},
	fierywrath: {
		desc: "Tem 20% de chance de fazer o alvo recuar.",
		shortDesc: "20% de chance de fazer o(s) oponente(s) recuar.",
	},
	filletaway: {
		desc: "Aumenta o Ataque, o Ataque Especial e a Velocidade do usuário em 2 estágios em troca de o usuário perder 1/2 do seu HP máximo, arredondado para baixo. Falha se o usuário fosse desmaiar ou se os estágios de Ataque, Ataque Especial e Velocidade não fossem mudar.",
		shortDesc: "+2 Ataque, Sp. Atk e Velocidade por 1/2 do HP máx.",
	},
	finalgambit: {
		desc: "Causa ao alvo dano igual ao HP atual do usuário. Se este golpe for bem-sucedido, o usuário desmaia.",
		shortDesc: "Causa dano igual ao HP do usuário. Usuário desmaia.",
	},
	fireblast: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o alvo.",
		gen1: {
			desc: "Tem 30% de chance de queimar o alvo.",
			shortDesc: "30% de chance de queimar o alvo.",
		},
	},
	firefang: {
		desc: "Tem 10% de chance de queimar o alvo e 10% de chance de fazê-lo recuar.",
		shortDesc: "10% de chance de queimar. 10% de chance de recuar.",
		gen4: {
			desc: "Tem 10% de chance de queimar o alvo e 10% de chance de fazê-lo recuar. Este golpe pode atingir Pokémon com a habilidade Wonder Guard independentemente dos tipos deles.",
		},
	},
	firelash: {
		desc: "Tem 100% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Defesa do alvo em 1.",
	},
	firepledge: {
		desc: "Se um dos aliados do usuário escolheu usar Grass Pledge ou Water Pledge neste turno e ainda não agiu, ele age imediatamente após o usuário, e o golpe do usuário não faz nada. Se combinado com Grass Pledge, o aliado usa Fire Pledge com 150 de poder e um mar de fogo surge no lado do alvo por 4 turnos, causando aos Pokémon que não são do tipo Fire dano igual a 1/8 do HP máximo deles, arredondado para baixo, ao final de cada turno durante o efeito, inclusive no último turno. Se combinado com Water Pledge, o aliado usa Water Pledge com 150 de poder e um arco-íris surge no lado do usuário por 4 turnos, o que dobra as chances de efeitos secundários e se acumula com a habilidade Serene Grace, exceto que efeitos que fazem recuar só podem ter a chance dobrada uma vez. Quando usado como golpe combinado, este golpe recebe STAB independentemente do tipo do usuário. Este golpe não consome Fire Gem segurada pelo usuário.",
		shortDesc: "Use com Grass ou Water Pledge para efeito extra.",
		start: "  Um mar de fogo envolveu {TEAM}!",
		end: "  O mar de fogo ao redor de {TEAM} desapareceu!",
		damage: "  {POKEMON} foi ferido pelo mar de fogo!",
	},
	firepunch: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o alvo.",
	},
	firespin: {
		desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		gen3: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos. Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se usar Baton Pass. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen1: {
			desc: "O usuário passa de dois a cinco turnos usando este golpe. Tem 3/8 de chance de durar dois ou três turnos e 1/8 de chance de durar quatro ou cinco turnos. O dano calculado no primeiro turno é usado em todos os outros turnos. O usuário não pode escolher um golpe e o alvo não pode executar um golpe durante o efeito, mas ambos podem sair de campo. Se o usuário sair de campo, o alvo continua sem poder executar um golpe naquele turno. Se o alvo sair de campo, o usuário usa este golpe de novo automaticamente e, se ele estiver com 0 PP no momento, o PP passa a ser 63. Se o usuário ou o alvo sair de campo, ou se o usuário for impedido de agir, o efeito termina. Este golpe pode impedir o alvo de agir mesmo que ele tenha imunidade de tipo, mas não causará dano.",
			shortDesc: "Impede o alvo de agir por 2-5 turnos.",
		},
		start: "  {POKEMON} ficou preso no vórtice de fogo!",
	},
	firstimpression: {
		desc: "Falha a menos que seja o primeiro turno do usuário em campo.",
		shortDesc: "Quase sempre age primeiro. Só no 1º turno em campo.",
		champions: {
			desc: "Este golpe não pode ser escolhido a menos que seja o primeiro turno do usuário em campo.",
		},
	},
	fishiousrend: {
		desc: "O poder dobra se o usuário agir antes do alvo.",
		shortDesc: "O poder dobra se o usuário agir antes do alvo.",
	},
	fissure: {
		desc: "Causa ao alvo dano igual ao HP máximo do alvo. Ignora modificadores de precisão e evasão. A precisão deste ataque é igual a (nível do usuário - nível do alvo + 30)%, e ele falha se o alvo tiver nível maior. Pokémon com a habilidade Sturdy são imunes.",
		shortDesc: "OHKO no alvo. Falha se o usuário tiver nível menor.",
		gen2: {
			desc: "Causa 65535 de dano ao alvo. A precisão deste ataque, em 256, é igual ao menor valor entre (2 × (nível do usuário - nível do alvo) + 76) e 255, antes de aplicar os modificadores de precisão e evasão. Falha se o alvo tiver nível maior. Pode atingir um alvo que esteja usando Dig.",
		},
		gen1: {
			desc: "Causa 65535 de dano ao alvo. Falha se a Velocidade do alvo for maior que a do usuário.",
			shortDesc: "Causa 65535 de dano. Falha se o alvo for mais rápido.",
		},
	},
	flail: {
		desc: "O poder deste golpe é 20 se X for de 33 a 48, 40 se X for de 17 a 32, 80 se X for de 10 a 16, 100 se X for de 5 a 9, 150 se X for de 2 a 4 e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 48 / HP máximo do usuário), arredondado para baixo.",
		shortDesc: "Mais poder quanto menos HP o usuário tiver.",
		gen4: {
			desc: "O poder deste golpe é 20 se X for de 43 a 48, 40 se X for de 22 a 42, 80 se X for de 13 a 21, 100 se X for de 6 a 12, 150 se X for de 2 a 5 e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 64 / HP máximo do usuário), arredondado para baixo.",
		},
		gen3: {
			desc: "O poder deste golpe é 20 se X for de 33 a 48, 40 se X for de 17 a 32, 80 se X for de 10 a 16, 100 se X for de 5 a 9, 150 se X for de 2 a 4 e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 48 / HP máximo do usuário), arredondado para baixo.",
		},
		gen2: {
			desc: "O poder deste golpe é 20 se X for de 33 a 48, 40 se X for de 17 a 32, 80 se X for de 10 a 16, 100 se X for de 5 a 9, 150 se X for de 2 a 4 e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 48 / HP máximo do usuário), arredondado para baixo. Este golpe não aplica variação de dano e não pode ser um acerto crítico.",
		},
	},
	flameburst: {
		desc: "Se este golpe for bem-sucedido, o aliado do alvo perde 1/16 do seu HP máximo, arredondado para baixo, a menos que tenha a habilidade Magic Guard.",
		shortDesc: "Também causa dano aos Pokémon ao lado do alvo.",
		gen6: {
			desc: "Se este golpe for bem-sucedido, cada aliado adjacente ao alvo perde 1/16 do seu HP máximo, arredondado para baixo, a menos que tenha a habilidade Magic Guard.",
		},
		damage: "  A chama explosiva atingiu {POKEMON}!",
	},
	flamecharge: {
		desc: "Tem 100% de chance de aumentar a Velocidade do usuário em 1 estágio.",
		shortDesc: "100% de chance de +1 na Velocidade do usuário.",
	},
	flamethrower: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o alvo.",
	},
	flamewheel: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o alvo. Descongela o usuário.",
	},
	flareblitz: {
		desc: "Tem 10% de chance de queimar o alvo. Se o alvo perder HP, o usuário sofre dano de recuo igual a 33% do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "33% de recuo. 10% de queimar. Descongela o usuário.",
		gen4: {
			desc: "Tem 10% de chance de queimar o alvo. Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/3 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "1/3 de recuo. 10% de queimar. Descongela o usuário.",
		},
	},
	flash: {
		desc: "Diminui a precisão do alvo em 1 estágio.",
		shortDesc: "Diminui a precisão do alvo em 1.",
	},
	flashcannon: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	flatter: {
		desc: "Aumenta o Ataque Especial do alvo em 1 estágio e o deixa confuso.",
		shortDesc: "Aumenta o Sp. Atk do alvo em 1 e o deixa confuso.",
	},
	fleurcannon: {
		desc: "Diminui o Ataque Especial do usuário em 2 estágios.",
		shortDesc: "Diminui o Sp. Atk do usuário em 2.",
	},
	fling: {
		desc: "O poder deste golpe depende do item segurado pelo usuário. O item segurado é perdido e é ativado para o alvo, se aplicável. Se não houver alvo ou se o alvo evitar este golpe se protegendo, o item segurado pelo usuário é perdido mesmo assim. O usuário pode recuperar um item arremessado com Recycle ou com a habilidade Harvest. Falha se o usuário não tiver item segurado, se o item segurado não puder ser arremessado, se o usuário estiver sob o efeito de Embargo ou Magic Room, ou se o usuário tiver a habilidade Klutz.",
		shortDesc: "Arremessa o item do usuário no alvo. Poder varia.",
		gen4: {
			desc: "O poder deste golpe depende do item segurado pelo usuário. O item segurado é perdido e é ativado para o alvo, se aplicável. Se o alvo evitar este golpe se protegendo, o item segurado pelo usuário é perdido mesmo assim. O usuário pode recuperar um item arremessado com Recycle. Falha se o usuário não tiver item segurado, se o item segurado não puder ser arremessado ou se o usuário estiver sob o efeito de Embargo.",
		},
		removeItem: "  {POKEMON} arremessou {ITEM}!",
	},
	flipturn: {
		desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe não desmaiados, ou se o alvo tiver saído de campo usando Eject Button ou pelo efeito das habilidades Emergency Exit ou Wimp Out.",
		shortDesc: "Usuário sai de campo após causar dano ao alvo.",
	},
	floatyfall: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	floralhealing: {
		desc: "O alvo recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade. Se o terreno for Grassy Terrain, o alvo recupera, em vez disso, 2/3 do seu HP máximo, arredondado para baixo na metade exata.",
		shortDesc: "Cura o alvo em 50% do HP máximo dele.",
	},
	flowershield: {
		desc: "Aumenta a Defesa de todos os Pokémon do tipo Grass em campo em 1 estágio. Falha se não houver Pokémon do tipo Grass em campo.",
		shortDesc: "+1 Defesa a todos os Pokémon do tipo Grass em campo.",
	},
	flowertrick: {
		desc: "Este golpe sempre resulta em acerto crítico, a menos que o alvo esteja sob o efeito de Lucky Chant ou tenha as habilidades Battle Armor ou Shell Armor. Este golpe não verifica a precisão.",
		shortDesc: "Sempre resulta em acerto crítico; não verifica precisão.",
	},
	fly: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques exceto Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Voa no 1º turno e ataca no turno seguinte.",
		gen5: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques exceto Gust, Hurricane, Sky Uppercut, Smack Down, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		gen4: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques exceto Gust, Sky Uppercut, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		gen3: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques exceto Gust, Sky Uppercut, Thunder e Twister, e Gust e Twister têm o poder dobrado quando usados contra ele.",
		},
		gen2: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques exceto Gust, Thunder, Twister e Whirlwind, e Gust e Twister têm o poder dobrado quando usados contra ele.",
		},
		gen1: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques exceto Bide, Swift e Transform. Se o usuário ficar totalmente paralisado no segundo turno, continua evitando ataques até sair de campo ou executar com sucesso o segundo turno deste golpe ou de Dig.",
		},
		prepare: "{POKEMON} voou bem alto!",
	},
	flyingpress: {
		desc: "Este golpe combina o tipo Flying em sua efetividade de tipo contra o alvo. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "Combina o tipo Flying na efetividade de tipo.",
	},
	focusblast: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	focusenergy: {
		desc: "Aumenta a chance de acerto crítico do usuário em 2 estágios. Falha se o usuário já tiver o efeito. Baton Pass pode ser usado para transferir este efeito a um aliado.",
		shortDesc: "Aumenta a taxa de acerto crítico do usuário em 2.",
		gen2: {
			desc: "Aumenta a chance de acerto crítico do usuário em 1 estágio. Falha se o usuário já tiver o efeito. Baton Pass pode ser usado para transferir este efeito a um aliado.",
			shortDesc: "Aumenta a taxa de acerto crítico do usuário em 1.",
		},
		gen1: {
			desc: "Enquanto o usuário permanecer em campo, sua chance de acerto crítico é dividida por quatro. Falha se o usuário já tiver o efeito. Se qualquer Pokémon usar Haze, este efeito termina.",
			shortDesc: "Divide por 4 a chance de acerto crítico do usuário.",
		},
		start: "  {POKEMON} está ficando animado!",
		startFromItem: "  {POKEMON} usou {ITEM} para ficar animado!",
		startFromZEffect: "  {POKEMON} aumentou sua taxa de acerto crítico usando seu Z-Power!",
	},
	focuspunch: {
		desc: "O usuário perde a concentração e não faz nada se for atingido por um ataque que causa dano neste turno antes de poder executar o golpe.",
		shortDesc: "Falha se o usuário sofrer dano antes de atacar.",
		gen4: {
			desc: "O usuário perde a concentração e não faz nada se for atingido por um ataque que causa dano neste turno antes de poder executar o golpe, mas ainda perde PP.",
		},
		start: "  {POKEMON} está aumentando a concentração!",
		cant: "{POKEMON} perdeu a concentração e não conseguiu agir!",
	},
	followme: {
		desc: "Até o fim do turno, todos os ataques de alvo único do lado adversário são redirecionados para o usuário. Esses ataques são redirecionados para o usuário antes que possam ser refletidos por Magic Coat ou pela habilidade Magic Bounce, ou atraídos pelas habilidades Lightning Rod ou Storm Drain. Falha se não for uma Batalha Dupla ou Battle Royal. Este efeito é ignorado enquanto o usuário estiver sob o efeito de Sky Drop.",
		shortDesc: "Golpes dos oponentes miram o usuário neste turno.",
		gen6: {
			desc: "Até o fim do turno, todos os ataques de alvo único do lado adversário são redirecionados para o usuário se ele estiver no alcance. Esses ataques são redirecionados para o usuário antes que possam ser refletidos por Magic Coat ou pela habilidade Magic Bounce, ou atraídos pelas habilidades Lightning Rod ou Storm Drain. Falha se não for uma Batalha Dupla ou Tripla. Este efeito é ignorado enquanto o usuário estiver sob o efeito de Sky Drop.",
		},
		gen4: {
			desc: "Até o fim do turno, todos os ataques de alvo único do lado adversário são redirecionados para o usuário. Esses ataques são redirecionados para o usuário antes que possam ser refletidos por Magic Coat, ou atraídos pelas habilidades Lightning Rod ou Storm Drain. Este efeito continua ativo mesmo se o usuário sair de campo. Falha se não for uma Batalha Dupla.",
		},
		gen3: {
			desc: "Até o fim do turno, todos os ataques de alvo único do lado adversário são redirecionados para o usuário. Esses ataques são redirecionados para o usuário antes que possam ser refletidos por Magic Coat, ou atraídos pela habilidade Lightning Rod. Este efeito continua ativo mesmo se o usuário sair de campo. Falha se não for uma Batalha Dupla.",
		},
		start: "  {POKEMON} virou o centro das atenções!",
		startFromZEffect: "  {POKEMON} virou o centro das atenções!",
	},
	forcepalm: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar o alvo.",
	},
	foresight: {
		desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele se for maior que 0, e ataques dos tipos Normal e Fighting podem atingir o alvo se ele for do tipo Ghost. Falha se o alvo já estiver afetado, ou afetado por Miracle Eye ou Odor Sleuth.",
		shortDesc: "Ignora evasão; tipos Fighting/Normal afetam tipo Ghost.",
		gen4: {
			desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele se for maior que 0, e ataques dos tipos Normal e Fighting podem atingir o alvo se ele for do tipo Ghost.",
		},
		gen3: {
			desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele, e ataques dos tipos Normal e Fighting podem atingir o alvo se ele for do tipo Ghost.",
		},
		gen2: {
			desc: "Enquanto o alvo permanecer em campo, se seu estágio de evasão for maior que o estágio de precisão do atacante, ambos são ignorados nas verificações de precisão, e ataques dos tipos Normal e Fighting podem atingir o alvo se ele for do tipo Ghost. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Falha se o alvo já estiver afetado.",
		},
		start: "  {POKEMON} foi identificado!",
	},
	forestscurse: {
		desc: "Adiciona o tipo Grass ao alvo, fazendo com que ele passe a ter dois ou três tipos. Falha se o alvo já for do tipo Grass. Se Trick-or-Treat adicionar um tipo ao alvo, ele substitui o tipo adicionado por este golpe e vice-versa.",
		shortDesc: "Adiciona o tipo Grass aos tipos do alvo.",
	},
	foulplay: {
		desc: "O dano é calculado usando o atributo Ataque do alvo, incluindo mudanças de estágio. A habilidade, o item e a queimadura do usuário são considerados normalmente.",
		shortDesc: "Usa o Ataque do alvo no cálculo de dano.",
	},
	freezedry: {
		desc: "Tem 10% de chance de congelar o alvo. A efetividade deste golpe contra o tipo Water é alterada para superefetiva, independentemente do tipo deste golpe.",
		shortDesc: "10% de chance de congelar. Superefetivo em tipo Water.",
		champions: {
			desc: "A efetividade deste golpe contra o tipo Water é alterada para superefetiva, independentemente do tipo deste golpe.",
			shortDesc: "Superefetivo contra o tipo Water.",
		},
	},
	freezeshock: {
		desc: "Tem 30% de chance de paralisar o alvo. Este ataque carrega no primeiro turno e é executado no segundo. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Carrega no turno 1. Ataca no turno 2. 30% paralisa.",
		prepare: "  {POKEMON} foi envolto por uma luz congelante!",
	},
	freezingglare: {
		desc: "Tem 10% de chance de congelar o alvo.",
		shortDesc: "10% de chance de congelar o alvo.",
	},
	freezyfrost: {
		desc: "Zera os estágios de atributos de todos os Pokémon em campo.",
		shortDesc: "Elimina todas as mudanças de atributos.",
	},
	frenzyplant: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "Usuário não pode agir no próximo turno.",
	},
	frostbreath: {
		desc: "Este golpe sempre resulta em acerto crítico, a menos que o alvo esteja sob o efeito de Lucky Chant ou tenha as habilidades Battle Armor ou Shell Armor.",
		shortDesc: "Sempre resulta em acerto crítico.",
	},
	frustration: {
		desc: "O poder é igual ao maior valor entre ((255 - felicidade do usuário) × 2/5), arredondado para baixo, e 1.",
		shortDesc: "Poder máximo de 102 com felicidade mínima.",
	},
	furyattack: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acerta 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes. Se o alvo tiver Focus Sash e estava com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	furycutter: {
		desc: "O poder dobra a cada acerto bem-sucedido, até um máximo de 160 de poder. O poder é reiniciado se este golpe errar ou se outro golpe for usado.",
		shortDesc: "O poder dobra a cada acerto, até 160.",
	},
	furyswipes: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acerta 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes. Se o alvo tiver Focus Sash e estava com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	fusionbolt: {
		desc: "O poder dobra se o último golpe usado por qualquer Pokémon neste turno foi Fusion Flare.",
		shortDesc: "O poder dobra se usado após Fusion Flare no turno.",
	},
	fusionflare: {
		desc: "O poder dobra se o último golpe usado por qualquer Pokémon neste turno foi Fusion Bolt.",
		shortDesc: "O poder dobra se usado após Fusion Bolt no turno.",
	},
	futuresight: {
		desc: "Causa dano dois turnos depois de este golpe ser usado. Ao fim daquele turno, o dano é calculado naquele momento e aplicado ao Pokémon que estiver na posição ocupada pelo alvo quando o golpe foi usado. Se o usuário não estiver mais ativo nesse momento, o dano é calculado com base no atributo Ataque Especial natural, nos tipos e no nível do usuário, sem bônus do item segurado ou da habilidade. Falha se este golpe ou Doom Desire já estiver em efeito na posição do alvo.",
		shortDesc: "Atinge dois turnos depois de ser usado.",
		gen4: {
			desc: "Causa dano sem tipo, que não pode ser acerto crítico, dois turnos depois de este golpe ser usado. O dano é calculado contra o alvo no momento do uso e, ao fim do último turno, esse dano é aplicado ao Pokémon que estiver na posição ocupada pelo alvo original naquele momento. Falha se este golpe ou Doom Desire já estiver em efeito na posição do alvo.",
		},
		gen2: {
			desc: "Causa dano sem tipo, que não pode ser acerto crítico, dois turnos depois de este golpe ser usado. O dano é calculado contra o alvo no momento do uso e, ao fim do último turno, esse dano é aplicado ao Pokémon que estiver na posição ocupada pelo alvo original naquele momento. Falha se este golpe já estiver em efeito na posição do alvo.",
		},
		start: "  {POKEMON} previu um ataque!",
		activate: "  {TARGET} recebeu o ataque de Future Sight!",
	},
	gastroacid: {
		desc: "Torna a habilidade do alvo ineficaz enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode ou Zero to Hero, este golpe falha, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		shortDesc: "Anula a habilidade do alvo.",
		gen8: {
			desc: "Torna a habilidade do alvo ineficaz enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode, este golpe falha, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		},
		gen7: {
			desc: "Torna a habilidade do alvo ineficaz enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change ou Zen Mode, este golpe falha, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		},
		gen6: {
			desc: "Torna a habilidade do alvo ineficaz enquanto ele permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sob este efeito. Se a habilidade do alvo for Multitype ou Stance Change, este golpe falha, e receber o efeito por Baton Pass encerra o efeito imediatamente.",
		},
		start: "  A habilidade de {POKEMON} foi suprimida!",
	},
	geargrind: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, o alvo sofrerá dano no segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
	},
	gearup: {
		desc: "Aumenta o Ataque e o Ataque Especial dos Pokémon do lado do usuário com as habilidades Plus ou Minus em 1 estágio.",
		shortDesc: "+1 Atk e Sp. Atk em aliados com Plus/Minus.",
	},
	genesissupernova: {
		desc: "Se este golpe for bem-sucedido, o terreno se torna Psychic Terrain.",
		shortDesc: "Invoca Psychic Terrain.",
	},
	geomancy: {
		desc: "Aumenta o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 2 estágios. Este ataque carrega no primeiro turno e é executado no segundo. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Carrega e, no turno 2, aumenta SpA, SpD e Spe em 2.",
		prepare: "{POKEMON} está absorvendo poder!",
	},
	gigadrain: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "Usuário recupera 50% do dano causado.",
		gen4: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo.",
		},
		gen3: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo.",
		},
	},
	gigaimpact: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "Usuário não pode agir no próximo turno.",
	},
	gigatonhammer: {
		shortDesc: "Não pode ser escolhido no turno seguinte ao uso.",
	},
	gigavolthavoc: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	glaciallance: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge oponentes adjacentes.",
	},
	glaciate: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de -1 na Velocidade do(s) oponente(s).",
	},
	glaiverush: {
		desc: "Se este golpe for bem-sucedido, golpes direcionados ao usuário causam dano dobrado e não verificam a precisão até o próximo turno do usuário.",
		shortDesc: "Usuário sofre 2× dano sem erro até o próximo turno.",
	},
	glare: {
		desc: "Paralisa o alvo.",
		shortDesc: "Paralisa o alvo.",
		gen3: {
			desc: "Paralisa o alvo. Este golpe não ignora imunidade de tipo.",
		},
		gen1: {
			desc: "Paralisa o alvo.",
		},
	},
	glitzyglow: {
		desc: "Este golpe invoca Light Screen por 5 turnos ao ser usado.",
		shortDesc: "Invoca Light Screen.",
	},
	gmaxbefuddle: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário adormece, fica envenenado ou fica paralisado, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: slp, psn ou par.",
	},
	gmaxcannonade: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, por 4 turnos, cada Pokémon que não seja do tipo Water no lado adversário sofre dano igual a 1/6 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito, inclusive no último turno.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1/6 HP, 4 turnos.",
		start: "  {PARTY} foi pego pelo vórtice de água!",
		damage: "  {POKEMON} foi ferido pelo vórtice de G-Max Cannonade!",
	},
	gmaxcentiferno: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica impedido de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw), mesmo que tenha um substituto. Causa dano igual a 1/8 do HP máximo deles (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. Eles ainda podem sair de campo se estiverem segurando Shed Shell ou usarem Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina para um alvo se ele sair de campo, ou se usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Poder vem do golpe base. Oponentes: presos 4-5 turnos.",
	},
	gmaxchistrike: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado do usuário tem a taxa de acerto crítico aumentada em 1 estágio, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Aliados: crítico +1.",
	},
	gmaxcuddle: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica apaixonado, mesmo que tenha um substituto. Este efeito não ocorre para um alvo se ele e o usuário forem do mesmo gênero, se algum deles não tiver gênero ou se o alvo já estiver apaixonado.",
		shortDesc: "Poder vem do golpe base. Oponentes: apaixonados.",
	},
	gmaxdepletion: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário perde 2 PP do último golpe usado, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: último golpe -2 PP.",
		activate: "  O PP de {TARGET} foi reduzido!",
	},
	gmaxdrumsolo: {
		desc: "O poder é 160 independentemente do poder de Max Move do golpe base. Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Sempre 160 de poder. Ignora habilidades.",
	},
	gmaxfinale: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado do usuário recupera 1/6 do seu HP máximo atual, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Aliados: +1/6 do HP máx.",
	},
	gmaxfireball: {
		desc: "O poder é 160 independentemente do poder de Max Move do golpe base. Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Sempre 160 de poder. Ignora habilidades.",
	},
	gmaxfoamburst: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Velocidade de cada Pokémon do lado adversário diminui em 2 estágios, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: -2 Velocidade.",
	},
	gmaxgoldrush: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica confuso, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: confusos.",
	},
	gmaxgravitas: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Gravity começa.",
		shortDesc: "Poder vem do golpe base. Inicia Gravity.",
	},
	gmaxhydrosnipe: {
		desc: "O poder é 160 independentemente do poder de Max Move do golpe base. Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Sempre 160 de poder. Ignora habilidades.",
	},
	gmaxmalodor: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica envenenado, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: envenenados.",
	},
	gmaxmeltdown: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Torment começa para cada Pokémon do lado adversário, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: sob Torment.",
	},
	gmaxoneblow: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Este golpe ignora todos os efeitos de proteção, incluindo Max Guard.",
		shortDesc: "Poder vem do golpe base. Ignora Max Guard.",
	},
	gmaxrapidflow: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Este golpe ignora todos os efeitos de proteção, incluindo Max Guard.",
		shortDesc: "Poder vem do golpe base. Ignora Max Guard.",
	},
	gmaxreplenish: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, há 50% de chance de cada Pokémon do lado do usuário ter sua Berry restaurada, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. 50%: restaura Berries.",
	},
	gmaxresonance: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Aurora Veil começa no lado do usuário.",
		shortDesc: "Poder vem do golpe base. Aliados: Aurora Veil.",
	},
	gmaxsandblast: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica impedido de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw), mesmo que tenha um substituto. Causa dano igual a 1/8 do HP máximo deles (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. Eles ainda podem sair de campo se estiverem segurando Shed Shell ou usarem Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina para um alvo se ele sair de campo, ou se usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Poder vem do golpe base. Oponentes: presos 4-5 turnos.",
	},
	gmaxsmite: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica confuso, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: confusos.",
	},
	gmaxsnooze: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, há 50% de chance de o efeito de Yawn começar no alvo, mesmo que ele tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Alvo: 50% de Yawn.",
	},
	gmaxsteelsurge: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, ele cria uma armadilha no lado adversário do campo, que causa dano a cada Pokémon adversário que entrar em campo. Os oponentes perdem 1/32, 1/16, 1/8, 1/4 ou 1/2 do seu HP máximo, arredondado para baixo, de acordo com sua fraqueza ao tipo Steel: 0,25×, 0,5×, neutro, 2× ou 4×, respectivamente. Pode ser removida do lado adversário se qualquer Pokémon adversário usar Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Poder vem do golpe base. Armadilha do tipo Steel.",
		start: "  Pedaços pontiagudos de aço começaram a flutuar ao redor de {PARTY}!",
		end: "  Os pedaços de aço ao redor de {PARTY} desapareceram!",
		damage: "  O aço afiado cravou em {POKEMON}!",
	},
	gmaxstonesurge: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, ele cria uma armadilha no lado adversário do campo, que causa dano a cada Pokémon adversário que entrar em campo. Os oponentes perdem 1/32, 1/16, 1/8, 1/4 ou 1/2 do seu HP máximo, arredondado para baixo, de acordo com sua fraqueza ao tipo Rock: 0,25×, 0,5×, neutro, 2× ou 4×, respectivamente. Pode ser removida do lado adversário se qualquer Pokémon adversário usar Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Poder vem do golpe base. Oponentes: Stealth Rock.",
	},
	gmaxstunshock: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica envenenado ou paralisado, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: psn ou par.",
	},
	gmaxsweetness: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado do usuário tem sua condição de status curada, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Aliados: status curado.",
	},
	gmaxtartness: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a evasão de cada Pokémon do lado adversário diminui em 1 estágio, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1 evasão.",
	},
	gmaxterror: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica impedido de sair de campo, mesmo que tenha um substituto. Eles ainda podem sair de campo se estiverem segurando Shed Shell ou usarem Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Poder vem do golpe base. Oponentes: presos.",
	},
	gmaxvinelash: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, por 4 turnos, cada Pokémon que não seja do tipo Grass no lado adversário sofre dano igual a 1/6 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito, inclusive no último turno.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1/6 HP, 4 turnos.",
		start: "  {PARTY} ficou preso por cipós!",
		damage: "  {POKEMON} foi ferido pelo açoite feroz de G-Max Vine Lash!",
	},
	gmaxvolcalith: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, por 4 turnos, cada Pokémon que não seja do tipo Rock no lado adversário sofre dano igual a 1/6 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito, inclusive no último turno.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1/6 HP, 4 turnos.",
		start: "  {PARTY} ficou cercado por rochas!",
		damage: "  {POKEMON} foi ferido pelas rochas lançadas por G-Max Volcalith!",
	},
	gmaxvoltcrash: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, cada Pokémon do lado adversário fica paralisado, mesmo que tenha um substituto.",
		shortDesc: "Poder vem do golpe base. Oponentes: paralisados.",
	},
	gmaxwildfire: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, por 4 turnos, cada Pokémon que não seja do tipo Fire no lado adversário sofre dano igual a 1/6 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito, inclusive no último turno.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1/6 HP, 4 turnos.",
		start: "  {PARTY} ficou cercado por fogo!",
		damage: "  {POKEMON} está queimando nas chamas de G-Max Wildfire!",
	},
	gmaxwindrage: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, os efeitos de Electric Terrain, Grassy Terrain, Misty Terrain e Psychic Terrain terminam, os efeitos de Reflect, Light Screen, Aurora Veil, Safeguard, Mist, G-Max Steelsurge, Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do alvo, e os efeitos de G-Max Steelsurge, Spikes, Toxic Spikes, Stealth Rock e Sticky Web terminam no lado do usuário.",
		shortDesc: "Poder vem do golpe base. Encerra terreno e armadilhas.",
	},
	grassknot: {
		desc: "O poder deste golpe é 20 se o alvo pesar menos de 10 kg, 40 se pesar menos de 25 kg, 60 se pesar menos de 50 kg, 80 se pesar menos de 100 kg, 100 se pesar menos de 200 kg e 120 se pesar 200 kg ou mais.",
		shortDesc: "Mais poder quanto mais pesado for o alvo.",
	},
	grasspledge: {
		desc: "Se um dos aliados do usuário escolheu usar Fire Pledge ou Water Pledge neste turno e ainda não agiu, ele age imediatamente após o usuário, e o golpe do usuário não faz nada. Se combinado com Fire Pledge, o aliado usa Fire Pledge com 150 de poder e um mar de fogo surge no lado do alvo por 4 turnos, causando aos Pokémon que não são do tipo Fire dano igual a 1/8 do HP máximo deles, arredondado para baixo, ao final de cada turno durante o efeito, inclusive no último turno. Se combinado com Water Pledge, o aliado usa Grass Pledge com 150 de poder e um pântano surge no lado do alvo por 4 turnos, o que divide por quatro a Velocidade de cada Pokémon daquele lado. Quando usado como golpe combinado, este golpe recebe STAB independentemente do tipo do usuário. Este golpe não consome Grass Gem segurada pelo usuário.",
		shortDesc: "Use com Fire ou Water Pledge para efeito extra.",
		start: "  Um pântano envolveu {TEAM}!",
		end: "  O pântano ao redor de {TEAM} desapareceu!",
	},
	grasswhistle: {
		shortDesc: "Faz o alvo adormecer.",
	},
	grassyglide: {
		desc: "Se o terreno atual for Grassy Terrain e o usuário estiver no chão, a prioridade deste golpe aumenta em 1.",
		shortDesc: "Usuário em Grassy Terrain: +1 de prioridade.",
	},
	grassyterrain: {
		desc: "Por 5 turnos, o terreno se torna Grassy Terrain. Durante o efeito, o poder dos ataques do tipo Grass usados por Pokémon no chão é multiplicado por 1,3, o poder de Bulldoze, Earthquake e Magnitude usados contra Pokémon no chão é multiplicado por 0,5, e os Pokémon no chão recuperam 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno, inclusive no último turno. Camouflage transforma o usuário em tipo Grass, Nature Power se torna Energy Ball e Secret Power tem 30% de chance de causar sono. Falha se o terreno atual for Grassy Terrain.",
		shortDesc: "5 turnos. No chão: +poder do tipo Grass, +1/16 HP máx.",
		gen7: {
			desc: "Por 5 turnos, o terreno se torna Grassy Terrain. Durante o efeito, o poder dos ataques do tipo Grass usados por Pokémon no chão é multiplicado por 1,5, o poder de Bulldoze, Earthquake e Magnitude usados contra Pokémon no chão é multiplicado por 0,5, e os Pokémon no chão recuperam 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno, inclusive no último turno. Camouflage transforma o usuário em tipo Grass, Nature Power se torna Energy Ball e Secret Power tem 30% de chance de causar sono. Falha se o terreno atual for Grassy Terrain.",
		},
	},
	gravapple: {
		desc: "Tem 100% de chance de diminuir a Defesa do alvo em 1 estágio. O poder é multiplicado por 1,5 durante o efeito de Gravity.",
		shortDesc: "Alvo: 100% de -1 Def. Com Gravity: 1,5× poder.",
	},
	gravity: {
		desc: "Por 5 turnos, a evasão de todos os Pokémon em campo é multiplicada por 0,6. No momento do uso, Bounce, Fly, Magnet Rise, Sky Drop e Telekinesis terminam imediatamente para todos os Pokémon em campo. Durante o efeito, todos os Pokémon em campo ficam impedidos de usar Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash e Telekinesis. Ataques do tipo Ground, Spikes, Toxic Spikes, Sticky Web e a habilidade Arena Trap podem afetar Pokémon do tipo Flying ou Pokémon com a habilidade Levitate. Falha se este golpe já estiver em efeito.",
		shortDesc: "5 turnos: sem imunidade ao tipo Ground; 1,67× precisão.",
		gen7: {
			desc: "Por 5 turnos, a evasão de todos os Pokémon em campo é multiplicada por 0,6. No momento do uso, Bounce, Fly, Magnet Rise, Sky Drop e Telekinesis terminam imediatamente para todos os Pokémon em campo. Durante o efeito, todos os Pokémon em campo ficam impedidos de usar Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash e Telekinesis. Ataques do tipo Ground, Spikes, Toxic Spikes, Sticky Web e a habilidade Arena Trap podem afetar Pokémon do tipo Flying ou Pokémon com a habilidade Levitate. Falha se este golpe já estiver em efeito. Z-Moves relevantes ainda podem ser escolhidos, mas serão impedidos na execução durante este efeito.",
		},
		gen6: {
			desc: "Por 5 turnos, a evasão de todos os Pokémon em campo é multiplicada por 0,6. No momento do uso, Bounce, Fly, Magnet Rise, Sky Drop e Telekinesis terminam imediatamente para todos os Pokémon em campo. Durante o efeito, todos os Pokémon em campo ficam impedidos de usar Bounce, Fly, Flying Press, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash e Telekinesis. Ataques do tipo Ground, Spikes, Toxic Spikes, Sticky Web e a habilidade Arena Trap podem afetar Pokémon do tipo Flying ou Pokémon com a habilidade Levitate. Falha se este golpe já estiver em efeito.",
		},
		gen5: {
			desc: "Por 5 turnos, a evasão de todos os Pokémon em campo é multiplicada por 0,6. No momento do uso, Bounce, Fly, Magnet Rise, Sky Drop e Telekinesis terminam imediatamente para todos os Pokémon em campo. Durante o efeito, todos os Pokémon em campo ficam impedidos de usar Bounce, Fly, High Jump Kick, Jump Kick, Magnet Rise, Sky Drop, Splash e Telekinesis. Ataques do tipo Ground, Spikes, Toxic Spikes e a habilidade Arena Trap podem afetar Pokémon do tipo Flying ou Pokémon com a habilidade Levitate. Falha se este golpe já estiver em efeito.",
		},
		gen4: {
			desc: "Por 5 turnos, a evasão de todos os Pokémon em campo é multiplicada por 0,6. No momento do uso, Bounce, Fly e Magnet Rise terminam imediatamente para todos os Pokémon em campo. Durante o efeito, todos os Pokémon em campo ficam impedidos de usar Bounce, Fly, High Jump Kick, Jump Kick, Magnet Rise e Splash. Ataques do tipo Ground, Spikes, Toxic Spikes e a habilidade Arena Trap podem afetar Pokémon do tipo Flying ou Pokémon com a habilidade Levitate. Falha se este golpe já estiver em efeito.",
		},
	},
	growl: {
		desc: "Diminui o Ataque do alvo em 1 estágio.",
		shortDesc: "Diminui o Ataque do(s) oponente(s) em 1.",
		gen2: {
			shortDesc: "Diminui o Ataque do alvo em 1.",
		},
	},
	growth: {
		desc: "Aumenta o Ataque e o Ataque Especial do usuário em 1 estágio. Se o clima for sol ou sol extremo, este golpe aumenta o Ataque e o Ataque Especial do usuário em 2 estágios. Se o usuário estiver segurando Utility Umbrella, este golpe só aumenta o Ataque e o Ataque Especial do usuário em 1 estágio, mesmo que o clima seja sol ou sol extremo.",
		shortDesc: "Aumenta Ataque e Sp. Atk do usuário em 1; 2 no sol.",
		gen7: {
			desc: "Aumenta o Ataque e o Ataque Especial do usuário em 1 estágio. Se o clima for sol ou sol extremo, este golpe aumenta o Ataque e o Ataque Especial do usuário em 2 estágios.",
		},
		gen5: {
			desc: "Aumenta o Ataque e o Ataque Especial do usuário em 1 estágio. Se o clima for sol, este golpe aumenta o Ataque e o Ataque Especial do usuário em 2 estágios.",
		},
		gen4: {
			desc: "Aumenta o Ataque Especial do usuário em 1 estágio.",
			shortDesc: "Aumenta o Sp. Atk do usuário em 1.",
		},
		gen1: {
			desc: "Aumenta o Especial do usuário em 1 estágio.",
			shortDesc: "Aumenta o Especial do usuário em 1.",
		},
	},
	grudge: {
		desc: "Até o próximo turno do usuário, se o ataque de um Pokémon adversário nocautear o usuário, esse golpe perde todo o PP restante.",
		shortDesc: "Se o usuário desmaiar, o golpe usado perde todo o PP.",
		activate: "  {MOVE} de {POKEMON} perdeu todo o PP por causa do rancor!",
		start: "{POKEMON} quer que seu alvo guarde rancor!",
	},
	guardianofalola: {
		desc: "Causa ao alvo dano igual a 3/4 do HP atual dele, arredondado para baixo, mas não menos que 1 HP.",
		shortDesc: "Causa dano igual a 3/4 do HP atual do alvo.",
	},
	guardsplit: {
		desc: "O usuário e o alvo têm seus atributos de Defesa e Defesa Especial definidos como a média dos atributos de Defesa e Defesa Especial do usuário e do alvo, respectivamente, arredondada para baixo. As mudanças de estágio de atributos não são afetadas.",
		shortDesc: "Tira a média de Defesa e Sp. Def com o alvo.",
		activate: "  {POKEMON} compartilhou sua defesa com o alvo!",
	},
	guardswap: {
		desc: "O usuário troca suas mudanças de estágio de Defesa e Defesa Especial com o alvo.",
		shortDesc: "Troca mudanças de Defesa e Sp. Def com o alvo.",
	},
	guillotine: {
		desc: "Causa ao alvo dano igual ao HP máximo do alvo. Ignora modificadores de precisão e evasão. A precisão deste ataque é igual a (nível do usuário - nível do alvo + 30)%, e ele falha se o alvo tiver nível maior. Pokémon com a habilidade Sturdy são imunes.",
		shortDesc: "OHKO no alvo. Falha se o usuário tiver nível menor.",
		gen2: {
			desc: "Causa 65535 de dano ao alvo. A precisão deste ataque, em 256, é igual ao menor valor entre (2 × (nível do usuário - nível do alvo) + 76) e 255, antes de aplicar os modificadores de precisão e evasão. Falha se o alvo tiver nível maior.",
		},
		gen1: {
			desc: "Causa 65535 de dano ao alvo. Falha se a Velocidade do alvo for maior que a do usuário.",
			shortDesc: "Causa 65535 de dano. Falha se o alvo for mais rápido.",
		},
	},
	gunkshot: {
		desc: "Tem 30% de chance de envenenar o alvo.",
		shortDesc: "30% de chance de envenenar o alvo.",
	},
	gust: {
		desc: "O poder dobra se o alvo estiver usando Bounce, Fly ou Sky Drop, ou estiver sob o efeito de Sky Drop.",
		shortDesc: "O poder dobra durante Bounce, Fly e Sky Drop.",
		gen4: {
			desc: "O poder dobra se o alvo estiver usando Bounce ou Fly.",
			shortDesc: "O poder dobra durante Bounce e Fly.",
		},
		gen2: {
			desc: "O poder dobra se o alvo estiver usando Fly.",
			shortDesc: "O poder dobra durante Fly.",
		},
		gen1: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
	},
	gyroball: {
		desc: "O poder é igual a (25 * Velocidade atual do alvo / Velocidade atual do usuário) + 1, arredondado para baixo, mas não mais que 150. Se a Velocidade atual do usuário for 0, o poder deste golpe é 1.",
		shortDesc: "Mais poder quanto mais lento o usuário for que o alvo.",
		gen5: {
			desc: "O poder é igual a (25 * Velocidade atual do alvo / Velocidade atual do usuário) + 1, arredondado para baixo, mas não mais que 150. Se a Velocidade atual do usuário for 0, ela é tratada como 1.",
		},
	},
	hail: {
		desc: "Por 5 turnos, o clima se torna granizo. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/16 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ice ou tenham as habilidades Ice Body, Magic Guard, Overcoat ou Snow Cloak. Dura 8 turnos se o usuário estiver segurando Icy Rock. Falha se o clima atual for granizo.",
		shortDesc: "Por 5 turnos, cai granizo.",
		gen4: {
			desc: "Por 5 turnos, o clima se torna granizo. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/16 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ice ou tenham as habilidades Ice Body, Magic Guard ou Snow Cloak. Dura 8 turnos se o usuário estiver segurando Icy Rock. Falha se o clima atual for granizo.",
		},
		gen3: {
			desc: "Por 5 turnos, o clima se torna granizo. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/16 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ice. Falha se o clima atual for granizo.",
		},
	},
	hammerarm: {
		desc: "Diminui a Velocidade do usuário em 1 estágio.",
		shortDesc: "Diminui a Velocidade do usuário em 1.",
	},
	happyhour: {
		shortDesc: "Sem uso competitivo.",
		activate: "  Todos foram contagiados pelo clima de alegria!",
	},
	harden: {
		desc: "Aumenta a Defesa do usuário em 1 estágio.",
		shortDesc: "Aumenta a Defesa do usuário em 1.",
	},
	hardpress: {
		desc: "O poder é igual a 100 × (HP atual do alvo / HP máximo do alvo), arredondado para baixo na metade exata, mas não menos que 1.",
		shortDesc: "Mais poder quanto mais HP o alvo tiver.",
	},
	haze: {
		desc: "Zera os estágios de atributos de todos os Pokémon em campo.",
		shortDesc: "Elimina todas as mudanças de atributos.",
		gen1: {
			desc: "Zera os estágios de atributos de ambos os Pokémon e remove as reduções de atributos causadas por queimadura e paralisia. Zera os contadores de Toxic e remove o efeito de confusão, Disable, Focus Energy, Leech Seed, Light Screen, Mist e Reflect de ambos os Pokémon. Remove a condição de status não volátil do oponente.",
			shortDesc: "Zera mudanças de atributos. Remove status do oponente.",
		},
		activate: "  Todas as mudanças de atributos foram eliminadas!",
	},
	headbutt: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	headcharge: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "1/4 de dano de recuo.",
	},
	headlongrush: {
		desc: "Diminui a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Diminui a Defesa e a Sp. Def do usuário em 1.",
	},
	headsmash: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "1/2 de dano de recuo.",
		gen4: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/2 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
		},
	},
	healbell: {
		desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil. Pokémon em campo com a habilidade Soundproof não são curados, a menos que sejam o usuário.",
		shortDesc: "Cura as condições de status da equipe do usuário.",
		gen7: {
			desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil. Pokémon em campo com a habilidade Soundproof não são curados.",
		},
		gen5: {
			desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil. Pokémon em campo com a habilidade Soundproof também são curados.",
		},
		gen4: {
			desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil. Pokémon com a habilidade Soundproof não são curados.",
		},
		gen2: {
			desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil.",
		},
		activate: "  Um sino tocou!",
	},
	healblock: {
		desc: "Por 5 turnos, o alvo fica impedido de recuperar HP enquanto permanecer em campo. Durante o efeito, golpes de cura e de drenagem não podem ser usados, e habilidades e itens que concedem cura não curarão o usuário. Se um Pokémon afetado usar Baton Pass, o Pokémon que entrar no lugar continuará sem poder recuperar HP. Pain Split e a habilidade Regenerator não são afetados.",
		shortDesc: "Por 5 turnos, impede o(s) oponente(s) de se curar.",
		gen8: {
			end: "  O efeito de Heal Block em {POKEMON} acabou!",
			cant: "{POKEMON} não pode usar {MOVE} por causa de Heal Block!",
		},
		gen7: {
			desc: "Por 5 turnos, o alvo fica impedido de recuperar HP enquanto permanecer em campo. Durante o efeito, golpes de cura e de drenagem não podem ser usados, e habilidades e itens que concedem cura não curarão o usuário. Se um Pokémon afetado usar Baton Pass, o Pokémon que entrar no lugar continuará sem poder recuperar HP. Pain Split e a habilidade Regenerator não são afetados. Z-Moves relevantes ainda podem ser escolhidos e executados durante este efeito.",
		},
		gen6: {
			desc: "Por 5 turnos, o alvo fica impedido de recuperar HP enquanto permanecer em campo. Durante o efeito, golpes de cura e de drenagem não podem ser usados, e habilidades e itens que concedem cura não curarão o usuário. Se um Pokémon afetado usar Baton Pass, o Pokémon que entrar no lugar continuará sem poder recuperar HP. Pain Split e a habilidade Regenerator não são afetados.",
		},
		gen4: {
			desc: "Por 5 turnos, o alvo fica impedido de recuperar HP enquanto permanecer em campo. Durante o efeito, golpes de cura não podem ser usados e efeitos de golpes que concedem cura não curam, mas habilidades e itens continuam curando o usuário. Se um Pokémon afetado usar Baton Pass, o Pokémon que entrar no lugar continuará sob o efeito. Pain Split não é afetado.",
		},
		start: "  {POKEMON} foi impedido de se curar!",
		end: "  {POKEMON} não está mais impedido de se curar!",
		cant: "{POKEMON} está impedido de se curar, então não pode usar {MOVE}!",
		fail: "  Mas não afetou {POKEMON}!",
	},
	healingwish: {
		desc: "O usuário desmaia e, se o Pokémon que entrar em seu lugar não estiver com o HP cheio ou tiver uma condição de status não volátil, ele tem o HP totalmente restaurado e qualquer condição de status não volátil curada. O novo Pokémon entra ao final do turno, e a cura acontece antes que as armadilhas de campo façam efeito. Este efeito continua até que um Pokémon que atenda a qualquer uma dessas condições entre em campo na posição do usuário ou seja trocado para essa posição com Ally Switch. Falha se o usuário for o último Pokémon não desmaiado da sua equipe.",
		shortDesc: "Usuário desmaia. Próximo ferido é curado totalmente.",
		gen7: {
			desc: "O usuário desmaia, e o Pokémon que entrar em seu lugar tem o HP totalmente restaurado e qualquer condição de status não volátil curada. O novo Pokémon entra ao final do turno, e a cura acontece antes que as armadilhas de campo façam efeito. Falha se o usuário for o último Pokémon não desmaiado da sua equipe.",
			shortDesc: "Usuário desmaia. Quem entra é curado totalmente.",
		},
		gen4: {
			desc: "O usuário desmaia, e o Pokémon que entrar em seu lugar tem o HP totalmente restaurado e qualquer condição de status não volátil curada. O novo Pokémon entra imediatamente, e a cura acontece depois que as armadilhas de campo fazem efeito. Falha se o usuário for o último Pokémon não desmaiado da sua equipe.",
		},
		heal: "  O desejo de cura se realizou para {POKEMON}!",
	},
	healorder: {
		desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade.",
		shortDesc: "Cura o usuário em 50% do HP máximo dele.",
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo.",
		},
	},
	healpulse: {
		desc: "O alvo recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade. Se o usuário tiver a habilidade Mega Launcher, o alvo recupera, em vez disso, 3/4 do seu HP máximo, arredondado para baixo na metade exata.",
		shortDesc: "Cura o alvo em 50% do HP máximo dele.",
		gen5: {
			desc: "O alvo recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade.",
		},
	},
	heartstamp: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	heartswap: {
		desc: "O usuário troca todas as suas mudanças de estágio de atributos com o alvo.",
		shortDesc: "Troca todas as mudanças de atributos com o alvo.",
	},
	heatcrash: {
		desc: "O poder deste golpe depende de (peso do usuário / peso do alvo), arredondado para baixo. O poder é 120 se o resultado for 5 ou mais, 100 se for 4, 80 se for 3, 60 se for 2 e 40 se for 1 ou menos. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "Mais poder quanto mais pesado o usuário que o alvo.",
		gen5: {
			desc: "O poder deste golpe depende de (peso do usuário / peso do alvo), arredondado para baixo. O poder é 120 se o resultado for 5 ou mais, 100 se for 4, 80 se for 3, 60 se for 2 e 40 se for 1 ou menos.",
		},
	},
	heatwave: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o(s) oponente(s).",
	},
	heavyslam: {
		desc: "O poder deste golpe depende de (peso do usuário / peso do alvo), arredondado para baixo. O poder é 120 se o resultado for 5 ou mais, 100 se for 4, 80 se for 3, 60 se for 2 e 40 se for 1 ou menos. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "Mais poder quanto mais pesado o usuário que o alvo.",
		gen6: {
			desc: "O poder deste golpe depende de (peso do usuário / peso do alvo), arredondado para baixo. O poder é 120 se o resultado for 5 ou mais, 100 se for 4, 80 se for 3, 60 se for 2 e 40 se for 1 ou menos.",
		},
	},
	helpinghand: {
		desc: "O poder do ataque do alvo neste turno é multiplicado por 1,5 (este efeito é cumulativo). Falha se não houver aliado adjacente ao usuário ou se o aliado já tiver agido neste turno, mas não falha se o aliado estiver usando um golpe de dois turnos.",
		shortDesc: "Golpe de um aliado adjacente tem 1,5× poder no turno.",
		start: "  {SOURCE} está pronto para ajudar {POKEMON}!",
	},
	hex: {
		desc: "O poder dobra se o alvo tiver uma condição de status não volátil.",
		shortDesc: "O poder dobra se o alvo tiver condição de status.",
	},
	hiddenpower: {
		desc: "O tipo deste golpe depende dos valores individuais (IVs) do usuário e pode ser qualquer tipo, exceto os tipos Fairy e Normal.",
		shortDesc: "O tipo varia de acordo com os IVs do usuário.",
		gen5: {
			desc: "O tipo e o poder deste golpe dependem dos valores individuais (IVs) do usuário. O poder varia entre 30 e 70, e o tipo pode ser qualquer um, exceto o tipo Normal.",
			shortDesc: "Poder e tipo variam de acordo com os IVs do usuário.",
		},
	},
	highhorsepower: {
		shortDesc: "Sem efeito adicional.",
	},
	highjumpkick: {
		desc: "Se este ataque não for bem-sucedido, o usuário perde metade do seu HP máximo, arredondado para baixo, como dano de queda. Pokémon com a habilidade Magic Guard não são afetados por dano de queda.",
		shortDesc: "Usuário perde 50% do HP máximo se errar.",
		gen4: {
			desc: "Se este ataque não for bem-sucedido, o usuário perde, como dano de queda, HP igual à metade do HP máximo do alvo, arredondado para baixo, se o alvo for imune; caso contrário, metade do dano que o alvo teria sofrido, arredondado para baixo, mas não menos que 1 HP nem mais que metade do HP máximo do alvo. Pokémon com a habilidade Magic Guard não são afetados por dano de queda.",
			shortDesc: "Se errar, usuário sofre 1/2 do dano que causaria.",
		},
		gen3: {
			desc: "Se este ataque não for bem-sucedido e o alvo não for imune, o usuário perde, como dano de queda, HP igual à metade do dano que o alvo teria sofrido, arredondado para baixo, mas não menos que 1 HP nem mais que metade do HP máximo do alvo.",
			shortDesc: "Se errar, usuário sofre 1/2 do dano que causaria.",
		},
		gen2: {
			desc: "Se este ataque não for bem-sucedido e o alvo não for imune, o usuário perde, como dano de queda, HP igual a 1/8 do dano que o alvo teria sofrido, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Se errar, usuário sofre 1/8 do dano que causaria.",
		},
		gen1: {
			desc: "Se este ataque errar o alvo, o usuário sofre 1 HP de dano de queda. Se o usuário tiver um substituto, o dano de queda é aplicado ao substituto do alvo, se ele tiver um; caso contrário, nenhum dano de queda é causado.",
			shortDesc: "Usuário sofre 1 HP de dano se errar.",
		},
	},
	holdback: {
		desc: "Deixa o alvo com pelo menos 1 HP.",
		shortDesc: "Sempre deixa o alvo com pelo menos 1 HP.",
	},
	holdhands: {
		desc: "Sem uso competitivo. Falha se não houver aliado adjacente ao usuário.",
		shortDesc: "Sem uso competitivo.",
	},
	honeclaws: {
		desc: "Aumenta o Ataque e a precisão do usuário em 1 estágio.",
		shortDesc: "Aumenta o Ataque e a precisão do usuário em 1.",
	},
	hornattack: {
		shortDesc: "Sem efeito adicional.",
	},
	horndrill: {
		desc: "Causa ao alvo dano igual ao HP máximo do alvo. Ignora modificadores de precisão e evasão. A precisão deste ataque é igual a (nível do usuário - nível do alvo + 30)%, e ele falha se o alvo tiver nível maior. Pokémon com a habilidade Sturdy são imunes.",
		shortDesc: "OHKO no alvo. Falha se o usuário tiver nível menor.",
		gen2: {
			desc: "Causa 65535 de dano ao alvo. A precisão deste ataque, em 256, é igual ao menor valor entre (2 × (nível do usuário - nível do alvo) + 76) e 255, antes de aplicar os modificadores de precisão e evasão. Falha se o alvo tiver nível maior.",
		},
		gen1: {
			desc: "Causa 65535 de dano ao alvo. Falha se a Velocidade do alvo for maior que a do usuário.",
			shortDesc: "Causa 65535 de dano. Falha se o alvo for mais rápido.",
		},
	},
	hornleech: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "Usuário recupera 50% do dano causado.",
	},
	howl: {
		desc: "Aumenta o Ataque do usuário e de todos os aliados em 1 estágio.",
		shortDesc: "Aumenta o Ataque do usuário e do aliado em 1.",
		gen7: {
			desc: "Aumenta o Ataque do usuário em 1 estágio.",
			shortDesc: "Aumenta o Ataque do usuário em 1.",
		},
	},
	hurricane: {
		desc: "Tem 30% de chance de confundir o alvo. Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se o clima for sol extremo ou sol, a precisão deste golpe é 50%. Se este golpe for usado contra um Pokémon segurando Utility Umbrella, a precisão dele continua em 70%.",
		shortDesc: "30% de chance de confundir. Não erra na chuva.",
		gen7: {
			desc: "Tem 30% de chance de confundir o alvo. Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se o clima for sol extremo ou sol, a precisão deste golpe é 50%.",
		},
		gen5: {
			desc: "Tem 30% de chance de confundir o alvo. Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se o clima for chuva, este golpe não verifica a precisão. Se o clima for sol, a precisão deste golpe é 50%.",
		},
	},
	hydrocannon: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "Usuário não pode agir no próximo turno.",
	},
	hydropump: {
		shortDesc: "Sem efeito adicional.",
	},
	hydrosteam: {
		desc: "Se o clima atual for sol e o usuário não estiver segurando Utility Umbrella, o dano deste golpe é multiplicado por 1,5 em vez de reduzido à metade por ser do tipo Water.",
		shortDesc: "No sol: 1,5× dano em vez de metade.",
	},
	hydrovortex: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	hyperbeam: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "Usuário não pode agir no próximo turno.",
		gen1: {
			desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe, a menos que o alvo ou seu substituto tenha sido nocauteado por este golpe.",
			shortDesc: "Recarrega se o alvo ou substituto não for nocauteado.",
		},
	},
	hyperdrill: {
		shortDesc: "Ignora proteções sem rompê-las.",
	},
	hyperfang: {
		desc: "Tem 10% de chance de fazer o alvo recuar.",
		shortDesc: "10% de chance de fazer o alvo recuar.",
	},
	hyperspacefury: {
		desc: "Diminui a Defesa do usuário em 1 estágio. Este golpe só pode ser usado com sucesso se a forma atual do usuário, considerando Transform, for Hoopa Unbound. Se este golpe for bem-sucedido, ele rompe Baneful Bunker, Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do alvo normalmente.",
		shortDesc: "Hoopa-U: diminui Def do usuário em 1; rompe proteção.",
		gen6: {
			desc: "Diminui a Defesa do usuário em 1 estágio. Este golpe só pode ser usado com sucesso se a forma atual do usuário, considerando Transform, for Hoopa Unbound. Se este golpe for bem-sucedido, ele rompe Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do alvo normalmente.",
		},
	},
	hyperspacehole: {
		desc: "Se este golpe for bem-sucedido, ele rompe Baneful Bunker, Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do alvo normalmente.",
		shortDesc: "Rompe a proteção do alvo neste turno.",
		gen6: {
			desc: "Se este golpe for bem-sucedido, ele rompe Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno e outros Pokémon podem atacar o lado do alvo normalmente.",
		},
	},
	hypervoice: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge oponentes adjacentes.",
	},
	hypnosis: {
		shortDesc: "Faz o alvo adormecer.",
	},
	iceball: {
		desc: "Se este golpe for bem-sucedido, o usuário fica preso a este golpe e não pode usar outro até errar, passarem 5 turnos ou o ataque não puder ser usado. O poder dobra a cada acerto bem-sucedido deste golpe e dobra de novo se o usuário tiver usado Defense Curl antes. Se este golpe for chamado por Sleep Talk, ele é usado por um turno.",
		shortDesc: "O poder dobra a cada acerto. Repete por 5 turnos.",
		gen7: {
			desc: "Se este golpe for bem-sucedido, o usuário fica preso a este golpe e não pode usar outro até errar, passarem 5 turnos ou o ataque não puder ser usado. O poder dobra a cada acerto bem-sucedido deste golpe e dobra de novo se o usuário tiver usado Defense Curl antes. Se este golpe for chamado por Sleep Talk, ele é usado por um turno. Se este golpe atingir Disguise ativo durante o efeito, o multiplicador de poder é pausado, mas o contador de turnos não, o que pode permitir que o multiplicador seja usado no próximo golpe do usuário depois que este efeito terminar.",
		},
		gen6: {
			desc: "Se este golpe for bem-sucedido, o usuário fica preso a este golpe e não pode usar outro até errar, passarem 5 turnos ou o ataque não puder ser usado. O poder dobra a cada acerto bem-sucedido deste golpe e dobra de novo se o usuário tiver usado Defense Curl antes. Se este golpe for chamado por Sleep Talk, ele é usado por um turno.",
		},
	},
	icebeam: {
		desc: "Tem 10% de chance de congelar o alvo.",
		shortDesc: "10% de chance de congelar o alvo.",
	},
	iceburn: {
		desc: "Tem 30% de chance de queimar o alvo. Este ataque carrega no primeiro turno e é executado no segundo. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Carrega no turno 1. Ataca no turno 2. 30% queima.",
		prepare: "  {POKEMON} foi envolto por um ar congelante!",
	},
	icefang: {
		desc: "Tem 10% de chance de congelar o alvo e 10% de chance de fazê-lo recuar.",
		shortDesc: "10% de chance de congelar. 10% de chance de recuar.",
	},
	icehammer: {
		desc: "Diminui a Velocidade do usuário em 1 estágio.",
		shortDesc: "Diminui a Velocidade do usuário em 1.",
	},
	icepunch: {
		desc: "Tem 10% de chance de congelar o alvo.",
		shortDesc: "10% de chance de congelar o alvo.",
	},
	iceshard: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	icespinner: {
		desc: "Encerra os efeitos de Electric Terrain, Grassy Terrain, Misty Terrain e Psychic Terrain.",
		shortDesc: "Encerra os efeitos de terreno.",
	},
	iciclecrash: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	iciclespear: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acerta 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acerta cinco vezes. Se o alvo tiver Focus Sash e estava com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, o alvo sofrerá dano nos acertos restantes.",
		},
	},
	icywind: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de -1 na Velocidade do(s) oponente(s).",
		gen2: {
			shortDesc: "100% de chance de diminuir a Velocidade do alvo em 1.",
		},
	},
	imprison: {
		desc: "O usuário impede todos os Pokémon adversários de usar qualquer golpe que o usuário também conheça, enquanto o usuário permanecer em campo.",
		shortDesc: "Oponentes não podem usar golpes que o usuário conhece.",
		gen7: {
			desc: "O usuário impede todos os Pokémon adversários de usar qualquer golpe que o usuário também conheça, enquanto o usuário permanecer em campo. Z-Moves ainda podem ser escolhidos e executados durante este efeito.",
		},
		gen6: {
			desc: "O usuário impede todos os Pokémon adversários de usar qualquer golpe que o usuário também conheça, enquanto o usuário permanecer em campo.",
		},
		gen4: {
			desc: "O usuário impede todos os Pokémon adversários de usar qualquer golpe que o usuário também conheça, enquanto o usuário permanecer em campo. Falha se nenhum Pokémon adversário conhecer algum dos golpes do usuário.",
		},
		start: "  {POKEMON} selou os golpes que o alvo tem em comum com ele!",
		cant: "{POKEMON} não pode usar {MOVE}, que foi selado!",
	},
	incinerate: {
		desc: "O alvo perde o item segurado se for uma Berry ou uma Gem. Este golpe não pode fazer Pokémon com a habilidade Sticky Hold perderem o item segurado. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
		shortDesc: "Destrói Berry/Gem do(s) oponente(s).",
		gen5: {
			desc: "O alvo perde o item segurado se for uma Berry. Este golpe não pode fazer Pokémon com a habilidade Sticky Hold perderem o item segurado. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
			shortDesc: "Destrói Berry do(s) oponente(s).",
		},
		removeItem: "  {ITEM} de {POKEMON} foi incinerado!",
	},
	infernalparade: {
		desc: "Tem 30% de chance de queimar o alvo. O poder dobra se o alvo tiver uma condição de status não volátil.",
		shortDesc: "30% de queimar. 2× poder se o alvo já tiver status.",
	},
	inferno: {
		desc: "Tem 100% de chance de queimar o alvo.",
		shortDesc: "100% de chance de queimar o alvo.",
	},
	infernooverdrive: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	infestation: {
		desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		start: "  {POKEMON} foi infestado por {SOURCE}!",
	},
	ingrain: {
		desc: "O usuário recupera 1/16 do seu HP máximo ao final de cada turno, mas fica impedido de sair de campo, e outros Pokémon não podem forçá-lo a sair de campo. O usuário ainda pode sair de campo se usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. Se o usuário sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso e ainda receberá o efeito de cura. Durante o efeito, o usuário pode ser atingido normalmente por ataques do tipo Ground e ser afetado por Spikes, Toxic Spikes e Sticky Web, mesmo que seja do tipo Flying ou tenha a habilidade Levitate.",
		shortDesc: "Prende e aterra o usuário; cura 1/16 do HP máx./turno.",
		gen7: {
			desc: "O usuário recupera 1/16 do seu HP máximo ao final de cada turno, mas fica impedido de sair de campo, e outros Pokémon não podem forçá-lo a sair de campo. O usuário ainda pode sair de campo se usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o usuário sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso e ainda receberá o efeito de cura. Durante o efeito, o usuário pode ser atingido normalmente por ataques do tipo Ground e ser afetado por Spikes, Toxic Spikes e Sticky Web, mesmo que seja do tipo Flying ou tenha a habilidade Levitate.",
		},
		gen5: {
			desc: "O usuário recupera 1/16 do seu HP máximo ao final de cada turno, mas fica impedido de sair de campo, e outros Pokémon não podem forçá-lo a sair de campo. O usuário ainda pode sair de campo se usar Baton Pass, U-turn ou Volt Switch. Se o usuário sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso e ainda receberá o efeito de cura. Durante o efeito, o usuário pode ser atingido normalmente por ataques do tipo Ground e ser afetado por Spikes e Toxic Spikes, mesmo que seja do tipo Flying ou tenha a habilidade Levitate.",
		},
		gen4: {
			desc: "O usuário recupera 1/16 do seu HP máximo ao final de cada turno, mas fica impedido de sair de campo, e outros Pokémon não podem forçá-lo a sair de campo. O usuário ainda pode sair de campo se usar Baton Pass ou U-turn. Se o usuário sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso e ainda receberá o efeito de cura. Durante o efeito, o usuário pode ser atingido normalmente por ataques do tipo Ground e ser afetado por Spikes e Toxic Spikes, mesmo que seja do tipo Flying ou tenha a habilidade Levitate.",
		},
		gen3: {
			desc: "O usuário recupera 1/16 do seu HP máximo ao final de cada turno, mas fica impedido de sair de campo, e outros Pokémon não podem forçá-lo a sair de campo. O usuário ainda pode sair de campo se usar Baton Pass, e o Pokémon que entrar no lugar continuará preso e ainda receberá o efeito de cura.",
			shortDesc: "Recupera 1/16 do HP máx. por turno. Prende o usuário.",
		},
		start: "  {POKEMON} fincou suas raízes!",
		block: "  {POKEMON} está ancorado no lugar por suas raízes!",
		heal: "  {POKEMON} absorveu nutrientes com suas raízes!",
	},
	instruct: {
		desc: "O alvo usa imediatamente o último golpe que usou. Falha se o alvo não tiver usado nenhum golpe, se o golpe estiver com 0 PP, se o alvo estiver se preparando para usar Beak Blast, Focus Punch ou Shell Trap, ou se o golpe for Assist, Beak Blast, Belch, Bide, Blazing Torque, Celebrate, Chatter, Combat Torque, Copycat, Dynamax Cannon, Focus Punch, Hold Hands, Ice Ball, Instruct, King's Shield, Magical Torque, Me First, Metronome, Mimic, Mirror Move, Nature Power, Noxious Torque, Obstruct, Outrage, Petal Dance, Rollout, Shell Trap, Sketch, Sleep Talk, Struggle, Thrash, Transform, Uproar, Wicked Torque, qualquer golpe de dois turnos ou qualquer golpe de recarga.",
		shortDesc: "O alvo usa imediatamente o último golpe que usou.",
		gen8: {
			desc: "O alvo usa imediatamente o último golpe que usou. Falha se o alvo não tiver usado nenhum golpe, se o golpe estiver com 0 PP, se o alvo estiver em Dynamax, se o alvo estiver se preparando para usar Beak Blast, Focus Punch ou Shell Trap, ou se o golpe for Assist, Beak Blast, Belch, Bide, Celebrate, Chatter, Copycat, Dynamax Cannon, Focus Punch, Hold Hands, Ice Ball, Instruct, King's Shield, Me First, Metronome, Mimic, Mirror Move, Nature Power, Obstruct, Outrage, Petal Dance, Rollout, Shell Trap, Sketch, Sleep Talk, Struggle, Thrash, Transform, Uproar, qualquer golpe de dois turnos, qualquer golpe de recarga ou qualquer Max Move ou G-Max Move.",
		},
		gen7: {
			desc: "O alvo usa imediatamente o último golpe que usou. Falha se o alvo não tiver usado nenhum golpe, se o golpe estiver com 0 PP, se o alvo estiver se preparando para usar Beak Blast, Focus Punch ou Shell Trap, ou se o golpe for Assist, Beak Blast, Belch, Bide, Celebrate, Chatter, Copycat, Focus Punch, Hold Hands, Ice Ball, Instruct, King's Shield, Me First, Metronome, Mimic, Mirror Move, Nature Power, Outrage, Petal Dance, Rollout, Shell Trap, Sketch, Sleep Talk, Struggle, Thrash, Transform, Uproar, qualquer golpe de dois turnos, qualquer golpe de recarga ou qualquer Z-Move.",
		},
		activate: "  {TARGET} seguiu as instruções de {POKEMON}!",
	},
	iondeluge: {
		desc: "Faz os golpes do tipo Normal se tornarem do tipo Electric neste turno. O efeito ocorre depois de outros efeitos que mudam o tipo de um golpe.",
		shortDesc: "Golpes do tipo Normal viram do tipo Electric no turno.",
		activate: "  Um dilúvio de íons cai sobre o campo de batalha!",
	},
	irondefense: {
		desc: "Aumenta a Defesa do usuário em 2 estágios.",
		shortDesc: "Aumenta a Defesa do usuário em 2.",
	},
	ironhead: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
		champions: {
			desc: "Tem 20% de chance de fazer o alvo recuar.",
			shortDesc: "20% de chance de fazer o alvo recuar.",
		},
	},
	irontail: {
		desc: "Tem 30% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "30% de chance de diminuir a Defesa do alvo em 1.",
	},
	ivycudgel: {
		desc: "Tem maior chance de acerto crítico. Se o usuário for Ogerpon, o tipo deste golpe muda de acordo com sua forma: tipo Water com Wellspring Mask, tipo Fire com Hearthflame Mask e tipo Rock com Cornerstone Mask.",
		shortDesc: "Alta taxa de crítico. Tipo depende da forma do usuário.",
	},
	jawlock: {
		desc: "Impede o usuário e o alvo de sair de campo. O usuário e o alvo ainda podem sair de campo se algum deles estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Impede usuário e alvo de sair de campo.",
	},
	jetpunch: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	judgment: {
		desc: "O tipo deste golpe depende da Plate segurada pelo usuário.",
		shortDesc: "O tipo varia conforme a Plate segurada.",
	},
	jumpkick: {
		desc: "Se este ataque não for bem-sucedido, o usuário perde metade do seu HP máximo, arredondado para baixo, como dano de queda. Pokémon com a habilidade Magic Guard não são afetados por dano de queda.",
		shortDesc: "Usuário perde 50% do HP máximo se errar.",
		gen4: {
			desc: "Se este ataque não for bem-sucedido, o usuário perde, como dano de queda, HP igual à metade do HP máximo do alvo, arredondado para baixo, se o alvo for imune; caso contrário, metade do dano que o alvo teria sofrido, arredondado para baixo, mas não menos que 1 HP nem mais que metade do HP máximo do alvo. Pokémon com a habilidade Magic Guard não são afetados por dano de queda.",
			shortDesc: "Se errar, usuário sofre 1/2 do dano que causaria.",
		},
		gen3: {
			desc: "Se este ataque não for bem-sucedido e o alvo não for imune, o usuário perde, como dano de queda, HP igual à metade do dano que o alvo teria sofrido, arredondado para baixo, mas não menos que 1 HP nem mais que metade do HP máximo do alvo.",
			shortDesc: "Se errar, usuário sofre 1/2 do dano que causaria.",
		},
		gen2: {
			desc: "Se este ataque não for bem-sucedido e o alvo não for imune, o usuário perde, como dano de queda, HP igual a 1/8 do dano que o alvo teria sofrido, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Se errar, usuário sofre 1/8 do dano que causaria.",
		},
		gen1: {
			desc: "Se este ataque errar o alvo, o usuário sofre 1 HP de dano de queda. Se o usuário tiver um substituto, o dano de queda é aplicado ao substituto do alvo, se ele tiver um; caso contrário, nenhum dano de queda é causado.",
			shortDesc: "Usuário sofre 1 HP de dano se errar.",
		},
	},
	junglehealing: {
		desc: "Cada Pokémon do lado do usuário recupera 1/4 do seu HP máximo, arredondado para cima a partir da metade, e tem sua condição de status curada.",
		shortDesc: "Usuário e aliados: curam 1/4 do HP máx. e status.",
	},
	karatechop: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	kinesis: {
		desc: "Diminui a precisão do alvo em 1 estágio.",
		shortDesc: "Diminui a precisão do alvo em 1.",
	},
	kingsshield: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm o Ataque diminuído em 1 estágio. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		shortDesc: "Protege de ataques que causam dano. Contato: -1 Atk.",
		gen8: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm o Ataque diminuído em 1 estágio. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
		gen7: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm o Ataque diminuído em 2 estágios. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
			shortDesc: "Protege de ataques que causam dano. Contato: -2 Atk.",
		},
		gen6: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm o Ataque diminuído em 2 estágios. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		},
	},
	knockoff: {
		desc: "O poder deste golpe é multiplicado por 1,5 se o alvo estiver segurando um item, e o alvo perde o item segurado se o usuário não tiver desmaiado. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. Este golpe não tem o poder aumentado nem remove o item do alvo se ele for Blue Orb, Red Orb, Adamant Crystal, Lustrous Globe, Griseous Core, Plate, Drive, Memory, Rusted Sword, Rusted Shield, Booster Energy ou Mask segurado por Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, Pokémon Paradox ou Ogerpon, respectivamente, ou se o usuário for de uma dessas espécies e o alvo estiver segurando o item correspondente. Neste caso, os Pokémon Paradox incluem todas as espécies com as habilidades Protosynthesis e Quark Drive, exceto Gouging Fire, Raging Bolt, Iron Boulder e Iron Crown. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
		shortDesc: "1,5× dano se o oponente tiver item. Remove o item.",
		champions: {
			desc: "O poder deste golpe é multiplicado por 1,5 se o alvo estiver segurando um item, e o alvo perde o item segurado. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. Este golpe não tem o poder aumentado nem remove o item do alvo se ele for uma Mega Stone segurada pela espécie que pode Megaevoluir com ela. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
		},
		gen8: {
			desc: "O poder deste golpe é multiplicado por 1,5 se o alvo estiver segurando um item, e o alvo perde o item segurado se o usuário não tiver desmaiado. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. Este golpe não tem o poder aumentado nem remove o item do alvo se ele for Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword ou Rusted Shield segurado por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian ou Zamazenta, respectivamente, ou se o usuário for de uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
		},
		gen7: {
			desc: "O poder deste golpe é multiplicado por 1,5 se o alvo estiver segurando um item, e o alvo perde o item segurado se o usuário não tiver desmaiado. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. Este golpe não tem o poder aumentado nem remove o item do alvo se ele for um Z-Crystal, uma Mega Stone segurada pela espécie que pode Megaevoluir com ela, ou Blue Orb, Red Orb, Griseous Orb, Plate, Drive ou Memory segurado por Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvally, respectivamente, ou se o usuário for de uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
		},
		gen6: {
			desc: "O poder deste golpe é multiplicado por 1,5 se o alvo estiver segurando um item, e o alvo perde o item segurado se o usuário não tiver desmaiado. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. Este golpe não tem o poder aumentado nem remove o item do alvo se ele for uma Mega Stone segurada pela espécie que pode Megaevoluir com ela, ou Blue Orb, Red Orb, Griseous Orb, Plate ou Drive segurado por Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivamente, ou se o usuário for de uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
		},
		gen5: {
			desc: "Se o usuário não tiver desmaiado, o alvo perde o item segurado. Um alvo com a habilidade Sticky Hold não perde o item segurado se não tiver desmaiado. Este golpe não remove o item do alvo se ele for Griseous Orb, Plate ou Drive segurado por Giratina, Arceus ou Genesect, respectivamente, ou se o usuário for de uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos por este golpe não podem ser recuperados com Recycle ou com a habilidade Harvest.",
			shortDesc: "Remove o item segurado pelo alvo.",
		},
		gen4: {
			desc: "O item segurado pelo alvo é perdido pelo resto da batalha, a menos que o item seja Griseous Orb ou o alvo tenha as habilidades Multitype ou Sticky Hold. Durante o efeito, o alvo não pode obter um novo item de forma alguma.",
			shortDesc: "Alvo perde o item e não pode obter outro.",
		},
		gen3: {
			desc: "O item segurado pelo alvo é perdido pelo resto da batalha, a menos que ele tenha a habilidade Sticky Hold. Durante o efeito, o alvo não pode obter um novo item de forma alguma.",
		},
		removeItem: "  {SOURCE} derrubou {ITEM} de {POKEMON}!",
	},
	kowtowcleave: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	landswrath: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge oponentes adjacentes.",
	},
	laserfocus: {
		desc: "Até o fim do próximo turno, os ataques do usuário serão acertos críticos.",
		shortDesc: "Críticos garantidos até o fim do próximo turno.",
		start: "  {POKEMON} se concentrou intensamente!",
	},
	lashout: {
		desc: "O poder dobra se algum estágio de atributo do usuário tiver sido diminuído neste turno.",
		shortDesc: "2× poder se um atributo do usuário caiu neste turno.",
	},
	lastresort: {
		desc: "Este golpe falha a menos que o usuário conheça este golpe e pelo menos um outro, e tenha usado todos os outros golpes que conhece pelo menos uma vez cada desde que entrou em campo ou se transformou.",
		shortDesc: "Falha se nem todos os golpes conhecidos foram usados.",
	},
	lastrespects: {
		desc: "O poder é igual a 50+(X × 50), onde X é o número total de vezes que qualquer Pokémon desmaiou no lado do usuário, e X não pode ser maior que 100.",
		shortDesc: "+50 de poder a cada desmaio na equipe.",
	},
	lavaplume: {
		desc: "Tem 30% de chance de queimar o alvo.",
		shortDesc: "30% de chance de queimar Pokémon adjacentes.",
	},
	leafage: {
		shortDesc: "Sem efeito adicional.",
	},
	leafblade: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	leafstorm: {
		desc: "Diminui o Ataque Especial do usuário em 2 estágios.",
		shortDesc: "Diminui o Sp. Atk do usuário em 2.",
	},
	leaftornado: {
		desc: "Tem 50% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a precisão do alvo em 1.",
	},
	leechlife: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata.",
		shortDesc: "Usuário recupera 50% do dano causado.",
		gen4: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo.",
		},
		gen3: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo.",
		},
	},
	leechseed: {
		desc: "O Pokémon na posição do usuário rouba 1/8 do HP máximo do alvo, arredondado para baixo, ao final de cada turno. Se quem recebe o HP estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sendo drenado. Se o alvo sair de campo ou usar Mortal Spin ou Rapid Spin com sucesso, o efeito termina. Pokémon do tipo Grass são imunes a este golpe no uso, mas não ao seu efeito.",
		shortDesc: "1/8 do HP do alvo vai para o usuário a cada turno.",
		gen8: {
			desc: "O Pokémon na posição do usuário rouba 1/8 do HP máximo do alvo, arredondado para baixo, ao final de cada turno. Se quem recebe o HP estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sendo drenado. Se o alvo sair de campo ou usar Rapid Spin com sucesso, o efeito termina. Pokémon do tipo Grass são imunes a este golpe no uso, mas não ao seu efeito.",
		},
		gen3: {
			desc: "O Pokémon na posição do usuário rouba 1/8 do HP máximo do alvo, arredondado para baixo, ao final de cada turno. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar continuará sendo drenado. Se o alvo sair de campo ou usar Rapid Spin, o efeito termina. Pokémon do tipo Grass são imunes a este golpe no uso, mas não ao seu efeito.",
		},
		gen1: {
			desc: "Ao final de cada turno do alvo, o Pokémon na posição do usuário rouba 1/16 do HP máximo do alvo, arredondado para baixo e multiplicado pelo contador atual de Toxic do alvo, se houver, mesmo que o alvo tenha menos HP restante do que essa quantidade. Se o alvo sair de campo ou qualquer Pokémon usar Haze, este efeito termina. Pokémon do tipo Grass são imunes a este golpe.",
			shortDesc: "1/16 do HP do alvo vai para o usuário a cada turno.",
		},
		start: "  {POKEMON} foi semeado!",
		end: "  {POKEMON} se livrou de Leech Seed!",
		damage: "  A energia de {POKEMON} foi drenada por Leech Seed!",
	},
	leer: {
		desc: "Diminui a Defesa do alvo em 1 estágio.",
		shortDesc: "Diminui a Defesa do(s) oponente(s) em 1.",
		gen2: {
			shortDesc: "Diminui a Defesa do alvo em 1.",
		},
	},
	letssnuggleforever: {
		shortDesc: "Sem efeito adicional.",
	},
	lick: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar o alvo.",
	},
	lifedew: {
		desc: "Cada Pokémon do lado do usuário recupera 1/4 do seu HP máximo, arredondado para cima a partir da metade.",
		shortDesc: "Cura o usuário e os aliados em 1/4 do HP máximo.",
	},
	lightofruin: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "1/2 de dano de recuo.",
	},
	lightscreen: {
		desc: "Por 5 turnos, o usuário e os membros da sua equipe sofrem 0,5× de dano de ataques especiais, ou 0,66× em batalhas Duplas. O dano não é reduzido ainda mais com Aurora Veil. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break, Psychic Fangs ou Defog. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha se o efeito já estiver ativo no lado do usuário.",
		shortDesc: "Por 5 turnos, o dano especial aos aliados cai à metade.",
		gen6: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe sofrem 0,5× de dano de ataques especiais, ou 0,66× em batalhas Duplas ou Triplas. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break ou Defog. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen4: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe sofrem 1/2 do dano de ataques especiais, ou 2/3 se houver vários Pokémon em campo no lado do usuário. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break ou Defog. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen3: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe sofrem 1/2 do dano de ataques especiais, ou 2/3 se houver vários Pokémon em campo no lado do usuário. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen2: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe têm a Defesa Especial dobrada. Acertos críticos ignoram este efeito. Falha se o efeito já estiver ativo no lado do usuário.",
			shortDesc: "Por 5 turnos, a equipe do usuário tem Sp. Def dobrada.",
		},
		gen1: {
			desc: "Enquanto o usuário permanecer em campo, seu Especial é dobrado ao receber dano. Acertos críticos ignoram este efeito. Se qualquer Pokémon usar Haze, este efeito termina.",
			shortDesc: "Em campo, o Especial do usuário é 2× ao sofrer dano.",
			start: "  {POKEMON} está protegido contra ataques especiais!",
		},
		start: "  Light Screen deixou {TEAM} mais resistente contra golpes especiais!",
		end: "  O efeito de Light Screen de {TEAM} acabou!",
	},
	lightthatburnsthesky: {
		desc: "Este golpe se torna um ataque físico se o Ataque do usuário for maior que seu Ataque Especial, incluindo mudanças de estágio de atributos. Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Físico se Atk > Sp. Atk do usuário. Ignora habilidades.",
	},
	liquidation: {
		desc: "Tem 20% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "20% de chance de diminuir a Defesa do alvo em 1.",
	},
	lockon: {
		desc: "Até o fim do próximo turno, o alvo não pode evitar os golpes do usuário, mesmo que esteja no meio de um golpe de dois turnos. O efeito termina se o usuário ou o alvo sair de campo. Falha se este efeito estiver ativo para o usuário.",
		shortDesc: "O próximo golpe do usuário não errará o alvo.",
		gen4: {
			desc: "Até o fim do próximo turno, o alvo não pode evitar os golpes do usuário, mesmo que esteja no meio de um golpe de dois turnos. Quando este efeito é iniciado contra o alvo, os efeitos deste golpe e de Mind Reader terminam para todos os outros Pokémon contra esse alvo. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continua sob este efeito. Se o usuário sair de campo usando Baton Pass, este efeito é reiniciado contra o mesmo alvo para o Pokémon que entrar no lugar. O efeito termina se o usuário ou o alvo sair de campo.",
		},
		gen2: {
			desc: "A próxima verificação de precisão contra o alvo é bem-sucedida. O alvo ainda evitará Earthquake, Fissure e Magnitude se estiver usando Fly. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continua sob este efeito. Este efeito termina quando o alvo sai de campo ou quando uma verificação de precisão é feita contra ele.",
			shortDesc: "O próximo golpe não errará o alvo.",
		},
		start: "  {SOURCE} mirou em {POKEMON}!",
	},
	lovelykiss: {
		shortDesc: "Faz o alvo adormecer.",
	},
	lowkick: {
		desc: "O poder deste golpe é 20 se o alvo pesar menos de 10 kg, 40 se pesar menos de 25 kg, 60 se pesar menos de 50 kg, 80 se pesar menos de 100 kg, 100 se pesar menos de 200 kg e 120 se pesar 200 kg ou mais.",
		shortDesc: "Mais poder quanto mais pesado for o alvo.",
		gen2: {
			desc: "Tem 30% de chance de fazer o alvo recuar.",
			shortDesc: "30% de chance de fazer o alvo recuar.",
		},
	},
	lowsweep: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Velocidade do alvo em 1.",
	},
	luckychant: {
		desc: "Por 5 turnos, o usuário e os membros da sua equipe não podem sofrer acertos críticos. Falha se o efeito já estiver ativo no lado do usuário.",
		shortDesc: "Por 5 turnos, protege a equipe de acertos críticos.",
		start: "  Lucky Chant protegeu {TEAM} de acertos críticos!",
		end: "  O efeito de Lucky Chant de {TEAM} acabou!",
	},
	luminacrash: {
		desc: "Tem 100% de chance de diminuir a Defesa Especial do alvo em 2 estágios.",
		shortDesc: "100% de chance de diminuir a Sp. Def do alvo em 2.",
	},
	lunarblessing: {
		desc: "Cada Pokémon do lado do usuário recupera 1/4 do seu HP máximo, arredondado para cima a partir da metade, e tem sua condição de status curada.",
		shortDesc: "Usuário e aliados: curam 1/4 do HP máx. e status.",
	},
	lunardance: {
		desc: "O usuário desmaia e, se o Pokémon que entrar em seu lugar não estiver com o HP ou o PP cheios ou tiver uma condição de status não volátil, ele tem o HP e o PP totalmente restaurados e qualquer condição de status não volátil curada. O novo Pokémon entra ao final do turno, e a cura acontece antes que as armadilhas de campo façam efeito. Este efeito continua até que um Pokémon que atenda a qualquer uma dessas condições entre em campo na posição do usuário ou seja trocado para essa posição com Ally Switch. Falha se o usuário for o último Pokémon não desmaiado da sua equipe.",
		shortDesc: "Usuário desmaia. Próximo ferido: cura total e PP cheio.",
		gen7: {
			desc: "O usuário desmaia, e o Pokémon que entrar em seu lugar tem o HP e o PP totalmente restaurados e qualquer condição de status não volátil curada. O novo Pokémon entra ao final do turno, e a cura acontece antes que as armadilhas de campo façam efeito. Falha se o usuário for o último Pokémon não desmaiado da sua equipe.",
			shortDesc: "Usuário desmaia. Quem entra é curado, com PP.",
		},
		gen4: {
			desc: "O usuário desmaia, e o Pokémon que entrar em seu lugar tem o HP e o PP totalmente restaurados e qualquer condição de status não volátil curada. O novo Pokémon entra imediatamente, e a cura acontece depois que as armadilhas de campo fazem efeito. Falha se o usuário for o último Pokémon não desmaiado da sua equipe.",
		},
		heal: "  {POKEMON} foi envolto por um luar místico!",
	},
	lunge: {
		desc: "Tem 100% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Ataque do alvo em 1.",
	},
	lusterpurge: {
		desc: "Tem 50% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	machpunch: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	magicalleaf: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	magicaltorque: {
		desc: "Tem 30% de chance de confundir o alvo.",
		shortDesc: "30% de chance de confundir o alvo.",
	},
	magiccoat: {
		desc: "Até o fim do turno, o usuário não é afetado por certos golpes que não causam dano direcionados a ele e, em vez disso, usará esses golpes contra quem os usou originalmente. Golpes refletidos dessa forma não podem ser refletidos de novo por este efeito ou pelo efeito da habilidade Magic Bounce. Spikes, Stealth Rock, Sticky Web e Toxic Spikes só podem ser refletidos uma vez por lado, pelo Pokémon mais à esquerda sob este efeito ou o da habilidade Magic Bounce. As habilidades Lightning Rod e Storm Drain redirecionam seus respectivos golpes antes que este golpe faça efeito.",
		shortDesc: "Reflete certos golpes que não causam dano.",
		gen5: {
			desc: "Até o fim do turno, o usuário não é afetado por certos golpes que não causam dano direcionados a ele e, em vez disso, usará esses golpes contra quem os usou originalmente. Golpes refletidos dessa forma não podem ser refletidos de novo por este efeito ou pelo efeito da habilidade Magic Bounce. Spikes, Stealth Rock e Toxic Spikes só podem ser refletidos uma vez por lado, pelo Pokémon mais à esquerda sob este efeito ou o da habilidade Magic Bounce. As habilidades Lightning Rod e Storm Drain redirecionam seus respectivos golpes antes que este golpe faça efeito.",
		},
		gen4: {
			desc: "O usuário não é afetado por certos golpes que não causam dano direcionados a ele e, em vez disso, usará esses golpes contra quem os usou originalmente. Se o golpe tiver como alvo ambos os Pokémon adversários, o Pokémon sob este efeito refletirá o golpe tendo como alvo apenas quem o usou originalmente. O efeito termina quando um golpe é refletido ou ao fim do turno. As habilidades Lightning Rod e Storm Drain redirecionam seus respectivos golpes antes que este golpe faça efeito.",
		},
		gen3: {
			desc: "O usuário não é afetado por certos golpes que não causam dano direcionados a ele e, em vez disso, usará esses golpes contra quem os usou originalmente. Se o golpe tiver como alvo ambos os Pokémon adversários e o Pokémon sob este efeito estiver do lado esquerdo, ele refletirá o golpe tendo como alvo ambos os Pokémon adversários, e seu aliado não será afetado pelo golpe original; caso contrário, se o Pokémon sob este efeito estiver do lado direito, seu aliado será afetado pelo golpe original e este Pokémon refletirá o golpe tendo como alvo apenas quem o usou originalmente. O efeito termina quando um golpe é refletido ou ao fim do turno. Golpes refletidos dessa forma podem ser refletidos de novo por outro Pokémon sob este efeito. Se o usuário tiver a habilidade Soundproof, ela anula golpes sonoros antes que este efeito aconteça. A habilidade Lightning Rod redireciona golpes do tipo Electric antes que este golpe faça efeito.",
		},
		start: "  {POKEMON} se envolveu com Magic Coat!",
		move: "{POKEMON} refletiu {MOVE} de volta!",
	},
	magicpowder: {
		desc: "Faz o alvo se tornar do tipo Psychic. Falha se o alvo for Arceus ou Silvally, se o alvo já for puramente do tipo Psychic ou se o alvo estiver Terastalizado.",
		shortDesc: "Torna o alvo do tipo Psychic.",
		gen8: {
			desc: "Faz o alvo se tornar do tipo Psychic. Falha se o alvo for Arceus ou Silvally, ou se o alvo já for puramente do tipo Psychic.",
		},
	},
	magicroom: {
		desc: "Por 5 turnos, os itens segurados de todos os Pokémon em campo não têm efeito. O efeito de um item de causar mudanças de forma não é afetado, mas quaisquer outros efeitos desses itens são anulados. Durante o efeito, todos os Pokémon em campo ficam impedidos de usar Fling e Natural Gift. Se este golpe for usado durante o efeito, o efeito termina.",
		shortDesc: "Por 5 turnos, nenhum item segurado tem efeito.",
	},
	magmastorm: {
		desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo por quatro ou cinco turnos; sete turnos se o usuário estiver segurando Grip Claw. Causa ao alvo dano igual a 1/16 do seu HP máximo (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		start: "  {POKEMON} ficou preso no magma em turbilhão!",
	},
	magnetbomb: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	magneticflux: {
		desc: "Aumenta a Defesa e a Defesa Especial dos Pokémon do lado do usuário com as habilidades Plus ou Minus em 1 estágio.",
		shortDesc: "+1 Def e Sp. Def em aliados com Plus/Minus.",
	},
	magnetrise: {
		desc: "Por 5 turnos, o usuário fica imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes, Sticky Web e da habilidade Arena Trap enquanto permanecer em campo. Se o usuário usar Baton Pass, o Pokémon que entrar no lugar receberá o efeito. Ingrain, Smack Down, Thousand Arrows e Iron Ball se sobrepõem a este golpe se o usuário estiver sob qualquer um de seus efeitos. Falha se o usuário já estiver sob este efeito ou sob os efeitos de Ingrain, Smack Down ou Thousand Arrows.",
		shortDesc: "Por 5 turnos, o usuário fica imune ao tipo Ground.",
		gen5: {
			desc: "Por 5 turnos, o usuário fica imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes e da habilidade Arena Trap enquanto permanecer em campo. Se o usuário usar Baton Pass, o Pokémon que entrar no lugar receberá o efeito. Ingrain, Smack Down e Iron Ball se sobrepõem a este golpe se o usuário estiver sob qualquer um de seus efeitos. Falha se o usuário já estiver sob este efeito ou sob os efeitos de Ingrain ou Smack Down.",
		},
		gen4: {
			desc: "Por 5 turnos, o usuário fica imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes e da habilidade Arena Trap enquanto permanecer em campo. Se o usuário usar Baton Pass, o Pokémon que entrar no lugar receberá o efeito. Ingrain e Iron Ball se sobrepõem a este golpe se o usuário estiver sob qualquer um de seus efeitos. Falha se o usuário já estiver sob este efeito ou sob o efeito de Ingrain.",
		},
		start: "  {POKEMON} levitou com eletromagnetismo!",
		end: "  O eletromagnetismo de {POKEMON} acabou!",
	},
	magnitude: {
		desc: "O poder deste golpe varia: 5% de chance para cada poder 10 e 150, 10% para cada poder 30 e 110, 20% para cada poder 50 e 90, e 30% para poder 70. O dano dobra se o alvo estiver usando Dig.",
		shortDesc: "Atinge Pokémon adjacentes. Poder varia; 2× em Dig.",
		gen4: {
			desc: "O poder deste golpe varia: 5% de chance para cada poder 10 e 150, 10% para cada poder 30 e 110, 20% para cada poder 50 e 90, e 30% para poder 70. O poder dobra se o alvo estiver usando Dig.",
		},
		activate: "  Magnitude {NUMBER}!",
	},
	makeitrain: {
		desc: "Diminui o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "Diminui o Sp. Atk do usuário em 1. Atinge oponente(s).",
		champions: {
			desc: "Diminui o Ataque Especial do usuário em 2 estágios.",
			shortDesc: "Diminui o Sp. Atk do usuário em 2. Atinge oponente(s).",
		},
	},
	maliciousmoonsault: {
		desc: "O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "O dano dobra se o alvo tiver usado Minimize.",
	},
	malignantchain: {
		desc: "Tem 50% de chance de envenenar gravemente o alvo.",
		shortDesc: "50% de chance de envenenar gravemente o alvo.",
	},
	matblock: {
		desc: "O usuário e os membros da sua equipe ficam protegidos de ataques que causam dano feitos por outros Pokémon, inclusive aliados, neste turno. Falha se não for o primeiro turno do usuário em campo, se o usuário for o último a agir neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		shortDesc: "Protege aliados de ataques com dano. Só no 1º turno.",
		start: "  {POKEMON} pretende levantar um tatame para bloquear os ataques!",
		block: "  {MOVE} foi bloqueado pelo tatame levantado!",
	},
	matchagotcha: {
		desc: "Tem 20% de chance de queimar o alvo. O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo na metade exata. O alvo descongela se estiver congelado.",
		shortDesc: "20% queima. Recupera 50% do dano. Descongela alvo(s).",
	},
	maxairstream: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Velocidade de cada Pokémon do lado do usuário aumenta em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Aliados: +1 Velocidade.",
	},
	maxdarkness: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Defesa Especial de cada Pokémon do lado adversário diminui em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1 Sp. Def.",
	},
	maxflare: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o sol começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia sol.",
	},
	maxflutterby: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o Ataque Especial de cada Pokémon do lado adversário diminui em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1 Sp. Atk.",
	},
	maxgeyser: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a chuva começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia chuva.",
	},
	maxguard: {
		desc: "O usuário fica protegido de quase todos os ataques feitos por outros Pokémon neste turno, incluindo Max Moves e G-Max Moves. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada uso bem-sucedido deste golpe. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário for o último a agir neste turno.",
		shortDesc: "Protege de golpes e Max Moves neste turno.",
		activate: "  {POKEMON} se protegeu!",
	},
	maxhailstorm: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o granizo começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia granizo.",
	},
	maxknuckle: {
		desc: "Aumenta o Ataque do usuário e de seus aliados em 1 estágio. O poder base acompanha o poder base do golpe base. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Aliados: +1 Ataque.",
	},
	maxlightning: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Electric Terrain começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia Electric Terrain.",
	},
	maxmindstorm: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Psychic Terrain começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia Psychic Terrain.",
	},
	maxooze: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o Ataque Especial de cada Pokémon do lado do usuário aumenta em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Aliados: +1 Sp. Atk.",
	},
	maxovergrowth: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Grassy Terrain começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia Grassy Terrain.",
	},
	maxphantasm: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Defesa de cada Pokémon do lado adversário diminui em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1 Defesa.",
	},
	maxquake: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Defesa Especial de cada Pokémon do lado do usuário aumenta em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Aliados: +1 Sp. Def.",
	},
	maxrockfall: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a tempestade de areia começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia tempestade de areia.",
	},
	maxstarfall: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o efeito de Misty Terrain começa. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Inicia Misty Terrain.",
	},
	maxsteelspike: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Defesa de cada Pokémon do lado do usuário aumenta em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Aliados: +1 Defesa.",
	},
	maxstrike: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, a Velocidade de cada Pokémon do lado adversário diminui em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1 Velocidade.",
	},
	maxwyrmwind: {
		desc: "O poder é igual ao poder de Max Move do golpe base. Se este golpe for bem-sucedido, o Ataque de cada Pokémon do lado adversário diminui em 1 estágio, mesmo que tenha um substituto. Este efeito não ocorre se o usuário não estiver em Dynamax. Se este golpe for usado como golpe base, ele causa dano com poder 0.",
		shortDesc: "Poder vem do golpe base. Oponentes: -1 Ataque.",
	},
	meanlook: {
		desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Impede o alvo de sair de campo.",
		gen7: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo, a menos que ele use Baton Pass, caso em que o alvo continuará preso.",
		},
		gen3: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se usar Baton Pass. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo, a menos que ele use Baton Pass, caso em que o alvo continuará preso.",
		},
	},
	meditate: {
		desc: "Aumenta o Ataque do usuário em 1 estágio.",
		shortDesc: "Aumenta o Ataque do usuário em 1.",
	},
	mefirst: {
		desc: "O usuário usa contra o alvo o golpe que o alvo escolheu para este turno, se possível, com o poder multiplicado por 1,5. O golpe deve ser um golpe que causa dano, exceto Beak Blast, Belch, Blazing Torque, Combat Torque, Comeuppance, Counter, Covet, Focus Punch, Magical Torque, Me First, Metal Burst, Mirror Coat, Noxious Torque, Shell Trap, Struggle, Thief ou Wicked Torque. Falha se o alvo agir antes do usuário. Ignora o substituto do alvo para fins de copiar o golpe.",
		shortDesc: "Copia golpe do oponente a 1,5×. Precisa agir antes.",
		gen8: {
			desc: "O usuário usa contra o alvo o golpe que o alvo escolheu para este turno, se possível, com o poder multiplicado por 1,5. O golpe deve ser um golpe que causa dano, exceto Beak Blast, Belch, Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Shell Trap, Struggle ou Thief. Falha se o alvo agir antes do usuário. Ignora o substituto do alvo para fins de copiar o golpe.",
		},
		gen7: {
			desc: "O usuário usa contra o alvo o golpe que o alvo escolheu para este turno, se possível, com o poder multiplicado por 1,5. O golpe deve ser um golpe que causa dano, exceto Beak Blast, Belch, Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Shell Trap, Struggle, Thief ou qualquer Z-Move. Falha se o alvo agir antes do usuário. Ignora o substituto do alvo para fins de copiar o golpe.",
		},
		gen6: {
			desc: "O usuário usa contra o alvo o golpe que o alvo escolheu para este turno, se possível, com o poder multiplicado por 1,5. O golpe deve ser um golpe que causa dano, exceto Belch, Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Struggle ou Thief. Falha se o alvo agir antes do usuário. Ignora o substituto do alvo para fins de copiar o golpe.",
		},
		gen5: {
			desc: "O usuário usa contra o alvo o golpe que o alvo escolheu para este turno, se possível, com o poder multiplicado por 1,5. O golpe deve ser um golpe que causa dano, exceto Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Struggle ou Thief. Falha se o alvo agir antes do usuário. Ignora o substituto do alvo para fins de copiar o golpe.",
		},
		gen4: {
			desc: "O usuário usa contra o alvo o golpe que o alvo escolheu para este turno, se possível, com o poder multiplicado por 1,5. O golpe deve ser um golpe que causa dano, exceto Chatter, Counter, Covet, Focus Punch, Me First, Mirror Coat, Struggle ou Thief. Falha se o alvo agir antes do usuário. Ignora o substituto do alvo para fins de copiar o golpe.",
		},
	},
	megadrain: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo até a metade.",
		shortDesc: "O usuário recupera 50% do dano causado.",
		gen4: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo.",
		},
		gen3: {
			desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para baixo.",
		},
	},
	megahorn: {
		shortDesc: "Sem efeito adicional.",
	},
	megakick: {
		shortDesc: "Sem efeito adicional.",
	},
	megapunch: {
		shortDesc: "Sem efeito adicional.",
	},
	memento: {
		desc: "Diminui o Ataque e o Ataque Especial do alvo em 2 estágios. O usuário desmaia, a menos que este golpe erre ou não haja alvo. Falha completamente se este golpe atingir um substituto, mas não falha se os atributos do alvo não puderem ser alterados.",
		shortDesc: "Diminui Atk e Sp. Atk do alvo em 2. Usuário desmaia.",
		gen4: {
			desc: "Diminui o Ataque e o Ataque Especial do alvo em 2 estágios. O usuário desmaia, mesmo que este golpe erre. Este golpe pode atingir alvos no meio de um golpe de dois turnos. Falha completamente se não houver alvo, mas não falha se os atributos do alvo não puderem ser alterados.",
		},
		gen3: {
			desc: "Diminui o Ataque e o Ataque Especial do alvo em 2 estágios. O usuário desmaia. Este golpe não verifica a precisão e pode atingir alvos no meio de um golpe de dois turnos. Falha completamente se os estágios de Ataque e de Ataque Especial do alvo estiverem ambos em -6.",
		},
		heal: "  O HP de {POKEMON} foi restaurado pelo Z-Power!",
	},
	menacingmoonrazemaelstrom: {
		desc: "Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Ignora as habilidades de outros Pokémon.",
	},
	metalburst: {
		desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico ou especial neste turno, igual a 1,5 vez o HP perdido pelo usuário com esse ataque, arredondado para baixo. Se o usuário não perdeu HP com esse ataque, este golpe causa 1 HP de dano em vez disso. Se a posição desse Pokémon adversário não estiver mais em uso e houver outro Pokémon adversário em campo, o dano é causado a ele em vez disso. Apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque físico ou especial de um Pokémon adversário neste turno.",
		shortDesc: "Se sofrer um ataque, devolve 1,5× o dano.",
		gen6: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico ou especial neste turno, igual a 1,5 vez o HP perdido pelo usuário com esse ataque, arredondado para baixo. Se o usuário não perdeu HP com esse ataque, este golpe causa dano com poder 1 em vez disso. Se a posição desse Pokémon adversário não estiver mais em uso, o dano é causado a um Pokémon adversário aleatório ao alcance. Apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque físico ou especial de um Pokémon adversário neste turno.",
		},
		gen4: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque físico ou especial neste turno, igual a 1,5 vez o HP perdido pelo usuário com esse ataque, arredondado para baixo. Se a posição desse Pokémon adversário não estiver mais em uso e houver outro Pokémon adversário em campo, o dano é causado a ele em vez disso. Apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque físico ou especial de um Pokémon adversário neste turno, ou se o usuário não perdeu HP com o ataque.",
		},
	},
	metalclaw: {
		desc: "Tem 10% de chance de aumentar o Ataque do usuário em 1 estágio.",
		shortDesc: "10% de chance de aumentar o Ataque do usuário em 1.",
	},
	metalsound: {
		desc: "Diminui a Defesa Especial do alvo em 2 estágios.",
		shortDesc: "Diminui a Sp. Def do alvo em 2.",
	},
	meteorassault: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "O usuário não pode agir no próximo turno.",
	},
	meteorbeam: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. Aumenta o Ataque Especial do usuário em 1 estágio no primeiro turno. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Aumenta o Sp. Atk em 1 no turno 1. Ataca no turno 2.",
		prepare: "{POKEMON} está transbordando de energia espacial!",
	},
	meteormash: {
		desc: "Tem 20% de chance de aumentar o Ataque do usuário em 1 estágio.",
		shortDesc: "20% de chance de aumentar o Ataque do usuário em 1.",
	},
	metronome: {
		desc: "Um golpe aleatório é selecionado para uso, exceto After You, Apple Acid, Armor Cannon, Assist, Astral Barrage, Aura Wheel, Baneful Bunker, Beak Blast, Behemoth Bash, Behemoth Blade, Belch, Bestow, Blazing Torque, Body Press, Branch Poke, Breaking Swipe, Celebrate, Chatter, Chilling Water, Chilly Reception, Clangorous Soul, Collision Course, Combat Torque, Comeuppance, Copycat, Counter, Covet, Crafty Shield, Decorate, Destiny Bond, Detect, Diamond Storm, Doodle, Double Iron Bash, Double Shock, Dragon Ascent, Dragon Energy, Drum Beating, Dynamax Cannon, Electro Drift, Endure, Eternabeam, False Surrender, Feint, Fiery Wrath, Fillet Away, Fleur Cannon, Focus Punch, Follow Me, Freeze Shock, Freezing Glare, Glacial Lance, Grav Apple, Helping Hand, Hold Hands, Hyper Drill, Hyperspace Fury, Hyperspace Hole, Ice Burn, Instruct, Jet Punch, Jungle Healing, King's Shield, Life Dew, Light of Ruin, Magical Torque, Make It Rain, Mat Block, Me First, Meteor Assault, Metronome, Mimic, Mind Blown, Mirror Coat, Mirror Move, Moongeist Beam, Nature Power, Nature's Madness, Noxious Torque, Obstruct, Order Up, Origin Pulse, Overdrive, Photon Geyser, Plasma Fists, Population Bomb, Pounce, Power Shift, Precipice Blades, Protect, Pyro Ball, Quash, Quick Guard, Rage Fist, Rage Powder, Raging Bull, Raging Fury, Relic Song, Revival Blessing, Ruination, Salt Cure, Secret Sword, Shed Tail, Shell Trap, Silk Trap, Sketch, Sleep Talk, Snap Trap, Snarl, Snatch, Snore, Snowscape, Spectral Thief, Spicy Extract, Spiky Shield, Spirit Break, Spotlight, Springtide Storm, Steam Eruption, Steel Beam, Strange Steam, Struggle, Sunsteel Strike, Surging Strikes, Switcheroo, Techno Blast, Tera Starstorm, Thief, Thousand Arrows, Thousand Waves, Thunder Cage, Thunderous Kick, Tidy Up, Trailblaze, Transform, Trick, Twin Beam, V-create, Wicked Blow, Wicked Torque ou Wide Guard.",
		shortDesc: "Escolhe um golpe aleatório.",
		gen8bdsp: {
			desc: "Um golpe aleatório é selecionado para uso, exceto After You, Belch, Body Press, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Dragon Ascent, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Life Dew, Metronome, Mimic, Mirror Coat, Nature Power, Origin Pulse, Precipice Blades, Protect, Quash, Quick Guard, Rage Powder, Sketch, Sleep Talk, Snarl, Snore, Spiky Shield, Struggle, Switcheroo, Thief, Transform, Trick ou Wide Guard.",
		},
		gen8: {
			desc: "Um golpe aleatório é selecionado para uso, exceto After You, Apple Acid, Assist, Astral Barrage, Aura Wheel, Baneful Bunker, Beak Blast, Behemoth Bash, Behemoth Blade, Belch, Bestow, Body Press, Branch Poke, Breaking Swipe, Celebrate, Chatter, Clangorous Soul, Copycat, Counter, Covet, Crafty Shield, Decorate, Destiny Bond, Detect, Diamond Storm, Double Iron Bash, Dragon Ascent, Dragon Energy, Dragon Hammer, Drum Beating, Dynamax Cannon, Endure, Eternabeam, False Surrender, Feint, Fiery Wrath, Fleur Cannon, Focus Punch, Follow Me, Freeze Shock, Freezing Glare, Glacial Lance, Grav Apple, Helping Hand, Hold Hands, Hyperspace Fury, Hyperspace Hole, Ice Burn, Instruct, Jungle Healing, King's Shield, Life Dew, Light of Ruin, Mat Block, Me First, Meteor Assault, Metronome, Mimic, Mind Blown, Mirror Coat, Mirror Move, Moongeist Beam, Nature Power, Nature's Madness, Obstruct, Origin Pulse, Overdrive, Photon Geyser, Plasma Fists, Precipice Blades, Protect, Pyro Ball, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Shell Trap, Sketch, Sleep Talk, Snap Trap, Snarl, Snatch, Snore, Spectral Thief, Spiky Shield, Spirit Break, Spotlight, Steam Eruption, Steel Beam, Strange Steam, Struggle, Sunsteel Strike, Surging Strikes, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Thunder Cage, Thunderous Kick, Transform, Trick, V-create, Wicked Blow ou Wide Guard.",
		},
		gen7letsgo: {
			desc: "Um golpe aleatório introduzido na gen 1 é selecionado para uso, exceto Counter, Mimic, Mirror Move, Struggle ou Transform.",
			shortDesc: "Escolhe um golpe aleatório da gen 1.",
		},
		gen7: {
			desc: "Um golpe aleatório é selecionado para uso, exceto After You, Assist, Baneful Bunker, Beak Blast, Belch, Bestow, Celebrate, Chatter, Copycat, Counter, Covet, Crafty Shield, Destiny Bond, Detect, Diamond Storm, Dragon Ascent, Endure, Feint, Fleur Cannon, Focus Punch, Follow Me, Freeze Shock, Helping Hand, Hold Hands, Hyperspace Fury, Hyperspace Hole, Ice Burn, Instruct, King's Shield, Light of Ruin, Mat Block, Me First, Metronome, Mimic, Mind Blown, Mirror Coat, Mirror Move, Nature Power, Origin Pulse, Photon Geyser, Plasma Fists, Precipice Blades, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Shell Trap, Sketch, Sleep Talk, Snarl, Snatch, Snore, Spectral Thief, Spiky Shield, Spotlight, Steam Eruption, Struggle, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Transform, Trick, V-create ou Wide Guard.",
		},
		gen6: {
			desc: "Um golpe aleatório é selecionado para uso, exceto After You, Assist, Belch, Bestow, Celebrate, Chatter, Copycat, Counter, Covet, Crafty Shield, Destiny Bond, Detect, Diamond Storm, Dragon Ascent, Endure, Feint, Focus Punch, Follow Me, Freeze Shock, Helping Hand, Hold Hands, Hyperspace Fury, Hyperspace Hole, Ice Burn, King's Shield, Light of Ruin, Mat Block, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Origin Pulse, Precipice Blades, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Sketch, Sleep Talk, Snarl, Snatch, Snore, Spiky Shield, Steam Eruption, Struggle, Switcheroo, Techno Blast, Thief, Thousand Arrows, Thousand Waves, Transform, Trick, V-create ou Wide Guard.",
		},
		gen5: {
			desc: "Um golpe aleatório é selecionado para uso, exceto After You, Assist, Bestow, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Freeze Shock, Helping Hand, Ice Burn, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Nature Power, Protect, Quash, Quick Guard, Rage Powder, Relic Song, Secret Sword, Sketch, Sleep Talk, Snarl, Snatch, Snore, Struggle, Switcheroo, Techno Blast, Thief, Transform, Trick, V-create ou Wide Guard.",
		},
		gen4: {
			desc: "Um golpe aleatório é selecionado para uso, exceto Assist, Chatter, Copycat, Counter, Covet, Destiny Bond, Detect, Endure, Feint, Focus Punch, Follow Me, Helping Hand, Me First, Metronome, Mimic, Mirror Coat, Mirror Move, Protect, Sketch, Sleep Talk, Snatch, Struggle, Switcheroo, Thief, Trick ou qualquer golpe que o usuário já conheça.",
		},
		gen3: {
			desc: "Um golpe aleatório é selecionado para uso, exceto Counter, Covet, Destiny Bond, Detect, Endure, Focus Punch, Follow Me, Helping Hand, Metronome, Mimic, Mirror Coat, Protect, Sketch, Sleep Talk, Snatch, Struggle, Thief ou Trick.",
		},
		gen2: {
			desc: "Um golpe aleatório é selecionado para uso, exceto Counter, Destiny Bond, Detect, Endure, Metronome, Mimic, Mirror Coat, Protect, Sketch, Sleep Talk, Struggle, Thief ou qualquer golpe que o usuário já conheça.",
		},
		gen1: {
			desc: "Um golpe aleatório é selecionado para uso, exceto Metronome ou Struggle.",
		},
		move: "Balançando o dedo, ele usou {MOVE}!",
	},
	mightycleave: {
		shortDesc: "Atravessa proteções sem quebrá-las.",
	},
	milkdrink: {
		desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade.",
		shortDesc: "Cura o usuário em 50% do seu HP máximo.",
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo.",
		},
	},
	mimic: {
		desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado, se o usuário já conhecer o golpe ou se o golpe for Assist, Behemoth Bash, Behemoth Blade, Belch, Blazing Torque, Celebrate, Chatter, Combat Torque, Copycat, Dynamax Cannon, Hold Hands, Magical Torque, Me First, Metronome, Mimic, Mirror Move, Nature Power, Noxious Torque, Sketch, Sleep Talk, Struggle, Tera Starstorm, Transform ou Wicked Torque.",
		shortDesc: "O último golpe usado pelo alvo substitui este.",
		gen8: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado, se o usuário já conhecer o golpe ou se o golpe for Behemoth Bash, Behemoth Blade, Chatter, Dynamax Cannon, Mimic, Sketch, Struggle, Transform ou qualquer Max Move ou G-Max Move.",
		},
		gen7: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado, se o usuário já conhecer o golpe ou se o golpe for Chatter, Mimic, Sketch, Struggle, Transform ou qualquer Z-Move.",
		},
		gen6: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado, se o usuário já conhecer o golpe ou se o golpe for Chatter, Mimic, Sketch, Struggle ou Transform.",
		},
		gen4: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem 5 PP. Falha se o alvo ainda não agiu, se o usuário estiver transformado, se o usuário já conhecer o golpe ou se o golpe for Chatter, Metronome, Mimic, Sketch ou Struggle.",
		},
		gen3: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem 5 PP. Falha se o alvo ainda não agiu, se o usuário estiver transformado, se o usuário já conhecer o golpe ou se o golpe for Metronome, Mimic, Sketch ou Struggle.",
		},
		gen2: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído pelo último golpe usado pelo alvo. O golpe copiado tem 5 PP. Falha se o alvo ainda não agiu, se o usuário já conhecer o golpe ou se o golpe for Struggle.",
		},
		gen1: {
			desc: "Enquanto o usuário permanecer em campo, este golpe é substituído por um golpe aleatório conhecido pelo alvo, mesmo que o usuário já conheça esse golpe. O golpe copiado mantém o PP restante deste golpe, independentemente do PP máximo do golpe copiado. Sempre que um PP é gasto com o golpe copiado, um PP é gasto deste golpe.",
			shortDesc: "Um golpe aleatório do alvo substitui este.",
		},
		start: "  {POKEMON} aprendeu {MOVE}!",
	},
	mindblown: {
		desc: "Sendo este golpe bem-sucedido ou não, e mesmo que isso o faça desmaiar, o usuário perde 1/2 do seu HP máximo, arredondado para cima, a menos que tenha a habilidade Magic Guard. Este golpe é impedido de ser executado e o usuário não perde HP se qualquer Pokémon em campo tiver a habilidade Damp, ou se este golpe for do tipo Fire e o usuário estiver sob o efeito de Powder ou o clima for chuva forte.",
		shortDesc: "Usuário perde 50% do HP máx. Atinge Pokémon adjacentes.",
		damage: "  ({POKEMON} sacrificou o próprio HP para fortalecer seu golpe!)",
	},
	mindreader: {
		desc: "Até o final do próximo turno, o alvo não pode evitar os golpes do usuário, mesmo que esteja no meio de um golpe de dois turnos. O efeito termina se o usuário ou o alvo sair de campo. Falha se este efeito já estiver ativo para o usuário.",
		shortDesc: "O próximo golpe do usuário não errará o alvo.",
		gen4: {
			desc: "Até o final do próximo turno, o alvo não pode evitar os golpes do usuário, mesmo que esteja no meio de um golpe de dois turnos. Quando este efeito começa contra o alvo, os efeitos deste golpe e de Lock-On terminam para todos os outros Pokémon contra esse alvo. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continua sob este efeito. Se o usuário sair de campo usando Baton Pass, este efeito é reiniciado contra o mesmo alvo para o Pokémon que entrar no lugar. O efeito termina se o usuário ou o alvo sair de campo.",
		},
		gen2: {
			desc: "A próxima verificação de precisão contra o alvo é bem-sucedida. O alvo ainda evita Earthquake, Fissure e Magnitude se estiver usando Fly. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continua sob este efeito. Este efeito termina quando o alvo sai de campo ou quando uma verificação de precisão é feita contra ele.",
			shortDesc: "O próximo golpe não errará o alvo.",
		},
	},
	minimize: {
		desc: "Aumenta a evasão do usuário em 2 estágios. Tendo a evasão do usuário mudado ou não, Body Slam, Dragon Rush, Flying Press, Heat Crash, Heavy Slam, Malicious Moonsault, Steamroller, Stomp e Supercell Slam não verificam a precisão e causam o dobro de dano se usados contra o usuário enquanto ele estiver em campo.",
		shortDesc: "Aumenta a evasão do usuário em 2.",
		gen8: {
			desc: "Aumenta a evasão do usuário em 2 estágios. Tendo a evasão do usuário mudado ou não, Body Slam, Dragon Rush, Flying Press, Heat Crash, Heavy Slam, Malicious Moonsault, Steamroller e Stomp não verificam a precisão e causam o dobro de dano se usados contra o usuário enquanto ele estiver em campo.",
		},
		gen6: {
			desc: "Aumenta a evasão do usuário em 2 estágios. Tendo a evasão do usuário mudado ou não, Body Slam, Dragon Rush, Flying Press, Heat Crash, Phantom Force, Shadow Force, Steamroller e Stomp não verificam a precisão e causam o dobro de dano se usados contra o usuário enquanto ele estiver em campo.",
		},
		gen5: {
			desc: "Aumenta a evasão do usuário em 2 estágios. Tendo a evasão do usuário mudado ou não, Stomp e Steamroller causam o dobro de dano se usados contra o usuário enquanto ele estiver em campo.",
		},
		gen4: {
			desc: "Aumenta a evasão do usuário em 1 estágio. Tendo a evasão do usuário mudado ou não, Stomp tem o poder dobrado se usado contra o usuário enquanto ele estiver em campo.",
			shortDesc: "Aumenta a evasão do usuário em 1.",
		},
		gen3: {
			desc: "Aumenta a evasão do usuário em 1 estágio. Tendo a evasão do usuário mudado ou não, Astonish, Extrasensory, Needle Arm e Stomp causam o dobro de dano se usados contra o usuário enquanto ele estiver em campo.",
		},
		gen2: {
			desc: "Aumenta a evasão do usuário em 1 estágio. Tendo a evasão do usuário mudado ou não, Stomp tem o poder dobrado se usado contra o usuário enquanto ele estiver em campo. Baton Pass pode ser usado para transferir este efeito a um aliado.",
		},
		gen1: {
			desc: "Aumenta a evasão do usuário em 1 estágio.",
		},
	},
	miracleeye: {
		desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele se for maior que 0, e ataques do tipo Psychic podem atingi-lo se ele for do tipo Dark. Falha se o alvo já estiver afetado, ou se estiver afetado por Foresight ou Odor Sleuth.",
		shortDesc: "Ignora evasão; o tipo Psychic atinge o tipo Dark.",
		gen4: {
			desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele se for maior que 0, e ataques do tipo Psychic podem atingi-lo se ele for do tipo Dark.",
		},
	},
	mirrorcoat: {
		desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque especial neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se o usuário não perdeu HP com o ataque, este golpe causa 1 HP de dano em vez disso. Se a posição desse Pokémon adversário não estiver mais em uso e houver outro Pokémon adversário em campo, o dano é causado a ele em vez disso. Apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque especial de um Pokémon adversário neste turno.",
		shortDesc: "Se sofrer ataque especial, devolve o dobro do dano.",
		gen6: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque especial neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se o usuário não perdeu HP com o ataque, este golpe causa dano com poder 1 em vez disso. Se a posição desse Pokémon adversário não estiver mais em uso, o dano é causado a um Pokémon adversário aleatório ao alcance. Apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque especial de um Pokémon adversário neste turno.",
		},
		gen4: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque especial neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se a posição desse Pokémon adversário não estiver mais em uso e houver outro Pokémon adversário em campo, o dano é causado a ele em vez disso. Apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque especial de um Pokémon adversário neste turno, ou se o usuário não perdeu HP com o ataque.",
		},
		gen3: {
			desc: "Causa dano ao último Pokémon adversário que atingiu o usuário com um ataque especial neste turno, igual ao dobro do HP perdido pelo usuário com esse ataque. Se a posição desse Pokémon adversário não estiver mais em uso e houver outro Pokémon adversário em campo, o dano é causado a ele em vez disso. Este golpe considera Hidden Power como do tipo Normal, e apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário não foi atingido por um ataque especial de um Pokémon adversário neste turno, ou se o usuário não perdeu HP com o ataque.",
		},
		gen2: {
			desc: "Causa ao Pokémon adversário dano igual ao dobro do HP perdido pelo usuário com um ataque especial neste turno. Este golpe considera Hidden Power como do tipo Normal, e apenas o último acerto de um ataque de múltiplos acertos é contado. Falha se o usuário agir primeiro, se o usuário não foi atingido por um ataque especial neste turno ou se o usuário não perdeu HP com o ataque.",
		},
	},
	mirrormove: {
		desc: "O usuário usa o último golpe usado pelo alvo. O golpe copiado é usado contra esse alvo, se possível. Falha se o alvo ainda não agiu ou se o último golpe usado não puder ser copiado por este golpe.",
		shortDesc: "Usa contra o alvo o último golpe que ele usou.",
		gen4: {
			desc: "O usuário usa o último golpe que o teve como alvo com sucesso. O golpe copiado é usado sem alvo específico. Falha se nenhum golpe teve o usuário como alvo, se o golpe foi chamado por outro golpe, se o golpe for Encore ou se o golpe não puder ser copiado por este golpe.",
		},
		gen3: {
			desc: "O usuário usa o último golpe que o teve como alvo com sucesso. O golpe copiado é usado sem alvo específico. Falha se nenhum golpe teve o usuário como alvo, se o golpe errou, falhou ou não teve efeito no usuário, ou se o golpe não puder ser copiado por este golpe.",
		},
		gen2: {
			desc: "O usuário usa o último golpe usado pelo alvo. Falha se o alvo não agiu desde que o usuário entrou em campo, ou se o último golpe usado foi Metronome, Mimic, Mirror Move, Sketch, Sleep Talk, Transform ou qualquer golpe que o usuário conheça.",
		},
		gen1: {
			desc: "O usuário usa o último golpe usado pelo alvo. Falha se o alvo não agiu desde que o usuário entrou em campo, ou se o último golpe usado foi Mirror Move.",
		},
	},
	mirrorshot: {
		desc: "Tem 30% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "30% de chance de diminuir a precisão do alvo em 1.",
	},
	mist: {
		desc: "Por 5 turnos, o usuário e os membros da sua equipe ficam protegidos contra a redução de seus estágios de atributo por outros Pokémon. Falha se o efeito já estiver ativo no lado do usuário.",
		shortDesc: "Por 5 turnos, protege a equipe de reduções de atributo.",
		gen2: {
			desc: "Enquanto o usuário permanecer em campo, ele fica protegido contra a redução de seus estágios de atributo por outros Pokémon. Falha se o usuário já tiver o efeito. Baton Pass pode ser usado para transferir este efeito a um aliado.",
			shortDesc: "Em campo, usuário é imune a reduções de atributo.",
			start: "  {POKEMON} está envolto em MIST!",
			block: "  {POKEMON} está protegido por MIST.",
		},
		gen1: {
			desc: "Enquanto o usuário permanecer em campo, ele fica protegido contra a redução de seus estágios de atributo por outros Pokémon, a menos que seja causada pelo efeito secundário de um golpe. Falha se o usuário já tiver o efeito. Se qualquer Pokémon usar Haze, este efeito termina.",
			start: "  {POKEMON} está envolto em névoa!",
			block: "  Mas falhou!",
		},
		start: "  A névoa envolveu {TEAM}!",
		end: "  A névoa não protege mais {TEAM}!",
		block: "  {POKEMON} está protegido pela névoa!",
	},
	mistball: {
		desc: "Tem 50% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir o Sp. Atk do alvo em 1.",
	},
	mistyexplosion: {
		desc: "Se o terreno atual for Misty Terrain e o usuário estiver no chão, o poder deste golpe é multiplicado por 1,5. O usuário desmaia após usar este golpe, mesmo que ele falhe por não ter alvo. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
		shortDesc: "Usuário desmaia. Usuário no Misty Terrain: 1,5× poder.",
	},
	mistyterrain: {
		desc: "Por 5 turnos, o terreno se torna Misty Terrain. Durante o efeito, o poder dos ataques do tipo Dragon usados contra Pokémon no chão é multiplicado por 0,5, e Pokémon no chão não podem receber condição de status não volátil nem confusão. Pokémon no chão podem ser afetados por Yawn, mas não adormecem pelo seu efeito. Camouflage transforma o usuário em tipo Fairy, Nature Power se torna Moonblast e Secret Power tem 30% de chance de diminuir o Ataque Especial em 1 estágio. Falha se o terreno atual for Misty Terrain.",
		shortDesc: "5 turnos. No chão: sem status, -poder do tipo Dragon.",
		gen6: {
			desc: "Por 5 turnos, o terreno se torna Misty Terrain. Durante o efeito, o poder dos ataques do tipo Dragon usados contra Pokémon no chão é multiplicado por 0,5, e Pokémon no chão não podem receber condição de status não volátil. Pokémon no chão podem ser afetados por Yawn, mas não adormecem pelo seu efeito. Camouflage transforma o usuário em tipo Fairy, Nature Power se torna Moonblast e Secret Power tem 30% de chance de diminuir o Ataque Especial em 1 estágio. Falha se o terreno atual for Misty Terrain.",
		},
	},
	moonblast: {
		desc: "Tem 30% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "30% de chance de diminuir o Sp. Atk do alvo em 1.",
		champions: {
			desc: "Tem 10% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
			shortDesc: "10% de chance de diminuir o Sp. Atk do alvo em 1.",
		},
	},
	moongeistbeam: {
		desc: "Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Ignora as habilidades de outros Pokémon.",
	},
	moonlight: {
		desc: "O usuário recupera 1/2 do seu HP máximo se houver ventos fortes ou nenhuma condição climática ou se estiver segurando Utility Umbrella, 2/3 do seu HP máximo se o clima for sol intenso ou sol, e 1/4 do seu HP máximo se o clima for chuva forte, chuva, tempestade de areia ou neve, sempre arredondado para baixo até a metade.",
		shortDesc: "Cura o usuário em quantidade que depende do clima.",
		gen8: {
			desc: "O usuário recupera 1/2 do seu HP máximo se houver ventos fortes ou nenhuma condição climática ou se estiver segurando Utility Umbrella, 2/3 do seu HP máximo se o clima for sol intenso ou sol, e 1/4 do seu HP máximo se o clima for granizo, chuva forte, chuva ou tempestade de areia, sempre arredondado para baixo até a metade.",
		},
		gen7: {
			desc: "O usuário recupera 1/2 do seu HP máximo se houver ventos fortes ou nenhuma condição climática, 2/3 do seu HP máximo se o clima for sol intenso ou sol, e 1/4 do seu HP máximo se o clima for granizo, chuva forte, chuva ou tempestade de areia, sempre arredondado para baixo até a metade.",
		},
		gen5: {
			desc: "O usuário recupera 1/2 do seu HP máximo se não houver nenhuma condição climática, 2/3 do seu HP máximo se o clima for sol, e 1/4 do seu HP máximo se o clima for granizo, chuva ou tempestade de areia, sempre arredondado para baixo até a metade.",
		},
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo se não houver nenhuma condição climática, 2/3 do seu HP máximo se o clima for sol, e 1/4 do seu HP máximo se o clima for granizo, chuva ou tempestade de areia, sempre arredondado para baixo.",
		},
		gen2: {
			desc: "O usuário recupera 1/2 do seu HP máximo se não houver nenhuma condição climática, todo o seu HP se o clima for sol, e 1/4 do seu HP máximo se o clima for chuva ou tempestade de areia, sempre arredondado para baixo.",
		},
	},
	morningsun: {
		desc: "O usuário recupera 1/2 do seu HP máximo se houver ventos fortes ou nenhuma condição climática ou se estiver segurando Utility Umbrella, 2/3 do seu HP máximo se o clima for sol intenso ou sol, e 1/4 do seu HP máximo se o clima for chuva forte, chuva, tempestade de areia ou neve, sempre arredondado para baixo até a metade.",
		shortDesc: "Cura o usuário em quantidade que depende do clima.",
		gen8: {
			desc: "O usuário recupera 1/2 do seu HP máximo se houver ventos fortes ou nenhuma condição climática ou se estiver segurando Utility Umbrella, 2/3 do seu HP máximo se o clima for sol intenso ou sol, e 1/4 do seu HP máximo se o clima for granizo, chuva forte, chuva ou tempestade de areia, sempre arredondado para baixo até a metade.",
		},
		gen7: {
			desc: "O usuário recupera 1/2 do seu HP máximo se houver ventos fortes ou nenhuma condição climática, 2/3 do seu HP máximo se o clima for sol intenso ou sol, e 1/4 do seu HP máximo se o clima for granizo, chuva forte, chuva ou tempestade de areia, sempre arredondado para baixo até a metade.",
		},
		gen5: {
			desc: "O usuário recupera 1/2 do seu HP máximo se não houver nenhuma condição climática, 2/3 do seu HP máximo se o clima for sol, e 1/4 do seu HP máximo se o clima for granizo, chuva ou tempestade de areia, sempre arredondado para baixo até a metade.",
		},
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo se não houver nenhuma condição climática, 2/3 do seu HP máximo se o clima for sol, e 1/4 do seu HP máximo se o clima for granizo, chuva ou tempestade de areia, sempre arredondado para baixo.",
		},
		gen2: {
			desc: "O usuário recupera 1/2 do seu HP máximo se não houver nenhuma condição climática, todo o seu HP se o clima for sol, e 1/4 do seu HP máximo se o clima for chuva ou tempestade de areia, sempre arredondado para baixo.",
		},
	},
	mortalspin: {
		desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, os efeitos de Leech Seed e de golpes de aprisionamento terminam para o usuário, e todas as armadilhas de campo são removidas do lado do usuário. Tem 100% de chance de envenenar o alvo.",
		shortDesc: "Envenena oponentes; remove hazards/prisão/Leech Seed.",
	},
	mountaingale: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	mudbomb: {
		desc: "Tem 30% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "30% de chance de diminuir a precisão do alvo em 1.",
	},
	muddywater: {
		desc: "Tem 30% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "30% de chance de -1 na precisão do(s) oponente(s).",
	},
	mudshot: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Velocidade do alvo em 1.",
	},
	mudslap: {
		desc: "Tem 100% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a precisão do alvo em 1.",
	},
	mudsport: {
		desc: "Por 5 turnos, todos os ataques do tipo Electric usados por qualquer Pokémon em campo têm o poder multiplicado por 0,33. Falha se este efeito já estiver ativo.",
		shortDesc: "Por 5 turnos, golpes do tipo Electric têm 1/3 do poder.",
		gen5: {
			desc: "Enquanto o usuário estiver em campo, todos os ataques do tipo Electric usados por qualquer Pokémon em campo têm o poder multiplicado por 0,33. Falha se este efeito já estiver ativo para qualquer Pokémon.",
			shortDesc: "Reduz ataques do tipo Electric a 1/3 do poder.",
		},
		gen4: {
			desc: "Enquanto o usuário estiver em campo, todos os ataques do tipo Electric usados por qualquer Pokémon em campo têm o poder reduzido à metade. Falha se este efeito já estiver ativo para o usuário. Baton Pass pode ser usado para transferir este efeito a um aliado.",
			shortDesc: "Reduz ataques do tipo Electric a 1/2 do poder.",
		},
	},
	multiattack: {
		desc: "O tipo deste golpe depende da Memory segurada pelo usuário.",
		shortDesc: "O tipo varia conforme a Memory segurada.",
	},
	mysticalfire: {
		desc: "Tem 100% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Sp. Atk do alvo em 1.",
	},
	mysticalpower: {
		desc: "Tem 100% de chance de aumentar o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "100% de chance de aumentar o Sp. Atk do usuário em 1.",
	},
	nastyplot: {
		desc: "Aumenta o Ataque Especial do usuário em 2 estágios.",
		shortDesc: "Aumenta o Sp. Atk do usuário em 2.",
	},
	naturalgift: {
		desc: "O tipo e o poder deste golpe dependem da Berry segurada pelo usuário, e a Berry é perdida. Falha se o usuário não estiver segurando uma Berry, se tiver a habilidade Klutz, ou se Embargo ou Magic Room estiver em efeito para o usuário.",
		shortDesc: "Poder e tipo dependem da Berry do usuário.",
		gen4: {
			desc: "O tipo e o poder deste golpe dependem da Berry segurada pelo usuário, e a Berry é perdida. Falha se o usuário não estiver segurando uma Berry, se tiver a habilidade Klutz ou se Embargo estiver em efeito para o usuário.",
		},
	},
	naturepower: {
		desc: "Este golpe chama outro golpe para uso conforme o terreno da batalha: Tri Attack no terreno padrão de Wi-Fi, Thunderbolt durante Electric Terrain, Moonblast durante Misty Terrain, Energy Ball durante Grassy Terrain e Psychic durante Psychic Terrain.",
		shortDesc: "O ataque depende do terreno (padrão: Tri Attack).",
		gen6: {
			desc: "Este golpe chama outro golpe para uso conforme o terreno da batalha: Tri Attack no terreno padrão de Wi-Fi, Thunderbolt durante Electric Terrain, Moonblast durante Misty Terrain e Energy Ball durante Grassy Terrain.",
		},
		gen5: {
			desc: "Este golpe chama outro golpe para uso conforme o terreno da batalha: Earthquake no terreno padrão de Wi-Fi.",
			shortDesc: "O ataque muda conforme o terreno. (Earthquake)",
		},
		gen4: {
			desc: "Este golpe chama outro golpe para uso conforme o terreno da batalha: Tri Attack em batalhas Wi-Fi.",
			shortDesc: "O ataque muda conforme o terreno. (Tri Attack)",
		},
		gen3: {
			desc: "Este golpe chama outro golpe para uso conforme o terreno da batalha: Swift em batalhas Wi-Fi.",
			shortDesc: "O ataque muda conforme o terreno. (Swift)",
		},
		move: "Nature Power se transformou em {MOVE}!",
	},
	naturesmadness: {
		desc: "Causa ao alvo dano igual à metade do seu HP atual, arredondado para baixo, mas não menos que 1 HP.",
		shortDesc: "Causa dano igual a 1/2 do HP atual do alvo.",
	},
	needlearm: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
		gen3: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra se o alvo tiver usado Minimize enquanto em campo.",
		},
	},
	neverendingnightmare: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	nightdaze: {
		desc: "Tem 40% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "40% de chance de diminuir a precisão do alvo em 1.",
	},
	nightmare: {
		desc: "Faz o alvo perder 1/4 do seu HP máximo, arredondado para baixo, ao final de cada turno enquanto estiver dormindo. Este golpe não afeta o alvo a menos que ele esteja dormindo. O efeito termina quando o alvo acorda, mesmo que adormeça de novo no mesmo turno.",
		shortDesc: "Alvo dormindo perde 1/4 do HP máx. por turno.",
		start: "  {POKEMON} começou a ter um pesadelo!",
		damage: "  {POKEMON} está preso em um pesadelo!",
	},
	nightshade: {
		desc: "Causa ao alvo dano igual ao nível do usuário.",
		shortDesc: "Causa dano igual ao nível do usuário.",
		gen1: {
			desc: "Causa ao alvo dano igual ao nível do usuário. Este golpe ignora imunidades de tipo.",
			shortDesc: "Dano = nível do usuário. Atinge o tipo Normal.",
		},
	},
	nightslash: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	nobleroar: {
		desc: "Diminui o Ataque e o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "Diminui o Ataque e o Sp. Atk do alvo em 1.",
	},
	noretreat: {
		desc: "Aumenta o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio, mas ele fica impedido de sair de campo. O usuário ainda pode sair de campo se usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. Falha se o usuário já estiver impedido de trocar por este efeito.",
		shortDesc: "+1 em todos os atributos (não acc/eva). Prende usuário.",
		start: "  {POKEMON} não pode mais fugir porque usou No Retreat!",
	},
	noxioustorque: {
		desc: "Tem 30% de chance de envenenar o alvo.",
		shortDesc: "30% de chance de envenenar o alvo.",
	},
	nuzzle: {
		desc: "Tem 100% de chance de paralisar o alvo.",
		shortDesc: "100% de chance de paralisar o alvo.",
	},
	oblivionwing: {
		desc: "O usuário recupera 3/4 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo até a metade.",
		shortDesc: "O usuário recupera 75% do dano causado.",
	},
	obstruct: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm a Defesa diminuída em 2 estágios. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		shortDesc: "Protege de ataques que causam dano. Contato: -2 Def.",
		gen8: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm a Defesa diminuída em 2 estágios. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
	},
	oceanicoperetta: {
		shortDesc: "Sem efeito adicional.",
	},
	octazooka: {
		desc: "Tem 50% de chance de diminuir a precisão do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a precisão do alvo em 1.",
	},
	octolock: {
		desc: "Impede o alvo de sair de campo. Ao final de cada turno durante o efeito, a Defesa e a Defesa Especial do alvo diminuem em 1 estágio. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Prende o alvo e diminui Def e SpD em 1 a cada turno.",
		start: "  {POKEMON} não pode mais fugir por causa de Octolock!",
	},
	odorsleuth: {
		desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele se for maior que 0, e ataques dos tipos Normal e Fighting podem atingi-lo se ele for do tipo Ghost. Falha se o alvo já estiver afetado, ou se estiver afetado por Foresight ou Miracle Eye.",
		shortDesc: "Ignora evasão; tipos Normal/Fighting acertam tipo Ghost.",
		gen4: {
			desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele se for maior que 0, e ataques dos tipos Normal e Fighting podem atingi-lo se ele for do tipo Ghost.",
		},
		gen3: {
			desc: "Enquanto o alvo permanecer em campo, seu estágio de evasão é ignorado nas verificações de precisão contra ele, e ataques dos tipos Normal e Fighting podem atingi-lo se ele for do tipo Ghost.",
		},
	},
	ominouswind: {
		desc: "Tem 10% de chance de aumentar o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio.",
		shortDesc: "10% de chance: +1 em todos os atributos (não acc/eva).",
	},
	orderup: {
		desc: "Se um Tatsugiri aliado tiver ativado sua habilidade Commander, este golpe aumenta o Ataque do usuário em 1 estágio se o Tatsugiri for Curly Form, a Defesa em 1 estágio se for Droopy Form, ou a Velocidade em 1 estágio se for Stretchy Form. O efeito ocorre mesmo que o Tatsugiri que ativou o efeito tenha desmaiado depois.",
		shortDesc: "Engoliu Curly|Droopy|Stretchy: +1 Atk|Def|Spe.",
	},
	originpulse: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge os oponentes adjacentes.",
	},
	outrage: {
		desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk e o usuário estiver dormindo, o golpe é usado por um turno e não deixa o usuário confuso.",
		shortDesc: "Dura 2-3 turnos. Depois, deixa o usuário confuso.",
		gen6: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário adjacente aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen4: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso ao final do último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen3: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso ao final do último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, adormecer, ficar congelado, ou se o ataque não for bem-sucedido contra o alvo, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen2: {
			desc: "Sendo este golpe bem-sucedido ou não, o usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, mesmo que já esteja confuso. Se o usuário for impedido de agir, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
	},
	overdrive: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge o(s) oponente(s).",
	},
	overheat: {
		desc: "Diminui o Ataque Especial do usuário em 2 estágios.",
		shortDesc: "Diminui o Sp. Atk do usuário em 2.",
	},
	painsplit: {
		desc: "O HP do usuário e o do alvo passam a ser a média dos HP atuais de ambos, arredondada para baixo, mas não mais que o HP máximo de cada um.",
		shortDesc: "Divide igualmente o HP do usuário e do alvo.",
		activate: "  Os combatentes dividiram a dor!",
	},
	paleowave: {
		desc: "Tem 20% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "20% de chance de diminuir o Ataque do alvo em 1.",
	},
	paraboliccharge: {
		desc: "O usuário recupera 1/2 do HP perdido pelo alvo, arredondado para cima a partir da metade. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado para baixo até a metade.",
		shortDesc: "O usuário recupera 50% do dano causado.",
	},
	partingshot: {
		desc: "Diminui o Ataque e o Ataque Especial do alvo em 1 estágio. Se este golpe for bem-sucedido, o usuário sai de campo mesmo que esteja preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se os estágios de Ataque e de Ataque Especial do alvo não tiverem mudado, ou se não houver membros da equipe que não tenham desmaiado.",
		shortDesc: "Diminui Atk e Sp. Atk do alvo em 1. Usuário troca.",
		gen6: {
			desc: "Diminui o Ataque e o Ataque Especial do alvo em 1 estágio. Se este golpe for bem-sucedido, o usuário sai de campo mesmo que esteja preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado.",
		},
	},
	payback: {
		desc: "O poder dobra se o usuário agir depois do alvo neste turno, incluindo ações feitas por meio de Instruct ou da habilidade Dancer. Entrar em campo não conta como ação.",
		shortDesc: "O poder dobra se o usuário agir depois do alvo.",
		gen6: {
			desc: "O poder dobra se o usuário agir depois do alvo neste turno. Entrar em campo não conta como ação.",
		},
		gen4: {
			desc: "O poder dobra se o usuário agir depois do alvo neste turno. Entrar em campo conta como ação.",
		},
	},
	payday: {
		desc: "Sem efeito adicional.",
		shortDesc: "Espalha moedas.",
		activate: "  Moedas se espalharam por todo lado!",
	},
	peck: {
		shortDesc: "Sem efeito adicional.",
	},
	perishsong: {
		desc: "Cada Pokémon em campo recebe uma contagem de perecimento de 4, se ainda não tiver uma. Ao final de cada turno, incluindo o turno em que o golpe foi usado, a contagem de todos os Pokémon em campo diminui em 1, e os Pokémon desmaiam se o número chegar a 0. A contagem é removida dos Pokémon que saem de campo. Se um Pokémon usar Baton Pass enquanto tiver uma contagem, o Pokémon que entrar no lugar recebe a contagem e continua a contagem regressiva.",
		shortDesc: "Todos os Pokémon em campo desmaiarão em 3 turnos.",
		start: "  Todos os Pokémon que ouviram a canção desmaiarão em três turnos!",
		activate: "  A contagem de perecimento de {POKEMON} caiu para {NUMBER}!",
	},
	petalblizzard: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge os Pokémon adjacentes.",
	},
	petaldance: {
		desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk e o usuário estiver dormindo, o golpe é usado por um turno e não deixa o usuário confuso.",
		shortDesc: "Dura 2-3 turnos. Depois, deixa o usuário confuso.",
		gen6: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário adjacente aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen4: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso ao final do último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen3: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso ao final do último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, adormecer, ficar congelado, ou se o ataque não for bem-sucedido contra o alvo, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen2: {
			desc: "Sendo este golpe bem-sucedido ou não, o usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, mesmo que já esteja confuso. Se o usuário for impedido de agir, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não deixa o usuário confuso.",
		},
		gen1: {
			desc: "Sendo este golpe bem-sucedido ou não, o usuário passa três ou quatro turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, mesmo que já esteja confuso. Se o usuário for impedido de agir, o efeito termina sem causar confusão. Durante o efeito, a precisão deste golpe é sobrescrita a cada turno pela precisão calculada atual, incluindo mudanças de estágio de atributo, mas não fica abaixo de 1/256 nem acima de 255/256.",
			shortDesc: "Dura 3-4 turnos. Depois, deixa o usuário confuso.",
		},
	},
	phantomforce: {
		desc: "Se este golpe for bem-sucedido, ele rompe Baneful Bunker, Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno, e outros Pokémon podem atacar o lado do alvo normalmente. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Some no turno 1. Ataca no turno 2. Rompe proteções.",
		gen6: {
			desc: "Se este golpe for bem-sucedido, ele rompe Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno, e outros Pokémon podem atacar o lado do alvo normalmente. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto em campo.",
		},
	},
	photongeyser: {
		desc: "Este golpe se torna um ataque físico se o Ataque do usuário for maior que seu Ataque Especial, incluindo mudanças de estágio de atributo. Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Físico se Atk > Sp. Atk do usuário. Ignora habilidades.",
	},
	pikapapow: {
		desc: "O poder é igual ao maior valor entre (felicidade do usuário × 2/5), arredondado para baixo, e 1.",
		shortDesc: "Felicidade máxima: 102 de poder. Não erra.",
	},
	pinmissile: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estava com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	plasmafists: {
		desc: "Se este golpe for bem-sucedido, faz os golpes do tipo Normal se tornarem do tipo Electric neste turno.",
		shortDesc: "Golpes do tipo Normal viram do tipo Electric no turno.",
	},
	playnice: {
		desc: "Diminui o Ataque do alvo em 1 estágio.",
		shortDesc: "Diminui o Ataque do alvo em 1.",
	},
	playrough: {
		desc: "Tem 10% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir o Ataque do alvo em 1.",
	},
	pluck: {
		desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, ele rouba a Berry segurada pelo alvo, se houver, e a come imediatamente, recebendo seus efeitos mesmo que o item do usuário esteja sendo ignorado. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		shortDesc: "O usuário rouba e come a Berry do alvo.",
		gen4: {
			desc: "O usuário rouba a Berry segurada pelo alvo, se houver, e a come imediatamente, recebendo seus efeitos, a menos que o item do usuário esteja sendo ignorado. Itens perdidos para este golpe podem ser recuperados com Recycle.",
		},
	},
	poisonfang: {
		desc: "Tem 50% de chance de envenenar gravemente o alvo.",
		shortDesc: "50% de chance de envenenar gravemente o alvo.",
		gen5: {
			desc: "Tem 30% de chance de envenenar gravemente o alvo.",
			shortDesc: "30% de chance de envenenar gravemente o alvo.",
		},
	},
	poisongas: {
		desc: "Envenena o alvo.",
		shortDesc: "Envenena o(s) oponente(s).",
		gen2: {
			shortDesc: "Envenena o alvo.",
		},
	},
	poisonjab: {
		desc: "Tem 30% de chance de envenenar o alvo.",
		shortDesc: "30% de chance de envenenar o alvo.",
	},
	poisonpowder: {
		desc: "Envenena o alvo.",
		shortDesc: "Envenena o alvo.",
	},
	poisonsting: {
		desc: "Tem 30% de chance de envenenar o alvo.",
		shortDesc: "30% de chance de envenenar o alvo.",
		gen1: {
			desc: "Tem 20% de chance de envenenar o alvo.",
			shortDesc: "20% de chance de envenenar o alvo.",
		},
	},
	poisontail: {
		desc: "Tem 10% de chance de envenenar o alvo e maior chance de acerto crítico.",
		shortDesc: "Alta taxa de crítico. 10% de chance de envenenar.",
	},
	polarflare: {
		desc: "Tem 10% de chance de congelar o alvo. Este golpe não descongela um alvo congelado. Se este golpe for bem-sucedido em pelo menos um alvo e o usuário for um Ramnarok, ele muda para Radiant Forme se estiver em Dormant Forme, ou muda para Dormant Forme se estiver em Radiant Forme. Essa mudança de forma não ocorre se o Ramnarok tiver a habilidade Sheer Force. A Radiant Forme volta a ser Dormant Forme quando Ramnarok não está em campo.",
		shortDesc: "10% de chance de congelar oponente(s). Ramnarok muda.",
	},
	pollenpuff: {
		desc: "Se o alvo for um aliado, este golpe recupera 1/2 do HP máximo dele, arredondado para baixo, em vez de causar dano.",
		shortDesc: "Se o alvo for aliado, cura 50% do HP máximo dele.",
	},
	poltergeist: {
		shortDesc: "Falha se o alvo não estiver segurando um item.",
		activate: "  {POKEMON} está prestes a ser atacado pelo próprio item, {ITEM}!",
	},
	populationbomb: {
		desc: "Acerta dez vezes. Este golpe verifica a precisão a cada acerto, e o ataque termina se o alvo evitar um acerto. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará dez vezes. Se o usuário estiver segurando Loaded Dice, este golpe acerta de quatro a dez vezes aleatoriamente, sem verificar a precisão entre os acertos.",
		shortDesc: "Acerta 10 vezes. Cada acerto pode errar.",
	},
	pounce: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Velocidade do alvo em 1.",
	},
	pound: {
		shortDesc: "Sem efeito adicional.",
	},
	powder: {
		desc: "Se o alvo usar um golpe do tipo Fire neste turno, o golpe é impedido de ser executado e o alvo perde 1/4 do seu HP máximo, arredondado para cima a partir da metade. Este efeito não ocorre se o golpe do tipo Fire for impedido por Primordial Sea.",
		shortDesc: "Se usar golpe do tipo Fire, alvo perde 1/4 do HP máx.",
		gen6: {
			desc: "Se o alvo usar um golpe do tipo Fire neste turno, o golpe é impedido de ser executado e o alvo perde 1/4 do seu HP máximo, arredondado para cima a partir da metade. Este efeito ocorre antes de o golpe do tipo Fire ser impedido por Primordial Sea.",
		},
		start: "  {POKEMON} está coberto de pó!",
		activate: "  Quando a chama tocou o pó no Pokémon, ele explodiu!",
	},
	powdersnow: {
		desc: "Tem 10% de chance de congelar o alvo.",
		shortDesc: "10% de chance de congelar o(s) oponente(s).",
		gen2: {
			shortDesc: "10% de chance de congelar o alvo.",
		},
	},
	powergem: {
		shortDesc: "Sem efeito adicional.",
	},
	powersplit: {
		desc: "O usuário e o alvo têm seus atributos de Ataque e de Ataque Especial igualados à média dos atributos de Ataque e de Ataque Especial do usuário e do alvo, respectivamente, arredondada para baixo. As mudanças de estágio de atributo não são afetadas.",
		shortDesc: "Tira a média de Ataque e Sp. Atk com o alvo.",
		activate: "  {POKEMON} compartilhou seu poder com o alvo!",
	},
	powerswap: {
		desc: "O usuário troca suas mudanças de estágio de Ataque e de Ataque Especial com as do alvo.",
		shortDesc: "Troca os estágios de Ataque e Sp. Atk com o alvo.",
	},
	powershift: {
		desc: "O usuário troca seus atributos de Ataque e Defesa, e as mudanças de estágio permanecem em seus respectivos atributos. Este golpe pode ser usado de novo para destrocar os atributos. Se o usuário usar Baton Pass, o Pokémon que entrar no lugar terá o Ataque e a Defesa trocados se o efeito estiver ativo. Se os atributos do usuário forem recalculados por mudança de forma enquanto estiverem trocados, este efeito é ignorado, mas continua ativo para fins de Baton Pass.",
		shortDesc: "Troca o Ataque e a Defesa do usuário.",
		start: "  {POKEMON} trocou seus atributos ofensivos pelos defensivos!",
	},
	powertrick: {
		desc: "O usuário troca seus atributos de Ataque e Defesa, e as mudanças de estágio permanecem em seus respectivos atributos. Este golpe pode ser usado de novo para destrocar os atributos. Se o usuário usar Baton Pass, o Pokémon que entrar no lugar terá o Ataque e a Defesa trocados se o efeito estiver ativo. Se os atributos do usuário forem recalculados por mudança de forma enquanto estiverem trocados, este efeito é ignorado, mas continua ativo para fins de Baton Pass.",
		shortDesc: "Troca o Ataque e a Defesa do usuário.",
		start: "  {POKEMON} trocou seu Ataque e sua Defesa!",
	},
	powertrip: {
		desc: "O poder é igual a 20+(X × 20), onde X é o total das mudanças de estágio de atributo do usuário que são maiores que 0.",
		shortDesc: " + 20 de poder por aumento de atributo do usuário.",
	},
	poweruppunch: {
		desc: "Tem 100% de chance de aumentar o Ataque do usuário em 1 estágio.",
		shortDesc: "100% de chance de aumentar o Ataque do usuário em 1.",
	},
	powerwhip: {
		shortDesc: "Sem efeito adicional.",
	},
	precipiceblades: {
		desc: "Sem efeito adicional.",
		shortDesc: "Sem efeito adicional. Atinge os oponentes adjacentes.",
	},
	present: {
		desc: "Se este golpe for bem-sucedido, causa dano ou cura o alvo. 40% de chance de poder 40, 30% de chance de poder 80, 10% de chance de poder 120 e 20% de chance de curar o alvo em 1/4 do seu HP máximo, arredondado para baixo.",
		shortDesc: "Poder 40, 80 ou 120, ou cura 1/4 do HP máx. do alvo.",
		gen2: {
			desc: "Se este golpe for bem-sucedido, causa dano ou cura o alvo. 102/256 de chance de poder 40, 76/256 de chance de poder 80, 26/256 de chance de poder 120 ou 52/256 de chance de curar o alvo em 1/4 do seu HP máximo, arredondado para baixo. Se este golpe causar dano, ele usa uma versão anormal da fórmula de dano, substituindo certos valores. O atributo de Ataque do usuário é substituído por 10 vezes a efetividade deste golpe contra o alvo, o atributo de Defesa do alvo é substituído pelo número de índice do tipo secundário do usuário, e o nível do usuário é substituído pelo número de índice do tipo secundário do alvo. Se um Pokémon não tiver tipo secundário, seu tipo primário é usado. Os números de índice de cada tipo são: tipo Normal: 0, tipo Fighting: 1, tipo Flying: 2, tipo Poison: 3, tipo Ground: 4, tipo Rock: 5, tipo Bug: 7, tipo Ghost: 8, tipo Steel: 9, tipo Fire: 20, tipo Water: 21, tipo Grass: 22, tipo Electric: 23, tipo Psychic: 24, tipo Ice: 25, tipo Dragon: 26, tipo Dark: 27. Se em algum momento houver uma divisão por 0 na fórmula de dano, divide-se por 1 em vez disso.",
		},
	},
	prismaticlaser: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "O usuário não pode agir no próximo turno.",
	},
	protect: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		shortDesc: "Impede que golpes afetem o usuário neste turno.",
		gen8: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
		gen7: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
		gen6: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
		gen5: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure, Protect, Quick Guard ou Wide Guard. Falha se o usuário agir por último neste turno.",
		},
		gen4: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada vez que este golpe é usado com sucesso, até o máximo de 8. X volta a 1 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário agir por último neste turno.",
		},
		gen3: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno. Este golpe tem X/65536 de chance de ser bem-sucedido, onde X começa em 65535 e é reduzido à metade, arredondado para baixo, a cada vez que este golpe é usado com sucesso. Após o quarto uso bem-sucedido seguido, X cai para 118 e continua com valores aparentemente aleatórios de 0 a 65535 nos usos bem-sucedidos seguintes. X volta a 65535 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário agir por último neste turno.",
		},
		gen2: {
			desc: "O usuário fica protegido dos ataques feitos pelo oponente neste turno. Este golpe tem X/255 de chance de ser bem-sucedido, onde X começa em 255 e é reduzido à metade, arredondado para baixo, a cada vez que este golpe é usado com sucesso. X volta a 255 se este golpe falhar ou se o último golpe usado pelo usuário não for Detect, Endure ou Protect. Falha se o usuário tiver um substituto ou agir por último neste turno.",
		},
		start: "  {POKEMON} se protegeu!",
		block: "  {POKEMON} se protegeu!",
	},
	psybeam: {
		desc: "Tem 10% de chance de deixar o alvo confuso.",
		shortDesc: "10% de chance de deixar o alvo confuso.",
	},
	psyblade: {
		desc: "Se o terreno atual for Electric Terrain, o poder deste golpe é multiplicado por 1,5.",
		shortDesc: "Durante Electric Terrain: 1,5× poder.",
	},
	psychic: {
		desc: "Tem 10% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "10% de chance de diminuir a Sp. Def do alvo em 1.",
		gen1: {
			desc: "Tem 33% de chance de diminuir o Especial do alvo em 1 estágio.",
			shortDesc: "33% de chance de diminuir o Especial do alvo em 1.",
		},
	},
	psychicfangs: {
		desc: "Se este ataque não errar, os efeitos de Reflect, Light Screen e Aurora Veil terminam no lado do alvo antes de o dano ser calculado.",
		shortDesc: "Destrói barreiras, a menos que o alvo seja imune.",
	},
	psychicnoise: {
		desc: "Por 2 turnos, o alvo fica impedido de recuperar HP enquanto permanecer em campo. Durante o efeito, golpes de cura e de drenagem não podem ser usados, e habilidades e itens que concedem cura não curam o Pokémon afetado. Se um Pokémon afetado usar Baton Pass, o Pokémon que entrar no lugar continuará incapaz de recuperar HP. Pain Split e a habilidade Regenerator não são afetados.",
		shortDesc: "Por 2 turnos, o alvo fica impedido de se curar.",
	},
	psychicterrain: {
		desc: "Por 5 turnos, o terreno se torna Psychic Terrain. Durante o efeito, o poder dos ataques do tipo Psychic feitos por Pokémon no chão é multiplicado por 1,3, e Pokémon no chão não podem ser atingidos por golpes com prioridade maior que 0, a menos que o alvo seja um aliado. Camouflage transforma o usuário em tipo Psychic, Nature Power se torna Psychic e Secret Power tem 30% de chance de diminuir a Velocidade do alvo em 1 estágio. Falha se o terreno atual for Psychic Terrain.",
		shortDesc: "5 turnos. No chão: +poder tipo Psychic, sem prioridade.",
		gen7: {
			desc: "Por 5 turnos, o terreno se torna Psychic Terrain. Durante o efeito, o poder dos ataques do tipo Psychic feitos por Pokémon no chão é multiplicado por 1,5, e Pokémon no chão não podem ser atingidos por golpes com prioridade maior que 0, a menos que o alvo seja um aliado. Camouflage transforma o usuário em tipo Psychic, Nature Power se torna Psychic e Secret Power tem 30% de chance de diminuir a Velocidade do alvo em 1 estágio. Falha se o terreno atual for Psychic Terrain.",
		},
	},
	psychoboost: {
		desc: "Diminui o Ataque Especial do usuário em 2 estágios.",
		shortDesc: "Diminui o Sp. Atk do usuário em 2.",
	},
	psychocut: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	psychoshift: {
		desc: "A condição de status não volátil do usuário é transferida para o alvo, e o usuário é curado em seguida. Falha se o usuário não tiver condição de status não volátil ou se o alvo já tiver uma.",
		shortDesc: "Transfere o problema de status do usuário ao alvo.",
	},
	psychup: {
		desc: "O usuário copia todas as mudanças de estágio de atributo atuais do alvo.",
		shortDesc: "Copia os estágios de atributo atuais do alvo.",
		gen2: {
			desc: "O usuário copia todas as mudanças de estágio de atributo atuais do alvo. Falha se os estágios de atributo do alvo estiverem em 0.",
		},
	},
	psyshieldbash: {
		desc: "Tem 100% de chance de aumentar a Defesa do usuário em 1 estágio.",
		shortDesc: "100% de chance de aumentar a Defesa do usuário em 1.",
	},
	psyshock: {
		desc: "Causa dano ao alvo com base na Defesa dele em vez da Defesa Especial.",
		shortDesc: "Dano baseado na Defesa do alvo, não na Sp. Def.",
	},
	psystrike: {
		desc: "Causa dano ao alvo com base na Defesa dele em vez da Defesa Especial.",
		shortDesc: "Dano baseado na Defesa do alvo, não na Sp. Def.",
	},
	psywave: {
		desc: "Causa ao alvo dano igual a (nível do usuário) × (X + 50) / 100, onde X é um número aleatório de 0 a 100, arredondado para baixo, mas não menos que 1 HP.",
		shortDesc: "Dano aleatório entre 0,5× e 1,5× o nível do usuário.",
		gen4: {
			desc: "Causa ao alvo dano igual a (nível do usuário) × (X × 10 + 50) / 100, onde X é um número aleatório de 0 a 10, arredondado para baixo, mas não menos que 1 HP.",
		},
		gen2: {
			desc: "Causa ao alvo dano igual a um número aleatório de 1 a (nível do usuário × 1,5 - 1), arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Dano aleatório de 1 a (nível do usuário × 1,5 - 1).",
		},
	},
	pulverizingpancake: {
		shortDesc: "Sem efeito adicional.",
	},
	punishment: {
		desc: "O poder é igual a 60+(X × 20), onde X é o total das mudanças de estágio de atributo do alvo que são maiores que 0, mas não mais que 200 de poder.",
		shortDesc: "Poder 60 +20 para cada aumento de atributo do alvo.",
	},
	purify: {
		desc: "O alvo é curado se tiver uma condição de status não volátil. Se o alvo foi curado, o usuário recupera 1/2 do seu HP máximo, arredondado para baixo.",
		shortDesc: "Cura status do alvo; se curar, usuário recupera 1/2 HP.",
	},
	pursuit: {
		desc: "Se um Pokémon adversário sair de campo neste turno, este golpe atinge esse Pokémon antes que ele saia, mesmo que não fosse o alvo original. Se o usuário agir depois de um oponente que usou Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch, mas não Baton Pass, ele atingirá esse oponente antes que saia de campo. O poder dobra e não há verificação de precisão se o usuário atingir um oponente que está saindo de campo, e o turno do usuário termina; se um oponente desmaiar com isso, o Pokémon que entrar no lugar só fica ativo no final do turno.",
		shortDesc: "Se um oponente estiver saindo, o atinge com 2× poder.",
		gen7: {
			desc: "Se um Pokémon adversário adjacente sair de campo neste turno, este golpe atinge esse Pokémon antes que ele saia, mesmo que não fosse o alvo original. Se o usuário agir depois de um oponente que usou Parting Shot, U-turn ou Volt Switch, mas não Baton Pass, ele atingirá esse oponente antes que saia de campo. O poder dobra e não há verificação de precisão se o usuário atingir um oponente que está saindo de campo, e o turno do usuário termina; se um oponente desmaiar com isso, o Pokémon que entrar no lugar só fica ativo no final do turno.",
		},
		gen5: {
			desc: "Se um Pokémon adversário adjacente sair de campo neste turno, este golpe atinge esse Pokémon antes que ele saia, mesmo que não fosse o alvo original. Se o usuário agir depois de um oponente que usou U-turn ou Volt Switch, mas não Baton Pass, ele atingirá esse oponente antes que saia de campo. O poder dobra e não há verificação de precisão se o usuário atingir um oponente que está saindo de campo, e o turno do usuário termina; se um oponente desmaiar com isso, o Pokémon que entrar no lugar só fica ativo no final do turno.",
		},
		gen4: {
			desc: "Se um Pokémon adversário sair de campo neste turno, este golpe atinge esse Pokémon antes que ele saia, mesmo que não fosse o alvo original. Se o usuário agir depois de um oponente que usou U-turn, mas não Baton Pass, ele atingirá esse oponente antes que saia de campo. O poder dobra e não há verificação de precisão se o usuário atingir um oponente que está saindo de campo, e o turno do usuário termina; se um oponente desmaiar com isso, o Pokémon que entrar no lugar fica ativo imediatamente.",
		},
		gen3: {
			desc: "Se o alvo for um Pokémon adversário e sair de campo neste turno, este golpe atinge esse Pokémon antes que ele saia. O poder dobra e não há verificação de precisão se o usuário atingir um oponente que está saindo de campo, e o turno do usuário termina; se um oponente desmaiar com isso, o Pokémon que entrar no lugar fica ativo imediatamente.",
			shortDesc: "O poder dobra se o oponente-alvo estiver saindo.",
		},
		gen2: {
			desc: "Se o alvo sair de campo neste turno, este golpe o atinge antes que ele saia, com poder dobrado, e o turno do usuário termina.",
			shortDesc: "O poder dobra se o oponente estiver saindo de campo.",
		},
		activate: "  ({TARGET} está sendo recolhido...)",
	},
	pyroball: {
		desc: "Tem 10% de chance de queimar o alvo.",
		shortDesc: "10% de chance de queimar o alvo. Descongela o usuário.",
	},
	quash: {
		desc: "Faz o alvo agir depois de todos os outros Pokémon neste turno, independentemente da prioridade do golpe escolhido. Falha se o alvo já agiu neste turno.",
		shortDesc: "Força o alvo a agir por último neste turno.",
		activate: "  O golpe de {TARGET} foi adiado!",
	},
	quickattack: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	quickguard: {
		desc: "O usuário e os membros da sua equipe ficam protegidos neste turno contra ataques com prioridade original ou alterada maior que 0 feitos por outros Pokémon, incluindo aliados. Este golpe modifica a mesma chance de sucesso de 1/X usada por outros golpes de proteção, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		shortDesc: "Protege aliados de ataques com prioridade neste turno.",
		gen8: {
			desc: "O usuário e os membros da sua equipe ficam protegidos neste turno contra ataques com prioridade original ou alterada maior que 0 feitos por outros Pokémon, incluindo aliados. Este golpe modifica a mesma chance de sucesso de 1/X usada por outros golpes de proteção, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		gen7: {
			desc: "O usuário e os membros da sua equipe ficam protegidos neste turno contra ataques com prioridade original ou alterada maior que 0 feitos por outros Pokémon, incluindo aliados. Este golpe modifica a mesma chance de sucesso de 1/X usada por outros golpes de proteção, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		gen6: {
			desc: "O usuário e os membros da sua equipe ficam protegidos neste turno contra ataques com prioridade original ou alterada maior que 0 feitos por outros Pokémon, incluindo aliados. Este golpe modifica a mesma chance de sucesso de 1/X usada por outros golpes de proteção, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		gen5: {
			desc: "O usuário e os membros da sua equipe ficam protegidos neste turno contra ataques com prioridade original maior que 0 feitos por outros Pokémon, incluindo aliados. Este ataque tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e dobra a cada vez que este golpe é usado com sucesso. X volta a 1 se este ataque falhar ou se o último golpe usado pelo usuário não for Detect, Endure, Protect, Quick Guard ou Wide Guard. Se X for 256 ou mais, este golpe tem 1/(2^32) de chance de ser bem-sucedido. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		start: "  Quick Guard protegeu {TEAM}!",
		block: "  Quick Guard protegeu {POKEMON}!",
	},
	quiverdance: {
		desc: "Aumenta o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio.",
		shortDesc: "Aumenta Sp. Atk, Sp. Def e Velocidade do usuário em 1.",
	},
	rage: {
		desc: "Depois que este golpe é usado com sucesso, o Ataque do usuário aumenta em 1 estágio cada vez que ele é atingido pelo ataque de outro Pokémon, enquanto este golpe continuar sendo escolhido para uso.",
		shortDesc: "Aumenta o Ataque em 1 se for atingido durante o uso.",
		gen3: {
			desc: "Depois que este golpe é usado, e a menos que o alvo tenha se protegido, o Ataque do usuário aumenta em 1 estágio cada vez que ele é atingido pelo ataque de outro Pokémon, enquanto este golpe continuar sendo escolhido para uso.",
		},
		gen2: {
			desc: "Depois que este golpe é usado com sucesso, X começa em 1. O dano deste golpe é multiplicado por X, e sempre que o usuário é atingido pelo Pokémon adversário, X aumenta em 1, até o máximo de 255. X volta a 1 quando o usuário não está mais em campo ou não escolheu este golpe para uso.",
			shortDesc: "Rage seguinte causa mais dano se atingido durante uso.",
		},
		gen1: {
			desc: "Depois que este golpe é usado com sucesso, o usuário usa este golpe automaticamente a cada turno e não pode mais sair de campo. Durante o efeito, o Ataque do usuário aumenta em 1 estágio cada vez que ele é atingido pelo Pokémon adversário, e a precisão deste golpe é sobrescrita a cada turno pela precisão calculada atual, incluindo mudanças de estágio de atributo, mas não fica abaixo de 1/256 nem acima de 255/256.",
			shortDesc: "Dura para sempre. Ataque +1 sempre que for atingido.",
		},
	},
	ragefist: {
		desc: "O poder é igual a 50+(X × 50), onde X é o número total de vezes que o usuário foi atingido por um ataque que causa dano durante a batalha, mesmo que não tenha perdido HP com o ataque. X não pode ser maior que 6 e não é reiniciado ao sair de campo ou desmaiar. Cada acerto de um ataque de múltiplos acertos é contado, mas o dano de confusão não é.",
		shortDesc: "+50 de poder por golpe sofrido. Máx. 6 golpes.",
		champions: {
			desc: "O poder é igual a 50+(X × 50), onde X é o número total de vezes que o usuário foi atingido por um ataque que causa dano durante a batalha, mesmo que não tenha perdido HP com o ataque. X não pode ser maior que 6 e volta a 0 quando o usuário sai de campo. Cada acerto de um ataque de múltiplos acertos é contado, mas o dano de confusão não é.",
			shortDesc: "+50 de poder por golpe sofrido. Máx. 6. Zera ao sair.",
		},
	},
	ragepowder: {
		desc: "Até o final do turno, todos os ataques de alvo único do lado adversário são redirecionados para o usuário. Esses ataques são redirecionados para o usuário antes que possam ser refletidos por Magic Coat ou pela habilidade Magic Bounce, ou atraídos pelas habilidades Lightning Rod ou Storm Drain. Falha se não for uma batalha em Duplas ou Battle Royal. Este efeito é ignorado enquanto o usuário estiver sob o efeito de Sky Drop.",
		shortDesc: "Os golpes dos oponentes miram o usuário neste turno.",
		gen6: {
			desc: "Até o final do turno, todos os ataques de alvo único do lado adversário são redirecionados para o usuário, se estiverem ao alcance. Esses ataques são redirecionados para o usuário antes que possam ser refletidos por Magic Coat ou pela habilidade Magic Bounce, ou atraídos pelas habilidades Lightning Rod ou Storm Drain. Falha se não for uma batalha em Duplas ou Triplas. Este efeito é ignorado enquanto o usuário estiver sob o efeito de Sky Drop.",
		},
	},
	ragingbull: {
		desc: "Se este ataque não errar, os efeitos de Reflect, Light Screen e Aurora Veil terminam no lado do alvo antes de o dano ser calculado. Se a forma atual do usuário for um Tauros de Paldea, o tipo deste golpe muda para corresponder: tipo Fighting para Combat Breed, tipo Fire para Blaze Breed e tipo Water para Aqua Breed.",
		shortDesc: "Destrói barreiras. O tipo depende da forma do usuário.",
		activate: "  {POKEMON} destruiu as proteções de {TEAM}!",
	},
	ragingfury: {
		desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso imediatamente após agir no último turno do efeito, se ainda não estiver. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não for bem-sucedido contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk e o usuário estiver dormindo, o golpe é usado por um turno e não deixa o usuário confuso.",
		shortDesc: "Dura 2-3 turnos. Depois, deixa o usuário confuso.",
	},
	raindance: {
		desc: "Por 5 turnos, o clima se torna chuva. Durante o efeito, o dano dos ataques do tipo Water é multiplicado por 1,5 e o dano dos ataques do tipo Fire é multiplicado por 0,5. Dura 8 turnos se o usuário estiver segurando Damp Rock. Falha se o clima atual for chuva.",
		shortDesc: "Por 5 turnos, a chuva fortalece golpes do tipo Water.",
		gen3: {
			desc: "Por 5 turnos, o clima se torna chuva. Durante o efeito, o dano dos ataques do tipo Water é multiplicado por 1,5 e o dano dos ataques do tipo Fire é multiplicado por 0,5. Falha se o clima atual for chuva.",
		},
		gen2: {
			desc: "Por 5 turnos, o clima se torna chuva, mesmo que o clima atual já seja chuva. Durante o efeito, o dano dos ataques do tipo Water é multiplicado por 1,5 e o dano dos ataques do tipo Fire é multiplicado por 0,5.",
		},
	},
	rapidspin: {
		desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, os efeitos de Leech Seed e de golpes de aprisionamento terminam para o usuário, e todas as armadilhas de campo são removidas do lado do usuário. Tem 100% de chance de aumentar a Velocidade do usuário em 1 estágio.",
		shortDesc: "Livra de hazards/prisão/Leech Seed; +1 Spe.",
		gen7: {
			desc: "Se este golpe for bem-sucedido e o usuário não tiver desmaiado, os efeitos de Leech Seed e de golpes de aprisionamento terminam para o usuário, e todas as armadilhas de campo são removidas do lado do usuário.",
			shortDesc: "Livra o usuário de hazards, prisão e Leech Seed.",
		},
		gen4: {
			desc: "Se este golpe for bem-sucedido, os efeitos de Leech Seed e de golpes de aprisionamento terminam contra o usuário, e todas as armadilhas de campo são removidas do lado do usuário.",
		},
		gen3: {
			desc: "Se este golpe for bem-sucedido, os efeitos de Leech Seed e de golpes de aprisionamento terminam para o usuário, e Spikes é removido do lado do usuário.",
		},
	},
	razorleaf: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de crítico. Atinge os oponentes adjacentes.",
		gen2: {
			shortDesc: "Alta taxa de acerto crítico.",
		},
	},
	razorshell: {
		desc: "Tem 50% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a Defesa do alvo em 1.",
	},
	razorwind: {
		desc: "Tem maior chance de acerto crítico. Este ataque carrega no primeiro turno e é executado no segundo. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Carrega; atinge oponente(s) no turno 2. Crítico alto.",
		gen4: {
			desc: "Tem maior chance de acerto crítico. Este ataque carrega no primeiro turno e é executado no segundo.",
		},
		gen3: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo.",
			shortDesc: "Carrega e atinge o(s) oponente(s) no turno 2.",
		},
		gen2: {
			desc: "Tem maior chance de acerto crítico. Este ataque carrega no primeiro turno e é executado no segundo.",
			shortDesc: "Carrega; atinge o alvo no turno 2. Crítico alto.",
		},
		gen1: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo.",
			shortDesc: "Carrega no turno 1. Ataca no turno 2.",
		},
		prepare: "  {POKEMON} criou um redemoinho de vento!",
	},
	recover: {
		desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade.",
		shortDesc: "Cura o usuário em 50% do seu HP máximo.",
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo.",
		},
		gen1: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo. Falha se (HP máximo do usuário - HP atual do usuário + 1) for divisível por 256.",
		},
	},
	recycle: {
		desc: "O usuário recupera o último item que usou. Falha se o usuário estiver segurando um item, se o usuário não tiver segurado nenhum item, se o item era um Air Balloon estourado, se o item foi pego por um Pokémon com a habilidade Pickup, ou se o item foi perdido para Bug Bite, Corrosive Gas, Covet, Incinerate, Knock Off, Pluck ou Thief. Itens arremessados com Fling podem ser recuperados.",
		shortDesc: "Recupera o último item usado pelo usuário.",
		gen7: {
			desc: "O usuário recupera o último item que usou. Falha se o usuário estiver segurando um item, se o usuário não tiver segurado nenhum item, se o item era um Air Balloon estourado, se o item foi pego por um Pokémon com a habilidade Pickup, ou se o item foi perdido para Bug Bite, Covet, Incinerate, Knock Off, Pluck ou Thief. Itens arremessados com Fling podem ser recuperados.",
		},
		gen4: {
			desc: "O usuário recupera o último item usado por um Pokémon na sua posição atual em campo, mesmo que esse Pokémon não fosse o usuário. Falha se o usuário estiver segurando um item, se nenhum item tiver sido usado na posição do usuário ou se o item foi perdido para Covet, Knock Off ou Thief. Itens arremessados com Fling podem ser recuperados.",
		},
		addItem: "  {POKEMON} encontrou {ITEM}!",
	},
	reflect: {
		desc: "Por 5 turnos, o usuário e os membros da sua equipe recebem 0,5× de dano de ataques físicos, ou 0,66× se for uma batalha em Duplas. O dano não é reduzido ainda mais com Aurora Veil. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break, Psychic Fangs ou Defog. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha se o efeito já estiver ativo no lado do usuário.",
		shortDesc: "Por 5 turnos, o dano físico aos aliados cai à metade.",
		gen6: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe recebem 0,5× de dano de ataques físicos, ou 0,66× se for uma batalha em Duplas ou Triplas. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break ou Defog. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen4: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe recebem 1/2 do dano de ataques físicos, ou 2/3 se houver vários Pokémon em campo no lado do usuário. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break ou Defog. Dura 8 turnos se o usuário estiver segurando Light Clay. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen3: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe recebem 1/2 do dano de ataques físicos, ou 2/3 se houver vários Pokémon em campo no lado do usuário. Acertos críticos ignoram este efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Brick Break. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen2: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe têm a Defesa dobrada. Acertos críticos ignoram este efeito. Falha se o efeito já estiver ativo no lado do usuário.",
			shortDesc: "Por 5 turnos, a equipe do usuário tem Def dobrada.",
		},
		gen1: {
			desc: "Enquanto o usuário permanecer em campo, sua Defesa é dobrada ao receber dano. Acertos críticos ignoram esta proteção. Este efeito pode ser removido por Haze.",
			shortDesc: "Em campo, a Defesa do usuário é dobrada.",
			start: "  {POKEMON} ganhou uma armadura!",
		},
		start: "  Reflect deixou {TEAM} mais resistente a golpes físicos!",
		end: "  O efeito de Reflect de {TEAM} acabou!",
	},
	reflecttype: {
		desc: "Faz os tipos do usuário se tornarem iguais aos tipos atuais do alvo. Se os tipos atuais do alvo incluírem o estado sem tipo e um tipo não adicionado, o estado sem tipo é ignorado. Se os tipos atuais do alvo incluírem o estado sem tipo e um tipo adicionado por Forest's Curse ou Trick-or-Treat, o estado sem tipo é copiado como tipo Normal em vez disso. Falha se o usuário for um Arceus ou um Silvally, se o usuário estiver Terastalizado ou se o alvo estiver apenas no estado sem tipo.",
		shortDesc: "O usuário passa a ter o mesmo tipo do alvo.",
		gen8: {
			desc: "Faz os tipos do usuário se tornarem iguais aos tipos atuais do alvo. Se os tipos atuais do alvo incluírem o estado sem tipo e um tipo não adicionado, o estado sem tipo é ignorado. Se os tipos atuais do alvo incluírem o estado sem tipo e um tipo adicionado por Forest's Curse ou Trick-or-Treat, o estado sem tipo é copiado como tipo Normal em vez disso. Falha se o usuário for um Arceus ou um Silvally, ou se o alvo estiver apenas no estado sem tipo.",
		},
		gen6: {
			desc: "Faz os tipos do usuário se tornarem iguais aos tipos atuais do alvo. Falha se o usuário for um Arceus.",
		},
		typeChange: "  O tipo de {POKEMON} ficou igual ao tipo de {SOURCE}!",
	},
	refresh: {
		desc: "O usuário cura sua queimadura, envenenamento ou paralisia. Falha se o usuário não estiver queimado, envenenado ou paralisado.",
		shortDesc: "O usuário cura queimadura, envenenamento ou paralisia.",
	},
	relicsong: {
		desc: "Tem 10% de chance de fazer o alvo adormecer. Se este golpe for bem-sucedido em pelo menos um alvo e o usuário for um Meloetta, ele muda para Pirouette Forme se estiver em Aria Forme, ou muda para Aria Forme se estiver em Pirouette Forme. Essa mudança de forma não ocorre se o Meloetta tiver a habilidade Sheer Force. A Pirouette Forme volta a ser Aria Forme quando Meloetta não está em campo.",
		shortDesc: "10% de chance de adormecer oponente(s). Meloetta muda.",
	},
	rest: {
		desc: "O usuário adormece pelos próximos dois turnos e recupera todo o seu HP, curando-se de qualquer condição de status não volátil no processo. Falha se o usuário estiver com o HP cheio, se já estiver dormindo ou se outro efeito estiver impedindo o sono.",
		shortDesc: "Usuário dorme 2 turnos; recupera o HP e cura status.",
		gen2: {
			desc: "O usuário adormece pelos próximos dois turnos e recupera todo o seu HP, curando-se de qualquer condição de status não volátil no processo, mesmo que já estivesse dormindo. Falha se o usuário estiver com o HP cheio.",
		},
		gen1: {
			desc: "O usuário adormece pelos próximos dois turnos e recupera todo o seu HP, curando-se de qualquer condição de status não volátil no processo. Isso não remove a penalidade de atributo causada pela queimadura ou pela paralisia do usuário. Falha se o usuário estiver com o HP cheio.",
		},
	},
	retaliate: {
		desc: "O poder dobra se um membro da equipe do usuário desmaiou no turno anterior.",
		shortDesc: "O poder dobra se um aliado desmaiou no turno anterior.",
	},
	return: {
		desc: "O poder é igual ao maior valor entre (felicidade do usuário × 2/5), arredondado para baixo, e 1.",
		shortDesc: "Máx. 102 de poder com felicidade máxima.",
	},
	revelationdance: {
		desc: "O tipo deste golpe depende do tipo primário do usuário. Se o tipo primário do usuário for o estado sem tipo, o tipo deste golpe é o tipo secundário do usuário, se houver; caso contrário, é o tipo adicionado por Forest's Curse ou Trick-or-Treat. Este golpe fica sem tipo se o usuário estiver apenas no estado sem tipo.",
		shortDesc: "O tipo varia conforme o tipo primário do usuário.",
	},
	revenge: {
		desc: "O poder dobra se o usuário foi atingido pelo alvo neste turno.",
		shortDesc: "O poder dobra se o usuário sofrer dano do alvo.",
		gen4: {
			desc: "O poder dobra se o usuário foi atingido por um Pokémon na posição atual do alvo neste turno.",
		},
		gen3: {
			desc: "O dano dobra se o usuário foi atingido por um Pokémon na posição atual do alvo neste turno, e esse Pokémon foi o último a atingir o usuário.",
			shortDesc: "O dano dobra se o usuário for atingido pelo alvo.",
		},
	},
	reversal: {
		desc: "O poder deste golpe é 20 se X for de 33 a 48, 40 se X for de 17 a 32, 80 se X for de 10 a 16, 100 se X for de 5 a 9, 150 se X for de 2 a 4, e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 48 / HP máximo do usuário), arredondado para baixo.",
		shortDesc: "Mais poder quanto menos HP o usuário tiver.",
		gen4: {
			desc: "O poder deste golpe é 20 se X for de 43 a 48, 40 se X for de 22 a 42, 80 se X for de 13 a 21, 100 se X for de 6 a 12, 150 se X for de 2 a 5, e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 64 / HP máximo do usuário), arredondado para baixo.",
		},
		gen3: {
			desc: "O poder deste golpe é 20 se X for de 33 a 48, 40 se X for de 17 a 32, 80 se X for de 10 a 16, 100 se X for de 5 a 9, 150 se X for de 2 a 4, e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 48 / HP máximo do usuário), arredondado para baixo.",
		},
		gen2: {
			desc: "O poder deste golpe é 20 se X for de 33 a 48, 40 se X for de 17 a 32, 80 se X for de 10 a 16, 100 se X for de 5 a 9, 150 se X for de 2 a 4, e 200 se X for 0 ou 1, onde X é igual a (HP atual do usuário × 48 / HP máximo do usuário), arredondado para baixo. Este golpe não aplica variação de dano e não pode ser um acerto crítico.",
		},
	},
	revivalblessing: {
		desc: "Um membro da equipe desmaiado é escolhido e revivido com 1/2 do seu HP máximo, arredondado para baixo. Falha se não houver membros da equipe desmaiados.",
		shortDesc: "Revive um Pokémon desmaiado com 50% do HP.",
		heal: "  {POKEMON} foi revivido e está pronto para lutar de novo!",
	},
	risingvoltage: {
		desc: "Se o terreno atual for Electric Terrain e o alvo estiver no chão, o poder deste golpe é dobrado.",
		shortDesc: "2× poder se o alvo estiver no chão em Electric Terrain.",
	},
	roar: {
		desc: "O alvo é forçado a sair de campo e é substituído por um aliado aleatório que não tenha desmaiado. Falha se o alvo for o último Pokémon não desmaiado da sua equipe, ou se o alvo tiver usado Ingrain antes ou tiver a habilidade Suction Cups.",
		shortDesc: "Força o alvo a trocar por um aliado aleatório.",
		gen4: {
			desc: "O alvo é forçado a sair de campo e é substituído por um aliado aleatório que não tenha desmaiado. Falha se o alvo for o último Pokémon não desmaiado da sua equipe, se o alvo tiver usado Ingrain antes ou tiver a habilidade Suction Cups, ou se o nível do usuário for menor que o do alvo e X × (nível do usuário + nível do alvo) / 256 + 1 for menor ou igual a (nível do alvo / 4), arredondado para baixo, onde X é um número aleatório de 0 a 255.",
		},
		gen2: {
			desc: "O alvo é forçado a sair de campo e é substituído por um aliado aleatório que não tenha desmaiado. Falha se o alvo for o último Pokémon não desmaiado da sua equipe, ou se o usuário agir antes do alvo.",
		},
		gen1: {
			desc: "Sem uso competitivo.",
			shortDesc: "Sem uso competitivo.",
		},
	},
	roaroftime: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "O usuário não pode agir no próximo turno.",
	},
	rockblast: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estava com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes.",
		},
	},
	rockclimb: {
		desc: "Tem 20% de chance de deixar o alvo confuso.",
		shortDesc: "20% de chance de deixar o alvo confuso.",
	},
	rockpolish: {
		desc: "Aumenta a Velocidade do usuário em 2 estágios.",
		shortDesc: "Aumenta a Velocidade do usuário em 2.",
	},
	rockslide: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o(s) oponente(s) recuar.",
		gen1: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
		gen2: {
			shortDesc: "30% de chance de fazer o alvo recuar.",
		},
	},
	rocksmash: {
		desc: "Tem 50% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a Defesa do alvo em 1.",
	},
	rockthrow: {
		shortDesc: "Sem efeito adicional.",
	},
	rocktomb: {
		desc: "Tem 100% de chance de diminuir a Velocidade do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Velocidade do alvo em 1.",
	},
	rockwrecker: {
		desc: "Se este golpe for bem-sucedido, o usuário precisa recarregar no turno seguinte e não pode escolher um golpe.",
		shortDesc: "O usuário não pode agir no próximo turno.",
	},
	roleplay: {
		desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do usuário for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Zen Mode, Zero to Hero ou já for igual à do alvo, ou se a habilidade do alvo for As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Flower Gift, Forecast, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Power of Alchemy, Protosynthesis, Quark Drive, Receiver, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Trace, Wonder Guard, Zen Mode ou Zero to Hero.",
		shortDesc: "O usuário troca sua habilidade pela do alvo.",
		gen8: {
			desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do usuário for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Zen Mode ou já for igual à do alvo, ou se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Gulp Missile, Hunger Switch, Ice Face, Illusion, Imposter, Multitype, Neutralizing Gas, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard ou Zen Mode.",
		},
		gen7: {
			desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do usuário for Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Zen Mode ou já for igual à do alvo, ou se a habilidade do alvo for Battle Bond, Comatose, Disguise, Flower Gift, Forecast, Illusion, Imposter, Multitype, Power Construct, Power of Alchemy, Receiver, RKS System, Schooling, Shields Down, Stance Change, Trace, Wonder Guard ou Zen Mode.",
		},
		gen6: {
			desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do usuário for Multitype, Stance Change ou já for igual à do alvo, ou se a habilidade do alvo for Flower Gift, Forecast, Illusion, Imposter, Multitype, Stance Change, Trace, Wonder Guard ou Zen Mode.",
		},
		gen5: {
			desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do usuário for Multitype ou já for igual à do alvo, ou se a habilidade do alvo for Flower Gift, Forecast, Illusion, Imposter, Multitype, Trace, Wonder Guard ou Zen Mode.",
		},
		gen4: {
			desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do usuário for Multitype ou já for igual à do alvo, se a habilidade do alvo for Multitype ou Wonder Guard, ou se o usuário estiver segurando Griseous Orb.",
		},
		gen3: {
			desc: "A habilidade do usuário muda para a habilidade do alvo. Falha se a habilidade do alvo for Wonder Guard.",
		},
		changeAbility: "  {POKEMON} copiou a habilidade {ABILITY} de {SOURCE}!",
	},
	rollingkick: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	rollout: {
		desc: "Se este golpe for bem-sucedido, o usuário fica preso a este golpe e não pode usar outro até errar, passarem 5 turnos ou o ataque não poder ser usado. O poder dobra a cada acerto bem-sucedido deste golpe e dobra de novo se o usuário tiver usado Defense Curl antes. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno.",
		shortDesc: "O poder dobra a cada acerto. Repete por 5 turnos.",
		gen7: {
			desc: "Se este golpe for bem-sucedido, o usuário fica preso a este golpe e não pode usar outro até errar, passarem 5 turnos ou o ataque não poder ser usado. O poder dobra a cada acerto bem-sucedido deste golpe e dobra de novo se o usuário tiver usado Defense Curl antes. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno. Se este golpe atingir um Disguise ativo durante o efeito, o multiplicador de poder é pausado, mas o contador de turnos não, o que pode permitir que o multiplicador seja usado no próximo golpe do usuário após o fim deste efeito.",
		},
		gen6: {
			desc: "Se este golpe for bem-sucedido, o usuário fica preso a este golpe e não pode usar outro até errar, passarem 5 turnos ou o ataque não poder ser usado. O poder dobra a cada acerto bem-sucedido deste golpe e dobra de novo se o usuário tiver usado Defense Curl antes. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno.",
		},
	},
	roost: {
		desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade. Se o usuário não estiver Terastalizado, até o final do turno, usuários do tipo Flying perdem o tipo Flying, e usuários puramente do tipo Flying se tornam do tipo Normal. Não faz nada se o HP do usuário estiver cheio.",
		shortDesc: "Cura 50% do HP. Perde o tipo Flying até o fim do turno.",
		gen8: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade. Até o final do turno, usuários do tipo Flying perdem o tipo Flying, e usuários puramente do tipo Flying se tornam do tipo Normal. Não faz nada se o HP do usuário estiver cheio.",
		},
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo. Até o final do turno, usuários do tipo Flying perdem o tipo Flying, e usuários puramente do tipo Flying ficam sem tipo. Não faz nada se o HP do usuário estiver cheio.",
		},
		start: "  ({POKEMON} perde o tipo Flying neste turno.)",
	},
	rototiller: {
		desc: "Aumenta o Ataque e o Ataque Especial de todos os Pokémon do tipo Grass no chão em campo em 1 estágio.",
		shortDesc: "+1 Atk e Sp. Atk em Pokémon do tipo Grass no chão.",
	},
	round: {
		desc: "Se houver outros Pokémon em campo que escolheram este golpe para uso neste turno, esses Pokémon agem imediatamente após o usuário, em ordem de Velocidade, e o poder deste golpe é 120 para cada um desses outros usuários.",
		shortDesc: "O poder dobra se outros usaram Round neste turno.",
	},
	ruination: {
		desc: "Causa ao alvo dano igual à metade do seu HP atual, arredondado para baixo, mas não menos que 1 HP.",
		shortDesc: "Causa dano igual a 1/2 do HP atual do alvo.",
	},
	sacredfire: {
		desc: "Tem 50% de chance de queimar o alvo.",
		shortDesc: "50% de chance de queimar o alvo. Descongela o usuário.",
	},
	sacredsword: {
		desc: "Ignora as mudanças de estágio de atributo do alvo, incluindo a evasão.",
		shortDesc: "Ignora as mudanças de estágio de atributo do alvo.",
	},
	safeguard: {
		desc: "Por 5 turnos, o usuário e os membros da sua equipe não podem receber condições de status não voláteis nem confusão causadas por outros Pokémon. Pokémon no lado do usuário não podem ser afetados por Yawn, mas podem adormecer pelo seu efeito. Ele é removido do lado do usuário se o usuário ou um aliado for atingido com sucesso por Defog. Falha se o efeito já estiver ativo no lado do usuário.",
		shortDesc: "Por 5 turnos, protege a equipe do usuário de status.",
		gen3: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe não podem receber condições de status não voláteis nem confusão causadas por outros Pokémon. Pokémon no lado do usuário não podem ser afetados por Yawn, mas podem adormecer pelo seu efeito. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		gen2: {
			desc: "Por 5 turnos, o usuário e os membros da sua equipe não podem receber condições de status não voláteis nem confusão causadas por outros Pokémon. Durante o efeito, Outrage, Thrash e Petal Dance não deixam o usuário confuso. Falha se o efeito já estiver ativo no lado do usuário.",
		},
		start: "  Um véu místico envolveu {TEAM}!",
		end: "  Safeguard não protege mais {TEAM}!",
		block: "  {POKEMON} está protegido por Safeguard!",
	},
	saltcure: {
		desc: "Causa ao alvo dano igual a 1/8 do seu HP máximo (1/4 se o alvo for do tipo Steel ou Water), arredondado para baixo, ao final de cada turno durante o efeito. Este efeito termina quando o alvo não está mais em campo.",
		shortDesc: "1/8 do HP máx. por turno; 1/4 nos tipos Steel e Water.",
		champions: {
			desc: "Causa ao alvo dano igual a 1/16 do seu HP máximo (1/8 se o alvo for do tipo Steel ou Water), arredondado para baixo, ao final de cada turno durante o efeito. Este efeito termina quando o alvo não está mais em campo.",
			shortDesc: "1/16 do HP máx. por turno; 1/8 nos tipos Steel e Water.",
		},
		start: "  {POKEMON} está sendo salgado!",
		damage: "  {POKEMON} foi ferido por Salt Cure!",
	},
	sandattack: {
		desc: "Diminui a precisão do alvo em 1 estágio.",
		shortDesc: "Diminui a precisão do alvo em 1.",
	},
	sandsearstorm: {
		desc: "Tem 20% de chance de queimar o alvo. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se este golpe for usado contra um Pokémon segurando Utility Umbrella, a precisão deste golpe continua em 80%.",
		shortDesc: "20% de chance de queimar oponente(s). Não erra na chuva.",
	},
	sandstorm: {
		desc: "Por 5 turnos, o clima se torna tempestade de areia. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/16 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ground, Rock ou Steel, ou tenham as habilidades Magic Guard, Overcoat, Sand Force, Sand Rush ou Sand Veil. Durante o efeito, a Defesa Especial dos Pokémon do tipo Rock é multiplicada por 1,5 ao receberem dano de um ataque especial. Dura 8 turnos se o usuário estiver segurando Smooth Rock. Falha se o clima atual for tempestade de areia.",
		shortDesc: "Tempestade de areia por 5 turnos; tipo Rock: 1,5× SpD.",
		gen4: {
			desc: "Por 5 turnos, o clima se torna tempestade de areia. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/16 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ground, Rock ou Steel, ou tenham as habilidades Magic Guard ou Sand Veil. Durante o efeito, a Defesa Especial dos Pokémon do tipo Rock é multiplicada por 1,5 ao receberem dano de um ataque especial. Dura 8 turnos se o usuário estiver segurando Smooth Rock. Falha se o clima atual for tempestade de areia.",
		},
		gen3: {
			desc: "Por 5 turnos, o clima se torna tempestade de areia. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/16 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ground, Rock ou Steel, ou tenham a habilidade Sand Veil. Falha se o clima atual for tempestade de areia.",
			shortDesc: "Tempestade de areia por 5 turnos.",
		},
		gen2: {
			desc: "Por 5 turnos, o clima se torna tempestade de areia. Ao final de cada turno, exceto o último, todos os Pokémon em campo perdem 1/8 do seu HP máximo, arredondado para baixo, a menos que sejam do tipo Ground, Rock ou Steel. Falha se o clima atual for tempestade de areia.",
		},
	},
	sandtomb: {
		desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de aprisionamento.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de aprisionamento.",
		},
		gen7: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do seu HP máximo (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de aprisionamento.",
		},
		gen5: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos; sete turnos se o usuário estiver segurando Grip Claw. Causa ao alvo dano igual a 1/16 do seu HP máximo (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de aprisionamento parcial.",
		},
		gen4: {
			desc: "Impede o alvo de trocar por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de aprisionamento.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		gen3: {
			desc: "Impede o alvo de trocar por dois a cinco turnos. Causa ao alvo dano igual a 1/16 do seu HP máximo, arredondado para baixo, ao final de cada turno durante o efeito. O alvo ainda pode sair de campo se usar Baton Pass. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de aprisionamento.",
		},
		start: "  {POKEMON} ficou preso na areia movediça!",
	},
	sappyseed: {
		desc: "Este golpe aplica Leech Seed no oponente.",
		shortDesc: "Aplica Leech Seed.",
	},
	savagespinout: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	scald: {
		desc: "Tem 30% de chance de queimar o alvo. O alvo descongela se estiver congelado.",
		shortDesc: "30% de chance de queimar o alvo. Descongela o alvo.",
		gen5: {
			desc: "Tem 30% de chance de queimar o alvo.",
			shortDesc: "30% de chance de queimar o alvo.",
		},
	},
	scaleshot: {
		desc: "Acerta de duas a cinco vezes. Diminui a Defesa do usuário em 1 estágio e aumenta a Velocidade do usuário em 1 estágio após o último acerto. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano nos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes. Usuário: -1 Def, +1 Spe após o último.",
	},
	scaryface: {
		desc: "Diminui a Velocidade do alvo em 2 estágios.",
		shortDesc: "Diminui a Velocidade do alvo em 2.",
	},
	scorchingsands: {
		desc: "Tem 30% de chance de queimar o alvo. O alvo descongela se estiver congelado.",
		shortDesc: "30% de chance de queimar o alvo. Descongela o alvo.",
	},
	scratch: {
		shortDesc: "Sem efeito adicional.",
	},
	screech: {
		desc: "Diminui a Defesa do alvo em 2 estágios.",
		shortDesc: "Diminui a Defesa do alvo em 2.",
	},
	searingshot: {
		desc: "Tem 30% de chance de queimar o alvo.",
		shortDesc: "30% de chance de queimar os Pokémon adjacentes.",
	},
	searingsunrazesmash: {
		desc: "Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Ignora as habilidades de outros Pokémon.",
	},
	secretpower: {
		desc: "Tem 30% de chance de causar um efeito secundário no alvo conforme o terreno da batalha. Causa paralisia no terreno padrão de Wi-Fi, causa paralisia durante Electric Terrain, diminui o Ataque Especial em 1 estágio durante Misty Terrain, causa sono durante Grassy Terrain e diminui a Velocidade em 1 estágio durante Psychic Terrain.",
		shortDesc: "Efeito varia com o terreno. (30% de chance de paralisia)",
		gen6: {
			desc: "Tem 30% de chance de causar um efeito secundário no alvo conforme o terreno da batalha. Causa paralisia no terreno padrão de Wi-Fi, causa paralisia durante Electric Terrain, diminui o Ataque Especial em 1 estágio durante Misty Terrain e causa sono durante Grassy Terrain.",
		},
		gen5: {
			desc: "Tem 30% de chance de causar um efeito secundário no alvo conforme o terreno da batalha. Diminui a precisão em 1 estágio no terreno padrão de Wi-Fi. A chance do efeito secundário não é afetada pela habilidade Serene Grace.",
			shortDesc: "Efeito varia com o terreno. (30% de chance: acc -1)",
		},
		gen4: {
			desc: "Tem 30% de chance de causar um efeito secundário no alvo conforme o terreno da batalha. Causa paralisia no terreno padrão de Wi-Fi.",
			shortDesc: "Efeito varia com o terreno. (30% de chance de paralisia)",
		},
	},
	secretsword: {
		desc: "Causa dano ao alvo com base na Defesa dele em vez da Defesa Especial.",
		shortDesc: "Dano baseado na Defesa do alvo, não na Sp. Def.",
	},
	seedbomb: {
		shortDesc: "Sem efeito adicional.",
	},
	seedflare: {
		desc: "Tem 40% de chance de diminuir a Defesa Especial do alvo em 2 estágios.",
		shortDesc: "40% de chance de diminuir a Sp. Def do alvo em 2.",
	},
	seismictoss: {
		desc: "Causa ao alvo dano igual ao nível do usuário.",
		shortDesc: "Causa dano igual ao nível do usuário.",
		gen1: {
			desc: "Causa ao alvo dano igual ao nível do usuário. Este golpe ignora imunidades de tipo.",
			shortDesc: "Dano = nível do usuário. Atinge o tipo Ghost.",
		},
	},
	selfdestruct: {
		desc: "O usuário desmaia após usar este golpe, mesmo que ele falhe por não ter alvo. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
		shortDesc: "Atinge os Pokémon adjacentes. O usuário desmaia.",
		gen4: {
			desc: "O usuário desmaia após usar este golpe, a menos que este golpe não tenha alvo. A Defesa do alvo é reduzida à metade durante o cálculo de dano. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
			shortDesc: "Def do alvo pela metade no cálculo. Usuário desmaia.",
		},
		gen3: {
			desc: "O usuário desmaia após usar este golpe. A Defesa do alvo é reduzida à metade durante o cálculo de dano. Este golpe é impedido de ser executado se qualquer Pokémon em campo tiver a habilidade Damp.",
		},
		gen2: {
			desc: "O usuário desmaia após usar este golpe. A Defesa do alvo é reduzida à metade durante o cálculo de dano.",
		},
		gen1: {
			desc: "O usuário desmaia após usar este golpe, a menos que o substituto do alvo tenha sido quebrado pelo dano. A Defesa do alvo é reduzida à metade durante o cálculo de dano.",
		},
	},
	shadowball: {
		desc: "Tem 20% de chance de diminuir a Defesa Especial do alvo em 1 estágio.",
		shortDesc: "20% de chance de diminuir a Sp. Def do alvo em 1.",
	},
	shadowbone: {
		desc: "Tem 20% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "20% de chance de diminuir a Defesa do alvo em 1.",
	},
	shadowclaw: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	shadowforce: {
		desc: "Se este golpe for bem-sucedido, ele rompe Baneful Bunker, Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno, e outros Pokémon podem atacar o lado do alvo normalmente. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Some no turno 1. Ataca no turno 2. Rompe proteções.",
		gen6: {
			desc: "Se este golpe for bem-sucedido, ele rompe Detect, King's Shield, Protect ou Spiky Shield do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o lado do alvo estiver protegido por Crafty Shield, Mat Block, Quick Guard ou Wide Guard, essa proteção também é rompida neste turno, e outros Pokémon podem atacar o lado do alvo normalmente. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto em campo.",
		},
		gen5: {
			desc: "Se este golpe for bem-sucedido, ele rompe Detect ou Protect do alvo neste turno, permitindo que outros Pokémon ataquem o alvo normalmente. Se o alvo for um oponente e seu lado estiver protegido por Quick Guard ou Wide Guard, essa proteção também é rompida neste turno, e outros Pokémon podem atacar o lado do oponente normalmente. Este ataque carrega no primeiro turno e é executado no segundo. No primeiro turno, o usuário evita todos os ataques. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		},
		activate: "  Rompeu a proteção de {TARGET}!",
		prepare: "{POKEMON} desapareceu instantaneamente!",
	},
	shadowpunch: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	shadowsneak: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	shadowstrike: {
		desc: "Tem 50% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "50% de chance de diminuir a Defesa do alvo em 1.",
	},
	sharpen: {
		desc: "Aumenta o Ataque do usuário em 1 estágio.",
		shortDesc: "Aumenta o Ataque do usuário em 1.",
	},
	shatteredpsyche: {
		shortDesc: "O poder é igual ao Z-Power do golpe base.",
	},
	shedtail: {
		desc: "O usuário perde 1/2 do seu HP máximo, arredondado para cima, e cria um substituto com 1/4 do HP máximo do usuário, arredondado para baixo. O usuário é substituído por outro Pokémon da sua equipe, e o Pokémon escolhido recebe o substituto. Falha se o usuário fosse desmaiar ou se não houver membros da equipe que não tenham desmaiado.",
		shortDesc: "Usuário gasta 1/2 do HP máx. para passar um substituto.",
		start: "  {POKEMON} soltou a cauda para criar um chamariz!",
	},
	sheercold: {
		desc: "Causa ao alvo dano igual ao HP máximo do alvo. Ignora modificadores de precisão e evasão. A precisão deste ataque é igual a (nível do usuário - nível do alvo + X)%, onde X é 30 se o usuário for do tipo Ice e 20 caso contrário, e falha se o alvo tiver nível maior. Pokémon do tipo Ice e Pokémon com a habilidade Sturdy são imunes.",
		shortDesc: "OHKO; tipo Ice imune. Falha se usuário tiver nível menor.",
		gen6: {
			desc: "Causa ao alvo dano igual ao HP máximo do alvo. Ignora modificadores de precisão e evasão. A precisão deste ataque é igual a (nível do usuário - nível do alvo + 30)%, e falha se o alvo tiver nível maior. Pokémon com a habilidade Sturdy são imunes.",
			shortDesc: "OHKO no alvo. Falha se o usuário tiver nível menor.",
		},
	},
	shellsidearm: {
		desc: "Tem 20% de chance de envenenar o alvo. Este golpe se torna um ataque físico que faz contato se o valor de ((((2 × nível do usuário / 5 + 2) × 90 × X) / Y) / 50), onde X é o atributo de Ataque do usuário e Y é o atributo de Defesa do alvo, for maior que o mesmo valor quando X é o atributo de Ataque Especial do usuário e Y é o atributo de Defesa Especial do alvo. Nenhum modificador de atributo além das mudanças de estágio é considerado para isso. Se os dois valores forem iguais, este golpe escolhe uma categoria de dano aleatoriamente.",
		shortDesc: "20% de psn. Físico e com contato se for mais forte.",
	},
	shellsmash: {
		desc: "Diminui a Defesa e a Defesa Especial do usuário em 1 estágio. Aumenta o Ataque, o Ataque Especial e a Velocidade do usuário em 2 estágios.",
		shortDesc: "Diminui Def, SpD em 1; aumenta Atk, SpA, Spe em 2.",
	},
	shelltrap: {
		desc: "Falha a menos que o usuário seja atingido por um ataque físico de um oponente neste turno antes de executar o golpe. Se o usuário foi atingido e não desmaiou, ele ataca imediatamente após ser atingido, e o efeito termina. Se o ataque físico do oponente teve um efeito secundário removido pela habilidade Sheer Force, ele não conta para este efeito.",
		shortDesc: "O usuário precisa sofrer dano físico antes de agir.",
		start: "  {POKEMON} armou uma armadilha de casco!",
		prepare: "  {POKEMON} armou uma armadilha de casco!",
		cant: "A armadilha de casco de {POKEMON} não funcionou!",
	},
	shelter: {
		desc: "Aumenta a Defesa do usuário em 2 estágios.",
		shortDesc: "Aumenta a Defesa do usuário em 2.",
	},
	shiftgear: {
		desc: "Aumenta a Velocidade do usuário em 2 estágios e o Ataque em 1 estágio.",
		shortDesc: "Aumenta a Velocidade do usuário em 2 e o Ataque em 1.",
	},
	shockwave: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	shoreup: {
		desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo até a metade. Se o clima for tempestade de areia, o usuário recupera 2/3 do seu HP máximo em vez disso, arredondado para baixo até a metade.",
		shortDesc: "Recupera 1/2 do HP máx.; 2/3 na tempestade de areia.",
	},
	signalbeam: {
		desc: "Tem 10% de chance de deixar o alvo confuso.",
		shortDesc: "10% de chance de deixar o alvo confuso.",
	},
	silktrap: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que tentarem fazer contato com o usuário têm a Velocidade diminuída em 1 estágio. Golpes que não causam dano atravessam esta proteção. Este golpe tem 1/X de chance de ser bem-sucedido, onde X começa em 1 e triplica a cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		shortDesc: "Protege de ataques que causam dano. Contato: -1 Spe.",
	},
	silverwind: {
		desc: "Tem 10% de chance de aumentar o Ataque, a Defesa, o Ataque Especial, a Defesa Especial e a Velocidade do usuário em 1 estágio.",
		shortDesc: "10% de chance: +1 em todos os atributos (não acc/eva).",
	},
	simplebeam: {
		desc: "Faz a habilidade do alvo se tornar Simple. Falha se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Simple, Stance Change, Tera Shift, Truant, Zen Mode ou Zero to Hero.",
		shortDesc: "A habilidade do alvo se torna Simple.",
		gen8: {
			desc: "Faz a habilidade do alvo se tornar Simple. Falha se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Multitype, Power Construct, RKS System, Schooling, Shields Down, Simple, Stance Change, Truant ou Zen Mode.",
		},
		gen7: {
			desc: "Faz a habilidade do alvo se tornar Simple. Falha se a habilidade do alvo for Battle Bond, Comatose, Disguise, Multitype, Power Construct, RKS System, Schooling, Shields Down, Simple, Stance Change, Truant ou Zen Mode.",
		},
		gen6: {
			desc: "Faz a habilidade do alvo se tornar Simple. Falha se a habilidade do alvo for Multitype, Simple, Stance Change ou Truant.",
		},
		gen5: {
			desc: "Faz a habilidade do alvo se tornar Simple. Falha se a habilidade do alvo for Multitype, Simple ou Truant.",
		},
	},
	sing: {
		shortDesc: "Faz o alvo adormecer.",
	},
	sinisterarrowraid: {
		shortDesc: "Sem efeito adicional.",
	},
	sizzlyslide: {
		desc: "Tem 100% de chance de queimar o oponente.",
		shortDesc: "100% de chance de queimar o oponente.",
	},
	sketch: {
		desc: "Este golpe é substituído permanentemente pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado ou se o golpe for Blazing Torque, Combat Torque, Dark Void, Hyperspace Fury, Magical Torque, Noxious Torque, Revival Blessing, Sketch, Struggle, Tera Starstorm, Wicked Torque ou qualquer golpe que o usuário conheça.",
		shortDesc: "Copia permanentemente o último golpe usado pelo alvo.",
		gen8: {
			desc: "Este golpe é substituído permanentemente pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado ou se o golpe for Chatter, Sketch, Struggle ou qualquer golpe que o usuário conheça.",
		},
		gen3: {
			desc: "Este golpe é substituído permanentemente pelo último golpe usado pelo alvo. O golpe copiado tem o PP máximo daquele golpe. Falha se o alvo ainda não agiu, se o usuário estiver transformado ou se o golpe for Sketch, Struggle ou qualquer golpe que o usuário conheça.",
		},
		gen2: {
			desc: "Falha quando usado em batalhas Link.",
			shortDesc: "Falha quando usado em batalhas Link.",
		},
		activate: "  {POKEMON} esboçou {MOVE}!",
	},
	skillswap: {
		desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for As One, Battle Bond, Comatose, Commander, Disguise, Embody Aspect, Hunger Switch, Ice Face, Illusion, Multitype, Neutralizing Gas, Poison Puppeteer, Power Construct, Protosynthesis, Quark Drive, RKS System, Schooling, Shields Down, Stance Change, Tera Shell, Tera Shift, Teraform Zero, Wonder Guard, Zen Mode ou Zero to Hero.",
		shortDesc: "O usuário e o alvo trocam de habilidade.",
		gen8: {
			desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Hunger Switch, Ice Face, Illusion, Multitype, Neutralizing Gas, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Wonder Guard ou Zen Mode.",
		},
		gen7: {
			desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for Battle Bond, Comatose, Disguise, Illusion, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Wonder Guard ou Zen Mode.",
		},
		gen6: {
			desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for Illusion, Multitype, Stance Change ou Wonder Guard.",
		},
		gen5: {
			desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for Illusion, Multitype ou Wonder Guard, ou se ambos tiverem a mesma habilidade.",
		},
		gen4: {
			desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for Multitype ou Wonder Guard, se ambos tiverem a mesma habilidade ou se algum deles estiver segurando Griseous Orb.",
		},
		gen3: {
			desc: "O usuário troca sua habilidade com a do alvo. Falha se a habilidade do usuário ou do alvo for Wonder Guard.",
		},
		activate: "  {POKEMON} trocou de habilidade com o alvo!",
	},
	skittersmack: {
		desc: "Tem 100% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Sp. Atk do alvo em 1.",
	},
	skullbash: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. Aumenta a Defesa do usuário em 1 estágio no primeiro turno. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Aumenta a Defesa em 1 no turno 1. Ataca no turno 2.",
		gen3: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. Aumenta a Defesa do usuário em 1 estágio no primeiro turno.",
		},
		gen1: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo.",
			shortDesc: "Carrega no turno 1. Ataca no turno 2.",
		},
		prepare: "{POKEMON} encolheu a cabeça!",
	},
	skyattack: {
		desc: "Tem 30% de chance de fazer o alvo recuar e maior chance de acerto crítico. Este ataque carrega no primeiro turno e é executado no segundo. Se o usuário estiver segurando Power Herb, o golpe é concluído em um turno.",
		shortDesc: "Carrega; ataca no turno 2. 30% de recuo. Crítico alto.",
		gen3: {
			desc: "Tem 30% de chance de fazer o alvo recuar e maior chance de acerto crítico. Este ataque carrega no primeiro turno e é executado no segundo.",
		},
		gen2: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo.",
			shortDesc: "Carrega no turno 1. Ataca no turno 2.",
		},
		prepare: "{POKEMON} ficou envolto em uma luz intensa!",
	},
	skydrop: {
		desc: "Este ataque leva o alvo para o ar junto com o usuário no primeiro turno e é executado no segundo. Pokémon que pesam 200 kg ou mais não podem ser levantados. No primeiro turno, o usuário e o alvo evitam todos os ataques, exceto Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder e Twister. O usuário e o alvo não podem agir entre os turnos, mas o alvo pode escolher um golpe para usar. Este golpe não causa dano a Pokémon do tipo Flying. Falha no primeiro turno se o alvo for um aliado, se o alvo tiver um substituto ou se o alvo estiver usando Bounce, Dig, Dive, Fly, Phantom Force, Shadow Force ou Sky Drop.",
		shortDesc: "Usuário e oponente voam no turno 1. Dano no turno 2.",
		gen5: {
			desc: "Este ataque leva o alvo para o ar junto com o usuário no primeiro turno e é executado no segundo. No primeiro turno, o usuário e o alvo evitam todos os ataques, exceto Gust, Hurricane, Sky Uppercut, Smack Down, Thunder e Twister. O usuário e o alvo não podem agir entre os turnos, mas o alvo pode escolher um golpe para usar. Este golpe não causa dano a Pokémon do tipo Flying. Falha no primeiro turno se o alvo for um aliado, se o alvo tiver um substituto ou se o alvo estiver usando Bounce, Dig, Dive, Fly, Shadow Force ou Sky Drop. Se o efeito de Gravity encerrar este efeito antes do segundo turno, o usuário e o alvo voltam ao chão, mas o alvo continuará sob este efeito até que o usuário saia de campo ou execute com sucesso o segundo turno de qualquer golpe de dois turnos.",
		},
		prepare: "{POKEMON} levou {TARGET} para o céu!",
		end: "  {POKEMON} foi libertado de Sky Drop!",
		failSelect: "Sky Drop não deixa {POKEMON} escapar!",
		failTooHeavy: "  {POKEMON} é pesado demais para ser levantado!",
	},
	skyuppercut: {
		desc: "Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop.",
		shortDesc: "Atinge Pokémon usando Bounce, Fly ou Sky Drop.",
		gen4: {
			desc: "Este golpe pode atingir um alvo que esteja usando Bounce ou Fly.",
			shortDesc: "Atinge Pokémon usando Bounce ou Fly.",
		},
	},
	slackoff: {
		desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para cima a partir da metade.",
		shortDesc: "Cura o usuário em 50% do seu HP máximo.",
		gen4: {
			desc: "O usuário recupera 1/2 do seu HP máximo, arredondado para baixo.",
		},
	},
	slam: {
		shortDesc: "Sem efeito adicional.",
	},
	slash: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	sleeppowder: {
		shortDesc: "Faz o alvo adormecer.",
	},
	sleeptalk: {
		desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Assist, Beak Blast, Belch, Bide, Blazing Torque, Celebrate, Chatter, Combat Torque, Copycat, Dynamax Cannon, Focus Punch, Hold Hands, Magical Torque, Me First, Metronome, Mimic, Mirror Move, Nature Power, Noxious Torque, Shell Trap, Sketch, Sleep Talk, Struggle, Uproar, Wicked Torque ou qualquer golpe de dois turnos.",
		shortDesc: "Precisa estar dormindo. Usa outro golpe conhecido.",
		gen8: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Assist, Beak Blast, Belch, Bide, Celebrate, Chatter, Copycat, Dynamax Cannon, Focus Punch, Hold Hands, Me First, Metronome, Mimic, Mirror Move, Nature Power, Shell Trap, Sketch, Sleep Talk, Struggle, Uproar, qualquer golpe de dois turnos ou qualquer Max Move.",
		},
		gen7: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Assist, Beak Blast, Belch, Bide, Celebrate, Chatter, Copycat, Focus Punch, Hold Hands, Me First, Metronome, Mimic, Mirror Move, Nature Power, Shell Trap, Sketch, Sleep Talk, Struggle, Uproar, qualquer golpe de dois turnos ou qualquer Z-Move.",
		},
		gen6: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Assist, Belch, Bide, Celebrate, Chatter, Copycat, Focus Punch, Hold Hands, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Uproar ou qualquer golpe de dois turnos.",
		},
		gen5: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Assist, Bide, Chatter, Copycat, Focus Punch, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Uproar ou qualquer golpe de dois turnos.",
		},
		gen4: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Assist, Bide, Chatter, Copycat, Focus Punch, Me First, Metronome, Mirror Move, Sleep Talk, Uproar ou qualquer golpe de dois turnos.",
		},
		gen3: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido, mas, se estiver com 0 PP, falhará ao ser usado. Este golpe não pode escolher Assist, Bide, Focus Punch, Metronome, Mirror Move, Sleep Talk, Uproar ou qualquer golpe de dois turnos.",
		},
		gen2: {
			desc: "Um dos golpes conhecidos pelo usuário, exceto este, é escolhido aleatoriamente para uso. Falha se o usuário não estiver dormindo. O golpe escolhido não tem PP deduzido e pode estar com 0 PP. Este golpe não pode escolher Bide, Sleep Talk ou qualquer golpe de dois turnos.",
		},
	},
	sludge: {
		desc: "Tem 30% de chance de envenenar o alvo.",
		shortDesc: "30% de chance de envenenar o alvo.",
		gen1: {
			desc: "Tem 40% de chance de envenenar o alvo.",
			shortDesc: "40% de chance de envenenar o alvo.",
		},
	},
	sludgebomb: {
		desc: "Tem 30% de chance de envenenar o alvo.",
		shortDesc: "30% de chance de envenenar o alvo.",
	},
	sludgewave: {
		desc: "Tem 10% de chance de envenenar o alvo.",
		shortDesc: "10% de chance de envenenar Pokémon adjacentes.",
	},
	smackdown: {
		desc: "Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se este golpe atingir um alvo sob o efeito de Bounce, Fly, Magnet Rise ou Telekinesis, o efeito termina. Se o alvo for do tipo Flying e não tiver usado Roost neste turno, ou for um Pokémon com a habilidade Levitate, ele perde a imunidade a ataques do tipo Ground e à habilidade Arena Trap enquanto permanecer em campo. Durante o efeito, Magnet Rise falha para o alvo e Telekinesis falha contra o alvo.",
		shortDesc: "Remove a imunidade do alvo ao tipo Ground.",
		start: "  {POKEMON} caiu direto no chão!",
	},
	smartstrike: {
		shortDesc: "Este golpe não verifica a precisão.",
	},
	smellingsalts: {
		desc: "O poder dobra se o alvo estiver paralisado. Se o usuário não tiver desmaiado, o alvo é curado da paralisia.",
		shortDesc: "Poder dobra se o alvo está paralisado; cura o alvo.",
		gen4: {
			desc: "O poder dobra se o alvo estiver paralisado. Se este golpe tiver sucesso, o alvo é curado da paralisia.",
		},
		gen3: {
			desc: "O dano dobra se o alvo estiver paralisado. Se este golpe tiver sucesso, o alvo é curado da paralisia.",
			shortDesc: "Dano dobra se o alvo está paralisado; cura o alvo.",
		},
	},
	smog: {
		desc: "Tem 40% de chance de envenenar o alvo.",
		shortDesc: "40% de chance de envenenar o alvo.",
	},
	smokescreen: {
		desc: "Diminui a precisão do alvo em 1 estágio.",
		shortDesc: "Diminui a precisão do alvo em 1.",
	},
	snaptrap: {
		desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		start: "  {POKEMON} ficou preso em uma armadilha de mandíbulas!",
	},
	snarl: {
		desc: "Tem 100% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "100% de chance de -1 Sp. Atk do(s) oponente(s).",
	},
	snatch: {
		desc: "Se outro Pokémon usar certos golpes que não causam dano neste turno, o usuário rouba esse golpe para usá-lo ele mesmo. Se vários Pokémon usarem um desses golpes neste turno, todos os golpes aplicáveis são roubados pelo primeiro Pokémon, na ordem do turno, que usou este golpe neste turno. Este efeito é ignorado enquanto o usuário estiver sob o efeito de Sky Drop.",
		shortDesc: "O usuário rouba certos golpes de suporte para si.",
		gen4: {
			desc: "Se outro Pokémon usar certos golpes que não causam dano neste turno, o usuário rouba esse golpe para usá-lo ele mesmo. Se vários Pokémon usarem este golpe neste turno, os golpes aplicáveis são roubados por cada um desses Pokémon na ordem do turno, e somente o último usuário na ordem do turno recebe os efeitos.",
		},
		start: "  {POKEMON} está esperando um alvo usar um golpe!",
		activate: "  {POKEMON} roubou o golpe de {TARGET}!",
	},
	snipeshot: {
		desc: "Tem maior chance de acerto crítico. Este golpe não pode ser redirecionado para outro alvo por nenhum efeito.",
		shortDesc: "Alta taxa de crítico. Não pode ser redirecionado.",
	},
	snore: {
		desc: "Tem 30% de chance de fazer o alvo recuar. Falha se o usuário não estiver dormindo.",
		shortDesc: "Usuário deve estar dormindo. 30% de fazer recuar.",
	},
	snowscape: {
		desc: "Por 5 turnos, o clima se torna neve. Durante o efeito, a Defesa de Pokémon do tipo Ice é multiplicada por 1,5 ao receber dano de um ataque físico. Dura 8 turnos se o usuário estiver segurando Icy Rock. Falha se o clima atual for neve.",
		shortDesc: "Por 5 turnos, neva. Pokémon do tipo Ice: 1,5× Def.",
	},
	soak: {
		desc: "Torna o alvo do tipo Water. Falha se o alvo for Arceus ou Silvally, se o alvo já for puramente do tipo Water, ou se o alvo estiver Terastalizado.",
		shortDesc: "Torna o alvo do tipo Water.",
		gen8: {
			desc: "Torna o alvo do tipo Water. Falha se o alvo for Arceus ou Silvally, ou se o alvo já for puramente do tipo Water.",
		},
		gen6: {
			desc: "Torna o alvo do tipo Water. Falha se o alvo for Arceus, ou se o alvo já for puramente do tipo Water.",
		},
		gen5: {
			desc: "Torna o alvo do tipo Water. Falha se o alvo for Arceus.",
		},
	},
	softboiled: {
		desc: "O usuário recupera 1/2 do HP máximo, arredondado para cima a partir da metade.",
		shortDesc: "Cura o usuário em 50% do HP máximo.",
		gen4: {
			desc: "O usuário recupera 1/2 do HP máximo, arredondado para baixo.",
		},
		gen1: {
			desc: "O usuário recupera 1/2 do HP máximo, arredondado para baixo. Falha se (HP máximo do usuário - HP atual do usuário + 1) for divisível por 256.",
		},
	},
	solarbeam: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for chuva forte, chuva, tempestade de areia ou neve e o usuário não estiver segurando Utility Umbrella. Se o usuário estiver segurando Power Herb ou o clima for sol intenso ou sol, o golpe é concluído em um turno. Se o usuário estiver segurando Utility Umbrella e o clima for sol intenso ou sol, o golpe ainda precisa de um turno para carregar.",
		shortDesc: "Carrega no turno 1. Ataca no turno 2. Sem carga no sol.",
		gen8: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for granizo, chuva forte, chuva ou tempestade de areia e o usuário não estiver segurando Utility Umbrella. Se o usuário estiver segurando Power Herb ou o clima for sol intenso ou sol, o golpe é concluído em um turno. Se o usuário estiver segurando Utility Umbrella e o clima for sol intenso ou sol, o golpe ainda precisa de um turno para carregar.",
		},
		gen7: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for granizo, chuva forte, chuva ou tempestade de areia. Se o usuário estiver segurando Power Herb ou o clima for sol intenso ou sol, o golpe é concluído em um turno.",
		},
		gen5: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for granizo, chuva ou tempestade de areia. Se o usuário estiver segurando Power Herb ou o clima for sol, o golpe é concluído em um turno.",
		},
		gen4: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O dano é reduzido à metade se o clima for granizo, chuva ou tempestade de areia. Se o usuário estiver segurando Power Herb ou o clima for sol, o golpe é concluído em um turno.",
		},
		gen3: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O dano é reduzido à metade se o clima for granizo, chuva ou tempestade de areia. Se o clima for sol, o golpe é concluído em um turno.",
		},
		gen2: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O dano é reduzido à metade se o clima for chuva. Se o clima for sol, o golpe é concluído em um turno.",
		},
		gen1: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo.",
			shortDesc: "Carrega no turno 1. Ataca no turno 2.",
		},
		prepare: "  {POKEMON} absorveu luz!",
	},
	solarblade: {
		desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for chuva forte, chuva, tempestade de areia ou neve e o usuário não estiver segurando Utility Umbrella. Se o usuário estiver segurando Power Herb ou o clima for sol intenso ou sol, o golpe é concluído em um turno. Se o usuário estiver segurando Utility Umbrella e o clima for sol intenso ou sol, o golpe ainda precisa de um turno para carregar.",
		shortDesc: "Carrega no turno 1. Ataca no turno 2. Sem carga no sol.",
		gen8: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for granizo, chuva forte, chuva ou tempestade de areia e o usuário não estiver segurando Utility Umbrella. Se o usuário estiver segurando Power Herb ou o clima for sol intenso ou sol, o golpe é concluído em um turno. Se o usuário estiver segurando Utility Umbrella e o clima for sol intenso ou sol, o golpe ainda precisa de um turno para carregar.",
		},
		gen7: {
			desc: "Este ataque carrega no primeiro turno e é executado no segundo. O poder é reduzido à metade se o clima for granizo, chuva forte, chuva ou tempestade de areia. Se o usuário estiver segurando Power Herb ou o clima for sol intenso ou sol, o golpe é concluído em um turno.",
		},
	},
	sonicboom: {
		desc: "Causa 20 HP de dano ao alvo.",
		shortDesc: "Sempre causa 20 HP de dano.",
		gen1: {
			desc: "Causa 20 HP de dano ao alvo. Este golpe ignora imunidade de tipo.",
		},
	},
	soulstealing7starstrike: {
		shortDesc: "Sem efeito adicional.",
	},
	spacialrend: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	spark: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar o alvo.",
	},
	sparklingaria: {
		desc: "Se o usuário não tiver desmaiado, o alvo é curado da queimadura.",
		shortDesc: "O alvo é curado da queimadura.",
	},
	sparklyswirl: {
		desc: "Todos os Pokémon da equipe do usuário são curados de sua condição de status não volátil.",
		shortDesc: "Cura a equipe do usuário de condições de status.",
	},
	spectralthief: {
		desc: "Os estágios de atributo do alvo maiores que 0 são roubados dele e aplicados ao usuário antes de causar dano.",
		shortDesc: "Rouba os aumentos do alvo antes de causar dano.",
		clearBoost: "  {SOURCE} roubou os aumentos de atributos do alvo!",
	},
	speedswap: {
		desc: "O usuário troca seu atributo Velocidade com o do alvo. Mudanças de estágio de atributo não são afetadas.",
		shortDesc: "Troca a Velocidade com o alvo.",
		activate: "  {POKEMON} trocou de Velocidade com o alvo!",
	},
	spicyextract: {
		desc: "Aumenta o Ataque do alvo em 2 estágios e diminui a Defesa dele em 2 estágios.",
		shortDesc: "Aumenta o Atk do alvo em 2 e diminui a Def em 2.",
	},
	spiderweb: {
		desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Impede o alvo de sair de campo.",
		gen7: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
		gen5: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
		gen4: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo, a menos que use Baton Pass, caso em que o alvo continuará preso.",
		},
		gen3: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se usar Baton Pass. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo, a menos que use Baton Pass, caso em que o alvo continuará preso.",
		},
	},
	spikecannon: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen4: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes, e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes, e 1/8 de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes.",
		},
		gen1: {
			desc: "Acerta de duas a cinco vezes. Tem 3/8 de chance de acertar duas ou três vezes, e 1/8 de chance de acertar quatro ou cinco vezes. O dano é calculado uma vez no primeiro acerto e usado em todos os acertos. Se um dos acertos quebrar o substituto do alvo, o golpe termina.",
		},
	},
	spikes: {
		desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até três vezes antes de falhar. Os oponentes perdem 1/8 do HP máximo com uma camada, 1/6 do HP máximo com duas camadas e 1/4 do HP máximo com três camadas, tudo arredondado para baixo. Pode ser removido do lado adversário se qualquer Pokémon usar Tidy Up, ou se qualquer Pokémon adversário usar Mortal Spin, Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Fere oponentes no chão ao entrar. Máx. 3 camadas.",
		gen8: {
			desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até três vezes antes de falhar. Os oponentes perdem 1/8 do HP máximo com uma camada, 1/6 do HP máximo com duas camadas e 1/4 do HP máximo com três camadas, tudo arredondado para baixo. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		},
		gen5: {
			desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até três vezes antes de falhar. Os oponentes perdem 1/8 do HP máximo com uma camada, 1/6 do HP máximo com duas camadas e 1/4 do HP máximo com três camadas, tudo arredondado para baixo. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin com sucesso, ou for atingido por Defog.",
		},
		gen3: {
			desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até três vezes antes de falhar. Os oponentes perdem 1/8 do HP máximo com uma camada, 1/6 do HP máximo com duas camadas e 1/4 do HP máximo com três camadas, tudo arredondado para baixo. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin com sucesso.",
		},
		gen2: {
			desc: "Coloca uma armadilha no lado adversário do campo, fazendo cada Pokémon adversário que entrar em campo perder 1/8 do HP máximo, arredondado para baixo, a menos que seja um Pokémon do tipo Flying. Falha se o efeito já estiver ativo no lado adversário. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin com sucesso.",
			shortDesc: "Fere oponentes no chão ao entrar. Máx. 1 camada.",
		},
		start: "  Espinhos foram espalhados pelo chão ao redor de {TEAM}!",
		end: "  Os espinhos desapareceram do chão ao redor de {TEAM}!",
		damage: "  {POKEMON} foi ferido pelos espinhos!",
	},
	spikyshield: {
		desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário perdem 1/8 do HP máximo, arredondado para baixo. Este golpe tem 1/X de chance de ter sucesso, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		shortDesc: "Protege de golpes. Contato: perde 1/8 do HP máx.",
		gen8: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário perdem 1/8 do HP máximo, arredondado para baixo. Este golpe tem 1/X de chance de ter sucesso, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
		gen7: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário perdem 1/8 do HP máximo, arredondado para baixo. Este golpe tem 1/X de chance de ter sucesso, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
		gen6: {
			desc: "O usuário fica protegido da maioria dos ataques feitos por outros Pokémon neste turno, e Pokémon que fizerem contato com o usuário perdem 1/8 do HP máximo, arredondado para baixo. Este golpe tem 1/X de chance de ter sucesso, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno.",
		},
	},
	spinout: {
		desc: "Diminui a Velocidade do usuário em 2 estágios.",
		shortDesc: "Diminui a Velocidade do usuário em 2.",
	},
	spiritbreak: {
		desc: "Tem 100% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Sp. Atk do alvo em 1.",
	},
	spiritshackle: {
		desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Impede o alvo de sair de campo.",
		gen7: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
	},
	spite: {
		desc: "Faz o último golpe usado pelo alvo perder 4 PP. Falha se o alvo ainda não tiver usado nenhum golpe, se o golpe tiver 0 PP, ou se o alvo não conhecer mais o golpe.",
		shortDesc: "Diminui em 4 o PP do último golpe do alvo.",
		gen3: {
			desc: "Faz o último golpe usado pelo alvo perder de 2 a 5 PP, aleatoriamente. Falha se o alvo ainda não tiver usado nenhum golpe, se o golpe tiver 0 ou 1 PP, ou se o alvo não conhecer mais o golpe.",
			shortDesc: "Diminui em 2-5 o PP do último golpe do alvo.",
		},
		gen2: {
			desc: "Faz o último golpe usado pelo alvo perder de 2 a 5 PP, aleatoriamente. Falha se o alvo ainda não tiver usado nenhum golpe, ou se o golpe tiver 0 PP.",
		},
		activate: "  O PP de {MOVE} de {TARGET} foi reduzido em {NUMBER}!",
	},
	spitup: {
		desc: "O poder é igual a 100 vezes a contagem de Stockpile do usuário. Falha se a contagem de Stockpile do usuário for 0. Tendo este golpe sucesso ou não, a Defesa e a Defesa Especial do usuário diminuem tantos estágios quanto Stockpile as aumentou, e a contagem de Stockpile do usuário volta a 0.",
		shortDesc: "Mais poder com mais usos de Stockpile.",
		gen4: {
			desc: "O poder é igual a 100 vezes a contagem de Stockpile do usuário. Este golpe não aplica variação de dano. Falha se a contagem de Stockpile do usuário for 0. A menos que não haja alvo, tendo este golpe sucesso ou não, a Defesa e a Defesa Especial do usuário diminuem tantos estágios quanto Stockpile as aumentou, e a contagem de Stockpile do usuário volta a 0.",
		},
		gen3: {
			desc: "O dano é multiplicado pela contagem de Stockpile do usuário. Este golpe não aplica variação de dano e não pode ser acerto crítico. Falha se a contagem de Stockpile do usuário for 0. A menos que este golpe erre, a contagem de Stockpile do usuário volta a 0.",
		},
	},
	splash: {
		shortDesc: "Sem uso competitivo.",
		activate: "  Mas nada aconteceu!",
	},
	splinteredstormshards: {
		desc: "Encerra os efeitos de Electric Terrain, Grassy Terrain, Misty Terrain e Psychic Terrain.",
		shortDesc: "Encerra os efeitos de terreno.",
	},
	splishysplash: {
		desc: "Tem 30% de chance de paralisar o alvo.",
		shortDesc: "30% de chance de paralisar o alvo.",
	},
	spore: {
		shortDesc: "Faz o alvo adormecer.",
	},
	spotlight: {
		desc: "Até o fim do turno, todos os ataques de alvo único dos oponentes do alvo são redirecionados para o alvo. Esses ataques são redirecionados para o alvo antes que possam ser refletidos por Magic Coat ou pela habilidade Magic Bounce, ou atraídos pelas habilidades Lightning Rod ou Storm Drain. Falha se não for uma batalha em Duplas ou Battle Royal.",
		shortDesc: "Golpes dos oponentes do alvo vão nele neste turno.",
	},
	springtidestorm: {
		desc: "Tem 30% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "30% de chance de -1 Atk do(s) oponente(s).",
	},
	stealthrock: {
		desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo. Falha se o efeito já estiver ativo no lado adversário. Os oponentes perdem 1/32, 1/16, 1/8, 1/4 ou 1/2 do HP máximo, arredondado para baixo, de acordo com sua fraqueza ao tipo Rock: 0,25×, 0,5×, neutro, 2× ou 4×, respectivamente. Pode ser removido do lado adversário se qualquer Pokémon usar Tidy Up, ou se qualquer Pokémon adversário usar Mortal Spin, Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Fere oponentes que entram. Usa fraqueza ao tipo Rock.",
		gen8: {
			desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo. Falha se o efeito já estiver ativo no lado adversário. Os oponentes perdem 1/32, 1/16, 1/8, 1/4 ou 1/2 do HP máximo, arredondado para baixo, de acordo com sua fraqueza ao tipo Rock: 0,25×, 0,5×, neutro, 2× ou 4×, respectivamente. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		},
		gen5: {
			desc: "Coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo. Falha se o efeito já estiver ativo no lado adversário. Os oponentes perdem 1/32, 1/16, 1/8, 1/4 ou 1/2 do HP máximo, arredondado para baixo, de acordo com sua fraqueza ao tipo Rock: 0,25×, 0,5×, neutro, 2× ou 4×, respectivamente. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin com sucesso, ou for atingido por Defog.",
		},
		start: "  Pedras pontiagudas flutuam no ar ao redor de {TEAM}!",
		end: "  As pedras pontiagudas desapareceram de perto de {TEAM}!",
		damage: "  Pedras pontiagudas cravaram em {POKEMON}!",
	},
	steameruption: {
		desc: "Tem 30% de chance de queimar o alvo. O alvo descongela se estiver congelado.",
		shortDesc: "30% de chance de queimar o alvo. Descongela o alvo.",
	},
	steamroller: {
		desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
		gen5: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra se o alvo tiver usado Minimize enquanto estava em campo.",
		},
	},
	steelbeam: {
		desc: "Tendo este golpe sucesso ou não, e mesmo que isso o faça desmaiar, o usuário perde 1/2 do HP máximo, arredondado para cima, a menos que tenha a habilidade Magic Guard.",
		shortDesc: "Usuário perde 50% do HP máximo.",
	},
	steelroller: {
		desc: "Falha se não houver terreno ativo. Encerra os efeitos de Electric Terrain, Grassy Terrain, Misty Terrain e Psychic Terrain.",
		shortDesc: "Falha se não houver terreno ativo. Encerra o terreno.",
	},
	steelwing: {
		desc: "Tem 10% de chance de aumentar a Defesa do usuário em 1 estágio.",
		shortDesc: "10% de chance de aumentar a Defesa do usuário em 1.",
	},
	stickyweb: {
		desc: "Coloca uma armadilha no lado adversário do campo, diminuindo em 1 estágio a Velocidade de cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Falha se o efeito já estiver ativo no lado adversário. Pode ser removido do lado adversário se qualquer Pokémon usar Tidy Up, ou se qualquer Pokémon adversário usar Mortal Spin, Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Oponentes no chão que entram: -1 de Velocidade.",
		gen8: {
			desc: "Coloca uma armadilha no lado adversário do campo, diminuindo em 1 estágio a Velocidade de cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Falha se o efeito já estiver ativo no lado adversário. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		},
		start: "  Uma teia pegajosa foi estendida no chão ao redor de {TEAM}!",
		end: "  A teia pegajosa desapareceu do chão ao redor de {TEAM}!",
		activate: "  {POKEMON} ficou preso em uma teia pegajosa!",
	},
	stockpile: {
		desc: "Aumenta a Defesa e a Defesa Especial do usuário em 1 estágio. A contagem de Stockpile do usuário aumenta em 1. Falha se a contagem de Stockpile do usuário for 3. A contagem de Stockpile do usuário volta a 0 quando ele deixa de estar em campo.",
		shortDesc: "Aumenta Defesa e Sp. Def do usuário em 1. Máx. 3 usos.",
		gen3: {
			desc: "A contagem de Stockpile do usuário aumenta em 1. Falha se a contagem de Stockpile do usuário for 3. A contagem de Stockpile do usuário volta a 0 quando ele deixa de estar em campo.",
			shortDesc: "Aumenta a contagem de Stockpile em 1. Máx. 3 usos.",
		},
		start: "  {POKEMON} acumulou {NUMBER}!",
		end: "  O efeito acumulado de {POKEMON} passou!",
	},
	stokedsparksurfer: {
		desc: "Tem 100% de chance de paralisar o alvo.",
		shortDesc: "100% de chance de paralisar o alvo.",
	},
	stomp: {
		desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
		gen5: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra se o alvo tiver usado Minimize enquanto estava em campo.",
		},
		gen4: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O poder dobra se o alvo tiver usado Minimize enquanto estava em campo.",
		},
		gen3: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O dano dobra se o alvo tiver usado Minimize enquanto estava em campo.",
		},
		gen2: {
			desc: "Tem 30% de chance de fazer o alvo recuar. O poder dobra se o alvo estiver sob o efeito de Minimize.",
		},
		gen1: {
			desc: "Tem 30% de chance de fazer o alvo recuar.",
		},
	},
	stompingtantrum: {
		desc: "O poder dobra se o último golpe do usuário no turno anterior, incluindo golpes chamados por outros golpes ou usados por meio de Instruct, Magic Coat, Snatch ou das habilidades Dancer ou Magic Bounce, não tiver produzido nenhum de seus efeitos normais, sem contar o dano de High Jump Kick, Jump Kick ou Mind Blown malsucedidos, ou se o usuário tiver sido impedido de agir por qualquer efeito que não seja recarga ou Sky Drop. Um golpe bloqueado por Baneful Bunker, Detect, King's Shield, Protect, Spiky Shield, Crafty Shield, Mat Block, Quick Guard ou Wide Guard não dobra o poder deste golpe, nem Bounce ou Fly terminando antes do tempo por causa do efeito de Gravity, Smack Down ou Thousand Arrows.",
		shortDesc: "O poder dobra se o último golpe do usuário falhou.",
	},
	stoneaxe: {
		desc: "Se este golpe tiver sucesso, coloca uma armadilha no lado adversário do campo, causando dano a cada Pokémon adversário que entrar em campo. Os oponentes perdem 1/32, 1/16, 1/8, 1/4 ou 1/2 do HP máximo, arredondado para baixo, de acordo com sua fraqueza ao tipo Rock: 0,25×, 0,5×, neutro, 2× ou 4×, respectivamente. Pode ser removido do lado adversário se qualquer Pokémon usar Tidy Up, ou se qualquer Pokémon adversário usar Mortal Spin, Rapid Spin ou Defog com sucesso, ou for atingido por Defog.",
		shortDesc: "Coloca Stealth Rock no lado do alvo.",
	},
	stoneedge: {
		desc: "Tem maior chance de acerto crítico.",
		shortDesc: "Alta taxa de acerto crítico.",
	},
	storedpower: {
		desc: "O poder é igual a 20+(X × 20), onde X é a soma das mudanças de estágio de atributo do usuário maiores que 0.",
		shortDesc: " + 20 de poder por aumento de atributo do usuário.",
	},
	stormthrow: {
		desc: "Este golpe sempre resulta em acerto crítico, a menos que o alvo esteja sob o efeito de Lucky Chant ou tenha as habilidades Battle Armor ou Shell Armor.",
		shortDesc: "Sempre resulta em acerto crítico.",
	},
	strangesteam: {
		desc: "Tem 20% de chance de confundir o alvo.",
		shortDesc: "20% de chance de confundir o alvo.",
	},
	strength: {
		shortDesc: "Sem efeito adicional.",
	},
	strengthsap: {
		desc: "Diminui o Ataque do alvo em 1 estágio. O usuário recupera HP igual ao atributo Ataque do alvo, calculado com o estágio de atributo dele antes de este golpe ser usado. Se o usuário estiver segurando Big Root, o HP recuperado é 1,3× o normal, arredondado com a metade para baixo. Falha se o estágio de Ataque do alvo for -6.",
		shortDesc: "Cura HP = Atk do alvo. Diminui o Atk do alvo em 1.",
	},
	stringshot: {
		desc: "Diminui a Velocidade do alvo em 2 estágios.",
		shortDesc: "Diminui a Velocidade do(s) oponente(s) em 2.",
		gen5: {
			desc: "Diminui a Velocidade do alvo em 1 estágio.",
			shortDesc: "Diminui a Velocidade do(s) oponente(s) em 1.",
		},
		gen2: {
			shortDesc: "Diminui a Velocidade do alvo em 1.",
		},
	},
	struggle: {
		desc: "Causa dano sem tipo a um Pokémon adversário aleatório. Se este golpe tiver sucesso, o usuário perde 1/4 do HP máximo, arredondado para cima a partir da metade, e a habilidade Rock Head não impede isso. Este golpe é usado automaticamente se nenhum dos golpes conhecidos do usuário puder ser selecionado.",
		shortDesc: "Usuário perde 1/4 do HP máximo.",
		gen6: {
			desc: "Causa dano sem tipo a um Pokémon adversário adjacente aleatório. Se este golpe tiver sucesso, o usuário perde 1/4 do HP máximo, arredondado para cima a partir da metade, e a habilidade Rock Head não impede isso. Este golpe é usado automaticamente se nenhum dos golpes conhecidos do usuário puder ser selecionado.",
		},
		gen4: {
			desc: "Causa dano sem tipo a um Pokémon adversário aleatório. Se este golpe tiver sucesso, o usuário perde 1/4 do HP máximo, arredondado para baixo, e a habilidade Rock Head não impede isso. Este golpe é usado automaticamente se nenhum dos golpes conhecidos do usuário puder ser selecionado.",
		},
		gen3: {
			desc: "Causa dano sem tipo a um Pokémon adversário aleatório. Se este golpe tiver sucesso, o usuário sofre dano igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP, e a habilidade Rock Head não impede isso. Este golpe é usado automaticamente se nenhum dos golpes conhecidos do usuário puder ser selecionado.",
			shortDesc: "Usuário perde 1/4 do HP perdido pelo alvo.",
		},
		gen2: {
			desc: "Causa dano sem tipo. Se este golpe tiver sucesso, o usuário sofre dano igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Este golpe é usado automaticamente se nenhum dos golpes conhecidos do usuário puder ser selecionado.",
		},
		gen1: {
			desc: "Causa dano do tipo Normal. Se este golpe tiver sucesso, o usuário sofre dano igual a 1/2 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Este golpe é usado automaticamente se nenhum dos golpes conhecidos do usuário puder ser selecionado.",
			shortDesc: "Usuário perde 1/2 do HP perdido pelo alvo.",
		},
	},
	strugglebug: {
		desc: "Tem 100% de chance de diminuir o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "100% de chance de -1 Sp. Atk do(s) oponente(s).",
	},
	stuffcheeks: {
		desc: "Este golpe não pode ser selecionado a menos que o usuário esteja segurando uma Berry. O usuário come sua Berry e aumenta sua Defesa em 2 estágios. Este efeito não é impedido pelas habilidades Klutz ou Unnerve, nem pelos efeitos de Embargo ou Magic Room. Falha se o usuário não estiver segurando uma Berry.",
		shortDesc: "Precisa segurar Berry. Come a Berry, Def +2.",
		champions: {
			desc: "Falha se o usuário não estiver segurando uma Berry. O usuário come sua Berry e aumenta sua Defesa em 2 estágios. Este efeito não é impedido pelas habilidades Klutz ou Unnerve, nem pelos efeitos de Embargo ou Magic Room.",
			shortDesc: "Falha sem Berry segurada. Come a Berry, Def +2.",
		},
	},
	stunspore: {
		desc: "Paralisa o alvo.",
		shortDesc: "Paralisa o alvo.",
		gen3: {
			desc: "Paralisa o alvo. Este golpe não ignora imunidade de tipo.",
		},
		gen1: {
			desc: "Paralisa o alvo.",
		},
	},
	submission: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 1/4 de dano de recuo.",
		gen4: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
		},
		gen2: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP. Se este golpe atingir um substituto, o dano de recuo é sempre 1 HP.",
		},
		gen1: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Se este golpe quebrar o substituto do alvo, o usuário não sofre dano de recuo.",
		},
	},
	substitute: {
		desc: "O usuário gasta 1/4 do HP máximo, arredondado para baixo, e o coloca em um substituto que toma seu lugar na batalha. O substituto é removido quando recebe dano suficiente, se o usuário sair de campo ou desmaiar, ou se qualquer Pokémon usar Tidy Up. Baton Pass pode ser usado para transferir o substituto para um aliado, e o substituto mantém o HP restante. Até ser quebrado, o substituto recebe o dano de todos os ataques feitos por outros Pokémon e protege o usuário de efeitos de status e mudanças de estágio de atributo causados por outros Pokémon. Golpes sonoros e Pokémon com a habilidade Infiltrator ignoram substitutos. O usuário ainda sofre dano normal de clima e de efeitos de status enquanto está atrás do substituto. Se o substituto quebrar durante um ataque de múltiplos acertos, o usuário sofrerá dano dos acertos restantes. Se um substituto for criado enquanto o usuário estiver preso por um golpe de prender, o efeito de prender termina imediatamente. Falha se o usuário não tiver HP suficiente para criar um substituto sem desmaiar, ou se já tiver um substituto.",
		shortDesc: "Usuário gasta 1/4 do HP máx. para criar substituto.",
		gen8: {
			desc: "O usuário gasta 1/4 do HP máximo, arredondado para baixo, e o coloca em um substituto que toma seu lugar na batalha. O substituto é removido quando recebe dano suficiente, ou se o usuário sair de campo ou desmaiar. Baton Pass pode ser usado para transferir o substituto para um aliado, e o substituto mantém o HP restante. Até ser quebrado, o substituto recebe o dano de todos os ataques feitos por outros Pokémon e protege o usuário de efeitos de status e mudanças de estágio de atributo causados por outros Pokémon. Golpes sonoros e Pokémon com a habilidade Infiltrator ignoram substitutos. O usuário ainda sofre dano normal de clima e de efeitos de status enquanto está atrás do substituto. Se o substituto quebrar durante um ataque de múltiplos acertos, o usuário sofrerá dano dos acertos restantes. Se um substituto for criado enquanto o usuário estiver preso por um golpe de prender, o efeito de prender termina imediatamente. Falha se o usuário não tiver HP suficiente para criar um substituto sem desmaiar, ou se já tiver um substituto.",
		},
		gen5: {
			desc: "O usuário gasta 1/4 do HP máximo, arredondado para baixo, e o coloca em um substituto que toma seu lugar na batalha. O substituto é removido quando recebe dano suficiente, ou se o usuário sair de campo ou desmaiar. Baton Pass pode ser usado para transferir o substituto para um aliado, e o substituto mantém o HP restante. Até ser quebrado, o substituto recebe o dano de todos os ataques feitos por outros Pokémon e protege o usuário de efeitos de status e mudanças de estágio de atributo causados por outros Pokémon. O usuário ainda sofre dano normal de clima e de efeitos de status enquanto está atrás do substituto. Se o substituto quebrar durante um ataque de múltiplos acertos, o usuário sofrerá dano dos acertos restantes. Se um substituto for criado enquanto o usuário estiver preso por um golpe de prender, o efeito de prender termina imediatamente. Falha se o usuário não tiver HP suficiente para criar um substituto sem desmaiar, ou se já tiver um substituto.",
		},
		gen1: {
			desc: "O usuário gasta 1/4 do HP máximo, arredondado para baixo, e o coloca em um substituto que toma seu lugar na batalha. O substituto tem 1 HP mais o HP usado para criá-lo, e é removido quando recebe dano suficiente ou 255 de dano de uma só vez, ou se o usuário sair de campo ou desmaiar. Até ser quebrado, o substituto recebe o dano de todos os ataques feitos pelo Pokémon adversário e protege o usuário de efeitos de status e mudanças de estágio de atributo causados pelo oponente, a menos que o efeito seja Disable, Leech Seed, sono, paralisia primária ou confusão secundária e o substituto do usuário não tenha quebrado. O usuário ainda sofre dano normal de efeitos de status enquanto está atrás do substituto, a menos que seja dano de confusão, que é aplicado ao substituto do Pokémon adversário. Se o substituto quebrar durante um ataque de múltiplos acertos, o ataque termina. Falha se o usuário não tiver HP suficiente para criar um substituto, ou se já tiver um substituto. O usuário criará um substituto e depois desmaiará se o HP atual dele for exatamente 1/4 do HP máximo.",
			shortDesc: "Usuário gasta 1/4 do HP máx. para criar Substitute.",
		},
		start: "  {POKEMON} criou um substituto!",
		alreadyStarted: "  {POKEMON} já tem um substituto!",
		end: "  O substituto de {POKEMON} desapareceu!",
		fail: "  Mas não há HP suficiente para criar um substituto!",
		activate: "  O substituto recebeu o dano no lugar de {POKEMON}!",
	},
	subzeroslammer: {
		shortDesc: "Poder igual ao Z-Power do golpe base.",
	},
	suckerpunch: {
		desc: "Falha se o alvo não tiver escolhido um ataque físico, um ataque especial ou Me First para usar neste turno, ou se o alvo agir antes do usuário.",
		shortDesc: "Geralmente age primeiro. Falha se o alvo não atacar.",
		gen4: {
			desc: "Falha se o alvo não tiver escolhido um ataque físico ou especial para usar neste turno, ou se o alvo agir antes do usuário.",
		},
	},
	sunnyday: {
		desc: "Por 5 turnos, o clima se torna sol. O dano de ataques do tipo Fire é multiplicado por 1,5 e o dano de ataques do tipo Water é multiplicado por 0,5 durante o efeito. Dura 8 turnos se o usuário estiver segurando Heat Rock. Falha se o clima atual for sol.",
		shortDesc: "Por 5 turnos, o sol fortalece golpes do tipo Fire.",
		gen3: {
			desc: "Por 5 turnos, o clima se torna sol. O dano de ataques do tipo Fire é multiplicado por 1,5 e o dano de ataques do tipo Water é multiplicado por 0,5 durante o efeito. Falha se o clima atual for sol.",
		},
		gen2: {
			desc: "Por 5 turnos, o clima se torna sol, mesmo que o clima atual já seja sol. O dano de ataques do tipo Fire é multiplicado por 1,5 e o dano de ataques do tipo Water é multiplicado por 0,5 durante o efeito.",
		},
	},
	sunsteelstrike: {
		desc: "Este golpe e seus efeitos ignoram as habilidades de outros Pokémon.",
		shortDesc: "Ignora as habilidades de outros Pokémon.",
	},
	supercellslam: {
		desc: "Se este ataque não tiver sucesso, o usuário perde metade do HP máximo, arredondado para baixo, como dano de queda. Pokémon com a habilidade Magic Guard não são afetados por dano de queda. O dano dobra e não há verificação de precisão se o alvo tiver usado Minimize enquanto estava em campo.",
		shortDesc: "Usuário perde 50% do HP máximo se errar.",
	},
	superfang: {
		desc: "Causa ao alvo dano igual à metade do HP atual dele, arredondado para baixo, mas não menos que 1 HP.",
		shortDesc: "Causa dano igual a 1/2 do HP atual do alvo.",
		gen1: {
			desc: "Causa ao alvo dano igual à metade do HP atual dele, arredondado para baixo, mas não menos que 1 HP. Este golpe ignora imunidade de tipo.",
			shortDesc: "Dano = 1/2 do HP atual do alvo. Atinge tipo Ghost.",
		},
	},
	superpower: {
		desc: "Diminui o Ataque e a Defesa do usuário em 1 estágio.",
		shortDesc: "Diminui o Ataque e a Defesa do usuário em 1.",
	},
	supersonic: {
		shortDesc: "Deixa o alvo confuso.",
	},
	supersonicskystrike: {
		shortDesc: "Poder igual ao Z-Power do golpe base.",
	},
	surf: {
		desc: "O dano dobra se o alvo estiver usando Dive.",
		shortDesc: "Atinge Pokémon adjacentes. Dano dobra contra Dive.",
		gen4: {
			desc: "O poder dobra se o alvo estiver usando Dive.",
			shortDesc: "Atinge Pokémon adjacentes. Poder dobra contra Dive.",
		},
		gen2: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
		gen3: {
			shortDesc: "Atinge oponentes. Poder dobra contra Dive.",
		},
	},
	surgingstrikes: {
		desc: "Acerta três vezes. Este golpe sempre resulta em acerto crítico, a menos que o alvo esteja sob o efeito de Lucky Chant ou tenha as habilidades Battle Armor ou Shell Armor.",
		shortDesc: "Sempre resulta em acerto crítico. Acerta 3 vezes.",
	},
	swagger: {
		desc: "Aumenta o Ataque do alvo em 2 estágios e o deixa confuso.",
		shortDesc: "Aumenta o Ataque do alvo em 2 e o deixa confuso.",
		gen2: {
			desc: "Aumenta o Ataque do alvo em 2 estágios e o deixa confuso. Este golpe erra se o Ataque do alvo não puder ser aumentado.",
		},
	},
	swallow: {
		desc: "O usuário recupera HP de acordo com sua contagem de Stockpile. Recupera 1/4 do HP máximo se for 1, 1/2 do HP máximo se for 2, ambos arredondados com a metade para baixo, e todo o HP se for 3. Falha se a contagem de Stockpile do usuário for 0. A Defesa e a Defesa Especial do usuário diminuem tantos estágios quanto Stockpile as aumentou, e a contagem de Stockpile do usuário volta a 0.",
		shortDesc: "Cura o usuário conforme os usos de Stockpile.",
		gen4: {
			desc: "O usuário recupera HP de acordo com sua contagem de Stockpile. Recupera 1/4 do HP máximo se for 1, 1/2 do HP máximo se for 2, ambos arredondados para baixo, e todo o HP se for 3. Falha se a contagem de Stockpile do usuário for 0. A Defesa e a Defesa Especial do usuário diminuem tantos estágios quanto Stockpile as aumentou, e a contagem de Stockpile do usuário volta a 0.",
		},
		gen3: {
			desc: "O usuário recupera HP de acordo com sua contagem de Stockpile. Recupera 1/4 do HP máximo se for 1, 1/2 do HP máximo se for 2, ambos arredondados com a metade para baixo, e todo o HP se for 3. Falha se a contagem de Stockpile do usuário for 0. A contagem de Stockpile do usuário volta a 0.",
		},
	},
	sweetkiss: {
		shortDesc: "Deixa o alvo confuso.",
	},
	sweetscent: {
		desc: "Diminui a evasão do alvo em 2 estágios.",
		shortDesc: "Diminui a evasão do(s) oponente(s) em 2.",
		gen5: {
			desc: "Diminui a evasão do alvo em 1 estágio.",
			shortDesc: "Diminui a evasão do(s) oponente(s) em 1.",
		},
		gen2: {
			shortDesc: "Diminui a evasão do alvo em 1.",
		},
	},
	swift: {
		desc: "Este golpe não verifica a precisão.",
		shortDesc: "Não verifica a precisão. Atinge oponentes.",
		gen1: {
			desc: "Este golpe não verifica a precisão e acerta mesmo se o alvo estiver usando Dig ou Fly.",
			shortDesc: "Nunca erra, mesmo contra Dig e Fly.",
		},
		gen2: {
			shortDesc: "Este golpe não verifica a precisão.",
		},
	},
	switcheroo: {
		desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Adamant Crystal, Lustrous Globe, Griseous Core, Plate, Drive, Memory, Rusted Sword, Rusted Shield, Booster Energy ou Mask de Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, Pokémon Paradox ou Ogerpon, respectivamente. Neste caso, os Pokémon Paradox incluem todas as espécies com as habilidades Protosynthesis e Quark Drive, exceto Gouging Fire, Raging Bolt, Iron Boulder e Iron Crown. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		shortDesc: "Usuário troca seu item segurado com o do alvo.",
		champions: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, ou se o usuário tentar dar ou tirar uma Mega Stone da espécie que pode Megaevoluir com ela. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen8: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword ou Rusted Shield de Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian ou Zamazenta, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen7: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando um Z-Crystal, se o usuário tentar dar ou tirar uma Mega Stone da espécie que pode Megaevoluir com ela, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Griseous Orb, Plate, Drive ou Memory de Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvally, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen6: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se o usuário tentar dar ou tirar uma Mega Stone da espécie que pode Megaevoluir com ela, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Griseous Orb, Plate ou Drive de Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen5: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando Mail, ou se o usuário tentar dar ou tirar Griseous Orb, Plate ou Drive de Giratina, Arceus ou Genesect, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen4: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando Mail ou Griseous Orb, se algum deles tiver a habilidade Multitype, se algum deles estiver sob o efeito de Knock Off, ou se o alvo tiver a habilidade Sticky Hold.",
		},
	},
	swordsdance: {
		desc: "Aumenta o Ataque do usuário em 2 estágios.",
		shortDesc: "Aumenta o Ataque do usuário em 2.",
	},
	synchronoise: {
		desc: "O alvo é imune se não compartilhar nenhum tipo com o usuário.",
		shortDesc: "Atinge adjacentes que compartilham tipo com o usuário.",
	},
	synthesis: {
		desc: "O usuário recupera 1/2 do HP máximo se houver ventos fortes ou nenhum clima ativo, ou se o usuário estiver segurando Utility Umbrella; 2/3 do HP máximo se o clima for sol intenso ou sol; e 1/4 do HP máximo se o clima for chuva forte, chuva, tempestade de areia ou neve; tudo arredondado com a metade para baixo.",
		shortDesc: "Cura o usuário; a quantidade depende do clima.",
		gen8: {
			desc: "O usuário recupera 1/2 do HP máximo se houver ventos fortes ou nenhum clima ativo, ou se o usuário estiver segurando Utility Umbrella; 2/3 do HP máximo se o clima for sol intenso ou sol; e 1/4 do HP máximo se o clima for granizo, chuva forte, chuva ou tempestade de areia; tudo arredondado com a metade para baixo.",
		},
		gen7: {
			desc: "O usuário recupera 1/2 do HP máximo se houver ventos fortes ou nenhum clima ativo; 2/3 do HP máximo se o clima for sol intenso ou sol; e 1/4 do HP máximo se o clima for granizo, chuva forte, chuva ou tempestade de areia; tudo arredondado com a metade para baixo.",
		},
		gen5: {
			desc: "O usuário recupera 1/2 do HP máximo se não houver clima ativo; 2/3 do HP máximo se o clima for sol; e 1/4 do HP máximo se o clima for granizo, chuva ou tempestade de areia; tudo arredondado com a metade para baixo.",
		},
		gen4: {
			desc: "O usuário recupera 1/2 do HP máximo se não houver clima ativo; 2/3 do HP máximo se o clima for sol; e 1/4 do HP máximo se o clima for granizo, chuva ou tempestade de areia; tudo arredondado para baixo.",
		},
		gen2: {
			desc: "O usuário recupera 1/2 do HP máximo se não houver clima ativo; todo o HP se o clima for sol; e 1/4 do HP máximo se o clima for chuva ou tempestade de areia; tudo arredondado para baixo.",
		},
	},
	syrupbomb: {
		desc: "Se este golpe tiver sucesso, faz a Velocidade do alvo diminuir em 1 estágio ao fim de cada turno por 3 turnos.",
		shortDesc: "Velocidade do alvo cai 1 estágio por 3 turnos.",
		start: "  {POKEMON} ficou coberto de calda doce e pegajosa!",
	},
	tackle: {
		shortDesc: "Sem efeito adicional.",
	},
	tachyoncutter: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, ele sofrerá dano do segundo acerto. Este golpe não verifica a precisão.",
		shortDesc: "Acerta 2 vezes. Este golpe não verifica a precisão.",
	},
	tailglow: {
		desc: "Aumenta o Ataque Especial do usuário em 3 estágios.",
		shortDesc: "Aumenta o Sp. Atk do usuário em 3.",
		gen4: {
			desc: "Aumenta o Ataque Especial do usuário em 2 estágios.",
			shortDesc: "Aumenta o Sp. Atk do usuário em 2.",
		},
	},
	tailslap: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
	},
	tailwhip: {
		desc: "Diminui a Defesa do alvo em 1 estágio.",
		shortDesc: "Diminui a Defesa do(s) oponente(s) em 1.",
		gen2: {
			shortDesc: "Diminui a Defesa do alvo em 1.",
		},
	},
	tailwind: {
		desc: "Por 4 turnos, o usuário e os membros da sua equipe têm a Velocidade dobrada. Falha se este golpe já estiver em efeito no lado do usuário.",
		shortDesc: "Por 4 turnos, a Velocidade dos aliados é dobrada.",
		gen4: {
			desc: "Por 3 turnos, o usuário e os membros da sua equipe têm a Velocidade dobrada. Falha se este golpe já estiver em efeito no lado do usuário.",
			shortDesc: "Por 3 turnos, a Velocidade dos aliados é dobrada.",
		},
		start: "  Tailwind soprou por trás de {TEAM}!",
		end: "  Tailwind de {TEAM} se dissipou!",
	},
	takedown: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 1/4 de dano de recuo.",
		gen4: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
		},
		gen2: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP. Se este golpe atingir um substituto, o dano de recuo é sempre 1 HP.",
		},
		gen1: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP. Se este golpe quebrar o substituto do alvo, o usuário não sofre dano de recuo.",
		},
	},
	takeheart: {
		desc: "O usuário cura sua condição de status não volátil. Aumenta o Ataque Especial e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Cura o status do usuário; +1 Sp. Atk e Sp. Def.",
	},
	tarshot: {
		desc: "Diminui a Velocidade do alvo em 1 estágio. Até o alvo sair de campo, a efetividade de golpes do tipo Fire contra ele é dobrada.",
		shortDesc: "Alvo: -1 Spe e fica mais fraco contra o tipo Fire.",
		start: "  {POKEMON} ficou mais fraco contra o tipo Fire!",
	},
	taunt: {
		desc: "Impede o alvo de usar golpes que não causam dano nos próximos três turnos dele. Pokémon com a habilidade Oblivious ou protegidos pela habilidade Aroma Veil são imunes.",
		shortDesc: "Alvo não pode usar golpes de status por 3 turnos.",
		gen7: {
			desc: "Impede o alvo de usar golpes que não causam dano nos próximos três turnos dele. Pokémon com a habilidade Oblivious ou protegidos pela habilidade Aroma Veil são imunes. Golpes com Z-Power ainda podem ser selecionados e executados durante este efeito.",
		},
		gen6: {
			desc: "Impede o alvo de usar golpes que não causam dano nos próximos três turnos dele. Pokémon com a habilidade Oblivious ou protegidos pela habilidade Aroma Veil são imunes.",
		},
		gen5: {
			desc: "Impede o alvo de usar golpes que não causam dano nos próximos três turnos dele.",
		},
		gen4: {
			desc: "Por 3 a 5 turnos, impede o alvo de usar golpes que não causam dano.",
			shortDesc: "Por 3-5 turnos, o alvo não pode usar golpes de status.",
		},
		gen3: {
			desc: "Por 2 turnos, impede o alvo de usar golpes que não causam dano.",
			shortDesc: "Por 2 turnos, o alvo não pode usar golpes de status.",
		},
		start: "  {POKEMON} caiu na provocação!",
		end: "  {POKEMON} se livrou da provocação!",
		cant: "{POKEMON} não pode usar {MOVE} depois da provocação!",
	},
	tearfullook: {
		desc: "Diminui o Ataque e o Ataque Especial do alvo em 1 estágio.",
		shortDesc: "Diminui o Ataque e o Sp. Atk do alvo em 1.",
	},
	teatime: {
		desc: "Todos os Pokémon em campo consomem as Berries que estão segurando. Este efeito não é impedido por substitutos, pelas habilidades Klutz ou Unnerve, nem pelos efeitos de Embargo ou Magic Room. Falha se nenhum Pokémon em campo estiver segurando uma Berry.",
		shortDesc: "Todos os Pokémon em campo consomem suas Berries.",
		activate: "  É hora do chá! Todos devoraram suas Berries!",
		fail: "  Mas nada aconteceu!",
	},
	technoblast: {
		desc: "O tipo deste golpe depende do Drive segurado pelo usuário.",
		shortDesc: "O tipo varia conforme o Drive segurado.",
	},
	tectonicrage: {
		shortDesc: "Poder igual ao Z-Power do golpe base.",
	},
	teeterdance: {
		desc: "Deixa o alvo confuso.",
		shortDesc: "Confunde Pokémon adjacentes.",
	},
	telekinesis: {
		desc: "Por 3 turnos, o alvo não consegue evitar nenhum ataque feito contra ele, exceto golpes OHKO, enquanto permanecer em campo. Durante o efeito, o alvo fica imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes, Sticky Web e da habilidade Arena Trap enquanto permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar recebe o efeito. Ingrain, Smack Down, Thousand Arrows e Iron Ball se sobrepõem a este golpe se o alvo estiver sob algum de seus efeitos. Falha se o alvo já estiver sob este efeito ou sob os efeitos de Ingrain, Smack Down ou Thousand Arrows. O alvo é imune a este golpe ao ser usado se sua espécie for Diglett, Dugtrio, Alolan Diglett, Alolan Dugtrio, Sandygast, Palossand, ou Gengar Megaevoluído. Mega Gengar não pode ficar sob este efeito de forma alguma.",
		shortDesc: "Por 3 turnos, o alvo flutua, mas golpes não erram nele.",
		gen6: {
			desc: "Por 3 turnos, o alvo não consegue evitar nenhum ataque feito contra ele, exceto golpes OHKO, enquanto permanecer em campo. Durante o efeito, o alvo fica imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes, Sticky Web e da habilidade Arena Trap enquanto permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar recebe o efeito. Ingrain, Smack Down, Thousand Arrows e Iron Ball se sobrepõem a este golpe se o alvo estiver sob algum de seus efeitos. Falha se o alvo já estiver sob este efeito ou sob os efeitos de Ingrain, Smack Down ou Thousand Arrows. O alvo é imune a este golpe ao ser usado se sua espécie for Diglett, Dugtrio, ou Gengar Megaevoluído. Mega Gengar não pode ficar sob este efeito de forma alguma.",
		},
		gen5: {
			desc: "Por 3 turnos, o alvo não consegue evitar nenhum ataque feito contra ele, exceto golpes OHKO, enquanto permanecer em campo. Durante o efeito, o alvo fica imune a ataques do tipo Ground e aos efeitos de Spikes, Toxic Spikes e da habilidade Arena Trap enquanto permanecer em campo. Se o alvo usar Baton Pass, o Pokémon que entrar no lugar recebe o efeito. Ingrain, Smack Down e Iron Ball se sobrepõem a este golpe se o alvo estiver sob algum de seus efeitos. Falha se o alvo já estiver sob este efeito ou sob os efeitos de Ingrain ou Smack Down. O alvo é imune a este golpe ao ser usado se sua espécie for Diglett ou Dugtrio.",
		},
		start: "  {POKEMON} foi lançado ao ar!",
		end: "  {POKEMON} foi libertado da telecinese!",
	},
	teleport: {
		desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado.",
		shortDesc: "Usuário sai de campo.",
		gen7letsgo: {
			desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado.",
			shortDesc: "Usuário sai de campo.",
		},
		gen7: {
			desc: "Falha quando usado.",
			shortDesc: "Falha quando usado.",
		},
	},
	temperflare: {
		desc: "O poder dobra se o último golpe do usuário no turno anterior, incluindo golpes chamados por outros golpes ou usados por meio de Instruct, Magic Coat, Snatch ou das habilidades Dancer ou Magic Bounce, não tiver produzido nenhum de seus efeitos normais, sem contar o dano de High Jump Kick, Jump Kick ou Mind Blown malsucedidos, ou se o usuário tiver sido impedido de agir por qualquer efeito que não seja recarga ou Sky Drop. Um golpe bloqueado por Baneful Bunker, Detect, King's Shield, Protect, Spiky Shield, Crafty Shield, Mat Block, Quick Guard ou Wide Guard não dobra o poder deste golpe, nem Bounce ou Fly terminando antes do tempo por causa do efeito de Gravity, Smack Down ou Thousand Arrows.",
		shortDesc: "O poder dobra se o último golpe do usuário falhou.",
	},
	terablast: {
		desc: "Se o usuário estiver Terastalizado, este golpe se torna um ataque físico se o Ataque do usuário for maior que seu Ataque Especial, considerando mudanças de estágio de atributo, e o tipo deste golpe passa a ser o mesmo do Tera Type do usuário. Além disso, se o Tera Type do usuário for do tipo Stellar, este golpe tem 100 de poder, é superefetivo contra alvos Terastalizados e neutro contra os demais alvos, e diminui o Ataque e o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "Terastalizado: físico se Atk > SpA, tipo = Tera Type.",
	},
	terastarstorm: {
		desc: "Se o usuário for Terapagos na Forma Stellar, este golpe passa a ser do tipo Stellar, atinge todos os Pokémon adversários e se torna um ataque físico se o Ataque do usuário for maior que seu Ataque Especial, considerando mudanças de estágio de atributo.",
		shortDesc: "Terapagos-Stellar: tipo Stellar, atinge os 2 oponentes.",
	},
	terrainpulse: {
		desc: "O poder dobra se o usuário estiver no chão e houver um terreno ativo, e o tipo deste golpe muda de acordo: tipo Electric durante Electric Terrain, tipo Grass durante Grassy Terrain, tipo Fairy durante Misty Terrain e tipo Psychic durante Psychic Terrain.",
		shortDesc: "Usuário no terreno: poder dobra, tipo varia.",
	},
	thief: {
		desc: "Se este ataque tiver sucesso e o usuário não tiver desmaiado, ele rouba o item segurado do alvo se o usuário não estiver segurando nenhum. Um alvo com a habilidade Sticky Hold não perde seu item segurado se não tiver desmaiado. O item do alvo não é roubado se for Blue Orb, Red Orb, Adamant Crystal, Lustrous Globe, Griseous Core, Plate, Drive, Memory, Rusted Sword, Rusted Shield, Booster Energy ou Mask segurado por Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, Pokémon Paradox ou Ogerpon, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Neste caso, os Pokémon Paradox incluem todas as espécies com as habilidades Protosynthesis e Quark Drive, exceto Gouging Fire, Raging Bolt, Iron Boulder e Iron Crown. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		shortDesc: "Se o usuário não tiver item, rouba o do alvo.",
		champions: {
			desc: "Se este ataque tiver sucesso e o usuário não estiver segurando nenhum item, ele rouba o item segurado do alvo. Um alvo com a habilidade Sticky Hold não perde seu item segurado se não tiver desmaiado. O item do alvo não é roubado se for uma Mega Stone e o usuário ou o alvo for a espécie que pode Megaevoluir com ela. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen8: {
			desc: "Se este ataque tiver sucesso e o usuário não tiver desmaiado, ele rouba o item segurado do alvo se o usuário não estiver segurando nenhum. Um alvo com a habilidade Sticky Hold não perde seu item segurado se não tiver desmaiado. O item do alvo não é roubado se for Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword ou Rusted Shield segurado por Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian ou Zamazenta, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen7: {
			desc: "Se este ataque tiver sucesso e o usuário não tiver desmaiado, ele rouba o item segurado do alvo se o usuário não estiver segurando nenhum. Um alvo com a habilidade Sticky Hold não perde seu item segurado se não tiver desmaiado. O item do alvo não é roubado se for um Z-Crystal, uma Mega Stone segurada pela espécie que pode Megaevoluir com ela, ou Blue Orb, Red Orb, Griseous Orb, Plate, Drive ou Memory segurado por Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvally, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen6: {
			desc: "Se este ataque tiver sucesso e o usuário não tiver desmaiado, ele rouba o item segurado do alvo se o usuário não estiver segurando nenhum. Um alvo com a habilidade Sticky Hold não perde seu item segurado se não tiver desmaiado. O item do alvo não é roubado se for uma Mega Stone segurada pela espécie que pode Megaevoluir com ela, ou Blue Orb, Red Orb, Griseous Orb, Plate ou Drive segurado por Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen5: {
			desc: "Se este ataque tiver sucesso e o usuário não tiver desmaiado, ele rouba o item segurado do alvo se o usuário não estiver segurando nenhum. Um alvo com a habilidade Sticky Hold não perde seu item segurado se não tiver desmaiado. O item do alvo não é roubado se for Mail, ou se for Griseous Orb, Plate ou Drive segurado por Giratina, Arceus ou Genesect, respectivamente, ou se o usuário for uma dessas espécies e o alvo estiver segurando o item correspondente. Itens perdidos para este golpe não podem ser recuperados com Recycle nem com a habilidade Harvest.",
		},
		gen4: {
			desc: "Se este ataque tiver sucesso e o usuário não estiver segurando nenhum item, ele rouba o item segurado do alvo. O item do alvo não é roubado se for Mail ou Griseous Orb, ou se o alvo tiver as habilidades Multitype ou Sticky Hold. Itens perdidos para este golpe não podem ser recuperados com Recycle.",
		},
		gen3: {
			desc: "Se este ataque tiver sucesso e o usuário não estiver segurando nenhum item, ele rouba o item segurado do alvo. O item do alvo não é roubado se for Mail ou Enigma Berry, ou se o alvo tiver a habilidade Sticky Hold. Itens perdidos para este golpe não podem ser recuperados com Recycle.",
		},
		gen2: {
			desc: "Tem 100% de chance de roubar o item segurado do alvo se o usuário não estiver segurando nenhum. O item do alvo não é roubado se for Mail.",
		},
	},
	thousandarrows: {
		desc: "Este golpe pode atingir Pokémon no ar, o que inclui Pokémon do tipo Flying, Pokémon com a habilidade Levitate, Pokémon segurando Air Balloon e Pokémon sob o efeito de Magnet Rise ou Telekinesis. Se o alvo for do tipo Flying e ainda não estiver no chão, este golpe causa dano neutro independentemente de seu(s) outro(s) tipo(s). Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop. Se este golpe atingir um alvo sob o efeito de Bounce, Fly, Magnet Rise ou Telekinesis, o efeito termina. Se o alvo for do tipo Flying e não tiver usado Roost neste turno, ou for um Pokémon com a habilidade Levitate, ele perde a imunidade a ataques do tipo Ground e à habilidade Arena Trap enquanto permanecer em campo. Durante o efeito, Magnet Rise falha para o alvo e Telekinesis falha contra o alvo.",
		shortDesc: "Derruba oponentes. 1º acerto neutro no tipo Flying.",
	},
	thousandwaves: {
		desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo.",
		shortDesc: "Atinge oponentes adjacentes e os impede de trocar.",
		gen7: {
			desc: "Impede o alvo de sair de campo. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. Se o alvo sair de campo usando Baton Pass, o Pokémon que entrar no lugar continuará preso. O efeito termina se o usuário sair de campo.",
		},
	},
	thrash: {
		desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso logo após agir no último turno do efeito, se ainda não estiver confuso. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não tiver sucesso contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk e o usuário estiver dormindo, o golpe é usado por um turno e não confunde o usuário.",
		shortDesc: "Dura 2-3 turnos. Depois, confunde o usuário.",
		gen6: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso logo após agir no último turno do efeito, se ainda não estiver confuso. Este golpe mira um Pokémon adversário adjacente aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não tiver sucesso contra o alvo no primeiro turno do efeito ou no segundo turno de um efeito de três turnos, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não confunde o usuário.",
		},
		gen4: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso ao fim do último turno do efeito, se ainda não estiver confuso. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, estiver dormindo no início de um turno, ou se o ataque não tiver sucesso contra o alvo, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não confunde o usuário.",
		},
		gen3: {
			desc: "O usuário passa dois ou três turnos preso a este golpe e fica confuso ao fim do último turno do efeito, se ainda não estiver confuso. Este golpe mira um Pokémon adversário aleatório a cada turno. Se o usuário for impedido de agir, adormecer, ficar congelado, ou se o ataque não tiver sucesso contra o alvo, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não confunde o usuário.",
		},
		gen2: {
			desc: "Tendo este golpe sucesso ou não, o usuário passa dois ou três turnos preso a este golpe e fica confuso logo após agir no último turno do efeito, mesmo que já esteja confuso. Se o usuário for impedido de agir, o efeito termina sem causar confusão. Se este golpe for chamado por Sleep Talk, o golpe é usado por um turno e não confunde o usuário.",
		},
		gen1: {
			desc: "Tendo este golpe sucesso ou não, o usuário passa três ou quatro turnos preso a este golpe e fica confuso logo após agir no último turno do efeito, mesmo que já esteja confuso. Se o usuário for impedido de agir, o efeito termina sem causar confusão. Durante o efeito, a precisão deste golpe é sobrescrita a cada turno pela precisão calculada atual, incluindo mudanças de estágio de atributo, mas sem ficar abaixo de 1/256 nem acima de 255/256.",
			shortDesc: "Dura 3-4 turnos. Depois, confunde o usuário.",
		},
	},
	throatchop: {
		desc: "Por 2 turnos, o alvo não pode usar golpes sonoros.",
		shortDesc: "Por 2 turnos, o alvo não pode usar golpes sonoros.",
		gen7: {
			desc: "Por 2 turnos, o alvo não pode usar golpes sonoros. Golpes sonoros com Z-Power ainda podem ser selecionados e executados durante este efeito.",
		},
		cant: "Os efeitos de Throat Chop impedem {POKEMON} de usar certos golpes!",
	},
	thunder: {
		desc: "Tem 30% de chance de paralisar o alvo. Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se o clima for sol intenso ou sol, a precisão deste golpe é 50%. Se este golpe for usado contra um Pokémon segurando Utility Umbrella, a precisão deste golpe continua em 70%.",
		shortDesc: "30% de chance de paralisar. Não erra na chuva.",
		gen7: {
			desc: "Tem 30% de chance de paralisar o alvo. Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se o clima for sol intenso ou sol, a precisão deste golpe é 50%.",
		},
		gen5: {
			desc: "Tem 30% de chance de paralisar o alvo. Este golpe pode atingir um alvo que esteja usando Bounce, Fly ou Sky Drop, ou que esteja sob o efeito de Sky Drop. Se o clima for chuva, este golpe não verifica a precisão. Se o clima for sol, a precisão deste golpe é 50%.",
		},
		gen4: {
			desc: "Tem 30% de chance de paralisar o alvo. Este golpe pode atingir um alvo que esteja usando Bounce ou Fly. Se o clima for chuva, este golpe não verifica a precisão. Se o clima for sol, a precisão deste golpe é 50%.",
		},
		gen2: {
			desc: "Tem 30% de chance de paralisar o alvo. Este golpe pode atingir um alvo que esteja usando Fly. Se o clima for chuva, este golpe não verifica a precisão. Se o clima for sol, a precisão deste golpe é 50%.",
		},
		gen1: {
			desc: "Tem 10% de chance de paralisar o alvo.",
			shortDesc: "10% de chance de paralisar o alvo.",
		},
	},
	thunderbolt: {
		desc: "Tem 10% de chance de paralisar o alvo.",
		shortDesc: "10% de chance de paralisar o alvo.",
	},
	thundercage: {
		desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		start: "  {SOURCE} prendeu {POKEMON}!",
	},
	thunderclap: {
		desc: "Falha se o alvo não tiver escolhido um ataque físico, um ataque especial ou Me First para usar neste turno, ou se o alvo agir antes do usuário.",
		shortDesc: "Geralmente age primeiro. Falha se o alvo não atacar.",
	},
	thunderfang: {
		desc: "Tem 10% de chance de paralisar o alvo e 10% de chance de fazê-lo recuar.",
		shortDesc: "10% de chance de paralisar. 10% de fazer recuar.",
	},
	thunderouskick: {
		desc: "Tem 100% de chance de diminuir a Defesa do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir a Defesa do alvo em 1.",
	},
	thunderpunch: {
		desc: "Tem 10% de chance de paralisar o alvo.",
		shortDesc: "10% de chance de paralisar o alvo.",
	},
	thundershock: {
		desc: "Tem 10% de chance de paralisar o alvo.",
		shortDesc: "10% de chance de paralisar o alvo.",
	},
	thunderwave: {
		desc: "Paralisa o alvo. Este golpe não ignora imunidade de tipo.",
		shortDesc: "Paralisa o alvo.",
	},
	tickle: {
		desc: "Diminui o Ataque e a Defesa do alvo em 1 estágio.",
		shortDesc: "Diminui o Ataque e a Defesa do alvo em 1.",
	},
	tidyup: {
		desc: "Aumenta o Ataque e a Velocidade do usuário em 1 estágio. Remove os substitutos de todos os Pokémon em campo e encerra os efeitos de Spikes, Stealth Rock, Sticky Web e Toxic Spikes nos dois lados.",
		shortDesc: "Usuário +1 Atk e Spe. Remove substitutos/hazards.",
		activate: "  Arrumação concluída!",
	},
	topsyturvy: {
		desc: "Os estágios de atributo positivos do alvo se tornam negativos e vice-versa. Falha se todos os estágios de atributo do alvo forem 0.",
		shortDesc: "Inverte os estágios de atributo do alvo.",
	},
	torchsong: {
		desc: "Tem 100% de chance de aumentar o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "100% de chance de aumentar o Sp. Atk do usuário em 1.",
	},
	torment: {
		desc: "Impede o alvo de selecionar o mesmo golpe dois turnos seguidos. Este efeito termina quando o alvo sai de campo.",
		shortDesc: "Alvo não pode escolher o mesmo golpe 2 vezes seguidas.",
		start: "  {POKEMON} foi submetido ao tormento!",
		end: "  {POKEMON} não está mais atormentado!",
	},
	toxic: {
		desc: "Envenena gravemente o alvo. Se um Pokémon do tipo Poison usar este golpe, o alvo não consegue evitar o ataque, mesmo que esteja no meio de um golpe de dois turnos.",
		shortDesc: "Envenena gravemente. Usuário do tipo Poison não erra.",
		gen5: {
			desc: "Envenena gravemente o alvo.",
			shortDesc: "Envenena gravemente o alvo.",
		},
	},
	toxicspikes: {
		desc: "Coloca uma armadilha no lado adversário do campo, envenenando cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até duas vezes antes de falhar. Os Pokémon adversários ficam envenenados com uma camada e gravemente envenenados com duas camadas. Pode ser removido do lado adversário se qualquer Pokémon usar Tidy Up, ou se qualquer Pokémon adversário usar Mortal Spin, Rapid Spin ou Defog com sucesso, for atingido por Defog, ou se um Pokémon do tipo Poison que esteja no chão entrar em campo. Safeguard impede que a equipe adversária seja envenenada ao entrar em campo, mas um substituto não impede.",
		shortDesc: "Envenena oponentes no chão ao entrar. Máx. 2 camadas.",
		gen8: {
			desc: "Coloca uma armadilha no lado adversário do campo, envenenando cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até duas vezes antes de falhar. Os Pokémon adversários ficam envenenados com uma camada e gravemente envenenados com duas camadas. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin ou Defog com sucesso, for atingido por Defog, ou se um Pokémon do tipo Poison que esteja no chão entrar em campo. Safeguard impede que a equipe adversária seja envenenada ao entrar em campo, mas um substituto não impede.",
		},
		gen5: {
			desc: "Coloca uma armadilha no lado adversário do campo, envenenando cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até duas vezes antes de falhar. Os Pokémon adversários ficam envenenados com uma camada e gravemente envenenados com duas camadas. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin com sucesso, for atingido por Defog, ou se um Pokémon do tipo Poison que esteja no chão entrar em campo. Safeguard impede que a equipe adversária seja envenenada ao entrar em campo, mas um substituto não impede.",
		},
		gen4: {
			desc: "Coloca uma armadilha no lado adversário do campo, envenenando cada Pokémon adversário que entrar em campo, a menos que seja um Pokémon do tipo Flying ou tenha a habilidade Levitate. Pode ser usado até duas vezes antes de falhar. Os Pokémon adversários ficam envenenados com uma camada e gravemente envenenados com duas camadas. Pode ser removido do lado adversário se qualquer Pokémon adversário usar Rapid Spin com sucesso, for atingido por Defog, ou se um Pokémon do tipo Poison que esteja no chão entrar em campo. Safeguard impede que a equipe adversária seja envenenada ao entrar em campo, assim como entrar em campo com um substituto.",
		},
		start: "  Espinhos venenosos foram espalhados pelo chão ao redor de {TEAM}!",
		end: "  Os espinhos venenosos desapareceram do chão ao redor de {TEAM}!",
	},
	toxicthread: {
		desc: "Diminui a Velocidade do alvo em 1 estágio e o envenena.",
		shortDesc: "Diminui a Velocidade do alvo em 1 e o envenena.",
		champions: {
			desc: "Diminui a Velocidade do alvo em 2 estágios e o envenena.",
			shortDesc: "Diminui a Velocidade do alvo em 2 e o envenena.",
		},
	},
	trailblaze: {
		desc: "Tem 100% de chance de aumentar a Velocidade do usuário em 1 estágio.",
		shortDesc: "100% de chance de aumentar a Spe do usuário em 1.",
	},
	transform: {
		desc: "O usuário se transforma no alvo. Os atributos atuais, estágios de atributo, tipos, golpes, habilidade, peso, gênero e sprite do alvo são copiados. O nível e o HP do usuário permanecem os mesmos, e cada golpe copiado recebe apenas 5 PP, com máximo de 5 PP cada. O usuário não pode mais mudar de forma, caso tivesse essa capacidade. Este golpe falha se atingir um substituto, se o usuário ou o alvo já estiver transformado, ou se algum deles estiver sob o efeito de Illusion.",
		shortDesc: "Copia atributos, golpes, tipos e habilidade do alvo.",
		gen4: {
			desc: "O usuário se transforma no alvo. Os atributos atuais, estágios de atributo, tipos, golpes, habilidade, peso, IVs, espécie e sprite do alvo são copiados. O nível e o HP do usuário permanecem os mesmos, e cada golpe copiado recebe apenas 5 PP. Este golpe falha se o alvo tiver se transformado.",
		},
		gen2: {
			desc: "O usuário se transforma no alvo. Os atributos atuais, estágios de atributo, tipos, golpes, DVs, espécie e sprite do alvo são copiados. O nível e o HP do usuário permanecem os mesmos, e cada golpe copiado recebe apenas 5 PP. Este golpe falha se o alvo tiver se transformado.",
			shortDesc: "Copia atributos, golpes, tipos e espécie do alvo.",
		},
		gen1: {
			desc: "O usuário se transforma no alvo. Os atributos atuais, estágios de atributo, tipos, golpes, DVs, espécie e sprite do alvo são copiados. O nível e o HP do usuário permanecem os mesmos, e cada golpe copiado recebe apenas 5 PP. Este golpe pode atingir um alvo que esteja usando Dig ou Fly.",
		},
		transform: "{POKEMON} se transformou em {SPECIES}!",
	},
	triattack: {
		desc: "Tem 20% de chance de queimar, congelar ou paralisar o alvo.",
		shortDesc: "20% de chance de paralisar, queimar ou congelar o alvo.",
		gen2: {
			desc: "Este golpe escolhe queimadura, congelamento ou paralisia aleatoriamente, e tem 20% de chance de infligir esse status ao alvo. Se o alvo estiver congelado e a queimadura for escolhida, ele descongela.",
		},
		gen1: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
	},
	trick: {
		desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Adamant Crystal, Lustrous Globe, Griseous Core, Plate, Drive, Memory, Rusted Sword, Rusted Shield, Booster Energy ou Mask de Kyogre, Groudon, Dialga, Palkia, Giratina, Arceus, Genesect, Silvally, Zacian, Zamazenta, Pokémon Paradox ou Ogerpon, respectivamente. Neste caso, os Pokémon Paradox incluem todas as espécies com as habilidades Protosynthesis e Quark Drive, exceto Gouging Fire, Raging Bolt, Iron Boulder e Iron Crown. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		shortDesc: "Usuário troca seu item segurado com o do alvo.",
		champions: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, ou se o usuário tentar dar ou tirar uma Mega Stone da espécie que pode Megaevoluir com ela. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen8: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Griseous Orb, Plate, Drive, Memory, Rusted Sword ou Rusted Shield de Kyogre, Groudon, Giratina, Arceus, Genesect, Silvally, Zacian ou Zamazenta, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen7: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando um Z-Crystal, se o usuário tentar dar ou tirar uma Mega Stone da espécie que pode Megaevoluir com ela, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Griseous Orb, Plate, Drive ou Memory de Kyogre, Groudon, Giratina, Arceus, Genesect ou Silvally, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen6: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se o usuário tentar dar ou tirar uma Mega Stone da espécie que pode Megaevoluir com ela, ou se o usuário tentar dar ou tirar Blue Orb, Red Orb, Griseous Orb, Plate ou Drive de Kyogre, Groudon, Giratina, Arceus ou Genesect, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen5: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando Mail, ou se o usuário tentar dar ou tirar Griseous Orb, Plate ou Drive de Giratina, Arceus ou Genesect, respectivamente. O alvo é imune a este golpe se tiver a habilidade Sticky Hold.",
		},
		gen4: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando Mail ou Griseous Orb, se algum deles tiver a habilidade Multitype, se algum deles estiver sob o efeito de Knock Off, ou se o alvo tiver a habilidade Sticky Hold.",
		},
		gen3: {
			desc: "O usuário troca seu item segurado com o item segurado do alvo. Falha se nem o usuário nem o alvo tiverem item segurado, se algum deles estiver segurando Mail, se algum deles estiver sob o efeito de Knock Off, ou se o alvo tiver a habilidade Sticky Hold.",
		},
		activate: "  {POKEMON} trocou de item com o alvo!",
	},
	trickortreat: {
		desc: "Adiciona o tipo Ghost ao alvo, fazendo-o ter, na prática, dois ou três tipos. Falha se o alvo já for do tipo Ghost. Se Forest's Curse adicionar um tipo ao alvo, esse tipo substitui o tipo adicionado por este golpe, e vice-versa.",
		shortDesc: "Adiciona o tipo Ghost ao(s) tipo(s) do alvo.",
	},
	trickroom: {
		desc: "Por 5 turnos, a Velocidade de cada Pokémon é recalculada para determinar a ordem do turno. Durante o efeito, a Velocidade de cada Pokémon é considerada (10000 - sua Velocidade normal) e, se esse valor for maior que 8191, subtrai-se 8192 dele. Se este golpe for usado durante o efeito, o efeito termina.",
		shortDesc: "Age por último. Por 5 turnos, a ordem é invertida.",
		gen4: {
			desc: "Por 5 turnos, todos os Pokémon em campo com menor Velocidade agem antes dos que têm maior Velocidade, dentro de suas faixas de prioridade. Se este golpe for usado durante o efeito, o efeito termina.",
		},
	},
	triplearrows: {
		desc: "Tem 50% de chance de diminuir a Defesa do alvo em 1 estágio, 30% de chance de fazê-lo recuar e maior chance de acerto crítico.",
		shortDesc: "Alta taxa de crítico. Alvo: 50% -1 Def, 30% recuar.",
	},
	tripleaxel: {
		desc: "Acerta três vezes. O poder aumenta para 40 no segundo acerto e para 60 no terceiro. Este golpe verifica a precisão a cada acerto, e o ataque termina se o alvo evitar um acerto. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará três vezes.",
		shortDesc: "Acerta 3 vezes. Cada acerto pode errar; poder sobe.",
	},
	tripledive: {
		desc: "Acerta três vezes.",
		shortDesc: "Acerta 3 vezes.",
	},
	triplekick: {
		desc: "Acerta três vezes. O poder aumenta para 20 no segundo acerto e para 30 no terceiro. Este golpe verifica a precisão a cada acerto, e o ataque termina se o alvo evitar um acerto. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará três vezes.",
		shortDesc: "Acerta 3 vezes. Cada acerto pode errar; poder sobe.",
		gen4: {
			desc: "Acerta três vezes. O poder aumenta para 20 no segundo acerto e para 30 no terceiro. Este golpe verifica a precisão a cada acerto, e o ataque termina se o alvo evitar um acerto. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta três vezes. O poder aumenta para 20 no segundo acerto e para 30 no terceiro. Este golpe verifica a precisão a cada acerto, e o ataque termina se o alvo evitar um acerto. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes.",
		},
		gen2: {
			desc: "Acerta de uma a três vezes, aleatoriamente. O poder aumenta para 20 no segundo acerto e para 30 no terceiro.",
			shortDesc: "Acerta 1-3 vezes. O poder sobe a cada acerto.",
		},
	},
	tropkick: {
		desc: "Tem 100% de chance de diminuir o Ataque do alvo em 1 estágio.",
		shortDesc: "100% de chance de diminuir o Ataque do alvo em 1.",
	},
	trumpcard: {
		desc: "O poder deste golpe depende da quantidade de PP restante depois da redução normal de PP e da resolução da habilidade Pressure: 200 de poder com 0 PP, 80 de poder com 1 PP, 60 de poder com 2 PP, 50 de poder com 3 PP e 40 de poder com 4 PP ou mais.",
		shortDesc: "Mais poder quanto menos PP este golpe tiver.",
	},
	twinbeam: {
		desc: "Acerta duas vezes. Se o primeiro acerto quebrar o substituto do alvo, ele sofrerá dano do segundo acerto.",
		shortDesc: "Acerta 2 vezes em um turno.",
	},
	twineedle: {
		desc: "Acerta duas vezes, e cada acerto tem 20% de chance de envenenar o alvo. Se o primeiro acerto quebrar o substituto do alvo, ele sofrerá dano do segundo acerto.",
		shortDesc: "Acerta 2 vezes. Cada acerto: 20% de envenenar.",
		gen4: {
			desc: "Acerta duas vezes, e cada acerto tem 20% de chance de envenenar o alvo. Se o primeiro acerto quebrar o substituto do alvo, ele sofrerá dano do segundo acerto. Se o alvo tiver Focus Sash e estiver com o HP cheio quando este golpe começou, ele não será nocauteado, independentemente do número de acertos.",
		},
		gen3: {
			desc: "Acerta duas vezes, e cada acerto tem 20% de chance de envenenar o alvo. Se o primeiro acerto quebrar o substituto do alvo, ele sofrerá dano do segundo acerto.",
		},
		gen2: {
			desc: "Acerta duas vezes, e o segundo acerto tem 20% de chance de envenenar o alvo. Se o primeiro acerto quebrar o substituto do alvo, ele sofrerá dano do segundo acerto, mas não poderá ser envenenado por ele.",
			shortDesc: "Acerta 2 vezes. O último: 20% de envenenar.",
		},
		gen1: {
			desc: "Acerta duas vezes, e o segundo acerto tem 20% de chance de envenenar o alvo. Se o primeiro acerto quebrar o substituto do alvo, o golpe termina.",
		},
	},
	twinkletackle: {
		shortDesc: "Poder igual ao Z-Power do golpe base.",
	},
	twister: {
		desc: "Tem 20% de chance de fazer o alvo recuar. O poder dobra se o alvo estiver usando Bounce, Fly ou Sky Drop, ou estiver sob o efeito de Sky Drop.",
		shortDesc: "20% de chance de fazer recuar o(s) oponente(s).",
		gen4: {
			desc: "Tem 20% de chance de fazer o alvo recuar. O poder dobra se o alvo estiver usando Bounce ou Fly.",
		},
		gen2: {
			desc: "Tem 20% de chance de fazer o alvo recuar. O poder dobra se o alvo estiver usando Fly.",
			shortDesc: "20% de chance de fazer o alvo recuar.",
		},
	},
	upperhand: {
		desc: "Tem 100% de chance de fazer o alvo recuar. Falha se o alvo não tiver escolhido, para usar neste turno, um ataque físico ou especial com prioridade alterada maior que 0, ou se o alvo agir antes do usuário.",
		shortDesc: "100% de fazer recuar. Falha se o alvo não usar prioridade.",
	},
	uproar: {
		desc: "O usuário passa três turnos preso a este golpe. Este golpe mira um oponente aleatório a cada turno. No primeiro dos três turnos, todos os Pokémon em campo que estiverem dormindo acordam. Durante os três turnos, nenhum Pokémon em campo pode adormecer de forma alguma, e Pokémon que entrarem em campo durante o efeito não acordam. Se o usuário for impedido de agir ou o ataque não tiver sucesso contra o alvo durante um dos turnos, o efeito termina.",
		shortDesc: "Dura 3 turnos. Pokémon em campo não podem adormecer.",
		gen6: {
			desc: "O usuário passa três turnos preso a este golpe. Este golpe mira um oponente adjacente aleatório a cada turno. No primeiro dos três turnos, todos os Pokémon em campo que estiverem dormindo acordam. Durante os três turnos, nenhum Pokémon em campo pode adormecer de forma alguma, e Pokémon que entrarem em campo durante o efeito não acordam. Se o usuário for impedido de agir ou o ataque não tiver sucesso contra o alvo durante um dos turnos, o efeito termina.",
		},
		gen4: {
			desc: "O usuário passa de três a seis turnos preso a este golpe. Este golpe mira um oponente aleatório a cada turno. Durante o efeito, nenhum Pokémon em campo pode adormecer de forma alguma, e Pokémon que já estiverem dormindo acordam quando seu turno começa ou ao fim de cada turno, inclusive o último. Se o usuário for impedido de agir ou o ataque não tiver sucesso contra o alvo durante um dos turnos, o efeito termina.",
			shortDesc: "Dura 3-6 turnos. Pokémon em campo não podem dormir.",
		},
		gen3: {
			desc: "O usuário passa de dois a cinco turnos preso a este golpe. Este golpe mira um Pokémon adversário aleatório a cada turno. Durante o efeito, nenhum Pokémon em campo pode adormecer de forma alguma, e Pokémon que já estiverem dormindo acordam quando seu turno começa ou ao fim de cada turno, inclusive o último. Se o usuário for impedido de agir ou o ataque não tiver sucesso contra o alvo durante um dos turnos, o efeito termina.",
			shortDesc: "Dura 2-5 turnos. Pokémon em campo não podem dormir.",
		},
		start: "  {POKEMON} causou um alvoroço!",
		end: "  {POKEMON} se acalmou.",
		upkeep: "  {POKEMON} está fazendo um alvoroço!",
		block: "  Mas o alvoroço manteve {POKEMON} acordado!",
		blockSelf: "  Mas {POKEMON} não consegue dormir no meio do alvoroço!",
	},
	uturn: {
		desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado, ou se o alvo tiver saído de campo usando Eject Button ou pelo efeito das habilidades Emergency Exit ou Wimp Out.",
		shortDesc: "Usuário sai de campo após causar dano ao alvo.",
		gen6: {
			desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado, ou se o alvo tiver saído de campo usando Eject Button.",
		},
		gen4: {
			desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado.",
		},
		switchOut: "{POKEMON} voltou para {TRAINER}!",
	},
	vacuumwave: {
		desc: "Sem efeito adicional.",
		shortDesc: "Geralmente age primeiro.",
	},
	vcreate: {
		desc: "Diminui a Velocidade, a Defesa e a Defesa Especial do usuário em 1 estágio.",
		shortDesc: "Diminui Defesa, Sp. Def e Velocidade do usuário em 1.",
	},
	veeveevolley: {
		desc: "O poder é igual ao maior valor entre (Felicidade do usuário × 2/5), arredondado para baixo, e 1.",
		shortDesc: "Felicidade máxima: 102 de poder. Não erra.",
	},
	venomdrench: {
		desc: "Diminui o Ataque, o Ataque Especial e a Velocidade do alvo em 1 estágio se o alvo estiver envenenado. Falha se o alvo não estiver envenenado.",
		shortDesc: "-1 Atk/Sp. Atk/Velocidade em oponentes envenenados.",
	},
	venoshock: {
		desc: "O poder dobra se o alvo estiver envenenado.",
		shortDesc: "O poder dobra se o alvo estiver envenenado.",
	},
	victorydance: {
		desc: "Aumenta o Ataque, a Defesa e a Velocidade do usuário em 1 estágio.",
		shortDesc: "Aumenta Ataque, Defesa e Velocidade do usuário em 1.",
	},
	vinewhip: {
		shortDesc: "Sem efeito adicional.",
	},
	visegrip: {
		shortDesc: "Sem efeito adicional.",
	},
	vitalthrow: {
		desc: "Este golpe não verifica a precisão.",
		shortDesc: "Não verifica a precisão. Age por último.",
	},
	voltswitch: {
		desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado, ou se o alvo tiver saído de campo usando Eject Button ou pelo efeito das habilidades Emergency Exit ou Wimp Out.",
		shortDesc: "Usuário sai de campo após causar dano ao alvo.",
		gen6: {
			desc: "Se este golpe tiver sucesso e o usuário não tiver desmaiado, o usuário sai de campo mesmo se estiver preso e é substituído imediatamente por um membro da equipe escolhido. O usuário não sai de campo se não houver membros da equipe que não tenham desmaiado, ou se o alvo tiver saído de campo usando Eject Button.",
		},
	},
	volttackle: {
		desc: "Tem 10% de chance de paralisar o alvo. Se o alvo perder HP, o usuário sofre dano de recuo igual a 33% do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 33% de dano de recuo. 10% de paralisar o alvo.",
		gen4: {
			desc: "Tem 10% de chance de paralisar o alvo. Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/3 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Tem 1/3 de dano de recuo. 10% de paralisar o alvo.",
		},
		gen3: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/3 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Tem 1/3 de dano de recuo.",
		},
	},
	wakeupslap: {
		desc: "O poder dobra se o alvo estiver dormindo. Se o usuário não tiver desmaiado, o alvo acorda.",
		shortDesc: "Poder dobra se o alvo está dormindo; acorda o alvo.",
		gen4: {
			desc: "O poder dobra se o alvo estiver dormindo. Se este golpe tiver sucesso, o alvo acorda.",
		},
	},
	waterfall: {
		desc: "Tem 20% de chance de fazer o alvo recuar.",
		shortDesc: "20% de chance de fazer o alvo recuar.",
		gen3: {
			desc: "Sem efeito adicional.",
			shortDesc: "Sem efeito adicional.",
		},
	},
	watergun: {
		shortDesc: "Sem efeito adicional.",
	},
	waterpledge: {
		desc: "Se um dos aliados do usuário tiver escolhido usar Fire Pledge ou Grass Pledge neste turno e ainda não tiver agido, ele age imediatamente após o usuário, e o golpe do usuário não faz nada. Se combinado com Fire Pledge, o aliado usa Water Pledge com 150 de poder e um arco-íris aparece no lado do usuário por 4 turnos, o que dobra as chances de efeitos secundários e acumula com a habilidade Serene Grace, exceto que efeitos que fazem recuar só podem ter a chance dobrada uma vez. Se combinado com Grass Pledge, o aliado usa Grass Pledge com 150 de poder e um pântano aparece no lado do alvo por 4 turnos, o que reduz a Velocidade de cada Pokémon daquele lado a 1/4. Quando usado como golpe combinado, este golpe recebe STAB independentemente do tipo do usuário. Este golpe não consome o item Water Gem do usuário e não pode ser redirecionado pela habilidade Storm Drain.",
		shortDesc: "Use com Grass Pledge ou Fire Pledge para efeito extra.",
		activate: "  {POKEMON} está esperando o golpe de {TARGET}...",
		start: "  Um arco-íris apareceu no céu do lado de {TEAM}!",
		end: "  O arco-íris do lado de {TEAM} desapareceu!",
	},
	waterpulse: {
		desc: "Tem 20% de chance de confundir o alvo.",
		shortDesc: "20% de chance de confundir o alvo.",
	},
	watershuriken: {
		desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes. Se o usuário for Ash-Greninja com a habilidade Battle Bond, este golpe tem 20 de poder e sempre acerta três vezes. Se o usuário estiver segurando Loaded Dice, este golpe acertará 4-5 vezes.",
		shortDesc: "Geralmente age primeiro. Acerta 2-5 vezes em um turno.",
		gen8: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
		gen6: {
			desc: "Acerta de duas a cinco vezes. Tem 35% de chance de acertar duas ou três vezes e 15% de chance de acertar quatro ou cinco vezes. Se um dos acertos quebrar o substituto do alvo, ele sofrerá dano dos acertos restantes. Se o usuário tiver a habilidade Skill Link, este golpe sempre acertará cinco vezes.",
		},
	},
	watersport: {
		desc: "Por 5 turnos, todos os ataques do tipo Fire usados por qualquer Pokémon em campo têm o poder multiplicado por 0,33. Falha se este efeito já estiver ativo.",
		shortDesc: "Por 5 turnos, ataques do tipo Fire têm 1/3 do poder.",
		gen5: {
			desc: "Enquanto o usuário estiver em campo, todos os ataques do tipo Fire usados por qualquer Pokémon em campo têm o poder multiplicado por 0,33. Falha se este efeito já estiver ativo para qualquer Pokémon.",
			shortDesc: "Reduz ataques do tipo Fire a 1/3 do poder.",
		},
		gen4: {
			desc: "Enquanto o usuário estiver em campo, todos os ataques do tipo Fire usados por qualquer Pokémon em campo têm o poder reduzido à metade. Falha se este efeito já estiver ativo para o usuário. Baton Pass pode ser usado para transferir este efeito para um aliado.",
			shortDesc: "Reduz ataques do tipo Fire a 1/2 do poder.",
		},
	},
	waterspout: {
		desc: "O poder é igual a (HP atual do usuário × 150 / HP máximo do usuário), arredondado para baixo, mas não menos que 1.",
		shortDesc: "Menos poder quanto menor o HP. Atinge oponente(s).",
	},
	wavecrash: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 33% do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 33% de dano de recuo.",
	},
	weatherball: {
		desc: "O poder dobra se houver um clima ativo que não seja ventos fortes, e o tipo deste golpe muda de acordo: tipo Ice durante neve, tipo Water durante chuva forte ou chuva, tipo Rock durante tempestade de areia e tipo Fire durante sol intenso ou sol. Se o usuário estiver segurando Utility Umbrella e usar Weather Ball durante chuva forte, chuva, sol intenso ou sol, este golpe continua do tipo Normal e o poder não dobra.",
		shortDesc: "Poder dobra e o tipo varia em cada clima.",
		gen8: {
			desc: "O poder dobra se houver um clima ativo que não seja ventos fortes, e o tipo deste golpe muda de acordo: tipo Ice durante granizo, tipo Water durante chuva forte ou chuva, tipo Rock durante tempestade de areia e tipo Fire durante sol intenso ou sol. Se o usuário estiver segurando Utility Umbrella e usar Weather Ball durante chuva forte, chuva, sol intenso ou sol, este golpe continua do tipo Normal e o poder não dobra.",
		},
		gen5: {
			desc: "O poder dobra se houver um clima ativo, e o tipo deste golpe muda de acordo: tipo Ice durante granizo, tipo Water durante chuva, tipo Rock durante tempestade de areia e tipo Fire durante sol.",
		},
		gen3: {
			desc: "O dano dobra se houver um clima ativo, e o tipo deste golpe muda de acordo: tipo Ice durante granizo, tipo Water durante chuva, tipo Rock durante tempestade de areia e tipo Fire durante sol.",
			shortDesc: "Dano dobra e o tipo varia durante o clima.",
		},
		move: "Breakneck Blitz se transformou em {MOVE} por causa do clima!",
	},
	whirlpool: {
		desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen5: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do HP máximo dele (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen4: {
			desc: "Impede o alvo de trocar por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do HP máximo dele, arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		gen3: {
			desc: "Impede o alvo de trocar por dois a cinco turnos. Causa ao alvo dano igual a 1/16 do HP máximo dele, arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se usar Baton Pass. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		start: "  {POKEMON} ficou preso no redemoinho!",
	},
	whirlwind: {
		desc: "O alvo é forçado a sair de campo e é substituído por um aliado aleatório que não tenha desmaiado. Falha se o alvo for o último Pokémon não desmaiado da sua equipe, ou se o alvo tiver usado Ingrain antes ou tiver a habilidade Suction Cups.",
		shortDesc: "Força o alvo a trocar por um aliado aleatório.",
		gen4: {
			desc: "O alvo é forçado a sair de campo e é substituído por um aliado aleatório que não tenha desmaiado. Falha se o alvo for o último Pokémon não desmaiado da sua equipe, se o alvo tiver usado Ingrain antes ou tiver a habilidade Suction Cups, ou se o nível do usuário for menor que o do alvo e X × (nível do usuário + nível do alvo) / 256 + 1 for menor ou igual a (nível do alvo / 4), arredondado para baixo, onde X é um número aleatório de 0 a 255.",
		},
		gen2: {
			desc: "O alvo é forçado a sair de campo e é substituído por um aliado aleatório que não tenha desmaiado. Falha se o alvo for o último Pokémon não desmaiado da sua equipe, ou se o usuário agir antes do alvo.",
		},
		gen1: {
			desc: "Sem uso competitivo.",
			shortDesc: "Sem uso competitivo.",
		},
	},
	wickedblow: {
		desc: "Este golpe sempre resulta em acerto crítico, a menos que o alvo esteja sob o efeito de Lucky Chant ou tenha as habilidades Battle Armor ou Shell Armor.",
		shortDesc: "Sempre resulta em acerto crítico.",
	},
	wickedtorque: {
		desc: "Tem 10% de chance de fazer o alvo adormecer.",
		shortDesc: "10% de chance de fazer o alvo adormecer.",
	},
	wideguard: {
		desc: "O usuário e os membros da sua equipe ficam protegidos, neste turno, de golpes feitos por outros Pokémon, inclusive aliados, que tenham como alvo todos os oponentes adjacentes ou todos os Pokémon adjacentes. Este golpe modifica a mesma chance de 1/X de sucesso usada por outros golpes de proteção, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		shortDesc: "Protege aliados de golpes de alvo múltiplo no turno.",
		gen8: {
			desc: "O usuário e os membros da sua equipe ficam protegidos, neste turno, de golpes feitos por outros Pokémon, inclusive aliados, que tenham como alvo todos os oponentes adjacentes ou todos os Pokémon adjacentes. Este golpe modifica a mesma chance de 1/X de sucesso usada por outros golpes de proteção, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		gen7: {
			desc: "O usuário e os membros da sua equipe ficam protegidos, neste turno, de golpes feitos por outros Pokémon, inclusive aliados, que tenham como alvo todos os oponentes adjacentes ou todos os Pokémon adjacentes. Este golpe modifica a mesma chance de 1/X de sucesso usada por outros golpes de proteção, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		gen6: {
			desc: "O usuário e os membros da sua equipe ficam protegidos, neste turno, de ataques que causam dano feitos por outros Pokémon, inclusive aliados, que tenham como alvo todos os oponentes adjacentes ou todos os Pokémon adjacentes. Este golpe modifica a mesma chance de 1/X de sucesso usada por outros golpes de proteção, onde X começa em 1 e triplica cada vez que este golpe é usado com sucesso, mas não usa essa chance para verificar se falha. X volta a 1 se este golpe falhar, se o último golpe usado pelo usuário não for Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield ou Wide Guard, ou se tiver sido um desses golpes e a proteção do usuário tiver sido quebrada. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
			shortDesc: "Protege aliados de dano de alvo múltiplo no turno.",
		},
		gen5: {
			desc: "O usuário e os membros da sua equipe ficam protegidos, neste turno, de ataques que causam dano feitos por outros Pokémon, inclusive aliados, que tenham como alvo todos os oponentes adjacentes ou todos os Pokémon adjacentes. Este ataque tem 1/X de chance de ter sucesso, onde X começa em 1 e dobra cada vez que este golpe é usado com sucesso. X volta a 1 se este ataque falhar ou se o último golpe usado pelo usuário não for Detect, Endure, Protect, Quick Guard ou Wide Guard. Se X for 256 ou mais, este golpe tem 1/(2^32) de chance de ter sucesso. Falha se o usuário agir por último neste turno ou se este golpe já estiver em efeito no lado do usuário.",
		},
		start: "  Wide Guard protegeu {TEAM}!",
		block: "  Wide Guard protegeu {POKEMON}!",
	},
	wildboltstorm: {
		desc: "Tem 20% de chance de paralisar o alvo. Se o clima for chuva forte ou chuva, este golpe não verifica a precisão. Se este golpe for usado contra um Pokémon segurando Utility Umbrella, a precisão deste golpe continua em 80%.",
		shortDesc: "20% de paralisar o(s) oponente(s). Chuva: não erra.",
	},
	wildcharge: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/4 do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 1/4 de dano de recuo.",
	},
	willowisp: {
		desc: "Queima o alvo.",
		shortDesc: "Queima o alvo.",
	},
	wingattack: {
		shortDesc: "Sem efeito adicional.",
	},
	wish: {
		desc: "Ao fim do próximo turno, o Pokémon na posição do usuário recupera 1/2 do HP máximo do usuário, arredondado para baixo. Falha se este golpe já estiver em efeito para a posição do usuário.",
		shortDesc: "No próximo turno, recupera 50% do HP máx. do usuário.",
		gen4: {
			desc: "Ao fim do próximo turno, o Pokémon na posição do usuário recupera 1/2 do próprio HP máximo, arredondado para baixo. Falha se este golpe já estiver em efeito para a posição do usuário.",
			shortDesc: "No próximo turno, cura 50% do HP máx. de quem recebe.",
		},
		heal: "  O desejo de {NICKNAME} se realizou!",
	},
	withdraw: {
		desc: "Aumenta a Defesa do usuário em 1 estágio.",
		shortDesc: "Aumenta a Defesa do usuário em 1.",
	},
	wonderroom: {
		desc: "Por 5 turnos, todos os Pokémon em campo têm seus atributos Defesa e Defesa Especial trocados. Mudanças de estágio de atributo não são afetadas. Se este golpe for usado durante o efeito, o efeito termina.",
		shortDesc: "Por 5 turnos, Defesa e Sp. Def de todos são trocadas.",
	},
	woodhammer: {
		desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 33% do HP perdido pelo alvo, arredondado para cima a partir da metade, mas não menos que 1 HP.",
		shortDesc: "Tem 33% de dano de recuo.",
		gen4: {
			desc: "Se o alvo perder HP, o usuário sofre dano de recuo igual a 1/3 do HP perdido pelo alvo, arredondado para baixo, mas não menos que 1 HP.",
			shortDesc: "Tem 1/3 de dano de recuo.",
		},
	},
	workup: {
		desc: "Aumenta o Ataque e o Ataque Especial do usuário em 1 estágio.",
		shortDesc: "Aumenta o Ataque e o Sp. Atk do usuário em 1.",
	},
	worryseed: {
		desc: "Faz a habilidade do alvo se tornar Insomnia. Falha se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Insomnia, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Tera Shift, Truant, Zen Mode ou Zero to Hero.",
		shortDesc: "A habilidade do alvo se torna Insomnia.",
		gen8: {
			desc: "Faz a habilidade do alvo se tornar Insomnia. Falha se a habilidade do alvo for As One, Battle Bond, Comatose, Disguise, Gulp Missile, Ice Face, Insomnia, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Truant ou Zen Mode.",
		},
		gen7: {
			desc: "Faz a habilidade do alvo se tornar Insomnia. Falha se a habilidade do alvo for Battle Bond, Comatose, Disguise, Insomnia, Multitype, Power Construct, RKS System, Schooling, Shields Down, Stance Change, Truant ou Zen Mode.",
		},
		gen6: {
			desc: "Faz a habilidade do alvo se tornar Insomnia. Falha se a habilidade do alvo for Insomnia, Multitype, Stance Change ou Truant.",
		},
		gen5: {
			desc: "Faz a habilidade do alvo se tornar Insomnia. Falha se a habilidade do alvo for Insomnia, Multitype ou Truant.",
		},
		gen4: {
			desc: "Faz a habilidade do alvo se tornar Insomnia. Falha se a habilidade do alvo for Multitype ou Truant, ou se o alvo estiver segurando Griseous Orb.",
		},
	},
	wrap: {
		desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Shed Tail, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Mortal Spin, Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		shortDesc: "Prende e causa dano ao alvo por 4-5 turnos.",
		gen8: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen7: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/8 do HP máximo dele (1/6 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, Parting Shot, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen5: {
			desc: "Impede o alvo de trocar por quatro ou cinco turnos (sete turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do HP máximo dele (1/8 se o usuário estiver segurando Binding Band), arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass, U-turn ou Volt Switch. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen4: {
			desc: "Impede o alvo de trocar por dois a cinco turnos (sempre cinco turnos se o usuário estiver segurando Grip Claw). Causa ao alvo dano igual a 1/16 do HP máximo dele, arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se estiver segurando Shed Shell ou usar Baton Pass ou U-turn. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
			shortDesc: "Prende e causa dano ao alvo por 2-5 turnos.",
		},
		gen3: {
			desc: "Impede o alvo de trocar por dois a cinco turnos. Causa ao alvo dano igual a 1/16 do HP máximo dele, arredondado para baixo, ao fim de cada turno durante o efeito. O alvo ainda pode sair de campo se usar Baton Pass. O efeito termina se o usuário ou o alvo sair de campo, ou se o alvo usar Rapid Spin ou Substitute com sucesso. Este efeito não é cumulativo nem é reiniciado ao usar este ou outro golpe de prender.",
		},
		gen1: {
			desc: "O usuário passa de dois a cinco turnos usando este golpe. Tem 3/8 de chance de durar dois ou três turnos, e 1/8 de chance de durar quatro ou cinco turnos. O dano calculado no primeiro turno é usado em todos os outros turnos. Durante o efeito, o usuário não pode selecionar um golpe e o alvo não pode executar um golpe, mas ambos podem sair de campo. Se o usuário sair de campo, o alvo continua sem poder executar um golpe naquele turno. Se o alvo sair de campo, o usuário usa este golpe de novo automaticamente e, se ele tiver 0 PP no momento, o PP passa a ser 63. Se o usuário ou o alvo sair de campo, ou se o usuário for impedido de agir, o efeito termina. Este golpe pode impedir o alvo de agir mesmo que ele tenha imunidade de tipo, mas não causará dano.",
			shortDesc: "Impede o alvo de agir por 2-5 turnos.",
		},
		start: "  {POKEMON} foi enrolado por {SOURCE}!",
		move: "O ataque de {POKEMON} continua!",
	},
	wringout: {
		desc: "O poder é igual a 120 × (HP atual do alvo / HP máximo do alvo), arredondado com a metade para baixo, mas não menos que 1.",
		shortDesc: "Mais poder quanto mais HP o alvo tiver.",
		gen4: {
			desc: "O poder é igual a 120 × (HP atual do alvo / HP máximo do alvo) + 1, arredondado para baixo.",
		},
	},
	xscissor: {
		shortDesc: "Sem efeito adicional.",
	},
	yawn: {
		desc: "Faz o alvo adormecer ao fim do próximo turno. Falha ao ser usado se o alvo não puder adormecer ou se já tiver uma condição de status não volátil. Ao fim do próximo turno, se o alvo ainda estiver em campo, não tiver condição de status não volátil e puder adormecer, ele adormece. Se o alvo for afetado, este efeito não pode ser impedido por Safeguard ou por um substituto, nem por adormecer e acordar durante o efeito.",
		shortDesc: "Faz o alvo adormecer depois de 1 turno.",
		start: "  {POKEMON} ficou sonolento!",
	},
	zapcannon: {
		desc: "Tem 100% de chance de paralisar o alvo.",
		shortDesc: "100% de chance de paralisar o alvo.",
	},
	zenheadbutt: {
		desc: "Tem 20% de chance de fazer o alvo recuar.",
		shortDesc: "20% de chance de fazer o alvo recuar.",
	},
	zingzap: {
		desc: "Tem 30% de chance de fazer o alvo recuar.",
		shortDesc: "30% de chance de fazer o alvo recuar.",
	},
	zippyzap: {
		desc: "Tem 100% de chance de aumentar a evasão do usuário em 1 estágio.",
		shortDesc: "Age primeiro. Aumenta a evasão do usuário em 1.",
		gen7: {
			desc: "Sempre resulta em acerto crítico.",
			shortDesc: "Quase sempre age primeiro. Sempre crítico.",
		},
	},
};
