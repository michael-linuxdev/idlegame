import type { ThemePack } from '../types'
import { arcadeStrings, type ArcadeStrings } from './strings'

export const arcadeTheme: ThemePack<ArcadeStrings> = {
  id: 'arcade',
  dataTheme: 'arcade',
  brand: arcadeStrings.brand,
  themeColor: '#e6eef8',
  backgroundColor: '#d6e2f0',
  strings: arcadeStrings,
  mapClass: 'theme-map-arcade',
}

export { arcadeStrings }
export type { ArcadeStrings }
