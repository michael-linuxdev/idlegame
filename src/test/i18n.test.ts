/**
 * Language files: same key tree in every locale, no visible German text
 * outside `src/i18n`, and (once Paket 6 lands) a finished English file.
 */
import { readFileSync } from 'node:fs'
import { parseAst } from 'rolldown/parseAst'
import { describe, expect, it } from 'vitest'
import { browserLocale } from '../i18n'
import { strings as de } from '../i18n/de/strings'
import { strings as en } from '../i18n/en/strings'

/** `a.b.c` → kind, so a key or a changed shape shows up as a diff. */
function shape(v: unknown, path = '', out: Record<string, string> = {}): Record<string, string> {
  if (typeof v === 'function') out[path] = `fn/${v.length}`
  else if (Array.isArray(v)) {
    out[path] = `array/${v.length}`
    v.forEach((x, i) => shape(x, `${path}[${i}]`, out))
  } else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) shape(x, path ? `${path}.${k}` : k, out)
  else out[path] = typeof v
  return out
}

describe('language files', () => {
  it('have the same key tree in German and English', () => {
    expect(shape(en)).toEqual(shape(de))
  })

  it('pick German for de* browsers and English for everything else', () => {
    expect(browserLocale(['de-DE', 'en'])).toBe('de')
    expect(browserLocale(['de-AT'])).toBe('de')
    expect(browserLocale(['de-CH'])).toBe('de')
    expect(browserLocale(['en-US', 'de'])).toBe('en')
    expect(browserLocale(['fr-FR'])).toBe('en')
    expect(browserLocale([])).toBe('en')
  })

  // TODO(en, Paket 6): scharf schalten, sobald alle Texte übersetzt sind
  it.skip('English is fully translated (no TODO markers left)', () => {
    const files = import.meta.glob('../i18n/en/*.ts', { query: '?raw', import: 'default', eager: true })
    const open = Object.entries(files).filter(([, src]) => /TODO\(en\)/.test(src as string))
    expect(open.map(([p]) => p)).toEqual([])
  })
})

/* —— Keine sichtbaren deutschen Texte außerhalb der Sprachdateien —— */

const CODE = Object.keys({
  ...import.meta.glob('../game/**/*.ts'),
  ...import.meta.glob('../components/**/*.{ts,tsx}'),
})

/** Clearly German: umlauts/ß, or a German function word inside a phrase. */
const GERMAN = /[äöüÄÖÜß„“]|(?:^|\s)(?:und|oder|nicht|mit|für|der|die|das|dein|deine|ist|noch|jetzt|auf|zum|zur|vom|beim)(?=\s|$)/

/** Literal values that are IDs or technical keys, not player-facing text. */
const ALLOW = new Set<string>([])

type Node = { type: string; start: number; [k: string]: unknown }

function germanLiterals(src: string, lang: 'ts' | 'tsx'): { at: number; text: string }[] {
  const ast = parseAst(src, { lang }) as unknown as Node
  const out: { at: number; text: string }[] = []
  const walk = (n: unknown): void => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) return n.forEach(walk)
    const node = n as Node
    if (typeof node.type !== 'string') return
    // Developer logs are not player-facing
    if (node.type === 'CallExpression') {
      const callee = node.callee as Node & { object?: { name?: string } }
      if (callee.type === 'MemberExpression' && callee.object?.name === 'console') return
    }
    if (node.type === 'ImportDeclaration' || node.type === 'ExportAllDeclaration') return
    let text: string | null = null
    if (node.type === 'Literal' && typeof node.value === 'string') text = node.value
    else if (node.type === 'TemplateElement') text = (node.value as { cooked: string }).cooked
    else if (node.type === 'JSXText') text = (node.value as string).trim()
    if (text && GERMAN.test(text) && !ALLOW.has(text)) out.push({ at: node.start, text })
    for (const [k, v] of Object.entries(node)) if (k !== 'type') walk(v)
  }
  walk(ast)
  return out
}

describe('no German text in code', () => {
  it('keeps every visible text in src/i18n', () => {
    const bad: string[] = []
    for (const rel of CODE) {
      const src = readFileSync(new URL(rel, import.meta.url), 'utf8')
      for (const hit of germanLiterals(src, rel.endsWith('x') ? 'tsx' : 'ts')) {
        const line = src.slice(0, hit.at).split('\n').length
        bad.push(`${rel.replace('../', 'src/')}:${line} ${hit.text.slice(0, 60)}`)
      }
    }
    expect(bad).toEqual([])
  })
})
