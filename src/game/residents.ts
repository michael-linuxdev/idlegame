/**
 * Gartenbewohner: animals visit when the garden suits them — a Deko piece,
 * an area that is grown enough, the season and time of day. Tap a visitor to
 * note it in the album; every species found adds +1 % Ernte for good.
 * Visits only happen while the app is open (no offline spawning).
 */
import type { DecorId } from './decor'
import type { GeneratorId } from './generators'
import type { Daypart, Season } from '../theme/ambient'

export type ResidentId =
  | 'amsel'
  | 'rotkehlchen'
  | 'meise'
  | 'igel'
  | 'wildbiene'
  | 'marienkaefer'
  | 'eichhoernchen'
  | 'kroete'
  | 'zitronenfalter'
  | 'hase'
  | 'fuchs'
  | 'eule'

export interface ResidentDef {
  id: ResidentId
  decor?: DecorId
  area?: { id: GeneratorId; level: number }
  seasons?: Season[]
  dayparts?: Daypart[]
}

export const RESIDENTS: ResidentDef[] = [
  { id: 'amsel', area: { id: 'gemuesebeet', level: 10 } },
  { id: 'rotkehlchen', decor: 'traenke' },
  { id: 'meise', decor: 'futterhaus', seasons: ['autumn', 'winter', 'spring'] },
  { id: 'igel', decor: 'laubhaufen', seasons: ['spring', 'summer', 'autumn'], dayparts: ['evening', 'night'] },
  { id: 'wildbiene', decor: 'insektenhotel', seasons: ['spring', 'summer'], dayparts: ['morning', 'day'] },
  { id: 'marienkaefer', area: { id: 'kraeuterspirale', level: 25 }, seasons: ['spring', 'summer'] },
  { id: 'eichhoernchen', area: { id: 'obstwiese', level: 10 }, seasons: ['autumn', 'winter'] },
  { id: 'kroete', area: { id: 'beerenhecke', level: 25 }, seasons: ['spring', 'summer', 'autumn'], dayparts: ['evening', 'night'] },
  { id: 'zitronenfalter', decor: 'rosenbogen', seasons: ['spring', 'summer'], dayparts: ['morning', 'day'] },
  { id: 'hase', area: { id: 'gemuesebeet', level: 50 }, dayparts: ['morning', 'evening'] },
  { id: 'fuchs', area: { id: 'huehnerstall', level: 10 }, dayparts: ['evening', 'night'] },
  { id: 'eule', decor: 'bank', area: { id: 'obstwiese', level: 25 }, dayparts: ['night'] },
]

export const RESIDENT_IDS: ResidentId[] = RESIDENTS.map((r) => r.id)
/** Permanent Ernte bonus per species found */
export const RESIDENT_BONUS = 0.01
/** How long a visitor stays (ms) */
export const RESIDENT_STAY_MS = 60_000
/** Pause between two visits (ms, random in range) */
export const RESIDENT_GAP_MS: [number, number] = [3 * 60_000, 7 * 60_000]
/** First find: Samen */
export const RESIDENT_FIRST_SAMEN = 10
/** Repeat visit: seconds of production */
export const RESIDENT_REPEAT_SEC = 60

export interface ResidentVisit {
  id: ResidentId
  until: number
}

export function residentDef(id: string): ResidentDef | undefined {
  return RESIDENTS.find((r) => r.id === id)
}

export function residentFits(
  def: ResidentDef,
  ctx: { placed: readonly DecorId[]; owned: Partial<Record<GeneratorId, number>>; season: Season; daypart: Daypart },
): boolean {
  if (def.decor && !ctx.placed.includes(def.decor)) return false
  if (def.area && (ctx.owned[def.area.id] ?? 0) < def.area.level) return false
  if (def.seasons && !def.seasons.includes(ctx.season)) return false
  if (def.dayparts && !def.dayparts.includes(ctx.daypart)) return false
  return true
}

/** Pick a visitor among those that fit; unseen species are 3× as likely. */
export function pickResident(
  ctx: Parameters<typeof residentFits>[1],
  seen: Partial<Record<ResidentId, number>>,
  rng = Math.random,
): ResidentId | null {
  const pool: ResidentId[] = []
  for (const def of RESIDENTS) {
    if (!residentFits(def, ctx)) continue
    const w = (seen[def.id] ?? 0) > 0 ? 1 : 3
    for (let i = 0; i < w; i++) pool.push(def.id)
  }
  if (pool.length === 0) return null
  return pool[Math.floor(rng() * pool.length)]!
}

export function residentsMult(seen: Partial<Record<ResidentId, number>>): number {
  let n = 0
  for (const id of RESIDENT_IDS) if ((seen[id] ?? 0) > 0) n += 1
  return 1 + RESIDENT_BONUS * n
}

export function parseResidentsSeen(raw: unknown): Partial<Record<ResidentId, number>> {
  const out: Partial<Record<ResidentId, number>> = {}
  if (raw == null || typeof raw !== 'object') return out
  for (const id of RESIDENT_IDS) {
    const v = (raw as Record<string, unknown>)[id]
    if (typeof v === 'number' && Number.isFinite(v) && v > 0) out[id] = Math.floor(v)
  }
  return out
}

export function parseResidentVisit(raw: unknown): ResidentVisit | null {
  if (raw == null || typeof raw !== 'object') return null
  const r = raw as Record<string, unknown>
  if (typeof r.id !== 'string' || !RESIDENT_IDS.includes(r.id as ResidentId)) return null
  if (typeof r.until !== 'number' || !Number.isFinite(r.until)) return null
  return { id: r.id as ResidentId, until: r.until }
}
