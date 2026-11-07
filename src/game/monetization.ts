/**
 * Monetization stubs from docs/economy.md §8.
 * Local only — no IAP backend. Hard currency: Obsidian.
 * Soft power stays free; paid = time-skips, cosmetics, clan boosts.
 * Display copy from i18n/de (German UI).
 */

import { t } from '../i18n'

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
    name: t.cosmetics.steelDeck.name,
    blurb: t.cosmetics.steelDeck.blurb,
    cost: 0,
    accentClass: 'skin-steel',
  },
  {
    id: 'amberPad',
    name: t.cosmetics.amberPad.name,
    blurb: t.cosmetics.amberPad.blurb,
    cost: 80,
    accentClass: 'skin-amber',
  },
  {
    id: 'iceAisle',
    name: t.cosmetics.iceAisle.name,
    blurb: t.cosmetics.iceAisle.blurb,
    cost: 120,
    accentClass: 'skin-ice',
  },
  {
    id: 'goldOps',
    name: t.cosmetics.goldOps.name,
    blurb: t.cosmetics.goldOps.blurb,
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

/** economy.md: Cinder Hour / Dominion Surge — Orbit Rack copy (DE) */
export const TIME_SKIPS: TimeSkipDef[] = [
  {
    id: 'cycleHour',
    name: t.timeSkips.cycleHour.name,
    blurb: t.timeSkips.cycleHour.blurb,
    hours: 1,
    cost: 40,
  },
  {
    id: 'orbitSurge',
    name: t.timeSkips.orbitSurge.name,
    blurb: t.timeSkips.orbitSurge.blurb,
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

/** economy.md Banner of Cinders → Uplink-Banner (DE) */
export const CLAN_BOOST: ClanBoostDef = {
  id: 'uplinkBanner',
  name: t.clanBoost.name,
  blurb: t.clanBoost.blurb,
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
    name: t.packs.starterBundle.name,
    blurb: t.packs.starterBundle.blurb,
    obsidian: 200,
    cosmeticId: 'amberPad',
    label: t.packs.starterBundle.label,
  },
  {
    id: 'obsidian50',
    name: t.packs.obsidian50.name,
    blurb: t.packs.obsidian50.blurb,
    obsidian: 50,
    label: t.packs.obsidian50.label,
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
