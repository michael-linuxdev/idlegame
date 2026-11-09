import { useEffect, useRef, useState } from 'react'
import { playSfx } from '../game/sound'

interface Props {
  unlocked: boolean
  planted: boolean
  /** Growth tier (0–5); a rise ≥ 2 throws confetti */
  tier?: number
  onTier?: (tier: number) => void
}

type Fx = 'clear' | 'plant' | 'tier' | 'crown' | null

const LEAVES = Array.from({ length: 12 }, (_, i) => i)
const CROWN = Array.from({ length: 18 }, (_, i) => i)

/**
 * One-shot burst on a plot: leaves and twigs fly when a wild corner is
 * cleared, sparkles when something is planted for the first time.
 * Transform/opacity only — composited, no layout.
 */
export function PlotFx({ unlocked, planted, tier = 0, onTier }: Props) {
  const prev = useRef({ unlocked, planted, tier })
  const [fx, setFx] = useState<Fx>(null)

  useEffect(() => {
    const was = prev.current
    prev.current = { unlocked, planted, tier }
    let kind: Fx = null
    if (unlocked && !was.unlocked) kind = 'clear'
    else if (planted && !was.planted) kind = 'plant'
    else if (tier > was.tier && tier >= 2) {
      // Stufe 5 (Level 100) ist der Höhepunkt: einmalig eine größere Feier
      kind = tier >= 5 && was.tier < 5 ? 'crown' : 'tier'
      onTier?.(tier)
    }
    if (kind) {
      setFx(kind)
      playSfx(kind === 'clear' ? 'letter' : kind === 'tier' || kind === 'crown' ? 'streak' : 'upgrade')
      const t = window.setTimeout(() => setFx(null), kind === 'crown' ? 2200 : 1300)
      return () => window.clearTimeout(t)
    }
  }, [unlocked, planted, tier, onTier])

  if (!fx) return null
  return (
    <span className={`plot-fx fx-${fx}`} aria-hidden="true">
      {fx === 'crown' ? <i className="fx-crown-ring" /> : null}
      {(fx === 'crown' ? CROWN : LEAVES).map((i) => (
        <span key={i} style={{ ['--a' as string]: `${i * (fx === 'crown' ? 20 : 30)}deg`, ['--d' as string]: `${i % 2 ? 1 : 0.7}` }} />
      ))}
    </span>
  )
}
