import { useEffect, useRef, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
  color: string
}

interface Props {
  trigger: { x: number; y: number; type: 'explode' | 'spark' } | null
}

let pid = 0

export default function ParticleSystem({ trigger }: Props) {
  const [particles, setParticles] = useState<Particle[]>([])
  const rafRef = useRef<number>(0)
  const lastRef = useRef(performance.now())

  useEffect(() => {
    if (!trigger) return

    const count = trigger.type === 'explode' ? 40 : 8
    const newParticles: Particle[] = Array.from({ length: count }, () => {
      const angle = Math.random() * Math.PI * 2
      const speed = trigger.type === 'explode'
        ? 80 + Math.random() * 150
        : 40 + Math.random() * 80
      const colors = trigger.type === 'explode'
        ? ['#ff3333', '#ff6600', '#ffaa00', '#ffffff', '#ff00ff']
        : ['#00ffff', '#ffffff', '#ffff00']
      return {
        id: pid++,
        x: trigger.x,
        y: trigger.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: trigger.type === 'explode' ? 1.2 : 0.6,
        maxLife: trigger.type === 'explode' ? 1.2 : 0.6,
        size: trigger.type === 'explode' ? 4 + Math.random() * 8 : 2 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)]
      }
    })

    setParticles(p => [...p, ...newParticles])
  }, [trigger])

  useEffect(() => {
    const update = () => {
      const now = performance.now()
      const dt = Math.min((now - lastRef.current) / 1000, 0.05)
      lastRef.current = now

      setParticles(ps => {
        if (ps.length === 0) return ps
        return ps
          .map(p => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            vy: p.vy + 200 * dt, // gravity
            life: p.life - dt
          }))
          .filter(p => p.life > 0)
      })

      rafRef.current = requestAnimationFrame(update)
    }
    rafRef.current = requestAnimationFrame(update)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 20, overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: p.x - p.size / 2,
            top: p.y - p.size / 2,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            opacity: p.life / p.maxLife,
          }}
        />
      ))}
    </div>
  )
}
