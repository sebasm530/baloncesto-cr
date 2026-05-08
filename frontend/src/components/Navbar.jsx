import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-orange-500 font-bold text-xl">
          🏀 Baloncesto CR
        </Link>
        <div className="flex gap-6 text-sm">
          <Link to="/teams" className="hover:text-orange-400 transition">Equipos</Link>
          <Link to="/players" className="hover:text-orange-400 transition">Jugadores</Link>
          <Link to="/tournaments" className="hover:text-orange-400 transition">Torneos</Link>
          <Link to="/standings" className="hover:text-orange-400 transition">Posiciones</Link>
          <Link to="/news" className="hover:text-orange-400 transition">Noticias</Link>
        </div>
        <div className="flex gap-3 text-sm">
          {user ? (
            <>
              {(user.role === 'admin' || user.role === 'coach') && (
                <Link to="/dashboard" className="hover:text-orange-400 transition">Dashboard</Link>
              )}
              <button onClick={handleLogout} className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg transition">
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg transition">
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}