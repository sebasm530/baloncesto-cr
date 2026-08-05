import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGames, createGame, registerResult } from '../../api/games.api'
import { getTeams } from '../../api/teams.api'
import { getTournaments } from '../../api/tournaments.api'
import { useLoading } from '../../context/LoadingContext'
import { motion } from 'framer-motion'

export default function DashboardGames() {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoading()
  const { data: gamesData } = useQuery({ queryKey: ['games'], queryFn: () => getGames() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const [form, setForm] = useState({ tournament: '', homeTeam: '', awayTeam: '', date: '', location: '' })
  const [resultForm, setResultForm] = useState({ gameId: '', homeScore: '', awayScore: '' })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createGame,
    onMutate: () => showLoading('Programando partido...'),
    onSuccess: () => { queryClient.invalidateQueries(['games']); setForm({ tournament: '', homeTeam: '', awayTeam: '', date: '', location: '' }); hideLoading() },
    onError: (err) => { setError(err.response?.data?.message || 'Error al crear partido'); hideLoading() }
  })

  const resultMutation = useMutation({
    mutationFn: ({ id, data }) => registerResult(id, data),
    onMutate: () => showLoading('Registrando resultado...'),
    onSuccess: () => { queryClient.invalidateQueries(['games']); setResultForm({ gameId: '', homeScore: '', awayScore: '' }); hideLoading() },
    onError: () => hideLoading()
  })

  const handleSubmit = (e) => { e.preventDefault(); setError(''); createMutation.mutate(form) }
  const handleResult = (e) => {
    e.preventDefault()
    resultMutation.mutate({ id: resultForm.gameId, data: { homeScore: Number(resultForm.homeScore), awayScore: Number(resultForm.awayScore), homePlayerStats: [], awayPlayerStats: [] } })
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        Gestionar Partidos
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-6">
        <h3 className="font-bold mb-4 text-orange-400">+ Programar Partido</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={form.tournament} onChange={e => setForm({ ...form, tournament: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Seleccioná un torneo</option>
            {tournamentsData?.data?.tournaments?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.homeTeam} onChange={e => setForm({ ...form, homeTeam: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Equipo local</option>
            {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <select value={form.awayTeam} onChange={e => setForm({ ...form, awayTeam: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Equipo visitante</option>
            {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input placeholder="Lugar (ej: Gimnasio Nacional)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition md:col-span-2" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
            {createMutation.isPending ? 'Creando...' : 'Programar Partido'}
          </motion.button>
        </form>
      </div>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-green-400">🏆 Registrar Resultado</h3>
        <form onSubmit={handleResult} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={resultForm.gameId} onChange={e => setResultForm({ ...resultForm, gameId: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500 transition" required>
            <option value="">Seleccioná un partido</option>
            {gamesData?.data?.games?.filter(g => g.status !== 'finalizado').map(g => (
              <option key={g._id} value={g._id}>{g.homeTeam?.shortName} vs {g.awayTeam?.shortName}</option>
            ))}
          </select>
          <input type="number" placeholder="Puntos local" value={resultForm.homeScore} onChange={e => setResultForm({ ...resultForm, homeScore: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition" required />
          <input type="number" placeholder="Puntos visitante" value={resultForm.awayScore} onChange={e => setResultForm({ ...resultForm, awayScore: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition" required />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={resultMutation.isPending} className="md:col-span-3 bg-green-600 hover:bg-green-700 py-2.5 rounded-lg font-bold transition disabled:opacity-50">
            {resultMutation.isPending ? 'Guardando...' : 'Registrar Resultado'}
          </motion.button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gamesData?.data?.games?.map((game, i) => (
          <motion.div key={game._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-500 text-xs">{new Date(game.date).toLocaleDateString('es-CR')}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${game.status === 'finalizado' ? 'bg-green-900/50 text-green-400' : game.status === 'en curso' ? 'bg-orange-900/50 text-orange-400' : 'bg-gray-800 text-gray-400'}`}>{game.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold">{game.homeTeam?.name}</span>
              <span className="text-xl font-black text-orange-400">{game.status === 'finalizado' ? `${game.homeScore} - ${game.awayScore}` : 'VS'}</span>
              <span className="font-bold">{game.awayTeam?.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}