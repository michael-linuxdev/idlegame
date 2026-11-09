/**
 * Event stub — Bandbreiten-Schub (local clock, weekend-style).
 * Buffs production; optional Ernte goal with Samen crumb. Dismissible UI.
 * Never energy walls. Player-facing copy: German via i18n.
 */

import { t } from '../i18n'
import { dayKey } from './monetization'

/** +25% Ernte/s while the Erntefest is live */
export const ERNTEFEST_MULT = 1.25

/**
 * Goal: earn this much Ernte during the active window.
 * IG-31: 10_000 → 25_000 so the weekend Ziel tracks the slower midgame curve
 * (still clearable in one engaged session once G3 is online).
 */
export const ERNTEFEST_GOAL = 25_000

/** Samen crumb when goal is claimed */
export const ERNTEFEST_GOAL_REWARD = 15

export const ERNTEFEST_NAME = t.event.name
export const ERNTEFEST_BLURB = t.event.blurb

/**
 * Weekend window in local time: Sat 00:00 → Sun 23:59:59.
 * Also active Friday after 18:00 local (early open).
 */
export function isErntefestActive(now = Date.now()): boolean {
  const d = new Date(now)
  const day = d.getDay() // 0 Sun … 6 Sat
  if (day === 0 || day === 6) return true
  if (day === 5 && d.getHours() >= 18) return true
  return false
}

/**
 * Stable window id for dismiss / goal progress (local weekend start Friday).
 * Format: `ef-YYYY-MM-DD` where date is the Friday that opened the window.
 */
export function erntefestWindowKey(now = Date.now()): string {
  const d = new Date(now)
  const day = d.getDay()
  const start = new Date(d)
  start.setHours(0, 0, 0, 0)
  if (day === 0) {
    start.setDate(start.getDate() - 2)
  } else if (day === 6) {
    start.setDate(start.getDate() - 1)
  }
  return `ef-${dayKey(start.getTime())}`
}

export function erntefestEndsLabel(now = Date.now()): string {
  const d = new Date(now)
  const day = d.getDay()
  if (day === 5) return t.event.endsFri
  if (day === 6) return t.event.endsSat
  if (day === 0) return t.event.endsSun
  return t.event.endsDefault
}

export interface ErntefestStatus {
  active: boolean
  windowKey: string
  mult: number
  goal: number
  goalReward: number
  endsLabel: string
  name: string
  blurb: string
}

export function erntefestStatus(now = Date.now()): ErntefestStatus {
  const active = isErntefestActive(now)
  return {
    active,
    windowKey: erntefestWindowKey(now),
    mult: active ? ERNTEFEST_MULT : 1,
    goal: ERNTEFEST_GOAL,
    goalReward: ERNTEFEST_GOAL_REWARD,
    endsLabel: erntefestEndsLabel(now),
    name: ERNTEFEST_NAME,
    blurb: ERNTEFEST_BLURB,
  }
}
