/**
 * Kapitel-Grafik in Frühling, Herbst und Winter (Sommer: artTiers.test.tsx;
 * eigene Datei, damit beide parallel laufen) und die Leistungsgrenze jeder
 * Kapitel-Karte.
 */
import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { ChapterCritters } from '../components/ChapterCritters'
import { CHAPTERS } from '../game/chapters'
import type { Daypart } from '../theme/ambient'
import { ART_REGISTRY } from '../theme/art/registry'
import { TIER_LEVELS } from '../theme/tiers'
import { SEASONS, chapterAreaHtml, checkPaths, svgElementCount } from './artRender'

const HEAVY = 60_000
const DAYPARTS = ['morning', 'day', 'evening', 'night'] as const satisfies readonly Daypart[]
/** Gleiche Grenze wie der Hauptgarten (scripts/e2e/art.mjs, MAX_ELEMENTS). */
const MAX_ELEMENTS = 2500
/**
 * Was die Karte außer der Grafik noch zeichnet: Sterne auf den zehn
 * Plaketten (je 3). Im Browser gemessen: `svg *` in der Karte = Kulisse +
 * Tierleben + Bereiche + 30 (docs/leistung.md).
 */
const MAP_EXTRA = 30

describe('Grafik: Kapitel in Frühling, Herbst und Winter', () => {
  it('jede Stufe liefert ein SVG mit gültigen Pfaden', () => {
    const html: string[] = []
    for (const c of CHAPTERS)
      for (const a of c.areas)
        for (const season of SEASONS) {
          if (season === 'summer') continue
          for (const lv of TIER_LEVELS) {
            const h = chapterAreaHtml(c.id, a.id, lv, season)
            expect(h, `${c.id}/${a.id} ${season} Stufe ${lv}`).toContain('<svg')
            html.push(h)
          }
        }
    const { n, bad } = checkPaths(html)
    expect(n).toBeGreaterThan(1000)
    expect(bad).toEqual([])
  }, HEAVY)
})

describe('Leistung: Kapitel-Karte', () => {
  it(`alle Bereiche auf Stufe 5: höchstens ${MAX_ELEMENTS} SVG-Elemente je Jahres- und Tageszeit`, () => {
    const over: string[] = []
    let max = 0
    for (const c of CHAPTERS) {
      const Backdrop = ART_REGISTRY[c.id].backdrop
      const backdrop = svgElementCount(renderToStaticMarkup(<Backdrop stage={c.areas.length} />))
      for (const season of SEASONS) {
        const areas = c.areas.reduce((sum, a) => sum + svgElementCount(chapterAreaHtml(c.id, a.id, TIER_LEVELS[4], season)), 0)
        for (const daypart of DAYPARTS) {
          const critters = svgElementCount(renderToStaticMarkup(<ChapterCritters chapter={c.id} daypart={daypart} season={season} />))
          const n = backdrop + areas + critters + MAP_EXTRA
          max = Math.max(max, n)
          if (n > MAX_ELEMENTS) over.push(`${c.number} ${c.id} ${daypart}-${season}: ${n}`)
        }
      }
    }
    expect(max).toBeGreaterThan(500)
    expect(over).toEqual([])
  }, HEAVY)
})
