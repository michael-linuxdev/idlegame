/**
 * Runde 4, Paket 4: Jeder Bogen spielt sich anders. Je Bogen: neutraler Start
 * (= heutiger Ertrag, auch für alle Fixtures), Deckel, Wahl ändern, offline wie
 * online (Bogen IV: offline genau mit seinem Faktor), keine Wirkung auf
 * Garten-Bonus, Samen oder Freischaltung.
 */
import { describe, expect, it } from 'vitest'
import { ARC_RULE_CAP, PATE, PLAN, TAUSCH, WASSER, arcOf, arcRateMult, bestChoice, normalizeChoice } from '../game/arcRules'
import { CHAPTERS, chapterDef, chaptersGardenMult, type ChapterId } from '../game/chapters'
import { parseSave } from '../game/storage'
import {
  applyOfflineCatchup,
  buyChapterArea,
  buyChapterCare,
  chapterAreaRates,
  chapterCareCostOf,
  chapterCostOf,
  chapterPerSecond,
  chooseArcRule,
  type GameState,
} from '../game/state'
import { fixtureStates, NOW } from './noWorse/core'

const ARCS: { arc: 'I' | 'II' | 'III' | 'IV'; id: ChapterId; choices: string[] }[] = [
  { arc: 'I', id: 'stadtgarten', choices: [] },
  { arc: 'II', id: 'cottagegarten', choices: ['ertrag', 'ausbau', 'pflege'] },
  { arc: 'III', id: 'andenkartoffeln', choices: [] },
  { arc: 'IV', id: 'dachgarten', choices: ['heute', 'morgen'] },
]

const late = () => parseSave(fixtureStates()['v1-spaet']!)!

function allChoices(s: GameState, id: ChapterId): string[] {
  const def = chapterDef(id)
  const arc = arcOf(def.number)
  if (arc === 'I') return def.areas.map((a) => a.id)
  if (arc === 'II') return ['ertrag', 'ausbau', 'pflege']
  if (arc === 'IV') return ['heute', 'morgen']
  const best = bestChoice(def, chapterAreaRates(def, s.chapters[id]))!
  return [best, '2,2,2,0,0,0,0,0,0,0', '0,0,0,0,0,0,0,2,2,2', '1,1,1,1,1,1,0,0,0,0']
}

describe('Bögen 13–49', () => {
  it('jeder Bogen hat seine Regel, Kapitel 2–12 und 50 keine', () => {
    for (const def of CHAPTERS) {
      const expected = def.number >= 13 && def.number <= 19 ? 'I' : def.number <= 29 && def.number >= 20 ? 'II' : def.number >= 30 && def.number <= 39 ? 'III' : def.number >= 40 && def.number <= 49 ? 'IV' : null
      expect(arcOf(def.number), def.id).toBe(expected)
    }
  })
})

for (const { arc, id } of ARCS) {
  describe(`Bogen ${arc} (${id})`, () => {
    it('neutraler Start: ohne Wahl exakt der heutige Ertrag (alle Fixtures, online und offline)', () => {
      for (const [name, raw] of Object.entries(fixtureStates())) {
        const s = parseSave(raw)!
        expect(s.bogenWahl, name).toEqual({})
        for (const def of CHAPTERS) {
          const plain = chapterPerSecond({ ...s, bogenWahl: {} }, def.id)
          expect(chapterPerSecond(s, def.id), `${name} ${def.id}`).toBe(plain)
          expect(chapterPerSecond(s, def.id, true), `${name} ${def.id} offline`).toBe(plain)
        }
      }
    })

    it(`Deckel: jede Wahl wirkt nur nach oben, höchstens ×${ARC_RULE_CAP}`, () => {
      const s = late()
      const base = chapterPerSecond(s, id)
      for (const choice of allChoices(s, id)) {
        const withRule = chooseArcRule(s, id, choice)
        expect(withRule.bogenWahl[id], choice).toBe(normalizeChoice(chapterDef(id), choice))
        for (const away of [false, true]) {
          const r = chapterPerSecond(withRule, id, away)
          expect(r, `${choice} ${away}`).toBeGreaterThanOrEqual(base)
          expect(r / base, `${choice} ${away}`).toBeLessThanOrEqual(ARC_RULE_CAP + 1e-12)
        }
      }
      // Rand: alles auf die stärksten Bereiche — gedeckelt
      const def = chapterDef(id)
      const rates = def.areas.map((_, k) => (k < 2 ? 1000 : 1))
      for (const choice of allChoices(s, id)) expect(arcRateMult(def, rates, choice)).toBeLessThanOrEqual(ARC_RULE_CAP)
    })

    it('Wahl ändern und aufheben', () => {
      const s = late()
      const choices = allChoices(s, id)
      let t = chooseArcRule(s, id, choices[0]!)
      t = chooseArcRule(t, id, choices[1]!)
      expect(t.bogenWahl[id]).toBe(normalizeChoice(chapterDef(id), choices[1]!))
      t = chooseArcRule(t, id, null)
      expect(t.bogenWahl[id]).toBeUndefined()
      expect(chapterPerSecond(t, id)).toBe(chapterPerSecond(s, id))
      // Ungültiges ändert nichts
      expect(chooseArcRule(s, id, 'gibtsnicht')).toBe(s)
    })

    it('kein Garten-Bonus, keine Samen, keine Freischaltung', () => {
      const s = late()
      for (const choice of allChoices(s, id)) {
        const t = chooseArcRule(s, id, choice)
        expect(chaptersGardenMult(t.chapters)).toBe(chaptersGardenMult(s.chapters))
        expect(t.samen).toBe(s.samen)
        expect(t.chapters).toBe(s.chapters)
        for (const def of CHAPTERS) expect(def.unlock(t), def.id).toBe(def.unlock(s))
      }
    })
  })
}

describe('Bogen I: Patenbeet', () => {
  it('die Nachbarn tragen mehr, das Patenbeet selbst nicht', () => {
    const def = chapterDef('stadtgarten')
    const rates = def.areas.map(() => 10)
    const m = arcRateMult(def, rates, def.areas[4]!.id)
    // zwei von zehn Bereichen ×1,5 → +10 %
    expect(m).toBeCloseTo(1 + (2 * (PATE.neighbourMult - 1)) / 10, 10)
    // Rand: nur ein Nachbar
    expect(arcRateMult(def, rates, def.areas[0]!.id)).toBeCloseTo(1 + (PATE.neighbourMult - 1) / 10, 10)
  })
})

describe('Bogen II: Tauschpost', () => {
  it('Ausbau günstiger ab Stufe 1, Anlegen kostet gleich; Pflege günstiger', () => {
    const s = late()
    const id: ChapterId = 'cottagegarten'
    const def = chapterDef(id)
    const planted = def.areas.find((a) => (s.chapters[id].owned[a.id] ?? 0) >= 1)!
    const t = chooseArcRule(s, id, 'ausbau')
    expect(chapterCostOf(t, id, planted.id) / chapterCostOf(s, id, planted.id)).toBeCloseTo(TAUSCH.ausbau.areaCost, 2)
    // ein noch nicht angelegter Bereich: gleich teuer
    const empty = { ...s, chapters: { ...s.chapters, [id]: { ...s.chapters[id], owned: { ...s.chapters[id].owned, [def.areas[9]!.id]: 0 } } } }
    const t2 = chooseArcRule(empty, id, 'ausbau')
    expect(chapterCostOf(t2, id, def.areas[9]!.id)).toBe(chapterCostOf(empty, id, def.areas[9]!.id))
    // Pflege: mit genug Währung kostet der nächste Rang weniger
    const rank = s.chapters[id].care?.[planted.id]?.grow ?? 0
    const full = chapterCareCostOf(s, id, planted, 'grow', rank)
    const cheap = chapterCareCostOf(chooseArcRule(s, id, 'pflege'), id, planted, 'grow', rank)
    expect(cheap / full).toBeCloseTo(TAUSCH.pflege.careCost, 2)
    // genau so viel Währung wie der günstige Preis: nur mit der Wahl reicht es
    const just = { ...s, chapters: { ...s.chapters, [id]: { ...s.chapters[id], cur: cheap } } }
    expect(buyChapterCare(just, id, planted.id, 'grow')).toBe(just)
    expect(buyChapterCare(chooseArcRule(just, id, 'pflege'), id, planted.id, 'grow').chapters[id].cur).toBe(0)
    // Ertrag
    expect(chapterPerSecond(chooseArcRule(s, id, 'ertrag'), id) / chapterPerSecond(s, id)).toBeCloseTo(TAUSCH.ertrag.rate, 10)
    // genau der günstige Preis reicht nur mit der Wahl
    const priceCheap = chapterCostOf(t, id, planted.id)
    const exact = { ...s, chapters: { ...s.chapters, [id]: { ...s.chapters[id], cur: priceCheap } } }
    expect(buyChapterArea(exact, id, planted.id)).toBe(exact)
    expect(buyChapterArea(chooseArcRule(exact, id, 'ausbau'), id, planted.id).chapters[id].owned[planted.id]).toBe((s.chapters[id].owned[planted.id] ?? 0) + 1)
  })
})

describe('Bogen III: Wasser verteilen', () => {
  it('feste Zahl Punkte, je Bereich begrenzt', () => {
    const def = chapterDef('andenkartoffeln')
    expect(normalizeChoice(def, '2,2,2,0,0,0,0,0,0,0')).toBe('2,2,2,0,0,0,0,0,0,0')
    expect(normalizeChoice(def, '3,0,0,0,0,0,0,0,0,0')).toBeNull() // > 2 je Bereich
    expect(normalizeChoice(def, '2,2,2,1,0,0,0,0,0,0')).toBeNull() // > 6 Punkte
    expect(normalizeChoice(def, '0,0,0,0,0,0,0,0,0,0')).toBeNull() // keine Punkte = keine Wahl
    const rates = def.areas.map(() => 10)
    expect(arcRateMult(def, rates, '1,0,0,0,0,0,0,0,0,0')).toBeCloseTo(1 + WASSER.perPoint / 10, 10)
  })
})

describe('Bogen IV: Plan für morgen', () => {
  it('„jetzt“ wirkt nur beim Spielen, „morgen“ nur auf die Abwesenheit — auch in der Offline-Ernte', () => {
    const s = late()
    const id: ChapterId = 'dachgarten'
    const base = chapterPerSecond(s, id)
    const jetzt = chooseArcRule(s, id, 'heute')
    const morgen = chooseArcRule(s, id, 'morgen')
    expect(chapterPerSecond(jetzt, id) / base).toBeCloseTo(PLAN.heute.online, 10)
    expect(chapterPerSecond(jetzt, id, true)).toBe(base)
    expect(chapterPerSecond(morgen, id)).toBe(base)
    expect(chapterPerSecond(morgen, id, true) / base).toBeCloseTo(PLAN.morgen.away, 10)
    // Offline-Ernte über 2 h
    const away = (x: GameState) => {
      const before = { ...x, lastSeen: NOW - 2 * 3600_000, ilseOn: false }
      return applyOfflineCatchup(before, NOW).state.chapters[id].cur - before.chapters[id].cur
    }
    expect(away(morgen) / away(s)).toBeCloseTo(PLAN.morgen.away, 6)
    expect(away(jetzt) / away(s)).toBeCloseTo(1, 6)
  })
})

describe('Spielstand', () => {
  it('nur gültige Wahlen bekannter Kapitel 13–49 überstehen das Laden', () => {
    const raw = {
      ...fixtureStates()['v1-spaet']!,
      bogenWahl: { stadtgarten: 'hochbeete', cottagegarten: 'ausbau', andenkartoffeln: '2,0,0,0,0,0,0,0,0,1', dachgarten: 'morgen', obstwiese: 'ertrag', omasgarten: 'heute', spreewald: 'gibtsnicht', fremd: 'x' },
    }
    expect(parseSave(raw)!.bogenWahl).toEqual({ stadtgarten: 'hochbeete', cottagegarten: 'ausbau', andenkartoffeln: '2,0,0,0,0,0,0,0,0,1', dachgarten: 'morgen' })
  })
})
