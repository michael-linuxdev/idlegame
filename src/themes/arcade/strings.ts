/**
 * German player-facing copy — Tokenhalle (Retro-Arcade) theme skin.
 * Soft resource: Tokens. Meta: Tickets. Premium stub: Jetons.
 */

export const arcadeStrings = {
  brand: 'Tokenhalle',
  meta: {
    title: 'Tokenhalle',
    description:
      'Tokenhalle — baue und betreibe deine Retro-Arcade-Halle. Idle-Tokens, Prestige-Tickets, Clans.',
    pwaDescription:
      'Baue und betreibe deine Retro-Arcade-Halle. Automaten erzeugen Tokens offline. Prestige für Tickets.',
  },

  eyebrow: 'Retro · Arcade',

  nav: {
    ariaLabel: 'Hauptnavigation',
    station: 'Halle',
    prestige: 'Prestige',
    clan: 'Clan',
    shop: 'Shop',
  },

  resources: {
    compute: 'Tokens',
    credits: 'Tickets',
    obsidian: 'Jetons',
  },

  modules: {
    emberPit: {
      name: 'Classic-Automat',
      blurb: 'Pixel-Klassiker am Eingang — erster Token-Fluss der Halle.',
    },
    ashForge: {
      name: 'Ticketdrucker',
      blurb: 'Stanzt Tickets aus jedem Highscore — Soft-Meta der Halle.',
    },
    cinderBarracks: {
      name: 'Rennkabine',
      blurb: 'Sitz-Cockpit mit Neon-Streifen — Dauerbetrieb füllt die Kasse.',
    },
    cinderVault: {
      name: 'Greifautomat',
      blurb: 'Plüsch und Preise hinter Plexiglas — Crowd-Magnet.',
    },
    ashWatch: {
      name: 'Tanzmatte',
      blurb: 'Pfeile blinken, Schuhe klacken — Tokens im Takt.',
    },
    dominionKeep: {
      name: 'Preiswand',
      blurb: 'Zentrale Preiswand der Halle — Status und Anziehungskraft.',
    },
    batteryBank: {
      name: 'Token-Wechsler',
      blurb: 'Wechselt Münzen in Tokens — hält die Automaten am Laufen.',
    },
    edgeCache: {
      name: 'Flippertisch',
      blurb: 'Feder, Bumper, Multiball — dichter Token-Durchsatz.',
    },
    quantumCooler: {
      name: 'Lichtkanone',
      blurb: 'Lichtgewehr-Station — schnelle Runden, helle Neon-LEDs.',
    },
    packetScrubber: {
      name: 'Turnierpult',
      blurb: 'Highscore-Board und Turnier-Anmeldung am Hallenrand.',
    },
  },

  unlock: {
    prefix: 'Freischalten:',
    or: ' oder ',
    computeEarned: (n: string) => `${n} Tokens verdient`,
    levelOf: (name: string, level: number) => `${name} Stufe ${level}`,
    playerLevel: (level: number) => `Spieler-Level ${level}`,
  },

  hud: {
    burstReady: 'Token-Schub',
    burstCooling: 'Schub abkühlen',
    burstReadyTitle: 'Hole ~45 s der aktuellen Rate (1× alle 5 Min)',
    burstCoolingTitle: 'Tap-Bonus im Cooldown',
    offlineBefore: 'Während du weg warst, hat die Halle',
    offlineAfter: 'Tokens gebankt.',
    claim: 'Abholen',
    claimToast: 'Tokens auf die Halle gebucht',
    mapAria: 'Arcade-Bau-Karte',
    mapHint: 'Automat tippen zum Online-Schalten oder Upgraden.',
    locked: 'Gesperrt',
    levelShort: (level: number) => `Lv ${level}`,
    gateCompute: (n: string) => `${n} Tokens`,
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
    bonus: (pct: string) => `+${pct} % Tokens/s`,
    rewards: {
      ash: (n: number) => `+${n} Tokens`,
      embers: (n: number) => `+${n} Tickets`,
      obsidian: (n: number) => `+${n} Jetons`,
      cosmetic: (name: string) => `Skin: ${name}`,
    },
  },

  branches: {
    title: 'Upgradepfade',
    efficiency: 'Effizienz',
    capacity: 'Kapazität',
    efficiencyBlurb: '+4 % Modul-Tokens/s pro Rang (max. 5).',
    capacityBlurb: '−3 % Upgrade-Kosten dieser Linie pro Rang (max. 5).',
    efficiencyEffect: (pct: number) => `+${pct} % Linie`,
    capacityEffect: (mult: string) => `×${mult} Kosten`,
    rank: (n: number, max: number) => `Rang ${n}/${max}`,
    buy: (name: string, cost: string) => `${name} · ${cost} Tokens`,
    maxed: 'Max',
    needOnline: 'Modul zuerst online schalten.',
  },

  achievements: {
    title: 'Meilensteine',
    intro: 'Einmalige Ziele — Belohnung landet automatisch.',
    done: 'Erledigt',
    rewardAsh: (n: number) => `+${n} Tokens`,
    rewardEmbers: (n: number) => `+${n} Tickets`,
    rewardObsidian: (n: number) => `+${n} Jetons`,
    rewardCosmetic: (name: string) => `Skin: ${name}`,
    firstUpgrade: {
      name: 'Erster Credit',
      blurb: 'Kaufe dein erstes Modul-Upgrade.',
    },
    greenhouseTen: {
      name: 'Volles Cabinet',
      blurb: 'Bringe den Classic-Automaten auf Stufe 10.',
    },
    pumpOnline: {
      name: 'Tickets laufen',
      blurb: 'Schalte den Ticketdrucker online.',
    },
    earn10k: {
      name: 'Token-Polster',
      blurb: 'Verdiene insgesamt 10.000 Tokens.',
    },
    dailyOnce: {
      name: 'Morgen-Coins',
      blurb: 'Hole einmal Tägliche Schicht ab.',
    },
    offlineOnce: {
      name: 'Nachtbetrieb',
      blurb: 'Hole Offline-Tokens mindestens einmal ab.',
    },
    fiveOnline: {
      name: 'Fünf Automaten',
      blurb: 'Habe fünf Module gleichzeitig online.',
    },
    levelFive: {
      name: 'Hallen-Lehrling',
      blurb: 'Erreiche Spieler-Level 5.',
    },
    prestigeOnce: {
      name: 'Neuer Highscore',
      blurb: 'Prestigiere einmal.',
    },
    upgradesFifty: {
      name: 'Service-Hände',
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
    earnAsh: (n: string) => `${n} Tokens verdienen`,
    claimDaily: 'Tägliche Schicht abholen',
    rewardLine: (ash: number, seeds: number) =>
      seeds > 0 ? `+${ash} Tokens · +${seeds} Jetons` : `+${ash} Tokens`,
  },

  upgrade: {
    close: 'Schließen',
    moduleEyebrow: 'Automat',
    level: 'Stufe',
    now: 'jetzt',
    next: 'nächste',
    milestone: 'Nächste Stufe löst +2 % Meilenstein auf dieser Linie aus.',
    online: 'Online',
    upgrade: 'Upgrade',
    locked: 'Gesperrt',
    offlineEmpty: 'Automat offline — online schalten, um Tokens zu erzeugen.',
    gateClosed:
      'Tor geschlossen. Erfülle die Bedingung — dann wird dieser CTA aktiv.',
    costLine: (action: string, cost: string) =>
      `${action} · ${cost} Tokens`,
    branchHint: 'Pfade bleiben sekundär — der Upgrade-Button bleibt primär.',
  },

  prestige: {
    title: 'Prestige',
    introBefore: 'Weicher Reset des Hallenlaufs. Behalte',
    introAfter:
      'für permanente Meta-Upgrades. Automaten fahren herunter; Token-Wallet wird geleert.',
    credits: 'Tickets:',
    multiplier: 'Multiplikator:',
    runs: 'Läufe:',
    thisRun: 'Dieser Lauf:',
    gate: 'Schwelle:',
    creditsPreview: (n: number) => `Ticket-Vorschau +${n}`,
    nextPayout: 'Nächste Auszahlung:',
    creditsAmount: (n: number) => `+${n} Tickets`,
    claimReset: (n: number) => `+${n} Tickets holen & resetten`,
    needMore: (amount: string) =>
      `Noch ${amount} Tokens in diesem Lauf nötig`,
    emptyGate:
      'Soft-Reset bleibt dunkel, bis dieser Lauf genug Tokens bunkert. Automaten weiter in der Halle laufen lassen.',
    emptyShop: 'Noch keine Tickets — einmal prestigieren, dann füllt sich der Shop.',
    shopTitle: 'Ticket-Shop',
    shopIntro: 'Gib Tickets für permanente Power aus. Nie für Echtgeld verkauft.',
    max: 'Max',
    costCredits: (n: number) => `${n} Tickets`,
  },

  emberShop: {
    dominionYield: {
      name: 'Hallen-Ertrag',
      blurb: '+5 % globale Tokens/s pro Rang.',
      effect: (rank: number) => `+${rank * 5} % Tokens/s`,
    },
    longWatch: {
      name: 'Lange Schicht',
      blurb: 'Verlängert Offline Soft (+1 h) und Hard (+2 h) pro Rang.',
      effect: (rank: number) => `+${rank} h soft / +${rank * 2} h hard`,
    },
    foundryDiscount: {
      name: 'Service-Rabatt',
      blurb: '−2 % alle Modul-Upgrade-Kosten pro Rang (kumuliert).',
      effect: (rank: number) => `×${Math.pow(0.98, rank).toFixed(3)} Kosten`,
    },
    firstFlame: {
      name: 'Start-Credit',
      blurb: 'Starte jeden Lauf mit freigeschaltetem Ticketdrucker.',
      effect: (rank: number) =>
        rank > 0 ? 'Ticketdrucker zu Laufbeginn frei' : 'Gesperrt',
    },
  },

  clan: {
    title: 'Clan',
    intro:
      'Saisonale Hallen-Slots werden auf der Karte geteilt. Backend kommt später — das ist ein lokaler Platzhalter.',
    yourClan: 'Dein Clan',
    seasonMeta: 'Saison 0 — Highscore · Rang 3 · Platzhalter',
    boostActive: (mult: string, left: string) =>
      `Neon-Banner aktiv · ×${mult} · noch ${left}`,
    boostInactive: 'Kein aktiver Boost — kaufe Neon-Banner im Shop',
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
    packsTitle: 'Jeton-Pakete',
    packsIntro: 'Mock-Gutschriften zum Testen. Kein IAP-Backend.',
    packEffect: (n: number) => `+${n} Jetons`,
    skipsTitle: 'Zeit-Skips',
    skipsIntro: (rate: string, cap: number) =>
      `Simuliert Produktion mit Live-Rate (${rate}/s). Tageslimit ${cap} h — berührt Offline-Catchup nicht.`,
    dailyCapReached: 'Tageslimit für Skips erreicht',
    computeGain: (amount: string) => `+${amount} Tokens`,
    costObsidian: (n: number) => `${n} Jetons`,
    skinsTitle: 'Hallen-Skins',
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
      blurb: '200 Jetons + Neon-Pad-Skin. Mock-Kauf — keine echte Abbuchung.',
      label: 'Kaufen (Stub)',
    },
    obsidian50: {
      name: 'Jeton-Chip',
      blurb: '50 Jetons zum Testen der Shop-Sinks. Mock-Gutschrift.',
      label: '50 gutschreiben',
    },
  },

  timeSkips: {
    cycleHour: {
      name: 'Token-Stunde',
      blurb: 'Simuliert 1 h Produktion mit deiner aktuellen Rate.',
    },
    orbitSurge: {
      name: 'Neon-Schub',
      blurb: 'Simuliert 4 h Produktion mit deiner aktuellen Rate.',
    },
  },

  cosmetics: {
    steelDeck: {
      name: 'Hell-Halle',
      blurb: 'Standard-heller Linoleum-Boden — blasse Platten.',
    },
    amberPad: {
      name: 'Neon-Pad',
      blurb: 'Warme Magenta-Wäsche über den Automaten-Pads.',
    },
    iceAisle: {
      name: 'Cyan-Gang',
      blurb: 'Kühles Cyan an jedem Kabinettrand.',
    },
    goldOps: {
      name: 'Gold-Token',
      blurb: 'Warmes Gold-Trim an der Halle — nur Status-Flex.',
    },
  },

  clanBoost: {
    name: 'Neon-Banner',
    blurb: '+10 % Clan-Produktion für 1 Stunde. Auffrischen verlängert; max ×1,25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Hallen-Guide · ${step}/${total}`,
    skip: 'Überspringen',
    welcome: {
      title: 'Halle online',
      body: 'Tokenhalle ist deine Arcade. Automaten erzeugen Tokens, während du weg bist.',
      cta: 'Halle öffnen',
    },
    upgradePit: {
      title: 'Classic upgraden',
      body: 'Tippe den Classic-Automaten auf der Karte → Upgrade. Durchsatz steigt je Stufe.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Idle bankt Tokens',
      body: 'Verlasse die App und komm zurück. Catchup zahlt bis zum Offline-Cap.',
      cta: 'Verstanden',
    },
    unlockForge: {
      title: 'Drucker online bringen',
      body: 'Verdiene 200 Tokens in diesem Lauf (oder Classic Lv 10), um den Ticketdrucker freizuschalten.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Clan-Roster',
      body: 'Optionaler Blick — saisonale Hallen-Slots kommen später. Keine Aktion nötig.',
      cta: 'Clan öffnen',
      skipLabel: 'Überspringen',
    },
    prestigeTeaser: {
      title: 'Ticket-Meta',
      body: 'Prestige soft-resettet den Lauf für Tickets — permanente Hallen-Power. Schau unter Prestige, wenn du bereit bist.',
      cta: 'Fertig',
      skipLabel: 'Schließen',
    },
  },

  daily: {
    kicker: 'Tägliche Schicht',
    firstShift: 'Erste Schicht',
    streakNext: (n: number) => `Serie ${n} · nächster Tag`,
    claim: 'Abholen',
    rewardCompute: (amount: string) => `${amount} Tokens`,
    rewardCredits: (n: number) => `${n} Tickets`,
    rewardObsidian: (n: number) => `${n} Jetons`,
    rows: {
      float2: 'Credit-Float · 2 Min Tokens',
      shift3: 'Schichtbonus · 3 Min Tokens',
      crumb20: 'Jeton-Krümel · 20',
      long4: 'Lange Schicht · 4 Min Tokens',
      credit1: 'Ticket-Gutschein · 1',
      ot5: 'Überstunden · 5 Min Tokens',
      weekSeal: 'Wochen-Siegel · Tickets + Jetons',
    },
  },

  event: {
    name: 'Neon-Schub',
    blurb: '+25 % Tokens/s am Wochenende. Ziel erreichen für Jeton-Krümel.',
    endsFri: 'Endet Sonntagabend',
    endsSat: 'Endet morgen Abend',
    endsSun: 'Endet heute Abend',
    endsDefault: 'Wochenend-Fenster',
    goalAria: 'Event-Ziel',
    goalLine: (progress: string, reward: number) =>
      `Ziel: ${progress} Tokens → ${reward} Jetons`,
    claimGoal: 'Ziel belohnen',
    claimed: 'Ziel abgeholt',
    dismiss: 'Schließen',
  },

  install: {
    title: 'Halle einen Tap entfernt',
    iosBefore: 'Auf dem iPhone: tippe',
    iosShare: 'Teilen',
    iosMid: '→',
    iosAdd: 'Zum Home-Bildschirm',
    iosAfter: '. Ein Tap zurück, während Automaten weiterlaufen.',
    androidBody:
      'Installiere Tokenhalle für ein Home-Screen-Icon. Offline-Tokens laufen ohnehin weiter.',
    manualBody:
      'Füge Tokenhalle über das Browser-Menü zum Home-Bildschirm hinzu — schnellerer Wiedereinstieg. Offline-Tokens laufen ohnehin weiter.',
    install: 'Installieren',
    gotIt: 'Verstanden',
    notNow: 'Nicht jetzt',
  },
} as const

export type ArcadeStrings = typeof arcadeStrings
