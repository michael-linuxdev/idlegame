/**
 * Garden sound effects — synthesized with WebAudio, no sample files.
 *  - tap (Gießen): water splash = filtered noise with a falling sweep
 *  - upgrade: soft wooden marimba pluck
 *  - claim: basket thump + two-note chime
 *  - level: blackbird-style chirps
 *  - streak: little three-note bell
 *  - season: gentle winter music box phrase (Saisonende)
 *  - letter: paper rustle + soft bell (Brief von Oma)
 * Mute persists in localStorage. Every call is cheap and fire-and-forget.
 */

const MUTE_KEY = 'gartenerbe-sfx-muted'

export type SfxKind = 'tap' | 'upgrade' | 'claim' | 'level' | 'streak' | 'tick' | 'season' | 'letter'

let audioCtx: AudioContext | null = null
let mutedCache: boolean | null = null
let noiseBuffer: AudioBuffer | null = null

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
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null
  if (!audioCtx) audioCtx = new AC()
  return audioCtx
}

function noise(ac: AudioContext): AudioBuffer {
  if (noiseBuffer && noiseBuffer.sampleRate === ac.sampleRate) return noiseBuffer
  const len = Math.floor(ac.sampleRate * 0.6)
  const buf = ac.createBuffer(1, len, ac.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1
  noiseBuffer = buf
  return buf
}

/** One enveloped tone. */
function tone(
  ac: AudioContext,
  out: AudioNode,
  at: number,
  freq: number,
  dur: number,
  vol: number,
  type: OscillatorType = 'sine',
  glideTo?: number,
) {
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, at)
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, at + dur * 0.8)
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(vol, at + 0.008)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  osc.connect(g)
  g.connect(out)
  osc.start(at)
  osc.stop(at + dur + 0.02)
}

/** Wooden marimba-ish pluck: fundamental + quick-decaying 4th harmonic. */
function pluck(ac: AudioContext, out: AudioNode, at: number, freq: number, vol: number) {
  tone(ac, out, at, freq, 0.35, vol, 'sine')
  tone(ac, out, at, freq * 4, 0.06, vol * 0.35, 'sine')
}

function splash(ac: AudioContext, out: AudioNode, at: number, vol: number, dur = 0.45) {
  const src = ac.createBufferSource()
  src.buffer = noise(ac)
  const bp = ac.createBiquadFilter()
  bp.type = 'bandpass'
  bp.Q.value = 1.4
  bp.frequency.setValueAtTime(2600, at)
  bp.frequency.exponentialRampToValueAtTime(700, at + dur)
  const g = ac.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(vol, at + 0.03)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  src.connect(bp)
  bp.connect(g)
  g.connect(out)
  src.start(at)
  src.stop(at + dur + 0.05)
}

function chirp(ac: AudioContext, out: AudioNode, at: number, from: number, to: number, vol: number) {
  tone(ac, out, at, from, 0.09, vol, 'sine', to)
}

export function playSfx(kind: SfxKind): void {
  if (isSfxMuted()) return
  const ac = ctx()
  if (!ac) return
  void ac.resume().catch(() => undefined)
  const out = ac.createGain()
  out.gain.value = 0.9
  out.connect(ac.destination)
  const t = ac.currentTime + 0.01

  switch (kind) {
    case 'tap':
      splash(ac, out, t, 0.09)
      splash(ac, out, t + 0.12, 0.05, 0.3)
      tone(ac, out, t + 0.05, 1400, 0.08, 0.012, 'sine', 900)
      break
    case 'tick':
      pluck(ac, out, t, 660, 0.015)
      break
    case 'upgrade':
      pluck(ac, out, t, 523.25, 0.06)
      pluck(ac, out, t + 0.07, 783.99, 0.045)
      break
    case 'claim': {
      const lp = ac.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 400
      lp.connect(out)
      tone(ac, lp, t, 140, 0.18, 0.09, 'triangle', 80)
      tone(ac, out, t + 0.08, 659.25, 0.5, 0.04)
      tone(ac, out, t + 0.18, 987.77, 0.6, 0.035)
      break
    }
    case 'level':
      chirp(ac, out, t, 2200, 3200, 0.025)
      chirp(ac, out, t + 0.11, 2600, 3600, 0.022)
      chirp(ac, out, t + 0.26, 1900, 2900, 0.025)
      chirp(ac, out, t + 0.36, 2400, 3800, 0.02)
      break
    case 'streak':
      ;[783.99, 987.77, 1318.5].forEach((f, i) => tone(ac, out, t + i * 0.09, f, 0.5, 0.035))
      break
    case 'season':
      // E5 D5 B4 · C5 E5 G5 — „Winterruhe … Frühling“
      ;[659.25, 587.33, 493.88, 523.25, 659.25, 783.99].forEach((f, i) =>
        tone(ac, out, t + i * 0.28 + (i >= 3 ? 0.35 : 0), f, 1.1, 0.04, 'triangle'),
      )
      break
    case 'letter': {
      const src = ac.createBufferSource()
      src.buffer = noise(ac)
      const hp = ac.createBiquadFilter()
      hp.type = 'highpass'
      hp.frequency.value = 3000
      const g = ac.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.03, t + 0.05)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3)
      src.connect(hp)
      hp.connect(g)
      g.connect(out)
      src.start(t)
      src.stop(t + 0.35)
      tone(ac, out, t + 0.2, 1046.5, 0.8, 0.03)
      break
    }
  }
}
