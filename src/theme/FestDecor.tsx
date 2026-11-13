/**
 * Map decoration for the saisonale Feste (while a fest runs) and for the four
 * Fest-Gartenstile (permanent once bought). Positions avoid the ten plots:
 * edges, the main path between plots, and the strip below the hedge.
 */
import { memo, type ReactNode } from 'react'
import type { FestId } from '../game/fests'
import { ArtSvg } from './ArtSvg'
import { inkProps } from './ink'
import { P } from './art/palette'

function D({
  left,
  top,
  w,
  cls = '',
  children,
}: {
  left: string
  top: string
  w: number
  cls?: string
  children: ReactNode
}) {
  return (
    <div className={`garden-decor decor-fest ${cls}`} style={{ left, top, width: `calc(var(--u) * ${w})` }}>
      {children}
    </div>
  )
}

function Laterne({ hue = '#f5a83a' }: { hue?: string }) {
  return (
    <ArtSvg viewBox="0 0 20 44" {...inkProps(1.7)}>
      <path d="M10 44V10" stroke={P.outlineWood} strokeWidth="1.6" />
      <path d="M10 10q6-4 8 2" stroke={P.outlineWood} strokeWidth="1.2" fill="none" />
      <ellipse className="fest-glow" cx="17" cy="21" rx="7" ry="7" fill="#fff3b0" opacity="0.35" stroke="none" />
      <ellipse cx="17" cy="21" rx="4.2" ry="5.4" fill={hue} />
      <ellipse cx="17" cy="21" rx="2" ry="5.4" fill="none" stroke="#c4651f" strokeWidth=".7" />
      <path d="M17 12v3.6" stroke={P.outlineWood} strokeWidth=".8" />
    </ArtSvg>
  )
}

function Ei({ c = P.pink, s = P.white }: { c?: string; s?: string }) {
  return (
    <ArtSvg viewBox="0 0 16 20" {...inkProps(1.7)}>
      <ellipse cx="8" cy="11" rx="6" ry="8" fill={c} stroke="rgba(0,0,0,.25)" strokeWidth=".8" />
      <path d="M2.4 10l2-1.4 1.8 1.4 1.8-1.4 1.8 1.4 1.8-1.4 2 1.4" stroke={s} strokeWidth="1.1" fill="none" />
    </ArtSvg>
  )
}

function Tulpen() {
  return (
    <ArtSvg viewBox="0 0 36 30" {...inkProps(1.7)}>
      {[6, 14, 22, 30].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 30V14`} stroke={P.leafMoss} strokeWidth="1.6" />
          <path d={`M${x - 4} 10q4 9 8 0l-2 2-2-4-2 4z`} fill={[P.red, P.yellow, P.pink, P.red][i]} />
        </g>
      ))}
    </ArtSvg>
  )
}

function Wimpelkette() {
  const colors = [P.tomato, P.yellow, P.waterDeep, P.leafLight, P.pink]
  return (
    <ArtSvg viewBox="0 0 200 20" preserveAspectRatio="none">
      <path d="M0 3 Q100 14 200 3" stroke={P.outlineWood} strokeWidth="1" fill="none" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 6 + i * 12
        const y = 3 + 11 * Math.sin((Math.PI * x) / 200) * 0.95
        return <path key={i} d={`M${x - 4} ${y}L${x + 4} ${y}L${x} ${y + 8}z`} fill={colors[i % colors.length]} />
      })}
    </ArtSvg>
  )
}

function Sonnenschirm() {
  return (
    <ArtSvg viewBox="0 0 40 44" {...inkProps(1.7)}>
      <path d="M20 12v32" stroke={P.outlineWood} strokeWidth="1.6" />
      <path d="M2 16Q20 -2 38 16z" fill={P.tomato} />
      <path d="M2 16Q11 8 14 16M14 16Q20 6 26 16M26 16Q29 8 38 16" fill={P.white} opacity=".85" stroke="none" />
      <ellipse cx="20" cy="43" rx="10" ry="1.5" fill="rgba(0,0,0,.18)" stroke="none" />
    </ArtSvg>
  )
}

function Sonnenblume() {
  return (
    <ArtSvg viewBox="0 0 20 52" {...inkProps(1.7)}>
      <path d="M10 52V14" stroke={P.leafMoss} strokeWidth="2.2" />
      <ellipse cx="6" cy="32" rx="4.5" ry="2" fill={P.leaf} transform="rotate(-30 6 32)" />
      <ellipse cx="14" cy="38" rx="4.5" ry="2" fill={P.leaf} transform="rotate(30 14 38)" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cx="10" cy="5" rx="1.8" ry="4" fill={P.yellow} transform={`rotate(${i * 30} 10 11)`} />
      ))}
      <circle cx="10" cy="11" r="4" fill={P.outlineWood} />
    </ArtSvg>
  )
}

function Kuerbis({ c = P.orange }: { c?: string }) {
  return (
    <ArtSvg viewBox="0 0 24 18" {...inkProps(1.7)}>
      <ellipse cx="12" cy="11" rx="11" ry="7" fill={c} />
      <path d="M8 5c-2 4-2 8 0 12M16 5c2 4 2 8 0 12M12 4v14" stroke="#c4651f" strokeWidth=".8" fill="none" />
      <path d="M12 4c0-2 1-3 3-3" stroke="#5f7a2e" strokeWidth="1.4" fill="none" />
    </ArtSvg>
  )
}

function Garbe() {
  return (
    <ArtSvg viewBox="0 0 24 34" {...inkProps(1.7)}>
      {Array.from({ length: 9 }, (_, i) => (
        <path key={i} d={`M12 20L${2 + i * 2.5} 2`} stroke="#d9b34a" strokeWidth="1.6" />
      ))}
      {Array.from({ length: 9 }, (_, i) => (
        <path key={`b${i}`} d={`M12 20L${4 + i * 2} 34`} stroke="#c49a3a" strokeWidth="1.6" />
      ))}
      <rect x="8" y="18" width="8" height="3.4" rx="1" fill="#a5531a" />
    </ArtSvg>
  )
}

function Tanne({ lights = true }: { lights?: boolean }) {
  return (
    <ArtSvg viewBox="0 0 40 56" {...inkProps(1.7)}>
      <rect x="17" y="46" width="6" height="8" fill={P.outlineWood} />
      <path d="M20 2L4 26h8L2 40h10L0 50h40L28 40h10L28 26h8z" fill="#2f6b3a" />
      <path d="M20 0l1.6 3.4 3.6.3-2.8 2.4.9 3.6L20 7.8l-3.3 1.9.9-3.6-2.8-2.4 3.6-.3z" fill="#f5d76e" />
      {lights
        ? [
            [14, 22], [26, 24], [10, 36], [22, 34], [30, 38], [16, 46], [26, 46], [20, 16],
          ].map(([x, y], i) => (
            <circle key={i} className="fest-twinkle" cx={x} cy={y} r="1.6" fill={[P.yellow, P.red, P.waterLight][i % 3]} style={{ animationDelay: `${i * 0.3}s` }} stroke="none" />
          ))
        : null}
    </ArtSvg>
  )
}

function Kranz() {
  return (
    <ArtSvg viewBox="0 0 40 26" {...inkProps(1.7)}>
      <ellipse cx="20" cy="18" rx="17" ry="6" fill="#2f6b3a" />
      <ellipse cx="20" cy="17" rx="10" ry="3" fill="#24502c" />
      {[8, 16, 24, 32].map((x, i) => (
        <g key={x}>
          <rect x={x - 2} y={6 + (i % 2)} width="4" height="10" rx="1" fill={P.roof} />
          <path className="fest-flame" d={`M${x} ${1 + (i % 2)}q2 3 0 5q-2-2 0-5z`} fill={P.yellow} />
        </g>
      ))}
      <circle cx="12" cy="20" r="1.4" fill={P.red} />
      <circle cx="28" cy="20" r="1.4" fill={P.red} />
    </ArtSvg>
  )
}

function Schneegloeckchen() {
  return (
    <ArtSvg viewBox="0 0 30 22" {...inkProps(1.7)}>
      {[5, 12, 19, 25].map((x, i) => (
        <g key={x}>
          <path d={`M${x} 22V${8 + (i % 2) * 2}q0-3 3-4`} stroke={P.leaf} strokeWidth="1.2" fill="none" />
          <path d={`M${x + 3} ${4 + (i % 2) * 2}q-2.4 1-1.6 5q1.6-1 1.6-5q2.4 1 1.6 5q-1.6-1-1.6-5z`} fill={P.white} />
        </g>
      ))}
    </ArtSvg>
  )
}

function Pfingstrose() {
  return (
    <ArtSvg viewBox="0 0 36 28" {...inkProps(1.7)}>
      <ellipse cx="18" cy="20" rx="17" ry="8" fill={P.leafMoss} />
      {[[9, 13, P.pink], [19, 10, '#e9a3d3'], [28, 14, P.pink]].map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="5.5" fill={c as string} />
          <circle cx={x as number} cy={y as number} r="3" fill={P.white} opacity=".45" stroke="none" />
        </g>
      ))}
    </ArtSvg>
  )
}

function Stern() {
  return (
    <ArtSvg viewBox="0 0 20 20" {...inkProps(1.7)}>
      <path className="fest-twinkle" d="M10 1l2.2 6 6.3.4-4.9 4 1.6 6.2L10 14.2 4.8 17.6l1.6-6.2-4.9-4L7.8 7z" fill="#f5d76e" stroke="none" />
    </ArtSvg>
  )
}

function Erntekrone() {
  return (
    <ArtSvg viewBox="0 0 30 34" {...inkProps(1.7)}>
      <path d="M15 0v6" stroke={P.outlineWood} strokeWidth="1" />
      <path d="M4 14Q15 2 26 14" stroke="#d9b34a" strokeWidth="3" fill="none" />
      <path d="M8 14Q15 6 22 14" stroke="#c49a3a" strokeWidth="2" fill="none" />
      <ellipse cx="15" cy="16" rx="11" ry="3" fill="#d9b34a" />
      {[[6, 20, P.red], [12, 23, P.roof], [18, 23, P.orange], [24, 20, P.red]].map(([x, y, c], i) => (
        <path key={i} d={`M${x} 17v${(y as number) - 17}`} stroke={c as string} strokeWidth="2.4" strokeLinecap="round" />
      ))}
      <path d="M10 26c2 3 8 3 10 0" stroke="#e85d8a" strokeWidth="1.6" fill="none" />
    </ArtSvg>
  )
}

/** Decoration while the fest is running (everyone sees it). */
export const FestDecor = memo(function FestDecor({ fest }: { fest: FestId }) {
  switch (fest) {
    case 'laternenfest':
      return (
        <div className="fest-layer-map fest-lantern-night">
          <D left="43%" top="50%" w={7}><Laterne /></D>
          <D left="57%" top="62%" w={7}><Laterne hue={P.red} /></D>
          <D left="42%" top="76%" w={7}><Laterne hue={P.waterLight} /></D>
          <D left="56%" top="38%" w={7}><Laterne hue={P.yellow} /></D>
          <D left="8%" top="56%" w={7}><Laterne /></D>
          <D left="92%" top="50%" w={7}><Laterne hue={P.lilac} /></D>
        </div>
      )
    case 'advent':
      return (
        <div className="fest-layer-map fest-frost">
          <D left="8%" top="49%" w={13}><Tanne /></D>
          <D left="38%" top="31%" w={10}><Kranz /></D>
          <div className="fest-snow" />
        </div>
      )
    case 'raunaechte':
      return (
        <div className="fest-layer-map fest-frost">
          {[[12, 20], [30, 16], [70, 18], [88, 22], [52, 14]].map(([x, y], i) => (
            <D key={i} left={`${x}%`} top={`${y}%`} w={3.4}><Stern /></D>
          ))}
          <D left="91%" top="48%" w={11}><Tanne lights={false} /></D>
        </div>
      )
    case 'lichtmess':
      return (
        <div className="fest-layer-map">
          <D left="8%" top="52%" w={9}><Schneegloeckchen /></D>
          <D left="90%" top="44%" w={9}><Schneegloeckchen /></D>
          <D left="46%" top="64%" w={7}><Schneegloeckchen /></D>
        </div>
      )
    case 'fruehlingsfest':
      return (
        <div className="fest-layer-map">
          <D left="9%" top="54%" w={4.2}><Ei /></D>
          <D left="44%" top="70%" w={3.8}><Ei c={P.yellow} s={P.red} /></D>
          <D left="56%" top="47%" w={3.8}><Ei c={P.leafLight} /></D>
          <D left="91%" top="44%" w={4.2}><Ei c={P.waterLight} s={P.pink} /></D>
          <D left="56%" top="80%" w={3.6}><Ei c={P.lilac} /></D>
          <D left="8%" top="63%" w={12}><Tulpen /></D>
        </div>
      )
    case 'bluetenfest':
      return (
        <div className="fest-layer-map">
          <D left="8%" top="53%" w={11}><Pfingstrose /></D>
          <D left="90%" top="43%" w={10}><Pfingstrose /></D>
          <div className="ambient-particles p-petal skin-petals" />
        </div>
      )
    case 'sommerfest':
      return (
        <div className="fest-layer-map">
          <div className="fest-bunting"><Wimpelkette /></div>
          <D left="90%" top="50%" w={10}><Sonnenschirm /></D>
        </div>
      )
    case 'sonnenblumen':
      return (
        <div className="fest-layer-map">
          {[6, 12, 88, 94].map((x, i) => (
            <D key={x} left={`${x}%`} top={`${88 - (i % 2) * 3}%`} w={5}><Sonnenblume /></D>
          ))}
        </div>
      )
    case 'erntedank':
      return (
        <div className="fest-layer-map">
          <D left="39%" top="31%" w={7}><Kuerbis /></D>
          <D left="61%" top="31.5%" w={5.5}><Kuerbis c={P.gold} /></D>
          <D left="9%" top="53%" w={8}><Garbe /></D>
          <D left="56%" top="73%" w={6}><Kuerbis c="#d2752c" /></D>
          <D left="91%" top="52%" w={7}><Kuerbis /></D>
          <D left="44%" top="57%" w={5}><Kuerbis c={P.gold} /></D>
        </div>
      )
  }
})

/** Fest-Gartenstil → permanent decoration (kept compact, no duplicates). */
export const FestSkinDecor = memo(function FestSkinDecor({ skin, fest }: { skin?: string; fest: FestId }) {
  if (skin === 'skin-festFruehling' && fest !== 'fruehlingsfest') {
    return (
      <div className="fest-layer-map">
        <D left="8%" top="63%" w={12}><Tulpen /></D>
        <D left="9%" top="54%" w={4}><Ei c={P.waterLight} /></D>
      </div>
    )
  }
  if (skin === 'skin-festSommer' && fest !== 'sommerfest') {
    return (
      <div className="fest-layer-map">
        <div className="fest-bunting"><Wimpelkette /></div>
      </div>
    )
  }
  if (skin === 'skin-festErntedank') {
    return (
      <div className="fest-layer-map">
        <D left="50%" top="20%" w={6}><Erntekrone /></D>
        {fest !== 'erntedank' ? <D left="39%" top="31%" w={7}><Kuerbis /></D> : null}
      </div>
    )
  }
  if (skin === 'skin-festAdvent' && fest !== 'advent') {
    return (
      <div className="fest-layer-map fest-frost">
        <D left="8%" top="49%" w={13}><Tanne /></D>
      </div>
    )
  }
  return null
})
