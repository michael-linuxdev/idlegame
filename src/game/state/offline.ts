/** Spielkern — Offline-Ernte. Öffentlich über src/game/state.ts. */
import { offlineCatchupErnte } from '../economy'
import { offlineCapsHours } from '../truhe'
import { FEST_EARN } from '../fests'
import { deepOfflineBonusHours } from '../longLoop'
import { xpFromOfflineClaim } from '../progression'
import { cardOfflineMult } from '../seasonCards'
import { OFFLINE_JACKPOT_BONUS, rollOfflineJackpot } from '../surpriseJumps'
import { collectReadyAchievements } from './buy'
import { runIlse, syncChaptersOpen, tickChapters } from './chapters'
import {
  applyLevelRewards,
  bumpQuest,
  productionPerSecond,
  syncEventWindow,
  syncMonetization,
  withQuestSync,
  withXp,
} from './core'
import { withEventProgress } from './events'
import { syncContest } from './extras'
import { earnFest, syncFest } from './fest'
import { runHelper } from './garden'
import { albumCount } from './life'
import type { GameState } from './types'

export function applyOfflineCatchup(
  state: GameState,
  now = Date.now(),
): { state: GameState; gained: number } {
  const elapsedMs = Math.max(0, now - state.lastSeen)
  const elapsedSec = elapsedMs / 1000
  let base = withQuestSync(syncEventWindow(syncMonetization(state, now), now), now)
  base = applyLevelRewards(base, now)
  const rate = productionPerSecond(base, now)
  const truheCaps = offlineCapsHours(base.truhe)
  const deepCaps = deepOfflineBonusHours(base.sproesslingLaden)
  const gained =
    offlineCatchupErnte(rate, elapsedSec, truheCaps.soft + deepCaps.soft, truheCaps.hard + deepCaps.hard) *
    cardOfflineMult(base.seasonCard)
  // „Über Nacht gewachsen“ gilt für jeden Garten: ein Wurf, Kapitel bekommen dieselben +35 %
  const jackpot = gained > 0 ? rollOfflineJackpot(gained, elapsedMs) : null
  const chapterJackpot = jackpot ? 1 + OFFLINE_JACKPOT_BONUS : 1
  // Chapters grow offline with the same caps; Ilse keeps tending them
  base = syncContest(syncFest(syncChaptersOpen(base, now), now), now)
  base = tickChapters(
    base,
    (r) => offlineCatchupErnte(r, elapsedSec, truheCaps.soft + deepCaps.soft, truheCaps.hard + deepCaps.hard) * chapterJackpot,
    true,
    now,
  )
  if (base.ilseLevel > 0 && base.ilseOn && elapsedMs > 60_000) {
    base = runIlse(base, Math.min(elapsedMs, 8 * 3600_000), 300).state
  }
  if (elapsedSec >= 3600) {
    base = earnFest(base, Math.min(FEST_EARN.offlineCap, Math.floor(elapsedSec / 3600) * FEST_EARN.offlineHour), now)
  }
  if (gained <= 0) {
    return { state: { ...base, lastSeen: now }, gained: 0 }
  }
  let total = gained
  if (jackpot) total += jackpot.amount
  let withProg = withEventProgress(base, total, now)
  withProg = {
    ...withProg,
    ernte: withProg.ernte + total,
    ernteSeason: withProg.ernteSeason + total,
    ernteLifetime: withProg.ernteLifetime + total,
    lastSeen: now,
    lastSurprise: jackpot ?? withProg.lastSurprise,
  }
  withProg = bumpQuest(withProg, 'earnErnte', total, now)
  // Gartenhelfer keeps working while you are away (spends part of the catch-up)
  const ernteBefore = withProg.ernte - total
  if (withProg.helperLevel > 0 && withProg.helperOn && elapsedMs > 60_000) {
    const helper = runHelper(withProg, Math.min(elapsedMs, 8 * 3600_000), 300)
    withProg = { ...helper.state, helperReport: helper.bought }
  }
  // What Jonas left over waits in the basket until the player taps „Ernten“
  const left = Math.max(0, Math.min(total, withProg.ernte - ernteBefore))
  withProg = { ...withProg, ernte: withProg.ernte - left, offlinePending: withProg.offlinePending + left }
  // XP + the basket are granted when the player taps Ernten (claimOfflineReward)
  return { state: withProg, gained: total }
}

/** Put the waiting basket straight into the wallet (short absences, no banner). */
export function creditOfflinePending(state: GameState): GameState {
  if (state.offlinePending <= 0) return state
  return { ...state, ernte: state.ernte + state.offlinePending, offlinePending: 0 }
}

/**
 * Player tapped Ernten on the offline banner — add the waiting basket, grant XP
 * and mark the achievement flag.
 * Pass the claimed amount so EP scales with the catchup.
 */
export function claimOfflineReward(
  state: GameState,
  gained: number,
  now = Date.now(),
): GameState {
  let next: GameState = {
    ...creditOfflinePending(state),
    claimedOfflineOnce: true,
    lastSeen: now,
  }
  next = withXp(next, xpFromOfflineClaim(gained), now)
  return albumCount(collectReadyAchievements(next, now), 'offline', 1, now)
}
