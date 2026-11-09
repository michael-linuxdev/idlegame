/**
 * Wie Gartenerbe ausgeliefert wird.
 *
 *  - 'web'   : PWA im Browser (idlegame.micana.de). Auf Handy/Tablet im
 *              Browser erscheint beim Start der Vollbild-Hinweis „Zuerst die
 *              App installieren“ (components/InstallGate.tsx).
 *  - 'store' : App-Store-/Play-Store-Fassung (z. B. Capacitor/TWA). Dort gibt
 *              es nichts zu installieren — der Hinweis ist aus.
 *
 * VOR DEM STORE-START hier auf 'store' stellen. Vergessen geht nicht:
 * src/test/distribution.test.ts schlägt fehl, sobald eine Store-Hülle im
 * Repo liegt (capacitor.config.*, android/, ios/, twa-manifest.json) und hier
 * noch 'web' steht.
 *
 * Ganz entfernen: diese Datei, components/InstallGate.tsx, game/installGate.ts,
 * den <InstallGate />-Eintrag in App.tsx, `installGate` in strings.ts und den
 * Block „Installations-Hinweis“ in theme/ux.css löschen.
 */
export type Distribution = 'web' | 'store'

export const DISTRIBUTION: Distribution = 'web'

/**
 * Testphase: Beim ersten Start der installierten App erscheint der Hinweis,
 * dass die Nutzung aufgezeichnet wird (Playtest-Log, nur auf dem Gerät),
 * per Häkchen abwählbar (components/TestPhaseNotice.tsx).
 *
 * NACH DER TESTPHASE / VOR DEM STORE-START auf false stellen — auch das prüft
 * src/test/distribution.test.ts, sobald eine Store-Hülle im Repo liegt.
 * Ganz entfernen: TestPhaseNotice.tsx, game/testPhase.ts, den Eintrag in
 * App.tsx und `testPhase` in strings.ts löschen.
 */
export const TEST_PHASE = true

/** Der Vollbild-Hinweis zum Installieren gehört nur zur Web-Fassung. */
export function webInstallGateEnabled(dist: Distribution = DISTRIBUTION): boolean {
  return dist === 'web'
}
