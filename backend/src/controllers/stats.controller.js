const Game = require('../models/Game')

exports.getStandings = async (req, res) => {
  try {
    const games = await Game.find({
      tournament: req.params.tournamentId,
      status: 'finalizado'
    }).populate('homeTeam', 'name shortName logo').populate('awayTeam', 'name shortName logo')

    const standings = {}

    games.forEach(game => {
      const homeId = game.homeTeam._id.toString()
      const awayId = game.awayTeam._id.toString()

      if (!standings[homeId]) standings[homeId] = { team: game.homeTeam, wins: 0, losses: 0, points: 0, pointsFor: 0, pointsAgainst: 0 }
      if (!standings[awayId]) standings[awayId] = { team: game.awayTeam, wins: 0, losses: 0, points: 0, pointsFor: 0, pointsAgainst: 0 }

      standings[homeId].pointsFor += game.homeScore
      standings[homeId].pointsAgainst += game.awayScore
      standings[awayId].pointsFor += game.awayScore
      standings[awayId].pointsAgainst += game.homeScore

      if (game.homeScore > game.awayScore) {
        standings[homeId].wins += 1
        standings[homeId].points += 2
        standings[awayId].losses += 1
        standings[awayId].points += 1
      } else {
        standings[awayId].wins += 1
        standings[awayId].points += 2
        standings[homeId].losses += 1
        standings[homeId].points += 1
      }
    })

    const result = Object.values(standings).sort((a, b) => b.points - a.points || b.wins - a.wins)
    res.json({ standings: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getPlayerStats = async (req, res) => {
  try {
    const games = await Game.find({
      tournament: req.params.tournamentId,
      status: 'finalizado'
    })
    .populate('homePlayerStats.player', 'name lastName number position team')
    .populate('awayPlayerStats.player', 'name lastName number position team')

    const stats = {}

    games.forEach(game => {
      ;[...game.homePlayerStats, ...game.awayPlayerStats].forEach(s => {
        if (!s.player) return
        const id = s.player._id.toString()
        if (!stats[id]) {
          stats[id] = { player: s.player, games: 0, points: 0, rebounds: 0, assists: 0, steals: 0, blocks: 0 }
        }
        stats[id].games += 1
        stats[id].points += s.points
        stats[id].rebounds += s.rebounds
        stats[id].assists += s.assists
        stats[id].steals += s.steals
        stats[id].blocks += s.blocks
      })
    })

    const result = Object.values(stats).map(s => ({
      ...s,
      avgPoints: (s.points / s.games).toFixed(1),
      avgRebounds: (s.rebounds / s.games).toFixed(1),
      avgAssists: (s.assists / s.games).toFixed(1)
    })).sort((a, b) => b.points - a.points)

    res.json({ stats: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getTeamStats = async (req, res) => {
  try {
    const games = await Game.find({
      tournament: req.params.tournamentId,
      status: 'finalizado'
    })
    .populate('homeTeam', 'name shortName logo')
    .populate('awayTeam', 'name shortName logo')

    const stats = {}

    games.forEach(game => {
      const homeId = game.homeTeam._id.toString()
      const awayId = game.awayTeam._id.toString()

      if (!stats[homeId]) stats[homeId] = { team: game.homeTeam, games: 0, pointsFor: 0, pointsAgainst: 0 }
      if (!stats[awayId]) stats[awayId] = { team: game.awayTeam, games: 0, pointsFor: 0, pointsAgainst: 0 }

      stats[homeId].games += 1
      stats[homeId].pointsFor += game.homeScore
      stats[homeId].pointsAgainst += game.awayScore

      stats[awayId].games += 1
      stats[awayId].pointsFor += game.awayScore
      stats[awayId].pointsAgainst += game.homeScore
    })

    const result = Object.values(stats).map(s => ({
      ...s,
      avgPointsFor: (s.pointsFor / s.games).toFixed(1),
      avgPointsAgainst: (s.pointsAgainst / s.games).toFixed(1)
    })).sort((a, b) => b.avgPointsFor - a.avgPointsFor)

    res.json({ stats: result })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}