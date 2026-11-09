import { memo } from 'react'
import { ArtSvg } from '../theme/ArtSvg'
import { P } from '../theme/art/palette'

/**
 * Jonas, the Gartenhelfer, pushing a wheelbarrow up and down the garden path
 * while he is switched on. Pure CSS animation (expansion.css .helper-walker):
 * moved with transform inside a size container (no layout per frame).
 */
export const HelperWalker = memo(function HelperWalker({ variant = 'garden' }: { variant?: 'garden' | 'orchard' | 'ilse' }) {
  if (variant === 'ilse') return <IlseWalker />
  return (
    <div className="helper-track" aria-hidden="true">
    <div className={`helper-walker ${variant}`}>
      <ArtSvg viewBox="0 0 48 40">
        <ellipse cx="24" cy="37" rx="18" ry="2.6" fill="rgba(40,32,12,0.22)" />
        {/* wheelbarrow */}
        <path d="M4 20h20l-3 8H8z" fill={P.roof} stroke="#7a2e22" strokeWidth="1.2" strokeLinejoin="round" />
        <circle cx="7" cy="18" r="3" fill={P.leafLight} />
        <circle cx="12" cy="17" r="3.2" fill={P.red} />
        <circle cx="17.5" cy="18" r="3" fill={P.yellow} />
        <circle cx="10" cy="31" r="3.4" fill="#4a3a2a" stroke="#2a2018" strokeWidth="1" />
        <path d="M22 26l9 4" stroke={P.outlineWood} strokeWidth="1.8" strokeLinecap="round" />
        {/* Jonas: drei Laufbilder (hw-f1–3) beim Gehen, an den Bereichen gießt er (hw-pause) */}
        <g className="hw-walk">
          <g className="hw-f hw-f1">
            <path d="M33 29l-3 7M35 29l3 7" stroke="#3d5a8a" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g className="hw-f hw-f2">
            <path d="M33 29l-.6 7M35 29l.6 7" stroke="#3d5a8a" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <g className="hw-f hw-f3">
            <path d="M33 29l1.6 7M35 29l-1.6 7" stroke="#3d5a8a" strokeWidth="2.6" strokeLinecap="round" />
          </g>
          <path d="M31 22l-2 6" stroke={P.skin} strokeWidth="2.2" strokeLinecap="round" />
        </g>
        <g className="hw-pause">
          <path d="M33 29l-1 7M35 29l1 7" stroke="#3d5a8a" strokeWidth="2.6" strokeLinecap="round" />
          {/* Gießkanne, Arm nach vorn, Tropfen */}
          <path d="M37 22l5 3" stroke={P.skin} strokeWidth="2.2" strokeLinecap="round" />
          <path d="M40 24h6v5h-6z" fill={P.water} stroke={P.outline} strokeWidth=".6" />
          <path d="M46 25l2.6-2" stroke={P.water} strokeWidth="1.2" />
          <path d="M48.4 24.4v2M47.4 26v2" stroke={P.waterLight} strokeWidth=".9" strokeLinecap="round" />
        </g>
        <rect x="30.5" y="17" width="7" height="13" rx="3" fill={P.leaf} stroke={P.leafDark} strokeWidth="1" />
        <circle cx="34" cy="13" r="4" fill={P.skin} stroke={P.outlineSoft} strokeWidth=".8" />
        <ellipse cx="34" cy="10" rx="6.5" ry="1.8" fill="#e8c770" stroke={P.outlineSoft} strokeWidth=".8" />
        <path d="M30.8 9.8c.3-2.4 1.4-3.4 3.2-3.4s2.9 1 3.2 3.4z" fill="#f0d488" stroke={P.outlineSoft} strokeWidth=".8" />
      </ArtSvg>
    </div>
    </div>
  )
})

/** Oma Ilse with headscarf and a basket, slowly walking the chapter path. */
function IlseWalker() {
  return (
    <div className="helper-track" aria-hidden="true">
    <div className="helper-walker ilse">
      <ArtSvg viewBox="0 0 48 40">
        <ellipse cx="24" cy="37" rx="14" ry="2.4" fill="rgba(40,32,12,0.22)" />
        <g className="hw-walk">
          <g className="hw-f hw-f1">
            <path d="M22 30l-2 6M26 30l2 6" stroke="#4a3a2a" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <g className="hw-f hw-f2">
            <path d="M22 30l-.4 6M26 30l.4 6" stroke="#4a3a2a" strokeWidth="2.2" strokeLinecap="round" />
          </g>
          <g className="hw-f hw-f3">
            <path d="M22 30l1.2 6M26 30l-1.2 6" stroke="#4a3a2a" strokeWidth="2.2" strokeLinecap="round" />
          </g>
        </g>
        <g className="hw-pause">
          <path d="M22 30l-1 6M26 30l1 6" stroke="#4a3a2a" strokeWidth="2.2" strokeLinecap="round" />
          {/* bückt sich und pflückt eine Blume */}
          <path d="M19.5 21l-5 7" stroke="#f2d2b0" strokeWidth="2" strokeLinecap="round" />
          <path d="M14 28v4" stroke={P.leafDark} strokeWidth=".9" />
          <circle cx="14" cy="27.4" r="1.6" fill={P.pink} />
        </g>
        <path d="M18 31l3-14h6l3 14z" fill="#3d5a8a" stroke="#2a3f63" strokeWidth=".8" />
        <path d="M19 22h10" stroke={P.cream} strokeWidth="2" />
        <circle cx="24" cy="12" r="4" fill="#f2d2b0" stroke={P.outlineSoft} strokeWidth=".7" />
        <path d="M19.6 12c0-4 2-6.2 4.4-6.2s4.4 2.2 4.4 6.2c-1-1.6-2.4-2.6-4.4-2.6s-3.4 1-4.4 2.6z" fill={P.roof} />
        <path d="M30 22l6 2" stroke="#f2d2b0" strokeWidth="2" strokeLinecap="round" />
        <path d="M33 23h9l-1.4 6h-6.2z" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".8" />
        <circle cx="35.6" cy="22.4" r="1.6" fill="#d9483b" />
        <circle cx="39" cy="22.6" r="1.6" fill="#6b3a78" />
      </ArtSvg>
    </div>
    </div>
  )
}
