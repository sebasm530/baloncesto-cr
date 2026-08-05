import { createContext, useContext, useState } from 'react'
import LoadingScreen from '../components/LoadingScreen'

const LoadingContext = createContext(null)

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('Cargando...')

  const showLoading = (msg = 'Cargando...') => {
    setMessage(msg)
    setLoading(true)
  }

  const hideLoading = () => setLoading(false)

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {loading && <LoadingScreen message={message} />}
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => {
  const ctx = useContext(LoadingContext)
  if (!ctx) throw new Error('useLoading debe usarse dentro de <LoadingProvider>')
  return ctx
}