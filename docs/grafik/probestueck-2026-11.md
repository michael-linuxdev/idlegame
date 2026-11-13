# Probestück „kräftiger Stil“ (2026-11-13)

Anlass: Die Grafik im Engine-Repo wirkt wertiger; Hauptgarten und Kapitel haben in Gartenerbe
unterschiedliche Reife. Das Probestück zeigt an drei Stellen, wie der Stil aussähe – ohne Bilddateien,
weiter als handgeschriebenes SVG.

- Hauptgarten: **Hühnerstall** und **Bienenstock** (`src/theme/art/garden/`)
- Kapitel 3: **Weinberg**, alle zehn Bereiche (`src/theme/VineyardArt.tsx`)
- Vorher/Nachher: `probe-hauptgarten.png`, `probe-weinberg.png`

## Regeln des kräftigen Stils
- **Drei Strichstärken** `BOLD` (`art/parts/style.ts`): Kontur 2 · Detail 1,2 · Haarlinie 0,7 im
  plot-Raster; im Kapitel-Raster × 0,85. Bisher: 1,3 · 0,9 · 0,5.
- **Eine Konturfarbe** `P.outline` für Gebäude, Laub, Stein und Kleinteile (bisher je Material eine
  andere, im Weinberg oft gar keine).
- **Licht- und Schattenseite** auf jeder Fläche (Licht von oben links): heller Streifen links,
  Schatten rechts und am Sockel; Dächer mit dunkler rechter Hälfte und Lichtkante.
- **Bausteine** in `art/parts/bold.tsx`: `Wall`, `GableRoof`, `Pane`, `ArchDoor`, `Post`.
- **Jeder Bereich eine eigene Silhouette:** Im Weinberg waren vier Bereiche dasselbe Häuschen mit
  anderer Dachfarbe. Jetzt: Winzerhäuschen (schmal, Steinsockel), Kelterhaus (Fachwerk, Tor,
  Spindelpresse), Weinkeller (Bruchstein-Portal im Hang), Straußwirtschaft (ausgehängter Strauß,
  Tische, Lichterkette).

## Stand
- Jahreszeiten, Abend/Nacht (`art-window`, Stimmungs-Variablen), Winter-Schnee und die
  Stufen-Animation (`t-new`) bleiben erhalten.
- Leistungsgrenze: Hauptgarten 1496 SVG-Elemente (vorher 1434). Die Grenze ist neu bewertet und
  liegt jetzt bei 2500 (Messung in `docs/leistung.md`, Abschnitt 2).
- Vergleichsbilder erneuert: 8× Hauptgarten, Weinberg.
- **Nicht ausliefern, bevor entschieden ist:** Zwei kräftige Bereiche neben acht alten sehen im
  Garten uneinheitlich aus.

## Nicht Teil des Probestücks
- Größe der Bereiche auf der Karte, Hintergrund mit Tiefe, Oberfläche (Farben, Schilder).
- Gemeinsame Bausteine (`Hen`, `Barrel`, `Crate`, `Lantern`, `Pennant`) haben noch die alten dünnen
  Striche; im Probestück sind sie nur größer gesetzt.
- Wildnis und freie Plätze im Weinberg.

## Runde 2 (Rückmeldung 2026-11-13: „Richtung stimmt, Stufen-Unterschiede zum Teil größer“)
- **Bauwerke wachsen sichtbar:** Im Weinberg skaliert jedes Gebäude von 74 % (Stufe 1) auf volle
  Größe (Stufe 5, `Grow` in `VineyardArt.tsx`). Der Hühnerstall wächst in zwei Bauformen
  (Nurdach 76 % → 100 %, Stelzenstall 82 % → 92 % → 100 %), der erste Bienenkasten ist kleiner.
- **Mehr Neues je Stufe:** Tränke am Hühnerstall (Stufe 2), Schornstein mit Rauch am
  Winzerhäuschen (Stufe 4), Stützmauern und Lüftungskamin am Weinkeller (Stufe 3/4), Rosenstock am
  Zeilenende der Reben (Stufe 4).
- **Gemeinsame Kleinteile im kräftigen Stil:** `STROKE` ist jetzt 2 · 1,2 · 0,7 (= `BOLD`); Huhn,
  Fass, Kiste, Glas, Laterne, Wimpel, Schild und Lampe haben die dunkle Kontur. Das wirkt in allen
  Kapiteln, die diese Teile benutzen.
- Leistungsgrenze 2500 (`docs/leistung.md`); Hauptgarten weiter 1496.
- Vergleichsbilder: alle 59 erneuert.

## Als Nächstes
1. Die übrigen acht Bereiche des Hauptgartens.
2. Kapitel-Baukasten (`ChapterArt.tsx`, `chapterArtSpecs.ts`) auf Kontur und Licht/Schatten
   umstellen – hebt die Kapitel 13–50 gemeinsam.
3. Handgezeichnete Kapitel 1–12 einzeln.

