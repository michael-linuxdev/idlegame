/**
 * Gemeinsame Grafik-Bausteine.
 *
 * STILREGEL (gilt für alle Bausteine und jede neue Grafik)
 *
 * 1. Drei Strichstärken (STROKE), im plot-Raster 100×86:
 *      Kontur 1,3 · Detail 0,9 · Haarlinie 0,5
 *    In kleineren Rastern skaliert der Baustein mit (<Place s=…>), die
 *    Strichstärke also auch.
 * 2. Umrissfarbe je Material:
 *      Holz, Gebäude, Tiere, Figuren → P.outline
 *      Pflanzen                     → P.leafDark (Kontur), P.outline nur bei Kronen/Büschen
 *      Stein                        → P.outlineStone
 *      Glas                         → P.glassEdge
 *      Erde ohne Rahmen             → P.soilDark
 * 3. Ein Schatten: <Shadow> mit var(--g-shadow); Höhe (Bodenlinie) und
 *    Dicke kommen aus GRID je Bildraster, nie frei gewählt.
 * 4. Licht von oben links: der hellste Ton (…Light) sitzt oben links,
 *    dunkle Töne unten rechts.
 * 5. Fußpunkt: jeder Baustein steht mit seinem Fußpunkt auf (0,0) und wird
 *    mit <Place x y s> gesetzt — so passt er in 100×86 wie in 80×72.
 * 6. Größen nach der Maßtabelle SIZE (Mensch 22, Huhn 9, Biene 3,5 …).
 */
export { GRID, GRID_SCALE, type Grid } from './grid'
export { SIZE, STROKE } from './style'
export { Place } from './Place'
export { seeded } from './seeded'
export { Shadow, Bed, SnowCap } from './ground'
export { Flower, Fruit, Sprout, Lettuce, Bush, Tree, BlossomTree, Pot, CitrusPot } from './plants'
export { Barrel, Crate, GardenLamp, Jar, Lantern, OmaSign, Pennant, Pinwheel } from './buildings'
export { Hen, Bird, Bee, HEN_SCALE, BEE_SCALE } from './animals'
export { SeasonContext, foliage, useSeason } from './season'
export { ArtDefs } from './ArtDefs'
