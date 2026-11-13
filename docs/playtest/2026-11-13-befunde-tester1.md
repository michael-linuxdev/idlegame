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

   → Offen (Balance-Entscheidung): Stufen über 40 hinaus bzw. Stufen langsamer, und/oder in der
   Ruhezeit ein eigenes Ziel. Nach der Ruhezeit-Regel wäre der zweite Tiefe Winter seit 11-13
   ~11 Uhr möglich gewesen; um 18:55 gab es stattdessen ein normales Saisonende.
2. **Saison-Karten werden seit dem 11-10 abends immer übersprungen:** 14× „keine“ in Folge (ab
   11-10 20:55), davor wurde fast immer eine Karte gewählt (18 von 20). Fällt zeitlich mit
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
