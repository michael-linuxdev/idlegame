/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { HEX, cssVar, type PaletteName } from '../theme/art/palette'
import { moodCss } from '../theme/art/mood'
import allow from '../theme/art/hex-allow.json'
import { readFileSync, readdirSync, writeFileSync } from 'node:fs'

const START = '/* —— Stimmung (generiert aus src/theme/art/mood.ts) —— */'
const END = '/* —— Ende Stimmung —— */'
const TONES = (readdirSync('src', { recursive: true }) as string[])
  .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
  .flatMap((f) => [...readFileSync(`src/${f}`, 'utf8').matchAll(/tone\('(#[0-9a-fA-F]{6})'\)/g)].map((m) => m[1]!))
let tokens = readFileSync('src/theme/tokens.css', 'utf8')
if (process.env.ART_MOOD_WRITE) {
  const block = `${START}\n${moodCss(TONES)}\n${END}`
  const i = tokens.indexOf(START)
  tokens = i >= 0 ? tokens.slice(0, i) + block + tokens.slice(tokens.indexOf(END) + END.length) : `${tokens.trimEnd()}\n\n${block}\n`
  writeFileSync('src/theme/tokens.css', tokens)
}

const HEX_RE = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g

describe('Farbpalette', () => {
  it('jede Palettenfarbe gibt es als CSS-Variable in tokens.css', () => {
    for (const [name, hex] of Object.entries(HEX)) {
      expect(tokens).toContain(`${cssVar(name as PaletteName)}: ${hex};`)
    }
  })

  it('Abend-/Nachtstimmung in tokens.css ist aktuell (mood.ts)', () => {
    expect(tokens).toContain(`${START}\n${moodCss(TONES)}\n${END}`)
  })

  it('src/theme/art/** enthält keine neuen festen Hex-Werte', () => {
    const files = import.meta.glob('../theme/art/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
    const grandfathered = allow as Record<string, string[]>
    const fresh: string[] = []
    for (const [path, src] of Object.entries(files)) {
      if (path.endsWith('/palette.ts') || path.endsWith('/mood.ts')) continue
      const file = path.replace('../theme/art/', '')
      const ok = new Set((grandfathered[file] ?? []).map((h) => h.toLowerCase()))
      for (const m of src.matchAll(HEX_RE)) {
        if (!ok.has(m[0].toLowerCase())) fresh.push(`${file}: ${m[0]}`)
      }
    }
    // Neue Farbe? In palette.ts (+ tokens.css) aufnehmen und als P.name verwenden.
    expect(fresh).toEqual([])
  })
})
