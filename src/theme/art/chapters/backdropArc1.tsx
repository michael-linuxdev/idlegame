/**
 * Kulissen Bogen I, ab Kapitel 18 (Deich, Spreewald). Wird von backdrop.tsx
 * aufgerufen: `GroundExtras` in der gestreckten 100×100-Boden-SVG (Deko klein
 * halten), `HorizonExtras` im Horizont (400×60) vor den hinteren Hügeln.
 */
import type { BackdropSpec } from '../../chapterArtSpecs'
import { P } from '../palette'

const CORNERS: [number, number][] = [
  [5, 44],
  [95, 42],
  [6, 74],
  [94, 72],
]

export function GroundExtrasArc1({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.dike
        ? CORNERS.map(([x, y], i) => (
            <g key={`dk${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.paper} opacity=".8" />
              <path d={`M${x} ${y}l-1 -2.4M${x} ${y}l.2 -2.8M${x} ${y}l1.2 -2.2`} stroke={i % 2 ? P.winterLeaf : P.leafMoss} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
      {spec.spreewald
        ? CORNERS.map(([x, y], i) => (
            <g key={`sw${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.water} opacity=".8" />
              <path d={`M${x - 1.4} ${y}v-2.4M${x - 0.6} ${y}v-2M${x + 1.4} ${y}v-2.2`} stroke={P.leafMoss} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
    </>
  )
}

export function HorizonExtrasArc1({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.dike ? (
        <g>
          {[40, 150, 250, 350].map((x, i) => (
            <ellipse key={x} cx={x} cy={8 + (i % 2) * 4} rx={26 + (i % 2) * 8} ry="6" fill={P.white} opacity=".8" />
          ))}
          <path d="M0 48 Q100 30 200 32 T400 30 V48z" fill={P.leaf} />
          <path d="M0 40 Q100 28 200 30 T400 28" stroke={P.leafPale} strokeWidth="2" fill="none" />
          {[60, 92, 120, 210, 236, 280].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={31 - (i % 2)} rx="4" ry="2.4" fill={P.feather} />
              <circle cx={x + 4} cy={30 - (i % 2)} r="1.4" fill={P.charcoal} />
            </g>
          ))}
          <path d="M318 40 L322 4 H330 L334 40z" fill={P.white} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${318.6 + k * 0.6} ${34 - k * 11}L${319.2 + k * 0.6} ${28 - k * 11}H${332.8 - k * 0.6}L${333.4 - k * 0.6} ${34 - k * 11}z`} fill={P.barn} />
          ))}
          <rect x="321" y="0" width="10" height="5" fill={P.lamp} />
          <rect x="140" y="34" width="34" height="12" fill={P.cream} />
          <path d="M136 36 Q140 20 157 18 Q174 20 178 36z" fill={P.woodLight} />
        </g>
      ) : null}
      {spec.spreewald ? (
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const x = 6 + i * 26
            return (
              <g key={i}>
                <path d={`M${x} 48V${30 + (i % 3) * 3}`} stroke={P.charcoal} strokeWidth="2" />
                <ellipse cx={x} cy={24 + (i % 3) * 3} rx="13" ry="12" fill={i % 2 ? P.leafDark : P.leafMoss} />
              </g>
            )
          })}
          {[120, 260].map((x, i) => (
            <g key={x}>
              <rect x={x} y={28} width="36" height="18" fill={P.woodMid} />
              {[0, 1, 2, 3, 4].map((k) => (
                <path key={k} d={`M${x} ${31 + k * 3.4}h36`} stroke={P.woodDark} strokeWidth="1" />
              ))}
              <path d={`M${x - 4} 28 L${x + 18} 12 L${x + 40} 28z`} fill={i ? P.leafMoss : P.woodDark} />
              <path d={`M${x + 14} 14l4 -4l4 4`} stroke={P.woodLight} strokeWidth="1.6" fill="none" />
            </g>
          ))}
          <g transform="translate(146 10)">
            <path d="M-6 0q6 -4 12 0" fill={P.woodDark} />
            <ellipse cx="0" cy="-3" rx="4" ry="2" fill={P.white} />
            <path d="M3 -4q2 -3 1 -6l3 1" stroke={P.white} strokeWidth="1.2" fill="none" />
          </g>
        </g>
      ) : null}
    </>
  )
}
