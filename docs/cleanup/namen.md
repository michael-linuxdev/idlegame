# Namens-Wörterbuch (Aufräum-Runde 2026-11-09)

Alte interne Namen aus den Vorgänger-Prototypen (TurmFarm, Orbit Rack / Orbital Claim, Ash Dominion) → neue Namen.

## Regel (einheitlich)

1. **Gespeicherte Felder** (`GameState`) heißen nach dem **Spielbegriff** aus `ROADMAP.md` „Begriffe“, auf Deutsch ohne Umlaute, in camelCase: `ernte`, `erbstuecke`, `samen`, `sproesslinge`, `truhe`, `saisonenden`, `tiefeWinter`, `gartenwoche…`, `erntefest…`, `verein…`. Technische Endungen (`…Key`, `…Day`, `…ExpiresAt`, `…Mult`, `…Xp`) bleiben englisch, so wie in den neueren Feldern (`helperLevel`, `decorOwned`, `waterRefillDay`).
2. **Gegenstände eines Ladens** heißen wie im Spiel (`gartenschere`, `alteGiesskanne` …). Die Namen stimmen mit den bisherigen `LOG_NAMES` des Playtest-Logs überein, so dass Log und Spielstand dieselben Wörter benutzen.
3. **Code-Englisch bleibt**, wo es Fachbegriff des Genres oder allgemeines Programmier-Englisch ist: `prestige` (als Verb/Mechanik, z. B. `doPrestige`, `createPostPrestigeState`), `helper`, `decor`, `quest`, `clan` (Tab-ID/FTUE-Schritt), `shop`, `flash`, `branch`, `compute…` als Verb (`computeBestBuy`, `computeNextGoal`). Entfernt werden nur Namen, die aus einem **früheren Spiel** stammen oder einen **falschen Spielbegriff** nennen (Ash, Ember, Obsidian, Compute als Währung, Credits, Münzen, Phyto, Fortress, Bandwidth Surge, Uptime, Rack …).
4. Namen in `src/theme/strings.ts` (Text-Schlüssel) folgen denselben Regeln; die **Texte selbst** ändern sich nicht.

Begründung: Die Währungen (`ernte`, `erbstuecke`, `samen`, `sproesslinge`, `vermaechtnis`) sind schon deutsch; die übrigen Felder an dieselbe Sprache anzugleichen, macht Spielstand, Playtest-Log und Texte deckungsgleich. Eine vollständige Eindeutschung aller Bezeichner (z. B. `helperLevel` → `jonasStufe`) würde viel ändern, ohne einen Altnamen zu beseitigen, und die englische Fassung (nächste Runde) übersetzt ohnehin nur Texte, keine Bezeichner.

## Speicherschlüssel

| alt | neu |
|---|---|
| `gartenerbe-save-v1` (Spielstand) | `gartenerbe-spielstand-v1` — `SAVE_VERSION = 1`, `MIGRATIONS = {}` |

Der alte Schlüssel wird nicht gelöscht und nicht gelesen. Andere Schlüssel (Notizbuch, Extras, FTUE, Hinweise, Playtest-Log) enthalten keine Altnamen und bleiben unverändert.

## Gespeicherte Felder (`GameState`)

| alt | neu | Spielbegriff |
|---|---|---|
| `emberUpgrades` | `truhe` | Omas Truhe |
| `emberUpgrades.dominionYield` | `truhe.gartenschere` | Omas Gartenschere |
| `emberUpgrades.longWatch` | `truhe.alteGiesskanne` | Alte Gießkanne |
| `emberUpgrades.foundryDiscount` | `truhe.saatgutkiste` | Saatgutkiste |
| `emberUpgrades.firstFlame` | `truhe.kompostVomVorjahr` | Kompost vom Vorjahr |
| `emberUpgrades.tapMastery` | `truhe.messingBrause` | Messing-Brause |
| `emberUpgrades.seedPurse` | `truhe.notgroschen` | Notgroschen |
| `emberUpgrades.canopyBoost` | `truhe.strohhut` | Strohhut |
| `emberUpgrades.nightSoil` | `truhe.laterne` | Laterne |
| `emberUpgrades.saplingSurge` | `truhe.guteErde` | Gute Erde |
| `emberUpgrades.greenLattice` | `truhe.rosenbogen` | Rosenbogen |
| `prestiges` | `saisonenden` | Saisonende |
| `prestigeSpikeFlags` | `saisonendeSpikeFlags` | |
| `deepPrestiges` | `tiefeWinter` | Tiefer Winter |
| `deepUpgrades` | `sproesslingLaden` | Sprösslings-Laden |
| `deepUpgrades.deepYield` | `sproesslingLaden.tiefeWurzeln` | Tiefe Wurzeln |
| `deepUpgrades.deepWatch` | `sproesslingLaden.winterschutz` | Winterschutz |
| `deepUpgrades.deepPurse` | `sproesslingLaden.saatgutvorrat` | Saatgutvorrat |
| `deepUpgrades.deepStart` | `sproesslingLaden.gartenwissen` | Gartenwissen |
| `clanMult` | `vereinMult` | Kleingartenverein (Vereinsfahne) |
| `clanBoostExpiresAt` | `vereinBoostExpiresAt` | |
| `eventDismissedKey` | `erntefestDismissedKey` | Erntefest (Wochenende) |
| `eventAshProgress` | `erntefestErnte` | |
| `eventProgressKey` | `erntefestProgressKey` | |
| `eventGoalClaimedKey` | `erntefestGoalClaimedKey` | |
| `bpWeekKey` | `gartenwocheKey` | Gartenwoche (Battle-Pass) |
| `bpXp` | `gartenwocheXp` | |
| `bpClaimedFree` | `gartenwocheClaimedFree` | |
| `bpPremium` | `gartenwochePremium` | |
| `bpClaimedPremium` | `gartenwocheClaimedPremium` | |
| `bpDailyXpDay` | `gartenwocheXpDay` | |
| `ownedOfferIds`: `obsidian50/150/500` | `samen50/150/500` | Samen-Päckchen |
| Fenster-ID `bw-JJJJ-MM-TT` (Wert) | `ef-JJJJ-MM-TT` | Erntefest |

Unverändert (schon passend): `ernte`, `ernteSeason`, `ernteLifetime`, `erbstuecke`, `samen`, `sproesslinge`, `vermaechtnis`, `legacy` (Vermächtnis-Laden, Schlüssel schon deutsch), alle neueren Felder.

## Bezeichner im Code (Auswahl, Muster)

| Muster alt | neu |
|---|---|
| `EmberUpgrades`, `EmberUpgradeId`, `EmberShopItem`, `EMPTY_EMBER_UPGRADES`, `EMBER_SHOP` | `TruheUpgrades`, `TruheItemId`, `TruheItem`, `EMPTY_TRUHE`, `TRUHE_ITEMS` |
| `buyEmberUpgrade`, `emberRankUnlocked`, `emberRankUnlockNeed`, `emberGeoCost`, `emberCaps`, `emberUnlockProgress`, `NextEmberUnlock` … | `buyTruheItem`, `truheRankUnlocked`, `truheRankUnlockNeed`, `truheGeoCost`, `truheCaps`, `truheUnlockProgress`, `NextTruheUnlock` … |
| `EMBER_UNLOCK_*`, `EMBER_WAVE2_TIP_IDS`, `EMBER_IMMEDIATE_IDS` | `TRUHE_UNLOCK_*`, `TRUHE_WAVE2_TIP_IDS`, `TRUHE_IMMEDIATE_IDS` |
| `emberPayout`, `EMBER_PAYOUT_*`, `spendEmbers`, `rewardEmbers`, `needEmbers` … | `erbstueckePayout`, `ERBSTUECKE_PAYOUT_*`, `spendErbstuecke`, `rewardErbstuecke`, `needErbstuecke` … |
| `formatAsh`, `earnAsh`, `rewardAsh`, `ashGained`, `needAsh`, `prestigeMinAsh`, `rankUnlockAsh`, `*Ash*` | `formatErnte`, `earnErnte`, `rewardErnte`, `ernteGained`, `needErnte`, `prestigeMinErnte`, `rankUnlockErnte`, `*Ernte*` |
| `ashEarnedThisRun` | `ernteThisRun` |
| `rewardObsidian`, `obsidianGained`, `costObsidian`, `grantObsidian`, `*_OBSIDIAN`, `ObsidianPackDef`, `OBSIDIAN_PACKS` | `rewardSamen`, `samenGained`, `costSamen`, `grantSamen`, `*_SAMEN`, `SamenPackDef`, `SAMEN_PACKS` |
| `computeSec`, `computeMult`, `computeFlat`, `rewardCompute*`, `gateCompute`, `computeGain`, `computeEarned` (Währung) | `ernteSec`, `ernteMult`, `ernteFlat`, `rewardErnte*`, `gateErnte`, `ernteGain`, `ernteEarned` |
| `credits`, `rewardCredits`, `costCredits` | `erbstuecke`, `rewardErbstuecke`, `costErbstuecke` |
| `isBandwidthSurgeActive`, `bandwidthSurge*`, `BandwidthSurgeStatus`, `BANDWIDTH_SURGE_*`, `surge*` | `isErntefestActive`, `erntefest*`, `ErntefestStatus`, `ERNTEFEST_*`, `erntefest*` |
| `foundryDiscountMult` | `saatgutkisteMult` |
| Tab-ID `fortress` | `garten` |
| CSS `.ember-shop*`, `.ember-unlock-bar*`, `.fortress-*` | `.truhe*`, `.truhe-unlock-bar*`, `.garten-*` |
| CSS-Variablen `--oc-*` (Orbital Claim) und `--ad-*` (Ash Dominion, nur Aliase) | `--ge-*` (Gartenerbe); `--ad-X` war immer `var(--oc-X)`, beide werden zu `--ge-X` |
| `--oc-ember*`, `--ember*` | `--ge-gruen`, `--ge-gruen-hell`, `--ge-gruen-dunkel` |
| `--ash`, `--ash-dim` | `--ge-ink-muted`, `--ge-ink-faint` (gleicher Wert) |
| `t.emberShop` | `t.truhe` |
| `t.packs.obsidian*` | `t.packs.samen*` |
| `t.prestige.branchUptime*`, Zweig-ID `uptime` | `t.prestige.branchPflege*`, `pflege` |
| `legacyStorage.ts` (`purgeLegacyStorage`) | entfernt (siehe Paket 3) |

Kommentare mit „Compute“, „Credits“, „Münzen“, „Phyto“, „Rack“, „Tokens“, „Obsidian“, „economy.md“ werden auf die Spielbegriffe umgeschrieben.

Der Prüftest `src/test/legacyNames.test.ts` hält die Liste der verbotenen Altnamen.
