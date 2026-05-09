import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNews, createNews, deleteNews } from '../../api/news.api'

export default function DashboardNews() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['news-all'], queryFn: () => getNews() })
  const [form, setForm] = useState({ title: '', content: '', category: 'general', published: true })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => {
      queryClient.invalidateQueries(['news-all'])
      setForm({ title: '', content: '', category: 'general', published: true })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear noticia')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => queryClient.invalidateQueries(['news-all'])
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(form)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestionar Noticias</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Nueva Noticia</h3>
        {error && <p className="bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500">
            {['general','resultado','transferencia','torneo','selección'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea placeholder="Contenido de la noticia..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none" required />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-orange-500" />
            <span className="text-sm text-gray-400">Publicar inmediatamente</span>
          </label>
          <button type="submit" disabled={createMutation.isPending} className="bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
            {createMutation.isPending ? 'Publicando...' : 'Publicar Noticia'}
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {data?.data?.news?.map(n => (
          <div key={n._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-start">
            <div>
              <span className="text-xs text-orange-400 uppercase">{n.category}</span>
              <h3 className="font-bold mt-1">{n.title}</h3>
              <p className="text-gray-400 text-sm mt-1 line-clamp-2">{n.content}</p>
            </div>
            <button onClick={() => deleteMutation.mutate(n._id)} className="ml-4 text-red-400 hover:text-red-300 text-sm border border-red-900 hover:border-red-400 px-3 py-1 rounded-lg transition shrink-0">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}