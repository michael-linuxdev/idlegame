# Prompt: Kapitel 13–50 „Omas Gärten in aller Welt“

> Diesen Text als Auftrag an eine Claude-Code-Sitzung im Repo `idlegame` geben. Er ist für **mehrere Sitzungen** gedacht. Jede Sitzung liest den Abschnitt „Fortschritt“ in `docs/kapitel/plan.md` und macht beim nächsten offenen Paket weiter.
> **Voraussetzungen:** Aufräum-Runde (`docs/prompts/aufraeumen.md`) und englische Fassung (`docs/prompts/englisch.md`) sind gemergt. Neue Kapitel brauchen also **deutsche und englische Texte**. Ist der Sprite-Plan (`docs/sprite-plan.md`, Branch `claude/serene-meitner-eudtdr`) schon umgesetzt, gelten seine Bausteine, Palette und `ART_REGISTRY`. Sonst baust du in der heutigen Struktur und hältst dich so weit wie möglich an seine Stilregeln.

---

Du arbeitest an **Gartenerbe** (Vite + React 19 + TypeScript, PWA, echte Spieler, zweisprachig de/en). Lies zuerst `CLAUDE.md`, `ROADMAP.md` (besonders „5-Jahres-Plan“ und Pipeline 14–15d), `README.md`, `src/game/chapters.ts` und `docs/sprite-plan.md`.

**Ziel:** 38 neue Kapitel (13–50), **alle handgezeichnet** in der Qualität von Kapitel 7–12 (`theme/HandArtA.tsx`, `HandArtB.tsx`). Jedes Kapitel bekommt:
- 10 Bereiche mit je 5 sichtbaren Stufen und eigene Wildnis
- eigene Landschaft, eigenen Weg und eigenes Tierleben
- eigene Währung
- einen Brief (de + en) und Notizen je Bereich

Die Kapitel tragen das Spiel inhaltlich über die nächsten Jahre (Engagement-Horizont ~5 Jahre laut ROADMAP).

## Harte Regeln

- **Spielstand:** Kapitel werden nur **angehängt**, IDs nie geändert (`CLAUDE.md`). `parseChapters` füllt fehlende Kapitel automatisch; das mit einem Test für einen v3-Stand ohne die neuen Kapitel belegen. Wenn die neue Freischalt-Taktung (Paket 1) ein Feld braucht: Startwert aus dem Fortschritt ableiten, `SAVE_VERSION` nur bei echter Inkompatibilität erhöhen, dann Migration und Fixture nach Regel.
- **Bestehende Kapitel 2–12 bleiben unverändert** in Grafik, Werten und Freischaltung. Kein Spieler verliert ein offenes Kapitel. Wer heute Kapitel 12 offen hat, sieht danach Kapitel 13 frühestens nach der neuen Regel.
- **Zweisprachig:** Jeder Text in `de` **und** `en` (Glossar `docs/i18n/glossar.md` beachten und um neue Begriffe ergänzen). Der Typ-Check für beide Sprachen muss grün sein.
- **Leistung:** Kapitel-Grafik wird je Kapitel nachgeladen (`React.lazy`/`import()`). Der Start-Chunk darf durch diese Runde um höchstens 10 KB gzip wachsen. Höchstens ~1.500 SVG-Elemente auf einer voll ausgebauten Kapitelkarte, im E2E gezählt. Ruhemodus (`idle.ts`) und `prefers-reduced-motion` gelten für alle neuen Animationen; animiert wird nur `transform` und `opacity`.
- **Balance:** Neue Kapitel-Boni (`gardenBonusPerLevel`, Projekte, Sammlung) mit dem Simulator prüfen. Kein Kapitel darf die Garten-Kurve sprengen. Werte und Begründung in `ROADMAP.md` „Balance“.
- Nach jedem Paket: `npm test`, `npm run lint` (0), `npm run build`, `npm run e2e`. **Ein PR pro Paket**, selbst mergen, sobald die CI auf dem aktuellen Head grün ist. Branch vorher auf `main` bringen, nie zwei Pakete auf einem offenen PR. Push nach jedem Paket, damit nichts verloren geht.
- Inhalte respektvoll: Bei Gärten anderer Länder keine Klischees und keine Karikaturen von Menschen, echte Pflanzen und Bauweisen. Briefschreiber mit eigener, glaubwürdiger Stimme.
- Wenn ein Kapitel deutlich größer wird als die anderen: vereinfachen statt aufblähen. Die Qualität soll **gleichmäßig** sein.

## Ausgangslage (gemessen am 2026-11-09)

- `src/game/chapters.ts`: Kapitel 2 Streuobstwiese (nach dem 1. Tiefen Winter), 3 Weinberg (Generation 1), 4–12 über `after(prev, …, gen)`: **Generation N−2 und der 8. Bereich des vorigen Kapitels**. Jedes Kapitel hat `ladder(namen, slots, scale)`, `gardenBonusPerLevel = 0,004 + 0,0005·(N−3)` und eigene Währung. Texte: `src/i18n/de/stringsChapters.ts` (und `en/`) (`laterChapterStrings`: title, currency, chip, to, teaser, intro-Brief, areas mit Name/Kurztext/Omas Notiz). Grafik: `HAND_ART_CHAPTERS`/`chapterArtSpecs.ts`, `HandArtA.tsx` (7–9), `HandArtB.tsx` (10–12), Teile in `HandParts.tsx`, Wege in `ChapterPaths.tsx`, Tiere in `ChapterCritters.tsx`, Hintergründe in `MapBackdrop`/`ChapterArt`.
- **Kapitel 12 Gartenschau ist das erzählerische Finale** (Omas Gedenkgarten). Kapitel 13+ brauchen einen **neuen Bogen**.
- **Taktung heute (Sim, `GEN=1`):** Generation 10 bzw. Kapitel 12 erreicht der Dauerspieler an Tag 122, Regular an Tag 241, Casual erst nach Tag 365. Die Generationen-Hürde ist `3 + N` Tiefe Winter. Mit der heutigen Regel (Generation N−2) bräuchte Kapitel 50 Generation 48, das ist unerreichbar. **Die Kapitel-Bedingung „8. Bereich“ wird heute nicht simuliert.**
- Abhängige Systeme: Großprojekte (`projects.ts`, Kapitel-Gruppen), Sammlung & Ziele (`CollectionSheet`, alle Kapitel als Silhouette), Grundstücke-Auswahl (`PlotPicker`), Oma Ilse (pflegt alle Kapitel, bezahlt in Obst), Kapitel-Pflege (`care`), Playtest-Log (Kapitel-Ereignisse), Featurefreischaltung (`featureUnlocks.ts`, `projects`).

## Paket 0 — Plan & Geschichte (keine Code-Änderung außer Docs)

`docs/kapitel/plan.md` anlegen mit:
1. **Erzählbogen 13–50** in 4–5 Abschnitten. Vorschlag (darfst du begründet ändern):
   - **13–20 „Nach der Gartenschau“** (Heimat): Wintergarten, Schlossgarten, Gemeinschaftsgarten in der Stadt, Klostergarten, Rosengarten, Baumschule, Heidegarten, Deichgarten an der Nordsee.
   - **21–30 „Briefe aus Europa“**: Olivenhain in der Toskana, englischer Cottage-Garten, Tulpenfelder in Holland, andalusischer Patio, Zitrusgarten auf Sizilien, skandinavischer Beerenwald, Schwarzwälder Kirschgarten, irischer Steingarten, portugiesischer Korkeichenhain, ungarische Paprikafelder.
   - **31–40 „Gärten der Welt“**: Teeplantage, Reisterrassen, Kakteengarten, Regenwald-Garten, Kaffeefinca, Gewürzgarten, Bambushain, Milpa-Feld, australischer Buschgarten, neuseeländischer Farngarten.
   - **41–50 „Die nächste Generation“**: Dachgarten, vertikaler Garten, Samenbank, Forschungsgewächshaus, Schulgarten, Waldgarten, Wildblumen-Korridor, Klimagarten, Weltgartenschau, **50: Omas Schrebergarten – zurück zum Anfang** (großes Finale, schließt den Kreis zu Kapitel 1).
   - Doppelungen mit 2–12 vermeiden (Lavendel, Japan, Botanik, Kräuter, Teich, Imkerei, Alm, Bauernhof, Weinberg, Streuobst gibt es schon).
2. Je Kapitel: ID (Kleinbuchstaben, stabil), Nummer, Titel de/en, Währung de/en, Briefschreiber (neue Figuren, aber auch Wiederkehrende wie Jonas als Erwachsener, Ilse, Hilde, Fritz), 10 Bereichsnamen, Landschaftsidee, 3 Tiere/Bewegungen, Jahreszeiten-Besonderheit, Wegform (ZIGZAG/TERRACES/RING o. ä.).
3. **Taktung** (siehe Paket 1) mit Zielwerten.
4. **Wellen:** Die 38 Kapitel in Wellen von **4–6 Kapiteln** aufteilen, eine Welle pro Paket. Jede Welle ist für sich fertig und spielbar.
5. Abschnitt „Fortschritt“ mit Checkliste je Paket/Welle.

## Paket 1 — Taktung & Technik

1. **Neue Freischaltregel ab Kapitel 13**, über den Simulator festgelegt. Ziele:
   - Regular erreicht Kapitel 13 etwa im Monat 9–12. Danach kommt etwa **alle 4–6 Wochen** ein neues Kapitel, Kapitel 50 also nach ~4–5 Jahren.
   - Dauerspieler nicht schneller als ~1 Kapitel in 2 Wochen. Casual erreicht mindestens Kapitel 20 in 2 Jahren.
   - Mögliche Bausteine: Meisterschaft des vorigen Kapitels (alle 10 Bereiche angelegt / Mindeststufe), Generationen mit flacherem Abstand ab 13 (z. B. alle 2 Kapitel eine Generation), Kapitel-Währung insgesamt, Zeit seit Öffnen des vorigen Kapitels.
   - **Keine reine Wartezeit-Sperre ohne Handlung** (keine Energy-Walls, siehe Prinzipien).
2. **Simulator** (`scripts/balance/sim.ts`): Kapitel mit simulieren. Heute fehlt die Bedingung „8. Bereich“ ganz. Neue Ausgabe `chapters: K13@dX K14@dY …` mit `GEN=1` über 5 Jahre (`… engaged|regular|casual 43800`, ggf. gröberer Takt außerhalb der Sitzungen für Laufzeit < 2 min). Einen Tempo-Korridor-Test für die Kapitel-Taktung in `scripts/balance/`, kurze Laufzeit.
3. **Daten statt Code:** Kapitel 13+ vollständig als Daten (Liste in `chapters.ts` oder eigene Datei `chapters2.ts`). Texte je Sprache in eigenen Dateien je Kapitel oder Welle (`src/i18n/de/chapters/…`, `src/i18n/en/chapters/…`).
4. **Grafik-Registry:** Jedes Kapitel hat genau einen Eintrag (area, wild, ready, backdrop, path, critters) mit Lazy-Import. Ein Test stellt sicher, dass jedes Kapitel aus `CHAPTERS` einen vollständigen Eintrag hat und **keines** auf die allgemeine Ersatzgrafik fällt.
5. **UI bei 50 Kapiteln:** Grundstücke-Auswahl und „Sammlung & Ziele“ gruppiert nach Bogen (einklappbar, nur offene + nächstes ausführlich, der Rest als Silhouette mit Bedingung). Großprojekte für neue Kapitel-Gruppen (mindestens eins je Bogen, Belohnung Deko oder kleiner Dauerbonus).
6. **Spielstand-Größe:** 50 Kapitel × Bereiche × Pflege. Speichergröße messen (Ziel < 100 KB), ggf. leere Kapitel kompakt speichern (Parser füllt auf). Ein Test sichert das ab.
7. Testparameter: `?kapitel=all` und `?kapitel=13,27` müssen weiter funktionieren.

## Pakete 2 … n — Wellen (je 4–6 Kapitel pro PR)

Pro Kapitel der Welle:
1. **Daten:** 10 Bereiche (Kosten-/Ertragsleiter wie die Nachbarkapitel, Skalierung fortführen), Währung, `gardenBonusPerLevel` nach der Regel aus Paket 1.
2. **Texte de + en:** Titel, Währung, Chip, Teaser mit Freischaltbedingung, Brief (4–6 Absätze im Ton der bisherigen Briefe, eigene Stimme des Absenders), je Bereich Name, Kurztext und eine Notiz („Omas Notiz“; in Bogen 4 können die Notizen von der nächsten Generation stammen).
3. **Handzeichnung:**
   - je Bereich 5 Stufen, jede deutlich größer und reicher als die vorige
   - eigene Wildnis (3 Varianten), Landschaft/Hintergrund mit Tag/Nacht und 4 Jahreszeiten
   - Weg, 2–3 animierte Tiere/Bewegungen
   - Bausteine aus `HandParts`/`art/parts` wiederverwenden, neue Bausteine dort ablegen
   - Stilregeln des Sprite-Plans: Strichstärken, Licht von oben links, Palette, Maßtabelle
4. **Prüfen:**
   - Screenshots jeder neuen Karte bei Tag, Nacht und Winter, auf allen Stufen (Grafik-Übersicht `?artsheet` aus dem Sprite-Plan, falls vorhanden; sonst eigenes Skript), abgelegt unter `e2e-screens/kapitel/<id>/`
   - Elementzahl ≤ ~1.500
   - E2E öffnet jedes neue Kapitel einmal (`?kapitel=<n>`) und prüft auf Seitenfehler
5. Nach jeder Welle Simulator-Lauf (5 Jahre) und die Taktung in `docs/kapitel/plan.md` aktualisieren.

## Letztes Paket — Finale & Abschluss
- Kapitel 50 als Höhepunkt: Rückkehr in Omas Schrebergarten, eigener Abschlussbrief und eine kleine Abschluss-Szene (nur Darstellung). Danach geht das Spiel normal weiter (keine Sperre).
- `ROADMAP.md`: Pipeline-Punkt „Kapitel 13–50“, 5-Jahres-Plan aktualisieren (Sim-Taktung je Profil).
- Store-Texte de/en um die neuen Kapitel ergänzen (`docs/store/listing*.md`).
- Abschlussbericht: Kapitel je Welle, Bündelgröße vorher/nachher, größte Elementzahl, Taktung (wann welches Kapitel je Profil), offene Punkte.
