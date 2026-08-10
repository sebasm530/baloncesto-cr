const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'El email es obligatorio'],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['admin', 'coach', 'public'],
      default: 'public'
    },
    coachTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    avatar: {
      type: String,
      default: null
    },
    active: {
      type: Boolean,
      default: true
    },
    twoFactorCode: {
      type: String,
      default: null
    },
    twoFactorExpires: {
      type: Date,
      default: null
    },
    twoFactorVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 12)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
