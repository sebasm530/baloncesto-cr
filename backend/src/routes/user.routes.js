const router = require('express').Router()
const User = require('../models/User')
const Team = require('../models/Team')
const Player = require('../models/Player')
const Tournament = require('../models/Tournament')
const Game = require('../models/Game')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

// Obtener todos los usuarios (solo admin)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'coach'] } }).select('-password').populate('coachTeam', 'name shortName logo')
    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Crear usuario admin o coach (solo admin)
router.post('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name, email, password, role, coachTeam } = req.body
    if (!['admin', 'coach'].includes(role)) {
      return res.status(400).json({ message: 'Rol no permitido' })
    }
    if (role === 'coach' && !coachTeam) {
      return res.status(400).json({ message: 'Seleccioná el equipo que entrenará el coach' })
    }
    if (coachTeam && !(await Team.exists({ _id: coachTeam }))) {
      return res.status(400).json({ message: 'El equipo seleccionado no existe' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }
    const user = await User.create({ name, email, password, role, coachTeam: role === 'coach' ? coachTeam : null })
    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: { id: user._id, name: user.name, email: user.email, role: user.role, coachTeam: user.coachTeam }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Reasignar el equipo de un coach (solo admin)
router.patch('/:id/coach-team', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { coachTeam } = req.body
    const coach = await User.findOne({ _id: req.params.id, role: 'coach' })
    if (!coach) return res.status(404).json({ message: 'Coach no encontrado' })
    if (!coachTeam || !(await Team.exists({ _id: coachTeam }))) {
      return res.status(400).json({ message: 'Seleccioná un equipo válido' })
    }
    coach.coachTeam = coachTeam
    await coach.save()
    await coach.populate('coachTeam', 'name shortName logo')
    res.json({ message: 'Equipo del coach actualizado', user: coach })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Resumen exclusivo del equipo asignado al coach
router.get('/coach/overview', protect, restrictTo('coach'), async (req, res) => {
  try {
    const coach = await User.findById(req.user._id).populate('coachTeam', 'name shortName logo city province')
    if (!coach.coachTeam) return res.status(400).json({ message: 'No tenés un equipo asignado. Contactá a un administrador.' })

    const teamId = coach.coachTeam._id
    const [players, tournaments, games] = await Promise.all([
      Player.find({ team: teamId, active: true }).sort({ lastName: 1, name: 1 }),
      Tournament.find({ teams: teamId }).sort({ startDate: -1 }),
      Game.find({
        $and: [
          { $or: [{ homeTeam: teamId }, { awayTeam: teamId }] },
          { status: { $ne: 'finalizado' } },
          { date: { $gte: new Date() } }
        ]
      }).sort({ date: 1 }).populate('homeTeam', 'name shortName logo').populate('awayTeam', 'name shortName logo').populate('tournament', 'name')
    ])
    res.json({ team: coach.coachTeam, players, tournaments, upcomingGames: games })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Eliminar usuario (solo admin)
router.delete('/:id', protect, restrictTo('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id)
    res.json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router
