/**
 * Kapitel 7 — Kräutergarten im kräftigen Stil (2026-11-14, Weinberg-Niveau):
 * Hochbeete, Steinringe und Bauten aus art/parts/bold.tsx; Kräuter mit feiner
 * Kontur, jede Stufe bringt Neues. Wachstum je Stufe übernimmt `Svg`.
 */
import type { ReactNode } from 'react'
import { Bees, Smoke, Svg } from '../../HandParts'
import { Jar, Pennant, Pot, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps, Bunting, Butterfly } from './partsA'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

/** Kräuterbund zum Trocknen; hängt bei (x, y). */
function Bundle({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v2`} stroke={P.outline} strokeWidth={H} />
      <path d={`M${x - 2.2} ${y + 9}L${x} ${y + 2}L${x + 2.2} ${y + 9}z`} fill={c} stroke={P.outline} strokeWidth={H} />
      <rect x={x - 0.9} y={y + 2} width="1.8" height="1.4" fill={P.brass} />
    </g>
  )
}

/** Hochbeet aus Holz: Erde oben, Bretterfront. Fußpunkt (40, y). */
function Raised({ y = 64, w = 64, h = 7, winter }: { y?: number; w?: number; h?: number; winter?: boolean }) {
  const x = 40 - w / 2
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} rx="1" fill={P.woodMid} {...line} />
      <path d={`M${x + 1} ${y - h / 2}H${x + w - 1}`} stroke={P.outline} strokeWidth={H} opacity=".35" />
      <rect x={x + 1} y={y - h + 0.8} width={w * 0.3} height="1.2" fill={P.white} opacity=".2" />
      <rect x={x + 1.6} y={y - h - 2.4} width={w - 3.2} height="3" rx="1.4" fill={winter ? P.white : P.soil} {...detail} />
    </g>
  )
}

/** Krautbusch mit feiner Kontur. */
function Clump({ x, y, r = 4.6, c, hi }: { x: number; y: number; r?: number; c: string; hi: string }) {
  return (
    <g>
      <ellipse cx={x} cy={y} rx={r} ry={r * 0.9} fill={c} stroke={P.outline} strokeWidth={H} />
      <ellipse cx={x - r * 0.4} cy={y - r * 0.4} rx={r * 0.45} ry={r * 0.3} fill={hi} />
    </g>
  )
}

/** Blüte (fünf Blätter) mit Mitte. */
function Bloom({ x, y, c, mid = P.yellow, r = 1.6 }: { x: number; y: number; c: string; mid?: string; r?: number }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle key={a} cx={x + Math.cos((a * Math.PI) / 180) * r * 0.9} cy={y + Math.sin((a * Math.PI) / 180) * r * 0.9} r={r * 0.62} fill={c} />
      ))}
      <circle cx={x} cy={y} r={r * 0.45} fill={mid} />
    </g>
  )
}

/** Gießkanne. */
function Can({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x - 4} ${y}l.6-7h7l.6 7z`} fill={P.denim} {...detail} />
      <path d={`M${x + 3.6} ${y - 5}l5-3`} stroke={P.outline} strokeWidth="2.2" strokeLinecap="round" />
      <path d={`M${x + 3.6} ${y - 5}l5-3`} stroke={P.denim} strokeWidth="1" strokeLinecap="round" />
      <path d={`M${x - 3} ${y - 7}q3.4-4 6.8 0`} stroke={P.outline} strokeWidth={D} fill="none" />
    </g>
  )
}

/** Schild auf einem Pflock. */
function Sign({ x, y, c = P.paper, dot }: { x: number; y: number; c?: string; dot?: string }) {
  return (
    <g>
      <Post x={x} y={y} h={10} w={1.6} k={K} />
      <rect x={x - 6} y={y - 14} width="12" height="6" rx="1" fill={c} {...line} />
      {dot ? <circle cx={x} cy={y - 11} r="1.6" fill={dot} /> : <path d={`M${x - 3.6} ${y - 11}h7.2`} stroke={P.leafDark} strokeWidth="1.2" />}
    </g>
  )
}

export function Kraeuter({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'kamille': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="34" ry="10" fill={winter ? P.white : P.soil} {...line} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              {Array.from({ length: 7 }, (_, i) => {
                const x = 14 + i * 8.6 + (r % 2) * 3
                const y = 64 - r * 4
                if (winter) return <path key={i} d={`M${x - 2} ${y}l2-3 2 3`} stroke={P.stoneDark} strokeWidth=".9" fill="none" />
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y} rx="3" ry="1.6" fill={P.leafLight} stroke={P.leafDark} strokeWidth={H} />
                    {!spring ? <Bloom x={x} y={y - 2.4} c={autumn ? P.paper : P.white} r={1.4} /> : null}
                  </g>
                )
              })}
            </g>
          ))}
          {tier >= 3 ? <Can x={66} y={50} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M8 46h12l-1.6 7h-8.8z" fill={P.woodLight} {...line} />
              <path d="M9 46q5-6 10 0" stroke={P.outline} strokeWidth={D} fill="none" />
              {[11, 14, 17].map((x) => <Bloom key={x} x={x} y={45.4} c={P.white} r={1.2} />)}
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={40} y={38} c={P.lamp} /> : null}
          {tier >= 5 ? <Pennant x={74} y={58} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'pfefferminze': {
      const clumps = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <Raised y={64} w={66} winter={winter} />
          {Array.from({ length: clumps }, (_, i) => {
            const x = 14 + i * 10.4
            return winter ? (
              <path key={i} d={`M${x - 4} 54q4-6 8 0`} fill={P.white} stroke={P.stoneLight} strokeWidth=".6" />
            ) : (
              <g key={i}>
                <Clump x={x} y={50} r={4.8} c={P.leafDark} hi={P.leafLight} />
                {summer ? <path d={`M${x} 46v-3`} stroke={P.lilac} strokeWidth="1.8" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? <Can x={70} y={42} /> : null}
          {tier >= 4 ? <Sign x={8} y={64} dot={P.leafDark} /> : null}
          {tier >= 5 && !winter ? <Bees n={3} cy={38} /> : null}
        </Svg>
      )
    }
    case 'ringelblume': {
      const n = Math.min(14, 4 + tier * 2)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="30" ry="10.5" fill={winter ? P.white : P.soil} {...line} />
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2
            return <ellipse key={i} cx={40 + Math.cos(a) * 30} cy={58 + Math.sin(a) * 10.5} rx="3" ry="2" fill={P.stoneLight} {...detail} />
          })}
          {!winter
            ? Array.from({ length: n }, (_, i) => {
                const x = 18 + ((i * 17) % 46)
                const y = 52 + ((i * 7) % 11)
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y + 2.4} rx="2.6" ry="1.4" fill={P.leaf} stroke={P.leafDark} strokeWidth={H} />
                    {!spring || i % 3 === 0 ? <Bloom x={x} y={y} c={autumn && i % 2 ? P.autumn : P.orange} mid={P.autumnDark} r={1.8} /> : null}
                  </g>
                )
              })
            : null}
          {tier >= 3 ? <Can x={70} y={52} /> : null}
          {tier >= 4 ? <Sign x={40} y={46} dot={P.orange} /> : null}
          {tier >= 5 && !winter ? <Butterfly x={60} y={38} c={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'johanniskraut': {
      const bushes = Math.min(5, tier + 1)
      const bloom = summer
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="59" rx="34" ry="10" fill={winter ? P.frost : P.leafLight} {...line} />
          {Array.from({ length: bushes }, (_, i) => {
            const x = 14 + i * 13
            const h = 16 + (i % 2) * 4
            return (
              <g key={i}>
                {!winter ? <ellipse cx={x} cy={62 - h * 0.55} rx="5.6" ry={h * 0.36} fill={P.leaf} stroke={P.outline} strokeWidth={H} /> : null}
                {Array.from({ length: 5 }, (_, k) => (
                  <path key={k} d={`M${x} 62q${(k - 2) * 1.5} -${h * 0.6} ${(k - 2) * 3} -${h}`} stroke={winter ? P.woodDark : P.leafDark} strokeWidth="1" fill="none" />
                ))}
                {bloom || (spring && i % 2 === 0)
                  ? Array.from({ length: 5 }, (_, k) => <Bloom key={k} x={x - 5 + k * 2.5} y={62 - h + (k % 2) * 2} c={P.yellow} mid={P.amber} r={1.4} />)
                  : null}
                {autumn ? Array.from({ length: 4 }, (_, k) => <circle key={k} cx={x - 4 + k * 2.6} cy={62 - h + 1} r="1" fill={P.berry} />) : null}
              </g>
            )
          })}
          {tier >= 4 ? (
            <g>
              <Post x={9} y={56} h={18} w={1.8} k={K} />
              <Post x={27} y={56} h={18} w={1.8} k={K} />
              <path d="M7 38h22" stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M7 38h22" stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" />
              {[13, 18, 23].map((x) => (
                <Bundle key={x} x={x} y={38} c={P.gold} />
              ))}
            </g>
          ) : null}
          {tier >= 3 && !winter ? <Bees n={tier} cy={34} /> : null}
          {tier >= 5 ? <Pennant x={74} y={60} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'salbei': {
      const pots = Math.min(6, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {/* Pflanzbank */}
          <Post x={10} y={66} h={6} w={2} k={K} />
          <Post x={70} y={66} h={6} w={2} k={K} />
          <rect x="6" y="58" width="68" height="3" rx="1" fill={P.woodMid} {...line} />
          {Array.from({ length: pots }, (_, i) => {
            const x = 12 + i * 11.2
            const big = i % 2 === 0
            return (
              <g key={i}>
                {!winter ? (
                  <Clump x={x} y={big ? 47 : 48.6} r={big ? 5.2 : 4.2} c={P.winterLeafLight} hi={P.glassEdge} />
                ) : (
                  <path d={`M${x - 4} 50q4-3.6 8 0`} stroke={P.white} strokeWidth="2" fill="none" />
                )}
                {summer && big ? <path d={`M${x} 42v-5`} stroke={P.lavender} strokeWidth="1.8" strokeLinecap="round" /> : null}
                <Pot x={x} y={58} s={big ? 0.67 : 0.57} />
              </g>
            )
          })}
          {tier >= 4 ? <Sign x={66} y={44} c={P.paper} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M2 66v-6h14v6z" fill={P.woodMid} {...line} />
              <path d="M2 60l14-4v4z" fill={P.glass} {...detail} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'trockenboden': {
      const bundles = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <Wall x={10} y={40} w={52} h={26} fill={P.paper} k={K} />
          <path d="M10.8 52H61.2M23 40.8v24.4M49 40.8v24.4" stroke={P.woodDark} strokeWidth="1.5" fill="none" />
          <GableRoof x={10} y={41} w={52} h={16} fill={P.woodDark} over={4} k={K} />
          {/* offener Boden unter dem Dach mit Kräuterbunden */}
          <rect x="20" y="41.6" width="32" height="9" fill={P.soilDark} {...detail} />
          <path d="M20 43h32" stroke={P.woodLight} strokeWidth="1" />
          {Array.from({ length: bundles }, (_, i) => (
            <Bundle key={i} x={22.4 + i * 4} y={43} c={[P.leafMoss, P.gold, P.winterLeafLight, P.lilac, P.orange][i % 5]!} />
          ))}
          <ArchDoor x={31} y={66} w={10} h={12} k={K} />
          {tier >= 3 ? (
            <g>
              <path d="M64 66l2-24M70 66l-2-24" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
              <path d="M64.8 60h5.4M65.4 54h4.4M66 48h3.4" stroke={P.woodLight} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M2 66l1-7h10l1 7z" fill={P.woodLight} {...line} />
              <path d="M4 59l2-3 2 3 2-3 2 3" fill={P.winterLeafLight} stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          {winter ? <path d="M6 41 L36 25 L66 41" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'destille': {
      const bottles = Math.min(5, tier)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          {/* Schutzdach auf Pfosten */}
          <Post x={10} y={66} h={32} w={2.4} k={K} />
          <Post x={44} y={66} h={32} w={2.4} k={K} />
          <path d="M4 36h46l-4-9h-38z" fill={P.autumnDark} {...line} />
          <path d="M10 33h34" stroke={P.white} strokeWidth={D} opacity=".3" strokeLinecap="round" />
          {/* Feuerstelle und Kupferkessel */}
          <rect x="14" y="57" width="18" height="9" rx="1" fill={P.stoneDark} {...line} />
          {tier >= 2 ? <path d="M19 60q4-4 8 0" fill={P.orange} className="fest-glow" /> : null}
          <ellipse cx="23" cy="51" rx="9" ry="7" fill={P.autumn} {...line} />
          <ellipse cx="20" cy="48" rx="3" ry="1.6" fill={P.white} opacity=".35" />
          <path d="M23 44q0-6 6-6h12" stroke={P.outline} strokeWidth="3.6" fill="none" strokeLinecap="round" />
          <path d="M23 44q0-6 6-6h12" stroke={P.autumn} strokeWidth="2" fill="none" strokeLinecap="round" />
          <rect x="40" y="38" width="8" height="16" rx="2" fill={P.autumn} {...line} />
          <path d="M44 54v4" stroke={P.waterLight} strokeWidth="1.2" strokeDasharray="1 1.4" />
          {Array.from({ length: bottles }, (_, i) => (
            <path key={i} d={`M${52 + i * 5} 66v-6l1-2v-2h1.4v2l1 2v6z`} fill={[P.waterLight, P.lilac, P.lamp, P.leafPale, P.pink][i]} {...detail} />
          ))}
          {tier >= 3 ? <Smoke x={23} y={42} /> : null}
          {tier >= 5 ? <Sign x={70} y={54} dot={P.leafMoss} /> : null}
          {winter ? <path d="M6 27h40" stroke={P.white} strokeWidth="2" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'salbenkueche': {
      const jars = Math.min(6, tier + 1)
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <rect x="32" y="27" width="4.4" height="10" fill={P.stone} {...detail} />
          <Smoke x={34} y={25} />
          <Wall x={6} y={42} w={36} h={24} fill={P.cream} k={K} />
          <GableRoof x={6} y={43} w={36} h={15} fill={P.lavender} over={3.5} k={K} />
          <Pane x={10} y={48} w={6.5} h={6.5} k={K} />
          <ArchDoor x={26} y={66} w={9} h={13} k={K} />
          {/* Arbeitstisch mit Tiegeln */}
          <Post x={48} y={66} h={11} w={2} k={K} />
          <Post x={72} y={66} h={11} w={2} k={K} />
          <rect x="46" y="54" width="28" height="3" rx="1" fill={P.woodMid} {...line} />
          {Array.from({ length: jars }, (_, i) => (
            <Jar key={i} x={49.7 + i * 4.4} y={54} s={0.7} c={i % 2 ? P.cream : P.lilac} lid={i % 2 ? P.lavender : P.autumn} />
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M64 44h8l-1 4h-6z" fill={P.stone} {...detail} />
              <path d="M69 44l3-5" stroke={P.outline} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Bloom x={13} y={62} c={P.orange} r={1.8} /> : null}
          {tier >= 4 ? <Bloom x={18} y={63} c={P.lilac} r={1.8} /> : null}
          {tier >= 5 ? <Pennant x={24} y={30} s={0.8} /> : null}
          {winter ? <path d="M2 43 L24 29 L46 43" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'teestube': {
      const tables = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <Wall x={32} y={42} w={42} h={24} fill={P.canvas} k={K} />
          <GableRoof x={32} y={43} w={42} h={14} fill={P.leafDark} over={3.5} k={K} />
          <Pane x={36} y={48} w={6.5} h={6.5} k={K} />
          <Pane x={63} y={48} w={6.5} h={6.5} k={K} />
          <ArchDoor x={48.5} y={66} w={9} h={13} k={K} />
          <rect x="43" y="34" width="20" height="5" rx="1" fill={P.cream} {...detail} />
          <path d="M49 36.4h8" stroke={P.leafDark} strokeWidth="1.2" />
          {Array.from({ length: tables }, (_, i) => {
            const x = 12 + (i % 2) * 12
            const y = 54 + Math.floor(i / 2) * 9 + (i % 2) * 3
            return (
              <g key={i}>
                <path d={`M${x} ${y + 2}v6`} stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
                <ellipse cx={x} cy={y} rx="6" ry="2.2" fill={P.cream} {...detail} />
                <path d={`M${x - 2.6} ${y - 1}h2.4v-1.6h-2.4z`} fill={P.white} stroke={P.outline} strokeWidth={H} />
                <path d={`M${x + 1} ${y - 1.4}l1.6-1`} stroke={P.red} strokeWidth=".9" />
              </g>
            )
          })}
          {tier >= 3 ? <Pot x={30} y={66} s={0.67} /> : null}
          {tier >= 3 && !winter ? <Clump x={30} y={57} r={3.6} c={P.leaf} hi={P.leafLight} /> : null}
          {tier >= 5 ? <Bunting y={30} n={8} x0={4} x1={34} /> : null}
          {winter ? <path d="M28 43 L53 29 L78 43" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    }
    case 'apothekergarten': {
      const quads = Math.min(4, tier)
      const cols = [P.lilac, P.yellow, P.white, P.red]
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="57" rx="36" ry="13" fill={winter ? P.frost : P.paper} {...line} />
          {[
            [10, 47],
            [44, 47],
            [10, 58],
            [44, 58],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="26" height="8" rx="2" fill={winter ? P.winterLeafLight : P.leafDark} {...detail} />
              <rect x={x! + 1.6} y={y! + 1.4} width="22.8" height="5.2" rx="1.4" fill={winter ? P.white : P.soil} />
              {i < quads && !winter
                ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={x! + 4 + k * 3.6} cy={y! + 4} r="1.6" fill={spring && k % 2 ? P.leafLight : cols[i]} stroke={P.outline} strokeWidth={H * 0.6} />)
                : null}
            </g>
          ))}
          {/* Sonnenuhr in der Mitte */}
          <circle cx="40" cy="56" r="4.4" fill={P.stoneLight} {...line} />
          <path d="M40 56l2.8-2.2" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
          {tier >= 4 ? (
            <g>
              <path d="M26 44V31 Q40 19 54 31 V44" stroke={P.outline} strokeWidth="3.4" fill="none" />
              <path d="M26 44V31 Q40 19 54 31 V44" stroke={P.woodLight} strokeWidth="1.6" fill="none" />
              {!winter ? Array.from({ length: 7 }, (_, k) => <circle key={k} cx={28 + k * 4} cy={31 - Math.sin((k / 6) * Math.PI) * 9} r="2" fill={k % 2 ? P.red : P.leaf} stroke={P.outline} strokeWidth={H} />) : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M64 44q5-10 10 0z" fill={P.woodLight} {...line} />
              <path d="M64.8 41h8.4M66 38h6" stroke={P.woodDark} strokeWidth={H} />
              {!winter ? <Bees n={3} cx={66} cy={34} /> : null}
            </g>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}

/* ————————————— Kapitel 8: Botanischer Garten ————————————— */
