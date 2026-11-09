import { execSync } from 'node:child_process'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { manifestStrings as de } from './src/i18n/de/manifest.ts'
import { manifestStrings as en } from './src/i18n/en/manifest.ts'

/**
 * The web manifest holds one language only (its `translations` member is not
 * supported by browsers yet). Name = brand; the description carries both
 * languages, German first. Store builds get their own texts per language
 * (docs/store/listing*.md).
 */
const APP = {
  name: de.name,
  short_name: de.name,
  description: `${de.description} · ${en.description}`,
  theme_color: '#e8f0e4',
  background_color: '#dce8d6',
}

function buildVersion(): string {
  const day = new Date().toISOString().slice(0, 10)
  try {
    const sha = execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
    return `${day} · ${sha}`
  } catch {
    return day
  }
}

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(buildVersion()),
  },
  // Relative base: works on the custom-domain root (idlegame.micana.de) and
  // on project Pages (/idlegame/).
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        ...APP,
        // Ausgangssprache; die Oberfläche wählt zur Laufzeit (src/i18n)
        lang: 'de',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        scope: './',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          {
            src: 'pwa-maskable-512.png',
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
})
