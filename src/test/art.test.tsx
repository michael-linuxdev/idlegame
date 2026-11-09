/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { readFileSync, readdirSync } from 'node:fs'
import { renderToStaticMarkup } from 'react-dom/server'
import { GENERATORS } from '../game/generators'
import { ChapterReady, ChapterWild } from '../theme/ChapterArt'
import { HAND_ART_CHAPTERS } from '../theme/chapterArtSpecs'
import { ART_REGISTRY } from '../theme/art/registry'
import { CHAPTERS } from '../game/chapters'
import { ModuleArt } from '../theme/ModuleArt'
import { OrchardWild } from '../theme/OrchardArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { TIER_LEVELS, moduleTier, sameTierProps as same0 } from '../theme/tiers'
import { VineyardWild } from '../theme/VineyardArt'

const sameTierProps = (a: Record<string, unknown> & { level: number }, b: Record<string, unknown> & { level: number }) => same0(a, b)

describe('Grafik: Neuzeichnen nur bei Stufenwechsel', () => {
  it('gleiche Stufe, andere Level → kein Neuzeichnen', () => {
    expect(moduleTier(11)).toBe(moduleTier(24))
    expect(sameTierProps({ id: 'a', level: 11 }, { id: 'a', level: 24 })).toBe(true)
  })
  it('Stufenwechsel oder andere Prop → neu zeichnen', () => {
    expect(sameTierProps({ id: 'a', level: 24 }, { id: 'a', level: 25 })).toBe(false)
    expect(sameTierProps({ id: 'a', level: 30, season: 'summer' }, { id: 'a', level: 30, season: 'winter' })).toBe(false)
    expect(sameTierProps({ id: 'a', level: 30 }, { id: 'b', level: 30 })).toBe(false)
  })
})

describe('Grafik: dekorative SVGs sind für Screenreader unsichtbar', () => {
  it('alle Bereiche, Wildnis und Kapitel-Ecken tragen aria-hidden + focusable=false', () => {
    const html: string[] = []
    for (const g of GENERATORS) {
      html.push(renderToStaticMarkup(<WildPlot id={g.id} />))
      for (const lv of TIER_LEVELS) html.push(renderToStaticMarkup(<ModuleArt id={g.id} level={lv} producing />))
    }
    html.push(renderToStaticMarkup(<ClearedPlot />), renderToStaticMarkup(<ChapterReady />), renderToStaticMarkup(<ChapterWild />))
    html.push(renderToStaticMarkup(<OrchardWild />), renderToStaticMarkup(<VineyardWild />))
    for (const c of HAND_ART_CHAPTERS) {
      const Wild = ART_REGISTRY[c].wild
      html.push(renderToStaticMarkup(<Wild seed={1} />))
    }
    for (const h of html) {
      const tags = h.match(/<svg[^>]*>/g) ?? []
      expect(tags.length).toBeGreaterThan(0)
      for (const tag of tags) {
        expect(tag).toContain('aria-hidden="true"')
        expect(tag).toContain('focusable="false"')
      }
    }
  })
})

describe('CSS: @keyframes-Namen sind eindeutig', () => {
  it('kein Name wird in zwei Stylesheets oder doppelt definiert', () => {
    const files = (readdirSync('src', { recursive: true }) as string[])
      .filter((f) => f.endsWith('.css'))
      .map((f) => [f, readFileSync(`src/${f}`, 'utf8')] as const)
    const seen = new Map<string, string>()
    const dupes: string[] = []
    for (const [file, css] of files) {
      for (const m of css.matchAll(/@keyframes\s+([\w-]+)/g)) {
        const prev = seen.get(m[1]!)
        if (prev) dupes.push(`${m[1]} (${prev}, ${file})`)
        seen.set(m[1]!, file)
      }
    }
    expect(files.length).toBeGreaterThan(5)
    expect(dupes).toEqual([])
  })
})

describe('ART_REGISTRY', () => {
  const readyHtml = renderToStaticMarkup(<ChapterReady />)
  it('jedes Kapitel hat einen vollständigen Eintrag', () => {
    for (const c of CHAPTERS) {
      const e = ART_REGISTRY[c.id]
      expect(e, c.id).toBeDefined()
      const { area: Area, wild: Wild, ready: Ready, backdrop: Backdrop } = e
      expect(renderToStaticMarkup(<Wild seed={2} />), `${c.id} wild`).toContain('<svg')
      expect(renderToStaticMarkup(<Ready />), `${c.id} ready`).toContain('<svg')
      expect(renderToStaticMarkup(<Backdrop stage={3} />), `${c.id} backdrop`).toContain('<svg')
      for (const a of c.areas) {
        for (const lv of TIER_LEVELS) {
          const html = renderToStaticMarkup(<Area id={a.id} level={lv} season="summer" />)
          expect(html, `${c.id}/${a.id} Stufe ${lv}`).toContain('<svg')
          expect(html, `${c.id}/${a.id} fällt auf ChapterReady zurück`).not.toBe(readyHtml)
        }
      }
    }
  }, 60_000) // alle Kapitel-Grafiken, wächst mit jeder Welle
})
