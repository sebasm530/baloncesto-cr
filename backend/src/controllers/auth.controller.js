const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { sendVerificationCode } = require('../utils/email')

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  })
}

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString()

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' })
    }
    const user = await User.create({ name, email, password, role })
    const token = signToken(user._id)
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
    }

    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email o contraseña incorrectos' })
    }

    const code = generateCode()
    user.twoFactorCode = code
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000)
    user.twoFactorVerified = false
    await user.save({ validateBeforeSave: false })

    await sendVerificationCode(user.email, code, user.name)

    res.json({
      message: 'Código de verificación enviado a tu email',
      requiresTwoFactor: true,
      userId: user._id
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.verifyTwoFactor = async (req, res) => {
  try {
    const { userId, code } = req.body

    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (!user.twoFactorCode || user.twoFactorCode !== code) {
      return res.status(400).json({ message: 'Código incorrecto' })
    }

    if (user.twoFactorExpires < new Date()) {
      return res.status(400).json({ message: 'El código ha expirado, iniciá sesión nuevamente' })
    }

    user.twoFactorCode = null
    user.twoFactorExpires = null
    user.twoFactorVerified = true
    await user.save({ validateBeforeSave: false })

    const token = signToken(user._id)
    res.json({
      message: 'Verificación exitosa',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.resendCode = async (req, res) => {
  try {
    const { userId } = req.body
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    const code = generateCode()
    user.twoFactorCode = code
    user.twoFactorExpires = new Date(Date.now() + 10 * 60 * 1000)
    await user.save({ validateBeforeSave: false })

    await sendVerificationCode(user.email, code, user.name)
    res.json({ message: 'Código reenviado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getMe = async (req, res) => {
  try {
    res.json({ user: req.user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Ingresá tu contraseña actual y la nueva contraseña' })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'La nueva contraseña debe tener al menos 6 caracteres' })
    }

    const user = await User.findById(req.user._id).select('+password')
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ message: 'La contraseña actual es incorrecta' })
    }

    user.password = newPassword
    await user.save()
    res.json({ message: 'Contraseña actualizada correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteMyAccount = async (req, res) => {
  try {
    const { confirmation } = req.body
    if (confirmation !== 'eliminar') {
      return res.status(400).json({ message: 'Escribí “eliminar” para confirmar la eliminación de tu cuenta' })
    }

    await User.findByIdAndDelete(req.user._id)
    res.json({ message: 'Tu cuenta fue eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
