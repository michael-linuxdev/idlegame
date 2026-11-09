/** Kulisse der allgemeinen Kapitel-Karten (aus BackdropSpec). */
import { memo } from 'react'
import { ChapterPath } from '../../ChapterPaths'
import type { BackdropSpec } from '../../chapterArtSpecs'
import { ArtSvg } from '../../ArtSvg'
import { useSvgId } from '../../svgId'
import { P } from '../palette'

export const ChapterBackdrop = memo(function ChapterBackdrop({ spec, stage }: { spec: BackdropSpec; stage: number }) {
  const [far, mid, near] = spec.grass
  const id = useSvgId('cb-grass')
  return (
    <div className="garden-ground chapter-ground" aria-hidden="true" data-stage={stage}>
      <ArtSvg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={far} />
            <stop offset="55%" stopColor={mid} />
            <stop offset="100%" stopColor={near} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${id})`} />
        {spec.stripes
          ? Array.from({ length: 10 }, (_, i) => (
              <path key={i} d={`M0 ${28 + i * 7.4} Q50 ${25 + i * 7.4} 100 ${28 + i * 7.4}`} stroke={spec.stripes} strokeWidth="3" fill="none" vectorEffect="non-scaling-stroke" opacity="0.35" />
            ))
          : null}
        {spec.fields
          ? [
              [4, 30, 30, 14, '#b8c46a'],
              [62, 28, 34, 12, '#c9b070'],
              [6, 74, 26, 12, '#a3b85a'],
              [68, 76, 28, 14, '#d4c27a'],
              [30, 92, 40, 8, '#b0c060'],
            ].map(([x, y, w, h, c], i) => (
              <g key={i}>
                <rect x={x as number} y={y as number} width={w as number} height={h as number} fill={c as string} opacity="0.55" />
                {Array.from({ length: 4 }, (_, k) => (
                  <path key={k} d={`M${x} ${(y as number) + 2 + k * ((h as number) / 4)}h${w}`} stroke={P.outlineSoft} strokeWidth="1" vectorEffect="non-scaling-stroke" opacity=".25" />
                ))}
              </g>
            ))
          : null}
        {spec.bigLake ? (
          <g>
            <ellipse cx="50" cy="60" rx="34" ry="16" fill="#7a8a4c" opacity=".45" />
            <ellipse cx="50" cy="60" rx="32" ry="14.5" fill="#5f9ec4" />
            <ellipse cx="42" cy="55" rx="12" ry="3" fill={P.white} opacity=".18" />
          </g>
        ) : null}
        {spec.herbGarden
          ? [
              [1, 42, 10, 4.4],
              [89, 40, 10, 4.4],
              [1, 66, 10, 4.4],
              [89, 64, 10, 4.4],
            ].map(([x, y, w, h], i) => (
              <g key={`hb${i}`}>
                <rect x={x} y={y} width={w} height={h} fill="#4f8a3a" />
                <rect x={x! + 1} y={y! + 0.6} width={w! - 2} height={h! - 1.2} fill={P.outlineSoft} />
                {Array.from({ length: 3 }, (_, k) => (
                  <ellipse key={k} cx={x! + 2.4 + k * ((w! - 4.8) / 2)} cy={y! + h! / 2} rx="1" ry=".5" fill={[P.lilac, P.yellow, P.cream][(i + k) % 3]} />
                ))}
              </g>
            ))
          : null}
        {spec.glasshouse ? (
          <g>
            {[
              [6, 44],
              [94, 42],
              [8, 72],
              [92, 70],
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="4" ry="1.9" fill={i % 2 ? '#4f8f3c' : P.leaf} />
            ))}
          </g>
        ) : null}
        {spec.alps
          ? [
              [5, 42, 0],
              [95, 40, 1],
              [4, 70, 2],
              [96, 74, 0],
              [50, 96, 1],
            ].map(([x, y, k], i) =>
              k === 1 ? (
                <path key={`al${i}`} d={`M${x} ${y} l-3 6 h6z`} fill="#2f6a3a" />
              ) : (
                <path key={`al${i}`} d={`M${x! - 3} ${y} l1.6 -2.4 h2.6 l1.8 2.4z`} fill={P.stone} />
              ),
            )
          : null}
        {spec.provence
          ? [
              [4, 44],
              [96, 40],
              [3, 72],
              [97, 70],
            ].map(([x, y], i) => <path key={`pv${i}`} d={`M${x} ${y} q-2 -4 0 -9 q2 5 0 9z`} fill="#2f5a3a" />)
          : null}
        {spec.japan ? (
          <g>
            <ellipse cx="50" cy="62" rx="20" ry="9" stroke="#e8e2d0" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" opacity=".8" />
            <ellipse cx="50" cy="62" rx="24" ry="11" stroke="#e8e2d0" strokeWidth="1.4" fill="none" vectorEffect="non-scaling-stroke" opacity=".6" />
            {[
              [5, 44],
              [95, 42],
              [6, 74],
              [94, 72],
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="2.8" ry="1.3" fill={i % 2 ? '#c4402a' : '#a83a2a'} opacity=".85" />
            ))}
          </g>
        ) : null}
        {spec.showground
          ? [
              [5, 44, P.red],
              [95, 42, P.yellow],
              [5, 74, P.lilac],
              [95, 72, P.orange],
            ].map(([x, y, c], i) => (
              <g key={`sg${i}`}>
                <ellipse cx={x as number} cy={y as number} rx="4.4" ry="2.1" fill="#4f8a3a" />
                <ellipse cx={x as number} cy={y as number} rx="3.4" ry="1.5" fill={c as string} />
                <ellipse cx={x as number} cy={y as number} rx="1.4" ry=".7" fill={P.cream} />
              </g>
            ))
          : null}
        {spec.water === 'lake' ? <ellipse cx="50" cy="62" rx="16" ry="7" fill={P.water} opacity="0.9" /> : null}
        {spec.water === 'river' ? (
          <path d="M100 58 C90 64 96 72 86 78 C78 84 84 92 76 100" stroke={P.water} strokeWidth="14" fill="none" vectorEffect="non-scaling-stroke" />
        ) : null}
        {spec.way ? (
          <ChapterPath style={spec.way} color={spec.path} />
        ) : (
          <path
            d="M50 100 C46 90 40 86 44 78 C48 70 58 68 54 58 C50 50 40 48 46 40 C50 34 52 30 50 22"
            stroke={spec.path}
            strokeWidth="14"
            fill="none"
            vectorEffect="non-scaling-stroke"
            opacity="0.9"
          />
        )}
        {Array.from({ length: 30 }, (_, i) => (
          <circle key={i} cx={(i * 37) % 100} cy={26 + ((i * 53) % 72)} r="0.4" fill={[P.white, P.yellow, P.lilac][i % 3]} opacity={stage >= i % 10 ? 0.8 : 0.2} />
        ))}
      </ArtSvg>
      <div className="garden-hedge orchard-hills">
        <ArtSvg viewBox="0 0 400 60" preserveAspectRatio="none">
          {spec.mountains ? (
            <g>
              <path d="M0 60 L60 6 L110 40 L170 0 L240 44 L300 10 L360 38 L400 20 V60z" fill="#9aa8b6" />
              <path d="M50 14 L60 6 L70 14 M160 8 L170 0 L180 8 M290 18 L300 10 L310 18" stroke={P.white} strokeWidth="5" fill="none" />
            </g>
          ) : null}
          {spec.alps ? (
            <g>
              <path d="M0 60 L50 4 L96 34 L150 0 L214 40 L262 6 L330 36 L372 12 L400 24 V60z" fill="#8a9aae" />
              <path d="M0 60 L50 4 L70 26 L60 60z M150 0 L176 22 L160 60 L130 60z M262 6 L290 30 L276 60 L240 60z" fill="#7a8a9e" />
              <path d="M38 18 L50 4 L64 20 L56 17 L50 22 L44 16z M136 16 L150 0 L166 18 L157 14 L150 20 L143 13z M250 20 L262 6 L276 22 L268 18 L262 24 L256 18z M364 20 L372 12 L382 20 L376 18z" fill={P.white} />
            </g>
          ) : null}
          {spec.japan ? (
            <g>
              <path d="M150 60 L230 4 Q240 0 250 4 L330 60z" fill="#8a9aae" />
              <path d="M216 14 L230 4 Q240 0 250 4 L264 14 L254 12 L246 18 L238 11 L228 17z" fill={P.white} />
            </g>
          ) : null}
          <path d="M0 60 V30 Q60 8 140 26 T280 18 T400 24 V60z" fill={spec.hills[0]} />
          {spec.provence ? (
            <g>
              {[40, 60, 76, 340, 360].map((x, i) => (
                <path key={i} d={`M${x} 48 q-5 -14 0 -30 q5 16 0 30z`} fill="#2f5a3a" />
              ))}
              <rect x="150" y="26" width="22" height="14" fill="#e8d4a8" />
              <path d="M148 26 L161 18 L174 26z" fill={P.roof} />
              <rect x="176" y="22" width="26" height="18" fill={P.paper} />
              <path d="M174 22 L189 14 L204 22z" fill={P.roof} />
              <rect x="206" y="10" width="10" height="30" fill="#e8d4a8" />
              <path d="M204 10 L211 2 L218 10z" fill={P.roof} />
              <rect x="220" y="28" width="20" height="12" fill="#e8d4a8" />
              <path d="M218 28 L230 20 L242 28z" fill={P.roof} />
            </g>
          ) : null}
          {spec.japan ? (
            <g>
              <rect x="56" y="30" width="16" height="16" fill="#a83a2a" />
              <path d="M48 32 Q64 24 80 32z M50 22 Q64 14 78 22z M52 12 Q64 6 76 12z" fill={P.charcoal} />
              <rect x="58" y="22" width="12" height="8" fill="#a83a2a" />
              <rect x="60" y="12" width="8" height="8" fill="#a83a2a" />
              <path d="M64 6v-6" stroke={P.charcoal} strokeWidth="1.6" />
              {[320, 344, 370].map((x) => (
                <circle key={x} cx={x} cy={32} r="11" fill="#c4402a" />
              ))}
            </g>
          ) : null}
          {spec.showground ? (
            <g>
              <circle cx="70" cy="24" r="20" fill="none" stroke={P.cream} strokeWidth="2" />
              {Array.from({ length: 8 }, (_, i) => {
                const a = (i / 8) * Math.PI * 2
                return (
                  <g key={i}>
                    <path d={`M70 24 L${70 + Math.cos(a) * 20} ${24 + Math.sin(a) * 20}`} stroke={P.cream} strokeWidth="1" />
                    <rect x={70 + Math.cos(a) * 20 - 3} y={24 + Math.sin(a) * 20} width="6" height="5" rx="1" fill={[P.red, P.blue, P.yellow, P.leaf][i % 4]} />
                  </g>
                )
              })}
              <path d="M60 50 L70 24 L80 50" stroke={P.cream} strokeWidth="2" fill="none" />
              <path d="M300 44 V26 L330 12 L360 26 V44z" fill={P.cream} />
              <path d="M300 26 L330 12 L360 26" stroke={P.tomato} strokeWidth="3" fill="none" />
              {[150, 190, 230, 270].map((x, i) => (
                <g key={x}>
                  <path d={`M${x} 46 V14`} stroke={P.outlineSoft} strokeWidth="1.4" />
                  <path d={`M${x} 14 l12 4 -12 4z`} fill={[P.red, P.blue, P.yellow, P.lilac][i]} />
                </g>
              ))}
            </g>
          ) : null}

          {spec.herbGarden ? (
            <g>
              <rect x="0" y="34" width="400" height="14" fill="#b8654a" />
              {Array.from({ length: 20 }, (_, i) => (
                <path key={i} d={`M${i * 20} 34v14M${i * 20 + 10} 41v7M0 41h400`} stroke="#8a4a32" strokeWidth="1" />
              ))}
              <rect x="0" y="31" width="400" height="4" fill="#d9c0a0" />
              <path d="M188 48 V34 a12 12 0 0 1 24 0 V48z" fill="#5a3d22" />
              <path d="M200 22 v26" stroke="#3a2a1a" strokeWidth="1" />
              <rect x="300" y="16" width="38" height="24" fill={P.cream} />
              <path d="M296 16 L319 2 L342 16z" fill="#7a5ab8" />
              <rect x="314" y="26" width="10" height="14" fill={P.bark} />
              <rect x="306" y="20" width="6" height="5" fill={P.waterLight} />
              <rect x="326" y="20" width="6" height="5" fill={P.waterLight} />
            </g>
          ) : null}
          {spec.glasshouse ? (
            <g>
              <path d="M130 44 V26 Q200 -14 270 26 V44z" fill="#cfe8f4" opacity=".85" stroke={P.white} strokeWidth="1.6" />
              <path d="M170 44 V14 M200 44 V6 M230 44 V14 M130 32 H270" stroke={P.white} strokeWidth="1.2" />
              <path d="M184 18 Q200 -2 216 18z" fill="#e8f4fa" stroke={P.white} strokeWidth="1.2" />
              <path d="M200 2 v-6" stroke={P.outlineWood} strokeWidth="1.4" />
              <path d="M150 40 q6 -14 12 -12 M244 40 q-4 -14 -10 -14" stroke={P.leaf} strokeWidth="3" fill="none" />
              {[40, 80, 330, 370].map((x) => (
                <circle key={x} cx={x} cy={30} r="12" fill="#4f8f3c" />
              ))}
            </g>
          ) : null}
          {spec.alps ? (
            <g>
              {Array.from({ length: 9 }, (_, i) => {
                const x = 10 + i * 44 + (i % 2) * 8
                return <path key={i} d={`M${x} 46 L${x + 6} 28 L${x + 12} 46z`} fill="#2f5a2e" />
              })}
              <rect x="300" y="26" width="16" height="14" fill={P.cream} />
              <path d="M298 26 L308 16 L318 26z" fill="#8a3a2a" />
              <rect x="304" y="12" width="5" height="10" fill={P.cream} />
              <path d="M303 12 L306.5 4 L310 12z" fill="#8a3a2a" />
            </g>
          ) : null}

          {spec.forest
            ? Array.from({ length: 26 }, (_, i) => {
                const x = i * 16 - 4
                const h = 26 + ((i * 7) % 12)
                return <path key={i} d={`M${x} 60 L${x + 8} ${60 - h} L${x + 16} 60z`} fill={i % 2 ? '#2f5a2e' : '#3a6a34'} />
              })
            : null}
          {spec.fields ? (
            <g>
              <rect x="300" y="22" width="26" height="16" fill={P.paper} />
              <path d="M296 22 L313 10 L330 22z" fill="#b8403a" />
              <rect x="334" y="16" width="8" height="22" fill="#c9d0d8" />
              <path d="M334 16 a4 3 0 0 1 8 0" fill="#9aa8b6" />
            </g>
          ) : null}
          <path d="M0 60 V42 Q90 26 180 40 T400 34 V60z" fill={spec.hills[1]} />
        </ArtSvg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})
