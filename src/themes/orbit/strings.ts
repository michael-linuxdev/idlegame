/**
 * German player-facing copy — sole / default locale for Orbit Rack.
 * Brand name stays English. Resource: Rechenleistung (Compute), Credits, Obsidian.
 */

export const orbitStrings = {
  brand: 'Orbit Rack',
  meta: {
    title: 'Orbit Rack',
    description:
      'Orbit Rack — baue und betreibe orbitale Rechenzentren. Idle-Rechenleistung, Prestige-Credits, Clans.',
    pwaDescription:
      'Baue und betreibe orbitale Rechenzentren. Module erzeugen Rechenleistung offline. Prestige für Credits.',
  },

  eyebrow: 'Tech · Ops',

  nav: {
    ariaLabel: 'Hauptnavigation',
    station: 'Station',
    prestige: 'Prestige',
    clan: 'Clan',
    shop: 'Shop',
  },

  resources: {
    compute: 'Rechenleistung',
    credits: 'Credits',
    obsidian: 'Obsidian',
  },

  modules: {
    emberPit: {
      name: 'Kraftwerk',
      blurb: 'Orbitale Reaktoren speisen Roh-Rechenleistung in den Stationsbus.',
    },
    ashForge: {
      name: 'Kühlanlage',
      blurb: 'Radiatoren und Kühlkreisläufe halten die Racks im thermischen Fenster.',
    },
    cinderBarracks: {
      name: 'Rack-Bucht',
      blurb: 'Dichte Serverflächen wandeln Strom in abrechenbare Rechenleistung um.',
    },
    cinderVault: {
      name: 'Uplink',
      blurb: 'Hochleistungsantennen verkaufen Restkapazität an das Gürtel-Netz.',
    },
    ashWatch: {
      name: 'Strahl-Relais',
      blurb: 'Laser-Backhaul verbindet entfernte Pods zu einem Gewebe.',
    },
    dominionKeep: {
      name: 'Core-Switch',
      blurb: 'Die Steuerungsebene — routet jedes Rack, jeden Kühlkreislauf und Vertrag.',
    },
    batteryBank: {
      name: 'Batteriebank',
      blurb: 'Kondensator-Gewölbe, die Orbit-Finsternisse abfangen.',
    },
    edgeCache: {
      name: 'Edge-Cache',
      blurb: 'Nahorbit-CDN-Pods, die heiße Requests in Rechenleistung verwandeln.',
    },
    quantumCooler: {
      name: 'Quantenkühler',
      blurb: 'Kryo-Gitter für dichtere Qubit- und ASIC-Böden.',
    },
    packetScrubber: {
      name: 'Paketfilter',
      blurb: 'Inline-Filter, die Abfallpakete in abrechenbare Zyklen holen.',
    },
  },

  unlock: {
    prefix: 'Freischalten:',
    or: ' oder ',
    computeEarned: (n: string) => `${n} Rechenleistung verdient`,
    levelOf: (name: string, level: number) => `${name} Stufe ${level}`,
  },

  hud: {
    burstReady: 'Burst-Zyklus',
    burstCooling: 'Burst abkühlen',
    burstReadyTitle: 'Hole ~45 s der aktuellen Rate (1× alle 5 Min)',
    burstCoolingTitle: 'Tap-Bonus im Cooldown',
    offlineBefore: 'Während du weg warst, hat die Station',
    offlineAfter: 'Rechenleistung gebankt.',
    claim: 'Abholen',
    claimToast: 'Rechenleistung auf den Bus gebucht',
    mapAria: 'Stations-Bau-Karte',
    mapHint: 'Modul tippen zum Online-Schalten oder Upgraden.',
    locked: 'Gesperrt',
    levelShort: (level: number) => `Lv ${level}`,
    gateCompute: (n: string) => `${n} Rechenleistung`,
    buildingAriaUnlocked: (name: string, level: number, rate: string) =>
      `${name}, Stufe ${level}, ${rate}. Tippen zum Upgrade.`,
    buildingAriaLocked: (name: string, hint: string) =>
      `${name}, gesperrt. ${hint}`,
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
    offlineEmpty:
      'Modul offline — online schalten, um Rechenleistung zu erzeugen.',
    gateClosed:
      'Tor geschlossen. Erfülle die Bedingung — dann wird dieser CTA aktiv.',
    costLine: (action: string, cost: string) =>
      `${action} · ${cost} Rechenleistung`,
  },

  prestige: {
    title: 'Prestige',
    introBefore: 'Weicher Reset des Stationslaufs. Behalte',
    introAfter:
      'für permanente Meta-Upgrades. Module fahren herunter; Rechenleistungs-Wallet wird geleert.',
    credits: 'Credits:',
    multiplier: 'Multiplikator:',
    runs: 'Läufe:',
    thisRun: 'Dieser Lauf:',
    gate: 'Schwelle:',
    creditsPreview: (n: number) => `Credits-Vorschau +${n}`,
    nextPayout: 'Nächste Auszahlung:',
    creditsAmount: (n: number) => `+${n} Credits`,
    claimReset: (n: number) => `+${n} Credits holen & resetten`,
    needMore: (amount: string) =>
      `Noch ${amount} Rechenleistung in diesem Lauf nötig`,
    emptyGate:
      'Soft-Reset bleibt dunkel, bis dieser Lauf genug Rechenleistung bunkert. Module weiter auf Station laufen lassen.',
    emptyShop:
      'Noch keine Credits — einmal prestigieren, dann füllt sich der Shop.',
    shopTitle: 'Credits-Shop',
    shopIntro: 'Gib Credits für permanente Power aus. Nie für Echtgeld verkauft.',
    max: 'Max',
    costCredits: (n: number) => `${n} Credits`,
  },

  emberShop: {
    dominionYield: {
      name: 'Rack-Ertrag',
      blurb: '+5 % globale Rechenleistung/s pro Rang.',
      effect: (rank: number) => `+${rank * 5} % Rechenleistung/s`,
    },
    longWatch: {
      name: 'Lange Uptime',
      blurb: 'Verlängert Offline Soft (+1 h) und Hard (+2 h) pro Rang.',
      effect: (rank: number) => `+${rank} h soft / +${rank * 2} h hard`,
    },
    foundryDiscount: {
      name: 'Stücklisten-Rabatt',
      blurb: '−2 % alle Modul-Upgrade-Kosten pro Rang (kumuliert).',
      effect: (rank: number) => `×${Math.pow(0.98, rank).toFixed(3)} Kosten`,
    },
    firstFlame: {
      name: 'Hot Spare',
      blurb: 'Starte jeden Lauf mit freigeschalteter Kühlanlage.',
      effect: (rank: number) =>
        rank > 0 ? 'Kühlanlage zu Laufbeginn frei' : 'Gesperrt',
    },
  },

  clan: {
    title: 'Clan',
    intro:
      'Saisonale Orbit-Slots werden auf der Karte geteilt. Backend kommt später — das ist ein lokaler Platzhalter.',
    yourClan: 'Dein Clan',
    seasonMeta: 'Saison 0 — Survey · Rang 3 · Platzhalter',
    boostActive: (mult: string, left: string) =>
      `Uplink-Banner aktiv · ×${mult} · noch ${left}`,
    boostInactive: 'Kein aktiver Boost — kaufe Uplink-Banner im Shop',
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
    packsTitle: 'Obsidian-Pakete',
    packsIntro: 'Mock-Gutschriften zum Testen. Kein IAP-Backend.',
    packEffect: (n: number) => `+${n} Obsidian`,
    skipsTitle: 'Zeit-Skips',
    skipsIntro: (rate: string, cap: number) =>
      `Simuliert Produktion mit Live-Rate (${rate}/s). Tageslimit ${cap} h — berührt Offline-Catchup nicht.`,
    dailyCapReached: 'Tageslimit für Skips erreicht',
    computeGain: (amount: string) => `+${amount} Rechenleistung`,
    costObsidian: (n: number) => `${n} Obsidian`,
    skinsTitle: 'Stations-Skins',
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
      blurb: '200 Obsidian + Amber-Pad-Skin. Mock-Kauf — keine echte Abbuchung.',
      label: 'Kaufen (Stub)',
    },
    obsidian50: {
      name: 'Obsidian-Chip',
      blurb: '50 Obsidian zum Testen der Shop-Sinks. Mock-Gutschrift.',
      label: '50 gutschreiben',
    },
  },

  timeSkips: {
    cycleHour: {
      name: 'Zyklus-Stunde',
      blurb: 'Simuliert 1 h Produktion mit deiner aktuellen Rate.',
    },
    orbitSurge: {
      name: 'Orbit-Surge',
      blurb: 'Simuliert 4 h Produktion mit deiner aktuellen Rate.',
    },
  },

  cosmetics: {
    steelDeck: {
      name: 'Stahl-Deck',
      blurb: 'Standard-heller Stationsboden — blasse Stahlfliesen.',
    },
    amberPad: {
      name: 'Amber-Pad',
      blurb: 'Warme Panel-Wäsche über den Hof-Pads.',
    },
    iceAisle: {
      name: 'Eis-Gang',
      blurb: 'Kaltgang-Eisblau-Randleuchten an jedem Rack.',
    },
    goldOps: {
      name: 'Gold-Ops',
      blurb: 'Gebürstetes Stahlgold-NOC-Trim — nur Status-Flex.',
    },
  },

  clanBoost: {
    name: 'Uplink-Banner',
    blurb: '+10 % Clan-Produktion für 1 Stunde. Auffrischen verlängert; max ×1,25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Ops-Guide · ${step}/${total}`,
    skip: 'Überspringen',
    welcome: {
      title: 'Station online',
      body: 'Orbit Rack ist dein Floor. Module erzeugen Rechenleistung, während du weg bist.',
      cta: 'Ops öffnen',
    },
    upgradePit: {
      title: 'Kraftwerk upgraden',
      body: 'Tippe das Kraftwerk auf der Karte → Upgrade. Durchsatz steigt je Stufe.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Idle bankt Rechenleistung',
      body: 'Verlasse die App und komm zurück. Catchup zahlt bis zum Offline-Cap.',
      cta: 'Verstanden',
    },
    unlockForge: {
      title: 'Kühlung online bringen',
      body: 'Verdiene 200 Rechenleistung in diesem Lauf (oder Kraftwerk Lv 10), um die Kühlanlage freizuschalten.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Clan-Roster',
      body: 'Optionaler Blick — saisonale Orbit-Slots kommen später. Keine Aktion nötig.',
      cta: 'Clan öffnen',
      skipLabel: 'Überspringen',
    },
    prestigeTeaser: {
      title: 'Credits-Meta',
      body: 'Prestige soft-resettet den Lauf für Credits — permanente Rack-Power. Schau unter Prestige, wenn du bereit bist.',
      cta: 'Fertig',
      skipLabel: 'Schließen',
    },
  },

  daily: {
    kicker: 'Tägliche Ops',
    firstShift: 'Erste Schicht',
    streakNext: (n: number) => `Serie ${n} · nächster Tag`,
    claim: 'Abholen',
    rewardCompute: (amount: string) => `${amount} Rechenleistung`,
    rewardCredits: (n: number) => `${n} Credits`,
    rewardObsidian: (n: number) => `${n} Obsidian`,
    rows: {
      float2: 'Ops-Float · 2 Min Rechenleistung',
      shift3: 'Schichtbonus · 3 Min Rechenleistung',
      crumb20: 'Obsidian-Krümel · 20',
      long4: 'Lange Schicht · 4 Min Rechenleistung',
      credit1: 'Credit-Gutschein · 1',
      ot5: 'Überstunden · 5 Min Rechenleistung',
      weekSeal: 'Wochen-Siegel · Credits + Obsidian',
    },
  },

  event: {
    name: 'Bandbreiten-Schub',
    blurb: '+25 % Rechenleistung/s am Wochenende. Ziel erreichen für Obsidian-Krümel.',
    endsFri: 'Endet Sonntagabend',
    endsSat: 'Endet morgen Abend',
    endsSun: 'Endet heute Abend',
    endsDefault: 'Wochenend-Fenster',
    goalAria: 'Event-Ziel',
    goalLine: (progress: string, reward: number) =>
      `Ziel: ${progress} Rechenleistung → ${reward} Obsidian`,
    claimGoal: 'Ziel belohnen',
    claimed: 'Ziel abgeholt',
    dismiss: 'Schließen',
  },

  install: {
    title: 'Station einen Tap entfernt',
    iosBefore: 'Auf dem iPhone: tippe',
    iosShare: 'Teilen',
    iosMid: '→',
    iosAdd: 'Zum Home-Bildschirm',
    iosAfter: '. Ein Tap zurück, während Racks weiterlaufen.',
    androidBody:
      'Installiere Orbit Rack für ein Home-Screen-Icon. Offline-Rechenleistung läuft ohnehin weiter.',
    manualBody:
      'Füge Orbit Rack über das Browser-Menü zum Home-Bildschirm hinzu — schnellerer Wiedereinstieg. Offline-Rechenleistung läuft ohnehin weiter.',
    install: 'Installieren',
    gotIt: 'Verstanden',
    notNow: 'Nicht jetzt',
  },
} as const

export type OrbitStrings = typeof orbitStrings
