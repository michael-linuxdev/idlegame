/**
 * Kapitel 50 — Omas Schrebergarten im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Boden, Radieschenbeet, Brombeeren, Kompost, Kräuterspirale, Hecke, Apfelleiter,
 * Bienenkasten, Hühnerstall, Altfenster-Glashaus, Laube und Bank mit Kontur.
 * Jede Stufe bringt Neues.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import type { AreaProps } from './partsB'
import { Sapling } from './partsC'
import { BerryShrub } from './partsD'
import { Bee, Can, Cloud, LeafLitter, LeafTree, OmaTin, Packet, Snowfall, SnowDrifts, Sun } from './partsH'
import { Hen, Lantern, Table, Tuft } from './partsI'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { ssn } from './season'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Omas Boden je Jahreszeit (wie partsI, aber mit Kontur und Licht): Wiese, Laub, Schnee. */
function Floor({ season, cy = 61, rx = 36, ry = 9 }: { season?: string; cy?: number; rx?: number; ry?: number }) {
  const z = ssn(season)
  const fill = z === 'winter' ? P.cream : z === 'autumn' ? P.leafMoss : P.leaf
  return (
    <g>
      <ellipse cx="40" cy={cy} rx={rx} ry={ry} fill={fill} {...line} />
      <path d={`M${40 - rx * 0.6} ${cy - ry * 0.4}q${rx * 0.3} -${ry * 0.22} ${rx * 0.62} -${ry * 0.08}`} stroke={P.white} strokeWidth={D} opacity=".3" fill="none" strokeLinecap="round" />
      {z === 'autumn' ? <LeafLitter cx={40} cy={cy + 2} w={rx * 1.5} n={8} /> : null}
      {z === 'winter' ? <SnowDrifts cx={40} cy={cy + 2} w={rx * 1.4} /> : null}
    </g>
  )
}

function Sky({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Old><Sun x={70} y={9} r={3} /></Old></g>
  if (z === 'spring') return <g className="art-sky"><Old><Cloud x={14} y={9} s={1.1} /></Old></g>
  if (z === 'autumn') return <g className="art-sky"><Old><Cloud x={64} y={9} s={1.2} c={P.stoneLight} /></Old></g>
  return <g className="art-sky"><Old><Snowfall n={7} y1={32} /></Old></g>
}

/** Brombeerranke von früher (Rand der Parzelle). */
function Bramble({ x, y, season, flip = false }: { x: number; y: number; season?: string; flip?: boolean }) {
  const z = ssn(season)
  const k = flip ? -1 : 1
  return (
    <g>
      <path d={`M${x} ${y}q${3 * k} -7 ${8 * k} -6q${3 * k} 1 ${4 * k} 5`} stroke={P.outline} strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d={`M${x} ${y}q${3 * k} -7 ${8 * k} -6q${3 * k} 1 ${4 * k} 5`} stroke={P.plum} strokeWidth=".9" fill="none" strokeLinecap="round" />
      <ellipse cx={x + 4 * k} cy={y - 5} rx="2.2" ry="1.4" fill={z === 'winter' ? P.woodMid : z === 'autumn' ? P.autumnDark : P.leafDark} {...detail} />
      {z === 'summer' || z === 'autumn' ? <circle cx={x + 7 * k} cy={y - 4} r=".9" fill={P.ink} stroke={P.outline} strokeWidth={H * 0.6} /> : <circle cx={x + 7 * k} cy={y - 4} r=".8" fill={z === 'winter' ? P.white : P.blossom} stroke={P.outline} strokeWidth={H * 0.6} />}
    </g>
  )
}

/** Radieschen: Frühling Keimblätter, Sommer rote Knollen, Herbst Blüte für die Samen, Winter Schneehügel. */
function Radish({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.5} rx="1.6" ry=".7" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} />
  if (z === 'spring') return <path d={`M${x} ${y}v-1.6M${x} ${y - 1.4}l-1.2 -.8M${x} ${y - 1.4}l1.2 -.8`} stroke={P.leafDark} strokeWidth=".8" strokeLinecap="round" />
  if (z === 'autumn')
    return (
      <g>
        <path d={`M${x} ${y}v-6M${x} ${y - 4}l1.4 -1.2`} stroke={P.leafMoss} strokeWidth=".7" strokeLinecap="round" />
        <circle cx={x} cy={y - 6.4} r=".9" fill={P.lilac} stroke={P.outline} strokeWidth={H * 0.5} />
      </g>
    )
  return (
    <g>
      <circle cx={x} cy={y - 0.6} r="1.1" fill={P.red} stroke={P.outline} strokeWidth={H * 0.6} />
      <path d={`M${x} ${y - 1.4}l-1.4 -2M${x} ${y - 1.4}l1.4 -2`} stroke={P.leafDark} strokeWidth=".9" strokeLinecap="round" />
    </g>
  )
}

/** Gemüsebeet, Fußpunkt Mitte; `crooked` = Omas erstes, schiefes Beet. */
function Bed({ x, y, w, season, crooked, edge }: { x: number; y: number; w: number; season?: string; crooked?: boolean; edge?: boolean }) {
  const z = ssn(season)
  const d = crooked
    ? `M${x - w / 2} ${y}q${w * 0.2} -3 ${w * 0.5} -2.4q${w * 0.3} .6 ${w * 0.5} 1.2l-1 2.6q-${w * 0.5} 1 -${w - 1} 0z`
    : `M${x - w / 2} ${y - 2.4}h${w}v3.4h-${w}z`
  return (
    <g>
      <path d={d} fill={z === 'winter' ? P.cream : P.soil} {...detail} strokeLinejoin="round" />
      {edge ? <path d={`M${x - w / 2 - 0.4} ${y + 1.2}h${w + 0.8}`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" /> : null}
      {edge ? <path d={`M${x - w / 2 - 0.4} ${y + 1.2}h${w + 0.8}`} stroke={P.woodMid} strokeWidth="1.2" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Gartenbank (Fußpunkt unten links). */
function Bench({ x, y, w, season, simple }: { x: number; y: number; w: number; season?: string; simple?: boolean }) {
  const z = ssn(season)
  if (simple)
    return (
      <g>
        <rect x={x} y={y - 3} width="3" height="3" rx=".8" fill={P.stone} {...detail} />
        <rect x={x + w - 3} y={y - 3} width="3" height="3" rx=".8" fill={P.stone} {...detail} />
        <rect x={x - 1} y={y - 4.4} width={w + 2} height="1.6" rx=".4" fill={P.woodLight} {...detail} />
      </g>
    )
  return (
    <g>
      <path d={`M${x + 1} ${y}v-4M${x + w - 1} ${y}v-4M${x + 1} ${y - 4}v-5M${x + w - 1} ${y - 4}v-5`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${x + 1} ${y}v-4M${x + w - 1} ${y}v-4M${x + 1} ${y - 4}v-5M${x + w - 1} ${y - 4}v-5`} stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
      <rect x={x} y={y - 4.6} width={w} height="1.4" rx=".4" fill={P.woodLight} {...detail} />
      <rect x={x} y={y - 9} width={w} height="1.2" rx=".4" fill={P.woodLight} {...detail} />
      <rect x={x} y={y - 7.2} width={w} height="1.2" rx=".4" fill={P.woodLight} {...detail} />
      {z === 'winter' ? <path d={`M${x + 0.6} ${y - 4.8}h${w - 1.2}M${x + 0.6} ${y - 9.2}h${w - 1.2}`} stroke={P.white} strokeWidth="1" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Oma mit Strohhut und Rock (als Erinnerung etwas heller). */
function Oma({ x, y, s = 1.1 }: { x: number; y: number; s?: number }) {
  return (
    <g opacity=".9">
      <Farmer x={x} y={y} c={P.lavender} s={s} hat={P.gold} skirt={P.blue} />
    </g>
  )
}

/** Laube (Fußpunkt unten links): Bretterhaus mit Satteldach. */
function Arbour({ x, y, w, h, season, lit, window: win = true }: { x: number; y: number; w: number; h: number; season?: string; lit?: boolean; window?: boolean }) {
  const z = ssn(season)
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.wood} {...line} />
      {Array.from({ length: Math.max(2, Math.round(w / 3)) }, (_, i) => (
        <path key={i} d={`M${x + (i + 1) * (w / (Math.round(w / 3) + 1))} ${y - h}V${y}`} stroke={P.outline} strokeWidth={H} opacity=".35" />
      ))}
      <rect x={x + 0.6} y={y - h} width={w - 1.2} height="1.8" fill={P.outline} opacity=".16" />
      <path d={`M${x - 2} ${y - h}L${x + w / 2} ${y - h - h * 0.55}L${x + w + 2} ${y - h}z`} fill={P.roof} {...line} strokeLinejoin="round" />
      <path d={`M${x + w * 0.06} ${y - h - 1}L${x + w * 0.3} ${y - h - h * 0.3}`} stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
      {z === 'winter' ? <path d={`M${x - 1} ${y - h - 0.4}L${x + w / 2} ${y - h - h * 0.5}L${x + w + 1} ${y - h - 0.4}`} stroke={P.white} strokeWidth="1.4" fill="none" strokeLinecap="round" /> : null}
      <rect x={x + w * 0.62} y={y - h * 0.72} width={w * 0.24} height={h * 0.72} fill={P.leafDark} {...detail} />
      {win ? <rect x={x + w * 0.14} y={y - h * 0.72} width={w * 0.3} height={h * 0.32} fill={lit ? P.lamp : P.window} {...detail} /> : null}
    </g>
  )
}

/** Bienenkasten (liegende Beute auf Füßen, Fußpunkt unten links). */
function BeeBox({ x, y, w = 18, season }: { x: number; y: number; w?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <path d={`M${x + 1.4} ${y}v-4M${x + w - 1.4} ${y}v-4`} stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
      <path d={`M${x + 1.4} ${y}v-4M${x + w - 1.4} ${y}v-4`} stroke={P.woodDark} strokeWidth="1.1" strokeLinecap="round" />
      <rect x={x} y={y - 11} width={w} height="7" rx=".6" fill={P.woodLight} {...detail} />
      <path d={`M${x + 0.6} ${y - 7.5}h${w - 1.2}`} stroke={P.outline} strokeWidth={H} opacity=".45" />
      <rect x={x + 1} y={y - 10.4} width={w * 0.3} height="1.2" fill={P.white} opacity=".3" />
      <rect x={x - 0.8} y={y - 12.4} width={w + 1.6} height="1.6" rx=".4" fill={P.woodDark} {...detail} />
      <path d={`M${x + 2.4} ${y - 4.8}h3`} stroke={P.ink} strokeWidth=".8" />
      {z === 'winter' ? <path d={`M${x} ${y - 12.8}h${w}`} stroke={P.white} strokeWidth="1.4" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Blume (Fußpunkt unten); im Winter ein Stängel. */
function Flower({ x, y, c, season }: { x: number; y: number; c: string; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <path d={`M${x} ${y}v-4`} stroke={z === 'winter' ? P.woodMid : P.leafDark} strokeWidth=".8" strokeLinecap="round" />
      <circle cx={x} cy={y - 4.4} r="1.1" fill={z === 'winter' ? P.white : z === 'autumn' ? P.gold : c} stroke={P.outline} strokeWidth={H * 0.6} />
    </g>
  )
}

/** Apfel am Boden oder im Korb. */
function Apple({ x, y, c = P.red }: { x: number; y: number; c?: string }) {
  return <circle cx={x} cy={y} r="1" fill={c} stroke={P.outline} strokeWidth={H * 0.6} />
}

/** Kaltes Frühbeet / Gewächshaus aus alten Fenstern (Fußpunkt unten links). */
function OldWindows({ x, y, w, h, season, n }: { x: number; y: number; w: number; h: number; season?: string; n: number }) {
  const z = ssn(season)
  const frames = [P.woodLight, P.blue, P.leafDark, P.white, P.terracotta, P.woodMid]
  const pw = w / n
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}>
          <rect x={x + i * pw} y={y - h} width={pw} height={h} fill="none" stroke={P.outline} strokeWidth="2" strokeLinejoin="round" />
          <rect x={x + i * pw} y={y - h} width={pw} height={h} fill={P.glass} fillOpacity=".55" stroke={frames[i % frames.length]} strokeWidth=".9" />
          <path d={`M${x + i * pw} ${y - h / 2}h${pw}`} stroke={frames[i % frames.length]} strokeWidth=".7" />
        </g>
      ))}
      {z === 'winter' ? Array.from({ length: n }, (_, i) => <path key={`f${i}`} d={`M${x + i * pw + 0.6} ${y - h + 1}l${pw * 0.5} ${h * 0.3}`} stroke={P.frost} strokeWidth=".5" />) : null}
    </g>
  )
}

export function Omasgarten({ id, tier, season }: AreaProps): ReactNode {
  const z = ssn(season)
  const winter = z === 'winter'
  switch (id) {
    case 'omasbeet': {
      const radishes = tier * 4
      const bedW = 30 + tier * 4
      const perRow = Math.ceil(radishes / 2)
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {tier <= 2 ? <Bramble x={6} y={62} season={season} /> : null}
          {tier <= 1 ? <Bramble x={74} y={62} season={season} flip /> : null}
          <Bed x={40} y={60} w={bedW} season={season} crooked={tier <= 2} edge={tier >= 2} />
          {Array.from({ length: radishes }, (_, i) => {
            const row = i % 2
            const k = Math.floor(i / 2)
            const step = (bedW - 8) / Math.max(1, perRow - 1)
            return <Radish key={i} x={40 - (bedW - 8) / 2 + k * step + row * step * 0.5} y={60.4 - row * 1.8} season={season} />
          })}
          {tier >= 3 ? <path d="M22 54.6h36" stroke={P.woodDark} strokeWidth=".6" strokeDasharray="1 1" /> : null}
          {tier >= 3 ? <Post x={21.4} y={57} h={3.6} w={1.2} k={K} /> : null}
          {tier >= 3 ? <Old><Can x={66} y={63} c={P.leafDark} /></Old> : null}
          {tier >= 4 ? (
            <g>
              <path d="M24 56V40M30 56V40M36 56V40M24 40l6 2l6 -2" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M24 56V40M30 56V40M36 56V40M24 40l6 2l6 -2" stroke={P.woodMid} strokeWidth=".9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              {!winter ? <path d="M24 55q-1 -6 1 -10q1 -3 -1 -5M30 55q1 -6 -1 -10M36 55q-1 -5 1 -9" stroke={P.leafDark} strokeWidth=".9" fill="none" strokeLinecap="round" /> : null}
              {!winter ? [[23.4, 50], [30.8, 47], [35.6, 51]].map(([lx, ly]) => <ellipse key={lx} cx={lx} cy={ly} rx="1.3" ry=".8" fill={P.leaf} stroke={P.outline} strokeWidth={H * 0.7} />) : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <Old><Packet x={58} y={56} c={P.paper} s={1.4} /></Old>
              <path d="M58 56v4" stroke={P.woodDark} strokeWidth=".8" strokeLinecap="round" />
              <Oma x={14} y={66} />
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omaskompost': {
      const bins = tier >= 5 ? 3 : tier >= 3 ? 2 : tier >= 2 ? 1 : 0
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {bins === 0 ? (
            <g>
              <ellipse cx="40" cy="58" rx="12" ry="6" fill={P.compost} {...line} />
              <path d="M33 55.4q5 -3 11 -1.6" stroke={P.white} strokeWidth={D} opacity=".25" fill="none" strokeLinecap="round" />
              <path d="M32 56l3 -2M44 55l2 -3" stroke={P.outline} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M32 56l3 -2M44 55l2 -3" stroke={P.woodLight} strokeWidth=".8" strokeLinecap="round" />
            </g>
          ) : (
            Array.from({ length: bins }, (_, i) => {
              const bx = 40 - (bins * 15) / 2 + i * 15
              return (
                <g key={i}>
                  <rect x={bx} y="50" width="13" height="10" fill={P.compost} {...detail} />
                  {[52, 55.4, 58.8].map((by) => (
                    <rect key={by} x={bx - 0.4} y={by} width="13.8" height="2.2" rx=".4" fill={P.woodLight} {...detail} />
                  ))}
                  <ellipse cx={bx + 6.5} cy="50" rx="6" ry="2" fill={winter ? P.white : z === 'autumn' ? P.autumn : P.compost} {...detail} />
                </g>
              )
            })
          )}
          {tier >= 4 ? (
            <g>
              <path d="M74 58l3 -2" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
              <path d="M74 58l3 -2" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" />
              <path d="M62 64l4 -6h8l-2 6z" fill={P.metal} {...detail} strokeLinejoin="round" />
              <circle cx="66" cy="64.6" r="1.6" fill={P.charcoal} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M10 62q6 -3 10 -1" stroke={P.leafDark} strokeWidth=".9" fill="none" strokeLinecap="round" />
              <ellipse cx="13" cy="60" rx="3" ry="2" fill={winter ? P.white : P.leaf} {...detail} />
              <ellipse cx="19" cy="62" rx="2.6" ry="2" fill={z === 'autumn' || z === 'summer' ? P.orange : P.leafLight} {...detail} />
              <path d="M19 60.4v3.2" stroke={P.outline} strokeWidth={H} opacity=".5" />
            </g>
          ) : null}
          {tier >= 2 ? <Old><Tuft x={8} y={64} season={season} /></Old> : null}
          {tier >= 3 ? <path d="M58 64l-2 -12M57 52l-2 -1.6M57 52l1.6 -1.6" stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M58 64l-2 -12M57 52l-2 -1.6M57 52l1.6 -1.6" stroke={P.woodDark} strokeWidth=".9" fill="none" strokeLinecap="round" /> : null}
          {z === 'spring' ? <path d="M38 46q1 -2 0 -4M44 46q1 -2 0 -4" stroke={P.white} strokeWidth=".8" opacity=".6" fill="none" strokeLinecap="round" /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omasspirale': {
      const rings = tier + 1
      const herbs = [P.leafDark, P.lavender, P.leaf, P.leafMoss, P.lilac, P.leafLight]
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: rings }, (_, r) => {
            const rx = 24 - r * (16 / rings)
            const cy = 60 - r * 2.6
            const n = 6 + Math.round(rx / 2)
            return (
              <g key={r}>
                {Array.from({ length: n }, (_, k) => {
                  const a = Math.PI + (k / (n - 1)) * Math.PI
                  return <ellipse key={k} cx={40 + Math.cos(a) * rx} cy={cy - Math.sin(a) * rx * 0.28} rx="1.6" ry="1.1" fill={winter && r === rings - 1 ? P.white : P.stone} stroke={P.outline} strokeWidth={H} />
                })}
                {Array.from({ length: 2 }, (_, k) => (
                  <g key={`h${k}`}>
                    <path d={`M${40 - rx * 0.4 + k * rx * 0.8} ${cy - 1}v-${winter ? 2 : 3 + r * 0.4}`} stroke={winter ? P.woodMid : P.leafDark} strokeWidth="1" strokeLinecap="round" />
                    {!winter ? <ellipse cx={40 - rx * 0.4 + k * rx * 0.8} cy={cy - 4 - r * 0.4} rx="1.5" ry="1.1" fill={herbs[(r + k) % herbs.length]} stroke={P.outline} strokeWidth={H * 0.7} /> : null}
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M64 64v-6h4v6z" fill={P.terracotta} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 3 ? <rect x="63.4" y="57.2" width="5.2" height="1.4" rx=".4" fill={P.terracottaLight} {...detail} /> : null}
          {tier >= 4 && !winter ? <circle cx="40" cy="38" r="1.1" fill={z === 'autumn' ? P.gold : P.lilac} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
          {tier >= 4 ? <path d="M14 64v-4M12 60h4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
          {tier >= 4 ? <path d="M14 64v-4M12 60h4" stroke={P.woodMid} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 5 ? <Kid x={70} y={66} c={P.red} s={1.4} skirt={P.blue} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omashecke': {
      const shrubs = tier + 1
      const berry = z === 'summer' ? P.red : z === 'autumn' ? P.ink : undefined
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {tier >= 3 ? (
            <g>
              <path d="M8 46H72M8 52H72" stroke={P.outline} strokeWidth="1.3" strokeLinecap="round" />
              <path d="M8 46H72M8 52H72" stroke={P.metal} strokeWidth=".6" strokeLinecap="round" />
              <Post x={8} y={62} h={20} w={1.8} fill={P.woodMid} k={K} />
              <Post x={72} y={62} h={20} w={1.8} fill={P.woodMid} k={K} />
            </g>
          ) : null}
          {Array.from({ length: shrubs }, (_, i) => {
            const sx = 14 + i * (52 / (shrubs - 1))
            return (
              <g key={i}>
                <Old><BerryShrub x={sx} y={62} r={8} leaf={z === 'autumn' ? P.autumn : P.leaf} berry={berry} n={4} bare={winter} /></Old>
                {z === 'spring' ? [-3, 0, 3].map((d) => <circle key={d} cx={sx + d} cy={56 - Math.abs(d) * 0.3} r=".9" fill={P.white} stroke={P.outline} strokeWidth={H * 0.5} />) : null}
                {winter ? <ellipse cx={sx} cy={61.4} rx="2" ry=".6" fill={P.white} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
              </g>
            )
          })}
          {tier <= 2 ? <Bramble x={58} y={63} season={season} /> : null}
          {tier >= 2 ? <path d="M31 63.6q2 -3.4 4 0" stroke={P.outline} strokeWidth={D} fill="none" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M30 66h6l-1 -2.4h-4z" fill={P.woodLight} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 4 ? (
            <g>
              <ellipse cx="62" cy="42" rx="2" ry="1.3" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
              <circle cx="63.6" cy="40.8" r=".9" fill={P.charcoal} stroke={P.outline} strokeWidth={H} />
              <path d="M64.4 40.8l1 .3" stroke={P.amber} strokeWidth=".7" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M44 66h7l-.8 -3h-5.4z" fill={P.cream} {...detail} strokeLinejoin="round" />
              {[46, 48, 50].map((x) => (
                <circle key={x} cx={x} cy={62.6} r=".9" fill={winter ? P.berry : P.red} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'opasapfel': {
      const apples = tier
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {tier === 1 ? (
            <Old><Sapling x={40} y={62} s={0.8} season={season} stake /></Old>
          ) : (
            <Old><LeafTree x={40} y={62} s={0.5 + tier * 0.16} season={season} crown={P.leaf} fruit={P.red} blossom={P.blossom} n={2 + tier} /></Old>
          )}
          {Array.from({ length: apples }, (_, i) => (
            <Apple key={i} x={28 + i * 5} y={64 - (i % 2)} c={winter ? P.berry : P.red} />
          ))}
          {tier >= 2 ? <Old><Tuft x={14} y={64} season={season} /></Old> : null}
          {tier >= 3 ? <path d="M62 64l4 -22M66 64l4 -22M62.6 60h4M63.4 56h4M64.2 52h4M65 48h4" stroke={P.outline} strokeWidth="2" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d="M62 64l4 -22M66 64l4 -22M62.6 60h4M63.4 56h4M64.2 52h4M65 48h4" stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M14 66h8l-1 -3.6h-6z" fill={P.woodLight} {...detail} strokeLinejoin="round" />
              <path d="M14.8 64.4h6.4" stroke={P.outline} strokeWidth={H} opacity=".5" />
              <Apple x={16} y={62} />
              <Apple x={19} y={62} c={P.yellow} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M30 36v14M36 36v14" stroke={P.outline} strokeWidth="1.3" strokeLinecap="round" />
              <path d="M30 36v14M36 36v14" stroke={P.woodLight} strokeWidth=".6" strokeLinecap="round" />
              <rect x="29" y="50" width="8" height="1.4" rx=".4" fill={P.woodLight} {...detail} />
              <Kid x={33} y={52} c={P.yellow} s={1.2} />
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omasbienen': {
      const boxes = tier >= 3 ? 2 : 1
      const flowers = tier + 1
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {Array.from({ length: boxes }, (_, i) => (
            <BeeBox key={i} x={boxes === 1 ? 31 : 16 + i * 26} y={61} season={season} />
          ))}
          {Array.from({ length: flowers }, (_, i) => (
            <Flower key={i} x={8 + i * 12} y={66} c={[P.blue, P.yellow, P.pink, P.lilac][i % 4]!} season={season} />
          ))}
          {!winter ? [0, 1, 2].map((i) => <Old key={`b${i}`}><Bee x={28 + i * 10} y={44 - (i % 2) * 3} s={1.2} /></Old>) : null}
          {tier >= 2 ? <path d="M10 60v-10M6 50h8" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" /> : null}
          {tier >= 2 ? <path d="M10 60v-10M6 50h8" stroke={P.woodDark} strokeWidth="1" strokeLinecap="round" /> : null}
          {tier >= 4 ? (
            <g>
              <Post x={66} y={62} h={14} w={1.6} k={K} />
              <ellipse cx="66" cy="47.6" rx="4.4" ry="1.2" fill={P.cream} {...detail} />
              <path d="M63.6 47.4q2.4 -4 4.8 0" fill={P.cream} {...detail} />
              <path d="M62 48.2l1 4M70 48.2l-1 4" stroke={P.outline} strokeWidth={H} opacity=".6" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <Old><Table x={44} y={66} w={12} c={P.woodLight} /></Old>
              {[46.4, 50, 53.6].map((x) => (
                <g key={x}>
                  <rect x={x - 1.2} y="57.6" width="2.4" height="3" rx=".4" fill={P.honey} stroke={P.outline} strokeWidth={H} />
                  <path d={`M${x - 0.5} 58.4v1.4`} stroke={P.white} strokeWidth=".4" opacity=".6" strokeLinecap="round" />
                  <rect x={x - 1.2} y="57" width="2.4" height=".8" fill={P.metal} stroke={P.outline} strokeWidth={H * 0.6} />
                </g>
              ))}
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omashuehner': {
      const hens = tier + 1
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <g>
            <rect x="46" y="44" width={tier >= 3 ? 24 : 16} height="16" fill={tier <= 1 ? P.woodMid : P.barn} {...line} />
            <rect x="46.6" y="44" width={tier >= 3 ? 22.8 : 14.8} height="1.8" fill={P.outline} opacity=".16" />
            <path d={`M44 44L${46 + (tier >= 3 ? 12 : 8)} 36L${tier >= 3 ? 72 : 64} 44z`} fill={P.roof} {...line} strokeLinejoin="round" />
            <path d="M47.4 42.8L50.4 40.6" stroke={P.white} strokeWidth={D} opacity=".4" strokeLinecap="round" />
            <rect x="49" y="52" width="4" height="8" fill={P.woodDark} {...detail} />
            <path d="M51 60l-4 4" stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
            <path d="M51 60l-4 4" stroke={P.woodLight} strokeWidth="1" strokeLinecap="round" />
            {winter ? <path d="M45 43.6L54 37M64 43.6L56 37" stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
          </g>
          {Array.from({ length: hens }, (_, i) => (
            <Old key={i}><Hen x={12 + i * 7} y={62 + (i % 2) * 2} s={1.3} flip={i % 2 === 1} c={[P.woodMid, P.white, P.woodLight, P.charcoal, P.woodMid, P.cream][i]} /></Old>
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M8 66V54M40 66V54M8 57H40M8 62H40" stroke={P.outline} strokeWidth="2" strokeLinecap="round" />
              <path d="M8 66V54M40 66V54M8 57H40M8 62H40" stroke={P.woodLight} strokeWidth=".9" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g transform="translate(62 64) scale(1.5)">
              <path d="M-2.6 -2.4q0 -2 2 -2.2l1.8 1q1 1.6 0 2.6h-2.6q-1.2 0 -1.2 -1.4z" fill={P.autumnDark} stroke={P.outline} strokeWidth={H * 0.7} strokeLinejoin="round" />
              <path d="M-2.6 -2.4q-2 -3 -.4 -4.4q.4 2 1.2 3z" fill={P.leafDark} stroke={P.outline} strokeWidth={H * 0.6} strokeLinejoin="round" />
              <circle cx="1.4" cy="-4.2" r=".9" fill={P.autumnDark} stroke={P.outline} strokeWidth={H * 0.6} />
              <path d="M.8 -5.2l.6 -.9l.4 .6l.5 -.6l.2 .9z" fill={P.red} stroke={P.outline} strokeWidth={H * 0.4} strokeLinejoin="round" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M30 66h7l-.8 -2.6h-5.4z" fill={P.woodLight} {...detail} strokeLinejoin="round" />
              {[32, 33.8, 35.4].map((x) => (
                <ellipse key={x} cx={x} cy="62.8" rx=".8" ry="1" fill={P.cream} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
            </g>
          ) : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'altglashaus': {
      const n = tier + 1
      const w = 10 + tier * 9
      const h = tier <= 1 ? 6 : 10 + tier * 2
      const x = 40 - w / 2
      const plants = tier + 1
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {tier >= 2 ? <path d={`M${x - 1} ${62 - h}L40 ${62 - h - 7}L${x + w + 1} ${62 - h}z`} fill={P.glass} fillOpacity=".6" stroke={P.outline} strokeWidth="2" strokeLinejoin="round" /> : null}
          {tier >= 2 ? <path d={`M${x - 1} ${62 - h}L40 ${62 - h - 7}L${x + w + 1} ${62 - h}z`} fill="none" stroke={P.woodLight} strokeWidth=".9" strokeLinejoin="round" /> : null}
          {tier >= 2 ? <path d={`M${x + w * 0.2} ${62 - h - 1.2}L${x + w * 0.38} ${62 - h - 3.4}`} stroke={P.white} strokeWidth={D} opacity=".5" strokeLinecap="round" /> : null}
          {Array.from({ length: plants }, (_, i) => (
            <g key={i}>
              <path d={`M${x + 2 + i * ((w - 4) / Math.max(1, plants - 1))} 62v-${tier <= 1 ? 3 : z === 'spring' ? 4 : 8}`} stroke={winter ? P.woodMid : P.leafDark} strokeWidth="1" strokeLinecap="round" />
              {!winter && z !== 'spring' && tier >= 3 ? <circle cx={x + 2.6 + i * ((w - 4) / Math.max(1, plants - 1))} cy={57} r="1.1" fill={z === 'autumn' ? P.orange : P.tomato} stroke={P.outline} strokeWidth={H * 0.6} /> : null}
            </g>
          ))}
          <OldWindows x={x} y={62} w={w} h={h} season={season} n={n} />
          {tier >= 4 ? <path d={`M${x + w + 2} 62v-6h6v6`} fill={P.woodLight} {...detail} strokeLinejoin="round" /> : null}
          {tier >= 4 ? [0, 1].map((i) => <path key={i} d={`M${x + w + 3 + i * 2.6} 55.6h1.8l-.3 -2h-1.2z`} fill={P.terracotta} stroke={P.outline} strokeWidth={H * 0.7} strokeLinejoin="round" />) : null}
          {tier >= 5 ? <Old><Lantern x={x + 2} y={62 - h - 2} lit={winter || z === 'autumn'} /></Old> : null}
          {tier >= 3 ? <Old><Can x={x - 4} y={64} c={P.metal} /></Old> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omaslaube': {
      const w = 18 + tier * 3
      const h = 12 + tier
      const x = 40 - w / 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          <Arbour x={x} y={62} w={w} h={h} season={season} lit={winter || z === 'autumn'} window={tier >= 2} />
          {tier >= 3 ? (
            <g>
              <rect x={x + 1} y={62 - h * 0.36} width={w * 0.4} height="2" rx=".4" fill={P.woodDark} {...detail} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={x + 2.4 + i * (w * 0.14)} cy={62 - h * 0.38} r="1" fill={winter ? P.white : [P.red, P.pink, P.yellow][i]} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
            </g>
          ) : null}
          {tier >= 3 ? <path d={`M${x - 1} 62q-2 -8 1 -${h}`} stroke={P.outline} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <path d={`M${x - 1} 62q-2 -8 1 -${h}`} stroke={winter ? P.woodMid : P.leafDark} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 && !winter ? [0.35, 0.7].map((t) => <circle key={t} cx={x - 1.8} cy={62 - h * t} r="1" fill={z === 'autumn' ? P.autumn : P.pink} stroke={P.outline} strokeWidth={H * 0.6} />) : null}
          {tier >= 4 ? (
            <g>
              <Old><Table x={x + w + 2} y={64} w={10} c={P.cream} /></Old>
              <rect x={x + w + 4} y="58" width="4" height="1.4" rx=".4" fill={P.leafDark} stroke={P.outline} strokeWidth={H} />
              <Old><OmaTin x={x + w + 9.4} y={59.4} s={0.9} /></Old>
            </g>
          ) : null}
          {tier >= 4 && winter ? <path d={`M${x + w * 0.8} ${62 - h - 6}q-1 -2 0 -4q1 -2 0 -4`} stroke={P.stoneLight} strokeWidth="1" fill="none" strokeLinecap="round" /> : null}
          {tier >= 5 ? (
            <g>
              <path d={`M${x - 2} ${62 - h - 1}q${w / 2 + 2} 4 ${w + 4} 0`} stroke={P.outline} strokeWidth=".6" fill="none" />
              {Array.from({ length: 5 }, (_, i) => (
                <circle key={i} cx={x - 1 + i * ((w + 2) / 4)} cy={62 - h - 1 + Math.sin((i / 4) * Math.PI) * 2.4} r=".9" fill={P.lamp} stroke={P.outline} strokeWidth={H * 0.6} />
              ))}
            </g>
          ) : null}
          {tier >= 2 ? <Old><Tuft x={8} y={64} season={season} /></Old> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omasbank': {
      const people = Math.max(0, tier - 2)
      const w = tier <= 1 ? 18 : 20 + tier * 6
      const x = 40 - w / 2
      return (
        <Svg tier={tier} bold>
          <Floor season={season} />
          {tier >= 3 ? <Old><LeafTree x={68} y={58} s={0.8} season={season} fruit={P.red} blossom={P.blossom} n={3} /></Old> : null}
          <ellipse cx={x + w / 2} cy="62.4" rx={w / 2 + 1.4} ry="1.3" fill={P.outline} opacity=".15" />
          <Bench x={x} y={62} w={w} season={season} simple={tier <= 1} />
          {Array.from({ length: people }, (_, i) => {
            const px = x + 4 + i * ((w - 8) / Math.max(1, people))
            return i === 0 ? <Oma key={i} x={px} y={60} s={1} /> : <Farmer key={i} x={px} y={60} c={[P.denim, P.leafDark, P.berry][i % 3]!} s={1} hat={[P.charcoal, P.woodLight, P.plum][i % 3]} />
          })}
          {tier >= 2 ? <Old><Tuft x={10} y={64} season={season} /></Old> : null}
          {tier >= 2 ? <Old><Tuft x={70} y={65} season={season} /></Old> : null}
          {tier >= 4 ? <Old><OmaTin x={40} y={66} s={1.2} /></Old> : null}
          {tier >= 5 ? <Old><Packet x={46} y={66} c={P.paper} s={1.3} /></Old> : null}
          {tier >= 5 ? <Kid x={x + w + 3} y={66} c={P.orange} s={1.3} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
