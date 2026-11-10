/**
 * HUD-Durchsicht (Runde 4, Paket 2): ein voller Garten mit vielen gleichzeitig
 * laufenden Ereignissen (Saison-Karte, Herausforderung, Dünger, Vereinsfahne,
 * Regenbogen, Fest, Wetter, Rezept, Bestellung …). Legt Screenshots in
 * e2e-screens/hud-<name>-<lang>.png ab.
 *   node scripts/e2e/hud.mjs <name> [--strict]
 * --strict prüft die HUD-Grenze: höchstens drei Ereignis-Pillen, die
 * ablaufenden zuerst, und genau ein Zugang „Heute“ ohne eigene Pillen/Punkte
 * für Gartenrunde, Rezept, Tagesziele und Wochenplan.
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium, devices } from 'playwright'

const name = process.argv[2] ?? 'shot'
const strict = process.argv.includes('--strict')
const PORT = 4324
const URL = `http://localhost:${PORT}/`
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(URL)).ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('preview server did not start')
}
function assert(cond, msg) {
  if (!cond) throw new Error('HUD: ' + msg)
}

const seed = () => {
  if (sessionStorage.getItem('seed')) return
  const now = Date.now()
  const owned = { gemuesebeet: 120, kompost: 110, kraeuterspirale: 100, beerenhecke: 90, obstwiese: 80, bienenstock: 70, huehnerstall: 60, gewaechshaus: 40 }
  const save = {
    owned, ernte: 5e9, ernteSeason: 5e9, saisonenden: 9, sessions: 20, samen: 120, erbstuecke: 40, lastSeen: now, saveVersion: 1,
    seasonCard: 'tomatenjahr', challenge: 'ohneKompost',
    yieldBoostExpiresAt: now + 50 * 60_000, vereinBoostExpiresAt: now + 20 * 60_000, vereinMult: 1.15,
    skyEvent: null, rainbowUntil: now + 40_000,
  }
  const d = new Date(now)
  const day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  save.recipe = { day, dish: 2, areas: ['gemuesebeet', 'kompost', 'kraeuterspirale'], have: [8, 3, 0], claimed: false }
  localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify(save))
  localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
  localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
  localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly', 'recipeNew', 'festNew', 'weatherNew', 'clanNew', 'crossNew', 'helperAreas']))
  sessionStorage.setItem('seed', '1')
}

let browser
try {
  await waitForServer()
  await mkdir('e2e-screens', { recursive: true })
  browser = await chromium.launch()
  for (const lang of ['de', 'en']) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: lang === 'en' ? 'en-US' : 'de-DE' })
    await ctx.addInitScript(seed)
    const p = await ctx.newPage()
    const errors = []
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.locator('.garden-map').waitFor()
    await p.waitForTimeout(1200)
    await p.screenshot({ path: `e2e-screens/hud-${name}-${lang}.png` })
    if (strict) {
      const pills = await p.locator('.hud-pills .hud-pill:not(.pill-more)').count()
      assert(pills <= 3, `${lang}: ${pills} event pills (max 3)`)
      // „+N“ zeigt die übrigen nur als Liste, nie als weitere Pillen
      const more = p.locator('.hud-pills .pill-more')
      if (await more.count()) {
        await more.click()
        const after = await p.locator('.hud-pills .hud-pill:not(.pill-more)').count()
        assert(after <= 3, `${lang}: ${after} event pills after „+N“`)
        await p.screenshot({ path: `e2e-screens/hud-${name}-more-${lang}.png` })
        await more.click()
      }
      // Ein Zugang „Heute“ statt Rezept-Pille, Gartenrunde-Knopf und Punkt an der Gärtnerstufe
      assert((await p.locator('.pill-recipe').count()) === 0, `${lang}: no recipe pill`)
      assert((await p.locator('.hud-garden .hud-dot').count()) === 0, `${lang}: no dot on the level card`)
      assert((await p.locator('.hud-claim.daily').count()) === 0, `${lang}: no separate daily button`)
      const today = p.locator('.hud-today')
      assert((await today.count()) === 1, `${lang}: one „Heute“ entry`)
      await today.click()
      await p.locator('.today-sheet').waitFor()
      for (const sec of ['daily', 'quests', 'recipe', 'weekly']) assert((await p.locator(`.today-sheet .today-${sec}`).count()) === 1, `${lang}: today card has ${sec}`)
      await p.screenshot({ path: `e2e-screens/hud-${name}-today-${lang}.png` })
    }
    assert(errors.length === 0, 'page errors: ' + errors.join(' | '))
    await ctx.close()
  }
  console.log(`HUD ${name} ✔ → e2e-screens/hud-${name}-*.png`)
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  await browser?.close()
  server.kill()
}
