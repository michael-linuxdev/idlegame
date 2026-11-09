/**
 * Kapitel-Grafik Kapitel 50: Omas Schrebergarten (Finale, Brief von Oma).
 * Die Bereiche spiegeln Kapitel 1, aber so, wie Oma angefangen hat: Stufe 1
 * zeigt den Garten von damals (krumm, klein, Brombeeren am Rand), jede Stufe
 * wächst ein Stück in den Garten von heute. Jahreszeiten: Frühling = Saat und
 * Blüte, Sommer = Ernte, Herbst = Laub, Radieschen blühen für die Samen,
 * Winter = Schnee, kahle Zweige, Licht in der Laube.
 */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import type { AreaProps } from './partsB'
import { Sapling } from './partsC'
import { BerryShrub } from './partsD'
import { Bee, Can, Cloud, LeafTree, OmaTin, Packet, Snowfall, Sun } from './partsH'
import { Floor, Hen, Lantern, Table, Tuft } from './partsI'
import { P } from '../palette'
import { Farmer, Kid } from './figures'
import { ssn } from './season'

function Sky({ season }: { season?: string }) {
  const z = ssn(season)
  if (z === 'summer') return <g className="art-sky"><Sun x={70} y={9} r={3} /></g>
  if (z === 'spring') return <g className="art-sky"><Cloud x={14} y={9} s={1.1} /></g>
  if (z === 'autumn') return <g className="art-sky"><Cloud x={64} y={9} s={1.2} c={P.stoneLight} /></g>
  return <g className="art-sky"><Snowfall n={7} y1={32} /></g>
}

/** Brombeerranke von früher (Rand der Parzelle). */
function Bramble({ x, y, season, flip = false }: { x: number; y: number; season?: string; flip?: boolean }) {
  const z = ssn(season)
  const k = flip ? -1 : 1
  return (
    <g>
      <path d={`M${x} ${y}q${3 * k} -7 ${8 * k} -6q${3 * k} 1 ${4 * k} 5`} stroke={P.plum} strokeWidth=".7" fill="none" />
      <ellipse cx={x + 4 * k} cy={y - 5} rx="2.2" ry="1.4" fill={z === 'winter' ? P.woodMid : z === 'autumn' ? P.autumnDark : P.leafDark} />
      {z === 'summer' || z === 'autumn' ? <circle cx={x + 7 * k} cy={y - 4} r=".8" fill={P.ink} /> : <circle cx={x + 7 * k} cy={y - 4} r=".7" fill={z === 'winter' ? P.white : P.blossom} />}
    </g>
  )
}

/** Radieschen: Frühling Keimblätter, Sommer rote Knollen, Herbst Blüte für die Samen, Winter Schneehügel. */
function Radish({ x, y, season }: { x: number; y: number; season?: string }) {
  const z = ssn(season)
  if (z === 'winter') return <ellipse cx={x} cy={y - 0.5} rx="1.6" ry=".7" fill={P.white} stroke={P.frost} strokeWidth=".2" />
  if (z === 'spring') return <path d={`M${x} ${y}v-1.6M${x} ${y - 1.4}l-1.2 -.8M${x} ${y - 1.4}l1.2 -.8`} stroke={P.leafLight} strokeWidth=".6" />
  if (z === 'autumn')
    return (
      <g>
        <path d={`M${x} ${y}v-6M${x} ${y - 4}l1.4 -1.2`} stroke={P.leafMoss} strokeWidth=".5" />
        <circle cx={x} cy={y - 6.4} r=".8" fill={P.lilac} />
      </g>
    )
  return (
    <g>
      <circle cx={x} cy={y - 0.6} r="1" fill={P.red} stroke={P.outline} strokeWidth=".15" />
      <path d={`M${x} ${y - 1.4}l-1.4 -2M${x} ${y - 1.4}l1.4 -2`} stroke={P.leaf} strokeWidth=".7" />
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
      <path d={d} fill={z === 'winter' ? P.cream : P.soil} stroke={P.soilDark} strokeWidth=".4" />
      {edge ? <path d={`M${x - w / 2 - 0.4} ${y + 1.2}h${w + 0.8}`} stroke={P.woodMid} strokeWidth="1" /> : null}
    </g>
  )
}

/** Gartenbank (Fußpunkt unten links). */
function Bench({ x, y, w, season, simple }: { x: number; y: number; w: number; season?: string; simple?: boolean }) {
  const z = ssn(season)
  if (simple)
    return (
      <g>
        <rect x={x} y={y - 3} width="3" height="3" rx=".8" fill={P.stone} />
        <rect x={x + w - 3} y={y - 3} width="3" height="3" rx=".8" fill={P.stone} />
        <rect x={x - 1} y={y - 4.4} width={w + 2} height="1.6" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".25" />
      </g>
    )
  return (
    <g>
      <path d={`M${x + 1} ${y}v-4M${x + w - 1} ${y}v-4M${x + 1} ${y - 4}v-5M${x + w - 1} ${y - 4}v-5`} stroke={P.woodDark} strokeWidth=".8" />
      <rect x={x} y={y - 4.6} width={w} height="1.4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".25" />
      <rect x={x} y={y - 9} width={w} height="1.2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".25" />
      <rect x={x} y={y - 7.2} width={w} height="1.2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".25" />
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
      <rect x={x} y={y - h} width={w} height={h} fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
      {Array.from({ length: Math.max(2, Math.round(w / 3)) }, (_, i) => (
        <path key={i} d={`M${x + (i + 1) * (w / (Math.round(w / 3) + 1))} ${y - h}V${y}`} stroke={P.woodMid} strokeWidth=".3" />
      ))}
      <path d={`M${x - 2} ${y - h}L${x + w / 2} ${y - h - h * 0.55}L${x + w + 2} ${y - h}z`} fill={P.roof} stroke={P.outlineWood} strokeWidth=".4" />
      {z === 'winter' ? <path d={`M${x - 1} ${y - h - 0.4}L${x + w / 2} ${y - h - h * 0.5}L${x + w + 1} ${y - h - 0.4}`} stroke={P.white} strokeWidth="1.4" fill="none" strokeLinecap="round" /> : null}
      <rect x={x + w * 0.62} y={y - h * 0.72} width={w * 0.24} height={h * 0.72} fill={P.leafDark} stroke={P.outlineWood} strokeWidth=".3" />
      {win ? <rect x={x + w * 0.14} y={y - h * 0.72} width={w * 0.3} height={h * 0.32} fill={lit ? P.lamp : P.window} stroke={P.woodDark} strokeWidth=".4" /> : null}
    </g>
  )
}

/** Bienenkasten (liegende Beute auf Füßen, Fußpunkt unten links). */
function BeeBox({ x, y, w = 18, season }: { x: number; y: number; w?: number; season?: string }) {
  const z = ssn(season)
  return (
    <g>
      <path d={`M${x + 1.4} ${y}v-4M${x + w - 1.4} ${y}v-4`} stroke={P.woodDark} strokeWidth=".9" />
      <rect x={x} y={y - 11} width={w} height="7" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
      <path d={`M${x} ${y - 7.5}h${w}`} stroke={P.wood} strokeWidth=".4" />
      <rect x={x - 0.8} y={y - 12.4} width={w + 1.6} height="1.6" fill={P.woodDark} />
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
      <path d={`M${x} ${y}v-4`} stroke={z === 'winter' ? P.woodLight : P.leaf} strokeWidth=".5" />
      <circle cx={x} cy={y - 4.4} r="1" fill={z === 'winter' ? P.white : z === 'autumn' ? P.gold : c} />
    </g>
  )
}

/** Apfel am Boden oder im Korb. */
function Apple({ x, y, c = P.red }: { x: number; y: number; c?: string }) {
  return <circle cx={x} cy={y} r=".9" fill={c} stroke={P.outline} strokeWidth=".15" />
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
          <rect x={x + i * pw} y={y - h} width={pw} height={h} fill={P.glass} opacity=".55" stroke={frames[i % frames.length]} strokeWidth=".7" />
          <path d={`M${x + i * pw} ${y - h / 2}h${pw}`} stroke={frames[i % frames.length]} strokeWidth=".4" />
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
        <Svg tier={tier}>
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
          {tier >= 3 ? <path d="M22 54.6h36" stroke={P.woodLight} strokeWidth=".4" strokeDasharray="1 1" /> : null}
          {tier >= 3 ? <Can x={66} y={63} c={P.leafDark} /> : null}
          {tier >= 4 ? (
            <g>
              {[24, 30, 36].map((x) => (
                <path key={x} d={`M${x} 56V40`} stroke={P.woodMid} strokeWidth=".6" />
              ))}
              <path d="M24 40l6 2l6 -2" stroke={P.woodMid} strokeWidth=".5" fill="none" />
              {!winter ? <path d="M24 55q-1 -6 1 -10q1 -3 -1 -5M30 55q1 -6 -1 -10M36 55q-1 -5 1 -9" stroke={P.leafDark} strokeWidth=".5" fill="none" /> : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <Packet x={58} y={56} c={P.paper} s={1.4} />
              <path d="M58 56v4" stroke={P.woodDark} strokeWidth=".4" />
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
        <Svg tier={tier}>
          <Floor season={season} />
          {bins === 0 ? (
            <g>
              <ellipse cx="40" cy="58" rx="12" ry="6" fill={P.compost} stroke={P.soilDark} strokeWidth=".4" />
              <path d="M32 56l3 -2M44 55l2 -3" stroke={P.woodLight} strokeWidth=".6" />
            </g>
          ) : (
            Array.from({ length: bins }, (_, i) => {
              const bx = 40 - (bins * 15) / 2 + i * 15
              return (
                <g key={i}>
                  <rect x={bx} y="50" width="13" height="10" fill={P.compost} />
                  {[52, 55.4, 58.8].map((by) => (
                    <rect key={by} x={bx - 0.4} y={by} width="13.8" height="2.2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".25" />
                  ))}
                  <ellipse cx={bx + 6.5} cy="50" rx="6" ry="2" fill={winter ? P.white : z === 'autumn' ? P.autumn : P.compost} />
                </g>
              )
            })
          )}
          {tier >= 4 ? (
            <g>
              <path d="M62 64l4 -6h8l-2 6z" fill={P.metal} stroke={P.charcoal} strokeWidth=".35" />
              <circle cx="66" cy="64.6" r="1.6" fill={P.charcoal} />
              <path d="M74 58l3 -2" stroke={P.woodDark} strokeWidth=".7" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M10 62q6 -3 10 -1" stroke={P.leafDark} strokeWidth=".6" fill="none" />
              <ellipse cx="13" cy="60" rx="3" ry="2" fill={winter ? P.white : P.leaf} />
              <ellipse cx="19" cy="62" rx="2.6" ry="2" fill={z === 'autumn' || z === 'summer' ? P.orange : P.leafLight} stroke={P.outline} strokeWidth=".2" />
            </g>
          ) : null}
          {tier >= 2 ? <Tuft x={8} y={64} season={season} /> : null}
          {tier >= 3 ? <path d="M58 64l-2 -12M57 52l-2 -1.6M57 52l1.6 -1.6" stroke={P.woodDark} strokeWidth=".7" fill="none" /> : null}
          {z === 'spring' ? <path d="M38 46q1 -2 0 -4M44 46q1 -2 0 -4" stroke={P.white} strokeWidth=".6" opacity=".7" fill="none" /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omasspirale': {
      const rings = tier + 1
      const herbs = [P.leafDark, P.lavender, P.leaf, P.leafMoss, P.lilac, P.leafLight]
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: rings }, (_, r) => {
            const rx = 24 - r * (16 / rings)
            const cy = 60 - r * 2.6
            const n = 6 + Math.round(rx / 2)
            return (
              <g key={r}>
                {Array.from({ length: n }, (_, k) => {
                  const a = Math.PI + (k / (n - 1)) * Math.PI
                  return <ellipse key={k} cx={40 + Math.cos(a) * rx} cy={cy - Math.sin(a) * rx * 0.28} rx="1.6" ry="1.1" fill={winter && r === rings - 1 ? P.white : P.stone} stroke={P.outlineStone} strokeWidth=".2" />
                })}
                {Array.from({ length: 2 }, (_, k) => (
                  <g key={`h${k}`}>
                    <path d={`M${40 - rx * 0.4 + k * rx * 0.8} ${cy - 1}v-${winter ? 2 : 3 + r * 0.4}`} stroke={winter ? P.woodLight : herbs[r % herbs.length]} strokeWidth=".8" />
                    {!winter ? <ellipse cx={40 - rx * 0.4 + k * rx * 0.8} cy={cy - 4 - r * 0.4} rx="1.4" ry="1" fill={herbs[(r + k) % herbs.length]} /> : null}
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M64 64v-6h4v6z" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 && !winter ? <circle cx="40" cy="38" r="1" fill={z === 'autumn' ? P.gold : P.lilac} /> : null}
          {tier >= 4 ? <path d="M14 64v-4M12 60h4" stroke={P.woodDark} strokeWidth=".6" /> : null}
          {tier >= 5 ? <Kid x={70} y={66} c={P.red} s={1.4} skirt={P.blue} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omashecke': {
      const shrubs = tier + 1
      const berry = z === 'summer' ? P.red : z === 'autumn' ? P.ink : undefined
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {tier >= 3 ? (
            <g>
              <path d="M8 62V42M72 62V42" stroke={P.woodMid} strokeWidth=".8" />
              <path d="M8 46H72M8 52H72" stroke={P.metal} strokeWidth=".3" />
            </g>
          ) : null}
          {Array.from({ length: shrubs }, (_, i) => {
            const sx = 14 + i * (52 / (shrubs - 1))
            return (
              <g key={i}>
                <BerryShrub x={sx} y={62} r={8} leaf={z === 'autumn' ? P.autumn : P.leaf} berry={berry} n={4} bare={winter} />
                {z === 'spring' ? [-3, 0, 3].map((d) => <circle key={d} cx={sx + d} cy={56 - Math.abs(d) * 0.3} r=".8" fill={P.white} />) : null}
                {winter ? <ellipse cx={sx} cy={61.4} rx="2" ry=".6" fill={P.white} /> : null}
              </g>
            )
          })}
          {tier <= 2 ? <Bramble x={58} y={63} season={season} /> : null}
          {tier >= 2 ? <path d="M30 66h6l-1 -2.4h-4z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 ? (
            <g>
              <ellipse cx="62" cy="42" rx="2" ry="1.3" fill={P.charcoal} />
              <circle cx="63.6" cy="40.8" r=".9" fill={P.charcoal} />
              <path d="M64.4 40.8l1 .3" stroke={P.amber} strokeWidth=".4" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M44 66h7l-.8 -3h-5.4z" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".3" />
              {[46, 48, 50].map((x) => (
                <circle key={x} cx={x} cy={62.6} r=".8" fill={winter ? P.berry : P.red} />
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
        <Svg tier={tier}>
          <Floor season={season} />
          {tier === 1 ? (
            <Sapling x={40} y={62} s={0.8} season={season} stake />
          ) : (
            <LeafTree x={40} y={62} s={0.5 + tier * 0.16} season={season} crown={P.leaf} fruit={P.red} blossom={P.blossom} n={2 + tier} />
          )}
          {Array.from({ length: apples }, (_, i) => (
            <Apple key={i} x={28 + i * 5} y={64 - (i % 2)} c={winter ? P.berry : P.red} />
          ))}
          {tier >= 2 ? <Tuft x={14} y={64} season={season} /> : null}
          {tier >= 3 ? <path d="M62 64l4 -22M66 64l4 -22M62.6 60h4M63.4 56h4M64.2 52h4M65 48h4" stroke={P.woodLight} strokeWidth=".6" /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M14 66h8l-1 -3.6h-6z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
              <Apple x={16} y={62} />
              <Apple x={19} y={62} c={P.yellow} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M30 36v14M36 36v14" stroke={P.woodDark} strokeWidth=".3" />
              <rect x="29" y="50" width="8" height="1.2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".2" />
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
        <Svg tier={tier}>
          <Floor season={season} />
          {Array.from({ length: boxes }, (_, i) => (
            <BeeBox key={i} x={boxes === 1 ? 31 : 16 + i * 26} y={61} season={season} />
          ))}
          {Array.from({ length: flowers }, (_, i) => (
            <Flower key={i} x={8 + i * 12} y={66} c={[P.blue, P.yellow, P.pink, P.lilac][i % 4]!} season={season} />
          ))}
          {!winter ? [0, 1, 2].map((i) => <Bee key={`b${i}`} x={28 + i * 10} y={44 - (i % 2) * 3} s={1.2} />) : null}
          {tier >= 2 ? <path d="M10 60v-10M6 50h8" stroke={P.woodDark} strokeWidth=".6" /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M66 62v-14" stroke={P.woodDark} strokeWidth=".8" />
              <ellipse cx="66" cy="47.6" rx="4.4" ry="1.2" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".3" />
              <path d="M63.6 47.4q2.4 -4 4.8 0" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".3" />
              <path d="M62 48.2l1 4M70 48.2l-1 4" stroke={P.charcoal} strokeWidth=".2" opacity=".6" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <Table x={44} y={66} w={12} c={P.woodLight} />
              {[46.4, 50, 53.6].map((x) => (
                <g key={x}>
                  <rect x={x - 1.2} y="57.6" width="2.4" height="3" rx=".4" fill={P.honey} stroke={P.outline} strokeWidth=".2" />
                  <rect x={x - 1.2} y="57" width="2.4" height=".8" fill={P.metal} />
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
        <Svg tier={tier}>
          <Floor season={season} />
          <g>
            <rect x="46" y="44" width={tier >= 3 ? 24 : 16} height="16" fill={tier <= 1 ? P.woodMid : P.barn} stroke={P.outlineWood} strokeWidth=".4" />
            <path d={`M44 44L${46 + (tier >= 3 ? 12 : 8)} 36L${tier >= 3 ? 72 : 64} 44z`} fill={P.roof} stroke={P.outlineWood} strokeWidth=".4" />
            <rect x="49" y="52" width="4" height="8" fill={P.woodDark} />
            <path d="M51 60l-4 4" stroke={P.woodLight} strokeWidth=".8" />
            {winter ? <path d="M45 43.6L54 37M64 43.6L56 37" stroke={P.white} strokeWidth="1.2" strokeLinecap="round" /> : null}
          </g>
          {Array.from({ length: hens }, (_, i) => (
            <Hen key={i} x={12 + i * 7} y={62 + (i % 2) * 2} s={1.3} flip={i % 2 === 1} c={[P.woodMid, P.white, P.woodLight, P.charcoal, P.woodMid, P.cream][i]} />
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M8 66V54M40 66V54M8 57H40M8 62H40" stroke={P.woodLight} strokeWidth=".4" />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g transform="translate(62 64) scale(1.5)">
              <path d="M-2.6 -2.4q0 -2 2 -2.2l1.8 1q1 1.6 0 2.6h-2.6q-1.2 0 -1.2 -1.4z" fill={P.autumnDark} stroke={P.outlineWood} strokeWidth=".2" />
              <path d="M-2.6 -2.4q-2 -3 -.4 -4.4q.4 2 1.2 3z" fill={P.leafDark} />
              <circle cx="1.4" cy="-4.2" r=".9" fill={P.autumnDark} />
              <path d="M.8 -5.2l.6 -.9l.4 .6l.5 -.6l.2 .9z" fill={P.red} />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M30 66h7l-.8 -2.6h-5.4z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />
              {[32, 33.8, 35.4].map((x) => (
                <ellipse key={x} cx={x} cy="62.8" rx=".8" ry="1" fill={P.cream} stroke={P.outlineSoft} strokeWidth=".15" />
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
        <Svg tier={tier}>
          <Floor season={season} />
          {tier >= 2 ? <path d={`M${x - 1} ${62 - h}L40 ${62 - h - 7}L${x + w + 1} ${62 - h}z`} fill={P.glass} opacity=".6" stroke={P.woodLight} strokeWidth=".6" /> : null}
          {Array.from({ length: plants }, (_, i) => (
            <g key={i}>
              <path d={`M${x + 2 + i * ((w - 4) / Math.max(1, plants - 1))} 62v-${tier <= 1 ? 3 : z === 'spring' ? 4 : 8}`} stroke={winter ? P.woodLight : P.leafDark} strokeWidth=".7" />
              {!winter && z !== 'spring' && tier >= 3 ? <circle cx={x + 2.6 + i * ((w - 4) / Math.max(1, plants - 1))} cy={57} r="1" fill={z === 'autumn' ? P.orange : P.tomato} /> : null}
            </g>
          ))}
          <OldWindows x={x} y={62} w={w} h={h} season={season} n={n} />
          {tier >= 4 ? <path d={`M${x + w + 2} 62v-6h6v6`} fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 4 ? [0, 1].map((i) => <path key={i} d={`M${x + w + 3 + i * 2.6} 55.6h1.8l-.3 -2h-1.2z`} fill={P.terracotta} />) : null}
          {tier >= 5 ? <Lantern x={x + 2} y={62 - h - 2} lit={winter || z === 'autumn'} /> : null}
          {tier >= 3 ? <Can x={x - 4} y={64} c={P.metal} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omaslaube': {
      const w = 18 + tier * 3
      const h = 12 + tier
      const x = 40 - w / 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          <Arbour x={x} y={62} w={w} h={h} season={season} lit={winter || z === 'autumn'} window={tier >= 2} />
          {tier >= 3 ? (
            <g>
              <rect x={x + 1} y={62 - h * 0.36} width={w * 0.4} height="2" fill={P.woodDark} />
              {[0, 1, 2].map((i) => (
                <circle key={i} cx={x + 2.4 + i * (w * 0.14)} cy={62 - h * 0.38} r=".9" fill={winter ? P.white : [P.red, P.pink, P.yellow][i]} />
              ))}
            </g>
          ) : null}
          {tier >= 3 ? <path d={`M${x - 1} 62q-2 -8 1 -${h}`} stroke={winter ? P.woodMid : P.leafDark} strokeWidth=".8" fill="none" /> : null}
          {tier >= 4 ? (
            <g>
              <Table x={x + w + 2} y={64} w={10} c={P.cream} />
              <rect x={x + w + 4} y="58" width="4" height="1.4" fill={P.leafDark} stroke={P.outline} strokeWidth=".2" />
              <OmaTin x={x + w + 9.4} y={59.4} s={0.9} />
            </g>
          ) : null}
          {tier >= 4 && winter ? <path d={`M${x + w * 0.8} ${62 - h - 6}q-1 -2 0 -4q1 -2 0 -4`} stroke={P.stoneLight} strokeWidth=".8" fill="none" /> : null}
          {tier >= 5 ? (
            <g>
              <path d={`M${x - 2} ${62 - h - 1}q${w / 2 + 2} 4 ${w + 4} 0`} stroke={P.woodDark} strokeWidth=".3" fill="none" />
              {Array.from({ length: 5 }, (_, i) => (
                <circle key={i} cx={x - 1 + i * ((w + 2) / 4)} cy={62 - h - 1 + Math.sin((i / 4) * Math.PI) * 2.4} r=".8" fill={P.lamp} />
              ))}
            </g>
          ) : null}
          {tier >= 2 ? <Tuft x={8} y={64} season={season} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
    case 'omasbank': {
      const people = Math.max(0, tier - 2)
      const w = tier <= 1 ? 18 : 20 + tier * 6
      const x = 40 - w / 2
      return (
        <Svg tier={tier}>
          <Floor season={season} />
          {tier >= 3 ? <LeafTree x={68} y={58} s={0.8} season={season} fruit={P.red} blossom={P.blossom} n={3} /> : null}
          <Bench x={x} y={62} w={w} season={season} simple={tier <= 1} />
          {Array.from({ length: people }, (_, i) => {
            const px = x + 4 + i * ((w - 8) / Math.max(1, people))
            return i === 0 ? <Oma key={i} x={px} y={60} s={1} /> : <Farmer key={i} x={px} y={60} c={[P.denim, P.leafDark, P.berry][i % 3]!} s={1} hat={[P.charcoal, P.woodLight, P.plum][i % 3]} />
          })}
          {tier >= 2 ? <Tuft x={10} y={64} season={season} /> : null}
          {tier >= 2 ? <Tuft x={70} y={65} season={season} /> : null}
          {tier >= 4 ? <OmaTin x={40} y={66} s={1.2} /> : null}
          {tier >= 5 ? <Packet x={46} y={66} c={P.paper} s={1.3} /> : null}
          {tier >= 5 ? <Kid x={x + w + 3} y={66} c={P.orange} s={1.3} /> : null}
          <Sky season={season} />
        </Svg>
      )
    }
  }
  return null
}
