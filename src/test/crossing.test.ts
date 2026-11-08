import { describe, expect, it } from 'vitest'
import { CROSS_MISS_SAMEN, CROSS_MS, CROSS_SKIP_SAMEN, crossingUnlocked, hybridFor, hybridsMult } from '../game/crossing'
import { createInitialState, doPrestige, harvestCrossing, skipCrossing, startCrossing } from '../game/state'
import { parseSave } from '../game/storage'

describe('Saatgut kreuzen', () => {
  const base = { ...createInitialState(0), collection: ['radieschenEiszapfen', 'thymianZitrone', 'wurmhumus', 'johannisbeereRosetta', 'stachelbeereHinnonmaeki'], samen: 30 }
  it('opens with two garden sorts', () => {
    expect(crossingUnlocked(['radieschenEiszapfen'])).toBe(false)
    expect(crossingUnlocked(base.collection)).toBe(true)
  })
  it('area pair decides the Kreuzung (either order, same-area pairs too)', () => {
    expect(hybridFor('radieschenEiszapfen', 'thymianZitrone', [])).toBe('kraeutertomate')
    expect(hybridFor('thymianZitrone', 'radieschenEiszapfen', [])).toBe('kraeutertomate')
    expect(hybridFor('johannisbeereRosetta', 'stachelbeereHinnonmaeki', [])).toBe('jostabeere')
    expect(hybridFor('radieschenEiszapfen', 'thymianZitrone', ['kraeutertomate'])).toBeNull()
    expect(hybridFor('radieschenEiszapfen', 'radieschenEiszapfen', [])).toBeNull()
  })
  it('wait, skip, harvest', () => {
    let s = startCrossing(base, 'radieschenEiszapfen', 'thymianZitrone', 0)
    expect(s.crossing?.endsAt).toBe(CROSS_MS)
    expect(startCrossing(s, 'wurmhumus', 'thymianZitrone', 0)).toBe(s)
    expect(harvestCrossing(s, 1000).state).toBe(s)
    s = skipCrossing(s, 1000)
    expect(s.samen).toBe(30 - CROSS_SKIP_SAMEN)
    const r = harvestCrossing(s, 1000)
    expect(r.hybrid).toBe('kraeutertomate')
    expect(r.state.hybrids).toEqual(['kraeutertomate'])
    expect(hybridsMult(r.state.hybrids)).toBeCloseTo(1.02)
    const miss = harvestCrossing(startCrossing(r.state, 'radieschenEiszapfen', 'thymianZitrone', 0), CROSS_MS)
    expect(miss.hybrid).toBeNull()
    expect(miss.state.samen).toBe(r.state.samen + CROSS_MISS_SAMEN)
  })
  it('only found sorts; survives Saisonende; old saves load empty', () => {
    expect(startCrossing(base, 'radieschenEiszapfen', 'feigeBrunswick', 0)).toBe(base)
    const s = { ...startCrossing(base, 'radieschenEiszapfen', 'thymianZitrone', 0), hybrids: ['jostabeere' as const], ernteSeason: 1e40 }
    const p = doPrestige(s)
    expect(p.hybrids).toEqual(['jostabeere'])
    expect(p.crossing).not.toBeNull()
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.hybrids
    delete raw.crossing
    expect(parseSave(raw)?.hybrids).toEqual([])
    expect(parseSave(raw)?.crossing).toBeNull()
  })
})
