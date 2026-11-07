import type { ThemePack } from '../types'
import { farmStrings, type FarmStrings } from './strings'

export const farmTheme: ThemePack<FarmStrings> = {
  id: 'farm',
  dataTheme: 'farm',
  brand: farmStrings.brand,
  themeColor: '#e8f0e4',
  backgroundColor: '#dce8d6',
  strings: farmStrings,
  mapClass: 'theme-map-farm',
}

export { farmStrings }
export type { FarmStrings }
