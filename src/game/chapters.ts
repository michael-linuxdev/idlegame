/**
 * Kapitel — extra plots next to Omas Garten, data-only.
 *
 * Every chapter is a list of ten areas with the same formulas as the garden
 * (C(n) = C0·g^n, R(n) = r0·n·2^Meilensteine), its own currency, an unlock
 * rule and a small uncapped Ernte bonus for the garden. A new chapter needs
 * an entry here, copy in strings (chapters.<id>), art and a backdrop — no
 * new state or reducer code.
 *
 *  Kapitel 2 · Streuobstwiese — after the first Tiefer Winter
 *  Kapitel 3 · Weinberg       — after the first Generation
 *  Kapitel 4–12               — Generation N and the previous chapter's
 *                               8th area planted (staggered over months)
 *
 * IDs are part of the save format — never rename (see CLAUDE.md).
 */
import { milestoneMult } from './generators'

export type ChapterId =
  | 'obstwiese'
  | 'weinberg'
  | 'bauernhof'
  | 'imkerei'
  | 'teich'
  | 'kraeuter'
  | 'botanik'
  | 'alm'
  | 'lavendel'
  | 'japangarten'
  | 'gartenschau'

export interface AreaDef {
  id: string
  /** Map position in percent of the chapter map box */
  slot: { left: string; top: string }
  baseRate: number
  baseCost: number
  costScale: number
  /** Previous area level needed to plant this one */
  requires?: { id: string; level: number }
}

export interface ChapterDef {
  id: ChapterId
  /** Kapitel number shown to the player */
  number: number
  areas: AreaDef[]
  /** Garden Ernte bonus per chapter level (uncapped) */
  gardenBonusPerLevel: number
  /** Opens when … */
  unlock: (s: UnlockCtx) => boolean
}

export interface UnlockCtx {
  deepPrestiges: number
  generation: number
  chapters: Record<string, { owned: Record<string, number>; openedAt: number }>
}

/** Standard ten-area ladder, scaled per chapter. */
function ladder(ids: string[], slots: [string, string][], scale: number): AreaDef[] {
  const rates = [2, 10, 60, 360, 2_200, 13_000, 80_000, 480_000, 2_900_000, 17_000_000]
  const costs = [15, 220, 3_000, 40_000, 500_000, 6_000_000, 75_000_000, 900_000_000, 11e9, 130e9]
  const growth = [1.15, 1.15, 1.145, 1.14, 1.135, 1.13, 1.125, 1.12, 1.115, 1.11]
  return ids.map((id, i) => ({
    id,
    slot: { left: slots[i]![0], top: slots[i]![1] },
    baseRate: rates[i]! * scale,
    baseCost: Math.round(costs[i]! * scale),
    costScale: growth[i]!,
    requires: i === 0 ? undefined : { id: ids[i - 1]!, level: 10 },
  }))
}

const ZIGZAG: [string, string][] = [
  ['30%', '85%'],
  ['72%', '80%'],
  ['22%', '71%'],
  ['66%', '67%'],
  ['34%', '57%'],
  ['78%', '54%'],
  ['20%', '44%'],
  ['64%', '41%'],
  ['28%', '31%'],
  ['72%', '29%'],
]

/** Kapitel N+1 opens with Generation `gen` once `prev` has its 8th area planted. */
function after(prev: ChapterId, prevAreas: string[], gen: number) {
  const eighth = prevAreas[7]!
  return (s: UnlockCtx) =>
    s.generation >= gen && (s.chapters[prev]?.openedAt ?? 0) > 0 && (s.chapters[prev]?.owned[eighth] ?? 0) >= 1
}

const AREAS = {
  weinberg: ['riesling', 'silvaner', 'spaetburgunder', 'dornfelder', 'trockenmauer', 'wingerthaus', 'kelter', 'weinkeller', 'strausse', 'weinfest'],
  bauernhof: ['kuhweide', 'ziegenstall', 'schweinekoben', 'gaensewiese', 'kartoffelacker', 'heuscheune', 'melkhaus', 'kaeserei', 'hofbaeckerei', 'bauernmarkt'],
  imkerei: ['bienenhaus', 'lindenallee', 'heide', 'rapsfeld', 'kirschhain', 'wildblumen', 'schleuder', 'wachszieherei', 'metkeller', 'honigladen'],
  teich: ['seerosen', 'schilf', 'karpfenteich', 'forellenbach', 'steg', 'fischerhuette', 'raeucherei', 'bootsverleih', 'entenbucht', 'seefest'],
  kraeuter: ['kamille', 'pfefferminze', 'ringelblume', 'johanniskraut', 'salbei', 'trockenboden', 'destille', 'salbenkueche', 'teestube', 'apothekergarten'],
  botanik: ['palmenhaus', 'kakteenhaus', 'orchideenhaus', 'victoriahaus', 'rosarium', 'steingarten', 'arboretum', 'farnschlucht', 'herbarium', 'glaskuppel'],
  alm: ['almwiese', 'kuhherde', 'sennhuette', 'edelweiss', 'enzian', 'bergbach', 'kaesekeller', 'seilbahn', 'gipfelhuette', 'almfest'],
  lavendel: ['lavendelreihen', 'sonnenblumen', 'olivenhain', 'rosmarin', 'feigenbaum', 'destillerie', 'seifenmanufaktur', 'marktstand', 'mas', 'lavendelfest'],
  japangarten: ['teestrauch', 'moosgarten', 'bambushain', 'kirschallee', 'koiteich', 'zengarten', 'teehaus', 'bonsai', 'rotebruecke', 'laternenweg'],
  gartenschau: ['eingangstor', 'blumenkorso', 'rosenbogen', 'labyrinth', 'wasserspiele', 'aussichtsturm', 'festzelt', 'seebuehne', 'ehrenpavillon', 'gedenkgarten'],
} as const

const RING: [string, string][] = [
  ['50%', '88%'],
  ['22%', '80%'],
  ['78%', '78%'],
  ['30%', '67%'],
  ['70%', '64%'],
  ['22%', '52%'],
  ['78%', '50%'],
  ['34%', '39%'],
  ['66%', '37%'],
  ['50%', '27%'],
]

const TERRACES: [string, string][] = [
  ['26%', '86%'],
  ['70%', '83%'],
  ['30%', '73%'],
  ['74%', '70%'],
  ['24%', '60%'],
  ['68%', '57%'],
  ['30%', '46%'],
  ['74%', '44%'],
  ['26%', '32%'],
  ['70%', '30%'],
]

const later: [ChapterId, number, [string, string][], number][] = [
  ['bauernhof', 4, ZIGZAG, 2],
  ['imkerei', 5, RING, 3],
  ['teich', 6, ZIGZAG, 4.5],
  ['kraeuter', 7, TERRACES, 7],
  ['botanik', 8, RING, 10],
  ['alm', 9, TERRACES, 15],
  ['lavendel', 10, ZIGZAG, 22],
  ['japangarten', 11, RING, 33],
  ['gartenschau', 12, RING, 50],
]

const ORDER: ChapterId[] = ['weinberg', 'bauernhof', 'imkerei', 'teich', 'kraeuter', 'botanik', 'alm', 'lavendel', 'japangarten', 'gartenschau']

export const CHAPTERS: ChapterDef[] = [
  {
    id: 'obstwiese',
    number: 2,
    areas: ladder(
      ['apfel', 'birne', 'kirsche', 'zwetschge', 'schafe', 'wildbienen', 'walnuss', 'mosterei', 'doerrhaus', 'obstmarkt'],
      ZIGZAG,
      1,
    ),
    gardenBonusPerLevel: 0.004,
    unlock: (s) => s.deepPrestiges >= 1 || s.generation >= 1,
  },
  {
    id: 'weinberg',
    number: 3,
    areas: ladder([...AREAS.weinberg], TERRACES, 1.5),
    gardenBonusPerLevel: 0.005,
    unlock: (s) => s.generation >= 1,
  },
  ...later.map(([id, number, slots, scale]): ChapterDef => {
    const prev = ORDER[ORDER.indexOf(id) - 1]!
    return {
      id,
      number,
      areas: ladder([...AREAS[id as keyof typeof AREAS]], slots, scale),
      gardenBonusPerLevel: 0.004 + 0.0005 * (number - 3),
      unlock: after(prev, [...AREAS[prev as keyof typeof AREAS]], number - 2),
    }
  }),
]

export const CHAPTER_IDS: ChapterId[] = CHAPTERS.map((c) => c.id)

export function chapterDef(id: ChapterId): ChapterDef {
  return CHAPTERS.find((c) => c.id === id)!
}

export interface ChapterState {
  /** Chapter currency (Obst, Trauben …) */
  cur: number
  curLifetime: number
  owned: Record<string, number>
  /** When the chapter opened (0 = still closed) */
  openedAt: number
  /** Omas letter for this chapter read */
  introSeen: boolean
}

export type ChaptersState = Record<ChapterId, ChapterState>

export function emptyChapter(def: ChapterDef): ChapterState {
  const owned: Record<string, number> = {}
  for (const a of def.areas) owned[a.id] = 0
  owned[def.areas[0]!.id] = 1
  return { cur: 20, curLifetime: 0, owned, openedAt: 0, introSeen: false }
}

export function emptyChapters(): ChaptersState {
  const out = {} as ChaptersState
  for (const c of CHAPTERS) out[c.id] = emptyChapter(c)
  return out
}

export function areaCost(a: AreaDef, owned: number, mult = 1): number {
  return Math.max(1, Math.floor(a.baseCost * Math.pow(a.costScale, owned) * mult))
}

export function areaRate(a: AreaDef, owned: number): number {
  if (owned <= 0) return 0
  return a.baseRate * owned * milestoneMult(owned)
}

export function areaUnlocked(a: AreaDef, owned: Record<string, number>): boolean {
  if (!a.requires) return true
  return (owned[a.requires.id] ?? 0) >= a.requires.level
}

export function chapterLevels(c: ChapterState): number {
  let n = 0
  for (const v of Object.values(c.owned)) n += v
  return n
}

export function chapterStage(def: ChapterDef, c: ChapterState): number {
  return def.areas.filter((a) => (c.owned[a.id] ?? 0) > 0).length
}

export function chapterBaseRate(def: ChapterDef, c: ChapterState): number {
  let sum = 0
  for (const a of def.areas) sum += areaRate(a, c.owned[a.id] ?? 0)
  return sum
}

export function chapterGardenBonus(def: ChapterDef, c: ChapterState): number {
  return c.openedAt > 0 ? def.gardenBonusPerLevel * chapterLevels(c) : 0
}

/** Product of all chapter bonuses for the garden's Ernte. */
export function chaptersGardenMult(chapters: ChaptersState): number {
  let m = 1
  for (const def of CHAPTERS) m *= 1 + chapterGardenBonus(def, chapters[def.id])
  return m
}

export function totalChapterLevels(chapters: ChaptersState): number {
  let n = 0
  for (const def of CHAPTERS) n += chapterLevels(chapters[def.id])
  return n
}
