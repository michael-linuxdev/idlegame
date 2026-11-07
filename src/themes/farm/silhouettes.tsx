import type { SilhouetteKind } from '../../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Premium casual farm modules — glass, leafy greens, soft earth, readable at phone scale. */
export function FarmSilhouettes({
  kind,
  level,
  locked = false,
  producing = false,
  selected = false,
}: Props) {
  const lit = level > 0 && !locked
  const state =
    `building-sil sil-${kind} sil-farm` +
    (lit ? ' lit' : ' dormant') +
    (locked ? ' locked' : '') +
    (producing ? ' producing' : '') +
    (selected ? ' selected' : '')

  return (
    <div className={state} aria-hidden="true" data-level={level}>
      <svg
        className="sil-svg"
        viewBox="0 0 96 84"
        width="84"
        height="74"
        focusable="false"
      >
        <defs>
          <linearGradient id={`fh-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fcf6" />
            <stop offset="45%" stopColor="#c8e0b8" />
            <stop offset="100%" stopColor="#7a9e6a" />
          </linearGradient>
          <linearGradient id={`fg-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eaf8f0" stopOpacity="0.92" />
            <stop offset="100%" stopColor="#6eb892" stopOpacity="0.55" />
          </linearGradient>
          <linearGradient id={`fs-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0f6ec" />
            <stop offset="100%" stopColor="#5a8a50" />
          </linearGradient>
          <linearGradient id={`fw-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d8f0fa" />
            <stop offset="100%" stopColor="#3d8eb8" />
          </linearGradient>
          <linearGradient id={`fe-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8d4b0" />
            <stop offset="100%" stopColor="#8a6a40" />
          </linearGradient>
          <radialGradient id={`fp-${kind}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a8c89a" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#5a7a4e" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        <ellipse
          className="sil-pad"
          cx="48"
          cy="76"
          rx="34"
          ry="7"
          fill={`url(#fp-${kind})`}
        />

        {kind === 'power' ? <GreenhouseArt id={kind} /> : null}
        {kind === 'cool' ? <NutrientPumpArt id={kind} /> : null}
        {kind === 'rack' ? <LedWallArt id={kind} /> : null}
        {kind === 'uplink' ? <HydroBedArt id={kind} /> : null}
        {kind === 'relay' ? <VerticalTowerArt id={kind} /> : null}
        {kind === 'switch' ? <ClimateArt id={kind} /> : null}
        {kind === 'battery' ? <WaterTankArt id={kind} /> : null}
        {kind === 'cache' ? <CompactBedArt id={kind} /> : null}
        {kind === 'quantum' ? <ComposterArt id={kind} /> : null}
        {kind === 'scrub' ? <AquaponicsArt id={kind} /> : null}
      </svg>
      {producing ? <span className="sil-particles sil-farm-particles" /> : null}
    </div>
  )
}

function Leaf({
  x,
  y,
  s = 1,
  flip = false,
}: {
  x: number
  y: number
  s?: number
  flip?: boolean
}) {
  const t = `translate(${x} ${y}) scale(${flip ? -s : s} ${s})`
  return (
    <g className="sil-leaf" transform={t}>
      <path
        d="M0 0 Q-5 -8 0 -14 Q5 -8 0 0"
        fill="#3d8b4f"
        opacity="0.9"
      />
      <path d="M0 0 L0 -12" stroke="#2d6a3a" strokeWidth="0.6" opacity="0.7" />
    </g>
  )
}

function GreenhouseArt({ id }: { id: string }) {
  return (
    <g className="art-power">
      <path
        className="sil-hull"
        d="M14 68 L14 38 L48 12 L82 38 L82 68 Z"
        fill={`url(#fh-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.5"
      />
      <path
        d="M20 40 L48 18 L76 40 L76 64 L20 64 Z"
        fill={`url(#fg-${id})`}
      />
      <path d="M20 40 L48 18 L76 40" fill="none" stroke="#5a8a60" strokeWidth="1.1" />
      <path d="M48 18 V64" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
      <rect x="24" y="44" width="18" height="16" rx="1.5" fill="#d8ecc8" stroke="#3d8b4f" strokeWidth="0.8" />
      <rect x="54" y="44" width="18" height="16" rx="1.5" fill="#d8ecc8" stroke="#3d8b4f" strokeWidth="0.8" />
      <Leaf x={30} y={56} s={0.9} />
      <Leaf x={38} y={54} s={1} flip />
      <Leaf x={60} y={56} s={0.9} />
      <Leaf x={68} y={54} s={1} flip />
      <line x1="26" y1="42" x2="70" y2="42" stroke="#e8a050" strokeWidth="1.4" className="sil-led amber" opacity="0.85" />
      <circle className="sil-led core" cx="48" cy="30" r="3.2" fill="#3d8b4f" />
      <rect x="32" y="66" width="32" height="5" rx="1.2" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function NutrientPumpArt({ id }: { id: string }) {
  return (
    <g className="art-cool">
      <rect
        className="sil-hull"
        x="16"
        y="40"
        width="64"
        height="28"
        rx="5"
        fill={`url(#fh-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.5"
      />
      <circle cx="36" cy="54" r="11" fill={`url(#fw-${id})`} stroke="#3d7a98" strokeWidth="1.3" />
      <circle cx="60" cy="54" r="11" fill={`url(#fw-${id})`} stroke="#3d7a98" strokeWidth="1.3" />
      <ellipse cx="36" cy="50" rx="6" ry="3" fill="#e8f6fc" opacity="0.55" />
      <ellipse cx="60" cy="50" rx="6" ry="3" fill="#e8f6fc" opacity="0.55" />
      <path d="M36 54 H60" stroke="#3d8eb8" strokeWidth="2.4" strokeLinecap="round" />
      <path
        d="M28 34 Q20 44 28 50"
        fill="none"
        stroke="#4a8aa0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <path
        d="M68 34 Q76 44 68 50"
        fill="none"
        stroke="#4a8aa0"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.75"
      />
      <rect
        x="40"
        y="18"
        width="16"
        height="22"
        rx="3"
        fill={`url(#fs-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.1"
      />
      <circle className="sil-led ice" cx="48" cy="26" r="2.8" fill="#3d8b4f" />
      <rect x="44" y="34" width="8" height="6" rx="1" fill="#7eb8d4" opacity="0.7" />
    </g>
  )
}

function LedWallArt({ id }: { id: string }) {
  return (
    <g className="art-rack">
      <rect
        className="sil-hull"
        x="24"
        y="12"
        width="48"
        height="58"
        rx="3"
        fill={`url(#fh-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.5"
      />
      <rect x="28" y="16" width="40" height="50" rx="2" fill="#1a2e18" opacity="0.14" />
      {[20, 32, 44, 56].map((y, i) => (
        <g key={y}>
          <rect x="30" y={y} width="36" height="8" rx="1" fill="#0e1a0c" opacity="0.18" />
          <rect
            x="32"
            y={y + 1.5}
            width="32"
            height="5"
            rx="0.8"
            fill={i % 2 === 0 ? '#6bc47a' : '#8ec99a'}
            opacity="0.9"
          />
          <Leaf x={38} y={y + 6} s={0.55} />
          <Leaf x={48} y={y + 5.5} s={0.5} flip />
          <Leaf x={58} y={y + 6} s={0.55} />
          <circle className="sil-led amber" cx="34" cy={y + 4} r="1.4" fill="#e8a050" />
          <circle className="sil-led ice" cx="62" cy={y + 4} r="1.4" fill="#7ec8ff" />
        </g>
      ))}
      <line
        className="sil-led amber"
        x1="30"
        y1="18"
        x2="66"
        y2="18"
        stroke="#e070a0"
        strokeWidth="1.6"
        opacity="0.75"
      />
      <rect x="22" y="68" width="52" height="5" rx="1.2" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function HydroBedArt({ id }: { id: string }) {
  return (
    <g className="art-uplink">
      <rect
        className="sil-hull"
        x="8"
        y="48"
        width="80"
        height="22"
        rx="4"
        fill={`url(#fh-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.4"
      />
      <rect x="14" y="54" width="68" height="10" rx="2" fill={`url(#fw-${id})`} opacity="0.65" />
      {[18, 38, 58, 74].map((x) => (
        <g key={x}>
          <rect
            x={x - 6}
            y="36"
            width="14"
            height="14"
            rx="1.5"
            fill="#d8ecc8"
            stroke="#3d8b4f"
            strokeWidth="0.8"
          />
          <Leaf x={x} y={38} s={0.85} />
          <Leaf x={x + 4} y={36} s={0.7} flip />
        </g>
      ))}
      <circle className="sil-led ice" cx="48" cy="30" r="2.4" fill="#3d8b4f" />
      <path
        d="M20 58 Q34 52 48 58 Q62 64 76 58"
        fill="none"
        stroke="#7eb8d4"
        strokeWidth="1.5"
        opacity="0.7"
        className="sil-wave"
      />
    </g>
  )
}

function VerticalTowerArt({ id }: { id: string }) {
  return (
    <g className="art-relay">
      <rect
        className="sil-hull"
        x="34"
        y="8"
        width="28"
        height="62"
        rx="4"
        fill={`url(#fh-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.5"
      />
      <rect x="38" y="12" width="20" height="54" rx="3" fill={`url(#fg-${id})`} />
      {[18, 30, 42, 54].map((y) => (
        <g key={y}>
          <ellipse
            cx="48"
            cy={y}
            rx="18"
            ry="5"
            fill="#c5d9b8"
            stroke="#4a7a48"
            strokeWidth="0.9"
          />
          <Leaf x={38} y={y} s={0.7} />
          <Leaf x={48} y={y - 2} s={0.85} />
          <Leaf x={58} y={y} s={0.7} flip />
          <circle className="sil-led amber" cx="40" cy={y} r="1.3" fill="#e8a050" />
          <circle className="sil-led ice" cx="56" cy={y} r="1.3" fill="#7ec8ff" />
        </g>
      ))}
      <circle className="sil-led amber" cx="48" cy="8" r="3" fill="#e8a050" />
      <rect x="28" y="68" width="40" height="5" rx="1.2" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function ClimateArt({ id }: { id: string }) {
  return (
    <g className="art-switch">
      <rect
        className="sil-hull"
        x="12"
        y="34"
        width="72"
        height="34"
        rx="4"
        fill={`url(#fh-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.5"
      />
      <rect x="18" y="40" width="26" height="22" rx="2.5" fill="#eef6ea" stroke="#6b8f5e" strokeWidth="1" />
      <rect x="52" y="40" width="26" height="22" rx="2.5" fill="#eef6ea" stroke="#6b8f5e" strokeWidth="1" />
      {/* Thermostat */}
      <path d="M26 52 H36 M31 47 V57" stroke="#3d8b4f" strokeWidth="1.6" strokeLinecap="round" />
      {/* Fan */}
      <g className="sil-fan-group" transform="translate(65 51)">
        <circle r="8" fill="none" stroke="#4a8aa0" strokeWidth="1.4" />
        <path className="sil-fan-blade" d="M0 -7 L2 0 L0 7 L-2 0 Z" fill="#7eb8d4" />
        <path className="sil-fan-blade" d="M-7 0 L0 2 L7 0 L0 -2 Z" fill="#5a9e6e" opacity="0.85" />
      </g>
      <rect
        x="40"
        y="14"
        width="16"
        height="20"
        rx="2.5"
        fill={`url(#fs-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.1"
      />
      <circle className="sil-led amber" cx="48" cy="22" r="2.8" fill="#e8a050" />
      <path
        d="M44 34 Q40 38 44 42"
        fill="none"
        stroke="#7eb8d4"
        strokeWidth="1.3"
        opacity="0.6"
      />
      <path
        d="M52 34 Q56 38 52 42"
        fill="none"
        stroke="#7eb8d4"
        strokeWidth="1.3"
        opacity="0.6"
      />
    </g>
  )
}

function WaterTankArt({ id }: { id: string }) {
  return (
    <g className="art-battery">
      <ellipse cx="48" cy="68" rx="22" ry="6" fill="#5a7a4e" opacity="0.3" />
      <rect
        className="sil-hull"
        x="24"
        y="18"
        width="48"
        height="50"
        rx="22"
        fill={`url(#fh-${id})`}
        stroke="#3d7a98"
        strokeWidth="1.6"
      />
      <rect x="28" y="38" width="40" height="26" rx="18" fill={`url(#fw-${id})`} opacity="0.7" />
      <ellipse cx="48" cy="38" rx="20" ry="6" fill="#cfe6f0" stroke="#3d7a98" strokeWidth="0.9" />
      <ellipse cx="48" cy="38" rx="12" ry="3" fill="#e8f6fc" opacity="0.55" />
      <rect
        x="42"
        y="10"
        width="12"
        height="10"
        rx="1.5"
        fill={`url(#fs-${id})`}
        stroke="#4a7a48"
        strokeWidth="0.9"
      />
      <circle className="sil-led ice" cx="48" cy="28" r="2.4" fill="#3d8b4f" />
      <path
        className="sil-wave"
        d="M32 52 Q40 48 48 52 Q56 56 64 52"
        fill="none"
        stroke="#7eb8d4"
        strokeWidth="1.5"
        opacity="0.8"
      />
    </g>
  )
}

function CompactBedArt({ id }: { id: string }) {
  return (
    <g className="art-cache">
      <rect
        className="sil-hull"
        x="6"
        y="46"
        width="84"
        height="24"
        rx="4"
        fill={`url(#fe-${id})`}
        stroke="#6a5030"
        strokeWidth="1.4"
      />
      <rect x="10" y="50" width="76" height="14" rx="2" fill="#5c4330" opacity="0.85" />
      {[16, 30, 44, 58, 72, 84].map((x, i) => (
        <g key={x}>
          <rect
            x={x - 5}
            y="34"
            width="10"
            height="16"
            rx="1.2"
            fill={i % 2 ? '#d8ecc8' : '#c5e0b0'}
            stroke="#3d8b4f"
            strokeWidth="0.7"
          />
          <Leaf x={x} y={36} s={0.75 + (i % 3) * 0.08} flip={i % 2 === 1} />
        </g>
      ))}
      <rect x="12" y="56" width="72" height="5" rx="1" fill="#a8c09a" opacity="0.4" />
    </g>
  )
}

function ComposterArt({ id }: { id: string }) {
  return (
    <g className="art-quantum">
      <path
        className="sil-hull"
        d="M16 70 L12 40 Q12 24 48 16 Q84 24 84 40 L80 70 Z"
        fill={`url(#fe-${id})`}
        stroke="#8a7348"
        strokeWidth="1.5"
      />
      <ellipse cx="48" cy="42" rx="22" ry="10" fill="#c4a878" opacity="0.5" />
      <path
        d="M30 48 Q48 30 66 48"
        fill="none"
        stroke="#5a8a50"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <Leaf x={40} y={40} s={0.9} />
      <Leaf x={56} y={38} s={1} flip />
      <circle className="sil-led amber" cx="48" cy="40" r="3.4" fill="#a86a28" />
      <circle className="sil-led core" cx="48" cy="40" r="1.6" fill="#e8a050" />
      <rect x="28" y="64" width="40" height="7" rx="1.5" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function AquaponicsArt({ id }: { id: string }) {
  return (
    <g className="art-scrub">
      <rect
        className="sil-hull"
        x="10"
        y="42"
        width="76"
        height="28"
        rx="5"
        fill={`url(#fh-${id})`}
        stroke="#3d7a98"
        strokeWidth="1.5"
      />
      <rect x="16" y="48" width="64" height="16" rx="3" fill={`url(#fw-${id})`} opacity="0.7" />
      <path
        className="sil-wave"
        d="M20 56 H32 Q40 50 48 56 Q56 62 64 56 H76"
        fill="none"
        stroke="#3d8b4f"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Fish hint */}
      <ellipse cx="36" cy="58" rx="5" ry="2.2" fill="#4a8aa0" opacity="0.55" />
      <ellipse cx="60" cy="54" rx="4" ry="1.8" fill="#4a8aa0" opacity="0.45" />
      <rect
        x="32"
        y="16"
        width="32"
        height="26"
        rx="3"
        fill={`url(#fs-${id})`}
        stroke="#4a7a48"
        strokeWidth="1.2"
      />
      <rect x="36" y="20" width="24" height="18" rx="2" fill={`url(#fg-${id})`} />
      <Leaf x={42} y={32} s={0.7} />
      <Leaf x={52} y={30} s={0.8} flip />
      <circle className="sil-led ice" cx="40" cy="26" r="2" fill="#3d8b4f" />
      <circle className="sil-led amber" cx="48" cy="26" r="2" fill="#e8a050" />
      <circle className="sil-led ice" cx="56" cy="26" r="2" fill="#3d8b4f" />
      <rect x="24" y="68" width="48" height="5" rx="1.2" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}
