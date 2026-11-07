import type { SilhouetteKind } from '../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
}

/** Pure CSS module marks — readable on the station map at mobile size. */
export function BuildingSilhouette({ kind, level, locked = false }: Props) {
  const lit = level > 0 && !locked
  return (
    <div
      className={`building-sil sil-${kind}${lit ? ' lit' : ' dormant'}${locked ? ' locked' : ''}`}
      aria-hidden="true"
    >
      {kind === 'hearth' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body hearth-bowl" />
          <span className="sil-flame" />
        </>
      ) : null}
      {kind === 'mill' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body mill-tower" />
          <span className="sil-wheel" />
        </>
      ) : null}
      {kind === 'altar' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body altar-plinth" />
          <span className="sil-spire" />
        </>
      ) : null}
      {kind === 'vault' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body vault-chamber" />
          <span className="sil-door" />
        </>
      ) : null}
      {kind === 'watch' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body watch-shaft" />
          <span className="sil-battlement" />
          <span className="sil-beacon" />
        </>
      ) : null}
      {kind === 'keep' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body keep-hall" />
          <span className="sil-keep-tower left" />
          <span className="sil-keep-tower right" />
          <span className="sil-banner" />
        </>
      ) : null}
    </div>
  )
}
