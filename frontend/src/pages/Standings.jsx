import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../api/tournaments.api'
import { getStandings, getPlayerStats } from '../api/stats.api'
import StandingsTable from '../components/StandingsTable'
import StatsChart from '../components/StatsChart'

export default function Standings() {
  const [selectedTournament, setSelectedTournament] = useState('')
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const { data: standingsData } = useQuery({ queryKey: ['standings', selectedTournament], queryFn: () => getStandings(selectedTournament), enabled: !!selectedTournament })
  const { data: statsData } = useQuery({ queryKey: ['playerStats', selectedTournament], queryFn: () => getPlayerStats(selectedTournament), enabled: !!selectedTournament })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Tabla de Posiciones</h1>
      <select
        className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 mb-8 text-white"
        value={selectedTournament}
        onChange={e => setSelectedTournament(e.target.value)}
      >
        <option value="">Seleccioná un torneo</option>
        {tournamentsData?.data?.tournaments?.map(t => (
          <option key={t._id} value={t._id}>{t.name} · {t.season}</option>
        ))}
      </select>
      {standingsData?.data?.standings && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl mb-10">
          <StandingsTable standings={standingsData.data.standings} />
        </div>
      )}
      {statsData?.data?.stats?.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-6">Estadísticas por jugador</h2>
          <StatsChart stats={statsData.data.stats} />
        </div>
      )}
    </div>
  )
}