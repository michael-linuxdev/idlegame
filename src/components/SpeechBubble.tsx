import { useEffect, useState } from 'react'

/**
 * Little speech bubble for the helpers (Jonas, Ilse): a random saying every
 * ~35 s, shown for 4 s. Decorative (aria-hidden).
 */
export function SpeechBubble({ lines, who }: { lines: readonly string[]; who: 'jonas' | 'ilse' }) {
  const [line, setLine] = useState<string | null>(null)
  useEffect(() => {
    let hide: number | undefined
    const show = () => {
      setLine(lines[Math.floor(Math.random() * lines.length)] ?? null)
      hide = window.setTimeout(() => setLine(null), 4000)
    }
    const first = window.setTimeout(show, 6000)
    const id = window.setInterval(show, 35_000)
    return () => {
      window.clearTimeout(first)
      window.clearTimeout(hide)
      window.clearInterval(id)
    }
  }, [lines])
  if (!line) return null
  return (
    <div className={`speech-bubble speech-${who}`} aria-hidden="true">
      {line}
    </div>
  )
}
