import { describe, expect, it } from 'vitest'
import { collectionPercent, collectionRows, nearSets } from '../game/collections'
import { GARDEN_VARIETIES } from '../game/gardenLife'
import { createInitialState } from '../game/state'

describe('Sammel-Übersicht', () => {
  it('leer = 0 %, alles = 100 %', () => {
    const s = createInitialState(0)
    expect(collectionPercent(collectionRows(s))).toBe(0)
    const rows = collectionRows(s).map((r) => ({ ...r, have: r.total }))
    expect(collectionPercent(rows)).toBe(100)
  })

  it('zählt Pflanzenbuch und findet fast fertige Sets', () => {
    const beet = GARDEN_VARIETIES.filter((v) => v.module === 'gemuesebeet').map((v) => v.id)
    const s = { ...createInitialState(0), collection: beet.slice(0, beet.length - 1) }
    const row = collectionRows(s).find((r) => r.key === 'pflanzenbuch')!
    expect(row.have).toBe(beet.length - 1)
    expect(nearSets(s.collection, 1)).toEqual([{ module: 'gemuesebeet', missing: 1 }])
    // fertige Sets und Sets ohne eine einzige Sorte zählen nicht als „fast“
    expect(nearSets(beet, 2).some((n) => n.module === 'gemuesebeet')).toBe(false)
    expect(nearSets([], 5)).toEqual([])
  })
})
