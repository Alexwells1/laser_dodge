// Procedural audio via Web Audio API
let ctx: AudioContext | null = null

function getCtx(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

export function playLaserZap() {
  try {
    const ac = getCtx()
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.connect(g)
    g.connect(ac.destination)
    o.type = 'sawtooth'
    o.frequency.setValueAtTime(800, ac.currentTime)
    o.frequency.exponentialRampToValueAtTime(200, ac.currentTime + 0.12)
    g.gain.setValueAtTime(0.08, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15)
    o.start()
    o.stop(ac.currentTime + 0.15)
  } catch {}
}

export function playExplosion() {
  try {
    const ac = getCtx()
    const buf = ac.createBuffer(1, ac.sampleRate * 0.6, ac.sampleRate)
    const data = buf.getChannelData(0)
    for (let i = 0; i < data.length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ac.sampleRate * 0.15))
    }
    const src = ac.createBufferSource()
    const g = ac.createGain()
    const f = ac.createBiquadFilter()
    f.type = 'lowpass'
    f.frequency.value = 400
    src.buffer = buf
    src.connect(f)
    f.connect(g)
    g.connect(ac.destination)
    g.gain.setValueAtTime(0.6, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6)
    src.start()
  } catch {}
}

export function playNearMiss() {
  try {
    const ac = getCtx()
    const o = ac.createOscillator()
    const g = ac.createGain()
    o.connect(g)
    g.connect(ac.destination)
    o.type = 'sine'
    o.frequency.setValueAtTime(1200, ac.currentTime)
    o.frequency.exponentialRampToValueAtTime(600, ac.currentTime + 0.08)
    g.gain.setValueAtTime(0.05, ac.currentTime)
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1)
    o.start()
    o.stop(ac.currentTime + 0.1)
  } catch {}
}

export function playBossStart() {
  try {
    const ac = getCtx()
    for (let i = 0; i < 3; i++) {
      const o = ac.createOscillator()
      const g = ac.createGain()
      o.connect(g)
      g.connect(ac.destination)
      o.type = 'square'
      o.frequency.setValueAtTime(220 - i * 30, ac.currentTime + i * 0.15)
      g.gain.setValueAtTime(0.06, ac.currentTime + i * 0.15)
      g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.15 + 0.2)
      o.start(ac.currentTime + i * 0.15)
      o.stop(ac.currentTime + i * 0.15 + 0.2)
    }
  } catch {}
}

// Ambient hum
let humNode: OscillatorNode | null = null
let humGain: GainNode | null = null

export function startHum() {
  try {
    const ac = getCtx()
    if (humNode) return
    humNode = ac.createOscillator()
    humGain = ac.createGain()
    humNode.connect(humGain)
    humGain.connect(ac.destination)
    humNode.type = 'sine'
    humNode.frequency.value = 60
    humGain.gain.value = 0.015
    humNode.start()
  } catch {}
}

export function stopHum() {
  try {
    if (humGain) humGain.gain.exponentialRampToValueAtTime(0.001, getCtx().currentTime + 0.5)
    setTimeout(() => {
      humNode?.stop()
      humNode = null
      humGain = null
    }, 600)
  } catch {}
}
