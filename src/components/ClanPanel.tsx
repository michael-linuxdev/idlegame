import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

const FAKE_LEADERBOARD = [
  { rank: 1, clan: 'Dachgrün Nord', score: 18420 },
  { rank: 2, clan: 'Hydro Quartier', score: 15110 },
  { rank: 3, clan: 'TurmFarm', score: 9780, you: true },
  { rank: 4, clan: 'Blattwerk KG', score: 8120 },
  { rank: 5, clan: 'Soft-Earth Co.', score: 6405 },
  { rank: 6, clan: 'LED-Hof Ost', score: 4210 },
  { rank: 7, clan: 'Aquaponik 9', score: 2890 },
]

interface Props {
  game: GameApi
}

function formatMsLeft(ms: number): string {
  const totalSec = Math.ceil(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export function ClanPanel({ game }: Props) {
  const { clanBoostActive, clanBoostMsLeft, clanMult } = game

  return (
    <section className="panel clan-panel" aria-labelledby="clan-heading">
      <header className="panel-header">
        <p className="eyebrow">{t.eyebrow}</p>
        <h2 id="clan-heading">{t.clan.title}</h2>
        <p className="muted">{t.clan.intro}</p>
      </header>

      <div className="clan-card">
        <div className="clan-card-label">{t.clan.yourClan}</div>
        <div className="clan-card-name">{t.brand}</div>
        <div className="clan-card-meta">{t.clan.seasonMeta}</div>
        <div className="clan-boost-status">
          {clanBoostActive
            ? t.clan.boostActive(clanMult.toFixed(2), formatMsLeft(clanBoostMsLeft))
            : t.clan.boostInactive}
        </div>
      </div>

      <h3 className="subhead">{t.clan.leaderboard}</h3>
      <ol className="leaderboard">
        {FAKE_LEADERBOARD.map((row) => (
          <li
            key={row.clan}
            className={row.you ? 'leaderboard-row you' : 'leaderboard-row'}
          >
            <span className="lb-rank">#{row.rank}</span>
            <span className="lb-name">
              {row.clan}
              {row.you ? ` ${t.clan.you}` : ''}
            </span>
            <span className="lb-score">
              {row.score.toLocaleString('de-DE')} {t.clan.pts}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
