# Leistung — Messung und Verbesserungen (2026-11-09)

Gemessen in der Cloud-Umgebung (4 Kerne, Chromium über Playwright), CI-Zahlen
aus GitHub Actions (`ci.yml`, Lauf vom 2026-11-09 21:26).

## Übersicht vorher / nachher

| Messgröße | vorher | nachher | Bemerkung |
|---|---|---|---|
| Start-Bündel JS (index.html: Skript + modulepreload) | 830 KB roh / 261 KB gzip | 832 KB / 262 KB | unverändert (siehe 1.) |
| Start-CSS | 173 KB / 37 KB gzip | 174 KB / 37 KB | unverändert |
| Alle JS/CSS-Bündel | 2147 KB / 635 KB gzip | 2152 KB / 636 KB | |
| Precache (Service Worker) | 130 Einträge, 2587 KiB | 131 Einträge, 2593 KiB | +1 Kapitel-Teil durch Merge von main |
| Kapitel-Karte, alle Bereiche Stufe 5, Maximum | **1681** SVG-Elemente (Tulpenfelder, Frühling) | **1430** (Fassadengarten, Sommer) | Grenze 1500, jetzt per Unit-Test geprüft |
| Hauptgarten, alle Bereiche Stufe 5 | 1434 | 1434 | Grenze 1500 (`art.mjs`) |
| Spielstand, 50 Kapitel voll ausgebaut | 38,2 KB (37,5 KB bei 49 Kapiteln) | unverändert | Test-Grenze 100 KB |
| `npm test` (Wand-Uhr) | 11,8–12,7 s | 9,4–9,6 s | −25 % |
| langsamste Testdatei | `artTiers.test.tsx` 8,5 s | `artSeasons.test.tsx` 4,5 s | |
| `screens.mjs en --strict` | 1 von ~4 Läufen „leere Seite“ (Neulade-Krücke) | Krücke entfernt, siehe 5. | |

Zahlen „Start-Bündel“ = alle Dateien, die `dist/index.html` direkt lädt
(Skript, `modulepreload`, Stylesheet), gzip Stufe 9.

## 1. Start-Bündel und Ladezeit

Größte Teile des Starts (Quelltext-Anteile aus Sourcemaps):

- `index-*.js` 461 KB roh: davon react-dom 198 KB, Rest Garten, Karte, Menü.
- `i18n-*.js` 208 KB roh / 76 KB gzip: **deutsche Texte**. Darin die Kapiteltexte
  `stringsChapters.ts` 28 KB, `…Arc2` 24 KB, `…Arc3` 27 KB, `…Arc4` 31 KB —
  zusammen **111 KB roh, geschätzt 38 KB gzip** (≈ 15 % des Start-JS).
- Kapitel-Grafik 13–50 liegt **nicht** im Start: jedes Kapitel ist ein eigenes
  Bündel (`chapterArt.ts`); im Start nur die Lade-Tabelle (7 KB).
- Englisch (`en/strings`) wird nur bei Bedarf geladen.

**Entscheidung: Kapiteltexte nicht auslagern.** Der Gewinn ist kleiner, als
die Zahl aussieht:

- Beim ersten Besuch lädt der Service Worker ohnehin alle 131 Dateien
  (2,6 MB) in den Precache; danach kommt alles lokal. Gespart würden nur
  ~38 KB vor dem ersten Bild beim allerersten Besuch (≈ 0,2 s bei langsamem
  Mobilfunk). Das Parsen von Text-Literalen kostet praktisch nichts.
- Titel, Chip, Teaser und Währung braucht der Start (Grundstücks-Auswahl,
  Kopfzeile). Auslagern ließen sich nur Briefe und Bereichsnotizen — das
  hieße, den Typ `Strings` aufzuteilen, beim Sprachwechsel einen zweiten
  Teil nachzuladen und Karte, Sammlung, Projekte und Saison-Panel auf ihn
  warten zu lassen. Viel Umbau an Dateien, an denen gerade andere arbeiten,
  für wenig Wirkung.
- Wenn das Start-Bündel später spürbar wächst: Kandidat bleibt
  `intro.body` + `areas.*.note` je Sprache als eigenes Bündel, geladen
  zusammen mit `ChapterMap` (Regel „Texte nie beim Import aus `t` kopieren“
  bliebe erfüllt, wenn der Zugriff über `chapterCopy()` läuft).

## 2. Laufzeit: SVG-Elemente je Kapitel-Karte

Gemessen im Browser (`svg *` in `.orchard-stage .garden-map`, alle zehn
Bereiche auf Stufe 120 = Grafik-Stufe 5). Vorher, Höchstwerte:

| Kapitel | Höchstwert | wann |
|---|---|---|
| 21 Tulpenfelder | **1681** | Frühling (alle Tageszeiten) |
| 46 Fassadengarten | 1430 | Sommer |
| 20 Cottagegarten | 1308 | Sommer |
| 45 Wildblumenband | 1303 | Sommer |
| 35 Oase | 1216 | Herbst |
| alle übrigen | ≤ 1155 | |

Tulpenfelder lag deutlich über der Grenze des Hauptgartens (1500): Im
Frühling blühen ~100 Tulpen, 85 Hyazinthen und 24 Narzissen, jede in einer
eigenen `<g>`-Hülle ohne Attribute. **Vereinfacht ohne sichtbare Änderung:**
`Tulip` (partsD.tsx), Hyazinthen und Narzissen ohne leere `<g>`-Hüllen
(Fragment statt `<g>`; gleiche Zeichnung, gleiche Reihenfolge). Ergebnis
1681 → **1424**. Vergleichsbilder (`art.mjs`) unverändert.

**Neue Prüfung:** `src/test/artSeasons.test.tsx` rechnet für jedes Kapitel,
jede Jahreszeit und jede Tageszeit Kulisse + Tierleben + zehn Bereiche
(Stufe 5) + 30 (Sterne auf den Plaketten) — das stimmte bei allen
Stichproben genau mit der Browser-Zählung überein — und verlangt ≤ 1500.
Ohne Browser, ~0,5 s.

## 3. Spielstand-Größe und localStorage-Budget

- `saveSize.test`: 49 Kapitel voll ausgebaut 37 507 Zeichen, je Kapitel
  höchstens 720 → hochgerechnet auf 50 Kapitel **38,2 KB** (Grenze 100 KB).
  Neuer Spielstand: 15,7 KB.
- Schlimmster Fall auf dem Gerät: Spielstand + Sicherungskopien
  (`-before-v<N>`, `-broken`) ≈ 3 × 38 KB ≈ 115 KB.
- Playtest-Log: Budget 1,5 MB (abgeschlossene Tage) + ~0,5 MB (laufender Tag,
  Roh-Rest) ≈ 2 MB. Bei Platzmangel gibt `freePlaytestSpace()` zuerst den
  Roh-Rest frei; der Spielstand geht vor.
- Browser-Grenze ≈ 5 Mio. Zeichen je Herkunft (Chrome, Safari). Zusammen
  < 2,2 Mio. → reichlich Luft; der Spielstand ist kein Engpass.

## 4. Testlaufzeit

Vorher (`npm test`, 55 Dateien, 244 Tests): 11,8–12,7 s Wand-Uhr; kritischer
Pfad war `artTiers.test.tsx` mit 8,5 s (darin „gültige Pfade“ 6,6 s: rund
10 000 Kapitel-Zeichnungen, Sommer doppelt; dazu `art.test.tsx` mit noch
einmal allen Sommer-Zeichnungen, 1,8 s).

Umbau ohne schwächere Prüfungen:

- `src/test/artRender.ts`: Zwischenspeicher je Datei — jede Kapitel-Grafik
  (Kapitel, Bereich, Stufe, Jahreszeit) wird nur einmal gezeichnet; jeder
  verschiedene Pfad (13 299 statt 164 016) nur einmal geparst. Fehlerliste
  wie vorher (je Vorkommen).
- `artTiers.test.tsx`: Sommer (Wachstum je Stufe, Pfade, ART_REGISTRY —
  aus `art.test.tsx` hierher verlegt, nutzt dieselben Zeichnungen).
- `artSeasons.test.tsx` (neu): Frühling/Herbst/Winter + Leistungsgrenze der
  Kapitel-Karten; läuft parallel zu `artTiers`.

Nachher: 56 Dateien, 250 Tests, **9,4–9,6 s**. Langsamste Dateien:
`artSeasons` 4,5 s, `scripts/balance/tempo.test.ts` 4,0 s (Balance, nicht
angefasst), `artTiers` 2,4 s.

CI (`ci.yml`, ein Job, 7:18 min): `npm ci` 4 s, Lint < 1 s, Test 18 s, Build
4 s, Chromium-Installation 33 s, **E2E 6:04 min** (smoke de 2:07, smoke en
1:57, art 0:22, axe 0:20, screens 1:15), Balance 4 s. Der Hebel ist die
E2E-Stufe; smoke de/en parallel laufen zu lassen bräuchte getrennte Ports und
macht die Zeitgrenzen unter Last wackliger — bewusst nicht geändert.

## 5. Flakiness `screens.mjs` — Ursache und Behebung

Beobachtung: Nach dem Foto-Modus blieb beim nächsten `goto` gelegentlich die
Seite leer (≈ 1 von 4 Läufen), selten fehlte auch das Menü.

Untersucht mit Anfrage-Protokoll, CDP-Navigationsereignissen und einer
Aufzeichnung von Web-Locks und `sessionStorage` in der Seite. Ergebnisse:

1. **Leere Seite:** In der neuen Seite brachen die ersten `modulepreload`-
   Anfragen (jsx-runtime, i18n, playtestLog, icons) nach ~30 ms mit
   `net::ERR_ABORTED` ab, ohne zweite Navigation. Ein abgebrochenes
   `modulepreload` vergiftet die Modul-Tabelle des Dokuments: das
   Start-Modul läuft nie, `#root` bleibt leer, auch nach dem `load`-Ereignis.
   Auslöser: schnelle Navigation, während Seiten noch Bündel laden (die App
   lädt nach dem Start im Leerlauf Fenster-Bündel und 49 Kapitel-Grafiken
   vor) — und Neuladen der App mitten im Start (Punkt 2). Vermutlich teilt
   Chromium laufende Anfragen gleicher Adresse zwischen Dokumenten desselben
   Prozesses; abgebrochen wird dann auch die der neuen Seite. Ganz
   festnageln ließ sich das Innenleben nicht. Service Worker und
   `autoUpdate` waren **nicht** die Ursache (Worker nach ~1 s aktiv, keine
   neue Version, kein `controllerchange`). Mit dem Foto-Modus selbst hat es
   nichts zu tun; er lag nur an der Stelle der Schleife, an der es meist
   auftrat.
2. **Die App lud sich selbst neu** (CDP `requestedNav reload`, ~200 ms nach
   dem Laden), zwei Quellen:
   - **Spielstand-Sperre (`saveGuard.ts`):** Beim Neuladen hält die alte Seite
     die Web-Lock-Sperre oft noch kurz. Die neue Seite meldete dann „anderes
     Fenster“, wartete — und lud sich nach der Freigabe **noch einmal** neu.
     Das trifft auch Spieler (jedes Neuladen konnte doppelt laden und kurz
     den Hinweis „schon in einem anderen Fenster offen“ zeigen).
   - **`chunkReload.ts`:** dieselben abgebrochenen Anfragen als Fehler beim
     Nachladen eines Bündels → „neue Version“ → Neuladen.
   Ein Neuladen mitten im Start bricht wiederum laufende Anfragen ab (Punkt 1).

Behebung:

- **App, Spielstand-Sperre:** Der Stand wird vor dem ersten Laden gemerkt.
  Ist die Sperre belegt, zeigt die App „anderes Fenster“ erst nach 1,5 s
  (`OTHER_TAB_GRACE_MS`). Nach der Freigabe lädt sie **nur dann** neu, wenn
  jemand den Spielstand inzwischen geschrieben hat; sonst übernimmt sie
  direkt. Sicher, weil die wartende Seite selbst nichts speichert (Sperre in
  `storage.ts`) — jede Änderung kommt von der anderen Seite. Unit-Tests in
  `saveGuard.test.ts`; smoke Abschnitt 7 (zwei Fenster) prüft das Verhalten
  im Browser.
- **App, Sicherheitsnetz in `index.html`:** Läuft beim `load`-Ereignis das
  Start-Modul nicht (`window.__gartenerbeStarted` aus `main.tsx` fehlt), lädt
  die Seite einmal neu statt leer zu bleiben — gleiche 60-s-Sperre wie
  `chunkReload`. Kann Spieler treffen, z. B. wenn der Service Worker nach
  einem Update neu lädt, während noch vorgeladen wird.
- **Test:** `screens.mjs` öffnet die Seite erst neu, wenn die vorige keine
  offenen Anfragen mehr hat, und macht erst weiter, wenn auch die neue
  300 ms ruhig ist (`reopen()`/`settle()`; ein Neuladen der App wäre dann
  schon vorbei). Nur „vorher warten“ reichte nicht (1 von 6 Läufen: Menü
  verschwand durch ein Neuladen der App). Die Neulade-Krücke ist entfernt.
- **E2E-Server:** `vite preview` wird direkt mit Node gestartet statt über
  `npx`; `kill()` beendete sonst nur `npx`, der Server lief als Waise weiter
  und hielt die festen Ports (4321–4323 waren dauerhaft belegt; folgende
  Läufe nutzten unbemerkt den alten Server). Bei belegtem Port gibt es jetzt
  einen Hinweis.

Nachweis: siehe Abschnitt „Prüfläufe“ unten.

## Prüfläufe

- Vorher, Diagnose (`screens.mjs` mit Schleife ×3–5): leere Seite in etwa
  jedem vierten Lauf, Selbst-Neuladen der App in etwa jedem zweiten.
- Nach den App-Änderungen, nur „vorher warten“: 5 von 6 Läufen grün
  (1× Menü weg durch Neuladen der App).
- Endstand: `node scripts/e2e/screens.mjs en --strict` **6 von 6 grün**
  (je 85–87 s), ohne Neulade-Krücke.
- `npx tsc -b`, `npm run lint`, `npm run build`: grün.
- `npm test`: 57 Dateien, 259 Tests grün, 9,7 s (mit inzwischen
  hinzugekommenen Tests aus main).
- `npm run e2e`: grün in 6:31 min (smoke de + en, art: 59 Blöcke
  unverändert — auch die Tulpenfelder —, Hauptgarten 1434, axe 0 Verstöße,
  screens 34 Ansichten).

Hinweis: In der gemeinsam genutzten Umgebung liefen beim Messen noch alte
Vorschau-Server (Waisen früherer Läufe) auf 4321–4323; die Tests nutzten sie
(sie lesen `dist/` bei jeder Anfrage von der Platte). Mit dem neuen Start
entstehen keine neuen Waisen.
