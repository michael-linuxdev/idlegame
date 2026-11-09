/**
 * Kulissen Bogen II „Omas Saatgutbriefe“ (Kapitel 20–29). Wird von
 * backdrop.tsx aufgerufen: `GroundExtrasArc2` in der gestreckten
 * 100×100-Boden-SVG (Deko klein halten), `HorizonExtrasArc2` im Horizont.
 */
import type { BackdropSpec } from '../../chapterArtSpecs'
import { P } from '../palette'

const CORNERS: [number, number][] = [
  [5, 44],
  [95, 42],
  [6, 74],
  [94, 72],
]

export function GroundExtrasArc2({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.cotswolds
        ? CORNERS.map(([x, y], i) => (
            <g key={`cw${i}`}>
              <ellipse cx={x} cy={y} rx="1.6" ry=".7" fill={P.leafDark} />
              {[-0.8, 0, 0.8].map((d) => (
                <ellipse key={d} cx={x + d} cy={y - 0.5 - Math.abs(d) * 0.2} rx=".4" ry=".3" fill={[P.pink, P.lilac, P.cream, P.berry][i]} />
              ))}
            </g>
          ))
        : null}
      {spec.bulbFields
        ? CORNERS.map(([x, y], i) => (
            <g key={`bf${i}`}>
              {[0, 1, 2].map((k) => (
                <rect key={k} x={x - 1.8} y={y - 1.2 + k * 0.9} width="3.6" height=".5" fill={[P.red, P.yellow, P.plum, P.orange][(i + k) % 4]} />
              ))}
            </g>
          ))
        : null}
      {spec.lagoon
        ? CORNERS.map(([x, y], i) => (
            <g key={`lg${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.water} opacity=".85" />
              <path d={`M${x + 0.6} ${y + 0.4}v-2.6`} stroke={P.woodDark} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
      {spec.swedishWoods
        ? CORNERS.map(([x, y], i) => (
            <g key={`sw${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.leafMoss} />
              <ellipse cx={x - 0.5} cy={y - 0.2} rx=".9" ry=".45" fill={P.stone} />
              {[0, 1, 2].map((k) => (
                <ellipse key={k} cx={x + 0.4 + k * 0.5} cy={y + 0.2 - (k % 2) * 0.3} rx=".25" ry=".15" fill={i % 2 ? P.berry : P.blue} />
              ))}
            </g>
          ))
        : null}
    </>
  )
}

export function HorizonExtrasArc2({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.cotswolds ? (
        <g>
          {[20, 90, 300, 370].map((x, i) => (
            <path key={x} d={`M${x - 40} 48 Q${x} ${20 + (i % 2) * 6} ${x + 40} 48z`} fill={i % 2 ? P.leaf : P.leafLight} />
          ))}
          {[[60, 34], [86, 30], [330, 34], [350, 30]].map(([x, y]) => (
            <g key={x}>
              <ellipse cx={x} cy={y} rx="4" ry="2.4" fill={P.feather} />
              <circle cx={x! + 4} cy={y! - 1} r="1.2" fill={P.charcoal} />
            </g>
          ))}
          {[150, 196, 236].map((x, i) => (
            <g key={x}>
              <rect x={x} y={24 + (i % 2) * 4} width="38" height={22 - (i % 2) * 4} fill={P.paper} stroke={P.woodLight} strokeWidth="1" />
              <path d={`M${x - 3} ${24 + (i % 2) * 4} L${x + 19} ${8 + (i % 2) * 4} L${x + 41} ${24 + (i % 2) * 4}z`} fill={P.stoneDark} />
              <rect x={x + 6} y={30 + (i % 2) * 4} width="7" height="6" fill={P.window} stroke={P.woodLight} strokeWidth=".8" />
              <rect x={x + 24} y={30 + (i % 2) * 4} width="7" height="6" fill={P.window} stroke={P.woodLight} strokeWidth=".8" />
              <rect x={x + 30} y={4 + (i % 2) * 4} width="5" height="10" fill={P.paper} />
            </g>
          ))}
          <path d="M120 22 h18 M300 16 h10" stroke={P.white} strokeWidth="3" strokeLinecap="round" opacity=".8" />
        </g>
      ) : null}
      {spec.bulbFields ? (
        <g>
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M0 ${34 + i * 1.8}H400`} stroke={[P.red, P.yellow, P.plum, P.white, P.orange, P.pink, P.red, P.yellow][i]} strokeWidth="1.8" />
          ))}
          {[300].map((x) => (
            <g key={x} transform={`translate(${x} 34) scale(.8)`}>
              <path d="M-7 0L-4 -22H4L7 0z" fill={P.charcoal} />
              <path d="M-5 -22Q0 -28 5 -22z" fill={P.woodLight} />
              <path d="M-16 -40L16 -8M16 -40L-16 -8" stroke={P.white} strokeWidth="3" />
            </g>
          ))}
          <rect x="170" y="22" width="60" height="12" fill={P.terracotta} />
          <path d="M166 22 L200 10 L234 22z" fill={P.charcoal} />
        </g>
      ) : null}
      {spec.lagoon ? (
        <g>
          <rect x="0" y="30" width="400" height="18" fill={P.water} />
          <path d="M20 36h40M140 40h50M280 38h60" stroke={P.waterLight} strokeWidth="1.4" />
          <g fill={P.stoneLight} opacity=".9">
            <rect x="150" y="18" width="110" height="12" />
            <rect x="196" y="-6" width="8" height="24" fill={P.terracottaLight} />
            <path d="M195 -6 L200 -16 L205 -6z" fill={P.leafMoss} />
            <path d="M220 18 a10 10 0 0 1 20 0z" />
            <path d="M236 18 a7 7 0 0 1 14 0z" />
            <path d="M158 18 a8 8 0 0 1 16 0z" />
          </g>
          {[40, 90, 330].map((x) => (
            <path key={x} d={`M${x - 1.2} 46l.4 -12M${x} 46v-13M${x + 1.2} 46l-.4 -12`} stroke={P.woodDark} strokeWidth="1.2" />
          ))}
        </g>
      ) : null}
      {spec.swedishWoods ? (
        <g>
          <rect x="140" y="34" width="120" height="12" fill={P.waterDeep} opacity=".85" />
          {Array.from({ length: 22 }, (_, i) => {
            const x = i * 19 - 4
            if (x > 130 && x < 262) return null
            const h = 24 + ((i * 7) % 14)
            return <path key={i} d={`M${x} 48 L${x + 7} ${48 - h} L${x + 14} 48z`} fill={i % 2 ? P.leafDark : P.leafMoss} />
          })}
          <rect x="270" y="30" width="26" height="16" fill={P.barn} />
          <path d="M266 30 L283 20 L300 30z" fill={P.charcoal} />
          <path d="M270 30v16M296 30v16" stroke={P.white} strokeWidth="1.6" />
        </g>
      ) : null}
    </>
  )
}
