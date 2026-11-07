import { useState } from 'react'
import { ClanPanel } from './components/ClanPanel'
import { DominionPanel } from './components/DominionPanel'
import { useGame } from './game/useGame'
import './App.css'

type Tab = 'dominion' | 'clan'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('dominion')

  return (
    <div className="app-shell">
      <div className="atmosphere" aria-hidden="true" />
      <main className="app-main">
        {tab === 'dominion' ? <DominionPanel game={game} /> : <ClanPanel />}
      </main>
      <nav className="tab-bar" aria-label="Primary">
        <button
          type="button"
          className={tab === 'dominion' ? 'tab active' : 'tab'}
          onClick={() => setTab('dominion')}
        >
          Dominion
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
