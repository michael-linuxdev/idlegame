/**
 * Locale entry — German is the only / default locale.
 * Copy comes from the active theme skin (TurmFarm default; Tokenhalle via VITE_THEME=arcade).
 */
import { activeTheme } from '../themes'

export type Strings = typeof activeTheme.strings
export const t: Strings = activeTheme.strings

/** @deprecated Prefer theme packs under src/themes/ — kept for type imports. */
export { farmStrings as de } from '../themes/farm/strings'
