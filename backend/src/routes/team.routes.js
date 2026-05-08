const router = require('express').Router()
const {
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/team.controller')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

router.get('/', getTeams)
router.get('/:id', getTeam)
router.post('/', protect, restrictTo('admin'), createTeam)
router.put('/:id', protect, restrictTo('admin'), updateTeam)
router.delete('/:id', protect, restrictTo('admin'), deleteTeam)

module.exports = router