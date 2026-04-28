const mongoose = require('mongoose')

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre del torneo es obligatorio'],
      trim: true
    },
    season: {
      type: String,
      required: [true, 'La temporada es obligatoria'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      enum: ['Nacional', 'Estudiantil', 'Femenino', 'Juvenil', 'Masters']
    },
    startDate: {
      type: Date,
      required: [true, 'La fecha de inicio es obligatoria']
    },
    endDate: {
      type: Date,
      default: null
    },
    teams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
      }
    ],
    status: {
      type: String,
      enum: ['próximo', 'en curso', 'finalizado'],
      default: 'próximo'
    },
    description: {
      type: String,
      default: null
    },
    logo: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Tournament', tournamentSchema)