import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import DashboardTeams from './dashboard/DashboardTeams'
import DashboardPlayers from './dashboard/DashboardPlayers'
import DashboardTournaments from './dashboard/DashboardTournaments'
import DashboardGames from './dashboard/DashboardGames'
import DashboardNews from './dashboard/DashboardNews'

const tabs = [
  { id: 'teams', label: '🏀 Equipos' },
  { id: 'players', label: '👤 Jugadores' },
  { id: 'tournaments', label: '🏆 Torneos' },
  { id: 'games', label: '⚽ Partidos' },
  { id: 'news', label: '📰 Noticias' },
]

export default function Dashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('teams')

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
      <p className="text-gray-400 mb-8">Bienvenido, {user?.name} · <span className="text-orange-400">{user?.role}</span></p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition ${activeTab === tab.id ? 'bg-orange-500 text-white' : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido */}
      {activeTab === 'teams' && <DashboardTeams />}
      {activeTab === 'players' && <DashboardPlayers />}
      {activeTab === 'tournaments' && <DashboardTournaments />}
      {activeTab === 'games' && <DashboardGames />}
      {activeTab === 'news' && <DashboardNews />}
    </div>
  )
}