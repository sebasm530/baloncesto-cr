import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { changePassword, deleteMyAccount } from '../api/auth.api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [confirmation, setConfirmation] = useState('')
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' })
  const [deleteMessage, setDeleteMessage] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handlePasswordChange = async (event) => {
    event.preventDefault()
    setPasswordMessage({ type: '', text: '' })

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las nuevas contraseñas no coinciden' })
      return
    }

    setSavingPassword(true)
    try {
      const { data } = await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword
      })
      setPasswordMessage({ type: 'success', text: data.message })
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'No se pudo actualizar la contraseña' })
    } finally {
      setSavingPassword(false)
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setDeleteMessage('')
    if (confirmation !== 'eliminar') return

    setDeleting(true)
    try {
      await deleteMyAccount(confirmation)
      logout()
      navigate('/')
    } catch (error) {
      setDeleteMessage(error.response?.data?.message || 'No se pudo eliminar la cuenta')
      setDeleting(false)
    }
  }

  return (
    <div className="bg-premium min-h-screen">
      <div className="relative overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-orange-500/10 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 py-16 relative">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-700 rounded-full flex items-center justify-center font-black text-2xl glow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-black">Mi perfil</h1>
              <p className="text-gray-400 mt-1">{user?.name} · <span className="text-orange-400 font-semibold capitalize">{user?.role}</span></p>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 grid gap-8">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl border border-white/5 p-6 sm:p-8">
          <h2 className="text-2xl font-black flex items-center gap-2 mb-2">
            <span className="w-1 h-7 bg-orange-500 rounded-full inline-block" />
            Cambiar contraseña
          </h2>
          <p className="text-gray-400 text-sm mb-6">Usá una contraseña nueva de al menos 6 caracteres.</p>

          {passwordMessage.text && (
            <p className={`px-4 py-3 rounded-lg text-sm mb-5 border ${passwordMessage.type === 'success' ? 'bg-green-900/50 text-green-400 border-green-500/30' : 'bg-red-900/50 text-red-400 border-red-500/30'}`}>
              {passwordMessage.text}
            </p>
          )}

          <form onSubmit={handlePasswordChange} className="grid gap-4">
            <input type="password" autoComplete="current-password" placeholder="Contraseña actual" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
            <input type="password" autoComplete="new-password" placeholder="Nueva contraseña" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" minLength="6" required />
            <input type="password" autoComplete="new-password" placeholder="Confirmá la nueva contraseña" value={passwords.confirmPassword} onChange={(event) => setPasswords({ ...passwords, confirmPassword: event.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" minLength="6" required />
            <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }} type="submit" disabled={savingPassword} className="bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold transition disabled:opacity-50 glow">
              {savingPassword ? 'Guardando...' : 'Actualizar contraseña'}
            </motion.button>
          </form>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl border border-red-500/30 bg-red-950/20 p-6 sm:p-8">
          <h2 className="text-2xl font-black text-red-400 mb-2">Eliminar cuenta</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">Esta acción es permanente. Perderás el acceso a tu cuenta y no se puede deshacer.</p>
          <form onSubmit={handleDelete} className="grid gap-4">
            <label className="text-sm text-gray-300">Para confirmar, escribí <span className="font-bold text-red-400">eliminar</span>.</label>
            <input type="text" value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="eliminar" className="glass border border-red-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-400 transition" required />
            {deleteMessage && <p className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-3 rounded-lg text-sm">{deleteMessage}</p>}
            <motion.button whileHover={{ scale: confirmation === 'eliminar' ? 1.01 : 1 }} whileTap={{ scale: 0.99 }} type="submit" disabled={confirmation !== 'eliminar' || deleting} className="bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold transition disabled:opacity-40 disabled:cursor-not-allowed">
              {deleting ? 'Eliminando cuenta...' : 'Eliminar mi cuenta'}
            </motion.button>
          </form>
        </motion.section>
      </div>
    </div>
  )
}
