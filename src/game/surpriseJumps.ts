/**
 * Variable big jumps — fair, rate-scaled surprise crumbs.
 * Ethics: never energy walls / forced ads / paywalls. Soft grant only.
 *
 * Documented rates (expected value ~ modest; never wipes progress):
 * - Milestone every 5th upgrade: 100% → floor(rate × 45s) soft crumb
 * - Upgrade jackpot: 7% per upgrade → floor(rate × U[90..210]s), capped at
 *   12% of (ernteSeason + rate×60) so early/late stay fair
 * - Prestige near-miss spikes (once each per run): cross 72% / 88% / 97% of
 *   prestige gate → floor(rate × 25s) crumb + “almost ready” juice
 * - Offline jackpot: 15% when away ≥ 30 min → +35% of claimed offline amount
 *   (gilt für jeden Garten: offene Kapitel bekommen +35 % ihrer Offline-Ernte)
 * - Kapitel-Jackpot: 7% per manual chapter upgrade → chapter rate × U[90..210]s
 *   in the chapter's currency (same 5-s gap as the garden)
 *
 * RNG: Math.random() — session-local, not seed-gamed.
 */

import type { ChapterId } from './chapters'
import { prestigeMinErnte } from './economy'

export type SurpriseKind =
  | 'milestone'
  | 'jackpot'
  | 'prestigeNear'
  | 'offlineJackpot'

export interface SurpriseJump {
  kind: SurpriseKind
  /** Soft currency granted (0 only if toast-only; we always grant crumbs) */
  amount: number
  /** Threshold index for prestigeNear (0=72%, 1=88%, 2=97%) */
  prestigeTier?: number
  /** Kapitel-Überraschung: `amount` ist in der Währung dieses Kapitels */
  chapter?: ChapterId
}

/** Prestige near-miss thresholds — Zeigarnik “almost there” spikes. */
export const PRESTIGE_SPIKE_RATIOS = [0.72, 0.88, 0.97] as const

export const UPGRADE_JACKPOT_CHANCE = 0.07
/**
 * Höchstens ein Überraschungs-Krümel pro 5 s Ausbauen. Playtest 2026-11-08:
 * Einzeltippen im 150-ms-Takt brachte 412 Krümel in 64 min (jeder ~4. Kauf)
 * und belohnte stumpfes Tippen statt „Max“. 5 s = so viel wie ein Max-Kauf
 * im Simulator-Takt; 15 s verschob das erste Saisonende (Regular 132 → 240 min).
 */
export const SURPRISE_MIN_GAP_MS = 5_000
export const UPGRADE_MILESTONE_EVERY = 5
export const OFFLINE_JACKPOT_CHANCE = 0.15
export const OFFLINE_JACKPOT_MIN_AWAY_MS = 30 * 60 * 1000
export const OFFLINE_JACKPOT_BONUS = 0.35

function clampCrumb(amount: number, ratePerSec: number, ernteSeason: number): number {
  if (amount <= 0) return 0
  const floor = Math.max(8, Math.floor(ratePerSec * 8))
  const cap = Math.max(
    floor,
    Math.floor((ernteSeason + ratePerSec * 60) * 0.12),
  )
  return Math.min(cap, Math.max(floor, Math.floor(amount)))
}

/** Deterministic-ish roll helper (testable via inject). */
export function rollChance(p: number, rng = Math.random): boolean {
  return rng() < p
}

export function rollUpgradeSurprise(
  totalUpgradesAfter: number,
  ratePerSec: number,
  ernteSeason: number,
  rng = Math.random,
): SurpriseJump | null {
  if (totalUpgradesAfter > 0 && totalUpgradesAfter % UPGRADE_MILESTONE_EVERY === 0) {
    const amount = clampCrumb(ratePerSec * 45, ratePerSec, ernteSeason)
    return { kind: 'milestone', amount }
  }
  if (rollChance(UPGRADE_JACKPOT_CHANCE, rng)) {
    const sec = 90 + rng() * 120
    const amount = clampCrumb(ratePerSec * sec, ratePerSec, ernteSeason)
    return { kind: 'jackpot', amount }
  }
  return null
}

/** Kapitel-Jackpot beim Ausbau (gleiche Chance und Spanne wie im Garten). */
export function rollChapterJackpot(
  chapter: ChapterId,
  ratePerSec: number,
  curLifetime: number,
  rng = Math.random,
): SurpriseJump | null {
  if (ratePerSec <= 0 || !rollChance(UPGRADE_JACKPOT_CHANCE, rng)) return null
  const sec = 90 + rng() * 120
  return { kind: 'jackpot', amount: clampCrumb(ratePerSec * sec, ratePerSec, curLifetime), chapter }
}

/**
 * Returns the next unclaimed prestige spike for this run, or null.
 * `flags` is a bitmask: bit i set ⇒ PRESTIGE_SPIKE_RATIOS[i] already fired.
 */
export function rollPrestigeSpike(
  ernteSeason: number,
  saisonenden: number,
  flags: number,
  ratePerSec: number,
  probe = false,
): SurpriseJump | null {
  const min = prestigeMinErnte(saisonenden, probe)
  if (min <= 0) return null
  const ratio = ernteSeason / min
  for (let i = 0; i < PRESTIGE_SPIKE_RATIOS.length; i++) {
    const bit = 1 << i
    if (flags & bit) continue
    if (ratio >= PRESTIGE_SPIKE_RATIOS[i]!) {
      const amount = clampCrumb(ratePerSec * 25, ratePerSec, ernteSeason)
      return { kind: 'prestigeNear', amount, prestigeTier: i }
    }
  }
  return null
}

export function rollOfflineJackpot(
  gained: number,
  awayMs: number,
  rng = Math.random,
): SurpriseJump | null {
  if (gained < 1 || awayMs < OFFLINE_JACKPOT_MIN_AWAY_MS) return null
  if (!rollChance(OFFLINE_JACKPOT_CHANCE, rng)) return null
  const amount = Math.max(1, Math.floor(gained * OFFLINE_JACKPOT_BONUS))
  return { kind: 'offlineJackpot', amount }
}

export function prestigeSpikeBit(tier: number): number {
  return 1 << Math.max(0, Math.min(2, tier))
}
