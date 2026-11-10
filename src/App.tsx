import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { AppNav, type Tab } from './components/AppNav'
import {
  ClanPanel,
  ChapterMap,
  PrestigePanel,
  ShopPanel,
  NotebookSheet,
  ProjectSheet,
  AlbumSheet,
  SeasonCeremony,
  CollectionSheet,
  LegalSheet,
  SaveSheet,
  preloadLazy,
} from './components/lazy'
import { GardenMap } from './components/GardenMap'
import { CHAPTERS, type ChapterId } from './game/chapters'
import type { CosmeticId } from './game/monetization'
import { FtueCoach } from './components/FtueCoach'
import { InstallPrompt } from './components/InstallPrompt'
import { InstallGate } from './components/InstallGate'
import { TestPhaseNotice } from './components/TestPhaseNotice'
import { AdOverlay } from './components/AdOverlay'
import { bootPlaytestLog, logPlaytest } from './game/playtestLog'
import { SaveGuardBanner } from './components/SaveGuardBanner'
import { useGame } from './game/useGame'
import { GENERATORS } from './game/generators'
import { useNotebook, yearLetterFor, type NotebookEntryId } from './game/notebook'
import { getFeaturesSeen, markFeatureSeen, MENU_FEATURES, subscribeFeaturesSeen, type FeatureId } from './game/featureUnlocks'
import { SeasonCardPicker } from './components/SeasonCardPicker'
import { ComebackLetter, COMEBACK_SEEDS } from './components/story/ComebackLetter'
import { useExtras } from './game/extras'
import { deliver, planReminder, pruneSent, type ReminderCandidate } from './game/notify'
import { armAmbienceOnFirstGesture } from './game/ambience'
import { t, useLocale } from './i18n'
import { formatClock } from './game/format'
import { applyPrefClasses } from './game/prefs'
import { useDismiss } from './game/overlays'
import { countAffordableTruheBuys, offlineCapsHours } from './game/truhe'
import { chapterCopy } from './components/chapterCopy'
import './App.css'
import './theme/garden.css'
import './theme/hud.css'
import './theme/polish.css'
import './theme/panels.css'
import './theme/story.css'
import './theme/expansion.css'
import './theme/ux.css'
import { prefetchChapterArt } from './theme/art/chapterArt'

export default function App() {
  // Sprachwechsel live: die ganze Oberfläche zeichnet sich neu
  useLocale()
  const game = useGame()
  const featuresSeen = useSyncExternalStore(subscribeFeaturesSeen, getFeaturesSeen)
  const newMenuKeys = new Set<string>(MENU_FEATURES.filter((id) => game.features.has(id) && !featuresSeen.includes(id)))
  const [tab, setTab] = useState<Tab>('garten')
  const [plot, setPlot] = useState<'garden' | ChapterId>('garden')
  const [previewSkin, setPreviewSkin] = useState<CosmeticId | null>(null)
  const [photoMode, setPhotoMode] = useState(false)
  const chapterShown = plot !== 'garden' && game.openChapters.includes(plot) ? plot : null
  // Kapitel-Grafik der offenen Kapitel im Leerlauf vorladen (eigene Bündel)
  const openKey = game.openChapters.join(',')
  useEffect(() => {
    if (openKey) prefetchChapterArt(openKey.split(',') as ChapterId[])
  }, [openKey])
  // Selten genutzte Fenster (eigene Bündel) im Leerlauf vorladen
  useEffect(() => preloadLazy(), [])

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

  // Erinnerungen, solange die App im Hintergrund läuft (notify.ts):
  // Gießkanne voll, Kreuzung fertig, Korb voll — max. 2/Tag, nie 22–8 Uhr
  const reminderRef = useRef({ water: game.tapCooldownLeftMs, cross: 0, basketHours: 8, sent: extras.notifySent ?? [] })
  useEffect(() => {
    const s = game.state
    reminderRef.current = {
      water: game.tapCooldownLeftMs,
      cross: s.crossing ? s.crossing.endsAt : 0,
      basketHours: offlineCapsHours(s.truhe).hard,
      sent: extras.notifySent ?? [],
    }
  })
  useEffect(() => {
    if (!extras.notify || typeof Notification === 'undefined') return
    let timer: number | undefined
    const onVis = () => {
      window.clearTimeout(timer)
      if (!document.hidden || Notification.permission !== 'granted') return
      const now = Date.now()
      const r = reminderRef.current
      const candidates: ReminderCandidate[] = [
        { kind: 'water', inMs: r.water },
        { kind: 'basket', inMs: r.basketHours * 3600_000 },
      ]
      if (r.cross > now) candidates.push({ kind: 'cross', inMs: r.cross - now })
      const plan = planReminder(now, candidates, r.sent)
      if (!plan) return
      timer = window.setTimeout(() => {
        if (!document.hidden) return
        const at = Date.now()
        updateExtras((s) => ({ ...s, lastWaterNotify: at, notifySent: pruneSent([...(s.notifySent ?? []), at], at) }))
        deliver(t.brand, t.reminders[plan.kind], plan.kind)
      }, plan.delay)
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
  const [collectionOpen, setCollectionOpen] = useState(false)
  const [mapSheet, setMapSheet] = useState<'decor' | 'cross' | null>(null)
  const [notebookOpen, setNotebookOpen] = useState<{ entry: NotebookEntryId | null } | null>(null)
  const gardenStage = GENERATORS.filter(
    (g) => (game.state.owned[g.id] ?? 0) > 0 && game.unlocked(g.id),
  ).length
  const year = game.state.saisonenden + 1
  const { notebook, unread, markRead } = useNotebook(gardenStage, year, game.state.tiefeWinter, { helper: game.state.helperLevel, ilse: game.state.ilseLevel, generation: game.state.generation })
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
  // Deko/Kreuzen liegen auf der Garten-Karte: aus Markt oder Saison erst dorthin wechseln
  const openMapSheet = (sheet: 'decor' | 'cross') => {
    goPlot('garden')
    onTabChange('garten')
    setMapSheet(sheet)
  }

  // Panels (Saison, Markt, Verein): Escape / Zurück returns to the garden
  useDismiss(() => onTabChange('garten'), tab !== 'garten')

  // ≥ 900 px: map on the left, the open panel as a column on the right
  const wide = useWide()

  // Tapping „Garten“ again opens the Grundstücke picker (when there is more than one)
  const openPlots = useCallback(() => {
    window.dispatchEvent(new Event('gartenerbe-open-plots'))
  }, [])

  const seasonReady =
    game.canPrestige ||
    (game.state.erbstuecke > 0 &&
      countAffordableTruheBuys(
        game.state.truhe,
        game.state.erbstuecke,
        game.state.ernteSeason,
        game.state.owned,
        game.state.saisonenden,
      ) > 0)
  const plotLabel = chapterShown ? chapterCopy(chapterShown).chip : undefined

  const panelView = (
    <>
        {tab === 'prestige' ? (
          <PrestigePanel
            game={game}
            highlight={ftueHighlight === 'prestige'}
            onOpenChapter={(id) => {
              goPlot(id)
              onTabChange('garten')
            }}
          />
        ) : null}
        {tab === 'clan' ? <ClanPanel game={game} onOpenShop={() => onTabChange('shop')} /> : null}
        {tab === 'shop' ? (
          <ShopPanel
            game={game}
            plot={chapterShown ?? 'garden'}
            onPreview={(id) => {
              setPreviewSkin(id)
              setPlot('garden')
              onTabChange('garten')
            }}
          />
        ) : null}
    </>
  )

  return (
    <div className={`app-shell${wide ? ' wide' : ''}${wide && tab !== 'garten' ? ' with-side' : ''}`}>
      <div className="rotate-lock" role="alert">
        <svg viewBox="0 0 64 64" width="64" height="64" aria-hidden="true">
          <rect x="20" y="8" width="24" height="44" rx="5" fill="#fbf6e8" stroke="#6e4a2b" strokeWidth="3" />
          <circle cx="32" cy="45" r="2.4" fill="#6e4a2b" />
          <path d="M10 34a22 22 0 0 1 8-17M54 30a22 22 0 0 1-8 17" stroke="#5f9e45" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M14 14l4 3-5 2zM50 50l-4-3 5-2z" fill="#5f9e45" />
        </svg>
        <p>{t.rotate}</p>
      </div>
      <SaveGuardBanner />
      <main
        className={`app-main${tab === 'garten' || wide ? ' map-mode' : ''}`}
        tabIndex={tab === 'garten' || wide ? undefined : 0}
      >
        {(tab === 'garten' || wide) && chapterShown ? <ChapterMap key={chapterShown} game={game} chapter={chapterShown} onGo={goPlot} /> : null}
        {(tab === 'garten' || wide) && !chapterShown ? (
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
        {!wide ? panelView : null}
      </main>
      {wide && tab !== 'garten' ? (
        <aside className="app-side" aria-label={t.nav.ariaLabel} tabIndex={0}>
          {panelView}
        </aside>
      ) : null}

      <FtueCoach
        game={game}
        onTabChange={onTabChange}
        onHighlightChange={setFtueHighlight}
        onFtueActiveChange={onFtueActiveChange}
        onCoachVisible={setCoachVisible}
      />

      {/* Testphase: Hinweis zur Aufzeichnung beim ersten Start der installierten App (game/distribution.ts) */}
      <TestPhaseNotice />
      {/* Testphase: Bonus-Werbung sperrt das Spiel 30 oder 60 s (game/testWallet.ts) */}
      <AdOverlay ad={game.adPlaying?.blocking ? game.adPlaying : null} onCancel={game.cancelAd} />
      {/* Web-Fassung: Vollbild-Hinweis „Zuerst installieren“ (Store-Fassung: aus, siehe game/distribution.ts) */}
      <InstallGate hasProgress={game.state.totalUpgrades > 1 || game.state.saisonenden > 0 || game.state.tiefeWinter > 0} />

      {/* Install cue waits for the first Saisonende — never in the first session */}
      <InstallPrompt
        holdForFtue={
          holdInstall ||
          (game.state.saisonenden < 1 && game.state.tiefeWinter === 0 && game.state.generation === 0)
        }
      />

      <AppNav
        tab={tab}
        ftueHighlight={ftueHighlight}
        onTabChange={onTabChange}
        onGardenAgain={openPlots}
        plotLabel={plotLabel}
        seasonReady={seasonReady}
        shopReady={game.giftReady}
        onOpenNotebook={() => openNotebook(null)}
        onOpenLegal={() => setLegalOpen(true)}
        onOpenBackup={() => setBackupOpen(true)}
        onOpenDecor={game.features.has('decor') ? () => openMapSheet('decor') : undefined}
        onOpenCross={game.features.has('cross') ? () => openMapSheet('cross') : undefined}
        crossReady={!!game.state.crossing && game.state.crossing.endsAt <= game.nowTick}
        onOpenAlbum={game.features.has('album') ? () => setAlbumOpen(true) : undefined}
        albumReady={game.albumReady}
        onOpenProjects={game.features.has('projects') ? () => setProjectsOpen(true) : undefined}
        clanOpen={game.features.has('clan')}
        onOpenCollection={() => setCollectionOpen(true)}
        newKeys={newMenuKeys}
        upcoming={[
          ...(game.state.crossing && game.state.crossing.endsAt > game.nowTick
            ? [t.ux.upcoming.cross(formatClock(game.state.crossing.endsAt - game.nowTick))]
            : []),
          ...(game.tapCooldownLeftMs > 0 ? [t.ux.upcoming.water(formatClock(game.tapCooldownLeftMs))] : []),
          ...(!game.dailyReady ? [t.ux.upcoming.daily] : []),
          ...(!game.giftReady ? [t.ux.upcoming.gift] : []),
        ]}
        onTileOpen={(key) => {
          if ((MENU_FEATURES as string[]).includes(key)) markFeatureSeen(key as FeatureId)
        }}
        onOpenPhoto={() => {
          setPlot('garden')
          onTabChange('garten')
          setPhotoMode(true)
        }}
        reminders={extras.notify}
        // Erinnerungen erst nach dem ersten Saisonende anbieten (wer sie schon an hat, behält den Schalter)
        onToggleReminders={
          extras.notify || game.state.saisonenden > 0 || game.state.tiefeWinter > 0 || game.state.generation > 0
            ? toggleReminders
            : undefined
        }
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
      {backupOpen ? <SaveSheet state={game.state} onClose={() => setBackupOpen(false)} /> : null}

      {comebackOpen && !game.seasonEnd ? (
        <ComebackLetter
          onAccept={() => {
            game.grant({ samen: COMEBACK_SEEDS, ernteSeconds: 1800 })
            setComebackOpen(false)
          }}
        />
      ) : null}

      {!game.seasonEnd ? <SeasonCardPicker game={game} /> : null}
      {collectionOpen ? <CollectionSheet game={game} onClose={() => setCollectionOpen(false)} /> : null}

      {game.seasonEnd ? (
        <SeasonCeremony
          event={game.seasonEnd}
          onSpin={game.spinWheel}
          onDone={() => {
            const letter = game.seasonEnd!.deep ? 'deep1' : yearLetterFor(game.seasonEnd!.year)
            if (letter) markRead(letter)
            game.ackSeasonEnd()
            track('seasons')
            onTabChange('garten')
          }}
        />
      ) : null}
    </div>
  )
}

function useWide(): boolean {
  const query = '(min-width: 900px)'
  const [wide, setWide] = useState(() => typeof matchMedia === 'function' && matchMedia(query).matches)
  useEffect(() => {
    if (typeof matchMedia !== 'function') return
    const mq = matchMedia(query)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}
