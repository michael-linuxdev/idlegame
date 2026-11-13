/** Freie Plätze im kräftigen Stil (Kapitel-Raster 80×72): Bauplatz für Gebäude, abgesteckte Weide. */
import { ArtSvg } from '../../ArtSvg'
import { P } from '../palette'
import { boldDetail, BOLD } from '../parts/style'

const K = 0.85
const detail = boldDetail(K)
const H = BOLD.hair * K

function Peg({ x, y, h = 9 }: { x: number; y: number; h?: number }) {
  return <rect x={x - 1.4} y={y - h} width="2.8" height={h} rx=".7" fill={P.woodLight} {...detail} />
}

/** Bauplatz: abgestecktes Rechteck mit Richtschnur, Bretterstapel und Feldsteinen fürs Fundament. */
export function BuildSite() {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="61" rx="30" ry="8" fill={P.soil} opacity="0.5" />
      <path d="M17 62 L26 50 H56 L65 62 Z" fill={P.soil} opacity="0.55" {...detail} strokeDasharray="3 2.4" />
      {/* Richtschnur */}
      <path d="M26 45 H56 M17 56 L26 45 M65 56 L56 45" fill="none" stroke={P.outline} strokeWidth={H * 2.6} strokeLinecap="round" />
      <path d="M26 45 H56 M17 56 L26 45 M65 56 L56 45" fill="none" stroke={P.cream} strokeWidth={H * 1.1} strokeLinecap="round" />
      <Peg x={26} y={51} />
      <Peg x={56} y={51} />
      {/* Feldsteine */}
      <ellipse cx="31" cy="58.4" rx="4.2" ry="2.8" fill={P.stoneLight} {...detail} />
      <ellipse cx="37.6" cy="60" rx="3.2" ry="2.3" fill={P.stone} {...detail} />
      {/* Bretterstapel */}
      <rect x="43" y="59.4" width="19" height="3.6" rx=".8" fill={P.wood} {...detail} />
      <rect x="44.6" y="56" width="19" height="3.6" rx=".8" fill={P.woodLight} {...detail} />
      <rect x="42.4" y="52.6" width="18" height="3.6" rx=".8" fill={P.wood} {...detail} />
      <Peg x={17} y={63} h={10} />
      <Peg x={65} y={63} h={10} />
    </ArtSvg>
  )
}

/** Abgesteckte Weide: erste Zaunpfosten mit einer Latte, daneben Heu und eine Drahtrolle. */
export function PastureSite() {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="60" rx="32" ry="8" fill={P.leafLight} opacity="0.6" />
      <path d="M14 50 H44" fill="none" stroke={P.outline} strokeWidth="2.9" strokeLinecap="round" />
      <path d="M14 50 H44" fill="none" stroke={P.woodLight} strokeWidth="1.3" strokeLinecap="round" />
      <rect x="12.5" y="44" width="3" height="18" rx=".8" fill={P.woodMid} {...detail} />
      <rect x="42.5" y="44" width="3" height="18" rx=".8" fill={P.woodMid} {...detail} />
      {/* noch lose Pfosten */}
      <rect x="50" y="59" width="17" height="3" rx=".8" fill={P.woodMid} transform="rotate(-8 58 60)" {...detail} />
      <rect x="52" y="62.4" width="17" height="3" rx=".8" fill={P.woodLight} transform="rotate(5 60 64)" {...detail} />
      {/* Heuhaufen */}
      <path d="M21 63 q1 -9 8 -9.6 q7 .6 8 9.6 z" fill={P.gold} {...detail} />
      <path d="M25.6 61 l1.6 -4.6 M30 61.4 l.4 -5 M33.4 61 l-1.2 -4" stroke={P.outline} strokeWidth={H} strokeLinecap="round" opacity=".5" />
    </ArtSvg>
  )
}

/** Pfahl fürs Wildbienenhotel mit zugeschnittenen, vorgebohrten Holzklötzen. */
export function PostSite() {
  return (
    <ArtSvg viewBox="0 0 80 72">
      <ellipse cx="40" cy="62" rx="20" ry="5.6" fill={P.soil} opacity="0.5" />
      <rect x="37.6" y="40" width="4.8" height="24" rx="1" fill={P.bark} {...detail} />
      <rect x="33" y="38" width="14" height="3.2" rx=".8" fill={P.woodLight} {...detail} />
      {[[50, 58], [53, 52], [57, 59]].map(([x, y], i) => (
        <g key={i}>
          <rect x={x} y={y} width="7" height="6" rx=".8" fill={P.woodLight} {...detail} />
          <circle cx={x! + 2.3} cy={y! + 3} r=".9" fill={P.outline} />
          <circle cx={x! + 4.9} cy={y! + 3} r=".9" fill={P.outline} />
        </g>
      ))}
      <path d="M24 64 l1.2 -4 l1.4 2.8 l1 -4.8 l1.4 4.8 l1.2 -2.8 l1 4 z" fill={P.leafLight} stroke={P.outline} strokeWidth={H} strokeLinejoin="round" />
    </ArtSvg>
  )
}
