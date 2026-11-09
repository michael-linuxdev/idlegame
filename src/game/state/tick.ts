/** Spielkern — Saisonende-Schwelle und Spiel-Takt. Öffentlich über src/game/state.ts. */
import { erbstueckePayout, isProbeYear, prestigeBlockReason, prestigeMinErnte } from '../economy'
import { runIlse, syncChaptersOpen, tickChapters } from './chapters'
import { bumpQuest, productionPerSecond, syncEventWindow, syncMonetization, withQuestSync } from './core'
import { maybePrestigeSpike, withEventProgress } from './events'
import { syncContest, syncSky } from './extras'
import { syncFest } from './fest'
import { runHelper } from './garden'
import { syncAlbum } from './life'
import type { GameState } from './types'

export function nextPrestigeErbstuecke(ernteSeason: number, saisonenden = 0): number {
  return erbstueckePayout(ernteSeason, saisonenden)
}

export function canPrestigeNow(state: GameState): boolean {
  return (
    prestigeBlockReason({
      saisonenden: state.saisonenden,
      ernteSeason: state.ernteSeason,
      owned: state.owned,
      probe: isProbeYear(state),
    }) === null
  )
}

export function prestigeProgress(state: GameState): {
  min: number
  current: number
  ratio: number
  erbstuecke: number
} {
  const probe = isProbeYear(state)
  const min = prestigeMinErnte(state.saisonenden, probe)
  const current = state.ernteSeason
  return {
    min,
    current,
    ratio: min > 0 ? Math.min(1, current / min) : 1,
    erbstuecke: erbstueckePayout(current, state.saisonenden, probe),
  }
}

export function applyTick(state: GameState, dtSeconds: number): GameState {
  if (dtSeconds <= 0) return state
  const now = Date.now()
  let synced = withQuestSync(syncEventWindow(syncMonetization(state, now), now), now)
  synced = syncContest(syncSky(syncFest(syncChaptersOpen(synced, now), now), now), now)
  synced = tickChapters(synced, (rate) => rate * dtSeconds)
  synced = syncAlbum(synced, now)
  if (synced.helperLevel > 0 && synced.helperOn) {
    synced = runHelper(synced, dtSeconds * 1000).state
  }
  if (synced.ilseLevel > 0 && synced.ilseOn) {
    synced = runIlse(synced, dtSeconds * 1000).state
  }
  const gained = productionPerSecond(synced, now) * dtSeconds
  if (gained <= 0) {
    return maybePrestigeSpike({ ...synced, lastSeen: now }, now)
  }
  let withProg = withEventProgress(synced, gained, now)
  withProg = {
    ...withProg,
    ernte: withProg.ernte + gained,
    ernteSeason: withProg.ernteSeason + gained,
    ernteLifetime: withProg.ernteLifetime + gained,
    lastSeen: now,
  }
  // Quest earnErnte tracks session production without spammy XP
  withProg = bumpQuest(withProg, 'earnErnte', gained, now)
  return maybePrestigeSpike(withProg, now)
}
