/**
 * Gartenerbe-Farbpalette für alle Spielgrafik.
 *
 * Neue Grafik nimmt Farben nur von hier (oder als CSS-Variable `--art-*`
 * aus tokens.css). Ein Test (src/test/artPalette.test.ts) meldet neue
 * feste Hex-Werte in src/theme/art/**.
 *
 * Licht kommt von oben links: „light“-Töne für die obere/linke Seite,
 * „dark“-Töne für Schatten und Unterseiten.
 */
export const HEX = {
  // Umrisse je Material
  outline: '#3d2f1f',
  outlineWood: '#6e4a2b',
  outlineSoft: '#8a6a40',
  outlineStone: '#7a6e5a',
  // Laub
  leafLight: '#7fbf5a',
  leaf: '#5f9e45',
  leafDark: '#3f7a30',
  leafMoss: '#4f7a2e',
  leafPale: '#9ad16f',
  // Herbst- und Winterlaub
  autumnDark: '#a5531a',
  autumn: '#d2752c',
  winterLeafDark: '#5f7a5a',
  winterLeaf: '#7a8f72',
  winterLeafLight: '#9aa88a',
  // Holz
  woodLight: '#c9a46b',
  wood: '#b98450',
  woodMid: '#a5733f',
  woodDark: '#8a5a32',
  bark: '#7a5532',
  // Erde
  soil: '#7a4d30',
  soilDark: '#5b3721',
  compost: '#5b3a22',
  // Stein
  stoneLight: '#c9c3b6',
  stone: '#a69a8a',
  stoneDark: '#8f8676',
  // Glas
  glass: '#d6f0f6',
  glassEdge: '#e8f6fa',
  // Wasser
  waterLight: '#8fd0ec',
  water: '#6aa6c9',
  waterDeep: '#3d8db8',
  pond: '#5aa9c6',
  // Haut
  skin: '#f2c9a0',
  skinLight: '#f2d9a0',
  // Papier, Stoff, Licht
  white: '#ffffff',
  cream: '#fbf6e8',
  paper: '#efe1c2',
  canvas: '#f4ead2',
  lamp: '#ffd36b',
  // Dächer, Rot
  roof: '#c4553f',
  red: '#e0485e',
  berry: '#d7263d',
  tomato: '#e2453c',
  barn: '#d9534f',
  // Gelb, Orange
  yellow: '#f5c542',
  gold: '#e8b422',
  brass: '#c9a24a',
  honey: '#f0a530',
  amber: '#f5a623',
  orange: '#f08a2c',
  // Blüten
  pink: '#f28ab2',
  lilac: '#c77dd1',
  lavender: '#9a6bc9',
  plum: '#6a3d8f',
  // Blau
  blue: '#3d6fd1',
  denim: '#5a8fc2',
  // Ton, Federn, Frost
  terracotta: '#c8693e',
  terracottaLight: '#d97f50',
  seed: '#7a4a1a',
  blossom: '#f7c6d9',
  frost: '#c9d0c4',
  feather: '#f7f1e6',
  label: '#fff6dc',
  outlineFur: '#8a7a6a',
  // Metall, Dunkel
  metal: '#6b6f73',
  charcoal: '#3a3a3a',
  ink: '#1a1a1a',
  // Fenster, Glas mit Licht (Tag: hell/kühl, Abend/Nacht: warm leuchtend)
  window: '#f4efe4',
  glassWarm: '#d6f0f6',
} as const

export type PaletteName = keyof typeof HEX

/**
 * Die Grafik zeichnet mit `P.name` = `var(--art-name, #hex)`: ohne CSS sieht
 * alles aus wie der Hex-Wert, und Stimmungen (Abend, Nacht) können die
 * Farben im Hauptgarten über die Variablen umstimmen (tokens.css).
 */
export const P = Object.fromEntries(
  (Object.keys(HEX) as PaletteName[]).map((k) => [k, `var(${cssVar(k)}, ${HEX[k]})`]),
) as { readonly [K in PaletteName]: string }

/** CSS-Variablen-Name für einen Palettenton (`--art-leaf-dark`). */
export function cssVar(name: PaletteName): string {
  return `--art-${name.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`
}

/**
 * Einzelfarbe außerhalb der Palette, die trotzdem der Stimmung folgt:
 * `var(--art-t-rrggbb, #rrggbb)`. Die Abend-/Nacht-Werte erzeugt mood.ts
 * aus allen tone('#…')-Aufrufen im Quelltext.
 */
export function tone(hex: string): string {
  return `var(--art-t-${hex.slice(1).toLowerCase()}, ${hex})`
}
