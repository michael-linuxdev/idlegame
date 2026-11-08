/**
 * Headless balance simulator — drives the real game reducers with a virtual
 * clock and seeded randomness.
 *
 * Profiles:
 *  - engaged: plays continuously, buys the best ROI upgrade every few
 *    seconds, waters whenever ready, prestiges near the payout-rate peak.
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
 */
import { computeBestBuy } from '../../src/game/bestBuy'
import {
  BALANCE,
  EMBER_SHOP,
  emberPayout,
  emberRankUnlocked,
  foundryDiscountMult,
  payoutAtGate,
  prestigeMultiplier,
  tapBonusSeconds,
} from '../../src/game/economy'
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
  buyEmberUpgrade,
  buyGenerator,
  canPrestigeNow,
  claimDailyOps,
  claimOfflineReward,
  createInitialState,
  doPrestige,
  grantTapAsh,
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
import { DEEP_SHOP, canDeepReset, sproutPayout } from '../../src/game/longLoop'
import { LEGACY_SHOP } from '../../src/game/generations'

/* ---------- virtual clock + seeded RNG ---------- */
const helperDays: number[] = []
let simStart = 0
// Monday 2026-11-09 08:00 local → avoids starting inside a weekend event
let clock = new Date(2026, 10, 9, 8, 0, 0).getTime()
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
  return isGeneratorUnlocked(def, s.ernteSeason, s.owned, s.emberUpgrades.firstFlame > 0, playerLevelOf(s), gatePrestiges(s))
}

function water(s: GameState): GameState {
  const now = Date.now()
  const rate = productionPerSecond(s, now)
  const g1 = GENERATORS[0]
  const cost = generatorCostFor(g1, s.owned.gemuesebeet ?? 0, lineCostMult(s, 'gemuesebeet'))
  const gained = Math.max(rate * tapBonusSeconds(s.emberUpgrades), Math.max(0, cost - s.ernte), 1)
  return grantTapAsh(s, gained, now)
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
      const rank = s.deepUpgrades[item.id]
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

function spendEmbers(s: GameState): GameState {
  // Jonas first (players hire him as soon as they can; NO_HELPER=1 to skip)
  s = hireJonas(s)

  for (let guard = 0; guard < 200; guard++) {
    let best: { id: (typeof EMBER_SHOP)[number]['id']; cost: number } | null = null
    for (const item of EMBER_SHOP) {
      const rank = s.emberUpgrades[item.id]
      if (rank >= item.maxRank) continue
      if (!emberRankUnlocked(item, rank, s.ernteSeason, s.owned, s.prestiges)) continue
      const cost = item.cost(rank)
      if (cost <= s.erbstuecke && (!best || cost < best.cost)) best = { id: item.id, cost }
    }
    if (!best) break
    const next = buyEmberUpgrade(s, best.id)
    if (next === s) break
    s = next
  }
  return s
}

export function run(profile: Profile, hours: number) {
  const start = clock
  simStart = clock
  helperDays.length = 0
  let s = createInitialState(clock)
  const milestones: Milestone[] = []
  const seenUnlock = new Set<string>()
  const seenTier = new Set<string>()
  let runStart = clock
  let bestPayoutRate = 0
  let gateAt = -1
  const runs: { dur: number; active: number; payout: number; levels: number[]; meta: string; day: number }[] = []
  // Ereignisdichte: aktive Spielzeit (s) jedes bedeutsamen Ereignisses
  let activeSec = 0
  let runActiveStart = 0
  const events: number[] = []
  const lastLevel: Record<string, number> = {}
  const event = () => events.push(activeSec)
  const stageByDay: number[] = []
  const deeps: { day: number; sprouts: number; total: number }[] = []
  const gens: number[] = []
  const dt = 5
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

  const note = (label: string) => milestones.push({ t: (clock - start) / 1000, label })

  while (clock < end) {
    const active = inSession(clock)
    if (active && !wasActive) {
      const { state, gained } = applyOfflineCatchup(s, clock)
      s = claimOfflineReward(state, gained, clock)
    }
    wasActive = active
    if (!active) {
      clock += 60_000
      continue
    }
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
    if (s.lastTapAt <= 0 || clock - s.lastTapAt >= 5 * 60_000) s = water(s)
    // LAZY=1: the player never buys areas himself — Jonas does all of it
    if (!process.env.LAZY || s.helperLevel === 0) s = buyBest(s)
    s = spendEmbers(s)

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
        if (s.prestiges === 0) note(`planted ${g.id}`)
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

    if (process.env.TRACE && s.prestiges === 0 && Math.round((clock - start) / 1000) % 900 === 0)
      note(`trace ernte ${fmtN(s.ernteSeason)} rate ${fmtN(productionPerSecond(s, clock))}/s`)
    if (canPrestigeNow(s) && gateAt < 0) {
      gateAt = clock
      note(`gate reached (season ${s.prestiges + 1})`)
    }
    if (canPrestigeNow(s)) {
      const runMin = (clock - runStart) / 60_000
      const payout = emberPayout(s.ernteSeason, s.prestiges)
      const rate = payout / Math.max(1, runMin)
      bestPayoutRate = Math.max(bestPayoutRate, rate)
      const ready = profile === 'engaged' ? rate < bestPayoutRate * 0.92 : payout >= 1.6 * payoutAtGate(s.prestiges) || runMin > 60 * 30
      if (ready) {
        runs.push({
          dur: (clock - runStart) / 1000,
          active: activeSec - runActiveStart,
          payout,
          day: Math.floor((clock - start) / 86400000) + 1,
          levels: GENERATORS.map((g) => s.owned[g.id] ?? 0),
          meta: `@d${Math.floor((clock - start) / 86400000) + 1} ${new Date(runStart).getHours()}h→${new Date(clock).getHours()}h x${prestigeMultiplier(s.emberUpgrades).toFixed(2)} disc${foundryDiscountMult(s.emberUpgrades).toFixed(2)} lvl${playerLevelOf(s)} ${Object.entries(s.emberUpgrades).filter(([, v]) => v > 0).map(([k, v]) => k.slice(0, 5) + v).join(' ')}`,
        })
        note(`PRESTIGE #${s.prestiges + 1} payout ${payout} (run ${fmtT((clock - runStart) / 1000)})`)
        const lastDur = (clock - runStart) / 1000
        s = doPrestige(s)
        event()
        for (const g of GENERATORS) lastLevel[g.id] = s.owned[g.id] ?? 0
        if (canDeepReset(s.prestiges) && (lastDur > Number(process.env.DEEP_AFTER_H ?? 12) * 3600 || s.prestiges >= Number(process.env.DEEP_AT_YEAR ?? 99) - 1)) {
          const sp = sproutPayout(s.prestiges)
          s = doDeepReset(s)
          s = hireJonas(s)
          s = spendSprouts(s)
          deeps.push({ day: Math.floor((clock - start) / 86400000) + 1, sprouts: sp, total: s.sproesslinge })
          note(`TIEFER WINTER #${s.deepPrestiges} +${sp} sprouts`)
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
        s = spendEmbers(s)
        for (const g of GENERATORS) lastLevel[g.id] = s.owned[g.id] ?? 0
        runStart = clock
        runActiveStart = activeSec
        bestPayoutRate = 0
        gateAt = -1
      }
    }
  }
  return { s, milestones, runs, hours, stageByDay, deeps, gens, density: eventDensity(events, profile) }
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
  clock = new Date(2026, 10, 9, 8, 0, 0).getTime()
  const { s, milestones, runs, stageByDay, deeps, gens, density } = run(profile, hours)
  const dn = (sec: number) => (Number.isFinite(sec) ? (sec >= 120 ? `${Math.round(sec / 60)}m` : `${Math.round(sec)}s`) : '-')
  if (process.env.SUMMARY) {
    const act = runs.map((r) => Math.round(r.active / 60))
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
      `  density s1 median ${dn(density.s1Median)} max ${dn(density.s1Max)} · later median ${dn(density.laterMedian)} p90 ${dn(density.laterP90)} | active mins ${act.slice(0, 14).join(' ')} | longest active ${Math.max(0, ...act.slice(1))}m (year ${act.indexOf(Math.max(0, ...act.slice(1)), 1) + 1})`,
    )
    if (process.env.HELPER_DAYS) console.log(`  jonas ranks bought: ${helperDays.map((d, i) => `R${i + 1}@d${d}`).join(' ')} | year ${s.prestiges + 1} | deep ${s.deepPrestiges} | gen ${s.generation}`)
    if (process.env.GEN) console.log(`  generations: ${gens.map((d, i) => `G${i + 1}@d${d}`).join(' ')}`)
    if (deeps.length || process.env.DEEP)
      console.log(
        `  deep winters: ${deeps.map((d) => `d${d.day}(+${d.sprouts})`).join(' ')} | end deep ${JSON.stringify(s.deepUpgrades)} year ${s.prestiges + 1}`,
      )
    return
  }
  console.log(`\n=== ${profile} · ${hours}h simulated ===`)
  for (const m of milestones.slice(0, 80)) console.log(`${fmtT(m.t).padStart(7)}  ${m.label}`)
  console.log('runs:')
  for (const [i, r] of runs.entries())
    console.log(`  #${i + 1} ${fmtT(r.dur).padStart(6)} payout ${String(r.payout).padStart(5)} levels ${r.levels.join(',')} | ${r.meta}`)
  console.log(
    `end: prestiges ${s.prestiges}, erbstuecke ${s.erbstuecke}, lvl ${playerLevelOf(s)}, ernte ${fmtN(s.ernte)}, owned ${GENERATORS.map((g) => s.owned[g.id]).join(',')}`,
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
