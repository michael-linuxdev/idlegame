import { P } from '../palette'
import { Place } from './Place'
import { STROKE } from './style'

/** Obstkiste (18×9), optional gefüllt; Fußpunkt = Mitte der Unterkante. */
export function Crate({ x, y, fruit, s = 1 }: { x: number; y: number; fruit?: string; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      {fruit
        ? [-6, -2, 2, 6].map((dx, i) => <circle key={dx} cx={dx} cy={-9.5 - (i % 2)} r="2.4" fill={fruit} stroke="rgba(0,0,0,0.25)" strokeWidth={STROKE.hair} />)
        : null}
      <rect x="-9" y="-9" width="18" height="9" rx="1" fill={P.wood} stroke={P.outline} strokeWidth={STROKE.contour} />
      <path d="M-9 -4.5 H9" stroke={P.woodDark} strokeWidth={STROKE.detail} />
    </Place>
  )
}

/** Einmachglas (Honig, Marmelade, Kräuter); Fußpunkt = Bodenmitte. */
export function Jar({ x, y, c = P.honey, lid = P.paper, s = 1 }: { x: number; y: number; c?: string; lid?: string; s?: number }) {
  return (
    <Place x={x} y={y} s={s}>
      <rect x="-3" y="-7" width="6" height="7" rx="1.4" fill={c} stroke={P.outline} strokeWidth={STROKE.detail} />
      <rect x="-3.4" y="-9" width="6.8" height="2.4" rx="0.8" fill={lid} stroke={P.outline} strokeWidth={STROKE.hair * 1.6} />
      <rect x="-1.8" y="-5" width="3.6" height="2.4" fill={P.label} />
    </Place>
  )
}
