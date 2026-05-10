import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../api/tournaments.api'
import { getStandings, getPlayerStats } from '../api/stats.api'
import StandingsTable from '../components/StandingsTable'
import StatsChart from '../components/StatsChart'
import { motion } from 'framer-motion'

export default function Standings() {
  const [selectedTournament, setSelectedTournament] = useState('')
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const { data: standingsData } = useQuery({ queryKey: ['standings', selectedTournament], queryFn: () => getStandings(selectedTournament), enabled: !!selectedTournament })
  const { data: statsData } = useQuery({ queryKey: ['playerStats', selectedTournament], queryFn: () => getPlayerStats(selectedTournament), enabled: !!selectedTournament })

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black mb-2">
            Tabla de Posiciones
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mb-6">
            Seleccioná un torneo para ver las posiciones
          </motion.p>
          <motion.select
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            value={selectedTournament}
            onChange={e => setSelectedTournament(e.target.value)}
            className="glass border border-white/10 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-orange-500 transition min-w-64"
          >
            <option value="">Seleccioná un torneo</option>
            {tournamentsData?.data?.tournaments?.map(t => (
              <option key={t._id} value={t._id}>{t.name} · {t.season}</option>
            ))}
          </motion.select>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {!selectedTournament && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24">
            <p className="text-6xl mb-4">🏆</p>
            <p className="text-gray-500 text-lg">Seleccioná un torneo para ver la tabla de posiciones</p>
          </motion.div>
        )}

        {standingsData?.data?.standings && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl border border-white/5 mb-10 overflow-hidden">
            <div className="p-6 border-b border-white/5">
              <h2 className="text-xl font-black flex items-center gap-2">
                <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
                Posiciones
              </h2>
            </div>
            <StandingsTable standings={standingsData.data.standings} />
          </motion.div>
        )}

        {statsData?.data?.stats?.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-xl border border-white/5 p-6">
            <h2 className="text-xl font-black mb-6 flex items-center gap-2">
              <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
              Estadísticas por jugador
            </h2>
            <StatsChart stats={statsData.data.stats} />
          </motion.div>
        )}
      </div>
    </div>
  )
}