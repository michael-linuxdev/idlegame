# Idle-Kern — Roadmap & Produktvermerke

Stand: 2026-11-07.

## Architektur

- **Ein Spielkern**, mehrere **eigene Apps** (gleiche Engine/Loop).
- **App 1 — TurmFarm** (live): Urban Vertical Farm. Offizieller Produktname. Default theme (`src/themes/farm`).
- **App 2 — Tokenhalle**: Retro-Arcade-Kette auf demselben Kern. Theme-Skin unter `src/themes/arcade`; aktivieren mit `VITE_THEME=arcade` / `npm run build:arcade`. Eigener Store-Eintrag später — Bundle-Flag reicht für jetzt.
- **Raus:** Orbit Rack / Space-Datacenter; Brauerei-Theme.

## Prinzipien

- DE-UI; Bau-Map; echtes Idle; keine Energy-Walls; helle, lesbare UI.
- Werbung nur rewarded/optional; Werbefrei-Kauf.
- IAP **nur Stores**. Analytics später.
- Suchtfaktor/Retention aktiv steigern.
- Balance playtesten; Multiplayer vorbereiten und bauen.

## Pipeline

1. Abschließen: Upgrade-CTA, Shop/Prestige, Grafik-Sprung, Level/Quests, Ad-Stubs  
2. **Politur-Runde** UI/UX/Grafik + **Retention/Suchtfaktor** erhöhen  
3. **Balance**-Pass  
4. **Multiplayer-Architektur** → echtes Clan-Multiplayer  
5. **Tokenhalle** Store-Bundle / eigener Eintrag (Skin liegt bereits im Kern)  
6. Store-IAP verdrahten  
7. Soft-Launch (Analytics-Tool dann wählen)

## Fertig-Produkt?

Noch **nicht**. Soft-Launch-ready erst nach: stabile Upgrade/Shop-Loops, starke Grafik/Politur, Level/Quests, Balance, Multiplayer-MVP oder klarer Solo-Mode, Store-IAP, Privacy/Impressum. Jetzt: starker Prototyp mit hohem Hook-Potenzial.
