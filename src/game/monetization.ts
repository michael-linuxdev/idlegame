/**
 * Monetization stubs from docs/economy.md §8 + ads / battle-pass lite.
 * Local only — no real ad SDK, no IAP backend.
 * Hard currency: Obsidian (UI: Samen / Obsidian via theme).
 * Soft power stays free; ads are optional rewards, never energy walls.
 */

import { t } from '../i18n'

/**
 * Real-money offers, rewarded ads and the premium pass are placeholders (no
 * IAP / ad SDK yet). They stay visible for testing and are labelled as
 * Platzhalter in the Markt. Set to false to hide them for a launch build.
 */
export const STORE_ENABLED = true

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
  /** Obsidian cost; 0 = free starter */
  cost: number
  /** CSS accent class applied to the garden map */
  accentClass: string
  /** Fest-Gartenstil — only sold in that fest's shop */
  fest?: boolean
}

export const COSMETICS: CosmeticDef[] = [
  {
    id: 'wiese',
    name: t.cosmetics.wiese.name,
    blurb: t.cosmetics.wiese.blurb,
    cost: 0,
    accentClass: 'skin-wiese',
  },
  {
    id: 'bauerngarten',
    name: t.cosmetics.bauerngarten.name,
    blurb: t.cosmetics.bauerngarten.blurb,
    cost: 80,
    accentClass: 'skin-bauerngarten',
  },
  {
    id: 'bluetenmeer',
    name: t.cosmetics.bluetenmeer.name,
    blurb: t.cosmetics.bluetenmeer.blurb,
    cost: 120,
    accentClass: 'skin-bluetenmeer',
  },
  {
    id: 'goldherbst',
    name: t.cosmetics.goldherbst.name,
    blurb: t.cosmetics.goldherbst.blurb,
    cost: 200,
    accentClass: 'skin-goldherbst',
  },
  {
    id: 'festFruehling',
    name: t.cosmetics.festFruehling.name,
    blurb: t.cosmetics.festFruehling.blurb,
    cost: 150,
    accentClass: 'skin-festFruehling',
    fest: true,
  },
  {
    id: 'festSommer',
    name: t.cosmetics.festSommer.name,
    blurb: t.cosmetics.festSommer.blurb,
    cost: 150,
    accentClass: 'skin-festSommer',
    fest: true,
  },
  {
    id: 'festErntedank',
    name: t.cosmetics.festErntedank.name,
    blurb: t.cosmetics.festErntedank.blurb,
    cost: 150,
    accentClass: 'skin-festErntedank',
    fest: true,
  },
  {
    id: 'festAdvent',
    name: t.cosmetics.festAdvent.name,
    blurb: t.cosmetics.festAdvent.blurb,
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
    name: t.timeSkips.harvestHour.name,
    blurb: t.timeSkips.harvestHour.blurb,
    hours: 1,
    cost: 40,
  },
  {
    id: 'growthDay',
    name: t.timeSkips.growthDay.name,
    blurb: t.timeSkips.growthDay.blurb,
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
  name: t.clanBoost.name,
  blurb: t.clanBoost.blurb,
  cost: 60,
  mult: CLAN_BOOST_MULT,
  durationMs: CLAN_BOOST_MS,
}

/** Mock IAP / shop offer kinds */
export type ShopOfferKind =
  | 'grantObsidian'
  | 'removeAds'
  | 'cosmeticPack'
  | 'battlePassPremium'
  | 'starterBundle'

export interface ShopOfferDef {
  id: string
  kind: ShopOfferKind
  name: string
  blurb: string
  /** Mock purchase label */
  label: string
  /** Obsidian granted (IAP stub credit) */
  samen?: number
  /** Cosmetics unlocked on mock buy */
  cosmeticIds?: CosmeticId[]
  /** One-time; tracked via ownedOfferIds */
  once?: boolean
  /** Section grouping in shop UI */
  section: 'bundles' | 'currency' | 'cosmetics' | 'removeAds' | 'battlePass'
}

export const SHOP_OFFERS: ShopOfferDef[] = [
  {
    id: 'starterBundle',
    kind: 'starterBundle',
    name: t.packs.starterBundle.name,
    blurb: t.packs.starterBundle.blurb,
    label: t.packs.starterBundle.label,
    samen: 200,
    cosmeticIds: ['bauerngarten'],
    once: true,
    section: 'bundles',
  },
  {
    id: 'removeAds',
    kind: 'removeAds',
    name: t.packs.removeAds.name,
    blurb: t.packs.removeAds.blurb,
    label: t.packs.removeAds.label,
    once: true,
    section: 'removeAds',
  },
  {
    id: 'obsidian50',
    kind: 'grantObsidian',
    name: t.packs.obsidian50.name,
    blurb: t.packs.obsidian50.blurb,
    label: t.packs.obsidian50.label,
    samen: 50,
    section: 'currency',
  },
  {
    id: 'obsidian150',
    kind: 'grantObsidian',
    name: t.packs.obsidian150.name,
    blurb: t.packs.obsidian150.blurb,
    label: t.packs.obsidian150.label,
    samen: 150,
    section: 'currency',
  },
  {
    id: 'obsidian500',
    kind: 'grantObsidian',
    name: t.packs.obsidian500.name,
    blurb: t.packs.obsidian500.blurb,
    label: t.packs.obsidian500.label,
    samen: 500,
    section: 'currency',
  },
  {
    id: 'cosmeticPackLeaf',
    kind: 'cosmeticPack',
    name: t.packs.cosmeticPackLeaf.name,
    blurb: t.packs.cosmeticPackLeaf.blurb,
    label: t.packs.cosmeticPackLeaf.label,
    cosmeticIds: ['bluetenmeer', 'goldherbst'],
    once: true,
    section: 'cosmetics',
  },
  {
    id: 'battlePassPremium',
    kind: 'battlePassPremium',
    name: t.packs.battlePassPremium.name,
    blurb: t.packs.battlePassPremium.blurb,
    label: t.packs.battlePassPremium.label,
    once: false,
    section: 'battlePass',
  },
]

/** @deprecated Prefer SHOP_OFFERS — kept for older call sites */
export type ObsidianPackDef = ShopOfferDef
export const OBSIDIAN_PACKS: ShopOfferDef[] = SHOP_OFFERS.filter(
  (o) => o.section === 'bundles' || o.section === 'currency',
)

export type RewardedAdRewardKind = 'skipCrumb' | 'obsidianCrumb' | 'yieldCrumb'

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

/** @deprecated old rotating ad rewards (kept for reference; ads now use AdChoice) */
export const REWARDED_AD_REWARDS: RewardedAdRewardDef[] = [
  { kind: 'skipCrumb', minutes: 5 },
  { kind: 'obsidianCrumb', samen: 8 },
  { kind: 'yieldCrumb', minutes: 2 },
]

export type BattlePassRewardKind = 'samen' | 'computeSec'

export interface BattlePassTierDef {
  tier: number
  /** Cumulative XP required */
  xp: number
  free: { kind: BattlePassRewardKind; amount: number }
  premium: { kind: BattlePassRewardKind; amount: number }
}

/** Weekly battle-pass lite — free + paid stub tracks */
export const BATTLE_PASS_TIERS: BattlePassTierDef[] = [
  {
    tier: 1,
    xp: 0,
    free: { kind: 'samen', amount: 5 },
    premium: { kind: 'samen', amount: 20 },
  },
  {
    tier: 2,
    xp: 25,
    free: { kind: 'computeSec', amount: 90 },
    premium: { kind: 'computeSec', amount: 300 },
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
    free: { kind: 'computeSec', amount: 180 },
    premium: { kind: 'computeSec', amount: 600 },
  },
  {
    tier: 5,
    xp: 100,
    free: { kind: 'samen', amount: 15 },
    premium: { kind: 'samen', amount: 60 },
  },
]

export const BATTLE_PASS_DAILY_XP = 25
export const BATTLE_PASS_AD_XP = 10
export const BATTLE_PASS_MAX_XP = 100

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

/** Deterministic rotating reward index from claim count */
export function nextRewardedAdReward(claimCount: number): RewardedAdRewardDef {
  const i = Math.abs(claimCount) % REWARDED_AD_REWARDS.length
  return REWARDED_AD_REWARDS[i]!
}
