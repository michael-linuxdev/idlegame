/** Spielkern — Startzustand und Zustand nach dem Saisonende. Öffentlich über src/game/state.ts. */
import { emptyBranches } from '../branches'
import { EMPTY_TRUHE, prestigeStartErnte, prestigeStartErnteFloor, prestigeStartModuleLevel, saatgutkisteMult } from '../truhe'
import { GENERATORS, GENERATOR_IDS, type GeneratorId, generatorCost } from '../generators'
import { emptyLongLoopSlice } from '../longLoop'
import { dayKey, weekKey } from '../monetization'
import { emptyQuestProgress } from '../quests'
import { SEASON_CARDS_FROM_PRESTIGES, offerSeasonCards } from '../seasonCards'
import { type GameState, TURBO_MS, emptyExpansion, pickExpansion } from './types'

export function emptyOwned(): Record<GeneratorId, number> {
  const owned = {} as Record<GeneratorId, number>
  for (const id of GENERATOR_IDS) {
    owned[id] = 0
  }
  // G1 (first module) starts online — producing immediately (economy Day-1)
  owned.gemuesebeet = 1
  return owned
}

export function createInitialState(now = Date.now()): GameState {
  const quests = emptyQuestProgress(now)
  return {
    // Day-1: first greenhouse upgrade affordable immediately
    // IG-31: G1 C0=20 g=1.18 → Lv1→2 costs floor(20·1.18)=23; float 28
    ernte: 28,
    ernteSeason: 0,
    owned: emptyOwned(),
    erbstuecke: 0,
    truhe: { ...EMPTY_TRUHE },
    saisonenden: 0,
    lastSeen: now,
    lastTapAt: 0,
    vereinMult: 1,
    // Day-1 login gift: 20 Samen
    samen: 20,
    ownedCosmetics: ['wiese'],
    equippedCosmetic: 'wiese',
    skipHoursUsedToday: 0,
    skipDayKey: dayKey(now),
    vereinBoostExpiresAt: 0,
    dailyClaimDay: '',
    dailyStreak: 0,
    erntefestDismissedKey: '',
    erntefestErnte: 0,
    erntefestProgressKey: '',
    erntefestGoalClaimedKey: '',
    playerXp: 0,
    claimedLevelRewards: [],
    totalUpgrades: 0,
    ernteLifetime: 0,
    claimedDailyOnce: false,
    claimedOfflineOnce: false,
    offlinePending: 0,
    claimedAchievements: [],
    branches: emptyBranches(GENERATOR_IDS),
    questDayKey: quests.dayKey,
    quests: quests.quests,
    ownedOfferIds: [],
    adsRemoved: false,
    lastRewardedAdAt: 0,
    rewardedAdClaims: 0,
    marketGiftDay: '',
    waterRefillDay: '',
    waterRefills: 0,
    sessions: 1,
    seasonCard: null,
    seasonCardAusbau: false,
    seasonCardOffer: [],
    lastSeasonCard: '',
    challenge: null,
    challengeNext: null,
    challengesDone: [],
    yieldBoostExpiresAt: 0,
    gartenwocheKey: weekKey(now),
    gartenwocheXp: 0,
    gartenwocheClaimedFree: [],
    gartenwochePremium: false,
    gartenwocheClaimedPremium: [],
    gartenwocheXpDay: '',
    saisonendeSpikeFlags: 0,
    lastSurprise: null,
    lastSurpriseAt: 0,
    lastVariety: null,
    flashEventId: '',
    flashEndsAt: 0,
    flashProgress: 0,
    flashGoal: 0,
    flashClaimed: false,
    flashDismissed: false,
    lastFlashAt: 0,
    ...emptyLongLoopSlice(),
    ...emptyExpansion(now),
  }
}

/** Create a fresh run after prestige, keeping meta + monetization unlocks. */
export function createPostPrestigeState(prev: GameState, now = Date.now()): GameState {
  const owned = emptyOwned()
  const startLevel = prestigeStartModuleLevel(prev.truhe)
  if (startLevel > 0) {
    owned.gemuesebeet = Math.max(owned.gemuesebeet, startLevel)
  }
  const g1 = GENERATORS.find((g) => g.id === 'gemuesebeet')
  const g1Level = owned.gemuesebeet
  const g1Cost = g1
    ? generatorCost(g1, g1Level, saatgutkisteMult(prev.truhe))
    : 23
  // Always afford the next G1 Ausbauen immediately — Seed-Purse alone can be 0.
  const startErnte = Math.max(
    prestigeStartErnte(prev.truhe),
    prestigeStartErnteFloor(g1Cost),
  )
  return {
    ernte: startErnte,
    ernteSeason: 0,
    owned,
    erbstuecke: prev.erbstuecke,
    truhe: { ...prev.truhe },
    saisonenden: prev.saisonenden + 1,
    lastSeen: now,
    lastTapAt: 0,
    vereinMult: prev.vereinMult,
    samen: prev.samen,
    ownedCosmetics: [...prev.ownedCosmetics],
    equippedCosmetic: prev.equippedCosmetic,
    skipHoursUsedToday: prev.skipHoursUsedToday,
    skipDayKey: prev.skipDayKey,
    vereinBoostExpiresAt: prev.vereinBoostExpiresAt,
    dailyClaimDay: prev.dailyClaimDay,
    dailyStreak: prev.dailyStreak,
    erntefestDismissedKey: prev.erntefestDismissedKey,
    erntefestErnte: prev.erntefestErnte,
    erntefestProgressKey: prev.erntefestProgressKey,
    erntefestGoalClaimedKey: prev.erntefestGoalClaimedKey,
    playerXp: prev.playerXp,
    claimedLevelRewards: [...prev.claimedLevelRewards],
    totalUpgrades: prev.totalUpgrades,
    ernteLifetime: prev.ernteLifetime,
    claimedDailyOnce: prev.claimedDailyOnce,
    claimedOfflineOnce: prev.claimedOfflineOnce,
    offlinePending: 0,
    claimedAchievements: [...prev.claimedAchievements],
    // Branches reset with the run — soft sinks stay fair
    branches: emptyBranches(GENERATOR_IDS),
    questDayKey: prev.questDayKey,
    quests: prev.quests.map((q) => ({ ...q })),
    ownedOfferIds: [...prev.ownedOfferIds],
    adsRemoved: prev.adsRemoved,
    lastRewardedAdAt: prev.lastRewardedAdAt,
    rewardedAdClaims: prev.rewardedAdClaims,
    marketGiftDay: prev.marketGiftDay,
    waterRefillDay: prev.waterRefillDay,
    waterRefills: prev.waterRefills,
    sessions: prev.sessions,
    // Jahres-Thema gilt genau ein Gartenjahr; ab Jahr 4 neue Wahl
    seasonCard: null,
    seasonCardAusbau: false,
    lastSeasonCard: prev.seasonCard ?? prev.lastSeasonCard,
    seasonCardOffer:
      prev.saisonenden + 1 >= SEASON_CARDS_FROM_PRESTIGES
        ? offerSeasonCards(prev.owned, prev.seasonCard ?? prev.lastSeasonCard)
        : [],
    // Herausforderung bis zum Saisonende durchgehalten → geschafft
    challengesDone:
      prev.challenge && !prev.challengesDone.includes(prev.challenge)
        ? [...prev.challengesDone, prev.challenge]
        : prev.challengesDone,
    challenge: prev.challengeNext,
    challengeNext: null,
    yieldBoostExpiresAt: prev.yieldBoostExpiresAt,
    gartenwocheKey: prev.gartenwocheKey,
    gartenwocheXp: prev.gartenwocheXp,
    gartenwocheClaimedFree: [...prev.gartenwocheClaimedFree],
    gartenwochePremium: prev.gartenwochePremium,
    gartenwocheClaimedPremium: [...prev.gartenwocheClaimedPremium],
    gartenwocheXpDay: prev.gartenwocheXpDay,
    // Prestige spikes reset per run; flash / daily survive
    saisonendeSpikeFlags: 0,
    lastSurprise: null,
    lastSurpriseAt: 0,
    lastVariety: null,
    flashEventId: prev.flashEventId,
    flashEndsAt: prev.flashEndsAt,
    flashProgress: prev.flashProgress,
    flashGoal: prev.flashGoal,
    flashClaimed: prev.flashClaimed,
    flashDismissed: prev.flashDismissed,
    lastFlashAt: prev.lastFlashAt,
    // L3–L5 survive soft prestige
    sproesslinge: prev.sproesslinge,
    sproesslingLaden: { ...prev.sproesslingLaden },
    tiefeWinter: prev.tiefeWinter,
    collection: [...prev.collection],
    wheelBuff: prev.wheelBuff,
    ...pickExpansion(prev),
    turboEndsAt: now + TURBO_MS,
  }
}
