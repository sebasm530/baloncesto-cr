const Game = require('../models/Game')

exports.getGames = async (req, res) => {
  try {
    const filter = {}
    if (req.query.tournament) filter.tournament = req.query.tournament
    if (req.query.team) {
      filter.$or = [
        { homeTeam: req.query.team },
        { awayTeam: req.query.team }
      ]
    }
    if (req.query.status) filter.status = req.query.status

    const games = await Game.find(filter)
      .populate('homeTeam', 'name shortName logo')
      .populate('awayTeam', 'name shortName logo')
      .populate('tournament', 'name season')
      .sort({ date: -1 })

    res.json({ results: games.length, games })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id)
      .populate('homeTeam', 'name shortName logo')
      .populate('awayTeam', 'name shortName logo')
      .populate('tournament', 'name season')
      .populate('homePlayerStats.player', 'name lastName number position')
      .populate('awayPlayerStats.player', 'name lastName number position')

    if (!game) {
      return res.status(404).json({ message: 'Partido no encontrado' })
    }
    res.json({ game })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body)
    res.status(201).json({ message: 'Partido creado correctamente', game })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!game) {
      return res.status(404).json({ message: 'Partido no encontrado' })
    }
    res.json({ message: 'Partido actualizado correctamente', game })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteGame = async (req, res) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id)
    if (!game) {
      return res.status(404).json({ message: 'Partido no encontrado' })
    }
    res.json({ message: 'Partido eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.registerResult = async (req, res) => {
  try {
    const { homeScore, awayScore, homePlayerStats, awayPlayerStats } = req.body

    const game = await Game.findByIdAndUpdate(
      req.params.id,
      {
        homeScore,
        awayScore,
        homePlayerStats,
        awayPlayerStats,
        status: 'finalizado'
      },
      { new: true, runValidators: true }
    )

    if (!game) {
      return res.status(404).json({ message: 'Partido no encontrado' })
    }

    res.json({ message: 'Resultado registrado correctamente', game })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}