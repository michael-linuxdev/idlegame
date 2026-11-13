/** Data: backdrop spec per chapter (drawn by art/chapters/backdrop.tsx). Die Bereiche sind handgezeichnet (art/chapters/<id>.tsx). */
import type { ChapterId } from '../game/chapters'
import type { PathStyle } from './ChapterPaths'
import { P } from './art/palette'

/** Chapters drawn with hand-made art (theme/HandArt.tsx). */
export const HAND_ART_CHAPTERS: readonly ChapterId[] = ['bauernhof', 'imkerei', 'teich', 'kraeuter', 'botanik', 'alm', 'lavendel', 'japangarten', 'gartenschau', 'stadtgarten', 'klostergarten', 'schlossgarten', 'baumschule', 'moorgarten', 'deichgarten', 'spreewald', 'cottagegarten', 'tulpenfelder', 'artischocken', 'beerenwald', 'patio', 'korkeichen', 'paprikafelder', 'aranfelder', 'rosental', 'pistazien', 'andenkartoffeln', 'milpa', 'kaffeewald', 'reisterrassen', 'gewuerzgarten', 'oase', 'kakaogarten', 'buschgarten', 'farngarten', 'kimchigarten', 'dachgarten', 'schulgarten', 'waldgarten', 'samenbank', 'klimagarten', 'wildblumenband', 'fassadengarten', 'solawihof', 'saatguttausch', 'weltgartenschau', 'omasgarten']

export interface BackdropSpec {
  /** Patchwork fields behind the plots */
  fields?: boolean
  /** Conifer forest edge along the top */
  forest?: boolean
  /** Big lake in the middle of the map */
  bigLake?: boolean
  /** Walled herb garden: box-hedge beds + brick wall along the top */
  herbGarden?: boolean
  /** Big Victorian palm house on the horizon + gravel rondel */
  glasshouse?: boolean
  /** High Alps: snowy peaks, chapel, alpine pasture slope */
  alps?: boolean
  /** Provence: cypresses, stone village, olive dots */
  provence?: boolean
  /** Japan: snowy volcano, pagoda, maples, raked gravel */
  japan?: boolean
  /** Gartenschau: flags, ferris wheel, flower rondels */
  showground?: boolean
  /** Stadtgarten: old town houses, firewall with mural, string lights */
  cityYard?: boolean
  /** Klostergarten: monastery wall, church tower, wooded hill */
  monastery?: boolean
  /** Schlossgarten: palace front, canal, box edging */
  palace?: boolean
  /** Baumschule: long rows of young trees, polytunnel, field edge */
  nursery?: boolean
  /** Moorgarten: dark water, birches, heather, wide sky */
  moor?: boolean
  /** Deichgarten: dike with sheep, lighthouse, thatched farm, clouds */
  dike?: boolean
  /** Spreewald: alder woods, log houses, stork, reedy pools */
  spreewald?: boolean
  /** Cottage-Garten: honey-stone cottages, rolling hills with sheep */
  cotswolds?: boolean
  /** Tulpenfelder: striped bulb fields, windmills, bulb barn */
  bulbFields?: boolean
  /** Artischocken: lagoon water, Venice skyline, mooring posts */
  lagoon?: boolean
  /** Beerenwald: spruce forest, lake, red cabin, mossy rocks */
  swedishWoods?: boolean
  /** Patio: white arcades, azulejo dado, Córdoba roofs and bell tower */
  andalusia?: boolean
  /** Korkeichen: rolling montado with round oaks, white farmhouse, pylons with storks */
  montado?: boolean
  /** Paprikafelder: flat plain, sweep well, Kalocsa towers, red pepper strips */
  kalocsa?: boolean
  /** Aran: Atlantic, cliffs, stone-walled fields, thatched cottage */
  aran?: boolean
  /** Rosental: Balkan mountains, pink rose rows, red-roofed village */
  roseValley?: boolean
  /** Ägina: Aegean sea, islands, temple on the hill, white harbor village */
  aegina?: boolean
  /** Anden: snowy peaks, stone terraces up the slope, adobe houses */
  andes?: boolean
  /** Milpa: volcanic hills, cornfields, agave rows, white church tower */
  milpaHills?: boolean
  /** Kaffeewald: layered forest canopy, tall shade trees, tukul roofs */
  coffeeForest?: boolean
  /** Bali: green rice terraces, volcano, palms, temple roofs */
  bali?: boolean
  /** Kerala: Western Ghats, palms, backwater, red-tiled roofs */
  kerala?: boolean
  /** Oase: dunes, Atlas mountains with snow, clay ksar, palm grove */
  oasis?: boolean
  /** Ghana: layered rainforest canopy, tall silk-cotton trees, tin roofs */
  cocoaFarm?: boolean
  /** Australien: red escarpment, gum trees, shed with water tank */
  bush?: boolean
  /** Neuseeland: dark forested ridges, tree ferns, kauri, mist */
  fernForest?: boolean
  /** Korea: layered blue mountains, hanok roofs, persimmon trees */
  korea?: boolean
  /** Dachgarten: city skyline, tower cranes, parapet of the parking garage */
  rooftop?: boolean
  /** Schulgarten: school building with clock, swing set, fence */
  schoolyard?: boolean
  /** Waldgarten: mixed forest edge, rows of the tree nursery */
  forestGarden?: boolean
  /** Samenbank: low glass building with green roof, trial strips, mesh tents */
  seedBank?: boolean
  /** Klimagarten: river, city across the water, sponge hollows */
  climateGarden?: boolean
  /** Wildblumenband: moor edge with birches, grain fields, a green bridge over the road */
  wildflowerBand?: boolean
  /** Fassadengarten: six-storey houses, one wall overgrown with creeper, courtyard */
  livingWall?: boolean
  /** Solawi-Hof: Onkel Fritz’ farm (barn, farmhouse), polytunnels, field strips */
  communityFarm?: boolean
  /** Saatguttausch: festival meadow with tents, pennant lines, old show gate */
  seedSwap?: boolean
  /** Weltgartenschau: expo skyline, glass hall, cable car pylons, flags */
  worldExpo?: boolean
  /** Omas Schrebergarten: allotment colony; brambles at stage 0 give way to today's garden by stage 10 */
  omaGarden?: boolean
  grass: [string, string, string]
  path: string
  /** Own path shape per chapter (default: shared S-curve) */
  way?: PathStyle
  hills: [string, string]
  water?: 'river' | 'lake' | 'none'
  mountains?: boolean
  stripes?: string
}

export const CHAPTER_ART: Partial<Record<ChapterId, { backdrop: BackdropSpec }>> = {
  bauernhof: {
    backdrop: { grass: ['#a8cf74', '#95c162', '#80ad52'], path: '#d9c79a', hills: [P.leafLight, '#6a9a48'], fields: true, way: 'track' },
  },
  imkerei: {
    backdrop: { grass: ['#a6c97a', '#90b866', '#7ba555'], path: '#d9c79a', hills: ['#4f7a3a', '#3f6a2e'], forest: true, way: 'loop' },
  },
  teich: {
    backdrop: { grass: ['#9fcf86', '#88bd70', '#72a85c'], path: '#d9c79a', hills: ['#5f8a4a', '#4f7a3a'], bigLake: true, way: 'shore' },
  },
  kraeuter: {
    backdrop: { grass: ['#b0cf86', '#9cc072', '#88ad60'], path: '#e2d4ae', hills: ['#7a9a58', '#6a8a48'], herbGarden: true, way: 'cross' },
  },
  botanik: {
    backdrop: { grass: ['#9fd08a', '#8ac477', '#76b062'], path: '#eae2d0', hills: [P.leaf, '#4f8a3a'], glasshouse: true, way: 'rondel' },
  },
  alm: {
    backdrop: { grass: ['#a9cf7a', '#94bf66', '#7fab54'], path: '#d9c79a', hills: ['#7fab54', '#6f9a48'], alps: true, way: 'switchback' },
  },
  lavendel: {
    backdrop: { grass: ['#d4cf8a', '#c4be76', '#b0aa62'], path: '#eadcb8', hills: ['#a9a86a', '#8f8e58'], stripes: '#9a7ac4', way: 'lane', provence: true },
  },
  japangarten: {
    backdrop: { grass: ['#a3c98a', '#8fb877', '#7aa463'], path: '#e2dccb', hills: ['#5f7a4a', '#4f6a3a'], water: 'lake', way: 'stones', japan: true },
  },
  gartenschau: {
    backdrop: { grass: ['#a6d48c', '#90c877', '#7ab462'], path: '#efe6d0', hills: ['#6fae52', '#5f9a48'], water: 'lake', way: 'promenade', showground: true },
  },
  stadtgarten: {
    backdrop: { grass: ['#b9c4a0', '#a9b98e', '#98aa7c'], path: '#c9c3b6', hills: ['#c8a68a', '#b08d74'], way: 'yard', cityYard: true },
  },
  klostergarten: {
    backdrop: { grass: ['#a8cc84', '#96bd72', '#82ab62'], path: '#d9cfb8', hills: ['#6f9a52', '#5a8644'], way: 'cloister', monastery: true },
  },
  schlossgarten: {
    backdrop: { grass: ['#9fcf7f', '#8cc06e', '#78ad5c'], path: '#e6dcc4', hills: ['#5f9a48', '#4f8a3a'], way: 'axis', palace: true },
  },
  baumschule: {
    backdrop: { grass: ['#b4d08a', '#a0c278', '#8cb066'], path: '#cdb88e', hills: ['#8ab060', '#76a050'], way: 'nurseryRows', nursery: true },
  },
  moorgarten: {
    backdrop: { grass: ['#a3ad7a', '#8f9c68', '#7a8a58'], path: '#a5733f', hills: ['#9a7ab0', '#7a6a8a'], way: 'boardwalk', moor: true },
  },
  deichgarten: {
    backdrop: { grass: ['#b4cf86', '#a2c274', '#8fb262'], path: '#d8d4c8', hills: ['#9ec6dc', '#6f9a52'], way: 'dikeTrack', dike: true },
  },
  spreewald: {
    backdrop: { grass: ['#a6cc7e', '#92bc6c', '#7eaa5c'], path: '#5aa9c6', hills: ['#5a8644', '#4f7a3a'], way: 'fliess', spreewald: true },
  },
  cottagegarten: {
    backdrop: { grass: ['#acd086', '#9ac274', '#86b062'], path: '#e3d3a8', hills: ['#8ab868', '#76a656'], way: 'flagstones', cotswolds: true },
  },
  tulpenfelder: {
    backdrop: { grass: ['#b2d08c', '#a0c47a', '#8cb468'], path: '#d9cfb8', hills: ['#7fb85a', '#6a9a48'], way: 'bulbLanes', bulbFields: true },
  },
  artischocken: {
    backdrop: { grass: ['#b6c98a', '#a4ba78', '#90a866'], path: '#4f9cc0', hills: ['#9ec6dc', '#8aa86a'], way: 'canals', lagoon: true },
  },
  beerenwald: {
    backdrop: { grass: ['#94b874', '#82a864', '#6f9654'], path: '#b8956a', hills: ['#3f6a3a', '#2f5a2e'], way: 'forestTrail', swedishWoods: true },
  },
  patio: {
    backdrop: { grass: ['#e8dcc0', '#dccfae', '#cfc09c'], path: '#c8693e', hills: ['#f4ead2', '#e6d6b2'], way: 'patioTiles', andalusia: true },
  },
  korkeichen: {
    backdrop: { grass: ['#d6c98c', '#c8ba78', '#b8a866'], path: '#c98a5a', hills: ['#b8b070', '#8a9a58'], way: 'montadoTrack', montado: true },
  },
  paprikafelder: {
    backdrop: { grass: ['#b8cc84', '#a6bc72', '#94aa62'], path: '#d9c79a', hills: ['#a8c47a', '#8aa860'], way: 'pepperLanes', kalocsa: true },
  },
  aranfelder: {
    backdrop: { grass: ['#9cc07e', '#8ab06c', '#78a05c'], path: '#c9c3b6', hills: ['#7a9a8a', '#5a7a6a'], way: 'limestone', aran: true },
  },
  rosental: {
    backdrop: { grass: ['#acc886', '#9aba74', '#88aa64'], path: '#d9c79a', hills: ['#7a8ea8', '#5f7690'], way: 'roseLanes', roseValley: true },
  },
  pistazien: {
    backdrop: { grass: ['#d8cc98', '#cabc86', '#b8aa74'], path: '#efe1c2', hills: ['#6aa6c9', '#b8aa74'], way: 'terraceSteps', aegina: true },
  },
  andenkartoffeln: {
    backdrop: { grass: ['#a9b878', '#98a866', '#889856'], path: '#c9b48a', hills: ['#8a9a6a', '#8a8aa0'], way: 'andenSteps', andes: true },
  },
  milpa: {
    backdrop: { grass: ['#b4bc78', '#a2ac66', '#909c56'], path: '#d9c79a', hills: ['#8aa060', '#6a8a50'], way: 'milpaRing', milpaHills: true },
  },
  kaffeewald: {
    backdrop: { grass: ['#7aa860', '#6a9852', '#5a8846'], path: '#b8744a', hills: ['#4f7a3a', '#3f6a2e'], way: 'forestZigzag', coffeeForest: true },
  },
  reisterrassen: {
    backdrop: { grass: ['#9acb6a', '#88bb5a', '#76aa4c'], path: '#c9b48a', hills: ['#5f9e45', '#7a8a9e'], way: 'subakSteps', bali: true },
  },
  gewuerzgarten: {
    backdrop: { grass: ['#6fa855', '#5f9848', '#50883c'], path: '#c8693e', hills: ['#3f7a30', '#5f7a5a'], way: 'spiceTrail', kerala: true },
  },
  oase: {
    backdrop: { grass: ['#c9b47a', '#b9a46a', '#a8945c'], path: '#e0c890', hills: ['#d4b078', '#a89a9e'], way: 'oasisRing', oasis: true },
  },
  kakaogarten: {
    backdrop: { grass: ['#7aa860', '#6a9852', '#5a8846'], path: '#b8744a', hills: ['#4f7a3a', '#3f6a2e'], way: 'cocoaTrail', cocoaFarm: true },
  },
  buschgarten: {
    backdrop: { grass: ['#a8b06a', '#98a05c', '#88904e'], path: '#c8693e', hills: ['#c8693e', '#7a8f72'], way: 'bushSpiral', bush: true },
  },
  farngarten: {
    backdrop: { grass: ['#6a9e52', '#5a8e46', '#4a7e3a'], path: '#a5733f', hills: ['#3f6a2e', '#2f5a26'], way: 'fernBoardwalk', fernForest: true },
  },
  kimchigarten: {
    backdrop: { grass: ['#a8c47a', '#98b46a', '#88a45c'], path: '#d9c79a', hills: ['#5f8a6a', '#6a7a9a'], way: 'kimchiRows', korea: true },
  },
  dachgarten: {
    backdrop: { grass: ['#a9b48a', '#9aa67c', '#8b986e'], path: '#d9d2c2', hills: ['#a69a8a', '#8f8676'], way: 'roofRing', rooftop: true },
  },
  schulgarten: {
    backdrop: { grass: ['#9cc46e', '#8ab45e', '#78a250'], path: '#a69a8a', hills: ['#6a9a48', '#5a8a3e'], way: 'schoolZigzag', schoolyard: true },
  },
  waldgarten: {
    backdrop: { grass: ['#7aa860', '#6a9852', '#5a8846'], path: '#a5733f', hills: ['#4f7a3a', '#3f6a2e'], way: 'chipSpiral', forestGarden: true },
  },
  samenbank: {
    backdrop: { grass: ['#a2c47a', '#92b46a', '#82a45c'], path: '#d9d2c2', hills: ['#6a9a48', '#5a8a3e'], way: 'seedRing', seedBank: true },
  },
  klimagarten: {
    backdrop: { grass: ['#b4bc7a', '#a4ac6a', '#949c5c'], path: '#8a5a32', hills: ['#7a8f72', '#5f7a5a'], way: 'mulchZigzag', climateGarden: true },
  },
  wildblumenband: {
    backdrop: { grass: ['#c2c87e', '#b2b86e', '#a2a860'], path: '#a5733f', hills: ['#6a8a4a', '#5a7a3e'], way: 'meadowSpiral', wildflowerBand: true },
  },
  fassadengarten: {
    backdrop: { grass: ['#a9b48a', '#9aa67c', '#8b986e'], path: '#c9c3b6', hills: ['#a69a8a', '#8f8676'], way: 'courtSteps', livingWall: true },
  },
  solawihof: {
    backdrop: { grass: ['#a8c47a', '#98b46a', '#88a45c'], path: '#c9a46b', hills: ['#6a9a48', '#5a8a3e'], way: 'farmRows', communityFarm: true },
  },
  saatguttausch: {
    backdrop: { grass: ['#a6cf7e', '#96bf6e', '#86af60'], path: '#d9c79a', hills: ['#6a9a48', '#5a8a3e'], way: 'swapRing', seedSwap: true },
  },
  weltgartenschau: {
    backdrop: { grass: ['#a2cc78', '#92bc68', '#82ac5a'], path: '#efe1c2', hills: ['#6a9a48', '#5a8a3e'], way: 'expoRing', worldExpo: true },
  },
  omasgarten: {
    backdrop: { grass: ['#a6cc76', '#94bc66', '#82aa56'], path: '#d9c79a', hills: ['#6a9a48', '#4f7a3a'], way: 'omaZigzag', omaGarden: true },
  },
}
