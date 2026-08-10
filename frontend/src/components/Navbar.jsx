import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const { language, t, toggleLanguage } = useLanguage()
  const navigate = useNavigate()
  const location = useLocation()
  const [profileOpen, setProfileOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setProfileOpen(false)
    setMenuOpen(false)
  }

  const closeMenu = () => setMenuOpen(false)

  const links = [
    { to: '/teams', label: 'Equipos', icon: '🏀' },
    { to: '/players', label: 'Jugadores', icon: '👤' },
    { to: '/tournaments', label: 'Torneos', icon: '🏆' },
    { to: '/standings', label: 'Posiciones', icon: '📊' },
    { to: '/stats', label: 'Estadísticas', icon: '📈' },
    { to: '/news', label: 'Noticias', icon: '📰' },
  ]
  const navigationLabels = {
    '/teams': t('nav.teams'),
    '/players': t('nav.players'),
    '/tournaments': t('nav.tournaments'),
    '/standings': t('nav.standings'),
    '/stats': t('nav.stats'),
    '/news': t('nav.news')
  }

  return (
    <>
      <div className="bg-orange-500 h-1 w-full" />
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="theme-navbar sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/5"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center h-16 gap-3 sm:gap-6">

            {/* Logo + Nombre */}
            <Link to="/" className="flex items-center gap-3 shrink-0">
              <motion.img
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                src="/logo.png"
                alt="Zona Basket CR"
                className="h-11 w-auto"
              />
              <div className="hidden md:block">
                <p className="font-black text-base leading-none">
                  <span className="text-white">Zona</span>
                  <span className="text-orange-500"> Basket</span>
                </p>
                <p className="text-orange-400 font-bold text-xs tracking-widest">COSTA RICA</p>
              </div>
            </Link>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/10 shrink-0" />

            {/* Links */}
            <div className="hidden md:flex items-center gap-1 flex-1">
              {links.map(link => {
                const isActive = location.pathname === link.to
                return (
                  <Link key={link.to} to={link.to}>
                    <motion.div
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-3 py-2 group"
                    >
                      <span className={`text-sm font-bold tracking-wide transition-all flex items-center gap-1.5 ${isActive ? 'text-orange-400' : 'text-gray-400 group-hover:text-white'}`}>
                        <span className="text-base">{link.icon}</span>
                        {navigationLabels[link.to]}
                      </span>
                      {isActive && (
                        <motion.div
                          layoutId="activeLink"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500 rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      {!isActive && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/20 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform origin-center" />
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </div>

            {/* Auth — siempre al final */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto shrink-0">
              <motion.button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                whileTap={{ scale: 0.95 }}
                aria-expanded={menuOpen}
                aria-label="Abrir menú de navegación"
                className="md:hidden glass border border-white/10 w-10 h-10 rounded-xl flex items-center justify-center text-xl transition"
              >
                <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
              </motion.button>
              <motion.button
                type="button"
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
                title={language === 'es' ? 'Cambiar a inglés' : 'Switch to Spanish'}
                className="glass border border-white/10 hover:border-orange-500/50 min-w-10 h-10 px-2 rounded-xl flex items-center justify-center text-sm font-black transition"
              >
                {language.toUpperCase()}
              </motion.button>
              <motion.button
                type="button"
                onClick={toggleTheme}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isDark ? 'Activar modo claro' : 'Activar modo oscuro'}
                title={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
                className="theme-toggle glass border border-white/10 hover:border-orange-500/50 w-10 h-10 rounded-xl flex items-center justify-center text-lg transition"
              >
                <span aria-hidden="true">{isDark ? '☀️' : '🌙'}</span>
              </motion.button>
              {user ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-3 glass border border-white/10 hover:border-orange-500/50 px-3 py-2 rounded-xl transition"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-sm">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-bold leading-none">{user.name}</p>
                      <p className="text-xs text-orange-400 mt-0.5">{user.role}</p>
                    </div>
                    <motion.span animate={{ rotate: profileOpen ? 180 : 0 }} className="text-gray-400 text-xs">▼</motion.span>
                  </motion.button>

                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 top-full mt-2 w-48 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                      >
                        <Link to="/profile" onClick={() => setProfileOpen(false)}>
                          <div className="px-4 py-3 hover:bg-white/5 transition flex items-center gap-2 text-sm font-semibold">
                            Mi perfil
                          </div>
                        </Link>
                        {(user.role === 'admin' || user.role === 'coach') && (
                          <Link to="/dashboard" onClick={() => setProfileOpen(false)}>
                            <div className="px-4 py-3 hover:bg-white/5 transition flex items-center gap-2 text-sm font-semibold">
                              ⚙️ Dashboard
                            </div>
                          </Link>
                        )}
                        <div className="border-t border-white/5" />
                        <button onClick={handleLogout} className="w-full px-4 py-3 hover:bg-red-500/10 transition flex items-center gap-2 text-sm font-semibold text-red-400">
                          🚪 Cerrar sesión
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-xl text-sm font-bold transition glow"
                  >
                    Iniciar sesión
                  </motion.div>
                </Link>
              )}
            </div>

          </div>
        </div>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-t border-white/5"
            >
              <div className="grid grid-cols-2 gap-1 px-4 py-3">
                {links.map(link => {
                  const isActive = location.pathname === link.to
                  return (
                    <Link key={link.to} to={link.to} onClick={closeMenu} className={`flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-bold transition ${isActive ? 'bg-orange-500/15 text-orange-400' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                      <span>{link.icon}</span>{navigationLabels[link.to]}
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  )
}
