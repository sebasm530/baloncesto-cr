import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLoading } from '../context/LoadingContext'
import DashboardTeams from './dashboard/DashboardTeams'
import DashboardPlayers from './dashboard/DashboardPlayers'
import DashboardTournaments from './dashboard/DashboardTournaments'
import DashboardGames from './dashboard/DashboardGames'
import DashboardNews from './dashboard/DashboardNews'
import DashboardUsers from './dashboard/DashboardUsers'
import { motion } from 'framer-motion'

export default function Dashboard() {
  const { user } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const [activeTab, setActiveTab] = useState('teams')

  const handleTabChange = (tabId) => {
    showLoading('Cargando...')
    setTimeout(() => {
      setActiveTab(tabId)
      hideLoading()
    }, 500)
  }

  const tabs = [
    { id: 'teams', label: '🏀 Equipos' },
    { id: 'players', label: '👤 Jugadores' },
    { id: 'tournaments', label: '🏆 Torneos' },
    { id: 'games', label: '⚽ Partidos' },
    { id: 'news', label: '📰 Noticias' },
    ...(user?.role === 'admin' ? [{ id: 'users', label: '🔐 Usuarios' }] : [])
  ]

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 py-12 relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-black text-lg">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-black">Dashboard</h1>
                <p className="text-gray-400 text-sm">Bienvenido, {user?.name} · <span className="text-orange-400 font-semibold">{user?.role}</span></p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-2 mt-6 overflow-x-auto pb-1">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition ${
                  activeTab === tab.id
                    ? 'bg-orange-500 text-white glow'
                    : 'glass text-gray-400 hover:text-white border border-white/10'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'teams' && <DashboardTeams />}
          {activeTab === 'players' && <DashboardPlayers />}
          {activeTab === 'tournaments' && <DashboardTournaments />}
          {activeTab === 'games' && <DashboardGames />}
          {activeTab === 'news' && <DashboardNews />}
          {activeTab === 'users' && <DashboardUsers />}
        </motion.div>
      </div>
    </div>
  )
}