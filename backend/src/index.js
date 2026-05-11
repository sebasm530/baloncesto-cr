require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const connectDB = require('./config/database')

const app = express()

// ─── Conexión a base de datos ────────────────────────────
connectDB()

// ─── Middlewares globales ────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// ─── Rutas ───────────────────────────────────────────────
app.use('/api/auth',        require('./routes/auth.routes'))
app.use('/api/teams',       require('./routes/team.routes'))
app.use('/api/players',     require('./routes/player.routes'))
app.use('/api/games',       require('./routes/game.routes'))
app.use('/api/tournaments', require('./routes/tournament.routes'))
app.use('/api/stats',       require('./routes/stats.routes'))
app.use('/api/news',        require('./routes/news.routes'))
app.use('/api/users', require('./routes/user.routes'))

// ─── Ruta de salud ───────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Baloncesto CR API corriendo 🏀' })
})

// ─── Manejo de rutas no encontradas ─────────────────────
app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada' })
})

// ─── Manejo global de errores ────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({
    message: err.message || 'Error interno del servidor'
  })
})

// ─── Servidor ────────────────────────────────────────────
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  console.log(`📋 Ambiente: ${process.env.NODE_ENV}`)
})