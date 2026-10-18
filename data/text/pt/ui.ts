import type { TranslationCatalog } from '../../../sim/dex-text';

// Translations useful for clients, servers, and third parties
// Battle UI, tooltips, dexes, etc
export const translations: TranslationCatalog = {
	// #region Generic
	// ==================================================================

	// TRANSLATORS: a label, like "Ability: Intimidate"
	"{LABEL}: ": "{LABEL}: ",
	"{PERCENT}%": "{PERCENT}%",
	// TRANSLATORS: as a value, like "Ability: None"
	"None": "Nenhum",
	"(no item)": "(sem item)",
	"(no ability)": "(sem habilidade)",
	"(no weather)": "(sem clima)",
	// TRANSLATORS: a side condition on the opponent's side, like "Foe's Stealth Rock"
	"Foe's {CONDITION}": "{CONDITION} do oponente",

	// TRANSLATORS: for constructing lists
	"{FIRST} or {SECOND}": "{FIRST} ou {SECOND}",
	"{FIRST} and {SECOND}": "{FIRST} e {SECOND}",
	", {NEXT}": ", {NEXT}",
	", or {LAST}": ", ou {LAST}",
	", and {LAST}": ", e {LAST}",
	// TRANSLATORS: this is for lists of users specifically
	// TRANSLATORS: (languages with counters should use the "person" counter)
	", and {NUMBER} others": ", e mais {NUMBER} pessoas",

	// #endregion Generic

	// #region Dex
	// ==================================================================

	"Pokémon": "Pokémon",
	"Move": "Golpe",
	"Moves": "Golpes",
	"Item": "Item",
	"Items": "Itens",
	"Ability": "Habilidade",
	"Abilities": "Habilidades",
	"Hidden Ability": "Habilidade oculta",
	// TRANSLATORS: "" as in a Pokémon's type; "kind" as in kind of tournament or help ticket
	"Type": {
		"": "Tipo",
		"kind": "Tipo",
	},
	"Types": "Tipos",
	"Nature": "Natureza",
	"Category": "Categoria",
	"Categories": "Categorias",
	"Gender": "Gênero",
	"Egg Group": "Grupo de ovo",
	"Egg Groups": "Grupos de ovo",
	"Tag": "Tag",
	"Article": "Artigo",
	"Articles": "Artigos",
	"Tier": "Tier",
	"Tiers": "Tiers",
	"Format": "Formato",
	"Formats": "Formatos",
	"Color": "Cor",
	// TRANSLATORS: "" as in a form you fill in; "like forme" as in a Pokémon's form/forme
	"Form": {
		"": "Formulário",
		"like forme": "Forma",
	},
	"Forme": "Forma",
	"Dex#": "Dex nº",
	"Generation": "Geração",
	// TRANSLATORS: intentionally chosen to be very short. do not go longer than three letters for this one
	"Gen {NUMBER}": "Ger {NUMBER}",
	"Evolution": "Evolução",
	"Pre-Evolution": "Pré-evolução",
	"Does Not Evolve": "Não evolui",

	// TRANSLATORS: /dt details
	"Height": "Altura",
	"{NUMBER} m": "{NUMBER} m",
	"Weight": "Peso",
	"{NUMBER} kg": "{NUMBER} kg",
	"Crit rate": "Taxa de crítico",
	// TRANSLATORS: "" as in user account; "pokemon" as in someone who uses an item/move
	"User": {
		"": "Usuário",
		"pokemon": "Usuário",
	},
	"Required move": "Golpe necessário",
	"Target": "Alvo",
	"Z-Crystal": "Z-Crystal",
	"Dynamax power": "Poder no Dynamax",
	"Past gens only": "Só em gerações anteriores",
	"Fling base power": "Poder base com Fling",
	"Fling effect": "Efeito com Fling",
	"Natural Gift type": "Tipo com Natural Gift",
	"Natural Gift base power": "Poder base com Natural Gift",

	// #endregion Dex

	// #region Teambuilder
	// ==================================================================

	"Shiny": "Shiny",
	"Happiness": "Felicidade",
	"Level": "Nível",
	"Nickname": "Apelido",
	// TRANSLATORS: only the EV vs IV distinction is important
	// TRANSLATORS: the English speaking community likes to distinguish all of these,
	// TRANSLATORS: but other languages don't need to
	"EV": "EV",
	"EVs": "EVs",
	"IV": "IV",
	"IVs": "IVs",
	"DVs": "DVs",
	"AV": "AV",
	"AVs": "AVs",
	"Point": "Ponto",
	"Points": "Pontos",
	// TRANSLATORS: used in Teambuilder, so it should be capitalized (unlike "stats" in names.ts)
	"Stats": "Atributos",
	"Team": "Time",
	// TRANSLATORS: "Teams" as in "plural of Team"
	"Teams": "Times",
	"Teams List": "Lista de times",
	"Tera {TYPE}": "Tera {TYPE}",
	// TRANSLATORS: the Tera type label in the team editor (the battle button uses "Tera {TYPE}" with the type's icon)
	"Tera": "Tera",

	// TRANSLATORS: search result headings
	// TRANSLATORS: "Usually useless" is intentionally evasive
	// TRANSLATORS: only for moves that are outclassed or widely considered obviously bad
	// TRANSLATORS: (to avoid arguments about what we're recommending)
	"Usually useless moves": "Golpes geralmente inúteis",
	"Sketched moves": "Golpes via Sketch",
	"Useless sketched moves": "Golpes inúteis via Sketch",
	"Special Event Ability": "Habilidade de evento especial",
	"Situational Abilities": "Habilidades situacionais",
	"Unviable Abilities": "Habilidades inviáveis",
	"Illegal Pokémon": "Pokémon ilegais",
	"Illegal results": "Resultados ilegais",
	"CAP moves": "Golpes do CAP",
	"Glitch": "Glitch",
	"{TYPE}-type Pokémon": "Pokémon do tipo {TYPE}",
	"{TYPE}-type moves": "Golpes do tipo {TYPE}",
	"{CATEGORY} moves": "Golpes da categoria {CATEGORY}",
	"{ABILITY} Pokémon": "Pokémon com {ABILITY}",
	"Specific to {VALUE}": "Exclusivo de {VALUE}",
	"Generation {NUMBER}": "Geração {NUMBER}",

	// #endregion Teambuilder

	// #region Battle
	// ==================================================================

	"Mega Evolution": "Megaevolução",
	"Z-Power": "Z-Power",
	"Z-Effect": "Efeito Z",
	"Dynamax": "Dynamax",
	"Dynamax Level": "Nível de Dynamax",
	"Ultra Burst": "Ultra Burst",

	// TRANSLATORS: type effectiveness
	"Super effective": "Superefetivo",
	"Extremely effective": "Extremamente efetivo",
	"Effective": "Efetivo",
	"Not very effective": "Pouco efetivo",
	"Mostly ineffective": "Quase sem efeito",
	"No effect": "Sem efeito",
	"Weak": "Fraco",
	"Resist": "Resiste",
	"Immune": "Imune",

	// TRANSLATORS: battle tooltips
	"Usually moves first (priority +{PRIORITY}).": "Geralmente age primeiro (prioridade +{PRIORITY}).",
	"Nearly always moves first (priority +{PRIORITY}).": "Quase sempre age primeiro (prioridade +{PRIORITY}).",
	"Nearly always moves last (priority \u2212{PRIORITY}).": "Quase sempre age por último (prioridade −{PRIORITY}).",
	"Fails if current HP is {HP}.": "Falha se o HP atual for {HP}.",
	"KOs yourself if current HP is exactly {HP}.": "Nocauteia você mesmo se o HP atual for exatamente {HP}.",
	"(Transformed into {SPECIES})": "(Transformado em {SPECIES})",
	"(Changed forme: {SPECIES})": "(Mudou de forma: {SPECIES})",
	"Possible Illusion #{NUMBER}": "Possível Illusion nº {NUMBER}",
	"({HP}/{MAXHP} pixels)": "({HP}/{MAXHP} pixels)",
	"Would take if ability removed: {PERCENT}%": "Sofreria se a habilidade fosse removida: {PERCENT}%",
	"Next damage: {PERCENT}%": "Próximo dano: {PERCENT}%",
	"Turns asleep: {NUMBER}": "Turnos dormindo: {NUMBER}",
	"(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(Mais de 4 golpes geralmente indica Zoroark/Zorua com Illusion.)",
	"(Pressure is not visible in Gen 3, so in certain situations, the exact amount of PP used may be unknown.)": "(Pressure não é visível na geração 3, então em certas situações a quantidade exata de PP gasto pode ser desconhecida.)",
	"(Your opponent has two indistinguishable Pokémon, making it impossible for you to tell which one has which moves/ability/item.)": "(Seu oponente tem dois Pokémon indistinguíveis, então não é possível saber qual tem quais golpes/habilidade/item.)",
	"(no conditions)": "(sem condições)",
	"({NUMBER} turn)": "({NUMBER} turno)",
	"({NUMBER} turns)": "({NUMBER} turnos)",
	"(After stat modifiers:)": "(Após os modificadores de atributos:)",
	"Calls {MOVE}": "Chama {MOVE}",
	"(base: {VALUE})": "(base: {VALUE})",
	"({LOW} to {HIGH})": "({LOW} a {HIGH})",
	"(revealed)": "(revelado)",
	"{LOW} to {HIGH}": "{LOW} a {HIGH}",
	"(before stat stage changes)": "(antes das mudanças de estágio de atributos)",
	"(before external modifiers)": "(antes dos modificadores externos)",
	"<strong>{EFFECT}</strong> vs. {POKEMON}": "<strong>{EFFECT}</strong> vs. {POKEMON}",
	"Base power vs. {POKEMON}": "Poder base vs. {POKEMON}",
	" or ": " ou ",

	// #endregion Battle
};
