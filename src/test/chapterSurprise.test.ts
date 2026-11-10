import { afterEach, describe, expect, it, vi } from 'vitest'
import { chapterDef } from '../game/chapters'
import { OFFLINE_JACKPOT_BONUS, SURPRISE_MIN_GAP_MS } from '../game/surpriseJumps'
import { applyOfflineCatchup, buyChapterArea, chapterCostOf, createInitialState } from '../game/state'
import type { GameState } from '../game/state'

const now = 1_800_000_000_000
const area = chapterDef('obstwiese').areas[0].id

function orchardState(): GameState {
  const base = createInitialState(now)
  return {
    ...base,
    owned: { ...base.owned, gemuesebeet: 30 },
    lastSurpriseAt: 0,
    chapters: { ...base.chapters, obstwiese: { ...base.chapters.obstwiese, openedAt: 1, cur: 1e6, owned: { [area]: 3 } } },
  }
}

afterEach(() => vi.restoreAllMocks())

describe('Kapitel-Jackpots', () => {
  it('Ausbau im Kapitel kann einen Jackpot in Kapitel-Währung bringen', () => {
    vi.spyOn(Date, 'now').mockReturnValue(now)
    vi.spyOn(Math, 'random').mockReturnValue(0) // trifft immer
    const s = orchardState()
    const cost = chapterCostOf(s, 'obstwiese', area)
    const next = buyChapterArea(s, 'obstwiese', area, 'manual')
    expect(next.lastSurprise?.chapter).toBe('obstwiese')
    expect(next.lastSurprise?.kind).toBe('jackpot')
    const amount = next.lastSurprise!.amount
    expect(amount).toBeGreaterThan(0)
    expect(next.chapters.obstwiese.cur).toBeCloseTo(1e6 - cost + amount)
    expect(next.ernte).toBe(s.ernte)
    expect(next.lastSurpriseAt).toBe(now)
    // 5-s-Sperre wie im Garten
    const again = buyChapterArea(next, 'obstwiese', area, 'manual')
    expect(again.lastSurprise).toBe(next.lastSurprise)
  })

  it('kein Jackpot bei Mehrfachkauf, Ilse oder verfehltem Wurf', () => {
    vi.spyOn(Date, 'now').mockReturnValue(now + SURPRISE_MIN_GAP_MS)
    const s = orchardState()
    const rnd = vi.spyOn(Math, 'random').mockReturnValue(0)
    expect(buyChapterArea(s, 'obstwiese', area, 'bulk').lastSurprise).toBe(null)
    expect(buyChapterArea(s, 'obstwiese', area, 'helper').lastSurprise).toBe(null)
    rnd.mockReturnValue(0.99)
    expect(buyChapterArea(s, 'obstwiese', area, 'manual').lastSurprise).toBe(null)
  })

  it('„Über Nacht gewachsen“ gibt auch offenen Kapiteln +35 %', () => {
    const s = { ...orchardState(), lastSeen: now - 3 * 3600_000 }
    vi.spyOn(Math, 'random').mockReturnValue(0.99)
    const plain = applyOfflineCatchup(s, now).state.chapters.obstwiese.cur - 1e6
    vi.spyOn(Math, 'random').mockReturnValue(0)
    const lucky = applyOfflineCatchup(s, now)
    expect(lucky.state.lastSurprise?.kind).toBe('offlineJackpot')
    expect(lucky.state.chapters.obstwiese.cur - 1e6).toBeGreaterThan(plain * (1 + OFFLINE_JACKPOT_BONUS) * 0.99)
  })
})
