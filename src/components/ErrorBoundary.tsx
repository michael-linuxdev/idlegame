import { Component, type ErrorInfo, type ReactNode } from 'react'
import { exportCode } from '../game/backup'
import { isChunkLoadError, reloadForNewVersion } from '../game/chunkReload'
import { logPlaytest } from '../game/playtestLog'
import { copyText } from '../game/saveFile'
import { t } from '../i18n'

interface State {
  failed: boolean
  copied: boolean
}

/** Statt weißer Seite: Spielstand sichern und neu laden. */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { failed: false, copied: false }

  static getDerivedStateFromError(): Partial<State> {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Bündel einer alten Version fehlt (z. B. Kapitel-Grafik): neu laden statt Fehlerseite
    if (isChunkLoadError(error) && reloadForNewVersion()) return
    logPlaytest('error', {
      where: 'render',
      msg: String(error?.message ?? error).slice(0, 160),
      stack: (info.componentStack ?? '').split('\n').slice(0, 3).join(' ').slice(0, 200),
    })
  }

  copy = async () => {
    const ok = await copyText(exportCode())
    this.setState({ copied: ok })
  }

  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="crash-screen" role="alert">
        <h1>{t.crash.title}</h1>
        <p>{t.crash.body}</p>
        <button type="button" className="btn buy" onClick={this.copy}>
          {this.state.copied ? t.crash.copied : t.crash.copy}
        </button>
        <button type="button" className="btn ghost" onClick={() => window.location.reload()}>
          {t.crash.reload}
        </button>
      </div>
    )
  }
}
