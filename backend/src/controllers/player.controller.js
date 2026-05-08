const Player = require('../models/Player')

exports.getPlayers = async (req, res) => {
  try {
    const filter = { active: true }
    if (req.query.team) filter.team = req.query.team
    if (req.query.position) filter.position = req.query.position

    const players = await Player.find(filter).populate('team', 'name shortName logo')
    res.json({ results: players.length, players })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPlayer = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id).populate('team', 'name shortName logo')
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' })
    }
    res.json({ player })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createPlayer = async (req, res) => {
  try {
    const player = await Player.create(req.body)
    res.status(201).json({ message: 'Jugador creado correctamente', player })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' })
    }
    res.json({ message: 'Jugador actualizado correctamente', player })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    )
    if (!player) {
      return res.status(404).json({ message: 'Jugador no encontrado' })
    }
    res.json({ message: 'Jugador eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}