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
import { GENERATORS } from './game/generators'
import { useNotebook, yearLetterFor, type NotebookEntryId } from './game/notebook'
import { NotebookSheet } from './components/story/NotebookSheet'
import { SeasonCeremony } from './components/story/SeasonCeremony'
import { LegalSheet } from './components/LegalSheet'
import './App.css'
import './theme/garden.css'
import './theme/hud.css'
import './theme/polish.css'
import './theme/panels.css'
import './theme/story.css'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')
  const [ftueHighlight, setFtueHighlight] = useState<string | null>(null)
  const [holdInstall, setHoldInstall] = useState(false)
  const [legalOpen, setLegalOpen] = useState(false)
  const [notebookOpen, setNotebookOpen] = useState<{ entry: NotebookEntryId | null } | null>(null)
  const gardenStage = GENERATORS.filter(
    (g) => (game.state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  const year = game.state.prestiges + 1
  const { notebook, unread, markRead } = useNotebook(gardenStage, year)
  const openNotebook = useCallback(
    (entry: NotebookEntryId | null = null) => setNotebookOpen({ entry }),
    [],
  )

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
            unreadLetters={unread.length}
            onOpenNotebook={() => openNotebook(unread[0] ?? null)}
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

      <AppNav
        tab={tab}
        ftueHighlight={ftueHighlight}
        onTabChange={onTabChange}
        onOpenNotebook={() => openNotebook(null)}
        onOpenLegal={() => setLegalOpen(true)}
        unreadLetters={unread.length}
      />

      {notebookOpen ? (
        <NotebookSheet
          notebook={notebook}
          initialEntry={notebookOpen.entry}
          onRead={markRead}
          onClose={() => setNotebookOpen(null)}
        />
      ) : null}

      {legalOpen ? <LegalSheet onClose={() => setLegalOpen(false)} /> : null}

      {game.seasonEnd ? (
        <SeasonCeremony
          event={game.seasonEnd}
          onDone={() => {
            const letter = yearLetterFor(game.seasonEnd!.year)
            if (letter) markRead(letter)
            game.ackSeasonEnd()
            onTabChange('fortress')
          }}
        />
      ) : null}
    </div>
  )
}
