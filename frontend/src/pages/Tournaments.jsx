import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTournaments } from '../api/tournaments.api'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ListControls from '../components/ListControls'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Tournaments() {
  const { data, isLoading } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const tournaments = data?.data?.tournaments || []
  const filteredTournaments = tournaments.filter((tournament) => `${tournament.name} ${tournament.season} ${tournament.category} ${tournament.status}`.toLowerCase().includes(query.toLowerCase()))
  const paginatedTournaments = filteredTournaments.slice((page - 1) * 6, page * 6)

  const handleSearch = (value) => {
    setQuery(value)
    setPage(1)
  }

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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass rounded-xl border border-white/5 animate-pulse h-48" />
            ))}
          </div>
        ) : (
          <>
          <ListControls query={query} onQueryChange={handleSearch} totalItems={filteredTournaments.length} page={page} onPageChange={setPage} itemName="torneos" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTournaments.map((t, i) => (
              <motion.div
                key={t._id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ scale: 1.03, y: -4 }}
                whileTap={{ scale: 0.97 }}
                className="h-full"
              >
                <Link
                  to={`/tournaments/${t._id}`}
                  className={`glass rounded-xl p-6 border transition block h-full flex flex-col justify-between ${
                    t.status === 'en curso'
                      ? 'border-orange-500/30 hover:border-orange-500'
                      : 'border-white/5 hover:border-orange-500/30'
                  }`}
                >
                  {/* Top */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                        t.status === 'en curso' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                        t.status === 'próximo' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}>
                        {t.status === 'en curso' && <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5 animate-pulse" />}
                        {t.status}
                      </span>
                      <span className="text-gray-500 text-xs">{t.season}</span>
                    </div>
                    <h3 className="font-black text-xl leading-tight mb-2">{t.name}</h3>
                    <p className="text-orange-400 text-sm">{t.category}</p>
                  </div>

                  {/* Bottom */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🏀</span>
                      <div>
                        <p className="text-white font-bold text-sm">{t.teams?.length || 0}</p>
                        <p className="text-gray-500 text-xs">equipos</p>
                      </div>
                    </div>
                    <span className="text-orange-400 text-sm font-semibold">Ver detalles →</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {filteredTournaments.length === 0 && <p className="text-center text-gray-500 py-12">No se encontraron torneos.</p>}
          </>
        )}
      </div>
    </div>
  )
}
