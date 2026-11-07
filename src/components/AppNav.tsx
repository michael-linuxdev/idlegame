import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { logPlaytest } from '../game/playtestLog'
import { t } from '../i18n'
import { PlaytestLogControls } from './PlaytestLogControls'

export type Tab = 'fortress' | 'prestige' | 'clan' | 'shop'

interface Props {
  tab: Tab
  ftueHighlight?: string | null
  onTabChange: (tab: Tab) => void
}

const SECONDARY: Tab[] = ['prestige', 'clan', 'shop']

const ICONS: Record<Tab, ReactNode> = {
  fortress: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M4 20V10l8-6 8 6v10H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M9 20v-6h6v6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle cx="12" cy="9" r="1.4" fill="currentColor" />
    </svg>
  ),
  prestige: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M12 3l2.2 5.4L20 9.2l-4 3.8 1.2 5.5L12 15.8 6.8 18.5 8 13l-4-3.8 5.8-.8L12 3z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  ),
  clan: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <circle
        cx="9"
        cy="9"
        r="3"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <circle
        cx="16"
        cy="10"
        r="2.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M4 19c1.2-3 3.2-4.5 5-4.5S12.8 16 14 19M14 19c.6-2 1.8-3.2 3.2-3.2 1 0 1.9.6 2.8 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
  shop: (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path
        d="M5 8h14l-1.2 11H6.2L5 8z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path
        d="M8 8V6.5A4 4 0 0112 2.5 4 4 0 0116 6.5V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  ),
}

const LABELS: Record<Tab, string> = {
  fortress: t.nav.station,
  prestige: t.nav.prestige,
  clan: t.nav.clan,
  shop: t.nav.shop,
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
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

export function AppNav({ tab, ftueHighlight, onTabChange }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const menuRef = useRef<HTMLDivElement>(null)
  const homeActive = tab === 'fortress'
  const secondaryActive = !homeActive
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

  function goHome() {
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
          <PlaytestLogControls />
        </div>
      ) : null}

      <div className="game-chrome-bar">
        <button
          type="button"
          className={`chrome-tab home${homeActive ? ' active' : ''}`}
          aria-current={homeActive ? 'page' : undefined}
          onClick={goHome}
        >
          <span className="tab-icon">{ICONS.fortress}</span>
          <span className="tab-label">{LABELS.fortress}</span>
        </button>

        <button
          type="button"
          className={`chrome-tab menu${menuOpen || secondaryActive ? ' active' : ''}${ftueMenu ? ' ftue-tab' : ''}`}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls={menuOpen ? menuId : undefined}
          onClick={toggleMenu}
        >
          <span className="tab-icon">
            <MenuGlyph open={menuOpen} />
          </span>
          <span className="tab-label">{t.nav.menu}</span>
        </button>
      </div>
    </nav>
  )
}
