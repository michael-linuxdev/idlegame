/**
 * Small inline garden icons for the HUD (no emoji — consistent on every OS).
 * 24×24 viewBox, sized via CSS (1em by default).
 */
import type { ReactNode } from 'react'

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <svg
      className={`g-icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  )
}

/** Ernte — basket with produce */
export function IconBasket() {
  return (
    <Svg>
      <circle cx="8" cy="10" r="3" fill="#e0485e" />
      <circle cx="12.5" cy="8.6" r="3" fill="#7fbf5a" />
      <circle cx="16.5" cy="10.4" r="2.8" fill="#f08a2c" />
      <path d="M3 11h18l-2.2 9H5.2z" fill="#c9a46b" stroke="#6e4a2b" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 14h12M7 17h10" stroke="#8a6a40" strokeWidth="1" />
    </Svg>
  )
}

/** Samen — seed packet */
export function IconSeeds() {
  return (
    <Svg>
      <path d="M6 3h12l-1 18H7z" fill="#f4ead2" stroke="#8a7350" strokeWidth="1.2" strokeLinejoin="round" />
      <rect x="8.5" y="8" width="7" height="6" rx="1" fill="#7fbf5a" />
      <circle cx="12" cy="11" r="1.6" fill="#f5c542" />
      <path d="M6 6h12" stroke="#8a7350" strokeWidth="1" />
    </Svg>
  )
}

/** Erbstücke — Omas Truhe */
export function IconChest() {
  return (
    <Svg>
      <path d="M3 10a9 5 0 0 1 18 0v2H3z" fill="#a8693a" stroke="#5e3b25" strokeWidth="1.2" />
      <rect x="3" y="11" width="18" height="9" rx="1.4" fill="#c4823f" stroke="#5e3b25" strokeWidth="1.2" />
      <rect x="10.4" y="10" width="3.2" height="5" rx="0.8" fill="#f2c94c" stroke="#8a6a1e" strokeWidth="0.9" />
      <path d="M3 15h18" stroke="#5e3b25" strokeWidth="1" />
    </Svg>
  )
}

export function IconWateringCan() {
  return (
    <Svg>
      <path d="M5 9h10v10H5z" fill="#6aa6c9" stroke="#2e5d78" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M15 12l5-5 1.4 1.4" fill="none" stroke="#2e5d78" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M7 9a3 3 0 0 1 6 0" fill="none" stroke="#2e5d78" strokeWidth="1.3" />
      <path d="M21.5 9.5l.8 1.6M22.4 7.6l1.2.4" stroke="#6aa6c9" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  )
}

export function IconSun() {
  return (
    <Svg>
      <circle cx="12" cy="12" r="4.6" fill="#f5c542" stroke="#c9961e" strokeWidth="1" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path
          key={a}
          d="M12 2.6v2.6"
          stroke="#f0a530"
          strokeWidth="1.8"
          strokeLinecap="round"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
    </Svg>
  )
}

/** Erntefest — bunting flags */
export function IconFestival() {
  return (
    <Svg>
      <path d="M2 5q10 6 20 0" fill="none" stroke="#6e4a2b" strokeWidth="1.2" />
      <path d="M4 6.2l2 5 2-4z" fill="#e0485e" />
      <path d="M9 7.6l2 5 2-5z" fill="#f5c542" />
      <path d="M14.4 7.4l2 5 1.6-5.6z" fill="#7fbf5a" />
      <path d="M19 6.4l1.4 4.6 1.4-5.6z" fill="#6aa6c9" />
      <circle cx="9" cy="18" r="2.4" fill="#f08a2c" />
      <circle cx="14.5" cy="18.6" r="2" fill="#e0485e" />
    </Svg>
  )
}

/** Saisonende — snowflake */
export function IconSnow() {
  return (
    <Svg>
      {[0, 60, 120].map((a) => (
        <g key={a} transform={`rotate(${a} 12 12)`}>
          <path d="M12 3v18" stroke="#5b8fb8" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M9.5 5.5L12 8l2.5-2.5M9.5 18.5L12 16l2.5 2.5" fill="none" stroke="#5b8fb8" strokeWidth="1.4" strokeLinecap="round" />
        </g>
      ))}
    </Svg>
  )
}

export function IconFlag() {
  return (
    <Svg>
      <path d="M6 3v18" stroke="#6e4a2b" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M7 4h11l-3 4 3 4H7z" fill="#5f9e45" stroke="#3f7a30" strokeWidth="1" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconFertilizer() {
  return (
    <Svg>
      <path d="M6 6h12l-1.2 14H7.2z" fill="#8a6a40" stroke="#5e3b25" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M6 6l2-3h8l2 3" fill="#a8835a" stroke="#5e3b25" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M12 10c-3 2-3 5 0 7 3-2 3-5 0-7z" fill="#7fbf5a" />
    </Svg>
  )
}

/** Omas Notizbuch */
export function IconNotebook() {
  return (
    <Svg>
      <rect x="5" y="3" width="14" height="18" rx="1.6" fill="#7d9f5a" stroke="#3f5a2c" strokeWidth="1.2" />
      <rect x="7.5" y="5.5" width="9" height="5" rx="0.8" fill="#f4ead2" />
      <path d="M5 7H3.6M5 11H3.6M5 15H3.6M5 19H3.6" stroke="#3f5a2c" strokeWidth="1.2" strokeLinecap="round" />
    </Svg>
  )
}

export function IconSprout() {
  return (
    <Svg>
      <path d="M12 21v-9" stroke="#3f7a30" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 13C8 13 5 10.5 5 6.5 9 6.5 12 9 12 13z" fill="#7fbf5a" stroke="#3f7a30" strokeWidth="1" />
      <path d="M12 11c0-4 3-6.5 7-6.5 0 4-3 6.5-7 6.5z" fill="#5f9e45" stroke="#3f7a30" strokeWidth="1" />
    </Svg>
  )
}

export function IconRain() {
  return (
    <Svg>
      <path d="M7 14a4 4 0 0 1 .5-8 5 5 0 0 1 9.6 1.4A3.3 3.3 0 0 1 17 14z" fill="#e6eef6" stroke="#6f86ad" strokeWidth="1.2" />
      <path d="M8 17l-1 3M12 17l-1 3M16 17l-1 3" stroke="#3d8db8" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconWind() {
  return (
    <Svg>
      <path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7" fill="none" stroke="#6f86ad" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  )
}

export function IconCloud() {
  return (
    <Svg>
      <circle cx="17" cy="7" r="3.4" fill="#f5c542" />
      <path d="M6 18a4 4 0 0 1 .5-8 5 5 0 0 1 9.6 1.4A3.3 3.3 0 0 1 16 18z" fill="#f4f6f9" stroke="#8a9bb8" strokeWidth="1.2" />
    </Svg>
  )
}

export function IconCrate() {
  return (
    <Svg>
      <circle cx="8" cy="8" r="2.6" fill="#e0485e" />
      <circle cx="12.5" cy="7" r="2.6" fill="#f08a2c" />
      <circle cx="16.5" cy="8.4" r="2.4" fill="#7fbf5a" />
      <rect x="3" y="10" width="18" height="10" rx="1.4" fill="#c4823f" stroke="#5e3b25" strokeWidth="1.2" />
      <path d="M3 15h18M8 10v10M16 10v10" stroke="#8a5a32" strokeWidth="1" />
    </Svg>
  )
}

export function IconWheel() {
  const cols = ['#e0485e', '#f5c542', '#7fbf5a', '#6aa6c9', '#f08a2c', '#c76bd9']
  return (
    <Svg>
      {cols.map((c, i) => {
        const a0 = (i / 6) * Math.PI * 2
        const a1 = ((i + 1) / 6) * Math.PI * 2
        return (
          <path
            key={i}
            d={`M12 12 L${12 + 9 * Math.cos(a0)} ${12 + 9 * Math.sin(a0)} A9 9 0 0 1 ${12 + 9 * Math.cos(a1)} ${12 + 9 * Math.sin(a1)} Z`}
            fill={c}
          />
        )
      })}
      <circle cx="12" cy="12" r="9" fill="none" stroke="#5e3b25" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="2" fill="#fdf8ec" stroke="#5e3b25" strokeWidth="1" />
    </Svg>
  )
}
