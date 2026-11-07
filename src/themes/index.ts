/**
 * Active theme skin. Flip ACTIVE_THEME_ID to swap packs without touching the loop.
 * Default: Urban Vertical Farm (TurmFarm). Orbit Rack remains an alternate pack.
 */
import { farmTheme } from './farm'
import { orbitTheme } from './orbit'
import type { ThemeId } from './types'

export type { ThemeId, ThemePack } from './types'
export { farmTheme } from './farm'
export { orbitTheme } from './orbit'

/** Change this to `'orbit'` to revive the datacenter skin. */
export const ACTIVE_THEME_ID: ThemeId = 'farm'

const THEMES = {
  farm: farmTheme,
  orbit: orbitTheme,
} as const

export const activeTheme = THEMES[ACTIVE_THEME_ID]

/** Apply theme metadata to document (lang, colors, data-theme). */
export function applyThemeToDocument(): void {
  const root = document.documentElement
  root.lang = 'de'
  root.dataset.theme = activeTheme.dataTheme
  const themeMeta = document.querySelector('meta[name="theme-color"]')
  if (themeMeta) themeMeta.setAttribute('content', activeTheme.themeColor)
  const desc = document.querySelector('meta[name="description"]')
  if (desc) desc.setAttribute('content', activeTheme.strings.meta.description)
  document.title = activeTheme.strings.meta.title
}
