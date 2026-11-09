/**
 * Barrierefreiheit: axe-core (WCAG 2 A/AA) auf den Hauptansichten, in beiden
 * Sprachen. Schlägt bei jedem Verstoß fehl.
 * Run: npm run build && node scripts/e2e/axe.mjs
 */
import { spawn } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { chromium, devices } from 'playwright'

const require = createRequire(import.meta.url)
const AXE = readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8')
const PORT = 4323
const URL = `http://localhost:${PORT}/`
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })

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

const violations = []

async function audit(p, name, within) {
  await p.waitForTimeout(400)
  await p.addScriptTag({ content: AXE })
  const tags = (process.env.AXE_TAGS || 'wcag2a,wcag2aa,wcag21a,wcag21aa').split(',')
  const res = await p.evaluate(async ([tags, within]) => {
    // eslint-disable-next-line no-undef
    const r = await axe.run(within ? document.querySelector(within) : document, { runOnly: { type: 'tag', values: tags } })
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.slice(0, 20).map((n) => n.target.join(' ')) }))
  }, [tags, within])
  for (const v of res) violations.push(`${name}: ${v.id} (${v.impact}) ${v.nodes.join(' | ')}`)
  return res.length
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined })
  for (const lang of ['de', 'en']) {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: lang === 'de' ? 'de-DE' : 'en-US' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 60, kompost: 40, kraeuterspirale: 30, beerenhecke: 20, obstwiese: 10, bienenstock: 5 }
      // Kapitel 50 ganz angelegt → die Abschluss-Szene wird am Ende mitgeprüft
      const omas = ['omasbeet', 'omaskompost', 'omasspirale', 'omashecke', 'opasapfel', 'omasbienen', 'omashuehner', 'altglashaus', 'omaslaube', 'omasbank']
      const omasgarten = { cur: 0, curLifetime: 1, owned: Object.fromEntries(omas.map((a) => [a, 10])), openedAt: 1, introSeen: true }
      // Kapitel 13 ausgebaut: Plaketten (Stufe 10), ein frei geräumter Bereich, ein gesperrter
      const stadt = ['hochbeete', 'palettenbeete', 'regenspeicher', 'wurmkiste', 'kraeuterleiter', 'saatgutbibliothek', 'lastenrad', 'lehmofen']
      const stadtgarten = { cur: 0, curLifetime: 1, owned: { ...Object.fromEntries(stadt.map((a) => [a, 10])), werkstatt: 0 }, openedAt: 1, introSeen: true }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 3e6, ernteSeason: 4e6, saisonenden: 4, erbstuecke: 900, samen: 400, lastSeen: Date.now(), saveVersion: 1, chapters: { stadtgarten, omasgarten } }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    const q = `?lang=${lang}`
    let n = 0
    await p.goto(URL + q)
    await p.locator('.garden-map').waitFor()
    if ((await p.evaluate(() => document.documentElement.lang)) !== lang) violations.push(`${lang}: <html lang> is not ${lang}`)
    n += await audit(p, `${lang} map`)
    await p.locator('.garden-plot.planted').first().dispatchEvent('click')
    await p.locator('.upgrade-hud').waitFor()
    n += await audit(p, `${lang} upgrade`)
    await p.keyboard.press('Escape')
    await p.locator('.menu-fab').click()
    await p.locator('.nav-sheet').waitFor()
    n += await audit(p, `${lang} menu`)
    await p.locator('.nav-menu-settings').click()
    await p.locator('.nav-settings').waitFor()
    n += await audit(p, `${lang} settings`)
    await p.keyboard.press('Escape')
    await p.keyboard.press('Escape')
    for (const tab of ['prestige', 'shop']) {
      await p.locator(`.tabbar .tab-${tab}`).click()
      await p.waitForTimeout(400)
      n += await audit(p, `${lang} ${tab}`)
    }
    await p.locator('.tabbar .tab-garten').click()
    await p.keyboard.press('Escape')
    await p.locator('.menu-fab').click()
    await p.locator('.nav-menu-item').first().click()
    await p.waitForTimeout(500)
    n += await audit(p, `${lang} notebook`)
    await p.keyboard.press('Escape')
    // Kapitel 13 und 50 sind offen: die Knöpfe an der Seite führen direkt hin
    await p.locator('.map-side .plot-switch').first().click()
    await p.locator('.chapter-stadtgarten .garden-plot.planted').first().waitFor()
    n += await audit(p, `${lang} kapitel-karte`)
    // Mit allen Schildern (Einstellung „Schilder immer zeigen“) statt Plaketten
    await p.evaluate(() => {
      localStorage.setItem('gartenerbe-pref-signs', '1')
      window.dispatchEvent(new Event('gartenerbe-prefs'))
    })
    await p.locator('.chapter-stadtgarten .garden-plot.planted .plot-sign').first().waitFor()
    n += await audit(p, `${lang} kapitel-schilder`)
    await p.evaluate(() => {
      localStorage.setItem('gartenerbe-pref-signs', '0')
      window.dispatchEvent(new Event('gartenerbe-prefs'))
    })
    await p.locator('.map-side .plot-switch').last().click()
    await p.locator('.abschluss-scene').waitFor()
    // Nur das offene Fenster: die Karte dahinter ist durch aria-modal verdeckt
    n += await audit(p, `${lang} abschluss`, '.abschluss-scene')
    console.log(`${lang}: ${n} Verstöße`)
    await ctx.close()
  }
  if (violations.length) {
    console.log(violations.join('\n'))
    process.exitCode = 1
  } else console.log('axe: 0 Verstöße (de + en) ✔')
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  await browser?.close()
  server.kill()
}
