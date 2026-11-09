# Kapitel 13–50 „Omas Saatgutdose“ — Plan

Auftrag: `docs/prompts/kapitel-13-50.md`. Dieses Dokument ist der Fahrplan über
mehrere Sitzungen. **Jede Sitzung liest zuerst „Fortschritt“ (ganz unten) und
macht beim nächsten offenen Paket weiter.**

## Erzählbogen

Kapitel 12 (Gartenschau) ist das Finale der ersten Geschichte: Omas
Gedenkgarten. Ein neuer Bogen braucht deshalb einen neuen Antrieb — keinen
„noch ein Garten“-Katalog.

**Der Fund.** Beim Abbau der Gartenschau findet die Familie unter dem Beet für
Oma eine alte Blechdose: **Omas Saatgutdose**. Darin liegen Samentütchen,
jedes mit einem Namen und einer Adresse beschriftet, und ein Bündel Briefe.
Oma hat ihr Leben lang Saatgut getauscht, erst mit Leuten aus der Gegend,
dann per Post quer durch Europa und am Ende mit Gärtnerinnen und Gärtnern auf
der ganzen Welt. Jedes Tütchen ist eine Spur. Die Familie folgt ihnen.

Das trägt vier Abschnitte und ein Finale, das den Kreis schließt:

| Bogen | Kapitel | Titel | Idee |
|---|---|---|---|
| I | 13–19 | **Nach der Schau** | Die Tütchen mit Adressen aus der Heimat. Bekannte Gesichter kommen zurück (Jonas als Erwachsener, Ilse, Onkel Fritz’ Enkelin). Gärten, die man aus Deutschland kennt. |
| II | 20–29 | **Omas Saatgutbriefe** | Briefwechsel quer durch Europa. Jedes Kapitel ist ein Garten, mit dem Oma jahrzehntelang Samen getauscht hat. |
| III | 30–39 | **Wo die Samen herkommen** | Die Familie besucht Gärtnerinnen und Gärtner in aller Welt, bei denen wächst, was in Omas Garten steht: Kartoffel, Mais und Bohnen, Kaffee, Reis, Pfeffer, Datteln, Kakao, Kohl. |
| IV | 40–49 | **Saatgut für morgen** | Die nächste Generation übernimmt. Gärten der Zukunft: Dach, Fassade, Schule, Waldgarten, Samenbank, Klimagarten. Die Notizen stammen hier nicht mehr von Oma, sondern von Mila (Jonas’ Tochter). |
| — | 50 | **Zurück zum Anfang** | Omas Schrebergarten. Das letzte Tütchen in der Dose trägt keine Adresse, sondern deinen Namen. |

**Abweichungen vom Vorschlag im Prompt (begründet):**
- *Wintergarten, Rosengarten* gestrichen: Palmenhaus/Glaskuppel (Kap. 8) und Rosarium/Rosenbogen (Kap. 8, 12) gibt es schon.
- *Olivenhain Toskana, Zitrusgarten Sizilien* gestrichen: Oliven und Feigen hat Kapitel 10, Zitronen die Orangerie. Stattdessen Sant’Erasmo (Artischocken), Ägina (Pistazien), Kazanlak (Rosenöl).
- *Teeplantage, Bambushain, Kakteengarten* gestrichen: Tee und Bambus hat Kapitel 11, Kakteen Kapitel 8. Stattdessen Kakao (Ghana), Kimchi-Garten (Korea), Oase (Marokko).
- *Schwarzwälder Kirschgarten* gestrichen (Streuobst/Kirschen in Kapitel 2). Stattdessen Spreewald.
- *Forschungsgewächshaus* und *vertikaler Garten* zusammengelegt zu „Fassadengarten“; dafür neu „Solawi-Hof“ und „Großer Saatguttausch“ (schließt an die Saatgutbriefe an).
- Bogen III ist bewusst **kein Reise-Katalog**: Jedes Kapitel ist ein persönlicher Brief über eine Pflanze aus Omas Garten. Herkunft nur als sicherer Allgemeinplatz („kommt ursprünglich aus Südamerika“).

**Leitlinien für Inhalt und Ton**
- Keine Klischees, keine Karikaturen von Menschen. Figuren sind Fachleute in ihrem eigenen Garten: Bäuerinnen, Försterinnen, Lehrerinnen, Gärtner.
- **Nichts, was Gegenlesen braucht** (Nutzerentscheid, Liste der Ersetzungen: `docs/kapitel/entschaerft.md`). Für die Kapitel 13–50 gilt:
  - keine fremdsprachigen Wörter oder Grüße — außer Personennamen und allgemein bekannten Länder-/Ortsnamen (Bali, Kerala, Ghana, Anden, Spreewald …); was ins Deutsche eingegangen ist (Kimchi, Paprika, Quinoa, Chili, Sauna) darf bleiben;
  - keine Bräuche, Rituale oder Wissen anderer Völker und Kulturen, keine ethnischen Zuschreibungen;
  - keine prüfbaren Zahlen, Jahreszahlen, historischen oder statistischen Behauptungen; gärtnerische Allgemeinplätze, die sicher stimmen, dürfen bleiben;
  - nichts Unsicheres über Tiere oder Pflanzen an bestimmten Orten.
- Echte Pflanzen, einfache Gartenarbeit: Terrassen, Mischkultur, Wasser teilen, Einlegen, Trocknen.
- Briefe 4–6 Absätze, eigene Stimme, persönlich und warm: die Gärtnerin oder der Gärtner, die Pflanze, die Arbeit, Wetter, Familie, das Tütchen aus Omas Dose. Anrede auf Deutsch bzw. Englisch („Liebe Familie“, „Hallo, ihr Lieben“).
- Gleichmäßige Qualität: Lieber ein Bereich einfacher als ein Kapitel aufgebläht.

## Kapitel

Spalten: **ID** (stabil, Teil des Speicherformats) · Titel de / en · Währung de / en · Absender · Weg (`ZIGZAG`, `RING`, `TERRACES`, `ROWS`, `SPIRAL`). Darunter: 10 Bereiche (de), Landschaft, Tierleben/Bewegung, Jahreszeit.

Bereichs-**IDs** sind über alle Kapitel und den Garten eindeutig (Pflege-Namen hängen daran); sie wurden je Welle festgelegt (Tabellen „Welle N — Bereichs-IDs“ unten) und gehören zum Speicherformat.

### Bogen I — Nach der Schau (13–19)

**13 · `stadtgarten`** · Gemeinschaftsgarten in der Stadt / The City Community Garden · Tomaten / Tomatoes · **Jonas** (erwachsen, Stadtplaner) · RING
- Bereiche: Hochbeete, Palettenbeete, Regenspeicher, Wurmkiste, Kräuterleiter, Saatgut-Bibliothek, Lastenrad, Lehmofen, Werkstatt-Container, Hoffest
- Landschaft: Hinterhof zwischen Altbauten, Brandmauer mit Wandbild, Lichterketten
- Tiere: Spatzen hüpfen, Mauersegler kreisen, nachts ein Stadtfuchs
- Jahreszeit: Winter — Lichterkette und Glühwein-Topf am Container; Frühling — Setzlinge auf Fensterbänken

**14 · `klostergarten`** · Klostergarten / The Monastery Garden · Quitten / Quinces · **Schwester Benedikta** (Gärtnerin im Kloster) · TERRACES
- Bereiche: Kreuzgang-Garten, Quittenhain, Heilpflanzenbeet, Brunnenhaus, Bienenmauer, Gemüsegarten der Schwestern, Kräuterboden, Klosterküche, Saatgutregister, Glockenhof
- Landschaft: Klostermauer, Kirchturm, Hügel mit Wald
- Tiere: Tauben am Turm, Rotschwanz auf der Mauer, Glocke schwingt
- Jahreszeit: Herbst — Quitten leuchten gelb; Winter — Kerzen in den Fenstern

**15 · `schlossgarten`** · Schlossgarten / The Palace Garden · Spargel / Asparagus · **Obergärtner Paul Weidner** · RING (Achse)
- Bereiche: Broderie-Parterre, Spargelbeete, Lindenallee am Kanal, Heckentheater, Küchengarten in der Mauer, Kübelpflanzen-Halle, Wasserachse, Pavillon im Bosquet, Schlossgärtnerei, Sommerkonzert
- Landschaft: Schlossfassade im Hintergrund, Kanal, Buchskanten
- Tiere: Schwäne auf dem Kanal, Eichhörnchen auf der Allee, Fontäne
- Jahreszeit: Frühling — Spargelzeit; Winter — Kübelpflanzen eingeräumt, Buchs mit Schneehaube

**16 · `baumschule`** · Baumschule / The Tree Nursery · Setzlinge / Saplings · **Lena** (Onkel Fritz’ Enkelin) · ROWS
- Bereiche: Saatbeete, Veredelungsplatz, Obstgehölze, Alleebäume, Heckenpflanzen, Containerplatz, Gießanlage, Packschuppen, Hofverkauf, Pflanztag
- Landschaft: lange Reihen junger Bäume, Gewächstunnel, Feldrand
- Tiere: Feldhase zwischen den Reihen, Turmfalke rüttelt, Regner dreht sich
- Jahreszeit: Herbst — Laub in allen Farben; Winter — Wurzelballen in Jute

**17 · `moorgarten`** · Moor- und Heidegarten / The Moorland Garden · Moosbeeren / Cranberries · **Greta Hansen** (Naturschutzwartin, Ilses Nichte) · SPIRAL (Bohlenweg)
- Bereiche: Torfmoos-Bucht, Moosbeerenteppich, Wollgraswiese, Sonnentau-Ecke, Birkenhain, Bohlenweg, Beobachtungsturm, Moorhütte, Schafstall, Moorfest
- Landschaft: Bohlenweg über dunkles Wasser, Birken, weiter Himmel
- Tiere: Kraniche ziehen, Libellen, Moorschnucken grasen
- Jahreszeit: Frühling — Wollgras weiß; Herbst — Heide lila, Kranichzug

**18 · `deichgarten`** · Deichgarten an der Nordsee / The Dike Garden · Sanddorn / Sea Buckthorn · **Frauke Petersen** (Deichschäferin) · ZIGZAG
- Bereiche: Sanddornhecke, Salzwiese, Kartoffelacker im Koog, Windschutzhecke, Strandrosen, Krabbenkutter-Steg, Reetdachkate, Teestube, Leuchtturm-Garten, Winterfeuer
- Landschaft: Deich, Watt, Leuchtturm, Wolkenhimmel
- Tiere: Schafe auf dem Deich, Austernfischer, Windmühle dreht
- Jahreszeit: Winter — Winterfeuer am Ende des Winters; Herbst — Sanddorn orange

**19 · `spreewald`** · Spreewald / The Spreewald · Gurken / Gherkins · **Mirko Nowak** (Kahnfährmann) · ZIGZAG (Fließe)
- Bereiche: Gurkenfeld, Meerrettichbeet, Leinölmühle, Kahnanleger, Bauerngarten am Fließ, Einlegeküche, Holzschuppen, Heimatstube, Erlenwald, Gurkenfest
- Landschaft: Fließe mit Kähnen, Erlen, Blockhäuser
- Tiere: Kahn gleitet, Eisvogel, Störche auf dem Dach
- Jahreszeit: Winter — Eis auf den Fließen; Ostern — bemalte Ostereier

### Bogen II — Omas Saatgutbriefe (20–29)

**20 · `cottagegarten`** · Cottage-Garten in England / The English Cottage Garden · Duftwicken / Sweet Peas · **Margaret Pryce** · ZIGZAG
- Stockrosenbeet, Wickenzaun, Gemüse-Allotment, Trockenmauer, Apfelspalier, Gewächshaus aus Holz, Teeplatz unter der Eiche, Geißblattlaube, Schuppen, Dorfgartenschau
- Landschaft: Honigfarbene Steinhäuser, Hügel mit Schafen · Tiere: Rotkehlchen, Schafe, Dampflok in der Ferne · Jahreszeit: Sommer — Gartenschau im Dorf

**21 · `tulpenfelder`** · Tulpenfelder in Holland / The Dutch Bulb Fields · Blumenzwiebeln / Bulbs · **Joost de Vries** · ROWS
- Tulpenreihen, Hyazinthenfeld, Narzissenwiese, Zwiebelscheune, Windmühle, Gracht mit Brücke, Fahrradstall, Versteigerungshalle, Hausboot-Garten, Tulpenmarkt
- Tiere: Möwen, Windmühlenflügel, Enten in der Gracht · Jahreszeit: Frühling — Felder in Streifen; Herbst — Zwiebeln stecken

**22 · `artischocken`** · Artischockeninsel bei Venedig / The Artichoke Island · Artischocken / Artichokes · **Giulia Zanon** · ZIGZAG (Kanäle)
- Artischockenfeld, Lagunenwiese, Bootsanleger, Kanalgarten, Granatapfelhecke, Salzgarten, Bootsschuppen, Gemüsekahn, Glockenturm-Blick, Inselfest
- Tiere: Reiher, flaches Boot gleitet, Möwen · Jahreszeit: Frühling — die erste Artischocke

**23 · `beerenwald`** · Beerenwald in Schweden / The Swedish Berry Woods · Blaubeeren / Blueberries · **Ingrid Lund** · SPIRAL
- Heidelbeerhang, Preiselbeermoos, Moltebeerenmoor, Rote Hütte, Saftküche, Pilzlichtung, Holzstapel, Sauna am See, Sommerwiese, Waldpfad für alle
- Tiere: Elch am Waldrand, Eichhörnchen, Polarlicht (Winter) · Jahreszeit: Sommer — Blumenkränze in der hellsten Nacht; Winter — Polarlicht

**24 · `patio`** · Andalusischer Patio / The Andalusian Patio · Orangen / Seville Oranges · **Inés Morales** · RING (Innenhof)
- Orangenhof, Kachelbrunnen, Geranienwand, Bewässerungsrinne, Jasminbogen, Granatapfelbaum, Kühle Galerie, Marmeladenküche, Gitterfenster, Patio-Fest
- Tiere: Schwalben, Wasserstrahl, Katze im Schatten · Jahreszeit: Frühling — Orangenblüte

**25 · `korkeichen`** · Korkeichenhain in Portugal / The Cork Oak Grove · Kork / Cork · **João Ferreira** · ZIGZAG
- Korkeichen, Schälplatz, Eichelweide, Störche auf dem Mast, Brunnen, Korkstapel, Lehmhaus, Honighaus, Korkwerkstatt, Erntefest
- Tiere: Störche, Eichelhäher, Schafe · Jahreszeit: Sommer — Schälzeit

**26 · `paprikafelder`** · Paprikafelder in Ungarn / The Hungarian Paprika Fields · Paprika / Paprika · **Erzsébet Kovács** · ROWS
- Paprikareihen, Trockenschnüre an der Hauswand, Paprikamühle, Bemalte Bauernstube, Brunnenschwengel, Tomatenfeld, Akazienwäldchen, Strohdachscheune, Markt, Paprikafest
- Tiere: Störche, Pferd am Brunnen, Lerche · Jahreszeit: Herbst — rote Schnüre an jeder Wand

**27 · `aranfelder`** · Steinfelder der Aran-Inseln / The Aran Island Fields · Wolle / Wool · **Siobhán Ní Fhlatharta** · TERRACES (Mauerfelder)
- Trockenmauern, Tang-Beete, Kartoffelfurchen, Felsblumen, Schafweide, Strickstube, Cottage mit Reetdach, Klippenpfad, Hafenmauer, Musikabend
- Tiere: Schafe, Papageitaucher, Brandung · Jahreszeit: Frühling — Blumen in den Felsspalten

**28 · `rosental`** · Rosental in Bulgarien / The Bulgarian Rose Valley · Rosenöl / Rose Oil · **Petar Ivanov** · ROWS
- Rosenreihen (Ölrosen), Pflückkörbe, Destillierkessel, Walnussallee, Imkerwagen, Rosenwasser-Küche, Bergquelle, Holzveranda, Trocknungsboden, Rosenfest
- Tiere: Bienen, Schwalben, Esel mit Körben · Jahreszeit: Frühsommer — Pflücken im Morgengrauen

**29 · `pistazien`** · Pistazienhain auf Ägina / The Pistachio Groves of Aegina · Pistazien / Pistachios · **Eleni Papadaki** · TERRACES
- Pistazienbäume, Trockenmauer-Terrassen, Kapellchen, Mandelbäume, Kapernhang, Röstplatz, Weißes Haus mit blauer Tür, Zisterne, Hafenmarkt, Pistazienfest
- Tiere: Zikaden (Flimmern), Ziegen, Fischerboot · Jahreszeit: Spätsommer — rote Fruchtbüschel

### Bogen III — Wo die Samen herkommen (30–39)

**30 · `andenkartoffeln`** · Kartoffelterrassen in den Anden / The Andean Potato Terraces · Kartoffeln / Potatoes · **Rosa Quispe** (Agronomin) · TERRACES
- Bergterrassen, Sortenbeet, Quinoafeld, Trockenplatz, Lehmspeicher, Alpakaweide, Wasserkanal, Webstube, Kartoffelpark, Kartoffelfest
- Tiere: Alpakas, Kondor kreist, Kolibri · Jahreszeit: Trockenzeit — kleine Kartoffeln trocknen

**31 · `milpa`** · Maisfelder in Mexiko / The Mexican Corn Fields · Mais / Corn · **Teodoro Hernández** · RING
- Maisfeld (Mais, Bohnen, Kürbis), Chili-Garten, Amaranth, Maisküche, Maisspeicher, Agavenzaun, Bienenstand, Saatgut-Krüge, Markttag, Erntefeier
- Tiere: Kolibri, Truthahn, Schmetterlinge (Herbst) · Jahreszeit: Herbst — Schmetterlinge über den Feldern

**32 · `kaffeewald`** · Kaffeewald in Äthiopien / The Ethiopian Coffee Forest · Kaffee / Coffee · **Almaz Tesfaye** · ZIGZAG
- Waldkaffee unter Schattenbäumen, Pflückplatz, Trockenbetten, Scheinbananen, Honigbäume, Bach mit Waschplatz, Rundhütte, Röstpfanne, Kaffeetisch, Kaffeemarkt
- Tiere: Turako, Bienen, Rauch der Röstpfanne · Jahreszeit: Regenzeit — Kaffeeblüte weiß

**33 · `reisterrassen`** · Reisterrassen auf Bali / The Balinese Rice Terraces · Reis / Rice · **Made Wirawan** (verteilt das Wasser) · TERRACES
- Reisfelder, Wasserteiler, Quellhaus, Kokospalmen, Entenweide, Reisspeicher, Gemüse am Hang, Bambusbrücke, Flechtwerkstatt, Erntetag
- Tiere: Enten im Gänsemarsch, Reiher, Wasser fließt · Jahreszeit: Wechsel grün → gold → Wasserspiegel

**34 · `gewuerzgarten`** · Gewürzgarten in Kerala / The Kerala Spice Garden · Pfeffer / Pepper · **Anjali Menon** · ZIGZAG
- Pfefferranken am Baum, Kardamom im Schatten, Zimtbäume, Ingwerbeet, Kurkuma, Muskatbaum, Trockenmatten, Bootssteg, Gewürzlager, Blumenteppich
- Tiere: Hornvogel, Schmetterlinge, Monsunregen · Jahreszeit: Monsun — Regenvorhang

**35 · `oase`** · Dattel-Oase in Marokko / The Date Palm Oasis · Datteln / Dates · **Youssef Amrani** · RING
- Dattelpalmen, Stockwerkgarten (Palme–Obst–Gemüse), Wassertunnel, Lehmburg, Granatäpfel, Minzbeet, Brunnenhof, Teppichwebstube, Dattelernte, Sternenabend
- Tiere: Kamel am Rand, Wiedehopf, Wasser im Kanal · Jahreszeit: Herbst — Dattelernte

**36 · `kakaogarten`** · Kakaogarten in Ghana / The Ghana Cocoa Farm · Kakao / Cocoa · **Ama Owusu** · ZIGZAG
- Kakaobäume, Bananen-Schattenreihe, Gärhaufen, Trockengestelle, Kochbananen, Yamsfeld, Dorfplatz, Genossenschafts-Haus, Schokoladenwerkstatt, Erntefest
- Tiere: Nashornvogel, Schmetterlinge, Hühner · Jahreszeit: Hauptsaison — Schoten gelb und rot

**37 · `buschgarten`** · Buschgarten in Australien / The Australian Bush Garden · Akaziensamen / Acacia Seeds · **Kirra Walker** (Gärtnerin, hat alles von ihrer Großmutter und ihren Tanten gelernt) · SPIRAL
- Akazienhain, Fingerlimetten, Zitronenmyrte, Salzbusch, Wasserloch, Eukalyptushain, Mahlstein-Platz, Saatgut-Hütte, Regenwassertank, Abend am Feuer
- Tiere: Kängurus (ruhig grasend), Kakadus, Eidechse auf dem Stein · Jahreszeit: Frühling (September) — gelbe Akazienblüte

**38 · `farngarten`** · Farnwald in Neuseeland / The New Zealand Fern Forest · Farnwedel / Fern Fronds · **Aroha Ngata** (Rangerin) · SPIRAL
- Baumfarne, Pfad der Riesen, Flachsbeet, Hängebrücke, Glühwürmchengrotte, Süßkartoffeln, Wasserfall, Pflanzschule, Hütte am Hang, Winternacht
- Tiere: Vogel singt, Fächerschwanz, Glühwürmchen · Jahreszeit: Winter — klare Sternennächte

**39 · `kimchigarten`** · Kimchi-Garten in Korea / The Korean Kimchi Garden · Chinakohl / Napa Cabbage · **Kim Soo-ah** · ROWS
- Kohlreihen, Rettichbeet, Chili-Matten, Tontöpfe, Sesamfeld, Blattkräuter, Alter Hof, Einlegeplatz (gemeinsames Einlegen), Kakibaum, Herbstfest
- Tiere: Elstern, Kakis wiegen, Rauch aus dem Schornstein · Jahreszeit: Spätherbst — Einlegetag

### Bogen IV — Saatgut für morgen (40–49)

Die Bereichs-Notizen stammen ab hier von **Mila** (Jonas’ Tochter), nicht mehr von Oma.

**40 · `dachgarten`** · Dachgarten / The Rooftop Garden · Salat / Lettuce · **Mila** · RING
- Dachbeete, Wildbienen-Dach, Gewächshaus-Kuppel, Regenwassertank, Solarpergola, Kräuterbalkon, Aufzug-Lieferung, Dachcafé, Saatgutschrank, Sonnenuntergangs-Fest
- Tiere: Mauersegler, Wolken ziehen, Kräne drehen · Jahreszeit: Winter — Wintersalat unter Glas

**41 · `schulgarten`** · Schulgarten / The School Garden · Radieschen / Radishes · **Frau Yilmaz** (Lehrerin, Hofladen-Kundin aus Kapitel 1) · ZIGZAG
- Klassenbeete, Schulkompost, Insektenhotel, Weidentipi, Barfußpfad, Kräuterschnecke, Schulküche, Gartenhütte, Pausenhof-Hochbeet, Erntefest der Schule
- Tiere: Schmetterlinge, Amsel, Schaukel schwingt · Jahreszeit: Sommerferien — Gießplan

**42 · `waldgarten`** · Waldgarten / The Forest Garden · Haselnüsse / Hazelnuts · **Lena** (Baumschule, Kap. 16) · SPIRAL
- Kronenschicht, Haselhecke, Beerenstrauch-Schicht, Kräuterschicht, Bodendecker, Kletterpflanzen, Pilzstämme, Teich mit Weiden, Lehrpfad, Waldgarten-Fest
- Tiere: Eichelhäher, Igel, Laub fällt · Jahreszeit: Herbst — Nüsse

**43 · `samenbank`** · Samenbank / The Seed Bank · Saatgutproben / Seed Samples · **Dr. Amara Okafor** · RING
- Vermehrungsbeete, Reinigungsraum, Keimtest-Labor, Kühltresor, Sortengarten, Archiv, Bestäubungszelte, Versandstelle, Besucherpfad, Tag der offenen Tür
- Tiere: Hummeln in den Zelten, Glastüren, Lichter im Tresor · Jahreszeit: Winter — Frost auf dem Tresor

**44 · `klimagarten`** · Klimagarten / The Climate Garden · Regenwasser / Rainwater · **Jonas** · ZIGZAG
- Trockenbeet, Schwammfläche, Mulchwege, Hitzeschattenbaum, Zisternenspiel, Mischkultur-Beete, Windschutz, Wetterstation, Lehrküche, Klimatag
- Tiere: Regen sammelt sich, Grashüpfer, Wolken · Jahreszeit: Sommer — Hitze, Schatten wandert

**45 · `wildblumenband`** · Wildblumenband / The Wildflower Corridor · Hummeln / Bumblebees · **Greta Hansen** (Kap. 17) · SPIRAL
- Blühstreifen, Totholzhaufen, Sandarium, Feldrain, Hecke, Kleingewässer, Steinriegel, Saatgut-Ernte, Brücke über die Straße, Bestäuberfest
- Tiere: Hummeln, Rebhuhn, Schmetterlinge · Jahreszeit: Sommer — Mohn und Kornblumen

**46 · `fassadengarten`** · Fassadengarten / The Living Wall · Ranken / Vines · **Mila** · TERRACES (Etagen)
- Moosfassade, Kletterhortensie, Hopfenranken, Tröpfchenbewässerung, Balkonbeete, Vogelnistwand, Sensorgarten, Fensterbank-Gärtnerei, Hof-Café, Lichterfassade
- Tiere: Haussperlinge, Blätter wehen, Wassertropfen · Jahreszeit: Herbst — Wilder Wein rot

**47 · `solawihof`** · Solawi-Hof / The Community Farm · Ernteanteile / Harvest Shares · **Till** (Onkel Fritz’ Enkel, Lenas Bruder; nicht „Paul“, den Namen trägt schon Obergärtner Paul Weidner) · ROWS
- Gemüseschläge, Folientunnel, Abholraum, Kartoffelkeller, Hühnermobil, Saatgutvermehrung, Mitgliederversammlung, Werkzeugscheune, Kinderacker, Hoffest
- Tiere: Hühnermobil-Hühner, Traktor, Möwen hinter dem Pflug · Jahreszeit: Frühling — Pflanztag mit allen

**48 · `saatguttausch`** · Großer Saatguttausch / The Great Seed Swap · Tauschbriefe / Swap Letters · **alle Absender der Kapitel 13–39** (Sammelbrief) · RING
- Tauschtische, Sortenausstellung, Erzählzelt, Briefstation, Kinder-Saatgutwerkstatt, Pflanzenflohmarkt, Küche der Welt, Musikbühne, Saatgut-Archivwagen, Abschlussrunde
- Tiere: Wimpel wehen, Tauben, Laternen · Jahreszeit: Frühling

**49 · `weltgartenschau`** · Weltgartenschau / The World Garden Expo · Gäste / Guests · **Dr. Elisabeth Grün** (Kap. 8, jetzt Leiterin) · RING
- Länderbeete aus Bogen II, Länderbeete aus Bogen III, Zukunftshalle, Seilbahn, Wasserlichtspiele, Saatguttempel, Kinderwald, Pavillon der Familie, Aussichtsplattform, Eröffnungsfeier
- Tiere: Ballons, Fontänen, Seilbahngondeln · Jahreszeit: Sommer

### Finale

**50 · `omasgarten`** · Omas Schrebergarten / Grandma’s Allotment · Erinnerungen / Memories · **Oma** (letzter Brief aus der Dose) · ZIGZAG wie Kapitel 1
- Bereiche spiegeln Kapitel 1: Erstes Beet, Komposthaufen, Kräuterspirale, Beerenhecke, Apfelbaum von Opa, Bienenkiste, Hühnerstall, Altes Gewächshaus, Laube, Omas Bank
- Landschaft: Omas Garten, wie er am Anfang war, wächst mit jeder Stufe in den Garten von heute
- Tiere: Igel, Rotkehlchen, Glühwürmchen
- Abschluss-Szene (nur Darstellung): Die Familie aller Generationen auf der Bank, die Dose leer, ein Tütchen mit deinem Namen. Danach geht das Spiel normal weiter.

## Taktung

Ziele (vom Nutzer bestätigt, Simulator legt die Regel fest — Paket 1):

| Profil | Kapitel 13 | Abstand danach | Bis Jahr 2 | Kapitel 50 |
|---|---|---|---|---|
| Regular | Monat 9–12 | alle 4–6 Wochen | — | nach ~4–5 Jahren |
| Dauerspieler | nicht schneller als Regular − ~3 Monate | höchstens ~1 Kapitel in 2 Wochen | — | — |
| Casual | — | — | mindestens Kapitel 20 | — |

Keine reine Wartezeit ohne Handlung. Bausteine: Fortschritt im vorigen Kapitel,
flachere Generationen-Abstände, Kapitel-Währung.

### Regel (Paket 1, `src/game/chapters.ts`)

- **Ruhezeit:** nach jedem Tiefen Winter 3 Tage (`DEEP_REST_MS`). Gibt einen
  verlässlichen Takt, egal wie stark der Garten ist.
- **Kapitel-Boni** auf die Garten-Ernte werden **addiert** (vorher multipliziert → ×10¹²).
- **Kapitel 13+:** Generations-Fortschritt ≥ 11 + ½ · (N − 13), wobei
  Fortschritt = Generation + Anteil der Tiefen Winter bis zur nächsten;
  dazu das vorige Kapitel vollständig angelegt. Garten-Bonus ab 13: 0,15 %
  je Stufe (flach). Kosten/Erträge ×1,5 je Kapitel.

### Messung (Simulator, 5 Jahre, `GEN=1 SIM_ALL_CHAPTERS=1`, nur Ilse baut Kapitel)

| Profil | K12 | K13 | K20 | K30 | K40 | K50 | Abstand ab 13 | Garten-Bonus (5 J.) |
|---|---|---|---|---|---|---|---|---|
| Regular | Tag 268 | Tag 313 (Monat 10) | Tag 501 | Tag 841 | Tag 1270 | **Tag 1784** (4,9 J.) | 24–56 Tage | ×300 |
| Casual | Tag 320 | Tag 372 | **Tag 588** | Tag 976 | Tag 1468 | (K46 nach 5 J.) | 28–60 Tage | ×282 |
| Dauerspieler | — | — | — | — | — | — | **≥ 21 Tage** (rechnerisch) | — |

Dauerspieler: Ab Kapitel 13 braucht jedes Kapitel mindestens ½ · (3 + 11) = 7
Tiefe Winter à 3 Tage Ruhezeit → nie schneller als ~3 Wochen je Kapitel (Ziel:
höchstens 1 in 2 Wochen ✓). Der Lauf über 5 Jahre (>1 h Rechenzeit) war dafür
nicht nötig.

**Spielstand-Größe:** 50 voll ausgebaute Kapitel (alle Bereiche, volle Pflege) ≈ 37 KB gesamt (Ziel < 100 KB, `src/test/saveSize.test.ts`) — kein kompaktes Speichern nötig.

Alle Ziele erfüllt: Regular K13 im Monat 9–12 ✓, alle 4–6 Wochen ✓, K50 nach
~4–5 Jahren ✓; Casual ≥ K20 in 2 Jahren ✓.

### Messung mit den echten Kapiteln 13–50 (Runde 3, ohne `SIM_ALL_CHAPTERS`)

Echte Bereichsdaten, 4 neue Großprojekte gebaut (`PROJECTS`), Werbefrei als
`ADS=all`. Details: `docs/kapitel/balance-bericht.md` „Runde 3“.

| Profil | K13 | K20 | K30 | K40 | K50 | Abstand ab 13 | Tag 730 |
|---|---|---|---|---|---|---|---|
| Regular | Tag 308 (Monat 10) | Tag 498 | Tag 837 | Tag 1266 | **Tag 1778** (4,9 J.) | 24–56 Tage, Ø 40 | K27 |
| Casual | Tag 369 | **Tag 585** | Tag 973 | Tag 1465 | (K46 nach 5 J.) | 28–60 Tage | **K24** |
| Dauerspieler (1 J.) | Tag 292 | — | — | — | — | **21–24 Tage** | — |
| mit Werbefrei | 3–8 Tage früher, Abstände gleich | | | | | | |

Alle Ziele weiter erfüllt, **keine Werte geändert**. Werbefrei beschleunigt
den Hauptgarten (Dauerspieler ×3–4 Ernte), aber nicht die Kapitel ab 13: die
3 Tage Ruhezeit nach jedem Tiefen Winter takten den Generations-Fortschritt.

## Wellen

| Welle | Kapitel | Inhalt |
|---|---|---|
| 1 | 13–17 | Stadtgarten, Klostergarten, Schlossgarten, Baumschule, Moorgarten |
| 2 | 18–23 | Deichgarten, Spreewald, Cottage, Tulpen, Artischocken, Beerenwald |
| 3 | 24–29 | Patio, Korkeichen, Paprika, Aran, Rosental, Pistazien |
| 4 | 30–34 | Anden, Milpa, Kaffeewald, Reisterrassen, Gewürzgarten |
| 5 | 35–39 | Oase, Kakao, Buschgarten, Farnwald, Kimchi-Garten |
| 6 | 40–44 | Dach, Schule, Waldgarten, Samenbank, Klimagarten |
| 7 | 45–49 | Wildblumenband, Fassade, Solawi, Saatguttausch, Weltgartenschau |
| 8 | 50 + Abschluss | Omas Schrebergarten, Abschluss-Szene, ROADMAP, Store-Texte, Bericht |

Jede Welle war für sich spielbar: Hinter dem letzten gebauten Kapitel zeigten
„Sammlung & Ziele“ und die Grundstücke-Auswahl „Weitere Gärten folgen“. Seit
Welle 8 sind alle 50 Kapitel gebaut; dort stehen jetzt Abschluss-Sätze.

## Welle 1 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 13 stadtgarten | hochbeete, palettenbeete, regenspeicher, wurmkiste, kraeuterleiter, saatgutbibliothek, lastenrad, lehmofen, werkstatt, hoffest |
| 14 klostergarten | kreuzgang, quittenhain, heilpflanzen, brunnenhaus, bienenmauer, schwesterngarten, kraeuterboden, klosterkueche, saatgutregister, glockenhof |
| 15 schlossgarten | parterre, spargelbeete, kanalallee, heckentheater, mauergarten, kuebelhalle, wasserachse, bosquet, schlossgaertnerei, sommerkonzert |
| 16 baumschule | saatbeete, veredelung, obstgehoelze, alleebaeume, heckenpflanzen, containerplatz, giessanlage, packschuppen, hofverkauf, pflanztag |
| 17 moorgarten | torfmoos, moosbeeren, wollgras, sonnentau, birkenhain, bohlenweg, beobachtungsturm, moorhuette, schnuckenstall, moorfest |

## Welle 2 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 18 deichgarten | sanddorn, salzwiese, koogacker, windschutz, strandrosen, kuttersteg, reetkate, friesenstube, leuchtturm, biike |
| 19 spreewald | gurkenfeld, meerrettich, leinoelmuehle, kahnanleger, fliessgarten, einlegekueche, holzschuppen, trachtenhaus, erlenwald, gurkenfest |
| 20 cottagegarten | stockrosen, wickenzaun, gemueseparzelle, steinmauer, apfelspalier, holzgewaechshaus, teeplatz, geissblattlaube, gartenschuppen, dorfschau |
| 21 tulpenfelder | tulpenreihen, hyazinthen, narzissen, zwiebelscheune, windmuehle, gracht, fahrradstall, versteigerung, hausboot, tulpenmarkt |
| 22 artischocken | artischockenfeld, lagunenwiese, bootsanleger, kanalgarten, granatapfelhecke, salzgarten, bootsschuppen, gemuesekahn, glockenturm, inselfest |
| 23 beerenwald | heidelbeerhang, preiselbeeren, moltebeeren, rotehuette, saftkueche, pilzlichtung, holzstapel, seesauna, mittsommer, jedermannspfad |

Großprojekt Bogen I: `gartenroute` („Omas Gartenroute“, Kapitel 13–19, Belohnung 300 Samen).

## Welle 3 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 24 patio | orangenhof, azulejobrunnen, geranienwand, acequia, jasminbogen, granatapfelbaum, galerie, marmeladenkueche, gitterfenster, patiofest |
| 25 korkeichen | korkhain, schaelplatz, eichelweide, storchenmast, schoepfrad, korkstapel, lehmhaus, honighaus, korkwerkstatt, korkfest |
| 26 paprikafelder | paprikareihen, paprikaschnuere, paprikamuehle, kalocsastube, schwengelbrunnen, tomatenfeld, akazienhain, schilfscheune, paprikamarkt, paprikafest |
| 27 aranfelder | feldmauern, tangbeete, kartoffelfurchen, burrenblumen, aranweide, strickstube, strohcottage, klippenpfad, hafenmauer, ceili |
| 28 rosental | rosenreihen, pflueckkoerbe, destillierkessel, walnussallee, imkerwagen, rosenwasser, bergquelle, veranda, rosenboden, rosenfest |
| 29 pistazien | pistazienhain, steinterrassen, kapellchen, mandelbaeume, kapernhang, roestplatz, inselhaus, zisterne, hafenmarkt, pistazienfest |

Abweichungen vom Plan: Kapitel 26 „Strohdachscheune“ → *Scheune mit Schilfdach* (in Ungarn deckt man mit Donau-Schilf); Kapitel 25 „Brunnen“ → *Schöpfbrunnen* (Nora); Kapitel 27 heißt im Spiel kurz „Steinfelder von Aran“ (passt in die Kopfleiste); Kapitel 29: Das Fischerboot liegt in der Grafik „Hafenmarkt“, nicht im Tierleben (das Meer liegt hinter der Kopfleiste).

Großprojekt Bogen II: `tauschpost` („Omas Tauschpost“, Kapitel 20–29, Belohnung 400 Samen).

## Welle 4 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 30 andenkartoffeln | andenes, sortenbeet, quinoafeld, chunoplatz, lehmspeicher, alpakaweide, bergkanal, webstube, kartoffelpark, kartoffelfest |
| 31 milpa | milpafeld, chiligarten, amaranth, comalkueche, maisspeicher, agavenzaun, meliponen, saatgutkruege, markttag, erntefeier |
| 32 kaffeewald | waldkaffee, pflueckplatz, trockenbetten, ensetegarten, honigbaeume, waschplatz, tukul, roestpfanne, kaffeezeremonie, kaffeemarkt |
| 33 reisterrassen | sawah, wasserteiler, wassertempel, kokospalmen, entenweide, lumbung, hanggarten, bambusbruecke, flechtwerkstatt, tempelfest |
| 34 gewuerzgarten | pfefferranken, kardamom, zimtbaeume, ingwerbeet, kurkuma, muskatbaum, trockenmatten, bootssteg, gewuerzlager, pookalam |

Abweichungen vom Plan: Kapitel 30 heißt im Spiel kurz „Kartoffeln der Anden“ (Kopfleiste); „Saatgut-Park“ → *Kartoffelpark* (nach dem Parque de la Papa bei Pisac, ohne Zahlen); Kapitel 31 „Drei-Schwestern-Feld“ → *Milpa-Feld* (der Begriff „Drei Schwestern“ stammt aus Nordamerika), Lage Michoacán (Balsas-Tal = Ursprung des Mais, Monarchfalter überwintern dort); Kapitel 33 „Werkstatt“ → *Flechtwerkstatt* (Canang aus Palmblatt), „Erntedank im Tempel“ hat die ID `tempelfest` (`erntedank` ist schon ein Fest); Kapitel 32: Der Rauch der Röstpfanne steigt in der Bereichsgrafik auf, nicht im Tierleben. Jahreszeiten der tropischen Kapitel: siehe Kopfkommentar der Grafik-Dateien (Regen-/Trockenzeit, Reis-Zyklus, Monsun).

## Welle 5 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 35 oase | dattelpalmen, stockwerkgarten, khettara, ksar, granataepfel, minzbeet, brunnenhof, teppichstube, dattelernte, sternenabend |
| 36 kakaogarten | kakaobaeume, bananenschatten, fermentation, trockengestelle, kochbananen, yamsfeld, dorfplatz, genossenschaft, schokowerkstatt, kakaofest |
| 37 buschgarten | wattlehain, fingerlimetten, zitronenmyrte, saltbush, wasserloch, eukalyptus, mahlstein, saatguthuette, regentank, feuerabend |
| 38 farngarten | baumfarne, kauripfad, harakeke, haengebruecke, gluehwurmgrotte, kumaragarten, wasserfall, pflanzschule, hanghuette, matariki |
| 39 kimchigarten | kohlreihen, rettichbeet, chilimatten, onggi, sesamfeld, perillabeet, hanokhof, kimjang, kakibaum, chuseok |

Abweichungen vom Plan: Kapitel 35 „Lehmspeicher (Ksar)“ → *Ksar*, „Teppichwebstube“ → *Teppichstube*, Lage Tafilalet (Herkunft der Medjool, Khettaras); Kapitel 36 „Fermentationskisten“ → *Fermentation* (in Ghana gärt man meist im Haufen unter Bananenblättern; Kisten erst ab Stufe 4), „Bananen-Schattenreihe“ → *Bananenschatten*, „Schokoladenwerkstatt“ → *Schokowerkstatt*, „Erntefest“ hat die ID `kakaofest`; Kapitel 37 „Akazienhain“ hat die ID `wattlehain` (`akazienhain` gibt es in Kapitel 26), „Saltbush“ heißt im Spiel *Salzbusch* (ID `saltbush`), Kirra schreibt bewusst ohne Gruß in einer Sprache der First Nations; Kapitel 38: Omas Tütchen ist Neuseeländer Spinat (seit Cook in europäischen Gärten), Kūmara als zweite Herkunftsgeschichte; Kapitel 39 „Hanok-Hof“ mit Ondol, Rauch im Tierleben (Winter). Jahreszeiten: Australien und Neuseeland nach der Südhalbkugel (Frühling = September), Oase und Ghana nach dem Erntejahr (siehe Kopf der Grafik-Dateien).

> **Stand heute:** Die Abweichungen der Wellen 1–7 beschreiben, wie die Texte zuerst geschrieben wurden (Orte, Begriffe, Herkunftsgeschichten). Seit dem Durchgang „nichts, was Gegenlesen braucht“ heißen viele Bereiche anders, und Orts-, Volks- und Zahlenangaben sind aus den Texten entfernt — maßgeblich ist `docs/kapitel/entschaerft.md`.

Großprojekt Bogen III: `herkunftsbeet` („Omas Herkunftsbeet“, Kapitel 30–39, Belohnung 450 Samen).

## Welle 6 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 40 dachgarten | dachbeete, bienendach, dachkuppel, dachtank, solarpergola, kraeuterbalkon, lastenaufzug, dachcafe, saatgutschrank, abendrotfest |
| 41 schulgarten | klassenbeete, schulkompost, insektenhaus, weidentipi, barfusspfad, kraeuterschnecke, schulkueche, gartenhuette, pausenbeet, schulfest |
| 42 waldgarten | kronenschicht, haselhecke, beerenschicht, kraeuterschicht, bodendecker, kletterpflanzen, pilzstaemme, weidenteich, lehrpfad, waldgartenfest |
| 43 samenbank | vermehrungsbeete, reinigungsraum, keimlabor, kuehltresor, sortengarten, samenarchiv, bestaeuberzelte, versandstelle, besucherpfad, offenertag |
| 44 klimagarten | trockenbeet, schwammflaeche, mulchwege, schattenbaum, zisternenspiel, mischkultur, windhecke, wetterstation, lehrkueche, klimatag |

Abweichungen vom Plan: Kapitel 40 „Wildbienen-Dach“ hat die ID `bienendach` (`wildbienen` gibt es schon), „Gewächshaus-Kuppel“ → *Glaskuppel* (ID `dachkuppel`), „Regenwassertank“ hat die ID `dachtank` (`regentank` gibt es in Kapitel 37), „Aufzug-Lieferung“ → *Lastenaufzug*, „Sonnenuntergangs-Fest“ → *Abendrot-Fest*; der Dachgarten liegt auf dem alten Parkhaus neben Jonas’ Hinterhof (Kapitel 13). Kapitel 41: Frau Yilmaz (Derya Yilmaz) gehört zur „Familie Yilmaz“, die im Spiel Bestellungen aufgibt (Kunden-Liste `orders.customers`), und ist Lehrerin für Sachunterricht an einer Grundschule; „Insektenhotel“ hat die ID `insektenhaus` (`insektenhotel` ist eine Deko), „Erntefest der Schule“ → *Schul-Erntefest* (ID `schulfest`). Kapitel 42: Die siebte Schicht (Wurzeln/Knollen) steckt im Lehrpfad (das letzte Schild zeigt nach unten); „Teich mit Weiden“ → *Weidenteich*. Kapitel 43: Spitzbergen nur als Vergleich im Brief, die Samenbank steht am Stadtrand; „Keimtest-Labor“ hat die ID `keimlabor`, „Archiv“ die ID `samenarchiv`, „Tag der offenen Tür“ die ID `offenertag`. Kapitel 44: „Zisternenspiel“ hat die ID `zisternenspiel` (`zisterne` gibt es in Kapitel 29), „Windschutz“ → *Windhecke* (`windschutz` gibt es in Kapitel 18), „Mischkultur-Beete“ → *Mischkultur*. Ab Kapitel 40 heißt die Notiz-Überschrift im Bereichsblatt „Aus Omas Notizbuch · Mila“ (`chapterUi.noteLabelMila`). Kein Großprojekt in dieser Welle (Bogen IV endet mit Kapitel 49).

## Welle 7 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 45 wildblumenband | bluehstreifen, totholz, sandarium, feldrain, feldhecke, tuempel, steinriegel, wildsaatgut, gruenbruecke, bestaeuberfest |
| 46 fassadengarten | moosfassade, kletterhortensie, hopfenranken, tropfschlauch, balkonbeete, nistwand, sensorgarten, fensterbank, hofcafe, lichterfassade |
| 47 solawihof | gemueseschlaege, folientunnel, abholraum, kartoffelkeller, huehnermobil, hofsaatgut, versammlung, werkzeugscheune, kinderacker, solawifest |
| 48 saatguttausch | tauschtische, sortenschau, erzaehlzelt, briefstation, samenwerkstatt, pflanzenboerse, weltkueche, musikbuehne, archivwagen, abschlussrunde |
| 49 weltgartenschau | europabeete, weltbeete, zukunftshalle, gondelbahn, wasserlichter, saatguttempel, kinderwald, familienpavillon, aussichtssteg, eroeffnung |

Abweichungen vom Plan: Kapitel 45 „Hecke“ → *Feldhecke*, „Kleingewässer“ → *Tümpel* (ID `tuempel`), „Saatgut-Ernte“ hat die ID `wildsaatgut` (Mahdgut von der alten Moorwiese), „Brücke über die Straße“ → *Grünbrücke*; Greta grüßt (seit `entschaerft.md`) mit „Hallo, ihr Lieben“. Kapitel 46 „Tröpfchenbewässerung“ → *Tropfschlauch*, „Vogelnistwand“ → *Nistwand*, „Fensterbank-Gärtnerei“ → *Fensterbänke* (ID `fensterbank`); die Wand ist die fensterlose Südwand von Milas Haus. Kapitel 47: Absender ist **Till**, Lenas Bruder (der Plan nannte „Paul“, den gibt es schon als Obergärtner Paul Weidner); der Solawi-Hof ist Onkel Fritz’ alter Hof aus Kapitel 4 (undichtes Scheunendach, freche Gänse, Schlüssel unter dem Blumentopf); „Saatgutvermehrung“ → *Hofsaatgut*, „Mitgliederversammlung“ → *Versammlung* (Bieterrunde), „Hoffest“ hat die ID `solawifest` (`hoffest` gibt es in Kapitel 13). Kapitel 48: Sammelbrief aller Absender der Kapitel 13–39 (je Bogen ein Absatz, jeder bringt zurück, was Oma einst schickte), Ort: die Wiese der alten Gartenschau; „Sortenausstellung“ → *Sortenschau*, „Kinder-Saatgutwerkstatt“ → *Samenwerkstatt*, „Pflanzenflohmarkt“ → *Pflanzenbörse*, „Saatgut-Archivwagen“ → *Archivwagen*. Kapitel 49: „Länderbeete aus Bogen II/III“ → *Europa-Beete* / *Beete der Welt*, „Seilbahn“ hat die ID `gondelbahn` (`seilbahn` gibt es auf der Alm), „Wasserlichtspiele“ → *Wasserlichter*, „Pavillon der Familie“ → *Unser Pavillon* (ID `familienpavillon`), „Aussichtsplattform“ → *Aussichtssteg* (`aussichtsturm` gibt es in Kapitel 12), „Eröffnungsfeier“ hat die ID `eroeffnung`; das Finale (Omas Schrebergarten, die leere Dose) bleibt Kapitel 50 vorbehalten.

Großprojekt Bogen IV: `morgengarten` („Der Garten für morgen“, Kapitel 40–49, Belohnung 500 Samen).

## Welle 8 — Bereichs-IDs

| Kapitel | IDs (Reihenfolge = Leiter) |
|---|---|
| 50 omasgarten | omasbeet, omaskompost, omasspirale, omashecke, opasapfel, omasbienen, omashuehner, altglashaus, omaslaube, omasbank |

Die IDs tragen bewusst das Präfix `omas…`/`opas…`/`alt…`: Die Bereiche spiegeln Kapitel 1 (`gemuesebeet`, `kompost`, `kraeuterspirale` …), dürfen aber nicht dieselben IDs haben. Abweichungen vom Plan: „Erstes Beet“ hat die ID `omasbeet`, „Apfelbaum von Opa“ heißt im Spiel *Opas Apfelbaum* (ID `opasapfel`), „Altes Gewächshaus“ die ID `altglashaus`, „Bienenkiste“ heißt im Spiel *Bienenkasten*. Brief und Notizen stammen wieder von **Oma** (Überschrift „Aus Omas Notizbuch“; die Mila-Überschrift gilt nur für Bogen IV, `chapterArc(50) = 5`). Omas Brief „Das letzte Tütchen“: Radieschen von ihrem allerersten Beet, über den Zaun von einer Nachbarin geschenkt und jedes Jahr nachgezogen; das Tütchen trägt keine Adresse, nur „Für dich“. Kurz-Chip „Anfang“ (Knopf „Zurück zum Anfang“), Währung Erinnerungen. Kulisse `omaGarden` in `backdropFinale.tsx`: wächst mit der Kapitel-Stufe (angelegte Bereiche) von Brombeeren zu Blumen, Nachbarlauben, Vereinsfahne (ab 5), Apfelbäumen (ab 8) und Lichterkette (10). Weg `omaZigzag`. Tierleben `k8-*`: Rotkehlchen (ganzjährig), Igel in der Dämmerung (nicht im Winter, Winterschlaf), Glühwürmchen in Sommernächten.

**Abschluss-Szene** (nur Darstellung, `components/AbschlussScene.tsx`): Sobald der letzte Bereich (Omas Bank) gepflanzt und Omas Brief gelesen ist, erscheint beim Öffnen der Karte einmalig die Familie auf Omas Bank (Oma, Ilse, Jonas, Mila, Lena, Till), davor die leere Dose und ein Tütchen „Für dich“ (das Spiel kennt keinen Spielernamen). Knopf „Weiter gärtnern“, Escape/Zurück schließen ebenso. „Gesehen“ steht im Spielstand als neues Feld `abschlussSeen` (Startwert `false`, übersteht Saisonende, Tiefen Winter und Generation; keine neue `SAVE_VERSION`, alte Stände laden verlustfrei, Migrationstest). Statt „Weitere Gärten folgen“ stehen in Grundstücke, Sammlung und Tiefem Winter jetzt Abschluss-Sätze (`chapterUi.allFound`, `chapterUi.lastChapter`).

## Fortschritt

- [x] **Paket 0** — Plan & Geschichte (dieses Dokument)
- [x] **Paket 1** — Taktung & Technik (Ruhezeit, Kapitel-Boni addiert, Freischaltregel 13+, Simulator mit Kapiteln, Kapitel-Daten in `chapterPlan.ts`, Spielstand-Größe, „Weitere Gärten folgen“)
- [x] **Welle 1** — Kapitel 13–17 (Texte de + en, Grafik je Bereich in 5 Stufen + Jahreszeiten, Kulissen `cityYard`/`monastery`/`palace`/`nursery`/`moor`, eigene Wege `yard`/`cloister`/`axis`/`nurseryRows`/`boardwalk`, Tierleben, Währungs-Symbole; `RELEASED_UP_TO = 17`)
  - Großprojekt für Bogen I: erledigt in Welle 2 (`gartenroute`).
- [x] **Welle 2** — Kapitel 18–23 (Texte de + en, Bogen II in `stringsChaptersArc2.ts`; Grafik je Bereich in 5 Stufen + Jahreszeiten, gesperrte Ecken `wildD`, Kulissen `dike`/`spreewald`/`cotswolds`/`bulbFields`/`lagoon`/`swedishWoods` in `backdropArc1/2.tsx`, Wege `dikeTrack`/`fliess`/`flagstones`/`bulbLanes`/`canals`/`forestTrail`, Tierleben in `12-kapitel-tierleben-2.css`, Währungs-Symbole; Großprojekt `gartenroute` für Bogen I; `RELEASED_UP_TO = 23`)
- [x] **Welle 3** — Kapitel 24–29 (Texte de + en in `stringsChaptersArc2.ts`: Inés Morales, João Ferreira, Erzsébet Kovács, Siobhán Ní Fhlatharta, Petar Ivanov, Eleni Papadaki; Grafik je Bereich in 5 Stufen + Jahreszeiten, Teile `partsE`, gesperrte Ecken `wildE`, Kulissen `andalusia`/`montado`/`kalocsa`/`aran`/`roseValley`/`aegina` in `backdropArc2.tsx`, Wege `patioTiles`/`montadoTrack`/`pepperLanes`/`limestone`/`roseLanes`/`terraceSteps`, Tierleben `k3-*`, Währungs-Symbole; Großprojekt `tauschpost` für Bogen II; `RELEASED_UP_TO = 29`)
- [x] **Welle 4** — Kapitel 30–34, Beginn Bogen III (Texte de + en in `stringsChaptersArc3.ts`: Rosa Quispe, Teodoro Hernández, Almaz Tesfaye, Made Wirawan, Anjali Menon; Grafik je Bereich in 5 Stufen + Jahreszeiten als Regen-/Trockenzeit bzw. Reis-Zyklus, Teile `partsF`, gesperrte Ecken `wildF`, Kulissen `andes`/`milpaHills`/`coffeeForest`/`bali`/`kerala` in `backdropArc3.tsx`, Wege `andenSteps`/`milpaRing`/`forestZigzag`/`subakSteps`/`spiceTrail`, Tierleben `k4-*`, Währungs-Symbole; kein Großprojekt; `RELEASED_UP_TO = 34`)
- [x] **Welle 5** — Kapitel 35–39, Abschluss Bogen III (Texte de + en in `stringsChaptersArc3.ts`: Youssef Amrani, Ama Owusu, Kirra Walker, Aroha Ngata, Kim Soo-ah; Grafik je Bereich in 5 Stufen + Jahreszeiten (Südhalbkugel bzw. Erntejahr), Teile `partsG`, gesperrte Ecken `wildG`, Kulissen `oasis`/`cocoaFarm`/`bush`/`fernForest`/`korea` in `backdropArc3.tsx`, Wege `oasisRing`/`cocoaTrail`/`bushSpiral`/`fernBoardwalk`/`kimchiRows`, Tierleben `k5-*`, Währungs-Symbole; Großprojekt `herkunftsbeet` für Bogen III; `RELEASED_UP_TO = 39`)
- [x] **Welle 6** — Kapitel 40–44, Beginn Bogen IV (Texte de + en in `stringsChaptersArc4.ts`: Mila, Derya Yilmaz, Lena, Dr. Amara Okafor, Jonas; Bereichs-Notizen von Mila; Grafik je Bereich in 5 Stufen + Jahreszeiten, Teile `partsH`, gesperrte Ecken `wildH`, Kulissen `rooftop`/`schoolyard`/`forestGarden`/`seedBank`/`climateGarden` in `backdropArc4.tsx`, Wege `roofRing`/`schoolZigzag`/`chipSpiral`/`seedRing`/`mulchZigzag`, Tierleben `k6-*`, Währungs-Symbole; kein Großprojekt; `RELEASED_UP_TO = 44`)
- [x] **Welle 7** — Kapitel 45–49, Abschluss Bogen IV (Texte de + en in `stringsChaptersArc4.ts`: Greta Hansen, Mila, Till, Sammelbrief aller Briefpartner, Dr. Elisabeth Grün; Bereichs-Notizen von Mila; Grafik je Bereich in 5 Stufen + Jahreszeiten, Teile `partsI`, gesperrte Ecken `wildI`, Kulissen `wildflowerBand`/`livingWall`/`communityFarm`/`seedSwap`/`worldExpo` in `backdropArc4.tsx`, Wege `meadowSpiral`/`courtSteps`/`farmRows`/`swapRing`/`expoRing`, Tierleben `k7-*`, Währungs-Symbole; Großprojekt `morgengarten` für Bogen IV; `RELEASED_UP_TO = 49`)
- [x] **Welle 8** — Kapitel 50, Finale & Abschluss (Brief und Notizen von Oma in `stringsChaptersArc4.ts`; Grafik je Bereich in 5 Stufen + Jahreszeiten von „damals“ zu „heute“, gesperrte Ecken (Brombeeren) in `wildI`, Kulisse `omaGarden` in `backdropFinale.tsx` mit Stufen, Weg `omaZigzag`, Tierleben `k8-*`, Währungs-Symbol (Dose mit Tütchen); Abschluss-Szene mit gespeichertem Feld `abschlussSeen`; Abschluss-Sätze statt „Weitere Gärten folgen“; `RELEASED_UP_TO = 50`, Platzhalter-Funktion entfernt; ROADMAP, Store-Texte `docs/store/texte.md`, Bericht `abschluss-bericht.md`)
- [x] **Entschärfung** — Kapitel 13–50 (de + en, Pflege-Namen, Glossar, Store-Texte, Bericht): Fremdwörter und Grüße in Landessprache, Bräuche und Wissen anderer Völker, prüfbare Zahlen/Jahreszahlen und unsichere Orts-Angaben ersetzt; IDs unverändert. Liste: `docs/kapitel/entschaerft.md`
