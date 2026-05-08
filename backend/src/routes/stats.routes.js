const router = require('express').Router()
const {
  getStandings,
  getPlayerStats,
  getTeamStats
} = require('../controllers/stats.controller')

router.get('/standings/:tournamentId', getStandings)
router.get('/players/:tournamentId', getPlayerStats)
router.get('/teams/:tournamentId', getTeamStats)

module.exports = router