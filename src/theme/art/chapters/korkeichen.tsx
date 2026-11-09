/** Kapitel-Grafik Kapitel 25: Korkeichenhain (Montado im Alentejo). */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bee } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { StringLights } from './partsC'
import { Sheep } from './partsD'
import { BlackPig, CorkOak, Nest, Stork, WhiteHouse } from './partsE'

/** Weide unter den Eichen: Frühling grün mit Blüten, Sommer strohgelb, Herbst grün nach dem Regen, Winter grau. */
function Pasture({ season, cy = 60, rx = 37, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const fill = season === 'summer' ? P.paper : season === 'winter' ? P.winterLeafLight : P.leafPale
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} />
      {season === 'spring' ? [14, 26, 52, 66, 34].map((x, i) => <circle key={x} cx={x} cy={cy - 3 + (i % 3) * 3} r=".8" fill={i % 2 ? P.yellow : P.white} />) : null}
      {season === 'summer' ? [14, 30, 50, 64].map((x) => <path key={x} d={`M${x} ${cy + 2}l-1 -2.4M${x} ${cy + 2}l1 -2.6`} stroke={P.woodLight} strokeWidth=".5" />) : null}
      {season === 'winter' ? <ellipse cx="40" cy={cy + 1} rx={rx * 0.6} ry={ry * 0.4} fill={P.frost} opacity=".7" /> : null}
    </g>
  )
}

/** Korkplatte (gewölbte Rinde). */
function CorkPlank({ x, y, w = 10, rot = 0 }: { x: number; y: number; w?: number; rot?: number }) {
  return (
    <g transform={`rotate(${rot} ${x} ${y})`}>
      <path d={`M${x - w / 2} ${y}q${w / 2} -3 ${w} 0v1.6q-${w / 2} -3 -${w} 0z`} fill={P.woodMid} stroke={P.bark} strokeWidth=".3" />
      <path d={`M${x - w / 2 + 1} ${y - 0.4}q${w / 2 - 1} -2.2 ${w - 2} 0`} stroke={P.terracotta} strokeWidth=".4" fill="none" />
    </g>
  )
}

/** Gittermast (Strommast) mit Querträger. */
function Pylon({ x, y, h }: { x: number; y: number; h: number }) {
  return (
    <g>
      <path d={`M${x - 4} ${y}L${x - 1.4} ${y - h}M${x + 4} ${y}L${x + 1.4} ${y - h}`} stroke={P.metal} strokeWidth=".9" />
      {Array.from({ length: Math.floor(h / 6) }, (_, i) => {
        const t = (i * 6) / h
        const w = 4 - 2.6 * t
        return <path key={i} d={`M${x - w} ${y - i * 6}L${x + w - 0.4} ${y - i * 6 - 6}`} stroke={P.metal} strokeWidth=".4" />
      })}
      <path d={`M${x - 9} ${y - h + 4}H${x + 9}`} stroke={P.metal} strokeWidth=".9" />
      <path d={`M${x - 20} ${y - h + 7}Q${x - 14} ${y - h + 9} ${x - 9} ${y - h + 4}M${x + 9} ${y - h + 4}Q${x + 14} ${y - h + 9} ${x + 20} ${y - h + 7}`} stroke={P.charcoal} strokeWidth=".3" fill="none" />
    </g>
  )
}

/** Korkbienenstock (Cortiço): Röhre aus Korkrinde mit Deckel. */
function CorkHive({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect x={x - 2.6} y={y - 9} width="5.2" height="9" rx="1" fill={P.woodMid} stroke={P.bark} strokeWidth=".3" />
      <path d={`M${x - 2.6} ${y - 6}h5.2M${x - 2.6} ${y - 3}h5.2`} stroke={P.bark} strokeWidth=".3" />
      <rect x={x - 3.2} y={y - 10.2} width="6.4" height="1.4" fill={P.stone} />
      <rect x={x - 0.8} y={y - 1.6} width="1.6" height="1" fill={P.ink} />
    </g>
  )
}

export function Korkeichen({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'korkhain': {
      const n = Math.min(5, tier)
      const spots: [number, number, number][] = [
        [40, 58, 1.1],
        [18, 62, 0.85],
        [62, 62, 0.85],
        [28, 70, 0.7],
        [54, 70, 0.7],
      ]
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          {Array.from({ length: n }, (_, i) => (
            <CorkOak key={i} x={spots[i]![0]} y={spots[i]![1]} s={spots[i]![2]} season={season} stripped={i === 0 && tier >= 3} digit={i === 0 && tier >= 3} />
          ))}
          {tier >= 4 ? <Sheep x={70} y={70} s={0.6} /> : null}
          {tier >= 5 ? <Sheep x={12} y={70} s={0.55} flip /> : null}
        </Svg>
      )
    }
    case 'schaelplatz': {
      const planks = tier + 1
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <CorkOak x={30} y={62} s={1.25} season={season} stripped={!winter || tier >= 3} digit={tier >= 2} />
          {Array.from({ length: planks }, (_, i) => (
            <CorkPlank key={i} x={52 + (i % 3) * 8} y={68 - Math.floor(i / 3) * 2.4} rot={(i % 2) * 6 - 3} />
          ))}
          {tier >= 2 ? <path d="M44 64L38 40M47 64L41 40M44.4 58l3 0M43 52l3 0M41.6 46l3 0" stroke={P.woodLight} strokeWidth=".7" /> : null}
          {tier >= 3 ? <path d="M60 58l6 -6M65 51l2 2l-2 1.6" stroke={P.woodDark} strokeWidth=".8" fill={P.metal} /> : null}
          {tier >= 4 ? <Person x={41} y={46} c={P.denim} s={0.65} /> : null}
          {tier >= 5 ? <Person x={66} y={64} c={P.cream} s={0.65} /> : null}
          {summer ? <ellipse cx="30" cy="64" rx="14" ry="2.4" fill={P.charcoal} opacity=".12" /> : null}
        </Svg>
      )
    }
    case 'eichelweide': {
      const pigs = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <CorkOak x={22} y={56} s={0.9} season={season} />
          {tier >= 3 ? <CorkOak x={62} y={54} s={0.8} season={season} /> : null}
          {autumn || winter ? [16, 24, 30, 54, 62, 68].map((x, i) => <ellipse key={x} cx={x} cy={60 + (i % 3)} rx=".7" ry=".9" fill={P.woodDark} />) : null}
          {Array.from({ length: pigs }, (_, i) => (
            <BlackPig key={i} x={[36, 50, 20, 64, 44][i]!} y={[64, 68, 68, 66, 72][i]!} s={0.8} flip={i % 2 === 1} />
          ))}
          {tier >= 2 ? <path d="M4 64h10M6 60v6M12 60v6" stroke={P.woodMid} strokeWidth=".7" /> : null}
          {tier >= 5 ? <Person x={74} y={62} c={P.woodLight} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'storchenmast': {
      const nests = Math.min(4, tier)
      const nestPos: [number, number][] = [
        [36, 22],
        [52, 22],
        [40, 38],
        [28, 22],
      ]
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <Pylon x={40} y={64} h={46} />
          {Array.from({ length: nests }, (_, i) => (
            <g key={i}>
              <Nest x={nestPos[i]![0]} y={nestPos[i]![1]} />
              {!winter || i < 2 ? <Stork x={nestPos[i]![0]} y={nestPos[i]![1] - 1.6} s={0.6} flip={i % 2 === 1} /> : <ellipse cx={nestPos[i]![0]} cy={nestPos[i]![1] - 2} rx="3" ry=".8" fill={P.white} />}
            </g>
          ))}
          {tier >= 5 ? <path d="M60 14q4 -3 8 0q4 -3 8 0" stroke={P.charcoal} strokeWidth=".6" fill="none" className="ha-swim" /> : null}
          {tier >= 5 ? <CorkOak x={68} y={66} s={0.55} season={season} /> : null}
          {tier >= 3 ? <CorkOak x={14} y={66} s={0.6} season={season} /> : null}
        </Svg>
      )
    }
    case 'schoepfrad': {
      const buckets = 3 + tier
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <ellipse cx="40" cy="62" rx="12" ry="3.6" fill={P.white} stroke={P.stone} strokeWidth=".5" />
          <ellipse cx="40" cy="61.4" rx="9" ry="2.4" fill={winter ? P.glass : P.waterDeep} />
          <path d="M28 62V44M52 62V44M27 44h26" stroke={P.woodDark} strokeWidth="1.2" />
          <g className="ha-wheel" style={{ transformOrigin: '40px 48px' }}>
            <circle cx="40" cy="48" r="8" fill="none" stroke={P.metal} strokeWidth=".9" />
            {Array.from({ length: buckets }, (_, i) => {
              const a = (i / buckets) * Math.PI * 2
              return (
                <g key={i}>
                  <path d={`M40 48L${40 + Math.cos(a) * 8} ${48 + Math.sin(a) * 8}`} stroke={P.metal} strokeWidth=".4" />
                  <rect x={40 + Math.cos(a) * 8 - 1} y={48 + Math.sin(a) * 8 - 1} width="2" height="2" fill={P.terracotta} stroke={P.outline} strokeWidth=".15" />
                </g>
              )
            })}
          </g>
          <path d="M52 56h16v4h-16z" fill={P.stoneLight} stroke={P.stone} strokeWidth=".4" />
          {tier >= 2 ? <path d="M53 57h14" stroke={P.water} strokeWidth="1.4" /> : null}
          {tier >= 3 ? (
            <g transform="translate(16 68) scale(.7)">
              <path d="M-3 0v-4M3 0v-4" stroke={P.stoneDark} strokeWidth="1" />
              <ellipse cx="0" cy="-6" rx="5" ry="3" fill={P.stone} />
              <path d="M4 -7l3 -3l1.4 1l-1 3z" fill={P.stone} />
              <path d="M6.4 -10l-.6 -3M7.6 -9.6l.4 -3" stroke={P.stoneDark} strokeWidth=".7" />
            </g>
          ) : null}
          {tier >= 4 ? <rect x="58" y="62" width="7" height="5" rx="1" fill={P.metal} stroke={P.charcoal} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={70} y={68} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'korkstapel': {
      const planks = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <path d="M10 66h46" stroke={P.woodDark} strokeWidth="1.2" />
          {Array.from({ length: planks }, (_, i) => {
            const col = i % 3
            const row = Math.floor(i / 3)
            return <CorkPlank key={i} x={18 + col * 15} y={64 - row * 2.6} w={14} />
          })}
          {tier >= 3 ? <CorkOak x={68} y={60} s={0.7} season={season} /> : null}
          {tier >= 4 ? <path d="M58 70h12M60 70l2 -4h6l2 4" stroke={P.woodDark} strokeWidth=".7" fill={P.woodLight} /> : null}
          {tier >= 5 ? <Person x={10} y={70} c={P.berry} s={0.6} /> : null}
          {winter ? <path d="M10 56h46" stroke={P.white} strokeWidth="1" opacity=".7" /> : null}
        </Svg>
      )
    }
    case 'lehmhaus':
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <WhiteHouse x={14} y={62} w={36} h={18} trim={P.blue} door={P.denim} lit={winter} />
          <rect x="42" y="30" width="6" height="12" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" />
          <path d="M41 30h8" stroke={P.blue} strokeWidth="1" />
          {tier >= 2 ? <path d="M54 62v-4h12v4M54 60h12" stroke={P.woodDark} strokeWidth=".8" fill="none" /> : null}
          {tier >= 3 ? <WhiteHouse x={58} y={62} w={14} h={10} trim={P.yellow} roof="tile" /> : null}
          {tier >= 4 ? <path className="smoke" d="M45 28c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.4" fill="none" /> : null}
          {tier >= 4 ? <CorkOak x={8} y={66} s={0.5} season={season} /> : null}
          {tier >= 5 ? <Person x={52} y={68} c={P.charcoal} s={0.6} /> : null}
        </Svg>
      )
    case 'honighaus': {
      const hives = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          {[12, 28, 52, 68].map((x, i) => (
            <g key={x}>
              <ellipse cx={x} cy={58 - (i % 2)} rx="5" ry="3" fill={winter ? P.winterLeaf : P.leafDark} />
              {!winter ? [-2, 0, 2].map((d) => <circle key={d} cx={x + d} cy={56.6 - (i % 2)} r=".6" fill={summer ? P.white : P.lavender} />) : null}
            </g>
          ))}
          {Array.from({ length: hives }, (_, i) => (
            <CorkHive key={i} x={18 + i * 9} y={68 - (i % 2) * 2} />
          ))}
          {tier >= 3 && !winter ? <Bee x={40} y={50} /> : null}
          {tier >= 3 && !winter ? <Bee x={56} y={46} /> : null}
          {tier >= 4 ? <WhiteHouse x={66} y={60} w={11} h={9} trim={P.blue} /> : null}
          {tier >= 5 ? <Person x={72} y={64} c={P.cream} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'korkwerkstatt': {
      const corks = 2 + tier * 2
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.winterLeafLight : P.canvas} />
          <rect x="10" y="34" width="44" height="28" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <path d="M8 35L32 26L56 35z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
          <rect x="18" y="42" width="16" height="20" fill={P.soilDark} />
          <path d="M10 60.8h44" stroke={P.blue} strokeWidth="1.2" />
          {Array.from({ length: corks }, (_, i) => (
            <rect key={i} x={58 + (i % 4) * 3.4} y={66 - Math.floor(i / 4) * 2.6} width="3" height="2.2" rx=".8" fill={P.woodLight} stroke={P.woodMid} strokeWidth=".25" />
          ))}
          {tier >= 2 ? <rect x="38" y="44" width="10" height="8" fill={winter ? P.lamp : P.charcoal} stroke={P.blue} strokeWidth=".5" /> : null}
          {tier >= 3 ? <path d="M20 62h12M22 62v-6h8v6" stroke={P.metal} strokeWidth=".7" fill="none" /> : null}
          {tier >= 4 ? <circle cx="12" cy="68" r="2.4" fill={P.woodMid} stroke={P.bark} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={44} y={66} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'korkfest': {
      const singers = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Pasture season={season} />
          <CorkOak x={40} y={50} s={1.2} season={season} />
          {Array.from({ length: singers }, (_, i) => (
            <Person key={i} x={22 + i * 7.2} y={66} c={[P.charcoal, P.woodDark, P.cream, P.charcoal, P.denim, P.woodMid][i]!} s={0.9} />
          ))}
          {tier >= 2 ? <path d="M8 70h18M10 70v3M24 70v3" stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 3 ? <StringLights x0={6} x1={74} y={20} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 4 ? <path d="M60 70h12M62 70v3M70 70v3" stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 5 ? <ellipse cx="66" cy="68.6" rx="3" ry="1" fill={P.terracotta} /> : null}
        </Svg>
      )
    }
  }
  return null
}
