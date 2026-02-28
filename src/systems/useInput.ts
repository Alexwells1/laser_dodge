import { useEffect, useRef } from 'react'

export interface InputState {
  up: boolean
  down: boolean
  left: boolean
  right: boolean
  pointerActive: boolean
  pointerX: number
  pointerY: number
}

export function useInput(arenaRef: React.RefObject<HTMLDivElement | null>) {
  const inputRef = useRef<InputState>({
    up: false, down: false, left: false, right: false,
    pointerActive: false, pointerX: 0, pointerY: 0
  })

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') inputRef.current.up = true
      if (e.key === 'ArrowDown' || e.key === 's') inputRef.current.down = true
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = true
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = true
    }
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') inputRef.current.up = false
      if (e.key === 'ArrowDown' || e.key === 's') inputRef.current.down = false
      if (e.key === 'ArrowLeft' || e.key === 'a') inputRef.current.left = false
      if (e.key === 'ArrowRight' || e.key === 'd') inputRef.current.right = false
    }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const arena = arenaRef.current
    if (!arena) return

    const getArenaPos = (clientX: number, clientY: number) => {
      const rect = arena.getBoundingClientRect()
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      e.preventDefault()
      const pos = getArenaPos(e.clientX, e.clientY)
      inputRef.current.pointerActive = true
      inputRef.current.pointerX = pos.x
      inputRef.current.pointerY = pos.y
    }
    const onPointerMove = (e: PointerEvent) => {
      if (!inputRef.current.pointerActive) return
      const pos = getArenaPos(e.clientX, e.clientY)
      inputRef.current.pointerX = pos.x
      inputRef.current.pointerY = pos.y
    }
    const onPointerUp = () => {
      inputRef.current.pointerActive = false
    }

    arena.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)
    return () => {
      arena.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [arenaRef])

  return inputRef
}
