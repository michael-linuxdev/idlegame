# Automatische Sicherung (Runde 4, Paket 1)

Stand 2026-11-10. Ziel: Kein Tester verliert seinen Garten, weil localStorage
leer oder kaputt ist — und jeder wird erinnert, eine Sicherung außerhalb des
Geräts abzulegen.

## Was passiert

| Anlass | Art (`kind`) | Wann |
|---|---|---|
| Einmal je Kalendertag | `daily` | beim ersten erfolgreichen Speichern des Tages (`useGameLoop` → `noteSaved`) |
| Tiefer Winter | `deep` | direkt davor, mit dem Stand im Speicher (nicht dem bis zu 4 s alten in localStorage) |
| Generation | `generation` | direkt davor, ebenso |
| Code/Datei einspielen | `import` | vor `applyBundle`, höchstens 2 s warten |
| Sicherung wiederherstellen | `restore` | vor dem Einspielen, höchstens 2 s warten |

- **Inhalt:** dasselbe Bündel wie „Code kopieren“ (`backup.ts`, alle `KEYS`,
  `appVersion`, `saveVersion`) plus Meta-Daten für die Liste (Datum,
  Gartenjahr, Kapitelzahl, Generation, Größe).
- **Aufbewahrung:** die letzten 7 Tages-Sicherungen (je Kalendertag die
  neueste) und die letzten 3 Anlass-Sicherungen; zusammen höchstens
  6 000 000 Zeichen (`BACKUP_BUDGET_CHARS`), eine einzelne höchstens
  1 500 000 (`BACKUP_MAX_ENTRY_CHARS`). Ein echter Stand ist 15–80 kB groß,
  zehn Sicherungen also unter 1 MB. Test: 180 simulierte Tage
  (`src/test/autoBackup.test.ts`).
- **Fehler:** jede Funktion in `autoBackup.ts` fängt alles ab; geschrieben
  wird nur in IndexedDB (`gartenerbe-sicherungen`), nie in localStorage.
  Fehlt IndexedDB oder hängt sie, startet das Spiel nach höchstens 1,5 s normal.

## Wiederherstellen

- **Beim Start** (`main.tsx`): Ist der Spielstand leer oder kaputt und gibt es
  Sicherungen, erscheint `RestoreOffer` **vor** dem neuen Garten — mit Datum,
  Gartenjahr und Kapitelzahl je Sicherung. „Neuen Garten anlegen“ lässt die
  Sicherungen liegen. Ein kaputter Stand bleibt als `…-broken` erhalten.
- **Menü → Spielstand sichern:** Liste aller Sicherungen, „Wiederherstellen“
  mit Bestätigung; der laufende Garten wird vorher als `restore` gesichert.
- **Nie** still, nie über einen Stand aus einer neueren Version
  (`isNewerSave` / `storedSaveState() === 'newer'`), nie solange ein anderes
  Fenster speichert (`saveGuard`: `newer`, `otherTab`). Sicherungen aus einer
  neueren Version werden gar nicht erst abgelegt.

## Sicherung außerhalb des Geräts

Eigener Schlüssel `gartenerbe-sicherung-v1` in localStorage (nicht im
`GameState`): erster Start mit dieser Version, letzter Export (Code kopiert,
Datei gespeichert/geteilt), letzter Hinweis, Fortschritt beim letzten Export.
Omas Hinweis mit „Jetzt sichern“ (Teilen-Menü bzw. Datei) erscheint, wenn der
letzte Export länger als 14 Tage her ist **und** seitdem ein Tiefer Winter,
eine Generation oder ein neues Kapitel kam — höchstens einmal in 7 Tagen, nie
in der ersten Sitzung, nie über einem offenen Fenster oder einem anderen
Hinweis (`backupReminder.ts`, `BackupReminder.tsx`).

## Schnittstelle für später

`BackupTarget` (`src/game/backupTarget.ts`): `write`, `list`, `read`,
`remove`. Einzige Umsetzung: `deviceTarget()` (IndexedDB). Rotation, Budget,
Liste und Wiederherstellen arbeiten nur gegen die Schnittstelle.

Was für ein zweites Ziel fehlt (bewusst nicht gebaut, kein Netzwerk-Code):

- **iCloud (iOS-App):** eine native Hülle (Capacitor o. ä.) mit Plugin für
  iCloud Key-Value/Documents, Apple-Entwicklerkonto, Entitlements; dazu
  Konfliktregel „neuerer Stand gewinnt nie still“ (dieselbe Abfrage wie beim
  Start).
- **Play Games Saved Games (Android):** Play-Games-Projekt, OAuth-Client,
  Anmeldung im Spiel, Plugin in der Store-Hülle; Datenschutztext und
  Data-Safety-Formular ändern sich (Daten verlassen das Gerät).
- **Eigenes Backend:** Server, Konto oder anonyme Geräte-ID, Verschlüsselung,
  Löschkonzept, Impressum/Datenschutz, Kosten; Entscheidung des Nutzers.
- Für alle: ein zweites `BackupTarget`, das `autoBackup` zusätzlich (nicht
  statt) bedient, und eine Anzeige „wo liegt welche Sicherung“.
