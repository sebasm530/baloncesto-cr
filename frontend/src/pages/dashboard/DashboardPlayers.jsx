import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../../api/players.api'
import { getTeams } from '../../api/teams.api'
import ImageUpload from '../../components/forms/ImageUpload'
import { useLoading } from '../../context/LoadingContext'
import { motion } from 'framer-motion'

export default function DashboardPlayers() {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoading()
  const { data: playersData } = useQuery({ queryKey: ['players'], queryFn: () => getPlayers() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createPlayer,
    onMutate: () => showLoading('Creando jugador...'),
    onSuccess: () => { queryClient.invalidateQueries(['players']); setForm({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' }); hideLoading() },
    onError: (err) => { setError(err.response?.data?.message || 'Error al crear jugador'); hideLoading() }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePlayer(id, data),
    onMutate: () => showLoading('Guardando cambios...'),
    onSuccess: () => { queryClient.invalidateQueries(['players']); setEditing(null); setForm({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' }); hideLoading() },
    onError: (err) => { setError(err.response?.data?.message || 'Error al actualizar jugador'); hideLoading() }
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlayer,
    onMutate: () => showLoading('Eliminando jugador...'),
    onSuccess: () => { queryClient.invalidateQueries(['players']); hideLoading() },
    onError: () => hideLoading()
  })

  const handleEdit = (player) => {
    setEditing(player._id)
    setForm({ name: player.name, lastName: player.lastName, number: player.number, position: player.position, team: player.team?._id || '', height: player.height || '', weight: player.weight || '', nationality: player.nationality || 'Costarricense', photo: player.photo || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setEditing(null); setForm({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' }); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form)
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        {editing ? 'Editar Jugador' : 'Gestionar Jugadores'}
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-orange-400">{editing ? '✏️ Editando jugador' : '+ Nuevo Jugador'}</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <input placeholder="Apellido" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <input placeholder="Número de camiseta" type="number" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition">
            {['Base','Escolta','Alero','Ala-Pívot','Pívot'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition" required>
            <option value="">Seleccioná un equipo</option>
            {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input placeholder="Nacionalidad" value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" />
          <input placeholder="Altura (cm)" type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" />
          <input placeholder="Peso (kg)" type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" />
          <div className="md:col-span-2">
            <ImageUpload label="Subir foto del jugador" currentImage={form.photo} onUpload={(url) => setForm({ ...form, photo: url })} />
          </div>
          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Jugador'}
            </motion.button>
            {editing && <motion.button whileHover={{ scale: 1.02 }} type="button" onClick={handleCancel} className="px-6 glass border border-white/10 hover:border-orange-500/50 py-2.5 rounded-lg font-bold transition">Cancelar</motion.button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {playersData?.data?.players?.map((player, i) => (
          <motion.div key={player._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/30" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center text-xl border border-white/10">👤</div>
              )}
              <div>
                <h3 className="font-bold">{player.name} {player.lastName}</h3>
                <p className="text-orange-400 text-sm">#{player.number} · {player.position}</p>
                <p className="text-gray-500 text-sm">{player.team?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(player)} className="text-orange-400 text-sm border border-orange-500/30 hover:border-orange-400 px-3 py-1 rounded-lg transition">Editar</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteMutation.mutate(player._id)} className="text-red-400 text-sm border border-red-500/30 hover:border-red-400 px-3 py-1 rounded-lg transition">Eliminar</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
