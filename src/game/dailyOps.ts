/**
 * Daily Ops — claimable login reward (Compute / Credits / Obsidian crumb).
 * Optional streak; miss freezes (does not reset). Never energy/lives walls.
 * Player-facing copy: German via i18n (src/theme/strings.ts).
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
  /** True when returning after a missed day (streak frozen, small gift) */
  comeback?: boolean
}

/** Days between last claim and today (0 = same/never handled separately). */
export function daysSinceClaim(lastClaimDay: string, now = Date.now()): number {
  if (!lastClaimDay) return 0
  const today = dayKey(now)
  if (lastClaimDay === today) return 0
  let cursor = today
  let gap = 0
  // Cap scan — streak freeze means we only care about “missed ≥1 day”
  for (let i = 0; i < 60; i++) {
    cursor = previousDayKey(cursor)
    gap += 1
    if (cursor === lastClaimDay) return gap
  }
  return gap
}

/** Comeback when last claim was ≥2 calendar days ago (missed ≥1 full day). */
export function isComebackClaim(lastClaimDay: string, now = Date.now()): boolean {
  if (!lastClaimDay) return false
  return daysSinceClaim(lastClaimDay, now) >= 2
}

/**
 * Comeback gift scale by gap (calendar days since last claim).
 * Gap 2 → mild; 3–4 → strong; 5+ → warm welcome. Never punishes / resets streak.
 */
export function comebackScale(gapDays: number): {
  computeMult: number
  computeFlat: number
  obsidian: number
  credits: number
} {
  if (gapDays >= 5) {
    return { computeMult: 2.0, computeFlat: 80, obsidian: 40, credits: 1 }
  }
  if (gapDays >= 3) {
    return { computeMult: 1.75, computeFlat: 60, obsidian: 30, credits: 0 }
  }
  return { computeMult: 1.5, computeFlat: 40, obsidian: 20, credits: 0 }
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
  opts: { comeback?: boolean; gapDays?: number } = {},
): DailyReward {
  const dayIndex = Math.max(0, streakBeforeClaim) % ROWS.length
  const row = ROWS[dayIndex]!
  let compute = Math.max(MIN_COMPUTE, Math.floor(ratePerSec * row.computeSec))
  let credits = row.credits
  let obsidian = row.obsidian
  let label = row.label
  // Streak day-7 seal already rich; mild bump on day 3 / 5 for visible rhythm
  if (dayIndex === 2) obsidian += 5
  if (dayIndex === 4) compute = Math.floor(compute * 1.1)
  if (opts.comeback) {
    const gap = Math.max(2, opts.gapDays ?? 2)
    const scale = comebackScale(gap)
    compute = Math.floor(compute * scale.computeMult) + scale.computeFlat
    obsidian += scale.obsidian
    credits += scale.credits
    label = t.daily.comebackLabel
  }
  return {
    compute,
    credits,
    obsidian,
    label,
    comeback: opts.comeback === true,
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
  const comeback =
    canClaimDaily(lastClaimDay, now) && isComebackClaim(lastClaimDay, now)
  const gapDays = comeback ? daysSinceClaim(lastClaimDay, now) : 0
  return rewardForStreak(next, ratePerSec, { comeback, gapDays })
}

export { dayKey, ROWS as DAILY_STREAK_ROWS }
