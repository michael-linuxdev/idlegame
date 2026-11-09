/**
 * Sammel-Übersicht: Pflanzenbuch, Gartenbewohner, Jahreszeiten-Album,
 * Erfolge und Kreuzungen auf einen Blick — mit Gesamt-Prozent und dem
 * nächsten fast vollständigen Pflanzenbuch-Set.
 */
import { ACHIEVEMENT_IDS } from './achievements'
import { ALBUM_GOALS } from './album'
import { HYBRID_IDS } from './crossing'
import { CHALLENGE_IDS } from './challenges'
import { GARDEN_VARIETIES } from './gardenLife'
import type { GeneratorId } from './generators'
import { RESIDENT_IDS } from './residents'

export type CollectionKey = 'pflanzenbuch' | 'bewohner' | 'album' | 'erfolge' | 'kreuzungen' | 'herausforderungen'

export interface CollectionRow {
  key: CollectionKey
  have: number
  total: number
}

interface CollectionInput {
  collection: readonly string[]
  residentsSeen: Partial<Record<string, number>>
  album: { claimed: readonly string[] }
  claimedAchievements: readonly string[]
  hybrids: readonly string[]
  challengesDone?: readonly string[]
}

export function collectionRows(s: CollectionInput): CollectionRow[] {
  const varieties = GARDEN_VARIETIES.filter((v) => s.collection.includes(v.id)).length
  const residents = RESIDENT_IDS.filter((id) => (s.residentsSeen[id] ?? 0) > 0).length
  return [
    { key: 'pflanzenbuch', have: varieties, total: GARDEN_VARIETIES.length },
    { key: 'bewohner', have: residents, total: RESIDENT_IDS.length },
    { key: 'album', have: Math.min(ALBUM_GOALS.length, s.album.claimed.length), total: ALBUM_GOALS.length },
    { key: 'erfolge', have: ACHIEVEMENT_IDS.filter((id) => s.claimedAchievements.includes(id)).length, total: ACHIEVEMENT_IDS.length },
    { key: 'kreuzungen', have: HYBRID_IDS.filter((id) => s.hybrids.includes(id)).length, total: HYBRID_IDS.length },
    {
      key: 'herausforderungen',
      have: CHALLENGE_IDS.filter((id) => s.challengesDone?.includes(id)).length,
      total: CHALLENGE_IDS.length,
    },
  ]
}

/** Gesamt in Prozent (jede Sammlung zählt gleich viel). */
export function collectionPercent(rows: readonly CollectionRow[]): number {
  const parts = rows.filter((r) => r.total > 0).map((r) => r.have / r.total)
  return parts.length ? Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100) : 0
}

/** Pflanzenbuch-Sets, denen noch wenige Sorten fehlen (fast fertige zuerst). */
export function nearSets(collection: readonly string[], maxMissing = 2): { module: GeneratorId; missing: number }[] {
  const byModule = new Map<GeneratorId, { have: number; total: number }>()
  for (const v of GARDEN_VARIETIES) {
    const e = byModule.get(v.module) ?? { have: 0, total: 0 }
    e.total += 1
    if (collection.includes(v.id)) e.have += 1
    byModule.set(v.module, e)
  }
  return [...byModule.entries()]
    .map(([module, e]) => ({ module, missing: e.total - e.have, have: e.have }))
    .filter((x) => x.missing > 0 && x.missing <= maxMissing && x.have > 0)
    .sort((a, b) => a.missing - b.missing)
    .map(({ module, missing }) => ({ module, missing }))
}
