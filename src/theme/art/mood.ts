/**
 * Abend- und Nachtstimmung für die Bereiche des Hauptgartens: jede
 * Palettenfarbe bekommt eine umgestimmte Variante (wärmer und etwas dunkler
 * am Abend, dunkel und bläulich in der Nacht). Licht (Laternen, Fenster,
 * warmes Glas) bleibt hell oder leuchtet erst dann auf.
 * Das CSS dazu steht generiert in tokens.css (Test hält es aktuell:
 * ART_MOOD_WRITE=1 npx vitest run src/test/artPalette.test.ts).
 */
import { HEX, cssVar, type PaletteName } from './palette'

export type Mood = 'evening' | 'night'

const LIGHTS: Partial<Record<PaletteName, Record<Mood, string>>> = {
  lamp: { evening: '#ffd36b', night: '#ffe08a' },
  window: { evening: '#ffd77a', night: '#ffd36b' },
  glassWarm: { evening: '#ffe3a0', night: '#ffd77a' },
  label: { evening: '#ffe9a8', night: '#ffe08a' },
}

function rgb(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

function hex([r, g, b]: number[]): string {
  return `#${[r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v!))).toString(16).padStart(2, '0')).join('')}`
}

function mix(a: number[], b: number[], t: number): number[] {
  return a.map((v, i) => v * (1 - t) + b[i]! * t)
}

/** Umgestimmte Farbe für eine Stimmung. */
export function moodColor(name: PaletteName, mood: Mood): string {
  return LIGHTS[name]?.[mood] ?? moodHex(HEX[name], mood)
}

/** Stimmung für einen beliebigen Hex-Wert (auch tone('#…')). */
export function moodHex(value: string, mood: Mood): string {
  const c = rgb(value)
  if (mood === 'evening') return hex(mix(c.map((v) => v * 0.86), [255, 168, 104], 0.12))
  return hex(mix(c.map((v) => v * 0.58), [36, 52, 94], 0.3))
}

/** Selektoren, unter denen die Stimmung gilt (Hauptgarten und ?artsheet). */
export const MOOD_SCOPE: Record<Mood, string> = {
  evening: "[data-daypart='evening'] :is(.module-art, .plot-art)",
  night: "[data-daypart='night'] :is(.module-art, .plot-art)",
}

/** CSS für Palette und alle tone('#…')-Farben (sortiert, ohne Doppelte). */
export function moodCss(tones: readonly string[] = []): string {
  const names = Object.keys(HEX) as PaletteName[]
  const extra = [...new Set(tones.map((t) => t.toLowerCase()))].sort()
  return (['evening', 'night'] as Mood[])
    .map((m) => {
      const lines = [
        ...names.map((n) => `  ${cssVar(n)}: ${moodColor(n, m)};`),
        ...extra.map((t) => `  --art-t-${t.slice(1)}: ${moodHex(t, m)};`),
      ]
      return `${MOOD_SCOPE[m]} {\n${lines.join('\n')}\n}`
    })
    .join('\n\n')
}
