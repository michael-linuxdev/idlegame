import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { logPlaytest } from '../game/playtestLog'
import { t } from '../i18n'
import { MuteToggle } from './MuteToggle'
import { isAmbienceOn, setAmbienceOn } from '../game/ambience'
import { PlaytestLogControls } from './PlaytestLogControls'
import { APP_VERSION, checkForUpdate, reloadNow } from '../game/appUpdate'
import { setSignsAlways, useSignsAlways } from '../game/prefs'
import { IconBasket, IconFlag, IconNotebook, IconSnow, IconSprout } from '../theme/icons'

export type Tab = 'fortress' | 'prestige' | 'clan' | 'shop'

interface Props {
  tab: Tab
  ftueHighlight?: string | null
  onTabChange: (tab: Tab) => void
  onOpenNotebook?: () => void
  onOpenLegal?: () => void
  onOpenBackup?: () => void
  onOpenPhoto?: () => void
  onOpenProjects?: () => void
  onOpenAlbum?: () => void
  onOpenDecor?: () => void
  onOpenCross?: () => void
  crossReady?: boolean
  albumReady?: number
  unreadLetters?: number
  reminders?: boolean
  onToggleReminders?: () => void
}

/** Overflow destinations only — never a bottom Farm/Halle tab. */
const SECONDARY: Tab[] = ['prestige', 'clan', 'shop']

const ICONS: Record<Tab, ReactNode> = {
  fortress: <IconSprout />,
  prestige: <IconSnow />,
  clan: <IconFlag />,
  shop: <IconBasket />,
}

const LABELS: Record<Tab, string> = {
  fortress: t.nav.station,
  prestige: t.nav.prestige,
  clan: t.nav.clan,
  shop: t.nav.shop,
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M5 7h14M5 12h14M5 17h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
      )}
    </svg>
  )
}

/** One floating ☰ Menü FAB — zero bottom tab strip (no FARM|MENÜ). */
export function AppNav({
  tab,
  ftueHighlight,
  onTabChange,
  onOpenNotebook,
  onOpenLegal,
  onOpenBackup,
  onOpenPhoto,
  onOpenProjects,
  onOpenAlbum,
  onOpenDecor,
  onOpenCross,
  crossReady = false,
  albumReady = 0,
  unreadLetters = 0,
  reminders = false,
  onToggleReminders,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [ambience, setAmbience] = useState(() => isAmbienceOn())
  const [updateNote, setUpdateNote] = useState<string | null>(null)
  const signs = useSignsAlways()
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [checking, setChecking] = useState(false)

  async function onCheckUpdate() {
    if (checking) return
    setChecking(true)
    setUpdateNote(t.appUpdate.checking)
    logPlaytest('app_update', { action: 'check' })
    const result = await checkForUpdate().catch(() => 'offline' as const)
    setChecking(false)
    setUpdateNote(
      result === 'reloading'
        ? t.appUpdate.found
        : result === 'current'
          ? t.appUpdate.current
          : result === 'offline'
            ? t.appUpdate.offline
            : t.appUpdate.unsupported,
    )
  }
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement>(null)
  const homeActive = tab === 'fortress'
  const ftueMenu =
    ftueHighlight === 'prestige' || ftueHighlight === 'clan'

  useEffect(() => {
    if (!menuOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  useEffect(() => {
    if (!menuOpen) return
    const first = menuRef.current?.querySelector<HTMLButtonElement>('button')
    first?.focus()
  }, [menuOpen])

  function goMap() {
    setMenuOpen(false)
    onTabChange('fortress')
  }

  function pickSecondary(id: Tab) {
    setMenuOpen(false)
    onTabChange(id)
  }

  function toggleMenu() {
    setMenuOpen((o) => {
      const next = !o
      if (next) logPlaytest('menu_open')
      return next
    })
  }

  return (
    <nav
      className={`game-chrome${homeActive ? ' map-home' : ' panel-home'}`}
      aria-label={t.nav.ariaLabel}
    >
      {menuOpen ? (
        <button
          type="button"
          className="nav-menu-scrim"
          aria-label={t.nav.menuClose}
          onClick={() => setMenuOpen(false)}
        />
      ) : null}

      {menuOpen ? (
        <div
          id={menuId}
          ref={menuRef}
          className="nav-menu"
          role="menu"
          aria-label={t.nav.menu}
        >
          {!homeActive ? (
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item map-return"
              onClick={goMap}
            >
              <span className="tab-icon">{ICONS.fortress}</span>
              <span className="tab-label">{t.nav.backToMap}</span>
            </button>
          ) : null}
          {SECONDARY.map((id) => {
            const active = tab === id
            const ftue =
              (id === 'prestige' && ftueHighlight === 'prestige') ||
              (id === 'clan' && ftueHighlight === 'clan')
            return (
              <button
                key={id}
                type="button"
                role="menuitem"
                className={`nav-menu-item${active ? ' active' : ''}${ftue ? ' ftue-tab' : ''}`}
                onClick={() => pickSecondary(id)}
              >
                <span className="tab-icon">{ICONS[id]}</span>
                <span className="tab-label">{LABELS[id]}</span>
              </button>
            )
          })}
          {onOpenNotebook ? (
            <button
              type="button"
              role="menuitem"
              className={`nav-menu-item${unreadLetters > 0 ? ' has-new' : ''}`}
              onClick={() => {
                setMenuOpen(false)
                onOpenNotebook()
              }}
            >
              <span className="tab-icon">
                <IconNotebook />
              </span>
              <span className="tab-label">{t.notebook.title}</span>
              {unreadLetters > 0 ? <span className="nav-new-dot" aria-label={t.notebook.newLetter} /> : null}
            </button>
          ) : null}
          {onOpenDecor ? (
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item"
              onClick={() => {
                setMenuOpen(false)
                onOpenDecor()
              }}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                  <path d="M7 21l1-8h8l1 8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M8.6 9L12 2l3.4 7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="tab-label">{t.decor.title}</span>
            </button>
          ) : null}
          {onOpenCross ? (
            <button
              type="button"
              role="menuitem"
              className={`nav-menu-item${crossReady ? ' has-new' : ''}`}
              onClick={() => {
                setMenuOpen(false)
                onOpenCross()
              }}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                  <path d="M12 22V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M12 13Q5 12 5 5q7 0 7 8zM12 11q7-1 7-8-7 0-7 8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </span>
              <span className="tab-label">{t.crossing.title}</span>
              {crossReady ? <span className="nav-new-dot" aria-hidden="true" /> : null}
            </button>
          ) : null}
          {onOpenAlbum ? (
            <button
              type="button"
              role="menuitem"
              className={`nav-menu-item${albumReady > 0 ? ' has-new' : ''}`}
              onClick={() => {
                setMenuOpen(false)
                onOpenAlbum()
              }}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                  <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
                  <circle cx="12" cy="11" r="3.4" fill="none" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 17h8" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span className="tab-label">{t.album.menu}</span>
              {albumReady > 0 ? <span className="nav-new-dot" aria-hidden="true" /> : null}
            </button>
          ) : null}
          {onOpenProjects ? (
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item"
              onClick={() => {
                setMenuOpen(false)
                onOpenProjects()
              }}
            >
              <span className="tab-icon">
                <svg viewBox="0 0 24 24" aria-hidden="true" width="16" height="16">
                  <path d="M3 21h18M5 21V10l7-6 7 6v11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                  <path d="M10 21v-6h4v6" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>
              <span className="tab-label">{t.projects.menu}</span>
            </button>
          ) : null}
          {onOpenBackup ? (
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item nav-menu-legal"
              onClick={() => {
                setMenuOpen(false)
                onOpenBackup()
              }}
            >
              <span className="tab-label">{t.backup.menu}</span>
            </button>
          ) : null}
          {onOpenPhoto ? (
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item nav-menu-legal"
              onClick={() => {
                setMenuOpen(false)
                onOpenPhoto()
              }}
            >
              <span className="tab-label">{t.photo.menu}</span>
            </button>
          ) : null}
          <button
            type="button"
            className={`nav-menu-item nav-menu-settings${settingsOpen ? ' open' : ''}`}
            aria-expanded={settingsOpen}
            onClick={() => setSettingsOpen((o) => !o)}
          >
            <span className="tab-label">{t.nav.settings}</span>
            <span className="nav-chevron" aria-hidden="true">
              {settingsOpen ? '▾' : '▸'}
            </span>
          </button>
          {settingsOpen ? (
            <div className="nav-menu-group" role="group" aria-label={t.nav.settings}>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={ambience}
            className="nav-menu-sound nav-menu-reminders"
            onClick={() => {
              const next = !ambience
              setAmbienceOn(next)
              setAmbience(next)
            }}
          >
            <span className="tab-label">{t.sound.ambience}</span>
            <span className="nav-toggle-state">{ambience ? t.sound.on : t.sound.off}</span>
          </button>
          <button
            type="button"
            role="menuitemcheckbox"
            aria-checked={signs}
            className="nav-menu-sound nav-menu-reminders"
            title={t.prefs.signsHint}
            onClick={() => setSignsAlways(!signs)}
          >
            <span className="tab-label">{t.prefs.signs}</span>
            <span className="nav-toggle-state">{signs ? t.sound.on : t.sound.off}</span>
          </button>
          <div className="nav-menu-sound">
            <span className="tab-label">{t.sound.label}</span>
            <MuteToggle />
          </div>
          {onToggleReminders && typeof Notification !== 'undefined' ? (
            <button
              type="button"
              role="menuitemcheckbox"
              aria-checked={reminders}
              className="nav-menu-sound nav-menu-reminders"
              title={t.reminders.hint}
              onClick={onToggleReminders}
            >
              <span className="tab-label">{t.reminders.label}</span>
              <span className="nav-toggle-state">{reminders ? t.reminders.on : t.reminders.off}</span>
            </button>
          ) : null}
          <PlaytestLogControls />
          <div className="nav-menu-update">
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item nav-menu-legal"
              onClick={onCheckUpdate}
              disabled={checking}
            >
              <span className="tab-label">{t.appUpdate.menu}</span>
            </button>
            {updateNote ? (
              <p className="nav-update-note" role="status">
                {updateNote}
                {!checking && updateNote !== t.appUpdate.found ? (
                  <button type="button" className="link-btn" onClick={reloadNow}>
                    {t.appUpdate.now}
                  </button>
                ) : null}
              </p>
            ) : null}
            <p className="nav-version">{t.appUpdate.version(APP_VERSION)}</p>
          </div>
          {onOpenLegal ? (
            <button
              type="button"
              role="menuitem"
              className="nav-menu-item nav-menu-legal"
              onClick={() => {
                setMenuOpen(false)
                onOpenLegal()
              }}
            >
              <span className="tab-label">{t.legal.title}</span>
            </button>
          ) : null}
            </div>
          ) : null}
        </div>
      ) : null}

      <button
        type="button"
        className={`menu-fab${menuOpen || !homeActive ? ' active' : ''}${ftueMenu ? ' ftue-tab' : ''}${!menuOpen && (crossReady || albumReady > 0) ? ' has-new' : ''}`}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-controls={menuOpen ? menuId : undefined}
        aria-label={t.nav.menu}
        onClick={toggleMenu}
      >
        <MenuGlyph open={menuOpen} />
      </button>
    </nav>
  )
}
