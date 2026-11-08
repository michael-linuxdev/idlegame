/**
 * Ruhemodus: after IDLE_AFTER_MS without any touch / key, the map's
 * decorative animations pause (html.idle, see polish.css) and the game
 * ticks once per second instead of four times. Production is unchanged
 * (the tick integrates the elapsed time). First touch wakes everything.
 */
export const IDLE_AFTER_MS = 45_000

let idle = false
let timer: number | undefined
let started = false
const subs = new Set<(idle: boolean) => void>()

function set(next: boolean) {
  if (idle === next) return
  idle = next
  document.documentElement.classList.toggle('idle', next)
  for (const fn of subs) fn(next)
}

function wake() {
  set(false)
  window.clearTimeout(timer)
  timer = window.setTimeout(() => set(true), IDLE_AFTER_MS)
}

export function startIdleWatch(): void {
  if (started || typeof window === 'undefined') return
  started = true
  for (const ev of ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const) {
    window.addEventListener(ev, wake, { passive: true, capture: true })
  }
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') wake()
  })
  wake()
}

export function isIdle(): boolean {
  return idle
}

export function onIdleChange(fn: (idle: boolean) => void): () => void {
  subs.add(fn)
  return () => subs.delete(fn)
}
