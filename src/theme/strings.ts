/**
 * German player-facing copy — Gartenerbe.
 *
 * Story: Oma hat dir ihren verwilderten Schrebergarten vererbt. Ihr Notizbuch
 * (Erzählstimme) führt dich vom Brombeer-Dickicht bis zum Gartenpark.
 *
 * Currencies: Ernte (soft, per run) · Erbstücke (meta, survives Saisonende)
 * · Samen (premium stub). Prestige = Saisonende (Winterruhe → neues Gartenjahr).
 */
const SOFT = 'Ernte'
const SEEDS = 'Samen'

/** „1 Erbstück“ / „3 Erbstücke“ */
function erb(n: number): string {
  return `${n} ${n === 1 ? 'Erbstück' : 'Erbstücke'}`
}

export const strings = {
  brand: 'Gartenerbe',
  tagline: 'Vom Schrebergarten zum Gartenpark',
  meta: {
    title: 'Gartenerbe',
    description:
      'Gartenerbe — vom Schrebergarten zum Gartenpark. Dein Garten wächst auch offline.',
    pwaDescription: 'Omas Garten wächst weiter, auch wenn du weg bist.',
  },

  eyebrow: 'Omas Garten',

  /** Garden growth stage — derived from modules angelegt (0–10). */
  gardenStage: {
    aria: (name: string) => `Gartenstufe: ${name}`,
    names: [
      'Verwilderte Parzelle',
      'Verwilderte Parzelle',
      'Schrebergarten',
      'Schrebergarten',
      'Nutzgarten',
      'Gärtnerei',
      'Gärtnerei',
      'Hofgarten',
      'Hofgarten',
      'Schaugarten',
      'Gartenpark',
    ],
  },

  nav: {
    ariaLabel: 'Hauptnavigation',
    station: 'Garten',
    prestige: 'Saison',
    clan: 'Verein',
    shop: 'Markt',
    menu: 'Menü',
    menuClose: 'Menü schließen',
    backToMap: 'Zum Garten',
  },

  sound: {
    label: 'Ton',
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
    upgradeDetail: (cost: string) => `${cost} ${SOFT}`,
    unlockTitle: (name: string) => `Roden: ${name}`,
    unlockAshLeft: (n: string) => `noch ${n} ${SOFT}`,
    unlockLevel: (name: string, have: number, need: number) =>
      `${name} ${have}/${need}`,
    unlockPlayerLevel: (have: number, need: number) =>
      `Gärtnerstufe ${have}/${need}`,
    levelTitle: (n: number) => `Gärtnerstufe ${n}`,
    levelDetail: (into: number, need: number) => `${into}/${need} EP`,
    prestigeTitle: 'Saisonende',
    prestigeDetail: (left: string) => `noch ${left} ${SOFT}`,
    prestigeReady: 'Saisonende bereit',
    prestigeReadyDetail: 'Erbstücke einlagern',
    ready: 'Bereit',
    fallback: 'Garten pflegen',
    nearMiss: (pct: number) => `fast · ${pct}%`,
  },

  bestBuy: {
    tipAffordable: (name: string) => `Tipp: ${name}`,
    tipSoon: (name: string) => `Bald: ${name}`,
    tipCost: (name: string, cost: string) => `Tipp: ${name} · ${cost}`,
    tipHold: 'Tippen öffnet · Halten = mehrfach',
    aria: 'Omas Tipp für den nächsten Ausbau — tippen zum Öffnen',
  },

  surprise: {
    milestone: (amount: string) => `Prachtstück! +${amount}`,
    jackpot: (amount: string) => `Rekordernte! +${amount}`,
    prestigeNear: (amount: string) => `Saisonende naht +${amount}`,
    offlineJackpot: (amount: string) => `Über Nacht gewachsen +${amount}`,
  },

  flash: {
    name: 'Sonnenfenster',
    blurb: '+15 % Ernte/s · die Sonne kommt raus.',
    endsMin: (m: number, s: number) =>
      s > 0 ? `Noch ${m}:${String(s).padStart(2, '0')}` : `Noch ${m} Min`,
    endsSec: (s: number) => `Noch ${s}s`,
    endsSoon: 'Wolken ziehen auf',
    graceLabel: 'Belohnung noch abholen',
    goalAria: 'Sonnenfenster-Ziel',
    goalLine: (progress: string, reward: number) =>
      `${progress} → ${reward} ${SEEDS}`,
    claimGoal: 'Belohnen',
    claimed: 'Abgeholt',
    dismiss: 'Schließen',
  },

  resources: {
    compute: SOFT,
    credits: 'Erbstücke',
    samen: SEEDS,
  },

  /**
   * Ten garden modules. `blurb` = what it does; `note` = Omas Notizbuch.
   * Order follows the economy ladder G1 → G10.
   */
  modules: {
    gemuesebeet: {
      name: 'Gemüsebeet',
      blurb: 'Radieschen, Salat, Bohnen — die erste Ernte.',
      note: '„Fang klein an. Ein Beet, gut gepflegt, ernährt mehr als zehn vergessene.“',
    },
    kompost: {
      name: 'Kompost',
      blurb: 'Aus Resten wird schwarzes Gold für alle Beete.',
      note: '„Was der Garten nimmt, gibt der Kompost zurück. Nichts wird verschwendet.“',
    },
    kraeuterspirale: {
      name: 'Kräuterspirale',
      blurb: 'Thymian oben, Minze unten — duftet nach Sommer.',
      note: '„Steine speichern die Sonne. Die Kräuter danken es dir.“',
    },
    beerenhecke: {
      name: 'Beerenhecke',
      blurb: 'Johannis-, Stachel- und Himbeeren für Marmelade.',
      note: '„Die Brombeeren von früher wollten nur ein ordentliches Spalier.“',
    },
    obstwiese: {
      name: 'Obstwiese',
      blurb: 'Apfel, Birne, Zwetschge — Ernte vom Baum.',
      note: '„Opa hat den ersten Apfelbaum gepflanzt. Pflanz du den nächsten.“',
    },
    bienenstock: {
      name: 'Bienenstock',
      blurb: 'Honig und bestäubte Blüten im ganzen Garten.',
      note: '„Ohne Bienen kein Obst. Sprich freundlich mit ihnen.“',
    },
    huehnerstall: {
      name: 'Hühnerstall',
      blurb: 'Frische Eier und fleißige Schneckenjäger.',
      note: '„Hühner fressen Schnecken und geben Eier. Bessere Nachbarn gibt’s nicht.“',
    },
    gewaechshaus: {
      name: 'Gewächshaus',
      blurb: 'Tomaten und Paprika — auch wenn es draußen kühl wird.',
      note: '„Unter Glas wird der Sommer länger. Lüften nicht vergessen!“',
    },
    hofladen: {
      name: 'Hofladen',
      blurb: 'Kisten, Gläser, Kundschaft — die Ernte findet Abnehmer.',
      note: '„Wenn die Nachbarn fragen, ob sie kaufen dürfen, hast du es geschafft.“',
    },
    orangerie: {
      name: 'Orangerie',
      blurb: 'Zitronen und Feigen unter Glaskuppeln — das Kronjuwel.',
      note: '„Davon habe ich immer geträumt. Jetzt ist es dein Garten.“',
    },
  },

  unlock: {
    prefix: 'Roden ab:',
    or: ' oder ',
    computeEarned: (n: string) => `${n} ${SOFT} geerntet`,
    levelOf: (name: string, level: number) => `${name} Stufe ${level}`,
    playerLevel: (level: number) => `Gärtnerstufe ${level}`,
    seasonGate: (year: number) =>
      `Diese Ecke roden wir erst im ${year}. Gartenjahr.`,
    seasonShort: (year: number) => `ab Gartenjahr ${year}`,
  },

  hud: {
    burstReady: 'Gießen',
    burstCooling: 'Kanne füllt sich',
    burstReadyTitle: 'Gießkanne: ~45 s Ernte sofort — alle 5 Min',
    burstCoolingTitle: 'Die Gießkanne füllt sich wieder',
    offlineBefore: 'Während du weg warst, ist gewachsen:',
    offlineAfter: `${SOFT}.`,
    claim: 'Ernten',
    claimToast: 'Ernte eingefahren',
    claimCelebrate: (amount: string, xp: number) =>
      `+${amount} ${SOFT} · +${xp} EP`,
    claimCelebrateShort: (amount: string) => `+${amount} ${SOFT}`,
    mapAria: 'Dein Garten',
    mapHint: 'Beet antippen → anlegen oder ausbauen.',
    locked: 'Wildnis',
    levelShort: (level: number) => `Stufe ${level}`,
    gateCompute: (n: string) => `${n} ${SOFT}`,
    buildingAriaUnlocked: (name: string, level: number, rate: string) =>
      `${name}, Stufe ${level}, ${rate}. Tippen zum Ausbauen.`,
    buildingAriaLocked: (name: string, hint: string) =>
      `${name}, noch Wildnis. ${hint}`,
    playerLevelAria: (level: number, xp: number, need: number) =>
      `Gärtnerstufe ${level}, ${xp} von ${need} EP`,
    progressOpen: 'Ziele & Meilensteine',
    progressClose: 'Schließen',
    levelUp: (n: number) => `Gärtnerstufe ${n}!`,
    waterCooling: (clock: string) => `Kanne füllt sich · ${clock}`,
    claimAria: (amount: string) => `Ernte einfahren: ${amount}`,
    walletAria: (amount: string, rate: string) => `${amount} Ernte, ${rate}`,
    gardenAria: (stage: string, level: number) =>
      `${stage}, Gärtnerstufe ${level}. Ziele und Meilensteine öffnen`,
    questReady: 'Aufgabe erledigt — abholen',
  },

  level: {
    label: 'Gärtnerstufe',
    short: 'Stufe',
    xp: 'EP',
    bonus: (pct: string) => `+${pct} % ${SOFT}/s`,
    rewards: {
      ernte: (n: number) => `+${n} ${SOFT}`,
      erbstuecke: (n: number) => `+${erb(n)}`,
      samen: (n: number) => `+${n} ${SEEDS}`,
      cosmetic: (name: string) => `Gartenstil: ${name}`,
    },
  },

  branches: {
    title: 'Pflege',
    efficiency: 'Düngen',
    capacity: 'Mulchen',
    efficiencyBlurb: '+4 % Ernte/s je Rang (max. 5).',
    capacityBlurb: '−3 % Ausbaukosten je Rang (max. 5).',
    efficiencyPerRank: '+4 %/Rang',
    capacityPerRank: '−3 %/Rang',
    efficiencyEffect: (pct: number) => `+${pct} % Ertrag`,
    capacityEffect: (mult: string) => `×${mult} Kosten`,
    rank: (n: number, max: number) => `Rang ${n}/${max}`,
    buy: (name: string, cost: string) => `${name} · ${cost}`,
    maxed: 'Max',
    needOnline: 'Erst anlegen.',
  },

  achievements: {
    title: 'Meilensteine',
    intro: 'Einmalig — Oma hakt sie im Notizbuch ab.',
    done: 'Abgehakt',
    rewardAsh: (n: number) => `+${n} ${SOFT}`,
    rewardEmbers: (n: number) => `+${erb(n)}`,
    rewardObsidian: (n: number) => `+${n} ${SEEDS}`,
    rewardCosmetic: (name: string) => `Gartenstil: ${name}`,
    firstUpgrade: {
      name: 'Erster Spatenstich',
      blurb: 'Baue zum ersten Mal etwas aus.',
    },
    bedTen: {
      name: 'Prachtbeet',
      blurb: 'Bringe das Gemüsebeet auf Stufe 10.',
    },
    compostOnline: {
      name: 'Schwarzes Gold',
      blurb: 'Lege den Kompost an.',
    },
    earn10k: {
      name: 'Volle Speisekammer',
      blurb: 'Ernte insgesamt 10.000 Ernte.',
    },
    dailyOnce: {
      name: 'Morgenrunde',
      blurb: 'Hole einmal die Tägliche Gartenrunde ab.',
    },
    offlineOnce: {
      name: 'Über Nacht gewachsen',
      blurb: 'Fahre einmal die Ernte ein, die ohne dich gewachsen ist.',
    },
    fiveOnline: {
      name: 'Kein Unkraut mehr',
      blurb: 'Habe fünf Bereiche gleichzeitig angelegt.',
    },
    levelFive: {
      name: 'Grüner Daumen',
      blurb: 'Erreiche Gärtnerstufe 5.',
    },
    prestigeOnce: {
      name: 'Erste Winterruhe',
      blurb: 'Schließe deine erste Saison ab.',
    },
    upgradesFifty: {
      name: 'Fleißige Hände',
      blurb: 'Baue insgesamt 50-mal aus.',
    },
  },

  quests: {
    title: 'Aufgaben für heute',
    intro: 'Drei Zettel von Oma — ohne Zeitdruck.',
    claim: 'Abholen',
    claimed: 'Erledigt',
    progress: (cur: string, target: string) => `${cur} / ${target}`,
    upgradeTimes: (n: number) => `${n}× ausbauen`,
    earnAsh: (n: string) => `${n} ${SOFT} einfahren`,
    claimDaily: 'Gartenrunde abholen',
    rewardLine: (ernte: number, seeds: number) =>
      seeds > 0 ? `+${ernte} ${SOFT} · +${seeds} ${SEEDS}` : `+${ernte} ${SOFT}`,
  },

  upgrade: {
    close: 'Schließen',
    moduleEyebrow: 'Gartenbereich',
    noteLabel: 'Aus Omas Notizbuch',
    level: 'Stufe',
    now: 'jetzt',
    next: 'danach',
    milestone: 'Alle 10 Stufen: +2 % Prachtbonus.',
    online: 'Anlegen',
    upgrade: 'Ausbauen',
    locked: 'Noch Wildnis',
    offlineEmpty: 'Noch nicht angelegt.',
    gateClosed: 'Erst roden — dann anlegen.',
    needMore: (amount: string) => `Noch ${amount} ${SOFT}`,
    costLine: (action: string, cost: string) => `${action} · ${cost} ${SOFT}`,
    branchHint: 'Pflege ist ein Extra — Ausbauen bringt am meisten.',
    holdHint: 'Halten = mehrfach ausbauen',
  },

  prestige: {
    title: 'Saisonende',
    introBefore: 'Der Garten geht in die Winterruhe. Du behältst',
    introAfter:
      'für das nächste Gartenjahr. Beete und Ernte dieser Saison ruhen bis zum Frühling.',
    credits: 'Erbstücke:',
    multiplier: 'Erbe-Bonus:',
    runs: 'Gartenjahre:',
    thisRun: 'Diese Saison:',
    gate: 'Ab:',
    creditsPreview: (n: number) => `Vorschau +${erb(n)}`,
    nextPayout: 'Jetzt einlagern:',
    longerHint: 'länger gärtnern bringt bis zu doppelt so viel',
    creditsAmount: (n: number) => `+${erb(n)}`,
    claimReset: (n: number) => `Winterruhe · +${erb(n)}`,
    claimResetRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Winterruhe · +${erb(n)} — Truhe öffnet nach ~${mods} Ausbauten`
        : `Winterruhe · +${erb(n)} — Truhe öffnet beim Neuanlegen`,
    needMore: (amount: string) => `Noch ${amount} ${SOFT} bis zum Saisonende`,
    needEmbers: (have: number, need: number) =>
      `Noch ${need - have} Erbstück-Wert (min. ${need}) — die Saison lohnt sich noch`,
    needModules: (have: number, need: number) =>
      `Erst ${need} Bereiche anlegen (jetzt ${have})`,
    emptyGate: 'Mehr ernten — dann Saisonende.',
    emptyShop: 'Nach dem ersten Saisonende öffnet sich Omas Truhe.',
    shopTitle: 'Omas Truhe',
    shopIntro:
      'Erbstücke aus vergangenen Saisons machen jedes neue Gartenjahr stärker. Weitere Schätze finden sich beim Neuanlegen.',
    shopReady: (n: number) =>
      n === 1
        ? '1 Schatz bereit — beim Neuanlegen kommen mehr.'
        : `${n} Schätze bereit — beim Neuanlegen kommen mehr.`,
    shopWaiting: (name: string, nextRank: number, pct: number) =>
      `Als Nächstes: ${name} Rang ${nextRank} (${pct}%) — weiter ausbauen.`,
    shopUnlockAria: (name: string) => `Fortschritt bis ${name}`,
    shopNextTag: 'Als Nächstes',
    shopRankLocked: (need: string) =>
      `Noch ${need} Fortschritt (Ausbauten / Ernte)`,
    shopRankLockedProgress: (pct: number, left: string) =>
      `${pct}% — noch ${left} Fortschritt`,
    shopModulesLocked: (need: number) =>
      `Erst ${need} Bereiche in dieser Saison anlegen`,
    max: 'Max',
    costCredits: (n: number) => erb(n),
    spendCta: (n: number) =>
      n === 1 ? 'Omas Truhe · 1 Schatz bereit' : `Omas Truhe · ${n} Schätze bereit`,
    spendAria: 'Omas Truhe öffnen — Schätze bereit',
    keepTitle: 'Bleibt',
    loseTitle: 'Ruht bis Frühling',
    keepItems: ['Erbstücke & Truhe', 'Samen, Gartenstile, Serie', 'Gartenjahre'],
    loseItems: ['Ernte dieser Saison', 'Ausbaustufen', 'Fortschritt zum Saisonende'],
    branchYieldTitle: 'Ertrag',
    branchYieldBlurb: 'Mehr Ernte, günstigere Ausbauten.',
    branchUptimeTitle: 'Pflege',
    branchUptimeBlurb: 'Länger offline wachsen, kräftiger gießen.',
    branchStartTitle: 'Frühstart',
    branchStartBlurb: 'Schneller ins neue Gartenjahr.',
    worthItCta: (n: number) => `Saisonende lohnt sich · +${erb(n)}`,
    worthItNear: (n: number) => `Saisonende naht · +${erb(n)}`,
    worthItAria: 'Saisonende öffnen — Erbstück-Vorschau',
    worthItRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Saisonende bereit · +${erb(n)} — Truhe nach ~${mods} Ausbauten`
        : `Saisonende bereit · +${erb(n)} — Truhe beim Neuanlegen`,
    worthItNearRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Saisonende naht · +${erb(n)} — Truhe nach ~${mods} Ausbauten`
        : `Saisonende naht · +${erb(n)} — Truhe beim Neuanlegen`,
    pill: (n: number) => `Saisonende · +${erb(n)}`,
    pillReady: 'Omas Truhe',
    worthItRebuildAria:
      'Saisonende öffnen — Erbstücke kommen, Truhe beim Neuanlegen',
  },

  longLoop: {
    title: 'Tiefer Winter',
    intro:
      'Wenn alle Ecken offen sind, kann der Garten einen langen Winter ruhen. Danach fängst du im ersten Gartenjahr neu an — mit Sprösslingen, die für immer bleiben.',
    sprouts: 'Sprösslinge',
    winters: 'Tiefe Winter',
    payout: 'Jetzt',
    keepItems: ['Sprösslinge & ihre Boni', 'Samen, Gartenstile, Serie', 'Gärtnerstufe, Omas Briefe'],
    loseTitle: 'Neu im Frühling',
    loseItems: ['Gartenjahre', 'Erbstücke & Omas Truhe', 'Beete und Ernte'],
    cta: (n: number) => `Tiefer Winter · +${n} Sprösslinge`,
    gateClosed: (year: number) => `Möglich ab Gartenjahr ${year}`,
    confirmCta: 'Wirklich? Nochmal tippen — der Garten ruht',
    shopTitle: 'Sprösslings-Laden',
    rank: (rank: number, max: number) => `Rang ${rank}/${max}`,
    cost: (n: number) => `${n} Sprösslinge`,
    items: {
      deepYield: {
        name: 'Tiefe Wurzeln',
        blurb: '+10 % Ernte/s pro Rang — für immer.',
        effect: (rank: number) => `+${rank * 10} % ${SOFT}/s`,
      },
      deepWatch: {
        name: 'Winterschutz',
        blurb: 'Länger offline wachsen: +1 h / +2 h max. pro Rang.',
        effect: (rank: number) => `+${rank} h / +${rank * 2} h max.`,
      },
      deepPurse: {
        name: 'Saatgutvorrat',
        blurb: 'Jeder Neubeginn startet mit 60 Erbstücken pro Rang.',
        effect: (rank: number) => `${rank * 60} Erbstücke zum Start`,
      },
      deepStart: {
        name: 'Gartenwissen',
        blurb: 'Jede Gartenecke lässt sich ein Gartenjahr früher roden.',
        effect: (rank: number) => (rank > 0 ? `${rank} Jahr(e) früher` : 'Noch nicht'),
      },
    },
  },

  emberShop: {
    dominionYield: {
      name: 'Omas Gartenschere',
      blurb: '+5 % Ernte/s pro Rang. Höhere Ränge beim Neuanlegen.',
      effect: (rank: number) => `+${rank * 5} % ${SOFT}/s`,
    },
    longWatch: {
      name: 'Alte Gießkanne',
      blurb: 'Länger offline wachsen: +1 h weich, +2 h max. pro Rang.',
      effect: (rank: number) => `+${rank} h / +${rank * 2} h max.`,
    },
    foundryDiscount: {
      name: 'Saatgutkiste',
      blurb: '−2 % auf alle Ausbaukosten pro Rang.',
      effect: (rank: number) => `×${Math.pow(0.98, rank).toFixed(3).replace('.', ',')} Kosten`,
    },
    firstFlame: {
      name: 'Kompost vom Vorjahr',
      blurb: 'Jede Saison startet mit angelegtem Kompost.',
      effect: (rank: number) => (rank > 0 ? 'Kompost von Beginn an' : 'Noch nicht'),
    },
    tapMastery: {
      name: 'Messing-Brause',
      blurb: '+15 s mehr Ernte pro Gießen, pro Rang.',
      effect: (rank: number) => `+${rank * 15} s Gießen`,
    },
    seedPurse: {
      name: 'Notgroschen',
      blurb: 'Jede Saison startet mit +80 Ernte pro Rang.',
      effect: (rank: number) =>
        rank > 0 ? `+${rank * 80} ${SOFT} zum Start` : 'Kein Startvorrat',
    },
    canopyBoost: {
      name: 'Strohhut',
      blurb: '+2 % Ernte/s — erste Ränge sofort, spätere beim Neuanlegen.',
      effect: (rank: number) => `+${(rank * 2).toFixed(0)} % ${SOFT}/s`,
    },
    nightSoil: {
      name: 'Laterne',
      blurb: '+30 Min weich und +1 h max. offline pro Rang.',
      effect: (rank: number) => `+${String(rank * 0.5).replace('.', ',')} h / +${rank} h max.`,
    },
    saplingSurge: {
      name: 'Gute Erde',
      blurb: 'Das Gemüsebeet startet auf dieser Stufe.',
      effect: (rank: number) =>
        rank > 0 ? `Gemüsebeet startet auf Stufe ${rank}` : 'Kein Vorsprung',
    },
    greenLattice: {
      name: 'Rosenbogen',
      blurb: '+1,5 % Ernte/s — öffnet sich beim Neuanlegen.',
      effect: (rank: number) => `+${(rank * 1.5).toFixed(1).replace('.', ',')} % ${SOFT}/s`,
    },
  },

  clan: {
    title: 'Kleingartenverein',
    intro: 'Gemeinsam gärtnern — echte Mitglieder kommen bald. Rangliste ist Vorschau.',
    yourClan: 'Dein Verein',
    seasonMeta: 'Vereinssaison 0 · Platz 3 · Vorschau',
    boostActive: (mult: string, left: string) => `Vereinsfahne ×${mult} · ${left}`,
    boostInactive: 'Keine Fahne gehisst — Markt → Vereinsfahne',
    leaderboard: 'Vereinswertung',
    you: '(du)',
    pts: 'Pkt.',
    yourName: 'KGV Sonnenblume',
    rivals: [
      'Am Mühlbach e.V.',
      'Grüne Aue',
      'Rosenhain',
      'Kleine Freiheit',
      'Lindenhof',
      'Am Bahndamm',
    ],
  },

  shop: {
    title: 'Markt',
    intro: 'Komfort & Gartenstile — Fortschritt bleibt gratis. Käufe sind Platzhalter.',
    skipLeftToday: 'Zeitsprung heute',
    skipHours: (left: number, cap: number) => `${left}/${cap} h`,
    packsTitle: 'Pakete & Samen',
    packsIntro: 'Testkäufe mit Samen. Noch keine echten Käufe.',
    packEffect: (n: number) => `+${n} ${SEEDS}`,
    skipsTitle: 'Zeitsprünge',
    skipsIntro: (rate: string, cap: number) =>
      `Aktuelle Ernte ${rate}/s · max. ${cap} h pro Tag.`,
    dailyCapReached: 'Für heute genug',
    computeGain: (amount: string) => `+${amount} ${SOFT}`,
    costObsidian: (n: number) => `${n} ${SEEDS}`,
    skinsTitle: 'Gartenstile',
    skinsIntro: 'Nur fürs Auge — kein Vorteil.',
    equipped: 'Aktiv',
    active: 'Aktiv',
    equip: 'Verwenden',
    free: 'Gratis',
    owned: 'Gehört dir',
    clanBoostTitle: 'Vereinsfahne',
    clanBoostIntro: 'Kurzer Bonus für den Verein. Erneut hissen verlängert.',
    boostActiveShort: (mult: string, left: string) => `Aktiv ×${mult} · ${left}`,
    boostInactiveShort: 'Nicht gehisst',
    adsTitle: 'Bonus-Werbung',
    adsIntro: 'Freiwillig — spielen geht immer ohne.',
    adsWatch: 'Werbung ansehen',
    adsWatching: 'Läuft…',
    adsCooldown: (left: string) => `Wieder in ${left}`,
    adsRemovedBadge: 'Werbefrei',
    adsRewardSkip: (mins: number, amount: string) =>
      `+${mins} Min Zeitsprung (${amount})`,
    adsRewardObsidian: (n: number) => `+${n} ${SEEDS}`,
    adsRewardYield: (mins: number, amount: string) =>
      `+${mins} Min ${SOFT} (${amount})`,
    removeAdsTitle: 'Werbefrei',
    removeAdsIntro: 'Einmal kaufen — Werbung dauerhaft weg. Platzhalter.',
    yieldBoostTitle: 'Dünger',
    yieldBoostIntro: '+15 % Ernte · 30 Min · für Samen.',
    yieldBoostActive: (mult: string, left: string) => `Aktiv ×${mult} · ${left}`,
    yieldBoostInactive: 'Nicht aktiv',
    yieldBoostBuy: (cost: number) => `${cost} ${SEEDS}`,
    currencyPacksTitle: 'Samentüten',
    currencyPacksIntro: 'Testgutschriften.',
    cosmeticPacksTitle: 'Stil-Pakete',
    cosmeticPacksIntro: 'Mehrere Gartenstile · Platzhalter.',
    battlePassTitle: 'Gartenwoche',
    battlePassIntro: 'Gratis- und Premium-Reihe. EP aus Gartenrunde & Werbung.',
    battlePassXp: (xp: number, max: number) => `${xp}/${max} EP`,
    battlePassDailyXp: 'Tages-EP',
    battlePassDailyDone: 'Tages-EP geholt',
    battlePassFree: 'Gratis',
    battlePassPremium: 'Premium',
    battlePassClaim: 'Abholen',
    battlePassClaimed: 'Erledigt',
    battlePassLocked: 'Gesperrt',
    battlePassNeedXp: (xp: number) => `Ab ${xp} EP`,
    battlePassNeedPremium: 'Premium nötig',
    rewardObsidian: (n: number) => `+${n} ${SEEDS}`,
    rewardComputeSec: (sec: number) => `+${sec} s ${SOFT}`,
  },

  packs: {
    starterBundle: {
      name: 'Startpaket',
      blurb: '200 Samen + Gartenstil Bauerngarten. Platzhalter.',
      label: 'Kaufen',
    },
    removeAds: {
      name: 'Werbefrei',
      blurb: 'Bonus-Werbung dauerhaft weg. Platzhalter.',
      label: 'Werbefrei',
    },
    obsidian50: {
      name: 'Samentüte S',
      blurb: '50 Samen.',
      label: '+50',
    },
    obsidian150: {
      name: 'Samentüte M',
      blurb: '150 Samen.',
      label: '+150',
    },
    obsidian500: {
      name: 'Samentüte L',
      blurb: '500 Samen.',
      label: '+500',
    },
    cosmeticPackLeaf: {
      name: 'Blüten-Paket',
      blurb: 'Blütenmeer + Goldener Herbst. Nur fürs Auge.',
      label: 'Freischalten',
    },
    battlePassPremium: {
      name: 'Premium-Reihe',
      blurb: 'Gartenwoche Premium. Platzhalter.',
      label: 'Premium',
    },
  },

  timeSkips: {
    harvestHour: {
      name: 'Eine Stunde Sonne',
      blurb: '1 h Ernte sofort · aktuelle Rate.',
    },
    growthDay: {
      name: 'Warmer Nachmittag',
      blurb: '4 h Ernte sofort · aktuelle Rate.',
    },
  },

  cosmetics: {
    wiese: {
      name: 'Sommerwiese',
      blurb: 'Saftiges Gras, klassisch.',
    },
    bauerngarten: {
      name: 'Bauerngarten',
      blurb: 'Warme Erde, Holzzaun, Ringelblumen.',
    },
    bluetenmeer: {
      name: 'Blütenmeer',
      blurb: 'Kirschblüten und Lavendel.',
    },
    goldherbst: {
      name: 'Goldener Herbst',
      blurb: 'Laub in Gold und Kupfer — zum Angeben.',
    },
  },

  clanBoost: {
    name: 'Vereinsfahne',
    blurb: '+10 % für den Verein · 1 h · max. ×1,25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Omas Notizbuch · ${step}/${total}`,
    skip: 'Später lesen',
    welcome: {
      title: 'Mein liebes Enkelkind,',
      body: 'der Garten gehört jetzt dir. Er ist ziemlich verwildert — aber unter den Brombeeren steckt gute Erde. Fang beim Gemüsebeet an. Deine Oma',
      cta: 'Zum Garten',
    },
    tendBed: {
      title: 'Das erste Beet',
      body: 'Tipp das Gemüsebeet an und baue es aus. Jede Stufe bringt mehr Ernte.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Der Garten wächst auch ohne dich',
      body: 'Geh ruhig. Wenn du zurückkommst, wartet die Ernte — einfach einfahren.',
      cta: 'Verstanden',
    },
    unlockCompost: {
      title: 'Platz für den Kompost',
      body: 'Ernte 600 oder bring das Gemüsebeet auf Stufe 10 — dann roden wir die Ecke für den Kompost.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Die Nachbarn',
      body: 'Im Kleingartenverein hilft man sich. Schau mal vorbei.',
      cta: 'Zum Verein',
      skipLabel: 'Später',
    },
    prestigeTeaser: {
      title: 'Wenn es Winter wird',
      body: 'Am Saisonende ruht der Garten. Was du gelernt hast, bleibt als Erbstück — und jedes Gartenjahr wird reicher.',
      cta: 'Danke, Oma',
      skipLabel: 'Schließen',
    },
  },

  /** Omas Notizbuch — letters unlocked by garden stages and Gartenjahre. */
  notebook: {
    title: 'Omas Notizbuch',
    intro: 'Briefe und Notizen, die Oma dir hinterlassen hat. Neue Seiten finden sich, wenn der Garten wächst.',
    open: 'Notizbuch öffnen',
    newLetter: 'Brief von Oma',
    newLetterAria: 'Neuer Brief von Oma — lesen',
    lockedEntry: 'Diese Seite ist noch zugeklebt.',
    lockedHintStage: (name: string) => `Öffnet sich beim ${name}.`,
    lockedHintYear: (year: number) => `Öffnet sich im ${year}. Gartenjahr.`,
    lockedHintDeep: 'Öffnet sich nach dem ersten Tiefen Winter.',
    close: 'Notizbuch schließen',
    read: 'Gelesen',
    signature: '— Deine Oma',
    laubeAria: 'Omas Laube — Notizbuch öffnen',
    entries: {
      welcome: {
        title: 'Mein liebes Enkelkind,',
        body: 'der Garten gehört jetzt dir. Er ist ziemlich verwildert — aber unter den Brombeeren steckt gute Erde. Fang beim Gemüsebeet an, der Rest kommt mit der Zeit. Ich habe dir Notizen in die Laube gelegt.',
      },
      stage2: {
        title: 'Es riecht nach Erde',
        body: 'Zwei Ecken gerodet, und schon summt es wieder. Opa hat immer gesagt: Ein Garten merkt, wenn jemand zurückkommt. Er hat sich gemerkt, dass du da bist.',
      },
      stage4: {
        title: 'Ein richtiger Nutzgarten',
        body: 'Kräuter, Beeren, Kompost — so sah es aus, als deine Mutter klein war. Sie hat die Johannisbeeren immer direkt vom Strauch genascht. Lass ruhig ein paar hängen.',
      },
      stage5: {
        title: 'Fast schon eine Gärtnerei',
        body: 'Die Nachbarn bleiben am Zaun stehen und schauen. Lass sie schauen! Und wenn jemand fragt, ob er ein paar Äpfel haben darf: Teilen macht die Ernte nicht kleiner.',
      },
      stage7: {
        title: 'Der Hof wird lebendig',
        body: 'Hühner gackern, Bienen summen, und abends brennt Licht in der Laube. Genau so habe ich mir das immer vorgestellt. Ich bin sehr stolz auf dich.',
      },
      stage9: {
        title: 'Ein Schaugarten',
        body: 'Im Verein reden sie von nichts anderem mehr. Lass dir nichts einreden: Die schönsten Gärten sind nicht die ordentlichsten, sondern die, in denen gelebt wird.',
      },
      stage10: {
        title: 'Der Gartenpark',
        body: 'Jetzt ist er fertig — oder besser: Jetzt fängt er erst richtig an. Ein Garten ist nie fertig, und das ist das Schöne daran. Er gehört jetzt ganz dir. Pass gut auf ihn auf, und auf dich.',
      },
      year2: {
        title: 'Der erste Winter',
        body: 'Keine Sorge, im Winter schläft der Garten nur. Was du gelernt hast, nimmt dir keiner. Im Frühling roden wir die Wiese hinter dem Kompost — dort standen früher Obstbäume.',
      },
      year3: {
        title: 'Platz für die Bienen',
        body: 'In der alten Kiste im Schuppen liegt Opas Imkerhut. Neben der Hecke ist es windstill — das mögen Bienen. Ohne sie kein Obst, vergiss das nie.',
      },
      year5: {
        title: 'Hühner!',
        body: 'Der alte Stall hinter der Laube muss nur ausgebessert werden. Hühner fressen Schnecken und geben Eier — bessere Nachbarn gibt es nicht. Nenn eins nach mir, wenn du magst.',
      },
      year7: {
        title: 'Glas für den Sommer',
        body: 'Unter dem Efeu an der Mauer liegen noch die Scheiben vom alten Gewächshaus. Damit wird der Sommer länger. Lüften nicht vergessen, sonst kochen die Tomaten!',
      },
      year10: {
        title: 'Ein eigener Hofladen',
        body: 'Du erntest mehr, als du essen kannst — das ist ein gutes Zeichen. Stell ein paar Kisten an den Zaun und eine Kasse des Vertrauens. Die Leute sind ehrlicher, als man denkt.',
      },
      deep1: {
        title: 'Ein neues Kapitel',
        body: 'Manchmal muss ein Garten ganz zur Ruhe kommen, damit er neu wachsen kann. Was du gelernt hast, steckt jetzt tief in der Erde — in jedem Spross, der kommt. Fang ruhig wieder klein an. Diesmal weißt du, wie es geht.',
      },
      year14: {
        title: 'Meine Orangerie',
        body: 'Davon habe ich mein Leben lang geträumt: Zitronen und Feigen unter Glas, mitten im Kleingarten. Ich habe es nie geschafft. Jetzt hast du den Platz dafür. Mach es für uns beide.',
      },
    },
  },

  /** Pflanzenbuch — rare varieties with permanent Ernte bonus. */
  plantbook: {
    tab: 'Pflanzenbuch',
    lettersTab: 'Briefe',
    intro: 'Seltene Sorten tauchen beim Ausbauen auf — und jedes Saisonende bringt eine neue. Jede Sorte gibt dauerhaft mehr Ernte, auch nach jedem Winter.',
    total: (pct: string) => `Sortenbonus: +${pct} % Ernte/s`,
    found: (n: number, max: number) => `${n} von ${max} Sorten`,
    unknown: '???',
    rarity: { common: 'gewöhnlich', rare: 'selten', precious: 'kostbar' },
    bonus: (pct: string) => `+${pct} %`,
    newVariety: (name: string, pct: string) => `Neue Sorte: ${name} · +${pct} % Ernte`,
    names: {
      radieschenEiszapfen: 'Radieschen „Eiszapfen“',
      tomateOchsenherz: 'Tomate „Ochsenherz“',
      bohneBlauhilde: 'Stangenbohne „Blauhilde“',
      wurmhumus: 'Wurmhumus',
      bokashi: 'Bokashi-Ferment',
      thymianZitrone: 'Zitronenthymian',
      lavendelHidcote: 'Lavendel „Hidcote“',
      safranKrokus: 'Safran-Krokus',
      johannisbeereRosetta: 'Johannisbeere „Rosetta“',
      stachelbeereHinnonmaeki: 'Stachelbeere „Hinnonmäki“',
      apfelGoldparmaene: 'Apfel „Goldparmäne“',
      birneGuteLuise: 'Birne „Gute Luise“',
      zwetschgeHauszwetschge: 'Hauszwetschge',
      honigLinde: 'Lindenhonig',
      honigHeide: 'Heidehonig',
      huhnSulmtaler: 'Sulmtaler Huhn',
      huhnAraucana: 'Araucana (grüne Eier)',
      paprikaSpitz: 'Spitzpaprika',
      gurkeSchlange: 'Schlangengurke',
      chiliHabanero: 'Chili „Habanero“',
      kartoffelBamberger: 'Bamberger Hörnchen',
      kuerbisHokkaido: 'Hokkaido-Kürbis',
      zitroneAmalfi: 'Amalfi-Zitrone',
      feigeBrunswick: 'Feige „Brunswick“',
    } as Record<string, string>,
  },

  visitors: {
    aria: (name: string) => `${name} ist zu Besuch — antippen`,
    igel: { name: 'Igel', line: 'Der Igel hat Schnecken gefressen — mehr Ernte!' },
    gerda: { name: 'Nachbarin Gerda', line: 'Gerda bringt Samen aus ihrem Garten mit.' },
    schmetterling: { name: 'Schwalbenschwanz', line: 'Ein seltener Falter! Die Blüten danken es dir.' },
    rotkehlchen: { name: 'Rotkehlchen', line: 'Das Rotkehlchen singt — die Gießkanne ist wieder voll!' },
    postbote: { name: 'Postbote Kalle', line: 'Ein Paket vom Saatgut-Versand — ein paar Erbstücke!' },
  },

  orders: {
    label: (name: string) => `Bestellung: ${name}`,
    progress: (have: string, need: string, left: string) => `${have} / ${need} · ${left}`,
    claim: (name: string) => `${name}: Abliefern!`,
    reward: (seeds: number) => `Lohn: +${seeds} Samen und ein Korb Ernte`,
    done: (name: string) => `${name} ist begeistert — danke!`,
    expired: 'Bestellung verpasst — die nächste kommt bald.',
    customers: ['Frau Gerda', 'Herr Albers', 'Kita Sonnenschein', 'Café Laube', 'Familie Yilmaz', 'Bäckerei Korn'],
    detail: (need: string) => `Fahre ${need} Ernte ein, solange die Bestellung offen ist.`,
  },

  weekly: {
    title: 'Omas Wochenplan',
    intro: 'Sieben Aufgaben bis Sonntag — alle geschafft, gibt es Omas Wochenkorb.',
    claim: 'Abholen',
    done: 'Erledigt',
    bonusTitle: 'Omas Wochenkorb',
    bonusReward: (seeds: number, erb: number) => `+${seeds} Samen · +${erb} Erbstücke`,
    bonusLocked: (n: number) => `Noch ${n} Aufgaben`,
    reward: (seeds: number) => `+${seeds} Samen`,
    tasks: {
      water: (n: number) => `${n}× gießen`,
      upgrades: (n: number) => `${n}× ausbauen`,
      orders: (n: number) => `${n} Bestellungen abliefern`,
      visitors: (n: number) => `${n} Besucher begrüßen`,
      seasons: (n: number) => (n === 1 ? '1 Saisonende feiern' : `${n} Saisonenden feiern`),
      daily: (n: number) => `${n}× Gartenrunde`,
      varieties: (n: number) => (n === 1 ? '1 neue Sorte finden' : `${n} neue Sorten finden`),
    },
  },

  weather: {
    sonne: { name: 'Sonne', effect: '+10 % Ernte' },
    regen: { name: 'Regen', effect: 'Gießen ×2' },
    wind: { name: 'Wind', effect: 'mehr Besucher' },
    mild: { name: 'Mild', effect: 'ruhiger Tag' },
    pill: (name: string, effect: string) => `${name} · ${effect}`,
    tomorrow: (name: string, effect: string) => `Morgen: ${name} (${effect})`,
  },

  wheel: {
    title: 'Glücksrad',
    spin: 'Drehen',
    spinning: 'Dreht…',
    results: {
      yield: '+25 % Ernte das ganze Gartenjahr',
      water: 'Gießen ×2 das ganze Gartenjahr',
      seeds: '+30 Samen',
      variety: 'Eine neue Sorte fürs Pflanzenbuch',
    },
    activePill: { yield: 'Glücksrad: +25 % Ernte', water: 'Glücksrad: Gießen ×2' },
  },

  comeback: {
    title: 'Da bist du ja wieder!',
    body: 'Ich hab schon gedacht, die Schnecken hätten dich geholt. Der Garten hat auf dich gewartet — und ein kleines Willkommensgeschenk liegt auf der Bank.',
    gift: (seeds: number) => `Geschenk: +${seeds} Samen und 30 Minuten Ernte`,
    cta: 'Danke, Oma',
  },

  reminders: {
    label: 'Erinnerungen',
    on: 'An',
    off: 'Aus',
    hint: 'Benachrichtigt dich, wenn die Gießkanne voll ist (solange die App im Hintergrund geöffnet ist).',
    water: 'Die Gießkanne ist wieder voll — Zeit zum Gießen!',
    denied: 'Benachrichtigungen sind im Browser blockiert.',
  },

  milestone: {
    tier: (name: string, tier: number) => `${name}: Ausbaustufe ${tier} erreicht!`,
  },

  legal: {
    title: 'Rechtliches',
    impressum: 'Impressum',
    close: 'Schließen',
  },

  season: {
    winterTitle: 'Winterruhe',
    winterLine: 'Der Garten schläft. Was gewachsen ist, bleibt in deinen Händen.',
    springTitle: (year: number) => `Gartenjahr ${year}`,
    deepTitle: 'Tiefer Winter',
    deepLine: 'Der Garten ruht lange und tief. Die Wurzeln sammeln Kraft.',
    deepSpringTitle: 'Ein neuer Anfang',
    sprouts: (n: number) => `+${n} Sprösslinge`,
    springLine: 'Der Schnee schmilzt — Zeit, wieder anzupacken.',
    gained: (text: string) => `Eingelagert: ${text}`,
    newCorner: (name: string) => `Neu zu roden: ${name}`,
    cta: 'Ins neue Gartenjahr',
    skip: 'Weiter',
  },

  daily: {
    kicker: 'Tägliche Gartenrunde',
    short: 'Gartenrunde',
    dayOf: (n: number) => `Tag ${n}/7`,
    firstShift: 'Tag 1/7 · Los geht’s',
    streakNext: (n: number) => {
      const day = (Math.max(0, n) % 7) + 1
      return `Serie ${n} · Tag ${day}/7`
    },
    streakDotsAria: (n: number) => `Serie ${n} von 7`,
    comebackLabel: 'Willkommen zurück',
    comebackMeta: 'Serie hält · der Garten hat auf dich gewartet',
    claim: 'Abholen',
    claimToast: 'Gartenrunde erledigt',
    rewardCompute: (amount: string) => `${amount} ${SOFT}`,
    rewardCredits: (n: number) => erb(n),
    rewardObsidian: (n: number) => `${n} ${SEEDS}`,
    rows: {
      float2: `2 Min ${SOFT}`,
      shift3: `3 Min ${SOFT}`,
      crumb20: `20 ${SEEDS}`,
      long4: `4 Min ${SOFT}`,
      credit1: '1 Erbstück',
      ot5: `5 Min ${SOFT}`,
      weekSeal: 'Wochenkorb',
    },
  },

  event: {
    name: 'Erntefest',
    blurb: '+25 % Ernte/s · das ganze Wochenende.',
    endsFri: 'Bis Sonntag',
    endsSat: 'Bis morgen',
    endsSun: 'Bis heute Abend',
    endsDefault: 'Wochenende',
    goalAria: 'Erntefest-Ziel',
    goalLine: (progress: string, reward: number) =>
      `${progress} → ${reward} ${SEEDS}`,
    claimGoal: 'Belohnen',
    claimed: 'Abgeholt',
    dismiss: 'Schließen',
  },

  install: {
    title: 'Gartenerbe installieren',
    iosBefore: 'iPhone: tippe',
    iosShare: 'Teilen',
    iosMid: '→',
    iosAdd: 'Zum Home-Bildschirm',
    iosAfter: '.',
    androidBody: 'Ein Symbol auf dem Startbildschirm — ein Tipp, und du bist im Garten.',
    manualBody: 'Über das Browser-Menü zum Home-Bildschirm hinzufügen.',
    whyHome: 'Immer auf dem Startbildschirm — wie eine App.',
    whyOffline: 'Dein Garten wächst weiter, auch unterwegs.',
    whyFast: 'Schnell zurück zu deinen Beeten.',
    install: 'Installieren',
    gotIt: 'Verstanden',
    notNow: 'Nicht jetzt',
    skipBrowser: 'Ohne Installation weiterspielen',
  },
} as const

export type Strings = typeof strings
