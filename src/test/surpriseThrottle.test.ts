import { afterEach, describe, expect, it, vi } from 'vitest'
import { buyGenerator, createInitialState } from '../game/state'
import { SURPRISE_MIN_GAP_MS } from '../game/surpriseJumps'

const NOW = 1_800_000_000_000

function tapMany(prestiges: number, taps: number, everyMs: number) {
  let s = { ...createInitialState(NOW), prestiges, ernte: 1e30, ernteSeason: 1e6, owned: { ...createInitialState(NOW).owned, gemuesebeet: 10 } }
  let crumbs = 0
  for (let i = 0; i < taps; i++) {
    vi.setSystemTime(NOW + i * everyMs)
    s = buyGenerator(s, 'gemuesebeet')
    if (s.lastSurprise) {
      crumbs++
      s = { ...s, lastSurprise: null }
    }
  }
  return crumbs
}

describe('Überraschungs-Krümel', () => {
  afterEach(() => vi.useRealTimers())

  it('Schnelltippen bringt nach „Max“ höchstens einen Krümel je 5 s', () => {
    vi.useFakeTimers()
    // 400 Käufe im 150-ms-Takt = 60 s → höchstens 12 Krümel
    const crumbs = tapMany(2, 400, 150)
    expect(crumbs).toBeLessThanOrEqual(Math.ceil(60_000 / SURPRISE_MIN_GAP_MS))
    expect(crumbs).toBeGreaterThan(0)
  })

  it('vor „Max“ (Gartenjahr 1–2) bleibt alles wie bisher', () => {
    vi.useFakeTimers()
    // jeder 5. Kauf ist ein Meilenstein-Krümel
    expect(tapMany(0, 400, 150)).toBeGreaterThanOrEqual(80)
  })
})
