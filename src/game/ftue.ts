/**
 * First-10-minutes guided beats (gdd-mvp.md §7 + economy Day-1 hooks).
 * Copy: Orbit Rack datacenter Ops voice. Dismissible, persisted — never blocks idle.
 */

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
        title: 'Station online',
        body: 'Orbit Rack is your floor. Modules mint Compute while you are away.',
        cta: 'Open Ops',
      }
    case 'upgradePit':
      return {
        title: 'Upgrade Power Plant',
        body: 'Tap the plant on the map → Upgrade. Throughput rises each level.',
        cta: 'Next',
        highlight: 'emberPit',
      }
    case 'claimOffline':
      return {
        title: 'Idle banks Compute',
        body: 'Leave the app, then return. Catchup pays up to the offline cap.',
        cta: 'Got it',
        highlight: 'offline',
      }
    case 'unlockForge':
      return {
        title: 'Bring Cooling online',
        body: 'Earn 200 Compute this run (or Power Plant Lv 10) to unlock Cooling Array.',
        cta: 'Next',
        highlight: 'ashForge',
      }
    case 'visitClan':
      return {
        title: 'Clan roster',
        body: 'Optional peek — seasonal orbit slots come later. No action required.',
        cta: 'Open Clan',
        skipLabel: 'Skip',
        highlight: 'clan',
      }
    case 'prestigeTeaser':
      return {
        title: 'Credits meta',
        body: 'Prestige soft-resets the run for Credits — permanent rack power. Check Prestige when ready.',
        cta: 'Done',
        skipLabel: 'Dismiss',
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
