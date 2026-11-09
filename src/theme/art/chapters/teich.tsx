/** Kapitel-Grafik (Bauernhof, Imkerei, Teich): teich. */
import type { Season } from '../../ambient'
import { Svg, Roof, Window, Smoke, Pond, Lily, Reed, Fish, Boat, House } from '../../HandParts'
import { Bird, Shadow } from '../parts'
import { P } from '../palette'

export function Teich({ id, tier, season }: { id: string; tier: number; season?: Season }) {
  const frozen = season === 'winter'
  switch (id) {
    case 'seerosen':
      return (
        <Svg tier={tier}>
          <Pond frozen={frozen} />
          {!frozen
            ? Array.from({ length: Math.min(7, 2 + tier) }, (_, i) => (
                <Lily key={i} x={16 + ((i * 11) % 48)} y={46 + ((i * 7) % 12)} flower={i % 2 === 0 || tier >= 4 ? (i % 3 ? P.cream : P.pink) : undefined} />
              ))
            : null}
          {tier >= 3 && !frozen ? (
            <g transform="translate(52 48)">
              <ellipse cx="0" cy="0" rx="2.6" ry="1.8" fill="#4f8a3a" />
              <circle cx="-1" cy="-1.4" r=".7" fill={P.white} />
              <circle cx="1" cy="-1.4" r=".7" fill={P.white} />
            </g>
          ) : null}
        </Svg>
      )
    case 'schilf':
      return (
        <Svg tier={tier}>
          <Pond cy={56} ry={10} frozen={frozen} />
          {Array.from({ length: 5 + tier * 2 }, (_, i) => (
            <Reed key={i} x={8 + ((i * 9) % 64)} h={18 + ((i * 7) % 14)} />
          ))}
          {tier >= 3 && season !== 'winter' ? (
            <path className="bee" d="M60 30h8M64 30l-2-2M64 30l-2 2M64 30l2-2M64 30l2 2" stroke={P.waterDeep} strokeWidth=".8" />
          ) : null}
          {tier >= 4 ? (
            <g transform="translate(30 30)">
              <ellipse cx="0" cy="0" rx="3" ry="2" fill={P.woodMid} />
              <circle cx="2.6" cy="-1.4" r="1.4" fill={P.woodMid} />
              <path d="M3.8 -1.4l1.6 .4" stroke="#4a3a2a" strokeWidth=".6" />
            </g>
          ) : null}
        </Svg>
      )
    case 'karpfenteich':
      return (
        <Svg tier={tier}>
          <Pond frozen={frozen} />
          {!frozen
            ? Array.from({ length: Math.min(6, 1 + tier) }, (_, i) => (
                <Fish key={i} x={20 + ((i * 13) % 40)} y={48 + ((i * 5) % 10)} color={i % 2 ? P.woodMid : '#8a7a4a'} s={1.1} />
              ))
            : null}
          {tier >= 3 ? (
            <g>
              <rect x="66" y="44" width="6" height="14" fill={P.stone} stroke={P.outlineStone} strokeWidth=".6" />
              <path d="M66 48h6" stroke={P.outlineWood} strokeWidth="1.4" />
            </g>
          ) : null}
          {tier >= 5 ? <Lily x={22} y={44} flower={P.cream} /> : null}
        </Svg>
      )
    case 'forellenbach':
      return (
        <Svg tier={tier}>
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke="#7a8a4c" strokeWidth="16" fill="none" opacity=".5" />
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke={frozen ? '#cfe2ee' : P.water} strokeWidth={9 + tier} fill="none" strokeLinecap="round" />
          <path d="M6 26 C30 36 18 48 40 54 S70 58 76 66" stroke="#d6eef8" strokeWidth="1.6" fill="none" strokeDasharray="4 6" className="orchard-stream" />
          {Array.from({ length: 2 + tier }, (_, i) => (
            <ellipse key={i} cx={14 + i * 11} cy={34 + i * 5 + (i % 2) * 4} rx="3.6" ry="2.4" fill={P.stone} stroke={P.outlineStone} strokeWidth=".5" />
          ))}
          {tier >= 3 && !frozen ? (
            <g className="ha-jump">
              <Fish x={44} y={46} color="#c49a8a" />
            </g>
          ) : null}
        </Svg>
      )
    case 'steg':
      return (
        <Svg tier={tier}>
          <Pond frozen={frozen} />
          <rect x="10" y="44" width={24 + tier * 6} height="6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".7" />
          {Array.from({ length: 3 + tier }, (_, i) => (
            <path key={i} d={`M${12 + i * 6} 50v8`} stroke={P.outlineWood} strokeWidth="1.4" />
          ))}
          {tier >= 2 && !frozen ? <Boat x={54} y={56} color={P.tomato} /> : null}
          {tier >= 4 ? <path d="M30 44v-10l6 3-6 3" fill={P.yellow} stroke={P.outlineWood} strokeWidth=".6" /> : null}
        </Svg>
      )
    case 'fischerhuette':
      return (
        <Svg tier={tier}>
          <Pond cy={58} ry={9} frozen={frozen} />
          <path d="M20 58v-6M44 58v-6M32 58v-6" stroke={P.outlineWood} strokeWidth="1.6" />
          <rect x="18" y="36" width="28" height="16" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".8" />
          <Roof x={18} w={28} y={36} color="#3d5a8a" steep={10} />
          <Window x={22} y={41} lit={tier >= 3} />
          <rect x="34" y="42" width="7" height="10" fill="#5a3d22" />
          {tier >= 2 ? (
            <g stroke="#6a5a4a" strokeWidth=".5" fill="none">
              <path d="M50 30h20v18H50z" />
              {Array.from({ length: 5 }, (_, i) => (
                <path key={i} d={`M${50 + i * 4} 30v18M50 ${30 + i * 4}h20`} />
              ))}
            </g>
          ) : null}
          {tier >= 4 ? <Boat x={62} y={58} color={P.waterDeep} /> : null}
          {tier >= 3 ? <g><path d="M8 46 V62" stroke={P.outlineWood} strokeWidth="1" /><path d="M8 48 q6 4 10 0" stroke={P.stone} strokeWidth=".6" fill="none" /></g> : null}
        </Svg>
      )
    case 'raeucherei':
      return (
        <Svg tier={tier}>
          <Shadow grid="chapter" rx={30} />
          <House x={20} w={26} h={22} wall={P.outlineSoft} roof="#4a3a2a" steep={11} />
          <rect x="38" y="30" width="5" height="12" fill={P.outlineWood} />
          <Smoke x={40} y={28} />
          <rect x="27" y="50" width="9" height="14" fill="#3a2a1a" />
          {Array.from({ length: Math.min(5, tier + 1) }, (_, i) => (
            <g key={i}>
              <path d={`M${52 + i * 5} 40v3`} stroke={P.outlineWood} strokeWidth=".4" />
              <path d={`M${52 + i * 5} 43q-1.6 4 0 8q1.6 -4 0 -8z`} fill="#c4783a" />
            </g>
          ))}
          <path d="M50 40h26" stroke={P.outlineWood} strokeWidth="1.2" />
        </Svg>
      )
    case 'bootsverleih':
      return (
        <Svg tier={tier}>
          <Pond frozen={frozen} />
          <rect x="6" y="40" width="40" height="5" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          {[10, 20, 30, 40].map((x) => (
            <path key={x} d={`M${x} 45v7`} stroke={P.outlineWood} strokeWidth="1.2" />
          ))}
          {!frozen
            ? [P.tomato, P.waterDeep, P.yellow, P.leafLight, P.cream].slice(0, Math.min(5, 1 + tier)).map((c, i) => (
                <Boat key={c} x={16 + i * 12} y={54 + (i % 2) * 4} color={c} flip={i % 2 === 1} />
              ))
            : null}
          {tier >= 3 ? (
            <g>
              <rect x="56" y="28" width="16" height="8" rx="1" fill={P.cream} stroke={P.outlineWood} strokeWidth=".6" />
              <path d="M60 36v6M68 36v6" stroke={P.outlineWood} strokeWidth="1" />
            </g>
          ) : null}
        </Svg>
      )
    case 'entenbucht':
      return (
        <Svg tier={tier}>
          <Pond frozen={frozen} />
          <Reed x={66} h={20} />
          <Reed x={70} h={16} />
          <Bird x={26} y={50} color={P.outlineSoft} neck={P.leafDark} swim />
          {tier >= 2 ? <Bird x={44} y={56} color={P.woodMid} neck={P.woodMid} swim flip /> : null}
          {tier >= 3 ? <Bird x={34} y={46} color={P.woodMid} neck={P.woodMid} swim /> : null}
          {tier >= 4 ? <Bird x={54} y={48} color={P.orange} neck={P.blue} swim flip /> : null}
          {tier >= 5 ? <Bird x={18} y={56} color={P.cream} neck={P.cream} swim /> : null}
        </Svg>
      )
    case 'seefest':
      return (
        <Svg tier={tier}>
          <Pond frozen={frozen} />
          <rect x="24" y="48" width="32" height="6" fill={P.woodMid} stroke={P.outlineWood} strokeWidth=".6" />
          <path d="M26 48V34M54 48V34" stroke={P.outlineWood} strokeWidth="1.4" />
          <path d="M22 34 Q40 24 58 34z" fill={P.tomato} />
          <path d="M4 26 Q40 40 76 26" stroke={P.outlineWood} strokeWidth=".6" fill="none" />
          {Array.from({ length: Math.min(7, 2 + tier) }, (_, i) => {
            const x = 8 + i * 10
            const y = 26 + Math.sin((x / 80) * Math.PI) * 7
            return <circle key={i} className="fest-glow" cx={x} cy={y + 2} r="2" fill={['#f5a83a', P.red, P.waterLight, P.yellow][i % 4]} />
          })}
          {tier >= 4 ? (
            <g fill="#4a3a2a">
              <circle cx="34" cy="44" r="1.6" />
              <rect x="33" y="45.4" width="2" height="3" />
              <circle cx="46" cy="44" r="1.6" />
              <rect x="45" y="45.4" width="2" height="3" />
            </g>
          ) : null}
        </Svg>
      )
  }
  return null
}

/** Gesperrte Ecke am Teich: Schlamm und Schilf. */
export function TeichWild({ seed = 0 }: { seed?: number }) {
  return (
    <Svg>
      <ellipse cx="40" cy="58" rx="28" ry="8" fill="#6e5a3a" opacity=".6" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${16 + i * 8} 62q${i % 2 ? 2 : -2} -${12 + ((i + seed) % 3) * 4} ${i % 2 ? 4 : -2} -${18 + ((i + seed) % 4) * 3}`} stroke="#8a8a5a" strokeWidth="1.4" fill="none" />
      ))}
      <ellipse cx="54" cy="58" rx="6" ry="2" fill="#5f7a8a" opacity=".6" />
    </Svg>
  )
}
