import { useState } from 'react'
import { GamePlaza } from './components/GamePlaza'
import { SpotDifferenceGame } from './components/games/SpotDifferenceGame'
import { ColorMatchGame } from './components/games/ColorMatchGame'
import { StarTrackingGame } from './components/games/StarTrackingGame'
import { ShapeMatchGame } from './components/games/ShapeMatchGame'

export type GameType = 'plaza' | 'spot-difference' | 'color-match' | 'star-tracking' | 'shape-match'

function App() {
  const [currentGame, setCurrentGame] = useState<GameType>('plaza')

  const handleBackToPlaza = () => setCurrentGame('plaza')

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {currentGame === 'plaza' && (
        <GamePlaza onSelectGame={setCurrentGame} />
      )}
      {currentGame === 'spot-difference' && (
        <SpotDifferenceGame onBack={handleBackToPlaza} />
      )}
      {currentGame === 'color-match' && (
        <ColorMatchGame onBack={handleBackToPlaza} />
      )}
      {currentGame === 'star-tracking' && (
        <StarTrackingGame onBack={handleBackToPlaza} />
      )}
      {currentGame === 'shape-match' && (
        <ShapeMatchGame onBack={handleBackToPlaza} />
      )}
    </div>
  )
}

export default App
