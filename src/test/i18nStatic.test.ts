/**
 * Live language switch guard (static half): `t.…` may only be read inside a
 * function, getter or method — never directly in module scope, where the text
 * would be frozen in the language that was active at import time.
 * The runtime half (`i18nStale.test.ts`) catches texts copied by helpers that
 * run at import time.
 */
import { readFileSync } from 'node:fs'
import { parseAst } from 'rolldown/parseAst'
import { describe, expect, it } from 'vitest'

const files = Object.keys({
  ...import.meta.glob('../game/**/*.ts'),
  ...import.meta.glob('../components/**/*.{ts,tsx}'),
  ...import.meta.glob('../theme/**/*.{ts,tsx}'),
  ...import.meta.glob('../App.tsx'),
  ...import.meta.glob('../main.tsx'),
})

type Node = { type: string; start: number; [k: string]: unknown }
const FN = new Set(['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'])

function moduleScopeReads(src: string, lang: 'ts' | 'tsx'): number[] {
  const ast = parseAst(src, { lang }) as unknown as Node
  const hits: number[] = []
  const walk = (n: unknown, inFn: boolean): void => {
    if (!n || typeof n !== 'object') return
    if (Array.isArray(n)) {
      for (const x of n) walk(x, inFn)
      return
    }
    const node = n as Node
    if (typeof node.type !== 'string') return
    const fn = inFn || FN.has(node.type)
    if (
      !fn &&
      node.type === 'MemberExpression' &&
      (node.object as Node).type === 'Identifier' &&
      (node.object as { name: string }).name === 't'
    )
      hits.push(node.start)
    for (const [k, v] of Object.entries(node)) if (k !== 'type') walk(v, fn)
  }
  walk(ast, false)
  return hits
}

describe('live language switch (static)', () => {
  it('reads t only inside functions', () => {
    const bad: string[] = []
    for (const rel of files) {
      const path = new URL(rel, import.meta.url)
      const src = readFileSync(path, 'utf8')
      if (!/\bt\./.test(src)) continue
      for (const pos of moduleScopeReads(src, rel.endsWith('x') ? 'tsx' : 'ts')) {
        const line = src.slice(0, pos).split('\n').length
        bad.push(`${rel.replace('../', 'src/')}:${line}`)
      }
    }
    expect(bad).toEqual([])
  })
})
