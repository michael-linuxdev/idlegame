/**
 * End-to-end smoke test: builds nothing, serves dist/ via `vite preview`,
 * then plays through the core loop in a phone-sized Chromium.
 *  1. Fresh start: Omas letter → Gemüsebeet ausbauen → Gießen
 *  2. Near the gate: Saisonende → ceremony → Glücksrad → back in the garden
 *  3. Notebook + Spielstand-sichern sheets open
 *  5. Alle Kapitel (?kapitel=all), Grundstücke-Auswahl, Gartenschau-Karte
 *  4. Festladen, Kapitel 2/3 via ?kapitel2=1&kapitel3=1, Weinlese, Gartenhelfer, Update-Check
 *  6. UX-Layout: Tutorial verdeckt sein Ziel nicht, Omas Notiz nie über Fenstern,
 *     Escape/Zurück schließen Fenster, Breitbild mit Seitenpanel; Screenshots in e2e-screens/
 *  7. Spielstand-Schutz: zweites Fenster speichert nicht, neuerer Stand bleibt unberührt
 *  8. Installations-Hinweis: Handy-Browser ja (mit ?installGate=1), Computer nein
 *  9. Testphase: Aufzeichnungs-Hinweis bestätigen, Häkchen an/aus, nur einmal
 * Fails on any uncaught page error. Run: npm run build && npm run e2e
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
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
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 5e7, ernteSeason: 5e7, lastSeen: Date.now() }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.locator('.tabbar .tab-prestige').click()
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
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 1e5, saisonenden: 2, erbstuecke: 500, lastSeen: Date.now() }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + '?fest=advent&kapitel2=1&kapitel3=1')
    await p.locator('.pill-fest').click()
    await p.getByText('Advent im Garten').first().waitFor()
    await p.locator('.fest-sheet .upgrade-hud-close').click()
    await p.getByRole('button', { name: 'Zur Streuobstwiese' }).click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.orchard-home').waitFor()
    await p.getByRole('button', { name: 'Zum Weinberg' }).click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.chapter-weinberg').waitFor()
    await p.locator('.pill-weinlese').click()
    await p.getByRole('button', { name: 'Los geht’s' }).click()
    await p.waitForTimeout(19_500)
    await p.getByRole('button', { name: 'Fertig' }).click()
    await p.locator('.plot-switch.back').click()
    await p.locator('.tabbar .tab-prestige').click()
    await p.getByRole('button', { name: /Einstellen/ }).click()
    await p.getByText(/Stufe 1\/5/).waitFor()
    await p.locator('.menu-fab').click()
    await p.getByRole('button', { name: 'Einstellungen' }).click()
    const signsToggle = p.getByRole('menuitemcheckbox', { name: /Schilder immer zeigen/ })
    await signsToggle.click()
    assert((await signsToggle.getAttribute('aria-checked')) === 'true', 'Schilder immer zeigen toggles on')
    await p.getByRole('menuitem', { name: 'Nach Updates suchen' }).click()
    await p.locator('.nav-update-note').waitFor()
    await ctx.close()
  }

  // 5 — all chapters via ?kapitel=all, Grundstücke picker, a generic chapter map
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned: { gemuesebeet: 20 }, ernte: 1e4, lastSeen: Date.now(), saveVersion: 1 }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + '?kapitel=all')
    const badges = await p.locator('.garden-plot .plot-sign').count()
    await p.evaluate(() => localStorage.setItem('gartenerbe-pref-signs', '1'))
    await p.reload()
    assert((await p.locator('.garden-plot .plot-sign').count()) >= badges, 'signs pref survives reload')
    await p.getByRole('button', { name: 'Grundstück wählen' }).click()
    await p.getByRole('button', { name: /Kapitel 12/ }).click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.chapter-gartenschau').waitFor()
    // Kapitel-Grafik kommt als eigenes Bündel nach: Kulisse und Bereichsgrafik müssen erscheinen
    await p.locator('.chapter-gartenschau .garden-ground').waitFor()
    assert((await p.locator('.chapter-gartenschau .garden-plot .plot-visual svg *').count()) > 20, 'chapter art loaded')
    await p.locator('.garden-plot').first().click()
    await p.locator('.upgrade-hud-buy').waitFor()
    await ctx.close()
  }

  // 6 — UX layout checks (+ screenshots in e2e-screens/ for a human look)
  {
    const SHOTS = 'e2e-screens'
    await mkdir(SHOTS, { recursive: true })
    const overlap = (a, b) =>
      a && b && a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height

    // 6a — the tutorial never covers the plot it talks about
    {
      const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
      const p = await ctx.newPage()
      p.on('pageerror', (e) => errors.push(e.message))
      await p.goto(URL)
      await p.getByRole('button', { name: 'Zum Garten' }).click()
      await p.locator('.ftue-target').first().waitFor()
      await p.waitForTimeout(1200)
      const coach = await p.locator('.ftue-coach').boundingBox()
      const target = await p.locator('.ftue-target').first().boundingBox()
      assert(!overlap(coach, target), 'FTUE coach covers its own target')
      await p.screenshot({ path: `${SHOTS}/ftue.png` })
      await ctx.close()
    }

    const seeded = async (opts) => {
      const ctx = await browser.newContext({ reducedMotion: 'reduce', ...opts })
      await ctx.addInitScript(() => {
        if (sessionStorage.getItem('seed')) return
        const owned = { gemuesebeet: 60, kompost: 40, kraeuterspirale: 30, beerenhecke: 20, obstwiese: 10, bienenstock: 5 }
        localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 3e6, ernteSeason: 4e6, saisonenden: 4, erbstuecke: 900, lastSeen: Date.now(), saveVersion: 1 }))
        localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
        localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
        sessionStorage.setItem('seed', '1')
      })
      const p = await ctx.newPage()
      p.on('pageerror', (e) => errors.push(e.message))
      return { ctx, p }
    }

    // 6b — Omas note never sits on an open window; Zurück closes windows, not the app
    {
      const { ctx, p } = await seeded(devices['iPhone 13'])
      await p.goto(URL + '?kapitel=all')
      await p.locator('.garden-map').waitFor()
      await p.screenshot({ path: `${SHOTS}/map.png` })
      await p.locator('.tabbar .tab-fortress').click() // Garten again → Grundstücke
      await p.locator('.plot-sheet').waitFor()
      await p.waitForTimeout(400)
      assert((await p.locator('.oma-hint').count()) === 0, 'Omas note shows over the Grundstücke window')
      await p.getByRole('button', { name: /Kapitel 12/ }).scrollIntoViewIfNeeded()
      await p.screenshot({ path: `${SHOTS}/plots.png` })
      await p.keyboard.press('Escape')
      assert((await p.locator('.plot-sheet').count()) === 0, 'Escape closes the Grundstücke window')
      await p.locator('.garden-plot.planted').first().dispatchEvent('click')
      await p.locator('.upgrade-hud').waitFor()
      await p.screenshot({ path: `${SHOTS}/upgrade.png` })
      await p.goBack()
      await p.waitForTimeout(300)
      assert((await p.locator('.upgrade-hud').count()) === 0, 'Zurück closes the Ausbau window')
      assert(p.url().startsWith(URL), 'Zurück stays in the app')
      await p.locator('.hud-wallet').click()
      await p.locator('.mult-sheet').waitFor()
      await p.screenshot({ path: `${SHOTS}/boni.png` })
      await p.keyboard.press('Escape')
      await p.locator('.menu-fab').click()
      await p.locator('.nav-sheet').waitFor()
      await p.screenshot({ path: `${SHOTS}/menu.png` })
      await p.keyboard.press('Escape')
      assert((await p.locator('.nav-sheet').count()) === 0, 'Escape closes the menu')
      for (const tab of ['prestige', 'shop']) {
        await p.locator(`.tabbar .tab-${tab}`).click()
        await p.waitForTimeout(300)
        await p.screenshot({ path: `${SHOTS}/${tab}.png` })
      }
      await p.goBack()
      await p.locator('.garden-map').waitFor()
      assert(p.url().startsWith(URL), 'Zurück from a panel stays in the app')
      await ctx.close()
    }

    // 6c — wide screens: map and panel side by side
    {
      const { ctx, p } = await seeded({ viewport: { width: 1280, height: 800 } })
      await p.goto(URL)
      await p.locator('.garden-map').waitFor()
      await p.locator('.tabbar .tab-shop').click()
      await p.locator('.app-side').waitFor()
      assert((await p.locator('.garden-map').count()) === 1, 'map stays visible next to the Markt on wide screens')
      await p.screenshot({ path: `${SHOTS}/desktop.png` })
      await ctx.close()
    }
  }

  // 7 — Spielstand-Schutz: nur ein Fenster speichert; neuerer Stand wird nie überschrieben
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    const a = await ctx.newPage()
    a.on('pageerror', (e) => errors.push(e.message))
    await a.goto(URL)
    await a.waitForTimeout(800)
    const b = await ctx.newPage()
    b.on('pageerror', (e) => errors.push(e.message))
    await b.goto(URL)
    await b.locator('.save-guard').waitFor()
    assert((await a.locator('.save-guard').count()) === 0, 'first window may save')
    await a.close()
    await b.waitForTimeout(2500)
    assert((await b.locator('.save-guard').count()) === 0, 'second window takes over after the first closes')
    await ctx.close()

    const ctx2 = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx2.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      sessionStorage.setItem('seed', '1')
      const save = { saveVersion: 99, zukunft: { x: 1 }, samen: 777, ernte: 5, lastSeen: Date.now(), owned: { gemuesebeet: 3 } }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify(save))
    })
    const p = await ctx2.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.locator('.save-guard').waitFor()
    await p.reload()
    await p.waitForTimeout(500)
    const kept = await p.evaluate(() => JSON.parse(localStorage.getItem('gartenerbe-spielstand-v1') || '{}'))
    assert(kept.saveVersion === 99 && kept.samen === 777 && kept.zukunft?.x === 1, 'newer save stays untouched')
    await ctx2.close()

    // Neues Speicherformat (2026-11-09): frischer Start unter neuem Schlüssel, alter Stand bleibt liegen
    const ctx3 = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    const OLD = JSON.stringify({ saveVersion: 2, ash: 1, emberUpgrades: { dominionYield: 3 }, ernte: 4242, samen: 555, lastSeen: 1 })
    await ctx3.addInitScript((old) => {
      if (sessionStorage.getItem('seed')) return
      sessionStorage.setItem('seed', '1')
      localStorage.setItem('gartenerbe-save-v1', old)
    }, OLD)
    const q = await ctx3.newPage()
    q.on('pageerror', (e) => errors.push(e.message))
    await q.goto(URL)
    await q.waitForFunction(() => localStorage.getItem('gartenerbe-spielstand-v1') !== null, null, { timeout: 15000 })
    const fresh = await q.evaluate(() => JSON.parse(localStorage.getItem('gartenerbe-spielstand-v1') || '{}'))
    assert(fresh.saveVersion === 1, 'new save key with saveVersion 1')
    assert(fresh.samen !== 555 && fresh.truhe && fresh.emberUpgrades === undefined, 'old save is not read')
    assert((await q.evaluate(() => localStorage.getItem('gartenerbe-save-v1'))) === OLD, 'old save key stays untouched')
    await ctx3.close()
  }

  // 8 — Installations-Hinweis (Web-Fassung): Handy-Browser ja, Computer nein, „weiter“ merkt sich das
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL + '?installGate=1')
    await p.locator('.web-install').waitFor()
    assert(await p.getByText('Zum Home-Bildschirm').first().isVisible(), 'iPhone steps shown')
    assert((await p.locator('.web-install-warn').count()) === 1, 'iOS warning shown')
    await p.getByRole('button', { name: 'Ohne Installation im Browser weiter' }).click()
    assert((await p.locator('.web-install').count()) === 0, 'skip closes the gate')
    const skip = await p.evaluate(() => localStorage.getItem('gartenerbe-install-gate-skip'))
    assert(Number(skip) > 0, 'skip time stored')
    await ctx.close()

    const desk = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const d = await desk.newPage()
    d.on('pageerror', (e) => errors.push(e.message))
    await d.goto(URL + '?installGate=1')
    await d.waitForTimeout(800)
    assert((await d.locator('.web-install').count()) === 0, 'no install gate on a computer')
    await desk.close()
  }

  // 9 — Testphase: Hinweis zur Aufzeichnung muss bestätigt werden, Häkchen schaltet das Log
  {
    for (const keep of [true, false]) {
      const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
      const p = await ctx.newPage()
      p.on('pageerror', (e) => errors.push(e.message))
      await p.goto(URL + '?testPhase=1')
      await p.locator('.test-phase').waitFor()
      const box = p.getByRole('checkbox', { name: 'Aufzeichnung erlauben' })
      assert(await box.isChecked(), 'recording is preselected')
      if (!keep) await box.uncheck()
      await p.getByRole('button', { name: 'Verstanden' }).click()
      assert((await p.locator('.test-phase').count()) === 0, 'notice closes after confirm')
      const st = await p.evaluate(() => [localStorage.getItem('gartenerbe-playtest-log-on'), localStorage.getItem('gartenerbe-testphase-v1')])
      assert(st[0] === (keep ? '1' : '0') || (!keep && st[0] === null), `log ${keep ? 'on' : 'off'} after confirm`)
      assert(JSON.parse(st[1] || '{}').logging === keep, 'consent stored')
      await p.goto(URL + '?testPhase=1')
      await p.waitForTimeout(600)
      assert((await p.locator('.test-phase').count()) === 0, 'asked only once')
      await ctx.close()
    }
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
