/**
 * German player-facing copy — Gartenerbe.
 *
 * Story: Oma hat dir ihren verwilderten Schrebergarten vererbt. Ihr Notizbuch
 * (Erzählstimme) führt dich vom Brombeer-Dickicht bis zum Gartenpark.
 *
 * Currencies: Ernte (soft, per run) · Erbstücke (meta, survives Saisonende)
 * · Samen (premium stub). Prestige = Saisonende (Winterruhe → neues Gartenjahr).
 */
import { zahl } from './count'
import { careNames } from './careNames'
import { privacyStrings } from './legal'
import { manifestStrings } from './manifest'
import { expansionStrings } from './stringsExpansion'
import { lifeStrings } from './stringsLife'
import { uxStrings } from './stringsUx'
import { arcStrings } from './stringsArcs'

const SOFT = 'Ernte'
const SEEDS = 'Samen'

/** „1 Erbstück“ / „3 Erbstücke“ */
function erb(n: number): string {
  return `${zahl(n)} ${n === 1 ? 'Erbstück' : 'Erbstücke'}`
}

export const strings = {
  brand: 'Gartenerbe',
  tagline: 'Vom Schrebergarten zum Gartenpark',
  meta: {
    title: 'Gartenerbe',
    description:
      'Gartenerbe — vom Schrebergarten zum Gartenpark. Dein Garten wächst auch offline.',
    pwaDescription: 'Omas Garten wächst weiter, auch wenn du weg bist.',
    manifest: manifestStrings,
  },

  /** Zahlen & Zeiträume (src/game/format.ts) */
  num: {
    decimal: ',',
    group: '.',
    /** 10³, 10⁶, 10⁹, 10¹², 10¹⁵, 10¹⁸ — lange Skala */
    units: [' Tsd', ' Mio', ' Mrd', ' Bio', ' Brd', ' Trd'],
    minutes: (n: number) => (n === 1 ? '1 Minute' : `${n} Minuten`),
    hours: (n: number) => (n === 1 ? '1 Stunde' : `${n} Stunden`),
    days: (n: number) => (n === 1 ? '1 Tag' : `${n} Tage`),
    /** Preis mit Währung (Betrag schon mit Dezimalzeichen) */
    euro: (amount: string) => `${amount}\u00a0€`,
  },

  /** Sprachnamen in der jeweiligen Sprache selbst (Umschalter) */
  languageNames: { de: 'Deutsch', en: 'English' },

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
    settings: 'Einstellungen',
    ariaLabel: 'Hauptnavigation',
    garten: 'Garten',
    prestige: 'Saison',
    clan: 'Verein',
    shop: 'Markt',
    menu: 'Menü',
    menuClose: 'Menü schließen',
    backToMap: 'Zum Garten',
  },

  sound: {
    label: 'Ton',
    ambience: 'Naturgeräusche',
    on: 'An',
    off: 'Aus',
    mute: 'Ton aus',
    unmute: 'Ton an',
    muteAria: 'Soundeffekte stummschalten',
    unmuteAria: 'Soundeffekte einschalten',
  },

  // Hinweis zur Testphase beim ersten Start der installierten App (game/distribution.ts TEST_PHASE)
  testPhase: {
    title: 'Testphase',
    intro: 'Die App merkt sich, wie du spielst – damit wir das Spiel verbessern.',
    points: ['Nur Spielaktionen und Spielzeit, alles bleibt auf deinem Gerät.'],
    checkbox: 'Aufzeichnung erlauben',
    later: 'Änderbar in den Einstellungen.',
    confirm: 'Verstanden',
  },

  // Installations-Hinweis beim Start im Browser (nur Web-Fassung, siehe game/distribution.ts)
  installGate: {
    title: 'Zuerst die App installieren',
    howTo: 'So geht’s',
    detected: (device: string, browser: string) => `Erkannt: ${device} · ${browser}`,
    nativeInstall: 'Jetzt installieren',
    why: [
      ['Auf dem Startbildschirm', ' wie eine richtige App.'],
      ['Wächst offline weiter.', ''],
      ['Dein Spielstand ist sicherer.', ''],
    ] as [string, string][],
    iosWarning:
      'iPhone und iPad: Der Spielstand aus dem Browser kommt nicht in die App mit. Installiere deshalb zuerst.',
    carryTitle: 'Schon im Browser gegärtnert?',
    carryBody: 'Kopier den Spielstand-Code und lies ihn in der App ein (Menü → Spielstand sichern).',
    carryCopy: 'Spielstand-Code kopieren',
    carryCopied: 'Kopiert ✓',
    copyUrl: 'Adresse kopieren',
    urlCopied: 'Adresse kopiert – im Browser einfügen',
    skip: 'Ohne Installation im Browser weiter',
    skipNote: 'Kommt in ein paar Stunden wieder.',
    os: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Computer' } as Record<string, string>,
    browser: {
      safari: 'Safari',
      chrome: 'Chrome',
      firefox: 'Firefox',
      edge: 'Edge',
      samsung: 'Samsung Internet',
      opera: 'Opera',
      inapp: 'In-App-Browser',
      other: 'Browser',
    } as Record<string, string>,
    /** {S} = Teilen-Symbol */
    steps: {
      'ios-safari': [
        'Unten (iPhone) bzw. oben (iPad) auf das Teilen-Symbol {S} tippen.',
        'Nach unten scrollen und „Zum Home-Bildschirm“ wählen.',
        'Oben rechts auf „Hinzufügen“ tippen.',
      ],
      'ios-chrome': [
        'Oben rechts in der Adresszeile auf das Teilen-Symbol {S} tippen.',
        '„Zum Home-Bildschirm“ wählen (eventuell erst „Mehr“ antippen).',
        'Auf „Hinzufügen“ tippen.',
      ],
      'ios-firefox': ['Unten rechts auf das Menü ☰ tippen.', '„Teilen“ wählen, dann „Zum Home-Bildschirm“.', 'Auf „Hinzufügen“ tippen.'],
      'ios-edge': ['Unten auf das Menü ⋯ tippen, dann auf „Teilen“ {S}.', '„Zum Home-Bildschirm“ wählen.', 'Auf „Hinzufügen“ tippen.'],
      'ios-other': [
        'Öffne diese Seite in Safari (Adresse kopieren und in Safari einfügen).',
        'Dann Teilen {S} → „Zum Home-Bildschirm“ → „Hinzufügen“.',
      ],
      'android-chrome': ['Oben rechts auf das Menü ⋮ tippen.', '„App installieren“ oder „Zum Startbildschirm hinzufügen“ wählen.', 'Mit „Installieren“ bestätigen.'],
      'android-samsung': ['Unten rechts auf das Menü ☰ tippen.', '„Seite hinzufügen zu“ wählen, dann „Startbildschirm“.', 'Mit „Hinzufügen“ bestätigen.'],
      'android-firefox': ['Auf das Menü ⋮ tippen.', '„Installieren“ bzw. „Zum Startbildschirm hinzufügen“ wählen.', 'Mit „Hinzufügen“ bestätigen.'],
      'android-edge': ['Unten auf das Menü ⋯ tippen.', '„Zum Telefon hinzufügen“ bzw. „App installieren“ wählen.', 'Bestätigen.'],
      'android-opera': ['Auf das Menü ⋮ tippen.', '„Zum Startbildschirm hinzufügen“ wählen.', 'Bestätigen.'],
      'android-other': ['Öffne diese Seite am besten in Chrome.', 'Menü ⋮ → „App installieren“.'],
      inapp: [
        'Du hast die Seite aus einer App (z. B. WhatsApp oder Telegram) geöffnet. Von dort kann man nichts installieren.',
        'Tippe oben rechts auf ⋯ bzw. ⋮ und wähle „Im Browser öffnen“.',
        'Dann erscheint die passende Anleitung.',
      ],
    } as Record<string, string[]>,
  },

  challenges: {
    title: 'Omas Herausforderungen',
    intro: 'Eine Saison mit einer Regel, so wie Oma es manchmal gemacht hat. Gilt ab dem nächsten Saisonende, abbrechen geht jederzeit ohne Verlust.',
    names: { ohneKompost: 'Ohne Kompost', fuenfBeete: 'Nur fünf Beete', ohneGiessen: 'Ohne Gießkanne' },
    rules: {
      ohneKompost: 'Der Kompost bleibt diese Saison zu.',
      fuenfBeete: 'Höchstens fünf Bereiche anlegen.',
      ohneGiessen: 'Kein Gießen und kein Auffüllen.',
    },
    active: (name: string) => `Läuft gerade: ${name}`,
    abort: 'Abbrechen',
    choose: 'Wählen',
    chosen: 'Gewählt ✓',
    next: (name: string) => `Vorgemerkt: ${name} – beginnt mit dem nächsten Saisonende. Nochmal tippen hebt die Wahl auf.`,
    none: 'Noch nichts vorgemerkt.',
    done: 'geschafft',
    reward: 'Jede geschaffte Herausforderung: +3 % Garten-Ernte für immer.',
    blocked: 'Gilt gerade nicht — Omas Herausforderung läuft.',
  },

  collections: {
    menu: 'Sammlung',
    title: 'Sammlung & Ziele',
    total: (pct: number) => `${pct} % gesammelt`,
    rows: {
      pflanzenbuch: 'Pflanzenbuch',
      bewohner: 'Gartenbewohner',
      album: 'Jahreszeiten-Album (diese Saison)',
      erfolge: 'Erfolge',
      kreuzungen: 'Kreuzungen',
      herausforderungen: 'Omas Herausforderungen',
    },
    nearSet: (n: number, area: string) => `Noch ${n} ${n === 1 ? 'Sorte' : 'Sorten'} bis zum Set ${area} (+2 % Ernte)`,
    chaptersTitle: 'Omas Grundstücke',
    unknown: '???',
    chapterOpen: 'offen',
    chapterFirst: 'frei nach dem 1. Tiefen Winter',
    chapterSecond: 'frei ab der 1. Generation',
    chapterLater: (gen: number, prev: number) => `frei ab Generation ${gen}, wenn in Kapitel ${prev} der 8. Bereich steht`,
    chapterLater13: (gen: number, half: boolean, prev: number) =>
      `frei ab Generation ${gen}${half ? ' und der Hälfte der Tiefen Winter bis zur nächsten' : ''}, wenn Kapitel ${prev} vollständig angelegt ist`,
    goalTitle: (area: string) => `Pflanzenbuch: Set ${area}`,
    goalDetail: (n: number) => `noch ${n} ${n === 1 ? 'Sorte' : 'Sorten'}`,
  },

  mastery: {
    title: 'Kapitel-Meisterschaft',
    summary: (have: number, total: number) => `${have} von ${total} Meister-Sternen`,
    explain: (level: number, care: number, careMax: number, pct: number) =>
      `Erster Stern, wenn jeder Bereich eines Kapitels Stufe ${level} hat. Zweiter Stern, wenn jeder Bereich in beiden Pflege-Arten mindestens Rang ${care} hat, dritter bei Rang ${careMax}. Jeder Stern: +${pct} % Ertrag in diesem Kapitel.`,
    starsAria: (n: number, max: number) => `Kapitel-Meisterschaft: ${n} von ${max} Sternen`,
    nextLevel: (have: number, total: number, level: number) => `${have} von ${total} Bereichen auf Stufe ${level}`,
    nextCare: (have: number, total: number, rank: number) => `${have} von ${total} Bereichen gepflegt bis Rang ${rank}`,
    done: 'Meisterschaft vollständig',
    toast: (n: number, pct: number) => `Kapitel-Meisterschaft: ${n}. Stern! Jetzt +${pct} % Ertrag in diesem Kapitel`,
  },

  seasonCards: {
    title: 'Ein Thema für dieses Gartenjahr',
    intro: 'Such dir ein Thema aus — es gilt bis zum nächsten Saisonende. In den ersten 5 Minuten kannst du noch einmal wechseln.',
    preview: (pct: number) => `mit deinem letzten Garten ≈ ${pct > 0 ? '+' : ''}${pct} % Ernte`,
    previewEven: 'mit deinem letzten Garten ≈ gleich viel Ernte',
    previewQuiet: 'lohnt sich, wenn du oft länger weg bist',
    effectAusbau: (boost: string, off: number, dampen: string, plus: number) => (dampen ? `${boost} ausbauen −${off} % · ${dampen} +${plus} %` : `${boost} ausbauen −${off} %`),
    previewAusbau: (pct: number) => `mit deinem letzten Garten ≈ ${pct} % weniger Ernte für den Ausbau`,
    resultAusbau: (name: string, pct: number) => `Dein Thema „${name}“ hätte mit deinem Garten ≈ ${pct} % der Ausbaukosten gespart.`,
    previewAway: (active: number, away: number) => `beim Spielen ≈ ${active > 0 ? '+' : active < 0 ? '−' : ''}${Math.abs(active)} % · während du weg bist ≈ ${away > 0 ? '+' : away < 0 ? '−' : ''}${Math.abs(away)} %`,
    result: (name: string, pct: number) => `Dein Thema „${name}“ hat mit deinem Garten ≈ ${pct > 0 ? '+' : ''}${pct} % Ernte gebracht.`,
    resultAway: (name: string, active: number, away: number) => `Dein Thema „${name}“: beim Spielen ≈ ${active > 0 ? '+' : active < 0 ? '−' : ''}${Math.abs(active)} %, während du weg warst ≈ ${away > 0 ? '+' : away < 0 ? '−' : ''}${Math.abs(away)} % Ernte.`,
    skip: 'Ohne Thema weitergärtnern',
    tip: 'Omas Tipp',
    savedAmount: (amount: string) => `mit deinem letzten Garten ≈ ${amount} Ernte gespart`,
    gainAmount: (amount: string) => `mit deinem letzten Garten ≈ +${amount} Ernte`,
    switchTitle: 'Thema wechseln',
    switchIntro: (clock: string) => `Noch ${clock} – du kannst einmal wechseln.`,
    switchKeep: 'Thema behalten',
    switchCurrent: 'gewählt',
    switchButton: (clock: string) => `Thema wechseln · noch ${clock}`,
    choosePill: 'Thema wählen',
    pill: (name: string) => name,
    cards: {
      tomatenjahr: { name: 'Tomatenjahr', effect: 'Gemüsebeet ×2 · Obstwiese ×0,8' },
      kompostjahr: { name: 'Kompostjahr', effect: 'Kompost ×2 · Beerenhecke ×0,8' },
      kraeuterjahr: { name: 'Kräuterjahr', effect: 'Kräuterspirale ×2 · Gemüsebeet ×0,8' },
      beerenjahr: { name: 'Beerenjahr', effect: 'Beerenhecke ×2 · Kompost ×0,8' },
      obstjahr: { name: 'Obstjahr', effect: 'Obstwiese ×1,8 · Kräuterspirale ×0,8' },
      bienenjahr: { name: 'Bienenjahr', effect: 'Bienenstock ×1,8 · Hühnerstall ×0,8' },
      huehnerjahr: { name: 'Hühnerjahr', effect: 'Hühnerstall ×1,8 · Bienenstock ×0,8' },
      glashausjahr: { name: 'Glashausjahr', effect: 'Gewächshaus ×1,8 · Beerenhecke ×0,8' },
      hofladenjahr: { name: 'Hofladenjahr', effect: 'Hofladen ×1,8 · Gewächshaus ×0,8' },
      ruhigesJahr: { name: 'Ruhiges Jahr', effect: 'Während du weg bist +50 % · beim Spielen −20 %' },
      fleissjahr: { name: 'Fleißiges Jahr', effect: 'Beim Spielen +10 % · während du weg bist −10 %' },
      gutesJahr: { name: 'Gutes Jahr', effect: 'Alles +5 %' },
    },
  },

  features: {
    newBadge: 'Neu',
  },

  saveGuard: {
    newer: 'Dein Spielstand ist neuer als diese App-Version. Bis zum Aktualisieren wird hier nichts gespeichert — dein Fortschritt bleibt sicher.',
    otherTab: 'Gartenerbe ist schon in einem anderen Fenster offen. Hier wird nichts gespeichert; schließ das andere Fenster, dann geht es hier weiter.',
    update: 'Jetzt aktualisieren',
  },

  crash: {
    title: 'Da ist etwas schiefgegangen',
    body: 'Dein Garten ist gespeichert. Zur Sicherheit kannst du den Spielstand-Code kopieren und dann neu laden.',
    copy: 'Spielstand-Code kopieren',
    copied: 'Kopiert ✓',
    reload: 'Neu laden',
  },

  playtest: {
    title: 'Playtest-Log',
    on: 'An',
    off: 'Aus',
    export: 'Log exportieren',
    copy: 'Log kopieren',
    copied: 'Kopiert ✓',
    saved: 'Gespeichert ✓',
    failed: 'Ging nicht — bitte „Log kopieren“',
    count: (n: number) => `${n}`,
    clear: 'Log leeren',
    clearConfirm: 'Wirklich leeren? Nochmal tippen',
  },

  goal: {
    stripAria: 'Nächstes Ziel',
    upgradeTitle: (action: string, name: string) => `${action}: ${name}`,
    upgradeDetail: (cost: string) => `${cost} ${SOFT}`,
    unlockTitle: (name: string) => `Roden: ${name}`,
    unlockErnteLeft: (n: string) => `noch ${n} ${SOFT}`,
    unlockLevel: (name: string, have: number, need: number) =>
      `${name} ${have}/${need}`,
    unlockPlayerLevel: (have: number, need: number) =>
      `Gärtnerstufe ${have}/${need}`,
    levelTitle: (n: number) => `Gärtnerstufe ${n}`,
    levelDetail: (into: number, need: number) => `${into}/${need} Erfahrung`,
    prestigeTitle: 'Saisonende',
    prestigeDetail: (left: string) => `noch ${left} ${SOFT}`,
    prestigeReady: 'Saisonende bereit',
    prestigeReadyDetail: 'Erbstücke einlagern',
    ready: 'Bereit',
    fallback: 'Garten pflegen',
    nearMiss: (pct: number) => `${100 - pct} % geschafft`,
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
      `${progress} → ${zahl(reward)} ${SEEDS}`,
    claimGoal: 'Abholen',
    claimed: 'Abgeholt',
    dismiss: 'Schließen',
  },

  resources: {
    ernte: SOFT,
    erbstuecke: 'Erbstücke',
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
    ernteEarned: (n: string) => `${n} ${SOFT} geerntet`,
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
      `+${amount} ${SOFT} · +${xp} Erfahrung`,
    claimCelebrateShort: (amount: string) => `+${amount} ${SOFT}`,
    mapAria: 'Dein Garten',
    mapHint: 'Beet antippen → anlegen oder ausbauen.',
    locked: 'Wildnis',
    levelShort: (level: number) => `Stufe ${level}`,
    gateErnte: (n: string) => `${n} ${SOFT}`,
    buildingAriaUnlocked: (name: string, level: number, rate: string) =>
      `${name}, Stufe ${level}, ${rate}. Tippen zum Ausbauen.`,
    buildingAriaLocked: (name: string, hint: string) =>
      `${name}, noch Wildnis. ${hint}`,
    playerLevelAria: (level: number, xp: number, need: number) =>
      `Gärtnerstufe ${level}, ${xp} von ${need} Erfahrung`,
    progressOpen: 'Ziele & Meilensteine',
    progressClose: 'Schließen',
    levelUp: (n: number) => `Gärtnerstufe ${n}!`,
    waterCooling: (clock: string) => `Kanne füllt sich · ${clock}`,
    questReady: 'Aufgabe erledigt — abholen',
  },

  level: {
    label: 'Gärtnerstufe',
    short: 'Gärtnerstufe',
    xp: 'Erfahrung',
    bonus: (pct: string) => `+${pct} % ${SOFT}/s`,
    rewards: {
      ernte: (n: number) => `+${n} ${SOFT}`,
      erbstuecke: (n: number) => `+${erb(n)}`,
      samen: (n: number) => `+${zahl(n)} ${SEEDS}`,
      cosmetic: (name: string) => `Gartenstil: ${name}`,
    },
  },

  branches: {
    title: 'Pflege',
    efficiency: 'Düngen',
    capacity: 'Mulchen',
    efficiencyBlurb: '+4 % Ernte/s je Stufe (max. 5).',
    capacityBlurb: '−3 % Ausbaukosten je Stufe (max. 5).',
    efficiencyPerRank: '+4 % Ernte je Stufe',
    capacityPerRank: 'Ausbauen 3 % billiger je Stufe',
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
    rewardErnte: (n: number) => `+${n} ${SOFT}`,
    rewardErbstuecke: (n: number) => `+${erb(n)}`,
    rewardSamen: (n: number) => `+${zahl(n)} ${SEEDS}`,
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
    earnErnte: (n: string) => `${n} ${SOFT} einfahren`,
    claimDaily: 'Gartenrunde abholen',
    rewardLine: (ernte: number, seeds: number) =>
      seeds > 0 ? `+${ernte} ${SOFT} · +${zahl(seeds)} ${SEEDS}` : `+${ernte} ${SOFT}`,
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
    holdHint: 'Gedrückt halten für mehr',
  },

  prestige: {
    title: 'Saisonende',
    introBefore: 'Du fängst das Gartenjahr neu an und bekommst dafür',
    introAfter:
      '— damit kaufst du in Omas Truhe Verbesserungen, die für immer bleiben. So wächst jedes neue Jahr schneller als das letzte.',
    erbstuecke: 'Erbstücke:',
    multiplier: 'Erbe-Bonus:',
    runs: 'Jahre geschafft:',
    thisRun: 'Diese Saison:',
    gate: 'Ab:',
    erbstueckePreview: (n: number) => `Vorschau +${erb(n)}`,
    nextPayout: 'Jetzt einlagern:',
    longerHint: 'länger gärtnern bringt bis zu doppelt so viel',
    laterPayout: (n: number) => `in ~10 Minuten wären es ${n}`,
    erbstueckeAmount: (n: number) => `+${erb(n)}`,
    claimReset: (n: number) => `Winterruhe · +${erb(n)}`,
    gainBefore: 'Mit diesen Erbstücken kannst du gleich danach',
    gainValue: (mult: string) => `Ernte ${mult}`,
    gainAfter: 'kaufen — für immer.',
    claimResetRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Winterruhe · +${erb(n)} — Truhe öffnet nach ~${mods} Ausbauten`
        : `Winterruhe · +${erb(n)} — Truhe öffnet beim Neuanlegen`,
    needMore: (amount: string) => `Noch ${amount} ${SOFT} bis zum Saisonende`,
    needErbstuecke: (have: number, need: number) =>
      `Noch ${need - have} Erbstück-Wert (min. ${need}) — die Saison lohnt sich noch`,
    needModules: (have: number, need: number) =>
      `Erst ${need} Bereiche anlegen (jetzt ${have})`,
    emptyGate: 'Mehr ernten — dann Saisonende.',
    emptyShop: 'Nach dem ersten Saisonende öffnet sich Omas Truhe.',
    shopTitle: 'Omas Truhe',
    shopIntro:
      'Erbstücke gibt es bei jedem Saisonende neu — gib sie hier ruhig aus. Was du kaufst, bleibt für immer.',
    shopReady: (n: number) =>
      n === 1
        ? 'Du kannst 1 Verbesserung mit Erbstücken kaufen — beim Neuanlegen kommen mehr.'
        : `Du kannst ${n} Verbesserungen mit Erbstücken kaufen — beim Neuanlegen kommen mehr.`,
    shopWaiting: (name: string, nextRank: number, pct: number) =>
      `Als Nächstes: ${name} Rang ${nextRank} (${pct}%) — weiter ausbauen.`,
    shopUnlockAria: (name: string) => `Fortschritt bis ${name}`,
    shopNextTag: 'Als Nächstes',
    effectNow: (effect: string) => `Jetzt: ${effect}`,
    effectNone: 'Noch nicht gekauft',
    shopRankLocked: (need: string) =>
      `Noch ${need} Fortschritt (Ausbauten / Ernte)`,
    shopRankLockedProgress: (pct: number, left: string) =>
      `${pct}% — noch ${left} Fortschritt`,
    shopModulesLocked: (need: number) =>
      `Erst ${need} Bereiche in dieser Saison anlegen`,
    max: 'Max',
    costErbstuecke: (n: number) => erb(n),
    spendCta: (n: number) =>
      `Omas Truhe · Erbstücke ausgeben (${n})`,
    spendAria: 'Omas Truhe öffnen — Erbstücke ausgeben',
    keepTitle: 'Bleibt',
    loseTitle: 'Ruht bis Frühling',
    keepItems: ['Erbstücke & Truhe', 'Samen, Gartenstile, Serie', 'Gartenjahre'],
    loseItems: ['Ernte dieser Saison', 'Ausbaustufen', 'Fortschritt zum Saisonende'],
    branchYieldTitle: 'Ertrag',
    branchYieldBlurb: 'Mehr Ernte, günstigere Ausbauten.',
    branchPflegeTitle: 'Pflege',
    branchPflegeBlurb: 'Länger offline wachsen, kräftiger gießen.',
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
    pillReady: 'Tiefer Winter möglich',
    pillReadyAria: 'Tiefer Winter ist möglich — im Saison-Tab ansehen',
    intro:
      'Wenn alle Ecken offen sind, kann der Garten einen langen Winter ruhen. Danach fängst du im ersten Gartenjahr neu an — mit Sprösslingen, die für immer bleiben.',
    sprouts: 'Sprösslinge',
    winters: 'Tiefe Winter',
    payout: 'Jetzt',
    keepItems: ['Sprösslinge & ihre Boni', 'Samen, Gartenstile, Serie', 'Gärtnerstufe, Omas Briefe'],
    loseTitle: 'Neu im Frühling',
    loseItems: ['Gartenjahre', 'Erbstücke & Omas Truhe', 'Beete und Ernte'],
    cta: (n: number) => `Tiefer Winter · +${zahl(n)} Sprösslinge`,
    gateClosed: (year: number) => `Möglich ab Gartenjahr ${year}`,
    confirmCta: 'Wirklich? Nochmal tippen — der Garten ruht',
    resting: (clock: string) => `Der Garten ruht noch · ${clock}`,
    restHint: 'Nach einem Tiefen Winter braucht der Boden Ruhe: nach dem ersten einen Tag, nach dem zweiten zwei, danach drei Tage.',
    restRule: (perDay: string, cap: string) => `Jeder erledigte Tag unter „Heute“ (Gartenrunde und alle Tagesziele abgeholt) verkürzt die Ruhe um ${perDay} Stunden, zusammen um höchstens ${cap} Stunden.`,
    restLeft: (clock: string) => `Ruhezeit: noch ${clock}`,
    restEarned: (h: string, cap: string) => `Schon verdient: −${h} h von höchstens −${cap} h`,
    restToday: (h: string) => `Heute noch möglich: −${h} h`,
    restTodayCounted: 'Heute schon gezählt — morgen wieder.',
    restCapReached: 'In dieser Ruhezeit ist nicht mehr Verkürzung drin.',
    vorrat: (n: number, max: number) => `Wintervorrat: ${n} von ${max} Sprösslingen`,
    vorratHint: 'Jedes Saisonende in der Ruhezeit legt einen Sprössling für den nächsten Tiefen Winter zurück.',
    vorratFull: 'Der Wintervorrat ist voll – er wartet auf den nächsten Tiefen Winter.',
    vorratGained: (n: number, max: number) => `+1 Sprössling im Wintervorrat (${n} von ${max})`,
    shopTitle: 'Sprösslings-Laden',
    rank: (rank: number, max: number) => `Rang ${rank}/${max}`,
    cost: (n: number) => `${zahl(n)} Sprösslinge`,
    items: {
      tiefeWurzeln: {
        name: 'Tiefe Wurzeln',
        blurb: '+10 % Ernte/s pro Rang — für immer.',
        effect: (rank: number) => `+${rank * 10} % ${SOFT}/s`,
      },
      winterschutz: {
        name: 'Winterschutz',
        blurb: 'Länger offline wachsen: +1 h / +2 h max. pro Rang.',
        effect: (rank: number) => `+${rank} h / +${rank * 2} h max.`,
      },
      saatgutvorrat: {
        name: 'Saatgutvorrat',
        blurb: 'Jeder Neubeginn startet mit 60 Erbstücken pro Rang.',
        effect: (rank: number) => `${zahl(rank * 60)} Erbstücke zum Start`,
      },
      gartenwissen: {
        name: 'Gartenwissen',
        blurb: 'Jede Gartenecke lässt sich ein Gartenjahr früher roden.',
        effect: (rank: number) => (rank > 0 ? `${rank} Jahr(e) früher` : 'Noch nicht'),
      },
    },
  },

  truhe: {
    gartenschere: {
      name: 'Omas Gartenschere',
      blurb: '+5 % Ernte/s pro Rang. Höhere Ränge beim Neuanlegen.',
      effect: (rank: number) => `+${rank * 5} % ${SOFT}/s`,
    },
    alteGiesskanne: {
      name: 'Alte Gießkanne',
      blurb: 'Länger offline wachsen: +1 h weich, +2 h max. pro Rang.',
      effect: (rank: number) => `+${rank} h / +${rank * 2} h max.`,
    },
    saatgutkiste: {
      name: 'Saatgutkiste',
      blurb: '−2 % auf alle Ausbaukosten pro Rang.',
      effect: (rank: number) => `×${Math.pow(0.98, rank).toFixed(3).replace('.', ',')} Kosten`,
    },
    kompostVomVorjahr: {
      name: 'Kompost vom Vorjahr',
      blurb: 'Jede Saison startet mit angelegtem Kompost.',
      effect: (rank: number) => (rank > 0 ? 'Kompost von Beginn an' : 'Noch nicht'),
    },
    messingBrause: {
      name: 'Messing-Brause',
      blurb: '+15 s mehr Ernte pro Gießen, pro Rang.',
      effect: (rank: number) => `+${rank * 15} s Gießen`,
    },
    notgroschen: {
      name: 'Notgroschen',
      blurb: 'Jede Saison startet mit +80 Ernte pro Rang.',
      effect: (rank: number) =>
        rank > 0 ? `+${rank * 80} ${SOFT} zum Start` : 'Kein Startvorrat',
    },
    strohhut: {
      name: 'Strohhut',
      blurb: '+2 % Ernte/s — erste Ränge sofort, spätere beim Neuanlegen.',
      effect: (rank: number) => `+${(rank * 2).toFixed(0)} % ${SOFT}/s`,
    },
    laterne: {
      name: 'Laterne',
      blurb: '+30 Min weich und +1 h max. offline pro Rang.',
      effect: (rank: number) => `+${String(rank * 0.5).replace('.', ',')} h / +${rank} h max.`,
    },
    guteErde: {
      name: 'Gute Erde',
      blurb: 'Das Gemüsebeet startet auf dieser Stufe.',
      effect: (rank: number) =>
        rank > 0 ? `Gemüsebeet startet auf Stufe ${rank}` : 'Kein Vorsprung',
    },
    rosenbogen: {
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
    intro: 'Tausch deine Samen gegen Gartenstile, Dünger und mehr. Samen gibt es von Besuchern, Bestellungen und Omas Wochenplan.',
    skipLeftToday: 'Zeitsprung heute',
    skipHours: (left: number, cap: number) => `${left}/${cap} h`,
    packsTitle: 'Pakete & Samen',
    packsIntro: 'Testkäufe mit Samen. Noch keine echten Käufe.',
    packEffect: (n: number) => `+${zahl(n)} ${SEEDS}`,
    skipsTitle: 'Zeitsprünge',
    skipsIntro: (rate: string, cap: number) =>
      `Aktuelle Ernte ${rate}/s · max. ${cap} h pro Tag.`,
    dailyCapReached: 'Für heute genug',
    ernteGain: (amount: string) => `+${amount} ${SOFT}`,
    costSamen: (n: number) => `${zahl(n)} ${SEEDS}`,
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
    tabs: { free: 'Gratis', boosts: 'Boosts', styles: 'Stile', seeds: 'Samen' },
    tabsAria: 'Markt-Bereiche',
    giftTitle: 'Tagesgeschenk',
    giftIntro: 'Jeden Tag ein kleines Geschenk vom Markt.',
    giftClaim: (n: number) => `Abholen · +${zahl(n)} ${SEEDS}`,
    giftDone: 'Morgen wieder',
    adsPick: 'Belohnung wählen:',
    adsErnte: (mins: number, amount: string) => `${mins} Min Ernte · +${amount}`,
    adsSamen: (n: number) => `+${zahl(n)} ${SEEDS}`,
    adsGot: (what: string) => `Gutgeschrieben: ${what}`,
    adsGotErnte: (amount: string) => `+${amount} ${SOFT}`,
    adsErnteChapter: (mins: number, place: string, amount: string, currency: string) => `${mins} Min ${place} · +${amount} ${currency}`,
    adsGotChapter: (amount: string, currency: string) => `+${amount} ${currency}`,
    adsPlotHint: 'Die Ernte geht an den Garten, den du gerade offen hast.',
    refillTitle: 'Gießkanne auffüllen',
    refillIntro: 'Sofort wieder gießen, statt 5 Minuten zu warten.',
    refillReady: 'Gießkanne ist voll',
    refillWaiting: (left: string) => `Voll in ${left}`,
    refillLeft: (n: number) => (n > 0 ? `noch ${n}× heute` : 'Für heute aufgebraucht — morgen wieder'),
    adsTitle: 'Bonus-Werbung',
    adsIntro: 'Freiwillig — spielen geht immer ohne. Du siehst vorher, was du bekommst.',
    adsWatch: 'Werbung ansehen',
    adsWatching: 'Läuft…',
    adsCooldown: (left: string) => `Wieder in ${left}`,
    adsRemovedBadge: 'Werbefrei',
    adFreeTitle: 'Bonus (werbefrei)',
    adFreeIntro: 'Du hast Werbefrei: Die Belohnung gibt es ohne Werbung.',
    adsRewardSkip: (mins: number, amount: string) =>
      `+${mins} Min Zeitsprung (${amount})`,
    adsRewardSamen: (n: number) => `+${zahl(n)} ${SEEDS}`,
    adsRewardYield: (mins: number, amount: string) =>
      `+${mins} Min ${SOFT} (${amount})`,
    removeAdsTitle: 'Werbefrei',
    removeAdsIntro: 'Einmal kaufen — Bonus-Werbung dauerhaft weg, die Belohnung bleibt.',
    yieldBoostTitle: 'Dünger',
    yieldBoostIntro: '+15 % Ernte in allen Gärten · 30 Min · für Samen.',
    yieldBoostActive: (mult: string, left: string) => `Aktiv ×${mult} · ${left}`,
    yieldBoostInactive: 'Nicht aktiv',
    yieldBoostBuy: (cost: number) => `${zahl(cost)} ${SEEDS}`,
    currencyPacksTitle: 'Samentüten',
    currencyPacksIntro: 'Samen für Gartenstile, Dünger und Zeitsprünge.',
    cosmeticPacksTitle: 'Stil-Pakete',
    cosmeticPacksIntro: 'Mehrere Gartenstile auf einmal.',
    gartenwocheTitle: 'Gartenwoche',
    gartenwocheIntro: 'Gratis- und Premium-Reihe. EP aus Gartenrunde & Werbung.',
    gartenwocheXpLabel: (xp: number, max: number) => `${xp}/${max} EP`,
    gartenwocheDailyXp: 'Tages-EP',
    gartenwocheDailyDone: 'Tages-EP geholt',
    gartenwocheFree: 'Gratis',
    gartenwochePlus: 'Premium',
    gartenwocheClaim: 'Abholen',
    gartenwocheClaimed: 'Erledigt',
    gartenwocheLocked: 'Gesperrt',
    gartenwocheNeedXp: (xp: number) => `Ab ${xp} EP`,
    gartenwocheNeedPremium: 'Premium nötig',
    rewardSamen: (n: number) => `+${zahl(n)} ${SEEDS}`,
    rewardErnteSec: (sec: number) => `+${sec} s ${SOFT}`,
  },

  packs: {
    starterBundle: {
      name: 'Startpaket',
      blurb: '200 Samen + Gartenstil Bauerngarten. Nur einmal.',
      label: 'Kaufen',
    },
    removeAds: {
      name: 'Werbefrei',
      blurb: 'Bonus-Werbung dauerhaft weg, die Belohnung bleibt.',
      label: 'Werbefrei',
    },
    samen50: {
      name: 'Samentüte S',
      blurb: '50 Samen.',
      label: '+50',
    },
    samen150: {
      name: 'Samentüte M',
      blurb: '150 Samen.',
      label: '+150',
    },
    samen500: {
      name: 'Samentüte L',
      blurb: '500 Samen.',
      label: '+500',
    },
    cosmeticPackLeaf: {
      name: 'Blüten-Paket',
      blurb: 'Blütenmeer + Goldener Herbst. Nur fürs Auge.',
      label: 'Freischalten',
    },
    gartenwochePlus: {
      name: 'Premium-Reihe',
      blurb: 'Premium-Reihe der Gartenwoche, eine Woche lang.',
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
    festFruehling: {
      name: 'Osterwiese',
      blurb: 'Bunte Eier, Tulpen und Weidenkätzchen. Fest-Stil Frühlingsfest.',
    },
    festSommer: {
      name: 'Sommerfest',
      blurb: 'Wimpelketten, Erdbeeren und Sonnenschirm.',
    },
    festErntedank: {
      name: 'Erntekrone',
      blurb: 'Kürbisse, Garben und eine Erntekrone an der Laube.',
    },
    festAdvent: {
      name: 'Winterzauber',
      blurb: 'Raureif, Kerzenschein und ein Tannenbaum mit Lichtern.',
    },
  },

  clanBoost: {
    name: 'Vereinsfahne',
    blurb: '+10 % für den Verein · 1 h · max. ×1,25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Omas Notizbuch · ${step}/${total}`,
    skip: 'Tipps überspringen',
    welcome: {
      title: 'Mein liebes Enkelkind,',
      body: 'der Garten gehört jetzt dir. Deine Oma',
      cta: 'Zum Garten',
    },
    tendBed: {
      title: 'Das erste Beet',
      body: 'Tipp das Gemüsebeet an und bau es aus.',
      cta: 'Weiter',
    },
    claimOffline: {
      title: 'Der Garten wächst auch ohne dich',
      body: 'Geh ruhig – die Ernte wartet auf dich.',
      cta: 'Verstanden',
    },
    unlockCompost: {
      title: 'Platz für den Kompost',
      body: 'Bei 600 Ernte oder Gemüsebeet Stufe 10 wird die Kompost-Ecke frei.',
      cta: 'Weiter',
    },
    visitClan: {
      title: 'Die Nachbarn',
      body: 'Im Kleingartenverein hilft man sich – schau vorbei.',
      cta: 'Zum Verein',
      skipLabel: 'Später',
    },
    prestigeTeaser: {
      title: 'Wenn es Winter wird',
      body: 'Am Saisonende fängst du neu an – mit Erbstücken, die alles schneller wachsen lassen.',
      cta: 'Danke, Oma',
      skipLabel: 'Schließen',
    },
  },

  /** Omas Notizbuch — letters unlocked by garden stages and Gartenjahre. */
  notebook: {
    readNext: (title: string) => `Neu: ${title.replace(/,$/, '')}`,
    title: 'Omas Notizbuch',
    intro: 'Briefe und Notizen, die Oma dir hinterlassen hat. Neue Seiten finden sich, wenn der Garten wächst.',
    open: 'Notizbuch öffnen',
    newLetter: 'Brief von Oma',
    newLetterAria: 'Neuer Brief von Oma — lesen',
    lockedEntry: 'Diese Seite ist noch zugeklebt.',
    lockedHintStage: (name: string) => `Öffnet sich beim ${name}.`,
    lockedHintYear: (year: number) => `Öffnet sich im ${year}. Gartenjahr.`,
    lockedHintDeep: 'Öffnet sich nach dem ersten Tiefen Winter.',
    lockedHintHelper: (n: number) => `Ein Brief von Jonas — kommt, wenn er Stufe ${n} erreicht.`,
    lockedHintIlse: (n: number) => `Ein Brief von Ilse — kommt, wenn sie Stufe ${n} erreicht.`,
    lockedHintGeneration: 'Ein Brief von Ilse — kommt, wenn du den Garten weitergibst.',
    signatureJonas: '— Dein Jonas',
    signatureIlse: '— Deine Ilse',
    fromJonas: 'Brief von Jonas',
    fromIlse: 'Brief von Ilse',
    close: 'Notizbuch schließen',
    read: 'Gelesen',
    signature: '— Deine Oma',
    laubeAria: 'Omas Laube — Notizbuch öffnen',
    entries: {
      welcome: {
        title: 'Mein liebes Enkelkind,',
        body: 'der Garten gehört jetzt dir. Er ist verwildert, aber unter den Brombeeren steckt gute Erde. Fang beim Gemüsebeet an.',
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
      jonas1: {
        title: 'Hallo von nebenan!',
        body: 'Ich bin Jonas, ich wohne zwei Gärten weiter. Ihre Oma hat mir früher immer Erdbeeren geschenkt, wenn ich beim Unkrautzupfen geholfen hab. Jetzt helfe ich Ihnen — ich bin noch langsam, aber ich lerne schnell. Versprochen!',
      },
      jonas3: {
        title: 'Ich hab was gelernt',
        body: 'Ich weiß jetzt, welche Beete sich lohnen und welche warten können. Gestern hat mir Frau Ilse gezeigt, wie man Kompost richtig umsetzt. Meine Mama sagt, ich rieche nach Garten. Ich finde, das ist ein Kompliment.',
      },
      jonas5: {
        title: 'Jetzt mach ich das richtig',
        body: 'Ich plane jetzt den ganzen Garten selbst, so wie Ihre Oma es gemacht hätte: erst das Neue anlegen, dann auf die großen Sprünge sparen. Sie können sich zurücklehnen. Ich pass auf alles auf — auch wenn Sie nicht da sind.',
      },
      ilse1: {
        title: 'Von einer alten Freundin',
        body: 'Deine Oma und ich haben fünfzig Jahre lang über den Zaun geredet. Über Äpfel, über Männer, über das Wetter. Jetzt pflege ich ihre Wiesen ein bisschen mit — das bin ich ihr schuldig. Und du bringst mir dafür ab und zu Obst, ja?',
      },
      ilse3: {
        title: 'Was sie dir nie gesagt hat',
        body: 'Sie war so stolz auf dich. Jedes Mal, wenn du zu Besuch warst, hat sie danach eine neue Sorte gepflanzt — „für später, wenn das Kind mal soweit ist“. Schau dich um. Das hier ist dieses Später.',
      },
      gen1: {
        title: 'Weitergeben',
        body: 'So hat sie es auch gemacht: Irgendwann gibt man den Garten weiter, mit allem, was man weiß. Die Beete fangen wieder klein an, aber die Familie wird jedes Mal ein bisschen reicher. Ich bleibe übrigens. Unkraut wächst schließlich auch weiter.',
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
    festGroup: 'Festsorten (nur während des Fests)',
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
      christrose: 'Christrose',
      schneegloeckchen: 'Schneeglöckchen',
      tulpeOsterglocke: 'Osterglocke',
      baerlauch: 'Bärlauch',
      pfingstrose: 'Pfingstrose „Sarah Bernhardt“',
      erdbeereMieze: 'Erdbeere „Mieze Schindler“',
      zucchiniGold: 'Gelbe Zucchini „Goldrush“',
      sonnenblumeRiesen: 'Riesen-Sonnenblume',
      kuerbisMuscat: 'Muskatkürbis',
      apfelBoskoop: 'Apfel „Boskoop“',
      physalis: 'Physalis (Lampionblume)',
      christstern: 'Christstern',
      gruenkohlFrost: 'Grünkohl „Frostkönig“',
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
    reward: (seeds: number) => `Lohn: +${zahl(seeds)} Samen und ein Korb Ernte`,
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
    bonusReward: (seeds: number, erb: number) => `+${zahl(seeds)} Samen · +${zahl(erb)} Erbstücke`,
    bonusLocked: (n: number) => `Noch ${n} Aufgaben`,
    reward: (seeds: number) => `+${zahl(seeds)} Samen`,
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
    glyphVariety: 'Sorte',
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
    gift: (seeds: number) => `Geschenk: +${zahl(seeds)} Samen und 30 Minuten Ernte`,
    cta: 'Danke, Oma',
  },

  reminders: {
    label: 'Erinnerungen',
    on: 'An',
    off: 'Aus',
    hint: 'Höchstens zweimal am Tag und nie nachts: wenn die Gießkanne voll ist, eine Kreuzung reif ist oder der Erntekorb überläuft (solange die App im Hintergrund geöffnet ist).',
    water: 'Die Gießkanne ist wieder voll — Zeit zum Gießen!',
    cross: 'Deine Kreuzung ist reif — schau nach, was gewachsen ist.',
    basket: 'Dein Erntekorb ist voll. Jetzt abholen, sonst wächst nichts mehr dazu.',
    denied: 'Benachrichtigungen sind im Browser blockiert.',
  },

  milestone: {
    tier: (name: string, tier: number) => (tier >= 5 ? `${name}: höchste Ausbaustufe erreicht – Omas Schild hängt!` : `${name}: Ausbaustufe ${tier} erreicht!`),
    toStar: (n: number) => `noch ${n} bis`,
    toStarAria: (n: number, at: number) => `Noch ${n} Stufen bis Meilenstein ${at} (doppelte Ernte)`,
    bestBuy: 'Omas Tipp: lohnt sich am meisten',
  },

  hints: {
    label: 'Omas Hinweis',
    ok: 'Verstanden',
    visitor: 'Besuch! Tipp Gäste an – sie bringen etwas mit.',
    order: 'Eine Hofladen-Bestellung: Ernte einfahren, dann „Abliefern“ tippen.',
    variety: 'Eine neue Sorte – jede bringt für immer etwas mehr Ernte (Notizbuch → Pflanzenbuch).',
    season: 'Die Saison kann enden: Neustart mit Erbstücken, das nächste Jahr wächst schneller.',
    truhe: 'Gib Erbstücke in Omas Truhe aus – die Boni bleiben für immer.',
    weekly: 'Neu: Omas Wochenplan – unten links unter „Heute“.',
    deep: 'Alle Ecken sind offen. Wenn du magst, kann der Garten jetzt einen Tiefen Winter ruhen — für Sprösslinge, die für immer bleiben.',
    bulkMax: 'Neu: „Max“ baut so oft aus, wie deine Ernte reicht.',
    bulk5: 'Neu: „×5“ kauft fünf Stufen auf einmal.',
    buyAll: 'Neu: „Alles ausbauen“ steckt deine Ernte dorthin, wo sie am meisten bringt.',
    recipeNew: 'Neu: Omas Tagesrezept – unter „Heute“ siehst du, welche Beete heute liefern.',
    festNew: 'Neu: Gartenfeste mit Festmarken und eigenem Laden – tipp oben auf die Fest-Pille.',
    weatherNew: 'Neu: Das Wetter ändert die Ernte ein wenig – oben siehst du auch morgen.',
    crossNew: 'Neu: Saatgut kreuzen (Menü → Kreuzen) – zwei Sorten ergeben in 4 Stunden etwas Neues.',
    clanNew: 'Neu: der Kleingartenverein (Menü → Verein) – jede Woche Kürbiswiegen gegen die Nachbarn.',
    arcI: 'Neu in diesem Bogen: ein Patenbeet. Oben unter „Patenbeet“ wählst du einen Bereich — seine Nachbarn tragen dann mehr. Ilse entscheidet das nicht für dich.',
    arcII: 'Neu in diesem Bogen: die Tauschpost. Oben unter „Tauschpost“ wählst du einen Weg für dieses Kapitel. Ilse entscheidet das nicht für dich.',
    arcIII: 'Neu in diesem Bogen: Wasser verteilen. Oben unter „Wasser“ gibst du den Bereichen Wasserpunkte. Ilse entscheidet das nicht für dich.',
    arcIV: 'Neu in diesem Bogen: ein Plan für morgen. Oben unter „Plan“ wählst du, ob das Kapitel jetzt oder während du weg bist mehr trägt. Ilse entscheidet das nicht für dich.',
    helperAreas: 'Jonas baut jetzt mit deiner Ernte aus – abschalten kannst du das je Bereich.',
    holdBuy: 'Gedrückt halten baut weiter – je länger, desto mehr Stufen auf einmal.',
  },

  backup: {
    title: 'Spielstand sichern',
    menu: 'Spielstand sichern',
    intro: 'Dein Garten liegt nur auf diesem Gerät. Speichere den Code oder die Datei an einem sicheren Ort — damit holst du ihn auf jedes Gerät zurück.',
    exportTitle: 'Sichern',
    importTitle: 'Wiederherstellen',
    codeAria: 'Dein Spielstand-Code',
    importAria: 'Spielstand-Code einfügen',
    copy: 'Code kopieren',
    copied: 'Kopiert!',
    download: 'Als Datei speichern',
    placeholder: 'Code hier einfügen …',
    pickFile: 'Datei wählen',
    import: 'Wiederherstellen',
    confirm: 'Wirklich? Ersetzt den aktuellen Garten',
    invalid: 'Das ist kein gültiger Gartenerbe-Code.',
    newer: 'Dieser Spielstand stammt aus einer neueren Version. Bitte zuerst die App aktualisieren (Menü → Nach Updates suchen).',
    old: 'Dieser Code stammt aus einer Vorversion des Spiels und lässt sich nicht mehr einspielen.',
    found: (when: string) => `Gültiger Spielstand vom ${when}.`,
    close: 'Schließen',
    autoTitle: 'Automatische Sicherungen',
    autoIntro: 'Das Spiel sichert deinen Garten selbst auf diesem Gerät: einmal am Tag und vor jedem Tiefen Winter, jeder Generation und jedem Wiederherstellen. Bei einem neuen Handy oder gelöschten Browserdaten helfen sie nicht — dafür Code oder Datei oben sichern.',
    autoEmpty: 'Noch keine automatische Sicherung.',
    kinds: {
      daily: 'Tages-Sicherung',
      deep: 'Vor dem Tiefen Winter',
      generation: 'Vor der Generation',
      import: 'Vor dem Einspielen',
      restore: 'Vor dem Wiederherstellen',
    },
    row: (when: string, year: number, chapters: number) => `${when} · Gartenjahr ${year} · ${chapters} Kapitel`,
    restore: 'Wiederherstellen',
    restoreConfirm: 'Wirklich? Dein jetziger Garten wird vorher gesichert',
    restoreBlocked: 'Gerade nicht möglich: Das Spiel ist in einem anderen Fenster offen oder eine neuere Version hat gespeichert.',
    restoreFailed: 'Diese Sicherung lässt sich nicht einspielen.',
    offerTitle: 'Dein Garten fehlt',
    offerBody: 'Auf diesem Gerät ist kein Spielstand zu finden, aber es gibt automatische Sicherungen. Soll eine davon zurück?',
    offerNew: 'Neuen Garten anlegen',
    offerNewNote: 'Die Sicherungen bleiben erhalten; du findest sie später unter Menü → Spielstand sichern.',
    remindText: 'Seit deiner letzten Sicherung ist viel gewachsen. Die Sicherungen auf diesem Gerät helfen nicht, wenn du das Handy wechselst oder die Browserdaten löschst — leg den Code einmal woanders ab.',
    remindSave: 'Jetzt sichern',
    remindLater: 'Später',
  },

  legal: {
    title: 'Rechtliches',
    impressum: 'Impressum',
    close: 'Schließen',
    privacy: privacyStrings,
  },

  season: {
    winterTitle: 'Winterruhe',
    winterLine: 'Der Garten schläft. Was gewachsen ist, bleibt in deinen Händen.',
    springTitle: (year: number) => `Gartenjahr ${year}`,
    deepTitle: 'Tiefer Winter',
    deepLine: 'Der Garten ruht lange und tief. Die Wurzeln sammeln Kraft.',
    deepSpringTitle: 'Ein neuer Anfang',
    sprouts: (n: number) => `+${zahl(n)} Sprösslinge`,
    springLine: 'Der Schnee schmilzt — Zeit, wieder anzupacken.',
    gained: (text: string) => `Eingelagert: ${text}`,
    newCorner: (name: string) => `Neu zu roden: ${name}`,
    cta: 'Ins neue Gartenjahr',
    skip: 'Weiter',
  },

  today: {
    title: 'Heute',
    eyebrow: 'Für heute',
    button: 'Heute',
    ready: (n: number) => `${n} bereit`,
    allDone: 'erledigt',
    open: 'Heute öffnen: Gartenrunde, Tagesrezept, Tagesziele und Wochenplan',
    close: 'Schließen',
    dailyDone: 'Erledigt',
    movedNote: 'Tagesziele und Omas Wochenplan stehen jetzt unter „Heute“ (unten links).',
    restNote: (h: string) => `Gartenrunde und alle Tagesziele abgeholt? Dann ruht der Garten nach dem Tiefen Winter ${h} Stunden kürzer.`,
    restDone: 'Heute erledigt — die Ruhezeit ist kürzer geworden.',
  },

  daily: {
    kicker: 'Tägliche Gartenrunde',
    short: 'Gartenrunde',
    dayOf: (n: number) => (n >= 7 ? 'Tag 7/7 · Wochenkorb!' : `Tag ${n}/7 · Korb an Tag 7`),
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
    rewardErnte: (amount: string) => `${amount} ${SOFT}`,
    rewardErbstuecke: (n: number) => erb(n),
    rewardSamen: (n: number) => `${zahl(n)} ${SEEDS}`,
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
      `${progress} → ${zahl(reward)} ${SEEDS}`,
    claimGoal: 'Abholen',
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

  ...expansionStrings,
  ...lifeStrings,
  ux: uxStrings,
  arcRules: arcStrings,
  careNames,
} as const

