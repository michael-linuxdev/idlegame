/**
 * Kapitel 10 — Lavendel (Provence) im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Felder und Bäume mit Kontur, Bauten aus art/parts/bold.tsx mit Fensterläden;
 * jede Stufe bringt Neues. Wachstum je Stufe übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import type { Season } from '../../ambient'
import { Bees, Smoke, Svg } from '../../HandParts'
import { Bunting, Butterfly } from './partsA'
import { Crate, Jar, Lantern, Pennant, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps } from './partsB'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

/** Figur (Besucher) mit Kontur. */
function Person({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 -1v3M1 -1v3" stroke={P.outline} strokeWidth="1" strokeLinecap="round" />
      <path d="M-2.2 -5.4h4.4l.7 4.6h-5.8z" fill={c} {...detail} />
      <circle cx="0" cy="-7.4" r="1.8" fill={P.skin} {...detail} />
    </g>
  )
}

/** Feld mit Kontur. */
function Field({ c, winter }: { c: string; winter?: boolean }) {
  return (
    <g>
      <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.white : c} {...line} />
      <path d="M14 53q14-5 30-4" stroke={P.white} strokeWidth={D} fill="none" opacity=".3" strokeLinecap="round" />
    </g>
  )
}

function Lavender({ x, y, season, s = 1 }: { x: number; y: number; season?: Season; s?: number }) {
  const bloom = season === 'summer' ? P.lavender : season === 'autumn' ? P.stoneDark : season === 'spring' ? P.winterLeafLight : P.stoneLight
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 5 }, (_, k) => (
        <path key={k} d={`M${-3 + k * 1.5} -1v-${4.4 + (k % 2)}`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
      ))}
      {Array.from({ length: 5 }, (_, k) => (
        <path key={`b${k}`} d={`M${-3 + k * 1.5} -1v-${4.4 + (k % 2)}`} stroke={bloom} strokeWidth="1.3" strokeLinecap="round" />
      ))}
      <ellipse cx="0" cy="0" rx="5" ry="3.4" fill={season === 'winter' ? P.winterLeafLight : P.leafMoss} stroke={P.outline} strokeWidth={H} />
      {season === 'winter' ? <path d="M-4 -1.6q4-2.4 8 0" stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
    </g>
  )
}

function Sunflower({ x, h, season }: { x: number; h: number; season?: Season }) {
  if (season === 'winter') return <path d={`M${x} 64v-${h * 0.4}`} stroke={P.woodDark} strokeWidth="1.2" />
  const small = season === 'spring'
  const hh = small ? h * 0.45 : h
  return (
    <g>
      <path d={`M${x} 64v-${hh}`} stroke={P.leafDark} strokeWidth="1.3" />
      <path d={`M${x} ${64 - hh * 0.5}q-4-1-4-3q3 0 4 3zM${x} ${64 - hh * 0.35}q4-1 4-3q-3 0-4 3z`} fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />
      {small ? null : season === 'autumn' ? (
        <circle cx={x + 1.6} cy={64 - hh + 1.6} r="2.4" fill={P.woodDark} {...detail} />
      ) : (
        <g>
          {Array.from({ length: 8 }, (_, k) => (
            <ellipse key={k} cx={x + Math.cos((k * Math.PI) / 4) * 2.8} cy={64 - hh + Math.sin((k * Math.PI) / 4) * 2.8} rx="1.4" ry="1.4" fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.5} />
          ))}
          <circle cx={x} cy={64 - hh} r="1.9" fill={P.seed} {...detail} />
        </g>
      )}
    </g>
  )
}

function Olive({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: Season }) {
  const fruit = season === 'autumn' || season === 'winter'
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2 0 Q-3.4 -6 -1.2 -10 Q0 -12 1.2 -10 Q3.4 -6 2 0z" fill={P.stoneDark} {...detail} />
      <path d="M0 -10 Q-4 -12 -5 -14 M0 -10 Q4 -12 5 -15" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
      <path d="M0 -10 Q-4 -12 -5 -14 M0 -10 Q4 -12 5 -15" stroke={P.stoneDark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
      <ellipse cx="-5" cy="-17" rx="6" ry="4.4" fill={P.winterLeafLight} {...detail} />
      <ellipse cx="5" cy="-18" rx="6.4" ry="4.6" fill={P.winterLeaf} {...detail} />
      <ellipse cx="0" cy="-21" rx="5" ry="3.6" fill={P.winterLeafLight} {...detail} />
      {fruit ? [[-6, -16], [4, -17], [0, -20], [7, -19]].map(([fx, fy], i) => <circle key={i} cx={fx} cy={fy} r="1" fill={P.plum} />) : null}
      {season === 'winter' ? <path d="M-6 -21q6-3 11 -1" stroke={P.white} strokeWidth="1.3" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

function Cypress({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 0 Q-4.4 -10 0 -25 Q4.4 -10 0 0z" fill={P.leafDark} {...line} />
      <path d="M-1.4 -6 Q-2.6 -12 -0.6 -20" stroke={P.white} strokeWidth={D} fill="none" opacity=".25" strokeLinecap="round" />
    </g>
  )
}

/** Fenster mit Läden; offen mit Blumenkasten (Provence). */
function Shutter({ x, y, open }: { x: number; y: number; open: boolean }) {
  return (
    <g>
      <Pane x={x} y={y} w={6} h={7} k={K} />
      <rect x={x - 2} y={y} width="1.8" height="7" fill={P.denim} {...detail} />
      <rect x={x + 6.2} y={y} width="1.8" height="7" fill={P.denim} {...detail} />
      {open ? <rect x={x - 0.6} y={y + 7.6} width="7.2" height="2" rx=".6" fill={P.pink} stroke={P.outline} strokeWidth={H} /> : <rect x={x} y={y} width="6" height="7" fill={P.denim} opacity=".5" />}
    </g>
  )
}

export function Lavendel({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const summer = season === 'summer'
  const autumn = season === 'autumn'
  switch (id) {
    case 'lavendelreihen': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Field c={P.paper} winter={winter} />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 7 }, (_, i) => <Lavender key={`${r}-${i}`} x={12 + i * 9.4 + (r % 2) * 2} y={65 - r * 4.6} season={season} s={0.85} />),
          )}
          {tier >= 4 && summer ? <Bees n={5} cy={36} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M64 42h10l-1.6 6h-6.8z" fill={P.woodLight} {...line} />
              <path d="M66 42v-4M69 42v-5M72 42v-4" stroke={P.lavender} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'sonnenblumen': {
      const n = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Field c={P.leafPale} winter={winter} />
          {Array.from({ length: n }, (_, i) => (
            <Sunflower key={i} x={10 + i * 8.6} h={22 + ((i * 7) % 8) + tier} season={season} />
          ))}
          {tier >= 4 && summer ? <Bees n={4} cy={30} /> : null}
          {tier >= 5 ? (
            <g>
              <Post x={70} y={64} h={18} w={1.6} k={K} />
              <path d="M66 50h8" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M66 50h8" stroke={P.woodLight} strokeWidth="1" strokeLinecap="round" />
              <circle cx="70" cy="43.6" r="2.6" fill={P.skin} {...detail} />
              <path d="M65.6 43h8.8l-2-2.8h-4.8z" fill={P.gold} {...detail} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'olivenhain': {
      const trees = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Field c={P.paper} winter={winter} />
          {Array.from({ length: trees }, (_, i) => (
            <Olive key={i} x={[40, 18, 62][i]!} y={[62, 58, 58][i]!} s={i === 0 ? 1.1 + tier * 0.06 : 0.85} season={season} />
          ))}
          {tier >= 4 ? (
            <g>
              <rect x="6" y="62" width="22" height="4" rx="1" fill={P.stoneLight} {...line} />
              <path d="M11 62v4M17 62v4M23 62v4" stroke={P.outline} strokeWidth={H} opacity=".4" />
            </g>
          ) : null}
          {tier >= 3 && (autumn || winter) ? (
            <g>
              <path d="M51 66h9l-1 -4h-7z" fill={P.woodLight} {...detail} />
              <circle cx="54.4" cy="61.6" r="1" fill={P.plum} />
              <circle cx="56.6" cy="61.4" r="1" fill={P.plum} />
            </g>
          ) : null}
          {tier >= 3 ? <Crate x={72} y={66} s={0.45} fruit={P.leafMoss} /> : null}
        </Svg>
      )
    }
    case 'rosmarin': {
      const n = Math.min(7, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {Array.from({ length: n }, (_, i) => {
            const x = 11 + i * 9.6
            return (
              <g key={i}>
                {Array.from({ length: 6 }, (_, k) => (
                  <path key={k} d={`M${x} 58q${(k - 2.5) * 1.6} -6 ${(k - 2.5) * 2.4} -11`} stroke={winter ? P.winterLeaf : P.leafMoss} strokeWidth="1.6" fill="none" strokeDasharray="1.2 .5" />
                ))}
                {season === 'spring' || (summer && i % 2) ? <circle cx={x} cy={48} r="1.3" fill={P.lilac} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
              </g>
            )
          })}
          {/* Trockenmauer */}
          <rect x="5" y="57" width="70" height="8" rx="1" fill={P.paper} {...line} />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${6 + i * 9.4 + (i % 2) * 3} 57v8`} stroke={P.outline} strokeWidth={H} opacity=".45" />
          ))}
          <path d="M5.6 61h69" stroke={P.outline} strokeWidth={H} opacity=".35" />
          {winter ? <path d="M8 50q32-6 64 0" stroke={P.white} strokeWidth="1.4" fill="none" opacity=".85" /> : null}
          {tier >= 4 ? <Lantern x={74} y={57} s={0.6} /> : null}
          {tier >= 5 ? <Butterfly x={60} y={34} c={P.lamp} /> : null}
        </Svg>
      )
    }
    case 'feigenbaum': {
      const bare = winter
      const r = 12 + tier * 1.6
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          <Field c={P.paper} winter={winter} />
          <path d="M38 64 Q36 52 40 44 M40 50 Q46 44 52 40 M39 52 Q32 46 26 42" stroke={P.outline} strokeWidth="4.6" fill="none" strokeLinecap="round" />
          <path d="M38 64 Q36 52 40 44 M40 50 Q46 44 52 40 M39 52 Q32 46 26 42" stroke={P.stoneDark} strokeWidth="3" fill="none" strokeLinecap="round" />
          {bare ? null : (
            <g>
              <ellipse cx="40" cy={44 - tier} rx={r} ry={r * 0.66} fill={P.leaf} {...line} />
              {Array.from({ length: 7 }, (_, i) => (
                <path key={i} d={`M${28 + i * 4} ${40 - tier + (i % 2) * 4}l3 -3 3 3 -3 3z`} fill={P.leafLight} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
              {summer || autumn
                ? Array.from({ length: 2 + tier }, (_, i) => <ellipse key={i} cx={30 + ((i * 7) % 22)} cy={42 - tier + ((i * 5) % 8)} rx="1.5" ry="1.9" fill={P.plum} stroke={P.outline} strokeWidth={H * 0.6} />)
                : null}
            </g>
          )}
          {tier >= 4 ? (
            <g>
              <path d="M55 64h12v-6h-12z" fill={P.woodLight} {...line} />
              <path d="M57 58l2-2 2 2 2-2 2 2" stroke={P.plum} strokeWidth="1.6" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M8 63h15" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M8 63h15" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M10 64v3M21 64v3" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'destillerie': {
      const bottles = Math.min(6, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <rect x="38" y="26" width="5" height="12" fill={P.stoneLight} {...detail} />
          {tier >= 2 ? <Smoke x={40.5} y={24} /> : null}
          <Wall x={6} y={42} w={42} h={24} fill={P.paper} k={K} />
          <GableRoof x={6} y={43} w={42} h={12} fill={P.roof} over={3} k={K} />
          <ArchDoor x={22} y={66} w={11} h={15} k={K} />
          <Shutter x={11} y={48} open={tier >= 3} />
          <Shutter x={38} y={48} open={tier >= 3} />
          {/* Kupferkessel */}
          <rect x="54" y="60" width="13" height="6" rx="1" fill={P.stoneDark} {...line} />
          <ellipse cx="60.5" cy="54" rx="8" ry="7" fill={P.autumn} {...line} />
          <ellipse cx="58" cy="51" rx="2.6" ry="1.4" fill={P.white} opacity=".35" />
          <path d="M60.5 47q0-6 6-6h6" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M60.5 47q0-6 6-6h6" stroke={P.autumn} strokeWidth="2" fill="none" strokeLinecap="round" />
          {tier >= 4 ? <path d="M70 64q2-6 6-6" stroke={P.lavender} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
          {Array.from({ length: bottles }, (_, i) => (
            <path key={i} d={`M${7 + i * 5} 71v-4.6l1-1.6v-1.4h1.2v1.4l1 1.6v4.6z`} fill={P.lilac} {...detail} />
          ))}
          {winter ? <path d="M2 43 L27 32 L52 43" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'seifenmanufaktur': {
      const bars = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={30} y={42} w={44} h={24} fill={P.canvas} k={K} />
          <GableRoof x={30} y={43} w={44} h={12} fill={P.roof} over={3} k={K} />
          <Shutter x={36} y={48} open={tier >= 2} />
          <ArchDoor x={54} y={66} w={9} h={14} k={K} />
          <rect x="47" y="33" width="22" height="5.4" rx="1" fill={P.cream} {...detail} />
          <ellipse cx="58" cy="35.7" rx="3.2" ry="1.5" fill={P.lilac} {...detail} />
          {/* Trockentisch mit Seifen */}
          <Post x={6} y={66} h={8} w={1.8} k={K} />
          <Post x={26} y={66} h={8} w={1.8} k={K} />
          <rect x="4" y="56" width="24" height="2.6" rx=".6" fill={P.woodMid} {...line} />
          {Array.from({ length: bars }, (_, i) => (
            <rect key={i} x={5 + (i % 4) * 5.6} y={i < 4 ? 52.6 : 49.2} width="4.6" height="3.2" rx=".6" fill={[P.lilac, P.lamp, P.cream, P.leafPale][i % 4]} {...detail} />
          ))}
          {tier >= 4 ? (
            <g fill={P.white} opacity=".9">
              <circle cx="20" cy="44" r="1.7" className="bee" />
              <circle cx="24" cy="40" r="1.2" className="bee" />
              <circle cx="16" cy="40" r="1" className="bee" />
            </g>
          ) : null}
          {tier >= 5 ? <Pennant x={52} y={31} s={0.8} /> : null}
          {winter ? <path d="M26 43 L52 32 L78 43" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'marktstand': {
      const stalls = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {Array.from({ length: stalls }, (_, i) => {
            const x = 6 + i * 24
            const c = [P.lavender, P.yellow, P.roof][i]!
            return (
              <g key={i}>
                <Post x={x + 2} y={66} h={22} w={2.2} k={K} />
                <Post x={x + 20} y={66} h={22} w={2.2} k={K} />
                <rect x={x} y="55" width="22" height="4" rx="1" fill={P.woodMid} {...line} />
                <path d={`M${x - 2} 44h26l-2.4 6h-21.2z`} fill={c} {...line} />
                <path d={`M${x + 4} 44.6l-.8 5M${x + 11} 44.6v5M${x + 18} 44.6l.8 5`} stroke={P.white} strokeWidth="2.4" opacity=".85" />
                {i === 0 ? [3, 7, 11, 15].map((dx) => <path key={dx} d={`M${x + dx + 2} 55v-4`} stroke={P.lavender} strokeWidth="1.8" strokeLinecap="round" />) : null}
                {i === 1 ? [3, 8, 13].map((dx) => <circle key={dx} cx={x + dx + 2.6} cy={53} r="2" fill={P.yellow} {...detail} />) : null}
                {i === 2 ? [3, 8, 13].map((dx) => <Jar key={dx} x={x + dx + 2.6} y={55} s={0.7} c={P.paper} lid={P.roof} />) : null}
              </g>
            )
          })}
          {tier >= 4 ? <Person x={72} y={66} c={P.blue} /> : null}
          {tier >= 5 ? <Person x={66} y={68} c={P.red} s={0.8} /> : null}
          {tier >= 3 ? <Crate x={6} y={70} s={0.45} fruit={P.lavender} /> : null}
        </Svg>
      )
    }
    case 'mas':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {tier >= 3 ? <Cypress x={8} y={66} s={1 + tier * 0.06} /> : null}
          {tier >= 5 ? <Cypress x={73} y={66} s={1.1} /> : null}
          {tier >= 2 ? (
            <g>
              <Wall x={46} y={30} w={16} h={12} fill={P.paper} k={K} />
              <GableRoof x={46} y={31} w={16} h={6} fill={P.roof} over={2} k={K} />
            </g>
          ) : null}
          <Wall x={14} y={40} w={48} h={26} fill={P.paper} k={K} />
          <GableRoof x={14} y={41} w={48} h={11} fill={P.roof} over={3.5} k={K} />
          {[18, 30, 50].map((x) => (
            <Shutter key={x} x={x} y={46} open={tier >= 3} />
          ))}
          <ArchDoor x={38} y={66} w={8} h={12} fill={P.denim} k={K} />
          {tier >= 4 ? (
            <g>
              <path d="M14 42 q-4 8 -2 22" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
              <path d="M14 42 q-4 8 -2 22" stroke={P.leafDark} strokeWidth="2.2" fill="none" strokeLinecap="round" />
              {[46, 52, 58].map((y) => (
                <circle key={y} cx={12.6} cy={y} r="1.5" fill={P.pink} stroke={P.outline} strokeWidth={H} />
              ))}
            </g>
          ) : null}
          {winter ? <path d="M10.5 41 L38 30 L65.5 41" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'lavendelfest':
      return (
        <Svg tier={tier} bold>
          <Field c={P.paper} winter={winter} />
          <Post x={20} y={50} h={16} w={2.2} k={K} />
          <Post x={52} y={50} h={16} w={2.2} k={K} />
          <rect x="16" y="48" width="40" height="5.4" rx="1" fill={P.woodMid} {...line} />
          <path d="M14 34 Q36 24 58 34z" fill={P.lavender} {...line} />
          <path d="M20 31q16-6 32 0" stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
          <Bunting y={22} n={Math.min(9, 3 + tier)} />
          {tier >= 2 ? (
            <g fill={P.outline}>
              <circle cx="30" cy="44" r="1.7" />
              <rect x="29" y="45.4" width="2" height="3" />
              {tier >= 3 ? (
                <>
                  <circle cx="42" cy="44" r="1.7" />
                  <rect x="41" y="45.4" width="2" height="3" />
                </>
              ) : null}
            </g>
          ) : null}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <Lavender key={i} x={8 + i * 12} y={66} season={winter ? 'winter' : 'summer'} s={0.7} />
          ))}
          {tier >= 4 ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={8 + i * 16} cy={24 + (i % 2) * 3} r="1.8" fill={P.amber} stroke={P.outline} strokeWidth={H} />) : null}
          {tier >= 5 ? <Person x={64} y={62} c={P.lavender} /> : null}
          {tier >= 5 ? <Person x={70} y={64} c={P.yellow} s={0.85} /> : null}
        </Svg>
      )
  }
  return null
}

/* ————————————— Kapitel 11: Japanischer Garten ————————————— */
