import { useCallback, useEffect, useRef, useState } from 'react'
import {
  foundryDiscountMult,
  TAP_BONUS_SECONDS,
  TAP_COOLDOWN_MS,
  type EmberUpgradeId,
} from './economy'
import {
  GENERATORS,
  generatorCost,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'
import {
  applyOfflineCatchup,
  applyTick,
  buyEmberUpgrade,
  buyGenerator,
  canPrestigeNow,
  doPrestige,
  nextPrestigeEmbers,
  prestigeMinAsh,
  prestigeMultiplier,
  prestigeProgress,
  productionPerSecond,
  type GameState,
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
          return next
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
      const rate = productionPerSecond(s)
      const gained = Math.max(rate * TAP_BONUS_SECONDS, 1)
      return {
        ...s,
        ash: s.ash + gained,
        ashEarned: s.ashEarned + gained,
        lastTapAt: now,
        lastSeen: now,
      }
    })
  }, [])

  const buy = useCallback((id: GeneratorId) => {
    setState((s) => buyGenerator(s, id))
  }, [])

  const buyMeta = useCallback((id: EmberUpgradeId) => {
    setState((s) => buyEmberUpgrade(s, id))
  }, [])

  const prestige = useCallback(() => {
    setState((s) => doPrestige(s))
  }, [])

  const dismissOffline = useCallback(() => setOfflineGained(null), [])

  const mult = prestigeMultiplier(state.emberUpgrades)
  const progress = prestigeProgress(state)
  const discount = foundryDiscountMult(state.emberUpgrades)

  const costOf = useCallback(
    (id: GeneratorId) => {
      const def = GENERATORS.find((g) => g.id === id)
      if (!def) return Infinity
      return generatorCost(def, state.owned[id] ?? 0, discount)
    },
    [state.owned, discount],
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
      )
    },
    [state.ashEarned, state.owned, state.emberUpgrades.firstFlame],
  )

  return {
    state,
    rate: productionPerSecond(state),
    multiplier: mult,
    nextPrestige: nextPrestigeEmbers(state.ashEarned),
    prestigeMin: prestigeMinAsh(state.prestiges),
    prestigeProgress: progress,
    canPrestige: canPrestigeNow(state),
    tapReady,
    tapCooldownMs: TAP_COOLDOWN_MS,
    rake,
    buy,
    buyMeta,
    prestige,
    costOf,
    unlocked,
    offlineGained,
    offlineAwayMs,
    dismissOffline,
  }
}
