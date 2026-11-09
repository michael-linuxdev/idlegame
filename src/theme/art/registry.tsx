/**
 * Zentrale Grafik-Liste je Kapitel: welche Komponente zeichnet Bereiche,
 * gesperrte Ecken, freie Plätze und die Kulisse. Ersetzt die verstreuten
 * Weichen in ChapterMap/HandWild. Ein Test stellt sicher, dass jedes
 * Kapitel aus src/game/chapters.ts einen vollständigen Eintrag hat.
 */
import { memo, type ComponentType } from 'react'
import { CHAPTERS, type ChapterId } from '../../game/chapters'
import type { Season } from '../ambient'
import { ChapterAreaArt, ChapterBackdrop, ChapterReady, ChapterWild } from '../ChapterArt'
import { CHAPTER_ART, HAND_ART_CHAPTERS } from '../chapterArtSpecs'
import { HandArt, HofWild, ImkereiWild, TeichWild } from '../HandArt'
import { WildA } from '../HandArtA'
import { WildB } from '../HandArtB'
import { OrchardArt, OrchardSapling, OrchardWild } from '../OrchardArt'
import { OrchardBackdrop } from '../OrchardBackdrop'
import { VineyardArt, VineyardBackdrop, VineyardStakes, VineyardWild } from '../VineyardArt'
import { sameTierProps } from '../tiers'

export interface AreaArtProps {
  id: string
  level: number
  season?: Season
}

export interface ChapterArtEntry {
  /** Ausgebauter Bereich (Stufe 1–5 aus level) */
  area: ComponentType<AreaArtProps>
  /** Gesperrte, verwilderte Ecke */
  wild: ComponentType<{ seed?: number }>
  /** Frei, aber noch nicht angelegt */
  ready: ComponentType
  /** Kulisse der Kapitel-Karte */
  backdrop: ComponentType<{ stage: number }>
}

function handArea(chapter: ChapterId): ComponentType<AreaArtProps> {
  const Area = memo(function HandArea({ id, level, season }: AreaArtProps) {
    return <HandArt chapter={chapter} id={id} level={level} season={season} />
  }, sameTierProps)
  return Area
}

function specArea(chapter: ChapterId): ComponentType<AreaArtProps> {
  return memo(function SpecArea({ id, level, season }: AreaArtProps) {
    const spec = CHAPTER_ART[chapter]?.areas[id]
    return spec ? <ChapterAreaArt spec={spec} level={level} season={season} /> : null
  }, sameTierProps)
}

function specBackdrop(chapter: ChapterId): ComponentType<{ stage: number }> {
  return function SpecBackdrop({ stage }: { stage: number }) {
    const spec = CHAPTER_ART[chapter]?.backdrop
    return spec ? <ChapterBackdrop spec={spec} stage={stage} /> : null
  }
}

function wildFor(chapter: ChapterId): ComponentType<{ seed?: number }> {
  switch (chapter) {
    case 'bauernhof':
      return HofWild
    case 'imkerei':
      return ImkereiWild
    case 'teich':
      return TeichWild
    case 'kraeuter':
    case 'botanik':
    case 'alm':
      return ({ seed }: { seed?: number }) => <WildA chapter={chapter} seed={seed} />
    case 'lavendel':
    case 'japangarten':
    case 'gartenschau':
      return ({ seed }: { seed?: number }) => <WildB chapter={chapter} seed={seed} />
    default:
      return ChapterWild
  }
}

function entryFor(chapter: ChapterId): ChapterArtEntry {
  if (chapter === 'weinberg') {
    return { area: VineyardArt, wild: VineyardWild, ready: VineyardStakes, backdrop: VineyardBackdrop }
  }
  if (chapter === 'obstwiese') {
    return { area: OrchardArt, wild: OrchardWild, ready: OrchardSapling, backdrop: OrchardBackdrop }
  }
  return {
    area: HAND_ART_CHAPTERS.includes(chapter) ? handArea(chapter) : specArea(chapter),
    wild: wildFor(chapter),
    ready: ChapterReady,
    backdrop: specBackdrop(chapter),
  }
}

export const ART_REGISTRY = Object.fromEntries(CHAPTERS.map((c) => [c.id, entryFor(c.id)])) as Record<ChapterId, ChapterArtEntry>
