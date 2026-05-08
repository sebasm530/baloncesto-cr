import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getTournament } from '../api/tournaments.api'
import { getGames } from '../api/games.api'
import GameCard from '../components/GameCard'

export default function TournamentDetail() {
  const { id } = useParams()
  const { data: tournamentData, isLoading } = useQuery({ queryKey: ['tournament', id], queryFn: () => getTournament(id) })
  const { data: gamesData } = useQuery({ queryKey: ['games', id], queryFn: () => getGames({ tournament: id }) })

  if (isLoading) return <div className="text-center py-20">Cargando...</div>

  const tournament = tournamentData?.data?.tournament

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">{tournament?.name}</h1>
      <p className="text-orange-400 mb-8">{tournament?.category} · {tournament?.season}</p>
      <h2 className="text-xl font-bold mb-4">Partidos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gamesData?.data?.games?.map(game => (
          <GameCard key={game._id} game={game} />
        ))}
      </div>
    </div>
  )
}