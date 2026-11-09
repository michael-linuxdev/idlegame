/** Kapitel-Grafik (Lavendel, Japangarten, Gartenschau): gartenschau. */
import type { ReactNode } from 'react'
import { Pond, Roof, Svg } from '../../HandParts'
import { Bunting, Butterfly, Snowcap } from './partsA'
import { Flower, Pot, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Ground, Person } from './partsB'

function Hedge({ d, winter, w = 3.4 }: { d: string; winter?: boolean; w?: number }) {
  return (
    <g>
      <path d={d} stroke="#2f5a2e" strokeWidth={w + 1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={winter ? '#c9d4c8' : '#4f8a3a'} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/* ————————————— Kapitel 10: Lavendelfeld ————————————— */

export function Gartenschau({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const summer = season === 'summer'
  const bloom = !winter
  switch (id) {
    case 'eingangstor':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <path d="M14 64V34M66 64V34" stroke={P.leafDark} strokeWidth="5" />
          <path d="M14 34 Q40 16 66 34" stroke={P.leafDark} strokeWidth="5" fill="none" />
          {bloom ? Array.from({ length: 9 }, (_, i) => {
            const t = i / 8
            return <circle key={i} cx={14 + 52 * t} cy={34 - Math.sin(t * Math.PI) * 11} r="2" fill={[P.red, P.yellow, P.cream][i % 3]} />
          }) : null}
          <rect x="28" y="24" width="24" height="7" rx="1.4" fill="#fbf3e0" stroke={P.leafDark} strokeWidth=".6" />
          <path d="M32 27.5h16" stroke={P.leafDark} strokeWidth="1.2" />
          {tier >= 2 ? <path d="M20 64V46h40v18" stroke={P.outlineWood} strokeWidth="1" fill="none" /> : null}
          {tier >= 3 ? (
            <g>
              <path d="M8 64V20l6 2.4-6 2.4" fill={P.tomato} stroke={P.outlineWood} strokeWidth=".6" />
              <path d="M72 64V20l6 2.4-6 2.4" fill={P.blue} stroke={P.outlineWood} strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 4 ? <Person x={36} y={64} c={P.blue} /> : null}
          {tier >= 4 ? <Person x={44} y={65} c={P.red} s={0.8} /> : null}
          {tier >= 5 ? <Bunting y={14} n={8} x0={8} x1={72} /> : null}
          {winter ? <Snowcap d="M16 33 Q40 17 64 33" /> : null}
        </Svg>
      )
    case 'blumenkorso': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <path d="M10 56h52l6 -10h-6l-4 4h-44z" fill={P.outlineSoft} />
          <path d="M12 56 Q20 30 40 34 Q58 30 62 56z" fill={winter ? '#c9d0c4' : P.leaf} />
          {bloom
            ? Array.from({ length: rows * 7 }, (_, i) => {
                const r = Math.floor(i / 7)
                const k = i % 7
                return <circle key={i} cx={18 + k * 6.4} cy={52 - r * 3.6 - Math.sin((k / 6) * Math.PI) * 3} r="1.9" fill={[P.red, P.orange, P.yellow, P.lilac, P.cream][(i + r) % 5]} />
              })
            : null}
          <circle cx="18" cy="60" r="4" fill="#4a3a2a" />
          <circle cx="54" cy="60" r="4" fill="#4a3a2a" />
          <circle cx="18" cy="60" r="1.4" fill={P.stone} />
          <circle cx="54" cy="60" r="1.4" fill={P.stone} />
          {tier >= 4 ? <Person x={70} y={64} c={P.yellow} /> : null}
          {tier >= 5 ? <path d="M40 34V22l6 2.4-6 2.4" fill={P.lilac} stroke={P.outlineWood} strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'rosenbogen': {
      const arches = Math.min(4, 1 + Math.floor(tier / 1.5))
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {Array.from({ length: arches }, (_, i) => {
            const s = 1 - i * 0.16
            const y = 64 - i * 6
            const w = 30 * s
            return (
              <g key={i}>
                <path d={`M${40 - w / 2} ${y}V${y - 22 * s} Q40 ${y - 34 * s} ${40 + w / 2} ${y - 22 * s} V${y}`} stroke={P.outlineWood} strokeWidth={1.6 * s} fill="none" />
                {summer || spring
                  ? Array.from({ length: 9 }, (_, k) => {
                      const t = k / 8
                      const ang = Math.PI * (1 - t)
                      return <circle key={k} cx={40 + Math.cos(ang) * (w / 2)} cy={y - 22 * s - Math.sin(ang) * 11 * s} r={1.9 * s} fill={k % 2 ? P.leaf : summer ? [P.red, P.pink, P.cream][i % 3] : P.leaf} />
                    })
                  : null}
              </g>
            )
          }).reverse()}
          {tier >= 5 ? <path d="M8 64h12M10 64v3M18 64v3" stroke={P.outlineWood} strokeWidth="1.2" /> : null}
          {tier >= 4 ? <g>{[66, 70, 74].map((x) => <circle key={x} cx={x} cy={60} r="1.6" fill={P.red} />)}</g> : null}
        </Svg>
      )
    }
    case 'labyrinth': {
      const rings = Math.min(4, 1 + Math.floor(tier / 1.4))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="13" fill="#d9c79a" />
          {Array.from({ length: rings }, (_, r) => {
            const rx = 32 - r * 7
            const ry = 11 - r * 2.4
            return <Hedge key={r} winter={winter} d={`M${40 + 3} ${56 - ry} A${rx} ${ry} 0 1 1 ${40 - 3} ${56 - ry}`} />
          })}
          {tier >= 3 ? <circle cx="40" cy="55" r="2" fill="#e0a21a" /> : null}
          {tier >= 5 ? <path d="M40 55V40l5 2-5 2" fill={P.tomato} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {tier >= 4 ? <Person x={18} y={66} c={P.blue} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'wasserspiele': {
      const jets = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="32" ry="10" fill="#bdb3a0" />
          <ellipse cx="40" cy="57" rx="29" ry="8.4" fill={winter ? '#cfe2ee' : P.water} />
          <rect x="37" y="44" width="6" height="12" fill="#bdb3a0" />
          <ellipse cx="40" cy="44" rx="7" ry="2.4" fill="#bdb3a0" />
          {!winter ? (
            <g>
              <path d="M40 43 Q40 22 40 22 M40 24 Q34 30 34 42 M40 24 Q46 30 46 42" stroke="#d6eef8" strokeWidth="1.4" fill="none" className="fest-glow" />
              {Array.from({ length: jets }, (_, i) => {
                const x = [20, 60, 28, 52, 40][i]!
                const y = [58, 58, 62, 62, 64][i]!
                return <path key={i} d={`M${x} ${y} Q${x + 2} ${y - 14} ${x + 4} ${y - 2}`} stroke="#d6eef8" strokeWidth="1.2" fill="none" />
              })}
            </g>
          ) : null}
          {tier >= 5 && summer ? <path d="M12 30 Q40 0 68 30" stroke={P.red} strokeWidth="1" fill="none" opacity=".5" /> : null}
          {tier >= 5 && summer ? <path d="M14 30 Q40 3 66 30" stroke={P.yellow} strokeWidth="1" fill="none" opacity=".5" /> : null}
        </Svg>
      )
    }
    case 'aussichtsturm': {
      const h = 22 + tier * 6
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={24} />
          <path d={`M30 64 L36 ${64 - h} H44 L50 64`} stroke={P.woodDark} strokeWidth="2" fill="none" />
          {Array.from({ length: Math.floor(h / 8) }, (_, i) => {
            const y = 64 - (i + 1) * 8
            const t = (64 - y) / h
            return <path key={i} d={`M${30 + 6 * t} ${y} L${50 - 6 * t} ${y + 8}M${50 - 6 * t} ${y} L${30 + 6 * t} ${y + 8}`} stroke={P.woodMid} strokeWidth=".7" />
          })}
          <rect x="33" y={64 - h - 4} width="14" height="4" fill={P.paper} stroke={P.outlineWood} strokeWidth=".6" />
          <Roof x={33} w={14} y={64 - h - 4} color="#b8403a" steep={6} />
          {tier >= 3 ? <path d={`M40 ${64 - h - 10}v-6l4 1.6-4 1.6`} fill={P.blue} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {tier >= 4 ? <Person x={38} y={64 - h - 0.6} c={P.red} s={0.5} /> : null}
          {tier >= 2 ? <path d="M54 64h14M56 64v3M66 64v3" stroke={P.outlineWood} strokeWidth="1.2" /> : null}
          {winter ? <Snowcap d={`M32 ${64 - h - 4} L40 ${64 - h - 10} L48 ${64 - h - 4}`} /> : null}
        </Svg>
      )
    }
    case 'festzelt': {
      const w = 40 + tier * 4
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x={40 - w / 2} y="44" width={w} height="20" fill={P.cream} stroke="#bdb3a0" strokeWidth=".6" />
          {Array.from({ length: Math.floor(w / 6) }, (_, i) => (
            <path key={i} d={`M${40 - w / 2 + 3 + i * 6} 44v20`} stroke="#e8e0cc" strokeWidth="1.6" />
          ))}
          <path d={`M${40 - w / 2 - 3} 44 L40 26 L${40 + w / 2 + 3} 44z`} fill={P.cream} stroke="#bdb3a0" strokeWidth=".6" />
          <path d={`M${40 - w / 2 - 3} 44 L40 26 M${40 - w / 4} 44 L40 26 M${40 + w / 4} 44 L40 26`} stroke={P.tomato} strokeWidth="1.4" />
          <path d="M40 26v-6l5 2-5 2" fill={P.tomato} stroke={P.outlineWood} strokeWidth=".5" />
          <path d="M34 64V52 a6 6 0 0 1 12 0 V64" fill="#ffe9a8" />
          {tier >= 3 ? Array.from({ length: 6 }, (_, i) => <circle key={i} className="fest-glow" cx={40 - w / 2 + 4 + i * ((w - 8) / 5)} cy="46" r="1.2" fill="#f5a83a" />) : null}
          {tier >= 4 ? <Person x={28} y={66} c={P.blue} s={0.8} /> : null}
          {tier >= 5 ? <Person x={54} y={66} c={P.leaf} s={0.8} /> : null}
          {winter ? <path d={`M${40 - w / 2} 43 L40 27 L${40 + w / 2} 43`} stroke={P.white} strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'seebuehne':
      return (
        <Svg tier={tier}>
          <Pond cy={56} ry={12} frozen={winter} />
          <path d="M18 54h44v-4h-44z" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M20 54v4M40 54v4M60 54v4" stroke={P.outlineWood} strokeWidth="1.2" />
          <path d="M20 50 Q40 20 60 50" fill="#3d5a8a" opacity=".9" />
          <path d="M26 50 Q40 30 54 50" fill="#2f4a78" />
          {tier >= 2 ? <Person x={34} y={50} c={P.red} s={0.8} /> : null}
          {tier >= 3 ? <Person x={46} y={50} c={P.yellow} s={0.8} /> : null}
          {tier >= 3 ? (
            <g stroke={P.white} strokeWidth=".6" fill="none" opacity=".8">
              <path d="M30 36l-2 -3M50 36l2 -3" />
            </g>
          ) : null}
          {tier >= 4 ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={24 + i * 8} cy={47 - Math.sin((i / 4) * Math.PI) * 10} r="1.2" fill="#ffe9a8" />) : null}
          {tier >= 5 && !winter ? <path d="M8 66q4 -2 8 0M64 66q4 -2 8 0" stroke={P.white} strokeWidth=".8" fill="none" /> : null}
        </Svg>
      )
    case 'ehrenpavillon':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <ellipse cx="40" cy="62" rx="22" ry="4" fill="#efe6d0" stroke="#bdb3a0" strokeWidth=".6" />
          {[24, 34, 46, 56].map((x) => (
            <rect key={x} x={x - 1.4} y="40" width="2.8" height="22" fill={P.cream} stroke="#bdb3a0" strokeWidth=".4" />
          ))}
          <rect x="20" y="37" width="40" height="4" fill="#fbf3e0" stroke="#bdb3a0" strokeWidth=".5" />
          <path d="M20 37 Q40 12 60 37z" fill={tier >= 3 ? '#e0a21a' : '#a5b8a0'} stroke="#8a6a20" strokeWidth=".6" />
          <path d="M28 33 Q32 27.4 37 25.6" stroke={P.white} strokeWidth="1" fill="none" opacity=".6" />
          {tier >= 2 ? <circle cx="40" cy="19" r="1.8" fill="#e0a21a" /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="36" y="52" width="8" height="10" fill="#bdb3a0" />
              <path d="M37 52 l3 -6 3 6z" fill="#e0a21a" />
            </g>
          ) : null}
          {tier >= 5 ? Array.from({ length: 6 }, (_, i) => <circle key={i} cx={20 + i * 8} cy={66} r="1.4" fill={bloom ? [P.red, P.yellow, P.cream][i % 3] : '#c9d0c4'} />) : null}
          {winter ? <path d="M22 35 Q40 13 58 35" stroke={P.white} strokeWidth="1.8" fill="none" /> : null}
          {tier >= 3 ? <Pot x={10} y={64} s={0.5} /> : null}
        </Svg>
      )
    case 'gedenkgarten':
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {bloom
            ? Array.from({ length: 6 + tier * 4 }, (_, i) => <Flower s={0.7} key={i} x={8 + ((i * 17) % 64)} y={54 + ((i * 11) % 11) + 3.53} c={spring || summer ? '#6a9ae0' : '#9ab0d0'} r={1.03} center="#f5e08a" />)
            : null}
          <path d="M36 58 a4 4 0 0 1 4 -4 a4 4 0 0 1 4 4 l-4 5z" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" transform="translate(0 -2)" />
          {tier >= 2 ? (
            <g>
              <path d="M48 52h20" stroke={P.woodDark} strokeWidth="2.4" />
              <path d="M48 47h20" stroke={P.woodDark} strokeWidth="1.6" />
              <path d="M50 52v5M66 52v5M50 47v5M66 47v5" stroke={P.outlineWood} strokeWidth="1" />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <path d="M16 60 V44" stroke={P.leafMoss} strokeWidth="1" />
              <circle cx="16" cy="42" r="2.4" fill={bloom ? P.red : '#8a6a5a'} />
              <path d="M16 50 q-3-1-4-3 M16 54 q3-1 4-3" stroke={P.leafMoss} strokeWidth=".8" fill="none" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M28 64 Q24 42 30 30" stroke={P.bark} strokeWidth="2" fill="none" />
              <circle cx="30" cy="28" r="7" fill={winter ? '#c9d0c4' : season === 'autumn' ? '#d9a33a' : '#6ca848'} />
              <circle cx="24" cy="32" r="5" fill={winter ? '#c9d0c4' : season === 'autumn' ? '#d2752c' : P.leafLight} />
            </g>
          ) : null}
          {tier >= 5 ? <Butterfly x={58} y={38} c={P.cream} /> : null}
          {tier >= 5 ? <path d="M38 36c0-3 4-3 4 0l-2 3z" fill={P.pink} className="fest-glow" /> : null}
        </Svg>
      )
  }
  return null
}
