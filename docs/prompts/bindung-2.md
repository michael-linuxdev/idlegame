# Prompt: Bindungs-Runde 2 „Briefkasten, Heute, Tage ohne Ziel“

> Diesen Text als Auftrag an eine Claude-Code-Sitzung im Repo `idlegame` geben.
> Grundlage: Analyse vom 2026-11-09 nach Abschluss der Bindungs-Runde 1
> (`docs/plan-nacht.md`, Pakete A–J ✅). Umfang: Punkte 3, 6 und 7 der Analyse.

---

Du arbeitest an **Gartenerbe / Heirloom Garden** (Vite + React + TypeScript, PWA, Deutsch + Englisch). Lies zuerst `CLAUDE.md`, `ROADMAP.md`, `README.md`, `docs/plan-nacht.md` und `docs/i18n/glossar.md`.

**Ziel dieser Runde:** Spieler sollen in den ersten zwei Wochen jeden Tag einen Grund haben, wiederzukommen, der sich wie Geschichte anfühlt, nicht wie Pflicht. Im Mittelspiel soll es keine wochenlangen Strecken ohne neues Ziel geben. Und die vielen täglichen Listen sollen zu einer einzigen, ruhigen Übersicht zusammenwachsen.

**Ausdrücklich nicht:** keine Echtgeld-Zufallsboxen, keine Strafen für verpasste Tage, keine verfallenden Inhalte, keine Energie-Sperren, keine Benachrichtigungs-Flut, kein Remote-Tracking. Verpasstes darf sich stapeln, aber nie verloren gehen.

## Harte Regeln

- **Spielstand-Migration ist aktiv** (`CLAUDE.md`): Felder im `GameState` nie umbenennen oder entfernen. Neue Felder bekommen einen Startwert in `parseGameState` (`storage.ts`) bzw. `parseExpansion` (`saveFields.ts`), Namen nach `docs/cleanup/namen.md`. Bei inkompatibler Änderung `SAVE_VERSION` erhöhen, Schritt in `MIGRATIONS`, Fixture `src/test/fixtures/save-v<N>.json`; `src/test/migration.test.ts` lädt alle alten Fixtures verlustfrei.
- Wo es geht, Zustand **außerhalb** des Run-Spielstands halten (wie `notebook.ts` mit `gartenerbe-notebook-v1` und `extras.ts` mit `gartenerbe-extras-v1`); dann gilt: eigener Schlüssel, Versionsfeld, robuster Parser mit Startwerten, Test für kaputte/fehlende Daten. Begründe in der Abschlussnotiz, wo was liegt.
- **Zwei Sprachen:** jeder sichtbare Text in `src/i18n/de/` **und** `src/i18n/en/` (gleicher Typ `Strings`). Ton: Omas Notizbuch; englische Begriffe nach `docs/i18n/glossar.md`. Texte nie beim Import aus `t` kopieren (Getter/Funktion). Zahlen nur über `src/game/format.ts`.
- Balance-Änderungen nur mit Simulator-Nachweis (`npm run balance`, Profile engaged | regular | casual) und Eintrag im Abschnitt „Balance“ von `ROADMAP.md`. Paket 6 ändert **keine** Balance, es misst nur — es sei denn, du findest eine Lücke und schlägst einen Fix vor (siehe dort).
- Nach jedem Paket: `npm test`, `npm run lint`, `npm run build`, `npm run e2e` — alles grün. E2E spielt Deutsch und Englisch, prüft axe und abgeschnittene Texte (`npm run screens -- en`).
- Ein Commit pro Paket, deutsche Commit-Nachricht im Stil der Historie. Fortschritt unten in diesem Dokument abhaken (✅ / übersprungen + Grund).
- Wenn sich ein Punkt als schlechte Idee erweist (Test bricht, Simulator zeigt Probleme, Bildschirm wird voller statt ruhiger), lieber weglassen und begründen als erzwingen.

## Befunde, auf denen das aufbaut

- **Briefe:** `src/game/notebook.ts` schaltet Briefe nur über Fortschritt frei (Gartenstufe, Gartenjahr, Jonas/Ilse, Generation). Es gibt keine Briefe, die an **echten Tagen** ankommen, und keinen gespeicherten Tag des ersten Starts. Das Notizbuch liegt getrennt vom Run-Spielstand und hat schon einen „Neu“-Punkt im Menü (`AppNav.tsx`, `unreadLetters`).
- **Tägliche Listen:** Gartenrunde (`dailyOps.ts`), Tagesziele (`quests.ts`), Omas Wochenplan und Bestellungen (`extras.ts`), Jahreszeiten-Album (`album.ts`), Fest-Marken (`fests.ts`), Sonnenfenster (`flashEvent.ts`), Rezept (`extrasCore.ts`), Wetter-Frage, Kürbis-Runde. Sie liegen an verschiedenen Stellen (Pillen, Menü-Kacheln, „Bald fertig“). Es gibt keinen Ort, der sagt: „Für heute bist du fertig.“
- **Takt im Mittelspiel:** `ROADMAP.md` → Regular erreicht Kapitel 12 um Tag ~206–268, Kapitel 13+ kommen alle 24–56 Tage, Generationen brauchen 3 + N Tiefe Winter, nach jedem Tiefen Winter 3 Tage Ruhezeit. Der Simulator misst Ereignisdichte nur in **Minuten** aktiver Spielzeit (`scripts/balance/sim.ts`, `eventDensity`; Korridor in `scripts/balance/tempo.test.ts`), nicht in **Tagen ohne neues Ziel**.

## Pakete (in dieser Reihenfolge)

### Paket 1 — Tage ohne Ziel messen (Analyse-Punkt 6)

Zuerst messen, damit die anderen Pakete wissen, wo die Lücken liegen.

1. **Neue Simulator-Kennzahl „Ziel-Lücke“** in `scripts/balance/sim.ts`: Für jeden Spieltag zählen, ob mindestens ein **neues sichtbares Ziel** erreicht oder freigeschaltet wurde. Als Ziel zählen: neuer Bereich angelegt (bisher nie), neues Gartenjahr-Tor, Tiefer Winter, Generation, Kapitel freigeschaltet, Kapitel-Bereich angelegt, Großprojekt-Stufe, Jonas-/Ilse-Stufe, Herausforderung geschafft, neue Saison-Karte zum ersten Mal, neuer Brief. **Nicht** als Ziel zählen: normale Saisonenden, Meilenstein-★, Krümel.
2. Ausgabe in `SUMMARY=1`: längste Strecke in Tagen ohne neues Ziel, Median der Lücken, und die drei längsten Lücken mit Tag und Stand (Gartenjahr, Tiefe Winter, Generation, Kapitel). Für 30, 90 und 365 Tage (`GEN=1`, `CHAPTERS=1`), alle drei Profile.
3. Ergebnis als Tabelle in `ROADMAP.md` (Abschnitt „Balance“) und kurz in `docs/kapitel/balance-bericht.md`.
4. **Korridor-Test** (neben `tempo.test.ts`, gleiche Laufzeit-Grenze wie dort, kurz genug für CI): Regular darf in den ersten 30 Tagen **keine Lücke > 3 Tage** haben. Grenzen für später (90/365 Tage) nur dokumentieren, nicht als Test, wenn die Laufzeit zu lang wird.
5. **Keine Balance-Änderung in diesem Paket.** Findest du eine Lücke über dem Korridor, schreibe einen Fix-Vorschlag mit Simulator-Zahlen in den Abschluss (z. B. Zwischenziel je Kapitel, Großprojekt-Stufe früher, Brief als Ziel aus Paket 2). Der Briefkasten (Paket 2) darf Lücken in den ersten 14 Tagen schließen; trage das nach Paket 2 erneut ein.

### Paket 2 — Omas Briefkasten (Analyse-Punkt 3)

Die Geschichte als täglicher Termin, ohne Pflicht.

1. **Briefserie für die ersten 14 Tage:** 14 kurze Briefe (je 2–4 Absätze), einer pro **echtem Kalendertag** ab dem ersten Start, in beiden Sprachen. Inhalt: Oma erzählt aus ihrem Gartenjahr, und jeder Brief endet mit einer kleinen offenen Frage oder Andeutung, die der nächste Brief auflöst (z. B. „Morgen erzähle ich dir, warum der Kompost nie umgesetzt werden durfte“). Die Briefe passen zu dem, was der Spieler in diesen Tagen erlebt (erste Beete, erstes Saisonende, Kreuzen, Gartenrunde), verraten aber keine Systeme, die noch nicht freigeschaltet sind (`featureUnlocks.ts`). Tag 14 schlägt die Brücke zur Hauptgeschichte (Kapitel 2).
2. **Ankunft:** ein Brief pro Kalendertag (lokale Mitternacht, gleicher Tages-Schlüssel wie `quests.ts`/`dailyOps.ts`). Verpasste Tage **stapeln sich**: Wer nach 5 Tagen wiederkommt, hat 5 Briefe im Kasten, die er in Reihenfolge lesen kann. Höchstens **ein** neuer Brief pro Kalendertag, auch nach langer Pause — nicht alle 14 auf einmal. Keine Belohnung, die verfällt; optional ein kleines Geschenk pro Brief (Samen-Krümel o. Ä.) nur, wenn der Simulator es nicht merkt.
3. **Zustand:** in der Notizbuch-Speicherung (`gartenerbe-notebook-v1` erweitern oder neuer Schlüssel), **nicht** im `GameState`: Tag des ersten Briefs, Anzahl angekommener Briefe, gelesene IDs. Parser mit Startwerten, Test für fehlende/kaputte Daten.
4. **Bestehende Spielstände:** Wer schon spielt, startet die Serie am Tag des Updates (Brief 1 sofort). Spieler mit Tiefem Winter oder Generation bekommen eine leicht andere Einleitung im ersten Brief („Ich hätte dir das früher schreiben sollen …“), damit es nicht nach Anfänger-Text klingt. Test: alter Notizbuch-Stand ohne Serie → lädt verlustfrei, Serie beginnt.
5. **Sichtbarkeit:** Briefkasten auf der Karte (an der Laube oder dem Gartentor) mit Fähnchen, wenn ein Brief da ist; Menü-Punkt „Notizbuch“ behält den Neu-Punkt. Kein Fenster, das sich von selbst öffnet — höchstens Omas Hinweis (`OmaHint`/`hints.ts`) einmal am Tag, nie über offenen Fenstern (`overlays.ts`).
6. **Erinnerung:** „Ein neuer Brief von Oma“ als Anlass in `notify.ts` nur, wenn der Spieler Erinnerungen schon erlaubt hat; die bestehenden Regeln (max. 2/Tag, nie 22–8 Uhr) gelten.
7. **Playtest-Log:** Ereignisse `brief_angekommen`, `brief_gelesen` (mit Tag der Serie und Abstand zur Ankunft) — für die spätere Frage, ob die Serie Tag 2–14 trägt.
8. **Simulator:** Ankunft eines Briefs zählt als „neues Ziel“ in Paket 1; Ziel-Lücke für die ersten 14 Tage neu messen und eintragen.
9. Tests: Ankunft je Kalendertag, Stapeln nach Pause, max. 1 neuer pro Tag, Zeitzonen-/Sommerzeit-Wechsel, Uhr zurückgestellt (keine doppelten oder verlorenen Briefe), bestehende Spielstände. E2E: Briefkasten öffnen, Brief lesen, Deutsch und Englisch, axe, keine abgeschnittenen Texte.

### Paket 3 — Die Heute-Seite (Analyse-Punkt 7)

Entlasten statt erweitern: eine Stelle für alles Tägliche, mit einem klaren „fertig für heute“.

1. **Neues Fenster „Heute“** (eigenes Bündel über `lazy.tsx`), erreichbar über einen festen Platz in der unteren Leiste oder ganz oben im Menü — entscheide nach Platz und begründe. Es bündelt nur, was **schon da** und **freigeschaltet** ist (`featureUnlocks.ts`): Gartenrunde, Tagesziele, Omas Wochenplan, offene Bestellungen, Brief des Tages (Paket 2), Album-Stempel bereit, laufendes Fest (Marken), Sonnenfenster, Rezept, Wetter-Frage, „Bald fertig“-Timer. Jeder Eintrag springt direkt an die Stelle, an der man ihn erledigt.
2. **Ein Fortschritt für den Tag:** ein Ring oder Korb „Dein Gartentag“. Ein Tag gilt als **voll**, wenn etwa zwei Drittel der heute verfügbaren Einträge erledigt sind — nicht alle. Danach sagt Oma ausdrücklich: „Für heute ist genug getan. Der Garten wächst auch ohne dich.“ Optionale Einträge bleiben sichtbar, aber gedämpft.
3. **Nichts Neues zum Abarbeiten:** Die Heute-Seite bringt **keine** eigene Belohnungsschiene und keine eigene Serie. Erlaubt ist höchstens eine kleine Geste beim vollen Tag (Stempel im Notizbuch, Animation); falls Belohnung, dann über `grantReward`, nur Kosmetik oder Samen-Krümel, und mit Simulator-Nachweis „unverändert“.
4. **Weniger an anderen Stellen:** Prüfe, welche Pillen, Punkte und Hinweise durch die Heute-Seite überflüssig werden, und blende sie aus oder fasse sie zusammen (Ziel: in der Kopfleiste höchstens **ein** Hinweis auf Tägliches, nämlich der Heute-Punkt). Nichts entfernen, was zum Erledigen gebraucht wird. Vorher/Nachher-Screenshots (Deutsch, iPhone-Größe) in die Abschlussnotiz.
5. **Urlaubs-Schalter** (Einstellungen): „Ich mache Gartenpause“. Solange er an ist: Gartenrunde-Serie und Wochenplan ruhen ausdrücklich (die Serie friert ohnehin ein — hier wird es **sichtbar** gesagt), Erinnerungen sind aus, die Heute-Seite zeigt keinen Fortschritt, nur „Willkommen zurück, wenn du so weit bist“. Briefe kommen weiter an und stapeln sich. Beim nächsten Öffnen der App fragt Oma einmal freundlich, ob die Pause vorbei ist. Zustand außerhalb des `GameState` (Geräte-Einstellung wie `prefs.ts`) oder mit Startwert — begründen.
6. **Neue Spieler:** Die Heute-Seite erscheint erst, wenn mindestens drei tägliche Dinge freigeschaltet sind (in `featureUnlocks.ts` eintragen, mit Omas Hinweis und Neu-Abzeichen). Davor reicht der Briefkasten.
7. **Playtest-Log:** `heute_geoeffnet`, `heute_voll` (Uhrzeit, Anteil erledigt), `pause_an` / `pause_aus` (Dauer).
8. Tests: Zusammenstellung der Einträge je Freischalt-Stand, Berechnung „voll“ (zwei Drittel, nie mehr als die verfügbaren), Tageswechsel um Mitternacht während die Seite offen ist, Urlaubs-Schalter schaltet Erinnerungen ab (`notify.ts`) und friert nichts ein, was nicht ohnehin einfriert. E2E: Heute-Seite öffnen, einen Eintrag anspringen, Pause an/aus, beide Sprachen, axe, keine abgeschnittenen Texte. Ruhemodus (`idle.ts`) nicht verschlechtern.

## Nicht in dieser Runde

- Statistik-Upload (Analyse-Punkt 1), Benachrichtigungen bei geschlossener App / Store-Hülle (Punkt 2), Saatschale „Bevor du gehst“ (Punkt 4), Saatgut-Tausch per Code (Punkt 5), Änderungen am Kleingartenverein.
- Keine neuen Wirtschafts-Systeme, keine neuen Währungen.

## Abschluss

- Alle vier Checks grün; `ROADMAP.md`: Pipeline-Punkt „Update-Runde Bindung 2 (Briefkasten, Heute, Ziel-Lücken)“ und die Simulator-Tabelle „Ziel-Lücke“ vorher/nachher.
- Kurzer Bericht: was gebaut, was weggelassen und warum, längste Ziel-Lücke je Profil (30/90/365 Tage) mit Fix-Vorschlägen, wo Zustand gespeichert ist und welche Risiken es für bestehende Spielstände gibt.
- Nur auf den zugewiesenen Branch pushen; keinen Pull Request ohne ausdrückliche Bitte.

## Fortschritt

- [ ] Paket 1 — Tage ohne Ziel messen
- [ ] Paket 2 — Omas Briefkasten
- [ ] Paket 3 — Die Heute-Seite
