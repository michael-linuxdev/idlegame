import { useCallback, useState } from 'react'
import { ClanPanel } from './components/ClanPanel'
import { FortressMap } from './components/FortressMap'
import { FtueCoach } from './components/FtueCoach'
import { InstallPrompt } from './components/InstallPrompt'
import { PrestigePanel } from './components/PrestigePanel'
import { ShopPanel } from './components/ShopPanel'
import { useGame } from './game/useGame'
import { t } from './i18n'
import './App.css'

type Tab = 'fortress' | 'prestige' | 'clan' | 'shop'

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

      <InstallPrompt
        offlineAwayMs={game.offlineAwayMs}
        offlineClaimed={game.offlineGained != null}
        holdForFtue={holdInstall}
      />

      <nav className="tab-bar tabs-4" aria-label={t.nav.ariaLabel}>
        <button
          type="button"
          className={tab === 'fortress' ? 'tab active' : 'tab'}
          onClick={() => setTab('fortress')}
        >
          {t.nav.station}
        </button>
        <button
          type="button"
          className={`tab${tab === 'prestige' ? ' active' : ''}${ftueHighlight === 'prestige' ? ' ftue-tab' : ''}`}
          onClick={() => setTab('prestige')}
        >
          {t.nav.prestige}
        </button>
        <button
          type="button"
          className={`tab${tab === 'clan' ? ' active' : ''}${ftueHighlight === 'clan' ? ' ftue-tab' : ''}`}
          onClick={() => setTab('clan')}
        >
          {t.nav.clan}
        </button>
        <button
          type="button"
          className={tab === 'shop' ? 'tab active' : 'tab'}
          onClick={() => setTab('shop')}
        >
          {t.nav.shop}
        </button>
      </nav>
    </div>
  )
}
