import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function Footer() {
  const links = [
    { to: '/teams', label: 'Equipos' },
    { to: '/players', label: 'Jugadores' },
    { to: '/tournaments', label: 'Torneos' },
    { to: '/standings', label: 'Posiciones' },
    { to: '/stats', label: 'Estadísticas' },
    { to: '/news', label: 'Noticias' },
  ]

  return (
    <footer className="border-t border-white/5 bg-black/30 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Logo y descripción */}
          <div className="flex flex-col gap-4">
            <Link to="/">
              <motion.img
                whileHover={{ scale: 1.05 }}
                src="/logo.png"
                alt="Zona Basket CR"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              La plataforma oficial del baloncesto costarricense. Equipos, jugadores, torneos y estadísticas en un solo lugar.
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-xs font-semibold">Plataforma activa</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-orange-400 mb-4">Navegación</h4>
            <div className="flex flex-col gap-2">
              {links.map(link => (
                <Link key={link.to} to={link.to} className="text-gray-400 hover:text-white text-sm transition hover:translate-x-1 inline-block">
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-black text-sm uppercase tracking-wider text-orange-400 mb-4">Zona Basket CR</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <p>🏀 Baloncesto nacional de Costa Rica</p>
              <p>🏆 Torneos, ligas y competencias</p>
              <p>📊 Estadísticas en tiempo real</p>
              <p>📰 Noticias y novedades</p>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} Zona Basket CR — Todos los derechos reservados
          </p>
          <p className="text-gray-600 text-xs">
            Hecho con 🏀 para el baloncesto costarricense
          </p>
        </div>
      </div>
    </footer>
  )
}
