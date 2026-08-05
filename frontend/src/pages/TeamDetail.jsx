import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTeam } from '../api/teams.api'
import { getPlayers } from '../api/players.api'
import PlayerCard from '../components/PlayerCard'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function TeamDetail() {
  const { id } = useParams()
  const { data: teamData, isLoading } = useQuery({ queryKey: ['team', id], queryFn: () => getTeam(id) })
  const { data: playersData } = useQuery({ queryKey: ['players', id], queryFn: () => getPlayers({ team: id }) })

  const team = teamData?.data?.team

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          {isLoading ? (
            <div className="animate-pulse flex gap-6 items-center">
              <div className="w-24 h-24 bg-white/5 rounded-full" />
              <div>
                <div className="h-8 w-48 bg-white/5 rounded mb-2" />
                <div className="h-4 w-32 bg-white/5 rounded" />
              </div>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-center sm:text-left">
              {team?.logo ? (
                <motion.img whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }} src={team.logo} alt={team.name} className="w-24 h-24 rounded-full object-cover border-2 border-orange-500 glow" />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-2xl glow">
                  {team?.shortName}
                </div>
              )}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black">{team?.name}</h1>
                <p className="text-gray-400 mt-1">{team?.city}, {team?.province}</p>
                {team?.description && <p className="text-gray-500 text-sm mt-2">{team.description}</p>}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black mb-6 flex items-center gap-2">
          <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
          Jugadores
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {playersData?.data?.players?.map((player, i) => (
            <motion.div key={player._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
              <PlayerCard player={player} />
            </motion.div>
          ))}
        </div>
        {playersData?.data?.players?.length === 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-center py-16">
            Este equipo no tiene jugadores registrados aún.
          </motion.p>
        )}
      </div>
    </div>
  )
}
