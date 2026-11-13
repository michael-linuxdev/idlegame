// Store-Screenshots (1290×2796, iPhone 6,7″) in einer Sprache.
// Usage: npm run build && (npx vite preview --port 4175 &) && node scripts/store/screenshots.cjs docs/store/screenshots [de|en]
// Englisch: node scripts/store/screenshots.cjs docs/store/screenshots-en en
// Das Wetter ist fest auf Sonne gestellt (keine Pfützen); das laufende Fest folgt dem Kalender.
const { chromium } = require('playwright')
const OUT = process.argv[2]
const LANG = process.argv[3] === 'en' ? 'en' : 'de'
if (!OUT) throw new Error('Usage: node scripts/store/screenshots.cjs <out-dir> [de|en]')
const NAMES = {
  de: ['01-omas-brief', '02-garten-waechst', '03-gartenpark-abend', '04-ausbauen', '05-notizbuch', '06-winterruhe'],
  en: ['01-grandmas-letter', '02-garden-grows', '03-garden-park-evening', '04-upgrade', '05-notebook', '06-winter-rest'],
}[LANG]
const ids = ['gemuesebeet', 'kompost', 'kraeuterspirale', 'beerenhecke', 'obstwiese', 'bienenstock', 'huehnerstall', 'gewaechshaus', 'hofladen', 'orangerie']

async function scene(b, name, { owned, extra = {}, ftue = false, ambient = 'day-summer', after }) {
  const ctx = await b.newContext({
    viewport: { width: 430, height: 932 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    locale: LANG === 'en' ? 'en-US' : 'de-DE',
  })
  // Aktuelles Speicherformat (src/game/storage.ts, docs/cleanup/namen.md)
  const st = { owned, ernte: 2e6, ernteSeason: 2e6, lastSeen: Date.now(), saveVersion: 1, ...extra }
  await ctx.addInitScript(([v, f]) => {
    if (sessionStorage.getItem('seed')) return
    localStorage.setItem('gartenerbe-spielstand-v1', v)
    if (!f) localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
    localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
    localStorage.setItem('gartenerbe-notebook-v1', JSON.stringify({ unlocked: ['welcome'], read: ['welcome'], maxStage: 0 }))
    sessionStorage.setItem('seed', '1')
  }, [JSON.stringify(st), ftue])
  const p = await ctx.newPage()
  await p.goto(`http://localhost:4175/?lang=${LANG}&ambient=${ambient}&wetter=sonne`)
  await p.waitForTimeout(1600)
  // hide transient banners/events for clean shots
  await p.addStyleTag({ content: '.hud-pills-wrap,.float-pops,.hud-toast,.weather-card,.oma-hint,.oma-note,.welcome-back{display:none!important}' })
  if (after) await after(p)
  await p.waitForTimeout(500)
  await p.screenshot({ path: `${OUT}/${name}.png` })
  await ctx.close()
}

;(async () => {
  const b = await chromium.launch()
  const lv = (arr) => Object.fromEntries(ids.map((id, i) => [id, arr[i] ?? 0]))
  const [n1, n2, n3, n4, n5, n6] = NAMES
  await scene(b, n1, { owned: lv([1]), ftue: true, extra: { ernte: 30, ernteSeason: 30 } })
  await scene(b, n2, { owned: lv([34, 18, 9, 1]), extra: { saisonenden: 1 } })
  await scene(b, n3, { owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { saisonenden: 14, ernte: 5e11 }, ambient: 'evening-summer' })
  await scene(b, n4, { owned: lv([60, 52, 40, 28, 12, 1]), extra: { saisonenden: 3, ernte: 9e7 }, after: async (p) => { await p.locator('.garden-plot').nth(1).click({ force: true }) } })
  await scene(b, n5, { owned: lv([40, 30, 20, 10, 5]), extra: { saisonenden: 2 }, after: async (p) => { await p.locator('.laube-hotspot').click({ force: true }); await p.waitForTimeout(300); const back = p.locator('.notebook-back'); if (await back.isVisible()) await back.click() } })
  await scene(b, n6, { owned: lv([60, 50, 40, 30, 20, 10]), extra: { saisonenden: 2, ernte: 9e8, ernteSeason: 9e8 }, after: async (p) => { await p.locator('.tabbar .tab-prestige').click(); await p.waitForTimeout(300); await p.locator('.btn.prestige').first().click({ force: true }); await p.waitForTimeout(3200) } })
  await b.close()
})()
