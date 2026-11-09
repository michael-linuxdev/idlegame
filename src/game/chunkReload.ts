/**
 * Neue Version während die App offen ist: Die alten Bündel (z. B. ein Fenster
 * oder eine Kapitel-Grafik) gibt es auf dem Server nicht mehr, das Nachladen
 * schlägt fehl („Importing a module script failed“). Statt der Fehlerseite
 * lädt die App dann einmal neu und holt die neue Version. Der Spielstand wird
 * beim Neuladen gesichert (pagehide in useGameLoop).
 *
 * Schutz gegen Endlosschleifen: höchstens einmal je 60 s.
 */
import { logPlaytest } from './playtestLog'

const KEY = 'gartenerbe-chunk-reload'
const MIN_GAP_MS = 60_000

const PATTERNS = [
  /Importing a module script failed/i, // Safari
  /Failed to fetch dynamically imported module/i, // Chrome
  /error loading dynamically imported module/i, // Firefox
  /Unable to preload CSS/i, // Vite
  /ChunkLoadError|Loading chunk .* failed/i,
]

export function isChunkLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err ?? '')
  return PATTERNS.some((re) => re.test(msg))
}

/** Lädt die Seite neu, wenn das nicht gerade erst passiert ist. Gibt true zurück, wenn neu geladen wird. */
export function reloadForNewVersion(now = Date.now()): boolean {
  try {
    const last = Number(sessionStorage.getItem(KEY) ?? 0)
    if (Number.isFinite(last) && now - last < MIN_GAP_MS) return false
    sessionStorage.setItem(KEY, String(now))
  } catch {
    /* ohne sessionStorage lieber nicht automatisch neu laden */
    return false
  }
  logPlaytest('app_update', { action: 'chunk_reload' })
  window.location.reload()
  return true
}
