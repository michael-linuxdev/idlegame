/** Kapitel-Grafik (Kräuter, Botanik, Alm): botanik. */
import type { ReactNode } from 'react'
import { Smoke, Svg, Window } from '../../HandParts'
import { Pot, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Butterfly, Conifer, Glasshouse, Rock } from './partsA'

function Palm({ x, y, s = 1, c = P.leaf }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 0 Q-2 -10 0 -20 L1.4 -20 Q0 -10 1 0z" fill={P.outlineSoft} />
      {[-60, -25, 10, 45, 80, 140, 200].map((a) => (
        <path key={a} d="M0 -20 q7 -4 13 1 q-6 -1 -13 1z" fill={c} transform={`rotate(${a} 0 -20)`} />
      ))}
    </g>
  )
}

function Cactus({ x, y, h = 10, flower }: { x: number; y: number; h?: number; flower?: string }) {
  return (
    <g>
      <rect x={x - 2} y={y - h} width="4" height={h} rx="2" fill={P.leaf} stroke={P.leafDark} strokeWidth=".4" />
      <path d={`M${x - 2} ${y - h * 0.5}h-2.4v-${h * 0.3}`} stroke={P.leaf} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${x + 2} ${y - h * 0.4}h2.4v-${h * 0.35}`} stroke={P.leaf} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {flower ? <circle cx={x} cy={y - h - 0.4} r="1.3" fill={flower} /> : null}
    </g>
  )
}

export function Botanik({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'palmenhaus': {
      const palms = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          {Array.from({ length: palms }, (_, i) => {
            const x = [40, 30, 50, 16, 64][i]!
            const wing = i >= 3
            return <Palm key={i} x={x} y={64} s={wing ? 0.55 : 0.75 + tier * 0.05 - (i ? 0.12 : 0)} c={i % 2 ? '#5fae4a' : '#3f8a3a'} />
          })}
          {tier >= 2 ? <Glasshouse x={6} w={18} h={14} roofH={6} alpha={0.42} /> : null}
          {tier >= 4 ? <Glasshouse x={56} w={18} h={14} roofH={6} alpha={0.42} /> : null}
          <Glasshouse x={22} w={36} h={18 + tier} roofH={10} curved alpha={0.42} />
          {winter ? <path d={`M24 ${44 - tier} Q40 ${30 - tier} 56 ${44 - tier}`} stroke={P.white} strokeWidth="1.6" fill="none" opacity=".9" /> : null}
          {tier >= 3 ? <rect x="36" y="55" width="8" height="9" fill="#e8f4fa" stroke="#9ab0bc" strokeWidth=".6" /> : null}
          {tier >= 5 ? <path d={`M40 ${30 - tier}v-6l5 2-5 2`} fill={P.tomato} stroke={P.outlineWood} strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'kakteenhaus': {
      const n = Math.min(6, 1 + tier)
      const bloom = season === 'summer' || spring
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <Glasshouse x={8} w={42} h={18} roofH={10} tint="#f0e4c8" />
          <rect x="26" y="52" width="6" height="12" fill="#e8f4fa" stroke="#9ab0bc" strokeWidth=".5" />
          <ellipse cx="62" cy="62" rx="14" ry="4" fill="#e8d4a0" />
          {Array.from({ length: n }, (_, i) => {
            const inside = i >= 3
            const x = inside ? 14 + (i - 3) * 14 : 54 + i * 7
            return <Cactus key={i} x={x} y={inside ? 62 : 63} h={8 + ((i * 5) % 7)} flower={bloom && i % 2 === 0 ? (i % 4 ? P.pink : P.yellow) : undefined} />
          })}
          {tier >= 4 ? (
            <g>
              <ellipse cx="72" cy="50" rx="3.4" ry="4.4" fill={P.leaf} />
              <ellipse cx="69" cy="45" rx="2.4" ry="3" fill={P.leaf} transform="rotate(-30 69 45)" />
              {bloom ? <circle cx="68" cy="42" r="1.2" fill={P.red} /> : null}
            </g>
          ) : null}
          {winter ? <path d="M7 46 L29 36 L51 46" stroke={P.white} strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'orchideenhaus': {
      const n = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <Glasshouse x={8} w={64} h={22} roofH={11} tint="#e8dcf4" />
          <path d="M10 44h60" stroke={P.outlineSoft} strokeWidth=".8" />
          {Array.from({ length: n }, (_, i) => {
            const x = 13 + i * 7.6
            const c = [P.lilac, P.cream, P.pink, P.yellow][i % 4]
            return (
              <g key={i}>
                <path d={`M${x} 44v4`} stroke={P.outlineWood} strokeWidth=".4" />
                <path d={`M${x - 2} 48h4l-.6 3h-2.8z`} fill={P.woodMid} />
                <path d={`M${x} 48q2-4 4-3`} stroke="#4f8a3a" strokeWidth=".7" fill="none" />
                <circle cx={x + 3.6} cy={45} r="1.6" fill={c} />
                <circle cx={x + 3.6} cy={45} r=".6" fill="#8a3a6a" />
              </g>
            )
          })}
          <rect x="34" y="54" width="10" height="10" fill="#f4eefa" stroke="#9a8ab0" strokeWidth=".5" />
          {tier >= 4 ? <path d="M6 64q4-8 8-4M66 64q4-8 8-4" stroke="#4f8a3a" strokeWidth="1.4" fill="none" /> : null}
          {tier >= 5 ? <Butterfly x={64} y={30} c={P.blue} /> : null}
          {winter ? <path d="M7 42 L40 31 L73 42" stroke={P.white} strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'victoriahaus': {
      const pads = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          {tier >= 4 ? <path d="M6 64V40 Q40 6 74 40 V64" fill="#e8f4fa" opacity=".45" stroke="#f5f7f8" strokeWidth="1" /> : null}
          {tier >= 4 ? <path d="M23 64V26M40 64V17M57 64V26" stroke="#f5f7f8" strokeWidth=".7" /> : null}
          <ellipse cx="40" cy="57" rx="34" ry="11" fill="#bdb3a0" />
          <ellipse cx="40" cy="56" rx="32" ry="9.4" fill="#3f7a8a" />
          {Array.from({ length: pads }, (_, i) => {
            const x = 18 + ((i * 19) % 46)
            const y = 53 + ((i * 7) % 7)
            const r = 6 + (i % 2) * 2
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={r} ry={r * 0.4} fill="#4f8a3a" stroke="#a83a3a" strokeWidth="1" />
                <path d={`M${x - r * 0.7} ${y}h${r * 1.4}M${x} ${y - r * 0.3}v${r * 0.6}`} stroke={P.leafDark} strokeWidth=".4" />
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <ellipse cx="50" cy="51" rx="4" ry="2.2" fill={tier >= 5 ? P.pink : P.cream} />
              <ellipse cx="50" cy="50" rx="2.4" ry="1.6" fill={P.cream} />
            </g>
          ) : null}
          {winter ? <Smoke x={20} y={44} /> : null}
          {tier >= 5 ? <Fish_ x={30} y={60} /> : null}
        </Svg>
      )
    }
    case 'rosarium': {
      const arches = Math.min(3, 1 + Math.floor(tier / 2))
      const rose = season === 'summer' ? P.red : spring ? P.leaf : autumn ? P.roof : undefined
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="12" fill={winter ? '#e8eef0' : P.leafLight} opacity=".8" />
          <path d="M6 62 Q40 54 74 62" stroke="#e2d4ae" strokeWidth="4" fill="none" />
          {Array.from({ length: arches }, (_, i) => {
            const x = 14 + i * 22
            return (
              <g key={i}>
                <path d={`M${x} 62V40 Q${x + 9} 28 ${x + 18} 40 V62`} stroke={P.outlineWood} strokeWidth="1.4" fill="none" />
                {rose
                  ? Array.from({ length: 9 }, (_, k) => {
                      const t = k / 8
                      const ang = Math.PI * (1 - t)
                      const cx = x + 9 + Math.cos(ang) * 9
                      const cy = 40 - Math.sin(ang) * 10 + (k === 0 || k === 8 ? 10 : 0)
                      return <circle key={k} cx={cx} cy={cy} r="2" fill={k % 2 ? P.leaf : season === 'summer' ? [P.red, P.pink, P.cream][i % 3] : rose} />
                    })
                  : null}
              </g>
            )
          })}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <g key={i}>
              <ellipse cx={10 + i * 12} cy={66} rx="3.6" ry="2.4" fill={winter ? '#c9d0c4' : '#4f8a3a'} />
              {season === 'summer' ? <circle cx={10 + i * 12} cy={64.6} r="1.3" fill={[P.red, P.pink, P.yellow][i % 3]} /> : null}
            </g>
          ))}
          {tier >= 5 && season === 'summer' ? <Butterfly x={60} y={30} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'steingarten': {
      const rocks = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="34" ry="11" fill="#c9bfa8" />
          {Array.from({ length: rocks }, (_, i) => (
            <Rock key={i} x={8 + ((i * 23) % 52)} y={64 - (i % 3) * 4} w={12 + (i % 2) * 6} h={7 + (i % 3) * 3} snow={winter} />
          ))}
          {!winter
            ? Array.from({ length: 3 + tier * 2 }, (_, i) => (
                <ellipse key={i} cx={10 + ((i * 13) % 60)} cy={60 + ((i * 5) % 6)} rx="2.6" ry="1.4" fill={spring || season === 'summer' ? [P.pink, P.cream, P.lilac, P.yellow][i % 4] : '#8aa060'} />
              ))
            : null}
          {tier >= 4 ? <Conifer x={66} y={58} s={0.5} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="34" y="40" width="10" height="5" rx="1" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".5" />
              <path d="M39 45v6" stroke={P.outlineSoft} strokeWidth=".8" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'arboretum': {
      const crown = winter ? '#c9d0c4' : autumn ? '#d9a33a' : P.leaf
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <ellipse cx="40" cy="62" rx="34" ry="6" fill={winter ? '#eef2f2' : P.leafLight} />
          <Conifer x={18} y={64} s={0.8 + tier * 0.06} snow={winter} />
          {tier >= 2 ? (
            <g transform="translate(42 64)">
              <path d="M-1.4 0L-1 -16h2L1.4 0z" fill={P.bark} />
              <circle cx="0" cy="-24" r={8 + tier} fill={crown} />
              <circle cx="-5" cy="-19" r="5" fill={crown} />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g transform="translate(64 64)">
              <path d="M-1 0V-14" stroke={P.bark} strokeWidth="2" />
              {[-1, 0, 1].map((k) => (
                <path key={k} d={`M0 ${-14 - k * 6} q-7 -2 -8 -6 q6 0 8 4 q2 -4 8 -4 q-1 4 -8 6z`} fill={winter ? '#c9d0c4' : autumn ? P.yellow : P.leafLight} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <rect x="28" y="58" width="6" height="4" fill={P.paper} stroke={P.outlineWood} strokeWidth=".4" />
              <path d="M31 62v3" stroke={P.outlineWood} strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 5 ? <path d="M4 64h20" stroke={P.woodMid} strokeWidth="2" /> : null}
          {tier >= 5 ? <path d="M6 64v3M22 64v3" stroke={P.outlineWood} strokeWidth="1" /> : null}
        </Svg>
      )
    }
    case 'farnschlucht': {
      const ferns = Math.min(7, 2 + tier)
      const frond = winter ? '#8a9a7a' : autumn ? '#a5893a' : '#4f9a4a'
      return (
        <Svg tier={tier}>
          <path d="M2 66 L10 36 L22 40 L30 66z" fill="#8a7e6e" />
          <path d="M78 66 L70 34 L58 40 L50 66z" fill="#7a6e5e" />
          <ellipse cx="40" cy="64" rx="16" ry="4" fill={winter ? '#cfe2ee' : '#5f9ec4'} />
          {tier >= 3 ? <path d="M36 40 Q38 52 38 62" stroke={winter ? '#e8f4fa' : P.waterLight} strokeWidth="3" fill="none" strokeDasharray="3 2" className="orchard-stream" /> : null}
          {Array.from({ length: ferns }, (_, i) => {
            const x = 8 + ((i * 17) % 64)
            const y = 62 - ((i * 5) % 10)
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 3) * 12 - 12})`}>
                {[-30, 0, 30].map((a) => (
                  <path key={a} d="M0 0 q-2 -8 0 -14" stroke={frond} strokeWidth="2.6" strokeDasharray="1.4 .6" fill="none" transform={`rotate(${a})`} />
                ))}
              </g>
            )
          })}
          <path d="M10 40q6-2 12 0M60 40q6-2 10-4" stroke="#5f8a4a" strokeWidth="2" fill="none" />
          {tier >= 5 ? <path d="M30 36 h20" stroke={P.woodMid} strokeWidth="2.4" /> : null}
          {tier >= 5 ? <path d="M30 36v-4M50 36v-4M30 32h20" stroke={P.outlineWood} strokeWidth=".8" /> : null}
        </Svg>
      )
    }
    case 'herbarium': {
      const frames = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="10" y="40" width="50" height="24" fill={P.paper} stroke="#8a7a6a" strokeWidth=".7" />
          <path d="M6 40 L35 28 L64 40z" fill={P.outlineWood} />
          <path d="M14 36h42" stroke="#bdb3a0" strokeWidth="1" />
          {[16, 26, 44, 54].map((x) => (
            <rect key={x} x={x - 1.4} y="42" width="2.8" height="22" fill={P.cream} stroke="#bdb3a0" strokeWidth=".4" />
          ))}
          <rect x="30" y="48" width="10" height="16" fill="#5a3d22" />
          <Window x={19} y={48} lit={tier >= 3} />
          <Window x={46} y={48} lit={tier >= 3} />
          {Array.from({ length: frames }, (_, i) => (
            <g key={i}>
              <rect x={63} y={44 + i * 5} width="12" height="4.4" fill={P.cream} stroke={P.woodMid} strokeWidth=".6" />
              <path d={`M65 ${46.2 + i * 5}q4 -2 8 0`} stroke={P.leaf} strokeWidth=".7" fill="none" />
            </g>
          ))}
          {tier >= 5 ? <path d="M35 28v-6l4 1.6-4 1.6" fill={P.leafDark} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {winter ? <path d="M7 40 L35 28 L63 40" stroke={P.white} strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'glaskuppel': {
      const r = 18 + tier * 2
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <Palm x={40} y={64} s={(r - 5) / 31} />
          {tier >= 3 ? <Palm x={28} y={64} s={0.7} c="#5fae4a" /> : null}
          {tier >= 3 ? <Palm x={52} y={64} s={0.6} c="#5fae4a" /> : null}
          <path d={`M${40 - r} 64 A${r} ${r} 0 0 1 ${40 + r} 64z`} fill="#cfe8f4" opacity=".36" stroke="#f5f7f8" strokeWidth="1" />
          {[-0.6, -0.2, 0.2, 0.6].map((k) => (
            <path key={k} d={`M40 ${64 - r} Q${40 + k * r * 1.5} ${64 - r * 0.5} ${40 + k * r * 1.5} 64`} stroke="#f5f7f8" strokeWidth=".6" fill="none" />
          ))}
          <path d={`M${40 - r * 0.86} ${64 - r * 0.5}h${r * 1.72}`} stroke="#f5f7f8" strokeWidth=".6" />
          <path d={`M${40 - r * 0.6} ${64 - r * 0.62}q4 -6 10 -8`} stroke={P.white} strokeWidth="1.2" fill="none" opacity=".7" />
          {tier >= 4 ? <circle cx="40" cy={64 - r - 1.4} r="1.8" fill="#e0a21a" /> : null}
          {tier >= 5 ? <path d={`M40 ${64 - r - 3}v-7l5 2-5 2`} fill={P.tomato} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {winter ? <path d={`M${40 - r * 0.7} ${64 - r * 0.72} Q40 ${64 - r * 1.2} ${40 + r * 0.7} ${64 - r * 0.72}`} stroke={P.white} strokeWidth="1.6" fill="none" /> : null}
          {tier >= 2 ? <Pot x={70} y={64} s={0.5} /> : null}
        </Svg>
      )
    }
  }
  return null
}

function Fish_({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ha-fish">
      <ellipse cx="0" cy="0" rx="3.4" ry="1.4" fill={P.orange} />
      <path d="M-3.2 0l-2 -1.6v3.2z" fill={P.orange} />
      </g>
    </g>
  )
}

/* ————————————— Kapitel 9: Alpen-Alm ————————————— */
