/** Rooftop / district vertical-farm backdrop — not a space station. */
export function FarmMapBackdrop() {
  return (
    <div className="map-terrain map-terrain-farm" aria-hidden="true">
      <div className="map-skyline" />
      <div className="map-sky-wash" />
      <div className="map-rooftop" />
      <div className="map-grid map-grid-farm" />
      <div className="map-planters" />
      <div className="map-ridge map-ridge-farm" />
      <div className="map-walls map-walls-farm">
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
      <div className="map-keep-silhouette map-tower-core" />
      <div className="map-forge-glow map-grow-glow" />
      <div className="map-haze" />
      <div className="map-skin-wash" />
      <div className="map-dust map-pollen" />
    </div>
  )
}
