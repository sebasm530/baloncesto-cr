import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import api from '../../api/client'

const getUsers = () => api.get('/users')
const createAdminUser = (data) => api.post('/users/admin', data)
const deleteUser = (id) => api.delete(`/users/${id}`)

export default function DashboardUsers() {
  const queryClient = useQueryClient()
  const { data: usersData } = useQuery({ queryKey: ['users'], queryFn: getUsers })
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const createMutation = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      setForm({ name: '', email: '', password: '', confirmPassword: '', role: 'admin' })
      setSuccess('✅ Usuario creado correctamente')
      setTimeout(() => setSuccess(''), 3000)
    },
    onError: (err) => setError(err.response?.data?.message || 'Error al crear usuario')
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries(['users'])
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (form.password !== form.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }
    createMutation.mutate({ name: form.name, email: form.email, password: form.password, role: form.role })
  }

  const roleColor = (role) => {
    if (role === 'admin') return 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
    if (role === 'coach') return 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
    return 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
  }

  return (
    <div>
      <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
        <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
        Gestionar Usuarios
      </h2>

      <div className="glass rounded-xl border border-white/5 p-6 mb-8">
        <h3 className="font-bold mb-4 text-orange-400">+ Nuevo Usuario Administrador</h3>
        {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}
        {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-900/50 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm mb-4">{success}</motion.p>}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Nombre completo"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition"
            required
          />
          <select
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            className="glass border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-orange-500 transition"
          >
            <option value="admin">Administrador</option>
            <option value="coach">Entrenador / Coach</option>
          </select>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={createMutation.isPending}
            className="bg-orange-500 hover:bg-orange-600 py-2.5 rounded-lg font-bold transition disabled:opacity-50 glow"
          >
            {createMutation.isPending ? 'Creando...' : 'Crear Usuario'}
          </motion.button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div className="flex flex-col gap-3">
        {usersData?.data?.users?.map((user, i) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl border border-white/5 hover:border-orange-500/30 transition p-5 flex justify-between items-center"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold">{user.name}</h3>
                <p className="text-gray-400 text-sm">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${roleColor(user.role)}`}>
                {user.role}
              </span>
              {user.role !== 'public' && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => deleteMutation.mutate(user._id)}
                  className="text-red-400 text-sm border border-red-500/30 hover:border-red-400 px-3 py-1 rounded-lg transition"
                >
                  Eliminar
                </motion.button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}