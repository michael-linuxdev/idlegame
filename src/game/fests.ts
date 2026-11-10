/**
 * Saisonale Feste — bound to the real calendar, with small in-between fests so
 * there is always one running. Each fest has its own token (Festmarken with a
 * themed name), limited Festsorten for the Pflanzenbuch, map decoration and —
 * for the four big fests — a Fest-Gartenstil as a paid extra (Samen).
 *
 * Tokens come from normal play (ausbauen, gießen, Gartenrunde, Bestellungen,
 * Saisonende). They expire when the fest ends. No production multiplier, so
 * the balance simulator is unaffected.
 *
 * Testing: `?fest=<id>` forces a fest (e.g. ?fest=advent).
 */
import type { CosmeticId } from './monetization'

export type FestId =
  | 'raunaechte'
  | 'lichtmess'
  | 'fruehlingsfest'
  | 'bluetenfest'
  | 'sommerfest'
  | 'sonnenblumen'
  | 'erntedank'
  | 'laternenfest'
  | 'advent'

export interface FestDef {
  id: FestId
  /** Big fest (own Gartenstil) or a small in-between fest */
  major: boolean
  /** [month 1–12, day] inclusive */
  from: [number, number]
  to: [number, number]
  /** Accent colour for pill + sheet */
  color: string
  /** Limited Pflanzenbuch varieties (ids in gardenLife VARIETIES) */
  varieties: string[]
  /** Fest-Gartenstil (paid extra, Samen) */
  skin?: CosmeticId
}

export const FESTS: FestDef[] = [
  { id: 'raunaechte', major: false, from: [12, 27], to: [1, 31], color: '#5b6fa8', varieties: ['christrose'] },
  { id: 'lichtmess', major: false, from: [2, 1], to: [3, 14], color: '#7aa6c2', varieties: ['schneegloeckchen'] },
  { id: 'fruehlingsfest', major: true, from: [3, 15], to: [4, 30], color: '#e48bb0', varieties: ['tulpeOsterglocke', 'baerlauch'], skin: 'festFruehling' },
  { id: 'bluetenfest', major: false, from: [5, 1], to: [6, 14], color: '#c77dd1', varieties: ['pfingstrose'] },
  { id: 'sommerfest', major: true, from: [6, 15], to: [7, 31], color: '#e2574c', varieties: ['erdbeereMieze', 'zucchiniGold'], skin: 'festSommer' },
  { id: 'sonnenblumen', major: false, from: [8, 1], to: [9, 14], color: '#e8b422', varieties: ['sonnenblumeRiesen'] },
  { id: 'erntedank', major: true, from: [9, 15], to: [10, 31], color: '#d2752c', varieties: ['kuerbisMuscat', 'apfelBoskoop'], skin: 'festErntedank' },
  { id: 'laternenfest', major: false, from: [11, 1], to: [11, 30], color: '#e39a2d', varieties: ['physalis'] },
  { id: 'advent', major: true, from: [12, 1], to: [12, 26], color: '#b8403a', varieties: ['christstern', 'gruenkohlFrost'], skin: 'festAdvent' },
]

const FEST_IDS = new Set(FESTS.map((f) => f.id))

function forcedFest(): FestId | null {
  if (typeof location === 'undefined') return null
  try {
    const id = new URLSearchParams(location.search).get('fest')
    return id && FEST_IDS.has(id as FestId) ? (id as FestId) : null
  } catch {
    return null
  }
}

function md(month: number, day: number): number {
  return month * 100 + day
}

function inRange(f: FestDef, m: number, d: number): boolean {
  const v = md(m, d)
  const a = md(f.from[0], f.from[1])
  const b = md(f.to[0], f.to[1])
  return a <= b ? v >= a && v <= b : v >= a || v <= b
}

/** The fest running at `now` (local calendar). Always one. */
export function festAt(now = Date.now()): FestDef {
  const forced = forcedFest()
  if (forced) return FESTS.find((f) => f.id === forced)!
  const d = new Date(now)
  const m = d.getMonth() + 1
  const day = d.getDate()
  return FESTS.find((f) => inRange(f, m, day)) ?? FESTS[0]!
}

/** Unique key per fest instance (Raunächte starting in December keep that year). */
export function festKeyAt(now = Date.now()): string {
  const f = festAt(now)
  const d = new Date(now)
  const year = f.from[0] > f.to[0] && d.getMonth() + 1 <= f.to[0] ? d.getFullYear() - 1 : d.getFullYear()
  return `${f.id}-${year}`
}

/** Local end of the running fest (start of the day after `to`). */
export function festEndsAt(now = Date.now()): number {
  const f = festAt(now)
  const d = new Date(now)
  let year = d.getFullYear()
  if (f.from[0] > f.to[0] && d.getMonth() + 1 >= f.from[0]) year += 1
  return new Date(year, f.to[0] - 1, f.to[1] + 1, 0, 0, 0).getTime()
}

/** Next fest after the running one (for the „Demnächst“ line). */
export function nextFest(now = Date.now()): FestDef {
  const i = FESTS.findIndex((f) => f.id === festAt(now).id)
  return FESTS[(i + 1) % FESTS.length]!
}

/* ———————————— Festmarken ———————————— */

/** Tokens per action. Fractions accumulate; the UI shows whole tokens. */
export const FEST_EARN = {
  upgrade: 0.25,
  helperUpgrade: 0.05,
  water: 3,
  daily: 10,
  order: 8,
  visitor: 2,
  seasonEnd: 15,
  /** per hour away, capped */
  offlineHour: 1,
  offlineCap: 8,
} as const

export type FestShopKind = 'variety' | 'boost' | 'seeds' | 'heirlooms' | 'skin' | 'tokenPack' | 'chapterCrop' | 'festNight'

export interface FestShopItem {
  id: string
  kind: FestShopKind
  /** Cost in Festmarken (0 when paid with Samen) */
  tokens: number
  /** Cost in Samen (paid extras) */
  samen: number
  /** Purchases allowed per fest */
  limit: number
  variety?: string
  skin?: CosmeticId
  amount?: number
}

/** Kapitel-Korb: so viele Minuten Ertrag jedes offenen Kapitels. */
export const FEST_CHAPTER_CROP_MIN = 30
/** Festnacht: so viele Stunden Ernte sofort (Garten und Kapitel). */
export const FEST_NIGHT_HOURS = 1

/** Festladen Plus: doppelter Vorrat für alles, was es mehrmals gibt. */
export function festLimit(item: FestShopItem, plus: boolean): number {
  return plus && item.limit > 1 ? item.limit * 2 : item.limit
}

/** Shop rows for one fest. Varieties are cheap→rare; paid extras last. */
export function festShop(f: FestDef): FestShopItem[] {
  const items: FestShopItem[] = f.varieties.map((v, i) => ({
    id: `v-${v}`,
    kind: 'variety' as const,
    tokens: i === 0 ? 60 : 160,
    samen: 0,
    limit: 1,
    variety: v,
  }))
  // Playtest 2026-11-10: Dauerspieler hatten alles gekauft und ~3000 Festmarken übrig
  items.push(
    { id: 'boost', kind: 'boost', tokens: 35, samen: 0, limit: 6 },
    { id: 'heirlooms', kind: 'heirlooms', tokens: 50, samen: 0, limit: 5 },
    { id: 'seeds', kind: 'seeds', tokens: 90, samen: 0, limit: 8, amount: 15 },
    { id: 'chapterCrop', kind: 'chapterCrop', tokens: 60, samen: 0, limit: 5, amount: FEST_CHAPTER_CROP_MIN },
    { id: 'festNight', kind: 'festNight', tokens: 120, samen: 0, limit: 3, amount: FEST_NIGHT_HOURS },
  )
  if (f.skin) {
    items.push({ id: `skin-${f.skin}`, kind: 'skin', tokens: 0, samen: 150, limit: 1, skin: f.skin })
  }
  items.push({ id: 'pack', kind: 'tokenPack', tokens: 0, samen: 40, limit: 3, amount: 60 })
  return items
}

