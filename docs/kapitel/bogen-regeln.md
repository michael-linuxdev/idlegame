# Bogen-Regeln der Kapitel 13–49 (Runde 4, Paket 4)

Stand 2026-11-10. Bisher spielten sich die Kapitel 13–50 alle gleich; eine
eigene Regel hatte nur der Weinberg (Weinlese). Jetzt hat jeder Bogen eine
Entscheidung mit Preis. Kapitel 2–12 und 50 bleiben unverändert.

| Bogen | Kapitel | Regel | Werte (`src/game/arcRules.ts`) |
|---|---|---|---|
| I | 13–19 | **Patenbeet:** ein Bereich wird Patenbeet; die Bereiche direkt davor und danach (im Layout) tragen mehr, er selbst nicht | Nachbarn ×1,5 |
| II | 20–29 | **Tauschpost:** ein Weg für das Kapitel — mehr Ertrag, günstiger ausbauen oder günstiger pflegen | Ertrag ×1,12 · Ausbau −20 % (ab Stufe 1; Anlegen gleich teuer) · Pflege −35 % |
| III | 30–39 | **Wasser verteilen:** 6 Wasserpunkte auf die Bereiche, höchstens 2 je Bereich | je Punkt +10 % für den Bereich |
| IV | 40–49 | **Plan für morgen:** Ertrag jetzt (beim Spielen) oder während du weg bist | heute ×1,15 · morgen ×1,25 offline |

**Rahmen:** Ohne Wahl ist der Ertrag exakt wie vorher (alte Stände: Feld
`bogenWahl`, Startwert `{}`). Jede Regel wirkt nur nach oben, gedeckelt auf
**+25 %** Ertrag in der Kapitel-Währung (`ARC_RULE_CAP`); kein Garten-Bonus,
keine Samen, keine Wirkung auf die Freischaltung (Anlegen wird nie billiger).
Wirkung über `chapterPerSecond` (online, offline, Simulator; nur Bogen IV
unterscheidet `away`). Jederzeit änderbar, kein Tipp-Takt, kein Timer. Ilse
entscheidet nie; ist eine Wahl offen, zeigt die Pille oben „Wahl offen“ und
Omas Hinweis erklärt die Regel einmal je Bogen.

**Anzeige:** Pille in der Kapitel-Kopfleiste (Name der Regel, Wirkung jetzt),
Fenster mit der Regel in einem Satz, den Möglichkeiten und ihrer Wirkung mit
diesem Kapitel; Bereichsblatt rechnet den Faktor des Bereichs ein, die
Pflege-Preise den Tauschpost-Rabatt.

**Grafik:** keine neuen Motive, nur vorhandene Bausteine (Pille, Fenster);
Vergleichsbilder unverändert.

**Tests:** `src/test/arcRules.test.ts` (je Bogen neutraler Start für alle
Fixtures, Deckel, Wahl ändern, offline = online bzw. Bogen IV mit seinem
Faktor, keine Wirkung auf Garten-Bonus/Samen/Freischaltung, Kosten bei
Tauschpost, Laden), E2E `scripts/e2e/smoke.mjs` Abschnitt 16 (de + en,
Screenshots `e2e-screens/bogen-*.png`), axe auf dem Fenster.
