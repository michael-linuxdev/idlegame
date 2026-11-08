import { ALBUM_GOALS, ALBUM_REWARD_AT, SEASON_DECOR, albumProgress, seasonKey, seasonOfKey } from '../game/album'
import { formatAsh } from '../game/format'
import { albumStats, syncAlbum } from '../game/state'
import { playSfx } from '../game/sound'
import type { useGame } from '../game/useGame'
import { t } from '../i18n'
import { DecorArt } from '../theme/DecorArt'

type GameApi = ReturnType<typeof useGame>

/** Jahreszeiten-Album: 12 goals of the real season, stamps, season Deko. */
export function AlbumSheet({ game, onClose }: { game: GameApi; onClose: () => void }) {
  const s = syncAlbum(game.state, game.nowTick)
  const key = s.album.key || seasonKey(game.nowTick)
  const season = seasonOfKey(key)
  const deco = SEASON_DECOR[season]
  const stats = albumStats(s)
  const n = s.album.claimed.length
  return (
    <div className="upgrade-hud-layer project-layer" onClick={onClose}>
      <div className="upgrade-hud album-sheet" role="dialog" aria-labelledby="album-title" onClick={(e) => e.stopPropagation()}>
        <header className="upgrade-hud-header">
          <h2 id="album-title">{t.album.title(t.album.seasons[season]!, key.split('-')[0]!)}</h2>
          <button type="button" className="upgrade-hud-close" onClick={onClose} aria-label="×">
            ×
          </button>
        </header>
        <div className="album-head">
          <div className={`album-reward${s.album.rewarded ? ' got' : ''}`}>
            <DecorArt id={deco} season={season} />
          </div>
          <div>
            <p className="muted">{t.album.intro(ALBUM_REWARD_AT, t.decor.names[deco]!)}</p>
            <div className="album-meter" aria-label={t.album.stamps(n, ALBUM_GOALS.length)}>
              <span style={{ width: `${Math.min(100, (n / ALBUM_REWARD_AT) * 100)}%` }} />
            </div>
            <strong className="album-count">{t.album.stamps(n, ALBUM_GOALS.length)}</strong>
            {s.album.rewarded ? <p className="album-got">{t.album.rewardGot(t.decor.names[deco]!)}</p> : null}
          </div>
        </div>
        <ul className="album-grid">
          {ALBUM_GOALS.map((g) => {
            const p = Math.min(g.need, albumProgress(s.album, stats, g.id))
            const claimed = s.album.claimed.includes(g.id)
            const ready = !claimed && p >= g.need
            return (
              <li key={g.id} className={`album-goal${claimed ? ' claimed' : ''}${ready ? ' ready' : ''}`}>
                <span className="album-stamp" aria-hidden="true">
                  {claimed ? '✓' : ''}
                </span>
                <span className="album-text">{t.album.goals[g.id]!(g.need)}</span>
                {ready ? (
                  <button
                    type="button"
                    className="btn buy album-claim"
                    onClick={() => {
                      game.claimStamp(g.id)
                      playSfx('claim')
                    }}
                  >
                    {t.album.claim}
                  </button>
                ) : (
                  <small className="album-progress">{claimed ? '' : `${formatAsh(p)}/${formatAsh(g.need)}`}</small>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
