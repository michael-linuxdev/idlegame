/**
 * Kulisse Finale (Kapitel 50, Omas Schrebergarten). Wird von backdrop.tsx
 * aufgerufen. Die Karte wächst mit der Kapitel-Stufe (angelegte Bereiche):
 * bei Stufe 0 überall Brombeeren wie an Omas erstem Tag, mit jeder Stufe
 * weicht eine Ranke Blumen, im Horizont kommen Nachbarlauben, die
 * Vereinsfahne und am Ende eine Lichterkette dazu — der Garten von heute.
 */
import type { BackdropSpec } from '../../chapterArtSpecs'
import { P } from '../palette'

/** Ränder der Karte (gestreckte 100×100-SVG: klein halten). */
const EDGE: [number, number][] = [
  [4, 40],
  [96, 38],
  [5, 52],
  [95, 50],
  [4, 64],
  [96, 62],
  [6, 78],
  [94, 76],
  [8, 92],
  [92, 90],
]

export function GroundExtrasFinale({ spec, stage }: { spec: BackdropSpec; stage: number }) {
  if (!spec.omaGarden) return null
  return (
    <g>
      {EDGE.map(([x, y], i) =>
        i >= stage ? (
          <g key={`br${i}`}>
            <ellipse cx={x} cy={y} rx="2.6" ry="1.3" fill={P.leafDark} />
            <ellipse cx={x + (i % 2 ? -1.2 : 1.2)} cy={y - 0.5} rx="1.4" ry=".8" fill={P.leafMoss} />
            <ellipse cx={x + (i % 2 ? 1 : -1)} cy={y + 0.2} rx=".35" ry=".25" fill={P.plum} />
          </g>
        ) : (
          <g key={`fl${i}`}>
            <ellipse cx={x} cy={y} rx="2" ry=".9" fill={P.leaf} />
            {[-1, 0, 1].map((d, k) => (
              <ellipse key={d} cx={x + d * 0.9} cy={y - 0.4} rx=".4" ry=".28" fill={[P.orange, P.lavender, P.yellow, P.pink][(i + k) % 4]} />
            ))}
          </g>
        ),
      )}
    </g>
  )
}

export function HorizonExtrasFinale({ spec, stage }: { spec: BackdropSpec; stage: number }) {
  if (!spec.omaGarden) return null
  const arbours = Math.min(5, 1 + Math.floor(stage / 2))
  const xs = [40, 330, 110, 260, 180]
  return (
    <g>
      {xs.slice(0, arbours).map((x, i) => (
        <g key={x}>
          <rect x={x - 12} y="20" width="24" height="16" fill={[P.wood, P.cream, P.leafLight, P.woodLight, P.paper][i]} />
          <path d={`M${x - 15} 20L${x} 10L${x + 15} 20z`} fill={[P.roof, P.leafDark, P.terracotta, P.roof, P.blue][i]} />
          <rect x={x - 7} y="24" width="6" height="5" fill={stage >= 8 ? P.lamp : P.window} />
          <path d={`M${x - 16} 36h32`} stroke={P.woodLight} strokeWidth="1.4" />
        </g>
      ))}
      {stage >= 5 ? (
        <g>
          <path d="M220 36V4" stroke={P.metal} strokeWidth="1.6" />
          <path d="M221 4h18l-4 5l4 5h-18z" fill={P.leaf} />
          <circle cx="228" cy="9" r="2" fill={P.yellow} />
        </g>
      ) : null}
      {stage >= 8
        ? [70, 150, 300, 370].map((x) => (
            <g key={`t${x}`}>
              <path d={`M${x} 36V22`} stroke={P.bark} strokeWidth="2" />
              <ellipse cx={x} cy="18" rx="10" ry="7" fill={P.leaf} />
              <circle cx={x - 3} cy="18" r="1.4" fill={P.red} />
              <circle cx={x + 4} cy="16" r="1.4" fill={P.red} />
            </g>
          ))
        : null}
      {stage >= 10 ? (
        <g>
          <path d="M20 8Q200 26 380 8" stroke={P.charcoal} strokeWidth=".6" fill="none" />
          {Array.from({ length: 18 }, (_, i) => {
            const x = 30 + i * 20
            const y = 8 + 18 * Math.sin(((x - 20) / 360) * Math.PI) * 0.5
            return <circle key={i} cx={x} cy={y + 1.6} r="1.6" fill={P.lamp} />
          })}
        </g>
      ) : null}
    </g>
  )
}
