/** Kapitel-Grafik (Bauernhof, Imkerei, Teich): imkerei. */
import type { Season } from '../../ambient'
import { Svg, Window, Hive, Bees, House, Smoke } from '../../HandParts'
import { BlossomTree, Shadow } from '../parts'
import { P } from '../palette'

export function Imkerei({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const winter = season === 'winter'
  const flowering = season === 'spring' || season === 'summer'
  switch (id) {
    case 'bienenhaus':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <rect x="10" y="36" width="60" height="28" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".8" />
          <path d="M6 36 L40 22 L74 36z" fill={P.outlineWood} />
          {Array.from({ length: Math.min(6, 2 + tier) }, (_, i) => (
            <g key={i}>
              <rect x={13 + (i % 6) * 9.4} y="44" width="8" height="12" fill={[P.yellow, P.waterDeep, P.red, P.leafLight, P.orange, P.lilac][i]} stroke="#4a3a2a" strokeWidth=".5" />
              <rect x={15.6 + (i % 6) * 9.4} y="53" width="2.8" height="1.2" fill="#2a1a0a" />
            </g>
          ))}
          {!winter ? <Bees n={Math.min(8, tier * 2)} cy={34} /> : null}
        </Svg>
      )
    case 'lindenallee':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          {Array.from({ length: Math.min(3, 1 + Math.floor(tier / 2)) }, (_, i) => (
            <g key={i} transform={`translate(${18 + i * 22} 64)`}>
              <path d="M-1.6 0L-1 -18Q0 -22 1 -18L1.6 0z" fill={P.bark} />
              <path d="M0 -40 C14 -40 16 -22 0 -18 C-16 -22 -14 -40 0 -40z" fill={winter ? '#9aa88a' : season === 'autumn' ? '#d9a33a' : P.leafLight} />
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
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill="#8a9a5a" opacity=".7" />
          {Array.from({ length: 4 + tier * 2 }, (_, i) => (
            <ellipse key={i} cx={10 + ((i * 13) % 60)} cy={50 + ((i * 7) % 14)} rx="6" ry="3.6" fill={winter ? '#8a7a8a' : flowering || season === 'autumn' ? (i % 2 ? '#a35fb0' : P.lilac) : '#6d7a4a'} />
          ))}
          {tier >= 3 ? <path d="M64 60 L60 38 L68 38z" fill="#3f6a3a" /> : null}
          {tier >= 4 ? <path d="M18 60 L15 44 L21 44z" fill="#3f6a3a" /> : null}
          {tier >= 5 ? <Hive x={40} y={36} color={P.yellow} /> : null}
        </Svg>
      )
    case 'rapsfeld':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="54" rx="36" ry="15" fill={winter ? '#9ab08a' : flowering ? '#e8d23a' : '#8aa04a'} />
          {Array.from({ length: 2 + tier }, (_, r) => (
            <path key={r} d={`M6 ${44 + r * 4} Q40 ${41 + r * 4} 74 ${44 + r * 4}`} stroke={flowering ? '#f5e04a' : '#7a9040'} strokeWidth="2.6" fill="none" />
          ))}
          {flowering ? <Bees n={tier + 1} cy={40} /> : null}
        </Svg>
      )
    case 'kirschhain':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
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
          {tier >= 2 ? <Hive x={66} y={54} color={P.yellow} /> : null}
        </Svg>
      )
    case 'wildblumen':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill={winter ? '#c9d0c4' : P.leafLight} />
          {!winter
            ? Array.from({ length: 8 + tier * 5 }, (_, i) => {
                const x = 8 + ((i * 17) % 64)
                const y = 46 + ((i * 11) % 18)
                const c = [P.red, P.blue, P.cream, P.yellow, P.lilac][i % 5]
                return (
                  <g key={i}>
                    <path d={`M${x} ${y + 4}v-4`} stroke={P.leafMoss} strokeWidth=".6" />
                    <circle cx={x} cy={y} r="1.6" fill={c} />
                  </g>
                )
              })
            : null}
          {!winter ? <Bees n={tier} cy={40} /> : null}
          {tier >= 4 ? <path d="M70 48c2-2 4-2 5 0-1 2-3 2-5 0z" fill={P.orange} className="bee" /> : null}
        </Svg>
      )
    case 'schleuder':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={14} w={40} h={22} wall={P.paper} roof="#a5531a" />
          <rect x="26" y="46" width="16" height="18" fill="#3a2a1a" />
          <ellipse cx="34" cy="56" rx="6" ry="7" fill="#c9d0d8" stroke="#6a7a8a" strokeWidth=".8" />
          <path d="M34 49v14" stroke="#6a7a8a" strokeWidth=".6" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <rect key={i} x={58 + (i % 2) * 7} y={58 - Math.floor(i / 2) * 7} width="5.6" height="6.4" rx="1.4" fill={P.gold} stroke={P.woodMid} strokeWidth=".5" />
          ))}
          {tier >= 3 ? <path d="M36 60q4 4 2 6" stroke={P.gold} strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    case 'wachszieherei':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          {/* Stufe 5: Schornstein mit Rauch (das Wachs wird erwärmt) */}
          {tier >= 5 ? (
            <g>
              <rect x="30" y="30" width="4" height="10" fill={P.stone} stroke={P.outlineStone} strokeWidth=".6" />
              <Smoke x={32} y={28} />
            </g>
          ) : null}
          <House x={10} w={30} h={20} wall="#f5e6b8" roof="#c49a3a" />
          <Window x={16} y={50} lit={tier >= 2} />
          {/* Stufe 3: Tür mit Kerzen-Schild */}
          {tier >= 3 ? (
            <g>
              <rect x="27" y="53" width="7" height="11" fill={P.bark} stroke="#4a3a2a" strokeWidth=".5" />
              <path d="M24 46h8" stroke={P.outlineWood} strokeWidth=".7" />
              <rect x="26" y="47" width="4" height="4" rx=".6" fill="#f5e08a" stroke={P.brass} strokeWidth=".5" />
              <path d="M28 47v-1.4" stroke={P.orange} strokeWidth=".8" />
            </g>
          ) : null}
          {/* Stufe 4: Tauchbottich mit flüssigem Wachs */}
          {tier >= 4 ? (
            <g>
              <path d="M40 64l1-7h8l1 7z" fill={P.stoneDark} stroke={P.outlineStone} strokeWidth=".6" />
              <ellipse cx="45" cy="57" rx="4" ry="1.2" fill="#f5e08a" stroke={P.brass} strokeWidth=".4" />
            </g>
          ) : null}
          <path d="M46 40h28" stroke={P.outlineWood} strokeWidth="1.6" />
          <path d="M48 40v24M72 40v24" stroke={P.outlineWood} strokeWidth="1.4" />
          {Array.from({ length: Math.min(8, 2 + tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${50 + i * 2.8} 40v2`} stroke={P.outlineSoft} strokeWidth=".4" />
              <rect x={49.2 + i * 2.8} y="42" width="1.8" height={8 + (i % 3) * 2} rx=".6" fill={i % 3 === 0 ? P.red : '#f5e08a'} />
            </g>
          ))}
        </Svg>
      )
    case 'metkeller':
      return (
        <Svg tier={tier}>
          <path d="M2 66 Q40 18 78 66z" fill={winter ? '#e8eef0' : P.leafLight} />
          <path d="M28 66V52a12 12 0 0 1 24 0v14z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".8" />
          <path d="M32 66V54a8 8 0 0 1 16 0v12z" fill="#5a3d22" />
          <path d="M40 46v20" stroke="#3a2a1a" strokeWidth=".6" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <ellipse cx={i < 2 ? 12 + i * 8 : 60 + (i - 2) * 8} cy="62" rx="3.8" ry="4.6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
              <path d={`M${(i < 2 ? 12 + i * 8 : 60 + (i - 2) * 8) - 3.6} 60h7.2`} stroke={P.outlineWood} strokeWidth=".6" />
            </g>
          ))}
          {tier >= 3 ? <path d="M38 40c0-3 4-3 4 0l-2 3z" fill={P.gold} /> : null}
        </Svg>
      )
    case 'honigladen':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={14} w={44} h={22} wall="#fbf3e0" roof="#e0a21a" />
          <rect x="20" y="48" width="18" height="10" fill={P.waterLight} stroke={P.outlineWood} strokeWidth=".7" />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <rect key={i} x={21 + (i % 3) * 5.8} y={i < 3 ? 49 : 53.6} width="4.4" height="4" rx="1" fill={P.gold} />
          ))}
          <rect x="44" y="50" width="8" height="14" fill={P.bark} />
          <g transform="translate(36 30)">
            <rect x="-8" y="-4" width="16" height="7" rx="1.4" fill={P.cream} stroke={P.outlineWood} strokeWidth=".6" />
            <ellipse cx="0" cy="-.5" rx="2.4" ry="1.6" fill={P.yellow} stroke="#4a3208" strokeWidth=".4" />
          </g>
          {tier >= 4 ? <Bees n={4} cx={62} cy={40} /> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Teich & Fischerhütte ————————————— */

/** Gesperrte Ecke der Imkerei: Totholz und Gestrüpp. */
export function ImkereiWild() {
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leaf} opacity=".5" />
      <path d="M20 60 L60 54" stroke={P.outlineWood} strokeWidth="4" strokeLinecap="round" />
      <path d="M44 56 l6 -10 M30 58 l-4 -8" stroke={P.outlineWood} strokeWidth="2" strokeLinecap="round" />
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx={14 + i * 12} cy={62 - (i % 2) * 3} rx="6" ry="4" fill={i % 2 ? '#5f7a3a' : P.leaf} />
      ))}
    </Svg>
  )
}
