/**
 * End-to-end smoke test: builds nothing, serves dist/ via `vite preview`,
 * then plays through the core loop in a phone-sized Chromium.
 *  1. Fresh start: Omas letter → Gemüsebeet ausbauen → Gießen
 *  2. Near the gate: Saisonende → ceremony → Glücksrad → back in the garden
 *  3. Notebook + Spielstand-sichern sheets open
 *  4. Festladen, Kapitel 2 via ?kapitel2=1, Gartenhelfer, Update-Check
 * Fails on any uncaught page error. Run: npm run build && npm run e2e
 */
import { spawn } from 'node:child_process'
import { chromium, devices } from 'playwright'

const PORT = 4321
const URL = `http://localhost:${PORT}/`
const server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(URL)
      if (r.ok) return
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500))
  }
  throw new Error('preview server did not start')
}

function assert(cond, msg) {
  if (!cond) throw new Error('E2E: ' + msg)
}

const errors = []
let browser
try {
  await waitForServer()
  browser = await chromium.launch({ executablePath: process.env.PW_EXECUTABLE || undefined })

  // 1 — fresh start
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.getByText('Mein liebes Enkelkind,').waitFor({ timeout: 10_000 })
    await p.getByRole('button', { name: 'Zum Garten' }).click()
    const skip = p.getByText('Ohne Installation weiterspielen')
    if (await skip.isVisible().catch(() => false)) await skip.click()
    const before = await p.locator('.hud-amount').innerText()
    await p.locator('.garden-plot').first().dispatchEvent('click')
    const buy = p.locator('.upgrade-hud-buy')
    await buy.waitFor()
    await buy.dispatchEvent('pointerdown')
    await buy.dispatchEvent('pointerup')
    assert((await p.locator('#upgrade-title').innerText()) === 'Gemüsebeet', 'upgrade sheet shows Gemüsebeet')
    await p.locator('.upgrade-hud-close').click()
    await p.locator('.hud-water').dispatchEvent('click')
    await p.waitForTimeout(600)
    const after = await p.locator('.hud-amount').innerText()
    assert(after !== before, `Ernte changed after Gießen (${before} → ${after})`)
    await ctx.close()
  }

  // 2 — Saisonende with ceremony + wheel
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 40, kompost: 30, kraeuterspirale: 20, beerenhecke: 10 }
      localStorage.setItem('gartenerbe-save-v1', JSON.stringify({ owned, ernte: 5e7, ernteSeason: 5e7, lastSeen: Date.now() }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: 'Saison' }).click()
    const winter = p.locator('.btn.prestige').first()
    assert(await winter.isEnabled(), 'Winterruhe enabled at the gate')
    await winter.click()
    await p.locator('.season-ceremony').waitFor()
    await p.locator('.season-ceremony').click() // skip winter card
    const letterBtn = p.locator('.season-letter .btn')
    if (await letterBtn.isVisible().catch(() => false)) await letterBtn.click()
    await p.locator('.lucky-wheel .btn').click()
    await p.getByRole('button', { name: 'Ins neue Gartenjahr' }).waitFor({ timeout: 5000 })
    await p.getByRole('button', { name: 'Ins neue Gartenjahr' }).click()
    await p.locator('.garden-map').waitFor()
    // After Saisonende the map opens Omas best tip — close it
    const close = p.locator('.upgrade-hud-close')
    if (await close.isVisible().catch(() => false)) await close.click()
    // 3 — sheets
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: 'Omas Notizbuch' }).click()
    await p.getByText('Omas Notizbuch').first().waitFor()
    await p.locator('.notebook-close').click()
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: 'Spielstand sichern' }).click()
    const code = await p.locator('.save-code').first().inputValue()
    assert(code.startsWith('GARTENERBE1:'), 'export code present')
    await ctx.close()
  }

  // 4 — Festladen, Kapitel 2 (test hook) and the update check
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 30, kompost: 12 }
      localStorage.setItem('gartenerbe-save-v1', JSON.stringify({ owned, ernte: 1e5, prestiges: 2, erbstuecke: 500, lastSeen: Date.now() }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + '?fest=advent&kapitel2=1')
    await p.locator('.pill-fest').click()
    await p.getByText('Advent im Garten').first().waitFor()
    await p.locator('.fest-sheet .upgrade-hud-close').click()
    await p.locator('.plot-switch').click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.orchard-home').waitFor()
    await p.locator('.plot-switch').click()
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: 'Saison' }).click()
    await p.getByRole('button', { name: /Einstellen/ }).click()
    await p.getByText(/Stufe 1\/5/).waitFor()
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: 'Nach Updates suchen' }).click()
    await p.locator('.nav-update-note').waitFor()
    await ctx.close()
  }

  assert(errors.length === 0, 'page errors: ' + errors.join(' | '))
  console.log('E2E smoke passed ✔')
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  await browser?.close()
  server.kill()
}
