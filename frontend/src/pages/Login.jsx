import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { register } from '../api/auth.api'

export default function Login() {
  const [mode, setMode] = useState('options') // 'options' | 'admin-login' | 'user-login' | 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Las contraseñas no coinciden')
          setLoading(false)
          return
        }
        await register({ name: form.name, email: form.email, password: form.password })
        setMode('user-login')
        setForm({ name: '', email: '', password: '', confirmPassword: '' })
        setError('')
      } else {
        const user = await login(form.email, form.password)
        if (user.role === 'admin' || user.role === 'coach') {
          navigate('/dashboard')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setMode('options')
    setError('')
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
  }

  // Pantalla de opciones
  if (mode === 'options') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">🏀 Baloncesto CR</h1>
          <p className="text-gray-400 text-sm mb-10">¿Cómo querés ingresar?</p>
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setMode('admin-login')}
              className="bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-semibold text-lg transition"
            >
              🔑 Ingresar como administrador
            </button>
            <button
              onClick={() => setMode('user-login')}
              className="bg-gray-800 hover:bg-gray-700 border border-gray-700 hover:border-orange-500 py-4 rounded-xl font-semibold text-lg transition"
            >
              👤 Ingresar como usuario
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Pantallas de login y registro
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 w-full max-w-md">
        <button onClick={reset} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition">
          ← Volver
        </button>

        <h1 className="text-2xl font-bold mb-2">
          {mode === 'admin-login' && '🔑 Acceso administrador'}
          {mode === 'user-login' && '👤 Iniciar sesión'}
          {mode === 'register' && '📝 Crear cuenta'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {mode === 'admin-login' && 'Ingresá tus credenciales de administrador'}
          {mode === 'user-login' && 'Ingresá a tu cuenta de usuario'}
          {mode === 'register' && 'Completá el formulario para registrarte'}
        </p>

        {mode === 'register' && (
          <div className="bg-green-900 text-green-400 px-4 py-2 rounded-lg text-sm mb-4">
            ✅ Cuenta creada correctamente. Ahora iniciá sesión.
          </div>
        )}

        {error && <p className="bg-red-900 text-red-400 px-4 py-2 rounded-lg text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'register' && (
            <input
              type="text"
              placeholder="Nombre completo"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
            required
          />
          {mode === 'register' && (
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={form.confirmPassword}
              onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
              className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500"
              required
            />
          )}
          <button
            type="submit"
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Procesando...' : mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
          </button>
        </form>

        {mode === 'user-login' && (
          <p className="text-center text-gray-400 text-sm mt-6">
            ¿No tenés cuenta?
            <button
              onClick={() => { setMode('register'); setError(''); setForm({ name: '', email: '', password: '', confirmPassword: '' }) }}
              className="text-orange-400 hover:text-orange-300 ml-2 font-semibold transition"
            >
              Registrate gratis
            </button>
          </p>
        )}
      </div>
    </div>
  )
}