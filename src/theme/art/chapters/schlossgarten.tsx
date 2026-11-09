/** Kapitel-Grafik Kapitel 15: Schlossgarten. */
import type { ReactNode } from 'react'
import { Roof, Svg, Window } from '../../HandParts'
import { Bunting, Snowcap } from './partsA'
import { CitrusPot, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Ground, Person } from './partsB'
import { BoxBall, BrickWall } from './partsC'

/** Linde in Kastenform. */
function Linden({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const c = season === 'winter' ? null : season === 'autumn' ? P.gold : P.leaf
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-1 0V-14M1 0V-14" stroke={P.bark} strokeWidth="1.2" />
      {c ? (
        <g>
          <rect x="-6" y="-26" width="12" height="13" rx="4" fill={c} stroke={P.outline} strokeWidth=".4" />
          <rect x="-4.6" y="-25" width="5" height="5" rx="2" fill={season === 'autumn' ? P.yellow : P.leafLight} opacity=".7" />
        </g>
      ) : (
        <path d="M0 -14l-4 -8M0 -14l4 -9M0 -16v-9" stroke={P.bark} strokeWidth=".6" />
      )}
    </g>
  )
}

function Swan({ x, y }: { x: number; y: number }) {
  return (
    <g className="ha-swim">
      <ellipse cx={x} cy={y} rx="3.4" ry="1.6" fill={P.white} stroke={P.stoneLight} strokeWidth=".3" />
      <path d={`M${x + 2.4} ${y - 0.4} q1.6 -1.6 .4 -4.6`} stroke={P.white} strokeWidth="1" fill="none" />
      <path d={`M${x + 2.8} ${y - 5}l1.4 .6-1.4 .4z`} fill={P.orange} />
    </g>
  )
}

export function Schlossgarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const summer = season === 'summer'
  const bloom = spring || summer
  switch (id) {
    case 'parterre': {
      const curls = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="12" fill={P.stoneLight} />
          {Array.from({ length: curls }, (_, i) => {
            const cx = [40, 22, 58, 40][i]!
            const cy = [56, 54, 54, 62][i]!
            return (
              <g key={i}>
                <path
                  d={`M${cx - 10} ${cy} q5 -6 10 0 q5 6 10 0 M${cx - 6} ${cy} a3 2 0 1 1 3 2 M${cx + 6} ${cy} a3 2 0 1 0 -3 -2`}
                  stroke={P.leafDark}
                  strokeWidth="1.6"
                  fill="none"
                  strokeLinecap="round"
                />
                {winter ? <path d={`M${cx - 10} ${cy - 1} q5 -6 10 0 q5 6 10 0`} stroke={P.white} strokeWidth=".7" fill="none" /> : null}
                {bloom && tier >= 3 ? <circle cx={cx} cy={cy} r="1.2" fill={i % 2 ? P.red : P.lilac} /> : null}
              </g>
            )
          })}
          {tier >= 2 ? <BoxBall x={8} y={58} winter={winter} /> : null}
          {tier >= 2 ? <BoxBall x={72} y={58} winter={winter} /> : null}
          {tier >= 5 ? <path d="M40 46v-12l1.6-1.6 1.6 1.6v12z" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" /> : null}
        </Svg>
      )
    }
    case 'spargelbeete': {
      const ridges = Math.min(4, 1 + Math.floor(tier / 1.4))
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {Array.from({ length: ridges }, (_, r) => {
            const y = 50 + r * 5
            return (
              <g key={r}>
                <path d={`M10 ${y + 2} Q40 ${y - 4} 70 ${y + 2}z`} fill={winter ? P.cream : P.soil} stroke={P.soilDark} strokeWidth=".4" />
                {spring
                  ? Array.from({ length: 6 }, (_, k) => {
                      const x = 16 + k * 9 + (r % 2) * 3
                      return <path key={k} d={`M${x} ${y - 1}v-${2 + tier * 0.5}`} stroke={P.cream} strokeWidth="1.4" strokeLinecap="round" />
                    })
                  : summer || season === 'autumn'
                    ? Array.from({ length: 4 }, (_, k) => {
                        const x = 18 + k * 13 + (r % 2) * 4
                        return <path key={k} d={`M${x} ${y - 1}q-2 -6 0 -12M${x} ${y - 6}l-3 -3M${x} ${y - 8}l3 -3`} stroke={season === 'autumn' ? P.gold : P.leafPale} strokeWidth=".8" fill="none" />
                      })
                    : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M66 66h10l-1-5h-8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
              {spring ? [68, 70, 72].map((x) => <path key={x} d={`M${x} 61v-4`} stroke={P.cream} strokeWidth="1.2" />) : null}
            </g>
          ) : null}
          {tier >= 4 ? <Person x={8} y={66} c={P.leafDark} /> : null}
          {tier >= 5 ? <path d="M18 66l2-8" stroke={P.metal} strokeWidth="1" /> : null}
        </Svg>
      )
    }
    case 'kanalallee': {
      const trees = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <path d="M0 58 Q40 54 80 58 V66 Q40 62 0 66z" fill={winter ? P.glass : P.water} />
          <path d="M6 60h14M40 59h12" stroke={P.white} strokeWidth=".5" opacity=".6" />
          {Array.from({ length: trees }, (_, i) => (
            <Linden key={i} x={10 + i * 15} y={54} s={0.9 + (i % 2) * 0.06} season={season} />
          ))}
          <path d="M0 54h80" stroke={P.stoneLight} strokeWidth="1.4" />
          {tier >= 3 && !winter ? <Swan x={30} y={62} /> : null}
          {tier >= 5 && !winter ? <Swan x={54} y={63} /> : null}
          {tier >= 4 ? <Person x={46} y={53} c={P.lilac} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'heckentheater': {
      const wings = Math.min(3, Math.ceil(tier / 1.6))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="34" ry="9" fill={P.stoneLight} />
          <rect x="22" y="48" width="36" height="6" fill={P.leafLight} />
          {Array.from({ length: wings }, (_, i) => (
            <g key={i}>
              <rect x={14 - i * 4} y={30 + i * 4} width="8" height={20 - i * 2} rx="1.4" fill={winter ? P.winterLeaf : P.leafDark} stroke={P.outline} strokeWidth=".4" />
              <rect x={58 + i * 4} y={30 + i * 4} width="8" height={20 - i * 2} rx="1.4" fill={winter ? P.winterLeaf : P.leafDark} stroke={P.outline} strokeWidth=".4" />
            </g>
          ))}
          <path d="M22 28 Q40 18 58 28V48H22z" fill={winter ? P.winterLeafDark : P.leafMoss} opacity=".9" />
          {tier >= 3 ? <Person x={36} y={50} c={P.red} s={0.9} /> : null}
          {tier >= 3 ? <Person x={44} y={50} c={P.yellow} s={0.9} /> : null}
          {tier >= 4 ? [24, 32, 40, 48, 56].map((x) => <path key={x} d={`M${x - 3} 64h6`} stroke={P.woodMid} strokeWidth="1.6" />) : null}
          {tier >= 5 ? <Person x={30} y={66} c={P.blue} s={0.7} /> : null}
          {tier >= 5 ? <Person x={50} y={66} c={P.leaf} s={0.7} /> : null}
          {winter ? <Snowcap d="M24 27 Q40 19 56 27" /> : null}
        </Svg>
      )
    }
    case 'mauergarten': {
      const trees = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <BrickWall x={4} y={56} w={72} h={34} />
          {Array.from({ length: trees }, (_, i) => {
            const x = 14 + i * 18
            return (
              <g key={i}>
                <path d={`M${x} 56V30M${x} 36h-7M${x} 36h7M${x} 44h-7M${x} 44h7M${x} 52h-6M${x} 52h6`} stroke={P.bark} strokeWidth="1" />
                {!winter
                  ? [36, 44, 52].map((y) => (
                      <g key={y}>
                        <ellipse cx={x - 5} cy={y - 1} rx="2.4" ry="1.2" fill={P.leaf} />
                        <ellipse cx={x + 5} cy={y - 1} rx="2.4" ry="1.2" fill={P.leaf} />
                        {season === 'autumn' || summer ? <ellipse cx={x + 3} cy={y + 1} rx="1" ry="1.4" fill={P.leafPale} stroke={P.gold} strokeWidth=".3" /> : null}
                      </g>
                    ))
                  : null}
                {spring ? <circle cx={x - 3} cy={34} r="1" fill={P.white} /> : null}
              </g>
            )
          })}
          <rect x="4" y="56" width="72" height="10" fill={winter ? P.cream : P.soil} />
          {tier >= 3 && !winter ? [12, 22, 32, 42, 52, 62].map((x) => <ellipse key={x} cx={x} cy={60} rx="2.6" ry="1.6" fill={P.leafPale} />) : null}
          {tier >= 5 ? <Person x={70} y={66} c={P.denim} /> : null}
          {winter ? <Snowcap d="M4 22h72" /> : null}
        </Svg>
      )
    }
    case 'kuebelhalle': {
      const pots = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={36} />
          <rect x="6" y="28" width="68" height="36" fill={P.cream} stroke={P.outlineStone} strokeWidth=".6" />
          {Array.from({ length: 5 }, (_, i) => (
            <path key={i} d={`M${10 + i * 13} 64V38a5 5 0 0 1 10 0V64`} fill={P.glass} stroke={P.stone} strokeWidth=".6" opacity=".9" />
          ))}
          <path d="M4 28h72" stroke={P.stone} strokeWidth="2" />
          {tier >= 2 ? <path d="M30 28 Q40 18 50 28" fill={P.cream} stroke={P.stone} strokeWidth=".6" /> : null}
          {Array.from({ length: pots }, (_, i) => {
            const x = winter ? 15 + i * 13 : 12 + i * 14
            return winter ? (
              <g key={i} opacity=".85">
                <CitrusPot x={x} y={62} s={0.4} />
              </g>
            ) : (
              <CitrusPot key={i} x={x} y={68} s={0.48} fruit={i % 2 ? P.orange : P.yellow} />
            )
          })}
          {tier >= 5 ? <Person x={74} y={68} c={P.leafDark} s={0.8} /> : null}
          {winter ? <Snowcap d="M4 27h72" /> : null}
        </Svg>
      )
    }
    case 'wasserachse': {
      const steps = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="30" ry="7" fill={P.stone} />
          <ellipse cx="40" cy="59.4" rx="27" ry="5.6" fill={winter ? P.glass : P.water} />
          {Array.from({ length: steps }, (_, i) => (
            <g key={i}>
              <rect x={34 - i} y={50 - i * 6} width={12 + i * 2} height="4" fill={P.stoneLight} stroke={P.outlineStone} strokeWidth=".4" />
              {!winter ? <path d={`M${35 - i} ${54 - i * 6}h${10 + i * 2}v2h-${10 + i * 2}z`} fill={P.waterLight} opacity=".8" /> : null}
            </g>
          ))}
          {tier >= 3 && !winter ? <path d="M40 58 Q40 40 40 40M40 42 Q36 48 35 56M40 42 Q44 48 45 56" stroke={P.glassEdge} strokeWidth="1.2" fill="none" className="fest-glow" /> : null}
          {tier >= 4 ? <BoxBall x={10} y={62} winter={winter} /> : null}
          {tier >= 4 ? <BoxBall x={70} y={62} winter={winter} /> : null}
          {tier >= 5 && !winter ? <Swan x={24} y={61} /> : null}
        </Svg>
      )
    }
    case 'bosquet': {
      const trees = Math.min(6, 2 + tier)
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          {Array.from({ length: trees }, (_, i) => {
            const x = [12, 68, 20, 60, 8, 72][i]!
            const y = [50, 50, 58, 58, 62, 62][i]!
            return <Linden key={i} x={x} y={y} s={0.8} season={season} />
          })}
          {tier >= 2 ? (
            <g>
              <ellipse cx="40" cy="62" rx="12" ry="2.6" fill={P.stoneLight} />
              {[32, 37, 43, 48].map((x) => <path key={x} d={`M${x} 62V46`} stroke={P.cream} strokeWidth="1.4" />)}
              <path d="M28 46 Q40 28 52 46z" fill={tier >= 3 ? P.leafDark : P.stone} stroke={P.outline} strokeWidth=".4" />
              {tier >= 3 ? <circle cx="40" cy="33" r="1.4" fill={P.gold} /> : null}
            </g>
          ) : null}
          {tier >= 4 ? <Person x={40} y={62} c={P.pink} s={0.8} /> : null}
          {winter && tier >= 2 ? <Snowcap d="M30 44 Q40 30 50 44" /> : null}
        </Svg>
      )
    }
    case 'schlossgaertnerei':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="8" y="40" width="40" height="24" fill={P.glass} stroke={P.stone} strokeWidth=".7" opacity=".85" />
          <path d="M6 40 L28 28 L50 40z" fill={P.glassEdge} stroke={P.stone} strokeWidth=".7" />
          {[16, 24, 32, 40].map((x) => <path key={x} d={`M${x} 40v24`} stroke={P.white} strokeWidth=".6" />)}
          {Array.from({ length: Math.min(4, tier) }, (_, r) => (
            <g key={r}>
              {Array.from({ length: 6 }, (_, k) => (
                <circle key={k} cx={12 + k * 6} cy={60 - r * 4} r="1.4" fill={winter ? P.leafMoss : P.leafLight} />
              ))}
            </g>
          ))}
          {tier >= 2 ? <House2 /> : null}
          {tier >= 4 ? <Person x={66} y={66} c={P.leafDark} /> : null}
          {tier >= 5 ? [54, 58, 62].map((x) => <path key={x} d={`M${x - 1.6} 66h3.2l-.4 -3h-2.4z`} fill={P.terracotta} />) : null}
          {winter ? <Snowcap d="M8 39L28 29L48 39" /> : null}
        </Svg>
      )
    case 'sommerkonzert': {
      const crowd = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Ground color={P.leafLight} winter={winter} />
          <path d="M20 46 Q40 18 60 46z" fill={P.cream} stroke={P.stone} strokeWidth=".6" />
          <path d="M26 46 Q40 26 54 46" stroke={P.stoneLight} strokeWidth="1" fill="none" />
          <rect x="18" y="46" width="44" height="3" fill={P.wood} />
          {tier >= 2 ? [30, 38, 46].map((x, i) => <Person key={x} x={x} y={46} c={P.charcoal} s={0.7 + (i % 2) * 0.05} />) : null}
          {tier >= 3 ? <path d="M52 44l3-6" stroke={P.brass} strokeWidth="1" /> : null}
          {Array.from({ length: crowd }, (_, i) => (
            <g key={i}>
              {i % 2 === 0 ? <rect x={8 + i * 11} y={63} width="9" height="3" fill={[P.red, P.blue, P.yellow][i % 3]} opacity=".85" /> : null}
              <Person x={12 + i * 11} y={65} c={[P.leaf, P.lilac, P.orange, P.denim, P.pink, P.tomato][i]!} s={0.75} />
            </g>
          ))}
          {tier >= 5 ? <Bunting y={10} n={9} x0={8} x1={72} /> : null}
        </Svg>
      )
    }
  }
  return null
}

/** Gärtnerhaus neben dem Glashaus. */
function House2() {
  return (
    <g>
      <rect x="52" y="44" width="22" height="20" fill={P.paper} stroke={P.outlineWood} strokeWidth=".6" />
      <Roof x={52} w={22} y={44} color={P.terracotta} steep={9} />
      <Window x={56} y={50} />
      <path d="M66 64v-8h5v8z" fill={P.woodDark} />
    </g>
  )
}
