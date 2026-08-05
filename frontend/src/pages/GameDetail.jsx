import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { getGame } from '../api/games.api'

const columns = [
  ['minutesPlayed', 'MIN'], ['points', 'PTS'], ['rebounds', 'REB'], ['assists', 'AST'], ['steals', 'ROB'],
  ['turnovers', 'PER'], ['blocks', 'TAP'], ['freeThrows', 'TL'], ['fouls', 'FP'], ['plusMinus', '+/-']
]

function TeamStatsTable({ team, stats }) {
  return (
    <section className="glass rounded-xl border border-white/5 overflow-hidden">
      <div className="flex items-center gap-3 p-5 border-b border-white/5">
        {team?.logo ? <img src={team.logo} alt="" className="w-10 h-10 object-contain rounded-full" /> : <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center font-bold">{team?.shortName}</div>}
        <h2 className="text-xl font-black">{team?.name}</h2>
      </div>
      {stats?.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-sm">
            <thead className="border-b border-white/5 text-gray-400">
              <tr>
                <th className="text-left px-5 py-3">Jugador</th>
                {columns.map(([, label]) => <th key={label} className="px-3 py-3 whitespace-nowrap">{label}</th>)}
              </tr>
            </thead>
            <tbody>
              {stats.map((stat) => (
                <tr key={stat.player?._id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition">
                  <td className="px-5 py-4 whitespace-nowrap font-semibold">#{stat.player?.number} {stat.player?.name} {stat.player?.lastName}</td>
                  {columns.map(([key]) => {
                    const value = key === 'freeThrows' ? `${stat.freeThrowsMade || 0}-${stat.freeThrowsAttempted || 0}` : stat[key] || 0
                    return <td key={key} className={`px-3 py-4 text-center ${key === 'points' ? 'font-black text-orange-400' : key === 'plusMinus' ? (value > 0 ? 'text-green-400 font-bold' : value < 0 ? 'text-red-400 font-bold' : '') : ''}`}>{key === 'plusMinus' && value > 0 ? `+${value}` : value}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : <p className="text-gray-500 text-center py-10">Aún no hay estadísticas registradas para este equipo.</p>}
    </section>
  )
}

export default function GameDetail() {
  const { id } = useParams()
  const { data, isLoading, isError } = useQuery({ queryKey: ['game', id], queryFn: () => getGame(id) })
  const game = data?.data?.game

  if (isLoading) return <div className="bg-premium min-h-screen p-8"><div className="max-w-6xl mx-auto glass h-64 rounded-xl animate-pulse" /></div>
  if (isError || !game) return <div className="bg-premium min-h-screen flex items-center justify-center p-6 text-center text-gray-400">No se encontró este partido.</div>

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6 py-12 sm:py-16 relative">
          <Link to={`/tournaments/${game.tournament?._id}`} className="inline-block text-sm text-orange-400 hover:text-orange-300 mb-6">← Volver al torneo</Link>
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <p className="text-gray-400 text-sm mb-5">{game.tournament?.name} · {new Date(game.date).toLocaleDateString('es-CR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center gap-2 min-w-0">
                {game.homeTeam?.logo ? <img src={game.homeTeam.logo} alt="" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" /> : <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-orange-500 flex items-center justify-center font-black">{game.homeTeam?.shortName}</div>}
                <h1 className="font-black text-sm sm:text-xl break-words">{game.homeTeam?.name}</h1>
              </div>
              <div className="shrink-0"><p className="text-3xl sm:text-5xl font-black text-orange-400">{game.status === 'finalizado' ? `${game.homeScore} - ${game.awayScore}` : 'VS'}</p><p className="text-xs text-gray-400 mt-2 capitalize">{game.status}</p></div>
              <div className="flex flex-col items-center gap-2 min-w-0">
                {game.awayTeam?.logo ? <img src={game.awayTeam.logo} alt="" className="w-14 h-14 sm:w-20 sm:h-20 object-contain" /> : <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gray-700 flex items-center justify-center font-black">{game.awayTeam?.shortName}</div>}
                <h1 className="font-black text-sm sm:text-xl break-words">{game.awayTeam?.name}</h1>
              </div>
            </div>
            {game.location && <p className="text-gray-500 text-sm mt-6">{game.location}</p>}
          </motion.div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-10 sm:py-12 space-y-6">
        <TeamStatsTable team={game.homeTeam} stats={game.homePlayerStats} />
        <TeamStatsTable team={game.awayTeam} stats={game.awayPlayerStats} />
      </div>
    </div>
  )
}
