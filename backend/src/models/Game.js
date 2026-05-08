const mongoose = require('mongoose')

const playerStatsSchema = new mongoose.Schema({
  player: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player',
    required: true
  },
  points: { type: Number, default: 0 },
  rebounds: { type: Number, default: 0 },
  assists: { type: Number, default: 0 },
  steals: { type: Number, default: 0 },
  blocks: { type: Number, default: 0 },
  turnovers: { type: Number, default: 0 },
  fouls: { type: Number, default: 0 },
  minutesPlayed: { type: Number, default: 0 }
}, { _id: false })

const gameSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      required: [true, 'El torneo es obligatorio']
    },
    homeTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'El equipo local es obligatorio']
    },
    awayTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: [true, 'El equipo visitante es obligatorio']
    },
    homeScore: {
      type: Number,
      default: 0
    },
    awayScore: {
      type: Number,
      default: 0
    },
    date: {
      type: Date,
      required: [true, 'La fecha del partido es obligatoria']
    },
    location: {
      type: String,
      trim: true,
      default: null
    },
    status: {
      type: String,
      enum: ['programado', 'en curso', 'finalizado', 'suspendido'],
      default: 'programado'
    },
    homePlayerStats: [playerStatsSchema],
    awayPlayerStats: [playerStatsSchema],
    round: {
      type: String,
      default: null
    },
    notes: {
      type: String,
      default: null
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Game', gameSchema)