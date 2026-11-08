import { useCallback, useEffect, useState } from 'react'
import { AppNav, type Tab } from './components/AppNav'
import { ClanPanel } from './components/ClanPanel'
import { GardenMap } from './components/GardenMap'
import { OrchardMap } from './components/OrchardMap'
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
import { SaveSheet } from './components/SaveSheet'
import { ComebackLetter, COMEBACK_SEEDS } from './components/story/ComebackLetter'
import { useExtras } from './game/extras'
import { armAmbienceOnFirstGesture } from './game/ambience'
import { t } from './i18n'
import './App.css'
import './theme/garden.css'
import './theme/hud.css'
import './theme/polish.css'
import './theme/panels.css'
import './theme/story.css'
import './theme/expansion.css'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')
  const [plot, setPlot] = useState<'garden' | 'orchard'>('garden')
  const orchardOpen = game.orchardOpen

  // Test hook: ?kapitel2=1 opens the Streuobstwiese without a Tiefer Winter
  const { forceOrchard } = game
  useEffect(() => {
    try {
      if (new URLSearchParams(location.search).get('kapitel2') === '1') forceOrchard()
    } catch {
      /* ignore */
    }
  }, [forceOrchard])

  const switchPlot = useCallback(() => {
    setPlot((p) => {
      const next = p === 'garden' ? 'orchard' : 'garden'
      logPlaytest('plot_switch', { to: next })
      return next
    })
  }, [])
  const [ftueHighlight, setFtueHighlight] = useState<string | null>(null)
  const [holdInstall, setHoldInstall] = useState(false)
  const [coachVisible, setCoachVisible] = useState(true)
  const [legalOpen, setLegalOpen] = useState(false)
  const [backupOpen, setBackupOpen] = useState(false)
  const { extras, update: updateExtras, track } = useExtras()
  const [comebackOpen, setComebackOpen] = useState(
    () => Date.now() - extras.lastVisit >= 48 * 3600_000,
  )

  // Remember the last visit (for Omas comeback letter)
  useEffect(() => {
    const mark = () => updateExtras((s) => ({ ...s, lastVisit: Date.now() }))
    mark()
    const id = window.setInterval(mark, 60_000)
    document.addEventListener('visibilitychange', mark)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', mark)
    }
  }, [updateExtras])

  // Reminder: Gießkanne full while the app sits in the background
  const waterLeft = game.tapCooldownLeftMs
  useEffect(() => {
    if (!extras.notify || typeof Notification === 'undefined') return
    let timer: number | undefined
    const onVis = () => {
      window.clearTimeout(timer)
      if (!document.hidden || Notification.permission !== 'granted') return
      const delay = Math.max(1000, waterLeft)
      timer = window.setTimeout(() => {
        const body = t.reminders.water
        navigator.serviceWorker?.ready
          .then((reg) => reg.showNotification(t.brand, { body, icon: './pwa-192.png', tag: 'water' }))
          .catch(() => new Notification(t.brand, { body }))
      }, delay)
    }
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [extras.notify, waterLeft])

  const toggleReminders = useCallback(async () => {
    if (extras.notify) {
      updateExtras((s) => ({ ...s, notify: false }))
      return
    }
    if (typeof Notification === 'undefined') return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') updateExtras((s) => ({ ...s, notify: true }))
  }, [extras.notify, updateExtras])
  const [notebookOpen, setNotebookOpen] = useState<{ entry: NotebookEntryId | null } | null>(null)
  const gardenStage = GENERATORS.filter(
    (g) => (game.state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  const year = game.state.prestiges + 1
  const { notebook, unread, markRead } = useNotebook(gardenStage, year, game.state.deepPrestiges)
  const openNotebook = useCallback(
    (entry: NotebookEntryId | null = null) => setNotebookOpen({ entry }),
    [],
  )

  useEffect(() => bootPlaytestLog(), [])
  useEffect(() => armAmbienceOnFirstGesture(), [])

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
      <main
        className={`app-main${tab === 'fortress' ? ' map-mode' : ''}`}
        tabIndex={tab === 'fortress' ? undefined : 0}
      >
        {tab === 'fortress' && plot === 'orchard' && orchardOpen ? (
          <OrchardMap game={game} onSwitchPlot={switchPlot} />
        ) : null}
        {tab === 'fortress' && (plot === 'garden' || !orchardOpen) ? (
          <GardenMap
            game={game}
            highlightId={ftueHighlight}
            onOpenTab={onTabChange}
            unreadLetters={unread.length}
            onOpenNotebook={() => openNotebook(unread[0] ?? null)}
            extras={extras}
            updateExtras={updateExtras}
            track={track}
            hintsBlocked={coachVisible || Boolean(game.seasonEnd) || comebackOpen}
            onSwitchPlot={orchardOpen ? switchPlot : undefined}
          />
        ) : null}
        {tab === 'prestige' ? (
          <PrestigePanel
            game={game}
            highlight={ftueHighlight === 'prestige'}
            onOpenOrchard={
              orchardOpen
                ? () => {
                    setPlot('orchard')
                    onTabChange('fortress')
                  }
                : undefined
            }
          />
        ) : null}
        {tab === 'clan' ? <ClanPanel game={game} /> : null}
        {tab === 'shop' ? <ShopPanel game={game} /> : null}
      </main>

      <FtueCoach
        game={game}
        onTabChange={onTabChange}
        onHighlightChange={setFtueHighlight}
        onFtueActiveChange={onFtueActiveChange}
        onCoachVisible={setCoachVisible}
      />

      <InstallPrompt holdForFtue={holdInstall} />

      <AppNav
        tab={tab}
        ftueHighlight={ftueHighlight}
        onTabChange={onTabChange}
        onOpenNotebook={() => openNotebook(null)}
        onOpenLegal={() => setLegalOpen(true)}
        onOpenBackup={() => setBackupOpen(true)}
        reminders={extras.notify}
        onToggleReminders={toggleReminders}
        unreadLetters={unread.length}
      />

      {notebookOpen ? (
        <NotebookSheet
          notebook={notebook}
          initialEntry={notebookOpen.entry}
          onRead={markRead}
          onClose={() => setNotebookOpen(null)}
          collection={game.state.collection}
        />
      ) : null}

      {legalOpen ? <LegalSheet onClose={() => setLegalOpen(false)} /> : null}
      {backupOpen ? <SaveSheet onClose={() => setBackupOpen(false)} /> : null}

      {comebackOpen && !game.seasonEnd ? (
        <ComebackLetter
          onAccept={() => {
            game.grant({ samen: COMEBACK_SEEDS, ernteSeconds: 1800 })
            setComebackOpen(false)
          }}
        />
      ) : null}

      {game.seasonEnd ? (
        <SeasonCeremony
          event={game.seasonEnd}
          onSpin={game.spinWheel}
          onDone={() => {
            const letter = game.seasonEnd!.deep ? 'deep1' : yearLetterFor(game.seasonEnd!.year)
            if (letter) markRead(letter)
            game.ackSeasonEnd()
            track('seasons')
            onTabChange('fortress')
          }}
        />
      ) : null}
    </div>
  )
}
