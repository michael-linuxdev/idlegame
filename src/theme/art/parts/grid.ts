/**
 * Bildraster der Spielgrafik und ihre Bodenlinie (Fußpunkt-y), an der der
 * einheitliche Schatten liegt.
 */
export const GRID = {
  /** Hauptgarten-Bereiche (ModuleArt, PlotArt) */
  plot: { w: 100, h: 86, ground: 77, shadowRy: 8 },
  /** Kapitel-Bereiche (HandArt, ChapterArt, OrchardArt, VineyardArt) */
  chapter: { w: 80, h: 72, ground: 66, shadowRy: 4.5 },
  /** Deko-Stücke */
  decor: { w: 40, h: 40, ground: 37.5, shadowRy: 2.2 },
} as const

export type Grid = keyof typeof GRID

/** Faktor, mit dem Bausteine (im plot-Raster gezeichnet) ins Raster passen. */
export const GRID_SCALE: Record<Grid, number> = { plot: 1, chapter: 0.8, decor: 0.4 }
