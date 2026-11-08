import { describe, expect, it } from 'vitest'
import { DEEP_GATE_YEAR, canDeepReset, gateSeasons, sproutPayout } from '../game/longLoop'
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
      prestiges: DEEP_GATE_YEAR + 2,
      erbstuecke: 900,
      sproesslinge: 5,
      samen: 77,
      playerXp: 1234,
    }
    s.emberUpgrades = { ...s.emberUpgrades, dominionYield: 9 }
    s.deepUpgrades = { ...s.deepUpgrades, deepYield: 3, deepPurse: 2 }
    const n = doDeepReset(s)
    expect(n.prestiges).toBe(0)
    expect(n.emberUpgrades.dominionYield).toBe(0)
    expect(n.erbstuecke).toBe(120)
    expect(n.sproesslinge).toBe(5 + sproutPayout(DEEP_GATE_YEAR + 2))
    expect(n.deepPrestiges).toBe(1)
    expect(n.samen).toBeGreaterThanOrEqual(77)
    expect(n.playerXp).toBe(1234)
    expect(n.deepUpgrades.deepYield).toBe(3)
  })

  it('Tiefe Wurzeln multiply production; Gartenwissen opens gates earlier', () => {
    const a = createInitialState(0)
    const b = { ...a, deepUpgrades: { ...a.deepUpgrades, deepYield: 5 } }
    expect(productionPerSecond(b, 0) / productionPerSecond(a, 0)).toBeCloseTo(1.5, 5)
    expect(gateSeasons(2, { ...a.deepUpgrades, deepStart: 2 })).toBe(4)
  })

  it('unlocks the deep letter after the first Tiefer Winter', () => {
    const nb = unlockFor({ unlocked: ['welcome'], read: [], maxStage: 0 }, 0, 1, 1)
    expect(nb.unlocked).toContain('deep1')
  })
})
