# Prompt: Englische Fassung „Gartenerbe in English“

> Diesen Text als Auftrag an eine Claude-Code-Sitzung im Repo `idlegame` geben.
> **Voraussetzung:** Die Aufräum-Runde (`docs/prompts/aufraeumen.md`) ist gemergt, also neuer Speicherschlüssel mit `SAVE_VERSION` 1 und keine Altnamen mehr. Sonst zuerst diese abschließen.
> Danach folgt `docs/prompts/kapitel-13-50.md`. Neue Kapitel entstehen dann gleich zweisprachig.

---

Du arbeitest an **Gartenerbe** (Vite + React 19 + TypeScript, PWA, echte Spieler). Lies zuerst `CLAUDE.md`, `ROADMAP.md`, `README.md` und `docs/store/listing.md`.

**Ziel:** Eine vollständige englische Fassung, gleichwertig zur deutschen:
- Die Sprache folgt automatisch dem Browser, dazu ein Umschalter in den Einstellungen.
- Freie, warme Übersetzung im Ton von Omas Notizbuch, keine Wort-für-Wort-Übersetzung.
- Eigennamen und Spielbegriffe bekommen eigene englische Namen.
- Englische Store-Texte.

Deutsch bleibt die Ausgangssprache und darf sich nicht verschlechtern.

## Entscheidungen des Nutzers (fest)

- **Sprache:** `navigator.languages` → `de*` = Deutsch, sonst Englisch. Ein Umschalter „Sprache / Language“ in Einstellungen (Menü → Einstellungen → Anzeige) speichert die Wahl dauerhaft. Die Wahl wird **nicht** im Spielstand gespeichert, sondern über `prefs.ts` (localStorage).
- **Namen:** Begriffe und Eigennamen bekommen englische Namen. Vorgehen: Für den **Spieltitel** und die **Kernbegriffe** legst du in `docs/i18n/glossar.md` je 2–3 Vorschläge mit kurzer Begründung an, wählst einen aus und begründest die Wahl. Der Nutzer kann später tauschen; dafür steht alles an einer Stelle. Vor dem Store-Start ist eine Markenrecherche nötig; diesen Hinweis ins Glossar schreiben.
  Kernbegriffe laut `ROADMAP.md` „Begriffe“: Ernte, Erbstücke, Samen, Saisonende, Winterruhe, Tiefer Winter, Sprösslinge, Generation/Vermächtnis/Familienschatz, Gärtnerstufe, Gießen, Kleingartenverein, Markt, Omas Truhe, Gartenstile, Sonnenfenster, Erntefest, Tägliche Gartenrunde, Gartenwoche, Pflanzenbuch, Gartenbewohner, Jahreszeiten-Album, Saatgut kreuzen, Großprojekte, Saison-Karten/Jahres-Themen, Omas Herausforderungen, Kapitel-Namen und -Währungen, Figuren (Oma, Jonas, Oma Ilse, Opa, Tante Hilde, Onkel Fritz …).
- **Store:** `docs/store/listing.en.md` (App Store + Google Play, mit Zeichenlimits wie im deutschen Entwurf) plus englische Screenshots über `scripts/store/screenshots.cjs` mit Sprachparameter.

## Harte Regeln

- **Spielstand:** Kein Feld im `GameState` hängt an der Sprache. IDs (Bereiche, Sorten, Kapitel, Karten …) bleiben unverändert. Keine Migration nötig. Falls doch ein Feld nötig scheint: anhalten und begründen.
- **Keine Balance-Änderung.** Der Balance-Simulator liefert vorher und nachher identische `SUMMARY=1`-Zeilen.
- **Keine Texte im Code:** Jeder sichtbare Text, jedes `aria-label`, jeder Titel, jede Benachrichtigung, jeder Playtest-Hinweis im Menü und das Manifest kommen aus den Sprachdateien. Ein Prüfskript (Vitest) sucht deutsche Wörter/Umlaute in `src/components` und `src/game` außerhalb der Sprachdateien und schlägt dann fehl. Allowlist für IDs.
- **Vollständigkeit per Typ:** Die englische Datei hat **denselben TypeScript-Typ** wie die deutsche (`Strings`). Fehlt ein Schlüssel oder hat eine Funktion eine andere Signatur, bricht der Build. Ein Test vergleicht zusätzlich die Schlüsselbäume.
- Nach jedem Paket: `npm test`, `npm run lint` (0), `npm run build`, `npm run e2e`. **Ein PR pro Paket**, selbst mergen, sobald die CI auf dem aktuellen Head grün ist. Den Branch vorher auf `main` bringen. Nie zwei Pakete auf einem offenen PR.
- Deutsche Commit-Nachrichten. Am Ende einen Pipeline-Punkt „Englische Fassung“ in `ROADMAP.md`.

## Ausgangslage (gemessen am 2026-11-09, vor dem Aufräumen)

- Texte: `src/theme/strings.ts` (~1.200 Zeilen) + `stringsChapters.ts`, `stringsExpansion.ts`, `stringsLife.ts`, `stringsUx.ts` (zusammen ~2.300 Zeilen), zusammengeführt in `src/theme/index.ts`, Zugriff über `t` aus `src/i18n/index.ts` (`export const t = strings`).
- **Texte werden beim Import fest eingebaut:** Datendateien lesen `t` auf Modulebene, z. B. `SHOP_OFFERS` in `monetization.ts` (`name: t.packs….name`), `dailyOps.ts` (`label: t.daily.rows…`), `quests.ts`. Ein Sprachwechsel ohne Neuladen würde diese nicht ändern. **Lösung wählen:** entweder (a) Daten speichern nur Schlüssel und die UI liest `t` zur Laufzeit, oder (b) Sprachwechsel = Neuladen der Seite, mit `t` vor allen anderen Modulen gesetzt. (a) ist sauberer, (b) deutlich kleiner. Entscheide und begründe. Empfehlung: (b) für diese Runde, dazu ein Test, der sicherstellt, dass `t` vor dem ersten Datenmodul feststeht.
- **Zahlen:** `src/game/format.ts` ist fest deutsch: Komma, Tausenderpunkt, `Tsd / Mio / Mrd / Bio / Brd / Trd` (lange Skala). Englisch braucht Punkt, Komma-Gruppierung und `K / M / B / T / Qa / Qi` (kurze Skala). Achtung: Deutsch „Mrd“ = 10⁹ = Englisch „B“. Mehrere Stellen nutzen `toLocaleString('de-DE')` (`ClanPanel`, `SaveSheet`, `generators.ts`, `quests.ts`). Datum und Uhrzeit ebenso.
- **Mehrzahl:** Viele Texte sind Funktionen (`(n) => \`${n} Erbstücke\``). Englisch braucht eigene Mehrzahl-Regeln, `Intl.PluralRules` ist erlaubt.
- `index.html` `lang="de"`, Manifest `lang: 'de'` + `description` deutsch (`vite.config.ts`). Benachrichtigungstexte (`notify.ts` über `t.reminders`).
- Schriften: Caveat (Handschrift), Fraunces, DM Sans, Nunito Sans. Prüfen, ob Latin-Subset reicht (ja für EN).

## Pakete (in dieser Reihenfolge)

### Paket 1 — Fundament
1. Struktur `src/i18n/`: `de/` (die bisherigen `strings*.ts` dorthin verschieben, der Inhalt bleibt unverändert) und `en/` (zunächst eine Kopie mit `TODO`-Markern, typgleich). `Locale = 'de' | 'en'`, `detectLocale()`, `setLocale()` (mit Neuladen, siehe oben), `t`.
2. `format.ts` sprachabhängig: `formatAsh`, `formatRate`, `formatDecimal`, `formatClock`, `formatAway`, `formatEta`, `formatMult`. Alle `toLocaleString('de-DE')` durch eine zentrale Funktion ersetzen. Tests für beide Sprachen (Grenzen 999 / 1.000 / 99.999 / 10⁶ / 10⁹ / 10¹⁵).
3. `<html lang>` zur Laufzeit setzen. Manifest: Englische Zweitfassung ist bei Vite-PWA begrenzt; dokumentieren, was geht, z. B. `description` neutral halten.
4. Prüfskripte: deutsche Texte außerhalb der Sprachdateien und gleiche Schlüsselbäume de/en (zunächst `skip`, am Ende scharf).
5. Umschalter in den Einstellungen + E2E: Umschalten → Neuladen → Menü auf Englisch.

### Paket 2 — Glossar & Spieltitel
1. `docs/i18n/glossar.md`: Spieltitel (Vorschläge + Wahl), alle Kernbegriffe, Figuren, Kapitel und Währungen, Bereichsnamen der Hauptkarte, Sorten, Bewohner, Feste (deutsche Feste wie Laternenfest/Advent/Raunächte: übersetzen **und** kurz erklären, nicht durch Halloween/Thanksgiving ersetzen; das deutsche Flair ist Teil des Spiels), Tonregeln (Oma schreibt warm, kurze Sätze, „Love, Grandma“).
2. Diese Wahl gilt für alle folgenden Pakete. Bei Konflikten das Glossar ändern, nicht einzelne Texte.

### Paket 3 — Oberfläche & Systeme übersetzen
`strings.ts` (HUD, Menü, Markt, Saison, Truhe, Tiefer Winter, Generationen, Feste, Hinweise, Fehler-/Spielstandtexte, Rechtliches: siehe Paket 6) und `stringsUx.ts`, `stringsLife.ts`, `stringsExpansion.ts` (ohne Kapitelbriefe). Danach im Browser (iPhone-13-Format) jedes Fenster auf Englisch prüfen: **keine abgeschnittenen Texte, keine Umbrüche, die Knöpfe sprengen**. Englisch ist oft kürzer, Ausnahmen gibt es aber. Screenshots in `e2e-screens/en/`.

### Paket 4 — Geschichte übersetzen
Omas Notizbuch (alle Briefe), Comeback-Brief, Saisonende-Zeremonie, Kapitel-Briefe 2–12 (`stringsChapters.ts`, Opa, Tante Hilde, Onkel Fritz …), Briefe von Jonas und Ilse, Bereichs-Notizen („Omas Notiz“ je Bereich), Sorten- und Bewohner-Texte. Ton: wie eine echte Großmutter, die auf Englisch schreibt. Keine Übersetzungsfloskeln. Jeder Brief muss für sich gut lesbar sein.

### Paket 5 — Zahlen, Datum, Mehrzahl, Barrierefreiheit
1. Alle Texte mit Zahlen auf die sprachabhängigen Formatierer umstellen. Mehrzahlregeln.
2. `aria-label`s und Screenreader-Texte prüfen. axe-Durchlauf (wie in Politur-Runde 2) für beide Sprachen: 0 Verstöße.
3. Benachrichtigungen (`notify.ts`) und Playtest-Log-Menü auf Englisch.

### Paket 6 — Rechtliches, Store, Abschluss
1. `src/theme/legal.ts` → Datenschutz auf Englisch (inhaltsgleich). Hinweis: Für ein Impressum gibt es kein englisches Pflichtäquivalent. Das deutsche Impressum bleibt sichtbar, mit englischer Überschrift „Legal notice (Impressum)“.
2. `docs/store/listing.en.md`, englische Screenshots, `README.md` (Sprachen, Umschalter, Test-Parameter `?lang=en`).
3. Prüfskripte scharf schalten. E2E-Durchlauf komplett auch auf Englisch (`?lang=en` oder Browser-Locale `en-US` im Playwright-Kontext).

## Abschluss
- Glossar mit gewähltem Titel und offenen Fragen an den Nutzer (z. B. Markenrecherche).
- Liste aller Fenster, die auf Englisch geprüft wurden (mit Screenshots).
- Bündelgröße vorher/nachher. Die zweite Sprache soll nur bei Bedarf geladen werden, Ziel: Start-Chunk +≤ 15 KB gzip.
- Kurzer Bericht. Danach kann `docs/prompts/kapitel-13-50.md` starten, mit Texten in beiden Sprachen.
