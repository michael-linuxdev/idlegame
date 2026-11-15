import { describe, expect, it } from 'vitest'
import { OBSTWIESE } from '../game/chapters'
import { chapterBonusActive, createInitialState, expansionGardenMult, syncChaptersOpen, type GameState } from '../game/state'
import { strings as de } from '../i18n/de/strings'
import { strings as en } from '../i18n/en/strings'

/** Kapitel 2 ab dem 6. Gartenjahr; der Garten-Bonus der Kapitel ab dem ersten Tiefen Winter. */
describe('Obstwiese früher', () => {
  const base = createInitialState(0)
  const grown = (s: GameState): GameState => {
    const c = s.chapters.obstwiese
    return { ...s, chapters: { ...s.chapters, obstwiese: { ...c, owned: { ...c.owned, apfel: 100 } } } }
  }

  it('opens after the 5th Saisonende, not before', () => {
    expect(OBSTWIESE.fromSeasons).toBe(5)
    expect(syncChaptersOpen({ ...base, saisonenden: 4 }, 1000).chapters.obstwiese.openedAt).toBe(0)
    const open = syncChaptersOpen({ ...base, saisonenden: 5 }, 1000)
    expect(open.chapters.obstwiese.openedAt).toBe(1000)
    // nur Kapitel 2 — der Weinberg braucht weiter eine Generation
    expect(open.chapters.weinberg.openedAt).toBe(0)
  })

  it('still opens with the first Tiefer Winter (Gartenjahr zählt danach neu)', () => {
    expect(syncChaptersOpen({ ...base, saisonenden: 0, tiefeWinter: 1 }, 1000).chapters.obstwiese.openedAt).toBe(1000)
  })

  it('garden bonus of the chapters waits for the first Tiefer Winter', () => {
    const early = grown(syncChaptersOpen({ ...base, saisonenden: 5 }, 1000))
    expect(chapterBonusActive(early)).toBe(false)
    expect(expansionGardenMult(early)).toBe(1)
    const after = { ...early, tiefeWinter: 1 }
    expect(chapterBonusActive(after)).toBe(true)
    expect(expansionGardenMult(after)).toBeCloseTo(1 + 0.004 * 100, 6)
    expect(chapterBonusActive({ tiefeWinter: 0, generation: 1 })).toBe(true)
  })

  it('texts name the same garden year in both languages', () => {
    const year = String(OBSTWIESE.fromSeasons + 1)
    for (const s of [de, en]) {
      expect(s.chapters.obstwiese.teaser).toContain(year)
      expect(s.orchard.teaser).toContain(year)
      expect(s.collections.chapterFirst).toContain(year)
    }
  })
})
