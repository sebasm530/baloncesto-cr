const News = require('../models/News')

exports.getNews = async (req, res) => {
  try {
    const filter = { published: true }
    if (req.query.category) filter.category = req.query.category
    if (req.query.team) filter.team = req.query.team
    if (req.query.tournament) filter.tournament = req.query.tournament

    const news = await News.find(filter)
      .populate('author', 'name')
      .populate('team', 'name shortName logo')
      .populate('tournament', 'name season')
      .sort({ createdAt: -1 })

    res.json({ results: news.length, news })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
      .populate('author', 'name')
      .populate('team', 'name shortName logo')
      .populate('tournament', 'name season')

    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }
    res.json({ news })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.createNews = async (req, res) => {
  try {
    const news = await News.create({ ...req.body, author: req.user._id })
    res.status(201).json({ message: 'Noticia creada correctamente', news })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateNews = async (req, res) => {
  try {
    const news = await News.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }
    res.json({ message: 'Noticia actualizada correctamente', news })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteNews = async (req, res) => {
  try {
    const news = await News.findByIdAndDelete(req.params.id)
    if (!news) {
      return res.status(404).json({ message: 'Noticia no encontrada' })
    }
    res.json({ message: 'Noticia eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}