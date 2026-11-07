import type { SilhouetteKind } from '../../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Crisp SVG farm modules — glass, greens, soft earth. */
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
        viewBox="0 0 80 70"
        width="72"
        height="63"
        focusable="false"
      >
        <defs>
          <linearGradient id={`farm-hull-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f7fbf4" />
            <stop offset="55%" stopColor="#c5d9b8" />
            <stop offset="100%" stopColor="#8fad7e" />
          </linearGradient>
          <linearGradient id={`farm-steel-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef6ea" />
            <stop offset="100%" stopColor="#6b8f5e" />
          </linearGradient>
          <radialGradient id={`farm-pad-${kind}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a8c09a" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6b8f5e" stopOpacity="0.35" />
          </radialGradient>
        </defs>

        <ellipse
          className="sil-pad"
          cx="40"
          cy="62"
          rx="28"
          ry="6"
          fill={`url(#farm-pad-${kind})`}
        />

        {kind === 'power' ? <GreenhouseArt /> : null}
        {kind === 'cool' ? <NutrientPumpArt /> : null}
        {kind === 'rack' ? <LedWallArt /> : null}
        {kind === 'uplink' ? <HydroBedArt /> : null}
        {kind === 'relay' ? <VerticalTowerArt /> : null}
        {kind === 'switch' ? <ClimateArt /> : null}
        {kind === 'battery' ? <WaterTankArt /> : null}
        {kind === 'cache' ? <CompactBedArt /> : null}
        {kind === 'quantum' ? <ComposterArt /> : null}
        {kind === 'scrub' ? <AquaponicsArt /> : null}
      </svg>
      {producing ? <span className="sil-particles" /> : null}
    </div>
  )
}

function GreenhouseArt() {
  return (
    <g className="art-power">
      <path
        className="sil-hull"
        d="M16 56 L16 34 L40 14 L64 34 L64 56 Z"
        fill="url(#farm-hull-power)"
        stroke="#5a7a4e"
        strokeWidth="1.4"
      />
      <path d="M18 34 L40 16 L62 34" fill="none" stroke="#7a9a6a" strokeWidth="1" />
      <rect x="22" y="36" width="14" height="16" rx="1" fill="#dcecc8" stroke="#3d8b4f" strokeWidth="0.9" />
      <rect x="44" y="36" width="14" height="16" rx="1" fill="#dcecc8" stroke="#3d8b4f" strokeWidth="0.9" />
      <path d="M25 48 Q29 40 33 48" fill="none" stroke="#3d8b4f" strokeWidth="1.4" />
      <path d="M47 48 Q51 40 55 48" fill="none" stroke="#3d8b4f" strokeWidth="1.4" />
      <circle className="sil-led core" cx="40" cy="28" r="3" fill="#3d8b4f" />
      <rect x="28" y="54" width="24" height="4" rx="1" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function NutrientPumpArt() {
  return (
    <g className="art-cool">
      <rect
        className="sil-hull"
        x="18"
        y="32"
        width="44"
        height="24"
        rx="4"
        fill="url(#farm-hull-cool)"
        stroke="#5a7a4e"
        strokeWidth="1.4"
      />
      <circle cx="32" cy="44" r="8" fill="#cfe6f0" stroke="#4a8aa0" strokeWidth="1.2" />
      <circle cx="48" cy="44" r="8" fill="#cfe6f0" stroke="#4a8aa0" strokeWidth="1.2" />
      <path d="M32 44 H48" stroke="#4a8aa0" strokeWidth="2" strokeLinecap="round" />
      <rect x="34" y="18" width="12" height="14" rx="2" fill="url(#farm-steel-cool)" stroke="#5a7a4e" strokeWidth="1" />
      <circle className="sil-led ice" cx="40" cy="24" r="2.4" fill="#3d8b4f" />
      <path d="M26 28 Q20 36 26 40" fill="none" stroke="#4a8aa0" strokeWidth="1.5" opacity="0.7" />
      <path d="M54 28 Q60 36 54 40" fill="none" stroke="#4a8aa0" strokeWidth="1.5" opacity="0.7" />
    </g>
  )
}

function LedWallArt() {
  return (
    <g className="art-rack">
      <rect
        className="sil-hull"
        x="22"
        y="14"
        width="36"
        height="44"
        rx="2"
        fill="url(#farm-hull-rack)"
        stroke="#5a7a4e"
        strokeWidth="1.4"
      />
      {[20, 30, 40, 50].map((y) => (
        <g key={y}>
          <rect x="26" y={y} width="28" height="6" rx="0.8" fill="#1e2e1a" opacity="0.12" />
          <rect x="28" y={y + 1} width="24" height="4" rx="0.6" fill="#8ec99a" opacity="0.85" />
          <circle className="sil-led amber" cx="30" cy={y + 3} r="1.2" fill="#e8a050" />
          <circle className="sil-led ice" cx="50" cy={y + 3} r="1.2" fill="#3d8b4f" />
        </g>
      ))}
      <rect x="20" y="56" width="40" height="4" rx="1" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function HydroBedArt() {
  return (
    <g className="art-uplink">
      <rect
        className="sil-hull"
        x="12"
        y="40"
        width="56"
        height="16"
        rx="3"
        fill="url(#farm-hull-uplink)"
        stroke="#5a7a4e"
        strokeWidth="1.3"
      />
      <rect x="16" y="34" width="14" height="10" rx="1" fill="#dcecc8" stroke="#3d8b4f" strokeWidth="0.8" />
      <rect x="33" y="34" width="14" height="10" rx="1" fill="#dcecc8" stroke="#3d8b4f" strokeWidth="0.8" />
      <rect x="50" y="34" width="14" height="10" rx="1" fill="#dcecc8" stroke="#3d8b4f" strokeWidth="0.8" />
      <path d="M20 34 Q23 26 26 34" fill="none" stroke="#3d8b4f" strokeWidth="1.3" />
      <path d="M37 34 Q40 26 43 34" fill="none" stroke="#3d8b4f" strokeWidth="1.3" />
      <path d="M54 34 Q57 26 60 34" fill="none" stroke="#3d8b4f" strokeWidth="1.3" />
      <rect x="18" y="46" width="44" height="4" rx="1" fill="#7eb8d4" opacity="0.55" />
      <circle className="sil-led ice" cx="40" cy="28" r="2.2" fill="#3d8b4f" />
    </g>
  )
}

function VerticalTowerArt() {
  return (
    <g className="art-relay">
      <rect
        className="sil-hull"
        x="30"
        y="10"
        width="20"
        height="48"
        rx="3"
        fill="url(#farm-hull-relay)"
        stroke="#5a7a4e"
        strokeWidth="1.4"
      />
      {[16, 26, 36, 46].map((y) => (
        <g key={y}>
          <ellipse cx="40" cy={y} rx="14" ry="4" fill="#c5d9b8" stroke="#5a7a4e" strokeWidth="0.8" />
          <path
            d={`M30 ${y} Q34 ${y - 6} 40 ${y} Q46 ${y - 6} 50 ${y}`}
            fill="none"
            stroke="#3d8b4f"
            strokeWidth="1.1"
          />
        </g>
      ))}
      <rect x="26" y="56" width="28" height="4" rx="1" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
      <circle className="sil-led amber" cx="40" cy="8" r="2.5" fill="#e8a050" />
    </g>
  )
}

function ClimateArt() {
  return (
    <g className="art-switch">
      <rect
        className="sil-hull"
        x="14"
        y="28"
        width="52"
        height="28"
        rx="3"
        fill="url(#farm-hull-switch)"
        stroke="#5a7a4e"
        strokeWidth="1.4"
      />
      <rect x="20" y="34" width="18" height="16" rx="2" fill="#eef6ea" stroke="#6b8f5e" strokeWidth="0.9" />
      <rect x="42" y="34" width="18" height="16" rx="2" fill="#eef6ea" stroke="#6b8f5e" strokeWidth="0.9" />
      <path d="M24 42 H34 M28 38 V46" stroke="#3d8b4f" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="51" cy="42" r="5" fill="none" stroke="#4a8aa0" strokeWidth="1.4" />
      <path d="M51 37 L52 42 L51 47 L50 42 Z" fill="#7eb8d4" />
      <rect x="34" y="16" width="12" height="12" rx="2" fill="url(#farm-steel-switch)" stroke="#5a7a4e" strokeWidth="1" />
      <circle className="sil-led amber" cx="40" cy="22" r="2.4" fill="#e8a050" />
    </g>
  )
}

function WaterTankArt() {
  return (
    <g className="art-battery">
      <ellipse cx="40" cy="54" rx="18" ry="5" fill="#6b8f5e" opacity="0.35" />
      <rect
        className="sil-hull"
        x="22"
        y="18"
        width="36"
        height="36"
        rx="16"
        fill="url(#farm-hull-battery)"
        stroke="#4a8aa0"
        strokeWidth="1.5"
      />
      <rect x="26" y="34" width="28" height="16" rx="8" fill="#7eb8d4" opacity="0.55" />
      <ellipse cx="40" cy="34" rx="14" ry="4" fill="#cfe6f0" stroke="#4a8aa0" strokeWidth="0.8" />
      <rect x="36" y="12" width="8" height="8" rx="1" fill="url(#farm-steel-battery)" stroke="#5a7a4e" strokeWidth="0.8" />
      <circle className="sil-led ice" cx="40" cy="26" r="2" fill="#3d8b4f" />
    </g>
  )
}

function CompactBedArt() {
  return (
    <g className="art-cache">
      <rect
        className="sil-hull"
        x="10"
        y="38"
        width="60"
        height="18"
        rx="3"
        fill="url(#farm-hull-cache)"
        stroke="#5a7a4e"
        strokeWidth="1.3"
      />
      {[16, 28, 40, 52, 64].map((x) => (
        <g key={x}>
          <rect x={x - 4} y="28" width="8" height="12" rx="1" fill="#dcecc8" stroke="#3d8b4f" strokeWidth="0.7" />
          <path
            d={`M${x} 28 Q${x - 3} 20 ${x} 22 Q${x + 3} 20 ${x} 28`}
            fill="#3d8b4f"
            opacity="0.85"
          />
        </g>
      ))}
      <rect x="14" y="44" width="52" height="6" rx="1" fill="#a8c09a" opacity="0.5" />
    </g>
  )
}

function ComposterArt() {
  return (
    <g className="art-quantum">
      <path
        className="sil-hull"
        d="M18 56 L14 34 Q14 22 40 16 Q66 22 66 34 L62 56 Z"
        fill="url(#farm-hull-quantum)"
        stroke="#8a7348"
        strokeWidth="1.4"
      />
      <ellipse cx="40" cy="36" rx="16" ry="8" fill="#c4a878" opacity="0.45" />
      <path
        d="M28 40 Q40 28 52 40"
        fill="none"
        stroke="#6b8f5e"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle className="sil-led amber" cx="40" cy="34" r="3" fill="#a86a28" />
      <rect x="26" y="50" width="28" height="6" rx="1" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}

function AquaponicsArt() {
  return (
    <g className="art-scrub">
      <rect
        className="sil-hull"
        x="12"
        y="34"
        width="56"
        height="22"
        rx="4"
        fill="url(#farm-hull-scrub)"
        stroke="#4a8aa0"
        strokeWidth="1.4"
      />
      <path
        d="M18 46 H28 Q34 40 40 46 Q46 52 52 46 H62"
        fill="none"
        stroke="#3d8b4f"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="28" y="18" width="24" height="16" rx="2" fill="url(#farm-steel-scrub)" stroke="#5a7a4e" strokeWidth="1.1" />
      <circle className="sil-led ice" cx="34" cy="26" r="2" fill="#3d8b4f" />
      <circle className="sil-led amber" cx="40" cy="26" r="2" fill="#e8a050" />
      <circle className="sil-led ice" cx="46" cy="26" r="2" fill="#3d8b4f" />
      <rect x="22" y="54" width="36" height="4" rx="1" fill="#8fad7e" stroke="#5a7a4e" strokeWidth="0.7" />
    </g>
  )
}
