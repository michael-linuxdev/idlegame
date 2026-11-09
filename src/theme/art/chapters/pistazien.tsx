/** Kapitel-Grafik Kapitel 29: Pistazienhain auf Ägina. */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { StringLights } from './partsC'
import { Fire } from './partsD'
import { Chapel, DryWall, PistachioTree, SmallGoat, WhiteHouse } from './partsE'

/** Trockener Inselboden: Winter grün (Regenzeit), Frühling Mohn, Sommer staubig, Herbst Ocker. */
function IslandGround({ season, cy = 60, rx = 37, ry = 10 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const fill = season === 'winter' ? P.winterLeafLight : season === 'spring' ? P.leafPale : season === 'summer' ? P.paper : P.woodLight
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} />
      {season === 'spring' ? [14, 30, 48, 62, 24].map((x, i) => <circle key={x} cx={x} cy={cy - 2 + (i % 3) * 3} r=".9" fill={P.tomato} />) : null}
    </g>
  )
}

/** Mandelbaum: Frühling weiß-rosa Blüte, Sommer grün mit Mandeln, Herbst gelb, Winter kahl. */
function Almond({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const crown = season === 'spring' ? P.blossom : season === 'autumn' ? P.yellow : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0Q-1 -6 0 -10M0 -8l-5 -5M0 -9l5 -6" stroke={P.bark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      {season === 'winter' ? (
        <path d="M-5 -13l-2 -2M5 -15l1 -3M0 -10l-1 -4" stroke={P.bark} strokeWidth=".6" />
      ) : (
        <g>
          <ellipse cx="-3" cy="-15" rx="5.4" ry="4.4" fill={crown} stroke={P.outline} strokeWidth=".25" />
          <ellipse cx="3.6" cy="-16" rx="5.4" ry="4.4" fill={crown} stroke={P.outline} strokeWidth=".25" />
          {season === 'spring'
            ? [
                [-4, -16],
                [2, -18],
                [5, -14],
              ].map(([dx, dy], i) => <circle key={i} cx={dx} cy={dy} r=".8" fill={P.white} />)
            : null}
          {season === 'summer' ? [-3, 2].map((dx) => <ellipse key={dx} cx={dx} cy={-13} rx=".8" ry="1.1" fill={P.leafPale} stroke={P.leafDark} strokeWidth=".15" />) : null}
        </g>
      )}
    </g>
  )
}

/** Kapernstrauch aus einer Mauerfuge. */
function Caper({ x, y, season }: { x: number; y: number; season?: string }) {
  if (season === 'winter') return <path d={`M${x} ${y}q-3 -1 -5 1M${x} ${y}q3 -1 5 1`} stroke={P.winterLeafDark} strokeWidth=".6" fill="none" />
  return (
    <g>
      <path d={`M${x} ${y}q-4 -3 -7 0M${x} ${y}q4 -3 7 0M${x} ${y}q0 -4 -1 -6`} stroke={P.leafDark} strokeWidth=".6" fill="none" />
      {[-5, -2.6, 2.6, 5].map((d) => (
        <circle key={d} cx={x + d} cy={y - 1.6 - Math.abs(d) * 0.1} r=".9" fill={P.leaf} />
      ))}
      {season === 'summer' ? <circle cx={x - 1} cy={y - 6} r="1.4" fill={P.white} stroke={P.lilac} strokeWidth=".3" /> : null}
      {season === 'spring' ? <circle cx={x - 1} cy={y - 6} r=".7" fill={P.leafPale} /> : null}
    </g>
  )
}

/** Griechisches Fischerboot (Kaiki). */
function Caique({ x, y, s = 1, c = P.blue }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="ha-swim">
      <path d="M-9 -3Q0 0 9 -3L10 -5L8 0H-8L-10 -5z" fill={P.white} stroke={P.charcoal} strokeWidth=".3" />
      <path d="M-8.4 -1.4H8.4" stroke={c} strokeWidth="1" />
      <rect x="-2" y="-7" width="5" height="3.4" fill={P.white} stroke={P.charcoal} strokeWidth=".3" />
      <path d="M-4 -4V-11" stroke={P.woodDark} strokeWidth=".5" />
    </g>
  )
}

export function Pistazien({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'pistazienhain': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <IslandGround season={season} />
          {Array.from({ length: n }, (_, i) => (
            <PistachioTree key={i} x={[40, 22, 58, 30, 50][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.4, 1.1, 1.1, 0.9, 0.9][i]!} season={season} clusters={2 + tier} />
          ))}
          {tier >= 5 ? <Person x={70} y={70} c={P.blue} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'steinterrassen': {
      const rows = 1 + tier
      const soil = winter ? P.leafPale : autumn ? P.woodLight : summer ? P.paper : P.leafPale
      return (
        <Svg tier={tier}>
          <IslandGround season={season} cy={60} ry={12} />
          {Array.from({ length: rows }, (_, k) => {
            const i = rows - 1 - k
            const y = 72 - i * 7
            const w = 66 - i * 7
            return (
              <g key={i}>
                <rect x={40 - w / 2} y={y - 9} width={w} height="6" rx="2" fill={soil} stroke={P.woodMid} strokeWidth=".3" />
                {Array.from({ length: Math.max(1, Math.round(w / 16)) }, (_, j) => (
                  <ellipse key={j} cx={40 - w / 2 + 7 + j * 14} cy={y - 6} rx="2.6" ry="1.8" fill={winter ? P.leaf : autumn ? P.autumn : P.winterLeafDark} stroke={P.outline} strokeWidth=".2" />
                ))}
                <rect x={40 - w / 2} y={y - 3.6} width={w} height="3.6" fill={P.stoneLight} />
                <DryWall x={40 - w / 2} y={y} w={w} h={3.6} c={P.paper} />
              </g>
            )
          })}
          {tier >= 5 ? <Person x={72} y={64} c={P.cream} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'kapellchen':
      return (
        <Svg tier={tier}>
          <IslandGround season={season} />
          <Chapel x={40} y={60} s={1.6 + tier * 0.06} dome={tier >= 3 ? P.denim : P.white} />
          {tier >= 2 ? <path d="M14 64h16M50 64h16" stroke={P.stoneLight} strokeWidth="2" /> : null}
          {tier >= 3 ? (
            <g>
              <path d="M66 62V40" stroke={P.bark} strokeWidth="1.2" />
              <ellipse cx="66" cy="38" rx="6" ry="3.6" fill={P.leafDark} />
            </g>
          ) : null}
          {tier >= 4 ? <path d="M18 62h8M19 62v2M25 62v2" stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 5 ? <Person x={24} y={68} c={P.charcoal} s={0.6} /> : null}
        </Svg>
      )
    case 'mandelbaeume': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <IslandGround season={season} />
          {Array.from({ length: n }, (_, i) => (
            <Almond key={i} x={[40, 20, 60, 30, 50][i]!} y={[58, 62, 62, 70, 70][i]!} s={[1.3, 1.05, 1.05, 0.9, 0.9][i]!} season={season} />
          ))}
          {tier >= 5 ? <SmallGoat x={70} y={70} s={0.8} flip /> : null}
        </Svg>
      )
    }
    case 'kapernhang': {
      const capers = 1 + tier
      return (
        <Svg tier={tier}>
          <IslandGround season={season} cy={64} ry={7} />
          <rect x="6" y="40" width="68" height="24" fill={P.stoneLight} />
          <DryWall x={6} y={64} w={68} h={24} c={P.stoneLight} />
          {Array.from({ length: capers }, (_, i) => (
            <g key={i} transform={`translate(${[20, 46, 62, 30, 54, 14][i]!} ${[50, 46, 56, 58, 54, 44][i]!}) scale(1.5)`}>
              <Caper x={0} y={0} season={season} />
            </g>
          ))}
          {tier >= 4 ? <path d="M66 70h8l-1 -3h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={74} y={66} c={P.yellow} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'roestplatz': {
      const trays = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <IslandGround season={season} />
          <rect x="42" y="54" width="24" height="5" fill={P.stone} stroke={P.outlineStone} strokeWidth=".4" />
          <path d="M44 54V48a10 8 0 0 1 20 0V54z" fill={P.terracottaLight} stroke={P.autumnDark} strokeWidth=".4" />
          <path d="M50 54v-3a4 3 0 0 1 8 0v3z" fill={P.charcoal} />
          <rect x="52" y="38" width="3" height="4" fill={P.terracotta} />
          {tier >= 2 ? <Fire x={54} y={54} s={0.28} /> : null}
          {Array.from({ length: trays }, (_, i) => (
            <g key={i}>
              <rect x={8 + (i % 3) * 12} y={56 + Math.floor(i / 3) * 7} width="10" height="4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
              {[2, 4.6, 7.2].map((dx) => (
                <ellipse key={dx} cx={8 + (i % 3) * 12 + dx} cy={56.6 + Math.floor(i / 3) * 7} rx="1.1" ry=".8" fill={summer ? P.blossom : P.paper} stroke={P.woodMid} strokeWidth=".15" />
              ))}
            </g>
          ))}
          {tier >= 3 ? [68, 71].map((x) => <circle key={x} cx={x} cy={66} r="1.4" fill={P.yellow} stroke={P.gold} strokeWidth=".2" />) : null}
          {tier >= 4 ? <path className="smoke" d="M53.5 37c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
          {tier >= 5 ? <Person x={68} y={60} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'inselhaus':
      return (
        <Svg tier={tier}>
          <IslandGround season={season} />
          <WhiteHouse x={18} y={62} w={34} h={20} roof="flat" door={P.blue} lit={winter} />
          <rect x="22" y="47" width="5" height="5" fill={P.blue} />
          {tier >= 2 ? <rect x="40" y="47" width="5" height="5" fill={P.blue} /> : null}
          {tier >= 3 ? (
            <g>
              <path d="M62 64V48" stroke={P.bark} strokeWidth="1.2" />
              {winter ? <path d="M62 50l-4 -4M62 52l4 -4" stroke={P.bark} strokeWidth=".6" /> : <ellipse cx="62" cy="44" rx="8" ry="6" fill={autumn ? P.gold : P.leaf} stroke={P.outline} strokeWidth=".3" />}
            </g>
          ) : null}
          {tier >= 4 ? <path d="M12 66h3l-.4 -3h-2.2zM54 66h3l-.4 -3h-2.2z" fill={P.terracotta} /> : null}
          {tier >= 4 && !winter ? <path d="M13.5 63v-2M55.5 63v-2" stroke={P.tomato} strokeWidth="1.4" /> : null}
          {tier >= 5 ? <SmallGoat x={70} y={70} s={0.8} /> : null}
        </Svg>
      )
    case 'zisterne':
      return (
        <Svg tier={tier}>
          <IslandGround season={season} />
          <ellipse cx="40" cy="62" rx="12" ry="4" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".5" />
          <rect x="28" y="54" width="24" height="8" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <ellipse cx="40" cy="54" rx="12" ry="4" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <ellipse cx="40" cy="54" rx="5" ry="1.6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".4" />
          {tier >= 2 ? <WhiteHouse x={58} y={62} w={16} h={14} roof="flat" door={P.blue} /> : null}
          {tier >= 3 ? <path d="M58 47h-6l-4 7" stroke={P.metal} strokeWidth=".8" fill="none" /> : null}
          {tier >= 3 && winter ? <path d="M48 54v3" stroke={P.waterLight} strokeWidth=".6" /> : null}
          {tier >= 4 ? <path d="M18 66h5l-.6 -4h-3.8zM20.5 62v-3" fill={P.metal} stroke={P.charcoal} strokeWidth=".3" /> : null}
          {tier >= 5 ? <Person x={26} y={66} c={P.lilac} s={0.6} /> : null}
        </Svg>
      )
    case 'hafenmarkt': {
      const boats = Math.min(3, tier)
      const sacks = tier
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="42" rx="34" ry="11" fill={P.water} stroke={P.waterDeep} strokeWidth=".4" />
          <path d="M16 38h8M44 46h10" stroke={P.waterLight} strokeWidth=".6" />
          <ellipse cx="40" cy="60" rx="37" ry="11" fill={P.stoneLight} stroke={P.stone} strokeWidth="1.2" />
          {Array.from({ length: boats }, (_, i) => (
            <Caique key={i} x={[20, 44, 62][i]!} y={[42, 38, 44][i]!} s={0.8} c={[P.blue, P.tomato, P.leafDark][i]} />
          ))}
          <path d="M20 66V54M60 66V54M16 54h48l-3 -4h-42z" stroke={P.woodDark} strokeWidth=".8" fill={P.white} />
          {Array.from({ length: sacks }, (_, i) => (
            <g key={i}>
              <path d={`M${24 + i * 7} 66q-2 -4 0 -6h4q2 2 0 6z`} fill={P.paper} stroke={P.outlineSoft} strokeWidth=".3" />
              <ellipse cx={26 + i * 7} cy={60.4} rx="1.8" ry=".7" fill={P.leafPale} />
            </g>
          ))}
          {tier >= 4 ? <Person x={70} y={66} c={P.denim} s={0.6} /> : null}
          {tier >= 5 ? <Person x={12} y={66} c={P.yellow} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'pistazienfest': {
      const guests = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="38" rx="32" ry="8" fill={P.water} stroke={P.waterDeep} strokeWidth=".4" />
          <path d="M20 37h8M48 40h9" stroke={P.waterLight} strokeWidth=".6" />
          <ellipse cx="40" cy="58" rx="37" ry="13" fill={winter ? P.stoneLight : P.canvas} stroke={P.stoneLight} strokeWidth=".6" />
          <rect x="16" y="52" width="48" height="3" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" />
          <path d="M18 55v8M62 55v8" stroke={P.woodDark} strokeWidth=".8" />
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={[22, 58, 30, 50, 40][i]!} y={[51, 51, 66, 66, 51][i]!} c={[P.blue, P.white, P.tomato, P.yellow, P.leafDark][i]!} s={0.9} />
          ))}
          {Array.from({ length: guests + 1 }, (_, i) => (
            <ellipse key={`p${i}`} cx={22 + i * 7} cy={51.6} rx="1.4" ry=".8" fill={P.leafPale} stroke={P.leafDark} strokeWidth=".15" />
          ))}
          {tier >= 3 ? <StringLights x0={4} x1={76} y={24} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 4 ? <Chapel x={70} y={44} s={0.6} /> : null}
        </Svg>
      )
    }
  }
  return null
}
