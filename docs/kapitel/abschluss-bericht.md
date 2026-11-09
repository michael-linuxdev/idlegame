# Abschluss-Bericht: Kapitel 13–50 „Omas Saatgutdose“

Stand 2026-11-09, nach Welle 8. Plan und Geschichte: `docs/kapitel/plan.md`,
Bauanleitung: `docs/kapitel/wellen-anleitung.md`, Taktung: `docs/kapitel/balance-bericht.md`.

## Geschichte in einem Absatz

Nach der Gartenschau (Kapitel 12) findet die Familie unter Omas Gedenkbeet eine
Blechdose voller Samentütchen, jedes mit Name und Adresse, dazu Briefe. Sie
folgt den Spuren: erst in die Heimat (Bogen I), dann zu Omas Briefpartnern in
Europa (Bogen II), zu Gärtnerinnen und Gärtnern in aller Welt, bei denen wächst, was in Omas Garten steht (Bogen III)
und schließlich in die Gärten von morgen, in denen Mila die Notizen
weiterschreibt (Bogen IV). Das letzte Tütchen trägt keine Adresse, nur „Für
dich“: Radieschen von Omas allererstem Beet (Kapitel 50). Wenn der Garten
von damals wieder angelegt ist, sitzt die Familie aller Generationen auf
Omas Bank, und das Spiel geht weiter.

## Die 38 neuen Kapitel

| Nr. | Titel (Spiel) | Währung | Absender | Bogen |
|---|---|---|---|---|
| 13 | Gemeinschaftsgarten | Tomaten | Jonas (erwachsen, Stadtplaner) | I Nach der Schau |
| 14 | Klostergarten | Quitten | Schwester Benedikta | I |
| 15 | Schlossgarten | Spargel | Obergärtner Paul Weidner | I |
| 16 | Baumschule | Setzlinge | Lena (Onkel Fritz’ Enkelin) | I |
| 17 | Moor- und Heidegarten | Moosbeeren | Greta Hansen (Ilses Nichte) | I |
| 18 | Deichgarten | Sanddorn | Frauke Petersen (Deichschäferin) | I |
| 19 | Spreewald | Gurken | Mirko Nowak (Kahnfährmann) | I |
| 20 | Cottage-Garten | Duftwicken | Margaret Pryce | II Omas Saatgutbriefe |
| 21 | Tulpenfelder | Blumenzwiebeln | Joost de Vries | II |
| 22 | Artischockeninsel | Artischocken | Giulia Zanon | II |
| 23 | Beerenwald | Blaubeeren | Ingrid Lund | II |
| 24 | Andalusischer Patio | Orangen | Inés Morales | II |
| 25 | Korkeichenhain | Kork | João Ferreira | II |
| 26 | Paprikafelder | Paprika | Erzsébet Kovács | II |
| 27 | Steinfelder von Aran | Wolle | Siobhán Ní Fhlatharta | II |
| 28 | Rosental | Rosenöl | Petar Ivanov | II |
| 29 | Pistazienhain auf Ägina | Pistazien | Eleni Papadaki | II |
| 30 | Kartoffeln der Anden | Kartoffeln | Rosa Quispe (Agronomin) | III Wo die Samen herkommen |
| 31 | Maisfelder in Mexiko | Mais | Teodoro Hernández | III |
| 32 | Kaffeewald in Äthiopien | Kaffee | Almaz Tesfaye | III |
| 33 | Reisterrassen auf Bali | Reis | Made Wirawan (verteilt das Wasser) | III |
| 34 | Gewürzgarten in Kerala | Pfeffer | Anjali Menon | III |
| 35 | Dattel-Oase in Marokko | Datteln | Youssef Amrani | III |
| 36 | Kakaogarten in Ghana | Kakao | Ama Owusu | III |
| 37 | Buschgarten in Australien | Akaziensamen | Kirra Walker (Gärtnerin) | III |
| 38 | Farnwald in Neuseeland | Farnwedel | Aroha Ngata (Rangerin) | III |
| 39 | Kimchi-Garten in Korea | Chinakohl | Kim Soo-ah | III |
| 40 | Dachgarten | Salat | Mila (Jonas’ Tochter) | IV Saatgut für morgen |
| 41 | Schulgarten | Radieschen | Derya Yilmaz (Lehrerin) | IV |
| 42 | Waldgarten | Haselnüsse | Lena | IV |
| 43 | Samenbank | Saatgutproben | Dr. Amara Okafor | IV |
| 44 | Klimagarten | Regenwasser | Jonas | IV |
| 45 | Wildblumenband | Hummeln | Greta Hansen | IV |
| 46 | Fassadengarten | Ranken | Mila | IV |
| 47 | Solawi-Hof | Ernteanteile | Till (Lenas Bruder) | IV |
| 48 | Großer Saatguttausch | Tauschbriefe | Sammelbrief aller Briefpartner 13–39 | IV |
| 49 | Weltgartenschau | Gäste | Dr. Elisabeth Grün | IV |
| 50 | Omas Schrebergarten | Erinnerungen | Oma (letzter Brief aus der Dose) | Finale |

Englische Titel und Währungen: `docs/i18n/glossar.md` („Kapitel und
Währungen“). Bereichs-Notizen: Bogen I–III und Kapitel 50 von Oma, Bogen IV
von Mila („Aus Omas Notizbuch · Mila“).

## Die vier Großprojekte

| ID | Name | Kapitel | Belohnung |
|---|---|---|---|
| `gartenroute` | Omas Gartenroute | 13–19 | 300 Samen |
| `tauschpost` | Omas Tauschpost | 20–29 | 400 Samen |
| `herkunftsbeet` | Omas Herkunftsbeet | 30–39 | 450 Samen |
| `morgengarten` | Der Garten für morgen | 40–49 | 500 Samen |

Daten: `src/game/projects.ts`, Texte: `stringsLife.ts` (de + en).

## Abschluss-Szene (Kapitel 50)

- Auslöser: `abschlussDue(state)` in `src/game/state/chapters.ts` — Kapitel 50
  offen, Omas Brief gelesen, letzter Bereich (Omas Bank) gepflanzt, Szene noch
  nicht gesehen. Gezeigt in `ChapterMap` beim Öffnen von Kapitel 50 (nicht
  über einem offenen Bereichsblatt).
- Darstellung: `src/components/AbschlussScene.tsx`, CSS
  `src/theme/expansion/19-abschluss.css`. Dialog mit Titel und
  Beschreibung, Fokus auf „Weiter gärtnern“, Tab bleibt im Fenster, Escape
  und Zurück schließen; Bild als `role="img"` mit Beschreibung; Lichter und
  Glühwürmchen stehen bei „Bewegung reduzieren“ still.
- Speicher: neues Feld `abschlussSeen` (Startwert `false`, in
  `parseExpansion`, übersteht Saisonende/Tiefen Winter/Generation über
  `pickExpansion`). Keine neue `SAVE_VERSION`; der Migrationstest lädt alle
  alten Stände verlustfrei (`ADDED_AFTER_V1`).
- Nach Kapitel 50 steht in Grundstücke, Sammlung und Tiefem Winter statt
  „Weitere Gärten folgen“ ein Abschluss-Satz (`chapterUi.allFound`,
  `chapterUi.lastChapter`).

## Technische Struktur

| Was | Wo |
|---|---|
| Kapitel-Daten (Nummer, Weg, Bereichs-IDs) | `src/game/chapterPlan.ts` (`PLANNED_CHAPTERS`, `RELEASED_UP_TO = 50`), Freischaltung/Skalierung in `src/game/chapters.ts` |
| Spielstand | `parseChapters` füllt fehlende Kapitel auf; Bereichs-IDs sind Speicherformat (nie umbenennen) |
| Texte Bogen I (13–19) | `src/i18n/{de,en}/stringsChapters.ts` |
| Texte Bogen II (20–29) | `src/i18n/{de,en}/stringsChaptersArc2.ts` |
| Texte Bogen III (30–39) | `src/i18n/{de,en}/stringsChaptersArc3.ts` |
| Texte Bogen IV + Finale (40–50) | `src/i18n/{de,en}/stringsChaptersArc4.ts` |
| Pflege-Namen | `src/i18n/{de,en}/careNames.ts` (je Bereich), `chapterCare.names` in `stringsExpansion.ts` (je Kapitel) |
| Bereichsgrafik | `src/theme/art/chapters/<id>.tsx` (5 Stufen × 4 Jahreszeiten), gemeinsame Teile `partsA`–`partsI.tsx`, Einstieg `src/theme/art/kapitel/<id>.ts`, Register `art/registry.tsx`, Nachladen `art/chapterArt.ts` (eigenes Bündel je Kapitel) |
| Gesperrte Ecken | `src/theme/art/chapters/wildD`–`wildI.tsx` |
| Kulissen | `src/theme/chapterArtSpecs.ts` (`BackdropSpec`-Flags), gezeichnet in `art/chapters/backdropArc1`–`4.tsx` und `backdropFinale.tsx` (wächst mit der Kapitel-Stufe) |
| Wege | `src/theme/ChapterPaths.tsx` (eine `PathStyle` je Kapitel) |
| Tierleben | `src/components/ChapterCritters.tsx`, CSS `src/theme/expansion/12-kapitel-tierleben-2.css` (`k2-*` … `k8-*`, eigene Keyframes, `prefers-reduced-motion`) |
| Währungs-Symbole | `IconChapterCurrency` in `src/theme/icons.tsx` |
| E2E | `scripts/e2e/smoke.mjs` Abschnitt 5 (alle Briefe und Karten 13–50, Fotos in `e2e-screens/kapitel/`), 5b (Abschluss-Szene); `axe.mjs` und `screens.mjs` prüfen die Szene in de + en |
| Grafik-Vergleich | `scripts/e2e/art.mjs`, Vergleichsbilder `scripts/e2e/art-baseline/kapitel-<id>.png` |

Umfang: 38 Kapitel × 10 Bereiche = 380 neue Bereiche mit je eigener Grafik
(5 Stufen, 4 Jahreszeiten), Notiz und zwei Pflege-Namen; rund 12 300 Zeilen
Kapitel-Grafik und rund 1 500 Zeilen Kapitel-Texte je Sprache.

## Tests (Stand Welle 8)

- `npx tsc -b`: ohne Fehler. `npm run lint` (oxlint): ohne Befund.
- `npm test` (Vitest): 55 Dateien, 244 Tests grün — darunter Migration
  (alle Fixtures verlustfrei, Kapitel 50 und `abschlussSeen` kommen leer
  dazu), Kapitel-Nummern 2…50, eindeutige Bereichs-IDs und Pflege-Namen,
  Grafik wächst je Stufe (Sommer; die übrigen drei Jahreszeiten für Kapitel 50
  mit einem Wegwerf-Test geprüft), Palette, eindeutige Keyframes, Abschluss-
  Szene nur einmal und übersteht Resets, Spielstand-Größe.
- `npm run build`: grün.
- `npm run e2e`: Smoke de + en (inkl. Abschluss-Szene: Fokus, Tab, Escape,
  gespeichert, nicht noch einmal), Grafik-Vergleich, axe (0 Verstöße de + en,
  auch auf der Abschluss-Szene), Text-Durchsicht en `--strict`.

## Bekannte Schwächen

- **Balance nur simuliert:** Die Taktung (Kapitel 13 im Monat 9–12, danach
  alle 4–6 Wochen, Kapitel 50 nach ~5 Jahren) stammt aus dem Simulator mit
  Ilse als Baumeisterin; echte Spieler sind noch nicht so weit. Der
  Garten-Bonus aller Kapitel (×300 nach 5 Jahren) kann späte Saisons
  verkürzen.
- **Kleine Grafik:** Die Bereichsgrafiken sind 80×72 und auf der Karte klein;
  Details (Figuren, Tiere, Beschriftungen) sind auf dem Handy kaum zu sehen.
  Die Jahreszeit-Wolke jeder Bereichsgrafik liegt bei manchen Karten neben
  dem Schild. Der Horizont liegt teils hinter der Kopfleiste.
- **Gleichförmigkeit:** Viele Kapitel teilen Motive (Feste mit Wimpeln,
  Figuren mit Hut, Tische); zehn Bereiche je Kapitel sind manchmal dünn.
- **Abschluss-Szene:** erscheint erst beim nächsten Öffnen von Kapitel 50,
  wenn Ilse oder ein Gedrückthalten den letzten Bereich anlegt, während der
  Spieler woanders ist; einen Spielernamen kennt das Spiel nicht („Für
  dich“).
- **Entschärft:** Alles, was Gegenlesen gebraucht hätte (Fremdwörter, Grüße in Landessprache, Bräuche und Wissen anderer Völker, prüfbare Zahlen und Jahreszahlen, unsichere Orts-Angaben zu Pflanzen und Tieren), ist durch einfache, sicher wahre Texte ersetzt; Liste in `docs/kapitel/entschaerft.md`. Die Bereichsgrafiken (ohne Text) sind unverändert und zeigen teils noch die alten Motive (z. B. einen kleinen Schrein am Quellhaus auf Bali).
- **Englisch:** von einem Modell übersetzt, im Ton nicht von Muttersprachlern
  gelesen.
- **Barrierefreiheit Kapitel-Karten:** axe prüft Kapitel-Karten bisher nicht mit angelegten Bereichen. Beim Prüfen der Abschluss-Szene fiel auf, dass die Bereichs-Knöpfe einer ausgebauten Kapitel-Karte `label-content-name-mismatch` melden (Name „Komposthaufen, Stufe 10“, sichtbar Name + Zahl). Die Szene wird deshalb allein geprüft; die Karten-Knöpfe sind ein offener Punkt (betrifft alle Kapitel).
- **Leistung:** 50 Kapitel-Bündel werden nachgeladen; auf älteren Geräten
  nicht gemessen.
