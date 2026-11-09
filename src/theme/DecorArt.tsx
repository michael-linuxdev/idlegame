/** Hand-drawn Deko pieces (viewBox 40×40, standing on the bottom edge). */
import { memo } from 'react'
import type { DecorId } from '../game/decor'
import type { Season } from './ambient'
import { ArtSvg } from './ArtSvg'
import { P } from './art/palette'
import { Shadow } from './art/parts'


export const DecorArt = memo(function DecorArt({ id, season }: { id: DecorId; season?: Season }) {
  const winter = season === 'winter'
  return (
    <ArtSvg viewBox="0 0 40 40">
      {draw(id, winter)}
    </ArtSvg>
  )
})

function draw(id: DecorId, winter: boolean) {
  switch (id) {
    case 'zwerg':
      return (
        <g>
          <Shadow grid="decor" rx={7} />
          <path d="M14 37l1.4-12h9.2l1.4 12z" fill={P.blue} />
          <rect x="15" y="33" width="10" height="4" rx="1" fill={P.outlineWood} />
          <circle cx="20" cy="21" r="4.4" fill={P.skin} />
          <path d="M15.6 22q4.4 8 8.8 0z" fill={P.cream} />
          <path d="M15 18.6L20 6l5 12.6z" fill={P.tomato} />
          <circle cx="20" cy="22" r="1" fill="#e8a098" />
          {winter ? <path d="M16 17h8" stroke={P.white} strokeWidth="1.6" /> : null}
        </g>
      )
    case 'laubhaufen':
      return (
        <g>
          <Shadow grid="decor" rx={14} />
          <path d="M6 37q4-12 14-12t14 12z" fill={winter ? '#c9c0b0' : '#b8652a'} />
          {[[11, 33, '#d9a33a'], [19, 29, '#c4402a'], [27, 33, P.gold], [16, 35, '#a5531a'], [24, 30, '#d2752c']].map(([x, y, c], i) => (
            <ellipse key={i} cx={x as number} cy={y as number} rx="3" ry="1.6" fill={winter ? '#e8e4dc' : (c as string)} transform={`rotate(${i * 30} ${x} ${y})`} />
          ))}
          {winter ? <path d="M8 34q12-12 24 0" stroke={P.white} strokeWidth="2" fill="none" /> : null}
        </g>
      )
    case 'futterhaus':
      return (
        <g>
          <Shadow grid="decor" rx={6} />
          <path d="M19 37V20h2v17" fill={P.woodDark} />
          <rect x="11" y="16" width="18" height="4" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M9 14L20 6l11 8z" fill={P.roof} stroke="#7a2e22" strokeWidth=".6" />
          <path d="M13 14v2M27 14v2" stroke={P.outlineWood} strokeWidth="1" />
          <circle cx="15" cy="15.4" r=".9" fill="#e8c770" />
          <circle cx="24" cy="15.4" r=".9" fill="#e8c770" />
          {winter ? <path d="M10 13.4L20 6.2l10 7.2" stroke={P.white} strokeWidth="1.8" fill="none" /> : null}
        </g>
      )
    case 'traenke':
      return (
        <g>
          <Shadow grid="decor" rx={9} />
          <path d="M17 37l1-14h4l1 14z" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" />
          <ellipse cx="20" cy="22" rx="10" ry="3" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" />
          <ellipse cx="20" cy="21.6" rx="8" ry="2" fill={winter ? '#e8f4fa' : P.water} />
          {!winter ? (
            <g>
              <ellipse cx="25" cy="18.6" rx="2.2" ry="1.6" fill={P.woodDark} />
              <circle cx="26.6" cy="17.4" r="1.2" fill={P.woodDark} />
              <circle cx="26.4" cy="17.8" r=".7" fill="#e0602a" />
            </g>
          ) : null}
        </g>
      )
    case 'insektenhotel':
      return (
        <g>
          <Shadow grid="decor" rx={8} />
          <path d="M14 37V34M26 37V34" stroke={P.outlineWood} strokeWidth="1.4" />
          <rect x="11" y="14" width="18" height="20" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".7" />
          <path d="M9 14L20 6l11 8z" fill={P.outlineWood} />
          <path d="M11 21h18M11 28h18M20 14v20" stroke={P.outlineWood} strokeWidth=".7" />
          {[[13.5, 16], [16, 17.6], [13.5, 19], [22.5, 16], [25, 18], [22.5, 23], [25.5, 24.6], [13.5, 23.5], [16.5, 25], [14, 30.6], [17, 31], [24, 31]].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1" fill="#3a2a1a" />
          ))}
          {winter ? <path d="M10 13.4L20 6.2l10 7.2" stroke={P.white} strokeWidth="1.8" fill="none" /> : null}
        </g>
      )
    case 'windrad':
      return (
        <g className="decor-spin-host">
          <Shadow grid="decor" rx={5} />
          <path d="M19.4 37V16h1.2v21" fill="#8a7e6e" />
          <g className="decor-spin">
            {[0, 90, 180, 270].map((a, i) => (
              <path key={a} d="M20 15l0-8q4 2 0 8z" fill={[P.tomato, P.yellow, P.blue, P.leaf][i]} transform={`rotate(${a} 20 15)`} />
            ))}
            <circle cx="20" cy="15" r="1.2" fill={P.cream} />
          </g>
        </g>
      )
    case 'bank':
      return (
        <g>
          <Shadow grid="decor" rx={15} />
          <rect x="6" y="24" width="28" height="3" rx="1" fill={P.woodDark} />
          <rect x="6" y="17" width="28" height="2.4" rx="1" fill={P.woodMid} />
          <rect x="6" y="20.6" width="28" height="2.4" rx="1" fill={P.woodMid} />
          <path d="M9 27v10M31 27v10M9 17v8M31 17v8" stroke={P.charcoal} strokeWidth="1.6" />
          {winter ? <path d="M6 23.6h28" stroke={P.white} strokeWidth="1.8" /> : null}
        </g>
      )
    case 'lampions':
      return (
        <g>
          <path d="M4 37V12M36 37V12" stroke={P.outlineWood} strokeWidth="1.4" />
          <path d="M4 13Q20 22 36 13" stroke={P.outlineWood} strokeWidth=".6" fill="none" />
          {[9, 15, 21, 27, 32].map((x, i) => {
            const y = 13 + Math.sin((i / 4) * Math.PI) * 4.4
            return <ellipse key={x} className="fest-glow" cx={x} cy={y + 3} rx="2.4" ry="3" fill={[P.orange, P.red, P.yellow, P.lilac, P.waterDeep][i]} />
          })}
        </g>
      )
    case 'sonnenuhr':
      return (
        <g>
          <Shadow grid="decor" rx={9} />
          <path d="M16 37l1-12h6l1 12z" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" />
          <ellipse cx="20" cy="24" rx="9" ry="3" fill="#d9cfb8" stroke="#8a7e6e" strokeWidth=".6" />
          <path d="M20 24l4-6v6z" fill={P.outlineSoft} />
          {[0, 45, 90, 135, 180].map((a) => (
            <path key={a} d={`M${20 + Math.cos((a * Math.PI) / 180) * 7} ${24 - Math.sin((a * Math.PI) / 180) * 2.2}l.6 .2`} stroke="#6e5a3a" strokeWidth=".8" />
          ))}
        </g>
      )
    case 'rosenbogen':
      return (
        <g>
          <path d="M8 37V18Q20 2 32 18V37" stroke={P.outlineWood} strokeWidth="1.8" fill="none" />
          {Array.from({ length: 11 }, (_, i) => {
            const t = i / 10
            const ang = Math.PI * (1 - t)
            const x = 20 + Math.cos(ang) * 12
            const y = 18 - Math.sin(ang) * 10 + (i === 0 || i === 10 ? 6 : 0)
            return <circle key={i} cx={x} cy={y} r="2.2" fill={winter ? '#c9d0c4' : i % 2 ? P.leaf : P.red} />
          })}
        </g>
      )
    case 'blumenkorb':
      return (
        <g>
          <Shadow grid="decor" rx={10} />
          <path d="M10 26h20l-3 11H13z" fill={P.woodLight} stroke={P.outlineSoft} strokeWidth=".7" />
          <path d="M10 26q10-20 20 0" stroke={P.outlineSoft} strokeWidth="1.4" fill="none" />
          {[[13, 24, '#f7c6d9'], [17, 22, P.yellow], [21, 23, P.cream], [25, 22, P.lilac], [28, 25, P.red], [19, 25, P.leaf]].map(([x, y, c], i) => (
            <circle key={i} cx={x as number} cy={y as number} r="2.4" fill={c as string} />
          ))}
        </g>
      )
    case 'strandkorb':
      return (
        <g>
          <Shadow grid="decor" rx={11} />
          <path d="M9 37V16q11-10 22 0v21z" fill={P.paper} stroke="#a5893a" strokeWidth=".8" />
          {[12, 16, 20, 24, 28].map((x) => (
            <path key={x} d={`M${x} 13v24`} stroke={P.waterDeep} strokeWidth="1.6" opacity=".7" />
          ))}
          <path d="M11 24h18v6H11z" fill={P.blue} />
          <path d="M11 30h18v7H11z" fill="#d9c79a" />
        </g>
      )
    case 'kuerbislaterne':
      return (
        <g>
          <Shadow grid="decor" rx={10} />
          <ellipse cx="20" cy="29" rx="10" ry="8" fill="#e8731a" stroke="#a5531a" strokeWidth=".8" />
          <path d="M14 22q-2 7 0 14M26 22q2 7 0 14M20 21v16" stroke="#c4551a" strokeWidth=".7" fill="none" />
          <path d="M19 21q0-4 3-5" stroke="#5f7a2e" strokeWidth="1.6" fill="none" />
          <path d="M15 27l2.4-2 1.6 2.6zM21 27l2.4-2 1.6 2.6z" fill="#ffd25a" className="fest-glow" />
          <path d="M15 31q5 4 10 0l-1.6 1-1.6-1-1.8 1-1.6-1-1.6 1z" fill="#ffd25a" className="fest-glow" />
        </g>
      )
    case 'schneemann':
      return (
        <g>
          <Shadow grid="decor" rx={9} />
          <circle cx="20" cy="30" r="7.4" fill="#fbfdff" stroke="#c9d4dc" strokeWidth=".7" />
          <circle cx="20" cy="18" r="5.4" fill="#fbfdff" stroke="#c9d4dc" strokeWidth=".7" />
          <rect x="15.4" y="9" width="9.2" height="2" fill={P.charcoal} />
          <rect x="17" y="3.6" width="6" height="6" fill={P.charcoal} />
          <path d="M20 18.4l4.6 1-4.6.8z" fill={P.orange} />
          <circle cx="18" cy="16.6" r=".7" fill="#2a2a2a" />
          <circle cx="22" cy="16.6" r=".7" fill="#2a2a2a" />
          <path d="M15 22.4q5 2.4 10 0" stroke={P.tomato} strokeWidth="2" fill="none" />
          <path d="M13 27l-5-4M27 27l5-4" stroke={P.outlineWood} strokeWidth="1" />
        </g>
      )
    case 'brunnen':
      return (
        <g>
          <Shadow grid="decor" rx={15} />
          <ellipse cx="20" cy="33" rx="15" ry="4.4" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".7" />
          <ellipse cx="20" cy="32.4" rx="12.4" ry="3" fill={winter ? '#e8f4fa' : P.water} />
          <rect x="18" y="20" width="4" height="12" fill="#bdb3a0" />
          <ellipse cx="20" cy="20" rx="6" ry="1.8" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" />
          {!winter ? <path d="M20 19q0-10 0-10M20 11q-5 3-6 9M20 11q5 3 6 9" stroke="#d6eef8" strokeWidth="1.2" fill="none" className="fest-glow" /> : null}
        </g>
      )
    case 'pavillon':
      return (
        <g>
          <Shadow grid="decor" rx={15} />
          <ellipse cx="20" cy="36" rx="14" ry="2.4" fill="#efe6d0" stroke="#bdb3a0" strokeWidth=".6" />
          {[9, 16, 24, 31].map((x) => (
            <rect key={x} x={x - 0.9} y="18" width="1.8" height="18" fill={P.cream} stroke="#bdb3a0" strokeWidth=".4" />
          ))}
          <path d="M5 18Q20 2 35 18z" fill={P.leafDark} stroke="#2f5a22" strokeWidth=".6" />
          <circle cx="20" cy="7.4" r="1.6" fill="#e0a21a" />
          {winter ? <path d="M7 16.6Q20 3.6 33 16.6" stroke={P.white} strokeWidth="1.8" fill="none" /> : null}
        </g>
      )
  }
}
