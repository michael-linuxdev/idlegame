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
| III | 30–39 | **Wo die Samen herkommen** | Die Familie reist zu den Ursprüngen dessen, was in Omas Garten wächst: Kartoffel, Mais und Bohnen, Kaffee, Reis, Pfeffer, Datteln, Kakao, Kohl. |
| IV | 40–49 | **Saatgut für morgen** | Die nächste Generation übernimmt. Gärten der Zukunft: Dach, Fassade, Schule, Waldgarten, Samenbank, Klimagarten. Die Notizen stammen hier nicht mehr von Oma, sondern von Mila (Jonas’ Tochter). |
| — | 50 | **Zurück zum Anfang** | Omas Schrebergarten. Das letzte Tütchen in der Dose trägt keine Adresse, sondern deinen Namen. |

**Abweichungen vom Vorschlag im Prompt (begründet):**
- *Wintergarten, Rosengarten* gestrichen: Palmenhaus/Glaskuppel (Kap. 8) und Rosarium/Rosenbogen (Kap. 8, 12) gibt es schon.
- *Olivenhain Toskana, Zitrusgarten Sizilien* gestrichen: Oliven und Feigen hat Kapitel 10, Zitronen die Orangerie. Stattdessen Sant’Erasmo (Artischocken), Ägina (Pistazien), Kazanlak (Rosenöl).
- *Teeplantage, Bambushain, Kakteengarten* gestrichen: Tee und Bambus hat Kapitel 11, Kakteen Kapitel 8. Stattdessen Kakao (Ghana), Kimchi-Garten (Korea), Oase (Marokko).
- *Schwarzwälder Kirschgarten* gestrichen (Streuobst/Kirschen in Kapitel 2). Stattdessen Spreewald.
- *Forschungsgewächshaus* und *vertikaler Garten* zusammengelegt zu „Fassadengarten“; dafür neu „Solawi-Hof“ und „Großer Saatguttausch“ (schließt an die Saatgutbriefe an).
- Bogen III ist bewusst **Ursprungs-Geschichte**, kein Reise-Katalog: Jedes Kapitel erklärt, woher eine Pflanze aus Omas Garten stammt.

**Leitlinien für Inhalt und Ton**
- Keine Klischees, keine Karikaturen von Menschen. Figuren sind Fachleute in ihrem eigenen Garten: Bäuerinnen, Försterinnen, Lehrerinnen, Gärtner.
- Echte Pflanzen, echte Bauweisen (Subak-Bewässerung, Milpa, Montado, Lazy Beds, Onggi-Töpfe …).
- Wo Wissen indigener Gemeinschaften berührt wird (Anden, Milpa, Australien, Neuseeland), schreibt jemand, der es selbst trägt, oder es wird ausdrücklich als ihr Wissen benannt.
- Briefe 4–6 Absätze, eigene Stimme. Grüße in der Landessprache sind erlaubt, wenn der Brief sie gleich erklärt (wie „Moin“ in Kapitel 6).
- Gleichmäßige Qualität: Lieber ein Bereich einfacher als ein Kapitel aufgebläht.

## Kapitel

Spalten: **ID** (stabil, Teil des Speicherformats) · Titel de / en · Währung de / en · Absender · Weg (`ZIGZAG`, `RING`, `TERRACES`, `ROWS`, `SPIRAL`). Darunter: 10 Bereiche (de), Landschaft, Tierleben/Bewegung, Jahreszeit.

Bereichs-**IDs** sind über alle Kapitel und den Garten eindeutig (Pflege-Namen hängen daran); sie werden erst festgelegt, wenn eine Welle gebaut wird (Welle 1 unten mit IDs).

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
- Bereiche: Sanddornhecke, Salzwiese, Kartoffelacker im Koog, Windschutzhecke, Strandrosen, Krabbenkutter-Steg, Reetdachkate, Friesenstube, Leuchtturm-Garten, Biikebrennen
- Landschaft: Deich, Watt, Leuchtturm, Wolkenhimmel
- Tiere: Schafe auf dem Deich, Austernfischer, Windmühle dreht
- Jahreszeit: Winter — Biikefeuer (22. Februar); Herbst — Sanddorn orange

**19 · `spreewald`** · Spreewald / The Spreewald · Gurken / Gherkins · **Mirko Nowak** (Kahnfährmann, sorbische Familie) · ZIGZAG (Fließe)
- Bereiche: Gurkenfeld, Meerrettichbeet, Leinölmühle, Kahnanleger, Bauerngarten am Fließ, Einlegeküche, Holzschuppen, Sorbisches Trachtenhaus, Erlenwald, Gurkenfest
- Landschaft: Fließe mit Kähnen, Erlen, Blockhäuser
- Tiere: Kahn gleitet, Eisvogel, Störche auf dem Dach
- Jahreszeit: Winter — Eis auf den Fließen; Ostern — sorbische Ostereier

### Bogen II — Omas Saatgutbriefe (20–29)

**20 · `cottagegarten`** · Cottage-Garten in England / The Cotswold Cottage Garden · Duftwicken / Sweet Peas · **Margaret Pryce** · ZIGZAG
- Stockrosenbeet, Wickenzaun, Gemüse-Allotment, Trockenmauer, Apfelspalier, Gewächshaus aus Holz, Teeplatz unter der Eiche, Geißblattlaube, Schuppen, Dorfgartenschau
- Landschaft: Honigfarbene Steinhäuser, Hügel mit Schafen · Tiere: Rotkehlchen, Schafe, Dampflok in der Ferne · Jahreszeit: Sommer — Gartenschau im Dorf

**21 · `tulpenfelder`** · Tulpenfelder in Holland / The Dutch Bulb Fields · Blumenzwiebeln / Bulbs · **Joost de Vries** · ROWS
- Tulpenreihen, Hyazinthenfeld, Narzissenwiese, Zwiebelscheune, Windmühle, Gracht mit Brücke, Fahrradstall, Versteigerungshalle, Hausboot-Garten, Tulpenmarkt
- Tiere: Möwen, Windmühlenflügel, Enten in der Gracht · Jahreszeit: Frühling — Felder in Streifen; Herbst — Zwiebeln stecken

**22 · `artischocken`** · Artischockeninsel bei Venedig / Sant’Erasmo Artichokes · Artischocken / Artichokes · **Giulia Zanon** · ZIGZAG (Kanäle)
- Artischockenfeld, Lagunenwiese, Bootsanleger, Kanalgarten, Granatapfelhecke, Salzgarten, Bootsschuppen, Gemüsekahn, Glockenturm-Blick, Inselfest
- Tiere: Reiher, Gondel/Sandolo gleitet, Möwen · Jahreszeit: Frühling — „Castraure“ (erste Artischocke)

**23 · `beerenwald`** · Beerenwald in Schweden / The Swedish Berry Woods · Blaubeeren / Blueberries · **Ingrid Lund** · SPIRAL
- Heidelbeerhang, Preiselbeermoos, Moltebeerenmoor, Rote Hütte, Saftküche, Pilzlichtung, Holzstapel, Sauna am See, Mittsommerplatz, Jedermannsrecht-Pfad
- Tiere: Elch am Waldrand, Eichhörnchen, Polarlicht (Winter) · Jahreszeit: Sommer — Mittsommer-Maibaum; Winter — Polarlicht

**24 · `patio`** · Andalusischer Patio / The Andalusian Patio · Orangen / Seville Oranges · **Inés Morales** · RING (Innenhof)
- Orangenhof, Brunnen mit Azulejos, Geranienwand, Bewässerungsrinne (Acequia), Jasminbogen, Granatapfelbaum, Kühle Galerie, Marmeladenküche, Gitterfenster, Patio-Fest (Cruces de Mayo)
- Tiere: Schwalben, Wasserstrahl, Katze im Schatten · Jahreszeit: Frühling — Orangenblüte (Azahar)

**25 · `korkeichen`** · Korkeichenhain in Portugal / The Cork Oak Montado · Kork / Cork · **João Ferreira** · ZIGZAG
- Korkeichen, Schälplatz, Eichelweide, Störche auf dem Mast, Brunnen, Korkstapel, Lehmhaus, Honighaus, Korkwerkstatt, Erntefest
- Tiere: Störche, Eichelhäher, Schafe · Jahreszeit: Sommer — Schälzeit (nur alle 9 Jahre je Baum)

**26 · `paprikafelder`** · Paprikafelder in Ungarn / The Kalocsa Paprika Fields · Paprika / Paprika · **Erzsébet Kovács** · ROWS
- Paprikareihen, Trockenschnüre an der Hauswand, Paprikamühle, Bemalte Bauernstube (Kalocsa-Muster), Brunnenschwengel, Tomatenfeld, Akazienwäldchen, Strohdachscheune, Markt, Paprikafest
- Tiere: Störche, Pferd am Brunnen, Lerche · Jahreszeit: Herbst — rote Schnüre an jeder Wand

**27 · `aranfelder`** · Steinfelder der Aran-Inseln / The Aran Island Fields · Wolle / Wool · **Siobhán Ní Fhlatharta** · TERRACES (Mauerfelder)
- Trockenmauern, Tang-Beete (Lazy Beds), Kartoffelfurchen, Burren-Blumen, Schafweide, Strickstube, Cottage mit Reetdach, Klippenpfad, Hafenmauer, Céilí-Abend
- Tiere: Schafe, Papageitaucher, Brandung · Jahreszeit: Frühling — Enziane im Kalkstein

**28 · `rosental`** · Rosental in Bulgarien / The Bulgarian Rose Valley · Rosenöl / Rose Oil · **Petar Ivanov** · ROWS
- Rosenreihen (Damaszener), Pflückkörbe, Destillierkessel, Walnussallee, Imkerwagen, Rosenwasser-Küche, Bergquelle, Holzveranda, Trocknungsboden, Rosenfest
- Tiere: Bienen, Schwalben, Esel mit Körben · Jahreszeit: Frühsommer — Pflücken im Morgengrauen

**29 · `pistazien`** · Pistazienhain auf Ägina / The Pistachio Groves of Aegina · Pistazien / Pistachios · **Eleni Papadaki** · TERRACES
- Pistazienbäume, Trockenmauer-Terrassen, Kapellchen, Mandelbäume, Kapernhang, Röstplatz, Weißes Haus mit blauer Tür, Zisterne, Hafenmarkt, Pistazienfest
- Tiere: Zikaden (Flimmern), Ziegen, Fischerboot · Jahreszeit: Spätsommer — rote Fruchtbüschel

### Bogen III — Wo die Samen herkommen (30–39)

**30 · `andenkartoffeln`** · Kartoffelterrassen in den Anden / The Andean Potato Terraces · Kartoffeln / Potatoes · **Rosa Quispe** (Agronomin, Quechua-Gemeinde) · TERRACES
- Andenes-Terrassen, Sortenbeet (hundert Kartoffeln), Quinoafeld, Chuño-Trockenplatz, Lehmspeicher, Alpakaweide, Bewässerungskanal, Webstube, Saatgut-Park, Kartoffelfest
- Tiere: Alpakas, Kondor kreist, Kolibri · Jahreszeit: Trockenzeit — Chuño gefriertrocknen im Frost

**31 · `milpa`** · Milpa in Mexiko / The Milpa Fields · Mais / Corn · **Teodoro Hernández** · RING
- Drei-Schwestern-Feld (Mais, Bohnen, Kürbis), Chili-Garten, Amaranth, Comal-Küche, Maisspeicher, Agavenzaun, Bienenstand (Melipona), Saatgut-Krüge, Markttag, Erntefeier
- Tiere: Kolibri, Truthahn, Schmetterlinge (Monarchfalter, Herbst) · Jahreszeit: Herbst — Monarchfalter-Zug

**32 · `kaffeewald`** · Kaffeewald in Äthiopien / The Ethiopian Coffee Forest · Kaffee / Coffee · **Almaz Tesfaye** · ZIGZAG
- Waldkaffee unter Schattenbäumen, Pflückplatz, Trockenbetten, Ensete-Garten, Honigbäume, Bach mit Waschplatz, Rundhaus (Tukul), Röstplatz, Kaffeezeremonie, Markt
- Tiere: Turako, Bienen, Rauch der Röstpfanne · Jahreszeit: Regenzeit — Kaffeeblüte weiß

**33 · `reisterrassen`** · Reisterrassen auf Bali / The Balinese Rice Terraces · Reis / Rice · **Made Wirawan** (Subak-Wasserverwalter) · TERRACES
- Reisterrassen, Subak-Wasserverteiler, Wassertempelchen, Kokospalmen, Entenweide, Reisspeicher (Lumbung), Gemüsegarten am Hang, Bambusbrücke, Werkstatt, Erntedank im Tempel
- Tiere: Enten im Gänsemarsch, Reiher, Wasser fließt · Jahreszeit: Wechsel grün → gold → Wasserspiegel

**34 · `gewuerzgarten`** · Gewürzgarten in Kerala / The Kerala Spice Garden · Pfeffer / Pepper · **Anjali Menon** · ZIGZAG
- Pfefferranken am Baum, Kardamom im Schatten, Zimtbäume, Ingwerbeet, Kurkuma, Muskatbaum, Trockenmatten, Hausboot-Steg, Gewürzlager, Onam-Blumenteppich
- Tiere: Hornvogel, Schmetterlinge, Monsunregen · Jahreszeit: Monsun — Regenvorhang

**35 · `oase`** · Dattel-Oase in Marokko / The Date Palm Oasis · Datteln / Dates · **Youssef Amrani** · RING
- Dattelpalmen, Stockwerkgarten (Palme–Obst–Gemüse), Khettara-Wasserlauf, Lehmspeicher (Ksar), Granatäpfel, Minzbeet, Brunnenhof, Teppichwebstube, Dattelernte, Sternenabend
- Tiere: Kamel am Rand, Wiedehopf, Wasser im Kanal · Jahreszeit: Herbst — Dattelernte

**36 · `kakaogarten`** · Kakaogarten in Ghana / The Ghana Cocoa Farm · Kakao / Cocoa · **Ama Owusu** · ZIGZAG
- Kakaobäume, Bananen-Schattenreihe, Fermentationskisten, Trockengestelle, Kochbananen, Yamsfeld, Dorfplatz, Genossenschafts-Haus, Schokoladenwerkstatt, Erntefest
- Tiere: Nashornvogel, Schmetterlinge, Hühner · Jahreszeit: Hauptsaison — Schoten gelb und rot

**37 · `buschgarten`** · Buschgarten in Australien / The Australian Bush Garden · Akaziensamen / Wattleseed · **Kirra Walker** (Bushfood-Gärtnerin, gibt das Wissen ihrer Familie weiter) · SPIRAL
- Akazienhain, Fingerlimetten, Zitronenmyrte, Saltbush, Wasserloch, Eukalyptushain, Mahlstein-Platz, Saatgut-Hütte, Regenwassertank, Abend am Feuer
- Tiere: Kängurus (ruhig grasend), Kakadus, Eidechse auf dem Stein · Jahreszeit: Frühling (September) — gelbe Akazienblüte

**38 · `farngarten`** · Farnwald in Neuseeland / The New Zealand Fern Forest · Farnwedel / Fern Fronds · **Aroha Ngata** (Rangerin) · SPIRAL
- Baumfarne (Ponga), Kauri-Pfad, Harakeke (Flachs), Hängebrücke, Glühwürmchengrotte, Kūmara-Garten, Wasserfall, Pflanzschule, Hütte am Hang, Matariki-Abend
- Tiere: Tūī singt, Fantail, Glühwürmchen · Jahreszeit: Winter (Juni/Juli) — Matariki-Sterne

**39 · `kimchigarten`** · Kimchi-Garten in Korea / The Korean Kimchi Garden · Chinakohl / Napa Cabbage · **Kim Soo-ah** · ROWS
- Kohlreihen, Rettichbeet, Chili-Trockenmatten, Onggi-Töpfe, Sesamfeld, Perillabeet, Hanok-Hof, Kimjang-Platz (gemeinsames Einlegen), Kakibaum, Herbstfest (Chuseok)
- Tiere: Elstern, Kakis wiegen, Rauch der Ondol-Heizung · Jahreszeit: Spätherbst — Kimjang

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

**47 · `solawihof`** · Solawi-Hof / The Community Farm · Ernteanteile / Harvest Shares · **Paul** (Onkel Fritz’ Enkel) · ROWS
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

Jede Welle ist für sich spielbar: Hinter dem letzten gebauten Kapitel zeigen
„Sammlung & Ziele“ und die Grundstücke-Auswahl nur „Weitere Gärten folgen“.

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

## Fortschritt

- [x] **Paket 0** — Plan & Geschichte (dieses Dokument)
- [x] **Paket 1** — Taktung & Technik (Ruhezeit, Kapitel-Boni addiert, Freischaltregel 13+, Simulator mit Kapiteln, Kapitel-Daten in `chapterPlan.ts`, Spielstand-Größe, „Weitere Gärten folgen“)
- [x] **Welle 1** — Kapitel 13–17 (Texte de + en, Grafik je Bereich in 5 Stufen + Jahreszeiten, Kulissen `cityYard`/`monastery`/`palace`/`nursery`/`moor`, eigene Wege `yard`/`cloister`/`axis`/`nurseryRows`/`boardwalk`, Tierleben, Währungs-Symbole; `RELEASED_UP_TO = 17`)
  - Großprojekt für Bogen I: erledigt in Welle 2 (`gartenroute`).
- [x] **Welle 2** — Kapitel 18–23 (Texte de + en, Bogen II in `stringsChaptersArc2.ts`; Grafik je Bereich in 5 Stufen + Jahreszeiten, gesperrte Ecken `wildD`, Kulissen `dike`/`spreewald`/`cotswolds`/`bulbFields`/`lagoon`/`swedishWoods` in `backdropArc1/2.tsx`, Wege `dikeTrack`/`fliess`/`flagstones`/`bulbLanes`/`canals`/`forestTrail`, Tierleben in `12-kapitel-tierleben-2.css`, Währungs-Symbole; Großprojekt `gartenroute` für Bogen I; `RELEASED_UP_TO = 23`)
- [ ] Welle 3 — Kapitel 24–29
- [ ] Welle 4 — Kapitel 30–34
- [ ] Welle 5 — Kapitel 35–39
- [ ] Welle 6 — Kapitel 40–44
- [ ] Welle 7 — Kapitel 45–49
- [ ] Welle 8 — Kapitel 50, Finale & Abschluss
