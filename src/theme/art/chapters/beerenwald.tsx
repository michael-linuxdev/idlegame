/**
 * Kapitel 23 — Beerenwald in Schweden (Dalarna) im kräftigen Stil
 * (2026-11-14, Weinberg-Niveau): falunrote Hütte mit weißen Ecken, Saftküche,
 * Holzstapel, Seesauna auf Pfählen und Mittsommerstange mit Kontur. Jede
 * Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Conifer, Snowcap } from './partsA'
import { Jar, Shadow } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Person } from './figures'
import { type AreaProps } from './partsB'
import { Birch } from './partsC'
import { BerryShrub, Fire, WaterBand } from './partsD'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Waldboden mit Moos. */
function Forest({ winter, cy = 60, rx = 36, ry = 10 }: { winter?: boolean; cy?: number; rx?: number; ry?: number }) {
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={winter ? P.frost : P.leafMoss} {...line} />
      <ellipse cx="32" cy={cy - 2} rx={rx * 0.5} ry={ry * 0.3} fill={winter ? P.white : P.leaf} opacity=".6" />
      <ellipse cx="50" cy={cy + ry * 0.4} rx={rx * 0.4} ry={ry * 0.25} fill={P.outline} opacity=".1" />
    </g>
  )
}

/** Pfifferling. */
function Chanterelle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return <path d={`M${x - 0.6 * s} ${y}l-.4 -${2 * s}q-1.4 -1.6 -.4 -${2 * s}h${3.6 * s}q1 .4 -.4 ${2 * s}l-.4 ${2 * s}z`} fill={P.amber} stroke={P.outline} strokeWidth={H * 0.8} />
}

/** Falunrote Hütte mit weißen Ecken (Fußpunkt unten links). */
function RedCabin({ x, y, w, h, winter, lit }: { x: number; y: number; w: number; h: number; winter?: boolean; lit?: boolean }) {
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.barn} {...line} />
      {Array.from({ length: Math.round(h / 2.6) }, (_, i) => (
        <path key={i} d={`M${x} ${y - h + 1.4 + i * 2.6}h${w}`} stroke={P.outline} strokeWidth={H} opacity=".5" />
      ))}
      <rect x={x} y={y - h} width={w} height="2" fill={P.outline} opacity=".2" />
      <path d={`M${x + 0.8} ${y - 0.6}V${y - h}M${x + w - 0.8} ${y - 0.6}V${y - h}`} stroke={P.outline} strokeWidth="2.8" />
      <path d={`M${x + 0.8} ${y - 0.6}V${y - h}M${x + w - 0.8} ${y - 0.6}V${y - h}`} stroke={P.white} strokeWidth="1.5" />
      <path d={`M${x - 3} ${y - h}L${x + w / 2} ${y - h - w * 0.4}L${x + w + 3} ${y - h}z`} fill={P.charcoal} {...line} />
      <path d={`M${x - 2} ${y - h - 0.6}L${x + w / 2} ${y - h - w * 0.4 + 0.8}L${x + w + 2} ${y - h - 0.6}`} stroke={P.white} strokeWidth="1.1" fill="none" strokeLinejoin="round" />
      <rect x={x + w * 0.15} y={y - h * 0.7} width={w * 0.22} height={h * 0.35} fill={lit ? P.lamp : P.waterLight} stroke={P.white} strokeWidth="1" />
      <rect x={x + w * 0.15 - 0.8} y={y - h * 0.7 - 0.8} width={w * 0.22 + 1.6} height={h * 0.35 + 1.6} fill="none" stroke={P.outline} strokeWidth={D} />
      <rect x={x + w * 0.6} y={y - h * 0.68} width={w * 0.2} height={h * 0.68} fill={P.leafDark} stroke={P.white} strokeWidth=".9" />
      {winter ? <Snowcap d={`M${x - 2} ${y - h}L${x + w / 2} ${y - h - w * 0.38}L${x + w + 2} ${y - h}`} /> : null}
    </g>
  )
}

/** Holzscheit-Stirnseite. */
function Log({ x, y, birch }: { x: number; y: number; birch?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r="2.4" fill={birch ? P.cream : P.woodLight} stroke={P.outline} strokeWidth={D} />
      <circle cx={x} cy={y} r="1" fill="none" stroke={P.woodMid} strokeWidth=".5" />
    </g>
  )
}

export function Beerenwald({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'heidelbeerhang': {
      const bushes = Math.min(9, 2 + tier + Math.floor(tier / 2))
      const pines = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier} bold>
          <path d="M4 66Q12 50 40 44Q66 38 76 50Q79 60 76 66z" fill={winter ? P.frost : P.leafMoss} {...line} />
          <path d="M10 60Q20 50 40 47" stroke={winter ? P.white : P.leaf} strokeWidth={D} fill="none" opacity=".7" strokeLinecap="round" />
          {Array.from({ length: pines }, (_, i) => (
            <Old key={i}><Conifer x={[62, 46, 72][i]!} y={[44, 48, 46][i]!} s={0.7} snow={winter} /></Old>
          ))}
          {Array.from({ length: bushes }, (_, i) => {
            const x = 10 + ((i * 17) % 62)
            const y = 64 - ((i * 7) % 12) - (x / 80) * 8
            return <Old key={i}><BerryShrub x={x} y={y} r={4.6} leaf={autumn ? P.autumn : spring ? P.leafPale : P.leaf} berry={summer ? P.blue : undefined} n={7} bare={winter} /></Old>
          })}
          {winter ? Array.from({ length: bushes }, (_, i) => <ellipse key={`s${i}`} cx={10 + ((i * 17) % 62)} cy={64 - ((i * 7) % 12) - (((i * 17) % 62) / 80) * 8 - 1.4} rx="3" ry="1" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {spring ? [14, 30, 44].map((x) => <circle key={x} cx={x} cy={58} r=".9" fill={P.pink} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
          {tier >= 3 ? <path d="M18 66h8l-1 -4h-6z" fill={P.woodLight} {...detail} /> : null}
          {tier >= 3 && summer ? [20, 22.4, 24].map((x) => <circle key={x} cx={x} cy={61.6} r="1" fill={P.plum} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
          {tier >= 4 ? <path d="M28 64l3 -2h3l-1 3h-4z" fill={P.metal} {...detail} /> : null}
          {tier >= 5 ? <Person x={36} y={66} c={P.yellow} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'preiselbeeren': {
      const n = Math.min(14, 2 + tier * 3)
      return (
        <Svg tier={tier} bold>
          <Forest winter={winter} />
          {Array.from({ length: n }, (_, i) => {
            const x = 10 + ((i * 19) % 60)
            const y = 54 + ((i * 7) % 12)
            if (winter) return <ellipse key={i} cx={x} cy={y} rx="2.6" ry="1.2" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />
            return (
              <g key={i}>
                {[-1.4, 0, 1.4].map((d) => (
                  <ellipse key={d} cx={x + d} cy={y - 1 - Math.abs(d) * 0.3} rx="1" ry=".7" fill={P.leafDark} stroke={P.outline} strokeWidth={H * 0.4} />
                ))}
                {autumn || summer ? [-1, 1].map((d) => <circle key={d} cx={x + d} cy={y + 0.4} r=".9" fill={autumn ? P.berry : P.blossom} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
                {spring ? <circle cx={x} cy={y + 0.4} r=".8" fill={P.pink} stroke={P.outline} strokeWidth={H * 0.4} /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <Old><Birch x={66} y={54} s={0.8} season={season} /></Old> : null}
          {tier >= 3 ? <path d="M14 66h8l-1 -4h-6z" fill={P.woodLight} {...detail} /> : null}
          {tier >= 4 ? <Old><Conifer x={16} y={50} s={0.6} snow={winter} /></Old> : null}
          {tier >= 5 ? <Person x={52} y={68} c={P.denim} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'moltebeeren': {
      const n = Math.min(12, 2 + tier * 2)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="10" fill={winter ? P.frost : P.winterLeafLight} {...line} />
          {[
            [26, 58, 6],
            [56, 62, 5],
          ].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx={r} ry={r! * 0.35} fill={winter ? P.glass : P.waterDeep} {...detail} />
          ))}
          {Array.from({ length: n }, (_, i) => {
            const x = 12 + ((i * 23) % 58)
            const y = 54 + ((i * 11) % 12)
            if (winter) return <path key={i} d={`M${x} ${y}v-2`} stroke={P.woodMid} strokeWidth=".8" />
            return (
              <g key={i}>
                <path d={`M${x} ${y}v-4`} stroke={P.leafDark} strokeWidth=".8" />
                <path d={`M${x} ${y - 1}l-2.4 -.8l.6 -1.4l1.8 1.2zM${x} ${y - 1}l2.4 -.8l-.6 -1.4l-1.8 1.2z`} fill={autumn ? P.autumn : P.leaf} stroke={P.outline} strokeWidth={H * 0.6} />
                {spring ? <circle cx={x} cy={y - 4.6} r="1.3" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
                {summer || autumn ? <circle cx={x} cy={y - 4.6} r="1.2" fill={summer ? P.amber : P.honey} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <path d="M4 64h20M8 64v2M16 64v2" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M4 64h20M8 64v2M16 64v2" stroke={P.woodLight} strokeWidth="1.3" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Old><Birch x={70} y={52} s={0.6} season={season} /></Old> : null}
          {tier >= 4 ? <path d="M60 68h8l-1 -3h-6z" fill={P.woodLight} {...detail} /> : null}
          {tier >= 5 ? <Person x={40} y={68} c={P.orange} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'rotehuette':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={32} />
          <RedCabin x={20} y={64} w={34} h={18} winter={winter} lit={winter || tier >= 4} />
          {tier >= 2 ? <rect x="44" y="31" width="3.4" height="9" fill={P.stoneDark} {...detail} /> : null}
          {tier >= 2 ? <Smoke x={45.4} y={30} /> : null}
          {tier >= 3 ? <path d="M8 64V35" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M8 36h7v4.6H8z" fill={P.blue} {...detail} /> : null}
          {tier >= 3 ? <path d="M10.4 36v4.6M8 38.3h7" stroke={P.yellow} strokeWidth="1" /> : null}
          {tier >= 4 ? <Old><Birch x={66} y={62} s={0.9} season={season} /></Old> : null}
          {tier >= 5 ? <path d="M56 64h10M58 64v-3h6v3" stroke={P.outline} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? <path d="M56 64h10M58 64v-3h6v3" stroke={P.white} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {!winter ? [24, 28, 50].map((x) => <circle key={x} cx={x} cy={64} r="1.4" fill={autumn ? P.autumn : spring ? P.white : P.lilac} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
        </Svg>
      )
    case 'saftkueche': {
      const jars = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <path d="M10 64V40L30 30L50 40V64" fill={P.woodMid} {...line} />
          <path d="M6 41L30 28L54 41" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M6 41L30 28L54 41" stroke={P.charcoal} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="16" y="44" width="28" height="20" fill={P.soilDark} {...detail} />
          <path d="M20 64v-6h20v6" fill={P.stone} {...detail} />
          <Old><Fire x={30} y={60} s={0.4} /></Old>
          <path d="M23 56h14l-1.6 -7h-10.8z" fill={P.metal} {...line} />
          <path d="M25 54l-.8 -3" stroke={P.white} strokeWidth={D} opacity=".6" strokeLinecap="round" />
          <ellipse cx="30" cy="49" rx="5.4" ry="1.2" fill={P.plum} {...detail} />
          {tier >= 2 ? <path className="smoke" d="M30 47c-2 -3 2 -5 0 -8" stroke={P.white} strokeWidth="1.2" fill="none" opacity=".7" /> : null}
          <Post x={56} y={64} h={10} w={1.4} k={K} />
          <Post x={74} y={64} h={10} w={1.4} k={K} />
          <rect x="54" y="52" width="22" height="2.2" rx=".5" fill={P.woodDark} {...detail} />
          {Array.from({ length: jars }, (_, i) => (
            <Old key={i}><Jar x={57 + i * 3.4} y={52} c={i % 3 === 1 ? P.berry : i % 3 === 2 ? P.amber : P.plum} s={0.4} /></Old>
          ))}
          {tier >= 3 ? [58, 63, 68].map((x) => <rect key={x} x={x} y="58" width="2.4" height="6" rx=".6" fill={P.berry} {...detail} />) : null}
          {tier >= 5 ? <Person x={8} y={68} c={P.cream} s={0.7} /> : null}
          {winter ? <Snowcap d="M7 41L30 29L53 41" /> : null}
        </Svg>
      )
    }
    case 'pilzlichtung': {
      const n = Math.min(14, 2 + tier * 3)
      return (
        <Svg tier={tier} bold>
          <Forest winter={winter} />
          {[12, 68].map((x, i) => (
            <Old key={x}><Conifer x={x} y={56 - i * 2} s={0.75} snow={winter} /></Old>
          ))}
          {!winter
            ? Array.from({ length: n }, (_, i) => <Chanterelle key={i} x={20 + ((i * 13) % 42)} y={56 + ((i * 7) % 10)} s={autumn || summer ? 1.2 : 0.7} />)
            : Array.from({ length: n }, (_, i) => <ellipse key={i} cx={20 + ((i * 13) % 42)} cy={56 + ((i * 7) % 10)} rx="2" ry=".8" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />)}
          {tier >= 2 ? <path d="M48 66h10l-1 -4h-8z" fill={P.woodLight} {...detail} /> : null}
          {tier >= 3 ? <path d="M49 62q4 -6 8 0" stroke={P.outline} strokeWidth="1.1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 4 ? <Old><Birch x={40} y={52} s={0.6} season={season} /></Old> : null}
          {tier >= 5 ? <Person x={30} y={68} c={P.leafDark} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'holzstapel': {
      const rows = Math.min(5, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Forest winter={winter} cy={62} ry={7} />
          <path d="M14 64h44" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
          <path d="M14 64h44" stroke={P.woodDark} strokeWidth="1.4" strokeLinecap="round" />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 9 - (r > 3 ? 1 : 0) }, (_, k) => <Log key={`${r}-${k}`} x={17 + k * 4.8 + (r % 2) * 2.4} y={61 - r * 4.2} birch={(k + r) % 4 === 0} />),
          )}
          {winter ? <Snowcap d={`M16 ${58 - (rows - 1) * 4.2}h40`} /> : null}
          {tier >= 2 ? <rect x="62" y="60" width="8" height="4" rx=".6" fill={P.bark} {...detail} /> : null}
          {tier >= 3 ? <path d="M66 60l3 -6M68.6 54.6l2.4 -1l.4 1.6z" stroke={P.outline} strokeWidth="1" fill={P.metal} strokeLinejoin="round" /> : null}
          {tier >= 4 ? <Old><Birch x={72} y={58} s={0.7} season={season} /></Old> : null}
          {tier >= 5 ? <Person x={64} y={70} c={P.red} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'seesauna':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="44" rx="38" ry="8" fill={winter ? P.frost : P.leafMoss} {...line} />
          <Old><WaterBand y={60} h={18} frozen={winter} /></Old>
          {winter ? <ellipse cx="56" cy="62" rx="4" ry="1.6" fill={P.waterDeep} {...detail} /> : null}
          <rect x="12" y="34" width="22" height="14" fill={P.bark} {...line} />
          {[37.4, 41, 44.6].map((y) => <path key={y} d={`M13 ${y}h20`} stroke={P.outline} strokeWidth={H} opacity=".5" />)}
          <path d="M9 35L23 26L37 35z" fill={P.charcoal} {...line} />
          <rect x="26" y="38" width="5" height="10" fill={P.woodDark} {...detail} />
          <rect x="15" y="38" width="5" height="4" fill={P.lamp} {...detail} />
          <rect x="16" y="26" width="2.6" height="5" fill={P.metal} {...detail} />
          <Smoke x={17.4} y={24} />
          {[38, 46, 54].map((x) => (
            <Post key={x} x={x} y={59} h={9} w={1.6} k={K} />
          ))}
          <path d="M34 48h24v2.4H34z" fill={P.wood} {...line} />
          {tier >= 3 ? <path d="M56 48v-6M58 48v-6M56 44h2M56 46h2" stroke={P.outline} strokeWidth=".9" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Old><Birch x={66} y={44} s={0.7} season={season} /></Old> : null}
          {tier >= 4 ? <Old><Conifer x={6} y={46} s={0.7} snow={winter} /></Old> : null}
          {tier >= 5 ? <Person x={48} y={48} c={P.white} s={0.7} /> : null}
          {tier >= 2 ? <rect x="11" y="47.4" width="24" height="1.8" rx=".4" fill={P.woodLight} {...detail} /> : null}
          {winter ? <Snowcap d="M10 35L23 27L36 35" /> : null}
        </Svg>
      )
    case 'mittsommer': {
      const dancers = Math.min(6, tier + 1)
      const wreath = winter ? P.winterLeafDark : P.leaf
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="60" rx="36" ry="10" fill={winter ? P.frost : P.leaf} {...line} />
          <path d="M40 64V14M28 26H52" stroke={P.outline} strokeWidth="3.2" strokeLinecap="round" />
          <path d="M40 64V14" stroke={P.woodMid} strokeWidth="1.8" strokeLinecap="round" />
          <path d="M28 26H52" stroke={P.woodMid} strokeWidth="1.4" strokeLinecap="round" />
          {!winter ? <path d="M40 60V14M28 26H52" stroke={wreath} strokeWidth="3" strokeDasharray="1.6 .8" opacity=".9" /> : null}
          {[30, 50].map((x) => (
            <g key={x}>
              <circle cx={x} cy={32} r="4" fill="none" stroke={P.outline} strokeWidth={winter ? 2 : 3.4} />
              <circle cx={x} cy={32} r="4" fill="none" stroke={wreath} strokeWidth={winter ? 1 : 2} />
              {summer || spring ? [0, 1, 2, 3].map((k) => <circle key={k} cx={x + Math.cos(k * 1.6) * 4} cy={32 + Math.sin(k * 1.6) * 4} r="1" fill={[P.yellow, P.white, P.pink, P.blue][k]} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
            </g>
          ))}
          {tier >= 2 ? <path d="M40 14l-1.4 -2.6h2.8z" fill={P.yellow} {...detail} /> : null}
          {Array.from({ length: dancers }, (_, i) => {
            const a = (i / dancers) * Math.PI * 2
            return <Person key={i} x={40 + Math.cos(a) * 16} y={63 + Math.sin(a) * 4} c={[P.blue, P.yellow, P.white, P.berry, P.leafDark, P.lilac][i]!} s={0.7} />
          })}
          {tier >= 3 && !winter ? Array.from({ length: dancers }, (_, i) => <circle key={`k${i}`} cx={40 + Math.cos((i / dancers) * Math.PI * 2) * 16} cy={63 + Math.sin((i / dancers) * Math.PI * 2) * 4 - 9.4} r="1.2" fill="none" stroke={P.leafDark} strokeWidth=".9" />) : null}
          {tier >= 4 ? <path d="M60 58h14v2H60zM62 60v4M72 60v4" fill={P.white} {...detail} /> : null}
          {tier >= 5 ? <Old><Birch x={10} y={54} s={0.7} season={season} /></Old> : null}
          {winter ? <Snowcap d="M28 25.6H52" /> : null}
        </Svg>
      )
    }
    case 'jedermannspfad': {
      const trees = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Forest winter={winter} />
          <path d="M10 68Q30 58 40 60T72 50" stroke={P.outline} strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M10 68Q30 58 40 60T72 50" stroke={winter ? P.white : P.woodLight} strokeWidth="3.4" fill="none" strokeLinecap="round" />
          {Array.from({ length: trees }, (_, i) => {
            const x = [22, 54, 12, 66, 36][i]!
            const y = [56, 48, 60, 58, 50][i]!
            return (
              <g key={i}>
                {i % 2 ? <Old><Conifer x={x} y={y} s={0.75} snow={winter} /></Old> : <Old><Birch x={x} y={y} s={0.8} season={season} /></Old>}
                <rect x={x - 0.9} y={y - 7} width="1.8" height="1.8" fill={P.orange} stroke={P.outline} strokeWidth={H * 0.6} />
              </g>
            )
          })}
          {tier >= 3 ? <Old><WaterBand y={63} h={4} x0={44} x1={66} frozen={winter} /></Old> : null}
          {tier >= 3 ? <path d="M50 60h10v2H50z" fill={P.wood} {...detail} /> : null}
          {tier >= 4 ? <Person x={44} y={62} c={P.red} s={0.7} /> : null}
          {tier >= 5 ? <Person x={30} y={66} c={P.blue} s={0.7} /> : null}
        </Svg>
      )
    }
  }
  return null
}
