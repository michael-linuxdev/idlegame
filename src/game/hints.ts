/**
 * Omas Hinweise — one-time explanations the first time a system shows up.
 * Seen ids persist; at most one hint is shown at a time.
 */
import { useCallback, useState } from 'react'
import type { FeatureId } from './featureUnlocks'

export const HINTS_STORAGE_KEY = 'gartenerbe-hints-v1'

export type HintId =
  | 'visitor'
  | 'order'
  | 'variety'
  | 'season'
  | 'truhe'
  | 'weekly'
  | 'deep'
  | 'bulkMax'
  | 'bulk5'
  | 'buyAll'
  | 'helperAreas'
  | 'recipeNew'
  | 'festNew'
  | 'weatherNew'
  | 'clanNew'
  | 'crossNew'
  | 'arcI'
  | 'arcII'
  | 'arcIII'
  | 'arcIV'

/** Priority order when several are pending. */
export const HINT_ORDER: HintId[] = [
  'season',
  'truhe',
  'deep',
  'visitor',
  'order',
  'variety',
  'weekly',
  'recipeNew',
  'festNew',
  'weatherNew',
  'clanNew',
  'crossNew',
  'arcI',
  'arcII',
  'arcIII',
  'arcIV',
  'bulkMax',
  'bulk5',
  'buyAll',
  'helperAreas',
]

/** Omas Hinweis, wenn ein System neu freigeschaltet wird (featureUnlocks.ts). */
export const FEATURE_HINTS: Partial<Record<FeatureId, HintId>> = {
  recipe: 'recipeNew',
  fest: 'festNew',
  weather: 'weatherNew',
  clan: 'clanNew',
  cross: 'crossNew',
}

/** Mark hints as already seen (veterans on the first start with a new version). */
export function seedHintsSeen(ids: readonly HintId[]): void {
  if (ids.length === 0) return
  const cur = load()
  const next = [...cur, ...ids.filter((id) => !cur.includes(id))]
  try {
    localStorage.setItem(HINTS_STORAGE_KEY, JSON.stringify(next))
  } catch {
    /* ignore */
  }
}

function load(): HintId[] {
  try {
    const raw = localStorage.getItem(HINTS_STORAGE_KEY)
    const arr = raw ? (JSON.parse(raw) as unknown) : []
    return Array.isArray(arr) ? (arr.filter((x) => HINT_ORDER.includes(x as HintId)) as HintId[]) : []
  } catch {
    return []
  }
}

export function pickHint(pending: Partial<Record<HintId, boolean>>, seen: readonly HintId[]): HintId | null {
  return HINT_ORDER.find((id) => pending[id] && !seen.includes(id)) ?? null
}

export function useHints() {
  const [seen, setSeen] = useState<HintId[]>(load)
  const markSeen = useCallback((id: HintId) => {
    setSeen((s) => {
      if (s.includes(id)) return s
      const next = [...s, id]
      try {
        localStorage.setItem(HINTS_STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })
  }, [])
  return { seen, markSeen }
}
