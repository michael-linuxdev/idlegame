/** Kapitel-Grafik (Bauernhof, Imkerei, Teich): bauernhof. */
import type { Season } from '../../ambient'
import { Svg, Meadow, Fence, Cow, Goat, Pig, Roof, Window, Smoke, Pond, House } from '../../HandParts'
import { Bird, Crate, Shadow } from '../parts'
import { P } from '../palette'

export function Bauernhof({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const winter = season === 'winter'
  switch (id) {
    case 'kuhweide':
      return (
        <Svg tier={tier}>
          <Meadow winter={winter} />
          <Fence y={62} />
          {tier >= 4 ? (
            <g>
              <rect x="56" y="32" width="18" height="12" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".7" />
              <Roof x={56} w={18} y={32} color="#8a3a2a" steep={8} />
            </g>
          ) : null}
          {tier >= 3 ? <rect x="12" y="44" width="12" height="4" rx="1" fill={P.outlineSoft} /> : null}
          <Cow x={30} y={50} />
          {tier >= 2 ? <Cow x={50} y={54} flip brown /> : null}
          {tier >= 3 ? <Cow x={22} y={58} brown /> : null}
          {tier >= 5 ? <Cow x={58} y={46} flip /> : null}
        </Svg>
      )
    case 'ziegenstall':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={46} w={22} h={14} wall={P.woodLight} roof={P.outlineWood} steep={9} />
          <path d="M10 64 Q20 34 34 40 Q42 50 40 64z" fill={P.stone} stroke={P.outlineStone} strokeWidth=".8" />
          <path d="M18 50l6-4M26 56l6-3" stroke={P.outlineStone} strokeWidth=".6" />
          <Goat x={52} y={60} />
          {tier >= 2 ? <Goat x={16} y={58} flip /> : null}
          {tier >= 3 ? <Goat x={24} y={42} /> : null}
          {tier >= 5 ? <Goat x={66} y={60} flip /> : null}
          {tier >= 4 ? <path d="M57 40l2-6 2 6" fill={P.yellow} /> : null}
        </Svg>
      )
    case 'schweinekoben':
      return (
        <Svg tier={tier}>
          <Meadow winter={winter} />
          <ellipse cx="40" cy="56" rx="24" ry="8" fill={P.bark} />
          <ellipse cx="34" cy="55" rx="10" ry="3" fill={P.outlineSoft} opacity=".6" />
          <Fence y={64} x0={8} x1={72} />
          <Pig x={32} y={52} />
          {tier >= 2 ? <Pig x={50} y={56} flip /> : null}
          {tier >= 3 ? <Pig x={22} y={58} s={0.6} /> : null}
          {tier >= 3 ? <Pig x={42} y={60} s={0.6} flip /> : null}
          {tier >= 4 ? <rect x="58" y="44" width="14" height="5" rx="1.4" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" /> : null}
          {tier >= 5 ? <Pig x={62} y={58} s={0.6} /> : null}
        </Svg>
      )
    case 'gaensewiese':
      return (
        <Svg tier={tier}>
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
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill={P.outlineSoft} opacity=".7" />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M8 ${64 - r * 5}H72`} stroke={P.outlineWood} strokeWidth="2" opacity=".5" />
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i}>
                  <ellipse cx={11 + i * 8.6} cy={61 - r * 5} rx="3.4" ry="2.4" fill={winter ? '#b8b094' : '#6f9a48'} />
                  {!winter && season !== 'spring' ? <circle cx={11 + i * 8.6} cy={59.6 - r * 5} r=".9" fill={i % 2 ? P.cream : '#c7a3e0'} /> : null}
                </g>
              ))}
            </g>
          ))}
          {tier >= 4 ? <Crate s={0.5} x={68.5} y={46} fruit={P.woodLight} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M12 46V28M6 34h12" stroke={P.outlineSoft} strokeWidth="1.6" />
              <circle cx="12" cy="26" r="3" fill={P.skin} />
              <path d="M7 25h10l-2-3h-6z" fill={P.woodLight} />
              <path d="M8 34l4 6 4-6z" fill="#3d5a8a" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'heuscheune':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="14" y="34" width="40" height="30" fill="#b8403a" stroke="#6e2a22" strokeWidth=".8" />
          <path d="M10 34 L34 16 L58 34z" fill="#6e2a22" />
          <rect x="26" y="44" width="16" height="20" fill={P.cream} />
          <path d="M26 44l16 20M42 44L26 64" stroke="#b8403a" strokeWidth="1.6" />
          <rect x="30" y="26" width="8" height="6" fill="#d9b34a" />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <ellipse cx={60 + (i % 2) * 9} cy={61 - Math.floor(i / 2) * 7} rx="5" ry="4" fill="#e8c770" stroke="#b8962a" strokeWidth=".6" />
              <path d={`M${57 + (i % 2) * 9} ${61 - Math.floor(i / 2) * 7}h6`} stroke="#c49a3a" strokeWidth=".6" />
            </g>
          ))}
          {tier >= 5 ? <path d="M34 16V9M31 9h6M34 9l3 -2" stroke="#4a3a2a" strokeWidth="1" /> : null}
          {winter ? <path d="M10 34 L34 16 L58 34" stroke={P.white} strokeWidth="2.4" fill="none" /> : null}
        </Svg>
      )
    case 'melkhaus':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={18} w={30} h={20} wall={P.cream} roof={P.outlineWood} />
          <rect x="29" y="52" width="8" height="12" fill={P.bark} />
          <Window x={21} y={50} lit={tier >= 3} />
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <path d={`M${54 + i * 6} 64v-9l1-2h3l1 2v9z`} fill="#c9d0d8" stroke="#6a7a8a" strokeWidth=".6" />
              <rect x={54.6 + i * 6} y="51.6" width="3.8" height="1.4" fill="#6a7a8a" />
            </g>
          ))}
          {tier >= 4 ? <circle cx="12" cy="60" r="4" fill="none" stroke={P.outlineSoft} strokeWidth="1.2" /> : null}
        </Svg>
      )
    case 'kaeserei':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={12} w={34} h={22} wall="#f3e6c8" roof="#a5531a" timber />
          <Window x={38} y={48} lit={tier >= 3} />
          <rect x="50" y="48" width="22" height="2" fill={P.outlineSoft} />
          <rect x="50" y="57" width="22" height="2" fill={P.outlineSoft} />
          <path d="M51 48v16M71 48v16" stroke={P.outlineSoft} strokeWidth="1.4" />
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <ellipse key={i} cx={55 + (i % 3) * 6} cy={i < 3 ? 46 : 55} rx="2.8" ry="1.8" fill={P.yellow} stroke="#b8862a" strokeWidth=".5" />
          ))}
        </Svg>
      )
    case 'hofbaeckerei':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={10} w={30} h={20} wall={P.paper} roof="#b8403a" />
          <Window x={16} y={50} lit />
          <path d="M44 64 A12 12 0 0 1 68 64z" fill="#c9bfa8" stroke="#8a7a6a" strokeWidth=".8" />
          <path d="M51 64 A5 5 0 0 1 61 64z" fill={tier >= 2 ? '#e0731a' : '#4a3a2a'} />
          <rect x="60" y="44" width="4" height="10" fill="#8a7a6a" />
          {tier >= 2 ? <Smoke x={62} y={42} /> : null}
          {Array.from({ length: Math.min(3, tier) }, (_, i) => (
            <ellipse key={i} cx={20 + i * 7} cy={66} rx="3" ry="1.6" fill="#c4783a" stroke="#8a4a20" strokeWidth=".5" />
          ))}
          {tier >= 4 ? <Crate x={72} y={64} s={0.45} fruit="#c4783a" /> : null}
        </Svg>
      )
    case 'bauernmarkt':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          {Array.from({ length: Math.min(3, 1 + Math.floor(tier / 2)) }, (_, i) => {
            const x = 8 + i * 23
            const colors = [P.tomato, P.waterDeep, P.leaf]
            return (
              <g key={i}>
                <path d={`M${x} 44h20l-2 5h-16z`} fill={colors[i]} />
                <path d={`M${x + 4} 44l-1 5M${x + 10} 44v5M${x + 16} 44l1 5`} stroke={P.white} strokeWidth="2" opacity=".8" />
                <path d={`M${x + 2} 49v15M${x + 18} 49v15`} stroke={P.outlineSoft} strokeWidth="1.2" />
                <rect x={x + 1} y="56" width="18" height="3" fill={P.woodMid} />
                <Crate s={0.5} x={x + 2 + 4.5} y={58} fruit={[P.red, P.orange, P.leafLight][i]!} />
                <Crate s={0.5} x={x + 11 + 4.5} y={58} fruit={[P.yellow, P.woodLight, '#6b3a78'][i]!} />
              </g>
            )
          })}
          {tier >= 3 ? <g><path d="M72 64 L74 52 M78 64 L76 52" stroke={P.outlineWood} strokeWidth="1" /><rect x="70" y="50" width="10" height="7" fill="#2f3b2f" stroke={P.outlineWood} strokeWidth=".6" /></g> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Imkerei ————————————— */

/** Gesperrte Ecke am Hof: Brombeeren und Schutt. */
export function HofWild() {
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill={P.leaf} opacity=".5" />
      <rect x="22" y="50" width="12" height="8" fill={P.stone} stroke={P.outlineStone} strokeWidth=".6" transform="rotate(-8 28 54)" />
      <path d="M40 60 L58 46 M44 58 L60 52" stroke={P.outlineSoft} strokeWidth="2" />
      {Array.from({ length: 4 }, (_, i) => (
        <ellipse key={i} cx={16 + i * 16} cy={60 - (i % 2) * 2} rx="8" ry="5" fill={i % 2 ? '#5f7a3a' : P.leaf} />
      ))}
      {[18, 34, 50].map((x) => (
        <circle key={x} cx={x} cy={56} r="1.2" fill="#3a1838" />
      ))}
    </Svg>
  )
}
