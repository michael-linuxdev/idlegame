import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { reloadForNewVersion } from './game/chunkReload'
import { logPlaytest } from './game/playtestLog'
import { startSaveLock } from './game/saveGuard'
import { initLocale } from './i18n'
import './theme/fonts'
import './index.css'

// Entwickler-Ansicht aller Grafiken (eigenes Bündel, berührt keinen Spielstand)
if (new URLSearchParams(location.search).has('artsheet')) {
  void import('./dev/ArtSheet').then(({ default: ArtSheet }) => {
    createRoot(document.getElementById('root')!).render(<ArtSheet />)
  })
} else {
  startGame()
}

function startGame() {
  // Nur ein Fenster speichert (vor dem ersten Laden des Spielstands)
  startSaveLock()
  // Browser bitten, den Speicher nicht von sich aus zu löschen (iOS/Safari)
  try {
    void navigator.storage?.persist?.().then((persisted) => logPlaytest('storage', { persisted }))
  } catch {
    /* nicht unterstützt */
  }
  registerSW({ immediate: true })
  // Vite meldet fehlgeschlagenes Vorladen alter Bündel nach einem Update: einmal neu laden
  window.addEventListener('vite:preloadError', (e) => {
    if (reloadForNewVersion()) e.preventDefault()
  })

  // Nur Hochformat: Android-PWA sperrt die Drehung, iOS zeigt den Hinweis (CSS .rotate-lock)
  try {
    const o = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> }
    o?.lock?.('portrait').catch(() => {})
  } catch {
    /* not supported */
  }

  // Sprache vor dem ersten Bild festlegen (Englisch wird nur bei Bedarf geladen)
  void initLocale().then(() => render())
}

function render() {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
