import { useState, useEffect } from 'react'
import GameContainer from './components/GameContainer'

export default function App() {
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('ld_highscore') || '0', 10)
  })

  const updateHighScore = (score: number) => {
    if (score > highScore) {
      setHighScore(score)
      localStorage.setItem('ld_highscore', String(score))
    }
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
      <GameContainer highScore={highScore} onUpdateHighScore={updateHighScore} />
    </div>
  )
}
