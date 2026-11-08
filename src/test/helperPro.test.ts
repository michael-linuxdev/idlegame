import { describe, expect, it } from 'vitest'
import { HELPER_RANKS, bestGardenBuy, createInitialState, helperIsPro, planGardenBuy, runHelper } from '../game/state'

describe('Profi-Jonas (letzte Stufe)', () => {
  const base = { ...createInitialState(0), prestiges: 20, helperOn: true }

  it('only the last rank is Profi', () => {
    expect(helperIsPro(HELPER_RANKS.length - 1)).toBe(false)
    expect(helperIsPro(HELPER_RANKS.length)).toBe(true)
  })

  it('ignores the Sperrliste', () => {
    const s = { ...base, helperLevel: HELPER_RANKS.length, helperBlocked: ['gemuesebeet' as const], owned: { ...base.owned, gemuesebeet: 10 }, ernte: 1e12 }
    const { state } = runHelper(s, 60_000)
    expect(state.owned.gemuesebeet).toBeGreaterThan(10)
  })

  it('goes for a close Meilenstein', () => {
    // everything planted; gemuesebeet is 3 levels short of ×2
    const all = Object.fromEntries(Object.keys(base.owned).map((k) => [k, 2000]))
    const s = { ...base, owned: { ...base.owned, ...all, gemuesebeet: 22 }, ernte: 1e300 }
    expect(planGardenBuy(s)).toBe('gemuesebeet')
  })

  it('plants a freshly unlocked area first', () => {
    const s = { ...base, owned: { ...base.owned, gemuesebeet: 40, kompost: 0 }, ernte: 1e15 }
    expect(planGardenBuy(s)).toBe('kompost')
  })

  it('saves up when the planned buy is only a short wait away', () => {
    const s = { ...base, owned: { ...base.owned, gemuesebeet: 24 }, ernte: 0 }
    expect(planGardenBuy(s)).toBeNull()
    expect(bestGardenBuy(s)).toBeNull()
  })
})
