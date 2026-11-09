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

