import type { SilhouetteKind } from '../game/generators'
import { ACTIVE_THEME_ID } from '../themes'
import { FarmSilhouettes } from '../themes/farm/silhouettes'
import { OrbitSilhouettes } from '../themes/orbit/silhouettes'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Theme-aware module art — farm by default, orbit pack retained. */
export function BuildingSilhouette(props: Props) {
  if (ACTIVE_THEME_ID === 'orbit') {
    return <OrbitSilhouettes {...props} />
  }
  return <FarmSilhouettes {...props} />
}
