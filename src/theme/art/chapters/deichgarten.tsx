/** Kapitel-Grafik Kapitel 18: Deichgarten an der Nordsee. */
import type { ReactNode } from 'react'
import { Smoke, Svg } from '../../HandParts'
import { Snowcap } from './partsA'
import { Lantern, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { Fire, Sheep, ThatchHouse, WaterBand } from './partsD'

/** Sandiger Dünenboden. */
function Dune({ winter, cy = 60 }: { winter?: boolean; cy?: number }) {
  return (
    <g>
      <ellipse cx="40" cy={cy} rx="36" ry="10" fill={winter ? P.frost : P.paper} />
      <ellipse cx="30" cy={cy - 3} rx="16" ry="3" fill={winter ? P.white : P.canvas} opacity=".7" />
    </g>
  )
}

/** Strandhafer-Büschel. */
function Marram({ x, y, winter }: { x: number; y: number; winter?: boolean }) {
  return <path d={`M${x} ${y}q-1 -4 -3 -6M${x} ${y}q0 -5 1 -7M${x} ${y}q1 -3 4 -5`} stroke={winter ? P.winterLeafLight : P.leafMoss} strokeWidth=".6" fill="none" />
}

/** Sanddornstrauch: silbrige Blätter, orange Beeren (bleiben bis in den Winter). */
function Buckthorn({ x, y, s = 1, season }: { x: number; y: number; s?: number; season?: string }) {
  const winter = season === 'winter'
  const berries = season === 'autumn' ? 22 : winter ? 14 : season === 'summer' ? 10 : 0
  const h = 20 * s
  const arms = [-0.55, -0.25, 0.05, 0.3, 0.55]
  return (
    <g>
      {!winter ? <ellipse cx={x} cy={y - h * 0.6} rx={9 * s} ry={h * 0.48} fill={season === 'autumn' ? P.winterLeaf : P.winterLeafLight} stroke={P.winterLeafDark} strokeWidth=".3" opacity=".9" /> : null}
      {arms.map((d, i) => (
        <path key={i} d={`M${x} ${y}Q${x + d * 6 * s} ${y - h * 0.6} ${x + d * 14 * s} ${y - h + (i % 2) * 2}`} stroke={P.bark} strokeWidth={0.8 * s} fill="none" />
      ))}
      {!winter
        ? Array.from({ length: 22 }, (_, i) => {
            const t = 0.3 + ((i * 7) % 11) / 16
            const d = arms[i % 5]!
            const cx = x + d * 14 * s * t + (i % 2 ? 1.4 : -1.4)
            const cy = y - h * t
            return <ellipse key={i} cx={cx} cy={cy} rx={2 * s} ry={0.5 * s} fill={i % 3 ? P.stoneLight : P.winterLeaf} transform={`rotate(${i % 2 ? -30 : 30} ${cx} ${cy})`} />
          })
        : null}
      {Array.from({ length: berries }, (_, i) => {
        const t = 0.25 + ((i * 5) % 11) / 16
        const d = arms[i % 5]!
        return <circle key={`b${i}`} cx={x + d * 14 * s * t + (i % 3) * 0.9 - 0.9} cy={y - h * t + (i % 2) * 0.8} r={0.95 * s} fill={P.orange} stroke={P.autumnDark} strokeWidth=".2" />
      })}
      {season === 'spring' ? [0, 1, 2, 3].map((i) => <circle key={`f${i}`} cx={x - 4 + i * 3} cy={y - h * (0.5 + (i % 2) * 0.2)} r=".6" fill={P.yellow} />) : null}
    </g>
  )
}

/** Möwe im Flug. */
function Gull({ x, y }: { x: number; y: number }) {
  return <path className="ha-swim" d={`M${x - 4} ${y}q2 -2.4 4 0q2 -2.4 4 0`} stroke={P.charcoal} strokeWidth=".7" fill="none" />
}

/** Strandrosen-Busch (Rosa rugosa). */
function BeachRose({ x, y, season }: { x: number; y: number; season?: string }) {
  const winter = season === 'winter'
  const leaf = winter ? null : season === 'autumn' ? P.gold : P.leafDark
  return (
    <g>
      {leaf ? (
        <g>
          <ellipse cx={x} cy={y - 4} rx="7" ry="5" fill={leaf} stroke={P.outline} strokeWidth=".3" />
          <ellipse cx={x - 2} cy={y - 6} rx="3" ry="1.6" fill={season === 'autumn' ? P.yellow : P.leaf} opacity=".7" />
        </g>
      ) : (
        <path d={`M${x} ${y}l-5 -6M${x} ${y}l0 -8M${x} ${y}l5 -6`} stroke={P.woodDark} strokeWidth=".7" />
      )}
      {season === 'summer' || season === 'spring'
        ? [-4, 0, 3.6].map((dx, i) => (
            <g key={i}>
              <circle cx={x + dx} cy={y - 5 - (i % 2) * 2} r="1.7" fill={P.pink} stroke={P.berry} strokeWidth=".2" />
              <circle cx={x + dx} cy={y - 5 - (i % 2) * 2} r=".5" fill={P.yellow} />
            </g>
          ))
        : null}
      {season === 'autumn' || winter || season === 'summer'
        ? [-2.4, 2, 5].map((dx, i) => <ellipse key={`h${i}`} cx={x + dx} cy={y - 2.6 - (i % 2) * 3} rx="1.2" ry="1.4" fill={P.tomato} stroke={P.autumnDark} strokeWidth=".2" />)
        : null}
    </g>
  )
}

/** Austernfischer (schwarz-weiß, roter Schnabel). */
function Oystercatcher({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-1 0v1.6M1 0v1.6" stroke={P.pink} strokeWidth=".5" />
      <ellipse cx="0" cy="-1.4" rx="2.6" ry="1.6" fill={P.white} />
      <path d="M-2.6 -1.6Q0 -4 2.4 -2.4L2 -1z" fill={P.ink} />
      <circle cx="2.4" cy="-3" r="1" fill={P.ink} />
      <path d="M3.2 -3l2.2 .4" stroke={P.orange} strokeWidth=".6" />
    </g>
  )
}

/** Deich-Böschung im Hintergrund. */
function DikeBank({ winter, y = 34 }: { winter?: boolean; y?: number }) {
  return (
    <g>
      <path d={`M0 ${y + 10}Q20 ${y} 40 ${y}T80 ${y + 10}V${y + 16}H0z`} fill={winter ? P.frost : P.leaf} />
      <path d={`M0 ${y + 10}Q20 ${y} 40 ${y}T80 ${y + 10}`} stroke={winter ? P.white : P.leafPale} strokeWidth="1" fill="none" />
    </g>
  )
}

export function Deichgarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'sanddorn': {
      const n = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Dune winter={winter} />
          {Array.from({ length: n }, (_, i) => (
            <Buckthorn key={i} x={[42, 22, 60, 30][i]!} y={[62, 58, 58, 66][i]!} s={[1.15, 0.95, 0.95, 0.8][i]!} season={season} />
          ))}
          <Marram x={12} y={64} winter={winter} />
          {tier >= 2 ? <Marram x={30} y={66} winter={winter} /> : null}
          {tier >= 3 ? <path d="M48 66h10l-1 -4h-8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 ? [50, 53, 56].map((x) => <circle key={x} cx={x} cy={61.6} r="1" fill={P.orange} />) : null}
          {tier >= 4 ? <Person x={72} y={68} c={P.denim} s={0.8} /> : null}
          {tier >= 5 ? <Gull x={20} y={22} /> : null}
          {tier >= 5 ? <Gull x={30} y={18} /> : null}
        </Svg>
      )
    }
    case 'salzwiese': {
      const tufts = Math.min(18, 4 + tier * 3)
      const marsh = winter ? P.frost : autumn ? P.winterLeafLight : P.leafLight
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="37" ry="11" fill={marsh} />
          <path d="M4 62Q20 56 34 60T60 56T78 52" stroke={winter ? P.glass : P.water} strokeWidth="2.6" fill="none" />
          {tier >= 3 ? <path d="M18 50v14M30 50v14M50 48v14M62 48v14" stroke={winter ? P.glass : P.waterDeep} strokeWidth=".8" opacity=".6" /> : null}
          {Array.from({ length: tufts }, (_, i) => {
            const x = 8 + ((i * 23) % 64)
            const y = 52 + ((i * 11) % 13)
            const c = autumn ? P.berry : winter ? P.winterLeaf : P.leafMoss
            return <path key={i} d={`M${x} ${y}v-3M${x} ${y - 1.6}l-1 -1M${x} ${y - 2}l1 -1`} stroke={c} strokeWidth=".7" />
          })}
          {season === 'summer' ? Array.from({ length: tufts }, (_, i) => <circle key={`l${i}`} cx={10 + ((i * 17) % 60)} cy={50 + ((i * 7) % 14)} r=".9" fill={P.lilac} />) : null}
          {tier >= 4 ? <Sheep x={58} y={50} s={0.8} /> : null}
          {tier >= 4 ? <Sheep x={66} y={54} s={0.7} flip /> : null}
          {tier >= 2 ? <Oystercatcher x={24} y={50} /> : null}
          {tier >= 5 ? <Oystercatcher x={44} y={64} /> : null}
        </Svg>
      )
    }
    case 'koogacker': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <DikeBank winter={winter} y={26} />
          {tier >= 3 ? [0, 1, 2].map((i) => <Sheep key={i} x={24 + i * 16} y={33 + (i % 2) * 2} s={0.5} flip={i === 1} />) : null}
          <rect x="4" y="42" width="72" height="24" rx="4" fill={winter ? P.frost : P.soil} />
          {Array.from({ length: rows }, (_, r) => {
            const y = 46 + r * 4.4
            return (
              <g key={r}>
                <path d={`M6 ${y + 1}H74`} stroke={winter ? P.white : P.soilDark} strokeWidth="1.6" strokeLinecap="round" />
                {!winter
                  ? Array.from({ length: 8 }, (_, k) => {
                      const x = 10 + k * 8.4 + (r % 2) * 3
                      if (spring) return <path key={k} d={`M${x} ${y}l-1 -1.6M${x} ${y}l1 -1.6`} stroke={P.leaf} strokeWidth=".6" />
                      return (
                        <g key={k}>
                          <ellipse cx={x} cy={y - 1} rx="2.6" ry="1.6" fill={autumn ? P.gold : P.leaf} stroke={P.leafDark} strokeWidth=".2" />
                          {season === 'summer' && k % 2 ? <circle cx={x} cy={y - 2.4} r=".5" fill={P.cream} /> : null}
                        </g>
                      )
                    })
                  : null}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M60 68h12l-1 -4h-10z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 ? [62, 65, 68].map((x) => <ellipse key={x} cx={x} cy={63.4} rx="1.4" ry="1" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".2" />) : null}
          {tier >= 4 ? <Person x={14} y={68} c={P.tomato} s={0.8} /> : null}
          {tier >= 5 ? <path d="M12 60l6 -10" stroke={P.woodDark} strokeWidth=".7" /> : null}
        </Svg>
      )
    }
    case 'windschutz': {
      const n = Math.min(6, 1 + tier)
      const seg = 10.6
      const x0 = 10
      const x1 = x0 + n * seg
      const top = (x: number) => 50 - ((x - x0) / 64) * 10
      let d = `M${x0} 58`
      for (let i = 0; i <= n * 2; i++) {
        const x = x0 + (i * seg) / 2
        d += `L${x} ${top(x) - (i % 2 ? 2 : 0)}`
      }
      d += `L${x1 + 3} ${top(x1) + 4}L${x1} 58z`
      const crown = winter ? P.winterLeafDark : autumn ? P.autumn : P.leafDark
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="9" fill={winter ? P.frost : P.leafLight} />
          {Array.from({ length: n + 1 }, (_, i) => (
            <path key={`t${i}`} d={`M${x0 + 2 + i * seg * 0.95} 62v-6`} stroke={P.bark} strokeWidth="1.2" />
          ))}
          <path d={d} fill={crown} stroke={P.outline} strokeWidth=".4" opacity={winter ? 0.55 : 1} />
          <path d={`M${x0 + 2} 54Q${(x0 + x1) / 2} ${top((x0 + x1) / 2) + 4} ${x1 - 2} ${top(x1) + 6}`} stroke={winter ? P.bark : P.leaf} strokeWidth={winter ? 0.5 : 1.4} fill="none" opacity=".8" />
          {spring ? Array.from({ length: n * 3 }, (_, i) => <circle key={`f${i}`} cx={x0 + 3 + ((i * 7) % (n * seg - 4))} cy={top(x0 + 3 + ((i * 7) % (n * seg - 4))) + 2 + (i % 3) * 2} r=".9" fill={P.white} />) : null}
          {autumn ? Array.from({ length: n * 2 }, (_, i) => <circle key={`h${i}`} cx={x0 + 4 + ((i * 9) % (n * seg - 6))} cy={top(x0 + 4 + ((i * 9) % (n * seg - 6))) + 4 + (i % 2) * 2} r=".9" fill={P.berry} />) : null}
          {!winter ? <path d="M66 28q6 -1 12 0M60 22q8 -1 16 0" stroke={P.white} strokeWidth=".6" fill="none" opacity=".8" /> : null}
          {tier >= 3 ? [22, 34, 46, 58].map((x) => <ellipse key={x} cx={x} cy={66} rx="2.2" ry="1.3" fill={winter ? P.white : P.leafPale} stroke={P.leafDark} strokeWidth=".2" />) : null}
          {tier >= 4 ? <path d="M66 67v-4h8v4M65 63h10" stroke={P.woodDark} strokeWidth=".9" fill="none" /> : null}
          {tier >= 5 ? <Person x={70} y={62} c={P.yellow} s={0.6} /> : null}
          {winter ? <Snowcap d={`M${x0 + 1} ${top(x0) - 1}L${x1} ${top(x1) - 1}`} /> : null}
        </Svg>
      )
    }
    case 'strandrosen': {
      const n = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Dune winter={winter} />
          {Array.from({ length: n }, (_, i) => (
            <BeachRose key={i} x={[40, 22, 58, 30, 66][i]!} y={[62, 58, 58, 66, 66][i]!} season={season} />
          ))}
          <Marram x={10} y={62} winter={winter} />
          <Marram x={72} y={58} winter={winter} />
          {tier >= 3 ? <path d="M4 66Q40 56 76 66" stroke={P.woodLight} strokeWidth="1.2" strokeDasharray="2 1" fill="none" /> : null}
          {tier >= 4 ? <Person x={50} y={70} c={P.lilac} s={0.7} /> : null}
          {tier >= 5 ? <Oystercatcher x={70} y={50} /> : null}
        </Svg>
      )
    }
    case 'kuttersteg': {
      const planks = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <WaterBand y={56} h={20} frozen={winter} />
          {winter ? [20, 52].map((x) => <ellipse key={x} cx={x} cy={58} rx="5" ry="1.4" fill={P.white} />) : null}
          <rect x="0" y="62" width={10 + planks * 6} height="3" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: planks + 1 }, (_, i) => (
            <path key={i} d={`M${4 + i * 6} 65v4`} stroke={P.woodDark} strokeWidth="1" />
          ))}
          {tier >= 2 ? (
            <g className="ha-swim">
              <path d="M38 52h34l-4 6H42z" fill={P.denim} stroke={P.outline} strokeWidth=".5" />
              <path d="M40 53h30" stroke={P.white} strokeWidth=".6" />
              <rect x="52" y="44" width="8" height="8" fill={P.cream} stroke={P.outline} strokeWidth=".4" />
              <rect x="54" y="46" width="4" height="2" fill={P.waterLight} />
              <path d="M56 44V30M56 34L42 24M56 34L70 24" stroke={P.metal} strokeWidth=".7" />
              {tier >= 3 ? <path d="M42 24l-2 10M70 24l2 10" stroke={P.stoneDark} strokeWidth=".5" strokeDasharray="1 .6" /> : null}
              {tier >= 3 ? <path d="M38 34q2 3 4 0M70 34q2 3 4 0" stroke={P.stoneDark} strokeWidth=".6" fill="none" /> : null}
            </g>
          ) : null}
          {tier >= 4 ? [8, 14].map((x) => <rect key={x} x={x} y="58" width="5" height="4" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".3" />) : null}
          {tier >= 4 ? [9.4, 11, 15.4].map((x) => <circle key={x} cx={x} cy={57.8} r=".7" fill={P.pink} />) : null}
          {tier >= 5 ? <path d="M24 18l3 -1.6 3 1.6M32 22l2.4 -1.2 2.4 1.2" stroke={P.charcoal} strokeWidth=".6" fill="none" className="ha-swim" /> : null}
          {tier >= 5 ? <Person x={26} y={62} c={P.denim} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'reetkate':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <ThatchHouse x={18} y={64} w={40} h={16} winter={winter} lit={winter || tier >= 4} />
          {tier >= 2 ? <rect x="48" y="30" width="4" height="8" fill={P.terracotta} stroke={P.outlineWood} strokeWidth=".3" /> : null}
          {tier >= 2 ? <Smoke x={50} y={28} /> : null}
          {tier >= 3 && !winter ? [21, 25, 52, 56].map((x, i) => <circle key={x} cx={x} cy={58 - (i % 2) * 2} r="1.4" fill={spring ? P.blossom : autumn ? P.tomato : P.pink} />) : null}
          {tier >= 3 ? [21, 25, 52, 56].map((x) => <path key={`s${x}`} d={`M${x} 64v-5`} stroke={P.leafDark} strokeWidth=".6" />) : null}
          {tier >= 4 ? <path d="M2 66h14M4 66v-6M10 66v-6M2 62h14M62 66h16M64 66v-6M70 66v-6M76 66v-6M62 62h16" stroke={P.white} strokeWidth=".9" /> : null}
          {tier >= 5 ? <Person x={68} y={60} c={P.denim} s={0.7} /> : null}
        </Svg>
      )
    case 'friesenstube': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <rect x="6" y="14" width="68" height="50" fill={P.cream} stroke={P.outlineWood} strokeWidth=".5" />
          {Array.from({ length: rows }, (_, r) =>
            Array.from({ length: 11 }, (_, k) => (
              <g key={`${r}-${k}`}>
                <rect x={8 + k * 6} y={56 - r * 6} width="5.4" height="5.4" fill={P.white} stroke={P.denim} strokeWidth=".3" />
                <circle cx={10.7 + k * 6} cy={58.7 - r * 6} r="1.2" fill="none" stroke={P.blue} strokeWidth=".5" />
              </g>
            )),
          )}
          <rect x="54" y="18" width="14" height="12" fill={winter ? P.glass : spring ? P.blossom : P.waterLight} stroke={P.woodDark} strokeWidth="1" />
          <path d="M61 18v12M54 24h14" stroke={P.woodDark} strokeWidth=".6" />
          {winter ? <path d="M55 29h12" stroke={P.white} strokeWidth="1.4" /> : null}
          <rect x="20" y="58" width="36" height="3" fill={P.woodDark} />
          <path d="M24 61v5M52 61v5" stroke={P.woodDark} strokeWidth="1.2" />
          <ellipse cx="38" cy="56" rx="4" ry="3.2" fill={P.white} stroke={P.blue} strokeWidth=".5" />
          <path d="M42 55l3 -1.6M36 52.8h4" stroke={P.blue} strokeWidth=".7" />
          {tier >= 2 ? [28, 47].map((x) => <path key={x} d={`M${x - 1.6} 55h3.2l-.4 3h-2.4z`} fill={P.white} stroke={P.blue} strokeWidth=".3" />) : null}
          {tier >= 3 ? <circle cx="16" cy="22" r="4" fill={P.paper} stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 3 ? <path d="M16 22v-2.6M16 22l2 1" stroke={P.ink} strokeWidth=".5" /> : null}
          {tier >= 4 ? <rect x="10" y="44" width="8" height="14" rx="1" fill={P.metal} stroke={P.outline} strokeWidth=".4" /> : null}
          {tier >= 4 ? <rect x="12" y="50" width="4" height="3" fill={P.amber} className="fest-glow" /> : null}
          {tier >= 5 ? <Person x={64} y={66} c={P.denim} s={0.8} /> : null}
        </Svg>
      )
    }
    case 'leuchtturm': {
      const beds = Math.min(4, tier)
      const bedFill = winter ? P.white : spring ? P.leafPale : autumn ? P.woodLight : P.leaf
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="60" rx="36" ry="9" fill={winter ? P.frost : P.leafLight} />
          <path d="M52 62L54 14H62L64 62z" fill={P.white} stroke={P.outline} strokeWidth=".5" />
          {[0, 1, 2].map((i) => (
            <path key={i} d={`M${52.4 + i * 0.4} ${54 - i * 15}L${53 + i * 0.4} ${46 - i * 15}H${63 - i * 0.4}L${63.6 - i * 0.4} ${54 - i * 15}z`} fill={P.barn} />
          ))}
          <rect x="53" y="8" width="10" height="6" fill={P.lamp} stroke={P.outline} strokeWidth=".5" className={tier >= 3 ? 'fest-glow' : undefined} />
          <path d="M52 8h12L58 3z" fill={P.barn} stroke={P.outline} strokeWidth=".4" />
          {tier >= 3 ? <path d="M53 11L30 6V16zM63 11L80 7V15z" fill={P.lamp} opacity=".35" /> : null}
          {Array.from({ length: beds }, (_, i) => {
            const x = 8 + (i % 2) * 22
            const y = 60 + Math.floor(i / 2) * -10 + 2
            return (
              <g key={i}>
                <rect x={x} y={y - 4} width="18" height="5" rx="1" fill={P.soil} stroke={P.outlineWood} strokeWidth=".3" />
                {[2, 6, 10, 14].map((dx) => (
                  <g key={dx}>
                    <path d={`M${x + dx} ${y - 3}v-6`} stroke={P.woodLight} strokeWidth=".4" />
                    <ellipse cx={x + dx} cy={y - 6} rx="1.4" ry="2.4" fill={bedFill} />
                  </g>
                ))}
              </g>
            )
          })}
          {tier >= 2 ? <path d="M4 66h44" stroke={P.stone} strokeWidth="2" /> : null}
          {tier >= 4 ? <path d="M66 64h10v-5l-10 -2z" fill={P.glass} stroke={P.woodDark} strokeWidth=".5" /> : null}
          {tier >= 5 ? <Person x={46} y={66} c={P.leafDark} s={0.7} /> : null}
          {winter ? <Snowcap d="M52 8h12" /> : null}
        </Svg>
      )
    }
    case 'biike': {
      const big = 1 + tier * 0.18
      const people = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <DikeBank winter={winter} y={40} />
          <path d={`M${40 - 9 * big} 60L40 ${60 - 14 * big}L${40 + 9 * big} 60z`} fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".4" />
          {Array.from({ length: 4 + tier }, (_, i) => (
            <path key={i} d={`M${40 - 8 * big + i * 2} 60l${3 - (i % 3) * 2} -${6 + (i % 4) * 2}`} stroke={P.bark} strokeWidth=".6" />
          ))}
          {winter || autumn ? <Fire x={40} y={58 - 4 * big} s={big} /> : null}
          {winter ? Array.from({ length: tier * 2 }, (_, i) => <circle key={i} cx={34 + ((i * 7) % 14)} cy={34 - ((i * 5) % 14)} r=".6" fill={P.amber} className="fest-glow" />) : null}
          {tier >= 2 ? <path d="M40 60V30" stroke={P.woodDark} strokeWidth=".8" /> : null}
          {tier >= 2 ? <path d="M38 30h4v4h-4z" fill={P.paper} /> : null}
          {Array.from({ length: people }, (_, i) => (
            <Person key={i} x={[14, 66, 22, 58, 72][i]!} y={[66, 66, 70, 70, 62][i]!} c={[P.denim, P.tomato, P.yellow, P.leafDark, P.lilac][i]!} s={0.8} />
          ))}
          {tier >= 4 ? [10, 70].map((x) => <Lantern key={x} x={x} y={52} s={0.5} />) : null}
          {winter ? <Snowcap d="M4 52Q20 42 40 42" /> : null}
        </Svg>
      )
    }
  }
  return null
}
