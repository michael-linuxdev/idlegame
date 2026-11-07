/**
 * First-10-minutes guided beats (gdd-mvp.md §7 structure + economy Day-1 hooks).
 * Copy: Sci-Fi Outpost / Orbital Claim. Dismissible, persisted — never blocks idle.
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
  /** Player dismissed / skipped the whole coach */
  dismissed: boolean
  /** Beats completed (for resume) */
  completed: FtueBeatId[]
  /** Session-start timestamp (ms) for soft timing hints */
  startedAt: number
}

export const FTUE_STORAGE_KEY = 'orbital-claim-ftue-v1'

const BEAT_ORDER: FtueBeatId[] = [
  'welcome',
  'upgradePit',
  'claimOffline',
  'unlockForge',
  'visitClan',
  'prestigeTeaser',
  'done',
]

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
    const raw =
      localStorage.getItem(FTUE_STORAGE_KEY) ??
      localStorage.getItem('ash-dominion-ftue-v1')
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
    localStorage.removeItem('ash-dominion-ftue-v1')
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
        title: 'Claim your outpost',
        body: 'This build map is home. Modules produce Ore while you are away.',
        cta: 'Take command',
      }
    case 'upgradePit':
      return {
        title: 'Upgrade the Drill Rig',
        body: 'Tap the rig, then upgrade. Rate climbs with every level.',
        cta: 'Got it',
        highlight: 'emberPit',
      }
    case 'claimOffline':
      return {
        title: 'Idle is real',
        body: 'Leave briefly, then return — catchup credits Ore up to the offline cap.',
        cta: 'Understood',
        highlight: 'offline',
      }
    case 'unlockForge':
      return {
        title: 'Bring Hab Module online',
        body: 'Earn 250 Ore this run to unlock the second module on the map.',
        cta: 'On it',
        highlight: 'ashForge',
      }
    case 'visitClan':
      return {
        title: 'Clans await',
        body: 'Peek at the Clan tab — seasonal sector control comes later. No action required.',
        cta: 'Open Clan',
        skipLabel: 'Later',
        highlight: 'clan',
      }
    case 'prestigeTeaser':
      return {
        title: 'Plasma awaits',
        body: 'Prestige soft-resets the run for Plasma — permanent meta power. Check Prestige when ready.',
        cta: 'Finish guide',
        skipLabel: 'Dismiss',
        highlight: 'prestige',
      }
    case 'done':
      return null
  }
}
