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

describe('Briefe von Jonas und Ilse', () => {
  const fresh: NotebookState = { unlocked: ['welcome'], read: [], maxStage: 0 }
  it('unlock by Jonas/Ilse rank and the first Generation', () => {
    expect(unlockFor(fresh, 0, 1).unlocked).not.toContain('jonas1')
    const a = unlockFor(fresh, 0, 1, 0, { helper: 3 })
    expect(a.unlocked).toEqual(expect.arrayContaining(['jonas1', 'jonas3']))
    expect(a.unlocked).not.toContain('jonas5')
    const b = unlockFor(a, 0, 1, 0, { helper: 5, ilse: 1, generation: 1 })
    expect(b.unlocked).toEqual(expect.arrayContaining(['jonas5', 'ilse1', 'gen1']))
    expect(b.unlocked).not.toContain('ilse3')
    expect(NOTEBOOK_ENTRIES.find((e) => e.id === 'gen1')?.from).toBe('ilse')
  })
})
