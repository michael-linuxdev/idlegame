/**
 * Sicherungsziele — wohin eine automatische Sicherung geschrieben wird.
 *
 * Einzige Umsetzung heute: das Gerät selbst (IndexedDB, deviceBackup.ts).
 * Die Schnittstelle ist bewusst klein, damit später ein zweites Ziel
 * (iCloud, Play Games, eigenes Backend) dieselbe Rotation und dieselbe
 * Wiederherstellung nutzen kann. Es gibt hier keinen Netzwerk-Code.
 */

/** Anlass einer Sicherung. `daily` = einmal je Kalendertag beim ersten Speichern. */
export type BackupKind = 'daily' | 'deep' | 'generation' | 'import' | 'restore'

/** Was die Liste zeigt, ohne die ganze Sicherung zu lesen. */
export interface BackupMeta {
  id: string
  kind: BackupKind
  /** Zeitpunkt der Sicherung (ms) */
  at: number
  /** Kalendertag (lokal, JJJJ-MM-TT) — eine Tages-Sicherung je Tag */
  day: string
  /** Gartenjahr im gesicherten Stand (Saisonenden + 1) */
  gardenYear: number
  /** Offene Grundstücke inkl. Omas Garten (Kapitel 1) */
  chapters: number
  generation: number
  /** Länge des Codes in Zeichen (≈ Bytes, Base64 ist ASCII) */
  size: number
  /** Speicherformat und App-Version beim Sichern */
  saveVersion: number
  appVersion: string
}

export interface BackupEntry extends BackupMeta {
  /** Dasselbe Bündel wie „Code kopieren“ (backup.ts, exportCode) */
  code: string
}

export interface BackupTarget {
  /** Kurzer Name fürs Protokoll, z. B. 'device' */
  readonly name: string
  write(entry: BackupEntry): Promise<void>
  /** Alle Sicherungen, neueste zuerst */
  list(): Promise<BackupMeta[]>
  read(id: string): Promise<BackupEntry | null>
  remove(id: string): Promise<void>
}

/** Nur für Tests und als Muster für weitere Ziele: hält alles im Speicher. */
export function memoryTarget(): BackupTarget & { entries: Map<string, BackupEntry> } {
  const entries = new Map<string, BackupEntry>()
  return {
    name: 'memory',
    entries,
    async write(e) {
      entries.set(e.id, e)
    },
    async list() {
      return [...entries.values()].map(toMeta).sort((a, b) => b.at - a.at)
    },
    async read(id) {
      return entries.get(id) ?? null
    },
    async remove(id) {
      entries.delete(id)
    },
  }
}

export function toMeta(e: BackupEntry): BackupMeta {
  const { code: _code, ...meta } = e
  return meta
}
