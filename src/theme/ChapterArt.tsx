/**
 * Generic chapter art for Kapitel 4–12: every area is described by a small
 * spec (tree, rows, animals, house, water, flowers, stones) and drawn with
 * five growth tiers. Backdrops are specs too (palette, water, mountains …).
 * Kapitel 2/3 keep their hand-made art (OrchardArt, VineyardArt).
 */
import { ChapterPath } from './ChapterPaths'
import { memo, type ReactNode } from 'react'
import type { Animals, ArtSpec, BackdropSpec, Flowers, House, Rows, Stones, Tree, Water } from './chapterArtSpecs'
import type { Season } from './ambient'
import { moduleTier } from './tiers'

const shadow = (rx: number) => <ellipse cx="40" cy="65" rx={rx} ry="4.5" fill="rgba(40,60,20,0.22)" />

function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function TreeArt({ s, tier, season }: { s: Tree; tier: number; season?: Season }) {
  const scale = 0.78 + tier * 0.055
  const crown = season === 'autumn' && s.shape !== 'cone' && s.shape !== 'bamboo' ? '#c49a3a' : s.crown
  const snow = season === 'winter'
  const n = tier * 3
  let body: ReactNode
  if (s.shape === 'palm') {
    body = (
      <g>
        <path d="M40 66 Q38 40 42 22" stroke="#8a6a40" strokeWidth="4" fill="none" />
        {[-60, -20, 20, 60, 100, 140].map((r) => (
          <ellipse key={r} cx="42" cy="22" rx="16" ry="4" fill={crown} transform={`rotate(${r} 42 22) translate(10 0)`} />
        ))}
      </g>
    )
  } else if (s.shape === 'cone') {
    body = (
      <g>
        <rect x="37" y="54" width="6" height="12" fill="#6e4a2b" />
        <path d="M40 6 L20 58 H60z" fill={crown} />
        <path d="M40 6 L30 40 H50z" fill="#fff" opacity=".1" />
        {snow ? <path d="M40 6 L33 24 H47z" fill="#fff" /> : null}
      </g>
    )
  } else if (s.shape === 'bamboo') {
    body = (
      <g>
        {[26, 34, 42, 50, 56].map((x, i) => (
          <g key={x}>
            <path d={`M${x} 66 V${10 + (i % 3) * 6}`} stroke="#7fae58" strokeWidth="3" />
            {[20, 34, 48].map((y) => (
              <path key={y} d={`M${x - 2} ${y} h4`} stroke="#4f7a3a" strokeWidth="1" />
            ))}
            <ellipse cx={x + 6} cy={14 + i * 4} rx="6" ry="1.8" fill={crown} transform={`rotate(-20 ${x + 6} ${14 + i * 4})`} />
          </g>
        ))}
      </g>
    )
  } else {
    const olive = s.shape === 'olive'
    body = (
      <g>
        <path d={olive ? 'M36 66 Q30 50 38 40 Q44 50 42 66z' : 'M37 66 L38 40 Q40 34 42 40 L43 66z'} fill="#7a5532" />
        <circle cx="40" cy="26" r={olive ? 17 : 20} fill={crown} opacity={olive ? 0.9 : 1} />
        <circle cx="28" cy="31" r="12" fill={crown} />
        <circle cx="52" cy="30" r="12" fill={crown} />
        <circle cx="40" cy="19" r="13" fill={crown} />
        <circle cx="36" cy="16" r="5" fill="#fff" opacity="0.15" />
        {snow ? <ellipse cx="40" cy="8" rx="12" ry="3" fill="#fff" /> : null}
        {!snow && (s.fruit || s.shape === 'blossom' || s.shape === 'linden')
          ? Array.from({ length: n }, (_, i) => {
              const a = seeded(i + 3) * Math.PI * 2
              const d = 5 + seeded(i + 9) * 13
              return (
                <circle
                  key={i}
                  cx={40 + Math.cos(a) * d}
                  cy={25 + Math.sin(a) * d * 0.8}
                  r={s.shape === 'blossom' ? 2 : 1.5}
                  fill={s.shape === 'blossom' ? (i % 3 ? '#fff' : '#e85d8a') : s.fruit}
                />
              )
            })
          : null}
      </g>
    )
  }
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      {shadow(18 + tier * 2)}
      <g transform={`translate(40 66) scale(${scale}) translate(-40 -66)`}>{body}</g>
    </svg>
  )
}

function RowsArt({ s, tier, season }: { s: Rows; tier: number; season?: Season }) {
  const rows = Math.min(5, 1 + tier)
  const winter = season === 'winter'
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="58" rx="34" ry="12" fill="#8a6a40" opacity="0.45" />
      {Array.from({ length: rows }, (_, r) => {
        const y = 64 - r * 6
        return (
          <g key={r}>
            {Array.from({ length: 8 }, (_, i) => {
              const x = 10 + i * 8.5 + (r % 2) * 3
              return (
                <g key={i}>
                  {s.tall ? <path d={`M${x} ${y} v-12`} stroke={s.color} strokeWidth="1.4" /> : null}
                  <ellipse cx={x} cy={s.tall ? y - 12 : y - 2} rx="3.6" ry="2.6" fill={winter ? '#b8b094' : s.color} />
                  {s.flower && !winter && season !== 'spring' ? (
                    <circle cx={x} cy={s.tall ? y - 13 : y - 4} r={s.tall ? 2.6 : 1.4} fill={s.flower} />
                  ) : null}
                </g>
              )
            })}
          </g>
        )
      })}
      {winter ? <ellipse cx="40" cy="56" rx="30" ry="6" fill="#fff" opacity=".55" /> : null}
    </svg>
  )
}

function Animal({ kind, x, y, i }: { kind: Animals['animal']; x: number; y: number; i: number }) {
  switch (kind) {
    case 'cow':
      return (
        <g className="sheep" style={{ animationDelay: `${i * 0.6}s` }}>
          <ellipse cx={x} cy={y} rx="8" ry="5" fill="#fbf6e8" stroke="#6a5a4a" strokeWidth=".7" />
          <ellipse cx={x - 2} cy={y - 1} rx="3" ry="2.2" fill="#5a3d22" />
          <ellipse cx={x + 8.5} cy={y - 2} rx="3" ry="2.6" fill="#fbf6e8" stroke="#6a5a4a" strokeWidth=".7" />
          <ellipse cx={x + 10} cy={y - 1} rx="1.6" ry="1.2" fill="#f2b8b0" />
          <path d={`M${x - 5} ${y + 4}v3M${x + 4} ${y + 4}v3`} stroke="#4a3a2a" strokeWidth="1.3" />
        </g>
      )
    case 'goat':
      return (
        <g className="sheep" style={{ animationDelay: `${i * 0.5}s` }}>
          <ellipse cx={x} cy={y} rx="6" ry="4" fill="#efe6d4" stroke="#8a7a6a" strokeWidth=".6" />
          <circle cx={x + 6} cy={y - 3} r="2.4" fill="#efe6d4" />
          <path d={`M${x + 5} ${y - 5}l-1-3M${x + 7} ${y - 5}l1-3`} stroke="#8a7a6a" strokeWidth=".8" />
          <path d={`M${x - 4} ${y + 3}v3M${x + 3} ${y + 3}v3`} stroke="#4a3a2a" strokeWidth="1.1" />
        </g>
      )
    case 'pig':
      return (
        <g className="sheep" style={{ animationDelay: `${i * 0.7}s` }}>
          <ellipse cx={x} cy={y} rx="7" ry="4.6" fill="#f2b8b0" stroke="#c48a80" strokeWidth=".7" />
          <ellipse cx={x + 7} cy={y - 0.5} rx="2" ry="1.6" fill="#e8a098" />
          <path d={`M${x - 7} ${y - 1}q-2-2 0-3`} stroke="#c48a80" strokeWidth=".8" fill="none" />
        </g>
      )
    case 'goose':
    case 'duck':
      return (
        <g className="sheep" style={{ animationDelay: `${i * 0.5}s` }}>
          <ellipse cx={x} cy={y} rx="5" ry="3.4" fill={kind === 'goose' ? '#fbf6e8' : '#8a6a40'} stroke="#8a7a6a" strokeWidth=".6" />
          <path d={`M${x + 4} ${y - 1} q2 -5 1 -7`} stroke={kind === 'goose' ? '#fbf6e8' : '#3f7a30'} strokeWidth="2" fill="none" />
          <path d={`M${x + 5} ${y - 8}l3 1-3 1z`} fill="#f08a2c" />
        </g>
      )
    case 'koi':
    case 'fish':
      return (
        <g className="bee" style={{ animationDelay: `${i * 0.4}s` }}>
          <ellipse cx={x} cy={y} rx="4.4" ry="1.8" fill={kind === 'koi' ? (i % 2 ? '#f08a2c' : '#fbf6e8') : '#8aa0a8'} />
          {kind === 'koi' && i % 2 === 0 ? <circle cx={x - 1} cy={y} r="1" fill="#e0485e" /> : null}
          <path d={`M${x - 4} ${y}l-3 -2v4z`} fill={kind === 'koi' ? '#f08a2c' : '#8aa0a8'} />
        </g>
      )
    default:
      return <ellipse cx={x} cy={y} rx="2" ry="1.4" fill="#f5c542" />
  }
}

function AnimalsArt({ s, tier }: { s: Animals; tier: number }) {
  const n = Math.min(5, tier + 1)
  const pos = [
    [30, 52],
    [52, 56],
    [40, 44],
    [60, 46],
    [22, 44],
  ]
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      {s.water ? (
        <ellipse cx="40" cy="52" rx="34" ry="15" fill="#6aa6c9" stroke="#4f86a6" strokeWidth="1" />
      ) : (
        <g>
          <ellipse cx="40" cy="52" rx="34" ry="14" fill="#8cc06a" opacity="0.6" />
          <path d="M6 62 V44 M74 62 V44 M6 48 H74 M6 56 H74" stroke="#8a6a40" strokeWidth="1.5" />
        </g>
      )}
      {pos.slice(0, n).map(([x, y], i) => (
        <Animal key={i} kind={s.animal} x={x!} y={y!} i={i} />
      ))}
      {tier >= 4 && !s.water ? <path d="M58 30h14v8H58z" fill="#a5531a" stroke="#6e341a" strokeWidth=".8" /> : null}
    </svg>
  )
}

function HouseArt({ s, tier }: { s: House; tier: number }) {
  const glass = s.prop === 'glass' || s.prop === 'dome'
  const w = 36 + Math.min(3, tier) * 3
  const x = 40 - w / 2
  let roof: ReactNode
  if (s.prop === 'dome') {
    roof = <path d={`M${x} 40 A${w / 2} ${w / 2.2} 0 0 1 ${x + w} 40z`} fill={s.roof} stroke="#8aa8b8" strokeWidth="1" opacity=".9" />
  } else if (s.prop === 'pagoda') {
    roof = (
      <g fill={s.roof}>
        <path d={`M${x - 6} 38 Q40 30 ${x + w + 6} 38 L${x + w} 34 Q40 24 ${x} 34z`} />
        <path d={`M${x + 4} 26 Q40 18 ${x + w - 4} 26 L${x + w - 8} 22 Q40 14 ${x + 8} 22z`} />
      </g>
    )
  } else if (s.prop === 'tent') {
    roof = <path d={`M${x - 4} 40 L40 16 L${x + w + 4} 40z`} fill={s.roof} stroke="#c9b48a" strokeWidth="1" />
  } else if (s.prop === 'gate') {
    roof = <path d={`M${x} 34 Q40 10 ${x + w} 34`} stroke={s.roof} strokeWidth="5" fill="none" />
  } else if (s.prop === 'stage') {
    roof = <path d={`M${x - 4} 34 Q40 20 ${x + w + 4} 34z`} fill={s.roof} />
  } else {
    roof = <path d={`M${x - 3} 40 L40 ${glass ? 26 : 20} L${x + w + 3} 40z`} fill={s.roof} />
  }
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      {shadow(w / 2 + 10)}
      {s.prop === 'tower' ? (
        <g>
          <rect x="34" y="12" width="12" height="52" fill={s.wall} stroke="#8a6a40" strokeWidth="1" />
          <path d="M30 14 L40 2 L50 14z" fill={s.roof} />
          <rect x="37" y="20" width="6" height="6" fill="#8fd0ec" />
          <rect x="37" y="36" width="6" height="6" fill="#8fd0ec" />
        </g>
      ) : s.prop === 'gate' ? (
        <g>
          <rect x={x} y="34" width="6" height="30" fill={s.wall} stroke="#8a6a40" strokeWidth=".8" />
          <rect x={x + w - 6} y="34" width="6" height="30" fill={s.wall} stroke="#8a6a40" strokeWidth=".8" />
          {roof}
          {Array.from({ length: tier * 2 }, (_, i) => (
            <circle key={i} cx={x + 4 + i * ((w - 8) / Math.max(1, tier * 2 - 1))} cy={30 - Math.sin((i / Math.max(1, tier * 2 - 1)) * Math.PI) * 14} r="2" fill={['#e0485e', '#f5c542', '#f28ab2'][i % 3]} />
          ))}
        </g>
      ) : s.prop === 'stage' ? (
        <g>
          <rect x={x - 2} y="50" width={w + 4} height="8" fill="#a5733f" />
          <path d={`M${x} 34 V50 M${x + w} 34 V50`} stroke="#6e4a2b" strokeWidth="2" />
          {roof}
          {tier >= 3 ? [0, 1, 2, 3].map((i) => <circle key={i} className="fest-twinkle" cx={x + 6 + i * (w - 12) / 3} cy="34" r="1.6" fill="#fff3b0" />) : null}
        </g>
      ) : (
        <g>
          {roof}
          <rect x={x} y="40" width={w} height="24" fill={s.wall} stroke={glass ? '#8aa8b8' : '#8a6a40'} strokeWidth="1" opacity={glass ? 0.85 : 1} />
          {glass
            ? Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${x + (i + 1) * (w / 6)} 40 V64`} stroke="#8aa8b8" strokeWidth=".8" />)
            : <rect x="36" y="50" width="8" height="14" fill="#7a5532" />}
          {glass ? (
            <g>
              <circle cx={x + 8} cy="56" r="4" fill="#5f9e45" />
              <circle cx={x + w - 8} cy="55" r="5" fill={s.wall === '#f4ecd8' ? '#7fae58' : '#4f8a3a'} />
              {tier >= 3 ? <circle cx="40" cy="54" r="3" fill="#e0485e" /> : null}
            </g>
          ) : tier >= 2 ? (
            <rect x={x + 4} y="45" width="7" height="6" fill="#8fd0ec" stroke="#8a6a40" strokeWidth=".6" />
          ) : null}
        </g>
      )}
      {s.prop === 'chimney' ? (
        <g>
          <rect x={x + w - 10} y="22" width="5" height="12" fill="#8a6a40" />
          {tier >= 2 ? <path className="smoke" d={`M${x + w - 7} 20c-2-3 2-5 0-8`} stroke="#ccc" strokeWidth="1.6" fill="none" /> : null}
        </g>
      ) : null}
      {s.prop === 'barrels' || s.prop === 'jars' || s.prop === 'hives'
        ? Array.from({ length: Math.min(4, tier) }, (_, i) => {
            const bx = i < 2 ? 6 + i * 8 : 60 + (i - 2) * 8
            return s.prop === 'barrels' ? (
              <ellipse key={i} cx={bx + 3} cy="60" rx="3.6" ry="4.4" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".7" />
            ) : s.prop === 'hives' ? (
              <rect key={i} x={bx} y="54" width="7" height="9" fill={['#f5c542', '#3d8db8', '#e0485e', '#7fbf5a'][i]} stroke="#6e4a2b" strokeWidth=".6" />
            ) : (
              <rect key={i} x={bx} y="56" width="5" height="7" rx="1.4" fill="#e8b422" stroke="#a5733f" strokeWidth=".6" />
            )
          })
        : null}
      {s.prop === 'still' && tier >= 2 ? (
        <g>
          <ellipse cx="66" cy="56" rx="6" ry="6.5" fill="#c4783a" stroke="#8a4a20" strokeWidth=".8" />
          <path d="M66 49 q8 -4 10 4" stroke="#c4783a" strokeWidth="1.6" fill="none" />
        </g>
      ) : null}
      {s.prop === 'bell' ? <path d="M40 18 q-4 0-4 5h8q0-5-4-5z" fill="#e8b422" /> : null}
      {s.prop === 'flag' ? (
        <g>
          <path d="M60 64 V28" stroke="#6e4a2b" strokeWidth="1.4" />
          <path d="M60 28 h10 l-3 3 3 3 h-10z" fill="#e2453c" />
        </g>
      ) : null}
      {s.prop === 'cable' ? <path d="M0 18 L80 6" stroke="#4a3a2a" strokeWidth=".8" /> : null}
      {s.prop === 'cable' && tier >= 2 ? <rect x="52" y="9" width="8" height="5" fill="#b8403a" /> : null}
    </svg>
  )
}

function WaterArt({ s, tier }: { s: Water; tier: number }) {
  const pond = <ellipse cx="40" cy="52" rx="32" ry="14" fill="#6aa6c9" stroke="#4f86a6" strokeWidth="1" />
  switch (s.variant) {
    case 'lilies':
      return (
        <svg viewBox="0 0 80 72" focusable="false">
          {pond}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <g key={i}>
              <ellipse cx={20 + i * 8} cy={48 + (i % 2) * 7} rx="5" ry="2.6" fill="#5f9e45" />
              <circle cx={20 + i * 8} cy={47 + (i % 2) * 7} r="1.6" fill={i % 2 ? '#fbf6e8' : '#f28ab2'} />
            </g>
          ))}
        </svg>
      )
    case 'reeds':
      return (
        <svg viewBox="0 0 80 72" focusable="false">
          {pond}
          {Array.from({ length: 4 + tier * 2 }, (_, i) => (
            <g key={i}>
              <path d={`M${10 + i * 5} 60 V${32 + (i % 3) * 5}`} stroke="#7a8a4c" strokeWidth="1.4" />
              <ellipse cx={10 + i * 5} cy={31 + (i % 3) * 5} rx="1.2" ry="3" fill="#6e4a2b" />
            </g>
          ))}
        </svg>
      )
    case 'stream':
      return (
        <svg viewBox="0 0 80 72" focusable="false">
          <path d="M10 30 C30 40 20 50 40 56 S70 60 74 66" stroke="#6aa6c9" strokeWidth={8 + tier} fill="none" strokeLinecap="round" />
          <path d="M10 30 C30 40 20 50 40 56 S70 60 74 66" stroke="#a9d6ee" strokeWidth="2" fill="none" strokeDasharray="4 6" className="orchard-stream" />
          {Array.from({ length: tier }, (_, i) => (
            <ellipse key={i} cx={18 + i * 12} cy={48 + (i % 2) * 8} rx="4" ry="2.6" fill="#a69a84" />
          ))}
        </svg>
      )
    case 'jetty':
      return (
        <svg viewBox="0 0 80 72" focusable="false">
          {pond}
          <rect x="18" y="44" width={20 + tier * 6} height="6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".7" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <path key={i} d={`M${20 + i * 6} 50 v8`} stroke="#6e4a2b" strokeWidth="1.4" />
          ))}
          {tier >= 3 ? <path d="M54 54 q8 6 16 0z" fill="#e2453c" /> : null}
        </svg>
      )
    case 'bridge':
      return (
        <svg viewBox="0 0 80 72" focusable="false">
          {pond}
          <path d="M10 50 Q40 22 70 50" stroke="#c4553f" strokeWidth="5" fill="none" />
          <path d="M14 46 Q40 18 66 46" stroke="#c4553f" strokeWidth="1.6" fill="none" />
          {Array.from({ length: 3 + tier }, (_, i) => (
            <path key={i} d={`M${16 + i * (48 / (2 + tier))} ${44 - Math.sin(((i + 0.5) / (3 + tier)) * Math.PI) * 18} v6`} stroke="#c4553f" strokeWidth="1.2" />
          ))}
          {tier >= 3 ? <path d="M28 60 q6 4 12 0z" fill="#3d8db8" /> : null}
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 80 72" focusable="false">
          {pond}
          <ellipse cx="40" cy="50" rx="10" ry="4" fill="#a69a84" />
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <path key={i} className="fountain-jet" d={`M${32 + i * 4} 48 q${(i - 2) * 2} -${14 + tier * 3} ${(i - 2) * 4} -2`} stroke="#a9d6ee" strokeWidth="1.6" fill="none" style={{ animationDelay: `${i * 0.2}s` }} />
          ))}
        </svg>
      )
  }
}

function FlowersArt({ s, tier }: { s: Flowers; tier: number }) {
  const n = 6 + tier * 4
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="58" rx="32" ry="10" fill="#6f9a48" />
      {Array.from({ length: n }, (_, i) => (
        <circle
          key={i}
          cx={12 + seeded(i + 1) * 56}
          cy={52 + seeded(i + 7) * 12}
          r="2.2"
          fill={s.colors[i % s.colors.length]}
        />
      ))}
      {s.arch && tier >= 2 ? (
        <g>
          <path d="M20 60 V36 Q40 16 60 36 V60" stroke="#6e4a2b" strokeWidth="2" fill="none" />
          {Array.from({ length: tier * 3 }, (_, i) => {
            const t = i / Math.max(1, tier * 3 - 1)
            const ang = Math.PI * t
            return <circle key={i} cx={40 - Math.cos(ang) * 20} cy={36 - Math.sin(ang) * 18} r="2.4" fill={s.colors[i % s.colors.length]} />
          })}
        </g>
      ) : null}
    </svg>
  )
}

function StonesArt({ s, tier }: { s: Stones; tier: number }) {
  if (s.variant === 'zen') {
    return (
      <svg viewBox="0 0 80 72" focusable="false">
        <rect x="8" y="42" width="64" height="24" rx="3" fill="#efe6d0" stroke="#c9b48a" strokeWidth="1" />
        {[46, 51, 56, 61].map((y) => <path key={y} d={`M10 ${y} H70`} stroke="#d9c79a" strokeWidth=".8" />)}
        {Array.from({ length: Math.min(3, tier) }, (_, i) => (
          <ellipse key={i} cx={22 + i * 18} cy={52 + (i % 2) * 4} rx={5 - i} ry={3.4 - i * 0.6} fill="#8a8a7a" />
        ))}
      </svg>
    )
  }
  if (s.variant === 'maze') {
    const k = Math.min(4, tier)
    return (
      <svg viewBox="0 0 80 72" focusable="false">
        {shadow(30)}
        {Array.from({ length: k }, (_, i) => (
          <rect key={i} x={10 + i * 6} y={34 + i * 4} width={60 - i * 12} height={30 - i * 8} rx="3" fill="none" stroke="#3f7a30" strokeWidth="4" strokeDasharray={`${30 - i * 4} 6`} />
        ))}
      </svg>
    )
  }
  if (s.variant === 'lanterns') {
    return (
      <svg viewBox="0 0 80 72" focusable="false">
        <path d="M6 62 Q40 50 74 62" stroke="#d9c79a" strokeWidth="6" fill="none" />
        {Array.from({ length: Math.min(4, tier + 1) }, (_, i) => (
          <g key={i} transform={`translate(${12 + i * 18} ${40 - (i % 2) * 4})`}>
            <rect x="-3" y="10" width="6" height="12" fill="#a69a84" />
            <rect x="-5" y="4" width="10" height="7" fill="#c9bfa8" />
            <rect x="-2.5" y="5.5" width="5" height="4" className="fest-glow" fill="#fff3b0" />
            <path d="M-7 4 L0 -2 L7 4z" fill="#8a8a7a" />
          </g>
        ))}
      </svg>
    )
  }
  const flower = s.variant === 'edelweiss' ? '#fbf6e8' : s.variant === 'moss' ? '#5f9e45' : '#c77dd1'
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      {shadow(30)}
      {Array.from({ length: 3 + Math.min(4, tier) }, (_, i) => (
        <ellipse key={i} cx={14 + i * 9} cy={56 - (i % 2) * 6} rx="7" ry="5" fill={s.variant === 'moss' ? '#6d8a4a' : '#a69a84'} stroke="#7a6e5a" strokeWidth=".6" />
      ))}
      {Array.from({ length: tier * 3 }, (_, i) => (
        <g key={`f${i}`}>
          {s.variant === 'moss' ? (
            <path d={`M${12 + seeded(i + 2) * 56} 60 q2 -8 6 -10`} stroke="#3f7a30" strokeWidth="1.4" fill="none" />
          ) : (
            <circle cx={12 + seeded(i + 2) * 56} cy={46 + seeded(i + 5) * 12} r={s.variant === 'edelweiss' ? 1.8 : 1.4} fill={flower} />
          )}
        </g>
      ))}
    </svg>
  )
}

export const ChapterAreaArt = memo(function ChapterAreaArt({
  spec,
  level,
  season,
}: {
  spec: ArtSpec
  level: number
  season?: Season
}) {
  const tier = Math.max(1, moduleTier(level))
  switch (spec.k) {
    case 'tree':
      return <TreeArt s={spec} tier={tier} season={season} />
    case 'rows':
      return <RowsArt s={spec} tier={tier} season={season} />
    case 'animals':
      return <AnimalsArt s={spec} tier={tier} />
    case 'house':
      return <HouseArt s={spec} tier={tier} />
    case 'water':
      return <WaterArt s={spec} tier={tier} />
    case 'flowers':
      return <FlowersArt s={spec} tier={tier} />
    case 'stones':
      return <StonesArt s={spec} tier={tier} />
  }
})

/** Unplanted spot: tilled earth with a little sign. */
export function ChapterReady() {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="60" rx="26" ry="7" fill="#8a6a40" opacity="0.55" />
      <path d="M22 58h36M26 62h28" stroke="#6e4a2b" strokeWidth=".8" opacity=".6" />
      <path d="M40 60V44" stroke="#8a6a40" strokeWidth="1.6" />
      <rect x="33" y="38" width="14" height="8" rx="1.4" fill="#efe1c2" stroke="#8a6a40" strokeWidth=".8" />
    </svg>
  )
}

/** Overgrown spot (locked). */
export function ChapterWild({ seed = 0 }: { seed?: number }) {
  return (
    <svg viewBox="0 0 80 72" focusable="false">
      <ellipse cx="40" cy="60" rx="28" ry="8" fill="#5f8a3a" opacity="0.5" />
      <ellipse cx="26" cy="52" rx="12" ry="9" fill="#6d9a3f" />
      <ellipse cx="54" cy="54" rx="13" ry="8" fill="#5f8a3a" />
      {Array.from({ length: 6 }, (_, i) => (
        <path key={i} d={`M${18 + i * 8} 62q${i % 2 ? 2 : -2} -${10 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${14 + ((i + seed) % 4) * 3}`} stroke="#a3b85a" strokeWidth="1.4" fill="none" />
      ))}
    </svg>
  )
}

export const ChapterBackdrop = memo(function ChapterBackdrop({ spec, stage }: { spec: BackdropSpec; stage: number }) {
  const [far, mid, near] = spec.grass
  const id = `cb-${far.slice(1)}`
  return (
    <div className="garden-ground chapter-ground" aria-hidden="true" data-stage={stage}>
      <svg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={far} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={near} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${id})`} />
        {spec.stripes
          ? Array.from({ length: 10 }, (_, i) => (
              <path key={i} d={`M0 ${28 + i * 7.4} Q50 ${25 + i * 7.4} 100 ${28 + i * 7.4}`} stroke={spec.stripes} strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" opacity="0.35" />
            ))
          : null}
        {spec.fields
          ? [
              [4, 30, 30, 14, '#b8c46a'],
              [62, 28, 34, 12, '#c9b070'],
              [6, 74, 26, 12, '#a3b85a'],
              [68, 76, 28, 14, '#d4c27a'],
              [30, 92, 40, 8, '#b0c060'],
            ].map(([x, y, w, h, c], i) => (
              <g key={i}>
                <rect x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} opacity="0.55" />
                {Array.from({ length: 4 }, (_, k) => (
                  <path key={k} d={`M${x} ${(y as number) + 2 + k * ((h as number) / 4)}h${w}`} stroke="#8a6a40" strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".25" />
                ))}
              </g>
            ))
          : null}
        {spec.bigLake ? (
          <g>
            <ellipse cx="50" cy="60" rx="34" ry="16" fill="#7a8a4c" opacity=".45" />
            <ellipse cx="50" cy="60" rx="32" ry="14.5" fill="#5f9ec4" />
            <ellipse cx="42" cy="55" rx="12" ry="3" fill="#fff" opacity=".18" />
          </g>
        ) : null}
        {spec.herbGarden
          ? [
              [1, 42, 10, 4.4],
              [89, 40, 10, 4.4],
              [1, 66, 10, 4.4],
              [89, 64, 10, 4.4],
            ].map(([x, y, w, h], i) => (
              <g key={`hb${i}`}>
                <rect x={x} y={y} width={w} height={h} fill="#4f8a3a" />
                <rect x={x! + 1} y={y! + 0.6} width={w! - 2} height={h! - 1.2} fill="#8a6a40" />
                {Array.from({ length: 3 }, (_, k) => (
                  <ellipse key={k} cx={x! + 2.4 + k * ((w! - 4.8) / 2)} cy={y! + h! / 2} rx="1" ry=".5" fill={['#c77dd1', '#f5c542', '#fbf6e8'][(i + k) % 3]} />
                ))}
              </g>
            ))
          : null}
        {spec.glasshouse ? (
          <g>
            {[
              [6, 44],
              [94, 42],
              [8, 72],
              [92, 70],
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="4" ry="1.9" fill={i % 2 ? '#4f8f3c' : '#5f9e45'} />
            ))}
          </g>
        ) : null}
        {spec.alps
          ? [
              [5, 42, 0],
              [95, 40, 1],
              [4, 70, 2],
              [96, 74, 0],
              [50, 96, 1],
            ].map(([x, y, k], i) =>
              k === 1 ? (
                <path key={`al${i}`} d={`M${x} ${y} l-3 6 h6z`} fill="#2f6a3a" />
              ) : (
                <path key={`al${i}`} d={`M${x! - 3} ${y} l1.6 -2.4 h2.6 l1.8 2.4z`} fill="#a69a8a" />
              ),
            )
          : null}
        {spec.water === 'lake' ? <ellipse cx="50" cy="62" rx="16" ry="7" fill="#6aa6c9" opacity="0.9" /> : null}
        {spec.water === 'river' ? (
          <path d="M100 58 C90 64 96 72 86 78 C78 84 84 92 76 100" stroke="#6aa6c9" strokeWidth="14" fill="none" vectorEffect="non-scaling-stroke" />
        ) : null}
        {spec.way ? (
          <ChapterPath style={spec.way} color={spec.path} />
        ) : (
          <path
            d="M50 100 C46 90 40 86 44 78 C48 70 58 68 54 58 C50 50 40 48 46 40 C50 34 52 30 50 22"
            stroke={spec.path}
            strokeWidth="14"
            fill="none"
            vectorEffect="non-scaling-stroke"
            opacity="0.9"
          />
        )}
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 37) % 100} cy={26 + ((i * 53) % 72)} r="0.4" fill={['#fff', '#f5c542', '#c77dd1'][i % 3]} opacity={stage >= i % 10 ? 0.8 : 0.2} />
        ))}
      </svg>
      <div className="garden-hedge orchard-hills">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" focusable="false">
          {spec.mountains ? (
            <g>
              <path d="M0 60 L60 6 L110 40 L170 0 L240 44 L300 10 L360 38 L400 20 V60z" fill="#9aa8b6" />
              <path d="M50 14 L60 6 L70 14 M160 8 L170 0 L180 8 M290 18 L300 10 L310 18" stroke="#fff" strokeWidth="5" fill="none" />
            </g>
          ) : null}
          {spec.alps ? (
            <g>
              <path d="M0 60 L50 4 L96 34 L150 0 L214 40 L262 6 L330 36 L372 12 L400 24 V60z" fill="#8a9aae" />
              <path d="M0 60 L50 4 L70 26 L60 60z M150 0 L176 22 L160 60 L130 60z M262 6 L290 30 L276 60 L240 60z" fill="#7a8a9e" />
              <path d="M38 18 L50 4 L64 20 L56 17 L50 22 L44 16z M136 16 L150 0 L166 18 L157 14 L150 20 L143 13z M250 20 L262 6 L276 22 L268 18 L262 24 L256 18z M364 20 L372 12 L382 20 L376 18z" fill="#fff" />
            </g>
          ) : null}
          <path d="M0 60 V30 Q60 8 140 26 T280 18 T400 24 V60z" fill={spec.hills[0]} />
          {spec.herbGarden ? (
            <g>
              <rect x="0" y="34" width="400" height="14" fill="#b8654a" />
              {Array.from({ length: 20 }, (_, i) => (
                <path key={i} d={`M${i * 20} 34v14M${i * 20 + 10} 41v7M0 41h400`} stroke="#8a4a32" strokeWidth="1" />
              ))}
              <rect x="0" y="31" width="400" height="4" fill="#d9c0a0" />
              <path d="M188 48 V34 a12 12 0 0 1 24 0 V48z" fill="#5a3d22" />
              <path d="M200 22 v26" stroke="#3a2a1a" strokeWidth="1" />
              <rect x="300" y="16" width="38" height="24" fill="#f5f0e0" />
              <path d="M296 16 L319 2 L342 16z" fill="#7a5ab8" />
              <rect x="314" y="26" width="10" height="14" fill="#7a5532" />
              <rect x="306" y="20" width="6" height="5" fill="#8fd0ec" />
              <rect x="326" y="20" width="6" height="5" fill="#8fd0ec" />
            </g>
          ) : null}
          {spec.glasshouse ? (
            <g>
              <path d="M130 44 V26 Q200 -14 270 26 V44z" fill="#cfe8f4" opacity=".85" stroke="#fff" strokeWidth="1.6" />
              <path d="M170 44 V14 M200 44 V6 M230 44 V14 M130 32 H270" stroke="#fff" strokeWidth="1.2" />
              <path d="M184 18 Q200 -2 216 18z" fill="#e8f4fa" stroke="#fff" strokeWidth="1.2" />
              <path d="M200 2 v-6" stroke="#6e4a2b" strokeWidth="1.4" />
              <path d="M150 40 q6 -14 12 -12 M244 40 q-4 -14 -10 -14" stroke="#4f9a3a" strokeWidth="3" fill="none" />
              {[40, 80, 330, 370].map((x) => (
                <circle key={x} cx={x} cy={30} r="12" fill="#4f8f3c" />
              ))}
            </g>
          ) : null}
          {spec.alps ? (
            <g>
              {Array.from({ length: 9 }, (_, i) => {
                const x = 10 + i * 44 + (i % 2) * 8
                return <path key={i} d={`M${x} 46 L${x + 6} 28 L${x + 12} 46z`} fill="#2f5a2e" />
              })}
              <rect x="300" y="26" width="16" height="14" fill="#f5f0e0" />
              <path d="M298 26 L308 16 L318 26z" fill="#8a3a2a" />
              <rect x="304" y="12" width="5" height="10" fill="#f5f0e0" />
              <path d="M303 12 L306.5 4 L310 12z" fill="#8a3a2a" />
            </g>
          ) : null}

          {spec.forest
            ? Array.from({ length: 26 }, (_, i) => {
                const x = i * 16 - 4
                const h = 26 + ((i * 7) % 12)
                return <path key={i} d={`M${x} 60 L${x + 8} ${60 - h} L${x + 16} 60z`} fill={i % 2 ? '#2f5a2e' : '#3a6a34'} />
              })
            : null}
          {spec.fields ? (
            <g>
              <rect x="300" y="22" width="26" height="16" fill="#efe1c2" />
              <path d="M296 22 L313 10 L330 22z" fill="#b8403a" />
              <rect x="334" y="16" width="8" height="22" fill="#c9d0d8" />
              <path d="M334 16 a4 3 0 0 1 8 0" fill="#9aa8b6" />
            </g>
          ) : null}
          <path d="M0 60 V42 Q90 26 180 40 T400 34 V60z" fill={spec.hills[1]} />
        </svg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})
