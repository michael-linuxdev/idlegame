/**
 * Active theme skin — Urban Vertical Farm (TurmFarm) only.
 * Orbit Rack pack removed (owner: Orbit raus).
 */
import { farmTheme } from './farm'
import type { ThemeId } from './types'

export type { ThemeId, ThemePack } from './types'
export { farmTheme } from './farm'

export const ACTIVE_THEME_ID: ThemeId = 'farm'

export const activeTheme = farmTheme

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
