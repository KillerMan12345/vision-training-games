import { Eye, Palette, Star, Shapes, Sparkles } from 'lucide-react'
import type { GameType } from '../App'

interface GamePlazaProps {
  onSelectGame: (game: GameType) => void
}

const games = [
  {
    id: 'spot-difference' as GameType,
    title: '找不同',
    description: '仔细观察，找出两张图的不同之处！',
    icon: Eye,
    color: 'from-rose-400 to-pink-500',
    shadowColor: 'shadow-rose-200',
    emoji: '🔍',
  },
  {
    id: 'color-match' as GameType,
    title: '颜色配对',
    description: '记住颜色，找到相同的卡片！',
    icon: Palette,
    color: 'from-violet-400 to-purple-500',
    shadowColor: 'shadow-violet-200',
    emoji: '🌈',
  },
  {
    id: 'star-tracking' as GameType,
    title: '追踪星星',
    description: '用眼睛跟着星星移动！',
    icon: Star,
    color: 'from-amber-400 to-yellow-500',
    shadowColor: 'shadow-amber-200',
    emoji: '⭐',
  },
  {
    id: 'shape-match' as GameType,
    title: '形状匹配',
    description: '找到一样的形状，连连看！',
    icon: Shapes,
    color: 'from-cyan-400 to-blue-500',
    shadowColor: 'shadow-cyan-200',
    emoji: '🔷',
  },
]

export function GamePlaza({ onSelectGame }: GamePlazaProps) {
  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <header className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-4xl sm:text-5xl animate-bounce-soft">👀</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            眼睛小勇士
          </h1>
          <span className="text-4xl sm:text-5xl animate-bounce-soft" style={{ animationDelay: '0.5s' }}>✨</span>
        </div>
        <p className="text-lg sm:text-xl text-foreground/70 font-medium">
          选择一个有趣的游戏，开始你的视力训练之旅吧！
        </p>
      </header>

      {/* Decorative Elements */}
      <div className="fixed top-20 left-10 text-4xl opacity-30 animate-float">🌟</div>
      <div className="fixed top-40 right-16 text-3xl opacity-30 animate-float" style={{ animationDelay: '1s' }}>🎈</div>
      <div className="fixed bottom-32 left-20 text-3xl opacity-30 animate-float" style={{ animationDelay: '2s' }}>🦋</div>
      <div className="fixed bottom-20 right-10 text-4xl opacity-30 animate-float" style={{ animationDelay: '0.5s' }}>🌈</div>

      {/* Game Cards Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
        {games.map((game, index) => (
          <button
            key={game.id}
            onClick={() => onSelectGame(game.id)}
            className={`
              group relative overflow-hidden rounded-3xl p-6 sm:p-8
              bg-gradient-to-br ${game.color}
              ${game.shadowColor} shadow-xl
              game-card-hover
              text-left
            `}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Background Sparkles */}
            <div className="absolute inset-0 opacity-20">
              <Sparkles className="absolute top-4 right-4 w-6 h-6 animate-twinkle" />
              <Sparkles className="absolute bottom-8 left-8 w-4 h-4 animate-twinkle" style={{ animationDelay: '0.5s' }} />
              <Sparkles className="absolute top-1/2 right-1/3 w-5 h-5 animate-twinkle" style={{ animationDelay: '1s' }} />
            </div>

            {/* Card Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <span className="text-5xl sm:text-6xl">{game.emoji}</span>
                <game.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white/80 group-hover:scale-110 transition-transform" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                {game.title}
              </h2>
              <p className="text-white/90 text-base sm:text-lg">
                {game.description}
              </p>
              
              {/* Play Button */}
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 text-white font-semibold group-hover:bg-white/30 transition-colors">
                <span>开始游戏</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300 rounded-3xl" />
          </button>
        ))}
      </div>

      {/* Footer Tips */}
      <footer className="text-center mt-12 sm:mt-16">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg">
          <span className="text-2xl">💡</span>
          <p className="text-foreground/80 font-medium">
            小提示：每天玩15-20分钟效果最好哦！
          </p>
        </div>
      </footer>
    </div>
  )
}
