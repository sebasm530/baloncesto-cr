import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/30 mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <img src="/logo.png" alt="Zona Basket CR" className="h-12 w-auto mx-auto md:mx-0" />
            <p className="text-gray-500 text-sm mt-2">La plataforma oficial del baloncesto costarricense</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link to="/teams" className="hover:text-orange-400 transition">Equipos</Link>
            <Link to="/players" className="hover:text-orange-400 transition">Jugadores</Link>
            <Link to="/tournaments" className="hover:text-orange-400 transition">Torneos</Link>
            <Link to="/standings" className="hover:text-orange-400 transition">Posiciones</Link>
          </div>
        </div>
        <div className="border-t border-white/5 mt-8 pt-6 text-center text-gray-600 text-xs">
          © {new Date().getFullYear()} Zona Basket CR — Todos los derechos reservados
        </div>
      </div>
    </footer>
  )
}