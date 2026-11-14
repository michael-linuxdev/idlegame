/**
 * Kapitel 4 — Bauernhof im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Gebäude aus den Bausteinen in art/parts/bold.tsx (Licht oben links, Schatten
 * rechts), jede Stufe bringt sichtbar Neues. Tiere behalten ihre Zeichnung und
 * bekommen die Kontur über `hand-art`. Wachstum je Stufe übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import type { Season } from '../../ambient'
import { Svg, Cow, Goat, Pig, Smoke } from '../../HandParts'
import { Barrel, Bird, Crate, Lantern, Pennant, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

/** Alte Zeichnung (Tiere) mit der Kontur aus garden.css. */
function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Koppelzaun: Pfosten mit zwei Latten, kräftig. */
function Paddock({ x0, x1, y }: { x0: number; x1: number; y: number }) {
  const posts: number[] = []
  for (let x = x0; x <= x1 + 0.1; x += (x1 - x0) / Math.max(1, Math.round((x1 - x0) / 9))) posts.push(x)
  return (
    <g>
      {[y - 6, y - 2].map((ly) => (
        <g key={ly}>
          <path d={`M${x0} ${ly}H${x1}`} stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d={`M${x0} ${ly}H${x1}`} stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
      {posts.map((x) => (
        <Post key={x} x={x} y={y + 1.5} h={10} w={2.6} k={K} />
      ))}
    </g>
  )
}

/** Wiesenfleck als Boden der Weiden. */
function Grass({ rx = 34, winter }: { rx?: number; winter?: boolean }) {
  return (
    <g>
      <ellipse cx="40" cy="60" rx={rx} ry="9" fill={winter ? P.white : P.leafLight} {...line} />
      <path d={`M${40 - rx * 0.6} 58q${rx * 0.3}-3 ${rx * 0.6}-1`} stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
    </g>
  )
}

/** Tränke: Holztrog mit Wasser. */
function Trough({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 7} ${y - 4}h14l-1.6 4h-10.8z`} fill={P.woodMid} {...detail} />
      <path d={`M${x - 6} ${y - 3.6}h12`} stroke={P.water} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  )
}

/** Heuballen (rund, mit Wicklung). */
function Bale({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx="0" cy="-4" rx="5" ry="4" fill={P.yellow} {...detail} />
      <path d="M-2.4 -4a2.4 2 0 1 0 4.8 0a1.2 1 0 1 0 -2.4 0" fill="none" stroke={P.brass} strokeWidth={H} />
    </g>
  )
}

/** Milchkanne. */
function Can({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 2.4} ${y}v-8l1-2h2.8l1 2v8z`} fill={P.stoneLight} {...detail} />
      <rect x={x - 1.8} y={y - 11.4} width="3.6" height="1.6" rx=".5" fill={P.metal} {...detail} />
      <path d={`M${x - 1.6} ${y - 7.4}v6`} stroke={P.white} strokeWidth={D} opacity=".5" strokeLinecap="round" />
    </g>
  )
}

/** Käselaib. */
function Cheese({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 0v-2.6a4 1.6 0 0 1 8 0V0a4 1.6 0 0 1 -8 0z" fill={P.gold} {...detail} />
      <ellipse cx="0" cy="-2.6" rx="4" ry="1.6" fill={P.yellow} {...detail} />
    </g>
  )
}

/** Brotlaib. */
function Loaf({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 3.4} ${y}q0-3.6 3.4-3.6t3.4 3.6z`} fill={P.autumn} {...detail} />
      <path d={`M${x - 1.4} ${y - 2.6}l1 1M${x + 0.6} ${y - 3}l1 1`} stroke={P.outline} strokeWidth={H} opacity=".6" />
    </g>
  )
}

/** Marktstand mit gestreifter Markise. */
function Stall({ x, c, fruitA, fruitB }: { x: number; c: string; fruitA: string; fruitB: string }) {
  return (
    <g>
      <Post x={x + 2} y={66} h={22} w={2.2} k={K} />
      <Post x={x + 20} y={66} h={22} w={2.2} k={K} />
      <rect x={x} y="55" width="22" height="4" rx="1" fill={P.woodMid} {...line} />
      <path d={`M${x - 2} 44h26l-2.4 6h-21.2z`} fill={c} {...line} />
      <path d={`M${x + 4} 44.6l-.8 5M${x + 11} 44.6v5M${x + 18} 44.6l.8 5`} stroke={P.white} strokeWidth="2.4" opacity=".85" />
      <Crate s={0.48} x={x + 6} y={55} fruit={fruitA} />
      <Crate s={0.48} x={x + 16} y={55} fruit={fruitB} />
    </g>
  )
}

export function Bauernhof({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const winter = season === 'winter'
  switch (id) {
    case 'kuhweide':
      return (
        <Svg tier={tier} bold>
          <Grass winter={winter} />
          {/* Stufe 4: Unterstand hinten rechts */}
          {tier >= 4 ? (
            <g>
              <Wall x={54} y={36} w={18} h={14} fill={P.woodMid} planks={2} k={K} />
              <GableRoof x={54} y={37} w={18} h={8} fill={P.bark} over={2.5} k={K} />
            </g>
          ) : null}
          {tier >= 3 ? <Trough x={16} y={54} /> : null}
          <Old>
            <Cow x={32} y={52} />
            {tier >= 2 ? <Cow x={50} y={56} flip brown /> : null}
            {tier >= 3 ? <Cow x={22} y={60} brown /> : null}
            {tier >= 5 ? <Cow x={60} y={50} flip /> : null}
          </Old>
          <Paddock x0={6} x1={74} y={66} />
          {tier >= 5 ? <Pennant x={74} y={56} s={0.8} /> : null}
        </Svg>
      )
    case 'ziegenstall':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          {/* Kletterfels mit Lichtkante */}
          <path d="M8 66 Q14 36 28 38 Q38 44 40 66z" fill={P.stone} {...line} />
          <path d="M14 52q4-10 12-11" stroke={P.white} strokeWidth={D} fill="none" opacity=".4" strokeLinecap="round" />
          <path d="M30 46q6 8 7 18" stroke={P.outline} strokeWidth={D} fill="none" opacity=".2" />
          {tier >= 2 ? <path d="M30 40l10 10" stroke={P.outline} strokeWidth="3" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M30 40l10 10" stroke={P.woodLight} strokeWidth="1.4" strokeLinecap="round" /> : null}
          {/* Stall */}
          <Wall x={46} y={46} w={22} h={20} fill={P.woodLight} planks={3} k={K} />
          <GableRoof x={46} y={47} w={22} h={11} fill={P.bark} over={3} k={K} />
          <ArchDoor x={52} y={66} w={8} h={12} k={K} />
          {tier >= 4 ? <Lantern x={70.5} y={50} s={0.6} /> : null}
          <Old>
            <Goat x={24} y={64} />
            {tier >= 2 ? <Goat x={14} y={58} flip /> : null}
            {tier >= 3 ? <Goat x={24} y={40} /> : null}
            {tier >= 5 ? <Goat x={72} y={64} flip /> : null}
          </Old>
          {tier >= 5 ? <Pennant x={57} y={36} s={0.8} /> : null}
        </Svg>
      )
    case 'schweinekoben':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {/* Suhle */}
          <ellipse cx="38" cy="58" rx="24" ry="7.5" fill={P.soil} {...line} />
          <ellipse cx="32" cy="57" rx="10" ry="2.6" fill={P.soilDark} opacity=".55" />
          {/* Stufe 2: Schweinehütte */}
          {tier >= 2 ? (
            <g>
              <Wall x={56} y={44} w={16} h={14} fill={P.woodMid} planks={2} k={K} />
              <GableRoof x={56} y={45} w={16} h={7} fill={P.roof} over={2} k={K} />
              <rect x="61" y="51" width="6" height="7" rx="1" fill={P.outline} opacity=".7" />
            </g>
          ) : null}
          {tier >= 4 ? <Trough x={14} y={56} /> : null}
          <Old>
            <Pig x={30} y={54} />
            {tier >= 2 ? <Pig x={46} y={58} flip /> : null}
            {tier >= 3 ? <Pig x={22} y={60} s={0.6} /> : null}
            {tier >= 3 ? <Pig x={38} y={62} s={0.6} flip /> : null}
            {tier >= 5 ? <Pig x={54} y={62} s={0.6} /> : null}
          </Old>
          <Paddock x0={6} x1={74} y={68} />
          {tier >= 5 ? <Pennant x={74} y={58} s={0.8} /> : null}
        </Svg>
      )
    case 'gaensewiese':
      return (
        <Svg tier={tier} bold>
          <Grass rx={32} winter={winter} />
          {/* Teich mit Uferkante */}
          <ellipse cx="54" cy="56" rx="16" ry="6.5" fill={winter ? P.glass : P.water} {...line} />
          <path d="M44 54.6q8-2.6 18-.6" stroke={P.white} strokeWidth={D} fill="none" opacity=".5" strokeLinecap="round" />
          {tier >= 2 && !winter ? (
            <g>
              <path d="M70 56v-9M72 57v-7M68 56.6v-6" stroke={P.leafDark} strokeWidth="1.4" strokeLinecap="round" />
              <ellipse cx="70" cy="46.4" rx="1" ry="2" fill={P.bark} {...detail} />
            </g>
          ) : null}
          {/* Stufe 3: Gänsehäuschen */}
          {tier >= 3 ? (
            <g>
              <Wall x={8} y={42} w={14} h={12} fill={P.paper} k={K} />
              <GableRoof x={8} y={43} w={14} h={7} fill={P.roof} over={2} k={K} />
              <ArchDoor x={12.5} y={54} w={5} h={7} k={K} />
            </g>
          ) : null}
          <Old>
            <Bird x={26} y={58} />
            {tier >= 2 ? <Bird x={36} y={62} flip /> : null}
            {tier >= 3 ? <Bird x={20} y={64} /> : null}
            {tier >= 4 ? <Bird x={54} y={55} swim /> : null}
            {tier >= 5 ? <Bird x={46} y={58} flip swim /> : null}
          </Old>
          {tier >= 5 ? <Pennant x={74} y={62} s={0.8} /> : null}
        </Svg>
      )
    case 'kartoffelacker': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="36" ry="12" fill={P.soil} {...line} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              <path d={`M8 ${66 - r * 5}H72`} stroke={P.soilDark} strokeWidth="2.2" opacity=".6" strokeLinecap="round" />
              {Array.from({ length: 8 }, (_, i) => (
                <g key={i}>
                  <ellipse cx={11 + i * 8.6} cy={63 - r * 5} rx="3.2" ry="2.3" fill={winter ? P.winterLeafLight : P.leaf} stroke={P.leafDark} strokeWidth={H} />
                  {!winter && season !== 'spring' && tier >= 2 ? <circle cx={11 + i * 8.6} cy={61.6 - r * 5} r=".9" fill={i % 2 ? P.cream : P.lilac} /> : null}
                </g>
              ))}
            </g>
          ))}
          {/* Stufe 3: Kartoffelsäcke; Stufe 4: Kiste; Stufe 5: Vogelscheuche */}
          {tier >= 3 ? (
            <g>
              <path d="M64 46q-3-1-3-6q0-3 3-3.6q3 .6 3 3.6q0 5-3 6z" fill={P.canvas} {...detail} />
              <path d="M70 46q-3-1-3-5q0-3 3-3q3 0 3 3q0 4-3 5z" fill={P.canvas} {...detail} />
            </g>
          ) : null}
          {tier >= 4 ? <Crate s={0.5} x={56} y={46} fruit={P.woodLight} /> : null}
          {tier >= 5 ? (
            <g>
              <Post x={14} y={48} h={22} w={1.8} k={K} />
              <path d="M7 34h14" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M7 34h14" stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M10 34l4 8 4-8z" fill={P.denim} {...detail} />
              <circle cx="14" cy="28" r="3" fill={P.skin} {...detail} />
              <path d="M9.4 27h9.2l-2-3.4h-5.2z" fill={P.woodLight} {...detail} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'heuscheune':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {tier >= 3 ? (
            <g>
              <Wall x={3} y={48} w={14} h={18} fill={P.barn} planks={3} k={K} />
              <path d="M1 49 L17 41 V49z" fill={P.bark} {...line} />
            </g>
          ) : null}
          <Wall x={14} y={36} w={40} h={30} fill={P.barn} planks={5} k={K} />
          <GableRoof x={14} y={37} w={40} h={19} fill={P.bark} over={4} k={K} />
          {/* Scheunentor mit Andreaskreuz */}
          <rect x="26" y="46" width="16" height="20" fill={P.cream} {...line} />
          <path d="M26.8 46.8l14.4 18.4M41.2 46.8L26.8 65.2" stroke={P.barn} strokeWidth="1.8" />
          {/* Heuboden */}
          {tier >= 2 ? (
            <g>
              <rect x="29" y="25" width="10" height="9" fill={P.soilDark} {...detail} />
              <path d="M29.6 34q2-6 4.4-4q2-4 4.4 0q1 2 0 4z" fill={P.yellow} {...detail} />
            </g>
          ) : (
            <Pane x={30} y={26} w={8} h={7} k={K} />
          )}
          {tier >= 4 ? (
            <g>
              <path d="M58 54h16l-1.2 5h-13.6z" fill={P.woodMid} {...line} />
              <path d="M58.4 54q7.6-11 15.2 0z" fill={P.yellow} {...detail} />
              <circle cx="61" cy="61" r="2.8" fill={P.woodLight} {...detail} />
              <circle cx="71" cy="61" r="2.8" fill={P.woodLight} {...detail} />
            </g>
          ) : null}
          {Array.from({ length: Math.min(tier >= 4 ? 2 : 3, tier) }, (_, i) => (
            <Bale key={i} x={tier >= 4 ? 62 + i * 9 : 61 + (i % 2) * 9} y={tier >= 4 ? 68 : 66 - Math.floor(i / 2) * 7} s={0.9} />
          ))}
          {tier >= 5 ? (
            <g>
              <path d="M34 18V10" stroke={P.outline} strokeWidth={D} />
              <path d="M30 11h8l-2-2.4" stroke={P.outline} strokeWidth={D} fill="none" strokeLinecap="round" />
            </g>
          ) : null}
          {winter ? <path d="M10 37 L34 18 L58 37" stroke={P.white} strokeWidth="2.4" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'melkhaus':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          {tier >= 5 ? (
            <g>
              <rect x="40" y="27" width="4.4" height="9" fill={P.stone} {...detail} />
              <Smoke x={42} y={25} />
            </g>
          ) : null}
          <Wall x={18} y={44} w={30} h={22} fill={P.cream} k={K} />
          <GableRoof x={18} y={45} w={30} h={14} fill={P.woodDark} over={3.5} k={K} />
          <ArchDoor x={29} y={66} w={8} h={12} k={K} />
          <Pane x={20.5} y={50} w={6.5} h={6.5} k={K} />
          {tier >= 3 ? <path d="M26 53h14l-2-3.4h-10z" fill={P.woodMid} {...line} /> : null}
          {tier >= 3 ? <Pane x={39.5} y={50} w={6.5} h={6.5} k={K} /> : null}
          {tier >= 2 ? <path d="M40 61h8" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M40 61h8" stroke={P.woodLight} strokeWidth="1.6" strokeLinecap="round" /> : null}
          {Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <Can key={i} x={56 + i * 5.2} y={66} />
          ))}
          {tier >= 4 ? (
            <Old>
              <Cow x={10} y={48} />
            </Old>
          ) : null}
        </Svg>
      )
    case 'kaeserei':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          <Wall x={10} y={42} w={34} h={24} fill={P.paper} k={K} />
          {/* Fachwerk */}
          <path d="M10.8 52H43.2M21 42.8v22.4M33 42.8v22.4M11 52l10-9M43 52l-10-9" stroke={P.woodDark} strokeWidth="1.5" fill="none" />
          <GableRoof x={10} y={43} w={34} h={16} fill={P.autumnDark} over={3.5} k={K} />
          <Pane x={35.5} y={54} w={6} h={6.5} k={K} />
          {tier >= 3 ? (
            <g>
              <path d="M12 38h8" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
              <path d="M13.5 38v2M18.5 38v2" stroke={P.outline} strokeWidth={H} />
              <path d="M12.6 40h6.8l-3.4 5z" fill={P.yellow} {...detail} />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M22 66v-6a5 5 0 0 1 10 0v6z" fill={P.stone} {...line} />
              <path d="M24.6 66v-5a2.4 2.4 0 0 1 4.8 0v5z" fill={P.soilDark} {...detail} />
            </g>
          ) : null}
          {/* Reiferegal */}
          <Post x={50} y={66} h={tier >= 2 ? 20 : 11} w={2} k={K} />
          <Post x={72} y={66} h={tier >= 2 ? 20 : 11} w={2} k={K} />
          <rect x="49" y="57" width="24" height="2.2" rx=".6" fill={P.woodMid} {...detail} />
          {tier >= 2 ? <rect x="49" y="47.4" width="24" height="2.2" rx=".6" fill={P.woodMid} {...detail} /> : null}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <Cheese key={i} x={54 + (i % 3) * 7} y={i < 3 ? 57 : 47.4} s={0.75} />
          ))}
          {tier >= 5 ? <Cheese x={47} y={68} s={1.1} /> : null}
        </Svg>
      )
    case 'hofbaeckerei':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <Wall x={8} y={44} w={28} h={22} fill={P.paper} k={K} />
          <GableRoof x={8} y={45} w={28} h={14} fill={P.roof} over={3} k={K} />
          <ArchDoor x={23} y={66} w={8} h={12} k={K} />
          <Pane x={11} y={50} w={6.5} h={6.5} k={K} />
          {/* Backofen aus Lehm mit Glut */}
          <path d="M42 66a13 12 0 0 1 26 0z" fill={P.stoneLight} {...line} />
          <path d="M46 60q4-7 11-7" stroke={P.white} strokeWidth={D} fill="none" opacity=".45" strokeLinecap="round" />
          <path d="M50 66a5 5 0 0 1 10 0z" fill={tier >= 2 ? P.orange : P.soilDark} {...detail} />
          <rect x="60" y="44" width="4.4" height="10" fill={P.stone} {...detail} />
          {tier >= 2 ? <Smoke x={62} y={42} /> : null}
          {tier >= 3 ? <path d="M36 61h6" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M36 61h6" stroke={P.woodLight} strokeWidth="1.6" strokeLinecap="round" /> : null}
          {Array.from({ length: Math.min(3, tier - 2) }, (_, i) => (
            <Loaf key={i} x={37} y={60.4 - i * 2.4} />
          ))}
          {tier >= 4 ? <Crate x={72} y={68} s={0.5} fruit={P.autumn} /> : null}
          {tier >= 5 ? <Pennant x={22} y={31} s={0.8} /> : null}
        </Svg>
      )
    case 'bauernmarkt': {
      const stalls = Math.min(3, 1 + Math.floor(tier / 2))
      const colors = [P.tomato, P.denim, P.leaf]
      const fa = [P.red, P.orange, P.leafLight]
      const fb = [P.yellow, P.woodLight, P.plum]
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          {Array.from({ length: stalls }, (_, i) => (
            <Stall key={i} x={4 + i * 24} c={colors[i]!} fruitA={fa[i]!} fruitB={fb[i]!} />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M72 66l2-12M78 66l-2-12" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
              <rect x="69.5" y="47" width="11" height="8" rx="1" fill={P.leafDark} {...line} />
              <path d="M72 50h6M72 52.4h4" stroke={P.white} strokeWidth={H} opacity=".8" />
            </g>
          ) : null}
          {tier >= 4 ? <Barrel x={76} y={69} s={0.6} /> : null}
          {tier >= 5 ? (
            <path d="M2 40q19 6 38 0t38 0" stroke={P.outline} strokeWidth={H} fill="none" />
          ) : null}
          {tier >= 5
            ? [8, 18, 28, 50, 60, 70].map((x, i) => (
                <path key={x} d={`M${x} ${41.4 + (i % 3) * 0.6}l2 4 2-4z`} fill={[P.red, P.yellow, P.denim][i % 3]} {...detail} />
              ))
            : null}
        </Svg>
      )
    }
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
