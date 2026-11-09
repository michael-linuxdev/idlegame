# Gartenerbe — Arbeitsregeln

## Spielstand-Migration ist AKTIV (seit 2026-11-08)

Es gibt echte Spielstände. Fortschritt darf durch ein Update nie verloren gehen.

- Speicherformat: `src/game/storage.ts` (`SAVE_VERSION`, `MIGRATIONS`, `migrateSave`).
- Felder im `GameState` **nie still umbenennen oder entfernen**. Neue Felder bekommen in `parseGameState`/`parseExpansion` einen Startwert.
- Jede inkompatible Format-Änderung: `SAVE_VERSION` erhöhen, einen Schritt in `MIGRATIONS` ergänzen und einen echten Spielstand als `src/test/fixtures/save-v<N>.json` ablegen. `src/test/migration.test.ts` muss alle alten Fixtures verlustfrei laden.
- Neue Kapitel nur in `src/game/chapters.ts` anhängen (IDs nie ändern); `parseChapters` füllt fehlende Kapitel automatisch.
- Vor dem Merge: `npm test`, `npm run lint`, `npm run build`, `npm run e2e`.

## Web-Fassung vs. Store-Fassung

- Handy/Tablet im Browser zeigt beim Start den Vollbild-Hinweis „Zuerst die App installieren“ (`src/components/InstallGate.tsx`, Logik `src/game/installGate.ts`).
- **Vor dem App-Store-/Play-Store-Start:** `DISTRIBUTION` in `src/game/distribution.ts` auf `'store'` stellen. `src/test/distribution.test.ts` schlägt fehl, sobald eine Store-Hülle (`capacitor.config.*`, `android/`, `ios/`, `twa-manifest.json`) im Repo liegt und dort noch `'web'` steht. Wie man den Hinweis ganz entfernt, steht in `distribution.ts`.
- **Testphase:** Beim ersten Start der installierten App muss der Hinweis zur Aufzeichnung (Playtest-Log, abwählbar) bestätigt werden (`src/components/TestPhaseNotice.tsx`). Nach der Testphase bzw. vor dem Store-Start `TEST_PHASE` in `distribution.ts` auf `false` stellen (ebenfalls vom Test erzwungen).
