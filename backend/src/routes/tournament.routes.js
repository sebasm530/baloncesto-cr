const router = require('express').Router()
const {
  getTournaments,
  getTournament,
  createTournament,
  updateTournament,
  deleteTournament
} = require('../controllers/tournament.controller')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

router.get('/', getTournaments)
router.get('/:id', getTournament)
router.post('/', protect, restrictTo('admin'), createTournament)
router.put('/:id', protect, restrictTo('admin'), updateTournament)
router.delete('/:id', protect, restrictTo('admin'), deleteTournament)

module.exports = router