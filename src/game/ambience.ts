/**
 * Naturgeräusche — optional garden ambience, synthesized (no audio files):
 * soft wind (looped filtered noise with slow swell) plus birdsong by day
 * and crickets at night. Off by default; pauses while the app is hidden.
 */
import { audioCtxForAmbience, isSfxMuted, noise } from './sound'

const KEY = 'gartenerbe-ambience'

let enabledCache: boolean | null = null
let running: { stop: () => void } | null = null

export function isAmbienceOn(): boolean {
  if (enabledCache != null) return enabledCache
  try {
    enabledCache = localStorage.getItem(KEY) === '1'
  } catch {
    enabledCache = false
  }
  return enabledCache
}

export function setAmbienceOn(on: boolean): void {
  enabledCache = on
  try {
    localStorage.setItem(KEY, on ? '1' : '0')
  } catch {
    /* ignore */
  }
  if (on) startAmbience()
  else stopAmbience()
}

function chirp(ac: AudioContext, out: AudioNode, at: number, f0: number, f1: number, vol: number, dur = 0.08) {
  const o = ac.createOscillator()
  const g = ac.createGain()
  o.frequency.setValueAtTime(f0, at)
  o.frequency.exponentialRampToValueAtTime(f1, at + dur * 0.8)
  g.gain.setValueAtTime(0.0001, at)
  g.gain.exponentialRampToValueAtTime(vol, at + 0.01)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  o.connect(g)
  g.connect(out)
  o.start(at)
  o.stop(at + dur + 0.02)
}

export function startAmbience(): void {
  if (running || !isAmbienceOn() || isSfxMuted()) return
  const ac = audioCtxForAmbience()
  if (!ac) return
  void ac.resume().catch(() => undefined)
  const master = ac.createGain()
  master.gain.value = 0.0001
  master.gain.exponentialRampToValueAtTime(0.6, ac.currentTime + 2)
  master.connect(ac.destination)

  // wind
  const src = ac.createBufferSource()
  src.buffer = noise(ac)
  src.loop = true
  const lp = ac.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 420
  const windGain = ac.createGain()
  windGain.gain.value = 0.025
  const lfo = ac.createOscillator()
  const lfoGain = ac.createGain()
  lfo.frequency.value = 0.07
  lfoGain.gain.value = 0.015
  lfo.connect(lfoGain)
  lfoGain.connect(windGain.gain)
  src.connect(lp)
  lp.connect(windGain)
  windGain.connect(master)
  src.start()
  lfo.start()

  // birds by day, crickets at night
  const timer = window.setInterval(() => {
    const h = new Date().getHours()
    const t = ac.currentTime + 0.05
    if (h >= 21 || h < 5) {
      for (let i = 0; i < 6; i++) chirp(ac, master, t + i * 0.07, 4300, 4200, 0.006, 0.04)
      return
    }
    if (Math.random() < 0.55) {
      const base = 1800 + Math.random() * 1400
      const n = 2 + Math.floor(Math.random() * 4)
      for (let i = 0; i < n; i++) chirp(ac, master, t + i * 0.12, base, base * (1.2 + Math.random() * 0.4), 0.012)
    }
  }, 2600)

  const onVis = () => {
    if (document.hidden) void ac.suspend().catch(() => undefined)
    else void ac.resume().catch(() => undefined)
  }
  document.addEventListener('visibilitychange', onVis)

  running = {
    stop: () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVis)
      master.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + 0.6)
      window.setTimeout(() => {
        try {
          src.stop()
          lfo.stop()
        } catch {
          /* already stopped */
        }
        master.disconnect()
      }, 700)
    },
  }
}

export function stopAmbience(): void {
  running?.stop()
  running = null
}

/** Browsers only allow audio after a gesture — start on the first tap. */
export function armAmbienceOnFirstGesture(): () => void {
  const go = () => startAmbience()
  window.addEventListener('pointerdown', go, { once: true })
  return () => window.removeEventListener('pointerdown', go)
}
