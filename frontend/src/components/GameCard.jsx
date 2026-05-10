import { motion } from 'framer-motion'

export default function GameCard({ game }) {
  const date = new Date(game.date).toLocaleDateString('es-CR', {
    day: '2-digit', month: 'short', year: 'numeric'
  })

  return (
    <motion.div whileHover={{ scale: 1.02 }} className="glass rounded-xl p-5 border border-white/5 hover:border-orange-500/30 transition">
      <div className="flex justify-between items-center mb-4">
        <p className="text-gray-500 text-xs">{date} · {game.location || 'Por definir'}</p>
        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
          game.status === 'finalizado' ? 'bg-green-900/50 text-green-400' :
          game.status === 'en curso' ? 'bg-orange-900/50 text-orange-400' :
          'bg-gray-800 text-gray-400'
        }`}>{game.status}</span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-xs">
            {game.homeTeam?.shortName}
          </div>
          <span className="font-bold">{game.homeTeam?.name}</span>
        </div>
        <div className="text-center min-w-16">
          {game.status === 'finalizado' ? (
            <span className="text-2xl font-black text-orange-400">{game.homeScore} - {game.awayScore}</span>
          ) : (
            <span className="text-gray-500 text-sm font-bold">VS</span>
          )}
        </div>
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="font-bold">{game.awayTeam?.name}</span>
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center font-black text-xs">
            {game.awayTeam?.shortName}
          </div>
        </div>
      </div>
    </motion.div>
  )
}