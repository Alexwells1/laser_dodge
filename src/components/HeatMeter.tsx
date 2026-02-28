interface Props {
  heat: number
}

export default function HeatMeter({ heat }: Props) {
  const heatH = Math.max(0, 200 - heat * 2)
  const color = `hsl(${heatH}, 100%, 60%)`
  const isHigh = heat > 85

  return (
    <div className="flex flex-col items-end gap-1 min-w-[110px]">
      <div
        className="text-xs tracking-widest"
        style={{ color, textShadow: isHigh ? `0 0 8px ${color}` : 'none' }}
      >
        HEAT {Math.floor(heat)}%
      </div>
      <div
        className={`w-28 h-1.5 rounded overflow-hidden ${isHigh ? 'heat-shake' : ''}`}
        style={{ background: '#0f0f1a', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        <div
          className="h-full rounded transition-all duration-100"
          style={{
            width: `${heat}%`,
            background: `linear-gradient(90deg, #0af, ${color})`,
            boxShadow: heat > 70 ? `0 0 10px ${color}` : 'none',
          }}
        />
      </div>
    </div>
  )
}
