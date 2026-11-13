/**
 * Map decoration for the saisonale Feste (while a fest runs) and for the four
 * Fest-Gartenstile (permanent once bought). Stücke und Plätze: festItems.tsx.
 */
import { memo, type ReactNode } from 'react'
import type { FestId } from '../game/fests'
import { festBunting, festItems, festSkinItems, spotsCollide, type Spot } from './festItems'

function D({
  left,
  top,
  w,
  cls = '',
  children,
}: {
  left: string
  top: string
  w: number
  cls?: string
  children: ReactNode
}) {
  return (
    <div className={`garden-decor decor-fest ${cls}`} style={{ left, top, width: `calc(var(--u) * ${w})` }}>
      {children}
    </div>
  )
}

const LAYER: Partial<Record<FestId, string>> = { laternenfest: ' fest-lantern-night', advent: ' fest-frost', raunaechte: ' fest-frost' }

export const FestDecor = memo(function FestDecor({ fest, skin, blocked }: { fest: FestId; skin?: string; blocked?: readonly Spot[] }) {
  const taken = [...(blocked ?? []), ...festSkinItems(skin, fest)]
  return (
    <div className={`fest-layer-map${LAYER[fest] ?? ''}`}>
      {fest === 'sommerfest' ? <div className="fest-bunting">{festBunting()}</div> : null}
      {festItems(fest)
        .filter((i) => !taken.some((b) => spotsCollide(i, b)))
        .map((i) => (
          <D key={i.key} left={`${i.left}%`} top={`${i.top}%`} w={i.w}>{i.art}</D>
        ))}
      {fest === 'advent' ? <div className="fest-snow" /> : null}
      {fest === 'bluetenfest' ? <div className="ambient-particles p-petal skin-petals" /> : null}
    </div>
  )
})

/** Fest-Gartenstil → permanent decoration (kept compact, no duplicates). */
export const FestSkinDecor = memo(function FestSkinDecor({ skin, fest }: { skin?: string; fest?: FestId }) {
  const items = festSkinItems(skin, fest)
  const bunting = skin === 'skin-festSommer' && fest !== 'sommerfest'
  if (!items.length && !bunting) return null
  return (
    <div className={`fest-layer-map${skin === 'skin-festAdvent' ? ' fest-frost' : ''}`}>
      {bunting ? <div className="fest-bunting">{festBunting()}</div> : null}
      {items.map((i) => (
        <D key={i.key} left={`${i.left}%`} top={`${i.top}%`} w={i.w}>{i.art}</D>
      ))}
    </div>
  )
})
