import { describe, expect, it } from 'vitest'
import { getSaveBlock, setSaveBlock, subscribeSaveBlock } from '../game/saveGuard'

describe('Spielstand-Sperre', () => {
  it('meldet Änderungen; „neuerer Stand“ wird nie wieder aufgehoben', () => {
    const seen: unknown[] = []
    const off = subscribeSaveBlock((b) => seen.push(b))
    setSaveBlock('pending')
    setSaveBlock(null)
    expect(getSaveBlock()).toBeNull()
    setSaveBlock('newer')
    setSaveBlock(null)
    setSaveBlock('otherTab')
    expect(getSaveBlock()).toBe('newer')
    off()
    expect(seen).toEqual(['pending', null, 'newer'])
  })
})
