# Anleitung: eine Kapitel-Welle bauen (Kapitel 18–50)

Vorlage ist **Welle 1** (Kapitel 13–17, Commit `dd8f2de`, PR #122). Erst
`git show dd8f2de --stat` und die Dateien darin ansehen, dann genauso bauen.
Inhalt jedes Kapitels (Titel, Währung, Absender, Weg, Bereiche, Landschaft,
Tiere, Jahreszeit): `docs/kapitel/plan.md`. Regeln: `CLAUDE.md`.

## Schritte je Kapitel

1. **Daten**
   - Bereichs-IDs festlegen (10, Reihenfolge = Leiter): kurz, deutsch, ohne
     Umlaute, **eindeutig über alle Kapitel und den Garten**
     (`src/test/careNames.test.ts` prüft das). In `src/game/chapterPlan.ts`
     die Platzhalter ersetzen und in `docs/kapitel/plan.md` eine Tabelle
     „Welle N — Bereichs-IDs“ anlegen.
   - ID in den `ChapterId`-Union (`src/game/chapters.ts`), am Ende
     `RELEASED_UP_TO` in `chapterPlan.ts` auf das letzte Kapitel der Welle.
   - `src/test/chapters.test.ts`: Nummernliste verlängern.
2. **Texte de + en** (gleicher Typ, sonst bricht der Build)
   - Bogen II (20–29) in `src/i18n/{de,en}/stringsChaptersArc2.ts`,
     Bogen III in `…Arc3.ts`, Bogen IV + Finale in `…Arc4.ts`; Kapitel 18–19
     gehören zu Bogen I und kommen noch in `stringsChapters.ts`. Neue Dateien
     wie `stringsChapters.ts` aufbauen (Helfer `a()`) und in
     `stringsExpansion.ts` neben `...laterChapterStrings` einspreizen.
   - Je Kapitel: `title`, `currency`, `chip` (kurz!), `to`, `teaser`,
     `intro { title, body[5], cta }`, `areas { id: a(name, blurb, note) }`.
   - Teaser: Freischaltung ab Fortschritt 11 + (N − 13) / 2. Ganze Zahl G →
     „ab der G. Generation“; halbe → „ab der Mitte der G. Generation“; dazu
     „wenn <letzter Bereich des vorigen Kapitels> …“ (wie Kapitel 13–17).
   - Brief: 4–6 Absätze in `body` (Anrede, 2–3 Absätze, Unterschrift), eigene
     Stimme. Grüße in der Landessprache nur mit Erklärung im Brief.
     **Keine Klischees, Figuren sind Fachleute.** Wo Wissen indigener
     Gemeinschaften berührt wird (Anden, Milpa, Australien, Neuseeland),
     schreibt jemand, der es selbst trägt, oder es wird ausdrücklich als ihr
     Wissen benannt. Echte Pflanzen, echte Bauweisen.
   - Ab Bogen IV stammen die Bereichs-Notizen von **Mila** (Jonas’ Tochter),
     nicht von Oma. Im Finale (Kapitel 50) schreibt wieder Oma.
   - Englisch: Ton und Begriffe nach `docs/i18n/glossar.md`; keine Umlaute
     im Englischen (Test), Anführungszeichen “ ” und ’. Figuren ins Glossar
     (Tabelle „Figuren“ und „Kapitel und Währungen“) eintragen.
   - Pflege-Namen: `src/i18n/{de,en}/careNames.ts` (je Bereich zwei kurze
     Namen) und `chapterCare.names` in `stringsExpansion.ts` (je Kapitel zwei).
     Kurz halten (Buttons).
3. **Grafik** (nur Palettenfarben `P.*` in `src/theme/art/**`; ein Test
   meldet jeden neuen Hex-Wert. Hex ist erlaubt in `src/theme/icons.tsx`,
   `chapterArtSpecs.ts`, `ChapterPaths.tsx`.)
   - `src/theme/art/chapters/<id>.tsx`: je Bereich ein Motiv, Rahmen
     `<Svg tier={tier}>` (80×72, Boden bei y≈64–66). Jede Stufe 1→5 zeigt
     **sichtbar mehr** (mehr SVG-Elemente) — in **allen vier Jahreszeiten**
     (`src/test/artTiers.test.tsx` prüft Sommer; für die anderen einen
     Wegwerf-Test schreiben, laufen lassen, wieder löschen). Jahreszeiten
     sichtbar (Winter Schnee/kahl, Frühling Blüte, Herbst Laub).
     Gemeinsame Teile: `partsA/B/C.tsx`, `../parts`, `HandParts`.
   - Gesperrte Ecken: `wildC.tsx` erweitern oder `wildD.tsx` neu.
   - `src/theme/art/kapitel/<id>.ts` (handEntry), Eintrag in
     `art/registry.tsx`, `art/chapterArt.ts` (LOADERS),
     `chapterArtSpecs.ts` (`HAND_ART_CHAPTERS` + `CHAPTER_ART[id]` mit
     `backdrop` und `areas`-Specs; Test verlangt je Bereich einen Spec).
   - Kulisse: neue `BackdropSpec`-Flag je Kapitel. **Neue Kulissen nicht mehr
     in `backdrop.tsx` stapeln**, sondern in `art/chapters/backdropArc<N>.tsx`
     (Komponenten `GroundExtras`/`HorizonExtras` je Bogen), die
     `backdrop.tsx` aufruft. Achtung: Die Boden-SVG ist 100×100 gestreckt
     (preserveAspectRatio none) — Deko dort klein halten (rx ≤ 3), sonst
     werden es große Klötze. Der Horizont (400×60) liegt oben hinter der
     Kopfleiste.
   - Weg: neue `PathStyle` in `src/theme/ChapterPaths.tsx`, passend zum Layout.
   - Tierleben: `src/components/ChapterCritters.tsx` + CSS in einer neuen
     Datei `src/theme/expansion/12-kapitel-tierleben-2.css` (in
     `expansion.css` nach 11 einbinden). Keyframe-Namen eindeutig (Test).
     `prefers-reduced-motion` beachten. Tiere dort, wo sie hingehören (Schwäne
     im Wasser, nicht auf der Wiese).
   - Währungs-Symbol: `IconChapterCurrency` in `src/theme/icons.tsx`.
4. **Großprojekt** am Ende eines Bogens (nach Kapitel 19, 29, 39, 49): neues
   Projekt in `src/game/projects.ts` über die Kapitel des Bogens, Texte wie
   `rosengarten` (grep danach: `stringsLife.ts` de+en u. a.).
5. **E2E**: In `scripts/e2e/smoke.mjs` Abschnitt 5 die Liste der Kapitel der
   neuen Welle in die Schleife aufnehmen (öffnet Brief + Karte, Fotos nach
   `e2e-screens/kapitel/`).

## Prüfen

- `npx tsc -b`, `npm test`, `npm run lint`, `npm run build`
- `node scripts/e2e/art.mjs` legt Vergleichsbilder für neue Kapitel an
  (`scripts/e2e/art-baseline/kapitel-<id>.png`). Weichen alte Blöcke nur
  wegen 1 px Höhe ab: `node scripts/e2e/art.mjs --update`, danach mit
  `git status` prüfen, dass sich nur diese und die neuen Bilder geändert
  haben.
- **Ansehen** (Read auf die PNGs): Grafikbogen jedes Kapitels und
  `e2e-screens/kapitel/<id>-de.png` nach `node scripts/e2e/smoke.mjs`.
  Typische Fehler: unsichtbar (Farbe = Hintergrund `P.leafLight`), zu klein,
  schwebend, Deko-Klötze auf der Karte, Tiere am falschen Ort.
- Zum Schluss `npm run e2e` (dauert ~15 min; mit `run_in_background` oder
  langem Timeout).
- Keinen Balance-Simulator laufen lassen (Zahlen ändern sich nicht).

## Abschluss

- `docs/kapitel/plan.md` „Fortschritt“: Welle abhaken (kurz, was drin ist).
  `ROADMAP.md` Zeile „Kapitel 2–N sind gebaut“ anpassen.
- Commit auf Deutsch, Ende mit den Attributions-Zeilen aus dem
  System-Reminder; `git push -u origin claude/intelligent-shannon-fs74am`.
  Keinen PR anlegen.
