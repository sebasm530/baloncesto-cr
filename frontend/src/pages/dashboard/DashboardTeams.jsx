import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTeams, createTeam, updateTeam, deleteTeam } from '../../api/teams.api'
import ImageUpload from '../../components/forms/ImageUpload'

export default function DashboardTeams() {
  const queryClient = useQueryClient()
  const { data } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState({ name: '', shortName: '', city: '', province: 'San José', logo: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      setForm({ name: '', shortName: '', city: '', province: 'San José', logo: '' })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear equipo')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      setEditing(null)
      setForm({ name: '', shortName: '', city: '', province: 'San José', logo: '' })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al actualizar equipo')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTeam,
    onSuccess: () => queryClient.invalidateQueries(['teams'])
  })

  const handleEdit = (team) => {
    setEditing(team._id)
    setForm({ name: team.name, shortName: team.shortName, city: team.city, province: team.province, logo: team.logo || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ name: '', shortName: '', city: '', province: 'San José', logo: '' })
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (editing) {
      updateMutation.mutate({ id: editing, data: form })
    } else {
      createMutation.mutate(form)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestionar Equipos</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">{editing ? '✏️ Editar Equipo' : 'Nuevo Equipo'}</h3>
        {error && <p className="bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nombre del equipo"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            required
          />
          <input
            placeholder="Nombre corto (ej: HAL)"
            value={form.shortName}
            onChange={e => setForm({ ...form, shortName: e.target.value.toUpperCase() })}
            maxLength={5}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            required
          />
          <input
            placeholder="Ciudad"
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            required
          />
          <select
            value={form.province}
            onChange={e => setForm({ ...form, province: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
          >
            {['San José','Alajuela','Cartago','Heredia','Guanacaste','Puntarenas','Limón'].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <div className="md:col-span-2">
            <ImageUpload
              label="Subir logo del equipo"
              currentImage={form.logo}
              onUpload={(url) => setForm({ ...form, logo: url })}
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="flex-1 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-semibold transition disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Equipo'}
            </button>
            {editing && (
              <button type="button" onClick={handleCancel} className="px-6 bg-gray-700 hover:bg-gray-600 py-2.5 rounded-lg font-semibold transition">
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.data?.teams?.map(team => (
          <div key={team._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {team.logo ? (
                <img src={team.logo} alt={team.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center font-bold">
                  {team.shortName}
                </div>
              )}
              <div>
                <h3 className="font-bold">{team.name}</h3>
                <p className="text-gray-400 text-sm">{team.city}, {team.province}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(team)}
                className="text-orange-400 hover:text-orange-300 text-sm border border-orange-900 hover:border-orange-400 px-3 py-1 rounded-lg transition"
              >
                Editar
              </button>
              <button
                onClick={() => deleteMutation.mutate(team._id)}
                className="text-red-400 hover:text-red-300 text-sm border border-red-900 hover:border-red-400 px-3 py-1 rounded-lg transition"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}