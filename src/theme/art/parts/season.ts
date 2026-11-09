/**
 * Jahreszeit für Bausteine: ModuleArt/PlotArt stellen sie bereit, Bäume,
 * Büsche und Beete passen sich selbst an (Blüte, Herbstlaub, Schnee).
 * Ohne Provider (Kapitel-Grafik mit eigener season-Prop) bleibt alles wie im Sommer.
 */
import { createContext, useContext } from 'react'
import type { Season } from '../../ambient'
import { P } from '../palette'

export const SeasonContext = createContext<Season | undefined>(undefined)

export function useSeason(): Season | undefined {
  return useContext(SeasonContext)
}

/** Laubfarben je Jahreszeit für Kronen und Büsche (Licht oben links bleibt). */
export function foliage(season: Season | undefined): { crown: string; mid: string; light: string } {
  if (season === 'autumn') return { crown: P.autumnDark, mid: P.autumn, light: P.gold }
  if (season === 'winter') return { crown: P.winterLeafDark, mid: P.winterLeaf, light: P.winterLeafLight }
  if (season === 'spring') return { crown: P.leafDark, mid: P.leaf, light: P.leafPale }
  return { crown: P.leafDark, mid: P.leaf, light: P.leafLight }
}
