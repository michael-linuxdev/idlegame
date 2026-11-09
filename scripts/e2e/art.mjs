/**
 * Screenshot-Vergleich der Grafik-Übersicht (index.html?artsheet).
 * Jeder Block (Hauptgarten je Jahreszeit/Tageszeit, jedes Kapitel, Deko)
 * wird mit dem Vergleichsbild in scripts/e2e/art-baseline/ verglichen.
 * Weichen mehr als MAX_DIFF der Pixel deutlich ab, schlägt der Test fehl;
 * Differenzbilder landen in e2e-screens/art-diff/.
 *
 * Vergleichsbilder nach gewollten Grafik-Änderungen erneuern:
 *   npm run build && npm run art:update
 * Prüft außerdem die Leistungsgrenze: höchstens MAX_ELEMENTS SVG-Elemente
 * im Hauptgarten, wenn alle Bereiche auf Stufe 5 stehen.
 */
import { spawn } from 'node:child_process'
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { chromium } from 'playwright'

const UPDATE = process.argv.includes('--update')
const PORT = 4322
const URL = `http://localhost:${PORT}/`
const BASE = 'scripts/e2e/art-baseline'
const DIFF = 'e2e-screens/art-diff'
/** Anteil deutlich abweichender Pixel, ab dem ein Block als geändert gilt */
const MAX_DIFF = 0.004
/** Leistungsgrenze Hauptgarten (alle Bereiche Stufe 5) */
const MAX_ELEMENTS = 1500

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(URL)).ok) return
    } catch {
      /* not up */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('preview server did not start')
}

/** Vergleicht zwei PNGs im Browser (Canvas), gibt Anteil abweichender Pixel zurück. */
async function compare(page, a, b) {
  return page.evaluate(
    async ([a, b]) => {
      const load = (src) =>
        new Promise((r, e) => {
          const i = new Image()
          i.onload = () => r(i)
          i.onerror = e
          i.src = 'data:image/png;base64,' + src
        })
      const [ia, ib] = await Promise.all([load(a), load(b)])
      if (ia.width !== ib.width || ia.height !== ib.height) return { ratio: 1, size: `${ia.width}×${ia.height} ≠ ${ib.width}×${ib.height}` }
      const c = document.createElement('canvas')
      c.width = ia.width
      c.height = ia.height
      const g = c.getContext('2d')
      g.drawImage(ia, 0, 0)
      const da = g.getImageData(0, 0, c.width, c.height).data
      g.drawImage(ib, 0, 0)
      const out = g.getImageData(0, 0, c.width, c.height)
      const db = out.data
      let n = 0
      for (let i = 0; i < da.length; i += 4) {
        const d = Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2])
        if (d > 96) {
          n++
          db[i] = 255
          db[i + 1] = 0
          db[i + 2] = 200
        }
      }
      g.putImageData(out, 0, 0)
      return { ratio: n / (c.width * c.height), diff: c.toDataURL('image/png').split(',')[1] }
    },
    [a.toString('base64'), b.toString('base64')],
  )
}

let failed = false
let browser
try {
  await waitForServer()
  browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined })
  const ctx = await browser.newContext({ viewport: { width: 900, height: 1400 }, deviceScaleFactor: 1, reducedMotion: 'reduce' })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(e.message))
  await page.goto(URL + '?artsheet')
  await page.locator('[data-art-block]').first().waitFor()
  // Text (Schrift, Kantenglättung) gehört nicht zum Vergleich
  await page.addStyleTag({ content: '.artsheet h1, .artsheet h2, .artsheet b, .as-label { visibility: hidden !important }' })
  await page.waitForTimeout(400)
  const blocks = await page.locator('[data-art-block]').evaluateAll((els) => els.map((e) => e.getAttribute('data-art-block')))
  await mkdir(BASE, { recursive: true })
  const known = new Set(existsSync(BASE) ? (await readdir(BASE)).filter((f) => f.endsWith('.png')) : [])
  for (const name of blocks) {
    const shot = await page.locator(`[data-art-block="${name}"]`).screenshot({ animations: 'disabled' })
    const file = `${BASE}/${name}.png`
    known.delete(`${name}.png`)
    if (UPDATE || !existsSync(file)) {
      await writeFile(file, shot)
      if (!UPDATE) console.log(`neu: ${name}`)
      continue
    }
    const res = await compare(page, await readFile(file), shot)
    if (res.ratio > MAX_DIFF) {
      failed = true
      await mkdir(DIFF, { recursive: true })
      if (res.diff) await writeFile(`${DIFF}/${name}.png`, Buffer.from(res.diff, 'base64'))
      await writeFile(`${DIFF}/${name}-neu.png`, shot)
      console.error(`Grafik geändert: ${name} (${(res.ratio * 100).toFixed(2)} % ${res.size ?? ''})`)
    }
  }
  if (!UPDATE && known.size) {
    failed = true
    console.error(`Vergleichsbilder ohne Block: ${[...known].join(', ')} (npm run art:update)`)
  }

  // Leistungsgrenze: Hauptgarten, alle Bereiche Stufe 5
  {
    const g = await browser.newContext({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
    await g.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const ids = ['gemuesebeet', 'kompost', 'kraeuterspirale', 'beerenhecke', 'obstwiese', 'bienenstock', 'huehnerstall', 'gewaechshaus', 'hofladen', 'orangerie']
      const owned = Object.fromEntries(ids.map((id) => [id, 120]))
      localStorage.setItem('gartenerbe-save-v1', JSON.stringify({ owned, ernte: 1e12, ernteSeason: 1e12, prestiges: 14, helperLevel: 1, helperOn: true, lastSeen: Date.now() }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      sessionStorage.setItem('seed', '1')
    })
    const p = await g.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + '?ambient=night-summer')
    await p.locator('.garden-plot').first().waitFor()
    await p.waitForTimeout(800)
    const tiers = await p.locator('.module-art[data-tier="5"]').count()
    const n = await p.locator('.garden-map').evaluate((el) => el.querySelectorAll('svg *').length)
    console.log(`Hauptgarten (Stufe 5 ×${tiers}): ${n} SVG-Elemente (Grenze ${MAX_ELEMENTS})`)
    if (tiers < 10) {
      failed = true
      console.error(`nur ${tiers} Bereiche auf Stufe 5`)
    }
    if (n > MAX_ELEMENTS) {
      failed = true
      console.error(`zu viele SVG-Elemente im Hauptgarten: ${n} > ${MAX_ELEMENTS}`)
    }
    await g.close()
  }
  if (errors.length) {
    failed = true
    console.error('Seitenfehler:', errors.join('\n'))
  }
  console.log(UPDATE ? `Vergleichsbilder erneuert (${blocks.length})` : failed ? 'Grafik-Vergleich fehlgeschlagen ✘' : `Grafik-Vergleich bestanden ✔ (${blocks.length} Blöcke)`)
} finally {
  await browser?.close()
  server.kill()
}
process.exit(failed ? 1 : 0)
