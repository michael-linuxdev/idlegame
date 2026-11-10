import { gateSeasons, deepRestLeft } from './longLoop'
import { useCallback } from 'react'
import { ALBUM_GOALS, albumProgress } from './album'
import { erbstueckePayout, TAP_COOLDOWN_MS, isProbeYear } from './economy'
import { saatgutkisteMult } from './truhe'
import {
  GENERATORS,
  generatorCost,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'
import { cosmeticById, dayKey, rewardedAdCooldownMsLeft, rewardedAdReady } from './monetization'
import { canClaimDaily, previewDailyReward } from './dailyOps'
import {
  erntefestStatus,
  erntefestWindowKey,
  isErntefestActive,
} from './events'
import { flashEventStatus } from './flashEvent'
import { ACHIEVEMENTS, isAchievementComplete } from './achievements'
import {
  BRANCH_MAX_RANK,
  branchCost,
  type BranchKind,
} from './branches'
import { questLabel } from './quests'
import {
  challengesOpen,
  canPrestigeNow,
  marketGiftReady,
  effectiveClanMult,
  effectiveYieldBoostMult,
  eventProductionMult,
  flashProductionMult,
  levelProductionMult,
  levelProgress,
  lineCostMult,
  playerLevelOf,
  prestigeMinErnte,
  prestigeMultiplier,
  prestigeProgress,
  productionPerSecond,
  skipHoursRemaining,
  type GameState,
  type QuestProgress,
  affordableLevels,
  canHandDownNow,
  costForLevels,
  deepSproutPayout,
  generationPayout,
  helperUnlocked,
  bulkUnlocks,
  chapterCostOf,
  openChapters,
  chapterPerSecond,
  chapterRateMult,
  ilseUnlocked,
  weinleseReady,
  recipeReady,
  shieldReady,
  pendingWeatherEvent,
  albumStats,
  syncAlbum,
  turboMult,
  expansionGardenMult,
} from './state'
import type { ChapterId } from './chapters'
import { challengeAllowsWater } from './challenges'
import { openFeatures, usedFeatures } from './featureUnlocks'
import { useGameLoop } from './hooks/useGameLoop'
import { useGardenActions } from './hooks/useGardenActions'
import { useChapterActions } from './hooks/useChapterActions'
import { useShopActions } from './hooks/useShopActions'

/** Album goals finished but not yet stamped (menu dot). */
function albumReadyCount(state: GameState, now: number): number {
  const s = syncAlbum(state, now)
  const stats = albumStats(s)
  return ALBUM_GOALS.filter((g) => !s.album.claimed.includes(g.id) && albumProgress(s.album, stats, g.id) >= g.need).length
}

export function useGame() {
  const {
    state,
    setState,
    offlineGained,
    setOfflineGained,
    offlineAwayMs,
    setOfflineAwayMs,
    stateRef,
    nowTick,
  } = useGameLoop()
  const {
    rake,
    buy,
    buyModuleBranch,
    buyMeta,
    postPrestigeFocus,
    seasonEnd,
    prestige,
    ackSeasonEnd,
    grant,
    spinWheel,
    refillWater,
    ackVariety,
    deepReset,
    handDown,
    buyLegacyRank,
    buyMany,
    buyAll,
    hireHelper,
    chooseWeather,
    claimStamp,
    chooseChallenge,
    stopChallenge,
    chooseSeasonCard,
    buildProject,
    crossStart,
    crossSkip,
    crossHarvest,
    letResidentIn,
    residentLeft,
    greetVisitorAnimal,
    purchaseDecor,
    setDecor,
    switchHelperArea,
    switchHelper,
    ackHelperReport,
    buyDeep,
    clearPostPrestigeFocus,
  } = useGardenActions({ setState, stateRef })
  const {
    buyChapter,
    buyChapterBulk,
    buyChapterCareRank,
    seeChapterIntro,
    seeAbschluss,
    forceChapter,
    hireIlse,
    switchIlse,
    weinlese,
    ackChest,
    cookRecipe,
    tapRainbow,
    wish,
    claimPumpkin,
    buyFest,
  } = useChapterActions({ setState, stateRef })
  const {
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchasePack,
    purchaseOffer,
    purchaseYieldBoost,
    adWatching,
    adPlaying,
    adResult,
    watchRewardedAd,
    cancelAd,
    claimGift,
    buyWaterRefill,
    gartenwocheClaimXp,
    gartenwocheClaimTier,
    claimDaily,
    dismissEvent,
    claimEventGoal,
    dismissFlash,
    claimFlashGoal,
    ackSurprise,
    claimQuest,
    dismissOffline,
  } = useShopActions({ setState, offlineGained, setOfflineGained, offlineAwayMs, setOfflineAwayMs })

  const tapReady =
    challengeAllowsWater(state.challenge) && (state.lastTapAt <= 0 || nowTick - state.lastTapAt >= TAP_COOLDOWN_MS)





  const mult = prestigeMultiplier(state.truhe)
  const levelMult = levelProductionMult(playerLevelOf(state))
  const vereinMult = effectiveClanMult(state, nowTick)
  const eventMult =
    eventProductionMult(nowTick) * flashProductionMult(state, nowTick)
  const progress = prestigeProgress(state)
  const discount = saatgutkisteMult(state.truhe)
  const equipped = cosmeticById(state.equippedCosmetic)
  const skipLeft = skipHoursRemaining(state, nowTick)
  const clanBoostActive =
    state.vereinBoostExpiresAt > nowTick && vereinMult > 1
  // Ruhezeit nach dem Tiefen Winter (Prestige-Panel)
  const deepRestMs = deepRestLeft(state.tieferWinterAt, nowTick, state.ruhezeitVerkuerzung.ms)
  const clanBoostMsLeft = clanBoostActive
    ? Math.max(0, state.vereinBoostExpiresAt - nowTick)
    : 0

  const yieldBoostMult = effectiveYieldBoostMult(state, nowTick)
  const yieldBoostActive = yieldBoostMult > 1
  const yieldBoostMsLeft = yieldBoostActive
    ? Math.max(0, state.yieldBoostExpiresAt - nowTick)
    : 0
  const adReady = rewardedAdReady(state.lastRewardedAdAt, nowTick)
  const adCooldownMs = rewardedAdCooldownMsLeft(state.lastRewardedAdAt, nowTick)
  const gartenwocheXpReady = state.gartenwocheXpDay !== dayKey(nowTick)

  const dailyReady = canClaimDaily(state.dailyClaimDay, nowTick)
  const dailyPreview = previewDailyReward(
    state.dailyStreak,
    state.dailyClaimDay,
    productionPerSecond(state, nowTick),
    nowTick,
  )

  const erntefest = erntefestStatus(nowTick)
  const erntefestWindow = erntefestWindowKey(nowTick)
  const erntefestVisible =
    isErntefestActive(nowTick) && state.erntefestDismissedKey !== erntefestWindow
  const erntefestGoalDone = state.erntefestErnte >= erntefest.goal
  const erntefestGoalClaimed = state.erntefestGoalClaimedKey === erntefestWindow

  const flash = flashEventStatus(
    {
      flashEventId: state.flashEventId,
      flashEndsAt: state.flashEndsAt,
      flashProgress: state.flashProgress,
      flashGoal: state.flashGoal,
      flashClaimed: state.flashClaimed,
      flashDismissed: state.flashDismissed,
      lastFlashAt: state.lastFlashAt,
    },
    nowTick,
  )

  const playerLevel = levelProgress(state.playerXp)

  const achievementRows = ACHIEVEMENTS.map((def) => {
    const claimed = state.claimedAchievements.includes(def.id)
    const complete = isAchievementComplete(def.id, {
      totalUpgrades: state.totalUpgrades,
      ernteLifetime: state.ernteLifetime,
      claimedDailyOnce: state.claimedDailyOnce,
      claimedOfflineOnce: state.claimedOfflineOnce,
      playerLevel: playerLevel.level,
      saisonenden: state.saisonenden,
      owned: state.owned,
    })
    return { def, claimed, complete }
  })

  const questRows = state.quests.map((q: QuestProgress) => ({
    ...q,
    label: questLabel(q),
    ready: !q.claimed && q.progress >= q.target,
  }))

  const costOf = useCallback(
    (id: GeneratorId) => {
      const def = GENERATORS.find((g) => g.id === id)
      if (!def) return Infinity
      return generatorCost(def, state.owned[id] ?? 0, lineCostMult(state, id))
    },
    [state],
  )

  const branchCostOf = useCallback(
    (id: GeneratorId, kind: BranchKind) => {
      const def = GENERATORS.find((g) => g.id === id)
      if (!def) return Infinity
      const ranks = state.branches[id] ?? { efficiency: 0, capacity: 0 }
      const rank = kind === 'efficiency' ? ranks.efficiency : ranks.capacity
      return branchCost(def, kind, rank)
    },
    [state.branches],
  )

  const unlocked = useCallback(
    (id: GeneratorId) => {
      const def = GENERATORS.find((g) => g.id === id)
      if (!def) return false
      return isGeneratorUnlocked(
        def,
        state.ernteSeason,
        state.owned,
        state.truhe.kompostVomVorjahr > 0,
        playerLevel.level,
        gateSeasons(state.saisonenden, state.sproesslingLaden),
      )
    },
    [
      state.ernteSeason,
      state.owned,
      state.truhe.kompostVomVorjahr,
      playerLevel.level,
      state.saisonenden,
      state.sproesslingLaden,
    ],
  )

  const featureCtx = {
    saisonenden: state.saisonenden,
    tiefeWinter: state.tiefeWinter,
    generation: state.generation,
    sessions: state.sessions,
    owned: state.owned,
    collection: state.collection,
    openChapters: openChapters(state).length,
    used: usedFeatures(state),
  }
  const features = openFeatures(featureCtx)

  return {
    state,
    stateRef,
    features,
    rate: productionPerSecond(state, nowTick),
    turboMult: turboMult(state, nowTick),
    turboMsLeft: Math.max(0, state.turboEndsAt - nowTick),
    expansionMult: expansionGardenMult(state),
    openChapters: openChapters(state),
    chapterRate: (id: ChapterId) => chapterPerSecond(state, id),
    chapterCostOf: (id: ChapterId, area: string) => chapterCostOf(state, id, area),
    chapterRateMult: chapterRateMult(state),
    ilseUnlocked: ilseUnlocked(state),
    weinleseReady: weinleseReady(state, nowTick),
    recipeReady: recipeReady(state),
    shieldReady: shieldReady(state, nowTick),
    rainbowMsLeft: Math.max(0, state.rainbowEndsAt - nowTick),
    helperUnlocked: helperUnlocked(state),
    bulkUnlocks: bulkUnlocks(state),
    canHandDown: canHandDownNow(state),
    generationPayout: generationPayout(state),
    deepSprouts: deepSproutPayout(state),
    deepRestMs,
    costForLevels: (id: GeneratorId, n: number) => costForLevels(state, id, n),
    affordableLevels: (id: GeneratorId) => affordableLevels(state, id),
    handDown,
    buyLegacyRank,
    buyMany,
    buyAll,
    hireHelper,
    switchHelper,
    switchHelperArea,
    purchaseDecor,
    letResidentIn,
    crossStart,
    buildProject,
    pickSeasonCard: chooseSeasonCard,
    chooseChallenge,
    stopChallenge,
    challengesOpen: challengesOpen(state),
    claimStamp,
    chooseWeather,
    weatherEvent: pendingWeatherEvent(state, nowTick),
    crossSkip,
    crossHarvest,
    residentLeft,
    greetVisitorAnimal,
    setDecor,
    ackHelperReport,
    buyChapter,
    buyChapterBulk,
    seeChapterIntro,
    seeAbschluss,
    buyChapterCareRank,
    forceChapter,
    hireIlse,
    switchIlse,
    weinlese,
    ackChest,
    cookRecipe,
    tapRainbow,
    wish,
    claimPumpkin,
    buyFest,
    multiplier: mult,
    levelMult,
    vereinMult,
    eventMult,
    clanBoostActive,
    clanBoostMsLeft,
    yieldBoostActive,
    yieldBoostMsLeft,
    yieldBoostMult,
    adReady,
    adCooldownMs,
    gartenwocheXpReady,
    skipHoursRemaining: skipLeft,
    equippedCosmetic: equipped,
    nextPrestige: erbstueckePayout(state.ernteSeason, state.saisonenden, isProbeYear(state)),
    prestigeMin: prestigeMinErnte(state.saisonenden, isProbeYear(state)),
    prestigeProgress: progress,
    canPrestige: canPrestigeNow(state),
    tapReady,
    tapCooldownMs: TAP_COOLDOWN_MS,
    tapCooldownLeftMs:
      state.lastTapAt <= 0
        ? 0
        : Math.max(0, TAP_COOLDOWN_MS - (nowTick - state.lastTapAt)),
    rake,
    buy,
    buyModuleBranch,
    buyMeta,
    prestige,
    postPrestigeFocus,
    seasonEnd,
    ackSeasonEnd,
    nowTick,
    grant,
    spinWheel,
    refillWater,
    ackVariety,
    deepReset,
    buyDeep,
    clearPostPrestigeFocus,
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchasePack,
    purchaseOffer,
    purchaseYieldBoost,
    watchRewardedAd,
    cancelAd,
    adWatching,
    adPlaying,
    adResult,
    claimGift,
    giftReady: marketGiftReady(state, nowTick),
    albumReady: albumReadyCount(state, nowTick),
    buyWaterRefill,
    gartenwocheClaimXp,
    gartenwocheClaimTier,
    claimDaily,
    dismissEvent,
    claimEventGoal,
    dismissFlash,
    claimFlashGoal,
    ackSurprise,
    claimQuest,
    dailyReady,
    dailyPreview,
    erntefest,
    erntefestVisible,
    erntefestGoalDone,
    erntefestGoalClaimed,
    flash,
    costOf,
    branchCostOf,
    branchMaxRank: BRANCH_MAX_RANK,
    unlocked,
    // Banner shows what really waits (gone after e.g. a Saisonende)
    offlineGained: offlineGained != null && state.offlinePending > 0.01 ? state.offlinePending : null,
    offlineAwayMs,
    dismissOffline,
    playerLevel,
    achievementRows,
    questRows,
    metaDiscount: discount,
  }
}
