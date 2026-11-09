/**
 * Sprach-Durchsicht: öffnet jedes Fenster im iPhone-13-Format in einer Sprache,
 * speichert Screenshots in e2e-screens/<lang>/ und prüft Texte:
 *  - kein Text abgeschnitten (scrollWidth > clientWidth bei verstecktem Überlauf),
 *  - kein Knopf breiter als der Bildschirm,
 *  - (nur EN) keine deutschen Wörter/Umlaute in sichtbarem Text außer Eigennamen.
 * Run: npm run build && node scripts/e2e/screens.mjs en   (oder de)
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium, devices } from 'playwright'

const LANG = process.argv[2] === 'de' ? 'de' : 'en'
const PORT = 4322
const URL = `http://localhost:${PORT}/`
const SHOTS = `e2e-screens/${LANG}`
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

/** Eigennamen und deutsche Begriffe, die im Englischen bewusst stehen bleiben (Glossar). */
const KEEP_GERMAN = /Frostkönig|Erntedank|Raunächte|Hinnonmäki|Goldparmäne|Impressum|Deutsch|Grüß Gott|Straußwirtschaft|Café Laube|Mas\b/

const problems = []
const errors = []
const seen = []

async function check(p, name) {
  await p.waitForTimeout(350)
  await p.screenshot({ path: `${SHOTS}/${name}.png` })
  seen.push(name)
  const found = await p.evaluate((lang) => {
    const out = []
    const vw = document.documentElement.clientWidth
    for (const el of document.querySelectorAll('body *')) {
      if (!(el instanceof HTMLElement)) continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 || r.height === 0) continue
      const cs = getComputedStyle(el)
      if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) continue
      const own = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)
      if (!own) continue
      // Visually-hidden helpers (1px, clip) are fine
      if (r.width <= 2 || r.height <= 2) continue
      const clipped = cs.overflow !== 'visible' || cs.textOverflow === 'ellipsis' || cs.overflowX !== 'visible'
      if (clipped && el.scrollWidth > el.clientWidth + 2 && cs.whiteSpace !== 'normal' && !el.closest('[data-scroll]'))
        out.push(`cut: “${el.textContent.trim().slice(0, 50)}”`)
      const clamp = cs.webkitLineClamp && cs.webkitLineClamp !== 'none'
      if ((clamp || cs.textOverflow === 'ellipsis') && el.scrollHeight > el.clientHeight + 2)
        out.push(`cut (lines): “${el.textContent.trim().slice(0, 50)}”`)
      // In waagrecht scrollenden Leisten ist „breiter als der Schirm“ gewollt
      const inScroller = (() => {
        for (let a = el.parentElement; a; a = a.parentElement) {
          const o = getComputedStyle(a).overflowX
          if (o === 'auto' || o === 'scroll') return true
        }
        return false
      })()
      if ((el.tagName === 'BUTTON' || el.classList.contains('btn')) && r.right > vw + 1 && !inScroller)
        out.push(`button wider than screen: “${el.textContent.trim().slice(0, 50)}”`)
      if (lang === 'en') {
        const txt = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ')
        if (/[äöüÄÖÜß„]|\b(und|der|die|das|nicht|mit|für|noch|Garten|Ernte|Stufe|Saison)\b/.test(txt)) out.push(`german?: “${txt.trim().slice(0, 60)}”`)
      }
    }
    return out
  }, LANG)
  for (const f of found) if (!(LANG === 'en' && f.startsWith('german?') && KEEP_GERMAN.test(f))) problems.push(`${name}: ${f}`)
}

let browser
try {
  await mkdir(SHOTS, { recursive: true })
  await waitForServer()
  browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined })
  const locale = LANG === 'de' ? 'de-DE' : 'en-US'
  const q = `?lang=${LANG}`

  const seeded = async (extra = {}) => {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale })
    await ctx.addInitScript((extraJson) => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 60, kompost: 40, kraeuterspirale: 30, beerenhecke: 20, obstwiese: 10, bienenstock: 5 }
      const base = { owned, ernte: 3e6, ernteSeason: 4e6, saisonenden: 4, erbstuecke: 900, samen: 400, lastSeen: Date.now(), saveVersion: 1 }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ ...base, ...JSON.parse(extraJson) }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    }, JSON.stringify(extra))
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    return { ctx, p }
  }

  // Erster Start: Omas Brief und Tutorial
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + q)
    await p.locator('.ftue-coach, .ftue-letter, [role="dialog"]').first().waitFor({ timeout: 10_000 })
    await check(p, 'start-letter')
    await p.locator('[role="dialog"] .btn').first().click()
    await p.waitForTimeout(800)
    await check(p, 'start-ftue')
    await ctx.close()
  }

  // Garten, Fenster, Menü
  {
    const { ctx, p } = await seeded()
    await p.goto(URL + q + '&kapitel=all&fest=advent')
    await p.locator('.garden-map').waitFor()
    await check(p, 'map')
    await p.locator('.garden-plot.planted').first().dispatchEvent('click')
    await p.locator('.upgrade-hud').waitFor()
    await check(p, 'upgrade')
    await p.keyboard.press('Escape')
    await p.locator('.hud-wallet').click()
    await p.locator('.mult-sheet').waitFor()
    await check(p, 'boni')
    await p.keyboard.press('Escape')
    await p.locator('.pill-fest').first().click()
    await p.locator('.fest-sheet').waitFor()
    await check(p, 'fest')
    await p.keyboard.press('Escape')
    await p.locator('.tabbar .tab-garten').click()
    await p.locator('.plot-sheet').waitFor()
    await check(p, 'plots')
    await p.keyboard.press('Escape')
    for (const tab of ['prestige', 'shop', 'clan']) {
      const t = p.locator(`.tabbar .tab-${tab}`)
      if (!(await t.count())) continue
      await t.click()
      await p.waitForTimeout(400)
      await check(p, `tab-${tab}`)
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
      for (const el of await p.locator('.app-panel, .panel-scroll, main').all()) await el.evaluate((n) => n.scrollTo?.(0, n.scrollHeight)).catch(() => {})
      await check(p, `tab-${tab}-end`)
    }
    await p.locator('.tabbar .tab-garten').click()
    await p.locator('.plot-sheet').waitFor().catch(() => {})
    await p.keyboard.press('Escape')
    await p.locator('.menu-fab').click()
    await p.locator('.nav-sheet').waitFor()
    await check(p, 'menu')
    const items = await p.locator('.nav-menu-item').count()
    for (let i = 0; i < items; i++) {
      // Jedes Fenster frisch öffnen (manche, z. B. der Foto-Modus, schließen nicht per Escape)
      await p.goto(URL + q + '&kapitel=all&fest=advent')
      await p.locator('.garden-map').waitFor()
      await p.locator('.menu-fab').click()
      await p.locator('.nav-sheet').waitFor()
      const item = p.locator('.nav-menu-item').nth(i)
      const cls = (await item.getAttribute('class')) ?? ''
      if (cls.includes('nav-menu-settings')) continue
      const label = (await item.innerText()).split('\n')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24)
      await item.click()
      await p.waitForTimeout(500)
      await check(p, `menu-${String(i).padStart(2, '0')}-${label}`)
    }
    await p.goto(URL + q + '&kapitel=all&fest=advent')
    await p.locator('.garden-map').waitFor()
    await p.locator('.menu-fab').click()
    await p.locator('.nav-sheet').waitFor()
    await p.locator('.nav-menu-settings').click()
    await p.locator('.nav-settings').waitFor()
    await check(p, 'settings')
    await p.keyboard.press('Escape')
    await p.keyboard.press('Escape')
    // Ein Kapitel
    await p.locator('.tabbar .tab-garten').click()
    await p.locator('.plot-sheet').waitFor()
    await p.locator('.plot-sheet button').nth(2).click()
    await p.waitForTimeout(500)
    await check(p, 'chapter-letter')
    await p.locator('.orchard-intro .btn').click().catch(() => {})
    await p.waitForTimeout(600)
    await check(p, 'chapter-map')
    await p.locator('.garden-plot').first().click()
    await p.locator('.upgrade-hud').waitFor().catch(() => {})
    await check(p, 'chapter-upgrade')
    await ctx.close()
  }

  // Saisonende-Zeremonie
  {
    const owned = { gemuesebeet: 40, kompost: 30, kraeuterspirale: 20, beerenhecke: 10 }
    const { ctx, p } = await seeded({ owned, ernte: 5e7, ernteSeason: 5e7, saisonenden: 0, erbstuecke: 0 })
    await p.goto(URL + q)
    await p.locator('.tabbar .tab-prestige').click()
    await p.waitForTimeout(400)
    await p.locator('.btn.prestige').first().click()
    await p.locator('.season-ceremony').waitFor()
    await check(p, 'ceremony-winter')
    await p.locator('.season-ceremony').click()
    const letterBtn = p.locator('.season-letter .btn')
    if (await letterBtn.isVisible().catch(() => false)) {
      await check(p, 'ceremony-letter')
      await letterBtn.click()
    }
    await p.locator('.lucky-wheel').waitFor()
    await check(p, 'ceremony-wheel')
    await p.locator('.lucky-wheel .btn').click()
    // Rad ausdrehen lassen, dann Ergebnis + „Ins neue Gartenjahr“
    await p.waitForTimeout(4500)
    await check(p, 'ceremony-spring')
    await ctx.close()
  }

  // Installations-Hinweis und Testphase
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + q + '&installGate=1')
    await p.locator('.web-install').waitFor()
    await check(p, 'install-gate')
    await p.goto(URL + q + '&testPhase=1')
    await p.locator('.test-phase').waitFor()
    await check(p, 'test-phase')
    await ctx.close()
  }

  console.log(`${LANG}: ${seen.length} Ansichten geprüft → ${SHOTS}/`)
  console.log(seen.join(', '))
  if (problems.length) {
    console.log(`\n${problems.length} Auffälligkeiten:`)
    for (const x of [...new Set(problems)]) console.log(' - ' + x)
  }
  if (errors.length) console.log('\npage errors: ' + errors.join(' | '))
  if (errors.length || (process.argv.includes('--strict') && problems.length)) process.exitCode = 1
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  await browser?.close()
  server.kill()
}
