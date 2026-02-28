export type GameMode = 'normal' | 'chaos'
export type GameState = 'loading' | 'menu' | 'playing' | 'boss' | 'gameover'
export type LaserDir = 'h' | 'v' | 'd'
export type LaserState = 'warning' | 'active'

export interface Laser {
  id: number
  dir: LaserDir
  cross: number      // perpendicular position (y for h, x for v)
  pos: number        // parallel sweep position
  speed: number      // px/s, negative = reverse direction
  thickness: number
  state: LaserState
  age: number        // ms since spawn
  angle?: number     // for diagonal
}

export interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number       // 0→1, decreasing
  maxLife: number
  size: number
  color: string
}

export interface PlayerState {
  x: number
  y: number
  alive: boolean
}

export interface GameLoopState {
  player: PlayerState
  lasers: Laser[]
  particles: Particle[]
  keys: Record<string, boolean>
  heat: number
  score: number
  multiplier: number
  safeTime: number
  spawnTimer: number
  bossTimer: number
  bossActive: boolean
  bossCountdown: number
  shakeTime: number
  arenaAngle: number
  lastTime: number | null
  pointer: { x: number; y: number } | null
  nearMissStreak: number
  flashTime: number
  scoreFloaters: ScoreFloater[]
}

export interface ScoreFloater {
  id: number
  x: number
  y: number
  value: number
  age: number
}
