/**
 * Omas Notizbuch — narrative letters unlocked by progress.
 *  - stage letters: highest garden stage ever reached (areas angelegt)
 *  - year letters: Gartenjahr reached (Saisonenden + 1)
 * Persisted separately from the run save so letters survive Saisonende.
 */
import { useCallback, useEffect, useState } from 'react'

export const NOTEBOOK_STORAGE_KEY = 'gartenerbe-notebook-v1'

export type NotebookEntryId =
  | 'welcome'
  | 'stage2'
  | 'stage4'
  | 'stage5'
  | 'stage7'
  | 'stage9'
  | 'stage10'
  | 'year2'
  | 'year3'
  | 'year5'
  | 'year7'
  | 'year10'
  | 'year14'
  | 'deep1'

export interface NotebookEntryDef {
  id: NotebookEntryId
  /** Unlock by garden stage (areas angelegt in one season) */
  stage?: number
  /** Unlock by Gartenjahr (prestiges + 1) */
  year?: number
  /** Unlock by Tiefe Winter completed */
  deep?: number
}

/** Story order — the notebook lists pages in this sequence. */
export const NOTEBOOK_ENTRIES: NotebookEntryDef[] = [
  { id: 'welcome' },
  { id: 'stage2', stage: 2 },
  { id: 'stage4', stage: 4 },
  { id: 'year2', year: 2 },
  { id: 'stage5', stage: 5 },
  { id: 'year3', year: 3 },
  { id: 'year5', year: 5 },
  { id: 'stage7', stage: 7 },
  { id: 'year7', year: 7 },
  { id: 'year10', year: 10 },
  { id: 'stage9', stage: 9 },
  { id: 'year14', year: 14 },
  { id: 'stage10', stage: 10 },
  { id: 'deep1', deep: 1 },
]

/** Letter Oma sends when a given Gartenjahr begins (for the ceremony). */
export function yearLetterFor(year: number): NotebookEntryId | null {
  const e = NOTEBOOK_ENTRIES.find((x) => x.year === year)
  return e ? e.id : null
}

export interface NotebookState {
  unlocked: NotebookEntryId[]
  read: NotebookEntryId[]
  maxStage: number
}

const EMPTY: NotebookState = { unlocked: ['welcome'], read: [], maxStage: 0 }

export function loadNotebook(): NotebookState {
  try {
    const raw = localStorage.getItem(NOTEBOOK_STORAGE_KEY)
    if (!raw) return { ...EMPTY }
    const p = JSON.parse(raw) as Partial<NotebookState>
    const ids = new Set(NOTEBOOK_ENTRIES.map((e) => e.id))
    const clean = (a: unknown) =>
      Array.isArray(a) ? (a.filter((x) => ids.has(x)) as NotebookEntryId[]) : []
    const unlocked = clean(p.unlocked)
    if (!unlocked.includes('welcome')) unlocked.unshift('welcome')
    return {
      unlocked,
      read: clean(p.read),
      maxStage: typeof p.maxStage === 'number' ? p.maxStage : 0,
    }
  } catch {
    return { ...EMPTY }
  }
}

function saveNotebook(s: NotebookState) {
  try {
    localStorage.setItem(NOTEBOOK_STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* ignore */
  }
}

/** Pure: entries newly unlocked for the given progress. */
export function unlockFor(
  s: NotebookState,
  stage: number,
  year: number,
  deep = 0,
): NotebookState {
  const maxStage = Math.max(s.maxStage, stage)
  const unlocked = [...s.unlocked]
  for (const e of NOTEBOOK_ENTRIES) {
    if (unlocked.includes(e.id)) continue
    if (
      (e.stage != null && maxStage >= e.stage) ||
      (e.year != null && year >= e.year) ||
      (e.deep != null && deep >= e.deep)
    ) {
      unlocked.push(e.id)
    }
  }
  if (maxStage === s.maxStage && unlocked.length === s.unlocked.length) return s
  return { ...s, unlocked, maxStage }
}

export function useNotebook(stage: number, year: number, deep = 0) {
  const [base, setBase] = useState<NotebookState>(() => loadNotebook())
  // Unlock during render (guarded) so letters found this season stay
  // unlocked after Saisonende resets the garden stage.
  const nb = unlockFor(base, stage, year, deep)
  if (nb !== base) setBase(nb)

  useEffect(() => {
    saveNotebook(nb)
  }, [nb])

  const markRead = useCallback(
    (id: NotebookEntryId) => {
      setBase((s) => (s.read.includes(id) ? s : { ...s, read: [...s.read, id] }))
    },
    [],
  )

  const unread = nb.unlocked.filter((id) => !nb.read.includes(id) && id !== 'welcome')
  return { notebook: nb, unread, markRead }
}
