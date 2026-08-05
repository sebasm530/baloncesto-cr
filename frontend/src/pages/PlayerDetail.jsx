import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPlayer } from '../api/players.api'
import { motion } from 'framer-motion'

export default function PlayerDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['player', id], queryFn: () => getPlayer(id) })

  const player = data?.data?.player

  const stats = [
    { label: 'Posición', value: player?.position },
    { label: 'Número', value: `#${player?.number}` },
    { label: 'Altura', value: player?.height ? `${player.height} cm` : 'N/D' },
    { label: 'Peso', value: player?.weight ? `${player.weight} kg` : 'N/D' },
    { label: 'Nacionalidad', value: player?.nationality },
    { label: 'Equipo', value: player?.team?.name },
  ]

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-16 relative">
          {isLoading ? (
            <div className="animate-pulse flex gap-6 items-center">
              <div className="w-28 h-28 bg-white/5 rounded-full" />
              <div>
                <div className="h-8 w-48 bg-white/5 rounded mb-2" />
                <div className="h-4 w-32 bg-white/5 rounded" />
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
              {player?.photo ? (
                <motion.img whileHover={{ scale: 1.05 }} src={player.photo} alt={player.name} className="w-28 h-28 rounded-full object-cover border-2 border-orange-500 glow" />
              ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-5xl border-2 border-white/10">
                  👤
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black">{player?.name} {player?.lastName}</h1>
                <p className="text-orange-400 text-lg mt-1">#{player?.number} · {player?.position}</p>
                <p className="text-gray-400">{player?.team?.name}</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black mb-6 flex items-center gap-2">
          <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
          Información
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-5 border border-white/5 hover:border-orange-500/30 transition">
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="font-bold text-lg mt-1">{stat.value || 'N/D'}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
