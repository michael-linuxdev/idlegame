import { useEffect } from 'react'
import { DECOR_SLOTS, placedDecor } from '../game/decor'
import { formatAsh } from '../game/format'
import { GENERATORS } from '../game/generators'
import { RESIDENT_FIRST_SAMEN, pickResident, residentDef } from '../game/residents'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import type { Ambient } from '../theme/ambient'
import { ResidentArt } from '../theme/ResidentArt'

type GameApi = ReturnType<typeof useGame>

/** Where a visitor shows up: next to the Deko that drew it, else beside its area. */
function spotFor(id: string, slots: GameApi['state']['decorSlots']): { left: number; top: number } {
  const def = residentDef(id)
  if (def?.decor) {
    const i = slots.indexOf(def.decor)
    if (i >= 0) {
      const s = DECOR_SLOTS[i]!
      return { left: Math.min(94, Math.max(6, s.left + (s.left > 50 ? -7 : 7))), top: s.top }
    }
  }
  if (def?.area) {
    const g = GENERATORS.find((x) => x.id === def.area!.id)
    if (g) {
      const l = parseFloat(String(g.slot.left))
      return { left: Math.min(94, l + (l > 50 ? -12 : 12)), top: parseFloat(String(g.slot.top)) + 3 }
    }
  }
  return { left: 56, top: 60 }
}

/** Gartenbewohner: spawn when it is time and one fits; tap to note it in the album. */
export function Residents({ game, ambient, onToast }: { game: GameApi; ambient: Ambient; onToast: (text: string) => void }) {
  const { state } = game
  const visit = state.residentNow

  useEffect(() => {
    const tick = () => {
      const s = game.stateRef.current
      const now = Date.now()
      if (s.residentNow) {
        if (s.residentNow.until <= now) game.residentLeft()
        return
      }
      if (now < s.residentNextAt) return
      const id = pickResident({ placed: placedDecor(s.decorSlots), owned: s.owned, season: ambient.season, daypart: ambient.daypart }, s.residentsSeen)
      if (id) game.letResidentIn(id)
      else game.residentLeft()
    }
    tick()
    const iv = window.setInterval(tick, 3000)
    return () => window.clearInterval(iv)
  }, [game, ambient.season, ambient.daypart])

  if (!visit || visit.until <= game.nowTick) return null
  const pos = spotFor(visit.id, state.decorSlots)
  const name = t.residents.names[visit.id]!
  const greet = () => {
    const r = game.greetVisitorAnimal()
    if (!r) return
    playSfx(r.first ? 'level' : 'claim')
    onToast(r.first ? t.residents.firstToast(name, RESIDENT_FIRST_SAMEN) : t.residents.repeatToast(name, formatAsh(r.ernte)))
  }
  return (
    <button
      type="button"
      className={`garden-resident resident-${visit.id}`}
      style={{ left: `${pos.left}%`, top: `${pos.top}%`, zIndex: 3 + Math.round(pos.top) }}
      onClick={greet}
      aria-label={t.residents.aria(name)}
    >
      <ResidentArt id={visit.id} />
      {(state.residentsSeen[visit.id] ?? 0) === 0 ? <span className="resident-new" aria-hidden="true">!</span> : null}
    </button>
  )
}
