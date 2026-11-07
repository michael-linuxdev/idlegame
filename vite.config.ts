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
    short_name: string
    description: string
    theme_color: string
    background_color: string
    iconDir: string
  }
> = {
  farm: {
    name: 'TurmFarm',
    short_name: 'TurmFarm',
    description:
      'Baue und betreibe urbane Vertikalfarmen. Module erzeugen Ertrag offline. Prestige für Münzen.',
    theme_color: '#e8f0e4',
    background_color: '#dce8d6',
    iconDir: 'icons/farm',
  },
  arcade: {
    name: 'Tokenhalle',
    short_name: 'Tokenhalle',
    description:
      'Baue und betreibe deine Retro-Arcade-Halle. Automaten erzeugen Tokens offline. Prestige für Tickets.',
    theme_color: '#e6eef8',
    background_color: '#d6e2f0',
    iconDir: 'icons/arcade',
  },
}

export default defineConfig(({ mode }) => {
  const skin = resolveSkin(mode)
  const meta = SKIN_META[skin]
  const icon = (file: string) => `${meta.iconDir}/${file}`

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
            .replace(
              /<link rel="icon"[^>]*>/,
              `<link rel="icon" type="image/svg+xml" href="./${icon('favicon.svg')}" />`,
            )
            .replace(
              /<link rel="apple-touch-icon"[^>]*>/,
              `<link rel="apple-touch-icon" sizes="180x180" href="./${icon('apple-touch-icon.png')}" />`,
            )
        },
      },
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: [
          'favicon.svg',
          'icons/farm/favicon.svg',
          'icons/arcade/favicon.svg',
          'icons/farm/apple-touch-icon.png',
          'icons/arcade/apple-touch-icon.png',
          'icons/farm/pwa-192.png',
          'icons/farm/pwa-512.png',
          'icons/farm/pwa-maskable-512.png',
          'icons/arcade/pwa-192.png',
          'icons/arcade/pwa-512.png',
          'icons/arcade/pwa-maskable-512.png',
        ],
        manifest: {
          name: meta.name,
          short_name: meta.short_name,
          description: meta.description,
          theme_color: meta.theme_color,
          background_color: meta.background_color,
          display: 'standalone',
          orientation: 'portrait',
          start_url: './',
          scope: './',
          icons: [
            {
              src: icon('pwa-192.png'),
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: icon('pwa-512.png'),
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: icon('pwa-maskable-512.png'),
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          // Tokenhalle is also published under /arcade/ on the same Pages site.
          // Keep the TurmFarm SW from hijacking those navigations.
          navigateFallbackDenylist: [/^\/arcade(?:\/|$)/],
        },
      }),
    ],
    server: {
      host: true,
      port: 5173,
    },
  }
})
