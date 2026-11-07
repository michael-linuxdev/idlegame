import { ACTIVE_THEME_ID } from '../themes'
import { ArcadeMapBackdrop } from '../themes/arcade/MapBackdrop'
import { FarmMapBackdrop } from '../themes/farm/MapBackdrop'

export function ThemeMapBackdrop() {
  if (ACTIVE_THEME_ID === 'arcade') return <ArcadeMapBackdrop />
  return <FarmMapBackdrop />
}
