import { GameMode } from '../systems/types'

interface Props {
  mode: GameMode
  onToggle: () => void
}

export default function ModeToggle({ mode, onToggle }: Props) {
  return (
    <div
      className="flex items-center gap-3 rounded-lg px-4 py-2 cursor-pointer select-none"
      style={{ background: '#111', border: '1px solid rgba(0,255,255,0.25)' }}
      onClick={onToggle}
    >
      <span
        className="text-xs tracking-widest transition-all duration-200"
        style={{ color: mode === 'normal' ? '#0ff' : 'rgba(255,255,255,0.3)', textShadow: mode === 'normal' ? '0 0 8px #0ff' : 'none' }}
      >
        NORMAL
      </span>
      <div
        className="relative rounded-full transition-all duration-300"
        style={{
          width: 44,
          height: 22,
          background: mode === 'chaos' ? 'rgba(255,0,255,0.2)' : 'rgba(0,255,255,0.2)',
          border: `1px solid ${mode === 'chaos' ? '#f0f' : '#0ff'}`,
        }}
      >
        <div
          className="absolute top-0.5 rounded-full transition-all duration-300"
          style={{
            width: 16,
            height: 16,
            left: mode === 'chaos' ? 24 : 2,
            background: mode === 'chaos' ? '#f0f' : '#0ff',
            boxShadow: `0 0 8px ${mode === 'chaos' ? '#f0f' : '#0ff'}`,
          }}
        />
      </div>
      <span
        className="text-xs tracking-widest transition-all duration-200"
        style={{ color: mode === 'chaos' ? '#f0f' : 'rgba(255,255,255,0.3)', textShadow: mode === 'chaos' ? '0 0 8px #f0f' : 'none' }}
      >
        CHAOS
      </span>
    </div>
  )
}
