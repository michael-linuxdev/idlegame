/**
 * Kapitel 9 — Alm im kräftigen Stil (2026-11-14, Weinberg-Niveau): Hänge und
 * Felsen mit Kontur, Hütten aus Blockholz auf Steinsockel, Bausteine aus
 * art/parts/bold.tsx; Kühe behalten ihre Zeichnung (Kontur über `hand-art`).
 */
import type { ReactNode } from 'react'
import { Bees, Cow, Smoke, Svg } from '../../HandParts'
import { Barrel, Lantern, Pennant, Shadow } from '../parts'
import { ArchDoor, GableRoof, Pane, Post, Wall } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P } from '../palette'
import { type AreaProps, Bunting, Butterfly } from './partsA'

const K = 0.85
const D = BOLD.detail * K
const H = BOLD.hair * K
const line = boldLine(K)
const detail = boldDetail(K)

function Old({ children }: { children: ReactNode }) {
  return <g className="hand-art">{children}</g>
}

function Edelweiss({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 4V0" stroke={P.leafMoss} strokeWidth=".8" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-1.8" rx="1" ry="2" fill={P.cream} stroke={P.outline} strokeWidth={H * 0.5} transform={`rotate(${a})`} />
      ))}
      <circle r=".9" fill={P.lamp} />
    </g>
  )
}

function Gentian({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 4}v-3`} stroke={P.leafMoss} strokeWidth=".8" />
      <path d={`M${x - 1.8} ${y - 2.8}h3.6l-.7 3.8h-2.2z`} fill={P.blue} stroke={P.outline} strokeWidth={H * 0.6} />
      <path d={`M${x - 1.8} ${y - 2.8}l-.6 -.9M${x + 1.8} ${y - 2.8}l.6 -.9`} stroke={P.blue} strokeWidth=".8" />
    </g>
  )
}

function Flower({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y + 3}v-3`} stroke={P.leafDark} strokeWidth=".7" />
      <circle cx={x} cy={y} r="1.5" fill={c} stroke={P.outline} strokeWidth={H * 0.5} />
    </g>
  )
}

function AlmCow({ x, y, flip, brown }: { x: number; y: number; flip?: boolean; brown?: boolean }) {
  return (
    <g>
      <Old>
        <Cow x={x} y={y} flip={flip} brown={brown} />
      </Old>
      <path d={`M${x + (flip ? -8 : 8) - 1.1} ${y}h2.2l.6 2.2h-3.4z`} fill={P.gold} stroke={P.outline} strokeWidth={H} />
    </g>
  )
}

/** Almhang mit Kontur und Lichtkante. */
function Slope({ c }: { c: string }) {
  return (
    <g>
      <path d="M2 66 Q20 40 78 44 V66z" fill={c} {...line} />
      <path d="M8 58q10-12 30-14" stroke={P.white} strokeWidth={D} fill="none" opacity=".35" strokeLinecap="round" />
    </g>
  )
}

function Rock({ x, y, w = 12, h = 7, snow }: { x: number; y: number; w?: number; h?: number; snow?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w} ${y}z`} fill={P.stone} {...line} />
      <path d={`M${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.55} ${y}`} stroke={P.outline} strokeWidth={H} opacity=".4" />
      <path d={`M${x + w * 0.16} ${y - h * 0.4} L${x + w * 0.26} ${y - h * 0.86}`} stroke={P.white} strokeWidth={D} opacity=".35" strokeLinecap="round" />
      {snow ? <path d={`M${x + w * 0.16} ${y - h * 0.8} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.8} ${y - h * 0.6}`} stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

function Conifer({ x, y, s = 1, snow }: { x: number; y: number; s?: number; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1.2" y="-3.4" width="2.4" height="3.4" fill={P.bark} {...detail} />
      <path d="M0 -26 L-7 -12 L-4 -12 L-9 -3 L9 -3 L4 -12 L7 -12z" fill={P.leafDark} {...line} />
      {snow ? <path d="M-4 -12h8M-7 -3.6h14M0 -26l-3 6h6z" stroke={P.white} strokeWidth="1.6" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

/** Heuhütte-Heinze (Trockengestell mit Heu). */
function Heinze({ x, winter }: { x: number; winter: boolean }) {
  return (
    <g>
      <Post x={x} y={62} h={22} w={1.6} k={K} />
      {!winter ? <path d={`M${x} 38 Q${x - 8} 48 ${x - 4} 60 H${x + 4} Q${x + 8} 48 ${x} 38z`} fill={P.gold} {...line} /> : null}
      {!winter ? <path d={`M${x - 3} 48q3-2 6 0M${x - 3.6} 54q3.6-2 7.2 0`} stroke={P.brass} strokeWidth={H} fill="none" /> : null}
    </g>
  )
}

/** Blockhaus-Wand: Balkenlagen. */
function Logs({ x, y, w, h }: { x: number; y: number; w: number; h: number }) {
  return (
    <g>
      <Wall x={x} y={y} w={w} h={h} fill={P.woodDark} k={K} />
      <path d={Array.from({ length: Math.floor(h / 3.4) }, (_, i) => `M${x + 1} ${y + 3.4 * (i + 1)}H${x + w - 1}`).join('')} stroke={P.outline} strokeWidth={H} opacity=".5" />
    </g>
  )
}

export function Alm({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  const grass = winter ? P.white : autumn ? P.leafPale : P.leafLight
  switch (id) {
    case 'almwiese': {
      const n = 8 + tier * 5
      return (
        <Svg tier={tier} bold>
          <Slope c={grass} />
          {!winter
            ? Array.from({ length: n }, (_, i) => {
                const x = 8 + ((i * 17) % 66)
                const y = 52 + ((i * 11) % 12)
                const c = [P.cream, P.yellow, P.lilac, P.blue, P.red][i % 5]!
                return spring || summer || i % 3 === 0 ? <Flower key={i} x={x} y={y} c={c} /> : null
              })
            : null}
          {tier >= 3 ? <Heinze x={58} winter={winter} /> : null}
          {tier >= 5 ? <Heinze x={70} winter={winter} /> : null}
          {tier >= 4 && !winter ? <Bees n={3} cy={40} cx={28} /> : null}
          {tier >= 2 ? (
            <g>
              <path d="M6 64l8-12" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M6 64l8-12" stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" />
              <path d="M13 52l3-2" stroke={P.metal} strokeWidth="1.6" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'kuhherde':
      return (
        <Svg tier={tier} bold>
          <Slope c={grass} />
          {/* Kreuzzaun */}
          {Array.from({ length: 6 }, (_, i) => (
            <g key={i}>
              <path d={`M${6 + i * 12} 66 l6 -12`} stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d={`M${6 + i * 12} 66 l6 -12`} stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ))}
          <path d="M4 60 Q40 54 76 58" stroke={P.outline} strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M4 60 Q40 54 76 58" stroke={P.woodMid} strokeWidth="1.1" fill="none" strokeLinecap="round" />
          {!winter ? (
            <>
              <AlmCow x={30} y={50} brown />
              {tier >= 2 ? <AlmCow x={52} y={52} flip /> : null}
              {tier >= 3 ? <AlmCow x={18} y={58} brown /> : null}
              {tier >= 4 ? <AlmCow x={62} y={44} flip brown /> : null}
              {tier >= 5 ? <AlmCow x={42} y={60} /> : null}
            </>
          ) : (
            <g>
              <Logs x={30} y={52} w={20} h={12} />
              <GableRoof x={30} y={53} w={20} h={8} fill={P.bark} over={2.5} k={K} />
              <path d="M27.5 53 L40 45 L52.5 53" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" />
            </g>
          )}
          {tier >= 4 ? (
            <g>
              <path d="M5 46h12l-1.4 4h-9.2z" fill={P.woodMid} {...detail} />
              <path d="M6 46.6h10" stroke={P.water} strokeWidth="1.2" />
            </g>
          ) : null}
        </Svg>
      )
    case 'sennhuette':
      return (
        <Svg tier={tier} bold>
          <Shadow grid="chapter" rx={36} />
          <rect x="13" y="56" width="46" height="10" rx="1" fill={P.stone} {...line} />
          <path d="M20 56v10M30 56v10M42 56v10M52 56v10M13 61h46" stroke={P.outline} strokeWidth={H} opacity=".35" />
          <Logs x={15} y={40} w={42} h={16} />
          <GableRoof x={15} y={41} w={42} h={15} fill={P.stoneDark} over={6} k={K} />
          {[22, 36, 50].map((x) => (
            <circle key={x} cx={x} cy={34 + Math.abs(x - 36) * 0.22} r="1.8" fill={P.stone} {...detail} />
          ))}
          <Pane x={20} y={44} w={6.5} h={6} k={K} />
          <Pane x={46} y={44} w={6.5} h={6} k={K} />
          <ArchDoor x={32} y={56} w={8} h={11} k={K} />
          {tier >= 2 ? (
            <g>
              <rect x="47" y="23" width="4.4" height="9" fill={P.stone} {...detail} />
              <Smoke x={49} y={21} />
            </g>
          ) : null}
          {tier >= 3 && !winter ? (
            <g>
              <rect x="19" y="50.4" width="9" height="2" rx=".6" fill={P.woodMid} {...detail} />
              <rect x="45" y="50.4" width="9" height="2" rx=".6" fill={P.woodMid} {...detail} />
              {[21, 23.4, 25.8, 47, 49.4, 51.8].map((x) => (
                <circle key={x} cx={x} cy="49.6" r="1" fill={P.red} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              {[0, 1, 2].map((k) => (
                <rect key={k} x={61} y={62 - k * 3.2} width="14" height="3.2" rx="1.4" fill={P.woodLight} {...detail} />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M3 61h11" stroke={P.outline} strokeWidth="3.6" strokeLinecap="round" />
              <path d="M3 61h11" stroke={P.woodLight} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M5 62v4M12 62v4" stroke={P.outline} strokeWidth={D} />
            </g>
          ) : null}
          {winter ? <path d="M10 41 L36 26 L62 41" stroke={P.white} strokeWidth="2.4" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'edelweiss': {
      const n = Math.min(9, 2 + tier * 2)
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="63" rx="35" ry="5.4" fill={winter ? P.white : P.leafMoss} {...line} />
          <Rock x={4} y={64} w={30} h={18} snow={winter} />
          <Rock x={40} y={64} w={34} h={22} snow={winter} />
          {!winter
            ? Array.from({ length: n }, (_, i) => (
                <Edelweiss key={i} x={14 + ((i * 13) % 54)} y={48 + ((i * 7) % 12)} s={0.9 + (tier >= 4 ? 0.2 : 0)} />
              ))
            : null}
          {tier >= 3 ? (
            <g>
              <path d="M70 30v-8M66 26h8" stroke={P.outline} strokeWidth="2.6" strokeLinecap="round" />
              <path d="M70 30v-8M66 26h8" stroke={P.woodLight} strokeWidth="1.2" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <ellipse cx="22" cy="40" rx="4.2" ry="2.5" fill={P.woodMid} {...detail} />
              <circle cx="25" cy="38" r="1.7" fill={P.woodMid} {...detail} />
              <path d="M24.4 36.4l-1-1.6M26 36.6l.6-1.8" stroke={P.outline} strokeWidth={H} />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'enzian': {
      const n = Math.min(16, 4 + tier * 3)
      return (
        <Svg tier={tier} bold>
          <Slope c={grass} />
          {!winter
            ? Array.from({ length: n }, (_, i) => (spring || summer || i % 2 ? <Gentian key={i} x={10 + ((i * 13) % 62)} y={53 + ((i * 7) % 10)} /> : null))
            : null}
          {tier >= 3 ? <Rock x={54} y={62} w={16} h={8} snow={winter} /> : null}
          {tier >= 4 ? (
            <g>
              <Post x={16} y={50} h={14} w={1.6} k={K} />
              <rect x="10" y="32" width="12" height="6" rx="1" fill={P.paper} {...line} />
              <path d="M13 35h6" stroke={P.blue} strokeWidth="1.4" />
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={44} y={36} c={P.lamp} /> : null}
        </Svg>
      )
    }
    case 'bergbach': {
      const water = winter ? P.glass : P.water
      const path = 'M8 22 C24 34 18 46 38 52 S66 56 74 66'
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={grass} {...line} />
          <path d={path} stroke={P.outline} strokeWidth={10 + tier} fill="none" strokeLinecap="round" />
          <path d={path} stroke={water} strokeWidth={7 + tier} fill="none" strokeLinecap="round" />
          <path d={path} stroke={P.white} strokeWidth="1.4" fill="none" strokeDasharray="3 5" className="orchard-stream" opacity=".85" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <ellipse key={i} cx={12 + i * 11} cy={30 + i * 6 + (i % 2) * 4} rx="3.2" ry="2.1" fill={P.stone} {...detail} />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M28 54 Q38 46 48 54" stroke={P.outline} strokeWidth="4.4" fill="none" strokeLinecap="round" />
              <path d="M28 54 Q38 46 48 54" stroke={P.woodMid} strokeWidth="2.6" fill="none" strokeLinecap="round" />
              <path d="M30 50q8-6 16 0" stroke={P.outline} strokeWidth={D} fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g className="ha-wheel">
              <circle cx="66" cy="54" r="7" fill="none" stroke={P.outline} strokeWidth="3" />
              <circle cx="66" cy="54" r="7" fill="none" stroke={P.woodDark} strokeWidth="1.6" />
              <path d="M59 54h14M66 47v14M61 49l10 10M71 49l-10 10" stroke={P.woodDark} strokeWidth="1.2" />
            </g>
          ) : null}
          {tier >= 4 ? <Conifer x={66} y={38} s={0.55} snow={winter} /> : null}
        </Svg>
      )
    }
    case 'kaesekeller': {
      const wheels = Math.min(6, tier + 1)
      return (
        <Svg tier={tier} bold>
          <path d="M2 66 Q30 22 78 40 V66z" fill={grass} {...line} />
          <path d="M22 66V48a12 12 0 0 1 24 0v18z" fill={P.stone} {...line} />
          <path d="M24 50h20M23 57h22" stroke={P.outline} strokeWidth={H} opacity=".35" />
          <ArchDoor x={27} y={66} w={14} h={17} k={K} />
          {/* Reiferegal */}
          <Post x={51} y={66} h={16} w={2} k={K} />
          <Post x={73} y={66} h={16} w={2} k={K} />
          <rect x="49.6" y="52" width="25" height="2.2" rx=".6" fill={P.woodDark} {...detail} />
          <rect x="49.6" y="60" width="25" height="2.2" rx=".6" fill={P.woodDark} {...detail} />
          {Array.from({ length: wheels }, (_, i) => (
            <g key={i}>
              <ellipse cx={55 + (i % 3) * 7} cy={i < 3 ? 57.8 : 49.8} rx="3.2" ry="2.4" fill={P.gold} {...detail} />
              <path d={`M${52 + (i % 3) * 7} ${i < 3 ? 57.8 : 49.8}h6`} stroke={P.brass} strokeWidth={H} />
            </g>
          ))}
          {tier >= 4 ? <path d="M12 66h7l-1 -7h-5z" fill={P.stoneLight} {...detail} /> : null}
          {tier >= 3 ? <Lantern x={18} y={50} s={0.6} /> : null}
          {tier >= 5 ? (
            <g>
              <path d="M34 34v-7M30.4 30h7.2" stroke={P.outline} strokeWidth="2.4" strokeLinecap="round" />
              <path d="M34 34v-7M30.4 30h7.2" stroke={P.woodLight} strokeWidth="1" strokeLinecap="round" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'seilbahn': {
      const gondolas = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier} bold>
          <path d="M0 66 V58 Q34 46 58 22 Q68 12 80 12 V66z" fill={winter ? P.white : P.leafMoss} opacity=".55" />
          <path d="M8 58 L72 18" stroke={P.outline} strokeWidth="1" />
          <path d="M8 61 L72 21" stroke={P.outline} strokeWidth=".6" />
          {/* Stütze */}
          <path d="M36 64 L40 40 L44 64" stroke={P.outline} strokeWidth="2.6" fill="none" strokeLinejoin="round" />
          <path d="M36 64 L40 40 L44 64 M37 56h6M38 48h4" stroke={P.metal} strokeWidth="1.2" fill="none" />
          {Array.from({ length: gondolas }, (_, i) => {
            const t = 0.2 + i * 0.3
            const x = 8 + 64 * t
            const y = 58 - 40 * t
            return (
              <g key={i} className="ha-swim">
                <path d={`M${x} ${y}v4`} stroke={P.outline} strokeWidth=".8" />
                <rect x={x - 4.2} y={y + 4} width="8.4" height="6.4" rx="1.4" fill={[P.tomato, P.blue, P.yellow][i]} {...line} />
                <rect x={x - 3} y={y + 5} width="6" height="2.4" rx=".4" fill={P.window} />
              </g>
            )
          })}
          {/* Talstation */}
          <Wall x={1} y={56} w={15} h={10} fill={P.paper} k={K} />
          <GableRoof x={1} y={57} w={15} h={6} fill={P.barn} over={1.5} k={K} />
          {tier >= 4 ? (
            <g>
              <Wall x={63} y={14} w={15} h={10} fill={P.paper} k={K} />
              <GableRoof x={63} y={15} w={15} h={6} fill={P.barn} over={1.5} k={K} />
            </g>
          ) : null}
          {winter ? <path d="M0 57 L8.5 51 L17 57" stroke={P.white} strokeWidth="2" fill="none" strokeLinecap="round" /> : null}
          {tier >= 3 ? <Conifer x={24} y={66} s={0.5} snow={winter} /> : null}
        </Svg>
      )
    }
    case 'gipfelhuette':
      return (
        <Svg tier={tier} bold>
          <path d="M2 66 L30 16 L44 30 L52 22 L78 66z" fill={P.stoneDark} {...line} />
          <path d="M30 16 L22 30 L28 28 L32 32 L38 24z M52 22 L48 30 L54 28 L58 32z" fill={P.white} stroke={P.outline} strokeWidth={H} />
          <path d="M30 16L44 30L52 22L78 66H52z" fill={P.outline} opacity=".12" />
          {winter ? <path d="M10 52 L30 16 L52 22 L70 52" stroke={P.white} strokeWidth="3" fill="none" opacity=".8" strokeLinecap="round" /> : null}
          <Logs x={24} y={48} w={26} h={16} />
          <GableRoof x={24} y={49} w={26} h={9} fill={P.stoneDark} over={3} k={K} />
          <Pane x={27.5} y={52} w={6} h={5.6} k={K} />
          <ArchDoor x={39} y={64} w={7} h={10} k={K} />
          {tier >= 3 ? (
            <g>
              <path d="M30 16V3M25.6 7.4h8.8" stroke={P.outline} strokeWidth="2.8" strokeLinecap="round" />
              <path d="M30 16V3M25.6 7.4h8.8" stroke={P.woodLight} strokeWidth="1.3" strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 4 ? <Pennant x={56} y={48} s={0.8} /> : null}
          {tier >= 5 ? (
            <g>
              <circle cx="14" cy="58" r="1.8" fill={P.skin} {...detail} />
              <path d="M14 60v4.6M12 62h4" stroke={P.blue} strokeWidth="1.4" strokeLinecap="round" />
              <path d="M16.4 58l2 7" stroke={P.outline} strokeWidth={D} strokeLinecap="round" />
            </g>
          ) : null}
          {tier >= 2 ? <Rock x={60} y={66} w={10} h={5} /> : null}
          {winter ? <path d="M20.5 49 L37 40 L53.5 49" stroke={P.white} strokeWidth="2.2" fill="none" strokeLinecap="round" /> : null}
        </Svg>
      )
    case 'almfest':
      return (
        <Svg tier={tier} bold>
          <ellipse cx="40" cy="61" rx="36" ry="8.5" fill={grass} {...line} />
          {/* Tanzboden mit Dach */}
          <Post x={18} y={50} h={18} w={2.2} k={K} />
          <Post x={50} y={50} h={18} w={2.2} k={K} />
          <rect x="14" y="48" width="40" height="5.4" rx="1" fill={P.woodMid} {...line} />
          <path d="M12 33 L34 24 L56 33z" fill={P.woodDark} {...line} />
          <Bunting y={20} n={Math.min(9, 3 + tier)} />
          {tier >= 2 ? (
            <g fill={P.outline}>
              <circle cx="28" cy="44" r="1.7" />
              <rect x="27" y="45.4" width="2" height="3" />
              {tier >= 3 ? (
                <>
                  <circle cx="40" cy="44" r="1.7" />
                  <rect x="39" y="45.4" width="2" height="3" />
                </>
              ) : null}
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <rect x="4" y="59" width="16" height="2.4" rx=".6" fill={P.woodMid} {...detail} />
              <path d="M6 61.4v4M18 61.4v4" stroke={P.outline} strokeWidth={D} />
              {[7, 11, 15].map((x) => (
                <rect key={x} x={x} y="55.6" width="2.6" height="3.4" rx=".4" fill={P.lamp} {...detail} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <Barrel x={60} y={66} s={0.6} /> : null}
          {tier >= 4
            ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={8 + i * 16} cy={22 + (i % 2) * 3} r="1.8" fill={P.amber} stroke={P.outline} strokeWidth={H} />)
            : null}
          {tier >= 5 ? (
            <g>
              <path d="M70 66V26" stroke={P.outline} strokeWidth="3.2" strokeLinecap="round" />
              <path d="M70 66V26" stroke={P.cream} strokeWidth="1.8" strokeLinecap="round" />
              <path d="M66 36l8 2M66 42l8 2M66 48l8 2" stroke={P.blue} strokeWidth="1.2" />
              <path d="M70 26 q-4 4 0 8 q4 -4 0 -8" fill={P.leaf} {...detail} />
            </g>
          ) : null}
        </Svg>
      )
  }
  return null
}
