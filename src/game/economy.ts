/**
 * Economy knobs — core formulas (R(n), C(n), offline) unchanged.
 * Player-facing names come from src/i18n/de/strings.ts.
 * Interne Namen folgen den Spielbegriffen (docs/cleanup/namen.md).
 *
 * Balance pass IG-31 (overnight): prestige was ~5 min for engaged play vs
 * design 45–90 min. Raised P_min base + slowed generator ladder (see generators.ts).
 *
 * Soft-Prestige depth (IG-53 / playtest 2026-11-07 + b + 2026-11-08 + d):
 * Erbstücke soft-gate every prestige; interleaved rank unlocks during rebuild;
 * steeper cost curve; √ payout soft-capped so runaway ernte cannot dump the
 * unlocked band in ~40s. Tip band scales with lifetime saisonenden so P2+ never
 * lands on an empty Truhe after tips are already owned.
 */

import type { GeneratorId } from './generators'

export const OFFLINE_SOFT_HOURS = 8
export const OFFLINE_HARD_HOURS = 24
export const OFFLINE_DECAY_RATE = 0.5

/**
 * Saisonende balance knobs (tuned with scripts/balance/sim.ts).
 *  - gate(p)   = prestigeBase · prestigeGrowth^min(p, knee) · lateGrowth^max(0, p − knee)
 *  - payout    = payoutBase · payoutGrowth^p · f(ernte / gate)
 *    f(r) = √r up to r = 4 (2× base), then +0.5 per doubling — staying a
 *    bit longer pays, spamming at the gate pays the base, nothing explodes.
 * Mutable on purpose so the simulator can sweep values; the game never
 * writes to it.
 */
export const BALANCE = {
  prestigeBase: 25_000_000,
  prestigeGrowth: 3.2,
  /** Seasons that still open new garden corners — steep phase */
  prestigeKnee: 13,
  /** Growth per season after the knee (meta-paced, avoids a content wall) */
  prestigeLateGrowth: 1.12,
  payoutBase: 100,
  payoutGrowth: 1.12,
  /**
   * Probe-Winter (2026-11-09): nur Gartenjahr 1 hat eine eigene, niedrige
   * Schwelle, damit das erste Saisonende in die erste Sitzung fällt
   * (Dauerspieler ~18 min statt ~60). Ab Gartenjahr 2 gilt die Kurve oben.
   */
  firstSeasonGate: 5_000_000,
  /** Auszahlung an der Probe-Schwelle (2–3 Truhen-Käufe); 45 bremste das Spiel danach (Sim: Jahr 12 = 388 min aktiv). */
  firstSeasonPayout: 70,
}

/** Modules that must be online (owned ≥ 1) before Run 2+ Soft-Prestige. */
export const PRESTIGE_MIN_MODULES_ONLINE = 3

/** Base Erbstücke paid exactly at the gate for this season. */
/** Probe-Winter gilt nur im allerersten Gartenjahr (nicht nach Tiefem Winter / Generation). */
export function isProbeYear(s: { saisonenden: number; tiefeWinter: number; generation: number }): boolean {
  return s.saisonenden <= 0 && s.tiefeWinter <= 0 && s.generation <= 0
}

export function payoutAtGate(saisonenden: number, probe = false): number {
  if (probe) return BALANCE.firstSeasonPayout
  return Math.round(BALANCE.payoutBase * Math.pow(BALANCE.payoutGrowth, Math.max(0, saisonenden)))
}

/** Saisonende gate: Ernte this season ≥ prestigeBase · prestigeGrowth^p */
export function prestigeMinErnte(saisonenden: number, probe = false): number {
  if (probe) return BALANCE.firstSeasonGate
  return Math.floor(
    BALANCE.prestigeBase *
      Math.pow(BALANCE.prestigeGrowth, Math.min(Math.max(0, saisonenden), BALANCE.prestigeKnee)) *
      Math.pow(BALANCE.prestigeLateGrowth, Math.max(0, saisonenden - BALANCE.prestigeKnee)),
  )
}

/** Payout curve over r = ernte / gate. */
function payoutCurve(r: number): number {
  if (r <= 0) return 0
  if (r <= 4) return Math.sqrt(r)
  return 2 + 0.5 * Math.log2(r / 4)
}

/**
 * Erbstücke for ending the season now. Relative to this season's gate, so a
 * stronger garden doesn't turn Saisonende into a 2-minute loop.
 */
export function erbstueckePayout(ernteSeason: number, saisonenden = 0, probe = false): number {
  if (ernteSeason <= 0) return 0
  const r = ernteSeason / Math.max(1, prestigeMinErnte(saisonenden, probe))
  return Math.floor(payoutAtGate(saisonenden, probe) * payoutCurve(r))
}

export function modulesOnlineCount(
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const level of Object.values(owned)) {
    if ((level ?? 0) >= 1) n += 1
  }
  return n
}

/** Sum of owned module levels (rebuild progress). */
export function moduleLevelsTotal(
  owned: Partial<Record<GeneratorId, number>>,
): number {
  let n = 0
  for (const level of Object.values(owned)) {
    n += Math.max(0, level ?? 0)
  }
  return n
}

export type PrestigeBlockReason =
  | 'ernte'
  | 'erbstuecke'
  | 'modules'
  | null

/** Soft-gate diagnostics for UI (Erbstücke floor every run + rebuild on Run 2+). */
export function prestigeBlockReason(args: {
  saisonenden: number
  ernteSeason: number
  owned: Partial<Record<GeneratorId, number>>
  probe?: boolean
}): PrestigeBlockReason {
  const min = prestigeMinErnte(args.saisonenden, args.probe)
  if (args.ernteSeason < min) return 'ernte'
  const payout = erbstueckePayout(args.ernteSeason, args.saisonenden, args.probe)
  if (payout <= 0) return 'ernte'
  if (
    args.saisonenden >= 1 &&
    modulesOnlineCount(args.owned) < PRESTIGE_MIN_MODULES_ONLINE
  ) {
    return 'modules'
  }
  return null
}

/**
 * Offline catchup Ernte for elapsed seconds at snapshot rate R (Ernte/s).
 * Soft full rate, then 50% until hard cap; nothing beyond hard.
 */
export function offlineCatchupErnte(
  ratePerSec: number,
  elapsedSec: number,
  softHours: number,
  hardHours: number,
): number {
  if (ratePerSec <= 0 || elapsedSec <= 0) return 0
  const tHours = elapsedSec / 3600
  const soft = softHours
  const hard = hardHours

  if (tHours <= soft) {
    return ratePerSec * tHours * 3600
  }
  if (tHours <= hard) {
    return (
      ratePerSec * soft * 3600 +
      ratePerSec * OFFLINE_DECAY_RATE * (tHours - soft) * 3600
    )
  }
  return (
    ratePerSec * soft * 3600 +
    ratePerSec * OFFLINE_DECAY_RATE * (hard - soft) * 3600
  )
}

/**
 * Active tap bonus — session hook, not a grind sink.
 * IG-31: 45s → 60s of current rate so short visits feel juicier while idle
 * curve stays the prestige pace-setter. Cooldown unchanged (5 min).
 * Tap Mastery adds +15s per rank on top.
 */
export const TAP_BONUS_SECONDS = 60
export const TAP_COOLDOWN_MS = 5 * 60 * 1000

/**
 * Offline-Zettel („Ernten“) erst ab dieser Abwesenheit; kürzere Pausen gehen
 * ohne Zettel direkt in die Ernte (nichts geht verloren, nur keine EP).
 * Playtest 2026-11-11: bei 15 s kamen 45 von 61 Zetteln nach < 5 min.
 */
export const MIN_OFFLINE_CLAIM_AWAY_MS = 5 * 60 * 1000
