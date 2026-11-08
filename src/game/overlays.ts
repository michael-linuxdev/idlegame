/**
 * „Is a window open?“ — one shared signal for every overlay.
 *
 * Omas Hinweise, Toasts and other floating notes must never sit on top of an
 * open sheet, menu or letter. Instead of every sheet registering itself, we
 * watch the DOM for a modal surface: any `[role="dialog"]` (except the FTUE
 * coach, which is a guide, not a window) or the open menu.
 */
import { useEffect, useRef, useSyncExternalStore } from 'react'

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

/**
 * Open windows, oldest first — Escape and the phone's Zurück button only
 * close the top one. While any window is open we keep one „guard“ entry in
 * the browser history, so Zurück closes the window instead of leaving the
 * app. We never call history.back() ourselves (it races with new windows
 * and can leave the page); a guard left over after a button-close is
 * harmless and reused by the next window.
 */
interface DismissEntry {
  current: () => void
}
const dismissStack: DismissEntry[] = []
let guard = false
let listening = false

function onGlobalKey(e: KeyboardEvent) {
  if (e.key !== 'Escape' || e.defaultPrevented) return
  const top = dismissStack.at(-1)
  if (!top) return
  e.preventDefault()
  top.current()
}

function pushGuard() {
  if (guard) return
  try {
    history.pushState({ gartenerbeWindow: true }, '')
    guard = true
  } catch {
    /* sandboxed */
  }
}

function onPop() {
  guard = false
  const top = dismissStack.at(-1)
  if (!top) return
  // More windows stay open underneath → keep Zurück trapped for them
  if (dismissStack.length > 1) pushGuard()
  top.current()
}

function listen() {
  if (listening) return
  listening = true
  window.addEventListener('keydown', onGlobalKey)
  window.addEventListener('popstate', onPop)
}

/** Escape / Zurück closes the topmost window. Every window calls this with its onClose. */
export function useDismiss(onClose: (() => void) | undefined, active = true): void {
  const ref = useRef(onClose)
  useEffect(() => {
    ref.current = onClose
  })
  useEffect(() => {
    if (!active) return
    const entry: DismissEntry = { current: () => ref.current?.() }
    dismissStack.push(entry)
    listen()
    pushGuard()
    return () => {
      const i = dismissStack.indexOf(entry)
      if (i >= 0) dismissStack.splice(i, 1)
    }
  }, [active])
}

/** True while at least one window has registered with useDismiss. */
export function hasOpenWindow(): boolean {
  return dismissStack.length > 0
}
