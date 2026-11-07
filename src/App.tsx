import { useCallback, useState } from 'react'
import { AppNav, type Tab } from './components/AppNav'
import { ClanPanel } from './components/ClanPanel'
import { FortressMap } from './components/FortressMap'
import { FtueCoach } from './components/FtueCoach'
import { InstallPrompt } from './components/InstallPrompt'
import { PrestigePanel } from './components/PrestigePanel'
import { ShopPanel } from './components/ShopPanel'
import { useGame } from './game/useGame'
import './App.css'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')
  const [ftueHighlight, setFtueHighlight] = useState<string | null>(null)
  const [holdInstall, setHoldInstall] = useState(false)

  const onFtueActiveChange = useCallback((hold: boolean) => {
    setHoldInstall(hold)
  }, [])

  return (
    <div className="app-shell">
      <main className={`app-main${tab === 'fortress' ? ' map-mode' : ''}`}>
        {tab === 'fortress' ? (
          <FortressMap game={game} highlightId={ftueHighlight} />
        ) : null}
        {tab === 'prestige' ? (
          <PrestigePanel game={game} highlight={ftueHighlight === 'prestige'} />
        ) : null}
        {tab === 'clan' ? <ClanPanel game={game} /> : null}
        {tab === 'shop' ? <ShopPanel game={game} /> : null}
      </main>

      <FtueCoach
        game={game}
        onTabChange={setTab}
        onHighlightChange={setFtueHighlight}
        onFtueActiveChange={onFtueActiveChange}
      />

      <InstallPrompt holdForFtue={holdInstall} />

      <AppNav tab={tab} ftueHighlight={ftueHighlight} onTabChange={setTab} />
    </div>
  )
}
