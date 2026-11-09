/** Kapitel-Grafik Kapitel 21: Tulpenfelder in Holland. */
import type { ReactNode } from 'react'
import { Svg, Window } from '../../HandParts'
import { Snowcap } from './partsA'
import { Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { Tulip, WaterBand } from './partsD'

const STRIPES = [P.red, P.yellow, P.plum, P.white, P.orange, P.pink]

/** Ein Streifen Zwiebelbeet: Blüte im Frühling, geköpft im Sommer, Stecken im Herbst, Schnee im Winter. */
function BulbRow({ x0, x1, y, c, season, kind = 'tulip' }: { x0: number; x1: number; y: number; c: string; season?: string; kind?: 'tulip' | 'hyacinth' }) {
  const n = Math.max(2, Math.floor((x1 - x0) / 3.2))
  if (season === 'winter') return <path d={`M${x0} ${y}H${x1}`} stroke={P.white} strokeWidth="2.6" strokeLinecap="round" />
  if (season === 'autumn')
    return (
      <g>
        <path d={`M${x0} ${y}H${x1}`} stroke={P.soilDark} strokeWidth="2.4" strokeLinecap="round" />
        {Array.from({ length: Math.ceil(n / 2) }, (_, i) => (
          <ellipse key={i} cx={x0 + 2 + i * 6.4} cy={y - 0.4} rx=".9" ry=".7" fill={P.woodLight} />
        ))}
      </g>
    )
  return (
    <g>
      <path d={`M${x0} ${y}H${x1}`} stroke={P.leafDark} strokeWidth="2.6" strokeLinecap="round" />
      {season === 'spring' ? <path d={`M${x0 + 1} ${y - 4.4}H${x1 - 1}`} stroke={c} strokeWidth="2" strokeLinecap="round" opacity=".55" /> : null}
      {Array.from({ length: n }, (_, i) => {
        const x = x0 + 1.4 + i * 3.2
        if (season === 'summer') return <circle key={i} cx={x} cy={y + 1.6} r=".7" fill={c} opacity=".9" />
        return kind === 'hyacinth' ? (
          <g key={i}>
            <path d={`M${x} ${y}v-4`} stroke={P.leafDark} strokeWidth=".5" />
            {[0, 1, 2].map((k) => (
              <circle key={k} cx={x + (k % 2 ? 0.5 : -0.5)} cy={y - 3.4 - k * 1.1} r=".9" fill={c} />
            ))}
          </g>
        ) : (
          <Tulip key={i} x={x} y={y} c={c} h={3.6} />
        )
      })}
    </g>
  )
}

/** Holländische Windmühle mit drehenden Flügeln. */
function Windmill({ x, y, s = 1, winter }: { x: number; y: number; s?: number; winter?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-8 0L-5 -26H5L8 0z" fill={P.charcoal} stroke={P.outline} strokeWidth=".5" />
      <path d="M-9 -12H9" stroke={P.woodMid} strokeWidth="1.4" />
      <path d="M-6 -26Q0 -34 6 -26z" fill={P.woodLight} stroke={P.outline} strokeWidth=".4" />
      <rect x="-2" y="-6" width="4" height="6" fill={P.leafDark} />
      <Window x={-3} y={-20} />
      <g transform="translate(0 -28)">
        <g className="ha-wheel">
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M0 0V-20" stroke={P.woodDark} strokeWidth=".9" />
              <rect x=".4" y="-19" width="4.6" height="15" fill={P.white} stroke={P.woodDark} strokeWidth=".3" opacity=".9" />
              <path d="M.4 -14h4.6M.4 -9h4.6M2.7 -19v15" stroke={P.woodDark} strokeWidth=".2" />
            </g>
          ))}
        </g>
        <circle cx="0" cy="0" r="1.4" fill={P.woodDark} />
      </g>
      {winter ? <Snowcap d="M-5 -27Q0 -33 5 -27" /> : null}
    </g>
  )
}

/** Fahrrad (Seitenansicht). */
function Bike({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <circle cx={x - 3.4} cy={y - 2.6} r="2.6" fill="none" stroke={P.charcoal} strokeWidth=".6" />
      <circle cx={x + 3.4} cy={y - 2.6} r="2.6" fill="none" stroke={P.charcoal} strokeWidth=".6" />
      <path d={`M${x - 3.4} ${y - 2.6}L${x - 0.6} ${y - 7}H${x + 2.4}L${x + 3.4} ${y - 2.6}M${x - 0.6} ${y - 7}L${x} ${y - 2.6}L${x + 2.4} ${y - 7}M${x + 2.4} ${y - 7}l.4 -1.6h1.6M${x - 1.4} ${y - 8}h2`} stroke={c} strokeWidth=".7" fill="none" />
    </g>
  )
}

/** Eimer mit Tulpenbund. */
function Bucket({ x, y, c, season }: { x: number; y: number; c: string; season?: string }) {
  return (
    <g>
      {season !== 'winter' ? [-1.6, 0, 1.6].map((dx) => <Tulip key={dx} x={x + dx} y={y - 3} c={c} h={3} />) : null}
      <path d={`M${x - 2.6} ${y - 3.4}h5.2l-.6 3.4h-4z`} fill={P.metal} stroke={P.outline} strokeWidth=".2" />
    </g>
  )
}

export function Tulpenfelder({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const ground = winter ? P.frost : P.paper
  switch (id) {
    case 'tulpenreihen': {
      const rows = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="57" rx="37" ry="12" fill={ground} />
          {Array.from({ length: rows }, (_, r) => (
            <BulbRow key={r} x0={10 + r} x1={70 - r} y={66 - r * 4.6} c={STRIPES[r % 6]!} season={season} />
          )).reverse()}
          {tier >= 3 && autumn ? <Person x={72} y={66} c={P.denim} s={0.7} /> : null}
          {tier >= 3 && !autumn ? <path d="M70 66l4 -6M72 62l3 1" stroke={P.woodDark} strokeWidth=".6" /> : null}
          {tier >= 4 ? <Windmill x={70} y={44} s={0.45} winter={winter} /> : null}
          {tier >= 5 ? <path d="M18 30l3 -1.6 3 1.6M26 26l2.4 -1.2 2.4 1.2" stroke={P.charcoal} strokeWidth=".6" fill="none" className="ha-swim" /> : null}
        </Svg>
      )
    }
    case 'hyazinthen': {
      const rows = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={ground} />
          {Array.from({ length: rows }, (_, r) => (
            <BulbRow key={r} kind="hyacinth" x0={12} x1={68} y={66 - r * 4.6} c={[P.blue, P.pink, P.white, P.lilac, P.plum][r]!} season={season} />
          )).reverse()}
          {spring && tier >= 2 ? <path d="M14 40q4 -3 8 0M40 36q4 -3 8 0" stroke={P.lilac} strokeWidth=".5" fill="none" opacity=".7" className="ha-swim" /> : null}
          {tier >= 2 ? <path d="M70 64v-8h6v8" stroke={P.woodDark} strokeWidth=".7" fill={P.woodLight} /> : null}
          {tier >= 4 ? <Person x={8} y={66} c={P.yellow} s={0.7} /> : null}
          {tier >= 5 ? <path d="M60 30l2.4 -1.2 2.4 1.2" stroke={P.charcoal} strokeWidth=".6" fill="none" /> : null}
        </Svg>
      )
    }
    case 'narzissen': {
      const n = Math.min(24, 6 + tier * 4)
      const trees = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="36" ry="11" fill={winter ? P.frost : P.leafLight} />
          {Array.from({ length: trees }, (_, i) => {
            const x = [24, 56, 40][i]!
            const crown = winter ? null : autumn ? P.autumn : spring ? P.leafPale : P.leaf
            return (
              <g key={i}>
                <path d={`M${x} 56V${36 - (i % 2) * 2}`} stroke={P.bark} strokeWidth="1.4" />
                {crown ? <ellipse cx={x} cy={30 - (i % 2) * 2} rx="9" ry="8" fill={crown} stroke={P.outline} strokeWidth=".3" /> : <path d={`M${x} 40l-5 -7M${x} 38l5 -8`} stroke={P.bark} strokeWidth=".6" />}
              </g>
            )
          })}
          {Array.from({ length: n }, (_, i) => {
            const x = 8 + ((i * 19) % 64)
            const y = 52 + ((i * 7) % 14)
            if (winter) return <path key={i} d={`M${x} ${y}v-1.6`} stroke={P.winterLeafDark} strokeWidth=".5" />
            return (
              <g key={i}>
                <path d={`M${x} ${y}v-4`} stroke={P.leafDark} strokeWidth=".5" />
                {spring ? (
                  <g>
                    <circle cx={x} cy={y - 4.4} r="1.4" fill={i % 4 ? P.yellow : P.cream} />
                    <circle cx={x + 0.4} cy={y - 4.4} r=".7" fill={P.orange} />
                  </g>
                ) : null}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M64 64h10" stroke={P.woodDark} strokeWidth="1.4" /> : null}
          {tier >= 3 ? <path d="M65 64v-4h8v4" stroke={P.woodDark} strokeWidth=".6" fill="none" /> : null}
          {tier >= 5 ? <Person x={10} y={68} c={P.lilac} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'zwiebelscheune': {
      const racks = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <rect x="12" y="34" width="52" height="30" fill={P.leafMoss} stroke={P.outline} strokeWidth=".5" />
          <path d="M8 36L38 14L68 36z" fill={P.charcoal} stroke={P.outline} strokeWidth=".5" />
          <path d="M12 34h52" stroke={P.white} strokeWidth="1" />
          <rect x="24" y="40" width="28" height="24" fill={P.soilDark} />
          {Array.from({ length: racks }, (_, i) => (
            <g key={i}>
              <path d={`M25 ${62 - i * 4.6}h26`} stroke={P.woodLight} strokeWidth=".8" />
              {Array.from({ length: 8 }, (_, k) => (
                <ellipse key={k} cx={27 + k * 3.2} cy={61 - i * 4.6} rx="1.2" ry=".9" fill={(k + i) % 3 ? P.woodLight : P.wood} />
              ))}
            </g>
          ))}
          <path d="M24 40l-6 24M52 40l6 24" stroke={P.leafDark} strokeWidth="1" />
          {tier >= 3 ? <path d="M64 64h10v-6h-10z" fill={P.wood} stroke={P.outlineWood} strokeWidth=".4" /> : null}
          {tier >= 3 ? [66, 69, 72].map((x) => <ellipse key={x} cx={x} cy={57.4} rx="1.2" ry=".9" fill={P.woodLight} />) : null}
          {tier >= 4 ? <path d="M36 26h4v4h-4z" fill={P.white} /> : null}
          {tier >= 5 ? <Person x={8} y={68} c={P.orange} s={0.7} /> : null}
          {winter ? <Snowcap d="M9 35L38 15L67 35" /> : null}
        </Svg>
      )
    }
    case 'windmuehle':
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.leafLight} />
          <WaterBand y={66} h={5} frozen={winter} />
          <Windmill x={40} y={60} s={0.9 + tier * 0.04} winter={winter} />
          {tier >= 2 ? <path d="M58 60h12v-6l-6 -4l-6 4z" fill={P.terracotta} stroke={P.outline} strokeWidth=".4" /> : null}
          {tier >= 3 ? [10, 16, 22].map((x) => <path key={x} d={`M${x} 62q-1 -4 -3 -6M${x} 62q1 -5 3 -7`} stroke={winter ? P.winterLeafDark : P.leafMoss} strokeWidth=".5" fill="none" />) : null}
          {tier >= 4 ? <path d="M10 66q2 -1 4 0" stroke={P.white} strokeWidth="1" className="ha-swim" /> : null}
          {tier >= 5 ? <Person x={70} y={66} c={P.denim} s={0.7} /> : null}
        </Svg>
      )
    case 'gracht': {
      const houses = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          {Array.from({ length: houses }, (_, i) => {
            const x = 6 + i * 18
            const c = [P.terracotta, P.woodDark, P.terracottaLight, P.stoneDark][i]!
            return (
              <g key={i}>
                <rect x={x} y={22} width="14" height="24" fill={c} stroke={P.outline} strokeWidth=".4" />
                <path d={`M${x} 22l2 -2v-2h2v-2h6v2h2v2l2 2z`} fill={c} stroke={P.outline} strokeWidth=".4" />
                {[0, 1].map((k) => (
                  <rect key={k} x={x + 2 + k * 6} y="28" width="4" height="6" fill={winter ? P.lamp : P.window} stroke={P.white} strokeWidth=".4" />
                ))}
              </g>
            )
          })}
          <rect x="2" y="46" width="76" height="4" fill={P.stone} />
          <WaterBand y={58} h={14} frozen={winter} />
          <path d="M30 50h20v-2h-20zM30 50l-2 4M50 50l2 4" fill={P.white} stroke={P.stoneDark} strokeWidth=".4" />
          <path d="M33 48V36M47 48V36M31 36h18M33 40l14 0" stroke={P.white} strokeWidth="1" />
          <path d="M33 36l-6 6M47 36l6 6" stroke={P.charcoal} strokeWidth=".4" />
          {tier >= 3 && !winter ? <path d="M60 60q1 -1.4 2.4 0" stroke={P.woodMid} strokeWidth="1.4" className="ha-swim" /> : null}
          {tier >= 3 && !winter ? <ellipse cx="60" cy="60.4" rx="2" ry="1" fill={P.woodDark} className="ha-swim" /> : null}
          {tier >= 4 ? <Person x={40} y={47} c={P.orange} s={0.6} /> : null}
          {tier >= 5 ? <path d="M8 46v-4M14 46v-4" stroke={P.leafDark} strokeWidth=".6" /> : null}
          {tier >= 5 ? [8, 14].map((x) => <circle key={x} cx={x} cy={41.4} r="1.2" fill={spring ? P.red : P.leaf} />) : null}
        </Svg>
      )
    }
    case 'fahrradstall': {
      const bikes = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.stoneLight} />
          {tier >= 2 ? <path d="M6 64V40M74 64V40M4 40L40 34L76 40" stroke={P.metal} strokeWidth="1" fill="none" /> : null}
          {tier >= 2 ? <path d="M4 40L40 34L76 40V42L40 36L4 42z" fill={P.leafDark} /> : null}
          {Array.from({ length: bikes }, (_, i) => (
            <Bike key={i} x={12 + i * 10.4} y={64 - (i % 2) * 1.4} c={[P.charcoal, P.red, P.denim, P.leafDark, P.cream, P.orange][i]!} />
          ))}
          <path d="M8 63H72" stroke={P.metal} strokeWidth=".6" />
          {tier >= 4 ? <path d="M30 56h6v-3h-6z" fill={P.wood} /> : null}
          {tier >= 4 ? [31, 33, 35].map((x) => <Tulip key={x} x={x} y={53} c={P.red} h={2.4} />) : null}
          {tier >= 5 ? <Person x={74} y={70} c={P.yellow} s={0.6} /> : null}
          {winter && tier >= 2 ? <Snowcap d="M5 40L40 34L75 40" /> : null}
        </Svg>
      )
    }
    case 'versteigerung': {
      const carts = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={36} />
          <rect x="6" y="26" width="68" height="38" fill={P.stoneLight} stroke={P.outline} strokeWidth=".5" />
          <path d="M4 28L40 18L76 28z" fill={P.stoneDark} stroke={P.outline} strokeWidth=".4" />
          <circle cx="40" cy="36" r="7" fill={P.white} stroke={P.charcoal} strokeWidth=".8" />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <circle key={i} cx={40 + Math.cos(a) * 5.4} cy={36 + Math.sin(a) * 5.4} r=".5" fill={i % 3 ? P.charcoal : P.red} />
          })}
          <g className="ha-wheel">
            <path d="M40 36L35.6 31.6" stroke={P.red} strokeWidth=".9" />
            <path d="M40 36L44.4 40.4" stroke="none" />
          </g>
          {Array.from({ length: carts }, (_, i) => {
            const x = 12 + i * 15
            return (
              <g key={i}>
                <rect x={x} y="50" width="12" height="12" fill="none" stroke={P.metal} strokeWidth=".6" />
                <path d={`M${x} 56h12`} stroke={P.metal} strokeWidth=".5" />
                {[2, 6, 10].map((dx) => (
                  <g key={dx}>
                    <rect x={x + dx - 1.6} y="52.6" width="3.2" height="3.4" fill={P.leafDark} />
                    <circle cx={x + dx} cy="52.2" r="1.2" fill={STRIPES[(i + dx) % 6]} />
                    <rect x={x + dx - 1.6} y="58.6" width="3.2" height="3.4" fill={P.leafDark} />
                    <circle cx={x + dx} cy="58.2" r="1.2" fill={STRIPES[(i + dx + 2) % 6]} />
                  </g>
                ))}
                <circle cx={x + 2} cy="63" r=".9" fill={P.charcoal} />
                <circle cx={x + 10} cy="63" r=".9" fill={P.charcoal} />
              </g>
            )
          })}
          {tier >= 5 ? <Person x={70} y={64} c={P.denim} s={0.7} /> : null}
          {winter ? <Snowcap d="M5 28L40 19L75 28" /> : null}
        </Svg>
      )
    }
    case 'hausboot': {
      const boxes = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <WaterBand y={60} h={16} frozen={winter} />
          <g className={winter ? undefined : 'ha-swim'}>
            <rect x="12" y="50" width="56" height="8" fill={P.denim} stroke={P.outline} strokeWidth=".5" />
            <rect x="18" y="38" width="40" height="12" fill={P.cream} stroke={P.outline} strokeWidth=".5" />
            <path d="M16 38h44l-2 -3H18z" fill={P.leafDark} />
            {[22, 32, 46].map((x) => (
              <rect key={x} x={x} y="41" width="6" height="5" fill={winter ? P.lamp : P.waterLight} stroke={P.white} strokeWidth=".5" />
            ))}
            {Array.from({ length: boxes }, (_, i) => (
              <g key={i}>
                <rect x={18 + i * 8} y="32" width="6" height="3" fill={P.terracotta} />
                {!winter ? [1.4, 3, 4.6].map((dx) => <circle key={dx} cx={18 + i * 8 + dx} cy={31.4} r="1.1" fill={i % 2 ? P.leaf : spring ? P.red : P.leafDark} />) : null}
              </g>
            ))}
          </g>
          {tier >= 3 ? <path d="M68 52l6 6" stroke={P.woodLight} strokeWidth=".6" /> : null}
          {tier >= 4 ? <Bike x={64} y={48} c={P.red} /> : null}
          {tier >= 5 ? <Person x={14} y={50} c={P.yellow} s={0.6} /> : null}
          {winter ? <Snowcap d="M17 35H59" /> : null}
        </Svg>
      )
    }
    case 'tulpenmarkt': {
      const stalls = Math.min(3, Math.ceil(tier / 2))
      const buckets = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.stoneLight} />
          {Array.from({ length: stalls }, (_, i) => {
            const x = 8 + i * 22
            return (
              <g key={i}>
                <path d={`M${x} 64V40M${x + 20} 64V40`} stroke={P.woodDark} strokeWidth=".8" />
                {[0, 1, 2, 3, 4].map((k) => (
                  <path key={k} d={`M${x - 1 + k * 4.4} 36h4.4l-.4 5h-3.6z`} fill={k % 2 ? P.white : [P.red, P.orange, P.leafDark][i]} />
                ))}
                <rect x={x} y="54" width="20" height="2.4" fill={P.wood} />
              </g>
            )
          })}
          {Array.from({ length: buckets }, (_, i) => (
            <Bucket key={i} x={11 + i * 7.6} y={64 - (i % 2)} c={STRIPES[i % 6]!} season={season} />
          ))}
          {tier >= 3 ? <Person x={74} y={66} c={P.denim} s={0.7} /> : null}
          {tier >= 5 ? <Bike x={74} y={56} c={P.leafDark} /> : null}
          {winter ? <Snowcap d="M7 36h22" /> : null}
        </Svg>
      )
    }
  }
  return null
}
