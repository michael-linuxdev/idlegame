/** Datenschutz — beschreibt, was die App wirklich tut (synchron halten, auch en/legal.ts!). */
export const privacyStrings = {
  title: 'Datenschutz',
  intro:
    'Gartenerbe läuft vollständig auf deinem Gerät. Es gibt kein Benutzerkonto und keinen Spielserver.',
  sections: [
    {
      heading: 'Was gespeichert wird',
      body: 'Dein Spielstand, Omas Notizbuch, Einstellungen (z. B. Ton an/aus, Sprache) und der Hinweis zur Installation werden ausschließlich im lokalen Speicher deines Browsers (localStorage) abgelegt. Diese Daten verlassen dein Gerät nicht.',
    },
    {
      heading: 'Kein Tracking',
      body: 'Es werden keine Analyse-, Werbe- oder Tracking-Dienste eingebunden und keine Cookies gesetzt. Schriften und Grafiken werden mit der App ausgeliefert, nicht von Drittanbietern nachgeladen.',
    },
    {
      heading: 'Playtest-Log',
      body: 'Während der Testphase wirst du beim ersten Start der installierten App gefragt, ob das Playtest-Log laufen darf (vorausgewählt, per Häkchen abwählbar). Sonst ist es aus und lässt sich im Menü einschalten. Gesammelt wird nur auf deinem Gerät: welche Spielaktionen du wann machst, Sitzungen, Spielzeit und ein Fortschritts-Stand pro Tag. Du kannst das Log jederzeit ausschalten, exportieren oder löschen. Es wird nichts automatisch übertragen.',
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
