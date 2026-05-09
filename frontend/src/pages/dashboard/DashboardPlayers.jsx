import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlayers, createPlayer, updatePlayer, deletePlayer } from '../../api/players.api'
import { getTeams } from '../../api/teams.api'
import ImageUpload from '../../components/forms/ImageUpload'

export default function DashboardPlayers() {
  const queryClient = useQueryClient()
  const { data: playersData } = useQuery({ queryKey: ['players'], queryFn: () => getPlayers() })
  const { data: teamsData } = useQuery({ queryKey: ['teams'], queryFn: getTeams })
  const [form, setForm] = useState({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' })
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')

  const createMutation = useMutation({
    mutationFn: createPlayer,
    onSuccess: () => {
      queryClient.invalidateQueries(['players'])
      setForm({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear jugador')
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updatePlayer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['players'])
      setEditing(null)
      setForm({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' })
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al actualizar jugador')
  })

  const deleteMutation = useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => queryClient.invalidateQueries(['players'])
  })

  const handleEdit = (player) => {
    setEditing(player._id)
    setForm({
      name: player.name,
      lastName: player.lastName,
      number: player.number,
      position: player.position,
      team: player.team?._id || '',
      height: player.height || '',
      weight: player.weight || '',
      nationality: player.nationality || 'Costarricense',
      photo: player.photo || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setEditing(null)
    setForm({ name: '', lastName: '', number: '', position: 'Base', team: '', height: '', weight: '', nationality: 'Costarricense', photo: '' })
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
      <h2 className="text-2xl font-bold mb-6">Gestionar Jugadores</h2>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8">
        <h3 className="font-bold mb-4">{editing ? '✏️ Editar Jugador' : 'Nuevo Jugador'}</h3>
        {error && <p className="bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <input placeholder="Apellido" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <input placeholder="Número de camiseta" type="number" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" required />
          <select value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500">
            {['Base','Escolta','Alero','Ala-Pívot','Pívot'].map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <select value={form.team} onChange={e => setForm({ ...form, team: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500" required>
            <option value="">Seleccioná un equipo</option>
            {teamsData?.data?.teams?.map(t => <option key={t._id} value={t._id}>{t.name}</option>)}
          </select>
          <input placeholder="Nacionalidad" value={form.nationality} onChange={e => setForm({ ...form, nationality: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          <input placeholder="Altura (cm)" type="number" value={form.height} onChange={e => setForm({ ...form, height: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          <input placeholder="Peso (kg)" type="number" value={form.weight} onChange={e => setForm({ ...form, weight: e.target.value })} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
          <div className="md:col-span-2">
            <ImageUpload
              label="Subir foto del jugador"
              currentImage={form.photo}
              onUpload={(url) => setForm({ ...form, photo: url })}
            />
          </div>
          <div className="md:col-span-2 flex gap-3">
            <button type="submit" disabled={createMutation.isPending || updateMutation.isPending} className="flex-1 bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-semibold transition disabled:opacity-50">
              {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : editing ? 'Guardar Cambios' : 'Crear Jugador'}
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
        {playersData?.data?.players?.map(player => (
          <div key={player._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center text-xl">👤</div>
              )}
              <div>
                <h3 className="font-bold">{player.name} {player.lastName}</h3>
                <p className="text-orange-400 text-sm">#{player.number} · {player.position}</p>
                <p className="text-gray-400 text-sm">{player.team?.name}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => handleEdit(player)} className="text-orange-400 hover:text-orange-300 text-sm border border-orange-900 hover:border-orange-400 px-3 py-1 rounded-lg transition">
                Editar
              </button>
              <button onClick={() => deleteMutation.mutate(player._id)} className="text-red-400 hover:text-red-300 text-sm border border-red-900 hover:border-red-400 px-3 py-1 rounded-lg transition">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}