/** Strichstärken im plot-Raster (100×86); kleinere Raster skalieren mit. */
export const STROKE = { contour: 1.3, detail: 0.9, hair: 0.5 } as const

/**
 * Maßtabelle: Höhe in Einheiten des plot-Rasters (100×86, Plot = 24u breit,
 * 1 Einheit ≈ 0,24u). Im Kapitel-Raster gilt derselbe Wert × GRID_SCALE.chapter.
 * Figuren und Tiere halten sich daran (Jonas ist das Maß), auch die
 * CSS-Größen der Tiere auf der Karte (expansion.css, .chicken/.hedgehog).
 */
export const SIZE = {
  mensch: 22,
  vogelscheuche: 30,
  kuh: 16,
  schaf: 11,
  ziege: 11,
  gans: 10,
  huhn: 9,
  ente: 7,
  igel: 7,
  schmetterling: 4,
  biene: 3.5,
} as const
