import { useQuery } from '@tanstack/react-query'
import { getNews } from '../api/news.api'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function News() {
  const { data, isLoading } = useQuery({ queryKey: ['news'], queryFn: () => getNews() })

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black mb-2">
            Noticias
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400">
            Las últimas novedades del baloncesto costarricense
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="glass rounded-xl border border-white/5 animate-pulse h-64" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.data?.news?.map((n, i) => (
              <motion.div key={n._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.02 }} className="glass rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
                {n.image && <img src={n.image} alt={n.title} className="w-full h-52 object-cover" />}
                <div className="p-6">
                  <span className="text-xs text-orange-400 uppercase font-bold tracking-wider">{n.category}</span>
                  <h3 className="font-black text-xl mt-2">{n.title}</h3>
                  <p className="text-gray-400 mt-3 leading-relaxed line-clamp-3">{n.content}</p>
                  <p className="text-gray-600 text-xs mt-4">
                    Por {n.author?.name} · {new Date(n.createdAt).toLocaleDateString('es-CR')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}