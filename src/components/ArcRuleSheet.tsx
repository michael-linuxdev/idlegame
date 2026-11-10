/** Bogen-Regel eines Kapitels wählen (Runde 4, Paket 4, game/arcRules.ts). */
import {
  ARC_RULE_CAP,
  PATE,
  PLAN,
  PLAN_WAHLEN,
  TAUSCH,
  TAUSCH_WEGE,
  WASSER,
  arcOf,
  arcRateMult,
  waterPoints,
} from '../game/arcRules'
import { chapterDef, type ChapterId } from '../game/chapters'
import { formatDecimal } from '../game/format'
import { useDismiss } from '../game/overlays'
import { chapterAreaRates } from '../game/state'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { chapterCopy } from './chapterCopy'

type GameApi = ReturnType<typeof useGame>

const pct = (m: number) => Math.round((m - 1) * 100)
/** Wirkung mit einer Nachkommastelle („+0,4 %“), damit kleine Bereiche nicht als +0 % erscheinen */
const pctText = (m: number) => formatDecimal((m - 1) * 100, (m - 1) * 100 < 10 ? 1 : 0)

export function ArcRuleSheet({ game, chapter, onClose }: { game: GameApi; chapter: ChapterId; onClose: () => void }) {
  useDismiss(onClose)
  const def = chapterDef(chapter)
  const arc = arcOf(def.number)
  const copy = chapterCopy(chapter)
  const c = game.state.chapters[chapter]
  const choice = game.state.bogenWahl[chapter] ?? null
  const rates = chapterAreaRates(def, c)
  const nowMult = arcRateMult(def, rates, choice)
  if (!arc) return null
  const a = t.arcRules
  const set = (next: string | null) => game.chooseArc(chapter, next)
  const planted = def.areas.filter((x) => (c.owned[x.id] ?? 0) > 0)

  return (
    <div className="upgrade-hud-layer" role="presentation" onClick={onClose}>
      <div className="upgrade-hud arc-sheet" role="dialog" aria-modal="true" aria-labelledby="arc-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <div className="upgrade-hud-heading">
            <p className="upgrade-hud-eyebrow">{copy.title}</p>
            <h2 id="arc-title">{a.title[arc]}</h2>
          </div>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label={a.close}>
            ×
          </button>
        </header>
        <p className="upgrade-hud-stats">
          {arc === 'I'
            ? a.rule.I(pct(PATE.neighbourMult))
            : arc === 'III'
              ? a.rule.III(WASSER.points, WASSER.maxPerArea, Math.round(WASSER.perPoint * 100))
              : a.rule[arc]}
        </p>
        <p className="arc-now" role="status">
          {!choice
            ? a.neutral
            : arc === 'IV'
              ? choice === 'heute'
                ? a.plan.heute(pct(PLAN.heute.online))
                : a.plan.morgen(pct(PLAN.morgen.away))
              : arc === 'II' && choice === 'ausbau'
                ? a.wege.ausbau(Math.round((1 - TAUSCH.ausbau.areaCost) * 100))
                : arc === 'II' && choice === 'pflege'
                  ? a.wege.pflege(Math.round((1 - TAUSCH.pflege.careCost) * 100))
                  : a.now(pctText(nowMult))}
        </p>

        {arc === 'I' ? (
          <div className="arc-options" role="radiogroup" aria-labelledby="arc-title">
            <ArcOption checked={!choice} label={a.none} onSelect={() => set(null)} />
            {planted.map((x) => {
              const m = arcRateMult(def, rates, x.id)
              return (
                <ArcOption
                  key={x.id}
                  checked={choice === x.id}
                  label={a.pate(copy.areas[x.id]!.name)}
                  detail={a.effect(pctText(m))}
                  onSelect={() => set(x.id)}
                />
              )
            })}
          </div>
        ) : null}

        {arc === 'II' ? (
          <div className="arc-options" role="radiogroup" aria-labelledby="arc-title">
            <ArcOption checked={!choice} label={a.none} onSelect={() => set(null)} />
            {TAUSCH_WEGE.map((w) => (
              <ArcOption
                key={w}
                checked={choice === w}
                label={
                  w === 'ertrag'
                    ? a.wege.ertrag(pct(TAUSCH.ertrag.rate))
                    : w === 'ausbau'
                      ? a.wege.ausbau(Math.round((1 - TAUSCH.ausbau.areaCost) * 100))
                      : a.wege.pflege(Math.round((1 - TAUSCH.pflege.careCost) * 100))
                }
                onSelect={() => set(w)}
              />
            ))}
          </div>
        ) : null}

        {arc === 'III' ? <WaterControls def={def} rates={rates} choice={choice} names={copy.areas} onSet={set} /> : null}

        {arc === 'IV' ? (
          <div className="arc-options" role="radiogroup" aria-labelledby="arc-title">
            <ArcOption checked={!choice} label={a.none} onSelect={() => set(null)} />
            {PLAN_WAHLEN.map((w) => (
              <ArcOption
                key={w}
                checked={choice === w}
                label={w === 'heute' ? a.plan.heute(pct(PLAN.heute.online)) : a.plan.morgen(pct(PLAN.morgen.away))}
                onSelect={() => set(w)}
              />
            ))}
          </div>
        ) : null}

        <p className="fest-expire">{a.capNote(pct(ARC_RULE_CAP))}</p>
        <p className="fest-expire">{a.ilseNote}</p>
      </div>
    </div>
  )
}

function ArcOption({ checked, label, detail, onSelect }: { checked: boolean; label: string; detail?: string; onSelect: () => void }) {
  return (
    <button type="button" role="radio" aria-checked={checked} className={`arc-option${checked ? ' on' : ''}`} onClick={onSelect}>
      <span className="arc-option-label">{label}</span>
      {detail ? <span className="arc-option-detail">{detail}</span> : null}
    </button>
  )
}

function WaterControls({
  def,
  rates,
  choice,
  names,
  onSet,
}: {
  def: ReturnType<typeof chapterDef>
  rates: number[]
  choice: string | null
  names: Record<string, { name: string }>
  onSet: (c: string | null) => void
}) {
  const pts = waterPoints(def, choice) ?? def.areas.map(() => 0)
  const used = pts.reduce((x, y) => x + y, 0)
  const change = (k: number, d: number) => {
    const next = pts.map((p, i) => (i === k ? p + d : p))
    onSet(next.some((p) => p > 0) ? next.join(',') : null)
  }
  return (
    <>
      <p className="arc-water-left" role="status">
        {t.arcRules.waterLeft(WASSER.points - used)}
      </p>
      <ul className="arc-water">
        {def.areas.map((x, k) => {
          const name = names[x.id]!.name
          const planted = rates[k]! > 0
          return (
            <li key={x.id} className={planted ? undefined : 'off'}>
              <span>{t.arcRules.water(name, pts[k]!)}</span>
              <span className="arc-water-btns">
                <button type="button" className="btn ghost" aria-label={t.arcRules.waterRemove(name)} disabled={pts[k]! <= 0} onClick={() => change(k, -1)}>
                  −
                </button>
                <button
                  type="button"
                  className="btn ghost"
                  aria-label={t.arcRules.waterAdd(name)}
                  disabled={!planted || pts[k]! >= WASSER.maxPerArea || used >= WASSER.points}
                  onClick={() => change(k, 1)}
                >
                  +
                </button>
              </span>
            </li>
          )
        })}
      </ul>
    </>
  )
}
