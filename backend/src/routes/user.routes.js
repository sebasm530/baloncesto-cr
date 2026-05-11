const router = require('express').Router()
const User = require('../models/User')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

// Obtener todos los usuarios (solo admin)
router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ['admin', 'coach'] } }).select('-password')
    res.json({ users })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Crear usuario admin o coach (solo admin)
router.post('/admin', protect, restrictTo('admin'), async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    if (!['admin', 'coach'].includes(role)) {
      return res.status(400).json({ message: 'Rol no permitido' })
    }
    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }
    const user = await User.create({ name, email, password, role })
    res.status(201).json({
      message: 'Usuario creado correctamente',
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
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