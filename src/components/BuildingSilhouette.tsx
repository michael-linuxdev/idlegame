import type { GeneratorDef } from '../game/generators'

interface Props {
  kind: GeneratorDef['silhouette']
  level: number
}

/** Pure CSS building marks — readable on the ash map at mobile size. */
export function BuildingSilhouette({ kind, level }: Props) {
  const lit = level > 0
  return (
    <div
      className={`building-sil sil-${kind}${lit ? ' lit' : ' dormant'}`}
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
      {kind === 'kiln' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body kiln-dome" />
          <span className="sil-flame" />
        </>
      ) : null}
      {kind === 'vault' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body vault-block" />
          <span className="sil-spire" />
        </>
      ) : null}
    </div>
  )
}
