/**
 * Updates der installierten App.
 *
 * Seit 2026-11-15 lädt eine neue Version nicht mehr von selbst neu
 * (vite.config.ts: registerType 'prompt'). Liegt sie bereit, zeigt die App
 * „Update verfügbar“ mit „Jetzt aktualisieren“ (components/UpdateBanner.tsx);
 * erst der Tipp schaltet um und lädt neu. Der Spielstand wird beim Neuladen
 * gesichert (pagehide in useGameLoop). Ohne Tipp kommt die neue Version beim
 * nächsten Start der App.
 *
 * Gesucht wird beim Start, alle 30 min und wenn die App wieder nach vorn
 * kommt (frühestens alle 10 min) — und von Hand über „Nach Updates suchen“.
 */
import { logPlaytest } from './playtestLog'

export const UPDATE_CHECK_EVERY_MS = 30 * 60_000
export const UPDATE_CHECK_MIN_GAP_MS = 10 * 60_000

/* —— „Update verfügbar“: ein Zustand für Banner und Menü —— */

let ready = false
let later = false
let apply: (() => void) | null = null
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function subscribeUpdate(l: () => void): () => void {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Liegt eine neue Version bereit? */
export function updateReady(): boolean {
  return ready
}

/** Banner zeigen? (bereit und in dieser Sitzung nicht auf „Später“ getippt) */
export function updateBannerShown(): boolean {
  return ready && !later
}

/** Der Service Worker meldet eine fertige neue Version; `applyFn` schaltet um und lädt neu. */
export function markUpdateReady(applyFn: () => void): void {
  apply = applyFn
  if (ready) return
  ready = true
  later = false
  logPlaytest('app_update', { action: 'available' })
  emit()
}

/** „Später“: Banner bis zum nächsten Start ausblenden (im Menü bleibt der Hinweis). */
export function dismissUpdate(): void {
  if (!ready || later) return
  later = true
  logPlaytest('app_update', { action: 'later' })
  emit()
}

/** „Jetzt aktualisieren“: umschalten und neu laden; lädt spätestens nach 4 s von selbst neu. */
export function applyUpdate(reload: () => void = reloadNow): void {
  if (!ready) return
  logPlaytest('app_update', { action: 'apply' })
  try {
    apply?.()
  } catch {
    /* unten wird trotzdem neu geladen */
  }
  if (typeof window !== 'undefined') window.setTimeout(reload, 4000)
  else reload()
}

/** Nur für Tests. */
export function resetUpdateForTest(): void {
  ready = false
  later = false
  apply = null
  listeners.clear()
}

/**
 * Regelmäßig nach einer neuen Version suchen (der Browser tut das sonst nur
 * beim Start). Gibt die Funktion zum Beenden zurück.
 */
export function watchForUpdates(reg: Pick<ServiceWorkerRegistration, 'update'>, now: () => number = Date.now): () => void {
  let last = now()
  const check = () => {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) return
    last = now()
    void Promise.resolve(reg.update()).catch(() => {})
  }
  const timer = window.setInterval(check, UPDATE_CHECK_EVERY_MS)
  const onVisible = () => {
    if (document.visibilityState === 'visible' && now() - last >= UPDATE_CHECK_MIN_GAP_MS) check()
  }
  document.addEventListener('visibilitychange', onVisible)
  return () => {
    window.clearInterval(timer)
    document.removeEventListener('visibilitychange', onVisible)
  }
}
export type UpdateResult = 'reloading' | 'current' | 'offline' | 'unsupported'

export const APP_VERSION: string =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

function waitState(sw: ServiceWorker, states: ServiceWorkerState[], timeoutMs = 10_000): Promise<void> {
  return new Promise((resolve) => {
    if (states.includes(sw.state)) {
      resolve()
      return
    }
    const done = () => resolve()
    sw.addEventListener('statechange', () => {
      if (states.includes(sw.state) || sw.state === 'redundant') done()
    })
    window.setTimeout(done, timeoutMs)
  })
}

export async function checkForUpdate(): Promise<UpdateResult> {
  if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return 'unsupported'
  const reg = await navigator.serviceWorker.getRegistration()
  if (!reg) return 'unsupported'
  try {
    await reg.update()
  } catch {
    return navigator.onLine === false ? 'offline' : 'current'
  }
  const incoming = reg.installing ?? reg.waiting
  if (!incoming) return 'current'
  // Die neue Version wartet, bis sie gerufen wird (registerType 'prompt'):
  // erst fertig installieren lassen, dann umschalten
  await waitState(incoming, ['installed', 'activated'])
  ;(reg.waiting ?? incoming).postMessage({ type: 'SKIP_WAITING' })
  await waitState(incoming, ['activated'])
  window.location.reload()
  return 'reloading'
}

/** Hard reload (saves on pagehide). */
export function reloadNow(): void {
  window.location.reload()
}
