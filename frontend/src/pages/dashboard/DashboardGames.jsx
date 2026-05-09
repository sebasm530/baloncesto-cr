import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGames, createGame, registerResult } from '../../api/games.api'
import { getTeams } from '../../api/teams.api'
import { getTournaments } from '../../api/tournaments.api'

export default function DashboardGames() {
  const queryClient = useQueryClient()
  const { data: gamesData } = useQuery({ queryKey: ['games'], queryFn: () => getGames() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const { data: tournamentsData } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const [form, setForm] = useState({ tournament: '', homeTeam: '', awayTeam: '', date: '', location: '' })
  const [resultForm, setResultForm] = useState({ gameId: '', homeScore: '', awayScore: '' })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createGame,
    onSuccess: () => {
      queryClient.invalidateQueries(['games'])
      setForm({ tournament: '', homeTeam: '', awayTeam: '', date: '', location: '' })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear partido')
  })

  const resultMutation = useMutation({
    mutationFn: ({ id, data }) => registerResult(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['games'])
      setResultForm({ gameId: '', homeScore: '', awayScore: '' })
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(form)
  }

  const handleResult = (e) => {
    e.preventDefault()
    resultMutation.mutate({
      id: resultForm.gameId,
      data: { homeScore: Number(resultForm.homeScore), awayScore: Number(resultForm.awayScore), homePlayerStats: [], awayPlayerStats: [] }
    })
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestionar Partidos</h2>

      {/* Crear partido */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
        <h3 className="font-bold mb-4">Programar Partido</h3>
        {error && <p className="bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={form.tournament} onChange={e => setForm({ ...form, tournament: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required>
            <option value="">Seleccioná un torneo</option>
            {tournamentsData?.data?.tournaments?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required />
          <select value={form.homeTeam} onChange={e => setForm({ ...form, homeTeam: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required>
            <option value="">Equipo local</option>
            {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <select value={form.awayTeam} onChange={e => setForm({ ...form, awayTeam: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required>
            <option value="">Equipo visitante</option>
            {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input placeholder="Lugar (ej: Gimnasio Nacional)" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 md:col-span-2" />
          <button type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
            {createMutation.isPending ? 'Creando...' : 'Programar Partido'}
          </button>
        </form>
      </div>

      {/* Registrar resultado */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Registrar Resultado</h3>
        <form onSubmit={handleResult} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={resultForm.gameId} onChange={e => setResultForm({ ...resultForm, gameId: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required>
            <option value="">Seleccioná un partido</option>
            {gamesData?.data?.games?.filter(g => g.status !== 'finalizado').map(g => (
              <option key={g._id} value={g._id}>{g.homeTeam?.shortName} vs {g.awayTeam?.shortName}</option>
            ))}
          </select>
          <input type="number" placeholder="Puntos local" value={resultForm.homeScore} onChange={e => setResultForm({ ...resultForm, homeScore: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <input type="number" placeholder="Puntos visitante" value={resultForm.awayScore} onChange={e => setResultForm({ ...resultForm, awayScore: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <button type="submit" disabled={resultMutation.isPending} className="md:col-span-3 bg-green-600 hover:bg-green-700 py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
            {resultMutation.isPending ? 'Guardando...' : 'Registrar Resultado'}
          </button>
        </form>
      </div>

      {/* Lista de partidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {gamesData?.data?.games?.map(game => (
          <div key={game._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-400 text-xs">{new Date(game.date).toLocaleDateString('es-CR')}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full ${game.status === 'finalizado' ? 'bg-green-900 text-green-400' : game.status === 'en curso' ? 'bg-orange-900 text-orange-400' : 'bg-gray-800 text-gray-400'}`}>{game.status}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-semibold">{game.homeTeam?.name}</span>
              <span className="text-xl font-bold text-orange-400">{game.status === 'finalizado' ? `${game.homeScore} - ${game.awayScore}` : 'VS'}</span>
              <span className="font-semibold">{game.awayTeam?.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}