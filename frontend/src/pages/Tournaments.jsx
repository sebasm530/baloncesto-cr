import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../api/tournaments.api'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Tournaments() {
  const { data, isLoading } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-16 relative">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl font-black mb-2">
            Torneos
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400">
            Ligas y competencias del baloncesto costarricense
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <div key={i} className="glass rounded-xl p-6 border border-white/5 animate-pulse h-32" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.data?.tournaments?.map((t, i) => (
              <motion.div key={t._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                <Link to={`/tournaments/${t._id}`} className={`glass rounded-xl p-6 border transition block ${t.status === 'en curso' ? 'border-orange-500/30 hover:border-orange-500' : 'border-white/5 hover:border-orange-500/30'}`}>
                  {t.status === 'en curso' && (
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs font-semibold">EN CURSO</span>
                    </div>
                  )}
                  <h3 className="font-black text-xl">{t.name}</h3>
                  <p className="text-orange-400 text-sm mt-1">{t.category} · {t.season}</p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${
                      t.status === 'en curso' ? 'bg-green-900/50 text-green-400' :
                      t.status === 'próximo' ? 'bg-blue-900/50 text-blue-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>{t.status}</span>
                    <span className="text-gray-500 text-xs">{t.teams?.length || 0} equipos</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}