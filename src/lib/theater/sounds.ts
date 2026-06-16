// Synthesized cinema sounds — Web Audio, zero asset files.
// Muted by default; play() is always safe to call.

export const SOUND_PREF_KEY = 'hm-sound'

export type SoundName = 'click' | 'thunk' | 'rustle' | 'thock' | 'chatter'

class SoundManager {
  private ctx: AudioContext | null = null
  private muted = true
  private roomToneNodes: { src: AudioBufferSourceNode; gain: GainNode } | null = null

  get isMuted() { return this.muted }

  // Returns muted state from storage ('1' = sound on → muted false)
  loadPreference(): boolean {
    if (typeof window === 'undefined') return true
    return localStorage.getItem(SOUND_PREF_KEY) !== '1'
  }

  setMuted(m: boolean) {
    this.muted = m
    if (typeof window !== 'undefined') {
      localStorage.setItem(SOUND_PREF_KEY, m ? '0' : '1')
    }
    if (m) this.stopRoomTone()
    else { this.ensureCtx(); this.startRoomTone() }
  }

  private ensureCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!AC) return null
    if (!this.ctx) this.ctx = new AC()
    if (this.ctx.state === 'suspended') void this.ctx.resume()
    return this.ctx
  }

  private noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
    const buf = ctx.createBuffer(1, ctx.sampleRate * seconds, ctx.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
    return buf
  }

  // Faint looping projector hum — lowpassed noise
  private startRoomTone() {
    const ctx = this.ensureCtx()
    if (!ctx || this.roomToneNodes) return
    const src = ctx.createBufferSource()
    src.buffer = this.noiseBuffer(ctx, 2)
    src.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'; filter.frequency.value = 220
    const gain = ctx.createGain()
    gain.gain.value = 0.012
    src.connect(filter).connect(gain).connect(ctx.destination)
    src.start()
    this.roomToneNodes = { src, gain }
  }

  private stopRoomTone() {
    if (!this.roomToneNodes) return
    try { this.roomToneNodes.src.stop() } catch {}
    this.roomToneNodes = null
  }

  play(name: SoundName) {
    if (this.muted) return
    const ctx = this.ensureCtx()
    if (!ctx) return
    const t = ctx.currentTime
    const out = ctx.createGain()
    out.connect(ctx.destination)

    const blip = (freq: number, dur: number, vol: number, type: OscillatorType = 'sine', when = 0) => {
      const osc = ctx.createOscillator()
      osc.type = type; osc.frequency.value = freq
      const g = ctx.createGain()
      g.gain.setValueAtTime(vol, t + when)
      g.gain.exponentialRampToValueAtTime(0.0001, t + when + dur)
      osc.connect(g).connect(out)
      osc.start(t + when); osc.stop(t + when + dur)
    }
    const noise = (dur: number, vol: number, freq: number, q = 1, when = 0) => {
      const src = ctx.createBufferSource()
      src.buffer = this.noiseBuffer(ctx, dur)
      const f = ctx.createBiquadFilter()
      f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q
      const g = ctx.createGain()
      g.gain.setValueAtTime(vol, t + when)
      g.gain.exponentialRampToValueAtTime(0.0001, t + when + dur)
      src.connect(f).connect(g).connect(out)
      src.start(t + when)
    }

    switch (name) {
      case 'click':   blip(900, 0.05, 0.06); break
      case 'thunk':   blip(75, 0.28, 0.22, 'sine'); noise(0.06, 0.05, 300, 1); break
      case 'rustle':  noise(0.18, 0.05, 4200, 0.8); break
      case 'thock':   blip(130, 0.12, 0.2, 'triangle'); noise(0.04, 0.08, 1800, 2); break
      case 'chatter': for (let i = 0; i < 12; i++) noise(0.02, 0.05, 2600, 4, i * 0.028); break
    }
  }
}

export const sounds = new SoundManager()
