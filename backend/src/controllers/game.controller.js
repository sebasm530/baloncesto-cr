const Game = require('../models/Game')
const Player = require('../models/Player')

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

    if (!Number.isFinite(homeScore) || !Number.isFinite(awayScore) || homeScore < 0 || awayScore < 0) {
      return res.status(400).json({ message: 'Ingresá un marcador válido' })
    }

    const game = await Game.findById(req.params.id)
    if (!game) {
      return res.status(404).json({ message: 'Partido no encontrado' })
    }

    const normalizeStats = (stats, teamId, pointDifferential) => {
      const entries = Array.isArray(stats) ? stats : []
      const seenPlayers = new Set()
      const normalized = entries.map((stat) => {
        if (!stat.player || seenPlayers.has(stat.player)) {
          throw new Error('Cada jugador solo puede aparecer una vez')
        }
        seenPlayers.add(stat.player)

        const numberFields = ['minutesPlayed', 'points', 'rebounds', 'assists', 'steals', 'turnovers', 'blocks', 'fouls', 'freeThrowsMade', 'freeThrowsAttempted']
        const clean = { player: stat.player }
        numberFields.forEach((field) => {
          const value = Number(stat[field] || 0)
          if (!Number.isFinite(value) || value < 0) throw new Error('Las estadísticas deben ser números positivos')
          clean[field] = value
        })
        if (clean.freeThrowsMade > clean.freeThrowsAttempted) {
          throw new Error('Los tiros libres anotados no pueden superar los intentados')
        }
        if (clean.fouls > 6) {
          throw new Error('Un jugador no puede registrar más de 6 faltas personales')
        }

        // Estimación proporcional al tiempo en cancha usando únicamente el marcador y minutos registrados.
        clean.plusMinus = Math.round(pointDifferential * (clean.minutesPlayed / 40))
        return clean
      })
      return { normalized, playerIds: [...seenPlayers], teamId }
    }

    const home = normalizeStats(homePlayerStats, game.homeTeam.toString(), homeScore - awayScore)
    const away = normalizeStats(awayPlayerStats, game.awayTeam.toString(), awayScore - homeScore)
    const players = await Player.find({ _id: { $in: [...home.playerIds, ...away.playerIds] } }).select('team')
    const playerTeams = new Map(players.map((player) => [player._id.toString(), player.team.toString()]))

    if (players.length !== home.playerIds.length + away.playerIds.length ||
      home.playerIds.some((id) => playerTeams.get(id) !== home.teamId) ||
      away.playerIds.some((id) => playerTeams.get(id) !== away.teamId)) {
      return res.status(400).json({ message: 'Hay jugadores que no pertenecen a los equipos de este partido' })
    }

    const updatedGame = await Game.findByIdAndUpdate(
      req.params.id,
      {
        homeScore,
        awayScore,
        homePlayerStats: home.normalized,
        awayPlayerStats: away.normalized,
        status: 'finalizado'
      },
      { new: true, runValidators: true }
    )

    res.json({ message: 'Resultado y estadísticas registrados correctamente', game: updatedGame })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}
