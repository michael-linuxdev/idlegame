/**
 * Hand-drawn chapter art (Kapitel 4–12): one motif per area, visible growth
 * over the five tiers and the real seasons. Die Grafik liegt je Kapitel unter
 * src/theme/art/chapters/; diese Datei hält die bisherigen Exporte stabil.
 */
import { memo, type ReactNode } from 'react'
import type { ChapterId } from '../game/chapters'
import type { Season } from './ambient'
import { moduleTier, sameTierProps } from './tiers'
import { Bauernhof, HofWild } from './art/chapters/bauernhof'
import { Imkerei, ImkereiWild } from './art/chapters/imkerei'
import { Teich, TeichWild } from './art/chapters/teich'
import { Alm, Botanik, Kraeuter } from './HandArtA'
import { Gartenschau, Japan, Lavendel } from './HandArtB'

export { Bauernhof, HofWild, Imkerei, ImkereiWild, Teich, TeichWild }

const HAND: Partial<Record<ChapterId, (p: { id: string; tier: number; season?: Season }) => ReactNode>> = {
  bauernhof: Bauernhof,
  imkerei: Imkerei,
  teich: Teich,
  kraeuter: Kraeuter,
  botanik: Botanik,
  alm: Alm,
  lavendel: Lavendel,
  japangarten: Japan,
  gartenschau: Gartenschau,
}

export const HandArt = memo(function HandArt({
  chapter,
  id,
  level,
  season,
}: {
  chapter: ChapterId
  id: string
  level: number
  season?: Season
}) {
  const draw = HAND[chapter]
  if (!draw) return null
  return <>{draw({ id, tier: Math.max(1, moduleTier(level)), season })}</>
}, sameTierProps)
