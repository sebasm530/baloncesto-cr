import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTournament } from '../api/tournaments.api'
import { getGames } from '../api/games.api'
import GameCard from '../components/GameCard'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function TournamentDetail() {
  const { id } = useParams()
  const { data: tournamentData, isLoading } = useQuery({ queryKey: ['tournament', id], queryFn: () => getTournament(id) })
  const { data: gamesData } = useQuery({ queryKey: ['games', id], queryFn: () => getGames({ tournament: id }) })

  const tournament = tournamentData?.data?.tournament

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="h-10 w-64 bg-white/5 rounded mb-2" />
              <div className="h-4 w-40 bg-white/5 rounded" />
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              {tournament?.status === 'en curso' && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 text-xs font-semibold">EN CURSO</span>
                </div>
              )}
              <h1 className="text-3xl sm:text-5xl font-black mb-2 break-words">{tournament?.name}</h1>
              <p className="text-orange-400">{tournament?.category} · {tournament?.season}</p>
              <div className="flex flex-wrap gap-3 sm:gap-4 mt-4">
                <div className="glass rounded-lg px-4 py-2 border border-white/5">
                  <p className="text-gray-400 text-xs">Equipos</p>
                  <p className="font-black text-lg">{tournament?.teams?.length || 0}</p>
                </div>
                <div className="glass rounded-lg px-4 py-2 border border-white/5">
                  <p className="text-gray-400 text-xs">Partidos</p>
                  <p className="font-black text-lg">{gamesData?.data?.games?.length || 0}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-2xl font-black mb-6 flex items-center gap-2">
          <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
          Partidos
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {gamesData?.data?.games?.map((game, i) => (
            <motion.div key={game._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i}>
              <GameCard game={game} />
            </motion.div>
          ))}
        </div>
        {gamesData?.data?.games?.length === 0 && (
          <p className="text-gray-500 text-center py-16">No hay partidos registrados en este torneo.</p>
        )}
      </div>
    </div>
  )
}
