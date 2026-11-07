import type { SilhouetteKind } from '../../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Crisp SVG arcade cabinets — cyan/magenta neon on pale hulls. */
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
            <stop offset="0%" stopColor="#f5f8fc" />
            <stop offset="55%" stopColor="#c2d2e4" />
            <stop offset="100%" stopColor="#7a94ae" />
          </linearGradient>
          <linearGradient id={`arc-steel-${kind}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#eef4fa" />
            <stop offset="100%" stopColor="#5a7a98" />
          </linearGradient>
          <radialGradient id={`arc-pad-${kind}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5ecfe0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0a9cba" stopOpacity="0.3" />
          </radialGradient>
        </defs>

        <ellipse
          className="sil-pad"
          cx="40"
          cy="62"
          rx="28"
          ry="6"
          fill={`url(#arc-pad-${kind})`}
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
      {producing ? <span className="sil-particles" /> : null}
    </div>
  )
}

function ClassicCabinetArt() {
  return (
    <g className="art-power">
      <path
        className="sil-hull"
        d="M22 56 L20 22 Q20 14 40 12 Q60 14 60 22 L58 56 Z"
        fill="url(#arc-hull-power)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      <rect x="26" y="20" width="28" height="18" rx="2" fill="#1a2438" opacity="0.85" />
      <rect x="28" y="22" width="24" height="14" rx="1" fill="#0a9cba" opacity="0.55" />
      <circle className="sil-led core" cx="40" cy="29" r="3" fill="#d91872" />
      <rect x="28" y="42" width="24" height="6" rx="1" fill="#e6eef8" stroke="#5a7a98" strokeWidth="0.8" />
      <circle className="sil-led amber" cx="34" cy="45" r="1.6" fill="#d91872" />
      <circle className="sil-led ice" cx="46" cy="45" r="1.6" fill="#0a9cba" />
      <rect x="24" y="54" width="32" height="4" rx="1" fill="#7a94ae" stroke="#5a7a98" strokeWidth="0.7" />
    </g>
  )
}

function TicketPrinterArt() {
  return (
    <g className="art-cool">
      <rect
        className="sil-hull"
        x="18"
        y="28"
        width="44"
        height="28"
        rx="4"
        fill="url(#arc-hull-cool)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      <rect x="24" y="34" width="32" height="10" rx="1" fill="#f5f8fc" stroke="#d91872" strokeWidth="1" />
      <path d="M28 39 H52" stroke="#d91872" strokeWidth="1.2" strokeDasharray="3 2" />
      <rect x="34" y="16" width="12" height="14" rx="2" fill="url(#arc-steel-cool)" stroke="#5a7a98" strokeWidth="1" />
      <circle className="sil-led ice" cx="40" cy="22" r="2.4" fill="#0a9cba" />
      <rect x="30" y="48" width="20" height="4" rx="1" fill="#f24d9a" opacity="0.7" />
    </g>
  )
}

function RacingCabArt() {
  return (
    <g className="art-rack">
      <rect
        className="sil-hull"
        x="16"
        y="30"
        width="48"
        height="26"
        rx="4"
        fill="url(#arc-hull-rack)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      <path d="M22 30 L28 16 H52 L58 30" fill="#c2d2e4" stroke="#5a7a98" strokeWidth="1.1" />
      <rect x="28" y="18" width="24" height="10" rx="1" fill="#1a2438" opacity="0.8" />
      <rect x="30" y="20" width="20" height="6" rx="0.6" fill="#0a9cba" opacity="0.65" />
      <circle className="sil-led amber" cx="34" cy="42" r="3" fill="#d91872" />
      <circle className="sil-led ice" cx="46" cy="42" r="3" fill="#0a9cba" />
      <rect x="36" y="48" width="8" height="4" rx="1" fill="#7a94ae" />
    </g>
  )
}

function ClawMachineArt() {
  return (
    <g className="art-uplink">
      <rect
        className="sil-hull"
        x="20"
        y="14"
        width="40"
        height="42"
        rx="3"
        fill="url(#arc-hull-uplink)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      <rect x="24" y="18" width="32" height="24" rx="1" fill="#d6e2f0" stroke="#0a9cba" strokeWidth="0.9" />
      <path d="M40 20 V34" stroke="#5a7a98" strokeWidth="1.2" />
      <path d="M34 34 L40 38 L46 34" fill="none" stroke="#d91872" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="30" cy="28" r="3" fill="#f24d9a" opacity="0.7" />
      <circle cx="50" cy="30" r="2.5" fill="#0a9cba" opacity="0.7" />
      <circle cx="40" cy="26" r="2" fill="#c9a227" opacity="0.8" />
      <rect x="24" y="46" width="32" height="6" rx="1" fill="#e6eef8" stroke="#5a7a98" strokeWidth="0.7" />
      <circle className="sil-led ice" cx="40" cy="49" r="1.5" fill="#0a9cba" />
    </g>
  )
}

function DancePadArt() {
  return (
    <g className="art-relay">
      <rect
        className="sil-hull"
        x="14"
        y="36"
        width="52"
        height="20"
        rx="3"
        fill="url(#arc-hull-relay)"
        stroke="#5a7a98"
        strokeWidth="1.3"
      />
      <rect x="20" y="40" width="10" height="10" rx="1" fill="#d91872" opacity="0.75" />
      <rect x="35" y="40" width="10" height="10" rx="1" fill="#0a9cba" opacity="0.75" />
      <rect x="50" y="40" width="10" height="10" rx="1" fill="#d91872" opacity="0.55" />
      <rect x="30" y="14" width="20" height="22" rx="2" fill="url(#arc-steel-relay)" stroke="#5a7a98" strokeWidth="1.1" />
      <rect x="34" y="18" width="12" height="10" rx="1" fill="#1a2438" opacity="0.75" />
      <circle className="sil-led amber" cx="40" cy="23" r="2" fill="#f24d9a" />
      <rect x="22" y="54" width="36" height="4" rx="1" fill="#7a94ae" stroke="#5a7a98" strokeWidth="0.7" />
    </g>
  )
}

function PrizeWallArt() {
  return (
    <g className="art-switch">
      <rect
        className="sil-hull"
        x="12"
        y="18"
        width="56"
        height="38"
        rx="3"
        fill="url(#arc-hull-switch)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      {[22, 34, 46].map((y) => (
        <g key={y}>
          <rect x="16" y={y} width="10" height="8" rx="1" fill="#f5f8fc" stroke="#0a9cba" strokeWidth="0.7" />
          <rect x="30" y={y} width="10" height="8" rx="1" fill="#f5f8fc" stroke="#d91872" strokeWidth="0.7" />
          <rect x="44" y={y} width="10" height="8" rx="1" fill="#f5f8fc" stroke="#c9a227" strokeWidth="0.7" />
          <rect x="58" y={y} width="6" height="8" rx="1" fill="#e6eef8" stroke="#5a7a98" strokeWidth="0.6" />
        </g>
      ))}
      <rect x="28" y="10" width="24" height="8" rx="1" fill="#0a9cba" opacity="0.85" />
      <circle className="sil-led core" cx="40" cy="14" r="2" fill="#f5f8fc" />
    </g>
  )
}

function TokenChangerArt() {
  return (
    <g className="art-battery">
      <rect
        className="sil-hull"
        x="24"
        y="16"
        width="32"
        height="40"
        rx="4"
        fill="url(#arc-hull-battery)"
        stroke="#5a7a98"
        strokeWidth="1.5"
      />
      <circle cx="40" cy="32" r="10" fill="#c9a227" opacity="0.85" stroke="#a88620" strokeWidth="1.2" />
      <text
        x="40"
        y="36"
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill="#1a2438"
        fontFamily="sans-serif"
      >
        T
      </text>
      <rect x="30" y="46" width="20" height="6" rx="1" fill="#e6eef8" stroke="#5a7a98" strokeWidth="0.7" />
      <circle className="sil-led ice" cx="40" cy="22" r="2" fill="#0a9cba" />
    </g>
  )
}

function PinballArt() {
  return (
    <g className="art-cache">
      <path
        className="sil-hull"
        d="M18 56 L14 40 Q12 28 28 16 L52 16 Q68 28 66 40 L62 56 Z"
        fill="url(#arc-hull-cache)"
        stroke="#5a7a98"
        strokeWidth="1.3"
      />
      <ellipse cx="40" cy="34" rx="14" ry="10" fill="#1a2438" opacity="0.15" />
      <circle cx="34" cy="30" r="2.5" fill="#0a9cba" />
      <circle cx="46" cy="36" r="2" fill="#d91872" />
      <circle cx="40" cy="28" r="1.5" fill="#c9a227" />
      <path d="M24 48 Q40 42 56 48" fill="none" stroke="#5a7a98" strokeWidth="1.5" />
      <circle className="sil-led amber" cx="40" cy="18" r="2" fill="#f24d9a" />
    </g>
  )
}

function LightGunArt() {
  return (
    <g className="art-quantum">
      <rect
        className="sil-hull"
        x="18"
        y="24"
        width="44"
        height="32"
        rx="3"
        fill="url(#arc-hull-quantum)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      <rect x="24" y="28" width="32" height="16" rx="1" fill="#1a2438" opacity="0.8" />
      <rect x="26" y="30" width="28" height="12" rx="0.8" fill="#0a9cba" opacity="0.5" />
      <circle className="sil-led core" cx="40" cy="36" r="3" fill="#d91872" />
      <path d="M30 50 H50" stroke="#5a7a98" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="50" r="3" fill="#7a94ae" stroke="#5a7a98" strokeWidth="0.8" />
      <rect x="48" y="46" width="10" height="8" rx="1" fill="url(#arc-steel-quantum)" stroke="#5a7a98" strokeWidth="0.8" />
    </g>
  )
}

function TournamentDeskArt() {
  return (
    <g className="art-scrub">
      <rect
        className="sil-hull"
        x="12"
        y="36"
        width="56"
        height="20"
        rx="3"
        fill="url(#arc-hull-scrub)"
        stroke="#5a7a98"
        strokeWidth="1.4"
      />
      <rect x="20" y="14" width="40" height="24" rx="2" fill="url(#arc-steel-scrub)" stroke="#5a7a98" strokeWidth="1.1" />
      <rect x="24" y="18" width="32" height="14" rx="1" fill="#1a2438" opacity="0.75" />
      {[28, 36, 44, 52].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={20 + (i % 2)}
          width="4"
          height={8 - (i % 3)}
          fill={i % 2 === 0 ? '#0a9cba' : '#d91872'}
          opacity="0.85"
        />
      ))}
      <circle className="sil-led ice" cx="30" cy="46" r="2" fill="#0a9cba" />
      <circle className="sil-led amber" cx="40" cy="46" r="2" fill="#d91872" />
      <circle className="sil-led ice" cx="50" cy="46" r="2" fill="#0a9cba" />
    </g>
  )
}
