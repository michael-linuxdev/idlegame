/**
 * Kapitel 6 — Teich im kräftigen Stil (2026-11-14, Weinberg-Niveau): Teich mit
 * Uferkante und Lichtreflex, Bauten aus art/parts/bold.tsx; Seerosen, Schilf,
 * Fische, Boote und Vögel behalten ihre Zeichnung (Kontur über `hand-art`).
 */
import type { ReactNode } from 'react'
import type { Season } from '../../ambient'
import { Svg, Smoke, Lily, Reed, Fish, Boat } from '../../HandParts'
import { Bird, Lantern, Pennant, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

/** Teich: Uferstreifen, Wasser mit Kontur, Lichtreflex; gefroren hell. */
function Pond({ cx = 40, cy = 54, rx = 33, ry = 12, frozen }: { cx?: number; cy?: number; rx?: number; ry?: number; frozen?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1.6} rx={rx + 3} ry={ry + 3} fill={frozen ? P.frost : P.leafLight} {...line} />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={frozen ? P.glass : P.water} {...detail} />
      <ellipse cx={cx + rx * 0.2} cy={cy + ry * 0.25} rx={rx * 0.62} ry={ry * 0.5} fill={frozen ? P.white : P.waterDeep} opacity=".35" />
      <path d={`M${cx - rx * 0.6} ${cy - ry * 0.35}q${rx * 0.35}-${ry * 0.3} ${rx * 0.7}-${ry * 0.15}`} stroke={P.white} strokeWidth={D} fill="none" opacity=".55" strokeLinecap="round" />
    </g>
  )
}

/** Holzsteg mit Pfählen; `len` = Länge nach rechts. */
function Jetty({ x, y, len }: { x: number; y: number; len: number }) {
  const piles = Math.max(2, Math.round(len / 7))
  return (
    <g>
      {Array.from({ length: piles }, (_, i) => (
        <Post key={i} x={x + 2 + (i * (len - 4)) / (piles - 1)} y={y + 9} h={9} w={2} k={K} />
      ))}
      <rect x={x} y={y} width={len} height="4.4" rx="1" fill={P.woodMid} {...line} />
      <path d={Array.from({ length: Math.floor(len / 4) }, (_, i) => `M${x + 4 + i * 4} ${y + 0.6}v3.2`).join('')} stroke={P.outline} strokeWidth={H} opacity=".35" />
      <rect x={x + 1} y={y + 0.6} width={len - 2} height="1.2" fill={P.white} opacity=".2" />
    </g>
  )
}

export function Teich({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const frozen = season === 'winter'
  switch (id) {
    case 'seerosen':
      return (
        <Svg tier={tier} bold>
          <Pond frozen={frozen} />
          {!frozen ? (
            <Old>
              {Array.from({ length: Math.min(7, 2 + tier) }, (_, i) => (
                <Lily key={i} x={16 + ((i * 11) % 48)} y={48 + ((i * 7) % 12)} flower={i % 2 === 0 || tier >= 4 ? (i % 3 ? P.cream : P.pink) : undefined} />
              ))}
            </Old>
          ) : null}
          {tier >= 3 && !frozen ? (
            <g transform="translate(52 50)">
              <ellipse cx="0" cy="0" rx="2.8" ry="1.9" fill={P.leafDark} {...detail} />
              <circle cx="-1" cy="-1.5" r=".8" fill={P.white} />
              <circle cx="1" cy="-1.5" r=".8" fill={P.white} />
            </g>
          ) : null}
          {tier >= 5 ? <Pennant x={74} y={60} s={0.8} /> : null}
        </Svg>
      )
    case 'schilf':
      return (
        <Svg tier={tier} bold>
          <Pond cy={56} ry={10} frozen={frozen} />
          <Old>
            {Array.from({ length: 5 + tier * 2 }, (_, i) => (
              <Reed key={i} x={8 + ((i * 9) % 64)} h={18 + ((i * 7) % 14)} />
            ))}
          </Old>
          {tier >= 3 && !frozen ? (
            <path className="bee" d="M60 30h8M64 30l-2-2M64 30l-2 2M64 30l2-2M64 30l2 2" stroke={P.waterDeep} strokeWidth="1" />
          ) : null}
          {tier >= 4 ? (
            <g transform="translate(30 30)">
              <ellipse cx="0" cy="0" rx="3.2" ry="2.1" fill={P.woodMid} {...detail} />
              <circle cx="2.8" cy="-1.5" r="1.5" fill={P.woodMid} {...detail} />
              <path d="M4 -1.5l1.8 .4" stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
          {tier >= 5 ? <Pennant x={8} y={62} s={0.8} /> : null}
        </Svg>
      )
    case 'karpfenteich':
      return (
        <Svg tier={tier} bold>
          <Pond frozen={frozen} />
          {!frozen ? (
            <Old>
              {Array.from({ length: Math.min(6, 1 + tier) }, (_, i) => (
                <Fish key={i} x={20 + ((i * 13) % 40)} y={50 + ((i * 5) % 10)} color={i % 2 ? P.woodMid : P.honey} s={1.1} />
              ))}
            </Old>
          ) : null}
          {/* Stufe 3: Mönch (Ablaufbauwerk) aus Stein; Stufe 4: Futterboot */}
          {tier >= 3 ? (
            <g>
              <rect x="64" y="38" width="8" height="18" rx="1" fill={P.stone} {...line} />
              <rect x="65" y="39" width="2.4" height="16" fill={P.white} opacity=".2" />
              <path d="M64 44h8" stroke={P.woodDark} strokeWidth="1.6" />
            </g>
          ) : null}
          {tier >= 4 && !frozen ? (
            <Old>
              <Boat x={24} y={48} color={P.woodLight} />
            </Old>
          ) : null}
          {tier >= 5 ? (
            <Old>
              <Lily x={50} y={46} flower={P.cream} />
            </Old>
          ) : null}
        </Svg>
      )
    case 'forellenbach':
      return (
        <Svg tier={tier} bold>
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke={P.outline} strokeWidth={13 + tier} fill="none" strokeLinecap="round" />
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke={frozen ? P.glass : P.water} strokeWidth={10 + tier} fill="none" strokeLinecap="round" />
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke={P.white} strokeWidth="1.6" fill="none" strokeDasharray="4 6" className="orchard-stream" opacity=".8" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <ellipse key={i} cx={14 + i * 11} cy={34 + i * 5 + (i % 2) * 4} rx="3.8" ry="2.5" fill={P.stone} {...detail} />
          ))}
          {/* Stufe 2: Holzbrücke; Stufe 4: Angler-Bank */}
          {tier >= 2 ? (
            <g>
              <path d="M24 50q8-6 16 0" stroke={P.outline} strokeWidth="4.4" fill="none" strokeLinecap="round" />
              <path d="M24 50q8-6 16 0" stroke={P.woodMid} strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <path d="M26 46v4M38 46v4" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <path d="M56 46h12" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M56 46h12" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M58 47v4M66 47v4" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
          {tier >= 3 && !frozen ? (
            <g className="ha-jump">
              <Old>
                <Fish x={46} y={58} color={P.pink} />
              </Old>
            </g>
          ) : null}
        </Svg>
      )
    case 'steg':
      return (
        <Svg tier={tier} bold>
          <Pond frozen={frozen} />
          <Jetty x={8} y={44} len={22 + tier * 7} />
          {tier >= 2 && !frozen ? (
            <Old>
              <Boat x={56} y={58} color={P.tomato} />
            </Old>
          ) : null}
          {tier >= 3 ? <Lantern x={10} y={44} s={0.6} /> : null}
          {tier >= 4 ? <path d="M28 44v-10l6 3-6 3" fill={P.yellow} {...detail} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M40 43.6h8" stroke={P.outline} strokeWidth="3.4" strokeLinecap="round" />
              <path d="M40 43.6h8" stroke={P.woodLight} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    case 'fischerhuette':
      return (
        <Svg tier={tier} bold>
          <Pond cy={58} ry={9} frozen={frozen} />
          {[20, 32, 44].map((x) => (
            <Post key={x} x={x} y={60} h={8} w={2.2} k={K} />
          ))}
          <Wall x={16} y={36} w={32} h={17} fill={P.woodMid} planks={3} k={K} />
          <GableRoof x={16} y={37} w={32} h={11} fill={P.denim} over={3} k={K} />
          <Pane x={20} y={41} w={6} h={6} k={K} />
          <ArchDoor x={35} y={53} w={8} h={11} k={K} />
          {/* Stufe 2: Netz zum Trocknen */}
          {tier >= 2 ? (
            <g>
              <Post x={52} y={52} h={22} w={1.8} k={K} />
              <Post x={72} y={52} h={22} w={1.8} k={K} />
              <path d="M52 31q10 4 20 0" stroke={P.outline} strokeWidth={D} fill="none" />
              <g stroke={P.stoneDark} strokeWidth={H} fill="none">
                {Array.from({ length: 5 }, (_, i) => (
                  <path key={i} d={`M${53 + i * 4.4} 32v16M53 ${34 + i * 3.4}h18`} />
                ))}
              </g>
            </g>
          ) : null}
          {tier >= 3 ? <Lantern x={13} y={50} s={0.6} /> : null}
          {tier >= 4 && !frozen ? (
            <Old>
              <Boat x={62} y={62} color={P.waterDeep} />
            </Old>
          ) : null}
          {tier >= 5 ? <Pennant x={32} y={24} s={0.8} /> : null}
        </Svg>
      )
    case 'raeucherei':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={34} />
          <Wall x={16} y={42} w={30} h={24} fill={P.stoneDark} planks={4} k={K} />
          <GableRoof x={16} y={43} w={30} h={13} fill={P.bark} over={3} k={K} />
          <rect x="37" y="26" width="5" height="12" fill={P.woodDark} {...detail} />
          <Smoke x={39.5} y={24} />
          <ArchDoor x={26} y={66} w={9} h={13} k={K} />
          {tier >= 3 ? <rect x="19" y="48" width="4.4" height="4.4" rx=".6" fill={P.orange} {...detail} /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="20" y="30" width="4.4" height="9" fill={P.woodDark} {...detail} />
              <Smoke x={22} y={28} />
            </g>
          ) : null}
          {/* Fischstange */}
          <Post x={50} y={66} h={26} w={2} k={K} />
          <Post x={76} y={66} h={26} w={2} k={K} />
          <path d="M48 41h30" stroke={P.outline} strokeWidth="3" strokeLinecap="round" />
          <path d="M48 41h30" stroke={P.woodLight} strokeWidth="1.3" strokeLinecap="round" />
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <g key={i}>
              <path d={`M${54 + i * 5} 41v3`} stroke={P.outline} strokeWidth={H} />
              <path d={`M${54 + i * 5} 44q-1.8 4 0 8.4q1.8 -4.4 0 -8.4z`} fill={P.autumn} {...detail} />
            </g>
          ))}
          {tier >= 2 ? [0, 1, 2].map((i) => <circle key={i} cx={6 + i * 3.6} cy={64} r="1.9" fill={P.woodLight} {...detail} />) : null}
          {tier >= 2 ? [0, 1].map((i) => <circle key={i} cx={7.8 + i * 3.6} cy={60.8} r="1.9" fill={P.woodLight} {...detail} />) : null}
          {tier >= 4 ? (
            <g>
              <rect x="56" y="57" width="16" height="2.2" rx=".6" fill={P.woodMid} {...detail} />
              <rect x="58" y="53.6" width="9" height="3.4" rx=".6" fill={P.woodLight} {...detail} />
              <path d="M58 59v7M70 59v7" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
        </Svg>
      )
    case 'bootsverleih':
      return (
        <Svg tier={tier} bold>
          <Pond frozen={frozen} />
          <Jetty x={6} y={40} len={40} />
          {!frozen ? (
            <Old>
              {[P.tomato, P.waterDeep, P.yellow, P.leafLight, P.cream].slice(0, Math.min(5, 1 + tier)).map((c, i) => (
                <Boat key={c} x={16 + i * 12} y={56 + (i % 2) * 4} color={c} flip={i % 2 === 1} />
              ))}
            </Old>
          ) : null}
          {/* Stufe 3: Kassenhäuschen */}
          {tier >= 3 ? (
            <g>
              <Wall x={56} y={26} w={14} h={14} fill={P.cream} k={K} />
              <GableRoof x={56} y={27} w={14} h={7} fill={P.tomato} over={2} k={K} />
              <rect x="59" y="30" width="8" height="5" rx=".6" fill={P.window} {...detail} />
            </g>
          ) : null}
          {tier >= 5 ? <Pennant x={46} y={40} s={0.8} /> : null}
        </Svg>
      )
    case 'entenbucht':
      return (
        <Svg tier={tier} bold>
          <Pond frozen={frozen} />
          <Old>
            <Reed x={66} h={20} />
            <Reed x={70} h={16} />
            {tier >= 3 ? <Reed x={10} h={18} /> : null}
            <Bird x={26} y={52} color={P.outlineSoft} neck={P.leafDark} swim />
            {tier >= 2 ? <Bird x={44} y={58} color={P.woodMid} neck={P.woodMid} swim flip /> : null}
            {tier >= 3 ? <Bird x={34} y={48} color={P.woodMid} neck={P.woodMid} swim /> : null}
            {tier >= 4 ? <Bird x={54} y={50} color={P.orange} neck={P.blue} swim flip /> : null}
            {tier >= 5 ? <Bird x={18} y={58} color={P.cream} neck={P.cream} swim /> : null}
          </Old>
          {/* Stufe 4: Entenhaus auf dem Floß */}
          {tier >= 4 ? (
            <g>
              <rect x="56" y="58" width="14" height="3" rx="1" fill={P.woodMid} {...detail} />
              <Wall x={58} y={50} w={10} h={8} fill={P.woodLight} k={K} />
              <path d="M56.6 50.6 L63 45.6 L69.4 50.6z" fill={P.roof} {...line} />
            </g>
          ) : null}
        </Svg>
      )
    case 'seefest': {
      const lamps = Math.min(7, 2 + tier)
      return (
        <Svg tier={tier} bold>
          <Pond frozen={frozen} />
          {/* Bühne auf dem Steg mit Baldachin */}
          <Post x={26} y={50} h={18} w={2.2} k={K} />
          <Post x={54} y={50} h={18} w={2.2} k={K} />
          <rect x="22" y="48" width="36" height="5" rx="1" fill={P.woodMid} {...line} />
          <path d="M20 34 Q40 22 60 34z" fill={P.tomato} {...line} />
          <path d="M26 31q14-7 28 0" stroke={P.white} strokeWidth={D} fill="none" opacity=".4" strokeLinecap="round" />
          <path d="M4 26 Q40 40 76 26" stroke={P.outline} strokeWidth={H} fill="none" />
          {Array.from({ length: lamps }, (_, i) => {
            const x = 8 + i * 10
            const y = 26 + Math.sin((x / 80) * Math.PI) * 7
            return <circle key={i} className="fest-glow" cx={x} cy={y + 2} r="2.1" fill={[P.amber, P.red, P.waterLight, P.yellow][i % 4]} stroke={P.outline} strokeWidth={H} />
          })}
          {tier >= 4 ? (
            <g fill={P.outline}>
              <circle cx="34" cy="44" r="1.7" />
              <rect x="33" y="45.4" width="2" height="3" />
              <circle cx="46" cy="44" r="1.7" />
              <rect x="45" y="45.4" width="2" height="3" />
            </g>
          ) : null}
          {tier >= 5 && !frozen ? (
            <Old>
              <Boat x={64} y={60} color={P.yellow} />
            </Old>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}

/** Gesperrte Ecke am Teich: Schlamm und Schilf. */
export function TeichWild({ seed = 0 }: { seed?: number }) {
  return (
    <Svg>
      <ellipse cx="40" cy="58" rx="28" ry="8" fill="#6e5a3a" opacity=".6" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${16 + i * 8} 62q${i % 2 ? 2 : -2} -${12 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${18 + ((i + seed) % 4) * 3}`} stroke="#8a8a5a" strokeWidth="1.4" fill="none" />
      ))}
      <ellipse cx="54" cy="58" rx="6" ry="2" fill="#5f7a8a" opacity=".6" />
    </Svg>
  )
}
