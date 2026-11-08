/**
 * Spielstand sichern — export / import everything the player owns as a
 * portable code (or file). No server: the code *is* the backup.
 */
import { EXTRAS_STORAGE_KEY } from './extras'
import { FTUE_STORAGE_KEY } from './ftue'
import { NOTEBOOK_STORAGE_KEY } from './notebook'
import { STORAGE_KEY } from './state'
import { lockSaves, parseSave } from './storage'

const PREFIX = 'GARTENERBE1:'
const KEYS = [STORAGE_KEY, NOTEBOOK_STORAGE_KEY, EXTRAS_STORAGE_KEY, FTUE_STORAGE_KEY] as const

interface Bundle {
  app: 'gartenerbe'
  v: 1
  at: number
  data: Partial<Record<(typeof KEYS)[number], string>>
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

export function exportCode(now = Date.now()): string {
  const data: Bundle['data'] = {}
  for (const k of KEYS) {
    try {
      const v = localStorage.getItem(k)
      if (v) data[k] = v
    } catch {
      /* ignore */
    }
  }
  const bundle: Bundle = { app: 'gartenerbe', v: 1, at: now, data }
  return PREFIX + toBase64(JSON.stringify(bundle))
}

export type ImportResult = { ok: true; bundle: Bundle } | { ok: false }

/** Validate a code (or raw JSON file contents) without applying it. */
export function readCode(input: string): ImportResult {
  try {
    const trimmed = input.trim()
    const json = trimmed.startsWith(PREFIX) ? fromBase64(trimmed.slice(PREFIX.length)) : trimmed
    const bundle = JSON.parse(json) as Bundle
    if (bundle?.app !== 'gartenerbe' || bundle.v !== 1 || !bundle.data) return { ok: false }
    const save = bundle.data[STORAGE_KEY]
    if (!save || !parseSave(JSON.parse(save))) return { ok: false }
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

export function downloadBackup(code: string, now = Date.now()): void {
  const d = new Date(now)
  const name = `gartenerbe-spielstand-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}.txt`
  const url = URL.createObjectURL(new Blob([code], { type: 'text/plain' }))
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}
