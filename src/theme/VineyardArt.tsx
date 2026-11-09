/**
 * Kapitel 3 — Weinberg: art for the ten areas (five growth tiers) and the
 * terraced backdrop with the river.
 */
import { memo } from 'react'
import { useSvgId } from './svgId'
import { moduleTier, sameTierProps } from './tiers'
import type { Season } from './ambient'

const GRAPE: Record<string, string> = {
  riesling: '#c9d36a',
  silvaner: '#a9c46a',
  spaetburgunder: '#5b2a4a',
  dornfelder: '#3a1838',
}

function Vines({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const rows = Math.min(4, 1 + Math.floor(tier / 1.5))
  const grape = GRAPE[id] ?? '#5b2a4a'
  const leaf = season === 'autumn' ? '#d29a2c' : season === 'winter' ? '#8a7a5a' : '#5f9e45'
  const bunches = season === 'winter' || season === 'spring' ? 0 : Math.min(4, tier)
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="64" rx="30" ry="5" fill="rgba(40,60,20,0.22)" />
      {Array.from({ length: rows }, (_, r) => {
        const y = 58 - r * 10
        const x0 = 10 + r * 3
        const x1 = 70 - r * 3
        return (
          <g key={r}>
            <path d={`M${x0} ${y}H${x1}`} stroke="#8a6a40" strokeWidth="0.8" />
            {[x0, (x0 + x1) / 2, x1].map((x) => (
              <path key={x} d={`M${x} ${y + 4}V${y - 8}`} stroke="#6e4a2b" strokeWidth="1.4" />
            ))}
            {Array.from({ length: 6 }, (_, i) => (
              <ellipse key={i} cx={x0 + 4 + i * ((x1 - x0 - 8) / 5)} cy={y - 4} rx="4.2" ry="3.2" fill={leaf} opacity={0.95} />
            ))}
            {Array.from({ length: bunches }, (_, i) => (
              <g key={`b${i}`} transform={`translate(${x0 + 8 + i * ((x1 - x0 - 16) / 3)} ${y - 1})`}>
                {[[0, 0], [2, 0], [1, 1.8], [-1, 1.8], [1, 3.4]].map(([dx, dy], k) => (
                  <circle key={k} cx={dx} cy={dy} r="1.3" fill={grape} />
                ))}
              </g>
            ))}
            {season === 'winter' ? <path d={`M${x0} ${y - 7}H${x1}`} stroke="#fff" strokeWidth="1.4" opacity="0.8" /> : null}
          </g>
        )
      })}
    </svg>
  )
}

function Trockenmauer({ tier }: { tier: number }) {
  const layers = Math.min(4, 1 + Math.floor(tier / 1.3))
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="64" rx="32" ry="4" fill="rgba(40,60,20,0.22)" />
      {Array.from({ length: layers }, (_, r) =>
        Array.from({ length: 7 }, (_, i) => (
          <rect
            key={`${r}-${i}`}
            x={8 + i * 9.4 + (r % 2) * 4}
            y={56 - r * 7}
            width="9"
            height="6.4"
            rx="2"
            fill={['#b8ab94', '#a69a84', '#c4b8a0'][(i + r) % 3]}
            stroke="#7a6e5a"
            strokeWidth="0.6"
          />
        )),
      )}
      {tier >= 2 ? (
        <g className="lizard">
          <path d="M44 46c4-1 8 0 12 2l4-1-3 2c2 1 2 2 0 2-5-1-9-2-13-2z" fill="#6aa04a" />
          <circle cx="58" cy="47.4" r=".6" fill="#1f2a14" />
        </g>
      ) : null}
      {tier >= 4 ? (
        <g>
          {[14, 22, 66].map((x) => (
            <circle key={x} cx={x} cy={58 - layers * 7} r="2" fill="#c77dd1" />
          ))}
        </g>
      ) : null}
    </svg>
  )
}

function House({ tier, kind }: { tier: number; kind: 'wingerthaus' | 'kelter' | 'weinkeller' | 'strausse' }) {
  const roof = kind === 'wingerthaus' ? '#a5531a' : kind === 'strausse' ? '#b8403a' : '#7a5a3a'
  const wall = kind === 'weinkeller' ? '#c9b48a' : '#efe1c2'
  const w = kind === 'wingerthaus' ? 26 : 40
  const x = 40 - w / 2
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="64" rx={w / 2 + 12} ry="4" fill="rgba(40,60,20,0.22)" />
      {kind === 'weinkeller' ? (
        <g>
          <path d="M6 64Q40 10 74 64z" fill="#7fae58" />
          <path d="M28 64V48a12 12 0 0 1 24 0v16z" fill="#c9b48a" stroke="#7a6e5a" strokeWidth="1" />
          <path d="M32 64V50a8 8 0 0 1 16 0v14z" fill="#5a3d22" />
        </g>
      ) : (
        <g>
          <path d={`M${x - 3} 36L40 ${18}L${x + w + 3} 36z`} fill={roof} />
          <rect x={x} y="36" width={w} height="28" fill={wall} stroke="#8a6a40" strokeWidth="1" />
          <rect x="35" y="48" width="10" height="16" fill="#7a5532" />
          {tier >= 2 ? <rect x={x + 4} y="42" width="7" height="6" fill="#8fd0ec" stroke="#8a6a40" strokeWidth=".6" /> : null}
        </g>
      )}
      {kind === 'kelter' && tier >= 2 ? (
        <g>
          <rect x="60" y="48" width="12" height="14" rx="2" fill="#a5733f" stroke="#6e4a2b" strokeWidth="1" />
          <path d="M66 48V36M60 36h12" stroke="#4a3a2a" strokeWidth="2" />
        </g>
      ) : null}
      {kind === 'weinkeller'
        ? Array.from({ length: Math.min(4, tier) }, (_, i) => (
            <g key={i}>
              <ellipse cx={10 + i * 8 + (i > 1 ? 44 : 0)} cy="60" rx="4" ry="4.6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".8" />
              <path d={`M${6 + i * 8 + (i > 1 ? 44 : 0)} 58h8M${6 + i * 8 + (i > 1 ? 44 : 0)} 62h8`} stroke="#6e4a2b" strokeWidth=".7" />
            </g>
          ))
        : null}
      {kind === 'strausse' ? (
        <g>
          <path d="M40 30v-8" stroke="#6e4a2b" strokeWidth="1.2" />
          <path d="M36 22l4-8 4 8z" fill="#c9a46b" />
          {tier >= 2 ? <rect x="6" y="56" width="14" height="3" fill="#a5733f" /> : null}
          {tier >= 3 ? <rect x="60" y="56" width="14" height="3" fill="#a5733f" /> : null}
          {tier >= 4 ? <path d="M4 40Q40 52 76 40" stroke="#f5c542" strokeWidth="1" strokeDasharray="1 3" fill="none" /> : null}
        </g>
      ) : null}
      {kind === 'wingerthaus' && tier >= 3 ? <circle cx="62" cy="58" r="5" fill="#5f9e45" /> : null}
    </svg>
  )
}

function Weinfest({ tier }: { tier: number }) {
  const colors = ['#e2453c', '#f5c542', '#3d8db8', '#7fbf5a']
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="64" rx="34" ry="5" fill="rgba(40,60,20,0.22)" />
      <path d="M8 30h64v6H8z" fill="#8a6a40" />
      <path d="M10 36v28M70 36v28" stroke="#6e4a2b" strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => (
        <path key={i} d={`M${10 + i * 8} 36l4 6 4-6z`} fill={colors[i % 4]} />
      ))}
      {Array.from({ length: Math.min(3, tier) }, (_, i) => (
        <g key={i}>
          <rect x={16 + i * 18} y="54" width="14" height="3" fill="#a5733f" />
          <rect x={18 + i * 18} y="48" width="10" height="2.4" fill="#c9a46b" />
          <path d={`M${21 + i * 18} 46v2`} stroke="#5b2a4a" strokeWidth="2" />
        </g>
      ))}
      {tier >= 4
        ? [14, 30, 46, 62].map((x, i) => (
            <circle key={x} className="fest-twinkle" cx={x} cy="28" r="1.6" fill="#fff3b0" style={{ animationDelay: `${i * 0.3}s` }} />
          ))
        : null}
    </svg>
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
    case 'kelter':
    case 'weinkeller':
    case 'strausse':
      return <House tier={tier} kind={id} />
    case 'weinfest':
      return <Weinfest tier={tier} />
    default:
      return <Vines id={id} tier={tier} season={season} />
  }
}, sameTierProps)

/** Unplanted terrace spot: stakes, waiting for vines. */
export function VineyardStakes() {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="62" rx="26" ry="5" fill="#8a6a40" opacity="0.45" />
      {[18, 32, 46, 60].map((x) => (
        <path key={x} d={`M${x} 64V44`} stroke="#8a6a40" strokeWidth="2" />
      ))}
      <path d="M18 48H60" stroke="#a69a84" strokeWidth=".8" />
      <path d="M32 58c-4-2-5-6-3-8 3 1 4 4 3 8zM46 58c4-2 5-6 3-8-3 1-4 4-3 8z" fill="#7fbf5a" />
    </svg>
  )
}

/** Overgrown terrace (locked): brambles over a broken wall. */
export function VineyardWild({ seed = 0 }: { seed?: number }) {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      {Array.from({ length: 6 }, (_, i) => (
        <rect key={i} x={10 + i * 10} y={56 + ((i + seed) % 2) * 2} width="9" height="6" rx="2" fill="#a69a84" stroke="#7a6e5a" strokeWidth=".6" />
      ))}
      <ellipse cx="30" cy="50" rx="14" ry="9" fill="#5f7a3a" />
      <ellipse cx="52" cy="52" rx="12" ry="8" fill="#4f6a30" />
      {[24, 30, 50, 56].map((x) => (
        <circle key={x} cx={x} cy={48 + (x % 3)} r="1.4" fill="#3a1838" />
      ))}
    </svg>
  )
}

export const VineyardBackdrop = memo(function VineyardBackdrop({ stage }: { stage: number }) {
  const slope = useSvgId('vg-slope')
  return (
    <div className="garden-ground vineyard-ground" aria-hidden="true" data-stage={stage}>
      <svg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
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
            <path d={`M0 ${y} Q50 ${y - 3} 100 ${y}`} stroke="#a69a84" strokeWidth="5" fill="none" vectorEffect="non-scaling-stroke" opacity="0.8" />
            <path d={`M0 ${y + 0.8} Q50 ${y - 2.2} 100 ${y + 0.8}`} stroke="#7a6e5a" strokeWidth="1.2" fill="none" vectorEffect="non-scaling-stroke" opacity={0.4 + i * 0.05} />
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
        <path d="M0 97 Q30 93 60 97 T100 95 V100 H0z" fill="#6aa6c9" />
        <path d="M0 98 Q30 95 60 98 T100 97" stroke="#a9d6ee" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" className="orchard-stream" strokeDasharray="4 6" />
      </svg>
      <div className="garden-hedge orchard-hills">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" focusable="false">
          <path d="M0 60 V22 Q60 2 140 18 T280 10 T400 16 V60z" fill="#8a9a5a" />
          <path d="M0 60 V40 Q90 22 180 36 T400 30 V60z" fill="#7a8a4c" />
          <path d="M300 30 h14 v-10 l7 -6 l7 6 v10 h4 v12 h-32z" fill="#efe1c2" />
          <path d="M318 14 v-6" stroke="#6e4a2b" strokeWidth="2" />
        </svg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})
