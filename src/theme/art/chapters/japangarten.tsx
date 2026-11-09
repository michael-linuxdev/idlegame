/** Kapitel-Grafik (Lavendel, Japangarten, Gartenschau): japangarten. */
import type { ReactNode } from 'react'
import { Pond, Svg } from '../../HandParts'
import { Rock, Snowcap } from './partsA'
import { BlossomTree, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'

function StoneLantern({ x, y, s = 1, lit, snow }: { x: number; y: number; s?: number; lit?: boolean; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.4" y="-8" width="2.8" height="8" fill={P.stone} />
      <rect x="-3.4" y="-9" width="6.8" height="1.4" fill="#8a7e6e" />
      <rect x="-2.4" y="-13" width="4.8" height="4" fill={lit ? '#ffe9a8' : '#bdb3a0'} stroke="#8a7e6e" strokeWidth=".5" className={lit ? 'fest-glow' : undefined} />
      <path d="M-4.4 -13 L0 -16 L4.4 -13z" fill="#8a7e6e" />
      <circle cx="0" cy="-16.6" r=".9" fill="#8a7e6e" />
      {snow ? <path d="M-4 -13.4 L0 -16.2 L4 -13.4" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
    </g>
  )
}

function Koi({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ha-fish">
        <ellipse cx="0" cy="0" rx="3.6" ry="1.4" fill={c} />
        <ellipse cx="-.6" cy="-.2" rx="1.2" ry=".7" fill={P.cream} />
        <path d="M-3.4 0l-2 -1.6v3.2z" fill={c} />
      </g>
    </g>
  )
}

export function Japan({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const gravel = winter ? '#eef2f4' : '#e8e2d0'
  switch (id) {
    case 'teestrauch': {
      const rows = Math.min(4, 1 + Math.floor((tier + 1) / 2))
      return (
        <Svg tier={tier}>
          <path d="M2 66 Q30 34 78 40 V66z" fill={winter ? '#e8eef0' : '#8cb06a'} />
          {Array.from({ length: rows }, (_, r) => (
            <path key={r} d={`M${6 + r * 2} ${64 - r * 6} Q40 ${56 - r * 6} ${76 - r} ${60 - r * 6}`} stroke="#2f6a2e" strokeWidth="6.4" fill="none" strokeLinecap="round" />
          ))}
          {Array.from({ length: rows }, (_, r) => (
            <path key={r} d={`M${6 + r * 2} ${63 - r * 6} Q40 ${55 - r * 6} ${76 - r} ${59 - r * 6}`} stroke={winter ? '#c9d4c8' : spring ? '#8ad06a' : '#3f8a3a'} strokeWidth="4.6" fill="none" strokeLinecap="round" />
          ))}
          {tier >= 3 ? (
            <g>
              <Person x={60} y={58 - rows * 4} c="#3d5a8a" s={0.9} />
              <path d={`M56 ${51 - rows * 4}h8l-4 -3z`} fill="#d9c070" />
            </g>
          ) : null}
          {tier >= 5 ? <path d="M10 40h6l-1 4h-4z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 2 ? <circle cx="72" cy="60" r="3" fill={P.stone} stroke={P.outlineStone} strokeWidth=".5" /> : null}
          {tier >= 4 ? <path d="M64 64 h10 l-1.5 -4 h-7 z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'moosgarten': {
      const n = Math.min(7, 2 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="57" rx="36" ry="12" fill={winter ? '#e8eef0' : P.leaf} />
          {Array.from({ length: n }, (_, i) => (
            <ellipse key={i} cx={10 + ((i * 17) % 60)} cy={52 + ((i * 7) % 12)} rx={5 + (i % 3)} ry={2.6 + (i % 2)} fill={winter ? '#d8e0d8' : i % 2 ? '#6fa04a' : '#4f8a3a'} />
          ))}
          <ellipse cx="34" cy="56" rx="7" ry="4" fill="#9a9a8a" />
          <ellipse cx="33" cy="54.6" rx="4" ry="2" fill="#6fa04a" opacity={winter ? 0 : 1} />
          {tier >= 3 ? <StoneLantern x={58} y={58} s={0.8} snow={winter} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M16 64 Q14 50 22 42" stroke={P.outlineWood} strokeWidth="2" fill="none" />
              <circle cx="22" cy="40" r="6" fill={winter ? '#c9d0c4' : autumn ? '#c4402a' : '#a83a2a'} opacity=".95" />
              <circle cx="16" cy="44" r="4" fill={winter ? '#c9d0c4' : autumn ? '#d9602a' : '#c4502a'} />
            </g>
          ) : null}
          {tier >= 5 ? <path d="M44 66 q8 -4 16 0" stroke={P.waterLight} strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'bambushain': {
      const n = Math.min(10, 3 + tier * 2)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          {Array.from({ length: n }, (_, i) => {
            const x = 8 + ((i * 13) % 64)
            const h = 30 + ((i * 7) % 12) + tier * 2
            return (
              <g key={i}>
                <path d={`M${x} 64V${64 - h}`} stroke={i % 2 ? '#7aa04a' : '#6a9040'} strokeWidth="2.2" />
                {Array.from({ length: 4 }, (_, k) => (
                  <path key={k} d={`M${x - 1.2} ${60 - k * (h / 4)}h2.4`} stroke={P.leafMoss} strokeWidth=".6" />
                ))}
                <path d={`M${x} ${64 - h + 4}q5 -2 8 1M${x} ${64 - h + 8}q-5 -2 -8 1`} stroke={winter ? '#9ab08a' : P.leaf} strokeWidth="1.6" fill="none" />
                {winter ? <path d={`M${x + 1} ${64 - h + 4}q4 -1 6 0`} stroke={P.white} strokeWidth="1" fill="none" /> : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M4 66 Q40 60 76 66" stroke={P.woodLight} strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'kirschallee': {
      const color = spring ? '#f7c6d9' : season === 'summer' ? '#6ca848' : '#d2752c'
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <path d="M30 67 L37 58 H43 L50 67z" fill={gravel} opacity=".75" />
          <BlossomTree x={18} y={64} s={0.8 + tier * 0.05} winter={winter} color={color} />
          {tier >= 2 ? <BlossomTree x={62} y={64} s={0.8 + tier * 0.04} winter={winter} color={color} /> : null}
          {tier >= 4 ? <BlossomTree x={30} y={50} s={0.55} winter={winter} color={color} /> : null}
          {tier >= 4 ? <BlossomTree x={50} y={50} s={0.55} winter={winter} color={color} /> : null}
          {spring
            ? Array.from({ length: 4 + tier * 2 }, (_, i) => <ellipse key={i} cx={8 + ((i * 13) % 64)} cy={58 + ((i * 5) % 8)} rx="1" ry=".6" fill="#f7c6d9" />)
            : null}
          {tier >= 5 ? <path d="M58 66h12M60 66v2M68 66v2" stroke="#a83a2a" strokeWidth="1.4" /> : null}
          {tier >= 3 ? <path d="M6 64 V54 M4 54 h4 M5 56 h2" stroke={P.stone} strokeWidth="1.4" /> : null}
        </Svg>
      )
    }
    case 'koiteich': {
      const koi = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <Pond frozen={winter} />
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={10 + i * 15} cy={66 - (i % 2) * 2} rx="4" ry="2.4" fill="#9a9a8a" stroke="#7a7a6a" strokeWidth=".4" />
          ))}
          {!winter
            ? Array.from({ length: koi }, (_, i) => (
                <Koi key={i} x={22 + ((i * 13) % 36)} y={47 + ((i * 5) % 10)} c={[P.orange, P.tomato, P.cream, P.yellow][i % 4]!} s={1.1} />
              ))
            : null}
          {tier >= 3 && !winter ? <ellipse cx="60" cy="48" rx="4" ry="1.8" fill={P.leaf} /> : null}
          {tier >= 4 ? <StoneLantern x={70} y={46} s={0.7} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M8 40 h8 v8" stroke={P.woodMid} strokeWidth="1.6" fill="none" />
              <path d="M16 48 q2 4 0 8" stroke={P.waterLight} strokeWidth="1.6" fill="none" className="orchard-stream" strokeDasharray="2 2" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'zengarten': {
      const lines = 2 + tier
      return (
        <Svg tier={tier}>
          <rect x="6" y="46" width="68" height="20" rx="2" fill={gravel} stroke="#8a7e6e" strokeWidth=".8" />
          {Array.from({ length: lines }, (_, i) => (
            <path key={i} d={`M8 ${48 + i * (17 / lines)} H72`} stroke="#c9c0a8" strokeWidth=".6" />
          ))}
          <ellipse cx="28" cy="56" rx="7" ry="3.4" fill={gravel} stroke="#c9c0a8" strokeWidth=".6" />
          <ellipse cx="28" cy="56" rx="10" ry="5" fill="none" stroke="#c9c0a8" strokeWidth=".6" />
          <Rock x={23} y={57} w={10} h={6} snow={winter} />
          {tier >= 2 ? (
            <g>
              <ellipse cx="56" cy="54" rx="9" ry="4.4" fill="none" stroke="#c9c0a8" strokeWidth=".6" />
              <Rock x={50} y={56} w={12} h={8} snow={winter} />
            </g>
          ) : null}
          {tier >= 4 ? <Rock x={62} y={63} w={7} h={4} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M44 46 V36 M38 40 l6 -4" stroke={P.outlineSoft} strokeWidth="1" />
              <path d="M36 42 l2 -2 6 4" stroke={P.outlineSoft} strokeWidth="1.2" fill="none" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'teehaus':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="14" y="56" width="50" height="4" fill={P.woodDark} />
          <path d="M18 60v4M60 60v4" stroke={P.outlineWood} strokeWidth="1.4" />
          <rect x="20" y="40" width="38" height="16" fill="#f5ecd8" stroke={P.outlineWood} strokeWidth=".7" />
          {[26, 32, 38, 44, 50].map((x) => (
            <path key={x} d={`M${x} 40v16`} stroke={P.outlineWood} strokeWidth=".5" />
          ))}
          <path d="M20 48h38" stroke={P.outlineWood} strokeWidth=".4" />
          <path d="M10 41 Q16 38 22 32 H56 Q62 38 68 41z" fill={P.charcoal} />
          <path d="M10 41 q-2 -2 -2 -4 M68 41 q2 -2 2 -4" stroke={P.charcoal} strokeWidth="1.4" fill="none" />
          {tier >= 3 ? (
            <g>
              <path d="M24 32 Q28 28 30 24 H48 Q50 28 54 32z" fill={P.charcoal} />
            </g>
          ) : null}
          {tier >= 2 ? <rect x="34" y="44" width="10" height="12" fill={tier >= 3 ? '#ffe9a8' : '#e8dcc0'} /> : null}
          {tier >= 4 ? <StoneLantern x={70} y={64} s={0.8} lit snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M4 64 Q4 50 12 44" stroke={P.outlineWood} strokeWidth="1.6" fill="none" />
              <circle cx="12" cy="42" r="5" fill={winter ? '#c9d0c4' : autumn ? '#c4402a' : spring ? '#f7c6d9' : '#a83a2a'} />
            </g>
          ) : null}
          {winter ? <Snowcap d="M12 39 Q18 36 23 31 H55 Q60 36 66 39" /> : null}
        </Svg>
      )
    case 'bonsai': {
      const n = Math.min(4, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <rect x="6" y="56" width="68" height="3" fill={P.woodDark} />
          <path d="M10 59v7M70 59v7" stroke={P.outlineWood} strokeWidth="1.4" />
          {Array.from({ length: n }, (_, i) => {
            const x = 16 + i * 16
            const big = i === 0 ? 1 + tier * 0.06 : 0.8
            return (
              <g key={i} transform={`translate(${x} 56) scale(${big})`}>
                <rect x="-6" y="-3" width="12" height="3" rx=".6" fill={['#3d5a8a', '#a83a2a', P.charcoal, P.outlineWood][i]} />
                <path d="M0 -3 Q-2 -7 1 -9 Q3 -11 0 -14" stroke={P.outlineWood} strokeWidth="1.6" fill="none" />
                <ellipse cx="-3" cy="-10" rx="4" ry="2" fill={winter ? '#8a9a7a' : P.leafDark} />
                <ellipse cx="3" cy="-13" rx="3.6" ry="1.8" fill={winter ? '#8a9a7a' : '#4f8a3a'} />
                <ellipse cx="0" cy="-16" rx="2.6" ry="1.4" fill={winter ? '#8a9a7a' : P.leaf} />
                {winter ? <path d="M-6 -11h6M1 -14.4h5" stroke={P.white} strokeWidth=".8" /> : null}
              </g>
            )
          })}
          {tier >= 5 ? <path d="M60 40h12v4h-12z" fill={P.cream} stroke="#a83a2a" strokeWidth=".5" /> : null}
          {tier >= 3 ? <circle cx="8" cy="62" r="2.6" fill={P.stone} stroke={P.outlineStone} strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'rotebruecke':
      return (
        <Svg tier={tier}>
          <Pond cy={58} ry={10} frozen={winter} />
          <path d="M8 58 Q40 32 72 58" stroke="#c4302a" strokeWidth="4" fill="none" />
          <path d="M8 52 Q40 26 72 52" stroke="#c4302a" strokeWidth="1.6" fill="none" />
          {Array.from({ length: 7 }, (_, i) => {
            const x = 12 + i * 9.4
            const t = (x - 8) / 64
            const k = 52 * t * (1 - t)
            return <path key={i} d={`M${x} ${52 - k}V${58 - k}`} stroke="#c4302a" strokeWidth="1.2" />
          })}
          {tier >= 3 && !winter ? <Koi x={24} y={62} c={P.orange} /> : null}
          {tier >= 3 && !winter ? <Koi x={54} y={63} c={P.cream} /> : null}
          {tier >= 4 ? <StoneLantern x={6} y={66} s={0.6} snow={winter} /> : null}
          {tier >= 5 ? <Person x={40} y={42} c="#c4558a" s={0.8} /> : null}
          {tier >= 2 && !winter ? <ellipse cx="62" cy="62" rx="3" ry="1.2" fill={P.leaf} /> : null}
        </Svg>
      )
    case 'laternenweg': {
      const n = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <path d="M6 66 Q30 54 40 50 Q56 44 74 42" stroke={gravel} strokeWidth="9" fill="none" />
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx={12 + i * 12} cy={63 - i * 4} rx="3" ry="1.4" fill="#9a9a8a" />
          ))}
          {Array.from({ length: n }, (_, i) => (
            <StoneLantern key={i} x={10 + i * 15} y={58 - i * 4 + (i % 2) * 10} s={0.8} lit={tier >= 3} snow={winter} />
          ))}
          {tier >= 5 ? (
            <g>
              <path d="M66 42V22M76 42V22M62 24h18M64 28h14" stroke="#c4302a" strokeWidth="2" />
            </g>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}

/* ————————————— Kapitel 12: Gartenschau ————————————— */
