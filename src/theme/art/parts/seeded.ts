/** Deterministische Pseudozufallszahl 0…1 je Index (gleiche Grafik bei jedem Rendern). */
export function seeded(i: number): number {
  const x = Math.sin(i * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
