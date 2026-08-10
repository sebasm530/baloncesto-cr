import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getTeams } from '../api/teams.api'
import TeamCard from '../components/TeamCard'
import { motion } from 'framer-motion'
import ListControls from '../components/ListControls'
import { useLanguage } from '../context/LanguageContext'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' }
  })
}

export default function Teams() {
  const { t } = useLanguage()
  const { data, isLoading } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const teams = data?.data?.teams || []
  const filteredTeams = teams.filter((team) => `${team.name} ${team.shortName} ${team.city} ${team.province}`.toLowerCase().includes(query.toLowerCase()))
  const paginatedTeams = filteredTeams.slice((page - 1) * 6, page * 6)

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
            {t('teams.title')}
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-400">
            {t('teams.description')}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass rounded-xl p-5 border border-white/5 animate-pulse h-24" />
            ))}
          </div>
        ) : (
          <>
          <ListControls query={query} onQueryChange={handleSearch} totalItems={filteredTeams.length} page={page} onPageChange={setPage} itemName={t('teams.itemName')} />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedTeams.map((team, i) => (
              <motion.div key={team._id} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.97 }}>
                <TeamCard team={team} />
              </motion.div>
            ))}
          </div>
          {filteredTeams.length === 0 && <p className="text-center text-gray-500 py-12">{t('teams.noResults')}</p>}
          </>
        )}
      </div>
    </div>
  )
}
