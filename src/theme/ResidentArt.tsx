/** Hand-drawn Gartenbewohner (viewBox 32×32, standing on the bottom edge). */
import { memo } from 'react'
import type { ResidentId } from '../game/residents'
import { ArtSvg } from './ArtSvg'

const S = () => <ellipse cx="16" cy="30.5" rx="8" ry="1.6" fill="rgba(40,50,20,.25)" />

export const ResidentArt = memo(function ResidentArt({ id, silhouette }: { id: ResidentId; silhouette?: boolean }) {
  return (
    <ArtSvg viewBox="0 0 32 32" className={silhouette ? 'resident-silhouette' : undefined}>
      {draw(id)}
    </ArtSvg>
  )
})

function draw(id: ResidentId) {
  switch (id) {
    case 'amsel':
      return (
        <g>
          <S />
          <ellipse cx="15" cy="22" rx="7" ry="5" fill="#2a2a2a" />
          <circle cx="21" cy="16.6" r="3.6" fill="#2a2a2a" />
          <path d="M24 16.4l4 1-4 .8z" fill="#f0a020" />
          <circle cx="22" cy="15.8" r=".7" fill="#f0a020" />
          <path d="M8 21l-5-3 1 5z" fill="#2a2a2a" />
          <path d="M14 27v3M17 27v3" stroke="#f0a020" strokeWidth=".9" />
        </g>
      )
    case 'rotkehlchen':
      return (
        <g>
          <S />
          <ellipse cx="15" cy="22" rx="7" ry="5.4" fill="#8a6a40" />
          <ellipse cx="17.4" cy="21.4" rx="4.2" ry="4.4" fill="#e0602a" />
          <circle cx="20.6" cy="16" r="3.8" fill="#8a6a40" />
          <circle cx="21.2" cy="16.8" r="2.4" fill="#e0602a" />
          <circle cx="22" cy="15" r=".7" fill="#1a1a1a" />
          <path d="M24.2 15.6l2.6.6-2.6.6z" fill="#3a3a3a" />
          <path d="M8 21l-4-2 .6 4z" fill="#8a6a40" />
          <path d="M14 27v3M17 27v3" stroke="#6a4a2a" strokeWidth=".8" />
        </g>
      )
    case 'meise':
      return (
        <g>
          <S />
          <ellipse cx="15" cy="22" rx="6.6" ry="5.2" fill="#f5d23a" />
          <path d="M8.4 20q3-5 8-5" fill="#5f9e45" />
          <ellipse cx="12" cy="20" rx="4" ry="2.6" fill="#5fa0c4" />
          <circle cx="20.4" cy="16" r="3.6" fill="#fbf6e8" />
          <path d="M17 14.4q3.4-3 7 0" fill="#2e5fa4" />
          <path d="M18.6 16.8l3.6 0" stroke="#1a1a1a" strokeWidth="1" />
          <circle cx="21.6" cy="15.6" r=".6" fill="#1a1a1a" />
          <path d="M15 20v6" stroke="#1a1a1a" strokeWidth="1.2" />
          <path d="M14 27v3M17 27v3" stroke="#6a6a6a" strokeWidth=".8" />
        </g>
      )
    case 'igel':
      return (
        <g>
          <S />
          <path d="M4 28q1-12 12-12t12 9z" fill="#6e5a44" />
          {Array.from({ length: 8 }, (_, i) => (
            <path key={i} d={`M${7 + i * 2.6} ${22 - Math.sin((i / 7) * Math.PI) * 4}l-1.6-3`} stroke="#4a3a2a" strokeWidth="1" />
          ))}
          <path d="M22 22q6 1 7 5q-4 2-7 1z" fill="#c9a77e" />
          <circle cx="29" cy="26.6" r="1" fill="#2a1a0a" />
          <circle cx="25" cy="24.4" r=".7" fill="#1a1a1a" />
        </g>
      )
    case 'wildbiene':
      return (
        <g className="resident-hover">
          <ellipse cx="13" cy="10" rx="5" ry="3" fill="#fff" opacity=".8" />
          <ellipse cx="19" cy="10" rx="5" ry="3" fill="#fff" opacity=".8" />
          <ellipse cx="16" cy="17" rx="7" ry="5" fill="#d9a33a" stroke="#4a3208" strokeWidth=".8" />
          <path d="M13 12.6v9M17 12v10M21 13v8" stroke="#4a3208" strokeWidth="1.4" />
          <circle cx="23.4" cy="16" r="2.6" fill="#4a3208" />
        </g>
      )
    case 'marienkaefer':
      return (
        <g>
          <S />
          <path d="M6 28q-1-10 10-11 11 1 10 11z" fill="#e2302a" stroke="#7a1a12" strokeWidth=".8" />
          <path d="M16 17v11" stroke="#1a1a1a" strokeWidth="1" />
          <circle cx="16" cy="15.6" r="3.4" fill="#1a1a1a" />
          {[[11, 22], [21, 22], [10, 26], [22, 26], [13, 19.4], [19, 19.4]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.4" fill="#1a1a1a" />
          ))}
          <circle cx="14.6" cy="15" r=".7" fill="#fff" />
          <circle cx="17.4" cy="15" r=".7" fill="#fff" />
        </g>
      )
    case 'eichhoernchen':
      return (
        <g>
          <S />
          <path d="M8 29q-6-8 0-17q5-4 6 3q-3 5 1 9z" fill="#c4651f" />
          <ellipse cx="17" cy="24" rx="5" ry="5.4" fill="#d9783a" />
          <circle cx="20" cy="16.6" r="3.6" fill="#d9783a" />
          <path d="M18.4 13.4l.6-3 1.6 2.6M21 13.2l1.4-2.6.6 3" fill="#d9783a" />
          <circle cx="21.4" cy="16" r=".7" fill="#1a1a1a" />
          <ellipse cx="18" cy="25" rx="2.4" ry="3" fill="#fbe6c8" />
          <circle cx="20.6" cy="21.6" r="1.6" fill="#8a5a32" />
        </g>
      )
    case 'kroete':
      return (
        <g>
          <S />
          <ellipse cx="16" cy="25" rx="10" ry="5.4" fill="#8a7a4a" />
          <circle cx="11" cy="20" r="2.6" fill="#8a7a4a" />
          <circle cx="21" cy="20" r="2.6" fill="#8a7a4a" />
          <circle cx="11" cy="19.6" r="1.2" fill="#e8b422" />
          <circle cx="21" cy="19.6" r="1.2" fill="#e8b422" />
          <circle cx="11" cy="19.6" r=".5" fill="#1a1a1a" />
          <circle cx="21" cy="19.6" r=".5" fill="#1a1a1a" />
          {[[12, 26], [18, 24], [22, 27], [15, 28]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r=".9" fill="#6e5e34" />
          ))}
          <path d="M11 24q5 2 10 0" stroke="#5a4a2a" strokeWidth=".8" fill="none" />
        </g>
      )
    case 'zitronenfalter':
      return (
        <g className="resident-hover">
          <path d="M16 16C9 6 3 9 6 15c2 4 7 3 10 1zM16 16c7-10 13-7 10-1-2 4-7 3-10 1z" fill="#f5e04a" stroke="#a5893a" strokeWidth=".6" />
          <path d="M16 16c-6 3-8 8-4 9 3 0 4-4 4-9zM16 16c6 3 8 8 4 9-3 0-4-4-4-9z" fill="#ecd23a" stroke="#a5893a" strokeWidth=".6" />
          <circle cx="10" cy="13" r=".9" fill="#e0731a" />
          <circle cx="22" cy="13" r=".9" fill="#e0731a" />
          <path d="M16 10v15" stroke="#4a3a2a" strokeWidth="1.2" />
        </g>
      )
    case 'hase':
      return (
        <g>
          <S />
          <ellipse cx="14" cy="24" rx="8" ry="6" fill="#a58a6a" />
          <circle cx="6.6" cy="23" r="2.4" fill="#fbf6e8" />
          <circle cx="21.4" cy="18" r="4" fill="#a58a6a" />
          <ellipse cx="20" cy="9" rx="1.6" ry="5" fill="#a58a6a" transform="rotate(-10 20 9)" />
          <ellipse cx="23.6" cy="9.6" rx="1.6" ry="5" fill="#a58a6a" transform="rotate(14 23.6 9.6)" />
          <ellipse cx="20.2" cy="9.4" rx=".7" ry="3.4" fill="#e8b0a0" transform="rotate(-10 20 9)" />
          <circle cx="23" cy="17.4" r=".8" fill="#1a1a1a" />
          <circle cx="25.2" cy="19" r=".7" fill="#e8a098" />
        </g>
      )
    case 'fuchs':
      return (
        <g>
          <S />
          <path d="M3 22q-1-6 6-6q-2 6 3 9z" fill="#e0731a" />
          <path d="M3 22q1 2 4 1" stroke="#fbf6e8" strokeWidth="1.6" />
          <ellipse cx="15" cy="23" rx="7.6" ry="4.6" fill="#e0731a" />
          <path d="M11 27v3M19 27v3" stroke="#3a2a1a" strokeWidth="1.4" />
          <path d="M20 21l4-8 2 5 4 3-6 3z" fill="#e0731a" />
          <path d="M24 13l.6-4 2 4" fill="#3a2a1a" />
          <path d="M26 21l4 0-4 2z" fill="#fbf6e8" />
          <circle cx="25" cy="18" r=".7" fill="#1a1a1a" />
        </g>
      )
    case 'eule':
      return (
        <g>
          <S />
          <ellipse cx="16" cy="21" rx="8" ry="9" fill="#8a6a40" />
          <ellipse cx="16" cy="23" rx="5" ry="6" fill="#c9a46b" />
          <path d="M9 13l3 3M23 13l-3 3" stroke="#6e4a2b" strokeWidth="2" />
          <circle cx="12.6" cy="17" r="3" fill="#fbf6e8" />
          <circle cx="19.4" cy="17" r="3" fill="#fbf6e8" />
          <circle cx="12.6" cy="17" r="1.6" fill="#e8b422" />
          <circle cx="19.4" cy="17" r="1.6" fill="#e8b422" />
          <circle cx="12.6" cy="17" r=".7" fill="#1a1a1a" />
          <circle cx="19.4" cy="17" r=".7" fill="#1a1a1a" />
          <path d="M15 19.4l1 2 1-2z" fill="#e8a02a" />
        </g>
      )
  }
}
