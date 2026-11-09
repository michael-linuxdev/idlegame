import { describe, expect, it } from 'vitest'
import { FEATURES, featureStep, initialFeaturesSeen, openFeatures, usedFeatures, type FeatureCtx } from '../game/featureUnlocks'
import { countSession, createInitialState, SESSION_GAP_MS } from '../game/state'
import { parseSave } from '../game/storage'
import v1 from './fixtures/save-v1.json'

const fresh: FeatureCtx = {
  saisonenden: 0,
  tiefeWinter: 0,
  generation: 0,
  sessions: 1,
  owned: { gemuesebeet: 1 },
  collection: [],
  openChapters: 0,
}

describe('Systeme nach und nach freischalten', () => {
  it('erste Minuten: nichts außer dem Kern', () => {
    expect([...openFeatures(fresh)]).toEqual([])
  })

  it('Sitzung 1 mit Kompost: nur die Ereignis-Pillen, keine weiteren Systeme', () => {
    const open = openFeatures({ ...fresh, owned: { gemuesebeet: 20, kompost: 3 } })
    expect([...open]).toEqual(['events'])
  })

  it('danach etwa ein System pro Sitzung oder Gartenjahr', () => {
    const order = ['recipe', 'fest', 'weather', 'clan'] as const
    for (let step = 1; step <= 4; step++) {
      const bySession = openFeatures({ ...fresh, sessions: step + 1 })
      const byYear = openFeatures({ ...fresh, saisonenden: step })
      for (let i = 0; i < order.length; i++) {
        expect(bySession.has(order[i])).toBe(i < step)
        expect(byYear.has(order[i])).toBe(i < step)
      }
    }
  })

  it('Tiefer Winter / Generation: alles offen', () => {
    expect(featureStep({ ...fresh, tiefeWinter: 1 })).toBe(99)
    const open = openFeatures({ ...fresh, generation: 1 })
    for (const id of ['events', 'recipe', 'fest', 'weather', 'clan', 'decor', 'album'] as const) expect(open.has(id)).toBe(true)
  })

  it('jedes System steht genau einmal in der Liste', () => {
    const ids = FEATURES.map((f) => f.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})

describe('Sitzungszähler', () => {
  it('zählt erst nach 30 min Pause', () => {
    const s = createInitialState(0)
    expect(s.sessions).toBe(1)
    expect(countSession(s, 5 * 60_000).sessions).toBe(1)
    expect(countSession(s, SESSION_GAP_MS).sessions).toBe(2)
  })

  it('bestehende Spielstände bekommen den Zähler aus dem Fortschritt', () => {
    // Stand ohne Sitzungszähler, aber mit Saisonenden → alles bleibt sichtbar
    const { sessions: _drop, ...noSessions } = v1
    void _drop
    const a = parseSave(noSessions)!
    const b = parseSave({ owned: { gemuesebeet: 30 }, saisonenden: 2 })!
    expect(a.sessions).toBeGreaterThanOrEqual(5)
    expect(b.sessions).toBeGreaterThanOrEqual(5)
    const ctx = (s: typeof a): FeatureCtx => ({
      saisonenden: s.saisonenden,
      tiefeWinter: s.tiefeWinter,
      generation: s.generation,
      sessions: s.sessions,
      owned: s.owned,
      collection: s.collection,
      openChapters: 1,
    })
    for (const id of ['events', 'recipe', 'fest', 'weather', 'clan'] as const) {
      expect(openFeatures(ctx(a)).has(id)).toBe(true)
      expect(openFeatures(ctx(b)).has(id)).toBe(true)
    }
    // gespeicherter Zähler bleibt
    expect(parseSave({ ...v1, sessions: 3 })!.sessions).toBe(3)
  })

  it('Neu-Abzeichen: Veteranen kennen schon alles Offene, Neue starten leer', () => {
    expect(initialFeaturesSeen(fresh, null)).toEqual([])
    const vet = { ...fresh, saisonenden: 5, sessions: 10, owned: { kompost: 1 } }
    expect(initialFeaturesSeen(vet, null)).toEqual([...openFeatures(vet)])
    expect(initialFeaturesSeen(vet, ['decor'])).toEqual(['decor'])
  })
})

describe('Schon Benutztes bleibt offen', () => {
  it('Fest, Wetter, Verein, Rezept aus Spuren im Spielstand', () => {
    const s = createInitialState(0)
    const used = usedFeatures({ ...s, festBought: { boost: 1 }, weatherDecided: '2026-11-08', contestKg: 3, recipe: { ...s.recipe, dish: 2 } })
    const open = openFeatures({ ...fresh, used })
    for (const id of ['fest', 'weather', 'clan', 'recipe'] as const) expect(open.has(id)).toBe(true)
    expect(usedFeatures(s).size).toBe(0)
  })
})
