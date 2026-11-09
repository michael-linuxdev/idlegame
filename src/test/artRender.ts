/**
 * Gemeinsame Bausteine der schweren Grafik-Tests (artTiers, artSeasons):
 * Kapitel-Grafiken werden je Testdatei nur einmal gezeichnet (Zwischenspeicher),
 * und jeder verschiedene Pfad wird nur einmal geprüft. Geprüft wird dasselbe
 * wie zuvor, nur ohne doppelte Arbeit.
 */
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import type { ChapterId } from '../game/chapters'
import type { Season } from '../theme/ambient'
import { ART_REGISTRY } from '../theme/art/registry'

export const SEASONS = ['spring', 'summer', 'autumn', 'winter'] as const satisfies readonly Season[]

const areaCache = new Map<string, string>()

/** Ein Kapitel-Bereich als SVG-Text (einmal je Datei gezeichnet). */
export function chapterAreaHtml(chapter: ChapterId, area: string, level: number, season: Season): string {
  const key = `${chapter}/${area}/${level}/${season}`
  let html = areaCache.get(key)
  if (html === undefined) {
    const Area = ART_REGISTRY[chapter].area
    html = renderToStaticMarkup(createElement(Area, { id: area, level, season }))
    areaCache.set(key, html)
  }
  return html
}

/**
 * Prüft einen SVG-Pfad streng: nur bekannte Befehle, Zahlen im richtigen
 * Format und je Befehl eine passende Anzahl Argumente (Vielfache erlaubt).
 */
const ARGS: Record<string, number> = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 }
export function parsePath(d: string): string | null {
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

/** Alle d-Attribute prüfen; gleiche Pfade (häufig über Stufen/Jahreszeiten) nur einmal parsen. */
export function checkPaths(html: readonly string[]): { n: number; bad: string[] } {
  const seen = new Map<string, string | null>()
  const bad: string[] = []
  let n = 0
  for (const h of html) {
    for (const m of h.matchAll(/\sd="([^"]*)"/g)) {
      n++
      const d = m[1]!
      let err = seen.get(d)
      if (err === undefined) {
        err = parsePath(d)
        seen.set(d, err)
      }
      if (err) bad.push(`${err}: ${d.slice(0, 60)}`)
    }
  }
  return { n, bad }
}

/** Anzahl der Elemente in SVGs (wie `svg *` im Browser; HTML außerhalb zählt nicht). */
export function svgElementCount(html: string): number {
  let n = 0
  for (const m of html.matchAll(/<svg\b[^>]*>([\s\S]*?)<\/svg>/g)) n += (m[1]!.match(/<[a-zA-Z]/g) ?? []).length
  return n
}
