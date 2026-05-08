const router = require('express').Router()
const {
  getPlayers,
  getPlayer,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/player.controller')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

router.get('/', getPlayers)
router.get('/:id', getPlayer)
router.post('/', protect, restrictTo('admin', 'coach'), createPlayer)
router.put('/:id', protect, restrictTo('admin', 'coach'), updatePlayer)
router.delete('/:id', protect, restrictTo('admin'), deletePlayer)

module.exports = router