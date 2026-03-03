import { useState, useEffect, useCallback, useRef } from 'react'
import { ArrowLeft, RotateCcw, Trophy, Star, Play } from 'lucide-react'

interface StarTrackingGameProps {
  onBack: () => void
}

interface StarPosition {
  x: number
  y: number
}

const pathPatterns = [
  // 圆形路径
  (t: number) => ({
    x: 50 + 30 * Math.cos(t * 2 * Math.PI),
    y: 50 + 30 * Math.sin(t * 2 * Math.PI),
  }),
  // 8字形路径
  (t: number) => ({
    x: 50 + 35 * Math.sin(t * 2 * Math.PI),
    y: 50 + 25 * Math.sin(t * 4 * Math.PI),
  }),
  // 方形路径
  (t: number) => {
    const phase = (t * 4) % 4
    if (phase < 1) return { x: 20 + 60 * phase, y: 20 }
    if (phase < 2) return { x: 80, y: 20 + 60 * (phase - 1) }
    if (phase < 3) return { x: 80 - 60 * (phase - 2), y: 80 }
    return { x: 20, y: 80 - 60 * (phase - 3) }
  },
  // 星形路径
  (t: number) => {
    const angle = t * 2 * Math.PI
    const r = 25 + 15 * Math.cos(5 * angle)
    return {
      x: 50 + r * Math.cos(angle),
      y: 50 + r * Math.sin(angle),
    }
  },
]

export function StarTrackingGame({ onBack }: StarTrackingGameProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(0)
  const [progress, setProgress] = useState(0)
  const [starPosition, setStarPosition] = useState<StarPosition>({ x: 50, y: 50 })
  const [showSuccess, setShowSuccess] = useState(false)
  const [trackingCount, setTrackingCount] = useState(0)
  const [isTracking, setIsTracking] = useState(false)
  const animationRef = useRef<number>()
  const startTimeRef = useRef<number>(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const duration = 8000 // 8秒完成一个循环
  const speed = level === 0 ? 1 : level === 1 ? 1.5 : 2

  const animate = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp
    
    const elapsed = timestamp - startTimeRef.current
    const t = ((elapsed * speed) % duration) / duration
    
    setProgress(t * 100)
    
    const pathFn = pathPatterns[level % pathPatterns.length]
    const pos = pathFn(t)
    setStarPosition(pos)
    
    // 检查是否完成一个循环
    if (elapsed >= duration / speed) {
      setScore(prev => prev + 10 + trackingCount)
      setShowSuccess(true)
      setIsPlaying(false)
      return
    }
    
    animationRef.current = requestAnimationFrame(animate)
  }, [level, speed, trackingCount])

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = 0
      setTrackingCount(0)
      animationRef.current = requestAnimationFrame(animate)
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, animate])

  const handleStarClick = () => {
    if (isPlaying) {
      setTrackingCount(prev => prev + 1)
      setIsTracking(true)
      setTimeout(() => setIsTracking(false), 200)
    }
  }

  const handleStart = () => {
    setIsPlaying(true)
    setShowSuccess(false)
    setProgress(0)
  }

  const handleNextLevel = () => {
    setLevel(prev => (prev + 1) % pathPatterns.length)
    setShowSuccess(false)
    setProgress(0)
    setIsPlaying(false)
  }

  const handleRestart = () => {
    setLevel(0)
    setScore(0)
    setShowSuccess(false)
    setProgress(0)
    setIsPlaying(false)
  }

  const levelNames = ['圆形追踪', '8字追踪', '方形追踪', '星形追踪']

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
          <div className="flex items-center gap-2 bg-yellow-100 rounded-full px-4 py-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-700">{levelNames[level]}</span>
          </div>
        </div>
      </header>

      {/* Game Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-500 mb-2">
          ⭐ 追踪星星
        </h1>
        <p className="text-foreground/70">
          用眼睛跟随星星移动，点击星星获得额外分数！
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-md mx-auto mb-6">
        <div className="bg-white/50 rounded-full h-4 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-amber-400 to-yellow-500 transition-all duration-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Game Area */}
      <div className="max-w-lg mx-auto">
        <div 
          ref={containerRef}
          className="relative aspect-square bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-900 rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Background Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.3 + Math.random() * 0.4,
              }}
            />
          ))}

          {/* Moon */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full shadow-lg shadow-yellow-200/50" />

          {/* Main Star */}
          <button
            onClick={handleStarClick}
            className={`
              absolute w-16 h-16 sm:w-20 sm:h-20 -translate-x-1/2 -translate-y-1/2
              transition-transform duration-75
              ${isTracking ? 'scale-125' : 'scale-100'}
            `}
            style={{
              left: `${starPosition.x}%`,
              top: `${starPosition.y}%`,
            }}
          >
            <span className={`
              text-5xl sm:text-6xl drop-shadow-lg
              ${isPlaying ? 'animate-pulse' : ''}
            `}>
              ⭐
            </span>
          </button>

          {/* Click Feedback */}
          {isTracking && (
            <div 
              className="absolute text-2xl animate-success-pop pointer-events-none"
              style={{
                left: `${starPosition.x}%`,
                top: `${starPosition.y - 10}%`,
              }}
            >
              +1
            </div>
          )}

          {/* Start Overlay */}
          {!isPlaying && !showSuccess && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <button
                onClick={handleStart}
                className="flex items-center gap-3 bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold px-8 py-4 rounded-full shadow-lg hover:opacity-90 transition-opacity animate-pulse-glow"
              >
                <Play className="w-6 h-6" />
                <span className="text-xl">开始追踪</span>
              </button>
            </div>
          )}
        </div>

        {/* Tracking Count */}
        {isPlaying && (
          <div className="text-center mt-4">
            <span className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
              <span className="text-amber-600 font-bold">点击次数: {trackingCount}</span>
            </span>
          </div>
        )}
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
            <h2 className="text-2xl font-bold text-foreground mb-2">追踪完成！</h2>
            <p className="text-foreground/70 mb-2">你点击了 {trackingCount} 次星星</p>
            <p className="text-amber-600 font-bold mb-6">获得 {10 + trackingCount} 分</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleNextLevel}
                className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white font-bold px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
              >
                下一关 →
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
