import { describe, expect, it } from 'vitest'
import { HELPER_RANKS, bestGardenBuy, buyHelper, createInitialState, helperIsPro, planGardenBuy, runHelper } from '../game/state'

describe('Profi-Jonas (letzte Stufe)', () => {
  const base = { ...createInitialState(0), saisonenden: 20, helperOn: true }

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

describe('Jonas-Preise je Ebene', () => {
  const base = { ...createInitialState(0), saisonenden: 3 }
  it('ranks 1–3 cost Erbstücke, 4 Sprösslinge, 5 Vermächtnis', () => {
    expect(HELPER_RANKS.map((r) => r.currency)).toEqual(['erbstuecke', 'erbstuecke', 'erbstuecke', 'sproesslinge', 'vermaechtnis'])
  })
  it('rank 4 needs Sprösslinge, not Erbstücke', () => {
    const s = { ...base, helperLevel: 3, erbstuecke: 1e9, sproesslinge: 0 }
    expect(buyHelper(s)).toBe(s)
    const ok = buyHelper({ ...s, sproesslinge: HELPER_RANKS[3]!.cost })
    expect(ok.helperLevel).toBe(4)
    expect(ok.sproesslinge).toBe(0)
    expect(ok.erbstuecke).toBe(1e9)
  })
  it('Profi needs Vermächtnis', () => {
    const s = { ...base, helperLevel: 4, vermaechtnis: HELPER_RANKS[4]!.cost }
    const ok = buyHelper(s)
    expect(ok.helperLevel).toBe(5)
    expect(ok.vermaechtnis).toBe(0)
  })
})
