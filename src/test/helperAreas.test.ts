import { describe, expect, it } from 'vitest'
import { bestGardenBuy, createInitialState, runHelper, toggleHelperArea } from '../game/state'
import { parseSave } from '../game/storage'

describe('Jonas: Bereiche sperren', () => {
  const base = { ...createInitialState(0), prestiges: 1, helperLevel: 5, helperOn: true, ernte: 1e9 }
  const s = { ...base, owned: { ...base.owned, gemuesebeet: 10, kompost: 5 } }

  it('starts with nothing blocked', () => {
    expect(createInitialState(0).helperBlocked).toEqual([])
  })

  it('never builds a blocked area', () => {
    const blocked = toggleHelperArea(s, 'gemuesebeet')
    expect(blocked.helperBlocked).toEqual(['gemuesebeet'])
    const { state } = runHelper(blocked, 60_000)
    expect(state.owned.gemuesebeet).toBe(10)
    expect(bestGardenBuy(blocked, blocked.helperBlocked)).not.toBe('gemuesebeet')
    expect(toggleHelperArea(blocked, 'gemuesebeet').helperBlocked).toEqual([])
  })

  it('old saves load with nothing blocked; junk ids are dropped', () => {
    const raw = JSON.parse(JSON.stringify(s)) as Record<string, unknown>
    delete raw.helperBlocked
    expect(parseSave(raw)?.helperBlocked).toEqual([])
    raw.helperBlocked = ['kompost', 'quatsch']
    expect(parseSave(raw)?.helperBlocked).toEqual(['kompost'])
  })
})
