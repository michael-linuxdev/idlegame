const FAKE_LEADERBOARD = [
  { rank: 1, clan: 'Helios Ring', score: 18420 },
  { rank: 2, clan: 'Vector Claim', score: 15110 },
  { rank: 3, clan: 'Orbital Claim', score: 9780, you: true },
  { rank: 4, clan: 'Ice Belt Co.', score: 8120 },
  { rank: 5, clan: 'Nova Survey', score: 6405 },
  { rank: 6, clan: 'Drift Cartel', score: 4210 },
  { rank: 7, clan: 'Lagrange Nine', score: 2890 },
]

export function ClanPanel() {
  return (
    <section className="panel clan-panel" aria-labelledby="clan-heading">
      <header className="panel-header">
        <h2 id="clan-heading">Clan</h2>
        <p className="muted">
          Seasonal sector control is shared on the map. Backend comes later — this
          is a local placeholder.
        </p>
      </header>

      <div className="clan-card">
        <div className="clan-card-label">Your clan</div>
        <div className="clan-card-name">Orbital Claim</div>
        <div className="clan-card-meta">Season 0 — Survey · Rank 3 · Placeholder</div>
      </div>

      <h3 className="subhead">Season leaderboard</h3>
      <ol className="leaderboard">
        {FAKE_LEADERBOARD.map((row) => (
          <li
            key={row.clan}
            className={row.you ? 'leaderboard-row you' : 'leaderboard-row'}
          >
            <span className="lb-rank">#{row.rank}</span>
            <span className="lb-name">
              {row.clan}
              {row.you ? ' (you)' : ''}
            </span>
            <span className="lb-score">{row.score.toLocaleString()} pts</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
