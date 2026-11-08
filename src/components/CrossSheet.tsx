import { useState } from 'react'
import { useDismiss } from '../game/overlays'
import { CROSS_MS, CROSS_SKIP_SAMEN, HYBRIDS, hybridsMult } from '../game/crossing'
import { formatDecimal } from '../game/format'
import { VARIETIES } from '../game/gardenLife'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { SeedPacket } from '../theme/SeedPacket'

type GameApi = ReturnType<typeof useGame>

function clock(ms: number): string {
  const m = Math.ceil(ms / 60_000)
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, '0')} min` : `${m} min`
}

/** Saatgut kreuzen: pick two sorts, wait, harvest; list of Kreuzungen. */
export function CrossSheet({ game, onClose, onToast }: { game: GameApi; onClose: () => void; onToast: (text: string) => void }) {
  useDismiss(onClose)
  const { state, nowTick } = game
  const found = VARIETIES.filter((v) => state.collection.includes(v.id))
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const c = state.crossing
  const left = c ? Math.max(0, c.endsAt - nowTick) : 0
  const name = (id: string) => t.plantbook.names[id as keyof typeof t.plantbook.names] ?? id
  const harvest = () => {
    const r = game.crossHarvest()
    if (!r) return
    playSfx(r.hybrid ? 'level' : 'claim')
    onToast(r.hybrid ? t.crossing.newHybrid(t.crossing.names[r.hybrid]!) : t.crossing.miss(r.samen))
  }
  const select = (value: string, set: (v: string) => void, other: string, label: string) => (
    <label className="cross-pick">
      <span>{label}</span>
      <select value={value} onChange={(e) => set(e.target.value)}>
        <option value="">{t.crossing.choose}</option>
        {found.map((v) => (
          <option key={v.id} value={v.id} disabled={v.id === other}>
            {name(v.id)} · {t.modules[v.module].name}
          </option>
        ))}
      </select>
    </label>
  )
  const nHybrids = HYBRIDS.filter((h) => state.hybrids.includes(h.id)).length
  return (
    <div className="upgrade-hud-layer" onClick={onClose}>
      <div className="upgrade-hud cross-sheet" role="dialog" aria-labelledby="cross-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <h2 id="cross-title">{t.crossing.title}</h2>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label="×">
            ×
          </button>
        </header>
        <p className="muted">{t.crossing.intro}</p>
        <div className="cross-box">
          {c ? (
            <>
              <div className="cross-pair">
                <span>{name(c.a)}</span>×<span>{name(c.b)}</span>
              </div>
              <div className="cross-bar" aria-hidden="true">
                <span style={{ width: `${Math.round((1 - left / CROSS_MS) * 100)}%` }} />
              </div>
              {left > 0 ? (
                <>
                  <p className="cross-status">{t.crossing.running(clock(left))}</p>
                  <button type="button" className="btn ghost" disabled={state.samen < CROSS_SKIP_SAMEN} onClick={game.crossSkip}>
                    {t.crossing.skip(CROSS_SKIP_SAMEN)}
                  </button>
                </>
              ) : (
                <>
                  <p className="cross-status">{t.crossing.ready}</p>
                  <button type="button" className="btn buy" onClick={harvest}>
                    {t.crossing.harvest}
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {select(a, setA, b, t.crossing.pickA)}
              {select(b, setB, a, t.crossing.pickB)}
              <button type="button" className="btn buy" disabled={!a || !b || a === b} onClick={() => { game.crossStart(a, b); setA(''); setB('') }}>
                {t.crossing.start(CROSS_MS / 3600_000)}
              </button>
            </>
          )}
        </div>
        <h3 className="subhead">{t.crossing.known}</h3>
        <p className="muted">{t.crossing.total(formatDecimal((hybridsMult(state.hybrids) - 1) * 100, 0), nHybrids, HYBRIDS.length)}</p>
        <ul className="hybrid-grid">
          {HYBRIDS.map((h) => {
            const got = state.hybrids.includes(h.id)
            return (
              <li key={h.id} className={`hybrid-card${got ? ' found' : ''}`}>
                <SeedPacket id={h.id} unknown={!got} />
                <strong>{got ? t.crossing.names[h.id] : '???'}</strong>
                <small>{t.crossing.hintPair(t.modules[h.areas[0]].name, t.modules[h.areas[1]].name)}</small>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
