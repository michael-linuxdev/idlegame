/**
 * Store-Wächter: Sobald eine App-Store-Hülle im Repo liegt, muss
 * game/distribution.ts auf 'store' stehen — sonst sähen Store-Spieler den
 * Hinweis „Zuerst die App installieren“.
 */
import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { DISTRIBUTION, TEST_PHASE, webInstallGateEnabled } from '../game/distribution'

const ROOT = resolve(__dirname, '../..')

function storeShellPresent(): string[] {
  const found: string[] = []
  for (const f of readdirSync(ROOT)) {
    if (/^capacitor\.config\./.test(f) || f === 'twa-manifest.json' || f === 'bubblewrap.json') found.push(f)
  }
  for (const d of ['android', 'ios']) if (existsSync(resolve(ROOT, d))) found.push(`${d}/`)
  return found
}

describe('Auslieferung (Web ↔ Store)', () => {
  it('Store-Hülle im Repo → DISTRIBUTION muss "store" sein (Installations-Hinweis aus)', () => {
    const shell = storeShellPresent()
    if (shell.length > 0) {
      expect(DISTRIBUTION, `Store-Hülle gefunden (${shell.join(', ')}): src/game/distribution.ts auf 'store' stellen`).toBe('store')
    } else {
      expect(DISTRIBUTION).toBe('web')
    }
  })

  it('Store-Hülle im Repo → Testphasen-Hinweis muss aus sein (TEST_PHASE = false)', () => {
    if (storeShellPresent().length > 0) {
      expect(TEST_PHASE, 'Store-Hülle gefunden: TEST_PHASE in src/game/distribution.ts auf false stellen').toBe(false)
    }
  })

  it('Hinweis nur in der Web-Fassung', () => {
    expect(webInstallGateEnabled('web')).toBe(true)
    expect(webInstallGateEnabled('store')).toBe(false)
  })
})
