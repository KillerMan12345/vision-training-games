import { useState, useCallback } from 'react'
import { ArrowLeft, RotateCcw, Trophy, Star } from 'lucide-react'

interface SpotDifferenceGameProps {
  onBack: () => void
}

// 定义不同关卡的差异
const levels = [
  {
    id: 1,
    baseEmojis: ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼', '🌸', '🌺'],
    differences: [{ index: 2, original: '🌻', different: '🌾' }],
  },
  {
    id: 2,
    baseEmojis: ['🍎', '🍊', '🍋', '🍇', '🍓', '🍑', '🍎', '🍊', '🍋'],
    differences: [
      { index: 3, original: '🍇', different: '🫐' },
      { index: 7, original: '🍊', different: '🥭' },
    ],
  },
  {
    id: 3,
    baseEmojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨'],
    differences: [
      { index: 1, original: '🐱', different: '🐯' },
      { index: 4, original: '🐰', different: '🐇' },
      { index: 6, original: '🐻', different: '🧸' },
    ],
  },
]

export function SpotDifferenceGame({ onBack }: SpotDifferenceGameProps) {
  const [currentLevel, setCurrentLevel] = useState(0)
  const [foundDifferences, setFoundDifferences] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [showSuccess, setShowSuccess] = useState(false)
  const [wrongClick, setWrongClick] = useState<number | null>(null)

  const level = levels[currentLevel]
  const totalDifferences = level.differences.length

  // 生成右侧图片（带有差异）
  const getRightEmojis = useCallback(() => {
    const emojis = [...level.baseEmojis]
    level.differences.forEach((diff) => {
      emojis[diff.index] = diff.different
    })
    return emojis
  }, [level])

  const handleClickRight = (index: number) => {
    const isDifference = level.differences.some((d) => d.index === index)
    
    if (isDifference && !foundDifferences.includes(index)) {
      setFoundDifferences([...foundDifferences, index])
      setScore(score + 10)
      
      // 检查是否找到所有差异
      if (foundDifferences.length + 1 === totalDifferences) {
        setShowSuccess(true)
      }
    } else if (!isDifference) {
      setWrongClick(index)
      setTimeout(() => setWrongClick(null), 500)
    }
  }

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1)
      setFoundDifferences([])
      setShowSuccess(false)
    }
  }

  const handleRestart = () => {
    setCurrentLevel(0)
    setFoundDifferences([])
    setScore(0)
    setShowSuccess(false)
  }

  const rightEmojis = getRightEmojis()

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
            <span className="font-bold text-purple-700">关卡 {currentLevel + 1}</span>
          </div>
        </div>
      </header>

      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-rose-500 mb-2">
          🔍 找不同
        </h1>
        <p className="text-foreground/70">
          找出右边图片中 <span className="font-bold text-rose-500">{totalDifferences}</span> 处不同！
          已找到: <span className="font-bold text-green-500">{foundDifferences.length}</span>/{totalDifferences}
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4 sm:gap-8">
        {/* Left Image (Original) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-rose-200">
          <h3 className="text-center font-bold text-rose-400 mb-4">原图 📷</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {level.baseEmojis.map((emoji, index) => (
              <div
                key={index}
                className="aspect-square flex items-center justify-center text-3xl sm:text-5xl bg-rose-50 rounded-2xl"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>

        {/* Right Image (With Differences) */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-purple-200">
          <h3 className="text-center font-bold text-purple-400 mb-4">找找看 🔎</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {rightEmojis.map((emoji, index) => {
              const isFound = foundDifferences.includes(index)
              const isWrong = wrongClick === index
              
              return (
                <button
                  key={index}
                  onClick={() => handleClickRight(index)}
                  disabled={isFound}
                  className={`
                    aspect-square flex items-center justify-center text-3xl sm:text-5xl rounded-2xl
                    transition-all duration-300 cursor-pointer
                    ${isFound 
                      ? 'bg-green-100 ring-4 ring-green-400 animate-success-pop' 
                      : isWrong
                        ? 'bg-red-100 animate-wiggle'
                        : 'bg-purple-50 hover:bg-purple-100 hover:scale-105'
                    }
                  `}
                >
                  {emoji}
                  {isFound && (
                    <span className="absolute text-2xl">✓</span>
                  )}
                </button>
              )
            })}
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
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-foreground mb-2">太棒了！</h2>
            <p className="text-foreground/70 mb-6">你找到了所有不同！</p>
            <div className="flex gap-4 justify-center">
              {currentLevel < levels.length - 1 ? (
                <button
                  onClick={handleNextLevel}
                  className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  下一关 →
                </button>
              ) : (
                <button
                  onClick={handleRestart}
                  className="bg-gradient-to-r from-rose-400 to-pink-500 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                >
                  再玩一次 🔄
                </button>
              )}
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
