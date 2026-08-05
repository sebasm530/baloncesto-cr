import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTournaments, createTournament, updateTournament, deleteTournament } from '../../api/tournaments.api'
import { getTeams } from '../../api/teams.api'
import { useLoading } from '../../context/LoadingContext'
import { motion } from 'framer-motion'

const initialForm = { name: '', season: '', category: 'Nacional', startDate: '', status: 'próximo', teams: [] }

export default function DashboardTournaments() {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoading()
  const { data } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState(initialForm)
  const [error, setError] = useState('')

  const refreshTournaments = () => queryClient.invalidateQueries(['tournaments'])

  const createMutation = useMutation({
    mutationFn: createTournament,
    onMutate: () => showLoading('Creando torneo...'),
    onSuccess: () => { refreshTournaments(); setForm(initialForm); hideLoading() },
    onError: (requestError) => { setError(requestError.response?.data?.message || 'Error al crear torneo'); hideLoading() }
  })

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updateTournament(id, { status }),
    onMutate: () => showLoading('Actualizando estado del torneo...'),
    onSuccess: () => { refreshTournaments(); hideLoading() },
    onError: (requestError) => { setError(requestError.response?.data?.message || 'No se pudo actualizar el estado'); hideLoading() }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTournament,
    onMutate: () => showLoading('Eliminando torneo...'),
    onSuccess: () => { refreshTournaments(); hideLoading() },
    onError: () => hideLoading()
  })

  const handleTeamToggle = (teamId) => setForm((previous) => ({
    ...previous,
    teams: previous.teams.includes(teamId) ? previous.teams.filter((id) => id !== teamId) : [...previous.teams, teamId]
  }))

  const handleSubmit = (event) => {
    event.preventDefault()
    setError('')
    createMutation.mutate(form)
  }

  const statusStyle = (status) => status === 'en curso'
    ? 'bg-green-900/50 text-green-400'
    : status === 'finalizado'
      ? 'bg-red-900/50 text-red-400'
      : 'bg-gray-800 text-gray-400'

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        Gestionar Torneos
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-orange-400">Nuevo torneo</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre del torneo" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <input placeholder="Temporada (ej: 2026)" value={form.season} onChange={(event) => setForm({ ...form, season: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition">
            {['Nacional', 'Estudiantil', 'Femenino', 'Juvenil', 'Masters'].map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
          <input type="date" value={form.startDate} onChange={(event) => setForm({ ...form, startDate: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required />
          <label className="md:col-span-2 text-sm text-gray-400">Estado inicial
            <select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value })} className="w-full mt-2 glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition">
              <option value="próximo">Próximo</option>
              <option value="en curso">En curso</option>
              <option value="finalizado">Finalizado</option>
            </select>
          </label>
          <div className="md:col-span-2">
            <p className="text-gray-400 text-sm mb-3">Equipos participantes:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {teamsData?.data?.teams?.map((team) => (
                <label key={team._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition ${form.teams.includes(team._id) ? 'border-orange-500 bg-orange-500/10' : 'glass border-white/10 hover:border-orange-500/50'}`}>
                  <input type="checkbox" checked={form.teams.includes(team._id)} onChange={() => handleTeamToggle(team._id)} className="accent-orange-500" />
                  <span className="text-sm font-semibold">{team.shortName}</span>
                </label>
              ))}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
            {createMutation.isPending ? 'Creando...' : 'Crear torneo'}
          </motion.button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.tournaments?.map((tournament, index) => (
          <motion.div key={tournament._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="min-w-0">
              <h3 className="font-bold">{tournament.name}</h3>
              <p className="text-orange-400 text-sm">{tournament.category} · {tournament.season}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${statusStyle(tournament.status)}`}>{tournament.status}</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <select value={tournament.status} onChange={(event) => statusMutation.mutate({ id: tournament._id, status: event.target.value })} disabled={statusMutation.isPending} aria-label={`Estado de ${tournament.name}`} className="w-full sm:w-auto glass border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 disabled:opacity-50">
                <option value="próximo">Próximo</option>
                <option value="en curso">En curso</option>
                <option value="finalizado">Finalizado</option>
              </select>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteMutation.mutate(tournament._id)} className="text-red-400 text-sm border border-red-500/30 hover:border-red-400 px-3 py-2 rounded-lg transition">
                Eliminar
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
