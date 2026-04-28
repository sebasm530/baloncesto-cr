const router = require('express').Router()
const {
  getNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews
} = require('../controllers/news.controller')
const { protect, restrictTo } = require('../middlewares/auth.middleware')

router.get('/', getNews)
router.get('/:id', getNewsById)
router.post('/', protect, restrictTo('admin'), createNews)
router.put('/:id', protect, restrictTo('admin'), updateNews)
router.delete('/:id', protect, restrictTo('admin'), deleteNews)

module.exports = router