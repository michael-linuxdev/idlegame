/**
 * Kulissen Bogen III „Wo die Samen herkommen“ (Kapitel 30–39). Wird von
 * backdrop.tsx aufgerufen: `GroundExtrasArc3` in der gestreckten
 * 100×100-Boden-SVG (Deko klein halten), `HorizonExtrasArc3` im Horizont.
 */
import type { BackdropSpec } from '../../chapterArtSpecs'
import { P } from '../palette'

const CORNERS: [number, number][] = [
  [5, 44],
  [95, 42],
  [6, 74],
  [94, 72],
]

export function GroundExtrasArc3({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.andes
        ? CORNERS.map(([x, y], i) => (
            <g key={`ad${i}`}>
              <ellipse cx={x} cy={y} rx="1.4" ry=".6" fill={P.stone} />
              <ellipse cx={x + (i % 2 ? -1.6 : 1.6)} cy={y + 0.2} rx="1" ry=".5" fill={P.woodLight} />
            </g>
          ))
        : null}
      {spec.milpaHills
        ? CORNERS.map(([x, y], i) => (
            <g key={`mi${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.winterLeafDark} />
              <ellipse cx={x + (i % 2 ? -1 : 1)} cy={y + 0.2} rx=".6" ry=".35" fill={P.orange} />
            </g>
          ))
        : null}
      {spec.coffeeForest
        ? CORNERS.map(([x, y], i) => (
            <g key={`cf${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.leafDark} />
              {[-0.6, 0.4].map((d) => (
                <ellipse key={d} cx={x + d} cy={y - 0.3} rx=".25" ry=".18" fill={i % 2 ? P.berry : P.white} />
              ))}
            </g>
          ))
        : null}
      {spec.bali
        ? CORNERS.map(([x, y], i) => (
            <g key={`ba${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".6" fill={P.water} opacity=".8" />
              <path d={`M${x - 1} ${y}v-1.4M${x} ${y}v-1.8M${x + 1} ${y}v-1.4`} stroke={P.leafDark} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
      {spec.kerala
        ? CORNERS.map(([x, y], i) => (
            <g key={`ke${i}`}>
              <ellipse cx={x} cy={y} rx="1.6" ry=".7" fill={P.terracotta} />
              {[-0.8, 0, 0.8].map((d, k) => (
                <ellipse key={d} cx={x + d} cy={y - 0.3} rx=".3" ry=".2" fill={[P.orange, P.yellow, P.berry][(i + k) % 3]} />
              ))}
            </g>
          ))
        : null}
      {spec.oasis
        ? CORNERS.map(([x, y], i) => (
            <g key={`oa${i}`}>
              <ellipse cx={x} cy={y} rx="2" ry=".7" fill={P.woodLight} />
              <path d={`M${x} ${y}l-1.4 -1.6M${x} ${y}l1.4 -1.6M${x} ${y}v-2`} stroke={P.leafDark} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
      {spec.cocoaFarm
        ? CORNERS.map(([x, y], i) => (
            <g key={`co${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.leafDark} />
              <ellipse cx={x + (i % 2 ? -0.6 : 0.6)} cy={y - 0.2} rx=".35" ry=".25" fill={i % 2 ? P.gold : P.berry} />
            </g>
          ))
        : null}
      {spec.bush
        ? CORNERS.map(([x, y], i) => (
            <g key={`bu${i}`}>
              <ellipse cx={x} cy={y} rx="1.6" ry=".6" fill={P.terracottaLight} />
              <ellipse cx={x + (i % 2 ? -1.4 : 1.4)} cy={y + 0.1} rx="1" ry=".5" fill={P.gold} />
            </g>
          ))
        : null}
      {spec.fernForest
        ? CORNERS.map(([x, y], i) => (
            <g key={`fe${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.leafMoss} />
              <path d={`M${x} ${y}l-1.6 -1.2M${x} ${y}l1.6 -1.2M${x} ${y}v-1.6`} stroke={P.leafDark} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            </g>
          ))
        : null}
      {spec.korea
        ? CORNERS.map(([x, y], i) => (
            <g key={`kr${i}`}>
              <ellipse cx={x} cy={y} rx="1.2" ry=".8" fill={P.soilDark} />
              <ellipse cx={x} cy={y - 0.6} rx="1" ry=".3" fill={P.compost} />
              <ellipse cx={x + (i % 2 ? -1.6 : 1.6)} cy={y + 0.2} rx=".7" ry=".4" fill={P.leafPale} />
            </g>
          ))
        : null}
    </>
  )
}

export function HorizonExtrasArc3({ spec }: { spec: BackdropSpec }) {
  return (
    <>
      {spec.andes ? (
        <g>
          <path d="M0 44 L50 6 L90 26 L150 0 L210 30 L260 4 L320 28 L370 8 L400 20 V44z" fill={spec.hills[1]} />
          <path d="M40 14 L50 6 L62 15 L56 13 L50 17z M138 9 L150 0 L162 10 L155 8 L150 12z M248 13 L260 4 L272 14 L265 11 L260 15z M360 15 L370 8 L380 16 L374 14z" fill={P.white} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${20 + i * 64} ${44 - (i % 2) * 4} Q${52 + i * 64} ${38 - (i % 2) * 4} ${84 + i * 64} ${44 - (i % 2) * 4}`} stroke={P.stoneDark} strokeWidth="2" strokeDasharray="3 1" fill="none" />
          ))}
          {[160, 182, 230].map((x, i) => (
            <g key={x}>
              <rect x={x} y={34 + (i % 2) * 3} width="16" height="10" fill={P.terracottaLight} />
              <path d={`M${x - 2} ${34 + (i % 2) * 3} L${x + 8} ${27 + (i % 2) * 3} L${x + 18} ${34 + (i % 2) * 3}z`} fill={i === 1 ? P.woodLight : P.terracotta} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.milpaHills ? (
        <g>
          <path d="M240 44 L290 8 Q300 2 310 8 L360 44z" fill={spec.hills[1]} />
          <path d="M60 44 Q110 14 160 44z" fill={spec.hills[0]} opacity=".9" />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M0 ${44 + i * 2.2}H400`} stroke={i % 2 ? P.yellow : P.leafDark} strokeWidth="1.6" opacity=".8" />
          ))}
          <rect x="186" y="12" width="12" height="32" fill={P.white} />
          <path d="M186 12 Q192 2 198 12z" fill={P.terracottaLight} />
          <rect x="198" y="26" width="30" height="18" fill={P.white} />
          <path d="M210 44v-8a3 3 0 0 1 6 0v8z" fill={P.woodDark} />
          {[30, 50, 340, 362, 384].map((x) => (
            <path key={x} d={`M${x - 6} 44 L${x} 34 L${x + 6} 44 M${x} 44 L${x - 9} 38 M${x} 44 L${x + 9} 38`} stroke={P.winterLeafDark} strokeWidth="2" fill="none" />
          ))}
        </g>
      ) : null}
      {spec.coffeeForest ? (
        <g>
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cx={i * 30 + (i % 2) * 8} cy={34 - (i % 3) * 4} rx="22" ry="12" fill={i % 2 ? P.leafDark : P.leafMoss} />
          ))}
          {[70, 250, 350].map((x) => (
            <g key={x}>
              <path d={`M${x} 46 V8`} stroke={P.bark} strokeWidth="2.4" />
              <ellipse cx={x} cy="8" rx="26" ry="7" fill={P.leafDark} />
              <ellipse cx={x + 6} cy="5" rx="16" ry="5" fill={P.leaf} />
            </g>
          ))}
          {[160, 200].map((x, i) => (
            <g key={x}>
              <rect x={x - 9} y={36 + i * 2} width="18" height="10" fill={P.woodLight} />
              <path d={`M${x - 12} ${37 + i * 2} L${x} ${22 + i * 2} L${x + 12} ${37 + i * 2}z`} fill={P.woodMid} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.bali ? (
        <g>
          <path d="M120 44 L190 6 Q200 0 210 6 L280 44z" fill={spec.hills[1]} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M0 ${30 + i * 3} Q100 ${26 + i * 3} 200 ${31 + i * 3} T400 ${29 + i * 3}`} stroke={i % 2 ? P.leaf : P.leafLight} strokeWidth="3" fill="none" />
          ))}
          {[30, 60, 340, 372].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 46 Q${x + (i % 2 ? 3 : -3)} 30 ${x} 14`} stroke={P.bark} strokeWidth="2" fill="none" />
              <path d={`M${x} 14 q-10 -2 -14 6 M${x} 14 q10 -2 14 6 M${x} 14 q-6 -8 -12 -8 M${x} 14 q6 -8 12 -8`} stroke={P.leafDark} strokeWidth="3" fill="none" />
            </g>
          ))}
          {[296, 310].map((x, i) => (
            <g key={x}>
              <rect x={x - 1} y={30 - i * 2} width="2" height={16 + i * 2} fill={P.woodDark} />
              {[0, 1, 2, 3].map((k) => (
                <path key={k} d={`M${x - 7 + k * 1.4} ${30 - i * 2 - k * 4} L${x} ${26 - i * 2 - k * 4} L${x + 7 - k * 1.4} ${30 - i * 2 - k * 4}z`} fill={P.charcoal} />
              ))}
            </g>
          ))}
        </g>
      ) : null}
      {spec.kerala ? (
        <g>
          <path d="M0 40 Q60 10 120 30 T240 22 T400 28 V44 H0z" fill={spec.hills[0]} />
          <rect x="0" y="40" width="400" height="8" fill={P.water} />
          <path d="M30 44h30M180 43h40M320 45h26" stroke={P.waterLight} strokeWidth="1.2" />
          {[20, 90, 130, 290, 360].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 42 Q${x + (i % 2 ? 3 : -3)} 26 ${x} 12`} stroke={P.bark} strokeWidth="2" fill="none" />
              <path d={`M${x} 12 q-10 -2 -14 6 M${x} 12 q10 -2 14 6 M${x} 12 q-6 -8 -12 -8 M${x} 12 q6 -8 12 -8`} stroke={P.leafDark} strokeWidth="3" fill="none" />
            </g>
          ))}
          {[180, 214].map((x) => (
            <g key={x}>
              <rect x={x} y="28" width="26" height="12" fill={P.cream} />
              <path d={`M${x - 4} 29 L${x + 4} 20 H${x + 22} L${x + 30} 29z`} fill={P.terracotta} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.oasis ? (
        <g>
          <path d="M0 34 L40 14 L70 24 L110 6 L150 22 L200 10 L250 24 L300 4 L340 20 L400 12 V44 H0z" fill={spec.hills[1]} />
          <path d="M100 10 L110 6 L120 11 L114 10 L110 13z M290 8 L300 4 L310 9 L304 8 L300 11z M190 13 L200 10 L210 14 L204 13z" fill={P.white} />
          <path d="M0 44 Q50 30 100 40 T200 38 T300 36 T400 40 V48 H0z" fill={spec.hills[0]} />
          {[160, 184, 212].map((x, i) => (
            <g key={x}>
              <rect x={x} y={28 + (i % 2) * 3} width="18" height={16 - (i % 2) * 3} fill={P.terracottaLight} />
              <path d={`M${x} ${28 + (i % 2) * 3}h18`} stroke={P.terracotta} strokeWidth="2" strokeDasharray="3 2" />
            </g>
          ))}
          {[20, 44, 70, 300, 330, 356, 384].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 46 Q${x + (i % 2 ? 2 : -2)} 32 ${x} ${20 + (i % 3) * 3}`} stroke={P.woodMid} strokeWidth="2" fill="none" />
              <path d={`M${x} ${20 + (i % 3) * 3} q-9 -2 -12 6 M${x} ${20 + (i % 3) * 3} q9 -2 12 6 M${x} ${20 + (i % 3) * 3} q-5 -7 -10 -7 M${x} ${20 + (i % 3) * 3} q5 -7 10 -7`} stroke={P.leafDark} strokeWidth="3" fill="none" />
            </g>
          ))}
        </g>
      ) : null}
      {spec.cocoaFarm ? (
        <g>
          {Array.from({ length: 14 }, (_, i) => (
            <ellipse key={i} cx={i * 30 + (i % 2) * 8} cy={36 - (i % 3) * 4} rx="22" ry="12" fill={i % 2 ? P.leafDark : P.leafMoss} />
          ))}
          {[60, 240, 360].map((x) => (
            <g key={x}>
              <path d={`M${x} 46 V6`} stroke={P.stone} strokeWidth="3" />
              <path d={`M${x} 14 l-14 -4 M${x} 10 l12 -4`} stroke={P.stone} strokeWidth="1.6" />
              <ellipse cx={x - 10} cy="8" rx="14" ry="5" fill={P.leafDark} />
              <ellipse cx={x + 10} cy="5" rx="14" ry="5" fill={P.leaf} />
            </g>
          ))}
          {[150, 176, 204].map((x, i) => (
            <g key={x}>
              <rect x={x} y={34 + (i % 2) * 2} width="20" height="10" fill={P.cream} />
              <path d={`M${x - 2} ${35 + (i % 2) * 2} L${x + 10} ${28 + (i % 2) * 2} L${x + 22} ${35 + (i % 2) * 2}z`} fill={i === 1 ? P.terracotta : P.stoneLight} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.bush ? (
        <g>
          <path d="M0 30 L60 28 L80 18 L180 16 L200 26 L260 24 L280 14 L400 16 V44 H0z" fill={spec.hills[0]} />
          <path d="M80 18 L180 16 L184 22 L84 24z M280 14 L400 16 V20 L284 20z" fill={P.terracottaLight} />
          <path d="M0 44 Q100 34 200 40 T400 38 V48 H0z" fill={P.gold} opacity=".7" />
          {[30, 110, 240, 330, 372].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 46 Q${x + (i % 2 ? 3 : -3)} 30 ${x + 1} 18`} stroke={P.cream} strokeWidth="2.4" fill="none" />
              <ellipse cx={x - 7} cy="20" rx="10" ry="5" fill={P.winterLeaf} />
              <ellipse cx={x + 8} cy="17" rx="10" ry="5" fill={P.winterLeafDark} />
            </g>
          ))}
          <rect x="170" y="32" width="26" height="12" fill={P.woodLight} />
          <path d="M166 33 h34 l-4 -6 h-26z" fill={P.stoneLight} />
          <rect x="204" y="30" width="12" height="14" fill={P.stoneLight} />
          <ellipse cx="210" cy="30" rx="6" ry="1.6" fill={P.stone} />
        </g>
      ) : null}
      {spec.fernForest ? (
        <g>
          <path d="M0 30 Q60 6 120 24 T240 14 T400 22 V44 H0z" fill={spec.hills[1]} />
          <path d="M0 40 Q80 22 160 34 T320 28 T400 34 V46 H0z" fill={spec.hills[0]} />
          <path d="M0 24 Q100 18 200 24 T400 22" stroke={P.white} strokeWidth="5" fill="none" opacity=".35" />
          {[24, 70, 140, 270, 320, 370].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 46 V${26 + (i % 2) * 4}`} stroke={P.bark} strokeWidth="2" />
              {[-12, -6, 6, 12].map((d) => (
                <path key={d} d={`M${x} ${26 + (i % 2) * 4} q${d / 2} -4 ${d} ${Math.abs(d) / 3}`} stroke={i % 2 ? P.leaf : P.leafDark} strokeWidth="2.4" fill="none" />
              ))}
            </g>
          ))}
          <g>
            <path d="M210 46 V8" stroke={P.stone} strokeWidth="4" />
            <ellipse cx="200" cy="8" rx="14" ry="5" fill={P.leafDark} />
            <ellipse cx="220" cy="6" rx="14" ry="5" fill={P.leafMoss} />
          </g>
        </g>
      ) : null}
      {spec.korea ? (
        <g>
          <path d="M0 26 Q50 2 100 20 Q150 0 210 18 Q270 2 320 16 Q360 6 400 14 V44 H0z" fill={spec.hills[1]} opacity=".85" />
          <path d="M0 36 Q70 14 140 30 Q210 16 280 30 Q340 18 400 28 V46 H0z" fill={spec.hills[0]} />
          {[150, 192].map((x) => (
            <g key={x}>
              <rect x={x} y="32" width="34" height="12" fill={P.cream} />
              <path d={`M${x - 6} 33 Q${x} 34 ${x + 4} 30 L${x + 17} 24 L${x + 30} 30 Q${x + 34} 34 ${x + 40} 33 Q${x + 17} 28 ${x - 6} 33z`} fill={P.charcoal} />
            </g>
          ))}
          {[40, 90, 300, 360].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 46 V30 M${x} 34 l-6 -4 M${x} 32 l6 -5`} stroke={P.bark} strokeWidth="2" fill="none" />
              <ellipse cx={x} cy="26" rx="11" ry="6" fill={i % 2 ? P.gold : P.leafDark} opacity=".9" />
              {[-5, 0, 5].map((d) => (
                <circle key={d} cx={x + d} cy={26 + (d % 2)} r="1.6" fill={P.orange} />
              ))}
            </g>
          ))}
        </g>
      ) : null}
    </>
  )
}
