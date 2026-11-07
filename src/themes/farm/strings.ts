/**
 * German player-facing copy — TurmFarm (Urban Vertical Farm) theme skin.
 * Soft resource: Ertrag. Meta: Münzen. Premium stub: Samen.
 */

export const farmStrings = {
  brand: 'TurmFarm',
  meta: {
    title: 'TurmFarm',
    description:
      'TurmFarm — baue und betreibe urbane Vertikalfarmen. Idle-Ertrag, Prestige-Münzen, Clans.',
    pwaDescription:
      'Baue und betreibe urbane Vertikalfarmen. Module erzeugen Ertrag offline. Prestige für Münzen.',
  },

  eyebrow: 'Urban · Nachhaltig',

  nav: {
    ariaLabel: 'Hauptnavigation',
    station: 'Farm',
    prestige: 'Prestige',
    clan: 'Clan',
    shop: 'Shop',
  },

  sound: {
    mute: 'Ton aus',
    unmute: 'Ton an',
    muteAria: 'Soundeffekte stummschalten',
    unmuteAria: 'Soundeffekte einschalten',
  },

  goal: {
    stripAria: 'Nächstes Ziel',
    upgradeTitle: (action: string, name: string) => `${action}: ${name}`,
    upgradeDetail: (cost: string) => `${cost} Ertrag`,
    unlockTitle: (name: string) => `Freischalten: ${name}`,
    unlockAshLeft: (n: string) => `noch ${n} Ertrag`,
    unlockLevel: (name: string, have: number, need: number) =>
      `${name} ${have}/${need}`,
    unlockPlayerLevel: (have: number, need: number) =>
      `Level ${have}/${need}`,
    levelTitle: (n: number) => `Nächstes Level ${n}`,
    levelDetail: (into: number, need: number) => `${into}/${need} EP`,
    prestigeTitle: 'Nächstes Prestige',
    prestigeDetail: (left: string) => `noch ${left} Ertrag`,
    prestigeReady: 'Prestige bereit',
    prestigeReadyDetail: 'Münzen abholen',
    ready: 'Bereit',
    fallback: 'Hof aufbauen',
  },

  resources: {
    compute: 'Ertrag',
    credits: 'Münzen',
    obsidian: 'Samen',
  },

  modules: {
    emberPit: {
      name: 'Gewächshaus',
      blurb: 'Glasdach und Saatbeete — erster Ertrag auf dem Dach.',
    },
    ashForge: {
      name: 'Nährstoffpumpe',
      blurb: 'Pumpt Nährlösung in die Kreisläufe der Farm.',
    },
    cinderBarracks: {
      name: 'LED-Wand',
      blurb: 'Vollspektrum-LEDs treiben Photosynthese in dichter Lage.',
    },
    cinderVault: {
      name: 'Hydro-Beet',
      blurb: 'Nährstofffilm-Beete ohne Erde — sauberer Durchsatz.',
    },
    ashWatch: {
      name: 'Vertikalturm',
      blurb: 'Mehrstöckiger Wachstumsturm über dem Hof.',
    },
    dominionKeep: {
      name: 'Klimasteuerung',
      blurb: 'Zentrale Klima- und Bewässerungssteuerung der Farm.',
    },
    batteryBank: {
      name: 'Wassertank',
      blurb: 'Regen- und Kreislaufwasser für trockene Schichten.',
    },
    edgeCache: {
      name: 'Kompaktbeet',
      blurb: 'Dichte Microgreen-Trays für schnellen Ertrag.',
    },
    quantumCooler: {
      name: 'Kompostierer',
      blurb: 'Wandelt Erntereste in nährstoffreichen Kompost um.',
    },
    packetScrubber: {
      name: 'Aquaponik-Filter',
      blurb: 'Biofilter, der Abwasser in Nährstoffe zurückholt.',
    },
  },

  unlock: {
    prefix: 'Freischalten:',
    or: ' oder ',
    computeEarned: (n: string) => `${n} Ertrag verdient`,
    levelOf: (name: string, level: number) => `${name} Stufe ${level}`,
    playerLevel: (level: number) => `Spieler-Level ${level}`,
  },

  hud: {
    burstReady: 'Ernte-Schub',
    burstCooling: 'Schub abkühlen',
    burstReadyTitle: 'Hole ~45 s der aktuellen Rate (1× alle 5 Min)',
    burstCoolingTitle: 'Tap-Bonus im Cooldown',
    offlineBefore: 'Während du weg warst, hat die Farm',
    offlineAfter: 'Ertrag gebankt.',
    claim: 'Abholen',
    claimToast: 'Ertrag auf die Farm gebucht',
    claimCelebrate: (amount: string, xp: number) =>
      `+${amount} Ertrag · +${xp} EP gebucht`,
    claimCelebrateShort: (amount: string) => `+${amount} Ertrag geerntet`,
    mapAria: 'Farm-Bau-Karte',
    mapHint: 'Modul tippen zum Online-Schalten oder Upgraden.',
    locked: 'Gesperrt',
    levelShort: (level: number) => `Lv ${level}`,
    gateCompute: (n: string) => `${n} Ertrag`,
    buildingAriaUnlocked: (name: string, level: number, rate: string) =>
      `${name}, Stufe ${level}, ${rate}. Tippen zum Upgrade.`,
    buildingAriaLocked: (name: string, hint: string) =>
      `${name}, gesperrt. ${hint}`,
    playerLevelAria: (level: number, xp: number, need: number) =>
      `Spieler-Level ${level}, ${xp} von ${need} EP`,
    progressOpen: 'Meilensteine & Tagesziele',
    progressClose: 'Schließen',
  },

  level: {
    label: 'Level',
    xp: 'EP',
    bonus: (pct: string) => `+${pct} % Ertrag/s`,
    rewards: {
      ash: (n: number) => `+${n} Ertrag`,
      embers: (n: number) => `+${n} Münzen`,
      obsidian: (n: number) => `+${n} Samen`,
      cosmetic: (name: string) => `Skin: ${name}`,
    },
  },

  branches: {
    title: 'Upgradepfade',
    efficiency: 'Effizienz',
    capacity: 'Kapazität',
    efficiencyBlurb: '+4 % Modul-Ertrag/s pro Rang (max. 5).',
    capacityBlurb: '−3 % Upgrade-Kosten dieser Linie pro Rang (max. 5).',
    efficiencyEffect: (pct: number) => `+${pct} % Linie`,
    capacityEffect: (mult: string) => `×${mult} Kosten`,
    rank: (n: number, max: number) => `Rang ${n}/${max}`,
    buy: (name: string, cost: string) => `${name} · ${cost} Ertrag`,
    maxed: 'Max',
    needOnline: 'Modul zuerst online schalten.',
  },

  achievements: {
    title: 'Meilensteine',
    intro: 'Einmalige Ziele — Belohnung landet automatisch.',
    done: 'Erledigt',
    rewardAsh: (n: number) => `+${n} Ertrag`,
    rewardEmbers: (n: number) => `+${n} Münzen`,
    rewardObsidian: (n: number) => `+${n} Samen`,
    rewardCosmetic: (name: string) => `Skin: ${name}`,
    firstUpgrade: {
      name: 'Erster Schnitt',
      blurb: 'Kaufe dein erstes Modul-Upgrade.',
    },
    greenhouseTen: {
      name: 'Volles Glasdach',
      blurb: 'Bringe das Gewächshaus auf Stufe 10.',
    },
    pumpOnline: {
      name: 'Kreislauf läuft',
      blurb: 'Schalte die Nährstoffpumpe online.',
    },
    earn10k: {
      name: 'Ernte-Polster',
      blurb: 'Verdiene insgesamt 10.000 Ertrag.',
    },
    dailyOnce: {
      name: 'Morgenroutine',
      blurb: 'Hole einmal Tägliche Pflege ab.',
    },
    offlineOnce: {
      name: 'Nachtwachstum',
      blurb: 'Hole Offline-Ertrag mindestens einmal ab.',
    },
    fiveOnline: {
      name: 'Fünf Beete',
      blurb: 'Habe fünf Module gleichzeitig online.',
    },
    levelFive: {
      name: 'Hof-Lehrling',
      blurb: 'Erreiche Spieler-Level 5.',
    },
    prestigeOnce: {
      name: 'Neuer Aussaat',
      blurb: 'Prestigiere einmal.',
    },
    upgradesFifty: {
      name: 'Fleißige Hände',
      blurb: 'Kaufe insgesamt 50 Upgrades.',
    },
  },

  quests: {
    title: 'Tagesziele',
    intro: 'Drei Ziele pro Tag — kein Energie-Limit.',
    claim: 'Belohnung holen',
    claimed: 'Abgeholt',
    progress: (cur: string, target: string) => `${cur} / ${target}`,
    upgradeTimes: (n: number) => `Upgrade ${n}× kaufen`,
    earnAsh: (n: string) => `${n} Ertrag verdienen`,
    claimDaily: 'Tägliche Pflege abholen',
    rewardLine: (ash: number, seeds: number) =>
      seeds > 0 ? `+${ash} Ertrag · +${seeds} Samen` : `+${ash} Ertrag`,
  },

  upgrade: {
    close: 'Schließen',
    moduleEyebrow: 'Modul',
    level: 'Stufe',
    now: 'jetzt',
    next: 'nächste',
    milestone: 'Nächste Stufe löst +2 % Meilenstein auf dieser Linie aus.',
    online: 'Online',
    upgrade: 'Upgrade',
    locked: 'Gesperrt',
    offlineEmpty: 'Modul offline — online schalten, um Ertrag zu erzeugen.',
    gateClosed:
      'Tor geschlossen. Erfülle die Bedingung — dann wird dieser CTA aktiv.',
    costLine: (action: string, cost: string) =>
      `${action} · ${cost} Ertrag`,
    branchHint: 'Pfade bleiben sekundär — der Upgrade-Button bleibt primär.',
  },

  prestige: {
    title: 'Prestige',
    introBefore: 'Weicher Reset des Farmlaufs. Behalte',
    introAfter:
      'für permanente Meta-Upgrades. Module fahren herunter; Ertrags-Wallet wird geleert.',
    credits: 'Münzen:',
    multiplier: 'Multiplikator:',
    runs: 'Läufe:',
    thisRun: 'Dieser Lauf:',
    gate: 'Schwelle:',
    creditsPreview: (n: number) => `Münzen-Vorschau +${n}`,
    nextPayout: 'Nächste Auszahlung:',
    creditsAmount: (n: number) => `+${n} Münzen`,
    claimReset: (n: number) => `+${n} Münzen holen & resetten`,
    needMore: (amount: string) =>
      `Noch ${amount} Ertrag in diesem Lauf nötig`,
    emptyGate:
      'Soft-Reset bleibt dunkel, bis dieser Lauf genug Ertrag bunkert. Module weiter auf der Farm laufen lassen.',
    emptyShop: 'Noch keine Münzen — einmal prestigieren, dann füllt sich der Shop.',
    shopTitle: 'Münzen-Shop',
    shopIntro: 'Gib Münzen für permanente Power aus. Nie für Echtgeld verkauft.',
    max: 'Max',
    costCredits: (n: number) => `${n} Münzen`,
  },

  emberShop: {
    dominionYield: {
      name: 'Farm-Ertrag',
      blurb: '+5 % globaler Ertrag/s pro Rang.',
      effect: (rank: number) => `+${rank * 5} % Ertrag/s`,
    },
    longWatch: {
      name: 'Lange Pflege',
      blurb: 'Verlängert Offline Soft (+1 h) und Hard (+2 h) pro Rang.',
      effect: (rank: number) => `+${rank} h soft / +${rank * 2} h hard`,
    },
    foundryDiscount: {
      name: 'Saatgut-Rabatt',
      blurb: '−2 % alle Modul-Upgrade-Kosten pro Rang (kumuliert).',
      effect: (rank: number) => `×${Math.pow(0.98, rank).toFixed(3)} Kosten`,
    },
    firstFlame: {
      name: 'Start-Spross',
      blurb: 'Starte jeden Lauf mit freigeschalteter Nährstoffpumpe.',
      effect: (rank: number) =>
        rank > 0 ? 'Nährstoffpumpe zu Laufbeginn frei' : 'Gesperrt',
    },
  },

  clan: {
    title: 'Clan',
    intro:
      'Saisonale Hof-Slots werden auf der Karte geteilt. Backend kommt später — das ist ein lokaler Platzhalter.',
    yourClan: 'Dein Clan',
    seasonMeta: 'Saison 0 — Survey · Rang 3 · Platzhalter',
    boostActive: (mult: string, left: string) =>
      `Ernte-Banner aktiv · ×${mult} · noch ${left}`,
    boostInactive: 'Kein aktiver Boost — kaufe Ernte-Banner im Shop',
    leaderboard: 'Saison-Rangliste',
    you: '(du)',
    pts: 'Pkt.',
  },

  shop: {
    title: 'Shop',
    intro:
      'Nur Komfort und Status — keine Energie-Wände. Soft-Progress bleibt gratis. Alle Käufe sind lokale Stubs (keine echten Zahlungen).',
    skipLeftToday: 'Skip heute übrig',
    skipHours: (left: number, cap: number) => `${left}/${cap} h`,
    packsTitle: 'Samen-Pakete',
    packsIntro: 'Mock-Gutschriften zum Testen. Kein IAP-Backend.',
    packEffect: (n: number) => `+${n} Samen`,
    skipsTitle: 'Zeit-Skips',
    skipsIntro: (rate: string, cap: number) =>
      `Simuliert Produktion mit Live-Rate (${rate}/s). Tageslimit ${cap} h — berührt Offline-Catchup nicht.`,
    dailyCapReached: 'Tageslimit für Skips erreicht',
    computeGain: (amount: string) => `+${amount} Ertrag`,
    costObsidian: (n: number) => `${n} Samen`,
    skinsTitle: 'Hof-Skins',
    skinsIntro: 'Reine Kosmetik — null Power. Eine Akzentfarbe für den Boden wählen.',
    equipped: 'Ausgerüstet',
    active: 'Aktiv',
    equip: 'Ausrüsten',
    free: 'Gratis',
    clanBoostTitle: 'Clan-Boost',
    clanBoostIntro:
      'Temporärer Produktionsbuff für deinen Platzhalter-Clan. Auffrischen verlängert den Timer.',
    boostActiveShort: (mult: string, left: string) =>
      `Aktiv ×${mult} · noch ${left}`,
    boostInactiveShort: 'Inaktiv · Basis ×1,00',
  },

  packs: {
    starterBundle: {
      name: 'Starter-Bundle',
      blurb: '200 Samen + Amber-Pad-Skin. Mock-Kauf — keine echte Abbuchung.',
      label: 'Kaufen (Stub)',
    },
    obsidian50: {
      name: 'Samen-Chip',
      blurb: '50 Samen zum Testen der Shop-Sinks. Mock-Gutschrift.',
      label: '50 gutschreiben',
    },
  },

  timeSkips: {
    cycleHour: {
      name: 'Ernte-Stunde',
      blurb: 'Simuliert 1 h Produktion mit deiner aktuellen Rate.',
    },
    orbitSurge: {
      name: 'Wachstums-Schub',
      blurb: 'Simuliert 4 h Produktion mit deiner aktuellen Rate.',
    },
  },

  cosmetics: {
    steelDeck: {
      name: 'Hell-Hof',
      blurb: 'Standard-heller Farmboden — blasse Betonplatten.',
    },
    amberPad: {
      name: 'Erde-Pad',
      blurb: 'Warme Erdwäsche über den Beet-Pads.',
    },
    iceAisle: {
      name: 'Blatt-Gang',
      blurb: 'Frisches Blattgrün an jedem Modulrand.',
    },
    goldOps: {
      name: 'Gold-Ernte',
      blurb: 'Warmes Gold-Trim am Hof — nur Status-Flex.',
    },
  },

  clanBoost: {
    name: 'Ernte-Banner',
    blurb: '+10 % Clan-Produktion für 1 Stunde. Auffrischen verlängert; max ×1,25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Farm-Guide · ${step}/${total}`,
    skip: 'Überspringen',
    welcome: {
      title: 'Farm online',
      body: 'TurmFarm ist dein Dach. Module erzeugen Ertrag, während du weg bist.',
      cta: 'Hof öffnen',
    },
    upgradePit: {
      title: 'Gewächshaus upgraden',
      body: 'Tippe das Gewächshaus auf der Karte → Upgrade. Durchsatz steigt je Stufe.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Idle bankt Ertrag',
      body: 'Verlasse die App und komm zurück. Catchup zahlt bis zum Offline-Cap.',
      cta: 'Verstanden',
    },
    unlockForge: {
      title: 'Pumpe online bringen',
      body: 'Verdiene 200 Ertrag in diesem Lauf (oder Gewächshaus Lv 10), um die Nährstoffpumpe freizuschalten.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Clan-Roster',
      body: 'Optionaler Blick — saisonale Hof-Slots kommen später. Keine Aktion nötig.',
      cta: 'Clan öffnen',
      skipLabel: 'Überspringen',
    },
    prestigeTeaser: {
      title: 'Münzen-Meta',
      body: 'Prestige soft-resettet den Lauf für Münzen — permanente Farm-Power. Schau unter Prestige, wenn du bereit bist.',
      cta: 'Fertig',
      skipLabel: 'Schließen',
    },
  },

  daily: {
    kicker: 'Tägliche Pflege',
    firstShift: 'Erste Schicht',
    streakNext: (n: number) => `Serie ${n} · nächster Tag`,
    streakDotsAria: (n: number) => `Serie ${n} von 7 Tagen`,
    comebackLabel: 'Willkommen zurück · Comeback-Bonus',
    comebackMeta: 'Serie pausiert — Bonus für deine Rückkehr',
    claim: 'Abholen',
    claimToast: 'Tägliche Pflege gebucht',
    rewardCompute: (amount: string) => `${amount} Ertrag`,
    rewardCredits: (n: number) => `${n} Münzen`,
    rewardObsidian: (n: number) => `${n} Samen`,
    rows: {
      float2: 'Pflege-Float · 2 Min Ertrag',
      shift3: 'Schichtbonus · 3 Min Ertrag',
      crumb20: 'Samen-Krümel · 20',
      long4: 'Lange Schicht · 4 Min Ertrag',
      credit1: 'Münzen-Gutschein · 1',
      ot5: 'Überstunden · 5 Min Ertrag',
      weekSeal: 'Wochen-Siegel · Münzen + Samen',
    },
  },

  event: {
    name: 'Wachstums-Schub',
    blurb: '+25 % Ertrag/s am Wochenende. Ziel erreichen für Samen-Krümel.',
    endsFri: 'Endet Sonntagabend',
    endsSat: 'Endet morgen Abend',
    endsSun: 'Endet heute Abend',
    endsDefault: 'Wochenend-Fenster',
    goalAria: 'Event-Ziel',
    goalLine: (progress: string, reward: number) =>
      `Ziel: ${progress} Ertrag → ${reward} Samen`,
    claimGoal: 'Ziel belohnen',
    claimed: 'Ziel abgeholt',
    dismiss: 'Schließen',
  },

  install: {
    title: 'Farm einen Tap entfernt',
    iosBefore: 'Auf dem iPhone: tippe',
    iosShare: 'Teilen',
    iosMid: '→',
    iosAdd: 'Zum Home-Bildschirm',
    iosAfter: '. Ein Tap zurück, während Beete weiterwachsen.',
    androidBody:
      'Installiere TurmFarm für ein Home-Screen-Icon. Offline-Ertrag läuft ohnehin weiter.',
    manualBody:
      'Füge TurmFarm über das Browser-Menü zum Home-Bildschirm hinzu — schnellerer Wiedereinstieg. Offline-Ertrag läuft ohnehin weiter.',
    install: 'Installieren',
    gotIt: 'Verstanden',
    notNow: 'Nicht jetzt',
  },
} as const

export type FarmStrings = typeof farmStrings
