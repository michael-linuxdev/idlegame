/**
 * Thin theme-skin contract. Game loop (idle, slots, prestige, clan, shop,
 * daily, event) stays theme-agnostic — packs only swap copy, tokens, art.
 */
export type ThemeId = 'farm'

export interface ThemePack<S> {
  id: ThemeId
  /** DOM `data-theme` value */
  dataTheme: ThemeId
  brand: string
  themeColor: string
  backgroundColor: string
  /** Player-facing German copy for this skin */
  strings: S
  /** CSS class on map stage for backdrop swap */
  mapClass: string
}
