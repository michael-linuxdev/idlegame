import { useEffect, useRef } from 'react'
import { useDismiss } from '../game/overlays'
import { t } from '../i18n'
import { ArtSvg } from '../theme/ArtSvg'
import { P } from '../theme/art/palette'

/**
 * Abschluss-Szene (Kapitel 50, nur Darstellung): einmal, wenn Omas
 * Schrebergarten ganz angelegt ist. Die Familie aller Generationen auf Omas
 * Bank, die Dose leer, ein Tütchen „Für dich“ (das Spiel kennt keinen
 * Spielernamen). Danach geht das Spiel normal weiter; „gesehen“ steht im
 * Spielstand (`abschlussSeen`). Dialog mit Fokus auf dem Knopf, Escape und
 * Zurück schließen; Bewegung nur ohne „Bewegung reduzieren“.
 */
export function AbschlussScene({ onDone }: { onDone: () => void }) {
  const copy = t.chapterUi.finale
  const btn = useRef<HTMLButtonElement>(null)
  useDismiss(onDone)
  useEffect(() => {
    btn.current?.focus()
  }, [])
  return (
    <div
      className="season-ceremony phase-letter abschluss-scene"
      role="dialog"
      aria-modal="true"
      aria-labelledby="abschluss-title"
      aria-describedby="abschluss-body"
      onKeyDown={(e) => {
        // Nur ein Knopf: Tab bleibt im Fenster
        if (e.key === 'Tab') {
          e.preventDefault()
          btn.current?.focus()
        }
      }}
    >
      <article className="season-letter abschluss-card">
        <p className="upgrade-hud-eyebrow">{copy.eyebrow}</p>
        <h2 id="abschluss-title">{copy.title}</h2>
        <div className="abschluss-art" role="img" aria-label={copy.sceneAria}>
          <BenchScene packet={copy.packet} />
        </div>
        <div id="abschluss-body">
          {copy.body.map((line, i) => (
            <p key={i} className={i === copy.body.length - 1 ? 'notebook-signature' : undefined}>
              {line}
            </p>
          ))}
        </div>
        <button ref={btn} type="button" className="btn buy" onClick={onDone}>
          {copy.cta}
        </button>
      </article>
    </div>
  )
}

/** Eine einfache sitzende Figur (Fußpunkt = Sitzfläche). */
function Sitter({ x, y, coat, hair, s = 1, hat, skirt }: { x: number; y: number; coat: string; hair: string; s?: number; hat?: string; skirt?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M-2.6 0h5.2l.6 5h-6.4z" fill={skirt ?? P.charcoal} />
      <path d="M-1.8 5v3.4M1.8 5v3.4" stroke={P.charcoal} strokeWidth="1" />
      <path d="M-3 -8h6l.8 8h-7.6z" fill={coat} />
      <circle cx="0" cy="-10.6" r="2.6" fill={P.skin} />
      <path d="M-2.6 -11a2.6 2.6 0 0 1 5.2 0z" fill={hair} />
      {hat ? (
        <g>
          <ellipse cx="0" cy="-12.4" rx="4.6" ry="1" fill={hat} />
          <path d="M-2.2 -12.4v-2h4.4v2z" fill={hat} />
        </g>
      ) : null}
    </g>
  )
}

function BenchScene({ packet }: { packet: string }) {
  const people: { coat: string; hair: string; s?: number; hat?: string; skirt?: string }[] = [
    { coat: P.leafDark, hair: P.stoneLight, skirt: P.plum }, // Ilse
    { coat: P.lavender, hair: P.white, hat: P.gold, skirt: P.blue }, // Oma
    { coat: P.denim, hair: P.bark }, // Jonas
    { coat: P.red, hair: P.woodDark, s: 0.9, skirt: P.leaf }, // Mila
    { coat: P.leaf, hair: P.woodLight, skirt: P.woodMid }, // Lena
    { coat: P.woodMid, hair: P.woodLight }, // Till
  ]
  return (
    <ArtSvg viewBox="0 0 160 90">
      <rect width="160" height="90" fill={P.cream} />
      <rect width="160" height="44" fill={P.glassWarm} />
      <circle cx="132" cy="18" r="8" fill={P.lamp} opacity=".9" />
      <path d="M0 50Q40 40 80 46T160 44V90H0z" fill={P.leafLight} />
      <path d="M0 60Q80 52 160 60V90H0z" fill={P.leaf} />
      {/* Laube mit Licht */}
      <rect x="10" y="22" width="30" height="24" fill={P.wood} stroke={P.outlineWood} strokeWidth=".6" />
      <path d="M6 22L25 10L44 22z" fill={P.roof} stroke={P.outlineWood} strokeWidth=".6" />
      <rect x="14" y="28" width="9" height="7" fill={P.lamp} stroke={P.woodDark} strokeWidth=".6" />
      <rect x="28" y="30" width="8" height="16" fill={P.leafDark} />
      {/* Opas Apfelbaum */}
      <path d="M140 66V36" stroke={P.bark} strokeWidth="3" />
      <ellipse cx="140" cy="30" rx="18" ry="13" fill={P.leafDark} />
      <ellipse cx="134" cy="26" rx="9" ry="6" fill={P.leaf} />
      {[[132, 34], [146, 28], [140, 22], [150, 36]].map(([x, y]) => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1.8" fill={P.red} />
      ))}
      {/* Lichterkette */}
      <path d="M44 22Q90 34 124 26" stroke={P.charcoal} strokeWidth=".4" fill="none" />
      {Array.from({ length: 8 }, (_, i) => (
        <circle key={i} className="abschluss-light" cx={50 + i * 9.6} cy={25 + Math.sin(((i + 1) / 9) * Math.PI) * 5} r="1.3" fill={P.lamp} />
      ))}
      {/* Bank */}
      <path d="M22 74v-8M138 74v-8M24 66v-14M136 66v-14" stroke={P.woodDark} strokeWidth="1.6" />
      <rect x="20" y="52" width="120" height="3" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
      <rect x="20" y="57" width="120" height="3" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
      {people.map((p, i) => (
        <Sitter key={i} x={32 + i * 19} y={64} coat={p.coat} hair={p.hair} s={p.s} hat={p.hat} skirt={p.skirt} />
      ))}
      <rect x="20" y="64" width="120" height="3.2" fill={P.woodLight} stroke={P.outlineWood} strokeWidth=".4" />
      {/* Die Dose, offen und leer, der Deckel daneben */}
      <rect x="60" y="76" width="14" height="8" rx="1" fill={P.leafDark} stroke={P.outline} strokeWidth=".5" />
      <ellipse cx="67" cy="76" rx="7" ry="1.6" fill={P.ink} />
      <ellipse cx="51" cy="83" rx="7.4" ry="1.8" fill={P.brass} stroke={P.outline} strokeWidth=".4" />
      <circle cx="67" cy="80.6" r="1.6" fill={P.red} />
      {/* Das letzte Tütchen */}
      <g transform="translate(86 70) rotate(-6)">
        <path d="M0 14V1l1.4 -1.4h17.2l1.4 1.4v13z" fill={P.paper} stroke={P.outlineWood} strokeWidth=".5" />
        <circle cx="10" cy="5" r="2" fill={P.leaf} />
        <circle cx="11.2" cy="5.6" r=".9" fill={P.red} />
        <text x="10" y="12" textAnchor="middle" fontSize="3.6" fontFamily="var(--ge-font-display, serif)" fill={P.ink}>
          {packet}
        </text>
      </g>
      {/* Igel und Glühwürmchen */}
      <g transform="translate(110 80)">
        <path d="M0 6Q-1 1 4 0Q9 -1 11 3.6L12.6 5.6L11 6z" fill={P.bark} />
        <circle cx="12.4" cy="5.2" r=".4" fill={P.ink} />
      </g>
      {[[16, 60], [46, 44], [100, 42], [150, 58], [8, 78]].map(([x, y], i) => (
        <circle key={i} className="abschluss-firefly" cx={x} cy={y} r="1" fill={P.lamp} style={{ animationDelay: `${-i * 0.8}s` }} />
      ))}
    </ArtSvg>
  )
}
