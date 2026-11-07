import type { ReactNode } from 'react'
import { t } from '../i18n'

export type Tab = 'fortress' | 'prestige' | 'clan' | 'shop'

interface Props {
  tab: Tab
  ftueHighlight?: string | null
  onTabChange: (tab: Tab) => void
}

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

export function AppNav({ tab, ftueHighlight, onTabChange }: Props) {
  const tabs: Tab[] = ['fortress', 'prestige', 'clan', 'shop']
  return (
    <nav className="tab-bar tabs-4" aria-label={t.nav.ariaLabel}>
      {tabs.map((id) => {
        const active = tab === id
        const ftue =
          (id === 'prestige' && ftueHighlight === 'prestige') ||
          (id === 'clan' && ftueHighlight === 'clan')
        return (
          <button
            key={id}
            type="button"
            className={`tab${active ? ' active' : ''}${ftue ? ' ftue-tab' : ''}`}
            onClick={() => onTabChange(id)}
          >
            <span className="tab-icon">{ICONS[id]}</span>
            <span className="tab-label">{LABELS[id]}</span>
          </button>
        )
      })}
    </nav>
  )
}
