/**
 * Tägliche Gartenrunde — claimable login reward (Ernte / Erbstücke / Samen-Krümel).
 * Optional streak; miss freezes (does not reset). Never energy/lives walls.
 * Player-facing copy: German via i18n (src/i18n/de/strings.ts).
 */

import { t } from '../i18n'
import { dayKey } from './monetization'

export interface DailyReward {
  /** Ernte grant (floor) */
  ernte: number
  /** Erbstücke grant */
  erbstuecke: number
  /** Samen crumb */
  samen: number
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
  ernteMult: number
  ernteFlat: number
  samen: number
  erbstuecke: number
} {
  if (gapDays >= 5) {
    return { ernteMult: 2.0, ernteFlat: 80, samen: 40, erbstuecke: 1 }
  }
  if (gapDays >= 3) {
    return { ernteMult: 1.75, ernteFlat: 60, samen: 30, erbstuecke: 0 }
  }
  return { ernteMult: 1.5, ernteFlat: 40, samen: 20, erbstuecke: 0 }
}

interface StreakRow {
  ernteSec: number
  erbstuecke: number
  samen: number
  label: string
}

type RowKey = keyof typeof t.daily.rows

/** Label read live from `t`, so a language switch reaches it. */
function row(ernteSec: number, erbstuecke: number, samen: number, key: RowKey): StreakRow {
  return {
    ernteSec,
    erbstuecke,
    samen,
    get label() {
      return t.daily.rows[key]
    },
  }
}

/** Streak day 1…7 cycles; day N uses index (N-1) % 7 */
const ROWS: StreakRow[] = [
  row(120, 0, 0, 'float2'),
  row(180, 0, 0, 'shift3'),
  row(60, 0, 20, 'crumb20'),
  row(240, 0, 0, 'long4'),
  row(90, 1, 0, 'credit1'),
  row(300, 0, 0, 'ot5'),
  {
    ernteSec: 120,
    erbstuecke: 1,
    samen: 40,
    get label() {
      return t.daily.rows.weekSeal
    },
  },
]

/** Minimum Ernte floor so early Day-1 claims still feel like a gift. */
const MIN_ERNTE = 50

export function rewardForStreak(
  streakBeforeClaim: number,
  ratePerSec: number,
  opts: { comeback?: boolean; gapDays?: number } = {},
): DailyReward {
  const dayIndex = Math.max(0, streakBeforeClaim) % ROWS.length
  const row = ROWS[dayIndex]!
  let ernte = Math.max(MIN_ERNTE, Math.floor(ratePerSec * row.ernteSec))
  let erbstuecke = row.erbstuecke
  let samen = row.samen
  let label = row.label
  // Streak day-7 seal already rich; mild bump on day 3 / 5 for visible rhythm
  if (dayIndex === 2) samen += 5
  if (dayIndex === 4) ernte = Math.floor(ernte * 1.1)
  if (opts.comeback) {
    const gap = Math.max(2, opts.gapDays ?? 2)
    const scale = comebackScale(gap)
    ernte = Math.floor(ernte * scale.ernteMult) + scale.ernteFlat
    samen += scale.samen
    erbstuecke += scale.erbstuecke
    label = t.daily.comebackLabel
  }
  return {
    ernte,
    erbstuecke,
    samen,
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
