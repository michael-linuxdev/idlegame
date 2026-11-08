/** Saison panel hero — Omas Laube asleep under snow, windows lit. */
export function WinterScene() {
  return (
    <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" focusable="false">
      <defs>
        <linearGradient id="ws-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3f5683" />
          <stop offset="100%" stopColor="#9fb4d0" />
        </linearGradient>
        <radialGradient id="ws-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd36b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffd36b" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="120" fill="url(#ws-sky)" />
      <circle cx="262" cy="26" r="11" fill="#fdf6dc" />
      <circle cx="267" cy="22" r="10" fill="#4a6190" />
      {[
        [30, 18],
        [70, 30],
        [120, 12],
        [200, 22],
        [300, 40],
        [160, 34],
      ].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.2" fill="#fff" opacity="0.8" />
      ))}
      {/* snowy hills */}
      <path d="M0 86 Q80 70 160 84 T320 80 V120 H0 Z" fill="#e9f0f6" />
      <path d="M0 98 Q90 88 180 98 T320 94 V120 H0 Z" fill="#ffffff" />
      {/* trees */}
      {[
        [34, 84, 1],
        [280, 82, 0.9],
        [300, 90, 0.7],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-2" y="-6" width="4" height="10" fill="#6b4a2e" />
          <path d="M0 -40 L14 -10 L-14 -10 Z" fill="#3f6b45" />
          <path d="M0 -40 L7 -26 L-7 -26 Z" fill="#fff" />
          <path d="M-14 -10 L14 -10 L10 -14 L-10 -14 Z" fill="#fff" opacity="0.9" />
        </g>
      ))}
      {/* Laube */}
      <ellipse cx="160" cy="98" rx="70" ry="22" fill="url(#ws-glow)" opacity="0.5" />
      <rect x="128" y="62" width="64" height="32" fill="#c99566" stroke="#5e3b25" strokeWidth="1.6" />
      <path d="M118 64 L160 38 L202 64 Z" fill="#a8432f" stroke="#5e2a20" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M118 64 L160 38 L202 64 L196 66 Q160 46 124 66 Z" fill="#ffffff" />
      <rect x="152" y="72" width="14" height="22" fill="#5f7f45" stroke="#3f5a2c" strokeWidth="1.2" />
      <rect x="134" y="70" width="12" height="10" fill="#ffd36b" stroke="#fff" strokeWidth="1.6" />
      <rect x="174" y="70" width="12" height="10" fill="#ffd36b" stroke="#fff" strokeWidth="1.6" />
      <rect x="178" y="40" width="6" height="12" fill="#8a5a3b" />
      <path d="M181 38 q-4 -6 0 -10 q4 -5 0 -10" stroke="#e9f0f6" strokeWidth="2" fill="none" opacity="0.7" />
      {/* fence */}
      {Array.from({ length: 14 }, (_, i) => (
        <g key={i}>
          <rect x={6 + i * 9} y="92" width="3" height="14" fill="#e3d6bb" />
          <rect x={6 + i * 9} y="91" width="3" height="2" fill="#fff" />
        </g>
      ))}
      <rect x="4" y="97" width="128" height="2" fill="#cdb98f" />
    </svg>
  )
}
