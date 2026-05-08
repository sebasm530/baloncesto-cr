import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../api/teams.api'
import { getNews } from '../api/news.api'
import { getTournaments } from '../api/tournaments.api'
import TeamCard from '../components/TeamCard'
import { Link } from 'react-router-dom'

export default function Home() {
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const { data: newsData } = useQuery({ queryKey: ['news'], queryFn: () => getNews() })
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">🏀 Baloncesto <span className="text-orange-500">Costa Rica</span></h1>
        <p className="text-gray-400 text-lg">La plataforma oficial del baloncesto nacional</p>
        <div className="flex gap-4 justify-center mt-6">
          <Link to="/tournaments" className="bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-lg font-semibold transition">Ver Torneos</Link>
          <Link to="/standings" className="border border-gray-700 hover:border-orange-500 px-6 py-2.5 rounded-lg font-semibold transition">Tabla de Posiciones</Link>
        </div>
      </div>

      {/* Torneos activos */}
      {tournamentsData?.data?.tournaments?.length > 0 && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Torneos activos</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tournamentsData.data.tournaments.filter(t => t.status === 'en curso').map(t => (
              <Link key={t._id} to={`/tournaments/${t._id}`} className="bg-gray-900 border border-orange-500 rounded-xl p-5 hover:bg-gray-800 transition">
                <h3 className="font-bold text-lg">{t.name}</h3>
                <p className="text-orange-400 text-sm">{t.category} · {t.season}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Equipos */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Equipos</h2>
          <Link to="/teams" className="text-orange-400 hover:underline text-sm">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamsData?.data?.teams?.slice(0, 6).map(team => (
            <TeamCard key={team._id} team={team} />
          ))}
        </div>
      </section>

      {/* Noticias */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Últimas noticias</h2>
          <Link to="/news" className="text-orange-400 hover:underline text-sm">Ver todas →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {newsData?.data?.news?.slice(0, 4).map(n => (
            <div key={n._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <span className="text-xs text-orange-400 uppercase">{n.category}</span>
              <h3 className="font-bold mt-1">{n.title}</h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{n.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}