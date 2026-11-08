import { useCallback, useState } from 'react'

interface Flight {
  id: number
  x: number
  y: number
  dx: number
  dy: number
}

let seq = 0
const COLORS = ['#e0485e', '#7fbf5a', '#f08a2c', '#f5c542', '#6a3d8f', '#e0485e']

/** Produce that flies from a button into the Ernte basket in the HUD. */
export function useHarvestFlight() {
  const [flights, setFlights] = useState<Flight[]>([])

  const launch = useCallback((from: Element | null) => {
    const target = document.querySelector('.hud-amount-icon')
    if (!from || !target) return
    const a = from.getBoundingClientRect()
    const b = target.getBoundingClientRect()
    const x = a.left + a.width / 2
    const y = a.top + a.height / 2
    const id = ++seq
    setFlights((f) => [
      ...f.slice(-2),
      { id, x, y, dx: b.left + b.width / 2 - x, dy: b.top + b.height / 2 - y },
    ])
    window.setTimeout(() => setFlights((f) => f.filter((x2) => x2.id !== id)), 1100)
  }, [])

  const layer = (
    <div className="harvest-flight" aria-hidden="true">
      {flights.map((f) => (
        <span key={f.id} className="harvest-wave" style={{ left: f.x, top: f.y }}>
          {COLORS.map((c, i) => (
            <span
              key={i}
              style={{
                background: c,
                ['--dx' as string]: `${f.dx}px`,
                ['--dy' as string]: `${f.dy}px`,
                ['--ox' as string]: `${(i - 2.5) * 9}px`,
                animationDelay: `${i * 55}ms`,
              }}
            />
          ))}
        </span>
      ))}
    </div>
  )
  return { launch, layer }
}
