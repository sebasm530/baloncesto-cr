import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTournaments, createTournament, deleteTournament } from '../../api/tournaments.api'
import { getTeams } from '../../api/teams.api'

export default function DashboardTournaments() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState({ name: '', season: '', category: 'Nacional', startDate: '', teams: [] })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createTournament,
    onSuccess: () => {
      queryClient.invalidateQueries(['tournaments'])
      setForm({ name: '', season: '', category: 'Nacional', startDate: '', teams: [] })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear torneo')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: () => queryClient.invalidateQueries(['tournaments'])
  })

  const handleTeamToggle = (teamId) => {
    setForm(prev => ({
      ...prev,
      teams: prev.teams.includes(teamId)
        ? prev.teams.filter(id => id !== teamId)
        : [...prev.teams, teamId]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(form)
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestionar Torneos</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">Nuevo Torneo</h3>
        {error && <p className="bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre del torneo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <input placeholder="Temporada (ej: 2026)" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500">
            {['Nacional','Estudiantil','Femenino','Juvenil','Masters'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required />
          <div className="md:col-span-2">
            <p className="text-gray-400 text-sm mb-2">Equipos participantes:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {teamsData?.data?.teams?.map(team => (
                <label key={team._id} className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-lg cursor-pointer hover:border-orange-500 border border-gray-700">
                  <input type="checkbox" checked={form.teams.includes(team._id)} onChange={() => handleTeamToggle(team._id)} className="accent-orange-500" />
                  <span className="text-sm">{team.shortName}</span>
                </label>
              ))}
            </div>
          </div>
          <button type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
            {createMutation.isPending ? 'Creando...' : 'Crear Torneo'}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.tournaments?.map(t => (
          <div key={t._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{t.name}</h3>
              <p className="text-orange-400 text-sm">{t.category} · {t.season}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${t.status === 'en curso' ? 'bg-green-900 text-green-400' : 'bg-gray-800 text-gray-400'}`}>{t.status}</span>
            </div>
            <button onClick={() => deleteMutation.mutate(t._id)} className="text-red-400 hover:text-red-300 text-sm border border-red-900 hover:border-red-400 px-3 py-1 rounded-lg transition">
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}