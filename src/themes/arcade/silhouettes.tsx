import type { SilhouetteKind } from '../../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Distinct SVG arcade cabinets — cyan/magenta neon, pale hulls, readable at map scale. */
export function ArcadeSilhouettes({
  kind,
  level,
  locked = false,
  producing = false,
  selected = false,
}: Props) {
  const lit = level > 0 && !locked
  const state =
    `building-sil sil-${kind} sil-arcade` +
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
          <linearGradient id={`arc-hull-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fbfe" />
            <stop offset="42%" stopColor="#d0deec" />
            <stop offset="100%" stopColor="#6e8aa6" />
          </linearGradient>
          <linearGradient id={`arc-steel-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef4fa" />
            <stop offset="100%" stopColor="#4a6a88" />
          </linearGradient>
          <linearGradient id={`arc-screen-${kind}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1e3a4a" />
            <stop offset="55%" stopColor="#0a9cba" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#062838" />
          </linearGradient>
          <linearGradient id={`arc-neon-m-${kind}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f24d9a" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#d91872" />
            <stop offset="100%" stopColor="#f24d9a" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id={`arc-neon-c-${kind}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5ecfe0" stopOpacity="0.25" />
            <stop offset="50%" stopColor="#0a9cba" />
            <stop offset="100%" stopColor="#5ecfe0" stopOpacity="0.25" />
          </linearGradient>
          <radialGradient id={`arc-pad-${kind}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5ecfe0" stopOpacity="0.9" />
            <stop offset="55%" stopColor="#0a9cba" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0a9cba" stopOpacity="0.08" />
          </radialGradient>
          <radialGradient id={`arc-glow-${kind}`} cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#5ecfe0" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0a9cba" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse
          className="sil-pad"
          cx="40"
          cy="63"
          rx="30"
          ry="5.5"
          fill={`url(#arc-pad-${kind})`}
        />
        <ellipse
          cx="40"
          cy="36"
          rx="26"
          ry="22"
          fill={`url(#arc-glow-${kind})`}
          opacity="0.45"
          className="sil-arcade-glow"
        />

        {kind === 'power' ? <ClassicCabinetArt /> : null}
        {kind === 'cool' ? <TicketPrinterArt /> : null}
        {kind === 'rack' ? <RacingCabArt /> : null}
        {kind === 'uplink' ? <ClawMachineArt /> : null}
        {kind === 'relay' ? <DancePadArt /> : null}
        {kind === 'switch' ? <PrizeWallArt /> : null}
        {kind === 'battery' ? <TokenChangerArt /> : null}
        {kind === 'cache' ? <PinballArt /> : null}
        {kind === 'quantum' ? <LightGunArt /> : null}
        {kind === 'scrub' ? <TournamentDeskArt /> : null}
      </svg>
      {producing ? <span className="sil-particles sil-arcade-tokens" /> : null}
    </div>
  )
}

function ClassicCabinetArt() {
  return (
    <g className="art-power">
      <path
        className="sil-hull"
        d="M21 57 L18 24 Q18 12 40 9 Q62 12 62 24 L59 57 Z"
        fill="url(#arc-hull-power)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path
        d="M22 24 Q22 14 40 12 Q58 14 58 24"
        fill="none"
        stroke="url(#arc-neon-m-power)"
        strokeWidth="2.2"
        className="sil-neon-tube"
      />
      <rect x="24" y="18" width="32" height="20" rx="2" fill="#0d1a28" opacity="0.92" />
      <rect
        x="26"
        y="20"
        width="28"
        height="16"
        rx="1.2"
        fill="url(#arc-screen-power)"
        className="sil-screen"
      />
      <path d="M30 24 H50 M34 28 H46 M32 32 H48" stroke="#5ecfe0" strokeWidth="0.9" opacity="0.55" />
      <circle className="sil-led core" cx="40" cy="28" r="3.2" fill="#d91872" />
      <rect x="26" y="42" width="28" height="8" rx="1.5" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.85" />
      <circle className="sil-led amber" cx="32" cy="46" r="2.1" fill="#d91872" />
      <circle cx="40" cy="46" r="3.2" fill="#c2d2e4" stroke="#4a6a88" strokeWidth="0.9" />
      <circle className="sil-led ice" cx="48" cy="46" r="2.1" fill="#0a9cba" />
      <rect x="22" y="54" width="36" height="4.5" rx="1.2" fill="#7a94ae" stroke="#4a6a88" strokeWidth="0.7" />
      <rect x="36" y="55" width="8" height="2" rx="0.6" fill="#c9a227" opacity="0.85" />
    </g>
  )
}

function TicketPrinterArt() {
  return (
    <g className="art-cool">
      <rect
        className="sil-hull"
        x="16"
        y="26"
        width="48"
        height="30"
        rx="4"
        fill="url(#arc-hull-cool)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path
        d="M18 28 H62"
        stroke="url(#arc-neon-c-cool)"
        strokeWidth="2"
        className="sil-neon-tube"
      />
      <rect x="22" y="32" width="36" height="12" rx="1.5" fill="#f8fbfe" stroke="#d91872" strokeWidth="1.1" />
      <path d="M26 38 H58" stroke="#d91872" strokeWidth="1.4" strokeDasharray="4 2.5" />
      <path d="M26 41 H50" stroke="#f24d9a" strokeWidth="1" strokeDasharray="3 2" opacity="0.7" />
      <rect x="32" y="12" width="16" height="16" rx="2.5" fill="url(#arc-steel-cool)" stroke="#4a6a88" strokeWidth="1.1" />
      <circle className="sil-led ice" cx="40" cy="19" r="2.8" fill="#0a9cba" />
      <rect x="28" y="48" width="24" height="5" rx="1" fill="#f24d9a" opacity="0.75" />
      <path d="M30 53 L34 58 H46 L50 53" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.7" />
    </g>
  )
}

function RacingCabArt() {
  return (
    <g className="art-rack">
      <rect
        className="sil-hull"
        x="14"
        y="28"
        width="52"
        height="28"
        rx="4"
        fill="url(#arc-hull-rack)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path
        d="M20 28 L26 12 H54 L60 28"
        fill="#c8d8e8"
        stroke="#4a6a88"
        strokeWidth="1.2"
      />
      <path d="M22 28 H58" stroke="url(#arc-neon-m-rack)" strokeWidth="2" className="sil-neon-tube" />
      <rect x="26" y="14" width="28" height="12" rx="1.5" fill="#0d1a28" opacity="0.9" />
      <rect
        x="28"
        y="16"
        width="24"
        height="8"
        rx="0.8"
        fill="url(#arc-screen-rack)"
        className="sil-screen"
      />
      <path d="M32 20 H48" stroke="#5ecfe0" strokeWidth="1" opacity="0.6" />
      <ellipse cx="28" cy="42" rx="6" ry="5" fill="#2a3548" stroke="#4a6a88" strokeWidth="0.9" />
      <ellipse cx="52" cy="42" rx="6" ry="5" fill="#2a3548" stroke="#4a6a88" strokeWidth="0.9" />
      <circle className="sil-led amber" cx="28" cy="42" r="2.4" fill="#d91872" />
      <circle className="sil-led ice" cx="52" cy="42" r="2.4" fill="#0a9cba" />
      <rect x="36" y="46" width="8" height="5" rx="1" fill="#7a94ae" />
      <path d="M18 54 H62" stroke="#5a7a98" strokeWidth="1.2" opacity="0.5" />
    </g>
  )
}

function ClawMachineArt() {
  return (
    <g className="art-uplink">
      <rect
        className="sil-hull"
        x="18"
        y="10"
        width="44"
        height="46"
        rx="3.5"
        fill="url(#arc-hull-uplink)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path
        d="M20 12 H60"
        stroke="url(#arc-neon-c-uplink)"
        strokeWidth="2.2"
        className="sil-neon-tube"
      />
      <rect x="22" y="16" width="36" height="28" rx="1.5" fill="#cfe0f0" stroke="#0a9cba" strokeWidth="1" />
      <rect x="24" y="18" width="32" height="24" rx="1" fill="#a8c4d8" opacity="0.35" className="sil-screen" />
      <path d="M40 18 V36" stroke="#5a7a98" strokeWidth="1.3" />
      <circle cx="40" cy="18" r="1.8" fill="#4a6a88" />
      <path
        d="M33 36 L40 42 L47 36"
        fill="none"
        stroke="#d91872"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="28" cy="28" r="3.5" fill="#f24d9a" opacity="0.8" />
      <circle cx="52" cy="32" r="2.8" fill="#0a9cba" opacity="0.8" />
      <circle cx="44" cy="24" r="2.2" fill="#c9a227" opacity="0.85" />
      <circle cx="32" cy="34" r="2" fill="#5ecfe0" opacity="0.7" />
      <rect x="22" y="48" width="36" height="6" rx="1.2" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.75" />
      <circle className="sil-led ice" cx="32" cy="51" r="1.6" fill="#0a9cba" />
      <circle className="sil-led amber" cx="48" cy="51" r="1.6" fill="#d91872" />
    </g>
  )
}

function DancePadArt() {
  return (
    <g className="art-relay">
      <rect
        className="sil-hull"
        x="12"
        y="34"
        width="56"
        height="22"
        rx="3.5"
        fill="url(#arc-hull-relay)"
        stroke="#4a6a88"
        strokeWidth="1.4"
      />
      <rect x="18" y="38" width="12" height="12" rx="1.5" fill="#d91872" opacity="0.82" />
      <rect x="34" y="38" width="12" height="12" rx="1.5" fill="#0a9cba" opacity="0.82" />
      <rect x="50" y="38" width="12" height="12" rx="1.5" fill="#d91872" opacity="0.62" />
      <path d="M21 41 L27 47 M27 41 L21 47" stroke="#f8fbfe" strokeWidth="1.3" opacity="0.85" />
      <path d="M40 40 V48 M36 44 H44" stroke="#f8fbfe" strokeWidth="1.3" opacity="0.85" />
      <path d="M53 41 L59 47 M59 41 L53 47" stroke="#f8fbfe" strokeWidth="1.3" opacity="0.7" />
      <rect
        x="28"
        y="10"
        width="24"
        height="24"
        rx="2.5"
        fill="url(#arc-steel-relay)"
        stroke="#4a6a88"
        strokeWidth="1.2"
      />
      <rect x="32" y="14" width="16" height="12" rx="1.2" fill="#0d1a28" opacity="0.85" />
      <rect
        x="33"
        y="15"
        width="14"
        height="10"
        rx="0.8"
        fill="url(#arc-screen-relay)"
        className="sil-screen"
      />
      <circle className="sil-led amber" cx="40" cy="20" r="2.2" fill="#f24d9a" />
      <path d="M30 32 H50" stroke="url(#arc-neon-m-relay)" strokeWidth="1.8" className="sil-neon-tube" />
      <rect x="20" y="54" width="40" height="4" rx="1" fill="#7a94ae" stroke="#4a6a88" strokeWidth="0.7" />
    </g>
  )
}

function PrizeWallArt() {
  return (
    <g className="art-switch">
      <rect
        className="sil-hull"
        x="10"
        y="16"
        width="60"
        height="40"
        rx="3.5"
        fill="url(#arc-hull-switch)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path d="M12 18 H68" stroke="url(#arc-neon-c-switch)" strokeWidth="2" className="sil-neon-tube" />
      {[20, 32, 44].map((y, row) => (
        <g key={y}>
          <rect
            x="14"
            y={y}
            width="12"
            height="9"
            rx="1.2"
            fill="#f8fbfe"
            stroke={row % 2 === 0 ? '#0a9cba' : '#d91872'}
            strokeWidth="0.85"
          />
          <rect
            x="30"
            y={y}
            width="12"
            height="9"
            rx="1.2"
            fill="#f8fbfe"
            stroke={row % 2 === 0 ? '#d91872' : '#c9a227'}
            strokeWidth="0.85"
          />
          <rect
            x="46"
            y={y}
            width="12"
            height="9"
            rx="1.2"
            fill="#f8fbfe"
            stroke={row % 2 === 0 ? '#c9a227' : '#0a9cba'}
            strokeWidth="0.85"
          />
          <rect x="62" y={y} width="6" height="9" rx="1" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.65" />
          <circle cx="20" cy={y + 4.5} r="1.4" fill={row === 1 ? '#d91872' : '#0a9cba'} opacity="0.7" />
          <circle cx="36" cy={y + 4.5} r="1.4" fill="#c9a227" opacity="0.75" />
        </g>
      ))}
      <rect x="26" y="8" width="28" height="9" rx="1.5" fill="#0a9cba" opacity="0.9" />
      <circle className="sil-led core" cx="40" cy="12.5" r="2.4" fill="#f8fbfe" />
      <path d="M30 12.5 H36 M44 12.5 H50" stroke="#5ecfe0" strokeWidth="1.2" opacity="0.8" />
    </g>
  )
}

function TokenChangerArt() {
  return (
    <g className="art-battery">
      <rect
        className="sil-hull"
        x="22"
        y="12"
        width="36"
        height="44"
        rx="5"
        fill="url(#arc-hull-battery)"
        stroke="#4a6a88"
        strokeWidth="1.55"
      />
      <path
        d="M24 16 H56"
        stroke="url(#arc-neon-m-battery)"
        strokeWidth="2"
        className="sil-neon-tube"
      />
      <circle cx="40" cy="34" r="12" fill="#e8c84a" opacity="0.92" stroke="#a88620" strokeWidth="1.4" />
      <circle cx="40" cy="34" r="8.5" fill="#c9a227" opacity="0.55" />
      <text
        x="40"
        y="38.5"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="#1a2438"
        fontFamily="sans-serif"
      >
        T
      </text>
      <rect x="28" y="18" width="24" height="6" rx="1" fill="#0d1a28" opacity="0.75" />
      <rect x="30" y="19.5" width="20" height="3" rx="0.6" fill="#0a9cba" opacity="0.65" className="sil-screen" />
      <rect x="28" y="48" width="24" height="5" rx="1" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.7" />
      <circle className="sil-led ice" cx="40" cy="22" r="1.8" fill="#0a9cba" />
      <rect x="34" y="54" width="12" height="3" rx="0.8" fill="#7a94ae" />
    </g>
  )
}

function PinballArt() {
  return (
    <g className="art-cache">
      <path
        className="sil-hull"
        d="M16 58 L12 40 Q10 26 28 12 L52 12 Q70 26 68 40 L64 58 Z"
        fill="url(#arc-hull-cache)"
        stroke="#4a6a88"
        strokeWidth="1.4"
      />
      <path
        d="M20 16 Q40 10 60 16"
        fill="none"
        stroke="url(#arc-neon-c-cache)"
        strokeWidth="2"
        className="sil-neon-tube"
      />
      <ellipse cx="40" cy="34" rx="16" ry="12" fill="#0d1a28" opacity="0.2" />
      <ellipse cx="40" cy="34" rx="14" ry="10" fill="#1a3040" opacity="0.35" className="sil-screen" />
      <circle cx="32" cy="28" r="2.8" fill="#0a9cba" className="sil-led ice" />
      <circle cx="48" cy="36" r="2.2" fill="#d91872" className="sil-led amber" />
      <circle cx="40" cy="24" r="1.8" fill="#c9a227" />
      <circle cx="36" cy="38" r="1.5" fill="#5ecfe0" />
      <path d="M22 50 Q40 42 58 50" fill="none" stroke="#5a7a98" strokeWidth="1.7" />
      <path d="M24 54 Q40 48 56 54" fill="none" stroke="#4a6a88" strokeWidth="1.2" opacity="0.6" />
      <circle className="sil-led amber" cx="40" cy="16" r="2.2" fill="#f24d9a" />
      <rect x="30" y="56" width="20" height="3" rx="1" fill="#7a94ae" />
    </g>
  )
}

function LightGunArt() {
  return (
    <g className="art-quantum">
      <rect
        className="sil-hull"
        x="16"
        y="20"
        width="48"
        height="34"
        rx="3.5"
        fill="url(#arc-hull-quantum)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path d="M18 24 H62" stroke="url(#arc-neon-m-quantum)" strokeWidth="2" className="sil-neon-tube" />
      <rect x="22" y="26" width="36" height="18" rx="1.5" fill="#0d1a28" opacity="0.9" />
      <rect
        x="24"
        y="28"
        width="32"
        height="14"
        rx="1"
        fill="url(#arc-screen-quantum)"
        className="sil-screen"
      />
      <circle className="sil-led core" cx="40" cy="35" r="3.4" fill="#d91872" />
      <path d="M28 32 H36 M44 32 H52" stroke="#5ecfe0" strokeWidth="0.9" opacity="0.5" />
      <path d="M28 52 H52" stroke="#5a7a98" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="26" cy="52" r="3.5" fill="#7a94ae" stroke="#4a6a88" strokeWidth="0.85" />
      <rect
        x="50"
        y="46"
        width="12"
        height="10"
        rx="1.5"
        fill="url(#arc-steel-quantum)"
        stroke="#4a6a88"
        strokeWidth="0.85"
      />
      <circle className="sil-led ice" cx="56" cy="51" r="1.6" fill="#0a9cba" />
      <rect x="30" y="12" width="20" height="8" rx="1.5" fill="#c2d2e4" stroke="#5a7a98" strokeWidth="0.8" />
    </g>
  )
}

function TournamentDeskArt() {
  return (
    <g className="art-scrub">
      <rect
        className="sil-hull"
        x="10"
        y="34"
        width="60"
        height="22"
        rx="3.5"
        fill="url(#arc-hull-scrub)"
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path d="M12 36 H68" stroke="url(#arc-neon-c-scrub)" strokeWidth="1.8" className="sil-neon-tube" />
      <rect
        x="18"
        y="10"
        width="44"
        height="26"
        rx="2.5"
        fill="url(#arc-steel-scrub)"
        stroke="#4a6a88"
        strokeWidth="1.2"
      />
      <rect x="22" y="14" width="36" height="16" rx="1.2" fill="#0d1a28" opacity="0.85" />
      {[26, 34, 42, 50].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={16 + (i % 2)}
          width="5"
          height={10 - (i % 3)}
          rx="0.6"
          fill={i % 2 === 0 ? '#0a9cba' : '#d91872'}
          opacity="0.9"
          className="sil-led"
        />
      ))}
      <circle className="sil-led ice" cx="28" cy="45" r="2.2" fill="#0a9cba" />
      <circle className="sil-led amber" cx="40" cy="45" r="2.2" fill="#d91872" />
      <circle className="sil-led ice" cx="52" cy="45" r="2.2" fill="#0a9cba" />
      <rect x="24" y="50" width="32" height="3" rx="0.8" fill="#c9a227" opacity="0.55" />
    </g>
  )
}
