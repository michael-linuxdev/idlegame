/**
 * First-10-minutes guided beats (gdd-mvp.md §7 + economy Day-1 hooks).
 * Copy: TurmFarm Ops voice (DE via i18n). Dismissible, persisted — never blocks idle.
 */

import { t } from '../i18n'

export type FtueBeatId =
  | 'welcome'
  | 'upgradePit'
  | 'claimOffline'
  | 'unlockForge'
  | 'visitClan'
  | 'prestigeTeaser'
  | 'done'

export interface FtueState {
  beat: FtueBeatId
  dismissed: boolean
  completed: FtueBeatId[]
  startedAt: number
}

export const FTUE_STORAGE_KEY = 'orbit-rack-ftue-v1'

const BEAT_ORDER: FtueBeatId[] = [
  'welcome',
  'upgradePit',
  'claimOffline',
  'unlockForge',
  'visitClan',
  'prestigeTeaser',
  'done',
]

/** Beats that count toward the step chip (excludes `done`) */
export const FTUE_STEP_BEATS: FtueBeatId[] = BEAT_ORDER.filter((b) => b !== 'done')

const LEGACY_FTUE_KEYS = ['orbital-claim-ftue-v1', 'ash-dominion-ftue-v1'] as const

export function createInitialFtue(now = Date.now()): FtueState {
  return {
    beat: 'welcome',
    dismissed: false,
    completed: [],
    startedAt: now,
  }
}

export function loadFtue(): FtueState {
  try {
    let raw = localStorage.getItem(FTUE_STORAGE_KEY)
    if (!raw) {
      for (const key of LEGACY_FTUE_KEYS) {
        raw = localStorage.getItem(key)
        if (raw) break
      }
    }
    if (!raw) return createInitialFtue()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return createInitialFtue()
    const p = parsed as Record<string, unknown>
    const beat =
      typeof p.beat === 'string' && BEAT_ORDER.includes(p.beat as FtueBeatId)
        ? (p.beat as FtueBeatId)
        : 'welcome'
    return {
      beat,
      dismissed: p.dismissed === true,
      completed: Array.isArray(p.completed)
        ? (p.completed.filter((x) => typeof x === 'string') as FtueBeatId[])
        : [],
      startedAt: typeof p.startedAt === 'number' ? p.startedAt : Date.now(),
    }
  } catch {
    return createInitialFtue()
  }
}

export function saveFtue(state: FtueState): void {
  try {
    localStorage.setItem(FTUE_STORAGE_KEY, JSON.stringify(state))
    for (const key of LEGACY_FTUE_KEYS) localStorage.removeItem(key)
  } catch {
    // ignore
  }
}

export function nextBeat(current: FtueBeatId): FtueBeatId {
  const i = BEAT_ORDER.indexOf(current)
  if (i < 0 || i >= BEAT_ORDER.length - 1) return 'done'
  return BEAT_ORDER[i + 1]!
}

export function ftueStepIndex(beat: FtueBeatId): { step: number; total: number } {
  const total = FTUE_STEP_BEATS.length
  const idx = FTUE_STEP_BEATS.indexOf(beat)
  return { step: idx < 0 ? total : idx + 1, total }
}

export interface FtueCopy {
  title: string
  body: string
  cta: string
  /** Secondary — advance without the primary action */
  skipLabel?: string
  highlight?: 'emberPit' | 'ashForge' | 'clan' | 'prestige' | 'offline'
}

export function ftueCopy(beat: FtueBeatId): FtueCopy | null {
  switch (beat) {
    case 'welcome':
      return {
        title: t.ftue.welcome.title,
        body: t.ftue.welcome.body,
        cta: t.ftue.welcome.cta,
      }
    case 'upgradePit':
      return {
        title: t.ftue.upgradePit.title,
        body: t.ftue.upgradePit.body,
        cta: t.ftue.upgradePit.cta,
        highlight: 'emberPit',
      }
    case 'claimOffline':
      return {
        title: t.ftue.claimOffline.title,
        body: t.ftue.claimOffline.body,
        cta: t.ftue.claimOffline.cta,
        highlight: 'offline',
      }
    case 'unlockForge':
      return {
        title: t.ftue.unlockForge.title,
        body: t.ftue.unlockForge.body,
        cta: t.ftue.unlockForge.cta,
        highlight: 'ashForge',
      }
    case 'visitClan':
      return {
        title: t.ftue.visitClan.title,
        body: t.ftue.visitClan.body,
        cta: t.ftue.visitClan.cta,
        skipLabel: t.ftue.visitClan.skipLabel,
        highlight: 'clan',
      }
    case 'prestigeTeaser':
      return {
        title: t.ftue.prestigeTeaser.title,
        body: t.ftue.prestigeTeaser.body,
        cta: t.ftue.prestigeTeaser.cta,
        skipLabel: t.ftue.prestigeTeaser.skipLabel,
        highlight: 'prestige',
      }
    case 'done':
      return null
  }
}

/** Early beats where install nudge would clutter the floor */
export function ftueBlocksInstall(beat: FtueBeatId, dismissed: boolean): boolean {
  if (dismissed || beat === 'done') return false
  return beat === 'welcome' || beat === 'upgradePit' || beat === 'claimOffline'
}
