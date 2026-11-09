/**
 * Impressum (operator data, same in every language). It stays hidden until
 * every field is filled in — never ship invented operator data. Fill these
 * before the store launch. The privacy text lives in the language files.
 */
export const IMPRESSUM = {
  /** Name des Anbieters (natürliche Person oder Firma) */
  name: '',
  /** Straße und Hausnummer */
  street: '',
  /** PLZ und Ort */
  city: '',
  /** Kontakt-E-Mail */
  email: '',
}

export function impressumComplete(): boolean {
  return Object.values(IMPRESSUM).every((v) => v.trim().length > 0)
}

// Datenschutz-Text: src/i18n/<sprache>/legal.ts (t.legal.privacy)
