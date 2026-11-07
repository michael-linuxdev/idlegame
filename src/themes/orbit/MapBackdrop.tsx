/** Orbit Rack station deck backdrop — alternate theme pack. */
export function OrbitMapBackdrop() {
  return (
    <div className="map-terrain map-terrain-orbit" aria-hidden="true">
      <div className="map-stars" />
      <div className="map-orbital-rim" />
      <div className="map-asteroid" />
      <div className="map-plate" />
      <div className="map-grid" />
      <div className="map-cable-trays" />
      <div className="map-ridge" />
      <div className="map-walls">
        <span className="wall-segment north" />
        <span className="wall-segment east" />
        <span className="wall-segment south" />
        <span className="wall-segment west" />
        <span className="wall-tower nw" />
        <span className="wall-tower ne" />
        <span className="wall-tower sw" />
        <span className="wall-tower se" />
        <span className="wall-gate" />
      </div>
      <div className="map-keep-silhouette" />
      <div className="map-forge-glow" />
      <div className="map-haze" />
      <div className="map-skin-wash" />
      <div className="map-dust" />
    </div>
  )
}
