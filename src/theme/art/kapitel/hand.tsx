/** Bausatz für handgezeichnete Kapitel (ein Zeichner je Kapitel). */
import { memo, type ComponentType, type ReactNode } from 'react'
import type { ChapterId } from '../../../game/chapters'
import type { Season } from '../../ambient'
import { CHAPTER_ART } from '../../chapterArtSpecs'
import { moduleTier, sameTierProps } from '../../tiers'
import { ChapterBackdrop } from '../chapters/backdrop'
import { ChapterReady } from '../chapters/spots'
import type { AreaArtProps, ChapterArtEntry } from './types'

type Draw = (p: { id: string; tier: number; season?: Season }) => ReactNode

export function specBackdrop(chapter: ChapterId): ComponentType<{ stage: number }> {
  return function SpecBackdrop({ stage }: { stage: number }) {
    const spec = CHAPTER_ART[chapter]?.backdrop
    return spec ? <ChapterBackdrop spec={spec} stage={stage} /> : null
  }
}

export function handEntry(chapter: ChapterId, draw: Draw, wild: ComponentType<{ seed?: number }>): ChapterArtEntry {
  const area = memo(function HandArea({ id, level, season }: AreaArtProps) {
    return <>{draw({ id, tier: Math.max(1, moduleTier(level)), season })}</>
  }, sameTierProps)
  return { area, wild, ready: ChapterReady, backdrop: specBackdrop(chapter) }
}

/** Gesperrte Ecke aus einer Sammel-Komponente (WildA/WildB), die das Kapitel als Prop nimmt. */
export function chapterWild(chapter: ChapterId, Wild: ComponentType<{ chapter: string; seed?: number }>): ComponentType<{ seed?: number }> {
  return function ChapterWildSpot({ seed }: { seed?: number }) {
    return <Wild chapter={chapter} seed={seed} />
  }
}
