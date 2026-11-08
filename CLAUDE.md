# Gartenerbe — Arbeitsregeln

## Spielstand-Migration ist AKTIV (seit 2026-11-08)

Es gibt echte Spielstände. Fortschritt darf durch ein Update nie verloren gehen.

- Speicherformat: `src/game/storage.ts` (`SAVE_VERSION`, `MIGRATIONS`, `migrateSave`).
- Felder im `GameState` **nie still umbenennen oder entfernen**. Neue Felder bekommen in `parseGameState`/`parseExpansion` einen Startwert.
- Jede inkompatible Format-Änderung: `SAVE_VERSION` erhöhen, einen Schritt in `MIGRATIONS` ergänzen und einen echten Spielstand als `src/test/fixtures/save-v<N>.json` ablegen. `src/test/migration.test.ts` muss alle alten Fixtures verlustfrei laden.
- Neue Kapitel nur in `src/game/chapters.ts` anhängen (IDs nie ändern); `parseChapters` füllt fehlende Kapitel automatisch.
- Vor dem Merge: `npm test`, `npm run lint`, `npm run build`, `npm run e2e`.
