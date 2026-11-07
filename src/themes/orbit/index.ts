import type { ThemePack } from '../types'
import { orbitStrings, type OrbitStrings } from './strings'

/** Alternate theme pack — Orbit Rack space datacenter (kept for later skins). */
export const orbitTheme: ThemePack<OrbitStrings> = {
  id: 'orbit',
  dataTheme: 'orbit',
  brand: orbitStrings.brand,
  themeColor: '#e8eef4',
  backgroundColor: '#d8e2ec',
  strings: orbitStrings,
  mapClass: 'theme-map-orbit',
}

export { orbitStrings }
export type { OrbitStrings }
