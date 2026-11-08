import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { purgeLegacyStorage } from './game/legacyStorage'
import { ErrorBoundary } from './components/ErrorBoundary'
import { logPlaytest } from './game/playtestLog'
import { startSaveLock } from './game/saveGuard'
import './theme/fonts'
import './index.css'

purgeLegacyStorage()
// Nur ein Fenster speichert (vor dem ersten Laden des Spielstands)
startSaveLock()
// Browser bitten, den Speicher nicht von sich aus zu löschen (iOS/Safari)
try {
  void navigator.storage?.persist?.().then((persisted) => logPlaytest('storage', { persisted }))
} catch {
  /* nicht unterstützt */
}
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
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
