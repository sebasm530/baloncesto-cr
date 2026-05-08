import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getPlayer } from '../api/players.api'

export default function PlayerDetail() {
  const { id } = useParams()
  const { data, isLoading } = useQuery({ queryKey: ['player', id], queryFn: () => getPlayer(id) })

  if (isLoading) return <div className="text-center py-20">Cargando...</div>

  const player = data?.data?.player

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl">👤</div>
          <div>
            <h1 className="text-3xl font-bold">{player?.name} {player?.lastName}</h1>
            <p className="text-orange-400">#{player?.number} · {player?.position}</p>
            <p className="text-gray-400">{player?.team?.name}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">Nacionalidad</p>
            <p className="font-semibold mt-1">{player?.nationality}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">Altura</p>
            <p className="font-semibold mt-1">{player?.height ? `${player.height} cm` : 'N/D'}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">Peso</p>
            <p className="font-semibold mt-1">{player?.weight ? `${player.weight} kg` : 'N/D'}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <p className="text-gray-400">Equipo</p>
            <p className="font-semibold mt-1">{player?.team?.name}</p>
          </div>
        </div>
      </div>
    </div>
  )
}