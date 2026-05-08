const router = require('express').Router()
const {
  getGames,
  getGame,
  createGame,
  updateGame,
  deleteGame,
  registerResult
} = require('../controllers/game.controller')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

router.get('/', getGames)
router.get('/:id', getGame)
router.post('/', protect, restrictTo('admin'), createGame)
router.put('/:id', protect, restrictTo('admin'), updateGame)
router.delete('/:id', protect, restrictTo('admin'), deleteGame)
router.post('/:id/result', protect, restrictTo('admin', 'coach'), registerResult)

module.exports = router