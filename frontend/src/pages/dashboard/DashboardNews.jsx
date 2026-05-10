import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNews, createNews, deleteNews } from '../../api/news.api'
import ImageUpload from '../../components/forms/ImageUpload'
import { motion } from 'framer-motion'

export default function DashboardNews() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['news-all'], queryFn: () => getNews() })
  const [form, setForm] = useState({ title: '', content: '', category: 'general', published: true, image: '' })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createNews,
    onSuccess: () => { queryClient.invalidateQueries(['news-all']); setForm({ title: '', content: '', category: 'general', published: true, image: '' }) },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear noticia')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNews,
    onSuccess: () => queryClient.invalidateQueries(['news-all'])
  })

  const handleSubmit = (e) => { e.preventDefault(); setError(''); createMutation.mutate(form) }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        Gestionar Noticias
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-orange-400">+ Nueva Noticia</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder="Título" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition">
            {['general','resultado','transferencia','torneo','selección'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <textarea placeholder="Contenido de la noticia..." value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={5} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition resize-none" required />
          <ImageUpload label="Subir imagen de la noticia" currentImage={form.image} onUpload={(url) => setForm({ ...form, image: url })} />
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} className="accent-orange-500" />
            <span className="text-sm text-gray-400">Publicar inmediatamente</span>
          </label>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending} className="bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
            {createMutation.isPending ? 'Publicando...' : 'Publicar Noticia'}
          </motion.button>
        </form>
      </div>

      <div className="flex flex-col gap-4">
        {data?.data?.news?.map((n, i) => (
          <motion.div key={n._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition overflow-hidden">
            {n.image && <img src={n.image} alt={n.title} className="w-full h-40 object-cover" />}
            <div className="p-5 flex justify-between items-start">
              <div>
                <span className="text-xs text-orange-400 uppercase font-bold tracking-wider">{n.category}</span>
                <h3 className="font-bold mt-1">{n.title}</h3>
                <p className="text-gray-400 text-sm mt-1 line-clamp-2">{n.content}</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteMutation.mutate(n._id)} className="ml-4 text-red-400 text-sm border border-red-500/30 hover:border-red-400 px-3 py-1 rounded-lg transition shrink-0">
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}