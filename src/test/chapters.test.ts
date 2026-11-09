import { describe, expect, it } from 'vitest'
import { CHAPTERS, chapterDef, emptyChapters } from '../game/chapters'
import { createInitialState, syncChaptersOpen, type GameState } from '../game/state'
import { CHAPTER_ART } from '../theme/chapterArtSpecs'
import { strings } from '../i18n/de/strings'

describe('Kapitel 2–29', () => {
  it('are numbered 2…29 with ten unique areas each', () => {
    expect(CHAPTERS.map((c) => c.number)).toEqual([2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29])
    for (const c of CHAPTERS) {
      expect(c.areas).toHaveLength(10)
      expect(new Set(c.areas.map((a) => a.id)).size).toBe(10)
    }
  })

  it('every area has German copy and (for 4–12) an art spec', () => {
    for (const c of CHAPTERS) {
      const copy = c.id === 'obstwiese' ? strings.orchard.areas : (strings.chapters[c.id] as unknown as { areas: Record<string, { name: string }> }).areas
      for (const a of c.areas) {
        expect((copy as Record<string, { name: string }>)[a.id]?.name, `${c.id}.${a.id}`).toBeTruthy()
        if (c.number >= 4) expect(CHAPTER_ART[c.id]?.areas[a.id], `art ${c.id}.${a.id}`).toBeDefined()
      }
    }
  })

  it('open one after another: Generation N plus the previous chapter’s 8th area', () => {
    const base = createInitialState(0)
    const withEighth = (s: GameState, id: (typeof CHAPTERS)[number]['id']): GameState => {
      const def = chapterDef(id)
      const c = s.chapters[id]
      return { ...s, chapters: { ...s.chapters, [id]: { ...c, owned: { ...c.owned, [def.areas[7]!.id]: 1 } } } }
    }
    let s: GameState = { ...base, generation: 1, tiefeWinter: 1 }
    s = syncChaptersOpen(s, 1)
    expect(s.chapters.weinberg.openedAt).toBe(1)
    expect(s.chapters.bauernhof.openedAt).toBe(0)
    s = syncChaptersOpen(withEighth({ ...s, generation: 2 }, 'weinberg'), 2)
    expect(s.chapters.bauernhof.openedAt).toBe(2)
    expect(s.chapters.imkerei.openedAt).toBe(0)
    // Generation alone is not enough
    s = syncChaptersOpen({ ...s, generation: 10 }, 3)
    expect(s.chapters.imkerei.openedAt).toBe(0)
    for (const c of CHAPTERS.slice(2, -1)) s = syncChaptersOpen(withEighth(s, c.id), 4)
    expect(s.chapters.gartenschau.openedAt).toBe(4)
  })

  it('a save without new chapters gets them closed', () => {
    const all = emptyChapters()
    for (const c of CHAPTERS) expect(all[c.id].openedAt).toBe(0)
  })
})

describe('Kapitel-Pflege', () => {
  it('Wachsen erhöht den Ertrag, Sparen senkt die Kosten — dauerhaft, max. 10 Ränge', async () => {
    const { buyChapterCare, chapterCostOf, chapterPerSecond } = await import('../game/state')
    const base = createInitialState(0)
    let s: GameState = {
      ...base,
      chapters: { ...base.chapters, bauernhof: { ...base.chapters.bauernhof, openedAt: 1, cur: 1e9 } },
    }
    const rate0 = chapterPerSecond(s, 'bauernhof')
    const cost0 = chapterCostOf(s, 'bauernhof', 'kuhweide')
    s = buyChapterCare(s, 'bauernhof', 'kuhweide', 'grow')
    s = buyChapterCare(s, 'bauernhof', 'kuhweide', 'thrift')
    expect(chapterPerSecond(s, 'bauernhof')).toBeCloseTo(rate0 * 1.06)
    expect(chapterCostOf(s, 'bauernhof', 'kuhweide')).toBeLessThan(cost0)
    for (let i = 0; i < 20; i++) s = buyChapterCare(s, 'bauernhof', 'kuhweide', 'grow')
    expect(s.chapters.bauernhof.care.kuhweide!.grow).toBe(10)
    // unplanted area cannot be cared for
    expect(buyChapterCare(s, 'bauernhof', 'ziegenstall', 'grow')).toBe(s)
  })
})
