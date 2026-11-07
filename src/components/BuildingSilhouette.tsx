import type { SilhouetteKind } from '../game/generators'
import { ACTIVE_THEME_ID } from '../themes'
import { ArcadeSilhouettes } from '../themes/arcade/silhouettes'
import { FarmSilhouettes } from '../themes/farm/silhouettes'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Theme-aware module art — farm (TurmFarm) or arcade (Tokenhalle). */
export function BuildingSilhouette(props: Props) {
  if (ACTIVE_THEME_ID === 'arcade') {
    return <ArcadeSilhouettes {...props} />
  }
  return <FarmSilhouettes {...props} />
}
