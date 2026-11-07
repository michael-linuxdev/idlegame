/**
 * Daily Ops — claimable login reward (Compute / Credits / Obsidian crumb).
 * Optional streak; miss freezes (does not reset). Never energy/lives walls.
 * Player-facing copy: German via i18n (Orbit Rack brand unchanged).
 */

import { t } from '../i18n'
import { dayKey } from './monetization'

export interface DailyReward {
  /** Soft Compute grant (floor) */
  compute: number
  /** Meta Credits grant */
  credits: number
  /** Hard Obsidian cosmetic crumb */
  obsidian: number
  label: string
}

interface StreakRow {
  computeSec: number
  credits: number
  obsidian: number
  label: string
}

/** Streak day 1…7 cycles; day N uses index (N-1) % 7 */
const ROWS: StreakRow[] = [
  { computeSec: 120, credits: 0, obsidian: 0, label: t.daily.rows.float2 },
  { computeSec: 180, credits: 0, obsidian: 0, label: t.daily.rows.shift3 },
  { computeSec: 60, credits: 0, obsidian: 20, label: t.daily.rows.crumb20 },
  { computeSec: 240, credits: 0, obsidian: 0, label: t.daily.rows.long4 },
  { computeSec: 90, credits: 1, obsidian: 0, label: t.daily.rows.credit1 },
  { computeSec: 300, credits: 0, obsidian: 0, label: t.daily.rows.ot5 },
  {
    computeSec: 120,
    credits: 1,
    obsidian: 40,
    label: t.daily.rows.weekSeal,
  },
]

/** Minimum Compute floor so early Day-1 claims still feel like a gift. */
const MIN_COMPUTE = 50

export function rewardForStreak(
  streakBeforeClaim: number,
  ratePerSec: number,
): DailyReward {
  const dayIndex = Math.max(0, streakBeforeClaim) % ROWS.length
  const row = ROWS[dayIndex]!
  const compute = Math.max(MIN_COMPUTE, Math.floor(ratePerSec * row.computeSec))
  return {
    compute,
    credits: row.credits,
    obsidian: row.obsidian,
    label: row.label,
  }
}

export function previousDayKey(key: string): string {
  const [y, m, d] = key.split('-').map(Number)
  const dt = new Date(y!, m! - 1, d!)
  dt.setDate(dt.getDate() - 1)
  return dayKey(dt.getTime())
}

/**
 * Whether Daily Ops can be claimed for local calendar day.
 * Miss freezes streak (no reset) — next claim continues from frozen value.
 */
export function canClaimDaily(lastClaimDay: string, now = Date.now()): boolean {
  const today = dayKey(now)
  return lastClaimDay !== today
}

/**
 * Next streak value after a successful claim.
 * Consecutive day → +1; gap → freeze (keep streak), still advance table index.
 */
export function nextStreakAfterClaim(
  lastClaimDay: string,
  streak: number,
  now = Date.now(),
): number {
  const today = dayKey(now)
  if (lastClaimDay === today) return streak
  if (lastClaimDay && lastClaimDay === previousDayKey(today)) {
    return streak + 1
  }
  if (!lastClaimDay) return 1
  return Math.max(1, streak)
}

/** Preview reward for UI (uses current streak as table index). */
export function previewDailyReward(
  streak: number,
  lastClaimDay: string,
  ratePerSec: number,
  now = Date.now(),
): DailyReward {
  const next = canClaimDaily(lastClaimDay, now)
    ? Math.max(0, nextStreakAfterClaim(lastClaimDay, streak, now) - 1)
    : Math.max(0, streak - 1)
  return rewardForStreak(next, ratePerSec)
}

export { dayKey, ROWS as DAILY_STREAK_ROWS }
