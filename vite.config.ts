import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

type Skin = 'farm' | 'arcade'

function resolveSkin(mode: string): Skin {
  const env = loadEnv(mode, process.cwd(), '')
  const raw = (env.VITE_THEME ?? 'farm').toLowerCase()
  if (raw === 'arcade' || raw === 'tokenhalle') return 'arcade'
  return 'farm'
}

const SKIN_META: Record<
  Skin,
  {
    name: string
    description: string
    theme_color: string
    background_color: string
  }
> = {
  farm: {
    name: 'TurmFarm',
    description:
      'Baue und betreibe urbane Vertikalfarmen. Module erzeugen Ertrag offline. Prestige für Münzen.',
    theme_color: '#e8f0e4',
    background_color: '#dce8d6',
  },
  arcade: {
    name: 'Tokenhalle',
    description:
      'Baue und betreibe deine Retro-Arcade-Halle. Automaten erzeugen Tokens offline. Prestige für Tickets.',
    theme_color: '#e6eef8',
    background_color: '#d6e2f0',
  },
}

export default defineConfig(({ mode }) => {
  const skin = resolveSkin(mode)
  const meta = SKIN_META[skin]

  return {
    // Relative base: works on custom-domain root AND project Pages (/idlegame/).
    // Primary URL once CNAME is attached: https://idlegame.micana.de
    base: './',
    plugins: [
      react(),
      {
        name: 'skin-html-meta',
        transformIndexHtml(html) {
          return html
            .replace(/data-theme="[^"]*"/, `data-theme="${skin}"`)
            .replace(
              /<meta name="theme-color" content="[^"]*" \/>/,
              `<meta name="theme-color" content="${meta.theme_color}" />`,
            )
            .replace(
              /<meta name="apple-mobile-web-app-title" content="[^"]*" \/>/,
              `<meta name="apple-mobile-web-app-title" content="${meta.name}" />`,
            )
            .replace(
              /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
              `<meta name="description" content="${meta.name} — ${meta.description}" />`,
            )
            .replace(/<title>[^<]*<\/title>/, `<title>${meta.name}</title>`)
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'icons.svg'],
        manifest: {
          name: meta.name,
          short_name: meta.name,
          description: meta.description,
          theme_color: meta.theme_color,
          background_color: meta.background_color,
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          icons: [
            {
              src: 'pwa-192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: 'pwa-512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        },
      }),
    ],
    server: {
      host: true,
      port: 5173,
    },
  }
})
