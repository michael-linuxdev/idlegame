import type { SilhouetteKind } from '../game/generators'
import { FarmSilhouettes } from '../themes/farm/silhouettes'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Farm module art (sole shipped theme). */
export function BuildingSilhouette(props: Props) {
  return <FarmSilhouettes {...props} />
}
