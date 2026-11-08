import { formatClock, formatDecimal } from '../game/format'
import { t } from '../i18n'
import type { useGame } from '../game/useGame'
import { CONTEST_REWARDS, NEIGHBOURS, neighbourNow } from '../game/extrasCore'
import { weekKey } from '../game/monetization'
import { playSfx } from '../game/sound'

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
  /** „Keine Fahne gehisst“ links to the Markt */
  onOpenShop?: () => void
}


export function ClanPanel({ game, onOpenShop }: Props) {
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
        {clanBoostActive || !onOpenShop ? (
          <div className={`clan-boost-status${clanBoostActive ? ' active' : ' idle'}`}>
            {clanBoostActive
              ? t.clan.boostActive(formatDecimal(clanMult, 2), formatClock(clanBoostMsLeft))
              : t.clan.boostInactive}
          </div>
        ) : (
          <button type="button" className="btn ghost clan-flag-link" onClick={onOpenShop}>
            {t.ux.clan.flagCta} →
          </button>
        )}
      </div>

      <PumpkinContest game={game} />

      <p className="shield-note">{game.shieldReady ? t.shield.ready : t.shield.used}</p>

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

/** Größter Kürbis — weekly offline Vereinsrunde against the neighbours. */
function PumpkinContest({ game }: { game: GameApi }) {
  const { state, nowTick } = game
  const week = weekKey(nowTick)
  const kg = state.contestWeek === week ? state.contestKg : 0
  const rows = [
    ...NEIGHBOURS.map((name, i) => ({ name, kg: neighbourNow(week, nowTick)[i]!, you: false })),
    { name: t.contest.you, kg, you: true },
  ].sort((a, b) => b.kg - a.kg)
  const [y, m, d] = [Number(week.slice(0, 4)), Number(week.slice(6, 8)), Number(week.slice(8, 10))]
  const end = new Date(y, m - 1, d + 7).getTime()
  const days = Math.max(1, Math.ceil((end - nowTick) / 86_400_000))
  const r = state.contestResult
  return (
    <section className="contest-block" aria-labelledby="contest-heading">
      <h3 id="contest-heading" className="subhead">
        {t.contest.title}
      </h3>
      <p className="muted">{t.contest.intro}</p>
      <p className="contest-honest">{t.contest.honest}</p>
      {r ? (
        <div className="contest-result">
          <span>{t.contest.result(r.rank, t.contest.kg(r.kg))}</span>
          <button
            type="button"
            className="btn buy"
            disabled={r.claimed}
            onClick={() => {
              game.claimPumpkin()
              playSfx('claim')
            }}
          >
            {r.claimed ? t.contest.claimed : t.contest.claim(CONTEST_REWARDS[Math.min(r.rank, 10) - 1] ?? 5)}
          </button>
        </div>
      ) : null}
      {(() => {
        const rank = rows.findIndex((x) => x.you) + 1
        return (
          <div className="contest-mine">
            <span className="contest-mine-pumpkin" style={{ transform: `scale(${0.75 + Math.min(1, kg / 90) * 0.6})` }} aria-hidden="true" />
            <div>
              <p className="contest-mine-label">{t.contest.you}</p>
              <p className="contest-mine-kg">{t.contest.kg(kg)}</p>
            </div>
            <p className="contest-mine-rank">#{rank}</p>
          </div>
        )
      })()}
      <p className="contest-meta">
        {t.contest.endsIn(days)} · {t.contest.rewards}
      </p>
      <ol className="leaderboard contest-board">
        {rows.map((row, i) => (
          <li key={row.name} className={row.you ? 'leaderboard-row you' : 'leaderboard-row'}>
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-name">
              <span className="pumpkin-dot" style={{ transform: `scale(${0.6 + Math.min(1, row.kg / 90) * 0.8})` }} aria-hidden="true" />
              {row.name}
            </span>
            <span className="lb-score">{t.contest.kg(row.kg)}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
