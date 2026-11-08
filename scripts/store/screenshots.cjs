// Regenerates docs/store/screenshots (1290×2796, iPhone 6.7").
// Usage: npm run build && npx vite preview --port 4175 & node scripts/store/screenshots.cjs docs/store/screenshots
const { chromium } = require('playwright');
const OUT = process.argv[2];
const ids=['gemuesebeet','kompost','kraeuterspirale','beerenhecke','obstwiese','bienenstock','huehnerstall','gewaechshaus','hofladen','orangerie'];
async function scene(b, name, { owned, extra = {}, ftue = false, ambient = 'day-summer', after }) {
  const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
  const st = { owned, ash: 2e6, ashEarned: 2e6, lastSeen: Date.now(), ...extra };
  await ctx.addInitScript(([v, f]) => {
    if (sessionStorage.getItem('seed')) return
    localStorage.setItem('gartenerbe-save-v1', v)
    if (!f) localStorage.setItem('gartenerbe-ftue-v1', JSON.stringify({beat:'done',dismissed:true,completed:[],startedAt:1}))
    localStorage.setItem('gartenerbe-install-v1', JSON.stringify({dismissed:true,installed:false,shown:true}))
    localStorage.setItem('gartenerbe-notebook-v1', JSON.stringify({unlocked:['welcome'],read:['welcome'],maxStage:0}))
    sessionStorage.setItem('seed','1')
  }, [JSON.stringify(st), ftue]);
  const p = await ctx.newPage();
  await p.goto('http://localhost:4175/?ambient=' + ambient); await p.waitForTimeout(1600);
  // hide transient banners/events for clean shots
  await p.addStyleTag({ content: '.hud-pills-wrap,.float-pops,.hud-toast{display:none!important}' });
  if (after) await after(p);
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${OUT}/${name}.png` });
  await ctx.close();
}
(async () => {
  const b = await chromium.launch();
  const lv = (arr) => Object.fromEntries(ids.map((id, i) => [id, arr[i] ?? 0]));
  await scene(b, '01-omas-brief', { owned: lv([1]), ftue: true, extra: { ash: 30, ashEarned: 30 } });
  await scene(b, '02-garten-waechst', { owned: lv([34, 18, 9, 1]), extra: { prestiges: 1 } });
  await scene(b, '03-gartenpark-abend', { owned: lv([130, 120, 108, 96, 84, 72, 60, 50, 40, 30]), extra: { prestiges: 14, ash: 5e11 }, ambient: 'evening-summer' });
  await scene(b, '04-ausbauen', { owned: lv([60, 52, 40, 28, 12, 1]), extra: { prestiges: 3, ash: 9e7 }, after: async (p) => { await p.locator('.garden-plot').nth(1).click({ force: true }) } });
  await scene(b, '05-notizbuch', { owned: lv([40, 30, 20, 10, 5]), extra: { prestiges: 2 }, after: async (p) => { await p.locator('.laube-hotspot').click({ force: true }); await p.waitForTimeout(300); const back = p.locator('.notebook-back'); if (await back.isVisible()) await back.click() } });
  await scene(b, '06-winterruhe', { owned: lv([60, 50, 40, 30, 20, 10]), extra: { prestiges: 2, ash: 9e8, ashEarned: 9e8 }, after: async (p) => { await p.locator('.menu-fab').click(); await p.getByRole('menuitem', { name: 'Saison' }).click(); await p.waitForTimeout(300); await p.locator('.btn.prestige').first().click({ force: true }); await p.waitForTimeout(3200) } });
  await b.close();
})();
