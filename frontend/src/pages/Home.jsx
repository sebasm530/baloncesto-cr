import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../api/teams.api'
import { getNews } from '../api/news.api'
import { getTournaments } from '../api/tournaments.api'
import TeamCard from '../components/TeamCard'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Home() {
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const { data: newsData } = useQuery({ queryKey: ['news'], queryFn: () => getNews() })
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })

  const activeTournaments = tournamentsData?.data?.tournaments?.filter(t => t.status === 'en curso') || []

  return (
    <div className="bg-premium min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center relative">
          <motion.img
            src="/logo.png"
            alt="Zona Basket CR"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="w-64 md:w-80 mx-auto mb-8"
          />
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-gray-400 text-xl mb-10"
          >
            La plataforma oficial del baloncesto nacional
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link to="/tournaments">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-orange-500 hover:bg-orange-600 px-8 py-3 rounded-xl font-bold text-lg transition glow">
                Ver Torneos
              </motion.div>
            </Link>
            <Link to="/standings">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="glass hover:border-orange-500/50 px-8 py-3 rounded-xl font-bold text-lg transition border border-white/10">
                Tabla de Posiciones
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Stats banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="border-y border-white/5 bg-white/2"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-3 gap-4 text-center">
          {[
            { label: 'Equipos', value: teamsData?.data?.teams?.length || 0 },
            { label: 'Torneos activos', value: activeTournaments.length },
            { label: 'Noticias', value: newsData?.data?.news?.length || 0 },
          ].map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
              <p className="text-3xl font-black text-orange-500">{stat.value}</p>
              <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Torneos activos */}
        {activeTournaments.length > 0 && (
          <section className="mb-16">
            <motion.h2 variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-2xl font-black mb-6 flex items-center gap-2">
              <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
              Torneos en curso
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeTournaments.map((t, i) => (
                <motion.div key={t._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link to={`/tournaments/${t._id}`} className="glass rounded-xl p-5 border border-orange-500/30 hover:border-orange-500 transition block glow">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-green-400 text-xs font-semibold">EN CURSO</span>
                    </div>
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-orange-400 text-sm">{t.category} · {t.season}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Equipos */}
        <section className="mb-16">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
              Equipos
            </h2>
            <Link to="/teams" className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition">Ver todos →</Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teamsData?.data?.teams?.slice(0, 6).map((team, i) => (
              <motion.div key={team._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                <TeamCard team={team} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Noticias */}
        <section>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black flex items-center gap-2">
              <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
              Últimas noticias
            </h2>
            <Link to="/news" className="text-orange-400 hover:text-orange-300 text-sm font-semibold transition">Ver todas →</Link>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newsData?.data?.news?.slice(0, 4).map((n, i) => (
              <motion.div key={n._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.02 }} className="glass rounded-xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition cursor-pointer">
                {n.image && <img src={n.image} alt={n.title} className="w-full h-40 object-cover" />}
                <div className="p-5">
                  <span className="text-xs text-orange-400 uppercase font-semibold">{n.category}</span>
                  <h3 className="font-bold mt-1">{n.title}</h3>
                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">{n.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}