import { useEffect, useState, type ReactNode } from 'react'
import type { ExtrasState } from '../game/extras'
import { weatherVisitorMult } from '../game/gardenLife'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'

type GameApi = ReturnType<typeof useGame>
type VisitorId = 'igel' | 'gerda' | 'schmetterling' | 'rotkehlchen' | 'postbote'

const SPOTS = [
  { left: '47%', top: '77%' },
  { left: '56%', top: '58%' },
  { left: '9%', top: '52%' },
  { left: '91%', top: '46%' },
  { left: '44%', top: '41%' },
  { left: '88%', top: '88%' },
]

const STAY_MS = 40_000

function Art({ id }: { id: VisitorId }): ReactNode {
  switch (id) {
    case 'igel':
      return (
        <svg viewBox="0 0 48 32">
          <ellipse cx="24" cy="29" rx="18" ry="3" fill="rgba(40,30,10,.25)" />
          <path d="M6 26 Q8 8 26 8 Q40 9 42 24 Z" fill="#7a5a3a" stroke="#3d2f1f" strokeWidth="1.4" />
          {[10, 15, 20, 25, 30, 35].map((x, i) => (
            <path key={x} d={`M${x} ${14 - (i % 2) * 2} l-2 -5 M${x + 2} ${16} l1 -6`} stroke="#3d2f1f" strokeWidth="1.2" />
          ))}
          <path d="M36 18 Q46 20 44 26 L36 26 Z" fill="#d9b48a" stroke="#3d2f1f" strokeWidth="1.2" />
          <circle cx="44.5" cy="24" r="1.4" fill="#3d2f1f" />
          <circle cx="40" cy="21" r="1" fill="#3d2f1f" />
        </svg>
      )
    case 'gerda':
      return (
        <svg viewBox="0 0 40 56">
          <ellipse cx="20" cy="53" rx="12" ry="2.6" fill="rgba(40,30,10,.25)" />
          <path d="M10 52 L13 26 H27 L30 52 Z" fill="#c76bd9" stroke="#3d2f1f" strokeWidth="1.3" />
          <path d="M11 40 H29" stroke="#fff" strokeWidth="1.5" strokeDasharray="2 2" />
          <circle cx="20" cy="18" r="7" fill="#f2d9b0" stroke="#3d2f1f" strokeWidth="1.3" />
          <path d="M12 16 Q14 8 20 9 Q27 8 28 16 Q24 12 20 13 Q16 12 12 16 Z" fill="#d9d9d9" stroke="#3d2f1f" strokeWidth="1" />
          <circle cx="17.5" cy="18" r="0.9" fill="#3d2f1f" />
          <circle cx="22.5" cy="18" r="0.9" fill="#3d2f1f" />
          <path d="M18 21.5 q2 1.5 4 0" stroke="#3d2f1f" strokeWidth="0.9" fill="none" />
          <path d="M27 34 h9 l-1.5 7 h-6 z" fill="#c9a46b" stroke="#3d2f1f" strokeWidth="1" />
          <circle cx="30" cy="33" r="1.6" fill="#7fbf5a" />
          <circle cx="33" cy="33.4" r="1.6" fill="#e0485e" />
        </svg>
      )
    case 'schmetterling':
      return (
        <svg viewBox="0 0 40 32">
          <path d="M20 16 C8 0 2 10 8 18 C2 26 12 30 20 18 Z" fill="#f5c542" stroke="#3d2f1f" strokeWidth="1.2" />
          <path d="M20 16 C32 0 38 10 32 18 C38 26 28 30 20 18 Z" fill="#f5c542" stroke="#3d2f1f" strokeWidth="1.2" />
          <path d="M9 10 L15 14 M31 10 L25 14 M8 22 l5 -3 M32 22 l-5 -3" stroke="#3d2f1f" strokeWidth="1.4" />
          <circle cx="10" cy="24" r="1.6" fill="#3d8db8" />
          <circle cx="30" cy="24" r="1.6" fill="#3d8db8" />
          <rect x="19" y="8" width="2" height="16" rx="1" fill="#3d2f1f" />
        </svg>
      )
    case 'rotkehlchen':
      return (
        <svg viewBox="0 0 36 32">
          <ellipse cx="18" cy="30" rx="10" ry="2" fill="rgba(40,30,10,.25)" />
          <path d="M6 18 Q8 6 20 7 Q30 8 30 18 Q28 27 17 27 Q8 27 6 18 Z" fill="#8a6a40" stroke="#3d2f1f" strokeWidth="1.2" />
          <path d="M20 12 Q28 12 28 20 Q24 25 18 23 Q16 16 20 12 Z" fill="#e2703a" />
          <path d="M6 18 L1 14 L3 20 Z" fill="#6b4f2e" stroke="#3d2f1f" strokeWidth="1" />
          <circle cx="24" cy="11" r="1.4" fill="#1a1a1a" />
          <path d="M29 12 l5 1 l-5 1.5 z" fill="#3d2f1f" />
          <path d="M15 27 v3 M19 27 v3" stroke="#3d2f1f" strokeWidth="1" />
        </svg>
      )
    case 'postbote':
      return (
        <svg viewBox="0 0 40 56">
          <ellipse cx="20" cy="53" rx="12" ry="2.6" fill="rgba(40,30,10,.25)" />
          <path d="M11 52 L13 26 H27 L29 52 Z" fill="#2e5d9a" stroke="#3d2f1f" strokeWidth="1.3" />
          <circle cx="20" cy="18" r="7" fill="#f2d9b0" stroke="#3d2f1f" strokeWidth="1.3" />
          <path d="M12 15 H28 L26 9 H14 Z" fill="#f5c542" stroke="#3d2f1f" strokeWidth="1.2" />
          <circle cx="17.5" cy="18.5" r="0.9" fill="#3d2f1f" />
          <circle cx="22.5" cy="18.5" r="0.9" fill="#3d2f1f" />
          <path d="M17 22 q3 1.6 6 0" stroke="#3d2f1f" strokeWidth="0.9" fill="none" />
          <rect x="25" y="30" width="12" height="10" rx="1" fill="#c4823f" stroke="#3d2f1f" strokeWidth="1.1" />
          <path d="M25 35 H37 M31 30 V40" stroke="#8a5a32" strokeWidth="1" />
        </svg>
      )
  }
}

interface Props {
  game: GameApi
  extras: ExtrasState
  update: (fn: (s: ExtrasState) => ExtrasState) => void
  onVisited: (line: string) => void
  onPresence?: (present: boolean) => void
}

interface Active {
  id: VisitorId
  spot: number
  leavesAt: number
}

const ORDER: VisitorId[] = ['igel', 'gerda', 'schmetterling', 'rotkehlchen', 'postbote', 'igel', 'gerda']

/** Occasional garden visitors — tap them for a small gift. */
export function Visitors({ game, extras, update, onVisited, onPresence }: Props) {
  const [active, setActive] = useState<Active | null>(null)

  useEffect(() => {
    onPresence?.(active != null)
  }, [active, onPresence])

  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now()
      if (document.hidden) return
      if (active && now >= active.leavesAt) {
        setActive(null)
        const gap = (150_000 + Math.random() * 180_000) / weatherVisitorMult(now)
        update((s) => ({ ...s, nextVisitorAt: now + gap }))
      } else if (!active && now >= extras.nextVisitorAt) {
        const pick = ORDER[Math.floor(Math.random() * ORDER.length)]!
        setActive({ id: pick, spot: Math.floor(Math.random() * SPOTS.length), leavesAt: now + STAY_MS })
      }
    }, 3000)
    return () => window.clearInterval(id)
  }, [active, extras.nextVisitorAt, update])

  if (!active) return null
  const spot = SPOTS[active.spot]!
  const copy = t.visitors[active.id]

  function greet() {
    if (!active) return
    const now = Date.now()
    switch (active.id) {
      case 'igel':
        game.grant({ ernteSeconds: 120, fest: 2, kg: 0.5 })
        break
      case 'gerda':
        game.grant({ samen: 6, fest: 2, kg: 0.5 })
        break
      case 'schmetterling':
        game.grant({ ernteSeconds: 60, xp: 10, fest: 2, kg: 0.5 })
        break
      case 'rotkehlchen':
        game.refillWater()
        break
      case 'postbote':
        game.grant(game.state.prestiges >= 1 ? { erbstuecke: 3, fest: 2, kg: 0.5 } : { samen: 4, fest: 2, kg: 0.5 })
        break
    }
    playSfx('level')
    onVisited(copy.line)
    const gap = (180_000 + Math.random() * 240_000) / weatherVisitorMult(now)
    update((s) => ({ ...s, nextVisitorAt: now + gap, week: { ...s.week, visitors: s.week.visitors + 1 } }))
    setActive(null)
  }

  return (
    <button
      type="button"
      className={`garden-visitor visitor-${active.id}`}
      style={{ left: spot.left, top: spot.top }}
      onClick={greet}
      aria-label={t.visitors.aria(copy.name)}
    >
      <Art id={active.id} />
      <span className="visitor-spark" aria-hidden="true" />
    </button>
  )
}
