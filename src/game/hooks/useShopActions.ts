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
import { TEST_WALLET_ENABLED, pickTestAdSeconds } from '../testWallet'
import {
  buyClanBoost,
  buyCosmetic,
  buyTimeSkip,
  buyYieldBoost,
  claimErntefestGoal,
  claimGartenwocheDailyXp,
  claimGartenwocheTier,
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
import type { ChapterId } from '../chapters'

/** Garten, der die Ernte einer Werbung bekommt. */
export type AdPlot = 'garden' | ChapterId

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
  // Testphase: the ad runs 30 or 60 s like a real one and locks the game
  // (components/AdOverlay.tsx); it only counts down while the app is visible.
  const [adPlaying, setAdPlaying] = useState<{ choice: AdChoice; totalS: number; leftMs: number; blocking: boolean } | null>(null)
  const [adResult, setAdResult] = useState<{ choice: AdChoice; ernte: number; samen: number; chapter?: ChapterId; at: number } | null>(null)
  const adRef = useRef<{ choice: AdChoice; plot: AdPlot; totalS: number; leftMs: number; blocking: boolean; last: number } | null>(null)
  const adTimer = useRef<number | null>(null)
  const stopAdTimer = () => {
    if (adTimer.current != null) window.clearInterval(adTimer.current)
    adTimer.current = null
  }
  useEffect(() => stopAdTimer, [])

  const finishAd = useCallback(() => {
    const ad = adRef.current
    stopAdTimer()
    adRef.current = null
    setAdPlaying(null)
    if (!ad) return
    if (ad.blocking) logPlaytest('test_ad', { result: 'done', seconds: ad.totalS, choice: ad.choice })
    setState((s) => {
      const result = claimRewardedAd(s, ad.choice, Date.now(), ad.plot)
      if (!result.ok) return s
      logPlaytest('shop_tap', { action: 'rewarded_ad', choice: ad.choice, plot: ad.plot })
      setAdResult({ choice: ad.choice, ernte: result.ernteGained, samen: result.samenGained, chapter: result.chapter, at: Date.now() })
      return result.state
    })
  }, [setState])

  /** `plot`: der gerade gewählte Garten — nur er bekommt die Ernte. */
  const watchRewardedAd = useCallback((choice: AdChoice, adFree = false, plot: AdPlot = 'garden') => {
    if (adRef.current) return
    // Werbefrei gekauft: Belohnung sofort, ohne Werbung
    if (adFree) {
      setAdResult(null)
      setState((s) => {
        const result = claimRewardedAd(s, choice, Date.now(), plot)
        if (!result.ok) return s
        logPlaytest('shop_tap', { action: 'rewarded_ad', choice, adFree: true, plot })
        setAdResult({ choice, ernte: result.ernteGained, samen: result.samenGained, chapter: result.chapter, at: Date.now() })
        return result.state
      })
      return
    }
    const blocking = TEST_WALLET_ENABLED
    const totalS = blocking ? pickTestAdSeconds() : Math.round(REWARDED_AD_DELAY_MS / 1000)
    const ad = { choice, plot, totalS, leftMs: blocking ? totalS * 1000 : REWARDED_AD_DELAY_MS, blocking, last: Date.now() }
    adRef.current = ad
    setAdResult(null)
    setAdPlaying({ choice, totalS, leftMs: ad.leftMs, blocking })
    if (blocking) logPlaytest('test_ad', { result: 'start', seconds: totalS, choice })
    adTimer.current = window.setInterval(() => {
      const cur = adRef.current
      if (!cur) return
      const now = Date.now()
      const dt = now - cur.last
      cur.last = now
      // Im Hintergrund pausiert die Werbung (wie echte Werbung)
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
      cur.leftMs = Math.max(0, cur.leftMs - Math.min(dt, 1000))
      if (cur.leftMs <= 0) finishAd()
      else setAdPlaying({ choice: cur.choice, totalS: cur.totalS, leftMs: cur.leftMs, blocking: cur.blocking })
    }, 250)
  }, [finishAd, setState])

  /** Testphase: Werbung abbrechen — keine Belohnung, keine Abklingzeit. */
  const cancelAd = useCallback(() => {
    const ad = adRef.current
    if (!ad) return
    stopAdTimer()
    adRef.current = null
    setAdPlaying(null)
    logPlaytest('test_ad', { result: 'abort', seconds: ad.totalS, watched: Math.round(ad.totalS - ad.leftMs / 1000), choice: ad.choice })
  }, [])

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

  const gartenwocheClaimXp = useCallback(() => {
    setState((s) => claimGartenwocheDailyXp(s))
  }, [setState])

  const gartenwocheClaimTier = useCallback((tier: number, track: 'free' | 'premium') => {
    setState((s) => claimGartenwocheTier(s, tier, track))
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
    adWatching: adPlaying != null,
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
  }
}
