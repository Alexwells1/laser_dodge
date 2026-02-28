import { useState, useEffect } from 'react'

interface Props {
  onDone: () => void
}

export default function LoadingScreen({ onDone }: Props) {
  const [progress, setProgress] = useState(0)
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.random() * 3 + 0.8
        if (next >= 100) {
          clearInterval(interval)
          setTimeout(onDone, 300)
          return 100
        }
        return next
      })
    }, 35)

    const glitchInterval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 130)
    }, 1800)

    return () => {
      clearInterval(interval)
      clearInterval(glitchInterval)
    }
  }, [onDone])

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Animated grid */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'grid-move 2s linear infinite',
        }}
      />

      {/* Radial vignette */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #000 100%)' }} />

      {/* Scanline */}
      <div
        className="absolute left-0 right-0 h-px opacity-20"
        style={{ background: '#0ff', animation: 'scanline 4s linear infinite' }}
      />

      <div className="relative flex flex-col items-center gap-6">
        {/* Glitch title */}
        <div className="relative" style={{ fontFamily: "'Orbitron', monospace" }}>
          <div
            className="text-5xl font-black tracking-widest text-cyan-400"
            style={{ textShadow: '0 0 20px #0ff, 0 0 40px #0ff6' }}
          >
            LASER DODGE
          </div>
          {glitch && (
            <>
              <div
                className="absolute inset-0 text-5xl font-black tracking-widest text-fuchsia-400"
                style={{ transform: 'translateX(4px)', opacity: 0.7, mixBlendMode: 'screen', fontFamily: "'Orbitron', monospace" }}
              >
                LASER DODGE
              </div>
              <div
                className="absolute inset-0 text-5xl font-black tracking-widest text-green-400"
                style={{ transform: 'translateX(-4px) translateY(2px)', opacity: 0.5, mixBlendMode: 'screen', fontFamily: "'Orbitron', monospace" }}
              >
                LASER DODGE
              </div>
            </>
          )}
        </div>

        <div className="text-cyan-500 text-xs tracking-[0.5em] opacity-70 uppercase">
          Neon Survival Arena
        </div>

        {/* Loading bar */}
        <div className="w-64 flex flex-col gap-2">
          <div
            className="w-full h-1 rounded-sm overflow-hidden"
            style={{ background: '#111', border: '1px solid rgba(0,255,255,0.2)' }}
          >
            <div
              className="h-full rounded-sm transition-all duration-75"
              style={{
                width: `${Math.min(100, progress)}%`,
                background: 'linear-gradient(90deg, #0ff, #f0f)',
                boxShadow: '0 0 8px #0ff',
              }}
            />
          </div>
          <div className="text-center text-xs tracking-widest" style={{ color: 'rgba(0,255,255,0.5)' }}>
            LOADING... {Math.min(100, Math.floor(progress))}%
          </div>
        </div>
      </div>
    </div>
  )
}
