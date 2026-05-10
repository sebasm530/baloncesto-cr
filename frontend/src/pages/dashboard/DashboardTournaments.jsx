import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTournaments, createTournament, deleteTournament } from '../../api/tournaments.api'
import { getTeams } from '../../api/teams.api'
import { motion } from 'framer-motion'

export default function DashboardTournaments() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['tournaments'], queryFn: () => getTournaments() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState({ name: '', season: '', category: 'Nacional', startDate: '', teams: [] })
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createTournament,
    onSuccess: () => { queryClient.invalidateQueries(['tournaments']); setForm({ name: '', season: '', category: 'Nacional', startDate: '', teams: [] }) },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear torneo')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTournament,
    onSuccess: () => queryClient.invalidateQueries(['tournaments'])
  })

  const handleTeamToggle = (teamId) => {
    setForm(prev => ({
      ...prev,
      teams: prev.teams.includes(teamId) ? prev.teams.filter(id => id !== teamId) : [...prev.teams, teamId]
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    createMutation.mutate(form)
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        Gestionar Torneos
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-orange-400">+ Nuevo Torneo</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre del torneo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <input placeholder="Temporada (ej: 2026)" value={form.season} onChange={e => setForm({ ...form, season: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition">
            {['Nacional','Estudiantil','Femenino','Juvenil','Masters'].map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required />
          <div className="md:col-span-2">
            <p className="text-gray-400 text-sm mb-3">Equipos participantes:</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {teamsData?.data?.teams?.map(team => (
                <label key={team._id} className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer border transition ${form.teams.includes(team._id) ? 'border-orange-500 bg-orange-500/10' : 'glass border-white/10 hover:border-orange-500/50'}`}>
                  <input type="checkbox" checked={form.teams.includes(team._id)} onChange={() => handleTeamToggle(team._id)} className="accent-orange-500" />
                  <span className="text-sm font-semibold">{team.shortName}</span>
                </label>
              ))}
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending} className="md:col-span-2 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
            {createMutation.isPending ? 'Creando...' : 'Crear Torneo'}
          </motion.button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.tournaments?.map((t, i) => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{t.name}</h3>
              <p className="text-orange-400 text-sm">{t.category} · {t.season}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${t.status === 'en curso' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-400'}`}>{t.status}</span>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteMutation.mutate(t._id)} className="text-red-400 text-sm border border-red-500/30 hover:border-red-400 px-3 py-1 rounded-lg transition">
              Eliminar
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}