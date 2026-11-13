import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { WelcomeBack } from '../components/hud/WelcomeBack'
import { t } from '../i18n'

const noop = () => {}

describe('Offline-Zettel', () => {
  it('zeigt Korb und Jonas’ Ausbauten samt Ernte/s vorher → nachher', () => {
    const html = renderToStaticMarkup(
      <WelcomeBack amount={5000} awayMs={3600_000} helped={12} rateFrom={100} rateTo={400} onClaim={noop} onLater={noop} />,
    )
    expect(html).toContain(t.helper.report(12))
    expect(html).toContain('welcome-amount')
    expect(html).toContain('welcome-rate')
    expect(html).toContain(t.ux.welcomeBack.claim)
  })

  it('kommt auch bei leerem Korb, wenn Jonas alles verbaut hat', () => {
    const html = renderToStaticMarkup(
      <WelcomeBack amount={0} awayMs={3600_000} helped={40} rateFrom={100} rateTo={900} onClaim={noop} onLater={noop} />,
    )
    expect(html).not.toContain('welcome-amount')
    expect(html).toContain(t.ux.welcomeBack.helperSpent)
    expect(html).toContain(t.ux.welcomeBack.ok)
  })

  it('ohne Jonas keine Ernte/s-Zeile', () => {
    const html = renderToStaticMarkup(
      <WelcomeBack amount={5000} awayMs={3600_000} helped={0} rateFrom={100} rateTo={400} onClaim={noop} onLater={noop} />,
    )
    expect(html).not.toContain('welcome-rate')
    expect(html).not.toContain('welcome-helper')
  })
})
