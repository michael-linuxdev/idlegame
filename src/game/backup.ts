/**
 * Spielstand sichern — export / import everything the player owns as a
 * portable code (or file). No server: the code *is* the backup.
 */
import { EXTRAS_STORAGE_KEY } from './extras'
import { FTUE_STORAGE_KEY } from './ftue'
import { NOTEBOOK_STORAGE_KEY } from './notebook'
import { STORAGE_KEY } from './state'
import { isNewerSave, lockSaves, parseSave, SAVE_VERSION } from './storage'
import { APP_VERSION } from './appUpdate'
import { saveFile, type SaveResult } from './saveFile'

const PREFIX = 'GARTENERBE1:'
const KEYS = [STORAGE_KEY, NOTEBOOK_STORAGE_KEY, EXTRAS_STORAGE_KEY, FTUE_STORAGE_KEY] as const
export type BackupKey = (typeof KEYS)[number]

/**
 * Bündel-Format. v1 (bis 2026-11-09) trug den alten Spielstand
 * (`gartenerbe-save-v1`, Format vor der Aufräum-Runde) und wird abgelehnt.
 */
export const BUNDLE_VERSION = 2

export interface Bundle {
  app: 'gartenerbe'
  v: typeof BUNDLE_VERSION
  at: number
  data: Partial<Record<(typeof KEYS)[number], string>>
  /** App-Version und Speicherformat beim Sichern (ab 2026-11-09) */
  appVersion?: string
  saveVersion?: number
}

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin)
}

function fromBase64(b64: string): string {
  const bin = atob(b64)
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

function isRecordLike(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

/**
 * Alle KEYS als Code. `override` ersetzt einzelne Schlüssel (z. B. den
 * Spielstand aus dem Speicher statt aus localStorage, der bis zu 4 s
 * hinterherhinkt — automatische Sicherung vor dem Tiefen Winter).
 */
export function exportCode(now = Date.now(), override: Partial<Record<BackupKey, string>> = {}): string {
  const data: Bundle['data'] = {}
  for (const k of KEYS) {
    try {
      const v = override[k] ?? localStorage.getItem(k)
      if (v) data[k] = v
    } catch {
      /* ignore */
    }
  }
  const bundle: Bundle = { app: 'gartenerbe', v: BUNDLE_VERSION, at: now, data, appVersion: APP_VERSION, saveVersion: SAVE_VERSION }
  return PREFIX + toBase64(JSON.stringify(bundle))
}

export type ImportResult = { ok: true; bundle: Bundle } | { ok: false; newer?: boolean; old?: boolean }

/** Validate a code (or raw JSON file contents) without applying it. */
export function readCode(input: string): ImportResult {
  try {
    const trimmed = input.trim()
    const json = trimmed.startsWith(PREFIX) ? fromBase64(trimmed.slice(PREFIX.length)) : trimmed
    const bundle = JSON.parse(json) as Bundle
    if (bundle?.app !== 'gartenerbe' || !bundle.data) return { ok: false }
    const v = bundle.v as number
    // Code aus einer Vorversion (altes Speicherformat): nicht still falsch einspielen
    if (v < BUNDLE_VERSION) return { ok: false, old: true }
    if (v > BUNDLE_VERSION) return { ok: false, newer: true }
    const save = bundle.data[STORAGE_KEY]
    if (!save) return { ok: false }
    const raw: unknown = JSON.parse(save)
    // Stand aus einer neueren App-Version: nicht in diese ältere einspielen
    if ((bundle.saveVersion ?? 0) > SAVE_VERSION || (isRecordLike(raw) && isNewerSave(raw))) return { ok: false, newer: true }
    if (!parseSave(raw)) return { ok: false }
    return { ok: true, bundle }
  } catch {
    return { ok: false }
  }
}

/** Replace the local garden with the bundle and reload. */
export function applyBundle(bundle: Bundle): void {
  lockSaves()
  for (const k of KEYS) {
    const v = bundle.data[k]
    try {
      if (v) localStorage.setItem(k, v)
      else localStorage.removeItem(k)
    } catch {
      /* ignore */
    }
  }
  window.location.reload()
}

export function downloadBackup(code: string, now = Date.now()): Promise<SaveResult> {
  const d = new Date(now)
  const name = `gartenerbe-spielstand-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.txt`
  return saveFile(name, code, 'text/plain')
}
