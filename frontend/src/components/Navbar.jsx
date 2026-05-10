import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const links = [
    { to: '/teams', label: 'Equipos' },
    { to: '/players', label: 'Jugadores' },
    { to: '/tournaments', label: 'Torneos' },
    { to: '/standings', label: 'Posiciones' },
    { to: '/news', label: 'Noticias' },
  ]

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-50 glass border-b border-white/5"
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/">
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center">
            <img src="/logo.png" alt="Zona Basket CR" className="h-10 w-auto" />
          </motion.div>
        </Link>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(link => (
            <Link key={link.to} to={link.to}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === link.to
                    ? 'bg-orange-500/20 text-orange-400'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-gray-300">{user.name}</span>
              </div>
              {(user.role === 'admin' || user.role === 'coach') && (
                <Link to="/dashboard">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="text-sm text-orange-400 hover:text-orange-300 transition">
                    Dashboard
                  </motion.div>
                </Link>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-lg text-sm font-semibold transition glow"
              >
                Salir
              </motion.button>
            </>
          ) : (
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-lg text-sm font-semibold transition glow"
              >
                Iniciar sesión
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  )
}