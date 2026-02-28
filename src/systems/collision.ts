import { Laser, Particle } from './types'
import { ARENA_SIZE, PLAYER_RADIUS } from './constants'
import { circleRectOverlap, rnd } from './utils'
import { freshId } from './laserSpawner'

function laserRect(l: Laser): { x: number; y: number; w: number; h: number } {
  const t = l.thickness
  if (l.dir === 'h') return { x: 0, y: l.cross - t / 2, w: ARENA_SIZE, h: t }
  if (l.dir === 'v') return { x: l.cross - t / 2, y: 0, w: t, h: ARENA_SIZE }
  // diagonal — use a wide band
  return { x: 0, y: l.cross - t * 1.5, w: ARENA_SIZE, h: t * 3 }
}

export function laserDistance(l: Laser, px: number, py: number): number {
  const r = laserRect(l)
  const nearX = Math.max(r.x, Math.min(px, r.x + r.w))
  const nearY = Math.max(r.y, Math.min(py, r.y + r.h))
  return Math.sqrt((px - nearX) ** 2 + (py - nearY) ** 2)
}

export function checkCollision(l: Laser, px: number, py: number): boolean {
  if (l.state !== 'active') return false
  const r = laserRect(l)
  return circleRectOverlap(px, py, PLAYER_RADIUS, r.x, r.y, r.w, r.h)
}

export function spawnParticles(
  x: number, y: number, count: number, color: string, speed = 180
): Particle[] {
  return Array.from({ length: count }, () => ({
    id: freshId(),
    x,
    y,
    vx: rnd(-speed, speed),
    vy: rnd(-speed, speed),
    life: 1,
    maxLife: rnd(0.35, 0.9),
    size: rnd(2, 7),
    color,
  }))
}
