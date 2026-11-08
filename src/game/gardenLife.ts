/**
 * Garden life systems that touch the economy (and are therefore covered by
 * the balance simulator):
 *  - Pflanzenbuch: rare varieties found while ausbauen / at Saisonende;
 *    each gives a small permanent Ernte bonus (survives every reset)
 *  - Wetter: deterministic per local day, forecast visible a day ahead
 *  - Glücksrad: one spin at Saisonende, buff for the coming Gartenjahr
 */
import type { GeneratorId } from './generators'
import type { FestId } from './fests'

/* ———————————————— Pflanzenbuch ———————————————— */

export type Rarity = 'common' | 'rare' | 'precious'

export interface VarietyDef {
  id: string
  module: GeneratorId
  rarity: Rarity
  /** Festsorte — only from the fest shop while that fest runs */
  fest?: FestId
}

export const RARITY_BONUS: Record<Rarity, number> = {
  common: 0.005,
  rare: 0.015,
  precious: 0.03,
}

/** Chance per Ausbau to find a variety of that rarity (if one is left). */
export const RARITY_CHANCE: Record<Rarity, number> = {
  common: 1 / 400,
  rare: 1 / 2000,
  precious: 1 / 8000,
}

export const VARIETIES: VarietyDef[] = [
  { id: 'radieschenEiszapfen', module: 'gemuesebeet', rarity: 'common' },
  { id: 'tomateOchsenherz', module: 'gemuesebeet', rarity: 'rare' },
  { id: 'bohneBlauhilde', module: 'gemuesebeet', rarity: 'precious' },
  { id: 'wurmhumus', module: 'kompost', rarity: 'common' },
  { id: 'bokashi', module: 'kompost', rarity: 'rare' },
  { id: 'thymianZitrone', module: 'kraeuterspirale', rarity: 'common' },
  { id: 'lavendelHidcote', module: 'kraeuterspirale', rarity: 'rare' },
  { id: 'safranKrokus', module: 'kraeuterspirale', rarity: 'precious' },
  { id: 'johannisbeereRosetta', module: 'beerenhecke', rarity: 'common' },
  { id: 'stachelbeereHinnonmaeki', module: 'beerenhecke', rarity: 'rare' },
  { id: 'apfelGoldparmaene', module: 'obstwiese', rarity: 'common' },
  { id: 'birneGuteLuise', module: 'obstwiese', rarity: 'rare' },
  { id: 'zwetschgeHauszwetschge', module: 'obstwiese', rarity: 'precious' },
  { id: 'honigLinde', module: 'bienenstock', rarity: 'common' },
  { id: 'honigHeide', module: 'bienenstock', rarity: 'rare' },
  { id: 'huhnSulmtaler', module: 'huehnerstall', rarity: 'common' },
  { id: 'huhnAraucana', module: 'huehnerstall', rarity: 'rare' },
  { id: 'paprikaSpitz', module: 'gewaechshaus', rarity: 'common' },
  { id: 'gurkeSchlange', module: 'gewaechshaus', rarity: 'rare' },
  { id: 'chiliHabanero', module: 'gewaechshaus', rarity: 'precious' },
  { id: 'kartoffelBamberger', module: 'hofladen', rarity: 'common' },
  { id: 'kuerbisHokkaido', module: 'hofladen', rarity: 'rare' },
  { id: 'zitroneAmalfi', module: 'orangerie', rarity: 'rare' },
  { id: 'feigeBrunswick', module: 'orangerie', rarity: 'precious' },
  // Festsorten (fest shop only)
  { id: 'christrose', module: 'kraeuterspirale', rarity: 'rare', fest: 'raunaechte' },
  { id: 'schneegloeckchen', module: 'gemuesebeet', rarity: 'rare', fest: 'lichtmess' },
  { id: 'tulpeOsterglocke', module: 'gemuesebeet', rarity: 'common', fest: 'fruehlingsfest' },
  { id: 'baerlauch', module: 'kraeuterspirale', rarity: 'rare', fest: 'fruehlingsfest' },
  { id: 'pfingstrose', module: 'beerenhecke', rarity: 'rare', fest: 'bluetenfest' },
  { id: 'erdbeereMieze', module: 'beerenhecke', rarity: 'common', fest: 'sommerfest' },
  { id: 'zucchiniGold', module: 'gemuesebeet', rarity: 'rare', fest: 'sommerfest' },
  { id: 'sonnenblumeRiesen', module: 'gemuesebeet', rarity: 'rare', fest: 'sonnenblumen' },
  { id: 'kuerbisMuscat', module: 'hofladen', rarity: 'common', fest: 'erntedank' },
  { id: 'apfelBoskoop', module: 'obstwiese', rarity: 'rare', fest: 'erntedank' },
  { id: 'physalis', module: 'gewaechshaus', rarity: 'rare', fest: 'laternenfest' },
  { id: 'christstern', module: 'gewaechshaus', rarity: 'common', fest: 'advent' },
  { id: 'gruenkohlFrost', module: 'gemuesebeet', rarity: 'rare', fest: 'advent' },
]

/** Varieties that can be found by gardening (no Festsorten). */
export const GARDEN_VARIETIES: VarietyDef[] = VARIETIES.filter((v) => !v.fest)

export function collectionMult(collection: readonly string[]): number {
  let bonus = 0
  for (const v of VARIETIES) if (collection.includes(v.id)) bonus += RARITY_BONUS[v.rarity]
  return 1 + bonus
}

/** Roll for a new variety when `module` is ausgebaut. */
export function rollVarietyOnUpgrade(
  module: GeneratorId,
  collection: readonly string[],
  rng = Math.random,
): string | null {
  const open = GARDEN_VARIETIES.filter((v) => v.module === module && !collection.includes(v.id))
  for (const v of open) if (rng() < RARITY_CHANCE[v.rarity]) return v.id
  return null
}

/** Saisonende always gifts one missing variety from the planted areas. */
export function varietyForSeasonEnd(
  planted: readonly GeneratorId[],
  collection: readonly string[],
  rng = Math.random,
): string | null {
  const open = GARDEN_VARIETIES.filter((v) => planted.includes(v.module) && !collection.includes(v.id))
  if (open.length === 0) return null
  // commons first, so the book fills in a satisfying order
  const pool = open.filter((v) => v.rarity === 'common')
  const pick = pool.length > 0 ? pool : open
  return pick[Math.floor(rng() * pick.length)]!.id
}

/* ———————————————— Wetter ———————————————— */

export type Weather = 'sonne' | 'regen' | 'wind' | 'mild'

function localDayIndex(now: number): number {
  const d = new Date(now)
  return Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86_400_000)
}

/** Deterministic weather for the local day containing `now`. */
export function weatherAt(now: number): Weather {
  // small integer hash so neighbouring days differ
  let x = localDayIndex(now) * 2654435761
  x = (x ^ (x >>> 13)) >>> 0
  const r = x % 10
  return r < 3 ? 'sonne' : r < 5 ? 'regen' : r < 7 ? 'wind' : 'mild'
}

export function weatherTomorrow(now: number): Weather {
  return weatherAt(now + 86_400_000)
}

/** Sonne: +10 % Ernte/s. */
export function weatherYieldMult(now: number): number {
  return weatherAt(now) === 'sonne' ? 1.1 : 1
}

/** Regen: Gießen bringt doppelt so viel. */
export function weatherWaterMult(now: number): number {
  return weatherAt(now) === 'regen' ? 2 : 1
}

/** Wind: Besucher kommen häufiger. */
export function weatherVisitorMult(now: number): number {
  return weatherAt(now) === 'wind' ? 1.6 : 1
}

/* ———————————————— Glücksrad ———————————————— */

export type WheelKind = 'yield' | 'water' | 'seeds' | 'variety'

export interface WheelBuff {
  kind: WheelKind
  /** Active while state.prestiges equals this value */
  prestige: number
}

export const WHEEL_SEGMENTS: WheelKind[] = ['yield', 'water', 'seeds', 'yield', 'variety', 'water']

export function wheelYieldMult(buff: WheelBuff | null, prestiges: number): number {
  return buff && buff.kind === 'yield' && buff.prestige === prestiges ? 1.25 : 1
}

export function wheelWaterMult(buff: WheelBuff | null, prestiges: number): number {
  return buff && buff.kind === 'water' && buff.prestige === prestiges ? 2 : 1
}

export const WHEEL_SEEDS = 30
