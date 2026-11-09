import { useId } from 'react'

/**
 * Eindeutige SVG-ID je Komponenten-Instanz (für Verläufe/Muster), damit
 * zwei gleichzeitig gerenderte Grafiken sich nicht gegenseitig die
 * `url(#…)`-Referenz wegnehmen. Nur Zeichen, die in url() und CSS sicher sind.
 */
export function useSvgId(prefix: string): string {
  return `${prefix}-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
}
