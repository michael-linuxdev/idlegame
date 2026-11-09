/** Markt, Werbung, Gartenwoche, Gartenrunde, Ereignisse, Offline-Korb. Teil von useGame(), siehe src/game/useGame.ts. */
import { MIN_OFFLINE_CLAIM_AWAY_MS } from '../economy'
import { FEST_EARN } from '../fests'
import {
  REWARDED_AD_DELAY_MS,
  type AdChoice,
  type CosmeticId,
  type ShopOfferDef,
  type TimeSkipId,
} from '../monetization'
import { logPlaytest } from '../playtestLog'
import {
  buyClanBoost,
  buyCosmetic,
  buyTimeSkip,
  buyYieldBoost,
  claimErntefestGoal,
  claimBattlePassDailyXp,
  claimBattlePassTier,
  claimDailyOps,
  claimFlashEventGoal,
  claimQuestReward,
  claimRewardedAd,
  claimMarketGift,
  refillWateringCan,
  clearLastSurprise,
  dismissErntefest,
  dismissFlashEvent,
  equipCosmetic,
  claimOfflineReward,
  creditOfflinePending,
  maybeStartFlashEvent,
  mockBuyOffer,
  earnFest,
} from '../state'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { GameCore } from './useGameLoop'

type UseShopActionsDeps = Pick<GameCore, 'setState' | 'offlineGained' | 'setOfflineGained' | 'offlineAwayMs' | 'setOfflineAwayMs'>

export function useShopActions({ setState, offlineGained, setOfflineGained, offlineAwayMs, setOfflineAwayMs }: UseShopActionsDeps) {
  const purchaseTimeSkip = useCallback((id: TimeSkipId) => {
    setState((s) => {
      const next = buyTimeSkip(s, id)
      if (next !== s) logPlaytest('shop_tap', { action: 'time_skip', id })
      return next
    })
  }, [setState])

  const purchaseCosmetic = useCallback((id: CosmeticId) => {
    setState((s) => {
      const next = buyCosmetic(s, id)
      if (next !== s) logPlaytest('shop_tap', { action: 'cosmetic', id })
      return next
    })
  }, [setState])

  const setEquippedCosmetic = useCallback((id: CosmeticId) => {
    setState((s) => {
      const next = equipCosmetic(s, id)
      if (next !== s) logPlaytest('shop_tap', { action: 'equip', id })
      return next
    })
  }, [setState])

  const purchaseClanBoost = useCallback(() => {
    setState((s) => {
      const next = buyClanBoost(s)
      if (next !== s) logPlaytest('shop_tap', { action: 'clan_boost' })
      return next
    })
  }, [setState])

  const purchasePack = useCallback((pack: ShopOfferDef) => {
    setState((s) => {
      const next = mockBuyOffer(s, pack)
      if (next !== s) logPlaytest('shop_tap', { action: 'pack', id: pack.id })
      return next
    })
  }, [setState])

  const purchaseOffer = useCallback((offer: ShopOfferDef) => {
    setState((s) => {
      const next = mockBuyOffer(s, offer)
      if (next !== s) {
        logPlaytest('shop_tap', { action: 'offer', id: offer.id })
      }
      return next
    })
  }, [setState])

  const purchaseYieldBoost = useCallback(() => {
    setState((s) => {
      const next = buyYieldBoost(s)
      if (next !== s) logPlaytest('shop_tap', { action: 'yield_boost' })
      return next
    })
  }, [setState])

  // Optional ad: runs here (not in the Markt panel) so closing the panel
  // mid-ad can't swallow the reward; the result is shown afterwards.
  const [adWatching, setAdWatching] = useState(false)
  const [adResult, setAdResult] = useState<{ choice: AdChoice; ernte: number; samen: number; at: number } | null>(null)
  const adTimer = useRef<number | null>(null)
  useEffect(() => () => {
    if (adTimer.current != null) window.clearTimeout(adTimer.current)
  }, [setState])
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
        setAdResult({ choice, ernte: result.ernteGained, samen: result.samenGained, at: Date.now() })
        return result.state
      })
    }, REWARDED_AD_DELAY_MS)
  }, [setState])

  const claimGift = useCallback(() => {
    setState((s) => claimMarketGift(s))
  }, [setState])

  const buyWaterRefill = useCallback(() => {
    setState((s) => {
      const next = refillWateringCan(s)
      if (next !== s) logPlaytest('water_refill', { source: 'samen', samen: next.samen })
      return next
    })
  }, [setState])

  const claimBpDailyXp = useCallback(() => {
    setState((s) => claimBattlePassDailyXp(s))
  }, [setState])

  const claimBpTier = useCallback((tier: number, track: 'free' | 'premium') => {
    setState((s) => claimBattlePassTier(s, tier, track))
  }, [setState])

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
  }, [setState])

  const dismissEvent = useCallback(() => {
    setState((s) => dismissErntefest(s))
  }, [setState])

  const claimEventGoal = useCallback(() => {
    setState((s) => claimErntefestGoal(s))
  }, [setState])

  const dismissFlash = useCallback(() => {
    setState((s) => {
      const next = dismissFlashEvent(s)
      if (next !== s) logPlaytest('flash_event', { action: 'dismiss' })
      return next
    })
  }, [setState])

  const claimFlashGoal = useCallback(() => {
    setState((s) => {
      const next = claimFlashEventGoal(s)
      if (next !== s) logPlaytest('flash_event', { action: 'claim' })
      return next
    })
  }, [setState])

  const ackSurprise = useCallback(() => {
    setState((s) => clearLastSurprise(s))
  }, [setState])

  const claimQuest = useCallback((questId: string) => {
    setState((s) => claimQuestReward(s, questId))
  }, [setState])

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
  }, [offlineGained, offlineAwayMs, setState, setOfflineAwayMs, setOfflineGained])

  // Short flash event — try spawn when returning to the tab
  useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        setState((s) => maybeStartFlashEvent(s))
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [setState])

  return {
    purchaseTimeSkip,
    purchaseCosmetic,
    setEquippedCosmetic,
    purchaseClanBoost,
    purchasePack,
    purchaseOffer,
    purchaseYieldBoost,
    adWatching,
    adResult,
    watchRewardedAd,
    claimGift,
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
    dismissOffline,
  }
}
