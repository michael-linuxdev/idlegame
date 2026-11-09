/** Kapitel-Grafik (Lavendel, Japangarten, Gartenschau): lavendel. */
import type { ReactNode } from 'react'
import type { Season } from '../../ambient'
import { Bees, House, Smoke, Svg, Window } from '../../HandParts'
import { Bunting, Butterfly, Snowcap } from './partsA'
import { Crate, Jar, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Ground, Person } from './partsB'

function Lavender({ x, y, season, s = 1 }: { x: number; y: number; season?: Season; s?: number }) {
  const bloom = season === 'summer' ? '#8a5ac8' : season === 'autumn' ? '#9a8aa8' : season === 'spring' ? '#a9b8a0' : '#b8bcc0'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="5" ry="3.4" fill={season === 'winter' ? '#9aa0a0' : '#8a9a7a'} />
      {Array.from({ length: 5 }, (_, k) => (
        <path key={k} d={`M${-3 + k * 1.5} -1v-${4 + (k % 2)}`} stroke={bloom} strokeWidth="1.4" strokeLinecap="round" />
      ))}
      {season === 'winter' ? <path d="M-4 -1.6q4-2.4 8 0" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
    </g>
  )
}

function Sunflower({ x, h, season }: { x: number; h: number; season?: Season }) {
  if (season === 'winter') return <path d={`M${x} 64v-${h * 0.4}`} stroke="#8a7a5a" strokeWidth="1" />
  const small = season === 'spring'
  const hh = small ? h * 0.45 : h
  return (
    <g>
      <path d={`M${x} 64v-${hh}`} stroke={P.leafMoss} strokeWidth="1.1" />
      <path d={`M${x} ${64 - hh * 0.5}q-4-1-4-3q3 0 4 3zM${x} ${64 - hh * 0.35}q4-1 4-3q-3 0-4 3z`} fill={P.leaf} />
      {small ? null : season === 'autumn' ? (
        <g>
          <circle cx={x + 1.6} cy={64 - hh + 1.6} r="2.4" fill={P.outlineWood} />
          <path d={`M${x - 1} ${64 - hh + 0.6}l-1.4 1.6`} stroke="#a5893a" strokeWidth=".8" />
        </g>
      ) : (
        <g>
          <circle cx={x} cy={64 - hh} r="3.6" fill={P.yellow} />
          <circle cx={x} cy={64 - hh} r="1.6" fill={P.outlineWood} />
        </g>
      )}
    </g>
  )
}

function Olive({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: Season }) {
  const fruit = season === 'autumn' || season === 'winter'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1.6 0 Q-3 -6 -1 -10 Q0 -12 1 -10 Q3 -6 1.6 0z" fill="#7a6a5a" />
      <path d="M0 -10 Q-4 -12 -5 -14 M0 -10 Q4 -12 5 -15" stroke="#7a6a5a" strokeWidth="1.2" fill="none" />
      <ellipse cx="-5" cy="-17" rx="6" ry="4.4" fill="#9fb08a" />
      <ellipse cx="5" cy="-18" rx="6.4" ry="4.6" fill="#8fa47a" />
      <ellipse cx="0" cy="-21" rx="5" ry="3.6" fill="#a9b894" />
      {fruit ? [[-6, -16], [4, -17], [0, -20], [7, -19]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r=".9" fill="#4a3a5a" />) : null}
      {season === 'winter' ? <path d="M-6 -21q6-3 11 -1" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
    </g>
  )
}

function Cypress({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q-4 -10 0 -24 Q4 -10 0 0z" fill="#2f5a3a" />
    </g>
  )
}

export function Lavendel({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const summer = season === 'summer'
  const dry = '#c9b880'
  switch (id) {
    case 'lavendelreihen': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Ground color="#b8a46a" winter={winter} />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 7 }, (_, i) => <Lavender key={`${r}-${i}`} x={12 + i * 9.4 + (r % 2) * 2} y={64 - r * 4.6} season={season} s={0.85} />),
          )}
          {tier >= 4 && summer ? <Bees n={5} cy={36} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M66 40h9l-1.4 6h-6.2z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" />
              <path d="M68 40v-4M70 40v-5M72 40v-4" stroke="#8a5ac8" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'sonnenblumen': {
      const n = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <Ground color="#a8b060" winter={winter} />
          {Array.from({ length: n }, (_, i) => (
            <Sunflower key={i} x={10 + i * 8.6} h={22 + ((i * 7) % 8) + tier} season={season} />
          ))}
          {tier >= 4 && summer ? <Bees n={4} cy={30} /> : null}
          {tier >= 5 ? <path d="M70 64V46M66 50h8" stroke={P.outlineSoft} strokeWidth="1.2" /> : null}
          {tier >= 5 ? <circle cx="70" cy="44" r="2.4" fill={P.skin} /> : null}
          {tier >= 5 ? <path d="M66 43h8l-2-2.6h-4z" fill="#e8c770" /> : null}
        </Svg>
      )
    }
    case 'olivenhain': {
      const trees = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier}>
          <Ground color={dry} winter={winter} />
          {Array.from({ length: trees }, (_, i) => (
            <Olive key={i} x={[40, 18, 62][i]!} y={[62, 58, 58][i]!} s={i === 0 ? 1.1 + tier * 0.06 : 0.85} season={season} />
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M8 66h20" stroke="#bdb3a0" strokeWidth="3" />
              <path d="M8 63h20" stroke={P.stone} strokeWidth="1.6" strokeDasharray="3 1" />
            </g>
          ) : null}
          {tier >= 3 && (season === 'autumn' || winter) ? (
            <g>
              <path d="M52 66h8l-1 -4h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
              <circle cx="55" cy="61.6" r=".9" fill="#4a3a5a" />
              <circle cx="57" cy="61.4" r=".9" fill="#4a3a5a" />
            </g>
          ) : null}
          {tier >= 3 ? <Crate x={72} y={64} s={0.45} fruit={P.leafMoss} /> : null}
        </Svg>
      )
    }
    case 'rosmarin': {
      const n = Math.min(7, 2 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <path d="M6 64 Q40 56 74 64 V66 H6z" fill="#c9b48a" />
          <path d="M6 58 H74 V64 H6z" fill="#d9c49a" stroke="#a69a7a" strokeWidth=".6" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${6 + i * 9.5} 58v6`} stroke="#a69a7a" strokeWidth=".5" />
          ))}
          {Array.from({ length: n }, (_, i) => {
            const x = 11 + i * 9.6
            return (
              <g key={i}>
                {Array.from({ length: 6 }, (_, k) => (
                  <path key={k} d={`M${x} 58q${(k - 2.5) * 1.6} -6 ${(k - 2.5) * 2.4} -11`} stroke={winter ? '#7a8a7a' : '#5f7a5a'} strokeWidth="1.4" fill="none" strokeDasharray="1.2 .5" />
                ))}
                {season === 'spring' || (summer && i % 2) ? <circle cx={x} cy={48} r="1.2" fill="#a9b8e8" /> : null}
              </g>
            )
          })}
          {winter ? <path d="M8 50q32-6 64 0" stroke={P.white} strokeWidth="1.2" fill="none" opacity=".8" /> : null}
          {tier >= 5 ? <Butterfly x={60} y={36} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'feigenbaum': {
      const bare = winter
      const r = 12 + tier * 1.6
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <Ground color={dry} winter={winter} />
          <path d="M38 64 Q36 52 40 44 M40 50 Q46 44 52 40 M39 52 Q32 46 26 42" stroke="#8a7a6a" strokeWidth="3" fill="none" strokeLinecap="round" />
          {bare ? null : (
            <g>
              <ellipse cx="40" cy={44 - tier} rx={r} ry={r * 0.66} fill="#4f8a3a" />
              {Array.from({ length: 7 }, (_, i) => (
                <path key={i} d={`M${28 + i * 4} ${40 - tier + (i % 2) * 4}l3 -3 3 3 -3 3z`} fill="#6fae52" />
              ))}
              {summer || season === 'autumn'
                ? Array.from({ length: 2 + tier }, (_, i) => <ellipse key={i} cx={30 + ((i * 7) % 22)} cy={42 - tier + ((i * 5) % 8)} rx="1.4" ry="1.8" fill="#5b3a78" />)
                : null}
            </g>
          )}
          {tier >= 4 ? <path d="M56 64h10v-6h-10z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" /> : null}
          {tier >= 4 ? <path d="M58 58l2-2 2 2 2-2" stroke="#5b3a78" strokeWidth="1.4" fill="none" /> : null}
          {tier >= 5 ? <path d="M10 64h14M12 64v3M22 64v3" stroke={P.outlineWood} strokeWidth="1.2" /> : null}
        </Svg>
      )
    }
    case 'destillerie': {
      const bottles = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <House x={8} w={42} h={22} wall={P.paper} roof={P.roof} steep={10} />
          <rect x="40" y="26" width="6" height="12" fill="#bdb3a0" />
          {tier >= 2 ? <Smoke x={43} y={24} /> : null}
          <rect x="22" y="48" width="12" height="16" fill={P.outlineWood} />
          <path d="M22 48 a6 6 0 0 1 12 0" fill={P.outlineWood} />
          <Window x={12} y={48} lit={tier >= 3} />
          <ellipse cx="60" cy="54" rx="8" ry="7" fill="#d9844a" stroke="#8a4220" strokeWidth=".7" />
          <path d="M60 47q0-6 6-6h6" stroke="#d9844a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <rect x="54" y="60" width="12" height="4" fill="#8a7a6a" />
          {Array.from({ length: bottles }, (_, i) => (
            <path key={i} d={`M${10 + i * 5} 70v-4.6l1-1.6v-1.4h1.2v1.4l1 1.6v4.6z`} fill="#b8a0e0" stroke="#6a5a9a" strokeWidth=".4" />
          ))}
          {tier >= 4 ? <path d="M68 64q2-6 6-6" stroke="#8a5ac8" strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {winter ? <path d="M5 42 L29 32 L53 42" stroke={P.white} strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'seifenmanufaktur': {
      const bars = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <House x={30} w={42} h={22} wall="#f5ecd8" roof={P.roof} steep={10} />
          <rect x="34" y="47" width="10" height="9" fill="#8a9ac0" stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M34 51.5h10M39 47v9" stroke={P.outlineWood} strokeWidth=".4" />
          <rect x="54" y="50" width="8" height="14" fill="#6a8aa8" />
          <rect x="48" y="34" width="20" height="5" rx="1" fill={P.cream} stroke={P.outlineWood} strokeWidth=".5" />
          <ellipse cx="58" cy="36.5" rx="3" ry="1.4" fill="#b8a0e0" />
          <rect x="4" y="56" width="24" height="2.4" fill={P.woodMid} />
          <path d="M6 58.4v6M26 58.4v6" stroke={P.outlineWood} strokeWidth="1" />
          {Array.from({ length: bars }, (_, i) => (
            <rect key={i} x={5 + (i % 4) * 5.6} y={i < 4 ? 52.6 : 49.4} width="4.6" height="3" rx=".6" fill={['#b8a0e0', '#f5e08a', P.cream, '#9fd0a0'][i % 4]} stroke="#8a7a6a" strokeWidth=".3" />
          ))}
          {tier >= 4 ? (
            <g fill={P.white} opacity=".85">
              <circle cx="20" cy="44" r="1.6" className="bee" />
              <circle cx="24" cy="40" r="1.1" className="bee" />
              <circle cx="16" cy="40" r=".9" className="bee" />
            </g>
          ) : null}
          {winter ? <path d="M27 42 L51 32 L75 42" stroke={P.white} strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'marktstand': {
      const stalls = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          {Array.from({ length: stalls }, (_, i) => {
            const x = 6 + i * 24
            const c = ['#7a5ab8', P.yellow, P.roof][i]!
            return (
              <g key={i}>
                <path d={`M${x} 44h22l-2 5h-18z`} fill={c} />
                <path d={`M${x + 4} 44l-1 5M${x + 11} 44v5M${x + 18} 44l1 5`} stroke={P.white} strokeWidth="2.2" opacity=".85" />
                <path d={`M${x + 2} 49v15M${x + 20} 49v15`} stroke={P.outlineSoft} strokeWidth="1.2" />
                <rect x={x + 1} y="56" width="20" height="3" fill={P.woodMid} />
                {i === 0 ? [3, 7, 11, 15].map((dx) => <path key={dx} d={`M${x + dx} 56v-4`} stroke="#8a5ac8" strokeWidth="1.6" strokeLinecap="round" />) : null}
                {i === 1 ? [3, 8, 13].map((dx) => <circle key={dx} cx={x + dx + 2} cy={54} r="1.8" fill={P.yellow} stroke={P.outlineWood} strokeWidth=".3" />) : null}
                {i === 2 ? [3, 8, 13].map((dx) => <Jar key={dx} x={x + dx + 2.1} y={56} s={0.7} c={P.paper} lid={P.roof} />) : null}
              </g>
            )
          })}
          {tier >= 4 ? <Person x={70} y={64} c={P.blue} /> : null}
          {tier >= 5 ? <Person x={64} y={66} c={P.red} s={0.8} /> : null}
          {tier >= 3 ? <Crate x={8} y={64} s={0.45} fruit={P.lavender} /> : null}
        </Svg>
      )
    }
    case 'mas':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          {tier >= 3 ? <Cypress x={8} y={64} s={1 + tier * 0.06} /> : null}
          {tier >= 5 ? <Cypress x={72} y={64} s={1.1} /> : null}
          <rect x="14" y="40" width="48" height="24" fill="#e8d4a8" stroke="#a5893a" strokeWidth=".7" />
          {tier >= 2 ? <rect x="46" y="32" width="16" height="10" fill="#e8d4a8" stroke="#a5893a" strokeWidth=".6" /> : null}
          {tier >= 2 ? <path d="M44 32 L54 26 L64 32z" fill={P.roof} /> : null}
          <path d="M10 40 L30 30 L46 40z" fill={P.roof} stroke="#8a3a2a" strokeWidth=".5" />
          <path d="M44 40 h20" stroke={P.roof} strokeWidth="2" />
          {[18, 30, 50].map((x) => (
            <g key={x}>
              <rect x={x} y="46" width="6" height="7" fill={tier >= 3 ? '#ffe9a8' : P.waterLight} stroke={P.outlineWood} strokeWidth=".5" />
              <rect x={x - 1.6} y="46" width="1.6" height="7" fill="#7a9ab8" />
              <rect x={x + 6} y="46" width="1.6" height="7" fill="#7a9ab8" />
            </g>
          ))}
          <rect x="39" y="52" width="7" height="12" fill="#7a9ab8" />
          {tier >= 4 ? (
            <g>
              <path d="M14 40 q-4 8 -2 20" stroke="#4f8a3a" strokeWidth="2.4" fill="none" />
              {[44, 50, 56].map((y) => (
                <circle key={y} cx={13} cy={y} r="1.3" fill="#c4558a" />
              ))}
            </g>
          ) : null}
          {winter ? <Snowcap d="M11 40 L30 30 L45 40" /> : null}
        </Svg>
      )
    case 'lavendelfest':
      return (
        <Svg tier={tier}>
          <Ground color="#b8a46a" winter={winter} />
          <rect x="18" y="48" width="36" height="6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M20 48V34M52 48V34" stroke={P.outlineWood} strokeWidth="1.4" />
          <path d="M16 34 Q36 24 56 34z" fill="#9a7ac4" />
          <Bunting y={22} n={Math.min(9, 3 + tier)} />
          {tier >= 2 ? (
            <g fill="#4a3a2a">
              <circle cx="30" cy="44" r="1.6" />
              <rect x="29" y="45.4" width="2" height="3" />
              {tier >= 3 ? (
                <>
                  <circle cx="42" cy="44" r="1.6" />
                  <rect x="41" y="45.4" width="2" height="3" />
                </>
              ) : null}
            </g>
          ) : null}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <Lavender key={i} x={8 + i * 12} y={64} season={season === 'winter' ? 'winter' : 'summer'} s={0.7} />
          ))}
          {tier >= 4 ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={8 + i * 16} cy={24 + (i % 2) * 3} r="1.6" fill="#f5a83a" />) : null}
          {tier >= 5 ? <Person x={64} y={60} c="#9a7ac4" /> : null}
          {tier >= 5 ? <Person x={70} y={62} c={P.yellow} s={0.85} /> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Kapitel 11: Japanischer Garten ————————————— */
