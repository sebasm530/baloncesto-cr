const router = require('express').Router()
const News = require('../models/News')
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

router.post('/:id/reaction', protect, async (req, res) => {
  try {
    const { type } = req.body
    const news = await News.findById(req.params.id)
    if (!news) return res.status(404).json({ message: 'Noticia no encontrada' })

    const userId = req.user._id
    const alreadyLiked = news.likes.some(id => id.toString() === userId.toString())
    const alreadyDisliked = news.dislikes.some(id => id.toString() === userId.toString())

    if (type === 'like') {
      if (alreadyLiked) {
        news.likes.pull(userId)
      } else {
        news.likes.push(userId)
        if (alreadyDisliked) news.dislikes.pull(userId)
      }
    } else if (type === 'dislike') {
      if (alreadyDisliked) {
        news.dislikes.pull(userId)
      } else {
        news.dislikes.push(userId)
        if (alreadyLiked) news.likes.pull(userId)
      }
    }

    await news.save()
    res.json({ likes: news.likes.length, dislikes: news.dislikes.length })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

module.exports = router