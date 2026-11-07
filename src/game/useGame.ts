import { useCallback, useEffect, useRef, useState } from 'react'
import {
  GENERATORS,
  generatorCost,
  isGeneratorUnlocked,
  type GeneratorId,
} from './generators'
import {
  applyOfflineCatchup,
  applyTick,
  createInitialState,
  prestigeGain,
  productionPerSecond,
  prestigeMultiplier,
  type GameState,
} from './state'
import { loadState, saveState } from './storage'

const TICK_MS = 100

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    const loaded = loadState()
    return applyOfflineCatchup(loaded)
  })
  const [offlineGained, setOfflineGained] = useState<number | null>(() => {
    const loaded = loadState()
    const after = applyOfflineCatchup(loaded)
    const gained = after.ash - loaded.ash
    return gained > 0.01 ? gained : null
  })

  const stateRef = useRef(state)
  stateRef.current = state

  // Persist on change (debounced via rAF batching is fine for MVP — save each tick is ok)
  useEffect(() => {
    saveState(state)
  }, [state])

  // Idle tick
  useEffect(() => {
    const id = window.setInterval(() => {
      setState((s) => applyTick(s, TICK_MS / 1000))
    }, TICK_MS)
    return () => window.clearInterval(id)
  }, [])

  // Flush lastSeen on hide / unload
  useEffect(() => {
    const flush = () => {
      const next = { ...stateRef.current, lastSeen: Date.now() }
      saveState(next)
    }
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flush()
    })
    return () => {
      window.removeEventListener('pagehide', flush)
    }
  }, [])

  const rake = useCallback(() => {
    setState((s) => {
      const gained = 1 * prestigeMultiplier(s.dominion)
      return {
        ...s,
        ash: s.ash + gained,
        ashEarned: s.ashEarned + gained,
        lastSeen: Date.now(),
      }
    })
  }, [])

  const buy = useCallback((id: GeneratorId) => {
    setState((s) => {
      const def = GENERATORS.find((g) => g.id === id)
      if (!def) return s
      if (!isGeneratorUnlocked(def, s.ashEarned, s.owned)) return s
      const owned = s.owned[id] ?? 0
      const cost = generatorCost(def, owned)
      if (s.ash < cost) return s
      return {
        ...s,
        ash: s.ash - cost,
        owned: { ...s.owned, [id]: owned + 1 },
        lastSeen: Date.now(),
      }
    })
  }, [])

  const canPrestige = prestigeGain(state.ashEarned) > 0

  const prestige = useCallback(() => {
    setState((s) => {
      const gain = prestigeGain(s.ashEarned)
      if (gain <= 0) return s
      return {
        ...createInitialState(),
        dominion: s.dominion + gain,
        prestiges: s.prestiges + 1,
        lastSeen: Date.now(),
      }
    })
  }, [])

  const dismissOffline = useCallback(() => setOfflineGained(null), [])

  return {
    state,
    rate: productionPerSecond(state),
    multiplier: prestigeMultiplier(state.dominion),
    nextPrestige: prestigeGain(state.ashEarned),
    canPrestige,
    rake,
    buy,
    prestige,
    offlineGained,
    dismissOffline,
  }
}
