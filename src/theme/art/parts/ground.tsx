import { P } from '../palette'
import { GRID, type Grid } from './grid'
import { Place } from './Place'
import { useSeason } from './season'
import { STROKE } from './style'

/** Einheitlicher Bodenschatten: gleiche Höhe und Farbe je Bildraster. */
export function Shadow({ cx, rx, grid = 'plot' }: { cx?: number; rx: number; grid?: Grid }) {
  const g = GRID[grid]
  return <ellipse cx={cx ?? g.w / 2} cy={g.ground} rx={rx} ry={g.shadowRy} fill="var(--g-shadow)" stroke="none" />
}

/**
 * Beet mit Erdfläche oben und Holzfront. Fußpunkt = Mitte der Unterkante.
 * `h` = Tiefe der Erdfläche, `front` = Höhe der Holzfront (0 = ohne Rahmen).
 */
export function Bed({ x, y, w, h = 14, front = 6, winter: winterProp, s = 1 }: { x: number; y: number; w: number; h?: number; front?: number; winter?: boolean; s?: number }) {
  const season = useSeason()
  const winter = winterProp ?? season === 'winter'
  const left = -w / 2
  const top = -front - h
  const wood = front > 0
  const slats = Math.max(1, Math.floor(w / 14))
  return (
    <Place x={x} y={y} s={s}>
      {wood ? <rect x={left} y={top + h} width={w} height={front} rx="1.5" fill={P.wood} stroke={P.outline} strokeWidth={STROKE.contour} /> : null}
      <rect x={left} y={top} width={w} height={h} rx="3" fill={winter ? P.cream : P.soil} stroke={wood ? P.outline : P.soilDark} strokeWidth={STROKE.contour} />
      {!winter ? (
        <path d={`M${left + 4} ${top + h * 0.4} H${left + w - 4} M${left + 4} ${top + h * 0.75} H${left + w - 4}`} stroke={P.soilDark} strokeWidth={STROKE.detail} strokeDasharray="3 3" />
      ) : null}
      {wood
        ? Array.from({ length: slats }, (_, i) => {
            const sx = left + (i + 1) * (w / (slats + 1))
            return <line key={i} x1={sx} y1={top + h} x2={sx} y2={top + h + front} stroke={P.woodDark} strokeWidth={STROKE.detail} />
          })
        : null}
    </Place>
  )
}

/** Schneekante entlang eines Dach-/Kantenpfads (nur im Winter zeichnen). */
export function SnowCap({ d, w = 3 }: { d: string; w?: number }) {
  return <path d={d} fill="none" stroke={P.white} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" className="art-snow" />
}
