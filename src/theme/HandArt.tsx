/**
 * Hand-drawn art for Kapitel 4–6 (Bauernhof, Imkerei, Teich) — Kapitel 7–9 live
 * in HandArtA.tsx. One motif per area with visible growth over the five tiers
 * (1 / 10 / 25 / 50 / 100). Other chapters use the generic ChapterArt.
 */
import { memo, type ReactNode } from 'react'
import type { ChapterId } from '../game/chapters'
import type { Season } from './ambient'
import { moduleTier } from './tiers'
import { Alm, Botanik, Kraeuter, WildA } from './HandArtA'

import { Svg, Shadow, Meadow, Fence, Cow, Goat, Pig, Bird, Roof, Window, Smoke, Crate, Pond, Lily, Reed, Fish, Boat, Hive, Bees, BlossomTree, House } from './HandParts'

/* ————————————— Bauernhof ————————————— */

function Bauernhof({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const winter = season === 'winter'
  switch (id) {
    case 'kuhweide':
      return (
        <Svg>
          <Meadow winter={winter} />
          <Fence y={62} />
          {tier >= 4 ? (
            <g>
              <rect x="56" y="32" width="18" height="12" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".7" />
              <Roof x={56} w={18} y={32} color="#8a3a2a" steep={8} />
            </g>
          ) : null}
          {tier >= 3 ? <rect x="12" y="44" width="12" height="4" rx="1" fill="#8a6a40" /> : null}
          <Cow x={30} y={50} />
          {tier >= 2 ? <Cow x={50} y={54} flip brown /> : null}
          {tier >= 3 ? <Cow x={22} y={58} brown /> : null}
          {tier >= 5 ? <Cow x={58} y={46} flip /> : null}
        </Svg>
      )
    case 'ziegenstall':
      return (
        <Svg>
          <Shadow />
          <House x={46} w={22} h={14} wall="#c9a46b" roof="#6e4a2b" steep={9} />
          <path d="M10 64 Q20 34 34 40 Q42 50 40 64z" fill="#a69a84" stroke="#7a6e5a" strokeWidth=".8" />
          <path d="M18 50l6-4M26 56l6-3" stroke="#7a6e5a" strokeWidth=".6" />
          <Goat x={52} y={60} />
          {tier >= 2 ? <Goat x={16} y={58} flip /> : null}
          {tier >= 3 ? <Goat x={24} y={42} /> : null}
          {tier >= 5 ? <Goat x={66} y={60} flip /> : null}
          {tier >= 4 ? <path d="M57 40l2-6 2 6" fill="#f5c542" /> : null}
        </Svg>
      )
    case 'schweinekoben':
      return (
        <Svg>
          <Meadow winter={winter} />
          <ellipse cx="40" cy="56" rx="24" ry="8" fill="#7a5532" />
          <ellipse cx="34" cy="55" rx="10" ry="3" fill="#8a6a40" opacity=".6" />
          <Fence y={64} x0={8} x1={72} />
          <Pig x={32} y={52} />
          {tier >= 2 ? <Pig x={50} y={56} flip /> : null}
          {tier >= 3 ? <Pig x={22} y={58} s={0.6} /> : null}
          {tier >= 3 ? <Pig x={42} y={60} s={0.6} flip /> : null}
          {tier >= 4 ? <rect x="58" y="44" width="14" height="5" rx="1.4" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" /> : null}
          {tier >= 5 ? <Pig x={62} y={58} s={0.6} /> : null}
        </Svg>
      )
    case 'gaensewiese':
      return (
        <Svg>
          <Meadow winter={winter} />
          <Pond cx={58} cy={50} rx={14} ry={6} frozen={winter} />
          <Bird x={24} y={54} />
          {tier >= 2 ? <Bird x={36} y={58} flip /> : null}
          {tier >= 3 ? <Bird x={16} y={46} /> : null}
          {tier >= 4 ? <Bird x={58} y={48} swim /> : null}
          {tier >= 5 ? <Bird x={46} y={46} flip /> : null}
        </Svg>
      )
    case 'kartoffelacker': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill="#8a6a40" opacity=".7" />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M8 ${64 - r * 5}H72`} stroke="#6e4a2b" strokeWidth="2" opacity=".5" />
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i}>
                  <ellipse cx={11 + i * 8.6} cy={61 - r * 5} rx="3.4" ry="2.4" fill={winter ? '#b8b094' : '#6f9a48'} />
                  {!winter && season !== 'spring' ? <circle cx={11 + i * 8.6} cy={59.6 - r * 5} r=".9" fill={i % 2 ? '#fbf6e8' : '#c7a3e0'} /> : null}
                </g>
              ))}
            </g>
          ))}
          {tier >= 4 ? <Crate x={64} y={40} fruit="#c9a46b" /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M12 46V28M6 34h12" stroke="#8a6a40" strokeWidth="1.6" />
              <circle cx="12" cy="26" r="3" fill="#f2c9a0" />
              <path d="M7 25h10l-2-3h-6z" fill="#c9a46b" />
              <path d="M8 34l4 6 4-6z" fill="#3d5a8a" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'heuscheune':
      return (
        <Svg>
          <Shadow rx={34} />
          <rect x="14" y="34" width="40" height="30" fill="#b8403a" stroke="#6e2a22" strokeWidth=".8" />
          <path d="M10 34 L34 16 L58 34z" fill="#6e2a22" />
          <rect x="26" y="44" width="16" height="20" fill="#fbf6e8" />
          <path d="M26 44l16 20M42 44L26 64" stroke="#b8403a" strokeWidth="1.6" />
          <rect x="30" y="26" width="8" height="6" fill="#d9b34a" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <ellipse cx={60 + (i % 2) * 9} cy={61 - Math.floor(i / 2) * 7} rx="5" ry="4" fill="#e8c770" stroke="#b8962a" strokeWidth=".6" />
              <path d={`M${57 + (i % 2) * 9} ${61 - Math.floor(i / 2) * 7}h6`} stroke="#c49a3a" strokeWidth=".6" />
            </g>
          ))}
          {tier >= 5 ? <path d="M34 16V9M31 9h6M34 9l3 -2" stroke="#4a3a2a" strokeWidth="1" /> : null}
          {winter ? <path d="M10 34 L34 16 L58 34" stroke="#fff" strokeWidth="2.4" fill="none" /> : null}
        </Svg>
      )
    case 'melkhaus':
      return (
        <Svg>
          <Shadow />
          <House x={18} w={30} h={20} wall="#f5f0e0" roof="#6e4a2b" />
          <rect x="29" y="52" width="8" height="12" fill="#7a5532" />
          <Window x={21} y={50} lit={tier >= 3} />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${54 + i * 6} 64v-9l1-2h3l1 2v9z`} fill="#c9d0d8" stroke="#6a7a8a" strokeWidth=".6" />
              <rect x={54.6 + i * 6} y="51.6" width="3.8" height="1.4" fill="#6a7a8a" />
            </g>
          ))}
          {tier >= 4 ? <circle cx="12" cy="60" r="4" fill="none" stroke="#8a6a40" strokeWidth="1.2" /> : null}
        </Svg>
      )
    case 'kaeserei':
      return (
        <Svg>
          <Shadow />
          <House x={12} w={34} h={22} wall="#f3e6c8" roof="#a5531a" timber />
          <Window x={38} y={48} lit={tier >= 3} />
          <rect x="50" y="48" width="22" height="2" fill="#8a6a40" />
          <rect x="50" y="57" width="22" height="2" fill="#8a6a40" />
          <path d="M51 48v16M71 48v16" stroke="#8a6a40" strokeWidth="1.4" />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <ellipse key={i} cx={55 + (i % 3) * 6} cy={i < 3 ? 46 : 55} rx="2.8" ry="1.8" fill="#f5c542" stroke="#b8862a" strokeWidth=".5" />
          ))}
        </Svg>
      )
    case 'hofbaeckerei':
      return (
        <Svg>
          <Shadow />
          <House x={10} w={30} h={20} wall="#efe1c2" roof="#b8403a" />
          <Window x={16} y={50} lit />
          <path d="M44 64 A12 12 0 0 1 68 64z" fill="#c9bfa8" stroke="#8a7a6a" strokeWidth=".8" />
          <path d="M51 64 A5 5 0 0 1 61 64z" fill={tier >= 2 ? '#e0731a' : '#4a3a2a'} />
          <rect x="60" y="44" width="4" height="10" fill="#8a7a6a" />
          {tier >= 2 ? <Smoke x={62} y={42} /> : null}
          {Array.from({ length: Math.min(3, tier) }, (_, i) => (
            <ellipse key={i} cx={20 + i * 7} cy={66} rx="3" ry="1.6" fill="#c4783a" stroke="#8a4a20" strokeWidth=".5" />
          ))}
        </Svg>
      )
    case 'bauernmarkt':
      return (
        <Svg>
          <Shadow rx={34} />
          {Array.from({ length: Math.min(3, 1 + Math.floor(tier / 2)) }, (_, i) => {
            const x = 8 + i * 23
            const colors = ['#e2453c', '#3d8db8', '#5f9e45']
            return (
              <g key={i}>
                <path d={`M${x} 44h20l-2 5h-16z`} fill={colors[i]} />
                <path d={`M${x + 4} 44l-1 5M${x + 10} 44v5M${x + 16} 44l1 5`} stroke="#fff" strokeWidth="2" opacity=".8" />
                <path d={`M${x + 2} 49v15M${x + 18} 49v15`} stroke="#8a6a40" strokeWidth="1.2" />
                <rect x={x + 1} y="56" width="18" height="3" fill="#a5733f" />
                <Crate x={x + 2} y={52} fruit={['#e0485e', '#f08a2c', '#7fbf5a'][i]!} />
                <Crate x={x + 11} y={52} fruit={['#f5c542', '#c9a46b', '#6b3a78'][i]!} />
              </g>
            )
          })}
        </Svg>
      )
  }
  return null
}

/* ————————————— Imkerei ————————————— */

function Imkerei({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const winter = season === 'winter'
  const flowering = season === 'spring' || season === 'summer'
  switch (id) {
    case 'bienenhaus':
      return (
        <Svg>
          <Shadow />
          <rect x="10" y="36" width="60" height="28" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".8" />
          <path d="M6 36 L40 22 L74 36z" fill="#6e4a2b" />
          {Array.from({ length: Math.min(6, 2 + tier) }, (_, i) => (
            <g key={i}>
              <rect x={13 + (i % 6) * 9.4} y="44" width="8" height="12" fill={['#f5c542', '#3d8db8', '#e0485e', '#7fbf5a', '#f08a2c', '#c77dd1'][i]} stroke="#4a3a2a" strokeWidth=".5" />
              <rect x={15.6 + (i % 6) * 9.4} y="53" width="2.8" height="1.2" fill="#2a1a0a" />
            </g>
          ))}
          {!winter ? <Bees n={Math.min(8, tier * 2)} cy={34} /> : null}
        </Svg>
      )
    case 'lindenallee':
      return (
        <Svg>
          <Shadow rx={34} />
          {Array.from({ length: Math.min(3, 1 + Math.floor(tier / 2)) }, (_, i) => (
            <g key={i} transform={`translate(${18 + i * 22} 64)`}>
              <path d="M-1.6 0L-1 -18Q0 -22 1 -18L1.6 0z" fill="#7a5532" />
              <path d="M0 -40 C14 -40 16 -22 0 -18 C-16 -22 -14 -40 0 -40z" fill={winter ? '#9aa88a' : season === 'autumn' ? '#d9a33a' : '#7fae58'} />
              {flowering
                ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={-6 + (k % 3) * 6} cy={-34 + Math.floor(k / 3) * 8} r="1.4" fill="#f5e08a" />)
                : null}
            </g>
          ))}
          {flowering ? <Bees n={tier} cy={22} /> : null}
        </Svg>
      )
    case 'heide':
      return (
        <Svg>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill="#8a9a5a" opacity=".7" />
          {Array.from({ length: 4 + tier * 2 }, (_, i) => (
            <ellipse key={i} cx={10 + ((i * 13) % 60)} cy={50 + ((i * 7) % 14)} rx="6" ry="3.6" fill={winter ? '#8a7a8a' : flowering || season === 'autumn' ? (i % 2 ? '#a35fb0' : '#c77dd1') : '#6d7a4a'} />
          ))}
          {tier >= 3 ? <path d="M64 60 L60 38 L68 38z" fill="#3f6a3a" /> : null}
          {tier >= 4 ? <path d="M18 60 L15 44 L21 44z" fill="#3f6a3a" /> : null}
          {tier >= 5 ? <Hive x={40} y={36} color="#f5c542" /> : null}
        </Svg>
      )
    case 'rapsfeld':
      return (
        <Svg>
          <ellipse cx="40" cy="54" rx="36" ry="15" fill={winter ? '#9ab08a' : flowering ? '#e8d23a' : '#8aa04a'} />
          {Array.from({ length: 2 + tier }, (_, r) => (
            <path key={r} d={`M6 ${44 + r * 4} Q40 ${41 + r * 4} 74 ${44 + r * 4}`} stroke={flowering ? '#f5e04a' : '#7a9040'} strokeWidth="2.6" fill="none" />
          ))}
          {flowering ? <Bees n={tier + 1} cy={40} /> : null}
        </Svg>
      )
    case 'kirschhain':
      return (
        <Svg>
          <Shadow rx={34} />
          <BlossomTree x={40} y={64} s={0.9 + tier * 0.04} winter={winter} color={season === 'spring' ? '#f7c6d9' : season === 'summer' ? '#6ca848' : '#d2752c'} />
          {tier >= 3 ? <BlossomTree x={18} y={64} s={0.7} winter={winter} color={season === 'spring' ? '#fbe0ea' : '#6ca848'} /> : null}
          {tier >= 4 ? <BlossomTree x={62} y={64} s={0.7} winter={winter} color={season === 'spring' ? '#fbe0ea' : '#6ca848'} /> : null}
          {season === 'spring' ? (
            <g fill="#f7c6d9">
              {[[20, 60], [50, 62], [60, 58], [30, 63]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="1" />
              ))}
            </g>
          ) : null}
        </Svg>
      )
    case 'wildblumen':
      return (
        <Svg>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill={winter ? '#c9d0c4' : '#7fae58'} />
          {!winter
            ? Array.from({ length: 8 + tier * 5 }, (_, i) => {
                const x = 8 + ((i * 17) % 64)
                const y = 46 + ((i * 11) % 18)
                const c = ['#e0485e', '#3d6fd1', '#fbf6e8', '#f5c542', '#c77dd1'][i % 5]
                return (
                  <g key={i}>
                    <path d={`M${x} ${y + 4}v-4`} stroke="#4f7a2e" strokeWidth=".6" />
                    <circle cx={x} cy={y} r="1.6" fill={c} />
                  </g>
                )
              })
            : null}
          {!winter ? <Bees n={tier} cy={40} /> : null}
          {tier >= 4 ? <path d="M70 48c2-2 4-2 5 0-1 2-3 2-5 0z" fill="#f08a2c" className="bee" /> : null}
        </Svg>
      )
    case 'schleuder':
      return (
        <Svg>
          <Shadow />
          <House x={14} w={40} h={22} wall="#efe1c2" roof="#a5531a" />
          <rect x="26" y="46" width="16" height="18" fill="#3a2a1a" />
          <ellipse cx="34" cy="56" rx="6" ry="7" fill="#c9d0d8" stroke="#6a7a8a" strokeWidth=".8" />
          <path d="M34 49v14" stroke="#6a7a8a" strokeWidth=".6" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <rect key={i} x={58 + (i % 2) * 7} y={58 - Math.floor(i / 2) * 7} width="5.6" height="6.4" rx="1.4" fill="#e8b422" stroke="#a5733f" strokeWidth=".5" />
          ))}
          {tier >= 3 ? <path d="M36 60q4 4 2 6" stroke="#e8b422" strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    case 'wachszieherei':
      return (
        <Svg>
          <Shadow />
          <House x={10} w={30} h={20} wall="#f5e6b8" roof="#c49a3a" />
          <Window x={16} y={50} lit={tier >= 2} />
          <path d="M46 40h28" stroke="#6e4a2b" strokeWidth="1.6" />
          <path d="M48 40v24M72 40v24" stroke="#6e4a2b" strokeWidth="1.4" />
          {Array.from({ length: Math.min(8, 2 + tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${50 + i * 2.8} 40v2`} stroke="#8a6a40" strokeWidth=".4" />
              <rect x={49.2 + i * 2.8} y="42" width="1.8" height={8 + (i % 3) * 2} rx=".6" fill={i % 3 === 0 ? '#e0485e' : '#f5e08a'} />
            </g>
          ))}
        </Svg>
      )
    case 'metkeller':
      return (
        <Svg>
          <path d="M2 66 Q40 18 78 66z" fill={winter ? '#e8eef0' : '#7fae58'} />
          <path d="M28 66V52a12 12 0 0 1 24 0v14z" fill="#a69a84" stroke="#7a6e5a" strokeWidth=".8" />
          <path d="M32 66V54a8 8 0 0 1 16 0v12z" fill="#5a3d22" />
          <path d="M40 46v20" stroke="#3a2a1a" strokeWidth=".6" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <ellipse cx={i < 2 ? 12 + i * 8 : 60 + (i - 2) * 8} cy="62" rx="3.8" ry="4.6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" />
              <path d={`M${(i < 2 ? 12 + i * 8 : 60 + (i - 2) * 8) - 3.6} 60h7.2`} stroke="#6e4a2b" strokeWidth=".6" />
            </g>
          ))}
          {tier >= 3 ? <path d="M38 40c0-3 4-3 4 0l-2 3z" fill="#e8b422" /> : null}
        </Svg>
      )
    case 'honigladen':
      return (
        <Svg>
          <Shadow />
          <House x={14} w={44} h={22} wall="#fbf3e0" roof="#e0a21a" />
          <rect x="20" y="48" width="18" height="10" fill="#8fd0ec" stroke="#6e4a2b" strokeWidth=".7" />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <rect key={i} x={21 + (i % 3) * 5.8} y={i < 3 ? 49 : 53.6} width="4.4" height="4" rx="1" fill="#e8b422" />
          ))}
          <rect x="44" y="50" width="8" height="14" fill="#7a5532" />
          <g transform="translate(36 30)">
            <rect x="-8" y="-4" width="16" height="7" rx="1.4" fill="#fbf6e8" stroke="#6e4a2b" strokeWidth=".6" />
            <ellipse cx="0" cy="-.5" rx="2.4" ry="1.6" fill="#f5c542" stroke="#4a3208" strokeWidth=".4" />
          </g>
          {tier >= 4 ? <Bees n={4} cx={62} cy={40} /> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Teich & Fischerhütte ————————————— */

function Teich({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const frozen = season === 'winter'
  switch (id) {
    case 'seerosen':
      return (
        <Svg>
          <Pond frozen={frozen} />
          {!frozen
            ? Array.from({ length: Math.min(7, 2 + tier) }, (_, i) => (
                <Lily key={i} x={16 + ((i * 11) % 48)} y={46 + ((i * 7) % 12)} flower={i % 2 === 0 || tier >= 4 ? (i % 3 ? '#fbf6e8' : '#f28ab2') : undefined} />
              ))
            : null}
          {tier >= 3 && !frozen ? (
            <g transform="translate(52 48)">
              <ellipse cx="0" cy="0" rx="2.6" ry="1.8" fill="#4f8a3a" />
              <circle cx="-1" cy="-1.4" r=".7" fill="#fff" />
              <circle cx="1" cy="-1.4" r=".7" fill="#fff" />
            </g>
          ) : null}
        </Svg>
      )
    case 'schilf':
      return (
        <Svg>
          <Pond cy={56} ry={10} frozen={frozen} />
          {Array.from({ length: 5 + tier * 2 }, (_, i) => (
            <Reed key={i} x={8 + ((i * 9) % 64)} h={18 + ((i * 7) % 14)} />
          ))}
          {tier >= 3 && season !== 'winter' ? (
            <path className="bee" d="M60 30h8M64 30l-2-2M64 30l-2 2M64 30l2-2M64 30l2 2" stroke="#3d8db8" strokeWidth=".8" />
          ) : null}
          {tier >= 4 ? (
            <g transform="translate(30 30)">
              <ellipse cx="0" cy="0" rx="3" ry="2" fill="#a5733f" />
              <circle cx="2.6" cy="-1.4" r="1.4" fill="#a5733f" />
              <path d="M3.8 -1.4l1.6 .4" stroke="#4a3a2a" strokeWidth=".6" />
            </g>
          ) : null}
        </Svg>
      )
    case 'karpfenteich':
      return (
        <Svg>
          <Pond frozen={frozen} />
          {!frozen
            ? Array.from({ length: Math.min(6, 1 + tier) }, (_, i) => (
                <Fish key={i} x={20 + ((i * 13) % 40)} y={48 + ((i * 5) % 10)} color={i % 2 ? '#a5733f' : '#8a7a4a'} s={1.1} />
              ))
            : null}
          {tier >= 3 ? (
            <g>
              <rect x="66" y="44" width="6" height="14" fill="#a69a84" stroke="#7a6e5a" strokeWidth=".6" />
              <path d="M66 48h6" stroke="#6e4a2b" strokeWidth="1.4" />
            </g>
          ) : null}
          {tier >= 5 ? <Lily x={22} y={44} flower="#fbf6e8" /> : null}
        </Svg>
      )
    case 'forellenbach':
      return (
        <Svg>
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke="#7a8a4c" strokeWidth="16" fill="none" opacity=".5" />
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke={frozen ? '#cfe2ee' : '#6aa6c9'} strokeWidth={9 + tier} fill="none" strokeLinecap="round" />
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke="#d6eef8" strokeWidth="1.6" fill="none" strokeDasharray="4 6" className="orchard-stream" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <ellipse key={i} cx={14 + i * 11} cy={34 + i * 5 + (i % 2) * 4} rx="3.6" ry="2.4" fill="#a69a84" stroke="#7a6e5a" strokeWidth=".5" />
          ))}
          {tier >= 3 && !frozen ? (
            <g className="ha-jump">
              <Fish x={44} y={46} color="#c49a8a" />
            </g>
          ) : null}
        </Svg>
      )
    case 'steg':
      return (
        <Svg>
          <Pond frozen={frozen} />
          <rect x="10" y="44" width={24 + tier * 6} height="6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".7" />
          {Array.from({ length: 3 + tier }, (_, i) => (
            <path key={i} d={`M${12 + i * 6} 50v8`} stroke="#6e4a2b" strokeWidth="1.4" />
          ))}
          {tier >= 2 && !frozen ? <Boat x={54} y={56} color="#e2453c" /> : null}
          {tier >= 4 ? <path d="M30 44v-10l6 3-6 3" fill="#f5c542" stroke="#6e4a2b" strokeWidth=".6" /> : null}
        </Svg>
      )
    case 'fischerhuette':
      return (
        <Svg>
          <Pond cy={58} ry={9} frozen={frozen} />
          <path d="M20 58v-6M44 58v-6M32 58v-6" stroke="#6e4a2b" strokeWidth="1.6" />
          <rect x="18" y="36" width="28" height="16" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".8" />
          <Roof x={18} w={28} y={36} color="#3d5a8a" steep={10} />
          <Window x={22} y={41} lit={tier >= 3} />
          <rect x="34" y="42" width="7" height="10" fill="#5a3d22" />
          {tier >= 2 ? (
            <g stroke="#6a5a4a" strokeWidth=".5" fill="none">
              <path d="M50 30h20v18H50z" />
              {Array.from({ length: 5 }, (_, i) => (
                <path key={i} d={`M${50 + i * 4} 30v18M50 ${30 + i * 4}h20`} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <Boat x={62} y={58} color="#3d8db8" /> : null}
        </Svg>
      )
    case 'raeucherei':
      return (
        <Svg>
          <Shadow />
          <House x={20} w={26} h={22} wall="#8a6a40" roof="#4a3a2a" steep={11} />
          <rect x="38" y="30" width="5" height="12" fill="#6e4a2b" />
          <Smoke x={40} y={28} />
          <rect x="27" y="50" width="9" height="14" fill="#3a2a1a" />
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <g key={i}>
              <path d={`M${52 + i * 5} 40v3`} stroke="#6e4a2b" strokeWidth=".4" />
              <path d={`M${52 + i * 5} 43q-1.6 4 0 8q1.6 -4 0 -8z`} fill="#c4783a" />
            </g>
          ))}
          <path d="M50 40h26" stroke="#6e4a2b" strokeWidth="1.2" />
        </Svg>
      )
    case 'bootsverleih':
      return (
        <Svg>
          <Pond frozen={frozen} />
          <rect x="6" y="40" width="40" height="5" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" />
          {[10, 20, 30, 40].map((x) => (
            <path key={x} d={`M${x} 45v7`} stroke="#6e4a2b" strokeWidth="1.2" />
          ))}
          {!frozen
            ? ['#e2453c', '#3d8db8', '#f5c542', '#7fbf5a', '#fbf6e8'].slice(0, Math.min(5, 1 + tier)).map((c, i) => (
                <Boat key={c} x={16 + i * 12} y={54 + (i % 2) * 4} color={c} flip={i % 2 === 1} />
              ))
            : null}
          {tier >= 3 ? (
            <g>
              <rect x="56" y="28" width="16" height="8" rx="1" fill="#fbf6e8" stroke="#6e4a2b" strokeWidth=".6" />
              <path d="M60 36v6M68 36v6" stroke="#6e4a2b" strokeWidth="1" />
            </g>
          ) : null}
        </Svg>
      )
    case 'entenbucht':
      return (
        <Svg>
          <Pond frozen={frozen} />
          <Reed x={66} h={20} />
          <Reed x={70} h={16} />
          <Bird x={26} y={50} color="#8a6a40" neck="#3f7a30" swim />
          {tier >= 2 ? <Bird x={44} y={56} color="#a5733f" neck="#a5733f" swim flip /> : null}
          {tier >= 3 ? <Bird x={34} y={46} color="#a5733f" neck="#a5733f" swim /> : null}
          {tier >= 4 ? <Bird x={54} y={48} color="#f08a2c" neck="#3d6fd1" swim flip /> : null}
          {tier >= 5 ? <Bird x={18} y={56} color="#fbf6e8" neck="#fbf6e8" swim /> : null}
        </Svg>
      )
    case 'seefest':
      return (
        <Svg>
          <Pond frozen={frozen} />
          <rect x="24" y="48" width="32" height="6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" />
          <path d="M26 48V34M54 48V34" stroke="#6e4a2b" strokeWidth="1.4" />
          <path d="M22 34 Q40 24 58 34z" fill="#e2453c" />
          <path d="M4 26 Q40 40 76 26" stroke="#6e4a2b" strokeWidth=".6" fill="none" />
          {Array.from({ length: Math.min(7, 2 + tier) }, (_, i) => {
            const x = 8 + i * 10
            const y = 26 + Math.sin((x / 80) * Math.PI) * 7
            return <circle key={i} className="fest-glow" cx={x} cy={y + 2} r="2" fill={['#f5a83a', '#e0485e', '#8fd0ec', '#f5c542'][i % 4]} />
          })}
          {tier >= 4 ? (
            <g fill="#4a3a2a">
              <circle cx="34" cy="44" r="1.6" />
              <rect x="33" y="45.4" width="2" height="3" />
              <circle cx="46" cy="44" r="1.6" />
              <rect x="45" y="45.4" width="2" height="3" />
            </g>
          ) : null}
        </Svg>
      )
  }
  return null
}

const HAND: Partial<Record<ChapterId, (p: { id: string; tier: number; season?: Season }) => ReactNode>> = {
  bauernhof: Bauernhof,
  imkerei: Imkerei,
  teich: Teich,
  kraeuter: Kraeuter,
  botanik: Botanik,
  alm: Alm,
}

export const HandArt = memo(function HandArt({
  chapter,
  id,
  level,
  season,
}: {
  chapter: ChapterId
  id: string
  level: number
  season?: Season
}) {
  const draw = HAND[chapter]
  if (!draw) return null
  return <>{draw({ id, tier: Math.max(1, moduleTier(level)), season })}</>
})

/** Locked corner, per chapter: brambles + rubble (Hof), dead wood (Imkerei), mud + reeds (Teich). */
export function HandWild({ chapter, seed = 0 }: { chapter: ChapterId; seed?: number }) {
  if (chapter === 'kraeuter' || chapter === 'botanik' || chapter === 'alm') return <WildA chapter={chapter} seed={seed} />
  if (chapter === 'teich') {
    return (
      <Svg>
        <ellipse cx="40" cy="58" rx="28" ry="8" fill="#6e5a3a" opacity=".6" />
        {Array.from({ length: 7 }, (_, i) => (
          <path key={i} d={`M${16 + i * 8} 62q${i % 2 ? 2 : -2} -${12 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${18 + ((i + seed) % 4) * 3}`} stroke="#8a8a5a" strokeWidth="1.4" fill="none" />
        ))}
        <ellipse cx="54" cy="58" rx="6" ry="2" fill="#5f7a8a" opacity=".6" />
      </Svg>
    )
  }
  if (chapter === 'imkerei') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#5f8a3a" opacity=".5" />
        <path d="M20 60 L60 54" stroke="#6e4a2b" strokeWidth="4" strokeLinecap="round" />
        <path d="M44 56 l6 -10 M30 58 l-4 -8" stroke="#6e4a2b" strokeWidth="2" strokeLinecap="round" />
        {Array.from({ length: 5 }, (_, i) => (
          <ellipse key={i} cx={14 + i * 12} cy={62 - (i % 2) * 3} rx="6" ry="4" fill={i % 2 ? '#5f7a3a' : '#6d8a4a'} />
        ))}
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill="#5f8a3a" opacity=".5" />
      <rect x="22" y="50" width="12" height="8" fill="#a69a84" stroke="#7a6e5a" strokeWidth=".6" transform="rotate(-8 28 54)" />
      <path d="M40 60 L58 46 M44 58 L60 52" stroke="#8a6a40" strokeWidth="2" />
      {Array.from({ length: 4 }, (_, i) => (
        <ellipse key={i} cx={16 + i * 16} cy={60 - (i % 2) * 2} rx="8" ry="5" fill={i % 2 ? '#5f7a3a' : '#6d8a4a'} />
      ))}
      {[18, 34, 50].map((x) => (
        <circle key={x} cx={x} cy={56} r="1.2" fill="#3a1838" />
      ))}
    </Svg>
  )
}
