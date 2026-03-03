import { useState, useEffect, useCallback } from 'react'
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react'

interface ShapeMatchGameProps {
  onBack: () => void
}

const shapes = [
  { id: 'circle', emoji: '🔴', name: '圆形' },
  { id: 'square', emoji: '🟥', name: '方形' },
  { id: 'triangle', emoji: '🔺', name: '三角形' },
  { id: 'star', emoji: '⭐', name: '星形' },
  { id: 'heart', emoji: '❤️', name: '爱心' },
  { id: 'diamond', emoji: '💎', name: '菱形' },
  { id: 'moon', emoji: '🌙', name: '月亮' },
  { id: 'sun', emoji: '☀️', name: '太阳' },
]

interface ShapeCard {
  id: number
  shape: typeof shapes[0]
  isSelected: boolean
  isMatched: boolean
  row: number
  col: number
}

export function ShapeMatchGame({ onBack }: ShapeMatchGameProps) {
  const [cards, setCards] = useState<ShapeCard[]>([])
  const [selectedCards, setSelectedCards] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [showSuccess, setShowSuccess] = useState(false)
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [targetPairs, setTargetPairs] = useState(0)

  // 初始化游戏
  const initGame = useCallback((lv: number) => {
    const gridSize = lv <= 2 ? 4 : 5 // 4x4 或 5x5 网格
    const pairCount = Math.floor((gridSize * gridSize) / 2)
    const selectedShapes = shapes.slice(0, Math.min(pairCount, shapes.length))
    
    // 确保有足够的形状配对
    const shapePairs: typeof shapes[0][] = []
    for (let i = 0; i < pairCount; i++) {
      const shape = selectedShapes[i % selectedShapes.length]
      shapePairs.push(shape, shape)
    }
    
    // 如果是奇数格子，添加一个额外的
    if ((gridSize * gridSize) % 2 !== 0) {
      shapePairs.push(shapes[0])
    }
    
    // 随机打乱
    const shuffled = shapePairs
      .sort(() => Math.random() - 0.5)
      .map((shape, index) => ({
        id: index,
        shape,
        isSelected: false,
        isMatched: false,
        row: Math.floor(index / gridSize),
        col: index % gridSize,
      }))
    
    setCards(shuffled)
    setSelectedCards([])
    setMatchedPairs(0)
    setTargetPairs(pairCount)
    setShowSuccess(false)
  }, [])

  useEffect(() => {
    initGame(level)
  }, [level, initGame])

  // 检查两张卡片是否相邻
  const areAdjacent = (card1: ShapeCard, card2: ShapeCard): boolean => {
    const rowDiff = Math.abs(card1.row - card2.row)
    const colDiff = Math.abs(card1.col - card2.col)
    // 相邻: 上下左右或对角线
    return (rowDiff <= 1 && colDiff <= 1) && (rowDiff + colDiff > 0)
  }

  const handleCardClick = (cardId: number) => {
    const card = cards[cardId]
    if (card.isMatched) return

    if (selectedCards.length === 0) {
      // 第一张卡片
      const newCards = [...cards]
      newCards[cardId].isSelected = true
      setCards(newCards)
      setSelectedCards([cardId])
    } else if (selectedCards.length === 1) {
      const firstCard = cards[selectedCards[0]]
      
      // 检查是否点击同一张卡片
      if (cardId === selectedCards[0]) {
        const newCards = [...cards]
        newCards[cardId].isSelected = false
        setCards(newCards)
        setSelectedCards([])
        return
      }
      
      const newCards = [...cards]
      newCards[cardId].isSelected = true
      setCards(newCards)
      
      // 检查是否匹配（相同形状且相邻）
      if (firstCard.shape.id === card.shape.id && areAdjacent(firstCard, card)) {
        // 匹配成功
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[selectedCards[0]].isMatched = true
          matchedCards[selectedCards[0]].isSelected = false
          matchedCards[cardId].isMatched = true
          matchedCards[cardId].isSelected = false
          setCards(matchedCards)
          setSelectedCards([])
          setScore(score + 15)
          
          const newMatchedPairs = matchedPairs + 1
          setMatchedPairs(newMatchedPairs)
          
          // 检查是否全部匹配
          if (newMatchedPairs >= targetPairs) {
            setShowSuccess(true)
          }
        }, 300)
      } else {
        // 不匹配，取消选择
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[selectedCards[0]].isSelected = false
          resetCards[cardId].isSelected = false
          setCards(resetCards)
          setSelectedCards([])
        }, 500)
      }
    }
  }

  const handleRestart = () => {
    initGame(level)
    setScore(0)
  }

  const handleNextLevel = () => {
    if (level < 3) {
      setLevel(level + 1)
    } else {
      setLevel(1)
      handleRestart()
    }
  }

  const gridSize = level <= 2 ? 4 : 5

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
          <div className="flex items-center gap-2 bg-cyan-100 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-cyan-600" />
            <span className="font-bold text-cyan-700">关卡 {level}</span>
          </div>
        </div>
      </header>

      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-500 mb-2">
          🔷 形状匹配
        </h1>
        <p className="text-foreground/70">
          找到相邻的相同形状，点击消除它们！
        </p>
        <p className="text-sm text-cyan-600 mt-2">
          已消除: {matchedPairs} / {targetPairs} 对
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-md mx-auto">
        <div 
          className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-cyan-200"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            gap: '0.5rem',
          }}
        >
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
              className={`
                aspect-square flex items-center justify-center text-2xl sm:text-3xl rounded-xl
                transition-all duration-300
                ${card.isMatched 
                  ? 'bg-gray-100 opacity-30 scale-90' 
                  : card.isSelected
                    ? 'bg-cyan-100 ring-4 ring-cyan-400 scale-105'
                    : 'bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 hover:scale-105'
                }
                shadow-md
              `}
            >
              {!card.isMatched && card.shape.emoji}
            </button>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-2 text-sm text-cyan-700">
            <span>💡</span>
            <span>提示：只有相邻的相同形状才能消除哦！</span>
          </div>
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
            <div className="text-6xl mb-4">🎊</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">全部消除！</h2>
            <p className="text-foreground/70 mb-2">太棒了，你完成了第 {level} 关！</p>
            <p className="text-amber-600 font-bold mb-6">获得 {score} 分</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNextLevel}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
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
