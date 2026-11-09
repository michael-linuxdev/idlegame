import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { GENERATORS } from '../game/generators'
import { ChapterReady, ChapterWild } from '../theme/ChapterArt'
import { HAND_ART_CHAPTERS } from '../theme/chapterArtSpecs'
import { HandWild } from '../theme/HandArt'
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
    for (const c of HAND_ART_CHAPTERS) html.push(renderToStaticMarkup(<HandWild chapter={c} />))
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
