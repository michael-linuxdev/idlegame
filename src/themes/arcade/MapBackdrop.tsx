/** Bright arcade-hall backdrop — linoleum lanes, neon, marquee, prize counter. Not a dark void. */
export function ArcadeMapBackdrop() {
  return (
    <div className="map-terrain map-terrain-arcade" aria-hidden="true">
      <div className="map-arcade-ceiling" />
      <div className="map-skyline map-arcade-signage" />
      <div className="map-sky-wash map-arcade-wash" />
      <div className="map-arcade-neon-beams" />
      <div className="map-rooftop map-arcade-floor" />
      <div className="map-grid map-grid-arcade" />
      <div className="map-arcade-carpet" />
      <div className="map-planters map-arcade-lanes" />
      <div className="map-ridge map-ridge-arcade" />
      <div className="map-walls map-walls-arcade">
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
      <div className="map-arcade-ticket-booth" />
      <div className="map-arcade-prize-counter" />
      <div className="map-keep-silhouette map-arcade-marquee" />
      <div className="map-arcade-marquee-glow" />
      <div className="map-forge-glow map-neon-glow" />
      <div className="map-haze" />
      <div className="map-skin-wash" />
      <div className="map-dust map-token-spark" />
      <div className="map-arcade-coin-glints" />
    </div>
  )
}
