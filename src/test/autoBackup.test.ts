/**
 * Runde 4, Paket 1: automatische Sicherungen auf dem Gerät.
 * Rotation, Größenbudget (180 simulierte Tage), Anlässe, „neuerer Stand wird
 * nicht überschrieben“, defekte IndexedDB, Erinnerung an die Sicherung
 * außerhalb des Geräts.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import v1 from './fixtures/save-v1.json'
import {
  BACKUP_BUDGET_CHARS,
  BACKUP_MAX_ENTRY_CHARS,
  KEEP_DAILY,
  KEEP_OCCASION,
  backupBeforeOccasion,
  describeCode,
  listBackups,
  noteSaved,
  planRotation,
  setBackupTarget,
  writeBackup,
} from '../game/autoBackup'
import { exportCode } from '../game/backup'
import { memoryTarget, type BackupMeta, type BackupTarget } from '../game/backupTarget'
import {
  BACKUP_DEVICE_KEY,
  EXPORT_STALE_MS,
  REMIND_EVERY_MS,
  ensureRecord,
  exportReminderDue,
  loadRecord,
  markExported,
  markReminded,
} from '../game/backupReminder'
import { deviceTarget } from '../game/deviceBackup'
import { restoreBackup } from '../game/restore'
import { setSaveBlock } from '../game/saveGuard'
import { parseSave, SAVE_VERSION, storedSaveState } from '../game/storage'
import { STORAGE_KEY, type GameState } from '../game/state'

const DAY = 86_400_000
const T0 = new Date(2026, 10, 10, 9, 0).getTime()

let store: Map<string, string>
beforeEach(() => {
  store = new Map()
  ;(globalThis as unknown as { localStorage: unknown }).localStorage = {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
    removeItem: (k: string) => void store.delete(k),
  }
  store.set(STORAGE_KEY, JSON.stringify(v1))
})
afterEach(() => setBackupTarget(null))

function meta(id: string, kind: BackupMeta['kind'], at: number, size = 1000): BackupMeta {
  return { id, kind, at, day: new Date(at).toISOString().slice(0, 10), gardenYear: 1, chapters: 1, generation: 0, size, saveVersion: 1, appVersion: 't' }
}

describe('Rotation', () => {
  it('behält die letzten 7 Tages- und die letzten 3 Anlass-Sicherungen', () => {
    const list = [
      ...Array.from({ length: 12 }, (_, i) => meta(`d${i}`, 'daily', T0 + i * DAY)),
      ...Array.from({ length: 5 }, (_, i) => meta(`o${i}`, i % 2 ? 'deep' : 'generation', T0 + i * DAY + 1000)),
    ]
    const drop = new Set(planRotation(list))
    const kept = list.filter((m) => !drop.has(m.id))
    expect(kept.filter((m) => m.kind === 'daily').map((m) => m.id).sort()).toEqual(['d10', 'd11', 'd5', 'd6', 'd7', 'd8', 'd9'])
    expect(kept.filter((m) => m.kind !== 'daily').map((m) => m.id).sort()).toEqual(['o2', 'o3', 'o4'])
  })

  it('je Kalendertag nur die neueste Tages-Sicherung', () => {
    const list = [meta('a', 'daily', T0), meta('b', 'daily', T0 + 3600_000)]
    expect(planRotation(list)).toEqual(['a'])
  })

  it('Budget: räumt die ältesten weg, die neueste bleibt immer', () => {
    const big = BACKUP_BUDGET_CHARS / 3
    const list = Array.from({ length: 5 }, (_, i) => meta(`d${i}`, 'daily', T0 + i * DAY, big))
    const drop = planRotation(list)
    expect(drop.sort()).toEqual(['d0', 'd1'])
    expect(planRotation([meta('x', 'daily', T0, BACKUP_BUDGET_CHARS * 2)])).toEqual([])
  })
})

describe('Anlässe und Budget im Lauf', () => {
  it('180 Tage: höchstens 10 Sicherungen, Budget hält, jeder Tag einmal', async () => {
    const mem = memoryTarget()
    setBackupTarget(mem)
    let dailies = 0
    for (let d = 0; d < 180; d++) {
      const now = T0 + d * DAY
      // mehrere Speichervorgänge am Tag: nur der erste sichert
      for (let k = 0; k < 3; k++) if (await noteSaved(now + k * 60_000)) dailies += 1
      if (d % 4 === 3) await writeBackup('deep', exportCode(now), now + 1)
      if (d % 30 === 29) await writeBackup('generation', exportCode(now), now + 2)
      const all = await mem.list()
      expect(all.length).toBeLessThanOrEqual(KEEP_DAILY + KEEP_OCCASION)
      expect(all.reduce((n, m) => n + m.size, 0)).toBeLessThanOrEqual(BACKUP_BUDGET_CHARS)
    }
    expect(dailies).toBe(180)
    const all = await mem.list()
    expect(all.filter((m) => m.kind === 'daily')).toHaveLength(KEEP_DAILY)
    expect(all.filter((m) => m.kind !== 'daily')).toHaveLength(KEEP_OCCASION)
    // Größe eines echten Stands: weit unter der Obergrenze einer Sicherung
    expect(all[0]!.size).toBeLessThan(BACKUP_MAX_ENTRY_CHARS / 20)
  })

  it('Tages-Sicherung aus einer früheren Sitzung zählt (kein zweiter Eintrag am selben Tag)', async () => {
    const mem = memoryTarget()
    setBackupTarget(mem)
    expect(await noteSaved(T0)).toBe(true)
    setBackupTarget(mem) // „neue Sitzung“: Modul-Zustand zurückgesetzt, Ziel bleibt
    expect(await noteSaved(T0 + 3600_000)).toBe(false)
    expect(await mem.list()).toHaveLength(1)
  })

  it('vor dem Tiefen Winter: sichert den Stand im Speicher, nicht den älteren in localStorage', async () => {
    const mem = memoryTarget()
    setBackupTarget(mem)
    const s = { ...parseSave(v1)!, samen: 4242 } as GameState
    expect(await backupBeforeOccasion('deep', s, T0)).toBe(true)
    const [m] = await mem.list()
    expect(m!.kind).toBe('deep')
    const e = await mem.read(m!.id)
    const saved = JSON.parse(JSON.parse(atob(e!.code.slice('GARTENERBE1:'.length))).data[STORAGE_KEY])
    expect(saved.samen).toBe(4242)
    // localStorage bleibt unberührt
    expect(JSON.parse(store.get(STORAGE_KEY)!).samen).toBe(v1.samen)
  })

  it('Meta-Daten: Datum, Gartenjahr, Kapitel', () => {
    const m = describeCode(exportCode(T0))!
    expect(m.gardenYear).toBe(v1.saisonenden + 1)
    expect(m.chapters).toBe(2) // Omas Garten + Streuobstwiese
    expect(m.saveVersion).toBe(SAVE_VERSION)
    expect(describeCode('Unsinn')).toBeNull()
  })
})

describe('Fehler stören nie', () => {
  const broken: BackupTarget = {
    name: 'kaputt',
    write: () => Promise.reject(new Error('quota')),
    list: () => Promise.reject(new Error('io')),
    read: () => Promise.reject(new Error('io')),
    remove: () => Promise.reject(new Error('io')),
  }

  it('kaputtes Ziel: nichts wirft, Spielstand unverändert', async () => {
    setBackupTarget(broken)
    const before = store.get(STORAGE_KEY)
    await expect(noteSaved(T0)).resolves.toBe(false)
    await expect(writeBackup('deep', exportCode(T0), T0)).resolves.toBe(false)
    await expect(backupBeforeOccasion('generation', parseSave(v1), T0)).resolves.toBe(false)
    await expect(listBackups()).resolves.toEqual([])
    const r = await restoreBackup('x', null, undefined, () => {
      throw new Error('darf nicht einspielen')
    })
    expect(r).toEqual({ ok: false, reason: 'missing' })
    expect(store.get(STORAGE_KEY)).toBe(before)
  })

  it('IndexedDB fehlt, wirft beim Öffnen oder meldet einen Fehler', async () => {
    const none = deviceTarget(undefined)
    await expect(none.list()).rejects.toThrow()
    const throwing = deviceTarget({ open: () => { throw new Error('SecurityError') } } as unknown as IDBFactory)
    await expect(throwing.write({} as never)).rejects.toThrow()
    const failing = deviceTarget({
      open: () => {
        const r: Record<string, unknown> = { error: new Error('InvalidStateError') }
        setTimeout(() => (r.onerror as () => void)?.(), 0)
        return r
      },
    } as unknown as IDBFactory)
    await expect(failing.list()).rejects.toThrow()
    // über autoBackup: still false, kein Fehler
    setBackupTarget(failing)
    await expect(noteSaved(T0)).resolves.toBe(false)
  })
})

describe('Wiederherstellen', () => {
  async function oneBackup(samen: number) {
    const mem = memoryTarget()
    setBackupTarget(mem)
    await backupBeforeOccasion('deep', { ...parseSave(v1)!, samen }, T0)
    return { mem, id: (await mem.list())[0]!.id }
  }

  it('spielt ein und sichert vorher den jetzigen Stand', async () => {
    const { mem, id } = await oneBackup(777)
    let applied: unknown = null
    const r = await restoreBackup(id, parseSave(v1), undefined, (b) => (applied = b))
    expect(r.ok).toBe(true)
    expect(JSON.parse((applied as { data: Record<string, string> }).data[STORAGE_KEY]!).samen).toBe(777)
    expect((await mem.list()).map((m) => m.kind).sort()).toEqual(['deep', 'restore'])
  })

  it('überschreibt nie einen Stand aus einer neueren Version', async () => {
    const { id } = await oneBackup(1)
    store.set(STORAGE_KEY, JSON.stringify({ ...v1, saveVersion: SAVE_VERSION + 1 }))
    expect(storedSaveState()).toBe('newer')
    const r = await restoreBackup(id, null, undefined, () => {
      throw new Error('darf nicht einspielen')
    })
    expect(r).toEqual({ ok: false, reason: 'blocked' })
  })

  it('nicht während ein anderes Fenster speichert (saveGuard)', async () => {
    const { id } = await oneBackup(1)
    setSaveBlock('otherTab')
    const r = await restoreBackup(id, null, undefined, () => {
      throw new Error('darf nicht einspielen')
    })
    setSaveBlock(null)
    expect(r).toEqual({ ok: false, reason: 'blocked' })
  })

  it('Sicherung aus einer neueren Version wird abgelehnt', async () => {
    const mem = memoryTarget()
    setBackupTarget(mem)
    store.set(STORAGE_KEY, JSON.stringify({ ...v1, saveVersion: SAVE_VERSION + 1 }))
    const code = exportCode(T0)
    store.set(STORAGE_KEY, JSON.stringify(v1))
    // describeCode lehnt sie schon beim Schreiben ab → nie in der Liste
    expect(describeCode(code)).toBeNull()
    expect(await writeBackup('daily', code, T0)).toBe(false)
  })

  it('leerer oder kaputter Stand wird erkannt (Startangebot)', () => {
    expect(storedSaveState()).toBe('ok')
    store.delete(STORAGE_KEY)
    expect(storedSaveState()).toBe('empty')
    store.set(STORAGE_KEY, '{kaputt')
    expect(storedSaveState()).toBe('broken')
  })
})

describe('Erinnerung: Sicherung außerhalb des Geräts', () => {
  const s0 = () => ({ ...parseSave(v1)!, sessions: 5 })

  it('erst nach 14 Tagen und nur mit neuem Fortschritt', () => {
    const r = ensureRecord(s0(), T0)
    const later = T0 + EXPORT_STALE_MS + DAY
    expect(exportReminderDue(r, s0(), later)).toBe(false) // kein Fortschritt
    expect(exportReminderDue(r, { ...s0(), tiefeWinter: s0().tiefeWinter + 1 }, T0 + DAY)).toBe(false) // zu früh
    expect(exportReminderDue(r, { ...s0(), tiefeWinter: s0().tiefeWinter + 1 }, later)).toBe(true)
    expect(exportReminderDue(r, { ...s0(), generation: 1 }, later)).toBe(true)
  })

  it('höchstens einmal in 7 Tagen, nie in der ersten Sitzung, Export setzt zurück', () => {
    const r0 = ensureRecord(s0(), T0)
    const s = { ...s0(), generation: 3 }
    const later = T0 + EXPORT_STALE_MS + DAY
    expect(exportReminderDue(r0, { ...s, sessions: 1 }, later)).toBe(false)
    markReminded(later)
    expect(exportReminderDue(loadRecord(), s, later + DAY)).toBe(false)
    expect(exportReminderDue(loadRecord(), s, later + REMIND_EVERY_MS)).toBe(true)
    markExported(s, later + REMIND_EVERY_MS)
    expect(exportReminderDue(loadRecord(), s, later + REMIND_EVERY_MS + EXPORT_STALE_MS + DAY)).toBe(false)
    // Uhr zurückgestellt: still
    expect(exportReminderDue(loadRecord(), { ...s, generation: 9 }, later - 30 * DAY)).toBe(false)
  })

  it('liegt nicht im Spielstand', () => {
    ensureRecord(s0(), T0)
    expect(store.has(BACKUP_DEVICE_KEY)).toBe(true)
    expect(JSON.parse(store.get(STORAGE_KEY)!)).toEqual(v1)
  })
})
