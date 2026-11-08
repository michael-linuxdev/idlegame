/** Data: art spec per chapter area + backdrop (drawn by ChapterArt.tsx). */
import type { ChapterId } from '../game/chapters'

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
export const HAND_ART_CHAPTERS: readonly ChapterId[] = ['bauernhof', 'imkerei', 'teich']

export interface BackdropSpec {
  /** Patchwork fields behind the plots */
  fields?: boolean
  /** Conifer forest edge along the top */
  forest?: boolean
  /** Big lake in the middle of the map */
  bigLake?: boolean
  grass: [string, string, string]
  path: string
  hills: [string, string]
  water?: 'river' | 'lake' | 'none'
  mountains?: boolean
  stripes?: string
}

export const CHAPTER_ART: Partial<Record<ChapterId, { backdrop: BackdropSpec; areas: Record<string, ArtSpec> }>> = {
  bauernhof: {
    backdrop: { grass: ['#a8cf74', '#95c162', '#80ad52'], path: '#d9c79a', hills: ['#7fae58', '#6a9a48'], fields: true },
    areas: {
      kuhweide: { k: 'animals', animal: 'cow' },
      ziegenstall: { k: 'animals', animal: 'goat' },
      schweinekoben: { k: 'animals', animal: 'pig' },
      gaensewiese: { k: 'animals', animal: 'goose' },
      kartoffelacker: { k: 'rows', color: '#6f9a48', flower: '#f6f2e8' },
      heuscheune: { k: 'house', roof: '#8a3a2a', wall: '#b8743f', prop: 'barrels' },
      melkhaus: { k: 'house', roof: '#6e4a2b', wall: '#efe1c2', prop: 'chimney' },
      kaeserei: { k: 'house', roof: '#a5531a', wall: '#f3e6c8', prop: 'jars' },
      hofbaeckerei: { k: 'house', roof: '#b8403a', wall: '#efe1c2', prop: 'chimney' },
      bauernmarkt: { k: 'house', roof: '#3d8db8', wall: '#f5f0e0', prop: 'tent' },
    },
  },
  imkerei: {
    backdrop: { grass: ['#a6c97a', '#90b866', '#7ba555'], path: '#d9c79a', hills: ['#4f7a3a', '#3f6a2e'], forest: true },
    areas: {
      bienenhaus: { k: 'house', roof: '#6e4a2b', wall: '#d9b78a', prop: 'hives' },
      lindenallee: { k: 'tree', crown: '#7fae58', fruit: '#f5e08a', shape: 'linden' },
      heide: { k: 'rows', color: '#a35fb0', flower: '#c77dd1' },
      rapsfeld: { k: 'rows', color: '#e8d23a', flower: '#f5e04a' },
      kirschhain: { k: 'tree', crown: '#f7c6d9', shape: 'blossom' },
      wildblumen: { k: 'flowers', colors: ['#3d6fd1', '#e0485e', '#f6f2e8', '#f5c542'] },
      schleuder: { k: 'house', roof: '#a5531a', wall: '#efe1c2', prop: 'jars' },
      wachszieherei: { k: 'house', roof: '#c49a3a', wall: '#f5e6b8', prop: 'chimney' },
      metkeller: { k: 'house', roof: '#5a3d22', wall: '#c9b48a', prop: 'barrels' },
      honigladen: { k: 'house', roof: '#e0a21a', wall: '#fbf3e0', prop: 'jars' },
    },
  },
  teich: {
    backdrop: { grass: ['#9fcf86', '#88bd70', '#72a85c'], path: '#d9c79a', hills: ['#5f8a4a', '#4f7a3a'], bigLake: true },
    areas: {
      seerosen: { k: 'water', variant: 'lilies' },
      schilf: { k: 'water', variant: 'reeds' },
      karpfenteich: { k: 'animals', animal: 'fish', water: true },
      forellenbach: { k: 'water', variant: 'stream' },
      steg: { k: 'water', variant: 'jetty' },
      fischerhuette: { k: 'house', roof: '#3d5a8a', wall: '#a5733f', prop: 'barrels' },
      raeucherei: { k: 'house', roof: '#4a3a2a', wall: '#8a6a40', prop: 'chimney' },
      bootsverleih: { k: 'water', variant: 'bridge' },
      entenbucht: { k: 'animals', animal: 'duck', water: true },
      seefest: { k: 'house', roof: '#e2453c', wall: '#f5f0e0', prop: 'stage' },
    },
  },
  kraeuter: {
    backdrop: { grass: ['#b0cf86', '#9cc072', '#88ad60'], path: '#e2d4ae', hills: ['#7a9a58', '#6a8a48'], stripes: '#a9c47a' },
    areas: {
      kamille: { k: 'rows', color: '#8ab85a', flower: '#fbf6e8' },
      pfefferminze: { k: 'rows', color: '#4f9a5a' },
      ringelblume: { k: 'rows', color: '#6f9a48', flower: '#f08a2c' },
      johanniskraut: { k: 'rows', color: '#6f9a48', flower: '#f5c542' },
      salbei: { k: 'rows', color: '#9fb8a0' },
      trockenboden: { k: 'house', roof: '#6e4a2b', wall: '#d9b78a', prop: 'jars' },
      destille: { k: 'house', roof: '#a5531a', wall: '#efe1c2', prop: 'still' },
      salbenkueche: { k: 'house', roof: '#7a5ab8', wall: '#f5f0e0', prop: 'chimney' },
      teestube: { k: 'house', roof: '#3f7a30', wall: '#fbf3e0', prop: 'jars' },
      apothekergarten: { k: 'flowers', colors: ['#c77dd1', '#f5c542', '#fbf6e8', '#e0485e'], arch: true },
    },
  },
  botanik: {
    backdrop: { grass: ['#9fd08a', '#8ac477', '#76b062'], path: '#eae2d0', hills: ['#5f9e45', '#4f8a3a'] },
    areas: {
      palmenhaus: { k: 'house', roof: '#cfe8f4', wall: '#e8f4fa', prop: 'glass' },
      kakteenhaus: { k: 'house', roof: '#cfe8f4', wall: '#f4ecd8', prop: 'glass' },
      orchideenhaus: { k: 'house', roof: '#e2d4f0', wall: '#f4eefa', prop: 'glass' },
      victoriahaus: { k: 'water', variant: 'lilies' },
      rosarium: { k: 'flowers', colors: ['#e0485e', '#f28ab2', '#fbf6e8', '#c4553f'], arch: true },
      steingarten: { k: 'stones', variant: 'rock' },
      arboretum: { k: 'tree', crown: '#4f8f3c', shape: 'cone' },
      farnschlucht: { k: 'stones', variant: 'moss' },
      herbarium: { k: 'house', roof: '#6e4a2b', wall: '#efe1c2', prop: 'jars' },
      glaskuppel: { k: 'house', roof: '#cfe8f4', wall: '#e8f4fa', prop: 'dome' },
    },
  },
  alm: {
    backdrop: { grass: ['#a9cf7a', '#94bf66', '#7fab54'], path: '#d9c79a', hills: ['#8a9aa8', '#6f8090'], mountains: true },
    areas: {
      almwiese: { k: 'flowers', colors: ['#fbf6e8', '#f5c542', '#c77dd1', '#3d6fd1'] },
      kuhherde: { k: 'animals', animal: 'cow' },
      sennhuette: { k: 'house', roof: '#5a3d22', wall: '#a5733f', prop: 'chimney' },
      edelweiss: { k: 'stones', variant: 'edelweiss' },
      enzian: { k: 'rows', color: '#6f9a48', flower: '#2e5fc4' },
      bergbach: { k: 'water', variant: 'stream' },
      kaesekeller: { k: 'house', roof: '#6e4a2b', wall: '#c9b48a', prop: 'barrels' },
      seilbahn: { k: 'house', roof: '#b8403a', wall: '#efe1c2', prop: 'cable' },
      gipfelhuette: { k: 'house', roof: '#5a3d22', wall: '#a5733f', prop: 'flag' },
      almfest: { k: 'house', roof: '#e2453c', wall: '#f5f0e0', prop: 'bell' },
    },
  },
  lavendel: {
    backdrop: { grass: ['#d4cf8a', '#c4be76', '#b0aa62'], path: '#eadcb8', hills: ['#a9a86a', '#8f8e58'], stripes: '#9a7ac4' },
    areas: {
      lavendelreihen: { k: 'rows', color: '#7a5ab8', flower: '#9a7ac4' },
      sonnenblumen: { k: 'rows', color: '#5f9e45', flower: '#f5c542', tall: true },
      olivenhain: { k: 'tree', crown: '#9fb08a', fruit: '#4a5a2a', shape: 'olive' },
      rosmarin: { k: 'rows', color: '#6f8a6a', flower: '#a9b8e8' },
      feigenbaum: { k: 'tree', crown: '#5f9e45', fruit: '#5b3a78', shape: 'round' },
      destillerie: { k: 'house', roof: '#c4553f', wall: '#f3e6c8', prop: 'still' },
      seifenmanufaktur: { k: 'house', roof: '#c4553f', wall: '#f5ecd8', prop: 'jars' },
      marktstand: { k: 'house', roof: '#7a5ab8', wall: '#fbf3e0', prop: 'tent' },
      mas: { k: 'house', roof: '#c4553f', wall: '#efe1c2', prop: 'chimney' },
      lavendelfest: { k: 'house', roof: '#9a7ac4', wall: '#f5f0e0', prop: 'stage' },
    },
  },
  japangarten: {
    backdrop: { grass: ['#a3c98a', '#8fb877', '#7aa463'], path: '#e2dccb', hills: ['#5f7a4a', '#4f6a3a'], water: 'lake' },
    areas: {
      teestrauch: { k: 'rows', color: '#3f7a30' },
      moosgarten: { k: 'stones', variant: 'moss' },
      bambushain: { k: 'tree', crown: '#6aa04a', shape: 'bamboo' },
      kirschallee: { k: 'tree', crown: '#f7c6d9', shape: 'blossom' },
      koiteich: { k: 'animals', animal: 'koi', water: true },
      zengarten: { k: 'stones', variant: 'zen' },
      teehaus: { k: 'house', roof: '#3a3a3a', wall: '#f5ecd8', prop: 'pagoda' },
      bonsai: { k: 'tree', crown: '#4f8a3a', shape: 'cone' },
      rotebruecke: { k: 'water', variant: 'bridge' },
      laternenweg: { k: 'stones', variant: 'lanterns' },
    },
  },
  gartenschau: {
    backdrop: { grass: ['#a6d48c', '#90c877', '#7ab462'], path: '#efe6d0', hills: ['#6fae52', '#5f9a48'], water: 'lake' },
    areas: {
      eingangstor: { k: 'house', roof: '#3f7a30', wall: '#fbf3e0', prop: 'gate' },
      blumenkorso: { k: 'flowers', colors: ['#e0485e', '#f08a2c', '#f5c542', '#c77dd1'] },
      rosenbogen: { k: 'flowers', colors: ['#e0485e', '#f28ab2', '#fbf6e8'], arch: true },
      labyrinth: { k: 'stones', variant: 'maze' },
      wasserspiele: { k: 'water', variant: 'fountain' },
      aussichtsturm: { k: 'house', roof: '#b8403a', wall: '#efe1c2', prop: 'tower' },
      festzelt: { k: 'house', roof: '#f5f0e0', wall: '#fbf6e8', prop: 'tent' },
      seebuehne: { k: 'house', roof: '#3d5a8a', wall: '#f5f0e0', prop: 'stage' },
      ehrenpavillon: { k: 'house', roof: '#e0a21a', wall: '#fbf3e0', prop: 'dome' },
      gedenkgarten: { k: 'flowers', colors: ['#3d6fd1', '#fbf6e8', '#f28ab2'] },
    },
  },
}

