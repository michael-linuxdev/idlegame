# Was kommt nach Kapitel 50?

Stand 2026-11-09. Ausgangslage: `docs/kapitel/abschluss-bericht.md`,
Taktung `docs/kapitel/balance-bericht.md` (Runde 3: Regular erreicht
Kapitel 50 nach ~4,9 Jahren, Casual nach über 5 Jahren).

## Die Lage nach dem Schluss

Wer Kapitel 50 angelegt hat, hat die Abschluss-Szene auf Omas Bank gesehen
(`abschlussSeen`), alle 49 Grundstücke offen und Omas Dose ist leer. Was dann
noch läuft:

- **Hauptgarten:** Saisonende, Tiefer Winter, Generationen (Vermächtnis ohne
  Obergrenze) — der Kreislauf geht weiter, aber ohne neues Ziel, nur mit
  größeren Zahlen.
- **Kapitel:** Ilse und der Spieler bauen weiter aus; jede Stufe gibt etwas
  Garten-Bonus. Es gibt aber kein „fertig“ mehr, das man ansteuern kann.
- **Sammlungen** (Pflanzenbuch, Bewohner, Kreuzungen, Herausforderungen,
  Erfolge) sind nach fünf Jahren meist voll. Das Jahreszeiten-Album läuft je
  Saison neu, die **Feste** kommen nach echtem Kalender jedes Jahr wieder.
- **Großprojekte:** alle acht sind nach fünf Jahren gebaut.

Spieler, die alle Kapitel offen haben, brauchen also **ein Ziel, das man
sieht, das langsam wächst und das auf dem aufbaut, was sie schon haben**. Es
darf die Taktung der Kapitel 13–50 (Ruhezeit nach dem Tiefen Winter,
Generations-Fortschritt) nicht verändern und keinen Spielstand gefährden.

## Ideen

Bewertung: Aufwand (eine Nacht = klein), Wirkung auf die Zeit nach Kapitel 50,
Risiko für Balance und Spielstand.

| # | Idee | Aufwand | Wirkung | Risiko Balance | Risiko Spielstand |
|---|---|---|---|---|---|
| 1 | **Kapitel-Meisterschaft** — drei Sterne je Kapitel: alle zehn Bereiche ausgebaut bzw. gepflegt, je Stern ein kleiner Bonus im Kapitel | **klein** (Regel aus vorhandenen Stufen und Pflege, Anzeige in Sammlung und Kapitel-Karte) | **hoch**: 147 Sterne über 49 Kapitel, jedes Kapitel wird wieder ein Ziel und ein Grund für einen Besuch; wirkt auch für die Tester schon in Kapitel 2 | gering: Bonus nur in der Kapitel-Währung, gedeckelt, keine Wirkung auf die Freischaltung (gemessen) | **keins**: kein neues Feld, Sterne folgen aus `chapters[id].owned` und `.care` (werden nie zurückgesetzt) |
| 2 | **Sammlung vervollständigen** — neue Sorten, Bewohner und Kreuzungen aus den Kapiteln 13–50 | mittel–groß: neue Inhalte, Grafik, Texte de + en | mittel: einmaliges Sammeln, danach wieder voll | mittel: +2 % je Pflanzenbuch-Set stapelt mit | gering (Listen mit Startwert) |
| 3 | **Omas Dose füllen** — eigene Tütchen an die Briefpartner zurückschicken, jede Rücksendung bringt eine kurze Antwortkarte | groß: 38 Antwortkarten in zwei Sprachen, Leitlinie „nichts, was Gegenlesen braucht“ gilt für jede | **hoch** (erzählerisch): schließt den Bogen „die Dose ist leer“ → „die Dose füllt sich wieder“ | gering (Belohnung kosmetisch oder Samen in kleinen Mengen) | gering: ein neues Feld (gesendete Tütchen) mit Startwert |
| 4 | **Wiederkehrende Feste ausbauen** — Fest-Jahrgänge (jedes Jahr ein neues Abzeichen je Fest) | mittel | mittel: Feste laufen schon jährlich; Jahrgänge geben nur eine Zahl dazu | mittel: Fest-Belohnungen sind Samen und Festschub | gering |
| 5 | **Generationen-Ziele** — Stammbaum-Stufen bei Generation 30 / 40 / 50 mit Familienfoto oder Titel | klein–mittel | mittel: Generationen laufen ohnehin weiter | **hoch**, sobald es Werte gibt: der Generations-Fortschritt taktet die Kapitel-Freischaltung → nur kosmetisch vertretbar | gering |
| 6 | **Familien-Chronik** — Tagebuch, wann welches Kapitel, welche Generation, welcher Stern kam | mittel | mittel (Erinnerung, Teilen) | keins | mittel: braucht Zeitstempel, die alte Stände rückwirkend nicht haben (nur `openedAt`); wächst mit dem Spielstand |

## Empfehlung

**Zuerst die Kapitel-Meisterschaft (umgesetzt), danach „Omas Dose füllen“
darauf aufbauen.**

Begründung:

1. **Trägt lange bei kleinstem Aufwand.** 49 Kapitel × 3 Sterne. Der erste
   Stern kommt mit dem Ausbau (Ilse hilft), der zweite und dritte nur über
   die Kapitel-Pflege, die der Spieler selbst kauft — eine Runde durch alle
   Gärten, die man sich einteilen kann, statt einer Zahl, die von allein
   wächst.
2. **Spielstand-sicher.** Die Sterne werden aus den Kapitel-Stufen und der
   Kapitel-Pflege berechnet, nicht gespeichert. Alte Stände (auch die der zwei Tester)
   bekommen ihre Sterne sofort; kein Feld, keine `SAVE_VERSION`, nichts kann
   verloren gehen oder auseinanderlaufen.
3. **Balance-sicher.** Der Bonus wirkt nur auf die Währung des eigenen
   Kapitels und erst, wenn **alle** zehn Bereiche Stufe 100 haben — also lange
   nachdem der letzte Bereich gepflanzt und das nächste Kapitel schon offen
   ist. Die Freischaltung hängt am Generations-Fortschritt und am
   *Pflanzen* des letzten Bereichs, nicht an Stufen. Messung unten.
4. **Kein Gegenlesen nötig.** Neue Texte sind nur Spielregel-Sätze
   („Erster Stern, wenn jeder Bereich eines Kapitels Stufe 100 hat …“), keine Orte,
   Bräuche oder Sachbehauptungen.
5. **Lenkt den Blick auf vergessene Bereiche.** Ilse kauft immer den
   besten Ertrag je Kosten und pflegt nie; der schwächste Bereich eines
   Kapitels bleibt oft zurück. Die Meisterschaft gibt einen Grund, ihn
   gezielt hochzuziehen und zu pflegen.

**Erste Fassung verworfen (Simulator):** Sterne bei Stufe 25 / 50 / 100
aller Bereiche. Gemessen (`MASTERY=1`, nur Ilse baut): Kapitel-Stufen laufen
schnell auf ein gemeinsames Niveau, das für **alle** Kapitel gleich ist, weil
Kosten und Ertrag je Kapitel gleich skaliert sind (`laterScale`): Regular
nach 5 Jahren schwächster Bereich in jedem Kapitel 182–185, Casual 156–181,
Dauerspieler nach einem Jahr 105–137. Ab Kapitel 13 hatte ein Kapitel alle
drei Sterne 1–5 Tage nach dem Öffnen. Eine höhere Stufen-Schwelle (z. B. 200)
wäre ein globaler Zähler, den alle Kapitel in derselben Woche erreichen —
kein Ziel je Kapitel. Darum zählt jetzt nur der erste Stern Stufen, die
beiden anderen die Pflege.

„Omas Dose füllen“ ist erzählerisch der stärkere Abschluss, braucht aber
38 Antwortkarten in zwei Sprachen und ist darum kein Nachtschritt. Es lässt
sich an die Meisterschaft koppeln: **der dritte Meister-Stern eines Kapitels
schaltet das Tütchen für den Briefpartner frei** — dann ist die Meisterschaft
die Mechanik und die Dose die Geschichte dazu.

## Umgesetzt: Kapitel-Meisterschaft (Schritt 1)

**Spielregel**

- Drei Sterne je Kapitel, es zählt immer der schwächste Bereich:
  - **★ Ausbau:** jeder der zehn Bereiche hat Stufe 100 (dritter Meilenstein).
  - **★★ Pflege:** jeder Bereich hat in beiden Pflege-Arten („Wachsen“ und
    „Sparen“, je Kapitel eigene Namen) mindestens Rang 5.
  - **★★★ Meister:** jeder Bereich ist voll gepflegt (beide Ränge 10).
- Die Sterne kommen der Reihe nach. Jeder Stern: **+5 % Ertrag in diesem
  Kapitel** (Kapitel-Währung), höchstens **+15 %**. Kein Garten-Bonus, keine
  Samen.
- Gilt für alle 49 Kapitel (2–50) → höchstens 147 Sterne.
- Aufwand je Kapitel für ★★★: 200 Pflege-Ränge. Früh (Kapitel 2–4 der
  Tester) ist das eine echte Investition in Kapitel-Währung (alle 20 Ränge
  eines Bereichs kosten zusammen rund das 3 200-Fache seiner Grundkosten),
  spät fast nur noch Tippen (eine einzige Stufe auf dem gemeinsamen Niveau
  um 180 kostet weit mehr).

**Anzeige**

- **Kapitel-Karte:** in der Kopfleiste neben „+x % Ernte im Garten“ drei
  Sterne (gefüllt/leer), sobald das Kapitel vollständig angelegt ist. Wird
  während des Spielens ein Stern erreicht, kommt ein kurzer Hinweis
  („Kapitel-Meisterschaft: 1. Stern! Jetzt +5 % Ertrag in diesem Kapitel“).
  Das Bereichsblatt rechnet den Bonus in den angezeigten Ertrag ein.
- **Sammlung & Ziele → Omas Grundstücke:** Summe („3 von 147
  Meister-Sternen“), die Regel in einem Satz und je offenem Kapitel die
  Sterne plus der Weg zum nächsten („7 von 10 Bereichen auf Stufe 100“,
  „3 von 10 Bereichen gepflegt bis Rang 5“).
  Die Sammlungs-Prozentzahl bleibt unverändert (Meisterschaft zählt nicht
  hinein, damit niemand nach dem Update „weniger gesammelt“ hat).
- Barrierefrei: Sterne als `role="img"` mit Text („Kapitel-Meisterschaft:
  1 von 3 Sternen“), Hinweis über die vorhandene `role="status"`-Meldung.

**Technik**

| Was | Wo |
|---|---|
| Regel, Bonus, Fortschritt | `src/game/mastery.ts` (`MASTERY_STEPS`, `MASTERY_BONUS`, `masteryStars`, `masteryProgress`, `totalMasteryStars`) |
| Bonus im Ertrag | `chapterPerSecond` in `src/game/state/chapters.ts` (wirkt online, offline und bei der Weinlese) |
| Anzeige | `src/components/MasteryStars.tsx`, `ChapterMap.tsx` (Kopfleiste, Hinweis), `CollectionSheet.tsx`; CSS `src/theme/expansion/20-meisterschaft.css` |
| Texte | `mastery` in `src/i18n/{de,en}/strings.ts` |
| Tests | `src/test/mastery.test.ts` (Sterne, schwächster Bereich und schwächste Pflege-Art, Pflege kaufen bringt den Stern, Deckel, nur eigenes Kapitel, alter Stand v1 behält Stufen, Pflege und Sterne), E2E `scripts/e2e/smoke.mjs` Abschnitt 5c (Stern beim Ausbau, Hinweis, Kopfleiste, Sammlung; de + en) |
| Simulator | `MASTERY=1` druckt je Kapitel den schwächsten Bereich und den Tag jedes Sterns, `MASTERY_PER_STAR=0` schaltet den Bonus zum Vergleich ab |

**Spielstand:** kein neues Feld, keine `SAVE_VERSION`. Die Sterne sind eine
reine Funktion der gespeicherten Kapitel-Stufen und -Pflege; `migration.test.ts` vermerkt
das bei `ADDED_AFTER_V1`.

### Balance

Messung mit `scripts/balance` (5 Jahre Regular, nur Ilse baut Kapitel,
Großprojekte gebaut; erste Fassung mit dem Bonus schon ab Stufe 25/50/100,
also **mehr** Bonus und früher als die jetzige Regel — eine obere Schranke):

```bash
MASTERY=1 GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 npm run balance -- regular 43800
MASTERY_PER_STAR=0 MASTERY=1 GEN=1 CHAPTERS=1 CHAPTER_MANUAL=0 SUMMARY=1 npm run balance -- regular 43800
```

| Regular, 5 Jahre | K13 | K30 | K50 | Kapitel-Stufen | Garten-Bonus |
|---|---|---|---|---|---|
| ohne Meisterschafts-Bonus | Tag 308 | Tag 837 | Tag 1778 | 117 217 | ×300,1 |
| mit +5 %/Stern (alle 147 Sterne früh) | Tag 313 | Tag 841 | Tag 1785 | 117 758 | ×301,6 |

- **Kein Tempo-Gewinn:** Die Kapitel kommen mit Bonus nicht früher (die
  Abweichung von wenigen Tagen ist Rauschen: der Verlauf weicht früh leicht
  ab, am Ende stehen zwei Tiefe Winter weniger). Die Freischaltung hängt am
  Generations-Fortschritt und am Pflanzen des letzten Bereichs; der Bonus
  wirkt erst, wenn alle Bereiche weit darüber sind.
- **Garten:** +0,5 % Kapitel-Stufen und +0,5 % Garten-Bonus — +15 % Ertrag
  bringen bei Kostenwachstum 1,11–1,15 je Stufe nur etwa eine Stufe je
  Bereich mehr.
- **Erster Stern (Stufe 100) im Spiel:** Kapitel 2 bei Regular etwa
  10 Wochen nach dem Öffnen, Kapitel 12 nach einer Woche, ab Kapitel 13
  nach 1–5 Tagen. Der Simulator kauft keine Pflege, Stern 2 und 3 kommen
  dort nicht vor; sie hängen allein am Spieler.
- **Werte unverändert:** `LATER_RULE`, `laterScale`, `LATER_GARDEN_BONUS`,
  Projekt-Boni und Pflege-Kosten bleiben, wie sie sind.

## Nächste Schritte

1. **Omas Dose füllen** (Schritt 2): Der dritte Meister-Stern eines Kapitels
   gibt ein Tütchen „zurück an …“; Versand in der Kapitel-Karte, Antwortkarte
   (2–3 Sätze, nach der Leitlinie „nichts, was Gegenlesen braucht“) im Notizbuch. Neues Feld
   `dosenTuetchen: ChapterId[]` mit Startwert `[]` in `parseExpansion`,
   Eintrag in `ADDED_AFTER_V1`. Belohnung kosmetisch (Tütchen-Deko im Garten).
2. **Meisterschaft im Tiefen Winter und in den Grundstücken** zeigen (kleine
   Sterne an den Grundstücks-Knöpfen), wenn die Tester sie finden und nutzen.
3. **Familien-Chronik light:** nur ab jetzt neue Ereignisse (Kapitel offen,
   Stern, Generation) mit Datum; alte Stände starten leer, kein Rückrechnen.
4. **Pflege mehrfach kaufen** (×5 / bis voll), falls die Tester das Tippen
   für ★★★ stört — reine Bedienung, keine neuen Werte.
5. **Playtest-Log** um ein Ereignis „Meister-Stern“ ergänzen, sobald echte
   Spieler so weit sind; dann prüfen, ob +5 % je Stern spürbar genug ist
   (Stellschraube `MASTERY_BONUS.perStar`, Simulator `MASTERY_PER_STAR`).
