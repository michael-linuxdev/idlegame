import { useEffect, useState, type ReactNode } from 'react'
import { logPlaytest } from '../game/playtestLog'
import { LOCALES, setLocale, t, useLocale } from '../i18n'
import { MuteToggle } from './MuteToggle'
import { isAmbienceOn, setAmbienceOn } from '../game/ambience'
import { PlaytestLogControls } from './PlaytestLogControls'
import { APP_VERSION, checkForUpdate, reloadNow } from '../game/appUpdate'
import { setPref, setSignsAlways, usePref, useSignsAlways } from '../game/prefs'
import { useDismiss } from '../game/overlays'
import { IconBasket, IconChest, IconFlag, IconNotebook, IconSeeds, IconSnow, IconSprout } from '../theme/icons'
import { formatErnte } from '../game/format'
import { ArtSvg } from '../theme/ArtSvg'

export type Tab = 'garten' | 'prestige' | 'clan' | 'shop'

interface Props {
  tab: Tab
  ftueHighlight?: string | null
  onTabChange: (tab: Tab) => void
  /** Tapping „Garten“ while already on a map (opens the Grundstücke picker) */
  onGardenAgain?: () => void
  /** Name of the plot on screen („Weinberg“), shown on the Garten tab */
  plotLabel?: string
  onOpenNotebook?: () => void
  onOpenLegal?: () => void
  onOpenBackup?: () => void
  onOpenPhoto?: () => void
  onOpenProjects?: () => void
  onOpenAlbum?: () => void
  onOpenDecor?: () => void
  onOpenCross?: () => void
  onOpenCollection?: () => void
  crossReady?: boolean
  albumReady?: number
  unreadLetters?: number
  reminders?: boolean
  onToggleReminders?: () => void
  /** Verein im Menü (frei ab featureUnlocks 'clan') */
  clanOpen?: boolean
  /** Menüpunkte, die neu frei sind und noch nie geöffnet wurden */
  newKeys?: ReadonlySet<string>
  /** Called when a menu tile is opened (to clear its „Neu“-Abzeichen) */
  onTileOpen?: (key: string) => void
  /** „Bald fertig“: laufende Timer als kurze Zeilen */
  upcoming?: string[]
  /** Red dots on the tab bar */
  seasonReady?: boolean
  shopReady?: boolean
  /** Erbstücke (am Saison-Tab, dort gibt man sie aus); null = nicht zeigen */
  erbstuecke?: number | null
  /** Samen (am Markt-Tab); null = nicht zeigen */
  samen?: number | null
}

/* —— small inline glyphs for the menu tiles —— */
const Glyph = {
  decor: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <path d="M7 21l1-8h8l1 8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.6 9L12 2l3.4 7z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </ArtSvg>
  ),
  cross: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <path d="M12 22V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 13Q5 12 5 5q7 0 7 8zM12 11q7-1 7-8-7 0-7 8z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </ArtSvg>
  ),
  album: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="11" r="3.4" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8 17h8" stroke="currentColor" strokeWidth="2" />
    </ArtSvg>
  ),
  projects: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <path d="M3 21h18M5 21V10l7-6 7 6v11" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 21v-6h4v6" fill="none" stroke="currentColor" strokeWidth="2" />
    </ArtSvg>
  ),
  collection: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <path d="M4 9h16v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M3 5h18v4H3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M10 13h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </ArtSvg>
  ),
  photo: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <rect x="3" y="6" width="18" height="14" rx="2.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="13" r="3.6" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M8.5 6l1.5-2.5h4L15.5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </ArtSvg>
  ),
  save: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <path d="M5 3h11l3 3v15H5z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8 3v6h8V3M8 21v-7h8v7" fill="none" stroke="currentColor" strokeWidth="2" />
    </ArtSvg>
  ),
  settings: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="2" />
      <path
        d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </ArtSvg>
  ),
  legal: (
    <ArtSvg viewBox="0 0 24 24" width="20" height="20">
      <path d="M6 3h9l4 4v14H6z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 11h7M9 15h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </ArtSvg>
  ),
  menu: (
    <ArtSvg viewBox="0 0 24 24" width="22" height="22">
      <path d="M5 7h14M5 12h14M5 17h14" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
    </ArtSvg>
  ),
}

/**
 * Bottom tab bar: Garten · Saison · Markt · Menü.
 * Menü opens a grouped bottom sheet; Einstellungen is its own page inside it.
 */
export function AppNav({
  tab,
  ftueHighlight,
  onTabChange,
  onGardenAgain,
  plotLabel,
  onOpenNotebook,
  onOpenLegal,
  onOpenBackup,
  onOpenPhoto,
  onOpenProjects,
  onOpenAlbum,
  onOpenDecor,
  onOpenCross,
  onOpenCollection,
  crossReady = false,
  albumReady = 0,
  unreadLetters = 0,
  reminders = false,
  onToggleReminders,
  seasonReady = false,
  shopReady = false,
  erbstuecke = null,
  samen = null,
  clanOpen = true,
  newKeys,
  onTileOpen,
  upcoming,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuNew = unreadLetters > 0 || crossReady || albumReady > 0 || (newKeys?.size ?? 0) > 0

  function openMenu() {
    logPlaytest('menu_open')
    setMenuOpen(true)
  }

  // Keyboard „M“ (see useShortcuts) asks for the menu
  useEffect(() => {
    const onAsk = () => setMenuOpen(true)
    window.addEventListener('gartenerbe-open-menu', onAsk)
    return () => window.removeEventListener('gartenerbe-open-menu', onAsk)
  }, [])

  function tabButton(id: Tab, icon: ReactNode, label: string, dot = false, ftue = false, count?: ReactNode) {
    const active = tab === id
    return (
      <button
        key={id}
        type="button"
        className={`tabbar-btn tab-${id}${active ? ' active' : ''}${ftue ? ' ftue-tab' : ''}`}
        aria-current={active ? 'page' : undefined}
        onClick={() => {
          if (id === 'garten' && active) onGardenAgain?.()
          else onTabChange(id)
        }}
      >
        <span className="tabbar-icon">
          {icon}
          {dot ? <span className="tabbar-dot" aria-hidden="true" /> : null}
        </span>
        <span className="tabbar-label">{label}</span>
        {count}
      </button>
    )
  }

  function countLine(icon: ReactNode, value: number, name: string) {
    return (
      <span className="tabbar-count">
        <span className="tabbar-count-icon" aria-hidden="true">
          {icon}
        </span>
        {formatErnte(value)}
        <span className="sr-only"> {name}</span>
      </span>
    )
  }

  return (
    <>
      <nav className="tabbar" aria-label={t.nav.ariaLabel}>
        {tabButton('garten', <IconSprout />, plotLabel ?? t.nav.garten)}
        {tabButton(
          'prestige',
          <IconSnow />,
          t.nav.prestige,
          seasonReady,
          ftueHighlight === 'prestige',
          erbstuecke != null ? countLine(<IconChest />, erbstuecke, t.resources.erbstuecke) : null,
        )}
        {tabButton(
          'shop',
          <IconBasket />,
          t.nav.shop,
          shopReady,
          false,
          samen != null ? countLine(<IconSeeds />, samen, t.resources.samen) : null,
        )}
        <button
          type="button"
          className={`tabbar-btn menu-fab${menuOpen ? ' active' : ''}${ftueHighlight === 'clan' ? ' ftue-tab' : ''}`}
          aria-haspopup="dialog"
          aria-expanded={menuOpen}
          onClick={openMenu}
        >
          <span className="tabbar-icon">
            {Glyph.menu}
            {menuNew ? <span className="tabbar-dot" aria-hidden="true" /> : null}
          </span>
          <span className="tabbar-label">{t.nav.menu}</span>
        </button>
      </nav>

      {menuOpen ? (
        <MenuSheet
          onClose={() => setMenuOpen(false)}
          pick={(fn) => {
            setMenuOpen(false)
            fn()
          }}
          tabClan={clanOpen ? () => onTabChange('clan') : undefined}
          newKeys={newKeys}
          onTileOpen={onTileOpen}
          upcoming={upcoming}
          clanFtue={ftueHighlight === 'clan'}
          onOpenNotebook={onOpenNotebook}
          onOpenLegal={onOpenLegal}
          onOpenBackup={onOpenBackup}
          onOpenPhoto={onOpenPhoto}
          onOpenProjects={onOpenProjects}
          onOpenAlbum={onOpenAlbum}
          onOpenDecor={onOpenDecor}
          onOpenCross={onOpenCross}
          onOpenCollection={onOpenCollection}
          crossReady={crossReady}
          albumReady={albumReady}
          unreadLetters={unreadLetters}
          reminders={reminders}
          onToggleReminders={onToggleReminders}
        />
      ) : null}
    </>
  )
}

function MenuSheet({
  onClose,
  pick,
  tabClan,
  clanFtue,
  newKeys,
  onTileOpen,
  upcoming,
  onOpenNotebook,
  onOpenLegal,
  onOpenBackup,
  onOpenPhoto,
  onOpenProjects,
  onOpenAlbum,
  onOpenDecor,
  onOpenCross,
  onOpenCollection,
  crossReady,
  albumReady,
  unreadLetters,
  reminders,
  onToggleReminders,
}: {
  onClose: () => void
  pick: (fn: () => void) => void
  tabClan?: () => void
  clanFtue: boolean
  newKeys?: ReadonlySet<string>
  onTileOpen?: (key: string) => void
  upcoming?: string[]
  onOpenNotebook?: () => void
  onOpenLegal?: () => void
  onOpenBackup?: () => void
  onOpenPhoto?: () => void
  onOpenProjects?: () => void
  onOpenAlbum?: () => void
  onOpenDecor?: () => void
  onOpenCross?: () => void
  onOpenCollection?: () => void
  crossReady: boolean
  albumReady: number
  unreadLetters: number
  reminders: boolean
  onToggleReminders?: () => void
}) {
  const [page, setPage] = useState<'main' | 'settings'>('main')
  useDismiss(() => (page === 'settings' ? setPage('main') : onClose()))

  const tiles: { key: string; icon: ReactNode; label: string; dot?: boolean; ftue?: boolean; on?: () => void }[] = [
    { key: 'notebook', icon: <IconNotebook />, label: t.notebook.title, dot: unreadLetters > 0, on: onOpenNotebook },
    { key: 'clan', icon: <IconFlag />, label: t.nav.clan, ftue: clanFtue, on: tabClan },
    { key: 'decor', icon: Glyph.decor, label: t.decor.title, on: onOpenDecor },
    { key: 'cross', icon: Glyph.cross, label: t.crossing.title, dot: crossReady, on: onOpenCross },
    { key: 'album', icon: Glyph.album, label: t.album.menu, dot: albumReady > 0, on: onOpenAlbum },
    { key: 'projects', icon: Glyph.projects, label: t.projects.menu, on: onOpenProjects },
    { key: 'collection', icon: Glyph.collection, label: t.collections.menu, on: onOpenCollection },
  ]
  // Werkzeuge als ruhige Zeilen unter den Garten-Kacheln
  const rows: { key: string; icon: ReactNode; label: string; on?: () => void }[] = [
    { key: 'photo', icon: Glyph.photo, label: t.photo.menu, on: onOpenPhoto },
    { key: 'backup', icon: Glyph.save, label: t.backup.menu, on: onOpenBackup },
    { key: 'legal', icon: Glyph.legal, label: t.legal.title, on: onOpenLegal },
  ]

  return (
    <div className="nav-sheet-layer" role="presentation" onClick={onClose}>
      <div
        className="nav-sheet nav-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="nav-sheet-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sheet-handle" aria-hidden="true" />
        <header className="nav-sheet-head">
          {page === 'settings' ? (
            <button type="button" className="sheet-x nav-sheet-back" onClick={() => setPage('main')} aria-label={t.ux.nav.settings.back}>
              ‹
            </button>
          ) : null}
          <h2 id="nav-sheet-title">{page === 'settings' ? t.nav.settings : t.nav.menu}</h2>
          <button type="button" className="sheet-x" onClick={onClose} aria-label={t.nav.menuClose}>
            ×
          </button>
        </header>

        {page === 'main' ? (
          <>
            {upcoming && upcoming.length > 0 ? (
              <section className="nav-upcoming" aria-label={t.ux.upcoming.title}>
                <h3 className="nav-group-title">{t.ux.upcoming.title}</h3>
                <ul>
                  {upcoming.map((u) => (
                    <li key={u}>{u}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            <ul className="nav-tiles" role="menu" aria-label={t.ux.nav.groups.garden}>
              {tiles
                .filter((x) => x.on)
                .map((x) => (
                  <li key={x.key} role="none">
                    <button
                      type="button"
                      role="menuitem"
                      className={`nav-tile nav-menu-item${x.dot || newKeys?.has(x.key) ? ' has-new' : ''}${x.ftue ? ' ftue-tab' : ''}`}
                      onClick={() => {
                        onTileOpen?.(x.key)
                        pick(x.on!)
                      }}
                    >
                      <span className="nav-tile-icon">
                        {x.icon}
                        {x.dot ? <span className="nav-new-dot" aria-label={t.notebook.newLetter} /> : null}
                      </span>
                      <span className="tab-label">{x.label}</span>
                      {newKeys?.has(x.key) && !x.dot ? <span className="nav-tile-new">{t.features.newBadge}</span> : null}
                    </button>
                  </li>
                ))}
            </ul>
            <ul className="nav-rows" role="menu" aria-label={t.ux.nav.groups.more}>
              {rows
                .filter((x) => x.on)
                .map((x) => (
                  <li key={x.key} role="none">
                    <button type="button" role="menuitem" className="nav-row nav-menu-item" onClick={() => pick(x.on!)}>
                      <span className="nav-row-icon">{x.icon}</span>
                      <span className="tab-label">{x.label}</span>
                      <span aria-hidden="true">›</span>
                    </button>
                  </li>
                ))}
              <li role="none">
                <button type="button" role="menuitem" className="nav-row nav-menu-item nav-menu-settings" onClick={() => setPage('settings')}>
                  <span className="nav-row-icon">{Glyph.settings}</span>
                  <span className="tab-label">{t.nav.settings}</span>
                  <span aria-hidden="true">›</span>
                </button>
              </li>
            </ul>
          </>
        ) : (
          <SettingsPage reminders={reminders} onToggleReminders={onToggleReminders} />
        )}
      </div>
    </div>
  )
}

function Toggle({ label, on, onClick, hint }: { label: string; on: boolean; onClick: () => void; hint?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      className={`nav-toggle${on ? ' on' : ''}`}
      title={hint}
      onClick={onClick}
    >
      <span className="tab-label">{label}</span>
      <span className="nav-switch" aria-hidden="true">
        <span />
      </span>
      <span className="nav-toggle-state">{on ? t.sound.on : t.sound.off}</span>
    </button>
  )
}

/** „Sprache / Language“ — live switch, stored on this device (not in the save). */
function LanguagePicker() {
  const locale = useLocale()
  return (
    <div className="nav-toggle nav-lang">
      <span className="tab-label" id="nav-lang-label">
        {t.ux.nav.settings.language}
      </span>
      <div className="gc-segment" role="radiogroup" aria-labelledby="nav-lang-label">
        {LOCALES.map((l) => (
          <button
            key={l}
            type="button"
            role="radio"
            lang={l}
            aria-checked={locale === l}
            className={locale === l ? 'on' : undefined}
            data-lang={l}
            onClick={() => {
              if (l === locale) return
              logPlaytest('language', { from: locale, to: l })
              void setLocale(l, { persist: true })
            }}
          >
            {t.languageNames[l]}
          </button>
        ))}
      </div>
    </div>
  )
}

function SettingsPage({ reminders, onToggleReminders }: { reminders: boolean; onToggleReminders?: () => void }) {
  const [ambience, setAmbience] = useState(() => isAmbienceOn())
  const signs = useSignsAlways()
  const bigText = usePref('bigText')
  const calm = usePref('calmMotion')
  const haptics = usePref('haptics')
  const [updateNote, setUpdateNote] = useState<string | null>(null)
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

  return (
    <div className="nav-settings" role="group" aria-label={t.nav.settings}>
      <h3 className="nav-group-title">{t.ux.nav.settings.display}</h3>
      <LanguagePicker />
      <Toggle label={t.ux.nav.settings.bigText} on={bigText} onClick={() => setPref('bigText', !bigText)} />
      <Toggle label={t.ux.nav.settings.calm} on={calm} onClick={() => setPref('calmMotion', !calm)} />
      <Toggle label={t.prefs.signs} on={signs} hint={t.prefs.signsHint} onClick={() => setSignsAlways(!signs)} />

      <h3 className="nav-group-title">{t.ux.nav.settings.sound}</h3>
      <div className="nav-toggle">
        <span className="tab-label">{t.sound.label}</span>
        <MuteToggle />
      </div>
      <Toggle
        label={t.sound.ambience}
        on={ambience}
        onClick={() => {
          const next = !ambience
          setAmbienceOn(next)
          setAmbience(next)
        }}
      />
      <Toggle label={t.ux.nav.settings.haptics} on={haptics} onClick={() => setPref('haptics', !haptics)} />
      {onToggleReminders && typeof Notification !== 'undefined' ? (
        <Toggle label={t.reminders.label} on={reminders} hint={t.reminders.hint} onClick={onToggleReminders} />
      ) : null}

      <h3 className="nav-group-title">{t.ux.nav.settings.system}</h3>
      <div className="nav-menu-group">
        <PlaytestLogControls />
      </div>
      <div className="nav-menu-update">
        <button type="button" className="nav-row nav-menu-item" onClick={onCheckUpdate} disabled={checking}>
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
      <p className="nav-shortcuts">{t.ux.nav.settings.shortcuts}</p>
    </div>
  )
}
