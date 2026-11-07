/** Rich Tokenhalle arcade floor — neon marquee, carpet lanes, cabinets, ticket & prizes. Bright hall, not a void. */
export function ArcadeMapBackdrop() {
  return (
    <div className="map-terrain map-terrain-arcade" aria-hidden="true">
      <svg
        className="arcade-hall-svg"
        viewBox="0 0 400 520"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="ah-wall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#eef5fc" />
            <stop offset="45%" stopColor="#c5d8ec" />
            <stop offset="100%" stopColor="#8aa8c4" />
          </linearGradient>
          <linearGradient id="ah-floor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2f7fc" />
            <stop offset="40%" stopColor="#c8dae8" />
            <stop offset="100%" stopColor="#9eb6cc" />
          </linearGradient>
          <linearGradient id="ah-carpet" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a6a8a" />
            <stop offset="50%" stopColor="#0a4a68" />
            <stop offset="100%" stopColor="#8a1858" />
          </linearGradient>
          <linearGradient id="ah-neon-c" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5ecfe0" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#0a9cba" />
            <stop offset="100%" stopColor="#5ecfe0" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="ah-neon-m" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f24d9a" stopOpacity="0.15" />
            <stop offset="50%" stopColor="#d91872" />
            <stop offset="100%" stopColor="#f24d9a" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="ah-marquee" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fbfe" />
            <stop offset="40%" stopColor="#5ecfe0" />
            <stop offset="100%" stopColor="#0a7a96" />
          </linearGradient>
          <linearGradient id="ah-steel" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f8fc" />
            <stop offset="100%" stopColor="#6a849e" />
          </linearGradient>
          <linearGradient id="ah-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0e0a0" />
            <stop offset="100%" stopColor="#c9a227" />
          </linearGradient>
          <radialGradient id="ah-spot" cx="50%" cy="18%" r="42%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="45%" stopColor="#cfe8f4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#cfe8f4" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="ah-glow" cx="50%" cy="62%" r="50%">
            <stop offset="0%" stopColor="#0a9cba" stopOpacity="0.28" />
            <stop offset="55%" stopColor="#d91872" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0a9cba" stopOpacity="0" />
          </radialGradient>
          <pattern id="ah-carpet-pat" width="28" height="28" patternUnits="userSpaceOnUse">
            <rect width="28" height="28" fill="#0d5a78" />
            <path
              d="M0 14 L14 0 L28 14 L14 28 Z"
              fill="none"
              stroke="rgba(242,77,154,0.45)"
              strokeWidth="1.4"
            />
            <circle cx="14" cy="14" r="2.2" fill="rgba(94,207,224,0.55)" />
            <circle cx="0" cy="0" r="1.4" fill="rgba(201,162,39,0.5)" />
            <circle cx="28" cy="28" r="1.4" fill="rgba(201,162,39,0.5)" />
          </pattern>
          <pattern id="ah-tile" width="36" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M0 10 L18 0 L36 10 L18 20 Z"
              fill="none"
              stroke="rgba(70,100,130,0.22)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        {/* Hall walls + ceiling wash */}
        <rect width="400" height="520" fill="url(#ah-wall)" />
        <ellipse cx="200" cy="48" rx="180" ry="70" fill="url(#ah-spot)" />
        <ellipse cx="70" cy="70" rx="50" ry="22" fill="#ffffff" opacity="0.22" />
        <ellipse cx="330" cy="62" rx="44" ry="18" fill="#ffffff" opacity="0.18" />

        {/* Ceiling neon rails */}
        <g className="arcade-ceiling-neon">
          <path
            d="M20 86 H380"
            stroke="url(#ah-neon-c)"
            strokeWidth="3.5"
            className="arcade-neon-rail"
          />
          <path
            d="M40 108 H360"
            stroke="url(#ah-neon-m)"
            strokeWidth="2.4"
            className="arcade-neon-rail"
            opacity="0.85"
          />
          {[48, 112, 176, 240, 304, 352].map((x) => (
            <g key={x}>
              <rect
                x={x - 6}
                y="72"
                width="12"
                height="8"
                rx="1.5"
                fill="#d0deec"
                stroke="#5a7a98"
                strokeWidth="0.7"
              />
              <circle
                className="arcade-ceiling-bulb"
                cx={x}
                cy="86"
                r="3.2"
                fill={x % 112 < 60 ? '#5ecfe0' : '#f24d9a'}
              />
            </g>
          ))}
        </g>

        {/* Side wall posters / signage strips */}
        <g opacity="0.7">
          <rect x="6" y="130" width="18" height="56" rx="2" fill="#0a9cba" opacity="0.55" />
          <rect x="6" y="200" width="18" height="40" rx="2" fill="#d91872" opacity="0.5" />
          <rect x="6" y="255" width="18" height="48" rx="2" fill="#c9a227" opacity="0.45" />
          <rect x="376" y="140" width="18" height="50" rx="2" fill="#d91872" opacity="0.5" />
          <rect x="376" y="205" width="18" height="44" rx="2" fill="#0a9cba" opacity="0.55" />
          <rect x="376" y="265" width="18" height="52" rx="2" fill="#5ecfe0" opacity="0.4" />
        </g>

        {/* Isometric hall deck */}
        <path
          className="arcade-deck"
          d="M24 148 L200 86 L376 148 L376 468 L200 512 L24 468 Z"
          fill="url(#ah-floor)"
          stroke="#5a7a98"
          strokeWidth="2.5"
        />
        <path
          d="M24 148 L200 86 L376 148 L200 210 Z"
          fill="rgba(255,255,255,0.38)"
        />
        <path
          d="M24 148 L24 468 L200 512 L200 210 Z"
          fill="rgba(40,70,100,0.1)"
        />
        <path
          d="M376 148 L376 468 L200 512 L200 210 Z"
          fill="rgba(30,60,90,0.14)"
        />
        <path
          d="M38 166 L200 108 L362 166 L362 454 L200 496 L38 454 Z"
          fill="url(#ah-tile)"
          opacity="0.85"
        />

        {/* Patterned carpet lanes */}
        <g className="arcade-carpet">
          <path
            d="M70 240 L200 186 L330 240 L330 430 L200 476 L70 430 Z"
            fill="url(#ah-carpet-pat)"
            opacity="0.72"
            stroke="#0a4a68"
            strokeWidth="1.5"
          />
          <path
            d="M118 268 L200 232 L282 268 L282 400 L200 436 L118 400 Z"
            fill="none"
            stroke="rgba(94,207,224,0.55)"
            strokeWidth="2"
            strokeDasharray="6 5"
          />
          {/* Lane dividers */}
          <path
            d="M100 300 L200 258 L300 300"
            fill="none"
            stroke="rgba(242,77,154,0.55)"
            strokeWidth="2.2"
          />
          <path
            d="M110 360 L200 320 L290 360"
            fill="none"
            stroke="rgba(10,156,186,0.5)"
            strokeWidth="2"
          />
          <path
            d="M120 410 L200 374 L280 410"
            fill="none"
            stroke="rgba(201,162,39,0.45)"
            strokeWidth="1.8"
          />
        </g>

        {/* Marquee hero mass */}
        <g className="arcade-marquee">
          <ellipse cx="200" cy="168" rx="78" ry="14" fill="rgba(30,60,90,0.28)" />
          <path
            d="M130 168 L130 118 Q130 92 200 78 Q270 92 270 118 L270 168 Z"
            fill="url(#ah-marquee)"
            stroke="#0a7a96"
            strokeWidth="2"
          />
          <path
            d="M142 160 L142 122 Q142 102 200 90 Q258 102 258 122 L258 160 Z"
            fill="#0d1a28"
            opacity="0.55"
          />
          <path
            d="M150 148 H250"
            stroke="url(#ah-neon-m)"
            strokeWidth="3"
            className="arcade-neon-rail"
          />
          <path
            d="M158 132 H242"
            stroke="url(#ah-neon-c)"
            strokeWidth="2.4"
            className="arcade-neon-rail"
          />
          {[160, 180, 200, 220, 240].map((x, i) => (
            <circle
              key={x}
              className="arcade-marquee-bulb"
              cx={x}
              cy="112"
              r="3"
              fill={i % 2 === 0 ? '#f24d9a' : '#5ecfe0'}
            />
          ))}
          <rect
            x="168"
            y="138"
            width="64"
            height="14"
            rx="2"
            fill="#f8fbfe"
            opacity="0.85"
          />
          <path
            d="M176 145 H224"
            stroke="#d91872"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </g>

        {/* Ticket booth (left) */}
        <g className="arcade-ticket-booth">
          <ellipse cx="78" cy="390" rx="36" ry="10" fill="rgba(30,50,70,0.28)" />
          <rect
            x="48"
            y="318"
            width="60"
            height="72"
            rx="4"
            fill="url(#ah-steel)"
            stroke="#4a6a88"
            strokeWidth="1.6"
          />
          <rect x="54" y="328" width="48" height="22" rx="2" fill="#0d1a28" opacity="0.75" />
          <rect
            x="58"
            y="332"
            width="40"
            height="14"
            rx="1.2"
            fill="#0a9cba"
            opacity="0.7"
            className="arcade-screen-glow"
          />
          <path
            d="M50 318 H106"
            stroke="url(#ah-neon-c)"
            strokeWidth="2.4"
            className="arcade-neon-rail"
          />
          <rect x="58" y="358" width="40" height="10" rx="1.5" fill="#e8f0f8" stroke="#5a7a98" strokeWidth="0.8" />
          <circle cx="68" cy="363" r="2.2" fill="#d91872" className="arcade-ceiling-bulb" />
          <circle cx="88" cy="363" r="2.2" fill="#0a9cba" className="arcade-ceiling-bulb" />
          <rect x="62" y="378" width="32" height="6" rx="1" fill="#c9a227" opacity="0.7" />
          <path d="M54 390 H102" stroke="#5a7a98" strokeWidth="2" opacity="0.5" />
        </g>

        {/* Prize counter (right) */}
        <g className="arcade-prize-counter">
          <ellipse cx="322" cy="386" rx="42" ry="11" fill="rgba(30,50,70,0.26)" />
          <rect
            x="278"
            y="330"
            width="88"
            height="56"
            rx="4"
            fill="url(#ah-steel)"
            stroke="#4a6a88"
            strokeWidth="1.6"
          />
          <path
            d="M280 332 H364"
            stroke="url(#ah-neon-m)"
            strokeWidth="2.2"
            className="arcade-neon-rail"
          />
          {[288, 310, 332, 354].map((x, i) => (
            <rect
              key={x}
              x={x}
              y="340"
              width="14"
              height="18"
              rx="1.5"
              fill="#f8fbfe"
              stroke={i % 2 === 0 ? '#0a9cba' : '#d91872'}
              strokeWidth="1"
            />
          ))}
          <rect x="292" y="366" width="60" height="10" rx="1.5" fill="url(#ah-gold)" opacity="0.85" />
          <circle cx="304" cy="371" r="2" fill="#0a9cba" />
          <circle cx="322" cy="371" r="2" fill="#d91872" />
          <circle cx="340" cy="371" r="2" fill="#c9a227" />
        </g>

        {/* Ambient cabinet silhouettes along walls (depth, not interactive) */}
        <g className="arcade-ambient-cabs" opacity="0.42">
          <path
            d="M56 220 L52 198 Q52 188 68 184 Q84 188 84 198 L80 220 Z"
            fill="#b8cce0"
            stroke="#5a7a98"
            strokeWidth="1"
          />
          <rect x="58" y="192" width="20" height="10" rx="1" fill="#0a9cba" opacity="0.55" />
          <path
            d="M320 214 L316 192 Q316 182 332 178 Q348 182 348 192 L344 214 Z"
            fill="#b8cce0"
            stroke="#5a7a98"
            strokeWidth="1"
          />
          <rect x="322" y="186" width="20" height="10" rx="1" fill="#d91872" opacity="0.5" />
          <path
            d="M168 448 L164 430 Q164 422 180 418 Q196 422 196 430 L192 448 Z"
            fill="#a8c0d8"
            stroke="#5a7a98"
            strokeWidth="1"
          />
          <path
            d="M220 448 L216 430 Q216 422 232 418 Q248 422 248 430 L244 448 Z"
            fill="#a8c0d8"
            stroke="#5a7a98"
            strokeWidth="1"
          />
        </g>

        <ellipse cx="200" cy="340" rx="160" ry="110" fill="url(#ah-glow)" />

        {/* Coin / token glints */}
        <g className="arcade-coin-glints" opacity="0.75">
          <circle cx="96" cy="250" r="2.2" fill="#c9a227" />
          <circle cx="304" cy="268" r="1.8" fill="#5ecfe0" />
          <circle cx="148" cy="420" r="2" fill="#f24d9a" />
          <circle cx="260" cy="404" r="1.6" fill="#ffffff" />
          <circle cx="188" cy="290" r="1.7" fill="#e8c84a" />
          <circle cx="340" cy="340" r="1.5" fill="#0a9cba" />
          <circle cx="72" cy="350" r="1.6" fill="#ffffff" />
          <circle cx="220" cy="450" r="1.8" fill="#c9a227" />
        </g>
      </svg>

      <div className="map-neon-glow arcade-hall-glow" />
      <div className="map-haze arcade-hall-haze" />
      <div className="map-skin-wash" />
      <div className="map-dust map-token-spark" />
    </div>
  )
}
