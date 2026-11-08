import { describe, expect, it } from 'vitest'
import { CHAPTERS } from '../game/chapters'
import { GENERATORS } from '../game/generators'
import { CARE_NAMES } from '../theme/careNames'

describe('Pflege-Namen je Bereich', () => {
  it('every garden and chapter area has its own pair', () => {
    const ids = [...GENERATORS.map((g) => g.id), ...CHAPTERS.flatMap((c) => c.areas.map((a) => a.id))]
    const missing = ids.filter((id) => !CARE_NAMES[id])
    expect(missing).toEqual([])
    for (const id of ids) expect(CARE_NAMES[id]![0]).not.toBe(CARE_NAMES[id]![1])
  })
  it('no fertilising or mulching for animals and buildings', () => {
    const noSoil = ['bienenstock', 'huehnerstall', 'hofladen', 'schafe', 'kuhweide', 'ziegenstall', 'schweinekoben', 'gaensewiese', 'bienenhaus', 'kuhherde', 'karpfenteich', 'koiteich', 'kaesekeller', 'melkhaus', 'destille']
    for (const id of noSoil) {
      expect(CARE_NAMES[id]!.join(' ')).not.toMatch(/Düng|Mulch/)
    }
  })
})
