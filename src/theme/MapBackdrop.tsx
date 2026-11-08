/**
 * Gartenerbe — garden ground + decor behind the ten plots.
 *
 * Layers:
 *  1. Ground SVG in percent space (viewBox 0–100, preserveAspectRatio none)
 *     so the gravel path always meets the plot centres from generators.ts.
 *     Strokes use `non-scaling-stroke` → constant width on any aspect ratio.
 *  2. Decor objects (Laube, Regentonne, Teich, Bäume, Zaun …) positioned in
 *     percent with their own aspect ratio, sized in `--u` (see garden.css).
 *  3. Stage-driven life: wild clumps vanish and flowers, butterflies and
 *     lanterns appear as more plots are angelegt (stage 0–10).
 */
import type { CSSProperties, ReactNode } from 'react'
import { GENERATORS } from '../game/generators'

interface Props {
  /** Number of garden areas angelegt (0–10) */
  stage: number
}

const pct = (v: string) => Number.parseFloat(v)

/** Spine of the garden: gate (bottom) → Omas Laube (top). */
const MAIN_PATH =
  'M50 104 C50 95 52 88 50 81 S44 70 47 61 S54 50 49 43 S45 33 49 27 L49 20'

function stubPath(x: number, y: number): string {
  const yy = y + 2.5
  const toX = x < 50 ? 47 : 51
  const mid = (x + toX) / 2
  return `M${x} ${yy} Q${mid} ${yy + 1.2} ${toX} ${yy + 0.4}`
}

function Decor({
  className,
  left,
  top,
  w,
  children,
  style,
}: {
  className: string
  left: string
  top: string
  /** width in --u units */
  w: number
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div
      className={`garden-decor ${className}`}
      style={{ left, top, width: `calc(var(--u) * ${w})`, ...style }}
    >
      {children}
    </div>
  )
}

/** Omas Laube — wooden garden house with red roof, the story anchor. */
function Laube() {
  return (
    <svg viewBox="0 0 120 100" focusable="false">
      <ellipse cx="60" cy="92" rx="54" ry="7" fill="var(--g-shadow)" />
      {/* walls */}
      <rect x="18" y="42" width="84" height="48" rx="2" fill="#d9a56c" stroke="#6e4a2b" strokeWidth="2" />
      {[30, 42, 54, 66, 78, 90].map((x) => (
        <line key={x} x1={x} y1="44" x2={x} y2="88" stroke="#b9844f" strokeWidth="1.4" />
      ))}
      {/* roof */}
      <path d="M8 46 L60 12 L112 46 Z" fill="#c4553f" stroke="#6e2f22" strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M20 40 L60 16 L100 40" fill="none" stroke="#a8432f" strokeWidth="2" />
      <path d="M30 34 L60 20 L90 34" fill="none" stroke="#a8432f" strokeWidth="1.6" />
      <rect x="80" y="18" width="8" height="14" fill="#9b6a44" stroke="#5a3a22" strokeWidth="1.4" />
      {/* door */}
      <rect x="48" y="58" width="22" height="32" rx="2" fill="#7d9f5a" stroke="#4a5f33" strokeWidth="2" />
      <circle cx="65" cy="75" r="1.6" fill="#f2d27a" />
      {/* window + curtains + flower box */}
      <rect x="25" y="54" width="17" height="15" fill="#cfe9f2" stroke="#fff" strokeWidth="2.4" />
      <path d="M25 54 Q30 61 27 69 M42 54 Q37 61 40 69" stroke="#e98f8f" strokeWidth="2" fill="none" />
      <rect x="23" y="69" width="21" height="5" rx="1" fill="#8a5a3b" />
      <circle cx="27" cy="68" r="2.2" fill="#e5484d" />
      <circle cx="33" cy="67.5" r="2.2" fill="#f5c542" />
      <circle cx="39" cy="68" r="2.2" fill="#e5484d" />
      <rect x="78" y="54" width="17" height="15" fill="#cfe9f2" stroke="#fff" strokeWidth="2.4" />
      <line x1="86.5" y1="54" x2="86.5" y2="69" stroke="#fff" strokeWidth="1.6" />
      {/* doorstep */}
      <rect x="44" y="89" width="30" height="4" rx="1.5" fill="#c9c1b0" stroke="#8f8676" strokeWidth="1" />
    </svg>
  )
}

function Regentonne() {
  return (
    <svg viewBox="0 0 40 50" focusable="false">
      <ellipse cx="20" cy="46" rx="16" ry="3.5" fill="var(--g-shadow)" />
      <path d="M6 10 Q4 28 7 44 L33 44 Q36 28 34 10 Z" fill="#9a6b43" stroke="#5a3a22" strokeWidth="1.8" />
      <path d="M5.5 18 L34.5 18 M5 34 L35 34" stroke="#6b6f73" strokeWidth="2.4" />
      <ellipse cx="20" cy="10" rx="14" ry="4.5" fill="#6fb4d0" stroke="#5a3a22" strokeWidth="1.8" />
      <ellipse cx="16" cy="9" rx="5" ry="1.4" fill="#bfe6f2" opacity="0.8" />
    </svg>
  )
}

function Teich() {
  return (
    <svg viewBox="0 0 120 80" focusable="false">
      <path
        d="M14 40 C10 22 34 10 58 12 C86 10 112 20 108 42 C106 62 80 72 56 70 C30 70 16 58 14 40 Z"
        fill="#bdb6a6"
        stroke="#857d6c"
        strokeWidth="2"
      />
      <path
        d="M22 40 C20 26 40 18 58 19 C82 18 101 26 99 42 C97 57 78 63 57 62 C36 62 24 53 22 40 Z"
        fill="#5aa9c6"
      />
      <path d="M34 34 C44 28 62 26 74 30" stroke="#9fd6e8" strokeWidth="2.4" fill="none" strokeLinecap="round" />
      <ellipse cx="44" cy="46" rx="8" ry="5" fill="#5f9a48" />
      <path d="M44 46 L52 44" stroke="#5aa9c6" strokeWidth="1.6" />
      <ellipse cx="76" cy="50" rx="7" ry="4.4" fill="#6fae52" />
      <circle cx="78" cy="48" r="2.6" fill="#f4a6c0" />
      {/* reeds */}
      <path d="M98 30 Q100 14 96 6 M103 32 Q106 18 104 10 M93 32 Q94 20 90 14" stroke="#5f7f36" strokeWidth="2" fill="none" />
      <rect x="95" y="6" width="3" height="8" rx="1.5" fill="#7a4e2d" transform="rotate(-8 96 10)" />
    </svg>
  )
}

function Baum({ tone = 0 }: { tone?: number }) {
  const a = ['#6fae52', '#5f9a48', '#7dba5c'][tone % 3]
  const b = ['#4f8a3a', '#447a34', '#5c9945'][tone % 3]
  return (
    <svg viewBox="0 0 100 100" focusable="false">
      <ellipse cx="50" cy="90" rx="34" ry="8" fill="var(--g-shadow)" />
      <rect x="44" y="60" width="12" height="30" rx="4" fill="#7a5232" />
      <circle cx="50" cy="42" r="32" fill={b} />
      <circle cx="32" cy="50" r="20" fill={b} />
      <circle cx="68" cy="50" r="20" fill={b} />
      <circle cx="44" cy="34" r="22" fill={a} />
      <circle cx="62" cy="38" r="18" fill={a} />
      <circle cx="40" cy="28" r="8" fill="#9fd07d" opacity="0.7" />
    </svg>
  )
}

function Hecke() {
  return (
    <svg viewBox="0 0 200 30" preserveAspectRatio="none" focusable="false">
      <rect x="0" y="10" width="200" height="20" fill="#3f7a34" />
      {Array.from({ length: 14 }, (_, i) => (
        <circle key={i} cx={i * 15 + 6} cy={12 + (i % 2) * 2} r="10" fill={i % 2 ? '#4f8a3a' : '#5a9a44'} />
      ))}
    </svg>
  )
}

/** Jägerzaun with a garden gate in the middle. */
function Zaun() {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" focusable="false">
      <defs>
        <pattern id="gz-pickets" width="14" height="40" patternUnits="userSpaceOnUse">
          <path d="M2 40 L2 12 L5 7 L8 12 L8 40 Z" fill="#e9dcc2" stroke="#8a7350" strokeWidth="1" />
        </pattern>
      </defs>
      <rect x="0" y="16" width="400" height="4" fill="#cdb98f" />
      <rect x="0" y="28" width="400" height="4" fill="#cdb98f" />
      <rect x="0" y="0" width="168" height="40" fill="url(#gz-pickets)" />
      <rect x="232" y="0" width="168" height="40" fill="url(#gz-pickets)" />
      {/* open gate */}
      <rect x="166" y="6" width="6" height="34" rx="1.5" fill="#a77d4c" />
      <rect x="228" y="6" width="6" height="34" rx="1.5" fill="#a77d4c" />
    </svg>
  )
}

function Bank() {
  return (
    <svg viewBox="0 0 60 36" focusable="false">
      <ellipse cx="30" cy="32" rx="26" ry="4" fill="var(--g-shadow)" />
      <rect x="6" y="6" width="48" height="6" rx="2" fill="#b07a4a" stroke="#6e4a2b" strokeWidth="1.4" />
      <rect x="4" y="16" width="52" height="7" rx="2" fill="#c48a55" stroke="#6e4a2b" strokeWidth="1.4" />
      <rect x="9" y="22" width="4" height="9" fill="#6e4a2b" />
      <rect x="47" y="22" width="4" height="9" fill="#6e4a2b" />
    </svg>
  )
}

const FLOWER_COLORS = ['#e5484d', '#f5c542', '#ffffff', '#c76bd9', '#f28ab2', '#ff9b3d']

function Blumen({ seed }: { seed: number }) {
  const dots = Array.from({ length: 7 }, (_, i) => {
    const a = (i / 7) * Math.PI * 2 + seed
    const r = 6 + ((i * 7 + seed * 3) % 5)
    return { x: 20 + Math.cos(a) * r, y: 14 + Math.sin(a) * r * 0.6, c: FLOWER_COLORS[(i + seed) % 6] }
  })
  return (
    <svg viewBox="0 0 40 28" focusable="false">
      <ellipse cx="20" cy="15" rx="17" ry="10" fill="#5f9a48" />
      <ellipse cx="17" cy="12" rx="10" ry="6" fill="#74b257" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="2.6" fill={d.c} stroke="rgba(0,0,0,0.15)" strokeWidth="0.6" />
      ))}
    </svg>
  )
}

/** Brambles / nettles left over from the overgrown years. */
function WildBusch({ seed }: { seed: number }) {
  return (
    <svg viewBox="0 0 50 34" focusable="false">
      <ellipse cx="25" cy="30" rx="22" ry="4" fill="var(--g-shadow)" />
      <path
        d="M4 28 C2 16 12 8 20 12 C24 2 38 4 40 14 C48 14 50 26 44 30 Z"
        fill="#4d6b33"
        stroke="#2f4420"
        strokeWidth="1.4"
      />
      <path
        d={`M8 24 Q16 ${14 + (seed % 3)} 22 22 M26 22 Q34 10 42 24 M14 18 L12 14 M34 16 L37 12`}
        stroke="#7a5a3a"
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
      <circle cx={18 + (seed % 4)} cy="18" r="1.8" fill="#4a2350" />
      <circle cx="31" cy="20" r="1.8" fill="#4a2350" />
      <circle cx="36" cy="24" r="1.6" fill="#7a2f3a" />
    </svg>
  )
}

function Lichterkette() {
  return (
    <svg viewBox="0 0 100 20" preserveAspectRatio="none" focusable="false">
      <path d="M0 4 Q25 16 50 6 Q75 -2 100 8" stroke="#5a4a3a" strokeWidth="0.8" fill="none" vectorEffect="non-scaling-stroke" />
      {[8, 20, 32, 44, 56, 68, 80, 92].map((x, i) => (
        <circle key={x} className="garden-bulb" cx={x} cy={i % 2 ? 9 : 11} r="1.6" fill="#ffd36b" />
      ))}
    </svg>
  )
}

function Schmetterling({ hue }: { hue: string }) {
  return (
    <svg viewBox="0 0 20 16" focusable="false">
      <ellipse cx="6" cy="6" rx="5" ry="4.5" fill={hue} />
      <ellipse cx="14" cy="6" rx="5" ry="4.5" fill={hue} />
      <ellipse cx="7" cy="12" rx="3.4" ry="3" fill={hue} opacity="0.85" />
      <ellipse cx="13" cy="12" rx="3.4" ry="3" fill={hue} opacity="0.85" />
      <rect x="9.3" y="3" width="1.4" height="11" rx="0.7" fill="#3a2a1a" />
    </svg>
  )
}

/** Wild clumps vanish one by one as the garden is angelegt. */
const WILD_CLUMPS = [
  { left: '48%', top: '72%', until: 1 },
  { left: '8%', top: '58%', until: 2 },
  { left: '88%', top: '42%', until: 3 },
  { left: '46%', top: '50%', until: 4 },
  { left: '6%', top: '30%', until: 5 },
  { left: '90%', top: '30%', until: 6 },
  { left: '52%', top: '30%', until: 7 },
  { left: '14%', top: '88%', until: 2 },
]

/** Flower clusters bloom in as the garden grows. */
const FLOWERS = [
  { left: '12%', top: '91%', from: 1 },
  { left: '86%', top: '89%', from: 2 },
  { left: '50%', top: '72%', from: 2 },
  { left: '8%', top: '60%', from: 3 },
  { left: '44%', top: '52%', from: 4 },
  { left: '92%', top: '58%', from: 4 },
  { left: '90%', top: '40%', from: 5 },
  { left: '7%', top: '47%', from: 6 },
  { left: '54%', top: '28%', from: 7 },
  { left: '8%', top: '30%', from: 8 },
  { left: '92%', top: '27%', from: 9 },
  { left: '40%', top: '86%', from: 10 },
]

export function MapBackdrop({ stage }: Props) {
  return (
    <div className="garden-ground" aria-hidden="true" data-stage={stage}>
      <svg
        className="garden-ground-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          <linearGradient id="gg-grass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" style={{ stopColor: 'var(--g-grass-far)' }} />
            <stop offset="55%" style={{ stopColor: 'var(--g-grass)' }} />
            <stop offset="100%" style={{ stopColor: 'var(--g-grass-near)' }} />
          </linearGradient>
          <radialGradient id="gg-light" cx="62%" cy="38%" r="70%">
            <stop offset="0%" stopColor="#fffbe0" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#fffbe0" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="100" height="100" fill="url(#gg-grass)" />
        {/* mowing stripes */}
        {Array.from({ length: 9 }, (_, i) => (
          <rect
            key={i}
            x={i * 12 - 4}
            y="0"
            width="6"
            height="100"
            fill="#ffffff"
            opacity="0.045"
          />
        ))}
        <rect width="100" height="100" fill="url(#gg-light)" />

        {/* path edge, then gravel */}
        <g fill="none" strokeLinecap="round" strokeLinejoin="round">
          {GENERATORS.map((g) => (
            <path
              key={`e-${g.id}`}
              d={stubPath(pct(g.slot.left), pct(g.slot.top))}
              stroke="var(--g-path-edge)"
              strokeWidth="18"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={MAIN_PATH} stroke="var(--g-path-edge)" strokeWidth="30" vectorEffect="non-scaling-stroke" />
          {GENERATORS.map((g) => (
            <path
              key={`p-${g.id}`}
              d={stubPath(pct(g.slot.left), pct(g.slot.top))}
              stroke="var(--g-path)"
              strokeWidth="13"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          <path d={MAIN_PATH} stroke="var(--g-path)" strokeWidth="24" vectorEffect="non-scaling-stroke" />
          <path
            d={MAIN_PATH}
            stroke="var(--g-path-speck)"
            strokeWidth="24"
            strokeDasharray="1 5"
            vectorEffect="non-scaling-stroke"
            opacity="0.7"
          />
        </g>
      </svg>

      {/* far edge: hedge behind the HUD, Laube at the end of the path */}
      <div className="garden-hedge">
        <Hecke />
      </div>
      <Decor className="decor-tree" left="-3%" top="17%" w={30}>
        <Baum tone={1} />
      </Decor>
      <Decor className="decor-tree" left="103%" top="14%" w={32}>
        <Baum tone={0} />
      </Decor>
      <Decor className="decor-laube" left="49%" top="16%" w={26}>
        <Laube />
      </Decor>
      <Decor className="decor-tonne" left="38%" top="17.5%" w={7}>
        <Regentonne />
      </Decor>

      <Decor className="decor-tree" left="-5%" top="76%" w={28}>
        <Baum tone={2} />
      </Decor>
      <Decor className="decor-tree" left="104%" top="64%" w={26}>
        <Baum tone={1} />
      </Decor>
      <Decor className="decor-teich" left="92%" top="66%" w={24}>
        <Teich />
      </Decor>
      {stage >= 6 ? (
        <Decor className="decor-bank" left="87%" top="58.5%" w={11}>
          <Bank />
        </Decor>
      ) : null}

      {WILD_CLUMPS.filter((c) => stage < c.until).map((c, i) => (
        <Decor key={`w${i}`} className="decor-wild" left={c.left} top={c.top} w={11}>
          <WildBusch seed={i} />
        </Decor>
      ))}
      {FLOWERS.filter((f) => stage >= f.from).map((f, i) => (
        <Decor key={`f${i}`} className="decor-flowers" left={f.left} top={f.top} w={9}>
          <Blumen seed={i} />
        </Decor>
      ))}

      {stage >= 9 ? (
        <div className="garden-lights">
          <Lichterkette />
        </div>
      ) : null}
      {stage >= 4 ? (
        <>
          <Decor className="decor-butterfly b1" left="44%" top="60%" w={4}>
            <Schmetterling hue="#f5c542" />
          </Decor>
          <Decor className="decor-butterfly b2" left="56%" top="44%" w={3.6}>
            <Schmetterling hue="#ffffff" />
          </Decor>
        </>
      ) : null}
      {stage >= 7 ? (
        <Decor className="decor-butterfly b3" left="40%" top="32%" w={3.6}>
          <Schmetterling hue="#f28ab2" />
        </Decor>
      ) : null}

      <div className="garden-fence">
        <Zaun />
      </div>
    </div>
  )
}
