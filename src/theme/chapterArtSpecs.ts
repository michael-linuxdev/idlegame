/** Data: art spec per chapter area + backdrop (drawn by ChapterArt.tsx). */
import type { ChapterId } from '../game/chapters'
import type { PathStyle } from './ChapterPaths'
import { P } from './art/palette'

export type Tree = { k: 'tree'; crown: string; fruit?: string; shape?: 'round' | 'cone' | 'palm' | 'blossom' | 'olive' | 'bamboo' | 'linden' }
export type Rows = { k: 'rows'; color: string; flower?: string; tall?: boolean }
export type Animals = { k: 'animals'; animal: 'cow' | 'goat' | 'pig' | 'goose' | 'duck' | 'koi' | 'fish' | 'bee'; water?: boolean }
export type House = {
  k: 'house'
  roof: string
  wall: string
  prop?: 'chimney' | 'barrels' | 'glass' | 'dome' | 'bell' | 'pagoda' | 'tower' | 'flag' | 'tent' | 'jars' | 'gate' | 'stage' | 'cable' | 'still' | 'hives'
}
export type Water = { k: 'water'; variant: 'pond' | 'stream' | 'jetty' | 'bridge' | 'fountain' | 'lilies' | 'reeds' }
export type Flowers = { k: 'flowers'; colors: string[]; arch?: boolean }
export type Stones = { k: 'stones'; variant: 'zen' | 'rock' | 'edelweiss' | 'moss' | 'maze' | 'lanterns' }
export type ArtSpec = Tree | Rows | Animals | House | Water | Flowers | Stones

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

export const CHAPTER_ART: Partial<Record<ChapterId, { backdrop: BackdropSpec; areas: Record<string, ArtSpec> }>> = {
  bauernhof: {
    backdrop: { grass: ['#a8cf74', '#95c162', '#80ad52'], path: '#d9c79a', hills: [P.leafLight, '#6a9a48'], fields: true, way: 'track' },
    areas: {
      kuhweide: { k: 'animals', animal: 'cow' },
      ziegenstall: { k: 'animals', animal: 'goat' },
      schweinekoben: { k: 'animals', animal: 'pig' },
      gaensewiese: { k: 'animals', animal: 'goose' },
      kartoffelacker: { k: 'rows', color: '#6f9a48', flower: '#f6f2e8' },
      heuscheune: { k: 'house', roof: '#8a3a2a', wall: '#b8743f', prop: 'barrels' },
      melkhaus: { k: 'house', roof: P.outlineWood, wall: P.paper, prop: 'chimney' },
      kaeserei: { k: 'house', roof: '#a5531a', wall: '#f3e6c8', prop: 'jars' },
      hofbaeckerei: { k: 'house', roof: '#b8403a', wall: P.paper, prop: 'chimney' },
      bauernmarkt: { k: 'house', roof: P.waterDeep, wall: P.cream, prop: 'tent' },
    },
  },
  imkerei: {
    backdrop: { grass: ['#a6c97a', '#90b866', '#7ba555'], path: '#d9c79a', hills: ['#4f7a3a', '#3f6a2e'], forest: true, way: 'loop' },
    areas: {
      bienenhaus: { k: 'house', roof: P.outlineWood, wall: '#d9b78a', prop: 'hives' },
      lindenallee: { k: 'tree', crown: P.leafLight, fruit: '#f5e08a', shape: 'linden' },
      heide: { k: 'rows', color: '#a35fb0', flower: P.lilac },
      rapsfeld: { k: 'rows', color: '#e8d23a', flower: '#f5e04a' },
      kirschhain: { k: 'tree', crown: '#f7c6d9', shape: 'blossom' },
      wildblumen: { k: 'flowers', colors: [P.blue, P.red, '#f6f2e8', P.yellow] },
      schleuder: { k: 'house', roof: '#a5531a', wall: P.paper, prop: 'jars' },
      wachszieherei: { k: 'house', roof: '#c49a3a', wall: '#f5e6b8', prop: 'chimney' },
      metkeller: { k: 'house', roof: '#5a3d22', wall: '#c9b48a', prop: 'barrels' },
      honigladen: { k: 'house', roof: '#e0a21a', wall: '#fbf3e0', prop: 'jars' },
    },
  },
  teich: {
    backdrop: { grass: ['#9fcf86', '#88bd70', '#72a85c'], path: '#d9c79a', hills: ['#5f8a4a', '#4f7a3a'], bigLake: true, way: 'shore' },
    areas: {
      seerosen: { k: 'water', variant: 'lilies' },
      schilf: { k: 'water', variant: 'reeds' },
      karpfenteich: { k: 'animals', animal: 'fish', water: true },
      forellenbach: { k: 'water', variant: 'stream' },
      steg: { k: 'water', variant: 'jetty' },
      fischerhuette: { k: 'house', roof: '#3d5a8a', wall: P.woodMid, prop: 'barrels' },
      raeucherei: { k: 'house', roof: '#4a3a2a', wall: P.outlineSoft, prop: 'chimney' },
      bootsverleih: { k: 'water', variant: 'bridge' },
      entenbucht: { k: 'animals', animal: 'duck', water: true },
      seefest: { k: 'house', roof: P.tomato, wall: P.cream, prop: 'stage' },
    },
  },
  kraeuter: {
    backdrop: { grass: ['#b0cf86', '#9cc072', '#88ad60'], path: '#e2d4ae', hills: ['#7a9a58', '#6a8a48'], herbGarden: true, way: 'cross' },
    areas: {
      kamille: { k: 'rows', color: '#8ab85a', flower: P.cream },
      pfefferminze: { k: 'rows', color: '#4f9a5a' },
      ringelblume: { k: 'rows', color: '#6f9a48', flower: P.orange },
      johanniskraut: { k: 'rows', color: '#6f9a48', flower: P.yellow },
      salbei: { k: 'rows', color: '#9fb8a0' },
      trockenboden: { k: 'house', roof: P.outlineWood, wall: '#d9b78a', prop: 'jars' },
      destille: { k: 'house', roof: '#a5531a', wall: P.paper, prop: 'still' },
      salbenkueche: { k: 'house', roof: '#7a5ab8', wall: P.cream, prop: 'chimney' },
      teestube: { k: 'house', roof: P.leafDark, wall: '#fbf3e0', prop: 'jars' },
      apothekergarten: { k: 'flowers', colors: [P.lilac, P.yellow, P.cream, P.red], arch: true },
    },
  },
  botanik: {
    backdrop: { grass: ['#9fd08a', '#8ac477', '#76b062'], path: '#eae2d0', hills: [P.leaf, '#4f8a3a'], glasshouse: true, way: 'rondel' },
    areas: {
      palmenhaus: { k: 'house', roof: '#cfe8f4', wall: '#e8f4fa', prop: 'glass' },
      kakteenhaus: { k: 'house', roof: '#cfe8f4', wall: '#f4ecd8', prop: 'glass' },
      orchideenhaus: { k: 'house', roof: '#e2d4f0', wall: '#f4eefa', prop: 'glass' },
      victoriahaus: { k: 'water', variant: 'lilies' },
      rosarium: { k: 'flowers', colors: [P.red, P.pink, P.cream, P.roof], arch: true },
      steingarten: { k: 'stones', variant: 'rock' },
      arboretum: { k: 'tree', crown: '#4f8f3c', shape: 'cone' },
      farnschlucht: { k: 'stones', variant: 'moss' },
      herbarium: { k: 'house', roof: P.outlineWood, wall: P.paper, prop: 'jars' },
      glaskuppel: { k: 'house', roof: '#cfe8f4', wall: '#e8f4fa', prop: 'dome' },
    },
  },
  alm: {
    backdrop: { grass: ['#a9cf7a', '#94bf66', '#7fab54'], path: '#d9c79a', hills: ['#7fab54', '#6f9a48'], alps: true, way: 'switchback' },
    areas: {
      almwiese: { k: 'flowers', colors: [P.cream, P.yellow, P.lilac, P.blue] },
      kuhherde: { k: 'animals', animal: 'cow' },
      sennhuette: { k: 'house', roof: '#5a3d22', wall: P.woodMid, prop: 'chimney' },
      edelweiss: { k: 'stones', variant: 'edelweiss' },
      enzian: { k: 'rows', color: '#6f9a48', flower: '#2e5fc4' },
      bergbach: { k: 'water', variant: 'stream' },
      kaesekeller: { k: 'house', roof: P.outlineWood, wall: '#c9b48a', prop: 'barrels' },
      seilbahn: { k: 'house', roof: '#b8403a', wall: P.paper, prop: 'cable' },
      gipfelhuette: { k: 'house', roof: '#5a3d22', wall: P.woodMid, prop: 'flag' },
      almfest: { k: 'house', roof: P.tomato, wall: P.cream, prop: 'bell' },
    },
  },
  lavendel: {
    backdrop: { grass: ['#d4cf8a', '#c4be76', '#b0aa62'], path: '#eadcb8', hills: ['#a9a86a', '#8f8e58'], stripes: '#9a7ac4', way: 'lane', provence: true },
    areas: {
      lavendelreihen: { k: 'rows', color: '#7a5ab8', flower: '#9a7ac4' },
      sonnenblumen: { k: 'rows', color: P.leaf, flower: P.yellow, tall: true },
      olivenhain: { k: 'tree', crown: '#9fb08a', fruit: '#4a5a2a', shape: 'olive' },
      rosmarin: { k: 'rows', color: '#6f8a6a', flower: '#a9b8e8' },
      feigenbaum: { k: 'tree', crown: P.leaf, fruit: '#5b3a78', shape: 'round' },
      destillerie: { k: 'house', roof: P.roof, wall: '#f3e6c8', prop: 'still' },
      seifenmanufaktur: { k: 'house', roof: P.roof, wall: '#f5ecd8', prop: 'jars' },
      marktstand: { k: 'house', roof: '#7a5ab8', wall: '#fbf3e0', prop: 'tent' },
      mas: { k: 'house', roof: P.roof, wall: P.paper, prop: 'chimney' },
      lavendelfest: { k: 'house', roof: '#9a7ac4', wall: P.cream, prop: 'stage' },
    },
  },
  japangarten: {
    backdrop: { grass: ['#a3c98a', '#8fb877', '#7aa463'], path: '#e2dccb', hills: ['#5f7a4a', '#4f6a3a'], water: 'lake', way: 'stones', japan: true },
    areas: {
      teestrauch: { k: 'rows', color: P.leafDark },
      moosgarten: { k: 'stones', variant: 'moss' },
      bambushain: { k: 'tree', crown: '#6aa04a', shape: 'bamboo' },
      kirschallee: { k: 'tree', crown: '#f7c6d9', shape: 'blossom' },
      koiteich: { k: 'animals', animal: 'koi', water: true },
      zengarten: { k: 'stones', variant: 'zen' },
      teehaus: { k: 'house', roof: P.charcoal, wall: '#f5ecd8', prop: 'pagoda' },
      bonsai: { k: 'tree', crown: '#4f8a3a', shape: 'cone' },
      rotebruecke: { k: 'water', variant: 'bridge' },
      laternenweg: { k: 'stones', variant: 'lanterns' },
    },
  },
  gartenschau: {
    backdrop: { grass: ['#a6d48c', '#90c877', '#7ab462'], path: '#efe6d0', hills: ['#6fae52', '#5f9a48'], water: 'lake', way: 'promenade', showground: true },
    areas: {
      eingangstor: { k: 'house', roof: P.leafDark, wall: '#fbf3e0', prop: 'gate' },
      blumenkorso: { k: 'flowers', colors: [P.red, P.orange, P.yellow, P.lilac] },
      rosenbogen: { k: 'flowers', colors: [P.red, P.pink, P.cream], arch: true },
      labyrinth: { k: 'stones', variant: 'maze' },
      wasserspiele: { k: 'water', variant: 'fountain' },
      aussichtsturm: { k: 'house', roof: '#b8403a', wall: P.paper, prop: 'tower' },
      festzelt: { k: 'house', roof: P.cream, wall: P.cream, prop: 'tent' },
      seebuehne: { k: 'house', roof: '#3d5a8a', wall: P.cream, prop: 'stage' },
      ehrenpavillon: { k: 'house', roof: '#e0a21a', wall: '#fbf3e0', prop: 'dome' },
      gedenkgarten: { k: 'flowers', colors: [P.blue, P.cream, P.pink] },
    },
  },
  stadtgarten: {
    backdrop: { grass: ['#b9c4a0', '#a9b98e', '#98aa7c'], path: '#c9c3b6', hills: ['#c8a68a', '#b08d74'], way: 'yard', cityYard: true },
    areas: {
      hochbeete: { k: 'rows', color: P.leaf, flower: P.tomato },
      palettenbeete: { k: 'rows', color: P.leafPale },
      regenspeicher: { k: 'water', variant: 'pond' },
      wurmkiste: { k: 'house', roof: P.woodDark, wall: P.wood, prop: 'barrels' },
      kraeuterleiter: { k: 'rows', color: P.leafMoss, tall: true },
      saatgutbibliothek: { k: 'house', roof: P.leafDark, wall: P.wood, prop: 'jars' },
      lastenrad: { k: 'house', roof: P.denim, wall: P.woodLight },
      lehmofen: { k: 'house', roof: P.woodLight, wall: P.stone, prop: 'chimney' },
      werkstatt: { k: 'house', roof: P.denim, wall: P.denim },
      hoffest: { k: 'flowers', colors: [P.lamp, P.tomato, P.yellow] },
    },
  },
  klostergarten: {
    backdrop: { grass: ['#a8cc84', '#96bd72', '#82ab62'], path: '#d9cfb8', hills: ['#6f9a52', '#5a8644'], way: 'cloister', monastery: true },
    areas: {
      kreuzgang: { k: 'flowers', colors: [P.lavender, P.yellow, P.pink] },
      quittenhain: { k: 'tree', crown: P.leaf, fruit: P.gold },
      heilpflanzen: { k: 'rows', color: P.leafMoss, flower: P.orange },
      brunnenhaus: { k: 'water', variant: 'fountain' },
      bienenmauer: { k: 'stones', variant: 'rock' },
      schwesterngarten: { k: 'rows', color: P.leafPale },
      kraeuterboden: { k: 'house', roof: P.terracotta, wall: P.paper },
      klosterkueche: { k: 'house', roof: P.terracotta, wall: P.stoneLight, prop: 'chimney' },
      saatgutregister: { k: 'house', roof: P.woodDark, wall: P.paper, prop: 'jars' },
      glockenhof: { k: 'house', roof: P.leafMoss, wall: P.stoneLight, prop: 'bell' },
    },
  },
  schlossgarten: {
    backdrop: { grass: ['#9fcf7f', '#8cc06e', '#78ad5c'], path: '#e6dcc4', hills: ['#5f9a48', '#4f8a3a'], way: 'axis', palace: true },
    areas: {
      parterre: { k: 'stones', variant: 'maze' },
      spargelbeete: { k: 'rows', color: P.cream },
      kanalallee: { k: 'tree', crown: P.leaf, shape: 'linden' },
      heckentheater: { k: 'house', roof: P.leafDark, wall: P.leafMoss, prop: 'stage' },
      mauergarten: { k: 'rows', color: P.leaf, flower: P.leafPale },
      kuebelhalle: { k: 'house', roof: P.stone, wall: P.cream, prop: 'glass' },
      wasserachse: { k: 'water', variant: 'fountain' },
      bosquet: { k: 'house', roof: P.leafDark, wall: P.cream, prop: 'dome' },
      schlossgaertnerei: { k: 'house', roof: P.glass, wall: P.glass, prop: 'glass' },
      sommerkonzert: { k: 'house', roof: P.cream, wall: P.cream, prop: 'stage' },
    },
  },
  baumschule: {
    backdrop: { grass: ['#b4d08a', '#a0c278', '#8cb066'], path: '#cdb88e', hills: ['#8ab060', '#76a050'], way: 'nurseryRows', nursery: true },
    areas: {
      saatbeete: { k: 'rows', color: P.leaf },
      veredelung: { k: 'house', roof: P.wood, wall: P.woodLight },
      obstgehoelze: { k: 'tree', crown: P.leaf, fruit: P.red },
      alleebaeume: { k: 'tree', crown: P.leafDark, shape: 'linden' },
      heckenpflanzen: { k: 'rows', color: P.leafDark, tall: true },
      containerplatz: { k: 'rows', color: P.leafMoss },
      giessanlage: { k: 'water', variant: 'stream' },
      packschuppen: { k: 'house', roof: P.metal, wall: P.woodMid },
      hofverkauf: { k: 'house', roof: P.roof, wall: P.wood, prop: 'flag' },
      pflanztag: { k: 'tree', crown: P.leaf },
    },
  },
  moorgarten: {
    backdrop: { grass: ['#a3ad7a', '#8f9c68', '#7a8a58'], path: '#a5733f', hills: ['#9a7ab0', '#7a6a8a'], way: 'boardwalk', moor: true },
    areas: {
      torfmoos: { k: 'stones', variant: 'moss' },
      moosbeeren: { k: 'rows', color: P.leafMoss, flower: P.berry },
      wollgras: { k: 'flowers', colors: [P.white, P.cream] },
      sonnentau: { k: 'flowers', colors: [P.red, P.glassEdge] },
      birkenhain: { k: 'tree', crown: P.leafLight },
      bohlenweg: { k: 'water', variant: 'jetty' },
      beobachtungsturm: { k: 'house', roof: P.woodDark, wall: P.wood, prop: 'tower' },
      moorhuette: { k: 'house', roof: P.woodLight, wall: P.woodMid, prop: 'chimney' },
      schnuckenstall: { k: 'animals', animal: 'goat' },
      moorfest: { k: 'flowers', colors: [P.lamp, P.amber, P.orange] },
    },
  },
  deichgarten: {
    backdrop: { grass: ['#b4cf86', '#a2c274', '#8fb262'], path: '#d8d4c8', hills: ['#9ec6dc', '#6f9a52'], way: 'dikeTrack', dike: true },
    areas: {
      sanddorn: { k: 'rows', color: P.winterLeafLight, flower: P.orange, tall: true },
      salzwiese: { k: 'water', variant: 'reeds' },
      koogacker: { k: 'rows', color: P.leaf, flower: P.cream },
      windschutz: { k: 'rows', color: P.leafDark, tall: true },
      strandrosen: { k: 'flowers', colors: [P.pink, P.tomato] },
      kuttersteg: { k: 'water', variant: 'jetty' },
      reetkate: { k: 'house', roof: P.woodLight, wall: P.cream, prop: 'chimney' },
      friesenstube: { k: 'house', roof: P.woodLight, wall: P.white },
      leuchtturm: { k: 'house', roof: P.barn, wall: P.white, prop: 'tower' },
      biike: { k: 'flowers', colors: [P.orange, P.yellow, P.lamp] },
    },
  },
  spreewald: {
    backdrop: { grass: ['#a6cc7e', '#92bc6c', '#7eaa5c'], path: '#5aa9c6', hills: ['#5a8644', '#4f7a3a'], way: 'fliess', spreewald: true },
    areas: {
      gurkenfeld: { k: 'rows', color: P.leaf, flower: P.yellow },
      meerrettich: { k: 'rows', color: P.leafDark, tall: true },
      leinoelmuehle: { k: 'house', roof: P.woodDark, wall: P.woodMid, prop: 'barrels' },
      kahnanleger: { k: 'water', variant: 'jetty' },
      fliessgarten: { k: 'flowers', colors: [P.yellow, P.orange, P.leaf] },
      einlegekueche: { k: 'house', roof: P.woodDark, wall: P.woodMid, prop: 'jars' },
      holzschuppen: { k: 'house', roof: P.woodMid, wall: P.woodDark },
      trachtenhaus: { k: 'house', roof: P.leafMoss, wall: P.woodMid },
      erlenwald: { k: 'tree', crown: P.leafDark },
      gurkenfest: { k: 'water', variant: 'bridge' },
    },
  },
  cottagegarten: {
    backdrop: { grass: ['#acd086', '#9ac274', '#86b062'], path: '#e3d3a8', hills: ['#8ab868', '#76a656'], way: 'flagstones', cotswolds: true },
    areas: {
      stockrosen: { k: 'flowers', colors: [P.pink, P.berry, P.cream], arch: false },
      wickenzaun: { k: 'flowers', colors: [P.pink, P.lilac, P.plum] },
      gemueseparzelle: { k: 'rows', color: P.leaf },
      steinmauer: { k: 'stones', variant: 'rock' },
      apfelspalier: { k: 'tree', crown: P.leaf, fruit: P.red },
      holzgewaechshaus: { k: 'house', roof: P.glass, wall: P.wood, prop: 'glass' },
      teeplatz: { k: 'tree', crown: P.leafDark },
      geissblattlaube: { k: 'flowers', colors: [P.cream, P.yellow], arch: true },
      gartenschuppen: { k: 'house', roof: P.charcoal, wall: P.leafMoss },
      dorfschau: { k: 'house', roof: P.white, wall: P.white, prop: 'tent' },
    },
  },
  tulpenfelder: {
    backdrop: { grass: ['#b2d08c', '#a0c47a', '#8cb468'], path: '#d9cfb8', hills: ['#7fb85a', '#6a9a48'], way: 'bulbLanes', bulbFields: true },
    areas: {
      tulpenreihen: { k: 'rows', color: P.leafDark, flower: P.red },
      hyazinthen: { k: 'rows', color: P.leafDark, flower: P.blue },
      narzissen: { k: 'flowers', colors: [P.yellow, P.cream] },
      zwiebelscheune: { k: 'house', roof: P.charcoal, wall: P.leafMoss, prop: 'barrels' },
      windmuehle: { k: 'house', roof: P.woodLight, wall: P.charcoal, prop: 'tower' },
      gracht: { k: 'water', variant: 'bridge' },
      fahrradstall: { k: 'house', roof: P.leafDark, wall: P.stoneLight },
      versteigerung: { k: 'house', roof: P.stoneDark, wall: P.stoneLight, prop: 'flag' },
      hausboot: { k: 'water', variant: 'jetty' },
      tulpenmarkt: { k: 'house', roof: P.red, wall: P.white, prop: 'tent' },
    },
  },
  artischocken: {
    backdrop: { grass: ['#b6c98a', '#a4ba78', '#90a866'], path: '#4f9cc0', hills: ['#9ec6dc', '#8aa86a'], way: 'canals', lagoon: true },
    areas: {
      artischockenfeld: { k: 'rows', color: P.winterLeafLight, flower: P.plum },
      lagunenwiese: { k: 'water', variant: 'reeds' },
      bootsanleger: { k: 'water', variant: 'jetty' },
      kanalgarten: { k: 'rows', color: P.leaf },
      granatapfelhecke: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      salzgarten: { k: 'rows', color: P.leafMoss },
      bootsschuppen: { k: 'house', roof: P.terracotta, wall: P.woodMid },
      gemuesekahn: { k: 'water', variant: 'jetty' },
      glockenturm: { k: 'house', roof: P.leafMoss, wall: P.terracotta, prop: 'bell' },
      inselfest: { k: 'flowers', colors: [P.lamp, P.plum, P.white] },
    },
  },
  beerenwald: {
    backdrop: { grass: ['#94b874', '#82a864', '#6f9654'], path: '#b8956a', hills: ['#3f6a3a', '#2f5a2e'], way: 'forestTrail', swedishWoods: true },
    areas: {
      heidelbeerhang: { k: 'rows', color: P.leaf, flower: P.blue },
      preiselbeeren: { k: 'rows', color: P.leafDark, flower: P.berry },
      moltebeeren: { k: 'flowers', colors: [P.amber, P.white] },
      rotehuette: { k: 'house', roof: P.charcoal, wall: P.barn, prop: 'chimney' },
      saftkueche: { k: 'house', roof: P.charcoal, wall: P.woodMid, prop: 'jars' },
      pilzlichtung: { k: 'stones', variant: 'moss' },
      holzstapel: { k: 'house', roof: P.woodMid, wall: P.woodLight, prop: 'barrels' },
      seesauna: { k: 'water', variant: 'jetty' },
      mittsommer: { k: 'flowers', colors: [P.yellow, P.white, P.blue] },
      jedermannspfad: { k: 'tree', crown: P.leafDark, shape: 'cone' },
    },
  },
  patio: {
    backdrop: { grass: ['#e8dcc0', '#dccfae', '#cfc09c'], path: '#c8693e', hills: ['#f4ead2', '#e6d6b2'], way: 'patioTiles', andalusia: true },
    areas: {
      orangenhof: { k: 'tree', crown: P.leafDark, fruit: P.orange },
      azulejobrunnen: { k: 'water', variant: 'fountain' },
      geranienwand: { k: 'flowers', colors: [P.red, P.pink, P.berry] },
      acequia: { k: 'water', variant: 'stream' },
      jasminbogen: { k: 'flowers', colors: [P.white, P.cream], arch: true },
      granatapfelbaum: { k: 'tree', crown: P.leaf, fruit: P.berry },
      galerie: { k: 'house', roof: P.terracotta, wall: P.white, prop: 'gate' },
      marmeladenkueche: { k: 'house', roof: P.terracotta, wall: P.white, prop: 'jars' },
      gitterfenster: { k: 'house', roof: P.terracotta, wall: P.white },
      patiofest: { k: 'flowers', colors: [P.red, P.lamp, P.white] },
    },
  },
  korkeichen: {
    backdrop: { grass: ['#d6c98c', '#c8ba78', '#b8a866'], path: '#c98a5a', hills: ['#b8b070', '#8a9a58'], way: 'montadoTrack', montado: true },
    areas: {
      korkhain: { k: 'tree', crown: P.leafDark, shape: 'olive' },
      schaelplatz: { k: 'tree', crown: P.leafDark },
      eichelweide: { k: 'animals', animal: 'pig' },
      storchenmast: { k: 'house', roof: P.metal, wall: P.stoneLight, prop: 'tower' },
      schoepfrad: { k: 'water', variant: 'fountain' },
      korkstapel: { k: 'house', roof: P.woodMid, wall: P.woodLight, prop: 'barrels' },
      lehmhaus: { k: 'house', roof: P.terracotta, wall: P.white, prop: 'chimney' },
      honighaus: { k: 'house', roof: P.woodMid, wall: P.woodLight, prop: 'hives' },
      korkwerkstatt: { k: 'house', roof: P.terracotta, wall: P.white, prop: 'barrels' },
      korkfest: { k: 'flowers', colors: [P.lamp, P.blue, P.white] },
    },
  },
  paprikafelder: {
    backdrop: { grass: ['#b8cc84', '#a6bc72', '#94aa62'], path: '#d9c79a', hills: ['#a8c47a', '#8aa860'], way: 'pepperLanes', kalocsa: true },
    areas: {
      paprikareihen: { k: 'rows', color: P.leafDark, flower: P.tomato },
      paprikaschnuere: { k: 'house', roof: P.woodLight, wall: P.white, prop: 'jars' },
      paprikamuehle: { k: 'house', roof: P.woodLight, wall: P.white, prop: 'still' },
      kalocsastube: { k: 'flowers', colors: [P.tomato, P.blue, P.leaf] },
      schwengelbrunnen: { k: 'water', variant: 'fountain' },
      tomatenfeld: { k: 'rows', color: P.leaf, flower: P.tomato, tall: true },
      akazienhain: { k: 'tree', crown: P.leaf, shape: 'linden' },
      schilfscheune: { k: 'house', roof: P.woodLight, wall: P.white, prop: 'barrels' },
      paprikamarkt: { k: 'house', roof: P.tomato, wall: P.white, prop: 'tent' },
      paprikafest: { k: 'flowers', colors: [P.tomato, P.lamp, P.white] },
    },
  },
  aranfelder: {
    backdrop: { grass: ['#9cc07e', '#8ab06c', '#78a05c'], path: '#c9c3b6', hills: ['#7a9a8a', '#5a7a6a'], way: 'limestone', aran: true },
    areas: {
      feldmauern: { k: 'stones', variant: 'rock' },
      tangbeete: { k: 'rows', color: P.leafMoss },
      kartoffelfurchen: { k: 'rows', color: P.leaf, flower: P.white },
      burrenblumen: { k: 'stones', variant: 'edelweiss' },
      aranweide: { k: 'animals', animal: 'goat' },
      strickstube: { k: 'house', roof: P.woodLight, wall: P.cream, prop: 'chimney' },
      strohcottage: { k: 'house', roof: P.woodLight, wall: P.white, prop: 'chimney' },
      klippenpfad: { k: 'stones', variant: 'rock' },
      hafenmauer: { k: 'water', variant: 'jetty' },
      ceili: { k: 'house', roof: P.woodLight, wall: P.cream, prop: 'stage' },
    },
  },
  rosental: {
    backdrop: { grass: ['#acc886', '#9aba74', '#88aa64'], path: '#d9c79a', hills: ['#7a8ea8', '#5f7690'], way: 'roseLanes', roseValley: true },
    areas: {
      rosenreihen: { k: 'rows', color: P.leafDark, flower: P.pink },
      pflueckkoerbe: { k: 'flowers', colors: [P.pink, P.blossom] },
      destillierkessel: { k: 'house', roof: P.terracotta, wall: P.white, prop: 'still' },
      walnussallee: { k: 'tree', crown: P.leaf },
      imkerwagen: { k: 'animals', animal: 'bee' },
      rosenwasser: { k: 'house', roof: P.terracotta, wall: P.white, prop: 'jars' },
      bergquelle: { k: 'water', variant: 'fountain' },
      veranda: { k: 'house', roof: P.terracotta, wall: P.woodMid },
      rosenboden: { k: 'house', roof: P.woodLight, wall: P.white },
      rosenfest: { k: 'flowers', colors: [P.pink, P.tomato, P.white] },
    },
  },
  pistazien: {
    backdrop: { grass: ['#d8cc98', '#cabc86', '#b8aa74'], path: '#efe1c2', hills: ['#6aa6c9', '#b8aa74'], way: 'terraceSteps', aegina: true },
    areas: {
      pistazienhain: { k: 'tree', crown: P.winterLeafDark, fruit: P.red, shape: 'olive' },
      steinterrassen: { k: 'stones', variant: 'rock' },
      kapellchen: { k: 'house', roof: P.white, wall: P.white, prop: 'bell' },
      mandelbaeume: { k: 'tree', crown: P.blossom, shape: 'blossom' },
      kapernhang: { k: 'stones', variant: 'moss' },
      roestplatz: { k: 'house', roof: P.white, wall: P.white, prop: 'chimney' },
      inselhaus: { k: 'house', roof: P.white, wall: P.white },
      zisterne: { k: 'water', variant: 'pond' },
      hafenmarkt: { k: 'water', variant: 'jetty' },
      pistazienfest: { k: 'flowers', colors: [P.lamp, P.blue, P.white] },
    },
  },
  andenkartoffeln: {
    backdrop: { grass: ['#a9b878', '#98a866', '#889856'], path: '#c9b48a', hills: ['#8a9a6a', '#8a8aa0'], way: 'andenSteps', andes: true },
    areas: {
      andenes: { k: 'stones', variant: 'rock' },
      sortenbeet: { k: 'rows', color: P.leafDark, flower: P.lilac },
      quinoafeld: { k: 'rows', color: P.leaf, flower: P.berry, tall: true },
      chunoplatz: { k: 'stones', variant: 'moss' },
      lehmspeicher: { k: 'house', roof: P.woodLight, wall: P.stoneLight, prop: 'jars' },
      alpakaweide: { k: 'animals', animal: 'goat' },
      bergkanal: { k: 'water', variant: 'stream' },
      webstube: { k: 'house', roof: P.woodLight, wall: P.terracottaLight },
      kartoffelpark: { k: 'rows', color: P.leafDark, flower: P.white },
      kartoffelfest: { k: 'flowers', colors: [P.berry, P.yellow, P.blue] },
    },
  },
  milpa: {
    backdrop: { grass: ['#b4bc78', '#a2ac66', '#909c56'], path: '#d9c79a', hills: ['#8aa060', '#6a8a50'], way: 'milpaRing', milpaHills: true },
    areas: {
      milpafeld: { k: 'rows', color: P.leaf, flower: P.yellow, tall: true },
      chiligarten: { k: 'rows', color: P.leafDark, flower: P.tomato },
      amaranth: { k: 'rows', color: P.leaf, flower: P.berry, tall: true },
      comalkueche: { k: 'house', roof: P.woodLight, wall: P.terracottaLight, prop: 'chimney' },
      maisspeicher: { k: 'house', roof: P.woodLight, wall: P.terracottaLight, prop: 'jars' },
      agavenzaun: { k: 'stones', variant: 'moss' },
      meliponen: { k: 'animals', animal: 'bee' },
      saatgutkruege: { k: 'house', roof: P.woodLight, wall: P.paper, prop: 'jars' },
      markttag: { k: 'house', roof: P.pink, wall: P.white, prop: 'tent' },
      erntefeier: { k: 'flowers', colors: [P.orange, P.pink, P.yellow] },
    },
  },
  kaffeewald: {
    backdrop: { grass: ['#7aa860', '#6a9852', '#5a8846'], path: '#b8744a', hills: ['#4f7a3a', '#3f6a2e'], way: 'forestZigzag', coffeeForest: true },
    areas: {
      waldkaffee: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      pflueckplatz: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      trockenbetten: { k: 'rows', color: P.woodLight, flower: P.berry },
      ensetegarten: { k: 'tree', crown: P.leaf, shape: 'palm' },
      honigbaeume: { k: 'animals', animal: 'bee' },
      waschplatz: { k: 'water', variant: 'stream' },
      tukul: { k: 'house', roof: P.woodMid, wall: P.woodLight },
      roestpfanne: { k: 'house', roof: P.woodMid, wall: P.woodLight, prop: 'chimney' },
      kaffeezeremonie: { k: 'flowers', colors: [P.white, P.leafLight, P.woodDark] },
      kaffeemarkt: { k: 'house', roof: P.terracottaLight, wall: P.paper, prop: 'tent' },
    },
  },
  reisterrassen: {
    backdrop: { grass: ['#9acb6a', '#88bb5a', '#76aa4c'], path: '#c9b48a', hills: ['#5f9e45', '#7a8a9e'], way: 'subakSteps', bali: true },
    areas: {
      sawah: { k: 'rows', color: P.leaf, flower: P.leafLight },
      wasserteiler: { k: 'water', variant: 'stream' },
      wassertempel: { k: 'house', roof: P.charcoal, wall: P.stone, prop: 'pagoda' },
      kokospalmen: { k: 'tree', crown: P.leafDark, shape: 'palm' },
      entenweide: { k: 'animals', animal: 'duck', water: true },
      lumbung: { k: 'house', roof: P.woodLight, wall: P.wood, prop: 'barrels' },
      hanggarten: { k: 'rows', color: P.leafDark, flower: P.tomato },
      bambusbruecke: { k: 'water', variant: 'bridge' },
      flechtwerkstatt: { k: 'house', roof: P.woodLight, wall: P.stoneLight, prop: 'jars' },
      tempelfest: { k: 'flowers', colors: [P.yellow, P.white, P.orange] },
    },
  },
  gewuerzgarten: {
    backdrop: { grass: ['#6fa855', '#5f9848', '#50883c'], path: '#c8693e', hills: ['#3f7a30', '#5f7a5a'], way: 'spiceTrail', kerala: true },
    areas: {
      pfefferranken: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      kardamom: { k: 'rows', color: P.leafDark, tall: true },
      zimtbaeume: { k: 'tree', crown: P.leafDark, fruit: P.terracotta },
      ingwerbeet: { k: 'rows', color: P.leaf },
      kurkuma: { k: 'rows', color: P.leaf, flower: P.orange },
      muskatbaum: { k: 'tree', crown: P.leafDark, fruit: P.yellow, shape: 'cone' },
      trockenmatten: { k: 'rows', color: P.woodLight, flower: P.charcoal },
      bootssteg: { k: 'water', variant: 'jetty' },
      gewuerzlager: { k: 'house', roof: P.terracotta, wall: P.cream, prop: 'barrels' },
      pookalam: { k: 'flowers', colors: [P.orange, P.yellow, P.berry, P.white] },
    },
  },
  oase: {
    backdrop: { grass: ['#c9b47a', '#b9a46a', '#a8945c'], path: '#e0c890', hills: ['#d4b078', '#a89a9e'], way: 'oasisRing', oasis: true },
    areas: {
      dattelpalmen: { k: 'tree', crown: P.leafDark, fruit: P.autumnDark, shape: 'palm' },
      stockwerkgarten: { k: 'tree', crown: P.leafDark, fruit: P.berry, shape: 'palm' },
      khettara: { k: 'water', variant: 'stream' },
      ksar: { k: 'house', roof: P.terracotta, wall: P.terracottaLight, prop: 'tower' },
      granataepfel: { k: 'tree', crown: P.leaf, fruit: P.berry },
      minzbeet: { k: 'rows', color: P.leaf },
      brunnenhof: { k: 'water', variant: 'fountain' },
      teppichstube: { k: 'house', roof: P.terracotta, wall: P.terracottaLight, prop: 'flag' },
      dattelernte: { k: 'tree', crown: P.leafDark, fruit: P.autumnDark, shape: 'palm' },
      sternenabend: { k: 'flowers', colors: [P.lamp, P.berry, P.white] },
    },
  },
  kakaogarten: {
    backdrop: { grass: ['#7aa860', '#6a9852', '#5a8846'], path: '#b8744a', hills: ['#4f7a3a', '#3f6a2e'], way: 'cocoaTrail', cocoaFarm: true },
    areas: {
      kakaobaeume: { k: 'tree', crown: P.leafDark, fruit: P.gold },
      bananenschatten: { k: 'tree', crown: P.leafLight, shape: 'palm' },
      fermentation: { k: 'rows', color: P.leaf, flower: P.cream },
      trockengestelle: { k: 'rows', color: P.woodLight, flower: P.woodDark },
      kochbananen: { k: 'tree', crown: P.leaf, shape: 'palm' },
      yamsfeld: { k: 'rows', color: P.leafDark, tall: true },
      dorfplatz: { k: 'tree', crown: P.leafDark },
      genossenschaft: { k: 'house', roof: P.stoneLight, wall: P.cream, prop: 'barrels' },
      schokowerkstatt: { k: 'house', roof: P.roof, wall: P.paper, prop: 'chimney' },
      kakaofest: { k: 'flowers', colors: [P.gold, P.leafDark, P.berry] },
    },
  },
  buschgarten: {
    backdrop: { grass: ['#a8b06a', '#98a05c', '#88904e'], path: '#c8693e', hills: ['#c8693e', '#7a8f72'], way: 'bushSpiral', bush: true },
    areas: {
      wattlehain: { k: 'tree', crown: P.winterLeaf, fruit: P.yellow },
      fingerlimetten: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      zitronenmyrte: { k: 'tree', crown: P.leafDark, fruit: P.cream },
      saltbush: { k: 'rows', color: P.winterLeafLight },
      wasserloch: { k: 'water', variant: 'pond' },
      eukalyptus: { k: 'tree', crown: P.winterLeaf },
      mahlstein: { k: 'stones', variant: 'rock' },
      saatguthuette: { k: 'house', roof: P.stoneLight, wall: P.woodLight, prop: 'jars' },
      regentank: { k: 'house', roof: P.stone, wall: P.cream, prop: 'barrels' },
      feuerabend: { k: 'flowers', colors: [P.orange, P.yellow, P.berry] },
    },
  },
  farngarten: {
    backdrop: { grass: ['#6a9e52', '#5a8e46', '#4a7e3a'], path: '#a5733f', hills: ['#3f6a2e', '#2f5a26'], way: 'fernBoardwalk', fernForest: true },
    areas: {
      baumfarne: { k: 'tree', crown: P.leafDark, shape: 'palm' },
      kauripfad: { k: 'tree', crown: P.leafDark, shape: 'cone' },
      harakeke: { k: 'rows', color: P.leafMoss, tall: true },
      haengebruecke: { k: 'water', variant: 'bridge' },
      gluehwurmgrotte: { k: 'stones', variant: 'rock' },
      kumaragarten: { k: 'rows', color: P.leaf, flower: P.plum },
      wasserfall: { k: 'water', variant: 'stream' },
      pflanzschule: { k: 'rows', color: P.leafLight },
      hanghuette: { k: 'house', roof: P.berry, wall: P.woodLight, prop: 'chimney' },
      matariki: { k: 'flowers', colors: [P.white, P.lamp, P.orange] },
    },
  },
  kimchigarten: {
    backdrop: { grass: ['#a8c47a', '#98b46a', '#88a45c'], path: '#d9c79a', hills: ['#5f8a6a', '#6a7a9a'], way: 'kimchiRows', korea: true },
    areas: {
      kohlreihen: { k: 'rows', color: P.leafPale, flower: P.leaf },
      rettichbeet: { k: 'rows', color: P.leafDark, flower: P.white },
      chilimatten: { k: 'rows', color: P.woodLight, flower: P.berry },
      onggi: { k: 'house', roof: P.soilDark, wall: P.stoneLight, prop: 'jars' },
      sesamfeld: { k: 'rows', color: P.leaf, flower: P.white, tall: true },
      perillabeet: { k: 'rows', color: P.leafMoss, flower: P.plum },
      hanokhof: { k: 'house', roof: P.charcoal, wall: P.cream, prop: 'gate' },
      kimjang: { k: 'house', roof: P.blue, wall: P.cream, prop: 'jars' },
      kakibaum: { k: 'tree', crown: P.gold, fruit: P.orange },
      chuseok: { k: 'flowers', colors: [P.cream, P.pink, P.leafPale] },
    },
  },
  dachgarten: {
    backdrop: { grass: ['#a9b48a', '#9aa67c', '#8b986e'], path: '#d9d2c2', hills: ['#a69a8a', '#8f8676'], way: 'roofRing', rooftop: true },
    areas: {
      dachbeete: { k: 'rows', color: P.leaf, flower: P.leafPale },
      bienendach: { k: 'flowers', colors: [P.yellow, P.leafLight, P.berry] },
      dachkuppel: { k: 'house', roof: P.glass, wall: P.glassEdge, prop: 'dome' },
      dachtank: { k: 'house', roof: P.leafDark, wall: P.leafMoss, prop: 'barrels' },
      solarpergola: { k: 'house', roof: P.blue, wall: P.metal, prop: 'glass' },
      kraeuterbalkon: { k: 'rows', color: P.winterLeaf, flower: P.lilac },
      lastenaufzug: { k: 'house', roof: P.charcoal, wall: P.stoneLight, prop: 'tower' },
      dachcafe: { k: 'house', roof: P.leafDark, wall: P.woodLight, prop: 'tent' },
      saatgutschrank: { k: 'house', roof: P.woodDark, wall: P.woodMid, prop: 'jars' },
      abendrotfest: { k: 'flowers', colors: [P.orange, P.lamp, P.plum] },
    },
  },
  schulgarten: {
    backdrop: { grass: ['#9cc46e', '#8ab45e', '#78a250'], path: '#a69a8a', hills: ['#6a9a48', '#5a8a3e'], way: 'schoolZigzag', schoolyard: true },
    areas: {
      klassenbeete: { k: 'rows', color: P.leaf, flower: P.red },
      schulkompost: { k: 'house', roof: P.woodLight, wall: P.wood, prop: 'barrels' },
      insektenhaus: { k: 'house', roof: P.roof, wall: P.woodMid, prop: 'hives' },
      weidentipi: { k: 'tree', crown: P.leafLight, shape: 'cone' },
      barfusspfad: { k: 'stones', variant: 'moss' },
      kraeuterschnecke: { k: 'stones', variant: 'maze' },
      schulkueche: { k: 'house', roof: P.terracotta, wall: P.cream, prop: 'chimney' },
      gartenhuette: { k: 'house', roof: P.leafDark, wall: P.wood, prop: 'barrels' },
      pausenbeet: { k: 'rows', color: P.leaf, flower: P.red },
      schulfest: { k: 'flowers', colors: [P.red, P.yellow, P.blue] },
    },
  },
  waldgarten: {
    backdrop: { grass: ['#7aa860', '#6a9852', '#5a8846'], path: '#a5733f', hills: ['#4f7a3a', '#3f6a2e'], way: 'chipSpiral', forestGarden: true },
    areas: {
      kronenschicht: { k: 'tree', crown: P.leafDark, fruit: P.woodMid },
      haselhecke: { k: 'tree', crown: P.leaf, fruit: P.woodLight },
      beerenschicht: { k: 'tree', crown: P.leaf, fruit: P.red },
      kraeuterschicht: { k: 'rows', color: P.leafDark, flower: P.white },
      bodendecker: { k: 'rows', color: P.leaf, flower: P.red },
      kletterpflanzen: { k: 'rows', color: P.leafMoss, tall: true },
      pilzstaemme: { k: 'stones', variant: 'moss' },
      weidenteich: { k: 'water', variant: 'reeds' },
      lehrpfad: { k: 'stones', variant: 'rock' },
      waldgartenfest: { k: 'flowers', colors: [P.lamp, P.orange, P.leaf] },
    },
  },
  samenbank: {
    backdrop: { grass: ['#a2c47a', '#92b46a', '#82a45c'], path: '#d9d2c2', hills: ['#6a9a48', '#5a8a3e'], way: 'seedRing', seedBank: true },
    areas: {
      vermehrungsbeete: { k: 'rows', color: P.leaf, flower: P.yellow, tall: true },
      reinigungsraum: { k: 'house', roof: P.leafLight, wall: P.paper, prop: 'barrels' },
      keimlabor: { k: 'house', roof: P.leafLight, wall: P.cream, prop: 'glass' },
      kuehltresor: { k: 'house', roof: P.leaf, wall: P.stoneLight, prop: 'gate' },
      sortengarten: { k: 'rows', color: P.leafDark, flower: P.tomato },
      samenarchiv: { k: 'house', roof: P.woodDark, wall: P.woodLight, prop: 'jars' },
      bestaeuberzelte: { k: 'house', roof: P.white, wall: P.cream, prop: 'tent' },
      versandstelle: { k: 'house', roof: P.woodMid, wall: P.woodLight, prop: 'barrels' },
      besucherpfad: { k: 'stones', variant: 'rock' },
      offenertag: { k: 'flowers', colors: [P.paper, P.leaf, P.yellow] },
    },
  },
  klimagarten: {
    backdrop: { grass: ['#b4bc7a', '#a4ac6a', '#949c5c'], path: '#8a5a32', hills: ['#7a8f72', '#5f7a5a'], way: 'mulchZigzag', climateGarden: true },
    areas: {
      trockenbeet: { k: 'flowers', colors: [P.lavender, P.blue, P.pink] },
      schwammflaeche: { k: 'water', variant: 'reeds' },
      mulchwege: { k: 'rows', color: P.woodMid, flower: P.leaf },
      schattenbaum: { k: 'tree', crown: P.leafDark, shape: 'linden' },
      zisternenspiel: { k: 'water', variant: 'fountain' },
      mischkultur: { k: 'rows', color: P.leaf, flower: P.orange },
      windhecke: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      wetterstation: { k: 'house', roof: P.metal, wall: P.white, prop: 'tower' },
      lehrkueche: { k: 'house', roof: P.leafDark, wall: P.wood, prop: 'chimney' },
      klimatag: { k: 'flowers', colors: [P.water, P.leaf, P.yellow] },
    },
  },
  wildblumenband: {
    backdrop: { grass: ['#c2c87e', '#b2b86e', '#a2a860'], path: '#a5733f', hills: ['#6a8a4a', '#5a7a3e'], way: 'meadowSpiral', wildflowerBand: true },
    areas: {
      bluehstreifen: { k: 'flowers', colors: [P.red, P.blue, P.white] },
      totholz: { k: 'stones', variant: 'moss' },
      sandarium: { k: 'stones', variant: 'rock' },
      feldrain: { k: 'rows', color: P.gold, flower: P.blue },
      feldhecke: { k: 'tree', crown: P.leafDark, fruit: P.berry },
      tuempel: { k: 'water', variant: 'reeds' },
      steinriegel: { k: 'stones', variant: 'rock' },
      wildsaatgut: { k: 'rows', color: P.gold, flower: P.red },
      gruenbruecke: { k: 'water', variant: 'bridge' },
      bestaeuberfest: { k: 'flowers', colors: [P.yellow, P.red, P.blue] },
    },
  },
  fassadengarten: {
    backdrop: { grass: ['#a9b48a', '#9aa67c', '#8b986e'], path: '#c9c3b6', hills: ['#a69a8a', '#8f8676'], way: 'courtSteps', livingWall: true },
    areas: {
      moosfassade: { k: 'house', roof: P.leaf, wall: P.stoneLight, prop: 'glass' },
      kletterhortensie: { k: 'house', roof: P.leafDark, wall: P.stoneLight, prop: 'flag' },
      hopfenranken: { k: 'rows', color: P.leafDark, flower: P.leafPale, tall: true },
      tropfschlauch: { k: 'rows', color: P.leaf, flower: P.water },
      balkonbeete: { k: 'house', roof: P.terracotta, wall: P.cream, prop: 'barrels' },
      nistwand: { k: 'house', roof: P.woodDark, wall: P.terracottaLight, prop: 'hives' },
      sensorgarten: { k: 'rows', color: P.leaf, flower: P.red },
      fensterbank: { k: 'house', roof: P.roof, wall: P.terracottaLight, prop: 'jars' },
      hofcafe: { k: 'house', roof: P.leafDark, wall: P.terracottaLight, prop: 'tent' },
      lichterfassade: { k: 'flowers', colors: [P.lamp, P.red, P.leaf] },
    },
  },
  solawihof: {
    backdrop: { grass: ['#a8c47a', '#98b46a', '#88a45c'], path: '#c9a46b', hills: ['#6a9a48', '#5a8a3e'], way: 'farmRows', communityFarm: true },
    areas: {
      gemueseschlaege: { k: 'rows', color: P.leaf, flower: P.winterLeaf },
      folientunnel: { k: 'house', roof: P.glass, wall: P.glassEdge, prop: 'glass' },
      abholraum: { k: 'house', roof: P.roof, wall: P.woodLight, prop: 'barrels' },
      kartoffelkeller: { k: 'house', roof: P.leaf, wall: P.stoneLight, prop: 'gate' },
      huehnermobil: { k: 'animals', animal: 'goose' },
      hofsaatgut: { k: 'rows', color: P.leafDark, flower: P.white, tall: true },
      versammlung: { k: 'house', roof: P.roof, wall: P.woodMid, prop: 'stage' },
      werkzeugscheune: { k: 'house', roof: P.terracotta, wall: P.barn, prop: 'barrels' },
      kinderacker: { k: 'rows', color: P.leaf, flower: P.orange },
      solawifest: { k: 'flowers', colors: [P.tomato, P.yellow, P.blue] },
    },
  },
  saatguttausch: {
    backdrop: { grass: ['#a6cf7e', '#96bf6e', '#86af60'], path: '#d9c79a', hills: ['#6a9a48', '#5a8a3e'], way: 'swapRing', seedSwap: true },
    areas: {
      tauschtische: { k: 'house', roof: P.paper, wall: P.woodLight, prop: 'jars' },
      sortenschau: { k: 'house', roof: P.cream, wall: P.woodLight, prop: 'jars' },
      erzaehlzelt: { k: 'house', roof: P.terracotta, wall: P.cream, prop: 'tent' },
      briefstation: { k: 'house', roof: P.yellow, wall: P.paper, prop: 'flag' },
      samenwerkstatt: { k: 'house', roof: P.woodLight, wall: P.paper, prop: 'jars' },
      pflanzenboerse: { k: 'rows', color: P.leaf, flower: P.white },
      weltkueche: { k: 'house', roof: P.leafDark, wall: P.wood, prop: 'chimney' },
      musikbuehne: { k: 'house', roof: P.woodDark, wall: P.woodMid, prop: 'stage' },
      archivwagen: { k: 'house', roof: P.leafMoss, wall: P.leafDark, prop: 'jars' },
      abschlussrunde: { k: 'flowers', colors: [P.paper, P.yellow, P.blossom] },
    },
  },
  weltgartenschau: {
    backdrop: { grass: ['#a2cc78', '#92bc68', '#82ac5a'], path: '#efe1c2', hills: ['#6a9a48', '#5a8a3e'], way: 'expoRing', worldExpo: true },
    areas: {
      europabeete: { k: 'flowers', colors: [P.pink, P.red, P.yellow] },
      weltbeete: { k: 'rows', color: P.leaf, flower: P.lilac },
      zukunftshalle: { k: 'house', roof: P.glass, wall: P.glassEdge, prop: 'dome' },
      gondelbahn: { k: 'house', roof: P.red, wall: P.metal, prop: 'cable' },
      wasserlichter: { k: 'water', variant: 'fountain' },
      saatguttempel: { k: 'house', roof: P.leafLight, wall: P.white, prop: 'dome' },
      kinderwald: { k: 'tree', crown: P.leaf, shape: 'round' },
      familienpavillon: { k: 'house', roof: P.leafDark, wall: P.cream, prop: 'flag' },
      aussichtssteg: { k: 'house', roof: P.woodMid, wall: P.metal, prop: 'tower' },
      eroeffnung: { k: 'flowers', colors: [P.red, P.yellow, P.blue] },
    },
  },
  omasgarten: {
    backdrop: { grass: ['#a6cc76', '#94bc66', '#82aa56'], path: '#d9c79a', hills: ['#6a9a48', '#4f7a3a'], way: 'omaZigzag', omaGarden: true },
    areas: {
      omasbeet: { k: 'rows', color: P.leaf, flower: P.red },
      omaskompost: { k: 'stones', variant: 'rock' },
      omasspirale: { k: 'stones', variant: 'rock' },
      omashecke: { k: 'tree', crown: P.leaf, fruit: P.red },
      opasapfel: { k: 'tree', crown: P.leaf, fruit: P.red, shape: 'blossom' },
      omasbienen: { k: 'animals', animal: 'bee' },
      omashuehner: { k: 'animals', animal: 'goose' },
      altglashaus: { k: 'house', roof: P.glass, wall: P.glassEdge, prop: 'glass' },
      omaslaube: { k: 'house', roof: P.roof, wall: P.wood, prop: 'chimney' },
      omasbank: { k: 'flowers', colors: [P.lavender, P.yellow, P.pink] },
    },
  },
}
