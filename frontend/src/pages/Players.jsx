import { useQuery } from '@tanstack/react-query'
import { getPlayers } from '../api/players.api'
import PlayerCard from '../components/PlayerCard'

export default function Players() {
  const { data, isLoading } = useQuery({ queryKey: ['players'], queryFn: () => getPlayers() })

  if (isLoading) return <div className="text-center py-20">Cargando jugadores...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Jugadores</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.players?.map(player => (
          <PlayerCard key={player._id} player={player} />
        ))}
      </div>
    </div>
  )
}