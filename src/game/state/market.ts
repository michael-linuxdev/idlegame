/** Spielkern — Markt, Gartenrunde, Erntefest, Werbung, Gartenwoche, Gießkanne. Öffentlich über src/game/state.ts. */
import { CHALLENGES_FROM_PRESTIGES, type ChallengeId } from '../challenges'
import {
  canClaimDaily,
  daysSinceClaim,
  isComebackClaim,
  nextStreakAfterClaim,
  rewardForStreak,
} from '../dailyOps'
import { TAP_COOLDOWN_MS } from '../economy'
import { ERNTEFEST_GOAL, ERNTEFEST_GOAL_REWARD, erntefestWindowKey, isErntefestActive } from '../events'
import { CONTEST_KG } from '../extrasCore'
import {
  AD_ERNTE_MINUTES,
  AD_SAMEN,
  type AdChoice,
  GARTENWOCHE_AD_XP,
  GARTENWOCHE_DAILY_XP,
  GARTENWOCHE_MAX_XP,
  GARTENWOCHE_TIERS,
  CLAN_BOOST,
  CLAN_BOOST_MAX,
  COSMETICS,
  type CosmeticId,
  DAILY_SKIP_CAP_HOURS,
  MARKET_GIFT_SAMEN,
  type ShopOfferDef,
  TIME_SKIPS,
  type TimeSkipId,
  WATER_REFILL_COST,
  WATER_REFILL_PER_DAY,
  YIELD_BOOST_COST,
  YIELD_BOOST_MS,
  dayKey,
  rewardedAdReady,
  shopOfferById,
  weekKey,
} from '../monetization'
import { XP_PER_DAILY } from '../progression'
import type { SeasonCardId } from '../seasonCards'
import { collectReadyAchievements } from './buy'
import { bumpQuest, productionPerSecond, syncEventWindow, syncMonetization, withXp } from './core'
import { withEventProgress } from './events'
import { growPumpkin } from './extras'
import { albumCount } from './life'
import { withRestCredit } from './rest'
import type { GameState } from './types'

function withSkipDay(state: GameState, now = Date.now()): GameState {
  const key = dayKey(now)
  if (state.skipDayKey === key) return state
  return { ...state, skipDayKey: key, skipHoursUsedToday: 0 }
}

export function skipHoursRemaining(state: GameState, now = Date.now()): number {
  const s = withSkipDay(state, now)
  return Math.max(0, DAILY_SKIP_CAP_HOURS - s.skipHoursUsedToday)
}

export function buyTimeSkip(state: GameState, id: TimeSkipId, now = Date.now()): GameState {
  const def = TIME_SKIPS.find((t) => t.id === id)
  if (!def) return state
  let next = syncEventWindow(syncMonetization(withSkipDay(state, now), now), now)
  const remaining = DAILY_SKIP_CAP_HOURS - next.skipHoursUsedToday
  if (remaining <= 0) return state
  const hours = Math.min(def.hours, remaining)
  if (hours <= 0) return state
  if (next.samen < def.cost) return state
  const rate = productionPerSecond(next, now)
  const gained = rate * hours * 3600
  next = withEventProgress(next, gained, now)
  return {
    ...next,
    samen: next.samen - def.cost,
    ernte: next.ernte + gained,
    ernteSeason: next.ernteSeason + gained,
    skipHoursUsedToday: next.skipHoursUsedToday + hours,
    lastSeen: now,
  }
}

/** Messing-Gießkanne: one missed day per week still counts for the Serie. */
export function shieldReady(state: GameState, now = Date.now()): boolean {
  return state.shieldWeek !== weekKey(now)
}

export function claimDailyOps(state: GameState, now = Date.now()): GameState {
  if (!canClaimDaily(state.dailyClaimDay, now)) return state
  let streak = nextStreakAfterClaim(state.dailyClaimDay, state.dailyStreak, now)
  const missedOne = state.dailyClaimDay !== '' && daysSinceClaim(state.dailyClaimDay, now) === 2
  const useShield = missedOne && shieldReady(state, now)
  if (useShield) streak = state.dailyStreak + 2
  const rate = productionPerSecond(state, now)
  const comeback = isComebackClaim(state.dailyClaimDay, now)
  const gapDays = comeback ? daysSinceClaim(state.dailyClaimDay, now) : 0
  const reward = rewardForStreak(Math.max(0, streak - 1), rate, {
    comeback,
    gapDays,
  })
  let next = syncEventWindow(syncMonetization(state, now), now)
  next = withEventProgress(next, reward.ernte, now)
  next = {
    ...next,
    ernte: next.ernte + reward.ernte,
    ernteSeason: next.ernteSeason + reward.ernte,
    ernteLifetime: next.ernteLifetime + reward.ernte,
    erbstuecke: next.erbstuecke + reward.erbstuecke,
    samen: next.samen + reward.samen,
    dailyClaimDay: dayKey(now),
    dailyStreak: streak,
    claimedDailyOnce: true,
    shieldWeek: useShield ? weekKey(now) : next.shieldWeek,
    lastSeen: now,
  }
  next = growPumpkin(next, CONTEST_KG.daily, now)
  next = bumpQuest(next, 'claimDaily', 1, now)
  next = bumpQuest(next, 'earnErnte', reward.ernte, now)
  next = withXp(next, XP_PER_DAILY, now)
  // Tag erledigt? Dann verkürzt er die laufende Ruhezeit (Runde 4)
  return withRestCredit(state, albumCount(collectReadyAchievements(next, now), 'daily', 1, now), now)
}

export function dismissErntefest(state: GameState, now = Date.now()): GameState {
  if (!isErntefestActive(now)) return state
  return {
    ...state,
    erntefestDismissedKey: erntefestWindowKey(now),
    lastSeen: now,
  }
}

export function claimErntefestGoal(state: GameState, now = Date.now()): GameState {
  if (!isErntefestActive(now)) return state
  const key = erntefestWindowKey(now)
  let next = syncEventWindow(state, now)
  if (next.erntefestGoalClaimedKey === key) return state
  if (next.erntefestErnte < ERNTEFEST_GOAL) return state
  return {
    ...next,
    samen: next.samen + ERNTEFEST_GOAL_REWARD,
    erntefestGoalClaimedKey: key,
    lastSeen: now,
  }
}

export function buyCosmetic(state: GameState, id: CosmeticId, now = Date.now()): GameState {
  const def = COSMETICS.find((c) => c.id === id)
  if (!def) return state
  if (state.ownedCosmetics.includes(id)) return state
  if (def.cost <= 0) {
    return {
      ...state,
      ownedCosmetics: [...state.ownedCosmetics, id],
      lastSeen: now,
    }
  }
  if (state.samen < def.cost) return state
  return {
    ...state,
    samen: state.samen - def.cost,
    ownedCosmetics: [...state.ownedCosmetics, id],
    lastSeen: now,
  }
}

export function equipCosmetic(state: GameState, id: CosmeticId, now = Date.now()): GameState {
  if (!state.ownedCosmetics.includes(id)) return state
  if (state.equippedCosmetic === id) return state
  return { ...state, equippedCosmetic: id, lastSeen: now }
}

export function buyClanBoost(state: GameState, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  if (next.samen < CLAN_BOOST.cost) return state
  const active = next.vereinBoostExpiresAt > now
  const baseExpiry = active ? next.vereinBoostExpiresAt : now
  const nextMult = Math.min(
    CLAN_BOOST_MAX,
    Math.max(next.vereinMult > 1 ? next.vereinMult : 1, CLAN_BOOST.mult),
  )
  return {
    ...next,
    samen: next.samen - CLAN_BOOST.cost,
    vereinMult: nextMult,
    vereinBoostExpiresAt: baseExpiry + CLAN_BOOST.durationMs,
    lastSeen: now,
  }
}

/** Personal Ernte-Schub — Samen sink, temporary mult. */
export function buyYieldBoost(state: GameState, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  if (next.samen < YIELD_BOOST_COST) return state
  const active = next.yieldBoostExpiresAt > now
  const baseExpiry = active ? next.yieldBoostExpiresAt : now
  return {
    ...next,
    samen: next.samen - YIELD_BOOST_COST,
    yieldBoostExpiresAt: baseExpiry + YIELD_BOOST_MS,
    lastSeen: now,
  }
}

export function mockBuyOffer(state: GameState, offer: ShopOfferDef, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  if (offer.once && next.ownedOfferIds.includes(offer.id)) return state
  if (offer.kind === 'removeAds' && next.adsRemoved) return state
  if (offer.kind === 'gartenwochePlus' && next.gartenwochePremium) return state

  const ownedCosmetics = new Set(next.ownedCosmetics)
  for (const id of offer.cosmeticIds ?? []) ownedCosmetics.add(id)

  const ownedOfferIds =
    offer.once || offer.kind === 'removeAds'
      ? Array.from(new Set([...next.ownedOfferIds, offer.id]))
      : next.ownedOfferIds

  return {
    ...next,
    samen: next.samen + (offer.samen ?? 0),
    ownedCosmetics: Array.from(ownedCosmetics),
    ownedOfferIds,
    adsRemoved: offer.kind === 'removeAds' ? true : next.adsRemoved,
    gartenwochePremium: offer.kind === 'gartenwochePlus' ? true : next.gartenwochePremium,
    lastSeen: now,
  }
}

/** @deprecated Prefer mockBuyOffer */
export function mockBuyPack(state: GameState, pack: ShopOfferDef, now = Date.now()): GameState {
  return mockBuyOffer(state, pack, now)
}

export function mockBuyOfferById(state: GameState, id: string, now = Date.now()): GameState {
  const offer = shopOfferById(id)
  if (!offer) return state
  return mockBuyOffer(state, offer, now)
}

export type RewardedAdResult =
  | { ok: false; reason: 'cooldown' }
  | {
      ok: true
      state: GameState
      kind: 'skipCrumb' | 'samenCrumb' | 'yieldCrumb'
      ernteGained: number
      samenGained: number
    }

/** Grant the optional rewarded ad the player picked (Ernte or Samen). Never blocks play. */
export function claimRewardedAd(state: GameState, choice: AdChoice = 'ernte', now = Date.now()): RewardedAdResult {
  let next = syncMonetization(state, now)
  // Werbefrei: Belohnung bleibt, nur die Werbung entfällt (Abklingzeit gilt weiter)
  if (!rewardedAdReady(next.lastRewardedAdAt, now)) {
    return { ok: false, reason: 'cooldown' }
  }
  const ernteGained = choice === 'ernte' ? productionPerSecond(next, now) * AD_ERNTE_MINUTES * 60 : 0
  const samenGained = choice === 'samen' ? AD_SAMEN : 0
  next = withEventProgress(next, ernteGained, now)
  const gartenwocheXp = Math.min(GARTENWOCHE_MAX_XP, next.gartenwocheXp + GARTENWOCHE_AD_XP)
  return {
    ok: true,
    kind: choice === 'ernte' ? 'yieldCrumb' : 'samenCrumb',
    ernteGained,
    samenGained,
    state: {
      ...next,
      ernte: next.ernte + ernteGained,
      ernteSeason: next.ernteSeason + ernteGained,
      ernteLifetime: next.ernteLifetime + ernteGained,
      samen: next.samen + samenGained,
      lastRewardedAdAt: now,
      rewardedAdClaims: next.rewardedAdClaims + 1,
      gartenwocheXp,
      lastSeen: now,
    },
  }
}

/** Markt-Tagesgeschenk: a few Samen once per calendar day. */
export function marketGiftReady(state: GameState, now = Date.now()): boolean {
  return state.marketGiftDay !== dayKey(now)
}

export function claimMarketGift(state: GameState, now = Date.now()): GameState {
  if (!marketGiftReady(state, now)) return state
  return { ...state, samen: state.samen + MARKET_GIFT_SAMEN, marketGiftDay: dayKey(now), lastSeen: now }
}

export function challengesOpen(state: GameState): boolean {
  return state.saisonenden >= CHALLENGES_FROM_PRESTIGES || state.tiefeWinter > 0 || state.generation > 0
}

/** Herausforderung für die nächste Saison wählen (null = keine). */
export function chooseNextChallenge(state: GameState, id: ChallengeId | null): GameState {
  if (id && !challengesOpen(state)) return state
  return { ...state, challengeNext: id }
}

/** Laufende Herausforderung abbrechen — die Saison läuft normal weiter. */
export function abortChallenge(state: GameState): GameState {
  return state.challenge ? { ...state, challenge: null } : state
}

/** Saison-Karte wählen (aus dem Angebot) oder `null` = ohne Karte weiter. */
export function pickSeasonCard(state: GameState, id: SeasonCardId | null): GameState {
  if (state.seasonCardOffer.length === 0) return state
  if (id && !state.seasonCardOffer.some((o) => o.id === id)) return state
  const offer = id ? state.seasonCardOffer.find((o) => o.id === id) : undefined
  return { ...state, seasonCard: id, seasonCardAusbau: offer?.ausbau === true, seasonCardOffer: [] }
}

/** Eine neue Sitzung beginnt erst nach dieser Pause (Neuladen zählt nicht). */
export const SESSION_GAP_MS = 30 * 60_000

/** Count a new session when the player comes back after a real break. */
export function countSession(state: GameState, awayMs: number): GameState {
  return awayMs >= SESSION_GAP_MS ? { ...state, sessions: state.sessions + 1 } : state
}

/** Gekaufte Auffüllungen, die heute noch gehen. */
export function waterRefillsLeft(state: GameState, now = Date.now()): number {
  const used = state.waterRefillDay === dayKey(now) ? state.waterRefills : 0
  return Math.max(0, WATER_REFILL_PER_DAY - used)
}

/** Fill the Gießkanne right away for a few Samen (only while it is refilling, max 3 per day). */
export function refillWateringCan(state: GameState, now = Date.now()): GameState {
  const waiting = state.lastTapAt > 0 && now - state.lastTapAt < TAP_COOLDOWN_MS
  if (state.challenge === 'ohneGiessen') return state
  if (!waiting || state.samen < WATER_REFILL_COST || waterRefillsLeft(state, now) <= 0) return state
  const today = dayKey(now)
  const used = state.waterRefillDay === today ? state.waterRefills : 0
  return {
    ...state,
    samen: state.samen - WATER_REFILL_COST,
    lastTapAt: 0,
    lastSeen: now,
    waterRefillDay: today,
    waterRefills: used + 1,
  }
}

export function claimGartenwocheDailyXp(state: GameState, now = Date.now()): GameState {
  let next = syncMonetization(state, now)
  const today = dayKey(now)
  if (next.gartenwocheXpDay === today) return state
  return {
    ...next,
    gartenwocheXp: Math.min(GARTENWOCHE_MAX_XP, next.gartenwocheXp + GARTENWOCHE_DAILY_XP),
    gartenwocheXpDay: today,
    lastSeen: now,
  }
}

export function claimGartenwocheTier(
  state: GameState,
  tier: number,
  track: 'free' | 'premium',
  now = Date.now(),
): GameState {
  let next = syncMonetization(state, now)
  const def = GARTENWOCHE_TIERS.find((row) => row.tier === tier)
  if (!def) return state
  if (next.gartenwocheXp < def.xp) return state
  if (track === 'premium' && !next.gartenwochePremium) return state
  const claimed =
    track === 'free' ? next.gartenwocheClaimedFree : next.gartenwocheClaimedPremium
  if (claimed.includes(tier)) return state
  const reward = track === 'free' ? def.free : def.premium
  let ernteGained = 0
  let samenGained = 0
  if (reward.kind === 'ernteSec') {
    ernteGained = productionPerSecond(next, now) * reward.amount
  } else {
    samenGained = reward.amount
  }
  next = withEventProgress(next, ernteGained, now)
  const nextClaimed = [...claimed, tier]
  return {
    ...next,
    ernte: next.ernte + ernteGained,
    ernteSeason: next.ernteSeason + ernteGained,
    ernteLifetime: next.ernteLifetime + ernteGained,
    samen: next.samen + samenGained,
    gartenwocheClaimedFree: track === 'free' ? nextClaimed : next.gartenwocheClaimedFree,
    gartenwocheClaimedPremium: track === 'premium' ? nextClaimed : next.gartenwocheClaimedPremium,
    lastSeen: now,
  }
}
