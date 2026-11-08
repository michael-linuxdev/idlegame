/**
 * Engagement extras kept outside the run save (they never change the
 * economy curve directly — rewards go through grantReward):
 *  - Bestellungen (Hofladen orders): timed Ernte goals with a reward
 *  - Omas Wochenplan: seven weekly tasks + a bonus basket
 *  - Besucher cadence, Comeback detection, reminder opt-in
 */
import { useCallback, useEffect, useState } from 'react'
import { weekKey } from './monetization'

export const EXTRAS_STORAGE_KEY = 'gartenerbe-extras-v1'

export type WeeklyTaskId = 'water' | 'upgrades' | 'orders' | 'visitors' | 'seasons' | 'daily' | 'varieties'

export const WEEKLY_TASKS: { id: WeeklyTaskId; target: number; seeds: number }[] = [
  { id: 'water', target: 15, seeds: 8 },
  { id: 'upgrades', target: 150, seeds: 8 },
  { id: 'orders', target: 5, seeds: 10 },
  { id: 'visitors', target: 6, seeds: 10 },
  { id: 'daily', target: 3, seeds: 8 },
  { id: 'seasons', target: 1, seeds: 12 },
  { id: 'varieties', target: 1, seeds: 12 },
]
export const WEEKLY_BONUS = { seeds: 60, erbstuecke: 25 }

export interface Order {
  id: number
  customer: number
  need: number
  seeds: number
  startLifetime: number
  expiresAt: number
}

export interface ExtrasState {
  order: Order | null
  nextOrderAt: number
  weekKey: string
  week: Record<WeeklyTaskId, number>
  weekClaimed: WeeklyTaskId[]
  weekBonusClaimed: boolean
  nextVisitorAt: number
  lastVisit: number
  notify: boolean
}

export const ORDER_DURATION_MS = 30 * 60_000
export const ORDER_PAUSE_MS = 3 * 60_000
/** Order size in seconds of current production (needs boosts/upgrades to beat). */
export const ORDER_NEED_SECONDS = [600, 900, 1200]

function emptyWeek(): Record<WeeklyTaskId, number> {
  return { water: 0, upgrades: 0, orders: 0, visitors: 0, seasons: 0, daily: 0, varieties: 0 }
}

function fresh(now: number): ExtrasState {
  return {
    order: null,
    nextOrderAt: now + 60_000,
    weekKey: weekKey(now),
    week: emptyWeek(),
    weekClaimed: [],
    weekBonusClaimed: false,
    nextVisitorAt: now + 90_000,
    lastVisit: now,
    notify: false,
  }
}

export function loadExtras(now = Date.now()): ExtrasState {
  try {
    const raw = localStorage.getItem(EXTRAS_STORAGE_KEY)
    if (!raw) return fresh(now)
    const p = JSON.parse(raw) as Partial<ExtrasState>
    const base = fresh(now)
    return { ...base, ...p, week: { ...emptyWeek(), ...(p.week ?? {}) } }
  } catch {
    return fresh(now)
  }
}

/** Roll the week over on a new ISO week. */
export function syncWeek(s: ExtrasState, now: number): ExtrasState {
  const key = weekKey(now)
  if (s.weekKey === key) return s
  return { ...s, weekKey: key, week: emptyWeek(), weekClaimed: [], weekBonusClaimed: false }
}

export function makeOrder(id: number, ratePerSec: number, lifetime: number, now: number, rng = Math.random): Order {
  const secs = ORDER_NEED_SECONDS[Math.floor(rng() * ORDER_NEED_SECONDS.length)]!
  return {
    id,
    customer: Math.floor(rng() * 6),
    need: Math.max(50, Math.round(ratePerSec * secs)),
    seeds: 4 + Math.round(secs / 150),
    startLifetime: lifetime,
    expiresAt: now + ORDER_DURATION_MS,
  }
}

export function orderProgress(o: Order, lifetime: number): number {
  return Math.max(0, lifetime - o.startLifetime)
}

export function useExtras() {
  const [extras, setExtras] = useState<ExtrasState>(() => syncWeek(loadExtras(), Date.now()))

  useEffect(() => {
    try {
      localStorage.setItem(EXTRAS_STORAGE_KEY, JSON.stringify(extras))
    } catch {
      /* ignore */
    }
  }, [extras])

  const update = useCallback((fn: (s: ExtrasState) => ExtrasState) => {
    setExtras((s) => fn(syncWeek(s, Date.now())))
  }, [])

  const track = useCallback(
    (task: WeeklyTaskId, n = 1) => update((s) => ({ ...s, week: { ...s.week, [task]: s.week[task] + n } })),
    [update],
  )

  return { extras, update, track }
}
