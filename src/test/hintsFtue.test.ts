import { describe, expect, it } from 'vitest'
import { HINT_ORDER, pickHint } from '../game/hints'
import { FTUE_STEP_BEATS, ftueStepIndex, nextBeat } from '../game/ftue'

describe('Omas Hinweise', () => {
  it('nimmt den ersten offenen, noch nicht gesehenen Hinweis in fester Reihenfolge', () => {
    const [a, b] = HINT_ORDER
    expect(pickHint({}, [])).toBeNull()
    expect(pickHint({ [a!]: true, [b!]: true }, [])).toBe(a)
    expect(pickHint({ [a!]: true, [b!]: true }, [a!])).toBe(b)
  })
})

describe('Erste Schritte (FTUE)', () => {
  it('Schritte laufen der Reihe nach bis „done“', () => {
    let beat = FTUE_STEP_BEATS[0]!
    for (let i = 1; i < FTUE_STEP_BEATS.length; i++) {
      beat = nextBeat(beat)
      expect(beat).toBe(FTUE_STEP_BEATS[i])
    }
    expect(nextBeat(beat)).toBe('done')
    expect(nextBeat('done')).toBe('done')
  })
  it('zählt die Schritte für die Anzeige', () => {
    expect(ftueStepIndex(FTUE_STEP_BEATS[0]!)).toEqual({ step: 1, total: FTUE_STEP_BEATS.length })
  })
})
