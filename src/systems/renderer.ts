import { GameLoopState } from './types'
import { ARENA_SIZE, PLAYER_RADIUS } from './constants'

export function renderFrame(
  ctx: CanvasRenderingContext2D,
  state: GameLoopState,
  ts: number,
  boss: boolean
) {
  const { player, lasers, particles, heat, scoreFloaters } = state

  // ── Background ──────────────────────────────────────────────────────────
  ctx.fillStyle = '#04060e'
  ctx.fillRect(0, 0, ARENA_SIZE, ARENA_SIZE)

  // Grid
  ctx.save()
  ctx.strokeStyle = boss ? 'rgba(255,0,255,0.05)' : 'rgba(0,255,255,0.05)'
  ctx.lineWidth = 0.5
  const gridOff = (ts / 20) % 40
  for (let i = -40; i <= ARENA_SIZE + 40; i += 40) {
    ctx.beginPath(); ctx.moveTo(i + gridOff, 0); ctx.lineTo(i + gridOff, ARENA_SIZE); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(0, i + gridOff); ctx.lineTo(ARENA_SIZE, i + gridOff); ctx.stroke()
  }
  ctx.restore()

  // Boss dark overlay
  if (boss) {
    ctx.fillStyle = 'rgba(60,0,60,0.18)'
    ctx.fillRect(0, 0, ARENA_SIZE, ARENA_SIZE)
  }

  // ── Lasers ──────────────────────────────────────────────────────────────
  for (const l of lasers) {
    ctx.save()
    const flicker = l.state === 'warning' ? 0.3 + 0.25 * Math.sin(ts / 75) : 1

    if (l.dir === 'h') {
      const y = l.cross
      if (l.state === 'warning') {
        ctx.strokeStyle = `rgba(255,60,60,${flicker})`
        ctx.lineWidth = 1.5
        ctx.setLineDash([10, 7])
        ctx.shadowColor = '#f00'
        ctx.shadowBlur = 4
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ARENA_SIZE, y); ctx.stroke()
      } else {
        // Core beam
        const grd = ctx.createLinearGradient(0, y - l.thickness, 0, y + l.thickness)
        grd.addColorStop(0, 'rgba(255,120,30,0)')
        grd.addColorStop(0.5, 'rgba(255,120,30,1)')
        grd.addColorStop(1, 'rgba(255,120,30,0)')
        ctx.fillStyle = grd
        ctx.shadowColor = '#f80'
        ctx.shadowBlur = 18
        ctx.fillRect(0, y - l.thickness / 2, ARENA_SIZE, l.thickness)
        // Hot center
        ctx.fillStyle = 'rgba(255,230,180,0.9)'
        ctx.fillRect(0, y - 1, ARENA_SIZE, 2)
      }
    } else if (l.dir === 'v') {
      const x = l.cross
      if (l.state === 'warning') {
        ctx.strokeStyle = `rgba(255,60,60,${flicker})`
        ctx.lineWidth = 1.5
        ctx.setLineDash([10, 7])
        ctx.shadowColor = '#f00'
        ctx.shadowBlur = 4
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ARENA_SIZE); ctx.stroke()
      } else {
        const grd = ctx.createLinearGradient(x - l.thickness, 0, x + l.thickness, 0)
        grd.addColorStop(0, 'rgba(255,120,30,0)')
        grd.addColorStop(0.5, 'rgba(255,120,30,1)')
        grd.addColorStop(1, 'rgba(255,120,30,0)')
        ctx.fillStyle = grd
        ctx.shadowColor = '#f80'
        ctx.shadowBlur = 18
        ctx.fillRect(x - l.thickness / 2, 0, l.thickness, ARENA_SIZE)
        ctx.fillStyle = 'rgba(255,230,180,0.9)'
        ctx.fillRect(x - 1, 0, 2, ARENA_SIZE)
      }
    } else {
      // Diagonal
      const slope = (l.angle || 35) > 0 ? 0.7 : -0.7
      const y0 = l.cross
      const y1 = l.cross + ARENA_SIZE * slope

      if (l.state === 'warning') {
        ctx.strokeStyle = `rgba(255,60,255,${flicker})`
        ctx.lineWidth = 2
        ctx.setLineDash([10, 7])
        ctx.shadowColor = '#f0f'
        ctx.shadowBlur = 4
      } else {
        ctx.strokeStyle = '#ff60ff'
        ctx.lineWidth = l.thickness
        ctx.shadowColor = '#f0f'
        ctx.shadowBlur = 20
      }
      ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(ARENA_SIZE, y1); ctx.stroke()
    }
    ctx.restore()
  }

  // ── Particles ────────────────────────────────────────────────────────────
  for (const p of particles) {
    ctx.save()
    ctx.globalAlpha = Math.max(0, p.life)
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 10
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * Math.max(0, p.life), 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }

  // ── Score Floaters ────────────────────────────────────────────────────────
  for (const sf of scoreFloaters) {
    const alpha = Math.max(0, 1 - sf.age / 1.2)
    ctx.save()
    ctx.globalAlpha = alpha
    ctx.fillStyle = '#ff0'
    ctx.shadowColor = '#ff0'
    ctx.shadowBlur = 8
    ctx.font = 'bold 13px "Share Tech Mono", monospace'
    ctx.textAlign = 'center'
    ctx.fillText(`+${sf.value}`, sf.x, sf.y - sf.age * 30)
    ctx.restore()
  }

  // ── Player ────────────────────────────────────────────────────────────────
  const heatR = heat / 100
  const glowH = Math.max(0, 200 - heatR * 200)
  const glowColor = `hsl(${glowH}, 100%, 60%)`
  const pulse = 1 + 0.05 * Math.sin(ts / (220 - heatR * 160))

  ctx.save()
  ctx.translate(player.x, player.y)
  ctx.scale(pulse, pulse)

  // Outer glow halo
  const halo = ctx.createRadialGradient(0, 0, PLAYER_RADIUS * 0.5, 0, 0, PLAYER_RADIUS * 3)
  halo.addColorStop(0, glowColor.replace('60%)', '60%, 0.25)').replace('hsl(', 'hsla('))
  halo.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = halo
  ctx.beginPath(); ctx.arc(0, 0, PLAYER_RADIUS * 3, 0, Math.PI * 2); ctx.fill()

  // Outer ring
  ctx.beginPath(); ctx.arc(0, 0, PLAYER_RADIUS, 0, Math.PI * 2)
  ctx.strokeStyle = glowColor
  ctx.lineWidth = 2.5
  ctx.shadowColor = glowColor
  ctx.shadowBlur = 18
  ctx.stroke()

  // Inner fill
  const innerGrd = ctx.createRadialGradient(0, 0, 0, 0, 0, PLAYER_RADIUS - 2)
  innerGrd.addColorStop(0, 'rgba(255,255,255,0.97)')
  innerGrd.addColorStop(0.6, glowColor.replace('60%)', '70%)'))
  innerGrd.addColorStop(1, glowColor.replace('60%)', '40%)'))
  ctx.fillStyle = innerGrd
  ctx.beginPath(); ctx.arc(0, 0, PLAYER_RADIUS - 2, 0, Math.PI * 2); ctx.fill()

  ctx.restore()

  // ── Overheat Flash ────────────────────────────────────────────────────────
  if (state.flashTime > 0) {
    ctx.fillStyle = `rgba(255,40,0,${state.flashTime * 0.5})`
    ctx.fillRect(0, 0, ARENA_SIZE, ARENA_SIZE)
  }
}
