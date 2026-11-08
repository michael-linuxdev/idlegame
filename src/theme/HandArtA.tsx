/**
 * Hand-drawn art for Kapitel 7–9 (Kräuterapotheke, Botanischer Garten,
 * Alpen-Alm): one motif per area, visible growth over the five tiers
 * (1 / 10 / 25 / 50 / 100) and the real seasons.
 */
import type { ReactNode } from 'react'
import type { Season } from './ambient'
import { Bees, Cow, House, Roof, Shadow, Smoke, Svg, Window } from './HandParts'

type P = { id: string; tier: number; season?: Season }

/* ————————————— small parts ————————————— */

export function Soil({ cx = 40, cy = 58, rx = 32, ry = 10, winter }: { cx?: number; cy?: number; rx?: number; ry?: number; winter?: boolean }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 1.4} rx={rx + 1.5} ry={ry + 1.5} fill="#7a5a34" opacity=".55" />
      <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={winter ? '#eef2f2' : '#8a6a40'} />
    </g>
  )
}

/** Raised wooden bed */
export function Bed({ x, y, w, h = 8, winter }: { x: number; y: number; w: number; h?: number; winter?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} fill="#a5733f" stroke="#6e4a2b" strokeWidth=".7" />
      <rect x={x + 1.2} y={y - 0.6} width={w - 2.4} height="2.4" fill={winter ? '#eef2f2' : '#6e4a2b'} />
      <path d={`M${x} ${y + h / 2}h${w}`} stroke="#6e4a2b" strokeWidth=".5" opacity=".6" />
    </g>
  )
}

export function Flower({ x, y, c, r = 1.7, center = '#f5c542' }: { x: number; y: number; c: string; r?: number; center?: string }) {
  return (
    <g>
      <path d={`M${x} ${y + 4.5}v-4.5`} stroke="#4f7a2e" strokeWidth=".6" />
      <circle cx={x} cy={y} r={r} fill={c} />
      <circle cx={x} cy={y} r={r * 0.42} fill={center} />
    </g>
  )
}

export function Pot({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-4 0h8l-1.2 6h-5.6z" fill="#c4683a" stroke="#8a4220" strokeWidth=".5" />
      <rect x="-4.6" y="-1" width="9.2" height="1.8" rx=".5" fill="#d47a48" stroke="#8a4220" strokeWidth=".4" />
    </g>
  )
}

export function Jar({ x, y, c = '#efe1c2', lid = '#8a6a40' }: { x: number; y: number; c?: string; lid?: string }) {
  return (
    <g>
      <rect x={x} y={y} width="4.2" height="5" rx="1" fill={c} stroke="#6e4a2b" strokeWidth=".45" />
      <rect x={x - 0.3} y={y - 1.2} width="4.8" height="1.5" rx=".4" fill={lid} />
    </g>
  )
}

function Bundle({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v2`} stroke="#6e4a2b" strokeWidth=".4" />
      <path d={`M${x - 2.2} ${y + 9}L${x} ${y + 2}L${x + 2.2} ${y + 9}z`} fill={c} />
      <rect x={x - 0.9} y={y + 2} width="1.8" height="1.4" fill="#c49a3a" />
    </g>
  )
}

export function Butterfly({ x, y, c = '#fbf6e8' }: { x: number; y: number; c?: string }) {
  return (
    <g className="bee">
      <path d={`M${x} ${y}c-2.4-2.6-4-1-3 1 1 1.4 3 0 3-1zM${x} ${y}c2.4-2.6 4-1 3 1-1 1.4-3 0-3-1z`} fill={c} stroke="#6e4a2b" strokeWidth=".3" />
    </g>
  )
}

export function Glasshouse({ x, w, h, roofH = 10, tint = '#cfe8f4', ground = 64, curved = false, alpha = 0.72 }: { x: number; w: number; h: number; roofH?: number; tint?: string; ground?: number; curved?: boolean; alpha?: number }) {
  const top = ground - h
  const panes = Math.max(2, Math.round(w / 6))
  return (
    <g>
      <rect x={x} y={top} width={w} height={h} fill={tint} opacity={alpha} stroke="#f5f7f8" strokeWidth="1" />
      {curved ? (
        <path d={`M${x} ${top} Q${x + w / 2} ${top - roofH * 1.6} ${x + w} ${top}z`} fill={tint} opacity={alpha + 0.08} stroke="#f5f7f8" strokeWidth="1" />
      ) : (
        <path d={`M${x - 1} ${top} L${x + w / 2} ${top - roofH} L${x + w + 1} ${top}z`} fill={tint} opacity={alpha + 0.13} stroke="#f5f7f8" strokeWidth="1" />
      )}
      {Array.from({ length: panes - 1 }, (_, i) => (
        <path key={i} d={`M${x + ((i + 1) * w) / panes} ${top}V${ground}`} stroke="#f5f7f8" strokeWidth=".7" />
      ))}
      <path d={`M${x} ${top + h / 2}h${w}`} stroke="#f5f7f8" strokeWidth=".7" />
      <path d={`M${x + 2} ${top + 2}l4 6`} stroke="#fff" strokeWidth="1" opacity=".7" />
    </g>
  )
}

function Palm({ x, y, s = 1, c = '#4f9a3a' }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 0 Q-2 -10 0 -20 L1.4 -20 Q0 -10 1 0z" fill="#8a6a40" />
      {[-60, -25, 10, 45, 80, 140, 200].map((a) => (
        <path key={a} d="M0 -20 q7 -4 13 1 q-6 -1 -13 1z" fill={c} transform={`rotate(${a} 0 -20)`} />
      ))}
    </g>
  )
}

function Cactus({ x, y, h = 10, flower }: { x: number; y: number; h?: number; flower?: string }) {
  return (
    <g>
      <rect x={x - 2} y={y - h} width="4" height={h} rx="2" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".4" />
      <path d={`M${x - 2} ${y - h * 0.5}h-2.4v-${h * 0.3}`} stroke="#5f9e45" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      <path d={`M${x + 2} ${y - h * 0.4}h2.4v-${h * 0.35}`} stroke="#5f9e45" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {flower ? <circle cx={x} cy={y - h - 0.4} r="1.3" fill={flower} /> : null}
    </g>
  )
}

export function Rock({ x, y, w = 12, h = 7, snow }: { x: number; y: number; w?: number; h?: number; snow?: boolean }) {
  return (
    <g>
      <path d={`M${x} ${y} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w} ${y}z`} fill="#a69a8a" stroke="#7a6e5e" strokeWidth=".6" />
      <path d={`M${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.55} ${y}`} stroke="#8a7e6e" strokeWidth=".5" />
      {snow ? <path d={`M${x + w * 0.16} ${y - h * 0.8} L${x + w * 0.2} ${y - h} L${x + w * 0.62} ${y - h * 1.1} L${x + w * 0.8} ${y - h * 0.6}`} stroke="#fff" strokeWidth="1.8" fill="none" strokeLinecap="round" /> : null}
    </g>
  )
}

export function Conifer({ x, y, s = 1, snow }: { x: number; y: number; s?: number; snow?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x="-1" y="-3" width="2" height="3" fill="#6e4a2b" />
      <path d="M0 -26 L-7 -12 L-4 -12 L-9 -3 L9 -3 L4 -12 L7 -12z" fill="#2f6a3a" />
      {snow ? <path d="M-4 -12h8M-7 -3.6h14M0 -26l-3 6h6z" stroke="#fff" strokeWidth="1.4" fill="none" /> : null}
    </g>
  )
}

function Edelweiss({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 4V0" stroke="#7a8a6a" strokeWidth=".6" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <ellipse key={a} cx="0" cy="-1.8" rx=".9" ry="1.9" fill="#f6f4ec" stroke="#c9c4b0" strokeWidth=".25" transform={`rotate(${a})`} />
      ))}
      <circle r=".9" fill="#e8d88a" />
    </g>
  )
}

function Gentian({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <path d={`M${x} ${y + 4}v-3`} stroke="#4f7a2e" strokeWidth=".6" />
      <path d={`M${x - 1.6} ${y - 2.6}h3.2l-.6 3.6h-2z`} fill="#2e5fc4" />
      <path d={`M${x - 1.6} ${y - 2.6}l-.6 -.8M${x + 1.6} ${y - 2.6}l.6 -.8`} stroke="#2e5fc4" strokeWidth=".7" />
    </g>
  )
}

export function Bunting({ y = 26, n = 7, x0 = 4, x1 = 76 }: { y?: number; n?: number; x0?: number; x1?: number }) {
  const step = (x1 - x0) / n
  return (
    <g>
      <path d={`M${x0} ${y} Q40 ${y + 8} ${x1} ${y}`} stroke="#6e4a2b" strokeWidth=".5" fill="none" />
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + step * (i + 0.5)
        const t = (x - x0) / (x1 - x0)
        const yy = y + 8 * 2 * t * (1 - t)
        return <path key={i} d={`M${x - 2} ${yy}h4l-2 3.6z`} fill={['#e2453c', '#fbf6e8', '#3d6fd1', '#f5c542'][i % 4]} />
      })}
    </g>
  )
}

export function Snowcap({ d }: { d: string }) {
  return <path d={d} stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" />
}

/* ————————————— Kapitel 7: Kräuterapotheke ————————————— */

export function Kraeuter({ id, tier, season }: P): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'kamille': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg>
          <Soil winter={winter} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              {Array.from({ length: 7 }, (_, i) => {
                const x = 14 + i * 8.6 + (r % 2) * 3
                const y = 62 - r * 4
                if (winter) return <path key={i} d={`M${x - 2} ${y}l2-3 2 3`} stroke="#c9b48a" strokeWidth=".8" fill="none" />
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y + 1} rx="3" ry="1.6" fill="#8ab85a" />
                    {!spring ? <Flower x={x} y={y - 2} c={autumn ? '#e8e0c8' : '#fbf6e8'} r={1.4} /> : null}
                  </g>
                )
              })}
            </g>
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M58 40h12l-1.6 7h-8.8z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".6" />
              <path d="M59 40q5 -6 10 0" stroke="#6e4a2b" strokeWidth=".8" fill="none" />
              {[61, 64, 67].map((x) => (
                <circle key={x} cx={x} cy="39.6" r="1.3" fill="#fbf6e8" />
              ))}
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={24} y={36} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'pfefferminze': {
      const clumps = Math.min(6, 1 + tier)
      return (
        <Svg>
          <Shadow rx={32} />
          <Bed x={8} y={52} w={64} h={10} winter={winter} />
          {Array.from({ length: clumps }, (_, i) => {
            const x = 14 + i * 10.4
            return winter ? (
              <path key={i} d={`M${x - 4} 52q4-6 8 0`} fill="#f4f6f6" stroke="#d8dee0" strokeWidth=".5" />
            ) : (
              <g key={i}>
                <ellipse cx={x} cy={48} rx="5" ry="4.6" fill="#3f8a4a" />
                <ellipse cx={x - 2} cy={46} rx="2.4" ry="1.6" fill="#5fae62" />
                <ellipse cx={x + 2} cy={49} rx="2.4" ry="1.6" fill="#5fae62" />
                {season === 'summer' ? <path d={`M${x} 44v-3`} stroke="#c7a3e0" strokeWidth="1.6" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M62 42h8l-1 6h-6z" fill="#7a9aa8" stroke="#4a6a78" strokeWidth=".5" />
              <path d="M62 43l-5 -3" stroke="#7a9aa8" strokeWidth="1.2" />
              <path d="M66 42q2-4 4 0" stroke="#4a6a78" strokeWidth=".6" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? <Bees n={3} cy={36} /> : null}
        </Svg>
      )
    }
    case 'ringelblume': {
      const n = Math.min(14, 4 + tier * 2)
      return (
        <Svg>
          <Soil cy={57} rx={30} ry={11} winter={winter} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <ellipse key={i} cx={40 + Math.cos(a) * 30} cy={57 + Math.sin(a) * 11} rx="2.8" ry="1.8" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".4" />
          })}
          {!winter
            ? Array.from({ length: n }, (_, i) => {
                const x = 18 + ((i * 17) % 46)
                const y = 50 + ((i * 7) % 12)
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y + 2.4} rx="2.6" ry="1.4" fill="#6f9a48" />
                    {!spring || i % 3 === 0 ? <Flower x={x} y={y} c={autumn && i % 2 ? '#d9731a' : '#f08a2c'} r={1.9} center="#c4551a" /> : null}
                  </g>
                )
              })
            : null}
          {tier >= 4 ? (
            <g>
              <path d="M40 46v-12" stroke="#8a6a40" strokeWidth="1" />
              <rect x="34" y="30" width="12" height="5" rx="1" fill="#efe1c2" stroke="#8a6a40" strokeWidth=".5" />
              <circle cx="40" cy="32.5" r="1.4" fill="#f08a2c" />
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={60} y={38} c="#f5c542" /> : null}
        </Svg>
      )
    }
    case 'johanniskraut': {
      const bushes = Math.min(5, tier + 1)
      const bloom = season === 'summer'
      return (
        <Svg>
          <ellipse cx="40" cy="58" rx="34" ry="11" fill={winter ? '#e8eef0' : '#8cc06a'} opacity=".8" />
          {Array.from({ length: bushes }, (_, i) => {
            const x = 14 + i * 13
            const h = 16 + (i % 2) * 4
            return (
              <g key={i}>
                {Array.from({ length: 5 }, (_, k) => (
                  <path key={k} d={`M${x} 62q${(k - 2) * 1.5} -${h * 0.6} ${(k - 2) * 3} -${h}`} stroke={winter ? '#a08a6a' : '#5f8a3a'} strokeWidth="1" fill="none" />
                ))}
                {!winter ? <ellipse cx={x} cy={62 - h * 0.6} rx="5" ry={h * 0.32} fill="#6f9a48" opacity=".85" /> : null}
                {bloom || (spring && i % 2 === 0)
                  ? Array.from({ length: 5 }, (_, k) => <circle key={k} cx={x - 5 + k * 2.5} cy={62 - h + (k % 2) * 2} r="1.5" fill="#f5c542" stroke="#d99a1a" strokeWidth=".3" />)
                  : null}
                {autumn ? Array.from({ length: 4 }, (_, k) => <circle key={k} cx={x - 4 + k * 2.6} cy={62 - h + 1} r=".9" fill="#8a3a2a" />) : null}
              </g>
            )
          })}
          {tier >= 4 ? (
            <g>
              <path d="M8 40h20" stroke="#6e4a2b" strokeWidth="1.2" />
              <path d="M10 40v12M26 40v12" stroke="#6e4a2b" strokeWidth="1" />
              {[13, 18, 23].map((x) => (
                <Bundle key={x} x={x} y={40} c="#d9b84a" />
              ))}
            </g>
          ) : null}
          {tier >= 3 && !winter ? <Bees n={tier} cy={34} /> : null}
        </Svg>
      )
    }
    case 'salbei': {
      const pots = Math.min(6, tier + 1)
      return (
        <Svg>
          <Shadow rx={32} />
          <rect x="6" y="60" width="68" height="3" rx="1" fill="#a69a8a" />
          {Array.from({ length: pots }, (_, i) => {
            const x = 12 + i * 11.2
            const big = i % 2 === 0
            return (
              <g key={i}>
                <ellipse cx={x} cy={53} rx={big ? 5.4 : 4.4} ry={big ? 5 : 4} fill={winter ? '#b8c0b4' : '#9fb8a0'} />
                <ellipse cx={x - 1.6} cy={51} rx="2" ry="1.2" fill="#c4d4c0" />
                {season === 'summer' && big ? <path d={`M${x} 48v-5`} stroke="#8a6ac4" strokeWidth="1.6" strokeLinecap="round" /> : null}
                {winter ? <path d={`M${x - 4} 50q4-3.6 8 0`} stroke="#fff" strokeWidth="1.8" fill="none" /> : null}
                <Pot x={x} y={55} s={big ? 1 : 0.85} />
              </g>
            )
          })}
          {tier >= 4 ? <path d="M58 40h14v-6h-14z" fill="#efe1c2" stroke="#8a6a40" strokeWidth=".5" /> : null}
          {tier >= 4 ? <path d="M61 37h8" stroke="#6f8a6a" strokeWidth="1.2" /> : null}
        </Svg>
      )
    }
    case 'trockenboden': {
      const bundles = Math.min(8, 2 + tier)
      return (
        <Svg>
          <Shadow rx={32} />
          <House x={10} w={52} h={26} wall="#e8d4ac" roof="#6e4a2b" timber steep={14} />
          <rect x="20" y="40" width="32" height="10" fill="#3a2a1a" />
          <path d="M20 41h32" stroke="#6e4a2b" strokeWidth="1" />
          {Array.from({ length: bundles }, (_, i) => (
            <Bundle key={i} x={22.4 + i * 4} y={41} c={['#7a9a4a', '#d9b84a', '#9fb8a0', '#c77dd1', '#f08a2c'][i % 5]!} />
          ))}
          <rect x="31" y="54" width="10" height="10" fill="#7a5532" />
          {tier >= 3 ? <path d="M64 64V40M68 64V40M64 46h4M64 52h4M64 58h4" stroke="#8a6a40" strokeWidth="1" /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="66" y="58" width="9" height="6" fill="#c9a46b" stroke="#6e4a2b" strokeWidth=".5" />
              <path d="M67 58l2-3 2 3 2-3 1 3" fill="#9fb8a0" />
            </g>
          ) : null}
          {winter ? <path d="M7 38 L36 24 L65 38" stroke="#fff" strokeWidth="2.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'destille': {
      const bottles = Math.min(5, tier)
      return (
        <Svg>
          <Shadow rx={32} />
          <path d="M6 34h40l-4 -8h-32z" fill="#a5531a" stroke="#6e2a12" strokeWidth=".6" />
          <path d="M10 34v30M42 34v30" stroke="#6e4a2b" strokeWidth="1.6" />
          <rect x="14" y="56" width="18" height="8" fill="#8a7a6a" stroke="#5a4a3a" strokeWidth=".6" />
          {tier >= 2 ? <path d="M20 58q3-4 6 0" fill="#f08a2c" className="fest-glow" /> : null}
          <ellipse cx="23" cy="50" rx="9" ry="7" fill="#d9844a" stroke="#8a4220" strokeWidth=".7" />
          <path d="M23 43q0-6 6-6 h12" stroke="#d9844a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="20" cy="47" rx="3" ry="1.6" fill="#f0b07a" opacity=".7" />
          <rect x="40" y="38" width="8" height="16" rx="2" fill="#c47a48" stroke="#8a4220" strokeWidth=".6" />
          <path d="M44 54v4" stroke="#8fd0ec" strokeWidth="1" strokeDasharray="1 1.4" />
          {Array.from({ length: bottles }, (_, i) => (
            <g key={i}>
              <path d={`M${50 + i * 5} 64v-6l1-2v-2h1.4v2l1 2v6z`} fill={['#8fd0ec', '#c7a3e0', '#f5e08a', '#9fd0a0', '#f2b8b0'][i]} stroke="#4a6a78" strokeWidth=".4" />
            </g>
          ))}
          {tier >= 3 ? <Smoke x={23} y={40} /> : null}
          {tier >= 5 ? <path d="M48 44h24v-8h-24z" fill="#fbf3e0" stroke="#8a6a40" strokeWidth=".5" /> : null}
          {tier >= 5 ? <circle cx="52" cy="40" r="2" fill="#7a9a4a" /> : null}
          {winter ? <path d="M8 26h36" stroke="#fff" strokeWidth="2" /> : null}
        </Svg>
      )
    }
    case 'salbenkueche': {
      const jars = Math.min(6, tier + 1)
      return (
        <Svg>
          <Shadow rx={32} />
          <House x={8} w={34} h={22} wall="#f5f0e0" roof="#7a5ab8" steep={13} />
          <rect x="32" y="26" width="5" height="10" fill="#8a7a6a" />
          <Smoke x={34.5} y={24} />
          <Window x={12} y={48} lit={tier >= 3} />
          <rect x="24" y="50" width="8" height="14" fill="#7a5532" />
          <rect x="46" y="52" width="28" height="3" fill="#a5733f" />
          <path d="M48 55v9M72 55v9" stroke="#6e4a2b" strokeWidth="1.2" />
          {Array.from({ length: jars }, (_, i) => (
            <Jar key={i} x={47.6 + i * 4.4} y={47} c={i % 2 ? '#fbf6e8' : '#e8d4f0'} lid={i % 2 ? '#7a5ab8' : '#c4683a'} />
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M66 44h7l-1 4h-5z" fill="#a69a8a" stroke="#6a5e4e" strokeWidth=".5" />
              <path d="M70 44l3 -5" stroke="#6a5e4e" strokeWidth="1.2" />
            </g>
          ) : null}
          {tier >= 4 ? <Flower x={14} y={60} c="#f08a2c" /> : null}
          {tier >= 4 ? <Flower x={18} y={61} c="#c77dd1" /> : null}
          {winter ? <path d="M5 42 L25 29 L45 42" stroke="#fff" strokeWidth="2.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'teestube': {
      const tables = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg>
          <Shadow rx={34} />
          <House x={32} w={40} h={22} wall="#fbf3e0" roof="#3f7a30" steep={12} />
          <Window x={36} y={48} lit={tier >= 2} />
          <Window x={60} y={48} lit={tier >= 2} />
          <rect x="49" y="50" width="8" height="14" fill="#7a5532" />
          <path d="M44 34 h18 v4 h-18z" fill="#fbf6e8" stroke="#3f7a30" strokeWidth=".5" />
          <path d="M50 36h6" stroke="#3f7a30" strokeWidth="1" />
          {Array.from({ length: tables }, (_, i) => {
            const x = 12 + (i % 2) * 12
            const y = 52 + Math.floor(i / 2) * 9 + (i % 2) * 4
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="6" ry="2.2" fill="#fbf6e8" stroke="#a5733f" strokeWidth=".5" />
                <path d={`M${x} ${y + 2}v6`} stroke="#6e4a2b" strokeWidth="1" />
                <ellipse cx={x - 1.4} cy={y - 1.6} rx="2" ry="1.6" fill="#e0485e" />
                <path d={`M${x + 0.6} ${y - 2}l1.6 -1`} stroke="#e0485e" strokeWidth=".7" />
                <rect x={x + 2} y={y - 2} width="1.8" height="1.4" fill="#fbf6e8" stroke="#a5733f" strokeWidth=".3" />
              </g>
            )
          })}
          {tier >= 5 ? <Bunting y={30} n={8} x0={4} x1={34} /> : null}
          {tier >= 3 ? <Pot x={30} y={58} /> : null}
          {tier >= 3 && !winter ? <ellipse cx="30" cy="55" rx="3.4" ry="3" fill="#5fae62" /> : null}
          {winter ? <path d="M29 34 L52 22 L75 34" stroke="#fff" strokeWidth="2.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'apothekergarten': {
      const quads = Math.min(4, tier)
      const cols = ['#c77dd1', '#f5c542', '#fbf6e8', '#e0485e']
      return (
        <Svg>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill="#d9c79a" />
          {[
            [10, 46],
            [44, 46],
            [10, 57],
            [44, 57],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="26" height="8" rx="2" fill={winter ? '#c9d4c0' : '#4f8a3a'} />
              <rect x={x! + 1.6} y={y! + 1.4} width="22.8" height="5.2" rx="1.4" fill={winter ? '#eef2f2' : '#7a5a34'} />
              {i < quads && !winter
                ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={x! + 4 + k * 3.6} cy={y! + 4} r="1.5" fill={spring && k % 2 ? '#8ab85a' : cols[i]} />)
                : null}
            </g>
          ))}
          <circle cx="40" cy="55" r="4" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" />
          <path d="M40 55l2.6-2" stroke="#4a3a2a" strokeWidth=".8" />
          {tier >= 4 ? (
            <g>
              <path d="M26 42V30 Q40 18 54 30 V42" stroke="#6e4a2b" strokeWidth="1.6" fill="none" />
              {!winter ? Array.from({ length: 7 }, (_, k) => <circle key={k} cx={28 + k * 4} cy={30 - Math.sin((k / 6) * Math.PI) * 9} r="1.8" fill={k % 2 ? '#e0485e' : '#5f9e45'} />) : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M66 42q4 -8 8 0z" fill="#d9b84a" stroke="#8a6a40" strokeWidth=".5" />
              <path d="M66.6 40h6.8M67.6 38h4.8" stroke="#8a6a40" strokeWidth=".4" />
              {!winter ? <Bees n={3} cx={64} cy={34} /> : null}
            </g>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}

/* ————————————— Kapitel 8: Botanischer Garten ————————————— */

export function Botanik({ id, tier, season }: P): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'palmenhaus': {
      const palms = Math.min(5, 1 + tier)
      return (
        <Svg>
          <Shadow rx={34} />
          {Array.from({ length: palms }, (_, i) => {
            const x = [40, 30, 50, 16, 64][i]!
            const wing = i >= 3
            return <Palm key={i} x={x} y={64} s={wing ? 0.55 : 0.75 + tier * 0.05 - (i ? 0.12 : 0)} c={i % 2 ? '#5fae4a' : '#3f8a3a'} />
          })}
          {tier >= 2 ? <Glasshouse x={6} w={18} h={14} roofH={6} alpha={0.42} /> : null}
          {tier >= 4 ? <Glasshouse x={56} w={18} h={14} roofH={6} alpha={0.42} /> : null}
          <Glasshouse x={22} w={36} h={18 + tier} roofH={10} curved alpha={0.42} />
          {winter ? <path d={`M24 ${44 - tier} Q40 ${30 - tier} 56 ${44 - tier}`} stroke="#fff" strokeWidth="1.6" fill="none" opacity=".9" /> : null}
          {tier >= 3 ? <rect x="36" y="55" width="8" height="9" fill="#e8f4fa" stroke="#9ab0bc" strokeWidth=".6" /> : null}
          {tier >= 5 ? <path d={`M40 ${30 - tier}v-6l5 2-5 2`} fill="#e2453c" stroke="#6e4a2b" strokeWidth=".5" /> : null}
        </Svg>
      )
    }
    case 'kakteenhaus': {
      const n = Math.min(6, 1 + tier)
      const bloom = season === 'summer' || spring
      return (
        <Svg>
          <Shadow rx={34} />
          <Glasshouse x={8} w={42} h={18} roofH={10} tint="#f0e4c8" />
          <rect x="26" y="52" width="6" height="12" fill="#e8f4fa" stroke="#9ab0bc" strokeWidth=".5" />
          <ellipse cx="62" cy="62" rx="14" ry="4" fill="#e8d4a0" />
          {Array.from({ length: n }, (_, i) => {
            const inside = i >= 3
            const x = inside ? 14 + (i - 3) * 14 : 54 + i * 7
            return <Cactus key={i} x={x} y={inside ? 62 : 63} h={8 + ((i * 5) % 7)} flower={bloom && i % 2 === 0 ? (i % 4 ? '#f28ab2' : '#f5c542') : undefined} />
          })}
          {tier >= 4 ? (
            <g>
              <ellipse cx="72" cy="50" rx="3.4" ry="4.4" fill="#5f9e45" />
              <ellipse cx="69" cy="45" rx="2.4" ry="3" fill="#5f9e45" transform="rotate(-30 69 45)" />
              {bloom ? <circle cx="68" cy="42" r="1.2" fill="#e0485e" /> : null}
            </g>
          ) : null}
          {winter ? <path d="M7 46 L29 36 L51 46" stroke="#fff" strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'orchideenhaus': {
      const n = Math.min(8, 2 + tier)
      return (
        <Svg>
          <Shadow rx={34} />
          <Glasshouse x={8} w={64} h={22} roofH={11} tint="#e8dcf4" />
          <path d="M10 44h60" stroke="#8a6a40" strokeWidth=".8" />
          {Array.from({ length: n }, (_, i) => {
            const x = 13 + i * 7.6
            const c = ['#c77dd1', '#fbf6e8', '#f28ab2', '#f5c542'][i % 4]
            return (
              <g key={i}>
                <path d={`M${x} 44v4`} stroke="#6e4a2b" strokeWidth=".4" />
                <path d={`M${x - 2} 48h4l-.6 3h-2.8z`} fill="#a5733f" />
                <path d={`M${x} 48q2-4 4-3`} stroke="#4f8a3a" strokeWidth=".7" fill="none" />
                <circle cx={x + 3.6} cy={45} r="1.6" fill={c} />
                <circle cx={x + 3.6} cy={45} r=".6" fill="#8a3a6a" />
              </g>
            )
          })}
          <rect x="34" y="54" width="10" height="10" fill="#f4eefa" stroke="#9a8ab0" strokeWidth=".5" />
          {tier >= 4 ? <path d="M6 64q4-8 8-4M66 64q4-8 8-4" stroke="#4f8a3a" strokeWidth="1.4" fill="none" /> : null}
          {tier >= 5 ? <Butterfly x={64} y={30} c="#3d6fd1" /> : null}
          {winter ? <path d="M7 42 L40 31 L73 42" stroke="#fff" strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'victoriahaus': {
      const pads = Math.min(5, 1 + tier)
      return (
        <Svg>
          {tier >= 4 ? <path d="M6 64V40 Q40 6 74 40 V64" fill="#e8f4fa" opacity=".45" stroke="#f5f7f8" strokeWidth="1" /> : null}
          {tier >= 4 ? <path d="M23 64V26M40 64V17M57 64V26" stroke="#f5f7f8" strokeWidth=".7" /> : null}
          <ellipse cx="40" cy="57" rx="34" ry="11" fill="#bdb3a0" />
          <ellipse cx="40" cy="56" rx="32" ry="9.4" fill="#3f7a8a" />
          {Array.from({ length: pads }, (_, i) => {
            const x = 18 + ((i * 19) % 46)
            const y = 53 + ((i * 7) % 7)
            const r = 6 + (i % 2) * 2
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx={r} ry={r * 0.4} fill="#4f8a3a" stroke="#a83a3a" strokeWidth="1" />
                <path d={`M${x - r * 0.7} ${y}h${r * 1.4}M${x} ${y - r * 0.3}v${r * 0.6}`} stroke="#3f7a30" strokeWidth=".4" />
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <ellipse cx="50" cy="51" rx="4" ry="2.2" fill={tier >= 5 ? '#f28ab2' : '#fbf6e8'} />
              <ellipse cx="50" cy="50" rx="2.4" ry="1.6" fill="#fbf6e8" />
            </g>
          ) : null}
          {winter ? <Smoke x={20} y={44} /> : null}
          {tier >= 5 ? <Fish_ x={30} y={60} /> : null}
        </Svg>
      )
    }
    case 'rosarium': {
      const arches = Math.min(3, 1 + Math.floor(tier / 2))
      const rose = season === 'summer' ? '#e0485e' : spring ? '#5f9e45' : autumn ? '#c4553f' : undefined
      return (
        <Svg>
          <ellipse cx="40" cy="58" rx="36" ry="12" fill={winter ? '#e8eef0' : '#8cc06a'} opacity=".8" />
          <path d="M6 62 Q40 54 74 62" stroke="#e2d4ae" strokeWidth="4" fill="none" />
          {Array.from({ length: arches }, (_, i) => {
            const x = 14 + i * 22
            return (
              <g key={i}>
                <path d={`M${x} 62V40 Q${x + 9} 28 ${x + 18} 40 V62`} stroke="#6e4a2b" strokeWidth="1.4" fill="none" />
                {rose
                  ? Array.from({ length: 9 }, (_, k) => {
                      const t = k / 8
                      const ang = Math.PI * (1 - t)
                      const cx = x + 9 + Math.cos(ang) * 9
                      const cy = 40 - Math.sin(ang) * 10 + (k === 0 || k === 8 ? 10 : 0)
                      return <circle key={k} cx={cx} cy={cy} r="2" fill={k % 2 ? '#5f9e45' : season === 'summer' ? ['#e0485e', '#f28ab2', '#fbf6e8'][i % 3] : rose} />
                    })
                  : null}
              </g>
            )
          })}
          {Array.from({ length: Math.min(6, tier + 1) }, (_, i) => (
            <g key={i}>
              <ellipse cx={10 + i * 12} cy={66} rx="3.6" ry="2.4" fill={winter ? '#c9d0c4' : '#4f8a3a'} />
              {season === 'summer' ? <circle cx={10 + i * 12} cy={64.6} r="1.3" fill={['#e0485e', '#f28ab2', '#f5c542'][i % 3]} /> : null}
            </g>
          ))}
          {tier >= 5 && season === 'summer' ? <Butterfly x={60} y={30} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'steingarten': {
      const rocks = Math.min(5, 1 + tier)
      return (
        <Svg>
          <ellipse cx="40" cy="58" rx="34" ry="11" fill="#c9bfa8" />
          {Array.from({ length: rocks }, (_, i) => (
            <Rock key={i} x={8 + ((i * 23) % 52)} y={64 - (i % 3) * 4} w={12 + (i % 2) * 6} h={7 + (i % 3) * 3} snow={winter} />
          ))}
          {!winter
            ? Array.from({ length: 3 + tier * 2 }, (_, i) => (
                <ellipse key={i} cx={10 + ((i * 13) % 60)} cy={60 + ((i * 5) % 6)} rx="2.6" ry="1.4" fill={spring || season === 'summer' ? ['#f28ab2', '#fbf6e8', '#c77dd1', '#f5c542'][i % 4] : '#8aa060'} />
              ))
            : null}
          {tier >= 4 ? <Conifer x={66} y={58} s={0.5} snow={winter} /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="34" y="40" width="10" height="5" rx="1" fill="#efe1c2" stroke="#8a6a40" strokeWidth=".5" />
              <path d="M39 45v6" stroke="#8a6a40" strokeWidth=".8" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'arboretum': {
      const crown = winter ? '#c9d0c4' : autumn ? '#d9a33a' : '#5f9e45'
      return (
        <Svg>
          <Shadow rx={34} />
          <ellipse cx="40" cy="62" rx="34" ry="6" fill={winter ? '#eef2f2' : '#8cc06a'} />
          <Conifer x={18} y={64} s={0.8 + tier * 0.06} snow={winter} />
          {tier >= 2 ? (
            <g transform="translate(42 64)">
              <path d="M-1.4 0L-1 -16h2L1.4 0z" fill="#7a5532" />
              <circle cx="0" cy="-24" r={8 + tier} fill={crown} />
              <circle cx="-5" cy="-19" r="5" fill={crown} />
            </g>
          ) : null}
          {tier >= 3 ? (
            <g transform="translate(64 64)">
              <path d="M-1 0V-14" stroke="#7a5532" strokeWidth="2" />
              {[-1, 0, 1].map((k) => (
                <path key={k} d={`M0 ${-14 - k * 6} q-7 -2 -8 -6 q6 0 8 4 q2 -4 8 -4 q-1 4 -8 6z`} fill={winter ? '#c9d0c4' : autumn ? '#f5c542' : '#7fae58'} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              <rect x="28" y="58" width="6" height="4" fill="#efe1c2" stroke="#6e4a2b" strokeWidth=".4" />
              <path d="M31 62v3" stroke="#6e4a2b" strokeWidth=".6" />
            </g>
          ) : null}
          {tier >= 5 ? <path d="M4 64h20" stroke="#a5733f" strokeWidth="2" /> : null}
          {tier >= 5 ? <path d="M6 64v3M22 64v3" stroke="#6e4a2b" strokeWidth="1" /> : null}
        </Svg>
      )
    }
    case 'farnschlucht': {
      const ferns = Math.min(7, 2 + tier)
      const frond = winter ? '#8a9a7a' : autumn ? '#a5893a' : '#4f9a4a'
      return (
        <Svg>
          <path d="M2 66 L10 36 L22 40 L30 66z" fill="#8a7e6e" />
          <path d="M78 66 L70 34 L58 40 L50 66z" fill="#7a6e5e" />
          <ellipse cx="40" cy="64" rx="16" ry="4" fill={winter ? '#cfe2ee' : '#5f9ec4'} />
          {tier >= 3 ? <path d="M36 40 Q38 52 38 62" stroke={winter ? '#e8f4fa' : '#8fd0ec'} strokeWidth="3" fill="none" strokeDasharray="3 2" className="orchard-stream" /> : null}
          {Array.from({ length: ferns }, (_, i) => {
            const x = 8 + ((i * 17) % 64)
            const y = 62 - ((i * 5) % 10)
            return (
              <g key={i} transform={`translate(${x} ${y}) rotate(${(i % 3) * 12 - 12})`}>
                {[-30, 0, 30].map((a) => (
                  <path key={a} d="M0 0 q-2 -8 0 -14" stroke={frond} strokeWidth="2.6" strokeDasharray="1.4 .6" fill="none" transform={`rotate(${a})`} />
                ))}
              </g>
            )
          })}
          <path d="M10 40q6-2 12 0M60 40q6-2 10-4" stroke="#5f8a4a" strokeWidth="2" fill="none" />
          {tier >= 5 ? <path d="M30 36 h20" stroke="#a5733f" strokeWidth="2.4" /> : null}
          {tier >= 5 ? <path d="M30 36v-4M50 36v-4M30 32h20" stroke="#6e4a2b" strokeWidth=".8" /> : null}
        </Svg>
      )
    }
    case 'herbarium': {
      const frames = Math.min(4, tier)
      return (
        <Svg>
          <Shadow rx={34} />
          <rect x="10" y="40" width="50" height="24" fill="#efe1c2" stroke="#8a7a6a" strokeWidth=".7" />
          <path d="M6 40 L35 28 L64 40z" fill="#6e4a2b" />
          <path d="M14 36h42" stroke="#bdb3a0" strokeWidth="1" />
          {[16, 26, 44, 54].map((x) => (
            <rect key={x} x={x - 1.4} y="42" width="2.8" height="22" fill="#fbf6e8" stroke="#bdb3a0" strokeWidth=".4" />
          ))}
          <rect x="30" y="48" width="10" height="16" fill="#5a3d22" />
          <Window x={19} y={48} lit={tier >= 3} />
          <Window x={46} y={48} lit={tier >= 3} />
          {Array.from({ length: frames }, (_, i) => (
            <g key={i}>
              <rect x={63} y={44 + i * 5} width="12" height="4.4" fill="#fbf6e8" stroke="#a5733f" strokeWidth=".6" />
              <path d={`M65 ${46.2 + i * 5}q4 -2 8 0`} stroke="#5f9e45" strokeWidth=".7" fill="none" />
            </g>
          ))}
          {tier >= 5 ? <path d="M35 28v-6l4 1.6-4 1.6" fill="#3f7a30" stroke="#6e4a2b" strokeWidth=".5" /> : null}
          {winter ? <path d="M7 40 L35 28 L63 40" stroke="#fff" strokeWidth="2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'glaskuppel': {
      const r = 18 + tier * 2
      return (
        <Svg>
          <Shadow rx={34} />
          <Palm x={40} y={64} s={(r - 5) / 31} />
          {tier >= 3 ? <Palm x={28} y={64} s={0.7} c="#5fae4a" /> : null}
          {tier >= 3 ? <Palm x={52} y={64} s={0.6} c="#5fae4a" /> : null}
          <path d={`M${40 - r} 64 A${r} ${r} 0 0 1 ${40 + r} 64z`} fill="#cfe8f4" opacity=".36" stroke="#f5f7f8" strokeWidth="1" />
          {[-0.6, -0.2, 0.2, 0.6].map((k) => (
            <path key={k} d={`M40 ${64 - r} Q${40 + k * r * 1.5} ${64 - r * 0.5} ${40 + k * r * 1.5} 64`} stroke="#f5f7f8" strokeWidth=".6" fill="none" />
          ))}
          <path d={`M${40 - r * 0.86} ${64 - r * 0.5}h${r * 1.72}`} stroke="#f5f7f8" strokeWidth=".6" />
          <path d={`M${40 - r * 0.6} ${64 - r * 0.62}q4 -6 10 -8`} stroke="#fff" strokeWidth="1.2" fill="none" opacity=".7" />
          {tier >= 4 ? <circle cx="40" cy={64 - r - 1.4} r="1.8" fill="#e0a21a" /> : null}
          {tier >= 5 ? <path d={`M40 ${64 - r - 3}v-7l5 2-5 2`} fill="#e2453c" stroke="#6e4a2b" strokeWidth=".5" /> : null}
          {winter ? <path d={`M${40 - r * 0.7} ${64 - r * 0.72} Q40 ${64 - r * 1.2} ${40 + r * 0.7} ${64 - r * 0.72}`} stroke="#fff" strokeWidth="1.6" fill="none" /> : null}
        </Svg>
      )
    }
  }
  return null
}

function Fish_({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="ha-fish">
      <ellipse cx="0" cy="0" rx="3.4" ry="1.4" fill="#f08a2c" />
      <path d="M-3.2 0l-2 -1.6v3.2z" fill="#f08a2c" />
      </g>
    </g>
  )
}

/* ————————————— Kapitel 9: Alpen-Alm ————————————— */

function Bell({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 1} ${y}h2l.5 2h-3z`} fill="#e0a21a" />
}

function AlmCow({ x, y, flip, brown }: { x: number; y: number; flip?: boolean; brown?: boolean }) {
  return (
    <g>
      <Cow x={x} y={y} flip={flip} brown={brown} />
      <Bell x={x + (flip ? -8 : 8)} y={y + 1} />
    </g>
  )
}

function Slope({ winter, color = '#8cc06a' }: { winter?: boolean; color?: string }) {
  return <path d="M2 66 Q20 40 78 44 V66z" fill={winter ? '#eef2f4' : color} />
}

export function Alm({ id, tier, season }: P): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const grass = autumn ? '#b0b864' : '#8cc06a'
  switch (id) {
    case 'almwiese': {
      const n = 8 + tier * 5
      return (
        <Svg>
          <Slope winter={winter} color={grass} />
          {!winter
            ? Array.from({ length: n }, (_, i) => {
                const x = 8 + ((i * 17) % 66)
                const y = 50 + ((i * 11) % 14)
                const c = ['#fbf6e8', '#f5c542', '#c77dd1', '#3d6fd1', '#e0485e'][i % 5]
                return spring || season === 'summer' || i % 3 === 0 ? <Flower key={i} x={x} y={y} c={c!} r={1.3} /> : null
              })
            : null}
          {tier >= 3 ? (
            <g>
              <path d="M58 60V40M54 46h8M55 52h6" stroke="#6e4a2b" strokeWidth="1" />
              {!winter ? <path d="M58 38 Q50 48 54 60 H62 Q66 48 58 38z" fill="#d9c070" stroke="#b8962a" strokeWidth=".5" /> : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M70 58V42M66 48h8M67 54h6" stroke="#6e4a2b" strokeWidth="1" />
              {!winter ? <path d="M70 40 Q63 49 66 58 H74 Q77 49 70 40z" fill="#d9c070" stroke="#b8962a" strokeWidth=".5" /> : null}
            </g>
          ) : null}
          {tier >= 4 && !winter ? <Bees n={3} cy={40} cx={28} /> : null}
        </Svg>
      )
    }
    case 'kuhherde':
      return (
        <Svg>
          <Slope winter={winter} color={grass} />
          {Array.from({ length: 6 }, (_, i) => (
            <path key={i} d={`M${6 + i * 12} 66 l6 -12`} stroke="#8a6a40" strokeWidth="1.4" />
          ))}
          <path d="M4 60 Q40 54 76 58" stroke="#a5733f" strokeWidth="1.2" fill="none" />
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
              <path d="M30 56 L40 48 L50 56z" fill="#6e4a2b" />
              <rect x="32" y="56" width="16" height="8" fill="#a5733f" />
              <path d="M30 56 L40 48 L50 56" stroke="#fff" strokeWidth="2" fill="none" />
            </g>
          )}
          {tier >= 4 ? (
            <g>
              <rect x="6" y="44" width="10" height="4" rx="1" fill="#8a6a40" />
              <path d="M8 48v3M14 48v3" stroke="#6e4a2b" strokeWidth=".8" />
            </g>
          ) : null}
        </Svg>
      )
    case 'sennhuette':
      return (
        <Svg>
          <Shadow rx={34} />
          <rect x="14" y="56" width="44" height="8" fill="#a69a8a" stroke="#7a6e5e" strokeWidth=".6" />
          <rect x="16" y="40" width="40" height="16" fill="#8a5a32" stroke="#5a3a1a" strokeWidth=".7" />
          {[44, 48, 52].map((y) => (
            <path key={y} d={`M16 ${y}h40`} stroke="#5a3a1a" strokeWidth=".5" />
          ))}
          <path d="M8 41 L36 26 L64 41z" fill="#5a4a3a" stroke="#3a2a1a" strokeWidth=".6" />
          {[20, 34, 48].map((x) => (
            <circle key={x} cx={x} cy={35 + Math.abs(x - 34) * 0.18} r="1.6" fill="#a69a8a" />
          ))}
          <Window x={22} y={44} lit={tier >= 3} />
          <Window x={44} y={44} lit={tier >= 3} />
          <rect x="32" y="46" width="8" height="10" fill="#5a3a1a" />
          {tier >= 2 ? <Smoke x={50} y={28} /> : null}
          {tier >= 2 ? <rect x="48" y="28" width="4" height="6" fill="#7a6e5e" /> : null}
          {tier >= 3 && !winter ? (
            <g>
              <rect x="21" y="49.4" width="8" height="1.6" fill="#8a5a32" />
              <rect x="43" y="49.4" width="8" height="1.6" fill="#8a5a32" />
              {[22, 24, 26, 28, 44, 46, 48, 50].map((x) => (
                <circle key={x} cx={x} cy="48.8" r=".9" fill="#e0485e" />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? (
            <g>
              {[0, 1, 2].map((k) => (
                <rect key={k} x={60} y={58 - k * 3} width="14" height="3" rx="1.4" fill="#c49a6a" stroke="#8a6a40" strokeWidth=".4" />
              ))}
            </g>
          ) : null}
          {tier >= 5 ? <path d="M4 62h10M5 62v3M13 62v3" stroke="#6e4a2b" strokeWidth="1.2" /> : null}
          {winter ? <Snowcap d="M9 40 L36 26 L63 40" /> : null}
        </Svg>
      )
    case 'edelweiss': {
      const n = Math.min(9, 2 + tier * 2)
      return (
        <Svg>
          <ellipse cx="40" cy="62" rx="34" ry="6" fill={winter ? '#eef2f4' : '#9ab07a'} />
          <Rock x={6} y={64} w={30} h={18} snow={winter} />
          <Rock x={40} y={64} w={34} h={22} snow={winter} />
          {!winter
            ? Array.from({ length: n }, (_, i) => (
                <Edelweiss key={i} x={14 + ((i * 13) % 54)} y={48 + ((i * 7) % 12)} s={0.9 + (tier >= 4 ? 0.2 : 0)} />
              ))
            : null}
          {tier >= 5 ? (
            <g>
              <path d="M8 34l6 4M10 34l2 5" stroke="#6e4a2b" strokeWidth=".8" />
              <ellipse cx="66" cy="34" rx="4" ry="2.4" fill="#a5733f" />
              <circle cx="69" cy="32" r="1.6" fill="#a5733f" />
            </g>
          ) : null}
        </Svg>
      )
    }
    case 'enzian': {
      const n = Math.min(16, 4 + tier * 3)
      return (
        <Svg>
          <Slope winter={winter} color={grass} />
          {!winter
            ? Array.from({ length: n }, (_, i) =>
                spring || season === 'summer' || i % 2 ? <Gentian key={i} x={10 + ((i * 13) % 62)} y={52 + ((i * 7) % 11)} /> : null,
              )
            : null}
          {tier >= 3 ? <Rock x={54} y={62} w={16} h={8} snow={winter} /> : null}
          {tier >= 4 ? (
            <g>
              <path d="M16 46v-10" stroke="#6e4a2b" strokeWidth="1" />
              <rect x="11" y="32" width="10" height="5" rx="1" fill="#efe1c2" stroke="#6e4a2b" strokeWidth=".5" />
              <path d="M14 34.5h4" stroke="#2e5fc4" strokeWidth="1.2" />
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={44} y={38} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'bergbach': {
      const water = winter ? '#cfe2ee' : '#6aa6c9'
      return (
        <Svg>
          <ellipse cx="40" cy="58" rx="36" ry="12" fill={winter ? '#eef2f4' : grass} />
          <path d="M8 22 C24 34 18 46 38 52 S66 56 74 66" stroke="#a69a8a" strokeWidth="14" fill="none" opacity=".7" />
          <path d="M8 22 C24 34 18 46 38 52 S66 56 74 66" stroke={water} strokeWidth={7 + tier} fill="none" strokeLinecap="round" />
          <path d="M8 22 C24 34 18 46 38 52 S66 56 74 66" stroke="#e8f6fc" strokeWidth="1.4" fill="none" strokeDasharray="3 5" className="orchard-stream" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <ellipse key={i} cx={12 + i * 11} cy={30 + i * 6 + (i % 2) * 4} rx="3" ry="2" fill="#a69a8a" stroke="#7a6e5e" strokeWidth=".4" />
          ))}
          {tier >= 3 ? (
            <g>
              <path d="M28 54 Q38 46 48 54" stroke="#8a5a32" strokeWidth="3" fill="none" />
              <path d="M28 52 Q38 44 48 52" stroke="#6e4a2b" strokeWidth=".8" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? (
            <g className="ha-wheel">
              <circle cx="66" cy="54" r="7" fill="none" stroke="#8a5a32" strokeWidth="1.6" />
              <path d="M59 54h14M66 47v14M61 49l10 10M71 49l-10 10" stroke="#8a5a32" strokeWidth="1" />
            </g>
          ) : null}
          {tier >= 4 ? <Conifer x={66} y={36} s={0.55} snow={winter} /> : null}
        </Svg>
      )
    }
    case 'kaesekeller': {
      const wheels = Math.min(6, tier + 1)
      return (
        <Svg>
          <path d="M2 66 Q30 22 78 40 V66z" fill={winter ? '#eef2f4' : grass} />
          <path d="M22 66V48a12 12 0 0 1 24 0v18z" fill="#a69a8a" stroke="#7a6e5e" strokeWidth=".8" />
          {[0, 1, 2, 3].map((k) => (
            <path key={k} d={`M${24 + k * 6} ${44 - (k === 1 || k === 2 ? 2 : 0)}l2 -3`} stroke="#7a6e5e" strokeWidth=".5" />
          ))}
          <path d="M27 66V50a7 7 0 0 1 14 0v16z" fill="#5a3a1a" />
          <circle cx="38" cy="58" r=".8" fill="#e0a21a" />
          <rect x="50" y="52" width="24" height="2" fill="#8a5a32" />
          <rect x="50" y="60" width="24" height="2" fill="#8a5a32" />
          <path d="M51 52v14M73 52v14" stroke="#6e4a2b" strokeWidth="1.2" />
          {Array.from({ length: wheels }, (_, i) => (
            <g key={i}>
              <ellipse cx={55 + (i % 3) * 7} cy={i < 3 ? 49.6 : 57.6} rx="3.2" ry="2.4" fill="#f0c860" stroke="#b8862a" strokeWidth=".5" />
              <path d={`M${52 + (i % 3) * 7} ${i < 3 ? 49.6 : 57.6}h6`} stroke="#b8862a" strokeWidth=".4" />
            </g>
          ))}
          {tier >= 4 ? <path d="M14 64h6l-1 -6h-4z" fill="#c9d0d8" stroke="#6a7a8a" strokeWidth=".5" /> : null}
          {tier >= 5 ? <path d="M34 36v-6M30 34h8" stroke="#6e4a2b" strokeWidth="1" /> : null}
        </Svg>
      )
    }
    case 'seilbahn': {
      const gondolas = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg>
          <path d="M0 66 V58 Q34 46 58 22 Q68 12 80 12 V66z" fill={winter ? '#eef2f4' : '#9ab07a'} opacity=".45" />
          <path d="M8 58 L72 18" stroke="#4a4a4a" strokeWidth=".8" />
          <path d="M8 61 L72 21" stroke="#4a4a4a" strokeWidth=".5" />
          <path d="M36 64 L40 40 L44 64 M37 56h6M38 48h4" stroke="#7a7a8a" strokeWidth="1.2" fill="none" />
          {Array.from({ length: gondolas }, (_, i) => {
            const t = 0.2 + i * 0.3
            const x = 8 + 64 * t
            const y = 58 - 40 * t
            return (
              <g key={i} className="ha-swim">
                <path d={`M${x} ${y}v4`} stroke="#4a4a4a" strokeWidth=".6" />
                <rect x={x - 4} y={y + 4} width="8" height="6" rx="1.4" fill={['#e2453c', '#3d6fd1', '#f5c542'][i]} stroke="#4a3a2a" strokeWidth=".5" />
                <rect x={x - 3} y={y + 5} width="6" height="2.4" fill="#cfe8f4" />
              </g>
            )
          })}
          <rect x="2" y="56" width="14" height="10" fill="#efe1c2" stroke="#6e4a2b" strokeWidth=".6" />
          <Roof x={2} w={14} y={56} color="#b8403a" steep={6} />
          {tier >= 4 ? (
            <g>
              <rect x="64" y="14" width="14" height="10" fill="#efe1c2" stroke="#6e4a2b" strokeWidth=".6" />
              <Roof x={64} w={14} y={14} color="#b8403a" steep={6} />
            </g>
          ) : null}
          {winter ? <Snowcap d="M0 56 L9 50 L18 56" /> : null}
        </Svg>
      )
    }
    case 'gipfelhuette':
      return (
        <Svg>
          <path d="M2 66 L30 16 L44 30 L52 22 L78 66z" fill="#9aa8b6" />
          <path d="M30 16 L22 30 L28 28 L32 32 L38 24z M52 22 L48 30 L54 28 L58 32z" fill="#fff" />
          {winter ? <path d="M10 52 L30 16 L52 22 L70 52" stroke="#fff" strokeWidth="3" fill="none" opacity=".8" /> : null}
          <rect x="24" y="48" width="26" height="14" fill="#8a5a32" stroke="#5a3a1a" strokeWidth=".6" />
          <Roof x={24} w={26} y={48} color="#5a4a3a" steep={8} />
          <Window x={28} y={52} lit={tier >= 2} />
          <rect x="39" y="53" width="6" height="9" fill="#5a3a1a" />
          {tier >= 3 ? (
            <g>
              <path d="M30 16V4M26 8h8" stroke="#6e4a2b" strokeWidth="1.4" />
            </g>
          ) : null}
          {tier >= 4 ? <path d="M54 48v-12l6 2.4-6 2.4" fill="#e2453c" stroke="#6e4a2b" strokeWidth=".5" /> : null}
          {tier >= 5 ? (
            <g>
              <circle cx="14" cy="60" r="1.6" fill="#f2c9a0" />
              <path d="M14 61.6v4M12 63h4" stroke="#3d6fd1" strokeWidth="1.2" />
              <path d="M16 60l2 6" stroke="#8a6a40" strokeWidth=".6" />
            </g>
          ) : null}
          {winter ? <Snowcap d="M21 48 L37 40 L53 48" /> : null}
        </Svg>
      )
    case 'almfest':
      return (
        <Svg>
          <ellipse cx="40" cy="60" rx="36" ry="9" fill={winter ? '#eef2f4' : grass} />
          <rect x="16" y="48" width="36" height="6" fill="#a5733f" stroke="#6e4a2b" strokeWidth=".6" />
          <path d="M18 48V32M50 48V32" stroke="#6e4a2b" strokeWidth="1.4" />
          <path d="M14 32 L34 24 L54 32z" fill="#8a5a32" />
          <Bunting y={20} n={Math.min(9, 3 + tier)} />
          <path d="M56 58 Q66 58 70 40" stroke="#8a5a32" strokeWidth="2" fill="none" />
          <path d="M68 40 q3 -2 5 1 l-3 1z" fill="#8a5a32" />
          {tier >= 2 ? (
            <g fill="#4a3a2a">
              <circle cx="28" cy="44" r="1.6" />
              <rect x="27" y="45.4" width="2" height="3" />
              {tier >= 3 ? (
                <>
                  <circle cx="40" cy="44" r="1.6" />
                  <rect x="39" y="45.4" width="2" height="3" />
                </>
              ) : null}
            </g>
          ) : null}
          {tier >= 3 ? (
            <g>
              <rect x="6" y="60" width="16" height="2" fill="#a5733f" />
              <path d="M8 62v4M20 62v4" stroke="#6e4a2b" strokeWidth="1" />
              {[9, 13, 17].map((x) => (
                <rect key={x} x={x} y="57" width="2.4" height="3" fill="#f5e08a" stroke="#a5733f" strokeWidth=".3" />
              ))}
            </g>
          ) : null}
          {tier >= 4
            ? Array.from({ length: 5 }, (_, i) => <circle key={i} className="fest-glow" cx={8 + i * 16} cy={22 + (i % 2) * 3} r="1.6" fill="#f5a83a" />)
            : null}
          {tier >= 5 ? (
            <g>
              <path d="M62 66V30" stroke="#fbf6e8" strokeWidth="1.8" />
              <path d="M62 30 q-4 4 0 8 q4 -4 0 -8" fill="#5f9e45" />
              <path d="M58 40l8 2M58 46l8 2" stroke="#3d6fd1" strokeWidth="1" />
            </g>
          ) : null}
        </Svg>
      )
  }
  return null
}

/** Locked corners: weeds + broken pots (Kräuter), toppled glass frames (Botanik), scree + dwarf pine (Alm). */
export function WildA({ chapter, seed = 0 }: { chapter: string; seed?: number }) {
  if (chapter === 'kraeuter') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#6d8a4a" opacity=".55" />
        <path d="M24 60l3-6h7l-1 6z" fill="#c4683a" transform="rotate(-24 28 58)" />
        <path d="M46 62l4-3 2 3z" fill="#c4683a" />
        {Array.from({ length: 7 }, (_, i) => (
          <g key={i}>
            <path d={`M${14 + i * 8} 62q${i % 2 ? 2 : -2} -${8 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${12 + ((i + seed) % 4) * 3}`} stroke="#6f8a3a" strokeWidth="1.3" fill="none" />
            {i % 3 === 0 ? <circle cx={14 + i * 8 + (i % 2 ? 4 : -2)} cy={50 - ((i + seed) % 4) * 3} r="1.4" fill="#e8e0a0" /> : null}
          </g>
        ))}
        <ellipse cx="58" cy="58" rx="8" ry="5" fill="#5f7a3a" />
      </Svg>
    )
  }
  if (chapter === 'botanik') {
    return (
      <Svg>
        <ellipse cx="40" cy="60" rx="28" ry="7" fill="#5f8a3a" opacity=".5" />
        <path d="M18 62 L28 46 L44 50 L36 64z" fill="#cfe8f4" opacity=".55" stroke="#9ab0bc" strokeWidth=".8" />
        <path d="M28 46 L36 64 M23 54 L40 57" stroke="#9ab0bc" strokeWidth=".6" />
        {Array.from({ length: 5 }, (_, i) => (
          <path key={i} d={`M${46 + i * 5} 62q-2 -${10 + ((i + seed) % 3) * 3} 4 -${14 + ((i + seed) % 3) * 3}`} stroke="#4f8a3a" strokeWidth="1.6" fill="none" />
        ))}
        <ellipse cx="22" cy="62" rx="7" ry="3.6" fill="#6d9a3f" />
      </Svg>
    )
  }
  return (
    <Svg>
      <ellipse cx="40" cy="60" rx="30" ry="7" fill="#9a9a8a" opacity=".55" />
      {Array.from({ length: 8 }, (_, i) => (
        <ellipse key={i} cx={14 + ((i * 11 + seed * 3) % 52)} cy={58 + (i % 3) * 2} rx={2.6 + (i % 3)} ry={1.8 + (i % 2)} fill={i % 2 ? '#a69a8a' : '#8a7e6e'} />
      ))}
      <ellipse cx="54" cy="54" rx="10" ry="5" fill="#3f6a3a" />
      <ellipse cx="50" cy="51" rx="5" ry="3" fill="#4f7a3a" />
      <path d="M20 58 L30 50" stroke="#8a7a6a" strokeWidth="2" strokeLinecap="round" />
    </Svg>
  )
}
