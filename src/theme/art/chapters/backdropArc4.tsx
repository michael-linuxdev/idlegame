/**
 * Kulissen Bogen IV „Saatgut für morgen“ (Kapitel 40–49). Wird von
 * backdrop.tsx aufgerufen: `GroundExtrasArc4` in der gestreckten
 * 100×100-Boden-SVG (Deko klein halten), `HorizonExtrasArc4` im Horizont.
 */
import type { BackdropSpec } from '../../chapterArtSpecs'
import { P } from '../palette'

const CORNERS: [number, number][] = [
  [5, 44],
  [95, 42],
  [6, 74],
  [94, 72],
]

export function GroundExtrasArc4({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.rooftop
        ? CORNERS.map(([x, y], i) => (
            <g key={`rt${i}`}>
              <rect x={x - 1.4} y={y - 1} width="2.8" height="1.4" fill={P.stoneLight} stroke={P.stoneDark} strokeWidth=".8" vectorEffect="non-scaling-stroke" />
              <ellipse cx={x + (i % 2 ? -2.4 : 2.4)} cy={y + 0.4} rx="1.2" ry=".5" fill={i % 2 ? P.yellow : P.leafLight} />
            </g>
          ))
        : null}
      {spec.schoolyard
        ? CORNERS.map(([x, y], i) => (
            <g key={`sy${i}`}>
              <ellipse cx={x} cy={y} rx="1.6" ry=".7" fill={P.soil} />
              {[-0.6, 0.6].map((d, k) => (
                <ellipse key={d} cx={x + d} cy={y - 0.3} rx=".35" ry=".25" fill={(i + k) % 2 ? P.red : P.leaf} />
              ))}
            </g>
          ))
        : null}
      {spec.forestGarden
        ? CORNERS.map(([x, y], i) => (
            <g key={`fg${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.leafDark} />
              <ellipse cx={x + (i % 2 ? -1.4 : 1.4)} cy={y + 0.2} rx=".5" ry=".3" fill={P.woodMid} />
            </g>
          ))
        : null}
      {spec.seedBank
        ? CORNERS.map(([x, y], i) => (
            <g key={`sb${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.soil} />
              <path d={`M${x - 0.8} ${y}v-1.6M${x + 0.8} ${y}v-1.6`} stroke={P.white} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
      {spec.climateGarden
        ? CORNERS.map(([x, y], i) => (
            <g key={`cg${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.water} opacity=".7" />
              <ellipse cx={x + (i % 2 ? -1.8 : 1.8)} cy={y + 0.2} rx=".7" ry=".4" fill={P.stone} />
            </g>
          ))
        : null}
    </>
  )
}

export function HorizonExtrasArc4({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.rooftop ? (
        <g>
          {[0, 40, 70, 120, 250, 290, 336, 370].map((x, i) => (
            <g key={x}>
              <rect x={x} y={10 + (i % 3) * 6} width={[36, 28, 46, 30, 38, 42, 30, 30][i]} height={50} fill={[P.stoneLight, P.paper, P.stone, P.canvas][i % 4]} />
              {Array.from({ length: 6 }, (_, k) => (
                <rect key={k} x={x + 5 + (k % 3) * 9} y={16 + (i % 3) * 6 + Math.floor(k / 3) * 10} width="5" height="6" fill={P.window} stroke={P.stoneDark} strokeWidth=".6" />
              ))}
            </g>
          ))}
          {[170, 220].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 48V${6 + i * 4}`} stroke={P.yellow} strokeWidth="3" />
              <path d={`M${x - 20} ${8 + i * 4}H${x + 40}`} stroke={P.yellow} strokeWidth="2.4" />
              <path d={`M${x} ${2 + i * 4}L${x - 20} ${8 + i * 4}M${x} ${2 + i * 4}L${x + 40} ${8 + i * 4}`} stroke={P.metal} strokeWidth=".8" />
              <rect x={x - 22} y={8 + i * 4} width="6" height="4" fill={P.charcoal} />
            </g>
          ))}
          <rect x="0" y="48" width="400" height="12" fill={P.stoneDark} />
          <path d="M0 48H400" stroke={P.stoneLight} strokeWidth="2" />
        </g>
      ) : null}
      {spec.schoolyard ? (
        <g>
          <rect x="120" y="14" width="160" height="34" fill={P.terracottaLight} />
          <path d="M114 16 L200 0 L286 16z" fill={P.roof} />
          <circle cx="200" cy="9" r="4" fill={P.white} stroke={P.charcoal} strokeWidth="1" />
          <path d="M200 9V6.6M200 9h2" stroke={P.charcoal} strokeWidth=".8" />
          {Array.from({ length: 12 }, (_, k) => (
            <rect key={k} x={128 + (k % 6) * 25} y={20 + Math.floor(k / 6) * 13} width="16" height="9" fill={P.window} stroke={P.white} strokeWidth="1.2" />
          ))}
          <rect x="192" y="34" width="16" height="14" fill={P.woodDark} />
          <path d="M40 48V24L56 20L72 24V48M40 24H72" stroke={P.blue} strokeWidth="2" fill="none" />
          <path d="M50 24v14M62 24v14" stroke={P.charcoal} strokeWidth=".6" />
          <rect x="47" y="38" width="6" height="1.6" fill={P.red} />
          <rect x="59" y="38" width="6" height="1.6" fill={P.yellow} />
          {Array.from({ length: 20 }, (_, k) => (
            <path key={k} d={`M${300 + k * 5} 48v-8`} stroke={P.leafDark} strokeWidth="1.2" />
          ))}
          <path d="M300 42H400" stroke={P.leafDark} strokeWidth="1.2" />
          {[90, 340].map((x) => (
            <g key={x}>
              <path d={`M${x} 48V30`} stroke={P.bark} strokeWidth="3" />
              <circle cx={x} cy="24" r="12" fill={P.leafDark} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.forestGarden ? (
        <g>
          {Array.from({ length: 16 }, (_, i) => {
            const x = 6 + i * 26
            const c = [P.leafDark, P.leaf, P.leafMoss, P.winterLeafDark][i % 4]
            return (
              <g key={i}>
                <path d={`M${x} 48V${30 - (i % 3) * 4}`} stroke={P.bark} strokeWidth="2.4" />
                <ellipse cx={x} cy={22 - (i % 3) * 4} rx={14 + (i % 2) * 3} ry={12 + (i % 3) * 2} fill={c} />
              </g>
            )
          })}
          {Array.from({ length: 10 }, (_, i) => (
            <g key={`n${i}`}>
              <path d={`M${150 + i * 10} 50V42`} stroke={P.bark} strokeWidth="1" />
              <ellipse cx={150 + i * 10} cy="39" rx="3.4" ry="4" fill={i % 2 ? P.leafLight : P.leaf} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.seedBank ? (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M0 ${40 + i * 2}H400`} stroke={[P.leaf, P.yellow, P.leafDark, P.lilac, P.leafLight, P.gold][i]} strokeWidth="1.6" opacity=".8" />
          ))}
          <rect x="130" y="20" width="140" height="26" fill={P.cream} />
          <rect x="126" y="16" width="148" height="5" fill={P.leafLight} />
          <rect x="136" y="24" width="128" height="12" fill={P.glass} stroke={P.metal} strokeWidth="1" />
          {Array.from({ length: 8 }, (_, k) => (
            <path key={k} d={`M${152 + k * 16} 24v12`} stroke={P.metal} strokeWidth="1" />
          ))}
          {[40, 74, 300, 334].map((x) => (
            <g key={x}>
              <rect x={x} y="28" width="26" height="18" fill={P.white} opacity=".8" stroke={P.stoneLight} strokeWidth="1" />
              <path d={`M${x} 28 L${x + 13} 22 L${x + 26} 28`} fill={P.white} stroke={P.stoneLight} strokeWidth="1" />
            </g>
          ))}
        </g>
      ) : null}
      {spec.climateGarden ? (
        <g>
          {[30, 70, 110, 150, 240, 280, 320, 360].map((x, i) => (
            <rect key={x} x={x} y={12 + (i % 3) * 7} width="30" height="30" fill={[P.stoneLight, P.paper, P.canvas][i % 3]} opacity=".9" />
          ))}
          <path d="M0 40 Q100 34 200 40 T400 38 V50 H0z" fill={P.water} />
          <path d="M20 44h30M120 42h40M250 44h30M330 42h36" stroke={P.waterLight} strokeWidth="1.4" />
          <path d="M170 42 Q200 26 230 42" stroke={P.metal} strokeWidth="2.4" fill="none" />
          <path d="M176 38v4M188 32v10M200 30v12M212 32v10M224 38v4" stroke={P.metal} strokeWidth=".8" />
          {[10, 60, 340, 390].map((x) => (
            <g key={x}>
              <path d={`M${x} 52V40`} stroke={P.bark} strokeWidth="2" />
              <ellipse cx={x} cy="34" rx="10" ry="9" fill={P.leafDark} />
            </g>
          ))}
        </g>
      ) : null}
    </>
  )
}
