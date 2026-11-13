/**
 * Kapitel 3 — Weinberg: art for the ten areas (five growth tiers) and the
 * terraced backdrop with the river.
 */
import { memo, type ReactNode } from 'react'
import { useSvgId } from './svgId'
import { moduleTier, sameTierProps } from './tiers'
import type { Season } from './ambient'
import { ArtSvg } from './ArtSvg'
import { P } from './art/palette'
import { Barrel, Crate, Lantern, Pennant, Shadow } from './art/parts'
import { ArchDoor, GableRoof, Pane, Wall } from './art/parts/bold'
import { BOLD, boldDetail, boldLine } from './art/parts/style'

const GRAPE: Record<string, string> = {
  riesling: '#c9d36a',
  silvaner: '#a9c46a',
  spaetburgunder: '#5b2a4a',
  dornfelder: '#3a1838',
}

/** Kräftiger Stil im Kapitel-Raster (80×72): Strichstärken × K. */
const K = 0.85
const C = BOLD.contour * K
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

/** Jede Stufe ist sichtbar mehr Bauwerk: Gebäude wachsen von 74 % auf volle Größe (Fußpunkt bleibt). */
const GROW = [0.74, 0.83, 0.9, 0.96, 1]
function Grow({ tier, children }: { tier: number; children: ReactNode }) {
  const s = GROW[Math.min(5, Math.max(1, tier)) - 1]!
  return s === 1 ? <>{children}</> : <g transform={`translate(40 66) scale(${s}) translate(-40 -66)`}>{children}</g>
}

/** Traube: eine geschlossene Form mit Kontur und Glanzpunkt. Fußpunkt = Stielansatz. */
function Bunch({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-3.2 0.6a1.9 1.9 0 0 1 3.2-1.2a1.9 1.9 0 0 1 3.2 1.2q.5 2.6-1.5 3.9q-.4 2.1-1.7 2.9q-1.3-.8-1.7-2.9q-2-1.3-1.5-3.9z" fill={c} stroke={P.outline} strokeWidth={H * 1.4} strokeLinejoin="round" />
      <circle cx="-1.3" cy="1" r=".7" fill={P.white} opacity=".45" />
    </g>
  )
}

/** Rebzeile: Pfähle, Draht und ein Laubband mit Kontur; vorn hängen die Trauben. */
function VineRow({ x0, x1, y, leaf, grape, bunches, snow }: { x0: number; x1: number; y: number; leaf: string; grape: string; bunches: number; snow: boolean }) {
  const n = 5
  const bw = (x1 - x0 + 4) / n
  const top = Array.from({ length: n }, () => `q${bw / 2} -8.5 ${bw} 0`).join(' ')
  return (
    <g>
      {[x0, (x0 + x1) / 2, x1].map((x) => (
        <rect key={x} x={x - 1.3} y={y - 11} width="2.6" height="15" rx=".7" fill={P.woodMid} stroke={P.outline} strokeWidth={D} />
      ))}
      <path d={`M${x0} ${y - 9}H${x1}`} stroke={P.outline} strokeWidth={H} />
      <path d={`M${x0 - 2} ${y - 3.5} ${top} q1.5 4 -2 4.6 H${x0} q-3.5 -.6 -2 -4.6z`} fill={leaf} {...line} />
      <path d={Array.from({ length: n }, (_, i) => `M${x0 + i * bw} ${y - 5.2} q${bw * 0.22} -3.2 ${bw * 0.5} -3.4`).join(' ')} fill="none" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".32" />
      {snow ? <path d={`M${x0} ${y - 7.2} H${x1}`} stroke={P.white} strokeWidth="2.2" strokeLinecap="round" opacity=".9" /> : null}
      {Array.from({ length: bunches }, (_, i) => (
        <Bunch key={i} x={x0 + 7 + i * ((x1 - x0 - 14) / Math.max(1, bunches - 1 || 1))} y={y - 2.2} c={grape} />
      ))}
    </g>
  )
}

function Vines({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const rows = Math.min(4, 1 + Math.floor(tier / 1.5))
  const grape = GRAPE[id] ?? '#5b2a4a'
  const leaf = season === 'autumn' ? '#d29a2c' : season === 'winter' ? '#8a7a5a' : P.leaf
  const bunches = season === 'winter' || season === 'spring' ? 0 : Math.min(4, tier)
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={32} />
      {/* hinten zuerst, damit die vordere Zeile die hintere überdeckt */}
      {Array.from({ length: rows }, (_, i) => rows - 1 - i).map((r) => (
        <VineRow key={r} x0={9 + r * 4} x1={71 - r * 4} y={61 - r * 11.5} leaf={leaf} grape={grape} bunches={bunches} snow={season === 'winter'} />
      ))}
      {tier >= 4 ? (
        <g>
          {/* Rosenstock am Zeilenende (zeigt Mehltau früh an) */}
          <ellipse cx="74" cy="60.5" rx="4.6" ry="5.4" fill={P.leafDark} {...detail} />
          {season === 'winter' ? null : [[72.6, 58.4], [75.6, 60.6], [73.4, 63]].map(([x, y]) => <circle key={y} cx={x} cy={y} r="1.5" fill={P.red} stroke={P.outline} strokeWidth={H} />)}
        </g>
      ) : null}
      {tier >= 4 && bunches > 0 ? <Crate x={13} y={67} s={0.6} fruit={grape} /> : null}
      {tier >= 5 ? <Pennant x={69} y={24} s={0.9} /> : null}
    </ArtSvg>
  )
}

function Trockenmauer({ tier }: { tier: number }) {
  const layers = Math.min(4, 1 + Math.floor(tier / 1.3))
  const top = 59 - layers * 7.6
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Shadow grid="chapter" rx={33} />
      {Array.from({ length: layers }, (_, r) =>
        Array.from({ length: 6 }, (_, i) => (
          <rect
            key={`${r}-${i}`}
            x={7 + i * 11 + (r % 2) * 5 - (r % 2 && i === 5 ? 5 : 0)}
            y={58.4 - r * 7.6}
            width={r % 2 && i === 5 ? 6 : 11}
            height="7.6"
            rx="2.2"
            fill={['#b8ab94', P.stone, '#c4b8a0'][(i + r) % 3]}
            stroke={P.outline}
            strokeWidth={D}
          />
        )),
      )}
      {/* Schattenseite rechts */}
      <rect x="57" y={top + 8.2} width="15" height={layers * 7.6 - 1.6} fill={P.outline} opacity=".12" />
      {tier >= 2 ? (
        <g className="lizard">
          <path d="M42 46c4-1.4 9-.4 13 2l4.4-1-3 2.4c2.2 1 2.2 2.4 0 2.4-5.4-1.2-10-2.4-14.4-2.4z" fill="#6aa04a" stroke={P.outline} strokeWidth={H * 1.3} strokeLinejoin="round" />
          <circle cx="57.6" cy="47.6" r=".7" fill="#1f2a14" />
        </g>
      ) : null}
      {tier >= 4
        ? [13, 23, 66].map((x) => <circle key={x} cx={x} cy={top + 7} r="2.4" fill={P.lilac} stroke={P.outline} strokeWidth={H * 1.3} />)
        : null}
      {tier >= 5 ? (
        <g>
          {/* Rebe rankt über die Mauer */}
          <path d="M30 65q4-15 12-23q6-4 10-2" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M30 65q4-15 12-23q6-4 10-2" stroke={P.bark} strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <Bunch x={45} y={39} c={P.plum} />
          <Pennant x={70} y={top + 8} s={0.9} />
        </g>
      ) : null}
    </ArtSvg>
  )
}

/** Winzerhäuschen: schmaler Steinbau mit steilem Dach mitten im Wingert. */
function Wingerthaus({ tier }: { tier: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Grow tier={tier}>
      <Shadow grid="chapter" rx={26} />
      {tier >= 4 ? <Barrel x={19} y={66} s={1.05} /> : null}
      <Wall x={26} y={39} w={28} h={27} fill={P.paper} k={K} />
      <rect x="26.9" y="59.6" width="26.2" height="5.6" fill={P.stone} opacity=".85" />
      <path d="M34 59.6v5.6M43 59.6v5.6" stroke={P.outline} strokeWidth={H} opacity=".5" />
      <GableRoof x={26} y={40} w={28} h={20} fill={P.autumnDark} over={4.5} k={K} />
      <ArchDoor x={30} y={66} w={10} h={15} k={K} />
      {tier >= 2 ? <Pane x={43} y={46} w={7.5} h={8} k={K} /> : null}
      {tier >= 3 ? (
        <g>
          {/* Hausrebe an der Wand und ein Busch daneben */}
          <path d="M55 66q2-12-1-22" stroke={P.bark} strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M51 47q4-5 8-1q3 3 0 6q3 4-1 6q-5 2-7-3q-3-4 1-8z" fill={P.leaf} {...detail} />
          <ellipse cx="65" cy="60" rx="7" ry="6" fill={P.leaf} {...line} />
          <path d="M60.6 58.4q1.6-3.4 5-3.6" fill="none" stroke={P.white} strokeWidth={D} strokeLinecap="round" opacity=".35" />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          {/* Schornstein mit Rauch */}
          <rect x="45.5" y="24" width="4.6" height="9" fill={P.stone} {...detail} />
          <circle cx="48.5" cy="19" r="2.4" fill={P.white} opacity=".7" />
          <circle cx="51" cy="14" r="3" fill={P.white} opacity=".45" />
        </g>
      ) : null}
      {tier >= 5 ? (
        <g>
          {/* Bank vor dem Haus */}
          <path d="M5 60.5h13" stroke={P.outline} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M5 60.5h13" stroke={P.woodLight} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M7 61.5v4.6M16 61.5v4.6" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
          <Pennant x={40} y={20.5} s={0.9} />
        </g>
      ) : null}
    </Grow>
    </ArtSvg>
  )
}

/** Kelterhaus: Fachwerk mit großem Tor, daneben die Spindelpresse. */
function Kelter({ tier }: { tier: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Grow tier={tier}>
      <Shadow grid="chapter" cx={tier >= 2 ? 40 : 29} rx={tier >= 2 ? 36 : 27} />
      <Wall x={9} y={39} w={40} h={27} fill={P.paper} k={K} />
      {/* Fachwerk */}
      <path d="M9.8 49H48.2M22 40v26M36 40v26M10 49l12-9M48 49l-12-9" stroke={P.woodDark} strokeWidth="1.7" fill="none" />
      <GableRoof x={9} y={40} w={40} h={18} fill={P.bark} over={4.5} k={K} />
      {/* Tor */}
      <rect x="22.8" y="50" width="12.4" height="16" fill={P.woodMid} {...detail} />
      <path d="M29 50.6v15M24 55h10M24 61h10" stroke={P.outline} strokeWidth={H} opacity=".55" />
      {tier >= 5 ? <Pane x={12.5} y={52} w={6.5} h={7} k={K} /> : null}
      {tier >= 2 ? (
        <g>
          {/* Spindelpresse */}
          <rect x="56" y="52" width="17" height="14" rx="2.2" fill={P.woodMid} {...line} />
          <path d="M60.4 53v12M64.5 53v12M68.6 53v12" stroke={P.outline} strokeWidth={H} opacity=".55" />
          <path d="M56 57h17M56 62h17" stroke={P.metal} strokeWidth="1.2" />
          <path d="M64.5 52V35" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" />
          <path d="M64.5 52V35" stroke={P.metal} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M55 36.5h19" stroke={P.outline} strokeWidth="4" strokeLinecap="round" />
          <path d="M55 36.5h19" stroke={P.woodLight} strokeWidth="2" strokeLinecap="round" />
          <rect x="59" y="48" width="11" height="4" rx="1" fill={P.woodDark} {...detail} />
        </g>
      ) : null}
      {tier >= 3 ? <Crate x={45} y={67} s={0.62} fruit={P.plum} /> : null}
      {tier >= 4 ? <Barrel x={76} y={66.5} s={0.95} /> : null}
      {tier >= 5 ? <Pennant x={29} y={22.5} s={0.9} /> : null}
    </Grow>
    </ArtSvg>
  )
}

/** Weinkeller: gemauertes Portal im Hang, davor die Fässer. */
function Weinkeller({ tier }: { tier: number }) {
  const spots = [11, 68, 20, 59]
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Grow tier={tier}>
      <Shadow grid="chapter" rx={36} />
      <path d="M4 66Q40 4 76 66z" fill={P.leafLight} {...line} />
      <path d="M40 36Q62 40 73 65H40z" fill={P.outline} opacity=".1" />
      <path d="M17 52q2-4 5-4M26 38q3-4 6-3M52 34q3 0 5 3" fill="none" stroke={P.leafDark} strokeWidth={D} strokeLinecap="round" />
      {/* Portal aus Bruchstein */}
      <path d="M26 66V49a14 14 0 0 1 28 0v17z" fill={P.stoneLight} {...line} />
      <path d="M26 56h5M49 56h5M27.6 46l4.4 2.6M52.4 46l-4.4 2.6M34 38.6l2.4 4.4M46 38.6l-2.4 4.4M40 35.4v5" stroke={P.outline} strokeWidth={H} opacity=".6" />
      <path d="M31 66V50a9 9 0 0 1 18 0v16z" fill={P.woodDark} {...detail} />
      <path d="M40 41.6V66M35.5 43.4V66M44.5 43.4V66" stroke={P.outline} strokeWidth={H} opacity=".55" />
      <circle cx="42.6" cy="56" r="1.2" fill="none" stroke={P.brass} strokeWidth=".9" />
      {tier >= 3 ? (
        <g>
          {/* Stützmauern links und rechts vom Portal */}
          <path d="M17 66V58q4-3 9-2v10zM54 56q5-1 9 2v8h-9z" fill={P.stone} {...detail} />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          {/* Lüftungskamin auf dem Hügel */}
          <rect x="55" y="33" width="5" height="9" rx="1" fill={P.stoneLight} {...detail} />
          <path d="M53.6 33h7.8" stroke={P.outline} strokeWidth={C} strokeLinecap="round" />
        </g>
      ) : null}
      {spots.slice(0, Math.min(4, tier)).map((x) => (
        <Barrel key={x} x={x} y={66.5} s={1.05} />
      ))}
      {tier >= 5 ? (
        <g>
          <Lantern x={40} y={29} s={1.3} />
          <Pennant x={40} y={22} s={0.9} />
        </g>
      ) : null}
    </Grow>
    </ArtSvg>
  )
}

/** Straußwirtschaft: Schankhaus mit ausgehängtem Strauß, Tischen und Lichterkette. */
function Strausse({ tier }: { tier: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Grow tier={tier}>
      <Shadow grid="chapter" rx={37} />
      <Wall x={20} y={39} w={40} h={27} fill={P.paper} k={K} />
      <GableRoof x={20} y={40} w={40} h={18} fill={P.roof} over={4.5} k={K} />
      <ArchDoor x={35} y={66} w={10} h={15} k={K} />
      <Pane x={24} y={47} w={7.5} h={8} k={K} />
      {tier >= 2 ? <Pane x={48.5} y={47} w={7.5} h={8} k={K} /> : null}
      {/* der Strauß: grüner Buschen am Ausleger */}
      <path d="M60 43h9" stroke={P.outline} strokeWidth={C} strokeLinecap="round" />
      <path d="M69 43v2.4" stroke={P.outline} strokeWidth={D} />
      <path d="M69 45q4.4 1 3.6 5.4q-.6 3.4-3.6 4q-3-.6-3.6-4q-.8-4.4 3.6-5.4z" fill={P.leaf} {...detail} />
      {tier >= 2 ? (
        <g>
          <path d="M3 58h14" stroke={P.outline} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M3 58h14" stroke={P.woodLight} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M5.4 59v7M14.6 59v7" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
          <rect x="8.6" y="52.8" width="3" height="4" rx=".8" fill={P.plum} stroke={P.outline} strokeWidth={H} />
        </g>
      ) : null}
      {tier >= 3 ? (
        <g>
          <path d="M63 60.5h14" stroke={P.outline} strokeWidth="4.2" strokeLinecap="round" />
          <path d="M63 60.5h14" stroke={P.woodLight} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M65.4 61.5v5M74.6 61.5v5" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          {/* Lichterkette vom Giebel zu zwei Stangen */}
          <path d="M3 40Q22 47 40 23Q58 47 77 40" stroke={P.outline} strokeWidth={H} fill="none" />
          {[[9, 42.2], [17, 42.6], [25, 39.6], [55, 39.6], [63, 42.6], [71, 42.2]].map(([x, y]) => (
            <circle key={x} cx={x} cy={y} r="1.5" fill={P.lamp} stroke={P.outline} strokeWidth={H} />
          ))}
        </g>
      ) : null}
      {tier >= 5 ? (
        <g>
          <Lantern x={31.5} y={40} s={1.2} />
          <Lantern x={48.5} y={40} s={1.2} />
          <Pennant x={40} y={22.5} s={0.9} />
        </g>
      ) : null}
    </Grow>
    </ArtSvg>
  )
}

function Weinfest({ tier }: { tier: number }) {
  const colors = [P.tomato, P.yellow, P.waterDeep, P.leafLight]
  return (
    <ArtSvg viewBox="0 0 80 72">
      <Grow tier={tier}>
      <Shadow grid="chapter" rx={36} />
      {/* Festzelt: zwei Masten, gestreiftes Dach, Wimpelkette */}
      <rect x="8.4" y="32" width="3.2" height="34" rx=".8" fill={P.woodMid} {...detail} />
      <rect x="68.4" y="32" width="3.2" height="34" rx=".8" fill={P.woodMid} {...detail} />
      <path d="M4 33L40 17L76 33v5H4z" fill={P.cream} {...line} />
      <path d="M16 27.700L28 22.300V38H16zM40 17L52 22.300V38H40zM64 27.700L76 33v5H64z" fill={P.roof} opacity=".9" />
      <path d="M40 19.200L74 34.200V37H40z" fill={P.outline} opacity=".12" />
      <path d="M4 33L40 17L76 33v5H4z" fill="none" {...line} />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${8 + i * 8} 38l4 6.4 4-6.4z`} fill={colors[i % 4]} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
      ))}
      {Array.from({ length: Math.min(3, tier) }, (_, i) => (
        <g key={i}>
          {/* Tisch mit Weinglas */}
          <path d={`M${16 + i * 18} 57h14`} stroke={P.outline} strokeWidth="4.2" strokeLinecap="round" />
          <path d={`M${16 + i * 18} 57h14`} stroke={P.woodLight} strokeWidth="2.2" strokeLinecap="round" />
          <path d={`M${18.4 + i * 18} 58v8M${27.6 + i * 18} 58v8`} stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
          <rect x={21.5 + i * 18} y="51.6" width="3" height="4" rx=".8" fill="#5b2a4a" stroke={P.outline} strokeWidth={H} />
        </g>
      ))}
      {tier >= 4
        ? [14, 30, 50, 66].map((x, i) => (
            <circle key={x} className="fest-twinkle" cx={x} cy={i % 3 ? 22 : 27} r="1.7" fill="#fff3b0" stroke={P.outline} strokeWidth={H} style={{ animationDelay: `${i * 0.3}s` }} />
          ))
        : null}
      {tier >= 5 ? (
        <g>
          <Barrel x={5} y={66.5} s={0.95} />
          <Barrel x={75} y={66.5} s={0.95} />
          <Pennant x={40} y={17} s={0.9} />
        </g>
      ) : null}
    </Grow>
    </ArtSvg>
  )
}

export const VineyardArt = memo(function VineyardArt({
  id,
  level,
  season,
}: {
  id: string
  level: number
  season?: Season
}) {
  const tier = Math.max(1, moduleTier(level))
  switch (id) {
    case 'trockenmauer':
      return <Trockenmauer tier={tier} />
    case 'wingerthaus':
      return <Wingerthaus tier={tier} />
    case 'kelter':
      return <Kelter tier={tier} />
    case 'weinkeller':
      return <Weinkeller tier={tier} />
    case 'strausse':
      return <Strausse tier={tier} />
    case 'weinfest':
      return <Weinfest tier={tier} />
    default:
      return <Vines id={id} tier={tier} season={season} />
  }
}, sameTierProps)

/** Unplanted terrace spot: stakes, waiting for vines. */
export function VineyardStakes() {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="62" rx="26" ry="5" fill={P.outlineSoft} opacity="0.45" />
      {[18, 32, 46, 60].map((x) => (
        <path key={x} d={`M${x} 64V44`} stroke={P.outlineSoft} strokeWidth="2" />
      ))}
      <path d="M18 48H60" stroke={P.stone} strokeWidth=".8" />
      <path d="M32 58c-4-2-5-6-3-8 3 1 4 4 3 8zM46 58c4-2 5-6 3-8-3 1-4 4-3 8z" fill={P.leafLight} />
    </ArtSvg>
  )
}

/** Overgrown terrace (locked): brambles over a broken wall. */
export function VineyardWild({ seed = 0 }: { seed?: number }) {
  return (
    <ArtSvg viewBox="0 0 80 72">
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={10 + i * 10} y={56 + ((i + seed) % 2) * 2} width="9" height="6" rx="2" fill={P.stone} stroke={P.outlineStone} strokeWidth=".6" />
      ))}
      <ellipse cx="30" cy="50" rx="14" ry="9" fill="#5f7a3a" />
      <ellipse cx="52" cy="52" rx="12" ry="8" fill="#4f6a30" />
      {[24, 30, 50, 56].map((x) => (
        <circle key={x} cx={x} cy={48 + (x % 3)} r="1.4" fill="#3a1838" />
      ))}
    </ArtSvg>
  )
}

export const VineyardBackdrop = memo(function VineyardBackdrop({ stage }: { stage: number }) {
  const slope = useSvgId('vg-slope')
  return (
    <div className="garden-ground vineyard-ground" aria-hidden="true" data-stage={stage}>
      <ArtSvg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={slope} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#b9c47a" />
            <stop offset="60%" stopColor="#a3b566" />
            <stop offset="100%" stopColor="#8fa457" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${slope})`} />
        {/* terraces */}
        {[38, 50, 62, 75, 88].map((y, i) => (
          <g key={y}>
            <path d={`M0 ${y} Q50 ${y - 3} 100 ${y}`} stroke={P.stone} strokeWidth="5" fill="none" vectorEffect="non-scaling-stroke" opacity="0.8" />
            <path d={`M0 ${y + 0.8} Q50 ${y - 2.2} 100 ${y + 0.8}`} stroke={P.outlineStone} strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" opacity={0.4 + i * 0.05} />
          </g>
        ))}
        {/* switchback path */}
        <path
          d="M50 100 L42 92 L58 82 L42 70 L58 58 L44 46 L54 34 L50 24"
          stroke="#d9c79a"
          strokeWidth="14"
          fill="none"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* river at the foot */}
        <path d="M0 97 Q30 93 60 97 T100 95 V100 H0z" fill={P.water} />
        <path d="M0 98 Q30 95 60 98 T100 97" stroke="#a9d6ee" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" className="orchard-stream" strokeDasharray="4 6" />
      </ArtSvg>
      <div className="garden-hedge orchard-hills">
        <ArtSvg viewBox="0 0 400 60" preserveAspectRatio="none">
          <path d="M0 60 V22 Q60 2 140 18 T280 10 T400 16 V60z" fill="#8a9a5a" />
          <path d="M0 60 V40 Q90 22 180 36 T400 30 V60z" fill="#7a8a4c" />
          <path d="M300 30 h14 v-10 l7 -6 l7 6 v10 h4 v12 h-32z" fill={P.paper} />
          <path d="M318 14 v-6" stroke={P.outlineWood} strokeWidth="2" />
        </ArtSvg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})
