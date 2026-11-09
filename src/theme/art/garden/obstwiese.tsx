/** Hauptgarten-Bereich: obstwiese. */
import { Crate, Shadow, Tree } from '../parts'
import { P, tone } from '../palette'
import { LEAF, LEAF_D, LEAF_L, OUT, SOIL, WOOD } from './shared'

export function Obstwiese({ t }: { t: number }) {
  return (
    <g>
      <Shadow rx={44} />
      {t === 1 ? (
        <g className="t-new" style={{ ["--i" as string]: 1 }}>
          <rect x="58" y="22" width="2.4" height="50" fill={WOOD} />
          <path d="M50 72 V40" stroke={P.bark} strokeWidth="3.2" />
          <path d="M50 52 L59 46" stroke={P.stoneDark} strokeWidth="1" />
          <circle cx="50" cy="34" r="14" fill={LEAF} stroke={OUT} strokeWidth="1.2" />
          <circle cx="45" cy="31" r="7.4" fill={LEAF_L} />
          <circle cx="56" cy="38" r="5" fill={LEAF_D} opacity="0.5" />
          {/* mulch ring */}
          <ellipse cx="50" cy="72" rx="16" ry="4" fill={SOIL} />
        </g>
      ) : null}
      {t === 2 ? <g className="t-new" style={{ ["--i" as string]: 5 }}><Tree x={50} y={72} r={19} trunk={20} fruit={P.red} /></g> : null}
      {t === 3 ? (
        <g className="t-new" style={{ ["--i" as string]: 2 }}>
          <Tree x={36} y={72} r={17} trunk={18} fruit={P.red} />
          <Tree x={70} y={72} r={12} trunk={12} fruit={tone('#d6c23a')} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          <Tree x={28} y={72} r={17} trunk={20} fruit={P.red} />
          {t >= 5 ? <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}><Tree x={50} y={66} r={15} trunk={22} fruit={P.plum} /></g> : null}
          <Tree x={74} y={72} r={16} trunk={18} fruit={tone('#d6c23a')} />
          {/* ladder */}
          <path d="M60 74 L66 40 M66 74 L72 40" stroke={WOOD} strokeWidth="1.8" />
          {[46, 54, 62, 70].map((y) => (
            <path key={y} d={`M${60 + (74 - y) * 0.18} ${y} H${66 + (74 - y) * 0.18}`} stroke={WOOD} strokeWidth="1.4" />
          ))}
          <Crate x={17} y={77} fruit={P.red} />
          {t >= 5 ? (
            <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
              <Crate x={87} y={79} fruit={tone('#d6c23a')} />
              <Crate x={18} y={68} fruit={P.plum} />
            </g>
          ) : null}
        </g>
      ) : null}
    </g>
  )
}
