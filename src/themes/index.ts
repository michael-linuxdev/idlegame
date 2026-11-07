/**
 * Active theme skin. Flip via VITE_THEME=arcade|farm or ACTIVE_THEME_ID.
 * Default: Urban Vertical Farm (TurmFarm). Tokenhalle is the Arcade pack.
 */
import { arcadeTheme } from './arcade'
import { farmTheme } from './farm'
import type { ThemeId } from './types'

export type { ThemeId, ThemePack } from './types'
export { arcadeTheme } from './arcade'
export { farmTheme } from './farm'

const THEMES = {
  farm: farmTheme,
  arcade: arcadeTheme,
} as const

function resolveThemeId(): ThemeId {
  const fromEnv = (import.meta.env.VITE_THEME as string | undefined)?.toLowerCase()
  if (fromEnv === 'arcade' || fromEnv === 'tokenhalle') return 'arcade'
  if (fromEnv === 'farm' || fromEnv === 'turmfarm') return 'farm'
  /** Change this to `'arcade'` to ship Tokenhalle without an env flag. */
  const ACTIVE_THEME_ID: ThemeId = 'farm'
  return ACTIVE_THEME_ID
}

export const ACTIVE_THEME_ID: ThemeId = resolveThemeId()

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
