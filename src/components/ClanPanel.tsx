import { formatClock, formatDecimal } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'

type GameApi = ReturnType<typeof useGame>

const [r1, r2, r4, r5, r6, r7] = t.clan.rivals
const FAKE_LEADERBOARD = [
  { rank: 1, clan: r1, score: 18420 },
  { rank: 2, clan: r2, score: 15110 },
  { rank: 3, clan: t.clan.yourName, score: 9780, you: true },
  { rank: 4, clan: r4, score: 8120 },
  { rank: 5, clan: r5, score: 6405 },
  { rank: 6, clan: r6, score: 4210 },
  { rank: 7, clan: r7, score: 2890 },
]

interface Props {
  game: GameApi
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
        <div className="clan-card-name">{t.clan.yourName}</div>
        <div className="clan-card-meta">{t.clan.seasonMeta}</div>
        <div
          className={`clan-boost-status${clanBoostActive ? ' active' : ' idle'}`}
        >
          {clanBoostActive
            ? t.clan.boostActive(formatDecimal(clanMult, 2), formatClock(clanBoostMsLeft))
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
