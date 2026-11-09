/**
 * Small inline garden icons for the HUD (no emoji — consistent on every OS).
 * 24×24 viewBox, sized via CSS (1em by default).
 */
import type { ReactNode } from 'react'
import { ArtSvg } from './ArtSvg'

function Svg({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <ArtSvg
      className={`g-icon${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
    >
      {children}
    </ArtSvg>
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

/** Obst — apple with leaf (Streuobstwiese currency) */
export function IconApple() {
  return (
    <Svg>
      <path d="M12 7.5c-1.6-1.4-6-1.6-6.8 2.6-.8 4.2 2 9.4 4.4 9.4 1.1 0 1.5-.6 2.4-.6s1.3.6 2.4.6c2.4 0 5.2-5.2 4.4-9.4C18 5.9 13.6 6.1 12 7.5z" fill="#d9483b" stroke="#8a2a20" strokeWidth="1" />
      <path d="M12 7.6V4.4" stroke="#6e4a2b" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.3 5.2c1.2-1.8 3.3-1.9 4.3-1.3-.6 1.5-2.4 2.3-4.3 1.3z" fill="#5f9e45" />
      <ellipse cx="9" cy="10.6" rx="1.1" ry="1.8" fill="#fff" opacity="0.35" />
    </Svg>
  )
}

/** Gartenhelfer — straw hat over a friendly face */
export function IconHelper() {
  return (
    <Svg>
      <circle cx="12" cy="13.5" r="5" fill="#f2c9a0" stroke="#8a6a40" strokeWidth="1" />
      <ellipse cx="12" cy="9.6" rx="8.5" ry="2.2" fill="#e8c770" stroke="#8a6a40" strokeWidth="1" />
      <path d="M8 9.4c.4-3 1.8-4.4 4-4.4s3.6 1.4 4 4.4z" fill="#f0d488" stroke="#8a6a40" strokeWidth="1" />
      <path d="M8.2 8.6h7.6" stroke="#c4553f" strokeWidth="1.2" />
      <circle cx="10.2" cy="13.6" r=".8" fill="#4a3208" />
      <circle cx="13.8" cy="13.6" r=".8" fill="#4a3208" />
      <path d="M10.4 15.8c1 .8 2.2.8 3.2 0" stroke="#4a3208" strokeWidth=".9" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

/** Generationen — family tree */
export function IconFamily() {
  return (
    <Svg>
      <path d="M12 21v-7M12 14l-4-3M12 14l4-3" stroke="#6e4a2b" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="12" cy="8" r="5.5" fill="#5f9e45" />
      <circle cx="7" cy="11" r="3.2" fill="#7fbf5a" />
      <circle cx="17" cy="11" r="3.2" fill="#7fbf5a" />
      <path d="M12 6.2c.8-1.4 3-1 2.7.9-.2 1.2-2.7 2.6-2.7 2.6s-2.5-1.4-2.7-2.6c-.3-1.9 1.9-2.3 2.7-.9z" fill="#e0485e" />
    </Svg>
  )
}

/** Festmarke — themed token per fest */
export function IconFestToken({ fest }: { fest: string }) {
  switch (fest) {
    case 'laternenfest':
      return (
        <Svg>
          <path d="M12 2v3" stroke="#6e4a2b" strokeWidth="1.2" />
          <ellipse cx="12" cy="13" rx="6.5" ry="7.5" fill="#f5a83a" stroke="#b8862a" strokeWidth="1" />
          <ellipse cx="12" cy="13" rx="3.4" ry="7.5" fill="none" stroke="#e07a1f" strokeWidth="1" />
          <ellipse cx="12" cy="13" rx="3" ry="3.6" fill="#fff3b0" opacity="0.8" />
          <rect x="9" y="4.5" width="6" height="1.8" rx=".6" fill="#6e4a2b" />
        </Svg>
      )
    case 'fruehlingsfest':
      return (
        <Svg>
          <ellipse cx="12" cy="13" rx="6.5" ry="8.5" fill="#f28ab2" stroke="#b44f7a" strokeWidth="1" />
          <path d="M5.8 11.5l2.2-1.5 2 1.5 2-1.5 2 1.5 2-1.5 2.2 1.5" stroke="#fff" strokeWidth="1.3" fill="none" />
          <circle cx="9" cy="16" r="1" fill="#f5c542" />
          <circle cx="15" cy="16" r="1" fill="#7fbf5a" />
        </Svg>
      )
    case 'sommerfest':
      return (
        <Svg>
          <path d="M12 21c-5-2-7-7-6-10 1-3 4-3 6-2 2-1 5-1 6 2 1 3-1 8-6 10z" fill="#e2453c" stroke="#9a2a24" strokeWidth="1" />
          <path d="M8 6.5l4 2.5 4-2.5-2 -1.5-2 1-2-1z" fill="#5f9e45" />
          {[9, 12, 15, 10.5, 13.5].map((x, i) => (
            <circle key={i} cx={x} cy={12 + (i > 2 ? 3 : 0)} r=".6" fill="#ffe08a" />
          ))}
        </Svg>
      )
    case 'erntedank':
      return (
        <Svg>
          <ellipse cx="12" cy="14" rx="8.5" ry="6.5" fill="#f08a2c" stroke="#a5531a" strokeWidth="1" />
          <path d="M9 8.5c-1.5 3-1.5 8 0 11M15 8.5c1.5 3 1.5 8 0 11M12 8v12" stroke="#c4651f" strokeWidth="1" fill="none" />
          <path d="M12 8c0-2 1-3.5 2.5-4" stroke="#5f7a2e" strokeWidth="1.6" strokeLinecap="round" />
        </Svg>
      )
    case 'advent':
      return (
        <Svg>
          <path d="M12 2.5l2.4 4.6 5.1.4-3.9 3.4 1.3 5-4.9-2.8-4.9 2.8 1.3-5-3.9-3.4 5.1-.4z" fill="#d9a35b" stroke="#8a5a28" strokeWidth="1" transform="translate(0 2.5)" />
          <circle cx="12" cy="11.5" r="1.4" fill="#c4553f" />
        </Svg>
      )
    case 'raunaechte':
      return (
        <Svg>
          <path d="M12 2l2.6 6.4L21 9l-5 4.3 1.6 6.7L12 16.5 6.4 20 8 13.3 3 9l6.4-.6z" fill="#f5d76e" stroke="#b8962a" strokeWidth="1" />
        </Svg>
      )
    case 'lichtmess':
      return (
        <Svg>
          <path d="M12 21V9" stroke="#5f9e45" strokeWidth="1.4" />
          <path d="M12 9c-3 0-4.5 3-4 6 2-1 4-3 4-6zM12 9c3 0 4.5 3 4 6-2-1-4-3-4-6zM12 9c-1 2-1 5 0 7 1-2 1-5 0-7z" fill="#fff" stroke="#9fb7c9" strokeWidth=".8" />
          <path d="M12 9c0-2 1-3.5 3-4" stroke="#5f9e45" strokeWidth="1.2" fill="none" />
        </Svg>
      )
    case 'sonnenblumen':
      return (
        <Svg>
          {Array.from({ length: 10 }, (_, i) => (
            <ellipse key={i} cx="12" cy="5" rx="1.8" ry="3.4" fill="#f5c542" transform={`rotate(${i * 36} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="4.2" fill="#6e4a2b" />
        </Svg>
      )
    default:
      return (
        <Svg>
          {Array.from({ length: 5 }, (_, i) => (
            <circle key={i} cx="12" cy="6.5" r="3.6" fill="#e9a3d3" stroke="#b46a9e" strokeWidth=".7" transform={`rotate(${i * 72} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="2.6" fill="#f5c542" />
        </Svg>
      )
  }
}

/** Trauben — Weinberg currency */
export function IconGrapes() {
  return (
    <Svg>
      <path d="M12 2.5v3.5" stroke="#6e4a2b" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M12.5 4c2-1.6 4.6-1.2 5.5.2-1.8 1.4-4 1.2-5.5-.2z" fill="#5f9e45" />
      {[[12, 8], [8.6, 10.4], [15.4, 10.4], [6, 13.4], [12, 13], [18, 13.4], [9, 16.4], [15, 16.4], [12, 19.6]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#6b3a78" stroke="#3a1838" strokeWidth=".6" />
      ))}
      <circle cx="11" cy="7.2" r=".9" fill="#fff" opacity=".4" />
    </Svg>
  )
}

/** Oma Ilse — headscarf, glasses */
export function IconIlse() {
  return (
    <Svg>
      <circle cx="12" cy="13" r="5.2" fill="#f2d2b0" stroke="#8a6a40" strokeWidth="1" />
      <path d="M6 13c0-5 3-8 6-8s6 3 6 8c-1-2-3-3.4-6-3.4S7 11 6 13z" fill="#c4553f" />
      <path d="M7 18.5l2-2.2M17 18.5l-2-2.2" stroke="#c4553f" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="10" cy="13.4" r="1.4" fill="none" stroke="#4a3208" strokeWidth=".7" />
      <circle cx="14" cy="13.4" r="1.4" fill="none" stroke="#4a3208" strokeWidth=".7" />
      <path d="M11.4 13.4h1.2" stroke="#4a3208" strokeWidth=".6" />
      <path d="M10.6 16.2c.9.6 1.9.6 2.8 0" stroke="#4a3208" strokeWidth=".8" fill="none" strokeLinecap="round" />
    </Svg>
  )
}

/** Currency icon for Kapitel 4–12 */
export function IconChapterCurrency({ chapter }: { chapter: string }) {
  switch (chapter) {
    case 'bauernhof': // Milch
      return (
        <Svg>
          <path d="M9 3h6v3l2 3v11a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 7 20V9l2-3z" fill="#fbf6e8" stroke="#6a8aa8" strokeWidth="1.1" />
          <rect x="9" y="2" width="6" height="2" rx=".6" fill="#3d8db8" />
          <path d="M7 12h10v4H7z" fill="#3d8db8" opacity=".7" />
        </Svg>
      )
    case 'imkerei': // Honig
      return (
        <Svg>
          <rect x="6" y="8" width="12" height="13" rx="3" fill="#e8b422" stroke="#a5733f" strokeWidth="1" />
          <rect x="5" y="5" width="14" height="4" rx="1" fill="#c4553f" />
          <path d="M9 12h6M9 15h6" stroke="#fff" strokeWidth=".8" opacity=".6" />
        </Svg>
      )
    case 'teich': // Fisch
      return (
        <Svg>
          <ellipse cx="11" cy="12" rx="8" ry="4.6" fill="#6aa6c9" stroke="#3d6f8a" strokeWidth="1" />
          <path d="M18 12l4-4v8z" fill="#6aa6c9" stroke="#3d6f8a" strokeWidth="1" />
          <circle cx="7" cy="11" r="1" fill="#1f2a3a" />
        </Svg>
      )
    case 'kraeuter':
      return (
        <Svg>
          <path d="M12 21V8" stroke="#3f7a30" strokeWidth="1.4" />
          <path d="M12 8c-5 0-7-3-7-6 4 0 7 2 7 6zM12 12c4 0 7-2 7-5-4 0-7 2-7 5zM12 16c-4 0-6-2-6-4 3 0 6 1 6 4z" fill="#5f9e45" />
        </Svg>
      )
    case 'botanik':
      return (
        <Svg>
          {Array.from({ length: 6 }, (_, i) => (
            <ellipse key={i} cx="12" cy="6" rx="2.8" ry="4.2" fill="#e85d8a" transform={`rotate(${i * 60} 12 12)`} />
          ))}
          <circle cx="12" cy="12" r="2.6" fill="#f5c542" />
        </Svg>
      )
    case 'alm': // Käse
      return (
        <Svg>
          <path d="M3 16 L19 6 L21 16z" fill="#f5c542" stroke="#b8862a" strokeWidth="1" />
          <path d="M3 16h18v4H3z" fill="#e8b422" stroke="#b8862a" strokeWidth="1" />
          <circle cx="12" cy="13" r="1.3" fill="#d9a020" />
          <circle cx="16" cy="11" r="1" fill="#d9a020" />
        </Svg>
      )
    case 'lavendel':
      return (
        <Svg>
          <path d="M12 22V6" stroke="#5f7a4a" strokeWidth="1.2" />
          {[4, 7, 10, 13].map((y) => (
            <g key={y}>
              <ellipse cx="10.4" cy={y} rx="1.6" ry="2" fill="#7a5ab8" />
              <ellipse cx="13.6" cy={y + 1} rx="1.6" ry="2" fill="#9a7ac4" />
            </g>
          ))}
        </Svg>
      )
    case 'japangarten': // Tee
      return (
        <Svg>
          <path d="M4 10h14v4a6 6 0 0 1-6 6h-2a6 6 0 0 1-6-6z" fill="#7fae58" stroke="#3f7a30" strokeWidth="1" />
          <path d="M18 11h1.5a2.5 2.5 0 0 1 0 5H17" stroke="#3f7a30" strokeWidth="1.2" fill="none" />
          <path d="M8 7c0-2 2-2 2-4M12 7c0-2 2-2 2-4" stroke="#9fb7c9" strokeWidth="1" fill="none" />
        </Svg>
      )
    case 'stadtgarten': // Tomate
      return (
        <Svg>
          <circle cx="12" cy="14" r="7" fill="#e2453c" stroke="#9a2a24" strokeWidth="1" />
          <path d="M12 7.4l-3-2 2 2.6-3.4.4 3.4 1 .4 2 .6-2 3.4-1-3.4-.4 2-2.6z" fill="#3f7a30" />
          <ellipse cx="9.4" cy="12" rx="1.6" ry="1" fill="#fff" opacity=".35" />
        </Svg>
      )
    case 'klostergarten': // Quitte
      return (
        <Svg>
          <path d="M12 5c3 0 4 2.4 4 4 2 1.6 3 3.6 3 6 0 3.6-3 6-7 6s-7-2.4-7-6c0-2.4 1-4.4 3-6 0-1.6 1-4 4-4z" fill="#e8b422" stroke="#a5781a" strokeWidth="1" />
          <path d="M12 5V2.6" stroke="#6e4a2b" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12.4 3.6c1.6-1.2 3.6-1 4.4.2-1.4 1-3 1-4.4-.2z" fill="#5f9e45" />
          <ellipse cx="9.6" cy="12" rx="1.4" ry="2" fill="#fff" opacity=".35" />
        </Svg>
      )
    case 'schlossgarten': // Spargel
      return (
        <Svg>
          {[8, 12, 16].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 21V${6 + (i % 2) * 2}`} stroke="#efe6d0" strokeWidth="3" strokeLinecap="round" />
              <path d={`M${x - 1.4} ${7 + (i % 2) * 2}q1.4-3 2.8 0`} fill="#c9b8d8" />
              <path d={`M${x - 1.2} 12.6h2.4M${x - 1.2} 16.4h2.4`} stroke="#c9bfa8" strokeWidth=".6" />
            </g>
          ))}
          <path d="M5 17.6h14" stroke="#5f9e45" strokeWidth="2" strokeLinecap="round" />
        </Svg>
      )
    case 'baumschule': // Setzling
      return (
        <Svg>
          <path d="M7 15h10l-1.4 6.4h-7.2z" fill="#c8693e" stroke="#8a4a32" strokeWidth="1" />
          <path d="M6.4 15h11.2" stroke="#8a4a32" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M12 15V8" stroke="#3f7a30" strokeWidth="1.4" />
          <path d="M12 10c-1-3-4-4-6-3 0 2.6 3 4 6 3zM12 8.4c1-3 4-4 6-3 0 2.6-3 4-6 3z" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".6" />
        </Svg>
      )
    case 'moorgarten': // Moosbeeren
      return (
        <Svg>
          <path d="M4 18c4-3 8-3 16 0" stroke="#4f7a2e" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          {[[8, 13, 3.4], [15, 12, 3.6], [11.6, 17.4, 3]].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="#d7263d" stroke="#8a1a28" strokeWidth=".8" />
              <circle cx={x! - r! * 0.35} cy={y! - r! * 0.35} r={r! * 0.28} fill="#fff" opacity=".4" />
            </g>
          ))}
        </Svg>
      )
    case 'deichgarten': // Sanddorn: Zweig mit orangen Beeren
      return (
        <Svg>
          <path d="M5 20L18 5" stroke="#7a5532" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M9 15.4l-4 -1.6M12 12l-1 -4.4M15 8.6l4 .6M10 16.6l2.6 2.8" stroke="#9aa88a" strokeWidth="1.4" strokeLinecap="round" />
          {[[8, 17.6], [10.4, 14.6], [12.8, 11.8], [15.2, 9], [9.6, 18.6], [12, 15.8], [14.4, 12.8], [16.6, 10]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.7" fill="#f08a2c" stroke="#a5531a" strokeWidth=".6" />
          ))}
        </Svg>
      )
    case 'spreewald': // Gurke
      return (
        <Svg>
          <path d="M5.4 17.4c3 1.6 9 0 13 -9 .8 -2 -1 -3.4 -2.4 -2C12.4 10 8.6 12.6 5.6 13.4c-1.8.6 -1.8 3.2 -.2 4z" fill="#3f7a30" stroke="#24521c" strokeWidth="1" />
          {[[8, 15], [11, 13.6], [14, 11], [16, 8]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r=".7" fill="#9ad16f" />
          ))}
          <path d="M17.6 6.4l1.6 -2" stroke="#5f9e45" strokeWidth="1.2" strokeLinecap="round" />
        </Svg>
      )
    case 'cottagegarten': // Duftwicke
      return (
        <Svg>
          <path d="M12 21V12" stroke="#3f7a30" strokeWidth="1.2" />
          <path d="M12 16c2 -1 3.4 -.6 4.4 .6" stroke="#3f7a30" strokeWidth="1" fill="none" />
          <path d="M12 12.6C8 13 5.6 9.6 7 6.4c1.6 -.4 3.4.6 5 3.2 1.6 -2.6 3.4 -3.6 5 -3.2 1.4 3.2 -1 6.6 -5 6.2z" fill="#f28ab2" stroke="#b84a78" strokeWidth=".9" />
          <path d="M12 12.4c-1.6 -1 -2.2 -3 -1.4 -4.6 1 -.6 2 -.6 2.8 0 .8 1.6.2 3.6 -1.4 4.6z" fill="#c77dd1" stroke="#8a4a9a" strokeWidth=".7" />
        </Svg>
      )
    case 'tulpenfelder': // Blumenzwiebel
      return (
        <Svg>
          <path d="M12 4c1.4 2.6 5.6 6 5.6 10.4 0 3.6 -2.6 6.4 -5.6 6.4s-5.6 -2.8 -5.6 -6.4C6.4 10 10.6 6.6 12 4z" fill="#c9a46b" stroke="#8a5a32" strokeWidth="1" />
          <path d="M12 4.6v16M9 9.4c-1 2.4 -1 6.6.4 10.4M15 9.4c1 2.4 1 6.6 -.4 10.4" stroke="#a5733f" strokeWidth=".7" fill="none" />
          <path d="M10 21.4l-1.4 1.4M12 21.6v1.6M14 21.4l1.4 1.4" stroke="#8a5a32" strokeWidth=".8" strokeLinecap="round" />
          <path d="M12 4.4V2" stroke="#5f9e45" strokeWidth="1.4" strokeLinecap="round" />
        </Svg>
      )
    case 'artischocken': // Artischocke
      return (
        <Svg>
          <path d="M12 20v2.4" stroke="#5f7a5a" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 3.6c4 2 6.4 6 6 10-.4 3.6 -3 6.4 -6 6.4s-5.6 -2.8 -6 -6.4c-.4 -4 2 -8 6 -10z" fill="#9aa88a" stroke="#5f7a5a" strokeWidth="1" />
          <path d="M6.4 11c2 2.4 9.2 2.4 11.2 0M6.6 15c2.4 2.4 8.4 2.4 10.8 0M9 7.4c1.6 1.4 4.4 1.4 6 0" stroke="#6a3d8f" strokeWidth="1.2" fill="none" />
          <path d="M12 3.8V20" stroke="#5f7a5a" strokeWidth=".7" />
        </Svg>
      )
    case 'beerenwald': // Blaubeeren
      return (
        <Svg>
          <path d="M6 7c2 -3 5 -3 6 -1M12 6c2 -3 5 -2 6 0" stroke="#3f7a30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M12 6c-.6 1.6 -.6 3 0 4" stroke="#3f7a30" strokeWidth="1" />
          {[[8, 14, 3.6], [15.6, 13, 3.4], [11.6, 18.4, 3.2]].map(([x, y, r], i) => (
            <g key={i}>
              <circle cx={x} cy={y} r={r} fill="#3d4f9a" stroke="#1f2a5a" strokeWidth=".8" />
              <path d={`M${x! - 0.9} ${y! - r! + 0.6}h1.8`} stroke="#1f2a5a" strokeWidth=".7" />
              <circle cx={x! - r! * 0.4} cy={y! - r! * 0.1} r={r! * 0.26} fill="#fff" opacity=".35" />
            </g>
          ))}
        </Svg>
      )
    case 'patio': // Bitterorange mit Blatt
      return (
        <Svg>
          <path d="M12 6c1 -2.6 3.6 -3.6 6 -3c-1 2.4 -3.4 3.6 -6 3z" fill="#3f7a30" />
          <circle cx="12" cy="14" r="7" fill="#f08a2c" stroke="#a5531a" strokeWidth="1" />
          <circle cx="12" cy="7.6" r=".9" fill="#5f9e45" />
          <circle cx="9.4" cy="11.6" r="1.6" fill="#fff" opacity=".35" />
          {[[14, 16], [10, 17], [15, 12]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r=".35" fill="#a5531a" />
          ))}
        </Svg>
      )
    case 'korkeichen': // Korken
      return (
        <Svg>
          <path d="M7 6.4h10l-1.4 14h-7.2z" fill="#c9a46b" stroke="#8a5a32" strokeWidth="1.1" />
          <ellipse cx="12" cy="6.4" rx="5" ry="1.8" fill="#d9b78a" stroke="#8a5a32" strokeWidth="1" />
          {[[10, 11], [13.4, 13], [11, 16], [14, 17.6], [9.6, 18.4]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r=".6" fill="#8a5a32" />
          ))}
        </Svg>
      )
    case 'paprikafelder': // Paprikaschote
      return (
        <Svg>
          <path d="M12 6c0 -2 1 -3 3 -3.4" stroke="#3f7a30" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d="M8 7.6c2.4 -1.4 5.6 -1.4 8 0c.8 4 -.4 9 -3.4 13.4c-.4 .6 -1 .6 -1.4 0c-3 -4.4 -4 -9.4 -3.2 -13.4z" fill="#e2453c" stroke="#a52a24" strokeWidth="1" />
          <path d="M10 9c-.4 3 0 6 1.4 9" stroke="#fff" strokeWidth=".9" opacity=".4" fill="none" />
        </Svg>
      )
    case 'aranfelder': // Wollknäuel
      return (
        <Svg>
          <circle cx="12" cy="12.6" r="8" fill="#fbf6e8" stroke="#8a7a6a" strokeWidth="1.1" />
          <path d="M5.6 9.6c4 1 8.6 4.6 10.6 9.4M5 13.4c3.4 .4 7.4 3 8.8 6.8M8.6 5.4c3 2.4 7.6 3.2 11 3" stroke="#a69a8a" strokeWidth=".9" fill="none" />
          <path d="M19.4 16c1.6 1.6 2.6 3.4 2.4 5.4" stroke="#8a7a6a" strokeWidth="1" fill="none" />
        </Svg>
      )
    case 'rosental': // Rosenöl-Flakon mit Rose
      return (
        <Svg>
          <path d="M9.6 9h4.8v2.4l2.6 3v6.6h-10v-6.6l2.6 -3z" fill="#f7c6d9" stroke="#a5531a" strokeWidth="1" />
          <rect x="10.2" y="6" width="3.6" height="3" fill="#c9a24a" stroke="#8a5a32" strokeWidth=".8" />
          <path d="M8 17h8" stroke="#fff" strokeWidth=".8" opacity=".6" />
          <circle cx="17.6" cy="6" r="3" fill="#f28ab2" stroke="#d7263d" strokeWidth=".8" />
          <path d="M16.4 5.6c.8 -1 2 -1 2.4 .2" stroke="#d7263d" strokeWidth=".6" fill="none" />
        </Svg>
      )
    case 'pistazien': // Pistazie, Schale offen
      return (
        <Svg>
          <path d="M5.4 13c0 -4.4 3 -8 6.6 -8s6.6 3.6 6.6 8c0 1.4 -.4 2.6 -1 3.6l-5.6 -2.6l-5.6 2.6c-.6 -1 -1 -2.2 -1 -3.6z" fill="#efe1c2" stroke="#8a6a40" strokeWidth="1" />
          <ellipse cx="12" cy="15.4" rx="4.4" ry="3.6" fill="#7fbf5a" stroke="#4f7a2e" strokeWidth="1" />
          <path d="M9.4 14.4c1.4 -1 3.6 -1.4 5 -.4" stroke="#9a6bc9" strokeWidth=".8" fill="none" />
          <path d="M6.4 16.6l5.6 4.2l5.6 -4.2" fill="#efe1c2" stroke="#8a6a40" strokeWidth="1" />
        </Svg>
      )
    case 'andenkartoffeln': // zwei Andenkartoffeln, eine lila, eine gelb
      return (
        <Svg>
          <ellipse cx="9.4" cy="13.6" rx="6" ry="4.6" fill="#6a3d8f" stroke="#3d2f1f" strokeWidth="1" transform="rotate(-20 9.4 13.6)" />
          <ellipse cx="15.4" cy="15.4" rx="5.4" ry="4.2" fill="#f5c542" stroke="#8a5a32" strokeWidth="1" transform="rotate(15 15.4 15.4)" />
          {[[7, 12], [10.6, 15], [14, 14], [17, 17]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r=".6" fill={i < 2 ? '#c77dd1' : '#a5733f'} />
          ))}
        </Svg>
      )
    case 'milpa': // Maiskolben mit Hüllblättern
      return (
        <Svg>
          <path d="M12 21c-3 -2 -6 -6 -5 -11c3 2 4 6 5 11zM12 21c3 -2 6 -6 5 -11c-3 2 -4 6 -5 11z" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".9" />
          <ellipse cx="12" cy="10.6" rx="3.4" ry="7.4" fill="#f5c542" stroke="#a5733f" strokeWidth="1" />
          {[6, 8.6, 11.2, 13.8].map((y) => (
            <path key={y} d={`M9.4 ${y}h5.2`} stroke="#e8b422" strokeWidth=".8" />
          ))}
          <circle cx="11" cy="9.6" r=".7" fill="#3d6fd1" />
        </Svg>
      )
    case 'kaffeewald': // Kaffeekirschen am Zweig
      return (
        <Svg>
          <path d="M3.6 6.4c4 1.4 9 4 14.4 11" stroke="#7a5532" strokeWidth="1.3" fill="none" strokeLinecap="round" />
          <path d="M8 8c-1 -3 1 -5.4 3.4 -5.6c.6 2.4 -1 4.6 -3.4 5.6z" fill="#3f7a30" />
          {[[9.6, 12.2], [13.4, 13.4], [11.6, 16.2], [15.6, 17.6]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.4" fill="#d7263d" stroke="#6a3d8f" strokeWidth=".7" />
          ))}
        </Svg>
      )
    case 'reisterrassen': // Reisrispe
      return (
        <Svg>
          <path d="M8 21.4c1 -6 3 -11 9 -17" stroke="#a5733f" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {[[10.4, 15], [12, 12], [13.6, 9.4], [15.4, 7], [9.6, 18], [11.6, 13.6]].map(([x, y], i) => (
            <ellipse key={i} cx={x + (i % 2 ? 2.2 : -1.4)} cy={y} rx="1.2" ry="2" fill="#e8b422" stroke="#a5733f" strokeWidth=".6" transform={`rotate(${i % 2 ? 40 : -30} ${x + (i % 2 ? 2.2 : -1.4)} ${y})`} />
          ))}
        </Svg>
      )
    case 'gewuerzgarten': // Pfefferähre mit Blatt
      return (
        <Svg>
          <path d="M12 3.4c-5 1 -7 5 -6 9c4 -1 6 -4 6 -9z" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".9" />
          <path d="M12 3.4V6" stroke="#3f7a30" strokeWidth="1" />
          {[7, 9.4, 11.8, 14.2, 16.6, 19].map((y, i) => (
            <circle key={y} cx={i % 2 ? 13.2 : 11.4} cy={y} r="1.6" fill={i < 2 ? '#3a3a3a' : '#d7263d'} stroke="#3d2f1f" strokeWidth=".5" />
          ))}
        </Svg>
      )
    case 'oase': // drei Datteln an der Rispe
      return (
        <Svg>
          <path d="M12 2.6c0 3 -2 5 -4.4 6.6M12 2.6c0 3 2 5 4.4 6.6M12 2.6V9" stroke="#e8b422" strokeWidth="1" fill="none" strokeLinecap="round" />
          {[[7.4, 13.4, -15], [12, 15.4, 0], [16.6, 13.4, 15]].map(([x, y, r], i) => (
            <ellipse key={i} cx={x} cy={y} rx="2.8" ry="4.6" fill={i === 1 ? '#a5531a' : '#8a5a32'} stroke="#3d2f1f" strokeWidth=".9" transform={`rotate(${r} ${x} ${y})`} />
          ))}
          <path d="M11 13c.4 -1.4 .4 -2.6 0 -3.6" stroke="#d2752c" strokeWidth=".8" fill="none" strokeLinecap="round" />
        </Svg>
      )
    case 'kakaogarten': // Kakaoschote, aufgeschnitten mit Bohnen
      return (
        <Svg>
          <path d="M6 18.6C3 14 5 6 12 3.4c7 2.6 9 10.6 6 15.2c-3 3 -9 3 -12 0z" fill="#e8b422" stroke="#a5531a" strokeWidth="1" />
          <path d="M9 5.6c-1.4 4 -1.4 8.6 0 13M15 5.6c1.4 4 1.4 8.6 0 13M12 3.4v17.4" stroke="#d2752c" strokeWidth=".8" fill="none" />
          <ellipse cx="12" cy="13" rx="3.2" ry="4.6" fill="#fbf6e8" stroke="#8a6a40" strokeWidth=".6" />
          {[10.8, 13.2].map((x) => [11, 13.6].map((y) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="1" ry="1.2" fill="#7a4d30" />))}
        </Svg>
      )
    case 'buschgarten': // Akazienzweig mit gelben Blütenkugeln und Samenhülse
      return (
        <Svg>
          <path d="M4 20c4 -4 8 -9 15 -15" stroke="#7a5532" strokeWidth="1.1" fill="none" strokeLinecap="round" />
          {[[8, 13], [12, 9.4], [16, 6.4]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="2.4" fill="#f5c542" stroke="#e8b422" strokeWidth=".8" />
          ))}
          <path d="M9 19c3 1 7 0 10 -3" stroke="#8a5a32" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          {[11, 14, 17].map((x, i) => (
            <circle key={x} cx={x} cy={19.4 - i * 1.2} r=".8" fill="#3a3a3a" />
          ))}
        </Svg>
      )
    case 'farngarten': // Koru: sich entrollender Farnwedel
      return (
        <Svg>
          <path d="M12 21.4V13c0 -4 2.6 -7.4 5.6 -7.4c2.2 0 3.4 1.6 3.4 3.4c0 1.6 -1.2 2.8 -2.8 2.8c-1.4 0 -2.2 -1 -2.2 -2.2c0 -1 .7 -1.6 1.4 -1.6" stroke="#3f7a30" strokeWidth="2" fill="none" strokeLinecap="round" />
          {[[12, 18, -1], [12, 15, -1], [12, 18, 1], [12, 15, 1]].map(([x, y, d], i) => (
            <path key={i} d={`M${x} ${y}q${d! * 3} -1 ${d! * 5} -3.4`} stroke="#5f9e45" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          ))}
        </Svg>
      )
    case 'kimchigarten': // Chinakohl
      return (
        <Svg>
          <path d="M7 20.4C5 15 6 7 12 3c6 4 7 12 5 17.4z" fill="#9ad16f" stroke="#3f7a30" strokeWidth="1" />
          <path d="M12 3.4V20.4M9 8c1.4 2 2.4 4 3 7M15 8c-1.4 2 -2.4 4 -3 7" stroke="#fbf6e8" strokeWidth=".9" fill="none" />
          <path d="M5.4 20.4c-1 -4 .4 -7 2.4 -9c.2 4 1.2 7 2.2 9zM18.6 20.4c1 -4 -.4 -7 -2.4 -9c-.2 4 -1.2 7 -2.2 9z" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".8" />
        </Svg>
      )
    case 'dachgarten': // Salatkopf
      return (
        <Svg>
          <ellipse cx="12" cy="15" rx="9" ry="6" fill="#5f9e45" stroke="#3f7a30" strokeWidth="1" />
          <path d="M5 13c2 -5 5 -7 7 -7s5 2 7 7" fill="#7fbf5a" stroke="#3f7a30" strokeWidth=".9" />
          <ellipse cx="12" cy="13" rx="4.4" ry="3.6" fill="#9ad16f" stroke="#5f9e45" strokeWidth=".8" />
          <path d="M12 9.6v7M9 12c1.4 .6 2.4 1.6 3 3M15 12c-1.4 .6 -2.4 1.6 -3 3" stroke="#5f9e45" strokeWidth=".7" fill="none" />
        </Svg>
      )
    case 'schulgarten': // Radieschen-Bund
      return (
        <Svg>
          {[[8, 15.4], [12, 17], [16, 15.4]].map(([x, y], i) => (
            <g key={i}>
              <path d={`M${x} ${y! - 3}c-1 -4 -3 -6 -4 -8M${x} ${y! - 3}c1 -4 3 -6 4 -8`} stroke="#3f7a30" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <circle cx={x} cy={y} r="3.4" fill="#e0485e" stroke="#d7263d" strokeWidth=".9" />
              <path d={`M${x} ${y! + 3.4}v2`} stroke="#fbf6e8" strokeWidth=".8" />
            </g>
          ))}
        </Svg>
      )
    case 'waldgarten': // Haselnuss in der Hülle
      return (
        <Svg>
          <ellipse cx="12" cy="14.6" rx="6" ry="6.4" fill="#a5733f" stroke="#6e4a2b" strokeWidth="1" />
          <ellipse cx="10.4" cy="12.6" rx="1.6" ry="2.4" fill="#c9a46b" />
          <path d="M5 9.4c1 -4 4 -6 7 -6s6 2 7 6c-2 -1 -4 -1 -7 -1s-5 0 -7 1z" fill="#7fbf5a" stroke="#3f7a30" strokeWidth=".9" />
          <path d="M8 8c1 -1 2 -2 4 -2s3 1 4 2" stroke="#3f7a30" strokeWidth=".6" fill="none" />
        </Svg>
      )
    case 'samenbank': // Saatgut-Glas mit Etikett
      return (
        <Svg>
          <rect x="6.4" y="6.4" width="11.2" height="14.6" rx="2" fill="#d6f0f6" stroke="#6b6f73" strokeWidth="1" />
          <rect x="7.6" y="13" width="8.8" height="6.8" rx="1" fill="#7a4a1a" />
          {[9.4, 12, 14.6].map((x) => <ellipse key={x} cx={x} cy="14.6" rx=".8" ry=".6" fill="#c9a46b" />)}
          <rect x="6" y="3.4" width="12" height="3.4" rx=".8" fill="#6b6f73" stroke="#3a3a3a" strokeWidth=".6" />
          <rect x="8.6" y="8.4" width="6.8" height="3.4" fill="#fff6dc" stroke="#8a6a40" strokeWidth=".5" />
        </Svg>
      )
    case 'klimagarten': // Regentropfen
      return (
        <Svg>
          <path d="M12 2.6c3 4.6 6.4 8.4 6.4 12.2a6.4 6.4 0 0 1 -12.8 0c0 -3.8 3.4 -7.6 6.4 -12.2z" fill="#6aa6c9" stroke="#3d8db8" strokeWidth="1" />
          <path d="M9 14.4c0 2 1 3.4 2.6 4" stroke="#d6f0f6" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </Svg>
      )
    case 'wildblumenband': // Hummel
      return (
        <Svg>
          <ellipse cx="9" cy="7.4" rx="4" ry="2.6" fill="#ffffff" stroke="#8a8a8a" strokeWidth=".6" opacity=".9" />
          <ellipse cx="15" cy="7" rx="3.6" ry="2.4" fill="#ffffff" stroke="#8a8a8a" strokeWidth=".6" opacity=".9" />
          <ellipse cx="12" cy="14" rx="7" ry="5.6" fill="#3a3a3a" />
          <path d="M8.6 9.6c-.6 3 -.6 6 0 9M15.4 9.6c.6 3 .6 6 0 9" stroke="#f5c542" strokeWidth="2.2" fill="none" />
          <path d="M17.6 11.4c1 1.4 1.2 3.6 .6 5.4" stroke="#ffffff" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <circle cx="6" cy="12.4" r="1" fill="#fbf6e8" />
        </Svg>
      )
    case 'fassadengarten': // Weinranke mit rotem Blatt
      return (
        <Svg>
          <path d="M5 21c4 -3 3 -8 7 -10s4 -6 7 -8" stroke="#7a5532" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          <path d="M8 15l-4 -3l1 -4l3 2l1 -4l3 4z" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".8" />
          <path d="M14 10l1 -5l3 2l2 -3l1 5l-3 3z" fill="#d7263d" stroke="#a5531a" strokeWidth=".8" />
          <path d="M17 18c1 -1 2 -1 3 0" stroke="#3f7a30" strokeWidth="1" fill="none" />
          <circle cx="18" cy="15" r="1.4" fill="#6a3d8f" />
        </Svg>
      )
    case 'solawihof': // Gemüsekiste
      return (
        <Svg>
          <circle cx="8" cy="10" r="3" fill="#f08a2c" stroke="#a5531a" strokeWidth=".7" />
          <circle cx="13" cy="9" r="3.2" fill="#e2453c" stroke="#a5531a" strokeWidth=".7" />
          <ellipse cx="17.4" cy="10" rx="3" ry="2.6" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".7" />
          <rect x="3.6" y="11.6" width="16.8" height="8.4" rx="1" fill="#c9a46b" stroke="#6e4a2b" strokeWidth="1" />
          <path d="M3.6 15.6h16.8M8 11.6v8.4M16 11.6v8.4" stroke="#8a5a32" strokeWidth=".7" />
        </Svg>
      )
    case 'saatguttausch': // Brief mit Samentütchen
      return (
        <Svg>
          <rect x="3" y="8" width="15" height="11" rx="1" fill="#efe1c2" stroke="#8a6a40" strokeWidth="1" />
          <path d="M3 8l7.5 6l7.5 -6" stroke="#8a6a40" strokeWidth="1" fill="none" />
          <path d="M14 21v-9l1 -1h5l1 1v9z" fill="#fff6dc" stroke="#8a6a40" strokeWidth=".9" />
          <circle cx="17.5" cy="16" r="1.8" fill="#5f9e45" />
          <rect x="13.4" y="9.4" width="3" height="3" fill="#e0485e" />
        </Svg>
      )
    case 'weltgartenschau': // Weltkugel mit Blatt
      return (
        <Svg>
          <circle cx="12" cy="13" r="8" fill="#6aa6c9" stroke="#3d8db8" strokeWidth="1" />
          <path d="M7 9c2 1 3 3 2 5s1 3 2 5M14 6c-1 2 1 3 3 3s2 2 1 4" fill="#7fbf5a" stroke="#3f7a30" strokeWidth=".8" />
          <path d="M12 5c0 -2 2 -3 4 -3c0 2 -2 3 -4 3z" fill="#5f9e45" stroke="#3f7a30" strokeWidth=".6" />
        </Svg>
      )
    default: // Gartenschau: Besucher-Medaille
      return (
        <Svg>
          <path d="M8 2l4 7 4-7" stroke="#c4553f" strokeWidth="2.4" fill="none" />
          <circle cx="12" cy="15" r="6.5" fill="#f5c542" stroke="#b8862a" strokeWidth="1.2" />
          <path d="M12 11.5l1.1 2.3 2.5.3-1.8 1.7.5 2.5-2.3-1.2-2.3 1.2.5-2.5-1.8-1.7 2.5-.3z" fill="#fff8d0" />
        </Svg>
      )
  }
}

/** Grundstücke — folded map */
export function IconMap() {
  return (
    <Svg>
      <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z" fill="#f3e6c8" stroke="#8a6a40" strokeWidth="1.1" strokeLinejoin="round" />
      <path d="M9 4v14M15 6v14" stroke="#8a6a40" strokeWidth="1" />
      <path d="M5 13c2-2 3 1 5-1s3 1 5-1 3 1 4 0" stroke="#5f9e45" strokeWidth="1.2" fill="none" />
      <circle cx="17" cy="9" r="1.6" fill="#e0485e" />
    </Svg>
  )
}

/** Stern (Meilenstein); Farbe über currentColor */
export function IconStar({ className }: { className?: string }) {
  return (
    <Svg className={`g-icon-mono${className ? ` ${className}` : ''}`}>
      <path d="M12 2.6l2.8 5.9 6.4.8-4.7 4.4 1.2 6.4L12 17l-5.7 3.1 1.2-6.4-4.7-4.4 6.4-.8z" fill="currentColor" />
    </Svg>
  )
}

/** n Sterne nebeneinander (statt '★'.repeat) */
export function IconStars({ n }: { n: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <IconStar key={i} />
      ))}
    </>
  )
}

/** Haken (erledigt, gewählt); Farbe über currentColor */
export function IconCheck({ className }: { className?: string }) {
  return (
    <Svg className={`g-icon-mono${className ? ` ${className}` : ''}`}>
      <path d="M4.5 12.5l4.8 4.8L19.5 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

