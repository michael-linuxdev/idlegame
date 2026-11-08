import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const APP = {
  name: 'Gartenerbe',
  short_name: 'Gartenerbe',
  description:
    'Vom Schrebergarten zum Gartenpark. Dein Garten wächst auch offline.',
  theme_color: '#e8f0e4',
  background_color: '#dce8d6',
}

export default defineConfig({
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
