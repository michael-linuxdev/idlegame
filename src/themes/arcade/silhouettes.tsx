import type { SilhouetteKind } from '../../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
  producing?: boolean
  selected?: boolean
}

/** Premium arcade cabinets — cyan/magenta neon, pale hulls, readable at phone scale. */
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
        viewBox="0 0 96 84"
        width="84"
        height="74"
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
          cx="48"
          cy="76"
          rx="34"
          ry="7"
          fill={`url(#arc-pad-${kind})`}
        />
        <ellipse
          cx="48"
          cy="42"
          rx="30"
          ry="26"
          fill={`url(#arc-glow-${kind})`}
          opacity="0.4"
          className="sil-arcade-glow"
        />

        {kind === 'power' ? <ClassicCabinetArt id={kind} /> : null}
        {kind === 'cool' ? <TicketPrinterArt id={kind} /> : null}
        {kind === 'rack' ? <RacingCabArt id={kind} /> : null}
        {kind === 'uplink' ? <ClawMachineArt id={kind} /> : null}
        {kind === 'relay' ? <DancePadArt id={kind} /> : null}
        {kind === 'switch' ? <PrizeWallArt id={kind} /> : null}
        {kind === 'battery' ? <TokenChangerArt id={kind} /> : null}
        {kind === 'cache' ? <PinballArt id={kind} /> : null}
        {kind === 'quantum' ? <LightGunArt id={kind} /> : null}
        {kind === 'scrub' ? <TournamentDeskArt id={kind} /> : null}
      </svg>
      {producing ? <span className="sil-particles sil-arcade-tokens" /> : null}
    </div>
  )
}

function ClassicCabinetArt({ id }: { id: string }) {
  return (
    <g className="art-power">
      <path
        className="sil-hull"
        d="M22 70 L18 28 Q18 12 48 8 Q78 12 78 28 L74 70 Z"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M24 28 Q24 14 48 11 Q72 14 72 28"
        fill="none"
        stroke={`url(#arc-neon-m-${id})`}
        strokeWidth="2.6"
        className="sil-neon-tube"
      />
      <rect x="28" y="20" width="40" height="26" rx="2.5" fill="#0d1a28" opacity="0.92" />
      <rect
        x="30"
        y="22"
        width="36"
        height="22"
        rx="1.5"
        fill={`url(#arc-screen-${id})`}
        className="sil-screen"
      />
      <path d="M36 28 H60 M40 34 H56 M38 40 H58" stroke="#5ecfe0" strokeWidth="1" opacity="0.55" />
      <circle className="sil-led core" cx="48" cy="34" r="4" fill="#d91872" />
      <rect x="30" y="50" width="36" height="10" rx="2" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.9" />
      <circle className="sil-led amber" cx="38" cy="55" r="2.4" fill="#d91872" />
      <circle cx="48" cy="55" r="3.6" fill="#c2d2e4" stroke="#4a6a88" strokeWidth="1" />
      <circle className="sil-led ice" cx="58" cy="55" r="2.4" fill="#0a9cba" />
      <rect x="26" y="64" width="44" height="5.5" rx="1.4" fill="#7a94ae" stroke="#4a6a88" strokeWidth="0.8" />
      <rect x="42" y="65.5" width="12" height="2.4" rx="0.7" fill="#c9a227" opacity="0.9" />
    </g>
  )
}

function TicketPrinterArt({ id }: { id: string }) {
  return (
    <g className="art-cool">
      <rect
        className="sil-hull"
        x="16"
        y="30"
        width="64"
        height="38"
        rx="5"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M20 34 H76"
        stroke={`url(#arc-neon-c-${id})`}
        strokeWidth="2.4"
        className="sil-neon-tube"
      />
      <rect x="24" y="38" width="48" height="16" rx="2" fill="#f8fbfe" stroke="#d91872" strokeWidth="1.2" />
      <path d="M28 46 H68" stroke="#d91872" strokeWidth="1.6" strokeDasharray="5 3" />
      <path d="M28 50 H58" stroke="#f24d9a" strokeWidth="1.1" strokeDasharray="3.5 2.5" opacity="0.75" />
      <rect
        x="36"
        y="10"
        width="24"
        height="22"
        rx="3"
        fill={`url(#arc-steel-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.2"
      />
      <circle className="sil-led ice" cx="48" cy="20" r="3.4" fill="#0a9cba" />
      <rect x="32" y="58" width="32" height="6" rx="1.2" fill="#f24d9a" opacity="0.8" />
      <path d="M34 64 L40 72 H56 L62 64" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.8" />
    </g>
  )
}

function RacingCabArt({ id }: { id: string }) {
  return (
    <g className="art-rack">
      <rect
        className="sil-hull"
        x="12"
        y="34"
        width="72"
        height="34"
        rx="5"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M20 34 L28 12 H68 L76 34"
        fill="#c8d8e8"
        stroke="#4a6a88"
        strokeWidth="1.3"
      />
      <path
        d="M22 34 H74"
        stroke={`url(#arc-neon-m-${id})`}
        strokeWidth="2.4"
        className="sil-neon-tube"
      />
      <rect x="30" y="14" width="36" height="16" rx="2" fill="#0d1a28" opacity="0.9" />
      <rect
        x="32"
        y="16"
        width="32"
        height="12"
        rx="1"
        fill={`url(#arc-screen-${id})`}
        className="sil-screen"
      />
      <path d="M38 22 H58" stroke="#5ecfe0" strokeWidth="1.1" opacity="0.65" />
      <ellipse cx="30" cy="50" rx="8" ry="6.5" fill="#2a3548" stroke="#4a6a88" strokeWidth="1" />
      <ellipse cx="66" cy="50" rx="8" ry="6.5" fill="#2a3548" stroke="#4a6a88" strokeWidth="1" />
      <circle className="sil-led amber" cx="30" cy="50" r="3" fill="#d91872" />
      <circle className="sil-led ice" cx="66" cy="50" r="3" fill="#0a9cba" />
      <rect x="42" y="54" width="12" height="6" rx="1.2" fill="#7a94ae" />
      <path d="M18 66 H78" stroke="#5a7a98" strokeWidth="1.4" opacity="0.5" />
    </g>
  )
}

function ClawMachineArt({ id }: { id: string }) {
  return (
    <g className="art-uplink">
      <rect
        className="sil-hull"
        x="18"
        y="8"
        width="60"
        height="60"
        rx="4"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M22 12 H74"
        stroke={`url(#arc-neon-c-${id})`}
        strokeWidth="2.6"
        className="sil-neon-tube"
      />
      <rect x="24" y="16" width="48" height="36" rx="2" fill="#cfe0f0" stroke="#0a9cba" strokeWidth="1.1" />
      <rect x="26" y="18" width="44" height="32" rx="1.2" fill="#a8c4d8" opacity="0.35" className="sil-screen" />
      <path d="M48 18 V42" stroke="#5a7a98" strokeWidth="1.5" />
      <circle cx="48" cy="18" r="2.2" fill="#4a6a88" />
      <path
        d="M38 42 L48 52 L58 42"
        fill="none"
        stroke="#d91872"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="4.2" fill="#f24d9a" opacity="0.85" />
      <circle cx="64" cy="38" r="3.4" fill="#0a9cba" opacity="0.85" />
      <circle cx="54" cy="26" r="2.6" fill="#c9a227" opacity="0.9" />
      <circle cx="36" cy="40" r="2.4" fill="#5ecfe0" opacity="0.75" />
      <rect x="24" y="56" width="48" height="8" rx="1.5" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.85" />
      <circle className="sil-led ice" cx="36" cy="60" r="2" fill="#0a9cba" />
      <circle className="sil-led amber" cx="60" cy="60" r="2" fill="#d91872" />
    </g>
  )
}

function DancePadArt({ id }: { id: string }) {
  return (
    <g className="art-relay">
      <rect
        className="sil-hull"
        x="10"
        y="40"
        width="76"
        height="28"
        rx="4"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <rect x="18" y="46" width="16" height="16" rx="2" fill="#d91872" opacity="0.85" />
      <rect x="40" y="46" width="16" height="16" rx="2" fill="#0a9cba" opacity="0.85" />
      <rect x="62" y="46" width="16" height="16" rx="2" fill="#d91872" opacity="0.65" />
      <path d="M22 50 L30 58 M30 50 L22 58" stroke="#f8fbfe" strokeWidth="1.5" opacity="0.9" />
      <path d="M48 48 V62 M42 55 H54" stroke="#f8fbfe" strokeWidth="1.5" opacity="0.9" />
      <path d="M66 50 L74 58 M74 50 L66 58" stroke="#f8fbfe" strokeWidth="1.5" opacity="0.75" />
      <rect
        x="30"
        y="8"
        width="36"
        height="32"
        rx="3"
        fill={`url(#arc-steel-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.3"
      />
      <rect x="36" y="14" width="24" height="16" rx="1.5" fill="#0d1a28" opacity="0.88" />
      <rect
        x="38"
        y="16"
        width="20"
        height="12"
        rx="1"
        fill={`url(#arc-screen-${id})`}
        className="sil-screen"
      />
      <circle className="sil-led amber" cx="48" cy="22" r="2.6" fill="#f24d9a" />
      <path
        d="M32 38 H64"
        stroke={`url(#arc-neon-m-${id})`}
        strokeWidth="2.2"
        className="sil-neon-tube"
      />
      <rect x="22" y="66" width="52" height="5" rx="1.2" fill="#7a94ae" stroke="#4a6a88" strokeWidth="0.75" />
    </g>
  )
}

function PrizeWallArt({ id }: { id: string }) {
  return (
    <g className="art-switch">
      <rect
        className="sil-hull"
        x="8"
        y="18"
        width="80"
        height="50"
        rx="4"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M12 22 H84"
        stroke={`url(#arc-neon-c-${id})`}
        strokeWidth="2.4"
        className="sil-neon-tube"
      />
      {[24, 40, 56].map((y, row) => (
        <g key={y}>
          <rect
            x="14"
            y={y}
            width="16"
            height="12"
            rx="1.5"
            fill="#f8fbfe"
            stroke={row % 2 === 0 ? '#0a9cba' : '#d91872'}
            strokeWidth="1"
          />
          <rect
            x="36"
            y={y}
            width="16"
            height="12"
            rx="1.5"
            fill="#f8fbfe"
            stroke={row % 2 === 0 ? '#d91872' : '#c9a227'}
            strokeWidth="1"
          />
          <rect
            x="58"
            y={y}
            width="16"
            height="12"
            rx="1.5"
            fill="#f8fbfe"
            stroke={row % 2 === 0 ? '#c9a227' : '#0a9cba'}
            strokeWidth="1"
          />
          <rect x="78" y={y} width="6" height="12" rx="1" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.7" />
          <circle cx="22" cy={y + 6} r="1.8" fill={row === 1 ? '#d91872' : '#0a9cba'} opacity="0.75" />
          <circle cx="44" cy={y + 6} r="1.8" fill="#c9a227" opacity="0.8" />
        </g>
      ))}
      <rect x="28" y="6" width="40" height="12" rx="2" fill="#0a9cba" opacity="0.92" />
      <circle className="sil-led core" cx="48" cy="12" r="3" fill="#f8fbfe" />
      <path d="M34 12 H42 M54 12 H62" stroke="#5ecfe0" strokeWidth="1.4" opacity="0.85" />
    </g>
  )
}

function TokenChangerArt({ id }: { id: string }) {
  return (
    <g className="art-battery">
      <rect
        className="sil-hull"
        x="24"
        y="10"
        width="48"
        height="58"
        rx="6"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.7"
      />
      <path
        d="M28 16 H68"
        stroke={`url(#arc-neon-m-${id})`}
        strokeWidth="2.4"
        className="sil-neon-tube"
      />
      <circle cx="48" cy="40" r="15" fill="#e8c84a" opacity="0.94" stroke="#a88620" strokeWidth="1.6" />
      <circle cx="48" cy="40" r="10.5" fill="#c9a227" opacity="0.55" />
      <text
        x="48"
        y="45.5"
        textAnchor="middle"
        fontSize="14"
        fontWeight="700"
        fill="#1a2438"
        fontFamily="sans-serif"
      >
        T
      </text>
      <rect x="32" y="18" width="32" height="8" rx="1.2" fill="#0d1a28" opacity="0.78" />
      <rect
        x="34"
        y="20"
        width="28"
        height="4"
        rx="0.8"
        fill="#0a9cba"
        opacity="0.7"
        className="sil-screen"
      />
      <rect x="32" y="58" width="32" height="6" rx="1.2" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.8" />
      <circle className="sil-led ice" cx="48" cy="24" r="2.2" fill="#0a9cba" />
      <rect x="38" y="66" width="20" height="4" rx="1" fill="#7a94ae" />
    </g>
  )
}

function PinballArt({ id }: { id: string }) {
  return (
    <g className="art-cache">
      <path
        className="sil-hull"
        d="M16 70 L10 46 Q8 28 30 10 L66 10 Q88 28 86 46 L80 70 Z"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.5"
      />
      <path
        d="M24 16 Q48 8 72 16"
        fill="none"
        stroke={`url(#arc-neon-c-${id})`}
        strokeWidth="2.4"
        className="sil-neon-tube"
      />
      <ellipse cx="48" cy="40" rx="20" ry="14" fill="#0d1a28" opacity="0.22" />
      <ellipse cx="48" cy="40" rx="17" ry="12" fill="#1a3040" opacity="0.4" className="sil-screen" />
      <circle cx="36" cy="32" r="3.4" fill="#0a9cba" className="sil-led ice" />
      <circle cx="60" cy="44" r="2.8" fill="#d91872" className="sil-led amber" />
      <circle cx="48" cy="26" r="2.2" fill="#c9a227" />
      <circle cx="42" cy="48" r="1.8" fill="#5ecfe0" />
      <path d="M22 58 Q48 48 74 58" fill="none" stroke="#5a7a98" strokeWidth="2" />
      <path d="M26 64 Q48 56 70 64" fill="none" stroke="#4a6a88" strokeWidth="1.4" opacity="0.65" />
      <circle className="sil-led amber" cx="48" cy="16" r="2.6" fill="#f24d9a" />
      <rect x="34" y="68" width="28" height="4" rx="1.2" fill="#7a94ae" />
    </g>
  )
}

function LightGunArt({ id }: { id: string }) {
  return (
    <g className="art-quantum">
      <rect
        className="sil-hull"
        x="14"
        y="22"
        width="68"
        height="44"
        rx="4"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M18 28 H78"
        stroke={`url(#arc-neon-m-${id})`}
        strokeWidth="2.4"
        className="sil-neon-tube"
      />
      <rect x="22" y="30" width="52" height="24" rx="2" fill="#0d1a28" opacity="0.92" />
      <rect
        x="24"
        y="32"
        width="48"
        height="20"
        rx="1.2"
        fill={`url(#arc-screen-${id})`}
        className="sil-screen"
      />
      <circle className="sil-led core" cx="48" cy="42" r="4.2" fill="#d91872" />
      <path d="M30 36 H42 M54 36 H66" stroke="#5ecfe0" strokeWidth="1" opacity="0.55" />
      <path d="M28 62 H68" stroke="#5a7a98" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="26" cy="62" r="4.2" fill="#7a94ae" stroke="#4a6a88" strokeWidth="0.9" />
      <rect
        x="62"
        y="54"
        width="16"
        height="14"
        rx="2"
        fill={`url(#arc-steel-${id})`}
        stroke="#4a6a88"
        strokeWidth="0.9"
      />
      <circle className="sil-led ice" cx="70" cy="61" r="2" fill="#0a9cba" />
      <rect x="32" y="10" width="32" height="12" rx="2" fill="#c2d2e4" stroke="#5a7a98" strokeWidth="0.9" />
    </g>
  )
}

function TournamentDeskArt({ id }: { id: string }) {
  return (
    <g className="art-scrub">
      <rect
        className="sil-hull"
        x="8"
        y="40"
        width="80"
        height="28"
        rx="4"
        fill={`url(#arc-hull-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.6"
      />
      <path
        d="M12 44 H84"
        stroke={`url(#arc-neon-c-${id})`}
        strokeWidth="2.2"
        className="sil-neon-tube"
      />
      <rect
        x="16"
        y="8"
        width="64"
        height="34"
        rx="3"
        fill={`url(#arc-steel-${id})`}
        stroke="#4a6a88"
        strokeWidth="1.3"
      />
      <rect x="22" y="14" width="52" height="22" rx="1.5" fill="#0d1a28" opacity="0.88" />
      {[28, 40, 52, 64].map((x, i) => (
        <rect
          key={x}
          x={x}
          y={16 + (i % 2)}
          width="7"
          height={14 - (i % 3)}
          rx="0.8"
          fill={i % 2 === 0 ? '#0a9cba' : '#d91872'}
          opacity="0.92"
          className="sil-led"
        />
      ))}
      <circle className="sil-led ice" cx="28" cy="54" r="2.6" fill="#0a9cba" />
      <circle className="sil-led amber" cx="48" cy="54" r="2.6" fill="#d91872" />
      <circle className="sil-led ice" cx="68" cy="54" r="2.6" fill="#0a9cba" />
      <rect x="26" y="60" width="44" height="4" rx="1" fill="#c9a227" opacity="0.6" />
    </g>
  )
}
