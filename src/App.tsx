import { useState } from 'react'
import { ClanPanel } from './components/ClanPanel'
import { FortressMap } from './components/FortressMap'
import { PrestigePanel } from './components/PrestigePanel'
import { useGame } from './game/useGame'
import './App.css'

type Tab = 'fortress' | 'prestige' | 'clan'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')

  return (
    <div className="app-shell">
      <main className={`app-main${tab === 'fortress' ? ' map-mode' : ''}`}>
        {tab === 'fortress' ? <FortressMap game={game} /> : null}
        {tab === 'prestige' ? <PrestigePanel game={game} /> : null}
        {tab === 'clan' ? <ClanPanel /> : null}
      </main>
      <nav className="tab-bar tabs-3" aria-label="Primary">
        <button
          type="button"
          className={tab === 'fortress' ? 'tab active' : 'tab'}
          onClick={() => setTab('fortress')}
        >
          Fortress
        </button>
        <button
          type="button"
          className={tab === 'prestige' ? 'tab active' : 'tab'}
          onClick={() => setTab('prestige')}
        >
          Prestige
        </button>
        <button
          type="button"
          className={tab === 'clan' ? 'tab active' : 'tab'}
          onClick={() => setTab('clan')}
        >
          Clan
        </button>
      </nav>
    </div>
  )
}
