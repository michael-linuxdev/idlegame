/**
 * Runde 4, Paket 2, Punkt 4: Die „Heute“-Karte bündelt nur — das
 * Samen-Einkommen eines aktiven Spielers je Woche bleibt innerhalb ±10 % der
 * Faustregel aus docs/store/preise.md (500 Samen ≈ eine Woche, also 450–550).
 *
 * Gerechnet wird mit den echten Spielfunktionen, wo das geht (Gartenrunde,
 * Tagesrezept, Tagesgeschenk im Markt, Wochenplan-Werte). Nur zwei Posten
 * sind Annahmen über den Spieler: Hofladen-Bestellungen (12 je Woche, je
 * Bestellung der Mittelwert aus makeOrder) und der Rest aus Besuchern,
 * Sonnenfenster, Album und Kürbis (preise.md: 50–100, hier 60).
 */
import { describe, expect, it } from 'vitest'
import { RECIPE_NEED } from '../game/extrasCore'
import { WEEKLY_BONUS, WEEKLY_TASKS, makeOrder } from '../game/extras'
import { claimDailyOps, claimMarketGift, claimRecipe, createInitialState, syncRecipe, type GameState } from '../game/state'

const DAY = 86_400_000
const ORDERS_PER_WEEK = 12
const OTHER_PER_WEEK = 60

function activeWeek(): Record<string, number> {
  let s: GameState = {
    ...createInitialState(0),
    owned: { ...createInitialState(0).owned, gemuesebeet: 50, kompost: 40, kraeuterspirale: 30, beerenhecke: 20 },
  }
  const t0 = new Date(2026, 10, 9, 10).getTime() // Montag
  const got = { gartenrunde: 0, rezept: 0, geschenk: 0 }
  for (let d = 0; d < 7; d++) {
    const now = t0 + d * DAY
    let before = s.samen
    s = claimDailyOps(s, now)
    got.gartenrunde += s.samen - before
    s = syncRecipe(s, now)
    s = { ...s, recipe: { ...s.recipe, have: s.recipe.areas.map(() => RECIPE_NEED) } }
    before = s.samen
    s = claimRecipe(s, now)
    got.rezept += s.samen - before
    before = s.samen
    s = claimMarketGift(s, now)
    got.geschenk += s.samen - before
  }
  const wochenplan = WEEKLY_TASKS.reduce((n, x) => n + x.seeds, 0) + WEEKLY_BONUS.seeds
  let orderSeeds = 0
  for (let i = 0; i < 3000; i++) orderSeeds += makeOrder(i, 100, 0, 0).seeds
  const bestellungen = Math.round((orderSeeds / 3000) * ORDERS_PER_WEEK)
  return { ...got, wochenplan, bestellungen, rest: OTHER_PER_WEEK }
}

describe('Samen je Woche (aktiver Spieler) bleibt bei 450–550', () => {
  it('Summe innerhalb ±10 % von 500', () => {
    const parts = activeWeek()
    const sum = Object.values(parts).reduce((a, b) => a + b, 0)
    expect(sum, JSON.stringify(parts)).toBeGreaterThanOrEqual(450)
    expect(sum, JSON.stringify(parts)).toBeLessThanOrEqual(550)
  })

  it('die einzelnen Posten wie in preise.md', () => {
    const p = activeWeek()
    expect(p.wochenplan).toBe(128) // „~130“
    expect(p.rezept).toBe(84) // 12 je Tag
    // Tag 3 (25) und Tag 7 (40); dazu, was beim Abholen sonst anfällt (z. B. Gärtnerstufe)
    expect(p.gartenrunde).toBeGreaterThanOrEqual(65)
    expect(p.gartenrunde).toBeLessThanOrEqual(100)
    expect(p.bestellungen).toBeGreaterThanOrEqual(100)
    expect(p.bestellungen).toBeLessThanOrEqual(150)
  })
})
