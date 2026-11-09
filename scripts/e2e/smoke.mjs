/**
 * End-to-end smoke test: builds nothing, serves dist/ via `vite preview`,
 * then plays through the core loop in a phone-sized Chromium.
 *  1. Fresh start: Omas letter → Gemüsebeet ausbauen → Gießen
 *  2. Near the gate: Saisonende → ceremony → Glücksrad → back in the garden
 *  3. Notebook + Spielstand-sichern sheets open
 *  5. Alle Kapitel (?kapitel=all), Grundstücke-Auswahl, Gartenschau-Karte;
 *     5b Abschluss-Szene von Kapitel 50 (einmalig, gespeichert, Fokus, Escape)
 *     5c Kapitel-Meisterschaft: Stern beim Ausbau, Hinweis, Kopfleiste, Sammlung
 *  4. Festladen, Kapitel 2/3 via ?kapitel2=1&kapitel3=1, Weinlese, Gartenhelfer, Update-Check
 *  6. UX-Layout: Tutorial verdeckt sein Ziel nicht, Omas Notiz nie über Fenstern,
 *     Escape/Zurück schließen Fenster, Breitbild mit Seitenpanel; Screenshots in e2e-screens/
 *  7. Spielstand-Schutz: zweites Fenster speichert nicht, neuerer Stand bleibt unberührt
 *  8. Installations-Hinweis: Handy-Browser ja (mit ?installGate=1), Computer nein
 *  9. Testphase: Aufzeichnungs-Hinweis bestätigen, Häkchen an/aus, nur einmal
 * 10. Offline: nach dem ersten Laden aus dem Precache, auch die nachgeladenen Fenster
 * 11. Sprache: Browser en-US startet englisch, Umschalter wechselt live (ohne Neuladen),
 *     die Wahl übersteht das Neuladen, ?lang= hat Vorrang
 * 12. Deko und Saatgut kreuzen öffnen auch aus Markt und Saison
 * Alle anderen Abschnitte laufen mit Browser-Sprache de-DE.
 * Fails on any uncaught page error. Run: npm run build && npm run e2e
 */
import { spawn } from 'node:child_process'
import { mkdir } from 'node:fs/promises'
import { chromium, devices } from 'playwright'
import { rolldown } from 'rolldown'

/** Sprache des Durchlaufs: E2E_LANG=en spielt alles auf Englisch (Abschnitt 11 prüft beide). */
const LANG = process.env.E2E_LANG === 'en' ? 'en' : 'de'

/** Texte der gewählten Sprache direkt aus src/i18n (gebündelt, keine Kopie). */
async function loadStrings(lang) {
  const bundle = await rolldown({ input: `src/i18n/${lang}/strings.ts`, logLevel: 'silent' })
  const { output } = await bundle.generate({ format: 'esm' })
  await bundle.close()
  const mod = await import('data:text/javascript;base64,' + Buffer.from(output[0].code).toString('base64'))
  return mod.strings
}
const T = await loadStrings(LANG)
const esc = (x) => x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const PORT = 4321
const URL = `http://localhost:${PORT}/`
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
// Direkt statt über npx: kill() beendet so wirklich den Server (npx ließ ihn als Waise weiterlaufen)
server.on('exit', (code) => code && console.log(`Hinweis: Port ${PORT} ist belegt — der Test nutzt den laufenden Vorschau-Server`))

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
  // Browser-Sprache des Durchlaufs, außer ein Abschnitt verlangt etwas anderes
  const plainContext = browser.newContext.bind(browser)
  browser.newContext = (opts = {}) => plainContext({ locale: LANG === 'en' ? 'en-US' : 'de-DE', ...opts })

  // 1 — fresh start
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.getByText(T.ftue.welcome.title).waitFor({ timeout: 10_000 })
    await p.getByRole('button', { name: T.ftue.welcome.cta }).click()
    const skip = p.getByText(T.install.skipBrowser)
    if (await skip.isVisible().catch(() => false)) await skip.click()
    const before = await p.locator('.hud-amount').innerText()
    await p.locator('.garden-plot').first().dispatchEvent('click')
    const buy = p.locator('.upgrade-hud-buy')
    await buy.waitFor()
    await buy.dispatchEvent('pointerdown')
    await buy.dispatchEvent('pointerup')
    assert((await p.locator('#upgrade-title').innerText()) === T.modules.gemuesebeet.name, 'upgrade sheet shows Gemüsebeet')
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
    await p.getByRole('button', { name: T.season.cta }).waitFor({ timeout: 5000 })
    await p.getByRole('button', { name: T.season.cta }).click()
    await p.locator('.garden-map').waitFor()
    // After Saisonende the map opens Omas best tip — close it
    const close = p.locator('.upgrade-hud-close')
    if (await close.isVisible().catch(() => false)) await close.click()
    // 3 — sheets
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: T.notebook.title }).click()
    await p.getByText(T.notebook.title).first().waitFor()
    await p.locator('.notebook-close').click()
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: T.backup.menu }).click()
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
    await p.getByText(T.fest.names.advent).first().waitFor()
    await p.locator('.fest-sheet .upgrade-hud-close').click()
    await p.getByRole('button', { name: T.orchard.toOrchard }).click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.orchard-home').waitFor()
    await p.getByRole('button', { name: T.chapters.weinberg.to }).click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.chapter-weinberg').waitFor()
    await p.locator('.pill-weinlese').click()
    await p.getByRole('button', { name: T.weinlese.start }).click()
    await p.waitForTimeout(19_500)
    await p.getByRole('button', { name: T.weinlese.done, exact: true }).click()
    await p.locator('.plot-switch.back').click()
    await p.locator('.tabbar .tab-prestige').click()
    await p.getByRole('button', { name: new RegExp(esc(T.helper.hire('').replace(/ ·.*$/, ''))) }).click()
    await p.getByText(T.helper.rank(1, 5)).waitFor()
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: T.nav.settings }).click()
    const signsToggle = p.getByRole('switch', { name: T.prefs.signs })
    await signsToggle.click()
    assert((await signsToggle.getAttribute('aria-checked')) === 'true', 'Schilder immer zeigen toggles on')
    await p.getByRole('button', { name: T.appUpdate.menu }).click()
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
    await p.getByRole('button', { name: T.plots.aria }).click()
    await p.getByRole('button', { name: T.chapterUi.chapter(12) }).click()
    await p.locator('.orchard-intro .btn').click()
    await p.locator('.chapter-gartenschau').waitFor()
    // Kapitel-Grafik kommt als eigenes Bündel nach: Kulisse und Bereichsgrafik müssen erscheinen
    await p.locator('.chapter-gartenschau .garden-ground').waitFor()
    assert((await p.locator('.chapter-gartenschau .garden-plot .plot-visual svg *').count()) > 20, 'chapter art loaded')
    await p.locator('.garden-plot').first().click()
    await p.locator('.upgrade-hud-buy').waitFor()
    // Kapitel 13–50 (Welle 1–8): Brief, Kulisse, Bereichsgrafik; Bildschirmfotos für einen Blick von Hand
    await mkdir('e2e-screens/kapitel', { recursive: true })
    for (const [n, id] of [[13, 'stadtgarten'], [14, 'klostergarten'], [15, 'schlossgarten'], [16, 'baumschule'], [17, 'moorgarten'], [18, 'deichgarten'], [19, 'spreewald'], [20, 'cottagegarten'], [21, 'tulpenfelder'], [22, 'artischocken'], [23, 'beerenwald'], [24, 'patio'], [25, 'korkeichen'], [26, 'paprikafelder'], [27, 'aranfelder'], [28, 'rosental'], [29, 'pistazien'], [30, 'andenkartoffeln'], [31, 'milpa'], [32, 'kaffeewald'], [33, 'reisterrassen'], [34, 'gewuerzgarten'], [35, 'oase'], [36, 'kakaogarten'], [37, 'buschgarten'], [38, 'farngarten'], [39, 'kimchigarten'], [40, 'dachgarten'], [41, 'schulgarten'], [42, 'waldgarten'], [43, 'samenbank'], [44, 'klimagarten'], [45, 'wildblumenband'], [46, 'fassadengarten'], [47, 'solawihof'], [48, 'saatguttausch'], [49, 'weltgartenschau'], [50, 'omasgarten']]) {
      await p.keyboard.press('Escape')
      await p.getByRole('button', { name: T.plots.aria }).click()
      await p.getByRole('button', { name: T.chapterUi.chapter(n) }).click()
      await p.locator('.orchard-intro').waitFor()
      await p.waitForTimeout(600)
      if (LANG === 'de') await p.screenshot({ path: `e2e-screens/kapitel/${id}-brief.png` })
      await p.locator('.orchard-intro .btn').click()
      await p.locator(`.chapter-${id} .garden-ground`).waitFor()
      assert((await p.locator(`.chapter-${id} .garden-plot .plot-visual svg *`).count()) > 20, `${id}: chapter art loaded`)
      await p.waitForTimeout(300)
      await p.screenshot({ path: `e2e-screens/kapitel/${id}-${LANG}.png` })
    }
    await ctx.close()
  }

  // 5b — Abschluss-Szene: Kapitel 50 ganz angelegt → einmal die Familie auf Omas Bank, danach normal weiter
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const areas = ['omasbeet', 'omaskompost', 'omasspirale', 'omashecke', 'opasapfel', 'omasbienen', 'omashuehner', 'altglashaus', 'omaslaube', 'omasbank']
      const owned = Object.fromEntries(areas.map((a, i) => [a, 10 + (9 - i) * 3]))
      const omasgarten = { cur: 50, curLifetime: 1e6, owned, openedAt: 1, introSeen: true }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned: { gemuesebeet: 20 }, ernte: 1e4, lastSeen: Date.now(), saveVersion: 1, chapters: { omasgarten } }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    // Nur Kapitel 50 ist offen: der Knopf an der Seite führt direkt hin
    const openChapter50 = async () => {
      if (!(await p.locator('.chapter-omasgarten').count())) await p.getByRole('button', { name: T.chapters.omasgarten.to }).click()
      await p.locator('.chapter-omasgarten .garden-ground').waitFor()
    }
    await p.goto(URL)
    await openChapter50()
    const scene = p.getByRole('dialog', { name: T.chapterUi.finale.title })
    await scene.waitFor({ timeout: 10_000 })
    assert(await scene.getByRole('img', { name: T.chapterUi.finale.sceneAria }).isVisible(), 'finale: scene picture has a label')
    assert((await scene.locator('text').innerHTML()).includes(T.chapterUi.finale.packet), 'finale: packet says „Für dich“')
    const cta = scene.getByRole('button', { name: T.chapterUi.finale.cta })
    assert(await cta.evaluate((b) => b === document.activeElement), 'finale: focus on the button')
    await p.keyboard.press('Tab')
    assert(await cta.evaluate((b) => b === document.activeElement), 'finale: Tab stays in the dialog')
    await p.waitForTimeout(400)
    await p.screenshot({ path: `e2e-screens/kapitel/abschluss-${LANG}.png` })
    await p.keyboard.press('Escape')
    await scene.waitFor({ state: 'detached' })
    await p.waitForTimeout(300)
    await p.screenshot({ path: `e2e-screens/kapitel/omasgarten-voll-${LANG}.png` })
    // gespeichert: nach dem Neuladen kommt die Szene nicht wieder
    await p.waitForTimeout(4500)
    await p.reload()
    await openChapter50()
    await p.waitForTimeout(800)
    assert((await p.locator('.abschluss-scene').count()) === 0, 'finale: shown only once')
    assert(await p.evaluate(() => JSON.parse(localStorage.getItem('gartenerbe-spielstand-v1')).abschlussSeen === true), 'finale: seen is saved')
    await ctx.close()
  }

  // 5c — Kapitel-Meisterschaft: letzter Bereich auf Stufe 100 → Stern, Hinweis, Kopfleiste und Sammlung zeigen ihn
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const areas = ['apfel', 'birne', 'kirsche', 'zwetschge', 'schafe', 'wildbienen', 'walnuss', 'mosterei', 'doerrhaus', 'obstmarkt']
      const owned = Object.fromEntries(areas.map((a) => [a, a === 'obstmarkt' ? 99 : 120]))
      const obstwiese = { cur: 1e18, curLifetime: 1e18, owned, openedAt: 1, introSeen: true }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned: { gemuesebeet: 20 }, ernte: 1e4, tiefeWinter: 1, lastSeen: Date.now(), saveVersion: 1, chapters: { obstwiese } }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.getByRole('button', { name: T.chapters.obstwiese.to }).click()
    await p.locator('.chapter-obstwiese .garden-ground').waitFor()
    const hudStars = (n) => p.locator('.orchard-bonus-row').getByRole('img', { name: T.mastery.starsAria(n, 3) })
    await hudStars(0).waitFor()
    await p.locator('.garden-plot').filter({ hasText: T.orchard.areas.obstmarkt.name }).first().click()
    const buy = p.locator('.upgrade-hud-buy')
    await buy.waitFor()
    await buy.dispatchEvent('pointerdown')
    await buy.dispatchEvent('pointerup')
    await p.locator('.hud-toast').filter({ hasText: T.mastery.toast(1, 5) }).waitFor({ timeout: 5000 })
    await p.locator('.upgrade-hud-close').click()
    await hudStars(1).waitFor()
    await p.screenshot({ path: `e2e-screens/kapitel/meisterschaft-karte-${LANG}.png` })
    // Sammlung & Ziele: Summe und Zeile von Kapitel 2
    await p.locator('.menu-fab').click()
    await p.locator('.nav-menu-item').filter({ hasText: T.collections.menu }).first().click()
    const sheet = p.locator('.collection-sheet')
    await sheet.waitFor()
    const summary = await sheet.locator('[data-testid="mastery-summary"]').innerText()
    assert(summary.includes(T.mastery.summary(1, 49 * 3)), `mastery: summary shows 1 star (${summary})`)
    assert(await sheet.getByRole('img', { name: T.mastery.starsAria(1, 3) }).first().isVisible(), 'mastery: chapter 2 row shows its star')
    assert((await sheet.locator('.collection-chapters').innerText()).includes(T.mastery.nextCare(0, 10, 5)), 'mastery: next star needs care rank 5')
    await p.screenshot({ path: `e2e-screens/kapitel/meisterschaft-sammlung-${LANG}.png` })
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
      await p.getByRole('button', { name: T.ftue.welcome.cta }).click()
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
      await p.locator('.tabbar .tab-garten').click() // Garten again → Grundstücke
      await p.locator('.plot-sheet').waitFor()
      await p.waitForTimeout(400)
      assert((await p.locator('.oma-hint').count()) === 0, 'Omas note shows over the Grundstücke window')
      await p.getByRole('button', { name: T.chapterUi.chapter(12) }).scrollIntoViewIfNeeded()
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
    // altname-ok: alter Stand unter altem Schlüssel
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
    // altname-ok
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
    assert(await p.getByText(T.install.iosAdd).first().isVisible(), 'iPhone steps shown')
    assert((await p.locator('.web-install-warn').count()) === 1, 'iOS warning shown')
    await p.getByRole('button', { name: T.installGate.skip }).click()
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
      const box = p.getByRole('checkbox', { name: T.testPhase.checkbox })
      assert(await box.isChecked(), 'recording is preselected')
      if (!keep) await box.uncheck()
      await p.getByRole('button', { name: T.testPhase.confirm }).click()
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

  // 10 — Offline: nach dem ersten Laden läuft alles aus dem Precache, auch die nachgeladenen Fenster
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 30, kompost: 12 }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 1e5, saisonenden: 2, erbstuecke: 500, lastSeen: Date.now(), saveVersion: 1 }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (e) => errors.push(e.message))
    await p.goto(URL)
    await p.locator('.garden-map').waitFor()
    // Service Worker aktiv und Precache fertig
    await p.evaluate(async () => {
      const reg = await navigator.serviceWorker.ready
      if (!navigator.serviceWorker.controller) {
        await new Promise((r) => navigator.serviceWorker.addEventListener('controllerchange', r, { once: true }))
      }
      return reg.active?.state
    })
    await ctx.setOffline(true)
    await p.reload()
    await p.locator('.garden-map').waitFor()
    assert(await p.evaluate(() => !navigator.onLine), 'context is offline')
    for (const tab of ['prestige', 'shop']) {
      await p.locator(`.tabbar .tab-${tab}`).click()
      await p.locator(tab === 'shop' ? '.shop-panel' : '#jump-truhe').first().waitFor({ timeout: 10_000 })
    }
    await p.locator('.tabbar .tab-garten').click()
    await p.locator('.menu-fab').click()
    await p.getByRole('menuitem', { name: T.notebook.title }).click()
    await p.getByText(T.notebook.title).first().waitFor({ timeout: 10_000 })
    await ctx.close()
  }

  // 12 — Deko und Saatgut kreuzen öffnen aus jedem Tab (liegen auf der Garten-Karte)
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 30, kompost: 20, kraeuterspirale: 10 }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 1e5, saisonenden: 3, samen: 200, collection: ['radieschenEiszapfen', 'wurmhumus'], lastSeen: Date.now(), saveVersion: 1 }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly', 'crossNew']))
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (err) => errors.push(err.message))
    await p.goto(URL)
    await p.locator('.garden-map').waitFor()
    for (const tab of ['garten', 'shop', 'prestige']) {
      for (const [name, sheet] of [[T.decor.title, '.decor-sheet, [aria-labelledby="decor-title"]'], [T.crossing.title, '.cross-sheet']]) {
        await p.locator(`.tabbar .tab-${tab}`).click()
        if (tab === 'garten') await p.keyboard.press('Escape') // Garten erneut → Grundstücke schließen
        await p.locator('.menu-fab').click()
        await p.getByRole('menuitem', { name }).click()
        await p.locator(sheet).first().waitFor({ timeout: 5000 }).catch(() => {
          throw new Error(`E2E: ${name} does not open from tab ${tab}`)
        })
        await p.keyboard.press('Escape')
        await p.waitForTimeout(200)
      }
    }
    await ctx.close()
  }

  // 13 — Testphase: Echtgeld-Angebote mit echtem Preis + Testgeld, Werbung sperrt das Spiel
  {
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce' })
    await ctx.addInitScript(() => {
      if (sessionStorage.getItem('seed')) return
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned: { gemuesebeet: 20 }, ernte: 1e4, samen: 10, lastSeen: Date.now(), saveVersion: 1 }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly', 'crossNew']))
      localStorage.setItem('gartenerbe-market-tab', 'seeds')
      sessionStorage.setItem('seed', '1')
    })
    const p = await ctx.newPage()
    p.on('pageerror', (err) => errors.push(err.message))
    await p.goto(URL)
    await p.locator('.garden-map').waitFor()
    await p.locator('.tabbar .tab-shop').click()
    await p.locator('.test-wallet-chip').waitFor()
    // „Eher nicht“: nichts gekauft, Guthaben unverändert
    await p.getByRole('button', { name: T.num.euro('6' + T.num.decimal + '99') }).click()
    await p.locator('.test-purchase').waitFor()
    await p.getByRole('button', { name: T.testMoney.no }).click()
    assert((await p.locator('.test-purchase').count()) === 0, 'dialog closes')
    assert((await p.evaluate(() => localStorage.getItem('gartenerbe-testgeld-v1'))) === null, 'no money spent on "no"')
    // „Ja“: 6,99 € vom Testgeld, 500 Samen gutgeschrieben
    await p.getByRole('button', { name: T.num.euro('6' + T.num.decimal + '99') }).click()
    await p.getByRole('button', { name: T.testMoney.yes }).click()
    const w = await p.evaluate(() => JSON.parse(localStorage.getItem('gartenerbe-testgeld-v1') || '{}'))
    assert(w.spentCents === 699, `test money spent: ${JSON.stringify(w)}`)
    if (LANG === 'de') await p.screenshot({ path: 'e2e-screens/testgeld.png' })
    // Werbung: sperrt das Spiel, Abbrechen gibt keine Belohnung
    await p.getByRole('tab', { name: T.shop.tabs.free }).click()
    await p.locator('.shop-ad-choices .btn').last().click()
    await p.locator('.ad-box').waitFor()
    if (LANG === 'de') await p.screenshot({ path: 'e2e-screens/werbung.png' })
    let blocked = false
    await p.locator('.tabbar .tab-garten').click({ timeout: 1500 }).catch(() => (blocked = true))
    assert(blocked, 'ad blocks the game')
    await p.getByRole('button', { name: T.testAd.cancel }).click()
    assert((await p.locator('.ad-box').count()) === 0, 'ad closes on cancel')
    await ctx.close()
  }

  // 11 — Sprache: Erkennung, Live-Umschalter, gespeicherte Wahl, ?lang=
  {
    const seed = () => {
      if (sessionStorage.getItem('seed')) return
      const owned = { gemuesebeet: 30, kompost: 12 }
      localStorage.setItem('gartenerbe-spielstand-v1', JSON.stringify({ owned, ernte: 1e5, saisonenden: 2, erbstuecke: 500, lastSeen: Date.now(), saveVersion: 1 }))
      localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({ beat: 'done', dismissed: true, completed: [], startedAt: 1 }))
      localStorage.setItem('gartenerbe-install-v1', JSON.stringify({ dismissed: true, installed: false, shown: true }))
      localStorage.setItem('gartenerbe-hints-v1', JSON.stringify(['season', 'truhe', 'deep', 'visitor', 'order', 'variety', 'weekly']))
      sessionStorage.setItem('seed', '1')
    }
    const lang = (p) => p.evaluate(() => document.documentElement.lang)
    const openSettings = async (p) => {
      await p.locator('.menu-fab').click()
      await p.locator('.nav-menu-settings').click()
      await p.locator('.nav-lang').waitFor()
    }

    // Englischer Browser → Englisch
    const enCtx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: 'en-US' })
    await enCtx.addInitScript(seed)
    const e = await enCtx.newPage()
    e.on('pageerror', (err) => errors.push(err.message))
    await e.goto(URL)
    await e.locator('.garden-map').waitFor()
    assert((await lang(e)) === 'en', 'en-US browser starts in English')
    assert((await e.locator('.tabbar .tab-garten').innerText()).includes('Garden'), 'English tab bar')
    await enCtx.close()

    // Deutscher Browser → Deutsch; Umschalter wechselt live und bleibt gespeichert
    const ctx = await browser.newContext({ ...devices['iPhone 13'], reducedMotion: 'reduce', locale: 'de-DE' })
    await ctx.addInitScript(seed)
    const p = await ctx.newPage()
    p.on('pageerror', (err) => errors.push(err.message))
    await p.goto(URL)
    await p.locator('.garden-map').waitFor()
    assert((await lang(p)) === 'de', 'de-DE browser starts in German')
    await openSettings(p)
    await p.evaluate(() => ((window).__noReload = true))
    await p.locator('.nav-lang [data-lang="en"]').click()
    await p.waitForFunction(() => document.documentElement.lang === 'en')
    assert(await p.evaluate(() => (window).__noReload === true), 'language switch needs no reload')
    assert((await p.locator('.nav-lang [data-lang="en"]').getAttribute('aria-checked')) === 'true', 'English is checked')
    assert((await p.locator('.nav-settings').innerText()).includes('Large text'), 'settings switch to English live and stay open')
    await p.locator('.nav-sheet-back').click()
    assert((await p.locator('.nav-menu-settings').innerText()).includes('Settings'), 'menu in English')
    await p.reload()
    await p.locator('.garden-map').waitFor()
    assert((await lang(p)) === 'en', 'language choice survives a reload')
    await p.goto(URL + '?lang=de')
    await p.locator('.garden-map').waitFor()
    assert((await lang(p)) === 'de', '?lang=de wins over the stored choice')
    await openSettings(p)
    await p.locator('.nav-lang [data-lang="de"]').click()
    await p.waitForFunction(() => document.documentElement.lang === 'de')
    await ctx.close()
  }

  assert(errors.length === 0, 'page errors: ' + errors.join(' | '))
  console.log(`E2E smoke passed ✔ (${LANG})`)
} catch (e) {
  console.error(e)
  process.exitCode = 1
} finally {
  await browser?.close()
  server.kill()
}
