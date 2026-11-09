/** Kapitel-Grafik (Kräuter, Botanik, Alm): kraeuter. */
import type { ReactNode } from 'react'
import { Bees, House, Smoke, Svg, Window } from '../../HandParts'
import { Bed, Flower, Jar, Pot, Shadow } from '../parts'
import { P } from '../palette'
import { type AreaProps, Bunting, Butterfly, Soil } from './partsA'

function Bundle({ x, y, c }: { x: number; y: number; c: string }) {
  return (
    <g>
      <path d={`M${x} ${y}v2`} stroke={P.outlineWood} strokeWidth=".4" />
      <path d={`M${x - 2.2} ${y + 9}L${x} ${y + 2}L${x + 2.2} ${y + 9}z`} fill={c} />
      <rect x={x - 0.9} y={y + 2} width="1.8" height="1.4" fill="#c49a3a" />
    </g>
  )
}

export function Kraeuter({ id, tier, season }: AreaProps): ReactNode {
  const winter = season === 'winter'
  const spring = season === 'spring'
  const autumn = season === 'autumn'
  switch (id) {
    case 'kamille': {
      const rows = Math.min(5, 1 + tier)
      return (
        <Svg tier={tier}>
          <Soil winter={winter} />
          {Array.from({ length: rows }, (_, r) => (
            <g key={r}>
              {Array.from({ length: 7 }, (_, i) => {
                const x = 14 + i * 8.6 + (r % 2) * 3
                const y = 62 - r * 4
                if (winter) return <path key={i} d={`M${x - 2} ${y}l2-3 2 3`} stroke="#c9b48a" strokeWidth=".8" fill="none" />
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y + 1} rx="3" ry="1.6" fill="#8ab85a" />
                    {!spring ? <Flower s={0.7} x={x} y={y - 2 + 3.72} c={autumn ? '#e8e0c8' : P.cream} r={1.32} /> : null}
                  </g>
                )
              })}
            </g>
          ))}
          {tier >= 4 ? (
            <g>
              <path d="M58 40h12l-1.6 7h-8.8z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".6" />
              <path d="M59 40q5 -6 10 0" stroke={P.outlineWood} strokeWidth=".8" fill="none" />
              {[61, 64, 67].map((x) => (
                <circle key={x} cx={x} cy="39.6" r="1.3" fill={P.cream} />
              ))}
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={24} y={36} c="#f5e08a" /> : null}
        </Svg>
      )
    }
    case 'pfefferminze': {
      const clumps = Math.min(6, 1 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <Bed x={40} y={62} w={107} h={5} front={12} s={0.6} winter={winter} />
          {Array.from({ length: clumps }, (_, i) => {
            const x = 14 + i * 10.4
            return winter ? (
              <path key={i} d={`M${x - 4} 52q4-6 8 0`} fill="#f4f6f6" stroke="#d8dee0" strokeWidth=".5" />
            ) : (
              <g key={i}>
                <ellipse cx={x} cy={48} rx="5" ry="4.6" fill="#3f8a4a" />
                <ellipse cx={x - 2} cy={46} rx="2.4" ry="1.6" fill="#5fae62" />
                <ellipse cx={x + 2} cy={49} rx="2.4" ry="1.6" fill="#5fae62" />
                {season === 'summer' ? <path d={`M${x} 44v-3`} stroke="#c7a3e0" strokeWidth="1.6" strokeLinecap="round" /> : null}
              </g>
            )
          })}
          {tier >= 3 ? (
            <g>
              <path d="M62 42h8l-1 6h-6z" fill="#7a9aa8" stroke="#4a6a78" strokeWidth=".5" />
              <path d="M62 43l-5 -3" stroke="#7a9aa8" strokeWidth="1.2" />
              <path d="M66 42q2-4 4 0" stroke="#4a6a78" strokeWidth=".6" fill="none" />
            </g>
          ) : null}
          {tier >= 5 ? <Bees n={3} cy={36} /> : null}
        </Svg>
      )
    }
    case 'ringelblume': {
      const n = Math.min(14, 4 + tier * 2)
      return (
        <Svg tier={tier}>
          <Soil cy={57} rx={30} ry={11} winter={winter} />
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return <ellipse key={i} cx={40 + Math.cos(a) * 30} cy={57 + Math.sin(a) * 11} rx="2.8" ry="1.8" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".4" />
          })}
          {!winter
            ? Array.from({ length: n }, (_, i) => {
                const x = 18 + ((i * 17) % 46)
                const y = 50 + ((i * 7) % 12)
                return (
                  <g key={i}>
                    <ellipse cx={x} cy={y + 2.4} rx="2.6" ry="1.4" fill="#6f9a48" />
                    {!spring || i % 3 === 0 ? <Flower s={0.7} x={x} y={y + 4.05} c={autumn && i % 2 ? '#d9731a' : P.orange} r={1.79} center="#c4551a" /> : null}
                  </g>
                )
              })
            : null}
          {tier >= 4 ? (
            <g>
              <path d="M40 46v-12" stroke={P.outlineSoft} strokeWidth="1" />
              <rect x="34" y="30" width="12" height="5" rx="1" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".5" />
              <circle cx="40" cy="32.5" r="1.4" fill={P.orange} />
            </g>
          ) : null}
          {tier >= 5 && !winter ? <Butterfly x={60} y={38} c={P.yellow} /> : null}
        </Svg>
      )
    }
    case 'johanniskraut': {
      const bushes = Math.min(5, tier + 1)
      const bloom = season === 'summer'
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="58" rx="34" ry="11" fill={winter ? '#e8eef0' : P.leafLight} opacity=".8" />
          {Array.from({ length: bushes }, (_, i) => {
            const x = 14 + i * 13
            const h = 16 + (i % 2) * 4
            return (
              <g key={i}>
                {Array.from({ length: 5 }, (_, k) => (
                  <path key={k} d={`M${x} 62q${(k - 2) * 1.5} -${h * 0.6} ${(k - 2) * 3} -${h}`} stroke={winter ? '#a08a6a' : P.leaf} strokeWidth="1" fill="none" />
                ))}
                {!winter ? <ellipse cx={x} cy={62 - h * 0.6} rx="5" ry={h * 0.32} fill="#6f9a48" opacity=".85" /> : null}
                {bloom || (spring && i % 2 === 0)
                  ? Array.from({ length: 5 }, (_, k) => <circle key={k} cx={x - 5 + k * 2.5} cy={62 - h + (k % 2) * 2} r="1.5" fill={P.yellow} stroke="#d99a1a" strokeWidth=".3" />)
                  : null}
                {autumn ? Array.from({ length: 4 }, (_, k) => <circle key={k} cx={x - 4 + k * 2.6} cy={62 - h + 1} r=".9" fill="#8a3a2a" />) : null}
              </g>
            )
          })}
          {tier >= 4 ? (
            <g>
              <path d="M8 40h20" stroke={P.outlineWood} strokeWidth="1.2" />
              <path d="M10 40v12M26 40v12" stroke={P.outlineWood} strokeWidth="1" />
              {[13, 18, 23].map((x) => (
                <Bundle key={x} x={x} y={40} c="#d9b84a" />
              ))}
            </g>
          ) : null}
          {tier >= 3 && !winter ? <Bees n={tier} cy={34} /> : null}
        </Svg>
      )
    }
    case 'salbei': {
      const pots = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <rect x="6" y="60" width="68" height="3" rx="1" fill={P.stone} />
          {Array.from({ length: pots }, (_, i) => {
            const x = 12 + i * 11.2
            const big = i % 2 === 0
            return (
              <g key={i}>
                <ellipse cx={x} cy={53} rx={big ? 5.4 : 4.4} ry={big ? 5 : 4} fill={winter ? '#b8c0b4' : '#9fb8a0'} />
                <ellipse cx={x - 1.6} cy={51} rx="2" ry="1.2" fill="#c4d4c0" />
                {season === 'summer' && big ? <path d={`M${x} 48v-5`} stroke="#8a6ac4" strokeWidth="1.6" strokeLinecap="round" /> : null}
                {winter ? <path d={`M${x - 4} 50q4-3.6 8 0`} stroke={P.white} strokeWidth="1.8" fill="none" /> : null}
                <Pot x={x} y={big ? 61 : 60.1} s={big ? 0.67 : 0.57} />
              </g>
            )
          })}
          {tier >= 4 ? <path d="M58 40h14v-6h-14z" fill={P.paper} stroke={P.outlineSoft} strokeWidth=".5" /> : null}
          {tier >= 4 ? <path d="M61 37h8" stroke="#6f8a6a" strokeWidth="1.2" /> : null}
        </Svg>
      )
    }
    case 'trockenboden': {
      const bundles = Math.min(8, 2 + tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <House x={10} w={52} h={26} wall="#e8d4ac" roof={P.outlineWood} timber steep={14} />
          <rect x="20" y="40" width="32" height="10" fill="#3a2a1a" />
          <path d="M20 41h32" stroke={P.outlineWood} strokeWidth="1" />
          {Array.from({ length: bundles }, (_, i) => (
            <Bundle key={i} x={22.4 + i * 4} y={41} c={['#7a9a4a', '#d9b84a', '#9fb8a0', P.lilac, P.orange][i % 5]!} />
          ))}
          <rect x="31" y="54" width="10" height="10" fill={P.bark} />
          {tier >= 3 ? <path d="M64 64V40M68 64V40M64 46h4M64 52h4M64 58h4" stroke={P.outlineSoft} strokeWidth="1" /> : null}
          {tier >= 5 ? (
            <g>
              <rect x="66" y="58" width="9" height="6" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".5" />
              <path d="M67 58l2-3 2 3 2-3 1 3" fill="#9fb8a0" />
            </g>
          ) : null}
          {winter ? <path d="M7 38 L36 24 L65 38" stroke={P.white} strokeWidth="2.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'destille': {
      const bottles = Math.min(5, tier)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <path d="M6 34h40l-4 -8h-32z" fill="#a5531a" stroke="#6e2a12" strokeWidth=".6" />
          <path d="M10 34v30M42 34v30" stroke={P.outlineWood} strokeWidth="1.6" />
          <rect x="14" y="56" width="18" height="8" fill="#8a7a6a" stroke="#5a4a3a" strokeWidth=".6" />
          {tier >= 2 ? <path d="M20 58q3-4 6 0" fill={P.orange} className="fest-glow" /> : null}
          <ellipse cx="23" cy="50" rx="9" ry="7" fill="#d9844a" stroke="#8a4220" strokeWidth=".7" />
          <path d="M23 43q0-6 6-6 h12" stroke="#d9844a" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <ellipse cx="20" cy="47" rx="3" ry="1.6" fill="#f0b07a" opacity=".7" />
          <rect x="40" y="38" width="8" height="16" rx="2" fill="#c47a48" stroke="#8a4220" strokeWidth=".6" />
          <path d="M44 54v4" stroke={P.waterLight} strokeWidth="1" strokeDasharray="1 1.4" />
          {Array.from({ length: bottles }, (_, i) => (
            <g key={i}>
              <path d={`M${50 + i * 5} 64v-6l1-2v-2h1.4v2l1 2v6z`} fill={[P.waterLight, '#c7a3e0', '#f5e08a', '#9fd0a0', '#f2b8b0'][i]} stroke="#4a6a78" strokeWidth=".4" />
            </g>
          ))}
          {tier >= 3 ? <Smoke x={23} y={40} /> : null}
          {tier >= 5 ? <path d="M48 44h24v-8h-24z" fill="#fbf3e0" stroke={P.outlineSoft} strokeWidth=".5" /> : null}
          {tier >= 5 ? <circle cx="52" cy="40" r="2" fill="#7a9a4a" /> : null}
          {winter ? <path d="M8 26h36" stroke={P.white} strokeWidth="2" /> : null}
        </Svg>
      )
    }
    case 'salbenkueche': {
      const jars = Math.min(6, tier + 1)
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={32} />
          <House x={8} w={34} h={22} wall={P.cream} roof="#7a5ab8" steep={13} />
          <rect x="32" y="26" width="5" height="10" fill="#8a7a6a" />
          <Smoke x={34.5} y={24} />
          <Window x={12} y={48} lit={tier >= 3} />
          <rect x="24" y="50" width="8" height="14" fill={P.bark} />
          <rect x="46" y="52" width="28" height="3" fill={P.woodMid} />
          <path d="M48 55v9M72 55v9" stroke={P.outlineWood} strokeWidth="1.2" />
          {Array.from({ length: jars }, (_, i) => (
            <Jar key={i} x={49.7 + i * 4.4} y={52} s={0.7} c={i % 2 ? P.cream : '#e8d4f0'} lid={i % 2 ? '#7a5ab8' : '#c4683a'} />
          ))}
          {tier >= 2 ? (
            <g>
              <path d="M66 44h7l-1 4h-5z" fill={P.stone} stroke="#6a5e4e" strokeWidth=".5" />
              <path d="M70 44l3 -5" stroke="#6a5e4e" strokeWidth="1.2" />
            </g>
          ) : null}
          {tier >= 4 ? <Flower s={0.7} r={1.6} x={14} y={63.92} c={P.orange} /> : null}
          {tier >= 4 ? <Flower s={0.7} r={1.6} x={18} y={64.92} c={P.lilac} /> : null}
          {winter ? <path d="M5 42 L25 29 L45 42" stroke={P.white} strokeWidth="2.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'teestube': {
      const tables = Math.min(3, 1 + Math.floor(tier / 2))
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={34} />
          <House x={32} w={40} h={22} wall="#fbf3e0" roof={P.leafDark} steep={12} />
          <Window x={36} y={48} lit={tier >= 2} />
          <Window x={60} y={48} lit={tier >= 2} />
          <rect x="49" y="50" width="8" height="14" fill={P.bark} />
          <path d="M44 34 h18 v4 h-18z" fill={P.cream} stroke={P.leafDark} strokeWidth=".5" />
          <path d="M50 36h6" stroke={P.leafDark} strokeWidth="1" />
          {Array.from({ length: tables }, (_, i) => {
            const x = 12 + (i % 2) * 12
            const y = 52 + Math.floor(i / 2) * 9 + (i % 2) * 4
            return (
              <g key={i}>
                <ellipse cx={x} cy={y} rx="6" ry="2.2" fill={P.cream} stroke={P.woodMid} strokeWidth=".5" />
                <path d={`M${x} ${y + 2}v6`} stroke={P.outlineWood} strokeWidth="1" />
                <ellipse cx={x - 1.4} cy={y - 1.6} rx="2" ry="1.6" fill={P.red} />
                <path d={`M${x + 0.6} ${y - 2}l1.6 -1`} stroke={P.red} strokeWidth=".7" />
                <rect x={x + 2} y={y - 2} width="1.8" height="1.4" fill={P.cream} stroke={P.woodMid} strokeWidth=".3" />
              </g>
            )
          })}
          {tier >= 5 ? <Bunting y={30} n={8} x0={4} x1={34} /> : null}
          {tier >= 3 ? <Pot x={30} y={64} s={0.67} /> : null}
          {tier >= 3 && !winter ? <ellipse cx="30" cy="55" rx="3.4" ry="3" fill="#5fae62" /> : null}
          {winter ? <path d="M29 34 L52 22 L75 34" stroke={P.white} strokeWidth="2.2" fill="none" /> : null}
        </Svg>
      )
    }
    case 'apothekergarten': {
      const quads = Math.min(4, tier)
      const cols = [P.lilac, P.yellow, P.cream, P.red]
      return (
        <Svg tier={tier}>
          <ellipse cx="40" cy="56" rx="36" ry="14" fill="#d9c79a" />
          {[
            [10, 46],
            [44, 46],
            [10, 57],
            [44, 57],
          ].map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="26" height="8" rx="2" fill={winter ? '#c9d4c0' : '#4f8a3a'} />
              <rect x={x! + 1.6} y={y! + 1.4} width="22.8" height="5.2" rx="1.4" fill={winter ? '#eef2f2' : '#7a5a34'} />
              {i < quads && !winter
                ? Array.from({ length: 6 }, (_, k) => <circle key={k} cx={x! + 4 + k * 3.6} cy={y! + 4} r="1.5" fill={spring && k % 2 ? '#8ab85a' : cols[i]} />)
                : null}
            </g>
          ))}
          <circle cx="40" cy="55" r="4" fill="#bdb3a0" stroke="#8a7e6e" strokeWidth=".6" />
          <path d="M40 55l2.6-2" stroke="#4a3a2a" strokeWidth=".8" />
          {tier >= 4 ? (
            <g>
              <path d="M26 42V30 Q40 18 54 30 V42" stroke={P.outlineWood} strokeWidth="1.6" fill="none" />
              {!winter ? Array.from({ length: 7 }, (_, k) => <circle key={k} cx={28 + k * 4} cy={30 - Math.sin((k / 6) * Math.PI) * 9} r="1.8" fill={k % 2 ? P.red : P.leaf} />) : null}
            </g>
          ) : null}
          {tier >= 5 ? (
            <g>
              <path d="M66 42q4 -8 8 0z" fill="#d9b84a" stroke={P.outlineSoft} strokeWidth=".5" />
              <path d="M66.6 40h6.8M67.6 38h4.8" stroke={P.outlineSoft} strokeWidth=".4" />
              {!winter ? <Bees n={3} cx={64} cy={34} /> : null}
            </g>
          ) : null}
        </Svg>
      )
    }
  }
  return null
}

/* ————————————— Kapitel 8: Botanischer Garten ————————————— */
