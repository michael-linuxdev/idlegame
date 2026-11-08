# Sprite-Plan (Grafik-Überarbeitung)

Auftrag für eine eigene Sitzung. Pakete 1–2 passen voraussichtlich in eine Sitzung,
3 und 4 je in eine weitere („Beginne bei Paket 3, Pakete 1–2 sind erledigt“).

---

Du arbeitest im Repo michael-linuxdev/idlegame (Spiel „Gartenerbe“, React 19 + Vite +
TypeScript, PWA). Lies zuerst CLAUDE.md und halte dich daran.

**WICHTIG – Spielstand:** Die Spielstand-Migration ist aktiv, es gibt echte Spielstände.
Diese Aufgabe ist reine Darstellung. GameState, Speicherformat und SAVE_VERSION bleiben
unverändert. Falls ein Punkt doch eine Format-Änderung bräuchte: nicht umsetzen, sondern
melden.

## Hintergrund

Die gesamte Spielgrafik besteht aus handgezeichneten Inline-SVG-Komponenten in `src/theme/`:

- `ModuleArt.tsx`: 10 Gartenbereiche (GeneratorId) × 5 Wachstumsstufen, viewBox 100×86
- `PlotArt.tsx`: WildPlot (gesperrt, 3 Varianten via `index % 3`) und ClearedPlot, 100×86
- `HandParts.tsx`, `HandArt.tsx`, `HandArtA.tsx`, `HandArtB.tsx`: Kapitel-Grafik, viewBox 80×72
- `ChapterArt.tsx` + `chapterArtSpecs.ts`: allgemeine Kapitel-Grafik aus Specs, 80×72
- `OrchardArt.tsx`, `VineyardArt.tsx`, `*Backdrop.tsx`, `MapBackdrop.tsx`, `WinterScene.tsx`
- `DecorArt.tsx` (40×40), `ResidentArt.tsx` (32×32), `icons.tsx` (24×24)
- Figuren: `src/components/HelperWalker.tsx` (48×40), `Visitors.tsx`, `GardenCritters.tsx`,
  `ChapterCritters.tsx`
- Stufen-Schwellen: `src/theme/tiers.ts` (moduleTier, Stufen 1·10·25·50·100)
- Einbindung: `src/components/GardenMap.tsx` (ModuleArt/WildPlot/ClearedPlot, PlotFx,
  data-season/data-daypart auf `.garden-stage`) und `src/components/ChapterMap.tsx`
  (Weiche weinberg/obstwiese/HAND_ART_CHAPTERS/ChapterAreaArt)
- CSS: `src/theme/garden.css`, `polish.css` (`.ambient-tint`, Jahreszeiten-Filter),
  `expansion.css` (ha-graze, ha-swim, Helfer), `hud.css`, `story.css`, `panels.css`
- Store-Screenshots zum Vergleich: `docs/store/screenshots/02-garten-waechst.png` und
  `03-gartenpark-abend.png`

## Arbeitsweise

- Arbeite die Pakete in dieser Reihenfolge ab: 1 → 2 → 3 → 4.
- Pro nummeriertem Punkt ein eigener Commit mit klarer deutscher Commit-Nachricht.
- Nach jedem Paket: `npm test`, `npm run lint`, `npm run build`, `npm run e2e`. Alle müssen
  grün sein, bevor du pushst. Push nach jedem Paket, damit nichts verloren geht.
- Sieh dir das Ergebnis im Browser an (Playwright/Chromium sind installiert). Mach
  Screenshots vom Spielfeld bei Tag und Nacht sowie für alle vier Jahreszeiten und
  vergleiche sie mit den Store-Screenshots.
- Nur Darstellung, keine Spiellogik oder Balance ändern. Keine neuen
  Laufzeit-Abhängigkeiten; Dev-Abhängigkeiten nur, wenn unten genannt.
- Alle Animationen nur mit transform/opacity, und sie müssen bei
  `@media (prefers-reduced-motion: reduce)` und bei `html.idle` (siehe `polish.css`) aus sein.
- Wenn ein Punkt sich als unsinnig oder deutlich größer herausstellt: überspringen,
  begründen, weitermachen.

## Paket 1 – schnell und gut sichtbar

1.1 **Wildnis dominiert gebaute Bereiche:** WildPlot flacher und blasser zeichnen (Umrisse
    ~1–1,2 statt 2, gedecktere Farben bzw. ~70 % Deckkraft, niedrigere Silhouette).
    Stufe 1 jedes Bereichs in ModuleArt mindestens so groß wie die Wildnis (v. a.
    Beerenhecke und Kräuterspirale vergrößern). Jede Stufe nimmt mehr Fläche ein als
    die vorherige.

1.2 **Wildnis-Wiederholung:** 5–6 WildPlot-Varianten statt 3, dazu je Index Spiegelung und
    kleine Abweichungen. Möglichst passend zum späteren Bereich (Obstwiese: Fallobst,
    Gewächshaus: kaputter Glasrahmen usw.). Die Varianten über GeneratorId zuordnen,
    nicht über `index % n`.

1.3 **Schilder verdecken Grafik:** Lege für das Schild (`.plot-sign`) einen freien Bereich
    am unteren Bildrand fest, etwa die unteren 14 viewBox-Einheiten. Wichtige Teile
    (z. B. die Vogelscheuche beim Gemüsebeet) aus diesem Bereich herausnehmen.

1.4 **Unnötiges Neuzeichnen:** HandArt, ChapterAreaArt, OrchardArt und VineyardArt nur dann
    neu zeichnen, wenn sich `moduleTier(level)` ändert (nicht bei jedem level), so wie es
    ModuleArt bereits macht.

1.5 **Doppelte SVG-IDs:** ChapterBackdrop (id aus Farbwert), MapBackdrop (gz-pickets,
    gg-grass, gg-light), OrchardBackdrop, VineyardArt, WinterScene → `useId()` verwenden.

1.6 **Doppelte Stufen-Animation:** ModuleArt hat einen eigenen tier-up-Zustand, GardenMap
    zusätzlich `PlotFx onTier` + `.tier-grow`. Einen Weg behalten (bevorzugt
    PlotFx/tier-grow), den anderen samt CSS entfernen.

1.7 **Barrierefreiheit:** Allen dekorativen `<svg>` `aria-hidden="true"` und
    `focusable="false"` geben (fehlt u. a. bei ChapterReady, ChapterWild und Svg in
    HandParts). Am besten zentral über einen gemeinsamen SVG-Rahmen.

1.8 **Doppelte `@keyframes`-Namen** (u. a. fade-in, firefly) eindeutig benennen.

## Paket 2 – Fundament

2.1 **Farbpalette:** `src/theme/art/palette.ts` mit ~40 benannten Farben (Laub
    hell/mittel/dunkel, Holz, Erde, Stein, Glas, Wasser, Haut, Umriss …), jeweils auch als
    CSS-Variable in `tokens.css`. Ähnliche feste Hex-Werte schrittweise auf die Palette
    umstellen (z. B. #5f9e45/#4f9a3a/#5f8a3a/#6d8a4a → Laub). Das Aussehen soll im
    Wesentlichen gleich bleiben. Ein Prüfskript (in `npm run lint` oder als Vitest) meldet
    neue feste Hex-Werte in `src/theme/art/**`.

2.2 **Gemeinsame Bausteine:** `src/theme/art/parts/` (Pflanzen, Tiere, Gebäude, Boden,
    Shadow). Doppelte Bausteine zusammenführen: Shadow (6×), Bed, Flower, Pot, Jar, Crate,
    Tree, Hen/Bird, `seeded()` (ChapterArt + OrchardArt). Bausteine werden um ihren
    Fußpunkt (0,0) gezeichnet und per translate/scale platziert, damit sie in 100×86 und
    80×72 gleich funktionieren.

2.3 **Stilregel** als Kommentar in `parts/index.ts` und umgesetzt:
    - drei Strichstärken (Kontur, Detail, Haarlinie)
    - Umrissfarbe je Material
    - ein einheitlicher Schatten (`var(--g-shadow)`, gleiche Höhe je Bildraster)
    - Licht von oben links

    Dazu eine Maßtabelle, z. B. Mensch = 18 Einheiten im 100×86-Raster, Huhn = 5,
    Biene = 2. Hühner, Bienen, Jonas usw. danach anpassen.

2.4 **Zentrale Liste:** `ART_REGISTRY: Record<ChapterId, { area, wild, ready, backdrop }>`
    statt der verstreuten Weichen in `ChapterMap.tsx` und `HandWild`. Test: Jedes Kapitel
    aus `src/game/chapters.ts` hat einen vollständigen Eintrag (kein Rückfall auf
    ChapterReady).

2.5 **Große Dateien aufteilen:** `ModuleArt.tsx` je Bereich, `HandArtA/B.tsx` je Kapitel in
    eigene Dateien unter `src/theme/art/`. Die öffentlichen Exporte bleiben kompatibel.

2.6 **Grafik-Übersicht:** Eine Entwicklerseite (z. B. `index.html?artsheet`, nur im
    Dev-Build oder per Query-Parameter) zeigt als Raster alle Bereiche × Zustand
    Wild/Geräumt/Stufe 1–5 × 4 Jahreszeiten × Tag/Nacht, außerdem die Kapitel.

2.7 **Tests:**
    - a) Vitest: Für jede GeneratorId und jedes Kapitel liefert jede Stufe 1–5 ein SVG,
      und Stufe n+1 hat mehr Elemente als Stufe n.
    - b) Alle `d`-Attribute lassen sich parsen (Dev-Abhängigkeit svg-path-parser o. Ä.
      ist erlaubt).
    - c) Screenshot-Vergleich der Grafik-Übersicht in `scripts/e2e`: Vergleichsbilder
      speichern, Abweichung über Schwellwert lässt den Test fehlschlagen. Ein
      Update-Befehl dokumentieren.

## Paket 3 – Stimmung

3.1 **Abendlicht auf den Bereichen:** `.ambient-tint` liegt unter den Plots, deshalb bleiben
    die Bereiche abends und nachts taghell. Abend- und Nachtstimmung auch auf
    `.module-art` und `.plot-art` anwenden (über data-daypart, möglichst
    Palette/CSS-Variablen statt reinem filter). Leuchtende Fenster bei Hühnerstall,
    Hofladen, Orangerie (`Window lit` aus HandParts gibt es schon). Laternen bzw.
    Glühwürmchen an den Bereichen.

3.2 **Jahreszeiten im Hauptgarten:** season an ModuleArt, PlotArt und WildPlot übergeben
    (aus `ambient.season` in GardenMap). Je Bereich 1–2 Teile austauschen:
    - Frühling: Blüten an Obstbäumen
    - Herbst: Kürbisse, rote Blätter
    - Winter: Schnee auf Dächern und Beeten, Vlies, Strohhaube am Bienenstock

    Die Memo-Vergleichsfunktion um season erweitern.

3.3 **Bewegung beim Produzieren:** Bisher reagieren nur Kompost und Bienenstock auf
    `producing`. Jeder Bereich bekommt eine kleine Animation in Schleife (Hühner picken,
    Windrad am Gewächshaus, Blätter wiegen, Wasser glitzert, Kundschaft am Hofladen …).

3.4 **Wachsen spürbar machen:** Teile, die mit einer neuen Stufe dazukommen, werden
    gekennzeichnet (Klasse `.t-new`) und wachsen beim Stufenwechsel einmal ein (scale von
    unten, gestaffelt), statt dass das ganze Bild hüpft.

3.5 **Stufe 5 als Höhepunkt:** Jeder Bereich bekommt auf Stufe 5 ein Markenzeichen (z. B.
    Schild mit Omas Handschrift, Fahne). Ab Level 100 einmalig eine kleine
    Feier-Animation.

3.6 **Farbenblindheit:** Reif/unreif (Beeren, Äpfel, Radieschen) zusätzlich über Form oder
    Helligkeit unterscheidbar machen. Mit einer Deuteranopie-Simulation per Playwright
    (CSS-Filter oder SVG-Matrix) prüfen.

3.7 **Restliche Sonderzeichen:** ★, ✓ und ☰ (GardenMap, ChapterMap, UpgradeSheet,
    ShopPanel, AlbumSheet, AppNav) durch SVG-Icons aus `icons.tsx` ersetzen (IconStar,
    IconCheck, IconMenu). Screenreader-Texte (aria-label) bleiben erhalten.

## Paket 4 – Ausbau

4.1 Omas Laube mit eigener Grafik je Fortschritt (verfallen → hergerichtet → mit Blumen).

4.2 ResidentArt: kleine Bewegungen (blinzeln, Kopf drehen).

4.3 Jonas und Ilse (HelperWalker): 2–3 Laufbilder statt nur wackelnder Beine, plus eine
    Pause-Pose am Bereich.

4.4 DecorArt reagiert auf Nacht: Laternen und Lichterketten leuchten.

4.5 Wetter-Varianten bei aktiven Wetter-Ereignissen (`src/game/weatherEvents.ts`):
    Pfützen bei Regen, umgewehte Halme bei Wind. Nur Darstellung.

4.6 `scripts/generate-pwa-icons.py`: Das App-Icon aus den echten Bausteinen erzeugen
    (z. B. Gemüsebeet Stufe 5 per Playwright rendern). Vorher die bestehenden Icons
    vergleichen. Store-Screenshots mit `scripts/store/screenshots.cjs` neu erzeugen.

## Leistungsgrenzen (Paket 2 und 3 prüfen)

- Höchstens ~1.500 SVG-Elemente auf dem ganzen Hauptgarten bei allen Bereichen auf
  Stufe 5. Im e2e-Test zählen und erzwingen. Wiederholte Teile über `<symbol>`/`<use>`.
- Kapitel-Grafik per `React.lazy`/dynamischem `import()` je Kapitel laden. Bündelgröße
  vorher und nachher in der Abschlussmeldung nennen.

## Abschluss

Schreib am Ende eine kurze Zusammenfassung:

- je Punkt erledigt / übersprungen (mit Grund)
- Ergebnisse von npm test, lint, build und e2e
- Bündelgröße vorher/nachher und Elementzahl im Hauptgarten
- Vorher/Nachher-Screenshots von Tag, Nacht und Winter

Erstelle keinen Pull Request, außer ich bitte ausdrücklich darum.
