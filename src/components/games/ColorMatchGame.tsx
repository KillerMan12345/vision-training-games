import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react'

interface ColorMatchGameProps {
  onBack: () => void
}

const colors = [
  { name: 'red', bg: 'bg-game-red', label: '红色' },
  { name: 'blue', bg: 'bg-game-blue', label: '蓝色' },
  { name: 'green', bg: 'bg-game-green', label: '绿色' },
  { name: 'yellow', bg: 'bg-game-yellow', label: '黄色' },
  { name: 'purple', bg: 'bg-game-purple', label: '紫色' },
  { name: 'pink', bg: 'bg-game-pink', label: '粉色' },
  { name: 'orange', bg: 'bg-game-orange', label: '橙色' },
  { name: 'cyan', bg: 'bg-game-cyan', label: '青色' },
]

interface Card {
  id: number
  color: typeof colors[0]
  isFlipped: boolean
  isMatched: boolean
}

export function ColorMatchGame({ onBack }: ColorMatchGameProps) {
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [moves, setMoves] = useState(0)
  const [isChecking, setIsChecking] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [level, setLevel] = useState(1)

  // 初始化游戏
  const initGame = useCallback((gridSize: number) => {
    const pairCount = (gridSize * gridSize) / 2
    const selectedColors = colors.slice(0, pairCount)
    const cardPairs = [...selectedColors, ...selectedColors]
    
    // 随机打乱
    const shuffled = cardPairs
      .sort(() => Math.random() - 0.5)
      .map((color, index) => ({
        id: index,
        color,
        isFlipped: false,
        isMatched: false,
      }))
    
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setIsChecking(false)
    setShowSuccess(false)
  }, [])

  useEffect(() => {
    const gridSize = level === 1 ? 4 : level === 2 ? 4 : 4
    initGame(gridSize)
  }, [level, initGame])

  const handleCardClick = (cardId: number) => {
    if (isChecking) return
    if (flippedCards.length >= 2) return
    if (cards[cardId].isFlipped || cards[cardId].isMatched) return

    const newCards = [...cards]
    newCards[cardId].isFlipped = true
    setCards(newCards)
    
    const newFlipped = [...flippedCards, cardId]
    setFlippedCards(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      setIsChecking(true)
      
      const [first, second] = newFlipped
      if (cards[first].color.name === cards[second].color.name) {
        // 匹配成功
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[first].isMatched = true
          matchedCards[second].isMatched = true
          setCards(matchedCards)
          setFlippedCards([])
          setScore(score + 20)
          setIsChecking(false)
          
          // 检查是否全部匹配
          const allMatched = matchedCards.every(card => card.isMatched)
          if (allMatched) {
            setShowSuccess(true)
          }
        }, 500)
      } else {
        // 匹配失败，翻回去
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[first].isFlipped = false
          resetCards[second].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
          setIsChecking(false)
        }, 1000)
      }
    }
  }

  const handleRestart = () => {
    const gridSize = level === 1 ? 4 : level === 2 ? 4 : 4
    initGame(gridSize)
    setScore(0)
  }

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1)
    } else {
      handleRestart()
    }
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">返回</span>
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2">
            <Trophy className="w-5 h-5 text-amber-600" />
            <span className="font-bold text-amber-700">{score}</span>
          </div>
          <div className="flex items-center gap-2 bg-purple-100 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-purple-600" />
            <span className="font-bold text-purple-700">步数 {moves}</span>
          </div>
        </div>
      </header>

      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-violet-500 mb-2">
          🌈 颜色配对
        </h1>
        <p className="text-foreground/70">
          翻开卡片，找到相同颜色的一对！
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || isChecking}
              className={`
                aspect-square rounded-2xl transition-all duration-300 transform
                ${card.isFlipped || card.isMatched
                  ? `${card.color.bg} scale-100`
                  : 'bg-gradient-to-br from-violet-400 to-purple-500 hover:scale-105'
                }
                ${card.isMatched ? 'ring-4 ring-green-400 animate-success-pop' : ''}
                shadow-lg
              `}
            >
              {!card.isFlipped && !card.isMatched && (
                <span className="text-3xl sm:text-4xl text-white/80">?</span>
              )}
              {card.isMatched && (
                <span className="text-2xl sm:text-3xl">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Restart Button */}
      <div className="text-center mt-8">
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg hover:bg-white transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span className="font-medium">重新开始</span>
        </button>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 text-center max-w-sm animate-success-pop">
            <div className="text-6xl mb-4">🌟</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">完美配对！</h2>
            <p className="text-foreground/70 mb-2">你用了 {moves} 步完成！</p>
            <p className="text-amber-600 font-bold mb-6">获得 {score} 分</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNextLevel}
                className="bg-gradient-to-r from-violet-400 to-purple-500 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                {level < 3 ? '下一关 →' : '再玩一次 🔄'}
              </button>
              <button
                onClick={onBack}
                className="bg-gray-100 text-foreground font-bold px-6 py-3 rounded-full hover:bg-gray-200 transition-colors"
              >
                返回大厅
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
