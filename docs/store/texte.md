# Store-Texte (de + en) — Stand nach Kapitel 50

Ergänzt `listing.md` / `listing.en.md` um die 50 Kapitel. Begriffe nach
`docs/i18n/glossar.md`. **Ehrlich bleiben:** nur nennen, was das Spiel heute
kann. Nicht versprechen: echten Mehrspieler-Verein (der Kleingartenverein ist
noch lokal), Online-Wettbewerbe, Cloud-Speicher, regelmäßige Updates mit
festem Takt.

Vor dem Einreichen: Markenrecherche („Gartenerbe“, „Heirloom Garden“),
`DISTRIBUTION = 'store'` und `TEST_PHASE = false` in
`src/game/distribution.ts`, Echtgeld-Angebote erst mit Store-Anbindung
(`STORE_ENABLED` in `src/game/monetization.ts`, Preise in `preise.md`). Bis
dahin den Satz zu Käufen so lassen, wie er unten steht („optional“), und in
den Store-Angaben „enthält In-App-Käufe“ erst setzen, wenn es sie gibt.

---

## Deutsch

### Kurzbeschreibung (Google Play, max. 80 Zeichen)

Erbe Omas Schrebergarten und folge ihren Samen um die Welt. Wächst auch offline.

*(80 Zeichen)*

### Lange Beschreibung

Oma hat dir ihren Schrebergarten vererbt. Er ist ziemlich verwildert, aber unter den Brombeeren steckt gute Erde. Und in der Laube liegt ihr Notizbuch.

Roden, anlegen, ausbauen: Aus einem einzigen Gemüsebeet wird Schritt für Schritt ein Gartenpark mit Kräuterspirale, Obstwiese, Bienenstock, Hühnerstall, Gewächshaus, Hofladen und Omas Traum, einer eigenen Orangerie. Dein Garten wächst auch, wenn du nicht da bist.

Später führt dich die Geschichte weiter: Unter Omas Gedenkbeet findet die Familie eine alte Blechdose voller Samentütchen, jedes mit einer Adresse beschriftet. Ihnen folgst du durch 50 Kapitel, vom Hinterhof in der Stadt über Gärten in ganz Europa bis dorthin, wo Omas Pflanzen herkommen, und zu den Gärten von morgen. Jedes Kapitel ist eine eigene Karte mit zehn Bereichen, einem Brief und einer eigenen Landschaft. Am Ende geht es zurück an den Anfang.

Gärtnern im eigenen Tempo: ein paar Minuten am Tag genügen. Keine Energie-Sperren, kein Konto, kein Tracking. Dein Spielstand bleibt auf deinem Gerät.

### Feature-Punkte (5)

1. **Ein Garten, der sichtbar wächst:** zehn Bereiche mit je fünf Ausbaustufen, Wildnis, die Ecke für Ecke verschwindet, Tages- und Jahreszeiten.
2. **50 Kapitel, eine Geschichte:** Omas Saatgutdose führt von der Gartenschau quer durch Europa und um die Welt bis zurück in Omas Schrebergarten.
3. **Briefe statt Pop-ups:** Oma, Jonas, Ilse und Briefpartner aus aller Welt schreiben dir; zu jedem Beet gibt es eine Notiz.
4. **Echtes Idle:** Der Garten und alle Kapitel wachsen offline weiter; Saisonende, Tiefer Winter und Generationen machen jedes Gartenjahr reicher.
5. **Fair und ruhig:** keine Energie-Sperren, kein Zeitdruck, Werbung nur freiwillig gegen Belohnung, Käufe optional. Auf Deutsch und Englisch.

### Stichworte (App Store, max. 100 Zeichen)

garten,idle,schrebergarten,oma,saatgut,gemüse,aufbau,entspannung,offline,briefe,kleingarten,tycoon

*(98 Zeichen)*

---

## English

### Short description (Google Play, max. 80 characters)

Inherit Grandma’s allotment, follow her seeds around the world. Grows offline.

*(78 characters)*

### Long description

Grandma has left you her allotment garden. It’s rather overgrown, but under the brambles there’s good soil. And her notebook is waiting in the arbour.

Clear, plant, upgrade: step by step, a single vegetable patch becomes a garden park with a herb spiral, fruit trees, a beehive, a chicken coop, a greenhouse, a farm shop and Grandma’s dream, an orangery of your own. Your garden keeps growing while you’re away.

Later the story takes you further: under Grandma’s memorial bed the family finds an old seed tin full of packets, each one labeled with an address. You follow them through 50 chapters, from a city backyard through gardens all over Europe to the origins of the plants in Grandma’s beds and on to the gardens of tomorrow. Every chapter is its own map with ten areas, a letter and a landscape of its own. And in the end, it all comes back to the beginning.

Garden at your own pace: a few minutes a day are enough. No energy walls, no account, no tracking. Your save stays on your device.

### Feature bullets (5)

1. **A garden you can watch grow:** ten areas with five upgrade stages each, wilderness that disappears corner by corner, times of day and seasons.
2. **50 chapters, one story:** Grandma’s seed tin leads from the garden show across Europe and around the world, and back to Grandma’s allotment.
3. **Letters, not pop-ups:** Grandma, Jonas, Ilse and pen friends from all over the world write to you; every bed has a note.
4. **True idle:** your garden and all chapters keep growing offline; Season’s End, Deep Winter and generations make every garden year richer.
5. **Fair and calm:** no energy walls, no time pressure, ads only if you choose them for a reward, purchases optional. In English and German.

### Keywords (App Store, max. 100 characters)

garden,idle,allotment,grandma,seeds,vegetables,relaxing,offline,letters,cozy,tycoon,heirloom

*(92 characters)*

---

## Prüfliste vor dem Einreichen

- Zeichen nachzählen (Store-Konsole zählt mit; „’“ zählt als ein Zeichen).
- Englische Begriffe gegen das Glossar: *Season’s End*, *Deep Winter*, *Heirlooms*, *Grandma’s Notebook*.
- „Kein Tracking“ stimmt nur, solange der Playtest-Log lokal und abwählbar bleibt und kein Analytics-Dienst eingebaut ist.
- „Werbung nur freiwillig“: heute eine Attrappe ohne Werbe-SDK. Wird ein echtes SDK eingebaut, Datenschutzangaben anpassen.
- Screenshots: mindestens ein Kapitel aus Bogen II–IV und Omas Brief zeigen (Bilder in `e2e-screens/kapitel/` als Vorlage).
