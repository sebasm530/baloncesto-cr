import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../api/tournaments.api'
import { getPlayerStats } from '../api/stats.api'
import { motion } from 'framer-motion'

const StatRow = ({ rank, player, value, label }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: rank * 0.05 }}
    whileHover={{ scale: 1.02, x: 4 }}
    className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition group"
  >
    <span className={`w-7 text-center font-black text-sm shrink-0 ${
      rank === 1 ? 'text-yellow-400' :
      rank === 2 ? 'text-gray-300' :
      rank === 3 ? 'text-orange-400' :
      'text-gray-500'
    }`}>
      {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank}
    </span>
    {player?.photo ? (
      <img src={player.photo} alt={player.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/10 group-hover:border-orange-500/50 transition shrink-0" />
    ) : (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-lg border-2 border-white/10 shrink-0">👤</div>
    )}
    <div className="flex-1 min-w-0">
      <p className="font-bold text-sm truncate">{player?.name} {player?.lastName}</p>
      <div className="flex items-center gap-1.5 mt-0.5">
        {player?.team?.logo ? (
          <img src={player.team.logo} alt={player.team.name} className="w-4 h-4 rounded-full object-cover" />
        ) : (
          <span className="text-xs text-orange-400 font-bold">{player?.team?.shortName}</span>
        )}
        <span className="text-gray-500 text-xs truncate">{player?.team?.name}</span>
      </div>
    </div>
    <div className="text-right shrink-0">
      <p className="font-black text-xl text-white">{value}</p>
      <p className="text-gray-500 text-xs">{label}</p>
    </div>
  </motion.div>
)

const StatCard = ({ title, icon, data, valueKey, label, isLoading }) => (
  <div className="glass rounded-xl border border-white/5 overflow-hidden">
    <div className="flex items-center gap-3 p-5 border-b border-white/5">
      <span className="text-2xl">{icon}</span>
      <h3 className="font-black text-lg">{title}</h3>
    </div>
    <div className="flex items-center gap-4 px-5 py-2 border-b border-white/5">
      <span className="w-7 shrink-0" />
      <span className="text-gray-500 text-xs uppercase tracking-wider flex-1">Jugador</span>
      <span className="text-gray-500 text-xs uppercase tracking-wider shrink-0">{label}</span>
    </div>
    <div className="p-2">
      {isLoading ? (
        [...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
            <div className="w-7 h-4 bg-white/5 rounded" />
            <div className="w-10 h-10 bg-white/5 rounded-full shrink-0" />
            <div className="flex-1">
              <div className="h-4 bg-white/5 rounded w-32 mb-1" />
              <div className="h-3 bg-white/5 rounded w-20" />
            </div>
            <div className="w-10 h-6 bg-white/5 rounded" />
          </div>
        ))
      ) : data?.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm">No hay datos disponibles</p>
      ) : (
        data?.slice(0, 5).map((s, i) => (
          <StatRow
            key={s.player?._id || i}
            rank={i + 1}
            player={s.player}
            value={s[valueKey]}
            label={label}
          />
        ))
      )}
    </div>
  </div>
)

export default function Stats() {
  const [selectedTournament, setSelectedTournament] = useState('')
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['playerStats', selectedTournament],
    queryFn: () => getPlayerStats(selectedTournament),
    enabled: !!selectedTournament
  })

  const stats = statsData?.data?.stats || []

  const pointsLeaders = [...stats].sort((a, b) => parseFloat(b.avgPoints) - parseFloat(a.avgPoints))
  const reboundsLeaders = [...stats].sort((a, b) => parseFloat(b.avgRebounds) - parseFloat(a.avgRebounds))
  const assistsLeaders = [...stats].sort((a, b) => parseFloat(b.avgAssists) - parseFloat(a.avgAssists))
  const stealsLeaders = [...stats].sort((a, b) => (b.steals / b.games) - (a.steals / a.games)).map(s => ({
    ...s,
    avgSteals: (s.steals / s.games).toFixed(1)
  }))
  const blocksLeaders = [...stats].sort((a, b) => (b.blocks / b.games) - (a.blocks / a.games)).map(s => ({
    ...s,
    avgBlocks: (s.blocks / s.games).toFixed(1)
  }))
  const gamesLeaders = [...stats].sort((a, b) => b.games - a.games)

  return (
    <div className="bg-premium min-h-screen">
      {/* Header */}
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black mb-2">
            Estadísticas
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mb-6">
            Líderes estadísticos por competición
          </motion.p>
          <motion.select
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            value={selectedTournament}
            onChange={e => setSelectedTournament(e.target.value)}
            className="glass border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition min-w-72"
          >
            <option value="">Seleccioná una competición</option>
            {tournamentsData?.data?.tournaments?.map(t => (
              <option key={t._id} value={t._id}>{t.name} · {t.season}</option>
            ))}
          </motion.select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!selectedTournament ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-7xl mb-6">📈</p>
            <p className="text-gray-400 text-xl font-bold mb-2">Seleccioná una competición</p>
            <p className="text-gray-600">para ver los líderes estadísticos</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <StatCard
              title="Puntos por partido"
              icon="🏀"
              data={pointsLeaders}
              valueKey="avgPoints"
              label="PPP"
              isLoading={isLoading}
            />
            <StatCard
              title="Rebotes por partido"
              icon="💪"
              data={reboundsLeaders}
              valueKey="avgRebounds"
              label="RPP"
              isLoading={isLoading}
            />
            <StatCard
              title="Asistencias por partido"
              icon="🎯"
              data={assistsLeaders}
              valueKey="avgAssists"
              label="APP"
              isLoading={isLoading}
            />
            <StatCard
              title="Robos por partido"
              icon="⚡"
              data={stealsLeaders}
              valueKey="avgSteals"
              label="RBP"
              isLoading={isLoading}
            />
            <StatCard
              title="Tapones por partido"
              icon="🛡️"
              data={blocksLeaders}
              valueKey="avgBlocks"
              label="TBP"
              isLoading={isLoading}
            />
            <StatCard
              title="Partidos jugados"
              icon="📅"
              data={gamesLeaders}
              valueKey="games"
              label="PJ"
              isLoading={isLoading}
            />
          </div>
        )}
      </div>
    </div>
  )
}