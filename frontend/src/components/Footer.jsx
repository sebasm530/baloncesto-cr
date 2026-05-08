export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 py-6 text-center text-gray-500 text-sm">
      <p>🏀 Baloncesto CR — Plataforma nacional de baloncesto costarricense</p>
      <p className="mt-1">© {new Date().getFullYear()} Todos los derechos reservados</p>
    </footer>
  )
}