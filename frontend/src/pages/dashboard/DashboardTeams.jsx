import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../api/teams.api'
import ImageUpload from '../../components/forms/ImageUpload'
import { useLoading } from '../../context/LoadingContext'
import { motion } from 'framer-motion'

export default function DashboardTeams() {
  const queryClient = useQueryClient()
  const { showLoading, hideLoading } = useLoading()
  const { data } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState({ name: '', shortName: '', city: '', province: 'San José', logo: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createTeam,
    onMutate: () => showLoading('Creando equipo...'),
    onSuccess: () => { queryClient.invalidateQueries(['teams']); setForm({ name: '', shortName: '', city: '', province: 'San José', logo: '' }); hideLoading() },
    onError: (err) => { setError(err.response?.data?.message || 'Error al crear equipo'); hideLoading() }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTeam(id, data),
    onMutate: () => showLoading('Guardando cambios...'),
    onSuccess: () => { queryClient.invalidateQueries(['teams']); setEditing(null); setForm({ name: '', shortName: '', city: '', province: 'San José', logo: '' }); hideLoading() },
    onError: (err) => { setError(err.response?.data?.message || 'Error al actualizar equipo'); hideLoading() }
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onMutate: () => showLoading('Eliminando equipo...'),
    onSuccess: () => { queryClient.invalidateQueries(['teams']); hideLoading() },
    onError: () => hideLoading()
  })

  const handleEdit = (team) => {
    setEditing(team._id)
    setForm({ name: team.name, shortName: team.shortName, city: team.city, province: team.province, logo: team.logo || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => { setEditing(null); setForm({ name: '', shortName: '', city: '', province: 'San José', logo: '' }); setError('') }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    editing ? updateMutation.mutate({ id: editing, data: form }) : createMutation.mutate(form)
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        {editing ? 'Editar Equipo' : 'Gestionar Equipos'}
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-orange-400">{editing ? '✏️ Editando equipo' : '+ Nuevo Equipo'}</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre del equipo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <input placeholder="Nombre corto (ej: HAL)" value={form.shortName} onChange={e => setForm({ ...form, shortName: e.target.value.toUpperCase() })} maxLength={5} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <input placeholder="Ciudad" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
          <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition">
            {['San José','Alajuela','Cartago','Heredia','Guanacaste','Puntarenas','Limón'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <div className="md:col-span-2">
            <ImageUpload label="Subir logo del equipo" currentImage={form.logo} onUpload={(url) => setForm({ ...form, logo: url })} />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Equipo'}
            </motion.button>
            {editing && <motion.button whileHover={{ scale: 1.02 }} type="button" onClick={handleCancel} className="px-6 glass border border-white/10 hover:border-orange-500/50 py-2.5 rounded-lg font-bold transition">Cancelar</motion.button>}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.teams?.map((team, i) => (
          <motion.div key={team._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-full object-cover border-2 border-orange-500/30" />
              ) : (
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-sm">{team.shortName}</div>
              )}
              <div>
                <h3 className="font-bold">{team.name}</h3>
                <p className="text-gray-400 text-sm">{team.city}, {team.province}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => handleEdit(team)} className="text-orange-400 text-sm border border-orange-500/30 hover:border-orange-400 px-3 py-1 rounded-lg transition">Editar</motion.button>
              <motion.button whileHover={{ scale: 1.05 }} onClick={() => deleteMutation.mutate(team._id)} className="text-red-400 text-sm border border-red-500/30 hover:border-red-400 px-3 py-1 rounded-lg transition">Eliminar</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}