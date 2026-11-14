import { describe, expect, it } from 'vitest'
import { CARD_AUSBAU, CARD_SWITCH_MS, bestCardOffer, cardCostMult, cardPreview, cardSaving, offerSeasonCards, offerValue, SEASON_CARDS, SEASON_CARDS_FROM_PRESTIGES, spendShares, type CardOffer } from '../game/seasonCards'
import { canSwitchSeasonCard, createInitialState, createPostPrestigeState, lineCostMult, pickSeasonCard, productionPerSecond, switchSeasonCard } from '../game/state'
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

  it('Bereichs-Karte: nur der eigene Bereich billiger, kein Gegenspieler teurer (2026-11-14), Ertrag unverändert', () => {
    expect(CARD_AUSBAU.surcharge).toBe(0)
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

describe('Omas Tipp und Wechsel (2026-11-14)', () => {
  const offer: CardOffer[] = [
    { id: 'gutesJahr', preview: 1.05, ernte: 1e9 },
    { id: 'kraeuterjahr', preview: 1 / (1 - 0.12), ausbau: true, ernte: 1e9 },
    { id: 'ruhigesJahr', preview: 0.8, ernte: 1e9 },
  ]
  it('Tipp = was mit dem letzten Garten am meisten gebracht hätte, nie „Ruhiges Jahr“', () => {
    expect(offerValue(offer[1]!)).toBeCloseTo(0.12, 10)
    expect(bestCardOffer(offer)).toBe('kraeuterjahr')
    expect(bestCardOffer([offer[2]!])).toBeNull()
  })
  it('das Angebot kennt die Ernte der letzten Saison (für „≈ 1,2 Mrd gespart“)', () => {
    const s = { ...createInitialState(NOW), owned: { ...createInitialState(NOW).owned, ...owned }, saisonenden: SEASON_CARDS_FROM_PRESTIGES, ernteSeason: 5e8 }
    const after = createPostPrestigeState(s, NOW)
    expect(after.seasonCardOffer.length).toBeGreaterThan(0)
    for (const o of after.seasonCardOffer) expect(o.ernte).toBe(5e8)
    // älteres Angebot ohne Ernte lädt weiter
    const raw = { ...(parseSave({})! as unknown as Record<string, unknown>), seasonCardOffer: [{ id: 'gutesJahr', preview: 1.05 }] }
    expect(parseSave(raw)!.seasonCardOffer).toEqual([{ id: 'gutesJahr', preview: 1.05 }])
  })
  it('einmal wechseln in den ersten Minuten, nur zu einer angebotenen Karte', () => {
    const s = { ...createInitialState(NOW), seasonCardOffer: offer }
    const picked = pickSeasonCard(s, 'gutesJahr', NOW)
    expect(picked.seasonCardSwitchUntil).toBe(NOW + CARD_SWITCH_MS)
    expect(canSwitchSeasonCard(picked, NOW + 1000)).toBe(true)
    expect(switchSeasonCard(picked, 'tomatenjahr', NOW + 1000)).toBe(picked)
    const switched = switchSeasonCard(picked, 'kraeuterjahr', NOW + 1000)
    expect(switched.seasonCard).toBe('kraeuterjahr')
    expect(switched.seasonCardAusbau).toBe(true)
    expect(canSwitchSeasonCard(switched, NOW + 2000)).toBe(false)
    // zu spät
    expect(switchSeasonCard(picked, 'kraeuterjahr', NOW + CARD_SWITCH_MS)).toBe(picked)
    // auch nach „ohne Thema“ darf man noch wählen
    const skipped = pickSeasonCard(s, null, NOW)
    expect(switchSeasonCard(skipped, 'gutesJahr', NOW + 1000).seasonCard).toBe('gutesJahr')
  })
  it('das Saisonende schließt das Wechsel-Fenster', () => {
    const s = { ...createInitialState(NOW), seasonCardOffer: offer, saisonenden: SEASON_CARDS_FROM_PRESTIGES }
    const picked = pickSeasonCard(s, 'gutesJahr', NOW)
    const next = createPostPrestigeState(picked, NOW + 1000)
    expect(next.seasonCardChoices).toEqual([])
    expect(next.seasonCardSwitchUntil).toBe(0)
  })
})
