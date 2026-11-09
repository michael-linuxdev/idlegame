/**
 * English counts: thousands commas and singular/plural via Intl.PluralRules.
 * Lives next to the language files (no import from src/game, avoids cycles).
 */
const rules = new Intl.PluralRules('en-US')

/** 1500 → “1,500” (whole numbers only; fractions stay as they are). */
export function num(n: number): string {
  return Number.isInteger(n) ? String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : String(n)
}

/** count(1, 'seed', 'seeds') → “1 seed”; count(1500, …) → “1,500 seeds”. */
export function count(n: number, one: string, other: string): string {
  return `${num(n)} ${rules.select(n) === 'one' ? one : other}`
}

export const nSeeds = (n: number) => count(n, 'seed', 'seeds')
export const nHeirlooms = (n: number) => count(n, 'heirloom', 'heirlooms')
export const nSeedlings = (n: number) => count(n, 'seedling', 'seedlings')
export const nFestTokens = (n: number) => count(n, 'fest token', 'fest tokens')
