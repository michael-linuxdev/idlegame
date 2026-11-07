/**
 * German player-facing copy — Tokenhalle (Retro-Arcade) theme skin.
 * Soft resource: Tokens. Meta: Tickets. Premium stub: Jetons.
 * Soft label wired via SOFT_CURRENCY + resources.compute for rename-ready swaps.
 */
const SOFT_CURRENCY = 'Tokens'

export const arcadeStrings = {
  brand: 'Tokenhalle',
  meta: {
    title: 'Tokenhalle',
    description:
      'Tokenhalle — baue und betreibe deine Retro-Arcade-Halle. Idle-Tokens, Prestige-Tickets, Clans.',
    pwaDescription:
      'Baue und betreibe deine Retro-Arcade-Halle. Automaten erzeugen Tokens offline. Prestige für Tickets.',
  },

  eyebrow: 'Retro Arcade',

  nav: {
    ariaLabel: 'Hauptnavigation',
    station: 'Halle',
    prestige: 'Prestige',
    clan: 'Clan',
    shop: 'Shop',
    menu: 'Menü',
    menuClose: 'Menü schließen',
    backToMap: 'Zur Karte',
  },

  sound: {
    mute: 'Ton aus',
    unmute: 'Ton an',
    muteAria: 'Soundeffekte stummschalten',
    unmuteAria: 'Soundeffekte einschalten',
  },

  playtest: {
    title: 'Playtest-Log',
    on: 'An',
    off: 'Aus',
    export: 'Log exportieren',
    clear: 'Log leeren',
  },

  goal: {
    stripAria: 'Nächstes Ziel',
    upgradeTitle: (action: string, name: string) => `${action}: ${name}`,
    upgradeDetail: (cost: string) => `${cost} ${SOFT_CURRENCY}`,
    unlockTitle: (name: string) => `Freischalten: ${name}`,
    unlockAshLeft: (n: string) => `noch ${n} ${SOFT_CURRENCY}`,
    unlockLevel: (name: string, have: number, need: number) =>
      `${name} ${have}/${need}`,
    unlockPlayerLevel: (have: number, need: number) =>
      `Level ${have}/${need}`,
    levelTitle: (n: number) => `Nächstes Level ${n}`,
    levelDetail: (into: number, need: number) => `${into}/${need} EP`,
    prestigeTitle: 'Nächstes Prestige',
    prestigeDetail: (left: string) => `noch ${left} ${SOFT_CURRENCY}`,
    prestigeReady: 'Prestige bereit',
    prestigeReadyDetail: 'Tickets abholen',
    ready: 'Bereit',
    fallback: 'Halle aufbauen',
    nearMiss: (pct: number) => `fast · ${pct}%`,
  },

  bestBuy: {
    tipAffordable: (name: string) => `Tipp: ${name}`,
    tipSoon: (name: string) => `Bald: ${name}`,
    aria: 'Bester nächster Kauf',
  },

  surprise: {
    milestone: (amount: string) => `Meilenstein +${amount}`,
    jackpot: (amount: string) => `Jackpot +${amount}`,
    prestigeNear: (amount: string) => `Prestige nah +${amount}`,
    offlineJackpot: (amount: string) => `Comeback-Krümel +${amount}`,
  },

  flash: {
    name: 'Blitz-Runde',
    blurb: '+15 % Tokens/s · kurzes Fenster.',
    endsMin: (m: number, s: number) =>
      s > 0 ? `Noch ${m}:${String(s).padStart(2, '0')}` : `Noch ${m} Min`,
    endsSec: (s: number) => `Noch ${s}s`,
    endsSoon: 'Fenster zu',
    graceLabel: 'Ziel noch abholen',
    goalAria: 'Blitz-Ziel',
    goalLine: (progress: string, reward: number) =>
      `${progress} → ${reward} Jetons`,
    claimGoal: 'Belohnen',
    claimed: 'Abgeholt',
    dismiss: 'Schließen',
  },

  resources: {
    compute: SOFT_CURRENCY,
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
    burstCooling: 'Abkühlen…',
    burstReadyTitle: '~45 s Rate, 1× alle 5 Min',
    burstCoolingTitle: 'Schub im Cooldown',
    offlineBefore: 'Während du weg warst:',
    offlineAfter: 'Tokens gebankt.',
    claim: 'Abholen',
    claimToast: 'Tokens gebucht',
    claimCelebrate: (amount: string, xp: number) =>
      `+${amount} Tokens · +${xp} EP`,
    claimCelebrateShort: (amount: string) => `+${amount} Tokens`,
    mapAria: 'Arcade-Bau-Karte',
    mapHint: 'Automat tippen → online / ausbauen.',
    locked: 'Gesperrt',
    levelShort: (level: number) => `Lv ${level}`,
    gateCompute: (n: string) => `${n} Tokens`,
    buildingAriaUnlocked: (name: string, level: number, rate: string) =>
      `${name}, Stufe ${level}, ${rate}. Tippen zum Upgrade.`,
    buildingAriaLocked: (name: string, hint: string) =>
      `${name}, gesperrt. ${hint}`,
    playerLevelAria: (level: number, xp: number, need: number) =>
      `Spieler-Level ${level}, ${xp} von ${need} EP`,
    progressOpen: 'Ziele & Meilensteine',
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
    capacityBlurb: '−3 % Upgrade-Kosten dieses Moduls pro Rang (max. 5).',
    efficiencyPerRank: '+4 %/Rang',
    capacityPerRank: '−3 %/Rang',
    efficiencyEffect: (pct: number) => `+${pct} % Modul`,
    capacityEffect: (mult: string) => `×${mult} Kosten`,
    rank: (n: number, max: number) => `Rang ${n}/${max}`,
    buy: (name: string, cost: string) => `${name} · ${cost}`,
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
    milestone: 'Nächste Stufe löst +2 % Meilenstein auf diesem Modul aus.',
    online: 'Online schalten',
    upgrade: 'Ausbauen',
    locked: 'Gesperrt',
    offlineEmpty: 'Automat offline — online schalten, um Tokens zu erzeugen.',
    gateClosed:
      'Tor geschlossen. Erfülle die Bedingung — dann wird dieser CTA aktiv.',
    needMore: (amount: string) => `Noch ${amount} ${SOFT_CURRENCY} nötig`,
    costLine: (action: string, cost: string) =>
      `${action} · ${cost} ${SOFT_CURRENCY}`,
    branchHint: 'Pfade bleiben sekundär — der Ausbauen-Button bleibt primär.',
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
    shopTitle: 'Ticket-Baum',
    shopIntro:
      'Drei Äste permanenter Meta-Power. Tickets nur aus Prestige — nie für Echtgeld.',
    max: 'Max',
    costCredits: (n: number) => `${n} Tickets`,
    keepTitle: 'Behältst du',
    loseTitle: 'Reset',
    keepItems: [
      'Tickets & Meta-Upgrades',
      'Jetons, Skins, Daily-Streak',
      'Prestige-Zähler',
    ],
    loseItems: [
      'Token-Wallet dieses Laufs',
      'Alle Automaten-Stufen',
      'Lauf-Fortschritt zur Schwelle',
    ],
    branchYieldTitle: 'Ertrags-Ast',
    branchYieldBlurb: 'Mehr Durchsatz und günstigere Ausbauten.',
    branchUptimeTitle: 'Schicht-Ast',
    branchUptimeBlurb: 'Längere Offline-Fenster und stärkere Tap-Schübe.',
    branchStartTitle: 'Start-Ast',
    branchStartBlurb: 'Schnellerer Neustart nach jedem Prestige.',
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
    tapMastery: {
      name: 'Tap-Meister',
      blurb: '+15 s Tap-Bonus-Dauer pro Rang.',
      effect: (rank: number) => `+${rank * 15} s Tap-Bonus`,
    },
    seedPurse: {
      name: 'Start-Guthaben',
      blurb: 'Starte jeden Prestige-Lauf mit +50 Tokens pro Rang.',
      effect: (rank: number) =>
        rank > 0 ? `+${rank * 50} Tokens zu Laufbeginn` : 'Kein Startbonus',
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
      'Nur Komfort und Status — keine Energie-Wände. Soft-Progress bleibt gratis. Werbung ist optional belohnend und blockiert nie das Spielen. Alle Käufe sind lokale Stubs (keine echten Zahlungen / kein Ad-SDK).',
    skipLeftToday: 'Skip heute übrig',
    skipHours: (left: number, cap: number) => `${left}/${cap} h`,
    packsTitle: 'Bundles & Jetons',
    packsIntro: 'Mock-Käufe mit lokaler Jeton-Währung. Kein IAP-Backend.',
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
    owned: 'Besitzt',
    clanBoostTitle: 'Clan-Boost',
    clanBoostIntro:
      'Temporärer Produktionsbuff für deinen Platzhalter-Clan. Auffrischen verlängert den Timer.',
    boostActiveShort: (mult: string, left: string) =>
      `Aktiv ×${mult} · noch ${left}`,
    boostInactiveShort: 'Inaktiv · Basis ×1,00',
    adsTitle: 'Optionale Belohnung',
    adsIntro:
      'Freiwillig Werbung ansehen für einen kleinen Bonus. Niemals Pflicht — Spielen geht immer ohne.',
    adsWatch: 'Werbung ansehen',
    adsWatching: 'Werbung läuft…',
    adsCooldown: (left: string) => `Cooldown ${left}`,
    adsRemovedBadge: 'Werbefrei aktiv',
    adsRewardSkip: (mins: number, amount: string) =>
      `+${mins} Min Zeit-Skip-Krümel (${amount} Tokens)`,
    adsRewardObsidian: (n: number) => `+${n} Jetons`,
    adsRewardYield: (mins: number, amount: string) =>
      `+${mins} Min Tokens (${amount})`,
    removeAdsTitle: 'Werbefrei',
    removeAdsIntro:
      'Einmaliger Stub-Kauf — entfernt Belohnungs-Werbung dauerhaft. Progress bleibt gratis.',
    yieldBoostTitle: 'Token-Schub',
    yieldBoostIntro:
      'Persönlicher +15 % Tokens für 30 Min. Mit Jetons bezahlt — optionaler Komfort.',
    yieldBoostActive: (mult: string, left: string) =>
      `Aktiv ×${mult} · noch ${left}`,
    yieldBoostInactive: 'Inaktiv',
    yieldBoostBuy: (cost: number) => `${cost} Jetons`,
    currencyPacksTitle: 'Jeton-Packs',
    currencyPacksIntro: 'Größere Mock-Gutschriften zum Testen der Shop-Sinks.',
    cosmeticPacksTitle: 'Kosmetik-Packs',
    cosmeticPacksIntro: 'Mehrere Skins in einem Stub-Kauf.',
    battlePassTitle: 'Wochen-Pass (lite)',
    battlePassIntro:
      'Wöchentlicher Free-Track + Premium-Stub. XP per Tagespflege oder optionaler Werbung. Kein Energie-Gate.',
    battlePassXp: (xp: number, max: number) => `${xp}/${max} XP`,
    battlePassDailyXp: 'Tages-XP holen',
    battlePassDailyDone: 'Tages-XP geholt',
    battlePassFree: 'Gratis',
    battlePassPremium: 'Premium',
    battlePassClaim: 'Abholen',
    battlePassClaimed: 'Abgeholt',
    battlePassLocked: 'Gesperrt',
    battlePassNeedXp: (xp: number) => `Ab ${xp} XP`,
    battlePassNeedPremium: 'Premium freischalten',
    rewardObsidian: (n: number) => `+${n} Jetons`,
    rewardComputeSec: (sec: number) => `+${sec} s Tokens`,
  },

  packs: {
    starterBundle: {
      name: 'Starter-Bundle',
      blurb: '200 Jetons + Neon-Pad-Skin. Mock-Kauf — keine echte Abbuchung.',
      label: 'Kaufen (Stub)',
    },
    removeAds: {
      name: 'Werbefrei kaufen',
      blurb: 'Entfernt optionale Belohnungs-Werbung dauerhaft. Stub — keine echte Zahlung.',
      label: 'Werbefrei (Stub)',
    },
    obsidian50: {
      name: 'Jeton-Pack S',
      blurb: '50 Jetons. Mock-Gutschrift zum Testen.',
      label: '50 gutschreiben',
    },
    obsidian150: {
      name: 'Jeton-Pack M',
      blurb: '150 Jetons. Mock-Gutschrift.',
      label: '150 gutschreiben',
    },
    obsidian500: {
      name: 'Jeton-Pack L',
      blurb: '500 Jetons. Mock-Gutschrift.',
      label: '500 gutschreiben',
    },
    cosmeticPackLeaf: {
      name: 'Neon-Kosmetik-Pack',
      blurb: 'Schaltet Cyan-Gang + Gold-Token frei. Reine Optik.',
      label: 'Pack freischalten',
    },
    battlePassPremium: {
      name: 'Premium-Track',
      blurb: 'Schaltet die Premium-Spur des Wochen-Passes frei (Stub).',
      label: 'Premium freischalten',
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
    guide: (step: number, total: number) => `Guide · ${step}/${total}`,
    skip: 'Skip',
    welcome: {
      title: 'Halle online',
      body: 'Automaten erzeugen Tokens — auch offline.',
      cta: 'Los',
    },
    upgradePit: {
      title: 'Classic ausbauen',
      body: 'Automat tippen → Ausbauen. Mehr Tokens je Stufe.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Idle bankt',
      body: 'Weg und zurück: Tokens bis zum Cap abholen.',
      cta: 'Klar',
    },
    unlockForge: {
      title: 'Drucker freischalten',
      body: '200 Tokens (oder Classic Lv 10) → Ticketdrucker.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Clan',
      body: 'Optional — Hallen-Slots kommen später.',
      cta: 'Clan',
      skipLabel: 'Skip',
    },
    prestigeTeaser: {
      title: 'Tickets',
      body: 'Prestige → Tickets → dauerhafte Power.',
      cta: 'Fertig',
      skipLabel: 'Zu',
    },
  },

  daily: {
    kicker: 'Tägliche Schicht',
    firstShift: 'Tag 1/7 · Start',
    streakNext: (n: number) => {
      const day = (Math.max(0, n) % 7) + 1
      return `Serie ${n} · Tag ${day}/7`
    },
    streakDotsAria: (n: number) => `Serie ${n} von 7 Tagen`,
    comebackLabel: 'Willkommen zurück · Comeback-Bonus',
    comebackMeta: 'Serie hält — Extra-Bonus für deine Rückkehr',
    claim: 'Abholen',
    claimToast: 'Tägliche Schicht gebucht',
    rewardCompute: (amount: string) => `${amount} ${SOFT_CURRENCY}`,
    rewardCredits: (n: number) => `${n} Tickets`,
    rewardObsidian: (n: number) => `${n} Jetons`,
    rows: {
      float2: `Credit-Float · 2 Min ${SOFT_CURRENCY}`,
      shift3: `Schichtbonus · 3 Min ${SOFT_CURRENCY}`,
      crumb20: 'Jeton-Krümel · 20',
      long4: `Lange Schicht · 4 Min ${SOFT_CURRENCY}`,
      credit1: 'Ticket-Gutschein · 1',
      ot5: `Überstunden · 5 Min ${SOFT_CURRENCY}`,
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
    title: 'Tokenhalle installieren',
    iosBefore: 'iPhone: tippe',
    iosShare: 'Teilen',
    iosMid: '→',
    iosAdd: 'Zum Home-Bildschirm',
    iosAfter: '.',
    androidBody: 'Home-Screen-Icon — ein Tap zurück zur Halle.',
    manualBody: 'Über das Browser-Menü zum Home-Bildschirm hinzufügen.',
    whyHome: 'Immer auf dem Startbildschirm — wie eine App.',
    whyOffline: 'Offline-Tokens laufen weiter, auch unterwegs.',
    whyFast: 'Schneller Wiedereinstieg — Automaten laufen weiter.',
    install: 'Installieren',
    gotIt: 'Verstanden',
    notNow: 'Nicht jetzt',
    skipBrowser: 'Ohne Installation weiterspielen',
  },
} as const

export type ArcadeStrings = typeof arcadeStrings
