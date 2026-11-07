/**
 * Monetization stubs from docs/economy.md §8.
 * Local only — no IAP backend. Hard currency: Obsidian.
 * Soft power stays free; paid = time-skips, cosmetics, clan boosts.
 */

export const DAILY_SKIP_CAP_HOURS = 6
export const CLAN_BOOST_MULT = 1.1
export const CLAN_BOOST_MAX = 1.25
export const CLAN_BOOST_MS = 60 * 60 * 1000

export type CosmeticId = 'steelDeck' | 'amberPad' | 'iceAisle' | 'goldOps'

export interface CosmeticDef {
  id: CosmeticId
  name: string
  blurb: string
  /** Obsidian cost; 0 = free starter */
  cost: number
  /** CSS accent class applied to the station map */
  accentClass: string
}

export const COSMETICS: CosmeticDef[] = [
  {
    id: 'steelDeck',
    name: 'Steel Deck',
    blurb: 'Default bright station floor — pale steel tiles.',
    cost: 0,
    accentClass: 'skin-steel',
  },
  {
    id: 'amberPad',
    name: 'Amber Pad',
    blurb: 'Warm panel wash across the courtyard pads.',
    cost: 80,
    accentClass: 'skin-amber',
  },
  {
    id: 'iceAisle',
    name: 'Ice Aisle',
    blurb: 'Cold-aisle ice-blue rim lights on every rack.',
    cost: 120,
    accentClass: 'skin-ice',
  },
  {
    id: 'goldOps',
    name: 'Gold Ops',
    blurb: 'Brushed steel-gold NOC trim — status flex only.',
    cost: 200,
    accentClass: 'skin-gold',
  },
]

export type TimeSkipId = 'cycleHour' | 'orbitSurge'

export interface TimeSkipDef {
  id: TimeSkipId
  name: string
  blurb: string
  hours: number
  cost: number
}

/** economy.md: Cinder Hour / Dominion Surge — Orbit Rack copy */
export const TIME_SKIPS: TimeSkipDef[] = [
  {
    id: 'cycleHour',
    name: 'Cycle Hour',
    blurb: 'Simulate 1h of production at your current rate.',
    hours: 1,
    cost: 40,
  },
  {
    id: 'orbitSurge',
    name: 'Orbit Surge',
    blurb: 'Simulate 4h of production at your current rate.',
    hours: 4,
    cost: 120,
  },
]

export interface ClanBoostDef {
  id: 'uplinkBanner'
  name: string
  blurb: string
  cost: number
  mult: number
  durationMs: number
}

/** economy.md Banner of Cinders → Uplink Banner */
export const CLAN_BOOST: ClanBoostDef = {
  id: 'uplinkBanner',
  name: 'Uplink Banner',
  blurb: '+10% clan production for 1 hour. Refresh extends; max ×1.25.',
  cost: 60,
  mult: CLAN_BOOST_MULT,
  durationMs: CLAN_BOOST_MS,
}

/** Mock IAP pack — grants Obsidian locally, no payment */
export interface ObsidianPackDef {
  id: string
  name: string
  blurb: string
  obsidian: number
  /** Optional free cosmetic unlock on mock buy */
  cosmeticId?: CosmeticId
  label: string
}

export const OBSIDIAN_PACKS: ObsidianPackDef[] = [
  {
    id: 'starterBundle',
    name: 'Starter Bundle',
    blurb: '200 Obsidian + Amber Pad skin. Mock buy — no real charge.',
    obsidian: 200,
    cosmeticId: 'amberPad',
    label: 'Buy (stub)',
  },
  {
    id: 'obsidian50',
    name: 'Obsidian Chip',
    blurb: '50 Obsidian for testing shop sinks. Mock grant.',
    obsidian: 50,
    label: 'Grant 50',
  },
]

/** Calendar day key in local time for daily skip caps */
export function dayKey(now = Date.now()): string {
  const d = new Date(now)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function cosmeticById(id: CosmeticId): CosmeticDef | undefined {
  return COSMETICS.find((c) => c.id === id)
}
