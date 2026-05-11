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
          game.status === 'finalizado' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          game.status === 'en curso' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
          'bg-gray-500/20 text-gray-400 border border-gray-500/30'
        }`}>{game.status}</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Equipo local */}
        <div className="flex items-center gap-3 flex-1">
          {game.homeTeam?.logo ? (
            <img src={game.homeTeam.logo} alt={game.homeTeam.name} className="w-10 h-10 rounded-full object-cover border border-orange-500/30" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-xs shrink-0">
              {game.homeTeam?.shortName}
            </div>
          )}
          <span className="font-bold text-sm">{game.homeTeam?.name}</span>
        </div>

        {/* Marcador */}
        <div className="text-center min-w-20 shrink-0">
          {game.status === 'finalizado' ? (
            <span className="text-2xl font-black text-orange-400">{game.homeScore} - {game.awayScore}</span>
          ) : (
            <span className="text-gray-500 text-sm font-bold">VS</span>
          )}
        </div>

        {/* Equipo visitante */}
        <div className="flex items-center gap-3 flex-1 justify-end">
          <span className="font-bold text-sm text-right">{game.awayTeam?.name}</span>
          {game.awayTeam?.logo ? (
            <img src={game.awayTeam.logo} alt={game.awayTeam.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center font-black text-xs shrink-0 border border-white/10">
              {game.awayTeam?.shortName}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}