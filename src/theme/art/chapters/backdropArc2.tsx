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
      {spec.andalusia
        ? CORNERS.map(([x, y], i) => (
            <g key={`an${i}`}>
              <path d={`M${x - 1.2} ${y - 0.6}h2.4l-.4 1.4h-1.6z`} fill={P.terracotta} />
              <ellipse cx={x} cy={y - 0.9} rx="1.4" ry=".5" fill={P.leafDark} />
              {[-0.6, 0.6].map((d) => (
                <ellipse key={d} cx={x + d} cy={y - 1.2} rx=".35" ry=".25" fill={i % 2 ? P.red : P.pink} />
              ))}
            </g>
          ))
        : null}
      {spec.montado
        ? CORNERS.map(([x, y], i) => (
            <g key={`mo${i}`}>
              <ellipse cx={x} cy={y} rx="2" ry=".8" fill={P.leafDark} opacity=".8" />
              <ellipse cx={x - 0.4} cy={y - 0.2} rx="1" ry=".35" fill={P.leaf} opacity=".7" />
              {[0, 1].map((k) => (
                <ellipse key={k} cx={x + 1.4 + k * 0.6} cy={y + 0.8} rx=".2" ry=".15" fill={P.woodDark} />
              ))}
            </g>
          ))
        : null}
      {spec.kalocsa
        ? CORNERS.map(([x, y], i) => (
            <g key={`ka${i}`}>
              <ellipse cx={x} cy={y} rx="1.6" ry=".7" fill={P.leafDark} />
              {[-0.8, 0, 0.8].map((d) => (
                <ellipse key={d} cx={x + d} cy={y + 0.4} rx=".22" ry=".4" fill={i % 2 ? P.tomato : P.berry} />
              ))}
            </g>
          ))
        : null}
      {spec.aran
        ? CORNERS.map(([x, y], i) => (
            <g key={`ar${i}`}>
              {[-1.4, -0.4, 0.6, 1.6].map((d, k) => (
                <ellipse key={d} cx={x + d} cy={y} rx=".45" ry=".3" fill={(i + k) % 2 ? P.stone : P.stoneLight} />
              ))}
              <ellipse cx={x} cy={y + 0.8} rx=".3" ry=".2" fill={P.blue} />
            </g>
          ))
        : null}
      {spec.roseValley
        ? CORNERS.map(([x, y], i) => (
            <g key={`rv${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.leafDark} />
              {[-1, 0, 1].map((d) => (
                <ellipse key={d} cx={x + d} cy={y - 0.4} rx=".35" ry=".25" fill={i % 2 ? P.pink : P.blossom} />
              ))}
            </g>
          ))
        : null}
      {spec.aegina
        ? CORNERS.map(([x, y], i) => (
            <g key={`ae${i}`}>
              <ellipse cx={x} cy={y} rx="1.2" ry=".5" fill={P.stone} />
              {[-1.4, 1.2].map((d) => (
                <ellipse key={d} cx={x + d} cy={y + 0.2} rx=".5" ry=".3" fill={i % 2 ? P.lavender : P.winterLeafDark} />
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
      {spec.andalusia ? (
        <g>
          {[[60, 18], [120, 22], [280, 20], [340, 16]].map(([x, y]) => (
            <g key={x}>
              <rect x={x} y={y} width="44" height={44 - y!} fill={P.white} />
              <path d={`M${x! - 3} ${y} L${x! + 22} ${y! - 8} L${x! + 47} ${y}z`} fill={P.terracotta} />
            </g>
          ))}
          <rect x="190" y="-2" width="16" height="46" fill={P.paper} />
          <rect x="188" y="8" width="20" height="5" fill={P.canvas} />
          <path d="M192 -2 L198 -12 L204 -2z" fill={P.terracotta} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M${193 + k * 4} 22 v6 a2 2 0 0 1 2 0 v-6z`} fill={P.charcoal} opacity=".6" />
          ))}
          <path d="M240 44 V16" stroke={P.bark} strokeWidth="2" />
          <path d="M240 16 q-10 -2 -16 6 M240 16 q10 -2 16 6 M240 16 q-6 -8 -14 -8 M240 16 q6 -8 14 -8" stroke={P.leafDark} strokeWidth="3" fill="none" />
          <rect x="0" y="36" width="400" height="24" fill={P.white} />
          {Array.from({ length: 16 }, (_, i) => (
            <path key={i} d={`M${6 + i * 25} 60 V46 a8 8 0 0 1 16 0 V60z`} fill={P.charcoal} opacity=".22" />
          ))}
          <path d="M0 36 H400" stroke={P.terracotta} strokeWidth="2.4" />
          {Array.from({ length: 40 }, (_, i) => (
            <rect key={`t${i}`} x={i * 10} y="56" width="5" height="4" fill={i % 2 ? P.blue : P.denim} />
          ))}
        </g>
      ) : null}
      {spec.montado ? (
        <g>
          {Array.from({ length: 12 }, (_, i) => {
            const x = 14 + i * 34 + (i % 3) * 6
            const y = 34 + (i % 3) * 5
            return (
              <g key={i}>
                <path d={`M${x} ${y + 8}V${y}`} stroke={P.bark} strokeWidth="1.6" />
                <ellipse cx={x} cy={y - 2} rx="12" ry="6" fill={i % 2 ? P.leafDark : P.leafMoss} />
              </g>
            )
          })}
          <rect x="180" y="22" width="44" height="18" fill={P.white} />
          <path d="M180 38 H224 M180 22 V40 M224 22 V40" stroke={P.blue} strokeWidth="2" />
          <path d="M177 22 L202 14 L227 22z" fill={P.terracotta} />
          <rect x="214" y="8" width="8" height="12" fill={P.white} />
          {[110, 300].map((x) => (
            <g key={x}>
              <path d={`M${x - 5} 48 L${x} 6 L${x + 5} 48 M${x - 10} 12 H${x + 10}`} stroke={P.metal} strokeWidth="1.4" fill="none" />
              <ellipse cx={x} cy="5" rx="6" ry="2" fill={P.woodMid} />
              <path d={`M${x + 1} 4 v-6`} stroke={P.white} strokeWidth="2.6" />
            </g>
          ))}
        </g>
      ) : null}
      {spec.kalocsa ? (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M0 ${40 + i * 3}H400`} stroke={i % 2 ? P.tomato : P.leafDark} strokeWidth="2" opacity=".75" />
          ))}
          {[184, 216].map((x) => (
            <g key={x}>
              <rect x={x - 6} y="0" width="12" height="38" fill={P.paper} />
              <path d={`M${x - 6} 0 Q${x} -10 ${x + 6} 0z`} fill={P.leafMoss} />
              <rect x={x - 2} y="10" width="4" height="7" fill={P.charcoal} opacity=".5" />
            </g>
          ))}
          <rect x="178" y="22" width="44" height="16" fill={P.paper} />
          <path d="M60 38 V8 M40 4 L100 22 M98 22 V30" stroke={P.woodDark} strokeWidth="2" />
          <rect x="300" y="24" width="40" height="14" fill={P.white} />
          <path d="M296 25 Q320 4 344 25z" fill={P.woodLight} />
          {[308, 316, 324].map((x) => (
            <path key={x} d={`M${x} 25 v10`} stroke={P.tomato} strokeWidth="2.4" />
          ))}
        </g>
      ) : null}
      {spec.aran ? (
        <g>
          <rect x="0" y="22" width="400" height="16" fill={P.waterDeep} />
          <path d="M20 28h30M120 32h40M240 26h26" stroke={P.waterLight} strokeWidth="1.4" />
          <path d="M300 38 L310 16 L400 12 V38z" fill={P.stone} />
          <path d="M300 38 L310 16" stroke={P.white} strokeWidth="2" />
          <path d="M340 16 a20 10 0 0 1 40 0" stroke={P.stoneLight} strokeWidth="4" fill="none" />
          {Array.from({ length: 7 }, (_, i) => (
            <path key={i} d={`M${i * 44} 48 Q${i * 44 + 22} 42 ${i * 44 + 44} 48`} stroke={P.stoneLight} strokeWidth="2" strokeDasharray="3 1.4" fill="none" />
          ))}
          <path d="M0 42 H400" stroke={P.stoneLight} strokeWidth="2" strokeDasharray="3 1.4" />
          <rect x="150" y="30" width="30" height="12" fill={P.white} />
          <path d="M146 31 Q165 16 184 31z" fill={P.woodLight} />
        </g>
      ) : null}
      {spec.roseValley ? (
        <g>
          <path d="M0 44 L40 14 L80 28 L130 4 L190 26 L240 8 L300 30 L350 10 L400 24 V44z" fill={spec.hills[1]} />
          <path d="M124 9 L130 4 L136 9 M234 13 L240 8 L246 13 M344 15 L350 10 L356 15" stroke={P.white} strokeWidth="3" fill="none" />
          {[150, 172, 194, 216].map((x, i) => (
            <g key={x}>
              <rect x={x} y={30 + (i % 2) * 3} width="18" height={14 - (i % 2) * 3} fill={P.white} />
              <path d={`M${x - 2} ${30 + (i % 2) * 3} L${x + 9} ${24 + (i % 2) * 3} L${x + 20} ${30 + (i % 2) * 3}z`} fill={P.terracotta} />
            </g>
          ))}
          <path d="M262 30 a6 6 0 0 1 12 0z" fill={P.gold} />
          <rect x="262" y="30" width="12" height="14" fill={P.white} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M0 ${46 + i * 2.4}H400`} stroke={i % 2 ? P.pink : P.leafDark} strokeWidth="1.6" opacity=".8" />
          ))}
        </g>
      ) : null}
      {spec.aegina ? (
        <g>
          <rect x="0" y="24" width="400" height="22" fill={P.water} />
          <path d="M40 34h30M160 40h40M300 30h30" stroke={P.waterLight} strokeWidth="1.2" />
          <path d="M120 26 Q150 12 190 26z M240 26 Q260 18 290 26z" fill={P.stone} opacity=".7" />
          <path d="M0 46 L0 22 Q30 6 70 20 L90 46z" fill={P.woodLight} />
          <rect x="20" y="8" width="36" height="3" fill={P.paper} />
          {[22, 30, 38, 46, 54].map((x) => (
            <rect key={x} x={x} y="11" width="2.4" height="9" fill={P.paper} />
          ))}
          {[310, 330, 350, 370].map((x, i) => (
            <rect key={x} x={x} y={34 - (i % 2) * 4} width="16" height={12 + (i % 2) * 4} fill={P.white} />
          ))}
          <path d="M376 26 a5 5 0 0 1 10 0z" fill={P.blue} />
          <rect x="376" y="26" width="10" height="8" fill={P.white} />
        </g>
      ) : null}
    </>
  )
}
