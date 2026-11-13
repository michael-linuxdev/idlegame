/**
 * Kräftiger Stil für Kleinteile (Deko, Bewohner, Fest-Deko, Figuren): jede
 * gefüllte Form erbt eine dunkle Kontur, die hinter der Füllung liegt
 * (`paint-order: stroke`) — sichtbar ist also die halbe Breite außen.
 * Schatten, Lichtschein und halbtransparente Flächen tragen `stroke="none"`.
 */
export function inkProps(width: number) {
  return { stroke: 'var(--art-outline, #3d2f1f)', strokeWidth: width, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const, paintOrder: 'stroke' as const }
}
