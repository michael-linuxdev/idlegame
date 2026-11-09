/**
 * Spielfeld-Screenshots für den Grafik-Vergleich (Tag/Nacht, vier Jahreszeiten).
 * Usage: npm run build && node scripts/art/shots.mjs <outDir> [szene,...]
 * Startet selbst `vite preview` auf Port 4176.
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright'

const OUT = process.argv[2] ?? 'art-shots'
const only = process.argv[3]?.split(',')
const PORT = 4176
const URL = `http://localhost:${PORT}/`
const ids = ['gemuesebeet', 'kompost', 'kraeuterspirale', 'beerenhecke', 'obstwiese', 'bienenstock', 'huehnerstall', 'gewaechshaus', 'hofladen', 'orangerie']
const lv = (arr) => Object.fromEntries(ids.map((id, i) => [id, arr[i] ?? 0]))

const SCENES = [
  { name: 'frueh-tag', owned: lv([34, 18, 9, 1]), extra: { prestiges: 1 }, ambient: 'day-summer' },
  { name: 'voll-tag-sommer', owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14 }, ambient: 'day-summer' },
  { name: 'voll-abend', owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14 }, ambient: 'evening-summer' },
  { name: 'voll-nacht', owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14 }, ambient: 'night-summer' },
  { name: 'voll-fruehling', owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14 }, ambient: 'day-spring' },
  { name: 'voll-herbst', owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14 }, ambient: 'day-autumn' },
  { name: 'voll-winter', owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14 }, ambient: 'day-winter' },
  { name: 'regen', owned: lv([60, 40, 30, 20, 10, 1]), extra: { prestiges: 4 }, ambient: 'day-summer', query: '&wetter=regen' },
  { name: 'wind', owned: lv([60, 40, 30, 20, 10, 1]), extra: { prestiges: 4 }, ambient: 'day-autumn', query: '&wetter=wind' },
  { name: 'mittel-tag', owned: lv([30, 26, 12, 10, 1, 1]), extra: { prestiges: 4 }, ambient: 'day-summer' },
]

const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(URL)).ok) return } catch { /* not up */ }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('preview server did not start')
}

try {
  await waitForServer()
  await mkdir(OUT, { recursive: true })
  const b = await chromium.launch()
  for (const s of SCENES) {
    if (only && !only.includes(s.name)) continue
    const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
    const st = { owned: s.owned, ernte: 2e6, ernteSeason: 2e6, lastSeen: Date.now(), ...s.extra }
    await ctx.addInitScript((v) => {
      if (sessionStorage.getItem('seed')) return
      localStorage.setItem('gartenerbe-save-v1', v)
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-notebook-v1', JSON.stringify({ unlocked: ['welcome'], read: ['welcome'], maxStage: 0 }))
      sessionStorage.setItem('seed', '1')
    }, JSON.stringify(st))
    const p = await ctx.newPage()
    await p.goto(`${URL}?ambient=${s.ambient}${s.query ?? ''}`)
    await p.waitForTimeout(1500)
    await p.addStyleTag({ content: '.hud-pills-wrap,.float-pops,.hud-toast,.welcome-back,.oma-hint,.weather-card{display:none!important}' })
    await p.waitForTimeout(300)
    await p.screenshot({ path: `${OUT}/${s.name}.png` })
    await ctx.close()
  }
  await b.close()
} finally {
  server.kill()
}
