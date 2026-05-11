const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'El título es obligatorio'],
      trim: true
    },
    content: {
      type: String,
      required: [true, 'El contenido es obligatorio']
    },
    image: {
      type: String,
      default: null
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'El autor es obligatorio']
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      default: null
    },
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tournament',
      default: null
    },
    category: {
      type: String,
      enum: ['general', 'resultado', 'transferencia', 'torneo', 'selección'],
      default: 'general'
    },
    published: {
      type: Boolean,
      default: false
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
  },
  { timestamps: true }
)

module.exports = mongoose.model('News', newsSchema)