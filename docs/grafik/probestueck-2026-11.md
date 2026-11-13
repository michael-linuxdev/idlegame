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
- Zwei kräftige Bereiche neben acht alten sahen im Garten uneinheitlich aus – seit Runde 3
  (unten) sind alle zehn umgestellt.

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

## Runde 3 (2026-11-13): die übrigen acht Bereiche des Hauptgartens
Alle zehn Bereiche sind jetzt im kräftigen Stil; der Garten ist wieder einheitlich
(`runde3-hauptgarten.png`, Übersicht `scripts/e2e/art-baseline/garden-*.png`).
- **Gemüsebeet:** Beet wächst vom Erdstreifen über den Holzrahmen zum Hochbeet mit Eckpfosten;
  Bohnenzelt als grüne Pyramide, Vogelscheuche steht hinten im Beet.
- **Kompost:** Lattenkisten mit Pfosten und Lichtseite, Schutzdach über die ganze Breite, Schubkarre
  und Eimer mit Kontur.
- **Kräuterspirale:** statt Steinkreis eine gemauerte Spirale aus ein, zwei, drei Windungen
  (Trockenmauer mit Fugen), Wasserstelle mit Steinrand, größerer Zwerg.
- **Beerenhecke:** Himbeerspalier als hohe Laubwand hinter den Büschen (im Winter kahle Ruten),
  Spalierpfosten wachsen mit, Pflückkorb und Marmeladentisch.
- **Obstwiese:** Jungbaum am Pfahl, Bäume werden je Stufe größer, Leiter, Fallobst, Kistenstapel,
  Schaukel auf Stufe 5.
- **Gewächshaus:** weißer Rahmen mit dunkler Kontur, Steinsockel, Haus wird breiter und höher;
  Frühbeetkasten mit aufgestelltem Deckel als Stufe 1.
- **Hofladen:** Theke und Markise mit Kontur, Ladenhäuschen aus `Wall`/`GableRoof`/`Pane`/`ArchDoor`,
  Schild im Giebel.
- **Orangerie:** eigene Silhouette statt „zweites Gewächshaus“ – Steinbau mit hohen Bogenfenstern
  (leuchten abends), Gesims und Glaskuppel.
- Neue Bausteine in `art/garden/shared.tsx`: `Grow` (Bauwerk wächst je Stufe), `Rod` (Stange/Draht
  mit Kontur), `Pumpkin`.
- Leistungsgrenze: Hauptgarten 1554 SVG-Elemente (Grenze 2500). Vergleichsbilder: 8× Hauptgarten.

## Runde 4 (2026-11-13): Kapitel 2 Streuobstwiese
Das erste Kapitel, das Spieler sehen, lag im alten flachen Stil zwischen Hauptgarten und Weinberg.
Jetzt kräftig (`src/theme/OrchardArt.tsx`, Vergleichsbild `kapitel-obstwiese.png`):
- **Eigene Kronenform je Obstart:** Apfel breit und rund, Birne hoch und schmal, Kirsche flacher
  Schirm, Zwetschge aufrechtes Oval, Walnuss mächtig auf dickem Stamm. Bäume wachsen von 72 % auf
  volle Größe.
- Schafe mit Wolle als eine Form, Weidezaun, Tränke (Stufe 3), Unterstand (Stufe 4).
- Wildbienenhotel, Mosterei (Scheunentor, Apfel im Giebel), Dörrhaus (schmal und hoch, Gestell mit
  Apfelringen), Obstmarkt aus den Bausteinen `Wall`/`GableRoof`/`Pane`/`ArchDoor`.
- Setzling und verwilderte Ecke haben die dunkle Kontur.

**Befund:** Der Kapitel-Baukasten (`ChapterAreaArt` in `ChapterArt.tsx`) wird im Spiel nicht mehr
benutzt – alle Kapitel 4–50 sind einzeln handgezeichnet (`art/chapters/<id>.tsx`, Striche fest
0,2–0,8). Einen gemeinsamen Hebel für Kapitel 13–50 gibt es deshalb nicht; es sind 47 Dateien mit
je zehn Motiven.

## Runde 5 (2026-11-13): Hauptgarten vollständig
Alles, was auf der Hauptgarten-Karte steht, hat jetzt die dunkle Kontur (`runde5-hauptgarten.png`:
früher Garten, voll bei Tag, Nacht und im Winter).
- **Kulisse** (`MapBackdrop.tsx`): Omas Laube in allen drei Zuständen (Licht-/Schattenseite, Fenster
  mit Rahmen und Kreuz, Schornstein mit Kappe), Regentonne, Teich mit Steinrand, Bäume, Hecke,
  Jägerzaun mit Tor, Bank, Blumeninseln, Wildbüsche, Lichterkette, Schmetterlinge und die Deko der
  Gartenstile. Die Strichstärke rechnet `ink(perU)` aus der Größe des Stücks auf der Karte, damit
  Laube und Teich so kräftig wirken wie die Bereiche (Kontur 2 im plot-Raster = 0,48 u).
- **Wildnis und geräumter Platz** (`PlotArt.tsx`): dieselbe dunkle Kontur, etwas dünner (1,6);
  Farben bleiben gedeckt, damit gebaute Bereiche daneben kräftiger wirken.
- **Kleinteile** – Deko (16), Gartenbewohner (12), Fest-Deko, Jonas und Ilse: Jede gefüllte Form
  erbt die Kontur vom `<svg>` (`inkProps` in `theme/ink.ts`, `paint-order: stroke`). Schatten,
  Lichtschein und halbtransparente Flächen tragen `stroke="none"`; bei den Bewohnern auch Augen und
  kleine Flecken.
- Leistungsgrenze: Hauptgarten 1595 SVG-Elemente (Grenze 2500). Vergleichsbilder: 8× Hauptgarten,
  Laube, Deko.
- **Nicht umgestellt:** Kiesweg und Rasen (Fläche ohne Kontur, so gewollt), Pfützen und Wetter,
  Briefumschlag an der Laube, Winterruhe-Szene der Saisonende-Zeremonie (`WinterScene.tsx`).

## Freie Plätze je Bereich (2026-11-13, Rückmeldung: „Schafe und Gebäude sollten nicht aus einem Setzling entstehen“)
Der freie, noch nicht angelegte Platz bekommt die Bereichs-ID (`ChapterArtEntry.ready` nimmt `id`).
- **Streuobstwiese:** Setzling nur für die fünf Obstbäume; Schafe = abgesteckte Weide mit Heu,
  Wildbienen = Pfahl mit vorgebohrten Klötzen, Mosterei/Dörrhaus/Obstmarkt = Bauplatz.
- **Weinberg:** Rebpfähle nur für die vier Rebsorten; Trockenmauer, Häuser und Weinfest = Bauplatz.
- Bausteine in `art/chapters/site.tsx` (`BuildSite`, `PastureSite`, `PostSite`). Kapitel 4–50
  zeigen weiter das neutrale Erdbeet mit Schild (`ChapterReady`).

## Reste und Aufräumen (2026-11-13)
- **Grafik-Reste im Hauptgarten:** Pfützen, Windhalme und Blätter (`WeatherLayer.tsx`), Briefumschlag
  an der Laube, Winterruhe-Szene im Saison-Tab (`WinterScene.tsx`) mit dunkler Kontur. Im Weinberg
  auch Wildnis und Rebpfähle. Im Bild geprüft: alle neun Feste, Regen, Wind, Jonas.
- **Kapitel-Baukasten entfernt:** `ChapterAreaArt` und die Bereichs-Angaben in
  `chapterArtSpecs.ts` (834 → 256 Zeilen) sind weg; die Datei enthält nur noch die Kulissen.
- **Store-Material erneuert:** 6 Screenshots je Sprache und beide Feature-Grafiken
  (`scripts/store/`). Das App-Icon (`docs/store/app-icon-1024.png`, `public/pwa-*.png`,
  `apple-touch-icon.png`) ist ebenfalls neu gerendert (`scripts/generate-pwa-icons.py`).

## Überlagerungen auf der Karte (2026-11-14, Screenshot eines Testers)
- **Schild-Zone:** Die acht neuen Bereiche hatten Vordergrund-Teile (Schubkarre, Kisten, Töpfe,
  Tafel, unterste Mauer der Kräuterspirale) unterhalb von `SIGN_ZONE_Y` = 72 gezeichnet – sie
  lagen auf oder hinter dem Schild. Alles endet jetzt bei y ≤ 78 (nachgemessen im Grafikbogen,
  alle Stufen und Jahreszeiten).
- **Ein Platz, ein Stück:** Blumeninseln, Wildbüsche, Fest-Deko und Gartenstil-Deko teilten sich
  dieselben Randplätze (gemessen: 27 Überlagerungen über 9 Feste × 8 Gartenstile). Die Fest-Deko
  ist jetzt Daten (`theme/festItems.tsx`, Zeichnungen in `festArt.tsx`); `MapBackdrop` zeigt je
  Platz nur ein Stück, Rangfolge Gartenstil > Fest > Blumen > Wildnis. Zwei Laternen und der
  Adventskranz standen in Bereichen und sind versetzt. Nachgemessen: 0 Überlagerungen.
  Test `src/test/mapSpots.test.ts`.
- **Pfützen:** in der Bodenebene und auf freien Stellen (siehe oben).

## Probestück Horizont (2026-11-14) – **nur auf dem Branch, noch nicht entschieden**
Anlass: Vergleich mit Lichtwarte (Tiefe durch Horizont, Wahrzeichen am Fluchtpunkt, Weg mit
Perspektive). Bilder vorher/nachher: `probe-horizont-tag.png`, `-nacht.png`, `-frueh.png`.
- Kulisse über dem Garten (`MapBackdrop.tsx`, `HORIZON` = 20 %): Himmel, zwei Hügelketten, die
  Hecke als hintere Gartengrenze am Horizont statt am oberen Bildrand.
- Hauptweg als Fläche, die zur Laube hin schmaler wird (`taperedPath`); Stichwege hinten dünner.
- Laube größer (22 → 26 u) als Fluchtpunkt; Bäume hinten kleiner, vorn größer; Mähstreifen laufen
  auf den Fluchtpunkt zu; zwei sanfte Bodenwellen.
- Offen: Nachthimmel (Mond, Sterne), Jahreszeiten der Hügel, Lichthof für ausgebaute Bereiche,
  kleinere gesperrte Plätze. Plätze der Bereiche, Deko und Pfützen sind unverändert.

## Als Nächstes
1. Gemeinsame Kapitel-Teile (`HandParts.tsx`, `art/chapters/partsA…I.tsx`: Dach, Figur, Glashaus,
   Fels, Nadelbaum …) auf Kontur umstellen – der größte verbleibende Hebel, wirkt in vielen Kapiteln.
2. Kapitel 4–12 einzeln, in Spielreihenfolge (Bauernhof zuerst); Kapitel 13–50 danach.
