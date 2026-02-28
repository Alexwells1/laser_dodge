import { useRef, useEffect, useCallback, useState } from 'react'
import { GameMode, GameLoopState } from '../systems/types'
import { ARENA_SIZE, PLAYER_RADIUS, LASER_WARNING_DURATION, BOSS_INTERVAL, BOSS_DURATION, HEAT_PROXIMITY, HEAT_RATE, HEAT_COOLDOWN, SCORE_PER_SEC, MULTIPLIER_SAFE_TIME, MULTIPLIER_HEAT_THRESHOLD } from '../systems/constants'
import { clamp, rnd } from '../systems/utils'
import { createLaser, bossPattern } from '../systems/laserSpawner'
import { checkCollision, laserDistance, spawnParticles } from '../systems/collision'
import { renderFrame } from '../systems/renderer'
import { playLaserZap, playExplosion, playNearMiss, playBossStart, startHum, stopHum } from '../systems/sound'
import ScoreBoard from './ScoreBoard'
import HeatMeter from './HeatMeter'
import BossOverlay from './BossOverlay'
import ArenaRotationWrapper from './ArenaRotationWrapper'

interface Props {
  mode: GameMode
  onGameOver: (score: number) => void
}

interface UIState {
  score: number
  heat: number
  multiplier: number
  boss: boolean
  bossCountdown: number
  shaking: boolean
  arenaAngle: number
}

const SPAWN_INTERVAL = { normal: 1550, chaos: 900 }

export default function Arena({ mode, onGameOver }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const arenaRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<GameLoopState | null>(null)
  const animRef = useRef<number>(0)
  const [ui, setUi] = useState<UIState>({ score: 0, heat: 0, multiplier: 1, boss: false, bossCountdown: 0, shaking: false, arenaAngle: 0 })
  const prevBoss = useRef(false)
  const nearMissCooldown = useRef(0)

  const endGame = useCallback(() => {
    const s = stateRef.current
    if (!s) return
    s.player.alive = false
    cancelAnimationFrame(animRef.current)
    stopHum()
    playExplosion()
    onGameOver(Math.floor(s.score))
  }, [onGameOver])

  useEffect(() => {
    const initialState: GameLoopState = {
      player: { x: ARENA_SIZE / 2, y: ARENA_SIZE / 2, alive: true },
      lasers: [],
      particles: [],
      keys: {},
      heat: 0,
      score: 0,
      multiplier: 1,
      safeTime: 0,
      spawnTimer: 0,
      bossTimer: 0,
      bossActive: false,
      bossCountdown: 0,
      shakeTime: 0,
      arenaAngle: 0,
      lastTime: null,
      pointer: null,
      nearMissStreak: 0,
      flashTime: 0,
      scoreFloaters: [],
    }
    stateRef.current = initialState
    startHum()

    const onKey = (e: KeyboardEvent, down: boolean) => {
      if (stateRef.current) stateRef.current.keys[e.key] = down
    }
    window.addEventListener('keydown', e => onKey(e, true))
    window.addEventListener('keyup', e => onKey(e, false))

    const arena = arenaRef.current!
    const getPointerPos = (e: PointerEvent) => {
      const rect = arena.getBoundingClientRect()
      const scale = ARENA_SIZE / rect.width
      return {
        x: clamp((e.clientX - rect.left) * scale, PLAYER_RADIUS, ARENA_SIZE - PLAYER_RADIUS),
        y: clamp((e.clientY - rect.top) * scale, PLAYER_RADIUS, ARENA_SIZE - PLAYER_RADIUS),
      }
    }
    const onPD = (e: PointerEvent) => { if (stateRef.current) stateRef.current.pointer = getPointerPos(e) }
    const onPM = (e: PointerEvent) => { if (stateRef.current?.pointer) stateRef.current.pointer = getPointerPos(e) }
    const onPU = () => { if (stateRef.current) stateRef.current.pointer = null }
    arena.addEventListener('pointerdown', onPD)
    arena.addEventListener('pointermove', onPM)
    arena.addEventListener('pointerup', onPU)
    arena.addEventListener('pointerleave', onPU)

    const spawnMs = SPAWN_INTERVAL[mode]

    function frame(ts: number) {
      const s = stateRef.current
      if (!s || !s.player.alive) return

      if (!s.lastTime) s.lastTime = ts
      const dt = Math.min((ts - s.lastTime) / 1000, 0.05)
      s.lastTime = ts

      // ── Player movement ──────────────────────────────────────────────────
      const SPEED = 225
      const { player, keys } = s
      if (s.pointer) {
        const dx = s.pointer.x - player.x
        const dy = s.pointer.y - player.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist > 2) {
          player.x += (dx / dist) * Math.min(dist, SPEED * dt)
          player.y += (dy / dist) * Math.min(dist, SPEED * dt)
        }
      } else {
        if (keys['ArrowLeft'] || keys['a']) player.x -= SPEED * dt
        if (keys['ArrowRight'] || keys['d']) player.x += SPEED * dt
        if (keys['ArrowUp'] || keys['w']) player.y -= SPEED * dt
        if (keys['ArrowDown'] || keys['s']) player.y += SPEED * dt
      }
      player.x = clamp(player.x, PLAYER_RADIUS, ARENA_SIZE - PLAYER_RADIUS)
      player.y = clamp(player.y, PLAYER_RADIUS, ARENA_SIZE - PLAYER_RADIUS)

      // ── Arena rotation (chaos) ─────────────────────────────────────────
      if (mode === 'chaos') {
        s.arenaAngle = Math.sin(ts / 4200) * 8
      }

      // ── Score ─────────────────────────────────────────────────────────────
      s.score += SCORE_PER_SEC * s.multiplier * dt
      s.safeTime += dt

      if (s.safeTime >= MULTIPLIER_SAFE_TIME && s.heat < MULTIPLIER_HEAT_THRESHOLD) {
        s.multiplier = 2
      } else if (s.heat > 55) {
        s.multiplier = 1
        s.safeTime = 0
      }

      // ── Laser spawn ───────────────────────────────────────────────────────
      s.spawnTimer += dt * 1000
      if (s.spawnTimer >= spawnMs) {
        s.spawnTimer -= spawnMs
        s.lasers.push(createLaser(mode === 'chaos'))
        if (mode === 'chaos' && Math.random() < 0.18) {
          s.lasers.push(createLaser(true))
        }
        playLaserZap()
      }

      // ── Boss timer ────────────────────────────────────────────────────────
      s.bossTimer += dt * 1000
      if (s.bossTimer >= BOSS_INTERVAL && !s.bossActive) {
        s.bossActive = true
        s.bossCountdown = BOSS_DURATION / 1000
        const types: Array<'cross' | 'box' | 'sweep'> = ['cross', 'box', 'sweep']
        const t = types[Math.floor(Math.random() * types.length)]
        s.lasers.push(...bossPattern(t))
        playBossStart()
      }
      if (s.bossActive) {
        s.bossCountdown -= dt
        if (s.bossCountdown <= 0) {
          s.bossActive = false
          s.bossTimer = 0
          const bonus = Math.round(300 * s.multiplier)
          s.score += bonus
          s.scoreFloaters.push({ id: Date.now(), x: player.x, y: player.y - 20, value: bonus, age: 0 })
        }
      }

      // ── Update lasers ─────────────────────────────────────────────────────
      s.lasers = s.lasers
        .map(l => {
          const nl = { ...l, age: l.age + dt * 1000 }
          if (nl.state === 'warning' && nl.age >= LASER_WARNING_DURATION) nl.state = 'active'
          nl.pos += nl.speed * dt
          return nl
        })
        .filter(l => {
          if (l.dir === 'h' || l.dir === 'v') return l.pos > -80 && l.pos < ARENA_SIZE + 80
          return l.age < 4000
        })

      // ── Collision + heat ──────────────────────────────────────────────────
      let minDist = Infinity
      let directHit = false
      nearMissCooldown.current = Math.max(0, nearMissCooldown.current - dt)

      for (const l of s.lasers) {
        if (l.state !== 'active') continue
        const d = laserDistance(l, player.x, player.y)
        if (d < minDist) minDist = d
        if (checkCollision(l, player.x, player.y)) { directHit = true; break }
      }

      if (directHit) {
        s.heat += HEAT_RATE * 3.5 * dt
        s.shakeTime = 0.22
        s.flashTime = Math.min(1, s.flashTime + dt * 4)
        if (s.particles.length < 80) {
          s.particles.push(...spawnParticles(player.x, player.y, 5, '#ff8800'))
        }
      } else if (minDist < HEAT_PROXIMITY) {
        s.heat += HEAT_RATE * (1 - minDist / HEAT_PROXIMITY) * dt
        // Near miss spark + bonus
        if (minDist < 16 && nearMissCooldown.current <= 0) {
          nearMissCooldown.current = 0.3
          const bonus = Math.round(8 * s.multiplier)
          s.score += bonus
          s.scoreFloaters.push({ id: Date.now() + Math.random(), x: player.x, y: player.y - 15, value: bonus, age: 0 })
          s.particles.push(...spawnParticles(player.x, player.y, 4, '#00ffff', 120))
          playNearMiss()
        }
      } else {
        s.heat = Math.max(0, s.heat - HEAT_COOLDOWN * dt)
        s.flashTime = Math.max(0, s.flashTime - dt * 2)
      }

      if (s.heat >= 100) {
        s.particles.push(...spawnParticles(player.x, player.y, 35, '#ff2200', 250))
        s.particles.push(...spawnParticles(player.x, player.y, 20, '#ff8800', 180))
        s.particles.push(...spawnParticles(player.x, player.y, 15, '#ffff00', 140))
        endGame()
        return
      }

      s.shakeTime = Math.max(0, s.shakeTime - dt)

      // ── Update particles ──────────────────────────────────────────────────
      s.particles = s.particles
        .map(p => ({
          ...p,
          x: p.x + p.vx * dt,
          y: p.y + p.vy * dt,
          vy: p.vy + 120 * dt,
          life: p.life - dt / p.maxLife,
        }))
        .filter(p => p.life > 0)

      // ── Update score floaters ─────────────────────────────────────────────
      s.scoreFloaters = s.scoreFloaters
        .map(f => ({ ...f, age: f.age + dt }))
        .filter(f => f.age < 1.2)

      // ── Render ────────────────────────────────────────────────────────────
      const canvas = canvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')!
        renderFrame(ctx, s, ts, s.bossActive)
      }

      // ── Update UI (throttled) ─────────────────────────────────────────────
      setUi({
        score: Math.floor(s.score),
        heat: s.heat,
        multiplier: s.multiplier,
        boss: s.bossActive,
        bossCountdown: Math.ceil(s.bossCountdown),
        shaking: s.shakeTime > 0,
        arenaAngle: s.arenaAngle,
      })

      if (!prevBoss.current && s.bossActive) prevBoss.current = true
      if (prevBoss.current && !s.bossActive) prevBoss.current = false

      animRef.current = requestAnimationFrame(frame)
    }

    animRef.current = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(animRef.current)
      stopHum()
      window.removeEventListener('keydown', e => onKey(e, true))
      window.removeEventListener('keyup', e => onKey(e, false))
      arena.removeEventListener('pointerdown', onPD)
      arena.removeEventListener('pointermove', onPM)
      arena.removeEventListener('pointerup', onPU)
      arena.removeEventListener('pointerleave', onPU)
    }
  }, [mode, endGame])

  const canvasSize = Math.min(520, typeof window !== 'undefined' ? window.innerWidth - 32 : 520)

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      {/* HUD */}
      <div
        className="flex items-center justify-between w-full px-1"
        style={{ maxWidth: canvasSize }}
      >
        <ScoreBoard score={ui.score} multiplier={ui.multiplier} mode={mode} />
        <HeatMeter heat={ui.heat} />
      </div>

      {/* Arena */}
      <ArenaRotationWrapper angle={ui.arenaAngle}>
        <div
          ref={arenaRef}
          className="relative rounded overflow-hidden"
          style={{
            border: `1px solid ${ui.boss ? 'rgba(255,0,255,0.5)' : 'rgba(0,255,255,0.3)'}`,
            boxShadow: ui.boss
              ? '0 0 40px rgba(255,0,255,0.2), 0 0 80px rgba(255,0,255,0.08)'
              : '0 0 20px rgba(0,255,255,0.12)',
            transform: ui.shaking
              ? `translate(${rnd(-4, 4)}px, ${rnd(-4, 4)}px)`
              : 'translate(0,0)',
            transition: ui.shaking ? 'none' : 'transform 0.12s ease-out, box-shadow 0.3s',
            cursor: 'none',
            touchAction: 'none',
          }}
        >
          <canvas
            ref={canvasRef}
            width={ARENA_SIZE}
            height={ARENA_SIZE}
            style={{
              display: 'block',
              width: canvasSize,
              height: canvasSize,
            }}
          />
          {ui.boss && <BossOverlay countdown={ui.bossCountdown} />}
        </div>
      </ArenaRotationWrapper>
    </div>
  )
}
