# Playtest-Log Tester 1: 2026-11-11 09:24 – 2026-11-13 19:48 UTC (Schema 2)

Export `playtest-log-2026-11-13T19-48-48.jsonl` (3601 Zeilen, 260 KB): Kopf + 5 Tages-Zusammenfassungen
+ 3595 Roh-Ereignisse ab 11-09 16:00. Überschneidet sich mit dem Export vom 2026-11-11 09:24; neu sind
624 Roh-Ereignisse. App-Stand beim Export: `2026-11-13 · 43ba2f2` (die Änderungen aus #144 waren im
ausgewerteten Zeitraum noch nicht aktiv – gespielt wurde auf `c376ce4`).

## Kurzbild
| Tag | Sitzungen | Spielzeit | Ausbauten | Saisonenden | Stufe |
|---|---|---|---|---|---|
| 11-09 | 2 | 183 min | 4404 | 9 | 22 |
| 11-10 | 9 | 322 min | 13749 | 15 | 36 |
| 11-11 | 11 | 114 min | 7964 | 7 | 40 |
| 11-12 | 2 | 19 min | 2376 | 3 | 40 |
| 11-13 | 6 | 16 min | 1720 | 1 | 40 |

## Was die Änderungen vom 2026-11-11 gebracht haben
- **Langzeit-Archiv funktioniert:** 3249 der 3595 Roh-Ereignisse kommen aus dem Archiv, der Export
  reicht lückenlos bis 11-09 16:00 zurück (vorher: Obergrenze 3000 ≈ 2 Tage).
- **Offline-Zettel seltener:** 23 Zettel in 2,4 Tagen (vorher 61 in knapp einem Tag), Median 37 min
  Abwesenheit. Der einzige unter 5 min (2,6 min, 11-11 09:42) lief noch auf dem alten Stand.
- **Herausforderung:** kein Hin-und-her-Schalten mehr; `challengeDone: ohneGiessen` steht im
  `prestige`-Ereignis (11-11 12:46). Danach wurde aber **keine** Herausforderung mehr gewählt.
- **Kein Fehler**, tägliche Sicherung ok (29 KB), Daily-Serie 5, `version` steht in `session_start`.
- Gartenwechsel 61 (davon 4 < 2 s) statt 225; Werbe-Ernte 21×, nur 3× im Abstand < 5 min.

## Befunde
1. **Plateau ab Tag 3: Spielzeit bricht ein (322 → 114 → 19 → 16 min).** Zwei Dinge fallen zusammen:
   - **Stufe 40 ist die Obergrenze** (`MAX_PLAYER_LEVEL`, `progression.ts`) und wurde am 11-11 13:10
     erreicht – nach 2 Tagen. Seitdem gibt es keinen Stufenaufstieg und keine Stufen-Belohnung mehr.
   - **Tiefer Winter 2 ist durch die Ruhezeit gesperrt** (3 Tage ab 11-10 11:10, `DEEP_REST_MS`).
     In der Wartezeit gibt es nur „noch ein Saisonende“. Kapitel 3 (Weinberg) braucht eine
     Generation, liegt also noch weiter weg; die Obstwiese bekam in 3 Tagen nur ~150 Ausbauten.

   War offen (Balance-Entscheidung): Stufen über 40 hinaus bzw. Stufen langsamer, und/oder in der
   Ruhezeit ein eigenes Ziel. Nach der Ruhezeit-Regel wäre der zweite Tiefe Winter seit 11-13
   ~11 Uhr möglich gewesen; um 18:55 gab es stattdessen ein normales Saisonende.
   → **Umgesetzt (2026-11-14), alle drei Hebel** (Zahlen: `docs/kapitel/balance-bericht.md`
   „Plateau ab Tag 3“): Gärtnerstufe bis 100 mit Samen alle 5 Stufen (Kurve bis 40 unverändert;
   wer schon bei 40 stand, steigt mit den weiter gesammelten EP sofort auf), Ruhezeit nach dem
   1./2. Tiefen Winter 1/2 Tage statt 3, und der Wintervorrat (ein Sprössling je Saisonende in
   der Ruhezeit, höchstens 6). Das `prestige`-Ereignis schreibt `vorrat` mit; ob er Saisonenden
   in der Ruhezeit auslöst, zeigt das nächste Log.
2. **Saison-Karten werden seit dem 11-10 abends immer übersprungen:** 13× „keine“ in Folge (ab
   11-10 20:55), davor wurde fast immer eine Karte gewählt (17 von 19). Fällt zeitlich mit
   „Saison-Karten: Ausbau statt Ertrag“ (#139) zusammen. → Offen; die neuen Karten wirken
   offenbar nicht lohnend oder sind schwerer einzuschätzen.
3. **Karten-Knopf → Saison-Tab → sofort zurück – auch hier.** 7× `map_cta`, 6× nach 2–5 s ohne
   Aktion wieder draußen. Dasselbe Muster wie bei Testerin 2; der Sprung zur Truhe (#144) sollte
   das beheben, das nächste Log zeigt es über `mode`.
4. **Kurz-Saisons lohnen sich:** 11-12 drei Saisonenden in 12 min (17:30, 17:36, 17:42) mit 3460,
   1159 und 933 Erbstücken – nach der Nacht-Ernte reichen 6 min für rund ein Drittel der Auszahlung
   eines ganzen Tages. → Offen; prüfen, ob das gewollt ist.
5. **Einzelkauf-Grind bleibt:** Median 31 Ausbauten/min, Spitze 412/min, 26 Minuten mit > 150.
   `best_buy_tap` 0×. (Offener Punkt seit 2026-11-08.)
   → **Umgesetzt (2026-11-14), ohne neue Knöpfe** („×5“/„Max“ bleiben raus): Gedrückthalten
   beschleunigt – erst einzeln, nach 1,5 s zwei, nach 3 s fünf Stufen je Schritt
   (`game/holdBuy.ts`, Hauptgarten und Kapitel). 4 s Halten: 88 statt ≈ 34 Stufen. Omas Hinweis
   „Gedrückt halten baut weiter …“ ab Stufe 10. Neues Log-Ereignis `hold_buy` (Stufen, Dauer).
6. **Festladen in Serie:** 17 Käufe in ~25 s (10× Kapitel-Ernte, 7× Erbstücke, 11-12 08:55).
   Mehrfachkauf im Festladen bleibt offen (Punkt 5 aus 2026-11-11).
7. **Viele Kurzbesuche:** 30 Besuche, 12 davon unter 40 s – nachsehen, einsammeln, schließen.
   Passt zu 1: Es gibt beim Reinschauen nichts zu entscheiden.

## Vergleich mit Testerin 2
| | Tester 1 | Testerin 2 |
|---|---|---|
| Spielzeit 5 Tage | 654 min | 67 min |
| Saisonenden | 35 | 4 |
| Stand | Stufe 40 (Obergrenze), 1 Tiefer Winter, Kapitel 1 | Stufe 14, kein Tiefer Winter |
| Bremse | wartet auf Ruhezeit, nichts Neues | versteht Truhe/Saisonende nicht |
| Werbung | Werbefrei gekauft | schaut jede Werbung zu Ende |

Beide verlieren ab Tag 3–4 Spielzeit, aus entgegengesetzten Gründen: zu schnell durch bzw. noch
nicht drin.

## Rückmeldung Tester 1 (2026-11-13) → Umsetzung
- **Tiefer Winter 2: „nicht gesehen“.** Dass der Tiefe Winter möglich ist, stand nur ganz unten im
  Saison-Tab (nach Saisonende, Jonas und Truhe); auf der Karte gab es nur den einmaligen Hinweis
  beim allerersten Mal. → **Umgesetzt:** Sobald Gartenjahr und Ruhezeit passen, steht in der
  Ereignis-Leiste die Pille „Tiefer Winter möglich“. Sie öffnet den Saison-Tab direkt beim
  Abschnitt „Tiefer Winter“ (`EventPills` `onOpenDeep`, `tab_open` mit `from: map_pill`,
  `mode: deep`). Sie löst nichts aus – der Knopf mit Bestätigung bleibt, wo er ist.
- **Saison-Karten: „Wirkung schwer einzuschätzen, keine Lust auf Commitment“.** Bestätigt Befund 2.
  War offen (Design-Entscheidung). Die Karte verlangt drei Abwägungen auf einmal (welcher Bereich
  billiger, welcher teurer, wie viel spart das) und gilt eine ganze Saison ohne Rückweg.
  → **Umgesetzt (2026-11-14):** Bereichs-Karten ohne Gegenspieler (nur der eigene Bereich −30 %
  statt −40 %/+25 %), Omas Tipp markiert die Karte, die mit dem letzten Garten am meisten gebracht
  hätte, die Vorschau nennt Ernte statt Prozent („≈ 1,15 Mrd Ernte gespart“), und in den ersten
  5 Minuten lässt sich das Thema einmal wechseln (Pille auf der Karte, Knopf im Saison-Tab).
  `season_card` schreibt `tip` und `switched` mit.

