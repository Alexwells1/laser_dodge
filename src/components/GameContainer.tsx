import { useState, useCallback } from 'react'
import { GameState, GameMode } from '../systems/types'
import LoadingScreen from './LoadingScreen'
import MenuScreen from './MenuScreen'
import Arena from './Arena'
import GameOverScreen from './GameOverScreen'

interface Props {
  highScore: number
  onUpdateHighScore: (score: number) => void
}

export default function GameContainer({ highScore, onUpdateHighScore }: Props) {
  const [gameState, setGameState] = useState<GameState>('loading')
  const [mode, setMode] = useState<GameMode>('normal')
  const [lastScore, setLastScore] = useState(0)
  const [gameKey, setGameKey] = useState(0)

  const handleGameOver = useCallback((score: number) => {
    setLastScore(score)
    onUpdateHighScore(score)
    setGameState('gameover')
  }, [onUpdateHighScore])

  const restart = useCallback(() => {
    setGameKey(k => k + 1)
    setGameState('playing')
  }, [])

  return (
    <>
      {gameState === 'loading' && (
        <LoadingScreen onDone={() => setGameState('menu')} />
      )}

      {gameState === 'menu' && (
        <MenuScreen
          highScore={highScore}
          mode={mode}
          onToggleMode={() => setMode(m => m === 'normal' ? 'chaos' : 'normal')}
          onStart={() => { setGameKey(k => k + 1); setGameState('playing') }}
        />
      )}

      {gameState === 'playing' && (
        <Arena key={gameKey} mode={mode} onGameOver={handleGameOver} />
      )}

      {gameState === 'gameover' && (
        <div className="relative">
          <GameOverScreen
            score={lastScore}
            highScore={highScore}
            mode={mode}
            onRestart={restart}
            onMenu={() => setGameState('menu')}
          />
        </div>
      )}
    </>
  )
}
