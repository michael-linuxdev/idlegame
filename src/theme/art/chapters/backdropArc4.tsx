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
      {spec.wildflowerBand
        ? CORNERS.map(([x, y], i) => (
            <g key={`wb${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.leaf} />
              {[-0.8, 0, 0.8].map((d, k) => (
                <ellipse key={d} cx={x + d} cy={y - 0.5} rx=".35" ry=".25" fill={[P.red, P.blue, P.white][(i + k) % 3]} />
              ))}
            </g>
          ))
        : null}
      {spec.livingWall
        ? CORNERS.map(([x, y], i) => (
            <g key={`lw${i}`}>
              <rect x={x - 1.2} y={y - 1} width="2.4" height="1.2" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".6" vectorEffect="non-scaling-stroke" />
              <ellipse cx={x} cy={y - 1.2} rx="1.2" ry=".5" fill={i % 2 ? P.leafDark : P.leaf} />
            </g>
          ))
        : null}
      {spec.communityFarm
        ? CORNERS.map(([x, y], i) => (
            <g key={`cf${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".7" fill={P.soil} />
              <ellipse cx={x + (i % 2 ? -1.4 : 1.4)} cy={y - 0.3} rx=".5" ry=".35" fill={i % 2 ? P.orange : P.winterLeaf} />
            </g>
          ))
        : null}
      {spec.seedSwap
        ? CORNERS.map(([x, y], i) => (
            <g key={`ss${i}`}>
              <path d={`M${x} ${y}v-2.4`} stroke={P.woodDark} strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d={`M${x} ${y - 2.4}l1.4 .4l-1.4 .4z`} fill={[P.tomato, P.yellow, P.blue, P.cream][i]} />
            </g>
          ))
        : null}
      {spec.worldExpo
        ? CORNERS.map(([x, y], i) => (
            <g key={`we${i}`}>
              <ellipse cx={x} cy={y} rx="1.8" ry=".8" fill={P.soil} stroke={P.stone} strokeWidth=".8" vectorEffect="non-scaling-stroke" />
              {[-0.7, 0.7].map((d, k) => (
                <ellipse key={d} cx={x + d} cy={y - 0.3} rx=".4" ry=".3" fill={[P.red, P.yellow, P.pink, P.blue][(i + k) % 4]} />
              ))}
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
      {spec.wildflowerBand ? (
        <g>
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M0 ${42 + i * 2}H400`} stroke={[P.gold, P.leafLight, P.yellow, P.leaf, P.gold][i]} strokeWidth="1.8" opacity=".7" />
          ))}
          {[20, 34, 52, 330, 348, 366, 382].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 48V${30 - (i % 3) * 3}`} stroke={P.white} strokeWidth="1.6" />
              <path d={`M${x} ${36 - (i % 3) * 3}h.6M${x} ${40}h-.6`} stroke={P.charcoal} strokeWidth="1" />
              <ellipse cx={x} cy={26 - (i % 3) * 3} rx="6" ry="7" fill={i % 2 ? P.leafLight : P.leaf} />
            </g>
          ))}
          <path d="M140 46h120" stroke={P.charcoal} strokeWidth="4" />
          <path d="M150 34Q200 26 250 34v4H150z" fill={P.leaf} stroke={P.leafDark} strokeWidth="1" />
          <path d="M156 38v8M244 38v8" stroke={P.stone} strokeWidth="4" />
          {[160, 175, 190, 205, 220, 235].map((x, i) => (
            <circle key={x} cx={x} cy={32 - (i % 2)} r="1.6" fill={[P.red, P.blue, P.yellow][i % 3]} />
          ))}
        </g>
      ) : null}
      {spec.livingWall ? (
        <g>
          {[0, 46, 300, 350].map((x, i) => (
            <g key={x}>
              <rect x={x} y={6 + (i % 2) * 4} width="46" height="50" fill={[P.paper, P.stoneLight][i % 2]} />
              {Array.from({ length: 8 }, (_, k) => (
                <rect key={k} x={x + 5 + (k % 4) * 10} y={12 + (i % 2) * 4 + Math.floor(k / 4) * 14} width="6" height="8" fill={P.window} stroke={P.stoneDark} strokeWidth=".6" />
              ))}
            </g>
          ))}
          <rect x="140" y="2" width="120" height="56" fill={P.terracottaLight} />
          {Array.from({ length: 14 }, (_, k) => (
            <ellipse key={k} cx={146 + (k % 7) * 18} cy={14 + Math.floor(k / 7) * 22 + (k % 2) * 6} rx="11" ry="9" fill={[P.leaf, P.leafDark, P.leafMoss][k % 3]} />
          ))}
          {[110, 290].map((x) => (
            <g key={x}>
              <path d={`M${x} 52V36`} stroke={P.bark} strokeWidth="2" />
              <circle cx={x} cy="30" r="10" fill={P.leafDark} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.communityFarm ? (
        <g>
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M0 ${42 + i * 2}H400`} stroke={[P.soil, P.leaf, P.leafLight, P.soil, P.gold, P.leaf][i]} strokeWidth="1.6" opacity=".8" />
          ))}
          <rect x="40" y="22" width="56" height="22" fill={P.barn} />
          <path d="M36 22L68 6L100 22z" fill={P.roof} />
          <rect x="60" y="30" width="16" height="14" fill={P.woodDark} />
          <rect x="300" y="24" width="44" height="20" fill={P.cream} />
          <path d="M296 24L322 10L348 24z" fill={P.terracotta} />
          {[308, 330].map((x) => <rect key={x} x={x} y="30" width="7" height="6" fill={P.window} stroke={P.woodDark} strokeWidth=".6" />)}
          {[150, 200].map((x) => (
            <path key={x} d={`M${x} 44V36Q${x} 28 ${x + 8} 28H${x + 32}Q${x + 40} 28 ${x + 40} 36V44z`} fill={P.glass} opacity=".85" stroke={P.white} strokeWidth="1" />
          ))}
          {[10, 270, 380].map((x) => (
            <g key={x}>
              <path d={`M${x} 46V32`} stroke={P.bark} strokeWidth="2" />
              <circle cx={x} cy="26" r="9" fill={P.leafDark} />
            </g>
          ))}
        </g>
      ) : null}
      {spec.seedSwap ? (
        <g>
          <path d="M0 22Q100 32 200 22T400 22" stroke={P.charcoal} strokeWidth=".6" fill="none" />
          {Array.from({ length: 26 }, (_, i) => {
            const x = 8 + i * 15.4
            const y = 22 + 5 * Math.sin((x / 400) * Math.PI * 2) * -1 + 1
            return <path key={i} d={`M${x - 3} ${y}h6l-3 5z`} fill={[P.tomato, P.cream, P.blue, P.yellow, P.leafLight][i % 5]} />
          })}
          {[50, 120, 280, 350].map((x, i) => (
            <g key={x}>
              <rect x={x - 16} y="32" width="32" height="16" fill={[P.cream, P.paper][i % 2]} />
              <path d={`M${x - 19} 32L${x} 18L${x + 19} 32z`} fill={[P.tomato, P.blue, P.leaf, P.terracotta][i]} />
            </g>
          ))}
          <path d="M184 48V28H216V48M184 28Q200 16 216 28" stroke={P.woodDark} strokeWidth="2.4" fill="none" />
        </g>
      ) : null}
      {spec.worldExpo ? (
        <g>
          <path d="M120 44Q200 8 280 44z" fill={P.glass} stroke={P.white} strokeWidth="1.2" />
          {[150, 175, 200, 225, 250].map((x) => <path key={x} d={`M${x} 44V${30 - Math.abs(200 - x) / 8}`} stroke={P.white} strokeWidth=".8" />)}
          <path d="M140 30Q200 4 260 30" stroke={P.leaf} strokeWidth="3" fill="none" />
          {[30, 370].map((x) => <path key={x} d={`M${x - 6} 48L${x} 4L${x + 6} 48`} stroke={P.metal} strokeWidth="1.6" fill="none" />)}
          <path d="M30 6Q200 22 370 6" stroke={P.charcoal} strokeWidth=".6" fill="none" />
          {[80, 300].map((x, i) => <rect key={x} x={x - 4} y={10 + i} width="8" height="6" rx="1.4" fill={[P.red, P.yellow][i]} />)}
          {[70, 96, 304, 330].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 48V24`} stroke={P.metal} strokeWidth="1" />
              <rect x={x} y="24" width="10" height="6" fill={[P.blue, P.red, P.leaf, P.yellow][i]} />
            </g>
          ))}
        </g>
      ) : null}
    </>
  )
}
