import { memo } from 'react'
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

export const WildPlot = memo(function WildPlot({ variant }: { variant: number }) {
  const v = ((variant % 3) + 3) % 3
  return (
    <svg className="plot-art plot-wild" viewBox={VIEWBOX} focusable="false" aria-hidden="true">
      <Shadow />
      {v === 0 ? <Brambles /> : v === 1 ? <NettlesAndJunk /> : <OvergrownHeap />}
    </svg>
  )
})

/** Cleared & raked — the spot waits for its first planting. */
export const ClearedPlot = memo(function ClearedPlot() {
  return (
    <svg className="plot-art plot-cleared" viewBox={VIEWBOX} focusable="false" aria-hidden="true">
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
    </svg>
  )
})
