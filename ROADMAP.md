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
- Opt-in **Playtest-Log** lokal (Menü → Export JSONL); Standard aus; kein Remote-Tracking.
- Suchtfaktor/Retention aktiv steigern.
- **Engagement-Horizont: ~5-Jahres-Loop** (Run → Soft-Prestige → Season/Deep → Jahr-Ziele → Ära). Soft = Phyto / Tokens. Keine Energy-Walls; Ads nur optional. Design: stacked PRs nach Scaffold.
- Balance playtesten; Multiplayer vorbereiten und bauen.

## Pipeline

1. Abschließen: Upgrade-CTA, Shop/Prestige, Grafik-Sprung, Level/Quests, Ad-Stubs  
2. **Politur-Runde** UI/UX/Grafik + **Retention/Suchtfaktor** erhöhen — **Retention-Loops Vertiefung done** (variable jumps / Zeigarnik / Daily+Comeback / best-buy / Blitz-Events; Soft = **Phyto**)  
3. **Fünf-Jahres-Loop** Scaffold → Season/Deep-Prestige → Jahr-Ziele → Ära (große Balance in Folges-PRs)  
4. **Balance**-Pass (Münzen-Sink-Wellen + Deep-Payout)  
5. **Multiplayer-Architektur** → echtes Clan-Multiplayer  
6. **Tokenhalle** Store-Bundle / eigener Eintrag (Skin liegt bereits im Kern)  
7. Store-IAP verdrahten  
8. Soft-Launch (Analytics-Tool dann wählen)

## Fertig-Produkt?

Noch **nicht**. Soft-Launch-ready erst nach: stabile Upgrade/Shop-Loops, starke Grafik/Politur, Level/Quests, Balance, Multiplayer-MVP oder klarer Solo-Mode, Store-IAP, Privacy/Impressum. Jetzt: starker Prototyp mit hohem Hook-Potenzial.
