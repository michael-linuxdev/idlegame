import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { purgeLegacyStorage } from './game/legacyStorage'
import './theme/fonts'
import './index.css'

purgeLegacyStorage()
registerSW({ immediate: true })

// Nur Hochformat: Android-PWA sperrt die Drehung, iOS zeigt den Hinweis (CSS .rotate-lock)
try {
  const o = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }
  o?.lock?.('portrait').catch(() => {})
} catch {
  /* not supported */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
