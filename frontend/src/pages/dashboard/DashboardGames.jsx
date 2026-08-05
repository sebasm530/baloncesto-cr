import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGames, createGame } from '../../api/games.api'
import { getTeams } from '../../api/teams.api'
import { getTournaments } from '../../api/tournaments.api'
import { useLoading } from '../../context/LoadingContext'
import { motion } from 'framer-motion'
import GameStatsForm from './GameStatsForm'

export default function DashboardGames() {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoading()
  const { data: gamesData } = useQuery({ queryKey: ['games'], queryFn: () => getGames() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const [form, setForm] = useState({ tournament: '', homeTeam: '', awayTeam: '', date: '', location: '' })
  const [selectedGameId, setSelectedGameId] = useState('')
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createGame,
    onMutate: () => showLoading('Programando partido...'),
    onSuccess: () => {
      queryClient.invalidateQueries(['games'])
      setForm({ tournament: '', homeTeam: '', awayTeam: '', date: '', location: '' })
      hideLoading()
    },
    onError: (requestError) => {
      setError(requestError.response?.data?.message || 'Error al crear partido')
      hideLoading()
    }
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    if (form.homeTeam === form.awayTeam) {
      setError('El equipo local y visitante deben ser distintos')
      return
    }
    createMutation.mutate(form)
  }

  const handleStatsSaved = () => {
    queryClient.invalidateQueries(['games'])
    queryClient.invalidateQueries(['playerStats'])
    setSelectedGameId('')
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        Gestionar Partidos
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-6">
        <h3 className="font-bold mb-4 text-orange-400">Programar Partido</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={form.tournament} onChange={event => setForm({ ...form, tournament: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Seleccioná un torneo</option>
            {tournamentsData?.data?.tournaments?.map(tournament => <option key={tournament._id} value={tournament._id}>{tournament.name}</option>)}
          </select>
          <input type="datetime-local" value={form.date} onChange={event => setForm({ ...form, date: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.homeTeam} onChange={event => setForm({ ...form, homeTeam: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Equipo local</option>
            {teamsData?.data?.teams?.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
          </select>
          <select value={form.awayTeam} onChange={event => setForm({ ...form, awayTeam: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Equipo visitante</option>
            {teamsData?.data?.teams?.map(team => <option key={team._id} value={team._id}>{team.name}</option>)}
          </select>
          <input placeholder="Lugar del partido" value={form.location} onChange={event => setForm({ ...form, location: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition md:col-span-2" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
            {createMutation.isPending ? 'Creando...' : 'Programar Partido'}
          </motion.button>
        </form>
      </div>

      {!selectedGameId ? (
        <div className="glass rounded-xl border border-white/5 p-6 mb-8">
          <h3 className="font-bold mb-2 text-green-400">Registrar resultado y estadísticas</h3>
          <p className="text-gray-400 text-sm mb-4">Elegí un partido para cargar el marcador y las estadísticas de cada jugador.</p>
          <select value={selectedGameId} onChange={event => setSelectedGameId(event.target.value)} className="w-full glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 transition">
            <option value="">Seleccioná un partido</option>
            {gamesData?.data?.games?.filter(game => game.status !== 'finalizado').map(game => (
              <option key={game._id} value={game._id}>{game.homeTeam?.shortName} vs {game.awayTeam?.shortName}</option>
            ))}
          </select>
        </div>
      ) : (
        <GameStatsForm gameId={selectedGameId} onCancel={() => setSelectedGameId('')} onSaved={handleStatsSaved} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gamesData?.data?.games?.map((game, index) => (
          <motion.div key={game._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 text-xs">{new Date(game.date).toLocaleDateString('es-CR')}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${game.status === 'finalizado' ? 'bg-green-900/50 text-green-400' : game.status === 'en curso' ? 'bg-orange-900/50 text-orange-400' : 'bg-gray-800 text-gray-400'}`}>{game.status}</span>
            </div>
            <div className="flex justify-between items-center gap-3">
              <span className="font-bold text-sm">{game.homeTeam?.name}</span>
              <span className="text-xl font-black text-orange-400 shrink-0">{game.status === 'finalizado' ? `${game.homeScore} - ${game.awayScore}` : 'VS'}</span>
              <span className="font-bold text-sm text-right">{game.awayTeam?.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
