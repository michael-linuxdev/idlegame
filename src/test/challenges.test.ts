import { describe, expect, it } from 'vitest'
import { CHALLENGES_FROM_PRESTIGES, challengesMult, FIVE_BEDS } from '../game/challenges'
import {
  abortChallenge,
  buyGenerator,
  chooseNextChallenge,
  createInitialState,
  createPostPrestigeState,
  productionPerSecond,
  refillWateringCan,
} from '../game/state'
import { parseSave } from '../game/storage'

const NOW = 1_800_000_000_000
const rich = () => ({ ...createInitialState(NOW), ernte: 1e40, ernteSeason: 1e40, saisonenden: CHALLENGES_FROM_PRESTIGES, samen: 100 })

describe('Omas Herausforderungen', () => {
  it('erst ab Gartenjahr 8 wählbar, startet beim nächsten Saisonende', () => {
    const early = { ...rich(), saisonenden: CHALLENGES_FROM_PRESTIGES - 1 }
    expect(chooseNextChallenge(early, 'ohneKompost')).toBe(early)
    const s = chooseNextChallenge(rich(), 'ohneKompost')
    expect(s.challenge).toBeNull()
    const next = createPostPrestigeState(s, NOW)
    expect(next.challenge).toBe('ohneKompost')
    expect(next.challengeNext).toBeNull()
  })

  it('ohne Kompost: Kompost lässt sich nicht ausbauen', () => {
    const s = { ...rich(), challenge: 'ohneKompost' as const, owned: { ...rich().owned, gemuesebeet: 10 } }
    expect(buyGenerator(s, 'kompost')).toBe(s)
    expect(buyGenerator(s, 'gemuesebeet')).not.toBe(s)
  })

  it('nur fünf Beete: der sechste Bereich bleibt zu, die fünf wachsen weiter', () => {
    const owned = { ...rich().owned, gemuesebeet: 5, kompost: 5, kraeuterspirale: 5, beerenhecke: 5, obstwiese: 5 }
    const s = { ...rich(), challenge: 'fuenfBeete' as const, owned }
    expect(Object.values(owned).filter((n) => n > 0)).toHaveLength(FIVE_BEDS)
    expect(buyGenerator(s, 'bienenstock')).toBe(s)
    expect(buyGenerator(s, 'kompost').owned.kompost).toBe(6)
  })

  it('ohne Gießkanne: kein Auffüllen', () => {
    const s = { ...rich(), challenge: 'ohneGiessen' as const, lastTapAt: NOW - 1000 }
    expect(refillWateringCan(s, NOW)).toBe(s)
  })

  it('Abbrechen ohne Verlust, Durchhalten gibt dauerhaft +3 %', () => {
    const s = { ...rich(), challenge: 'ohneKompost' as const, owned: { ...rich().owned, gemuesebeet: 20 } }
    const aborted = abortChallenge(s)
    expect(aborted.challenge).toBeNull()
    expect(aborted.owned).toEqual(s.owned)
    expect(aborted.ernte).toBe(s.ernte)
    expect(createPostPrestigeState(aborted, NOW).challengesDone).toEqual([])
    const done = createPostPrestigeState(s, NOW)
    expect(done.challengesDone).toEqual(['ohneKompost'])
    const base = { ...done, owned: { ...done.owned, gemuesebeet: 20 } }
    expect(productionPerSecond(base, NOW) / productionPerSecond({ ...base, challengesDone: [] }, NOW)).toBeCloseTo(challengesMult(['ohneKompost']), 6)
    // doppelt zählt nicht
    expect(createPostPrestigeState({ ...done, challenge: 'ohneKompost' }, NOW).challengesDone).toEqual(['ohneKompost'])
  })

  it('Spielstand behält alles; ältere Stände starten ohne', () => {
    const s = { ...rich(), challenge: 'fuenfBeete' as const, challengeNext: 'ohneGiessen' as const, challengesDone: ['ohneKompost' as const] }
    const back = parseSave(JSON.parse(JSON.stringify(s)))!
    expect(back.challenge).toBe('fuenfBeete')
    expect(back.challengeNext).toBe('ohneGiessen')
    expect(back.challengesDone).toEqual(['ohneKompost'])
    const old = parseSave({ ...JSON.parse(JSON.stringify(createInitialState(NOW))), challenge: 'quatsch', challengesDone: 'x' })!
    expect(old.challenge).toBeNull()
    expect(old.challengesDone).toEqual([])
  })
})
