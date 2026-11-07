/**
 * German player-facing copy — TurmFarm (Urban Vertical Farm) theme skin.
 * Soft resource: Phyto (artificial currency). Meta: Münzen. Premium stub: Samen.
 * Soft label wired via SOFT_CURRENCY + resources.compute.
 */
const SOFT_CURRENCY = 'Phyto'

export const farmStrings = {
  brand: 'TurmFarm',
  meta: {
    title: 'TurmFarm',
    description: 'TurmFarm — urbane Vertikalfarm. Idle-Phyto, Prestige, Clans.',
    pwaDescription: 'Module erzeugen Phyto offline. Prestige für Münzen.',
  },

  eyebrow: 'Urban Farm',

  nav: {
    ariaLabel: 'Hauptnavigation',
    station: 'Farm',
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
    prestigeReadyDetail: 'Münzen abholen',
    ready: 'Bereit',
    fallback: 'Hof aufbauen',
  },

  resources: {
    compute: SOFT_CURRENCY,
    credits: 'Münzen',
    obsidian: 'Samen',
  },

  modules: {
    emberPit: {
      name: 'Gewächshaus',
      blurb: 'Glasdach + Saatbeete. Start-Phyto.',
    },
    ashForge: {
      name: 'Nährpumpe',
      blurb: 'Nährlösung in den Kreislauf.',
    },
    cinderBarracks: {
      name: 'LED-Wand',
      blurb: 'Vollspektrum-Licht für dichte Beete.',
    },
    cinderVault: {
      name: 'Hydro-Beet',
      blurb: 'Nährstofffilm — ohne Erde.',
    },
    ashWatch: {
      name: 'Vertikalturm',
      blurb: 'Mehr Stockwerke, mehr Phyto.',
    },
    dominionKeep: {
      name: 'Klima',
      blurb: 'Klima und Bewässerung zentral.',
    },
    batteryBank: {
      name: 'Wassertank',
      blurb: 'Wasserreserve für trockene Phasen.',
    },
    edgeCache: {
      name: 'Kompaktbeet',
      blurb: 'Microgreens — schneller Phyto.',
    },
    quantumCooler: {
      name: 'Kompostierer',
      blurb: 'Erntereste → Kompost.',
    },
    packetScrubber: {
      name: 'Aquaponik',
      blurb: 'Abwasser → Nährstoffe.',
    },
  },

  unlock: {
    prefix: 'Freischalten:',
    or: ' oder ',
    computeEarned: (n: string) => `${n} ${SOFT_CURRENCY} verdient`,
    levelOf: (name: string, level: number) => `${name} Stufe ${level}`,
    playerLevel: (level: number) => `Spieler-Level ${level}`,
  },

  hud: {
    burstReady: 'Ernte-Schub',
    burstCooling: 'Schub lädt',
    burstReadyTitle: '~45 s Rate — 1× alle 5 Min',
    burstCoolingTitle: 'Schub im Cooldown',
    offlineBefore: 'Offline gebankt:',
    offlineAfter: `${SOFT_CURRENCY}.`,
    claim: 'Abholen',
    claimToast: `${SOFT_CURRENCY} gebucht`,
    claimCelebrate: (amount: string, xp: number) =>
      `+${amount} ${SOFT_CURRENCY} · +${xp} EP`,
    claimCelebrateShort: (amount: string) => `+${amount} ${SOFT_CURRENCY}`,
    mapAria: 'Farm-Bau-Karte',
    mapHint: 'Modul tippen → online / ausbauen.',
    locked: 'Gesperrt',
    levelShort: (level: number) => `Lv ${level}`,
    gateCompute: (n: string) => `${n} ${SOFT_CURRENCY}`,
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
    bonus: (pct: string) => `+${pct} % ${SOFT_CURRENCY}/s`,
    rewards: {
      ash: (n: number) => `+${n} ${SOFT_CURRENCY}`,
      embers: (n: number) => `+${n} Münzen`,
      obsidian: (n: number) => `+${n} Samen`,
      cosmetic: (name: string) => `Skin: ${name}`,
    },
  },

  branches: {
    title: 'Pfade',
    efficiency: 'Effizienz',
    capacity: 'Kapazität',
    efficiencyBlurb: '+4 % Phyto/s je Rang (max. 5).',
    capacityBlurb: '−3 % Kosten je Rang (max. 5).',
    efficiencyPerRank: '+4 %/Rang',
    capacityPerRank: '−3 %/Rang',
    efficiencyEffect: (pct: number) => `+${pct} % Modul`,
    capacityEffect: (mult: string) => `×${mult} Kosten`,
    rank: (n: number, max: number) => `Rang ${n}/${max}`,
    buy: (name: string, cost: string) => `${name} · ${cost}`,
    maxed: 'Max',
    needOnline: 'Zuerst online schalten.',
  },

  achievements: {
    title: 'Meilensteine',
    intro: 'Einmalig — Belohnung automatisch.',
    done: 'Erledigt',
    rewardAsh: (n: number) => `+${n} ${SOFT_CURRENCY}`,
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
      blurb: 'Verdiene insgesamt 10.000 Phyto.',
    },
    dailyOnce: {
      name: 'Morgenroutine',
      blurb: 'Hole einmal Tägliche Pflege ab.',
    },
    offlineOnce: {
      name: 'Nachtwachstum',
      blurb: 'Hole Offline-Phyto mindestens einmal ab.',
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
    intro: 'Drei Ziele — kein Energie-Limit.',
    claim: 'Abholen',
    claimed: 'Fertig',
    progress: (cur: string, target: string) => `${cur} / ${target}`,
    upgradeTimes: (n: number) => `${n}× ausbauen`,
    earnAsh: (n: string) => `${n} ${SOFT_CURRENCY} verdienen`,
    claimDaily: 'Tägliche Pflege holen',
    rewardLine: (ash: number, seeds: number) =>
      seeds > 0 ? `+${ash} ${SOFT_CURRENCY} · +${seeds} Samen` : `+${ash} ${SOFT_CURRENCY}`,
  },

  upgrade: {
    close: 'Schließen',
    moduleEyebrow: 'Modul',
    level: 'Stufe',
    now: 'jetzt',
    next: 'nächste',
    milestone: 'Nächste Stufe: +2 % Meilenstein.',
    online: 'Online',
    upgrade: 'Ausbauen',
    locked: 'Gesperrt',
    offlineEmpty: 'Offline — erst online schalten.',
    gateClosed: 'Bedingung erfüllen — dann Ausbauen.',
    needMore: (amount: string) => `Noch ${amount} ${SOFT_CURRENCY}`,
    costLine: (action: string, cost: string) =>
      `${action} · ${cost} ${SOFT_CURRENCY}`,
    branchHint: 'Pfade sekundär — Ausbauen bleibt primär.',
  },

  prestige: {
    title: 'Prestige',
    introBefore: 'Soft-Reset. Behalte',
    introAfter: 'für Meta-Power. Module und Phyto dieses Laufs weg.',
    credits: 'Münzen:',
    multiplier: 'Multi:',
    runs: 'Läufe:',
    thisRun: 'Dieser Lauf:',
    gate: 'Schwelle:',
    creditsPreview: (n: number) => `Vorschau +${n} Münzen`,
    nextPayout: 'Nächste Auszahlung:',
    creditsAmount: (n: number) => `+${n} Münzen`,
    claimReset: (n: number) => `+${n} Münzen & Reset`,
    needMore: (amount: string) => `Noch ${amount} ${SOFT_CURRENCY} nötig`,
    emptyGate: 'Mehr Phyto bunkern — dann Prestige.',
    emptyShop: 'Erst prestigieren — dann Münzen-Shop.',
    shopTitle: 'Münzen-Baum',
    shopIntro: 'Drei Äste. Münzen nur aus Prestige — nie Echtgeld.',
    max: 'Max',
    costCredits: (n: number) => `${n} Münzen`,
    keepTitle: 'Behältst du',
    loseTitle: 'Reset',
    keepItems: [
      'Münzen & Meta',
      'Samen, Skins, Streak',
      'Prestige-Zähler',
    ],
    loseItems: [
      'Phyto dieses Laufs',
      'Modul-Stufen',
      'Schwellen-Fortschritt',
    ],
    branchYieldTitle: 'Phyto-Ast',
    branchYieldBlurb: 'Mehr Durchsatz, günstigere Ausbauten.',
    branchUptimeTitle: 'Pflege-Ast',
    branchUptimeBlurb: 'Längeres Offline, stärkere Schübe.',
    branchStartTitle: 'Start-Ast',
    branchStartBlurb: 'Schnellerer Neustart nach Prestige.',
  },

  emberShop: {
    dominionYield: {
      name: 'Farm-Phyto',
      blurb: '+5 % globaler Phyto/s pro Rang.',
      effect: (rank: number) => `+${rank * 5} % ${SOFT_CURRENCY}/s`,
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
    tapMastery: {
      name: 'Ernte-Griff',
      blurb: '+15 s Ernte-Schub-Dauer pro Rang.',
      effect: (rank: number) => `+${rank * 15} s Schub`,
    },
    seedPurse: {
      name: 'Saatgeld-Beutel',
      blurb: 'Starte jeden Prestige-Lauf mit +50 Phyto pro Rang.',
      effect: (rank: number) =>
        rank > 0 ? `+${rank * 50} ${SOFT_CURRENCY} zu Laufbeginn` : 'Kein Startbonus',
    },
  },

  clan: {
    title: 'Clan',
    intro: 'Hof-Slots geteilt — Backend kommt später (Platzhalter).',
    yourClan: 'Dein Clan',
    seasonMeta: 'Saison 0 · Rang 3 · Platzhalter',
    boostActive: (mult: string, left: string) =>
      `Banner ×${mult} · ${left}`,
    boostInactive: 'Kein Boost — Shop → Ernte-Banner',
    leaderboard: 'Rangliste',
    you: '(du)',
    pts: 'Pkt.',
  },

  shop: {
    title: 'Shop',
    intro: 'Komfort & Status — Progress bleibt gratis. Käufe sind Stubs.',
    skipLeftToday: 'Skip heute',
    skipHours: (left: number, cap: number) => `${left}/${cap} h`,
    packsTitle: 'Bundles & Samen',
    packsIntro: 'Mock-Käufe mit Samen. Kein IAP.',
    packEffect: (n: number) => `+${n} Samen`,
    skipsTitle: 'Zeit-Skips',
    skipsIntro: (rate: string, cap: number) =>
      `Live-Rate ${rate}/s · max. ${cap} h/Tag.`,
    dailyCapReached: 'Tageslimit erreicht',
    computeGain: (amount: string) => `+${amount} ${SOFT_CURRENCY}`,
    costObsidian: (n: number) => `${n} Samen`,
    skinsTitle: 'Hof-Skins',
    skinsIntro: 'Nur Optik — null Power.',
    equipped: 'An',
    active: 'Aktiv',
    equip: 'Ausrüsten',
    free: 'Gratis',
    owned: 'Besitzt',
    clanBoostTitle: 'Clan-Boost',
    clanBoostIntro: 'Kurzer Clan-Buff. Auffrischen verlängert.',
    boostActiveShort: (mult: string, left: string) =>
      `Aktiv ×${mult} · ${left}`,
    boostInactiveShort: 'Inaktiv',
    adsTitle: 'Bonus-Werbung',
    adsIntro: 'Optional — Spielen geht immer ohne.',
    adsWatch: 'Werbung ansehen',
    adsWatching: 'Läuft…',
    adsCooldown: (left: string) => `Cooldown ${left}`,
    adsRemovedBadge: 'Werbefrei',
    adsRewardSkip: (mins: number, amount: string) =>
      `+${mins} Min Skip (${amount})`,
    adsRewardObsidian: (n: number) => `+${n} Samen`,
    adsRewardYield: (mins: number, amount: string) =>
      `+${mins} Min ${SOFT_CURRENCY} (${amount})`,
    removeAdsTitle: 'Werbefrei',
    removeAdsIntro: 'Einmal-Stub — Werbung dauerhaft weg.',
    yieldBoostTitle: 'Phyto-Schub',
    yieldBoostIntro: '+15 % Phyto · 30 Min · Samen.',
    yieldBoostActive: (mult: string, left: string) =>
      `Aktiv ×${mult} · ${left}`,
    yieldBoostInactive: 'Inaktiv',
    yieldBoostBuy: (cost: number) => `${cost} Samen`,
    currencyPacksTitle: 'Samen-Packs',
    currencyPacksIntro: 'Mock-Gutschriften zum Testen.',
    cosmeticPacksTitle: 'Kosmetik-Packs',
    cosmeticPacksIntro: 'Mehrere Skins · Stub.',
    battlePassTitle: 'Wochen-Pass',
    battlePassIntro: 'Free + Premium-Stub. XP via Pflege/Ads.',
    battlePassXp: (xp: number, max: number) => `${xp}/${max} XP`,
    battlePassDailyXp: 'Tages-XP',
    battlePassDailyDone: 'Tages-XP fertig',
    battlePassFree: 'Gratis',
    battlePassPremium: 'Premium',
    battlePassClaim: 'Abholen',
    battlePassClaimed: 'Fertig',
    battlePassLocked: 'Gesperrt',
    battlePassNeedXp: (xp: number) => `Ab ${xp} XP`,
    battlePassNeedPremium: 'Premium nötig',
    rewardObsidian: (n: number) => `+${n} Samen`,
    rewardComputeSec: (sec: number) => `+${sec} s ${SOFT_CURRENCY}`,
  },

  packs: {
    starterBundle: {
      name: 'Starter-Bundle',
      blurb: '200 Samen + Erde-Pad. Stub.',
      label: 'Kaufen',
    },
    removeAds: {
      name: 'Werbefrei',
      blurb: 'Belohnungs-Werbung dauerhaft weg. Stub.',
      label: 'Werbefrei',
    },
    obsidian50: {
      name: 'Samen-Pack S',
      blurb: '50 Samen.',
      label: '+50',
    },
    obsidian150: {
      name: 'Samen-Pack M',
      blurb: '150 Samen.',
      label: '+150',
    },
    obsidian500: {
      name: 'Samen-Pack L',
      blurb: '500 Samen.',
      label: '+500',
    },
    cosmeticPackLeaf: {
      name: 'Blatt-Pack',
      blurb: 'Blatt-Gang + Gold-Ernte. Nur Optik.',
      label: 'Freischalten',
    },
    battlePassPremium: {
      name: 'Premium-Track',
      blurb: 'Wochen-Pass Premium. Stub.',
      label: 'Premium',
    },
  },

  timeSkips: {
    cycleHour: {
      name: 'Ernte-Stunde',
      blurb: '1 h Produktion · Live-Rate.',
    },
    orbitSurge: {
      name: 'Wachstums-Schub',
      blurb: '4 h Produktion · Live-Rate.',
    },
  },

  cosmetics: {
    steelDeck: {
      name: 'Hell-Hof',
      blurb: 'Standard-Boden.',
    },
    amberPad: {
      name: 'Erde-Pad',
      blurb: 'Warme Erdwäsche.',
    },
    iceAisle: {
      name: 'Blatt-Gang',
      blurb: 'Frisches Blattgrün.',
    },
    goldOps: {
      name: 'Gold-Ernte',
      blurb: 'Gold-Trim — Status.',
    },
  },

  clanBoost: {
    name: 'Ernte-Banner',
    blurb: '+10 % Clan · 1 h · max ×1,25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Guide · ${step}/${total}`,
    skip: 'Überspringen',
    welcome: {
      title: 'Farm online',
      body: 'Module erzeugen Phyto — auch offline.',
      cta: 'Hof öffnen',
    },
    upgradePit: {
      title: 'Ausbauen',
      body: 'Gewächshaus tippen → Ausbauen.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Idle bankt',
      body: 'Weg sein → zurückkommen → Abholen.',
      cta: 'Verstanden',
    },
    unlockForge: {
      title: 'Pumpe frei',
      body: '600 Phyto oder GH Lv 10 → Pumpe.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Clan',
      body: 'Optional — später mehr.',
      cta: 'Clan öffnen',
      skipLabel: 'Überspringen',
    },
    prestigeTeaser: {
      title: 'Münzen',
      body: 'Prestige → Münzen für Meta-Power.',
      cta: 'Fertig',
      skipLabel: 'Schließen',
    },
  },

  daily: {
    kicker: 'Tägliche Pflege',
    firstShift: 'Erste Schicht',
    streakNext: (n: number) => `Serie ${n}`,
    streakDotsAria: (n: number) => `Serie ${n} von 7`,
    comebackLabel: 'Comeback-Bonus',
    comebackMeta: 'Willkommen zurück',
    claim: 'Abholen',
    claimToast: 'Pflege gebucht',
    rewardCompute: (amount: string) => `${amount} ${SOFT_CURRENCY}`,
    rewardCredits: (n: number) => `${n} Münzen`,
    rewardObsidian: (n: number) => `${n} Samen`,
    rows: {
      float2: '2 Min Phyto',
      shift3: '3 Min Phyto',
      crumb20: '20 Samen',
      long4: '4 Min Phyto',
      credit1: '1 Münze',
      ot5: '5 Min Phyto',
      weekSeal: 'Wochen-Siegel',
    },
  },

  event: {
    name: 'Wachstums-Schub',
    blurb: '+25 % Phyto/s · Wochenende.',
    endsFri: 'Bis Sonntag',
    endsSat: 'Bis morgen',
    endsSun: 'Bis heute Abend',
    endsDefault: 'Wochenende',
    goalAria: 'Event-Ziel',
    goalLine: (progress: string, reward: number) =>
      `${progress} → ${reward} Samen`,
    claimGoal: 'Belohnen',
    claimed: 'Abgeholt',
    dismiss: 'Schließen',
  },

  install: {
    title: 'TurmFarm installieren',
    iosBefore: 'iPhone: tippe',
    iosShare: 'Teilen',
    iosMid: '→',
    iosAdd: 'Zum Home-Bildschirm',
    iosAfter: '.',
    androidBody: 'Home-Screen-Icon — ein Tap zurück zur Farm.',
    manualBody: 'Über das Browser-Menü zum Home-Bildschirm hinzufügen.',
    whyHome: 'Immer auf dem Startbildschirm — wie eine App.',
    whyOffline: 'Offline-Phyto läuft weiter, auch unterwegs.',
    whyFast: 'Schneller Wiedereinstieg — Beete wachsen weiter.',
    install: 'Installieren',
    gotIt: 'Verstanden',
    notNow: 'Nicht jetzt',
    skipBrowser: 'Ohne Installation weiterspielen',
  },
} as const

export type FarmStrings = typeof farmStrings
