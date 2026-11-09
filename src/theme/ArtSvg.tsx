import type { SVGProps } from 'react'

/**
 * Gemeinsamer Rahmen für dekorative Grafik: immer `aria-hidden` und nicht
 * fokussierbar. Bedeutung trägt der umgebende Knopf/Text (aria-label),
 * nicht das Bild. Für Grafiken mit eigener Bedeutung `role="img"` +
 * `aria-label` am normalen <svg> verwenden.
 */
export function ArtSvg(props: SVGProps<SVGSVGElement>) {
  return <svg aria-hidden="true" focusable="false" {...props} />
}
