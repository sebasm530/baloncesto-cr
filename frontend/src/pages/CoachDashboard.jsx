import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/client'
import PlayerCard from '../components/PlayerCard'
import GameCard from '../components/GameCard'

const getCoachOverview = () => api.get('/users/coach/overview')

export default function CoachDashboard() {
  const { data, isLoading, isError, error } = useQuery({ queryKey: ['coach-overview'], queryFn: getCoachOverview })
  const overview = data?.data

  if (isLoading) return <div className="bg-premium min-h-screen p-10"><div className="max-w-7xl mx-auto glass rounded-xl h-64 animate-pulse" /></div>
  if (isError) return <div className="bg-premium min-h-screen flex items-center justify-center p-6 text-center text-gray-400">{error.response?.data?.message || 'No se pudo cargar la información de tu equipo.'}</div>

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <p className="text-blue-400 text-sm font-bold uppercase tracking-wider mb-2">Panel de coach</p>
          <div className="flex items-center gap-4">
            {overview.team?.logo ? <img src={overview.team.logo} alt="" className="w-16 h-16 rounded-full object-cover border border-blue-400/40" /> : <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center font-black text-xl">{overview.team?.shortName}</div>}
            <div>
              <h1 className="text-3xl font-black">{overview.team?.name}</h1>
              <p className="text-gray-400">{overview.team?.city}{overview.team?.province ? `, ${overview.team.province}` : ''}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-2xl font-black">Jugadores de tu equipo <span className="text-blue-400">({overview.players.length})</span></h2>
            <Link to="/players" className="text-orange-400 text-sm font-bold hover:text-orange-300">Ver todos →</Link>
          </div>
          {overview.players.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{overview.players.map((player) => <motion.div key={player._id} whileHover={{ y: -3 }}><PlayerCard player={{ ...player, team: overview.team }} /></motion.div>)}</div> : <p className="text-gray-500">No hay jugadores activos registrados para este equipo.</p>}
        </section>

        <section>
          <h2 className="text-2xl font-black mb-5">Torneos en los que participa</h2>
          {overview.tournaments.length ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">{overview.tournaments.map((tournament) => <Link key={tournament._id} to={`/tournaments/${tournament._id}`} className="glass p-5 rounded-xl border border-white/5 hover:border-orange-500/30 transition"><span className="text-xs font-bold uppercase text-orange-400">{tournament.status}</span><h3 className="font-black text-lg mt-2">{tournament.name}</h3><p className="text-gray-400 text-sm">{tournament.category} · {tournament.season}</p></Link>)}</div> : <p className="text-gray-500">Tu equipo no participa actualmente en ningún torneo.</p>}
        </section>

        <section>
          <h2 className="text-2xl font-black mb-5">Próximos partidos</h2>
          {overview.upcomingGames.length ? <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{overview.upcomingGames.map((game) => <GameCard key={game._id} game={game} />)}</div> : <p className="text-gray-500">No hay partidos próximos programados para tu equipo.</p>}
        </section>
      </div>
    </div>
  )
}
