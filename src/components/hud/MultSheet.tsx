import { formatDecimal, formatMult } from '../../game/format'
import { useDismiss } from '../../game/overlays'
import type { MultKey } from '../../game/state'
import { t } from '../../i18n'

/** Small card under the wallet: where does „×1,45“ come from? */
export function MultSheet({ rows, onClose }: { rows: { key: MultKey; mult: number }[]; onClose: () => void }) {
  useDismiss(onClose)
  const total = rows.reduce((p, r) => p * r.mult, 1)
  return (
    <div className="mult-layer" role="presentation" onClick={onClose}>
      <div className="mult-sheet" role="dialog" aria-labelledby="mult-title" onClick={(e) => e.stopPropagation()}>
        <header className="mult-head">
          <h2 id="mult-title">{t.ux.mults.title}</h2>
          <button type="button" className="sheet-x" onClick={onClose} aria-label={t.hud.progressClose}>
            ×
          </button>
        </header>
        {rows.length === 0 ? (
          <p className="mult-none">{t.ux.mults.none}</p>
        ) : (
          <>
            <p className="mult-intro">{t.ux.mults.intro}</p>
            <ul className="mult-list">
              {rows.map((r) => (
                <li key={r.key} className={r.mult < 1 ? 'down' : undefined}>
                  <span>{t.ux.mults.names[r.key] ?? r.key}</span>
                  <strong>{pct(r.mult)}</strong>
                </li>
              ))}
              <li className="mult-total">
                <span>{t.ux.mults.total}</span>
                <strong>{formatMult(total)}</strong>
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

/** ×1,25 reads as „+25 %“; big ones stay as ×. */
function pct(m: number): string {
  if (m >= 2) return formatMult(m)
  const p = (m - 1) * 100
  return `${p >= 0 ? '+' : '−'}${formatDecimal(Math.abs(p), Math.abs(p) < 10 ? 1 : 0)} %`
}
