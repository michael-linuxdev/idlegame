import { describe, expect, it } from 'vitest'
import { applyOfflineCatchup, claimOfflineReward, createInitialState, creditOfflinePending, doPrestige } from '../game/state'
import { parseSave } from '../game/storage'

describe('Ernte aus Abwesenheit', () => {
  const now = 1_800_000_000_000
  const base = { ...createInitialState(now - 3 * 3600_000), lastSeen: now - 3 * 3600_000 }
  const s = { ...base, owned: { ...base.owned, gemuesebeet: 40, kompost: 20 }, ernte: 100 }

  it('waits in the basket and is added on „Ernten“', () => {
    const { state, gained } = applyOfflineCatchup(s, now)
    expect(gained).toBeGreaterThan(0)
    expect(state.ernte).toBe(100)
    expect(state.offlinePending).toBeCloseTo(gained, 6)
    const claimed = claimOfflineReward(state, gained, now)
    expect(claimed.ernte).toBeGreaterThanOrEqual(100 + gained - 1e-6) // + possible level-up reward
    expect(claimed.offlinePending).toBe(0)
  })

  it('Jonas spends part of it; only the rest waits', () => {
    const withJonas = { ...s, prestiges: 1, helperLevel: 5, helperOn: true }
    const { state, gained } = applyOfflineCatchup(withJonas, now)
    expect(state.helperReport).toBeGreaterThan(0)
    expect(state.offlinePending).toBeLessThan(gained)
    expect(state.ernte).toBeLessThanOrEqual(100)
  })

  it('credit puts it straight into the wallet', () => {
    const st = { ...s, offlinePending: 50 }
    expect(creditOfflinePending(st).ernte).toBe(150)
  })

  it('old saves load with an empty basket; Saisonende empties it', () => {
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.offlinePending
    expect(parseSave(raw)?.offlinePending).toBe(0)
    expect(doPrestige({ ...s, offlinePending: 99, ernteSeason: 1e40 }).offlinePending).toBe(0)
  })
})
