interface Props {
  x: number
  y: number
  radius: number
  heat: number
  alive: boolean
}

export default function Player({ x, y, radius, heat, alive }: Props) {
  if (!alive) return null

  // Heat color: 0=cyan, 50=orange, 100=red
  const getGlowColor = () => {
    if (heat < 30) return '#00ffff'
    if (heat < 60) {
      const t = (heat - 30) / 30
      const r = Math.floor(0 + t * 255)
      const g = Math.floor(255 - t * 100)
      return `rgb(${r}, ${g}, 0)`
    }
    const t = (heat - 60) / 40
    return `rgb(255, ${Math.floor(155 - t * 155)}, 0)`
  }

  const color = getGlowColor()
  const pulseSpeed = heat < 50 ? 2 : heat < 80 ? 1 : 0.5
  const glowSize = 10 + heat * 0.5

  return (
    <div
      style={{
        position: 'absolute',
        left: x - radius,
        top: y - radius,
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        background: `radial-gradient(circle, #ffffff 30%, ${color}88 70%, transparent 100%)`,
        boxShadow: `0 0 ${glowSize}px ${color}, 0 0 ${glowSize * 2}px ${color}88, 0 0 ${glowSize * 4}px ${color}44`,
        animation: `pulse-glow ${pulseSpeed}s ease-in-out infinite`,
        zIndex: 10,
        pointerEvents: 'none',
      }}
    />
  )
}
