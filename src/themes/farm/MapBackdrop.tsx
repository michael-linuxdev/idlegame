/** Rich rooftop vertical-farm yard — soft daylight, soil beds, glass, city hint. */
export function FarmMapBackdrop() {
  return (
    <div className="map-terrain map-terrain-farm" aria-hidden="true">
      <svg
        className="farm-yard-svg"
        viewBox="0 0 400 520"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <defs>
          <linearGradient id="fy-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9ecce8" />
            <stop offset="28%" stopColor="#c5e4f2" />
            <stop offset="55%" stopColor="#d5ebc8" />
            <stop offset="100%" stopColor="#8fbc78" />
          </linearGradient>
          <linearGradient id="fy-deck" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8efe4" />
            <stop offset="40%" stopColor="#c5d4be" />
            <stop offset="100%" stopColor="#9aaf90" />
          </linearGradient>
          <linearGradient id="fy-soil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a07848" />
            <stop offset="100%" stopColor="#4a3220" />
          </linearGradient>
          <linearGradient id="fy-glass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f2fcf6" stopOpacity="0.95" />
            <stop offset="55%" stopColor="#7ec9a0" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#3d8b5a" stopOpacity="0.65" />
          </linearGradient>
          <linearGradient id="fy-tower" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="40%" stopColor="#b8e0c8" />
            <stop offset="100%" stopColor="#3d8b4f" />
          </linearGradient>
          <linearGradient id="fy-city" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6a8498" />
            <stop offset="100%" stopColor="#3d5264" />
          </linearGradient>
          <radialGradient id="fy-sun" cx="84%" cy="10%" r="32%">
            <stop offset="0%" stopColor="#fff6d8" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffe08a" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffe08a" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="fy-glow" cx="50%" cy="68%" r="48%">
            <stop offset="0%" stopColor="#5ab86a" stopOpacity="0.42" />
            <stop offset="100%" stopColor="#5ab86a" stopOpacity="0" />
          </radialGradient>
          <pattern id="fy-tile" width="32" height="18" patternUnits="userSpaceOnUse">
            <path
              d="M0 9 L16 0 L32 9 L16 18 Z"
              fill="none"
              stroke="rgba(60,90,55,0.22)"
              strokeWidth="1"
            />
          </pattern>
        </defs>

        <rect width="400" height="520" fill="url(#fy-sky)" />
        <ellipse cx="338" cy="42" rx="100" ry="60" fill="url(#fy-sun)" />
        <ellipse cx="64" cy="64" rx="56" ry="24" fill="#ffffff" opacity="0.28" />
        <ellipse cx="128" cy="48" rx="40" ry="16" fill="#ffffff" opacity="0.2" />

        {/* City skyline — readable urban hint */}
        <g className="farm-skyline">
          <rect x="4" y="72" width="26" height="72" fill="url(#fy-city)" opacity="0.85" />
          <rect x="34" y="52" width="22" height="92" fill="#4a6578" opacity="0.9" />
          <rect x="60" y="84" width="32" height="60" fill="#5a7388" opacity="0.85" />
          <rect x="96" y="64" width="18" height="80" fill="#3d5568" opacity="0.9" />
          <rect x="118" y="90" width="28" height="54" fill="#657e92" opacity="0.8" />
          <rect x="268" y="80" width="24" height="64" fill="#5a7388" opacity="0.82" />
          <rect x="296" y="48" width="30" height="96" fill="#3d5568" opacity="0.92" />
          <rect x="330" y="68" width="20" height="76" fill="#4a6578" opacity="0.88" />
          <rect x="354" y="56" width="36" height="88" fill="#5a7388" opacity="0.86" />
          {/* windows */}
          {[
            [12, 84],
            [42, 66],
            [70, 96],
            [104, 78],
            [306, 62],
            [338, 80],
            [366, 70],
            [18, 108],
            [48, 100],
            [314, 96],
          ].map(([x, y], i) => (
            <rect
              key={i}
              x={x}
              y={y}
              width="5"
              height="5"
              rx="0.5"
              fill="#d8eef8"
              opacity="0.75"
            />
          ))}
        </g>
        <path d="M0 142 H400" stroke="#e8f4ea" strokeWidth="10" opacity="0.55" />

        {/* Rooftop concrete deck */}
        <path
          className="farm-deck"
          d="M24 148 L200 86 L376 148 L376 468 L200 512 L24 468 Z"
          fill="url(#fy-deck)"
          stroke="#6a8a60"
          strokeWidth="2.5"
        />
        <path
          d="M24 148 L200 86 L376 148 L200 210 Z"
          fill="rgba(255,255,255,0.35)"
        />
        <path
          d="M24 148 L24 468 L200 512 L200 210 Z"
          fill="rgba(50,80,45,0.12)"
        />
        <path
          d="M376 148 L376 468 L200 512 L200 210 Z"
          fill="rgba(40,70,40,0.14)"
        />
        <path
          d="M38 166 L200 108 L362 166 L362 454 L200 496 L38 454 Z"
          fill="url(#fy-tile)"
          opacity="0.9"
        />

        {/* Raised soil beds — high contrast */}
        <g className="farm-beds">
          <path
            d="M58 278 L148 242 L172 258 L82 294 Z"
            fill="url(#fy-soil)"
            stroke="#2e2014"
            strokeWidth="1.4"
          />
          <path d="M68 276 L146 246" stroke="#4fa862" strokeWidth="3" />
          <path d="M74 283 L152 253" stroke="#2d6a3a" strokeWidth="2.2" />
          <path d="M80 289 L156 260" stroke="#6bc47a" strokeWidth="2" />

          <path
            d="M236 246 L326 210 L350 226 L260 262 Z"
            fill="url(#fy-soil)"
            stroke="#2e2014"
            strokeWidth="1.4"
          />
          <path d="M246 244 L324 214" stroke="#4fa862" strokeWidth="3" />
          <path d="M252 251 L330 221" stroke="#2d6a3a" strokeWidth="2.2" />
          <path d="M258 257 L334 228" stroke="#8ec99a" strokeWidth="1.8" />

          <path
            d="M90 378 L188 340 L212 356 L114 394 Z"
            fill="url(#fy-soil)"
            stroke="#2e2014"
            strokeWidth="1.4"
          />
          <path d="M100 376 L186 344" stroke="#6bc47a" strokeWidth="2.6" />
          <path d="M108 384 L192 352" stroke="#3d8b4f" strokeWidth="2" />

          <path
            d="M220 358 L318 320 L342 336 L244 374 Z"
            fill="url(#fy-soil)"
            stroke="#2e2014"
            strokeWidth="1.4"
          />
          <path d="M230 356 L316 324" stroke="#4fa862" strokeWidth="2.6" />
          <path d="M238 364 L322 332" stroke="#2d6a3a" strokeWidth="2" />
        </g>

        {/* Glass greenhouse core — hero mass */}
        <g className="farm-glass-core">
          <ellipse cx="200" cy="214" rx="62" ry="16" fill="rgba(30,60,30,0.28)" />
          <path
            d="M148 214 L148 118 Q148 78 200 62 Q252 78 252 118 L252 214 Z"
            fill="url(#fy-tower)"
            stroke="#2d6a3a"
            strokeWidth="2"
          />
          <path
            d="M158 208 L158 124 Q158 92 200 78 Q242 92 242 124 L242 208 Z"
            fill="url(#fy-glass)"
          />
          {[136, 160, 184].map((y) => (
            <g key={y}>
              <ellipse
                cx="200"
                cy={y}
                rx="34"
                ry="7"
                fill="none"
                stroke="#2d6a3a"
                strokeWidth="1.2"
                opacity="0.65"
              />
              <path
                d={`M172 ${y} Q184 ${y - 12} 200 ${y - 3} Q216 ${y - 12} 228 ${y}`}
                fill="#3d8b4f"
                opacity="0.85"
              />
              <circle className="farm-led-dot" cx="178" cy={y - 2} r="2.2" fill="#e8a050" />
              <circle className="farm-led-dot" cx="222" cy={y - 2} r="2.2" fill="#7ec8ff" />
            </g>
          ))}
          <path
            d="M200 62 L200 214"
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.6"
          />
          <ellipse cx="200" cy="78" rx="22" ry="6" fill="#ffffff" opacity="0.45" />
        </g>

        {/* Irrigation paths */}
        <g opacity="0.45" stroke="#3d8b4f" strokeWidth="2" fill="none">
          <path d="M110 300 Q200 268 290 300" />
          <path d="M130 420 Q200 388 270 420" />
          <path d="M200 220 L200 478" strokeDasharray="5 7" opacity="0.7" />
        </g>

        <ellipse cx="200" cy="340" rx="150" ry="100" fill="url(#fy-glow)" />
        <g className="farm-pollen" opacity="0.7">
          <circle cx="86" cy="196" r="2" fill="#4fa862" />
          <circle cx="314" cy="236" r="1.6" fill="#e8a050" />
          <circle cx="148" cy="430" r="1.8" fill="#8ec99a" />
          <circle cx="266" cy="404" r="1.5" fill="#ffffff" />
          <circle cx="64" cy="348" r="1.7" fill="#4fa862" />
          <circle cx="344" cy="360" r="1.5" fill="#ffe8b0" />
        </g>
      </svg>

      <div className="map-grow-glow farm-yard-glow" />
      <div className="map-haze farm-yard-haze" />
      <div className="map-skin-wash" />
      <div className="map-dust map-pollen" />
    </div>
  )
}
