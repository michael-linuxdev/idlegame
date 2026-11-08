import { useCallback, useEffect, useState } from 'react'
import { AppNav, type Tab } from './components/AppNav'
import { ClanPanel } from './components/ClanPanel'
import { GardenMap } from './components/GardenMap'
import { FtueCoach } from './components/FtueCoach'
import { InstallPrompt } from './components/InstallPrompt'
import { PrestigePanel } from './components/PrestigePanel'
import { ShopPanel } from './components/ShopPanel'
import { bootPlaytestLog, logPlaytest } from './game/playtestLog'
import { useGame } from './game/useGame'
import './App.css'
import './theme/garden.css'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')
  const [ftueHighlight, setFtueHighlight] = useState<string | null>(null)
  const [holdInstall, setHoldInstall] = useState(false)

  useEffect(() => bootPlaytestLog(), [])

  const onFtueActiveChange = useCallback((hold: boolean) => {
    setHoldInstall(hold)
  }, [])

  const onTabChange = useCallback((next: Tab) => {
    setTab((prev) => {
      if (prev !== next) logPlaytest('tab_open', { tab: next })
      return next
    })
  }, [])

  return (
    <div className="app-shell">
      <main className={`app-main${tab === 'fortress' ? ' map-mode' : ''}`}>
        {tab === 'fortress' ? (
          <GardenMap
            game={game}
            highlightId={ftueHighlight}
            onOpenTab={onTabChange}
          />
        ) : null}
        {tab === 'prestige' ? (
          <PrestigePanel game={game} highlight={ftueHighlight === 'prestige'} />
        ) : null}
        {tab === 'clan' ? <ClanPanel game={game} /> : null}
        {tab === 'shop' ? <ShopPanel game={game} /> : null}
      </main>

      <FtueCoach
        game={game}
        onTabChange={onTabChange}
        onHighlightChange={setFtueHighlight}
        onFtueActiveChange={onFtueActiveChange}
      />

      <InstallPrompt holdForFtue={holdInstall} />

      <AppNav tab={tab} ftueHighlight={ftueHighlight} onTabChange={onTabChange} />
    </div>
  )
}
