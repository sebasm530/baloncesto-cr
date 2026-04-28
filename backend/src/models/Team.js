const mongoose = require('mongoose')

const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del equipo es obligatorio'],
      unique: true,
      trim: true
    },
    shortName: {
      type: String,
      required: [true, 'El nombre corto es obligatorio'],
      maxlength: 5,
      uppercase: true,
      trim: true
    },
    logo: {
      type: String,
      default: null
    },
    city: {
      type: String,
      required: [true, 'La ciudad es obligatoria'],
      trim: true
    },
    province: {
      type: String,
      required: [true, 'La provincia es obligatoria'],
      enum: [
        'San José', 'Alajuela', 'Cartago',
        'Heredia', 'Guanacaste', 'Puntarenas', 'Limón'
      ]
    },
    coach: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    active: {
      type: Boolean,
      default: true
    },
    description: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Team', teamSchema)