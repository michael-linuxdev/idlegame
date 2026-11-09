/** Streuobstwiese backdrop: meadow, stream, path, hills with a barn. */
import { memo } from 'react'
import { useSvgId } from './svgId'

const PATH = 'M50 100 C46 90 40 86 44 78 C48 70 58 68 54 58 C50 50 40 48 46 40 C50 34 52 30 50 22'

export const OrchardBackdrop = memo(function OrchardBackdrop({ stage }: { stage: number }) {
  const grass = useSvgId('og-grass')
  return (
    <div className="garden-ground orchard-ground" aria-hidden="true" data-stage={stage}>
      <svg className="garden-ground-svg" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={grass} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a9cf7a" />
            <stop offset="50%" stopColor="#93c167" />
            <stop offset="100%" stopColor="#7fb058" />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#${grass})`} />
        {/* gentle hill bands */}
        <path d="M0 30 Q30 24 60 30 T100 28 V100 H0z" fill="#ffffff" opacity="0.05" />
        <path d="M0 52 Q40 44 70 52 T100 50 V100 H0z" fill="#ffffff" opacity="0.05" />
        {/* stream */}
        <path d="M100 58 C92 62 96 70 88 76 C80 82 86 92 78 100" stroke="#6aa6c9" strokeWidth="14" fill="none" vectorEffect="non-scaling-stroke" opacity="0.9" />
        <path d="M100 58 C92 62 96 70 88 76 C80 82 86 92 78 100" stroke="#a9d6ee" strokeWidth="5" fill="none" vectorEffect="non-scaling-stroke" strokeDasharray="6 8" className="orchard-stream" />
        {/* meadow path */}
        <path d={PATH} stroke="#b8a070" strokeWidth="22" fill="none" vectorEffect="non-scaling-stroke" opacity="0.55" />
        <path d={PATH} stroke="#d9c79a" strokeWidth="16" fill="none" vectorEffect="non-scaling-stroke" />
        {/* meadow flowers */}
        {Array.from({ length: 40 }, (_, i) => {
          const x = (i * 37) % 100
          const y = 24 + ((i * 53) % 74)
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="0.45"
              fill={['#ffffff', '#f5c542', '#c77dd1', '#f28ab2'][i % 4]}
              opacity={stage >= (i % 10) ? 0.9 : 0.25}
            />
          )
        })}
      </svg>
      <div className="garden-hedge orchard-hills">
        <svg viewBox="0 0 400 60" preserveAspectRatio="none" focusable="false">
          <path d="M0 60 V30 Q50 6 110 26 T230 20 T340 24 T400 18 V60z" fill="#6f9c4c" />
          <path d="M0 60 V42 Q70 24 150 40 T300 36 T400 34 V60z" fill="#5d8a3f" />
          <g fill="#8a6a40">
            <path d="M188 30 l12 -10 l12 10 v14 h-24z" />
          </g>
          <path d="M186 30 l14 -12 l14 12" stroke="#b8403a" strokeWidth="4" fill="none" />
        </svg>
      </div>
      <div className="garden-fence">
        <svg viewBox="0 0 400 30" preserveAspectRatio="none" focusable="false">
          <path d="M0 14 H400 M0 22 H400" stroke="#8a6a40" strokeWidth="2.4" />
          {Array.from({ length: 21 }, (_, i) => (
            <rect key={i} x={i * 20 - 2} y="6" width="4" height="24" fill="#a5733f" />
          ))}
        </svg>
      </div>
      <div className="ambient-tint" />
    </div>
  )
})
