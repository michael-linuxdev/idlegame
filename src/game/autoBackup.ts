/**
 * Automatische Sicherungen auf dem Gerät (Runde 4, Paket 1).
 *
 * Inhalt = dasselbe Bündel wie „Code kopieren“ (backup.ts: alle KEYS,
 * appVersion, saveVersion). Anlässe:
 *  - `daily`: einmal je Kalendertag, beim ersten erfolgreichen Speichern,
 *  - `deep` / `generation`: direkt vor jedem Tiefen Winter bzw. jeder Generation,
 *  - `import`: vor dem Einspielen eines Codes, `restore`: vor dem
 *    Wiederherstellen einer Sicherung.
 * Aufbewahrung: die letzten 7 Tages-Sicherungen und die letzten 3
 * Anlass-Sicherungen, zusammen höchstens BACKUP_BUDGET_CHARS.
 *
 * Grundsatz: Sichern darf das Spiel nie stören und den Spielstand nie
 * berühren. Jede Funktion hier fängt alle Fehler selbst ab; geschrieben
 * wird ausschließlich ins Sicherungsziel, nie in localStorage.
 */
import { exportCode, readCode, type BackupKey } from './backup'
import type { BackupEntry, BackupKind, BackupMeta, BackupTarget } from './backupTarget'
import { APP_VERSION } from './appUpdate'
import { deviceTarget } from './deviceBackup'
import { dayKey } from './monetization'
import { logPlaytest } from './playtestLog'
import { SAVE_VERSION, parseSave, serializeSave } from './storage'
import { openChapters, STORAGE_KEY, type GameState } from './state'

export const KEEP_DAILY = 7
export const KEEP_OCCASION = 3
/** Eine einzelne Sicherung darf höchstens so groß sein (Zeichen ≈ Bytes). */
export const BACKUP_MAX_ENTRY_CHARS = 1_500_000
/** Alle Sicherungen zusammen (10 × die Obergrenze einer Sicherung wäre zu viel für alte Handys). */
export const BACKUP_BUDGET_CHARS = 6_000_000

let target: BackupTarget | null = null

/** Sicherungsziel (Standard: dieses Gerät). Tests setzen ein eigenes. */
export function backupTarget(): BackupTarget {
  if (!target) target = deviceTarget()
  return target
}

export function setBackupTarget(next: BackupTarget | null): void {
  target = next
  lastDailyDay = ''
  dailyInFlight = null
}

/** Meta-Daten aus einem Code (null = kein gültiger Spielstand). */
export function describeCode(code: string): Omit<BackupMeta, 'id' | 'kind' | 'at' | 'day'> | null {
  const r = readCode(code)
  if (!r.ok) return null
  const save = r.bundle.data[STORAGE_KEY]
  const s = save ? parseSave(JSON.parse(save)) : null
  if (!s) return null
  return {
    gardenYear: s.saisonenden + 1,
    chapters: openChapters(s).length + 1,
    generation: s.generation,
    size: code.length,
    saveVersion: r.bundle.saveVersion ?? SAVE_VERSION,
    appVersion: r.bundle.appVersion ?? APP_VERSION,
  }
}

function isOccasion(kind: BackupKind): boolean {
  return kind !== 'daily'
}

/**
 * Welche Sicherungen nach einer neuen wegfallen. Rein, damit testbar.
 * Behalten: je Kalendertag die neueste Tages-Sicherung (die letzten 7 Tage
 * mit Sicherung), die letzten 3 Anlass-Sicherungen; danach so lange die
 * älteste, bis das Budget passt — die neueste bleibt immer.
 */
export function planRotation(metas: readonly BackupMeta[], budget = BACKUP_BUDGET_CHARS): string[] {
  const sorted = [...metas].sort((a, b) => b.at - a.at)
  const keep: BackupMeta[] = []
  const days = new Set<string>()
  let occasions = 0
  for (const m of sorted) {
    if (isOccasion(m.kind)) {
      if (occasions < KEEP_OCCASION) {
        keep.push(m)
        occasions += 1
      }
    } else if (!days.has(m.day) && days.size < KEEP_DAILY) {
      days.add(m.day)
      keep.push(m)
    }
  }
  let total = keep.reduce((n, m) => n + m.size, 0)
  while (total > budget && keep.length > 1) {
    const oldest = keep.pop()!
    total -= oldest.size
  }
  const kept = new Set(keep.map((m) => m.id))
  return sorted.filter((m) => !kept.has(m.id)).map((m) => m.id)
}

function makeEntry(kind: BackupKind, code: string, now: number): BackupEntry | null {
  const meta = describeCode(code)
  if (!meta || meta.size > BACKUP_MAX_ENTRY_CHARS) return null
  return { id: `${kind}-${now}-${Math.random().toString(36).slice(2, 7)}`, kind, at: now, day: dayKey(now), code, ...meta }
}

/**
 * Eine Sicherung schreiben und alte wegräumen. Gibt nie einen Fehler weiter;
 * Ergebnis `true` nur, wenn die Sicherung im Ziel liegt.
 */
export async function writeBackup(kind: BackupKind, code: string, now = Date.now(), to: BackupTarget = backupTarget()): Promise<boolean> {
  try {
    const entry = makeEntry(kind, code, now)
    if (!entry) return false
    await to.write(entry)
    try {
      for (const id of planRotation(await to.list())) await to.remove(id)
    } catch {
      /* Aufräumen klappt beim nächsten Mal */
    }
    logPlaytest('backup', { kind, ok: true, size: entry.size })
    return true
  } catch {
    logPlaytest('backup', { kind, ok: false })
    return false
  }
}

/** Code aus dem aktuellen Spielzustand im Speicher (statt aus localStorage). */
export function codeFromState(state: GameState, now = Date.now()): string {
  const override: Partial<Record<BackupKey, string>> = { [STORAGE_KEY]: serializeSave(state) }
  return exportCode(now, override)
}

/** Vor Tiefem Winter / Generation: Stand von *jetzt* sichern (läuft im Hintergrund). */
export function backupBeforeOccasion(kind: Exclude<BackupKind, 'daily'>, state: GameState | null, now = Date.now()): Promise<boolean> {
  try {
    const code = state ? codeFromState(state, now) : exportCode(now)
    return writeBackup(kind, code, now)
  } catch {
    return Promise.resolve(false)
  }
}

let lastDailyDay = ''
let dailyInFlight: Promise<boolean> | null = null

/**
 * Nach jedem erfolgreichen Speichern aufrufen (hooks/useGameLoop.ts). Schreibt höchstens
 * eine Tages-Sicherung je Kalendertag; ein schon vorhandener Eintrag für heute
 * (z. B. aus einer früheren Sitzung) zählt.
 */
export function noteSaved(now = Date.now()): Promise<boolean> {
  const day = dayKey(now)
  if (day === lastDailyDay || dailyInFlight) return dailyInFlight ?? Promise.resolve(false)
  dailyInFlight = (async () => {
    try {
      const to = backupTarget()
      const have = (await to.list()).some((m) => m.kind === 'daily' && m.day === day)
      const ok = have || (await writeBackup('daily', exportCode(now), now, to))
      if (ok) lastDailyDay = day
      return ok && !have
    } catch {
      return false
    } finally {
      dailyInFlight = null
    }
  })()
  return dailyInFlight
}

/** Liste fürs Menü (neueste zuerst); leer, wenn das Ziel nicht geht. */
export async function listBackups(to: BackupTarget = backupTarget()): Promise<BackupMeta[]> {
  try {
    return await to.list()
  } catch {
    return []
  }
}

export async function readBackup(id: string, to: BackupTarget = backupTarget()): Promise<BackupEntry | null> {
  try {
    return await to.read(id)
  } catch {
    return null
  }
}

/** Wartet höchstens `ms`, dann gilt `fallback` (z. B. hängende IndexedDB). */
export function withTimeout<T>(p: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), ms)
    p.then(
      (v) => {
        clearTimeout(timer)
        resolve(v)
      },
      () => {
        clearTimeout(timer)
        resolve(fallback)
      },
    )
  })
}
