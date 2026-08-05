import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLoading } from '../context/LoadingContext'
import { register, verifyTwoFactor, resendCode } from '../api/auth.api'
import { motion } from 'framer-motion'

export default function Login() {
  const [mode, setMode] = useState('options')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [twoFactor, setTwoFactor] = useState({ userId: '', code: ['', '', '', '', '', ''] })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const { login } = useAuth()
  const { showLoading, hideLoading } = useLoading()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    showLoading(mode === 'register' ? 'Creando cuenta...' : 'Verificando credenciales...')

    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Las contraseñas no coinciden')
          return
        }
        await register({ name: form.name, email: form.email, password: form.password })
        setSuccess('✅ Cuenta creada correctamente. Ahora iniciá sesión.')
        setMode('user-login')
        setForm({ name: '', email: '', password: '', confirmPassword: '' })
      } else {
        const result = await login(form.email, form.password)
        if (result?.requiresTwoFactor) {
          setTwoFactor({ userId: result.userId, code: ['', '', '', '', '', ''] })
          setMode('2fa')
        } else {
          if (result.role === 'admin' || result.role === 'coach') {
            navigate('/dashboard')
          } else {
            navigate('/')
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la solicitud')
    } finally {
      setLoading(false)
      hideLoading()
    }
  }

  const handleCodeChange = (index, value) => {
    if (value.length > 1) return
    const newCode = [...twoFactor.code]
    newCode[index] = value
    setTwoFactor({ ...twoFactor, code: newCode })
    if (value && index < 5) {
      document.getElementById(`code-${index + 1}`)?.focus()
    }
  }

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !twoFactor.code[index] && index > 0) {
      document.getElementById(`code-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    showLoading('Verificando código...')
    try {
      const code = twoFactor.code.join('')
      if (code.length !== 6) {
        setError('Ingresá el código completo de 6 dígitos')
        return
      }
      const { data } = await verifyTwoFactor({ userId: twoFactor.userId, code })
      localStorage.setItem('token', data.token)
      showLoading('Iniciando sesión...')
      window.location.href = data.user.role === 'admin' || data.user.role === 'coach' ? '/dashboard' : '/'
    } catch (err) {
      setError(err.response?.data?.message || 'Código incorrecto')
    } finally {
      setLoading(false)
      hideLoading()
    }
  }

  const handleResend = async () => {
    setResending(true)
    setError('')
    try {
      await resendCode({ userId: twoFactor.userId })
      setSuccess('✅ Código reenviado a tu email')
      setTwoFactor({ ...twoFactor, code: ['', '', '', '', '', ''] })
    } catch (err) {
      setError('Error al reenviar el código')
    } finally {
      setResending(false)
    }
  }

  const reset = () => {
    setMode('options')
    setError('')
    setSuccess('')
    setForm({ name: '', email: '', password: '', confirmPassword: '' })
  }

  if (mode === 'options') {
    return (
      <div className="bg-premium min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <img src="/logo.png" alt="Zona Basket CR" className="w-48 mx-auto mb-4" />
            <p className="text-gray-400">La plataforma oficial del baloncesto nacional</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-white/5 p-8">
            <h2 className="text-xl font-black text-center mb-6">¿Cómo querés ingresar?</h2>
            <div className="flex flex-col gap-4">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setMode('admin-login')} className="bg-orange-500 hover:bg-orange-600 py-4 rounded-xl font-bold text-lg transition glow">
                🔑 Ingresar como administrador
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setMode('user-login')} className="glass border border-white/10 hover:border-orange-500/50 py-4 rounded-xl font-bold text-lg transition">
                👤 Ingresar como usuario
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  if (mode === '2fa') {
    return (
      <div className="bg-premium min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
            <img src="/logo.png" alt="Zona Basket CR" className="w-36 mx-auto mb-2" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-white/5 p-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-3">📧</div>
              <h1 className="text-2xl font-black">Verificación de identidad</h1>
              <p className="text-gray-400 text-sm mt-2">Enviamos un código de 6 dígitos a tu email. Ingresalo para continuar.</p>
            </div>

            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4 text-center">{error}</motion.p>}
            {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-900/50 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm mb-4 text-center">{success}</motion.p>}

            <form onSubmit={handleVerify} className="flex flex-col items-center gap-6">
              <div className="flex gap-2 sm:gap-3">
                {twoFactor.code.map((digit, index) => (
                  <motion.input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={e => handleCodeKeyDown(index, e)}
                    whileFocus={{ scale: 1.1 }}
                    className={`w-10 sm:w-12 h-12 sm:h-14 text-center text-lg sm:text-xl font-black rounded-xl border-2 transition focus:outline-none bg-white/5 text-white ${digit ? 'border-orange-500' : 'border-white/10 focus:border-orange-500'}`}
                  />
                ))}
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full bg-orange-500 hover:bg-orange-600 py-3 rounded-xl font-bold transition disabled:opacity-50 glow">
                {loading ? 'Verificando...' : 'Verificar código'}
              </motion.button>
            </form>

            <div className="mt-6 text-center flex flex-col gap-2">
              <button onClick={handleResend} disabled={resending} className="text-orange-400 hover:text-orange-300 text-sm transition disabled:opacity-50">
                {resending ? 'Reenviando...' : '¿No recibiste el código? Reenviar'}
              </button>
              <button onClick={reset} className="text-gray-500 hover:text-gray-400 text-sm transition">
                ← Volver al inicio
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-premium min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <img src="/logo.png" alt="Zona Basket CR" className="w-36 mx-auto mb-2" />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass rounded-2xl border border-white/5 p-8">
          <motion.button whileHover={{ x: -3 }} onClick={reset} className="text-gray-400 hover:text-white text-sm mb-6 flex items-center gap-1 transition">
            ← Volver
          </motion.button>
          <h1 className="text-2xl font-black mb-1">
            {mode === 'admin-login' && '🔑 Acceso administrador'}
            {mode === 'user-login' && '👤 Iniciar sesión'}
            {mode === 'register' && '📝 Crear cuenta'}
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            {mode === 'admin-login' && 'Ingresá tus credenciales de administrador'}
            {mode === 'user-login' && 'Ingresá a tu cuenta de usuario'}
            {mode === 'register' && 'Completá el formulario para registrarte'}
          </p>

          {success && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-green-900/50 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-sm mb-4">{success}</motion.p>}
          {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-900/50 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm mb-4">{error}</motion.p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === 'register' && (
              <input type="text" placeholder="Nombre completo" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
            )}
            <input type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
            <input type="password" placeholder="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
            {mode === 'register' && (
              <input type="password" placeholder="Confirmar contraseña" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} className="glass border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition" required />
            )}
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 py-3 rounded-lg font-bold transition disabled:opacity-50 glow">
              {loading ? 'Procesando...' : mode === 'register' ? 'Crear cuenta' : 'Ingresar'}
            </motion.button>
          </form>

          {mode === 'user-login' && (
            <p className="text-center text-gray-400 text-sm mt-6">
              ¿No tenés cuenta?
              <button onClick={() => { setMode('register'); setError(''); setSuccess(''); setForm({ name: '', email: '', password: '', confirmPassword: '' }) }} className="text-orange-400 hover:text-orange-300 ml-2 font-bold transition">
                Registrate gratis
              </button>
            </p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
