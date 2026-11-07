const FAKE_LEADERBOARD = [
  { rank: 1, clan: 'Cinder Throne', score: 18420 },
  { rank: 2, clan: 'Ember Covenant', score: 15110 },
  { rank: 3, clan: 'Ash Dominion', score: 9780, you: true },
  { rank: 4, clan: 'Soot Wardens', score: 8120 },
  { rank: 5, clan: 'Black Pyre', score: 6405 },
  { rank: 6, clan: 'Ruin Kin', score: 4210 },
  { rank: 7, clan: 'Charred Banner', score: 2890 },
]

export function ClanPanel() {
  return (
    <section className="panel clan-panel" aria-labelledby="clan-heading">
      <header className="panel-header">
        <h2 id="clan-heading">Clan</h2>
        <p className="muted">
          Seasonal dominion is shared on the map. Backend comes later — this is a
          local placeholder.
        </p>
      </header>

      <div className="clan-card">
        <div className="clan-card-label">Your clan</div>
        <div className="clan-card-name">Ash Dominion</div>
        <div className="clan-card-meta">Season I · Rank 3 · Placeholder</div>
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
