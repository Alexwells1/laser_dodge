import { useState } from 'react'
import { GameMode } from '../systems/types'
import ModeToggle from './ModeToggle'

interface Props {
  highScore: number
  mode: GameMode
  onToggleMode: () => void
  onStart: () => void
}

export default function MenuScreen({ highScore, mode, onToggleMode, onStart }: Props) {
  const [pressed, setPressed] = useState(false)

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center overflow-hidden">
      {/* Grid bg */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.07) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          animation: 'grid-move 3s linear infinite',
        }}
      />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,255,255,0.05) 0%, transparent 70%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, #000 100%)' }} />

      <div className="relative flex flex-col items-center gap-7">
        {/* Title */}
        <div className="flex flex-col items-center gap-1">
          <div
            className="text-6xl font-black tracking-widest text-cyan-400"
            style={{ fontFamily: "'Orbitron', monospace", textShadow: '0 0 30px #0ff, 0 0 60px #0ff5' }}
          >
            LASER DODGE
          </div>
          <div className="text-xs text-cyan-600 tracking-[0.6em] uppercase">Neon Survival Arena</div>
        </div>

        {/* High score */}
        {highScore > 0 && (
          <div className="text-center">
            <div className="text-xs tracking-widest text-white/40 mb-1">BEST SCORE</div>
            <div className="text-3xl font-bold tracking-wider" style={{ color: '#ff0', textShadow: '0 0 12px #ff0' }}>
              {highScore}
            </div>
          </div>
        )}

        {/* Mode toggle */}
        <ModeToggle mode={mode} onToggle={onToggleMode} />

        {mode === 'chaos' && (
          <div className="text-xs tracking-widest text-fuchsia-400 opacity-80">
            ⚡ FAST SPAWN · DIAGONAL · ARENA ROTATES
          </div>
        )}

        {/* Start button */}
        <button
          onMouseDown={() => setPressed(true)}
          onMouseUp={() => setPressed(false)}
          onMouseLeave={() => setPressed(false)}
          onClick={onStart}
          className="px-16 py-3 text-base tracking-[0.4em] font-bold rounded transition-all duration-100"
          style={{
            fontFamily: "'Orbitron', monospace",
            background: 'transparent',
            border: '2px solid #0ff',
            color: '#0ff',
            textShadow: '0 0 10px #0ff',
            boxShadow: pressed
              ? '0 0 10px #0ff4, inset 0 0 10px #0ff1'
              : '0 0 20px #0ff5, inset 0 0 20px #0ff1',
            transform: pressed ? 'scale(0.96)' : 'scale(1)',
            cursor: 'pointer',
          }}
        >
          START
        </button>

        <div className="text-xs text-white/25 tracking-widest">ARROW KEYS / DRAG TO MOVE</div>

        {/* Controls hint */}
        <div className="absolute -bottom-16 text-center">
          <div className="text-xs text-white/20 tracking-widest">SURVIVE · DODGE · REPEAT</div>
        </div>
      </div>
    </div>
  )
}
