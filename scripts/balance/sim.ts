/**
 * Headless balance simulator — drives the real game reducers with a virtual
 * clock and seeded randomness.
 *
 * Profiles:
 *  - engaged: plays continuously, buys the best ROI upgrade every few
 *    seconds, waters whenever ready, saisonenden near the payout-rate peak.
 *  - casual:  short sessions every few hours, offline catch-up in between.
 *
 * Build + run:  npm run balance   (see package.json)
 *
 * Jonas / realism switches (env):
 *  (default)     once „Max“ is unlocked, buy like „Max“/„Alles ausbauen“:
 *                only the first buy per tick rolls Überraschungs-Krümel
 *  SPAM=1        old behaviour: every single buy rolls crumbs (farms one
 *                every 5th level, overrates active play ~1.7×)
 *  LAZY=1        the player never buys areas — Jonas does all of it
 *  HELPER_CAP=n  hire Jonas only up to rank n · NO_HELPER=1 never
 *  HELPER_FREE=1 Jonas ranks cost nothing (what is each rank worth?)
 *  HELPER_DAYS=1 print the day each rank was bought
 *
 * Kapitel (docs/kapitel/plan.md „Taktung“):
 *  CHAPTERS=1         der Spieler baut offene Kapitel aus und stellt Ilse an
 *  SIM_ALL_CHAPTERS=1 dazu alle 50 Kapitel aus chapterPlan.ts (setzt CHAPTERS)
 *  COARSE_AFTER_D=n   ab Tag n gröberer Takt (Standard 120 mit Kapiteln)
 *  DEEP_POLICY=rate   Tiefer Winter am Rendite-Gipfel: sobald Sprösslinge je
 *                     Tag seit dem letzten Tiefen Winter nicht mehr steigen
 *                     (Standard mit Kapiteln); sonst „Saison > DEEP_AFTER_H“
 *  PROJECTS=0         Großprojekte nicht bauen (Standard mit Kapiteln: jede
 *                     Stufe bauen, sobald die Kapitel-Währungen reichen)
 *  ADS=n              Werbung (Ernte-Wahl, 10 min Ernte) höchstens n-mal je
 *                     Sitzung, sobald die Abklingzeit um ist · ADS=all: ohne
 *                     Grenze (Werbefrei: alle 3 min, ganze Sitzung)
 *  Ausgabe: „chapters: K2@d… K13@d…“ und der Garten-Bonus aller Kapitel
 *
 * Entscheidungen (Runde 4, Paket 2):
 *  CARD=best|bestAway|random|none  Saison-Karte (Standard best: höchste Vorschau;
 *                     bestAway: Ruhiges/Fleißiges Jahr nach dem Offline-Anteil des Profils)
 *  WEATHER=best|safe|risk|random  Wetter-Entscheidung in jeder Sitzung, sobald
 *                     eine offen ist (Standard: aus — wie vor Runde 4). best =
 *                     höhere Erwartung in Ernte, Samen zum Markt-Preis
 *                     (bestWeatherChoice)
 *  DECISIONS=1        druckt, wie oft jede Karte angeboten/gewählt und jede
 *                     Wetter-Option genommen wurde
 *  CARD_TUNE='{"hofladenjahr":[1.6,0.8]}'  Karten-Werte probeweise ändern
 *                     ([Bereich ×, gedämpfter Bereich ×] bzw. [Garten ×, weg ×])
 *  SIM_START=2027-06-01  anderes Startdatum (Hitzewelle gibt es nur im Sommer)
 *
 * Ruhezeit verkürzen (Runde 4, Paket 3):
 *  TASKS=1            der Spieler holt in jeder Sitzung fertige Tagesziele ab
 *                     (die Gartenrunde holt er immer) — ein erledigter Tag
 *                     verkürzt dann die laufende Ruhezeit (longLoop.REST_CUT)
 *  REST_DAY_H=4       Verkürzung je erledigtem Tag in Stunden (Standard: Spielwert)
 *  REST_CAP_H=12      Deckel je Ruhezeit (höchstens 12)
 *
 * Bogen-Regeln der Kapitel 13–49 (Runde 4, Paket 4, src/game/arcRules.ts):
 *  ARC=best           der Spieler wählt in jedem offenen Kapitel 13–49 die
 *                     beste Regel (bestChoice; Plan für morgen nach dem
 *                     Offline-Anteil des Profils) und passt sie laufend an
 *  ARC=none           keine Wahl (Standard, wie vor Runde 4)
 *  Fünf Jahre:  GEN=1 SIM_ALL_CHAPTERS=1 SUMMARY=1 npm run balance -- regular 43800
 */
import './simFlags'
import { computeBestBuy } from '../../src/game/bestBuy'
import { BALANCE, erbstueckePayout, isProbeYear, payoutAtGate } from '../../src/game/economy'
import { TRUHE_ITEMS, truheRankUnlocked, saatgutkisteMult, prestigeMultiplier, tapBonusSeconds } from '../../src/game/truhe'
import {
  GENERATORS,
  generatorCost as generatorCostFor,
  isGeneratorUnlocked,
  MILESTONE_LEVELS,
  type GeneratorId,
} from '../../src/game/generators'
import {
  applyOfflineCatchup,
  applyTick,
  buyTruheItem,
  buyGenerator,
  canPrestigeNow,
  pickSeasonCard,
  claimDailyOps,
  claimQuestReward,
  claimOfflineReward,
  createInitialState,
  doPrestige,
  grantTapErnte,
  lineCostMult,
  playerLevelOf,
  productionPerSecond,
  type GameState,
  gatePrestiges,
  doDeepReset,
  canHandDownNow,
  HELPER_RANKS,
  bulkUnlocks,
  buyHelper,
  doGeneration,
  buyLegacy,
  buyDeepUpgrade,
} from '../../src/game/state'
import { moduleTier } from '../../src/theme/tiers'
import { DEEP_SHOP, REST_CUT, canDeepNow, restMsFor, sproutPayout } from '../../src/game/longLoop'
import { LEGACY_SHOP } from '../../src/game/generations'
import { CHAPTER_BONUS, CHAPTERS, chaptersGardenMult, totalChapterLevels } from '../../src/game/chapters'
import { bestChapterBuy, buyChapterArea, buyIlse, openChapters, buildProjectStage, claimRewardedAd, weatherPreview, bestWeatherChoice, decideWeather, chapterAreaRates, chooseArcRule } from '../../src/game/state'
import { arcOf, bestChoice } from '../../src/game/arcRules'
import { PROJECTS } from '../../src/game/projects'
import { MASTERY_BONUS, masteryStars, totalMasteryStars } from '../../src/game/mastery'
import { CARD_AUSBAU, SEASON_CARDS } from '../../src/game/seasonCards'
import { SAFE_COST, WEATHER_EFFECTS, WEATHER_GARDEN, weatherCtx } from '../../src/game/weatherEvents'

// WEATHER_TUNE='{"sturm":{"risk":{"bad":0.8}},"frost":{"cost":{"minutes":8}}}' — Wetter-Werte probeweise ändern
// Paket 5 probeweise: STURM='{"chanceMin":0.25,"hedgeFull":200}', GLASS_PROTECT=0.7
if (process.env.STURM) Object.assign(WEATHER_GARDEN.sturm, JSON.parse(process.env.STURM))
if (process.env.GLASS_PROTECT) WEATHER_GARDEN.frost.glassProtect = Number(process.env.GLASS_PROTECT)
// Ausbau-Karten probeweise: AUSBAU='{"discount":0.5,"surcharge":0.25,"minPreview":1.02}'
if (process.env.AUSBAU) Object.assign(CARD_AUSBAU, JSON.parse(process.env.AUSBAU))
if (process.env.REST_DAY_H) REST_CUT.dayMs = Number(process.env.REST_DAY_H) * 3600_000
if (process.env.REST_CAP_H) REST_CUT.capMs = Math.min(12, Number(process.env.REST_CAP_H)) * 3600_000
if (process.env.WEATHER_TUNE) {
  const tune = JSON.parse(process.env.WEATHER_TUNE) as Record<string, { risk?: object; safe?: object; cost?: { samen?: number; minutes?: number } }>
  for (const [k, v] of Object.entries(tune)) {
    const kind = k as keyof typeof WEATHER_EFFECTS
    if (v.risk) Object.assign(WEATHER_EFFECTS[kind].risk, v.risk)
    if (v.safe && WEATHER_EFFECTS[kind].safe) Object.assign(WEATHER_EFFECTS[kind].safe!, v.safe)
    if (v.cost) SAFE_COST[kind] = v.cost
  }
}

if (process.env.CARD_TUNE) {
  const tune = JSON.parse(process.env.CARD_TUNE) as Record<string, [number, number?]>
  for (const c of SEASON_CARDS) {
    const v = tune[c.id]
    if (!v) continue
    if (c.area) {
      c.area.mult = v[0]
      if (v[1] != null) c.area.dampenMult = v[1]
    } else {
      c.mult = v[0]
      if (v[1] != null) c.offline = v[1]
    }
  }
}

const PLAY_CHAPTERS = !!(process.env.CHAPTERS || process.env.SIM_ALL_CHAPTERS)
// Formel-Vergleich für den Kapitel-Bonus (nur Simulator): product | sum | soft | log
if (process.env.CHAPTER_BONUS_MODE) CHAPTER_BONUS.mode = process.env.CHAPTER_BONUS_MODE as typeof CHAPTER_BONUS.mode
if (process.env.CHAPTER_BONUS_CAP) CHAPTER_BONUS.cap = Number(process.env.CHAPTER_BONUS_CAP)
if (process.env.CHAPTER_BONUS_L0) CHAPTER_BONUS.l0 = Number(process.env.CHAPTER_BONUS_L0)
// Kapitel-Meisterschaft: Bonus je Stern (0 = aus, zum Vergleich)
if (process.env.MASTERY_PER_STAR) MASTERY_BONUS.perStar = Number(process.env.MASTERY_PER_STAR)
/**
 * „Beste Wahl“ bei den Saison-Karten: die Vorschau (wie im Spiel); für Karten,
 * die auf die Abwesenheit wirken (Ruhiges/Fleißiges Jahr), zählt der Anteil
 * der Ernte, die dieses Profil offline einfährt (grob aus dem Sitzungsmuster).
 */
const OFFLINE_SHARE: Record<Profile, number> = { engaged: 0.33, regular: 0.85, casual: 0.95 }
function cardValue(o: { id: string; preview: number }, profile: Profile): number {
  const def = SEASON_CARDS.find((c) => c.id === o.id)
  if (!def?.offline) return o.preview
  const f = OFFLINE_SHARE[profile]
  return (1 - f) * o.preview + f * o.preview * def.offline
}
/** Entscheidungen zählen (DECISIONS=1): Karten angeboten/gewählt, Wetter-Optionen je Art. */
export const decisions = {
  cardsOffered: {} as Record<string, number>,
  cardsPicked: {} as Record<string, number>,
  weather: {} as Record<string, { safe: number; risk: number }>,
  /** Sturm: Heckenstufe, Frost: Freiland-Anteil in % bei jedem Ereignis */
  ctx: {} as Record<string, number[]>,
}
function resetDecisions() {
  decisions.cardsOffered = {}
  decisions.cardsPicked = {}
  decisions.weather = {}
  decisions.ctx = {}
}
/** Erster Tag mit 1/2/3 Meister-Sternen je Kapitel (MASTERY=1 druckt sie). */
const masteryDays: Record<string, number[]> = {}

/** Kapitel: Ilse anstellen/verbessern, dann je offenem Kapitel die besten Käufe. */
function playChapters(s: GameState, maxPerChapter = 6): GameState {
  // CHAPTER_MANUAL=0: nur Ilse baut Kapitel aus (der Spieler stellt sie nur an)
  const manual = process.env.CHAPTER_MANUAL !== '0'
  for (let i = 0; i < 5; i++) {
    const n = buyIlse(s)
    if (n === s) break
    s = n
  }
  // Bogen-Regeln: die beste Wahl je offenem Kapitel 13–49 (ARC=best)
  if (process.env.ARC === 'best') {
    for (const id of openChapters(s)) {
      const def = CHAPTERS.find((d) => d.id === id)!
      if (!arcOf(def.number)) continue
      const choice = bestChoice(def, chapterAreaRates(def, s.chapters[id]), OFFLINE_SHARE[simProfile])
      if (choice && s.bogenWahl[id] !== choice) s = chooseArcRule(s, id, choice)
    }
  }
  // Großprojekte: jede Stufe, sobald alle Kapitel-Währungen reichen
  if (process.env.PROJECTS !== '0') for (const p of PROJECTS) s = buildProjectStage(s, p.id)
  if (manual) for (const id of openChapters(s)) {
    for (let k = 0; k < maxPerChapter; k++) {
      const area = bestChapterBuy(s, id)
      if (!area) break
      s = buyChapterArea(s, id, area, 'manual')
    }
  }
  return s
}

/* ---------- virtual clock + seeded RNG ---------- */
const helperDays: number[] = []
let simStart = 0
// Monday 2026-11-09 08:00 local → avoids starting inside a weekend event
const startAt = () => (process.env.SIM_START ? new Date(`${process.env.SIM_START}T08:00:00`).getTime() : new Date(2026, 10, 9, 8, 0, 0).getTime())
let clock = startAt()
const realNow = Date.now
Date.now = () => clock
let seed = 12345
Math.random = () => {
  seed = (seed * 1664525 + 1013904223) >>> 0
  return seed / 4294967296
}

type Profile = 'engaged' | 'regular' | 'casual'

/** Session pattern per profile (local hours 08–23; nights offline). */
const SESSIONS: Record<Profile, { every: number; len: number } | null> = {
  engaged: null, // plays continuously 08–24
  regular: { every: 120, len: 15 },
  casual: { every: 180, len: 4 },
}

interface Milestone {
  t: number
  label: string
}

const fmtT = (sec: number) => {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  return h > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${m}m`
}
const fmtN = (n: number) =>
  n >= 1e12 ? `${(n / 1e12).toFixed(1)}T` : n >= 1e9 ? `${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}K` : n.toFixed(0)

function unlocked(s: GameState, id: GeneratorId): boolean {
  const def = GENERATORS.find((g) => g.id === id)!
  return isGeneratorUnlocked(def, s.ernteSeason, s.owned, s.truhe.kompostVomVorjahr > 0, playerLevelOf(s), gatePrestiges(s))
}

function water(s: GameState): GameState {
  const now = Date.now()
  const rate = productionPerSecond(s, now)
  const g1 = GENERATORS[0]
  const cost = generatorCostFor(g1, s.owned.gemuesebeet ?? 0, lineCostMult(s, 'gemuesebeet'))
  const gained = Math.max(rate * tapBonusSeconds(s.truhe), Math.max(0, cost - s.ernte), 1)
  return grantTapErnte(s, gained, now)
}

function buyBest(s: GameState, maxBuys = 40): GameState {
  let boughtThisTick = 0
  for (let i = 0; i < maxBuys; i++) {
    const hint = computeBestBuy(s, {
      playerLevel: playerLevelOf(s),
      ratePerSec: productionPerSecond(s, Date.now()),
      costOf: (id) => {
        const def = GENERATORS.find((g) => g.id === id)!
        return generatorCostFor(def, s.owned[id] ?? 0, lineCostMult(s, id))
      },
    })
    let target: GeneratorId | null = hint?.affordable ? hint.id : null
    // Always plant a freshly unlocked area (players do, it's the visible goal)
    for (const g of GENERATORS) {
      if ((s.owned[g.id] ?? 0) === 0 && unlocked(s, g.id)) {
        const c = generatorCostFor(g, 0, lineCostMult(s, g.id))
        if (c <= s.ernte) target = g.id
        break
      }
    }
    if (!target) break
    // once „Max“ exists players bulk-buy: only the first buy per tick rolls surprises (SPAM=1: every buy)
    const next = buyGenerator(s, target, !process.env.SPAM && bulkUnlocks(s).max && boughtThisTick > 0 ? 'bulk' : 'manual')
    boughtThisTick += 1
    if (next === s) break
    s = next
  }
  return s
}

function spendSprouts(s: GameState): GameState {
  // players save Sprösslinge for Jonas' next rank when that is what it costs
  if (!process.env.NO_HELPER && HELPER_RANKS[s.helperLevel]?.currency === 'sproesslinge') return s
  for (let guard = 0; guard < 100; guard++) {
    let best: { id: (typeof DEEP_SHOP)[number]['id']; cost: number } | null = null
    for (const item of DEEP_SHOP) {
      const rank = s.sproesslingLaden[item.id]
      if (rank >= item.maxRank) continue
      const cost = item.cost(rank)
      if (cost <= s.sproesslinge && (!best || cost < best.cost)) best = { id: item.id, cost }
    }
    if (!best) break
    s = buyDeepUpgrade(s, best.id)
  }
  return s
}

function hireJonas(s: GameState): GameState {
  // HELPER_CAP=n: hire Jonas only up to rank n (balance comparisons)
  const cap = Number(process.env.HELPER_CAP ?? 99)
  if (!process.env.NO_HELPER) for (let g = 0; g < 5 && s.helperLevel < cap; g++) {
    // HELPER_FREE=1: ranks cost nothing (measures what each rank is worth)
    const before = process.env.HELPER_FREE ? { ...s, erbstuecke: s.erbstuecke + 1e9, sproesslinge: s.sproesslinge + 1e9, vermaechtnis: s.vermaechtnis + 1e9 } : s
    const bought = buyHelper(before)
    const n = bought === before ? s : process.env.HELPER_FREE ? { ...bought, erbstuecke: s.erbstuecke, sproesslinge: s.sproesslinge, vermaechtnis: s.vermaechtnis } : bought
    if (n === s) break
    s = n
    helperDays.push(Math.floor((clock - simStart) / 86400000) + 1)
  }
  return s
}

function spendErbstuecke(s: GameState): GameState {
  // Jonas first (players hire him as soon as they can; NO_HELPER=1 to skip)
  s = hireJonas(s)

  for (let guard = 0; guard < 200; guard++) {
    let best: { id: (typeof TRUHE_ITEMS)[number]['id']; cost: number } | null = null
    for (const item of TRUHE_ITEMS) {
      const rank = s.truhe[item.id]
      if (rank >= item.maxRank) continue
      if (!truheRankUnlocked(item, rank, s.ernteSeason, s.owned, s.saisonenden)) continue
      const cost = item.cost(rank)
      if (cost <= s.erbstuecke && (!best || cost < best.cost)) best = { id: item.id, cost }
    }
    if (!best) break
    const next = buyTruheItem(s, best.id)
    if (next === s) break
    s = next
  }
  return s
}

let simProfile: Profile = 'regular'
export function run(profile: Profile, hours: number) {
  simProfile = profile
  const start = clock
  simStart = clock
  helperDays.length = 0
  let s = createInitialState(clock)
  resetDecisions()
  let restDayCounted = ''
  let restDays = 0
  const weatherMode = process.env.WEATHER
  const milestones: Milestone[] = []
  const seenUnlock = new Set<string>()
  const seenTier = new Set<string>()
  let runStart = clock
  let bestPayoutRate = 0
  const deepByRate = (process.env.DEEP_POLICY ?? (PLAY_CHAPTERS ? 'rate' : 'duration')) === 'rate'
  let lastDeepAt = clock
  let bestSproutRate = 0
  let gateAt = -1
  const runs: { dur: number; active: number; payout: number; levels: number[]; meta: string; day: number; deep?: boolean }[] = []
  // Ereignisdichte: aktive Spielzeit (s) jedes bedeutsamen Ereignisses
  let activeSec = 0
  let runActiveStart = 0
  const events: number[] = []
  const lastLevel: Record<string, number> = {}
  const event = () => events.push(activeSec)
  const stageByDay: number[] = []
  const deeps: { day: number; sprouts: number; total: number }[] = []
  const gens: number[] = []
  const chapterDays: Record<string, number> = {}
  const coarseAfterMs = Number(process.env.COARSE_AFTER_D ?? (PLAY_CHAPTERS ? 120 : 1e9)) * 86400000
  const end = start + hours * 3600_000
  let lastDaily = ''
  const inSession = (t: number) => {
    const d = new Date(t)
    const h = d.getHours()
    const pattern = SESSIONS[profile]
    if (!pattern) return h >= 8 && h < 24
    if (h < 8 || h >= 23) return false
    const minuteOfDay = h * 60 + d.getMinutes()
    return (minuteOfDay - 8 * 60) % pattern.every < pattern.len
  }
  let wasActive = true
  // ADS: Werbung je Sitzung (Ernte-Wahl); 'all' = Werbefrei, alle 3 min
  const adsPerSession = process.env.ADS === 'all' ? Infinity : Number(process.env.ADS ?? 0)
  let adsThisSession = 0
  let adClaims = 0

  const note = (label: string) => milestones.push({ t: (clock - start) / 1000, label })

  while (clock < end) {
    const active = inSession(clock)
    if (active && !wasActive) {
      const { state, gained } = applyOfflineCatchup(s, clock)
      s = claimOfflineReward(state, gained, clock)
      adsThisSession = 0
    }
    wasActive = active
    if (!active) {
      clock += 60_000
      continue
    }
    // Langläufe: nach COARSE_AFTER_D Tagen gröberer Takt (Laufzeit < 2 min für 5 Jahre)
    const dt = clock - start > coarseAfterMs ? 60 : 5
    s = applyTick(s, dt)
    clock += dt * 1000
    activeSec += dt

    const day = new Date(clock).toDateString()
    if (day !== lastDaily) {
      const n = claimDailyOps(s, clock)
      if (n !== s) {
        s = n
        lastDaily = day
      }
    }
    if (weatherMode) {
      const p = weatherPreview(s, clock)
      if (p) {
        const choice =
          weatherMode === 'safe' || weatherMode === 'risk'
            ? weatherMode
            : weatherMode === 'random'
              ? Math.random() < 0.5 ? 'safe' : 'risk'
              : bestWeatherChoice(p, productionPerSecond(s, clock), s.samen)
        const next = decideWeather(s, choice, clock).state
        if (next !== s && process.env.DECISIONS) {
          const ctx = weatherCtx(s.owned)
          ;(decisions.ctx[p.kind] ??= []).push(p.kind === 'sturm' ? ctx.hedge : Math.round(ctx.openShare * 100))
        }
        if (next !== s) {
          const w = (decisions.weather[p.kind] ??= { safe: 0, risk: 0 })
          w[choice] += 1
          s = next
        }
      }
    }
    if (process.env.TASKS) {
      for (const q of s.quests) if (!q.claimed && q.progress >= q.target) s = claimQuestReward(s, q.id, clock)
      if (s.ruhezeitVerkuerzung.day !== restDayCounted) {
        restDayCounted = s.ruhezeitVerkuerzung.day
        if (restDayCounted) restDays += 1
      }
    }
    if (s.lastTapAt <= 0 || clock - s.lastTapAt >= 5 * 60_000) s = water(s)
    if (adsThisSession < adsPerSession) {
      const r = claimRewardedAd(s, 'ernte', clock)
      if (r.ok) {
        s = r.state
        adsThisSession += 1
        adClaims += 1
      }
    }
    // LAZY=1: the player never buys areas himself — Jonas does all of it
    if (!process.env.LAZY || s.helperLevel === 0) s = buyBest(s)
    s = spendErbstuecke(s)
    // Kapitel nur alle 60 s Spielzeit (Laufzeit); Ilse läuft ohnehin im Takt mit
    if (PLAY_CHAPTERS && Math.floor(activeSec / 60) !== Math.floor((activeSec - dt) / 60)) {
      s = playChapters(s)
      for (const def of CHAPTERS) {
        if (chapterDays[def.id] == null && s.chapters[def.id].openedAt > 0) chapterDays[def.id] = Math.floor((clock - start) / 86400000) + 1
        const stars = masteryStars(def, s.chapters[def.id])
        const days = (masteryDays[def.id] ??= [])
        while (days.length < stars) days.push(Math.floor((clock - start) / 86400000) + 1)
      }
    }

    {
      const d = Math.floor((clock - start) / 86400000)
      const planted = GENERATORS.filter((g) => (s.owned[g.id] ?? 0) > 0).length
      stageByDay[d] = Math.max(stageByDay[d] ?? 0, planted)
    }
    for (const g of GENERATORS) {
      const lv = s.owned[g.id] ?? 0
      const before = lastLevel[g.id] ?? 0
      if (lv > before) {
        // Neu angelegt oder Meilenstein ★ (×2) überschritten
        if (before === 0 || MILESTONE_LEVELS.some((m) => before < m && lv >= m)) event()
      }
      lastLevel[g.id] = lv
      if (!seenUnlock.has(g.id) && (s.owned[g.id] ?? 0) > 0) {
        seenUnlock.add(g.id)
        if (s.saisonenden === 0) note(`planted ${g.id}`)
      }
      const tier = moduleTier(s.owned[g.id] ?? 0)
      for (let k = 2; k <= tier; k++) {
        const key = `${g.id}:${k}`
        if (!seenTier.has(key)) {
          seenTier.add(key)
          if (k >= 4) note(`tier${k} ${g.id}`)
        }
      }
    }

    if (process.env.TRACE && s.saisonenden === 0 && Math.round((clock - start) / 1000) % 900 === 0)
      note(`trace ernte ${fmtN(s.ernteSeason)} rate ${fmtN(productionPerSecond(s, clock))}/s`)
    if (canPrestigeNow(s) && gateAt < 0) {
      gateAt = clock
      note(`gate reached (season ${s.saisonenden + 1})`)
    }
    if (canPrestigeNow(s)) {
      const runMin = (clock - runStart) / 60_000
      const probe = isProbeYear(s)
      const payout = erbstueckePayout(s.ernteSeason, s.saisonenden, probe)
      const rate = payout / Math.max(1, runMin)
      bestPayoutRate = Math.max(bestPayoutRate, rate)
      const ready = profile === 'engaged' ? rate < bestPayoutRate * 0.92 : payout >= 1.6 * payoutAtGate(s.saisonenden, probe) || runMin > 60 * 30
      if (ready) {
        runs.push({
          dur: (clock - runStart) / 1000,
          active: activeSec - runActiveStart,
          payout,
          day: Math.floor((clock - start) / 86400000) + 1,
          levels: GENERATORS.map((g) => s.owned[g.id] ?? 0),
          meta: `@d${Math.floor((clock - start) / 86400000) + 1} ${new Date(runStart).getHours()}h→${new Date(clock).getHours()}h x${prestigeMultiplier(s.truhe).toFixed(2)} disc${saatgutkisteMult(s.truhe).toFixed(2)} lvl${playerLevelOf(s)} ${Object.entries(s.truhe).filter(([, v]) => v > 0).map(([k, v]) => k.slice(0, 5) + v).join(' ')}`,
        })
        note(`PRESTIGE #${s.saisonenden + 1} payout ${payout} (run ${fmtT((clock - runStart) / 1000)})`)
        const lastDur = (clock - runStart) / 1000
        s = doPrestige(s)
        // Saison-Karte: CARD=best (Standard, Spieler sieht die Vorschau) | random | none
        if (s.seasonCardOffer.length > 0) {
          const mode = process.env.CARD ?? 'best'
          const offer = s.seasonCardOffer
          const pick =
            mode === 'none'
              ? null
              : mode === 'random'
                ? offer[Math.floor(Math.random() * offer.length)].id
                : mode === 'bestAway'
                  ? [...offer].sort((a, b) => cardValue(b, profile) - cardValue(a, profile))[0].id
                  : [...offer].sort((a, b) => b.preview - a.preview)[0].id
          for (const o of offer) decisions.cardsOffered[o.id] = (decisions.cardsOffered[o.id] ?? 0) + 1
          decisions.cardsPicked[pick ?? 'keine'] = (decisions.cardsPicked[pick ?? 'keine'] ?? 0) + 1
          s = pickSeasonCard(s, pick)
        }
        event()
        for (const g of GENERATORS) lastLevel[g.id] = s.owned[g.id] ?? 0
        // Rendite des Tiefen Winters: Sprösslinge je Tag seit dem letzten
        let deepNow = false
        if (canDeepNow(s.saisonenden, s.tieferWinterAt, clock, s.ruhezeitVerkuerzung.ms, restMsFor(s))) {
          const sproutRate = sproutPayout(s.saisonenden) / Math.max(0.25, (clock - lastDeepAt) / 86400000)
          bestSproutRate = Math.max(bestSproutRate, sproutRate)
          deepNow = deepByRate
            ? sproutRate < bestSproutRate * 0.97 || lastDur > 36 * 3600
            : lastDur > Number(process.env.DEEP_AFTER_H ?? 12) * 3600
          if (s.saisonenden >= Number(process.env.DEEP_AT_YEAR ?? 99) - 1) deepNow = true
        }
        if (deepNow) {
          lastDeepAt = clock
          bestSproutRate = 0
          const sp = sproutPayout(s.saisonenden)
          s = doDeepReset(s)
          runs[runs.length - 1].deep = true
          s = hireJonas(s)
          s = spendSprouts(s)
          deeps.push({ day: Math.floor((clock - start) / 86400000) + 1, sprouts: sp, total: s.sproesslinge })
          note(`TIEFER WINTER #${s.tiefeWinter} +${sp} sprouts`)
          // GEN=1: hand the garden down as soon as allowed (Generationen)
          if (process.env.GEN && canHandDownNow(s)) {
            s = doGeneration(s, clock)
            s = hireJonas(s)
            for (let g = 0; g < 200; g++) {
              let best: { id: (typeof LEGACY_SHOP)[number]['id']; cost: number } | null = null
              for (const item of LEGACY_SHOP) {
                const cost = item.cost(s.legacy[item.id])
                if (HELPER_RANKS[s.helperLevel]?.currency === 'vermaechtnis' && !process.env.NO_HELPER) break
              if (cost <= s.vermaechtnis && (!best || cost < best.cost)) best = { id: item.id, cost }
              }
              if (!best) break
              s = buyLegacy(s, best.id)
            }
            gens.push(Math.floor((clock - start) / 86400000) + 1)
            note(`GENERATION #${s.generation}`)
          }
        }
        s = spendErbstuecke(s)
        for (const g of GENERATORS) lastLevel[g.id] = s.owned[g.id] ?? 0
        runStart = clock
        runActiveStart = activeSec
        bestPayoutRate = 0
        gateAt = -1
      }
    }
  }
  const chapters = CHAPTERS.filter((d) => chapterDays[d.id] != null).map((d) => ({ number: d.number, id: d.id, day: chapterDays[d.id]! }))
  return { s, milestones, runs, hours, stageByDay, deeps, gens, chapters, adClaims, restDays, density: eventDensity(events, profile) }
}

/** Abstände zwischen bedeutsamen Ereignissen in aktiver Spielzeit. */
export function eventDensity(events: number[], profile: Profile) {
  // Sitzung 1: die erste Spielsitzung (Dauerspieler: erste Stunde)
  const s1End = (SESSIONS[profile]?.len ?? 60) * 60
  const gaps = (from: number, to: number) => {
    const inRange = [0, ...events].filter((t) => t >= from && t <= to)
    const out: number[] = []
    for (let i = 1; i < inRange.length; i++) out.push(inRange[i] - inRange[i - 1])
    return out.sort((a, b) => a - b)
  }
  const q = (arr: number[], p: number) => (arr.length ? arr[Math.min(arr.length - 1, Math.floor(arr.length * p))] : NaN)
  const g1 = gaps(0, s1End)
  const gl = gaps(s1End, Infinity)
  return {
    s1Median: q(g1, 0.5),
    s1Max: g1.length ? g1[g1.length - 1] : NaN,
    laterMedian: q(gl, 0.5),
    laterP90: q(gl, 0.9),
    count: events.length,
  }
}

function report(profile: Profile, hours: number) {
  seed = 12345
  clock = startAt()
  const { s, milestones, runs, stageByDay, deeps, gens, chapters, adClaims, restDays, density } = run(profile, hours)
  const dn = (sec: number) => (Number.isFinite(sec) ? (sec >= 120 ? `${Math.round(sec / 60)}m` : `${Math.round(sec)}s`) : '-')
  if (process.env.SUMMARY) {
    const act = runs.map((r) => Math.round(r.active / 60))
    // reduce statt Math.max(...): bei sehr vielen Saisons sprengt der Spread den Stack
    const longest = act.slice(1).reduce((m, v) => Math.max(m, v), 0)
    const d = runs.map((r) => Math.round(r.dur / 60))
    const plantedAll = milestones.find((m) => m.label.includes('planted orangerie'))
    const perDay = Array.from({ length: Math.ceil(hours / 24) }, (_, d) =>
      runs.filter((r) => r.day === d + 1).length,
    ).join('/')
    const garden = Array.from({ length: Math.ceil(hours / 24) }, (_, d) => stageByDay[d] ?? '-').join('/')
    console.log(
      `${profile} ${hours}h | seasons/day ${perDay} | planted/day ${garden} | seasons ${runs.length} | first ${d[0] ?? '-'}m | mins ${d.slice(0, 14).join(' ')} | payout ${runs.slice(0, 6).map((r) => r.payout).join(' ')} | last ${d.slice(-3).join(' ')} | orangerie ${plantedAll ? fmtT(plantedAll.t) : 'never(1st run)'} | end lvls ${GENERATORS.map((g) => s.owned[g.id]).join(',')}`,
    )
    console.log(
      `  density s1 median ${dn(density.s1Median)} max ${dn(density.s1Max)} · later median ${dn(density.laterMedian)} p90 ${dn(density.laterP90)} | active mins ${act.slice(0, 14).join(' ')} | longest active ${longest}m (year ${act.indexOf(longest, 1) + 1})`,
    )
    if (process.env.HELPER_DAYS) console.log(`  jonas ranks bought: ${helperDays.map((d, i) => `R${i + 1}@d${d}`).join(' ')} | year ${s.saisonenden + 1} | deep ${s.tiefeWinter} | gen ${s.generation}`)
    if (process.env.GEN) console.log(`  generations: ${gens.map((d, i) => `G${i + 1}@d${d}`).join(' ')}`)
    if (PLAY_CHAPTERS)
      console.log(
        `  chapters: ${chapters.map((c) => `K${c.number}@d${c.day}`).join(' ')} | chapter levels ${totalChapterLevels(s.chapters)} | garden ×${chaptersGardenMult(s.chapters).toFixed(2)} | ilse ${s.ilseLevel} | projects ${JSON.stringify(s.projects)} | ads ${adClaims} | gen ${s.generation} deep ${s.tiefeWinter}`,
      )
    if (PLAY_CHAPTERS && process.env.MASTERY) {
      const rows = CHAPTERS.filter((d) => s.chapters[d.id].openedAt > 0).map((d) => {
        const min = Math.min(...d.areas.map((a) => s.chapters[d.id].owned[a.id] ?? 0))
        const days = masteryDays[d.id] ?? []
        return `K${d.number}:min${min}${days.length ? `★${days.map((x) => `d${x}`).join('/')}` : ''}`
      })
      const tot = totalMasteryStars(s.chapters)
      console.log(`  mastery (×${MASTERY_BONUS.perStar}/star): ${tot.have}/${tot.total} stars | ${rows.join(' ')}`)
    }
    if (process.env.DECISIONS) {
      const cards = Object.keys(decisions.cardsOffered)
        .sort()
        .map((id) => `${id} ${decisions.cardsPicked[id] ?? 0}/${decisions.cardsOffered[id]} (${Math.round((100 * (decisions.cardsPicked[id] ?? 0)) / decisions.cardsOffered[id]!)} %)`)
      const total = Object.values(decisions.cardsPicked).reduce((a, b) => a + b, 0)
      const share = Object.entries(decisions.cardsPicked).sort((a, b) => b[1] - a[1]).map(([id, n]) => `${id} ${Math.round((100 * n) / total)} %`)
      console.log(`  cards picked/offered: ${cards.join(' · ')}`)
      console.log(`  cards share of all picks (${total}): ${share.join(' · ')}`)
      const q = (a: number[]) => { const b = [...a].sort((x, y) => x - y); return [0.1, 0.25, 0.5, 0.75, 0.9].map((f) => b[Math.floor(f * (b.length - 1))]).join('/') }
      console.log(`  weather ctx (p10/25/50/75/90): ${Object.entries(decisions.ctx).map(([k, v]) => `${k} ${q(v)}`).join(' · ')}`)
      console.log(`  weather: ${Object.entries(decisions.weather).map(([k, w]) => `${k} safe ${w.safe} / risk ${w.risk} (risk ${Math.round((100 * w.risk) / Math.max(1, w.safe + w.risk))} %)`).join(' · ')}`)
    }
    if (process.env.TASKS) console.log(`  rest: ${restDays} days shortened the rest by ${REST_CUT.dayMs / 3600_000} h (cap ${REST_CUT.capMs / 3600_000} h)`)
    if (deeps.length || process.env.DEEP)
      console.log(
        `  deep winters: ${deeps.map((d) => `d${d.day}(+${d.sprouts})`).join(' ')} | end deep ${JSON.stringify(s.sproesslingLaden)} year ${s.saisonenden + 1}`,
      )
    return
  }
  console.log(`\n=== ${profile} · ${hours}h simulated ===`)
  for (const m of milestones.slice(0, 80)) console.log(`${fmtT(m.t).padStart(7)}  ${m.label}`)
  console.log('runs:')
  for (const [i, r] of runs.entries())
    console.log(`  #${i + 1} ${fmtT(r.dur).padStart(6)} payout ${String(r.payout).padStart(5)} levels ${r.levels.join(',')} | ${r.meta}`)
  console.log(
    `end: saisonenden ${s.saisonenden}, erbstuecke ${s.erbstuecke}, lvl ${playerLevelOf(s)}, ernte ${fmtN(s.ernte)}, owned ${GENERATORS.map((g) => s.owned[g.id]).join(',')}`,
  )
}

for (const k of Object.keys(BALANCE) as (keyof typeof BALANCE)[]) {
  const v = process.env[k]
  if (v) BALANCE[k] = Number(v)
}
/** For tests: fresh clock + seed, then one run. */
export function simulate(profile: Profile, hours: number) {
  seed = 12345
  clock = new Date(2026, 10, 9, 8, 0, 0).getTime()
  return run(profile, hours)
}

if (!process.env.VITEST) {
  const args = process.argv.slice(2)
  const hours = Number(args[1] ?? 48)
  report((args[0] as Profile) ?? 'engaged', hours)
}
void realNow
