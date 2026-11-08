import { gateSeasons, type DeepMetaId } from './longLoop'
import type { WheelKind } from './gardenLife'
import { useCallback, useEffect, useRef, useState } from 'react'
import { isIdle, onIdleChange, startIdleWatch } from './idle'
import type { DecorId } from './decor'
import type { ResidentId } from './residents'
import type { ProjectId } from './projects'
import {
  emberPayout,
  foundryDiscountMult,
  MIN_OFFLINE_CLAIM_AWAY_MS,
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
  REWARDED_AD_DELAY_MS,
  cosmeticById,
  dayKey,
  rewardedAdCooldownMsLeft,
  rewardedAdReady,
  type AdChoice,
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
import { flashEventStatus } from './flashEvent'
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
  claimFlashEventGoal,
  claimQuestReward,
  claimRewardedAd,
  claimMarketGift,
  marketGiftReady,
  refillWateringCan,
  clearLastSurprise,
  collectReadyAchievements,
  dismissBandwidthSurge,
  dismissFlashEvent,
  doPrestige,
  effectiveClanMult,
  effectiveYieldBoostMult,
  equipCosmetic,
  eventProductionMult,
  flashProductionMult,
  claimOfflineReward,
  creditOfflinePending,
  grantTapAsh,
  levelProductionMult,
  levelProgress,
  lineCostMult,
  maybeStartFlashEvent,
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
  buyDeepUpgrade,
  doDeepReset,
  waterMult,
  grantReward,
  applyWheel,
  clearLastVariety,
  type Reward,
  affordableLevels,
  buyAllBest,
  buyFestItem,
  buyGeneratorMany,
  buyHelper,
  buyLegacy,
  buyChapterArea,
  buyChapterMany,
  buyChapterCare,
  canHandDownNow,
  costForLevels,
  deepSproutPayout,
  doGeneration,
  earnFest,
  generationPayout,
  helperUnlocked,
  bulkUnlocks,
  chapterCostOf,
  openChapters,
  chapterPerSecond,
  chapterRateMult,
  syncChaptersOpen,
  buyIlse,
  toggleIlse,
  ilseUnlocked,
  finishWeinlese,
  weinleseReady,
  clearLastChest,
  claimRecipe,
  recipeReady,
  shieldReady,
  catchRainbow,
  makeWish,
  claimContest,
  growPumpkin,
  type Wish,
  toggleHelper,
  toggleHelperArea,
  buyDecor,
  placeDecor,
  spawnResident,
  startCrossing,
  buildProjectStage,
  skipCrossing,
  harvestCrossing,
  residentGone,
  greetResident,
  turboMult,
  expansionGardenMult,
} from './state'
import type { CareKind, ChapterId } from './chapters'
import { CONTEST_KG } from './extrasCore'
import type { LegacyId } from './generations'
import { FEST_EARN } from './fests'
import { logPlaytest } from './playtestLog'
import { loadState, saveState } from './storage'

/** Economy + React UI cadence. 100ms was overheating iPhone Safari PWAs. */
const TICK_MS = 250
/** Ruhemodus (no touch for a while, see idle.ts): one tick per second */
const IDLE_TICK_MS = 1000
/** Persist less often than the tick — localStorage stringify is expensive. */
const SAVE_MS = 4000

export function useGame() {
  // One catch-up on start: the basket (offlinePending) waits for the „Ernten“
  // tap; short absences go straight into the wallet.
  const [boot] = useState(() => {
    const loaded = loadState()
    const awayMs = Math.max(0, Date.now() - loaded.lastSeen)
    let next = applyOfflineCatchup(loaded).state
    const banner = awayMs >= MIN_OFFLINE_CLAIM_AWAY_MS && next.offlinePending > 0.01
    if (!banner) next = creditOfflinePending(next)
    return { state: maybeStartFlashEvent(next), awayMs: banner ? awayMs : 0, pending: banner ? next.offlinePending : null }
  })
  const [state, setState] = useState<GameState>(boot.state)
  const [offlineGained, setOfflineGained] = useState<number | null>(boot.pending)
  const [offlineAwayMs, setOfflineAwayMs] = useState<number>(boot.awayMs)

  const stateRef = useRef(state)
  const dirtySaveRef = useRef(false)
  useEffect(() => {
    stateRef.current = state
    dirtySaveRef.current = true
  }, [state])

  const [nowTick, setNowTick] = useState(() => Date.now())

  useEffect(() => {
    const flush = () => {
      dirtySaveRef.current = false
      const next = { ...stateRef.current, lastSeen: Date.now() }
      stateRef.current = next
      saveState(next)
    }

    const saveTimer = window.setInterval(() => {
      if (!dirtySaveRef.current) return
      if (document.visibilityState === 'hidden') return
      dirtySaveRef.current = false
      saveState(stateRef.current)
    }, SAVE_MS)

    let tickTimer: number | null = null
    let lastTickAt = Date.now()

    const stopTick = () => {
      if (tickTimer != null) {
        window.clearInterval(tickTimer)
        tickTimer = null
      }
    }

    const startTick = () => {
      if (tickTimer != null) return
      lastTickAt = Date.now()
      const every = isIdle() ? IDLE_TICK_MS : TICK_MS
      tickTimer = window.setInterval(() => {
        const now = Date.now()
        const dt = Math.min(Math.max((now - lastTickAt) / 1000, every / 1000), 2)
        lastTickAt = now
        setNowTick(now)
        setState((s) => applyTick(s, dt))
      }, every)
    }
    // Ruhemodus: restart the tick at the new pace
    startIdleWatch()
    const offIdle = onIdleChange(() => {
      if (tickTimer == null) return
      stopTick()
      startTick()
    })

    const onVis = () => {
      if (document.visibilityState === 'hidden') {
        document.documentElement.classList.add('tab-hidden')
        stopTick()
        flush()
        return
      }
      document.documentElement.classList.remove('tab-hidden')
      setState((s) => {
        const awayMs = Math.max(0, Date.now() - s.lastSeen)
        let next = applyOfflineCatchup(s).state
        if (next.offlinePending > 0.01 && awayMs >= MIN_OFFLINE_CLAIM_AWAY_MS) {
          setOfflineGained(next.offlinePending)
          setOfflineAwayMs(awayMs)
        } else if (next.offlinePending > 0) {
          // short switch: a waiting banner grows, otherwise straight into the wallet
          if (s.offlinePending > 0) setOfflineGained(next.offlinePending)
          else next = creditOfflinePending(next)
        }
        return collectReadyAchievements(next)
      })
      lastTickAt = Date.now()
      startTick()
    }

    if (document.visibilityState === 'hidden') {
      document.documentElement.classList.add('tab-hidden')
    } else {
      document.documentElement.classList.remove('tab-hidden')
      startTick()
    }

    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVis)
    return () => {
      offIdle()
      stopTick()
      window.clearInterval(saveTimer)
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVis)
      document.documentElement.classList.remove('tab-hidden')
      if (dirtySaveRef.current) flush()
    }
  }, [])

  const tapReady =
    state.lastTapAt <= 0 || nowTick - state.lastTapAt >= TAP_COOLDOWN_MS

  const rake = useCallback(() => {
    setState((s) => {
      const now = Date.now()
      if (s.lastTapAt > 0 && now - s.lastTapAt < TAP_COOLDOWN_MS) return s
      const rate = productionPerSecond(s, now)
      const fromRate = rate * tapBonusSeconds(s.emberUpgrades) * waterMult(s, now)
      // Cold post-prestige: one Schub must cover the next G1 Ausbauen if the
      // wallet is still short (rate alone can be ~1/s → 60 Phyto).
      const g1 = GENERATORS.find((g) => g.id === 'gemuesebeet')
      const g1Owned = s.owned.gemuesebeet ?? 0
      const g1Cost = g1
        ? generatorCost(g1, g1Owned, lineCostMult(s, 'gemuesebeet'))
        : 23
      const shortfall = Math.max(0, g1Cost - s.ernte)
      const gained = Math.max(fromRate, shortfall, 1)
      return growPumpkin(earnFest(grantTapAsh(s, gained, now), FEST_EARN.water, now), CONTEST_KG.water, now)
    })
  }, [])

  const buy = useCallback((id: GeneratorId) => {
    setState((s) => {
      const next = buyGenerator(s, id)
      if (next !== s) {
        logPlaytest('upgrade', {
          id,
          level: next.owned[id] ?? 0,
          kind: 'module',
        })
      }
      return next
    })
  }, [])

  const buyModuleBranch = useCallback((id: GeneratorId, kind: BranchKind) => {
    setState((s) => {
      const next = buyBranch(s, id, kind)
      if (next !== s) {
        logPlaytest('upgrade', { id, branch: kind, kind: 'branch' })
      }
      return next
    })
  }, [])

  const buyMeta = useCallback((id: EmberUpgradeId) => {
    setState((s) => {
      const next = buyEmberUpgrade(s, id)
      if (next !== s) {
        logPlaytest('upgrade', { id, kind: 'ember' })
      }
      return next
    })
  }, [])

  const [postPrestigeFocus, setPostPrestigeFocus] = useState(false)
  const [seasonEnd, setSeasonEnd] = useState<{
    year: number
    gained: number
    deep?: boolean
    generation?: number
  } | null>(null)

  const prestige = useCallback(() => {
    setState((s) => {
      const gain = emberPayout(s.ernteSeason, s.prestiges)
      const next = doPrestige(s)
      if (next !== s) {
        logPlaytest('prestige', {
          run: next.prestiges,
          erbstuecke: gain,
          wallet: next.erbstuecke,
        })
        setPostPrestigeFocus(true)
        setSeasonEnd({ year: next.prestiges + 1, gained: gain })
      }
      return next
    })
  }, [])

  const ackSeasonEnd = useCallback(() => setSeasonEnd(null), [])

  const grant = useCallback((reward: Reward) => {
    setState((s) => grantReward(s, reward))
  }, [])

  const spinWheel = useCallback((kind: WheelKind) => {
    setState((s) => applyWheel(s, kind))
  }, [])

  const refillWater = useCallback(() => {
    setState((s) => ({ ...s, lastTapAt: 0 }))
  }, [])

  const ackVariety = useCallback(() => {
    setState((s) => clearLastVariety(s))
  }, [])

  const deepReset = useCallback(() => {
    setState((s) => {
      const gain = deepSproutPayout(s)
      const next = doDeepReset(s)
      if (next !== s) {
        logPlaytest('deep_reset', { deep: next.deepPrestiges, sprouts: gain })
        setPostPrestigeFocus(true)
        setSeasonEnd({ year: 1, gained: gain, deep: true })
      }
      return next
    })
  }, [])

  const handDown = useCallback(() => {
    setState((s) => {
      const gain = generationPayout(s)
      const next = doGeneration(s)
      if (next !== s) {
        logPlaytest('generation', { generation: next.generation, vermaechtnis: gain })
        setPostPrestigeFocus(true)
        setSeasonEnd({ year: 1, gained: gain, deep: true, generation: next.generation + 1 })
      }
      return next
    })
  }, [])

  const buyLegacyRank = useCallback((id: LegacyId) => {
    setState((s) => {
      const next = buyLegacy(s, id)
      if (next !== s) logPlaytest('upgrade', { id, kind: 'legacy' })
      return next
    })
  }, [])

  /** Buy `n` levels (Infinity = as many as affordable). Returns levels bought. */
  const buyMany = useCallback((id: GeneratorId, n: number) => {
    const s = stateRef.current
    const count = Number.isFinite(n) ? n : affordableLevels(s, id).count
    if (count <= 0) return 0
    const result = buyGeneratorMany(s, id, count)
    if (result.bought > 0) {
      stateRef.current = result.state
      setState(result.state)
      logPlaytest('upgrade', { id, level: result.state.owned[id] ?? 0, kind: 'module', n: result.bought })
    }
    return result.bought
  }, [])

  const buyAll = useCallback(() => {
    const result = buyAllBest(stateRef.current)
    if (result.bought > 0) {
      stateRef.current = result.state
      setState(result.state)
      logPlaytest('buy_all', { n: result.bought })
    }
    return result.bought
  }, [])

  const hireHelper = useCallback(() => {
    setState((s) => {
      const next = buyHelper(s)
      if (next !== s) logPlaytest('upgrade', { id: 'helper', level: next.helperLevel, kind: 'helper' })
      return next
    })
  }, [])

  const buildProject = useCallback((id: ProjectId) => {
    setState((s) => buildProjectStage(s, id))
  }, [])

  const crossStart = useCallback((a: string, b: string) => {
    setState((s) => startCrossing(s, a, b))
  }, [])

  const crossSkip = useCallback(() => {
    setState((s) => skipCrossing(s))
  }, [])

  /** Harvest the crossing; returns the result for the reveal. */
  const crossHarvest = useCallback((): { hybrid: string | null; samen: number } | null => {
    const r = harvestCrossing(stateRef.current)
    if (r.state === stateRef.current) return null
    setState((s) => harvestCrossing(s).state)
    return { hybrid: r.hybrid, samen: r.samen }
  }, [])

  const letResidentIn = useCallback((id: ResidentId) => {
    setState((s) => spawnResident(s, id))
  }, [])

  const residentLeft = useCallback(() => {
    setState((s) => residentGone(s))
  }, [])

  /** Tap a Gartenbewohner; returns what happened for the toast. */
  const greetVisitorAnimal = useCallback((): { first: boolean; ernte: number } | null => {
    const r = greetResident(stateRef.current)
    if (r.state === stateRef.current) return null
    setState((s) => greetResident(s).state)
    return { first: r.first, ernte: r.ernte }
  }, [])

  const purchaseDecor = useCallback((id: DecorId) => {
    setState((s) => buyDecor(s, id))
  }, [])

  const setDecor = useCallback((slot: number, id: DecorId | null) => {
    setState((s) => placeDecor(s, slot, id))
  }, [])

  const switchHelperArea = useCallback((id: GeneratorId) => {
    setState((s) => toggleHelperArea(s, id))
  }, [])

  const switchHelper = useCallback(() => {
    setState((s) => toggleHelper(s))
  }, [])

  const ackHelperReport = useCallback(() => {
    setState((s) => (s.helperReport ? { ...s, helperReport: 0 } : s))
  }, [])

  const buyChapter = useCallback((id: ChapterId, area: string) => {
    setState((s) => {
      const next = buyChapterArea(s, id, area)
      if (next !== s) logPlaytest('upgrade', { id: area, level: next.chapters[id].owned[area] ?? 0, kind: id })
      return next
    })
  }, [])

  const buyChapterBulk = useCallback((id: ChapterId, area: string, n: number) => {
    const result = buyChapterMany(stateRef.current, id, area, Number.isFinite(n) ? n : 1000)
    if (result.bought > 0) {
      stateRef.current = result.state
      setState(result.state)
      logPlaytest('upgrade', { id: area, level: result.state.chapters[id].owned[area] ?? 0, kind: id, n: result.bought })
    }
    return result.bought
  }, [])

  const buyChapterCareRank = useCallback((id: ChapterId, area: string, kind: CareKind) => {
    setState((s) => {
      const next = buyChapterCare(s, id, area, kind)
      if (next !== s) logPlaytest('upgrade', { id: area, kind: `${id}-care-${kind}` })
      return next
    })
  }, [])

  const seeChapterIntro = useCallback((id: ChapterId) => {
    setState((s) => ({ ...s, chapters: { ...s.chapters, [id]: { ...s.chapters[id], introSeen: true } } }))
  }, [])

  /** Test hook (?kapitel2=1 / ?kapitel3=1): open a chapter right away. */
  const forceChapter = useCallback((id: ChapterId) => {
    setState((s) => syncChaptersOpen(s, Date.now(), id))
  }, [])

  const hireIlse = useCallback(() => {
    setState((s) => {
      const next = buyIlse(s)
      if (next !== s) logPlaytest('upgrade', { id: 'ilse', level: next.ilseLevel, kind: 'helper' })
      return next
    })
  }, [])

  const switchIlse = useCallback(() => setState((s) => toggleIlse(s)), [])

  const weinlese = useCallback((hits: number) => {
    setState((s) => {
      const next = finishWeinlese(s, hits)
      if (next !== s) logPlaytest('weinlese', { hits })
      return next
    })
  }, [])

  const ackChest = useCallback(() => setState((s) => clearLastChest(s)), [])
  const cookRecipe = useCallback(() => {
    setState((s) => {
      const next = claimRecipe(s)
      if (next !== s) logPlaytest('recipe', { day: s.recipe.day })
      return next
    })
  }, [])
  const tapRainbow = useCallback(() => setState((s) => catchRainbow(s)), [])
  const wish = useCallback((w: Wish) => setState((s) => makeWish(s, w)), [])
  const claimPumpkin = useCallback(() => setState((s) => claimContest(s)), [])

  const buyFest = useCallback((itemId: string) => {
    setState((s) => {
      const next = buyFestItem(s, itemId)
      if (next !== s) logPlaytest('fest_buy', { id: itemId, key: next.festKey })
      return next
    })
  }, [])

  const buyDeep = useCallback((id: DeepMetaId) => {
    setState((s) => buyDeepUpgrade(s, id))
  }, [])

  const clearPostPrestigeFocus = useCallback(() => {
    setPostPrestigeFocus(false)
  }, [])

  const purchaseTimeSkip = useCallback((id: TimeSkipId) => {
    setState((s) => {
      const next = buyTimeSkip(s, id)
      if (next !== s) logPlaytest('shop_tap', { action: 'time_skip', id })
      return next
    })
  }, [])

  const purchaseCosmetic = useCallback((id: CosmeticId) => {
    setState((s) => {
      const next = buyCosmetic(s, id)
      if (next !== s) logPlaytest('shop_tap', { action: 'cosmetic', id })
      return next
    })
  }, [])

  const setEquippedCosmetic = useCallback((id: CosmeticId) => {
    setState((s) => {
      const next = equipCosmetic(s, id)
      if (next !== s) logPlaytest('shop_tap', { action: 'equip', id })
      return next
    })
  }, [])

  const purchaseClanBoost = useCallback(() => {
    setState((s) => {
      const next = buyClanBoost(s)
      if (next !== s) logPlaytest('shop_tap', { action: 'clan_boost' })
      return next
    })
  }, [])

  const purchasePack = useCallback((pack: ShopOfferDef) => {
    setState((s) => {
      const next = mockBuyOffer(s, pack)
      if (next !== s) logPlaytest('shop_tap', { action: 'pack', id: pack.id })
      return next
    })
  }, [])

  const purchaseOffer = useCallback((offer: ShopOfferDef) => {
    setState((s) => {
      const next = mockBuyOffer(s, offer)
      if (next !== s) {
        logPlaytest('shop_tap', { action: 'offer', id: offer.id })
      }
      return next
    })
  }, [])

  const purchaseYieldBoost = useCallback(() => {
    setState((s) => {
      const next = buyYieldBoost(s)
      if (next !== s) logPlaytest('shop_tap', { action: 'yield_boost' })
      return next
    })
  }, [])

  // Optional ad: runs here (not in the Markt panel) so closing the panel
  // mid-ad can't swallow the reward; the result is shown afterwards.
  const [adWatching, setAdWatching] = useState(false)
  const [adResult, setAdResult] = useState<{ choice: AdChoice; ernte: number; samen: number; at: number } | null>(null)
  const adTimer = useRef<number | null>(null)
  useEffect(() => () => {
    if (adTimer.current != null) window.clearTimeout(adTimer.current)
  }, [])
  const watchRewardedAd = useCallback((choice: AdChoice) => {
    if (adTimer.current != null) return
    setAdWatching(true)
    setAdResult(null)
    adTimer.current = window.setTimeout(() => {
      adTimer.current = null
      setAdWatching(false)
      setState((s) => {
        const result = claimRewardedAd(s, choice)
        if (!result.ok) return s
        logPlaytest('shop_tap', { action: 'rewarded_ad', choice })
        setAdResult({ choice, ernte: result.ashGained, samen: result.obsidianGained, at: Date.now() })
        return result.state
      })
    }, REWARDED_AD_DELAY_MS)
  }, [])

  const claimGift = useCallback(() => {
    setState((s) => claimMarketGift(s))
  }, [])

  const buyWaterRefill = useCallback(() => {
    setState((s) => refillWateringCan(s))
  }, [])

  const claimBpDailyXp = useCallback(() => {
    setState((s) => claimBattlePassDailyXp(s))
  }, [])

  const claimBpTier = useCallback((tier: number, track: 'free' | 'premium') => {
    setState((s) => claimBattlePassTier(s, tier, track))
  }, [])

  const claimDaily = useCallback(() => {
    setState((s) => {
      const claimed = claimDailyOps(s)
      const next = claimed === s ? s : earnFest(claimed, FEST_EARN.daily)
      if (next !== s) {
        logPlaytest('daily_claim', {
          streak: next.dailyStreak,
          comeback: next.dailyStreak === s.dailyStreak,
        })
      }
      return next
    })
  }, [])

  const dismissEvent = useCallback(() => {
    setState((s) => dismissBandwidthSurge(s))
  }, [])

  const claimEventGoal = useCallback(() => {
    setState((s) => claimBandwidthSurgeGoal(s))
  }, [])

  const dismissFlash = useCallback(() => {
    setState((s) => {
      const next = dismissFlashEvent(s)
      if (next !== s) logPlaytest('flash_event', { action: 'dismiss' })
      return next
    })
  }, [])

  const claimFlashGoal = useCallback(() => {
    setState((s) => {
      const next = claimFlashEventGoal(s)
      if (next !== s) logPlaytest('flash_event', { action: 'claim' })
      return next
    })
  }, [])

  const ackSurprise = useCallback(() => {
    setState((s) => clearLastSurprise(s))
  }, [])

  const claimQuest = useCallback((questId: string) => {
    setState((s) => claimQuestReward(s, questId))
  }, [])

  const dismissOffline = useCallback(() => {
    const amount = offlineGained ?? 0
    const awayMs = offlineAwayMs
    setOfflineGained(null)
    setOfflineAwayMs(0)
    // Skip logging false claims (awayMs≈0 / sub-threshold) so they don't dilute the offline hook.
    if (amount > 0.01 && awayMs >= MIN_OFFLINE_CLAIM_AWAY_MS) {
      logPlaytest('offline_claim', {
        amount: Math.round(amount * 100) / 100,
        awayMs,
      })
    }
    // Always empty the basket into the wallet; XP only for real absences
    setState((s) => (amount > 0.01 && awayMs >= MIN_OFFLINE_CLAIM_AWAY_MS ? claimOfflineReward(s, amount) : creditOfflinePending(s)))
  }, [offlineGained, offlineAwayMs])

  // Short flash event — try spawn when returning to the tab
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        setState((s) => maybeStartFlashEvent(s))
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const mult = prestigeMultiplier(state.emberUpgrades)
  const levelMult = levelProductionMult(playerLevelOf(state))
  const clanMult = effectiveClanMult(state, nowTick)
  const eventMult =
    eventProductionMult(nowTick) * flashProductionMult(state, nowTick)
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
        state.ernteSeason,
        state.owned,
        state.emberUpgrades.firstFlame > 0,
        playerLevel.level,
        gateSeasons(state.prestiges, state.deepUpgrades),
      )
    },
    [
      state.ernteSeason,
      state.owned,
      state.emberUpgrades.firstFlame,
      playerLevel.level,
      state.prestiges,
      state.deepUpgrades,
    ],
  )

  return {
    state,
    stateRef,
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
    crossSkip,
    crossHarvest,
    residentLeft,
    greetVisitorAnimal,
    setDecor,
    ackHelperReport,
    buyChapter,
    buyChapterBulk,
    seeChapterIntro,
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
    nextPrestige: nextPrestigeEmbers(state.ernteSeason, state.prestiges),
    prestigeMin: prestigeMinAsh(state.prestiges),
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
    adWatching,
    adResult,
    claimGift,
    giftReady: marketGiftReady(state, nowTick),
    buyWaterRefill,
    claimBpDailyXp,
    claimBpTier,
    claimDaily,
    dismissEvent,
    claimEventGoal,
    dismissFlash,
    claimFlashGoal,
    ackSurprise,
    claimQuest,
    dailyReady,
    dailyPreview,
    surge,
    surgeVisible,
    surgeGoalDone,
    surgeGoalClaimed,
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
