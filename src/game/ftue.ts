/**
 * First-10-minutes guided beats (gdd-mvp.md §7 structure + economy Day-1 hooks).
 * Copy: space data centers / Orbit Rack. Dismissible, persisted — never blocks idle.
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

export interface FtueCopy {
  title: string
  body: string
  cta: string
  skipLabel?: string
  highlight?: 'emberPit' | 'ashForge' | 'clan' | 'prestige' | 'offline'
}

export function ftueCopy(beat: FtueBeatId): FtueCopy | null {
  switch (beat) {
    case 'welcome':
      return {
        title: 'Bring the station online',
        body: 'This build map is home. Modules produce Compute while you are away.',
        cta: 'Take ops',
      }
    case 'upgradePit':
      return {
        title: 'Upgrade the Power Plant',
        body: 'Tap the plant, then upgrade. Throughput climbs with every level.',
        cta: 'Got it',
        highlight: 'emberPit',
      }
    case 'claimOffline':
      return {
        title: 'Idle is real',
        body: 'Leave briefly, then return — catchup credits Compute up to the offline cap.',
        cta: 'Understood',
        highlight: 'offline',
      }
    case 'unlockForge':
      return {
        title: 'Spin up Cooling Array',
        body: 'Earn 250 Compute this run to unlock the second module on the map.',
        cta: 'On it',
        highlight: 'ashForge',
      }
    case 'visitClan':
      return {
        title: 'Clans await',
        body: 'Peek at the Clan tab — seasonal orbit slots come later. No action required.',
        cta: 'Open Clan',
        skipLabel: 'Later',
        highlight: 'clan',
      }
    case 'prestigeTeaser':
      return {
        title: 'Credits await',
        body: 'Prestige soft-resets the run for Credits — permanent meta power. Check Prestige when ready.',
        cta: 'Finish guide',
        skipLabel: 'Dismiss',
        highlight: 'prestige',
      }
    case 'done':
      return null
  }
}
