/** Kapitel-Grafik (Kräuter, Botanik, Alm): alm. */
import type { ReactNode } from 'react'
import { Bees, Cow, Roof, Smoke, Svg, Window } from '../../HandParts'
import { Flower, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Bunting, Butterfly, Conifer, Rock, Snowcap } from './partsA'

function Edelweiss({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 4V0" stroke="#7a8a6a" strokeWidth=".6" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-1.8" rx=".9" ry="1.9" fill="#f6f4ec" stroke="#c9c4b0" strokeWidth=".25" transform={`rotate(${a})`} />
      ))}
      <circle r=".9" fill="#e8d88a" />
    </g>
  )
}

function Gentian({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 4}v-3`} stroke={P.leafMoss} strokeWidth=".6" />
      <path d={`M${x - 1.6} ${y - 2.6}h3.2l-.6 3.6h-2z`} fill="#2e5fc4" />
      <path d={`M${x - 1.6} ${y - 2.6}l-.6 -.8M${x + 1.6} ${y - 2.6}l.6 -.8`} stroke="#2e5fc4" strokeWidth=".7" />
    </g>
  )
}

function Bell({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 1} ${y}h2l.5 2h-3z`} fill="#e0a21a" />
}

function AlmCow({ x, y, flip, brown }: { x: number; y: number; flip?: boolean; brown?: boolean }) {
  return (
    <g>
      <Cow x={x} y={y} flip={flip} brown={brown} />
      <Bell x={x + (flip ? -8 : 8)} y={y + 1} />
    </g>
  )
}

function Slope({ winter, color = P.leafLight }: { winter?: boolean; color?: string }) {
  return <path d="M2 66 Q20 40 78 44 V66z" fill={winter ? '#eef2f4' : color} />
}

export function Alm({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const grass = autumn ? '#b0b864' : P.leafLight
  switch (id) {
    case 'almwiese': {
      const n = 8 + tier * 5
      return (
        <Svg tier={tier}>
          <Slope winter={winter} color={grass} />
          {!winter
            ? Array.from({ length: n }, (_, i) => {
                const x = 8 + ((i * 17) % 66)
                const y = 50 + ((i * 11) % 14)
                const c = [P.cream, P.yellow, P.lilac, P.blue, P.red][i % 5]
                return spring || season === 'summer' || i % 3 === 0 ? <Flower s={0.7} key={i} x={x} y={y + 3.66} c={c!} r={1.22} /> : null
              })
            : null}
          {tier >= 3 ? (
            <g>
              <path d="M58 60V40M54 46h8M55 52h6" stroke={P.outlineWood} strokeWidth="1" />
              {!winter ? <path d="M58 38 Q50 48 54 60 H62 Q66 48 58 38z" fill="#d9c070" stroke="#b8962a" strokeWidth=".5" /> : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M70 58V42M66 48h8M67 54h6" stroke={P.outlineWood} strokeWidth="1" />
              {!winter ? <path d="M70 40 Q63 49 66 58 H74 Q77 49 70 40z" fill="#d9c070" stroke="#b8962a" strokeWidth=".5" /> : null}
            </g>
          ) : null}
          {tier >= 4 && !winter ? <Bees n={3} cy={40} cx={28} /> : null}
        </Svg>
      )
    }
    case 'kuhherde':
      return (
        <Svg tier={tier}>
          <Slope winter={winter} color={grass} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${6 + i * 12} 66 l6 -12`} stroke={P.outlineSoft} strokeWidth="1.4" />
          ))}
          <path d="M4 60 Q40 54 76 58" stroke={P.woodMid} strokeWidth="1.2" fill="none" />
          {!winter ? (
            <>
              <AlmCow x={30} y={50} brown />
              {tier >= 2 ? <AlmCow x={52} y={52} flip /> : null}
              {tier >= 3 ? <AlmCow x={18} y={58} brown /> : null}
              {tier >= 4 ? <AlmCow x={62} y={44} flip brown /> : null}
              {tier >= 5 ? <AlmCow x={42} y={60} /> : null}
            </>
          ) : (
            <g>
              <path d="M30 56 L40 48 L50 56z" fill={P.outlineWood} />
              <rect x="32" y="56" width="16" height="8" fill={P.woodMid} />
              <path d="M30 56 L40 48 L50 56" stroke={P.white} strokeWidth="2" fill="none" />
            </g>
          )}
          {tier >= 4 ? (
            <g>
              <rect x="6" y="44" width="10" height="4" rx="1" fill={P.outlineSoft} />
              <path d="M8 48v3M14 48v3" stroke={P.outlineWood} strokeWidth=".8" />
            </g>
          ) : null}
        </Svg>
      )
    case 'sennhuette':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="14" y="56" width="44" height="8" fill={P.stone} stroke="#7a6e5e" strokeWidth=".6" />
          <rect x="16" y="40" width="40" height="16" fill={P.woodDark} stroke="#5a3a1a" strokeWidth=".7" />
          {[44, 48, 52].map((y) => (
            <path key={y} d={`M16 ${y}h40`} stroke="#5a3a1a" strokeWidth=".5" />
          ))}
          <path d="M8 41 L36 26 L64 41z" fill="#5a4a3a" stroke="#3a2a1a" strokeWidth=".6" />
          {[20, 34, 48].map((x) => (
            <circle key={x} cx={x} cy={35 + Math.abs(x - 34) * 0.18} r="1.6" fill={P.stone} />
          ))}
          <Window x={22} y={44} lit={tier >= 3} />
          <Window x={44} y={44} lit={tier >= 3} />
          <rect x="32" y="46" width="8" height="10" fill="#5a3a1a" />
          {tier >= 2 ? <Smoke x={50} y={28} /> : null}
          {tier >= 2 ? <rect x="48" y="28" width="4" height="6" fill="#7a6e5e" /> : null}
          {tier >= 3 && !winter ? (
            <g>
              <rect x="21" y="49.4" width="8" height="1.6" fill={P.woodDark} />
              <rect x="43" y="49.4" width="8" height="1.6" fill={P.woodDark} />
              {[22, 24, 26, 28, 44, 46, 48, 50].map((x) => (
                <circle key={x} cx={x} cy="48.8" r=".9" fill={P.red} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              {[0, 1, 2].map((k) => (
                <rect key={k} x={60} y={58 - k * 3} width="14" height="3" rx="1.4" fill="#c49a6a" stroke={P.outlineSoft} strokeWidth=".4" />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <path d="M4 62h10M5 62v3M13 62v3" stroke={P.outlineWood} strokeWidth="1.2" /> : null}
          {winter ? <Snowcap d="M9 40 L36 26 L63 40" /> : null}
        </Svg>
      )
    case 'edelweiss': {
      const n = Math.min(9, 2 + tier * 2)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="34" ry="6" fill={winter ? '#eef2f4' : '#9ab07a'} />
          <Rock x={6} y={64} w={30} h={18} snow={winter} />
          <Rock x={40} y={64} w={34} h={22} snow={winter} />
          {!winter
            ? Array.from({ length: n }, (_, i) => (
                <Edelweiss key={i} x={14 + ((i * 13) % 54)} y={48 + ((i * 7) % 12)} s={0.9 + (tier >= 4 ? 0.2 : 0)} />
              ))
            : null}
          {tier >= 5 ? (
            <g>
              <path d="M8 34l6 4M10 34l2 5" stroke={P.outlineWood} strokeWidth=".8" />
              <ellipse cx="66" cy="34" rx="4" ry="2.4" fill={P.woodMid} />
              <circle cx="69" cy="32" r="1.6" fill={P.woodMid} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'enzian': {
      const n = Math.min(16, 4 + tier * 3)
      return (
        <Svg tier={tier}>
          <Slope winter={winter} color={grass} />
          {!winter
            ? Array.from({ length: n }, (_, i) =>
                spring || season === 'summer' || i % 2 ? <Gentian key={i} x={10 + ((i * 13) % 62)} y={52 + ((i * 7) % 11)} /> : null,
              )
            : null}
          {tier >= 3 ? <Rock x={54} y={62} w={16} h={8} snow={winter} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M16 46v-10" stroke={P.outlineWood} strokeWidth="1" />
              <rect x="11" y="32" width="10" height="5" rx="1" fill={P.paper} stroke={P.outlineWood} strokeWidth=".5" />
              <path d="M14 34.5h4" stroke="#2e5fc4" strokeWidth="1.2" />
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={44} y={38} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'bergbach': {
      const water = winter ? '#cfe2ee' : P.water
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="12" fill={winter ? '#eef2f4' : grass} />
          <path d="M8 22 C24 34 18 46 38 52 S66 56 74 66" stroke={P.stone} strokeWidth="14" fill="none" opacity=".7" />
          <path d="M8 22 C24 34 18 46 38 52 S66 56 74 66" stroke={water} strokeWidth={7 + tier} fill="none" strokeLinecap="round" />
          <path d="M8 22 C24 34 18 46 38 52 S66 56 74 66" stroke="#e8f6fc" strokeWidth="1.4" fill="none" strokeDasharray="3 5" className="orchard-stream" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <ellipse key={i} cx={12 + i * 11} cy={30 + i * 6 + (i % 2) * 4} rx="3" ry="2" fill={P.stone} stroke="#7a6e5e" strokeWidth=".4" />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M28 54 Q38 46 48 54" stroke={P.woodDark} strokeWidth="3" fill="none" />
              <path d="M28 52 Q38 44 48 52" stroke={P.outlineWood} strokeWidth=".8" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g className="ha-wheel">
              <circle cx="66" cy="54" r="7" fill="none" stroke={P.woodDark} strokeWidth="1.6" />
              <path d="M59 54h14M66 47v14M61 49l10 10M71 49l-10 10" stroke={P.woodDark} strokeWidth="1" />
            </g>
          ) : null}
          {tier >= 4 ? <Conifer x={66} y={36} s={0.55} snow={winter} /> : null}
        </Svg>
      )
    }
    case 'kaesekeller': {
      const wheels = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <path d="M2 66 Q30 22 78 40 V66z" fill={winter ? '#eef2f4' : grass} />
          <path d="M22 66V48a12 12 0 0 1 24 0v18z" fill={P.stone} stroke="#7a6e5e" strokeWidth=".8" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${24 + k * 6} ${44 - (k === 1 || k === 2 ? 2 : 0)}l2 -3`} stroke="#7a6e5e" strokeWidth=".5" />
          ))}
          <path d="M27 66V50a7 7 0 0 1 14 0v16z" fill="#5a3a1a" />
          <circle cx="38" cy="58" r=".8" fill="#e0a21a" />
          <rect x="50" y="52" width="24" height="2" fill={P.woodDark} />
          <rect x="50" y="60" width="24" height="2" fill={P.woodDark} />
          <path d="M51 52v14M73 52v14" stroke={P.outlineWood} strokeWidth="1.2" />
          {Array.from({ length: wheels }, (_, i) => (
            <g key={i}>
              <ellipse cx={55 + (i % 3) * 7} cy={i < 3 ? 49.6 : 57.6} rx="3.2" ry="2.4" fill="#f0c860" stroke="#b8862a" strokeWidth=".5" />
              <path d={`M${52 + (i % 3) * 7} ${i < 3 ? 49.6 : 57.6}h6`} stroke="#b8862a" strokeWidth=".4" />
            </g>
          ))}
          {tier >= 4 ? <path d="M14 64h6l-1 -6h-4z" fill="#c9d0d8" stroke="#6a7a8a" strokeWidth=".5" /> : null}
          {tier >= 5 ? <path d="M34 36v-6M30 34h8" stroke={P.outlineWood} strokeWidth="1" /> : null}
        </Svg>
      )
    }
    case 'seilbahn': {
      const gondolas = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier}>
          <path d="M0 66 V58 Q34 46 58 22 Q68 12 80 12 V66z" fill={winter ? '#eef2f4' : '#9ab07a'} opacity=".45" />
          <path d="M8 58 L72 18" stroke="#4a4a4a" strokeWidth=".8" />
          <path d="M8 61 L72 21" stroke="#4a4a4a" strokeWidth=".5" />
          <path d="M36 64 L40 40 L44 64 M37 56h6M38 48h4" stroke="#7a7a8a" strokeWidth="1.2" fill="none" />
          {Array.from({ length: gondolas }, (_, i) => {
            const t = 0.2 + i * 0.3
            const x = 8 + 64 * t
            const y = 58 - 40 * t
            return (
              <g key={i} className="ha-swim">
                <path d={`M${x} ${y}v4`} stroke="#4a4a4a" strokeWidth=".6" />
                <rect x={x - 4} y={y + 4} width="8" height="6" rx="1.4" fill={[P.tomato, P.blue, P.yellow][i]} stroke="#4a3a2a" strokeWidth=".5" />
                <rect x={x - 3} y={y + 5} width="6" height="2.4" fill="#cfe8f4" />
              </g>
            )
          })}
          <rect x="2" y="56" width="14" height="10" fill={P.paper} stroke={P.outlineWood} strokeWidth=".6" />
          <Roof x={2} w={14} y={56} color="#b8403a" steep={6} />
          {tier >= 4 ? (
            <g>
              <rect x="64" y="14" width="14" height="10" fill={P.paper} stroke={P.outlineWood} strokeWidth=".6" />
              <Roof x={64} w={14} y={14} color="#b8403a" steep={6} />
            </g>
          ) : null}
          {winter ? <Snowcap d="M0 56 L9 50 L18 56" /> : null}
          {tier >= 3 ? <Conifer x={8} y={64} s={0.5} /> : null}
        </Svg>
      )
    }
    case 'gipfelhuette':
      return (
        <Svg tier={tier}>
          <path d="M2 66 L30 16 L44 30 L52 22 L78 66z" fill="#9aa8b6" />
          <path d="M30 16 L22 30 L28 28 L32 32 L38 24z M52 22 L48 30 L54 28 L58 32z" fill={P.white} />
          {winter ? <path d="M10 52 L30 16 L52 22 L70 52" stroke={P.white} strokeWidth="3" fill="none" opacity=".8" /> : null}
          <rect x="24" y="48" width="26" height="14" fill={P.woodDark} stroke="#5a3a1a" strokeWidth=".6" />
          <Roof x={24} w={26} y={48} color="#5a4a3a" steep={8} />
          <Window x={28} y={52} lit={tier >= 2} />
          <rect x="39" y="53" width="6" height="9" fill="#5a3a1a" />
          {tier >= 3 ? (
            <g>
              <path d="M30 16V4M26 8h8" stroke={P.outlineWood} strokeWidth="1.4" />
            </g>
          ) : null}
          {tier >= 4 ? <path d="M54 48v-12l6 2.4-6 2.4" fill={P.tomato} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {tier >= 5 ? (
            <g>
              <circle cx="14" cy="60" r="1.6" fill={P.skin} />
              <path d="M14 61.6v4M12 63h4" stroke={P.blue} strokeWidth="1.2" />
              <path d="M16 60l2 6" stroke={P.outlineSoft} strokeWidth=".6" />
            </g>
          ) : null}
          {winter ? <Snowcap d="M21 48 L37 40 L53 48" /> : null}
          {tier >= 2 ? <Rock x={60} y={64} w={10} h={5} /> : null}
        </Svg>
      )
    case 'almfest':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="9" fill={winter ? '#eef2f4' : grass} />
          <rect x="16" y="48" width="36" height="6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M18 48V32M50 48V32" stroke={P.outlineWood} strokeWidth="1.4" />
          <path d="M14 32 L34 24 L54 32z" fill={P.woodDark} />
          <Bunting y={20} n={Math.min(9, 3 + tier)} />
          <path d="M56 58 Q66 58 70 40" stroke={P.woodDark} strokeWidth="2" fill="none" />
          <path d="M68 40 q3 -2 5 1 l-3 1z" fill={P.woodDark} />
          {tier >= 2 ? (
            <g fill="#4a3a2a">
              <circle cx="28" cy="44" r="1.6" />
              <rect x="27" y="45.4" width="2" height="3" />
              {tier >= 3 ? (
                <>
                  <circle cx="40" cy="44" r="1.6" />
                  <rect x="39" y="45.4" width="2" height="3" />
                </>
              ) : null}
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <rect x="6" y="60" width="16" height="2" fill={P.woodMid} />
              <path d="M8 62v4M20 62v4" stroke={P.outlineWood} strokeWidth="1" />
              {[9, 13, 17].map((x) => (
                <rect key={x} x={x} y="57" width="2.4" height="3" fill="#f5e08a" stroke={P.woodMid} strokeWidth=".3" />
              ))}
            </g>
          ) : null}
          {tier >= 4
            ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={8 + i * 16} cy={22 + (i % 2) * 3} r="1.6" fill="#f5a83a" />)
            : null}
          {tier >= 5 ? (
            <g>
              <path d="M62 66V30" stroke={P.cream} strokeWidth="1.8" />
              <path d="M62 30 q-4 4 0 8 q4 -4 0 -8" fill={P.leaf} />
              <path d="M58 40l8 2M58 46l8 2" stroke={P.blue} strokeWidth="1" />
            </g>
          ) : null}
        </Svg>
      )
  }
  return null
}
