/**
 * Jahreszeiten-Album: 12 goals per real season (spring/summer/autumn/winter
 * by calendar). Each goal claimed is a stamp (+3 Samen); ALBUM_REWARD_AT
 * stamps unlock the season's exclusive Deko (or Samen if already owned).
 * Progress uses lifetime counters measured from the season's start, plus a
 * few counters bumped by the game (Gießen, Saisonende, Gartenrunde, Ernten).
 */
import type { DecorId } from './decor'
import { ambientAt, type Season } from '../theme/ambient'

export type AlbumStat =
  | 'water'
  | 'seasons'
  | 'daily'
  | 'offline'
  | 'upgrades'
  | 'varieties'
  | 'visits'
  | 'species'
  | 'hybrids'
  | 'decor'
  | 'chapterLevels'
  | 'projectStages'

/** Stats counted by the game while the season runs (others are lifetime deltas). */
export const COUNTED: AlbumStat[] = ['water', 'seasons', 'daily', 'offline']

export const ALBUM_GOALS: { id: AlbumStat; need: number }[] = [
  { id: 'water', need: 30 },
  { id: 'upgrades', need: 400 },
  { id: 'seasons', need: 4 },
  { id: 'daily', need: 5 },
  { id: 'offline', need: 3 },
  { id: 'visits', need: 6 },
  { id: 'species', need: 1 },
  { id: 'varieties', need: 2 },
  { id: 'hybrids', need: 1 },
  { id: 'decor', need: 2 },
  { id: 'chapterLevels', need: 50 },
  { id: 'projectStages', need: 1 },
]

export const ALBUM_STAMP_SAMEN = 3
export const ALBUM_REWARD_AT = 10
export const ALBUM_REWARD_FALLBACK_SAMEN = 50

export const SEASON_DECOR: Record<Season, DecorId> = {
  spring: 'blumenkorb',
  summer: 'strandkorb',
  autumn: 'kuerbislaterne',
  winter: 'schneemann',
}

export interface AlbumState {
  key: string
  base: Partial<Record<AlbumStat, number>>
  counts: Partial<Record<AlbumStat, number>>
  claimed: AlbumStat[]
  rewarded: boolean
}

/** e.g. "2026-autumn"; December counts to next year's winter. */
export function seasonKey(now: number): string {
  const d = new Date(now)
  const season = ambientAt(d).season
  const year = season === 'winter' && d.getMonth() === 11 ? d.getFullYear() + 1 : d.getFullYear()
  return `${year}-${season}`
}

export function seasonOfKey(key: string): Season {
  return (key.split('-')[1] as Season) ?? 'spring'
}

export function emptyAlbum(): AlbumState {
  return { key: '', base: {}, counts: {}, claimed: [], rewarded: false }
}

export function albumProgress(album: AlbumState, stats: Record<AlbumStat, number>, id: AlbumStat): number {
  if (COUNTED.includes(id)) return album.counts[id] ?? 0
  return Math.max(0, stats[id] - (album.base[id] ?? stats[id]))
}

export function parseAlbum(raw: unknown): AlbumState {
  const out = emptyAlbum()
  if (raw == null || typeof raw !== 'object') return out
  const r = raw as Record<string, unknown>
  const ids = ALBUM_GOALS.map((g) => g.id)
  const rec = (v: unknown) => {
    const o: Partial<Record<AlbumStat, number>> = {}
    if (v && typeof v === 'object') {
      for (const id of ids) {
        const n = (v as Record<string, unknown>)[id]
        if (typeof n === 'number' && Number.isFinite(n) && n >= 0) o[id] = n
      }
    }
    return o
  }
  return {
    key: typeof r.key === 'string' ? r.key.slice(0, 16) : '',
    base: rec(r.base),
    counts: rec(r.counts),
    claimed: Array.isArray(r.claimed) ? ids.filter((id) => (r.claimed as unknown[]).includes(id)) : [],
    rewarded: r.rewarded === true,
  }
}
