/**
 * „Is a window open?“ — one shared signal for every overlay.
 *
 * Omas Hinweise, Toasts and other floating notes must never sit on top of an
 * open sheet, menu or letter. Instead of every sheet registering itself, we
 * watch the DOM for a modal surface: any `[role="dialog"]` (except the FTUE
 * coach, which is a guide, not a window) or the open menu.
 */
import { useEffect, useSyncExternalStore } from 'react'

export const OVERLAY_SELECTOR = '[role="dialog"]:not(.ftue-coach), .nav-menu, .nav-sheet'

let open = false
const listeners = new Set<() => void>()
let observer: MutationObserver | null = null
let frame = 0

function check() {
  frame = 0
  const next = typeof document !== 'undefined' && document.querySelector(OVERLAY_SELECTOR) != null
  if (next === open) return
  open = next
  listeners.forEach((l) => l())
}

function schedule() {
  if (frame) return
  frame = typeof requestAnimationFrame === 'function' ? requestAnimationFrame(check) : (setTimeout(check, 16) as unknown as number)
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  if (!observer && typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
    observer = new MutationObserver(schedule)
    observer.observe(document.body, { childList: true, subtree: true })
    check()
  }
  return () => {
    listeners.delete(cb)
    if (listeners.size === 0 && observer) {
      observer.disconnect()
      observer = null
    }
  }
}

/** True while any sheet, letter, menu or modal is on screen. */
export function useOverlayOpen(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  )
}

/** Escape closes the topmost window. Every sheet calls this with its onClose. */
export function useDismiss(onClose: (() => void) | undefined, active = true): void {
  useEffect(() => {
    if (!active || !onClose) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return
      e.preventDefault()
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, active])
}
