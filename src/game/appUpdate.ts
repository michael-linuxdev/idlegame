/**
 * Manual update check for the installed PWA ("Nach Updates suchen").
 * The service worker auto-updates on its own; this lets the player pull a
 * new version right now and reload into it.
 */
export type UpdateResult = 'reloading' | 'current' | 'offline' | 'unsupported'

export const APP_VERSION: string =
  typeof __APP_VERSION__ !== 'undefined' ? __APP_VERSION__ : 'dev'

function waitActivated(sw: ServiceWorker, timeoutMs = 10_000): Promise<void> {
  return new Promise((resolve) => {
    if (sw.state === 'activated') {
      resolve()
      return
    }
    const done = () => resolve()
    sw.addEventListener('statechange', () => {
      if (sw.state === 'activated' || sw.state === 'redundant') done()
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
  if (reg.waiting) reg.waiting.postMessage({ type: 'SKIP_WAITING' })
  await waitActivated(incoming)
  window.location.reload()
  return 'reloading'
}

/** Hard reload (saves on pagehide). */
export function reloadNow(): void {
  window.location.reload()
}
