/** Kapitel-Grafik Kapitel 20: Cottage-Garten in den Cotswolds. */
import type { ReactNode } from 'react'
import { Svg } from '../../HandParts'
import { Bunting, Snowcap } from './partsA'
import { Pot, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Person } from './partsB'
import { TomatoPlant } from './partsC'

/** Honigfarbene Kalksteinmauer, trocken geschichtet (Fußpunkt unten links). */
function StoneWall({ x, y, w, h, winter }: { x: number; y: number; w: number; h: number; winter?: boolean }) {
  const rows = Math.max(2, Math.round(h / 3))
  return (
    <g>
      <rect x={x} y={y - h} width={w} height={h} fill={P.paper} stroke={P.outlineStone} strokeWidth=".5" />
      {Array.from({ length: rows }, (_, r) =>
        Array.from({ length: Math.ceil(w / 5) }, (_, k) => {
          const sx = x + k * 5 + (r % 2) * 2.5 - 2.5
          const sw = 4.4
          if (sx + sw <= x || sx >= x + w) return null
          return <rect key={`${r}-${k}`} x={Math.max(x, sx)} y={y - h + r * (h / rows) + 0.3} width={Math.min(sw, x + w - Math.max(x, sx))} height={h / rows - 0.6} rx=".6" fill={(r + k) % 3 ? P.canvas : P.woodLight} stroke={P.stone} strokeWidth=".2" />
        }),
      )}
      {Array.from({ length: Math.floor(w / 2.4) }, (_, k) => (
        <rect key={`c${k}`} x={x + k * 2.4} y={y - h - 3} width="1.8" height="3" fill={P.stone} />
      ))}
      {winter ? <Snowcap d={`M${x} ${y - h - 3.4}h${w}`} /> : null}
    </g>
  )
}

/** Stockrose: hoher Stiel mit Blütentellern. */
function Hollyhock({ x, y, h, c, season }: { x: number; y: number; h: number; c: string; season?: string }) {
  if (season === 'winter') return <path d={`M${x} ${y}V${y - h * 0.8}`} stroke={P.woodMid} strokeWidth=".7" />
  const flowers = season === 'summer' ? 6 : season === 'autumn' ? 2 : 0
  return (
    <g>
      <path d={`M${x} ${y}V${y - h}`} stroke={P.leafDark} strokeWidth=".8" />
      {[0.15, 0.3].map((t) => (
        <ellipse key={t} cx={x + (t > 0.2 ? 2 : -2)} cy={y - h * t} rx="2.4" ry="1.6" fill={season === 'autumn' ? P.winterLeaf : P.leaf} />
      ))}
      {Array.from({ length: flowers }, (_, i) => (
        <g key={i}>
          <circle cx={x + (i % 2 ? 0.8 : -0.8)} cy={y - h * (0.42 + i * 0.1)} r={1.9 - i * 0.18} fill={c} stroke={P.outline} strokeWidth=".15" />
          <circle cx={x + (i % 2 ? 0.8 : -0.8)} cy={y - h * (0.42 + i * 0.1)} r=".5" fill={P.cream} />
        </g>
      ))}
      {season === 'spring' || season === 'summer' ? [0, 1, 2].map((i) => <circle key={`b${i}`} cx={x} cy={y - h + i * 1.6} r=".7" fill={P.leafPale} />) : null}
    </g>
  )
}

/** Eiche (Teeplatz). */
function Oak({ x, y, season }: { x: number; y: number; season?: string }) {
  const crown = season === 'winter' ? null : season === 'autumn' ? P.autumn : season === 'spring' ? P.leafPale : P.leafDark
  return (
    <g>
      <path d={`M${x - 2} ${y}Q${x - 1} ${y - 14} ${x - 4} ${y - 22}M${x + 2} ${y}Q${x + 1} ${y - 14} ${x + 6} ${y - 24}`} stroke={P.bark} strokeWidth="2.4" fill="none" />
      {crown ? (
        <g>
          {[
            [-10, -28, 11],
            [8, -30, 12],
            [-1, -38, 12],
            [16, -22, 7],
            [-16, -22, 7],
          ].map(([dx, dy, r], i) => (
            <circle key={i} cx={x + dx!} cy={y + dy!} r={r} fill={crown} stroke={P.outline} strokeWidth=".3" opacity={0.95} />
          ))}
          <ellipse cx={x - 6} cy={y - 38} rx="6" ry="3" fill={P.leafLight} opacity=".5" />
        </g>
      ) : (
        <path d={`M${x - 4} ${y - 22}l-8 -8M${x - 4} ${y - 22}l2 -12M${x + 6} ${y - 24}l8 -8M${x + 6} ${y - 24}l-2 -10`} stroke={P.bark} strokeWidth="1" />
      )}
    </g>
  )
}

/** Teetisch mit Kanne und Tassen. */
function TeaTable({ x, y, cups }: { x: number; y: number; cups: number }) {
  return (
    <g>
      <ellipse cx={x} cy={y - 7} rx="8" ry="2.4" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" />
      <path d={`M${x} ${y - 7}V${y}M${x - 3} ${y}h6`} stroke={P.woodDark} strokeWidth=".8" />
      <ellipse cx={x} cy={y - 9.6} rx="2.2" ry="2" fill={P.denim} stroke={P.outline} strokeWidth=".3" />
      <path d={`M${x + 2} ${y - 10}l2 -1.4`} stroke={P.denim} strokeWidth=".6" />
      {Array.from({ length: cups }, (_, i) => (
        <rect key={i} x={x - 6.4 + i * 3.2 + (i > 1 ? 4.6 : 0)} y={y - 9} width="1.8" height="1.6" fill={P.white} stroke={P.blue} strokeWidth=".3" />
      ))}
    </g>
  )
}

export function Cottagegarten({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  const summer = season === 'summer'
  switch (id) {
    case 'stockrosen': {
      const n = Math.min(7, 1 + tier + Math.floor(tier / 3))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.leafLight} />
          <StoneWall x={6} y={60} w={68} h={14} winter={winter} />
          {Array.from({ length: n }, (_, i) => (
            <Hollyhock key={i} x={12 + i * 9.4} y={64 - (i % 2) * 2} h={28 + (i % 3) * 5} c={[P.pink, P.berry, P.cream, P.plum, P.blossom, P.red, P.yellow][i]!} season={season} />
          ))}
          {tier >= 4 && !winter ? [20, 50].map((x) => <ellipse key={x} cx={x} cy={65} rx="4" ry="1.6" fill={spring ? P.lilac : P.lavender} />) : null}
          {tier >= 5 ? <Person x={72} y={68} c={P.lilac} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'wickenzaun': {
      const wig = Math.min(4, Math.ceil(tier * 0.8))
      const flowerCols = [P.pink, P.lilac, P.plum, P.cream, P.berry, P.blossom]
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.soil} />
          {Array.from({ length: wig }, (_, i) => {
            const x = [40, 22, 58, 31][i]!
            const y = [64, 60, 60, 66][i]!
            return (
              <g key={i}>
                {[-5, -2, 2, 5].map((dx) => (
                  <path key={dx} d={`M${x + dx} ${y}L${x} ${y - 30}`} stroke={P.woodLight} strokeWidth=".6" />
                ))}
                {!winter ? <path d={`M${x - 4} ${y - 2}Q${x - 2} ${y - 16} ${x} ${y - 26}Q${x + 2} ${y - 14} ${x + 4} ${y - 2}`} fill={autumn ? P.winterLeaf : P.leaf} opacity=".85" /> : null}
                {summer || (autumn && i % 2 === 0)
                  ? Array.from({ length: autumn ? 3 : 7 }, (_, k) => (
                      <path key={k} d={`M${x - 3.4 + ((k * 5) % 7)} ${y - 4 - k * 3.2}q1.4 -2.4 2.8 0q-1.4 1.4 -2.8 0z`} fill={flowerCols[(k + i) % 6]} stroke={P.outline} strokeWidth=".2" />
                    ))
                  : null}
                {spring ? [0, 1, 2].map((k) => <ellipse key={k} cx={x - 2 + k * 2} cy={y - 3} rx="1" ry=".6" fill={P.leafPale} />) : null}
              </g>
            )
          })}
          {tier >= 3 && !winter ? <path d="M64 60h10l-1 4h-8z" fill={P.white} stroke={P.stoneLight} strokeWidth=".4" /> : null}
          {tier >= 3 && summer ? [66, 69, 72].map((x, i) => <circle key={x} cx={x} cy={59} r="1.2" fill={flowerCols[i]} />) : null}
          {tier >= 5 ? <Person x={72} y={70} c={P.denim} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'gemueseparzelle': {
      const beds = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="37" ry="11" fill={winter ? P.frost : P.leafLight} />
          {Array.from({ length: beds }, (_, i) => {
            const x = 10 + (i % 2) * 30
            const y = 58 + Math.floor(i / 2) * 8 - 4
            return (
              <g key={i}>
                <rect x={x} y={y - 4} width="26" height="6" rx="1" fill={winter ? P.white : P.soil} stroke={P.outlineWood} strokeWidth=".3" />
                {!winter && i === 0
                  ? [3, 8, 13, 18, 23].map((dx) => (
                      <g key={dx}>
                        <path d={`M${x + dx} ${y - 2}V${y - 18}`} stroke={P.woodLight} strokeWidth=".5" />
                        <ellipse cx={x + dx} cy={y - 10} rx="1.6" ry={spring ? 2 : 5} fill={autumn ? P.winterLeaf : P.leaf} />
                        {summer ? <circle cx={x + dx + 0.6} cy={y - 12} r=".6" fill={P.tomato} /> : null}
                      </g>
                    ))
                  : null}
                {!winter && i === 1
                  ? [4, 11, 18].map((dx) => (
                      <g key={dx}>
                        <path d={`M${x + dx} ${y - 2}l-3 -6M${x + dx} ${y - 2}l3 -6M${x + dx} ${y - 2}v-4`} stroke={P.berry} strokeWidth=".6" />
                        <ellipse cx={x + dx - 3} cy={y - 9} rx="3" ry="2" fill={P.leaf} />
                        <ellipse cx={x + dx + 3} cy={y - 9} rx="3" ry="2" fill={P.leafDark} />
                      </g>
                    ))
                  : null}
                {!winter && i >= 2
                  ? [3, 7, 11, 15, 19, 23].map((dx) => <path key={dx} d={`M${x + dx} ${y - 2}v-6M${x + dx} ${y - 5}l-1.4 -2`} stroke={i === 2 ? P.leafMoss : P.leafDark} strokeWidth=".9" />)
                  : null}
              </g>
            )
          })}
          {tier >= 2 ? <rect x="70" y="50" width="6" height="9" rx="1" fill={P.leafDark} stroke={P.outline} strokeWidth=".3" /> : null}
          {tier >= 3 ? <path d="M68 64l4 -4h3" stroke={P.metal} strokeWidth=".8" fill="none" /> : null}
          {tier >= 5 ? <Person x={72} y={68} c={P.woodMid} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'steinmauer': {
      const w = 26 + tier * 9
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.leafLight} />
          <StoneWall x={40 - w / 2} y={62} w={w} h={16} winter={winter} />
          {tier >= 2 && !winter
            ? [0.25, 0.7].map((t) => (
                <g key={t}>
                  <circle cx={40 - w / 2 + w * t} cy={51} r="1.8" fill={P.leafMoss} />
                  <circle cx={40 - w / 2 + w * t} cy={51} r=".8" fill={summer ? P.pink : P.leafPale} />
                </g>
              ))
            : null}
          {tier >= 3 && !winter ? <path d={`M${40 + w / 2 - 6} 48l1 -1l1 1`} stroke={P.ink} strokeWidth=".6" fill="none" className="ha-swim" /> : null}
          {tier >= 4 ? [0, 1, 2].map((i) => <ellipse key={i} cx={58 + i * 4} cy={66} rx="1.8" ry="1" fill={P.paper} stroke={P.outlineStone} strokeWidth=".3" />) : null}
          {tier >= 4 ? <path d="M70 36l2 -1.4l2 1.4M64 32l1.6 -1l1.6 1" stroke={P.charcoal} strokeWidth=".5" fill="none" /> : null}
          {tier >= 5 ? <Person x={20} y={68} c={P.leafDark} s={0.7} /> : null}
        </Svg>
      )
    }
    case 'apfelspalier': {
      const arms = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <StoneWall x={6} y={64} w={68} h={46} winter={winter} />
          <path d="M40 66V22" stroke={P.bark} strokeWidth="2.2" />
          {Array.from({ length: arms }, (_, i) => {
            const y = 58 - i * 9
            return (
              <g key={i}>
                <path d={`M40 ${y}H12M40 ${y}H68`} stroke={P.bark} strokeWidth="1.6" />
                {!winter
                  ? [14, 20, 26, 32, 48, 54, 60, 66].map((x) => (
                      <ellipse key={x} cx={x} cy={y - 1.6} rx="2.6" ry="1.6" fill={spring ? P.blossom : autumn ? P.autumn : P.leaf} stroke={P.leafDark} strokeWidth=".3" />
                    ))
                  : null}
                {summer || autumn ? [17, 29, 51, 63].map((x) => <circle key={x} cx={x} cy={y + 1.2} r="1.8" fill={autumn ? P.red : P.leafPale} stroke={P.outlineWood} strokeWidth=".3" />) : null}
                {spring ? [17, 29, 51, 63].map((x) => <circle key={x} cx={x} cy={y - 2} r=".7" fill={P.white} />) : null}
              </g>
            )
          })}
          {tier >= 3 ? <path d="M10 66h60" stroke={P.soil} strokeWidth="2" /> : null}
          {tier >= 5 ? <Person x={72} y={70} c={P.lilac} s={0.6} /> : null}
        </Svg>
      )
    }
    case 'holzgewaechshaus': {
      const plants = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <rect x="14" y="44" width="50" height="20" fill={P.wood} stroke={P.outline} strokeWidth=".5" />
          <rect x="14" y="30" width="50" height="14" fill={P.glass} opacity=".75" />
          <path d="M12 30L39 16L66 30z" fill={P.glass} opacity=".8" stroke={P.woodLight} strokeWidth="1" />
          {Array.from({ length: plants }, (_, i) => (
            <TomatoPlant key={i} x={20 + i * 9} y={44} h={10} ripe={summer || autumn} fruits={winter ? 0 : spring ? 1 : 2} />
          ))}
          <path d="M14 30H64M14 44H64M22 30V64M31 30V44M39 16V44M47 30V44M56 30V64M27 23L27 30M51 23L51 30" stroke={P.woodLight} strokeWidth=".9" fill="none" />
          <path d="M14 30V64M64 30V64" stroke={P.woodMid} strokeWidth="1.2" />
          <path d="M36 64V48h6v16" fill={P.glass} stroke={P.woodLight} strokeWidth=".8" />
          {tier >= 3 ? [68, 73].map((x) => <Pot key={x} x={x} y={64} s={0.5} />) : null}
          {tier >= 4 ? <path d="M39 16l6 -3" stroke={P.woodLight} strokeWidth="1" /> : null}
          {tier >= 5 ? <Person x={8} y={68} c={P.leafDark} s={0.7} /> : null}
          {winter ? <Snowcap d="M13 30L39 17L65 30" /> : null}
        </Svg>
      )
    }
    case 'teeplatz': {
      const chairs = Math.min(4, tier)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="36" ry="7" fill={winter ? P.frost : P.leafLight} />
          <g transform="translate(24 62) scale(.72) translate(-24 -62)">
            <Oak x={24} y={62} season={season} />
          </g>
          <TeaTable x={52} y={64} cups={Math.min(4, tier)} />
          {Array.from({ length: chairs }, (_, i) => {
            const x = [42, 62, 38, 66][i]!
            return <path key={i} d={`M${x} 64v-5h3v5M${x + (i % 2 ? 3 : 0)} 59v-5`} stroke={P.white} strokeWidth=".9" fill="none" />
          })}
          {tier >= 3 ? <path d="M48 52l1.6 -4h4.8l1.6 4z" fill={P.cream} stroke={P.stoneLight} strokeWidth=".3" /> : null}
          {tier >= 3 ? <circle cx="52" cy="50" r="1.2" fill={P.berry} /> : null}
          {tier >= 4 ? <Person x={68} y={66} c={P.lilac} s={0.8} /> : null}
          {tier >= 5 ? <Bunting y={18} n={6} x0={36} x1={76} /> : null}
        </Svg>
      )
    }
    case 'geissblattlaube': {
      const bloom = Math.min(16, 4 + tier * 3)
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="34" ry="7" fill={winter ? P.frost : P.leafLight} />
          <path d="M22 64V34Q40 14 58 34V64" stroke={P.woodMid} strokeWidth="2.2" fill="none" />
          <path d="M22 44H58M22 54H58" stroke={P.woodLight} strokeWidth=".8" />
          {!winter
            ? Array.from({ length: 10 + tier * 2 }, (_, i) => {
                const t = i / (10 + tier * 2)
                const a = Math.PI * t
                return <ellipse key={i} cx={40 - Math.cos(a) * 18} cy={34 - Math.sin(a) * 14 + (i % 3)} rx="3" ry="2" fill={i % 2 ? P.leaf : P.leafDark} />
              })
            : null}
          {summer || spring
            ? Array.from({ length: bloom }, (_, i) => {
                const a = Math.PI * (i / bloom)
                return <path key={`f${i}`} d={`M${40 - Math.cos(a) * 18} ${33 - Math.sin(a) * 14}l1.6 -1.6M${40 - Math.cos(a) * 18} ${33 - Math.sin(a) * 14}l-.4 -2`} stroke={i % 2 ? P.cream : P.yellow} strokeWidth=".8" />
              })
            : null}
          {autumn ? Array.from({ length: bloom / 2 }, (_, i) => <circle key={`r${i}`} cx={40 - Math.cos(Math.PI * (i / (bloom / 2))) * 18} cy={36 - Math.sin(Math.PI * (i / (bloom / 2))) * 13} r=".8" fill={P.berry} />) : null}
          <path d="M30 60h20v-3H30zM31 60v4M49 60v4" fill={P.woodLight} stroke={P.woodDark} strokeWidth=".5" />
          {tier >= 2 ? [26, 54].map((x) => <ellipse key={x} cx={x} cy={66} rx="3" ry="1.2" fill={P.stone} />) : null}
          {tier >= 3 ? [16, 64].map((x) => <path key={x} d={`M${x - 2} 64h4l-.6 -4h-2.8z`} fill={P.terracotta} />) : null}
          {tier >= 4 ? <Person x={36} y={60} c={P.denim} s={0.7} /> : null}
          {tier >= 5 ? <path d="M64 30l2 -1l1 1l-2 1z" fill={P.stoneDark} className="ha-swim" /> : null}
          {winter ? <Snowcap d="M23 34Q40 15 57 34" /> : null}
        </Svg>
      )
    }
    case 'gartenschuppen':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <rect x="18" y="36" width="36" height="28" fill={P.leafMoss} stroke={P.outline} strokeWidth=".5" />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <path key={i} d={`M${18 + i * 6} 36v28`} stroke={P.leafDark} strokeWidth=".4" />
          ))}
          <path d="M14 37L36 26L58 37z" fill={P.charcoal} stroke={P.outline} strokeWidth=".4" />
          <rect x="22" y="42" width="10" height="8" fill={P.waterLight} stroke={P.white} strokeWidth=".8" />
          <rect x="38" y="44" width="10" height="20" fill={P.leafDark} stroke={P.outline} strokeWidth=".3" />
          {tier >= 2 ? [58, 63, 68].map((x, i) => <Pot key={x} x={x} y={64 - (i === 1 ? 0 : 0)} s={0.55} />) : null}
          {tier >= 3 ? [60.5, 65.5].map((x) => <Pot key={x} x={x} y={60} s={0.55} />) : null}
          {tier >= 3 ? <rect x="24" y="46" width="6" height="3.4" rx=".6" fill={P.tomato} /> : null}
          {tier >= 4 ? <path d="M8 64h6l1 -5h-6zM14 60l3 -2" fill={P.metal} stroke={P.metal} strokeWidth=".6" /> : null}
          {tier >= 5 ? <Person x={72} y={68} c={P.woodMid} s={0.7} /> : null}
          {spring || summer ? [20, 24, 50].map((x) => <circle key={x} cx={x} cy={63} r="1.2" fill={P.pink} />) : null}
          {winter ? <Snowcap d="M15 36L36 26L57 36" /> : null}
        </Svg>
      )
    case 'dorfschau': {
      const tables = Math.min(3, Math.ceil(tier / 2))
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="62" rx="37" ry="7" fill={winter ? P.frost : P.leafLight} />
          <path d="M8 62V36L40 22L72 36V62z" fill={P.white} stroke={P.stoneLight} strokeWidth=".6" />
          <path d="M8 36L40 22L72 36" stroke={P.stoneDark} strokeWidth=".6" fill="none" />
          <path d="M40 22V14" stroke={P.woodDark} strokeWidth=".7" />
          <path d="M40 14l6 2l-6 2z" fill={P.red} />
          {Array.from({ length: tables }, (_, i) => {
            const x = 14 + i * 20
            return (
              <g key={i}>
                <rect x={x} y="52" width="16" height="3" fill={P.cream} stroke={P.stoneLight} strokeWidth=".3" />
                <path d={`M${x + 1} 55v7M${x + 15} 55v7`} stroke={P.woodDark} strokeWidth=".6" />
                {i === 0 ? <path d={`M${x + 2} 51.6h12`} stroke={P.leafDark} strokeWidth="1.2" /> : null}
                {i === 1 ? [3, 8, 13].map((dx) => <circle key={dx} cx={x + dx} cy={50} r="2" fill={[P.pink, P.lilac, P.plum][dx % 3]} />) : null}
                {i === 2 ? <path d={`M${x + 3} 52l2 -5h6l2 5z`} fill={P.honey} stroke={P.outlineWood} strokeWidth=".3" /> : null}
                <circle cx={x + 8} cy="58" r="1.6" fill={[P.blue, P.red, P.gold][i]} />
                <path d={`M${x + 7.4} 59.4l-.6 2.6M${x + 8.6} 59.4l.6 2.6`} stroke={[P.blue, P.red, P.gold][i]} strokeWidth=".6" />
              </g>
            )
          })}
          {tier >= 2 ? <Bunting y={30} n={7} x0={10} x1={70} /> : null}
          {tier >= 4 ? [6, 74].map((x, i) => <Person key={x} x={x} y={68} c={[P.denim, P.tomato][i]!} s={0.7} />) : null}
          {tier >= 5 ? <Person x={40} y={70} c={P.yellow} s={0.7} /> : null}
          {winter ? <Snowcap d="M9 36L40 23L71 36" /> : null}
        </Svg>
      )
    }
  }
  return null
}
