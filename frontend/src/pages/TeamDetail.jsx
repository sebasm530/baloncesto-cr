import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTeam } from '../api/teams.api'
import { getPlayers } from '../api/players.api'
import PlayerCard from '../components/PlayerCard'

export default function TeamDetail() {
  const { id } = useParams()
  const { data: teamData, isLoading } = useQuery({ queryKey: ['team', id], queryFn: () => getTeam(id) })
  const { data: playersData } = useQuery({ queryKey: ['players', id], queryFn: () => getPlayers({ team: id }) })

  if (isLoading) return <div className="text-center py-20">Cargando...</div>

  const team = teamData?.data?.team

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="flex items-center gap-6 mb-10">
        {team?.logo ? (
          <img src={team.logo} alt={team.name} className="w-24 h-24 rounded-full object-cover border-2 border-orange-500" />
        ) : (
          <div className="w-24 h-24 bg-orange-500 rounded-full flex items-center justify-center font-bold text-2xl">
            {team?.shortName}
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{team?.name}</h1>
          <p className="text-gray-400">{team?.city}, {team?.province}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold mb-4">Jugadores</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playersData?.data?.players?.map(player => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
    </div>
  )
}