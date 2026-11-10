/**
 * English player-facing copy — Heirloom Garden.
 *
 * Story: Grandma left you her overgrown allotment. Her notebook (the narrator)
 * guides you from bramble thicket to garden park.
 *
 * Terms follow docs/i18n/glossar.md: Harvest (soft) · Heirlooms (meta,
 * survives Season's End) · Seeds (premium). Prestige = Season's End.
 */
import type { Strings } from '../types'
import { count, nHeirlooms, nSeedlings, nSeeds } from './count'
import { careNames } from './careNames'
import { privacyStrings } from './legal'
import { manifestStrings } from './manifest'
import { expansionStrings } from './stringsExpansion'
import { lifeStrings } from './stringsLife'
import { uxStrings } from './stringsUx'

const SOFT = 'harvest'
const SEEDS = 'seeds'

/** “1 heirloom” / “1,500 heirlooms” */
const erb = nHeirlooms

/** “1 variety” / “3 varieties” */
function varieties(n: number): string {
  return count(n, 'variety', 'varieties')
}

export const strings: Strings = {
  brand: 'Heirloom Garden',
  tagline: 'From overgrown plot to garden park',
  meta: {
    title: 'Heirloom Garden',
    description:
      'Heirloom Garden — from overgrown plot to garden park. Your garden keeps growing, even offline.',
    pwaDescription: 'Grandma’s garden keeps growing, even while you’re away.',
    manifest: manifestStrings,
  },

  /** Numbers & durations (src/game/format.ts) */
  num: {
    decimal: '.',
    group: ',',
    /** 10³, 10⁶, 10⁹, 10¹², 10¹⁵, 10¹⁸ — short scale */
    units: ['K', 'M', 'B', 'T', 'Qa', 'Qi'],
    minutes: (n: number) => (n === 1 ? '1 minute' : `${n} minutes`),
    hours: (n: number) => (n === 1 ? '1 hour' : `${n} hours`),
    days: (n: number) => (n === 1 ? '1 day' : `${n} days`),
    /** Price with currency (amount already uses the decimal sign) */
    euro: (amount: string) => `€${amount}`,
  },

  /** Language names in their own language (switcher) */
  languageNames: { de: 'Deutsch', en: 'English' },

  eyebrow: 'Grandma’s Garden',

  /** Garden growth stage — derived from areas planted (0–10). */
  gardenStage: {
    aria: (name: string) => `Garden stage: ${name}`,
    names: [
      'Overgrown Plot',
      'Overgrown Plot',
      'Allotment',
      'Allotment',
      'Kitchen Garden',
      'Market Garden',
      'Market Garden',
      'Courtyard Garden',
      'Courtyard Garden',
      'Show Garden',
      'Garden Park',
    ],
  },

  nav: {
    settings: 'Settings',
    ariaLabel: 'Main navigation',
    garten: 'Garden',
    prestige: 'Season',
    clan: 'Club',
    shop: 'Market',
    menu: 'Menu',
    menuClose: 'Close menu',
    backToMap: 'To the garden',
  },

  sound: {
    label: 'Sound',
    ambience: 'Nature sounds',
    on: 'On',
    off: 'Off',
    mute: 'Sound off',
    unmute: 'Sound on',
    muteAria: 'Mute sound effects',
    unmuteAria: 'Turn sound effects on',
  },

  // Test-phase notice on the first start of the installed app (game/distribution.ts TEST_PHASE)
  testPhase: {
    title: 'Welcome to the test phase',
    intro: 'Heirloom Garden is being tested right now. To help us improve the game, the app records how it is played:',
    points: [
      'which game actions you take and when (e.g. upgrades, Season’s End, menu),',
      'how long and how often you play, plus one progress snapshot per day.',
      'Everything stays on your device. Nothing is sent automatically — you can export the log yourself and pass it on.',
    ],
    checkbox: 'Allow recording',
    later: 'You can change this any time: Menu → Settings → Playtest log.',
    confirm: 'Got it',
  },

  // Install notice when started in the browser (web build only, see game/distribution.ts)
  installGate: {
    title: 'Install the app first',
    howTo: 'Here’s how',
    detected: (device: string, browser: string) => `Detected: ${device} · ${browser}`,
    nativeInstall: 'Install now',
    why: [
      ['Always on your home screen', ' – just like a real app.'],
      ['Grows offline too', ' – your garden keeps going without internet.'],
      ['Your garden is safer', ' – the browser won’t wipe your progress so easily.'],
    ] as [string, string][],
    iosWarning:
      'Important on iPhone and iPad: whatever you grow here in the browser won’t carry over to the installed app. So please install first.',
    carryTitle: 'Already gardening in the browser?',
    carryBody: 'Copy your save code and load it in the app after installing (Menu → Back up progress).',
    carryCopy: 'Copy save code',
    carryCopied: 'Copied ✓',
    copyUrl: 'Copy address',
    urlCopied: 'Address copied – paste it into your browser',
    skip: 'Continue in the browser without installing',
    skipNote: 'This notice will come back in a few hours.',
    os: { ios: 'iPhone / iPad', android: 'Android', desktop: 'Computer' } as Record<string, string>,
    browser: {
      safari: 'Safari',
      chrome: 'Chrome',
      firefox: 'Firefox',
      edge: 'Edge',
      samsung: 'Samsung Internet',
      opera: 'Opera',
      inapp: 'in-app browser',
      other: 'browser',
    } as Record<string, string>,
    /** {S} = share icon */
    steps: {
      'ios-safari': [
        'Tap the share icon {S} at the bottom (iPhone) or top (iPad).',
        'Scroll down and choose “Add to Home Screen”.',
        'Tap “Add” in the top right.',
      ],
      'ios-chrome': [
        'Tap the share icon {S} in the address bar, top right.',
        'Choose “Add to Home Screen” (you may need to tap “More” first).',
        'Tap “Add”.',
      ],
      'ios-firefox': ['Tap the menu ☰ in the bottom right.', 'Choose “Share”, then “Add to Home Screen”.', 'Tap “Add”.'],
      'ios-edge': ['Tap the menu ⋯ at the bottom, then “Share” {S}.', 'Choose “Add to Home Screen”.', 'Tap “Add”.'],
      'ios-other': [
        'Open this page in Safari (copy the address and paste it into Safari).',
        'Then Share {S} → “Add to Home Screen” → “Add”.',
      ],
      'android-chrome': ['Tap the menu ⋮ in the top right.', 'Choose “Install app” or “Add to Home screen”.', 'Confirm with “Install”.'],
      'android-samsung': ['Tap the menu ☰ in the bottom right.', 'Choose “Add page to”, then “Home screen”.', 'Confirm with “Add”.'],
      'android-firefox': ['Tap the menu ⋮.', 'Choose “Install” or “Add to Home screen”.', 'Confirm with “Add”.'],
      'android-edge': ['Tap the menu ⋯ at the bottom.', 'Choose “Add to phone” or “Install app”.', 'Confirm.'],
      'android-opera': ['Tap the menu ⋮.', 'Choose “Add to Home screen”.', 'Confirm.'],
      'android-other': ['Best open this page in Chrome.', 'Menu ⋮ → “Install app”.'],
      inapp: [
        'You opened this page from inside an app (e.g. WhatsApp or Telegram). Nothing can be installed from there.',
        'Tap ⋯ or ⋮ in the top right and choose “Open in browser”.',
        'The right instructions will appear then.',
      ],
    } as Record<string, string[]>,
  },

  challenges: {
    title: 'Grandma’s Challenges',
    intro: 'One season with one rule, the way Grandma sometimes did it. Starts with the next Season’s End — you can stop any time without losing anything.',
    names: { ohneKompost: 'No Compost', fuenfBeete: 'Only Five Beds', ohneGiessen: 'No Watering Can' },
    rules: {
      ohneKompost: 'The compost heap stays closed this season.',
      fuenfBeete: 'Plant five areas at most.',
      ohneGiessen: 'No watering and no refilling.',
    },
    active: (name: string) => `In progress: ${name}`,
    abort: 'Stop',
    choose: 'Next season',
    chosen: 'Chosen ✓',
    done: 'done',
    reward: 'Every challenge you complete: +3 % garden harvest forever.',
    blocked: 'Not right now — Grandma’s challenge is running.',
  },

  collections: {
    menu: 'Collection',
    title: 'Collection & Goals',
    total: (pct: number) => `${pct} % collected`,
    rows: {
      pflanzenbuch: 'Plant Book',
      bewohner: 'Garden Wildlife',
      album: 'Seasons Album (this season)',
      erfolge: 'Achievements',
      kreuzungen: 'Crossings',
      herausforderungen: 'Grandma’s Challenges',
    },
    nearSet: (n: number, area: string) => `${varieties(n)} to go for the ${area} set (+2 % harvest)`,
    chaptersTitle: 'Grandma’s Plots',
    unknown: '???',
    chapterOpen: 'open',
    chapterFirst: 'unlocks after the 1st Deep Winter',
    chapterSecond: 'unlocks with the 1st generation',
    chapterLater: (gen: number, prev: number) => `unlocks with generation ${gen}, once chapter ${prev} has its 8th area`,
    chapterLater13: (gen: number, half: boolean, prev: number) =>
      `unlocks with generation ${gen}${half ? ' plus half the Deep Winters to the next' : ''}, once chapter ${prev} is fully planted`,
    goalTitle: (area: string) => `Plant Book: ${area} set`,
    goalDetail: (n: number) => `${varieties(n)} to go`,
  },

  mastery: {
    title: 'Chapter Mastery',
    summary: (have: number, total: number) => `${have} of ${total} mastery stars`,
    explain: (level: number, care: number, careMax: number, pct: number) =>
      `First star when every area of a chapter is at level ${level}. Second star when every area has at least rank ${care} in both kinds of care, third at rank ${careMax}. Each star: +${pct} % yield in that chapter.`,
    starsAria: (n: number, max: number) => `Chapter Mastery: ${n} of ${max} stars`,
    nextLevel: (have: number, total: number, level: number) => `${have} of ${total} areas at level ${level}`,
    nextCare: (have: number, total: number, rank: number) => `${have} of ${total} areas cared for up to rank ${rank}`,
    done: 'Mastery complete',
    toast: (n: number, pct: number) => `Chapter Mastery: star ${n}! Now +${pct} % yield in this chapter`,
  },

  seasonCards: {
    title: 'A theme for this garden year',
    intro: 'Grandma did something different every year. Pick a theme — it lasts until the next Season’s End.',
    preview: (pct: number) => `with your last garden ≈ ${pct > 0 ? '+' : ''}${pct} % harvest`,
    previewEven: 'with your last garden ≈ the same harvest',
    previewQuiet: 'pays off if you’re often away for a while',
    previewAway: (active: number, away: number) => `while playing ≈ ${active > 0 ? '+' : ''}${active} % · while away ≈ ${away > 0 ? '+' : ''}${away} %`,
    result: (name: string, pct: number) => `Your theme “${name}” brought ≈ ${pct > 0 ? '+' : ''}${pct} % harvest with your garden.`,
    resultAway: (name: string, active: number, away: number) => `Your theme “${name}”: ≈ ${active > 0 ? '+' : ''}${active} % while playing, ≈ ${away > 0 ? '+' : ''}${away} % harvest while you were away.`,
    skip: 'Keep gardening without a theme',
    pill: (name: string) => name,
    cards: {
      tomatenjahr: { name: 'Year of Tomatoes', effect: 'Vegetable Patch ×2 · Fruit Trees ×0.8' },
      kompostjahr: { name: 'Year of Compost', effect: 'Compost Heap ×2 · Berry Hedge ×0.8' },
      kraeuterjahr: { name: 'Year of Herbs', effect: 'Herb Spiral ×2 · Vegetable Patch ×0.8' },
      beerenjahr: { name: 'Year of Berries', effect: 'Berry Hedge ×2 · Compost Heap ×0.8' },
      obstjahr: { name: 'Year of Fruit', effect: 'Fruit Trees ×1.8 · Herb Spiral ×0.8' },
      bienenjahr: { name: 'Year of Bees', effect: 'Beehive ×1.8 · Chicken Coop ×0.8' },
      huehnerjahr: { name: 'Year of Hens', effect: 'Chicken Coop ×1.8 · Beehive ×0.8' },
      glashausjahr: { name: 'Year under Glass', effect: 'Greenhouse ×1.8 · Berry Hedge ×0.8' },
      hofladenjahr: { name: 'Year of the Farm Shop', effect: 'Farm Shop ×1.8 · Greenhouse ×0.8' },
      ruhigesJahr: { name: 'A Quiet Year', effect: 'While you’re away +50 % · while playing −20 %' },
      fleissjahr: { name: 'A Busy Year', effect: 'While playing +10 % · while you’re away −40 %' },
      gutesJahr: { name: 'A Good Year', effect: 'Everything +5 %' },
    },
  },

  features: {
    newBadge: 'New',
  },

  saveGuard: {
    newer: 'Your progress is newer than this version of the app. Nothing is saved here until you update — your progress stays safe.',
    otherTab: 'Heirloom Garden is already open in another window. Nothing is saved here; close the other window and you can carry on here.',
    update: 'Update now',
  },

  crash: {
    title: 'Something went wrong',
    body: 'Your garden is saved. To be safe, you can copy your save code and then reload.',
    copy: 'Copy save code',
    copied: 'Copied ✓',
    reload: 'Reload',
  },

  playtest: {
    title: 'Playtest log',
    on: 'On',
    off: 'Off',
    export: 'Export log',
    copy: 'Copy log',
    copied: 'Copied ✓',
    saved: 'Saved ✓',
    failed: 'That didn’t work — please use “Copy log”',
    count: (n: number) => `${n}`,
    clear: 'Clear log',
    clearConfirm: 'Really clear? Tap again',
  },

  goal: {
    stripAria: 'Next goal',
    upgradeTitle: (action: string, name: string) => `${action}: ${name}`,
    upgradeDetail: (cost: string) => `${cost} ${SOFT}`,
    unlockTitle: (name: string) => `Clear: ${name}`,
    unlockErnteLeft: (n: string) => `${n} ${SOFT} to go`,
    unlockLevel: (name: string, have: number, need: number) =>
      `${name} ${have}/${need}`,
    unlockPlayerLevel: (have: number, need: number) =>
      `Gardener level ${have}/${need}`,
    levelTitle: (n: number) => `Gardener level ${n}`,
    levelDetail: (into: number, need: number) => `${into}/${need} XP`,
    prestigeTitle: 'Season’s End',
    prestigeDetail: (left: string) => `${left} ${SOFT} to go`,
    prestigeReady: 'Season’s End ready',
    prestigeReadyDetail: 'Store your heirlooms',
    ready: 'Ready',
    fallback: 'Tend the garden',
    nearMiss: (pct: number) => `${100 - pct} % done`,
  },

  bestBuy: {
    tipAffordable: (name: string) => `Tip: ${name}`,
    tipSoon: (name: string) => `Soon: ${name}`,
    tipCost: (name: string, cost: string) => `Tip: ${name} · ${cost}`,
    tipHold: 'Tap to open · hold to buy more',
    aria: 'Grandma’s tip for the next upgrade — tap to open',
  },

  surprise: {
    milestone: (amount: string) => `Beauty! +${amount}`,
    jackpot: (amount: string) => `Record harvest! +${amount}`,
    prestigeNear: (amount: string) => `Season’s End is near +${amount}`,
    offlineJackpot: (amount: string) => `Grew overnight +${amount}`,
  },

  flash: {
    name: 'Sunbreak',
    blurb: '+15 % harvest/s · the sun comes out.',
    endsMin: (m: number, s: number) =>
      s > 0 ? `${m}:${String(s).padStart(2, '0')} left` : `${m} min left`,
    endsSec: (s: number) => `${s}s left`,
    endsSoon: 'Clouds are rolling in',
    graceLabel: 'Collect your reward',
    goalAria: 'Sunbreak goal',
    goalLine: (progress: string, reward: number) =>
      `${progress} → ${nSeeds(reward)}`,
    claimGoal: 'Collect',
    claimed: 'Collected',
    dismiss: 'Close',
  },

  resources: {
    ernte: 'Harvest',
    erbstuecke: 'Heirlooms',
    samen: 'Seeds',
  },

  /**
   * Ten garden areas. `blurb` = what it does; `note` = Grandma's notebook.
   * Order follows the economy ladder G1 → G10.
   */
  modules: {
    gemuesebeet: {
      name: 'Vegetable Patch',
      blurb: 'Radishes, lettuce, beans — the first harvest.',
      note: '“Start small. One bed, well kept, feeds more than ten forgotten ones.”',
    },
    kompost: {
      name: 'Compost Heap',
      blurb: 'Scraps turn into black gold for every bed.',
      note: '“What the garden takes, the compost gives back. Nothing goes to waste.”',
    },
    kraeuterspirale: {
      name: 'Herb Spiral',
      blurb: 'Thyme at the top, mint at the bottom — smells like summer.',
      note: '“Stones hold the sun. The herbs will thank you for it.”',
    },
    beerenhecke: {
      name: 'Berry Hedge',
      blurb: 'Currants, gooseberries and raspberries for jam.',
      note: '“All those old brambles ever wanted was a proper trellis.”',
    },
    obstwiese: {
      name: 'Fruit Trees',
      blurb: 'Apple, pear, plum — a harvest from the tree.',
      note: '“Grandpa planted the first apple tree. You plant the next one.”',
    },
    bienenstock: {
      name: 'Beehive',
      blurb: 'Honey, and blossoms pollinated all over the garden.',
      note: '“No bees, no fruit. Speak kindly to them.”',
    },
    huehnerstall: {
      name: 'Chicken Coop',
      blurb: 'Fresh eggs and busy slug hunters.',
      note: '“Hens eat slugs and lay eggs. You won’t find better neighbors.”',
    },
    gewaechshaus: {
      name: 'Greenhouse',
      blurb: 'Tomatoes and peppers — even when it turns chilly outside.',
      note: '“Under glass, summer lasts longer. Don’t forget to air it!”',
    },
    hofladen: {
      name: 'Farm Shop',
      blurb: 'Crates, jars, customers — your harvest finds buyers.',
      note: '“When the neighbors ask if they may buy some, you’ve made it.”',
    },
    orangerie: {
      name: 'Orangery',
      blurb: 'Lemons and figs under glass domes — the crown jewel.',
      note: '“I always dreamed of this. Now it’s your garden.”',
    },
  },

  unlock: {
    prefix: 'Clear at:',
    or: ' or ',
    ernteEarned: (n: string) => `${n} ${SOFT} gathered`,
    levelOf: (name: string, level: number) => `${name} level ${level}`,
    playerLevel: (level: number) => `Gardener level ${level}`,
    seasonGate: (year: number) =>
      `We’ll clear this corner in garden year ${year}.`,
    seasonShort: (year: number) => `from garden year ${year}`,
  },

  hud: {
    burstReady: 'Water',
    burstCooling: 'Can refilling',
    burstReadyTitle: 'Watering can: ~45 s of harvest at once — every 5 min',
    burstCoolingTitle: 'The watering can is refilling',
    offlineBefore: 'While you were away, this grew:',
    offlineAfter: `${SOFT}.`,
    claim: 'Harvest',
    claimToast: 'Harvest brought in',
    claimCelebrate: (amount: string, xp: number) =>
      `+${amount} ${SOFT} · +${xp} XP`,
    claimCelebrateShort: (amount: string) => `+${amount} ${SOFT}`,
    mapAria: 'Your garden',
    mapHint: 'Tap a bed → plant or upgrade.',
    locked: 'Wilderness',
    levelShort: (level: number) => `Level ${level}`,
    gateErnte: (n: string) => `${n} ${SOFT}`,
    buildingAriaUnlocked: (name: string, level: number, rate: string) =>
      `${name}, level ${level}, ${rate}. Tap to upgrade.`,
    buildingAriaLocked: (name: string, hint: string) =>
      `${name}, still wilderness. ${hint}`,
    playerLevelAria: (level: number, xp: number, need: number) =>
      `Gardener level ${level}, ${xp} of ${need} XP`,
    progressOpen: 'Goals & milestones',
    progressClose: 'Close',
    levelUp: (n: number) => `Gardener level ${n}!`,
    waterCooling: (clock: string) => `Can refilling · ${clock}`,
    questReady: 'Task done — collect',
  },

  level: {
    label: 'Gardener Level',
    short: 'Gardener level',
    xp: 'XP',
    bonus: (pct: string) => `+${pct} % ${SOFT}/s`,
    rewards: {
      ernte: (n: number) => `+${n} ${SOFT}`,
      erbstuecke: (n: number) => `+${erb(n)}`,
      samen: (n: number) => `+${nSeeds(n)}`,
      cosmetic: (name: string) => `Garden style: ${name}`,
    },
  },

  branches: {
    title: 'Care',
    efficiency: 'Fertilize',
    capacity: 'Mulch',
    efficiencyBlurb: '+4 % harvest/s per level (max. 5).',
    capacityBlurb: '−3 % upgrade cost per level (max. 5).',
    efficiencyPerRank: '+4 % harvest per level',
    capacityPerRank: 'Upgrades 3 % cheaper per level',
    efficiencyEffect: (pct: number) => `+${pct} % yield`,
    capacityEffect: (mult: string) => `×${mult} cost`,
    rank: (n: number, max: number) => `Rank ${n}/${max}`,
    buy: (name: string, cost: string) => `${name} · ${cost}`,
    maxed: 'Max',
    needOnline: 'Plant it first.',
  },

  achievements: {
    title: 'Milestones',
    intro: 'One time only — Grandma ticks them off in her notebook.',
    done: 'Ticked off',
    rewardErnte: (n: number) => `+${n} ${SOFT}`,
    rewardErbstuecke: (n: number) => `+${erb(n)}`,
    rewardSamen: (n: number) => `+${nSeeds(n)}`,
    rewardCosmetic: (name: string) => `Garden style: ${name}`,
    firstUpgrade: {
      name: 'First Spadeful',
      blurb: 'Upgrade something for the first time.',
    },
    bedTen: {
      name: 'Prize Bed',
      blurb: 'Bring the Vegetable Patch to level 10.',
    },
    compostOnline: {
      name: 'Black Gold',
      blurb: 'Set up the Compost Heap.',
    },
    earn10k: {
      name: 'Full Pantry',
      blurb: 'Gather 10,000 harvest in total.',
    },
    dailyOnce: {
      name: 'Morning Round',
      blurb: 'Collect your Daily Rounds once.',
    },
    offlineOnce: {
      name: 'Grown Overnight',
      blurb: 'Bring in a harvest that grew without you.',
    },
    fiveOnline: {
      name: 'No More Weeds',
      blurb: 'Have five areas planted at the same time.',
    },
    levelFive: {
      name: 'Green Thumb',
      blurb: 'Reach gardener level 5.',
    },
    prestigeOnce: {
      name: 'First Winter Rest',
      blurb: 'Finish your first season.',
    },
    upgradesFifty: {
      name: 'Busy Hands',
      blurb: 'Upgrade 50 times in total.',
    },
  },

  quests: {
    title: 'Today’s tasks',
    intro: 'Three notes from Grandma — no rush.',
    claim: 'Collect',
    claimed: 'Done',
    progress: (cur: string, target: string) => `${cur} / ${target}`,
    upgradeTimes: (n: number) => `Upgrade ${n}×`,
    earnErnte: (n: string) => `Bring in ${n} ${SOFT}`,
    claimDaily: 'Collect your Daily Rounds',
    rewardLine: (ernte: number, seeds: number) =>
      seeds > 0 ? `+${ernte} ${SOFT} · +${nSeeds(seeds)}` : `+${ernte} ${SOFT}`,
  },

  upgrade: {
    close: 'Close',
    moduleEyebrow: 'Garden area',
    noteLabel: 'From Grandma’s notebook',
    level: 'Level',
    now: 'now',
    next: 'next',
    milestone: 'Every 10 levels: +2 % prize bonus.',
    online: 'Plant',
    upgrade: 'Upgrade',
    locked: 'Still wilderness',
    offlineEmpty: 'Not planted yet.',
    gateClosed: 'Clear it first — then plant.',
    needMore: (amount: string) => `${amount} ${SOFT} to go`,
    costLine: (action: string, cost: string) => `${action} · ${cost} ${SOFT}`,
    branchHint: 'Care is a bonus — upgrading pays off most.',
    holdHint: 'Hold for more',
  },

  prestige: {
    title: 'Season’s End',
    introBefore: 'The garden goes into its winter rest. You keep',
    introAfter:
      'for the next garden year. This season’s beds and harvest rest until spring.',
    erbstuecke: 'Heirlooms:',
    multiplier: 'Heirloom bonus:',
    runs: 'Years completed:',
    thisRun: 'This season:',
    gate: 'From:',
    erbstueckePreview: (n: number) => `Preview +${erb(n)}`,
    nextPayout: 'Store now:',
    longerHint: 'gardening longer brings up to twice as much',
    laterPayout: (n: number) => `in ~10 minutes it would be ${n}`,
    erbstueckeAmount: (n: number) => `+${erb(n)}`,
    claimReset: (n: number) => `Winter rest · +${erb(n)}`,
    claimResetRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Winter rest · +${erb(n)} — chest opens after ~${mods} upgrades`
        : `Winter rest · +${erb(n)} — chest opens as you replant`,
    needMore: (amount: string) => `${amount} ${SOFT} to go until Season’s End`,
    needErbstuecke: (have: number, need: number) =>
      `${need - have} more in heirloom value (min. ${need}) — the season still has more to give`,
    needModules: (have: number, need: number) =>
      `Plant ${need} areas first (now ${have})`,
    emptyGate: 'Harvest more — then Season’s End.',
    emptyShop: 'Grandma’s Chest opens after your first Season’s End.',
    shopTitle: 'Grandma’s Chest',
    shopIntro:
      'Heirlooms from past seasons make every new garden year stronger. More treasures turn up as you replant.',
    shopReady: (n: number) =>
      n === 1
        ? '1 treasure ready — more turn up as you replant.'
        : `${n} treasures ready — more turn up as you replant.`,
    shopWaiting: (name: string, nextRank: number, pct: number) =>
      `Next up: ${name} rank ${nextRank} (${pct}%) — keep upgrading.`,
    shopUnlockAria: (name: string) => `Progress towards ${name}`,
    shopNextTag: 'Next up',
    shopRankLocked: (need: string) =>
      `${need} more progress (upgrades / harvest)`,
    shopRankLockedProgress: (pct: number, left: string) =>
      `${pct}% — ${left} more progress`,
    shopModulesLocked: (need: number) =>
      `Plant ${need} areas this season first`,
    max: 'Max',
    costErbstuecke: (n: number) => erb(n),
    spendCta: (n: number) =>
      n === 1 ? 'Grandma’s Chest · 1 treasure ready' : `Grandma’s Chest · ${n} treasures ready`,
    spendAria: 'Open Grandma’s Chest — treasures ready',
    keepTitle: 'Stays',
    loseTitle: 'Rests until spring',
    keepItems: ['Heirlooms & chest', 'Seeds, garden styles, streak', 'Garden years'],
    loseItems: ['This season’s harvest', 'Upgrade levels', 'Progress towards Season’s End'],
    branchYieldTitle: 'Yield',
    branchYieldBlurb: 'More harvest, cheaper upgrades.',
    branchPflegeTitle: 'Care',
    branchPflegeBlurb: 'Grow longer offline, water more strongly.',
    branchStartTitle: 'Head Start',
    branchStartBlurb: 'Into the new garden year faster.',
    worthItCta: (n: number) => `Season’s End pays off · +${erb(n)}`,
    worthItNear: (n: number) => `Season’s End is near · +${erb(n)}`,
    worthItAria: 'Open Season’s End — heirloom preview',
    worthItRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Season’s End ready · +${erb(n)} — chest after ~${mods} upgrades`
        : `Season’s End ready · +${erb(n)} — chest as you replant`,
    worthItNearRebuild: (n: number, mods: number) =>
      mods > 0
        ? `Season’s End is near · +${erb(n)} — chest after ~${mods} upgrades`
        : `Season’s End is near · +${erb(n)} — chest as you replant`,
    pill: (n: number) => `Season’s End · +${erb(n)}`,
    pillReady: 'Grandma’s Chest',
    worthItRebuildAria:
      'Open Season’s End — heirlooms are coming, chest as you replant',
  },

  longLoop: {
    title: 'Deep Winter',
    intro:
      'Once every corner is open, the garden can rest through a long winter. Afterwards you start again in garden year one — with seedlings that stay forever.',
    sprouts: 'Seedlings',
    winters: 'Deep Winters',
    payout: 'Now',
    keepItems: ['Seedlings & their bonuses', 'Seeds, garden styles, streak', 'Gardener level, Grandma’s letters'],
    loseTitle: 'Fresh in spring',
    loseItems: ['Garden years', 'Heirlooms & Grandma’s Chest', 'Beds and harvest'],
    cta: (n: number) => `Deep Winter · +${nSeedlings(n)}`,
    gateClosed: (year: number) => `Possible from garden year ${year}`,
    confirmCta: 'Really? Tap again — the garden will rest',
    resting: (clock: string) => `The garden is still resting · ${clock}`,
    restHint: 'After a Deep Winter the soil needs three days of rest before the next one can come.',
    shopTitle: 'Seedling Shop',
    rank: (rank: number, max: number) => `Rank ${rank}/${max}`,
    cost: (n: number) => `${nSeedlings(n)}`,
    items: {
      tiefeWurzeln: {
        name: 'Deep Roots',
        blurb: '+10 % harvest/s per rank — forever.',
        effect: (rank: number) => `+${rank * 10} % ${SOFT}/s`,
      },
      winterschutz: {
        name: 'Winter Cover',
        blurb: 'Grow longer offline: +1 h / +2 h max. per rank.',
        effect: (rank: number) => `+${rank} h / +${rank * 2} h max.`,
      },
      saatgutvorrat: {
        name: 'Seed Store',
        blurb: 'Every fresh start begins with 60 heirlooms per rank.',
        effect: (rank: number) => `${nHeirlooms(rank * 60)} to start`,
      },
      gartenwissen: {
        name: 'Garden Lore',
        blurb: 'Every corner of the garden can be cleared one garden year earlier.',
        effect: (rank: number) => (rank > 0 ? `${rank} ${rank === 1 ? 'year' : 'years'} earlier` : 'Not yet'),
      },
    },
  },

  truhe: {
    gartenschere: {
      name: 'Grandma’s Pruning Shears',
      blurb: '+5 % harvest/s per rank. Higher ranks as you replant.',
      effect: (rank: number) => `+${rank * 5} % ${SOFT}/s`,
    },
    alteGiesskanne: {
      name: 'Old Watering Can',
      blurb: 'Grow longer offline: +1 h soft, +2 h max. per rank.',
      effect: (rank: number) => `+${rank} h / +${rank * 2} h max.`,
    },
    saatgutkiste: {
      name: 'Seed Box',
      blurb: '−2 % on all upgrade costs per rank.',
      effect: (rank: number) => `×${Math.pow(0.98, rank).toFixed(3)} cost`,
    },
    kompostVomVorjahr: {
      name: 'Last Year’s Compost',
      blurb: 'Every season starts with the Compost Heap already set up.',
      effect: (rank: number) => (rank > 0 ? 'Compost from the start' : 'Not yet'),
    },
    messingBrause: {
      name: 'Brass Rose',
      blurb: '+15 s more harvest per watering, per rank.',
      effect: (rank: number) => `+${rank * 15} s watering`,
    },
    notgroschen: {
      name: 'Rainy-Day Fund',
      blurb: 'Every season starts with +80 harvest per rank.',
      effect: (rank: number) =>
        rank > 0 ? `+${rank * 80} ${SOFT} to start` : 'No starting stock',
    },
    strohhut: {
      name: 'Straw Hat',
      blurb: '+2 % harvest/s — first ranks right away, later ones as you replant.',
      effect: (rank: number) => `+${(rank * 2).toFixed(0)} % ${SOFT}/s`,
    },
    laterne: {
      name: 'Lantern',
      blurb: '+30 min soft and +1 h max. offline per rank.',
      effect: (rank: number) => `+${String(rank * 0.5)} h / +${rank} h max.`,
    },
    guteErde: {
      name: 'Good Soil',
      blurb: 'The Vegetable Patch starts at this level.',
      effect: (rank: number) =>
        rank > 0 ? `Vegetable Patch starts at level ${rank}` : 'No head start',
    },
    rosenbogen: {
      name: 'Rose Arch',
      blurb: '+1.5 % harvest/s — opens up as you replant.',
      effect: (rank: number) => `+${(rank * 1.5).toFixed(1)} % ${SOFT}/s`,
    },
  },

  clan: {
    title: 'Allotment Club',
    intro: 'Gardening together — real members are coming soon. The leaderboard is a preview.',
    yourClan: 'Your club',
    seasonMeta: 'Club season 0 · 3rd place · preview',
    boostActive: (mult: string, left: string) => `Club flag ×${mult} · ${left}`,
    boostInactive: 'No flag raised — Market → Club flag',
    leaderboard: 'Club standings',
    you: '(you)',
    pts: 'pts',
    yourName: 'Sunflower Allotments',
    rivals: [
      'Millbrook Gardeners',
      'Green Meadow',
      'Rose Grove',
      'Little Freedom',
      'Linden Court',
      'By the Railway',
    ],
  },

  shop: {
    title: 'Market',
    intro: 'Trade your seeds for garden styles, fertilizer and more. You get seeds from visitors, orders and Grandma’s weekly plan.',
    skipLeftToday: 'Time skip today',
    skipHours: (left: number, cap: number) => `${left}/${cap} h`,
    packsTitle: 'Bundles & seeds',
    packsIntro: 'Test purchases with seeds. No real purchases yet.',
    packEffect: (n: number) => `+${nSeeds(n)}`,
    skipsTitle: 'Time skips',
    skipsIntro: (rate: string, cap: number) =>
      `Current harvest ${rate}/s · max. ${cap} h per day.`,
    dailyCapReached: 'Enough for today',
    ernteGain: (amount: string) => `+${amount} ${SOFT}`,
    costSamen: (n: number) => `${nSeeds(n)}`,
    skinsTitle: 'Garden Styles',
    skinsIntro: 'Just for looks — no advantage.',
    equipped: 'Active',
    active: 'Active',
    equip: 'Use',
    free: 'Free',
    owned: 'Yours',
    clanBoostTitle: 'Club flag',
    clanBoostIntro: 'A short bonus for the club. Raise it again to extend.',
    boostActiveShort: (mult: string, left: string) => `Active ×${mult} · ${left}`,
    boostInactiveShort: 'Not raised',
    tabs: { free: 'Free', boosts: 'Boosts', styles: 'Styles', seeds: 'Seeds' },
    tabsAria: 'Market sections',
    giftTitle: 'Daily gift',
    giftIntro: 'A small gift from the market every day.',
    giftClaim: (n: number) => `Collect · +${nSeeds(n)}`,
    giftDone: 'Back tomorrow',
    adsPick: 'Choose a reward:',
    adsErnte: (mins: number, amount: string) => `${mins} min of harvest · +${amount}`,
    adsSamen: (n: number) => `+${nSeeds(n)}`,
    adsGot: (what: string) => `Added: ${what}`,
    adsGotErnte: (amount: string) => `+${amount} ${SOFT}`,
    refillTitle: 'Refill watering can',
    refillIntro: 'Water again right away instead of waiting 5 minutes.',
    refillReady: 'Watering can is full',
    refillWaiting: (left: string) => `Full in ${left}`,
    refillLeft: (n: number) => (n > 0 ? `${n}× left today` : 'Used up for today — back tomorrow'),
    adsTitle: 'Bonus ads',
    adsIntro: 'Optional — you can always play without them. You see what you get beforehand.',
    adsWatch: 'Watch ad',
    adsWatching: 'Playing…',
    adsCooldown: (left: string) => `Again in ${left}`,
    adsRemovedBadge: 'Ad-free',
    adFreeTitle: 'Bonus (ad-free)',
    adFreeIntro: 'You have Ad-free: you get the reward without an ad.',
    adsRewardSkip: (mins: number, amount: string) =>
      `+${mins} min time skip (${amount})`,
    adsRewardSamen: (n: number) => `+${nSeeds(n)}`,
    adsRewardYield: (mins: number, amount: string) =>
      `+${mins} min of ${SOFT} (${amount})`,
    removeAdsTitle: 'Ad-free',
    removeAdsIntro: 'Buy once — bonus ads gone for good, the reward stays.',
    yieldBoostTitle: 'Fertilizer',
    yieldBoostIntro: '+15 % harvest · 30 min · for seeds.',
    yieldBoostActive: (mult: string, left: string) => `Active ×${mult} · ${left}`,
    yieldBoostInactive: 'Not active',
    yieldBoostBuy: (cost: number) => `${nSeeds(cost)}`,
    currencyPacksTitle: 'Seed packets',
    currencyPacksIntro: 'Seeds for garden styles, fertilizer and time skips.',
    cosmeticPacksTitle: 'Style bundles',
    cosmeticPacksIntro: 'Several garden styles at once.',
    gartenwocheTitle: 'Garden Week',
    gartenwocheIntro: 'Free and premium track. XP from Daily Rounds & ads.',
    gartenwocheXpLabel: (xp: number, max: number) => `${xp}/${max} XP`,
    gartenwocheDailyXp: 'Daily XP',
    gartenwocheDailyDone: 'Daily XP collected',
    gartenwocheFree: 'Free',
    gartenwochePlus: 'Premium',
    gartenwocheClaim: 'Collect',
    gartenwocheClaimed: 'Done',
    gartenwocheLocked: 'Locked',
    gartenwocheNeedXp: (xp: number) => `From ${xp} XP`,
    gartenwocheNeedPremium: 'Premium needed',
    rewardSamen: (n: number) => `+${nSeeds(n)}`,
    rewardErnteSec: (sec: number) => `+${sec} s of ${SOFT}`,
  },

  packs: {
    starterBundle: {
      name: 'Starter Bundle',
      blurb: '200 seeds + the Cottage Garden style. Once only.',
      label: 'Buy',
    },
    removeAds: {
      name: 'Ad-free',
      blurb: 'Bonus ads gone for good, the reward stays.',
      label: 'Ad-free',
    },
    samen50: {
      name: 'Seed Packet S',
      blurb: '50 seeds.',
      label: '+50',
    },
    samen150: {
      name: 'Seed Packet M',
      blurb: '150 seeds.',
      label: '+150',
    },
    samen500: {
      name: 'Seed Packet L',
      blurb: '500 seeds.',
      label: '+500',
    },
    cosmeticPackLeaf: {
      name: 'Blossom Bundle',
      blurb: 'Sea of Blossoms + Golden Autumn. Just for looks.',
      label: 'Unlock',
    },
    gartenwochePlus: {
      name: 'Premium Track',
      blurb: 'Garden Week premium track for one week.',
      label: 'Premium',
    },
  },

  timeSkips: {
    harvestHour: {
      name: 'An Hour of Sunshine',
      blurb: '1 h of harvest at once · current rate.',
    },
    growthDay: {
      name: 'A Warm Afternoon',
      blurb: '4 h of harvest at once · current rate.',
    },
  },

  cosmetics: {
    wiese: {
      name: 'Summer Meadow',
      blurb: 'Lush grass, the classic.',
    },
    bauerngarten: {
      name: 'Cottage Garden',
      blurb: 'Warm soil, a wooden fence, marigolds.',
    },
    bluetenmeer: {
      name: 'Sea of Blossoms',
      blurb: 'Cherry blossom and lavender.',
    },
    goldherbst: {
      name: 'Golden Autumn',
      blurb: 'Leaves in gold and copper — to show off.',
    },
    festFruehling: {
      name: 'Easter Meadow',
      blurb: 'Painted eggs, tulips and pussy willows. Festival style for the Spring Festival.',
    },
    festSommer: {
      name: 'Summer Fair',
      blurb: 'Bunting, strawberries and a parasol.',
    },
    festErntedank: {
      name: 'Harvest Crown',
      blurb: 'Pumpkins, sheaves and a harvest crown on the arbour.',
    },
    festAdvent: {
      name: 'Winter Magic',
      blurb: 'Hoarfrost, candlelight and a fir tree with lights.',
    },
  },

  clanBoost: {
    name: 'Club flag',
    blurb: '+10 % for the club · 1 h · max. ×1.25.',
  },

  ftue: {
    guide: (step: number, total: number) => `Grandma’s Notebook · ${step}/${total}`,
    skip: 'Skip tips',
    welcome: {
      title: 'My dear grandchild,',
      body: 'the garden is yours now. It’s rather overgrown — but under the brambles there’s good soil. Start with the vegetable patch. Love, Grandma',
      cta: 'To the garden',
    },
    tendBed: {
      title: 'The first bed',
      body: 'Tap the Vegetable Patch and upgrade it. Every level brings more harvest.',
      cta: 'Next',
    },
    claimOffline: {
      title: 'The garden grows without you, too',
      body: 'Go on, take a break. When you come back, the harvest will be waiting — just bring it in.',
      cta: 'Got it',
    },
    unlockCompost: {
      title: 'Room for the compost',
      body: 'Gather 600 harvest or bring the Vegetable Patch to level 10 — then we’ll clear the corner for the compost heap.',
      cta: 'Next',
    },
    visitClan: {
      title: 'The neighbors',
      body: 'In the allotment club, people help each other. Go and say hello.',
      cta: 'To the club',
      skipLabel: 'Later',
    },
    prestigeTeaser: {
      title: 'When winter comes',
      body: 'At Season’s End the garden rests. What you’ve learned stays with you as heirlooms — and every garden year grows richer.',
      cta: 'Thank you, Grandma',
      skipLabel: 'Close',
    },
  },

  /** Grandma's notebook — letters unlocked by garden stages and garden years. */
  notebook: {
    readNext: (title: string) => `New: ${title.replace(/,$/, '')}`,
    title: 'Grandma’s Notebook',
    intro: 'Letters and notes Grandma left for you. New pages turn up as the garden grows.',
    open: 'Open notebook',
    newLetter: 'Letter from Grandma',
    newLetterAria: 'New letter from Grandma — read it',
    lockedEntry: 'This page is still stuck shut.',
    lockedHintStage: (name: string) => `Opens at: ${name}.`,
    lockedHintYear: (year: number) => `Opens in garden year ${year}.`,
    lockedHintDeep: 'Opens after the first Deep Winter.',
    lockedHintHelper: (n: number) => `A letter from Jonas — arrives when he reaches level ${n}.`,
    lockedHintIlse: (n: number) => `A letter from Ilse — arrives when she reaches level ${n}.`,
    lockedHintGeneration: 'A letter from Ilse — arrives when you pass the garden on.',
    signatureJonas: '— Jonas',
    signatureIlse: '— Yours, Ilse',
    fromJonas: 'Letter from Jonas',
    fromIlse: 'Letter from Ilse',
    close: 'Close notebook',
    read: 'Read',
    signature: 'Love, Grandma',
    laubeAria: 'Grandma’s arbour — open the notebook',
    entries: {
      welcome: {
        title: 'My dear grandchild,',
        body: 'the garden is yours now. It’s rather overgrown — but under the brambles there’s good soil. Start with the vegetable patch; the rest will come in time. I’ve left you some notes in the arbour.',
      },
      stage2: {
        title: 'It smells of soil',
        body: 'Two corners cleared, and already it’s humming again. Grandpa always said a garden notices when someone comes back. It has noticed you’re here.',
      },
      stage4: {
        title: 'A proper kitchen garden',
        body: 'Herbs, berries, compost — this is how it looked when your mother was little. She always ate the currants straight off the bush. Leave a few hanging.',
      },
      stage5: {
        title: 'Almost a market garden',
        body: 'The neighbors stop at the fence and look. Let them look! And if someone asks for a few apples: sharing never made a harvest smaller.',
      },
      stage7: {
        title: 'The yard comes alive',
        body: 'Hens clucking, bees humming, and a light in the arbour in the evening. That’s exactly how I always imagined it. I’m so proud of you.',
      },
      stage9: {
        title: 'A show garden',
        body: 'They talk of nothing else at the club. Don’t let anyone tell you otherwise: the loveliest gardens aren’t the tidiest ones, but the ones that are lived in.',
      },
      stage10: {
        title: 'The garden park',
        body: 'Now it’s finished — or rather, now it’s only just beginning. A garden is never finished, and that’s the beauty of it. It’s all yours now. Take good care of it, and of yourself.',
      },
      year2: {
        title: 'The first winter',
        body: 'Don’t worry, in winter the garden is only sleeping. What you’ve learned, no one can take from you. In spring we’ll clear the meadow behind the compost — there used to be fruit trees there.',
      },
      year3: {
        title: 'Room for the bees',
        body: 'Grandpa’s beekeeper hat is in the old box in the shed. Beside the hedge it’s sheltered from the wind — bees like that. No bees, no fruit; never forget that.',
      },
      year5: {
        title: 'Hens!',
        body: 'The old coop behind the arbour only needs patching up. Hens eat slugs and lay eggs — you won’t find better neighbors. Name one after me, if you like.',
      },
      year7: {
        title: 'Glass for the summer',
        body: 'Under the ivy by the wall, the panes from the old greenhouse are still lying there. They’ll make the summer last longer. Don’t forget to air it, or the tomatoes will cook!',
      },
      year10: {
        title: 'A farm shop of your own',
        body: 'You’re harvesting more than you can eat — that’s a good sign. Put a few crates by the fence and an honesty box. People are more honest than you’d think.',
      },
      jonas1: {
        title: 'Hello from next door!',
        body: 'I’m Jonas, I live two gardens down. Your grandma always gave me strawberries when I helped with the weeding. Now I’m helping you — I’m still slow, but I learn fast. Promise!',
      },
      jonas3: {
        title: 'I learned something',
        body: 'I know now which beds are worth it and which can wait. Yesterday Mrs. Ilse showed me how to turn compost properly. My mom says I smell like a garden. I think that’s a compliment.',
      },
      jonas5: {
        title: 'Now I’m doing it properly',
        body: 'I plan the whole garden myself now, the way your grandma would have: plant the new things first, then save up for the big jumps. You can sit back. I’ll look after everything — even when you’re not here.',
      },
      ilse1: {
        title: 'From an old friend',
        body: 'Your grandma and I talked over the fence for fifty years. About apples, about men, about the weather. Now I help look after her meadows a little — I owe her that. And in return you bring me some fruit now and then, all right?',
      },
      ilse3: {
        title: 'What she never told you',
        body: 'She was so proud of you. Every time you came to visit, she planted a new variety afterwards — “for later, when the child is ready.” Look around you. This is that later.',
      },
      gen1: {
        title: 'Passing it on',
        body: 'That’s how she did it, too: one day you pass the garden on, with everything you know. The beds start small again, but the family grows a little richer each time. I’m staying, by the way. The weeds keep growing, after all.',
      },
      deep1: {
        title: 'A new chapter',
        body: 'Sometimes a garden has to come to a complete rest so it can grow anew. What you’ve learned is deep in the soil now — in every seedling that comes up. Go ahead and start small again. This time you know how.',
      },
      year14: {
        title: 'My orangery',
        body: 'I dreamed of this all my life: lemons and figs under glass, right in the middle of an allotment. I never managed it. Now you have the room for it. Do it for both of us.',
      },
    },
  },

  /** Plant Book — rare varieties with a permanent harvest bonus. */
  plantbook: {
    tab: 'Plant Book',
    lettersTab: 'Letters',
    intro: 'Rare varieties turn up as you upgrade — and every Season’s End brings a new one. Each variety gives you more harvest for good, even after every winter.',
    total: (pct: string) => `Variety bonus: +${pct} % harvest/s`,
    found: (n: number, max: number) => `${n} of ${max} varieties`,
    unknown: '???',
    rarity: { common: 'common', rare: 'rare', precious: 'precious' },
    bonus: (pct: string) => `+${pct} %`,
    newVariety: (name: string, pct: string) => `New variety: ${name} · +${pct} % harvest`,
    festGroup: 'Festival varieties (only during the festival)',
    names: {
      radieschenEiszapfen: 'Radish “Eiszapfen”',
      tomateOchsenherz: 'Tomato “Oxheart”',
      bohneBlauhilde: 'Pole Bean “Blauhilde”',
      wurmhumus: 'Worm Castings',
      bokashi: 'Bokashi Ferment',
      thymianZitrone: 'Lemon Thyme',
      lavendelHidcote: 'Lavender “Hidcote”',
      safranKrokus: 'Saffron Crocus',
      johannisbeereRosetta: 'Redcurrant “Rosetta”',
      stachelbeereHinnonmaeki: 'Gooseberry “Hinnonmäki”',
      apfelGoldparmaene: 'Apple “Goldparmäne”',
      birneGuteLuise: 'Pear “Gute Luise”',
      zwetschgeHauszwetschge: 'Damson Plum',
      honigLinde: 'Linden Honey',
      honigHeide: 'Heather Honey',
      huhnSulmtaler: 'Sulmtaler Hen',
      huhnAraucana: 'Araucana (green eggs)',
      paprikaSpitz: 'Sweet Pointed Pepper',
      gurkeSchlange: 'Snake Cucumber',
      chiliHabanero: 'Chili “Habanero”',
      kartoffelBamberger: 'Bamberg Horn Potato',
      kuerbisHokkaido: 'Red Kuri Squash',
      zitroneAmalfi: 'Amalfi Lemon',
      feigeBrunswick: 'Fig “Brunswick”',
      christrose: 'Christmas Rose',
      schneegloeckchen: 'Snowdrop',
      tulpeOsterglocke: 'Daffodil',
      baerlauch: 'Wild Garlic',
      pfingstrose: 'Peony “Sarah Bernhardt”',
      erdbeereMieze: 'Strawberry “Mieze Schindler”',
      zucchiniGold: 'Yellow Zucchini “Goldrush”',
      sonnenblumeRiesen: 'Giant Sunflower',
      kuerbisMuscat: 'Musquée Pumpkin',
      apfelBoskoop: 'Apple “Boskoop”',
      physalis: 'Physalis (Chinese Lantern)',
      christstern: 'Poinsettia',
      gruenkohlFrost: 'Kale “Frostkönig”',
    } as Record<string, string>,
  },

  visitors: {
    aria: (name: string) => `${name} is visiting — tap`,
    igel: { name: 'Hedgehog', line: 'The hedgehog ate the slugs — more harvest!' },
    gerda: { name: 'Gerda from next door', line: 'Gerda brings seeds from her own garden.' },
    schmetterling: { name: 'Swallowtail', line: 'A rare butterfly! The blossoms thank you.' },
    rotkehlchen: { name: 'Robin', line: 'The robin sings — your watering can is full again!' },
    postbote: { name: 'Kalle the postman', line: 'A parcel from the seed catalog — a few heirlooms!' },
  },

  orders: {
    label: (name: string) => `Order: ${name}`,
    progress: (have: string, need: string, left: string) => `${have} / ${need} · ${left}`,
    claim: (name: string) => `${name}: Deliver!`,
    reward: (seeds: number) => `Pay: +${nSeeds(seeds)} and a basket of harvest`,
    done: (name: string) => `${name} is delighted — thank you!`,
    expired: 'Order missed — the next one is coming soon.',
    customers: ['Mrs. Gerda', 'Mr. Albers', 'Sunshine Daycare', 'Café Laube', 'The Yilmaz family', 'Korn Bakery'],
    detail: (need: string) => `Bring in ${need} harvest while the order is open.`,
  },

  weekly: {
    title: 'Grandma’s Weekly Plan',
    intro: 'Seven tasks until Sunday — finish them all and you get Grandma’s weekly basket.',
    claim: 'Collect',
    done: 'Done',
    bonusTitle: 'Grandma’s weekly basket',
    bonusReward: (seeds: number, erb: number) => `+${nSeeds(seeds)} · +${nHeirlooms(erb)}`,
    bonusLocked: (n: number) => `${n} ${n === 1 ? 'task' : 'tasks'} to go`,
    reward: (seeds: number) => `+${nSeeds(seeds)}`,
    tasks: {
      water: (n: number) => `Water ${n}×`,
      upgrades: (n: number) => `Upgrade ${n}×`,
      orders: (n: number) => `Deliver ${n} ${n === 1 ? 'order' : 'orders'}`,
      visitors: (n: number) => `Greet ${n} ${n === 1 ? 'visitor' : 'visitors'}`,
      seasons: (n: number) => (n === 1 ? 'Celebrate 1 Season’s End' : `Celebrate ${n} Season’s Ends`),
      daily: (n: number) => `Daily Rounds ${n}×`,
      varieties: (n: number) => (n === 1 ? 'Find 1 new variety' : `Find ${n} new varieties`),
    },
  },

  weather: {
    sonne: { name: 'Sunny', effect: '+10 % harvest' },
    regen: { name: 'Rain', effect: 'Watering ×2' },
    wind: { name: 'Windy', effect: 'more visitors' },
    mild: { name: 'Mild', effect: 'a quiet day' },
    pill: (name: string, effect: string) => `${name} · ${effect}`,
    tomorrow: (name: string, effect: string) => `Tomorrow: ${name} (${effect})`,
  },

  wheel: {
    title: 'Lucky Wheel',
    glyphVariety: 'Variety',
    spin: 'Spin',
    spinning: 'Spinning…',
    results: {
      yield: '+25 % harvest for the whole garden year',
      water: 'Watering ×2 for the whole garden year',
      seeds: '+30 seeds',
      variety: 'A new variety for the Plant Book',
    },
    activePill: { yield: 'Lucky Wheel: +25 % harvest', water: 'Lucky Wheel: watering ×2' },
  },

  comeback: {
    title: 'There you are again!',
    body: 'I was starting to think the slugs had got you. The garden has been waiting for you — and there’s a little welcome present on the bench.',
    gift: (seeds: number) => `Present: +${nSeeds(seeds)} and 30 minutes of harvest`,
    cta: 'Thank you, Grandma',
  },

  reminders: {
    label: 'Reminders',
    on: 'On',
    off: 'Off',
    hint: 'At most twice a day and never at night: when the watering can is full, a crossing is ready or the harvest basket is overflowing (while the app is open in the background).',
    water: 'The watering can is full again — time to water!',
    cross: 'Your crossing is ready — come and see what grew.',
    basket: 'Your harvest basket is full. Collect it now, or nothing more will be added.',
    denied: 'Notifications are blocked in your browser.',
  },

  milestone: {
    tier: (name: string, tier: number) => (tier >= 5 ? `${name}: top level reached – Grandma’s sign is up!` : `${name}: stage ${tier} reached!`),
    toStar: (n: number) => `${n} to go to`,
    toStarAria: (n: number, at: number) => `${n} ${n === 1 ? 'level' : 'levels'} to go until milestone ${at} (double harvest)`,
    bestBuy: 'Grandma’s tip: pays off the most',
  },

  hints: {
    label: 'Grandma’s hint',
    ok: 'Got it',
    visitor: 'Someone’s visiting the garden! Tap your guests — they always bring a little something.',
    order: 'An order for the farm shop. Bring in the harvest while it’s open, then tap “Deliver”.',
    variety: 'A new variety! You’ll find them all in the notebook under “Plant Book” — each one brings a little more harvest forever.',
    season: 'The season can end now. The garden rests over winter, but you take heirlooms with you — and every garden year grows richer.',
    truhe: 'Treasures are waiting in Grandma’s Chest. Trade your heirlooms for bonuses that last through every winter.',
    weekly: 'New: Grandma’s Weekly Plan. Tap “Today” in the bottom left — you’ll find seven tasks for this week there.',
    deep: 'Every corner is open. If you like, the garden can now rest through a Deep Winter — for seedlings that stay forever.',
    bulkMax: 'New: “Max”. Upgrades this bed as many times as your harvest allows — one tap instead of many.',
    bulk5: 'New: “×5”. Buys exactly five levels at once — handy for heading straight for the next milestone.',
    buyAll: 'New: “Upgrade all”. Spreads your whole harvest across all beds — always first where it brings the most harvest per second. It doesn’t buy care or chapters.',
    recipeNew: 'New: Grandma’s Recipe of the Day. Under “Today” in the bottom left you’ll see which beds supply something for today’s recipe — once it’s cooked, you get a bonus.',
    festNew: 'New: garden festivals. Every season has a festival with fest tokens and its own stall — tap the festival pill at the top.',
    weatherNew: 'New: the weather. It changes your harvest a little, and sometimes the sky asks what you’d like to do — you can see tomorrow at the top, too.',
    crossNew: 'New: Cross Seeds (Menu → Cross). Two varieties from the Plant Book make something new in 4 hours — start one now and a surprise will be waiting when you’re back.',
    clanNew: 'New: the Allotment Club. In the menu under “Club”, you weigh your biggest pumpkin against the neighbors every week.',
    helperAreas: 'Jonas is helping now. You decide what he may upgrade: under “Season” → Garden Helper → “What Jonas may upgrade” you can lock and unlock single areas.',
  },

  backup: {
    title: 'Back up progress',
    menu: 'Back up progress',
    intro: 'Your garden only lives on this device. Keep the code or the file somewhere safe — with it you can bring your garden back on any device.',
    exportTitle: 'Back up',
    importTitle: 'Restore',
    codeAria: 'Your save code',
    importAria: 'Paste save code',
    copy: 'Copy code',
    copied: 'Copied!',
    download: 'Save as file',
    placeholder: 'Paste code here …',
    pickFile: 'Choose file',
    import: 'Restore',
    confirm: 'Really? This replaces your current garden',
    invalid: 'That isn’t a valid Heirloom Garden code.',
    newer: 'This save comes from a newer version. Please update the app first (Menu → Check for updates).',
    old: 'This code comes from an early version of the game and can no longer be loaded.',
    found: (when: string) => `Valid save from ${when}.`,
    close: 'Close',
    autoTitle: 'Automatic backups',
    autoIntro: 'The game backs up your garden on this device by itself: once a day and before every Deep Winter, every generation and every restore. They won’t help with a new phone or cleared browser data — for that, keep the code or file from above.',
    autoEmpty: 'No automatic backup yet.',
    kinds: {
      daily: 'Daily backup',
      deep: 'Before the Deep Winter',
      generation: 'Before the generation',
      import: 'Before loading a code',
      restore: 'Before restoring',
    },
    row: (when: string, year: number, chapters: number) => `${when} · Garden Year ${year} · ${chapters} ${chapters === 1 ? 'chapter' : 'chapters'}`,
    restore: 'Restore',
    restoreConfirm: 'Really? Your current garden is backed up first',
    restoreBlocked: 'Not possible right now: the game is open in another window, or a newer version has saved.',
    restoreFailed: 'This backup can’t be loaded.',
    offerTitle: 'Your garden is missing',
    offerBody: 'There’s no saved game on this device, but there are automatic backups. Shall one of them come back?',
    offerNew: 'Start a new garden',
    offerNewNote: 'The backups stay; you’ll find them later under Menu → Back up progress.',
    remindText: 'A lot has grown since your last backup. The backups on this device won’t help if you switch phones or clear your browser data — keep the code somewhere else once.',
    remindSave: 'Back up now',
    remindLater: 'Later',
  },

  legal: {
    title: 'Legal',
    impressum: 'Legal notice (Impressum)',
    close: 'Close',
    privacy: privacyStrings,
  },

  season: {
    winterTitle: 'Winter Rest',
    winterLine: 'The garden is asleep. What has grown stays in your hands.',
    springTitle: (year: number) => `Garden year ${year}`,
    deepTitle: 'Deep Winter',
    deepLine: 'The garden rests long and deep. The roots gather strength.',
    deepSpringTitle: 'A new beginning',
    sprouts: (n: number) => `+${nSeedlings(n)}`,
    springLine: 'The snow is melting — time to get going again.',
    gained: (text: string) => `Stored: ${text}`,
    newCorner: (name: string) => `New to clear: ${name}`,
    cta: 'Into the new garden year',
    skip: 'Next',
  },

  today: {
    title: 'Today',
    eyebrow: 'For today',
    button: 'Today',
    ready: (n: number) => `${n} ready`,
    allDone: 'all done',
    open: 'Open Today: Daily Rounds, Recipe of the Day, daily goals and Weekly Plan',
    close: 'Close',
    dailyDone: 'Done',
    movedNote: 'Daily goals and Grandma’s Weekly Plan are now under “Today” (bottom left).',
  },

  daily: {
    kicker: 'Daily Rounds',
    short: 'Daily Rounds',
    dayOf: (n: number) => (n >= 7 ? 'Day 7/7 · weekly basket!' : `Day ${n}/7 · basket on day 7`),
    firstShift: 'Day 1/7 · Let’s go',
    streakNext: (n: number) => {
      const day = (Math.max(0, n) % 7) + 1
      return `Streak ${n} · day ${day}/7`
    },
    streakDotsAria: (n: number) => `Streak ${n} of 7`,
    comebackLabel: 'Welcome back',
    comebackMeta: 'Streak kept · the garden waited for you',
    claim: 'Collect',
    claimToast: 'Daily Rounds done',
    rewardErnte: (amount: string) => `${amount} ${SOFT}`,
    rewardErbstuecke: (n: number) => erb(n),
    rewardSamen: (n: number) => `${nSeeds(n)}`,
    rows: {
      float2: `2 min of ${SOFT}`,
      shift3: `3 min of ${SOFT}`,
      crumb20: `20 ${SEEDS}`,
      long4: `4 min of ${SOFT}`,
      credit1: '1 heirloom',
      ot5: `5 min of ${SOFT}`,
      weekSeal: 'Weekly basket',
    },
  },

  event: {
    name: 'Harvest Weekend',
    blurb: '+25 % harvest/s · all weekend long.',
    endsFri: 'Until Sunday',
    endsSat: 'Until tomorrow',
    endsSun: 'Until tonight',
    endsDefault: 'Weekend',
    goalAria: 'Harvest Weekend goal',
    goalLine: (progress: string, reward: number) =>
      `${progress} → ${nSeeds(reward)}`,
    claimGoal: 'Collect',
    claimed: 'Collected',
    dismiss: 'Close',
  },

  install: {
    title: 'Install Heirloom Garden',
    iosBefore: 'iPhone: tap',
    iosShare: 'Share',
    iosMid: '→',
    iosAdd: 'Add to Home Screen',
    iosAfter: '.',
    androidBody: 'An icon on your home screen — one tap and you’re in the garden.',
    manualBody: 'Add it to your home screen via the browser menu.',
    whyHome: 'Always on your home screen — like an app.',
    whyOffline: 'Your garden keeps growing, even on the go.',
    whyFast: 'Back to your beds in a flash.',
    install: 'Install',
    gotIt: 'Got it',
    notNow: 'Not now',
    skipBrowser: 'Keep playing without installing',
  },

  ...expansionStrings,
  ...lifeStrings,
  ux: uxStrings,
  careNames,
}
