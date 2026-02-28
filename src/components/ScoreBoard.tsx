import { GameMode } from '../systems/types'

interface Props {
  score: number
  multiplier: number
  mode: GameMode
}

export default function ScoreBoard({ score, multiplier, mode }: Props) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[90px]">
      <div
        className="text-2xl font-bold tracking-wider"
        style={{ color: '#fff', textShadow: '0 0 10px #0ff6' }}
      >
        {score.toLocaleString()}
      </div>
      {multiplier > 1 && (
        <div
          className="text-xs tracking-widest font-bold"
          style={{ color: '#ff0', textShadow: '0 0 8px #ff0' }}
        >
          {multiplier}× STREAK
        </div>
      )}
      <div
        className="text-xs tracking-widest"
        style={{ color: mode === 'chaos' ? '#f0f6' : '#0ff5' }}
      >
        {mode.toUpperCase()}
      </div>
    </div>
  )
}
