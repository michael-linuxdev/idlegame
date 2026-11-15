/**
 * Kapitel 43 — Samenbank am Stadtrand im kräftigen Stil (2026-11-14,
 * Weinberg-Niveau): Boden, Vermehrungsbeete, Netzzelte, Gebäude, Kühltresor,
 * Archiv, Versand und Besucherpfad mit Kontur. Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { Bunting } from './partsA'
import type { AreaProps } from './partsB'
import { Bee, LeafLitter, OmaTin, Packet, SeedJar, Snowfall, SnowDrifts } from './partsH'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Boden: gemähter Rasen bzw. Kies, Herbst Laub, Winter Schnee. */
function Floor({ season, cy = 61, rx = 36, ry = 9, paved }: { season?: string; cy?: number; rx?: number; ry?: number; paved?: boolean }) {
  const z = ssn(season)
  const fill = z === 'winter' ? P.cream : paved ? P.stoneLight : z === 'spring' ? P.soil : z === 'autumn' ? P.woodMid : P.leafMoss
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <ellipse cx="40" cy={cy - ry * 0.35} rx={rx * 0.68} ry={ry * 0.4} fill={P.white} opacity=".14" />
      {paved && z !== 'winter' ? <path d={`M${40 - rx * 0.55} ${cy + 1}h6M${40 + rx * 0.2} ${cy + 3}h7M${40 - rx * 0.1} ${cy - 3}h5`} stroke={P.stone} strokeWidth=".7" strokeLinecap="round" /> : null}
      {z === 'autumn' && !paved ? <Old><LeafLitter cy={cy + 2} w={rx * 1.6} n={8} /></Old> : null}
      {z === 'winter' ? <Old><SnowDrifts cy={cy + 2} w={rx * 1.4} /></Old> : null}
    </g>
  )
}

/** Etikett-Stecker im Beet. */
function Label({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y}v-3`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
      <path d={`M${x} ${y}v-3`} stroke={P.white} strokeWidth=".8" strokeLinecap="round" />
      <rect x={x - 1.4} y={y - 5} width="2.8" height="2" rx=".3" fill={P.white} stroke={P.outline} strokeWidth={H} />
    </g>
  )
}

/** Pflanze im Vermehrungsbeet: Bohne an Stange, Salat im Samen (geschosst), Sonnenblume. */
function SeedCrop({ x, y, kind, season }: { x: number; y: number; kind: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') {
    return (
      <g>
        <path d={`M${x} ${y}v-${kind === 0 ? 12 : 6}M${x - 1.4} ${y}l-.8 -4M${x + 1.4} ${y}l.8 -4`} stroke={P.outline} strokeWidth="1.9" strokeLinecap="round" />
        <path d={`M${x} ${y}v-${kind === 0 ? 12 : 6}M${x - 1.4} ${y}l-.8 -4M${x + 1.4} ${y}l.8 -4`} stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" />
        <ellipse cx={x} cy={y - 0.6} rx="2.4" ry=".7" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />
      </g>
    )
  }
  if (kind === 0) {
    const h = z === 'spring' ? 6 : 16
    return (
      <g>
        <path d={`M${x} ${y}V${y - 18}`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
        <path d={`M${x} ${y}V${y - 18}`} stroke={P.woodMid} strokeWidth="1.1" strokeLinecap="round" />
        <path d={`M${x} ${y}q-2 -${h / 4} 0 -${h / 2}q2 -${h / 4} 0 -${h / 2}`} stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d={`M${x} ${y}q-2 -${h / 4} 0 -${h / 2}q2 -${h / 4} 0 -${h / 2}`} stroke={P.leafDark} strokeWidth=".9" fill="none" strokeLinecap="round" />
        {[0.3, 0.55, 0.8].map((k) => (
          <ellipse key={k} cx={x + (k > 0.5 ? 1.6 : -1.6)} cy={y - h * k} rx="1.6" ry="1.1" fill={z === 'autumn' ? P.woodLight : P.leaf} stroke={P.outline} strokeWidth={H * 0.7} />
        ))}
        {z === 'summer' ? <circle cx={x + 1.4} cy={y - 8} r=".8" fill={P.red} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
        {z === 'autumn' ? (
          <g>
            <path d={`M${x - 1} ${y - 6}q-.6 3 0 5`} stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d={`M${x - 1} ${y - 6}q-.6 3 0 5`} stroke={P.woodMid} strokeWidth="1.1" fill="none" strokeLinecap="round" />
          </g>
        ) : null}
      </g>
    )
  }
  if (kind === 1) {
    return (
      <g>
        <ellipse cx={x} cy={y - 1.4} rx="2.6" ry="1.6" fill={z === 'autumn' ? P.woodLight : P.leafLight} stroke={P.outline} strokeWidth={H * 0.8} />
        <path d={`M${x - 1.4} ${y - 2}q1.4 -.8 2.8 0`} stroke={P.white} strokeWidth=".5" opacity=".45" fill="none" />
        {z !== 'spring' ? (
          <g>
            <path d={`M${x} ${y - 2}v-7M${x} ${y - 6}l-2 -2M${x} ${y - 7}l2 -2`} stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
            <path d={`M${x} ${y - 2}v-7M${x} ${y - 6}l-2 -2M${x} ${y - 7}l2 -2`} stroke={z === 'autumn' ? P.woodMid : P.leaf} strokeWidth=".9" strokeLinecap="round" />
          </g>
        ) : null}
        {z === 'summer' ? [-2, 0, 2].map((d) => <circle key={d} cx={x + d} cy={y - 9 + Math.abs(d) * 0.6} r=".7" fill={P.yellow} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
        {z === 'autumn' ? [-2, 0, 2].map((d) => <circle key={d} cx={x + d} cy={y - 9 + Math.abs(d) * 0.6} r=".7" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
      </g>
    )
  }
  const h = z === 'spring' ? 5 : 15
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.outline} strokeWidth="2.1" strokeLinecap="round" />
      <path d={`M${x} ${y}V${y - h}`} stroke={P.leafDark} strokeWidth="1" strokeLinecap="round" />
      <ellipse cx={x - 1.6} cy={y - h * 0.5} rx="1.6" ry=".9" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.7} />
      {z !== 'spring' ? (
        <g>
          <circle cx={x} cy={y - h - 1.6} r="2.6" fill={z === 'autumn' ? P.woodDark : P.yellow} stroke={P.outline} strokeWidth={H} />
          <circle cx={x} cy={y - h - 1.6} r="1.2" fill={P.soilDark} />
        </g>
      ) : null}
    </g>
  )
}

/** Tomatenpflanze mit Sortenfarbe. */
function Tomato({ x, y, c, season, n = 3 }: { x: number; y: number; c: string; season?: string; n?: number }) {
  const z = ssn(season)
  if (z === 'winter') {
    return (
      <g>
        <path d={`M${x} ${y}V${y - 12}`} stroke={P.outline} strokeWidth="2.1" strokeLinecap="round" />
        <path d={`M${x} ${y}V${y - 12}`} stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
      </g>
    )
  }
  const h = z === 'spring' ? 6 : 14
  return (
    <g>
      <path d={`M${x + 1.6} ${y}V${y - 15}`} stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
      <path d={`M${x + 1.6} ${y}V${y - 15}`} stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" />
      <path d={`M${x} ${y}Q${x - 1} ${y - h / 2} ${x} ${y - h}`} stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y}Q${x - 1} ${y - h / 2} ${x} ${y - h}`} stroke={P.leafDark} strokeWidth="1.1" fill="none" strokeLinecap="round" />
      {[0.35, 0.6, 0.85].map((t, i) => (
        <ellipse key={t} cx={x + (i % 2 ? 2.2 : -2.2)} cy={y - h * t} rx="2.4" ry="1.3" fill={z === 'autumn' ? P.leafMoss : i % 2 ? P.leaf : P.leafDark} stroke={P.outline} strokeWidth={H * 0.7} />
      ))}
      {z === 'summer' || z === 'autumn'
        ? Array.from({ length: n }, (_, i) => (
            <g key={i}>
              <circle cx={x + (i % 2 ? 1.8 : -1.6)} cy={y - h * (0.3 + i * 0.2)} r="1.6" fill={c} stroke={P.outline} strokeWidth={H * 0.8} />
              <circle cx={x + (i % 2 ? 1.4 : -2)} cy={y - h * (0.3 + i * 0.2) - 0.5} r=".45" fill={P.white} opacity=".55" />
              {c === P.orange && i === 0 ? <path d={`M${x - 2.6} ${y - h * 0.3}h2`} stroke={P.yellow} strokeWidth=".4" /> : null}
            </g>
          ))
        : null}
    </g>
  )
}

/** Netzzelt (Bestäubungszelt). */
function MeshTent({ x, y, w = 16, h = 14, season, bees = 0 }: { x: number; y: number; w?: number; h?: number; season?: string; bees?: number }) {
  const z = ssn(season)
  return (
    <g>
      {z === 'winter' ? null : (
        <g>
          <ellipse cx={x + w / 2} cy={y - 3} rx={w * 0.36} ry="3" fill={z === 'autumn' ? P.woodLight : P.leaf} {...detail} />
          {z === 'summer' ? [0.3, 0.5, 0.7].map((k) => <circle key={k} cx={x + w * k} cy={y - 5} r=".9" fill={[P.yellow, P.lilac, P.white][Math.round(k * 10) % 3]} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
        </g>
      )}
      <rect x={x} y={y - h} width={w} height={h} fill={P.white} opacity=".55" />
      <rect x={x} y={y - 1.4} width={w} height="1.4" fill={P.outline} opacity=".15" />
      <path d={`M${x} ${y - h}l${w / 2} -3l${w / 2} 3`} fill={P.white} opacity=".7" />
      <path d={`M${x + 2} ${y - h - 0.6}l${w / 2 - 2} -2.2`} stroke={P.white} strokeWidth=".7" opacity=".6" strokeLinecap="round" />
      {Array.from({ length: Math.floor(w / 3) }, (_, i) => (
        <path key={i} d={`M${x + 3 + i * 3} ${y - h}v${h}`} stroke={P.outline} strokeWidth={H * 0.5} opacity=".45" />
      ))}
      <path d={`M${x} ${y - h / 2}h${w}`} stroke={P.outline} strokeWidth={H * 0.5} opacity=".45" />
      <path d={`M${x} ${y}v${-h}l${w / 2} -3l${w / 2} 3v${h}z`} fill="none" {...detail} />
      {z === 'winter' ? <path d={`M${x} ${y - h}l${w / 2} -3l${w / 2} 3`} stroke={P.white} strokeWidth="1.2" fill="none" /> : null}
      {z !== 'winter' ? Array.from({ length: bees }, (_, i) => <Old key={i}><Bee x={x + 4 + i * 5} y={y - h + 5 + (i % 2) * 2} s={1.4} bumble /></Old>) : null}
    </g>
  )
}

/** Flaches modernes Gebäude mit Gründach (Fußpunkt unten links). */
function Building({ x, y, w, h, season, lit }: { x: number; y: number; w: number; h: number; season?: string; lit?: boolean }) {
  const z = ssn(season)
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.cream} {...line} />
      <rect x={x + 0.6} y={y - h + 0.4} width={w - 1.2} height="1.4" fill={P.outline} opacity=".16" />
      <rect x={x - 1} y={y - h - 2} width={w + 2} height="2.4" fill={z === 'winter' ? P.white : z === 'autumn' ? P.autumnDark : P.leafLight} {...detail} />
      <path d={`M${x + 1} ${y - h - 1.3}h${w * 0.6}`} stroke={P.white} strokeWidth=".6" opacity=".45" strokeLinecap="round" />
      <rect x={x + 2} y={y - h + 3} width={w - 4} height={h * 0.38} fill={lit ? P.lamp : P.glass} stroke={P.outline} strokeWidth={D} />
      <path d={`M${x + 4} ${y - h + 3 + h * 0.3}l4 -${h * 0.22}`} stroke={P.white} strokeWidth=".7" opacity=".45" strokeLinecap="round" />
      {Array.from({ length: Math.max(1, Math.floor((w - 4) / 6)) }, (_, i) => (
        <path key={i} d={`M${x + 2 + (i + 1) * 6} ${y - h + 3}v${h * 0.38}`} stroke={P.outline} strokeWidth={H} />
      ))}
    </g>
  )
}

export function Samenbank({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  const summer = z === 'summer'
  const spring = z === 'spring'
  const autumn = z === 'autumn'
  switch (id) {
    case 'vermehrungsbeete': {
      const beds = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: beds }, (_, i) => {
            const x = 8 + (i % 2) * 34
            const y = 58 + Math.floor(i / 2) * 9
            return (
              <g key={i}>
                <rect x={x} y={y - 4} width="28" height="4" rx="1" fill={winter ? P.cream : P.soil} {...detail} />
                <path d={`M${x + 1.4} ${y - 3.2}h25`} stroke={P.white} strokeWidth=".5" opacity=".3" strokeLinecap="round" />
                {[5, 13, 21].map((dx) => (
                  <SeedCrop key={dx} x={x + dx} y={y - 1.4} kind={i % 3} season={season} />
                ))}
                <Label x={x + 26} y={y - 1} />
              </g>
            )
          })}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.leaf} s={0.75} hat={P.woodLight} /> : null}
          {winter ? <Old><Snowfall n={6} y1={34} /></Old> : null}
        </Svg>
      )
    }
    case 'reinigungsraum': {
      const sieves = Math.min(3, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} paved />
          <rect x="4" y="22" width="72" height="30" fill={P.paper} {...line} />
          <rect x="5" y="22.6" width="70" height="1.6" fill={P.outline} opacity=".14" />
          <path d="M4 50h72" stroke={P.outline} strokeWidth={D} />
          <rect x="10" y="26" width="16" height="12" fill={winter ? P.lamp : P.glass} stroke={P.outline} strokeWidth={D} />
          <path d="M11.4 30.6l4 -3.4M19.4 36.4l4 -3.4" stroke={P.white} strokeWidth=".7" opacity=".45" strokeLinecap="round" />
          <path d="M18 26v12M10 32h16" stroke={P.outline} strokeWidth={H} />
          <path d="M30 34h16" stroke={P.outline} strokeWidth="2.3" strokeLinecap="round" />
          <path d="M30 34h16" stroke={P.woodMid} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M8 52v12M42 52v12" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M8 52v12M42 52v12" stroke={P.metal} strokeWidth="1.2" strokeLinecap="round" />
          <rect x="6" y="50" width="38" height="2" fill={P.woodLight} {...detail} />
          {Array.from({ length: sieves }, (_, i) => (
            <g key={i}>
              <ellipse cx={14 + i * 0.4} cy={49 - i * 2.4} rx="6" ry="1.6" fill={P.woodMid} {...detail} />
              <ellipse cx={14 + i * 0.4} cy={49 - i * 2.4} rx="5" ry="1.1" fill={i === sieves - 1 ? (autumn ? P.seed : P.woodLight) : P.metal} />
            </g>
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M66 44h6l2 4" stroke={P.outline} strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M66 44h6l2 4" stroke={P.metal} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="50" y="40" width="16" height="22" fill={P.leafDark} {...detail} />
              <path d="M52 42v12" stroke={P.white} strokeWidth=".7" opacity=".3" strokeLinecap="round" />
              <circle cx="58" cy="48" r="3.6" fill={P.metal} {...detail} />
              <path d="M56 48h4M58 46v4" stroke={P.stoneLight} strokeWidth=".5" />
              <rect x="52" y="56" width="12" height="4" fill={P.woodLight} stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          {tier >= 2 ? <path className="smoke" d="M75 46c1 -1 2 0 3 -1" stroke={P.woodLight} strokeWidth=".6" fill="none" /> : null}
          {tier >= 3 ? [26, 32, 38].map((x, i) => <Old key={x}><SeedJar x={x} y={50} s={1.2} seed={[P.seed, P.cream, P.woodDark][i]!} /></Old>) : null}
          {tier >= 4 ? (
            <g>
              <path d="M20 66h8l-1 -5h-6z" fill={P.metal} {...detail} />
              <ellipse cx="24" cy="61" rx="3.6" ry="1" fill={autumn ? P.gold : P.woodLight} stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={38} y={70} c={P.white} s={0.75} hat={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'keimlabor': {
      const dishes = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} paved />
          <Building x={6} y={46} w={44} h={22} season={season} lit={winter} />
          <path d="M10 52.4v12M68 52.4v12" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
          <path d="M10 52.4v12M68 52.4v12" stroke={P.metal} strokeWidth="1.2" strokeLinecap="round" />
          <rect x="8" y="50" width="62" height="2.4" fill={P.white} {...detail} />
          {Array.from({ length: dishes }, (_, i) => {
            const cx = 13 + (i % 6) * 9.6
            const cy = 49 - Math.floor(i / 6) * 3.2
            return (
              <g key={i}>
                <ellipse cx={cx} cy={cy} rx="3.6" ry="1.2" fill={P.glass} stroke={P.outline} strokeWidth={H * 0.8} />
                <ellipse cx={cx} cy={cy} rx="2.8" ry=".8" fill={P.paper} />
                {[-1.4, 0, 1.4].map((d, k) => (
                  <g key={d}>
                    <circle cx={cx + d} cy={cy} r=".45" fill={P.seed} />
                    {(i + k) % 4 !== 3 ? <path d={`M${cx + d} ${cy}q.4 -1.4 1 -1.6`} stroke={P.leafLight} strokeWidth=".4" fill="none" /> : null}
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M58 46l3 -6l2 1M60 46h6" stroke={P.outline} strokeWidth="2.3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M58 46l3 -6l2 1M60 46h6" stroke={P.charcoal} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="63.4" cy="40" r="1" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          {tier >= 5 ? <Farmer x={40} y={70} c={P.white} s={0.75} hat={P.white} /> : null}
          {spring ? (
            <g>
              <path d="M64 58q2 -3 4 0" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" />
              <path d="M64 58q2 -3 4 0" stroke={P.leaf} strokeWidth="1.1" fill="none" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'kuehltresor': {
      const shelves = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M2 64Q40 -4 78 64z" fill={winter ? P.white : autumn ? P.woodMid : P.leaf} {...line} />
          <path d="M9 54Q20 34 34 31" stroke={P.white} strokeWidth="1.2" opacity=".3" fill="none" strokeLinecap="round" />
          <rect x="20" y="34" width="40" height="30" fill={P.stoneLight} {...line} />
          <rect x="22" y="36" width="36" height="28" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
          <path d="M21.4 35h37" stroke={P.white} strokeWidth=".6" opacity=".45" strokeLinecap="round" />
          {Array.from({ length: shelves }, (_, i) => (
            <g key={i}>
              <path d={`M24 ${62 - i * 6.4}h32`} stroke={P.metal} strokeWidth=".8" />
              {Array.from({ length: 7 }, (_, k) => (
                <rect key={k} x={25 + k * 4.4} y={58.8 - i * 6.4} width="2.6" height="3.2" rx=".4" fill={P.glass} stroke={P.outline} strokeWidth={H * 0.5} />
              ))}
            </g>
          ))}
          <circle cx="66" cy="50" r="9" fill={P.metal} {...line} />
          <path d="M59.6 46a7.4 7.4 0 0 1 5 -4" stroke={P.white} strokeWidth=".8" opacity=".5" fill="none" strokeLinecap="round" />
          <circle cx="66" cy="50" r="6" fill={P.stone} {...detail} />
          <path d="M66 45v10M61 50h10" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
          {tier >= 2 ? <circle cx="40" cy="38.4" r="1.1" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
          {tier >= 3 ? <circle cx="30" cy="38.4" r="1.1" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
          {tier >= 4 ? <circle cx="50" cy="38.4" r="1.1" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
          {winter ? <path d="M21 34h38" stroke={P.white} strokeWidth="1.6" strokeLinecap="round" /> : null}
          {winter ? [24, 34, 46, 56].map((x) => <path key={x} d={`M${x} 34.4v2`} stroke={P.glassEdge} strokeWidth=".6" />) : null}
          {tier >= 5 ? <Farmer x={12} y={72} c={P.blue} s={0.75} hat={P.charcoal} /> : null}
        </Svg>
      )
    }
    case 'sortengarten': {
      const n = 2 + tier
      const colors = [P.tomato, P.yellow, P.plum, P.orange, P.berry, P.leafPale, P.amber]
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: n }, (_, i) => (
            <g key={i} transform={`translate(${10 + i * 9} ${62 + (i % 2) * 4}) scale(1.3)`}>
              <Tomato x={0} y={0} c={colors[i % 7]!} season={season} n={2 + Math.min(2, tier - 1)} />
              <Label x={2.4} y={3} />
            </g>
          ))}
          {tier >= 5 ? <Kid x={72} y={72} c={P.yellow} s={1.1} /> : null}
          {winter ? <Old><Snowfall n={6} y1={34} /></Old> : null}
        </Svg>
      )
    }
    case 'samenarchiv': {
      const drawers = 3 + tier * 3
      return (
        <Svg tier={tier} bold>
          <Floor season={season} paved />
          <rect x="8" y="22" width="40" height="42" fill={P.woodDark} {...line} />
          <path d="M9.6 23h36.8" stroke={P.woodLight} strokeWidth=".6" opacity=".45" strokeLinecap="round" />
          {Array.from({ length: drawers }, (_, i) => (
            <g key={i}>
              <rect x={10 + (i % 3) * 12.4} y={24 + Math.floor(i / 3) * 6.6} width="11" height="5.6" fill={P.woodLight} stroke={P.outline} strokeWidth={H} />
              <rect x={14 + (i % 3) * 12.4} y={25.4 + Math.floor(i / 3) * 6.6} width="3" height="1.4" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />
              <circle cx={15.5 + (i % 3) * 12.4} cy={28 + Math.floor(i / 3) * 6.6} r=".55" fill={P.brass} stroke={P.outline} strokeWidth={H * 0.5} />
            </g>
          ))}
          {tier >= 2 ? [54, 70].map((x) => <Post key={x} x={x} y={64} h={10} w={1.8} k={K} />) : null}
          {tier >= 2 ? <rect x="52" y="52" width="20" height="2" fill={P.woodMid} {...detail} /> : null}
          {tier >= 3 ? <path d="M55 51.6l5 -1l1 2l-5 1z M60 52l5 -1.6l1.2 2l-5 1.4z" fill={P.paper} stroke={P.outline} strokeWidth={H * 0.8} strokeLinejoin="round" /> : null}
          {tier >= 4 ? <Old><OmaTin x={67} y={52} s={1} /></Old> : null}
          {tier >= 3 ? <path d="M62 38V20" stroke={P.outline} strokeWidth=".7" /> : null}
          {tier >= 3 ? <circle cx="62" cy="40" r="2" fill={winter ? P.lamp : P.paper} {...detail} /> : null}
          {tier >= 5 ? <Kid x={46} y={70} c={P.berry} s={1.1} hair={P.woodDark} /> : null}
        </Svg>
      )
    }
    case 'bestaeuberzelte': {
      const tents = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: tents }, (_, i) => (
            <MeshTent key={i} x={6 + (i % 2) * 36 + Math.floor(i / 2) * 6} y={58 + Math.floor(i / 2) * 9} w={i < 2 ? 30 : 22} h={i < 2 ? 18 : 12} season={season} bees={summer || spring ? Math.min(3, tier - i) : 0} />
          ))}
          {tier >= 5 ? <Farmer x={72} y={72} c={P.yellow} s={0.75} hat={P.woodLight} /> : null}
          {winter ? <Old><Snowfall n={6} y1={30} /></Old> : null}
        </Svg>
      )
    }
    case 'versandstelle': {
      const packets = 2 + tier * 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} paved />
          <rect x="8" y="48" width="40" height="14" fill={P.woodLight} {...line} />
          <rect x="8.6" y="48.4" width="38.8" height="1.6" fill={P.outline} opacity=".16" />
          <rect x="6" y="46" width="44" height="2.4" fill={P.woodMid} {...detail} />
          {Array.from({ length: packets }, (_, i) => (
            <Old key={i}><Packet x={10 + (i % 8) * 5} y={46 - Math.floor(i / 8) * 4} s={1.1} c={[P.paper, P.label, P.canvas, P.cream][i % 4]!} /></Old>
          ))}
          {tier >= 2 ? [0, 1].map((k) => <rect key={k} x={54 + k * 6} y={58 - k * 4} width="8" height="6" fill={P.woodMid} {...detail} />) : null}
          {tier >= 3 ? (
            <g>
              <path d="M70 64v-12" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M70 64v-12" stroke={P.charcoal} strokeWidth="1" strokeLinecap="round" />
              <rect x="66" y="46" width="8" height="6" rx="1" fill={P.yellow} {...detail} />
              <path d="M67 48h6" stroke={P.charcoal} strokeWidth=".5" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <circle cx="20" cy="68" r="2.4" fill="none" stroke={P.outline} strokeWidth={D} />
              <circle cx="36" cy="68" r="2.4" fill="none" stroke={P.outline} strokeWidth={D} />
              <path d="M20 68l6 -4h8l2 4M26 64l-2 -3" stroke={P.outline} strokeWidth="2.1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 68l6 -4h8l2 4M26 64l-2 -3" stroke={P.leafDark} strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="27" y="61" width="8" height="4" fill={P.woodMid} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Kid x={46} y={72} c={P.berry} s={1.1} hair={P.woodDark} /> : null}
          {winter ? <Old><Snowfall n={5} y1={34} /></Old> : null}
        </Svg>
      )
    }
    case 'besucherpfad': {
      const signs = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <path d="M4 66Q40 56 76 62" stroke={P.outline} strokeWidth="5.6" fill="none" strokeLinecap="round" />
          <path d="M4 66Q40 56 76 62" stroke={winter ? P.white : P.stoneLight} strokeWidth="4" fill="none" strokeLinecap="round" />
          <path d="M44 56V30h28v26" fill={P.stoneLight} {...line} />
          <path d="M45.6 31.4h24.8" stroke={P.white} strokeWidth=".7" opacity=".45" strokeLinecap="round" />
          <rect x="49" y="34" width="18" height="14" rx="1" fill={P.charcoal} stroke={P.outline} strokeWidth={D} />
          {[0, 1].map((r) => (
            <path key={r} d={`M51 ${44 - r * 5}h14`} stroke={P.metal} strokeWidth=".5" />
          ))}
          {[52, 55, 58, 61, 64].map((x) => (
            <rect key={x} x={x} y="41.6" width="1.6" height="2.2" fill={P.glass} />
          ))}
          <rect x="49" y="34" width="18" height="14" rx="1" fill={P.glassEdge} opacity=".25" />
          {Array.from({ length: signs }, (_, i) => (
            <g key={i}>
              <Post x={10 + i * 9} y={64} h={7} w={1.5} k={K} />
              <rect x={7 + i * 9} y={52} width="6" height="5" rx=".5" fill={P.white} {...detail} />
              <circle cx={10 + i * 9} cy={54.4} r="1.2" fill={[P.leaf, P.yellow, P.berry, P.blue][i]} stroke={P.outline} strokeWidth={H * 0.6} />
            </g>
          ))}
          {tier >= 3 ? <Kid x={54} y={62} c={P.yellow} s={1.1} /> : null}
          {tier >= 4 ? <Kid x={60} y={62} c={P.blue} s={1.1} hair={P.woodLight} /> : null}
          {tier >= 5 ? <Farmer x={68} y={66} c={P.leaf} s={0.75} hat={P.charcoal} /> : null}
          {winter ? <path d="M43.4 30h29.2" stroke={P.white} strokeWidth="1.6" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'offenertag': {
      const guests = Math.min(4, tier)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Old><Bunting y={24} n={3 + tier} /></Old>
          {[20, 60].map((x) => <Post key={x} x={x} y={60} h={10} w={1.8} k={K} />)}
          <rect x="18" y="48" width="44" height="2" fill={P.woodLight} {...detail} />
          <rect x="18" y="50" width="44" height="6" fill={P.leafPale} opacity=".85" {...detail} />
          {Array.from({ length: 3 + tier }, (_, i) => (
            <Old key={i}><Packet x={21 + i * 4.6} y={48} s={1.2} c={[P.paper, P.label, P.canvas][i % 3]!} /></Old>
          ))}
          {tier >= 2 ? <Old><SeedJar x={58} y={48} s={1.3} /></Old> : null}
          {Array.from({ length: guests }, (_, i) => (
            <Farmer key={i} x={14 + i * 17} y={68 + (i % 2) * 2} c={[P.berry, P.blue, P.yellow, P.leaf][i]!} s={0.75} hat={[P.charcoal, P.woodLight, P.plum, P.woodDark][i]!} />
          ))}
          {tier >= 3 ? <Kid x={46} y={64} c={P.orange} s={1.1} /> : null}
          {tier >= 4 ? [10, 70].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 60v-18`} stroke={P.outline} strokeWidth=".6" />
              <ellipse cx={x} cy={40} rx="2.4" ry="3" fill={[P.leaf, P.yellow][i]} {...detail} />
              <ellipse cx={x - 0.8} cy={38.8} rx=".6" ry="1" fill={P.white} opacity=".5" />
            </g>
          )) : null}
          {winter ? <Old><Snowfall n={6} y1={22} /></Old> : null}
          {spring ? <circle cx="66" cy="14" r="1" fill={P.pink} stroke={P.outline} strokeWidth={H * 0.5} /> : null}
        </Svg>
      )
    }
  }
  return null
}
