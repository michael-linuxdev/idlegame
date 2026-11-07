import type { SilhouetteKind } from '../game/generators'

interface Props {
  kind: SilhouetteKind
  level: number
  locked?: boolean
}

/** Pure CSS datacenter module marks — readable on the station map at mobile size. */
export function BuildingSilhouette({ kind, level, locked = false }: Props) {
  const lit = level > 0 && !locked
  return (
    <div
      className={`building-sil sil-${kind}${lit ? ' lit' : ' dormant'}${locked ? ' locked' : ''}`}
      aria-hidden="true"
    >
      {kind === 'power' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body power-core" />
          <span className="sil-core-glow" />
        </>
      ) : null}
      {kind === 'cool' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body cool-plant" />
          <span className="sil-fan" />
        </>
      ) : null}
      {kind === 'rack' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body rack-cabinet" />
          <span className="sil-leds" />
        </>
      ) : null}
      {kind === 'uplink' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body uplink-mast" />
          <span className="sil-dish" />
          <span className="sil-ping" />
        </>
      ) : null}
      {kind === 'relay' ? (
        <>
          <span className="sil-base" />
          <span className="sil-body relay-stack" />
          <span className="sil-beam" />
        </>
      ) : null}
      {kind === 'switch' ? (
        <>
          <span className="sil-base wide" />
          <span className="sil-body noc-deck" />
          <span className="sil-hub-tower left" />
          <span className="sil-hub-tower right" />
          <span className="sil-antenna" />
        </>
      ) : null}
    </div>
  )
}
