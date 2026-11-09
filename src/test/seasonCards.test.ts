import { describe, expect, it } from 'vitest'
import { cardPreview, offerSeasonCards, SEASON_CARDS, SEASON_CARDS_FROM_PRESTIGES } from '../game/seasonCards'
import { createInitialState, createPostPrestigeState, pickSeasonCard, productionPerSecond } from '../game/state'
import { parseSave } from '../game/storage'

const NOW = 1_800_000_000_000
const owned = { gemuesebeet: 60, kompost: 50, kraeuterspirale: 40, beerenhecke: 30 }

describe('Saison-Karten', () => {
  it('bietet 3 Karten an, nur für angelegte Bereiche, nie eine Falle, nie die vom Vorjahr', () => {
    for (let i = 0; i < 50; i++) {
      let seed = i + 1
      const rng = () => ((seed = (seed * 16807) % 2147483647) / 2147483647)
      const offer = offerSeasonCards(owned, 'kompostjahr', rng)
      expect(offer).toHaveLength(3)
      expect(new Set(offer.map((o) => o.id)).size).toBe(3)
      for (const o of offer) {
        expect(o.id).not.toBe('kompostjahr')
        const def = SEASON_CARDS.find((c) => c.id === o.id)!
        if (def.area) expect((owned as Record<string, number>)[def.area.boost] ?? 0).toBeGreaterThan(0)
        if (o.id !== 'ruhigesJahr') expect(o.preview).toBeGreaterThanOrEqual(1)
      }
    }
  })

  it('Vorschau stimmt mit der echten Ernte überein', () => {
    const base = { ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned } }
    const without = productionPerSecond(base, NOW)
    const withCard = productionPerSecond({ ...base, seasonCard: 'tomatenjahr' }, NOW)
    expect(withCard / without).toBeCloseTo(cardPreview('tomatenjahr', base.owned), 6)
  })

  it('erst ab Gartenjahr 4, gilt genau ein Jahr', () => {
    const s = { ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned } }
    expect(createPostPrestigeState({ ...s, saisonenden: SEASON_CARDS_FROM_PRESTIGES - 2 }, NOW).seasonCardOffer).toEqual([])
    const after = createPostPrestigeState({ ...s, saisonenden: SEASON_CARDS_FROM_PRESTIGES - 1 }, NOW)
    expect(after.seasonCardOffer.length).toBe(3)
    const picked = pickSeasonCard(after, after.seasonCardOffer[0].id)
    expect(picked.seasonCard).toBe(after.seasonCardOffer[0].id)
    expect(picked.seasonCardOffer).toEqual([])
    // nur Karten aus dem Angebot
    expect(pickSeasonCard(after, 'hofladenjahr' as never).seasonCard ?? null).toBe(
      after.seasonCardOffer.some((o) => o.id === 'hofladenjahr') ? 'hofladenjahr' : null,
    )
    // nächstes Saisonende: Karte endet, wird „Vorjahr“
    const next = createPostPrestigeState({ ...picked, saisonenden: picked.saisonenden + 1 }, NOW)
    expect(next.seasonCard).toBeNull()
    expect(next.lastSeasonCard).toBe(picked.seasonCard)
    expect(next.seasonCardOffer.some((o) => o.id === picked.seasonCard)).toBe(false)
  })

  it('ohne Karte weiter geht immer', () => {
    const s = createPostPrestigeState({ ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned }, saisonenden: 5 }, NOW)
    const n = pickSeasonCard(s, null)
    expect(n.seasonCard).toBeNull()
    expect(n.seasonCardOffer).toEqual([])
  })

  it('Spielstand behält Karte und Angebot; ältere Stände starten ohne', () => {
    const s = { ...createInitialState(NOW), seasonCard: 'beerenjahr' as const, lastSeasonCard: 'tomatenjahr', seasonCardOffer: [{ id: 'gutesJahr' as const, preview: 1.05 }] }
    const back = parseSave(JSON.parse(JSON.stringify(s)))!
    expect(back.seasonCard).toBe('beerenjahr')
    expect(back.lastSeasonCard).toBe('tomatenjahr')
    expect(back.seasonCardOffer).toEqual([{ id: 'gutesJahr', preview: 1.05 }])
    const old = JSON.parse(JSON.stringify(createInitialState(NOW)))
    delete old.seasonCard
    delete old.seasonCardOffer
    delete old.lastSeasonCard
    const o = parseSave({ ...old, seasonCard: 'quatsch' })!
    expect(o.seasonCard).toBeNull()
    expect(o.seasonCardOffer).toEqual([])
  })
})
