

interface Props {
  laser: any
  arenaSize: number
}

export default function LaserComponent({ laser, arenaSize }: Props) {
  const { direction, offset, thickness, state } = laser

  const isWarning = state === 'warning'
  const color = isWarning ? 'rgba(255,50,50,0.5)' : '#ff3333'
  const glow = isWarning ? 'none' : `0 0 ${thickness * 2}px #ff3333, 0 0 ${thickness * 4}px rgba(255,0,0,0.5)`
  const opacity = isWarning ? undefined : 1

  const getStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      background: color,
      boxShadow: glow,
      opacity,
      animation: isWarning ? 'laser-warn 0.3s ease-in-out infinite' : undefined,
      zIndex: 5,
      pointerEvents: 'none',
    }

    if (direction === 'horizontal') {
      return {
        ...base,
        left: 0, right: 0,
        height: thickness,
        top: offset - thickness / 2,
      }
    }

    if (direction === 'vertical') {
      return {
        ...base,
        top: 0, bottom: 0,
        width: thickness,
        left: offset - thickness / 2,
      }
    }

    if (direction === 'diagonal-lr' || direction === 'diagonal-rl') {
      const diag = Math.sqrt(arenaSize * arenaSize * 2)
      const angle = direction === 'diagonal-lr' ? 45 : -45
      return {
        ...base,
        width: diag,
        height: thickness,
        left: direction === 'diagonal-lr' ? offset - diag / 2 + arenaSize / 2 : -diag / 2 + arenaSize / 2 - offset + arenaSize,
        top: arenaSize / 2 - thickness / 2,
        transformOrigin: 'center',
        transform: `rotate(${angle}deg)`,
      }
    }

    return base
  }

  return <div style={getStyle()} />
}
