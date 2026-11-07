import { ACTIVE_THEME_ID } from '../themes'
import { FarmMapBackdrop } from '../themes/farm/MapBackdrop'
import { OrbitMapBackdrop } from '../themes/orbit/MapBackdrop'

export function ThemeMapBackdrop() {
  if (ACTIVE_THEME_ID === 'orbit') return <OrbitMapBackdrop />
  return <FarmMapBackdrop />
}
