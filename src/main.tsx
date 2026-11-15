import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { markUpdateReady, watchForUpdates } from './game/appUpdate'
import { reloadForNewVersion } from './game/chunkReload'
import { logPlaytest } from './game/playtestLog'
import { startSaveLock } from './game/saveGuard'
import { storedSaveState } from './game/storage'
import { listBackups, withTimeout } from './game/autoBackup'
import { initLocale, t } from './i18n'
import { deliver } from './game/notify'
import './theme/fonts'
import './index.css'

// Start-Bündel geladen (Sicherheitsnetz gegen leere Seite in index.html)
Object.assign(window, { __gartenerbeStarted: true })

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
  // Neue Version: nicht von selbst neu laden, sondern „Update verfügbar“ zeigen (game/appUpdate.ts)
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh: () => {
      markUpdateReady(() => void updateSW(true))
      // App im Hintergrund und Erinnerungen erlaubt: auch als Benachrichtigung
      if (document.visibilityState === 'hidden') deliver(t.appUpdate.available, t.appUpdate.availableBody, 'update')
    },
    onRegisteredSW: (_url, reg) => {
      if (reg) watchForUpdates(reg)
    },
  })
  // Test-Zugang: ?update=1 zeigt den Hinweis ohne neue Version
  if (new URLSearchParams(location.search).get('update') === '1') markUpdateReady(() => {})
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
  void initLocale().then(() => offerRestoreOrStart())
}

/**
 * Leerer oder kaputter Spielstand, aber automatische Sicherungen vorhanden:
 * zuerst fragen (RestoreOffer), erst danach entsteht ein neuer Garten.
 * IndexedDB, die nicht antwortet, hält den Start höchstens 1,5 s auf.
 */
async function offerRestoreOrStart() {
  const root = createRoot(document.getElementById('root')!)
  const st = storedSaveState()
  if (st === 'empty' || st === 'broken') {
    try {
      const backups = await withTimeout(listBackups(), 1500, [])
      if (backups.length > 0) {
        const { RestoreOffer } = await import('./components/RestoreOffer')
        root.render(
          <StrictMode>
            <RestoreOffer backups={backups} onNewGarden={() => render(root)} />
          </StrictMode>,
        )
        return
      }
    } catch {
      /* Sicherungen nicht lesbar: normal starten */
    }
  }
  render(root)
}

function render(root = createRoot(document.getElementById('root')!)) {
  root.render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  )
}
