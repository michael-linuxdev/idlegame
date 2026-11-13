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
  /** Frei, aber noch nicht angelegt; `id` = Bereich (Setzling für Bäume, Bauplatz für Gebäude …) */
  ready: ComponentType<{ id?: string }>
  /** Kulisse der Kapitel-Karte */
  backdrop: ComponentType<{ stage: number }>
}
