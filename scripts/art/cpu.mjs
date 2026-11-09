/**
 * CPU-Messung Hauptgarten (alle Bereiche Stufe 5, produzierend), 4× gedrosselt.
 * Usage: npm run build && node scripts/art/cpu.mjs [idle]
 * Gibt die Main-Thread-Zeit je Sekunde aus (TaskDuration), Mittel aus 3 Läufen.
 */
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'
const idle = process.argv[2] === 'idle'
const server = spawn('npx', ['vite', 'preview', '--port', '4178', '--strictPort'], { stdio: 'ignore' })
await new Promise((r) => setTimeout(r, 2500))
const b = await chromium.launch()
const res = []
for (let run = 0; run < 3; run++) {
  const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, isMobile: true, hasTouch: true, reducedMotion: process.env.RM ? 'reduce' : 'no-preference' })
  await ctx.addInitScript(() => {
    if (sessionStorage.getItem('seed')) return
    const ids = ['gemuesebeet', 'kompost', 'kraeuterspirale', 'beerenhecke', 'obstwiese', 'bienenstock', 'huehnerstall', 'gewaechshaus', 'hofladen', 'orangerie']
    localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned: Object.fromEntries(ids.map((id) => [id, 120])), ernte: 1e12, ernteSeason: 1e12, saisonenden: 14, lastSeen: Date.now() }))
    localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
    localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
    sessionStorage.setItem('seed', '1')
  })
  const p = await ctx.newPage()
  await p.goto('http://localhost:4178/?ambient=day-summer')
  await p.waitForTimeout(2500)
  await p.addStyleTag({ content: '.hud-pills-wrap,.float-pops,.weather-card{display:none!important}' + (process.env.NOANIM ? '.module-art *{animation:none!important}' : '') })
  if (idle) await p.evaluate(() => document.documentElement.classList.add('idle'))
  const cdp = await ctx.newCDPSession(p)
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
  await cdp.send('Performance.enable')
  const m = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map((x) => [x.name, x.value]))
  const a = await m()
  await p.waitForTimeout(6000)
  const z = await m()
  res.push(((z.TaskDuration - a.TaskDuration) / ((z.Timestamp - a.Timestamp))) * 100)
  await ctx.close()
}
await b.close(); server.kill()
console.log(`Main-Thread ${idle ? '(Ruhemodus) ' : ''}: ${res.map((r) => r.toFixed(1)).join(' / ')} % → Mittel ${(res.reduce((x, y) => x + y) / res.length).toFixed(1)} %`)
