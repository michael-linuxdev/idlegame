/** Bogen-Regeln der Kapitel 13–49 (Runde 4, Paket 4) — nur Spielregel-Sätze. */
export const arcStrings = {
  open: 'Wahl offen',
  close: 'Schließen',
  none: 'Keine Wahl',
  neutral: 'Ohne Wahl trägt das Kapitel wie bisher.',
  effect: (pct: string) => `+${pct} % Ertrag in diesem Kapitel`,
  capNote: (pct: number) => `Höchstens +${pct} % Ertrag in diesem Kapitel. Jederzeit änderbar.`,
  ilseNote: 'Ilse baut weiter aus, entscheidet hier aber nichts.',
  pill: {
    I: 'Patenbeet',
    II: 'Tauschpost',
    III: 'Wasser',
    IV: 'Plan',
  } as Record<string, string>,
  title: {
    I: 'Patenbeet',
    II: 'Tauschpost',
    III: 'Wasser verteilen',
    IV: 'Plan für morgen',
  } as Record<string, string>,
  rule: {
    I: (pct: number) => `Ein Bereich wird Patenbeet: Die Bereiche direkt davor und danach tragen +${pct} %, das Patenbeet selbst nicht.`,
    II: 'Das Kapitel richtet sich auf einen Weg aus: mehr Ertrag, günstigerer Ausbau oder günstigere Pflege.',
    III: (points: number, max: number, pct: number) => `Verteile ${points} Wasserpunkte auf die Bereiche, höchstens ${max} je Bereich. Jeder Punkt: +${pct} % für diesen Bereich.`,
    IV: 'Wähle den Schwerpunkt: mehr Ertrag, solange du spielst, oder mehr, während du weg bist.',
  },
  pate: (name: string) => `${name} als Patenbeet`,
  wege: {
    ertrag: (pct: number) => `Mehr Ertrag: +${pct} % in diesem Kapitel`,
    ausbau: (pct: number) => `Günstiger ausbauen: −${pct} % (ab Stufe 1, Anlegen kostet gleich)`,
    pflege: (pct: number) => `Günstiger pflegen: −${pct} % für die Pflege`,
  },
  water: (name: string, n: number) => `${name}: ${n}`,
  waterLeft: (n: number) => (n === 1 ? 'Noch 1 Wasserpunkt' : `Noch ${n} Wasserpunkte`),
  waterAdd: (name: string) => `Einen Wasserpunkt für ${name}`,
  waterRemove: (name: string) => `Einen Wasserpunkt von ${name} wegnehmen`,
  plan: {
    heute: (pct: number) => `Ertrag jetzt: +${pct} %, solange du spielst`,
    morgen: (pct: number) => `Ertrag für morgen: +${pct} %, während du weg bist`,
  },
  now: (pct: string) => `Mit deinem Kapitel jetzt: +${pct} %`,
}
