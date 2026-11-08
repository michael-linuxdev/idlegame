import { useCallback, useEffect, useRef, useState } from 'react'
import { AppNav, type Tab } from './components/AppNav'
import { ClanPanel } from './components/ClanPanel'
import { GardenMap } from './components/GardenMap'
import { ChapterMap } from './components/ChapterMap'
import { CHAPTERS, type ChapterId } from './game/chapters'
import type { CosmeticId } from './game/monetization'
import { FtueCoach } from './components/FtueCoach'
import { InstallPrompt } from './components/InstallPrompt'
import { PrestigePanel } from './components/PrestigePanel'
import { ShopPanel } from './components/ShopPanel'
import { bootPlaytestLog, logPlaytest } from './game/playtestLog'
import { useGame } from './game/useGame'
import { GENERATORS } from './game/generators'
import { useNotebook, yearLetterFor, type NotebookEntryId } from './game/notebook'
import { NotebookSheet } from './components/story/NotebookSheet'
import { ProjectSheet } from './components/ProjectSheet'
import { AlbumSheet } from './components/AlbumSheet'
import { decorUnlocked } from './game/decor'
import { crossingUnlocked } from './game/crossing'
import { SeasonCeremony } from './components/story/SeasonCeremony'
import { LegalSheet } from './components/LegalSheet'
import { SaveSheet } from './components/SaveSheet'
import { ComebackLetter, COMEBACK_SEEDS } from './components/story/ComebackLetter'
import { useExtras, waterReminderDelay } from './game/extras'
import { armAmbienceOnFirstGesture } from './game/ambience'
import { t } from './i18n'
import { applyPrefClasses } from './game/prefs'
import './App.css'
import './theme/garden.css'
import './theme/hud.css'
import './theme/polish.css'
import './theme/panels.css'
import './theme/story.css'
import './theme/expansion.css'
import './theme/ux.css'

export default function App() {
  const game = useGame()
  const [tab, setTab] = useState<Tab>('fortress')
  const [plot, setPlot] = useState<'garden' | ChapterId>('garden')
  const [previewSkin, setPreviewSkin] = useState<CosmeticId | null>(null)
  const [photoMode, setPhotoMode] = useState(false)
  const chapterShown = plot !== 'garden' && game.openChapters.includes(plot) ? plot : null

  // Test hooks: ?kapitel2=1 / ?kapitel3=1 open a chapter right away
  const { forceChapter } = game
  useEffect(() => {
    try {
      const q = new URLSearchParams(location.search)
      if (q.get('kapitel2') === '1') forceChapter('obstwiese')
      if (q.get('kapitel3') === '1') forceChapter('weinberg')
      // ?kapitel=all or ?kapitel=4,7 (chapter numbers)
      const list = q.get('kapitel')
      if (list) {
        for (const c of CHAPTERS) {
          if (list === 'all' || list.split(',').includes(String(c.number))) forceChapter(c.id)
        }
      }
    } catch {
      /* ignore */
    }
  }, [forceChapter])

  const goPlot = useCallback((next: 'garden' | ChapterId) => {
    logPlaytest('plot_switch', { to: next })
    setPlot(next)
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

  // Reminder: Gießkanne full while the app sits in the background —
  // at most every 4 h and never on a quick app switch (waterReminderDelay)
  const waterLeftRef = useRef(game.tapCooldownLeftMs)
  const lastWaterNotifyRef = useRef(extras.lastWaterNotify)
  useEffect(() => {
    waterLeftRef.current = game.tapCooldownLeftMs
    lastWaterNotifyRef.current = extras.lastWaterNotify
  })
  useEffect(() => {
    if (!extras.notify || typeof Notification === 'undefined') return
    let timer: number | undefined
    const onVis = () => {
      window.clearTimeout(timer)
      if (!document.hidden || Notification.permission !== 'granted') return
      const delay = waterReminderDelay(Date.now(), lastWaterNotifyRef.current, waterLeftRef.current)
      timer = window.setTimeout(() => {
        if (!document.hidden) return
        updateExtras((s) => ({ ...s, lastWaterNotify: Date.now() }))
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
  }, [extras.notify, updateExtras])

  const toggleReminders = useCallback(async () => {
    if (extras.notify) {
      updateExtras((s) => ({ ...s, notify: false }))
      return
    }
    if (typeof Notification === 'undefined') return
    const perm = await Notification.requestPermission()
    if (perm === 'granted') updateExtras((s) => ({ ...s, notify: true }))
  }, [extras.notify, updateExtras])
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [albumOpen, setAlbumOpen] = useState(false)
  const [mapSheet, setMapSheet] = useState<'decor' | 'cross' | null>(null)
  const [notebookOpen, setNotebookOpen] = useState<{ entry: NotebookEntryId | null } | null>(null)
  const gardenStage = GENERATORS.filter(
    (g) => (game.state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  const year = game.state.prestiges + 1
  const { notebook, unread, markRead } = useNotebook(gardenStage, year, game.state.deepPrestiges, { helper: game.state.helperLevel, ilse: game.state.ilseLevel, generation: game.state.generation })
  const openNotebook = useCallback(
    (entry: NotebookEntryId | null = null) => setNotebookOpen({ entry }),
    [],
  )

  useEffect(() => bootPlaytestLog(), [])
  useEffect(() => applyPrefClasses(), [])
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
      <div className="rotate-lock" role="alert">
        <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
          <rect x="20" y="8" width="24" height="44" rx="5" fill="#fbf6e8" stroke="#6e4a2b" strokeWidth="3" />
          <circle cx="32" cy="45" r="2.4" fill="#6e4a2b" />
          <path d="M10 34a22 22 0 0 1 8-17M54 30a22 22 0 0 1-8 17" stroke="#5f9e45" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M14 14l4 3-5 2zM50 50l-4-3 5-2z" fill="#5f9e45" />
        </svg>
        <p>{t.rotate}</p>
      </div>
      <main
        className={`app-main${tab === 'fortress' ? ' map-mode' : ''}`}
        tabIndex={tab === 'fortress' ? undefined : 0}
      >
        {tab === 'fortress' && chapterShown ? <ChapterMap key={chapterShown} game={game} chapter={chapterShown} onGo={goPlot} /> : null}
        {tab === 'fortress' && !chapterShown ? (
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
            onGoPlot={goPlot}
            previewSkin={previewSkin}
            onEndPreview={() => {
              setPreviewSkin(null)
              onTabChange('shop')
            }}
            photoMode={photoMode}
            sheet={mapSheet}
            onSheet={setMapSheet}
            onExitPhoto={() => setPhotoMode(false)}
          />
        ) : null}
        {tab === 'prestige' ? (
          <PrestigePanel
            game={game}
            highlight={ftueHighlight === 'prestige'}
            onOpenChapter={(id) => {
              goPlot(id)
              onTabChange('fortress')
            }}
          />
        ) : null}
        {tab === 'clan' ? <ClanPanel game={game} /> : null}
        {tab === 'shop' ? (
          <ShopPanel
            game={game}
            onPreview={(id) => {
              setPreviewSkin(id)
              setPlot('garden')
              onTabChange('fortress')
            }}
          />
        ) : null}
      </main>

      <FtueCoach
        game={game}
        onTabChange={onTabChange}
        onHighlightChange={setFtueHighlight}
        onFtueActiveChange={onFtueActiveChange}
        onCoachVisible={setCoachVisible}
      />

      {/* Install cue waits for the first Saisonende — never in the first session */}
      <InstallPrompt
        holdForFtue={
          holdInstall ||
          (game.state.prestiges < 1 && game.state.deepPrestiges === 0 && game.state.generation === 0)
        }
      />

      <AppNav
        tab={tab}
        ftueHighlight={ftueHighlight}
        onTabChange={onTabChange}
        onOpenNotebook={() => openNotebook(null)}
        onOpenLegal={() => setLegalOpen(true)}
        onOpenBackup={() => setBackupOpen(true)}
        onOpenDecor={decorUnlocked(game.state) ? () => { goPlot('garden'); setMapSheet('decor') } : undefined}
        onOpenCross={crossingUnlocked(game.state.collection) ? () => { goPlot('garden'); setMapSheet('cross') } : undefined}
        crossReady={!!game.state.crossing && game.state.crossing.endsAt <= game.nowTick}
        onOpenAlbum={game.state.prestiges >= 1 || game.state.deepPrestiges > 0 || game.state.generation > 0 ? () => setAlbumOpen(true) : undefined}
        albumReady={game.albumReady}
        onOpenProjects={game.openChapters.length > 0 ? () => setProjectsOpen(true) : undefined}
        onOpenPhoto={() => {
          setPlot('garden')
          onTabChange('fortress')
          setPhotoMode(true)
        }}
        reminders={extras.notify}
        onToggleReminders={toggleReminders}
        unreadLetters={unread.length}
      />

      {albumOpen ? <AlbumSheet game={game} onClose={() => setAlbumOpen(false)} /> : null}
      {projectsOpen ? <ProjectSheet game={game} onClose={() => setProjectsOpen(false)} /> : null}
      {notebookOpen ? (
        <NotebookSheet
          notebook={notebook}
          initialEntry={notebookOpen.entry}
          onRead={markRead}
          onClose={() => setNotebookOpen(null)}
          collection={game.state.collection}
          residentsSeen={game.state.residentsSeen}
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
