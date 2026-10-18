/**
 * pokemon-showdown-custom: catálogo das insígnias de ginásio dos jogos principais.
 *
 * GERADO por scripts/insignias/importar.cjs (repo pokemon-showdown-custom) a partir da
 * página "Badge" da Bulbapedia; não edite à mão. As imagens (/badges/<image>) não ficam
 * no git: ver docs/insignias.md.
 *
 * @license MIT
 */

export interface BadgeInfo {
	id: string;
	name: string;
	region: string;
	/** Quem entrega a insígnia nos jogos. */
	leaders: string[];
	city: string;
	/** Tipo do ginásio; null quando varia (Trio Badge). */
	type: string | null;
	image: string;
}

export const BADGES: readonly BadgeInfo[] = [
	{
		id: 'kanto-boulder', name: 'Boulder Badge', region: 'Kanto', city: 'Pewter City',
		leaders: ['Brock'], type: 'Rock', image: 'kanto-boulder.png',
	},
	{
		id: 'kanto-cascade', name: 'Cascade Badge', region: 'Kanto', city: 'Cerulean City',
		leaders: ['Misty'], type: 'Water', image: 'kanto-cascade.png',
	},
	{
		id: 'kanto-thunder', name: 'Thunder Badge', region: 'Kanto', city: 'Vermilion City',
		leaders: ['Lt. Surge'], type: 'Electric', image: 'kanto-thunder.png',
	},
	{
		id: 'kanto-rainbow', name: 'Rainbow Badge', region: 'Kanto', city: 'Celadon City',
		leaders: ['Erika'], type: 'Grass', image: 'kanto-rainbow.png',
	},
	{
		id: 'kanto-soul', name: 'Soul Badge', region: 'Kanto', city: 'Fuchsia City',
		leaders: ['Koga'], type: 'Poison', image: 'kanto-soul.png',
	},
	{
		id: 'kanto-marsh', name: 'Marsh Badge', region: 'Kanto', city: 'Saffron City',
		leaders: ['Sabrina'], type: 'Psychic', image: 'kanto-marsh.png',
	},
	{
		id: 'kanto-volcano', name: 'Volcano Badge', region: 'Kanto', city: 'Seafoam Islands',
		leaders: ['Blaine'], type: 'Fire', image: 'kanto-volcano.png',
	},
	{
		id: 'kanto-earth', name: 'Earth Badge', region: 'Kanto', city: 'Viridian City',
		leaders: ['Giovanni'], type: 'Ground', image: 'kanto-earth.png',
	},
	{
		id: 'johto-zephyr', name: 'Zephyr Badge', region: 'Johto', city: 'Violet City',
		leaders: ['Falkner'], type: 'Flying', image: 'johto-zephyr.png',
	},
	{
		id: 'johto-hive', name: 'Hive Badge', region: 'Johto', city: 'Azalea Town',
		leaders: ['Bugsy'], type: 'Bug', image: 'johto-hive.png',
	},
	{
		id: 'johto-plain', name: 'Plain Badge', region: 'Johto', city: 'Goldenrod City',
		leaders: ['Whitney'], type: 'Normal', image: 'johto-plain.png',
	},
	{
		id: 'johto-fog', name: 'Fog Badge', region: 'Johto', city: 'Ecruteak City',
		leaders: ['Morty'], type: 'Ghost', image: 'johto-fog.png',
	},
	{
		id: 'johto-storm', name: 'Storm Badge', region: 'Johto', city: 'Cianwood City',
		leaders: ['Chuck'], type: 'Fighting', image: 'johto-storm.png',
	},
	{
		id: 'johto-mineral', name: 'Mineral Badge', region: 'Johto', city: 'Olivine City',
		leaders: ['Jasmine'], type: 'Steel', image: 'johto-mineral.png',
	},
	{
		id: 'johto-glacier', name: 'Glacier Badge', region: 'Johto', city: 'Mahogany Town',
		leaders: ['Pryce'], type: 'Ice', image: 'johto-glacier.png',
	},
	{
		id: 'johto-rising', name: 'Rising Badge', region: 'Johto', city: 'Blackthorn City',
		leaders: ['Clair'], type: 'Dragon', image: 'johto-rising.png',
	},
	{
		id: 'hoenn-stone', name: 'Stone Badge', region: 'Hoenn', city: 'Rustboro City',
		leaders: ['Roxanne'], type: 'Rock', image: 'hoenn-stone.png',
	},
	{
		id: 'hoenn-knuckle', name: 'Knuckle Badge', region: 'Hoenn', city: 'Dewford Town',
		leaders: ['Brawly'], type: 'Fighting', image: 'hoenn-knuckle.png',
	},
	{
		id: 'hoenn-dynamo', name: 'Dynamo Badge', region: 'Hoenn', city: 'Mauville City',
		leaders: ['Wattson'], type: 'Electric', image: 'hoenn-dynamo.png',
	},
	{
		id: 'hoenn-heat', name: 'Heat Badge', region: 'Hoenn', city: 'Lavaridge Town',
		leaders: ['Flannery'], type: 'Fire', image: 'hoenn-heat.png',
	},
	{
		id: 'hoenn-balance', name: 'Balance Badge', region: 'Hoenn', city: 'Petalburg City',
		leaders: ['Norman'], type: 'Normal', image: 'hoenn-balance.png',
	},
	{
		id: 'hoenn-feather', name: 'Feather Badge', region: 'Hoenn', city: 'Fortree City',
		leaders: ['Winona'], type: 'Flying', image: 'hoenn-feather.png',
	},
	{
		id: 'hoenn-mind', name: 'Mind Badge', region: 'Hoenn', city: 'Mossdeep City',
		leaders: ['Tate and Liza'], type: 'Psychic', image: 'hoenn-mind.png',
	},
	{
		id: 'hoenn-rain', name: 'Rain Badge', region: 'Hoenn', city: 'Sootopolis City',
		leaders: ['Wallace'], type: 'Water', image: 'hoenn-rain.png',
	},
	{
		id: 'sinnoh-coal', name: 'Coal Badge', region: 'Sinnoh', city: 'Oreburgh City',
		leaders: ['Roark'], type: 'Rock', image: 'sinnoh-coal.png',
	},
	{
		id: 'sinnoh-forest', name: 'Forest Badge', region: 'Sinnoh', city: 'Eterna City',
		leaders: ['Gardenia'], type: 'Grass', image: 'sinnoh-forest.png',
	},
	{
		id: 'sinnoh-cobble', name: 'Cobble Badge', region: 'Sinnoh', city: 'Veilstone City',
		leaders: ['Maylene'], type: 'Fighting', image: 'sinnoh-cobble.png',
	},
	{
		id: 'sinnoh-fen', name: 'Fen Badge', region: 'Sinnoh', city: 'Pastoria City',
		leaders: ['Crasher Wake'], type: 'Water', image: 'sinnoh-fen.png',
	},
	{
		id: 'sinnoh-relic', name: 'Relic Badge', region: 'Sinnoh', city: 'Hearthome City',
		leaders: ['Fantina'], type: 'Ghost', image: 'sinnoh-relic.png',
	},
	{
		id: 'sinnoh-mine', name: 'Mine Badge', region: 'Sinnoh', city: 'Canalave City',
		leaders: ['Byron'], type: 'Steel', image: 'sinnoh-mine.png',
	},
	{
		id: 'sinnoh-icicle', name: 'Icicle Badge', region: 'Sinnoh', city: 'Snowpoint City',
		leaders: ['Candice'], type: 'Ice', image: 'sinnoh-icicle.png',
	},
	{
		id: 'sinnoh-beacon', name: 'Beacon Badge', region: 'Sinnoh', city: 'Sunyshore City',
		leaders: ['Volkner'], type: 'Electric', image: 'sinnoh-beacon.png',
	},
	{
		id: 'unova-trio', name: 'Trio Badge', region: 'Unova', city: 'Striaton City',
		leaders: ['Cress', 'Cilan', 'Chili'], type: null, image: 'unova-trio.png',
	},
	{
		id: 'unova-basic', name: 'Basic Badge', region: 'Unova', city: 'Nacrene City',
		leaders: ['Lenora', 'Cheren'], type: 'Normal', image: 'unova-basic.png',
	},
	{
		id: 'unova-insect', name: 'Insect Badge', region: 'Unova', city: 'Castelia City',
		leaders: ['Burgh'], type: 'Bug', image: 'unova-insect.png',
	},
	{
		id: 'unova-bolt', name: 'Bolt Badge', region: 'Unova', city: 'Nimbasa City',
		leaders: ['Elesa'], type: 'Electric', image: 'unova-bolt.png',
	},
	{
		id: 'unova-quake', name: 'Quake Badge', region: 'Unova', city: 'Driftveil City',
		leaders: ['Clay'], type: 'Ground', image: 'unova-quake.png',
	},
	{
		id: 'unova-jet', name: 'Jet Badge', region: 'Unova', city: 'Mistralton City',
		leaders: ['Skyla'], type: 'Flying', image: 'unova-jet.png',
	},
	{
		id: 'unova-freeze', name: 'Freeze Badge', region: 'Unova', city: 'Icirrus City',
		leaders: ['Brycen'], type: 'Ice', image: 'unova-freeze.png',
	},
	{
		id: 'unova-legend', name: 'Legend Badge', region: 'Unova', city: 'Opelucid City',
		leaders: ['Drayden'], type: 'Dragon', image: 'unova-legend.png',
	},
	{
		id: 'unova-toxic', name: 'Toxic Badge', region: 'Unova', city: 'Virbank City',
		leaders: ['Roxie'], type: 'Poison', image: 'unova-toxic.png',
	},
	{
		id: 'unova-wave', name: 'Wave Badge', region: 'Unova', city: 'Humilau City',
		leaders: ['Marlon'], type: 'Water', image: 'unova-wave.png',
	},
	{
		id: 'kalos-bug', name: 'Bug Badge', region: 'Kalos', city: 'Santalune City',
		leaders: ['Viola'], type: 'Bug', image: 'kalos-bug.png',
	},
	{
		id: 'kalos-cliff', name: 'Cliff Badge', region: 'Kalos', city: 'Cyllage City',
		leaders: ['Grant'], type: 'Rock', image: 'kalos-cliff.png',
	},
	{
		id: 'kalos-rumble', name: 'Rumble Badge', region: 'Kalos', city: 'Shalour City',
		leaders: ['Korrina'], type: 'Fighting', image: 'kalos-rumble.png',
	},
	{
		id: 'kalos-plant', name: 'Plant Badge', region: 'Kalos', city: 'Coumarine City',
		leaders: ['Ramos'], type: 'Grass', image: 'kalos-plant.png',
	},
	{
		id: 'kalos-voltage', name: 'Voltage Badge', region: 'Kalos', city: 'Lumiose City',
		leaders: ['Clemont'], type: 'Electric', image: 'kalos-voltage.png',
	},
	{
		id: 'kalos-fairy', name: 'Fairy Badge', region: 'Kalos', city: 'Laverre City',
		leaders: ['Valerie'], type: 'Fairy', image: 'kalos-fairy.png',
	},
	{
		id: 'kalos-psychic', name: 'Psychic Badge', region: 'Kalos', city: 'Anistar City',
		leaders: ['Olympia'], type: 'Psychic', image: 'kalos-psychic.png',
	},
	{
		id: 'kalos-iceberg', name: 'Iceberg Badge', region: 'Kalos', city: 'Snowbelle City',
		leaders: ['Wulfric'], type: 'Ice', image: 'kalos-iceberg.png',
	},
	{
		id: 'galar-grass', name: 'Grass Badge', region: 'Galar', city: 'Turffield',
		leaders: ['Milo'], type: 'Grass', image: 'galar-grass.png',
	},
	{
		id: 'galar-water', name: 'Water Badge', region: 'Galar', city: 'Hulbury',
		leaders: ['Nessa'], type: 'Water', image: 'galar-water.png',
	},
	{
		id: 'galar-fire', name: 'Fire Badge', region: 'Galar', city: 'Motostoke',
		leaders: ['Kabu'], type: 'Fire', image: 'galar-fire.png',
	},
	{
		id: 'galar-fighting', name: 'Fighting Badge', region: 'Galar', city: 'Stow-on-Side',
		leaders: ['Bea'], type: 'Fighting', image: 'galar-fighting.png',
	},
	{
		id: 'galar-ghost', name: 'Ghost Badge', region: 'Galar', city: 'Stow-on-Side',
		leaders: ['Allister'], type: 'Ghost', image: 'galar-ghost.png',
	},
	{
		id: 'galar-fairy', name: 'Fairy Badge', region: 'Galar', city: 'Ballonlea',
		leaders: ['Opal'], type: 'Fairy', image: 'galar-fairy.png',
	},
	{
		id: 'galar-rock', name: 'Rock Badge', region: 'Galar', city: 'Circhester',
		leaders: ['Gordie'], type: 'Rock', image: 'galar-rock.png',
	},
	{
		id: 'galar-ice', name: 'Ice Badge', region: 'Galar', city: 'Circhester',
		leaders: ['Melony'], type: 'Ice', image: 'galar-ice.png',
	},
	{
		id: 'galar-dark', name: 'Dark Badge', region: 'Galar', city: 'Spikemuth',
		leaders: ['Piers'], type: 'Dark', image: 'galar-dark.png',
	},
	{
		id: 'galar-dragon', name: 'Dragon Badge', region: 'Galar', city: 'Hammerlocke',
		leaders: ['Raihan'], type: 'Dragon', image: 'galar-dragon.png',
	},
	{
		id: 'paldea-bug', name: 'Bug Badge', region: 'Paldea', city: 'Cortondo',
		leaders: ['Katy'], type: 'Bug', image: 'paldea-bug.png',
	},
	{
		id: 'paldea-grass', name: 'Grass Badge', region: 'Paldea', city: 'Artazon',
		leaders: ['Brassius'], type: 'Grass', image: 'paldea-grass.png',
	},
	{
		id: 'paldea-electric', name: 'Electric Badge', region: 'Paldea', city: 'Levincia',
		leaders: ['Iono'], type: 'Electric', image: 'paldea-electric.png',
	},
	{
		id: 'paldea-water', name: 'Water Badge', region: 'Paldea', city: 'Cascarrafa',
		leaders: ['Kofu'], type: 'Water', image: 'paldea-water.png',
	},
	{
		id: 'paldea-normal', name: 'Normal Badge', region: 'Paldea', city: 'Medali',
		leaders: ['Larry'], type: 'Normal', image: 'paldea-normal.png',
	},
	{
		id: 'paldea-ghost', name: 'Ghost Badge', region: 'Paldea', city: 'Montenevera',
		leaders: ['Ryme'], type: 'Ghost', image: 'paldea-ghost.png',
	},
	{
		id: 'paldea-psychic', name: 'Psychic Badge', region: 'Paldea', city: 'Alfornada',
		leaders: ['Tulip'], type: 'Psychic', image: 'paldea-psychic.png',
	},
	{
		id: 'paldea-ice', name: 'Ice Badge', region: 'Paldea', city: 'Glaseado',
		leaders: ['Grusha'], type: 'Ice', image: 'paldea-ice.png',
	},
];
