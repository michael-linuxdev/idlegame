import { describe, expect, it } from 'vitest'
import { NOTEBOOK_ENTRIES, unlockFor, yearLetterFor, type NotebookState } from '../game/notebook'
import { strings } from '../theme/strings'

const fresh: NotebookState = { unlocked: ['welcome'], read: [], maxStage: 0 }

describe('Omas Notizbuch', () => {
  it('unlocks stage letters once and keeps them after a reset', () => {
    const a = unlockFor(fresh, 4, 1)
    expect(a.unlocked).toContain('stage2')
    expect(a.unlocked).toContain('stage4')
    const afterWinter = unlockFor(a, 0, 2)
    expect(afterWinter.unlocked).toContain('stage4')
    expect(afterWinter.unlocked).toContain('year2')
  })
  it('returns the same object when nothing changes', () => {
    const a = unlockFor(fresh, 1, 1)
    expect(unlockFor(a, 1, 1)).toBe(a)
  })
  it('has copy for every entry and a letter for each Gartenjahr gate', () => {
    for (const e of NOTEBOOK_ENTRIES) expect(strings.notebook.entries[e.id].body.length).toBeGreaterThan(40)
    for (const y of [2, 3, 5, 7, 10, 14]) expect(yearLetterFor(y)).not.toBeNull()
  })
})
