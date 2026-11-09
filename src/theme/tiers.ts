/** Module level thresholds for the five visible growth tiers. */
export const TIER_LEVELS = [1, 10, 25, 50, 100] as const

/** 0 = not planted, 1–5 = growth tier */
export function moduleTier(level: number): number {
  let tier = 0
  for (const need of TIER_LEVELS) if (level >= need) tier += 1
  return tier
}

/**
 * Schild-Zone: unterhalb dieser y-Koordinate (100×86-Raster) liegt das
 * Pflanzenschild. Grafik zeichnet dort nur Boden, Schatten und Randdeko.
 */
export const SIGN_ZONE_Y = 72

/**
 * memo-Vergleich für Grafik-Komponenten: neu zeichnen nur, wenn sich die
 * Wachstumsstufe (nicht jedes einzelne Level) oder eine andere Prop ändert.
 */
export function sameTierProps<P extends { level: number }>(a: Readonly<P>, b: Readonly<P>): boolean {
  if (moduleTier(a.level) !== moduleTier(b.level)) return false
  for (const k of Object.keys(a) as (keyof P)[]) {
    if (k !== 'level' && a[k] !== b[k]) return false
  }
  return Object.keys(a).length === Object.keys(b).length
}
