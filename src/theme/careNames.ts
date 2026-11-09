/**
 * Pflege-Namen je Bereich: [mehr Ertrag, günstiger ausbauen].
 * Omas Garten → garden branches (Ertrag / Kosten), chapters → Kapitel-Pflege.
 * Texte: `t.careNames` (src/i18n/<sprache>/careNames.ts).
 */
import { t } from '../i18n'

export function careNamesFor(areaId: string, fallback: readonly [string, string]): readonly [string, string] {
  return t.careNames[areaId] ?? fallback
}
