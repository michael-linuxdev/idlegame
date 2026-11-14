import { describe, expect, it } from 'vitest'
import { DEEP_GATE_YEAR, DEEP_REST_MS, WINTERVORRAT, canDeepReset, deepRestLeft, gateSeasons, restCutCap, restMsFor, sproutPayout } from '../game/longLoop'
import { deepSproutPayout, wintervorratAfterSeasonEnd } from '../game/state/prestige'
import { createInitialState, doDeepReset, doPrestige, productionPerSecond } from '../game/state'
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
  const DAY = 86_400_000
  it('wächst am Anfang mit: 1 Tag, dann 2, ab dem dritten Tiefen Winter 3 Tage', () => {
    expect(restMsFor({ tiefeWinter: 1, generation: 0 })).toBe(DAY)
    expect(restMsFor({ tiefeWinter: 2, generation: 0 })).toBe(2 * DAY)
    expect(restMsFor({ tiefeWinter: 3, generation: 0 })).toBe(DEEP_REST_MS)
    expect(restMsFor({ tiefeWinter: 9, generation: 0 })).toBe(DEEP_REST_MS)
    // spätere Generationen: immer 3 Tage (Taktung der Kapitel 13–50 unverändert)
    expect(restMsFor({ tiefeWinter: 1, generation: 1 })).toBe(DEEP_REST_MS)
  })
  it('erlaubt den nächsten Tiefen Winter erst nach der Ruhezeit', () => {
    const t0 = Date.UTC(2026, 10, 9, 12)
    const ready = { ...createInitialState(t0), saisonenden: DEEP_GATE_YEAR + 2 }
    const first = doDeepReset(ready, t0)
    expect(first.tiefeWinter).toBe(1)
    expect(first.tieferWinterAt).toBe(t0)
    const again = { ...first, saisonenden: DEEP_GATE_YEAR + 2 }
    expect(doDeepReset(again, t0 + DAY - 60_000)).toBe(again)
    const second = doDeepReset(again, t0 + DAY)
    expect(second.tiefeWinter).toBe(2)
    const t1 = t0 + DAY
    const again2 = { ...second, saisonenden: DEEP_GATE_YEAR + 2 }
    expect(doDeepReset(again2, t1 + 2 * DAY - 60_000)).toBe(again2)
    const third = doDeepReset(again2, t1 + 2 * DAY)
    expect(third.tiefeWinter).toBe(3)
    const t2 = t1 + 2 * DAY
    const again3 = { ...third, saisonenden: DEEP_GATE_YEAR + 2 }
    expect(doDeepReset(again3, t2 + DEEP_REST_MS - 60_000)).toBe(again3)
    expect(deepRestLeft(third.tieferWinterAt, t2 + DEEP_REST_MS - 60_000)).toBe(60_000)
    expect(doDeepReset(again3, t2 + DEEP_REST_MS).tiefeWinter).toBe(4)
  })
  it('kürzere Ruhezeit: Verkürzung höchstens ein Sechstel', () => {
    expect(restCutCap(DEEP_REST_MS)).toBe(12 * 3600_000)
    expect(restCutCap(DAY)).toBe(4 * 3600_000)
    expect(deepRestLeft(1000, 1000, 99 * 3600_000, DAY)).toBe(DAY - 4 * 3600_000)
  })
  it('alte Spielstände ohne Zeitstempel ruhen nicht', () => {
    expect(deepRestLeft(0, Date.now())).toBe(0)
  })
})

describe('Wintervorrat', () => {
  const DAY = 86_400_000
  const t0 = Date.UTC(2026, 10, 9, 12)
  const afterDeep = () => doDeepReset({ ...createInitialState(t0), saisonenden: DEEP_GATE_YEAR + 2 }, t0)
  it('wächst je Saisonende in der Ruhezeit um 1, höchstens WINTERVORRAT.max', () => {
    let s = afterDeep()
    expect(s.wintervorrat).toBe(0)
    for (let i = 0; i < WINTERVORRAT.max + 3; i++) s = { ...s, wintervorrat: wintervorratAfterSeasonEnd(s, t0 + 3600_000) }
    expect(s.wintervorrat).toBe(WINTERVORRAT.max)
  })
  it('wächst nicht ohne laufende Ruhezeit', () => {
    const s = afterDeep()
    expect(wintervorratAfterSeasonEnd(s, t0 + 2 * DAY)).toBe(0)
    expect(wintervorratAfterSeasonEnd(createInitialState(t0), t0)).toBe(0)
  })
  it('zahlt der nächste Tiefe Winter zusätzlich aus und leert ihn', () => {
    const s = { ...afterDeep(), saisonenden: DEEP_GATE_YEAR + 2, wintervorrat: 4 }
    expect(deepSproutPayout(s)).toBe(sproutPayout(DEEP_GATE_YEAR + 2) + 4)
    const n = doDeepReset(s, t0 + DAY)
    expect(n.sproesslinge - s.sproesslinge).toBe(sproutPayout(DEEP_GATE_YEAR + 2) + 4)
    expect(n.wintervorrat).toBe(0)
  })
  it('bleibt über ein normales Saisonende erhalten', () => {
    const s = { ...afterDeep(), saisonenden: 3, ernteSeason: 1e30, wintervorrat: 2 }
    const n = doPrestige(s)
    if (n !== s) expect(n.wintervorrat).toBeGreaterThanOrEqual(2)
  })
})
