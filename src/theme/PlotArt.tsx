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
  return <ellipse cx="50" cy="76" rx="44" ry="9" fill="var(--g-shadow)" />
}

function Brambles() {
  return (
    <g>
      <path
        d="M8 74 C2 54 16 38 30 44 C32 26 54 22 60 36 C72 26 92 36 88 54 C98 60 94 76 84 76 Z"
        fill="#4d6b33"
        stroke="#2f4420"
        strokeWidth="2"
      />
      <path
        d="M16 64 C22 50 30 48 36 56 C42 40 52 40 56 52 C62 44 74 46 78 60"
        fill="none"
        stroke="#7a5a3a"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M24 52 l-3 -4 M44 44 l1 -5 M66 48 l3 -4 M80 58 l4 -2 M34 60 l-4 -1"
        stroke="#7a5a3a"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path d="M40 50 C46 44 52 46 54 52" fill="none" stroke="#3a5527" strokeWidth="5" strokeLinecap="round" />
      {[
        [30, 56],
        [48, 50],
        [62, 58],
        [72, 52],
        [40, 64],
      ].map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="2.6" fill="#3d1d45" />
          <circle cx={x + 2.4} cy={y + 1.4} r="2.2" fill="#5b2a5e" />
        </g>
      ))}
    </g>
  )
}

function NettlesAndJunk() {
  return (
    <g>
      {/* old tyre */}
      <ellipse cx="66" cy="66" rx="16" ry="8" fill="#2f2f2f" stroke="#1a1a1a" strokeWidth="1.6" />
      <ellipse cx="66" cy="64" rx="8" ry="3.4" fill="#5c7a3a" />
      {/* nettles */}
      {[14, 24, 34, 44].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 74 L${x + 1} ${40 + (i % 2) * 8}`} stroke="#4f6b2c" strokeWidth="2.2" />
          {[0, 1, 2].map((k) => (
            <g key={k}>
              <path
                d={`M${x + 1} ${48 + k * 8 + (i % 2) * 4} l-9 -4 l4 6 Z`}
                fill="#6f8f3a"
                stroke="#3f5622"
                strokeWidth="1"
              />
              <path
                d={`M${x + 1} ${46 + k * 8 + (i % 2) * 4} l9 -4 l-4 6 Z`}
                fill="#7d9c44"
                stroke="#3f5622"
                strokeWidth="1"
              />
            </g>
          ))}
        </g>
      ))}
      {/* broken crate */}
      <g transform="rotate(-12 74 46)">
        <rect x="62" y="34" width="24" height="18" fill="#a77d4c" stroke="#5e4123" strokeWidth="1.6" />
        <path d="M62 40 H86 M62 46 H80" stroke="#5e4123" strokeWidth="1.2" />
      </g>
      <path d="M8 74 Q30 66 50 72 T92 72" stroke="#5c7a3a" strokeWidth="5" fill="none" strokeLinecap="round" />
    </g>
  )
}

function OvergrownHeap() {
  return (
    <g>
      {/* rubble + leaves heap */}
      <path d="M10 74 C14 54 30 44 50 46 C70 44 88 56 90 74 Z" fill="#8c7a5c" stroke="#5b4c36" strokeWidth="2" />
      <circle cx="30" cy="62" r="6" fill="#a99c86" stroke="#6f6553" strokeWidth="1.2" />
      <circle cx="62" cy="58" r="7" fill="#b3a68f" stroke="#6f6553" strokeWidth="1.2" />
      <rect x="40" y="60" width="16" height="6" rx="1" fill="#b55a3c" stroke="#6e2f22" strokeWidth="1" transform="rotate(14 48 63)" />
      {/* weeds sprouting */}
      <path d="M20 56 C18 40 26 34 30 30 M74 54 C76 40 70 34 66 28 M50 48 C48 36 54 30 58 26" stroke="#4f7a2e" strokeWidth="3" fill="none" strokeLinecap="round" />
      <ellipse cx="30" cy="30" rx="6" ry="3.4" fill="#6f9a3a" transform="rotate(-30 30 30)" />
      <ellipse cx="66" cy="28" rx="6" ry="3.4" fill="#6f9a3a" transform="rotate(30 66 28)" />
      <ellipse cx="58" cy="26" rx="5" ry="3" fill="#86b04a" transform="rotate(20 58 26)" />
      <circle cx="22" cy="44" r="3" fill="#f2f0e0" />
      <circle cx="22" cy="44" r="1.2" fill="#f5c542" />
      <circle cx="78" cy="46" r="3" fill="#f2f0e0" />
      <circle cx="78" cy="46" r="1.2" fill="#f5c542" />
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
