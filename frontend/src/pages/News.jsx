import { useQuery } from '@tanstack/react-query'
import { getNews } from '../api/news.api'

export default function News() {
  const { data, isLoading } = useQuery({ queryKey: ['news'], queryFn: () => getNews() })

  if (isLoading) return <div className="text-center py-20">Cargando noticias...</div>

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8">Noticias</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data?.data?.news?.map(n => (
          <div key={n._id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <span className="text-xs text-orange-400 uppercase">{n.category}</span>
            <h3 className="font-bold text-xl mt-2">{n.title}</h3>
            <p className="text-gray-400 mt-3 leading-relaxed">{n.content}</p>
            <p className="text-gray-600 text-xs mt-4">Por {n.author?.name} · {new Date(n.createdAt).toLocaleDateString('es-CR')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}