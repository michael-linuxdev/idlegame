import { describe, expect, it } from 'vitest'
import { DEEP_GATE_YEAR, DEEP_REST_MS, canDeepReset, deepRestLeft, gateSeasons, sproutPayout } from '../game/longLoop'
import { createInitialState, doDeepReset, productionPerSecond } from '../game/state'
import { unlockFor } from '../game/notebook'

describe('Tiefer Winter', () => {
  it('opens in Gartenjahr 15 and pays more the further you got', () => {
    expect(canDeepReset(DEEP_GATE_YEAR - 2)).toBe(false)
    expect(canDeepReset(DEEP_GATE_YEAR - 1)).toBe(true)
    expect(sproutPayout(DEEP_GATE_YEAR - 1)).toBeGreaterThan(0)
    expect(sproutPayout(DEEP_GATE_YEAR + 5)).toBeGreaterThan(sproutPayout(DEEP_GATE_YEAR))
  })

  it('resets years, Erbstücke and the Truhe but keeps Sprösslinge and boosts', () => {
    const s = {
      ...createInitialState(0),
      saisonenden: DEEP_GATE_YEAR + 2,
      erbstuecke: 900,
      sproesslinge: 5,
      samen: 77,
      playerXp: 1234,
    }
    s.truhe = { ...s.truhe, gartenschere: 9 }
    s.sproesslingLaden = { ...s.sproesslingLaden, tiefeWurzeln: 3, saatgutvorrat: 2 }
    const n = doDeepReset(s)
    expect(n.saisonenden).toBe(0)
    expect(n.truhe.gartenschere).toBe(0)
    expect(n.erbstuecke).toBe(120)
    expect(n.sproesslinge).toBe(5 + sproutPayout(DEEP_GATE_YEAR + 2))
    expect(n.tiefeWinter).toBe(1)
    expect(n.samen).toBeGreaterThanOrEqual(77)
    expect(n.playerXp).toBe(1234)
    expect(n.sproesslingLaden.tiefeWurzeln).toBe(3)
  })

  it('Tiefe Wurzeln multiply production; Gartenwissen opens gates earlier', () => {
    const a = createInitialState(0)
    const b = { ...a, sproesslingLaden: { ...a.sproesslingLaden, tiefeWurzeln: 5 } }
    expect(productionPerSecond(b, 0) / productionPerSecond(a, 0)).toBeCloseTo(1.5, 5)
    expect(gateSeasons(2, { ...a.sproesslingLaden, gartenwissen: 2 })).toBe(4)
  })

  it('unlocks the deep letter after the first Tiefer Winter', () => {
    const nb = unlockFor({ unlocked: ['welcome'], read: [], maxStage: 0 }, 0, 1, 1)
    expect(nb.unlocked).toContain('deep1')
  })
})

describe('Ruhezeit nach dem Tiefen Winter', () => {
  it('erlaubt den nächsten Tiefen Winter erst nach drei Tagen', () => {
    const t0 = Date.UTC(2026, 10, 9, 12)
    const ready = { ...createInitialState(t0), saisonenden: DEEP_GATE_YEAR + 2 }
    const first = doDeepReset(ready, t0)
    expect(first.tiefeWinter).toBe(1)
    expect(first.tieferWinterAt).toBe(t0)
    const again = { ...first, saisonenden: DEEP_GATE_YEAR + 2 }
    expect(doDeepReset(again, t0 + DEEP_REST_MS - 60_000)).toBe(again)
    expect(deepRestLeft(first.tieferWinterAt, t0 + DEEP_REST_MS - 60_000)).toBe(60_000)
    expect(doDeepReset(again, t0 + DEEP_REST_MS).tiefeWinter).toBe(2)
  })
  it('alte Spielstände ohne Zeitstempel ruhen nicht', () => {
    expect(deepRestLeft(0, Date.now())).toBe(0)
  })
})
