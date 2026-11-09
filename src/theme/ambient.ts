/**
 * Ambient garden mood from the player's local clock: time of day and
 * season. Purely cosmetic. `?ambient=night-winter` (any daypart/season
 * combination) overrides it for testing and screenshots.
 */
import { useEffect, useState } from 'react'

export type Daypart = 'morning' | 'day' | 'evening' | 'night'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export interface Ambient {
  daypart: Daypart
  season: Season
}

const DAYPARTS: Daypart[] = ['morning', 'day', 'evening', 'night']
const SEASONS: Season[] = ['spring', 'summer', 'autumn', 'winter']

export function ambientAt(date: Date): Ambient {
  const h = date.getHours()
  const m = date.getMonth()
  const daypart: Daypart =
    h >= 5 && h < 9 ? 'morning' : h >= 9 && h < 17 ? 'day' : h >= 17 && h < 21 ? 'evening' : 'night'
  const season: Season =
    m === 11 || m <= 1 ? 'winter' : m <= 4 ? 'spring' : m <= 7 ? 'summer' : 'autumn'
  return { daypart, season }
}

function override(): Partial<Ambient> {
  if (typeof location === 'undefined') return {}
  const raw = new URLSearchParams(location.search).get('ambient')
  if (!raw) return {}
  const out: Partial<Ambient> = {}
  for (const part of raw.split(/[-,]/)) {
    if ((DAYPARTS as string[]).includes(part)) out.daypart = part as Daypart
    if ((SEASONS as string[]).includes(part)) out.season = part as Season
  }
  return out
}

/** Re-evaluates every 5 minutes — cheap, no per-frame work. */
export function useAmbient(): Ambient {
  const [ambient, setAmbient] = useState<Ambient>(() => ({ ...ambientAt(new Date()), ...override() }))
  useEffect(() => {
    const id = window.setInterval(() => {
      const next = { ...ambientAt(new Date()), ...override() }
      setAmbient((prev) =>
        prev.daypart === next.daypart && prev.season === next.season ? prev : next,
      )
    }, 5 * 60 * 1000)
    return () => window.clearInterval(id)
  }, [])
  return ambient
}

/** Test-Hook für die Wetter-Darstellung: `?wetter=regen|wind|sonne|mild`. */
export function weatherOverride(): 'sonne' | 'regen' | 'wind' | 'mild' | null {
  if (typeof location === 'undefined') return null
  const w = new URLSearchParams(location.search).get('wetter')
  return w === 'regen' || w === 'wind' || w === 'sonne' || w === 'mild' ? w : null
}
