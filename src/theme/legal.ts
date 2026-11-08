/**
 * Legal copy. The Impressum stays hidden until every field is filled in —
 * never ship invented operator data. Fill these before the store launch.
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

/** Datenschutz — describes what the app actually does (keep in sync!). */
export const PRIVACY = {
  title: 'Datenschutz',
  intro:
    'Gartenerbe läuft vollständig auf deinem Gerät. Es gibt kein Benutzerkonto und keinen Spielserver.',
  sections: [
    {
      heading: 'Was gespeichert wird',
      body: 'Dein Spielstand, Omas Notizbuch, Einstellungen (z. B. Ton an/aus) und der Hinweis zur Installation werden ausschließlich im lokalen Speicher deines Browsers (localStorage) abgelegt. Diese Daten verlassen dein Gerät nicht.',
    },
    {
      heading: 'Kein Tracking',
      body: 'Es werden keine Analyse-, Werbe- oder Tracking-Dienste eingebunden und keine Cookies gesetzt. Schriften und Grafiken werden mit der App ausgeliefert, nicht von Drittanbietern nachgeladen.',
    },
    {
      heading: 'Playtest-Log',
      body: 'Das optionale Playtest-Log ist standardmäßig aus. Wenn du es im Menü einschaltest, werden Spielereignisse nur lokal gesammelt; du kannst sie selbst exportieren oder löschen. Es wird nichts automatisch übertragen.',
    },
    {
      heading: 'Hosting',
      body: 'Die Web-Version wird über GitHub Pages ausgeliefert. Beim Abruf verarbeitet GitHub technisch notwendige Verbindungsdaten (z. B. IP-Adresse) in Server-Logs. Details: GitHub Privacy Statement.',
    },
    {
      heading: 'Löschen',
      body: 'Du kannst alle Daten jederzeit entfernen, indem du die Website-Daten in deinem Browser löschst oder die installierte App deinstallierst.',
    },
  ],
}
