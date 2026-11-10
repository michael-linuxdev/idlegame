import { describe, expect, it } from 'vitest'
import { CARD_AUSBAU, cardCostMult, cardPreview, cardSaving, offerSeasonCards, SEASON_CARDS, SEASON_CARDS_FROM_PRESTIGES, spendShares } from '../game/seasonCards'
import { createInitialState, createPostPrestigeState, lineCostMult, pickSeasonCard, productionPerSecond } from '../game/state'
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

describe('Ausbau statt Ertrag (Runde 4)', () => {
  const owned = { gemuesebeet: 80, kompost: 70, kraeuterspirale: 60, beerenhecke: 50, obstwiese: 40, bienenstock: 30, huehnerstall: 20 }

  it('Bereichs-Karte: Ausbau des Bereichs billiger, des Gegenspielers teurer, Ertrag unverändert', () => {
    const base = { ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned } }
    const card = { ...base, seasonCard: 'kraeuterjahr' as const, seasonCardAusbau: true }
    expect(lineCostMult(card, 'kraeuterspirale') / lineCostMult(base, 'kraeuterspirale')).toBeCloseTo(1 - CARD_AUSBAU.discount, 10)
    expect(lineCostMult(card, 'gemuesebeet') / lineCostMult(base, 'gemuesebeet')).toBeCloseTo(1 + CARD_AUSBAU.surcharge, 10)
    expect(lineCostMult(card, 'kompost')).toBe(lineCostMult(base, 'kompost'))
    expect(productionPerSecond(card, NOW)).toBe(productionPerSecond(base, NOW))
  })

  it('eine schon laufende Karte (vor dem Update gewählt) wirkt wie vorher', () => {
    const base = { ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned } }
    const old = { ...base, seasonCard: 'kraeuterjahr' as const, seasonCardAusbau: false }
    expect(cardCostMult('kraeuterjahr', 'kraeuterspirale', false)).toBe(1)
    expect(productionPerSecond(old, NOW) / productionPerSecond(base, NOW)).toBeCloseTo(cardPreview('kraeuterjahr', base.owned), 6)
    const raw = { ...(parseSave({})! as unknown as Record<string, unknown>), seasonCard: 'kraeuterjahr' }
    delete (raw as Record<string, unknown>).seasonCardAusbau
    expect(parseSave(raw)!.seasonCardAusbau).toBe(false)
  })

  it('Angebot: Ersparnis aus den Ausbaukosten der letzten Saison, nur Karten, die etwas bringen; Wählen merkt sich die Regel', () => {
    const sh = spendShares(owned)
    const sum = [...sh.values()].reduce((a, b) => a + b, 0)
    expect(sum).toBeCloseTo(1, 10)
    expect(cardSaving('kraeuterjahr', owned)).toBeCloseTo(CARD_AUSBAU.discount * sh.get('kraeuterspirale')! - CARD_AUSBAU.surcharge * sh.get('gemuesebeet')!, 10)
    for (let i = 0; i < 30; i++) {
      for (const o of offerSeasonCards(owned, null)) {
        const def = SEASON_CARDS.find((c) => c.id === o.id)!
        if (!def.area) continue
        expect(o.ausbau).toBe(true)
        expect(o.preview).toBeGreaterThanOrEqual(CARD_AUSBAU.minPreview)
        expect(o.preview).toBeCloseTo(1 / (1 - cardSaving(o.id, owned)), 10)
      }
    }
    const s = { ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned }, saisonenden: SEASON_CARDS_FROM_PRESTIGES }
    const after = createPostPrestigeState(s, NOW)
    const area = after.seasonCardOffer.find((o) => o.ausbau)
    if (area) expect(pickSeasonCard(after, area.id).seasonCardAusbau).toBe(true)
    const flat = after.seasonCardOffer.find((o) => !o.ausbau)
    if (flat) expect(pickSeasonCard(after, flat.id).seasonCardAusbau).toBe(false)
  })
})
