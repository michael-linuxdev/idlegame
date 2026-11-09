/** Kapitel-Grafik Kapitel 24: Andalusischer Patio (Córdoba). */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Jar, Lantern, Pot } from '../parts'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { StringLights } from './partsC'
import { OrangeTree } from './partsE'

/** Kieselpflaster des Patios (Empedrado): helle Fläche mit Mustern. */
function Pebbles({ cx = 40, cy = 60, rx = 36, ry = 9, winter }: { cx?: number; cy?: number; rx?: number; ry?: number; winter?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={winter ? P.stoneLight : P.canvas} stroke={P.stone} strokeWidth=".4" />
      <path d={`M${cx - rx * 0.7} ${cy}h${rx * 1.4}M${cx} ${cy - ry * 0.7}v${ry * 1.4}`} stroke={P.stone} strokeWidth=".5" opacity=".7" />
      <ellipse cx={cx} cy={cy} rx={rx * 0.3} ry={ry * 0.3} fill="none" stroke={P.stone} strokeWidth=".5" opacity=".7" />
    </g>
  )
}

/** Geranie im Topf an der Wand (Fußpunkt Topfboden). */
function WallPot({ x, y, season, c }: { x: number; y: number; season?: string; c: string }) {
  const bloom = season === 'winter' ? null : season === 'autumn' ? P.pink : c
  return (
    <g>
      <ellipse cx={x} cy={y - 3.6} rx="2.4" ry="1.6" fill={season === 'winter' ? P.winterLeaf : P.leaf} />
      {bloom ? <circle cx={x + 0.4} cy={y - 4.6} r="1.1" fill={bloom} stroke={P.outline} strokeWidth=".12" /> : <circle cx={x + 0.4} cy={y - 4.4} r=".6" fill={P.leafDark} />}
      <path d={`M${x - 1.8} ${y - 2.6}h3.6l-.5 2.6h-2.6z`} fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".2" />
    </g>
  )
}

/** Hufeisen-/Rundbogen-Galerie (Fußpunkt unten links). */
function Arcade({ x, y, w, h, arches }: { x: number; y: number; w: number; h: number; arches: number }) {
  const aw = w / arches
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
      <path d={`M${x - 1} ${y - h}h${w + 2}`} stroke={P.terracotta} strokeWidth="2" />
      {Array.from({ length: arches }, (_, i) => {
        const ax = x + i * aw
        return (
          <g key={i}>
            <path d={`M${ax + aw * 0.14} ${y}V${y - h * 0.5}A${aw * 0.36} ${aw * 0.36} 0 0 1 ${ax + aw * 0.86} ${y - h * 0.5}V${y}z`} fill={P.woodDark} opacity=".55" />
            <path d={`M${ax + aw * 0.14} ${y - h * 0.5}A${aw * 0.36} ${aw * 0.36} 0 0 1 ${ax + aw * 0.86} ${y - h * 0.5}`} stroke={P.terracottaLight} strokeWidth=".8" fill="none" strokeDasharray="1 .8" />
          </g>
        )
      })}
    </g>
  )
}

/** Gitterfenster (Reja) mit Sims (Fußpunkt Sims, links). */
function Reja({ x, y, w = 12, h = 14 }: { x: number; y: number; w?: number; h?: number }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.charcoal} opacity=".75" />
      <path d={`M${x} ${y - h}a${w / 2} ${w / 3} 0 0 1 ${w} 0`} stroke={P.ink} strokeWidth=".7" fill="none" />
      {[0.2, 0.4, 0.6, 0.8].map((t) => (
        <path key={t} d={`M${x + w * t} ${y - h - 1.4}V${y}`} stroke={P.ink} strokeWidth=".6" />
      ))}
      <path d={`M${x} ${y - h * 0.5}h${w}`} stroke={P.ink} strokeWidth=".5" />
      <path d={`M${x + w * 0.3} ${y - h * 0.25}q${w * 0.2} -2 ${w * 0.4} 0`} stroke={P.ink} strokeWidth=".5" fill="none" />
      <rect x={x - 1} y={y} width={w + 2} height="1.2" fill={P.terracotta} />
    </g>
  )
}

/** Granatapfelbaum (laubabwerfend). */
function Pomegranate({ x, y, s, season, fruits }: { x: number; y: number; s: number; season?: string; fruits: number }) {
  const winter = season === 'winter'
  const crown = season === 'autumn' ? P.gold : season === 'spring' ? P.leafPale : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 0Q-1.6 -8 -5 -14M.4 0Q1 -9 5 -16M0 -6Q0 -12 0 -18" stroke={P.bark} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      {winter ? (
        Array.from({ length: fruits + 1 }, (_, i) => <path key={i} d={`M${-6 + i * 3} ${-14 - (i % 2) * 3}l${i % 2 ? 1.4 : -1.4} -3`} stroke={P.bark} strokeWidth=".5" />)
      ) : (
        <g>
          <ellipse cx="-5" cy="-17" rx="6" ry="5" fill={crown} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx="5" cy="-18" rx="6" ry="5" fill={crown} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx="0" cy="-22" rx="6.4" ry="5" fill={crown} stroke={P.outline} strokeWidth=".3" />
          {Array.from({ length: fruits }, (_, i) => {
            const fx = [-5, 4, 0, -8, 7, 2][i % 6]!
            const fy = [-15, -16, -21, -19, -20, -13][i % 6]!
            if (season === 'spring') return <path key={i} d={`M${fx - 0.8} ${fy}l.8 -1.6l.8 1.6z`} fill={P.tomato} />
            return <circle key={i} cx={fx} cy={fy} r={season === 'autumn' ? 1.6 : 1.1} fill={season === 'autumn' ? P.berry : P.tomato} stroke={P.autumnDark} strokeWidth=".2" />
          })}
        </g>
      )}
    </g>
  )
}

export function Patio({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'orangenhof': {
      const n = Math.min(5, tier)
      const spots: [number, number][] = [
        [40, 62],
        [20, 58],
        [60, 58],
        [28, 68],
        [52, 68],
      ]
      return (
        <Svg tier={tier}>
          <Pebbles winter={winter} />
          {tier >= 3 ? <path d="M20 58H60M28 68L40 62L52 68" stroke={P.water} strokeWidth="1" fill="none" opacity=".9" /> : null}
          {Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <ellipse cx={spots[i]![0]} cy={spots[i]![1]} rx="4" ry="1.4" fill={P.soil} stroke={P.terracotta} strokeWidth=".4" />
              <OrangeTree x={spots[i]![0]} y={spots[i]![1]} s={0.9 + (i === 0 ? 0.15 : 0)} season={season} fruits={3 + tier} />
            </g>
          ))}
          {tier >= 4 ? <path d="M66 70h10l-1 -4h-8z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 ? [68, 71, 74].map((x) => <circle key={x} cx={x} cy={65.6} r="1.2" fill={P.orange} />) : null}
          {tier >= 5 ? <Person x={72} y={60} c={P.berry} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'azulejobrunnen': {
      const tiles = 4 + tier * 2
      return (
        <Svg tier={tier}>
          <Pebbles winter={winter} />
          <ellipse cx="40" cy="62" rx="18" ry="6" fill={P.white} stroke={P.stone} strokeWidth=".5" />
          <ellipse cx="40" cy="60.6" rx="15" ry="4.6" fill={P.water} />
          <path d="M22 62v3q18 7 36 0v-3" fill={P.white} stroke={P.stone} strokeWidth=".4" />
          {Array.from({ length: tiles }, (_, i) => {
            const t = (i + 0.5) / tiles
            const tx = 23 + t * 34
            const ty = 63.4 + Math.sin(t * Math.PI) * 2.6
            return <rect key={i} x={tx - 1} y={ty - 0.9} width="2" height="1.8" fill={i % 2 ? P.blue : P.denim} stroke={P.white} strokeWidth=".2" />
          })}
          <path d="M38.6 60v-8h2.8v8z" fill={P.white} stroke={P.stone} strokeWidth=".3" />
          <ellipse cx="40" cy="52" rx="5" ry="1.6" fill={P.white} stroke={P.stone} strokeWidth=".3" />
          {!winter || tier >= 2 ? <path d="M40 51v-5M40 46q-3 1 -4 5M40 46q3 1 4 5" stroke={P.waterLight} strokeWidth=".8" fill="none" /> : <path d="M40 51v-2" stroke={P.waterLight} strokeWidth=".8" />}
          {tier >= 2 ? <Pot x={16} y={66} s={0.6} /> : null}
          {tier >= 3 ? <Pot x={64} y={66} s={0.6} /> : null}
          {tier >= 3 && !winter ? [16, 64].map((x) => <circle key={x} cx={x} cy={58} r="1.6" fill={spring || summer ? P.red : P.pink} />) : null}
          {tier >= 4 ? <path d="M40 46v-4" stroke={P.waterLight} strokeWidth=".6" className="ha-swim" /> : null}
          {tier >= 5 ? <Person x={70} y={58} c={P.denim} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'geranienwand': {
      const pots = 2 + tier * 3
      const cols = [P.red, P.berry, P.pink, P.tomato]
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="36" ry="5" fill={winter ? P.stoneLight : P.canvas} />
          <rect x="8" y="18" width="64" height="46" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <path d="M8 18h64" stroke={P.terracotta} strokeWidth="2" />
          <rect x="34" y="44" width="12" height="20" rx="5" fill={P.leafMoss} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: pots }, (_, i) => {
            const row = Math.floor(i / 6)
            const col = i % 6
            const x = 13 + col * 11 + (row % 2) * 5
            const y = 28 + row * 9
            if (x > 31 && x < 49 && y > 40) return <WallPot key={i} x={x < 40 ? 28 : 52} y={y + 4} season={season} c={cols[i % 4]!} />
            return <WallPot key={i} x={x} y={y} season={season} c={cols[i % 4]!} />
          })}
          {tier >= 4 ? <path d="M14 64L26 30" stroke={P.woodLight} strokeWidth=".8" /> : null}
          {tier >= 4 ? <rect x="24.6" y="27.4" width="3" height="3" fill={P.metal} /> : null}
          {tier >= 5 ? <Person x={14} y={66} c={P.yellow} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'acequia': {
      const gates = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Pebbles winter={winter} />
          <path d="M6 60H74M40 52V70" stroke={P.stoneDark} strokeWidth="3" />
          <path d="M6 60H74M40 52V70" stroke={winter ? P.glass : P.water} strokeWidth="1.8" />
          {!winter ? <path d="M12 60h4M28 60h5M50 60h4M64 60h5" stroke={P.waterLight} strokeWidth=".5" /> : null}
          {Array.from({ length: gates }, (_, i) => {
            const [x, y] = [
              [24, 60],
              [56, 60],
              [40, 55],
              [40, 66],
              [68, 60],
            ][i]!
            return (
              <g key={i}>
                <rect x={x! - 0.8} y={y! - 3} width="1.6" height="4" fill={P.metal} />
                <path d={`M${x! - 2} ${y! - 3}h4`} stroke={P.charcoal} strokeWidth=".6" />
              </g>
            )
          })}
          {tier >= 2 ? <OrangeTree x={22} y={56} s={0.7} season={season} fruits={3} /> : null}
          {tier >= 3 ? <OrangeTree x={58} y={56} s={0.7} season={season} fruits={3} /> : null}
          {tier >= 4 ? <ellipse cx="40" cy="72" rx="3" ry="1" fill={P.stone} /> : null}
          {tier >= 5 ? <Person x={48} y={70} c={P.leafDark} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'jasminbogen': {
      const leaves = 2 + tier * 2
      const flowers = winter ? 0 : autumn ? 1 : 3
      return (
        <Svg tier={tier}>
          <Pebbles winter={winter} />
          <path d="M24 64V36A16 14 0 0 1 56 36V64" stroke={P.charcoal} strokeWidth="1.4" fill="none" />
          <path d="M27 64V37A13 11 0 0 1 53 37V64" stroke={P.charcoal} strokeWidth=".6" fill="none" />
          {Array.from({ length: leaves }, (_, i) => {
            const t = i / Math.max(1, leaves - 1)
            const a = Math.PI * (1 - t)
            const x = 40 + Math.cos(a) * 15
            const y = 36 - Math.sin(a) * 13 + (t < 0.15 || t > 0.85 ? (0.5 - Math.abs(t - 0.5)) * 30 : 0)
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="3" ry="2" fill={winter ? P.winterLeafDark : P.leafDark} stroke={P.outline} strokeWidth=".2" />
                {Array.from({ length: flowers }, (_, k) => (
                  <circle key={k} cx={x - 1.4 + k * 1.4} cy={y - 0.6 + (k % 2)} r=".6" fill={P.white} />
                ))}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M30 64v-6h20v6M30 60h20" stroke={P.woodDark} strokeWidth=".9" fill="none" /> : null}
          {tier >= 4 ? <Lantern x={40} y={24} s={1.2} /> : null}
          {tier >= 5 ? <Person x={64} y={66} c={P.lilac} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'granatapfelbaum':
      return (
        <Svg tier={tier}>
          <Pebbles winter={winter} />
          <ellipse cx="40" cy="64" rx="7" ry="2" fill={P.soil} stroke={P.terracotta} strokeWidth=".4" />
          <Pomegranate x={40} y={64} s={0.8 + tier * 0.14} season={season} fruits={tier + 1} />
          {tier >= 3 ? <Pot x={16} y={68} s={0.6} /> : null}
          {tier >= 4 ? <path d="M58 70h10l-1 -3h-8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 && autumn ? [60, 63, 66].map((x) => <circle key={x} cx={x} cy={66} r="1.3" fill={P.berry} />) : null}
          {tier >= 5 ? <Person x={68} y={64} c={P.orange} s={0.7} /> : null}
        </Svg>
      )
    case 'galerie': {
      const pots = tier
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.stoneLight : P.canvas} />
          <Arcade x={8} y={62} w={64} h={30} arches={4} />
          {Array.from({ length: pots }, (_, i) => (
            <g key={i}>
              <Pot x={12 + i * 14} y={68} s={0.55} />
              {!winter ? <circle cx={12 + i * 14} cy={62.6} r="1.4" fill={[P.red, P.pink, P.berry][i % 3]} /> : <ellipse cx={12 + i * 14} cy={63} rx="1.6" ry="1" fill={P.leafDark} />}
            </g>
          ))}
          {tier >= 2 ? <path d="M20 62v-5h5v5M20 59h5" stroke={P.woodDark} strokeWidth=".7" fill="none" /> : null}
          {tier >= 3 ? <path d="M52 62v-5h5v5M52 59h5" stroke={P.woodDark} strokeWidth=".7" fill="none" /> : null}
          {tier >= 4 ? <Lantern x={40} y={34} /> : null}
          {tier >= 5 ? <Person x={36} y={62} c={P.denim} s={0.6} /> : null}
          {summer ? <ellipse cx="40" cy="58" rx="30" ry="3" fill={P.charcoal} opacity=".12" /> : null}
        </Svg>
      )
    }
    case 'marmeladenkueche': {
      const jars = tier + 1
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="64" rx="37" ry="6" fill={winter ? P.stoneLight : P.canvas} />
          <rect x="12" y="30" width="40" height="32" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <path d="M10 31L32 22L54 31z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".4" />
          <rect x="18" y="38" width="10" height="24" rx="4" fill={P.woodDark} />
          <rect x="34" y="38" width="12" height="9" fill={winter ? P.lamp : P.charcoal} stroke={P.blue} strokeWidth=".6" />
          <rect x="44" y="20" width="4" height="8" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
          <path d="M52 62h22M54 62v6M72 62v6" stroke={P.woodDark} strokeWidth="1" />
          {Array.from({ length: jars }, (_, i) => (
            <Jar key={i} x={55 + i * 3.4} y={61.6} c={P.orange} s={0.42} />
          ))}
          {tier >= 2 ? <path d="M34 66h10l-1 -4h-8z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 2 ? [36, 39, 42].map((x) => <circle key={x} cx={x} cy={61.4} r="1.2" fill={P.orange} />) : null}
          {tier >= 3 ? <ellipse cx="66" cy="70" rx="4" ry="1.6" fill={P.brass} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 ? <path className="smoke" d="M46 18c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.4" fill="none" /> : null}
          {tier >= 5 ? <Person x={30} y={64} c={P.yellow} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'gitterfenster': {
      const windows = tier >= 4 ? 3 : tier >= 2 ? 2 : 1
      const pots = tier + 1
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="65" rx="37" ry="5" fill={winter ? P.stoneLight : P.canvas} />
          <rect x="6" y="20" width="68" height="44" fill={P.white} stroke={P.stoneLight} strokeWidth=".5" />
          <path d="M6 62.8h68" stroke={P.yellow} strokeWidth="2.4" />
          {Array.from({ length: windows }, (_, i) => (
            <Reja key={i} x={[34, 12, 56][i]!} y={48} />
          ))}
          {Array.from({ length: pots }, (_, i) => (
            <WallPot key={i} x={[38, 44, 16, 22, 60, 66][i]!} y={49} season={season} c={[P.red, P.pink][i % 2]!} />
          ))}
          {tier >= 3 ? <path d="M6 30h68" stroke={P.terracotta} strokeWidth=".5" opacity=".6" /> : null}
          {tier >= 5 ? <Person x={30} y={68} c={P.berry} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'patiofest': {
      const flowers = 4 + tier * 3
      const guests = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Pebbles winter={winter} />
          <path d="M40 62V26M30 36H50" stroke={P.woodDark} strokeWidth="1.2" />
          {Array.from({ length: flowers }, (_, i) => {
            const onArm = i % 3 === 0
            const k = Math.floor(i / 3)
            const x = onArm ? 30.6 + (k % 7) * 3 : 40 + (i % 3 === 1 ? -1 : 1)
            const y = onArm ? 36 : 28 + k * 2.4
            return <circle key={i} cx={x} cy={y} r="1.4" fill={[P.red, P.berry, P.tomato][i % 3]} stroke={P.outline} strokeWidth=".12" />
          })}
          {Array.from({ length: guests }, (_, i) => (
            <Person key={i} x={[20, 60, 14, 66, 26][i]!} y={[62, 62, 68, 68, 70][i]!} c={[P.berry, P.yellow, P.denim, P.lilac, P.leafDark][i]!} s={0.7} />
          ))}
          {tier >= 3 ? <StringLights x0={6} x1={74} y={20} lit={winter || autumn || tier >= 4} /> : null}
          {tier >= 4 ? <path d="M60 58q2 -6 5 -4l-3 6z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".3" /> : null}
        </Svg>
      )
    }
  }
  return null
}
