/**
 * Hand-drawn art for Kapitel 10–12 (Lavendelfeld, Japanischer Garten,
 * Gartenschau): one motif per area, visible growth over the five tiers
 * (1 / 10 / 25 / 50 / 100) and the real seasons.
 */
import type { ReactNode } from 'react'
import type { Season } from './ambient'
import { Bees, BlossomTree, House, Pond, Roof, Shadow, Smoke, Svg, Window } from './HandParts'
import { Bunting, Butterfly, Flower, Jar, Rock, Snowcap } from './HandArtA'

type P = { id: string; tier: number; season?: Season }

/* ————————————— small parts ————————————— */

function Ground({ color, winter }: { color: string; winter?: boolean }) {
  return <ellipse cx="40" cy="57" rx="36" ry="13" fill={winter ? '#e8eef0' : color} opacity=".85" />
}

function Lavender({ x, y, season, s = 1 }: { x: number; y: number; season?: Season; s?: number }) {
  const bloom = season === 'summer' ? '#8a5ac8' : season === 'autumn' ? '#9a8aa8' : season === 'spring' ? '#a9b8a0' : '#b8bcc0'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="0" rx="5" ry="3.4" fill={season === 'winter' ? '#9aa0a0' : '#8a9a7a'} />
      {Array.from({ length: 5 }, (_, k) => (
        <path key={k} d={`M${-3 + k * 1.5} -1v-${4 + (k % 2)}`} stroke={bloom} strokeWidth="1.4" strokeLinecap="round" />
      ))}
      {season === 'winter' ? <path d="M-4 -1.6q4-2.4 8 0" stroke="#fff" strokeWidth="1.2" fill="none" /> : null}
    </g>
  )
}

function Sunflower({ x, h, season }: { x: number; h: number; season?: Season }) {
  if (season === 'winter') return <path d={`M${x} 64v-${h * 0.4}`} stroke="#8a7a5a" strokeWidth="1" />
  const small = season === 'spring'
  const hh = small ? h * 0.45 : h
  return (
    <g>
      <path d={`M${x} 64v-${hh}`} stroke="#4f7a2e" strokeWidth="1.1" />
      <path d={`M${x} ${64 - hh * 0.5}q-4-1-4-3q3 0 4 3zM${x} ${64 - hh * 0.35}q4-1 4-3q-3 0-4 3z`} fill="#5f9e45" />
      {small ? null : season === 'autumn' ? (
        <g>
          <circle cx={x + 1.6} cy={64 - hh + 1.6} r="2.4" fill="#6e4a2b" />
          <path d={`M${x - 1} ${64 - hh + 0.6}l-1.4 1.6`} stroke="#a5893a" strokeWidth=".8" />
        </g>
      ) : (
        <g>
          <circle cx={x} cy={64 - hh} r="3.6" fill="#f5c542" />
          <circle cx={x} cy={64 - hh} r="1.6" fill="#6e4a2b" />
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
      {season === 'winter' ? <path d="M-6 -21q6-3 11 -1" stroke="#fff" strokeWidth="1.2" fill="none" /> : null}
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

function StoneLantern({ x, y, s = 1, lit, snow }: { x: number; y: number; s?: number; lit?: boolean; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.4" y="-8" width="2.8" height="8" fill="#a69a8a" />
      <rect x="-3.4" y="-9" width="6.8" height="1.4" fill="#8a7e6e" />
      <rect x="-2.4" y="-13" width="4.8" height="4" fill={lit ? '#ffe9a8' : '#bdb3a0'} stroke="#8a7e6e" strokeWidth=".5" className={lit ? 'fest-glow' : undefined} />
      <path d="M-4.4 -13 L0 -16 L4.4 -13z" fill="#8a7e6e" />
      <circle cx="0" cy="-16.6" r=".9" fill="#8a7e6e" />
      {snow ? <path d="M-4 -13.4 L0 -16.2 L4 -13.4" stroke="#fff" strokeWidth="1.2" fill="none" /> : null}
    </g>
  )
}

function Koi({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g className="ha-fish">
        <ellipse cx="0" cy="0" rx="3.6" ry="1.4" fill={c} />
        <ellipse cx="-.6" cy="-.2" rx="1.2" ry=".7" fill="#fbf6e8" />
        <path d="M-3.4 0l-2 -1.6v3.2z" fill={c} />
      </g>
    </g>
  )
}

function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="0" cy="-7" r="1.6" fill="#f2c9a0" />
      <path d="M-2 -5h4l.6 4h-5.2z" fill={c} />
      <path d="M-1 -1v3M1 -1v3" stroke="#4a3a2a" strokeWidth=".8" />
    </g>
  )
}

function Hedge({ d, winter, w = 3.4 }: { d: string; winter?: boolean; w?: number }) {
  return (
    <g>
      <path d={d} stroke="#2f5a2e" strokeWidth={w + 1} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} stroke={winter ? '#c9d4c8' : '#4f8a3a'} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}

/* ————————————— Kapitel 10: Lavendelfeld ————————————— */

export function Lavendel({ id, tier, season }: P): ReactNode {
  const winter = season === 'winter'
  const summer = season === 'summer'
  const dry = '#c9b880'
  switch (id) {
    case 'lavendelreihen': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg>
          <Ground color="#b8a46a" winter={winter} />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 7 }, (_, i) => <Lavender key={`${r}-${i}`} x={12 + i * 9.4 + (r % 2) * 2} y={64 - r * 4.6} season={season} s={0.85} />),
          )}
          {tier >= 4 && summer ? <Bees n={5} cy={36} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M66 40h9l-1.4 6h-6.2z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".5" />
              <path d="M68 40v-4M70 40v-5M72 40v-4" stroke="#8a5ac8" strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'sonnenblumen': {
      const n = Math.min(8, 2 + tier)
      return (
        <Svg>
          <Ground color="#a8b060" winter={winter} />
          {Array.from({ length: n }, (_, i) => (
            <Sunflower key={i} x={10 + i * 8.6} h={22 + ((i * 7) % 8) + tier} season={season} />
          ))}
          {tier >= 4 && summer ? <Bees n={4} cy={30} /> : null}
          {tier >= 5 ? <path d="M70 64V46M66 50h8" stroke="#8a6a40" strokeWidth="1.2" /> : null}
          {tier >= 5 ? <circle cx="70" cy="44" r="2.4" fill="#f2c9a0" /> : null}
          {tier >= 5 ? <path d="M66 43h8l-2-2.6h-4z" fill="#e8c770" /> : null}
        </Svg>
      )
    }
    case 'olivenhain': {
      const trees = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg>
          <Ground color={dry} winter={winter} />
          {Array.from({ length: trees }, (_, i) => (
            <Olive key={i} x={[40, 18, 62][i]!} y={[62, 58, 58][i]!} s={i === 0 ? 1.1 + tier * 0.06 : 0.85} season={season} />
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M8 66h20" stroke="#bdb3a0" strokeWidth="3" />
              <path d="M8 63h20" stroke="#a69a8a" strokeWidth="1.6" strokeDasharray="3 1" />
            </g>
          ) : null}
          {tier >= 3 && (season === 'autumn' || winter) ? (
            <g>
              <path d="M52 66h8l-1 -4h-6z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".4" />
              <circle cx="55" cy="61.6" r=".9" fill="#4a3a5a" />
              <circle cx="57" cy="61.4" r=".9" fill="#4a3a5a" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'rosmarin': {
      const n = Math.min(7, 2 + tier)
      return (
        <Svg>
          <Shadow rx={32} />
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
          {winter ? <path d="M8 50q32-6 64 0" stroke="#fff" strokeWidth="1.2" fill="none" opacity=".8" /> : null}
          {tier >= 5 ? <Butterfly x={60} y={36} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'feigenbaum': {
      const bare = winter
      const r = 12 + tier * 1.6
      return (
        <Svg>
          <Shadow rx={30} />
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
          {tier >= 4 ? <path d="M56 64h10v-6h-10z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".5" /> : null}
          {tier >= 4 ? <path d="M58 58l2-2 2 2 2-2" stroke="#5b3a78" strokeWidth="1.4" fill="none" /> : null}
          {tier >= 5 ? <path d="M10 64h14M12 64v3M22 64v3" stroke="#6e4a2b" strokeWidth="1.2" /> : null}
        </Svg>
      )
    }
    case 'destillerie': {
      const bottles = Math.min(6, tier + 1)
      return (
        <Svg>
          <Shadow rx={34} />
          <House x={8} w={42} h={22} wall="#efe1c2" roof="#c4553f" steep={10} />
          <rect x="40" y="26" width="6" height="12" fill="#bdb3a0" />
          {tier >= 2 ? <Smoke x={43} y={24} /> : null}
          <rect x="22" y="48" width="12" height="16" fill="#6e4a2b" />
          <path d="M22 48 a6 6 0 0 1 12 0" fill="#6e4a2b" />
          <Window x={12} y={48} lit={tier >= 3} />
          <ellipse cx="60" cy="54" rx="8" ry="7" fill="#d9844a" stroke="#8a4220" strokeWidth=".7" />
          <path d="M60 47q0-6 6-6h6" stroke="#d9844a" strokeWidth="2.2" fill="none" strokeLinecap="round" />
          <rect x="54" y="60" width="12" height="4" fill="#8a7a6a" />
          {Array.from({ length: bottles }, (_, i) => (
            <path key={i} d={`M${10 + i * 5} 70v-4.6l1-1.6v-1.4h1.2v1.4l1 1.6v4.6z`} fill="#b8a0e0" stroke="#6a5a9a" strokeWidth=".4" />
          ))}
          {tier >= 4 ? <path d="M68 64q2-6 6-6" stroke="#8a5ac8" strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {winter ? <path d="M5 42 L29 32 L53 42" stroke="#fff" strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'seifenmanufaktur': {
      const bars = Math.min(8, 2 + tier)
      return (
        <Svg>
          <Shadow rx={34} />
          <House x={30} w={42} h={22} wall="#f5ecd8" roof="#c4553f" steep={10} />
          <rect x="34" y="47" width="10" height="9" fill="#8a9ac0" stroke="#6e4a2b" strokeWidth=".6" />
          <path d="M34 51.5h10M39 47v9" stroke="#6e4a2b" strokeWidth=".4" />
          <rect x="54" y="50" width="8" height="14" fill="#6a8aa8" />
          <rect x="48" y="34" width="20" height="5" rx="1" fill="#fbf6e8" stroke="#6e4a2b" strokeWidth=".5" />
          <ellipse cx="58" cy="36.5" rx="3" ry="1.4" fill="#b8a0e0" />
          <rect x="4" y="56" width="24" height="2.4" fill="#a5733f" />
          <path d="M6 58.4v6M26 58.4v6" stroke="#6e4a2b" strokeWidth="1" />
          {Array.from({ length: bars }, (_, i) => (
            <rect key={i} x={5 + (i % 4) * 5.6} y={i < 4 ? 52.6 : 49.4} width="4.6" height="3" rx=".6" fill={['#b8a0e0', '#f5e08a', '#fbf6e8', '#9fd0a0'][i % 4]} stroke="#8a7a6a" strokeWidth=".3" />
          ))}
          {tier >= 4 ? (
            <g fill="#fff" opacity=".85">
              <circle cx="20" cy="44" r="1.6" className="bee" />
              <circle cx="24" cy="40" r="1.1" className="bee" />
              <circle cx="16" cy="40" r=".9" className="bee" />
            </g>
          ) : null}
          {winter ? <path d="M27 42 L51 32 L75 42" stroke="#fff" strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'marktstand': {
      const stalls = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg>
          <Shadow rx={34} />
          {Array.from({ length: stalls }, (_, i) => {
            const x = 6 + i * 24
            const c = ['#7a5ab8', '#f5c542', '#c4553f'][i]!
            return (
              <g key={i}>
                <path d={`M${x} 44h22l-2 5h-18z`} fill={c} />
                <path d={`M${x + 4} 44l-1 5M${x + 11} 44v5M${x + 18} 44l1 5`} stroke="#fff" strokeWidth="2.2" opacity=".85" />
                <path d={`M${x + 2} 49v15M${x + 20} 49v15`} stroke="#8a6a40" strokeWidth="1.2" />
                <rect x={x + 1} y="56" width="20" height="3" fill="#a5733f" />
                {i === 0 ? [3, 7, 11, 15].map((dx) => <path key={dx} d={`M${x + dx} 56v-4`} stroke="#8a5ac8" strokeWidth="1.6" strokeLinecap="round" />) : null}
                {i === 1 ? [3, 8, 13].map((dx) => <circle key={dx} cx={x + dx + 2} cy={54} r="1.8" fill="#f5c542" stroke="#6e4a2b" strokeWidth=".3" />) : null}
                {i === 2 ? [3, 8, 13].map((dx) => <Jar key={dx} x={x + dx} y={51} c="#efe1c2" lid="#c4553f" />) : null}
              </g>
            )
          })}
          {tier >= 4 ? <Person x={70} y={64} c="#3d6fd1" /> : null}
          {tier >= 5 ? <Person x={64} y={66} c="#e0485e" s={0.8} /> : null}
        </Svg>
      )
    }
    case 'mas':
      return (
        <Svg>
          <Shadow rx={34} />
          {tier >= 3 ? <Cypress x={8} y={64} s={1 + tier * 0.06} /> : null}
          {tier >= 5 ? <Cypress x={72} y={64} s={1.1} /> : null}
          <rect x="14" y="40" width="48" height="24" fill="#e8d4a8" stroke="#a5893a" strokeWidth=".7" />
          {tier >= 2 ? <rect x="46" y="32" width="16" height="10" fill="#e8d4a8" stroke="#a5893a" strokeWidth=".6" /> : null}
          {tier >= 2 ? <path d="M44 32 L54 26 L64 32z" fill="#c4553f" /> : null}
          <path d="M10 40 L30 30 L46 40z" fill="#c4553f" stroke="#8a3a2a" strokeWidth=".5" />
          <path d="M44 40 h20" stroke="#c4553f" strokeWidth="2" />
          {[18, 30, 50].map((x) => (
            <g key={x}>
              <rect x={x} y="46" width="6" height="7" fill={tier >= 3 ? '#ffe9a8' : '#8fd0ec'} stroke="#6e4a2b" strokeWidth=".5" />
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
        <Svg>
          <Ground color="#b8a46a" winter={winter} />
          <rect x="18" y="48" width="36" height="6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" />
          <path d="M20 48V34M52 48V34" stroke="#6e4a2b" strokeWidth="1.4" />
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
          {tier >= 5 ? <Person x={70} y={62} c="#f5c542" s={0.85} /> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Kapitel 11: Japanischer Garten ————————————— */

export function Japan({ id, tier, season }: P): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const gravel = winter ? '#eef2f4' : '#e8e2d0'
  switch (id) {
    case 'teestrauch': {
      const rows = Math.min(4, 1 + Math.floor((tier + 1) / 2))
      return (
        <Svg>
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
          {tier >= 5 ? <path d="M10 40h6l-1 4h-4z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".4" /> : null}
        </Svg>
      )
    }
    case 'moosgarten': {
      const n = Math.min(7, 2 + tier)
      return (
        <Svg>
          <ellipse cx="40" cy="57" rx="36" ry="12" fill={winter ? '#e8eef0' : '#5f8a3a'} />
          {Array.from({ length: n }, (_, i) => (
            <ellipse key={i} cx={10 + ((i * 17) % 60)} cy={52 + ((i * 7) % 12)} rx={5 + (i % 3)} ry={2.6 + (i % 2)} fill={winter ? '#d8e0d8' : i % 2 ? '#6fa04a' : '#4f8a3a'} />
          ))}
          <ellipse cx="34" cy="56" rx="7" ry="4" fill="#9a9a8a" />
          <ellipse cx="33" cy="54.6" rx="4" ry="2" fill="#6fa04a" opacity={winter ? 0 : 1} />
          {tier >= 3 ? <StoneLantern x={58} y={58} s={0.8} snow={winter} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M16 64 Q14 50 22 42" stroke="#6e4a2b" strokeWidth="2" fill="none" />
              <circle cx="22" cy="40" r="6" fill={winter ? '#c9d0c4' : autumn ? '#c4402a' : '#a83a2a'} opacity=".95" />
              <circle cx="16" cy="44" r="4" fill={winter ? '#c9d0c4' : autumn ? '#d9602a' : '#c4502a'} />
            </g>
          ) : null}
          {tier >= 5 ? <path d="M44 66 q8 -4 16 0" stroke="#8fd0ec" strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'bambushain': {
      const n = Math.min(10, 3 + tier * 2)
      return (
        <Svg>
          <Shadow rx={32} />
          {Array.from({ length: n }, (_, i) => {
            const x = 8 + ((i * 13) % 64)
            const h = 30 + ((i * 7) % 12) + tier * 2
            return (
              <g key={i}>
                <path d={`M${x} 64V${64 - h}`} stroke={i % 2 ? '#7aa04a' : '#6a9040'} strokeWidth="2.2" />
                {Array.from({ length: 4 }, (_, k) => (
                  <path key={k} d={`M${x - 1.2} ${60 - k * (h / 4)}h2.4`} stroke="#4f7a2e" strokeWidth=".6" />
                ))}
                <path d={`M${x} ${64 - h + 4}q5 -2 8 1M${x} ${64 - h + 8}q-5 -2 -8 1`} stroke={winter ? '#9ab08a' : '#5f9e45'} strokeWidth="1.6" fill="none" />
                {winter ? <path d={`M${x + 1} ${64 - h + 4}q4 -1 6 0`} stroke="#fff" strokeWidth="1" fill="none" /> : null}
              </g>
            )
          })}
          {tier >= 4 ? <path d="M4 66 Q40 60 76 66" stroke="#c9a46b" strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'kirschallee': {
      const color = spring ? '#f7c6d9' : season === 'summer' ? '#6ca848' : '#d2752c'
      return (
        <Svg>
          <Shadow rx={34} />
          <path d="M30 67 L37 58 H43 L50 67z" fill={gravel} opacity=".75" />
          <BlossomTree x={18} y={64} s={0.8 + tier * 0.05} winter={winter} color={color} />
          {tier >= 2 ? <BlossomTree x={62} y={64} s={0.8 + tier * 0.04} winter={winter} color={color} /> : null}
          {tier >= 4 ? <BlossomTree x={30} y={50} s={0.55} winter={winter} color={color} /> : null}
          {tier >= 4 ? <BlossomTree x={50} y={50} s={0.55} winter={winter} color={color} /> : null}
          {spring
            ? Array.from({ length: 4 + tier * 2 }, (_, i) => <ellipse key={i} cx={8 + ((i * 13) % 64)} cy={58 + ((i * 5) % 8)} rx="1" ry=".6" fill="#f7c6d9" />)
            : null}
          {tier >= 5 ? <path d="M58 66h12M60 66v2M68 66v2" stroke="#a83a2a" strokeWidth="1.4" /> : null}
        </Svg>
      )
    }
    case 'koiteich': {
      const koi = Math.min(6, 1 + tier)
      return (
        <Svg>
          <Pond frozen={winter} />
          {Array.from({ length: 5 }, (_, i) => (
            <ellipse key={i} cx={10 + i * 15} cy={66 - (i % 2) * 2} rx="4" ry="2.4" fill="#9a9a8a" stroke="#7a7a6a" strokeWidth=".4" />
          ))}
          {!winter
            ? Array.from({ length: koi }, (_, i) => (
                <Koi key={i} x={22 + ((i * 13) % 36)} y={47 + ((i * 5) % 10)} c={['#f08a2c', '#e2453c', '#fbf6e8', '#f5c542'][i % 4]!} s={1.1} />
              ))
            : null}
          {tier >= 3 && !winter ? <ellipse cx="60" cy="48" rx="4" ry="1.8" fill="#5f9e45" /> : null}
          {tier >= 4 ? <StoneLantern x={70} y={46} s={0.7} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M8 40 h8 v8" stroke="#a5733f" strokeWidth="1.6" fill="none" />
              <path d="M16 48 q2 4 0 8" stroke="#8fd0ec" strokeWidth="1.6" fill="none" className="orchard-stream" strokeDasharray="2 2" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'zengarten': {
      const lines = 2 + tier
      return (
        <Svg>
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
              <path d="M44 46 V36 M38 40 l6 -4" stroke="#8a6a40" strokeWidth="1" />
              <path d="M36 42 l2 -2 6 4" stroke="#8a6a40" strokeWidth="1.2" fill="none" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'teehaus':
      return (
        <Svg>
          <Shadow rx={34} />
          <rect x="14" y="56" width="50" height="4" fill="#8a5a32" />
          <path d="M18 60v4M60 60v4" stroke="#6e4a2b" strokeWidth="1.4" />
          <rect x="20" y="40" width="38" height="16" fill="#f5ecd8" stroke="#6e4a2b" strokeWidth=".7" />
          {[26, 32, 38, 44, 50].map((x) => (
            <path key={x} d={`M${x} 40v16`} stroke="#6e4a2b" strokeWidth=".5" />
          ))}
          <path d="M20 48h38" stroke="#6e4a2b" strokeWidth=".4" />
          <path d="M10 41 Q16 38 22 32 H56 Q62 38 68 41z" fill="#3a3a3a" />
          <path d="M10 41 q-2 -2 -2 -4 M68 41 q2 -2 2 -4" stroke="#3a3a3a" strokeWidth="1.4" fill="none" />
          {tier >= 3 ? (
            <g>
              <path d="M24 32 Q28 28 30 24 H48 Q50 28 54 32z" fill="#3a3a3a" />
            </g>
          ) : null}
          {tier >= 2 ? <rect x="34" y="44" width="10" height="12" fill={tier >= 3 ? '#ffe9a8' : '#e8dcc0'} /> : null}
          {tier >= 4 ? <StoneLantern x={70} y={64} s={0.8} lit snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M4 64 Q4 50 12 44" stroke="#6e4a2b" strokeWidth="1.6" fill="none" />
              <circle cx="12" cy="42" r="5" fill={winter ? '#c9d0c4' : autumn ? '#c4402a' : spring ? '#f7c6d9' : '#a83a2a'} />
            </g>
          ) : null}
          {winter ? <Snowcap d="M12 39 Q18 36 23 31 H55 Q60 36 66 39" /> : null}
        </Svg>
      )
    case 'bonsai': {
      const n = Math.min(4, 1 + Math.floor(tier / 2))
      return (
        <Svg>
          <Shadow rx={32} />
          <rect x="6" y="56" width="68" height="3" fill="#8a5a32" />
          <path d="M10 59v7M70 59v7" stroke="#6e4a2b" strokeWidth="1.4" />
          {Array.from({ length: n }, (_, i) => {
            const x = 16 + i * 16
            const big = i === 0 ? 1 + tier * 0.06 : 0.8
            return (
              <g key={i} transform={`translate(${x} 56) scale(${big})`}>
                <rect x="-6" y="-3" width="12" height="3" rx=".6" fill={['#3d5a8a', '#a83a2a', '#3a3a3a', '#6e4a2b'][i]} />
                <path d="M0 -3 Q-2 -7 1 -9 Q3 -11 0 -14" stroke="#6e4a2b" strokeWidth="1.6" fill="none" />
                <ellipse cx="-3" cy="-10" rx="4" ry="2" fill={winter ? '#8a9a7a' : '#3f7a30'} />
                <ellipse cx="3" cy="-13" rx="3.6" ry="1.8" fill={winter ? '#8a9a7a' : '#4f8a3a'} />
                <ellipse cx="0" cy="-16" rx="2.6" ry="1.4" fill={winter ? '#8a9a7a' : '#5f9e45'} />
                {winter ? <path d="M-6 -11h6M1 -14.4h5" stroke="#fff" strokeWidth=".8" /> : null}
              </g>
            )
          })}
          {tier >= 5 ? <path d="M60 40h12v4h-12z" fill="#fbf6e8" stroke="#a83a2a" strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'rotebruecke':
      return (
        <Svg>
          <Pond cy={58} ry={10} frozen={winter} />
          <path d="M8 58 Q40 32 72 58" stroke="#c4302a" strokeWidth="4" fill="none" />
          <path d="M8 52 Q40 26 72 52" stroke="#c4302a" strokeWidth="1.6" fill="none" />
          {Array.from({ length: 7 }, (_, i) => {
            const x = 12 + i * 9.4
            const t = (x - 8) / 64
            const k = 52 * t * (1 - t)
            return <path key={i} d={`M${x} ${52 - k}V${58 - k}`} stroke="#c4302a" strokeWidth="1.2" />
          })}
          {tier >= 3 && !winter ? <Koi x={24} y={62} c="#f08a2c" /> : null}
          {tier >= 3 && !winter ? <Koi x={54} y={63} c="#fbf6e8" /> : null}
          {tier >= 4 ? <StoneLantern x={6} y={66} s={0.6} snow={winter} /> : null}
          {tier >= 5 ? <Person x={40} y={42} c="#c4558a" s={0.8} /> : null}
          {tier >= 2 && !winter ? <ellipse cx="62" cy="62" rx="3" ry="1.2" fill="#5f9e45" /> : null}
        </Svg>
      )
    case 'laternenweg': {
      const n = Math.min(5, 1 + tier)
      return (
        <Svg>
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

export function Gartenschau({ id, tier, season }: P): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const summer = season === 'summer'
  const bloom = !winter
  switch (id) {
    case 'eingangstor':
      return (
        <Svg>
          <Shadow rx={34} />
          <path d="M14 64V34M66 64V34" stroke="#3f7a30" strokeWidth="5" />
          <path d="M14 34 Q40 16 66 34" stroke="#3f7a30" strokeWidth="5" fill="none" />
          {bloom ? Array.from({ length: 9 }, (_, i) => {
            const t = i / 8
            return <circle key={i} cx={14 + 52 * t} cy={34 - Math.sin(t * Math.PI) * 11} r="2" fill={['#e0485e', '#f5c542', '#fbf6e8'][i % 3]} />
          }) : null}
          <rect x="28" y="24" width="24" height="7" rx="1.4" fill="#fbf3e0" stroke="#3f7a30" strokeWidth=".6" />
          <path d="M32 27.5h16" stroke="#3f7a30" strokeWidth="1.2" />
          {tier >= 2 ? <path d="M20 64V46h40v18" stroke="#6e4a2b" strokeWidth="1" fill="none" /> : null}
          {tier >= 3 ? (
            <g>
              <path d="M8 64V20l6 2.4-6 2.4" fill="#e2453c" stroke="#6e4a2b" strokeWidth=".6" />
              <path d="M72 64V20l6 2.4-6 2.4" fill="#3d6fd1" stroke="#6e4a2b" strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 4 ? <Person x={36} y={64} c="#3d6fd1" /> : null}
          {tier >= 4 ? <Person x={44} y={65} c="#e0485e" s={0.8} /> : null}
          {tier >= 5 ? <Bunting y={14} n={8} x0={8} x1={72} /> : null}
          {winter ? <Snowcap d="M16 33 Q40 17 64 33" /> : null}
        </Svg>
      )
    case 'blumenkorso': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg>
          <Shadow rx={32} />
          <path d="M10 56h52l6 -10h-6l-4 4h-44z" fill="#8a6a40" />
          <path d="M12 56 Q20 30 40 34 Q58 30 62 56z" fill={winter ? '#c9d0c4' : '#5f9e45'} />
          {bloom
            ? Array.from({ length: rows * 7 }, (_, i) => {
                const r = Math.floor(i / 7)
                const k = i % 7
                return <circle key={i} cx={18 + k * 6.4} cy={52 - r * 3.6 - Math.sin((k / 6) * Math.PI) * 3} r="1.9" fill={['#e0485e', '#f08a2c', '#f5c542', '#c77dd1', '#fbf6e8'][(i + r) % 5]} />
              })
            : null}
          <circle cx="18" cy="60" r="4" fill="#4a3a2a" />
          <circle cx="54" cy="60" r="4" fill="#4a3a2a" />
          <circle cx="18" cy="60" r="1.4" fill="#a69a8a" />
          <circle cx="54" cy="60" r="1.4" fill="#a69a8a" />
          {tier >= 4 ? <Person x={70} y={64} c="#f5c542" /> : null}
          {tier >= 5 ? <path d="M40 34V22l6 2.4-6 2.4" fill="#c77dd1" stroke="#6e4a2b" strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'rosenbogen': {
      const arches = Math.min(4, 1 + Math.floor(tier / 1.5))
      return (
        <Svg>
          <Ground color="#8cc06a" winter={winter} />
          {Array.from({ length: arches }, (_, i) => {
            const s = 1 - i * 0.16
            const y = 64 - i * 6
            const w = 30 * s
            return (
              <g key={i}>
                <path d={`M${40 - w / 2} ${y}V${y - 22 * s} Q40 ${y - 34 * s} ${40 + w / 2} ${y - 22 * s} V${y}`} stroke="#6e4a2b" strokeWidth={1.6 * s} fill="none" />
                {summer || spring
                  ? Array.from({ length: 9 }, (_, k) => {
                      const t = k / 8
                      const ang = Math.PI * (1 - t)
                      return <circle key={k} cx={40 + Math.cos(ang) * (w / 2)} cy={y - 22 * s - Math.sin(ang) * 11 * s} r={1.9 * s} fill={k % 2 ? '#5f9e45' : summer ? ['#e0485e', '#f28ab2', '#fbf6e8'][i % 3] : '#5f9e45'} />
                    })
                  : null}
              </g>
            )
          }).reverse()}
          {tier >= 5 ? <path d="M8 64h12M10 64v3M18 64v3" stroke="#6e4a2b" strokeWidth="1.2" /> : null}
        </Svg>
      )
    }
    case 'labyrinth': {
      const rings = Math.min(4, 1 + Math.floor(tier / 1.4))
      return (
        <Svg>
          <ellipse cx="40" cy="56" rx="36" ry="13" fill="#d9c79a" />
          {Array.from({ length: rings }, (_, r) => {
            const rx = 32 - r * 7
            const ry = 11 - r * 2.4
            return <Hedge key={r} winter={winter} d={`M${40 + 3} ${56 - ry} A${rx} ${ry} 0 1 1 ${40 - 3} ${56 - ry}`} />
          })}
          {tier >= 3 ? <circle cx="40" cy="55" r="2" fill="#e0a21a" /> : null}
          {tier >= 5 ? <path d="M40 55V40l5 2-5 2" fill="#e2453c" stroke="#6e4a2b" strokeWidth=".5" /> : null}
          {tier >= 4 ? <Person x={18} y={66} c="#3d6fd1" s={0.8} /> : null}
        </Svg>
      )
    }
    case 'wasserspiele': {
      const jets = Math.min(5, tier)
      return (
        <Svg>
          <ellipse cx="40" cy="58" rx="32" ry="10" fill="#bdb3a0" />
          <ellipse cx="40" cy="57" rx="29" ry="8.4" fill={winter ? '#cfe2ee' : '#6aa6c9'} />
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
          {tier >= 5 && summer ? <path d="M12 30 Q40 0 68 30" stroke="#e0485e" strokeWidth="1" fill="none" opacity=".5" /> : null}
          {tier >= 5 && summer ? <path d="M14 30 Q40 3 66 30" stroke="#f5c542" strokeWidth="1" fill="none" opacity=".5" /> : null}
        </Svg>
      )
    }
    case 'aussichtsturm': {
      const h = 22 + tier * 6
      return (
        <Svg>
          <Shadow rx={24} />
          <path d={`M30 64 L36 ${64 - h} H44 L50 64`} stroke="#8a5a32" strokeWidth="2" fill="none" />
          {Array.from({ length: Math.floor(h / 8) }, (_, i) => {
            const y = 64 - (i + 1) * 8
            const t = (64 - y) / h
            return <path key={i} d={`M${30 + 6 * t} ${y} L${50 - 6 * t} ${y + 8}M${50 - 6 * t} ${y} L${30 + 6 * t} ${y + 8}`} stroke="#a5733f" strokeWidth=".7" />
          })}
          <rect x="33" y={64 - h - 4} width="14" height="4" fill="#efe1c2" stroke="#6e4a2b" strokeWidth=".6" />
          <Roof x={33} w={14} y={64 - h - 4} color="#b8403a" steep={6} />
          {tier >= 3 ? <path d={`M40 ${64 - h - 10}v-6l4 1.6-4 1.6`} fill="#3d6fd1" stroke="#6e4a2b" strokeWidth=".5" /> : null}
          {tier >= 4 ? <Person x={38} y={64 - h - 0.6} c="#e0485e" s={0.5} /> : null}
          {tier >= 2 ? <path d="M54 64h14M56 64v3M66 64v3" stroke="#6e4a2b" strokeWidth="1.2" /> : null}
          {winter ? <Snowcap d={`M32 ${64 - h - 4} L40 ${64 - h - 10} L48 ${64 - h - 4}`} /> : null}
        </Svg>
      )
    }
    case 'festzelt': {
      const w = 40 + tier * 4
      return (
        <Svg>
          <Shadow rx={34} />
          <rect x={40 - w / 2} y="44" width={w} height="20" fill="#fbf6e8" stroke="#bdb3a0" strokeWidth=".6" />
          {Array.from({ length: Math.floor(w / 6) }, (_, i) => (
            <path key={i} d={`M${40 - w / 2 + 3 + i * 6} 44v20`} stroke="#e8e0cc" strokeWidth="1.6" />
          ))}
          <path d={`M${40 - w / 2 - 3} 44 L40 26 L${40 + w / 2 + 3} 44z`} fill="#f5f0e0" stroke="#bdb3a0" strokeWidth=".6" />
          <path d={`M${40 - w / 2 - 3} 44 L40 26 M${40 - w / 4} 44 L40 26 M${40 + w / 4} 44 L40 26`} stroke="#e2453c" strokeWidth="1.4" />
          <path d="M40 26v-6l5 2-5 2" fill="#e2453c" stroke="#6e4a2b" strokeWidth=".5" />
          <path d="M34 64V52 a6 6 0 0 1 12 0 V64" fill="#ffe9a8" />
          {tier >= 3 ? Array.from({ length: 6 }, (_, i) => <circle key={i} className="fest-glow" cx={40 - w / 2 + 4 + i * ((w - 8) / 5)} cy="46" r="1.2" fill="#f5a83a" />) : null}
          {tier >= 4 ? <Person x={28} y={66} c="#3d6fd1" s={0.8} /> : null}
          {tier >= 5 ? <Person x={54} y={66} c="#5f9e45" s={0.8} /> : null}
          {winter ? <path d={`M${40 - w / 2} 43 L40 27 L${40 + w / 2} 43`} stroke="#fff" strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'seebuehne':
      return (
        <Svg>
          <Pond cy={56} ry={12} frozen={winter} />
          <path d="M18 54h44v-4h-44z" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" />
          <path d="M20 54v4M40 54v4M60 54v4" stroke="#6e4a2b" strokeWidth="1.2" />
          <path d="M20 50 Q40 20 60 50" fill="#3d5a8a" opacity=".9" />
          <path d="M26 50 Q40 30 54 50" fill="#2f4a78" />
          {tier >= 2 ? <Person x={34} y={50} c="#e0485e" s={0.8} /> : null}
          {tier >= 3 ? <Person x={46} y={50} c="#f5c542" s={0.8} /> : null}
          {tier >= 3 ? (
            <g stroke="#fff" strokeWidth=".6" fill="none" opacity=".8">
              <path d="M30 36l-2 -3M50 36l2 -3" />
            </g>
          ) : null}
          {tier >= 4 ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={24 + i * 8} cy={47 - Math.sin((i / 4) * Math.PI) * 10} r="1.2" fill="#ffe9a8" />) : null}
          {tier >= 5 && !winter ? <path d="M8 66q4 -2 8 0M64 66q4 -2 8 0" stroke="#fff" strokeWidth=".8" fill="none" /> : null}
        </Svg>
      )
    case 'ehrenpavillon':
      return (
        <Svg>
          <Shadow rx={30} />
          <ellipse cx="40" cy="62" rx="22" ry="4" fill="#efe6d0" stroke="#bdb3a0" strokeWidth=".6" />
          {[24, 34, 46, 56].map((x) => (
            <rect key={x} x={x - 1.4} y="40" width="2.8" height="22" fill="#fbf6e8" stroke="#bdb3a0" strokeWidth=".4" />
          ))}
          <rect x="20" y="37" width="40" height="4" fill="#fbf3e0" stroke="#bdb3a0" strokeWidth=".5" />
          <path d="M20 37 Q40 12 60 37z" fill={tier >= 3 ? '#e0a21a' : '#a5b8a0'} stroke="#8a6a20" strokeWidth=".6" />
          <path d="M28 33 Q32 27.4 37 25.6" stroke="#fff" strokeWidth="1" fill="none" opacity=".6" />
          {tier >= 2 ? <circle cx="40" cy="19" r="1.8" fill="#e0a21a" /> : null}
          {tier >= 4 ? (
            <g>
              <rect x="36" y="52" width="8" height="10" fill="#bdb3a0" />
              <path d="M37 52 l3 -6 3 6z" fill="#e0a21a" />
            </g>
          ) : null}
          {tier >= 5 ? Array.from({ length: 6 }, (_, i) => <circle key={i} cx={20 + i * 8} cy={66} r="1.4" fill={bloom ? ['#e0485e', '#f5c542', '#fbf6e8'][i % 3] : '#c9d0c4'} />) : null}
          {winter ? <path d="M22 35 Q40 13 58 35" stroke="#fff" strokeWidth="1.8" fill="none" /> : null}
        </Svg>
      )
    case 'gedenkgarten':
      return (
        <Svg>
          <Ground color="#8cc06a" winter={winter} />
          {bloom
            ? Array.from({ length: 6 + tier * 4 }, (_, i) => <Flower key={i} x={8 + ((i * 17) % 64)} y={54 + ((i * 11) % 11)} c={spring || summer ? '#6a9ae0' : '#9ab0d0'} r={1.1} center="#f5e08a" />)
            : null}
          <path d="M36 58 a4 4 0 0 1 4 -4 a4 4 0 0 1 4 4 l-4 5z" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" transform="translate(0 -2)" />
          {tier >= 2 ? (
            <g>
              <path d="M48 52h20" stroke="#8a5a32" strokeWidth="2.4" />
              <path d="M48 47h20" stroke="#8a5a32" strokeWidth="1.6" />
              <path d="M50 52v5M66 52v5M50 47v5M66 47v5" stroke="#6e4a2b" strokeWidth="1" />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <path d="M16 60 V44" stroke="#4f7a2e" strokeWidth="1" />
              <circle cx="16" cy="42" r="2.4" fill={bloom ? '#e0485e' : '#8a6a5a'} />
              <path d="M16 50 q-3-1-4-3 M16 54 q3-1 4-3" stroke="#4f7a2e" strokeWidth=".8" fill="none" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M28 64 Q24 42 30 30" stroke="#7a5532" strokeWidth="2" fill="none" />
              <circle cx="30" cy="28" r="7" fill={winter ? '#c9d0c4' : season === 'autumn' ? '#d9a33a' : '#6ca848'} />
              <circle cx="24" cy="32" r="5" fill={winter ? '#c9d0c4' : season === 'autumn' ? '#d2752c' : '#7fae58'} />
            </g>
          ) : null}
          {tier >= 5 ? <Butterfly x={58} y={38} c="#fbf6e8" /> : null}
          {tier >= 5 ? <path d="M38 36c0-3 4-3 4 0l-2 3z" fill="#f28ab2" className="fest-glow" /> : null}
        </Svg>
      )
  }
  return null
}

/** Locked corners: dry scrub + stones (Lavendel), unraked gravel + fallen bamboo (Japan), building site (Gartenschau). */
export function WildB({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'lavendel') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#b8a46a" opacity=".6" />
        {Array.from({ length: 6 }, (_, i) => (
          <ellipse key={i} cx={14 + i * 10} cy={60 - (i % 2) * 2} rx={4 + ((i + seed) % 3)} ry="3" fill={i % 2 ? '#8a8a5a' : '#9a9a6a'} />
        ))}
        <ellipse cx="30" cy="62" rx="3" ry="1.6" fill="#bdb3a0" />
        <ellipse cx="52" cy="63" rx="2.4" ry="1.4" fill="#bdb3a0" />
        <path d="M44 58 l6 -8 M48 58 l-2 -9" stroke="#8a7a5a" strokeWidth="1" />
      </Svg>
    )
  }
  if (chapter === 'japangarten') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#d4ccb4" opacity=".8" />
        <path d="M18 62 L60 50 M24 64 L58 56" stroke="#9a9a5a" strokeWidth="2" strokeLinecap="round" />
        {Array.from({ length: 6 }, (_, i) => (
          <path key={i} d={`M${16 + i * 9} 62q${i % 2 ? 2 : -2} -${8 + ((i + seed) % 3) * 3} ${i % 2 ? 4 : -2} -${12 + ((i + seed) % 3) * 3}`} stroke="#7a9a4a" strokeWidth="1.2" fill="none" />
        ))}
        <ellipse cx="56" cy="62" rx="5" ry="2.4" fill="#9a9a8a" />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="28" ry="7" fill="#a5895a" opacity=".6" />
      <path d="M14 64 L22 50 M30 64 L22 50" stroke="#f08a2c" strokeWidth="1.6" />
      <path d="M17 58h10" stroke="#fbf6e8" strokeWidth="1.6" />
      <rect x="40" y="54" width="14" height="8" fill="#c9a46b" stroke="#8a6a40" strokeWidth=".6" />
      <path d="M40 58h14" stroke="#8a6a40" strokeWidth=".5" />
      <ellipse cx="62" cy="62" rx="6" ry="3" fill="#8a6a40" />
      {[56, 60, 66].map((x) => (
        <path key={x} d={`M${x} 62 q1 -${4 + ((x + seed) % 3)} 2 -6`} stroke="#6d9a3f" strokeWidth="1" fill="none" />
      ))}
    </Svg>
  )
}
