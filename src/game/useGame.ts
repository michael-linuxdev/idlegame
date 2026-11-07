import { useCallback, useEffect, useRef, useState } from 'react'
import {
  foundryDiscountMult,
  TAP_COOLDOWN_MS,
  tapBonusSeconds,
  type EmberUpgradeId,
} from './economy'
import {
  GENERATORS,
  generatorCost,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'
import {
  cosmeticById,
  dayKey,
  rewardedAdCooldownMsLeft,
  rewardedAdReady,
  type CosmeticId,
  type ShopOfferDef,
  type TimeSkipId,
} from './monetization'
import { canClaimDaily, previewDailyReward } from './dailyOps'
import {
  bandwidthSurgeStatus,
  bandwidthSurgeWindowKey,
  isBandwidthSurgeActive,
} from './events'
import { ACHIEVEMENTS, isAchievementComplete } from './achievements'
import {
  BRANCH_MAX_RANK,
  branchCost,
  type BranchKind,
} from './branches'
import { questLabel } from './quests'
import {
  applyOfflineCatchup,
  applyTick,
  buyBranch,
  buyClanBoost,
  buyCosmetic,
  buyEmberUpgrade,
  buyGenerator,
  buyTimeSkip,
  canPrestigeNow,
  buyYieldBoost,
  claimBandwidthSurgeGoal,
  claimBattlePassDailyXp,
  claimBattlePassTier,
  claimDailyOps,
  claimQuestReward,
  claimRewardedAd,
  collectReadyAchievements,
  dismissBandwidthSurge,
  doPrestige,
  effectiveClanMult,
  effectiveYieldBoostMult,
  equipCosmetic,
  eventProductionMult,
  claimOfflineReward,
  grantTapAsh,
  levelProductionMult,
  levelProgress,
  lineCostMult,
  mockBuyOffer,
  nextPrestigeEmbers,
  playerLevelOf,
  prestigeMinAsh,
  prestigeMultiplier,
  prestigeProgress,
  productionPerSecond,
  skipHoursRemaining,
  type GameState,
  type QuestProgress,
} from './state'
import { loadState, saveState } from './storage'

const TICK_MS = 100

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    const loaded = loadState()
    return applyOfflineCatchup(loaded).state
  })
  const [offlineGained, setOfflineGained] = useState<number | null>(() => {
    const loaded = loadState()
    const { gained } = applyOfflineCatchup(loaded)
    return gained > 0.01 ? gained : null
  })
  const [offlineAwayMs] = useState<number>(() => {
    const loaded = loadState()
    return Math.max(0, Date.now() - loaded.lastSeen)
  })

  const stateRef = useRef(state)
  useEffect(() => {
    stateRef.current = state
  }, [state])

  const [nowTick, setNowTick] = useState(() => Date.now())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowTick(Date.now())
      setState((s) => applyTick(s, TICK_MS / 1000))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const flush = () => {
      const next = { ...stateRef.current, lastSeen: Date.now() }
      saveState(next)
    }
    window.addEventListener('pagehide', flush)
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
      if (document.visibilityState === 'visible') {
        setState((s) => {
          const { state: next, gained } = applyOfflineCatchup(s)
          if (gained > 0.01) setOfflineGained(gained)
          return collectReadyAchievements(next)
        })
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  const tapReady =
    state.lastTapAt <= 0 || nowTick - state.lastTapAt >= TAP_COOLDOWN_MS

  const rake = useCallback(() => {
    setState((s) => {
      const now = Date.now()
      if (s.lastTapAt > 0 && now - s.lastTapAt < TAP_COOLDOWN_MS) return s
      const rate = productionPerSecond(s, now)
      const gained = Math.max(rate * tapBonusSeconds(s.emberUpgrades), 1)
      return grantTapAsh(s, gained, now)
    })
  }, [])

  const buy = useCallback((id: GeneratorId) => {
    setState((s) => buyGenerator(s, id))
  }, [])

  const buyModuleBranch = useCallback((id: GeneratorId, kind: BranchKind) => {
    setState((s) => buyBranch(s, id, kind))
  }, [])

  const buyMeta = useCallback((id: EmberUpgradeId) => {
    setState((s) => buyEmberUpgrade(s, id))
  }, [])

  const prestige = useCallback(() => {
    setState((s) => doPrestige(s))
  }, [])

  const purchaseTimeSkip = useCallback((id: TimeSkipId) => {
    setState((s) => buyTimeSkip(s, id))
  }, [])

  const purchaseCosmetic = useCallback((id: CosmeticId) => {
    setState((s) => buyCosmetic(s, id))
  }, [])

  const setEquippedCosmetic = useCallback((id: CosmeticId) => {
    setState((s) => equipCosmetic(s, id))
  }, [])

  const purchaseClanBoost = useCallback(() => {
    setState((s) => buyClanBoost(s))
  }, [])

  const purchasePack = useCallback((pack: ShopOfferDef) => {
    setState((s) => mockBuyOffer(s, pack))
  }, [])

  const purchaseOffer = useCallback((offer: ShopOfferDef) => {
    setState((s) => mockBuyOffer(s, offer))
  }, [])

  const purchaseYieldBoost = useCallback(() => {
    setState((s) => buyYieldBoost(s))
  }, [])

  const watchRewardedAd = useCallback(() => {
    setState((s) => {
      const result = claimRewardedAd(s)
      return result.ok ? result.state : s
    })
  }, [])

  const claimBpDailyXp = useCallback(() => {
    setState((s) => claimBattlePassDailyXp(s))
  }, [])

  const claimBpTier = useCallback((tier: number, track: 'free' | 'premium') => {
    setState((s) => claimBattlePassTier(s, tier, track))
  }, [])

  const claimDaily = useCallback(() => {
    setState((s) => claimDailyOps(s))
  }, [])

  const dismissEvent = useCallback(() => {
    setState((s) => dismissBandwidthSurge(s))
  }, [])

  const claimEventGoal = useCallback(() => {
    setState((s) => claimBandwidthSurgeGoal(s))
  }, [])

  const claimQuest = useCallback((questId: string) => {
    setState((s) => claimQuestReward(s, questId))
  }, [])

  const dismissOffline = useCallback(() => {
    const amount = offlineGained ?? 0
    setOfflineGained(null)
    setState((s) => claimOfflineReward(s, amount))
  }, [offlineGained])

  const mult = prestigeMultiplier(state.emberUpgrades)
  const levelMult = levelProductionMult(playerLevelOf(state))
  const clanMult = effectiveClanMult(state, nowTick)
  const eventMult = eventProductionMult(nowTick)
  const progress = prestigeProgress(state)
  const discount = foundryDiscountMult(state.emberUpgrades)
  const equipped = cosmeticById(state.equippedCosmetic)
  const skipLeft = skipHoursRemaining(state, nowTick)
  const clanBoostActive =
    state.clanBoostExpiresAt > nowTick && clanMult > 1
  const clanBoostMsLeft = clanBoostActive
    ? Math.max(0, state.clanBoostExpiresAt - nowTick)
    : 0

  const yieldBoostMult = effectiveYieldBoostMult(state, nowTick)
  const yieldBoostActive = yieldBoostMult > 1
  const yieldBoostMsLeft = yieldBoostActive
    ? Math.max(0, state.yieldBoostExpiresAt - nowTick)
    : 0
  const adReady = !state.adsRemoved && rewardedAdReady(state.lastRewardedAdAt, nowTick)
  const adCooldownMs = state.adsRemoved
    ? 0
    : rewardedAdCooldownMsLeft(state.lastRewardedAdAt, nowTick)
  const bpDailyXpReady = state.bpDailyXpDay !== dayKey(nowTick)

  const dailyReady = canClaimDaily(state.dailyClaimDay, nowTick)
  const dailyPreview = previewDailyReward(
    state.dailyStreak,
    state.dailyClaimDay,
    productionPerSecond(state, nowTick),
    nowTick,
  )

  const surge = bandwidthSurgeStatus(nowTick)
  const surgeWindow = bandwidthSurgeWindowKey(nowTick)
  const surgeVisible =
    isBandwidthSurgeActive(nowTick) && state.eventDismissedKey !== surgeWindow
  const surgeGoalDone = state.eventAshProgress >= surge.goal
  const surgeGoalClaimed = state.eventGoalClaimedKey === surgeWindow

  const playerLevel = levelProgress(state.playerXp)

  const achievementRows = ACHIEVEMENTS.map((def) => {
    const claimed = state.claimedAchievements.includes(def.id)
    const complete = isAchievementComplete(def.id, {
      totalUpgrades: state.totalUpgrades,
      lifetimeAshEarned: state.lifetimeAshEarned,
      claimedDailyOnce: state.claimedDailyOnce,
      claimedOfflineOnce: state.claimedOfflineOnce,
      playerLevel: playerLevel.level,
      prestiges: state.prestiges,
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
        state.ashEarned,
        state.owned,
        state.emberUpgrades.firstFlame > 0,
        playerLevel.level,
      )
    },
    [
      state.ashEarned,
      state.owned,
      state.emberUpgrades.firstFlame,
      playerLevel.level,
    ],
  )

  return {
    state,
    rate: productionPerSecond(state, nowTick),
    multiplier: mult,
    levelMult,
    clanMult,
    eventMult,
    clanBoostActive,
    clanBoostMsLeft,
    yieldBoostActive,
    yieldBoostMsLeft,
    yieldBoostMult,
    adReady,
    adCooldownMs,
    bpDailyXpReady,
    skipHoursRemaining: skipLeft,
    equippedCosmetic: equipped,
    nextPrestige: nextPrestigeEmbers(state.ashEarned),
    prestigeMin: prestigeMinAsh(state.prestiges),
    prestigeProgress: progress,
    canPrestige: canPrestigeNow(state),
    tapReady,
    tapCooldownMs: TAP_COOLDOWN_MS,
    rake,
    buy,
    buyModuleBranch,
    buyMeta,
    prestige,
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchasePack,
    purchaseOffer,
    purchaseYieldBoost,
    watchRewardedAd,
    claimBpDailyXp,
    claimBpTier,
    claimDaily,
    dismissEvent,
    claimEventGoal,
    claimQuest,
    dailyReady,
    dailyPreview,
    surge,
    surgeVisible,
    surgeGoalDone,
    surgeGoalClaimed,
    costOf,
    branchCostOf,
    branchMaxRank: BRANCH_MAX_RANK,
    unlocked,
    offlineGained,
    offlineAwayMs,
    dismissOffline,
    playerLevel,
    achievementRows,
    questRows,
    metaDiscount: discount,
  }
}
