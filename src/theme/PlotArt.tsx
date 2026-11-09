import { memo, type ReactNode } from 'react'
import type { GeneratorId } from '../game/generators'
import { ArtSvg } from './ArtSvg'
/**
 * Plot states before a module exists:
 *  - WildPlot: overgrown corner (brambles / nettles / junk) — locked.
 *  - ClearedPlot: freshly cleared and raked soil with string lines — ready
 *    to anlegen (unlocked, level 0).
 * All art shares the 100×86 plot viewBox used by ModuleArt.
 */

const VIEWBOX = '0 0 100 86'

function Shadow() {
  return <ellipse cx="50" cy="76" rx="40" ry="7" fill="var(--g-shadow)" />
}

/*
 * Wildnis bleibt flach und gedeckt: niedrige Silhouette (Oberkante ≈ y 50),
 * dünne Umrisse (1–1,2) und entsättigte Farben — gebaute Bereiche sollen
 * daneben immer kräftiger wirken.
 */
const W_OUT = '#5a6b48'
const W_LEAF = '#7f9466'
const W_LEAF_L = '#93a679'
const W_STEM = '#8e7a60'
const W_BERRY = '#6e5872'

function Brambles() {
  return (
    <g>
      <path
        d="M18 75 C14 67 22 60 32 63 C36 55 50 54 55 60 C64 54 78 58 78 65 C85 67 85 74 80 75 Z"
        fill={W_LEAF}
        stroke={W_OUT}
        strokeWidth="1.2"
      />
      <path
        d="M24 70 C29 64 34 63 38 67 C43 60 50 60 54 65 C60 61 68 62 72 68"
        fill="none"
        stroke={W_STEM}
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path d="M30 65 l-2 -3 M46 60 l1 -3 M64 62 l2 -3 M74 67 l3 -1" stroke={W_STEM} strokeWidth="1" strokeLinecap="round" />
      {[
        [34, 68],
        [48, 64],
        [60, 68],
        [70, 66],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.8" fill={W_BERRY} />
      ))}
    </g>
  )
}

function NettlesAndJunk() {
  return (
    <g>
      {/* old tyre */}
      <ellipse cx="66" cy="70" rx="13" ry="5.4" fill="#5a5a55" stroke="#3f3f3b" strokeWidth="1.1" />
      <ellipse cx="66" cy="69" rx="6.4" ry="2.2" fill={W_LEAF} />
      {/* nettles */}
      {[16, 25, 34, 43].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 75 L${x + 1} ${56 + (i % 2) * 5}`} stroke={W_OUT} strokeWidth="1.1" />
          {[0, 1].map((k) => (
            <g key={k}>
              <path d={`M${x + 1} ${61 + k * 6 + (i % 2) * 3} l-6 -3 l3 4 Z`} fill={W_LEAF} stroke={W_OUT} strokeWidth="0.8" />
              <path d={`M${x + 1} ${59 + k * 6 + (i % 2) * 3} l6 -3 l-3 4 Z`} fill={W_LEAF_L} stroke={W_OUT} strokeWidth="0.8" />
            </g>
          ))}
        </g>
      ))}
      {/* broken crate */}
      <g transform="rotate(-10 76 58)">
        <rect x="68" y="52" width="18" height="11" fill="#a89276" stroke="#6e5c45" strokeWidth="1.1" />
        <path d="M68 56 H86 M68 60 H82" stroke="#6e5c45" strokeWidth="0.9" />
      </g>
      <path d="M10 75 Q30 70 50 74 T90 74" stroke={W_LEAF} strokeWidth="3" fill="none" strokeLinecap="round" />
    </g>
  )
}

function OvergrownHeap() {
  return (
    <g>
      {/* rubble + leaves heap */}
      <path d="M22 75 C26 66 36 62 50 63 C64 62 75 67 78 75 Z" fill="#a39678" stroke="#76694f" strokeWidth="1.2" />
      <circle cx="36" cy="70" r="3.8" fill="#bdb39f" stroke="#857b66" strokeWidth="0.9" />
      <circle cx="61" cy="68" r="4.2" fill="#c4bba8" stroke="#857b66" strokeWidth="0.9" />
      <rect x="43" y="68" width="11" height="4" rx="1" fill="#b07a62" stroke="#7e5646" strokeWidth="0.8" transform="rotate(14 48 68)" />
      {/* weeds sprouting */}
      <path d="M24 64 C23 56 27 52 30 50 M74 63 C75 56 72 52 69 49 M50 58 C49 52 52 49 55 47" stroke={W_OUT} strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="50" rx="4" ry="2.2" fill={W_LEAF_L} transform="rotate(-30 30 50)" />
      <ellipse cx="69" cy="49" rx="4" ry="2.2" fill={W_LEAF_L} transform="rotate(30 69 49)" />
      <ellipse cx="55" cy="47" rx="3.4" ry="2" fill={W_LEAF} transform="rotate(20 55 47)" />
      <circle cx="22" cy="60" r="2" fill="#ece9da" />
      <circle cx="80" cy="62" r="2" fill="#ece9da" />
    </g>
  )
}

/** Laub- und Schnittguthaufen mit kaputter Palette (später Kompost/Hofladen). */
function LeafPile() {
  return (
    <g>
      <g transform="rotate(-6 34 66)">
        <rect x="16" y="62" width="30" height="5" rx="1" fill="#a89276" stroke="#6e5c45" strokeWidth="1" />
        <rect x="16" y="69" width="30" height="4" rx="1" fill="#a89276" stroke="#6e5c45" strokeWidth="1" />
        <path d="M22 62 V73 M40 62 V73" stroke="#6e5c45" strokeWidth="1" />
      </g>
      <path d="M40 75 C42 66 52 61 62 62 C72 61 82 67 84 75 Z" fill="#9b8a63" stroke="#6f6249" strokeWidth="1.1" />
      {[
        [50, 66, -20, '#b59a5c'],
        [60, 64, 15, '#a3794f'],
        [70, 67, -35, '#b08a48'],
        [56, 70, 40, '#8f9a63'],
        [76, 71, 10, '#a3794f'],
      ].map(([x, y, r, c], i) => (
        <ellipse key={i} cx={x} cy={y} rx="3.4" ry="1.6" fill={c as string} transform={`rotate(${r} ${x} ${y})`} />
      ))}
      <path d="M58 62 l-4 -6 M66 62 l3 -7 M62 62 l0 -5" stroke={W_STEM} strokeWidth="1" strokeLinecap="round" />
    </g>
  )
}

/** Hohes Gras mit Fallobst und altem Baumstumpf (später Obstwiese). */
function FallenFruit() {
  return (
    <g>
      <ellipse cx="50" cy="72" rx="32" ry="5" fill={W_LEAF} opacity="0.8" />
      <path d="M58 74 V62 C58 59 72 59 72 62 V74 Z" fill="#9a8466" stroke="#6e5c45" strokeWidth="1.1" />
      <ellipse cx="65" cy="62" rx="7" ry="2.4" fill="#c2ab86" stroke="#6e5c45" strokeWidth="1" />
      <path d="M62 62 a3 1 0 0 0 6 0" fill="none" stroke="#9a8466" strokeWidth="0.8" />
      {[22, 28, 34, 40, 46, 76, 82].map((x, i) => (
        <path key={x} d={`M${x} 74 q${i % 2 ? 2 : -2} -6 ${i % 2 ? 1 : -1} -${10 + (i % 3) * 2}`} stroke={W_OUT} strokeWidth="1" fill="none" />
      ))}
      {[
        [30, 72],
        [44, 73],
        [52, 71],
        [80, 73],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2" fill={i % 2 ? '#b98c55' : '#b0695a'} stroke="#7a4f40" strokeWidth="0.6" />
      ))}
    </g>
  )
}

/** Kaputter Frühbeet-Rahmen mit Scherben (später Gewächshaus). */
function BrokenFrame() {
  return (
    <g>
      <path d="M18 74 L18 62 L70 58 L70 74 Z" fill="#a89276" stroke="#6e5c45" strokeWidth="1.1" />
      <path d="M18 62 L44 60 L40 52 L22 54 Z" fill="rgba(214,232,236,0.45)" stroke="#c9d6d8" strokeWidth="1" />
      <path d="M44 60 L70 58 L58 50 Z" fill="none" stroke="#c9d6d8" strokeWidth="1" />
      <path d="M50 57 l5 -4 M60 56 l-3 -3" stroke="#c9d6d8" strokeWidth="0.8" />
      {/* Scherben */}
      <path d="M74 72 l4 -2 l1 3 Z M80 74 l3 -1 l-1 2 Z" fill="rgba(214,232,236,0.7)" stroke="#a8b6b8" strokeWidth="0.6" />
      {[28, 38, 48, 60].map((x, i) => (
        <path key={x} d={`M${x} 64 q${i % 2 ? 3 : -3} -6 ${i % 2 ? 1 : -1} -${8 + (i % 2) * 3}`} stroke={W_OUT} strokeWidth="1.1" fill="none" />
      ))}
      <ellipse cx="30" cy="58" rx="3" ry="1.6" fill={W_LEAF_L} transform="rotate(-25 30 58)" />
      <ellipse cx="50" cy="55" rx="3" ry="1.6" fill={W_LEAF} transform="rotate(20 50 55)" />
    </g>
  )
}

type WildKind = 'brambles' | 'nettles' | 'heap' | 'leaves' | 'fruit' | 'frame'

const WILD_ART: Record<WildKind, () => ReactNode> = {
  brambles: Brambles,
  nettles: NettlesAndJunk,
  heap: OvergrownHeap,
  leaves: LeafPile,
  fruit: FallenFruit,
  frame: BrokenFrame,
}

/**
 * Jede Ecke zeigt, was dort einmal entsteht: Fallobst unter der künftigen
 * Obstwiese, ein kaputter Rahmen beim Gewächshaus … Spiegelung und kleine
 * Versätze sorgen dafür, dass gleiche Arten nicht gleich aussehen.
 */
const WILD_FOR: Record<GeneratorId, { kind: WildKind; flip?: boolean; dx?: number; extra?: 'pot' | 'board' | 'flowers' }> = {
  gemuesebeet: { kind: 'brambles', extra: 'board' },
  kompost: { kind: 'leaves' },
  kraeuterspirale: { kind: 'heap' },
  beerenhecke: { kind: 'brambles', flip: true, dx: 3 },
  obstwiese: { kind: 'fruit' },
  bienenstock: { kind: 'nettles', flip: true, extra: 'flowers' },
  huehnerstall: { kind: 'nettles', dx: -2 },
  gewaechshaus: { kind: 'frame' },
  hofladen: { kind: 'leaves', flip: true, dx: 2 },
  orangerie: { kind: 'heap', flip: true, extra: 'pot' },
}

function WildExtra({ kind }: { kind: 'pot' | 'board' | 'flowers' }) {
  if (kind === 'pot') {
    // zerbrochener Terrakotta-Topf
    return (
      <g>
        <path d="M76 74 L74 66 H86 L84 74 Z" fill="#b8836a" stroke="#7e5646" strokeWidth="0.9" />
        <path d="M80 66 L82 70 L78 71" fill="none" stroke="#7e5646" strokeWidth="0.8" />
        <path d="M88 74 l3 -3 l2 3 Z" fill="#b8836a" stroke="#7e5646" strokeWidth="0.7" />
      </g>
    )
  }
  if (kind === 'board') {
    return (
      <g transform="rotate(8 22 70)">
        <rect x="8" y="68" width="22" height="4" rx="1" fill="#a89276" stroke="#6e5c45" strokeWidth="0.9" />
      </g>
    )
  }
  return (
    <g>
      {[
        [14, 66, '#b8a7c9'],
        [20, 62, '#d6d0b4'],
        [86, 64, '#b8a7c9'],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <path d={`M${x} ${(y as number) + 2} V74`} stroke={W_OUT} strokeWidth="0.9" />
          <circle cx={x as number} cy={y as number} r="2" fill={c as string} />
        </g>
      ))}
    </g>
  )
}

export const WildPlot = memo(function WildPlot({ id }: { id: GeneratorId }) {
  const spec = WILD_FOR[id]
  const Art = WILD_ART[spec.kind]
  const dx = spec.dx ?? 0
  const t = spec.flip ? `translate(${100 + dx} 0) scale(-1 1)` : dx ? `translate(${dx} 0)` : undefined
  return (
    <ArtSvg className="plot-art plot-wild" viewBox={VIEWBOX} data-wild={spec.kind}>
      <Shadow />
      <g transform={t}>
        <Art />
      </g>
      {spec.extra ? <WildExtra kind={spec.extra} /> : null}
    </ArtSvg>
  )
})

/** Cleared & raked — the spot waits for its first planting. */
export const ClearedPlot = memo(function ClearedPlot() {
  return (
    <ArtSvg className="plot-art plot-cleared" viewBox={VIEWBOX}>
      <Shadow />
      <path
        d="M10 70 L22 40 L78 40 L90 70 Z"
        fill="#8a5a3b"
        stroke="#5e3b25"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d={`M${16 + i * 2} ${46 + i * 5.5} L${84 - i * 2} ${46 + i * 5.5}`}
          stroke="#6e4630"
          strokeWidth="1.6"
          strokeDasharray="5 3"
        />
      ))}
      {/* string line + stakes */}
      <rect x="18" y="30" width="3" height="16" rx="1" fill="#c9a46b" />
      <rect x="79" y="30" width="3" height="16" rx="1" fill="#c9a46b" />
      <path d="M19.5 33 Q50 37 80.5 33" stroke="#f2f0e0" strokeWidth="1.2" fill="none" />
      {/* seed bag */}
      <g transform="translate(58 46)">
        <path d="M0 4 L14 4 L13 20 L1 20 Z" fill="#e9dcc2" stroke="#8a7350" strokeWidth="1.2" />
        <rect x="3" y="9" width="8" height="6" rx="1" fill="#7bb35a" />
      </g>
      {/* rake */}
      <path d="M28 64 L44 34" stroke="#a77d4c" strokeWidth="2.6" strokeLinecap="round" />
      <path d="M38 30 L50 38" stroke="#6b6f73" strokeWidth="2.6" strokeLinecap="round" />
    </ArtSvg>
  )
})
