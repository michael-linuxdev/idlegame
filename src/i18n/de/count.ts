/**
 * Deutsche Zahlen in Texten: Tausenderpunkt (1.500). Liegt bei den
 * Sprachdateien (kein Import aus src/game, vermeidet Kreisbezüge).
 */
export function zahl(n: number): string {
  return Number.isInteger(n) ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.') : String(n).replace('.', ',')
}
