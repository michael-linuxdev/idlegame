import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { describe, expect, it } from 'vitest'

/**
 * Namen aus den Vorgänger-Prototypen (TurmFarm, Orbit Rack, Ash Dominion)
 * dürfen nicht zurückkommen. Wörterbuch: docs/cleanup/namen.md.
 */
const LEGACY = [
  /\bember|\bEmber|[a-z]Ember|EMBER/,
  /[Oo]bsidian|OBSIDIAN/,
  /\bash[A-Z]|[a-z]Ash\b|[a-z]Ash[A-Z]|\bAsh\b|_ASH\b|_ASH_|\bash-/,
  /[Ff]ortress/,
  /[Dd]ominion/,
  /[Ff]oundry/,
  /canopyBoost|greenLattice|firstFlame|longWatch|nightSoil|tapMastery|seedPurse|saplingSurge/,
  /Phyto|\bRack\b|TurmFarm|turmfarm|Tokenhalle|Orbit|orbit-rack|orbital/,
  /[Bb]andwidth|BANDWIDTH/,
  /[Uu]ptime/,
  /\bcompute(Sec|Mult|Flat|Gain|Earned)\b|rewardCompute|gateCompute|\bCompute\b/,
  /\bCredits\b|[a-z]Credits\b|\bcredits\b/,
  /Münzen/,
  /--oc-|--ad-|var\(--(ember|ash)/,
  /economy\.md/,
]

/** Dateien, in denen alte Namen bewusst stehen dürfen. */
const ALLOW = new Set<string>([
  // Playtest-Log übersetzt Einträge aus alten Logs in die neuen Begriffe
  'src/game/playtestCore.ts',
  // dieser Test
  'src/test/legacyNames.test.ts',
])

const ROOT = join(__dirname, '..', '..')

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    if (statSync(p).isDirectory()) walk(p, out)
    else if (/\.(ts|tsx|css|mjs)$/.test(name)) out.push(p)
  }
  return out
}

describe('keine Altnamen im Quelltext', () => {
  it('src/ und scripts/ ohne Namen aus früheren Spielen', () => {
    const hits: string[] = []
    for (const file of [...walk(join(ROOT, 'src')), ...walk(join(ROOT, 'scripts'))]) {
      const rel = relative(ROOT, file).replaceAll('\\', '/')
      if (ALLOW.has(rel)) continue
      const lines = readFileSync(file, 'utf8').split('\n')
      lines.forEach((line, i) => {
        // bewusst alte Namen (z. B. Test „alter Stand wird nicht gelesen“)
        if (line.includes('altname-ok') || (lines[i - 1] ?? '').includes('altname-ok')) return
        for (const re of LEGACY) {
          if (re.test(line)) {
            hits.push(`${rel}:${i + 1}: ${line.trim().slice(0, 100)}`)
            break
          }
        }
      })
    }
    expect(hits).toEqual([])
  })
})
