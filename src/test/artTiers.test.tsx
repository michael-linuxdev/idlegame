import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { CHAPTERS } from '../game/chapters'
import { DECOR } from '../game/decor'
import { GENERATORS } from '../game/generators'
import { RESIDENTS } from '../game/residents'
import { ART_REGISTRY } from '../theme/art/registry'
import { ChapterReady } from '../theme/ChapterArt'
import { DecorArt } from '../theme/DecorArt'
import { MapBackdrop } from '../theme/MapBackdrop'
import { ModuleArt } from '../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { ResidentArt } from '../theme/ResidentArt'
import { TIER_LEVELS } from '../theme/tiers'
import { WinterScene } from '../theme/WinterScene'
import { SEASONS, chapterAreaHtml, checkPaths, parsePath } from './artRender'

const SHAPES = /<(path|circle|ellipse|rect|line|polygon|polyline|use|text)\b/g
const count = (html: string) => (html.match(SHAPES) ?? []).length
/**
 * Rendert alle Kapitel-Grafiken im Sommer: wächst mit jeder Welle, auf CI langsamer.
 * Frühling/Herbst/Winter prüft artSeasons.test.tsx (eigene Datei, läuft parallel).
 */
const HEAVY = 60_000

describe('Grafik: jede Stufe wächst sichtbar', () => {
  it('Hauptgarten: Stufe 1–5 liefern ein SVG, Stufe n+1 hat mehr Elemente als n', () => {
    for (const g of GENERATORS) {
      const counts = TIER_LEVELS.map((lv) => {
        const html = renderToStaticMarkup(<ModuleArt id={g.id} level={lv} />)
        expect(html, `${g.id} Stufe ${lv}`).toMatch(/^<svg/)
        return count(html)
      })
      for (let i = 1; i < counts.length; i++) expect(counts[i], `${g.id}: ${counts.join(' → ')}`).toBeGreaterThan(counts[i - 1]!)
    }
  })

  it('Kapitel: jede Stufe liefert ein SVG und hat mehr Elemente als die vorige', () => {
    for (const c of CHAPTERS) {
      for (const a of c.areas) {
        const counts = TIER_LEVELS.map((lv) => {
          const html = chapterAreaHtml(c.id, a.id, lv, 'summer')
          expect(html, `${c.id}/${a.id} Stufe ${lv}`).toContain('<svg')
          return count(html)
        })
        for (let i = 1; i < counts.length; i++) expect(counts[i], `${c.id}/${a.id}: ${counts.join(' → ')}`).toBeGreaterThan(counts[i - 1]!)
      }
    }
  }, HEAVY)
})

describe('Grafik: alle d-Attribute lassen sich parsen', () => {
  it('Parser erkennt Fehler', () => {
    expect(parsePath('M0 0 L10 10 Z')).toBeNull()
    expect(parsePath('M1.5-2l.5.5h3v-4q1 2 3 4c1 1 2 2 3 3s1 1 2 2a5 5 0 1 0 10 0z')).toBeNull()
    expect(parsePath('M0 0 L10')).not.toBeNull()
    expect(parsePath('M0 0 LNaN 4')).not.toBeNull()
    expect(parsePath('M0 0 Lundefined 4')).not.toBeNull()
    expect(parsePath('L0 0')).not.toBeNull()
  })

  it('jede gerenderte Grafik hat gültige Pfade (Hauptgarten, Deko, Kapitel im Sommer)', () => {
    const html: string[] = []
    for (const g of GENERATORS) {
      html.push(renderToStaticMarkup(<WildPlot id={g.id} />))
      for (const lv of TIER_LEVELS) html.push(renderToStaticMarkup(<ModuleArt id={g.id} level={lv} producing />))
    }
    html.push(renderToStaticMarkup(<ClearedPlot />), renderToStaticMarkup(<WinterScene />))
    for (const c of CHAPTERS) {
      const { wild: Wild, ready: Ready, backdrop: Backdrop } = ART_REGISTRY[c.id]
      html.push(renderToStaticMarkup(<Wild seed={3} />), renderToStaticMarkup(<Ready />), renderToStaticMarkup(<Backdrop stage={5} />))
      for (const a of c.areas) for (const lv of TIER_LEVELS) html.push(chapterAreaHtml(c.id, a.id, lv, 'summer'))
    }
    for (const d of DECOR) for (const season of SEASONS) html.push(renderToStaticMarkup(<DecorArt id={d.id} season={season} />))
    for (const r of RESIDENTS) html.push(renderToStaticMarkup(<ResidentArt id={r.id} />))
    for (const season of SEASONS) html.push(renderToStaticMarkup(<MapBackdrop stage={10} ambient={{ season, daypart: 'night' }} skin="skin-wiese" />))
    const { n, bad } = checkPaths(html)
    expect(n).toBeGreaterThan(1000)
    expect(bad).toEqual([])
  }, HEAVY)
})

// Aus art.test.tsx hierher verlegt: nutzt dieselben Sommer-Zeichnungen (Zwischenspeicher)
describe('ART_REGISTRY', () => {
  const readyHtml = renderToStaticMarkup(<ChapterReady />)
  it('jedes Kapitel hat einen vollständigen Eintrag', () => {
    for (const c of CHAPTERS) {
      const e = ART_REGISTRY[c.id]
      expect(e, c.id).toBeDefined()
      const { wild: Wild, ready: Ready, backdrop: Backdrop } = e
      expect(renderToStaticMarkup(<Wild seed={2} />), `${c.id} wild`).toContain('<svg')
      expect(renderToStaticMarkup(<Ready />), `${c.id} ready`).toContain('<svg')
      expect(renderToStaticMarkup(<Backdrop stage={3} />), `${c.id} backdrop`).toContain('<svg')
      for (const a of c.areas) {
        for (const lv of TIER_LEVELS) {
          const html = chapterAreaHtml(c.id, a.id, lv, 'summer')
          expect(html, `${c.id}/${a.id} Stufe ${lv}`).toContain('<svg')
          expect(html, `${c.id}/${a.id} fällt auf ChapterReady zurück`).not.toBe(readyHtml)
        }
      }
    }
  }, HEAVY) // alle Kapitel-Grafiken, wächst mit jeder Welle
})
