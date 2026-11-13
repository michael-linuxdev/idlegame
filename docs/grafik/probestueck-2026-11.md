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
- Leistungsgrenze eingehalten: Hauptgarten 1496 von 1500 SVG-Elementen (vorher 1434). Für den
  ganzen Garten im neuen Stil muss an anderer Stelle gespart oder die Grenze neu bewertet werden.
- Vergleichsbilder erneuert: 8× Hauptgarten, Weinberg.
- **Nicht ausliefern, bevor entschieden ist:** Zwei kräftige Bereiche neben acht alten sehen im
  Garten uneinheitlich aus.

## Nicht Teil des Probestücks
- Größe der Bereiche auf der Karte, Hintergrund mit Tiefe, Oberfläche (Farben, Schilder).
- Gemeinsame Bausteine (`Hen`, `Barrel`, `Crate`, `Lantern`, `Pennant`) haben noch die alten dünnen
  Striche; im Probestück sind sie nur größer gesetzt.
- Wildnis und freie Plätze im Weinberg.
