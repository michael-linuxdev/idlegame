import { P } from '../palette'

/**
 * Gemeinsame SVG-Symbole der Spielgrafik (einmal je Seite, z. B. in der
 * .garden-stage): wiederholte Teile wie der Glanz der Früchte werden mit <use> gezeichnet
 * — zwei Elemente statt drei, damit der Hauptgarten unter der Leistungsgrenze
 * (1.500 SVG-Elemente) bleibt. Farben stehen nie im Symbol per currentColor, weil
 * der Foto-Export (html-to-image) das nicht auflöst.
 */
export function ArtDefs() {
  return (
    <svg className="art-defs" width="0" height="0" aria-hidden="true" focusable="false" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
      <defs>
        {/* Rand + Glanzpunkt reifer Früchte (die Farbe ist ein eigener Kreis darunter) */}
        <symbol id="art-fruit-gloss" viewBox="-1.2 -1.2 2.4 2.4" overflow="visible">
          <circle r="1" fill="none" stroke={P.outline} strokeOpacity="0.75" strokeWidth="0.28" />
          <circle cx="-0.35" cy="-0.38" r="0.34" fill={P.white} fillOpacity="0.9" />
        </symbol>
      </defs>
    </svg>
  )
}
