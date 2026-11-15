import { useEffect, useRef, type RefObject } from 'react'

/** Ab dieser Strecke (px) oder Wischgeschwindigkeit (px/ms) schließt das Fenster. */
export const SWIPE_CLOSE = { distance: 90, velocity: 0.55, start: 8, fadeOver: 600, minOpacity: 0.45, outMs: 180 }

/** Liegt zwischen Ziel und Fenster etwas, das schon nach unten gescrollt ist? Dann scrollt der Finger zuerst. */
function scrolledAbove(target: EventTarget | null, root: HTMLElement): boolean {
  let el = target instanceof Element ? target : null
  while (el && root.contains(el)) {
    if (el instanceof HTMLElement && el.scrollTop > 0 && el.scrollHeight > el.clientHeight) return true
    if (el === root) break
    el = el.parentElement
  }
  return false
}

/**
 * Fenster (Menü, Ausbauen) mit dem Finger nach unten wegwischen (2026-11-15):
 * Das Fenster folgt dem Finger und verblasst dabei leicht; weit genug oder
 * schnell genug losgelassen gleitet es hinaus und schließt, sonst federt es
 * zurück. Nur Touch – mit der Maus bleiben ×, Esc und Tippen daneben.
 */
export function useSwipeClose(ref: RefObject<HTMLElement | null>, onClose: () => void): void {
  const close = useRef(onClose)
  useEffect(() => {
    close.current = onClose
  })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let startY = 0
    let startX = 0
    let startT = 0
    let lastY = 0
    let lastT = 0
    let tracking = false
    let dragging = false
    let downTarget: Element | null = null
    let suppressClick = false

    const reset = (animate: boolean) => {
      el.style.transition = animate ? 'transform 0.2s ease-out, opacity 0.2s ease-out' : ''
      el.style.transform = ''
      el.style.opacity = ''
      if (animate) window.setTimeout(() => (el.style.transition = ''), 220)
    }

    const onStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return
      const t = e.touches[0]!
      tracking = !scrolledAbove(e.target, el)
      dragging = false
      startY = lastY = t.clientY
      startX = t.clientX
      startT = lastT = performance.now()
      downTarget = e.target instanceof Element ? e.target : null
    }

    const onMove = (e: TouchEvent) => {
      if (!tracking) return
      const t = e.touches[0]!
      const dy = t.clientY - startY
      const dx = t.clientX - startX
      if (!dragging) {
        if (dy < -SWIPE_CLOSE.start || Math.abs(dx) > Math.abs(dy) + 4) {
          tracking = false
          return
        }
        if (dy < SWIPE_CLOSE.start) return
        dragging = true
        el.style.transition = 'none'
        // Gedrückt-Halten (Ausbauen) endet, sobald gewischt wird
        downTarget?.closest('button')?.dispatchEvent(new PointerEvent('pointercancel', { bubbles: true }))
      }
      e.preventDefault()
      const d = Math.max(0, dy)
      el.style.transform = `translateY(${d}px)`
      el.style.opacity = String(Math.max(SWIPE_CLOSE.minOpacity, 1 - d / SWIPE_CLOSE.fadeOver))
      lastY = t.clientY
      lastT = performance.now()
    }

    const onEnd = () => {
      if (!dragging) {
        tracking = false
        return
      }
      dragging = tracking = false
      suppressClick = true
      window.setTimeout(() => (suppressClick = false), 350)
      const dy = lastY - startY
      const v = (lastY - startY) / Math.max(1, lastT - startT)
      if (dy > SWIPE_CLOSE.distance || (v > SWIPE_CLOSE.velocity && dy > SWIPE_CLOSE.start * 3)) {
        el.style.transition = `transform ${SWIPE_CLOSE.outMs}ms ease-in, opacity ${SWIPE_CLOSE.outMs}ms ease-in`
        el.style.transform = `translateY(${Math.max(dy, el.offsetHeight)}px)`
        el.style.opacity = '0'
        window.setTimeout(() => close.current(), SWIPE_CLOSE.outMs)
      } else {
        reset(true)
      }
    }

    // Nach dem Wischen kein Klick auf das, worauf der Finger lag
    const onClick = (e: MouseEvent) => {
      if (!suppressClick) return
      e.stopPropagation()
      e.preventDefault()
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd)
    el.addEventListener('touchcancel', onEnd)
    el.addEventListener('click', onClick, true)
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
      el.removeEventListener('touchcancel', onEnd)
      el.removeEventListener('click', onClick, true)
    }
  }, [ref])
}
