const mongoose = require('mongoose')

const playerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del jugador es obligatorio'],
      trim: true
    },
    lastName: {
      type: String,
      required: [true, 'El apellido es obligatorio'],
      trim: true
    },
    number: {
      type: Number,
      required: [true, 'El número de camiseta es obligatorio'],
      min: 0,
      max: 99
    },
    position: {
      type: String,
      required: [true, 'La posición es obligatoria'],
      enum: ['Base', 'Escolta', 'Alero', 'Ala-Pívot', 'Pívot']
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'El equipo es obligatorio']
    },
    photo: {
      type: String,
      default: null
    },
    height: {
      type: Number,
      default: null
    },
    weight: {
      type: Number,
      default: null
    },
    birthDate: {
      type: Date,
      default: null
    },
    nationality: {
      type: String,
      default: 'Costarricense'
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Player', playerSchema)