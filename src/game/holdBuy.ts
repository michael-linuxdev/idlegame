/**
 * Gedrückthalten zum Ausbauen beschleunigt (2026-11-14, Playtest Tester 1:
 * bis 412 Einzelkäufe pro Minute). Statt neuer Knöpfe („×5“/„Max“ sind seit
 * 2026-11-09 bewusst raus) kauft das Halten nach und nach mehr Stufen je Schritt.
 */
export const HOLD_ACCEL: readonly { afterMs: number; levels: number }[] = [
  { afterMs: 0, levels: 1 },
  { afterMs: 1500, levels: 2 },
  { afterMs: 3000, levels: 5 },
]

/** Stufen je Schritt nach `heldMs` Gedrückthalten. */
export function holdLevels(heldMs: number): number {
  let n = 1
  for (const s of HOLD_ACCEL) if (heldMs >= s.afterMs) n = s.levels
  return n
}

/** Zeitgeber fürs Halten (nur in Ereignis-Funktionen aufrufen). */
export function holdNow(): number {
  return performance.now()
}
