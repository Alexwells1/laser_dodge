import { useEffect, useRef } from 'react'

export function useGameLoop(callback: (deltaTime: number) => void, running: boolean) {
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }

    lastTimeRef.current = performance.now()

    const loop = (time: number) => {
      const deltaTime = Math.min((time - lastTimeRef.current) / 1000, 0.05) // cap at 50ms
      lastTimeRef.current = time
      callbackRef.current(deltaTime)
      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [running])
}
