import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getNews, reactToNews } from '../api/news.api'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function News() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['news'], queryFn: () => getNews() })

  const reactionMutation = useMutation({
    mutationFn: ({ id, type }) => reactToNews(id, type),
    onSuccess: () => queryClient.invalidateQueries(['news'])
  })

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
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 animate-pulse h-64" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data?.data?.news?.map((n, i) => {
              const liked = user && n.likes?.some(id => id === user.id || id === user._id)
              const disliked = user && n.dislikes?.some(id => id === user.id || id === user._id)

              return (
                <motion.div
                  key={n._id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className="glass rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition flex flex-col"
                >
                  {n.image && (
                    <img src={n.image} alt={n.title} className="w-full h-52 object-cover" />
                  )}
                  <div className="p-6 flex flex-col flex-1">
                    <span className="text-xs text-orange-400 uppercase font-bold tracking-wider">{n.category}</span>
                    <h3 className="font-black text-xl mt-2">{n.title}</h3>
                    <p className="text-gray-400 mt-3 leading-relaxed line-clamp-3 flex-1">{n.content}</p>
                    <p className="text-gray-600 text-xs mt-4">
                      Por {n.author?.name} · {new Date(n.createdAt).toLocaleDateString('es-CR')}
                    </p>

                    {/* Reactions */}
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-white/5">
                      {user ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => reactionMutation.mutate({ id: n._id, type: 'like' })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
                              liked
                                ? 'bg-green-500/20 text-green-400 border border-green-500/40'
                                : 'glass border border-white/10 hover:border-green-500/40 text-gray-400 hover:text-green-400'
                            }`}
                          >
                            <span className="text-lg">👍</span>
                            <span>{n.likes?.length || 0}</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => reactionMutation.mutate({ id: n._id, type: 'dislike' })}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition ${
                              disliked
                                ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                                : 'glass border border-white/10 hover:border-red-500/40 text-gray-400 hover:text-red-400'
                            }`}
                          >
                            <span className="text-lg">👎</span>
                            <span>{n.dislikes?.length || 0}</span>
                          </motion.button>
                        </>
                      ) : (
                        <Link to="/login" className="text-gray-500 text-xs hover:text-orange-400 transition flex items-center gap-1">
                          <span>👍</span>
                          <span>{n.likes?.length || 0}</span>
                          <span className="mx-1">·</span>
                          <span>👎</span>
                          <span>{n.dislikes?.length || 0}</span>
                          <span className="ml-2">— Iniciá sesión para reaccionar</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}