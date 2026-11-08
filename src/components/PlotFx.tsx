import { useEffect, useRef, useState } from 'react'
import { playSfx } from '../game/sound'

interface Props {
  unlocked: boolean
  planted: boolean
}

type Fx = 'clear' | 'plant' | null

const LEAVES = Array.from({ length: 10 }, (_, i) => i)

/**
 * One-shot burst on a plot: leaves and twigs fly when a wild corner is
 * cleared, sparkles when something is planted for the first time.
 * Transform/opacity only — composited, no layout.
 */
export function PlotFx({ unlocked, planted }: Props) {
  const prev = useRef({ unlocked, planted })
  const [fx, setFx] = useState<Fx>(null)

  useEffect(() => {
    const was = prev.current
    prev.current = { unlocked, planted }
    let kind: Fx = null
    if (unlocked && !was.unlocked) kind = 'clear'
    else if (planted && !was.planted) kind = 'plant'
    if (kind) {
      setFx(kind)
      playSfx(kind === 'clear' ? 'letter' : 'upgrade')
      const t = window.setTimeout(() => setFx(null), 1300)
      return () => window.clearTimeout(t)
    }
  }, [unlocked, planted])

  if (!fx) return null
  return (
    <span className={`plot-fx fx-${fx}`} aria-hidden="true">
      {LEAVES.map((i) => (
        <span key={i} style={{ ['--a' as string]: `${i * 36}deg`, ['--d' as string]: `${i % 2 ? 1 : 0.7}` }} />
      ))}
    </span>
  )
}
