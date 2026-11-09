# Mehrsprachigkeit — Technik

Stand: Paket 1 der englischen Fassung (`docs/prompts/englisch.md`).

## Aufbau

```
src/i18n/
  index.ts      t, Locale, detectLocale(), setLocale(), initLocale(), useLocale()
  types.ts      Locale = 'de' | 'en', Strings (aus der deutschen Datei abgeleitet)
  de/           Ausgangssprache — liegt im Start-Bündel
  en/           Englisch — gleicher Typ `Strings`, wird nur bei Bedarf geladen
```

- **Deutsch ist die Quelle.** `Strings` ist der deutsche Typ mit verbreiterten
  Literalen (`Widen<typeof de>`): Texte dürfen anders lauten, aber jeder
  Schlüssel, jede Listenlänge und jede Funktions-Signatur muss passen, sonst
  bricht `tsc`. `src/test/i18n.test.ts` vergleicht zusätzlich die Schlüsselbäume.
- **Sprache beim Start:** `?lang=de|en` (Tests, Store-Screenshots) → gespeicherte
  Wahl (`gartenerbe-pref-lang`, `src/game/prefs.ts`, nicht im Spielstand) →
  erste Browser-Sprache: `de*` = Deutsch, sonst Englisch.
- **Umschalter:** Menü → Einstellungen → Anzeige → „Sprache / Language“.

## Entscheidung: Live-Wechsel (Variante a)

Gewählt vom Nutzer. Ein Sprachwechsel lädt die Seite **nicht** neu.

- `t` ist ein Proxy auf die aktive Sprache. Wer `t.x.y` beim Zeichnen oder in
  einer Funktion liest, bekommt immer die aktuelle Sprache.
- Die App-Wurzel abonniert `useLocale()`; nach dem Wechsel zeichnet sich die
  ganze Oberfläche neu, offene Fenster bleiben offen.
- **Regel für Datenmodule:** Texte nie beim Import aus `t` kopieren. Stattdessen
  Getter (`get name() { return t.modules.kompost.name }`) oder Funktionen.
  Zwei Tests wachen darüber:
  - `src/test/i18nStatic.test.ts` — kein `t.…` direkt im Modul-Gültigkeitsbereich.
  - `src/test/i18nStale.test.ts` — alle Module laden, auf eine Pseudo-Sprache
    wechseln, in den Exporten nach zurückgebliebenen deutschen Texten suchen.
- `useMemo`-Werte mit Texten folgen spätestens mit dem nächsten Spieltakt (250 ms).

## Zahlen

`src/game/format.ts` liest Trennzeichen und Einheiten aus `t.num`:

| | Deutsch | Englisch |
|---|---|---|
| Dezimal / Gruppe | `1,5` / `15.200` | `1.5` / `15,200` |
| Einheiten ab 100.000 | ` Tsd`, ` Mio`, ` Mrd`, ` Bio`, ` Brd`, ` Trd` (lange Skala) | `K`, `M`, `B`, `T`, `Qa`, `Qi` (kurze Skala) |

Deutsch „Mrd“ = 10⁹ = Englisch „B“. Ganze Zahlen mit Tausendertrennung:
`formatInt()`; Datum/Uhrzeit: `formatDateTime()` — nie `toLocaleString('de-DE')`.

## Web-Manifest

Ein Web-Manifest hat genau eine Sprache (das Feld `translations` unterstützen
die Browser noch nicht). Daher:

- `lang: 'de'` (Ausgangssprache), Name = Marke.
- `description` kommt aus `src/i18n/{de,en}/manifest.ts` und enthält beide
  Sprachen, sobald sich die englische unterscheidet.
- `<html lang>`, `<title>` und `<meta name="description">` setzt die App zur Laufzeit.
- Store-Fassungen bekommen ihre Texte je Sprache aus `docs/store/listing*.md`.

## Prüfungen

- `src/test/i18n.test.ts` — Schlüsselbäume de/en gleich; keine deutschen Texte
  (Umlaute, „…“, deutsche Funktionswörter) in `src/game` und `src/components`
  außerhalb der Sprachdateien; (am Ende scharf) keine `TODO(en)` mehr in `en/`.
- E2E Abschnitt 11 (`scripts/e2e/smoke.mjs`): Browser `en-US` startet englisch,
  Umschalter wechselt ohne Neuladen, Wahl übersteht Neuladen, `?lang=` hat Vorrang.
  Alle übrigen E2E-Abschnitte laufen mit Browser-Sprache `de-DE`.
