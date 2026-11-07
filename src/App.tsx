import { useState } from 'react'
import { ClanPanel } from './components/ClanPanel'
import { FortressMap } from './components/FortressMap'
import { FtueCoach } from './components/FtueCoach'
import { InstallPrompt } from './components/InstallPrompt'
import { PrestigePanel } from './components/PrestigePanel'
import { useGame } from './game/useGame'
import './App.css'

type Tab = 'fortress' | 'prestige' | 'clan'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')
  const [ftueHighlight, setFtueHighlight] = useState<string | null>(null)

  return (
    <div className="app-shell">
      <main className={`app-main${tab === 'fortress' ? ' map-mode' : ''}`}>
        {tab === 'fortress' ? (
          <FortressMap game={game} highlightId={ftueHighlight} />
        ) : null}
        {tab === 'prestige' ? (
          <PrestigePanel game={game} highlight={ftueHighlight === 'prestige'} />
        ) : null}
        {tab === 'clan' ? <ClanPanel /> : null}
      </main>

      <FtueCoach
        game={game}
        onTabChange={setTab}
        onHighlightChange={setFtueHighlight}
      />

      <InstallPrompt
        offlineAwayMs={game.offlineAwayMs}
        offlineClaimed={game.offlineGained != null}
      />

      <nav className="tab-bar tabs-3" aria-label="Primary">
        <button
          type="button"
          className={tab === 'fortress' ? 'tab active' : 'tab'}
          onClick={() => setTab('fortress')}
        >
          Outpost
        </button>
        <button
          type="button"
          className={`tab${tab === 'prestige' ? ' active' : ''}${ftueHighlight === 'prestige' ? ' ftue-tab' : ''}`}
          onClick={() => setTab('prestige')}
        >
          Prestige
        </button>
        <button
          type="button"
          className={`tab${tab === 'clan' ? ' active' : ''}${ftueHighlight === 'clan' ? ' ftue-tab' : ''}`}
          onClick={() => setTab('clan')}
        >
          Clan
        </button>
      </nav>
    </div>
  )
}
