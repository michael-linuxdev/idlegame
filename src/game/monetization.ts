/**
 * Markt-Attrappen (Samen-Päckchen, Werbefrei, Gartenstile) + optionale Werbung / Gartenwoche.
 * Local only — no real ad SDK, no IAP backend. Store-Pläne: docs/store/.
 * Premium-Währung: Samen.
 * Soft power stays free; ads are optional rewards, never energy walls.
 */

import { t } from '../i18n'

/**
 * Real-money offers (Samentüten, Pakete, Stil-Pakete) and the premium pass
 * are placeholders (no IAP yet) — buying them costs nothing. Off since
 * 2026-11-09: in the playtest they handed out unlimited free Samen and
 * distorted the balance. Turn on again only with real store purchases
 * (Preisvorschlag: docs/store/preise.md). Rewarded ads (with cooldown) stay.
 */
export const STORE_ENABLED = false

export const DAILY_SKIP_CAP_HOURS = 6
export const CLAN_BOOST_MULT = 1.1
export const CLAN_BOOST_MAX = 1.25
export const CLAN_BOOST_MS = 60 * 60 * 1000

/** Rewarded-ad mock interstitial before grant */
export const REWARDED_AD_DELAY_MS = 2000
/** Cooldown between optional rewarded ads */
export const REWARDED_AD_COOLDOWN_MS = 3 * 60 * 1000

/** Personal yield boost (Ertrag-Schub) */
export const YIELD_BOOST_MULT = 1.15
export const YIELD_BOOST_MS = 30 * 60 * 1000
export const YIELD_BOOST_COST = 45

export type CosmeticId =
  | 'wiese'
  | 'bauerngarten'
  | 'bluetenmeer'
  | 'goldherbst'
  | 'festFruehling'
  | 'festSommer'
  | 'festErntedank'
  | 'festAdvent'

export interface CosmeticDef {
  id: CosmeticId
  name: string
  blurb: string
  /** Samen cost; 0 = free starter */
  cost: number
  /** CSS accent class applied to the garden map */
  accentClass: string
  /** Fest-Gartenstil — only sold in that fest's shop */
  fest?: boolean
}

export const COSMETICS: CosmeticDef[] = [
  {
    id: 'wiese',
    get name() {
      return t.cosmetics.wiese.name
    },
    get blurb() {
      return t.cosmetics.wiese.blurb
    },
    cost: 0,
    accentClass: 'skin-wiese',
  },
  {
    id: 'bauerngarten',
    get name() {
      return t.cosmetics.bauerngarten.name
    },
    get blurb() {
      return t.cosmetics.bauerngarten.blurb
    },
    cost: 80,
    accentClass: 'skin-bauerngarten',
  },
  {
    id: 'bluetenmeer',
    get name() {
      return t.cosmetics.bluetenmeer.name
    },
    get blurb() {
      return t.cosmetics.bluetenmeer.blurb
    },
    cost: 120,
    accentClass: 'skin-bluetenmeer',
  },
  {
    id: 'goldherbst',
    get name() {
      return t.cosmetics.goldherbst.name
    },
    get blurb() {
      return t.cosmetics.goldherbst.blurb
    },
    cost: 200,
    accentClass: 'skin-goldherbst',
  },
  {
    id: 'festFruehling',
    get name() {
      return t.cosmetics.festFruehling.name
    },
    get blurb() {
      return t.cosmetics.festFruehling.blurb
    },
    cost: 150,
    accentClass: 'skin-festFruehling',
    fest: true,
  },
  {
    id: 'festSommer',
    get name() {
      return t.cosmetics.festSommer.name
    },
    get blurb() {
      return t.cosmetics.festSommer.blurb
    },
    cost: 150,
    accentClass: 'skin-festSommer',
    fest: true,
  },
  {
    id: 'festErntedank',
    get name() {
      return t.cosmetics.festErntedank.name
    },
    get blurb() {
      return t.cosmetics.festErntedank.blurb
    },
    cost: 150,
    accentClass: 'skin-festErntedank',
    fest: true,
  },
  {
    id: 'festAdvent',
    get name() {
      return t.cosmetics.festAdvent.name
    },
    get blurb() {
      return t.cosmetics.festAdvent.blurb
    },
    cost: 150,
    accentClass: 'skin-festAdvent',
    fest: true,
  },
]

export type TimeSkipId = 'harvestHour' | 'growthDay'

export interface TimeSkipDef {
  id: TimeSkipId
  name: string
  blurb: string
  hours: number
  cost: number
}

/** Time-skip stubs — DE copy via i18n */
export const TIME_SKIPS: TimeSkipDef[] = [
  {
    id: 'harvestHour',
    get name() {
      return t.timeSkips.harvestHour.name
    },
    get blurb() {
      return t.timeSkips.harvestHour.blurb
    },
    hours: 1,
    cost: 40,
  },
  {
    id: 'growthDay',
    get name() {
      return t.timeSkips.growthDay.name
    },
    get blurb() {
      return t.timeSkips.growthDay.blurb
    },
    hours: 4,
    cost: 120,
  },
]

export interface ClanBoostDef {
  id: 'vereinsfahne'
  name: string
  blurb: string
  cost: number
  mult: number
  durationMs: number
}

export const CLAN_BOOST: ClanBoostDef = {
  id: 'vereinsfahne',
  get name() {
    return t.clanBoost.name
  },
  get blurb() {
    return t.clanBoost.blurb
  },
  cost: 60,
  mult: CLAN_BOOST_MULT,
  durationMs: CLAN_BOOST_MS,
}

/** Mock IAP / shop offer kinds */
export type ShopOfferKind =
  | 'grantSamen'
  | 'removeAds'
  | 'cosmeticPack'
  | 'gartenwochePlus'
  | 'starterBundle'

export interface ShopOfferDef {
  id: string
  kind: ShopOfferKind
  name: string
  blurb: string
  /** Mock purchase label */
  label: string
  /** Samen granted (IAP stub credit) */
  samen?: number
  /** Cosmetics unlocked on mock buy */
  cosmeticIds?: CosmeticId[]
  /** One-time; tracked via ownedOfferIds */
  once?: boolean
  /** Section grouping in shop UI */
  section: 'bundles' | 'currency' | 'cosmetics' | 'removeAds' | 'gartenwoche'
}

export const SHOP_OFFERS: ShopOfferDef[] = [
  {
    id: 'starterBundle',
    kind: 'starterBundle',
    get name() {
      return t.packs.starterBundle.name
    },
    get blurb() {
      return t.packs.starterBundle.blurb
    },
    get label() {
      return t.packs.starterBundle.label
    },
    samen: 200,
    cosmeticIds: ['bauerngarten'],
    once: true,
    section: 'bundles',
  },
  {
    id: 'removeAds',
    kind: 'removeAds',
    get name() {
      return t.packs.removeAds.name
    },
    get blurb() {
      return t.packs.removeAds.blurb
    },
    get label() {
      return t.packs.removeAds.label
    },
    once: true,
    section: 'removeAds',
  },
  {
    id: 'samen50',
    kind: 'grantSamen',
    get name() {
      return t.packs.samen50.name
    },
    get blurb() {
      return t.packs.samen50.blurb
    },
    get label() {
      return t.packs.samen50.label
    },
    samen: 50,
    section: 'currency',
  },
  {
    id: 'samen150',
    kind: 'grantSamen',
    get name() {
      return t.packs.samen150.name
    },
    get blurb() {
      return t.packs.samen150.blurb
    },
    get label() {
      return t.packs.samen150.label
    },
    samen: 150,
    section: 'currency',
  },
  {
    id: 'samen500',
    kind: 'grantSamen',
    get name() {
      return t.packs.samen500.name
    },
    get blurb() {
      return t.packs.samen500.blurb
    },
    get label() {
      return t.packs.samen500.label
    },
    samen: 500,
    section: 'currency',
  },
  {
    id: 'cosmeticPackLeaf',
    kind: 'cosmeticPack',
    get name() {
      return t.packs.cosmeticPackLeaf.name
    },
    get blurb() {
      return t.packs.cosmeticPackLeaf.blurb
    },
    get label() {
      return t.packs.cosmeticPackLeaf.label
    },
    cosmeticIds: ['bluetenmeer', 'goldherbst'],
    once: true,
    section: 'cosmetics',
  },
  {
    id: 'gartenwochePlus',
    kind: 'gartenwochePlus',
    get name() {
      return t.packs.gartenwochePlus.name
    },
    get blurb() {
      return t.packs.gartenwochePlus.blurb
    },
    get label() {
      return t.packs.gartenwochePlus.label
    },
    once: false,
    section: 'gartenwoche',
  },
]

export type RewardedAdRewardKind = 'skipCrumb' | 'samenCrumb' | 'yieldCrumb'

export interface RewardedAdRewardDef {
  kind: RewardedAdRewardKind
  /** Minutes of production for skip/yield crumbs */
  minutes?: number
  /** Hard currency crumb */
  samen?: number
}

/** What the player picks before an optional ad (shown up front, always paid). */
export type AdChoice = 'ernte' | 'samen'
/** Ernte choice: this many minutes of current production */
export const AD_ERNTE_MINUTES = 10
/** Samen choice */
export const AD_SAMEN = 6

/** Markt-Tagesgeschenk: once per calendar day, free */
export const MARKET_GIFT_SAMEN = 3
/** Gießkanne sofort auffüllen (skips the 5-min wait) */
export const WATER_REFILL_COST = 2
/** Höchstens so oft pro Tag (Playtest: Endlos-Gießen über den Markt) */
export const WATER_REFILL_PER_DAY = 3

/** @deprecated old rotating ad rewards (kept for reference; ads now use AdChoice) */
export const REWARDED_AD_REWARDS: RewardedAdRewardDef[] = [
  { kind: 'skipCrumb', minutes: 5 },
  { kind: 'samenCrumb', samen: 8 },
  { kind: 'yieldCrumb', minutes: 2 },
]

export type GartenwocheRewardKind = 'samen' | 'ernteSec'

export interface GartenwocheTierDef {
  tier: number
  /** Cumulative XP required */
  xp: number
  free: { kind: GartenwocheRewardKind; amount: number }
  premium: { kind: GartenwocheRewardKind; amount: number }
}

/** Weekly battle-pass lite — free + paid stub tracks */
export const GARTENWOCHE_TIERS: GartenwocheTierDef[] = [
  {
    tier: 1,
    xp: 0,
    free: { kind: 'samen', amount: 5 },
    premium: { kind: 'samen', amount: 20 },
  },
  {
    tier: 2,
    xp: 25,
    free: { kind: 'ernteSec', amount: 90 },
    premium: { kind: 'ernteSec', amount: 300 },
  },
  {
    tier: 3,
    xp: 50,
    free: { kind: 'samen', amount: 10 },
    premium: { kind: 'samen', amount: 40 },
  },
  {
    tier: 4,
    xp: 75,
    free: { kind: 'ernteSec', amount: 180 },
    premium: { kind: 'ernteSec', amount: 600 },
  },
  {
    tier: 5,
    xp: 100,
    free: { kind: 'samen', amount: 15 },
    premium: { kind: 'samen', amount: 60 },
  },
]

export const GARTENWOCHE_DAILY_XP = 25
export const GARTENWOCHE_AD_XP = 10
export const GARTENWOCHE_MAX_XP = 100

/** Calendar day key in local time for daily skip caps */
export function dayKey(now = Date.now()): string {
  const d = new Date(now)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** ISO-ish local week key (Mon-start) for battle-pass reset */
export function weekKey(now = Date.now()): string {
  const d = new Date(now)
  const day = d.getDay()
  const mondayOffset = day === 0 ? -6 : 1 - day
  const monday = new Date(d)
  monday.setHours(0, 0, 0, 0)
  monday.setDate(d.getDate() + mondayOffset)
  const y = monday.getFullYear()
  const m = String(monday.getMonth() + 1).padStart(2, '0')
  const dd = String(monday.getDate()).padStart(2, '0')
  return `${y}-W${m}${dd}`
}

export function cosmeticById(id: CosmeticId): CosmeticDef | undefined {
  return COSMETICS.find((c) => c.id === id)
}

export function shopOfferById(id: string): ShopOfferDef | undefined {
  return SHOP_OFFERS.find((o) => o.id === id)
}

export function rewardedAdReady(lastRewardedAdAt: number, now = Date.now()): boolean {
  if (lastRewardedAdAt <= 0) return true
  return now - lastRewardedAdAt >= REWARDED_AD_COOLDOWN_MS
}

export function rewardedAdCooldownMsLeft(
  lastRewardedAdAt: number,
  now = Date.now(),
): number {
  if (lastRewardedAdAt <= 0) return 0
  return Math.max(0, REWARDED_AD_COOLDOWN_MS - (now - lastRewardedAdAt))
}

