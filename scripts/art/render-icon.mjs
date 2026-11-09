/**
 * Rendert das App-Icon aus den echten Bausteinen (?artsheet=icon) als
 * 1024×1024-PNG: <outDir>/icon-master.png und icon-maskable-master.png.
 * Usage: npm run build && node scripts/art/render-icon.mjs <outDir>
 * (wird von scripts/generate-pwa-icons.py aufgerufen)
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const OUT = process.argv[2] ?? '.'
const PORT = 4183
const URL = `http://localhost:${PORT}/`
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
try {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(URL)).ok) break
    } catch {
      /* not up */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  await mkdir(OUT, { recursive: true })
  const b = await chromium.launch()
  const ctx = await b.newContext({ viewport: { width: 600, height: 600 }, deviceScaleFactor: 2, reducedMotion: 'reduce' })
  const p = await ctx.newPage()
  for (const [mask, name] of [['0', 'icon-master.png'], ['1', 'icon-maskable-master.png']]) {
    await p.goto(`${URL}?artsheet=icon&mask=${mask}`)
    await p.locator('[data-icon]').waitFor()
    await p.waitForTimeout(300)
    await p.locator('[data-icon]').screenshot({ path: `${OUT}/${name}` })
    console.log(`wrote ${OUT}/${name}`)
  }
  await b.close()
} finally {
  server.kill()
}
