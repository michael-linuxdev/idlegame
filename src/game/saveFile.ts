/**
 * Datei speichern, die auch in der installierten iPhone-App funktioniert.
 *
 * iOS öffnet `<a download>` mit Blob-URL in einer eigenen Safari-Ansicht.
 * Wurde die URL dann schon freigegeben, erscheint „WebKitBlobResource-Fehler 1“.
 * Deshalb: zuerst das Teilen-Menü („In Dateien sichern“), sonst Download mit
 * einer Blob-URL, die erst nach einer Minute freigegeben wird.
 */

export type SaveResult = 'shared' | 'downloaded' | 'cancelled' | 'failed'

export const BLOB_URL_KEEP_MS = 60_000

interface ShareNav {
  share?: (data: ShareData) => Promise<void>
  canShare?: (data: ShareData) => boolean
}

/** True when the browser can hand this file to the system share sheet. */
export function canShareFile(nav: ShareNav | undefined, file: File): boolean {
  try {
    return !!nav?.share && !!nav.canShare && nav.canShare({ files: [file] })
  } catch {
    return false
  }
}

/** Prefer the share sheet only where downloads are unreliable (iOS / iPadOS). */
export function prefersShare(ua: string, maxTouchPoints = 0): boolean {
  if (/iPhone|iPad|iPod/.test(ua)) return true
  // iPadOS reports itself as a Mac
  return /Macintosh/.test(ua) && maxTouchPoints > 1
}

export async function saveFile(name: string, content: Blob | string, type = 'text/plain'): Promise<SaveResult> {
  const blob = typeof content === 'string' ? new Blob([content], { type }) : content
  const nav = typeof navigator !== 'undefined' ? (navigator as Navigator & ShareNav) : undefined
  const file = typeof File !== 'undefined' ? new File([blob], name, { type: blob.type || type }) : null

  if (file && nav && prefersShare(nav.userAgent, nav.maxTouchPoints) && canShareFile(nav, file)) {
    try {
      await nav.share!({ files: [file] })
      return 'shared'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') return 'cancelled'
      // fall through to the download
    }
  }

  try {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.rel = 'noopener'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), BLOB_URL_KEEP_MS)
    return 'downloaded'
  } catch {
    return 'failed'
  }
}

/** Text in die Zwischenablage; false wenn der Browser es nicht erlaubt. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function fileStamp(now = Date.now()): string {
  return new Date(now).toISOString().replace(/[:.]/g, '-').slice(0, 19)
}
