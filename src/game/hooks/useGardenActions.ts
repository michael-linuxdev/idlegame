/** Garten: Gießen, Ausbauen, Saisonende, Jonas, Deko, Bewohner, Kreuzen …. Teil von useGame(), siehe src/game/useGame.ts. */
import type { AlbumStat } from '../album'
import type { BranchKind } from '../branches'
import { challengeAllowsWater, type ChallengeId } from '../challenges'
import type { DecorId } from '../decor'
import { erbstueckePayout, TAP_COOLDOWN_MS, isProbeYear } from '../economy'
import { tapBonusSeconds, type TruheItemId } from '../truhe'
import { CONTEST_KG } from '../extrasCore'
import { FEST_EARN } from '../fests'
import type { WheelKind } from '../gardenLife'
import type { LegacyId } from '../generations'
import { GENERATORS, generatorCost, type GeneratorId } from '../generators'
import type { DeepMetaId } from '../longLoop'
import { logPlaytest } from '../playtestLog'
import { backupBeforeOccasion } from '../autoBackup'
import type { ProjectId } from '../projects'
import type { ResidentId } from '../residents'
import { cardPreview, cardSaving, seasonCardDef, type SeasonCardId } from '../seasonCards'
import {
  abortChallenge,
  chooseNextChallenge,
  pickSeasonCard,
  buyBranch,
  buyTruheItem,
  buyGenerator,
  doPrestige,
  grantTapErnte,
  lineCostMult,
  productionPerSecond,
  buyDeepUpgrade,
  doDeepReset,
  waterMult,
  grantReward,
  applyWheel,
  clearLastVariety,
  type Reward,
  affordableLevels,
  buyAllBest,
  buyGeneratorMany,
  buyHelper,
  buyLegacy,
  deepSproutPayout,
  doGeneration,
  earnFest,
  generationPayout,
  growPumpkin,
  toggleHelper,
  toggleHelperArea,
  buyDecor,
  placeDecor,
  spawnResident,
  startCrossing,
  buildProjectStage,
  claimAlbumStamp,
  decideWeather,
  skipCrossing,
  harvestCrossing,
  residentGone,
  greetResident,
} from '../state'
import type { WeatherChoice } from '../weatherEvents'
import { useCallback, useState } from 'react'
import type { GameCore } from './useGameLoop'

type UseGardenActionsDeps = Pick<GameCore, 'setState' | 'stateRef'>

export function useGardenActions({ setState, stateRef }: UseGardenActionsDeps) {
  const rake = useCallback(() => {
    setState((s) => {
      const now = Date.now()
      if (!challengeAllowsWater(s.challenge)) return s
      if (s.lastTapAt > 0 && now - s.lastTapAt < TAP_COOLDOWN_MS) return s
      const rate = productionPerSecond(s, now)
      const fromRate = rate * tapBonusSeconds(s.truhe) * waterMult(s, now)
      // Cold post-prestige: one Schub must cover the next G1 Ausbauen if the
      // wallet is still short (rate alone can be ~1/s → 60 Ernte).
      const g1 = GENERATORS.find((g) => g.id === 'gemuesebeet')
      const g1Owned = s.owned.gemuesebeet ?? 0
      const g1Cost = g1
        ? generatorCost(g1, g1Owned, lineCostMult(s, 'gemuesebeet'))
        : 23
      const shortfall = Math.max(0, g1Cost - s.ernte)
      const gained = Math.max(fromRate, shortfall, 1)
      return growPumpkin(earnFest(grantTapErnte(s, gained, now), FEST_EARN.water, now), CONTEST_KG.water, now)
    })
  }, [setState])

  const buy = useCallback((id: GeneratorId) => {
    setState((s) => {
      const next = buyGenerator(s, id)
      if (next !== s) {
        logPlaytest('upgrade', {
          id,
          level: next.owned[id] ?? 0,
          kind: 'module',
        })
      }
      return next
    })
  }, [setState])

  const buyModuleBranch = useCallback((id: GeneratorId, kind: BranchKind) => {
    setState((s) => {
      const next = buyBranch(s, id, kind)
      if (next !== s) {
        logPlaytest('upgrade', { id, branch: kind, kind: 'branch' })
      }
      return next
    })
  }, [setState])

  const buyMeta = useCallback((id: TruheItemId) => {
    setState((s) => {
      const next = buyTruheItem(s, id)
      if (next !== s) {
        logPlaytest('upgrade', { id, kind: 'erbstueck' })
      }
      return next
    })
  }, [setState])

  const [postPrestigeFocus, setPostPrestigeFocus] = useState(false)
  const [seasonEnd, setSeasonEnd] = useState<{
    year: number
    gained: number
    deep?: boolean
    generation?: number
    card?: { id: SeasonCardId; preview: number; offline?: number; saving?: number }
  } | null>(null)

  const prestige = useCallback(() => {
    setState((s) => {
      const gain = erbstueckePayout(s.ernteSeason, s.saisonenden, isProbeYear(s))
      const next = doPrestige(s)
      if (next !== s) {
        logPlaytest('prestige', {
          run: next.saisonenden,
          erbstuecke: gain,
          wallet: next.erbstuecke,
          // Herausforderung: geschafft (lief bis hier) bzw. ab jetzt aktiv
          challengeDone: s.challenge ?? undefined,
          challenge: next.challenge ?? undefined,
        })
        setPostPrestigeFocus(true)
        // Was das Jahres-Thema mit diesem Garten gebracht hat (Stufen am Saisonende)
        const def = seasonCardDef(s.seasonCard)
        const card = !def
          ? undefined
          : def.area && s.seasonCardAusbau
            ? { id: def.id, preview: 1, saving: cardSaving(def.id, s.owned) }
            : { id: def.id, preview: cardPreview(def.id, s.owned), offline: def.offline }
        setSeasonEnd({ year: next.saisonenden + 1, gained: gain, card })
      }
      return next
    })
  }, [setState])

  const ackSeasonEnd = useCallback(() => setSeasonEnd(null), [])

  const grant = useCallback((reward: Reward) => {
    setState((s) => grantReward(s, reward))
  }, [setState])

  const spinWheel = useCallback((kind: WheelKind) => {
    setState((s) => {
      const next = applyWheel(s, kind)
      if (next !== s) logPlaytest('wheel', { kind })
      return next
    })
  }, [setState])

  const refillWater = useCallback(() => {
    logPlaytest('water_refill', { source: 'free' })
    setState((s) => ({ ...s, lastTapAt: 0 }))
  }, [setState])

  const ackVariety = useCallback(() => {
    setState((s) => clearLastVariety(s))
  }, [setState])

  const deepReset = useCallback(() => {
    // Automatische Sicherung des Stands direkt davor (läuft im Hintergrund)
    const before = stateRef.current
    if (doDeepReset(before) !== before) void backupBeforeOccasion('deep', before)
    setState((s) => {
      const gain = deepSproutPayout(s)
      const next = doDeepReset(s)
      if (next !== s) {
        logPlaytest('deep_reset', { deep: next.tiefeWinter, sprouts: gain })
        setPostPrestigeFocus(true)
        setSeasonEnd({ year: 1, gained: gain, deep: true })
      }
      return next
    })
  }, [setState, stateRef])

  const handDown = useCallback(() => {
    const before = stateRef.current
    if (doGeneration(before) !== before) void backupBeforeOccasion('generation', before)
    setState((s) => {
      const gain = generationPayout(s)
      const next = doGeneration(s)
      if (next !== s) {
        logPlaytest('generation', { generation: next.generation, vermaechtnis: gain })
        setPostPrestigeFocus(true)
        setSeasonEnd({ year: 1, gained: gain, deep: true, generation: next.generation + 1 })
      }
      return next
    })
  }, [setState, stateRef])

  const buyLegacyRank = useCallback((id: LegacyId) => {
    setState((s) => {
      const next = buyLegacy(s, id)
      if (next !== s) logPlaytest('upgrade', { id, kind: 'legacy' })
      return next
    })
  }, [setState])

  /** Buy `n` levels (Infinity = as many as affordable). Returns levels bought. */
  const buyMany = useCallback((id: GeneratorId, n: number) => {
    const s = stateRef.current
    const count = Number.isFinite(n) ? n : affordableLevels(s, id).count
    if (count <= 0) return 0
    const result = buyGeneratorMany(s, id, count)
    if (result.bought > 0) {
      stateRef.current = result.state
      setState(result.state)
      logPlaytest('upgrade', { id, level: result.state.owned[id] ?? 0, kind: 'module', n: result.bought })
    }
    return result.bought
  }, [setState, stateRef])

  const buyAll = useCallback(() => {
    const result = buyAllBest(stateRef.current)
    if (result.bought > 0) {
      stateRef.current = result.state
      setState(result.state)
      logPlaytest('buy_all', { n: result.bought })
    }
    return result.bought
  }, [setState, stateRef])

  const hireHelper = useCallback(() => {
    setState((s) => {
      const next = buyHelper(s)
      if (next !== s) logPlaytest('upgrade', { id: 'helper', level: next.helperLevel, kind: 'helper' })
      return next
    })
  }, [setState])

  /** Answer today's weather question; returns whether it went well. */
  const chooseWeather = useCallback((choice: WeatherChoice): boolean => {
    const roll = Math.random()
    const r = decideWeather(stateRef.current, choice, Date.now(), roll)
    if (r.state === stateRef.current) return true
    logPlaytest('weather_choice', { choice, good: r.good })
    setState((s) => decideWeather(s, choice, Date.now(), roll).state)
    return r.good
  }, [setState, stateRef])

  const claimStamp = useCallback((id: AlbumStat) => {
    setState((s) => {
      const next = claimAlbumStamp(s, id)
      if (next !== s) logPlaytest('album', { id })
      return next
    })
  }, [setState])

  const chooseChallenge = useCallback((id: ChallengeId | null) => {
    setState((s) => {
      const next = chooseNextChallenge(s, id)
      if (next !== s) logPlaytest('challenge', { action: 'choose', id: id ?? 'keine' })
      return next
    })
  }, [setState])

  const stopChallenge = useCallback(() => {
    setState((s) => {
      const next = abortChallenge(s)
      if (next !== s) logPlaytest('challenge', { action: 'abort', id: s.challenge ?? '' })
      return next
    })
  }, [setState])

  const chooseSeasonCard = useCallback((id: SeasonCardId | null) => {
    setState((s) => pickSeasonCard(s, id))
  }, [setState])

  const buildProject = useCallback((id: ProjectId) => {
    setState((s) => {
      const next = buildProjectStage(s, id)
      if (next !== s) logPlaytest('project', { id })
      return next
    })
  }, [setState])

  const crossStart = useCallback((a: string, b: string) => {
    setState((s) => {
      const next = startCrossing(s, a, b)
      if (next !== s) logPlaytest('crossing', { action: 'start', a, b })
      return next
    })
  }, [setState])

  const crossSkip = useCallback(() => {
    setState((s) => {
      const next = skipCrossing(s)
      if (next !== s) logPlaytest('crossing', { action: 'skip' })
      return next
    })
  }, [setState])

  /** Harvest the crossing; returns the result for the reveal. */
  const crossHarvest = useCallback((): { hybrid: string | null; samen: number } | null => {
    const r = harvestCrossing(stateRef.current)
    if (r.state === stateRef.current) return null
    logPlaytest('crossing', { action: 'harvest', id: r.hybrid, samen: r.samen })
    setState((s) => harvestCrossing(s).state)
    return { hybrid: r.hybrid, samen: r.samen }
  }, [setState, stateRef])

  const letResidentIn = useCallback((id: ResidentId) => {
    setState((s) => {
      const next = spawnResident(s, id)
      if (next !== s) logPlaytest('resident', { action: 'arrive', id })
      return next
    })
  }, [setState])

  const residentLeft = useCallback(() => {
    setState((s) => residentGone(s))
  }, [setState])

  /** Tap a Gartenbewohner; returns what happened for the toast. */
  const greetVisitorAnimal = useCallback((): { first: boolean; ernte: number } | null => {
    const r = greetResident(stateRef.current)
    if (r.state === stateRef.current) return null
    logPlaytest('resident', { action: 'greet', first: r.first })
    setState((s) => greetResident(s).state)
    return { first: r.first, ernte: r.ernte }
  }, [setState, stateRef])

  const purchaseDecor = useCallback((id: DecorId) => {
    setState((s) => {
      const next = buyDecor(s, id)
      if (next !== s) logPlaytest('decor', { action: 'buy', id })
      return next
    })
  }, [setState])

  const setDecor = useCallback((slot: number, id: DecorId | null) => {
    setState((s) => {
      const next = placeDecor(s, slot, id)
      if (next !== s) logPlaytest('decor', { action: id ? 'place' : 'remove', id: id ?? undefined, slot })
      return next
    })
  }, [setState])

  const switchHelperArea = useCallback((id: GeneratorId) => {
    setState((s) => toggleHelperArea(s, id))
  }, [setState])

  const switchHelper = useCallback(() => {
    setState((s) => toggleHelper(s))
  }, [setState])

  const ackHelperReport = useCallback(() => {
    setState((s) => (s.helperReport ? { ...s, helperReport: 0 } : s))
  }, [setState])
  const buyDeep = useCallback((id: DeepMetaId) => {
    setState((s) => buyDeepUpgrade(s, id))
  }, [setState])

  const clearPostPrestigeFocus = useCallback(() => {
    setPostPrestigeFocus(false)
  }, [])

  return {
    rake,
    buy,
    buyModuleBranch,
    buyMeta,
    postPrestigeFocus,
    seasonEnd,
    prestige,
    ackSeasonEnd,
    grant,
    spinWheel,
    refillWater,
    ackVariety,
    deepReset,
    handDown,
    buyLegacyRank,
    buyMany,
    buyAll,
    hireHelper,
    chooseWeather,
    claimStamp,
    chooseChallenge,
    stopChallenge,
    chooseSeasonCard,
    buildProject,
    crossStart,
    crossSkip,
    crossHarvest,
    letResidentIn,
    residentLeft,
    greetVisitorAnimal,
    purchaseDecor,
    setDecor,
    switchHelperArea,
    switchHelper,
    ackHelperReport,
    buyDeep,
    clearPostPrestigeFocus,
  }
}
