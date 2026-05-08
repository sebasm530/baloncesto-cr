import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../api/teams.api'
import TeamCard from '../components/TeamCard'

export default function Teams() {
  const { data, isLoading } = useQuery({ queryKey: ['teams'], queryFn: getTeams })

  if (isLoading) return <div className="text-center py-20">Cargando equipos...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Equipos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.teams?.map(team => (
          <TeamCard key={team._id} team={team} />
        ))}
      </div>
    </div>
  )
}