import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../api/tournaments.api'
import { Link } from 'react-router-dom'

export default function Tournaments() {
  const { data, isLoading } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })

  if (isLoading) return <div className="text-center py-20">Cargando torneos...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Torneos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.data?.tournaments?.map(t => (
          <Link key={t._id} to={`/tournaments/${t._id}`} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-orange-500 transition">
            <h3 className="font-bold text-xl">{t.name}</h3>
            <p className="text-orange-400 text-sm mt-1">{t.category} · {t.season}</p>
            <span className={`inline-block mt-3 text-xs px-3 py-1 rounded-full ${
              t.status === 'en curso' ? 'bg-green-900 text-green-400' :
              t.status === 'próximo' ? 'bg-blue-900 text-blue-400' :
              'bg-gray-800 text-gray-400'
            }`}>
              {t.status}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}