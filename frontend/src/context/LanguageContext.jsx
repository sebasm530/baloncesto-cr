import { createContext, useContext, useEffect, useState } from 'react'

const translations = {
  es: {
    nav: { teams: 'Equipos', players: 'Jugadores', tournaments: 'Torneos', standings: 'Posiciones', stats: 'Estadísticas', news: 'Noticias', login: 'Iniciar sesión', profile: 'Mi perfil', logout: 'Cerrar sesión', openMenu: 'Abrir menú de navegación', lightMode: 'Activar modo claro', darkMode: 'Activar modo oscuro' },
    footer: { description: 'La plataforma oficial del baloncesto costarricense. Equipos, jugadores, torneos y estadísticas en un solo lugar.', active: 'Plataforma activa', navigation: 'Navegación', national: 'Baloncesto nacional de Costa Rica', competitions: 'Torneos, ligas y competencias', realtime: 'Estadísticas en tiempo real', updates: 'Noticias y novedades', rights: 'Todos los derechos reservados', madeWith: 'Hecho con 🏀 para el baloncesto costarricense' },
    home: { tagline: 'La plataforma oficial del baloncesto nacional', viewTournaments: 'Ver torneos', standings: 'Tabla de posiciones', activeTournaments: 'Torneos activos', ongoingTournaments: 'Torneos en curso', ongoing: 'EN CURSO', teams: 'Equipos', news: 'Noticias', latestNews: 'Últimas noticias', viewAll: 'Ver todos →', viewAllF: 'Ver todas →' },
    teams: { title: 'Equipos', description: 'Todos los equipos del baloncesto costarricense', noResults: 'No se encontraron equipos.', itemName: 'equipos' },
    players: { title: 'Jugadores', description: 'Todos los jugadores del baloncesto costarricense', allTeams: 'Todos los equipos', allPositions: 'Todas las posiciones', clearFilters: 'Limpiar filtros ✕', found: 'jugadores encontrados' },
    controls: { search: 'Buscar', previous: 'Anterior', next: 'Siguiente', results: 'resultados' }
  },
  en: {
    nav: { teams: 'Teams', players: 'Players', tournaments: 'Tournaments', standings: 'Standings', stats: 'Statistics', news: 'News', login: 'Log in', profile: 'My profile', logout: 'Log out', openMenu: 'Open navigation menu', lightMode: 'Enable light mode', darkMode: 'Enable dark mode' },
    footer: { description: 'The official platform for Costa Rican basketball. Teams, players, tournaments, and statistics in one place.', active: 'Platform active', navigation: 'Navigation', national: 'Costa Rican basketball', competitions: 'Tournaments, leagues and competitions', realtime: 'Real-time statistics', updates: 'News and updates', rights: 'All rights reserved', madeWith: 'Made with 🏀 for Costa Rican basketball' },
    home: { tagline: 'The official platform for national basketball', viewTournaments: 'View tournaments', standings: 'Standings', activeTournaments: 'Active tournaments', ongoingTournaments: 'Ongoing tournaments', ongoing: 'ONGOING', teams: 'Teams', news: 'News', latestNews: 'Latest news', viewAll: 'View all →', viewAllF: 'View all →' },
    teams: { title: 'Teams', description: 'All Costa Rican basketball teams', noResults: 'No teams found.', itemName: 'teams' },
    players: { title: 'Players', description: 'All Costa Rican basketball players', allTeams: 'All teams', allPositions: 'All positions', clearFilters: 'Clear filters ✕', found: 'players found' },
    controls: { search: 'Search', previous: 'Previous', next: 'Next', results: 'results' }
  }
}

// Text that is rendered by existing screens and form controls. Keeping this here
// lets every current route react to the language switch, including admin screens.
const pageTranslations = {
  'La plataforma oficial del baloncesto nacional': 'The official platform for national basketball',
  'La plataforma oficial del baloncesto costarricense. Equipos, jugadores, torneos y estadísticas en un solo lugar.': 'The official platform for Costa Rican basketball. Teams, players, tournaments, and statistics in one place.',
  'Iniciar sesión': 'Log in', 'Cerrar sesión': 'Log out', 'Mi perfil': 'My profile',
  'Plataforma activa': 'Platform active', 'Navegación': 'Navigation',
  'Baloncesto nacional de Costa Rica': 'Costa Rican basketball', 'Torneos, ligas y competencias': 'Tournaments, leagues and competitions',
  'Estadísticas en tiempo real': 'Real-time statistics', 'Noticias y novedades': 'News and updates',
  'Todos los derechos reservados': 'All rights reserved', 'Hecho con 🏀 para el baloncesto costarricense': 'Made with 🏀 for Costa Rican basketball',
  'Buscar': 'Search', 'Anterior': 'Previous', 'Siguiente': 'Next', 'Página': 'Page', 'de': 'of',
  'Todos los equipos': 'All teams', 'Todas las posiciones': 'All positions', 'Limpiar filtros ✕': 'Clear filters ✕',
  'Seleccioná un torneo': 'Select a tournament', 'Seleccioná una competición': 'Select a competition',
  'Seleccioná un torneo para ver la tabla de posiciones': 'Select a tournament to view the standings',
  'para ver los líderes estadísticos': 'to view the statistical leaders',
  'No hay datos disponibles': 'No data available', 'No se encontraron equipos.': 'No teams found.', 'No se encontraron torneos.': 'No tournaments found.',
  'No hay partidos registrados en este torneo.': 'There are no games registered in this tournament.',
  'Aún no hay estadísticas registradas para este equipo.': 'There are no statistics registered for this team yet.',
  'Por definir': 'To be determined', 'Equipos': 'Teams', 'Jugadores': 'Players', 'Torneos': 'Tournaments',
  'Posiciones': 'Standings', 'Estadísticas': 'Statistics', 'Noticias': 'News', 'Partidos': 'Games',
  'Últimas noticias': 'Latest news', 'Ver todos →': 'View all →', 'Ver todas →': 'View all →', 'Ver detalles →': 'View details →',
  'Nombre completo': 'Full name', 'Contraseña': 'Password', 'Confirmar contraseña': 'Confirm password',
  '¿Cómo querés ingresar?': 'How would you like to sign in?', 'Verificación de identidad': 'Identity verification',
  'Enviamos un código de 6 dígitos a tu email. Ingresalo para continuar.': 'We sent a 6-digit code to your email. Enter it to continue.',
  'Enviar código nuevamente': 'Resend code', 'Volver': 'Back', 'Crear cuenta': 'Create account',
  '¿Ya tenés una cuenta?': 'Already have an account?', '¿No tenés cuenta?': "Don't have an account?",
  'Número de camiseta': 'Jersey number', 'Nacionalidad': 'Nationality', 'Altura (cm)': 'Height (cm)', 'Peso (kg)': 'Weight (kg)',
  'Seleccioná un equipo': 'Select a team', 'Nombre del equipo': 'Team name', 'Nombre corto (ej: HAL)': 'Short name (e.g. HAL)',
  'Ciudad': 'City', 'Nuevo torneo': 'New tournament', 'Nombre del torneo': 'Tournament name', 'Temporada (ej: 2026)': 'Season (e.g. 2026)',
  'Estado inicial': 'Initial status', 'Próximo': 'Upcoming', 'En curso': 'Ongoing', 'Finalizado': 'Finished',
  'Equipos participantes:': 'Participating teams:', 'Programar Partido': 'Schedule game', 'Equipo local': 'Home team',
  'Equipo visitante': 'Away team', 'Lugar del partido': 'Game location', 'Seleccioná un partido': 'Select a game',
  'Registrar resultado y estadísticas': 'Record result and statistics', 'Cancelar': 'Cancel', 'Guardar': 'Save',
  'Editar': 'Edit', 'Eliminar': 'Delete', 'Nuevo Jugador': 'New player', 'Nuevo Equipo': 'New team',
  'Nueva Noticia': 'New article', 'Título': 'Title', 'Contenido de la noticia...': 'News content...',
  'Subir foto': 'Upload photo', 'Cambiar foto': 'Change photo', 'Subir imagen de la noticia': 'Upload news image',
  'Publicar inmediatamente': 'Publish immediately', 'Administrador': 'Administrator', 'Entrenador / Coach': 'Coach',
  'Nuevo Usuario Administrador': 'New administrator user', 'Eliminar cuenta': 'Delete account',
  'Contraseña actual': 'Current password', 'Nueva contraseña': 'New password', 'Confirmá la nueva contraseña': 'Confirm new password',
  'Posición': 'Position', 'Número': 'Number', 'Altura': 'Height', 'Peso': 'Weight', 'Equipo': 'Team',
  'Jugador': 'Player', 'Bienvenido,': 'Welcome,',
  'Ligas y competencias del baloncesto costarricense': 'Costa Rican basketball leagues and competitions',
  'Las últimas novedades del baloncesto costarricense': 'The latest news from Costa Rican basketball',
  'Base': 'Point guard', 'Escolta': 'Shooting guard', 'Alero': 'Small forward', 'Ala-Pívot': 'Power forward', 'Pívot': 'Center',
  'próximo': 'upcoming', 'en curso': 'ongoing', 'finalizado': 'finished', 'Nacional': 'National',
  'Estudiantil': 'Student', 'Femenino': "Women's", 'Juvenil': 'Youth', 'equipos': 'teams',
  'Ingresar como administrador': 'Sign in as administrator', 'Ingresar como usuario': 'Sign in as user',
  'Acceso administrador': 'Administrator access', 'Ingresá tus credenciales de administrador': 'Enter your administrator credentials',
  'Ingresá a tu cuenta de usuario': 'Sign in to your user account', 'Completá el formulario para registrarte': 'Complete the form to register',
  'Ingresar': 'Sign in', 'Procesando...': 'Processing...', 'Verificando...': 'Verifying...', 'Verificar código': 'Verify code',
  '¿No recibiste el código? Reenviar': "Didn't receive the code? Resend", 'Reenviando...': 'Resending...', 'Volver al inicio': 'Back to start',
  'Registrate gratis': 'Register for free',
  'Panel de coach': 'Coach dashboard', 'Jugadores de tu equipo': 'Players on your team',
  'Torneos en los que participa': 'Participating tournaments', 'Próximos partidos': 'Upcoming games',
  'Ver todos →': 'View all →', 'No hay jugadores activos registrados para este equipo.': 'There are no active players registered for this team.',
  'Tu equipo no participa actualmente en ningún torneo.': 'Your team is not currently participating in any tournament.',
  'No hay partidos próximos programados para tu equipo.': 'There are no upcoming games scheduled for your team.',
  'Equipo:': 'Team:', 'Sin asignar': 'Unassigned', 'Seleccioná el equipo que entrena': 'Select the team they coach',
  'Asignar equipo': 'Assign team'
}

const textSources = new WeakMap()
const attributeSources = new WeakMap()

function translateDocument(language) {
  const root = document.getElementById('root')
  if (!root) return
  const translate = (text) => language === 'en' ? (pageTranslations[text] || text) : text
  const applyText = (node) => {
    const source = textSources.get(node) ?? node.nodeValue
    textSources.set(node, source)
    const leading = source.match(/^\s*/)?.[0] || ''
    const trailing = source.match(/\s*$/)?.[0] || ''
    node.nodeValue = `${leading}${translate(source.trim())}${trailing}`
  }
  const applyAttributes = (element) => {
    for (const name of ['placeholder', 'title', 'aria-label']) {
      if (!element.hasAttribute(name)) continue
      const saved = attributeSources.get(element) || {}
      const source = saved[name] ?? element.getAttribute(name)
      saved[name] = source
      attributeSources.set(element, saved)
      element.setAttribute(name, translate(source))
    }
  }
  const apply = (node) => {
    if (node.nodeType === Node.TEXT_NODE) applyText(node)
    if (node.nodeType === Node.ELEMENT_NODE) {
      applyAttributes(node)
      node.childNodes.forEach(apply)
    }
  }
  apply(root)
}

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'es')

  useEffect(() => {
    localStorage.setItem('language', language)
    document.documentElement.lang = language
  }, [language])

  useEffect(() => {
    translateDocument(language)
    const observer = new MutationObserver((records) => {
      records.forEach((record) => record.addedNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE) translateDocument(language)
      }))
    })
    observer.observe(document.getElementById('root'), { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [language])

  const t = (key) => key.split('.').reduce((value, part) => value?.[part], translations[language]) || key
  const toggleLanguage = () => setLanguage((current) => current === 'es' ? 'en' : 'es')

  return <LanguageContext.Provider value={{ language, t, toggleLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage debe usarse dentro de <LanguageProvider>')
  return context
}
