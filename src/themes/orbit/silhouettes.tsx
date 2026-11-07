import type { SilhouetteKind } from '../../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Crisp SVG datacenter modules — distinct at mobile map size. */
export function OrbitSilhouettes({
  kind,
  level,
  locked = false,
  producing = false,
  selected = false,
}: Props) {
  const lit = level > 0 && !locked
  const state =
    `building-sil sil-${kind}` +
    (lit ? ' lit' : ' dormant') +
    (locked ? ' locked' : '') +
    (producing ? ' producing' : '') +
    (selected ? ' selected' : '')

  return (
    <div className={state} aria-hidden="true" data-level={level}>
      <svg
        className="sil-svg"
        viewBox="0 0 80 70"
        width="72"
        height="63"
        focusable="false"
      >
        <defs>
          <linearGradient id={`hull-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7fafc" />
            <stop offset="55%" stopColor="#c5d4e2" />
            <stop offset="100%" stopColor="#8aa0b4" />
          </linearGradient>
          <linearGradient id={`steel-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef3f8" />
            <stop offset="100%" stopColor="#6b8299" />
          </linearGradient>
          <radialGradient id={`pad-${kind}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#9aadc0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6b8299" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        <ellipse className="sil-pad" cx="40" cy="62" rx="28" ry="6" fill={`url(#pad-${kind})`} />

        {kind === 'power' ? <PowerArt /> : null}
        {kind === 'cool' ? <CoolArt /> : null}
        {kind === 'rack' ? <RackArt /> : null}
        {kind === 'uplink' ? <UplinkArt /> : null}
        {kind === 'relay' ? <RelayArt /> : null}
        {kind === 'switch' ? <SwitchArt /> : null}
        {kind === 'battery' ? <BatteryArt /> : null}
        {kind === 'cache' ? <CacheArt /> : null}
        {kind === 'quantum' ? <QuantumArt /> : null}
        {kind === 'scrub' ? <ScrubArt /> : null}
      </svg>
      {producing ? <span className="sil-particles" /> : null}
    </div>
  )
}

function PowerArt() {
  return (
    <g className="art-power">
      <path
        className="sil-hull"
        d="M18 58 L14 34 Q14 22 40 12 Q66 22 66 34 L62 58 Z"
        fill="url(#hull-power)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <path
        d="M22 58 L20 40 Q20 30 40 22 Q60 30 60 40 L58 58"
        fill="none"
        stroke="#9aadc0"
        strokeWidth="1"
        opacity="0.7"
      />
      <path d="M16 38 L10 36 L10 44 L16 46 Z" fill="#a8bbcc" stroke="#5a738a" strokeWidth="0.8" />
      <path d="M64 38 L70 36 L70 44 L64 46 Z" fill="#a8bbcc" stroke="#5a738a" strokeWidth="0.8" />
      <path d="M17 48 L11 47 L11 53 L17 55 Z" fill="#a8bbcc" stroke="#5a738a" strokeWidth="0.8" />
      <path d="M63 48 L69 47 L69 53 L63 55 Z" fill="#a8bbcc" stroke="#5a738a" strokeWidth="0.8" />
      <circle className="sil-led core" cx="40" cy="38" r="8" fill="#a86a28" />
      <circle className="sil-led core-inner" cx="40" cy="38" r="4.5" fill="#d4893a" />
      <rect x="37" y="48" width="6" height="10" rx="1" fill="#6b8299" />
      <rect x="28" y="54" width="24" height="4" rx="1" fill="#7a90a4" stroke="#5a738a" strokeWidth="0.7" />
    </g>
  )
}

function CoolArt() {
  return (
    <g className="art-cool">
      <rect
        className="sil-hull"
        x="14"
        y="34"
        width="52"
        height="24"
        rx="3"
        fill="url(#hull-cool)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <rect x="18" y="38" width="20" height="16" rx="2" fill="#d8e2ec" stroke="#3d8eb8" strokeWidth="1" />
      <rect x="42" y="38" width="20" height="16" rx="2" fill="#d8e2ec" stroke="#3d8eb8" strokeWidth="1" />
      <g className="sil-fan-group left">
        <circle className="sil-fan-ring" cx="28" cy="46" r="6.5" fill="none" stroke="#3d8eb8" strokeWidth="1.6" />
        <path className="sil-fan-blade" d="M28 40 L29.5 46 L28 52 L26.5 46 Z" fill="#7eb8d4" />
        <path className="sil-fan-blade" d="M22 46 L28 47.5 L34 46 L28 44.5 Z" fill="#7eb8d4" />
      </g>
      <g className="sil-fan-group right">
        <circle className="sil-fan-ring" cx="52" cy="46" r="6.5" fill="none" stroke="#3d8eb8" strokeWidth="1.6" />
        <path className="sil-fan-blade" d="M52 40 L53.5 46 L52 52 L50.5 46 Z" fill="#7eb8d4" />
        <path className="sil-fan-blade" d="M46 46 L52 47.5 L58 46 L52 44.5 Z" fill="#7eb8d4" />
      </g>
      <rect x="24" y="22" width="32" height="12" rx="2" fill="url(#steel-cool)" stroke="#5a738a" strokeWidth="1.2" />
      <line x1="28" y1="25" x2="52" y2="25" stroke="#7eb8d4" strokeWidth="1.2" opacity="0.85" />
      <line x1="28" y1="28" x2="52" y2="28" stroke="#7eb8d4" strokeWidth="1.2" opacity="0.7" />
      <line x1="28" y1="31" x2="52" y2="31" stroke="#7eb8d4" strokeWidth="1.2" opacity="0.55" />
      <circle className="sil-led ice" cx="40" cy="18" r="2.4" fill="#3d8eb8" />
    </g>
  )
}

function RackArt() {
  return (
    <g className="art-rack">
      <rect
        className="sil-hull"
        x="24"
        y="14"
        width="32"
        height="44"
        rx="2"
        fill="url(#hull-rack)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <rect x="27" y="17" width="26" height="38" rx="1" fill="#1a2330" opacity="0.12" />
      {[20, 28, 36, 44, 52].map((y) => (
        <g key={y}>
          <rect x="28" y={y} width="24" height="5" rx="0.6" fill="#eef3f8" stroke="#6b8299" strokeWidth="0.6" />
          <circle className="sil-led amber" cx="31" cy={y + 2.5} r="1.3" fill="#a86a28" />
          <circle className="sil-led ice" cx="35" cy={y + 2.5} r="1.3" fill="#3d8eb8" />
          <rect x="39" y={y + 1.5} width="10" height="2" rx="0.4" fill="#9aadc0" opacity="0.7" />
        </g>
      ))}
      <rect x="22" y="56" width="36" height="4" rx="1" fill="#7a90a4" stroke="#5a738a" strokeWidth="0.7" />
    </g>
  )
}

function UplinkArt() {
  return (
    <g className="art-uplink">
      <rect x="37" y="28" width="6" height="30" rx="1" fill="url(#steel-uplink)" stroke="#5a738a" strokeWidth="1" />
      <rect x="30" y="54" width="20" height="5" rx="1" fill="#7a90a4" stroke="#5a738a" strokeWidth="0.8" />
      <path
        className="sil-hull sil-dish"
        d="M16 34 Q40 8 64 34 Q52 28 40 28 Q28 28 16 34 Z"
        fill="url(#hull-uplink)"
        stroke="#3d8eb8"
        strokeWidth="1.4"
      />
      <ellipse cx="40" cy="30" rx="10" ry="4" fill="#d8e2ec" stroke="#5a738a" strokeWidth="0.8" />
      <line x1="40" y1="30" x2="40" y2="18" stroke="#6b8299" strokeWidth="1.2" />
      <circle className="sil-led ice sil-ping" cx="40" cy="16" r="3" fill="#3d8eb8" />
      <circle className="sil-ring" cx="40" cy="16" r="6" fill="none" stroke="#7eb8d4" strokeWidth="1" opacity="0.5" />
    </g>
  )
}

function RelayArt() {
  return (
    <g className="art-relay">
      <rect x="28" y="40" width="24" height="18" rx="2" fill="url(#hull-relay)" stroke="#5a738a" strokeWidth="1.3" />
      <path
        className="sil-hull"
        d="M32 40 L32 22 L40 10 L48 22 L48 40 Z"
        fill="url(#steel-relay)"
        stroke="#5a738a"
        strokeWidth="1.3"
      />
      <rect x="36" y="24" width="8" height="14" rx="1" fill="#c5d4e2" stroke="#6b8299" strokeWidth="0.7" />
      <rect className="sil-beam" x="38" y="4" width="4" height="10" rx="1" fill="#7eb8d4" />
      <circle className="sil-led amber" cx="40" cy="4" r="3" fill="#d4893a" />
      <path
        className="sil-beam-flare"
        d="M40 4 L34 -2 M40 4 L40 -4 M40 4 L46 -2"
        stroke="#e8a050"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.55"
      />
      <circle className="sil-led ice" cx="34" cy="48" r="2" fill="#3d8eb8" />
      <circle className="sil-led ice" cx="46" cy="48" r="2" fill="#3d8eb8" />
    </g>
  )
}

function SwitchArt() {
  return (
    <g className="art-switch">
      <rect
        className="sil-hull"
        x="14"
        y="40"
        width="52"
        height="18"
        rx="2.5"
        fill="url(#hull-switch)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <path
        d="M18 40 L18 22 L26 14 L34 22 L34 40 Z"
        fill="url(#steel-switch)"
        stroke="#5a738a"
        strokeWidth="1.2"
      />
      <path
        d="M46 40 L46 22 L54 14 L62 22 L62 40 Z"
        fill="url(#steel-switch)"
        stroke="#5a738a"
        strokeWidth="1.2"
      />
      <rect x="37" y="18" width="6" height="22" rx="1" fill="#8aa0b4" stroke="#5a738a" strokeWidth="0.9" />
      <circle className="sil-led amber" cx="40" cy="14" r="3.5" fill="#d4893a" />
      <line x1="40" y1="10" x2="40" y2="4" stroke="#3d8eb8" strokeWidth="1.5" />
      <circle className="sil-led ice" cx="40" cy="3" r="2.2" fill="#7eb8d4" />
      <circle className="sil-led ice" cx="24" cy="48" r="1.8" fill="#3d8eb8" />
      <circle className="sil-led amber" cx="32" cy="48" r="1.8" fill="#d4893a" />
      <circle className="sil-led ice" cx="48" cy="48" r="1.8" fill="#3d8eb8" />
      <circle className="sil-led amber" cx="56" cy="48" r="1.8" fill="#d4893a" />
      <rect x="22" y="43" width="36" height="2" rx="1" fill="#9aadc0" opacity="0.55" />
    </g>
  )
}

function BatteryArt() {
  return (
    <g className="art-battery">
      <rect
        className="sil-hull"
        x="18"
        y="28"
        width="44"
        height="28"
        rx="3"
        fill="url(#hull-battery)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <rect x="22" y="32" width="10" height="20" rx="1.5" fill="#d8e2ec" stroke="#6b8299" strokeWidth="0.8" />
      <rect x="35" y="32" width="10" height="20" rx="1.5" fill="#d8e2ec" stroke="#6b8299" strokeWidth="0.8" />
      <rect x="48" y="32" width="10" height="20" rx="1.5" fill="#d8e2ec" stroke="#6b8299" strokeWidth="0.8" />
      <rect x="24" y="36" width="6" height="12" rx="1" className="sil-led amber" fill="#a86a28" />
      <rect x="37" y="36" width="6" height="12" rx="1" className="sil-led amber" fill="#a86a28" />
      <rect x="50" y="36" width="6" height="12" rx="1" className="sil-led amber" fill="#a86a28" />
      <rect x="32" y="22" width="16" height="6" rx="1" fill="url(#steel-battery)" stroke="#5a738a" strokeWidth="0.9" />
      <circle className="sil-led ice" cx="40" cy="18" r="2.2" fill="#3d8eb8" />
    </g>
  )
}

function CacheArt() {
  return (
    <g className="art-cache">
      <ellipse
        className="sil-hull"
        cx="40"
        cy="42"
        rx="22"
        ry="14"
        fill="url(#hull-cache)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <ellipse cx="40" cy="38" rx="14" ry="8" fill="#eef3f8" stroke="#3d8eb8" strokeWidth="1" />
      <circle className="sil-ring" cx="40" cy="38" r="10" fill="none" stroke="#7eb8d4" strokeWidth="1.2" opacity="0.7" />
      <rect x="37" y="20" width="6" height="16" rx="1" fill="url(#steel-cache)" stroke="#5a738a" strokeWidth="0.8" />
      <circle className="sil-led ice" cx="40" cy="16" r="3" fill="#3d8eb8" />
      <circle className="sil-led amber" cx="28" cy="44" r="1.8" fill="#d4893a" />
      <circle className="sil-led amber" cx="52" cy="44" r="1.8" fill="#d4893a" />
    </g>
  )
}

function QuantumArt() {
  return (
    <g className="art-quantum">
      <path
        className="sil-hull"
        d="M20 56 L16 36 Q16 24 40 14 Q64 24 64 36 L60 56 Z"
        fill="url(#hull-quantum)"
        stroke="#3d8eb8"
        strokeWidth="1.4"
      />
      <ellipse cx="40" cy="36" rx="12" ry="8" fill="#d8e2ec" stroke="#7eb8d4" strokeWidth="1" />
      <path
        d="M28 36 Q40 28 52 36 Q40 44 28 36"
        fill="none"
        stroke="#3d8eb8"
        strokeWidth="1.2"
        opacity="0.8"
      />
      <circle className="sil-led ice" cx="40" cy="36" r="3.5" fill="#7eb8d4" />
      <rect x="26" y="48" width="28" height="6" rx="1" fill="#8aa0b4" stroke="#5a738a" strokeWidth="0.7" />
      <circle className="sil-led ice" cx="30" cy="24" r="1.6" fill="#7eb8d4" />
      <circle className="sil-led ice" cx="50" cy="24" r="1.6" fill="#7eb8d4" />
    </g>
  )
}

function ScrubArt() {
  return (
    <g className="art-scrub">
      <rect
        className="sil-hull"
        x="12"
        y="36"
        width="56"
        height="20"
        rx="3"
        fill="url(#hull-scrub)"
        stroke="#5a738a"
        strokeWidth="1.4"
      />
      <path
        d="M18 46 H30 Q34 46 34 40 H46 Q46 52 58 52 H66"
        fill="none"
        stroke="#3d8eb8"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <rect x="28" y="22" width="24" height="14" rx="2" fill="url(#steel-scrub)" stroke="#5a738a" strokeWidth="1.1" />
      <circle className="sil-led amber" cx="34" cy="29" r="2" fill="#d4893a" />
      <circle className="sil-led ice" cx="40" cy="29" r="2" fill="#3d8eb8" />
      <circle className="sil-led amber" cx="46" cy="29" r="2" fill="#d4893a" />
      <rect x="22" y="54" width="36" height="4" rx="1" fill="#7a90a4" stroke="#5a738a" strokeWidth="0.7" />
    </g>
  )
}
