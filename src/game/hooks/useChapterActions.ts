/** Kapitel, Oma Ilse, Weinlese, Omas Extras, Feste. Teil von useGame(), siehe src/game/useGame.ts. */
import type { CareKind, ChapterId } from '../chapters'
import { logPlaytest } from '../playtestLog'
import {
  buyFestItem,
  buyChapterArea,
  buyChapterMany,
  buyChapterCare,
  syncChaptersOpen,
  buyIlse,
  toggleIlse,
  finishWeinlese,
  clearLastChest,
  claimRecipe,
  catchRainbow,
  makeWish,
  claimContest,
  type Wish,
} from '../state'
import { useCallback } from 'react'
import type { GameCore } from './useGameLoop'

type UseChapterActionsDeps = Pick<GameCore, 'setState' | 'stateRef'>

export function useChapterActions({ setState, stateRef }: UseChapterActionsDeps) {
  const buyChapter = useCallback((id: ChapterId, area: string) => {
    setState((s) => {
      const next = buyChapterArea(s, id, area)
      if (next !== s) logPlaytest('upgrade', { id: area, level: next.chapters[id].owned[area] ?? 0, kind: id })
      return next
    })
  }, [setState])

  const buyChapterBulk = useCallback((id: ChapterId, area: string, n: number) => {
    const result = buyChapterMany(stateRef.current, id, area, Number.isFinite(n) ? n : 1000)
    if (result.bought > 0) {
      stateRef.current = result.state
      setState(result.state)
      logPlaytest('upgrade', { id: area, level: result.state.chapters[id].owned[area] ?? 0, kind: id, n: result.bought })
    }
    return result.bought
  }, [setState, stateRef])

  const buyChapterCareRank = useCallback((id: ChapterId, area: string, kind: CareKind) => {
    setState((s) => {
      const next = buyChapterCare(s, id, area, kind)
      if (next !== s) logPlaytest('upgrade', { id: area, kind: `${id}-care-${kind}` })
      return next
    })
  }, [setState])

  const seeChapterIntro = useCallback((id: ChapterId) => {
    setState((s) => ({ ...s, chapters: { ...s.chapters, [id]: { ...s.chapters[id], introSeen: true } } }))
  }, [setState])

  /** Test hook (?kapitel2=1 / ?kapitel3=1): open a chapter right away. */
  const forceChapter = useCallback((id: ChapterId) => {
    setState((s) => syncChaptersOpen(s, Date.now(), id))
  }, [setState])

  const hireIlse = useCallback(() => {
    setState((s) => {
      const next = buyIlse(s)
      if (next !== s) logPlaytest('upgrade', { id: 'ilse', level: next.ilseLevel, kind: 'helper' })
      return next
    })
  }, [setState])

  const switchIlse = useCallback(() => setState((s) => toggleIlse(s)), [setState])

  const weinlese = useCallback((hits: number) => {
    setState((s) => {
      const next = finishWeinlese(s, hits)
      if (next !== s) logPlaytest('weinlese', { hits })
      return next
    })
  }, [setState])

  const ackChest = useCallback(() => setState((s) => clearLastChest(s)), [setState])
  const cookRecipe = useCallback(() => {
    setState((s) => {
      const next = claimRecipe(s)
      if (next !== s) logPlaytest('recipe', { day: s.recipe.day })
      return next
    })
  }, [setState])
  const tapRainbow = useCallback(() => setState((s) => catchRainbow(s)), [setState])
  const wish = useCallback((w: Wish) => setState((s) => makeWish(s, w)), [setState])
  const claimPumpkin = useCallback(() => setState((s) => claimContest(s)), [setState])

  const buyFest = useCallback((itemId: string) => {
    setState((s) => {
      const next = buyFestItem(s, itemId)
      if (next !== s) logPlaytest('fest_buy', { id: itemId, key: next.festKey })
      return next
    })
  }, [setState])

  return { buyChapter, buyChapterBulk, buyChapterCareRank, seeChapterIntro, forceChapter, hireIlse, switchIlse, weinlese, ackChest, cookRecipe, tapRainbow, wish, claimPumpkin, buyFest }
}
