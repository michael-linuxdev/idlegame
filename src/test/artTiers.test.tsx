import { describe, expect, it } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { CHAPTERS } from '../game/chapters'
import { DECOR } from '../game/decor'
import { GENERATORS } from '../game/generators'
import { RESIDENTS } from '../game/residents'
import { ART_REGISTRY } from '../theme/art/registry'
import { DecorArt } from '../theme/DecorArt'
import { MapBackdrop } from '../theme/MapBackdrop'
import { ModuleArt } from '../theme/ModuleArt'
import { ClearedPlot, WildPlot } from '../theme/PlotArt'
import { ResidentArt } from '../theme/ResidentArt'
import { TIER_LEVELS } from '../theme/tiers'
import { WinterScene } from '../theme/WinterScene'

const SHAPES = /<(path|circle|ellipse|rect|line|polygon|polyline|use|text)\b/g
const count = (html: string) => (html.match(SHAPES) ?? []).length
const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const
/** Rendert alle Kapitel-Grafiken: wächst mit jeder Welle, auf CI langsamer (Kapitel 13–50). */
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
      const Area = ART_REGISTRY[c.id].area
      for (const a of c.areas) {
        const counts = TIER_LEVELS.map((lv) => {
          const html = renderToStaticMarkup(<Area id={a.id} level={lv} season="summer" />)
          expect(html, `${c.id}/${a.id} Stufe ${lv}`).toContain('<svg')
          return count(html)
        })
        for (let i = 1; i < counts.length; i++) expect(counts[i], `${c.id}/${a.id}: ${counts.join(' → ')}`).toBeGreaterThan(counts[i - 1]!)
      }
    }
  }, HEAVY)
})

/**
 * Prüft einen SVG-Pfad streng: nur bekannte Befehle, Zahlen im richtigen
 * Format und je Befehl eine passende Anzahl Argumente (Vielfache erlaubt).
 */
const ARGS: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 }
function parsePath(d: string): string | null {
  const tokens = d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?|[^\s,]/g) ?? []
  if (!tokens.length) return 'leer'
  if (!/^[mM]$/.test(tokens[0]!)) return `beginnt nicht mit M: ${tokens[0]}`
  let i = 0
  while (i < tokens.length) {
    const cmd = tokens[i++]!
    const n = ARGS[cmd.toLowerCase()]
    if (n === undefined) return `unbekannter Befehl „${cmd}“`
    const args: string[] = []
    while (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i]!)) {
      const tk = tokens[i++]!
      if (!/^[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?$/.test(tk)) return `keine Zahl „${tk}“ nach ${cmd}`
      args.push(tk)
    }
    if (n === 0 ? args.length !== 0 : args.length === 0 || args.length % n !== 0) return `${cmd} mit ${args.length} Argumenten`
    if (cmd.toLowerCase() === 'a') {
      for (let k = 0; k < args.length; k += 7) if (!/^[01]$/.test(args[k + 3]!) || !/^[01]$/.test(args[k + 4]!)) return 'Bogen-Flags müssen 0/1 sein'
    }
  }
  return null
}

describe('Grafik: alle d-Attribute lassen sich parsen', () => {
  it('Parser erkennt Fehler', () => {
    expect(parsePath('M0 0 L10 10 Z')).toBeNull()
    expect(parsePath('M1.5-2l.5.5h3v-4q1 2 3 4c1 1 2 2 3 3s1 1 2 2a5 5 0 1 0 10 0z')).toBeNull()
    expect(parsePath('M0 0 L10')).not.toBeNull()
    expect(parsePath('M0 0 LNaN 4')).not.toBeNull()
    expect(parsePath('M0 0 Lundefined 4')).not.toBeNull()
    expect(parsePath('L0 0')).not.toBeNull()
  })

  it('jede gerenderte Grafik hat gültige Pfade', () => {
    const html: string[] = []
    for (const g of GENERATORS) {
      html.push(renderToStaticMarkup(<WildPlot id={g.id} />))
      for (const lv of TIER_LEVELS) html.push(renderToStaticMarkup(<ModuleArt id={g.id} level={lv} producing />))
    }
    html.push(renderToStaticMarkup(<ClearedPlot />), renderToStaticMarkup(<WinterScene />))
    for (const c of CHAPTERS) {
      const { area: Area, wild: Wild, ready: Ready, backdrop: Backdrop } = ART_REGISTRY[c.id]
      html.push(renderToStaticMarkup(<Wild seed={3} />), renderToStaticMarkup(<Ready />), renderToStaticMarkup(<Backdrop stage={5} />))
      for (const a of c.areas) for (const season of SEASONS) for (const lv of TIER_LEVELS) html.push(renderToStaticMarkup(<Area id={a.id} level={lv} season={season} />))
    }
    for (const d of DECOR) for (const season of SEASONS) html.push(renderToStaticMarkup(<DecorArt id={d.id} season={season} />))
    for (const r of RESIDENTS) html.push(renderToStaticMarkup(<ResidentArt id={r.id} />))
    for (const season of SEASONS) html.push(renderToStaticMarkup(<MapBackdrop stage={10} ambient={{ season, daypart: 'night' }} skin="skin-wiese" />))
    const bad: string[] = []
    let n = 0
    for (const h of html) {
      for (const m of h.matchAll(/\sd="([^"]*)"/g)) {
        n++
        const err = parsePath(m[1]!)
        if (err) bad.push(`${err}: ${m[1]!.slice(0, 60)}`)
      }
    }
    expect(n).toBeGreaterThan(1000)
    expect(bad).toEqual([])
  }, HEAVY)
})
