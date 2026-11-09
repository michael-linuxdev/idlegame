/**
 * Google-Play-Feature-Grafik (1024×500) je Sprache: Titel, Tagline, Hinweis,
 * App-Icon und ein Store-Screenshot im Handyrahmen.
 * Usage: node scripts/store/feature-graphic.mjs en docs/store/screenshots-en/03-garden-park-evening.png docs/store/feature-graphic-en-1024x500.png
 */
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const [lang = 'en', shot, out] = process.argv.slice(2)
if (!shot || !out) throw new Error('Usage: node scripts/store/feature-graphic.mjs <de|en> <screenshot.png> <out.png>')
const TEXT = {
  de: { title: 'Gartenerbe', tagline: 'Vom Schrebergarten zum Gartenpark', pill: 'Idle-Garten · offline wachsen' },
  en: { title: 'Heirloom Garden', tagline: 'From overgrown plot to garden park', pill: 'Cozy idle garden · grows offline' },
}[lang]
const b64 = (p) => readFileSync(resolve(p)).toString('base64')
const font = (pkg, file) => `url(data:font/woff2;base64,${b64(`node_modules/@fontsource/${pkg}/files/${file}`)})`
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:Fraunces;font-weight:800;src:${font('fraunces', 'fraunces-latin-800-normal.woff2')}}
@font-face{font-family:Caveat;font-weight:600;src:${font('caveat', 'caveat-latin-600-normal.woff2')}}
@font-face{font-family:DM Sans;font-weight:700;src:${font('dm-sans', 'dm-sans-latin-700-normal.woff2')}}
html,body{margin:0;width:1024px;height:500px;overflow:hidden}
body{background:radial-gradient(circle at 30% 40%,#eef6e6,#cfe3c2);font-family:'DM Sans';color:#2e2418;position:relative}
.text{position:absolute;left:56px;top:110px;width:560px}
h1{font-family:Fraunces;font-weight:800;font-size:${lang === 'en' ? 72 : 88}px;line-height:1;margin:0 0 22px;letter-spacing:-0.01em}
p{font-family:Caveat;font-weight:600;font-size:44px;line-height:1.15;margin:0 0 28px;color:#345a2a;max-width:440px}
.pill{display:inline-block;background:#3f8f3a;color:#fff;font-size:22px;padding:12px 24px;border-radius:999px;box-shadow:0 3px 0 #2b6a26}
.phone{position:absolute;right:28px;top:22px;width:300px;height:640px;border-radius:38px;border:10px solid #fff;overflow:hidden;transform:rotate(6deg);box-shadow:0 20px 40px rgba(0,0,0,.18);background:#fff}
.phone img{width:100%;display:block}
.icon{position:absolute;left:548px;top:300px;width:150px;height:150px;border-radius:34px;transform:rotate(-8deg);box-shadow:0 12px 26px rgba(0,0,0,.2);overflow:hidden;border:4px solid #fff}
.icon img{width:100%;height:100%}
</style></head><body>
<div class="text"><h1>${TEXT.title}</h1><p>${TEXT.tagline}</p><span class="pill">${TEXT.pill}</span></div>
<div class="phone"><img src="data:image/png;base64,${b64(shot)}"></div>
<div class="icon"><img src="data:image/png;base64,${b64('docs/store/app-icon-1024.png')}"></div>
</body></html>`
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1024, height: 500 } })
await page.setContent(html)
await page.evaluate(() => document.fonts.ready)
await page.screenshot({ path: out })
await browser.close()
console.log('→ ' + out)
