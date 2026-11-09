import type { ComponentType } from 'react'
import type { Season } from '../../ambient'

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
