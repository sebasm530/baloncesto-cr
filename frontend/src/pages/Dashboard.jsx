import { useAuth } from '../context/AuthContext'

export default function Dashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
      <p className="text-gray-400 mb-10">Bienvenido, {user?.name} · <span className="text-orange-400">{user?.role}</span></p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">⚽ Equipos</h3>
          <p className="text-gray-400 text-sm">Gestionar equipos del sistema</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">👤 Jugadores</h3>
          <p className="text-gray-400 text-sm">Registrar y editar jugadores</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">🏆 Torneos</h3>
          <p className="text-gray-400 text-sm">Crear y gestionar torneos</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">🏀 Partidos</h3>
          <p className="text-gray-400 text-sm">Registrar resultados de partidos</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">📊 Estadísticas</h3>
          <p className="text-gray-400 text-sm">Ver estadísticas del sistema</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="font-bold text-lg mb-2">📰 Noticias</h3>
          <p className="text-gray-400 text-sm">Publicar noticias y anuncios</p>
        </div>
      </div>
    </div>
  )
}