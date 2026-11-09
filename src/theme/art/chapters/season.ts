/** Jahreszeit für Kapitel-Grafik (Kapitel 30–34). */
export type Season4 = 'spring' | 'summer' | 'autumn' | 'winter'

/** Jahreszeit ohne Angabe = Sommer (wie im Grafik-Test). */
export const ssn = (s?: string): Season4 => (s === 'spring' || s === 'autumn' || s === 'winter' ? s : 'summer')
