import { Laser, LaserDir } from './types'
import { ARENA_SIZE } from './constants'
import { rnd } from './utils'

let nextId = 1

export function freshId() {
  return nextId++
}

export function createLaser(chaos: boolean, overrides: Partial<Laser> = {}): Laser {
  const dirs: LaserDir[] = chaos ? ['h', 'v', 'h', 'v', 'd'] : ['h', 'v']
  const dir: LaserDir = dirs[Math.floor(Math.random() * dirs.length)]
  const cross = rnd(50, ARENA_SIZE - 50)
  const fromStart = Math.random() < 0.5
  const speed = rnd(chaos ? 110 : 75, chaos ? 270 : 160)
  const thickness = chaos ? rnd(3, 14) : rnd(4, 11)

  return {
    id: freshId(),
    dir,
    cross,
    pos: fromStart ? -30 : ARENA_SIZE + 30,
    speed: fromStart ? speed : -speed,
    thickness,
    state: 'warning',
    age: 0,
    angle: dir === 'd' ? (Math.random() < 0.5 ? 35 : -35) : 0,
    ...overrides,
  }
}

export function bossPattern(type: 'cross' | 'box' | 'sweep'): Laser[] {
  const base = { state: 'warning' as const, age: 0 }

  if (type === 'cross') {
    return [
      { id: freshId(), dir: 'h', cross: ARENA_SIZE / 2, pos: -30, speed: 160, thickness: 10, ...base },
      { id: freshId(), dir: 'v', cross: ARENA_SIZE / 2, pos: -30, speed: 160, thickness: 10, ...base },
      { id: freshId(), dir: 'h', cross: ARENA_SIZE / 2 - 60, pos: ARENA_SIZE + 30, speed: -140, thickness: 7, ...base },
      { id: freshId(), dir: 'v', cross: ARENA_SIZE / 2 - 60, pos: ARENA_SIZE + 30, speed: -140, thickness: 7, ...base },
    ]
  }

  if (type === 'box') {
    return [
      { id: freshId(), dir: 'h', cross: 130, pos: -30, speed: 140, thickness: 8, ...base },
      { id: freshId(), dir: 'h', cross: 390, pos: ARENA_SIZE + 30, speed: -140, thickness: 8, ...base },
      { id: freshId(), dir: 'v', cross: 130, pos: -30, speed: 140, thickness: 8, ...base },
      { id: freshId(), dir: 'v', cross: 390, pos: ARENA_SIZE + 30, speed: -140, thickness: 8, ...base },
    ]
  }

  // sweep
  return [
    { id: freshId(), dir: 'h', cross: 100, pos: -30, speed: 220, thickness: 7, ...base },
    { id: freshId(), dir: 'h', cross: 260, pos: ARENA_SIZE + 30, speed: -200, thickness: 7, ...base },
    { id: freshId(), dir: 'h', cross: 420, pos: -30, speed: 180, thickness: 7, ...base },
    { id: freshId(), dir: 'v', cross: 260, pos: -30, speed: 190, thickness: 9, ...base },
  ]
}
