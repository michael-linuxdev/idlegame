/** Hauptgarten-Bereich: obstwiese (kräftiger Stil, parts/bold.tsx). */
import { Crate, Fruit, Shadow, Tree, useSeason } from '../parts'
import { Post } from '../parts/bold'
import { BOLD, boldDetail, boldLine } from '../parts/style'
import { P, tone } from '../palette'
import { LEAF, LEAF_D, LEAF_L, OUT, Rod, SOIL } from './shared'

const line = boldLine()
const detail = boldDetail()
const PEAR = tone('#d6c23a')

/** Grasbüschel am Stammfuß. */
function Tuft({ x, y }: { x: number; y: number }) {
  return <path d={`M${x - 4} ${y} l1.4 -5 l1.6 3.4 l1.2 -6 l1.6 6 l1.4 -3.6 l1.2 5.2 z`} fill={LEAF_L} stroke={OUT} strokeWidth={BOLD.hair} strokeLinejoin="round" />
}

export function Obstwiese({ t }: { t: number }) {
  const season = useSeason()
  const winter = season === 'winter'
  return (
    <g>
      <Shadow rx={t === 1 ? 28 : t === 2 ? 34 : t === 3 ? 40 : 46} />
      {t === 1 ? (
        <g className="t-new" style={{ ["--i" as string]: 1 }}>
          {/* Jungbaum am Pfahl */}
          <ellipse cx="50" cy="75" rx="15" ry="4.4" fill={SOIL} {...detail} />
          <Post x={59} y={75} h={44} w={3.2} fill={P.woodLight} />
          <Rod d="M50 75 V44" c={P.bark} w={2.6} />
          <path d="M50 56 L59 51" stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
          <circle cx="50" cy="37" r="12.5" fill={winter ? P.winterLeaf : LEAF} {...line} />
          <circle cx="46" cy="33" r="6.4" fill={winter ? P.winterLeafLight : LEAF_L} />
          <path d="M55 30 a9.6 9.6 0 0 1 2 14 a12.5 12.5 0 0 0 -2 -14 z" fill={LEAF_D} opacity="0.5" />
        </g>
      ) : null}
      {t === 2 ? (
        <g className="t-new" style={{ ["--i" as string]: 5 }}>
          <Tree x={50} y={75} r={17} trunk={17} fruit={P.red} />
          <Tuft x={40} y={77} />
          <Tuft x={61} y={78} />
        </g>
      ) : null}
      {t === 3 ? (
        <g className="t-new" style={{ ["--i" as string]: 2 }}>
          <Tree x={34} y={75} r={18.5} trunk={19} fruit={P.red} />
          <Tree x={73} y={76} r={13} trunk={13} fruit={PEAR} />
          <Tuft x={22} y={78} />
          <Tuft x={84} y={79} />
          <Crate x={53} y={81} fruit={P.red} s={1.1} />
        </g>
      ) : null}
      {t >= 4 ? (
        <g className={t === 4 ? 't-new' : undefined} style={{ ["--i" as string]: 3 }}>
          {t >= 5 ? <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 0 }}><Tree x={52} y={66} r={17} trunk={24} fruit={P.plum} /></g> : null}
          <Tree x={27} y={75} r={20} trunk={21} fruit={P.red} />
          <Tree x={76} y={76} r={17} trunk={18} fruit={PEAR} />
          {/* Leiter */}
          <Rod d="M62 78 L68 42 M70 78 L76 42" c={P.woodLight} w={1.5} />
          <path d="M63.4 70 H71 M64.7 62 H72.3 M66 54 H73.7 M67.3 46.5 H75" stroke={OUT} strokeWidth={BOLD.detail + 0.4} strokeLinecap="round" />
          <Tuft x={8} y={78} />
          <Crate x={55} y={83} fruit={P.red} s={1.15} />
          {!winter ? (
            <g>
              {/* Fallobst */}
              <Fruit cx={18} cy={80} r={2.3} c={P.red} />
              <Fruit cx={88} cy={81} r={2.3} c={PEAR} />
            </g>
          ) : null}
          {t >= 5 ? (
            <g className={t === 5 ? 't-new' : undefined} style={{ ["--i" as string]: 4 }}>
              {/* Schaukel am großen Apfelbaum */}
              <path d="M34 58 V70 M44 56 V70" stroke={OUT} strokeWidth={BOLD.detail} strokeLinecap="round" />
              <rect x="31.5" y="69" width="15" height="3.6" rx="1.2" fill={P.woodLight} {...detail} />
              <Crate x={87.5} y={84} fruit={PEAR} s={1.15} />
              <Crate x={55} y={73.6} fruit={P.plum} s={1.05} />
            </g>
          ) : null}
        </g>
      ) : null}
    </g>
  )
}
