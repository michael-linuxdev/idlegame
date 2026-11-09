/** Laden, Offline-Ernte beim Start, Spiel-Takt und Speichern. Teil von useGame(), siehe src/game/useGame.ts. */
import { MIN_OFFLINE_CLAIM_AWAY_MS } from '../economy'
import { ensureFeaturesSeen, loadFeaturesSeen, usedFeatures } from '../featureUnlocks'
import { FEATURE_HINTS, seedHintsSeen, type HintId } from '../hints'
import { isIdle, onIdleChange, startIdleWatch } from '../idle'
import { registerPlaytestSnapshot } from '../playtestLog'
import {
  applyOfflineCatchup,
  countSession,
  applyTick,
  collectReadyAchievements,
  creditOfflinePending,
  maybeStartFlashEvent,
  playerLevelOf,
  productionPerSecond,
  type GameState,
  openChapters,
} from '../state'
import { loadState, saveState } from '../storage'
import { useEffect, useRef, useState } from 'react'

/** Economy + React UI cadence. 100ms was overheating iPhone Safari PWAs. */
const TICK_MS = 250

/** Ruhemodus (no touch for a while, see idle.ts): one tick per second */
const IDLE_TICK_MS = 1000

/** Persist less often than the tick — localStorage stringify is expensive. */
const SAVE_MS = 4000

export function useGameLoop() {
  // One catch-up on start: the basket (offlinePending) waits for the „Ernten“
  // tap; short absences go straight into the wallet.
  const [boot] = useState(() => {
    const loaded = loadState()
    const awayMs = Math.max(0, Date.now() - loaded.lastSeen)
    let next = applyOfflineCatchup(countSession(loaded, awayMs)).state
    const banner = awayMs >= MIN_OFFLINE_CLAIM_AWAY_MS && next.offlinePending > 0.01
    if (!banner) next = creditOfflinePending(next)
    return { state: maybeStartFlashEvent(next), awayMs: banner ? awayMs : 0, pending: banner ? next.offlinePending : null }
  })
  const [state, setState] = useState<GameState>(boot.state)
  // „Neu“-Abzeichen: bestehende Spieler kennen schon, was offen ist
  useState(() => {
    const s = boot.state
    const ctx = {
      saisonenden: s.saisonenden,
      tiefeWinter: s.tiefeWinter,
      generation: s.generation,
      sessions: s.sessions,
      owned: s.owned,
      collection: s.collection,
      openChapters: openChapters(s).length,
      used: usedFeatures(s),
    }
    const fresh = loadFeaturesSeen() === null
    const seen = ensureFeaturesSeen(ctx)
    if (fresh) seedHintsSeen(seen.map((id) => FEATURE_HINTS[id]).filter((h): h is HintId => h != null))
    return true
  })
  const [offlineGained, setOfflineGained] = useState<number | null>(boot.pending)
  const [offlineAwayMs, setOfflineAwayMs] = useState<number>(boot.awayMs)

  const stateRef = useRef(state)
  const dirtySaveRef = useRef(false)
  useEffect(() => {
    stateRef.current = state
    dirtySaveRef.current = true
  }, [state])

  // Playtest-Log: Fortschritts-Stand des Tages (nur wenn das Log an ist)
  useEffect(() => {
    registerPlaytestSnapshot(() => {
      const s = stateRef.current
      return {
        saisons: s.saisonenden,
        tieferWinter: s.tiefeWinter,
        generation: s.generation,
        stufe: playerLevelOf(s),
        erntePerS: Math.round(productionPerSecond(s)),
        erbstuecke: s.erbstuecke,
        samen: s.samen,
        jonas: s.helperLevel,
        kapitel: Object.values(s.chapters).filter((c) => c.openedAt > 0).length,
        bereiche: Object.values(s.owned).filter((n) => n > 0).length,
      }
    })
    return () => registerPlaytestSnapshot(null)
  }, [])

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
        let next = applyOfflineCatchup(countSession(s, awayMs)).state
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

  return {
    state,
    setState,
    offlineGained,
    setOfflineGained,
    offlineAwayMs,
    setOfflineAwayMs,
    stateRef,
    nowTick,
  }
}

/** Kern-Zustand, den die Aktions-Hooks brauchen. */
export type GameCore = ReturnType<typeof useGameLoop>
