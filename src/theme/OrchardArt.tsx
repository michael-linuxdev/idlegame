/**
 * Streuobstwiese — art for the ten orchard areas with five growth tiers
 * (same thresholds as the garden: 1 / 10 / 25 / 50 / 100).
 */
import { memo } from 'react'
import type { OrchardId } from '../game/orchard'
import { moduleTier } from './tiers'

const FRUIT: Partial<Record<OrchardId, { fruit: string; crown: string; crownD: string; r: number }>> = {
  apfel: { fruit: '#d9483b', crown: '#6ca848', crownD: '#4f8a34', r: 1.9 },
  birne: { fruit: '#d8c84a', crown: '#5f9e45', crownD: '#477e32', r: 1.9 },
  kirsche: { fruit: '#9e1f2c', crown: '#79b452', crownD: '#5a913a', r: 1.3 },
  zwetschge: { fruit: '#5b3a78', crown: '#65a04a', crownD: '#4b8034', r: 1.6 },
  walnuss: { fruit: '#8a6a40', crown: '#4f8f3c', crownD: '#386e2a', r: 1.7 },
}

function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function FruitTree({ id, tier }: { id: OrchardId; tier: number }) {
  const f = FRUIT[id]!
  const scale = 0.8 + tier * 0.05
  const fruits = Math.min(14, tier * 3)
  const pear = id === 'birne'
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="66" rx={18 + tier * 3} ry="4.5" fill="rgba(40,60,20,0.22)" />
      {tier >= 3 ? (
        <g>
          {[18, 26, 54, 62].map((x, i) => (
            <circle key={x} cx={x} cy={64 + (i % 2)} r="1.4" fill={['#fff', '#f5c542', '#f28ab2', '#fff'][i]} />
          ))}
        </g>
      ) : null}
      <g transform={`translate(40 66) scale(${scale}) translate(-40 -66)`}>
        <path d="M37 66 L38 40 Q40 34 42 40 L43 66 Z" fill="#7a5532" stroke="#4e341c" strokeWidth="1" />
        <path d="M39 46 Q32 40 28 36 M41 44 Q48 38 53 35" stroke="#7a5532" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        <circle cx="40" cy="26" r="20" fill={f.crownD} />
        <circle cx="29" cy="31" r="13" fill={f.crown} />
        <circle cx="51" cy="30" r="13" fill={f.crown} />
        <circle cx="40" cy="20" r="14" fill={f.crown} />
        <circle cx="35" cy="16" r="6" fill="#fff" opacity="0.12" />
        {Array.from({ length: fruits }, (_, i) => {
          const a = seeded(i + 1) * Math.PI * 2
          const d = 6 + seeded(i + 7) * 13
          const x = 40 + Math.cos(a) * d
          const y = 26 + Math.sin(a) * d * 0.8
          return pear ? (
            <ellipse key={i} cx={x} cy={y} rx={f.r * 0.85} ry={f.r * 1.25} fill={f.fruit} />
          ) : (
            <circle key={i} cx={x} cy={y} r={f.r} fill={f.fruit} />
          )
        })}
      </g>
      {tier >= 4 ? (
        <g>
          <path d="M56 58h12l-1.5 7h-9z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth="1" />
          <circle cx="59" cy="57" r="2" fill={f.fruit} />
          <circle cx="63" cy="56.5" r="2" fill={f.fruit} />
          <circle cx="66" cy="57.4" r="1.8" fill={f.fruit} />
        </g>
      ) : null}
      {tier >= 5 ? (
        <g stroke="#8a6a40" strokeWidth="1.4">
          <path d="M14 66 L22 30 M20 66 L28 30" />
          {[36, 44, 52, 60].map((y) => (
            <path key={y} d={`M${14 + (66 - y) * 0.22} ${y} H${20 + (66 - y) * 0.22}`} />
          ))}
        </g>
      ) : null}
    </svg>
  )
}

function Schafe({ tier }: { tier: number }) {
  const n = Math.max(1, Math.min(5, tier))
  const pos = [
    [30, 50],
    [50, 54],
    [40, 42],
    [60, 44],
    [22, 40],
  ]
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="52" rx="34" ry="14" fill="#8cc06a" opacity="0.6" />
      <path d="M8 60 L8 44 M72 60 L72 44 M8 48 H72 M8 56 H72" stroke="#8a6a40" strokeWidth="1.6" />
      {pos.slice(0, n).map(([x, y], i) => (
        <g key={i} className="sheep" style={{ animationDelay: `${i * 0.7}s` }}>
          <ellipse cx={x} cy={y} rx="7" ry="5" fill="#f6f2e8" stroke="#bdb6a6" strokeWidth=".8" />
          <circle cx={x! - 4} cy={y! - 4} r="2.6" fill="#f6f2e8" />
          <circle cx={x! + 2} cy={y! - 4.6} r="2.8" fill="#f6f2e8" />
          <ellipse cx={x! + 7.5} cy={y! - 1} rx="2.6" ry="2.1" fill="#3b3330" />
          <path d={`M${x! - 4} ${y! + 4}v3M${x! + 3} ${y! + 4}v3`} stroke="#3b3330" strokeWidth="1.2" />
        </g>
      ))}
      {tier >= 4 ? <path d="M60 30h12v8H60z" fill="#a5531a" stroke="#6e341a" strokeWidth="1" /> : null}
    </svg>
  )
}

function Wildbienen({ tier }: { tier: number }) {
  const rows = Math.min(4, 1 + Math.floor(tier / 1.4))
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="66" rx="20" ry="4" fill="rgba(40,60,20,0.22)" />
      <path d="M38 66V40M42 66V40" stroke="#7a5532" strokeWidth="2" />
      <path d="M22 26 L40 12 L58 26 Z" fill="#a5531a" stroke="#6e341a" strokeWidth="1" />
      <rect x="25" y="26" width="30" height={8 * rows} fill="#d9b78a" stroke="#8a6a40" strokeWidth="1" />
      {Array.from({ length: rows * 5 }, (_, i) => (
        <circle key={i} cx={29 + (i % 5) * 5.5} cy={30 + Math.floor(i / 5) * 8} r="1.8" fill="#5a3d22" />
      ))}
      {Array.from({ length: Math.min(5, tier) }, (_, i) => (
        <g key={`b${i}`} className="bee" style={{ animationDelay: `${i * 0.5}s` }}>
          <ellipse cx={16 + i * 12} cy={18 + (i % 2) * 8} rx="2" ry="1.4" fill="#f5c542" stroke="#4a3208" strokeWidth=".6" />
        </g>
      ))}
      {tier >= 3
        ? [16, 24, 58, 66].map((x, i) => (
            <circle key={x} cx={x} cy={62} r="2" fill={['#c77dd1', '#f5c542', '#f28ab2', '#c77dd1'][i]} />
          ))
        : null}
    </svg>
  )
}

function Mosterei({ tier }: { tier: number }) {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="66" rx="30" ry="4" fill="rgba(40,60,20,0.22)" />
      <path d="M14 34 L40 18 L66 34 Z" fill="#b8403a" stroke="#7a2e22" strokeWidth="1" />
      <rect x="18" y="34" width="44" height="30" fill="#d9b78a" stroke="#8a6a40" strokeWidth="1" />
      <rect x="34" y="46" width="12" height="18" fill="#7a5532" />
      {tier >= 2 ? (
        <g>
          <rect x="22" y="40" width="8" height="8" fill="#8fd0ec" stroke="#8a6a40" strokeWidth=".8" />
          <rect x="50" y="40" width="8" height="8" fill="#8fd0ec" stroke="#8a6a40" strokeWidth=".8" />
        </g>
      ) : null}
      {Array.from({ length: Math.min(4, tier) }, (_, i) => (
        <g key={i}>
          <ellipse cx={8 + i * 9 + (i > 1 ? 50 : 0)} cy="60" rx="4" ry="5.5" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".8" />
          <path d={`M${4 + i * 9 + (i > 1 ? 50 : 0)} 58h8M${4 + i * 9 + (i > 1 ? 50 : 0)} 62h8`} stroke="#6e4a2b" strokeWidth=".8" />
        </g>
      ))}
      {tier >= 5 ? <path d="M40 18v-6l4 2" stroke="#6e4a2b" strokeWidth="1.2" fill="#f5c542" /> : null}
    </svg>
  )
}

function Doerrhaus({ tier }: { tier: number }) {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="66" rx="22" ry="4" fill="rgba(40,60,20,0.22)" />
      <path d="M22 32 L40 20 L58 32 Z" fill="#6e4a2b" />
      <rect x="25" y="32" width="30" height="32" fill="#c9a46b" stroke="#6e4a2b" strokeWidth="1" />
      <rect x="35" y="48" width="10" height="16" fill="#7a5532" />
      {tier >= 2 ? <path d="M52 22v-8h4v10" fill="#8a6a40" /> : null}
      {tier >= 2 ? <path className="smoke" d="M54 12c-2-3 2-5 0-8" stroke="#ccc" strokeWidth="1.6" fill="none" /> : null}
      {Array.from({ length: Math.min(3, tier) }, (_, r) => (
        <g key={r}>
          <path d={`M8 ${40 + r * 7}h14`} stroke="#8a6a40" strokeWidth=".8" />
          {[10, 14, 18].map((x) => (
            <circle key={x} cx={x} cy={42 + r * 7} r="1.8" fill="none" stroke="#e8b422" strokeWidth="1.2" />
          ))}
        </g>
      ))}
    </svg>
  )
}

function Obstmarkt({ tier }: { tier: number }) {
  const crates = Math.min(5, tier + 1)
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="66" rx="30" ry="4" fill="rgba(40,60,20,0.22)" />
      <path d="M12 24h56l-4 8H16z" fill="#e2453c" />
      <path d="M12 24h8l-1 8h-3zM28 24h8l-1 8h-6zM44 24h8l-1 8h-6zM60 24h8l-4 8h-3z" fill="#fff" opacity=".85" />
      <path d="M16 32v32M64 32v32" stroke="#8a6a40" strokeWidth="2" />
      <rect x="14" y="48" width="52" height="6" fill="#c9a46b" stroke="#6e4a2b" strokeWidth="1" />
      {Array.from({ length: crates }, (_, i) => (
        <g key={i}>
          <rect x={16 + i * 10} y="40" width="9" height="8" fill="#d9b78a" stroke="#8a6a40" strokeWidth=".8" />
          {[0, 1, 2].map((k) => (
            <circle key={k} cx={18.5 + i * 10 + k * 2.2} cy="40" r="1.5" fill={['#d9483b', '#d8c84a', '#5b3a78', '#9e1f2c', '#e8b422'][i]} />
          ))}
        </g>
      ))}
      {tier >= 3 ? <rect x="56" y="56" width="8" height="8" rx="1" fill="#6e4a2b" /> : null}
      {tier >= 4 ? <path d="M36 14h8v8h-8z" fill="#fbf3e0" stroke="#8a6a40" strokeWidth=".8" /> : null}
    </svg>
  )
}

export const OrchardArt = memo(function OrchardArt({ id, level }: { id: OrchardId; level: number }) {
  const tier = Math.max(1, moduleTier(level))
  switch (id) {
    case 'schafe':
      return <Schafe tier={tier} />
    case 'wildbienen':
      return <Wildbienen tier={tier} />
    case 'mosterei':
      return <Mosterei tier={tier} />
    case 'doerrhaus':
      return <Doerrhaus tier={tier} />
    case 'obstmarkt':
      return <Obstmarkt tier={tier} />
    default:
      return <FruitTree id={id} tier={tier} />
  }
})

/** Sapling marker for an unlocked but unplanted orchard spot. */
export function OrchardSapling() {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="62" rx="16" ry="5" fill="#8a6a40" opacity="0.55" />
      <path d="M40 62V44" stroke="#6e4a2b" strokeWidth="2" />
      <path d="M40 48c-6-2-8-7-6-10 4 1 6 5 6 10zM40 46c5-3 9-3 10 0-3 3-7 3-10 0z" fill="#7fbf5a" />
      <path d="M33 62l2-14M47 62l-2-14" stroke="#c9a46b" strokeWidth="1.2" />
    </svg>
  )
}

/** Overgrown spot (locked) — tall grass and an old stump. */
export function OrchardWild({ seed = 0 }: { seed?: number }) {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="62" rx="26" ry="7" fill="#5f8a3a" opacity="0.5" />
      <ellipse cx="22" cy="54" rx="11" ry="8" fill="#6d9a3f" />
      <ellipse cx="58" cy="55" rx="12" ry="8" fill="#5f8a3a" />
      <circle cx="18" cy="52" r="1.6" fill="#7a2e5a" />
      <circle cx="24" cy="49" r="1.6" fill="#7a2e5a" />
      <circle cx="61" cy="52" r="1.6" fill="#7a2e5a" />
      <path d="M32 62v-8q8-3 16 0v8z" fill="#7a5532" stroke="#4e341c" strokeWidth="1" />
      <ellipse cx="40" cy="54" rx="8" ry="2.4" fill="#c9a46b" />
      {Array.from({ length: 9 }, (_, i) => (
        <path
          key={i}
          d={`M${20 + i * 5} 64q${(i % 2 ? 1 : -1) * 3} -${10 + ((i + seed) % 3) * 4} ${(i % 2 ? 4 : -2)} -${16 + ((i + seed) % 4) * 3}`}
          stroke={i % 3 ? '#6d9a3f' : '#a3b85a'}
          strokeWidth="1.6"
          fill="none"
        />
      ))}
    </svg>
  )
}
