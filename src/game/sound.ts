/**
 * Optional SFX stubs — soft oscillator blips. Mute persists in localStorage.
 * No assets; safe to call from UI feedback loops.
 */

const MUTE_KEY = 'turmfarm-sfx-muted'

export type SfxKind = 'tap' | 'upgrade' | 'claim' | 'level' | 'streak' | 'tick'

let audioCtx: AudioContext | null = null
let mutedCache: boolean | null = null

export function isSfxMuted(): boolean {
  if (mutedCache != null) return mutedCache
  try {
    mutedCache = localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    mutedCache = false
  }
  return mutedCache
}

export function setSfxMuted(muted: boolean): void {
  mutedCache = muted
  try {
    localStorage.setItem(MUTE_KEY, muted ? '1' : '0')
  } catch {
    /* ignore quota / private mode */
  }
}

function ctx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  if (!AC) return null
  if (!audioCtx) audioCtx = new AC()
  return audioCtx
}

/** Soft stub blip — no samples. Respects mute + reduced-motion (still plays quietly). */
export function playSfx(kind: SfxKind): void {
  if (isSfxMuted()) return
  const ac = ctx()
  if (!ac) return
  void ac.resume().catch(() => undefined)

  const now = ac.currentTime
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.connect(gain)
  gain.connect(ac.destination)

  const profiles: Record<
    SfxKind,
    { freq: number; freq2?: number; dur: number; type: OscillatorType; vol: number }
  > = {
    tap: { freq: 520, dur: 0.06, type: 'triangle', vol: 0.04 },
    tick: { freq: 380, dur: 0.04, type: 'sine', vol: 0.025 },
    upgrade: { freq: 440, freq2: 660, dur: 0.14, type: 'triangle', vol: 0.055 },
    claim: { freq: 490, freq2: 735, dur: 0.18, type: 'sine', vol: 0.06 },
    level: { freq: 392, freq2: 784, dur: 0.22, type: 'triangle', vol: 0.06 },
    streak: { freq: 554, freq2: 830, dur: 0.16, type: 'sine', vol: 0.05 },
  }

  const p = profiles[kind]
  osc.type = p.type
  osc.frequency.setValueAtTime(p.freq, now)
  if (p.freq2 != null) {
    osc.frequency.exponentialRampToValueAtTime(p.freq2, now + p.dur * 0.7)
  }
  gain.gain.setValueAtTime(0.0001, now)
  gain.gain.exponentialRampToValueAtTime(p.vol, now + 0.015)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + p.dur)

  osc.start(now)
  osc.stop(now + p.dur + 0.02)
}
