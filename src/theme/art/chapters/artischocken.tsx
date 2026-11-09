/** Kapitel-Grafik Kapitel 22: Artischockeninsel Sant’Erasmo (Lagune von Venedig). */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Snowcap } from './partsA'
import { Crate } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { StringLights } from './partsC'
import { Punt, WaterBand } from './partsD'

/** Artischockenpflanze: silbrige, gezackte Blätter, violette Knospen. */
function Artichoke({ x, y, s = 1, season, buds = 2 }: { x: number; y: number; s?: number; season?: string; buds?: number }) {
  const leaf = season === 'winter' ? P.winterLeaf : P.winterLeafLight
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-1, 1].map((d) => (
        <path key={d} d={`M0 0Q${d * 6} -2 ${d * 9} -1L${d * 7} -3L${d * 9} -5L${d * 6} -5L${d * 7} -8L${d * 3} -5Q${d * 1} -3 0 0z`} fill={leaf} stroke={P.winterLeafDark} strokeWidth=".3" />
      ))}
      <path d="M0 0L-2 -8L0 -6L2 -9z" fill={leaf} stroke={P.winterLeafDark} strokeWidth=".3" />
      {season !== 'winter'
        ? Array.from({ length: buds }, (_, i) => {
            const bx = (i - (buds - 1) / 2) * 4
            const by = -10 - (i % 2) * 2
            const bloom = season === 'summer' && i === buds - 1
            return (
              <g key={i}>
                <path d={`M${bx * 0.4} -4L${bx} ${by + 2}`} stroke={P.winterLeafDark} strokeWidth=".6" />
                <ellipse cx={bx} cy={by} rx="1.8" ry="2.2" fill={season === 'autumn' ? P.winterLeafDark : P.plum} stroke={P.outline} strokeWidth=".2" />
                <path d={`M${bx - 1.4} ${by}l1.4 -1.6l1.4 1.6`} stroke={P.lavender} strokeWidth=".3" fill="none" />
                {bloom ? <path d={`M${bx - 1.6} ${by - 2}l.6 -2M${bx} ${by - 2.2}v-2.4M${bx + 1.6} ${by - 2}l-.6 -2`} stroke={P.blue} strokeWidth=".8" /> : null}
              </g>
            )
          })
        : null}
    </g>
  )
}

/** Briccola: drei zusammengebundene Pfähle in der Lagune. */
function Briccola({ x, y, h = 14 }: { x: number; y: number; h?: number }) {
  return (
    <g>
      <path d={`M${x - 1.2} ${y}l.4 -${h}M${x} ${y}v-${h + 1}M${x + 1.2} ${y}l-.4 -${h}`} stroke={P.woodDark} strokeWidth=".9" />
      <path d={`M${x - 1.2} ${y - h * 0.8}h2.4M${x - 1} ${y - h * 0.5}h2`} stroke={P.metal} strokeWidth=".5" />
    </g>
  )
}

/** Seidenreiher. */
function Egret({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="ha-graze">
      <path d="M-.6 0v-4M.8 0v-4" stroke={P.charcoal} strokeWidth=".4" />
      <ellipse cx="0" cy="-5.6" rx="2.6" ry="1.6" fill={P.white} stroke={P.stoneLight} strokeWidth=".2" />
      <path d="M1.8 -6q2 -2 .4 -4.6q.4 -.8 1.4 -.6" stroke={P.white} strokeWidth=".8" fill="none" />
      <path d="M3.4 -11.2l2.4 .6" stroke={P.ink} strokeWidth=".5" />
    </g>
  )
}

/** Campanile (Glockenturm) mit grüner Spitze. */
function Campanile({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-3" y="-26" width="6" height="26" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
      <rect x="-3.4" y="-30" width="6.8" height="4" fill={P.cream} />
      <path d="M-2 -29.4v3M0 -29.4v3M2 -29.4v3" stroke={P.charcoal} strokeWidth=".5" />
      <path d="M-3.4 -30L0 -38L3.4 -30z" fill={P.leafMoss} />
      <circle cx="0" cy="-38.6" r=".7" fill={P.gold} />
    </g>
  )
}

export function Artischocken({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  const lagoonGround = winter ? P.winterLeafLight : P.leafLight
  switch (id) {
    case 'artischockenfeld': {
      const n = Math.min(7, 1 + tier + (tier >= 4 ? 1 : 0))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={P.soil} />
          {Array.from({ length: n }, (_, i) => (
            <Artichoke key={i} x={[40, 22, 58, 30, 50, 14, 66][i]!} y={[60, 56, 56, 66, 66, 62, 62][i]!} s={1.1} season={season} buds={spring || tier >= 3 ? 3 : 2} />
          ))}
          {tier >= 3 ? <path d="M64 70h12l-1 -4h-10z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 && !winter ? [67, 70, 73].map((x) => <ellipse key={x} cx={x} cy={65.4} rx="1.4" ry="1.6" fill={P.plum} />) : null}
          {tier >= 5 ? <Person x={10} y={70} c={P.yellow} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'lagunenwiese': {
      const isles = Math.min(4, 1 + Math.floor(tier / 1.5))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="37" ry="11" fill={P.water} stroke={P.waterDeep} strokeWidth=".4" />
          {Array.from({ length: isles }, (_, i) => {
            const [x, y, rx] = [
              [30, 58, 16],
              [56, 54, 10],
              [52, 64, 9],
              [16, 63, 7],
            ][i]!
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={rx} ry={rx! * 0.32} fill={lagoonGround} stroke={P.leafMoss} strokeWidth=".3" />
                {summer || autumn
                  ? Array.from({ length: Math.round(rx! / 2) }, (_, k) => (
                      <circle key={k} cx={x! - rx! * 0.7 + k * 2.2} cy={y! - 0.8 + (k % 2)} r=".9" fill={summer ? P.lilac : P.lavender} opacity=".9" />
                    ))
                  : null}
                {winter ? <ellipse cx={x} cy={y! - 0.4} rx={rx! * 0.7} ry={rx! * 0.18} fill={P.frost} /> : null}
                {spring ? <ellipse cx={x} cy={y! - 0.4} rx={rx! * 0.6} ry={rx! * 0.16} fill={P.leafPale} /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <Egret x={30} y={56} /> : null}
          {tier >= 3 ? <Briccola x={68} y={62} /> : null}
          {tier >= 4 ? <path d="M14 30l3 -1.6 3 1.6M22 26l2.4 -1.2 2.4 1.2" stroke={P.charcoal} strokeWidth=".6" fill="none" className="ha-swim" /> : null}
          {tier >= 5 ? <Egret x={48} y={64} /> : null}
        </Svg>
      )
    }
    case 'bootsanleger': {
      const posts = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="36" rx="38" ry="7" fill={winter ? P.frost : P.leafLight} />
          <WaterBand y={56} h={24} />
          <rect x="6" y="38" width="40" height="4" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: posts }, (_, i) => (
            <Briccola key={i} x={10 + i * 13} y={60 + (i % 2) * 4} h={18} />
          ))}
          {tier >= 2 ? <Punt x={36} y={54} w={26} c={P.charcoal} /> : null}
          {tier >= 3 ? <Punt x={56} y={64} w={22} c={P.woodDark} cargo={[P.plum, P.plum, P.leafDark]} /> : null}
          {tier >= 4 ? <Person x={26} y={38} c={P.denim} s={0.7} /> : null}
          {tier >= 5 ? <path d="M60 22l2.4 -1.2 2.4 1.2" stroke={P.charcoal} strokeWidth=".6" fill="none" className="ha-swim" /> : null}
        </Svg>
      )
    }
    case 'kanalgarten': {
      const beds = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="37" ry="11" fill={P.water} stroke={P.waterDeep} strokeWidth=".4" />
          {Array.from({ length: beds }, (_, i) => {
            const x = 8 + i * 17
            return (
              <g key={i}>
                <rect x={x} y="50" width="14" height="16" rx="1.4" fill={winter ? P.frost : P.soil} stroke={P.outlineWood} strokeWidth=".3" />
                {!winter
                  ? [0, 1, 2].map((r) =>
                      [3, 7, 11].map((dx) => (
                        <ellipse key={`${r}-${dx}`} cx={x + dx} cy={54 + r * 4.4} rx="1.6" ry="1.1" fill={i % 2 ? (autumn ? P.gold : P.leaf) : spring ? P.leafPale : P.leafDark} />
                      )),
                    )
                  : null}
                {summer && i % 2 === 0 ? [3, 11].map((dx) => <circle key={dx} cx={x + dx} cy={52} r=".9" fill={P.tomato} />) : null}
              </g>
            )
          })}
          {tier >= 2 ? <path d="M70 66v-16" stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 3 ? <path d="M68 52l4 -2l1 2l-4 2z" fill={P.metal} /> : null}
          {tier >= 5 ? <Person x={74} y={64} c={P.berry} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'granatapfelhecke': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="9" fill={winter ? P.frost : P.leafLight} />
          {Array.from({ length: n }, (_, i) => {
            const x = 14 + i * 13
            const y = 60 - (i % 2) * 2
            return (
              <g key={i}>
                <path d={`M${x} ${y}V${y - 10}M${x} ${y - 6}l-4 -6M${x} ${y - 6}l4 -7`} stroke={P.bark} strokeWidth=".8" />
                {!winter ? <ellipse cx={x} cy={y - 14} rx="7" ry="7" fill={spring ? P.leafPale : autumn ? P.gold : P.leafDark} stroke={P.outline} strokeWidth=".3" opacity=".95" /> : null}
                {summer ? [-3, 2, 0].map((dx, k) => <path key={k} d={`M${x + dx} ${y - 12 - k * 3}l-1 -1.6h2z`} fill={P.tomato} />) : null}
                {autumn || summer
                  ? [-3, 3].map((dx) => (
                      <g key={dx}>
                        <circle cx={x + dx} cy={y - 10} r={autumn ? 2 : 1.3} fill={autumn ? P.berry : P.orange} stroke={P.autumnDark} strokeWidth=".2" />
                        <path d={`M${x + dx - 0.6} ${y - 12}l.6 -.8l.6 .8`} stroke={P.autumnDark} strokeWidth=".3" fill="none" />
                      </g>
                    ))
                  : null}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M6 66h68" stroke={P.paper} strokeWidth="2" /> : null}
          {tier >= 4 ? <Crate x={68} y={68} fruit={autumn ? P.berry : undefined} s={0.5} /> : null}
          {tier >= 5 ? <Person x={74} y={58} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'salzgarten': {
      const tufts = Math.min(20, 4 + tier * 3)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="10" fill={P.paper} />
          <path d="M3 56Q20 50 40 54T77 52" stroke={P.water} strokeWidth="5" fill="none" />
          {Array.from({ length: tufts }, (_, i) => {
            const x = 10 + ((i * 23) % 60)
            const y = 60 + ((i * 7) % 8)
            if (i % 2)
              return <path key={i} d={`M${x} ${y}v-4M${x} ${y - 2}l-1.4 -1.4M${x} ${y - 3}l1.4 -1.2`} stroke={autumn ? P.berry : winter ? P.winterLeaf : P.leafMoss} strokeWidth=".9" />
            return (
              <g key={i}>
                {[-1.6, -0.8, 0, 0.8, 1.6].map((d) => (
                  <path key={d} d={`M${x} ${y}q${d} -3 ${d * 2} -5`} stroke={winter ? P.winterLeafDark : P.leaf} strokeWidth=".4" fill="none" />
                ))}
              </g>
            )
          })}
          {tier >= 2 ? <path d="M66 66h8l-1 -3h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 3 ? <path d="M10 68h8l-1 -3h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 3 && !winter ? <path d="M12 65v-3M14 65v-3M16 65v-3" stroke={P.leaf} strokeWidth=".6" /> : null}
          {tier >= 4 ? <Egret x={60} y={52} /> : null}
          {tier >= 5 ? <Person x={74} y={64} c={P.cream} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'bootsschuppen':
      return (
        <Svg tier={tier}>
          <WaterBand y={60} h={14} />
          <rect x="16" y="34" width="44" height="20" fill={P.woodMid} stroke={P.outline} strokeWidth=".5" />
          <path d="M12 35L38 22L64 35z" fill={P.terracotta} stroke={P.outline} strokeWidth=".4" />
          {[20, 30, 46, 56].map((x) => (
            <path key={x} d={`M${x} 54v10`} stroke={P.woodDark} strokeWidth="1.2" />
          ))}
          <rect x="26" y="40" width="22" height="14" fill={P.soilDark} />
          {tier >= 2 ? <Punt x={37} y={53} w={18} c={P.charcoal} /> : null}
          {tier >= 3 ? <path d="M18 38l4 14M22 38l4 14" stroke={P.woodLight} strokeWidth=".7" /> : null}
          {tier >= 4 ? <path d="M50 40q4 6 8 0" stroke={P.stoneDark} strokeWidth=".5" fill="none" strokeDasharray="1 .5" /> : null}
          {tier >= 5 ? <Person x={66} y={54} c={P.denim} s={0.6} /> : null}
          {tier >= 5 ? <path d="M62 54h14" stroke={P.wood} strokeWidth="1.4" /> : null}
          {winter ? <Snowcap d="M13 35L38 23L63 35" /> : null}
        </Svg>
      )
    case 'gemuesekahn': {
      const cargo = Math.min(6, 1 + tier)
      const colors = [P.plum, P.tomato, P.leafDark, P.plum, P.yellow, P.leaf]
      return (
        <Svg tier={tier}>
          <WaterBand y={58} h={20} frozen={false} />
          <g className="ha-swim">
            <path d="M10 52H70L66 60H16z" fill={P.leafMoss} stroke={P.outline} strokeWidth=".5" />
            <path d="M12 54H68" stroke={P.cream} strokeWidth=".7" />
            {Array.from({ length: cargo }, (_, i) => (
              <g key={i}>
                <rect x={16 + i * 8.4} y="46" width="7" height="6" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" />
                {[1.6, 3.6, 5.4].map((dx) => (
                  <circle key={dx} cx={16 + i * 8.4 + dx} cy={45.6} r="1.3" fill={winter ? P.winterLeafLight : colors[i]} stroke={P.outline} strokeWidth=".15" />
                ))}
              </g>
            ))}
            {tier >= 3 ? <path d="M68 52V30" stroke={P.woodDark} strokeWidth=".8" /> : null}
            {tier >= 3 ? <path d="M68 32l7 2l-7 2z" fill={P.berry} /> : null}
          </g>
          {tier >= 4 ? <Person x={14} y={52} c={P.denim} s={0.7} /> : null}
          {tier >= 5 ? <path d="M30 20l3 -1.6 3 1.6" stroke={P.charcoal} strokeWidth=".6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'glockenturm':
      return (
        <Svg tier={tier}>
          {tier >= 3 ? <path d="M0 40L10 30L18 36L28 26L40 36L52 28L62 34L72 26L80 32V40z" fill={P.stoneLight} opacity=".7" /> : null}
          {tier >= 3 ? <path d="M8 32l2 -2l2 2M26 28l2 -2l2 2M70 28l2 -2l2 2" stroke={P.white} strokeWidth=".8" fill="none" /> : null}
          <ellipse cx="40" cy="56" rx="38" ry="14" fill={winter ? P.glass : P.water} />
          <rect x="16" y="42" width="40" height="3" fill={P.terracottaLight} opacity=".9" />
          <Campanile x={36} y={43} s={0.7} />
          {tier >= 2 ? [20, 26, 44, 50].map((x, i) => <rect key={x} x={x} y={38 - (i % 2) * 2} width="5" height={4 + (i % 2) * 2} fill={[P.cream, P.terracottaLight, P.paper, P.terracotta][i]} />) : null}
          <ellipse cx="40" cy="66" rx="34" ry="5" fill={winter ? P.frost : P.leafLight} />
          {tier >= 4 ? <path d="M58 64h10v-2h-10zM59 64v2M67 64v2" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".5" /> : null}
          {tier >= 4 ? <Person x={63} y={62} c={P.lilac} s={0.6} /> : null}
          {tier >= 5 ? <Punt x={54} y={52} w={14} c={P.charcoal} /> : null}
        </Svg>
      )
    case 'inselfest': {
      const guests = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="37" ry="9" fill={winter ? P.frost : P.leafLight} />
          <rect x="12" y="52" width="56" height="3" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" />
          <path d="M14 55v8M66 55v8" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={16 + i * 9.6} y={i % 2 ? 50 : 63} c={[P.berry, P.denim, P.yellow, P.leafDark, P.lilac, P.orange][i]!} s={0.7} />
          ))}
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <ellipse key={`a${i}`} cx={20 + i * 10} cy={51.6} rx="1.6" ry="1.2" fill={P.plum} stroke={P.outline} strokeWidth=".15" />
          ))}
          {tier >= 2 ? <StringLights x0={6} x1={74} y={30} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 3 ? <path d="M6 66V30M74 66V30" stroke={P.woodDark} strokeWidth=".9" /> : null}
          {tier >= 5 ? <Campanile x={70} y={46} s={0.4} /> : null}
        </Svg>
      )
    }
  }
  return null
}
