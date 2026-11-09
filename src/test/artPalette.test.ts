/// <reference types="node" />
import { describe, expect, it } from 'vitest'
import { P, cssVar, type PaletteName } from '../theme/art/palette'
import allow from '../theme/art/hex-allow.json'
import { readFileSync } from 'node:fs'

const tokens = readFileSync('src/theme/tokens.css', 'utf8')

const HEX = /#(?:[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g

describe('Farbpalette', () => {
  it('jede Palettenfarbe gibt es als CSS-Variable in tokens.css', () => {
    for (const [name, hex] of Object.entries(P)) {
      expect(tokens).toContain(`${cssVar(name as PaletteName)}: ${hex};`)
    }
  })

  it('src/theme/art/** enthält keine neuen festen Hex-Werte', () => {
    const files = import.meta.glob('../theme/art/**/*.{ts,tsx}', { query: '?raw', import: 'default', eager: true }) as Record<string, string>
    const grandfathered = allow as Record<string, string[]>
    const fresh: string[] = []
    for (const [path, src] of Object.entries(files)) {
      if (path.endsWith('/palette.ts')) continue
      const file = path.replace('../theme/art/', '')
      const ok = new Set((grandfathered[file] ?? []).map((h) => h.toLowerCase()))
      for (const m of src.matchAll(HEX)) {
        if (!ok.has(m[0].toLowerCase())) fresh.push(`${file}: ${m[0]}`)
      }
    }
    // Neue Farbe? In palette.ts (+ tokens.css) aufnehmen und als P.name verwenden.
    expect(fresh).toEqual([])
  })
})
