import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getPlayers } from '../api/players.api'
import { getTeams } from '../api/teams.api'
import PlayerCard from '../components/PlayerCard'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Players() {
  const [filters, setFilters] = useState({ team: '', position: '' })
  const { data, isLoading } = useQuery({ queryKey: ['players', filters], queryFn: () => getPlayers(filters) })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: () => import('../api/teams.api').then(m => m.getTeams()) })

  const positions = ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black mb-2">
            Jugadores
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400 mb-6">
            Todos los jugadores del baloncesto costarricense
          </motion.p>
          {/* Filtros */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex gap-3 flex-wrap">
            <select value={filters.team} onChange={e => setFilters({ ...filters, team: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
              <option value="">Todos los equipos</option>
              {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
            </select>
            <select value={filters.position} onChange={e => setFilters({ ...filters, position: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-orange-500">
              <option value="">Todas las posiciones</option>
              {positions.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
            {(filters.team || filters.position) && (
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => setFilters({ team: '', position: '' })} className="text-orange-400 hover:text-orange-300 text-sm border border-orange-500/30 px-4 py-2 rounded-lg transition">
                Limpiar filtros ✕
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-5 border border-white/5 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <>
            <p className="text-gray-500 text-sm mb-6">{data?.data?.players?.length || 0} jugadores encontrados</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data?.data?.players?.map((player, i) => (
                <motion.div key={player._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                  <PlayerCard player={player} />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}